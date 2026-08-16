import { config } from 'dotenv';
import { and, eq, inArray } from 'drizzle-orm';
import type { TenantContext } from '@yuta/tenant';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { v7 as uuidv7 } from 'uuid';
import {
  createCloudDatabaseClient,
  type CloudDatabaseClient,
} from '../src/client';
import {
  findPersonnelEmployee,
  listPersonnelEmployeeAccessHistory,
  listPersonnelEmployeeAuditHistory,
  listPersonnelEmployees,
  createPersonnelEmployee,
  PersonnelDuplicateError,
  PersonnelConflictError,
  PersonnelRepositoryError,
  recordPersonnelEmployeeAccess,
  setPersonnelEmployeeDeparture,
  updatePersonnelEmployee,
} from '../src/personnel-repository';
import {
  establishments,
  organizations,
  personnelCommandReceipts,
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

integrationTest('personnel repository tenant isolation', () => {
  let db: CloudDatabaseClient;
  const organizationAId = uuidv7();
  const organizationBId = uuidv7();
  const establishmentAId = uuidv7();
  const establishmentA2Id = uuidv7();
  const establishmentBId = uuidv7();
  const employeeAId = uuidv7();
  const employeeA2Id = uuidv7();
  const employeeBId = uuidv7();
  const actorUserId = uuidv7();

  function context(
    organizationId: string,
    establishmentId: string,
  ): TenantContext {
    return {
      organizationId,
      establishmentId,
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
      await transaction.insert(organizations).values([
        {
          id: organizationAId,
          name: 'Personnel A',
          slug: `personnel-a-${organizationAId}`,
        },
        {
          id: organizationBId,
          name: 'Personnel B',
          slug: `personnel-b-${organizationBId}`,
        },
      ]);
      await transaction.insert(establishments).values([
        {
          id: establishmentAId,
          organizationId: organizationAId,
          name: 'Personnel A1',
          slug: `personnel-a1-${establishmentAId}`,
        },
        {
          id: establishmentA2Id,
          organizationId: organizationAId,
          name: 'Personnel A2',
          slug: `personnel-a2-${establishmentA2Id}`,
        },
        {
          id: establishmentBId,
          organizationId: organizationBId,
          name: 'Personnel B1',
          slug: `personnel-b1-${establishmentBId}`,
        },
      ]);
      await transaction.insert(users).values({
        id: actorUserId,
        authProviderId: `test:personnel:${actorUserId}`,
        email: `personnel-${actorUserId}@example.test`,
        displayName: 'Personnel test owner',
      });
      await transaction
        .insert(personnelEmployeeDossiers)
        .values([
          employee(employeeAId, organizationAId, establishmentAId, 'A1'),
          employee(employeeA2Id, organizationAId, establishmentA2Id, 'A2'),
          employee(employeeBId, organizationBId, establishmentBId, 'B1'),
        ]);
    });
  });

  afterAll(async () => {
    if (!db) return;
    await db
      .delete(personnelCommandReceipts)
      .where(eq(personnelCommandReceipts.actorUserId, actorUserId));
    await db
      .delete(personnelEmployeeAuditEvents)
      .where(eq(personnelEmployeeAuditEvents.actorUserId, actorUserId));
    await db
      .delete(personnelEmployeeDossiers)
      .where(eq(personnelEmployeeDossiers.organizationId, organizationAId));
    await db
      .delete(personnelEmployeeDossiers)
      .where(eq(personnelEmployeeDossiers.organizationId, organizationBId));
    await db
      .delete(establishments)
      .where(eq(establishments.organizationId, organizationAId));
    await db
      .delete(establishments)
      .where(eq(establishments.organizationId, organizationBId));
    await db.delete(organizations).where(eq(organizations.id, organizationAId));
    await db.delete(organizations).where(eq(organizations.id, organizationBId));
    await db.delete(users).where(eq(users.id, actorUserId));
    await db.$client.end({ timeout: 5 });
  });

  it('lists and finds employees only inside the full trusted scope', async () => {
    const result = await listPersonnelEmployees(
      db,
      context(organizationAId, establishmentAId),
      { view: 'active', search: '', completeness: 'all', limit: 25 },
      '2026-08-13',
    );
    expect(result.items.map((item) => item.id)).toEqual([employeeAId]);
    expect(result.counts.active).toBe(1);
    await expect(
      findPersonnelEmployee(
        db,
        context(organizationAId, establishmentAId),
        employeeA2Id,
        '2026-08-13',
      ),
    ).resolves.toBeNull();
    await expect(
      findPersonnelEmployee(
        db,
        context(organizationBId, establishmentBId),
        employeeAId,
        '2026-08-13',
      ),
    ).resolves.toBeNull();

    await expect(
      listPersonnelEmployees(
        db,
        {
          ...context(organizationAId, establishmentAId),
          establishmentId: null,
        },
        { view: 'active', search: '', completeness: 'all', limit: 25 },
        '2026-08-13',
      ),
    ).rejects.toMatchObject({ code: 'ESTABLISHMENT_REQUIRED' });
  });

  it('derives, counts, and filters explainable incomplete dossiers', async () => {
    const incompleteEmployeeId = uuidv7();
    await db.insert(personnelEmployeeDossiers).values({
      ...employee(
        incompleteEmployeeId,
        organizationAId,
        establishmentA2Id,
        'Incomplete',
      ),
      position: '   ',
    });

    try {
      const result = await listPersonnelEmployees(
        db,
        context(organizationAId, establishmentA2Id),
        {
          view: 'active',
          search: '',
          completeness: 'incomplete',
          limit: 25,
        },
        '2026-08-13',
      );
      expect(result.counts.incomplete).toBe(1);
      expect(result.items).toEqual([
        expect.objectContaining({
          id: incompleteEmployeeId,
          completenessReasons: ['position_missing'],
        }),
      ]);

      const complete = await listPersonnelEmployees(
        db,
        context(organizationAId, establishmentA2Id),
        {
          view: 'active',
          search: '',
          completeness: 'complete',
          limit: 25,
        },
        '2026-08-13',
      );
      expect(complete.items.map((item) => item.id)).toEqual([employeeA2Id]);
    } finally {
      await db
        .delete(personnelEmployeeDossiers)
        .where(eq(personnelEmployeeDossiers.id, incompleteEmployeeId));
    }
  });

  it('rejects an establishment paired with the wrong organization', async () => {
    await expect(
      db
        .insert(personnelEmployeeDossiers)
        .values(
          employee(uuidv7(), organizationBId, establishmentAId, 'Mismatch'),
        ),
    ).rejects.toThrow();
  });

  it('creates once, records audit atomically, and replays the same command', async () => {
    const input = createInput(uuidv7(), 'Unique');
    const tenant = context(organizationAId, establishmentAId);
    const created = await createPersonnelEmployee(
      db,
      tenant,
      input,
      '2026-08-13',
    );
    const replay = await createPersonnelEmployee(
      db,
      tenant,
      input,
      '2026-08-13',
    );
    expect(created.idempotentReplay).toBe(false);
    expect(replay.idempotentReplay).toBe(true);
    expect(replay.employee.id).toBe(created.employee.id);

    const [audit, receipts, dossiers] = await Promise.all([
      db
        .select()
        .from(personnelEmployeeAuditEvents)
        .where(
          eq(personnelEmployeeAuditEvents.employeeId, created.employee.id),
        ),
      db
        .select()
        .from(personnelCommandReceipts)
        .where(eq(personnelCommandReceipts.employeeId, created.employee.id)),
      db
        .select()
        .from(personnelEmployeeDossiers)
        .where(eq(personnelEmployeeDossiers.id, created.employee.id)),
    ]);
    expect(audit.map((event) => event.eventType)).toEqual(['employee.created']);
    expect(receipts).toHaveLength(1);
    expect(dossiers).toHaveLength(1);

    const history = await listPersonnelEmployeeAuditHistory(
      db,
      tenant,
      created.employee.id,
    );
    expect(history).toEqual({
      items: [
        expect.objectContaining({
          eventType: 'employee.created',
          actorDisplayName: 'Personnel test owner',
        }),
      ],
      truncated: false,
    });
    expect(history.items[0]).not.toHaveProperty('organizationId');
    expect(history.items[0]).not.toHaveProperty('operationId');
    expect(history.items[0]).not.toHaveProperty('metadata');

    await expect(
      listPersonnelEmployeeAuditHistory(
        db,
        context(organizationAId, establishmentA2Id),
        created.employee.id,
      ),
    ).resolves.toEqual({ items: [], truncated: false });
  });

  it('cleans expired command receipts in the current establishment', async () => {
    const expiredReceiptId = uuidv7();
    const activeReceiptId = uuidv7();
    await db.insert(personnelCommandReceipts).values([
      {
        id: expiredReceiptId,
        organizationId: organizationAId,
        establishmentId: establishmentAId,
        actorUserId,
        commandType: 'personnel.employee.test-expired',
        idempotencyHash: 'a'.repeat(64),
        requestFingerprint: 'b'.repeat(64),
        employeeId: employeeAId,
        expiresAt: new Date('2026-08-13T09:59:59.000Z'),
      },
      {
        id: activeReceiptId,
        organizationId: organizationAId,
        establishmentId: establishmentAId,
        actorUserId,
        commandType: 'personnel.employee.test-active',
        idempotencyHash: 'c'.repeat(64),
        requestFingerprint: 'd'.repeat(64),
        employeeId: employeeAId,
        expiresAt: new Date('2026-08-14T10:00:00.000Z'),
      },
    ]);

    await createPersonnelEmployee(
      db,
      context(organizationAId, establishmentAId),
      createInput(uuidv7(), 'Receipt cleanup'),
      '2026-08-13',
      new Date('2026-08-13T10:00:00.000Z'),
    );

    const receipts = await db
      .select({ id: personnelCommandReceipts.id })
      .from(personnelCommandReceipts)
      .where(
        inArray(personnelCommandReceipts.id, [
          expiredReceiptId,
          activeReceiptId,
        ]),
      );
    expect(receipts.map((receipt) => receipt.id)).toEqual([activeReceiptId]);
  });

  it('records dossier/history access once per operation without polluting domain history', async () => {
    const tenant = context(organizationAId, establishmentAId);
    const dossierOperationId = uuidv7();
    const historyOperationId = uuidv7();
    const accessHistoryOperationId = uuidv7();
    await expect(
      recordPersonnelEmployeeAccess(
        db,
        tenant,
        employeeAId,
        'employee.dossier_viewed',
        dossierOperationId,
        new Date('2026-08-14T10:00:00.000Z'),
      ),
    ).resolves.toBe(true);
    await expect(
      recordPersonnelEmployeeAccess(
        db,
        tenant,
        employeeAId,
        'employee.access_history_viewed',
        accessHistoryOperationId,
        new Date('2026-08-14T10:00:10.000Z'),
      ),
    ).resolves.toBe(true);
    await expect(
      recordPersonnelEmployeeAccess(
        db,
        tenant,
        employeeAId,
        'employee.dossier_viewed',
        dossierOperationId,
        new Date('2026-08-14T10:00:20.000Z'),
      ),
    ).resolves.toBe(true);
    await expect(
      recordPersonnelEmployeeAccess(
        db,
        tenant,
        employeeAId,
        'employee.history_viewed',
        historyOperationId,
        new Date('2026-08-14T10:05:00.000Z'),
      ),
    ).resolves.toBe(true);
    await expect(
      recordPersonnelEmployeeAccess(
        db,
        tenant,
        employeeA2Id,
        'employee.dossier_viewed',
        uuidv7(),
      ),
    ).resolves.toBe(false);

    const accessEvents = await db
      .select()
      .from(personnelEmployeeAuditEvents)
      .where(
        and(
          eq(personnelEmployeeAuditEvents.employeeId, employeeAId),
          inArray(personnelEmployeeAuditEvents.eventType, [
            'employee.dossier_viewed',
            'employee.history_viewed',
            'employee.access_history_viewed',
          ]),
        ),
      );
    expect(accessEvents).toHaveLength(3);
    expect(accessEvents.map((event) => event.eventType).sort()).toEqual([
      'employee.access_history_viewed',
      'employee.dossier_viewed',
      'employee.history_viewed',
    ]);
    const accessHistory = await listPersonnelEmployeeAccessHistory(
      db,
      tenant,
      employeeAId,
    );
    expect(accessHistory.pageInfo).toEqual({
      hasMore: false,
      nextCursor: null,
    });
    expect(accessHistory.items).toHaveLength(2);
    expect(accessHistory.items.map((event) => event.eventType)).toEqual([
      'employee.history_viewed',
      'employee.access_history_viewed',
    ]);
    expect(accessHistory.items[0]).not.toHaveProperty('operationId');
    await expect(
      listPersonnelEmployeeAccessHistory(db, tenant, employeeA2Id),
    ).resolves.toEqual({
      items: [],
      pageInfo: { hasMore: false, nextCursor: null },
    });
    await expect(
      listPersonnelEmployeeAuditHistory(db, tenant, employeeAId),
    ).resolves.toEqual({ items: [], truncated: false });
  });

  it('paginates employee access history ten visible entries at a time', async () => {
    const tenant = context(organizationAId, establishmentAId);
    const created = await createPersonnelEmployee(
      db,
      tenant,
      createInput(uuidv7(), 'Access pagination'),
      '2026-08-13',
    );
    for (let index = 0; index < 12; index += 1) {
      await recordPersonnelEmployeeAccess(
        db,
        tenant,
        created.employee.id,
        'employee.dossier_viewed',
        uuidv7(),
        new Date(Date.UTC(2026, 7, 14, 8, index * 3)),
      );
    }

    const firstPage = await listPersonnelEmployeeAccessHistory(
      db,
      tenant,
      created.employee.id,
    );
    expect(firstPage.items).toHaveLength(10);
    expect(firstPage.pageInfo.hasMore).toBe(true);
    expect(firstPage.pageInfo.nextCursor).toEqual(expect.any(String));

    const secondPage = await listPersonnelEmployeeAccessHistory(
      db,
      tenant,
      created.employee.id,
      firstPage.pageInfo.nextCursor ?? undefined,
    );
    expect(secondPage.items).toHaveLength(2);
    expect(secondPage.pageInfo).toEqual({
      hasMore: false,
      nextCursor: null,
    });
    expect(
      new Set(
        [...firstPage.items, ...secondPage.items].map((event) => event.id),
      ).size,
    ).toBe(12);
  });

  it('requires an explicit reason before creating a possible duplicate', async () => {
    const tenant = context(organizationAId, establishmentAId);
    const first = createInput(uuidv7(), 'Duplicate');
    await createPersonnelEmployee(db, tenant, first, '2026-08-13');
    const second = createInput(uuidv7(), 'Duplicate');
    await expect(
      createPersonnelEmployee(db, tenant, second, '2026-08-13'),
    ).rejects.toBeInstanceOf(PersonnelDuplicateError);

    const confirmed = await createPersonnelEmployee(
      db,
      tenant,
      {
        ...second,
        confirmDuplicate: true,
        duplicateOverrideReason: 'Homonyme vérifié par le propriétaire.',
      },
      '2026-08-13',
    );
    const audit = await db
      .select()
      .from(personnelEmployeeAuditEvents)
      .where(
        and(
          eq(personnelEmployeeAuditEvents.employeeId, confirmed.employee.id),
          eq(personnelEmployeeAuditEvents.organizationId, organizationAId),
          eq(personnelEmployeeAuditEvents.establishmentId, establishmentAId),
        ),
      );
    expect(audit.map((event) => event.eventType).sort()).toEqual([
      'employee.created',
      'employee.duplicate_override_confirmed',
    ]);
  });

  it('updates atomically, records changed field groups, and rejects stale revisions', async () => {
    const tenant = context(organizationAId, establishmentAId);
    const before = await findPersonnelEmployee(
      db,
      tenant,
      employeeAId,
      '2026-08-13',
    );
    expect(before).not.toBeNull();
    const input = {
      idempotencyKey: uuidv7(),
      employeeId: employeeAId,
      expectedRevision: before!.revision,
      givenNames: 'Employee updated',
      familyName: 'Isolation',
      position: 'Responsable de salle',
      qualification: 'Employé qualifié',
      employmentTermType: 'fixed_term' as const,
      expectedEndDate: '2027-08-13',
      fixedTermReasonCode: 'temporary_activity_increase' as const,
      workTimeCategory: 'part_time' as const,
      contractWeeklyMinutes: 1_440,
      entryDate: '2026-01-01',
      confirmFixedTermReasonClear: false,
    };
    const updated = await updatePersonnelEmployee(
      db,
      tenant,
      input,
      '2026-08-13',
    );
    const replay = await updatePersonnelEmployee(
      db,
      tenant,
      input,
      '2026-08-13',
    );
    expect(updated.updated).toBe(true);
    expect(updated.employee.revision).toBe(before!.revision + 1);
    expect(replay.idempotentReplay).toBe(true);

    const audit = await db
      .select()
      .from(personnelEmployeeAuditEvents)
      .where(
        and(
          eq(personnelEmployeeAuditEvents.employeeId, employeeAId),
          inArray(personnelEmployeeAuditEvents.eventType, [
            'employee.employment_updated',
            'employee.identity_updated',
          ]),
        ),
      );
    expect(audit.map((event) => event.eventType).sort()).toEqual([
      'employee.employment_updated',
      'employee.identity_updated',
    ]);
    expect(audit.flatMap((event) => event.changedFields)).toEqual(
      expect.arrayContaining([
        'givenNames',
        'position',
        'qualification',
        'employmentTermType',
        'expectedEndDate',
        'fixedTermReasonCode',
        'workTimeCategory',
        'contractWeeklyMinutes',
      ]),
    );

    await expect(
      updatePersonnelEmployee(
        db,
        tenant,
        { ...input, idempotencyKey: uuidv7(), position: 'Direction' },
        '2026-08-13',
      ),
    ).rejects.toBeInstanceOf(PersonnelConflictError);
  });

  it('cannot update an employee through another establishment scope', async () => {
    await expect(
      updatePersonnelEmployee(
        db,
        context(organizationAId, establishmentA2Id),
        {
          idempotencyKey: uuidv7(),
          employeeId: employeeAId,
          expectedRevision: 1,
          givenNames: 'Cross scope',
          familyName: 'Denied',
          position: 'Denied',
          qualification: 'Denied',
          employmentTermType: 'indefinite',
          expectedEndDate: null,
          fixedTermReasonCode: null,
          workTimeCategory: 'full_time',
          contractWeeklyMinutes: null,
          entryDate: '2026-01-01',
          confirmFixedTermReasonClear: false,
        },
        '2026-08-13',
      ),
    ).rejects.toMatchObject<Partial<PersonnelRepositoryError>>({
      code: 'NOT_FOUND',
    });
  });

  it('requires confirmation before a CDD reason is cleared by a CDI change', async () => {
    const tenant = context(organizationAId, establishmentAId);
    const created = await createPersonnelEmployee(
      db,
      tenant,
      {
        ...createInput(uuidv7(), `CDD confirmation ${uuidv7()}`),
        employmentTermType: 'fixed_term',
        expectedEndDate: '2026-12-31',
        fixedTermReasonCode: 'seasonal_employment',
        contractWeeklyMinutes: 1_440,
      },
      '2026-08-13',
    );
    const updateInput = {
      idempotencyKey: uuidv7(),
      employeeId: created.employee.id,
      expectedRevision: created.employee.revision,
      givenNames: created.employee.givenNames,
      familyName: created.employee.familyName,
      position: created.employee.position,
      qualification: created.employee.qualification,
      employmentTermType: 'indefinite' as const,
      expectedEndDate: null,
      fixedTermReasonCode: null,
      workTimeCategory: created.employee.workTimeCategory,
      contractWeeklyMinutes: created.employee.contractWeeklyMinutes,
      entryDate: created.employee.entryDate,
      confirmFixedTermReasonClear: false,
    };

    await expect(
      updatePersonnelEmployee(db, tenant, updateInput, '2026-08-13'),
    ).rejects.toMatchObject<Partial<PersonnelRepositoryError>>({
      code: 'FIXED_TERM_REASON_CLEAR_CONFIRMATION_REQUIRED',
    });

    const updated = await updatePersonnelEmployee(
      db,
      tenant,
      {
        ...updateInput,
        idempotencyKey: uuidv7(),
        confirmFixedTermReasonClear: true,
      },
      '2026-08-13',
    );
    expect(updated.employee).toMatchObject({
      employmentTermType: 'indefinite',
      expectedEndDate: null,
      fixedTermReasonCode: null,
    });
  });

  it('preserves a legacy CDD with missing Wave C facts during an unrelated edit', async () => {
    const legacyEmployeeId = uuidv7();
    await db.insert(personnelEmployeeDossiers).values({
      ...employee(
        legacyEmployeeId,
        organizationAId,
        establishmentAId,
        'Legacy CDD',
      ),
      employmentTermType: 'fixed_term',
      expectedEndDate: '2026-12-31',
      fixedTermReasonCode: null,
      contractWeeklyMinutes: null,
    });
    const tenant = context(organizationAId, establishmentAId);
    const current = await findPersonnelEmployee(
      db,
      tenant,
      legacyEmployeeId,
      '2026-08-13',
    );
    expect(current).not.toBeNull();

    const updated = await updatePersonnelEmployee(
      db,
      tenant,
      {
        idempotencyKey: uuidv7(),
        employeeId: legacyEmployeeId,
        expectedRevision: current!.revision,
        givenNames: current!.givenNames,
        familyName: current!.familyName,
        position: 'Service du soir',
        qualification: current!.qualification,
        employmentTermType: 'fixed_term',
        expectedEndDate: current!.expectedEndDate,
        fixedTermReasonCode: null,
        workTimeCategory: current!.workTimeCategory,
        contractWeeklyMinutes: null,
        entryDate: current!.entryDate,
        confirmFixedTermReasonClear: false,
      },
      '2026-08-13',
    );
    expect(updated.employee).toMatchObject({
      position: 'Service du soir',
      fixedTermReasonCode: null,
      contractWeeklyMinutes: null,
    });
  });

  it('records, derives, replays, and corrects departure without deleting the dossier', async () => {
    const tenant = context(organizationAId, establishmentA2Id);
    const before = await findPersonnelEmployee(
      db,
      tenant,
      employeeA2Id,
      '2026-08-13',
    );
    expect(before).not.toBeNull();
    await expect(
      setPersonnelEmployeeDeparture(
        db,
        tenant,
        {
          idempotencyKey: uuidv7(),
          employeeId: employeeA2Id,
          expectedRevision: before!.revision,
          departureDate: '2025-12-31',
          correctionReason: null,
          confirmNonDeletion: true,
        },
        '2026-08-13',
      ),
    ).rejects.toMatchObject<Partial<PersonnelRepositoryError>>({
      code: 'INVALID_EMPLOYMENT_DATES',
    });

    const recordInput = {
      idempotencyKey: uuidv7(),
      employeeId: employeeA2Id,
      expectedRevision: before!.revision,
      departureDate: '2026-08-13',
      correctionReason: null,
      confirmNonDeletion: true as const,
    };
    const recorded = await setPersonnelEmployeeDeparture(
      db,
      tenant,
      recordInput,
      '2026-08-13',
    );
    const replay = await setPersonnelEmployeeDeparture(
      db,
      tenant,
      recordInput,
      '2026-08-13',
    );
    expect(recorded.employee.view).toBe('active');
    expect(replay.idempotentReplay).toBe(true);
    await expect(
      findPersonnelEmployee(db, tenant, employeeA2Id, '2026-08-14'),
    ).resolves.toMatchObject({ view: 'former' });
    await expect(
      setPersonnelEmployeeDeparture(
        db,
        tenant,
        {
          ...recordInput,
          idempotencyKey: uuidv7(),
          departureDate: '2026-08-14',
        },
        '2026-08-14',
      ),
    ).rejects.toBeInstanceOf(PersonnelConflictError);

    await expect(
      setPersonnelEmployeeDeparture(
        db,
        tenant,
        {
          idempotencyKey: uuidv7(),
          employeeId: employeeA2Id,
          expectedRevision: recorded.employee.revision,
          departureDate: null,
          correctionReason: null,
          confirmNonDeletion: true,
        },
        '2026-08-14',
      ),
    ).rejects.toMatchObject<Partial<PersonnelRepositoryError>>({
      code: 'REASON_REQUIRED',
    });

    const corrected = await setPersonnelEmployeeDeparture(
      db,
      tenant,
      {
        idempotencyKey: uuidv7(),
        employeeId: employeeA2Id,
        expectedRevision: recorded.employee.revision,
        departureDate: null,
        correctionReason: 'Date saisie par erreur.',
        confirmNonDeletion: true,
      },
      '2026-08-14',
    );
    expect(corrected.employee.departureDate).toBeNull();
    expect(corrected.employee.view).toBe('active');

    const audit = await db
      .select()
      .from(personnelEmployeeAuditEvents)
      .where(eq(personnelEmployeeAuditEvents.employeeId, employeeA2Id));
    expect(audit.map((event) => event.eventType).sort()).toEqual([
      'employee.departure_corrected',
      'employee.departure_recorded',
    ]);
    expect(
      audit.find((event) => event.eventType.endsWith('corrected')),
    ).toMatchObject({
      metadata: {
        previousDepartureDate: '2026-08-13',
        newDepartureDate: null,
        reason: 'Date saisie par erreur.',
      },
    });
  });
});

function employee(
  id: string,
  organizationId: string,
  establishmentId: string,
  suffix: string,
) {
  return {
    id,
    organizationId,
    establishmentId,
    givenNames: `Employee ${suffix}`,
    familyName: 'Isolation',
    position: 'Service',
    qualification: 'Employé',
    employmentTermType: 'indefinite' as const,
    expectedEndDate: null,
    fixedTermReasonCode: null,
    workTimeCategory: 'full_time' as const,
    contractWeeklyMinutes: null,
    entryDate: '2026-01-01',
    departureDate: null,
  };
}

function createInput(idempotencyKey: string, familyName: string) {
  return {
    idempotencyKey,
    givenNames: 'Élodie',
    familyName,
    position: 'Cheffe de rang',
    qualification: 'Employée qualifiée',
    employmentTermType: 'indefinite' as const,
    expectedEndDate: null,
    fixedTermReasonCode: null,
    workTimeCategory: 'full_time' as const,
    contractWeeklyMinutes: 2_100,
    entryDate: '2026-08-13',
    confirmDuplicate: false,
    duplicateOverrideReason: null,
  };
}
