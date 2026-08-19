import { identifierSchema } from '@yuta/contracts';
import {
  createPersonnelEmployeeInputSchema,
  personnelEmployeeAccessEventTypeSchema,
  personnelEmployeeAuditEventTypeSchema,
  personnelEmployeeAuditFieldSchema,
  personnelEmployeeListQuerySchema,
  setPersonnelEmployeeDepartureInputSchema,
  updatePersonnelEmployeeInputSchema,
  type CreatePersonnelEmployeeInput,
  type PersonnelDuplicateCandidate,
  type PersonnelEmployeeAccessEvent,
  type PersonnelEmployeeAccessHistory,
  type PersonnelEmployeeListQuery,
  type PersonnelEmployeeListResponse,
  type PersonnelEmployeeAuditHistory,
  type PersonnelEmployeeSummary,
  type PersonnelEmployeeView,
  type SetPersonnelEmployeeDepartureInput,
  type UpdatePersonnelEmployeeInput,
} from '@yuta/contracts/personnel';
import { requireEstablishment, type TenantContext } from '@yuta/tenant';
import {
  and,
  desc,
  eq,
  ilike,
  inArray,
  isNotNull,
  isNull,
  lt,
  lte,
  or,
  sql,
  type SQL,
} from 'drizzle-orm';
import { createHash } from 'node:crypto';
import { v7 as uuidv7 } from 'uuid';
import { z } from 'zod';
import type { CloudDatabaseClient } from './client';
import {
  personnelCommandReceipts,
  personnelEmployeeAuditEvents,
  personnelEmployeeDossiers,
  users,
} from './schema';

type PersonnelTenantContext = TenantContext & { establishmentId: string };

const cursorPayloadSchema = z
  .object({ entryDate: z.string().date(), id: z.string().uuid() })
  .strict();
const accessCursorPayloadSchema = z
  .object({ createdAt: z.string().datetime(), id: z.string().uuid() })
  .strict();

export async function listPersonnelEmployees(
  db: CloudDatabaseClient,
  context: TenantContext,
  rawQuery: PersonnelEmployeeListQuery,
  businessDate: string,
): Promise<PersonnelEmployeeListResponse> {
  requireEstablishment(context);
  const scopedContext: PersonnelTenantContext = context;
  const query = personnelEmployeeListQuerySchema.parse(rawQuery);
  const cursor = query.cursor ? decodeCursor(query.cursor) : null;
  const scope = and(
    eq(personnelEmployeeDossiers.organizationId, scopedContext.organizationId),
    eq(
      personnelEmployeeDossiers.establishmentId,
      scopedContext.establishmentId,
    ),
  );
  const viewCondition = getViewCondition(query.view, businessDate);
  const searchCondition = query.search
    ? or(
        ilike(
          personnelEmployeeDossiers.givenNames,
          `%${escapeLike(query.search)}%`,
        ),
        ilike(
          personnelEmployeeDossiers.familyName,
          `%${escapeLike(query.search)}%`,
        ),
        ilike(
          personnelEmployeeDossiers.position,
          `%${escapeLike(query.search)}%`,
        ),
        ilike(
          personnelEmployeeDossiers.qualification,
          `%${escapeLike(query.search)}%`,
        ),
      )
    : undefined;
  const incompleteCondition = getIncompleteCondition();
  const completenessCondition =
    query.completeness === 'incomplete'
      ? incompleteCondition
      : query.completeness === 'complete'
        ? sql`not (${incompleteCondition})`
        : undefined;
  const cursorCondition = cursor
    ? or(
        lt(personnelEmployeeDossiers.entryDate, cursor.entryDate),
        and(
          eq(personnelEmployeeDossiers.entryDate, cursor.entryDate),
          lt(personnelEmployeeDossiers.id, cursor.id),
        ),
      )
    : undefined;

  const [rows, countsRows] = await Promise.all([
    db
      .select()
      .from(personnelEmployeeDossiers)
      .where(
        and(
          scope,
          viewCondition,
          searchCondition,
          completenessCondition,
          cursorCondition,
        ),
      )
      .orderBy(
        desc(personnelEmployeeDossiers.entryDate),
        desc(personnelEmployeeDossiers.id),
      )
      .limit(query.limit + 1),
    db
      .select({
        active:
          sql<number>`count(*) filter (where ${getViewCondition('active', businessDate)})`.mapWith(
            Number,
          ),
        upcoming:
          sql<number>`count(*) filter (where ${getViewCondition('upcoming', businessDate)})`.mapWith(
            Number,
          ),
        former:
          sql<number>`count(*) filter (where ${getViewCondition('former', businessDate)})`.mapWith(
            Number,
          ),
        incomplete:
          sql<number>`count(*) filter (where ${incompleteCondition})`.mapWith(
            Number,
          ),
      })
      .from(personnelEmployeeDossiers)
      .where(scope),
  ]);

  const hasMore = rows.length > query.limit;
  const pageRows = hasMore ? rows.slice(0, query.limit) : rows;
  const lastRow = pageRows.at(-1);
  const counts = countsRows[0] ?? {
    active: 0,
    upcoming: 0,
    former: 0,
    incomplete: 0,
  };

  return {
    items: pageRows.map((row) => toSummary(row, businessDate)),
    counts,
    pageInfo: {
      hasMore,
      nextCursor:
        hasMore && lastRow
          ? encodeCursor({ entryDate: lastRow.entryDate, id: lastRow.id })
          : null,
    },
  };
}

export async function findPersonnelEmployee(
  db: CloudDatabaseClient,
  context: TenantContext,
  employeeId: string,
  businessDate: string,
): Promise<PersonnelEmployeeSummary | null> {
  requireEstablishment(context);
  const [row] = await db
    .select()
    .from(personnelEmployeeDossiers)
    .where(
      and(
        eq(personnelEmployeeDossiers.id, employeeId),
        eq(personnelEmployeeDossiers.organizationId, context.organizationId),
        eq(personnelEmployeeDossiers.establishmentId, context.establishmentId),
      ),
    )
    .limit(1);
  return row ? toSummary(row, businessDate) : null;
}

const personnelContractExtractionAuditInputSchema = z
  .object({
    employeeId: identifierSchema,
    requestId: identifierSchema,
    documentId: identifierSchema,
    documentVersion: z.number().int().positive(),
    eventType: z.enum([
      'employee.contract_extraction_requested',
      'employee.contract_extraction_completed',
      'employee.contract_extraction_failed',
    ]),
    outcomeCode: z.enum([
      'requested',
      'complete',
      'partial',
      'no_result',
      'unsupported',
      'document_stale',
      'employee_conflict',
      'rate_limited',
      'timeout',
      'failed',
    ]),
    suggestionCount: z.number().int().min(0).max(8),
  })
  .strict();

export type PersonnelContractExtractionAuditInput = z.infer<
  typeof personnelContractExtractionAuditInputSchema
>;

export async function recordPersonnelContractExtractionAudit(
  db: CloudDatabaseClient,
  context: TenantContext,
  rawInput: PersonnelContractExtractionAuditInput,
): Promise<void> {
  requireEstablishment(context);
  if (context.actor.type !== 'user') {
    throw new PersonnelRepositoryError(
      'A user actor is required.',
      'ACTOR_REQUIRED',
    );
  }
  const actorUserId = context.actor.userId;
  const input = personnelContractExtractionAuditInputSchema.parse(rawInput);
  await db.transaction(async (transaction) => {
    await transaction.execute(
      sql`select pg_advisory_xact_lock(hashtextextended(${`${context.organizationId}:${context.establishmentId}:${input.employeeId}:${input.eventType}:${input.requestId}`}, 0))`,
    );
    const employee = await findScopedEmployee(
      transaction,
      context,
      input.employeeId,
    );
    if (!employee) {
      throw new PersonnelRepositoryError('Employee not found.', 'NOT_FOUND');
    }
    const [existing] = await transaction
      .select({ id: personnelEmployeeAuditEvents.id })
      .from(personnelEmployeeAuditEvents)
      .where(
        and(
          eq(
            personnelEmployeeAuditEvents.organizationId,
            context.organizationId,
          ),
          eq(
            personnelEmployeeAuditEvents.establishmentId,
            context.establishmentId,
          ),
          eq(personnelEmployeeAuditEvents.employeeId, input.employeeId),
          eq(personnelEmployeeAuditEvents.eventType, input.eventType),
          eq(personnelEmployeeAuditEvents.operationId, input.requestId),
        ),
      )
      .limit(1);
    if (existing) return;
    await transaction.insert(personnelEmployeeAuditEvents).values({
      id: uuidv7(),
      organizationId: context.organizationId,
      establishmentId: context.establishmentId,
      employeeId: input.employeeId,
      actorUserId,
      eventType: input.eventType,
      operationId: input.requestId,
      changedFields: [],
      metadata: {
        documentId: input.documentId,
        documentVersion: input.documentVersion,
        outcomeCode: input.outcomeCode,
        suggestionCount: input.suggestionCount,
      },
    });
  });
}

const personnelContractExtractionReviewGrantInputSchema = z
  .object({
    employeeId: identifierSchema,
    requestId: identifierSchema,
    documentId: identifierSchema,
    documentVersion: z.number().int().positive(),
    outcomeCode: z.enum(['complete', 'partial']),
  })
  .strict();

export type PersonnelContractExtractionReviewGrantInput = z.infer<
  typeof personnelContractExtractionReviewGrantInputSchema
>;

export async function validatePersonnelContractExtractionReviewGrant(
  db: CloudDatabaseClient,
  context: TenantContext,
  rawInput: PersonnelContractExtractionReviewGrantInput,
  now = new Date(),
): Promise<'valid' | 'expired' | 'not_found'> {
  requireEstablishment(context);
  if (context.actor.type !== 'user') {
    throw new PersonnelRepositoryError(
      'A user actor is required.',
      'ACTOR_REQUIRED',
    );
  }
  const input =
    personnelContractExtractionReviewGrantInputSchema.parse(rawInput);
  const [event] = await db
    .select({
      metadata: personnelEmployeeAuditEvents.metadata,
      createdAt: personnelEmployeeAuditEvents.createdAt,
    })
    .from(personnelEmployeeAuditEvents)
    .where(
      and(
        eq(personnelEmployeeAuditEvents.organizationId, context.organizationId),
        eq(
          personnelEmployeeAuditEvents.establishmentId,
          context.establishmentId,
        ),
        eq(personnelEmployeeAuditEvents.employeeId, input.employeeId),
        eq(
          personnelEmployeeAuditEvents.eventType,
          'employee.contract_extraction_completed',
        ),
        eq(personnelEmployeeAuditEvents.operationId, input.requestId),
      ),
    )
    .limit(1);
  if (!event) return 'not_found';
  const metadata = event.metadata;
  if (
    metadata.documentId !== input.documentId ||
    metadata.documentVersion !== input.documentVersion ||
    metadata.outcomeCode !== input.outcomeCode
  ) {
    return 'not_found';
  }
  const ageMilliseconds = now.getTime() - event.createdAt.getTime();
  if (ageMilliseconds < 0 || ageMilliseconds > 15 * 60 * 1_000) {
    return 'expired';
  }
  return 'valid';
}

export async function listPersonnelEmployeeAuditHistory(
  db: CloudDatabaseClient,
  context: TenantContext,
  rawEmployeeId: string,
): Promise<PersonnelEmployeeAuditHistory> {
  requireEstablishment(context);
  const employeeId = identifierSchema.parse(rawEmployeeId);
  const rows = await db
    .select({
      id: personnelEmployeeAuditEvents.id,
      eventType: personnelEmployeeAuditEvents.eventType,
      changedFields: personnelEmployeeAuditEvents.changedFields,
      metadata: personnelEmployeeAuditEvents.metadata,
      createdAt: personnelEmployeeAuditEvents.createdAt,
      actorDisplayName: users.displayName,
    })
    .from(personnelEmployeeAuditEvents)
    .leftJoin(users, eq(personnelEmployeeAuditEvents.actorUserId, users.id))
    .where(
      and(
        eq(personnelEmployeeAuditEvents.employeeId, employeeId),
        eq(personnelEmployeeAuditEvents.organizationId, context.organizationId),
        eq(
          personnelEmployeeAuditEvents.establishmentId,
          context.establishmentId,
        ),
        inArray(
          personnelEmployeeAuditEvents.eventType,
          personnelEmployeeAuditEventTypeSchema.options,
        ),
      ),
    )
    .orderBy(
      desc(personnelEmployeeAuditEvents.createdAt),
      desc(personnelEmployeeAuditEvents.id),
    )
    .limit(51);

  const items = rows.slice(0, 50).flatMap((row) => {
    const eventType = personnelEmployeeAuditEventTypeSchema.safeParse(
      row.eventType,
    );
    if (!eventType.success) return [];
    const changedFields = row.changedFields.flatMap((field) => {
      const parsed = personnelEmployeeAuditFieldSchema.safeParse(field);
      return parsed.success ? [parsed.data] : [];
    });
    const metadata = safeAuditMetadata(row.metadata);
    return [
      {
        id: row.id,
        eventType: eventType.data,
        changedFields,
        actorDisplayName: row.actorDisplayName,
        occurredAt: row.createdAt.toISOString(),
        reason: metadata.reason,
        previousDepartureDate: metadata.previousDepartureDate,
        newDepartureDate: metadata.newDepartureDate,
      },
    ];
  });
  return { items, truncated: rows.length > 50 };
}

export async function listPersonnelEmployeeAccessHistory(
  db: CloudDatabaseClient,
  context: TenantContext,
  rawEmployeeId: string,
  rawCursor?: string,
): Promise<PersonnelEmployeeAccessHistory> {
  requireEstablishment(context);
  const employeeId = identifierSchema.parse(rawEmployeeId);
  const cursor = rawCursor ? decodeAccessCursor(rawCursor) : null;
  const rows = await db
    .select({
      id: personnelEmployeeAuditEvents.id,
      eventType: personnelEmployeeAuditEvents.eventType,
      createdAt: personnelEmployeeAuditEvents.createdAt,
      actorUserId: personnelEmployeeAuditEvents.actorUserId,
      actorDisplayName: users.displayName,
    })
    .from(personnelEmployeeAuditEvents)
    .leftJoin(users, eq(personnelEmployeeAuditEvents.actorUserId, users.id))
    .where(
      and(
        eq(personnelEmployeeAuditEvents.employeeId, employeeId),
        eq(personnelEmployeeAuditEvents.organizationId, context.organizationId),
        eq(
          personnelEmployeeAuditEvents.establishmentId,
          context.establishmentId,
        ),
        inArray(
          personnelEmployeeAuditEvents.eventType,
          personnelEmployeeAccessEventTypeSchema.options,
        ),
        cursor
          ? or(
              lt(
                personnelEmployeeAuditEvents.createdAt,
                new Date(cursor.createdAt),
              ),
              and(
                eq(
                  personnelEmployeeAuditEvents.createdAt,
                  new Date(cursor.createdAt),
                ),
                lt(personnelEmployeeAuditEvents.id, cursor.id),
              ),
            )
          : undefined,
      ),
    )
    .orderBy(
      desc(personnelEmployeeAuditEvents.createdAt),
      desc(personnelEmployeeAuditEvents.id),
    )
    .limit(21);

  const visibleRows = collapseAccessNavigationPairs(rows);
  const pageRows = visibleRows.slice(0, 10);
  const items = pageRows.flatMap(({ row }) => {
    const eventType = personnelEmployeeAccessEventTypeSchema.safeParse(
      row.eventType,
    );
    if (!eventType.success) return [];
    const item: PersonnelEmployeeAccessEvent = {
      id: row.id,
      eventType: eventType.data,
      actorDisplayName: row.actorDisplayName,
      occurredAt: row.createdAt.toISOString(),
    };
    return [item];
  });
  const lastPageRow = pageRows.at(-1);
  return {
    items,
    pageInfo: {
      hasMore: visibleRows.length > 10,
      nextCursor:
        visibleRows.length > 10 && lastPageRow
          ? encodeAccessCursor({
              createdAt: lastPageRow.consumedThrough.createdAt.toISOString(),
              id: lastPageRow.consumedThrough.id,
            })
          : null,
    },
  };
}

export type PersonnelEmployeeAccessEventType =
  PersonnelEmployeeAccessEvent['eventType'];

export async function recordPersonnelEmployeeAccess(
  db: CloudDatabaseClient,
  context: TenantContext,
  rawEmployeeId: string,
  eventType: PersonnelEmployeeAccessEventType,
  rawOperationId: string,
  now = new Date(),
): Promise<boolean> {
  requireEstablishment(context);
  if (context.actor.type !== 'user') {
    throw new PersonnelRepositoryError(
      'A user actor is required.',
      'ACTOR_REQUIRED',
    );
  }
  const actorUserId = context.actor.userId;
  const employeeId = identifierSchema.parse(rawEmployeeId);
  const operationId = identifierSchema.parse(rawOperationId);
  return db.transaction(async (transaction) => {
    await transaction.execute(
      sql`select pg_advisory_xact_lock(hashtextextended(${`${context.organizationId}:${context.establishmentId}:${actorUserId}:${eventType}:${operationId}`}, 0))`,
    );
    const employee = await findScopedEmployee(transaction, context, employeeId);
    if (!employee) return false;
    const [existing] = await transaction
      .select({ id: personnelEmployeeAuditEvents.id })
      .from(personnelEmployeeAuditEvents)
      .where(
        and(
          eq(
            personnelEmployeeAuditEvents.organizationId,
            context.organizationId,
          ),
          eq(
            personnelEmployeeAuditEvents.establishmentId,
            context.establishmentId,
          ),
          eq(personnelEmployeeAuditEvents.employeeId, employeeId),
          eq(personnelEmployeeAuditEvents.actorUserId, actorUserId),
          eq(personnelEmployeeAuditEvents.eventType, eventType),
          eq(personnelEmployeeAuditEvents.operationId, operationId),
        ),
      )
      .limit(1);
    if (!existing) {
      await transaction.insert(personnelEmployeeAuditEvents).values({
        id: uuidv7(),
        organizationId: context.organizationId,
        establishmentId: context.establishmentId,
        employeeId,
        actorUserId,
        eventType,
        operationId,
        createdAt: now,
      });
    }
    return true;
  });
}

export type CreatePersonnelEmployeeResult = {
  employee: PersonnelEmployeeSummary;
  idempotentReplay: boolean;
};

export async function createPersonnelEmployee(
  db: CloudDatabaseClient,
  context: TenantContext,
  rawInput: CreatePersonnelEmployeeInput,
  businessDate: string,
  now = new Date(),
): Promise<CreatePersonnelEmployeeResult> {
  requireEstablishment(context);
  if (context.actor.type !== 'user') {
    throw new PersonnelRepositoryError(
      'A user actor is required.',
      'ACTOR_REQUIRED',
    );
  }
  const actorUserId = context.actor.userId;
  const input = createPersonnelEmployeeInputSchema.parse(rawInput);
  const idempotencyHash = hash(input.idempotencyKey);
  const fingerprint = hash(
    JSON.stringify({
      givenNames: input.givenNames,
      familyName: input.familyName,
      position: input.position,
      qualification: input.qualification,
      employmentTermType: input.employmentTermType,
      expectedEndDate: input.expectedEndDate,
      fixedTermReasonCode: input.fixedTermReasonCode,
      workTimeCategory: input.workTimeCategory,
      contractWeeklyMinutes: input.contractWeeklyMinutes,
      entryDate: input.entryDate,
      confirmDuplicate: input.confirmDuplicate,
      duplicateOverrideReason: input.duplicateOverrideReason,
    }),
  );

  await cleanupExpiredPersonnelCommandReceipts(db, context, now);

  return db.transaction(async (transaction) => {
    await transaction.execute(
      sql`select pg_advisory_xact_lock(hashtextextended(${`${context.organizationId}:${context.establishmentId}:${actorUserId}:personnel.employee.create:${idempotencyHash}`}, 0))`,
    );

    const [receipt] = await transaction
      .select()
      .from(personnelCommandReceipts)
      .where(
        and(
          eq(personnelCommandReceipts.organizationId, context.organizationId),
          eq(personnelCommandReceipts.establishmentId, context.establishmentId),
          eq(personnelCommandReceipts.actorUserId, actorUserId),
          eq(personnelCommandReceipts.commandType, 'personnel.employee.create'),
          eq(personnelCommandReceipts.idempotencyHash, idempotencyHash),
        ),
      )
      .limit(1);
    if (receipt) {
      if (receipt.requestFingerprint !== fingerprint) {
        throw new PersonnelRepositoryError(
          'The idempotency key was reused for a different request.',
          'IDEMPOTENCY_CONFLICT',
        );
      }
      const [existingEmployee] = await transaction
        .select()
        .from(personnelEmployeeDossiers)
        .where(
          and(
            eq(personnelEmployeeDossiers.id, receipt.employeeId),
            eq(
              personnelEmployeeDossiers.organizationId,
              context.organizationId,
            ),
            eq(
              personnelEmployeeDossiers.establishmentId,
              context.establishmentId,
            ),
          ),
        )
        .limit(1);
      if (!existingEmployee) {
        throw new PersonnelRepositoryError(
          'The committed employee could not be found.',
          'IDEMPOTENCY_CONFLICT',
        );
      }
      return {
        employee: toSummary(existingEmployee, businessDate),
        idempotentReplay: true,
      };
    }

    const duplicateCandidates = await findDuplicateCandidates(
      transaction,
      context,
      input,
    );
    if (duplicateCandidates.length > 0 && !input.confirmDuplicate) {
      throw new PersonnelDuplicateError(duplicateCandidates);
    }

    const employeeId = uuidv7();
    const operationId = uuidv7();
    const [created] = await transaction
      .insert(personnelEmployeeDossiers)
      .values({
        id: employeeId,
        organizationId: context.organizationId,
        establishmentId: context.establishmentId,
        givenNames: input.givenNames,
        familyName: input.familyName,
        position: input.position,
        qualification: input.qualification,
        employmentTermType: input.employmentTermType,
        expectedEndDate: input.expectedEndDate,
        fixedTermReasonCode: input.fixedTermReasonCode,
        workTimeCategory: input.workTimeCategory,
        contractWeeklyMinutes: input.contractWeeklyMinutes,
        entryDate: input.entryDate,
      })
      .returning();

    await transaction.insert(personnelEmployeeAuditEvents).values({
      id: uuidv7(),
      organizationId: context.organizationId,
      establishmentId: context.establishmentId,
      employeeId,
      actorUserId,
      eventType: 'employee.created',
      operationId,
      changedFields: [
        'identity',
        'position',
        'qualification',
        'employmentTermType',
        'expectedEndDate',
        'fixedTermReasonCode',
        'workTimeCategory',
        'contractWeeklyMinutes',
        'entryDate',
      ],
    });
    if (duplicateCandidates.length > 0) {
      await transaction.insert(personnelEmployeeAuditEvents).values({
        id: uuidv7(),
        organizationId: context.organizationId,
        establishmentId: context.establishmentId,
        employeeId,
        actorUserId,
        eventType: 'employee.duplicate_override_confirmed',
        operationId,
        metadata: {
          reason: input.duplicateOverrideReason,
          candidateCount: duplicateCandidates.length,
        },
      });
    }
    await transaction.insert(personnelCommandReceipts).values({
      id: uuidv7(),
      organizationId: context.organizationId,
      establishmentId: context.establishmentId,
      actorUserId,
      commandType: 'personnel.employee.create',
      idempotencyHash,
      requestFingerprint: fingerprint,
      employeeId,
      expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000),
    });

    return {
      employee: toSummary(created, businessDate),
      idempotentReplay: false,
    };
  });
}

export type UpdatePersonnelEmployeeResult = {
  employee: PersonnelEmployeeSummary;
  idempotentReplay: boolean;
  updated: boolean;
};

const personnelEmployeeUpdateAuditContextSchema = z
  .object({
    requestId: identifierSchema,
    documentId: identifierSchema,
    documentVersion: z.number().int().positive(),
    selectedFields: z
      .array(z.enum(['position', 'contractWeeklyMinutes']))
      .min(1)
      .max(2),
  })
  .strict();

export type PersonnelEmployeeUpdateAuditContext = z.infer<
  typeof personnelEmployeeUpdateAuditContextSchema
>;

export async function updatePersonnelEmployee(
  db: CloudDatabaseClient,
  context: TenantContext,
  rawInput: UpdatePersonnelEmployeeInput,
  businessDate: string,
  now = new Date(),
  rawAuditContext?: PersonnelEmployeeUpdateAuditContext,
): Promise<UpdatePersonnelEmployeeResult> {
  requireEstablishment(context);
  if (context.actor.type !== 'user') {
    throw new PersonnelRepositoryError(
      'A user actor is required.',
      'ACTOR_REQUIRED',
    );
  }
  const actorUserId = context.actor.userId;
  const input = updatePersonnelEmployeeInputSchema.parse(rawInput);
  const auditContext = rawAuditContext
    ? personnelEmployeeUpdateAuditContextSchema.parse(rawAuditContext)
    : null;
  const idempotencyHash = hash(input.idempotencyKey);
  const fingerprint = hash(
    JSON.stringify(auditContext ? { input, auditContext } : input),
  );

  await cleanupExpiredPersonnelCommandReceipts(db, context, now);

  return db.transaction(async (transaction) => {
    await transaction.execute(
      sql`select pg_advisory_xact_lock(hashtextextended(${`${context.organizationId}:${context.establishmentId}:${actorUserId}:personnel.employee.update:${idempotencyHash}`}, 0))`,
    );

    const [receipt] = await transaction
      .select()
      .from(personnelCommandReceipts)
      .where(
        and(
          eq(personnelCommandReceipts.organizationId, context.organizationId),
          eq(personnelCommandReceipts.establishmentId, context.establishmentId),
          eq(personnelCommandReceipts.actorUserId, actorUserId),
          eq(personnelCommandReceipts.commandType, 'personnel.employee.update'),
          eq(personnelCommandReceipts.idempotencyHash, idempotencyHash),
        ),
      )
      .limit(1);
    if (receipt) {
      if (
        receipt.requestFingerprint !== fingerprint ||
        receipt.employeeId !== input.employeeId
      ) {
        throw new PersonnelRepositoryError(
          'The idempotency key was reused for a different request.',
          'IDEMPOTENCY_CONFLICT',
        );
      }
      const replayed = await findScopedEmployee(
        transaction,
        context,
        receipt.employeeId,
      );
      if (!replayed) {
        throw new PersonnelRepositoryError(
          'The committed employee could not be found.',
          'IDEMPOTENCY_CONFLICT',
        );
      }
      return {
        employee: toSummary(replayed, businessDate),
        idempotentReplay: true,
        updated: true,
      };
    }

    const current = await findScopedEmployee(
      transaction,
      context,
      input.employeeId,
    );
    if (!current) {
      throw new PersonnelRepositoryError('Employee not found.', 'NOT_FOUND');
    }
    if (current.revision !== input.expectedRevision) {
      throw new PersonnelConflictError(toSummary(current, businessDate));
    }
    if (current.departureDate && input.entryDate > current.departureDate) {
      throw new PersonnelRepositoryError(
        'The entry date must not be after the recorded departure date.',
        'INVALID_EMPLOYMENT_DATES',
      );
    }
    const preservesLegacyFixedTermReason =
      current.employmentTermType === 'fixed_term' &&
      current.fixedTermReasonCode === null &&
      input.employmentTermType === 'fixed_term' &&
      input.fixedTermReasonCode === null;
    if (
      input.employmentTermType === 'fixed_term' &&
      !input.fixedTermReasonCode &&
      !preservesLegacyFixedTermReason
    ) {
      throw new PersonnelRepositoryError(
        'A supported reason is required for a fixed term.',
        'FIXED_TERM_REASON_REQUIRED',
      );
    }
    if (
      current.fixedTermReasonCode !== null &&
      input.employmentTermType === 'indefinite' &&
      !input.confirmFixedTermReasonClear
    ) {
      throw new PersonnelRepositoryError(
        'Clearing the fixed-term reason requires explicit confirmation.',
        'FIXED_TERM_REASON_CLEAR_CONFIRMATION_REQUIRED',
      );
    }

    const identityFields = [
      ...(current.givenNames !== input.givenNames ? ['givenNames'] : []),
      ...(current.familyName !== input.familyName ? ['familyName'] : []),
    ];
    const employmentFields = [
      ...(current.position !== input.position ? ['position'] : []),
      ...(current.qualification !== input.qualification
        ? ['qualification']
        : []),
      ...(current.employmentTermType !== input.employmentTermType
        ? ['employmentTermType']
        : []),
      ...(current.expectedEndDate !== input.expectedEndDate
        ? ['expectedEndDate']
        : []),
      ...(current.fixedTermReasonCode !== input.fixedTermReasonCode
        ? ['fixedTermReasonCode']
        : []),
      ...(current.workTimeCategory !== input.workTimeCategory
        ? ['workTimeCategory']
        : []),
      ...(current.contractWeeklyMinutes !== input.contractWeeklyMinutes
        ? ['contractWeeklyMinutes']
        : []),
      ...(current.entryDate !== input.entryDate ? ['entryDate'] : []),
    ];
    if (identityFields.length === 0 && employmentFields.length === 0) {
      return {
        employee: toSummary(current, businessDate),
        idempotentReplay: false,
        updated: false,
      };
    }

    const [updated] = await transaction
      .update(personnelEmployeeDossiers)
      .set({
        givenNames: input.givenNames,
        familyName: input.familyName,
        position: input.position,
        qualification: input.qualification,
        employmentTermType: input.employmentTermType,
        expectedEndDate: input.expectedEndDate,
        fixedTermReasonCode: input.fixedTermReasonCode,
        workTimeCategory: input.workTimeCategory,
        contractWeeklyMinutes: input.contractWeeklyMinutes,
        entryDate: input.entryDate,
        revision: sql`${personnelEmployeeDossiers.revision} + 1`,
        updatedAt: now,
      })
      .where(
        and(
          eq(personnelEmployeeDossiers.id, input.employeeId),
          eq(personnelEmployeeDossiers.organizationId, context.organizationId),
          eq(
            personnelEmployeeDossiers.establishmentId,
            context.establishmentId,
          ),
          eq(personnelEmployeeDossiers.revision, input.expectedRevision),
        ),
      )
      .returning();
    if (!updated) {
      const concurrent = await findScopedEmployee(
        transaction,
        context,
        input.employeeId,
      );
      if (!concurrent) {
        throw new PersonnelRepositoryError('Employee not found.', 'NOT_FOUND');
      }
      throw new PersonnelConflictError(toSummary(concurrent, businessDate));
    }

    const operationId = uuidv7();
    const auditEvents = [
      ...(identityFields.length > 0
        ? [
            {
              eventType: 'employee.identity_updated',
              changedFields: identityFields,
            },
          ]
        : []),
      ...(employmentFields.length > 0
        ? [
            {
              eventType: 'employee.employment_updated',
              changedFields: employmentFields,
            },
          ]
        : []),
      ...(auditContext
        ? [
            {
              eventType: 'employee.contract_extraction_applied',
              changedFields: auditContext.selectedFields,
            },
          ]
        : []),
    ];
    await transaction.insert(personnelEmployeeAuditEvents).values(
      auditEvents.map((event) => ({
        id: uuidv7(),
        organizationId: context.organizationId,
        establishmentId: context.establishmentId,
        employeeId: input.employeeId,
        actorUserId,
        eventType: event.eventType,
        operationId:
          event.eventType === 'employee.contract_extraction_applied' &&
          auditContext
            ? auditContext.requestId
            : operationId,
        changedFields: event.changedFields,
        metadata: {
          previousRevision: current.revision,
          newRevision: updated.revision,
          ...(event.eventType === 'employee.contract_extraction_applied' &&
          auditContext
            ? {
                documentId: auditContext.documentId,
                documentVersion: auditContext.documentVersion,
                outcome: 'applied',
              }
            : {}),
        },
      })),
    );
    await transaction.insert(personnelCommandReceipts).values({
      id: uuidv7(),
      organizationId: context.organizationId,
      establishmentId: context.establishmentId,
      actorUserId,
      commandType: 'personnel.employee.update',
      idempotencyHash,
      requestFingerprint: fingerprint,
      employeeId: input.employeeId,
      expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000),
    });

    return {
      employee: toSummary(updated, businessDate),
      idempotentReplay: false,
      updated: true,
    };
  });
}

export type SetPersonnelEmployeeDepartureResult = {
  employee: PersonnelEmployeeSummary;
  idempotentReplay: boolean;
  updated: boolean;
};

export async function setPersonnelEmployeeDeparture(
  db: CloudDatabaseClient,
  context: TenantContext,
  rawInput: SetPersonnelEmployeeDepartureInput,
  businessDate: string,
  now = new Date(),
): Promise<SetPersonnelEmployeeDepartureResult> {
  requireEstablishment(context);
  if (context.actor.type !== 'user') {
    throw new PersonnelRepositoryError(
      'A user actor is required.',
      'ACTOR_REQUIRED',
    );
  }
  const actorUserId = context.actor.userId;
  const input = setPersonnelEmployeeDepartureInputSchema.parse(rawInput);
  const idempotencyHash = hash(input.idempotencyKey);
  const fingerprint = hash(JSON.stringify(input));

  await cleanupExpiredPersonnelCommandReceipts(db, context, now);

  return db.transaction(async (transaction) => {
    await transaction.execute(
      sql`select pg_advisory_xact_lock(hashtextextended(${`${context.organizationId}:${context.establishmentId}:${actorUserId}:personnel.employee.departure:${idempotencyHash}`}, 0))`,
    );

    const [receipt] = await transaction
      .select()
      .from(personnelCommandReceipts)
      .where(
        and(
          eq(personnelCommandReceipts.organizationId, context.organizationId),
          eq(personnelCommandReceipts.establishmentId, context.establishmentId),
          eq(personnelCommandReceipts.actorUserId, actorUserId),
          eq(
            personnelCommandReceipts.commandType,
            'personnel.employee.departure',
          ),
          eq(personnelCommandReceipts.idempotencyHash, idempotencyHash),
        ),
      )
      .limit(1);
    if (receipt) {
      if (
        receipt.requestFingerprint !== fingerprint ||
        receipt.employeeId !== input.employeeId
      ) {
        throw new PersonnelRepositoryError(
          'The idempotency key was reused for a different request.',
          'IDEMPOTENCY_CONFLICT',
        );
      }
      const replayed = await findScopedEmployee(
        transaction,
        context,
        receipt.employeeId,
      );
      if (!replayed) {
        throw new PersonnelRepositoryError(
          'The committed employee could not be found.',
          'IDEMPOTENCY_CONFLICT',
        );
      }
      return {
        employee: toSummary(replayed, businessDate),
        idempotentReplay: true,
        updated: true,
      };
    }

    const current = await findScopedEmployee(
      transaction,
      context,
      input.employeeId,
    );
    if (!current) {
      throw new PersonnelRepositoryError('Employee not found.', 'NOT_FOUND');
    }
    if (current.revision !== input.expectedRevision) {
      throw new PersonnelConflictError(toSummary(current, businessDate));
    }
    if (
      current.departureDate !== null &&
      current.departureDate === input.departureDate
    ) {
      return {
        employee: toSummary(current, businessDate),
        idempotentReplay: false,
        updated: false,
      };
    }
    if (input.departureDate && input.departureDate < current.entryDate) {
      throw new PersonnelRepositoryError(
        'The departure date must not be before the entry date.',
        'INVALID_EMPLOYMENT_DATES',
      );
    }
    const isCorrection = current.departureDate !== null;
    if (isCorrection && !input.correctionReason) {
      throw new PersonnelRepositoryError(
        'A reason is required to correct or clear a departure.',
        'REASON_REQUIRED',
      );
    }
    if (!isCorrection && input.departureDate === null) {
      throw new PersonnelRepositoryError(
        'A departure date is required.',
        'DEPARTURE_DATE_REQUIRED',
      );
    }

    const [updated] = await transaction
      .update(personnelEmployeeDossiers)
      .set({
        departureDate: input.departureDate,
        revision: sql`${personnelEmployeeDossiers.revision} + 1`,
        updatedAt: now,
      })
      .where(
        and(
          eq(personnelEmployeeDossiers.id, input.employeeId),
          eq(personnelEmployeeDossiers.organizationId, context.organizationId),
          eq(
            personnelEmployeeDossiers.establishmentId,
            context.establishmentId,
          ),
          eq(personnelEmployeeDossiers.revision, input.expectedRevision),
        ),
      )
      .returning();
    if (!updated) {
      const concurrent = await findScopedEmployee(
        transaction,
        context,
        input.employeeId,
      );
      if (!concurrent) {
        throw new PersonnelRepositoryError('Employee not found.', 'NOT_FOUND');
      }
      throw new PersonnelConflictError(toSummary(concurrent, businessDate));
    }

    await transaction.insert(personnelEmployeeAuditEvents).values({
      id: uuidv7(),
      organizationId: context.organizationId,
      establishmentId: context.establishmentId,
      employeeId: input.employeeId,
      actorUserId,
      eventType: isCorrection
        ? 'employee.departure_corrected'
        : 'employee.departure_recorded',
      operationId: uuidv7(),
      changedFields: ['departureDate'],
      metadata: {
        previousRevision: current.revision,
        newRevision: updated.revision,
        previousDepartureDate: current.departureDate,
        newDepartureDate: updated.departureDate,
        ...(isCorrection ? { reason: input.correctionReason } : {}),
      },
    });
    await transaction.insert(personnelCommandReceipts).values({
      id: uuidv7(),
      organizationId: context.organizationId,
      establishmentId: context.establishmentId,
      actorUserId,
      commandType: 'personnel.employee.departure',
      idempotencyHash,
      requestFingerprint: fingerprint,
      employeeId: input.employeeId,
      expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000),
    });

    return {
      employee: toSummary(updated, businessDate),
      idempotentReplay: false,
      updated: true,
    };
  });
}

type PersonnelTransaction = Parameters<
  Parameters<CloudDatabaseClient['transaction']>[0]
>[0];

async function findScopedEmployee(
  transaction: PersonnelTransaction,
  context: TenantContext & { establishmentId: string },
  employeeId: string,
) {
  const [employee] = await transaction
    .select()
    .from(personnelEmployeeDossiers)
    .where(
      and(
        eq(personnelEmployeeDossiers.id, employeeId),
        eq(personnelEmployeeDossiers.organizationId, context.organizationId),
        eq(personnelEmployeeDossiers.establishmentId, context.establishmentId),
      ),
    )
    .limit(1);
  return employee ?? null;
}

async function findDuplicateCandidates(
  transaction: PersonnelTransaction,
  context: TenantContext & { establishmentId: string },
  input: CreatePersonnelEmployeeInput,
): Promise<PersonnelDuplicateCandidate[]> {
  const rows = await transaction
    .select({
      id: personnelEmployeeDossiers.id,
      givenNames: personnelEmployeeDossiers.givenNames,
      familyName: personnelEmployeeDossiers.familyName,
      position: personnelEmployeeDossiers.position,
      entryDate: personnelEmployeeDossiers.entryDate,
      departureDate: personnelEmployeeDossiers.departureDate,
    })
    .from(personnelEmployeeDossiers)
    .where(
      and(
        eq(personnelEmployeeDossiers.organizationId, context.organizationId),
        eq(personnelEmployeeDossiers.establishmentId, context.establishmentId),
        sql`lower(trim(${personnelEmployeeDossiers.givenNames})) = lower(trim(${input.givenNames}))`,
        sql`lower(trim(${personnelEmployeeDossiers.familyName})) = lower(trim(${input.familyName}))`,
        or(
          isNull(personnelEmployeeDossiers.departureDate),
          sql`${personnelEmployeeDossiers.departureDate} >= ${input.entryDate}`,
        ),
      ),
    )
    .orderBy(desc(personnelEmployeeDossiers.entryDate))
    .limit(5);
  return rows.map((row) => ({
    id: row.id,
    displayName: `${row.givenNames} ${row.familyName}`,
    position: row.position,
    entryDate: row.entryDate,
    departureDate: row.departureDate,
  }));
}

function getViewCondition(
  view: PersonnelEmployeeView,
  businessDate: string,
): SQL {
  if (view === 'upcoming') {
    return sql`${personnelEmployeeDossiers.entryDate} > ${businessDate}`;
  }
  if (view === 'former') {
    return and(
      isNotNull(personnelEmployeeDossiers.departureDate),
      lt(personnelEmployeeDossiers.departureDate, businessDate),
    )!;
  }
  return and(
    lte(personnelEmployeeDossiers.entryDate, businessDate),
    or(
      isNull(personnelEmployeeDossiers.departureDate),
      sql`${personnelEmployeeDossiers.departureDate} >= ${businessDate}`,
    ),
  )!;
}

function toSummary(
  row: typeof personnelEmployeeDossiers.$inferSelect,
  businessDate: string,
): PersonnelEmployeeSummary {
  return {
    id: row.id,
    givenNames: row.givenNames.trim(),
    familyName: row.familyName.trim(),
    position: row.position.trim(),
    qualification: row.qualification.trim(),
    employmentTermType: row.employmentTermType,
    expectedEndDate: row.expectedEndDate,
    fixedTermReasonCode: row.fixedTermReasonCode,
    workTimeCategory: row.workTimeCategory,
    contractWeeklyMinutes: row.contractWeeklyMinutes,
    entryDate: row.entryDate,
    departureDate: row.departureDate,
    view: getEmployeeView(row, businessDate),
    completenessReasons: getCompletenessReasons(row),
    revision: row.revision,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

function getIncompleteCondition(): SQL {
  return or(
    sql`length(trim(${personnelEmployeeDossiers.givenNames})) = 0`,
    sql`length(trim(${personnelEmployeeDossiers.familyName})) = 0`,
    sql`length(trim(${personnelEmployeeDossiers.position})) = 0`,
    sql`length(trim(${personnelEmployeeDossiers.qualification})) = 0`,
  )!;
}

function getCompletenessReasons(
  row: typeof personnelEmployeeDossiers.$inferSelect,
): PersonnelEmployeeSummary['completenessReasons'] {
  const reasons: PersonnelEmployeeSummary['completenessReasons'] = [];
  if (!row.givenNames.trim()) reasons.push('given_names_missing');
  if (!row.familyName.trim()) reasons.push('family_name_missing');
  if (!row.position.trim()) reasons.push('position_missing');
  if (!row.qualification.trim()) reasons.push('qualification_missing');
  return reasons;
}

function getEmployeeView(
  row: Pick<
    typeof personnelEmployeeDossiers.$inferSelect,
    'entryDate' | 'departureDate'
  >,
  businessDate: string,
): PersonnelEmployeeView {
  if (row.departureDate && row.departureDate < businessDate) return 'former';
  if (row.entryDate > businessDate) return 'upcoming';
  return 'active';
}

function escapeLike(value: string): string {
  return value
    .replaceAll('\\', '\\\\')
    .replaceAll('%', '\\%')
    .replaceAll('_', '\\_');
}

function encodeCursor(value: z.infer<typeof cursorPayloadSchema>): string {
  return Buffer.from(JSON.stringify(value), 'utf8').toString('base64url');
}

function decodeCursor(value: string): z.infer<typeof cursorPayloadSchema> {
  try {
    return cursorPayloadSchema.parse(
      JSON.parse(Buffer.from(value, 'base64url').toString('utf8')),
    );
  } catch {
    throw new PersonnelRepositoryError(
      'Invalid pagination cursor.',
      'INVALID_CURSOR',
    );
  }
}

function encodeAccessCursor(
  value: z.infer<typeof accessCursorPayloadSchema>,
): string {
  return Buffer.from(JSON.stringify(value), 'utf8').toString('base64url');
}

function decodeAccessCursor(
  value: string,
): z.infer<typeof accessCursorPayloadSchema> {
  try {
    return accessCursorPayloadSchema.parse(
      JSON.parse(Buffer.from(value, 'base64url').toString('utf8')),
    );
  } catch {
    throw new PersonnelRepositoryError(
      'Invalid access-history pagination cursor.',
      'INVALID_CURSOR',
    );
  }
}

export class PersonnelRepositoryError extends Error {
  constructor(
    message: string,
    public readonly code:
      | 'INVALID_CURSOR'
      | 'ACTOR_REQUIRED'
      | 'IDEMPOTENCY_CONFLICT'
      | 'NOT_FOUND'
      | 'INVALID_EMPLOYMENT_DATES'
      | 'FIXED_TERM_REASON_REQUIRED'
      | 'FIXED_TERM_REASON_CLEAR_CONFIRMATION_REQUIRED'
      | 'REASON_REQUIRED'
      | 'DEPARTURE_DATE_REQUIRED',
  ) {
    super(message);
    this.name = 'PersonnelRepositoryError';
  }
}

export class PersonnelConflictError extends Error {
  readonly code = 'REVISION_CONFLICT';

  constructor(public readonly currentEmployee: PersonnelEmployeeSummary) {
    super('The employee was updated by another request.');
    this.name = 'PersonnelConflictError';
  }
}

export class PersonnelDuplicateError extends Error {
  readonly code = 'DUPLICATE_CANDIDATES';

  constructor(public readonly candidates: PersonnelDuplicateCandidate[]) {
    super('Possible duplicate employees were found.');
    this.name = 'PersonnelDuplicateError';
  }
}

function hash(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

async function cleanupExpiredPersonnelCommandReceipts(
  db: CloudDatabaseClient,
  context: PersonnelTenantContext,
  now: Date,
): Promise<void> {
  await db
    .delete(personnelCommandReceipts)
    .where(
      and(
        eq(personnelCommandReceipts.organizationId, context.organizationId),
        eq(personnelCommandReceipts.establishmentId, context.establishmentId),
        lte(personnelCommandReceipts.expiresAt, now),
      ),
    );
}

function safeAuditMetadata(value: Record<string, unknown>) {
  return {
    reason:
      typeof value.reason === 'string' &&
      value.reason.length >= 3 &&
      value.reason.length <= 250
        ? value.reason
        : null,
    previousDepartureDate: safeDateOnly(value.previousDepartureDate),
    newDepartureDate: safeDateOnly(value.newDepartureDate),
  };
}

function safeDateOnly(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  return /^\d{4}-\d{2}-\d{2}$/u.test(value) ? value : null;
}

function collapseAccessNavigationPairs<
  T extends {
    id: string;
    actorUserId: string | null;
    createdAt: Date;
    eventType: string;
  },
>(rows: readonly T[]): Array<{ row: T; consumedThrough: T }> {
  const visibleRows: Array<{ row: T; consumedThrough: T }> = [];
  for (let index = 0; index < rows.length; index += 1) {
    const current = rows[index];
    if (!current) continue;

    const next = rows[index + 1];
    const opensSpecificHistory =
      current.eventType === 'employee.history_viewed' ||
      current.eventType === 'employee.access_history_viewed';
    if (
      opensSpecificHistory &&
      next?.eventType === 'employee.dossier_viewed' &&
      current.actorUserId === next.actorUserId &&
      current.createdAt.getTime() >= next.createdAt.getTime() &&
      current.createdAt.getTime() - next.createdAt.getTime() <= 120_000
    ) {
      visibleRows.push({ row: current, consumedThrough: next });
      index += 1;
      continue;
    }
    visibleRows.push({ row: current, consumedThrough: current });
  }
  return visibleRows;
}
