import { authenticateGoogleCacheMaintenance } from '@/server/reputation/google-review-retrieval-config';

export const dynamic = 'force-dynamic';

const headers = { 'Cache-Control': 'private, no-store, max-age=0' };

export async function POST(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return Response.json(
      { code: 'GOOGLE_CACHE_MAINTENANCE_UNAVAILABLE' },
      { status: 405, headers: { ...headers, Allow: 'POST' } },
    );
  }
  const admission = authenticateGoogleCacheMaintenance(request);
  if (admission !== 'authorized') {
    return Response.json(
      { code: 'GOOGLE_CACHE_MAINTENANCE_UNAVAILABLE' },
      { status: admission === 'unavailable' ? 503 : 403, headers },
    );
  }
  try {
    const { maintainGoogleReviewCache } =
      await import('@/server/reputation/google-review-lifecycle');
    return Response.json(await maintainGoogleReviewCache(), { headers });
  } catch {
    return Response.json(
      { code: 'GOOGLE_CACHE_MAINTENANCE_UNAVAILABLE' },
      { status: 503, headers },
    );
  }
}
