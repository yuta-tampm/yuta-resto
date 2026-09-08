import { randomUUID, randomBytes } from 'node:crypto';
import { describe, expect, it, vi, beforeAll, afterAll } from 'vitest';
import type {
  PointageRawClockingRepository,
  PointageRawDossierOperations,
} from '@yuta/db-cloud';
import {
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
import { createPointageServerFoundation } from '../src/server/pointage/service';
import { createPointageRawManagerRead } from '../src/server/pointage/raw-clocking-manager';
import {
  createPointageRepository,
  createPointageRawClockingRepository,
  assertPointageRawDatabaseBoundary,
} from '@yuta/db-cloud';
import {
  openPointageTestClient,
  pointageDisposableWriterUrl,
} from '../../../packages/db-cloud/test/helpers/pointage-raw-clocking-test-database';

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
    const second = otherService.mutate({
      ...firstCommand,
      requestId: randomUUID(),
    });
    const [accepted, rejected] = await Promise.all([first, second]);
    firstReceipt = accepted;
    expect(accepted.ok).toBe(true);
    expect(rejected).toEqual({ ok: false, code: 'POINTAGE_STATE_CONFLICT' });
    expect(await counts()).toMatchObject({ raw: 1, receipts: 1 });
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
    const identified = await identify();
    const db = admin.connection;
    const digest = digestPointageContinuation(identified.continuation)!;
    const [deadline] =
      await db`select to_char(idle_expires_at at time zone 'UTC','YYYY-MM-DD"T"HH24:MI:SS.US"Z"') as instant from public.pointage_continuations where organization_id=${scope.organizationId} and establishment_id=${scope.establishmentId} and personnel_dossier_id=${scope.personnelDossierId} and token_digest=${digest}`;
    const [saved] =
      await db`select pg_get_functiondef('public.pointage_raw_enforce_append()'::regprocedure) as definition`;
    expect(deadline!.instant).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{6}Z$/u,
    );
    const marker = 'observed_at := pg_catalog.clock_timestamp();';
    expect(saved!.definition.split(marker)).toHaveLength(2);
    const before = await counts();
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
      expect(await counts()).toEqual(before);
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
    const identified = await identify();
    const command = {
      establishmentSlug: slug,
      continuation: identified.continuation,
      requestId: randomUUID(),
      kind: 'CLOCK_OUT' as const,
      observedStateGuard: identified.state.stateGuard,
    };
    firstEntered = new Promise((resolve) => {
      releaseFirst = resolve;
    });
    armRace = true;
    const first = service.mutate(command);
    await Promise.race([
      firstEntered,
      first.then(() => {
        throw new Error('Synthetic OUT ended before lock barrier.');
      }),
    ]);
    const [accepted, rejected] = await Promise.all([
      first,
      otherService.mutate({ ...command, requestId: randomUUID() }),
    ]);
    expect(accepted.ok).toBe(true);
    expect(rejected).toEqual({ ok: false, code: 'POINTAGE_STATE_CONFLICT' });
    expect(await counts()).toMatchObject({ raw: 2, receipts: 2 });
    expect((await identify()).state.status).toBe('NOT_CLOCKED_IN');
  });

  it('a response lost after real COMMIT recovers the original receipt with the same tuple, without a second event', async () => {
    const identified = await identify();
    const command = {
      establishmentSlug: slug,
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
    expect(
      await makeService(lostAcknowledgement, writer).mutate(command),
    ).toEqual({ ok: false, code: 'POINTAGE_UNAVAILABLE' });
    expect(await counts()).toMatchObject({ raw: 3, receipts: 3 });
    const recovered = await otherService.recover(command);
    expect(recovered.ok && recovered.value.result).toBe('COMMITTED');
    expect(await service.mutate(command)).toEqual(recovered);
    expect(await counts()).toMatchObject({ raw: 3, receipts: 3 });
  });
  it('S7 reads an actual restricted-writer snapshot and rechecks manager authority after it ends', async () => {
    const freshSession = {
      id: randomUUID(),
      userId,
      userName: 'Synthetic Manager',
      userEmail: 'synthetic@example.test',
      systemRole: null,
      organizationId: scope.organizationId,
      establishmentId: scope.establishmentId,
      expiresAt: new Date('2030-01-01T00:00:00Z'),
    };
    const freshTenant = {
      organizationId: scope.organizationId,
      establishmentId: scope.establishmentId,
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
    const before = await counts();
    const result = await run();
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error('Synthetic manager snapshot unavailable.');
    expect(result.value.currentDayEvents).toHaveLength(3);
    expect(result.value.openSessions).toHaveLength(1);
    expect(
      result.value.currentDayEvents.every(
        (row) => row.personnelDossierId === scope.personnelDossierId,
      ),
    ).toBe(true);
    expect(accessReads).toBe(2);
    expect(await counts()).toEqual(before);
    await expect(
      repository.readEstablishmentSnapshot({
        organizationId: randomUUID(),
        establishmentId: scope.establishmentId,
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
    validateCredential: vi.fn(async () => ({
      status: 'VERIFIED' as const,
      credential,
      entryScope,
    })),
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
          absoluteExpiresAt: '2026-09-08T12:02:00.123456Z',
          idleExpiresAt: '2026-09-08T12:01:00.123456Z',
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
    async withDossierTransaction(requested, run) {
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
    },
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

describe('S3 dual-authority identify and S8 minimal Personnel projection', () => {
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
  it('commits one canonical event/receipt and replays the original receipt after subsequent state changes', async () => {
    const f = fixture();
    const identified = await f.service.identify(f.request);
    if (!identified.ok) throw new Error('Synthetic identify failed.');
    const auth = {
      establishmentSlug: f.request.establishmentSlug,
      continuation: identified.value.continuation,
    };
    const command = {
      ...auth,
      requestId: randomUUID(),
      kind: 'CLOCK_IN' as const,
      observedStateGuard: identified.value.state.stateGuard,
    };
    const first = await f.service.mutate(command);
    expect(first.ok).toBe(true);
    expect(f.rawEvents).toHaveLength(1);
    expect(f.receipts).toHaveLength(1);
    expect(await f.service.mutate(command)).toEqual(first);
    expect(await f.service.recover(command)).toEqual(first);
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
    expect(await f.service.mutate(command)).toEqual(first);
    expect(f.rawEvents).toHaveLength(2);
    expect(f.receipts).toHaveLength(2);
    if (!first.ok) throw new Error('Synthetic mutation failed.');
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
