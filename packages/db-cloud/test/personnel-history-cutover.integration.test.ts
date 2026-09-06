import { config } from 'dotenv';
import { and, eq, sql } from 'drizzle-orm';
import type { TenantContext } from '@yuta/tenant';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { v7 as uuidv7 } from 'uuid';
import {
  createCloudDatabaseClient,
  type CloudDatabaseClient,
} from '../src/client';
import {
  assertPersonnelHistoryCutoverCompleted,
  PersonnelHistoryCutoverIntegrityError,
  PersonnelHistoryCutoverNotCompletedError,
  runPersonnelHistoryCutover,
  runPersonnelHistoryCutoverInTransaction,
} from '../src/personnel-history-cutover';
import {
  establishments,
  organizations,
  personnelEmployeeDossiers,
  personnelEmployeeHistoryEvents,
  personnelEmployeeHistoryGroupChanges,
  personnelHistoryCutovers,
} from '../src/schema';

config({ path: '.env.test' });
config({ path: '.env.local' });

const integrationTest =
  process.env.CLOUD_DATABASE_URL &&
  process.env.YUTA_ALLOW_DATABASE_INTEGRATION_TESTS === 'true'
    ? describe
    : describe.skip;

integrationTest('personnel history cutover foundation', () => {
  let db: CloudDatabaseClient;
  let concurrentDb: CloudDatabaseClient;
  const fixtureOrganizations: string[] = [];

  beforeAll(() => {
    db = createCloudDatabaseClient(process.env);
    concurrentDb = createCloudDatabaseClient(process.env);
  });

  afterAll(async () => {
    if (!db) return;
    for (const organizationId of fixtureOrganizations) {
      await db
        .delete(personnelEmployeeHistoryGroupChanges)
        .where(
          eq(
            personnelEmployeeHistoryGroupChanges.organizationId,
            organizationId,
          ),
        );
      await db
        .delete(personnelEmployeeHistoryEvents)
        .where(
          eq(personnelEmployeeHistoryEvents.organizationId, organizationId),
        );
      await db
        .delete(personnelHistoryCutovers)
        .where(eq(personnelHistoryCutovers.organizationId, organizationId));
      await db
        .delete(personnelEmployeeDossiers)
        .where(eq(personnelEmployeeDossiers.organizationId, organizationId));
      await db
        .delete(establishments)
        .where(eq(establishments.organizationId, organizationId));
      await db
        .delete(organizations)
        .where(eq(organizations.id, organizationId));
    }
    await concurrentDb.$client.end({ timeout: 5 });
    await db.$client.end({ timeout: 5 });
  });

  it('creates the initial baseline exactly once and treats a committed retry as a verified no-op', async () => {
    const fixture = await createFixture(db, fixtureOrganizations, 2);
    const first = await runPersonnelHistoryCutover(db, fixture.context);
    const retryAfterLostResponse = await runPersonnelHistoryCutover(
      db,
      fixture.context,
    );

    expect(first).toMatchObject({
      status: 'completed',
      applicableDossierCount: 2,
      baselineCount: 2,
    });
    expect(retryAfterLostResponse).toMatchObject({
      status: 'already_completed',
      applicableDossierCount: 2,
      baselineCount: 2,
    });
    expect(await baselineCount(db, fixture)).toBe(2);
    expect(await baselineGroupCount(db, fixture)).toBe(12);

    await expect(
      db.insert(personnelEmployeeHistoryEvents).values({
        id: uuidv7(),
        organizationId: fixture.organizationId,
        establishmentId: fixture.establishmentId,
        employeeId: fixture.employeeIds[0]!,
        eventKind: 'cutover_baseline',
        operationId: uuidv7(),
        previousRevision: null,
        newRevision: 1,
        actorUserId: null,
        payloadVersion: 1,
        recordedAt: new Date(),
      }),
    ).rejects.toBeDefined();
  });

  it('rolls back an uncommitted cutover and succeeds on retry', async () => {
    const fixture = await createFixture(db, fixtureOrganizations, 1);
    await expect(
      db.transaction(async (transaction) => {
        await runPersonnelHistoryCutoverInTransaction(
          transaction,
          scoped(fixture.context),
        );
        throw new Error('Simulated response failure before commit.');
      }),
    ).rejects.toThrow('Simulated response failure before commit.');
    expect(await baselineCount(db, fixture)).toBe(0);
    expect(await markerCount(db, fixture)).toBe(0);

    await expect(
      runPersonnelHistoryCutover(db, fixture.context),
    ).resolves.toMatchObject({ status: 'completed', baselineCount: 1 });
  });

  it('rolls back all cutover rows when the transaction fails', async () => {
    const fixture = await createFixture(db, fixtureOrganizations, 1);
    await expect(
      db.transaction(async (transaction) => {
        await runPersonnelHistoryCutoverInTransaction(
          transaction,
          scoped(fixture.context),
        );
        await transaction.execute(sql`select 1 / 0`);
      }),
    ).rejects.toBeDefined();
    expect(await baselineCount(db, fixture)).toBe(0);
    expect(await baselineGroupCount(db, fixture)).toBe(0);
    expect(await markerCount(db, fixture)).toBe(0);
  });

  it('fails closed when the completion marker is missing', async () => {
    const fixture = await createFixture(db, fixtureOrganizations, 1);
    await expect(
      db.transaction((transaction) =>
        assertPersonnelHistoryCutoverCompleted(transaction, fixture.context),
      ),
    ).rejects.toBeInstanceOf(PersonnelHistoryCutoverNotCompletedError);
    expect(await baselineCount(db, fixture)).toBe(0);
  });

  it('serializes a concurrent employee creation after cutover without a fake baseline', async () => {
    const fixture = await createFixture(db, fixtureOrganizations, 1);
    const cutoverReady = deferred<void>();
    const releaseCutover = deferred<void>();
    const cutover = db.transaction(async (transaction) => {
      await runPersonnelHistoryCutoverInTransaction(
        transaction,
        scoped(fixture.context),
      );
      cutoverReady.resolve();
      await releaseCutover.promise;
    });
    await cutoverReady.promise;

    const newEmployeeId = uuidv7();
    let creationFinished = false;
    const creation = concurrentDb.transaction(async (transaction) => {
      await assertPersonnelHistoryCutoverCompleted(
        transaction,
        fixture.context,
      );
      await transaction
        .insert(personnelEmployeeDossiers)
        .values(employee(newEmployeeId, fixture, 'Concurrent create'));
      creationFinished = true;
    });
    await nextEventLoopTurn();
    expect(creationFinished).toBe(false);

    releaseCutover.resolve();
    await Promise.all([cutover, creation]);
    expect(creationFinished).toBe(true);
    expect(await baselineCount(db, fixture)).toBe(1);
    const [newEmployeeBaseline] = await db
      .select({ id: personnelEmployeeHistoryEvents.id })
      .from(personnelEmployeeHistoryEvents)
      .where(
        and(
          eq(
            personnelEmployeeHistoryEvents.organizationId,
            fixture.organizationId,
          ),
          eq(
            personnelEmployeeHistoryEvents.establishmentId,
            fixture.establishmentId,
          ),
          eq(personnelEmployeeHistoryEvents.employeeId, newEmployeeId),
          eq(personnelEmployeeHistoryEvents.eventKind, 'cutover_baseline'),
        ),
      );
    expect(newEmployeeBaseline).toBeUndefined();
    await expect(
      runPersonnelHistoryCutover(db, fixture.context),
    ).resolves.toMatchObject({
      status: 'already_completed',
      applicableDossierCount: 1,
      baselineCount: 1,
    });
  });

  it('serializes concurrent update and departure mutations behind cutover', async () => {
    const fixture = await createFixture(db, fixtureOrganizations, 2);
    const cutoverReady = deferred<void>();
    const releaseCutover = deferred<void>();
    const cutover = db.transaction(async (transaction) => {
      await runPersonnelHistoryCutoverInTransaction(
        transaction,
        scoped(fixture.context),
      );
      cutoverReady.resolve();
      await releaseCutover.promise;
    });
    await cutoverReady.promise;

    let updateFinished = false;
    let departureFinished = false;
    const update = concurrentDb.transaction(async (transaction) => {
      await assertPersonnelHistoryCutoverCompleted(
        transaction,
        fixture.context,
      );
      await transaction
        .update(personnelEmployeeDossiers)
        .set({
          position: 'Updated after cutover',
          revision: sql`${personnelEmployeeDossiers.revision} + 1`,
        })
        .where(scopedEmployee(fixture, fixture.employeeIds[0]!));
      updateFinished = true;
    });
    const departure = concurrentDb.transaction(async (transaction) => {
      await assertPersonnelHistoryCutoverCompleted(
        transaction,
        fixture.context,
      );
      await transaction
        .update(personnelEmployeeDossiers)
        .set({
          departureDate: '2027-01-31',
          revision: sql`${personnelEmployeeDossiers.revision} + 1`,
        })
        .where(scopedEmployee(fixture, fixture.employeeIds[1]!));
      departureFinished = true;
    });
    await nextEventLoopTurn();
    expect(updateFinished).toBe(false);
    expect(departureFinished).toBe(false);

    releaseCutover.resolve();
    await Promise.all([cutover, update, departure]);
    expect(updateFinished).toBe(true);
    expect(departureFinished).toBe(true);
    expect(await baselineCount(db, fixture)).toBe(2);
  });

  it('fails closed when a committed baseline contains an unknown payload version', async () => {
    const fixture = await createFixture(db, fixtureOrganizations, 1);
    await runPersonnelHistoryCutover(db, fixture.context);
    await db
      .update(personnelEmployeeHistoryGroupChanges)
      .set({
        newValues: {
          payloadVersion: 2,
          givenNames: 'Invalid',
          familyName: 'Payload',
        },
      })
      .where(
        and(
          eq(
            personnelEmployeeHistoryGroupChanges.organizationId,
            fixture.organizationId,
          ),
          eq(
            personnelEmployeeHistoryGroupChanges.establishmentId,
            fixture.establishmentId,
          ),
          eq(personnelEmployeeHistoryGroupChanges.semanticGroup, 'identity'),
        ),
      );

    await expect(
      runPersonnelHistoryCutover(db, fixture.context),
    ).rejects.toBeDefined();
  });

  it('rejects a cross-establishment history link at the database boundary', async () => {
    const first = await createFixture(db, fixtureOrganizations, 1);
    const second = await createFixture(db, fixtureOrganizations, 1);
    await runPersonnelHistoryCutover(db, first.context);
    const [event] = await db
      .select()
      .from(personnelEmployeeHistoryEvents)
      .where(
        and(
          eq(
            personnelEmployeeHistoryEvents.organizationId,
            first.organizationId,
          ),
          eq(
            personnelEmployeeHistoryEvents.establishmentId,
            first.establishmentId,
          ),
        ),
      )
      .limit(1);
    expect(event).toBeDefined();
    await expect(
      db.insert(personnelEmployeeHistoryGroupChanges).values({
        id: uuidv7(),
        organizationId: second.organizationId,
        establishmentId: second.establishmentId,
        employeeId: second.employeeIds[0]!,
        eventId: event!.id,
        eventKind: 'cutover_baseline',
        semanticGroup: 'entry',
        classification: null,
        previousValues: null,
        newValues: { payloadVersion: 1, entryDate: '2026-01-01' },
        effectiveDate: null,
        correctionReason: null,
      }),
    ).rejects.toBeDefined();
  });
});

type Fixture = {
  organizationId: string;
  establishmentId: string;
  employeeIds: string[];
  context: TenantContext;
};

async function createFixture(
  db: CloudDatabaseClient,
  fixtureOrganizations: string[],
  employeeCount: number,
): Promise<Fixture> {
  const organizationId = uuidv7();
  const establishmentId = uuidv7();
  const employeeIds = Array.from({ length: employeeCount }, () => uuidv7());
  fixtureOrganizations.push(organizationId);
  await db.insert(organizations).values({
    id: organizationId,
    name: 'Personnel history test',
    slug: `personnel-history-${organizationId}`,
  });
  await db.insert(establishments).values({
    id: establishmentId,
    organizationId,
    name: 'Personnel history establishment',
    slug: `personnel-history-${establishmentId}`,
  });
  if (employeeIds.length > 0) {
    await db
      .insert(personnelEmployeeDossiers)
      .values(
        employeeIds.map((employeeId, index) =>
          employee(employeeId, { organizationId, establishmentId }, `${index}`),
        ),
      );
  }
  return {
    organizationId,
    establishmentId,
    employeeIds,
    context: {
      organizationId,
      establishmentId,
      actor: { type: 'public' },
      locale: 'fr-FR',
      timezone: 'Europe/Paris',
      entitlements: new Set(),
    },
  };
}

function employee(
  id: string,
  scope: { organizationId: string; establishmentId: string },
  suffix: string,
) {
  return {
    id,
    organizationId: scope.organizationId,
    establishmentId: scope.establishmentId,
    givenNames: `Camille ${suffix}`,
    familyName: 'Martin',
    position: 'Cheffe de rang',
    qualification: 'Employée qualifiée',
    employmentTermType: 'indefinite' as const,
    expectedEndDate: null,
    fixedTermReasonCode: null,
    workTimeCategory: 'full_time' as const,
    contractWeeklyMinutes: 2_100,
    entryDate: '2026-01-01',
    departureDate: null,
  };
}

function scoped(context: TenantContext) {
  if (!context.establishmentId) throw new Error('Expected establishment.');
  return { ...context, establishmentId: context.establishmentId };
}

function scopedEmployee(fixture: Fixture, employeeId: string) {
  return and(
    eq(personnelEmployeeDossiers.organizationId, fixture.organizationId),
    eq(personnelEmployeeDossiers.establishmentId, fixture.establishmentId),
    eq(personnelEmployeeDossiers.id, employeeId),
  );
}

async function baselineCount(db: CloudDatabaseClient, fixture: Fixture) {
  return (
    await db
      .select({ id: personnelEmployeeHistoryEvents.id })
      .from(personnelEmployeeHistoryEvents)
      .where(
        and(
          eq(
            personnelEmployeeHistoryEvents.organizationId,
            fixture.organizationId,
          ),
          eq(
            personnelEmployeeHistoryEvents.establishmentId,
            fixture.establishmentId,
          ),
          eq(personnelEmployeeHistoryEvents.eventKind, 'cutover_baseline'),
        ),
      )
  ).length;
}

async function baselineGroupCount(db: CloudDatabaseClient, fixture: Fixture) {
  return (
    await db
      .select({ id: personnelEmployeeHistoryGroupChanges.id })
      .from(personnelEmployeeHistoryGroupChanges)
      .where(
        and(
          eq(
            personnelEmployeeHistoryGroupChanges.organizationId,
            fixture.organizationId,
          ),
          eq(
            personnelEmployeeHistoryGroupChanges.establishmentId,
            fixture.establishmentId,
          ),
          eq(
            personnelEmployeeHistoryGroupChanges.eventKind,
            'cutover_baseline',
          ),
        ),
      )
  ).length;
}

async function markerCount(db: CloudDatabaseClient, fixture: Fixture) {
  return (
    await db
      .select({ id: personnelHistoryCutovers.id })
      .from(personnelHistoryCutovers)
      .where(
        and(
          eq(personnelHistoryCutovers.organizationId, fixture.organizationId),
          eq(personnelHistoryCutovers.establishmentId, fixture.establishmentId),
        ),
      )
  ).length;
}

function deferred<T>() {
  let resolve!: (value: T | PromiseLike<T>) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });
  return { promise, resolve, reject };
}

function nextEventLoopTurn() {
  return new Promise<void>((resolve) => setTimeout(resolve, 50));
}
