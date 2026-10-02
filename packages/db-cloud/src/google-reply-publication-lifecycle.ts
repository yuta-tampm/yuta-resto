import { and, eq, isNotNull, lte } from 'drizzle-orm';
import type { GoogleReviewDatabase } from './google-review-retrieval-repository';
import { googleReplyPublications } from './schema';

export async function listDueGoogleReplyPreviewScopes(
  db: GoogleReviewDatabase,
  input: { now: Date; limit: number },
) {
  return db
    .selectDistinct({
      organizationId: googleReplyPublications.organizationId,
      establishmentId: googleReplyPublications.establishmentId,
    })
    .from(googleReplyPublications)
    .where(
      and(
        lte(googleReplyPublications.previewExpiresAt, input.now),
        isNotNull(googleReplyPublications.remoteFingerprint),
      ),
    )
    .limit(Math.max(1, Math.min(100, Math.trunc(input.limit))));
}
export async function clearExpiredGoogleReplyPreviews(
  db: GoogleReviewDatabase,
  scope: { organizationId: string; establishmentId: string },
  input: { now: Date; limit: number },
) {
  const rows = await db
    .select({ id: googleReplyPublications.id })
    .from(googleReplyPublications)
    .where(
      and(
        eq(googleReplyPublications.organizationId, scope.organizationId),
        eq(googleReplyPublications.establishmentId, scope.establishmentId),
        lte(googleReplyPublications.previewExpiresAt, input.now),
        isNotNull(googleReplyPublications.remoteFingerprint),
      ),
    )
    .limit(Math.max(1, Math.min(1000, Math.trunc(input.limit))))
    .for('update', { skipLocked: true });
  for (const row of rows)
    await db
      .update(googleReplyPublications)
      .set({ remoteFingerprint: null })
      .where(
        and(
          eq(googleReplyPublications.organizationId, scope.organizationId),
          eq(googleReplyPublications.establishmentId, scope.establishmentId),
          eq(googleReplyPublications.id, row.id),
        ),
      );
  return rows.length;
}
