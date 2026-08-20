import {
  localEstablishmentProfileSchema,
  updateLocalEstablishmentProfileInputSchema,
  type UpdateLocalEstablishmentProfileInput,
} from '@yuta/contracts/local-pos';
import type { PosDatabaseExecutor } from '@yuta/db-pos/client';
import { posEstablishmentProfiles } from '@yuta/db-pos/schema';
import { and, eq, sql } from 'drizzle-orm';
import { HttpError } from '../http';

const profileId = 'default';

export function createEstablishmentProfileService(db: PosDatabaseExecutor) {
  async function getEstablishmentProfile() {
    return toLocalEstablishmentProfile(await readEstablishmentProfile(db));
  }

  async function updateEstablishmentProfile(
    input: UpdateLocalEstablishmentProfileInput,
  ) {
    const values = updateLocalEstablishmentProfileInputSchema.parse(input);
    const updatedAt = new Date();

    if (values.revision === 0) {
      const [created] = await db
        .insert(posEstablishmentProfiles)
        .values({
          id: profileId,
          displayName: values.displayName,
          revision: 1,
          updatedAt,
        })
        .onConflictDoNothing({ target: posEstablishmentProfiles.id })
        .returning();
      if (!created) throw conflictError();
      return toLocalEstablishmentProfile(created);
    }

    const [updated] = await db
      .update(posEstablishmentProfiles)
      .set({
        displayName: values.displayName,
        revision: sql`${posEstablishmentProfiles.revision} + 1`,
        updatedAt,
      })
      .where(
        and(
          eq(posEstablishmentProfiles.id, profileId),
          eq(posEstablishmentProfiles.revision, values.revision),
        ),
      )
      .returning();
    if (!updated) throw conflictError();
    return toLocalEstablishmentProfile(updated);
  }

  return { getEstablishmentProfile, updateEstablishmentProfile };
}

export async function readEstablishmentProfile(db: PosDatabaseExecutor) {
  return (
    (await db.query.posEstablishmentProfiles.findFirst({
      where: eq(posEstablishmentProfiles.id, profileId),
    })) ?? null
  );
}

function toLocalEstablishmentProfile(
  profile: typeof posEstablishmentProfiles.$inferSelect | null,
) {
  return localEstablishmentProfileSchema.parse(
    profile
      ? {
          displayName: profile.displayName,
          revision: profile.revision,
          updatedAt: profile.updatedAt.toISOString(),
        }
      : { displayName: null, revision: 0, updatedAt: null },
  );
}

function conflictError() {
  return new HttpError(
    409,
    'ESTABLISHMENT_PROFILE_CONFLICT',
    'The establishment profile changed. Reload it before saving again.',
  );
}
