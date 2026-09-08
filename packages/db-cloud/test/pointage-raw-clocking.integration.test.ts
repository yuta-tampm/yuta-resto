import { createHash, randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { Sql, TransactionSql } from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { sql } from 'drizzle-orm';
import { assertPointageRawDatabaseBoundary } from '../src/pointage-raw-clocking-repository';
import { createPointageRawClockingRepository } from '../src/pointage-raw-clocking-repository';
import { createPointageRepository } from '../src/pointage-repository';
import { createFormalitesPersonnelDraft } from '../src/formalites-personnel-draft-repository';
import * as schema from '../src/schema';
import { v7 as uuidv7 } from 'uuid';
import {
  openPointageTestDatabase,
  pointageDisposableWriterUrl,
} from './helpers/pointage-raw-clocking-test-database';

const integration =
  process.env.YUTA_POINTAGE_SYNTHETIC_TEST_MODE === 'true'
    ? describe
    : describe.skip;
const signature = 'public.pointage_raw_lock_dossier(uuid,uuid,uuid)';

integration('D4a/D4b actual restricted-writer row locking', () => {
  let admin: Sql;
  let writer: Sql;
  const organization = randomUUID();
  const establishment = randomUUID();
  const dossier = randomUUID();
  const tuple = [organization, establishment, dossier];
  const helperCall =
    'select public.pointage_raw_lock_dossier($1::uuid,$2::uuid,$3::uuid) as result';
  let sourceBefore: unknown;
  const credential = uuidv7();
  let continuation: string;
  const scope = {
    organizationId: organization,
    establishmentId: establishment,
    personnelDossierId: dossier,
  };

  async function sourceRows() {
    return {
      organization:
        await admin`select * from public.organizations where id=${organization}`,
      establishment:
        await admin`select * from public.establishments where organization_id=${organization} and id=${establishment}`,
      dossier:
        await admin`select * from public.personnel_employee_dossiers where organization_id=${organization} and establishment_id=${establishment} and id=${dossier}`,
    };
  }

  beforeAll(async () => {
    admin = await openPointageTestDatabase(
      process.env,
      process.env.CLOUD_DATABASE_URL!,
    );
    writer = await openPointageTestDatabase(
      process.env,
      pointageDisposableWriterUrl(process.env.CLOUD_DATABASE_URL!),
    );
    expect(await writer`select session_user, current_user`).toEqual([
      {
        session_user: 'yuta_pointage_raw_writer',
        current_user: 'yuta_pointage_raw_writer',
      },
    ]);
    await assertPointageRawDatabaseBoundary(drizzle(writer));
    const [helper] = await admin`
      select p.oid, p.prosrc, p.prosecdef, p.provolatile, p.proparallel,
        p.proisstrict, p.proconfig, p.pronargdefaults, p.provariadic,
        pg_get_userbyid(p.proowner) as owner, l.lanname,
        p.prorettype::regtype::text as return_type
      from pg_proc p join pg_language l on l.oid=p.prolang
      where p.oid=to_regprocedure(${signature})
    `;
    expect(helper).toMatchObject({
      owner: 'yuta_pointage_raw_lock_owner',
      lanname: 'plpgsql',
      return_type: 'void',
      prosecdef: true,
      provolatile: 'v',
      proparallel: 'u',
      proisstrict: false,
      proconfig: ['search_path=pg_catalog, pg_temp'],
      pronargdefaults: 0,
      provariadic: 0,
    });
    const candidate = readFileSync(
      'drizzle/0021_abandoned_black_queen.sql',
      'utf8',
    );
    expect(helper?.prosrc).toBe(
      candidate.split('AS $lock$')[1]?.split('$lock$;')[0],
    );
    expect(createHash('sha256').update(helper!.prosrc).digest('hex')).toBe(
      '293dee4dfc8787ea891fe370668425dc97918b4412f62da6eb0f692e7521fe24',
    );
    const roles = await admin`
      select rolname, rolcanlogin, rolsuper, rolcreatedb, rolcreaterole,
        rolreplication, rolbypassrls, rolinherit
      from pg_roles where rolname in ('yuta_pointage_raw_writer','yuta_pointage_raw_lock_owner')
      order by rolname
    `;
    expect(roles).toEqual([
      {
        rolname: 'yuta_pointage_raw_lock_owner',
        rolcanlogin: false,
        rolsuper: false,
        rolcreatedb: false,
        rolcreaterole: false,
        rolreplication: false,
        rolbypassrls: false,
        rolinherit: false,
      },
      {
        rolname: 'yuta_pointage_raw_writer',
        rolcanlogin: true,
        rolsuper: false,
        rolcreatedb: false,
        rolcreaterole: false,
        rolreplication: false,
        rolbypassrls: false,
        rolinherit: false,
      },
    ]);
    expect(
      await admin`
      select m.* from pg_auth_members m
      where m.member in (select oid from pg_roles where rolname in ('yuta_pointage_raw_writer','yuta_pointage_raw_lock_owner'))
         or m.roleid in (select oid from pg_roles where rolname in ('yuta_pointage_raw_writer','yuta_pointage_raw_lock_owner'))
    `,
    ).toHaveLength(0);
    expect(
      await admin`
      select pg_get_userbyid(a.grantee) as grantee, a.privilege_type, a.is_grantable
      from pg_proc p cross join lateral aclexplode(p.proacl) a
      where p.oid=to_regprocedure(${signature}) order by grantee
    `,
    ).toEqual([
      {
        grantee: 'yuta_pointage_raw_lock_owner',
        privilege_type: 'EXECUTE',
        is_grantable: false,
      },
      {
        grantee: 'yuta_pointage_raw_writer',
        privilege_type: 'EXECUTE',
        is_grantable: false,
      },
    ]);
    // Synthetic source fixtures only, after actual target/migration/role/helper
    // checks. No credential, continuation, receipt or attendance is created.
    await admin.begin(async (tx) => {
      await tx`insert into public.organizations(id,name,slug) values(${organization},'Synthetic Pointage lock proof',${'test-' + organization})`;
      await tx`insert into public.establishments(id,organization_id,name,slug) values(${establishment},${organization},'Synthetic Pointage lock proof',${'test-' + establishment})`;
      await tx`insert into public.personnel_employee_dossiers(id,organization_id,establishment_id,given_names,family_name,position,qualification,employment_term_type,work_time_category,entry_date) values(${dossier},${organization},${establishment},'Synthetic','Lock proof','Test','Test','indefinite','full_time','2020-01-01')`;
    });
    sourceBefore = await sourceRows();
  });

  afterAll(async () => {
    // Keep the disposable evidence; do not delete source rows or attendance.
    await Promise.all([admin?.end(), writer?.end()]);
  });

  it('regresses the exact non-null missing tuple without enum/text error', async () => {
    await expect(
      writer.begin((tx) =>
        tx.unsafe(helperCall, [randomUUID(), randomUUID(), randomUUID()]),
      ),
    ).rejects.toMatchObject({
      code: 'P0001',
      message: 'POINTAGE_LOCK_UNAVAILABLE',
    });
  });

  it('returns only void after all three scoped locks and changes no source values', async () => {
    await writer.begin(async (tx) => {
      const result = await tx.unsafe(helperCall, tuple);
      expect(result).toEqual([{ result: '' }]);
    });
    expect(await sourceRows()).toEqual(sourceBefore);
  });

  it('denies direct source row locks and source writes for the actual writer', async () => {
    for (const statement of [
      'select id from public.organizations where id=$1 for share',
      'select id from public.establishments where id=$2 for share',
      'select id from public.personnel_employee_dossiers where id=$3 for update',
      'update public.organizations set id=id where id=$1',
      'update public.establishments set id=id where id=$2',
      'update public.personnel_employee_dossiers set id=id where id=$3',
    ]) {
      // Use exactly the parameters referenced by each static statement.
      const position = Number(/\$(\d)/u.exec(statement)![1]) - 1;
      await expect(
        writer.begin((tx) =>
          tx.unsafe(statement.replace(/\$\d/gu, '$1'), [tuple[position]!]),
        ),
      ).rejects.toMatchObject({ code: '42501' });
    }
    expect(await sourceRows()).toEqual(sourceBefore);
  });

  for (const ending of ['commit', 'rollback'] as const) {
    it(`holds each source lock after helper return until outer ${ending}`, async () => {
      const rollback = new Error('Synthetic rollback probe');
      const operation = writer.begin(async (tx) => {
        await tx.unsafe(helperCall, tuple);
        for (const [table, id] of [
          ['organizations', organization],
          ['establishments', establishment],
          ['personnel_employee_dossiers', dossier],
        ]) {
          await expect(
            admin.begin((other) =>
              other.unsafe(
                `select id from public.${table} where id=$1 for update nowait`,
                [id!],
              ),
            ),
          ).rejects.toMatchObject({ code: '55P03' });
        }
        if (ending === 'rollback') throw rollback;
      });
      if (ending === 'rollback') await expect(operation).rejects.toBe(rollback);
      else await operation;
      await admin.begin(async (tx) => {
        await tx`select id from public.organizations where id=${organization} for update nowait`;
        await tx`select id from public.establishments where id=${establishment} for update nowait`;
        await tx`select id from public.personnel_employee_dossiers where id=${dossier} for update nowait`;
      });
      expect(await sourceRows()).toEqual(sourceBefore);
    });
  }

  it('rejects a non-writer role before the helper executes', async () => {
    await expect(
      admin.begin(async (tx) => {
        await tx`set local role pg_read_all_data`;
        await tx.unsafe(helperCall, tuple);
      }),
    ).rejects.toMatchObject({ code: '42501' });
  });

  it('denies missing/null/mixed tuples and holds no partial locks after rollback', async () => {
    for (const attempt of [
      [null, establishment, dossier],
      [organization, randomUUID(), dossier],
      [organization, establishment, randomUUID()],
    ]) {
      await expect(
        writer.begin((tx) => tx.unsafe(helperCall, attempt)),
      ).rejects.toMatchObject({
        code: 'P0001',
        message: 'POINTAGE_LOCK_UNAVAILABLE',
      });
    }
    await admin.begin(
      (tx) =>
        tx`select id from public.organizations where id=${organization} for update nowait`,
    );
    expect(await sourceRows()).toEqual(sourceBefore);
  });

  it('keeps attendance, receipts and continuation empty during helper proof', async () => {
    expect(
      await admin`select (select count(*)::int from public.pointage_raw_events where organization_id=${organization}) as raw,(select count(*)::int from public.pointage_raw_command_receipts where organization_id=${organization}) as receipts,(select count(*)::int from public.pointage_continuations where organization_id=${organization}) as continuations`,
    ).toEqual([{ raw: 0, receipts: 0, continuations: 0 }]);
  });

  it('F5: creates a scoped continuation through the bounded repository after lock admission', async () => {
    // Binding-only synthetic credential material; never a usable employee PIN.
    await admin`insert into public.pointage_employee_credentials
      (id,organization_id,establishment_id,personnel_dossier_id,credential_version,
       credential_format_version,algorithm_version,key_version,lookup_digest,salt,verifier,issued_at)
      values(${credential},${organization},${establishment},${dossier},1,1,'scrypt-v1',1,
        ${createHash('sha256').update(credential).digest('hex')},'synthetic-binding-only','synthetic-binding-only',clock_timestamp())`;
    const repository = createPointageRawClockingRepository(
      drizzle(writer, { schema }),
    );
    const row = await repository.withDossierTransaction(
      scope,
      async (operations, current) => {
        expect(current).toMatchObject({
          id: dossier,
          entryDate: '2020-01-01',
          departureDate: null,
          timezone: 'Europe/Paris',
        });
        expect(await operations.findCurrentCredential()).toEqual({
          id: credential,
          credentialVersion: 1,
        });
        return operations.insertContinuation({
          tokenDigest: createHash('sha256').update(randomUUID()).digest('hex'),
          credentialId: credential,
          credentialVersion: 1,
        });
      },
    );
    expect(row).not.toBeNull();
    continuation = row!.id;
    expect(
      await writer`select extract(epoch from absolute_expires_at-issued_at)::int as absolute,extract(epoch from idle_expires_at-issued_at)::int as idle,ended_at from public.pointage_continuations where organization_id=${organization} and establishment_id=${establishment} and personnel_dossier_id=${dossier} and id=${continuation}`,
    ).toEqual([{ absolute: 120, idle: 60, ended_at: null }]);
  });

  it('F5: rejects every immutable column by writer privilege and by the actual trigger', async () => {
    const changes: [string, string][] = [
      ['id', "'00000000-0000-7000-8000-000000000001'::uuid"],
      ['organization_id', "'00000000-0000-7000-8000-000000000001'::uuid"],
      ['establishment_id', "'00000000-0000-7000-8000-000000000001'::uuid"],
      ['personnel_dossier_id', "'00000000-0000-7000-8000-000000000001'::uuid"],
      ['token_digest', "repeat('a',64)"],
      ['credential_id', "'00000000-0000-7000-8000-000000000001'::uuid"],
      ['credential_version', '2'],
      ['issued_at', "issued_at+interval '1 second'"],
      ['absolute_expires_at', "absolute_expires_at+interval '1 second'"],
    ];
    for (const [column, expression] of changes) {
      const statement = `update public.pointage_continuations set ${column}=${expression} where organization_id=$1 and establishment_id=$2 and personnel_dossier_id=$3 and id=$4`;
      await expect(
        writer.begin((tx) => tx.unsafe(statement, [...tuple, continuation])),
      ).rejects.toMatchObject({ code: '42501' });
      await expect(
        admin.begin((tx) => tx.unsafe(statement, [...tuple, continuation])),
      ).rejects.toMatchObject({
        code: '23514',
        message: 'POINTAGE_CONTINUATION_IMMUTABLE',
      });
    }
  });

  it('F5: bounds idle extension and refuses decrease, NULL and cap bypass', async () => {
    const repository = createPointageRawClockingRepository(
      drizzle(writer, { schema }),
    );
    const touched = await repository.withDossierTransaction(
      scope,
      async (ops) => {
        expect(await ops.lockContinuation(continuation)).not.toBeNull();
        return ops.touchContinuationIdle(continuation);
      },
    );
    expect(touched).not.toBeNull();
    for (const expression of [
      "idle_expires_at-interval '1 second'",
      'null',
      "absolute_expires_at+interval '1 second'",
      "least(absolute_expires_at,clock_timestamp()+interval '90 seconds')",
    ]) {
      await expect(
        writer.begin((tx) =>
          tx.unsafe(
            `update public.pointage_continuations set idle_expires_at=${expression} where organization_id=$1 and establishment_id=$2 and personnel_dossier_id=$3 and id=$4`,
            [...tuple, continuation],
          ),
        ),
      ).rejects.toMatchObject({ code: '23514' });
    }
  });

  it('F5: end is one-way, DB-timed and idempotent, never a revive', async () => {
    const repository = createPointageRawClockingRepository(
      drizzle(writer, { schema }),
    );
    const ended = await repository.withDossierTransaction(scope, (ops) =>
      ops.endOwnContinuation(continuation),
    );
    expect(ended?.endedAt).not.toBeNull();
    const repeated = await repository.withDossierTransaction(scope, (ops) =>
      ops.endOwnContinuation(continuation),
    );
    expect(repeated?.endedAt).toBe(ended?.endedAt);
    await expect(
      writer.begin(
        (tx) =>
          tx`update public.pointage_continuations set ended_at=null where organization_id=${organization} and establishment_id=${establishment} and personnel_dossier_id=${dossier} and id=${continuation}`,
      ),
    ).rejects.toMatchObject({
      code: '23514',
      message: 'POINTAGE_CONTINUATION_ENDED',
    });
    expect(
      await repository.withDossierTransaction(scope, (ops) =>
        ops.touchContinuationIdle(continuation),
      ),
    ).toBeNull();
  });

  it('F3/F4: raw-only and receipt-only COMMIT fail; a scoped synthetic pair commits once', async () => {
    // Only this later F3 proof creates synthetic raw data, after the clean
    // migration, exact role/catalog admission and actual helper lock proofs.
    const raw = (tx: TransactionSql, id: string) => tx`
      insert into public.pointage_raw_events(id,organization_id,establishment_id,personnel_dossier_id,
        ordinal,kind,accepted_at,timezone_name,utc_offset_seconds,business_date)
      values(${id},${organization},${establishment},${dossier},999,'CLOCK_IN',
        '1900-01-01','browser-not-authority',999999,'1900-01-01') returning *
    `;
    const receipt = (tx: TransactionSql, event: string) => tx`
      insert into public.pointage_raw_command_receipts(organization_id,establishment_id,personnel_dossier_id,request_id,event_id,intent_version,intent_fingerprint)
      values(${organization},${establishment},${dossier},${randomUUID()},${event},1,${'a'.repeat(64)})
    `;
    await expect(writer.begin((tx) => raw(tx, uuidv7()))).rejects.toMatchObject(
      { code: '23503' },
    );
    await expect(
      writer.begin((tx) => receipt(tx, uuidv7())),
    ).rejects.toMatchObject({ code: '23503' });
    const id = uuidv7();
    await writer.begin(async (tx) => {
      const [event] = await raw(tx, id);
      expect(event).toMatchObject({
        ordinal: '1',
        kind: 'CLOCK_IN',
        timezone_name: 'Europe/Paris',
      });
      expect(String(event!.accepted_at)).not.toMatch(/^1900/u);
      const [calendar] = await tx`select utc_offset_seconds=extract(epoch from
        (accepted_at at time zone timezone_name)-(accepted_at at time zone 'UTC'))::int
        as offset_matches from public.pointage_raw_events where organization_id=${organization}
          and establishment_id=${establishment} and personnel_dossier_id=${dossier} and id=${id}`;
      expect(calendar?.offset_matches).toBe(true);
      await receipt(tx, id);
    });
    expect(
      await writer`select count(*)::int as count from public.pointage_raw_events where organization_id=${organization} and establishment_id=${establishment} and personnel_dossier_id=${dossier}`,
    ).toEqual([{ count: 1 }]);
    await expect(writer.begin((tx) => raw(tx, uuidv7()))).rejects.toMatchObject(
      { code: '23514', message: 'POINTAGE_TRANSITION_CONFLICT' },
    );
  });

  it('F3: rejects raw/receipt mutation and rolls back every attempted SQL probe', async () => {
    for (const table of [
      'pointage_raw_events',
      'pointage_raw_command_receipts',
    ]) {
      for (const statement of [
        `update public.${table} set organization_id=organization_id where organization_id=$1`,
        `delete from public.${table} where organization_id=$1`,
        'truncate public.pointage_raw_events, public.pointage_raw_command_receipts',
      ]) {
        const params = statement.includes('$1') ? [organization] : [];
        await expect(
          writer.begin((tx) => tx.unsafe(statement, params)),
        ).rejects.toMatchObject({ code: '42501' });
        await expect(
          admin.begin(async (tx) => {
            await tx.unsafe(statement, params);
            throw new Error(
              'Unexpected mutation accepted; entire probe rolled back.',
            );
          }),
        ).rejects.toMatchObject({
          code: '23514',
          message: 'POINTAGE_IMMUTABLE_EVIDENCE',
        });
      }
    }
  });

  it('F5: an actually expired idle deadline cannot be revived', async () => {
    const repository = createPointageRawClockingRepository(
      drizzle(writer, { schema }),
    );
    const fresh = await repository.withDossierTransaction(scope, (ops) =>
      ops.insertContinuation({
        tokenDigest: createHash('sha256').update(randomUUID()).digest('hex'),
        credentialId: credential,
        credentialVersion: 1,
      }),
    );
    expect(fresh).not.toBeNull();
    // Real elapsed time, not a replaced PostgreSQL clock or altered binding.
    await new Promise((resolve) => setTimeout(resolve, 30_500));
    await new Promise((resolve) => setTimeout(resolve, 30_500));
    expect(
      await repository.withDossierTransaction(scope, (ops) =>
        ops.touchContinuationIdle(fresh!.id),
      ),
    ).toBeNull();
    await expect(
      writer.begin(
        (tx) =>
          tx`update public.pointage_continuations set idle_expires_at=clock_timestamp()+interval '30 seconds' where organization_id=${organization} and establishment_id=${establishment} and personnel_dossier_id=${dossier} and id=${fresh!.id}`,
      ),
    ).rejects.toMatchObject({
      code: '23514',
      message: 'POINTAGE_CONTINUATION_EXPIRED',
    });
  }, 75_000);

  it('F8: admission rejects actual ACL/search-path/body changes and never repairs them', async () => {
    // Deliberate, reversible misconfiguration fixtures on the separate verified
    // upgrade database, after its positive migration proof. This is not a fix
    // for a failed migration; the exact prior catalog state is restored below.
    const target = new URL(process.env.CLOUD_DATABASE_URL!);
    target.pathname = '/yuta_pointage_raw_clocking_test_upgrade20260908b';
    const fixtureAdmin = await openPointageTestDatabase(
      process.env,
      target.toString(),
    );
    const fixtureWriter = await openPointageTestDatabase(
      process.env,
      pointageDisposableWriterUrl(target.toString()),
    );
    try {
      const actual = drizzle(fixtureWriter);
      await assertPointageRawDatabaseBoundary(actual);
      await expect(
        assertPointageRawDatabaseBoundary(drizzle(fixtureAdmin)),
      ).rejects.toThrow('Pointage scope is unavailable.');
      const [saved] =
        await fixtureAdmin`select pg_get_functiondef(to_regprocedure(${signature})) as definition`;
      const mutations = [
        {
          apply: 'alter role yuta_pointage_raw_lock_owner inherit',
          restore: 'alter role yuta_pointage_raw_lock_owner noinherit',
        },
        {
          apply:
            'revoke select (entry_date) on public.personnel_employee_dossiers from yuta_pointage_raw_writer',
          restore:
            'grant select (entry_date) on public.personnel_employee_dossiers to yuta_pointage_raw_writer',
        },
        {
          apply:
            'grant select on public.pointage_raw_events to yuta_pointage_raw_writer with grant option',
          restore:
            'revoke grant option for select on public.pointage_raw_events from yuta_pointage_raw_writer',
        },
        {
          apply:
            'alter default privileges grant select on tables to yuta_pointage_raw_writer',
          restore:
            'alter default privileges revoke select on tables from yuta_pointage_raw_writer',
        },
        {
          apply:
            'grant update(id) on public.personnel_employee_dossiers to yuta_pointage_raw_writer',
          restore:
            'revoke update(id) on public.personnel_employee_dossiers from yuta_pointage_raw_writer',
        },
        {
          apply:
            'grant execute on function public.pointage_raw_lock_dossier(uuid,uuid,uuid) to public',
          restore:
            'revoke execute on function public.pointage_raw_lock_dossier(uuid,uuid,uuid) from public',
        },
        {
          apply:
            'alter function public.pointage_raw_lock_dossier(uuid,uuid,uuid) set search_path to public',
          restore: saved!.definition,
        },
        {
          apply: saved!.definition.replace(
            'BEGIN',
            'BEGIN\n  -- deliberate fingerprint fixture',
          ),
          restore: saved!.definition,
        },
      ];
      for (const mutation of mutations) {
        await fixtureAdmin.unsafe(mutation.apply);
        try {
          await expect(
            assertPointageRawDatabaseBoundary(actual),
          ).rejects.toThrow('Pointage scope is unavailable.');
          // A second rejection proves admission did not silently repair itself.
          await expect(
            assertPointageRawDatabaseBoundary(actual),
          ).rejects.toThrow('Pointage scope is unavailable.');
        } finally {
          await fixtureAdmin.unsafe(mutation.restore);
        }
        await assertPointageRawDatabaseBoundary(actual);
      }
      expect(
        (
          await fixtureAdmin`select pg_get_functiondef(to_regprocedure(${signature})) as definition`
        )[0]?.definition,
      ).toBe(saved?.definition);
    } finally {
      await Promise.all([fixtureAdmin.end(), fixtureWriter.end()]);
    }
  });

  it('F8: actual writer cannot SET ROLE, change session authorization or own/alter source tables', async () => {
    for (const statement of [
      'set local role yuta_pointage_raw_lock_owner',
      'set local session authorization pointage_bootstrap_20260908a',
      'alter table public.personnel_employee_dossiers disable trigger all',
      'alter table public.pointage_continuations owner to yuta_pointage_raw_writer',
    ])
      await expect(
        writer.begin((tx) => tx.unsafe(statement)),
      ).rejects.toMatchObject({ code: '42501' });
    await assertPointageRawDatabaseBoundary(drizzle(writer));
  });

  type HistoricalRow = {
    instant: string;
    zone: string;
    offset: number;
    date: string;
    kind?: 'CLOCK_IN' | 'CLOCK_OUT';
    ordinal?: number;
  };

  const utcHistory: HistoricalRow = {
    instant: '2025-01-01T12:00:00.123456Z',
    zone: 'UTC',
    offset: 0,
    date: '2025-01-01',
  };

  async function historicalFixture(rows: HistoricalRow[]) {
    const fixtureDossier = uuidv7();
    // Test owner only, after both database identity and runtime-role admission.
    // These are retained synthetic fixtures, not accepted runtime operations.
    // No immutable prior row is changed; the trigger is restored before COMMIT.
    await admin.begin(async (tx) => {
      await tx`insert into public.personnel_employee_dossiers(id,organization_id,establishment_id,given_names,family_name,position,qualification,employment_term_type,work_time_category,entry_date) values(${fixtureDossier},${organization},${establishment},'Synthetic','Historical snapshot fixture','Test','Test','indefinite','full_time','2020-01-01')`;
      await tx`alter table public.pointage_raw_events disable trigger pointage_raw_events_append`;
      for (const [index, row] of rows.entries()) {
        const event = uuidv7();
        // Bind text before SQL conversion: postgres-js date serialization would
        // truncate microseconds and cannot encode PostgreSQL infinity fixtures.
        await tx`insert into public.pointage_raw_events(id,organization_id,establishment_id,personnel_dossier_id,ordinal,kind,accepted_at,timezone_name,utc_offset_seconds,business_date) values(${event},${organization},${establishment},${fixtureDossier},${row.ordinal ?? index + 1},${row.kind ?? 'CLOCK_IN'},${row.instant}::text::timestamptz,${row.zone},${row.offset},${row.date}::text::date)`;
        expect(
          await tx`select accepted_at = ${row.instant}::text::timestamptz as exact_instant, business_date = ${row.date}::text::date as exact_date from public.pointage_raw_events where organization_id=${organization} and establishment_id=${establishment} and personnel_dossier_id=${fixtureDossier} and id=${event}`,
        ).toEqual([{ exact_instant: true, exact_date: true }]);
        await tx`insert into public.pointage_raw_command_receipts(organization_id,establishment_id,personnel_dossier_id,request_id,event_id,intent_version,intent_fingerprint) values(${organization},${establishment},${fixtureDossier},${randomUUID()},${event},1,${'b'.repeat(64)})`;
      }
      await tx`set constraints all immediate`;
      await tx`alter table public.pointage_raw_events enable trigger pointage_raw_events_append`;
    });
    expect(
      await admin`select tgenabled from pg_trigger where tgrelid='public.pointage_raw_events'::regclass and tgname='pointage_raw_events_append'`,
    ).toEqual([{ tgenabled: 'O' }]);
    await assertPointageRawDatabaseBoundary(drizzle(writer));
    return fixtureDossier;
  }

  async function evidenceSnapshot() {
    // Database JSON retains all six microsecond digits and special date values.
    // Never log rows, identity, credential/continuation material or audit payload.
    const tables = [
      'pointage_raw_events',
      'pointage_raw_command_receipts',
      'pointage_continuations',
      'pointage_security_audit_events',
      'pointage_employee_credentials',
      'pointage_credential_rate_limits',
      'organizations',
      'establishments',
      'personnel_employee_dossiers',
    ];
    const snapshot: Record<string, unknown> = {};
    const counts: Record<string, number> = {};
    for (const table of tables) {
      const [row] = await admin.unsafe(
        `select count(*)::int as count, coalesce(jsonb_agg(to_jsonb(t) order by to_jsonb(t)::text), '[]'::jsonb) as rows from public.${table} t`,
      );
      snapshot[table] = row;
      counts[table] = Number(row!.count);
    }
    return { counts, rows: snapshot };
  }

  async function appendHistoricalNext(
    tx: TransactionSql,
    fixtureDossier: string,
    kind = 'CLOCK_OUT',
  ) {
    const id = uuidv7();
    const [row] =
      await tx`insert into public.pointage_raw_events(id,organization_id,establishment_id,personnel_dossier_id,ordinal,kind,accepted_at,timezone_name,utc_offset_seconds,business_date) values(${id},${organization},${establishment},${fixtureDossier},999,${kind},'1900-01-01','ignored',999999,'1900-01-01') returning id, kind, ordinal, accepted_at::text, timezone_name, utc_offset_seconds, business_date::text`;
    await tx`insert into public.pointage_raw_command_receipts(organization_id,establishment_id,personnel_dossier_id,request_id,event_id,intent_version,intent_fingerprint) values(${organization},${establishment},${fixtureDossier},${randomUUID()},${id},1,${'c'.repeat(64)})`;
    return row!;
  }

  it.each([
    {
      name: 'invalid historical calendar (original failed F4 regression)',
      rows: [{ ...utcHistory, zone: 'Not/AZone', date: '1900-01-01' }],
    },
    {
      name: 'invalid zone alone',
      rows: [{ ...utcHistory, zone: 'Not/AZone' }],
    },
    { name: 'blank zone', rows: [{ ...utcHistory, zone: '' }] },
    {
      name: 'zone whitespace is not normalized',
      rows: [{ ...utcHistory, zone: ' UTC ' }],
    },
    {
      name: 'offset below inclusive minimum',
      rows: [{ ...utcHistory, offset: -50401 }],
    },
    {
      name: 'offset above inclusive maximum',
      rows: [{ ...utcHistory, offset: 50401 }],
    },
    {
      name: 'inconsistent retained offset/date tuple',
      rows: [
        { ...utcHistory, instant: '2025-01-01T23:59:59.123456Z', offset: 1 },
      ],
    },
    {
      name: 'invalid infinite business date',
      rows: [{ ...utcHistory, date: 'infinity' }],
    },
    {
      name: 'invalid infinite accepted instant',
      rows: [{ ...utcHistory, instant: 'infinity' }],
    },
    { name: 'ordinal gap', rows: [{ ...utcHistory, ordinal: 2 }] },
    {
      name: 'OUT first',
      rows: [{ ...utcHistory, kind: 'CLOCK_OUT' as const }],
    },
    { name: 'double IN', rows: [utcHistory, utcHistory] },
    {
      name: 'decreasing instant',
      rows: [
        utcHistory,
        {
          ...utcHistory,
          instant: '2025-01-01T11:00:00.123456Z',
          kind: 'CLOCK_OUT' as const,
        },
      ],
    },
  ])(
    'F4 rejects $name with exact rollback and untouched history',
    async ({ name, rows }) => {
      const fixtureDossier = await historicalFixture(rows);
      const before = await evidenceSnapshot();
      await expect(
        writer.begin(async (tx) => {
          await appendHistoricalNext(tx, fixtureDossier);
          // Never allow a missing receipt at COMMIT to mask a trigger failure.
          throw new Error(
            'Invalid historical calendar accepted; synthetic append rolled back.',
          );
        }),
      ).rejects.toMatchObject({
        code: '23514',
        message: 'POINTAGE_CHAIN_UNAVAILABLE',
      });
      const after = await evidenceSnapshot();
      expect(after).toEqual(before);
      console.info(
        'F4_ROLLBACK_PROOF',
        JSON.stringify({
          case: name,
          before: before.counts,
          after: after.counts,
          exactRowsUnchanged: true,
        }),
      );
      // New transaction succeeds: no swallowed failed statement or leaked locks.
      await writer.begin((tx) =>
        tx.unsafe(helperCall, [organization, establishment, fixtureDossier]),
      );
    },
  );

  it.each([
    { name: 'UTC', rows: [utcHistory], next: 'CLOCK_OUT' },
    {
      name: 'nonzero offset',
      rows: [{ ...utcHistory, zone: 'Europe/Paris', offset: 3600 }],
      next: 'CLOCK_OUT',
    },
    {
      name: 'inclusive -50400',
      rows: [
        {
          ...utcHistory,
          zone: 'Etc/GMT+12',
          offset: -50400,
          date: '2024-12-31',
        },
      ],
      next: 'CLOCK_OUT',
    },
    {
      name: 'inclusive +50400',
      rows: [
        {
          ...utcHistory,
          zone: 'Pacific/Kiritimati',
          offset: 50400,
          date: '2025-01-02',
        },
      ],
      next: 'CLOCK_OUT',
    },
    {
      name: 'positive second-level offset without step size',
      rows: [{ ...utcHistory, zone: 'Europe/Paris', offset: 561 }],
      next: 'CLOCK_OUT',
    },
    {
      name: 'negative second-level offset without step size',
      rows: [{ ...utcHistory, offset: -1 }],
      next: 'CLOCK_OUT',
    },
    {
      name: 'DST repeated-hour retained snapshots',
      rows: [
        {
          ...utcHistory,
          instant: '2025-10-26T00:30:00.123456Z',
          zone: 'Europe/Paris',
          offset: 7200,
          date: '2025-10-26',
        },
        {
          ...utcHistory,
          instant: '2025-10-26T01:30:00.123456Z',
          zone: 'Europe/Paris',
          offset: 3600,
          date: '2025-10-26',
          kind: 'CLOCK_OUT' as const,
        },
      ],
      next: 'CLOCK_IN',
    },
    {
      name: 'cross-midnight still one open session',
      rows: [{ ...utcHistory, instant: '2025-01-01T23:59:59.999999Z' }],
      next: 'CLOCK_OUT',
    },
    {
      name: 'establishment timezone changed after historical acceptance',
      rows: [{ ...utcHistory, zone: 'Europe/Paris', offset: 3600 }],
      next: 'CLOCK_OUT',
      newZone: 'America/New_York',
    },
  ])(
    'F4 accepts $name without rewriting retained snapshots',
    async ({ rows, next, newZone }) => {
      const fixtureDossier = await historicalFixture(rows);
      const [originalZone] =
        await admin`select timezone from public.establishments where organization_id=${organization} and id=${establishment}`;
      const history =
        await admin`select to_jsonb(e) as row from public.pointage_raw_events e where organization_id=${organization} and establishment_id=${establishment} and personnel_dossier_id=${fixtureDossier} order by ordinal`;
      try {
        if (newZone)
          await admin`update public.establishments set timezone=${newZone} where organization_id=${organization} and id=${establishment}`;
        const result = await writer.begin((tx) =>
          appendHistoricalNext(tx, fixtureDossier, next),
        );
        expect(result).toMatchObject({
          kind: next,
          ordinal: String(rows.length + 1),
          timezone_name: newZone ?? originalZone!.timezone,
        });
        expect(
          await admin`select to_jsonb(e) as row from public.pointage_raw_events e where organization_id=${organization} and establishment_id=${establishment} and personnel_dossier_id=${fixtureDossier} and ordinal<=${rows.length} order by ordinal`,
        ).toEqual(history);
        expect(
          await writer`select count(*)::int as count from public.pointage_raw_events where organization_id=${organization} and establishment_id=${establishment} and personnel_dossier_id=${fixtureDossier}`,
        ).toEqual([{ count: rows.length + 1 }]);
        expect(
          await writer`select count(*)::int as count from public.pointage_raw_command_receipts where organization_id=${organization} and establishment_id=${establishment} and personnel_dossier_id=${fixtureDossier}`,
        ).toEqual([{ count: rows.length + 1 }]);
      } finally {
        if (newZone)
          await admin`update public.establishments set timezone=${originalZone!.timezone} where organization_id=${organization} and id=${establishment}`;
      }
    },
  );

  it('F4 refuses a backward acceptance clock without clamping or rewriting history', async () => {
    const fixtureDossier = await historicalFixture([
      {
        ...utcHistory,
        instant: '2099-01-01T12:00:00.123456Z',
        date: '2099-01-01',
      },
    ]);
    const before = await evidenceSnapshot();
    await expect(
      writer.begin((tx) => appendHistoricalNext(tx, fixtureDossier)),
    ).rejects.toMatchObject({
      code: '23514',
      message: 'POINTAGE_CLOCK_UNAVAILABLE',
    });
    expect(await evidenceSnapshot()).toEqual(before);
  });

  it('F4 refuses broken prior receipt linkage inside the same outer transaction', async () => {
    const fixtureDossier = await historicalFixture([]);
    const before = await evidenceSnapshot();
    await expect(
      writer.begin(async (tx) => {
        await tx`insert into public.pointage_raw_events(id,organization_id,establishment_id,personnel_dossier_id,ordinal,kind,accepted_at,timezone_name,utc_offset_seconds,business_date) values(${uuidv7()},${organization},${establishment},${fixtureDossier},1,'CLOCK_IN',clock_timestamp(),'UTC',0,current_date)`;
        await appendHistoricalNext(tx, fixtureDossier);
      }),
    ).rejects.toMatchObject({
      code: '23514',
      message: 'POINTAGE_CHAIN_UNAVAILABLE',
    });
    expect(await evidenceSnapshot()).toEqual(before);
  });

  async function waitForDatabaseBlock(
    observer: Sql,
    waiting: number,
    holding: number,
  ) {
    const deadline = Date.now() + 1500;
    while (Date.now() < deadline) {
      const [row] =
        await observer`select ${holding}::integer = any(pg_blocking_pids(${waiting}::integer)) as blocked`;
      if (row?.blocked) return;
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
    throw new Error('Expected PostgreSQL blocking edge was not observed.');
  }

  it('D4 continuation: re-reads Personnel lifecycle after the earlier writer commits', async () => {
    const fixtureDossier = await historicalFixture([]);
    const fixtureScope = { ...scope, personnelDossierId: fixtureDossier };
    const repository = createPointageRawClockingRepository(
      drizzle(writer, { schema }),
    );
    const observer = await openPointageTestDatabase(
      process.env,
      process.env.CLOUD_DATABASE_URL!,
    );
    let pending: Promise<string> | undefined;
    const [pid] = await writer`select pg_backend_pid() as pid`;
    try {
      await admin.begin(async (tx) => {
        const [holder] = await tx`select pg_backend_pid() as pid`;
        await tx`update public.personnel_employee_dossiers set entry_date='2027-01-01' where organization_id=${organization} and establishment_id=${establishment} and id=${fixtureDossier}`;
        pending = repository.withDossierTransaction(
          fixtureScope,
          async (_ops, current) => current.entryDate,
        );
        void pending.catch(() => undefined);
        await waitForDatabaseBlock(observer, pid!.pid, holder!.pid);
      });
      expect(await pending).toBe('2027-01-01');
    } finally {
      await pending?.catch(() => undefined);
      await observer.end();
    }
  });

  it('D4 continuation: Personnel writer waits for the outer Pointage rollback', async () => {
    const fixtureDossier = await historicalFixture([]);
    const fixtureScope = { ...scope, personnelDossierId: fixtureDossier };
    const repository = createPointageRawClockingRepository(
      drizzle(writer, { schema }),
    );
    const observer = await openPointageTestDatabase(
      process.env,
      process.env.CLOUD_DATABASE_URL!,
    );
    const [holder] = await writer`select pg_backend_pid() as pid`;
    const [waiter] = await admin`select pg_backend_pid() as pid`;
    const rollback = new Error('Controlled Pointage outer rollback.');
    let pending: Promise<unknown> | undefined;
    try {
      await expect(
        repository.withDossierTransaction(
          fixtureScope,
          async (_ops, current) => {
            expect(current.entryDate).toBe('2020-01-01');
            pending = Promise.resolve(
              admin`update public.personnel_employee_dossiers set entry_date='2027-01-01' where organization_id=${organization} and establishment_id=${establishment} and id=${fixtureDossier}`,
            );
            void pending.catch(() => undefined);
            await waitForDatabaseBlock(observer, waiter!.pid, holder!.pid);
            throw rollback;
          },
        ),
      ).rejects.toBe(rollback);
      await pending;
      expect(
        await repository.withDossierTransaction(
          fixtureScope,
          async (_ops, current) => current.entryDate,
        ),
      ).toBe('2027-01-01');
    } finally {
      await pending?.catch(() => undefined);
      await observer.end();
    }
  });

  it('D4 continuation: actual issue/reset coordinate on the dossier lock and retain old bindings', async () => {
    const fixtureDossier = await historicalFixture([]);
    const fixtureScope = { ...scope, personnelDossierId: fixtureDossier };
    const repository = createPointageRawClockingRepository(
      drizzle(writer, { schema }),
    );
    // Privileged connection executes the existing foundation repository only as
    // a controlled synthetic SQL test; it is not the raw runtime connection.
    const foundation = createPointageRepository(drizzle(admin, { schema }));
    const manager = uuidv7();
    await admin`insert into public.users(id,auth_provider_id,email) values(${manager},${'synthetic-c17-' + manager},${manager + '@example.test'})`;
    const observer = await openPointageTestDatabase(
      process.env,
      process.env.CLOUD_DATABASE_URL!,
    );
    const [holder] = await writer`select pg_backend_pid() as pid`;
    const [waiter] = await admin`select pg_backend_pid() as pid`;
    const input = {
      scope,
      personnelDossierId: fixtureDossier,
      managerUserId: manager,
      now: new Date(),
      createMaterial: async () => ({
        lookupDigest: createHash('sha256').update(randomUUID()).digest('hex'),
        credentialFormatVersion: 1,
        algorithmVersion: 'scrypt-v1',
        keyVersion: 1,
        salt: Buffer.alloc(16, 1).toString('base64'),
        verifier: Buffer.alloc(32, 2).toString('base64'),
      }),
    };
    let issue: ReturnType<typeof foundation.issueCredential> | undefined;
    let reset: ReturnType<typeof foundation.resetCredential> | undefined;
    try {
      await repository.withDossierTransaction(fixtureScope, async (ops) => {
        expect(await ops.findCurrentCredential()).toBeNull();
        issue = foundation.issueCredential(input);
        void issue.catch(() => undefined);
        await waitForDatabaseBlock(observer, waiter!.pid, holder!.pid);
      });
      const issued = (await issue)!;
      expect(issued.credentialVersion).toBe(1);
      const oldContinuation = await repository.withDossierTransaction(
        fixtureScope,
        async (ops) => {
          expect(await ops.findCurrentCredential()).toEqual({
            id: issued.credentialId,
            credentialVersion: 1,
          });
          return ops.insertContinuation({
            tokenDigest: createHash('sha256')
              .update(randomUUID())
              .digest('hex'),
            credentialId: issued.credentialId,
            credentialVersion: 1,
          });
        },
      );
      await repository.withDossierTransaction(fixtureScope, async (ops) => {
        expect(
          (await ops.lockContinuation(oldContinuation!.id))?.credentialVersion,
        ).toBe(1);
        reset = foundation.resetCredential(input);
        void reset.catch(() => undefined);
        await waitForDatabaseBlock(observer, waiter!.pid, holder!.pid);
        expect((await ops.findCurrentCredential())?.credentialVersion).toBe(1);
      });
      const replaced = (await reset)!;
      expect(replaced.credentialVersion).toBe(2);
      await repository.withDossierTransaction(fixtureScope, async (ops) => {
        expect(await ops.findCurrentCredential()).toEqual({
          id: replaced.credentialId,
          credentialVersion: 2,
        });
        expect(
          (await ops.lockContinuation(oldContinuation!.id))?.credentialVersion,
        ).toBe(1);
      });
    } finally {
      await Promise.all([
        issue?.catch(() => undefined),
        reset?.catch(() => undefined),
      ]);
      await observer.end();
    }
  });

  it.each(['touch-first', 'end-first'] as const)(
    'F5 concurrent continuation touch/end serializes: %s',
    async (order) => {
      const repository = createPointageRawClockingRepository(
        drizzle(writer, { schema }),
      );
      const peer = await openPointageTestDatabase(
        process.env,
        pointageDisposableWriterUrl(process.env.CLOUD_DATABASE_URL!),
      );
      const observer = await openPointageTestDatabase(
        process.env,
        process.env.CLOUD_DATABASE_URL!,
      );
      const peerRepository = createPointageRawClockingRepository(
        drizzle(peer, { schema }),
      );
      const [holding] = await writer`select pg_backend_pid() as pid`;
      const [waiting] = await peer`select pg_backend_pid() as pid`;
      const created = await repository.withDossierTransaction(scope, (ops) =>
        ops.insertContinuation({
          tokenDigest: createHash('sha256').update(randomUUID()).digest('hex'),
          credentialId: credential,
          credentialVersion: 1,
        }),
      );
      expect(created).not.toBeNull();
      let pending: Promise<unknown> | undefined;
      try {
        await repository.withDossierTransaction(scope, async (ops) => {
          expect(await ops.lockContinuation(created!.id)).not.toBeNull();
          if (order === 'touch-first')
            expect(await ops.touchContinuationIdle(created!.id)).not.toBeNull();
          else
            expect(
              (await ops.endOwnContinuation(created!.id))?.endedAt,
            ).not.toBeNull();
          pending = peerRepository.withDossierTransaction(
            scope,
            async (other) => {
              const locked = await other.lockContinuation(created!.id);
              if (order === 'touch-first') {
                expect(locked?.endedAt).toBeNull();
                return other.endOwnContinuation(created!.id);
              }
              expect(locked?.endedAt).not.toBeNull();
              expect(await other.touchContinuationIdle(created!.id)).toBeNull();
              return other.endOwnContinuation(created!.id);
            },
          );
          void pending.catch(() => undefined);
          await waitForDatabaseBlock(observer, waiting!.pid, holding!.pid);
        });
        const ended = await pending;
        await repository.withDossierTransaction(scope, async (ops) => {
          expect(await ops.lockContinuation(created!.id)).toEqual(ended);
          expect(await ops.touchContinuationIdle(created!.id)).toBeNull();
          expect(await ops.endOwnContinuation(created!.id)).toEqual(ended);
        });
      } finally {
        await pending?.catch(() => undefined);
        await Promise.all([peer.end(), observer.end()]);
      }
    },
  );

  it('F5 continuation operations cannot cross dossier scope or bind a foreign credential tuple', async () => {
    const foreignDossier = await historicalFixture([]);
    const repository = createPointageRawClockingRepository(
      drizzle(writer, { schema }),
    );
    const foreignScope = { ...scope, personnelDossierId: foreignDossier };
    const before = await evidenceSnapshot();
    await repository.withDossierTransaction(foreignScope, async (ops) => {
      expect(await ops.lockContinuation(continuation)).toBeNull();
      expect(await ops.touchContinuationIdle(continuation)).toBeNull();
      expect(await ops.endOwnContinuation(continuation)).toBeNull();
      expect(await ops.findCurrentCredential()).toBeNull();
    });
    await expect(
      repository.withDossierTransaction(foreignScope, (ops) =>
        ops.insertContinuation({
          tokenDigest: createHash('sha256').update(randomUUID()).digest('hex'),
          credentialId: credential,
          credentialVersion: 1,
        }),
      ),
    ).rejects.toThrow();
    expect(await evidenceSnapshot()).toEqual(before);
  });

  it('F4 direct INSERT serializes competing transitions and holds every lock through commit', async () => {
    const fixtureDossier = await historicalFixture([]);
    const peer = await openPointageTestDatabase(
      process.env,
      pointageDisposableWriterUrl(process.env.CLOUD_DATABASE_URL!),
    );
    const observer = await openPointageTestDatabase(
      process.env,
      process.env.CLOUD_DATABASE_URL!,
    );
    const [holding] = await writer`select pg_backend_pid() as pid`;
    const [waiting] = await peer`select pg_backend_pid() as pid`;
    let pending: Promise<unknown> | undefined;
    try {
      await writer.begin(async (tx) => {
        await appendHistoricalNext(tx, fixtureDossier, 'CLOCK_IN');
        // No application helper invocation: the actual INSERT trigger owns it.
        for (const [table, id] of [
          ['organizations', organization],
          ['establishments', establishment],
          ['personnel_employee_dossiers', fixtureDossier],
        ] as const) {
          await expect(
            admin.begin((other) =>
              other.unsafe(
                `select id from public.${table} where id=$1 for update nowait`,
                [id],
              ),
            ),
          ).rejects.toMatchObject({ code: '55P03' });
        }
        pending = peer.begin((other) =>
          appendHistoricalNext(other, fixtureDossier, 'CLOCK_IN'),
        );
        void pending.catch(() => undefined);
        await waitForDatabaseBlock(observer, waiting!.pid, holding!.pid);
      });
      await expect(pending).rejects.toMatchObject({
        code: '23514',
        message: 'POINTAGE_TRANSITION_CONFLICT',
      });
      expect(
        await writer`select kind, ordinal::text from public.pointage_raw_events where organization_id=${organization} and establishment_id=${establishment} and personnel_dossier_id=${fixtureDossier}`,
      ).toEqual([{ kind: 'CLOCK_IN', ordinal: '1' }]);
      expect(
        await writer`select count(*)::int as count from public.pointage_raw_command_receipts where organization_id=${organization} and establishment_id=${establishment} and personnel_dossier_id=${fixtureDossier}`,
      ).toEqual([{ count: 1 }]);
    } finally {
      await pending?.catch(() => undefined);
      await Promise.all([peer.end(), observer.end()]);
    }
  });

  it('F4 rejects all invalid transitions and rolls back earlier inserts with the outer transaction', async () => {
    const fixtureDossier = await historicalFixture([]);
    const before = await evidenceSnapshot();
    await expect(
      writer.begin((tx) =>
        appendHistoricalNext(tx, fixtureDossier, 'CLOCK_OUT'),
      ),
    ).rejects.toMatchObject({
      code: '23514',
      message: 'POINTAGE_TRANSITION_CONFLICT',
    });
    await expect(
      writer.begin(async (tx) => {
        await appendHistoricalNext(tx, fixtureDossier, 'CLOCK_IN');
        await appendHistoricalNext(tx, fixtureDossier, 'CLOCK_IN');
      }),
    ).rejects.toMatchObject({
      code: '23514',
      message: 'POINTAGE_TRANSITION_CONFLICT',
    });
    expect(await evidenceSnapshot()).toEqual(before);
    for (const kind of [
      'CLOCK_IN',
      'CLOCK_OUT',
      'CLOCK_IN',
      'CLOCK_OUT',
    ] as const)
      await writer.begin((tx) =>
        appendHistoricalNext(tx, fixtureDossier, kind),
      );
    const completed = await evidenceSnapshot();
    await expect(
      writer.begin((tx) =>
        appendHistoricalNext(tx, fixtureDossier, 'CLOCK_OUT'),
      ),
    ).rejects.toMatchObject({
      code: '23514',
      message: 'POINTAGE_TRANSITION_CONFLICT',
    });
    expect(await evidenceSnapshot()).toEqual(completed);
    expect(
      await writer`select ordinal::text,kind from public.pointage_raw_events where organization_id=${organization} and establishment_id=${establishment} and personnel_dossier_id=${fixtureDossier} order by ordinal`,
    ).toEqual([
      { ordinal: '1', kind: 'CLOCK_IN' },
      { ordinal: '2', kind: 'CLOCK_OUT' },
      { ordinal: '3', kind: 'CLOCK_IN' },
      { ordinal: '4', kind: 'CLOCK_OUT' },
    ]);
  });

  it('F4 applies DB-observed employment dates, includes the final day and never auto-closes after departure', async () => {
    const fixtureDossier = await historicalFixture([]);
    const [day] =
      await admin`select (clock_timestamp() at time zone timezone)::date::text as today from public.establishments where organization_id=${organization} and id=${establishment}`;
    await admin`update public.personnel_employee_dossiers set entry_date=${day!.today}::date + 1 where organization_id=${organization} and establishment_id=${establishment} and id=${fixtureDossier}`;
    const upcoming = await evidenceSnapshot();
    await expect(
      writer.begin((tx) =>
        appendHistoricalNext(tx, fixtureDossier, 'CLOCK_IN'),
      ),
    ).rejects.toMatchObject({
      code: '23514',
      message: 'POINTAGE_LIFECYCLE_UNAVAILABLE',
    });
    expect(await evidenceSnapshot()).toEqual(upcoming);
    await admin`update public.personnel_employee_dossiers set entry_date=${day!.today}::date,departure_date=${day!.today}::date where organization_id=${organization} and establishment_id=${establishment} and id=${fixtureDossier}`;
    const accepted = await writer.begin((tx) =>
      appendHistoricalNext(tx, fixtureDossier, 'CLOCK_IN'),
    );
    expect(accepted.kind).toBe('CLOCK_IN');
    // Controlled synthetic lifecycle update, not a clock override or raw edit.
    await admin`update public.personnel_employee_dossiers set entry_date='2020-01-01',departure_date=${day!.today}::date - 1 where organization_id=${organization} and establishment_id=${establishment} and id=${fixtureDossier}`;
    const former = await evidenceSnapshot();
    await expect(
      writer.begin((tx) =>
        appendHistoricalNext(tx, fixtureDossier, 'CLOCK_OUT'),
      ),
    ).rejects.toMatchObject({
      code: '23514',
      message: 'POINTAGE_LIFECYCLE_UNAVAILABLE',
    });
    expect(await evidenceSnapshot()).toEqual(former);
    expect(
      await writer`select kind from public.pointage_raw_events where organization_id=${organization} and establishment_id=${establishment} and personnel_dossier_id=${fixtureDossier}`,
    ).toEqual([{ kind: 'CLOCK_IN' }]);
  });

  for (const field of [
    'organization-status',
    'establishment-status',
    'timezone',
  ] as const) {
    for (const order of ['parent-first', 'pointage-first'] as const) {
      it(`D4 parent ${field} serializes ${order} and current scope is re-read`, async () => {
        const repository = createPointageRawClockingRepository(
          drizzle(writer, { schema }),
        );
        const observer = await openPointageTestDatabase(
          process.env,
          process.env.CLOUD_DATABASE_URL!,
        );
        const [writerPid] = await writer`select pg_backend_pid() as pid`;
        const [adminPid] = await admin`select pg_backend_pid() as pid`;
        const [original] =
          await admin`select timezone from public.establishments where organization_id=${organization} and id=${establishment}`;
        const update = (tx: Sql | TransactionSql) =>
          field === 'organization-status'
            ? tx`update public.organizations set status='disabled' where id=${organization}`
            : field === 'establishment-status'
              ? tx`update public.establishments set status='disabled' where organization_id=${organization} and id=${establishment}`
              : tx`update public.establishments set timezone='Asia/Tokyo' where organization_id=${organization} and id=${establishment}`;
        let pending: Promise<unknown> | undefined;
        let entered = false;
        try {
          if (order === 'parent-first') {
            await admin.begin(async (tx) => {
              await update(tx);
              pending = repository.withDossierTransaction(
                scope,
                async (_ops, current) => {
                  entered = true;
                  return current.timezone;
                },
              );
              void pending.catch(() => undefined);
              await waitForDatabaseBlock(
                observer,
                writerPid!.pid,
                adminPid!.pid,
              );
            });
            if (field === 'timezone') expect(await pending).toBe('Asia/Tokyo');
            else {
              await expect(pending).rejects.toThrow();
              expect(entered).toBe(false);
            }
          } else {
            await repository.withDossierTransaction(
              scope,
              async (_ops, current) => {
                expect(current.timezone).toBe(original!.timezone);
                pending = Promise.resolve(update(admin));
                void pending.catch(() => undefined);
                await waitForDatabaseBlock(
                  observer,
                  adminPid!.pid,
                  writerPid!.pid,
                );
              },
            );
            await pending;
          }
        } finally {
          await pending?.catch(() => undefined);
          await admin`update public.organizations set status='active' where id=${organization}`;
          await admin`update public.establishments set status='active',timezone=${original!.timezone} where organization_id=${organization} and id=${establishment}`;
          await observer.end();
        }
      });
    }
  }

  it('D4 actual Formalites dossier lock waits until Pointage outer commit without Personnel write-back', async () => {
    const fixtureDossier = await historicalFixture([]);
    const fixtureScope = { ...scope, personnelDossierId: fixtureDossier };
    const manager = uuidv7();
    await admin`insert into public.users(id,auth_provider_id,email) values(${manager},${'synthetic-formalites-' + manager},${manager + '@example.test'})`;
    const before =
      await admin`select to_jsonb(t) as row from public.personnel_employee_dossiers t where organization_id=${organization} and establishment_id=${establishment} and id=${fixtureDossier}`;
    const repository = createPointageRawClockingRepository(
      drizzle(writer, { schema }),
    );
    const observer = await openPointageTestDatabase(
      process.env,
      process.env.CLOUD_DATABASE_URL!,
    );
    const [holding] = await writer`select pg_backend_pid() as pid`;
    const [waiting] = await admin`select pg_backend_pid() as pid`;
    let pending: ReturnType<typeof createFormalitesPersonnelDraft> | undefined;
    try {
      await repository.withDossierTransaction(fixtureScope, async () => {
        pending = createFormalitesPersonnelDraft(
          drizzle(admin, { schema }),
          {
            organizationId: organization,
            establishmentId: establishment,
            actor: {
              type: 'user',
              userId: manager,
              membershipId: uuidv7(),
              role: 'OWNER',
            },
            locale: 'fr-FR',
            timezone: 'Europe/Paris',
            entitlements: new Set(),
          },
          {
            employeeId: fixtureDossier,
            probationChoice: 'undecided',
            operationKey: randomUUID(),
          },
        );
        void pending.catch(() => undefined);
        await waitForDatabaseBlock(observer, waiting!.pid, holding!.pid);
      });
      expect((await pending)?.kind).toBe('success');
      expect(
        await admin`select to_jsonb(t) as row from public.personnel_employee_dossiers t where organization_id=${organization} and establishment_id=${establishment} and id=${fixtureDossier}`,
      ).toEqual(before);
    } finally {
      await pending?.catch(() => undefined);
      await observer.end();
    }
  });

  it('D4 poisoned caller search_path and temporary source names cannot redirect the exact helper', async () => {
    const before = await sourceRows();
    await drizzle(writer).transaction(async (tx) => {
      await tx.execute(
        sql`create temporary table organizations (id uuid,status text) on commit drop`,
      );
      await tx.execute(
        sql`create temporary table establishments (id uuid,organization_id uuid,status text) on commit drop`,
      );
      await tx.execute(
        sql`create temporary table personnel_employee_dossiers (id uuid,organization_id uuid,establishment_id uuid) on commit drop`,
      );
      await tx.execute(sql`set local search_path=pg_temp,public,pg_catalog`);
      await assertPointageRawDatabaseBoundary(tx);
      await tx.execute(
        sql`select public.pointage_raw_lock_dossier(${organization}::uuid,${establishment}::uuid,${dossier}::uuid)`,
      );
      await expect(
        admin.begin(
          (other) =>
            other`select id from public.personnel_employee_dossiers where organization_id=${organization} and establishment_id=${establishment} and id=${dossier} for update nowait`,
        ),
      ).rejects.toMatchObject({ code: '55P03' });
    });
    expect(await sourceRows()).toEqual(before);
  });

  it.each(['timeout', 'deadlock'] as const)(
    'D4 %s aborts the whole operation before callback and leaves no effects',
    async (mode) => {
      const repository = createPointageRawClockingRepository(
        drizzle(writer, { schema }),
      );
      const observer = await openPointageTestDatabase(
        process.env,
        process.env.CLOUD_DATABASE_URL!,
      );
      const [waiting] = await writer`select pg_backend_pid() as pid`;
      const [holding] = await admin`select pg_backend_pid() as pid`;
      const before = await evidenceSnapshot();
      let pending: Promise<unknown> | undefined;
      let entered = false;
      try {
        await admin.begin(async (tx) => {
          await tx`set local deadlock_timeout='10s'`;
          await tx`select id from public.personnel_employee_dossiers where organization_id=${organization} and establishment_id=${establishment} and id=${dossier} for update`;
          pending = repository.withDossierTransaction(scope, async () => {
            entered = true;
          });
          void pending.catch(() => undefined);
          await waitForDatabaseBlock(observer, waiting!.pid, holding!.pid);
          if (mode === 'deadlock')
            await tx`select id from public.organizations where id=${organization} for update`;
          const error: unknown = await pending.then(
            () => null,
            (failure: unknown) => failure,
          );
          const cause =
            error instanceof Error && error.cause ? error.cause : error;
          expect(cause).toMatchObject({
            code: mode === 'deadlock' ? '40P01' : '55P03',
          });
          expect(entered).toBe(false);
        });
        expect(await evidenceSnapshot()).toEqual(before);
        await repository.withDossierTransaction(scope, async () => undefined);
      } finally {
        await pending?.catch(() => undefined);
        await observer.end();
      }
    },
  );

  it('S2 scoped repository preserves canonical microseconds and retained calendar snapshots on read', async () => {
    const fixtureDossier = await historicalFixture([
      {
        ...utcHistory,
        instant: '2025-10-26T00:30:00.123456Z',
        zone: 'Europe/Paris',
        offset: 7200,
        date: '2025-10-26',
      },
      {
        ...utcHistory,
        instant: '2025-10-26T01:30:00.123457Z',
        zone: 'Europe/Paris',
        offset: 3600,
        date: '2025-10-26',
        kind: 'CLOCK_OUT',
      },
    ]);
    const repository = createPointageRawClockingRepository(
      drizzle(writer, { schema }),
    );
    const result = await repository.withDossierTransaction(
      { ...scope, personnelDossierId: fixtureDossier },
      (ops) => ops.readRawChain(),
    );
    expect(
      result.events.map((row) => ({
        ordinal: row.ordinal,
        acceptedAt: row.acceptedAt,
        offset: row.utcOffsetSeconds,
        date: row.businessDate,
        receiptLinked: row.receiptLinked,
      })),
    ).toEqual([
      {
        ordinal: '1',
        acceptedAt: '2025-10-26T00:30:00.123456Z',
        offset: 7200,
        date: '2025-10-26',
        receiptLinked: true,
      },
      {
        ordinal: '2',
        acceptedAt: '2025-10-26T01:30:00.123457Z',
        offset: 3600,
        date: '2025-10-26',
        receiptLinked: true,
      },
    ]);
    expect(result.knownTimezoneNames).toEqual(new Set(['Europe/Paris']));
    expect(
      result.events.every(
        (row) =>
          row.organizationId === organization &&
          row.establishmentId === establishment &&
          row.personnelDossierId === fixtureDossier,
      ),
    ).toBe(true);
    const emptyDossier = await historicalFixture([]);
    expect(
      (
        await repository.withDossierTransaction(
          { ...scope, personnelDossierId: emptyDossier },
          (ops) => ops.readRawChain(),
        )
      ).events,
    ).toEqual([]);
  });

  it('F4 scope corruption is prevented by the existing composite FK, without disabling constraints', async () => {
    const before = await evidenceSnapshot();
    const otherOrganization = uuidv7();
    await expect(
      admin.begin(async (tx) => {
        await tx`alter table public.pointage_raw_events disable trigger pointage_raw_events_append`;
        await tx`insert into public.pointage_raw_events(id,organization_id,establishment_id,personnel_dossier_id,ordinal,kind,accepted_at,timezone_name,utc_offset_seconds,business_date) values(${uuidv7()},${otherOrganization},${establishment},${dossier},2,'CLOCK_OUT',clock_timestamp(),'UTC',0,current_date)`;
        throw new Error(
          'Composite scope corruption unexpectedly accepted; rollback.',
        );
      }),
    ).rejects.toMatchObject({
      code: '23503',
      constraint_name: 'pointage_raw_events_establishment_fk',
    });
    expect(await evidenceSnapshot()).toEqual(before);
    expect(
      await admin`select tgenabled from pg_trigger where tgrelid='public.pointage_raw_events'::regclass and tgname='pointage_raw_events_append'`,
    ).toEqual([{ tgenabled: 'O' }]);
    await expect(
      writer.begin((tx) =>
        tx.unsafe(helperCall, [organization, establishment, uuidv7()]),
      ),
    ).rejects.toMatchObject({
      code: 'P0001',
      message: 'POINTAGE_LOCK_UNAVAILABLE',
    });
    expect(await evidenceSnapshot()).toEqual(before);
  });
});
