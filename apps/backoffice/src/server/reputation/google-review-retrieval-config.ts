import 'server-only';

import { timingSafeEqual } from 'node:crypto';

export function isGoogleReviewRetrievalEnabled(): boolean {
  return process.env.GOOGLE_REVIEW_RETRIEVAL_ENABLED === 'true';
}

export function authenticateGoogleCacheMaintenance(
  request: Request,
): 'authorized' | 'unavailable' | 'denied' {
  const secret = process.env.REPUTATION_CACHE_MAINTENANCE_SECRET;
  if (!secret || secret.length < 32 || /\s/u.test(secret)) return 'unavailable';
  const supplied = /^Bearer ([^\s]+)$/u.exec(
    request.headers.get('authorization') ?? '',
  )?.[1];
  if (!supplied) return 'denied';
  const expectedBytes = Buffer.from(secret);
  const suppliedBytes = Buffer.from(supplied);
  return expectedBytes.length === suppliedBytes.length &&
    timingSafeEqual(expectedBytes, suppliedBytes)
    ? 'authorized'
    : 'denied';
}
