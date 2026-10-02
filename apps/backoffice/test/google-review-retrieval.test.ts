import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { TenantContext, TenantRole } from '@yuta/tenant';
import type {
  GoogleReviewBinding,
  GoogleReviewImportRecord,
  GoogleReviewRetrievalLease,
  GoogleReviewRetrievalSummary,
} from '@yuta/db-cloud';

const hooks = vi.hoisted(() => ({
  begin: vi.fn(),
  commit: vi.fn(),
  fail: vi.fn(),
  summary: vi.fn(),
  capturedCredentials: vi.fn(),
  capturedTokenWrite: vi.fn(),
  legacyCredentials: vi.fn(),
  legacyTokenWrite: vi.fn(),
  configuration: vi.fn(),
  refresh: vi.fn(),
  list: vi.fn(),
  get: vi.fn(),
}));
vi.mock('server-only', () => ({}));
vi.mock('../src/server/cloud-database', () => ({
  cloudDatabase: { synthetic: true },
}));
vi.mock('@yuta/db-cloud', async (original) => ({
  ...(await original<typeof import('@yuta/db-cloud')>()),
  beginGoogleReviewRetrieval: hooks.begin,
  commitGoogleReviewRetrieval: hooks.commit,
  failGoogleReviewRetrieval: hooks.fail,
  findGoogleReviewRetrievalSummary: hooks.summary,
  findCapturedGoogleConnectorCredentials: hooks.capturedCredentials,
  updateCapturedGoogleConnectorAccessToken: hooks.capturedTokenWrite,
  findGoogleReputationConnectorCredentials: hooks.legacyCredentials,
  updateGoogleReputationConnectorAccessToken: hooks.legacyTokenWrite,
}));
vi.mock(
  '../src/server/reputation/google-connector-config',
  async (original) => ({
    ...(await original<
      typeof import('../src/server/reputation/google-connector-config')
    >()),
    getGoogleConnectorConfiguration: hooks.configuration,
  }),
);
vi.mock(
  '../src/server/reputation/google-business-profile-client',
  async (original) => ({
    ...(await original<
      typeof import('../src/server/reputation/google-business-profile-client')
    >()),
    refreshGoogleAccessToken: hooks.refresh,
    listGoogleBusinessReviews: hooks.list,
    getGoogleBusinessReview: hooks.get,
  }),
);

import { GoogleReviewRetrievalRepositoryError } from '@yuta/db-cloud';
import { encryptCredential } from '../src/server/reputation/credential-crypto';
import { getGoogleConnectorAccessToken } from '../src/server/reputation/google-connector-access';
import { GoogleBusinessProfileApiError } from '../src/server/reputation/google-business-profile-client';
import { GoogleConnectorConfigurationError } from '../src/server/reputation/google-connector-config';
import {
  canRetrieveGoogleReviews,
  loadGoogleReviewRetrievalSummary,
  retrieveGoogleReviews,
} from '../src/server/reputation/google-review-retrieval';

const ids = {
  organization: '0a82dd88-3d23-40fd-8a16-6480f91d2bc4',
  establishment: '2bb31d75-e871-4c83-8df2-aa1f36298536',
  user: '78d0d430-727e-4efb-bc16-cfb130f6ec59',
  membership: 'a79deba5-e1eb-4e5a-96ce-74a9c2510bda',
  session: 'e2a8ddcb-36e3-49b9-b232-e401785e7155',
  continuation: 'a7e3a5d9-10b7-4c09-a9d6-4bc968ab4ccb',
  feedback: '7a673f7a-4189-47d5-a987-d692fc2d95fc',
};
const tenant = (role: TenantRole = 'OWNER'): TenantContext => ({
  organizationId: ids.organization,
  establishmentId: ids.establishment,
  actor: { type: 'user', userId: ids.user, membershipId: ids.membership, role },
  entitlements: new Set(['reputation.enabled']),
  locale: 'fr-FR',
  timezone: 'Europe/Paris',
});
const now = new Date('2026-10-01T12:00:00.000Z');
const key = Buffer.alloc(32, 17);
const binding: GoogleReviewBinding = {
  connectorId: 'b6f2bb7f-26bb-4f2b-8720-ddb4a3440819',
  bindingGeneration: 3,
  externalAccountId: 'accounts/synthetic-account',
  externalLocationId: 'locations/synthetic-location',
};
const review: GoogleReviewImportRecord = {
  reviewName: `${binding.externalAccountId}/${binding.externalLocationId}/reviews/synthetic-review`,
  reviewId: 'synthetic-review',
  authorName: 'Synthetic reviewer',
  rating: 5,
  content: 'Synthetic content',
  providerCreatedAt: now,
  providerUpdatedAt: now,
  remoteReply: null,
};
const lease: GoogleReviewRetrievalLease = {
  attemptId: 'de5a857f-5a6b-49c6-bd61-9f9ca5c65c69',
  sequenceId: '262fd90a-453a-4a2a-bc7f-9dbbfa9bcb9e',
  kind: 'RECENT',
  organizationId: ids.organization,
  establishmentId: ids.establishment,
  binding,
  actor: {
    sessionId: ids.session,
    userId: ids.user,
    membershipId: ids.membership,
    authVersion: 4,
  },
  leaseExpiresAt: new Date(now.getTime() + 120_000),
  feedbackId: null,
  reviewName: null,
};
const summary: GoogleReviewRetrievalSummary = {
  state: 'completed_content',
  bound: true,
  lastAttemptKind: 'RECENT',
  lastAttemptAt: now,
  lastSuccessfulAt: new Date('2026-10-01T11:00:00Z'),
  lastRecentSuccessAt: new Date('2026-10-01T11:00:00Z'),
  lastError: null,
  coverage: 'partial',
  continuationHandle: ids.continuation,
  lastBatchCount: 1,
  currentContentAvailable: true,
};
const credentials = () => ({
  encryptedAccessToken: encryptCredential('synthetic-access-token', key),
  encryptedRefreshToken: encryptCredential('synthetic-refresh-token', key),
  tokenExpiresAt: new Date(now.getTime() + 3_600_000),
  grantedScopes: ['synthetic-scope'],
});

beforeEach(() => {
  vi.resetAllMocks();
  vi.useFakeTimers();
  vi.setSystemTime(now);
  vi.stubEnv('GOOGLE_REVIEW_RETRIEVAL_ENABLED', 'true');
  hooks.begin.mockResolvedValue({
    status: 'STARTED',
    lease,
    providerRequest: { pageToken: null, reviewName: null },
  });
  hooks.commit.mockResolvedValue({
    status: 'COMPLETED',
    addedCount: 1,
    changedCount: 0,
    returnedCount: 1,
  });
  hooks.fail.mockResolvedValue(true);
  hooks.summary.mockResolvedValue(summary);
  hooks.capturedCredentials.mockResolvedValue(credentials());
  hooks.legacyCredentials.mockResolvedValue(credentials());
  hooks.capturedTokenWrite.mockResolvedValue(true);
  hooks.configuration.mockReturnValue({
    clientId: 'synthetic-client',
    clientSecret: 'synthetic-secret',
    redirectUri: 'https://synthetic.invalid/callback',
    encryptionKey: key,
  });
  hooks.refresh.mockResolvedValue({
    accessToken: 'synthetic-refreshed-token',
    expiresAt: new Date(now.getTime() + 3_600_000),
    scopes: ['synthetic-scope'],
  });
  hooks.list.mockResolvedValue({
    reviews: [review],
    totalReviewCount: 12,
    nextPageToken: 'server-provider-token',
  });
  hooks.get.mockResolvedValue(review);
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
});

describe('Google retrieval operation authority and admission', () => {
  it.each(['OWNER', 'MANAGER'] as const)(
    'allows %s through the operation grant',
    (role) => {
      expect(canRetrieveGoogleReviews(tenant(role))).toBe(true);
    },
  );

  it.each([
    tenant('STAFF'),
    { ...tenant(), entitlements: new Set<string>() },
    { ...tenant(), establishmentId: null },
    {
      ...tenant(),
      actor: { type: 'service', serviceName: 'synthetic' },
    } satisfies TenantContext,
  ])(
    'denies an unauthorized context before summary/persistence/credentials/provider access',
    async (context) => {
      expect(canRetrieveGoogleReviews(context)).toBe(false);
      await expect(loadGoogleReviewRetrievalSummary(context)).rejects.toThrow();
      await expect(
        retrieveGoogleReviews(context, ids.session, {
          kind: 'recent',
          trigger: 'visit',
        }),
      ).rejects.toThrow();
      expect(hooks.summary).not.toHaveBeenCalled();
      expect(hooks.begin).not.toHaveBeenCalled();
      expect(hooks.capturedCredentials).not.toHaveBeenCalled();
      expect(hooks.configuration).not.toHaveBeenCalled();
      expect(hooks.list).not.toHaveBeenCalled();
    },
  );

  it.each([undefined, '', 'false', 'TRUE', ' true ', '1'])(
    'fails closed for admission value %j before token/provider effects',
    async (value) => {
      vi.stubEnv('GOOGLE_REVIEW_RETRIEVAL_ENABLED', value);
      const result = await retrieveGoogleReviews(tenant(), ids.session, {
        kind: 'recent',
        trigger: 'manual',
      });
      expect(result.kind).toBe('unavailable');
      expect(result.summary.enabled).toBe(false);
      expect(hooks.begin).not.toHaveBeenCalled();
      expect(hooks.capturedCredentials).not.toHaveBeenCalled();
      expect(hooks.configuration).not.toHaveBeenCalled();
      expect(hooks.list).not.toHaveBeenCalled();
      expect(hooks.commit).not.toHaveBeenCalled();
    },
  );

  it('validates session and strict transport before persistence', async () => {
    await expect(
      retrieveGoogleReviews(tenant(), 'forged-session', {
        kind: 'recent',
        trigger: 'visit',
      }),
    ).rejects.toThrow();
    await expect(
      retrieveGoogleReviews(tenant(), ids.session, {
        kind: 'recent',
        trigger: 'visit',
        ...{ organizationId: ids.organization },
      }),
    ).rejects.toThrow();
    await expect(
      retrieveGoogleReviews(tenant(), ids.session, {
        kind: 'history',
        continuationHandle: 'raw-provider-token',
      }),
    ).rejects.toThrow();
    expect(hooks.begin).not.toHaveBeenCalled();
    expect(hooks.capturedCredentials).not.toHaveBeenCalled();
  });

  it('projects only serialization-safe summary fields and no credentials/provider identity', async () => {
    const result = await loadGoogleReviewRetrievalSummary(tenant('MANAGER'));
    expect(result.lastAttemptKind).toBe('recent');
    expect(result.lastSuccessfulAt).toBe('2026-10-01T11:00:00.000Z');
    expect(result.continuationHandle).toBe(ids.continuation);
    expect(result.enabled).toBe(true);
    expect(JSON.stringify(result)).not.toMatch(
      /synthetic-account|synthetic-location|synthetic-access-token|server-provider-token/,
    );
  });
});

describe('captured Google retrieval orchestration', () => {
  it('captures visit authority before token access and commits one validated recent page', async () => {
    const result = await retrieveGoogleReviews(tenant('MANAGER'), ids.session, {
      kind: 'recent',
      trigger: 'visit',
    });
    expect(result).toMatchObject({
      kind: 'completed',
      addedCount: 1,
      changedCount: 0,
    });
    expect(hooks.begin).toHaveBeenCalledWith(
      expect.anything(),
      tenant('MANAGER'),
      {
        sessionId: ids.session,
        kind: 'RECENT',
        force: false,
        now,
      },
    );
    expect(hooks.capturedCredentials).toHaveBeenCalledWith(
      expect.anything(),
      tenant('MANAGER'),
      binding,
    );
    expect(hooks.begin.mock.invocationCallOrder[0]).toBeLessThan(
      hooks.capturedCredentials.mock.invocationCallOrder[0]!,
    );
    expect(hooks.list).toHaveBeenCalledExactlyOnceWith(
      'synthetic-access-token',
      binding,
      null,
    );
    expect(hooks.commit).toHaveBeenCalledWith(
      expect.anything(),
      tenant('MANAGER'),
      lease,
      {
        reviews: [review],
        totalReviewCount: 12,
        nextPageToken: 'server-provider-token',
        fetchedAt: now,
      },
    );
    expect(hooks.fail).not.toHaveBeenCalled();
    expect(JSON.stringify(result)).not.toContain('server-provider-token');
  });

  it('distinguishes explicit manual force from a visit', async () => {
    await retrieveGoogleReviews(tenant(), ids.session, {
      kind: 'recent',
      trigger: 'manual',
    });
    expect(hooks.begin.mock.calls[0]![2]).toMatchObject({
      kind: 'RECENT',
      force: true,
    });
  });

  it.each([
    ['FRESH', 'fresh'],
    ['PENDING', 'pending'],
    ['UNAVAILABLE', 'unavailable'],
    ['INVALID_CONTINUATION', 'invalid_continuation'],
    ['NO_REFERENCE', 'no_reference'],
  ] as const)(
    'returns %s without another provider request',
    async (status, kind) => {
      hooks.begin.mockResolvedValue({ status });
      expect(
        (
          await retrieveGoogleReviews(tenant(), ids.session, {
            kind: 'recent',
            trigger: 'visit',
          })
        ).kind,
      ).toBe(kind);
      expect(hooks.capturedCredentials).not.toHaveBeenCalled();
      expect(hooks.list).not.toHaveBeenCalled();
      expect(hooks.commit).not.toHaveBeenCalled();
    },
  );

  it('uses only the server-held history token after opaque-handle authorization', async () => {
    hooks.begin.mockResolvedValue({
      status: 'STARTED',
      lease: { ...lease, kind: 'HISTORY' },
      providerRequest: {
        pageToken: 'captured-provider-continuation',
        reviewName: null,
      },
    });
    await retrieveGoogleReviews(tenant(), ids.session, {
      kind: 'history',
      continuationHandle: ids.continuation,
    });
    expect(hooks.begin.mock.calls[0]![2]).toMatchObject({
      kind: 'HISTORY',
      continuationHandle: ids.continuation,
    });
    expect(hooks.list).toHaveBeenCalledExactlyOnceWith(
      'synthetic-access-token',
      binding,
      'captured-provider-continuation',
    );
    expect(hooks.get).not.toHaveBeenCalled();
  });

  it('uses only the captured conditional detail reference, with no list retrieval', async () => {
    hooks.begin.mockResolvedValue({
      status: 'STARTED',
      lease: {
        ...lease,
        kind: 'DETAIL',
        feedbackId: ids.feedback,
        reviewName: review.reviewName,
      },
      providerRequest: { pageToken: null, reviewName: review.reviewName },
    });
    await retrieveGoogleReviews(tenant(), ids.session, {
      kind: 'detail',
      feedbackId: ids.feedback,
    });
    expect(hooks.get).toHaveBeenCalledExactlyOnceWith(
      'synthetic-access-token',
      binding,
      review.reviewName,
    );
    expect(hooks.list).not.toHaveBeenCalled();
    expect(hooks.commit.mock.calls[0]![3]).toEqual({
      reviews: [review],
      totalReviewCount: null,
      nextPageToken: null,
      fetchedAt: now,
    });
  });

  it('returns truthful completed-empty counts', async () => {
    hooks.list.mockResolvedValue({
      reviews: [],
      nextPageToken: null,
      totalReviewCount: 0,
    });
    hooks.commit.mockResolvedValue({
      status: 'COMPLETED',
      addedCount: 0,
      changedCount: 0,
      returnedCount: 0,
    });
    hooks.summary.mockResolvedValue({
      ...summary,
      state: 'completed_empty',
      coverage: 'end',
      lastBatchCount: 0,
      continuationHandle: null,
    });
    expect(
      await retrieveGoogleReviews(tenant(), ids.session, {
        kind: 'recent',
        trigger: 'visit',
      }),
    ).toMatchObject({
      kind: 'completed',
      addedCount: 0,
      changedCount: 0,
      summary: { state: 'completed_empty', lastBatchCount: 0 },
    });
  });

  it.each([
    [
      new Error('native failure https://secret.invalid?token=secret-value'),
      'PROVIDER_UNAVAILABLE',
    ],
    [
      new GoogleBusinessProfileApiError('safe', 502, 'INVALID_RESPONSE'),
      'INVALID_RESPONSE',
    ],
    [new GoogleBusinessProfileApiError('safe', 404), 'NOT_FOUND'],
    [new GoogleBusinessProfileApiError('safe', 401), 'AUTH_REQUIRED'],
    [new GoogleBusinessProfileApiError('safe', 403), 'FORBIDDEN'],
    [
      new GoogleConnectorConfigurationError('safe configuration unavailable'),
      'CONFIGURATION_UNAVAILABLE',
    ],
  ] as const)(
    'records only sanitized categories and preserves successful freshness',
    async (error, category) => {
      hooks.list.mockRejectedValue(error);
      hooks.summary.mockResolvedValue({
        ...summary,
        state: 'failed',
        lastError: category,
      });
      const result = await retrieveGoogleReviews(tenant(), ids.session, {
        kind: 'recent',
        trigger: 'visit',
      });
      expect(result.kind).toBe('failed');
      expect(result.summary.lastSuccessfulAt).toBe('2026-10-01T11:00:00.000Z');
      expect(hooks.fail).toHaveBeenCalledWith(
        expect.anything(),
        tenant(),
        lease,
        { category, now },
      );
      expect(hooks.commit).not.toHaveBeenCalled();
      expect(JSON.stringify(result)).not.toMatch(/secret-value|secret.invalid/);
    },
  );

  it('rejects begin-time revoked authority without token access or summary reread', async () => {
    hooks.begin.mockRejectedValue(
      new GoogleReviewRetrievalRepositoryError('STALE_AUTHORITY'),
    );
    await expect(
      retrieveGoogleReviews(tenant(), ids.session, {
        kind: 'recent',
        trigger: 'visit',
      }),
    ).rejects.toMatchObject({ code: 'STALE_AUTHORITY' });
    expect(hooks.capturedCredentials).not.toHaveBeenCalled();
    expect(hooks.summary).not.toHaveBeenCalled();
    expect(hooks.fail).not.toHaveBeenCalled();
  });

  it.each(['STALE_AUTHORITY', 'IDENTITY_CONFLICT'] as const)(
    'cannot report a completed receipt after commit failure %s',
    async (code) => {
      hooks.commit.mockRejectedValue(
        new GoogleReviewRetrievalRepositoryError(code),
      );
      if (code === 'STALE_AUTHORITY') {
        hooks.fail.mockResolvedValue(false);
        await expect(
          retrieveGoogleReviews(tenant(), ids.session, {
            kind: 'recent',
            trigger: 'visit',
          }),
        ).rejects.toMatchObject({ code: 'STALE_AUTHORITY' });
        expect(hooks.summary).not.toHaveBeenCalled();
      } else {
        hooks.summary.mockResolvedValue({
          ...summary,
          state: 'failed',
          lastError: code,
        });
        expect(
          (
            await retrieveGoogleReviews(tenant(), ids.session, {
              kind: 'recent',
              trigger: 'visit',
            })
          ).kind,
        ).toBe('failed');
      }
    },
  );

  it('does not reread summary after a lease/actor disappears during failure recording', async () => {
    hooks.list.mockRejectedValue(new Error('synthetic transport failed'));
    hooks.fail.mockResolvedValue(false);
    await expect(
      retrieveGoogleReviews(tenant(), ids.session, {
        kind: 'recent',
        trigger: 'visit',
      }),
    ).rejects.toMatchObject({ code: 'STALE_AUTHORITY' });
    expect(hooks.summary).not.toHaveBeenCalled();
  });
});

describe('captured credential and token-write fencing', () => {
  it('rejects a captured credential lookup lost to rebind', async () => {
    hooks.capturedCredentials.mockResolvedValue(null);
    await expect(
      retrieveGoogleReviews(tenant(), ids.session, {
        kind: 'recent',
        trigger: 'visit',
      }),
    ).rejects.toMatchObject({ code: 'STALE_AUTHORITY' });
    expect(hooks.list).not.toHaveBeenCalled();
    expect(hooks.commit).not.toHaveBeenCalled();
    expect(hooks.summary).not.toHaveBeenCalled();
    expect(hooks.legacyCredentials).not.toHaveBeenCalled();
  });

  it('fences a refreshed token against the captured generation', async () => {
    hooks.capturedCredentials.mockResolvedValue({
      ...credentials(),
      tokenExpiresAt: now,
    });
    await retrieveGoogleReviews(tenant(), ids.session, {
      kind: 'recent',
      trigger: 'visit',
    });
    expect(hooks.refresh).toHaveBeenCalledWith(
      expect.anything(),
      'synthetic-refresh-token',
    );
    expect(hooks.capturedTokenWrite).toHaveBeenCalledWith(
      expect.anything(),
      tenant(),
      binding,
      expect.objectContaining({
        tokenExpiresAt: new Date(now.getTime() + 3_600_000),
        grantedScopes: ['synthetic-scope'],
      }),
    );
    expect(hooks.legacyTokenWrite).not.toHaveBeenCalled();
    expect(hooks.list).toHaveBeenCalledWith(
      'synthetic-refreshed-token',
      binding,
      null,
    );
  });

  it('never uses a refreshed token whose binding write failed', async () => {
    hooks.capturedCredentials.mockResolvedValue({
      ...credentials(),
      tokenExpiresAt: now,
    });
    hooks.capturedTokenWrite.mockResolvedValue(false);
    await expect(
      retrieveGoogleReviews(tenant(), ids.session, {
        kind: 'recent',
        trigger: 'visit',
      }),
    ).rejects.toMatchObject({ code: 'STALE_AUTHORITY' });
    expect(hooks.list).not.toHaveBeenCalled();
    expect(hooks.commit).not.toHaveBeenCalled();
    expect(hooks.summary).not.toHaveBeenCalled();
  });

  it('returns a sanitized auth-required outcome after OAuth refusal', async () => {
    hooks.capturedCredentials.mockResolvedValue({
      ...credentials(),
      tokenExpiresAt: now,
    });
    hooks.refresh.mockRejectedValue(
      new GoogleBusinessProfileApiError('safe', 401),
    );
    expect(
      (
        await retrieveGoogleReviews(tenant(), ids.session, {
          kind: 'recent',
          trigger: 'visit',
        })
      ).kind,
    ).toBe('failed');
    expect(hooks.fail.mock.calls[0]![3].category).toBe('AUTH_REQUIRED');
    expect(hooks.list).not.toHaveBeenCalled();
    expect(hooks.capturedTokenWrite).not.toHaveBeenCalled();
  });

  it('denies direct captured access for STAFF or disabled retrieval without credential reads', async () => {
    await expect(
      getGoogleConnectorAccessToken(tenant('STAFF'), binding),
    ).rejects.toThrow();
    vi.stubEnv('GOOGLE_REVIEW_RETRIEVAL_ENABLED', 'false');
    expect(await getGoogleConnectorAccessToken(tenant(), binding)).toBeNull();
    expect(hooks.capturedCredentials).not.toHaveBeenCalled();
    expect(hooks.configuration).not.toHaveBeenCalled();
  });

  it('preserves prior OAuth foundation token access when review retrieval is disabled', async () => {
    vi.stubEnv('GOOGLE_REVIEW_RETRIEVAL_ENABLED', 'false');
    expect(await getGoogleConnectorAccessToken(tenant())).toBe(
      'synthetic-access-token',
    );
    expect(hooks.legacyCredentials).toHaveBeenCalledWith(
      expect.anything(),
      tenant(),
    );
    expect(hooks.capturedCredentials).not.toHaveBeenCalled();
  });

  it('preserves prior OAuth foundation refresh write seam', async () => {
    vi.stubEnv('GOOGLE_REVIEW_RETRIEVAL_ENABLED', 'false');
    hooks.legacyCredentials.mockResolvedValue({
      ...credentials(),
      tokenExpiresAt: now,
    });
    expect(await getGoogleConnectorAccessToken(tenant())).toBe(
      'synthetic-refreshed-token',
    );
    expect(hooks.legacyTokenWrite).toHaveBeenCalledWith(
      expect.anything(),
      tenant(),
      expect.objectContaining({ grantedScopes: ['synthetic-scope'] }),
    );
    expect(hooks.capturedTokenWrite).not.toHaveBeenCalled();
  });
});
