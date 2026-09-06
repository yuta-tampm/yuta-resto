import { config } from 'dotenv';
import { and, eq, inArray } from 'drizzle-orm';
import type { TenantContext } from '@yuta/tenant';
import type {
  PersonnelEmployeeSummary,
  PersonnelHistoryClassification,
  PersonnelHistoryMutationGroupMetadata,
  PersonnelHistorySemanticGroup,
} from '@yuta/contracts/personnel';
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
  listPersonnelEmployeeUnifiedHistory,
  listPersonnelEmployees,
  createPersonnelEmployee,
  PersonnelDuplicateError,
  PersonnelConflictError,
  PersonnelRepositoryError,
  recordPersonnelEmployeeAccess,
  recordPersonnelContractExtractionAudit,
  setPersonnelEmployeeDeparture,
  updatePersonnelEmployee,
  validatePersonnelContractExtractionReviewGrant,
} from '../src/personnel-repository';
import { runPersonnelHistoryCutover } from '../src/personnel-history-cutover';
import {
  establishments,
  organizations,
  personnelCommandReceipts,
  personnelEmployeeAuditEvents,
  personnelEmployeeDossiers,
  personnelEmployeeHistoryEvents,
  personnelEmployeeHistoryGroupChanges,
  personnelHistoryCutovers,
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
      {
        view: 'active',
        search: '',
        completeness: 'all',
        sort: 'entry_date_desc',
        limit: 25,
      },
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
        {
          view: 'active',
          search: '',
          completeness: 'all',
          sort: 'entry_date_desc',
          limit: 25,
        },
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
          sort: 'entry_date_desc',
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
          sort: 'entry_date_desc',
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

  it('sorts and paginates the complete scoped result set', async () => {
    const employeeIds = [uuidv7(), uuidv7(), uuidv7()];
    await db.insert(personnelEmployeeDossiers).values([
      {
        ...employee(
          employeeIds[0],
          organizationAId,
          establishmentA2Id,
          'Sort 1',
        ),
        familyName: 'Martin',
        givenNames: 'Alice',
        position: 'Cuisine',
      },
      {
        ...employee(
          employeeIds[1],
          organizationAId,
          establishmentA2Id,
          'Sort 2',
        ),
        familyName: 'Bernard',
        givenNames: 'Zoé',
        position: 'Salle',
      },
      {
        ...employee(
          employeeIds[2],
          organizationAId,
          establishmentA2Id,
          'Sort 3',
        ),
        familyName: 'Martin',
        givenNames: 'Zoé',
        position: 'Bar',
      },
    ]);

    try {
      const firstPage = await listPersonnelEmployees(
        db,
        context(organizationAId, establishmentA2Id),
        {
          view: 'active',
          search: '',
          completeness: 'all',
          sort: 'name_asc',
          limit: 2,
        },
        '2026-08-13',
      );
      expect(firstPage.items.map((item) => item.familyName)).toEqual([
        'Bernard',
        'Isolation',
      ]);
      expect(firstPage.pageInfo.hasMore).toBe(true);
      expect(firstPage.pageInfo.nextCursor).not.toBeNull();

      const secondPage = await listPersonnelEmployees(
        db,
        context(organizationAId, establishmentA2Id),
        {
          view: 'active',
          search: '',
          completeness: 'all',
          sort: 'name_asc',
          cursor: firstPage.pageInfo.nextCursor ?? undefined,
          limit: 2,
        },
        '2026-08-13',
      );
      expect(
        secondPage.items.map((item) => `${item.familyName} ${item.givenNames}`),
      ).toEqual(['Martin Alice', 'Martin Zoé']);
      expect(secondPage.pageInfo.hasMore).toBe(false);

      const byPosition = await listPersonnelEmployees(
        db,
        context(organizationAId, establishmentA2Id),
        {
          view: 'active',
          search: '',
          completeness: 'all',
          sort: 'position_desc',
          limit: 25,
        },
        '2026-08-13',
      );
      expect(byPosition.items.map((item) => item.position)).toEqual([
        'Service',
        'Salle',
        'Cuisine',
        'Bar',
      ]);

      await expect(
        listPersonnelEmployees(
          db,
          context(organizationAId, establishmentA2Id),
          {
            view: 'active',
            search: '',
            completeness: 'all',
            sort: 'name_desc',
            cursor: firstPage.pageInfo.nextCursor ?? undefined,
            limit: 2,
          },
          '2026-08-13',
        ),
      ).rejects.toMatchObject({ code: 'INVALID_CURSOR' });
    } finally {
      await db
        .delete(personnelEmployeeDossiers)
        .where(inArray(personnelEmployeeDossiers.id, employeeIds));
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

  it('records minimized extraction outcomes once and denies another establishment', async () => {
    const tenant = context(organizationAId, establishmentAId);
    const requestId = uuidv7();
    const documentId = uuidv7();
    const input = {
      employeeId: employeeAId,
      requestId,
      documentId,
      documentVersion: 2,
      eventType: 'employee.contract_extraction_completed' as const,
      outcomeCode: 'complete' as const,
      suggestionCount: 3,
    };
    await recordPersonnelContractExtractionAudit(db, tenant, input);
    await recordPersonnelContractExtractionAudit(db, tenant, input);
    await expect(
      recordPersonnelContractExtractionAudit(
        db,
        context(organizationAId, establishmentA2Id),
        input,
      ),
    ).rejects.toMatchObject({ code: 'NOT_FOUND' });

    const events = await db
      .select({
        eventType: personnelEmployeeAuditEvents.eventType,
        changedFields: personnelEmployeeAuditEvents.changedFields,
        metadata: personnelEmployeeAuditEvents.metadata,
      })
      .from(personnelEmployeeAuditEvents)
      .where(
        and(
          eq(personnelEmployeeAuditEvents.organizationId, organizationAId),
          eq(personnelEmployeeAuditEvents.establishmentId, establishmentAId),
          eq(personnelEmployeeAuditEvents.employeeId, employeeAId),
          eq(personnelEmployeeAuditEvents.operationId, requestId),
          eq(
            personnelEmployeeAuditEvents.eventType,
            'employee.contract_extraction_completed',
          ),
        ),
      );
    expect(events).toEqual([
      {
        eventType: 'employee.contract_extraction_completed',
        changedFields: [],
        metadata: {
          documentId,
          documentVersion: 2,
          outcomeCode: 'complete',
          suggestionCount: 3,
        },
      },
    ]);
    expect(JSON.stringify(events)).not.toContain('Chef de rang');
    expect(JSON.stringify(events)).not.toContain('excerpt');
    await expect(
      validatePersonnelContractExtractionReviewGrant(db, tenant, {
        employeeId: employeeAId,
        requestId,
        documentId,
        documentVersion: 2,
        outcomeCode: 'complete',
      }),
    ).resolves.toBe('valid');
    await expect(
      validatePersonnelContractExtractionReviewGrant(db, tenant, {
        employeeId: employeeAId,
        requestId,
        documentId: uuidv7(),
        documentVersion: 2,
        outcomeCode: 'complete',
      }),
    ).resolves.toBe('not_found');
    await expect(
      validatePersonnelContractExtractionReviewGrant(
        db,
        context(organizationAId, establishmentA2Id),
        {
          employeeId: employeeAId,
          requestId,
          documentId,
          documentVersion: 2,
          outcomeCode: 'complete',
        },
      ),
    ).resolves.toBe('not_found');

    const expiredRequestId = uuidv7();
    await db.insert(personnelEmployeeAuditEvents).values({
      id: uuidv7(),
      organizationId: organizationAId,
      establishmentId: establishmentAId,
      employeeId: employeeAId,
      actorUserId,
      eventType: 'employee.contract_extraction_completed',
      operationId: expiredRequestId,
      changedFields: [],
      metadata: {
        documentId,
        documentVersion: 2,
        outcomeCode: 'complete',
        suggestionCount: 3,
      },
      createdAt: new Date('2026-08-18T09:00:00.000Z'),
    });
    await expect(
      validatePersonnelContractExtractionReviewGrant(
        db,
        tenant,
        {
          employeeId: employeeAId,
          requestId: expiredRequestId,
          documentId,
          documentVersion: 2,
          outcomeCode: 'complete',
        },
        new Date('2026-08-18T09:15:00.001Z'),
      ),
    ).resolves.toBe('expired');
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
    const extractionAuditContext = {
      requestId: uuidv7(),
      documentId: uuidv7(),
      documentVersion: 1,
      selectedFields: ['position', 'contractWeeklyMinutes'] as Array<
        'position' | 'contractWeeklyMinutes'
      >,
    };
    const updated = await updatePersonnelEmployee(
      db,
      tenant,
      input,
      '2026-08-13',
      new Date(),
      extractionAuditContext,
    );
    const replay = await updatePersonnelEmployee(
      db,
      tenant,
      input,
      '2026-08-13',
      new Date(),
      extractionAuditContext,
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
            'employee.contract_extraction_applied',
          ]),
        ),
      );
    expect(audit.map((event) => event.eventType).sort()).toEqual([
      'employee.contract_extraction_applied',
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

integrationTest('F07 reconstructable Personnel history service', () => {
  let db: CloudDatabaseClient;
  const organizationId = uuidv7();
  const establishmentId = uuidv7();
  const otherEstablishmentId = uuidv7();
  const actorUserId = uuidv7();
  const baselineEmployeeId = uuidv7();
  const tenant: TenantContext = {
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

  beforeAll(async () => {
    db = createCloudDatabaseClient(process.env);
    await db.insert(organizations).values({
      id: organizationId,
      name: 'F07 test organization',
      slug: `f07-${organizationId}`,
    });
    await db.insert(establishments).values([
      {
        id: establishmentId,
        organizationId,
        name: 'F07 establishment',
        slug: `f07-${establishmentId}`,
      },
      {
        id: otherEstablishmentId,
        organizationId,
        name: 'F07 other establishment',
        slug: `f07-${otherEstablishmentId}`,
      },
    ]);
    await db.insert(users).values({
      id: actorUserId,
      authProviderId: `test:f07:${actorUserId}`,
      email: `f07-${actorUserId}@example.test`,
      displayName: 'F07 owner',
    });
    await db
      .insert(personnelEmployeeDossiers)
      .values(
        employee(
          baselineEmployeeId,
          organizationId,
          establishmentId,
          'F07 baseline',
        ),
      );
    await runPersonnelHistoryCutover(db, tenant);
  });

  afterAll(async () => {
    if (!db) return;
    await db
      .delete(personnelEmployeeHistoryGroupChanges)
      .where(
        eq(personnelEmployeeHistoryGroupChanges.organizationId, organizationId),
      );
    await db
      .delete(personnelEmployeeHistoryEvents)
      .where(eq(personnelEmployeeHistoryEvents.organizationId, organizationId));
    await db
      .delete(personnelHistoryCutovers)
      .where(eq(personnelHistoryCutovers.organizationId, organizationId));
    await db
      .delete(personnelCommandReceipts)
      .where(eq(personnelCommandReceipts.organizationId, organizationId));
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

  it('records a multi-group mutation atomically and preserves replay, fingerprint, and revision semantics', async () => {
    const created = await createF07Employee(db, tenant, 'Multi group');
    const idempotencyKey = uuidv7();
    const input = {
      ...updateFrom(created.employee),
      idempotencyKey,
      givenNames: 'Camille Marie',
      position: 'Responsable de salle',
      workTimeCategory: 'part_time' as const,
      contractWeeklyMinutes: 1_500,
      historyMetadata: [
        metadata('identity', 'correction', null, null),
        metadata('role', 'change', '2026-08-01', null),
        metadata(
          'work_time',
          'correction',
          null,
          'Durée contractuelle mal saisie.',
        ),
      ],
    };
    const committedAt = new Date('2026-08-13T10:00:00.000Z');
    const updated = await updatePersonnelEmployee(
      db,
      tenant,
      input,
      '2026-08-13',
      committedAt,
    );
    const replay = await updatePersonnelEmployee(
      db,
      tenant,
      input,
      '2026-08-13',
      committedAt,
    );
    expect(updated.updated).toBe(true);
    expect(replay.idempotentReplay).toBe(true);

    const events = await db
      .select()
      .from(personnelEmployeeHistoryEvents)
      .where(
        eq(personnelEmployeeHistoryEvents.employeeId, created.employee.id),
      );
    expect(events).toHaveLength(1);
    const groups = await db
      .select()
      .from(personnelEmployeeHistoryGroupChanges)
      .where(
        eq(
          personnelEmployeeHistoryGroupChanges.employeeId,
          created.employee.id,
        ),
      );
    expect(groups.map((group) => group.semanticGroup).sort()).toEqual([
      'identity',
      'role',
      'work_time',
    ]);
    expect(
      groups.find((group) => group.semanticGroup === 'identity'),
    ).toMatchObject({
      previousValues: expect.objectContaining({
        givenNames: created.employee.givenNames,
      }),
      newValues: expect.objectContaining({ givenNames: 'Camille Marie' }),
    });
    const compatibilityAudit = await db
      .select()
      .from(personnelEmployeeAuditEvents)
      .where(
        and(
          eq(personnelEmployeeAuditEvents.employeeId, created.employee.id),
          inArray(personnelEmployeeAuditEvents.eventType, [
            'employee.identity_updated',
            'employee.employment_updated',
          ]),
        ),
      );
    expect(compatibilityAudit).toHaveLength(2);
    expect(
      new Set(compatibilityAudit.map((event) => event.operationId)),
    ).toEqual(new Set([events[0]!.operationId]));
    const receipts = await db
      .select()
      .from(personnelCommandReceipts)
      .where(
        and(
          eq(personnelCommandReceipts.employeeId, created.employee.id),
          eq(personnelCommandReceipts.commandType, 'personnel.employee.update'),
        ),
      );
    expect(receipts).toHaveLength(1);

    const noOp = await updatePersonnelEmployee(
      db,
      tenant,
      {
        ...updateFrom(updated.employee),
        idempotencyKey: uuidv7(),
      },
      '2026-08-13',
      committedAt,
    );
    expect(noOp).toMatchObject({ updated: false, idempotentReplay: false });
    expect(
      await db
        .select()
        .from(personnelEmployeeHistoryEvents)
        .where(
          eq(personnelEmployeeHistoryEvents.employeeId, created.employee.id),
        ),
    ).toHaveLength(1);

    await expect(
      updatePersonnelEmployee(
        db,
        tenant,
        { ...input, familyName: 'Different request' },
        '2026-08-13',
        committedAt,
      ),
    ).rejects.toMatchObject<Partial<PersonnelRepositoryError>>({
      code: 'IDEMPOTENCY_CONFLICT',
    });
    await expect(
      updatePersonnelEmployee(
        db,
        tenant,
        { ...input, idempotencyKey: uuidv7(), position: 'Direction' },
        '2026-08-13',
      ),
    ).rejects.toBeInstanceOf(PersonnelConflictError);

    const unified = await listPersonnelEmployeeUnifiedHistory(
      db,
      tenant,
      created.employee.id,
    );
    expect(
      unified.items.filter((item) => item.kind === 'mutation'),
    ).toHaveLength(1);
    expect(
      unified.items.filter(
        (item) =>
          item.kind === 'legacy' &&
          (item.eventType === 'employee.identity_updated' ||
            item.eventType === 'employee.employment_updated'),
      ),
    ).toHaveLength(0);
    expect(JSON.stringify(unified)).not.toMatch(
      /organizationId|establishmentId|employeeId|operationId|payloadVersion|previousRevision|newRevision/u,
    );
  });

  it('rejects one invalid group before any dossier, history, audit, or receipt write', async () => {
    const created = await createF07Employee(db, tenant, 'Invalid group');
    const idempotencyKey = uuidv7();
    await expect(
      updatePersonnelEmployee(
        db,
        tenant,
        {
          ...updateFrom(created.employee),
          idempotencyKey,
          givenNames: 'Corrected name',
          position: 'Future role',
          historyMetadata: [
            metadata('identity', 'correction', null, null),
            metadata('role', 'change', '2026-08-14', null),
          ],
        },
        '2026-08-13',
      ),
    ).rejects.toMatchObject<Partial<PersonnelRepositoryError>>({
      code: 'PERSONNEL_HISTORY_METADATA_INVALID',
    });
    await expect(
      findPersonnelEmployee(db, tenant, created.employee.id, '2026-08-13'),
    ).resolves.toMatchObject({
      givenNames: created.employee.givenNames,
      position: created.employee.position,
      revision: created.employee.revision,
    });
    const f07 = await db
      .select()
      .from(personnelEmployeeHistoryEvents)
      .where(
        eq(personnelEmployeeHistoryEvents.employeeId, created.employee.id),
      );
    expect(f07).toHaveLength(0);
    const receipt = await db
      .select()
      .from(personnelCommandReceipts)
      .where(
        and(
          eq(personnelCommandReceipts.employeeId, created.employee.id),
          eq(personnelCommandReceipts.commandType, 'personnel.employee.update'),
        ),
      );
    expect(receipt).toHaveLength(0);
    const compatibilityAudit = await db
      .select()
      .from(personnelEmployeeAuditEvents)
      .where(
        and(
          eq(personnelEmployeeAuditEvents.employeeId, created.employee.id),
          inArray(personnelEmployeeAuditEvents.eventType, [
            'employee.identity_updated',
            'employee.employment_updated',
          ]),
        ),
      );
    expect(compatibilityAudit).toHaveLength(0);
  });

  it('rolls the dossier back when the required F07 history write fails', async () => {
    const created = await createF07Employee(db, tenant, 'Rollback');
    const missingActorTenant: TenantContext = {
      ...tenant,
      actor: {
        type: 'user',
        userId: uuidv7(),
        membershipId: uuidv7(),
        role: 'OWNER',
      },
    };
    await expect(
      updatePersonnelEmployee(
        db,
        missingActorTenant,
        {
          ...updateFrom(created.employee),
          idempotencyKey: uuidv7(),
          position: 'Must roll back',
          historyMetadata: [metadata('role', 'change', '2026-08-13', null)],
        },
        '2026-08-13',
      ),
    ).rejects.toBeDefined();
    await expect(
      findPersonnelEmployee(db, tenant, created.employee.id, '2026-08-13'),
    ).resolves.toMatchObject({
      position: created.employee.position,
      revision: created.employee.revision,
    });
    expect(
      await db
        .select()
        .from(personnelEmployeeHistoryEvents)
        .where(
          eq(personnelEmployeeHistoryEvents.employeeId, created.employee.id),
        ),
    ).toHaveLength(0);
    expect(
      await db
        .select()
        .from(personnelCommandReceipts)
        .where(
          and(
            eq(personnelCommandReceipts.employeeId, created.employee.id),
            eq(
              personnelCommandReceipts.commandType,
              'personnel.employee.update',
            ),
          ),
        ),
    ).toHaveLength(0);
    expect(
      await db
        .select()
        .from(personnelEmployeeAuditEvents)
        .where(
          and(
            eq(personnelEmployeeAuditEvents.employeeId, created.employee.id),
            inArray(personnelEmployeeAuditEvents.eventType, [
              'employee.identity_updated',
              'employee.employment_updated',
            ]),
          ),
        ),
    ).toHaveLength(0);
  });

  it('keeps departure record, correction, cancellation, and unified deduplication compatible', async () => {
    const created = await createF07Employee(db, tenant, 'Departure');
    const recordInput = {
      idempotencyKey: uuidv7(),
      employeeId: created.employee.id,
      expectedRevision: created.employee.revision,
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
    await expect(
      setPersonnelEmployeeDeparture(db, tenant, recordInput, '2026-08-13'),
    ).resolves.toMatchObject({ idempotentReplay: true });
    await expect(
      setPersonnelEmployeeDeparture(
        db,
        tenant,
        {
          ...recordInput,
          idempotencyKey: uuidv7(),
          expectedRevision: recorded.employee.revision,
          departureDate: null,
          correctionReason: null,
        },
        '2026-08-14',
      ),
    ).rejects.toMatchObject<Partial<PersonnelRepositoryError>>({
      code: 'REASON_REQUIRED',
    });
    const cancelled = await setPersonnelEmployeeDeparture(
      db,
      tenant,
      {
        ...recordInput,
        idempotencyKey: uuidv7(),
        expectedRevision: recorded.employee.revision,
        departureDate: null,
        correctionReason: 'Départ enregistré par erreur.',
      },
      '2026-08-14',
    );
    expect(cancelled.employee.departureDate).toBeNull();
    const history = await listPersonnelEmployeeUnifiedHistory(
      db,
      tenant,
      created.employee.id,
    );
    const mutations = history.items.filter((item) => item.kind === 'mutation');
    expect(mutations).toHaveLength(2);
    expect(mutations[0]).toMatchObject({
      groups: [
        {
          semanticGroup: 'departure',
          classification: 'correction',
          previousValues: { departureDate: '2026-08-13' },
          newValues: { departureDate: null },
          correctionReason: 'Départ enregistré par erreur.',
        },
      ],
    });
    expect(
      history.items.filter(
        (item) =>
          item.kind === 'legacy' &&
          item.eventType.startsWith('employee.departure'),
      ),
    ).toHaveLength(0);
  });

  it('fails closed across establishment scope and for corrupt payloads', async () => {
    const baseline = await listPersonnelEmployeeUnifiedHistory(
      db,
      tenant,
      baselineEmployeeId,
    );
    expect(baseline.items).toEqual([
      expect.objectContaining({
        kind: 'cutover_baseline',
        actorDisplayName: null,
        groups: expect.any(Array),
      }),
    ]);
    expect(
      baseline.items[0]?.kind === 'cutover_baseline'
        ? baseline.items[0].groups
        : [],
    ).toHaveLength(6);

    await expect(
      updatePersonnelEmployee(
        db,
        { ...tenant, establishmentId: otherEstablishmentId },
        {
          ...updateFrom(
            (await findPersonnelEmployee(
              db,
              tenant,
              baselineEmployeeId,
              '2026-08-13',
            ))!,
          ),
          idempotencyKey: uuidv7(),
          position: 'Forbidden',
          historyMetadata: [metadata('role', 'change', '2026-08-13', null)],
        },
        '2026-08-13',
      ),
    ).rejects.toMatchObject<Partial<PersonnelRepositoryError>>({
      code: 'NOT_FOUND',
    });

    const created = await createF07Employee(db, tenant, 'Corrupt payload');
    await updatePersonnelEmployee(
      db,
      tenant,
      {
        ...updateFrom(created.employee),
        idempotencyKey: uuidv7(),
        position: 'New role',
        historyMetadata: [metadata('role', 'change', '2026-08-13', null)],
      },
      '2026-08-13',
    );
    await db
      .update(personnelEmployeeHistoryGroupChanges)
      .set({
        newValues: {
          payloadVersion: 2,
          position: 'Corrupt',
          qualification: 'Corrupt',
        },
      })
      .where(
        eq(
          personnelEmployeeHistoryGroupChanges.employeeId,
          created.employee.id,
        ),
      );
    await expect(
      listPersonnelEmployeeUnifiedHistory(db, tenant, created.employee.id),
    ).rejects.toBeDefined();
  });

  it('preserves a stable newest-50 window and truncation', async () => {
    const created = await createF07Employee(db, tenant, 'Newest 50');
    const base = new Date('2026-09-04T12:00:00.000Z').getTime();
    await db.insert(personnelEmployeeAuditEvents).values(
      Array.from({ length: 51 }, (_, index) => ({
        id: uuidv7(),
        organizationId,
        establishmentId,
        employeeId: created.employee.id,
        actorUserId,
        eventType: 'employee.employment_updated',
        operationId: uuidv7(),
        changedFields: ['position'],
        createdAt: new Date(base + index),
      })),
    );
    const history = await listPersonnelEmployeeUnifiedHistory(
      db,
      tenant,
      created.employee.id,
    );
    expect(history.items).toHaveLength(50);
    expect(history.truncated).toBe(true);
    expect(history.items[0]?.occurredAt).toBe(
      new Date(base + 50).toISOString(),
    );
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

function createF07Employee(
  db: CloudDatabaseClient,
  tenant: TenantContext,
  label: string,
) {
  return createPersonnelEmployee(
    db,
    tenant,
    {
      ...createInput(uuidv7(), `${label} ${uuidv7()}`),
      givenNames: 'Camille',
      entryDate: '2026-01-01',
    },
    '2026-08-13',
  );
}

function updateFrom(employee: PersonnelEmployeeSummary) {
  return {
    idempotencyKey: uuidv7(),
    employeeId: employee.id,
    expectedRevision: employee.revision,
    givenNames: employee.givenNames,
    familyName: employee.familyName,
    position: employee.position,
    qualification: employee.qualification,
    employmentTermType: employee.employmentTermType,
    expectedEndDate: employee.expectedEndDate,
    fixedTermReasonCode: employee.fixedTermReasonCode,
    workTimeCategory: employee.workTimeCategory,
    contractWeeklyMinutes: employee.contractWeeklyMinutes,
    entryDate: employee.entryDate,
    confirmFixedTermReasonClear: false,
  };
}

function metadata(
  semanticGroup: PersonnelHistorySemanticGroup,
  classification: PersonnelHistoryClassification,
  effectiveDate: string | null,
  correctionReason: string | null,
): PersonnelHistoryMutationGroupMetadata {
  return {
    semanticGroup,
    classification,
    effectiveDate,
    correctionReason,
  };
}
