import {
  createPersonnelContractAmendmentMetadataInputSchema,
  personnelContractAmendmentListSchema,
  personnelContractAmendmentSchema,
  replacePersonnelContractAmendmentMetadataInputSchema,
  type CreatePersonnelContractAmendmentMetadataInput,
  type PersonnelContractAmendment,
  type PersonnelContractAmendmentList,
  type ReplacePersonnelContractAmendmentMetadataInput,
} from '@yuta/contracts/personnel';
import { identifierSchema } from '@yuta/contracts';
import { requireEstablishment, type TenantContext } from '@yuta/tenant';
import { and, desc, eq, lt, or, sql } from 'drizzle-orm';
import { createHash } from 'node:crypto';
import { v7 as uuidv7 } from 'uuid';
import { z } from 'zod';
import type { CloudDatabaseClient } from './client';
import {
  personnelContractAmendmentCommandReceipts,
  personnelContractAmendments,
  personnelContractAmendmentVersions,
  personnelEmployeeAuditEvents,
  personnelEmployeeDossiers,
} from './schema';

type PersonnelTenantContext = TenantContext & { establishmentId: string };

const pageSize = 10;
const amendmentCategory = 'signed_employment_contract_amendment';
const cursorSchema = z
  .object({
    effectiveDate: z.string().date(),
    createdAt: z.string().datetime({ offset: true }),
    id: identifierSchema,
  })
  .strict();
const accessInputSchema = z
  .object({
    employeeId: identifierSchema,
    amendmentId: identifierSchema,
    operationId: identifierSchema,
    disposition: z.enum(['inline', 'attachment']),
  })
  .strict();

export class PersonnelContractAmendmentRepositoryError extends Error {
  constructor(
    message: string,
    readonly code:
      | 'ACTOR_REQUIRED'
      | 'CONFLICT'
      | 'IDEMPOTENCY_CONFLICT'
      | 'INVALID_CURSOR'
      | 'NOT_FOUND',
  ) {
    super(message);
    this.name = 'PersonnelContractAmendmentRepositoryError';
  }
}

export type PersonnelContractAmendmentContentGrant = {
  storageKey: string;
  filename: string;
  mediaType: 'application/pdf';
  byteSize: number;
};

export async function listPersonnelContractAmendments(
  db: CloudDatabaseClient,
  context: TenantContext,
  employeeId: string,
  cursor?: string,
): Promise<PersonnelContractAmendmentList> {
  requireEstablishment(context);
  const scope: PersonnelTenantContext = context;
  const parsedEmployeeId = identifierSchema.parse(employeeId);
  const parsedCursor = cursor ? decodeCursor(cursor) : null;

  const employee = await findScopedEmployee(db, scope, parsedEmployeeId);
  if (!employee) {
    throw new PersonnelContractAmendmentRepositoryError(
      'The employee could not be found.',
      'NOT_FOUND',
    );
  }

  const cursorFilter = parsedCursor
    ? or(
        lt(
          personnelContractAmendments.effectiveDate,
          parsedCursor.effectiveDate,
        ),
        and(
          eq(
            personnelContractAmendments.effectiveDate,
            parsedCursor.effectiveDate,
          ),
          lt(
            personnelContractAmendments.createdAt,
            new Date(parsedCursor.createdAt),
          ),
        ),
        and(
          eq(
            personnelContractAmendments.effectiveDate,
            parsedCursor.effectiveDate,
          ),
          eq(
            personnelContractAmendments.createdAt,
            new Date(parsedCursor.createdAt),
          ),
          lt(personnelContractAmendments.id, parsedCursor.id),
        ),
      )
    : undefined;
  const rows = await db
    .select({
      id: personnelContractAmendments.id,
      employeeId: personnelContractAmendments.employeeId,
      effectiveDate: personnelContractAmendments.effectiveDate,
      reference: personnelContractAmendments.reference,
      revision: personnelContractAmendments.revision,
      createdAt: personnelContractAmendments.createdAt,
      filename: personnelContractAmendmentVersions.filename,
      mediaType: personnelContractAmendmentVersions.mediaType,
      byteSize: personnelContractAmendmentVersions.byteSize,
      version: personnelContractAmendmentVersions.version,
      uploadedAt: personnelContractAmendmentVersions.createdAt,
    })
    .from(personnelContractAmendments)
    .innerJoin(
      personnelContractAmendmentVersions,
      and(
        eq(
          personnelContractAmendmentVersions.amendmentId,
          personnelContractAmendments.id,
        ),
        eq(
          personnelContractAmendmentVersions.organizationId,
          personnelContractAmendments.organizationId,
        ),
        eq(
          personnelContractAmendmentVersions.establishmentId,
          personnelContractAmendments.establishmentId,
        ),
        eq(
          personnelContractAmendmentVersions.employeeId,
          personnelContractAmendments.employeeId,
        ),
        eq(
          personnelContractAmendmentVersions.version,
          personnelContractAmendments.currentVersion,
        ),
      ),
    )
    .where(and(amendmentScope(scope, parsedEmployeeId), cursorFilter))
    .orderBy(
      desc(personnelContractAmendments.effectiveDate),
      desc(personnelContractAmendments.createdAt),
      desc(personnelContractAmendments.id),
    )
    .limit(pageSize + 1);
  const items = rows.slice(0, pageSize);
  const last = items.at(-1);
  return personnelContractAmendmentListSchema.parse({
    items: items.map(toAmendment),
    pageInfo: {
      hasMore: rows.length > pageSize,
      nextCursor:
        rows.length > pageSize && last
          ? encodeCursor({
              effectiveDate: last.effectiveDate,
              createdAt: last.createdAt.toISOString(),
              id: last.id,
            })
          : null,
    },
  });
}

export async function createPersonnelContractAmendmentMetadata(
  db: CloudDatabaseClient,
  context: TenantContext,
  rawInput: CreatePersonnelContractAmendmentMetadataInput,
  now = new Date(),
): Promise<{
  amendment: PersonnelContractAmendment;
  idempotentReplay: boolean;
}> {
  requireEstablishment(context);
  const scope: PersonnelTenantContext = context;
  const actorUserId = requireUserActor(scope);
  const input =
    createPersonnelContractAmendmentMetadataInputSchema.parse(rawInput);
  const fingerprint = amendmentFingerprint('create', input);
  return commitAmendmentCommand(
    db,
    scope,
    actorUserId,
    input,
    fingerprint,
    now,
  );
}

export async function replacePersonnelContractAmendmentMetadata(
  db: CloudDatabaseClient,
  context: TenantContext,
  rawInput: ReplacePersonnelContractAmendmentMetadataInput,
  now = new Date(),
): Promise<{
  amendment: PersonnelContractAmendment;
  idempotentReplay: boolean;
}> {
  requireEstablishment(context);
  const scope: PersonnelTenantContext = context;
  const actorUserId = requireUserActor(scope);
  const input =
    replacePersonnelContractAmendmentMetadataInputSchema.parse(rawInput);
  const fingerprint = amendmentFingerprint('replace', input);
  return commitAmendmentCommand(
    db,
    scope,
    actorUserId,
    input,
    fingerprint,
    now,
  );
}

export async function grantPersonnelContractAmendmentContentAccess(
  db: CloudDatabaseClient,
  context: TenantContext,
  rawInput: z.input<typeof accessInputSchema>,
): Promise<PersonnelContractAmendmentContentGrant> {
  requireEstablishment(context);
  const scope: PersonnelTenantContext = context;
  const actorUserId = requireUserActor(scope);
  const input = accessInputSchema.parse(rawInput);
  return db.transaction(async (transaction) => {
    const [row] = await transaction
      .select({
        storageKey: personnelContractAmendmentVersions.storageKey,
        filename: personnelContractAmendmentVersions.filename,
        mediaType: personnelContractAmendmentVersions.mediaType,
        byteSize: personnelContractAmendmentVersions.byteSize,
      })
      .from(personnelContractAmendments)
      .innerJoin(
        personnelContractAmendmentVersions,
        and(
          eq(
            personnelContractAmendmentVersions.amendmentId,
            personnelContractAmendments.id,
          ),
          eq(
            personnelContractAmendmentVersions.version,
            personnelContractAmendments.currentVersion,
          ),
          eq(
            personnelContractAmendmentVersions.organizationId,
            personnelContractAmendments.organizationId,
          ),
          eq(
            personnelContractAmendmentVersions.establishmentId,
            personnelContractAmendments.establishmentId,
          ),
          eq(
            personnelContractAmendmentVersions.employeeId,
            personnelContractAmendments.employeeId,
          ),
        ),
      )
      .where(
        and(
          amendmentScope(scope, input.employeeId),
          eq(personnelContractAmendments.id, input.amendmentId),
        ),
      )
      .limit(1);
    if (!row || row.mediaType !== 'application/pdf') {
      throw new PersonnelContractAmendmentRepositoryError(
        'The amendment could not be found.',
        'NOT_FOUND',
      );
    }
    await transaction.insert(personnelEmployeeAuditEvents).values({
      id: uuidv7(),
      organizationId: scope.organizationId,
      establishmentId: scope.establishmentId,
      employeeId: input.employeeId,
      actorUserId,
      eventType:
        input.disposition === 'inline'
          ? 'employee.document_viewed'
          : 'employee.document_download_granted',
      operationId: input.operationId,
      metadata: {
        category: amendmentCategory,
        amendmentId: input.amendmentId,
      },
    });
    return {
      storageKey: row.storageKey,
      filename: row.filename,
      mediaType: 'application/pdf',
      byteSize: row.byteSize,
    };
  });
}

export async function recordPersonnelContractAmendmentUploadRejected(
  db: CloudDatabaseClient,
  context: TenantContext,
  employeeId: string,
  operationId: string,
  reasonCode: 'invalid_file' | 'scanner_rejected' | 'storage_failure',
  amendmentId?: string,
): Promise<void> {
  requireEstablishment(context);
  const scope: PersonnelTenantContext = context;
  const actorUserId = requireUserActor(scope);
  const parsedEmployeeId = identifierSchema.parse(employeeId);
  const parsedOperationId = identifierSchema.parse(operationId);
  const parsedAmendmentId = amendmentId
    ? identifierSchema.parse(amendmentId)
    : null;
  await db.transaction(async (transaction) => {
    const employee = await findScopedEmployee(
      transaction,
      scope,
      parsedEmployeeId,
    );
    if (!employee) {
      throw new PersonnelContractAmendmentRepositoryError(
        'The employee could not be found.',
        'NOT_FOUND',
      );
    }
    if (parsedAmendmentId) {
      const [amendment] = await transaction
        .select({ id: personnelContractAmendments.id })
        .from(personnelContractAmendments)
        .where(
          and(
            amendmentScope(scope, parsedEmployeeId),
            eq(personnelContractAmendments.id, parsedAmendmentId),
          ),
        )
        .limit(1);
      if (!amendment) {
        throw new PersonnelContractAmendmentRepositoryError(
          'The amendment could not be found.',
          'NOT_FOUND',
        );
      }
    }
    await transaction.insert(personnelEmployeeAuditEvents).values({
      id: uuidv7(),
      organizationId: scope.organizationId,
      establishmentId: scope.establishmentId,
      employeeId: parsedEmployeeId,
      actorUserId,
      eventType: 'employee.document_upload_rejected',
      operationId: parsedOperationId,
      metadata: {
        category: amendmentCategory,
        reasonCode,
        ...(parsedAmendmentId ? { amendmentId: parsedAmendmentId } : {}),
      },
    });
  });
}

type PersonnelTransaction = Parameters<
  Parameters<CloudDatabaseClient['transaction']>[0]
>[0];
type CreateInput = z.infer<
  typeof createPersonnelContractAmendmentMetadataInputSchema
>;
type ReplaceInput = z.infer<
  typeof replacePersonnelContractAmendmentMetadataInputSchema
>;

async function commitAmendmentCommand(
  db: CloudDatabaseClient,
  scope: PersonnelTenantContext,
  actorUserId: string,
  input: CreateInput | ReplaceInput,
  fingerprint: string,
  now: Date,
) {
  const commandType = 'amendmentId' in input ? 'replace' : 'create';
  const createInput = commandType === 'create' ? (input as CreateInput) : null;
  const idempotencyHash = hash(input.idempotencyKey);
  await db
    .delete(personnelContractAmendmentCommandReceipts)
    .where(
      and(
        eq(
          personnelContractAmendmentCommandReceipts.organizationId,
          scope.organizationId,
        ),
        eq(
          personnelContractAmendmentCommandReceipts.establishmentId,
          scope.establishmentId,
        ),
        lt(personnelContractAmendmentCommandReceipts.expiresAt, now),
      ),
    );
  return db.transaction(async (transaction) => {
    await transaction.execute(
      sql`select pg_advisory_xact_lock(hashtextextended(${`${scope.organizationId}:${scope.establishmentId}:${actorUserId}:contract-amendment:${idempotencyHash}`}, 0))`,
    );
    const employee = await findScopedEmployee(
      transaction,
      scope,
      input.employeeId,
    );
    if (!employee) {
      throw new PersonnelContractAmendmentRepositoryError(
        'The employee could not be found.',
        'NOT_FOUND',
      );
    }
    const [receipt] = await transaction
      .select()
      .from(personnelContractAmendmentCommandReceipts)
      .where(
        and(
          eq(
            personnelContractAmendmentCommandReceipts.organizationId,
            scope.organizationId,
          ),
          eq(
            personnelContractAmendmentCommandReceipts.establishmentId,
            scope.establishmentId,
          ),
          eq(
            personnelContractAmendmentCommandReceipts.actorUserId,
            actorUserId,
          ),
          eq(
            personnelContractAmendmentCommandReceipts.idempotencyHash,
            idempotencyHash,
          ),
        ),
      )
      .limit(1);
    if (receipt) {
      if (
        receipt.requestFingerprint !== fingerprint ||
        receipt.commandType !== commandType
      ) {
        throw new PersonnelContractAmendmentRepositoryError(
          'The idempotency key was reused for another amendment command.',
          'IDEMPOTENCY_CONFLICT',
        );
      }
      const replay = await findAmendmentVersion(
        transaction,
        scope,
        input.employeeId,
        receipt.amendmentId,
        receipt.version,
      );
      if (!replay) {
        throw new PersonnelContractAmendmentRepositoryError(
          'The committed amendment could not be found.',
          'IDEMPOTENCY_CONFLICT',
        );
      }
      return { amendment: toAmendment(replay), idempotentReplay: true };
    }

    const existing =
      'amendmentId' in input
        ? await findAmendmentForUpdate(
            transaction,
            scope,
            input.employeeId,
            input.amendmentId,
          )
        : null;
    if ('amendmentId' in input && !existing) {
      throw new PersonnelContractAmendmentRepositoryError(
        'The amendment could not be found.',
        'NOT_FOUND',
      );
    }
    if (
      'amendmentId' in input &&
      existing &&
      existing.revision !== input.expectedRevision
    ) {
      throw new PersonnelContractAmendmentRepositoryError(
        'The amendment changed after it was opened.',
        'CONFLICT',
      );
    }

    const amendmentId = existing?.id ?? uuidv7();
    const version = (existing?.currentVersion ?? 0) + 1;
    const revision = (existing?.revision ?? 0) + 1;
    if (existing) {
      const updated = await transaction
        .update(personnelContractAmendments)
        .set({ currentVersion: version, revision, updatedAt: now })
        .where(
          and(
            amendmentScope(scope, input.employeeId),
            eq(personnelContractAmendments.id, amendmentId),
            eq(personnelContractAmendments.revision, existing.revision),
          ),
        )
        .returning({ id: personnelContractAmendments.id });
      if (updated.length !== 1) {
        throw new PersonnelContractAmendmentRepositoryError(
          'The amendment changed after it was opened.',
          'CONFLICT',
        );
      }
    } else {
      if (!createInput) {
        throw new PersonnelContractAmendmentRepositoryError(
          'The amendment create input is invalid.',
          'NOT_FOUND',
        );
      }
      await transaction.insert(personnelContractAmendments).values({
        id: amendmentId,
        organizationId: scope.organizationId,
        establishmentId: scope.establishmentId,
        employeeId: input.employeeId,
        effectiveDate: createInput.effectiveDate,
        reference: createInput.reference,
        currentVersion: version,
        revision,
        createdAt: now,
        updatedAt: now,
      });
    }
    const [createdVersion] = await transaction
      .insert(personnelContractAmendmentVersions)
      .values({
        id: uuidv7(),
        organizationId: scope.organizationId,
        establishmentId: scope.establishmentId,
        employeeId: input.employeeId,
        amendmentId,
        version,
        filename: input.filename,
        mediaType: input.mediaType,
        byteSize: input.byteSize,
        checksum: input.checksum,
        storageKey: input.storageKey,
        uploadedByUserId: actorUserId,
        createdAt: now,
      })
      .returning();
    await transaction.insert(personnelEmployeeAuditEvents).values({
      id: uuidv7(),
      organizationId: scope.organizationId,
      establishmentId: scope.establishmentId,
      employeeId: input.employeeId,
      actorUserId,
      eventType: existing
        ? 'employee.document_replaced'
        : 'employee.document_upload_completed',
      operationId: input.idempotencyKey,
      metadata: { category: amendmentCategory, amendmentId, version },
    });
    await transaction.insert(personnelContractAmendmentCommandReceipts).values({
      id: uuidv7(),
      organizationId: scope.organizationId,
      establishmentId: scope.establishmentId,
      employeeId: input.employeeId,
      actorUserId,
      commandType,
      idempotencyHash,
      requestFingerprint: fingerprint,
      amendmentId,
      version,
      createdAt: now,
      expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000),
    });
    return {
      amendment: personnelContractAmendmentSchema.parse({
        id: amendmentId,
        employeeId: input.employeeId,
        effectiveDate: existing?.effectiveDate ?? createInput?.effectiveDate,
        reference: existing?.reference ?? createInput?.reference ?? null,
        filename: createdVersion.filename,
        mediaType: createdVersion.mediaType,
        byteSize: createdVersion.byteSize,
        version,
        revision,
        uploadedAt: createdVersion.createdAt.toISOString(),
      }),
      idempotentReplay: false,
    };
  });
}

function amendmentScope(context: PersonnelTenantContext, employeeId: string) {
  return and(
    eq(personnelContractAmendments.organizationId, context.organizationId),
    eq(personnelContractAmendments.establishmentId, context.establishmentId),
    eq(personnelContractAmendments.employeeId, employeeId),
  );
}

async function findScopedEmployee(
  database: CloudDatabaseClient | PersonnelTransaction,
  context: PersonnelTenantContext,
  employeeId: string,
) {
  const [employee] = await database
    .select({ id: personnelEmployeeDossiers.id })
    .from(personnelEmployeeDossiers)
    .where(
      and(
        eq(personnelEmployeeDossiers.organizationId, context.organizationId),
        eq(personnelEmployeeDossiers.establishmentId, context.establishmentId),
        eq(personnelEmployeeDossiers.id, employeeId),
      ),
    )
    .limit(1);
  return employee ?? null;
}

async function findAmendmentForUpdate(
  transaction: PersonnelTransaction,
  context: PersonnelTenantContext,
  employeeId: string,
  amendmentId: string,
) {
  const [amendment] = await transaction
    .select()
    .from(personnelContractAmendments)
    .where(
      and(
        amendmentScope(context, employeeId),
        eq(personnelContractAmendments.id, amendmentId),
      ),
    )
    .limit(1)
    .for('update');
  return amendment ?? null;
}

async function findAmendmentVersion(
  transaction: PersonnelTransaction,
  context: PersonnelTenantContext,
  employeeId: string,
  amendmentId: string,
  version: number,
) {
  const [row] = await transaction
    .select({
      id: personnelContractAmendments.id,
      employeeId: personnelContractAmendments.employeeId,
      effectiveDate: personnelContractAmendments.effectiveDate,
      reference: personnelContractAmendments.reference,
      revision: personnelContractAmendments.revision,
      createdAt: personnelContractAmendments.createdAt,
      filename: personnelContractAmendmentVersions.filename,
      mediaType: personnelContractAmendmentVersions.mediaType,
      byteSize: personnelContractAmendmentVersions.byteSize,
      version: personnelContractAmendmentVersions.version,
      uploadedAt: personnelContractAmendmentVersions.createdAt,
    })
    .from(personnelContractAmendments)
    .innerJoin(
      personnelContractAmendmentVersions,
      and(
        eq(
          personnelContractAmendmentVersions.amendmentId,
          personnelContractAmendments.id,
        ),
        eq(personnelContractAmendmentVersions.version, version),
        eq(
          personnelContractAmendmentVersions.organizationId,
          personnelContractAmendments.organizationId,
        ),
        eq(
          personnelContractAmendmentVersions.establishmentId,
          personnelContractAmendments.establishmentId,
        ),
        eq(
          personnelContractAmendmentVersions.employeeId,
          personnelContractAmendments.employeeId,
        ),
      ),
    )
    .where(
      and(
        amendmentScope(context, employeeId),
        eq(personnelContractAmendments.id, amendmentId),
      ),
    )
    .limit(1);
  return row ?? null;
}

function toAmendment(row: {
  id: string;
  employeeId: string;
  effectiveDate: string;
  reference: string | null;
  filename: string;
  mediaType: string;
  byteSize: number;
  version: number;
  revision: number;
  uploadedAt: Date;
}): PersonnelContractAmendment {
  return personnelContractAmendmentSchema.parse({
    id: row.id,
    employeeId: row.employeeId,
    effectiveDate: row.effectiveDate,
    reference: row.reference,
    filename: row.filename,
    mediaType: row.mediaType,
    byteSize: row.byteSize,
    version: row.version,
    revision: row.revision,
    uploadedAt: row.uploadedAt.toISOString(),
  });
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
    throw new PersonnelContractAmendmentRepositoryError(
      'The amendment cursor is invalid.',
      'INVALID_CURSOR',
    );
  }
}

function amendmentFingerprint(
  commandType: 'create' | 'replace',
  input: CreateInput | ReplaceInput,
): string {
  return hash(
    JSON.stringify({
      commandType,
      employeeId: input.employeeId,
      ...('amendmentId' in input
        ? {
            amendmentId: input.amendmentId,
            expectedRevision: input.expectedRevision,
          }
        : {
            effectiveDate: input.effectiveDate,
            reference: input.reference,
          }),
      filename: input.filename,
      mediaType: input.mediaType,
      byteSize: input.byteSize,
      checksum: input.checksum,
    }),
  );
}

function hash(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

function requireUserActor(context: PersonnelTenantContext): string {
  if (context.actor.type !== 'user') {
    throw new PersonnelContractAmendmentRepositoryError(
      'A user actor is required.',
      'ACTOR_REQUIRED',
    );
  }
  return context.actor.userId;
}
