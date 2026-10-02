import { config } from 'dotenv';
import { and, eq } from 'drizzle-orm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { v7 as uuidv7 } from 'uuid';
import {
  createCloudDatabaseClient,
  type CloudDatabaseClient,
} from '../src/client';
import {
  correctPersonnelRegisterEntry,
  createPersonnelRegisterEntry,
  listPersonnelRegister,
  listPersonnelRegisterCandidates,
  PersonnelRegisterRepositoryError,
  recordPersonnelRegisterExport,
} from '../src/personnel-register-repository';
import {
  establishments,
  organizations,
  personnelEmployeeDossiers,
  personnelRegisterAuditEvents,
  personnelRegisterCommandReceipts,
  personnelRegisterCorrections,
  personnelRegisterCounters,
  personnelRegisterEntries,
  users,
} from '../src/schema';

config({ path: '.env.test' });
config({ path: '.env.local' });

const integrationTest =
  process.env.CLOUD_DATABASE_URL &&
  process.env.YUTA_ALLOW_DATABASE_INTEGRATION_TESTS === 'true'
    ? describe
    : describe.skip;

integrationTest('personnel register repository', () => {
  let db: CloudDatabaseClient;
  const organizationId = uuidv7();
  const establishmentId = uuidv7();
  const otherEstablishmentId = uuidv7();
  const userId = uuidv7();
  const employeeId = uuidv7();
  const inscriptionOperationId = uuidv7();
  const context = {
    organizationId,
    establishmentId,
    actor: {
      type: 'user' as const,
      userId,
      membershipId: uuidv7(),
      role: 'OWNER' as const,
    },
    locale: 'fr-FR',
    timezone: 'Europe/Paris',
    entitlements: new Set<string>(),
  };
  const facts = {
    givenNames: 'Camille',
    familyName: 'Martin',
    nationalityCode: 'FR',
    nationalityLabel: 'Française',
    birthDate: '1990-04-12',
    sex: 'F' as const,
    position: 'Cheffe de rang',
    qualification: 'Employée qualifiée',
    entryDate: '2026-08-01',
    departureDate: null,
    protectedAuthorization: {
      required: false,
      authorizationDate: null,
      requestDate: null,
    },
    workAuthorization: {
      required: false,
      titleType: null,
      orderNumber: null,
    },
    employmentTermType: 'indefinite' as const,
    workTimeCategory: 'full_time' as const,
    temporaryWorkCompany: null,
    employerGroup: null,
    specialContract: 'none' as const,
  };

  beforeAll(async () => {
    db = createCloudDatabaseClient(process.env);
    await db.insert(organizations).values({
      id: organizationId,
      name: 'Register test',
      slug: `register-${organizationId}`,
    });
    await db.insert(establishments).values([
      {
        id: establishmentId,
        organizationId,
        name: 'Register one',
        slug: `register-one-${establishmentId}`,
      },
      {
        id: otherEstablishmentId,
        organizationId,
        name: 'Register two',
        slug: `register-two-${otherEstablishmentId}`,
      },
    ]);
    await db.insert(users).values({
      id: userId,
      authProviderId: `register:${userId}`,
      displayName: 'Register Owner',
      email: `register-${userId}@example.test`,
    });
    await db.insert(personnelEmployeeDossiers).values({
      id: employeeId,
      organizationId,
      establishmentId,
      givenNames: facts.givenNames,
      familyName: facts.familyName,
      position: facts.position,
      qualification: facts.qualification,
      employmentTermType: facts.employmentTermType,
      expectedEndDate: null,
      fixedTermReasonCode: null,
      workTimeCategory: facts.workTimeCategory,
      contractWeeklyMinutes: 2100,
      entryDate: facts.entryDate,
      departureDate: null,
    });
  });

  afterAll(async () => {
    if (!db) return;
    await db
      .delete(personnelRegisterAuditEvents)
      .where(eq(personnelRegisterAuditEvents.organizationId, organizationId));
    await db
      .delete(personnelRegisterCommandReceipts)
      .where(
        eq(personnelRegisterCommandReceipts.organizationId, organizationId),
      );
    await db
      .delete(personnelRegisterCorrections)
      .where(eq(personnelRegisterCorrections.organizationId, organizationId));
    await db
      .delete(personnelRegisterEntries)
      .where(eq(personnelRegisterEntries.organizationId, organizationId));
    await db
      .delete(personnelRegisterCounters)
      .where(eq(personnelRegisterCounters.organizationId, organizationId));
    await db
      .delete(personnelEmployeeDossiers)
      .where(eq(personnelEmployeeDossiers.organizationId, organizationId));
    await db.delete(users).where(eq(users.id, userId));
    await db
      .delete(establishments)
      .where(eq(establishments.organizationId, organizationId));
    await db.delete(organizations).where(eq(organizations.id, organizationId));
    await db.$client.end({ timeout: 5 });
  });

  it('requires reviewed inscription, preserves sequence and isolates establishment scope', async () => {
    const candidates = await listPersonnelRegisterCandidates(db, context);
    expect(candidates.items.map((item) => item.employeeId)).toEqual([
      employeeId,
    ]);
    const created = await createPersonnelRegisterEntry(db, context, {
      operationId: inscriptionOperationId,
      employeeId,
      facts,
    });
    expect(created.entry.sequence).toBe(1);
    const replay = await createPersonnelRegisterEntry(db, context, {
      operationId: inscriptionOperationId,
      employeeId,
      facts,
    });
    expect(replay.idempotentReplay).toBe(true);
    const viewOperationId = uuidv7();
    const page = await listPersonnelRegister(
      db,
      context,
      { limit: 50 },
      viewOperationId,
    );
    expect(page.items).toHaveLength(1);
    expect(page.snapshotRevision).toBe(1);
    await listPersonnelRegister(db, context, { limit: 50 }, viewOperationId);
    const exportOperationId = uuidv7();
    await recordPersonnelRegisterExport(db, context, exportOperationId);
    await recordPersonnelRegisterExport(db, context, exportOperationId);
    const auditRows = await db
      .select({
        eventType: personnelRegisterAuditEvents.eventType,
        operationId: personnelRegisterAuditEvents.operationId,
      })
      .from(personnelRegisterAuditEvents)
      .where(
        and(
          eq(personnelRegisterAuditEvents.organizationId, organizationId),
          eq(personnelRegisterAuditEvents.establishmentId, establishmentId),
        ),
      );
    expect(
      auditRows.filter((row) => row.operationId === viewOperationId),
    ).toEqual([
      {
        eventType: 'personnel.register_viewed',
        operationId: viewOperationId,
      },
    ]);
    expect(
      auditRows.filter((row) => row.operationId === exportOperationId),
    ).toEqual([
      {
        eventType: 'personnel.register_exported',
        operationId: exportOperationId,
      },
    ]);
    await expect(
      listPersonnelRegister(
        db,
        { ...context, establishmentId: otherEstablishmentId },
        { limit: 50 },
        uuidv7(),
      ),
    ).resolves.toMatchObject({ items: [], readiness: 'empty' });
  });

  it('appends a correction and rejects stale revisions', async () => {
    const [current] = await db
      .select()
      .from(personnelRegisterEntries)
      .where(
        and(
          eq(personnelRegisterEntries.organizationId, organizationId),
          eq(personnelRegisterEntries.establishmentId, establishmentId),
        ),
      )
      .limit(1);
    expect(current).toBeDefined();
    const correctedFacts = { ...facts, qualification: 'Agent de maîtrise' };
    const firstCorrectionOperationId = uuidv7();
    const firstCorrectionInput = {
      operationId: firstCorrectionOperationId,
      entryId: current!.id,
      expectedRevision: 1,
      effectiveDate: '2026-08-18',
      reason: 'Qualification vérifiée',
      facts: correctedFacts,
    };
    const corrected = await correctPersonnelRegisterEntry(
      db,
      context,
      firstCorrectionInput,
    );
    expect(corrected.entry.revision).toBe(2);

    const latestFacts = { ...correctedFacts, position: 'Responsable de salle' };
    const latest = await correctPersonnelRegisterEntry(db, context, {
      operationId: uuidv7(),
      entryId: current!.id,
      expectedRevision: 2,
      effectiveDate: '2026-08-18',
      reason: 'Poste vérifié',
      facts: latestFacts,
    });
    expect(latest.entry.revision).toBe(3);

    const replayedCorrection = await correctPersonnelRegisterEntry(
      db,
      context,
      firstCorrectionInput,
    );
    expect(replayedCorrection).toMatchObject({
      idempotentReplay: true,
      entry: { revision: 2, facts: correctedFacts },
    });

    const replayedInscription = await createPersonnelRegisterEntry(
      db,
      context,
      {
        operationId: inscriptionOperationId,
        employeeId,
        facts,
      },
    );
    expect(replayedInscription).toMatchObject({
      idempotentReplay: true,
      entry: { revision: 1, facts },
    });

    await expect(
      correctPersonnelRegisterEntry(db, context, {
        operationId: uuidv7(),
        entryId: current!.id,
        expectedRevision: 3,
        effectiveDate: '2026-08-18',
        reason: 'Aucun changement',
        facts: latestFacts,
      }),
    ).rejects.toMatchObject<Partial<PersonnelRegisterRepositoryError>>({
      code: 'NO_CHANGES',
    });

    await expect(
      createPersonnelRegisterEntry(db, context, {
        operationId: inscriptionOperationId,
        employeeId,
        facts: { ...facts, qualification: 'Valeur différente' },
      }),
    ).rejects.toMatchObject<Partial<PersonnelRegisterRepositoryError>>({
      code: 'IDEMPOTENCY_CONFLICT',
    });

    await expect(
      correctPersonnelRegisterEntry(db, context, {
        operationId: uuidv7(),
        entryId: current!.id,
        expectedRevision: 1,
        effectiveDate: '2026-08-18',
        reason: 'Tentative obsolète',
        facts,
      }),
    ).rejects.toMatchObject<Partial<PersonnelRegisterRepositoryError>>({
      code: 'CONFLICT',
    });
    const corrections = await db
      .select()
      .from(personnelRegisterCorrections)
      .where(eq(personnelRegisterCorrections.entryId, current!.id));
    expect(corrections).toHaveLength(2);
    expect(corrections[0]?.previousFacts).toMatchObject({
      qualification: facts.qualification,
    });
  });
});
