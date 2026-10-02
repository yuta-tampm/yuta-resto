import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { TenantContext } from '@yuta/tenant';
import type {
  GoogleReplyPublicationTarget,
  GoogleReviewDatabase,
  GoogleReviewImportRecord,
} from '@yuta/db-cloud';
vi.mock('server-only', () => ({}));
const mocks = vi.hoisted(() => ({
  prepare: vi.fn(),
  claim: vi.fn(),
  execute: vi.fn(),
  reconcile: vi.fn(),
  token: vi.fn(),
  read: vi.fn(),
  put: vi.fn(),
}));
vi.mock('@yuta/db-cloud', () => ({
  prepareGoogleReplyPublication: mocks.prepare,
  claimGoogleReplyPublication: mocks.claim,
  executeGoogleReplyPublication: mocks.execute,
  reconcileGoogleReplyPublication: mocks.reconcile,
  assertGoogleReplyTargetTime: () => {},
}));
vi.mock('../src/server/cloud-database', () => ({ cloudDatabase: {} }));
vi.mock('../src/server/reputation/google-connector-access', () => ({
  getGooglePublicationAccessToken: mocks.token,
}));
vi.mock('../src/server/reputation/google-business-profile-client', async () => {
  const actual = await vi.importActual<
    typeof import('../src/server/reputation/google-business-profile-client')
  >('../src/server/reputation/google-business-profile-client');
  return { ...actual, getGoogleBusinessReview: mocks.read };
});
vi.mock('../src/server/reputation/google-reply-provider', async () => {
  const actual = await vi.importActual<
    typeof import('../src/server/reputation/google-reply-provider')
  >('../src/server/reputation/google-reply-provider');
  return { ...actual, putGoogleReviewReply: mocks.put };
});
import {
  confirmGoogleReply,
  previewGoogleReply,
  reconcileGoogleReply,
} from '../src/server/reputation/google-reply-publication';
import { googleRemoteReplyFingerprint } from '../src/server/reputation/google-reply-provider';
import { GoogleBusinessProfileApiError } from '../src/server/reputation/google-business-profile-client';
const id = 'fbca289d-bbc7-4399-bd6c-a18613c9eb62';
const tenant: TenantContext = {
  organizationId: id,
  establishmentId: id,
  actor: { type: 'user', userId: id, membershipId: id, role: 'OWNER' },
  locale: 'fr-FR',
  timezone: 'Europe/Paris',
  entitlements: new Set(['reputation.enabled']),
};
const target: GoogleReplyPublicationTarget = {
  feedbackId: id,
  replyId: id,
  revision: 1,
  text: 'Exact text',
  establishmentName: 'Synthetic restaurant',
  binding: {
    connectorId: id,
    bindingGeneration: 1,
    externalAccountId: 'accounts/a',
    externalLocationId: 'locations/l',
  },
  reviewName: 'accounts/a/locations/l/reviews/r',
  actor: { sessionId: id, userId: id, membershipId: id, authVersion: 0 },
  authorityExpiresAt: new Date('2030-01-01T00:00:00Z'),
};
const remote: GoogleReviewImportRecord = {
  reviewName: target.reviewName,
  reviewId: 'r',
  authorName: null,
  rating: 5,
  content: null,
  providerCreatedAt: new Date(),
  providerUpdatedAt: new Date(),
  remoteReply: null,
};
beforeEach(() => {
  vi.stubEnv('GOOGLE_REVIEW_PUBLICATION_ENABLED', 'true');
  Object.values(mocks).forEach((mock) => mock.mockReset());
  mocks.token.mockResolvedValue('synthetic-token');
  mocks.claim.mockResolvedValue({ claimed: true });
  mocks.execute.mockImplementation(
    async (_db, _tenant, _session, _id, operation) =>
      operation(
        {} as GoogleReviewDatabase,
        target,
        googleRemoteReplyFingerprint(remote),
      ),
  );
  mocks.reconcile.mockImplementation(
    async (_db, _tenant, _session, _id, operation) =>
      operation({} as GoogleReviewDatabase, target),
  );
  mocks.read.mockResolvedValue(remote);
  mocks.put.mockResolvedValue(undefined);
});
afterEach(() => vi.unstubAllEnvs());
describe('Google publication service orchestration', () => {
  it.each(['false', 'invalid', undefined])(
    'denies disabled admission before DB credentials/provider effects',
    async (flag) => {
      vi.stubEnv('GOOGLE_REVIEW_PUBLICATION_ENABLED', flag);
      await expect(
        confirmGoogleReply(tenant, id, { attemptId: id }),
      ).rejects.toThrow();
      await expect(
        previewGoogleReply(tenant, id, {
          feedbackId: id,
          replyId: id,
          revision: 1,
        }),
      ).rejects.toThrow();
      await expect(
        reconcileGoogleReply(tenant, id, { attemptId: id }),
      ).rejects.toThrow();
      expect(mocks.claim).not.toHaveBeenCalled();
      expect(mocks.token).not.toHaveBeenCalled();
      expect(mocks.read).not.toHaveBeenCalled();
      expect(mocks.put).not.toHaveBeenCalled();
    },
  );
  it('denies STAFF before side effects', async () => {
    const staff = {
      ...tenant,
      actor: {
        ...tenant.actor,
        type: 'user' as const,
        userId: id,
        membershipId: id,
        role: 'STAFF' as const,
      },
    };
    await expect(
      confirmGoogleReply(staff, id, { attemptId: id }),
    ).rejects.toThrow();
    expect(mocks.claim).not.toHaveBeenCalled();
  });
  it('never dispatches replayed confirmations', async () => {
    mocks.claim.mockResolvedValue({
      claimed: false,
      receipt: { state: 'DISPATCHING' },
    });
    expect(await confirmGoogleReply(tenant, id, { attemptId: id })).toEqual({
      state: 'DISPATCHING',
    });
    expect(mocks.execute).not.toHaveBeenCalled();
    expect(mocks.put).not.toHaveBeenCalled();
  });
  it('rejects detected remote change before PUT', async () => {
    mocks.read.mockResolvedValue({
      ...remote,
      remoteReply: {
        content: 'Someone else changed it',
        updatedAt: new Date(),
        status: 'APPROVED',
      },
    });
    expect(
      await confirmGoogleReply(tenant, id, { attemptId: id }),
    ).toMatchObject({ state: 'FAILED', errorCategory: 'REMOTE_CHANGED' });
    expect(mocks.put).not.toHaveBeenCalled();
  });
  it('performs one PUT then a separate exact observation', async () => {
    mocks.read.mockResolvedValueOnce(remote).mockResolvedValueOnce({
      ...remote,
      remoteReply: {
        content: target.text,
        updatedAt: new Date(),
        status: 'PENDING',
      },
    });
    expect(
      await confirmGoogleReply(tenant, id, { attemptId: id }),
    ).toMatchObject({ state: 'PENDING' });
    expect(mocks.put).toHaveBeenCalledExactlyOnceWith(
      'synthetic-token',
      target.binding,
      target.reviewName,
      target.text,
    );
    expect(mocks.read).toHaveBeenCalledTimes(2);
  });
  it('keeps ACK plus absent/different/failed observation unconfirmed', async () => {
    expect(
      await confirmGoogleReply(tenant, id, { attemptId: id }),
    ).toMatchObject({ state: 'UNCONFIRMED' });
    mocks.read
      .mockReset()
      .mockResolvedValueOnce(remote)
      .mockRejectedValueOnce(new Error('Network'));
    expect(
      await confirmGoogleReply(tenant, id, { attemptId: id }),
    ).toMatchObject({ state: 'UNCONFIRMED' });
  });
  it('keeps timeout/malformed/ambiguous PUT uncertain without retries', async () => {
    mocks.put.mockRejectedValue(
      new GoogleBusinessProfileApiError(
        'Synthetic invalid',
        502,
        'INVALID_RESPONSE',
      ),
    );
    expect(
      await confirmGoogleReply(tenant, id, { attemptId: id }),
    ).toMatchObject({ state: 'UNCERTAIN', errorCategory: 'INVALID_RESPONSE' });
    expect(mocks.put).toHaveBeenCalledTimes(1);
  });
  it('reconciliation never writes a provider reply', async () => {
    mocks.read.mockResolvedValue({
      ...remote,
      remoteReply: {
        content: target.text,
        updatedAt: new Date(),
        status: 'APPROVED',
      },
    });
    expect(
      await reconcileGoogleReply(tenant, id, { attemptId: id }),
    ).toMatchObject({ state: 'APPROVED' });
    expect(mocks.put).not.toHaveBeenCalled();
  });
});
