import { config } from 'dotenv';
import { eq } from 'drizzle-orm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  createPosDatabaseClient,
  type PosDatabaseClient,
} from '@yuta/db-pos/client';
import { posEstablishmentProfiles } from '@yuta/db-pos/schema';
import { createEstablishmentProfileService } from '../src/services/establishment-profile-service';

config({ path: '.env.test' });
config({ path: '.env.local' });

const integrationTest =
  process.env.POS_DATABASE_URL &&
  process.env.YUTA_ALLOW_DATABASE_INTEGRATION_TESTS === 'true'
    ? describe
    : describe.skip;

integrationTest('local establishment profile integration', () => {
  let db: PosDatabaseClient;

  beforeAll(async () => {
    db = createPosDatabaseClient(process.env);
    await db
      .delete(posEstablishmentProfiles)
      .where(eq(posEstablishmentProfiles.id, 'default'));
  });

  afterAll(async () => {
    if (!db) return;
    await db
      .delete(posEstablishmentProfiles)
      .where(eq(posEstablishmentProfiles.id, 'default'));
    await db.$client.end({ timeout: 5 });
  });

  it('creates and updates the singleton with optimistic revision checks', async () => {
    const service = createEstablishmentProfileService(db);

    await expect(service.getEstablishmentProfile()).resolves.toEqual({
      displayName: null,
      revision: 0,
      updatedAt: null,
    });

    const created = await service.updateEstablishmentProfile({
      displayName: '  Le Jardin Démo  ',
      revision: 0,
    });
    expect(created).toMatchObject({
      displayName: 'Le Jardin Démo',
      revision: 1,
    });

    await expect(
      service.updateEstablishmentProfile({
        displayName: 'Stale value',
        revision: 0,
      }),
    ).rejects.toMatchObject({
      status: 409,
      code: 'ESTABLISHMENT_PROFILE_CONFLICT',
    });

    const updated = await service.updateEstablishmentProfile({
      displayName: 'Le Nouveau Jardin',
      revision: 1,
    });
    expect(updated).toMatchObject({
      displayName: 'Le Nouveau Jardin',
      revision: 2,
    });
  });
});
