import { createHash, randomUUID } from 'node:crypto';
import { generatePointageContinuation, hashPassword } from '@yuta/auth';
import { eq } from 'drizzle-orm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createAuthRepository } from '../src/auth-repository';
import {
  authLoginAttempts,
  authSelectionTickets,
  authSessions,
  establishments,
  organizations,
  tenantMemberships,
  users,
} from '../src/schema';
import { openPointageTestClient } from './helpers/pointage-raw-clocking-test-database';

// Execution requires separately admitted, already-migrated isolated provenance.
// This suite never loads dotenv, provisions, migrates, or repairs a target.
const integration =
  process.env.YUTA_POINTAGE_SYNTHETIC_TEST_MODE === 'true'
    ? describe
    : describe.skip;
integration('A1.2 CLOUD_AUTH / A1.2 MEMBERSHIP real cloud repository', () => {
  let client: Awaited<ReturnType<typeof openPointageTestClient>> | undefined;
  let repository: ReturnType<typeof createAuthRepository>;
  const organizationId = randomUUID(),
    userId = randomUUID();
  const establishmentIds = [randomUUID(), randomUUID()];
  const membershipIds = [randomUUID(), randomUUID()];
  const email = `a12-${userId}@example.test`;
  const password = `synthetic-password-${randomUUID()}`;
  const wrong = generatePointageContinuation();
  const rateLimitKeyHash = createHash('sha256').update(userId).digest('hex');
  let validToken: string;
  let validTicket: string;
  const login = (secret: string) =>
    repository.signIn({
      email,
      password: secret,
      rateLimitKeyHash,
      ipHash: null,
      userAgent: null,
    });
  const snapshot = async () => {
    const db = client!.db;
    return {
      sessions: await db
        .select()
        .from(authSessions)
        .where(eq(authSessions.userId, userId)),
      tickets: await db
        .select()
        .from(authSelectionTickets)
        .where(eq(authSelectionTickets.userId, userId)),
      memberships: await db
        .select()
        .from(tenantMemberships)
        .where(eq(tenantMemberships.userId, userId)),
    };
  };
  beforeAll(async () => {
    client = await openPointageTestClient(
      process.env,
      process.env.CLOUD_DATABASE_URL!,
    );
    const db = client.db;
    repository = createAuthRepository(db);
    await db.insert(organizations).values({
      id: organizationId,
      name: 'A1.2 disposable',
      slug: `a12-${organizationId}`,
    });
    await db.insert(establishments).values(
      establishmentIds.map((id, i) => ({
        id,
        organizationId,
        name: `A1.2 ${i}`,
        slug: `a12-${id}`,
      })),
    );
    await db.insert(users).values({
      id: userId,
      authProviderId: `test:${userId}`,
      email,
      displayName: 'Synthetic A1.2',
      passwordHash: await hashPassword(password),
      emailVerifiedAt: new Date(),
    });
    await db.insert(tenantMemberships).values(
      membershipIds.map((id, i) => ({
        id,
        userId,
        organizationId,
        establishmentId: establishmentIds[i]!,
        role: 'OWNER' as const,
      })),
    );
    const first = await login(password);
    if (first.type !== 'SELECTION_REQUIRED')
      throw new Error('Synthetic selection control failed.');
    validToken = (
      await repository.activateSelection({
        selectionToken: first.selectionToken,
        membershipId: membershipIds[0]!,
      })
    ).token;
    const second = await login(password);
    if (second.type !== 'SELECTION_REQUIRED')
      throw new Error('Synthetic ticket control failed.');
    validTicket = second.selectionToken;
  });
  afterAll(async () => {
    if (!client) return;
    const { db, connection } = client;
    try {
      await db
        .delete(authLoginAttempts)
        .where(eq(authLoginAttempts.keyHash, rateLimitKeyHash));
      await db.delete(authSessions).where(eq(authSessions.userId, userId));
      await db
        .delete(authSelectionTickets)
        .where(eq(authSelectionTickets.userId, userId));
      await db
        .delete(tenantMemberships)
        .where(eq(tenantMemberships.userId, userId));
      await db.delete(users).where(eq(users.id, userId));
      for (const id of establishmentIds)
        await db.delete(establishments).where(eq(establishments.id, id));
      await db
        .delete(organizations)
        .where(eq(organizations.id, organizationId));
    } finally {
      await connection.end();
    }
  });
  it('A1.2 CLOUD_AUTH rejects continuation password without authority writes', async () => {
    const before = await snapshot();
    await expect(login(wrong)).rejects.toMatchObject({
      code: 'INVALID_CREDENTIALS',
    });
    expect(await snapshot()).toEqual(before);
  });
  it('A1.2 CLOUD_AUTH rejects continuation session identifier with a legitimate positive control', async () => {
    const before = await snapshot();
    expect(await repository.findSession(wrong)).toBeNull();
    expect(await snapshot()).toEqual(before);
    expect(await repository.findSession(validToken)).toMatchObject({
      userId,
      organizationId,
      establishmentId: establishmentIds[0],
    });
  });
  it('A1.2 MEMBERSHIP rejects wrong session without revocation, rotation or scope change', async () => {
    const before = await snapshot();
    await expect(
      repository.switchTenant({
        token: wrong,
        membershipId: membershipIds[1]!,
      }),
    ).rejects.toMatchObject({ code: 'SESSION_INVALID' });
    expect(await snapshot()).toEqual(before);
    expect(await repository.findSession(validToken)).toMatchObject({
      establishmentId: establishmentIds[0],
    });
  });
  it('A1.2 MEMBERSHIP rejects wrong selection without consuming the legitimate ticket', async () => {
    const before = await snapshot();
    await expect(
      repository.activateSelection({
        selectionToken: wrong,
        membershipId: membershipIds[1]!,
      }),
    ).rejects.toMatchObject({ code: 'SELECTION_TICKET_INVALID' });
    expect(await snapshot()).toEqual(before);
    // The real ticket still works: no always-deny repository double is used.
    expect(
      (
        await repository.activateSelection({
          selectionToken: validTicket,
          membershipId: membershipIds[1]!,
        })
      ).session,
    ).toMatchObject({ userId, establishmentId: establishmentIds[1] });
  });
});
