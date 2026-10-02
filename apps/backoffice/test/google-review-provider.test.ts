import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { GoogleReviewBinding } from '@yuta/db-cloud';

vi.mock('server-only', () => ({}));

import {
  getGoogleBusinessReview,
  GoogleBusinessProfileApiError,
  listGoogleBusinessReviews,
} from '../src/server/reputation/google-business-profile-client';

const binding: GoogleReviewBinding = {
  connectorId: 'fbca289d-bbc7-4399-bd6c-a18613c9eb62',
  bindingGeneration: 4,
  externalAccountId: 'accounts/account-1',
  externalLocationId: 'locations/location-1',
};
const name = 'accounts/account-1/locations/location-1/reviews/review-1';
const review = () => ({
  name,
  reviewId: 'review-1',
  reviewer: {
    displayName: 'Synthetic reviewer',
    profilePhotoUrl: 'https://unused.test/photo',
  },
  starRating: 'FOUR',
  comment: 'Synthetic Google content',
  createTime: '2026-09-01T12:00:00.000Z',
  updateTime: '2026-09-02T14:00:00+02:00',
  reviewReply: {
    comment: 'Synthetic remote reply',
    updateTime: '2026-09-02T13:00:00.000Z',
    reviewReplyState: 'FUTURE_UNKNOWN_STATE',
    policyViolation: { unused: true },
  },
  photos: [{ unused: true }],
});
const fetchMock = vi.fn<typeof fetch>();

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal('fetch', fetchMock);
});
afterEach(() => vi.unstubAllGlobals());

describe('single-page Google review provider boundary', () => {
  it('uses captured scope, one page, explicit order, no-store and minimized projection', async () => {
    fetchMock.mockResolvedValue(
      Response.json({
        reviews: [review()],
        totalReviewCount: 70,
        nextPageToken: 'provider-page-2',
        averageRating: 4.7,
      }),
    );
    const result = await listGoogleBusinessReviews(
      'synthetic-token',
      binding,
      'captured-page',
    );
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [input, init] = fetchMock.mock.calls[0]!;
    const url = new URL(String(input));
    expect(url.origin).toBe('https://mybusiness.googleapis.com');
    expect(url.pathname).toBe(
      '/v4/accounts/account-1/locations/location-1/reviews',
    );
    expect(url.searchParams.get('pageSize')).toBe('50');
    expect(url.searchParams.get('orderBy')).toBe('updateTime desc');
    expect(url.searchParams.get('pageToken')).toBe('captured-page');
    expect(init).toEqual({
      headers: { authorization: 'Bearer synthetic-token' },
      cache: 'no-store',
    });
    expect(result).toEqual({
      reviews: [
        {
          reviewName: name,
          reviewId: 'review-1',
          authorName: 'Synthetic reviewer',
          rating: 4,
          content: 'Synthetic Google content',
          providerCreatedAt: new Date('2026-09-01T12:00:00Z'),
          providerUpdatedAt: new Date('2026-09-02T12:00:00Z'),
          remoteReply: {
            content: 'Synthetic remote reply',
            updatedAt: new Date('2026-09-02T13:00:00Z'),
            status: 'FUTURE_UNKNOWN_STATE',
          },
        },
      ],
      totalReviewCount: 70,
      nextPageToken: 'provider-page-2',
    });
    expect(JSON.stringify(result)).not.toMatch(
      /profilePhotoUrl|photos|policyViolation|averageRating/,
    );
  });

  it('allows completed-empty and anonymous/minimal reviews without inventing content', async () => {
    fetchMock.mockResolvedValueOnce(Response.json({}));
    expect(await listGoogleBusinessReviews('token', binding)).toEqual({
      reviews: [],
      totalReviewCount: null,
      nextPageToken: null,
    });
    const {
      reviewer: _reviewer,
      comment: _comment,
      reviewReply: _reply,
      ...minimal
    } = review();
    fetchMock.mockResolvedValueOnce(Response.json(minimal));
    expect(await getGoogleBusinessReview('token', binding, name)).toMatchObject(
      {
        authorName: null,
        content: null,
        remoteReply: null,
      },
    );
  });

  it('retrieves only the exact authorized detail reference', async () => {
    fetchMock.mockResolvedValue(Response.json(review()));
    expect(
      (await getGoogleBusinessReview('token', binding, name)).reviewName,
    ).toBe(name);
    expect(String(fetchMock.mock.calls[0]![0])).toBe(
      `https://mybusiness.googleapis.com/v4/${name}`,
    );
    expect(fetchMock.mock.calls[0]![1]?.cache).toBe('no-store');
  });

  it.each([
    {
      ...review(),
      name: 'accounts/foreign/locations/location-1/reviews/review-1',
    },
    { ...review(), reviewId: 'another-review' },
    { ...review(), reviewId: '../other' },
    { ...review(), starRating: 'SIX' },
    { ...review(), createTime: '2026-02-30T12:00:00Z' },
    { ...review(), updateTime: 'not-a-date' },
    { ...review(), reviewer: { displayName: 'x'.repeat(256) } },
    { ...review(), comment: 'x'.repeat(65_537) },
    { ...review(), reviewReply: { comment: 'reply', updateTime: 'invalid' } },
    {
      ...review(),
      reviewReply: {
        comment: 'reply',
        updateTime: '2026-09-01T12:00:00Z',
        reviewReplyState: 'x'.repeat(101),
      },
    },
  ])(
    'rejects every malformed/foreign review before a partial page can escape',
    async (invalid) => {
      fetchMock.mockResolvedValue(
        Response.json({ reviews: [review(), invalid] }),
      );
      await expect(
        listGoogleBusinessReviews('token', binding),
      ).rejects.toMatchObject({ category: 'INVALID_RESPONSE' });
    },
  );

  it.each([
    { reviews: Array.from({ length: 51 }, () => review()) },
    { reviews: [review()], totalReviewCount: -1 },
    { reviews: [review()], totalReviewCount: 1.5 },
    { reviews: [review()], nextPageToken: '' },
    { reviews: [review()], nextPageToken: 'x'.repeat(8193) },
  ])('rejects malformed or unbounded pages', async (payload) => {
    fetchMock.mockResolvedValue(Response.json(payload));
    await expect(
      listGoogleBusinessReviews('token', binding),
    ).rejects.toMatchObject({ category: 'INVALID_RESPONSE' });
  });

  it('deduplicates identical identities but rejects inconsistent duplicate content', async () => {
    fetchMock.mockResolvedValueOnce(
      Response.json({ reviews: [review(), review()] }),
    );
    expect(
      (await listGoogleBusinessReviews('token', binding)).reviews,
    ).toHaveLength(1);
    fetchMock.mockResolvedValueOnce(
      Response.json({
        reviews: [review(), { ...review(), comment: 'different' }],
      }),
    );
    await expect(
      listGoogleBusinessReviews('token', binding),
    ).rejects.toMatchObject({ category: 'INVALID_RESPONSE' });
  });

  it.each([
    'accounts/..',
    'accounts/account/extra',
    'accounts/account?query',
    'accounts/account\\path',
  ])(
    'denies invalid binding %s without network access',
    async (externalAccountId) => {
      await expect(
        listGoogleBusinessReviews('token', { ...binding, externalAccountId }),
      ).rejects.toMatchObject({ category: 'INVALID_RESPONSE' });
      expect(fetchMock).not.toHaveBeenCalled();
    },
  );

  it.each([
    'accounts/foreign/locations/location-1/reviews/review-1',
    `${name}/extra`,
    'accounts/account-1/locations/location-1/reviews/..',
  ])(
    'denies a forged detail reference %s before network access',
    async (reference) => {
      await expect(
        getGoogleBusinessReview('token', binding, reference),
      ).rejects.toMatchObject({ category: 'INVALID_RESPONSE' });
      expect(fetchMock).not.toHaveBeenCalled();
    },
  );

  it('rejects a detail response for another review in the same location', async () => {
    fetchMock.mockResolvedValue(
      Response.json({
        ...review(),
        name: name.replace('review-1', 'review-2'),
        reviewId: 'review-2',
      }),
    );
    await expect(
      getGoogleBusinessReview('token', binding, name),
    ).rejects.toMatchObject({ category: 'INVALID_RESPONSE' });
  });

  it('sanitizes non-JSON and HTTP failures without retaining the provider body', async () => {
    fetchMock.mockResolvedValueOnce(
      new Response('secret-bearing malformed response', { status: 200 }),
    );
    await expect(
      listGoogleBusinessReviews('token', binding),
    ).rejects.toMatchObject({
      category: 'INVALID_RESPONSE',
      message: 'Google Business Profile returned an invalid response.',
    });
    fetchMock.mockResolvedValueOnce(
      new Response('provider-body-with-secret', { status: 404 }),
    );
    await expect(
      getGoogleBusinessReview('token', binding, name),
    ).rejects.toMatchObject({
      status: 404,
      message: 'Google Business Profile request failed.',
    });
  });

  it('classifies errors without raw response text or request tokens', () => {
    const error = new GoogleBusinessProfileApiError(
      'Google request failed.',
      503,
    );
    expect(error.category).toBe('PROVIDER_UNAVAILABLE');
    expect(error.message).not.toContain('synthetic-token');
  });
});
