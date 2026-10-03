import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type {
  GoogleReviewBinding,
  GoogleReviewImportRecord,
} from '@yuta/db-cloud';
vi.mock('server-only', () => ({}));
import {
  putGoogleReviewReply,
  observedGoogleReplyResult,
  googleRemoteReplyFingerprint,
} from '../src/server/reputation/google-reply-provider';
const fetchMock = vi.fn<typeof fetch>();
const binding: GoogleReviewBinding = {
  connectorId: 'fbca289d-bbc7-4399-bd6c-a18613c9eb62',
  bindingGeneration: 1,
  externalAccountId: 'accounts/a',
  externalLocationId: 'locations/l',
};
const name = 'accounts/a/locations/l/reviews/r';
const review: GoogleReviewImportRecord = {
  reviewName: name,
  reviewId: 'r',
  rating: 5,
  authorName: 'Synthetic reviewer',
  content: null,
  providerCreatedAt: new Date(),
  providerUpdatedAt: new Date(),
  remoteReply: {
    content: 'Exact text',
    updatedAt: new Date('2030-01-01T00:00:00Z'),
    status: 'PENDING',
  },
};
beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal('fetch', fetchMock);
});
afterEach(() => vi.unstubAllGlobals());
describe('Google PUT reply and observed result', () => {
  it('uses exact verified resource/text, no-store and a bounded signal', async () => {
    fetchMock.mockResolvedValue(
      Response.json({
        comment: 'Exact text',
        updateTime: '2030-01-01T00:00:00Z',
        reviewReplyState: 'PENDING',
      }),
    );
    await putGoogleReviewReply('synthetic-token', binding, name, 'Exact text');
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(String(url)).toBe(
      `https://mybusiness.googleapis.com/v4/${name}/reply`,
    );
    expect(init).toMatchObject({
      method: 'PUT',
      cache: 'no-store',
      body: JSON.stringify({ comment: 'Exact text' }),
      headers: {
        authorization: 'Bearer synthetic-token',
        'content-type': 'application/json',
      },
    });
    expect(init?.signal).toBeInstanceOf(AbortSignal);
  });
  it('denies foreign targets and oversized UTF-8 text before fetch', async () => {
    await expect(
      putGoogleReviewReply(
        'token',
        binding,
        'accounts/foreign/locations/l/reviews/r',
        'Exact text',
      ),
    ).rejects.toThrow();
    await expect(
      putGoogleReviewReply('token', binding, name, '🍜'.repeat(1025)),
    ).rejects.toThrow();
    expect(fetchMock).not.toHaveBeenCalled();
  });
  it.each([
    { comment: 'Different', updateTime: '2030-01-01T00:00:00Z' },
    { comment: 'Exact text' },
    { comment: 'Exact text', updateTime: 'invalid' },
  ])('rejects malformed or mismatched acknowledgement', async (payload) => {
    fetchMock.mockResolvedValue(Response.json(payload));
    await expect(
      putGoogleReviewReply('token', binding, name, 'Exact text'),
    ).rejects.toMatchObject({ category: 'INVALID_RESPONSE' });
  });
  it('separates pending/rejected/approved/unknown from matching text observation', () => {
    expect(observedGoogleReplyResult(review, 'Different')).toBeNull();
    for (const state of ['APPROVED', 'PENDING', 'REJECTED'])
      expect(
        observedGoogleReplyResult(
          { ...review, remoteReply: { ...review.remoteReply!, status: state } },
          'Exact text',
        ),
      ).toMatchObject({ state });
    for (const state of [null, 'FUTURE_STATE'])
      expect(
        observedGoogleReplyResult(
          { ...review, remoteReply: { ...review.remoteReply!, status: state } },
          'Exact text',
        ),
      ).toMatchObject({ state: 'UNCONFIRMED' });
    expect(googleRemoteReplyFingerprint(review)).not.toBe(
      googleRemoteReplyFingerprint({ ...review, remoteReply: null }),
    );
    expect(googleRemoteReplyFingerprint(review)).not.toBe(
      googleRemoteReplyFingerprint({
        ...review,
        remoteReply: { ...review.remoteReply!, content: 'Changed' },
      }),
    );
  });
});
