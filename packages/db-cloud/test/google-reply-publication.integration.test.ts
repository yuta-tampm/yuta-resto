import { and, eq, sql } from 'drizzle-orm';
import { v7 as uuidv7 } from 'uuid';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import type { TenantContext } from '@yuta/tenant';
import {
  createCloudDatabaseClient,
  type CloudDatabaseClient,
} from '../src/client';
import {
  prepareGoogleReplyPublication,
  claimGoogleReplyPublication,
  executeGoogleReplyPublication,
  reconcileGoogleReplyPublication,
  findGoogleReplyPublicationReceipt,
} from '../src/google-reply-publication-repository';
import { saveFeedbackReplyDraft } from '../src/reputation-repository';
import {
  purgeGoogleReviewCache,
  listDueGoogleReviewCacheScopes,
  updateCapturedGoogleConnectorAccessToken,
} from '../src/google-review-retrieval-repository';
import {
  authSessions,
  establishments,
  feedbackItems,
  feedbackReplies,
  feedbackInternalNotes,
  googleReplyPublications,
  googleReviewCache,
  organizations,
  reputationConnectors,
  tenantEntitlements,
  tenantMemberships,
  users,
} from '../src/schema';

const identity = 'yuta_google_reply_publication_test';
const refusal = 'Google reply disposable database target refused.';
const now = new Date('2030-01-01T12:00:00Z');
const clock = () => now;
function configuration(env: NodeJS.ProcessEnv) {
  if (
    env.NODE_ENV !== 'test' ||
    env.VERCEL !== undefined ||
    env.YUTA_ALLOW_DATABASE_INTEGRATION_TESTS !== 'true' ||
    env.YUTA_ALLOW_GOOGLE_REPLY_PUBLICATION_TESTS !== 'true' ||
    env.CLOUD_DATABASE_SSL !== 'false' ||
    !env.CLOUD_DATABASE_URL ||
    /[\s\\]/u.test(env.CLOUD_DATABASE_URL)
  )
    throw Error(refusal);
  const target = new URL(env.CLOUD_DATABASE_URL);
  const authority = /^postgres(?:ql)?:\/\/([^/?#]+)\//u.exec(
    env.CLOUD_DATABASE_URL,
  )?.[1];
  if (
    !['postgres:', 'postgresql:'].includes(target.protocol) ||
    target.hostname !== '127.0.0.1' ||
    target.port !== '54340' ||
    authority?.slice(authority.lastIndexOf('@') + 1) !== target.host ||
    target.username !== identity ||
    !target.password ||
    target.pathname !== `/${identity}` ||
    target.search ||
    target.hash
  )
    throw Error(refusal);
  return env;
}
describe('Google reply integration admission', () => {
  const allowed = {
    NODE_ENV: 'test',
    YUTA_ALLOW_DATABASE_INTEGRATION_TESTS: 'true',
    YUTA_ALLOW_GOOGLE_REPLY_PUBLICATION_TESTS: 'true',
    CLOUD_DATABASE_SSL: 'false',
    CLOUD_DATABASE_URL: `postgres://${identity}:synthetic@127.0.0.1:54340/${identity}`,
  };
  it('rejects local persistent/remote/ambiguous databases before connecting', () => {
    expect(configuration(allowed)).toBe(allowed);
    for (const value of [
      `postgres://${identity}:synthetic@127.0.0.1:56431/yuta_cloud`,
      `postgres://${identity}:synthetic@localhost:54340/${identity}`,
      `postgres://${identity}:synthetic@remote.example:54340/${identity}`,
      allowed.CLOUD_DATABASE_URL + '?sslmode=require',
    ])
      expect(() =>
        configuration({ ...allowed, CLOUD_DATABASE_URL: value }),
      ).toThrow(refusal);
    for (const override of [
      { NODE_ENV: 'production' },
      { VERCEL: '' },
      { YUTA_ALLOW_DATABASE_INTEGRATION_TESTS: undefined },
      { YUTA_ALLOW_GOOGLE_REPLY_PUBLICATION_TESTS: undefined },
      { CLOUD_DATABASE_SSL: 'true' },
    ])
      expect(() => configuration({ ...allowed, ...override })).toThrow(refusal);
  });
});
const integration =
  process.env.YUTA_ALLOW_DATABASE_INTEGRATION_TESTS === 'true' &&
  process.env.YUTA_ALLOW_GOOGLE_REPLY_PUBLICATION_TESTS === 'true'
    ? describe
    : describe.skip;
type Fixture = {
  context: TenantContext;
  sessionId: string;
  connectorId: string;
  feedbackId: string;
  replyId: string;
  userId: string;
  membershipId: string;
  organizationId: string;
  establishmentId: string;
};
integration('persisted Google reply publication fences', () => {
  let db: CloudDatabaseClient;
  beforeAll(async () => {
    db = createCloudDatabaseClient(configuration(process.env));
    const [actual] = await db.execute<{
      database_name: string;
      user_name: string;
    }>(
      sql`select current_database() as database_name, current_user as user_name`,
    );
    if (actual?.database_name !== identity || actual.user_name !== identity)
      throw Error(refusal);
  });
  afterAll(async () => {
    if (db) await db.$client.end();
  });
  async function fixture(
    role: 'OWNER' | 'MANAGER' | 'STAFF' = 'OWNER',
  ): Promise<Fixture> {
    const organizationId = uuidv7(),
      establishmentId = uuidv7(),
      userId = uuidv7(),
      membershipId = uuidv7(),
      sessionId = uuidv7(),
      connectorId = uuidv7(),
      feedbackId = uuidv7(),
      replyId = uuidv7();
    await db.insert(organizations).values({
      id: organizationId,
      name: 'Synthetic publication org',
      slug: organizationId,
    });
    await db.insert(establishments).values({
      id: establishmentId,
      organizationId,
      name: 'Synthetic restaurant',
      slug: establishmentId,
    });
    await db.insert(users).values({
      id: userId,
      authProviderId: `synthetic:${userId}`,
      email: `${userId}@example.test`,
      displayName: 'Synthetic actor',
      authVersion: 0,
    });
    await db.insert(tenantMemberships).values({
      id: membershipId,
      userId,
      organizationId,
      establishmentId,
      role,
      status: 'active',
    });
    await db.insert(tenantEntitlements).values({
      organizationId,
      establishmentId,
      key: 'reputation.enabled',
      enabled: true,
    });
    await db.insert(authSessions).values({
      id: sessionId,
      userId,
      organizationId,
      establishmentId,
      tokenHash: sessionId.replaceAll('-', '').repeat(2),
      authVersion: 0,
      expiresAt: new Date(now.getTime() + 86400_000),
    });
    await db.insert(reputationConnectors).values({
      id: connectorId,
      organizationId,
      establishmentId,
      provider: 'GOOGLE',
      bindingGeneration: 1,
      status: 'CONNECTED',
      externalAccountId: 'accounts/synthetic',
      externalLocationId: `locations/${connectorId}`,
      encryptedAccessToken: 'synthetic',
      tokenExpiresAt: new Date(now.getTime() - 1000),
    });
    await db.insert(feedbackItems).values({
      id: feedbackId,
      organizationId,
      establishmentId,
      source: 'GOOGLE',
      type: 'PUBLIC_REVIEW',
      googleImporterOwned: true,
      status: 'FOLLOW_UP',
      assignedToUserId: userId,
    });
    await db.insert(googleReviewCache).values({
      id: uuidv7(),
      organizationId,
      establishmentId,
      feedbackItemId: feedbackId,
      connectorId,
      bindingGeneration: 1,
      externalLocationId: `locations/${connectorId}`,
      reviewName: `accounts/synthetic/locations/${connectorId}/reviews/${feedbackId}`,
      fetchedAt: now,
      expiresAt: new Date(now.getTime() + 29 * 86400_000),
      referenceExpiresAt: new Date(now.getTime() + 30 * 86400_000),
    });
    await db.insert(feedbackReplies).values({
      id: replyId,
      organizationId,
      feedbackItemId: feedbackId,
      content: 'Synthetic exact text',
      status: 'DRAFT',
      createdByUserId: userId,
    });
    await db.insert(feedbackInternalNotes).values({
      id: uuidv7(),
      organizationId,
      feedbackItemId: feedbackId,
      content: 'Independent synthetic note',
      createdByUserId: userId,
    });
    const context: TenantContext = {
      organizationId,
      establishmentId,
      actor: { type: 'user', userId, membershipId, role },
      locale: 'fr-FR',
      timezone: 'Europe/Paris',
      entitlements: new Set(['reputation.enabled']),
    };
    return {
      context,
      sessionId,
      connectorId,
      feedbackId,
      replyId,
      userId,
      membershipId,
      organizationId,
      establishmentId,
    };
  }
  function input(f: Fixture) {
    return { feedbackId: f.feedbackId, replyId: f.replyId, revision: 1 };
  }
  async function preview(f: Fixture) {
    return prepareGoogleReplyPublication(
      db,
      f.context,
      f.sessionId,
      input(f),
      async () => ({ fingerprint: 'a'.repeat(64), remoteReply: null }),
      clock,
    );
  }
  async function claim(f: Fixture) {
    const p = await preview(f);
    const c = await claimGoogleReplyPublication(
      db,
      f.context,
      f.sessionId,
      p.attemptId,
      clock,
    );
    expect(c.claimed).toBe(true);
    return p;
  }
  async function result(
    f: Fixture,
    id: string,
    state:
      | 'UNCERTAIN'
      | 'UNCONFIRMED'
      | 'APPROVED'
      | 'PENDING'
      | 'REJECTED'
      | 'FAILED',
  ) {
    return executeGoogleReplyPublication(
      db,
      f.context,
      f.sessionId,
      id,
      async () => ({ state, errorCategory: null }),
      clock,
    );
  }
  it('rejects cross-tenant UUIDs and STAFF before remote callbacks', async () => {
    const own = await fixture(),
      foreign = await fixture(),
      staff = await fixture('STAFF');
    const remote = vi.fn();
    for (const f of [foreign, staff])
      await expect(
        prepareGoogleReplyPublication(
          db,
          f.context,
          f.sessionId,
          input(own),
          remote,
          clock,
        ),
      ).rejects.toThrow();
    expect(remote).not.toHaveBeenCalled();
    await expect(
      prepareGoogleReplyPublication(
        db,
        { ...own.context, establishmentId: foreign.establishmentId },
        own.sessionId,
        input(own),
        remote,
        clock,
      ),
    ).rejects.toThrow();
  });
  it('denies another actor, another session and replacement login before credentials', async () => {
    const f = await fixture();
    const p = await preview(f);
    const replacement = uuidv7();
    await db.insert(authSessions).values({
      id: replacement,
      userId: f.userId,
      organizationId: f.organizationId,
      establishmentId: f.establishmentId,
      tokenHash: replacement.replaceAll('-', '').repeat(2),
      authVersion: 0,
      expiresAt: new Date(now.getTime() + 86400_000),
    });
    await expect(
      claimGoogleReplyPublication(
        db,
        f.context,
        replacement,
        p.attemptId,
        clock,
      ),
    ).rejects.toMatchObject({ code: 'STALE_AUTHORITY' });
    const other = await fixture('MANAGER');
    const localMembershipId = uuidv7();
    await db.insert(tenantMemberships).values({
      id: localMembershipId,
      userId: other.userId,
      organizationId: f.organizationId,
      establishmentId: f.establishmentId,
      role: 'MANAGER',
      status: 'active',
    });
    await db
      .update(authSessions)
      .set({
        organizationId: f.organizationId,
        establishmentId: f.establishmentId,
      })
      .where(eq(authSessions.id, other.sessionId));
    const permittedOther: TenantContext = {
      ...f.context,
      actor: {
        type: 'user',
        userId: other.userId,
        membershipId: localMembershipId,
        role: 'MANAGER',
      },
    };
    await expect(
      claimGoogleReplyPublication(
        db,
        permittedOther,
        other.sessionId,
        p.attemptId,
        clock,
      ),
    ).rejects.toMatchObject({ code: 'STALE_AUTHORITY' });
    await expect(
      claimGoogleReplyPublication(
        db,
        other.context,
        other.sessionId,
        p.attemptId,
        clock,
      ),
    ).rejects.toThrow();
    await db
      .update(authSessions)
      .set({ revokedAt: now })
      .where(eq(authSessions.id, f.sessionId));
    await expect(
      claimGoogleReplyPublication(
        db,
        f.context,
        f.sessionId,
        p.attemptId,
        clock,
      ),
    ).rejects.toThrow();
  });
  it('invalidates changed versions, expired previews, removed entitlements and changed binding', async () => {
    const f = await fixture();
    const p = await preview(f);
    await saveFeedbackReplyDraft(
      db,
      f.context,
      {
        feedbackId: f.feedbackId,
        content: 'New exact text',
        actorUserId: f.userId,
      },
      { requiredSource: 'GOOGLE' },
    );
    await expect(
      claimGoogleReplyPublication(
        db,
        f.context,
        f.sessionId,
        p.attemptId,
        clock,
      ),
    ).rejects.toMatchObject({ code: 'VERSION_CHANGED' });
    const exp = await fixture();
    const expired = await preview(exp);
    await expect(
      claimGoogleReplyPublication(
        db,
        exp.context,
        exp.sessionId,
        expired.attemptId,
        () => new Date(now.getTime() + 300_001),
      ),
    ).rejects.toMatchObject({ code: 'PREVIEW_EXPIRED' });
    const bind = await fixture();
    const old = await preview(bind);
    await db
      .update(reputationConnectors)
      .set({ bindingGeneration: 2 })
      .where(eq(reputationConnectors.id, bind.connectorId));
    await expect(
      claimGoogleReplyPublication(
        db,
        bind.context,
        bind.sessionId,
        old.attemptId,
        clock,
      ),
    ).rejects.toThrow();
    const ent = await fixture();
    const e = await preview(ent);
    await db
      .update(tenantEntitlements)
      .set({ enabled: false })
      .where(eq(tenantEntitlements.organizationId, ent.organizationId));
    await expect(
      claimGoogleReplyPublication(
        db,
        ent.context,
        ent.sessionId,
        e.attemptId,
        clock,
      ),
    ).rejects.toThrow();
  });
  it('claims concurrent/replayed confirmations once', async () => {
    const f = await fixture();
    const p = await preview(f);
    const claims = await Promise.all([
      claimGoogleReplyPublication(
        db,
        f.context,
        f.sessionId,
        p.attemptId,
        clock,
      ),
      claimGoogleReplyPublication(
        db,
        f.context,
        f.sessionId,
        p.attemptId,
        clock,
      ),
    ]);
    expect(claims.filter((c) => c.claimed)).toHaveLength(1);
    const write = vi.fn(async () => ({
      state: 'PENDING' as const,
      errorCategory: null,
    }));
    await Promise.all([
      executeGoogleReplyPublication(
        db,
        f.context,
        f.sessionId,
        p.attemptId,
        write,
        clock,
      ),
      executeGoogleReplyPublication(
        db,
        f.context,
        f.sessionId,
        p.attemptId,
        write,
        clock,
      ),
    ]);
    expect(write).toHaveBeenCalledTimes(1);
  });
  it('reports local preview expiry after claim without inventing remote change or invoking dispatch', async () => {
    const f = await fixture();
    const p = await preview(f);
    await claimGoogleReplyPublication(
      db,
      f.context,
      f.sessionId,
      p.attemptId,
      () => new Date(now.getTime() + 299_000),
    );
    const remote = vi.fn();
    const receipt = await executeGoogleReplyPublication(
      db,
      f.context,
      f.sessionId,
      p.attemptId,
      remote,
      () => new Date(now.getTime() + 301_000),
    );
    expect(receipt).toMatchObject({
      state: 'FAILED',
      errorCategory: 'PREVIEW_EXPIRED',
    });
    expect(remote).not.toHaveBeenCalled();
  });
  it('admits MANAGER but denies revoked authority before dispatch callbacks', async () => {
    const manager = await fixture('MANAGER');
    const allowed = await claim(manager);
    expect((await result(manager, allowed.attemptId, 'PENDING')).state).toBe(
      'PENDING',
    );
    for (const kind of [
      'session',
      'membership',
      'role',
      'authVersion',
    ] as const) {
      const f = await fixture();
      const p = await claim(f);
      const remote = vi.fn();
      if (kind === 'session')
        await db
          .update(authSessions)
          .set({ revokedAt: now })
          .where(eq(authSessions.id, f.sessionId));
      if (kind === 'membership')
        await db
          .update(tenantMemberships)
          .set({ status: 'suspended' })
          .where(eq(tenantMemberships.id, f.membershipId));
      if (kind === 'role')
        await db
          .update(tenantMemberships)
          .set({ role: 'STAFF' })
          .where(eq(tenantMemberships.id, f.membershipId));
      if (kind === 'authVersion')
        await db
          .update(users)
          .set({ authVersion: 1 })
          .where(eq(users.id, f.userId));
      await expect(
        executeGoogleReplyPublication(
          db,
          f.context,
          f.sessionId,
          p.attemptId,
          remote,
          clock,
        ),
      ).rejects.toThrow();
      expect(remote).not.toHaveBeenCalled();
    }
  }, 15_000);
  it('serializes session revocation with an admitted bounded callback', async () => {
    const f = await fixture();
    const p = await claim(f);
    let enter!: () => void, release!: () => void;
    const entered = new Promise<void>((resolve) => {
      enter = resolve;
    });
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    const sending = executeGoogleReplyPublication(
      db,
      f.context,
      f.sessionId,
      p.attemptId,
      async () => {
        enter();
        await gate;
        return { state: 'PENDING', errorCategory: null };
      },
      clock,
    );
    await entered;
    let revoked = false;
    const revoking = db
      .update(authSessions)
      .set({ revokedAt: now })
      .where(eq(authSessions.id, f.sessionId))
      .then(() => {
        revoked = true;
      });
    try {
      await new Promise((resolve) => setTimeout(resolve, 25));
      expect(revoked).toBe(false);
    } finally {
      release();
    }
    expect((await sending).state).toBe('PENDING');
    await revoking;
    const remote = vi.fn();
    await expect(
      reconcileGoogleReplyPublication(
        db,
        f.context,
        f.sessionId,
        p.attemptId,
        remote,
        clock,
      ),
    ).rejects.toThrow();
    expect(remote).not.toHaveBeenCalled();
  }, 15_000);
  it('preserves claimed text and creates independent newer Save', async () => {
    const f = await fixture();
    const p = await claim(f);
    const newer = await saveFeedbackReplyDraft(
      db,
      f.context,
      {
        feedbackId: f.feedbackId,
        content: 'Independent new draft',
        actorUserId: f.userId,
      },
      { requiredSource: 'GOOGLE' },
    );
    expect(newer.id).not.toBe(f.replyId);
    await result(f, p.attemptId, 'APPROVED');
    const [old] = await db
      .select()
      .from(feedbackReplies)
      .where(eq(feedbackReplies.id, f.replyId));
    const [fresh] = await db
      .select()
      .from(feedbackReplies)
      .where(eq(feedbackReplies.id, newer.id));
    expect(old?.content).toBe('Synthetic exact text');
    expect(old?.status).toBe('PUBLISHED');
    expect(fresh?.status).toBe('DRAFT');
    expect(fresh?.content).toBe('Independent new draft');
  });
  it.each(['UNCERTAIN', 'UNCONFIRMED'] as const)(
    'keeps %s fenced across Save/failed observation and only explicit same-version retry',
    async (state) => {
      const f = await fixture();
      const p = await claim(f);
      await result(f, p.attemptId, state);
      const newer = await saveFeedbackReplyDraft(
        db,
        f.context,
        {
          feedbackId: f.feedbackId,
          content: 'New unrelated version',
          actorUserId: f.userId,
        },
        { requiredSource: 'GOOGLE' },
      );
      await expect(
        prepareGoogleReplyPublication(
          db,
          f.context,
          f.sessionId,
          {
            feedbackId: f.feedbackId,
            replyId: newer.id,
            revision: newer.revision,
          },
          async () => ({ fingerprint: 'a'.repeat(64), remoteReply: null }),
          clock,
        ),
      ).rejects.toMatchObject({ code: 'UNRESOLVED' });
      await expect(
        prepareGoogleReplyPublication(
          db,
          f.context,
          f.sessionId,
          { ...input(f), retryParentId: p.attemptId },
          async () => ({ fingerprint: 'a'.repeat(64), remoteReply: null }),
          clock,
        ),
      ).rejects.toMatchObject({ code: 'RECONCILE_REQUIRED' });
      const reconciled = await reconcileGoogleReplyPublication(
        db,
        f.context,
        f.sessionId,
        p.attemptId,
        async () => null,
        clock,
      );
      expect(reconciled.state).toBe(state);
      const retry = await prepareGoogleReplyPublication(
        db,
        f.context,
        f.sessionId,
        { ...input(f), retryParentId: p.attemptId },
        async () => ({ fingerprint: 'b'.repeat(64), remoteReply: null }),
        clock,
      );
      expect(
        (
          await claimGoogleReplyPublication(
            db,
            f.context,
            f.sessionId,
            retry.attemptId,
            clock,
          )
        ).claimed,
      ).toBe(true);
      expect(
        (
          await claimGoogleReplyPublication(
            db,
            f.context,
            f.sessionId,
            retry.attemptId,
            clock,
          )
        ).claimed,
      ).toBe(false);
      await result(f, retry.attemptId, 'FAILED');
      await expect(
        prepareGoogleReplyPublication(
          db,
          f.context,
          f.sessionId,
          {
            feedbackId: f.feedbackId,
            replyId: newer.id,
            revision: newer.revision,
          },
          async () => ({ fingerprint: 'a'.repeat(64), remoteReply: null }),
          clock,
        ),
      ).rejects.toMatchObject({ code: 'UNRESOLVED' });
    },
  );
  it('projects crash/expired lease uncertain and requires GET reconciliation', async () => {
    const f = await fixture();
    const p = await claim(f);
    const later = () => new Date(now.getTime() + 120_001);
    expect(
      (
        await findGoogleReplyPublicationReceipt(
          db,
          f.context,
          f.feedbackId,
          later(),
        )
      )?.state,
    ).toBe('UNCERTAIN');
    const remote = vi.fn(async () => ({
      state: 'PENDING' as const,
      errorCategory: null,
    }));
    await reconcileGoogleReplyPublication(
      db,
      f.context,
      f.sessionId,
      p.attemptId,
      remote,
      later,
    );
    expect(remote).toHaveBeenCalledTimes(1);
    const [attempt] = await db
      .select()
      .from(googleReplyPublications)
      .where(eq(googleReplyPublications.id, p.attemptId));
    expect(attempt?.state).toBe('PENDING');
  });
  it.each(['PENDING', 'REJECTED', 'UNCONFIRMED'] as const)(
    'never marks a %s reply PUBLISHED',
    async (state) => {
      const f = await fixture();
      const p = await claim(f);
      await result(f, p.attemptId, state);
      const [reply] = await db
        .select()
        .from(feedbackReplies)
        .where(eq(feedbackReplies.id, f.replyId));
      expect(reply?.status).not.toBe('PUBLISHED');
      const [work] = await db
        .select()
        .from(feedbackItems)
        .where(eq(feedbackItems.id, f.feedbackId));
      expect(work?.status).toBe('FOLLOW_UP');
      expect(work?.assignedToUserId).toBe(f.userId);
    },
  );
  it('serializes distinct-review expired-token refresh on exclusive connector lock', async () => {
    const f = await fixture();
    const secondId = uuidv7(),
      secondReply = uuidv7();
    await db.insert(feedbackItems).values({
      id: secondId,
      organizationId: f.organizationId,
      establishmentId: f.establishmentId,
      source: 'GOOGLE',
      type: 'PUBLIC_REVIEW',
      googleImporterOwned: true,
    });
    await db.insert(feedbackReplies).values({
      id: secondReply,
      organizationId: f.organizationId,
      feedbackItemId: secondId,
      content: 'Second synthetic text',
    });
    await db.insert(googleReviewCache).values({
      id: uuidv7(),
      organizationId: f.organizationId,
      establishmentId: f.establishmentId,
      feedbackItemId: secondId,
      connectorId: f.connectorId,
      bindingGeneration: 1,
      externalLocationId: `locations/${f.connectorId}`,
      reviewName: `accounts/synthetic/locations/${f.connectorId}/reviews/${secondId}`,
      fetchedAt: now,
      expiresAt: new Date(now.getTime() + 29 * 86400_000),
      referenceExpiresAt: new Date(now.getTime() + 30 * 86400_000),
    });
    let inFlight = 0,
      max = 0;
    const refresh = async (
      transaction: Parameters<
        typeof updateCapturedGoogleConnectorAccessToken
      >[0],
      target: Parameters<
        Parameters<typeof prepareGoogleReplyPublication>[4]
      >[1],
    ) => {
      inFlight++;
      max = Math.max(max, inFlight);
      await updateCapturedGoogleConnectorAccessToken(
        transaction,
        f.context,
        target.binding,
        {
          encryptedAccessToken: 'synthetic-refreshed',
          tokenExpiresAt: new Date(now.getTime() + 3600_000),
        },
      );
      inFlight--;
      return { fingerprint: 'a'.repeat(64), remoteReply: null };
    };
    await Promise.all([
      prepareGoogleReplyPublication(
        db,
        f.context,
        f.sessionId,
        input(f),
        refresh,
        clock,
      ),
      prepareGoogleReplyPublication(
        db,
        f.context,
        f.sessionId,
        { feedbackId: secondId, replyId: secondReply, revision: 1 },
        refresh,
        clock,
      ),
    ]);
    expect(max).toBe(1);
  });
  it('cleanup clears temporary previews/references while preserving drafts/notes/work', async () => {
    const f = await fixture();
    const p = await preview(f);
    const scope = {
      organizationId: f.organizationId,
      establishmentId: f.establishmentId,
    };
    const workBefore = await db
      .select()
      .from(feedbackItems)
      .where(eq(feedbackItems.id, f.feedbackId));
    const draftsBefore = await db
      .select()
      .from(feedbackReplies)
      .where(eq(feedbackReplies.id, f.replyId));
    const notesBefore = await db
      .select()
      .from(feedbackInternalNotes)
      .where(eq(feedbackInternalNotes.feedbackItemId, f.feedbackId));
    const due = new Date(now.getTime() + 300_001);
    expect(
      await listDueGoogleReviewCacheScopes(db, { now: due, limit: 100 }),
    ).toContainEqual(scope);
    await purgeGoogleReviewCache(db, scope, { now: due, limit: 500 });
    const [previewRow] = await db
      .select()
      .from(googleReplyPublications)
      .where(eq(googleReplyPublications.id, p.attemptId));
    expect(previewRow?.remoteFingerprint).toBeNull();
    await purgeGoogleReviewCache(db, scope, {
      now: new Date(now.getTime() + 30 * 86400_000 + 1),
      limit: 500,
    });
    await expect(preview(f)).rejects.toMatchObject({ code: 'NO_REFERENCE' });
    expect(
      await db
        .select()
        .from(feedbackItems)
        .where(eq(feedbackItems.id, f.feedbackId)),
    ).toEqual(workBefore);
    expect(
      await db
        .select()
        .from(feedbackReplies)
        .where(eq(feedbackReplies.id, f.replyId)),
    ).toEqual(draftsBefore);
    expect(
      await db
        .select()
        .from(feedbackInternalNotes)
        .where(eq(feedbackInternalNotes.feedbackItemId, f.feedbackId)),
    ).toEqual(notesBefore);
  });
  it('enforces scoped draft FK and positive revisions in the database', async () => {
    const f = await fixture(),
      foreign = await fixture();
    const p = await preview(f);
    const [row] = await db
      .select()
      .from(googleReplyPublications)
      .where(eq(googleReplyPublications.id, p.attemptId));
    await expect(
      db
        .insert(googleReplyPublications)
        .values({ ...row!, id: uuidv7(), replyId: foreign.replyId }),
    ).rejects.toThrow();
    await expect(
      db
        .update(feedbackReplies)
        .set({ revision: 0 })
        .where(
          and(
            eq(feedbackReplies.organizationId, f.organizationId),
            eq(feedbackReplies.id, f.replyId),
          ),
        ),
    ).rejects.toThrow();
  });
});
