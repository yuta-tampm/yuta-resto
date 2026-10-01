import 'server-only';

import { z } from 'zod';
import type {
  GoogleReviewBinding,
  GoogleReviewImportRecord,
} from '@yuta/db-cloud';
import type { GoogleConnectorConfiguration } from './google-connector-config';

export const GOOGLE_BUSINESS_PROFILE_SCOPE =
  'https://www.googleapis.com/auth/business.manage';

const tokenResponseSchema = z.object({
  access_token: z.string().min(1),
  expires_in: z.number().int().positive(),
  refresh_token: z.string().min(1).optional(),
  scope: z.string().optional(),
  token_type: z.string().optional(),
});

const accountSchema = z.object({
  name: z.string().regex(/^accounts\/[^/]+$/),
  accountName: z.string().optional(),
  type: z.string().optional(),
  role: z.string().optional(),
});
const accountsResponseSchema = z.object({
  accounts: z.array(accountSchema).optional().default([]),
  nextPageToken: z.string().optional(),
});

const locationSchema = z.object({
  name: z.string().regex(/^locations\/[^/]+$/),
  title: z.string().min(1),
  storeCode: z.string().optional(),
  storefrontAddress: z
    .object({
      addressLines: z.array(z.string()).optional(),
      locality: z.string().optional(),
      postalCode: z.string().optional(),
    })
    .optional(),
  metadata: z
    .object({
      mapsUri: z.string().url().optional(),
      placeId: z.string().optional(),
    })
    .optional(),
});
const locationsResponseSchema = z.object({
  locations: z.array(locationSchema).optional().default([]),
  nextPageToken: z.string().optional(),
});

export type GoogleBusinessAccount = z.infer<typeof accountSchema>;
export type GoogleBusinessLocation = z.infer<typeof locationSchema>;
export type GoogleOAuthTokens = {
  accessToken: string;
  refreshToken?: string;
  expiresAt: Date;
  scopes: string[];
};

export class GoogleBusinessProfileApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly category:
      | 'INVALID_RESPONSE'
      | 'PROVIDER_UNAVAILABLE' = 'PROVIDER_UNAVAILABLE',
  ) {
    super(message);
    this.name = 'GoogleBusinessProfileApiError';
  }
}

const providerIdentifierSchema = z
  .string()
  .min(1)
  .max(255)
  .regex(/^[^/\\?#\s\u0000-\u001f\u007f]+$/u)
  .refine((value) => value !== '.' && value !== '..');
const providerDateSchema = z
  .string()
  .datetime({ offset: true })
  .transform((value) => new Date(value))
  .refine((value) => Number.isFinite(value.getTime()));
const providerReviewSchema = z.object({
  name: z.string().min(1).max(1024),
  reviewId: providerIdentifierSchema,
  reviewer: z
    .object({ displayName: z.string().max(255).optional() })
    .optional(),
  starRating: z.enum(['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE']),
  comment: z.string().max(65_536).optional(),
  createTime: providerDateSchema,
  updateTime: providerDateSchema,
  reviewReply: z
    .object({
      comment: z.string().max(4096),
      updateTime: providerDateSchema,
      reviewReplyState: z.string().min(1).max(100).optional(),
    })
    .optional(),
});
const providerReviewPageSchema = z.object({
  reviews: z.array(providerReviewSchema).max(50).optional().default([]),
  totalReviewCount: z.number().int().nonnegative().optional(),
  nextPageToken: z.string().min(1).max(8192).optional(),
});

export type GoogleBusinessReviewPage = {
  reviews: GoogleReviewImportRecord[];
  totalReviewCount: number | null;
  nextPageToken: string | null;
};

function reviewParent(binding: GoogleReviewBinding): string {
  const account = /^accounts\/([^/]+)$/u.exec(binding.externalAccountId)?.[1];
  const location = /^locations\/([^/]+)$/u.exec(
    binding.externalLocationId,
  )?.[1];
  if (
    !providerIdentifierSchema.safeParse(account).success ||
    !providerIdentifierSchema.safeParse(location).success
  ) {
    throw new GoogleBusinessProfileApiError(
      'Google review resource is invalid.',
      502,
      'INVALID_RESPONSE',
    );
  }
  return `${binding.externalAccountId}/${binding.externalLocationId}`;
}

function projectProviderReview(
  review: z.infer<typeof providerReviewSchema>,
  parent: string,
): GoogleReviewImportRecord {
  if (review.name !== `${parent}/reviews/${review.reviewId}`) {
    throw new GoogleBusinessProfileApiError(
      'Google review resource is invalid.',
      502,
      'INVALID_RESPONSE',
    );
  }
  const ratings = { ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 } as const;
  return {
    reviewName: review.name,
    reviewId: review.reviewId,
    authorName: review.reviewer?.displayName ?? null,
    rating: ratings[review.starRating],
    content: review.comment ?? null,
    providerCreatedAt: review.createTime,
    providerUpdatedAt: review.updateTime,
    remoteReply: review.reviewReply
      ? {
          content: review.reviewReply.comment,
          updatedAt: review.reviewReply.updateTime,
          status: review.reviewReply.reviewReplyState ?? null,
        }
      : null,
  };
}

export async function listGoogleBusinessReviews(
  accessToken: string,
  binding: GoogleReviewBinding,
  pageToken?: string | null,
): Promise<GoogleBusinessReviewPage> {
  const parent = reviewParent(binding);
  if (
    pageToken !== undefined &&
    pageToken !== null &&
    !z.string().min(1).max(8192).safeParse(pageToken).success
  ) {
    throw new GoogleBusinessProfileApiError(
      'Google review continuation is invalid.',
      502,
      'INVALID_RESPONSE',
    );
  }
  const url = new URL(
    `https://mybusiness.googleapis.com/v4/${parent.split('/').map(encodeURIComponent).join('/')}/reviews`,
  );
  url.searchParams.set('pageSize', '50');
  url.searchParams.set('orderBy', 'updateTime desc');
  if (pageToken) url.searchParams.set('pageToken', pageToken);
  const page = await googleApiRequest(
    url,
    accessToken,
    providerReviewPageSchema,
  );
  const unique = new Map<string, GoogleReviewImportRecord>();
  for (const raw of page.reviews) {
    const review = projectProviderReview(raw, parent);
    const prior = unique.get(review.reviewName);
    if (prior && JSON.stringify(prior) !== JSON.stringify(review)) {
      throw new GoogleBusinessProfileApiError(
        'Google reviews are inconsistent.',
        502,
        'INVALID_RESPONSE',
      );
    }
    unique.set(review.reviewName, review);
  }
  return {
    reviews: [...unique.values()],
    totalReviewCount: page.totalReviewCount ?? null,
    nextPageToken: page.nextPageToken ?? null,
  };
}

export async function getGoogleBusinessReview(
  accessToken: string,
  binding: GoogleReviewBinding,
  reviewName: string,
): Promise<GoogleReviewImportRecord> {
  const parent = reviewParent(binding);
  const reviewId = reviewName.startsWith(`${parent}/reviews/`)
    ? reviewName.slice(`${parent}/reviews/`.length)
    : '';
  if (
    reviewName.length > 1024 ||
    !providerIdentifierSchema.safeParse(reviewId).success
  ) {
    throw new GoogleBusinessProfileApiError(
      'Google review resource is invalid.',
      502,
      'INVALID_RESPONSE',
    );
  }
  const url = new URL(
    `https://mybusiness.googleapis.com/v4/${reviewName.split('/').map(encodeURIComponent).join('/')}`,
  );
  const review = projectProviderReview(
    await googleApiRequest(url, accessToken, providerReviewSchema),
    parent,
  );
  if (review.reviewName !== reviewName) {
    throw new GoogleBusinessProfileApiError(
      'Google review resource is invalid.',
      502,
      'INVALID_RESPONSE',
    );
  }
  return review;
}

export function createGoogleAuthorizationUrl(
  configuration: GoogleConnectorConfiguration,
  state: string,
): URL {
  const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  url.searchParams.set('client_id', configuration.clientId);
  url.searchParams.set('redirect_uri', configuration.redirectUri);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('scope', GOOGLE_BUSINESS_PROFILE_SCOPE);
  url.searchParams.set('access_type', 'offline');
  url.searchParams.set('prompt', 'consent');
  url.searchParams.set('include_granted_scopes', 'true');
  url.searchParams.set('state', state);
  return url;
}

export async function exchangeGoogleAuthorizationCode(
  configuration: GoogleConnectorConfiguration,
  code: string,
): Promise<GoogleOAuthTokens> {
  return requestTokens({
    client_id: configuration.clientId,
    client_secret: configuration.clientSecret,
    code,
    grant_type: 'authorization_code',
    redirect_uri: configuration.redirectUri,
  });
}

export async function refreshGoogleAccessToken(
  configuration: GoogleConnectorConfiguration,
  refreshToken: string,
): Promise<GoogleOAuthTokens> {
  return requestTokens({
    client_id: configuration.clientId,
    client_secret: configuration.clientSecret,
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
  });
}

export async function listGoogleBusinessAccounts(
  accessToken: string,
): Promise<GoogleBusinessAccount[]> {
  const accounts: GoogleBusinessAccount[] = [];
  let pageToken: string | undefined;
  do {
    const url = new URL(
      'https://mybusinessaccountmanagement.googleapis.com/v1/accounts',
    );
    url.searchParams.set('pageSize', '20');
    if (pageToken) url.searchParams.set('pageToken', pageToken);
    const payload = await googleApiRequest(
      url,
      accessToken,
      accountsResponseSchema,
    );
    accounts.push(...(payload.accounts ?? []));
    pageToken = payload.nextPageToken;
  } while (pageToken);
  return accounts;
}

export async function listGoogleBusinessLocations(
  accessToken: string,
  accountName: string,
): Promise<GoogleBusinessLocation[]> {
  const accountId = parseResourceId(accountName, 'accounts');
  const locations: GoogleBusinessLocation[] = [];
  let pageToken: string | undefined;
  do {
    const url = new URL(
      `https://mybusinessbusinessinformation.googleapis.com/v1/accounts/${encodeURIComponent(accountId)}/locations`,
    );
    url.searchParams.set(
      'readMask',
      'name,title,storeCode,storefrontAddress,metadata',
    );
    url.searchParams.set('pageSize', '100');
    url.searchParams.set('orderBy', 'title');
    if (pageToken) url.searchParams.set('pageToken', pageToken);
    const payload = await googleApiRequest(
      url,
      accessToken,
      locationsResponseSchema,
    );
    locations.push(...(payload.locations ?? []));
    pageToken = payload.nextPageToken;
  } while (pageToken);
  return locations;
}

function parseResourceId(value: string, resource: 'accounts'): string {
  const match = new RegExp(`^${resource}/([^/]+)$`).exec(value);
  if (!match?.[1]) throw new Error(`Invalid Google ${resource} resource.`);
  return match[1];
}

async function requestTokens(
  body: Record<string, string>,
): Promise<GoogleOAuthTokens> {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(body),
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new GoogleBusinessProfileApiError(
      'Google OAuth token request failed.',
      response.status,
    );
  }
  const parsed = tokenResponseSchema.safeParse(await response.json());
  if (!parsed.success) {
    throw new GoogleBusinessProfileApiError(
      'Google OAuth returned an invalid token response.',
      502,
    );
  }
  return {
    accessToken: parsed.data.access_token,
    refreshToken: parsed.data.refresh_token,
    expiresAt: new Date(Date.now() + parsed.data.expires_in * 1_000),
    scopes: parsed.data.scope?.split(' ').filter(Boolean) ?? [
      GOOGLE_BUSINESS_PROFILE_SCOPE,
    ],
  };
}

async function googleApiRequest<T>(
  url: URL,
  accessToken: string,
  schema: z.ZodType<T, z.ZodTypeDef, unknown>,
): Promise<T> {
  const response = await fetch(url, {
    headers: { authorization: `Bearer ${accessToken}` },
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new GoogleBusinessProfileApiError(
      'Google Business Profile request failed.',
      response.status,
    );
  }
  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new GoogleBusinessProfileApiError(
      'Google Business Profile returned an invalid response.',
      502,
      'INVALID_RESPONSE',
    );
  }
  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    throw new GoogleBusinessProfileApiError(
      'Google Business Profile returned an invalid response.',
      502,
      'INVALID_RESPONSE',
    );
  }
  return parsed.data;
}
