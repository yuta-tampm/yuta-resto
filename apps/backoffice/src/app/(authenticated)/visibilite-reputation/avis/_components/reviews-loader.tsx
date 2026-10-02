import { identifierSchema } from '@yuta/contracts/common';
import { z } from 'zod';
import { feedbackListQuerySchema } from '@yuta/contracts/reputation';
import {
  findFeedbackDetail,
  listAssignableReputationUsers,
  listFeedback,
} from '@yuta/db-cloud';
import { hasReputationPermission } from '@/server/auth/permissions';
import { requireReputationTenant } from '@/server/auth/session';
import { cloudDatabase as db } from '@/server/cloud-database';
import {
  getReputationFeedbackScope,
  isReleaseAExposure,
} from '@/server/backoffice-exposure';
import { releaseAAttentionStatuses } from '@/lib/backoffice-exposure';
import { loadReleaseASetupSummary } from '@/server/reputation/release-a-setup';
import {
  canRetrieveGoogleReviews,
  loadGoogleReviewRetrievalSummary,
} from '@/server/reputation/google-review-retrieval';
import { ReviewsPage } from './reviews-page';
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
  const canRetrieveGoogle =
    mode !== 'direct' && canRetrieveGoogleReviews(tenant);
  const workingIds = z
    .array(identifierSchema)
    .min(1)
    .max(25)
    .safeParse(filterValue(rawSearchParams.working)?.split(','));
  const attentionQueue =
    releaseA && filterValue(rawSearchParams.queue) === 'attention';
  const requestedSort = filterValue(rawSearchParams.sort);
  const scope = releaseA
    ? {
        ...getReputationFeedbackScope(),
        ...(attentionQueue ? { statuses: releaseAAttentionStatuses } : {}),
      }
    : undefined;
  const queryResult = feedbackListQuerySchema.safeParse({
    source: releaseA
      ? 'GOOGLE'
      : mode === 'direct'
        ? 'DIRECT'
        : filterValue(rawSearchParams.source),
    status: filterValue(rawSearchParams.status),
    rating: filterValue(rawSearchParams.rating),
    sentiment: releaseA ? undefined : filterValue(rawSearchParams.sentiment),
    urgency: releaseA ? undefined : filterValue(rawSearchParams.urgency),
    assignedTo: filterValue(rawSearchParams.assignedTo),
    search: filterValue(rawSearchParams.search),
    sort:
      releaseA &&
      (requestedSort === 'urgency_desc' || requestedSort === 'unanswered')
        ? 'newest'
        : (requestedSort ?? 'newest'),
    page: filterValue(rawSearchParams.page) ?? 1,
    pageSize: 25,
  });
  const query = queryResult.success
    ? queryResult.data
    : feedbackListQuerySchema.parse(
        releaseA
          ? { source: 'GOOGLE' }
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
        sentiment: releaseA ? null : item.sentiment,
        urgency: releaseA ? null : item.urgency,
        status: item.status,
        assignedToUserId: item.assignedToUserId,
        receivedAt: item.receivedAt.toISOString(),
        incidentId: releaseA ? null : item.incidentId,
        replyStatus: item.replyStatus,
        googleContentAvailability: item.googleContentAvailability,
        googleReviewChanged: item.googleReviewChanged,
        canRecoverReference: item.canRecoverReference,
      })),
      detail: detail ? serializeDetail(detail, userNames, releaseA) : null,
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
      counters: releaseA
        ? { total: result.counters.total, new: result.counters.new }
        : result.counters,
      permissions: {
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
    return <ReviewsPage data={unavailableData(mode, releaseA)} mode={mode} />;
  }
}

function serializeDetail(
  detail: NonNullable<Awaited<ReturnType<typeof findFeedbackDetail>>>,
  userNames: Map<string, string>,
  releaseA: boolean,
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
    sentiment: releaseA ? null : detail.sentiment,
    urgency: releaseA ? null : detail.urgency,
    status: detail.status,
    assignedToUserId: detail.assignedToUserId,
    receivedAt: detail.receivedAt.toISOString(),
    incidentId: releaseA ? null : (detail.incidents[0]?.id ?? null),
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
      !releaseA && detail.analysis
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
  const first = Array.isArray(value) ? value[0] : value;
  return !first || first === 'ALL' ? undefined : first;
}

function unavailableData(
  mode: ReviewsPageMode,
  releaseA: boolean,
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
      source: releaseA ? 'GOOGLE' : mode === 'direct' ? 'DIRECT' : null,
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
    counters: releaseA
      ? { total: 0, new: 0 }
      : {
          total: 0,
          new: 0,
          unanswered: 0,
          negative: 0,
          withIncident: 0,
        },
    permissions: {
      canManageFeedback: false,
      canCreateReply: false,
      canCreateNote: false,
    },
  };
}
