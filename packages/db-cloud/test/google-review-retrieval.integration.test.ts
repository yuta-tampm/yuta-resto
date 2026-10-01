import { feedbackListQuerySchema } from '@yuta/contracts/reputation';
import type { TenantContext } from '@yuta/tenant';
import { and, eq, inArray } from 'drizzle-orm';
import { v7 as uuidv7 } from 'uuid';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  createCloudDatabaseClient,
  type CloudDatabaseClient,
} from '../src/client';
import {
  beginGoogleReviewRetrieval,
  commitGoogleReviewRetrieval,
  failGoogleReviewRetrieval,
  findCapturedGoogleConnectorCredentials,
  findGoogleReviewRetrievalSummary,
  listDueGoogleReviewCacheScopes,
  purgeGoogleReviewCache,
  updateCapturedGoogleConnectorAccessToken,
  type GoogleReviewImportRecord,
} from '../src/google-review-retrieval-repository';
import {
  findFeedbackDetail,
  listFeedback,
  type FeedbackScopeOptions,
} from '../src/reputation-repository';
import {
  authSessions,
  establishments,
  feedbackInternalNotes,
  feedbackItems,
  feedbackReplies,
  googleReviewCache,
  googleReviewRetrievalStates,
  organizations,
  reputationAuditEvents,
  reputationConnectors,
  tenantEntitlements,
  tenantMemberships,
  users,
} from '../src/schema';

const disposableIdentity = 'yuta_google_review_import_test';
const refusal = 'Google review import disposable database target refused.';
const now = new Date('2030-01-01T12:00:00.000Z');
const day = 24 * 60 * 60 * 1_000;

// No dotenv fallback, provisioning or migrations run from this suite.
function requireGoogleReviewTestConfiguration(environment: NodeJS.ProcessEnv) {
  if (
    environment.NODE_ENV !== 'test' ||
    environment.VERCEL !== undefined ||
    environment.YUTA_ALLOW_DATABASE_INTEGRATION_TESTS !== 'true' ||
    environment.YUTA_ALLOW_GOOGLE_REVIEW_IMPORT_TESTS !== 'true' ||
    environment.CLOUD_DATABASE_SSL !== 'false' ||
    !environment.CLOUD_DATABASE_URL ||
    /[\s\\]/u.test(environment.CLOUD_DATABASE_URL)
  ) {
    throw new Error(refusal);
  }
  let target: URL;
  try {
    target = new URL(environment.CLOUD_DATABASE_URL);
  } catch {
    throw new Error(refusal);
  }
  const rawAuthority = /^postgres(?:ql)?:\/\/([^/?#]+)\//u.exec(
    environment.CLOUD_DATABASE_URL,
  )?.[1];
  const rawHost = rawAuthority?.slice(rawAuthority.lastIndexOf('@') + 1);
  if (
    !['postgres:', 'postgresql:'].includes(target.protocol) ||
    target.hostname !== '127.0.0.1' ||
    target.port !== '54339' ||
    rawHost !== target.host ||
    target.username !== disposableIdentity ||
    !target.password ||
    target.pathname !== `/${disposableIdentity}` ||
    target.search ||
    target.hash
  ) {
    throw new Error(refusal);
  }
  return environment;
}

describe('Google review import disposable database admission', () => {
  const allowed: NodeJS.ProcessEnv = {
    NODE_ENV: 'test',
    YUTA_ALLOW_DATABASE_INTEGRATION_TESTS: 'true',
    YUTA_ALLOW_GOOGLE_REVIEW_IMPORT_TESTS: 'true',
    CLOUD_DATABASE_SSL: 'false',
    CLOUD_DATABASE_URL: `postgres://${disposableIdentity}:synthetic@127.0.0.1:54339/${disposableIdentity}`,
  };

  it('requires explicit task flags and the exact disposable target', () => {
    expect(requireGoogleReviewTestConfiguration(allowed)).toBe(allowed);
    for (const override of [
      { YUTA_ALLOW_DATABASE_INTEGRATION_TESTS: undefined },
      { YUTA_ALLOW_GOOGLE_REVIEW_IMPORT_TESTS: undefined },
      { NODE_ENV: 'production' },
      { VERCEL: '' },
      { CLOUD_DATABASE_SSL: 'true' },
      { CLOUD_DATABASE_URL: undefined },
    ]) {
      expect(() =>
        requireGoogleReviewTestConfiguration({ ...allowed, ...override }),
      ).toThrow(refusal);
    }
  });

  it.each([
    `postgres://${disposableIdentity}:synthetic@127.0.0.1:54329/${disposableIdentity}`,
    `postgres://${disposableIdentity}:synthetic@127.0.0.1:5432/${disposableIdentity}`,
    `postgres://${disposableIdentity}:synthetic@localhost:54339/${disposableIdentity}`,
    `postgres://${disposableIdentity}:synthetic@127.1:54339/${disposableIdentity}`,
    `postgres://${disposableIdentity}:synthetic@remote.example:54339/${disposableIdentity}`,
    `postgres://another_user:synthetic@127.0.0.1:54339/${disposableIdentity}`,
    `postgres://${disposableIdentity}:synthetic@127.0.0.1:54339/yuta_cloud_dev`,
    `postgres://${disposableIdentity}:synthetic@127.0.0.1:54339/${disposableIdentity}?sslmode=require`,
    `postgres://${disposableIdentity}:synthetic@127.0.0.1:54339/${disposableIdentity}#ignored`,
    `postgres://${disposableIdentity}:synthetic@127.0.0.1:54339/${disposableIdentity} `,
  ])('refuses another or ambiguous target without connecting', (url) => {
    expect(() =>
      requireGoogleReviewTestConfiguration({
        ...allowed,
        CLOUD_DATABASE_URL: url,
      }),
    ).toThrow(refusal);
  });
});

const integrationTest =
  process.env.YUTA_ALLOW_DATABASE_INTEGRATION_TESTS === 'true' &&
  process.env.YUTA_ALLOW_GOOGLE_REVIEW_IMPORT_TESTS === 'true'
    ? describe
    : describe.skip;
const googleScope: FeedbackScopeOptions = {
  requiredSource: 'GOOGLE',
  scopedCounters: true,
  attentionStatuses: ['NEW', 'TO_PROCESS', 'DRAFTED', 'FOLLOW_UP'],
};

type Fixture = {
  organizationId: string;
  establishmentId: string;
  userId: string;
  membershipId: string;
  sessionId: string;
  connectorId: string;
  externalAccountId: string;
  externalLocationId: string;
  context: TenantContext;
};

integrationTest('Persisted Google review retrieval', () => {
  let db: CloudDatabaseClient | undefined;
  let verified = false;
  const organizationIds = new Set<string>();
  const userIds = new Set<string>();

  function database() {
    if (!verified || !db) throw new Error(refusal);
    return db;
  }

  async function fixture(
    options: {
      organizationId?: string;
      externalLocationId?: string;
      role?: 'OWNER' | 'MANAGER' | 'STAFF';
    } = {},
  ): Promise<Fixture> {
    const organizationId = options.organizationId ?? uuidv7();
    const establishmentId = uuidv7();
    const userId = uuidv7();
    const membershipId = uuidv7();
    const sessionId = uuidv7();
    const connectorId = uuidv7();
    const externalAccountId = 'accounts/synthetic';
    const externalLocationId =
      options.externalLocationId ?? `locations/${uuidv7()}`;
    const role = options.role ?? 'OWNER';
    if (!organizationIds.has(organizationId)) {
      organizationIds.add(organizationId);
      await database()
        .insert(organizations)
        .values({
          id: organizationId,
          name: 'Synthetic Google retrieval organization',
          slug: `google-retrieval-${organizationId}`,
        });
    }
    await database()
      .insert(establishments)
      .values({
        id: establishmentId,
        organizationId,
        name: 'Synthetic Google retrieval establishment',
        slug: `google-retrieval-${establishmentId}`,
      });
    userIds.add(userId);
    await database()
      .insert(users)
      .values({
        id: userId,
        authProviderId: `google-retrieval-test:${userId}`,
        email: `google-retrieval-${userId}@example.test`,
        displayName: 'Synthetic retrieval actor',
        authVersion: 0,
      });
    await database().insert(tenantMemberships).values({
      id: membershipId,
      userId,
      organizationId,
      establishmentId,
      role,
      status: 'active',
    });
    await database().insert(tenantEntitlements).values({
      organizationId,
      establishmentId,
      key: 'reputation.enabled',
      enabled: true,
    });
    await database()
      .insert(authSessions)
      .values({
        id: sessionId,
        userId,
        organizationId,
        establishmentId,
        tokenHash: sessionId.replaceAll('-', '').repeat(2),
        authVersion: 0,
        expiresAt: new Date(now.getTime() + 60 * day),
      });
    await database()
      .insert(reputationConnectors)
      .values({
        id: connectorId,
        organizationId,
        establishmentId,
        provider: 'GOOGLE',
        bindingGeneration: 1,
        externalAccountId,
        externalLocationId,
        status: 'CONNECTED',
        encryptedAccessToken: 'synthetic-encrypted-access',
        encryptedRefreshToken: 'synthetic-encrypted-refresh',
        tokenExpiresAt: new Date(now.getTime() + day),
        grantedScopes: ['https://www.googleapis.com/auth/business.manage'],
      });
    return {
      organizationId,
      establishmentId,
      userId,
      membershipId,
      sessionId,
      connectorId,
      externalAccountId,
      externalLocationId,
      context: {
        organizationId,
        establishmentId,
        actor: { type: 'user', userId, membershipId, role },
        locale: 'fr-FR',
        timezone: 'Europe/Paris',
        entitlements: new Set(['reputation.enabled']),
      },
    };
  }

  async function addFeedback(
    target: Fixture,
    values: Partial<typeof feedbackItems.$inferInsert> = {},
  ) {
    const [feedback] = await database()
      .insert(feedbackItems)
      .values({
        id: uuidv7(),
        organizationId: target.organizationId,
        establishmentId: target.establishmentId,
        source: 'GOOGLE',
        type: 'PUBLIC_REVIEW',
        status: 'NEW',
        ...values,
      })
      .returning();
    return feedback!;
  }

  async function snapshot(target: Fixture) {
    const scoped = and(
      eq(feedbackItems.organizationId, target.organizationId),
      eq(feedbackItems.establishmentId, target.establishmentId),
    );
    const [parents, cache, state, replies, notes] = await Promise.all([
      database().select().from(feedbackItems).where(scoped),
      database()
        .select()
        .from(googleReviewCache)
        .where(
          and(
            eq(googleReviewCache.organizationId, target.organizationId),
            eq(googleReviewCache.establishmentId, target.establishmentId),
          ),
        ),
      database()
        .select()
        .from(googleReviewRetrievalStates)
        .where(
          and(
            eq(
              googleReviewRetrievalStates.organizationId,
              target.organizationId,
            ),
            eq(
              googleReviewRetrievalStates.establishmentId,
              target.establishmentId,
            ),
          ),
        ),
      database()
        .select()
        .from(feedbackReplies)
        .where(eq(feedbackReplies.organizationId, target.organizationId)),
      database()
        .select()
        .from(feedbackInternalNotes)
        .where(eq(feedbackInternalNotes.organizationId, target.organizationId)),
    ]);
    return { parents, cache, state, replies, notes };
  }

  function review(
    target: Fixture,
    id = uuidv7(),
    values: Partial<GoogleReviewImportRecord> = {},
  ): GoogleReviewImportRecord {
    return {
      reviewId: id,
      reviewName: `${target.externalAccountId}/${target.externalLocationId}/reviews/${id}`,
      authorName: 'Synthetic Google reviewer',
      rating: 2,
      content: 'Synthetic provider comment',
      providerCreatedAt: new Date(now.getTime() - 40 * day),
      providerUpdatedAt: new Date(now.getTime() - day),
      remoteReply: {
        content: 'Synthetic remote reply',
        updatedAt: new Date(now.getTime() - day),
        status: 'UNSPECIFIED',
      },
      ...values,
    };
  }

  async function start(
    target: Fixture,
    input: Partial<
      Omit<Parameters<typeof beginGoogleReviewRetrieval>[2], 'sessionId'>
    > = {},
  ) {
    const result = await beginGoogleReviewRetrieval(
      database(),
      target.context,
      {
        sessionId: target.sessionId,
        kind: 'RECENT',
        force: true,
        now,
        ...input,
      },
    );
    if (result.status !== 'STARTED') {
      throw new Error(`Expected a retrieval lease; received ${result.status}.`);
    }
    return result;
  }

  async function importPage(
    target: Fixture,
    reviews: readonly GoogleReviewImportRecord[],
    options: {
      fetchedAt?: Date;
      nextPageToken?: string;
      totalReviewCount?: number;
    } = {},
  ) {
    const fetchedAt = options.fetchedAt ?? now;
    const { lease } = await start(target, { now: fetchedAt });
    return commitGoogleReviewRetrieval(database(), target.context, lease, {
      reviews: [...reviews],
      fetchedAt,
      ...options,
    });
  }

  async function addLocalWork(target: Fixture, feedbackId: string) {
    await database()
      .update(feedbackItems)
      .set({
        status: 'FOLLOW_UP',
        assignedToUserId: target.userId,
      })
      .where(
        and(
          eq(feedbackItems.organizationId, target.organizationId),
          eq(feedbackItems.establishmentId, target.establishmentId),
          eq(feedbackItems.id, feedbackId),
        ),
      );
    await database().insert(feedbackReplies).values({
      id: uuidv7(),
      organizationId: target.organizationId,
      feedbackItemId: feedbackId,
      content: 'User-entered mixed/pasted draft remains unchanged',
      status: 'DRAFT',
      createdByUserId: target.userId,
    });
    await database().insert(feedbackInternalNotes).values({
      id: uuidv7(),
      organizationId: target.organizationId,
      feedbackItemId: feedbackId,
      content: 'User-entered mixed/pasted note remains unchanged',
      createdByUserId: target.userId,
    });
  }

  async function revoke(
    target: Fixture,
    kind:
      | 'membership'
      | 'session'
      | 'session-expiry'
      | 'auth-version'
      | 'entitlement'
      | 'organization'
      | 'establishment'
      | 'user',
  ) {
    if (kind === 'membership') {
      await database()
        .update(tenantMemberships)
        .set({ status: 'suspended' })
        .where(
          and(
            eq(tenantMemberships.organizationId, target.organizationId),
            eq(tenantMemberships.id, target.membershipId),
          ),
        );
    } else if (kind === 'session' || kind === 'session-expiry') {
      await database()
        .update(authSessions)
        .set(kind === 'session' ? { revokedAt: now } : { expiresAt: now })
        .where(
          and(
            eq(authSessions.organizationId, target.organizationId),
            eq(authSessions.id, target.sessionId),
          ),
        );
    } else if (kind === 'auth-version') {
      await database()
        .update(users)
        .set({ authVersion: 1 })
        .where(eq(users.id, target.userId));
    } else if (kind === 'entitlement') {
      await database()
        .update(tenantEntitlements)
        .set({ enabled: false })
        .where(
          and(
            eq(tenantEntitlements.organizationId, target.organizationId),
            eq(tenantEntitlements.establishmentId, target.establishmentId),
            eq(tenantEntitlements.key, 'reputation.enabled'),
          ),
        );
    } else if (kind === 'organization') {
      await database()
        .update(organizations)
        .set({ status: 'disabled' })
        .where(eq(organizations.id, target.organizationId));
    } else if (kind === 'establishment') {
      await database()
        .update(establishments)
        .set({ status: 'disabled' })
        .where(
          and(
            eq(establishments.organizationId, target.organizationId),
            eq(establishments.id, target.establishmentId),
          ),
        );
    } else {
      await database()
        .update(users)
        .set({ status: 'DISABLED' })
        .where(eq(users.id, target.userId));
    }
  }

  beforeAll(async () => {
    const configuration = requireGoogleReviewTestConfiguration(process.env);
    db = createCloudDatabaseClient(configuration);
    const [identity] = await db.$client<
      { database: string; user: string; sessionUser: string; version: number }[]
    >`
      select current_database() as database, current_user as "user",
        session_user as "sessionUser",
        current_setting('server_version_num')::integer as version
    `;
    if (
      identity?.database !== disposableIdentity ||
      identity.user !== disposableIdentity ||
      identity.sessionUser !== disposableIdentity ||
      identity.version < 170000 ||
      identity.version >= 180000
    )
      throw new Error(refusal);
    verified = true;
  });

  afterAll(async () => {
    if (!db) return;
    try {
      if (verified && organizationIds.size > 0) {
        const owned = [...organizationIds];
        await db
          .delete(reputationAuditEvents)
          .where(inArray(reputationAuditEvents.organizationId, owned));
        await db
          .delete(feedbackItems)
          .where(inArray(feedbackItems.organizationId, owned));
        await db
          .delete(reputationConnectors)
          .where(inArray(reputationConnectors.organizationId, owned));
        await db
          .delete(authSessions)
          .where(inArray(authSessions.organizationId, owned));
        await db
          .delete(tenantEntitlements)
          .where(inArray(tenantEntitlements.organizationId, owned));
        await db
          .delete(tenantMemberships)
          .where(inArray(tenantMemberships.organizationId, owned));
        if (userIds.size > 0)
          await db.delete(users).where(inArray(users.id, [...userIds]));
        await db
          .delete(establishments)
          .where(inArray(establishments.organizationId, owned));
        await db.delete(organizations).where(inArray(organizations.id, owned));
      }
    } finally {
      await db.$client.end({ timeout: 5 });
    }
  });

  it('defaults existing GOOGLE and DIRECT records to unmanaged and rejects provider fields on a managed work parent', async () => {
    const target = await fixture();
    const legacy = await addFeedback(target, {
      content: 'Unmanaged legacy Google',
    });
    const direct = await addFeedback(target, {
      source: 'DIRECT',
      type: 'DIRECT_FEEDBACK',
      content: 'Unmanaged direct feedback',
    });
    expect(legacy.googleImporterOwned).toBe(false);
    expect(direct.googleImporterOwned).toBe(false);
    const before = await snapshot(target);
    for (const values of [
      {
        googleImporterOwned: true,
        content: 'Provider text cannot enter permanent work',
      },
      {
        googleImporterOwned: true,
        externalId: 'provider-reference-cannot-enter-work',
      },
      {
        googleImporterOwned: true,
        source: 'DIRECT' as const,
        type: 'DIRECT_FEEDBACK' as const,
      },
    ]) {
      await expect(addFeedback(target, values)).rejects.toThrow();
    }
    expect(await snapshot(target)).toEqual(before);
  });

  it('enforces scoped cache foreign keys and independent content/reference maximum deadlines', async () => {
    const target = await fixture();
    const other = await fixture({ organizationId: target.organizationId });
    const parent = await addFeedback(target, { googleImporterOwned: true });
    const foreignParent = await addFeedback(other, {
      googleImporterOwned: true,
    });
    const copy: typeof googleReviewCache.$inferInsert = {
      id: uuidv7(),
      organizationId: target.organizationId,
      establishmentId: target.establishmentId,
      feedbackItemId: parent.id,
      connectorId: target.connectorId,
      bindingGeneration: 1,
      externalLocationId: target.externalLocationId,
      reviewName: review(target).reviewName,
      fetchedAt: now,
      expiresAt: new Date(now.getTime() + 29 * day),
      referenceExpiresAt: new Date(now.getTime() + 30 * day),
    };
    for (const invalid of [
      { feedbackItemId: foreignParent.id },
      { connectorId: other.connectorId },
      { expiresAt: new Date(now.getTime() + 30 * day) },
      { referenceExpiresAt: new Date(now.getTime() + 31 * day) },
      { expiresAt: new Date(now.getTime() - 1) },
      {
        contentClearedAt: now,
        content: 'Cleared copy cannot retain provider text',
      },
    ]) {
      await expect(
        database()
          .insert(googleReviewCache)
          .values({ ...copy, ...invalid }),
      ).rejects.toThrow();
    }
    expect((await snapshot(target)).cache).toEqual([]);
    expect((await snapshot(other)).cache).toEqual([]);
  });

  it('preserves available nullable provider content without inventing an anonymous name, empty comment or remote reply', async () => {
    const target = await fixture();
    await importPage(target, [
      review(target, uuidv7(), {
        authorName: null,
        content: null,
        remoteReply: null,
        rating: 4,
      }),
    ]);
    const feedbackId = (await snapshot(target)).parents[0]!.id;
    const detail = await findFeedbackDetail(
      database(),
      target.context,
      feedbackId,
      { ...googleScope, now },
    );
    expect(detail).toMatchObject({
      googleContentAvailability: 'available',
      authorName: null,
      content: null,
      rating: 4,
      remoteReply: null,
    });
    const filtered = await listFeedback(
      database(),
      target.context,
      feedbackListQuerySchema.parse({ rating: 4 }),
      { ...googleScope, now },
    );
    expect(filtered.items).toHaveLength(1);
    expect(filtered.pagination.totalItems).toBe(1);
    expect(filtered.counters.total).toBe(1);
  });

  it('persists content and own success together without copying provider fields or remote replies into local work', async () => {
    const target = await fixture({ role: 'MANAGER' });
    expect(
      await findGoogleReviewRetrievalSummary(database(), target.context, {
        now,
      }),
    ).toMatchObject({
      state: 'never',
      bound: true,
      lastSuccessfulAt: null,
      currentContentAvailable: false,
    });
    const imported = review(target);
    const { lease, providerRequest } = await start(target);
    expect(providerRequest).toEqual({ pageToken: null, reviewName: null });
    expect(await snapshot(target)).toMatchObject({
      parents: [],
      cache: [],
      state: [{ state: 'PENDING', lastSuccessfulBatchAt: null }],
    });
    expect(
      await commitGoogleReviewRetrieval(database(), target.context, lease, {
        reviews: [imported],
        totalReviewCount: 75,
        nextPageToken: 'synthetic-page-token',
        fetchedAt: now,
      }),
    ).toEqual({
      status: 'COMPLETED',
      addedCount: 1,
      changedCount: 0,
      returnedCount: 1,
    });
    const persisted = await snapshot(target);
    expect(persisted.parents).toHaveLength(1);
    expect(persisted.parents[0]).toMatchObject({
      googleImporterOwned: true,
      source: 'GOOGLE',
      type: 'PUBLIC_REVIEW',
      status: 'NEW',
      assignedToUserId: null,
      externalId: null,
      externalUrl: null,
      authorName: null,
      authorAvatarUrl: null,
      rating: null,
      title: null,
      content: null,
      language: null,
      sentiment: null,
      urgency: null,
      publishedAt: null,
      lastSyncedAt: null,
      providerMetadata: null,
    });
    expect(persisted.cache).toHaveLength(1);
    expect(persisted.cache[0]).toMatchObject({
      feedbackItemId: persisted.parents[0]!.id,
      reviewName: imported.reviewName,
      authorName: imported.authorName,
      rating: 2,
      content: imported.content,
      remoteReplyContent: imported.remoteReply!.content,
      remoteReplyStatus: 'UNSPECIFIED',
      fetchedAt: now,
      expiresAt: new Date(now.getTime() + 29 * day),
      referenceExpiresAt: new Date(now.getTime() + 30 * day),
      contentClearedAt: null,
    });
    expect(persisted.replies).toEqual([]);
    expect(persisted.notes).toEqual([]);
    expect(persisted.state[0]).toMatchObject({
      state: 'COMPLETED',
      lastSuccessfulBatchAt: now,
      lastSuccessfulRecentAt: now,
    });
    const summary = await findGoogleReviewRetrievalSummary(
      database(),
      target.context,
      { now },
    );
    expect(summary).toMatchObject({
      state: 'completed_content',
      coverage: 'partial',
      lastBatchCount: 1,
      lastSuccessfulAt: now,
    });
    expect(summary.continuationHandle).toEqual(expect.any(String));
    expect(JSON.stringify(summary)).not.toContain(imported.reviewName);
    expect(JSON.stringify(summary)).not.toContain('synthetic-page-token');
    const detail = await findFeedbackDetail(
      database(),
      target.context,
      persisted.parents[0]!.id,
      { ...googleScope, now },
    );
    expect(detail).toMatchObject({
      googleContentAvailability: 'available',
      rating: 2,
      content: imported.content,
      replies: [],
      notes: [],
    });
    expect(detail?.remoteReply).toMatchObject({
      content: imported.remoteReply!.content,
      status: 'UNSPECIFIED',
    });
  });

  it('deduplicates a current permitted identity and updates only provider content while preserving arbitrary saved user input', async () => {
    const target = await fixture();
    const original = review(target);
    await importPage(target, [original]);
    const first = await snapshot(target);
    const parentId = first.parents[0]!.id;
    await addLocalWork(target, parentId);
    const before = await snapshot(target);
    const later = new Date(now.getTime() + 20 * 60 * 1_000);
    expect(
      await importPage(
        target,
        [
          review(target, original.reviewId, {
            rating: 5,
            content: 'Provider edited the comment',
            providerUpdatedAt: later,
            remoteReply: {
              content: 'Provider edited the remote reply',
              updatedAt: later,
              status: 'UNKNOWN_PROVIDER_STATE',
            },
          }),
        ],
        { fetchedAt: later },
      ),
    ).toMatchObject({ addedCount: 0, changedCount: 1 });
    const after = await snapshot(target);
    expect(after.parents).toEqual(before.parents);
    expect(after.replies).toEqual(before.replies);
    expect(after.notes).toEqual(before.notes);
    expect(after.cache).toHaveLength(1);
    expect(after.cache[0]).toMatchObject({
      feedbackItemId: parentId,
      rating: 5,
      needsReview: true,
      fetchedAt: later,
    });
    expect(
      await findFeedbackDetail(database(), target.context, parentId, {
        ...googleScope,
        now: later,
      }),
    ).toMatchObject({
      status: 'FOLLOW_UP',
      assignedToUserId: target.userId,
      googleReviewChanged: true,
      replies: [{ content: before.replies[0]!.content, status: 'DRAFT' }],
      notes: [{ content: before.notes[0]!.content }],
    });
  });

  it('consolidates concurrent starts, obeys freshness and allows a bounded expired-lease retry', async () => {
    const target = await fixture();
    const results = await Promise.all(
      Array.from({ length: 4 }, () =>
        beginGoogleReviewRetrieval(database(), target.context, {
          sessionId: target.sessionId,
          kind: 'RECENT',
          now,
        }),
      ),
    );
    expect(
      results.filter((result) => result.status === 'STARTED'),
    ).toHaveLength(1);
    expect(
      results.filter((result) => result.status === 'PENDING'),
    ).toHaveLength(3);
    const started = results.find((result) => result.status === 'STARTED');
    if (!started || started.status !== 'STARTED')
      throw new Error('Missing consolidated lease.');
    const retriedAt = new Date(started.lease.leaseExpiresAt.getTime() + 1);
    const retry = await start(target, { now: retriedAt });
    await expect(
      commitGoogleReviewRetrieval(database(), target.context, started.lease, {
        reviews: [review(target)],
        fetchedAt: retriedAt,
      }),
    ).rejects.toMatchObject({ code: 'STALE_AUTHORITY' });
    await commitGoogleReviewRetrieval(database(), target.context, retry.lease, {
      reviews: [],
      fetchedAt: retriedAt,
    });
    expect(
      await beginGoogleReviewRetrieval(database(), target.context, {
        sessionId: target.sessionId,
        kind: 'RECENT',
        now: retriedAt,
      }),
    ).toEqual({ status: 'FRESH' });
    expect((await start(target, { now: retriedAt })).status).toBe('STARTED');
  });

  it('distinguishes true recent empty success from a failed later refresh without advancing successful freshness', async () => {
    const target = await fixture();
    await importPage(target, [], { totalReviewCount: 0 });
    expect(
      await findGoogleReviewRetrievalSummary(database(), target.context, {
        now,
      }),
    ).toMatchObject({
      state: 'completed_empty',
      lastSuccessfulAt: now,
      lastRecentSuccessAt: now,
      lastBatchCount: 0,
    });
    const failedAt = new Date(now.getTime() + 20 * 60 * 1_000);
    const { lease } = await start(target, { now: failedAt });
    await failGoogleReviewRetrieval(database(), target.context, lease, {
      category: 'PROVIDER_UNAVAILABLE',
      now: failedAt,
    });
    expect(
      await findGoogleReviewRetrievalSummary(database(), target.context, {
        now: failedAt,
      }),
    ).toMatchObject({
      state: 'failed',
      lastError: 'PROVIDER_UNAVAILABLE',
      lastSuccessfulAt: now,
      lastRecentSuccessAt: now,
    });
    expect((await snapshot(target)).parents).toEqual([]);
  });

  it('requires current scoped continuations, preserves them through detail recovery and invalidates them on a new recent sequence', async () => {
    const target = await fixture();
    const foreign = await fixture();
    const imported = review(target);
    await importPage(target, [imported], {
      nextPageToken: 'synthetic-history',
      totalReviewCount: 100,
    });
    const summary = await findGoogleReviewRetrievalSummary(
      database(),
      target.context,
      { now },
    );
    const handle = summary.continuationHandle!;
    expect(
      await beginGoogleReviewRetrieval(database(), foreign.context, {
        sessionId: foreign.sessionId,
        kind: 'HISTORY',
        continuationHandle: handle,
        now,
      }),
    ).toEqual({ status: 'INVALID_CONTINUATION' });
    expect(
      await beginGoogleReviewRetrieval(database(), target.context, {
        sessionId: target.sessionId,
        kind: 'HISTORY',
        continuationHandle: uuidv7(),
        now,
      }),
    ).toEqual({ status: 'INVALID_CONTINUATION' });
    const feedbackId = (await snapshot(target)).parents[0]!.id;
    const detail = await start(target, { kind: 'DETAIL', feedbackId });
    expect(detail.providerRequest).toEqual({
      pageToken: null,
      reviewName: imported.reviewName,
    });
    await commitGoogleReviewRetrieval(
      database(),
      target.context,
      detail.lease,
      { reviews: [imported], fetchedAt: now },
    );
    expect(
      (
        await findGoogleReviewRetrievalSummary(database(), target.context, {
          now,
        })
      ).continuationHandle,
    ).toBe(handle);
    const history = await start(target, {
      kind: 'HISTORY',
      continuationHandle: handle,
    });
    expect(history.providerRequest).toEqual({
      pageToken: 'synthetic-history',
      reviewName: null,
    });
    await commitGoogleReviewRetrieval(
      database(),
      target.context,
      history.lease,
      { reviews: [], fetchedAt: now },
    );
    expect(
      await findGoogleReviewRetrievalSummary(database(), target.context, {
        now,
      }),
    ).toMatchObject({ coverage: 'end', lastRecentSuccessAt: now });
    expect(
      await beginGoogleReviewRetrieval(database(), target.context, {
        sessionId: target.sessionId,
        kind: 'HISTORY',
        continuationHandle: handle,
        now,
      }),
    ).toEqual({ status: 'INVALID_CONTINUATION' });
    await importPage(target, [imported], {
      nextPageToken: 'second-synthetic-history',
    });
    const secondHandle = (
      await findGoogleReviewRetrievalSummary(database(), target.context, {
        now,
      })
    ).continuationHandle!;
    const recent = await start(target);
    await failGoogleReviewRetrieval(database(), target.context, recent.lease, {
      category: 'PROVIDER_UNAVAILABLE',
      now,
    });
    expect(
      await beginGoogleReviewRetrieval(database(), target.context, {
        sessionId: target.sessionId,
        kind: 'HISTORY',
        continuationHandle: secondHandle,
        now,
      }),
    ).toEqual({ status: 'INVALID_CONTINUATION' });
  });

  it.each(['raw-id', 'full-name'] as const)(
    'refuses a %s legacy identity collision and rolls back the entire page without a success receipt',
    async (identityKind) => {
      const target = await fixture();
      const collision = review(target);
      await addFeedback(target, {
        externalId:
          identityKind === 'raw-id' ? collision.reviewId : collision.reviewName,
        content: 'Legacy content must not be adopted',
      });
      const { lease } = await start(target);
      const before = await snapshot(target);
      await expect(
        commitGoogleReviewRetrieval(database(), target.context, lease, {
          reviews: [review(target), collision],
          fetchedAt: now,
        }),
      ).rejects.toMatchObject({ code: 'IDENTITY_CONFLICT' });
      expect(await snapshot(target)).toEqual(before);
      await failGoogleReviewRetrieval(database(), target.context, lease, {
        category: 'IDENTITY_CONFLICT',
        now,
      });
      expect(
        await findGoogleReviewRetrievalSummary(database(), target.context, {
          now,
        }),
      ).toMatchObject({ state: 'failed', lastSuccessfulAt: null });
    },
  );

  it('refuses an available mapping owned by another establishment without reassigning either work or cache', async () => {
    const target = await fixture();
    const other = await fixture({
      organizationId: target.organizationId,
      externalLocationId: target.externalLocationId,
    });
    const imported = review(other);
    await importPage(other, [imported]);
    const otherBefore = await snapshot(other);
    const { lease } = await start(target);
    const before = await snapshot(target);
    await expect(
      commitGoogleReviewRetrieval(database(), target.context, lease, {
        reviews: [imported],
        fetchedAt: now,
      }),
    ).rejects.toMatchObject({ code: 'IDENTITY_CONFLICT' });
    expect(await snapshot(target)).toEqual(before);
    expect(await snapshot(other)).toEqual(otherBefore);
  });

  it('rejects malformed, foreign and conflicting duplicate provider pages without partial persistence', async () => {
    const target = await fixture();
    const imported = review(target);
    const invalidPages = [
      [
        review(target, uuidv7(), {
          reviewName: 'accounts/foreign/locations/foreign/reviews/other',
        }),
      ],
      [review(target, uuidv7(), { rating: 0 })],
      [imported, { ...imported, content: 'Contradictory duplicate body' }],
      [review(target, uuidv7(), { providerUpdatedAt: new Date('invalid') })],
    ];
    for (const reviews of invalidPages) {
      const { lease } = await start(target);
      const before = await snapshot(target);
      await expect(
        commitGoogleReviewRetrieval(database(), target.context, lease, {
          reviews,
          fetchedAt: now,
        }),
      ).rejects.toMatchObject({ code: 'INVALID_RESPONSE' });
      expect(await snapshot(target)).toEqual(before);
      await failGoogleReviewRetrieval(database(), target.context, lease, {
        category: 'INVALID_RESPONSE',
        now,
      });
    }
    expect((await snapshot(target)).parents).toEqual([]);
  });

  it('denies STAFF, missing entitlement and forged session/scope before any retrieval persistence', async () => {
    const target = await fixture();
    const staff = await fixture({ role: 'STAFF' });
    const foreign = await fixture();
    const other = await fixture({ organizationId: target.organizationId });
    const attempts = [
      {
        fixture: staff,
        context: staff.context,
        sessionId: staff.sessionId,
        code: 'FORBIDDEN',
      },
      {
        fixture: target,
        context: { ...target.context, entitlements: new Set<string>() },
        sessionId: target.sessionId,
        code: 'FORBIDDEN',
      },
      {
        fixture: target,
        context: target.context,
        sessionId: foreign.sessionId,
        code: 'STALE_AUTHORITY',
      },
      {
        fixture: target,
        context: { ...target.context, establishmentId: other.establishmentId },
        sessionId: target.sessionId,
        code: 'STALE_AUTHORITY',
      },
      {
        fixture: target,
        context: { ...target.context, organizationId: foreign.organizationId },
        sessionId: target.sessionId,
        code: 'STALE_AUTHORITY',
      },
    ];
    for (const attempt of attempts) {
      const before = await snapshot(attempt.fixture);
      await expect(
        beginGoogleReviewRetrieval(database(), attempt.context, {
          sessionId: attempt.sessionId,
          kind: 'RECENT',
          now,
        }),
      ).rejects.toMatchObject({ code: attempt.code });
      expect(await snapshot(attempt.fixture)).toEqual(before);
    }
  });

  it.each([
    'membership',
    'session',
    'session-expiry',
    'auth-version',
    'entitlement',
    'organization',
    'establishment',
    'user',
  ] as const)(
    'rechecks %s authority before begin and before committing an in-flight result',
    async (kind) => {
      const revokedBeforeStart = await fixture();
      await revoke(revokedBeforeStart, kind);
      const startBefore = await snapshot(revokedBeforeStart);
      await expect(
        beginGoogleReviewRetrieval(database(), revokedBeforeStart.context, {
          sessionId: revokedBeforeStart.sessionId,
          kind: 'RECENT',
          now,
        }),
      ).rejects.toMatchObject({ code: 'STALE_AUTHORITY' });
      expect(await snapshot(revokedBeforeStart)).toEqual(startBefore);

      const target = await fixture();
      const { lease } = await start(target);
      await revoke(target, kind);
      const before = await snapshot(target);
      await expect(
        commitGoogleReviewRetrieval(database(), target.context, lease, {
          reviews: [review(target)],
          fetchedAt: now,
        }),
      ).rejects.toMatchObject({ code: 'STALE_AUTHORITY' });
      expect(await snapshot(target)).toEqual(before);
    },
  );

  it('waits for a concurrent session revocation transaction and rejects its stale result without content or success effects', async () => {
    const target = await fixture();
    const { lease } = await start(target);
    let announceLock: () => void = () => undefined;
    let releaseLock: () => void = () => undefined;
    const locked = new Promise<void>((resolve) => {
      announceLock = resolve;
    });
    const released = new Promise<void>((resolve) => {
      releaseLock = resolve;
    });
    const revocation = database().transaction(async (transaction) => {
      await transaction
        .update(authSessions)
        .set({ revokedAt: now })
        .where(
          and(
            eq(authSessions.organizationId, target.organizationId),
            eq(authSessions.id, target.sessionId),
          ),
        );
      announceLock();
      await released;
    });
    await locked;
    const committing = commitGoogleReviewRetrieval(
      database(),
      target.context,
      lease,
      { reviews: [review(target)], fetchedAt: now },
    ).then(
      (value) => ({ succeeded: true as const, value }),
      (error: unknown) => ({ succeeded: false as const, error }),
    );
    let observedBlockedCommit = false;
    try {
      for (let attempt = 0; attempt < 80; attempt += 1) {
        const [observation] = await database().$client<{ blocked: boolean }[]>`
          select exists (
            select 1 from pg_stat_activity
            where datname = current_database()
              and cardinality(pg_blocking_pids(pid)) > 0
              and query like '%auth_sessions%'
          ) as blocked
        `;
        if (observation?.blocked) {
          observedBlockedCommit = true;
          break;
        }
        await new Promise<void>((resolve) => setTimeout(resolve, 25));
      }
    } finally {
      releaseLock();
      await revocation;
    }
    const outcome = await committing;
    expect(observedBlockedCommit).toBe(true);
    expect(outcome.succeeded).toBe(false);
    if (outcome.succeeded)
      throw new Error('Stale retrieval unexpectedly committed.');
    expect(outcome.error).toMatchObject({ code: 'STALE_AUTHORITY' });
    expect(await snapshot(target)).toMatchObject({
      parents: [],
      cache: [],
      state: [{ state: 'PENDING', lastSuccessfulBatchAt: null }],
    });
  });

  it('fences captured credentials and token writes by binding while routine access-token refresh preserves the generation', async () => {
    const target = await fixture();
    const { lease } = await start(target);
    expect(
      await findCapturedGoogleConnectorCredentials(
        database(),
        target.context,
        lease.binding,
      ),
    ).toMatchObject({ encryptedAccessToken: 'synthetic-encrypted-access' });
    expect(
      await updateCapturedGoogleConnectorAccessToken(
        database(),
        target.context,
        lease.binding,
        {
          encryptedAccessToken: 'synthetic-refreshed-access',
          tokenExpiresAt: new Date(now.getTime() + 2 * day),
        },
      ),
    ).toBe(true);
    const [refreshed] = await database()
      .select()
      .from(reputationConnectors)
      .where(
        and(
          eq(reputationConnectors.organizationId, target.organizationId),
          eq(reputationConnectors.id, target.connectorId),
        ),
      );
    expect(refreshed).toMatchObject({
      bindingGeneration: 1,
      encryptedAccessToken: 'synthetic-refreshed-access',
    });
    await database()
      .update(reputationConnectors)
      .set({ bindingGeneration: 2, externalLocationId: 'locations/rebound' })
      .where(
        and(
          eq(reputationConnectors.organizationId, target.organizationId),
          eq(reputationConnectors.id, target.connectorId),
        ),
      );
    const before = await snapshot(target);
    expect(
      await findCapturedGoogleConnectorCredentials(
        database(),
        target.context,
        lease.binding,
      ),
    ).toBeNull();
    expect(
      await updateCapturedGoogleConnectorAccessToken(
        database(),
        target.context,
        lease.binding,
        {
          encryptedAccessToken: 'stale-token-must-not-write',
          tokenExpiresAt: now,
        },
      ),
    ).toBe(false);
    await expect(
      commitGoogleReviewRetrieval(database(), target.context, lease, {
        reviews: [review(target)],
        fetchedAt: now,
      }),
    ).rejects.toMatchObject({ code: 'STALE_AUTHORITY' });
    expect(await snapshot(target)).toEqual(before);
  });

  it('denies expired provider fields in shared internal and A list/detail/search/rating/count/attention projections before physical cleanup', async () => {
    const target = await fixture();
    const imported = review(target, uuidv7(), {
      authorName: 'Expired provider author marker',
      content: 'Expired provider search marker',
      remoteReply: {
        content: 'Expired remote reply marker',
        updatedAt: now,
        status: 'UNKNOWN_PROVIDER_STATE',
      },
    });
    await importPage(target, [imported]);
    const managedId = (await snapshot(target)).parents[0]!.id;
    await addLocalWork(target, managedId);
    const legacy = await addFeedback(target, {
      authorName: 'Legacy author',
      content: 'Legacy readable marker',
      rating: 1,
      sentiment: 'NEGATIVE',
    });
    const direct = await addFeedback(target, {
      source: 'DIRECT',
      type: 'DIRECT_FEEDBACK',
      content: 'Direct readable marker',
      rating: 4,
      sentiment: 'POSITIVE',
    });
    const expiredAt = new Date(now.getTime() + 29 * day);
    expect((await snapshot(target)).cache[0]?.content).toBe(imported.content);
    for (const options of [
      { ...googleScope, now: expiredAt },
      {
        now: expiredAt,
        scopedCounters: true,
        attentionStatuses: googleScope.attentionStatuses,
      },
    ]) {
      const list = await listFeedback(
        database(),
        target.context,
        feedbackListQuerySchema.parse({ pageSize: 100, sort: 'rating_asc' }),
        options,
      );
      expect(list.items.find((item) => item.id === managedId)).toMatchObject({
        authorName: null,
        rating: null,
        content: null,
        sentiment: null,
        urgency: null,
        publishedAt: null,
        googleContentAvailability: 'unavailable',
        googleReviewChanged: false,
        remoteReply: null,
        status: 'FOLLOW_UP',
        assignedToUserId: target.userId,
      });
      expect(list.items.find((item) => item.id === legacy.id)).toMatchObject({
        googleContentAvailability: 'legacy',
        content: 'Legacy readable marker',
      });
      expect(list.items[0]?.id).toBe(legacy.id);
      expect(list.counters.negative).toBe(1);
      expect(list.attentionCount).toBe(options.requiredSource ? 2 : 3);
      for (const query of [
        { search: 'Expired provider search marker' },
        { search: 'Expired provider author marker' },
        { rating: 2 },
        { sentiment: 'NEGATIVE', rating: 2 },
      ]) {
        const filtered = await listFeedback(
          database(),
          target.context,
          feedbackListQuerySchema.parse(query),
          options,
        );
        expect(filtered.items).toEqual([]);
        expect(filtered.pagination.totalItems).toBe(0);
        expect(filtered.counters.total).toBe(0);
        expect(filtered.attentionCount).toBe(0);
      }
      const detail = await findFeedbackDetail(
        database(),
        target.context,
        managedId,
        options,
      );
      expect(detail).toMatchObject({
        googleContentAvailability: 'unavailable',
        canRecoverReference: true,
        content: null,
        rating: null,
        replies: [
          { content: 'User-entered mixed/pasted draft remains unchanged' },
        ],
        notes: [
          { content: 'User-entered mixed/pasted note remains unchanged' },
        ],
      });
      for (const sensitive of [
        imported.authorName!,
        imported.content!,
        imported.remoteReply!.content,
        imported.reviewName,
      ]) {
        expect(JSON.stringify({ list, detail })).not.toContain(sensitive);
      }
    }
    expect(
      await findFeedbackDetail(database(), target.context, direct.id, {
        now: expiredAt,
      }),
    ).toMatchObject({
      googleContentAvailability: 'not_applicable',
      content: 'Direct readable marker',
      rating: 4,
    });
    expect(
      await findFeedbackDetail(database(), target.context, legacy.id, {
        now: expiredAt,
      }),
    ).toMatchObject({
      googleContentAvailability: 'legacy',
      content: 'Legacy readable marker',
      rating: 1,
    });
    const noLegacyCounters = await listFeedback(
      database(),
      target.context,
      feedbackListQuerySchema.parse({ status: 'FOLLOW_UP' }),
      { ...googleScope, now: expiredAt },
    );
    expect(noLegacyCounters.counters).toMatchObject({ total: 1, negative: 0 });
    expect(noLegacyCounters.attentionCount).toBe(1);
  });

  it('reprojects held local work IDs after new imports displace them from the current page and a local status edit removes them from its filter', async () => {
    const target = await fixture();
    await importPage(target, [review(target), review(target)]);
    const heldIds = (await snapshot(target)).parents.map((parent) => parent.id);
    await addLocalWork(target, heldIds[0]!);
    const initial = await listFeedback(
      database(),
      target.context,
      feedbackListQuerySchema.parse({ pageSize: 25 }),
      { ...googleScope, now },
    );
    expect(initial.items.map((item) => item.id).sort()).toEqual(
      [...heldIds].sort(),
    );
    const beforeChildren = await snapshot(target);
    const later = new Date(now.getTime() + 1_000);
    await importPage(
      target,
      Array.from({ length: 26 }, () => review(target)),
      { fetchedAt: later },
    );
    await database()
      .update(feedbackItems)
      .set({ status: 'ARCHIVED' })
      .where(
        and(
          eq(feedbackItems.organizationId, target.organizationId),
          eq(feedbackItems.establishmentId, target.establishmentId),
          eq(feedbackItems.id, heldIds[0]!),
        ),
      );
    const fresh = await listFeedback(
      database(),
      target.context,
      feedbackListQuerySchema.parse({ pageSize: 25, status: 'NEW' }),
      { ...googleScope, now: later },
    );
    expect(fresh.items).toHaveLength(25);
    expect(fresh.items.some((item) => heldIds.includes(item.id))).toBe(false);
    const working = await listFeedback(
      database(),
      target.context,
      feedbackListQuerySchema.parse({ pageSize: 25 }),
      { ...googleScope, now: later, workIds: heldIds },
    );
    expect(working.items.map((item) => item.id).sort()).toEqual(
      [...heldIds].sort(),
    );
    expect(working.items.find((item) => item.id === heldIds[0])).toMatchObject({
      status: 'ARCHIVED',
      assignedToUserId: target.userId,
      replyStatus: 'DRAFT',
      googleContentAvailability: 'available',
    });
    expect(working.pagination.totalItems).toBe(2);
    const after = await snapshot(target);
    expect(after.replies).toEqual(beforeChildren.replies);
    expect(after.notes).toEqual(beforeChildren.notes);
  });

  it('masks expired managed content when explicitly reprojecting held local work IDs before physical cleanup', async () => {
    const target = await fixture();
    const imported = review(target, uuidv7(), {
      authorName: 'Held expired provider author marker',
      content: 'Held expired provider content marker',
      rating: 1,
      remoteReply: {
        content: 'Held expired remote reply marker',
        updatedAt: now,
        status: 'UNSPECIFIED',
      },
    });
    await importPage(target, [imported]);
    const feedbackId = (await snapshot(target)).parents[0]!.id;
    await addLocalWork(target, feedbackId);
    const at = new Date(now.getTime() + 29 * day + 60 * 60 * 1_000);
    const physical = await snapshot(target);
    expect(physical.cache[0]?.content).toBe(imported.content);
    expect(physical.cache[0]?.contentClearedAt).toBeNull();
    for (const options of [googleScope, {}]) {
      const working = await listFeedback(
        database(),
        target.context,
        feedbackListQuerySchema.parse({ pageSize: 25 }),
        { ...options, now: at, workIds: [feedbackId], scopedCounters: true },
      );
      expect(working.items).toHaveLength(1);
      expect(working.items[0]).toMatchObject({
        id: feedbackId,
        authorName: null,
        rating: null,
        content: null,
        remoteReply: null,
        googleContentAvailability: 'unavailable',
        googleReviewChanged: false,
        canRecoverReference: true,
        status: 'FOLLOW_UP',
        assignedToUserId: target.userId,
        replyStatus: 'DRAFT',
      });
      expect(working.counters).toMatchObject({ total: 1, negative: 0 });
      for (const sensitive of [
        imported.authorName!,
        imported.content!,
        imported.remoteReply!.content,
        imported.reviewName,
      ]) {
        expect(JSON.stringify(working)).not.toContain(sensitive);
      }
    }
    const detail = await findFeedbackDetail(
      database(),
      target.context,
      feedbackId,
      {
        ...googleScope,
        now: at,
      },
    );
    expect(detail).toMatchObject({
      content: null,
      replies: [
        { content: 'User-entered mixed/pasted draft remains unchanged' },
      ],
      notes: [{ content: 'User-entered mixed/pasted note remains unchanged' }],
    });
    expect(await snapshot(target)).toEqual(physical);
  });

  it('keeps explicit held IDs inside trusted organization, establishment, source and STAFF assignment scope', async () => {
    const target = await fixture();
    const otherEstablishment = await fixture({
      organizationId: target.organizationId,
    });
    const foreign = await fixture();
    const staffUserId = uuidv7();
    const staffMembershipId = uuidv7();
    userIds.add(staffUserId);
    await database()
      .insert(users)
      .values({
        id: staffUserId,
        authProviderId: `google-retrieval-test:${staffUserId}`,
        email: `google-retrieval-${staffUserId}@example.test`,
        displayName: 'Synthetic held-work STAFF',
      });
    await database().insert(tenantMemberships).values({
      id: staffMembershipId,
      userId: staffUserId,
      organizationId: target.organizationId,
      establishmentId: target.establishmentId,
      role: 'STAFF',
      status: 'active',
    });
    const assigned = await addFeedback(target, {
      assignedToUserId: staffUserId,
    });
    const unassigned = await addFeedback(target);
    const direct = await addFeedback(target, {
      source: 'DIRECT',
      type: 'DIRECT_FEEDBACK',
      assignedToUserId: staffUserId,
    });
    const other = await addFeedback(otherEstablishment, {
      assignedToUserId: staffUserId,
    });
    const foreignItem = await addFeedback(foreign, {
      assignedToUserId: staffUserId,
    });
    const workIds = [
      assigned.id,
      unassigned.id,
      direct.id,
      other.id,
      foreignItem.id,
      uuidv7(),
    ];
    const query = feedbackListQuerySchema.parse({ pageSize: 25 });
    const ownerView = await listFeedback(database(), target.context, query, {
      ...googleScope,
      now,
      workIds,
    });
    expect(ownerView.items.map((item) => item.id).sort()).toEqual(
      [assigned.id, unassigned.id].sort(),
    );
    expect(ownerView.counters.total).toBe(2);
    const staffContext: TenantContext = {
      ...target.context,
      actor: {
        type: 'user',
        userId: staffUserId,
        membershipId: staffMembershipId,
        role: 'STAFF',
      },
    };
    const staffView = await listFeedback(database(), staffContext, query, {
      ...googleScope,
      now,
      workIds,
    });
    expect(staffView.items.map((item) => item.id)).toEqual([assigned.id]);
    expect(staffView.counters.total).toBe(1);
    for (const deniedId of [
      unassigned.id,
      direct.id,
      other.id,
      foreignItem.id,
    ]) {
      expect(
        await findFeedbackDetail(
          database(),
          staffContext,
          deniedId,
          googleScope,
        ),
      ).toBeUndefined();
    }
    const empty = await listFeedback(database(), target.context, query, {
      ...googleScope,
      now,
      workIds: [],
    });
    expect(empty.items).toEqual([]);
    expect(empty.counters.total).toBe(0);
  });

  it('sorts and filters by eligible cache ratings, then removes an expired rating from both ascending and descending provider order', async () => {
    const target = await fixture();
    const expired = review(target, uuidv7(), { rating: 5 });
    await importPage(target, [expired]);
    const retainedAt = new Date(now.getTime() + day);
    const low = review(target, uuidv7(), { rating: 1 });
    const middle = review(target, uuidv7(), { rating: 3 });
    await importPage(target, [low, middle], { fetchedAt: retainedAt });
    const cache = (await snapshot(target)).cache;
    const lowId = cache.find(
      (row) => row.reviewName === low.reviewName,
    )!.feedbackItemId;
    const middleId = cache.find(
      (row) => row.reviewName === middle.reviewName,
    )!.feedbackItemId;
    const expiredId = cache.find(
      (row) => row.reviewName === expired.reviewName,
    )!.feedbackItemId;
    const at = new Date(now.getTime() + 29 * day);
    for (const sort of ['rating_asc', 'rating_desc'] as const) {
      const list = await listFeedback(
        database(),
        target.context,
        feedbackListQuerySchema.parse({ sort }),
        { ...googleScope, now: at },
      );
      expect(list.items.find((row) => row.id === expiredId)?.rating).toBeNull();
      expect(
        list.items.filter((row) => row.rating !== null).map((row) => row.id),
      ).toEqual(sort === 'rating_asc' ? [lowId, middleId] : [middleId, lowId]);
    }
    const hidden = await listFeedback(
      database(),
      target.context,
      feedbackListQuerySchema.parse({ rating: 5 }),
      { ...googleScope, now: at },
    );
    expect(hidden.pagination.totalItems).toBe(0);
    expect(hidden.counters.total).toBe(0);
  });

  it('clears every due provider-content field at 29 days, preserves a 30-day reference and local work, and recovers the same parent through that reference', async () => {
    const target = await fixture();
    const foreign = await fixture();
    const imported = review(target);
    await importPage(target, [imported], {
      nextPageToken: 'synthetic-ephemeral-cursor',
      totalReviewCount: 70,
    });
    await importPage(foreign, [review(foreign)]);
    const feedbackId = (await snapshot(target)).parents[0]!.id;
    await addLocalWork(target, feedbackId);
    const before = await snapshot(target);
    const foreignBefore = await snapshot(foreign);
    const at = new Date(now.getTime() + 29 * day);
    expect(
      await listDueGoogleReviewCacheScopes(database(), { now: at, limit: 100 }),
    ).toEqual(
      expect.arrayContaining([
        {
          organizationId: target.organizationId,
          establishmentId: target.establishmentId,
        },
      ]),
    );
    expect(
      await purgeGoogleReviewCache(database(), target, { now: at, limit: 1 }),
    ).toMatchObject({
      contentCleared: 1,
      referencesRemoved: 0,
      continuationsCleared: 1,
    });
    const after = await snapshot(target);
    expect(after.parents).toEqual(before.parents);
    expect(after.replies).toEqual(before.replies);
    expect(after.notes).toEqual(before.notes);
    expect(after.cache[0]).toMatchObject({
      reviewName: imported.reviewName,
      contentClearedAt: at,
      authorName: null,
      rating: null,
      content: null,
      providerCreatedAt: null,
      providerUpdatedAt: null,
      remoteReplyContent: null,
      remoteReplyUpdatedAt: null,
      remoteReplyStatus: null,
      needsReview: false,
    });
    expect(after.state[0]).toMatchObject({
      lastSuccessfulBatchAt: now,
      nextPageToken: null,
      continuationHandle: null,
      returnedCount: null,
      totalReviewCount: null,
    });
    expect(await snapshot(foreign)).toEqual(foreignBefore);
    expect(
      await purgeGoogleReviewCache(database(), target, { now: at, limit: 100 }),
    ).toEqual({
      contentCleared: 0,
      referencesRemoved: 0,
      continuationsCleared: 0,
    });
    const recovering = await start(target, {
      kind: 'DETAIL',
      feedbackId,
      now: at,
    });
    expect(recovering.providerRequest.reviewName).toBe(imported.reviewName);
    await commitGoogleReviewRetrieval(
      database(),
      target.context,
      recovering.lease,
      { reviews: [imported], fetchedAt: at },
    );
    const recovered = await snapshot(target);
    expect(recovered.parents).toEqual(before.parents);
    expect(recovered.replies).toEqual(before.replies);
    expect(recovered.notes).toEqual(before.notes);
    expect(recovered.cache[0]).toMatchObject({
      feedbackItemId: feedbackId,
      fetchedAt: at,
      contentClearedAt: null,
      content: imported.content,
    });
    expect(
      await findFeedbackDetail(database(), target.context, feedbackId, {
        ...googleScope,
        now: at,
      }),
    ).toMatchObject({ googleContentAvailability: 'available' });
  });

  it('removes a due reference at 30 days without deleting work and truthfully creates new work on a later unlinked encounter', async () => {
    const target = await fixture();
    const imported = review(target);
    await importPage(target, [imported]);
    const feedbackId = (await snapshot(target)).parents[0]!.id;
    await addLocalWork(target, feedbackId);
    const before = await snapshot(target);
    const at = new Date(now.getTime() + 30 * day);
    expect(
      await beginGoogleReviewRetrieval(database(), target.context, {
        sessionId: target.sessionId,
        kind: 'DETAIL',
        feedbackId,
        now: at,
      }),
    ).toEqual({ status: 'NO_REFERENCE' });
    expect(
      await purgeGoogleReviewCache(database(), target, { now: at, limit: 100 }),
    ).toMatchObject({ referencesRemoved: 1 });
    const purged = await snapshot(target);
    expect(purged.cache).toEqual([]);
    expect(purged.parents).toEqual(before.parents);
    expect(purged.replies).toEqual(before.replies);
    expect(purged.notes).toEqual(before.notes);
    expect(
      await findFeedbackDetail(database(), target.context, feedbackId, {
        ...googleScope,
        now: at,
      }),
    ).toMatchObject({
      googleContentAvailability: 'unavailable',
      canRecoverReference: false,
    });
    expect(
      await importPage(target, [imported], { fetchedAt: at }),
    ).toMatchObject({ addedCount: 1, changedCount: 0 });
    const reencountered = await snapshot(target);
    expect(reencountered.parents).toHaveLength(2);
    expect(reencountered.parents.find((row) => row.id === feedbackId)).toEqual(
      before.parents[0],
    );
    expect(reencountered.cache[0]?.feedbackItemId).not.toBe(feedbackId);
  });

  it('does not renew omitted copies, user edits or failures and makes NOT_FOUND detail content unavailable without inventing deletion', async () => {
    const target = await fixture();
    const original = review(target);
    await importPage(target, [original]);
    const first = await snapshot(target);
    const feedbackId = first.parents[0]!.id;
    await addLocalWork(target, feedbackId);
    const later = new Date(now.getTime() + day);
    await importPage(target, [review(target)], { fetchedAt: later });
    const omitted = (await snapshot(target)).cache.find(
      (row) => row.feedbackItemId === feedbackId,
    )!;
    expect(omitted).toEqual(first.cache[0]);
    const recovery = await start(target, {
      kind: 'DETAIL',
      feedbackId,
      now: later,
    });
    const beforeFailure = await snapshot(target);
    await failGoogleReviewRetrieval(
      database(),
      target.context,
      recovery.lease,
      { category: 'NOT_FOUND', now: later },
    );
    const after = await snapshot(target);
    const missing = after.cache.find(
      (row) => row.feedbackItemId === feedbackId,
    )!;
    expect(missing).toMatchObject({
      fetchedAt: now,
      expiresAt: first.cache[0]!.expiresAt,
      referenceExpiresAt: first.cache[0]!.referenceExpiresAt,
      content: null,
    });
    expect(after.parents).toEqual(beforeFailure.parents);
    expect(after.replies).toEqual(beforeFailure.replies);
    expect(after.notes).toEqual(beforeFailure.notes);
    expect(
      await findFeedbackDetail(database(), target.context, feedbackId, {
        ...googleScope,
        now: later,
      }),
    ).toMatchObject({
      googleContentAvailability: 'unavailable',
      status: 'FOLLOW_UP',
    });
    expect(
      await findGoogleReviewRetrievalSummary(database(), target.context, {
        now: later,
      }),
    ).toMatchObject({
      state: 'failed',
      lastError: 'NOT_FOUND',
      lastSuccessfulAt: later,
    });
  });

  it('makes obsolete binding content/references/cursors immediately unavailable and purges only provider copies', async () => {
    const target = await fixture();
    const imported = review(target);
    await importPage(target, [imported], {
      nextPageToken: 'obsolete-cursor',
      totalReviewCount: 75,
    });
    const feedbackId = (await snapshot(target)).parents[0]!.id;
    await addLocalWork(target, feedbackId);
    const before = await snapshot(target);
    const handle = (
      await findGoogleReviewRetrievalSummary(database(), target.context, {
        now,
      })
    ).continuationHandle!;
    await database()
      .update(reputationConnectors)
      .set({ bindingGeneration: 2 })
      .where(
        and(
          eq(reputationConnectors.organizationId, target.organizationId),
          eq(reputationConnectors.id, target.connectorId),
        ),
      );
    expect(
      await findFeedbackDetail(database(), target.context, feedbackId, {
        ...googleScope,
        now,
      }),
    ).toMatchObject({
      googleContentAvailability: 'unavailable',
      canRecoverReference: false,
      content: null,
    });
    expect(
      await beginGoogleReviewRetrieval(database(), target.context, {
        sessionId: target.sessionId,
        kind: 'HISTORY',
        continuationHandle: handle,
        now,
      }),
    ).toEqual({ status: 'INVALID_CONTINUATION' });
    expect(
      await beginGoogleReviewRetrieval(database(), target.context, {
        sessionId: target.sessionId,
        kind: 'DETAIL',
        feedbackId,
        now,
      }),
    ).toEqual({ status: 'NO_REFERENCE' });
    expect(
      await purgeGoogleReviewCache(database(), target, { now, limit: 100 }),
    ).toMatchObject({ referencesRemoved: 1, continuationsCleared: 1 });
    const after = await snapshot(target);
    expect(after.cache).toEqual([]);
    expect(after.parents).toEqual(before.parents);
    expect(after.replies).toEqual(before.replies);
    expect(after.notes).toEqual(before.notes);
  });

  it('expires temporary continuation/count coverage while retaining own successful attempt evidence', async () => {
    const target = await fixture();
    await importPage(target, [review(target)], {
      nextPageToken: 'expired-cursor',
      totalReviewCount: 75,
    });
    const initial = await findGoogleReviewRetrievalSummary(
      database(),
      target.context,
      { now },
    );
    const at = new Date(now.getTime() + 15 * 60 * 1_000);
    expect(
      await beginGoogleReviewRetrieval(database(), target.context, {
        sessionId: target.sessionId,
        kind: 'HISTORY',
        continuationHandle: initial.continuationHandle!,
        now: at,
      }),
    ).toEqual({ status: 'INVALID_CONTINUATION' });
    expect(
      await findGoogleReviewRetrievalSummary(database(), target.context, {
        now: at,
      }),
    ).toMatchObject({
      continuationHandle: null,
      coverage: 'none',
      lastBatchCount: null,
      lastSuccessfulAt: now,
    });
    expect(
      await purgeGoogleReviewCache(database(), target, { now: at, limit: 100 }),
    ).toMatchObject({
      contentCleared: 0,
      referencesRemoved: 0,
      continuationsCleared: 1,
    });
    expect((await snapshot(target)).state[0]).toMatchObject({
      state: 'COMPLETED',
      lastSuccessfulBatchAt: now,
      lastSuccessfulRecentAt: now,
      nextPageToken: null,
      returnedCount: null,
      totalReviewCount: null,
    });
  });
});
