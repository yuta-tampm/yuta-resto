import 'server-only';
import { createHash } from 'node:crypto';
import { z } from 'zod';
import { googleReplyTextSchema } from '@yuta/contracts/reputation';
import type {
  GoogleReviewBinding,
  GoogleReplyPublicationResult,
  GoogleReviewImportRecord,
} from '@yuta/db-cloud';
import {
  createGoogleReviewResourceUrl,
  GoogleBusinessProfileApiError,
} from './google-business-profile-client';

const replySchema = z.object({
  comment: googleReplyTextSchema,
  updateTime: z.string().datetime({ offset: true }),
  reviewReplyState: z.string().max(100).optional(),
});
export async function putGoogleReviewReply(
  token: string,
  binding: GoogleReviewBinding,
  reviewName: string,
  text: string,
): Promise<void> {
  googleReplyTextSchema.parse(text);
  const url = createGoogleReviewResourceUrl(binding, reviewName);
  url.pathname += '/reply';
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ comment: text }),
    cache: 'no-store',
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok)
    throw new GoogleBusinessProfileApiError(
      'Google reply request failed.',
      response.status,
    );
  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new GoogleBusinessProfileApiError(
      'Google reply response is invalid.',
      502,
      'INVALID_RESPONSE',
    );
  }
  const parsed = replySchema.safeParse(payload);
  if (!parsed.success || parsed.data.comment !== text)
    throw new GoogleBusinessProfileApiError(
      'Google reply response is invalid.',
      502,
      'INVALID_RESPONSE',
    );
}
export function googleRemoteReplyFingerprint(
  review: GoogleReviewImportRecord,
): string {
  const reply = review.remoteReply;
  return createHash('sha256')
    .update(
      JSON.stringify(
        reply
          ? [reply.content, reply.updatedAt.toISOString(), reply.status]
          : null,
      ),
    )
    .digest('hex');
}
export function observedGoogleReplyResult(
  review: GoogleReviewImportRecord,
  text: string,
): GoogleReplyPublicationResult | null {
  if (review.remoteReply?.content !== text) return null;
  const state = review.remoteReply.status;
  return {
    state:
      state === 'APPROVED' || state === 'PENDING' || state === 'REJECTED'
        ? state
        : 'UNCONFIRMED',
    errorCategory: null,
  };
}
