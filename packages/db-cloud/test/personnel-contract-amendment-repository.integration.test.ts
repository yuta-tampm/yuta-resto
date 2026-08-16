import { config } from 'dotenv';
import { eq } from 'drizzle-orm';
import type { TenantContext } from '@yuta/tenant';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { v7 as uuidv7 } from 'uuid';
import {
  createPersonnelContractAmendmentMetadata,
  grantPersonnelContractAmendmentContentAccess,
  listPersonnelContractAmendments,
  PersonnelContractAmendmentRepositoryError,
  replacePersonnelContractAmendmentMetadata,
} from '../src/personnel-contract-amendment-repository';
import {
  createCloudDatabaseClient,
  type CloudDatabaseClient,
} from '../src/client';
import {
  establishments,
  organizations,
  personnelContractAmendmentCommandReceipts,
  personnelContractAmendments,
  personnelContractAmendmentVersions,
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

integrationTest('personnel contract amendment tenant isolation', () => {
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
        name: 'Personnel Amendments',
        slug: `personnel-amendments-${organizationId}`,
      });
      await transaction.insert(establishments).values([
        {
          id: establishmentId,
          organizationId,
          name: 'Amendment A',
          slug: `amendment-a-${establishmentId}`,
        },
        {
          id: otherEstablishmentId,
          organizationId,
          name: 'Amendment B',
          slug: `amendment-b-${otherEstablishmentId}`,
        },
      ]);
      await transaction.insert(users).values({
        id: actorUserId,
        authProviderId: `test:personnel-amendments:${actorUserId}`,
        email: `personnel-amendments-${actorUserId}@example.test`,
        displayName: 'Amendment test owner',
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
      .delete(personnelContractAmendmentCommandReceipts)
      .where(
        eq(
          personnelContractAmendmentCommandReceipts.organizationId,
          organizationId,
        ),
      );
    await db
      .delete(personnelContractAmendmentVersions)
      .where(
        eq(personnelContractAmendmentVersions.organizationId, organizationId),
      );
    await db
      .delete(personnelContractAmendments)
      .where(eq(personnelContractAmendments.organizationId, organizationId));
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

  it('creates, replays, replaces, pages, and grants only inside trusted scope', async () => {
    const tenant = context();
    const createInput = amendmentInput(
      employeeId,
      '2026-09-01',
      uuidv7(),
      uuidv7(),
      'a',
    );
    const first = await createPersonnelContractAmendmentMetadata(
      db,
      tenant,
      createInput,
    );
    expect(first.idempotentReplay).toBe(false);
    expect(first.amendment).toMatchObject({ version: 1, revision: 1 });

    const replay = await createPersonnelContractAmendmentMetadata(db, tenant, {
      ...createInput,
      storageKey: uuidv7(),
    });
    expect(replay.idempotentReplay).toBe(true);
    expect(replay.amendment.id).toBe(first.amendment.id);
    await expect(
      createPersonnelContractAmendmentMetadata(db, tenant, {
        ...createInput,
        effectiveDate: '2026-09-02',
        storageKey: uuidv7(),
      }),
    ).rejects.toMatchObject({ code: 'IDEMPOTENCY_CONFLICT' });

    const replacement = await replacePersonnelContractAmendmentMetadata(
      db,
      tenant,
      {
        idempotencyKey: uuidv7(),
        employeeId,
        amendmentId: first.amendment.id,
        expectedRevision: 1,
        filename: 'avenant-corrige.pdf',
        mediaType: 'application/pdf',
        byteSize: 520_000,
        checksum: 'b'.repeat(64),
        storageKey: uuidv7(),
      },
    );
    expect(replacement.amendment).toMatchObject({ version: 2, revision: 2 });
    await expect(
      replacePersonnelContractAmendmentMetadata(db, tenant, {
        idempotencyKey: uuidv7(),
        employeeId,
        amendmentId: first.amendment.id,
        expectedRevision: 1,
        filename: 'avenant-perime.pdf',
        mediaType: 'application/pdf',
        byteSize: 530_000,
        checksum: 'c'.repeat(64),
        storageKey: uuidv7(),
      }),
    ).rejects.toMatchObject({ code: 'CONFLICT' });

    for (let day = 2; day <= 11; day += 1) {
      await createPersonnelContractAmendmentMetadata(
        db,
        tenant,
        amendmentInput(
          employeeId,
          `2026-09-${String(day).padStart(2, '0')}`,
          uuidv7(),
          uuidv7(),
          (day % 10).toString(),
        ),
      );
    }
    const firstPage = await listPersonnelContractAmendments(
      db,
      tenant,
      employeeId,
    );
    expect(firstPage.items).toHaveLength(10);
    expect(firstPage.items[0]?.effectiveDate).toBe('2026-09-11');
    expect(firstPage.items[0]).not.toHaveProperty('storageKey');
    expect(firstPage.items[0]).not.toHaveProperty('checksum');
    expect(firstPage.items[0]).not.toHaveProperty('organizationId');
    expect(firstPage.pageInfo.hasMore).toBe(true);
    const secondPage = await listPersonnelContractAmendments(
      db,
      tenant,
      employeeId,
      firstPage.pageInfo.nextCursor ?? undefined,
    );
    expect(secondPage.items).toHaveLength(1);
    expect(secondPage.pageInfo.hasMore).toBe(false);

    const grant = await grantPersonnelContractAmendmentContentAccess(
      db,
      tenant,
      {
        employeeId,
        amendmentId: first.amendment.id,
        operationId: uuidv7(),
        disposition: 'inline',
      },
    );
    expect(grant.storageKey).toBeTruthy();
    await expect(
      grantPersonnelContractAmendmentContentAccess(
        db,
        context(otherEstablishmentId),
        {
          employeeId,
          amendmentId: first.amendment.id,
          operationId: uuidv7(),
          disposition: 'inline',
        },
      ),
    ).rejects.toBeInstanceOf(PersonnelContractAmendmentRepositoryError);
    await expect(
      listPersonnelContractAmendments(
        db,
        context(otherEstablishmentId),
        employeeId,
      ),
    ).rejects.toMatchObject({ code: 'NOT_FOUND' });
  });

  function employee(id: string, targetEstablishmentId: string, suffix: string) {
    return {
      id,
      organizationId,
      establishmentId: targetEstablishmentId,
      givenNames: `Amendment ${suffix}`,
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

function amendmentInput(
  employeeId: string,
  effectiveDate: string,
  idempotencyKey: string,
  storageKey: string,
  checksumCharacter: string,
) {
  return {
    idempotencyKey,
    employeeId,
    effectiveDate,
    reference: null,
    filename: 'avenant-signe.pdf',
    mediaType: 'application/pdf' as const,
    byteSize: 512_000,
    checksum: checksumCharacter.repeat(64),
    storageKey,
  };
}
