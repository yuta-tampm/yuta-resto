import { config } from 'dotenv';
import { eq } from 'drizzle-orm';
import type { TenantContext } from '@yuta/tenant';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { v7 as uuidv7 } from 'uuid';
import {
  grantPersonnelDocumentContentAccess,
  listPersonnelDocuments,
  PersonnelDocumentRepositoryError,
  savePersonnelDocumentMetadata,
} from '../src/personnel-document-repository';
import {
  createCloudDatabaseClient,
  type CloudDatabaseClient,
} from '../src/client';
import {
  establishments,
  organizations,
  personnelDocumentCommandReceipts,
  personnelDocuments,
  personnelDocumentVersions,
  personnelEmployeeAuditEvents,
  personnelEmployeeDossiers,
  users,
} from '../src/schema';

config({ path: '.env.test' });
config({ path: '.env.local' });

const integrationTest =
  process.env.CLOUD_DATABASE_URL &&
  process.env.YUTA_ALLOW_DATABASE_INTEGRATION_TESTS === 'true'
    ? describe
    : describe.skip;

integrationTest('personnel document repository tenant isolation', () => {
  let db: CloudDatabaseClient;
  const organizationId = uuidv7();
  const establishmentId = uuidv7();
  const otherEstablishmentId = uuidv7();
  const employeeId = uuidv7();
  const otherEmployeeId = uuidv7();
  const actorUserId = uuidv7();

  function context(targetEstablishmentId = establishmentId): TenantContext {
    return {
      organizationId,
      establishmentId: targetEstablishmentId,
      actor: {
        type: 'user',
        userId: actorUserId,
        membershipId: uuidv7(),
        role: 'OWNER',
      },
      locale: 'fr-FR',
      timezone: 'Europe/Paris',
      entitlements: new Set(),
    };
  }

  beforeAll(async () => {
    db = createCloudDatabaseClient(process.env);
    await db.transaction(async (transaction) => {
      await transaction.insert(organizations).values({
        id: organizationId,
        name: 'Personnel Documents',
        slug: `personnel-documents-${organizationId}`,
      });
      await transaction.insert(establishments).values([
        {
          id: establishmentId,
          organizationId,
          name: 'Document A',
          slug: `document-a-${establishmentId}`,
        },
        {
          id: otherEstablishmentId,
          organizationId,
          name: 'Document B',
          slug: `document-b-${otherEstablishmentId}`,
        },
      ]);
      await transaction.insert(users).values({
        id: actorUserId,
        authProviderId: `test:personnel-documents:${actorUserId}`,
        email: `personnel-documents-${actorUserId}@example.test`,
        displayName: 'Document test owner',
      });
      await transaction
        .insert(personnelEmployeeDossiers)
        .values([
          employee(employeeId, establishmentId, 'A'),
          employee(otherEmployeeId, otherEstablishmentId, 'B'),
        ]);
    });
  });

  afterAll(async () => {
    if (!db) return;
    await db
      .delete(personnelDocumentCommandReceipts)
      .where(
        eq(personnelDocumentCommandReceipts.organizationId, organizationId),
      );
    await db
      .delete(personnelDocumentVersions)
      .where(eq(personnelDocumentVersions.organizationId, organizationId));
    await db
      .delete(personnelDocuments)
      .where(eq(personnelDocuments.organizationId, organizationId));
    await db
      .delete(personnelEmployeeAuditEvents)
      .where(eq(personnelEmployeeAuditEvents.organizationId, organizationId));
    await db
      .delete(personnelEmployeeDossiers)
      .where(eq(personnelEmployeeDossiers.organizationId, organizationId));
    await db
      .delete(establishments)
      .where(eq(establishments.organizationId, organizationId));
    await db.delete(organizations).where(eq(organizations.id, organizationId));
    await db.delete(users).where(eq(users.id, actorUserId));
    await db.$client.end({ timeout: 5 });
  });

  it('adds, replays, replaces, and grants only inside the full trusted scope', async () => {
    const tenant = context();
    const firstInput = documentInput(employeeId, null, uuidv7(), uuidv7(), 'a');
    const first = await savePersonnelDocumentMetadata(db, tenant, firstInput);
    expect(first.idempotentReplay).toBe(false);
    expect(first.document).toMatchObject({ version: 1, revision: 1 });

    const replay = await savePersonnelDocumentMetadata(db, tenant, {
      ...firstInput,
      storageKey: uuidv7(),
    });
    expect(replay.idempotentReplay).toBe(true);
    expect(replay.document.id).toBe(first.document.id);

    const listOperationId = uuidv7();
    const listed = await listPersonnelDocuments(
      db,
      tenant,
      employeeId,
      listOperationId,
    );
    await listPersonnelDocuments(db, tenant, employeeId, listOperationId);
    expect(listed.items).toEqual([first.document]);
    expect(listed.items[0]).not.toHaveProperty('storageKey');
    const listAuditEvents = await db
      .select()
      .from(personnelEmployeeAuditEvents)
      .where(eq(personnelEmployeeAuditEvents.operationId, listOperationId));
    expect(listAuditEvents).toHaveLength(1);

    const replacement = await savePersonnelDocumentMetadata(
      db,
      tenant,
      documentInput(employeeId, 1, uuidv7(), uuidv7(), 'b'),
    );
    expect(replacement.document).toMatchObject({ version: 2, revision: 2 });
    await expect(
      savePersonnelDocumentMetadata(
        db,
        tenant,
        documentInput(employeeId, 1, uuidv7(), uuidv7(), 'c'),
      ),
    ).rejects.toBeInstanceOf(PersonnelDocumentRepositoryError);

    const grant = await grantPersonnelDocumentContentAccess(db, tenant, {
      employeeId,
      documentId: replacement.document.id,
      operationId: uuidv7(),
      disposition: 'inline',
    });
    expect(grant.storageKey).toBeTruthy();
    await expect(
      grantPersonnelDocumentContentAccess(db, context(otherEstablishmentId), {
        employeeId,
        documentId: replacement.document.id,
        operationId: uuidv7(),
        disposition: 'inline',
      }),
    ).rejects.toMatchObject({ code: 'NOT_FOUND' });
    await expect(
      listPersonnelDocuments(
        db,
        context(otherEstablishmentId),
        employeeId,
        uuidv7(),
      ),
    ).rejects.toMatchObject({ code: 'NOT_FOUND' });
  });

  function employee(id: string, targetEstablishmentId: string, suffix: string) {
    return {
      id,
      organizationId,
      establishmentId: targetEstablishmentId,
      givenNames: `Document ${suffix}`,
      familyName: 'Test',
      position: 'Cuisine',
      qualification: 'Employé',
      employmentTermType: 'indefinite' as const,
      expectedEndDate: null,
      workTimeCategory: 'full_time' as const,
      entryDate: '2026-08-15',
    };
  }
});

function documentInput(
  employeeId: string,
  expectedRevision: number | null,
  idempotencyKey: string,
  storageKey: string,
  checksumCharacter: string,
) {
  return {
    idempotencyKey,
    employeeId,
    expectedRevision,
    category: 'signed_employment_contract' as const,
    filename: 'contrat-signe.pdf',
    mediaType: 'application/pdf' as const,
    byteSize: 428_000,
    checksum: checksumCharacter.repeat(64),
    storageKey,
  };
}
