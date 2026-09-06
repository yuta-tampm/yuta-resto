import { config } from 'dotenv';
import { eq, getTableColumns } from 'drizzle-orm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { v7 as uuidv7 } from 'uuid';
import { createCloudDatabaseClient } from '../src/client';
import {
  establishments,
  formalitesPersonnelDraftCommandReceipts,
  formalitesPersonnelDrafts,
  organizations,
  personnelEmployeeDossiers,
  users,
} from '../src/schema';

config({ path: '.env.test' });
config({ path: '.env.local' });

describe('Formalités Personnel draft schema shape', () => {
  it('contains only the approved bounded receipt fields', () => {
    expect(
      Object.keys(getTableColumns(formalitesPersonnelDraftCommandReceipts)),
    ).toEqual([
      'id',
      'organizationId',
      'establishmentId',
      'actorUserId',
      'commandType',
      'operationKeyHash',
      'requestFingerprint',
      'resultingDraftId',
      'resultingDraftRevision',
      'resultingOutcome',
      'createdAt',
    ]);
    expect(
      Object.keys(getTableColumns(formalitesPersonnelDraftCommandReceipts)),
    ).not.toEqual(
      expect.arrayContaining([
        'operationKey',
        'personnelValues',
        'abandonmentReason',
        'requestBody',
        'ipAddress',
        'userAgent',
        'expiresAt',
        'cleanupMarker',
      ]),
    );
  });

  it('contains dual snapshots of exactly the seven approved facts', () => {
    const columns = Object.keys(getTableColumns(formalitesPersonnelDrafts));
    expect(columns.filter((name) => name.startsWith('draft'))).toEqual([
      'draftGivenNames',
      'draftFamilyName',
      'draftPosition',
      'draftQualification',
      'draftEmploymentTermType',
      'draftEntryDate',
      'draftContractWeeklyMinutes',
    ]);
    expect(columns.filter((name) => name.startsWith('source'))).toEqual([
      'sourceGivenNames',
      'sourceFamilyName',
      'sourcePosition',
      'sourceQualification',
      'sourceEmploymentTermType',
      'sourceEntryDate',
      'sourceContractWeeklyMinutes',
      'sourcePersonnelRevision',
    ]);
  });
});

const integrationTest =
  process.env.CLOUD_DATABASE_URL &&
  process.env.YUTA_ALLOW_DATABASE_INTEGRATION_TESTS === 'true'
    ? describe
    : describe.skip;

integrationTest('Formalités Personnel draft PostgreSQL constraints', () => {
  const db = createCloudDatabaseClient(process.env);
  const organizationId = uuidv7();
  const otherOrganizationId = uuidv7();
  const establishmentId = uuidv7();
  const otherEstablishmentId = uuidv7();
  const employeeId = uuidv7();
  const otherEmployeeId = uuidv7();
  const rollbackEmployeeId = uuidv7();
  const receiptEmployeeId = uuidv7();
  const receiptDraftId = uuidv7();
  const actorUserId = uuidv7();

  const draftValues = (
    id: string,
    overrides: Record<string, unknown> = {},
  ) => ({
    id,
    organizationId,
    establishmentId,
    employeeId,
    formalityType: 'cdi_preparation',
    status: 'draft' as const,
    probationChoice: 'undecided' as const,
    revision: 1,
    draftGivenNames: 'Camille',
    draftFamilyName: 'Martin',
    draftPosition: 'Serveuse',
    draftQualification: 'Employée',
    draftEmploymentTermType: 'indefinite' as const,
    draftEntryDate: '2026-09-01',
    draftContractWeeklyMinutes: null,
    sourceGivenNames: 'Camille',
    sourceFamilyName: 'Martin',
    sourcePosition: 'Serveuse',
    sourceQualification: 'Employée',
    sourceEmploymentTermType: 'indefinite' as const,
    sourceEntryDate: '2026-09-01',
    sourceContractWeeklyMinutes: null,
    sourcePersonnelRevision: 1,
    ...overrides,
  });

  beforeAll(async () => {
    await db.transaction(async (transaction) => {
      await transaction.insert(organizations).values([
        {
          id: organizationId,
          name: 'Formalités schema A',
          slug: `formalites-schema-a-${organizationId}`,
        },
        {
          id: otherOrganizationId,
          name: 'Formalités schema B',
          slug: `formalites-schema-b-${otherOrganizationId}`,
        },
      ]);
      await transaction.insert(establishments).values([
        {
          id: establishmentId,
          organizationId,
          name: 'Formalités A',
          slug: `formalites-a-${establishmentId}`,
        },
        {
          id: otherEstablishmentId,
          organizationId: otherOrganizationId,
          name: 'Formalités B',
          slug: `formalites-b-${otherEstablishmentId}`,
        },
      ]);
      await transaction.insert(users).values({
        id: actorUserId,
        authProviderId: `test:formalites-schema:${actorUserId}`,
        email: `formalites-schema-${actorUserId}@example.test`,
      });
      await transaction.insert(personnelEmployeeDossiers).values([
        {
          id: employeeId,
          organizationId,
          establishmentId,
          givenNames: 'Camille',
          familyName: 'Martin',
          position: 'Serveuse',
          qualification: 'Employée',
          employmentTermType: 'indefinite',
          workTimeCategory: 'full_time',
          contractWeeklyMinutes: null,
          entryDate: '2026-09-01',
        },
        {
          id: otherEmployeeId,
          organizationId: otherOrganizationId,
          establishmentId: otherEstablishmentId,
          givenNames: 'Alex',
          familyName: 'Bernard',
          position: 'Cuisinier',
          qualification: 'Employé',
          employmentTermType: 'indefinite',
          workTimeCategory: 'full_time',
          contractWeeklyMinutes: 2_100,
          entryDate: '2026-09-01',
        },
        {
          id: rollbackEmployeeId,
          organizationId,
          establishmentId,
          givenNames: 'Robin',
          familyName: 'Rollback',
          position: 'Serveur',
          qualification: 'Employé',
          employmentTermType: 'indefinite',
          workTimeCategory: 'full_time',
          contractWeeklyMinutes: 2_100,
          entryDate: '2026-09-01',
        },
        {
          id: receiptEmployeeId,
          organizationId,
          establishmentId,
          givenNames: 'Rita',
          familyName: 'Receipt',
          position: 'Serveuse',
          qualification: 'Employée',
          employmentTermType: 'indefinite',
          workTimeCategory: 'full_time',
          contractWeeklyMinutes: 2_100,
          entryDate: '2026-09-01',
        },
      ]);
      await transaction
        .insert(formalitesPersonnelDrafts)
        .values(draftValues(receiptDraftId, { employeeId: receiptEmployeeId }));
    });
  });

  afterAll(async () => {
    await db
      .delete(formalitesPersonnelDraftCommandReceipts)
      .where(
        eq(
          formalitesPersonnelDraftCommandReceipts.organizationId,
          organizationId,
        ),
      );
    await db
      .delete(formalitesPersonnelDrafts)
      .where(eq(formalitesPersonnelDrafts.organizationId, organizationId));
    await db
      .delete(personnelEmployeeDossiers)
      .where(eq(personnelEmployeeDossiers.organizationId, organizationId));
    await db
      .delete(personnelEmployeeDossiers)
      .where(eq(personnelEmployeeDossiers.organizationId, otherOrganizationId));
    await db.delete(users).where(eq(users.id, actorUserId));
    await db
      .delete(establishments)
      .where(eq(establishments.organizationId, organizationId));
    await db
      .delete(establishments)
      .where(eq(establishments.organizationId, otherOrganizationId));
    await db.delete(organizations).where(eq(organizations.id, organizationId));
    await db
      .delete(organizations)
      .where(eq(organizations.id, otherOrganizationId));
  });

  it('enforces full establishment and employee scope', async () => {
    await expect(
      db.insert(formalitesPersonnelDrafts).values(
        draftValues(uuidv7(), {
          employeeId: otherEmployeeId,
        }),
      ),
    ).rejects.toThrow();
    await expect(
      db.insert(formalitesPersonnelDrafts).values(
        draftValues(uuidv7(), {
          establishmentId: otherEstablishmentId,
        }),
      ),
    ).rejects.toThrow();
    await expect(
      db.insert(formalitesPersonnelDrafts).values(
        draftValues(uuidv7(), {
          status: 'abandoned',
          abandonmentReason: '  Motif non normalisé  ',
          abandonedAt: new Date(),
        }),
      ),
    ).rejects.toThrow();
  });

  it('enforces the bounded type, revision, minutes, and lifecycle checks', async () => {
    await expect(
      db
        .insert(formalitesPersonnelDrafts)
        .values(draftValues(uuidv7(), { formalityType: 'dpae' })),
    ).rejects.toThrow();
    await expect(
      db
        .insert(formalitesPersonnelDrafts)
        .values(draftValues(uuidv7(), { revision: 0 })),
    ).rejects.toThrow();
    await expect(
      db
        .insert(formalitesPersonnelDrafts)
        .values(draftValues(uuidv7(), { probationChoice: 'pending' })),
    ).rejects.toThrow();
    await expect(
      db
        .insert(formalitesPersonnelDrafts)
        .values(draftValues(uuidv7(), { draftContractWeeklyMinutes: 0 })),
    ).rejects.toThrow();
    await expect(
      db
        .insert(formalitesPersonnelDrafts)
        .values(draftValues(uuidv7(), { abandonmentReason: 'Not abandoned' })),
    ).rejects.toThrow();
    await expect(
      db.insert(formalitesPersonnelDrafts).values(
        draftValues(uuidv7(), {
          status: 'abandoned',
          abandonmentReason: null,
          abandonedAt: new Date(),
        }),
      ),
    ).rejects.toThrow();
  });

  it('enforces one active draft and allows a new one after abandonment', async () => {
    const firstDraftId = uuidv7();
    await db
      .insert(formalitesPersonnelDrafts)
      .values(draftValues(firstDraftId));
    await expect(
      db
        .insert(formalitesPersonnelDrafts)
        .values(draftValues(uuidv7(), { probationChoice: 'include' })),
    ).rejects.toThrow();

    await db
      .update(formalitesPersonnelDrafts)
      .set({
        status: 'abandoned',
        abandonmentReason: 'Préparation remplacée.',
        abandonedAt: new Date(),
        revision: 2,
      })
      .where(eq(formalitesPersonnelDrafts.id, firstDraftId));

    const secondDraftId = uuidv7();
    await db
      .insert(formalitesPersonnelDrafts)
      .values(draftValues(secondDraftId));
  });

  it('rolls back an inserted draft when its transaction fails', async () => {
    const rollbackDraftId = uuidv7();
    await expect(
      db.transaction(async (transaction) => {
        await transaction
          .insert(formalitesPersonnelDrafts)
          .values(
            draftValues(rollbackDraftId, { employeeId: rollbackEmployeeId }),
          );
        throw new Error('Injected transaction failure');
      }),
    ).rejects.toThrow('Injected transaction failure');

    const rows = await db
      .select({ id: formalitesPersonnelDrafts.id })
      .from(formalitesPersonnelDrafts)
      .where(eq(formalitesPersonnelDrafts.id, rollbackDraftId));
    expect(rows).toEqual([]);
  });

  it('enforces bounded, scoped command receipts', async () => {
    const receipt = {
      id: uuidv7(),
      organizationId,
      establishmentId,
      actorUserId,
      commandType: 'create' as const,
      operationKeyHash: 'a'.repeat(64),
      requestFingerprint: 'b'.repeat(64),
      resultingDraftId: receiptDraftId,
      resultingDraftRevision: 1,
      resultingOutcome: 'created' as const,
    };
    await db.insert(formalitesPersonnelDraftCommandReceipts).values(receipt);
    await expect(
      db.insert(formalitesPersonnelDraftCommandReceipts).values({
        ...receipt,
        id: uuidv7(),
      }),
    ).rejects.toThrow();
    await expect(
      db.insert(formalitesPersonnelDraftCommandReceipts).values({
        ...receipt,
        id: uuidv7(),
        operationKeyHash: 'raw-key',
      }),
    ).rejects.toThrow();
  });
});
