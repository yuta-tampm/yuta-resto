import { randomUUID, randomBytes } from 'node:crypto';
import { describe, expect, it, vi, beforeAll, afterAll } from 'vitest';
import type {
  PointageRawClockingRepository,
  PointageRawDossierOperations,
} from '@yuta/db-cloud';
import {
  createPointageCredentialVerifier,
  createPointageLookupDigest,
  derivePointageCredentialKeys,
  generatePointageContinuation,
  digestPointageContinuation,
  derivePointageStateGuardKey,
} from '@yuta/auth';
vi.mock('server-only', () => ({}));
import { createPointageRawClockingService } from '../src/server/pointage/raw-clocking-service';
import type {
  PointageEmployeeOperation,
  VerifiedPointageCredential,
} from '../src/server/pointage/authorization';
import {
  createPointageServerFoundation,
  type PointageValidationResult,
} from '../src/server/pointage/service';
import { createPointageRawManagerRead } from '../src/server/pointage/raw-clocking-manager';
import {
  createPointageRepository,
  createPointageRawClockingRepository,
  assertPointageRawDatabaseBoundary,
  assertPointageFoundationDatabaseBoundary,
} from '@yuta/db-cloud';
import {
  openPointageTestClient,
  pointageDisposableWriterUrl,
  pointageDisposableFoundationUrl,
} from '../../../packages/db-cloud/test/helpers/pointage-raw-clocking-test-database';
import { createPointageRawClockingRuntime } from '../src/server/pointage/raw-clocking-runtime';

sqlD1aProof();

function sqlD1aProof() {
  const suite =
    process.env.YUTA_POINTAGE_SYNTHETIC_TEST_MODE === 'true'
      ? describe
      : describe.skip;
  suite('D1a actual same-database validation-only runtime', () => {
    type Client = Awaited<ReturnType<typeof openPointageTestClient>>;
    let admin: Client, foundation: Client, raw: Client;
    const scope = {
      organizationId: randomUUID(),
      establishmentId: randomUUID(),
      personnelDossierId: randomUUID(),
    };
    const slug = 'synthetic-d1a-' + scope.establishmentId;
    const userId = randomUUID(),
      secret = randomBytes(32);
    let pin: string;
    const role = 'yuta_pointage_foundation_runtime';
    const provider = vi.fn(() => ({
      getTrustedClientAddress: async () => ({
        address: '127.0.0.1',
        provenance: 'SERVER_VERIFIED' as const,
      }),
    }));
    const compose = () =>
      createPointageRawClockingRuntime({
        environment: process.env,
        listeningHost: '127.0.0.1',
        foundationClient: foundation.db,
        rawClient: raw.db,
        encodedAuthSecret: secret.toString('base64url'),
        stateGuardKey: derivePointageStateGuardKey(secret),
        createSyntheticClientAddressProvider: provider,
      });
    beforeAll(async () => {
      admin = await openPointageTestClient(
        process.env,
        process.env.CLOUD_DATABASE_URL!,
      );
      foundation = await openPointageTestClient(
        process.env,
        pointageDisposableFoundationUrl(process.env.CLOUD_DATABASE_URL!),
      );
      raw = await openPointageTestClient(
        process.env,
        pointageDisposableWriterUrl(process.env.CLOUD_DATABASE_URL!),
      );
      await assertPointageFoundationDatabaseBoundary(foundation.db);
      await assertPointageRawDatabaseBoundary(raw.db);
      const db = admin.connection;
      await db.begin(async (tx) => {
        await tx`insert into public.organizations(id,name,slug) values(${scope.organizationId},'Synthetic D1a',${'synthetic-' + scope.organizationId})`;
        await tx`insert into public.establishments(id,organization_id,name,slug,timezone) values(${scope.establishmentId},${scope.organizationId},'Synthetic D1a',${slug},'UTC')`;
        await tx`insert into public.personnel_employee_dossiers(id,organization_id,establishment_id,given_names,family_name,position,qualification,employment_term_type,work_time_category,entry_date) values(${scope.personnelDossierId},${scope.organizationId},${scope.establishmentId},'Synthetic','D1a','Test','Test','indefinite','full_time','2020-01-01')`;
        await tx`insert into public.users(id,auth_provider_id,email) values(${userId},${'synthetic-' + userId},${userId + '@example.test'})`;
      });
      const setupFoundation = createPointageServerFoundation({
        repository: createPointageRepository(admin.db),
        encodedAuthSecret: secret.toString('base64url'),
        clientAddressProvider: provider(),
      });
      pin = (
        await setupFoundation.issueCredential({
          manager: {
            actorType: 'POINTAGE_MANAGER',
            organizationId: scope.organizationId,
            establishmentId: scope.establishmentId,
            userId,
            membershipId: randomUUID(),
            role: 'OWNER',
            operation: 'pointage.credential.issue',
          },
          personnelDossierId: scope.personnelDossierId,
        })
      ).credential;
      provider.mockClear();
    });
    afterAll(async () => {
      pin = '';
      secret.fill(0);
      await Promise.all([
        admin?.connection.end(),
        foundation?.connection.end(),
        raw?.connection.end(),
      ]);
    });
    it('uses all seven methods with exact column grants and preserves candidate/client thresholds', async () => {
      const repository = createPointageRepository(foundation.db);
      expect(await repository.resolveActiveEntryScope(slug)).toMatchObject({
        organizationId: scope.organizationId,
        establishmentId: scope.establishmentId,
      });
      expect(
        await repository.findPersonnelEmploymentPeriod(
          scope,
          scope.personnelDossierId,
        ),
      ).toMatchObject({ entryDate: '2020-01-01' });
      const now = new Date();
      for (const [keyKind, failureLimit, keyDigest] of [
        ['candidate', 5, 'c'.repeat(64)],
        ['client', 30, 'd'.repeat(64)],
      ] as const) {
        expect(
          await repository.isRateLimitBlocked(scope, keyKind, keyDigest, now),
        ).toBe(false);
        for (let index = 1; index <= failureLimit; index++) {
          const failure = await repository.recordRateLimitFailure({
            scope,
            keyKind,
            keyDigest,
            now,
            failureLimit,
            windowMs: 900_000,
            blockMs: 900_000,
          });
          expect(failure).toEqual({
            failureCount: index,
            blocked: index === failureLimit,
          });
        }
        expect(
          await repository.isRateLimitBlocked(scope, keyKind, keyDigest, now),
        ).toBe(true);
        await repository.resetCandidateRateLimit(scope, keyDigest, now);
        expect(
          await repository.isRateLimitBlocked(scope, keyKind, keyDigest, now),
        ).toBe(keyKind === 'client');
      }
      await repository.appendAudit({
        ...scope,
        eventType: 'pointage.authorization.denied',
        outcome: 'denied',
        reasonCode: 'operation_not_granted',
        requestedOperation: 'pointage.employee.state.read',
        occurredAt: now,
      });
      // Successful actual identify exercises current credential lookup/verifier,
      // distributed limiter reset, minimized audit and raw transaction authority.
      const runtime = await compose();
      const identified = await runtime.identify({
        establishmentSlug: slug,
        credential: pin,
      });
      expect(identified.ok).toBe(true);
      if (!identified.ok) throw new Error('Synthetic D1a identify failed.');
      expect(identified.value.state.displayName).toBe('Synthetic D1a');
      const command = {
        establishmentSlug: slug,
        continuation: identified.value.continuation,
        requestId: randomUUID(),
        kind: 'CLOCK_IN' as const,
        observedStateGuard: identified.value.state.stateGuard,
      };
      const receipt = await runtime.mutate(command);
      expect(receipt.ok).toBe(true);
      expect(await runtime.mutate(command)).toEqual(receipt);
    });
    it('denies alternate SQL and administration with the real foundation identity', async () => {
      for (const statement of [
        'select * from public.pointage_raw_events',
        'select * from public.pointage_raw_command_receipts',
        'select * from public.pointage_continuations',
        'select * from public.pointage_security_audit_events',
        'select issued_at from public.pointage_employee_credentials',
        'update public.pointage_employee_credentials set superseded_at=now()',
        'update public.personnel_employee_dossiers set entry_date=entry_date',
        'update public.establishments set timezone=timezone',
        'update public.organizations set status=status',
        'delete from public.pointage_credential_rate_limits',
        'truncate public.pointage_credential_rate_limits',
        'select public.pointage_raw_lock_dossier(null,null,null)',
        'create temporary table d1a_forbidden(id int)',
        'create table public.d1a_forbidden(id int)',
        'create schema d1a_forbidden',
        'alter table public.pointage_credential_rate_limits disable trigger all',
        'drop table public.pointage_credential_rate_limits',
        'create role d1a_forbidden',
      ])
        await expect(
          foundation.connection.unsafe(statement),
        ).rejects.toMatchObject({ code: '42501' });
      const repository = createPointageRepository(foundation.db);
      const command = {
        scope,
        personnelDossierId: scope.personnelDossierId,
        managerUserId: userId,
        now: new Date(),
        createMaterial: vi.fn(),
      };
      await expect(repository.issueCredential(command)).rejects.toThrow();
      await expect(repository.resetCredential(command)).rejects.toThrow();
      expect(command.createMaterial).not.toHaveBeenCalled();
      await expect(
        assertPointageRawDatabaseBoundary(foundation.db),
      ).rejects.toThrow();
      await expect(
        assertPointageFoundationDatabaseBoundary(raw.db),
      ).rejects.toThrow();
    });
    const grants = [
      ['select on public.pointage_raw_events', role],
      ['select on public.pointage_raw_command_receipts', role],
      ['select on public.pointage_continuations', role],
      ['insert on public.pointage_raw_events', role],
      ['insert on public.pointage_raw_command_receipts', role],
      ['insert on public.pointage_continuations', role],
      ['update (ended_at) on public.pointage_continuations', role],
      ['insert on public.pointage_employee_credentials', role],
      ['update (superseded_at) on public.pointage_employee_credentials', role],
      ['update (entry_date) on public.personnel_employee_dossiers', role],
      ['update (status) on public.organizations', role],
      ['update (timezone) on public.establishments', role],
      ['select on public.pointage_security_audit_events', role],
      [
        'execute on function public.pointage_raw_lock_dossier(uuid,uuid,uuid)',
        role,
      ],
      ['select on public.pointage_raw_events', 'public'],
      ['create on schema public', role],
      [
        'select on public.pointage_credential_rate_limits',
        'yuta_pointage_raw_writer',
      ],
      [
        'insert on public.pointage_security_audit_events',
        'yuta_pointage_raw_writer',
      ],
    ];
    it.each(grants)(
      'rejects effective excess %s to %s before provider',
      async (grant, grantee) => {
        await admin.connection.unsafe(`grant ${grant} to ${grantee}`);
        provider.mockClear();
        try {
          await expect(compose()).rejects.toThrow(
            'Pointage runtime is unavailable.',
          );
          expect(provider).not.toHaveBeenCalled();
        } finally {
          await admin.connection.unsafe(`revoke ${grant} from ${grantee}`);
        }
        await assertPointageFoundationDatabaseBoundary(foundation.db);
        await assertPointageRawDatabaseBoundary(raw.db);
      },
    );
    it.each([
      ['superuser', 'nosuperuser'],
      ['createdb', 'nocreatedb'],
      ['createrole', 'nocreaterole'],
      ['replication', 'noreplication'],
      ['bypassrls', 'nobypassrls'],
      ['inherit', 'noinherit'],
      ['nologin', 'login'],
    ])(
      'rejects unexpected foundation attribute %s before provider',
      async (attribute, restore) => {
        await admin.connection.unsafe(`alter role ${role} ${attribute}`);
        provider.mockClear();
        try {
          await expect(compose()).rejects.toThrow(
            'Pointage runtime is unavailable.',
          );
          expect(provider).not.toHaveBeenCalled();
        } finally {
          await admin.connection.unsafe(`alter role ${role} ${restore}`);
        }
        await assertPointageFoundationDatabaseBoundary(foundation.db);
      },
    );
    it('rejects membership, default ACL, grant option, ownership and PUBLIC TEMP', async () => {
      const [{ name }] = await admin.connection<
        { name: string }[]
      >`select current_database() as name`;
      const mutations = [
        [
          `grant yuta_pointage_raw_writer to ${role}`,
          `revoke yuta_pointage_raw_writer from ${role}`,
        ],
        [
          `alter default privileges grant select on tables to ${role}`,
          `alter default privileges revoke select on tables from ${role}`,
        ],
        [
          `alter default privileges grant select on tables to public`,
          `alter default privileges revoke select on tables from public`,
        ],
        [
          `grant select (id) on public.organizations to ${role} with grant option`,
          `revoke grant option for select (id) on public.organizations from ${role}`,
        ],
        [
          `grant temporary on database "${name}" to public`,
          `revoke temporary on database "${name}" from public`,
        ],
        [
          `alter database "${name}" owner to ${role}`,
          `alter database "${name}" owner to pointage_bootstrap_20260908a`,
        ],
      ];
      for (const [mutate, restore] of mutations) {
        await admin.connection.unsafe(mutate!);
        provider.mockClear();
        try {
          await expect(compose()).rejects.toThrow(
            'Pointage runtime is unavailable.',
          );
          expect(provider).not.toHaveBeenCalled();
        } finally {
          await admin.connection.unsafe(restore!);
        }
        await assertPointageFoundationDatabaseBoundary(foundation.db);
        await assertPointageRawDatabaseBoundary(raw.db);
      }
    });
    it('rejects actual administrative clients and preserves the writer effective TEMP baseline', async () => {
      const db = admin.connection;
      const [rights] = await db`select
        has_database_privilege('yuta_pointage_raw_writer',current_database(),'TEMP') as writer_temp,
        has_database_privilege('yuta_pointage_foundation_runtime',current_database(),'TEMP') as foundation_temp`;
      expect(rights).toEqual({ writer_temp: true, foundation_temp: false });
      for (const [foundationClient, rawClient] of [
        [admin.db, raw.db],
        [foundation.db, admin.db],
        [raw.db, foundation.db],
      ]) {
        provider.mockClear();
        await expect(
          createPointageRawClockingRuntime({
            environment: process.env,
            listeningHost: '127.0.0.1',
            foundationClient,
            rawClient,
            encodedAuthSecret: secret.toString('base64url'),
            stateGuardKey: derivePointageStateGuardKey(secret),
            createSyntheticClientAddressProvider: provider,
          }),
        ).rejects.toThrow('Pointage runtime is unavailable.');
        expect(provider).not.toHaveBeenCalled();
      }
    });
    it('uses actual 5/30 authentication limits and never logs credential or employee state', async () => {
      const runtime = await compose();
      const protectedCounts = async () => {
        const [row] = await admin.connection`select
          (select count(*)::int from public.pointage_raw_events
            where organization_id=${scope.organizationId}
              and establishment_id=${scope.establishmentId}
              and personnel_dossier_id=${scope.personnelDossierId}) as raw,
          (select count(*)::int from public.pointage_raw_command_receipts
            where organization_id=${scope.organizationId}
              and establishment_id=${scope.establishmentId}
              and personnel_dossier_id=${scope.personnelDossierId}) as receipts,
          (select count(*)::int from public.pointage_continuations
            where organization_id=${scope.organizationId}
              and establishment_id=${scope.establishmentId}
              and personnel_dossier_id=${scope.personnelDossierId}) as continuations`;
        return {
          raw: Number(row!.raw),
          receipts: Number(row!.receipts),
          continuations: Number(row!.continuations),
        };
      };
      const before = await protectedCounts();
      const spies = [
        vi.spyOn(console, 'log'),
        vi.spyOn(console, 'warn'),
        vi.spyOn(console, 'error'),
      ];
      try {
        for (let i = 0; i < 5; i++)
          expect(
            await runtime.identify({
              establishmentSlug: slug,
              credential: 'synthetic-invalid-repeat',
            }),
          ).toEqual({ ok: false, code: 'POINTAGE_ACCESS_DENIED' });
        expect(
          await runtime.identify({
            establishmentSlug: slug,
            credential: 'synthetic-invalid-repeat',
          }),
        ).toEqual({ ok: false, code: 'POINTAGE_TRY_LATER' });
        for (let i = 0; i < 25; i++)
          expect(
            await runtime.identify({
              establishmentSlug: slug,
              credential: 'synthetic-invalid-' + i,
            }),
          ).toEqual({ ok: false, code: 'POINTAGE_ACCESS_DENIED' });
        expect(
          await runtime.identify({ establishmentSlug: slug, credential: pin }),
        ).toEqual({ ok: false, code: 'POINTAGE_TRY_LATER' });
        for (const spy of spies) expect(spy).not.toHaveBeenCalled();
      } finally {
        for (const spy of spies) spy.mockRestore();
      }
      expect(await protectedCounts()).toEqual(before);
      const rows =
        await admin.connection`select * from public.pointage_security_audit_events where organization_id=${scope.organizationId} and establishment_id=${scope.establishmentId}`;
      expect(rows.length).toBeGreaterThan(30);
      const serialized = JSON.stringify(rows);
      expect(serialized.includes(pin)).toBe(false);
      expect(serialized.includes(secret.toString('base64url'))).toBe(false);
      expect(serialized.includes('Synthetic D1a')).toBe(false);
      expect(Object.keys(rows[0]!).sort()).toEqual(
        [
          'id',
          'organization_id',
          'establishment_id',
          'event_type',
          'outcome',
          'reason_code',
          'manager_user_id',
          'personnel_dossier_id',
          'credential_id',
          'credential_version',
          'requested_operation',
          'occurred_at',
        ].sort(),
      );
    }, 30_000);
  });
}

type Continuation = NonNullable<
  Awaited<ReturnType<PointageRawDossierOperations['insertContinuation']>>
>;

const sqlIntegration =
  process.env.YUTA_POINTAGE_SYNTHETIC_TEST_MODE === 'true'
    ? describe
    : describe.skip;
sqlIntegration('S3-S6 actual disposable PostgreSQL service composition', () => {
  type Client = Awaited<ReturnType<typeof openPointageTestClient>>;
  let admin: Client;
  let writer: Client;
  let peer: Client;
  let observer: Client;
  let foundation: ReturnType<typeof createPointageServerFoundation>;
  let repository: PointageRawClockingRepository;
  let service: ReturnType<typeof createPointageRawClockingService>;
  let otherService: ReturnType<typeof createPointageRawClockingService>;
  let pin: string;
  const scope = {
    organizationId: randomUUID(),
    establishmentId: randomUUID(),
    personnelDossierId: randomUUID(),
  };
  const userId = randomUUID();
  const slug = 'synthetic-service-' + scope.establishmentId;
  const manager = {
    actorType: 'POINTAGE_MANAGER' as const,
    organizationId: scope.organizationId,
    establishmentId: scope.establishmentId,
    userId,
    membershipId: randomUUID(),
    role: 'OWNER' as const,
  };
  const secret = randomBytes(32);
  let releaseFirst: () => void = () => undefined;
  let firstEntered = Promise.resolve();
  let armRace = false;
  let firstCommand: Parameters<
    ReturnType<typeof createPointageRawClockingService>['mutate']
  >[0];
  let firstReceipt: Awaited<
    ReturnType<ReturnType<typeof createPointageRawClockingService>['mutate']>
  >;

  function makeService(
    dbRepository: PointageRawClockingRepository,
    client: Client,
    authority = foundation,
  ) {
    return createPointageRawClockingService({
      foundation: authority,
      repository: dbRepository,
      stateGuardKey: derivePointageStateGuardKey(secret),
      requireReady: () =>
        client.db.transaction((tx) => assertPointageRawDatabaseBoundary(tx)),
      resolveEntryScope: async (value) =>
        createPointageRepository(admin.db).resolveActiveEntryScope(value),
    });
  }
  async function identify() {
    const result = await service.identify({
      establishmentSlug: slug,
      credential: pin,
    });
    if (!result.ok) throw new Error('Synthetic SQL identify was unavailable.');
    return result.value;
  }
  async function counts() {
    const query = admin.connection;
    const [row] =
      await query`select (select count(*)::int from public.pointage_raw_events where organization_id=${scope.organizationId}) as raw,(select count(*)::int from public.pointage_raw_command_receipts where organization_id=${scope.organizationId}) as receipts,(select count(*)::int from public.pointage_continuations where organization_id=${scope.organizationId}) as continuations`;
    return row;
  }
  async function committedPair(requestId: string) {
    const query = admin.connection;
    return query`
      select
        r.request_id,
        r.event_id,
        e.id as raw_event_id,
        e.kind,
        to_char(e.accepted_at at time zone 'UTC','YYYY-MM-DD"T"HH24:MI:SS.US"Z"') as accepted_at,
        e.timezone_name,
        e.utc_offset_seconds,
        e.business_date::text as business_date
      from public.pointage_raw_command_receipts r
      join public.pointage_raw_events e
        on e.organization_id=r.organization_id
       and e.establishment_id=r.establishment_id
       and e.personnel_dossier_id=r.personnel_dossier_id
       and e.id=r.event_id
      where r.organization_id=${scope.organizationId}
        and r.establishment_id=${scope.establishmentId}
        and r.personnel_dossier_id=${scope.personnelDossierId}
        and r.request_id=${requestId}
    `;
  }
  type IsolatedFixture = Readonly<{
    scope: typeof scope;
    establishmentSlug: string;
    credential: string;
  }>;
  async function createIsolatedFixture(input: {
    label: string;
    dedicatedEstablishment?: boolean;
  }): Promise<IsolatedFixture> {
    const isolatedScope = {
      organizationId: scope.organizationId,
      establishmentId: input.dedicatedEstablishment
        ? randomUUID()
        : scope.establishmentId,
      personnelDossierId: randomUUID(),
    };
    const establishmentSlug = input.dedicatedEstablishment
      ? `synthetic-${input.label}-${isolatedScope.establishmentId}`
      : slug;
    await admin.connection.begin(async (tx) => {
      if (input.dedicatedEstablishment)
        await tx`insert into public.establishments(id,organization_id,name,slug,timezone) values(${isolatedScope.establishmentId},${isolatedScope.organizationId},${`Synthetic ${input.label}`},${establishmentSlug},'UTC')`;
      await tx`insert into public.personnel_employee_dossiers(id,organization_id,establishment_id,given_names,family_name,position,qualification,employment_term_type,work_time_category,entry_date) values(${isolatedScope.personnelDossierId},${isolatedScope.organizationId},${isolatedScope.establishmentId},'Synthetic',${input.label},'Test','Test','indefinite','full_time','2020-01-01')`;
    });
    const credential = (
      await foundation.issueCredential({
        manager: {
          ...manager,
          establishmentId: isolatedScope.establishmentId,
          operation: 'pointage.credential.issue',
        },
        personnelDossierId: isolatedScope.personnelDossierId,
      })
    ).credential;
    return { scope: isolatedScope, establishmentSlug, credential };
  }
  async function identifyFixture(fixture: IsolatedFixture) {
    const result = await service.identify({
      establishmentSlug: fixture.establishmentSlug,
      credential: fixture.credential,
    });
    if (!result.ok) throw new Error('Isolated SQL identify was unavailable.');
    return result.value;
  }
  async function scopedCounts(isolatedScope: typeof scope) {
    const query = admin.connection;
    const [row] = await query`
      select
        (select count(*)::int from public.pointage_raw_events
          where organization_id=${isolatedScope.organizationId}
            and establishment_id=${isolatedScope.establishmentId}
            and personnel_dossier_id=${isolatedScope.personnelDossierId}) as raw,
        (select count(*)::int from public.pointage_raw_command_receipts
          where organization_id=${isolatedScope.organizationId}
            and establishment_id=${isolatedScope.establishmentId}
            and personnel_dossier_id=${isolatedScope.personnelDossierId}) as receipts
    `;
    return row;
  }
  async function scopedKinds(isolatedScope: typeof scope) {
    const query = admin.connection;
    return query`
      select kind
      from public.pointage_raw_events
      where organization_id=${isolatedScope.organizationId}
        and establishment_id=${isolatedScope.establishmentId}
        and personnel_dossier_id=${isolatedScope.personnelDossierId}
      order by ordinal
    `;
  }
  async function committedPairFor(
    isolatedScope: typeof scope,
    requestId: string,
  ) {
    const query = admin.connection;
    return query`
      select
        r.request_id,
        r.event_id,
        e.id as raw_event_id,
        e.kind,
        to_char(e.accepted_at at time zone 'UTC','YYYY-MM-DD"T"HH24:MI:SS.US"Z"') as accepted_at,
        e.timezone_name,
        e.utc_offset_seconds,
        e.business_date::text as business_date
      from public.pointage_raw_command_receipts r
      join public.pointage_raw_events e
        on e.organization_id=r.organization_id
       and e.establishment_id=r.establishment_id
       and e.personnel_dossier_id=r.personnel_dossier_id
       and e.id=r.event_id
      where r.organization_id=${isolatedScope.organizationId}
        and r.establishment_id=${isolatedScope.establishmentId}
        and r.personnel_dossier_id=${isolatedScope.personnelDossierId}
        and r.request_id=${requestId}
    `;
  }
  beforeAll(async () => {
    admin = await openPointageTestClient(
      process.env,
      process.env.CLOUD_DATABASE_URL!,
    );
    writer = await openPointageTestClient(
      process.env,
      pointageDisposableWriterUrl(process.env.CLOUD_DATABASE_URL!),
    );
    peer = await openPointageTestClient(
      process.env,
      pointageDisposableWriterUrl(process.env.CLOUD_DATABASE_URL!),
    );
    observer = await openPointageTestClient(
      process.env,
      process.env.CLOUD_DATABASE_URL!,
    );
    await writer.db.transaction((tx) => assertPointageRawDatabaseBoundary(tx));
    await peer.db.transaction((tx) => assertPointageRawDatabaseBoundary(tx));
    const db = admin.connection;
    await db.begin(async (tx) => {
      await tx`insert into public.organizations(id,name,slug) values(${scope.organizationId},'Synthetic raw service',${'synthetic-' + scope.organizationId})`;
      await tx`insert into public.establishments(id,organization_id,name,slug,timezone) values(${scope.establishmentId},${scope.organizationId},'Synthetic raw service',${slug},'UTC')`;
      await tx`insert into public.personnel_employee_dossiers(id,organization_id,establishment_id,given_names,family_name,position,qualification,employment_term_type,work_time_category,entry_date) values(${scope.personnelDossierId},${scope.organizationId},${scope.establishmentId},'Synthetic','SQL Service','Test','Test','indefinite','full_time','2020-01-01')`;
      await tx`insert into public.users(id,auth_provider_id,email) values(${userId},${'synthetic-' + userId},${userId + '@example.test'})`;
    });
    // Deterministic injected synthetic provider exists only inside this guarded
    // test. No production provider or header-derived provenance is instantiated.
    foundation = createPointageServerFoundation({
      repository: createPointageRepository(admin.db),
      encodedAuthSecret: secret.toString('base64url'),
      clientAddressProvider: {
        getTrustedClientAddress: async () => ({
          address: '127.0.0.1',
          provenance: 'SERVER_VERIFIED',
        }),
      },
    });
    pin = (
      await foundation.issueCredential({
        manager: { ...manager, operation: 'pointage.credential.issue' },
        personnelDossierId: scope.personnelDossierId,
      })
    ).credential;
    repository = createPointageRawClockingRepository(writer.db);
    const otherRepository = createPointageRawClockingRepository(peer.db);
    const writerSql = writer.connection;
    const peerSql = peer.connection;
    const [holder] = await writerSql`select pg_backend_pid() as pid`;
    const [waiter] = await peerSql`select pg_backend_pid() as pid`;
    const wrapped: PointageRawClockingRepository = {
      ...repository,
      async withDossierTransaction(requested, run) {
        return repository.withDossierTransaction(
          requested,
          async (ops, personnel) => {
            if (armRace) {
              armRace = false;
              releaseFirst();
              const inspect = observer.connection;
              const deadline = Date.now() + 1500;
              let blocked = false;
              while (Date.now() < deadline) {
                const [edge] =
                  await inspect`select ${holder!.pid}::int=any(pg_blocking_pids(${waiter!.pid}::int)) as blocked`;
                if (edge?.blocked) {
                  blocked = true;
                  break;
                }
                await new Promise((resolve) => setTimeout(resolve, 10));
              }
              if (!blocked)
                throw new Error('Synthetic competing SQL lock edge missing.');
            }
            return run(ops, personnel);
          },
        );
      },
    };
    service = makeService(wrapped, writer);
    otherService = makeService(otherRepository, peer);
  });
  afterAll(async () => {
    pin = '';
    secret.fill(0);
    await Promise.all([
      admin?.connection.end(),
      writer?.connection.end(),
      peer?.connection.end(),
      observer?.connection.end(),
    ]);
  });

  it('denied state.read after successful identify commits no continuation or attendance', async () => {
    const before = await counts();
    const restricted = {
      ...foundation,
      authorizeEmployeeOperation: async (
        input: Parameters<typeof foundation.authorizeEmployeeOperation>[0],
      ) =>
        input.operation === 'pointage.employee.state.read'
          ? null
          : foundation.authorizeEmployeeOperation(input),
    };
    const result = await makeService(repository, writer, restricted).identify({
      establishmentSlug: slug,
      credential: pin,
    });
    expect(result).toEqual({ ok: false, code: 'POINTAGE_ACCESS_DENIED' });
    expect(await counts()).toEqual(before);
  });

  it('two separate restricted-writer connections compete for one transition and commit exactly one pair', async () => {
    const identified = await identify();
    firstCommand = {
      establishmentSlug: slug,
      continuation: identified.continuation,
      requestId: randomUUID(),
      kind: 'CLOCK_IN',
      observedStateGuard: identified.state.stateGuard,
    };
    firstEntered = new Promise((resolve) => {
      releaseFirst = resolve;
    });
    armRace = true;
    const first = service.mutate(firstCommand);
    await Promise.race([
      firstEntered,
      first.then(() => {
        throw new Error(
          'Synthetic first operation ended before the lock barrier.',
        );
      }),
    ]);
    const secondCommand = {
      ...firstCommand,
      requestId: randomUUID(),
    };
    expect(secondCommand.requestId).not.toBe(firstCommand.requestId);
    const second = otherService.mutate(secondCommand);
    const [accepted, rejected] = await Promise.all([first, second]);
    firstReceipt = accepted;
    expect(accepted.ok).toBe(true);
    expect(rejected).toEqual({ ok: false, code: 'POINTAGE_STATE_CONFLICT' });
    expect(await counts()).toMatchObject({ raw: 1, receipts: 1 });
    if (!accepted.ok) throw new Error('Synthetic competing SQL winner failed.');
    const [winner] = await committedPair(firstCommand.requestId);
    expect(winner).toMatchObject({
      request_id: accepted.value.requestId,
      kind: accepted.value.kind,
      accepted_at: accepted.value.acceptedAt,
      timezone_name: accepted.value.timezoneName,
      utc_offset_seconds: accepted.value.utcOffsetSeconds,
      business_date: accepted.value.businessDate,
    });
    expect(winner?.event_id).toBe(winner?.raw_event_id);
    expect(await committedPair(secondCommand.requestId)).toEqual([]);
    expect(await service.mutate(firstCommand)).toEqual(accepted);
    expect(await otherService.recover(firstCommand)).toEqual(accepted);
    expect(await counts()).toMatchObject({ raw: 1, receipts: 1 });
  });

  it('actual reset rejects old continuation replay; new identification recovers the unchanged receipt', async () => {
    pin = (
      await foundation.resetCredential({
        manager: { ...manager, operation: 'pointage.credential.reset' },
        personnelDossierId: scope.personnelDossierId,
      })
    ).credential;
    expect(await service.recover(firstCommand)).toEqual({
      ok: false,
      code: 'POINTAGE_ACCESS_DENIED',
    });
    const identified = await identify();
    expect(identified.state.status).toBe('CLOCKED_IN');
    expect(
      await service.recover({
        ...firstCommand,
        continuation: identified.continuation,
      }),
    ).toEqual(firstReceipt);
    expect(await counts()).toMatchObject({ raw: 1, receipts: 1 });
  });

  it('actual DB accepted sample at the idle boundary rolls back raw INSERT and leaves the clock definition unchanged', async () => {
    const db = admin.connection;
    const personnelDossierId = randomUUID();
    await db`insert into public.personnel_employee_dossiers(id,organization_id,establishment_id,given_names,family_name,position,qualification,employment_term_type,work_time_category,entry_date) values(${personnelDossierId},${scope.organizationId},${scope.establishmentId},'Synthetic','Idle Boundary','Test','Test','indefinite','full_time','2020-01-01')`;
    const credential = (
      await foundation.issueCredential({
        manager: { ...manager, operation: 'pointage.credential.issue' },
        personnelDossierId,
      })
    ).credential;
    const initial = await service.identify({
      establishmentSlug: slug,
      credential,
    });
    if (!initial.ok)
      throw new Error('Synthetic idle-boundary identify was unavailable.');
    const opened = await service.mutate({
      establishmentSlug: slug,
      continuation: initial.value.continuation,
      requestId: randomUUID(),
      kind: 'CLOCK_IN',
      observedStateGuard: initial.value.state.stateGuard,
    });
    if (!opened.ok)
      throw new Error('Synthetic idle-boundary prerequisite failed.');
    const current = await service.identify({
      establishmentSlug: slug,
      credential,
    });
    if (!current.ok)
      throw new Error('Synthetic idle-boundary re-identify was unavailable.');
    const localCounts = async () => {
      const [row] =
        await db`select (select count(*)::int from public.pointage_raw_events where organization_id=${scope.organizationId} and establishment_id=${scope.establishmentId} and personnel_dossier_id=${personnelDossierId}) as raw,(select count(*)::int from public.pointage_raw_command_receipts where organization_id=${scope.organizationId} and establishment_id=${scope.establishmentId} and personnel_dossier_id=${personnelDossierId}) as receipts,(select count(*)::int from public.pointage_continuations where organization_id=${scope.organizationId} and establishment_id=${scope.establishmentId} and personnel_dossier_id=${personnelDossierId}) as continuations`;
      return row;
    };
    const identified = current.value;
    const digest = digestPointageContinuation(identified.continuation)!;
    const [deadline] =
      await db`select to_char(idle_expires_at at time zone 'UTC','YYYY-MM-DD"T"HH24:MI:SS.US"Z"') as instant from public.pointage_continuations where organization_id=${scope.organizationId} and establishment_id=${scope.establishmentId} and personnel_dossier_id=${personnelDossierId} and token_digest=${digest}`;
    const [saved] =
      await db`select pg_get_functiondef('public.pointage_raw_enforce_append()'::regprocedure) as definition`;
    expect(deadline!.instant).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{6}Z$/u,
    );
    const marker = 'observed_at := pg_catalog.clock_timestamp();';
    expect(saved!.definition.split(marker)).toHaveLength(2);
    const before = await localCounts();
    try {
      // Design D7 permits a disposable test-owner clock replacement only. No
      // request/GUC/runtime switch, migration edit or historical row rewrite.
      await db.unsafe(
        saved!.definition.replace(
          marker,
          `observed_at := TIMESTAMPTZ '${deadline!.instant}';`,
        ),
      );
      expect(
        await service.mutate({
          establishmentSlug: slug,
          continuation: identified.continuation,
          requestId: randomUUID(),
          kind: 'CLOCK_OUT',
          observedStateGuard: identified.state.stateGuard,
        }),
      ).toEqual({ ok: false, code: 'POINTAGE_ACCESS_DENIED' });
      expect(await localCounts()).toEqual(before);
    } finally {
      await db.unsafe(saved!.definition);
    }
    expect(
      (
        await db`select pg_get_functiondef('public.pointage_raw_enforce_append()'::regprocedure) as definition`
      )[0]?.definition,
    ).toBe(saved!.definition);
    await writer.db.transaction((tx) => assertPointageRawDatabaseBoundary(tx));
  });

  it('two separate connections competing to CLOCK_OUT close the existing session only once', async () => {
    const fixture = await createIsolatedFixture({ label: 'Concurrent close' });
    const identified = await identifyFixture(fixture);
    const opened = await service.mutate({
      establishmentSlug: fixture.establishmentSlug,
      continuation: identified.continuation,
      requestId: randomUUID(),
      kind: 'CLOCK_IN',
      observedStateGuard: identified.state.stateGuard,
    });
    expect(opened.ok).toBe(true);
    expect(await scopedCounts(fixture.scope)).toMatchObject({
      raw: 1,
      receipts: 1,
    });
    const openState = await service.readState({
      establishmentSlug: fixture.establishmentSlug,
      continuation: identified.continuation,
    });
    expect(openState.ok).toBe(true);
    if (!openState.ok) throw new Error('Isolated open state was unavailable.');
    const command = {
      establishmentSlug: fixture.establishmentSlug,
      continuation: identified.continuation,
      requestId: randomUUID(),
      kind: 'CLOCK_OUT' as const,
      observedStateGuard: openState.value.state.stateGuard,
    };
    const competingCommand = { ...command, requestId: randomUUID() };
    expect(competingCommand.requestId).not.toBe(command.requestId);
    const blocker = await openPointageTestClient(
      process.env,
      process.env.CLOUD_DATABASE_URL!,
    );
    let releaseBlocker: () => void = () => undefined;
    const blockerRelease = new Promise<void>((resolve) => {
      releaseBlocker = resolve;
    });
    let markBlockerAcquired: () => void = () => undefined;
    const blockerAcquired = new Promise<void>((resolve) => {
      markBlockerAcquired = resolve;
    });
    const blockerTransaction = blocker.connection.begin(async (tx) => {
      const locked = await tx`
        select id from public.personnel_employee_dossiers
        where organization_id=${fixture.scope.organizationId}
          and establishment_id=${fixture.scope.establishmentId}
          and id=${fixture.scope.personnelDossierId}
        for update
      `;
      if (locked.length !== 1)
        throw new Error('Synthetic dossier blocker could not acquire its row.');
      markBlockerAcquired();
      await blockerRelease;
    });
    await Promise.race([
      blockerAcquired,
      blockerTransaction.then(() => {
        throw new Error('Synthetic dossier blocker ended before dispatch.');
      }),
    ]);
    let markFirstRepositoryEntry: () => void = () => undefined;
    const firstRepositoryEntered = new Promise<void>((resolve) => {
      markFirstRepositoryEntry = resolve;
    });
    let markSecondRepositoryEntry: () => void = () => undefined;
    const secondRepositoryEntered = new Promise<void>((resolve) => {
      markSecondRepositoryEntry = resolve;
    });
    const observeRepositoryEntry = (
      base: PointageRawClockingRepository,
      markEntered: () => void,
    ): PointageRawClockingRepository => ({
      ...base,
      async withDossierTransaction(requested, run) {
        markEntered();
        return base.withDossierTransaction(requested, run);
      },
    });
    const competingService = makeService(
      observeRepositoryEntry(repository, markFirstRepositoryEntry),
      writer,
    );
    const competingPeerService = makeService(
      observeRepositoryEntry(
        createPointageRawClockingRepository(peer.db),
        markSecondRepositoryEntry,
      ),
      peer,
    );
    let firstResolved = false;
    let secondResolved = false;
    const first = competingService.mutate(command).then((result) => {
      firstResolved = true;
      return { requestId: command.requestId, result };
    });
    const second = competingPeerService
      .mutate(competingCommand)
      .then((result) => {
        secondResolved = true;
        return { requestId: competingCommand.requestId, result };
      });
    await Promise.all([
      Promise.race([
        firstRepositoryEntered,
        first.then(() => {
          throw new Error(
            'First competing mutation ended before repository entry.',
          );
        }),
      ]),
      Promise.race([
        secondRepositoryEntered,
        second.then(() => {
          throw new Error(
            'Second competing mutation ended before repository entry.',
          );
        }),
      ]),
    ]);
    const bothPendingWhileLocked = !firstResolved && !secondResolved;
    releaseBlocker();
    await blockerTransaction;
    const outcomes = await Promise.all([first, second]);
    await blocker.connection.end();
    expect(bothPendingWhileLocked).toBe(true);
    const committed = outcomes.filter(({ result }) => result.ok);
    const conflicted = outcomes.filter(
      ({ result }) => !result.ok && result.code === 'POINTAGE_STATE_CONFLICT',
    );
    expect(committed).toHaveLength(1);
    expect(conflicted).toHaveLength(1);
    const winner = committed[0];
    const loser = conflicted[0];
    if (!winner?.result.ok || !loser)
      throw new Error('Synthetic OUT result multiset was unavailable.');
    expect(await scopedCounts(fixture.scope)).toMatchObject({
      raw: 2,
      receipts: 2,
    });
    expect(await scopedKinds(fixture.scope)).toEqual([
      { kind: 'CLOCK_IN' },
      { kind: 'CLOCK_OUT' },
    ]);
    const [winnerPair] = await committedPairFor(
      fixture.scope,
      winner.requestId,
    );
    expect(winnerPair).toMatchObject({
      request_id: winner.result.value.requestId,
      kind: winner.result.value.kind,
      accepted_at: winner.result.value.acceptedAt,
      timezone_name: winner.result.value.timezoneName,
      utc_offset_seconds: winner.result.value.utcOffsetSeconds,
      business_date: winner.result.value.businessDate,
    });
    expect(winnerPair?.event_id).toBe(winnerPair?.raw_event_id);
    expect(await committedPairFor(fixture.scope, loser.requestId)).toEqual([]);
    expect((await identifyFixture(fixture)).state.status).toBe(
      'NOT_CLOCKED_IN',
    );
  });

  it('a response lost after real COMMIT recovers the original receipt with the same tuple, without a second event', async () => {
    const fixture = await createIsolatedFixture({ label: 'lost-ack' });
    const identified = await identifyFixture(fixture);
    const command = {
      establishmentSlug: fixture.establishmentSlug,
      continuation: identified.continuation,
      requestId: randomUUID(),
      kind: 'CLOCK_IN' as const,
      observedStateGuard: identified.state.stateGuard,
    };
    const lostAcknowledgement: PointageRawClockingRepository = {
      ...repository,
      async withDossierTransaction(requested, run) {
        await repository.withDossierTransaction(requested, run);
        // The real PostgreSQL transaction has committed; only its acknowledgement
        // is lost at this controlled test boundary. No mock attendance success.
        throw new Error('Synthetic COMMIT acknowledgement loss.');
      },
    };
    const before = await scopedCounts(fixture.scope);
    const committedCounts = {
      raw: Number(before?.raw) + 1,
      receipts: Number(before?.receipts) + 1,
    };
    expect(
      await makeService(lostAcknowledgement, writer).mutate(command),
    ).toEqual({ ok: false, code: 'POINTAGE_UNAVAILABLE' });
    expect(await scopedCounts(fixture.scope)).toMatchObject(committedCounts);
    const recovered = await otherService.recover(command);
    expect(recovered.ok && recovered.value.result).toBe('COMMITTED');
    expect(await scopedCounts(fixture.scope)).toMatchObject(committedCounts);
    expect(await service.mutate(command)).toEqual(recovered);
    expect(await scopedCounts(fixture.scope)).toMatchObject(committedCounts);
    if (!recovered.ok || recovered.value.result !== 'COMMITTED')
      throw new Error('Synthetic committed recovery failed.');
    const [pair] = await committedPairFor(fixture.scope, command.requestId);
    expect(pair).toMatchObject({
      request_id: recovered.value.requestId,
      kind: recovered.value.kind,
      accepted_at: recovered.value.acceptedAt,
      timezone_name: recovered.value.timezoneName,
      utc_offset_seconds: recovered.value.utcOffsetSeconds,
      business_date: recovered.value.businessDate,
    });
    expect(pair?.event_id).toBe(pair?.raw_event_id);
  });

  it('two separate restricted-writer connections submitting the same request identity converge on one original receipt', async () => {
    const identified = await identify();
    const command = Object.freeze({
      establishmentSlug: slug,
      continuation: identified.continuation,
      requestId: randomUUID(),
      kind: 'CLOCK_OUT' as const,
      observedStateGuard: identified.state.stateGuard,
    });
    const before = await counts();
    firstEntered = new Promise((resolve) => {
      releaseFirst = resolve;
    });
    armRace = true;
    const first = service.mutate(command);
    await Promise.race([
      firstEntered,
      first.then(() => {
        throw new Error(
          'Synthetic same-identity operation ended before the lock barrier.',
        );
      }),
    ]);
    const second = otherService.mutate(command);
    const [original, replay] = await Promise.all([first, second]);
    expect(original.ok).toBe(true);
    expect(replay).toEqual(original);
    if (!original.ok) throw new Error('Synthetic same-identity winner failed.');
    expect(original.value).toMatchObject({
      requestId: command.requestId,
      kind: command.kind,
      result: 'COMMITTED',
    });
    expect(await counts()).toMatchObject({
      raw: Number(before?.raw) + 1,
      receipts: Number(before?.receipts) + 1,
    });
    const rows = await committedPair(command.requestId);
    expect(rows).toHaveLength(1);
    const [pair] = rows;
    expect(pair).toMatchObject({
      request_id: original.value.requestId,
      kind: original.value.kind,
      accepted_at: original.value.acceptedAt,
      timezone_name: original.value.timezoneName,
      utc_offset_seconds: original.value.utcOffsetSeconds,
      business_date: original.value.businessDate,
    });
    expect(pair?.event_id).toBe(pair?.raw_event_id);
  });
  it('S7 reads an actual restricted-writer snapshot and rechecks manager authority after it ends', async () => {
    const fixture = await createIsolatedFixture({
      label: 'manager-snapshot',
      dedicatedEstablishment: true,
    });
    const identified = await identifyFixture(fixture);
    const firstIn = await service.mutate({
      establishmentSlug: fixture.establishmentSlug,
      continuation: identified.continuation,
      requestId: randomUUID(),
      kind: 'CLOCK_IN',
      observedStateGuard: identified.state.stateGuard,
    });
    expect(firstIn.ok).toBe(true);
    const openState = await service.readState({
      establishmentSlug: fixture.establishmentSlug,
      continuation: identified.continuation,
    });
    expect(openState.ok).toBe(true);
    if (!openState.ok) throw new Error('Manager fixture did not open.');
    const out = await service.mutate({
      establishmentSlug: fixture.establishmentSlug,
      continuation: identified.continuation,
      requestId: randomUUID(),
      kind: 'CLOCK_OUT',
      observedStateGuard: openState.value.state.stateGuard,
    });
    expect(out.ok).toBe(true);
    const closedState = await service.readState({
      establishmentSlug: fixture.establishmentSlug,
      continuation: identified.continuation,
    });
    expect(closedState.ok).toBe(true);
    if (!closedState.ok) throw new Error('Manager fixture did not close.');
    const secondIn = await service.mutate({
      establishmentSlug: fixture.establishmentSlug,
      continuation: identified.continuation,
      requestId: randomUUID(),
      kind: 'CLOCK_IN',
      observedStateGuard: closedState.value.state.stateGuard,
    });
    expect(secondIn.ok).toBe(true);
    if (!firstIn.ok || !out.ok || !secondIn.ok)
      throw new Error('Manager fixture seed did not commit.');
    expect([
      firstIn.value.businessDate,
      out.value.businessDate,
      secondIn.value.businessDate,
    ]).toEqual([
      firstIn.value.businessDate,
      firstIn.value.businessDate,
      firstIn.value.businessDate,
    ]);
    const freshSession = {
      id: randomUUID(),
      userId,
      userName: 'Synthetic Manager',
      userEmail: 'synthetic@example.test',
      systemRole: null,
      organizationId: scope.organizationId,
      establishmentId: fixture.scope.establishmentId,
      expiresAt: new Date('2030-01-01T00:00:00Z'),
    };
    const freshTenant = {
      organizationId: scope.organizationId,
      establishmentId: fixture.scope.establishmentId,
      actor: {
        type: 'user' as const,
        userId,
        membershipId: manager.membershipId,
        role: 'OWNER' as const,
      },
      locale: 'fr-FR',
      timezone: 'UTC',
      entitlements: new Set<string>(),
    };
    let snapshotEnded = false;
    let accessReads = 0;
    const run = createPointageRawManagerRead({
      requireReady: () =>
        writer.db.transaction((tx) => assertPointageRawDatabaseBoundary(tx)),
      loadCurrentAccess: async () => {
        if (++accessReads === 2) expect(snapshotEnded).toBe(true);
        return { session: freshSession, tenant: freshTenant };
      },
      repository: {
        readEstablishmentSnapshot: async (requested) => {
          const value = await repository.readEstablishmentSnapshot(requested);
          snapshotEnded = true;
          return value;
        },
      },
    });
    const before = await scopedCounts(fixture.scope);
    const result = await run();
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error('Synthetic manager snapshot unavailable.');
    expect(result.value.currentDayEvents).toHaveLength(3);
    expect(result.value.openSessions).toHaveLength(1);
    expect(result.value.currentDayEvents.map((row) => row.kind)).toEqual([
      'CLOCK_IN',
      'CLOCK_OUT',
      'CLOCK_IN',
    ]);
    expect(
      result.value.currentDayEvents.every(
        (row) => row.personnelDossierId === fixture.scope.personnelDossierId,
      ),
    ).toBe(true);
    expect(
      new Set(
        result.value.currentDayEvents.map(
          (row) => `${row.personnelDossierId}:${row.kind}:${row.instant}`,
        ),
      ).size,
    ).toBe(3);
    expect(result.value.openSessions[0]).toEqual(
      result.value.currentDayEvents[2],
    );
    expect(accessReads).toBe(2);
    expect(await scopedCounts(fixture.scope)).toEqual(before);
    await expect(
      repository.readEstablishmentSnapshot({
        organizationId: randomUUID(),
        establishmentId: fixture.scope.establishmentId,
      }),
    ).rejects.toThrow();
  });
});

function fixture() {
  const scope = {
    organizationId: randomUUID(),
    establishmentId: randomUUID(),
    personnelDossierId: randomUUID(),
  };
  const credential: VerifiedPointageCredential = {
    ...scope,
    proofType: 'VERIFIED_POINTAGE_CREDENTIAL',
    credentialId: randomUUID(),
    credentialVersion: 1,
  };
  const personnel = {
    id: scope.personnelDossierId,
    givenNames: '  Synthétique ',
    familyName: ' Exemple  ',
    entryDate: '2020-01-01',
    departureDate: null as string | null,
    timezone: 'Europe/Paris',
  };
  const entryScope = {
    organizationId: scope.organizationId,
    establishmentId: scope.establishmentId,
    timezone: personnel.timezone,
    locale: 'fr-FR',
  };
  const clock = {
    instant: '2026-09-08T12:00:00.123456Z',
    businessDate: '2026-09-08',
  };
  const committed: Continuation[] = [];
  type Event = Awaited<
    ReturnType<PointageRawDossierOperations['readRawChain']>
  >['events'][number];
  type Receipt = NonNullable<
    Awaited<ReturnType<PointageRawDossierOperations['findCommandReceipt']>>
  >;
  const rawEvents: Event[] = [];
  const receipts: Receipt[] = [];
  let pendingEvents: Event[] = [];
  let pendingReceipts: Receipt[] = [];
  let staged: Continuation | null = null;
  let commitFailure = false;
  const calls: PointageEmployeeOperation[] = [];
  const foundation = {
    validateCredential: vi.fn(
      async (_request: {
        establishmentSlug: string;
        credential: string;
      }): Promise<PointageValidationResult> => ({
        status: 'VERIFIED' as const,
        credential,
        entryScope,
      }),
    ),
    authorizeEmployeeOperation: vi.fn(
      async ({
        operation,
        credential: proof,
      }: {
        operation: PointageEmployeeOperation;
        credential: VerifiedPointageCredential;
      }) => {
        calls.push(operation);
        return {
          actorType: 'POINTAGE_EMPLOYEE' as const,
          ...scope,
          credentialId: proof.credentialId,
          credentialVersion: proof.credentialVersion,
          operation,
        };
      },
    ),
  };
  const ops: PointageRawDossierOperations = {
    findCommandReceipt: vi.fn(
      async (requestId: string) =>
        pendingReceipts.find((row) => row.requestId === requestId) ?? null,
    ),
    appendRawEvent: vi.fn(async (kind: 'CLOCK_IN' | 'CLOCK_OUT') => {
      const event = {
        ...scope,
        id: randomUUID(),
        ordinal: String(pendingEvents.length + 1),
        kind,
        acceptedAt: clock.instant,
        timezoneName: personnel.timezone,
        utcOffsetSeconds: 7200,
        businessDate: clock.businessDate,
        receiptLinked: false,
      };
      pendingEvents.push(event);
      return event;
    }),
    insertCommandReceipt: vi.fn(
      async (
        input: Parameters<
          PointageRawDossierOperations['insertCommandReceipt']
        >[0],
      ) => {
        pendingReceipts.push({ ...scope, ...input, intentVersion: 1 });
        pendingEvents = pendingEvents.map((row) =>
          row.id === input.eventId ? { ...row, receiptLinked: true } : row,
        );
      },
    ),
    readCurrentClock: vi.fn(async () => ({ ...clock })),
    readRawChain: vi.fn(async () => ({
      events: pendingEvents,
      knownTimezoneNames: new Set([personnel.timezone]),
    })),
    lockContinuation: vi.fn(async () => null),
    findCurrentCredential: vi.fn(async () => ({
      id: credential.credentialId,
      credentialVersion: credential.credentialVersion,
    })),
    touchContinuationIdle: vi.fn(async () => null),
    endOwnContinuation: vi.fn(async () => null),
    insertContinuation: vi.fn(
      async (
        input: Parameters<
          PointageRawDossierOperations['insertContinuation']
        >[0],
      ) => {
        staged = {
          ...scope,
          ...input,
          id: randomUUID(),
          issuedAt: clock.instant,
          absoluteExpiresAt: shiftPointageInstant(clock.instant, 120),
          idleExpiresAt: shiftPointageInstant(clock.instant, 60),
          endedAt: null,
        };
        return staged;
      },
    ),
  };
  const repository: PointageRawClockingRepository = {
    async readEstablishmentSnapshot() {
      throw new Error('Employee tests must not request manager visibility.');
    },
    async findContinuationCandidate(requested, digest) {
      const row = committed.find(
        (row) =>
          row.organizationId === requested.organizationId &&
          row.establishmentId === requested.establishmentId &&
          row.tokenDigest === digest,
      );
      return row
        ? { id: row.id, personnelDossierId: row.personnelDossierId }
        : null;
    },
    withDossierTransaction: vi.fn(async (requested, run) => {
      expect(requested).toEqual(scope);
      staged = null;
      pendingEvents = [...rawEvents];
      pendingReceipts = [...receipts];
      try {
        const result = await run(ops, personnel);
        if (commitFailure) throw new Error('Synthetic unknown COMMIT.');
        rawEvents.splice(0, rawEvents.length, ...pendingEvents);
        receipts.splice(0, receipts.length, ...pendingReceipts);
        if (staged) {
          const index = committed.findIndex((row) => row.id === staged!.id);
          if (index < 0) committed.push(staged);
          else committed[index] = staged;
        }
        return result;
      } catch (error: unknown) {
        staged = null;
        throw error;
      }
    }),
  };
  const requireReady = vi.fn(async () => undefined);
  const resolveEntryScope = vi.fn(async () => entryScope);
  vi.mocked(ops.lockContinuation).mockImplementation(
    async (id) => committed.find((row) => row.id === id) ?? null,
  );
  vi.mocked(ops.touchContinuationIdle).mockImplementation(async (id) => {
    const row = committed.find((row) => row.id === id);
    if (!row || row.endedAt !== null) return null;
    staged = { ...row };
    return staged;
  });
  vi.mocked(ops.endOwnContinuation).mockImplementation(async (id) => {
    const row = committed.find((row) => row.id === id);
    if (!row) return null;
    staged = { ...row, endedAt: row.endedAt ?? clock.instant };
    return staged;
  });
  const generate = vi.fn(generatePointageContinuation);
  const service = createPointageRawClockingService({
    foundation,
    repository,
    requireReady,
    resolveEntryScope,
    stateGuardKey: Buffer.alloc(32, 5),
    generateContinuation: generate,
  });
  const request = {
    establishmentSlug: 'synthetic-establishment',
    credential: '12345678',
  };
  return {
    service,
    repository,
    foundation,
    ops,
    personnel,
    credential,
    clock,
    committed,
    rawEvents,
    receipts,
    calls,
    requireReady,
    resolveEntryScope,
    generate,
    request,
    setCommitFailure: () => {
      commitFailure = true;
    },
  };
}

function shiftPointageInstant(instant: string, seconds: number): string {
  const match = /^(.*\.)(\d{3})(\d{3})Z$/.exec(instant);
  if (match === null)
    throw new Error('Synthetic instant must use microseconds.');
  const shifted = new Date(
    Date.parse(`${match[1]}${match[2]}Z`) + seconds * 1_000,
  ).toISOString();
  return shifted.replace(/\.\d{3}Z$/, `.${match[2]}${match[3]}Z`);
}

describe('S3 dual-authority identify and S8 minimal Personnel projection', () => {
  it.each(['organization', 'establishment'] as const)(
    'R3 denies credential identification in the wrong trusted %s without partial authority',
    async (boundary) => {
      const f = fixture();
      const credential = f.request.credential;
      const secret = Buffer.alloc(32, 31);
      const encodedAuthSecret = secret.toString('base64url');
      const keys = derivePointageCredentialKeys(secret);
      const verifier = await createPointageCredentialVerifier(keys, credential);
      const credentialScope = {
        organizationId: f.credential.organizationId,
        establishmentId: f.credential.establishmentId,
      };
      const trustedScope = {
        organizationId:
          boundary === 'organization'
            ? randomUUID()
            : credentialScope.organizationId,
        establishmentId:
          boundary === 'establishment'
            ? randomUUID()
            : credentialScope.establishmentId,
        timezone: f.personnel.timezone,
        locale: 'fr-FR',
      };
      const lookup = createPointageLookupDigest(
        keys,
        credentialScope,
        credential,
      );
      const findCredentialCandidate = vi.fn(async (_scope, digest: string) =>
        digest === lookup
          ? {
              id: f.credential.credentialId,
              personnelDossierId: f.credential.personnelDossierId,
              credentialVersion: f.credential.credentialVersion,
              credentialFormatVersion: 1,
              algorithmVersion: 'scrypt-v1' as const,
              keyVersion: 1,
              salt: verifier.salt,
              verifier: verifier.verifier,
              supersededAt: null,
            }
          : null,
      );
      const foundation = createPointageServerFoundation({
        repository: {
          resolveActiveEntryScope: vi.fn(async () => trustedScope),
          findCredentialCandidate,
          findPersonnelEmploymentPeriod: vi.fn(async () => null),
          isRateLimitBlocked: vi.fn(async () => false),
          recordRateLimitFailure: vi.fn(async () => ({
            blocked: false,
            failureCount: 1,
          })),
          resetCandidateRateLimit: vi.fn(async () => undefined),
          appendAudit: vi.fn(async () => undefined),
        },
        encodedAuthSecret,
        clientAddressProvider: {
          getTrustedClientAddress: vi.fn(async () => ({
            address: '203.0.113.31',
            provenance: 'SERVER_VERIFIED' as const,
          })),
        },
      });
      f.foundation.validateCredential.mockImplementation(
        foundation.validateCredential,
      );

      const result = await f.service.identify(f.request);

      expect(result).toEqual({ ok: false, code: 'POINTAGE_ACCESS_DENIED' });
      expect(result).not.toHaveProperty('value');
      expect(JSON.stringify(result)).not.toContain(
        f.personnel.givenNames.trim(),
      );
      expect(JSON.stringify(result)).not.toContain(
        f.credential.personnelDossierId,
      );
      expect(findCredentialCandidate).toHaveBeenCalledOnce();
      expect(f.repository.withDossierTransaction).not.toHaveBeenCalled();
      expect(f.committed).toEqual([]);
      expect(f.rawEvents).toEqual([]);
      expect(f.receipts).toEqual([]);
      expect(f.generate).not.toHaveBeenCalled();
    },
  );

  it.each(['Personnel', 'foundation'] as const)(
    'A2.1 rejects same-establishment %s dossier substitution without protected access or identity transfer',
    async (boundary) => {
      const f = fixture();
      const identified = await f.service.identify(f.request);
      expect(identified.ok).toBe(true);
      if (!identified.ok) throw new Error('Synthetic identify failed.');
      const before = structuredClone(f.committed);
      expect(before).toHaveLength(1);
      const bound = before[0]!;
      const attempted = {
        organizationId: bound.organizationId,
        establishmentId: bound.establishmentId,
        personnelDossierId: randomUUID(),
      };
      expect(attempted.organizationId).toBe(f.credential.organizationId);
      expect(attempted.establishmentId).toBe(f.credential.establishmentId);
      expect(attempted.personnelDossierId).not.toBe(bound.personnelDossierId);
      expect(bound.personnelDossierId).toBe(f.credential.personnelDossierId);
      expect(bound.tokenDigest).toBe(
        digestPointageContinuation(identified.value.continuation),
      );
      // Discard successful identification calls, not their implementations/state.
      vi.clearAllMocks();
      if (boundary === 'Personnel') {
        f.personnel.id = attempted.personnelDossierId;
        f.personnel.givenNames = 'Other synthetic';
        f.personnel.familyName = 'Dossier';
      } else {
        const original =
          f.foundation.authorizeEmployeeOperation.getMockImplementation()!;
        f.foundation.authorizeEmployeeOperation.mockImplementation(
          async (input) => ({
            ...(await original(input)),
            personnelDossierId: attempted.personnelDossierId,
          }),
        );
      }
      const result = await f.service.readState({
        establishmentSlug: f.request.establishmentSlug,
        continuation: identified.value.continuation,
      });
      expect(result).toEqual({ ok: false, code: 'POINTAGE_ACCESS_DENIED' });
      expect(JSON.stringify(result)).not.toContain(
        attempted.personnelDossierId,
      );
      expect(JSON.stringify(result)).not.toContain('Other synthetic');
      expect(result).not.toHaveProperty('value');
      expect(f.ops.lockContinuation).toHaveBeenCalledExactlyOnceWith(bound.id);
      expect(await f.resolveEntryScope()).toMatchObject({
        organizationId: bound.organizationId,
        establishmentId: bound.establishmentId,
      });
      for (const method of [
        f.ops.readRawChain,
        f.ops.findCommandReceipt,
        f.ops.appendRawEvent,
        f.ops.insertCommandReceipt,
        f.ops.touchContinuationIdle,
        f.ops.endOwnContinuation,
        f.ops.insertContinuation,
      ])
        expect(method).not.toHaveBeenCalled();
      expect(f.committed).toEqual(before);
      expect(f.rawEvents).toEqual([]);
      expect(f.receipts).toEqual([]);
      expect(f.generate).not.toHaveBeenCalled();
      if (boundary === 'Personnel') {
        expect(f.foundation.authorizeEmployeeOperation).not.toHaveBeenCalled();
      } else {
        expect(f.personnel.id).toBe(bound.personnelDossierId);
        expect(f.foundation.authorizeEmployeeOperation).toHaveBeenCalledOnce();
        expect(f.foundation.authorizeEmployeeOperation).toHaveBeenCalledWith(
          expect.objectContaining({
            credential: expect.objectContaining({
              organizationId: bound.organizationId,
              establishmentId: bound.establishmentId,
              personnelDossierId: bound.personnelDossierId,
            }),
            operation: 'pointage.employee.state.read',
          }),
        );
      }
    },
  );

  it.each([
    ['Personnel', 'mutate'],
    ['Personnel', 'recover'],
    ['foundation', 'mutate'],
    ['foundation', 'recover'],
  ] as const)(
    'R3 rejects same-establishment %s dossier substitution during %s without protected effects',
    async (boundary, consumer) => {
      const f = fixture();
      const identified = await f.service.identify(f.request);
      if (!identified.ok) throw new Error('Synthetic identify failed.');
      const command = {
        establishmentSlug: f.request.establishmentSlug,
        continuation: identified.value.continuation,
        requestId: randomUUID(),
        kind: 'CLOCK_IN' as const,
        observedStateGuard: identified.value.state.stateGuard,
      };
      if (consumer === 'recover') {
        const committed = await f.service.mutate(command);
        expect(committed.ok).toBe(true);
      }
      const before = {
        raw: structuredClone(f.rawEvents),
        receipts: structuredClone(f.receipts),
        continuation: structuredClone(f.committed),
      };
      for (const method of Object.values(f.ops)) vi.mocked(method).mockClear();
      f.foundation.authorizeEmployeeOperation.mockClear();
      f.calls.length = 0;
      const attemptedDossier = randomUUID();
      if (boundary === 'Personnel') {
        f.personnel.id = attemptedDossier;
        f.personnel.givenNames = 'Other synthetic';
      } else {
        const original =
          f.foundation.authorizeEmployeeOperation.getMockImplementation()!;
        f.foundation.authorizeEmployeeOperation.mockImplementation(
          async (input) => ({
            ...(await original(input)),
            personnelDossierId: attemptedDossier,
          }),
        );
      }

      const result = await f.service[consumer](command);

      expect(result).toEqual({ ok: false, code: 'POINTAGE_ACCESS_DENIED' });
      expect(result).not.toHaveProperty('value');
      expect(JSON.stringify(result)).not.toContain(attemptedDossier);
      expect(JSON.stringify(result)).not.toContain('Other synthetic');
      expect(f.ops.appendRawEvent).not.toHaveBeenCalled();
      expect(f.ops.insertCommandReceipt).not.toHaveBeenCalled();
      expect(f.ops.touchContinuationIdle).not.toHaveBeenCalled();
      expect(f.rawEvents).toEqual(before.raw);
      expect(f.receipts).toEqual(before.receipts);
      expect(f.committed).toEqual(before.continuation);
    },
  );

  it.each(['identify', 'state', 'mutate', 'recover'] as const)(
    'R3 fails %s closed when current Personnel lifecycle cannot be read',
    async (consumer) => {
      const f = fixture();
      let request:
        | typeof f.request
        | {
            establishmentSlug: string;
            continuation: string;
            requestId: string;
            kind: 'CLOCK_IN';
            observedStateGuard: string;
          } = f.request;
      if (consumer !== 'identify') {
        const identified = await f.service.identify(f.request);
        if (!identified.ok) throw new Error('Synthetic identify failed.');
        request = {
          establishmentSlug: f.request.establishmentSlug,
          continuation: identified.value.continuation,
          requestId: randomUUID(),
          kind: 'CLOCK_IN',
          observedStateGuard: identified.value.state.stateGuard,
        };
        if (consumer === 'recover') {
          const committed = await f.service.mutate(request);
          expect(committed.ok).toBe(true);
        }
      }
      const before = {
        raw: structuredClone(f.rawEvents),
        receipts: structuredClone(f.receipts),
        continuation: structuredClone(f.committed),
      };
      for (const method of Object.values(f.ops)) vi.mocked(method).mockClear();
      vi.mocked(f.repository.withDossierTransaction).mockRejectedValueOnce(
        new Error('Synthetic Personnel lifecycle unavailable.'),
      );

      let result;
      if (consumer === 'identify') {
        result = await f.service.identify(f.request);
      } else {
        if (!('continuation' in request))
          throw new Error('Synthetic continuation request is unavailable.');
        result =
          consumer === 'state'
            ? await f.service.readState(request)
            : await f.service[consumer](request);
      }

      expect(result).toEqual({ ok: false, code: 'POINTAGE_UNAVAILABLE' });
      expect(result).not.toHaveProperty('value');
      expect(f.ops.readRawChain).not.toHaveBeenCalled();
      expect(f.ops.findCommandReceipt).not.toHaveBeenCalled();
      expect(f.ops.appendRawEvent).not.toHaveBeenCalled();
      expect(f.ops.insertCommandReceipt).not.toHaveBeenCalled();
      expect(f.ops.touchContinuationIdle).not.toHaveBeenCalled();
      expect(f.rawEvents).toEqual(before.raw);
      expect(f.receipts).toEqual(before.receipts);
      expect(f.committed).toEqual(before.continuation);
    },
  );

  for (const denied of [false, true]) {
    it.each([
      ['state', 'CLOCK_IN', 'pointage.employee.state.read', 3],
      ['mutate', 'CLOCK_IN', 'pointage.employee.operation.create', 3],
      ['mutate', 'CLOCK_OUT', 'pointage.employee.operation.create', 3],
      ['recover', 'CLOCK_IN', 'pointage.employee.operation.create', 2],
      ['recover', 'CLOCK_OUT', 'pointage.employee.operation.create', 2],
    ] as const)(
      `A1.1 continuation %s %s exact authority (denied=${denied})`,
      async (consumer, kind, expectedOperation, checks) => {
        const f = fixture();
        const identified = await f.service.identify(f.request);
        if (!identified.ok) throw new Error('Synthetic identify failed.');
        const auth = {
          establishmentSlug: f.request.establishmentSlug,
          continuation: identified.value.continuation,
        };
        let guard = identified.value.state.stateGuard;
        if (kind === 'CLOCK_OUT') {
          expect(
            (
              await f.service.mutate({
                ...auth,
                requestId: randomUUID(),
                kind: 'CLOCK_IN',
                observedStateGuard: guard,
              })
            ).ok,
          ).toBe(true);
          const opened = await f.service.readState(auth);
          if (!opened.ok) throw new Error('Synthetic open state failed.');
          guard = opened.value.state.stateGuard;
        }
        const tuple = Object.freeze({
          ...auth,
          requestId: randomUUID(),
          kind,
          observedStateGuard: guard,
        });
        const committed =
          consumer === 'recover' ? await f.service.mutate(tuple) : null;
        if (committed !== null) expect(committed.ok).toBe(true);
        const before = { raw: [...f.rawEvents], receipts: [...f.receipts] };
        for (const method of Object.values(f.ops))
          vi.mocked(method).mockClear();
        f.calls.length = 0;
        f.foundation.authorizeEmployeeOperation.mockClear();
        const original =
          f.foundation.authorizeEmployeeOperation.getMockImplementation()!;
        f.foundation.authorizeEmployeeOperation.mockImplementation(
          async (input) => {
            expect(input).toEqual({
              credential: f.credential,
              entryScope: {
                organizationId: f.credential.organizationId,
                establishmentId: f.credential.establishmentId,
                timezone: f.personnel.timezone,
                locale: 'fr-FR',
              },
              operation: expectedOperation,
            });
            // A validated, scoped locked continuation and current credential must
            // precede the first authority call, never a receipt or prior success.
            expect(f.ops.lockContinuation).toHaveBeenCalledWith(
              f.committed[0]!.id,
            );
            expect(f.ops.findCurrentCredential).toHaveBeenCalled();
            if (f.calls.length === 0) {
              expect(f.ops.readRawChain).not.toHaveBeenCalled();
              expect(f.ops.findCommandReceipt).not.toHaveBeenCalled();
              expect(f.ops.appendRawEvent).not.toHaveBeenCalled();
            }
            const actor = await original(input);
            return denied
              ? { ...actor, operation: 'pointage.employee.identify' as const }
              : actor;
          },
        );
        const result =
          consumer === 'state'
            ? await f.service.readState(auth)
            : await f.service[consumer](tuple);
        expect(f.calls).toEqual(
          Array(denied ? 1 : checks).fill(expectedOperation),
        );
        if (denied) {
          expect(result).toEqual({ ok: false, code: 'POINTAGE_ACCESS_DENIED' });
          expect(f.ops.readRawChain).not.toHaveBeenCalled();
          expect(f.ops.findCommandReceipt).not.toHaveBeenCalled();
          expect(f.ops.appendRawEvent).not.toHaveBeenCalled();
          expect(f.ops.insertCommandReceipt).not.toHaveBeenCalled();
          expect(f.ops.touchContinuationIdle).not.toHaveBeenCalled();
        } else {
          expect(result.ok).toBe(true);
          if (consumer === 'recover') {
            expect(result).toEqual(committed);
            expect(f.ops.findCommandReceipt).toHaveBeenCalledExactlyOnceWith(
              tuple.requestId,
            );
            expect(f.ops.appendRawEvent).not.toHaveBeenCalled();
          } else if (consumer === 'mutate') {
            expect(f.ops.appendRawEvent).toHaveBeenCalledExactlyOnceWith(kind);
            expect(result).toMatchObject({
              value: { kind, requestId: tuple.requestId },
            });
          }
        }
        if (denied || consumer !== 'mutate') {
          expect(f.rawEvents).toEqual(before.raw);
          expect(f.receipts).toEqual(before.receipts);
        }
      },
    );
  }
  for (const operation of ['mutate', 'recover'] as const) {
    it.each(['upcoming', 'former', 'idle-expiry', 'ended'] as const)(
      `${operation} checks current lifecycle/lifetime: %s`,
      async (mode) => {
        const f = fixture();
        const identified = await f.service.identify(f.request);
        if (!identified.ok) throw new Error('Synthetic identify failed.');
        if (mode === 'upcoming') f.personnel.entryDate = '2026-09-09';
        if (mode === 'former') f.personnel.departureDate = '2026-09-07';
        if (mode === 'idle-expiry')
          f.clock.instant = '2026-09-08T12:01:00.123456Z';
        if (mode === 'ended')
          f.committed[0] = { ...f.committed[0]!, endedAt: f.clock.instant };
        expect(
          await f.service[operation]({
            establishmentSlug: f.request.establishmentSlug,
            continuation: identified.value.continuation,
            requestId: randomUUID(),
            kind: 'CLOCK_IN',
            observedStateGuard: identified.value.state.stateGuard,
          }),
        ).toEqual({ ok: false, code: 'POINTAGE_ACCESS_DENIED' });
        expect(f.ops.findCommandReceipt).not.toHaveBeenCalled();
        expect(f.ops.appendRawEvent).not.toHaveBeenCalled();
        expect(f.ops.touchContinuationIdle).not.toHaveBeenCalled();
      },
    );
  }

  it('A3.3 denies CLOCK_OUT after departure while preserving the existing open session', async () => {
    const f = fixture();
    const identified = await f.service.identify(f.request);
    if (!identified.ok) throw new Error('Synthetic identify failed.');
    const auth = {
      establishmentSlug: f.request.establishmentSlug,
      continuation: identified.value.continuation,
    };
    expect(
      (
        await f.service.mutate({
          ...auth,
          requestId: randomUUID(),
          kind: 'CLOCK_IN',
          observedStateGuard: identified.value.state.stateGuard,
        })
      ).ok,
    ).toBe(true);
    const opened = await f.service.readState(auth);
    if (!opened.ok) throw new Error('Synthetic open state failed.');
    expect(opened.value.state.status).toBe('CLOCKED_IN');
    expect(opened.value.state.openSessionStart).toMatchObject({
      instant: f.clock.instant,
      businessDate: f.clock.businessDate,
    });
    expect(f.rawEvents).toHaveLength(1);
    expect(f.rawEvents[0]).toMatchObject({
      kind: 'CLOCK_IN',
      acceptedAt: f.clock.instant,
      businessDate: f.clock.businessDate,
      receiptLinked: true,
    });
    const openChain = f.rawEvents.map((event) => ({ ...event }));
    const continuation = f.committed[0]!;
    expect(continuation.endedAt).toBeNull();
    expect(continuation.credentialId).toBe(f.credential.credentialId);
    expect(continuation.credentialVersion).toBe(f.credential.credentialVersion);
    expect(continuation.idleExpiresAt > f.clock.instant).toBe(true);
    expect(continuation.absoluteExpiresAt > f.clock.instant).toBe(true);

    for (const method of Object.values(f.ops)) vi.mocked(method).mockClear();
    f.foundation.authorizeEmployeeOperation.mockClear();
    f.calls.length = 0;
    f.personnel.departureDate = '2026-09-07';

    const result = await f.service.mutate({
      ...auth,
      requestId: randomUUID(),
      kind: 'CLOCK_OUT',
      observedStateGuard: opened.value.state.stateGuard,
    });

    expect(result).toEqual({ ok: false, code: 'POINTAGE_ACCESS_DENIED' });
    expect(Object.keys(result).sort()).toEqual(['code', 'ok']);
    expect(f.ops.lockContinuation).toHaveBeenCalledExactlyOnceWith(
      continuation.id,
    );
    expect(f.ops.readCurrentClock).toHaveBeenCalledOnce();
    expect(f.ops.findCurrentCredential).not.toHaveBeenCalled();
    expect(f.foundation.authorizeEmployeeOperation).not.toHaveBeenCalled();
    expect(f.ops.readRawChain).not.toHaveBeenCalled();
    expect(f.ops.appendRawEvent).not.toHaveBeenCalled();
    expect(f.ops.insertCommandReceipt).not.toHaveBeenCalled();
    expect(f.ops.touchContinuationIdle).not.toHaveBeenCalled();
    expect(f.rawEvents).toEqual(openChain);
    expect(f.rawEvents).toHaveLength(1);
    expect(f.rawEvents.some((event) => event.kind === 'CLOCK_OUT')).toBe(false);
    expect(f.receipts).toHaveLength(1);
    expect(f.committed[0]).toEqual(continuation);
  });

  it.each([
    ['entry-date', 'identify'],
    ['entry-date', 'state.read'],
    ['entry-date', 'operation.create'],
    ['final-departure-date', 'identify'],
    ['final-departure-date', 'state.read'],
    ['final-departure-date', 'operation.create'],
  ] as const)(
    'A3.4 %s boundary accepts %s with exact authority',
    async (boundary, operation) => {
      const f = fixture();
      if (boundary === 'entry-date') {
        f.personnel.entryDate = f.clock.businessDate;
        expect(f.personnel.entryDate).toBe(f.clock.businessDate);
      } else {
        f.personnel.departureDate = f.clock.businessDate;
        expect(f.personnel.departureDate).toBe(f.clock.businessDate);
      }
      expect(f.personnel.timezone).toBe('Europe/Paris');

      const identified = await f.service.identify(f.request);
      expect(identified.ok).toBe(true);
      if (!identified.ok) throw new Error('Synthetic identify failed.');

      if (operation === 'identify') {
        const expectedOperations = [
          'pointage.employee.identify',
          'pointage.employee.state.read',
          'pointage.employee.identify',
          'pointage.employee.state.read',
          'pointage.employee.identify',
          'pointage.employee.state.read',
        ] as const;
        expect(f.foundation.validateCredential).toHaveBeenCalledOnce();
        expect(f.calls).toEqual(expectedOperations);
        expect(f.foundation.authorizeEmployeeOperation).toHaveBeenCalledTimes(
          expectedOperations.length,
        );
        for (const [
          index,
          [input],
        ] of f.foundation.authorizeEmployeeOperation.mock.calls.entries())
          expect(input).toEqual({
            credential: f.credential,
            entryScope: {
              organizationId: f.credential.organizationId,
              establishmentId: f.credential.establishmentId,
              timezone: f.personnel.timezone,
              locale: 'fr-FR',
            },
            operation: expectedOperations[index],
          });
        expect(f.ops.readCurrentClock).toHaveBeenCalledTimes(4);
        expect(f.ops.insertContinuation).toHaveBeenCalledOnce();
        expect(f.committed).toHaveLength(1);
        expect(identified.value.state.status).toBe('NOT_CLOCKED_IN');
        return;
      }

      vi.clearAllMocks();
      f.calls.length = 0;
      const auth = {
        establishmentSlug: f.request.establishmentSlug,
        continuation: identified.value.continuation,
      };
      const expectedOperation =
        operation === 'state.read'
          ? ('pointage.employee.state.read' as const)
          : ('pointage.employee.operation.create' as const);

      if (operation === 'state.read') {
        const result = await f.service.readState(auth);
        expect(result.ok).toBe(true);
        if (!result.ok) throw new Error('Synthetic state read failed.');
        expect(result.value.state.status).toBe('NOT_CLOCKED_IN');
        expect(result.value.state.displayName).toBe('Synthétique Exemple');
        expect(f.ops.appendRawEvent).not.toHaveBeenCalled();
        expect(f.ops.insertCommandReceipt).not.toHaveBeenCalled();
      } else {
        const result = await f.service.mutate({
          ...auth,
          requestId: randomUUID(),
          kind: 'CLOCK_IN',
          observedStateGuard: identified.value.state.stateGuard,
        });
        expect(result.ok).toBe(true);
        if (!result.ok) throw new Error('Synthetic mutation failed.');
        expect(result.value.kind).toBe('CLOCK_IN');
        expect(result.value.businessDate).toBe(f.clock.businessDate);
        expect(f.ops.appendRawEvent).toHaveBeenCalledExactlyOnceWith(
          'CLOCK_IN',
        );
        expect(f.ops.insertCommandReceipt).toHaveBeenCalledOnce();
        expect(f.rawEvents).toHaveLength(1);
        expect(f.receipts).toHaveLength(1);
      }

      expect(f.calls).toEqual(Array(3).fill(expectedOperation));
      expect(f.foundation.authorizeEmployeeOperation).toHaveBeenCalledTimes(3);
      for (const [input] of f.foundation.authorizeEmployeeOperation.mock.calls)
        expect(input).toEqual({
          credential: f.credential,
          entryScope: {
            organizationId: f.credential.organizationId,
            establishmentId: f.credential.establishmentId,
            timezone: f.personnel.timezone,
            locale: 'fr-FR',
          },
          operation: expectedOperation,
        });
      expect(f.ops.lockContinuation).toHaveBeenCalledExactlyOnceWith(
        f.committed[0]!.id,
      );
      expect(f.ops.readCurrentClock).toHaveBeenCalled();
      expect(f.ops.findCurrentCredential).toHaveBeenCalledTimes(3);
      expect(f.ops.touchContinuationIdle).toHaveBeenCalledOnce();
    },
  );

  it.each([
    ['state.read', 'malformed'],
    ['state.read', 'inverted'],
    ['operation.create', 'malformed'],
    ['operation.create', 'inverted'],
  ] as const)(
    'A3.5 denies %s when current lifecycle becomes %s despite valid continuation',
    async (operation, lifecycle) => {
      const f = fixture();
      const identified = await f.service.identify(f.request);
      expect(identified.ok).toBe(true);
      if (!identified.ok) throw new Error('Synthetic identify failed.');
      expect(identified.value.state.status).toBe('NOT_CLOCKED_IN');
      const continuation = structuredClone(f.committed[0]!);
      expect(continuation.endedAt).toBeNull();
      expect(continuation.idleExpiresAt > f.clock.instant).toBe(true);
      expect(continuation.absoluteExpiresAt > f.clock.instant).toBe(true);
      expect(continuation).toMatchObject({
        organizationId: f.credential.organizationId,
        establishmentId: f.credential.establishmentId,
        personnelDossierId: f.credential.personnelDossierId,
        credentialId: f.credential.credentialId,
        credentialVersion: f.credential.credentialVersion,
      });
      const before = {
        raw: structuredClone(f.rawEvents),
        receipts: structuredClone(f.receipts),
      };

      vi.clearAllMocks();
      f.calls.length = 0;
      if (lifecycle === 'malformed') {
        f.personnel.entryDate = '2026-02-30';
        expect(f.personnel.entryDate).toBe('2026-02-30');
      } else {
        f.personnel.departureDate = '2019-01-01';
        expect(f.personnel.departureDate < f.personnel.entryDate).toBe(true);
      }

      const auth = {
        establishmentSlug: f.request.establishmentSlug,
        continuation: identified.value.continuation,
      };
      const result =
        operation === 'state.read'
          ? await f.service.readState(auth)
          : await f.service.mutate({
              ...auth,
              requestId: randomUUID(),
              kind: 'CLOCK_IN',
              observedStateGuard: identified.value.state.stateGuard,
            });

      expect(result).toEqual({ ok: false, code: 'POINTAGE_ACCESS_DENIED' });
      expect(Object.keys(result).sort()).toEqual(['code', 'ok']);
      expect(JSON.stringify(result)).not.toContain(
        f.personnel.givenNames.trim(),
      );
      expect(JSON.stringify(result)).not.toContain(
        f.credential.personnelDossierId,
      );
      expect(f.ops.lockContinuation).toHaveBeenCalledExactlyOnceWith(
        continuation.id,
      );
      expect(f.ops.readCurrentClock).toHaveBeenCalledOnce();
      expect(f.ops.findCurrentCredential).not.toHaveBeenCalled();
      expect(f.foundation.authorizeEmployeeOperation).not.toHaveBeenCalled();
      expect(f.calls).toEqual([]);
      expect(f.ops.readRawChain).not.toHaveBeenCalled();
      expect(f.ops.findCommandReceipt).not.toHaveBeenCalled();
      expect(f.ops.appendRawEvent).not.toHaveBeenCalled();
      expect(f.ops.insertCommandReceipt).not.toHaveBeenCalled();
      expect(f.ops.touchContinuationIdle).not.toHaveBeenCalled();
      expect(f.rawEvents).toEqual(before.raw);
      expect(f.receipts).toEqual(before.receipts);
      expect(f.committed).toEqual([continuation]);
    },
  );

  it('A4.1 revalidates current authority and replays the original committed receipt without new side effects', async () => {
    const f = fixture();
    const identified = await f.service.identify(f.request);
    if (!identified.ok) throw new Error('Synthetic identify failed.');
    const continuation = f.committed[0]!;
    expect(continuation).toMatchObject({
      organizationId: f.credential.organizationId,
      establishmentId: f.credential.establishmentId,
      personnelDossierId: f.credential.personnelDossierId,
      credentialId: f.credential.credentialId,
      credentialVersion: f.credential.credentialVersion,
      endedAt: null,
    });
    expect(continuation.idleExpiresAt > f.clock.instant).toBe(true);
    expect(continuation.absoluteExpiresAt > f.clock.instant).toBe(true);
    expect(f.personnel.entryDate <= f.clock.businessDate).toBe(true);
    expect(f.personnel.departureDate).toBeNull();
    const auth = {
      establishmentSlug: f.request.establishmentSlug,
      continuation: identified.value.continuation,
    };
    const command = Object.freeze({
      ...auth,
      requestId: randomUUID(),
      kind: 'CLOCK_IN' as const,
      observedStateGuard: identified.value.state.stateGuard,
    });

    // Phase A: establish one committed request tuple and its canonical receipt.
    for (const method of Object.values(f.ops)) vi.mocked(method).mockClear();
    f.foundation.authorizeEmployeeOperation.mockClear();
    f.calls.length = 0;
    const first = await f.service.mutate(command);
    expect(first.ok).toBe(true);
    if (!first.ok) throw new Error('Synthetic mutation failed.');
    expect(first.value).toEqual({
      requestId: command.requestId,
      result: 'COMMITTED',
      kind: command.kind,
      acceptedAt: f.clock.instant,
      timezoneName: f.personnel.timezone,
      utcOffsetSeconds: 7200,
      businessDate: f.clock.businessDate,
    });
    expect(f.rawEvents).toHaveLength(1);
    expect(f.receipts).toHaveLength(1);
    expect(f.rawEvents[0]).toMatchObject({
      organizationId: f.credential.organizationId,
      establishmentId: f.credential.establishmentId,
      personnelDossierId: f.credential.personnelDossierId,
      kind: command.kind,
      acceptedAt: first.value.acceptedAt,
      timezoneName: first.value.timezoneName,
      utcOffsetSeconds: first.value.utcOffsetSeconds,
      businessDate: first.value.businessDate,
      receiptLinked: true,
    });
    expect(f.receipts[0]).toMatchObject({
      organizationId: f.credential.organizationId,
      establishmentId: f.credential.establishmentId,
      personnelDossierId: f.credential.personnelDossierId,
      requestId: command.requestId,
      eventId: f.rawEvents[0]!.id,
      intentVersion: 1,
    });
    expect(f.ops.appendRawEvent).toHaveBeenCalledExactlyOnceWith('CLOCK_IN');
    expect(f.ops.insertCommandReceipt).toHaveBeenCalledOnce();
    expect(f.ops.findCurrentCredential).toHaveBeenCalledTimes(3);
    expect(f.calls).toEqual(
      Array(3).fill('pointage.employee.operation.create'),
    );
    for (const [input] of f.foundation.authorizeEmployeeOperation.mock.calls)
      expect(input).toEqual({
        credential: f.credential,
        entryScope: {
          organizationId: f.credential.organizationId,
          establishmentId: f.credential.establishmentId,
          timezone: f.personnel.timezone,
          locale: 'fr-FR',
        },
        operation: 'pointage.employee.operation.create',
      });

    const originalReceipt = structuredClone(first.value);
    const rawAfterCommit = structuredClone(f.rawEvents);
    const receiptsAfterCommit = structuredClone(f.receipts);
    const continuationAfterCommit = structuredClone(f.committed);

    // Phase B: keep the same authorized tuple and observe current lifecycle reads.
    const currentEntryDate = f.personnel.entryDate;
    const currentDepartureDate = f.personnel.departureDate;
    const entryDateRead = vi.fn(() => currentEntryDate);
    const departureDateRead = vi.fn(() => currentDepartureDate);
    Object.defineProperty(f.personnel, 'entryDate', {
      configurable: true,
      enumerable: true,
      get: entryDateRead,
    });
    Object.defineProperty(f.personnel, 'departureDate', {
      configurable: true,
      enumerable: true,
      get: departureDateRead,
    });
    for (const method of Object.values(f.ops)) vi.mocked(method).mockClear();
    f.foundation.authorizeEmployeeOperation.mockClear();
    f.calls.length = 0;

    const replay = await f.service.mutate(command);

    expect(replay).toEqual(first);
    expect(replay.ok).toBe(true);
    if (!replay.ok) throw new Error('Synthetic replay failed.');
    expect(replay.value).toEqual(originalReceipt);
    expect(replay.value.requestId).toBe(first.value.requestId);
    expect(replay.value.result).toBe(first.value.result);
    expect(replay.value.kind).toBe(first.value.kind);
    expect(replay.value.acceptedAt).toBe(first.value.acceptedAt);
    expect(replay.value.timezoneName).toBe(first.value.timezoneName);
    expect(replay.value.utcOffsetSeconds).toBe(first.value.utcOffsetSeconds);
    expect(replay.value.businessDate).toBe(first.value.businessDate);

    expect(f.ops.lockContinuation).toHaveBeenCalledExactlyOnceWith(
      continuation.id,
    );
    expect(f.ops.readCurrentClock).toHaveBeenCalledTimes(2);
    expect(entryDateRead).toHaveBeenCalledTimes(2);
    expect(departureDateRead).toHaveBeenCalledTimes(2);
    expect(f.ops.findCurrentCredential).toHaveBeenCalledTimes(2);
    expect(f.calls).toEqual(
      Array(2).fill('pointage.employee.operation.create'),
    );
    expect(f.foundation.authorizeEmployeeOperation).toHaveBeenCalledTimes(2);
    for (const [input] of f.foundation.authorizeEmployeeOperation.mock.calls)
      expect(input).toEqual({
        credential: f.credential,
        entryScope: {
          organizationId: f.credential.organizationId,
          establishmentId: f.credential.establishmentId,
          timezone: f.personnel.timezone,
          locale: 'fr-FR',
        },
        operation: 'pointage.employee.operation.create',
      });
    expect(f.ops.findCommandReceipt).toHaveBeenCalledExactlyOnceWith(
      command.requestId,
    );
    expect(f.ops.appendRawEvent).not.toHaveBeenCalled();
    expect(f.ops.insertCommandReceipt).not.toHaveBeenCalled();
    expect(f.ops.touchContinuationIdle).toHaveBeenCalledExactlyOnceWith(
      continuation.id,
    );
    expect(f.rawEvents).toEqual(rawAfterCommit);
    expect(f.receipts).toEqual(receiptsAfterCommit);
    expect(f.committed).toEqual(continuationAfterCommit);

    const continuationLock = vi.mocked(f.ops.lockContinuation).mock
      .invocationCallOrder[0]!;
    const firstLifecycleCheck = entryDateRead.mock.invocationCallOrder[0]!;
    const firstCredentialCheck = vi.mocked(f.ops.findCurrentCredential).mock
      .invocationCallOrder[0]!;
    const firstAuthorityCheck =
      f.foundation.authorizeEmployeeOperation.mock.invocationCallOrder[0]!;
    const receiptLookup = vi.mocked(f.ops.findCommandReceipt).mock
      .invocationCallOrder[0]!;
    const secondLifecycleCheck = entryDateRead.mock.invocationCallOrder[1]!;
    const secondCredentialCheck = vi.mocked(f.ops.findCurrentCredential).mock
      .invocationCallOrder[1]!;
    const secondAuthorityCheck =
      f.foundation.authorizeEmployeeOperation.mock.invocationCallOrder[1]!;
    const idleTouch = vi.mocked(f.ops.touchContinuationIdle).mock
      .invocationCallOrder[0]!;
    expect(continuationLock).toBeLessThan(firstLifecycleCheck);
    expect(firstLifecycleCheck).toBeLessThan(firstCredentialCheck);
    expect(firstCredentialCheck).toBeLessThan(firstAuthorityCheck);
    expect(firstAuthorityCheck).toBeLessThan(receiptLookup);
    expect(receiptLookup).toBeLessThan(secondLifecycleCheck);
    expect(secondLifecycleCheck).toBeLessThan(secondCredentialCheck);
    expect(secondCredentialCheck).toBeLessThan(secondAuthorityCheck);
    expect(secondAuthorityCheck).toBeLessThan(idleTouch);

    // Recovery is the same bounded retry and must preserve the original truth.
    vi.mocked(f.ops.appendRawEvent).mockClear();
    vi.mocked(f.ops.insertCommandReceipt).mockClear();
    expect(await f.service.recover(command)).toEqual(first);
    expect(f.ops.appendRawEvent).not.toHaveBeenCalled();
    expect(f.ops.insertCommandReceipt).not.toHaveBeenCalled();

    // A later authorized CLOCK_OUT changes derived state only. The original
    // CLOCK_IN tuple still replays its original receipt, not a recomputed one.
    const open = await f.service.readState(auth);
    if (!open.ok) throw new Error('Synthetic state failed.');
    expect(open.value.state.status).toBe('CLOCKED_IN');
    expect(
      (
        await f.service.mutate({
          ...auth,
          requestId: randomUUID(),
          kind: 'CLOCK_OUT',
          observedStateGuard: open.value.state.stateGuard,
        })
      ).ok,
    ).toBe(true);
    const rawAfterStateChange = structuredClone(f.rawEvents);
    const receiptsAfterStateChange = structuredClone(f.receipts);
    vi.mocked(f.ops.appendRawEvent).mockClear();
    vi.mocked(f.ops.insertCommandReceipt).mockClear();
    expect(await f.service.mutate(command)).toEqual(first);
    expect(f.rawEvents).toHaveLength(2);
    expect(f.receipts).toHaveLength(2);
    expect(f.rawEvents).toEqual(rawAfterStateChange);
    expect(f.receipts).toEqual(receiptsAfterStateChange);
    expect(f.ops.appendRawEvent).not.toHaveBeenCalled();
    expect(f.ops.insertCommandReceipt).not.toHaveBeenCalled();
    expect(Object.keys(first.value).sort()).toEqual([
      'acceptedAt',
      'businessDate',
      'kind',
      'requestId',
      'result',
      'timezoneName',
      'utcOffsetSeconds',
    ]);
    expect(first.value.acceptedAt).toBe(f.clock.instant);
  });

  it.each([
    'lifecycle',
    'trusted-scope',
    'exact-authority',
    'credential-version',
    'ended-continuation',
  ] as const)(
    'A4.2 denies committed receipt replay after current %s invalidation',
    async (invalidation) => {
      const f = fixture();
      const identified = await f.service.identify(f.request);
      if (!identified.ok) throw new Error('Synthetic identify failed.');
      const command = Object.freeze({
        establishmentSlug: f.request.establishmentSlug,
        continuation: identified.value.continuation,
        requestId: randomUUID(),
        kind: 'CLOCK_IN' as const,
        observedStateGuard: identified.value.state.stateGuard,
      });

      // Phase A: every case starts with genuine current authority and a real
      // service commit, never a fabricated repository receipt.
      for (const method of Object.values(f.ops)) vi.mocked(method).mockClear();
      f.foundation.authorizeEmployeeOperation.mockClear();
      f.calls.length = 0;
      const committed = await f.service.mutate(command);
      expect(committed.ok).toBe(true);
      if (!committed.ok) throw new Error('Synthetic commit failed.');
      expect(committed.value).toMatchObject({
        requestId: command.requestId,
        kind: command.kind,
        result: 'COMMITTED',
      });
      expect(f.rawEvents).toHaveLength(1);
      expect(f.receipts).toHaveLength(1);
      expect(f.ops.appendRawEvent).toHaveBeenCalledExactlyOnceWith('CLOCK_IN');
      expect(f.ops.insertCommandReceipt).toHaveBeenCalledOnce();
      expect(f.calls).toEqual(
        Array(3).fill('pointage.employee.operation.create'),
      );
      expect(f.receipts[0]).toMatchObject({
        organizationId: f.credential.organizationId,
        establishmentId: f.credential.establishmentId,
        personnelDossierId: f.credential.personnelDossierId,
        requestId: command.requestId,
        eventId: f.rawEvents[0]!.id,
        intentVersion: 1,
      });

      const originalReceipt = structuredClone(committed.value);
      const rawBeforeReplay = structuredClone(f.rawEvents);
      const receiptsBeforeReplay = structuredClone(f.receipts);
      const continuationId = f.committed[0]!.id;
      const originalAuthority =
        f.foundation.authorizeEmployeeOperation.getMockImplementation()!;
      const currentEntryScope = await f.resolveEntryScope();

      // Phase B: invalidate exactly one current prerequisite while preserving
      // the committed request identity, intent and canonical evidence.
      for (const method of Object.values(f.ops)) vi.mocked(method).mockClear();
      f.foundation.authorizeEmployeeOperation.mockClear();
      f.resolveEntryScope.mockClear();
      f.calls.length = 0;
      if (invalidation === 'lifecycle') {
        f.personnel.departureDate = '2026-09-07';
      } else if (invalidation === 'trusted-scope') {
        f.resolveEntryScope.mockResolvedValue({
          ...currentEntryScope,
          establishmentId: randomUUID(),
        });
      } else if (invalidation === 'exact-authority') {
        f.foundation.authorizeEmployeeOperation.mockImplementation(
          async (input) => ({
            ...(await originalAuthority(input)),
            operation: 'pointage.employee.identify' as const,
          }),
        );
      } else if (invalidation === 'credential-version') {
        vi.mocked(f.ops.findCurrentCredential).mockResolvedValue({
          id: f.credential.credentialId,
          credentialVersion: f.credential.credentialVersion + 1,
        });
      } else {
        f.committed[0] = {
          ...f.committed[0]!,
          endedAt: f.clock.instant,
        };
      }

      const denied = await f.service.recover(command);

      expect(denied).toEqual({
        ok: false,
        code: 'POINTAGE_ACCESS_DENIED',
      });
      expect(Object.keys(denied).sort()).toEqual(['code', 'ok']);
      expect(denied).not.toHaveProperty('value');
      expect(denied).not.toEqual(committed);
      const serialized = JSON.stringify(denied);
      expect(serialized).not.toContain(originalReceipt.requestId);
      expect(serialized).not.toContain(originalReceipt.acceptedAt);
      expect(serialized).not.toContain(f.credential.personnelDossierId);
      expect(serialized).not.toContain(f.personnel.givenNames.trim());
      expect(f.ops.findCommandReceipt).not.toHaveBeenCalled();
      expect(f.ops.appendRawEvent).not.toHaveBeenCalled();
      expect(f.ops.insertCommandReceipt).not.toHaveBeenCalled();
      expect(f.ops.touchContinuationIdle).not.toHaveBeenCalled();
      expect(f.rawEvents).toEqual(rawBeforeReplay);
      expect(f.rawEvents).toHaveLength(1);
      expect(f.receipts).toEqual(receiptsBeforeReplay);
      expect(f.receipts).toHaveLength(1);

      if (invalidation === 'trusted-scope') {
        expect(f.resolveEntryScope).toHaveBeenCalledExactlyOnceWith(
          f.request.establishmentSlug,
        );
        expect(f.ops.lockContinuation).not.toHaveBeenCalled();
        expect(f.ops.readCurrentClock).not.toHaveBeenCalled();
        expect(f.ops.findCurrentCredential).not.toHaveBeenCalled();
        expect(f.foundation.authorizeEmployeeOperation).not.toHaveBeenCalled();
      } else {
        expect(f.ops.lockContinuation).toHaveBeenCalledExactlyOnceWith(
          continuationId,
        );
        expect(f.ops.readCurrentClock).toHaveBeenCalledOnce();
        if (
          invalidation === 'lifecycle' ||
          invalidation === 'ended-continuation'
        ) {
          expect(f.ops.findCurrentCredential).not.toHaveBeenCalled();
          expect(
            f.foundation.authorizeEmployeeOperation,
          ).not.toHaveBeenCalled();
        } else {
          expect(f.ops.findCurrentCredential).toHaveBeenCalledOnce();
          if (invalidation === 'credential-version') {
            expect(
              f.foundation.authorizeEmployeeOperation,
            ).not.toHaveBeenCalled();
          } else {
            expect(f.calls).toEqual(['pointage.employee.operation.create']);
            expect(
              f.foundation.authorizeEmployeeOperation,
            ).toHaveBeenCalledExactlyOnceWith({
              credential: f.credential,
              entryScope: {
                organizationId: f.credential.organizationId,
                establishmentId: f.credential.establishmentId,
                timezone: f.personnel.timezone,
                locale: 'fr-FR',
              },
              operation: 'pointage.employee.operation.create',
            });
          }
        }
      }
    },
  );

  it('same ID different intent conflicts; a stale OUT cannot close a subsequent open session', async () => {
    const f = fixture();
    const identified = await f.service.identify(f.request);
    if (!identified.ok) throw new Error('Synthetic identify failed.');
    const auth = {
      establishmentSlug: f.request.establishmentSlug,
      continuation: identified.value.continuation,
    };
    const initial = {
      ...auth,
      requestId: randomUUID(),
      kind: 'CLOCK_IN' as const,
      observedStateGuard: identified.value.state.stateGuard,
    };
    expect((await f.service.mutate(initial)).ok).toBe(true);
    expect(await f.service.mutate({ ...initial, kind: 'CLOCK_OUT' })).toEqual({
      ok: false,
      code: 'POINTAGE_REQUEST_CONFLICT',
    });
    const a = await f.service.readState(auth);
    if (!a.ok) throw new Error('Synthetic state failed.');
    const out = {
      ...auth,
      requestId: randomUUID(),
      kind: 'CLOCK_OUT' as const,
      observedStateGuard: a.value.state.stateGuard,
    };
    expect((await f.service.mutate(out)).ok).toBe(true);
    const closed = await f.service.readState(auth);
    if (!closed.ok) throw new Error('Synthetic state failed.');
    expect(
      (
        await f.service.mutate({
          ...initial,
          requestId: randomUUID(),
          observedStateGuard: closed.value.state.stateGuard,
        })
      ).ok,
    ).toBe(true);
    expect(await f.service.mutate({ ...out, requestId: randomUUID() })).toEqual(
      { ok: false, code: 'POINTAGE_STATE_CONFLICT' },
    );
    expect(f.rawEvents).toHaveLength(3);
    expect(f.receipts).toHaveLength(3);
  });

  it('recovery without a receipt is UNCONFIRMED, creates nothing and does not extend idle', async () => {
    const f = fixture();
    const identified = await f.service.identify(f.request);
    if (!identified.ok) throw new Error('Synthetic identify failed.');
    expect(
      await f.service.recover({
        establishmentSlug: f.request.establishmentSlug,
        continuation: identified.value.continuation,
        requestId: randomUUID(),
        kind: 'CLOCK_IN',
        observedStateGuard: identified.value.state.stateGuard,
      }),
    ).toEqual({ ok: true, value: { result: 'UNCONFIRMED' } });
    expect(f.ops.touchContinuationIdle).not.toHaveBeenCalled();
    expect(f.ops.appendRawEvent).not.toHaveBeenCalled();
    expect(f.rawEvents).toEqual([]);
    expect(f.receipts).toEqual([]);
  });

  it.each([
    'accepted-idle-expiry',
    'accepted-departure',
    'receipt-failure',
    'commit-failure',
  ] as const)(
    'rolls back event/receipt on %s without treating a later clock as the accepted sample',
    async (fault) => {
      const f = fixture();
      const identified = await f.service.identify(f.request);
      if (!identified.ok) throw new Error('Synthetic identify failed.');
      const original = vi.mocked(f.ops.appendRawEvent).getMockImplementation()!;
      if (fault === 'accepted-idle-expiry')
        vi.mocked(f.ops.appendRawEvent).mockImplementation(async (kind) => ({
          ...(await original(kind)),
          acceptedAt: '2026-09-08T12:01:00.123456Z',
        }));
      if (fault === 'accepted-departure') {
        f.personnel.departureDate = f.clock.businessDate;
        vi.mocked(f.ops.appendRawEvent).mockImplementation(async (kind) => ({
          ...(await original(kind)),
          businessDate: '2026-09-09',
        }));
      }
      if (fault === 'receipt-failure')
        vi.mocked(f.ops.insertCommandReceipt).mockRejectedValue(
          new Error('Synthetic receipt failure.'),
        );
      if (fault === 'commit-failure') f.setCommitFailure();
      const result = await f.service.mutate({
        establishmentSlug: f.request.establishmentSlug,
        continuation: identified.value.continuation,
        requestId: randomUUID(),
        kind: 'CLOCK_IN',
        observedStateGuard: identified.value.state.stateGuard,
      });
      expect(result.ok).toBe(false);
      expect(f.rawEvents).toEqual([]);
      expect(f.receipts).toEqual([]);
    },
  );

  it('A5.2 denies operation.create with an existing continuation after credential reset', async () => {
    const f = fixture();
    const identified = await f.service.identify(f.request);
    expect(identified.ok).toBe(true);
    if (!identified.ok) throw new Error('Synthetic identify failed.');

    const oldContinuation = structuredClone(f.committed[0]!);
    const personnelBeforeReset = structuredClone(f.personnel);
    expect(oldContinuation).toMatchObject({
      organizationId: f.credential.organizationId,
      establishmentId: f.credential.establishmentId,
      personnelDossierId: f.credential.personnelDossierId,
      credentialId: f.credential.credentialId,
      credentialVersion: f.credential.credentialVersion,
      endedAt: null,
    });
    expect(f.clock.instant < oldContinuation.idleExpiresAt).toBe(true);
    expect(f.clock.instant < oldContinuation.absoluteExpiresAt).toBe(true);

    const currentCredential = {
      id: randomUUID(),
      credentialVersion: f.credential.credentialVersion + 1,
    };
    vi.mocked(f.ops.findCurrentCredential).mockResolvedValue(currentCredential);
    for (const method of Object.values(f.ops)) vi.mocked(method).mockClear();
    f.foundation.authorizeEmployeeOperation.mockClear();
    f.calls.length = 0;
    f.generate.mockClear();
    const rawBefore = structuredClone(f.rawEvents);
    const receiptsBefore = structuredClone(f.receipts);

    const denied = await f.service.mutate({
      establishmentSlug: f.request.establishmentSlug,
      continuation: identified.value.continuation,
      requestId: randomUUID(),
      kind: 'CLOCK_IN',
      observedStateGuard: identified.value.state.stateGuard,
    });

    expect(denied).toEqual({
      ok: false,
      code: 'POINTAGE_ACCESS_DENIED',
    });
    expect(Object.keys(denied).sort()).toEqual(['code', 'ok']);
    expect(denied).not.toHaveProperty('value');
    expect(JSON.stringify(denied)).not.toContain(f.personnel.givenNames.trim());
    expect(JSON.stringify(denied)).not.toContain(
      f.credential.personnelDossierId,
    );
    expect(f.personnel).toEqual(personnelBeforeReset);
    expect(f.clock.instant < oldContinuation.idleExpiresAt).toBe(true);
    expect(f.clock.instant < oldContinuation.absoluteExpiresAt).toBe(true);
    expect(f.ops.lockContinuation).toHaveBeenCalledExactlyOnceWith(
      oldContinuation.id,
    );
    expect(f.ops.readCurrentClock).toHaveBeenCalledOnce();
    expect(f.ops.findCurrentCredential).toHaveBeenCalledOnce();
    await expect(
      vi.mocked(f.ops.findCurrentCredential).mock.results[0]!.value,
    ).resolves.toEqual(currentCredential);
    expect(f.foundation.authorizeEmployeeOperation).not.toHaveBeenCalled();
    expect(f.calls).toEqual([]);
    expect(f.ops.readRawChain).not.toHaveBeenCalled();
    expect(f.ops.findCommandReceipt).not.toHaveBeenCalled();
    expect(f.ops.appendRawEvent).not.toHaveBeenCalled();
    expect(f.ops.insertCommandReceipt).not.toHaveBeenCalled();
    expect(f.ops.touchContinuationIdle).not.toHaveBeenCalled();
    expect(f.ops.insertContinuation).not.toHaveBeenCalled();
    expect(f.generate).not.toHaveBeenCalled();
    expect(f.rawEvents).toEqual(rawBefore);
    expect(f.receipts).toEqual(receiptsBefore);
    expect(f.committed).toEqual([oldContinuation]);

    const continuationLock = vi.mocked(f.ops.lockContinuation).mock
      .invocationCallOrder[0]!;
    const currentClock = vi.mocked(f.ops.readCurrentClock).mock
      .invocationCallOrder[0]!;
    const credentialCheck = vi.mocked(f.ops.findCurrentCredential).mock
      .invocationCallOrder[0]!;
    expect(continuationLock).toBeLessThan(currentClock);
    expect(currentClock).toBeLessThan(credentialCheck);
  });

  it('reset rejects old continuation replay while a new current credential can recover the known own tuple', async () => {
    const f = fixture();
    const identified = await f.service.identify(f.request);
    if (!identified.ok) throw new Error('Synthetic identify failed.');
    const command = {
      establishmentSlug: f.request.establishmentSlug,
      continuation: identified.value.continuation,
      requestId: randomUUID(),
      kind: 'CLOCK_IN' as const,
      observedStateGuard: identified.value.state.stateGuard,
    };
    const committed = await f.service.mutate(command);
    expect(committed.ok).toBe(true);
    const credential = {
      ...f.credential,
      credentialId: randomUUID(),
      credentialVersion: 2,
    };
    vi.mocked(f.ops.findCurrentCredential).mockResolvedValue({
      id: credential.credentialId,
      credentialVersion: 2,
    });
    expect(await f.service.recover(command)).toEqual({
      ok: false,
      code: 'POINTAGE_ACCESS_DENIED',
    });
    f.foundation.validateCredential.mockResolvedValue({
      status: 'VERIFIED',
      credential,
      entryScope: await f.resolveEntryScope(),
    });
    const fresh = await f.service.identify(f.request);
    if (!fresh.ok) throw new Error('Synthetic re-identify failed.');
    expect(
      await f.service.recover({
        ...command,
        continuation: fresh.value.continuation,
      }),
    ).toEqual(committed);
    expect(f.rawEvents).toHaveLength(1);
    expect(f.receipts).toHaveLength(1);
  });

  it('reads only live own state and touches idle without rotating the token', async () => {
    const f = fixture();
    const identified = await f.service.identify(f.request);
    if (!identified.ok) throw new Error('Synthetic identify failed.');
    const result = await f.service.readState({
      establishmentSlug: f.request.establishmentSlug,
      continuation: identified.value.continuation,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error('Synthetic state failed.');
    expect(Object.keys(result.value).sort()).toEqual([
      'expiresInMs',
      'idleInMs',
      'state',
    ]);
    expect(result.value.state).toEqual(identified.value.state);
    expect(f.generate).toHaveBeenCalledOnce();
    expect(f.ops.touchContinuationIdle).toHaveBeenCalledOnce();
    expect(f.committed).toHaveLength(1);
  });

  it.each([
    'idle-expiry',
    'absolute-expiry',
    'ended',
    'reset',
    'upcoming',
    'former',
    'wrong-token',
    'wrong-establishment',
  ] as const)(
    'state denies %s without extending idle or leaking identity',
    async (mode) => {
      const f = fixture();
      const identified = await f.service.identify(f.request);
      if (!identified.ok) throw new Error('Synthetic identify failed.');
      let token = identified.value.continuation;
      if (mode === 'idle-expiry')
        f.clock.instant = '2026-09-08T12:01:00.123456Z';
      if (mode === 'absolute-expiry')
        f.clock.instant = '2026-09-08T12:02:00.123456Z';
      if (mode === 'ended')
        f.committed[0] = { ...f.committed[0]!, endedAt: f.clock.instant };
      if (mode === 'reset')
        vi.mocked(f.ops.findCurrentCredential).mockResolvedValue({
          id: randomUUID(),
          credentialVersion: 2,
        });
      if (mode === 'upcoming') f.personnel.entryDate = '2026-09-09';
      if (mode === 'former') f.personnel.departureDate = '2026-09-07';
      if (mode === 'wrong-token') token = generatePointageContinuation();
      if (mode === 'wrong-establishment')
        f.resolveEntryScope.mockResolvedValue({
          ...(await f.resolveEntryScope()),
          establishmentId: randomUUID(),
        });
      expect(
        await f.service.readState({
          establishmentSlug: f.request.establishmentSlug,
          continuation: token,
        }),
      ).toEqual({ ok: false, code: 'POINTAGE_ACCESS_DENIED' });
      expect(f.ops.touchContinuationIdle).not.toHaveBeenCalled();
    },
  );

  it.each(['idle', 'absolute'] as const)(
    'A5.1 denies protected consumers at the %s expiry boundary and requires fresh identification',
    async (expiry) => {
      const f = fixture();
      const identified = await f.service.identify(f.request);
      expect(identified.ok).toBe(true);
      if (!identified.ok) throw new Error('Synthetic identify failed.');

      const oldToken = identified.value.continuation;
      const initiallyValid = structuredClone(f.committed[0]!);
      expect(f.clock.instant < initiallyValid.idleExpiresAt).toBe(true);
      expect(f.clock.instant < initiallyValid.absoluteExpiresAt).toBe(true);

      const committedCommand = {
        establishmentSlug: f.request.establishmentSlug,
        continuation: oldToken,
        requestId: randomUUID(),
        kind: 'CLOCK_IN' as const,
        observedStateGuard: identified.value.state.stateGuard,
      };
      const originalReceipt = await f.service.mutate(committedCommand);
      expect(originalReceipt.ok).toBe(true);
      expect(f.rawEvents).toHaveLength(1);
      expect(f.receipts).toHaveLength(1);
      const openState = await f.service.readState({
        establishmentSlug: f.request.establishmentSlug,
        continuation: oldToken,
      });
      expect(openState.ok).toBe(true);
      if (!openState.ok) throw new Error('Synthetic state read failed.');
      expect(openState.value.state.status).toBe('CLOCKED_IN');

      if (expiry === 'absolute')
        f.committed[0] = {
          ...f.committed[0]!,
          idleExpiresAt: f.committed[0]!.absoluteExpiresAt,
        };
      const oldAtExpiry = structuredClone(f.committed[0]!);
      f.clock.instant =
        expiry === 'idle'
          ? oldAtExpiry.idleExpiresAt
          : oldAtExpiry.absoluteExpiresAt;
      expect(f.clock.instant).toBe(
        expiry === 'idle'
          ? oldAtExpiry.idleExpiresAt
          : oldAtExpiry.absoluteExpiresAt,
      );
      if (expiry === 'idle')
        expect(f.clock.instant < oldAtExpiry.absoluteExpiresAt).toBe(true);
      else
        expect(oldAtExpiry.idleExpiresAt).toBe(oldAtExpiry.absoluteExpiresAt);

      const clearProtectedCallEvidence = () => {
        f.calls.length = 0;
        f.generate.mockClear();
        f.foundation.authorizeEmployeeOperation.mockClear();
        vi.mocked(f.ops.readRawChain).mockClear();
        vi.mocked(f.ops.touchContinuationIdle).mockClear();
        vi.mocked(f.ops.appendRawEvent).mockClear();
        vi.mocked(f.ops.insertCommandReceipt).mockClear();
        vi.mocked(f.ops.findCommandReceipt).mockClear();
        vi.mocked(f.ops.insertContinuation).mockClear();
      };
      const expectExpiredCallWasReadOnly = () => {
        expect(f.calls).toEqual([]);
        expect(f.foundation.authorizeEmployeeOperation).not.toHaveBeenCalled();
        expect(f.ops.readRawChain).not.toHaveBeenCalled();
        expect(f.ops.touchContinuationIdle).not.toHaveBeenCalled();
        expect(f.ops.appendRawEvent).not.toHaveBeenCalled();
        expect(f.ops.insertCommandReceipt).not.toHaveBeenCalled();
        expect(f.ops.insertContinuation).not.toHaveBeenCalled();
        expect(f.generate).not.toHaveBeenCalled();
        expect(f.rawEvents).toHaveLength(1);
        expect(f.receipts).toHaveLength(1);
        expect(f.committed).toEqual([oldAtExpiry]);
      };

      clearProtectedCallEvidence();
      expect(
        await f.service.readState({
          establishmentSlug: f.request.establishmentSlug,
          continuation: oldToken,
        }),
      ).toEqual({ ok: false, code: 'POINTAGE_ACCESS_DENIED' });
      expectExpiredCallWasReadOnly();

      clearProtectedCallEvidence();
      expect(
        await f.service.mutate({
          establishmentSlug: f.request.establishmentSlug,
          continuation: oldToken,
          requestId: randomUUID(),
          kind: 'CLOCK_OUT',
          observedStateGuard: openState.value.state.stateGuard,
        }),
      ).toEqual({ ok: false, code: 'POINTAGE_ACCESS_DENIED' });
      expectExpiredCallWasReadOnly();

      clearProtectedCallEvidence();
      expect(await f.service.recover(committedCommand)).toEqual({
        ok: false,
        code: 'POINTAGE_ACCESS_DENIED',
      });
      expect(f.ops.findCommandReceipt).not.toHaveBeenCalled();
      expectExpiredCallWasReadOnly();

      clearProtectedCallEvidence();
      const fresh = await f.service.identify(f.request);
      expect(fresh.ok).toBe(true);
      if (!fresh.ok) throw new Error('Synthetic re-identify failed.');
      expect(fresh.value.continuation).not.toBe(oldToken);
      expect(f.calls).toEqual([
        'pointage.employee.identify',
        'pointage.employee.state.read',
        'pointage.employee.identify',
        'pointage.employee.state.read',
        'pointage.employee.identify',
        'pointage.employee.state.read',
      ]);
      expect(f.committed).toHaveLength(2);
      expect(f.committed[0]).toEqual(oldAtExpiry);
      expect(f.committed[1]!.issuedAt).toBe(f.clock.instant);
      expect(f.committed[1]!.idleExpiresAt > f.clock.instant).toBe(true);
      expect(f.committed[1]!.absoluteExpiresAt > f.clock.instant).toBe(true);
      expect(f.committed[1]!.idleExpiresAt).not.toBe(oldAtExpiry.idleExpiresAt);
      expect(f.committed[1]!.absoluteExpiresAt).not.toBe(
        oldAtExpiry.absoluteExpiresAt,
      );

      f.calls.length = 0;
      vi.mocked(f.ops.touchContinuationIdle).mockClear();
      const freshState = await f.service.readState({
        establishmentSlug: f.request.establishmentSlug,
        continuation: fresh.value.continuation,
      });
      expect(freshState.ok).toBe(true);
      if (!freshState.ok) throw new Error('Synthetic fresh state failed.');
      expect(freshState.value.state.status).toBe('CLOCKED_IN');
      expect(f.calls).toEqual(Array(3).fill('pointage.employee.state.read'));
      expect(f.ops.touchContinuationIdle).toHaveBeenCalledOnce();

      f.calls.length = 0;
      vi.mocked(f.ops.touchContinuationIdle).mockClear();
      expect(
        await f.service.readState({
          establishmentSlug: f.request.establishmentSlug,
          continuation: oldToken,
        }),
      ).toEqual({ ok: false, code: 'POINTAGE_ACCESS_DENIED' });
      expect(f.calls).toEqual([]);
      expect(f.ops.touchContinuationIdle).not.toHaveBeenCalled();
      expect(f.committed[0]).toEqual(oldAtExpiry);
      expect(f.rawEvents).toHaveLength(1);
      expect(f.receipts).toHaveLength(1);
    },
  );

  it('A5.3 denies protected reuse after explicitly ending a committed interaction', async () => {
    const f = fixture();
    const identified = await f.service.identify(f.request);
    expect(identified.ok).toBe(true);
    if (!identified.ok) throw new Error('Synthetic identify failed.');

    const oldToken = identified.value.continuation;
    const originalCommand = Object.freeze({
      establishmentSlug: f.request.establishmentSlug,
      continuation: oldToken,
      requestId: randomUUID(),
      kind: 'CLOCK_IN' as const,
      observedStateGuard: identified.value.state.stateGuard,
    });
    const originalReceipt = await f.service.mutate(originalCommand);
    expect(originalReceipt.ok).toBe(true);
    if (!originalReceipt.ok) throw new Error('Synthetic CLOCK_IN failed.');
    expect(originalReceipt.value.result).toBe('COMMITTED');
    expect(f.rawEvents).toHaveLength(1);
    expect(f.receipts).toHaveLength(1);

    const openState = await f.service.readState({
      establishmentSlug: f.request.establishmentSlug,
      continuation: oldToken,
    });
    expect(openState.ok).toBe(true);
    if (!openState.ok) throw new Error('Synthetic open state failed.');
    expect(openState.value.state.status).toBe('CLOCKED_IN');

    const continuationBeforeEnd = structuredClone(f.committed[0]!);
    const rawBeforeEnd = structuredClone(f.rawEvents);
    const receiptsBeforeEnd = structuredClone(f.receipts);
    expect(continuationBeforeEnd).toMatchObject({
      organizationId: f.credential.organizationId,
      establishmentId: f.credential.establishmentId,
      personnelDossierId: f.credential.personnelDossierId,
      credentialId: f.credential.credentialId,
      credentialVersion: f.credential.credentialVersion,
      endedAt: null,
    });
    expect(f.clock.instant < continuationBeforeEnd.idleExpiresAt).toBe(true);
    expect(f.clock.instant < continuationBeforeEnd.absoluteExpiresAt).toBe(
      true,
    );

    for (const method of Object.values(f.ops)) vi.mocked(method).mockClear();
    f.foundation.authorizeEmployeeOperation.mockClear();
    f.calls.length = 0;
    f.generate.mockClear();

    expect(
      await f.service.end({
        establishmentSlug: f.request.establishmentSlug,
        continuation: oldToken,
      }),
    ).toEqual({ ok: true, value: null });
    expect(f.ops.endOwnContinuation).toHaveBeenCalledExactlyOnceWith(
      continuationBeforeEnd.id,
    );
    expect(f.foundation.authorizeEmployeeOperation).not.toHaveBeenCalled();
    expect(f.calls).toEqual([]);
    expect(f.ops.readRawChain).not.toHaveBeenCalled();
    expect(f.ops.findCommandReceipt).not.toHaveBeenCalled();
    expect(f.ops.appendRawEvent).not.toHaveBeenCalled();
    expect(f.ops.insertCommandReceipt).not.toHaveBeenCalled();
    expect(f.ops.touchContinuationIdle).not.toHaveBeenCalled();
    expect(f.ops.insertContinuation).not.toHaveBeenCalled();
    expect(f.generate).not.toHaveBeenCalled();
    expect(f.rawEvents).toEqual(rawBeforeEnd);
    expect(f.receipts).toEqual(receiptsBeforeEnd);
    expect(f.committed).toHaveLength(1);
    expect(f.committed[0]).toEqual({
      ...continuationBeforeEnd,
      endedAt: f.clock.instant,
    });

    const endedContinuation = structuredClone(f.committed[0]!);
    const clearPostEndEvidence = () => {
      for (const method of Object.values(f.ops)) vi.mocked(method).mockClear();
      f.foundation.authorizeEmployeeOperation.mockClear();
      f.calls.length = 0;
      f.generate.mockClear();
    };
    const expectPostEndReadOnly = () => {
      expect(f.ops.lockContinuation).toHaveBeenCalledExactlyOnceWith(
        endedContinuation.id,
      );
      expect(f.ops.readCurrentClock).toHaveBeenCalledOnce();
      expect(f.ops.findCurrentCredential).not.toHaveBeenCalled();
      expect(f.foundation.authorizeEmployeeOperation).not.toHaveBeenCalled();
      expect(f.calls).toEqual([]);
      expect(f.ops.readRawChain).not.toHaveBeenCalled();
      expect(f.ops.findCommandReceipt).not.toHaveBeenCalled();
      expect(f.ops.appendRawEvent).not.toHaveBeenCalled();
      expect(f.ops.insertCommandReceipt).not.toHaveBeenCalled();
      expect(f.ops.touchContinuationIdle).not.toHaveBeenCalled();
      expect(f.ops.endOwnContinuation).not.toHaveBeenCalled();
      expect(f.ops.insertContinuation).not.toHaveBeenCalled();
      expect(f.generate).not.toHaveBeenCalled();
      expect(f.rawEvents).toEqual(rawBeforeEnd);
      expect(f.receipts).toEqual(receiptsBeforeEnd);
      expect(f.committed).toEqual([endedContinuation]);
    };
    const expectGenericDenial = (result: unknown) => {
      expect(result).toEqual({
        ok: false,
        code: 'POINTAGE_ACCESS_DENIED',
      });
      expect(Object.keys(result as object).sort()).toEqual(['code', 'ok']);
      expect(result).not.toHaveProperty('value');
      const serialized = JSON.stringify(result);
      expect(serialized).not.toContain(f.personnel.givenNames.trim());
      expect(serialized).not.toContain(f.credential.personnelDossierId);
      expect(serialized).not.toContain(originalCommand.requestId);
      expect(serialized).not.toContain(originalReceipt.value.acceptedAt);
    };

    clearPostEndEvidence();
    expectGenericDenial(
      await f.service.readState({
        establishmentSlug: f.request.establishmentSlug,
        continuation: oldToken,
      }),
    );
    expectPostEndReadOnly();

    clearPostEndEvidence();
    expectGenericDenial(
      await f.service.mutate({
        establishmentSlug: f.request.establishmentSlug,
        continuation: oldToken,
        requestId: randomUUID(),
        kind: 'CLOCK_OUT',
        observedStateGuard: openState.value.state.stateGuard,
      }),
    );
    expectPostEndReadOnly();

    clearPostEndEvidence();
    expectGenericDenial(await f.service.recover(originalCommand));
    expectPostEndReadOnly();

    expect(f.committed[0]).toEqual(endedContinuation);
    expect(endedContinuation.tokenDigest).toBe(
      digestPointageContinuation(oldToken),
    );
    expect(f.rawEvents).toHaveLength(1);
    expect(f.receipts).toHaveLength(1);
  });

  it('own end stays idempotent after expiry/departure/reset and returns no protected data', async () => {
    const f = fixture();
    const identified = await f.service.identify(f.request);
    if (!identified.ok) throw new Error('Synthetic identify failed.');
    f.clock.instant = '2026-09-08T12:03:00.123456Z';
    f.personnel.departureDate = '2026-09-07';
    vi.mocked(f.ops.findCurrentCredential).mockResolvedValue({
      id: randomUUID(),
      credentialVersion: 2,
    });
    const request = {
      establishmentSlug: f.request.establishmentSlug,
      continuation: identified.value.continuation,
    };
    const callsBefore = f.calls.length;
    expect(await f.service.end(request)).toEqual({ ok: true, value: null });
    const ended = f.committed[0]!.endedAt;
    f.clock.instant = '2026-09-08T12:04:00.123456Z';
    expect(await f.service.end(request)).toEqual({ ok: true, value: null });
    expect(f.committed[0]!.endedAt).toBe(ended);
    expect(f.calls.length).toBe(callsBefore);
    expect(await f.service.readState(request)).toEqual({
      ok: false,
      code: 'POINTAGE_ACCESS_DENIED',
    });
  });

  it('publishes a fresh token and minimal own state only after separate dual guards and commit', async () => {
    const f = fixture();
    const result = await f.service.identify(f.request);
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error('Expected synthetic identification.');
    expect(f.calls).toEqual([
      'pointage.employee.identify',
      'pointage.employee.state.read',
      'pointage.employee.identify',
      'pointage.employee.state.read',
      'pointage.employee.identify',
      'pointage.employee.state.read',
    ]);
    expect(Object.keys(result.value).sort()).toEqual([
      'continuation',
      'expiresInMs',
      'idleInMs',
      'state',
    ]);
    expect(Object.keys(result.value.state).sort()).toEqual([
      'displayName',
      'openSessionStart',
      'stateGuard',
      'status',
    ]);
    expect(result.value.state).toMatchObject({
      displayName: 'Synthétique Exemple',
      status: 'NOT_CLOCKED_IN',
      openSessionStart: null,
    });
    expect(result.value.expiresInMs).toBe(120000);
    expect(result.value.idleInMs).toBe(60000);
    expect(f.committed).toHaveLength(1);
    expect(f.committed[0]?.tokenDigest).toBe(
      digestPointageContinuation(result.value.continuation),
    );
    expect(JSON.stringify(f.committed)).not.toContain(
      result.value.continuation,
    );
    expect(JSON.stringify(f.committed)).not.toContain(f.request.credential);
    const second = await f.service.identify(f.request);
    expect(
      second.ok && second.value.continuation !== result.value.continuation,
    ).toBe(true);
  });

  it.each([1, 2, 3, 4, 5, 6])(
    'denies exact guard call %s with no partial identity or persisted continuation',
    async (at) => {
      const f = fixture();
      let calls = 0;
      const original =
        f.foundation.authorizeEmployeeOperation.getMockImplementation()!;
      f.foundation.authorizeEmployeeOperation.mockImplementation(
        async (input) => {
          calls++;
          if (calls === at)
            throw new Error('Synthetic exact-operation denial.');
          return original(input);
        },
      );
      expect(await f.service.identify(f.request)).toEqual({
        ok: false,
        code: 'POINTAGE_UNAVAILABLE',
      });
      expect(f.committed).toEqual([]);
      if (at <= 4) expect(f.ops.insertContinuation).not.toHaveBeenCalled();
    },
  );

  it('does not accept identify authority as the state.read authority', async () => {
    const f = fixture();
    const original =
      f.foundation.authorizeEmployeeOperation.getMockImplementation()!;
    f.foundation.authorizeEmployeeOperation.mockImplementation(
      async (input) => ({
        ...(await original(input)),
        operation: 'pointage.employee.identify',
      }),
    );
    expect(await f.service.identify(f.request)).toEqual({
      ok: false,
      code: 'POINTAGE_ACCESS_DENIED',
    });
    expect(f.ops.insertContinuation).not.toHaveBeenCalled();
    expect(f.committed).toEqual([]);
  });

  it.each([
    'upcoming',
    'former',
    'inverted',
    'missing-name',
    'bad-date',
    'cross-dossier',
    'credential-reset',
  ] as const)(
    'denies %s from current locked data before protected publication',
    async (mode) => {
      const f = fixture();
      if (mode === 'upcoming') f.personnel.entryDate = '2026-09-09';
      if (mode === 'former') f.personnel.departureDate = '2026-09-07';
      if (mode === 'inverted') f.personnel.departureDate = '2019-01-01';
      if (mode === 'missing-name') f.personnel.givenNames = ' ';
      if (mode === 'bad-date') f.personnel.entryDate = '2026-02-30';
      if (mode === 'cross-dossier') f.personnel.id = randomUUID();
      if (mode === 'credential-reset')
        vi.mocked(f.ops.findCurrentCredential).mockResolvedValue({
          id: randomUUID(),
          credentialVersion: 2,
        });
      expect(await f.service.identify(f.request)).toEqual({
        ok: false,
        code: 'POINTAGE_ACCESS_DENIED',
      });
      expect(f.committed).toEqual([]);
    },
  );

  it('keeps inclusive entry/departure and denies an INSERT crossing the departure midnight', async () => {
    const f = fixture();
    f.personnel.entryDate = f.clock.businessDate;
    f.personnel.departureDate = f.clock.businessDate;
    expect((await f.service.identify(f.request)).ok).toBe(true);
    const g = fixture();
    g.personnel.departureDate = g.clock.businessDate;
    let reads = 0;
    vi.mocked(g.ops.readCurrentClock).mockImplementation(async () =>
      ++reads >= 4
        ? { instant: '2026-09-08T22:00:00.000000Z', businessDate: '2026-09-09' }
        : { ...g.clock },
    );
    expect(await g.service.identify(g.request)).toEqual({
      ok: false,
      code: 'POINTAGE_ACCESS_DENIED',
    });
    expect(g.ops.insertContinuation).toHaveBeenCalledOnce();
    expect(g.committed).toEqual([]);
  });

  it('refuses unready composition before credential processing', async () => {
    const f = fixture();
    f.requireReady.mockRejectedValue(
      new Error('Synthetic missing provenance.'),
    );
    expect(await f.service.identify(f.request)).toEqual({
      ok: false,
      code: 'POINTAGE_UNAVAILABLE',
    });
    expect(f.foundation.validateCredential).not.toHaveBeenCalled();
    expect(f.committed).toEqual([]);
  });

  it('rolls back an invalid chain or unknown COMMIT without exposing a candidate', async () => {
    for (const fault of ['chain', 'commit'] as const) {
      const f = fixture();
      if (fault === 'chain')
        vi.mocked(f.ops.readRawChain).mockRejectedValue(
          new Error('Synthetic corrupt chain.'),
        );
      else f.setCommitFailure();
      expect(await f.service.identify(f.request)).toEqual({
        ok: false,
        code: 'POINTAGE_UNAVAILABLE',
      });
      expect(f.committed).toEqual([]);
    }
  });

  it('bounds digest collisions to three candidates and never returns an uncommitted secret', async () => {
    const f = fixture();
    vi.mocked(f.ops.insertContinuation).mockResolvedValue(null);
    expect(await f.service.identify(f.request)).toEqual({
      ok: false,
      code: 'POINTAGE_UNAVAILABLE',
    });
    expect(f.generate).toHaveBeenCalledTimes(3);
    expect(f.ops.insertContinuation).toHaveBeenCalledTimes(3);
    expect(f.committed).toEqual([]);
  });
});
