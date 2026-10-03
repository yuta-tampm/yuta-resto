import { randomUUID } from 'node:crypto';
import type { TenantContext } from '@yuta/tenant';
import { googleReviewRetrievalErrorSchema } from '@yuta/contracts/reputation';
import {
  and,
  eq,
  getTableColumns,
  gt,
  inArray,
  isNull,
  lte,
  or,
  sql,
} from 'drizzle-orm';
import { v7 as uuidv7 } from 'uuid';
import type { CloudDatabaseClient } from './client';
import {
  clearExpiredGoogleReplyPreviews,
  listDueGoogleReplyPreviewScopes,
} from './google-reply-publication-lifecycle';
import {
  authSessions,
  establishments,
  feedbackItems,
  googleReviewCache,
  googleReviewRetrievalStates,
  organizations,
  reputationConnectors,
  tenantEntitlements,
  tenantMemberships,
  users,
} from './schema';

type Transaction = Parameters<
  Parameters<CloudDatabaseClient['transaction']>[0]
>[0];
export type GoogleReviewDatabase = CloudDatabaseClient | Transaction;
type RepositoryDatabase = GoogleReviewDatabase;
export type GoogleReviewRetrievalKind = 'RECENT' | 'HISTORY' | 'DETAIL';
export type GoogleReviewRetrievalErrorCategory =
  | 'AUTH_REQUIRED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'PROVIDER_UNAVAILABLE'
  | 'INVALID_RESPONSE'
  | 'IDENTITY_CONFLICT'
  | 'STALE_AUTHORITY'
  | 'CONFIGURATION_UNAVAILABLE';
export class GoogleReviewRetrievalRepositoryError extends Error {
  constructor(public readonly code: GoogleReviewRetrievalErrorCategory) {
    super('Google review retrieval cannot be completed.');
    this.name = 'GoogleReviewRetrievalRepositoryError';
  }
}
export type GoogleReviewBinding = Readonly<{
  connectorId: string;
  bindingGeneration: number;
  externalAccountId: string;
  externalLocationId: string;
}>;
export type GoogleReviewActorFence = Readonly<{
  sessionId: string;
  userId: string;
  membershipId: string;
  authVersion: number;
}>;
export type GoogleReviewRetrievalLease = Readonly<{
  attemptId: string;
  sequenceId: string;
  kind: GoogleReviewRetrievalKind;
  organizationId: string;
  establishmentId: string;
  binding: GoogleReviewBinding;
  actor: GoogleReviewActorFence;
  leaseExpiresAt: Date;
  feedbackId: string | null;
  reviewName: string | null;
}>;
export type GoogleReviewImportRecord = Readonly<{
  reviewName: string;
  reviewId: string;
  authorName: string | null;
  rating: number;
  content: string | null;
  providerCreatedAt: Date;
  providerUpdatedAt: Date;
  remoteReply: Readonly<{
    content: string;
    updatedAt: Date;
    status: string | null;
  }> | null;
}>;
export type GoogleReviewBeginResult =
  | {
      status: 'STARTED';
      lease: GoogleReviewRetrievalLease;
      providerRequest: { pageToken: string | null; reviewName: string | null };
    }
  | {
      status:
        | 'FRESH'
        | 'PENDING'
        | 'UNAVAILABLE'
        | 'INVALID_CONTINUATION'
        | 'NO_REFERENCE';
    };
export type GoogleReviewRetrievalSummary = {
  state:
    | 'never'
    | 'pending'
    | 'failed'
    | 'completed_empty'
    | 'completed_content'
    | 'unavailable';
  bound: boolean;
  lastAttemptKind: GoogleReviewRetrievalKind | null;
  lastAttemptAt: Date | null;
  lastSuccessfulAt: Date | null;
  lastRecentSuccessAt: Date | null;
  lastError: GoogleReviewRetrievalErrorCategory | null;
  coverage: 'none' | 'partial' | 'end';
  continuationHandle: string | null;
  lastBatchCount: number | null;
  currentContentAvailable: boolean;
};
export const GOOGLE_REVIEW_CONTENT_LIFETIME_MS = 29 * 24 * 60 * 60 * 1000;
export const GOOGLE_REVIEW_REFERENCE_LIFETIME_MS = 30 * 24 * 60 * 60 * 1000;
export const GOOGLE_REVIEW_STALE_MS = 15 * 60 * 1000;
export const GOOGLE_REVIEW_CONTINUATION_LIFETIME_MS = 15 * 60 * 1000;
const LEASE_LIFETIME_MS = 2 * 60 * 1000;

function requireRetrievalActor(context: TenantContext) {
  if (
    !context.establishmentId ||
    context.actor.type !== 'user' ||
    !['OWNER', 'MANAGER'].includes(context.actor.role) ||
    !context.entitlements.has('reputation.enabled')
  ) {
    throw new GoogleReviewRetrievalRepositoryError('FORBIDDEN');
  }
  return { establishmentId: context.establishmentId, actor: context.actor };
}
function scopeCondition(
  context: Pick<TenantContext, 'organizationId' | 'establishmentId'>,
) {
  if (!context.establishmentId)
    throw new GoogleReviewRetrievalRepositoryError('FORBIDDEN');
  return and(
    eq(reputationConnectors.organizationId, context.organizationId),
    eq(reputationConnectors.establishmentId, context.establishmentId),
    eq(reputationConnectors.provider, 'GOOGLE'),
  );
}
function bindingCondition(
  context: TenantContext,
  binding: GoogleReviewBinding,
) {
  return and(
    scopeCondition(context),
    eq(reputationConnectors.id, binding.connectorId),
    eq(reputationConnectors.bindingGeneration, binding.bindingGeneration),
    eq(reputationConnectors.externalAccountId, binding.externalAccountId),
    eq(reputationConnectors.externalLocationId, binding.externalLocationId),
    eq(reputationConnectors.status, 'CONNECTED'),
  );
}
function stateScope(
  context: Pick<TenantContext, 'organizationId' | 'establishmentId'>,
  connectorId: string,
) {
  if (!context.establishmentId)
    throw new GoogleReviewRetrievalRepositoryError('FORBIDDEN');
  return and(
    eq(googleReviewRetrievalStates.organizationId, context.organizationId),
    eq(googleReviewRetrievalStates.establishmentId, context.establishmentId),
    eq(googleReviewRetrievalStates.connectorId, connectorId),
  );
}
function cacheScope(
  context: Pick<TenantContext, 'organizationId' | 'establishmentId'>,
) {
  if (!context.establishmentId)
    throw new GoogleReviewRetrievalRepositoryError('FORBIDDEN');
  return and(
    eq(googleReviewCache.organizationId, context.organizationId),
    eq(googleReviewCache.establishmentId, context.establishmentId),
  );
}
const clearCoverage = {
  continuationHandle: null,
  nextPageToken: null,
  coverageExpiresAt: null,
  returnedCount: null,
  addedCount: null,
  changedCount: null,
  totalReviewCount: null,
  hasMore: null,
  recentEmpty: null,
};
const clearContent = {
  authorName: null,
  rating: null,
  content: null,
  providerCreatedAt: null,
  providerUpdatedAt: null,
  remoteReplyContent: null,
  remoteReplyUpdatedAt: null,
  remoteReplyStatus: null,
  needsReview: false,
};

// Shared row locks serialize commit with every ordinary revocation/update.
export async function lockGoogleReviewActorAuthority(
  transaction: Transaction,
  context: TenantContext,
  sessionId: string,
  now: Date,
  captured?: GoogleReviewActorFence,
): Promise<GoogleReviewActorFence> {
  const { establishmentId, actor } = requireRetrievalActor(context);
  const [authority] = await transaction
    .select({ authVersion: authSessions.authVersion })
    .from(authSessions)
    .innerJoin(users, eq(users.id, authSessions.userId))
    .innerJoin(
      tenantMemberships,
      and(
        eq(tenantMemberships.id, actor.membershipId),
        eq(tenantMemberships.userId, users.id),
        eq(tenantMemberships.organizationId, context.organizationId),
        eq(tenantMemberships.establishmentId, establishmentId),
      ),
    )
    .innerJoin(organizations, eq(organizations.id, context.organizationId))
    .innerJoin(
      establishments,
      and(
        eq(establishments.id, establishmentId),
        eq(establishments.organizationId, context.organizationId),
      ),
    )
    .innerJoin(
      tenantEntitlements,
      and(
        eq(tenantEntitlements.organizationId, context.organizationId),
        eq(tenantEntitlements.establishmentId, establishmentId),
        eq(tenantEntitlements.key, 'reputation.enabled'),
      ),
    )
    .where(
      and(
        eq(authSessions.id, sessionId),
        eq(authSessions.userId, actor.userId),
        eq(authSessions.organizationId, context.organizationId),
        eq(authSessions.establishmentId, establishmentId),
        isNull(authSessions.revokedAt),
        gt(authSessions.expiresAt, now),
        eq(users.status, 'ACTIVE'),
        eq(authSessions.authVersion, users.authVersion),
        eq(tenantMemberships.status, 'active'),
        eq(tenantMemberships.role, actor.role),
        eq(organizations.status, 'active'),
        eq(establishments.status, 'active'),
        eq(tenantEntitlements.enabled, true),
        captured
          ? eq(authSessions.authVersion, captured.authVersion)
          : undefined,
      ),
    )
    .limit(1)
    .for('share', {
      of: [
        authSessions,
        users,
        tenantMemberships,
        organizations,
        establishments,
        tenantEntitlements,
      ],
    });
  if (
    !authority ||
    (captured &&
      (captured.sessionId !== sessionId ||
        captured.userId !== actor.userId ||
        captured.membershipId !== actor.membershipId))
  ) {
    throw new GoogleReviewRetrievalRepositoryError('STALE_AUTHORITY');
  }
  return {
    sessionId,
    userId: actor.userId,
    membershipId: actor.membershipId,
    authVersion: authority.authVersion,
  };
}
function currentBinding(
  connector: typeof reputationConnectors.$inferSelect,
): GoogleReviewBinding {
  return {
    connectorId: connector.id,
    bindingGeneration: connector.bindingGeneration,
    externalAccountId: connector.externalAccountId,
    externalLocationId: connector.externalLocationId,
  };
}
function eligibleStateProjection(now: Date, generation: number) {
  const eligible = and(
    eq(googleReviewRetrievalStates.bindingGeneration, generation),
    gt(googleReviewRetrievalStates.coverageExpiresAt, now),
  );
  return {
    ...getTableColumns(googleReviewRetrievalStates),
    continuationHandle: sql<
      string | null
    >`case when ${eligible} then ${googleReviewRetrievalStates.continuationHandle} else null end`,
    nextPageToken: sql<
      string | null
    >`case when ${eligible} then ${googleReviewRetrievalStates.nextPageToken} else null end`,
    returnedCount: sql<
      number | null
    >`case when ${eligible} then ${googleReviewRetrievalStates.returnedCount} else null end`,
    addedCount: sql<
      number | null
    >`case when ${eligible} then ${googleReviewRetrievalStates.addedCount} else null end`,
    changedCount: sql<
      number | null
    >`case when ${eligible} then ${googleReviewRetrievalStates.changedCount} else null end`,
    totalReviewCount: sql<
      number | null
    >`case when ${eligible} then ${googleReviewRetrievalStates.totalReviewCount} else null end`,
    hasMore: sql<
      boolean | null
    >`case when ${eligible} then ${googleReviewRetrievalStates.hasMore} else null end`,
    recentEmpty: sql<
      boolean | null
    >`case when ${eligible} then ${googleReviewRetrievalStates.recentEmpty} else null end`,
  };
}

export async function beginGoogleReviewRetrieval(
  db: CloudDatabaseClient,
  context: TenantContext,
  input: {
    sessionId: string;
    kind: GoogleReviewRetrievalKind;
    force?: boolean;
    feedbackId?: string;
    continuationHandle?: string;
    now: Date;
  },
): Promise<GoogleReviewBeginResult> {
  const { establishmentId } = requireRetrievalActor(context);
  return db.transaction(async (transaction) => {
    const actor = await lockGoogleReviewActorAuthority(
      transaction,
      context,
      input.sessionId,
      input.now,
    );
    const [connector] = await transaction
      .select()
      .from(reputationConnectors)
      .where(scopeCondition(context))
      .limit(1)
      .for('update');
    if (
      !connector ||
      connector.status !== 'CONNECTED' ||
      !connector.externalAccountId ||
      !connector.externalLocationId
    ) {
      return { status: 'UNAVAILABLE' };
    }
    const binding = currentBinding(connector);
    let [state] = await transaction
      .select(eligibleStateProjection(input.now, connector.bindingGeneration))
      .from(googleReviewRetrievalStates)
      .where(stateScope(context, connector.id))
      .limit(1)
      .for('update');
    const current = state?.bindingGeneration === connector.bindingGeneration;
    if (
      current &&
      state?.state === 'PENDING' &&
      state.leaseExpiresAt &&
      state.leaseExpiresAt > input.now
    ) {
      return { status: 'PENDING' };
    }
    let pageToken: string | null = null;
    let reviewName: string | null = null;
    if (input.kind === 'HISTORY') {
      if (
        !current ||
        !state?.sequenceId ||
        !input.continuationHandle ||
        state.continuationHandle !== input.continuationHandle ||
        !state.nextPageToken ||
        !state.coverageExpiresAt ||
        state.coverageExpiresAt <= input.now
      ) {
        return { status: 'INVALID_CONTINUATION' };
      }
      pageToken = state.nextPageToken;
    }
    if (input.kind === 'DETAIL') {
      if (!input.feedbackId) return { status: 'NO_REFERENCE' };
      const [reference] = await transaction
        .select({ reviewName: googleReviewCache.reviewName })
        .from(googleReviewCache)
        .innerJoin(
          feedbackItems,
          and(
            eq(feedbackItems.id, googleReviewCache.feedbackItemId),
            eq(feedbackItems.organizationId, context.organizationId),
            eq(feedbackItems.establishmentId, establishmentId),
            eq(feedbackItems.googleImporterOwned, true),
          ),
        )
        .where(
          and(
            cacheScope(context),
            eq(googleReviewCache.feedbackItemId, input.feedbackId),
            eq(googleReviewCache.connectorId, connector.id),
            eq(
              googleReviewCache.bindingGeneration,
              connector.bindingGeneration,
            ),
            gt(googleReviewCache.referenceExpiresAt, input.now),
          ),
        )
        .limit(1);
      if (!reference) return { status: 'NO_REFERENCE' };
      reviewName = reference.reviewName;
    }
    if (
      input.kind === 'RECENT' &&
      !input.force &&
      current &&
      state?.lastSuccessfulRecentAt &&
      input.now.getTime() - state.lastSuccessfulRecentAt.getTime() <
        GOOGLE_REVIEW_STALE_MS
    ) {
      const [usableContent] = await transaction
        .select({ id: googleReviewCache.id })
        .from(googleReviewCache)
        .where(
          and(
            cacheScope(context),
            eq(googleReviewCache.connectorId, connector.id),
            eq(
              googleReviewCache.bindingGeneration,
              connector.bindingGeneration,
            ),
            gt(googleReviewCache.expiresAt, input.now),
            isNull(googleReviewCache.contentClearedAt),
          ),
        )
        .limit(1);
      if (usableContent || state.recentEmpty) return { status: 'FRESH' };
    }
    const attemptId = uuidv7();
    const sequenceId =
      input.kind === 'RECENT'
        ? uuidv7()
        : current && state?.sequenceId
          ? state.sequenceId
          : uuidv7();
    const leaseExpiresAt = new Date(input.now.getTime() + LEASE_LIFETIME_MS);
    const values = {
      organizationId: context.organizationId,
      establishmentId,
      connectorId: connector.id,
      bindingGeneration: connector.bindingGeneration,
      attemptId,
      sequenceId,
      kind: input.kind,
      state: 'PENDING' as const,
      startedAt: input.now,
      finishedAt: null,
      leaseExpiresAt,
      errorCategory: null,
      ...(!current
        ? {
            ...clearCoverage,
            lastSuccessfulBatchAt: null,
            lastSuccessfulRecentAt: null,
          }
        : input.kind === 'RECENT'
          ? clearCoverage
          : {}),
    };
    if (state) {
      await transaction
        .update(googleReviewRetrievalStates)
        .set(values)
        .where(stateScope(context, connector.id));
    } else {
      [state] = await transaction
        .insert(googleReviewRetrievalStates)
        .values({ id: uuidv7(), ...values })
        .returning();
    }
    return {
      status: 'STARTED',
      providerRequest: { pageToken, reviewName },
      lease: {
        attemptId,
        sequenceId,
        kind: input.kind,
        organizationId: context.organizationId,
        establishmentId,
        binding,
        actor,
        leaseExpiresAt,
        feedbackId: input.feedbackId ?? null,
        reviewName,
      },
    };
  });
}

export async function findCapturedGoogleConnectorCredentials(
  db: GoogleReviewDatabase,
  context: TenantContext,
  binding: GoogleReviewBinding,
) {
  requireRetrievalActor(context);
  const [credentials] = await db
    .select({
      encryptedAccessToken: reputationConnectors.encryptedAccessToken,
      encryptedRefreshToken: reputationConnectors.encryptedRefreshToken,
      tokenExpiresAt: reputationConnectors.tokenExpiresAt,
      grantedScopes: reputationConnectors.grantedScopes,
    })
    .from(reputationConnectors)
    .where(bindingCondition(context, binding))
    .limit(1);
  return credentials ?? null;
}
export async function updateCapturedGoogleConnectorAccessToken(
  db: GoogleReviewDatabase,
  context: TenantContext,
  binding: GoogleReviewBinding,
  input: {
    encryptedAccessToken: string;
    tokenExpiresAt: Date;
    grantedScopes?: string[];
  },
) {
  requireRetrievalActor(context);
  const rows = await db
    .update(reputationConnectors)
    .set({
      encryptedAccessToken: input.encryptedAccessToken,
      tokenExpiresAt: input.tokenExpiresAt,
      ...(input.grantedScopes ? { grantedScopes: input.grantedScopes } : {}),
    })
    .where(bindingCondition(context, binding))
    .returning({ id: reputationConnectors.id });
  return rows.length === 1;
}

async function lockLease(
  transaction: Transaction,
  context: TenantContext,
  lease: GoogleReviewRetrievalLease,
  now: Date,
) {
  if (
    lease.organizationId !== context.organizationId ||
    lease.establishmentId !== context.establishmentId
  ) {
    throw new GoogleReviewRetrievalRepositoryError('STALE_AUTHORITY');
  }
  await lockGoogleReviewActorAuthority(
    transaction,
    context,
    lease.actor.sessionId,
    now,
    lease.actor,
  );
  const [connector] = await transaction
    .select({ id: reputationConnectors.id })
    .from(reputationConnectors)
    .where(bindingCondition(context, lease.binding))
    .limit(1)
    .for('update');
  if (!connector)
    throw new GoogleReviewRetrievalRepositoryError('STALE_AUTHORITY');
  const [state] = await transaction
    .select(eligibleStateProjection(now, lease.binding.bindingGeneration))
    .from(googleReviewRetrievalStates)
    .where(
      and(
        stateScope(context, connector.id),
        eq(
          googleReviewRetrievalStates.bindingGeneration,
          lease.binding.bindingGeneration,
        ),
        eq(googleReviewRetrievalStates.attemptId, lease.attemptId),
        eq(googleReviewRetrievalStates.state, 'PENDING'),
        gt(googleReviewRetrievalStates.leaseExpiresAt, now),
      ),
    )
    .limit(1)
    .for('update');
  if (
    !state ||
    state.sequenceId !== lease.sequenceId ||
    state.kind !== lease.kind ||
    (lease.kind === 'HISTORY' &&
      (!state.coverageExpiresAt || state.coverageExpiresAt <= now))
  ) {
    throw new GoogleReviewRetrievalRepositoryError('STALE_AUTHORITY');
  }
  return state;
}
function validatedRecords(
  lease: GoogleReviewRetrievalLease,
  input: {
    reviews: readonly GoogleReviewImportRecord[];
    totalReviewCount?: number | null;
    nextPageToken?: string | null;
    fetchedAt: Date;
  },
) {
  const prefix = `${lease.binding.externalAccountId}/${lease.binding.externalLocationId}/reviews/`;
  if (
    !Number.isFinite(input.fetchedAt.getTime()) ||
    input.reviews.length > 50 ||
    (input.totalReviewCount !== undefined &&
      input.totalReviewCount !== null &&
      (!Number.isInteger(input.totalReviewCount) ||
        input.totalReviewCount < 0)) ||
    (input.nextPageToken !== undefined &&
      input.nextPageToken !== null &&
      (!input.nextPageToken || input.nextPageToken.length > 8192)) ||
    (lease.kind === 'DETAIL' &&
      (input.reviews.length !== 1 || input.nextPageToken))
  ) {
    throw new GoogleReviewRetrievalRepositoryError('INVALID_RESPONSE');
  }
  const unique = new Map<string, GoogleReviewImportRecord>();
  for (const record of input.reviews) {
    if (
      !/^[^/\\?#\s]+$/u.test(record.reviewId) ||
      record.reviewId.length > 255 ||
      record.reviewName !== `${prefix}${record.reviewId}` ||
      record.reviewName.length > 1024 ||
      (lease.kind === 'DETAIL' && record.reviewName !== lease.reviewName) ||
      !Number.isInteger(record.rating) ||
      record.rating < 1 ||
      record.rating > 5 ||
      (record.authorName !== null && record.authorName.length > 255) ||
      !Number.isFinite(record.providerCreatedAt.getTime()) ||
      !Number.isFinite(record.providerUpdatedAt.getTime()) ||
      (record.remoteReply &&
        (!Number.isFinite(record.remoteReply.updatedAt.getTime()) ||
          (record.remoteReply.status !== null &&
            record.remoteReply.status.length > 100)))
    ) {
      throw new GoogleReviewRetrievalRepositoryError('INVALID_RESPONSE');
    }
    const prior = unique.get(record.reviewName);
    if (prior && JSON.stringify(prior) !== JSON.stringify(record)) {
      throw new GoogleReviewRetrievalRepositoryError('INVALID_RESPONSE');
    }
    unique.set(record.reviewName, record);
  }
  return [...unique.values()];
}
function isUniqueViolation(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const cause: unknown = error.cause;
  return (
    ('code' in error && error.code === '23505') || isUniqueViolation(cause)
  );
}

export async function commitGoogleReviewRetrieval(
  db: CloudDatabaseClient,
  context: TenantContext,
  lease: GoogleReviewRetrievalLease,
  input: {
    reviews: readonly GoogleReviewImportRecord[];
    totalReviewCount?: number | null;
    nextPageToken?: string | null;
    fetchedAt: Date;
  },
): Promise<{
  status: 'COMPLETED';
  addedCount: number;
  changedCount: number;
  returnedCount: number;
}> {
  requireRetrievalActor(context);
  const records = validatedRecords(lease, input);
  try {
    return await db.transaction(async (transaction) => {
      const state = await lockLease(
        transaction,
        context,
        lease,
        input.fetchedAt,
      );
      // Serialize the temporary provider identity across establishment bindings.
      await transaction.execute(
        sql`select pg_advisory_xact_lock(hashtextextended(${`${context.organizationId}:${lease.binding.externalLocationId}`}, 0))`,
      );
      await transaction
        .delete(googleReviewCache)
        .where(
          and(
            cacheScope(context),
            eq(googleReviewCache.connectorId, lease.binding.connectorId),
            or(
              lte(googleReviewCache.referenceExpiresAt, input.fetchedAt),
              sql`${googleReviewCache.bindingGeneration} <> ${lease.binding.bindingGeneration}`,
            ),
          ),
        );
      let addedCount = 0;
      let changedCount = 0;
      for (const record of records) {
        const [legacyConflict] = await transaction
          .select({ id: feedbackItems.id })
          .from(feedbackItems)
          .where(
            and(
              eq(feedbackItems.organizationId, context.organizationId),
              eq(feedbackItems.source, 'GOOGLE'),
              eq(feedbackItems.googleImporterOwned, false),
              inArray(feedbackItems.externalId, [
                record.reviewId,
                record.reviewName,
              ]),
            ),
          )
          .limit(1);
        if (legacyConflict)
          throw new GoogleReviewRetrievalRepositoryError('IDENTITY_CONFLICT');
        const [identity] = await transaction
          .select({
            establishmentId: googleReviewCache.establishmentId,
            connectorId: googleReviewCache.connectorId,
            bindingGeneration: googleReviewCache.bindingGeneration,
          })
          .from(googleReviewCache)
          .where(
            and(
              eq(googleReviewCache.organizationId, context.organizationId),
              eq(
                googleReviewCache.externalLocationId,
                lease.binding.externalLocationId,
              ),
              eq(googleReviewCache.reviewName, record.reviewName),
              gt(googleReviewCache.referenceExpiresAt, input.fetchedAt),
            ),
          )
          .limit(1);
        if (
          identity &&
          (identity.establishmentId !== context.establishmentId ||
            identity.connectorId !== lease.binding.connectorId ||
            identity.bindingGeneration !== lease.binding.bindingGeneration)
        ) {
          throw new GoogleReviewRetrievalRepositoryError('IDENTITY_CONFLICT');
        }
        const [mapping] = await transaction
          .select({
            id: googleReviewCache.id,
            establishmentId: googleReviewCache.establishmentId,
            feedbackItemId: googleReviewCache.feedbackItemId,
            connectorId: googleReviewCache.connectorId,
            bindingGeneration: googleReviewCache.bindingGeneration,
            rating: sql<
              number | null
            >`case when ${googleReviewCache.expiresAt} > ${input.fetchedAt.toISOString()}::timestamptz and ${googleReviewCache.contentClearedAt} is null then ${googleReviewCache.rating} else null end`,
            content: sql<
              string | null
            >`case when ${googleReviewCache.expiresAt} > ${input.fetchedAt.toISOString()}::timestamptz and ${googleReviewCache.contentClearedAt} is null then ${googleReviewCache.content} else null end`,
            eligibleContent: sql<boolean>`${googleReviewCache.expiresAt} > ${input.fetchedAt.toISOString()}::timestamptz and ${googleReviewCache.contentClearedAt} is null`,
            needsReview: sql<boolean>`case when ${googleReviewCache.expiresAt} > ${input.fetchedAt.toISOString()}::timestamptz and ${googleReviewCache.contentClearedAt} is null then ${googleReviewCache.needsReview} else false end`,
          })
          .from(googleReviewCache)
          .where(
            and(
              cacheScope(context),
              eq(
                googleReviewCache.externalLocationId,
                lease.binding.externalLocationId,
              ),
              eq(googleReviewCache.reviewName, record.reviewName),
              gt(googleReviewCache.referenceExpiresAt, input.fetchedAt),
            ),
          )
          .limit(1)
          .for('update');
        if (
          mapping &&
          (mapping.establishmentId !== context.establishmentId ||
            mapping.connectorId !== lease.binding.connectorId ||
            mapping.bindingGeneration !== lease.binding.bindingGeneration)
        ) {
          throw new GoogleReviewRetrievalRepositoryError('IDENTITY_CONFLICT');
        }
        if (
          lease.kind === 'DETAIL' &&
          (!mapping || mapping.feedbackItemId !== lease.feedbackId)
        ) {
          throw new GoogleReviewRetrievalRepositoryError('STALE_AUTHORITY');
        }
        let feedbackItemId = mapping?.feedbackItemId;
        if (!feedbackItemId) {
          feedbackItemId = uuidv7();
          await transaction.insert(feedbackItems).values({
            id: feedbackItemId,
            organizationId: lease.organizationId,
            establishmentId: lease.establishmentId,
            source: 'GOOGLE',
            type: 'PUBLIC_REVIEW',
            googleImporterOwned: true,
            status: 'NEW',
            receivedAt: input.fetchedAt,
            createdAt: input.fetchedAt,
            updatedAt: input.fetchedAt,
          });
          addedCount += 1;
        } else {
          const [parent] = await transaction
            .select({ id: feedbackItems.id })
            .from(feedbackItems)
            .where(
              and(
                eq(feedbackItems.id, feedbackItemId),
                eq(feedbackItems.organizationId, lease.organizationId),
                eq(feedbackItems.establishmentId, lease.establishmentId),
                eq(feedbackItems.googleImporterOwned, true),
              ),
            )
            .limit(1)
            .for('update');
          if (!parent)
            throw new GoogleReviewRetrievalRepositoryError('IDENTITY_CONFLICT');
        }
        const changed = Boolean(
          mapping?.eligibleContent &&
          (mapping.rating !== record.rating ||
            mapping.content !== record.content),
        );
        if (changed) changedCount += 1;
        const copy = {
          organizationId: lease.organizationId,
          establishmentId: lease.establishmentId,
          feedbackItemId,
          connectorId: lease.binding.connectorId,
          bindingGeneration: lease.binding.bindingGeneration,
          externalLocationId: lease.binding.externalLocationId,
          reviewName: record.reviewName,
          authorName: record.authorName,
          rating: record.rating,
          content: record.content,
          providerCreatedAt: record.providerCreatedAt,
          providerUpdatedAt: record.providerUpdatedAt,
          remoteReplyContent: record.remoteReply?.content ?? null,
          remoteReplyUpdatedAt: record.remoteReply?.updatedAt ?? null,
          remoteReplyStatus: record.remoteReply?.status ?? null,
          needsReview: changed || (mapping?.needsReview ?? false),
          fetchedAt: input.fetchedAt,
          expiresAt: new Date(
            input.fetchedAt.getTime() + GOOGLE_REVIEW_CONTENT_LIFETIME_MS,
          ),
          referenceExpiresAt: new Date(
            input.fetchedAt.getTime() + GOOGLE_REVIEW_REFERENCE_LIFETIME_MS,
          ),
          contentClearedAt: null,
        };
        if (mapping) {
          await transaction
            .update(googleReviewCache)
            .set(copy)
            .where(
              and(cacheScope(context), eq(googleReviewCache.id, mapping.id)),
            );
        } else {
          await transaction
            .insert(googleReviewCache)
            .values({ id: uuidv7(), ...copy });
        }
      }
      const coverageExpiresAt = new Date(
        input.fetchedAt.getTime() + GOOGLE_REVIEW_CONTINUATION_LIFETIME_MS,
      );
      await transaction
        .update(googleReviewRetrievalStates)
        .set({
          state: 'COMPLETED',
          finishedAt: input.fetchedAt,
          leaseExpiresAt: null,
          errorCategory: null,
          lastSuccessfulBatchAt: input.fetchedAt,
          ...(lease.kind === 'RECENT'
            ? {
                lastSuccessfulRecentAt: input.fetchedAt,
                recentEmpty: records.length === 0,
              }
            : {}),
          returnedCount: records.length,
          addedCount,
          changedCount,
          ...(lease.kind === 'DETAIL'
            ? {
                coverageExpiresAt: state.coverageExpiresAt ?? coverageExpiresAt,
              }
            : {
                totalReviewCount: input.totalReviewCount ?? null,
                coverageExpiresAt,
                hasMore: Boolean(input.nextPageToken),
                continuationHandle: input.nextPageToken ? randomUUID() : null,
                nextPageToken: input.nextPageToken ?? null,
              }),
        })
        .where(
          and(
            stateScope(context, lease.binding.connectorId),
            eq(googleReviewRetrievalStates.attemptId, lease.attemptId),
          ),
        );
      return {
        status: 'COMPLETED',
        addedCount,
        changedCount,
        returnedCount: records.length,
      };
    });
  } catch (error: unknown) {
    if (isUniqueViolation(error))
      throw new GoogleReviewRetrievalRepositoryError('IDENTITY_CONFLICT');
    throw error;
  }
}

export async function failGoogleReviewRetrieval(
  db: CloudDatabaseClient,
  context: TenantContext,
  lease: GoogleReviewRetrievalLease,
  input: { category: GoogleReviewRetrievalErrorCategory; now: Date },
): Promise<boolean> {
  requireRetrievalActor(context);
  if (!googleReviewRetrievalErrorSchema.safeParse(input.category).success) {
    throw new GoogleReviewRetrievalRepositoryError('INVALID_RESPONSE');
  }
  return db.transaction(async (transaction) => {
    try {
      await lockLease(transaction, context, lease, input.now);
    } catch (error: unknown) {
      if (
        error instanceof GoogleReviewRetrievalRepositoryError &&
        error.code === 'STALE_AUTHORITY'
      )
        return false;
      throw error;
    }
    if (
      lease.kind === 'DETAIL' &&
      input.category === 'NOT_FOUND' &&
      lease.feedbackId
    ) {
      await transaction
        .update(googleReviewCache)
        .set({ ...clearContent, contentClearedAt: input.now })
        .where(
          and(
            cacheScope(context),
            eq(googleReviewCache.feedbackItemId, lease.feedbackId),
            eq(googleReviewCache.connectorId, lease.binding.connectorId),
            eq(
              googleReviewCache.bindingGeneration,
              lease.binding.bindingGeneration,
            ),
          ),
        );
    }
    await transaction
      .update(googleReviewRetrievalStates)
      .set({
        state: 'FAILED',
        finishedAt: input.now,
        leaseExpiresAt: null,
        errorCategory: input.category,
      })
      .where(
        and(
          stateScope(context, lease.binding.connectorId),
          eq(googleReviewRetrievalStates.attemptId, lease.attemptId),
        ),
      );
    return true;
  });
}

export async function findGoogleReviewRetrievalSummary(
  db: RepositoryDatabase,
  context: TenantContext,
  input: { now: Date },
): Promise<GoogleReviewRetrievalSummary> {
  const [connector] = await db
    .select({
      id: reputationConnectors.id,
      generation: reputationConnectors.bindingGeneration,
      bound: sql<boolean>`${reputationConnectors.status} = 'CONNECTED' and ${reputationConnectors.externalAccountId} <> '' and ${reputationConnectors.externalLocationId} <> ''`,
    })
    .from(reputationConnectors)
    .where(scopeCondition(context))
    .limit(1);
  const base: GoogleReviewRetrievalSummary = {
    state: connector?.bound ? 'never' : 'unavailable',
    bound: connector?.bound ?? false,
    lastAttemptKind: null,
    lastAttemptAt: null,
    lastSuccessfulAt: null,
    lastRecentSuccessAt: null,
    lastError: null,
    coverage: 'none',
    continuationHandle: null,
    lastBatchCount: null,
    currentContentAvailable: false,
  };
  if (!connector?.bound) return base;
  const [state] = await db
    .select({
      state: googleReviewRetrievalStates.state,
      kind: googleReviewRetrievalStates.kind,
      startedAt: googleReviewRetrievalStates.startedAt,
      lastSuccessfulBatchAt: googleReviewRetrievalStates.lastSuccessfulBatchAt,
      lastSuccessfulRecentAt:
        googleReviewRetrievalStates.lastSuccessfulRecentAt,
      leaseExpiresAt: googleReviewRetrievalStates.leaseExpiresAt,
      errorCategory: googleReviewRetrievalStates.errorCategory,
      handle: sql<
        string | null
      >`case when ${googleReviewRetrievalStates.coverageExpiresAt} > ${input.now.toISOString()}::timestamptz then ${googleReviewRetrievalStates.continuationHandle} else null end`,
      returnedCount: sql<
        number | null
      >`case when ${googleReviewRetrievalStates.coverageExpiresAt} > ${input.now.toISOString()}::timestamptz then ${googleReviewRetrievalStates.returnedCount} else null end`,
      hasMore: sql<
        boolean | null
      >`case when ${googleReviewRetrievalStates.coverageExpiresAt} > ${input.now.toISOString()}::timestamptz then ${googleReviewRetrievalStates.hasMore} else null end`,
      recentEmpty: sql<
        boolean | null
      >`case when ${googleReviewRetrievalStates.coverageExpiresAt} > ${input.now.toISOString()}::timestamptz then ${googleReviewRetrievalStates.recentEmpty} else null end`,
    })
    .from(googleReviewRetrievalStates)
    .where(
      and(
        stateScope(context, connector.id),
        eq(googleReviewRetrievalStates.bindingGeneration, connector.generation),
      ),
    )
    .limit(1);
  const [content] = await db
    .select({ id: feedbackItems.id })
    .from(feedbackItems)
    .innerJoin(
      googleReviewCache,
      and(
        eq(googleReviewCache.feedbackItemId, feedbackItems.id),
        cacheScope(context),
        eq(googleReviewCache.connectorId, connector.id),
        eq(googleReviewCache.bindingGeneration, connector.generation),
        gt(googleReviewCache.expiresAt, input.now),
        isNull(googleReviewCache.contentClearedAt),
      ),
    )
    .where(
      and(
        eq(feedbackItems.organizationId, context.organizationId),
        eq(feedbackItems.establishmentId, context.establishmentId!),
        eq(feedbackItems.googleImporterOwned, true),
        context.actor.type === 'user' && context.actor.role === 'STAFF'
          ? eq(feedbackItems.assignedToUserId, context.actor.userId)
          : undefined,
      ),
    )
    .limit(1);
  base.currentContentAvailable = Boolean(content);
  if (!state) return base;
  const staff = context.actor.type === 'user' && context.actor.role === 'STAFF';
  return {
    ...base,
    state:
      state.state === 'PENDING' &&
      state.leaseExpiresAt &&
      state.leaseExpiresAt > input.now
        ? 'pending'
        : state.state === 'FAILED'
          ? 'failed'
          : state.state === 'COMPLETED'
            ? state.returnedCount === null && !content
              ? 'unavailable'
              : state.kind === 'RECENT' && state.recentEmpty
                ? 'completed_empty'
                : 'completed_content'
            : state.state === 'PENDING'
              ? 'failed'
              : 'never',
    lastAttemptKind: state.kind,
    lastAttemptAt: state.startedAt,
    lastSuccessfulAt: state.lastSuccessfulBatchAt,
    lastRecentSuccessAt: state.lastSuccessfulRecentAt,
    lastError:
      state.state === 'PENDING' &&
      (!state.leaseExpiresAt || state.leaseExpiresAt <= input.now)
        ? 'PROVIDER_UNAVAILABLE'
        : (state.errorCategory as GoogleReviewRetrievalErrorCategory | null),
    coverage:
      staff || state.hasMore === null
        ? 'none'
        : state.hasMore
          ? 'partial'
          : 'end',
    continuationHandle: staff ? null : state.handle,
    lastBatchCount: staff ? null : state.returnedCount,
  };
}

export async function listDueGoogleReviewCacheScopes(
  db: CloudDatabaseClient,
  input: { now: Date; limit: number },
) {
  const limit = Math.max(1, Math.min(100, Math.trunc(input.limit)));
  const caches = await db
    .selectDistinct({
      organizationId: googleReviewCache.organizationId,
      establishmentId: googleReviewCache.establishmentId,
    })
    .from(googleReviewCache)
    .innerJoin(
      reputationConnectors,
      and(
        eq(reputationConnectors.id, googleReviewCache.connectorId),
        eq(
          reputationConnectors.organizationId,
          googleReviewCache.organizationId,
        ),
        eq(
          reputationConnectors.establishmentId,
          googleReviewCache.establishmentId,
        ),
      ),
    )
    .where(
      or(
        lte(googleReviewCache.referenceExpiresAt, input.now),
        and(
          lte(googleReviewCache.expiresAt, input.now),
          isNull(googleReviewCache.contentClearedAt),
        ),
        sql`${googleReviewCache.bindingGeneration} <> ${reputationConnectors.bindingGeneration}`,
        sql`${reputationConnectors.status} <> 'CONNECTED'`,
      ),
    )
    .limit(limit);
  const states = await db
    .selectDistinct({
      organizationId: googleReviewRetrievalStates.organizationId,
      establishmentId: googleReviewRetrievalStates.establishmentId,
    })
    .from(googleReviewRetrievalStates)
    .innerJoin(
      reputationConnectors,
      and(
        eq(reputationConnectors.id, googleReviewRetrievalStates.connectorId),
        eq(
          reputationConnectors.organizationId,
          googleReviewRetrievalStates.organizationId,
        ),
        eq(
          reputationConnectors.establishmentId,
          googleReviewRetrievalStates.establishmentId,
        ),
      ),
    )
    .where(
      or(
        lte(googleReviewRetrievalStates.coverageExpiresAt, input.now),
        and(
          sql`${googleReviewRetrievalStates.coverageExpiresAt} is not null`,
          or(
            sql`${googleReviewRetrievalStates.bindingGeneration} <> ${reputationConnectors.bindingGeneration}`,
            sql`${reputationConnectors.status} <> 'CONNECTED'`,
          ),
        ),
      ),
    )
    .limit(limit);
  return [
    ...new Map(
      [
        ...caches,
        ...states,
        ...(await listDueGoogleReplyPreviewScopes(db, input)),
      ].map((scope) => [
        `${scope.organizationId}:${scope.establishmentId}`,
        scope,
      ]),
    ).values(),
  ].slice(0, limit);
}
export async function purgeGoogleReviewCache(
  db: CloudDatabaseClient,
  scope: { organizationId: string; establishmentId: string },
  input: { now: Date; limit: number },
) {
  const limit = Math.max(1, Math.min(1000, Math.trunc(input.limit)));
  return db.transaction(async (transaction) => {
    // Follow retrieval's connector-first order; cleanup cannot invert its locks.
    const [connector] = await transaction
      .select({ id: reputationConnectors.id })
      .from(reputationConnectors)
      .where(scopeCondition(scope))
      .limit(1)
      .for('update', { skipLocked: true });
    if (!connector)
      return {
        contentCleared: 0,
        referencesRemoved: 0,
        continuationsCleared: 0,
      };
    const due = await transaction
      .select({
        id: googleReviewCache.id,
        remove: sql<boolean>`${googleReviewCache.referenceExpiresAt} <= ${input.now.toISOString()}::timestamptz or ${googleReviewCache.bindingGeneration} <> ${reputationConnectors.bindingGeneration} or ${reputationConnectors.status} <> 'CONNECTED'`,
      })
      .from(googleReviewCache)
      .innerJoin(
        reputationConnectors,
        and(
          eq(reputationConnectors.id, googleReviewCache.connectorId),
          eq(reputationConnectors.organizationId, scope.organizationId),
          eq(reputationConnectors.establishmentId, scope.establishmentId),
        ),
      )
      .where(
        and(
          cacheScope(scope),
          or(
            lte(googleReviewCache.referenceExpiresAt, input.now),
            and(
              lte(googleReviewCache.expiresAt, input.now),
              isNull(googleReviewCache.contentClearedAt),
            ),
            sql`${googleReviewCache.bindingGeneration} <> ${reputationConnectors.bindingGeneration}`,
            sql`${reputationConnectors.status} <> 'CONNECTED'`,
          ),
        ),
      )
      .limit(limit)
      .for('update', { of: googleReviewCache, skipLocked: true });
    const removeIds = due.filter((row) => row.remove).map((row) => row.id);
    const clearIds = due.filter((row) => !row.remove).map((row) => row.id);
    if (removeIds.length)
      await transaction
        .delete(googleReviewCache)
        .where(
          and(cacheScope(scope), inArray(googleReviewCache.id, removeIds)),
        );
    if (clearIds.length)
      await transaction
        .update(googleReviewCache)
        .set({ ...clearContent, contentClearedAt: input.now })
        .where(and(cacheScope(scope), inArray(googleReviewCache.id, clearIds)));
    const states = await transaction
      .select({ id: googleReviewRetrievalStates.id })
      .from(googleReviewRetrievalStates)
      .innerJoin(
        reputationConnectors,
        and(
          eq(reputationConnectors.id, googleReviewRetrievalStates.connectorId),
          eq(reputationConnectors.organizationId, scope.organizationId),
          eq(reputationConnectors.establishmentId, scope.establishmentId),
        ),
      )
      .where(
        and(
          eq(googleReviewRetrievalStates.organizationId, scope.organizationId),
          eq(
            googleReviewRetrievalStates.establishmentId,
            scope.establishmentId,
          ),
          or(
            lte(googleReviewRetrievalStates.coverageExpiresAt, input.now),
            and(
              sql`${googleReviewRetrievalStates.coverageExpiresAt} is not null`,
              or(
                sql`${googleReviewRetrievalStates.bindingGeneration} <> ${reputationConnectors.bindingGeneration}`,
                sql`${reputationConnectors.status} <> 'CONNECTED'`,
              ),
            ),
          ),
        ),
      )
      .limit(limit)
      .for('update', { of: googleReviewRetrievalStates, skipLocked: true });
    if (states.length)
      await transaction
        .update(googleReviewRetrievalStates)
        .set(clearCoverage)
        .where(
          and(
            eq(
              googleReviewRetrievalStates.organizationId,
              scope.organizationId,
            ),
            eq(
              googleReviewRetrievalStates.establishmentId,
              scope.establishmentId,
            ),
            inArray(
              googleReviewRetrievalStates.id,
              states.map((row) => row.id),
            ),
          ),
        );
    await clearExpiredGoogleReplyPreviews(transaction, scope, input);
    return {
      contentCleared: clearIds.length,
      referencesRemoved: removeIds.length,
      continuationsCleared: states.length,
    };
  });
}
