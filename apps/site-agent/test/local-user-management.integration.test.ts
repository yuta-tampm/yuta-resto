import type { LocalAuthSession } from '@yuta/contracts/local-pos';
import {
  createPosDatabaseClient,
  type PosDatabaseClient,
} from '@yuta/db-pos/client';
import { localUsers } from '@yuta/db-pos/schema';
import { config } from 'dotenv';
import { and, eq, inArray, notInArray } from 'drizzle-orm';
import { v7 as uuidv7 } from 'uuid';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createLocalUserManagementService } from '../src/services/local-user-management-service';

config({ path: '.env.test' });
config({ path: '.env.local' });

const integrationTest =
  process.env.POS_DATABASE_URL &&
  process.env.YUTA_ALLOW_DATABASE_INTEGRATION_TESTS === 'true'
    ? describe
    : describe.skip;

integrationTest('local user management integration', () => {
  let db: PosDatabaseClient;
  const adminOneId = uuidv7();
  const adminTwoId = uuidv7();
  const managerId = uuidv7();
  const staffId = uuidv7();
  const createdIds: string[] = [];
  const fixtureIds = [adminOneId, adminTwoId, managerId, staffId];

  beforeAll(async () => {
    db = createPosDatabaseClient(process.env);
    await db.insert(localUsers).values([
      { id: adminOneId, name: 'Integration Admin One', role: 'admin' },
      { id: adminTwoId, name: 'Integration Admin Two', role: 'admin' },
      { id: managerId, name: 'Integration Manager', role: 'manager' },
      { id: staffId, name: 'Integration Staff', role: 'staff' },
    ]);
  });

  afterAll(async () => {
    if (!db) return;
    await db
      .delete(localUsers)
      .where(inArray(localUsers.id, [...fixtureIds, ...createdIds]));
    await db.$client.end({ timeout: 5 });
  });

  it('enforces manager role limits and normalized unique email persistence', async () => {
    const service = createLocalUserManagementService(db);
    const manager = session(managerId, 'manager');

    await expect(
      service.createLocalUser(manager, {
        name: 'Forbidden Admin',
        email: null,
        role: 'admin',
        pin: '2468',
      }),
    ).rejects.toMatchObject({ code: 'LOCAL_USER_MANAGEMENT_FORBIDDEN' });

    const created = await service.createLocalUser(manager, {
      name: 'Managed Kitchen',
      email: '  KITCHEN.INTEGRATION@EXAMPLE.COM ',
      role: 'kitchen',
      pin: '2468',
    });
    createdIds.push(created.user.id);
    expect(created.user).toMatchObject({
      email: 'kitchen.integration@example.com',
      role: 'kitchen',
      isActive: true,
    });

    await expect(
      service.updateLocalUser(manager, staffId, { role: 'admin' }),
    ).rejects.toMatchObject({ code: 'LOCAL_USER_MANAGEMENT_FORBIDDEN' });

    await expect(
      service.updateLocalUser(session(adminOneId, 'admin'), staffId, {
        email: 'kitchen.integration@example.com',
      }),
    ).rejects.toMatchObject({ code: 'LOCAL_USER_EMAIL_CONFLICT' });
  });

  it('serializes concurrent last-admin deactivation and keeps one active admin', async () => {
    const service = createLocalUserManagementService(db);
    const actor = session(adminOneId, 'admin');
    const externalActiveAdmins = await db
      .select({ id: localUsers.id })
      .from(localUsers)
      .where(
        and(
          eq(localUsers.role, 'admin'),
          eq(localUsers.isActive, true),
          notInArray(localUsers.id, [adminOneId, adminTwoId]),
        ),
      );
    const externalIds = externalActiveAdmins.map(({ id }) => id);

    try {
      if (externalIds.length > 0) {
        await db
          .update(localUsers)
          .set({ isActive: false })
          .where(inArray(localUsers.id, externalIds));
      }

      const results = await Promise.allSettled([
        service.updateLocalUser(actor, adminOneId, { isActive: false }),
        service.updateLocalUser(actor, adminTwoId, { isActive: false }),
      ]);

      expect(
        results.filter((result) => result.status === 'fulfilled'),
      ).toHaveLength(1);
      expect(
        results.filter((result) => result.status === 'rejected'),
      ).toHaveLength(1);
      expect(
        results.find((result) => result.status === 'rejected'),
      ).toMatchObject({ reason: { code: 'LAST_ACTIVE_ADMIN_REQUIRED' } });

      const admins = await db
        .select({ isActive: localUsers.isActive })
        .from(localUsers)
        .where(inArray(localUsers.id, [adminOneId, adminTwoId]));
      expect(admins.filter(({ isActive }) => isActive)).toHaveLength(1);
    } finally {
      if (externalIds.length > 0) {
        await db
          .update(localUsers)
          .set({ isActive: true })
          .where(inArray(localUsers.id, externalIds));
      }
    }
  });

  it('hashes reset PINs and increments authVersion for session invalidation', async () => {
    const service = createLocalUserManagementService(db);
    const before = await db.query.localUsers.findFirst({
      where: eq(localUsers.id, staffId),
    });

    await service.resetLocalUserPin(session(adminOneId, 'admin'), staffId, {
      pin: '8642',
    });

    const after = await db.query.localUsers.findFirst({
      where: eq(localUsers.id, staffId),
    });
    expect(after?.pinHash).toBeTruthy();
    expect(after?.pinHash).not.toBe('8642');
    expect(after?.authVersion).toBe((before?.authVersion ?? 0) + 1);
  });
});

function session(
  userId: string,
  role: LocalAuthSession['user']['role'],
): LocalAuthSession {
  return {
    id: uuidv7(),
    user: {
      id: userId,
      name: `Integration ${role}`,
      email: null,
      role,
      isActive: true,
    },
    expiresAt: new Date(Date.now() + 60_000).toISOString(),
  };
}
