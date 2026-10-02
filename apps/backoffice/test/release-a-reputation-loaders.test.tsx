import type { TenantContext } from '@yuta/tenant';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ReviewsPageData } from '../src/app/(authenticated)/visibilite-reputation/avis/reviews-model';

const mocks = vi.hoisted(() => ({
  releaseA: true,
  tenant: null as TenantContext | null,
  listFeedback: vi.fn(),
  findFeedbackDetail: vi.fn(),
  listAssignableReputationUsers: vi.fn(),
  listReservations: vi.fn(),
  getBookingAdministration: vi.fn(),
  findGoogleReputationConnector: vi.fn(),
  requireBookingPermission: vi.fn(),
  requireReputationPermission: vi.fn(),
  loadGoogleReviewRetrievalSummary: vi.fn(),
  retrieveGoogleReviews: vi.fn(),
}));

vi.mock('server-only', () => ({}));
vi.mock('../src/server/reputation/google-review-retrieval', () => ({
  canRetrieveGoogleReviews: (tenant: TenantContext) =>
    tenant.actor.type === 'user' &&
    ['OWNER', 'MANAGER'].includes(tenant.actor.role),
  loadGoogleReviewRetrievalSummary: mocks.loadGoogleReviewRetrievalSummary,
  retrieveGoogleReviews: mocks.retrieveGoogleReviews,
}));
vi.mock('@yuta/db-cloud', () => ({
  listFeedback: mocks.listFeedback,
  findFeedbackDetail: mocks.findFeedbackDetail,
  listAssignableReputationUsers: mocks.listAssignableReputationUsers,
  listReservations: mocks.listReservations,
  getBookingAdministration: mocks.getBookingAdministration,
  findGoogleReputationConnector: mocks.findGoogleReputationConnector,
}));
vi.mock('../src/server/cloud-database', () => ({
  cloudDatabase: { test: true },
}));
vi.mock('../src/server/auth/session', () => ({
  requireAuthenticatedTenant: async () => ({
    tenant: mocks.tenant,
    session: { userName: 'Operator' },
  }),
  requireReputationTenant: async () => ({ tenant: mocks.tenant }),
}));
vi.mock('../src/server/auth/permissions', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../src/server/auth/permissions')>()),
  requireBookingPermission: mocks.requireBookingPermission,
  requireReputationPermission: mocks.requireReputationPermission,
}));
// Select the profile only; availability and scope come from the real policy.
vi.mock('../src/server/backoffice-exposure-config', async (importOriginal) => ({
  ...(await importOriginal<
    typeof import('../src/server/backoffice-exposure-config')
  >()),
  getBackofficeExposureProfile: () =>
    mocks.releaseA ? ('release-a' as const) : ('internal' as const),
}));
vi.mock(
  '../src/app/(authenticated)/visibilite-reputation/avis/_components/reviews-page',
  () => ({ ReviewsPage: () => null }),
);

import { loadTodayDashboard } from '../src/app/(authenticated)/aujourdhui/today-data';
import { loadReviewsPage } from '../src/app/(authenticated)/visibilite-reputation/avis/_components/reviews-loader';
import { loadReleaseASetupSummary } from '../src/server/reputation/release-a-setup';
import { releaseAAttentionStatuses } from '../src/lib/backoffice-exposure';

const googleId = '00000000-0000-4000-8000-000000000001';
const directId = '00000000-0000-4000-8000-000000000002';
const google = {
  id: googleId,
  source: 'GOOGLE',
  authorName: 'Client',
  authorAvatarUrl: null,
  rating: 5,
  content: 'Stored Google review',
  sentiment: 'POSITIVE',
  urgency: 'HIGH',
  status: 'NEW',
  assignedToUserId: null,
  receivedAt: new Date('2026-10-01T10:00:00Z'),
  incidentId: 'incident-private',
  replyStatus: 'PUBLISHED',
};
const direct = { ...google, id: directId, source: 'DIRECT', replyStatus: null };
const counters = {
  total: 8,
  new: 2,
  unanswered: 7,
  negative: 1,
  withIncident: 1,
};
const pagination = { page: 1, pageSize: 25, totalItems: 8, totalPages: 1 };

beforeEach(() => {
  vi.clearAllMocks();
  mocks.releaseA = true;
  mocks.tenant = {
    organizationId: googleId,
    establishmentId: directId,
    actor: {
      type: 'user',
      userId: googleId,
      membershipId: directId,
      role: 'OWNER',
    },
    locale: 'fr-FR',
    timezone: 'Europe/Paris',
    entitlements: new Set(['booking.enabled', 'reputation.enabled']),
  };
  mocks.listFeedback.mockResolvedValue({
    items: [google],
    counters,
    pagination,
    attentionCount: 8,
  });
  mocks.findFeedbackDetail.mockResolvedValue(null);
  mocks.listAssignableReputationUsers.mockResolvedValue([]);
  mocks.listReservations.mockResolvedValue([]);
  mocks.getBookingAdministration.mockResolvedValue({
    exceptions: [],
    periods: [],
  });
  mocks.findGoogleReputationConnector.mockResolvedValue(null);
  mocks.loadGoogleReviewRetrievalSummary.mockResolvedValue({
    state: 'never',
    enabled: false,
    bound: false,
    lastAttemptKind: null,
    lastAttemptAt: null,
    lastSuccessfulAt: null,
    lastRecentSuccessAt: null,
    lastError: null,
    coverage: 'none',
    continuationHandle: null,
    lastBatchCount: null,
    currentContentAvailable: false,
  });
});

describe('Release A Today projection', () => {
  it('does not read or serialize Booking, uses the full queue count, and keeps local PUBLISHED items', async () => {
    const data = await loadTodayDashboard();
    expect(mocks.listReservations).not.toHaveBeenCalled();
    expect(mocks.getBookingAdministration).not.toHaveBeenCalled();
    expect(mocks.requireBookingPermission).not.toHaveBeenCalled();
    expect(data).not.toHaveProperty('reservations');
    expect(data).not.toHaveProperty('services');
    expect(data.reviews).toMatchObject({
      state: 'ready',
      data: { attentionCount: 8, newCount: 2, items: [{ id: googleId }] },
    });
    expect(mocks.listFeedback).toHaveBeenCalledWith(
      { test: true },
      mocks.tenant,
      { source: 'GOOGLE', sort: 'newest', page: 1, pageSize: 3 },
      {
        requiredSource: 'GOOGLE',
        scopedCounters: true,
        statuses: releaseAAttentionStatuses,
        attentionStatuses: releaseAAttentionStatuses,
      },
    );
  });

  it('retains the internal Booking composition and existing published-reply exclusion', async () => {
    mocks.releaseA = false;
    mocks.listFeedback.mockResolvedValue({
      items: [google, direct],
      counters,
      pagination,
    });
    const data = await loadTodayDashboard();
    expect(mocks.listReservations).toHaveBeenCalledOnce();
    expect(mocks.getBookingAdministration).toHaveBeenCalledOnce();
    expect(data).toHaveProperty('reservations');
    expect(data).toHaveProperty('services');
    expect(data.reviews).toMatchObject({
      state: 'ready',
      data: { attentionCount: 7, items: [{ id: directId }] },
    });
    expect(mocks.listFeedback.mock.calls[0]?.[3]).toBeUndefined();
    expect(mocks.findGoogleReputationConnector).not.toHaveBeenCalled();
  });

  it('does not turn a failed Reputation read into an empty queue', async () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => {});
    mocks.listFeedback.mockRejectedValue(new Error('Read unavailable'));
    expect((await loadTodayDashboard()).reviews).toEqual({
      state: 'unavailable',
      retryable: true,
    });
    log.mockRestore();
  });
});

describe('Release A Avis reads', () => {
  it('reprojects bounded held work identities instead of trusting a displaced current page', async () => {
    await loadReviewsPage(
      {
        working: `${googleId},${directId}`,
        rating: '5',
        page: '3',
        queue: 'attention',
        selected: googleId,
      },
      'all',
    );
    expect(mocks.listFeedback).toHaveBeenCalledWith(
      { test: true },
      mocks.tenant,
      expect.objectContaining({ source: 'GOOGLE', page: 1, pageSize: 25 }),
      expect.objectContaining({
        requiredSource: 'GOOGLE',
        workIds: [googleId, directId],
      }),
    );
    expect(mocks.listFeedback.mock.calls[0]?.[2]).not.toHaveProperty('rating');
    expect(mocks.listFeedback.mock.calls[0]?.[3]).not.toHaveProperty(
      'statuses',
    );
    expect(mocks.retrieveGoogleReviews).not.toHaveBeenCalled();
  });

  it('rejects malformed or oversized held UUID filters and ignores the mechanism for STAFF', async () => {
    await loadReviewsPage(
      { working: 'accounts/foreign/reviews/private' },
      'all',
    );
    expect(mocks.listFeedback.mock.calls[0]?.[3]).not.toHaveProperty('workIds');
    mocks.listFeedback.mockClear();
    await loadReviewsPage(
      { working: Array.from({ length: 26 }, () => googleId).join(',') },
      'all',
    );
    expect(mocks.listFeedback.mock.calls[0]?.[3]).not.toHaveProperty('workIds');
    mocks.listFeedback.mockClear();
    mocks.tenant = {
      ...mocks.tenant!,
      actor: {
        type: 'user',
        userId: googleId,
        membershipId: directId,
        role: 'STAFF',
      },
    };
    await loadReviewsPage({ working: googleId }, 'all');
    expect(mocks.listFeedback.mock.calls[0]?.[3]).not.toHaveProperty('workIds');
    expect(mocks.retrieveGoogleReviews).not.toHaveBeenCalled();
  });
  it.each([
    ['OWNER', true, true, true],
    ['MANAGER', true, true, true],
    ['STAFF', false, true, true],
  ] as const)(
    'maps %s to reputation permissions: manage=%s reply=%s note=%s',
    async (role, canManage, canReply, canNote) => {
      mocks.tenant = {
        ...mocks.tenant!,
        actor: {
          type: 'user',
          userId: googleId,
          membershipId: directId,
          role,
        },
      };
      const page = await loadReviewsPage({}, 'all');
      expect(
        (page.props as { data: ReviewsPageData }).data.permissions,
      ).toMatchObject({
        canManageFeedback: canManage,
        canCreateReply: canReply,
        canCreateNote: canNote,
      });
    },
  );

  it('reads a minimized receipt without retrieving from loaders or Today', async () => {
    const page = await loadReviewsPage({}, 'all');
    expect(
      (page.props as { data: ReviewsPageData }).data.retrievalSummary?.state,
    ).toBe('never');
    expect(mocks.loadGoogleReviewRetrievalSummary).toHaveBeenCalledOnce();
    await loadTodayDashboard();
    expect(mocks.loadGoogleReviewRetrievalSummary).toHaveBeenCalledOnce();
    expect(mocks.retrieveGoogleReviews).not.toHaveBeenCalled();
  });

  it('does not disclose establishment receipts to STAFF or Direct Feedback', async () => {
    mocks.tenant = {
      ...mocks.tenant!,
      actor: {
        type: 'user',
        userId: googleId,
        membershipId: directId,
        role: 'STAFF',
      },
    };
    const page = await loadReviewsPage({}, 'all');
    const data = (page.props as { data: ReviewsPageData }).data;
    expect(data.retrievalSummary).toBeNull();
    expect(data.permissions.canRetrieveGoogle).toBe(false);
    mocks.tenant = {
      ...mocks.tenant!,
      actor: {
        type: 'user',
        userId: googleId,
        membershipId: directId,
        role: 'OWNER',
      },
    };
    await loadReviewsPage({}, 'direct');
    expect(mocks.loadGoogleReviewRetrievalSummary).not.toHaveBeenCalled();
    expect(mocks.retrieveGoogleReviews).not.toHaveBeenCalled();
  });

  it('keeps readable work when retrieval status alone is unavailable', async () => {
    mocks.loadGoogleReviewRetrievalSummary.mockRejectedValue(
      new Error('Receipt read failed'),
    );
    const page = await loadReviewsPage({}, 'all');
    const data = (page.props as { data: ReviewsPageData }).data;
    expect(data.state).toBe('ready');
    expect(data.items[0]?.id).toBe(googleId);
    expect(data.retrievalSummary).toBeNull();
  });

  it('serializes only masked provider presentation and separate remote reply', async () => {
    mocks.findFeedbackDetail.mockResolvedValue({
      ...google,
      externalUrl: null,
      googleContentAvailability: 'unavailable',
      googleReviewChanged: false,
      canRecoverReference: true,
      authorName: null,
      rating: null,
      content: null,
      remoteReply: null,
      replies: [{ id: googleId, content: 'Saved user draft', status: 'DRAFT' }],
      notes: [],
      incidents: [],
      analysis: null,
    });
    const page = await loadReviewsPage({}, 'all');
    expect((page.props as { data: ReviewsPageData }).data.detail).toMatchObject(
      {
        googleContentAvailability: 'unavailable',
        canRecoverReference: true,
        content: null,
        remoteReply: null,
        latestReply: { content: 'Saved user draft' },
      },
    );
  });
  it.each([
    { source: 'DIRECT' },
    { source: 'ALL', rating: 'malformed', page: '-1' },
    {
      source: 'DIRECT',
      sort: 'urgency_desc',
      sentiment: 'NEGATIVE',
      urgency: 'CRITICAL',
    },
  ])(
    'keeps Google restriction for normal and malformed input %j',
    async (params) => {
      await loadReviewsPage(params, 'all');
      const call = mocks.listFeedback.mock.calls[0];
      expect(call?.[2]).toMatchObject({ source: 'GOOGLE', sort: 'newest' });
      expect(call?.[2]?.sentiment).toBeUndefined();
      expect(call?.[2]?.urgency).toBeUndefined();
      expect(call?.[3]).toMatchObject({
        requiredSource: 'GOOGLE',
        scopedCounters: true,
      });
    },
  );

  it.each(['unanswered', 'urgency_desc'])(
    'replaces the %s ordering in Release A only',
    async (sort) => {
      await loadReviewsPage({ sort }, 'all');
      expect(mocks.listFeedback.mock.calls[0]?.[2]).toMatchObject({
        sort: 'newest',
      });

      mocks.listFeedback.mockClear();
      mocks.releaseA = false;
      await loadReviewsPage({ sort }, 'all');
      expect(mocks.listFeedback.mock.calls[0]?.[2]).toMatchObject({ sort });
    },
  );

  it('keeps attention scope on parse fallback and denies selected DIRECT through the repository scope', async () => {
    const page = await loadReviewsPage(
      {
        queue: 'attention',
        selected: directId,
        rating: 'bad',
        source: 'DIRECT',
      },
      'all',
    );
    expect(mocks.listFeedback.mock.calls[0]?.[3]).toMatchObject({
      statuses: releaseAAttentionStatuses,
    });
    expect(mocks.findFeedbackDetail).toHaveBeenCalledWith(
      { test: true },
      mocks.tenant,
      directId,
      {
        requiredSource: 'GOOGLE',
        scopedCounters: true,
        attentionStatuses: releaseAAttentionStatuses,
      },
    );
    expect((page.props as { data: ReviewsPageData }).data.detail).toBeNull();
    expect(
      (page.props as { data: ReviewsPageData }).data.selectedUnavailable,
    ).toBe(true);
  });

  it('omits analysis, incident, urgency and remote unanswered outputs from the client model', async () => {
    mocks.findFeedbackDetail.mockResolvedValue({
      ...google,
      externalUrl: null,
      incidents: [{ id: 'private-incident' }],
      analysis: {
        summary: 'Private analysis',
        topics: ['Private topic'],
        suggestedAction: 'Private suggestion',
      },
      replies: [],
      notes: [],
    });
    const page = await loadReviewsPage({}, 'all');
    const data = (page.props as { data: ReviewsPageData }).data;
    expect(data.items[0]).toMatchObject({
      sentiment: null,
      urgency: null,
      incidentId: null,
    });
    expect(data.detail).toMatchObject({
      analysis: null,
      sentiment: null,
      urgency: null,
      incidentId: null,
    });
    expect(data.counters).toEqual({ total: 8, new: 2 });
    expect(JSON.stringify(data)).not.toContain('Private analysis');
    expect(data.attentionCount).toBe(8);
  });

  it('keeps internal mixed-source presentation and legacy counters', async () => {
    mocks.releaseA = false;
    mocks.listFeedback.mockResolvedValue({
      items: [google, direct],
      counters,
      pagination,
    });
    const page = await loadReviewsPage({}, 'all');
    const data = (page.props as { data: ReviewsPageData }).data;
    expect(data.items.map(({ source }) => source)).toEqual([
      'GOOGLE',
      'DIRECT',
    ]);
    expect(data.items[0]?.sentiment).toBe('POSITIVE');
    expect(data.counters).toEqual(counters);
    expect(mocks.listFeedback.mock.calls[0]?.[3]).toBeUndefined();
    expect(mocks.findGoogleReputationConnector).not.toHaveBeenCalled();
  });
});

describe('Token-free Google setup summary', () => {
  it('offers OWNER setup and other roles an owner handoff without provider access', async () => {
    expect(await loadReleaseASetupSummary(mocks.tenant!)).toMatchObject({
      setupHref: '/parametres/integrations',
    });
    mocks.tenant = {
      ...mocks.tenant!,
      actor: {
        ...mocks.tenant!.actor,
        type: 'user',
        userId: googleId,
        membershipId: directId,
        role: 'STAFF',
      },
    };
    const summary = await loadReleaseASetupSummary(mocks.tenant);
    expect(summary.setupHref).toBeNull();
    expect(summary.description).toContain('propriétaire');
    expect(mocks.findGoogleReputationConnector).toHaveBeenCalledWith(
      { test: true },
      mocks.tenant,
    );
  });

  it('does not claim any import result from a bound connector or serialize connector metadata', async () => {
    mocks.findGoogleReputationConnector.mockResolvedValue({
      status: 'CONNECTED',
      externalAccountId: 'accounts/private',
      externalLocationId: 'locations/private',
      tokenExpiresAt: new Date(),
      lastSyncError: 'private-error',
      hasAccessToken: true,
    });
    const summary = await loadReleaseASetupSummary(mocks.tenant!);
    expect(summary.description).toContain(
      'l’association seule ne confirme aucun résultat de récupération',
    );
    expect(summary.setupHref).toBeNull();
    expect(JSON.stringify(summary)).not.toMatch(/private|token|lastSync/u);
  });
});
