import 'server-only';

import {
  googleReviewRetrievalInputSchema,
  googleReviewRetrievalOutcomeSchema,
  googleReviewRetrievalSummarySchema,
  type GoogleReviewRetrievalInput,
  type GoogleReviewRetrievalOutcome,
  type GoogleReviewRetrievalSummary,
  type GoogleReviewRetrievalError,
} from '@yuta/contracts/reputation';
import {
  beginGoogleReviewRetrieval,
  commitGoogleReviewRetrieval,
  failGoogleReviewRetrieval,
  findGoogleReviewRetrievalSummary,
  GoogleReviewRetrievalRepositoryError,
  type GoogleReviewRetrievalLease,
  type GoogleReviewRetrievalSummary as RepositorySummary,
} from '@yuta/db-cloud';
import {
  requireEntitlement,
  requireEstablishment,
  TenantError,
  type TenantContext,
} from '@yuta/tenant';
import { z } from 'zod';
import { requireReputationPermission } from '../auth/permissions';
import { getGoogleConnectorAccessToken } from './google-connector-access';
import {
  GoogleBusinessProfileApiError,
  getGoogleBusinessReview,
  listGoogleBusinessReviews,
} from './google-business-profile-client';
import { GoogleConnectorConfigurationError } from './google-connector-config';
import { isGoogleReviewRetrievalEnabled } from './google-review-retrieval-config';

function requireGoogleReviewRetrieval(tenant: TenantContext): void {
  requireEstablishment(tenant);
  requireEntitlement(tenant, 'reputation.enabled');
  requireReputationPermission(tenant, 'reputation.read');
  requireReputationPermission(tenant, 'reputation.google.retrieve');
}

export function canRetrieveGoogleReviews(tenant: TenantContext): boolean {
  try {
    requireGoogleReviewRetrieval(tenant);
    return true;
  } catch (error: unknown) {
    if (error instanceof TenantError) return false;
    throw error;
  }
}

function projectSummary(
  summary: RepositorySummary,
): GoogleReviewRetrievalSummary {
  const kinds = {
    RECENT: 'recent',
    HISTORY: 'history',
    DETAIL: 'detail',
  } as const;
  return googleReviewRetrievalSummarySchema.parse({
    ...summary,
    enabled: isGoogleReviewRetrievalEnabled(),
    lastAttemptKind: summary.lastAttemptKind
      ? kinds[summary.lastAttemptKind]
      : null,
    lastAttemptAt: summary.lastAttemptAt?.toISOString() ?? null,
    lastSuccessfulAt: summary.lastSuccessfulAt?.toISOString() ?? null,
    lastRecentSuccessAt: summary.lastRecentSuccessAt?.toISOString() ?? null,
  });
}

export async function loadGoogleReviewRetrievalSummary(
  tenant: TenantContext,
): Promise<GoogleReviewRetrievalSummary> {
  // Batch coverage and continuation are establishment retrieval data, not STAFF assigned work.
  requireGoogleReviewRetrieval(tenant);
  const { cloudDatabase } = await import('../cloud-database');
  return projectSummary(
    await findGoogleReviewRetrievalSummary(cloudDatabase, tenant, {
      now: new Date(),
    }),
  );
}

function sanitizeFailure(error: unknown): GoogleReviewRetrievalError {
  if (error instanceof GoogleReviewRetrievalRepositoryError) return error.code;
  if (error instanceof GoogleConnectorConfigurationError)
    return 'CONFIGURATION_UNAVAILABLE';
  if (error instanceof GoogleBusinessProfileApiError) {
    if (error.category === 'INVALID_RESPONSE') return 'INVALID_RESPONSE';
    if (error.status === 401) return 'AUTH_REQUIRED';
    if (error.status === 403) return 'FORBIDDEN';
    if (error.status === 404) return 'NOT_FOUND';
    return 'PROVIDER_UNAVAILABLE';
  }
  return 'PROVIDER_UNAVAILABLE';
}

export async function retrieveGoogleReviews(
  tenant: TenantContext,
  sessionId: string,
  input: GoogleReviewRetrievalInput,
): Promise<GoogleReviewRetrievalOutcome> {
  requireGoogleReviewRetrieval(tenant);
  const parsed = googleReviewRetrievalInputSchema.parse(input);
  z.string().uuid().parse(sessionId);
  const makeOutcome = async (
    kind: GoogleReviewRetrievalOutcome['kind'],
    counts?: { addedCount: number; changedCount: number },
  ) =>
    googleReviewRetrievalOutcomeSchema.parse({
      kind,
      summary: await loadGoogleReviewRetrievalSummary(tenant),
      addedCount: counts?.addedCount ?? null,
      changedCount: counts?.changedCount ?? null,
    });
  if (!isGoogleReviewRetrievalEnabled()) return makeOutcome('unavailable');

  const { cloudDatabase } = await import('../cloud-database');
  let lease: GoogleReviewRetrievalLease | undefined;
  try {
    const begin = await beginGoogleReviewRetrieval(cloudDatabase, tenant, {
      sessionId,
      now: new Date(),
      ...(parsed.kind === 'recent'
        ? { kind: 'RECENT' as const, force: parsed.trigger === 'manual' }
        : parsed.kind === 'history'
          ? {
              kind: 'HISTORY' as const,
              continuationHandle: parsed.continuationHandle,
            }
          : { kind: 'DETAIL' as const, feedbackId: parsed.feedbackId }),
    });
    if (begin.status !== 'STARTED') {
      const outcomes = {
        FRESH: 'fresh',
        PENDING: 'pending',
        UNAVAILABLE: 'unavailable',
        INVALID_CONTINUATION: 'invalid_continuation',
        NO_REFERENCE: 'no_reference',
      } as const;
      return makeOutcome(outcomes[begin.status]);
    }
    lease = begin.lease;
    const accessToken = await getGoogleConnectorAccessToken(
      tenant,
      lease.binding,
    );
    if (!accessToken)
      throw new GoogleBusinessProfileApiError(
        'Google access is unavailable.',
        401,
      );
    const page =
      lease.kind === 'DETAIL'
        ? {
            reviews: [
              await getGoogleBusinessReview(
                accessToken,
                lease.binding,
                begin.providerRequest.reviewName ?? '',
              ),
            ],
            nextPageToken: null,
            totalReviewCount: null,
          }
        : await listGoogleBusinessReviews(
            accessToken,
            lease.binding,
            begin.providerRequest.pageToken,
          );
    const result = await commitGoogleReviewRetrieval(
      cloudDatabase,
      tenant,
      lease,
      { ...page, fetchedAt: new Date() },
    );
    return makeOutcome('completed', result);
  } catch (error: unknown) {
    const category = sanitizeFailure(error);
    if (lease) {
      const recorded = await failGoogleReviewRetrieval(
        cloudDatabase,
        tenant,
        lease,
        { category, now: new Date() },
      );
      if (!recorded || category === 'STALE_AUTHORITY') {
        // An invalidated actor/binding must not read a receipt using the captured context.
        throw new GoogleReviewRetrievalRepositoryError('STALE_AUTHORITY');
      }
    } else if (error instanceof GoogleReviewRetrievalRepositoryError) {
      // A begin-time authority failure must not disclose a receipt or perform another read.
      throw new GoogleReviewRetrievalRepositoryError(category);
    }
    return makeOutcome('failed');
  }
}
