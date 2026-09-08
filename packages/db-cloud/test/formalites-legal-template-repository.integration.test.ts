import { createAuthService, type AuthService } from '@yuta/auth';
import type { TenantContext } from '@yuta/tenant';
import { and, eq, inArray } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import { createHash } from 'node:crypto';
import postgres from 'postgres';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { v7 as uuidv7, version as uuidVersion } from 'uuid';
import type { CloudDatabaseClient } from '../src/client';
import { FORMALITES_LEGAL_SOURCE_PROFILE as profile } from '../src/formalites-legal-template-domain';
import { createFormalitesLegalTemplateRepository as repository } from '../src/formalites-legal-template-repository';
import { readFormalitesPersonnelDraft } from '../src/formalites-personnel-draft-repository';
import * as schema from '../src/schema';
import {
  formalitesTemplateIdentities as identities,
  formalitesTemplateWorkingDrafts as drafts,
  formalitesTemplateVersions as versions,
} from '../src/schema/formalites-legal-templates';

const integration =
  process.env.CLOUD_DATABASE_URL &&
  process.env.YUTA_ALLOW_DATABASE_INTEGRATION_TESTS === 'true'
    ? describe
    : describe.skip;
type Transaction = Parameters<
  Parameters<CloudDatabaseClient['transaction']>[0]
>[0];

function deferred() {
  let resolve!: () => void;
  const promise = new Promise<void>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}

function internalAuth(
  role: 'YUTA_ADMIN' | 'YUTA_SUPPORT' | null = 'YUTA_ADMIN',
): AuthService {
  return createAuthService(
    {
      getIdentity: async () => ({
        providerUserId: 'synthetic-internal',
        email: 'synthetic@example.invalid',
      }),
    },
    {
      findByAuthProviderId: async () => ({
        id: '019c0000-0000-7000-8000-000000000001',
        email: 'synthetic@example.invalid',
        displayName: null,
        systemRole: role,
        status: 'ACTIVE',
      }),
    },
  );
}

// Test-only composition around real transactions; never exported production hooks.
function instrument(
  db: CloudDatabaseClient,
  wrap: (tx: Transaction) => Transaction,
  afterCommit?: () => void,
): CloudDatabaseClient {
  return new Proxy(db, {
    get(target, key) {
      if (key === 'transaction')
        return async (
          work: (tx: Transaction) => Promise<unknown>,
          config: Parameters<CloudDatabaseClient['transaction']>[1],
        ) => {
          const value = await target.transaction(
            (tx) => work(wrap(tx)),
            config,
          );
          afterCommit?.();
          return value;
        };
      const member: unknown = Reflect.get(target, key);
      return typeof member === 'function' ? member.bind(target) : member;
    },
  });
}

integration('Formalites legal-template real PostgreSQL acceptance', () => {
  let a: CloudDatabaseClient;
  let b: CloudDatabaseClient;
  let control: ReturnType<typeof postgres>;
  let observer: ReturnType<typeof postgres>;
  let pidA: number;
  let pidB: number;
  const owned: string[] = [];
  const source = (text = 'synthetic\r\nsource') => ({
    contentProfile: profile,
    sourceBytes: Buffer.from(text),
    applicability: {},
  });
  const apiA = () => repository(a, internalAuth());
  const apiB = () => repository(b, internalAuth());

  beforeAll(async () => {
    const url = new URL(process.env.CLOUD_DATABASE_URL!);
    // Necessary test guard, not a substitute for separately recorded ownership verification.
    if (
      process.env.NODE_ENV === 'production' ||
      !['127.0.0.1', 'localhost'].includes(url.hostname) ||
      ![
        '/formalites_template_clean',
        '/formalites_template_incremental',
      ].includes(url.pathname)
    )
      throw new Error('Unverified disposable test target');
    a = drizzle(postgres(url.toString(), { max: 1 }), { schema });
    b = drizzle(postgres(url.toString(), { max: 1 }), { schema });
    control = postgres(url.toString(), { max: 1 });
    observer = postgres(url.toString(), { max: 1 });
    const connectionA =
      await a.$client`select pg_backend_pid() as pid, current_database() as database, current_user as role, current_setting('server_version') as version`;
    const connectionB = await b.$client`select pg_backend_pid() as pid`;
    pidA = Number(connectionA[0]!.pid);
    pidB = Number(connectionB[0]!.pid);
    const other = await Promise.all([
      control`select pg_backend_pid() as pid`,
      observer`select pg_backend_pid() as pid`,
    ]);
    expect(
      new Set([pidA, pidB, ...other.map((rows) => Number(rows[0]!.pid))]).size,
    ).toBe(4);
    expect(connectionA[0]!.database).toBe(url.pathname.slice(1));
    expect(connectionA[0]!.role).toBe('formalites_qa');
    process.stdout.write(
      JSON.stringify({
        evidence: 'Q1/Q3 independent disposable connections',
        database: connectionA[0]!.database,
        role: connectionA[0]!.role,
        version: connectionA[0]!.version,
        pids: [pidA, pidB, ...other.map((rows) => rows[0]!.pid)],
      }) + '\n',
    );
  });

  afterAll(async () => {
    if (a && owned.length) {
      // Privileged cleanup of this suite's exact synthetic IDs, not normal domain methods.
      await a.delete(versions).where(inArray(versions.templateId, owned));
      await a.delete(drafts).where(inArray(drafts.templateId, owned));
      await a.delete(identities).where(inArray(identities.id, owned));
    }
    await Promise.all([
      a?.$client.end(),
      b?.$client.end(),
      control?.end(),
      observer?.end(),
    ]);
  });

  async function identity() {
    const row = await apiA().createIdentity({
      legalPurpose: 'synthetic purpose',
    });
    owned.push(row.id);
    expect(uuidVersion(row.id)).toBe(7);
    return row.id;
  }

  async function draft(text?: string) {
    const templateId = await identity();
    const row = await apiA().createDraft({ templateId, ...source(text) });
    return { templateId, draftId: row.id, expectedRevision: row.revision };
  }

  async function waitBlocked(pid: number) {
    for (let attempt = 0; attempt < 500; attempt += 1) {
      const rows =
        await observer`select wait_event_type, pg_blocking_pids(pid) as blockers from pg_stat_activity where pid=${pid}`;
      if (rows[0]?.wait_event_type === 'Lock' && rows[0]?.blockers.length)
        return;
      await new Promise((done) => setTimeout(done, 10));
    }
    throw new Error(`Expected real PostgreSQL lock wait for ${pid}`);
  }

  async function orderedRace<T, U>(
    templateId: string,
    first: () => Promise<T>,
    second: () => Promise<U>,
  ) {
    const locked = deferred();
    const release = deferred();
    const holder = control.begin(async (tx) => {
      await tx`select id from formalites_template_identities where id=${templateId} for update`;
      locked.resolve();
      await release.promise;
    });
    await locked.promise;
    try {
      const firstResult = first().then(
        (value) => ({ value }),
        (error: unknown) => ({ error }),
      );
      await waitBlocked(pidA);
      const secondResult = second().then(
        (value) => ({ value }),
        (error: unknown) => ({ error }),
      );
      await waitBlocked(pidB);
      release.resolve();
      await holder;
      return await Promise.all([firstResult, secondResult]);
    } finally {
      release.resolve();
      await holder;
    }
  }

  it('Q1: migrated schema has exact global columns, constraints and journal', async () => {
    const tables =
      await observer`select tablename from pg_tables where schemaname='public' and tablename like 'formalites_template_%' order by tablename`;
    expect(tables.map((row) => row.tablename)).toEqual([
      'formalites_template_identities',
      'formalites_template_versions',
      'formalites_template_working_drafts',
    ]);
    const columns =
      await observer`select table_name,column_name,is_nullable,data_type from information_schema.columns where table_schema='public' and table_name like 'formalites_template_%' order by table_name,ordinal_position`;
    expect(columns).toHaveLength(22);
    expect(
      columns
        .filter((row) => row.column_name === 'source_bytes')
        .every((row) => row.data_type === 'bytea'),
    ).toBe(true);
    expect(
      columns
        .filter((row) => row.is_nullable === 'YES')
        .map((row) => row.column_name),
    ).toEqual(['frozen_at']);
    expect(
      columns.some((row) =>
        /organization|establishment|actor|reviewer|evidence|ordinal|publication|qualification|retirement|metadata/.test(
          String(row.column_name),
        ),
      ),
    ).toBe(false);
    const checks =
      await observer`select conname,contype,confdeltype,pg_get_constraintdef(oid) as definition from pg_constraint where conrelid in ('formalites_template_identities'::regclass,'formalites_template_working_drafts'::regclass,'formalites_template_versions'::regclass)`;
    expect(checks.filter((row) => row.contype === 'f')).toHaveLength(3);
    expect(
      checks
        .filter((row) => row.contype === 'f')
        .every((row) => row.confdeltype === 'r'),
    ).toBe(true);
    expect(checks.filter((row) => row.contype === 'c')).toHaveLength(5);
    const active =
      await observer`select indexdef from pg_indexes where indexname='formalites_template_one_active_draft'`;
    expect(active[0]!.indexdef).toContain('UNIQUE INDEX');
    expect(active[0]!.indexdef).toContain('WHERE (frozen_at IS NULL)');
    const journal =
      await observer`select count(*)::int as count from drizzle.__drizzle_migrations`;
    expect(journal[0]!.count).toBe(21);
  });

  it('Q2/Q7/Q9/Q11: real draft/edit/freeze/history preserves bytes and immutable applicability', async () => {
    const templateId = await identity();
    expect(await apiB().readHistory({ templateId })).toEqual([]);
    const first = await apiA().createDraft({
      templateId,
      ...source(' a\0é\uFEFF\r\n\t\n '),
    });
    expect(uuidVersion(first.id)).toBe(7);
    expect(first.sourceBytes).toEqual(Buffer.from(' a\0é\uFEFF\n\t\n '));
    const changed = await apiA().editDraft({
      templateId,
      draftId: first.id,
      expectedRevision: 1,
      ...source(' e\u0301\0\t\r\n\n '),
      applicability: {
        bindingConditions: {
          kind: 'assertions',
          values: [' synthetic B ', 'synthetic A'],
        },
      },
    });
    expect(changed.revision).toBe(2);
    const locator = { templateId, draftId: first.id, expectedRevision: 2 };
    const frozen = await apiA().freezeDraft(locator);
    expect(frozen.replayed).toBe(false);
    expect(uuidVersion(frozen.version.id)).toBe(7);
    const independent = await apiB().readVersion({
      templateId,
      versionId: frozen.version.id,
    });
    expect(independent).toEqual(frozen.version);
    expect(independent.sourceBytes).toEqual(Buffer.from(' e\u0301\0\t\n\n '));
    expect(independent.contentChecksum).toBe(
      createHash('sha256').update(independent.sourceBytes).digest('hex'),
    );
    expect(Object.keys(independent.applicability)).toHaveLength(9);
    expect(independent.applicability.bindingConditions).toEqual({
      kind: 'assertions',
      values: [' synthetic B ', 'synthetic A'],
    });
    independent.sourceBytes.fill(0);
    expect(
      await apiB().readVersion({ templateId, versionId: frozen.version.id }),
    ).toEqual(frozen.version);
    await expect(
      apiA().editDraft({ ...locator, ...source('replacement') }),
    ).rejects.toMatchObject({ code: 'DRAFT_FROZEN' });
    const next = await apiA().createDraft({
      templateId,
      ...source(' e\u0301\0\t\n\n '),
      applicability: {
        jurisdiction: {
          kind: 'assertions',
          values: ['different synthetic scope'],
        },
      },
    });
    const second = await apiB().freezeDraft({
      templateId,
      draftId: next.id,
      expectedRevision: 1,
    });
    expect(second.version.id).not.toBe(frozen.version.id);
    expect(second.version.contentChecksum).toBe(frozen.version.contentChecksum);
    expect(second.version.applicability).not.toEqual(
      frozen.version.applicability,
    );
    expect((await apiA().freezeDraft(locator)).version).toEqual(frozen.version);
    expect(await apiB().readHistory({ templateId })).toEqual([
      frozen.version,
      second.version,
    ]);
    expect((await apiB().readIdentity({ templateId })).legalPurpose).toBe(
      'synthetic purpose',
    );
  });

  it('Q3: independent competing creation commits at most one active draft', async () => {
    const templateId = await identity();
    const [first, second] = await orderedRace(
      templateId,
      () => apiA().createDraft({ templateId, ...source() }),
      () => apiB().createDraft({ templateId, ...source('other') }),
    );
    expect(first).toHaveProperty('value');
    expect(second).toMatchObject({ error: { code: 'ACTIVE_DRAFT_EXISTS' } });
    const rows =
      await observer`select count(*)::int as count from formalites_template_working_drafts where template_id=${templateId} and frozen_at is null`;
    expect(rows[0]!.count).toBe(1);
  });

  it('Q3/Q4: edit wins; stale edit/freeze cannot overwrite or mix snapshots', async () => {
    const locator = await draft();
    const [first, second] = await orderedRace(
      locator.templateId,
      () =>
        apiA().editDraft({
          ...locator,
          ...source('new'),
          applicability: {
            jurisdiction: { kind: 'assertions', values: ['new scope'] },
          },
        }),
      () => apiB().freezeDraft(locator),
    );
    expect(first).toHaveProperty('value');
    expect(second).toMatchObject({ error: { code: 'STALE_DRAFT_REVISION' } });
    await expect(
      apiB().editDraft({ ...locator, ...source('stale') }),
    ).rejects.toMatchObject({ code: 'STALE_DRAFT_REVISION' });
    expect(
      await apiA().readHistory({ templateId: locator.templateId }),
    ).toEqual([]);
    const result = await apiB().freezeDraft({
      ...locator,
      expectedRevision: 2,
    });
    expect(result.version.sourceBytes.toString()).toBe('new');
    expect(result.version.applicability.jurisdiction).toEqual({
      kind: 'assertions',
      values: ['new scope'],
    });
  });

  it('Q4: freeze wins; blocked competing edit cannot mutate frozen binding', async () => {
    const locator = await draft('original');
    const [first, second] = await orderedRace(
      locator.templateId,
      () => apiA().freezeDraft(locator),
      () => apiB().editDraft({ ...locator, ...source('later') }),
    );
    expect(first).toHaveProperty('value');
    expect(second).toMatchObject({ error: { code: 'DRAFT_FROZEN' } });
    const history = await apiB().readHistory({
      templateId: locator.templateId,
    });
    expect(history).toHaveLength(1);
    expect(history[0]!.sourceBytes.toString()).toBe('original');
  });

  it('Q5: independent concurrent exact-revision freezes return the same version', async () => {
    const locator = await draft();
    const [first, second] = await orderedRace(
      locator.templateId,
      () => apiA().freezeDraft(locator),
      () => apiB().freezeDraft(locator),
    );
    expect(first).toHaveProperty('value');
    expect(second).toHaveProperty('value');
    if (!('value' in first) || !('value' in second))
      throw new Error('Expected two successful freeze results');
    expect(first.value.replayed).toBe(false);
    expect(second.value.replayed).toBe(true);
    expect(first.value.version).toEqual(second.value.version);
    expect(
      await apiB().readHistory({ templateId: locator.templateId }),
    ).toHaveLength(1);
  });

  it('Q5: lost response after a real commit propagates error, exact retry resolves durable result', async () => {
    const locator = await draft();
    const loss = new Error(
      'Synthetic response lost after commit; outcome unknown to caller',
    );
    const failing = repository(
      instrument(
        a,
        (tx) => tx,
        () => {
          throw loss;
        },
      ),
      internalAuth(),
    );
    await expect(failing.freezeDraft(locator)).rejects.toBe(loss);
    const retained = await apiB().readHistory({
      templateId: locator.templateId,
    });
    expect(retained).toHaveLength(1);
    expect(await apiB().freezeDraft(locator)).toEqual({
      version: retained[0],
      replayed: true,
    });
    await apiA().createDraft({
      templateId: locator.templateId,
      ...source('new active'),
    });
    expect(await apiA().freezeDraft(locator)).toEqual({
      version: retained[0],
      replayed: true,
    });
  });

  it('Q6: injected failure after real version insert rolls back both version and close', async () => {
    const locator = await draft();
    let insertedInsideTransaction = false;
    const failure = new Error('Synthetic failure before draft close');
    const wrapped = new Proxy(a, {
      get(target, key) {
        if (key === 'transaction')
          return (
            work: (tx: Transaction) => Promise<unknown>,
            config: Parameters<CloudDatabaseClient['transaction']>[1],
          ) =>
            target.transaction(async (tx) => {
              const wrappedTx = new Proxy(tx, {
                get(txTarget, txKey) {
                  if (txKey === 'update')
                    return () => {
                      throw failure;
                    };
                  const member: unknown = Reflect.get(txTarget, txKey);
                  return typeof member === 'function'
                    ? member.bind(txTarget)
                    : member;
                },
              });
              try {
                return await work(wrappedTx);
              } catch (error) {
                const inserted = await tx
                  .select()
                  .from(versions)
                  .where(eq(versions.templateId, locator.templateId));
                insertedInsideTransaction = inserted.length === 1;
                throw error;
              }
            }, config);
        const member: unknown = Reflect.get(target, key);
        return typeof member === 'function' ? member.bind(target) : member;
      },
    });
    await expect(
      repository(wrapped, internalAuth()).freezeDraft(locator),
    ).rejects.toBe(failure);
    expect(insertedInsideTransaction).toBe(true);
    expect(
      await apiB().readHistory({ templateId: locator.templateId }),
    ).toEqual([]);
    expect(
      await apiB().readDraft({
        templateId: locator.templateId,
        draftId: locator.draftId,
      }),
    ).toMatchObject({ revision: 1, frozenAt: null });
  });

  it.each([
    'bytes',
    'checksum',
    'profile',
    'applicability',
    'draft-binding',
  ] as const)(
    'Q8: full reads/replay fail closed for controlled %s corruption',
    async (corruption) => {
      const locator = await draft('unchanged');
      const frozen = await apiA().freezeDraft(locator);
      if (corruption === 'bytes')
        await a
          .update(versions)
          .set({ sourceBytes: Buffer.from('corrupted') })
          .where(eq(versions.id, frozen.version.id));
      if (corruption === 'checksum')
        await a
          .update(versions)
          .set({ contentChecksum: '0'.repeat(64) })
          .where(eq(versions.id, frozen.version.id));
      if (corruption === 'profile')
        await a
          .update(versions)
          .set({ contentProfile: 'unapproved-future-profile' })
          .where(eq(versions.id, frozen.version.id));
      if (corruption === 'applicability')
        await a
          .update(versions)
          .set({ applicability: {} })
          .where(eq(versions.id, frozen.version.id));
      if (corruption === 'draft-binding')
        await a
          .update(drafts)
          .set({ sourceBytes: Buffer.from('corrupted draft') })
          .where(eq(drafts.id, locator.draftId));
      if (corruption !== 'draft-binding')
        await expect(
          apiB().readVersion({
            templateId: locator.templateId,
            versionId: frozen.version.id,
          }),
        ).rejects.toMatchObject({ code: 'INTEGRITY_FAILURE' });
      await expect(apiB().freezeDraft(locator)).rejects.toMatchObject({
        code: 'INTEGRITY_FAILURE',
      });
    },
  );

  it('Q7/Q9: invalid source/profile/reference/evidence input never persists a draft', async () => {
    const templateId = await identity();
    for (const sourceBytes of [
      Buffer.from([0xc0, 0xaf]),
      Buffer.from([0xef, 0xbb, 0xbf, 65]),
    ])
      await expect(
        apiA().createDraft({ templateId, ...source(), sourceBytes }),
      ).rejects.toThrow();
    await expect(
      apiA().createDraft({ templateId, ...source(), contentProfile: 'future' }),
    ).rejects.toThrow();
    await expect(
      apiA().createDraft({
        templateId,
        ...source(),
        applicability: {
          jurisdiction: {
            kind: 'canonicalReferences',
            values: [{ owner: 'unapproved', referenceId: 'synthetic' }],
          },
        },
      }),
    ).rejects.toMatchObject({ code: 'INVALID_APPLICABILITY' });
    await expect(
      apiA().createDraft({
        templateId,
        ...source(),
        applicability: { evidenceUrl: 'private' },
      }),
    ).rejects.toThrow();
    expect(
      await a.select().from(drafts).where(eq(drafts.templateId, templateId)),
    ).toEqual([]);
  });

  it('Q10: denied actors and system context do not acquire tenant authority', async () => {
    const locator = await draft();
    for (const role of ['YUTA_SUPPORT', null] as const) {
      await expect(
        repository(a, internalAuth(role)).readDraft({
          templateId: locator.templateId,
          draftId: locator.draftId,
        }),
      ).rejects.toThrow();
      await expect(
        repository(a, internalAuth(role)).freezeDraft(locator),
      ).rejects.toThrow();
    }
    const system =
      await internalAuth().requireFormalitesTemplateSystemOperation(
        'formalites.template.read',
      );
    await expect(
      readFormalitesPersonnelDraft(
        a,
        system as unknown as TenantContext,
        uuidv7(),
      ),
    ).rejects.toThrow();
    const wrongTemplate = await identity();
    await expect(
      apiB().readDraft({ templateId: wrongTemplate, draftId: locator.draftId }),
    ).rejects.toMatchObject({ code: 'NOT_FOUND' });
    await expect(
      apiB().freezeDraft({ ...locator, templateId: wrongTemplate }),
    ).rejects.toMatchObject({ code: 'NOT_FOUND' });
  });

  it('Q1/Q3: durable database constraints reject duplicate active drafts, invalid revisions and cross-identity versions', async () => {
    const locator = await draft();
    const row = (
      await a.select().from(drafts).where(eq(drafts.id, locator.draftId))
    )[0]!;
    await expect(
      a.insert(drafts).values({ ...row, id: uuidv7() }),
    ).rejects.toThrow();
    await expect(
      a.update(drafts).set({ revision: 0 }).where(eq(drafts.id, row.id)),
    ).rejects.toThrow();
    await a
      .update(drafts)
      .set({ revision: 2147483647 })
      .where(eq(drafts.id, row.id));
    await expect(
      apiB().editDraft({
        ...locator,
        expectedRevision: 2147483647,
        ...source(),
      }),
    ).rejects.toMatchObject({ code: 'INTEGRITY_FAILURE' });
    await a.update(drafts).set({ revision: 1 }).where(eq(drafts.id, row.id));
    const frozen = await apiA().freezeDraft(locator);
    const another = await identity();
    await expect(
      a
        .insert(versions)
        .values({ ...frozen.version, id: uuidv7(), templateId: another }),
    ).rejects.toThrow();
    await expect(
      a.insert(versions).values({ ...frozen.version, id: uuidv7() }),
    ).rejects.toThrow();
    await expect(
      a
        .update(versions)
        .set({ contentChecksum: 'INVALID' })
        .where(eq(versions.id, frozen.version.id)),
    ).rejects.toThrow();
    await expect(
      a
        .update(versions)
        .set({ checksumAlgorithm: 'other' })
        .where(eq(versions.id, frozen.version.id)),
    ).rejects.toThrow();
    await expect(
      a.delete(identities).where(eq(identities.id, locator.templateId)),
    ).rejects.toThrow();
    await expect(
      a
        .delete(drafts)
        .where(
          and(
            eq(drafts.templateId, locator.templateId),
            eq(drafts.id, locator.draftId),
          ),
        ),
    ).rejects.toThrow();
  });
});
