import {
  createPersonnelEmployeeInputSchema,
  personnelEmployeeListQuerySchema,
  type CreatePersonnelEmployeeInput,
  type PersonnelDuplicateCandidate,
  type PersonnelEmployeeListQuery,
  type PersonnelEmployeeListResponse,
  type PersonnelEmployeeSummary,
  type PersonnelEmployeeView,
} from '@yuta/contracts/personnel';
import { requireEstablishment, type TenantContext } from '@yuta/tenant';
import {
  and,
  desc,
  eq,
  ilike,
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
} from './schema';

type PersonnelTenantContext = TenantContext & { establishmentId: string };

const cursorPayloadSchema = z
  .object({ entryDate: z.string().date(), id: z.string().uuid() })
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
  const completenessCondition =
    query.completeness === 'incomplete' ? sql`false` : undefined;
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
      })
      .from(personnelEmployeeDossiers)
      .where(scope),
  ]);

  const hasMore = rows.length > query.limit;
  const pageRows = hasMore ? rows.slice(0, query.limit) : rows;
  const lastRow = pageRows.at(-1);
  const counts = countsRows[0] ?? { active: 0, upcoming: 0, former: 0 };

  return {
    items: pageRows.map((row) => toSummary(row, businessDate)),
    counts: { ...counts, incomplete: 0 },
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
      workTimeCategory: input.workTimeCategory,
      entryDate: input.entryDate,
      confirmDuplicate: input.confirmDuplicate,
      duplicateOverrideReason: input.duplicateOverrideReason,
    }),
  );

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
        workTimeCategory: input.workTimeCategory,
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
        'workTimeCategory',
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

type PersonnelTransaction = Parameters<
  Parameters<CloudDatabaseClient['transaction']>[0]
>[0];

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
    givenNames: row.givenNames,
    familyName: row.familyName,
    position: row.position,
    qualification: row.qualification,
    employmentTermType: row.employmentTermType,
    expectedEndDate: row.expectedEndDate,
    workTimeCategory: row.workTimeCategory,
    entryDate: row.entryDate,
    departureDate: row.departureDate,
    view: getEmployeeView(row, businessDate),
    completenessReasons: [],
    revision: row.revision,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
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

export class PersonnelRepositoryError extends Error {
  constructor(
    message: string,
    public readonly code:
      | 'INVALID_CURSOR'
      | 'ACTOR_REQUIRED'
      | 'IDEMPOTENCY_CONFLICT',
  ) {
    super(message);
    this.name = 'PersonnelRepositoryError';
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
