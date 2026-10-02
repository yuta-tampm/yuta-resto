import {
  AuthError,
  createSessionToken,
  hashPassword,
  hashSessionToken,
  verifyPassword,
} from '@yuta/auth';
import { config } from 'dotenv';
import { eq } from 'drizzle-orm';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { v7 as uuidv7 } from 'uuid';
import { createAuthRepository } from '../src/auth-repository';
import {
  createCloudDatabaseClient,
  type CloudDatabaseClient,
} from '../src/client';
import {
  authSelectionTickets,
  authSessions,
  establishments,
  organizations,
  passwordResetTokens,
  users,
} from '../src/schema';

config({ path: '.env.test' });
config({ path: '.env.local' });

const integrationTest =
  process.env.CLOUD_DATABASE_URL &&
  process.env.YUTA_ALLOW_DATABASE_INTEGRATION_TESTS === 'true'
    ? describe
    : describe.skip;

integrationTest('atomic password reset', () => {
  let db: CloudDatabaseClient;
  let otherDb: CloudDatabaseClient;
  let originalHash: string;
  let token: string;
  const organizationId = uuidv7();
  const establishmentId = uuidv7();
  const userId = uuidv7();
  const otherUserId = uuidv7();
  const initialVersion = 7;
  const originalPassword = 'Original password for reset test';
  const newPassword = 'Replacement password for reset test';
  const expiresAt = new Date(Date.now() + 60 * 60 * 1_000);

  beforeAll(async () => {
    db = createCloudDatabaseClient(process.env);
    otherDb = createCloudDatabaseClient(process.env);
    originalHash = await hashPassword(originalPassword);
    await db.insert(organizations).values({
      id: organizationId,
      name: 'Password reset test organization',
      slug: `password-reset-${organizationId}`,
    });
    await db.insert(establishments).values({
      id: establishmentId,
      organizationId,
      name: 'Password reset test establishment',
      slug: `password-reset-${establishmentId}`,
    });
    await db.insert(users).values(
      [userId, otherUserId].map((id) => ({
        id,
        authProviderId: `test:${id}`,
        email: `password-reset-${id}@example.test`,
        passwordHash: originalHash,
        authVersion: initialVersion,
      })),
    );
    await db.insert(authSessions).values({
      id: uuidv7(),
      userId: otherUserId,
      organizationId,
      establishmentId,
      tokenHash: hashSessionToken(createSessionToken()),
      authVersion: initialVersion,
      expiresAt,
    });
    await db.insert(authSelectionTickets).values({
      id: uuidv7(),
      userId: otherUserId,
      tokenHash: hashSessionToken(createSessionToken()),
      authVersion: initialVersion,
      expiresAt,
    });
  });

  beforeEach(async () => {
    await db
      .delete(passwordResetTokens)
      .where(eq(passwordResetTokens.userId, userId));
    await db.delete(authSessions).where(eq(authSessions.userId, userId));
    await db
      .delete(authSelectionTickets)
      .where(eq(authSelectionTickets.userId, userId));
    await db
      .update(users)
      .set({ passwordHash: originalHash, authVersion: initialVersion })
      .where(eq(users.id, userId));
    await db.insert(authSessions).values(
      [0, 1].map(() => ({
        id: uuidv7(),
        userId,
        organizationId,
        establishmentId,
        tokenHash: hashSessionToken(createSessionToken()),
        authVersion: initialVersion,
        expiresAt,
      })),
    );
    await db.insert(authSelectionTickets).values(
      [0, 1].map(() => ({
        id: uuidv7(),
        userId,
        tokenHash: hashSessionToken(createSessionToken()),
        authVersion: initialVersion,
        expiresAt,
      })),
    );
    token = await createAuthRepository(db).createPasswordResetToken(userId);
  });

  afterAll(async () => {
    try {
      if (!db) return;
      for (const id of [userId, otherUserId]) {
        await db.delete(users).where(eq(users.id, id));
      }
      await db
        .delete(establishments)
        .where(eq(establishments.id, establishmentId));
      await db
        .delete(organizations)
        .where(eq(organizations.id, organizationId));
    } finally {
      await otherDb?.$client.end({ timeout: 5 });
      await db?.$client.end({ timeout: 5 });
    }
  });

  async function readState(id = userId) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    const tokens = await db
      .select()
      .from(passwordResetTokens)
      .where(eq(passwordResetTokens.userId, id));
    const sessions = await db
      .select()
      .from(authSessions)
      .where(eq(authSessions.userId, id));
    const tickets = await db
      .select()
      .from(authSelectionTickets)
      .where(eq(authSelectionTickets.userId, id));
    return { user, tokens, sessions, tickets };
  }

  async function expectCompletedReset(password: string) {
    const state = await readState();
    expect(state.user?.authVersion).toBe(initialVersion + 1);
    expect(state.user?.passwordHash).not.toBe(originalHash);
    expect(await verifyPassword(password, state.user?.passwordHash ?? '')).toBe(
      true,
    );
    expect(
      await verifyPassword(originalPassword, state.user?.passwordHash ?? ''),
    ).toBe(false);
    expect(state.tokens).toHaveLength(1);
    expect(state.tokens[0]?.consumedAt).toBeInstanceOf(Date);
    expect(state.sessions).toHaveLength(2);
    for (const session of state.sessions)
      expect(session.revokedAt).toBeInstanceOf(Date);
    expect(state.tickets).toHaveLength(0);
  }

  it('resets once, revokes all user sessions and tickets, and leaves another identity unchanged', async () => {
    const otherBefore = await readState(otherUserId);
    await createAuthRepository(db).resetPassword({
      token,
      password: newPassword,
    });
    await expectCompletedReset(newPassword);
    expect(await readState(otherUserId)).toEqual(otherBefore);
  });

  it('rejects a consumed token without another password change or version increment', async () => {
    const repository = createAuthRepository(db);
    await repository.resetPassword({ token, password: newPassword });
    const before = await readState();
    await expect(
      repository.resetPassword({ token, password: originalPassword }),
    ).rejects.toMatchObject({ code: 'RESET_TOKEN_INVALID' });
    expect(await readState()).toEqual(before);
  });

  it.each(['expired', 'unknown'] as const)(
    'rejects an %s token without changing persisted state',
    async (kind) => {
      if (kind === 'expired') {
        await db
          .update(passwordResetTokens)
          .set({ expiresAt: new Date(Date.now() - 60_000) })
          .where(eq(passwordResetTokens.userId, userId));
      }
      const before = await readState();
      await expect(
        createAuthRepository(db).resetPassword({
          token: kind === 'unknown' ? createSessionToken() : token,
          password: newPassword,
        }),
      ).rejects.toMatchObject({ code: 'RESET_TOKEN_INVALID' });
      expect(await readState()).toEqual(before);
    },
  );

  it('allows exactly one concurrent reset across independent database clients', async () => {
    let arrivals = 0;
    let release!: () => void;
    const ready = new Promise<void>((resolve) => {
      release = resolve;
    });
    // Both calls reach the transaction boundary before either can proceed.
    // This also makes the former pre-transaction lookup race deterministic.
    function synchronizedClient(client: CloudDatabaseClient) {
      return new Proxy(client, {
        get(target, property, receiver) {
          if (property === 'transaction') {
            return async (
              ...args: Parameters<CloudDatabaseClient['transaction']>
            ) => {
              arrivals += 1;
              if (arrivals === 2) release();
              await ready;
              return target.transaction(...args);
            };
          }
          return Reflect.get(target, property, receiver);
        },
      });
    }
    const passwords = [newPassword, 'Concurrent alternative password'];
    const results = await Promise.allSettled(
      [db, otherDb].map((client, index) =>
        createAuthRepository(synchronizedClient(client)).resetPassword({
          token,
          password: passwords[index]!,
        }),
      ),
    );
    expect(arrivals).toBe(2);
    expect(
      results.filter((result) => result.status === 'fulfilled'),
    ).toHaveLength(1);
    const rejected = results.filter((result) => result.status === 'rejected');
    expect(rejected).toHaveLength(1);
    expect(rejected[0]?.reason).toBeInstanceOf(AuthError);
    expect(rejected[0]?.reason).toMatchObject({ code: 'RESET_TOKEN_INVALID' });
    const winner = results.findIndex((result) => result.status === 'fulfilled');
    await expectCompletedReset(passwords[winner]!);
    const state = await readState();
    expect(
      await verifyPassword(
        passwords[1 - winner]!,
        state.user?.passwordHash ?? '',
      ),
    ).toBe(false);
  });

  it('rolls back the claim when a subsequent user write fails and permits retry', async () => {
    // PostgreSQL integer overflow fails the user update after the token claim.
    await db
      .update(users)
      .set({ authVersion: 2_147_483_647 })
      .where(eq(users.id, userId));
    const before = await readState();
    await expect(
      createAuthRepository(db).resetPassword({ token, password: newPassword }),
    ).rejects.toMatchObject({ code: '22003' });
    expect(await readState()).toEqual(before);
    expect((await readState()).tokens[0]?.consumedAt).toBeNull();
    await db
      .update(users)
      .set({ authVersion: initialVersion })
      .where(eq(users.id, userId));
    await createAuthRepository(db).resetPassword({
      token,
      password: newPassword,
    });
    await expectCompletedReset(newPassword);
  });
});
