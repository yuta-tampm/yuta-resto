import 'server-only';
import { requireEntitlement, type TenantContext } from '@yuta/tenant';
import {
  googleReplyAttemptInputSchema,
  googleReplyPreviewInputSchema,
  type GoogleReplyPreviewInput,
} from '@yuta/contracts/reputation';
import {
  claimGoogleReplyPublication,
  executeGoogleReplyPublication,
  prepareGoogleReplyPublication,
  reconcileGoogleReplyPublication,
  assertGoogleReplyTargetTime,
  type GoogleReplyPublicationTarget,
  type GoogleReplyPublicationResult,
} from '@yuta/db-cloud';
import {
  hasReputationPermission,
  requireReputationPermission,
} from '../auth/permissions';
import { isGoogleReplyPublicationEnabled } from './google-reply-publication-config';
import { getGooglePublicationAccessToken } from './google-connector-access';
import {
  getGoogleBusinessReview,
  GoogleBusinessProfileApiError,
} from './google-business-profile-client';
import {
  googleRemoteReplyFingerprint,
  observedGoogleReplyResult,
  putGoogleReviewReply,
} from './google-reply-provider';

export function canPublishGoogleReplies(tenant: TenantContext): boolean {
  return (
    isGoogleReplyPublicationEnabled() &&
    tenant.entitlements.has('reputation.enabled') &&
    hasReputationPermission(tenant, 'reputation.read') &&
    hasReputationPermission(tenant, 'reputation.reply.publish')
  );
}
function guard(tenant: TenantContext) {
  requireEntitlement(tenant, 'reputation.enabled');
  requireReputationPermission(tenant, 'reputation.read');
  requireReputationPermission(tenant, 'reputation.reply.publish');
  if (!isGoogleReplyPublicationEnabled())
    throw new Error('Google reply publication is unavailable.');
}
async function readGoogle(token: string, target: GoogleReplyPublicationTarget) {
  assertGoogleReplyTargetTime(target, new Date());
  return getGoogleBusinessReview(
    token,
    target.binding,
    target.reviewName,
    AbortSignal.timeout(10_000),
  );
}
export async function previewGoogleReply(
  tenant: TenantContext,
  sessionId: string,
  input: GoogleReplyPreviewInput,
) {
  guard(tenant);
  const parsed = googleReplyPreviewInputSchema.parse(input);
  const { cloudDatabase: db } = await import('../cloud-database');
  return prepareGoogleReplyPublication(
    db,
    tenant,
    sessionId,
    parsed,
    async (transaction, target) => {
      guard(tenant);
      const token = await getGooglePublicationAccessToken(
        transaction,
        tenant,
        target,
      );
      if (!token) throw new Error('Google connection requires authorization.');
      const review = await readGoogle(token, target);
      return {
        fingerprint: googleRemoteReplyFingerprint(review),
        remoteReply: review.remoteReply
          ? { content: review.remoteReply.content }
          : null,
      };
    },
  );
}
export async function confirmGoogleReply(
  tenant: TenantContext,
  sessionId: string,
  input: { attemptId: string },
) {
  guard(tenant);
  const { attemptId } = googleReplyAttemptInputSchema.parse(input);
  const { cloudDatabase: db } = await import('../cloud-database');
  const claim = await claimGoogleReplyPublication(
    db,
    tenant,
    sessionId,
    attemptId,
  );
  if (!claim.claimed) return claim.receipt;
  return executeGoogleReplyPublication(
    db,
    tenant,
    sessionId,
    attemptId,
    async (transaction, target, fingerprint) => {
      let writeStarted = false;
      try {
        guard(tenant);
        const token = await getGooglePublicationAccessToken(
          transaction,
          tenant,
          target,
        );
        if (!token) return { state: 'FAILED', errorCategory: 'AUTH_REQUIRED' };
        const current = await readGoogle(token, target);
        if (googleRemoteReplyFingerprint(current) !== fingerprint)
          return { state: 'FAILED', errorCategory: 'REMOTE_CHANGED' };
        guard(tenant);
        assertGoogleReplyTargetTime(target, new Date());
        writeStarted = true;
        await putGoogleReviewReply(
          token,
          target.binding,
          target.reviewName,
          target.text,
        );
        // ACK is not the target's observed/public state. A separate scoped GET
        // establishes observation; no PUT is retried from this path.
        try {
          const observed = await readGoogle(token, target);
          return (
            observedGoogleReplyResult(observed, target.text) ?? {
              state: 'UNCONFIRMED',
              errorCategory: 'PROVIDER_UNAVAILABLE',
            }
          );
        } catch {
          return {
            state: 'UNCONFIRMED',
            errorCategory: 'PROVIDER_UNAVAILABLE',
          };
        }
      } catch (error: unknown) {
        if (writeStarted) {
          if (
            error instanceof GoogleBusinessProfileApiError &&
            [400, 401, 403, 404, 429].includes(error.status)
          )
            return { state: 'FAILED', errorCategory: 'PROVIDER_REJECTED' };
          return {
            state: 'UNCERTAIN',
            errorCategory:
              error instanceof GoogleBusinessProfileApiError &&
              error.category === 'INVALID_RESPONSE'
                ? 'INVALID_RESPONSE'
                : 'PROVIDER_UNAVAILABLE',
          };
        }
        return { state: 'FAILED', errorCategory: 'PROVIDER_UNAVAILABLE' };
      }
    },
  );
}
export async function reconcileGoogleReply(
  tenant: TenantContext,
  sessionId: string,
  input: { attemptId: string },
) {
  guard(tenant);
  const { attemptId } = googleReplyAttemptInputSchema.parse(input);
  const { cloudDatabase: db } = await import('../cloud-database');
  return reconcileGoogleReplyPublication(
    db,
    tenant,
    sessionId,
    attemptId,
    async (
      transaction,
      target,
    ): Promise<GoogleReplyPublicationResult | null> => {
      guard(tenant);
      const token = await getGooglePublicationAccessToken(
        transaction,
        tenant,
        target,
      );
      if (!token) return null;
      try {
        return observedGoogleReplyResult(
          await readGoogle(token, target),
          target.text,
        );
      } catch {
        return null;
      }
    },
  );
}
