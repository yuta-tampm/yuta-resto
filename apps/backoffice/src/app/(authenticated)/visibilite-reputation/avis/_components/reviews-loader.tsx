import { identifierSchema } from '@yuta/contracts/common';
import { z } from 'zod';
import { feedbackListQuerySchema } from '@yuta/contracts/reputation';
import {
  findFeedbackDetail,
  listAssignableReputationUsers,
  listFeedback,
  findGoogleReplyPublicationReceipt,
} from '@yuta/db-cloud';
import { hasReputationPermission } from '@/server/auth/permissions';
import { requireReputationTenant } from '@/server/auth/session';
import { cloudDatabase as db } from '@/server/cloud-database';
import { firstSearchParam } from '@/lib/search-params';
import {
  getReputationExposureScope,
  getReputationFeedbackScope,
  isBackofficeExposureCapabilityAvailable,
  isReleaseAExposure,
} from '@/server/backoffice-exposure';
import { loadReleaseASetupSummary } from '@/server/reputation/release-a-setup';
import {
  canRetrieveGoogleReviews,
  loadGoogleReviewRetrievalSummary,
} from '@/server/reputation/google-review-retrieval';
import { ReviewsPage } from './reviews-page';
import { canPublishGoogleReplies } from '@/server/reputation/google-reply-publication';
import type {
  ReviewDetailRecord,
  ReviewsPageData,
  ReviewsPageMode,
} from '../reviews-model';

type ReviewSearchParams = Record<string, string | string[] | undefined>;

export async function loadReviewsPage(
  rawSearchParams: ReviewSearchParams,
  mode: ReviewsPageMode,
) {
  const returnTo =
    mode === 'direct'
      ? '/visibilite-reputation/satisfaction'
      : '/visibilite-reputation/avis';
  const { tenant } = await requireReputationTenant(returnTo);
  const releaseA = isReleaseAExposure();
  const reputationScope = getReputationExposureScope();
  const analysisAvailable = isBackofficeExposureCapabilityAvailable(
    'reputation-analysis',
  );
  const incidentsAvailable = isBackofficeExposureCapabilityAvailable(
    'reputation-incidents',
  );
  const counterExposure: CounterExposure = {
    analysis: analysisAvailable,
    incidents: incidentsAvailable,
    unanswered: reputationScope === null,
  };
  const canRetrieveGoogle =
    mode !== 'direct' && canRetrieveGoogleReviews(tenant);
  const workingIds = z
    .array(identifierSchema)
    .min(1)
    .max(25)
    .safeParse(filterValue(rawSearchParams.working)?.split(','));
  const attentionQueue =
    reputationScope !== null &&
    filterValue(rawSearchParams.queue) === 'attention';
  const requestedSort = filterValue(rawSearchParams.sort);
  const scope = reputationScope
    ? {
        ...getReputationFeedbackScope(),
        ...(attentionQueue
          ? { statuses: reputationScope.attentionStatuses }
          : {}),
      }
    : undefined;
  const queryResult = feedbackListQuerySchema.safeParse({
    source: reputationScope
      ? reputationScope.requiredSource
      : mode === 'direct'
        ? 'DIRECT'
        : filterValue(rawSearchParams.source),
    status: filterValue(rawSearchParams.status),
    rating: filterValue(rawSearchParams.rating),
    sentiment: analysisAvailable
      ? filterValue(rawSearchParams.sentiment)
      : undefined,
    urgency: analysisAvailable
      ? filterValue(rawSearchParams.urgency)
      : undefined,
    assignedTo: filterValue(rawSearchParams.assignedTo),
    search: filterValue(rawSearchParams.search),
    // Ordering by urgency reveals analysis, and by unanswered infers reply
    // state that a scoped instance does not claim.
    sort:
      (requestedSort === 'urgency_desc' && !analysisAvailable) ||
      (requestedSort === 'unanswered' && reputationScope !== null)
        ? 'newest'
        : (requestedSort ?? 'newest'),
    page: filterValue(rawSearchParams.page) ?? 1,
    pageSize: 25,
  });
  const query = queryResult.success
    ? queryResult.data
    : feedbackListQuerySchema.parse(
        reputationScope
          ? { source: reputationScope.requiredSource }
          : mode === 'direct'
            ? { source: 'DIRECT' }
            : {},
      );

  try {
    const result =
      canRetrieveGoogle && workingIds.success
        ? await listFeedback(
            db,
            tenant,
            feedbackListQuerySchema.parse({
              source: query.source,
              page: 1,
              pageSize: 25,
            }),
            { ...getReputationFeedbackScope(), workIds: workingIds.data },
          )
        : await listFeedback(db, tenant, query, scope);
    const requestedId = filterValue(rawSearchParams.selected);
    const parsedRequestedId = identifierSchema.safeParse(requestedId);
    const selectedId =
      parsedRequestedId.success &&
      (mode === 'all' ||
        result.items.some((item) => item.id === parsedRequestedId.data))
        ? parsedRequestedId.data
        : result.items[0]?.id;
    const [detail, assignableUsers, setupSummary, retrievalSummary] =
      await Promise.all([
        selectedId
          ? findFeedbackDetail(
              db,
              tenant,
              selectedId,
              getReputationFeedbackScope(),
            )
          : null,
        listAssignableReputationUsers(db, tenant),
        releaseA ? loadReleaseASetupSummary(tenant) : null,
        canRetrieveGoogle
          ? loadGoogleReviewRetrievalSummary(tenant).catch(() => null)
          : null,
      ]);
    const userNames = new Map(
      assignableUsers.map((user) => [user.id, user.name]),
    );
    const canPublishGoogle =
      mode !== 'direct' && canPublishGoogleReplies(tenant);
    const publicationReceipt =
      canPublishGoogle && detail?.source === 'GOOGLE'
        ? await findGoogleReplyPublicationReceipt(db, tenant, detail.id)
        : null;

    const data: ReviewsPageData = {
      state: 'ready',
      releaseA,
      setupSummary,
      retrievalSummary,
      attentionCount: result.attentionCount ?? 0,
      items: result.items.map((item) => ({
        id: item.id,
        source: item.source,
        authorName: item.authorName,
        authorAvatarUrl: item.authorAvatarUrl,
        rating: item.rating,
        content: item.content,
        sentiment: analysisAvailable ? item.sentiment : null,
        urgency: analysisAvailable ? item.urgency : null,
        status: item.status,
        assignedToUserId: item.assignedToUserId,
        receivedAt: item.receivedAt.toISOString(),
        incidentId: incidentsAvailable ? item.incidentId : null,
        replyStatus: item.replyStatus,
        googleContentAvailability: item.googleContentAvailability,
        googleReviewChanged: item.googleReviewChanged,
        canRecoverReference: item.canRecoverReference,
      })),
      detail: detail
        ? {
            ...serializeDetail(detail, userNames, {
              analysis: analysisAvailable,
              incidents: incidentsAvailable,
            }),
            publicationReceipt,
          }
        : null,
      selectedUnavailable: releaseA && parsedRequestedId.success && !detail,
      assignableUsers,
      query: {
        source: query.source ?? null,
        status: query.status ?? null,
        rating: query.rating ?? null,
        search: query.search ?? '',
        sort: query.sort,
        queue: attentionQueue ? 'attention' : null,
      },
      pagination: result.pagination,
      counters: exposedCounters(result.counters, counterExposure),
      permissions: {
        canPublishGoogle,
        canManageFeedback: hasReputationPermission(
          tenant,
          'reputation.feedback.manage',
        ),
        canCreateReply: hasReputationPermission(
          tenant,
          'reputation.reply.create',
        ),
        canCreateNote: hasReputationPermission(
          tenant,
          'reputation.note.create',
        ),
        canRetrieveGoogle,
      },
    };
    return <ReviewsPage data={data} mode={mode} />;
  } catch (error: unknown) {
    console.error('Unable to load reputation inbox.', error);
    return (
      <ReviewsPage
        data={unavailableData(mode, {
          releaseA,
          requiredSource: reputationScope?.requiredSource ?? null,
          counterExposure,
        })}
        mode={mode}
      />
    );
  }
}

function serializeDetail(
  detail: NonNullable<Awaited<ReturnType<typeof findFeedbackDetail>>>,
  userNames: Map<string, string>,
  available: { analysis: boolean; incidents: boolean },
): ReviewDetailRecord {
  const latestReply = detail.replies.find(
    (reply) => reply.status !== 'DELETED',
  );
  return {
    id: detail.id,
    source: detail.source,
    authorName: detail.authorName,
    authorAvatarUrl: detail.authorAvatarUrl,
    rating: detail.rating,
    content: detail.content,
    sentiment: available.analysis ? detail.sentiment : null,
    urgency: available.analysis ? detail.urgency : null,
    status: detail.status,
    assignedToUserId: detail.assignedToUserId,
    receivedAt: detail.receivedAt.toISOString(),
    incidentId: available.incidents ? (detail.incidents[0]?.id ?? null) : null,
    replyStatus: latestReply?.status ?? null,
    googleContentAvailability: detail.googleContentAvailability,
    googleReviewChanged: detail.googleReviewChanged,
    canRecoverReference: detail.canRecoverReference,
    remoteReply: detail.remoteReply
      ? {
          content: detail.remoteReply.content,
          updatedAt: detail.remoteReply.updatedAt?.toISOString() ?? null,
          status: detail.remoteReply.status,
        }
      : null,
    externalUrl: detail.externalUrl,
    analysis:
      available.analysis && detail.analysis
        ? {
            summary: detail.analysis.summary,
            topics: detail.analysis.topics,
            suggestedAction: detail.analysis.suggestedAction,
          }
        : null,
    latestReply: latestReply
      ? {
          id: latestReply.id,
          content: latestReply.content,
          status: latestReply.status,
          revision: latestReply.revision,
        }
      : null,
    notes: detail.notes.map((note) => ({
      id: note.id,
      content: note.content,
      authorName: userNames.get(note.createdByUserId) ?? 'Utilisateur',
      createdAt: note.createdAt.toISOString(),
    })),
  };
}

function filterValue(value: string | string[] | undefined): string | undefined {
  const first = firstSearchParam(value);
  return !first || first === 'ALL' ? undefined : first;
}

type CounterExposure = {
  analysis: boolean;
  incidents: boolean;
  unanswered: boolean;
};

// Each derived counter follows its source: `negative` comes from sentiment
// analysis, `withIncident` from incidents and `unanswered` infers reply state.
function exposedCounters(
  counters: {
    total: number;
    new: number;
    unanswered: number;
    negative: number;
    withIncident: number;
  },
  exposure: CounterExposure,
): ReviewsPageData['counters'] {
  return {
    total: counters.total,
    new: counters.new,
    ...(exposure.unanswered ? { unanswered: counters.unanswered } : {}),
    ...(exposure.analysis ? { negative: counters.negative } : {}),
    ...(exposure.incidents ? { withIncident: counters.withIncident } : {}),
  };
}

function unavailableData(
  mode: ReviewsPageMode,
  {
    releaseA,
    requiredSource,
    counterExposure,
  }: {
    releaseA: boolean;
    requiredSource: 'GOOGLE' | null;
    counterExposure: CounterExposure;
  },
): ReviewsPageData {
  return {
    state: 'unavailable',
    releaseA,
    setupSummary: null,
    attentionCount: 0,
    items: [],
    detail: null,
    assignableUsers: [],
    query: {
      source: requiredSource ?? (mode === 'direct' ? 'DIRECT' : null),
      status: null,
      rating: null,
      search: '',
      sort: 'newest',
      queue: null,
    },
    pagination: {
      page: 1,
      pageSize: 25,
      totalItems: 0,
      totalPages: 1,
    },
    counters: exposedCounters(
      { total: 0, new: 0, unanswered: 0, negative: 0, withIncident: 0 },
      counterExposure,
    ),
    permissions: {
      canManageFeedback: false,
      canCreateReply: false,
      canCreateNote: false,
    },
  };
}
