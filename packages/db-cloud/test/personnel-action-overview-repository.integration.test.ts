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
  listPersonnelActionOverview,
  resolvePersonnelActionTarget,
} from '../src/personnel-action-overview-repository';
import {
  authAuditEvents,
  establishments,
  organizations,
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

integrationTest('personnel action overview repository', () => {
  let db: CloudDatabaseClient;
  const organizationAId = uuidv7();
  const organizationBId = uuidv7();
  const establishmentAId = uuidv7();
  const establishmentBId = uuidv7();
  const actorUserId = uuidv7();
  const correctionIds = Array.from({ length: 7 }, () => uuidv7());
  const departureId = uuidv7();
  const outsideTenantId = uuidv7();

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
          name: 'Action overview A',
          slug: `action-overview-a-${organizationAId}`,
        },
        {
          id: organizationBId,
          name: 'Action overview B',
          slug: `action-overview-b-${organizationBId}`,
        },
      ]);
      await transaction.insert(establishments).values([
        {
          id: establishmentAId,
          organizationId: organizationAId,
          name: 'Action overview A',
          slug: `action-overview-a-${establishmentAId}`,
        },
        {
          id: establishmentBId,
          organizationId: organizationBId,
          name: 'Action overview B',
          slug: `action-overview-b-${establishmentBId}`,
        },
      ]);
      await transaction.insert(users).values({
        id: actorUserId,
        authProviderId: `test:action-overview:${actorUserId}`,
        email: `action-overview-${actorUserId}@example.test`,
        displayName: 'Action overview owner',
      });
      await transaction.insert(personnelEmployeeDossiers).values([
        ...correctionIds.map((id, index) =>
          employee(id, organizationAId, establishmentAId, {
            givenNames: `Correction ${index}`,
            familyName: 'Alpha',
            position: '',
          }),
        ),
        employee(departureId, organizationAId, establishmentAId, {
          givenNames: 'Départ',
          familyName: 'Proche',
          departureDate: '2026-08-22',
        }),
        employee(outsideTenantId, organizationBId, establishmentBId, {
          givenNames: 'Hors',
          familyName: 'Périmètre',
          position: '',
        }),
      ]);
    });
  });

  afterAll(async () => {
    if (!db) return;
    await db
      .delete(authAuditEvents)
      .where(eq(authAuditEvents.actorUserId, actorUserId));
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

  it('returns scoped bounded pages and records one overview consultation', async () => {
    const tenant = context(organizationAId, establishmentAId);
    const first = await listPersonnelActionOverview(
      db,
      tenant,
      {},
      '2026-08-17',
    );
    expect(first.corrections.items).toHaveLength(5);
    expect(first.corrections.pageInfo.hasMore).toBe(true);
    expect(first.corrections.items).not.toContainEqual(
      expect.objectContaining({ employeeId: outsideTenantId }),
    );
    expect(first.departures.items).toEqual([
      expect.objectContaining({
        employeeId: departureId,
        departureDate: '2026-08-22',
      }),
    ]);

    const second = await listPersonnelActionOverview(
      db,
      tenant,
      { correctionCursor: first.corrections.pageInfo.nextCursor ?? undefined },
      '2026-08-17',
    );
    expect(second.corrections.items.length).toBeGreaterThan(0);
    expect(
      new Set(
        [...first.corrections.items, ...second.corrections.items].map(
          (item) => `${item.employeeId}:${item.kind}`,
        ),
      ).size,
    ).toBe(first.corrections.items.length + second.corrections.items.length);

    const audit = await db
      .select()
      .from(authAuditEvents)
      .where(
        and(
          eq(authAuditEvents.actorUserId, actorUserId),
          eq(authAuditEvents.event, 'personnel.action_overview_viewed'),
        ),
      );
    expect(audit).toHaveLength(2);
    expect(audit[0]).toMatchObject({
      organizationId: organizationAId,
      establishmentId: establishmentAId,
      subjectUserId: null,
      metadata: {},
    });
  });

  it('revalidates targets without disclosing another tenant', async () => {
    const tenant = context(organizationAId, establishmentAId);
    await expect(
      resolvePersonnelActionTarget(
        db,
        tenant,
        departureId,
        'departure_within_five_days',
        '2026-08-17',
      ),
    ).resolves.toMatchObject({ status: 'ready' });
    await expect(
      resolvePersonnelActionTarget(
        db,
        tenant,
        outsideTenantId,
        'incomplete_employee_dossier',
        '2026-08-17',
      ),
    ).resolves.toEqual({ status: 'changed', employee: null });
  });
});

function employee(
  id: string,
  organizationId: string,
  establishmentId: string,
  values: {
    givenNames: string;
    familyName: string;
    position?: string;
    departureDate?: string;
  },
) {
  return {
    id,
    organizationId,
    establishmentId,
    givenNames: values.givenNames,
    familyName: values.familyName,
    position: values.position ?? 'Service',
    qualification: 'Employé',
    employmentTermType: 'indefinite' as const,
    expectedEndDate: null,
    fixedTermReasonCode: null,
    workTimeCategory: 'full_time' as const,
    contractWeeklyMinutes: null,
    entryDate: '2026-01-01',
    departureDate: values.departureDate ?? null,
  };
}
