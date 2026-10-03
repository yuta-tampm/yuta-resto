import { randomUUID } from 'node:crypto';
import { and, desc, eq, gt, inArray, isNull, lte, sql } from 'drizzle-orm';
import { v7 as uuidv7 } from 'uuid';
import {
  googleReplyTextSchema,
  googleReplyPublicationErrorSchema,
  type GoogleReplyPreviewInput,
  type GoogleReplyPreviewResponse,
  type GoogleReplyPublicationReceipt,
  type GoogleReplyPublicationState,
} from '@yuta/contracts/reputation';
import type { TenantContext } from '@yuta/tenant';
import type { CloudDatabaseClient } from './client';
import {
  authSessions,
  establishments,
  feedbackItems,
  feedbackReplies,
  googleReplyPublications as publications,
  googleReviewCache,
  reputationAuditEvents,
  reputationConnectors,
} from './schema';
import {
  lockGoogleReviewActorAuthority,
  type GoogleReviewActorFence,
  type GoogleReviewBinding,
  type GoogleReviewDatabase,
} from './google-review-retrieval-repository';

type Transaction = Parameters<
  Parameters<CloudDatabaseClient['transaction']>[0]
>[0];
type Attempt = typeof publications.$inferSelect;
type Clock = () => Date;
const unresolved = ['DISPATCHING', 'UNCERTAIN', 'UNCONFIRMED'] as const;
export class GoogleReplyPublicationRepositoryError extends Error {
  constructor(
    public readonly code:
      | 'FORBIDDEN'
      | 'STALE_AUTHORITY'
      | 'NO_REFERENCE'
      | 'VERSION_CHANGED'
      | 'PREVIEW_EXPIRED'
      | 'UNRESOLVED'
      | 'RECONCILE_REQUIRED'
      | 'TEXT_TOO_LONG',
  ) {
    super('Google reply publication cannot be completed.');
    this.name = 'GoogleReplyPublicationRepositoryError';
  }
}
export type GoogleReplyPublicationTarget = Readonly<{
  feedbackId: string;
  replyId: string;
  revision: number;
  text: string;
  establishmentName: string;
  binding: GoogleReviewBinding;
  reviewName: string;
  actor: GoogleReviewActorFence;
  authorityExpiresAt: Date;
}>;
export type GoogleReplyRemotePreview = {
  fingerprint: string;
  remoteReply: { content: string } | null;
};
export type GoogleReplyPublicationResult = {
  state: Exclude<GoogleReplyPublicationState, 'PREVIEW' | 'DISPATCHING'>;
  errorCategory:
    | 'AUTH_REQUIRED'
    | 'REMOTE_CHANGED'
    | 'PREVIEW_EXPIRED'
    | 'PROVIDER_REJECTED'
    | 'PROVIDER_UNAVAILABLE'
    | 'INVALID_RESPONSE'
    | null;
};

function requireActor(context: TenantContext) {
  if (
    !context.establishmentId ||
    context.actor.type !== 'user' ||
    !['OWNER', 'MANAGER'].includes(context.actor.role) ||
    !context.entitlements.has('reputation.enabled')
  )
    throw new GoogleReplyPublicationRepositoryError('FORBIDDEN');
  return context.actor;
}
function scope(
  context: Pick<TenantContext, 'organizationId' | 'establishmentId'>,
) {
  if (!context.establishmentId)
    throw new GoogleReplyPublicationRepositoryError('FORBIDDEN');
  return and(
    eq(publications.organizationId, context.organizationId),
    eq(publications.establishmentId, context.establishmentId),
  );
}
function capturedActor(attempt: Attempt): GoogleReviewActorFence {
  return {
    userId: attempt.actorUserId,
    sessionId: attempt.actorSessionId,
    membershipId: attempt.actorMembershipId,
    authVersion: attempt.actorAuthVersion,
  };
}
function checkOriginal(
  context: TenantContext,
  sessionId: string,
  attempt: Attempt,
) {
  const actor = requireActor(context);
  if (
    actor.userId !== attempt.actorUserId ||
    actor.membershipId !== attempt.actorMembershipId ||
    sessionId !== attempt.actorSessionId
  )
    throw new GoogleReplyPublicationRepositoryError('STALE_AUTHORITY');
}
export function assertGoogleReplyTargetTime(
  target: GoogleReplyPublicationTarget,
  now: Date,
) {
  if (target.authorityExpiresAt <= now)
    throw new GoogleReplyPublicationRepositoryError('STALE_AUTHORITY');
}
async function lockTarget(
  transaction: Transaction,
  context: TenantContext,
  sessionId: string,
  input: Pick<GoogleReplyPreviewInput, 'feedbackId' | 'replyId' | 'revision'>,
  now: Date,
  captured?: Attempt,
  original = true,
): Promise<GoogleReplyPublicationTarget> {
  requireActor(context);
  if (captured && original) checkOriginal(context, sessionId, captured);
  const actor = await lockGoogleReviewActorAuthority(
    transaction,
    context,
    sessionId,
    now,
    captured && original ? capturedActor(captured) : undefined,
  );
  const [connector] = await transaction
    .select()
    .from(reputationConnectors)
    .where(
      and(
        eq(reputationConnectors.organizationId, context.organizationId),
        eq(reputationConnectors.establishmentId, context.establishmentId!),
        eq(reputationConnectors.provider, 'GOOGLE'),
        eq(reputationConnectors.status, 'CONNECTED'),
        captured
          ? eq(reputationConnectors.id, captured.connectorId)
          : undefined,
        captured
          ? eq(
              reputationConnectors.bindingGeneration,
              captured.bindingGeneration,
            )
          : undefined,
      ),
    )
    .limit(1)
    .for('update');
  if (
    !connector ||
    !connector.externalAccountId ||
    !connector.externalLocationId
  )
    throw new GoogleReplyPublicationRepositoryError('STALE_AUTHORITY');
  const [feedback] = await transaction
    .select({ id: feedbackItems.id })
    .from(feedbackItems)
    .where(
      and(
        eq(feedbackItems.id, input.feedbackId),
        eq(feedbackItems.organizationId, context.organizationId),
        eq(feedbackItems.establishmentId, context.establishmentId!),
        eq(feedbackItems.source, 'GOOGLE'),
        eq(feedbackItems.googleImporterOwned, true),
      ),
    )
    .limit(1)
    .for('update');
  if (!feedback)
    throw new GoogleReplyPublicationRepositoryError('NO_REFERENCE');
  const [reply] = await transaction
    .select()
    .from(feedbackReplies)
    .where(
      and(
        eq(feedbackReplies.id, input.replyId),
        eq(feedbackReplies.feedbackItemId, input.feedbackId),
        eq(feedbackReplies.organizationId, context.organizationId),
        eq(feedbackReplies.revision, input.revision),
      ),
    )
    .limit(1)
    .for('update');
  if (!reply)
    throw new GoogleReplyPublicationRepositoryError('VERSION_CHANGED');
  if (!googleReplyTextSchema.safeParse(reply.content).success)
    throw new GoogleReplyPublicationRepositoryError('TEXT_TOO_LONG');
  const [reference] = await transaction
    .select()
    .from(googleReviewCache)
    .where(
      and(
        eq(googleReviewCache.organizationId, context.organizationId),
        eq(googleReviewCache.establishmentId, context.establishmentId!),
        eq(googleReviewCache.feedbackItemId, input.feedbackId),
        eq(googleReviewCache.connectorId, connector.id),
        eq(googleReviewCache.bindingGeneration, connector.bindingGeneration),
        eq(googleReviewCache.externalLocationId, connector.externalLocationId),
        gt(googleReviewCache.referenceExpiresAt, now),
      ),
    )
    .limit(1)
    .for('share');
  if (!reference)
    throw new GoogleReplyPublicationRepositoryError('NO_REFERENCE');
  const [session] = await transaction
    .select({ expiresAt: authSessions.expiresAt })
    .from(authSessions)
    .where(
      and(
        eq(authSessions.id, sessionId),
        eq(authSessions.organizationId, context.organizationId),
        eq(authSessions.establishmentId, context.establishmentId!),
        eq(authSessions.userId, actor.userId),
      ),
    )
    .limit(1);
  if (!session)
    throw new GoogleReplyPublicationRepositoryError('STALE_AUTHORITY');
  const [establishment] = await transaction
    .select({ name: establishments.name })
    .from(establishments)
    .where(
      and(
        eq(establishments.organizationId, context.organizationId),
        eq(establishments.id, context.establishmentId!),
      ),
    )
    .limit(1);
  if (!establishment)
    throw new GoogleReplyPublicationRepositoryError('STALE_AUTHORITY');
  return {
    feedbackId: feedback.id,
    replyId: reply.id,
    revision: reply.revision,
    text: reply.content,
    establishmentName: establishment.name,
    binding: {
      connectorId: connector.id,
      bindingGeneration: connector.bindingGeneration,
      externalAccountId: connector.externalAccountId,
      externalLocationId: connector.externalLocationId,
    },
    reviewName: reference.reviewName,
    actor,
    authorityExpiresAt: new Date(
      Math.min(
        reference.referenceExpiresAt.getTime(),
        session.expiresAt.getTime(),
      ),
    ),
  };
}
async function getAttempt(
  db: GoogleReviewDatabase,
  context: TenantContext,
  id: string,
) {
  requireActor(context);
  const [attempt] = await db
    .select()
    .from(publications)
    .where(and(scope(context), eq(publications.id, id)))
    .limit(1);
  if (!attempt)
    throw new GoogleReplyPublicationRepositoryError('STALE_AUTHORITY');
  return attempt;
}
function receipt(attempt: Attempt, now: Date): GoogleReplyPublicationReceipt {
  const category = googleReplyPublicationErrorSchema.safeParse(
    attempt.errorCategory,
  );
  return {
    attemptId: attempt.id,
    replyId: attempt.replyId,
    revision: attempt.revision,
    errorCategory: category.success ? category.data : null,
    state:
      attempt.state === 'DISPATCHING' &&
      (!attempt.leaseExpiresAt || attempt.leaseExpiresAt <= now)
        ? 'UNCERTAIN'
        : attempt.state,
    confirmedAt: attempt.confirmedAt?.toISOString() ?? null,
    observedAt: attempt.observedAt?.toISOString() ?? null,
    reconciledAt: attempt.reconciledAt?.toISOString() ?? null,
    superseded: Boolean(attempt.supersededById),
  };
}
async function audit(
  transaction: Transaction,
  context: TenantContext,
  attempt: Attempt,
  action: string,
  actorUserId: string,
  state?: GoogleReplyPublicationState,
) {
  await transaction.insert(reputationAuditEvents).values({
    id: uuidv7(),
    organizationId: context.organizationId,
    entityType: 'REPLY',
    entityId: attempt.replyId,
    action,
    actorUserId,
    metadata: {
      establishmentId: context.establishmentId,
      feedbackItemId: attempt.feedbackItemId,
      attemptId: attempt.id,
      revision: attempt.revision,
      ...(state ? { state } : {}),
    },
  });
}
async function unresolvedLeaf(
  transaction: Transaction,
  context: TenantContext,
  feedbackId: string,
  now: Date,
) {
  await transaction
    .update(publications)
    .set({
      state: 'UNCERTAIN',
      errorCategory: 'PROVIDER_UNAVAILABLE',
      leaseExpiresAt: null,
    })
    .where(
      and(
        scope(context),
        eq(publications.feedbackItemId, feedbackId),
        eq(publications.state, 'DISPATCHING'),
        lte(publications.leaseExpiresAt, now),
      ),
    );
  const [leaf] = await transaction
    .select()
    .from(publications)
    .where(
      and(
        scope(context),
        eq(publications.feedbackItemId, feedbackId),
        isNull(publications.supersededById),
        inArray(publications.state, [...unresolved]),
      ),
    )
    .orderBy(desc(publications.createdAt))
    .limit(1);
  return leaf;
}
function checkRetry(
  parent: Attempt | undefined,
  input: GoogleReplyPreviewInput,
) {
  if (
    !parent ||
    parent.id !== input.retryParentId ||
    parent.replyId !== input.replyId ||
    parent.revision !== input.revision ||
    !['UNCERTAIN', 'UNCONFIRMED'].includes(parent.state) ||
    !parent.reconciledAt ||
    parent.supersededById
  )
    throw new GoogleReplyPublicationRepositoryError('RECONCILE_REQUIRED');
}

export async function prepareGoogleReplyPublication(
  db: CloudDatabaseClient,
  context: TenantContext,
  sessionId: string,
  input: GoogleReplyPreviewInput,
  readRemote: (
    transaction: GoogleReviewDatabase,
    target: GoogleReplyPublicationTarget,
  ) => Promise<GoogleReplyRemotePreview>,
  clock: Clock = () => new Date(),
): Promise<GoogleReplyPreviewResponse> {
  return db.transaction(async (transaction) => {
    const target = await lockTarget(
      transaction,
      context,
      sessionId,
      input,
      clock(),
    );
    const leaf = await unresolvedLeaf(
      transaction,
      context,
      input.feedbackId,
      clock(),
    );
    if (input.retryParentId) {
      checkRetry(leaf, input);
      if (
        leaf!.connectorId !== target.binding.connectorId ||
        leaf!.bindingGeneration !== target.binding.bindingGeneration
      )
        throw new GoogleReplyPublicationRepositoryError('STALE_AUTHORITY');
    } else {
      if (leaf) throw new GoogleReplyPublicationRepositoryError('UNRESOLVED');
      const [latest] = await transaction
        .select({ id: feedbackReplies.id })
        .from(feedbackReplies)
        .where(
          and(
            eq(feedbackReplies.organizationId, context.organizationId),
            eq(feedbackReplies.feedbackItemId, input.feedbackId),
          ),
        )
        .orderBy(desc(feedbackReplies.createdAt))
        .limit(1);
      if (latest?.id !== input.replyId)
        throw new GoogleReplyPublicationRepositoryError('VERSION_CHANGED');
    }
    const remote = await readRemote(transaction, target);
    assertGoogleReplyTargetTime(target, clock());
    const expiresAt = new Date(
      Math.min(
        clock().getTime() + 300_000,
        target.authorityExpiresAt.getTime(),
      ),
    );
    const id = randomUUID();
    await transaction.insert(publications).values({
      id,
      organizationId: context.organizationId,
      establishmentId: context.establishmentId!,
      feedbackItemId: input.feedbackId,
      replyId: input.replyId,
      revision: input.revision,
      connectorId: target.binding.connectorId,
      bindingGeneration: target.binding.bindingGeneration,
      actorUserId: target.actor.userId,
      actorSessionId: sessionId,
      actorMembershipId: target.actor.membershipId,
      actorAuthVersion: target.actor.authVersion,
      previewExpiresAt: expiresAt,
      remoteFingerprint: remote.fingerprint,
      state: 'PREVIEW',
      retryParentId: input.retryParentId ?? null,
    });
    return {
      attemptId: id,
      feedbackId: input.feedbackId,
      replyId: input.replyId,
      revision: input.revision,
      text: target.text,
      establishmentName: target.establishmentName,
      expiresAt: expiresAt.toISOString(),
      remoteReply: remote.remoteReply,
      retry: Boolean(input.retryParentId),
    };
  });
}

export async function claimGoogleReplyPublication(
  db: CloudDatabaseClient,
  context: TenantContext,
  sessionId: string,
  id: string,
  clock: Clock = () => new Date(),
) {
  return db.transaction(async (transaction) => {
    const attempt = await getAttempt(transaction, context, id);
    checkOriginal(context, sessionId, attempt);
    await lockTarget(
      transaction,
      context,
      sessionId,
      {
        feedbackId: attempt.feedbackItemId,
        replyId: attempt.replyId,
        revision: attempt.revision,
      },
      clock(),
      attempt,
    );
    const current = await getAttempt(transaction, context, id);
    if (current.state !== 'PREVIEW')
      return { claimed: false, receipt: receipt(current, clock()) };
    if (current.previewExpiresAt <= clock() || !current.remoteFingerprint)
      throw new GoogleReplyPublicationRepositoryError('PREVIEW_EXPIRED');
    if (!current.retryParentId) {
      const [latest] = await transaction
        .select({ id: feedbackReplies.id })
        .from(feedbackReplies)
        .where(
          and(
            eq(feedbackReplies.organizationId, context.organizationId),
            eq(feedbackReplies.feedbackItemId, current.feedbackItemId),
          ),
        )
        .orderBy(desc(feedbackReplies.createdAt))
        .limit(1);
      if (latest?.id !== current.replyId)
        throw new GoogleReplyPublicationRepositoryError('VERSION_CHANGED');
    }
    const leaf = await unresolvedLeaf(
      transaction,
      context,
      current.feedbackItemId,
      clock(),
    );
    if (current.retryParentId) {
      checkRetry(leaf, {
        feedbackId: current.feedbackItemId,
        replyId: current.replyId,
        revision: current.revision,
        retryParentId: current.retryParentId,
      });
      if (
        leaf!.connectorId !== current.connectorId ||
        leaf!.bindingGeneration !== current.bindingGeneration
      )
        throw new GoogleReplyPublicationRepositoryError('STALE_AUTHORITY');
      await transaction
        .update(publications)
        .set({ supersededById: current.id })
        .where(and(scope(context), eq(publications.id, leaf!.id)));
    } else if (leaf)
      throw new GoogleReplyPublicationRepositoryError('UNRESOLVED');
    const [claimed] = await transaction
      .update(publications)
      .set({
        state: 'DISPATCHING',
        confirmedAt: clock(),
        dispatchedAt: clock(),
        leaseExpiresAt: new Date(clock().getTime() + 120_000),
      })
      .where(
        and(
          scope(context),
          eq(publications.id, id),
          eq(publications.state, 'PREVIEW'),
        ),
      )
      .returning();
    if (!claimed)
      throw new GoogleReplyPublicationRepositoryError('STALE_AUTHORITY');
    await audit(
      transaction,
      context,
      claimed,
      'reply.google.confirmed',
      claimed.actorUserId,
    );
    await audit(
      transaction,
      context,
      claimed,
      'reply.google.dispatch.claimed',
      claimed.actorUserId,
      'DISPATCHING',
    );
    return { claimed: true, receipt: receipt(claimed, clock()) };
  });
}

export async function executeGoogleReplyPublication(
  db: CloudDatabaseClient,
  context: TenantContext,
  sessionId: string,
  id: string,
  operation: (
    transaction: GoogleReviewDatabase,
    target: GoogleReplyPublicationTarget,
    remoteFingerprint: string,
  ) => Promise<GoogleReplyPublicationResult>,
  clock: Clock = () => new Date(),
): Promise<GoogleReplyPublicationReceipt> {
  return db.transaction(async (transaction) => {
    const attempt = await getAttempt(transaction, context, id);
    checkOriginal(context, sessionId, attempt);
    const target = await lockTarget(
      transaction,
      context,
      sessionId,
      {
        feedbackId: attempt.feedbackItemId,
        replyId: attempt.replyId,
        revision: attempt.revision,
      },
      clock(),
      attempt,
    );
    const current = await getAttempt(transaction, context, id);
    if (
      current.state !== 'DISPATCHING' ||
      !current.leaseExpiresAt ||
      current.leaseExpiresAt <= clock()
    )
      return receipt(current, clock());
    if (!current.remoteFingerprint || current.previewExpiresAt <= clock()) {
      return persistResult(
        transaction,
        context,
        current,
        { state: 'FAILED', errorCategory: 'PREVIEW_EXPIRED' },
        target.actor.userId,
        clock(),
        false,
      );
    }
    // The service catches network ambiguity inside this callback. A transaction/process
    // failure preserves the separately committed claim, which expires to uncertainty.
    const dispatchTarget = {
      ...target,
      authorityExpiresAt: new Date(
        Math.min(
          target.authorityExpiresAt.getTime(),
          current.previewExpiresAt.getTime(),
        ),
      ),
    };
    const result = await operation(
      transaction,
      dispatchTarget,
      current.remoteFingerprint,
    );
    assertGoogleReplyTargetTime(target, clock());
    return persistResult(
      transaction,
      context,
      current,
      result,
      target.actor.userId,
      clock(),
      false,
    );
  });
}

async function persistResult(
  transaction: Transaction,
  context: TenantContext,
  attempt: Attempt,
  result: GoogleReplyPublicationResult,
  actorUserId: string,
  now: Date,
  reconciled: boolean,
) {
  const observed = ['APPROVED', 'PENDING', 'REJECTED'].includes(result.state);
  const [updated] = await transaction
    .update(publications)
    .set({
      state: result.state,
      errorCategory: result.errorCategory,
      remoteFingerprint: null,
      leaseExpiresAt: null,
      observedAt: observed ? now : null,
      ...(reconciled ? { reconciledAt: now } : {}),
    })
    .where(and(scope(context), eq(publications.id, attempt.id)))
    .returning();
  if (!updated)
    throw new GoogleReplyPublicationRepositoryError('STALE_AUTHORITY');
  // A definite failure of the retry cannot resolve the earlier ambiguous write.
  if (result.state === 'FAILED' && attempt.retryParentId)
    await transaction
      .update(publications)
      .set({ supersededById: null })
      .where(
        and(
          scope(context),
          eq(publications.id, attempt.retryParentId),
          eq(publications.supersededById, attempt.id),
        ),
      );
  await transaction
    .update(feedbackReplies)
    .set({
      status:
        result.state === 'APPROVED'
          ? 'PUBLISHED'
          : ['FAILED', 'REJECTED'].includes(result.state)
            ? 'FAILED'
            : 'READY',
      approvedByUserId: attempt.actorUserId,
      publishedAt: result.state === 'APPROVED' ? now : null,
      failedAt: ['FAILED', 'REJECTED'].includes(result.state) ? now : null,
      errorCode: result.errorCategory,
      errorMessage: null,
    })
    .where(
      and(
        eq(feedbackReplies.organizationId, context.organizationId),
        eq(feedbackReplies.feedbackItemId, attempt.feedbackItemId),
        eq(feedbackReplies.id, attempt.replyId),
        eq(feedbackReplies.revision, attempt.revision),
      ),
    );
  await audit(
    transaction,
    context,
    attempt,
    reconciled ? 'reply.google.reconciled' : 'reply.google.result',
    actorUserId,
    result.state,
  );
  return receipt(updated, now);
}

export async function reconcileGoogleReplyPublication(
  db: CloudDatabaseClient,
  context: TenantContext,
  sessionId: string,
  id: string,
  read: (
    transaction: GoogleReviewDatabase,
    target: GoogleReplyPublicationTarget,
  ) => Promise<GoogleReplyPublicationResult | null>,
  clock: Clock = () => new Date(),
): Promise<GoogleReplyPublicationReceipt> {
  return db.transaction(async (transaction) => {
    const attempt = await getAttempt(transaction, context, id);
    const target = await lockTarget(
      transaction,
      context,
      sessionId,
      {
        feedbackId: attempt.feedbackItemId,
        replyId: attempt.replyId,
        revision: attempt.revision,
      },
      clock(),
      attempt,
      false,
    );
    const current = await getAttempt(transaction, context, id);
    if (
      current.state === 'PREVIEW' ||
      current.supersededById ||
      (current.state === 'DISPATCHING' &&
        current.leaseExpiresAt &&
        current.leaseExpiresAt > clock())
    )
      throw new GoogleReplyPublicationRepositoryError('RECONCILE_REQUIRED');
    const result = await read(transaction, target);
    assertGoogleReplyTargetTime(target, clock());
    const prior = receipt(current, clock()).state;
    return persistResult(
      transaction,
      context,
      current,
      result ?? {
        state: ['UNCERTAIN', 'UNCONFIRMED'].includes(prior)
          ? (prior as 'UNCERTAIN' | 'UNCONFIRMED')
          : 'UNCONFIRMED',
        errorCategory: 'PROVIDER_UNAVAILABLE',
      },
      target.actor.userId,
      clock(),
      true,
    );
  });
}

export async function findGoogleReplyPublicationReceipt(
  db: GoogleReviewDatabase,
  context: TenantContext,
  feedbackId: string,
  now = new Date(),
): Promise<GoogleReplyPublicationReceipt | null> {
  requireActor(context);
  const [attempt] = await db
    .select()
    .from(publications)
    .where(
      and(
        scope(context),
        eq(publications.feedbackItemId, feedbackId),
        gt(publications.confirmedAt, new Date(0)),
      ),
    )
    .orderBy(
      sql`case when ${publications.supersededById} is null and ${publications.state} in ('DISPATCHING','UNCERTAIN','UNCONFIRMED') then 0 else 1 end`,
      desc(publications.confirmedAt),
    )
    .limit(1);
  return attempt ? receipt(attempt, now) : null;
}
