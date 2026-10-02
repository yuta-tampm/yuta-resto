import { config } from 'dotenv';
import { inArray } from 'drizzle-orm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { v7 as uuidv7 } from 'uuid';
import { createAccessAuditRepository } from '../src/access-audit-repository';
import {
  createCloudDatabaseClient,
  type CloudDatabaseClient,
} from '../src/client';
import {
  authAuditEvents,
  establishments,
  organizations,
  users,
} from '../src/schema';

config({ path: '.env.test' });
config({ path: '.env.local' });

const integrationTest =
  process.env.CLOUD_DATABASE_URL &&
  process.env.YUTA_ALLOW_DATABASE_INTEGRATION_TESTS === 'true'
    ? describe
    : describe.skip;

integrationTest('access audit repository integration', () => {
  let db: CloudDatabaseClient;
  const organizationAId = uuidv7();
  const organizationBId = uuidv7();
  const establishmentA1Id = uuidv7();
  const establishmentA2Id = uuidv7();
  const establishmentBId = uuidv7();
  const actorAId = uuidv7();
  const subjectAId = uuidv7();
  const actorBId = uuidv7();
  const subjectBId = uuidv7();
  const organizationIds = [organizationAId, organizationBId];
  const establishmentIds = [
    establishmentA1Id,
    establishmentA2Id,
    establishmentBId,
  ];
  const userIds = [actorAId, subjectAId, actorBId, subjectBId];
  const eventIds = [uuidv7(), uuidv7(), uuidv7(), uuidv7(), uuidv7()];
  const eventTime = new Date('2026-08-13T12:00:00.000Z');

  beforeAll(async () => {
    db = createCloudDatabaseClient(process.env);
    await db.insert(organizations).values([
      {
        id: organizationAId,
        name: 'Access audit organization A',
        slug: `access-audit-a-${organizationAId}`,
      },
      {
        id: organizationBId,
        name: 'Access audit organization B',
        slug: `access-audit-b-${organizationBId}`,
      },
    ]);
    await db.insert(establishments).values([
      {
        id: establishmentA1Id,
        organizationId: organizationAId,
        name: 'Access audit A1',
        slug: `access-audit-a1-${establishmentA1Id}`,
      },
      {
        id: establishmentA2Id,
        organizationId: organizationAId,
        name: 'Access audit A2',
        slug: `access-audit-a2-${establishmentA2Id}`,
      },
      {
        id: establishmentBId,
        organizationId: organizationBId,
        name: 'Access audit B',
        slug: `access-audit-b-${establishmentBId}`,
      },
    ]);
    await db.insert(users).values([
      {
        id: actorAId,
        authProviderId: `access-audit:${actorAId}`,
        displayName: 'Audit actor A',
        email: `actor-a-${actorAId}@example.test`,
      },
      {
        id: subjectAId,
        authProviderId: `access-audit:${subjectAId}`,
        displayName: 'Audit subject A',
        email: `subject-a-${subjectAId}@example.test`,
      },
      {
        id: actorBId,
        authProviderId: `access-audit:${actorBId}`,
        displayName: 'Audit actor B',
        email: `actor-b-${actorBId}@example.test`,
      },
      {
        id: subjectBId,
        authProviderId: `access-audit:${subjectBId}`,
        displayName: 'Audit subject B',
        email: `subject-b-${subjectBId}@example.test`,
      },
    ]);
    await db.insert(authAuditEvents).values([
      {
        id: eventIds[0]!,
        event: 'tenant.membership.updated',
        actorUserId: actorAId,
        subjectUserId: subjectAId,
        organizationId: organizationAId,
        establishmentId: establishmentA1Id,
        metadata: {
          previousRole: 'STAFF',
          previousStatus: 'active',
          role: 'MANAGER',
          status: 'suspended',
          passwordHash: 'sensitive-password-hash',
          token: 'sensitive-token',
          ipHash: 'sensitive-ip-hash',
          userAgent: 'sensitive-user-agent',
        },
        createdAt: eventTime,
      },
      {
        id: eventIds[1]!,
        event: 'tenant.user.created',
        actorUserId: actorAId,
        subjectUserId: subjectAId,
        organizationId: organizationAId,
        metadata: {
          establishmentIds: [establishmentA1Id],
          role: 'STAFF',
        },
        createdAt: eventTime,
      },
      {
        id: eventIds[2]!,
        event: 'tenant.user.attached',
        actorUserId: actorAId,
        subjectUserId: subjectAId,
        organizationId: organizationAId,
        metadata: {
          establishmentIds: [establishmentA1Id],
          role: 'STAFF',
        },
        createdAt: eventTime,
      },
      {
        id: eventIds[3]!,
        event: 'tenant.membership.updated',
        actorUserId: actorAId,
        subjectUserId: subjectAId,
        organizationId: organizationAId,
        establishmentId: establishmentA2Id,
        metadata: { role: 'STAFF', status: 'active' },
        createdAt: eventTime,
      },
      {
        id: eventIds[4]!,
        event: 'tenant.membership.updated',
        actorUserId: actorBId,
        subjectUserId: subjectBId,
        organizationId: organizationBId,
        establishmentId: establishmentBId,
        metadata: { role: 'STAFF', status: 'active' },
        createdAt: eventTime,
      },
    ]);
  });

  afterAll(async () => {
    if (!db) return;
    await db
      .delete(authAuditEvents)
      .where(inArray(authAuditEvents.id, eventIds));
    await db.delete(users).where(inArray(users.id, userIds));
    await db
      .delete(establishments)
      .where(inArray(establishments.id, establishmentIds));
    await db
      .delete(organizations)
      .where(inArray(organizations.id, organizationIds));
    await db.$client.end({ timeout: 5 });
  });

  it('enforces organization and current establishment scope', async () => {
    const repository = createAccessAuditRepository(db);
    const page = await repository.listAccessAuditEvents({
      organizationId: organizationAId,
      allowedEstablishmentIds: [establishmentA1Id],
      pageSize: 20,
    });

    expect(page.items).toHaveLength(3);
    expect(
      page.items.flatMap((item) => item.establishments.map(({ id }) => id)),
    ).toEqual([establishmentA1Id, establishmentA1Id, establishmentA1Id]);
    expect(page.items.every((item) => item.subject.id === subjectAId)).toBe(
      true,
    );

    const crossTenant = await repository.listAccessAuditEvents({
      organizationId: organizationAId,
      allowedEstablishmentIds: [establishmentBId],
    });
    expect(crossTenant.items).toEqual([]);
  });

  it('filters and paginates equal timestamps without duplicates', async () => {
    const repository = createAccessAuditRepository(db);
    const first = await repository.listAccessAuditEvents({
      organizationId: organizationAId,
      allowedEstablishmentIds: [establishmentA1Id],
      subjectUserId: subjectAId,
      pageSize: 2,
    });
    const second = await repository.listAccessAuditEvents({
      organizationId: organizationAId,
      allowedEstablishmentIds: [establishmentA1Id],
      subjectUserId: subjectAId,
      cursor: first.nextCursor ?? undefined,
      pageSize: 2,
    });

    expect(first.items).toHaveLength(2);
    expect(first.nextCursor).not.toBeNull();
    expect(second.items).toHaveLength(1);
    expect(
      new Set([...first.items, ...second.items].map(({ id }) => id)).size,
    ).toBe(3);

    const createdOnly = await repository.listAccessAuditEvents({
      organizationId: organizationAId,
      allowedEstablishmentIds: [establishmentA1Id],
      establishmentId: establishmentA1Id,
      action: 'tenant.user.created',
    });
    expect(createdOnly.items).toHaveLength(1);
    expect(createdOnly.items[0]?.action).toBe('tenant.user.created');
  });

  it('never returns raw or sensitive metadata', async () => {
    const repository = createAccessAuditRepository(db);
    const page = await repository.listAccessAuditEvents({
      organizationId: organizationAId,
      allowedEstablishmentIds: [establishmentA1Id],
    });
    const serialized = JSON.stringify(page);

    expect(serialized).not.toContain('sensitive-password-hash');
    expect(serialized).not.toContain('sensitive-token');
    expect(serialized).not.toContain('sensitive-ip-hash');
    expect(serialized).not.toContain('sensitive-user-agent');
    expect(page.items[0]).not.toHaveProperty('metadata');
  });
});
