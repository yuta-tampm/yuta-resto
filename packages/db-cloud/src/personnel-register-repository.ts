import {
  createPersonnelRegisterEntryInputSchema,
  correctPersonnelRegisterEntryInputSchema,
  personnelRegisterFactsSchema,
  personnelRegisterListQuerySchema,
  type CorrectPersonnelRegisterEntryInput,
  type CreatePersonnelRegisterEntryInput,
  type PersonnelRegisterCandidateList,
  type PersonnelRegisterEntry,
  type PersonnelRegisterPage,
} from '@yuta/contracts/personnel';
import { identifierSchema } from '@yuta/contracts';
import { requireEstablishment, type TenantContext } from '@yuta/tenant';
import { and, asc, desc, eq, gt, isNull, lte, sql } from 'drizzle-orm';
import { createHash } from 'node:crypto';
import { v7 as uuidv7 } from 'uuid';
import { z } from 'zod';
import type { AnyPgColumn } from 'drizzle-orm/pg-core';
import type { CloudDatabaseClient } from './client';
import {
  establishments,
  personnelEmployeeDossiers,
  personnelRegisterAuditEvents,
  personnelRegisterCommandReceipts,
  personnelRegisterCorrections,
  personnelRegisterCounters,
  personnelRegisterEntries,
} from './schema';

type PersonnelTenantContext = TenantContext & { establishmentId: string };
type RegisterAuditEventType =
  | 'personnel.register_viewed'
  | 'personnel.register_exported';

const cursorSchema = z
  .object({
    snapshotRevision: z.number().int().nonnegative(),
    sequence: z.number().int().positive(),
  })
  .strict();

export class PersonnelRegisterRepositoryError extends Error {
  constructor(
    message: string,
    public readonly code:
      | 'ACTOR_REQUIRED'
      | 'NOT_FOUND'
      | 'EMPLOYEE_ALREADY_INSCRIBED'
      | 'EMPLOYEE_CHANGED'
      | 'CONFLICT'
      | 'IDEMPOTENCY_CONFLICT'
      | 'STALE_CURSOR'
      | 'EMPTY_REGISTER'
      | 'NO_CHANGES',
  ) {
    super(message);
    this.name = 'PersonnelRegisterRepositoryError';
  }
}

export async function listPersonnelRegisterCandidates(
  db: CloudDatabaseClient,
  context: TenantContext,
): Promise<PersonnelRegisterCandidateList> {
  requireEstablishment(context);
  const scoped: PersonnelTenantContext = context;
  const rows = await db
    .select({
      employeeId: personnelEmployeeDossiers.id,
      givenNames: personnelEmployeeDossiers.givenNames,
      familyName: personnelEmployeeDossiers.familyName,
      position: personnelEmployeeDossiers.position,
      qualification: personnelEmployeeDossiers.qualification,
      entryDate: personnelEmployeeDossiers.entryDate,
      departureDate: personnelEmployeeDossiers.departureDate,
      employmentTermType: personnelEmployeeDossiers.employmentTermType,
      workTimeCategory: personnelEmployeeDossiers.workTimeCategory,
    })
    .from(personnelEmployeeDossiers)
    .leftJoin(
      personnelRegisterEntries,
      and(
        eq(personnelRegisterEntries.organizationId, scoped.organizationId),
        eq(personnelRegisterEntries.establishmentId, scoped.establishmentId),
        eq(personnelRegisterEntries.employeeId, personnelEmployeeDossiers.id),
      ),
    )
    .where(
      and(
        eq(personnelEmployeeDossiers.organizationId, scoped.organizationId),
        eq(personnelEmployeeDossiers.establishmentId, scoped.establishmentId),
        isNull(personnelRegisterEntries.id),
      ),
    )
    .orderBy(
      asc(personnelEmployeeDossiers.entryDate),
      asc(personnelEmployeeDossiers.id),
    )
    .limit(100);
  return { items: rows };
}

export async function listPersonnelRegister(
  db: CloudDatabaseClient,
  context: TenantContext,
  rawQuery: { cursor?: string; limit?: 50 },
  operationId: string,
): Promise<PersonnelRegisterPage> {
  requireUser(context);
  const query = personnelRegisterListQuerySchema.parse(rawQuery);
  const cursor = query.cursor ? decodeCursor(query.cursor) : null;
  identifierSchema.parse(operationId);

  return db.transaction(
    async (transaction) => {
      const [counter] = await transaction
        .select({ revision: personnelRegisterCounters.revision })
        .from(personnelRegisterCounters)
        .where(scopeCondition(personnelRegisterCounters, context))
        .limit(1);
      const snapshotRevision = counter?.revision ?? 0;
      if (cursor && cursor.snapshotRevision !== snapshotRevision) {
        throw new PersonnelRegisterRepositoryError(
          'The register changed. Refresh before continuing.',
          'STALE_CURSOR',
        );
      }
      const rows = await transaction
        .select()
        .from(personnelRegisterEntries)
        .where(
          and(
            scopeCondition(personnelRegisterEntries, context),
            cursor
              ? gt(personnelRegisterEntries.sequence, cursor.sequence)
              : undefined,
          ),
        )
        .orderBy(asc(personnelRegisterEntries.sequence))
        .limit(query.limit + 1);
      const hasMore = rows.length > query.limit;
      const pageRows = hasMore ? rows.slice(0, query.limit) : rows;
      const last = pageRows.at(-1);
      await insertAuditEvent(
        transaction,
        context,
        'personnel.register_viewed',
        operationId,
      );
      return {
        items: pageRows.map(toEntry),
        snapshotRevision,
        readiness: pageRows.length === 0 && !cursor ? 'empty' : 'ready',
        pageInfo: {
          hasMore,
          nextCursor:
            hasMore && last
              ? encodeCursor({ snapshotRevision, sequence: last.sequence })
              : null,
        },
      };
    },
    { isolationLevel: 'repeatable read' },
  );
}

export async function getPersonnelRegisterExportSnapshot(
  db: CloudDatabaseClient,
  context: TenantContext,
): Promise<{
  establishmentName: string;
  snapshotRevision: number;
  items: PersonnelRegisterEntry[];
  generatedAt: string;
}> {
  requireUser(context);
  return db.transaction(
    async (transaction) => {
      const [counter] = await transaction
        .select({ revision: personnelRegisterCounters.revision })
        .from(personnelRegisterCounters)
        .where(scopeCondition(personnelRegisterCounters, context))
        .limit(1);
      const [establishment] = await transaction
        .select({ name: establishments.name })
        .from(establishments)
        .where(
          and(
            eq(establishments.organizationId, context.organizationId),
            eq(establishments.id, context.establishmentId!),
          ),
        )
        .limit(1);
      const rows = await transaction
        .select()
        .from(personnelRegisterEntries)
        .where(scopeCondition(personnelRegisterEntries, context))
        .orderBy(asc(personnelRegisterEntries.sequence));
      if (!establishment) {
        throw new PersonnelRegisterRepositoryError(
          'Establishment not found.',
          'NOT_FOUND',
        );
      }
      if (rows.length === 0) {
        throw new PersonnelRegisterRepositoryError(
          'The register is empty.',
          'EMPTY_REGISTER',
        );
      }
      return {
        establishmentName: establishment.name,
        snapshotRevision: counter?.revision ?? 0,
        items: rows.map(toEntry),
        generatedAt: new Date().toISOString(),
      };
    },
    { isolationLevel: 'repeatable read' },
  );
}

export async function recordPersonnelRegisterExport(
  db: CloudDatabaseClient,
  context: TenantContext,
  operationId: string,
): Promise<void> {
  identifierSchema.parse(operationId);
  await insertAuditEvent(
    db,
    context,
    'personnel.register_exported',
    operationId,
  );
}

export async function createPersonnelRegisterEntry(
  db: CloudDatabaseClient,
  context: TenantContext,
  rawInput: CreatePersonnelRegisterEntryInput,
  now = new Date(),
): Promise<{ entry: PersonnelRegisterEntry; idempotentReplay: boolean }> {
  const actorUserId = requireUser(context);
  const input = createPersonnelRegisterEntryInputSchema.parse(rawInput);
  const fingerprint = hash(JSON.stringify(input));
  return db.transaction(async (transaction) => {
    await transaction.execute(
      sql`select pg_advisory_xact_lock(hashtextextended(${`${context.organizationId}:${context.establishmentId}:${actorUserId}:register:${input.operationId}`}, 0))`,
    );
    const replay = await findReceipt(
      transaction,
      context,
      actorUserId,
      'register.inscribe',
      input.operationId,
    );
    if (replay) {
      if (replay.requestFingerprint !== fingerprint) throwIdempotencyConflict();
      const [entry] = await transaction
        .select()
        .from(personnelRegisterEntries)
        .where(
          and(
            scopeCondition(personnelRegisterEntries, context),
            eq(personnelRegisterEntries.id, replay.entryId),
          ),
        )
        .limit(1);
      if (!entry) throwIdempotencyConflict();
      return {
        entry: {
          ...toEntry(entry),
          revision: 1,
          facts: personnelRegisterFactsSchema.parse(entry.initialFacts),
          updatedAt: entry.inscribedAt.toISOString(),
        },
        idempotentReplay: true,
      };
    }
    const [employee] = await transaction
      .select()
      .from(personnelEmployeeDossiers)
      .where(
        and(
          scopeCondition(personnelEmployeeDossiers, context),
          eq(personnelEmployeeDossiers.id, input.employeeId),
        ),
      )
      .limit(1);
    if (!employee)
      throw new PersonnelRegisterRepositoryError(
        'Employee not found.',
        'NOT_FOUND',
      );
    if (!employeeMatchesFacts(employee, input.facts)) {
      throw new PersonnelRegisterRepositoryError(
        'The employee dossier changed before inscription.',
        'EMPLOYEE_CHANGED',
      );
    }
    const [existing] = await transaction
      .select({ id: personnelRegisterEntries.id })
      .from(personnelRegisterEntries)
      .where(
        and(
          scopeCondition(personnelRegisterEntries, context),
          eq(personnelRegisterEntries.employeeId, input.employeeId),
        ),
      )
      .limit(1);
    if (existing) {
      throw new PersonnelRegisterRepositoryError(
        'Employee already inscribed.',
        'EMPLOYEE_ALREADY_INSCRIBED',
      );
    }
    await transaction
      .insert(personnelRegisterCounters)
      .values({
        organizationId: context.organizationId,
        establishmentId: context.establishmentId!,
      })
      .onConflictDoNothing();
    const [counter] = await transaction
      .update(personnelRegisterCounters)
      .set({
        nextSequence: sql`${personnelRegisterCounters.nextSequence} + 1`,
        revision: sql`${personnelRegisterCounters.revision} + 1`,
        updatedAt: now,
      })
      .where(scopeCondition(personnelRegisterCounters, context))
      .returning({ nextSequence: personnelRegisterCounters.nextSequence });
    if (!counter)
      throw new PersonnelRegisterRepositoryError(
        'Register not found.',
        'NOT_FOUND',
      );
    const [created] = await transaction
      .insert(personnelRegisterEntries)
      .values({
        id: uuidv7(),
        organizationId: context.organizationId,
        establishmentId: context.establishmentId!,
        employeeId: input.employeeId,
        sequence: counter.nextSequence - 1,
        initialFacts: input.facts,
        currentFacts: input.facts,
        inscribedByUserId: actorUserId,
        inscribedAt: now,
        updatedAt: now,
      })
      .returning();
    if (!created)
      throw new PersonnelRegisterRepositoryError(
        'Register entry not created.',
        'NOT_FOUND',
      );
    await transaction.insert(personnelRegisterCommandReceipts).values({
      id: uuidv7(),
      organizationId: context.organizationId,
      establishmentId: context.establishmentId!,
      actorUserId,
      commandType: 'register.inscribe',
      operationId: input.operationId,
      requestFingerprint: fingerprint,
      entryId: created.id,
    });
    return { entry: toEntry(created), idempotentReplay: false };
  });
}

export async function correctPersonnelRegisterEntry(
  db: CloudDatabaseClient,
  context: TenantContext,
  rawInput: CorrectPersonnelRegisterEntryInput,
  now = new Date(),
): Promise<{ entry: PersonnelRegisterEntry; idempotentReplay: boolean }> {
  const actorUserId = requireUser(context);
  const input = correctPersonnelRegisterEntryInputSchema.parse(rawInput);
  const fingerprint = hash(JSON.stringify(input));
  return db.transaction(async (transaction) => {
    await transaction.execute(
      sql`select pg_advisory_xact_lock(hashtextextended(${`${context.organizationId}:${context.establishmentId}:${actorUserId}:register:${input.operationId}`}, 0))`,
    );
    const replay = await findReceipt(
      transaction,
      context,
      actorUserId,
      'register.correct',
      input.operationId,
    );
    if (replay) {
      if (replay.requestFingerprint !== fingerprint) throwIdempotencyConflict();
      const [entry] = await transaction
        .select()
        .from(personnelRegisterEntries)
        .where(
          and(
            scopeCondition(personnelRegisterEntries, context),
            eq(personnelRegisterEntries.id, replay.entryId),
          ),
        )
        .limit(1);
      if (!entry) throwIdempotencyConflict();
      const [correction] = await transaction
        .select()
        .from(personnelRegisterCorrections)
        .where(
          and(
            scopeCondition(personnelRegisterCorrections, context),
            eq(personnelRegisterCorrections.entryId, replay.entryId),
            lte(personnelRegisterCorrections.recordedAt, replay.createdAt),
          ),
        )
        .orderBy(desc(personnelRegisterCorrections.recordedAt))
        .limit(1);
      if (!correction) throwIdempotencyConflict();
      return {
        entry: {
          ...toEntry(entry),
          revision: correction.newRevision,
          facts: personnelRegisterFactsSchema.parse(correction.newFacts),
          updatedAt: correction.recordedAt.toISOString(),
        },
        idempotentReplay: true,
      };
    }
    const [current] = await transaction
      .select()
      .from(personnelRegisterEntries)
      .where(
        and(
          scopeCondition(personnelRegisterEntries, context),
          eq(personnelRegisterEntries.id, input.entryId),
        ),
      )
      .limit(1);
    if (!current)
      throw new PersonnelRegisterRepositoryError(
        'Register entry not found.',
        'NOT_FOUND',
      );
    if (current.revision !== input.expectedRevision)
      throw new PersonnelRegisterRepositoryError(
        'The register entry changed.',
        'CONFLICT',
      );
    if (stableJson(current.currentFacts) === stableJson(input.facts)) {
      throw new PersonnelRegisterRepositoryError(
        'The correction does not change any register fact.',
        'NO_CHANGES',
      );
    }
    const [updated] = await transaction
      .update(personnelRegisterEntries)
      .set({
        currentFacts: input.facts,
        revision: sql`${personnelRegisterEntries.revision} + 1`,
        updatedAt: now,
      })
      .where(
        and(
          scopeCondition(personnelRegisterEntries, context),
          eq(personnelRegisterEntries.id, input.entryId),
          eq(personnelRegisterEntries.revision, input.expectedRevision),
        ),
      )
      .returning();
    if (!updated)
      throw new PersonnelRegisterRepositoryError(
        'The register entry changed.',
        'CONFLICT',
      );
    await transaction.insert(personnelRegisterCorrections).values({
      id: uuidv7(),
      organizationId: context.organizationId,
      establishmentId: context.establishmentId!,
      entryId: current.id,
      priorRevision: current.revision,
      newRevision: updated.revision,
      previousFacts: current.currentFacts,
      newFacts: input.facts,
      effectiveDate: input.effectiveDate,
      reason: input.reason,
      actorUserId,
      recordedAt: now,
    });
    await transaction
      .update(personnelRegisterCounters)
      .set({
        revision: sql`${personnelRegisterCounters.revision} + 1`,
        updatedAt: now,
      })
      .where(scopeCondition(personnelRegisterCounters, context));
    await transaction.insert(personnelRegisterCommandReceipts).values({
      id: uuidv7(),
      organizationId: context.organizationId,
      establishmentId: context.establishmentId!,
      actorUserId,
      commandType: 'register.correct',
      operationId: input.operationId,
      requestFingerprint: fingerprint,
      entryId: current.id,
    });
    return { entry: toEntry(updated), idempotentReplay: false };
  });
}

function toEntry(
  row: typeof personnelRegisterEntries.$inferSelect,
): PersonnelRegisterEntry {
  return {
    id: row.id,
    employeeId: row.employeeId,
    sequence: row.sequence,
    revision: row.revision,
    facts: personnelRegisterFactsSchema.parse(row.currentFacts),
    inscribedAt: row.inscribedAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

function employeeMatchesFacts(
  employee: typeof personnelEmployeeDossiers.$inferSelect,
  facts: z.infer<typeof personnelRegisterFactsSchema>,
): boolean {
  return (
    employee.givenNames === facts.givenNames &&
    employee.familyName === facts.familyName &&
    employee.position === facts.position &&
    employee.qualification === facts.qualification &&
    employee.entryDate === facts.entryDate &&
    employee.departureDate === facts.departureDate &&
    employee.employmentTermType === facts.employmentTermType &&
    employee.workTimeCategory === facts.workTimeCategory
  );
}

function requireUser(context: TenantContext): string {
  requireEstablishment(context);
  if (context.actor.type !== 'user') {
    throw new PersonnelRegisterRepositoryError(
      'A user actor is required.',
      'ACTOR_REQUIRED',
    );
  }
  return context.actor.userId;
}

function scopeCondition(
  table: { organizationId: AnyPgColumn; establishmentId: AnyPgColumn },
  context: TenantContext,
) {
  return and(
    eq(table.organizationId, context.organizationId),
    eq(table.establishmentId, context.establishmentId!),
  );
}

async function insertAuditEvent(
  db:
    | CloudDatabaseClient
    | Parameters<Parameters<CloudDatabaseClient['transaction']>[0]>[0],
  context: TenantContext,
  eventType: RegisterAuditEventType,
  operationId: string,
) {
  const actorUserId = requireUser(context);
  await db
    .insert(personnelRegisterAuditEvents)
    .values({
      id: uuidv7(),
      organizationId: context.organizationId,
      establishmentId: context.establishmentId!,
      actorUserId,
      eventType,
      operationId,
    })
    .onConflictDoNothing();
}

async function findReceipt(
  db: Parameters<Parameters<CloudDatabaseClient['transaction']>[0]>[0],
  context: TenantContext,
  actorUserId: string,
  commandType: string,
  operationId: string,
) {
  const [receipt] = await db
    .select()
    .from(personnelRegisterCommandReceipts)
    .where(
      and(
        scopeCondition(personnelRegisterCommandReceipts, context),
        eq(personnelRegisterCommandReceipts.actorUserId, actorUserId),
        eq(personnelRegisterCommandReceipts.commandType, commandType),
        eq(personnelRegisterCommandReceipts.operationId, operationId),
      ),
    )
    .limit(1);
  return receipt;
}

function hash(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

function stableJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.entries(value)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, item]) => `${JSON.stringify(key)}:${stableJson(item)}`)
      .join(',')}}`;
  }
  return JSON.stringify(value);
}

function throwIdempotencyConflict(): never {
  throw new PersonnelRegisterRepositoryError(
    'The operation ID was reused for different data.',
    'IDEMPOTENCY_CONFLICT',
  );
}

function encodeCursor(value: z.infer<typeof cursorSchema>): string {
  return Buffer.from(JSON.stringify(value), 'utf8').toString('base64url');
}

function decodeCursor(value: string): z.infer<typeof cursorSchema> {
  try {
    return cursorSchema.parse(
      JSON.parse(Buffer.from(value, 'base64url').toString('utf8')),
    );
  } catch {
    throw new PersonnelRegisterRepositoryError(
      'Invalid register cursor.',
      'STALE_CURSOR',
    );
  }
}
