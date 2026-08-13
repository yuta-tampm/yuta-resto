import { config } from 'dotenv';
import { and, eq } from 'drizzle-orm';
import type { TenantContext } from '@yuta/tenant';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { v7 as uuidv7 } from 'uuid';
import {
  createCloudDatabaseClient,
  type CloudDatabaseClient,
} from '../src/client';
import {
  findPersonnelEmployee,
  listPersonnelEmployees,
  createPersonnelEmployee,
  PersonnelDuplicateError,
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
    workTimeCategory: 'full_time' as const,
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
    workTimeCategory: 'full_time' as const,
    entryDate: '2026-08-13',
    confirmDuplicate: false,
    duplicateOverrideReason: null,
  };
}
