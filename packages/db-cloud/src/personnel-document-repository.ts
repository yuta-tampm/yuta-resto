import { identifierSchema, isoDateTimeSchema } from '@yuta/contracts';
import {
  personnelDocumentListSchema,
  personnelDocumentSchema,
  savePersonnelDocumentMetadataInputSchema,
  type PersonnelDocument,
  type PersonnelDocumentList,
  type SavePersonnelDocumentMetadataInput,
} from '@yuta/contracts/personnel';
import { requireEstablishment, type TenantContext } from '@yuta/tenant';
import { and, eq, lt, sql } from 'drizzle-orm';
import { createHash } from 'node:crypto';
import { v7 as uuidv7 } from 'uuid';
import { z } from 'zod';
import type { CloudDatabaseClient } from './client';
import {
  personnelDocumentCommandReceipts,
  personnelDocuments,
  personnelDocumentVersions,
  personnelEmployeeAuditEvents,
  personnelEmployeeDossiers,
} from './schema';

type PersonnelTenantContext = TenantContext & { establishmentId: string };

export class PersonnelDocumentRepositoryError extends Error {
  constructor(
    message: string,
    readonly code:
      | 'ACTOR_REQUIRED'
      | 'CONFLICT'
      | 'IDEMPOTENCY_CONFLICT'
      | 'NOT_FOUND',
  ) {
    super(message);
    this.name = 'PersonnelDocumentRepositoryError';
  }
}

export type PersonnelDocumentContentGrant = {
  storageKey: string;
  filename: string;
  mediaType: 'application/pdf';
  byteSize: number;
};

export type PersonnelDocumentExtractionSource = {
  documentId: string;
  documentVersion: number;
  storageKey: string;
  mediaType: 'application/pdf';
  byteSize: number;
  checksum: string;
};

const accessInputSchema = z
  .object({
    employeeId: identifierSchema,
    documentId: identifierSchema,
    operationId: identifierSchema,
    disposition: z.enum(['inline', 'attachment']),
  })
  .strict();

export async function listPersonnelDocuments(
  db: CloudDatabaseClient,
  context: TenantContext,
  employeeId: string,
  operationId: string,
): Promise<PersonnelDocumentList> {
  requireEstablishment(context);
  const scope: PersonnelTenantContext = context;
  const parsedEmployeeId = identifierSchema.parse(employeeId);
  const parsedOperationId = identifierSchema.parse(operationId);
  const actorUserId = requireUserActor(scope);

  return db.transaction(async (transaction) => {
    await transaction.execute(
      sql`select pg_advisory_xact_lock(hashtextextended(${`${scope.organizationId}:${scope.establishmentId}:${parsedEmployeeId}:employee.documents_viewed:${parsedOperationId}`}, 0))`,
    );
    const employee = await findScopedEmployee(
      transaction,
      scope,
      parsedEmployeeId,
    );
    if (!employee) {
      throw new PersonnelDocumentRepositoryError(
        'The employee could not be found.',
        'NOT_FOUND',
      );
    }

    const rows = await transaction
      .select({
        id: personnelDocuments.id,
        employeeId: personnelDocuments.employeeId,
        category: personnelDocuments.category,
        filename: personnelDocumentVersions.filename,
        mediaType: personnelDocumentVersions.mediaType,
        byteSize: personnelDocumentVersions.byteSize,
        version: personnelDocumentVersions.version,
        revision: personnelDocuments.revision,
        uploadedAt: personnelDocumentVersions.createdAt,
      })
      .from(personnelDocuments)
      .innerJoin(
        personnelDocumentVersions,
        and(
          eq(personnelDocumentVersions.documentId, personnelDocuments.id),
          eq(
            personnelDocumentVersions.organizationId,
            personnelDocuments.organizationId,
          ),
          eq(
            personnelDocumentVersions.establishmentId,
            personnelDocuments.establishmentId,
          ),
          eq(
            personnelDocumentVersions.employeeId,
            personnelDocuments.employeeId,
          ),
          eq(
            personnelDocumentVersions.version,
            personnelDocuments.currentVersion,
          ),
        ),
      )
      .where(documentScope(scope, parsedEmployeeId));

    const [existingAccessEvent] = await transaction
      .select({ id: personnelEmployeeAuditEvents.id })
      .from(personnelEmployeeAuditEvents)
      .where(
        and(
          eq(personnelEmployeeAuditEvents.organizationId, scope.organizationId),
          eq(
            personnelEmployeeAuditEvents.establishmentId,
            scope.establishmentId,
          ),
          eq(personnelEmployeeAuditEvents.employeeId, parsedEmployeeId),
          eq(personnelEmployeeAuditEvents.actorUserId, actorUserId),
          eq(
            personnelEmployeeAuditEvents.eventType,
            'employee.documents_viewed',
          ),
          eq(personnelEmployeeAuditEvents.operationId, parsedOperationId),
        ),
      )
      .limit(1);
    if (!existingAccessEvent) {
      await transaction.insert(personnelEmployeeAuditEvents).values({
        id: uuidv7(),
        organizationId: scope.organizationId,
        establishmentId: scope.establishmentId,
        employeeId: parsedEmployeeId,
        actorUserId,
        eventType: 'employee.documents_viewed',
        operationId: parsedOperationId,
      });
    }

    return personnelDocumentListSchema.parse({
      items: rows.map(toDocument),
    });
  });
}

export async function savePersonnelDocumentMetadata(
  db: CloudDatabaseClient,
  context: TenantContext,
  rawInput: SavePersonnelDocumentMetadataInput,
  now = new Date(),
): Promise<{ document: PersonnelDocument; idempotentReplay: boolean }> {
  requireEstablishment(context);
  const scope: PersonnelTenantContext = context;
  const actorUserId = requireUserActor(scope);
  const input = savePersonnelDocumentMetadataInputSchema.parse(rawInput);
  const idempotencyHash = hash(input.idempotencyKey);
  const fingerprint = hash(
    JSON.stringify({
      employeeId: input.employeeId,
      expectedRevision: input.expectedRevision,
      category: input.category,
      filename: input.filename,
      mediaType: input.mediaType,
      byteSize: input.byteSize,
      checksum: input.checksum,
    }),
  );

  await db
    .delete(personnelDocumentCommandReceipts)
    .where(
      and(
        eq(
          personnelDocumentCommandReceipts.organizationId,
          scope.organizationId,
        ),
        eq(
          personnelDocumentCommandReceipts.establishmentId,
          scope.establishmentId,
        ),
        lt(personnelDocumentCommandReceipts.expiresAt, now),
      ),
    );

  return db.transaction(async (transaction) => {
    await transaction.execute(
      sql`select pg_advisory_xact_lock(hashtextextended(${`${scope.organizationId}:${scope.establishmentId}:${input.employeeId}:${input.category}`}, 0))`,
    );

    const employee = await findScopedEmployee(
      transaction,
      scope,
      input.employeeId,
    );
    if (!employee) {
      throw new PersonnelDocumentRepositoryError(
        'The employee could not be found.',
        'NOT_FOUND',
      );
    }

    const [receipt] = await transaction
      .select()
      .from(personnelDocumentCommandReceipts)
      .where(
        and(
          eq(
            personnelDocumentCommandReceipts.organizationId,
            scope.organizationId,
          ),
          eq(
            personnelDocumentCommandReceipts.establishmentId,
            scope.establishmentId,
          ),
          eq(personnelDocumentCommandReceipts.actorUserId, actorUserId),
          eq(personnelDocumentCommandReceipts.idempotencyHash, idempotencyHash),
        ),
      )
      .limit(1);
    if (receipt) {
      if (receipt.requestFingerprint !== fingerprint) {
        throw new PersonnelDocumentRepositoryError(
          'The idempotency key was reused for another document.',
          'IDEMPOTENCY_CONFLICT',
        );
      }
      const replay = await findDocumentVersion(
        transaction,
        scope,
        input.employeeId,
        receipt.documentId,
        receipt.version,
      );
      if (!replay) {
        throw new PersonnelDocumentRepositoryError(
          'The committed document could not be found.',
          'IDEMPOTENCY_CONFLICT',
        );
      }
      return { document: toDocument(replay), idempotentReplay: true };
    }

    const [existing] = await transaction
      .select()
      .from(personnelDocuments)
      .where(
        and(
          documentScope(scope, input.employeeId),
          eq(personnelDocuments.category, input.category),
        ),
      )
      .limit(1)
      .for('update');

    if (
      (!existing && input.expectedRevision !== null) ||
      (existing && existing.revision !== input.expectedRevision)
    ) {
      throw new PersonnelDocumentRepositoryError(
        'The document changed after it was opened.',
        'CONFLICT',
      );
    }

    const documentId = existing?.id ?? uuidv7();
    const version = (existing?.currentVersion ?? 0) + 1;
    const revision = (existing?.revision ?? 0) + 1;
    if (existing) {
      await transaction
        .update(personnelDocuments)
        .set({ currentVersion: version, revision, updatedAt: now })
        .where(
          and(
            documentScope(scope, input.employeeId),
            eq(personnelDocuments.id, documentId),
            eq(personnelDocuments.revision, existing.revision),
          ),
        );
    } else {
      await transaction.insert(personnelDocuments).values({
        id: documentId,
        organizationId: scope.organizationId,
        establishmentId: scope.establishmentId,
        employeeId: input.employeeId,
        category: input.category,
        currentVersion: version,
        revision,
        createdAt: now,
        updatedAt: now,
      });
    }

    const [createdVersion] = await transaction
      .insert(personnelDocumentVersions)
      .values({
        id: uuidv7(),
        organizationId: scope.organizationId,
        establishmentId: scope.establishmentId,
        employeeId: input.employeeId,
        documentId,
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
      metadata: { category: input.category, version },
    });

    await transaction.insert(personnelDocumentCommandReceipts).values({
      id: uuidv7(),
      organizationId: scope.organizationId,
      establishmentId: scope.establishmentId,
      employeeId: input.employeeId,
      actorUserId,
      idempotencyHash,
      requestFingerprint: fingerprint,
      documentId,
      version,
      createdAt: now,
      expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000),
    });

    return {
      document: personnelDocumentSchema.parse({
        id: documentId,
        employeeId: input.employeeId,
        category: input.category,
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

export async function grantPersonnelDocumentContentAccess(
  db: CloudDatabaseClient,
  context: TenantContext,
  rawInput: z.input<typeof accessInputSchema>,
): Promise<PersonnelDocumentContentGrant> {
  requireEstablishment(context);
  const scope: PersonnelTenantContext = context;
  const actorUserId = requireUserActor(scope);
  const input = accessInputSchema.parse(rawInput);

  return db.transaction(async (transaction) => {
    const [row] = await transaction
      .select({
        storageKey: personnelDocumentVersions.storageKey,
        filename: personnelDocumentVersions.filename,
        mediaType: personnelDocumentVersions.mediaType,
        byteSize: personnelDocumentVersions.byteSize,
      })
      .from(personnelDocuments)
      .innerJoin(
        personnelDocumentVersions,
        and(
          eq(personnelDocumentVersions.documentId, personnelDocuments.id),
          eq(
            personnelDocumentVersions.organizationId,
            personnelDocuments.organizationId,
          ),
          eq(
            personnelDocumentVersions.establishmentId,
            personnelDocuments.establishmentId,
          ),
          eq(
            personnelDocumentVersions.employeeId,
            personnelDocuments.employeeId,
          ),
          eq(
            personnelDocumentVersions.version,
            personnelDocuments.currentVersion,
          ),
        ),
      )
      .where(
        and(
          documentScope(scope, input.employeeId),
          eq(personnelDocuments.id, input.documentId),
        ),
      )
      .limit(1);
    if (!row || row.mediaType !== 'application/pdf') {
      throw new PersonnelDocumentRepositoryError(
        'The document could not be found.',
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
      metadata: { documentId: input.documentId },
    });

    return {
      storageKey: row.storageKey,
      filename: row.filename,
      mediaType: 'application/pdf',
      byteSize: row.byteSize,
    };
  });
}

const extractionSourceInputSchema = z
  .object({
    employeeId: identifierSchema,
    documentId: identifierSchema,
    documentVersion: z.number().int().positive(),
  })
  .strict();

export async function resolvePersonnelDocumentExtractionSource(
  db: CloudDatabaseClient,
  context: TenantContext,
  rawInput: z.input<typeof extractionSourceInputSchema>,
): Promise<PersonnelDocumentExtractionSource> {
  requireEstablishment(context);
  const scope: PersonnelTenantContext = context;
  requireUserActor(scope);
  const input = extractionSourceInputSchema.parse(rawInput);

  const [row] = await db
    .select({
      documentId: personnelDocuments.id,
      documentVersion: personnelDocumentVersions.version,
      storageKey: personnelDocumentVersions.storageKey,
      mediaType: personnelDocumentVersions.mediaType,
      byteSize: personnelDocumentVersions.byteSize,
      checksum: personnelDocumentVersions.checksum,
    })
    .from(personnelDocuments)
    .innerJoin(
      personnelDocumentVersions,
      and(
        eq(personnelDocumentVersions.documentId, personnelDocuments.id),
        eq(
          personnelDocumentVersions.organizationId,
          personnelDocuments.organizationId,
        ),
        eq(
          personnelDocumentVersions.establishmentId,
          personnelDocuments.establishmentId,
        ),
        eq(personnelDocumentVersions.employeeId, personnelDocuments.employeeId),
        eq(
          personnelDocumentVersions.version,
          personnelDocuments.currentVersion,
        ),
      ),
    )
    .where(
      and(
        documentScope(scope, input.employeeId),
        eq(personnelDocuments.id, input.documentId),
        eq(personnelDocuments.currentVersion, input.documentVersion),
      ),
    )
    .limit(1);

  if (!row || row.mediaType !== 'application/pdf') {
    throw new PersonnelDocumentRepositoryError(
      'The current extraction source could not be found.',
      'NOT_FOUND',
    );
  }
  return {
    ...row,
    mediaType: 'application/pdf',
  };
}

export async function recordPersonnelDocumentUploadRejected(
  db: CloudDatabaseClient,
  context: TenantContext,
  employeeId: string,
  operationId: string,
  reasonCode: 'invalid_file' | 'scanner_rejected' | 'storage_failure',
): Promise<void> {
  requireEstablishment(context);
  const scope: PersonnelTenantContext = context;
  const actorUserId = requireUserActor(scope);
  const parsedEmployeeId = identifierSchema.parse(employeeId);
  const parsedOperationId = identifierSchema.parse(operationId);
  await db.transaction(async (transaction) => {
    const employee = await findScopedEmployee(
      transaction,
      scope,
      parsedEmployeeId,
    );
    if (!employee) {
      throw new PersonnelDocumentRepositoryError(
        'The employee could not be found.',
        'NOT_FOUND',
      );
    }
    await transaction.insert(personnelEmployeeAuditEvents).values({
      id: uuidv7(),
      organizationId: scope.organizationId,
      establishmentId: scope.establishmentId,
      employeeId: parsedEmployeeId,
      actorUserId,
      eventType: 'employee.document_upload_rejected',
      operationId: parsedOperationId,
      metadata: { category: 'signed_employment_contract', reasonCode },
    });
  });
}

type PersonnelTransaction = Parameters<
  Parameters<CloudDatabaseClient['transaction']>[0]
>[0];

function documentScope(context: PersonnelTenantContext, employeeId: string) {
  return and(
    eq(personnelDocuments.organizationId, context.organizationId),
    eq(personnelDocuments.establishmentId, context.establishmentId),
    eq(personnelDocuments.employeeId, employeeId),
  );
}

async function findScopedEmployee(
  transaction: PersonnelTransaction,
  context: PersonnelTenantContext,
  employeeId: string,
) {
  const [employee] = await transaction
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

async function findDocumentVersion(
  transaction: PersonnelTransaction,
  context: PersonnelTenantContext,
  employeeId: string,
  documentId: string,
  version: number,
) {
  const [row] = await transaction
    .select({
      id: personnelDocuments.id,
      employeeId: personnelDocuments.employeeId,
      category: personnelDocuments.category,
      filename: personnelDocumentVersions.filename,
      mediaType: personnelDocumentVersions.mediaType,
      byteSize: personnelDocumentVersions.byteSize,
      version: personnelDocumentVersions.version,
      revision: personnelDocuments.revision,
      uploadedAt: personnelDocumentVersions.createdAt,
    })
    .from(personnelDocuments)
    .innerJoin(
      personnelDocumentVersions,
      and(
        eq(personnelDocumentVersions.documentId, personnelDocuments.id),
        eq(personnelDocumentVersions.version, version),
      ),
    )
    .where(
      and(
        documentScope(context, employeeId),
        eq(personnelDocuments.id, documentId),
      ),
    )
    .limit(1);
  return row ?? null;
}

function toDocument(row: {
  id: string;
  employeeId: string;
  category: 'signed_employment_contract';
  filename: string;
  mediaType: string;
  byteSize: number;
  version: number;
  revision: number;
  uploadedAt: Date;
}): PersonnelDocument {
  return personnelDocumentSchema.parse({
    ...row,
    uploadedAt: isoDateTimeSchema.parse(row.uploadedAt.toISOString()),
  });
}

function requireUserActor(context: PersonnelTenantContext): string {
  if (context.actor.type !== 'user') {
    throw new PersonnelDocumentRepositoryError(
      'A user actor is required.',
      'ACTOR_REQUIRED',
    );
  }
  return context.actor.userId;
}

function hash(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}
