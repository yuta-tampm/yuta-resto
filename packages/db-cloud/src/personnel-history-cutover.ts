import {
  personnelHistoryStoredSnapshotSchema,
  type PersonnelHistoryStoredSnapshot,
} from '@yuta/contracts/personnel';
import { requireEstablishment, type TenantContext } from '@yuta/tenant';
import { and, eq, lte, sql } from 'drizzle-orm';
import { v7 as uuidv7 } from 'uuid';
import type { CloudDatabaseClient } from './client';
import {
  personnelEmployeeDossiers,
  personnelEmployeeHistoryEvents,
  personnelEmployeeHistoryGroupChanges,
  personnelHistoryCutovers,
} from './schema';

export const PERSONNEL_HISTORY_CUTOVER_VERSION = 1;

type PersonnelHistoryTransaction = Parameters<
  Parameters<CloudDatabaseClient['transaction']>[0]
>[0];
type ScopedPersonnelContext = TenantContext & { establishmentId: string };
type PersonnelDossierSnapshot = typeof personnelEmployeeDossiers.$inferSelect;

export class PersonnelHistoryCutoverNotCompletedError extends Error {
  readonly code = 'PERSONNEL_HISTORY_CUTOVER_NOT_COMPLETED';

  constructor() {
    super('Personnel history cutover is not completed for this establishment.');
  }
}

export class PersonnelHistoryCutoverIntegrityError extends Error {
  readonly code = 'PERSONNEL_HISTORY_CUTOVER_INTEGRITY_ERROR';

  constructor(message: string) {
    super(message);
  }
}

export type PersonnelHistoryCutoverResult = {
  status: 'completed' | 'already_completed';
  cutoverAt: Date;
  applicableDossierCount: number;
  baselineCount: number;
};

export async function runPersonnelHistoryCutover(
  db: CloudDatabaseClient,
  context: TenantContext,
): Promise<PersonnelHistoryCutoverResult> {
  requireEstablishment(context);
  const scopedContext: ScopedPersonnelContext = context;
  return db.transaction((transaction) =>
    runPersonnelHistoryCutoverInTransaction(transaction, scopedContext),
  );
}

export async function runPersonnelHistoryCutoverInTransaction(
  transaction: PersonnelHistoryTransaction,
  context: ScopedPersonnelContext,
): Promise<PersonnelHistoryCutoverResult> {
  await acquirePersonnelHistoryCutoverLock(transaction, context, 'exclusive');

  const existingMarker = await findCutoverMarker(transaction, context);
  if (existingMarker) {
    const counts = await verifyCutoverIntegrity(
      transaction,
      context,
      existingMarker.cutoverAt,
    );
    return {
      status: 'already_completed',
      cutoverAt: existingMarker.cutoverAt,
      ...counts,
    };
  }

  const cutoverAt = new Date();
  const dossiers = await transaction
    .select()
    .from(personnelEmployeeDossiers)
    .where(scopeDossiers(context));

  for (const dossier of dossiers) {
    const eventId = uuidv7();
    await transaction.insert(personnelEmployeeHistoryEvents).values({
      id: eventId,
      organizationId: context.organizationId,
      establishmentId: context.establishmentId,
      employeeId: dossier.id,
      eventKind: 'cutover_baseline',
      operationId: uuidv7(),
      previousRevision: null,
      newRevision: dossier.revision,
      actorUserId: null,
      payloadVersion: PERSONNEL_HISTORY_CUTOVER_VERSION,
      recordedAt: cutoverAt,
    });
    await transaction.insert(personnelEmployeeHistoryGroupChanges).values(
      createPersonnelHistorySnapshots(dossier).map((snapshot) => ({
        id: uuidv7(),
        organizationId: context.organizationId,
        establishmentId: context.establishmentId,
        employeeId: dossier.id,
        eventId,
        eventKind: 'cutover_baseline' as const,
        semanticGroup: snapshot.semanticGroup,
        classification: null,
        previousValues: null,
        newValues: snapshot.values,
        effectiveDate: null,
        correctionReason: null,
      })),
    );
  }

  const counts = await verifyCutoverIntegrity(transaction, context, cutoverAt);
  if (counts.applicableDossierCount !== dossiers.length) {
    throw new PersonnelHistoryCutoverIntegrityError(
      'The cutover dossier set changed while the exclusive lock was held.',
    );
  }

  const completedAt = new Date();
  await transaction.insert(personnelHistoryCutovers).values({
    id: uuidv7(),
    organizationId: context.organizationId,
    establishmentId: context.establishmentId,
    cutoverVersion: PERSONNEL_HISTORY_CUTOVER_VERSION,
    cutoverAt,
    completedAt,
  });

  return { status: 'completed', cutoverAt, ...counts };
}

export async function assertPersonnelHistoryCutoverCompleted(
  transaction: PersonnelHistoryTransaction,
  context: TenantContext,
): Promise<void> {
  if (!(await isPersonnelHistoryCutoverCompleted(transaction, context))) {
    throw new PersonnelHistoryCutoverNotCompletedError();
  }
}

export async function isPersonnelHistoryCutoverCompleted(
  transaction: PersonnelHistoryTransaction,
  context: TenantContext,
): Promise<boolean> {
  requireEstablishment(context);
  const scopedContext: ScopedPersonnelContext = context;
  await acquirePersonnelHistoryCutoverLock(
    transaction,
    scopedContext,
    'shared',
  );
  const marker = await findCutoverMarker(transaction, scopedContext);
  if (marker) return true;
  const [orphanedHistory] = await transaction
    .select({ id: personnelEmployeeHistoryEvents.id })
    .from(personnelEmployeeHistoryEvents)
    .where(
      and(
        eq(
          personnelEmployeeHistoryEvents.organizationId,
          scopedContext.organizationId,
        ),
        eq(
          personnelEmployeeHistoryEvents.establishmentId,
          scopedContext.establishmentId,
        ),
      ),
    )
    .limit(1);
  if (orphanedHistory) {
    throw new PersonnelHistoryCutoverIntegrityError(
      'Personnel history exists without its completed cutover marker.',
    );
  }
  return false;
}

export function createPersonnelHistorySnapshots(
  dossier: PersonnelDossierSnapshot,
): PersonnelHistoryStoredSnapshot[] {
  return [
    parsePersonnelHistoryStoredSnapshot('identity', {
      payloadVersion: 1,
      givenNames: dossier.givenNames,
      familyName: dossier.familyName,
    }),
    parsePersonnelHistoryStoredSnapshot('role', {
      payloadVersion: 1,
      position: dossier.position,
      qualification: dossier.qualification,
    }),
    parsePersonnelHistoryStoredSnapshot('contract_terms', {
      payloadVersion: 1,
      employmentTermType: dossier.employmentTermType,
      expectedEndDate: dossier.expectedEndDate,
      fixedTermReasonCode: dossier.fixedTermReasonCode,
    }),
    parsePersonnelHistoryStoredSnapshot('work_time', {
      payloadVersion: 1,
      workTimeCategory: dossier.workTimeCategory,
      contractWeeklyMinutes: dossier.contractWeeklyMinutes,
    }),
    parsePersonnelHistoryStoredSnapshot('entry', {
      payloadVersion: 1,
      entryDate: dossier.entryDate,
    }),
    parsePersonnelHistoryStoredSnapshot('departure', {
      payloadVersion: 1,
      departureDate: dossier.departureDate,
    }),
  ];
}

export function parsePersonnelHistoryStoredSnapshot(
  semanticGroup: PersonnelHistoryStoredSnapshot['semanticGroup'],
  values: unknown,
): PersonnelHistoryStoredSnapshot {
  return personnelHistoryStoredSnapshotSchema.parse({ semanticGroup, values });
}

export type PersonnelHistoryRetentionEligibility =
  | { status: 'retained_attached'; eligibleOn: null }
  | { status: 'retained_until_five_years'; eligibleOn: string }
  | { status: 'eligible'; eligibleOn: string };

export function getPersonnelHistoryRetentionEligibility(input: {
  departureDate: string | null;
  businessDate: string;
}): PersonnelHistoryRetentionEligibility {
  if (!input.departureDate) {
    return { status: 'retained_attached', eligibleOn: null };
  }
  const departureDate = parseDateOnly(input.departureDate);
  const businessDate = parseDateOnly(input.businessDate);
  const eligibleDate = new Date(departureDate);
  eligibleDate.setUTCFullYear(eligibleDate.getUTCFullYear() + 5);
  const eligibleOn = eligibleDate.toISOString().slice(0, 10);
  return businessDate >= eligibleDate
    ? { status: 'eligible', eligibleOn }
    : { status: 'retained_until_five_years', eligibleOn };
}

async function acquirePersonnelHistoryCutoverLock(
  transaction: PersonnelHistoryTransaction,
  context: ScopedPersonnelContext,
  mode: 'exclusive' | 'shared',
) {
  const lockKey = `${context.organizationId}:${context.establishmentId}:personnel-history:${PERSONNEL_HISTORY_CUTOVER_VERSION}`;
  if (mode === 'exclusive') {
    await transaction.execute(
      sql`select pg_advisory_xact_lock(hashtextextended(${lockKey}, 0))`,
    );
    return;
  }
  await transaction.execute(
    sql`select pg_advisory_xact_lock_shared(hashtextextended(${lockKey}, 0))`,
  );
}

async function findCutoverMarker(
  transaction: PersonnelHistoryTransaction,
  context: ScopedPersonnelContext,
) {
  const [marker] = await transaction
    .select({ cutoverAt: personnelHistoryCutovers.cutoverAt })
    .from(personnelHistoryCutovers)
    .where(
      and(
        eq(personnelHistoryCutovers.organizationId, context.organizationId),
        eq(personnelHistoryCutovers.establishmentId, context.establishmentId),
        eq(
          personnelHistoryCutovers.cutoverVersion,
          PERSONNEL_HISTORY_CUTOVER_VERSION,
        ),
      ),
    )
    .limit(1);
  return marker ?? null;
}

async function verifyCutoverIntegrity(
  transaction: PersonnelHistoryTransaction,
  context: ScopedPersonnelContext,
  cutoverAt: Date,
) {
  const applicableDossiers = await transaction
    .select({ id: personnelEmployeeDossiers.id })
    .from(personnelEmployeeDossiers)
    .where(
      and(
        scopeDossiers(context),
        lte(personnelEmployeeDossiers.createdAt, cutoverAt),
      ),
    );
  const baselines = await transaction
    .select({ id: personnelEmployeeHistoryEvents.id })
    .from(personnelEmployeeHistoryEvents)
    .where(
      and(
        eq(
          personnelEmployeeHistoryEvents.organizationId,
          context.organizationId,
        ),
        eq(
          personnelEmployeeHistoryEvents.establishmentId,
          context.establishmentId,
        ),
        eq(personnelEmployeeHistoryEvents.eventKind, 'cutover_baseline'),
      ),
    );
  if (applicableDossiers.length !== baselines.length) {
    throw new PersonnelHistoryCutoverIntegrityError(
      'Cutover baseline count does not match the applicable dossier count.',
    );
  }

  const groups = await transaction
    .select({
      eventId: personnelEmployeeHistoryGroupChanges.eventId,
      semanticGroup: personnelEmployeeHistoryGroupChanges.semanticGroup,
      newValues: personnelEmployeeHistoryGroupChanges.newValues,
    })
    .from(personnelEmployeeHistoryGroupChanges)
    .where(
      and(
        eq(
          personnelEmployeeHistoryGroupChanges.organizationId,
          context.organizationId,
        ),
        eq(
          personnelEmployeeHistoryGroupChanges.establishmentId,
          context.establishmentId,
        ),
        eq(personnelEmployeeHistoryGroupChanges.eventKind, 'cutover_baseline'),
      ),
    );
  const groupCountByEvent = new Map<string, number>();
  for (const group of groups) {
    parsePersonnelHistoryStoredSnapshot(group.semanticGroup, group.newValues);
    groupCountByEvent.set(
      group.eventId,
      (groupCountByEvent.get(group.eventId) ?? 0) + 1,
    );
  }
  if (
    groups.length !== baselines.length * 6 ||
    baselines.some((baseline) => groupCountByEvent.get(baseline.id) !== 6)
  ) {
    throw new PersonnelHistoryCutoverIntegrityError(
      'Each cutover baseline must contain exactly six valid semantic groups.',
    );
  }
  return {
    applicableDossierCount: applicableDossiers.length,
    baselineCount: baselines.length,
  };
}

function scopeDossiers(context: ScopedPersonnelContext) {
  return and(
    eq(personnelEmployeeDossiers.organizationId, context.organizationId),
    eq(personnelEmployeeDossiers.establishmentId, context.establishmentId),
  );
}

function parseDateOnly(value: string): Date {
  if (!/^\d{4}-\d{2}-\d{2}$/u.test(value)) {
    throw new Error('Expected an ISO date-only value.');
  }
  const parsed = new Date(`${value}T00:00:00.000Z`);
  if (
    Number.isNaN(parsed.getTime()) ||
    parsed.toISOString().slice(0, 10) !== value
  ) {
    throw new Error('Expected a valid ISO date-only value.');
  }
  return parsed;
}
