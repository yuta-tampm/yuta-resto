import {
  personnelActionOverviewItemKindSchema,
  personnelActionOverviewQuerySchema,
  personnelActionOverviewResponseSchema,
  type PersonnelActionOverviewCorrectionItem,
  type PersonnelActionOverviewDepartureItem,
  type PersonnelActionOverviewItemKind,
  type PersonnelActionOverviewQuery,
  type PersonnelActionOverviewResponse,
  type PersonnelEmployeeSummary,
} from '@yuta/contracts/personnel';
import { requireEstablishment, type TenantContext } from '@yuta/tenant';
import { and, asc, eq, gte, isNull, lte, or, sql, type SQL } from 'drizzle-orm';
import { v7 as uuidv7 } from 'uuid';
import { z } from 'zod';
import type { CloudDatabaseClient } from './client';
import { findPersonnelEmployee } from './personnel-repository';
import {
  authAuditEvents,
  personnelDocuments,
  personnelEmployeeDossiers,
} from './schema';

type PersonnelTenantContext = TenantContext & { establishmentId: string };

type CorrectionRow = {
  employeeId: string;
  givenNames: string;
  familyName: string;
  kind: 'incomplete_employee_dossier' | 'missing_signed_base_contract';
  kindOrder: 0 | 1;
};

type DepartureRow = {
  employeeId: string;
  givenNames: string;
  familyName: string;
  departureDate: string;
};

const PAGE_SIZE = 5;
const correctionCursorSchema = z
  .object({
    familyName: z.string().max(120),
    givenNames: z.string().max(120),
    employeeId: z.string().uuid(),
    kindOrder: z.union([z.literal(0), z.literal(1)]),
  })
  .strict();
const departureCursorSchema = z
  .object({
    departureDate: z.string().date(),
    familyName: z.string().max(120),
    givenNames: z.string().max(120),
    employeeId: z.string().uuid(),
  })
  .strict();

export type PersonnelActionTargetResolution =
  | { status: 'ready'; employee: PersonnelEmployeeSummary }
  | { status: 'changed'; employee: PersonnelEmployeeSummary | null };

export class PersonnelActionOverviewRepositoryError extends Error {
  constructor(
    message: string,
    readonly code: 'ACTOR_REQUIRED' | 'INVALID_CURSOR',
  ) {
    super(message);
    this.name = 'PersonnelActionOverviewRepositoryError';
  }
}

export async function listPersonnelActionOverview(
  db: CloudDatabaseClient,
  context: TenantContext,
  rawQuery: PersonnelActionOverviewQuery,
  businessDate: string,
): Promise<PersonnelActionOverviewResponse> {
  requireEstablishment(context);
  const scope: PersonnelTenantContext = context;
  const actorUserId = requireUserActor(scope);
  const query = personnelActionOverviewQuerySchema.parse(rawQuery);
  const parsedBusinessDate = z.string().date().parse(businessDate);
  const correctionCursor = query.correctionCursor
    ? decodeCorrectionCursor(query.correctionCursor)
    : null;
  const departureCursor = query.departureCursor
    ? decodeDepartureCursor(query.departureCursor)
    : null;

  const [incompleteResult, missingContractResult, departureResult] =
    await Promise.allSettled([
      listIncompleteRows(db, scope, parsedBusinessDate, correctionCursor),
      listMissingContractRows(db, scope, parsedBusinessDate, correctionCursor),
      listDepartureRows(db, scope, parsedBusinessDate, departureCursor),
    ]);

  if (incompleteResult.status === 'rejected') {
    throw incompleteResult.reason;
  }
  if (departureResult.status === 'rejected') {
    throw departureResult.reason;
  }

  const documentSourceStatus =
    missingContractResult.status === 'fulfilled' ? 'ready' : 'unavailable';
  const incompleteRows =
    documentSourceStatus === 'unavailable' && correctionCursor
      ? await listIncompleteRows(db, scope, parsedBusinessDate, null)
      : incompleteResult.value;
  const correctionRows = mergeCorrectionRows(
    incompleteRows,
    missingContractResult.status === 'fulfilled'
      ? missingContractResult.value
      : [],
  );
  const correctionPage = correctionRows.slice(0, PAGE_SIZE);
  const departurePage = departureResult.value.slice(0, PAGE_SIZE);

  await db.insert(authAuditEvents).values({
    id: uuidv7(),
    event: 'personnel.action_overview_viewed',
    actorUserId,
    subjectUserId: null,
    organizationId: scope.organizationId,
    establishmentId: scope.establishmentId,
    metadata: {},
  });

  return personnelActionOverviewResponseSchema.parse({
    corrections: {
      items: correctionPage.map(toCorrectionItem),
      pageInfo: {
        hasMore:
          documentSourceStatus === 'ready' && correctionRows.length > PAGE_SIZE,
        nextCursor:
          documentSourceStatus === 'ready' && correctionRows.length > PAGE_SIZE
            ? encodeCorrectionCursor(correctionPage[PAGE_SIZE - 1]!)
            : null,
      },
      documentSourceStatus,
    },
    departures: {
      items: departurePage.map(toDepartureItem),
      pageInfo: {
        hasMore: departureResult.value.length > PAGE_SIZE,
        nextCursor:
          departureResult.value.length > PAGE_SIZE
            ? encodeDepartureCursor(departurePage[PAGE_SIZE - 1]!)
            : null,
      },
    },
  });
}

export async function resolvePersonnelActionTarget(
  db: CloudDatabaseClient,
  context: TenantContext,
  employeeId: string,
  rawKind: PersonnelActionOverviewItemKind,
  businessDate: string,
): Promise<PersonnelActionTargetResolution> {
  requireEstablishment(context);
  const kind = personnelActionOverviewItemKindSchema.parse(rawKind);
  const parsedEmployeeId = z.string().uuid().parse(employeeId);
  const parsedBusinessDate = z.string().date().parse(businessDate);
  const employee = await findPersonnelEmployee(
    db,
    context,
    parsedEmployeeId,
    parsedBusinessDate,
  );
  if (!employee) return { status: 'changed', employee: null };

  if (kind === 'incomplete_employee_dossier') {
    return employee.view !== 'former' && employee.completenessReasons.length > 0
      ? { status: 'ready', employee }
      : { status: 'changed', employee };
  }

  if (kind === 'missing_signed_base_contract') {
    if (employee.view === 'former') return { status: 'changed', employee };
    const [document] = await db
      .select({ id: personnelDocuments.id })
      .from(personnelDocuments)
      .where(
        and(
          eq(personnelDocuments.organizationId, context.organizationId),
          eq(personnelDocuments.establishmentId, context.establishmentId!),
          eq(personnelDocuments.employeeId, parsedEmployeeId),
          eq(personnelDocuments.category, 'signed_employment_contract'),
        ),
      )
      .limit(1);
    return document
      ? { status: 'changed', employee }
      : { status: 'ready', employee };
  }

  const latestDate = addCalendarDays(parsedBusinessDate, 5);
  return employee.view === 'active' &&
    employee.departureDate !== null &&
    employee.departureDate >= parsedBusinessDate &&
    employee.departureDate <= latestDate
    ? { status: 'ready', employee }
    : { status: 'changed', employee };
}

async function listIncompleteRows(
  db: CloudDatabaseClient,
  scope: PersonnelTenantContext,
  businessDate: string,
  cursor: z.infer<typeof correctionCursorSchema> | null,
): Promise<CorrectionRow[]> {
  const rows = await db
    .select({
      employeeId: personnelEmployeeDossiers.id,
      givenNames: personnelEmployeeDossiers.givenNames,
      familyName: personnelEmployeeDossiers.familyName,
    })
    .from(personnelEmployeeDossiers)
    .where(
      and(
        employeeScope(scope),
        currentOrUpcomingCondition(businessDate),
        incompleteCondition(),
        cursor ? correctionAfterCursor(cursor, 0) : undefined,
      ),
    )
    .orderBy(
      asc(personnelEmployeeDossiers.familyName),
      asc(personnelEmployeeDossiers.givenNames),
      asc(personnelEmployeeDossiers.id),
    )
    .limit(PAGE_SIZE + 1);
  return rows.map((row) => ({
    ...row,
    kind: 'incomplete_employee_dossier',
    kindOrder: 0,
  }));
}

async function listMissingContractRows(
  db: CloudDatabaseClient,
  scope: PersonnelTenantContext,
  businessDate: string,
  cursor: z.infer<typeof correctionCursorSchema> | null,
): Promise<CorrectionRow[]> {
  const rows = await db
    .select({
      employeeId: personnelEmployeeDossiers.id,
      givenNames: personnelEmployeeDossiers.givenNames,
      familyName: personnelEmployeeDossiers.familyName,
    })
    .from(personnelEmployeeDossiers)
    .leftJoin(
      personnelDocuments,
      and(
        eq(
          personnelDocuments.organizationId,
          personnelEmployeeDossiers.organizationId,
        ),
        eq(
          personnelDocuments.establishmentId,
          personnelEmployeeDossiers.establishmentId,
        ),
        eq(personnelDocuments.employeeId, personnelEmployeeDossiers.id),
        eq(personnelDocuments.category, 'signed_employment_contract'),
      ),
    )
    .where(
      and(
        employeeScope(scope),
        currentOrUpcomingCondition(businessDate),
        isNull(personnelDocuments.id),
        cursor ? correctionAfterCursor(cursor, 1) : undefined,
      ),
    )
    .orderBy(
      asc(personnelEmployeeDossiers.familyName),
      asc(personnelEmployeeDossiers.givenNames),
      asc(personnelEmployeeDossiers.id),
    )
    .limit(PAGE_SIZE + 1);
  return rows.map((row) => ({
    ...row,
    kind: 'missing_signed_base_contract',
    kindOrder: 1,
  }));
}

async function listDepartureRows(
  db: CloudDatabaseClient,
  scope: PersonnelTenantContext,
  businessDate: string,
  cursor: z.infer<typeof departureCursorSchema> | null,
): Promise<DepartureRow[]> {
  const latestDate = addCalendarDays(businessDate, 5);
  return db
    .select({
      employeeId: personnelEmployeeDossiers.id,
      givenNames: personnelEmployeeDossiers.givenNames,
      familyName: personnelEmployeeDossiers.familyName,
      departureDate: personnelEmployeeDossiers.departureDate,
    })
    .from(personnelEmployeeDossiers)
    .where(
      and(
        employeeScope(scope),
        lte(personnelEmployeeDossiers.entryDate, businessDate),
        gte(personnelEmployeeDossiers.departureDate, businessDate),
        lte(personnelEmployeeDossiers.departureDate, latestDate),
        cursor ? departureAfterCursor(cursor) : undefined,
      ),
    )
    .orderBy(
      asc(personnelEmployeeDossiers.departureDate),
      asc(personnelEmployeeDossiers.familyName),
      asc(personnelEmployeeDossiers.givenNames),
      asc(personnelEmployeeDossiers.id),
    )
    .limit(PAGE_SIZE + 1)
    .then((rows) =>
      rows.flatMap((row) =>
        row.departureDate ? [{ ...row, departureDate: row.departureDate }] : [],
      ),
    );
}

function employeeScope(scope: PersonnelTenantContext): SQL {
  return and(
    eq(personnelEmployeeDossiers.organizationId, scope.organizationId),
    eq(personnelEmployeeDossiers.establishmentId, scope.establishmentId),
  )!;
}

function currentOrUpcomingCondition(businessDate: string): SQL {
  return or(
    isNull(personnelEmployeeDossiers.departureDate),
    gte(personnelEmployeeDossiers.departureDate, businessDate),
  )!;
}

function incompleteCondition(): SQL {
  return or(
    sql`length(trim(${personnelEmployeeDossiers.givenNames})) = 0`,
    sql`length(trim(${personnelEmployeeDossiers.familyName})) = 0`,
    sql`length(trim(${personnelEmployeeDossiers.position})) = 0`,
    sql`length(trim(${personnelEmployeeDossiers.qualification})) = 0`,
  )!;
}

function correctionAfterCursor(
  cursor: z.infer<typeof correctionCursorSchema>,
  kindOrder: 0 | 1,
): SQL {
  return sql`(${personnelEmployeeDossiers.familyName}, ${personnelEmployeeDossiers.givenNames}, ${personnelEmployeeDossiers.id}, ${kindOrder}) > (${cursor.familyName}, ${cursor.givenNames}, ${cursor.employeeId}::uuid, ${cursor.kindOrder})`;
}

function departureAfterCursor(
  cursor: z.infer<typeof departureCursorSchema>,
): SQL {
  return sql`(${personnelEmployeeDossiers.departureDate}, ${personnelEmployeeDossiers.familyName}, ${personnelEmployeeDossiers.givenNames}, ${personnelEmployeeDossiers.id}) > (${cursor.departureDate}::date, ${cursor.familyName}, ${cursor.givenNames}, ${cursor.employeeId}::uuid)`;
}

export function mergeCorrectionRows(
  incompleteRows: CorrectionRow[],
  missingContractRows: CorrectionRow[],
): CorrectionRow[] {
  return [...incompleteRows, ...missingContractRows].sort((left, right) =>
    compareCorrectionRows(left, right),
  );
}

function compareCorrectionRows(left: CorrectionRow, right: CorrectionRow) {
  return (
    left.familyName.localeCompare(right.familyName) ||
    left.givenNames.localeCompare(right.givenNames) ||
    left.employeeId.localeCompare(right.employeeId) ||
    left.kindOrder - right.kindOrder
  );
}

function toCorrectionItem(
  row: CorrectionRow,
): PersonnelActionOverviewCorrectionItem {
  return {
    kind: row.kind,
    employeeId: row.employeeId,
    employeeDisplayName: getEmployeeDisplayName(row),
  };
}

function toDepartureItem(
  row: DepartureRow,
): PersonnelActionOverviewDepartureItem {
  return {
    kind: 'departure_within_five_days',
    employeeId: row.employeeId,
    employeeDisplayName: getEmployeeDisplayName(row),
    departureDate: row.departureDate,
  };
}

function getEmployeeDisplayName(row: {
  givenNames: string;
  familyName: string;
}): string {
  return (
    `${row.givenNames.trim()} ${row.familyName.trim()}`.trim() ||
    'Dossier salarié sans nom'
  );
}

function encodeCorrectionCursor(row: CorrectionRow): string {
  return Buffer.from(
    JSON.stringify({
      familyName: row.familyName,
      givenNames: row.givenNames,
      employeeId: row.employeeId,
      kindOrder: row.kindOrder,
    }),
    'utf8',
  ).toString('base64url');
}

function encodeDepartureCursor(row: DepartureRow): string {
  return Buffer.from(
    JSON.stringify({
      departureDate: row.departureDate,
      familyName: row.familyName,
      givenNames: row.givenNames,
      employeeId: row.employeeId,
    }),
    'utf8',
  ).toString('base64url');
}

function decodeCorrectionCursor(
  value: string,
): z.infer<typeof correctionCursorSchema> {
  try {
    return correctionCursorSchema.parse(
      JSON.parse(Buffer.from(value, 'base64url').toString('utf8')),
    );
  } catch {
    throw new PersonnelActionOverviewRepositoryError(
      'Invalid correction cursor.',
      'INVALID_CURSOR',
    );
  }
}

function decodeDepartureCursor(
  value: string,
): z.infer<typeof departureCursorSchema> {
  try {
    return departureCursorSchema.parse(
      JSON.parse(Buffer.from(value, 'base64url').toString('utf8')),
    );
  } catch {
    throw new PersonnelActionOverviewRepositoryError(
      'Invalid departure cursor.',
      'INVALID_CURSOR',
    );
  }
}

function addCalendarDays(value: string, days: number): string {
  const date = new Date(`${value}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function requireUserActor(context: TenantContext): string {
  if (context.actor.type !== 'user') {
    throw new PersonnelActionOverviewRepositoryError(
      'A user actor is required.',
      'ACTOR_REQUIRED',
    );
  }
  return context.actor.userId;
}
