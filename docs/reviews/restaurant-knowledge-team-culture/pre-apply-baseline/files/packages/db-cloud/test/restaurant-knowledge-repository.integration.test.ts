import { config } from 'dotenv';
import { and, eq } from 'drizzle-orm';
import type { TenantContext } from '@yuta/tenant';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { v7 as uuidv7 } from 'uuid';
import {
  getRestaurantKnowledgeConceptHistory,
  getRestaurantKnowledgeCuisineKnowHow,
  getRestaurantKnowledgeCustomerExperience,
  saveRestaurantKnowledgeConceptHistory,
  saveRestaurantKnowledgeCuisineKnowHow,
  saveRestaurantKnowledgeCustomerExperience,
} from '../src/restaurant-knowledge-repository';
import {
  createCloudDatabaseClient,
  type CloudDatabaseClient,
} from '../src/client';
import {
  establishments,
  organizations,
  restaurantKnowledgeConceptHistory,
  restaurantKnowledgeCuisineKnowHow,
  restaurantKnowledgeCustomerExperience,
} from '../src/schema';

config({ path: '.env.test' });
config({ path: '.env.local' });

const integrationTest =
  process.env.CLOUD_DATABASE_URL &&
  process.env.YUTA_ALLOW_DATABASE_INTEGRATION_TESTS === 'true'
    ? describe
    : describe.skip;

integrationTest('Restaurant Knowledge repository tenant isolation', () => {
  let db: CloudDatabaseClient;
  const organizationAId = uuidv7();
  const organizationBId = uuidv7();
  const establishmentA1Id = uuidv7();
  const establishmentA2Id = uuidv7();
  const establishmentBId = uuidv7();

  const context = (
    organizationId: string,
    establishmentId: string,
  ): TenantContext => ({
    organizationId,
    establishmentId,
    actor: {
      type: 'user',
      userId: uuidv7(),
      membershipId: uuidv7(),
      role: 'OWNER',
    },
    locale: 'fr-FR',
    timezone: 'Europe/Paris',
    entitlements: new Set(),
  });

  const contextA1 = context(organizationAId, establishmentA1Id);
  const contextA2 = context(organizationAId, establishmentA2Id);
  const contextB = context(organizationBId, establishmentBId);

  beforeAll(async () => {
    db = createCloudDatabaseClient(process.env);
    await db.insert(organizations).values([
      {
        id: organizationAId,
        name: 'Restaurant Knowledge organization A',
        slug: `restaurant-knowledge-a-${organizationAId}`,
      },
      {
        id: organizationBId,
        name: 'Restaurant Knowledge organization B',
        slug: `restaurant-knowledge-b-${organizationBId}`,
      },
    ]);
    await db.insert(establishments).values([
      {
        id: establishmentA1Id,
        organizationId: organizationAId,
        name: 'Restaurant Knowledge A1',
        slug: `restaurant-knowledge-a1-${establishmentA1Id}`,
      },
      {
        id: establishmentA2Id,
        organizationId: organizationAId,
        name: 'Restaurant Knowledge A2',
        slug: `restaurant-knowledge-a2-${establishmentA2Id}`,
      },
      {
        id: establishmentBId,
        organizationId: organizationBId,
        name: 'Restaurant Knowledge B',
        slug: `restaurant-knowledge-b-${establishmentBId}`,
      },
    ]);
  });

  afterAll(async () => {
    if (!db) return;
    for (const [organizationId, establishmentId] of [
      [organizationAId, establishmentA1Id],
      [organizationAId, establishmentA2Id],
      [organizationBId, establishmentBId],
    ] as const) {
      await db
        .delete(restaurantKnowledgeCustomerExperience)
        .where(
          and(
            eq(
              restaurantKnowledgeCustomerExperience.organizationId,
              organizationId,
            ),
            eq(
              restaurantKnowledgeCustomerExperience.establishmentId,
              establishmentId,
            ),
          ),
        );
      await db
        .delete(restaurantKnowledgeCuisineKnowHow)
        .where(
          and(
            eq(
              restaurantKnowledgeCuisineKnowHow.organizationId,
              organizationId,
            ),
            eq(
              restaurantKnowledgeCuisineKnowHow.establishmentId,
              establishmentId,
            ),
          ),
        );
    }
    await db
      .delete(restaurantKnowledgeConceptHistory)
      .where(
        and(
          eq(restaurantKnowledgeConceptHistory.organizationId, organizationAId),
          eq(
            restaurantKnowledgeConceptHistory.establishmentId,
            establishmentA1Id,
          ),
        ),
      );
    await db
      .delete(restaurantKnowledgeConceptHistory)
      .where(
        and(
          eq(restaurantKnowledgeConceptHistory.organizationId, organizationAId),
          eq(
            restaurantKnowledgeConceptHistory.establishmentId,
            establishmentA2Id,
          ),
        ),
      );
    await db
      .delete(restaurantKnowledgeConceptHistory)
      .where(
        and(
          eq(restaurantKnowledgeConceptHistory.organizationId, organizationBId),
          eq(
            restaurantKnowledgeConceptHistory.establishmentId,
            establishmentBId,
          ),
        ),
      );
    await db
      .delete(establishments)
      .where(eq(establishments.organizationId, organizationAId));
    await db
      .delete(establishments)
      .where(eq(establishments.organizationId, organizationBId));
    await db.delete(organizations).where(eq(organizations.id, organizationAId));
    await db.delete(organizations).where(eq(organizations.id, organizationBId));
    await db.$client.end({ timeout: 5 });
  });

  it('supports all-empty and every single Cuisine and savoir-faire value state', async () => {
    await expect(
      getRestaurantKnowledgeCuisineKnowHow(db, contextA1),
    ).resolves.toEqual({
      cuisineDescription: null,
      knowHowParticularities: null,
      homemade: null,
    });

    const singleValueStates = [
      {
        cuisineDescription: 'Cuisine végétale et de saison.',
        knowHowParticularities: null,
        homemade: null,
      },
      {
        cuisineDescription: null,
        knowHowParticularities: 'Fermentation réalisée sur place.',
        homemade: null,
      },
      {
        cuisineDescription: null,
        knowHowParticularities: null,
        homemade: 'Les sauces et desserts sont faits maison.',
      },
    ];

    for (const state of singleValueStates) {
      await expect(
        saveRestaurantKnowledgeCuisineKnowHow(db, contextA1, state),
      ).resolves.toEqual(state);
      await expect(
        getRestaurantKnowledgeCuisineKnowHow(db, contextA1),
      ).resolves.toEqual(state);
    }

    await expect(
      saveRestaurantKnowledgeCuisineKnowHow(db, contextA1, {
        cuisineDescription: null,
        knowHowParticularities: null,
        homemade: null,
      }),
    ).resolves.toEqual({
      cuisineDescription: null,
      knowHowParticularities: null,
      homemade: null,
    });
  });

  it('supports missing, all-empty and every single Customer Experience value state', async () => {
    await expect(
      getRestaurantKnowledgeCustomerExperience(db, contextA1),
    ).resolves.toEqual({
      desiredExperience: null,
      welcomeAndService: null,
      customerAttention: null,
    });

    const singleValueStates = [
      {
        desiredExperience: 'Une expérience chaleureuse et mémorable.',
        welcomeAndService: null,
        customerAttention: null,
      },
      {
        desiredExperience: null,
        welcomeAndService: 'Un accueil attentif et un service naturel.',
        customerAttention: null,
      },
      {
        desiredExperience: null,
        welcomeAndService: null,
        customerAttention: 'Anticiper les besoins sans être intrusif.',
      },
    ];

    for (const state of singleValueStates) {
      await expect(
        saveRestaurantKnowledgeCustomerExperience(db, contextA1, state),
      ).resolves.toEqual(state);
      await expect(
        getRestaurantKnowledgeCustomerExperience(db, contextA1),
      ).resolves.toEqual(state);
    }

    const allEmpty = {
      desiredExperience: null,
      welcomeAndService: null,
      customerAttention: null,
    };
    await expect(
      saveRestaurantKnowledgeCustomerExperience(db, contextA1, allEmpty),
    ).resolves.toEqual(allEmpty);
  });

  it('round-trips and overwrites the whole Customer Experience slice with tenant isolation', async () => {
    const stateA1 = {
      desiredExperience: 'Expérience A1',
      welcomeAndService: 'Service A1',
      customerAttention: 'Attention A1',
    };
    const stateA2 = {
      desiredExperience: null,
      welcomeAndService: 'Service A2',
      customerAttention: null,
    };
    const stateB = {
      desiredExperience: 'Expérience B',
      welcomeAndService: null,
      customerAttention: 'Attention B',
    };

    await saveRestaurantKnowledgeCustomerExperience(db, contextA1, stateA1);
    await saveRestaurantKnowledgeCustomerExperience(db, contextA2, stateA2);
    await saveRestaurantKnowledgeCustomerExperience(db, contextB, stateB);

    await expect(
      getRestaurantKnowledgeCustomerExperience(db, contextA1),
    ).resolves.toEqual(stateA1);
    await expect(
      getRestaurantKnowledgeCustomerExperience(db, contextA2),
    ).resolves.toEqual(stateA2);
    await expect(
      getRestaurantKnowledgeCustomerExperience(db, contextB),
    ).resolves.toEqual(stateB);

    const overwrittenA1 = {
      desiredExperience: null,
      welcomeAndService: 'Service A1 remplacé',
      customerAttention: null,
    };
    await expect(
      saveRestaurantKnowledgeCustomerExperience(db, contextA1, overwrittenA1),
    ).resolves.toEqual(overwrittenA1);
    await expect(
      getRestaurantKnowledgeCustomerExperience(db, contextA1),
    ).resolves.toEqual(overwrittenA1);

    const mismatchedContext = context(organizationBId, establishmentA1Id);
    await expect(
      getRestaurantKnowledgeCustomerExperience(db, mismatchedContext),
    ).resolves.toEqual({
      desiredExperience: null,
      welcomeAndService: null,
      customerAttention: null,
    });
    await expect(
      saveRestaurantKnowledgeCustomerExperience(db, mismatchedContext, {
        desiredExperience: 'Cross-tenant write',
        welcomeAndService: null,
        customerAttention: null,
      }),
    ).rejects.toThrow();
    await expect(
      getRestaurantKnowledgeCustomerExperience(db, contextA1),
    ).resolves.toEqual(overwrittenA1);
  });

  it('keeps Cuisine and savoir-faire whole-slice reads and writes tenant isolated', async () => {
    const stateA1 = {
      cuisineDescription: 'Cuisine A1',
      knowHowParticularities: null,
      homemade: 'Maison A1',
    };
    const stateA2 = {
      cuisineDescription: null,
      knowHowParticularities: 'Savoir-faire A2',
      homemade: null,
    };
    const stateB = {
      cuisineDescription: 'Cuisine B',
      knowHowParticularities: 'Savoir-faire B',
      homemade: 'Maison B',
    };

    await saveRestaurantKnowledgeCuisineKnowHow(db, contextA1, stateA1);
    await saveRestaurantKnowledgeCuisineKnowHow(db, contextA2, stateA2);
    await saveRestaurantKnowledgeCuisineKnowHow(db, contextB, stateB);

    await expect(
      getRestaurantKnowledgeCuisineKnowHow(db, contextA1),
    ).resolves.toEqual(stateA1);
    await expect(
      getRestaurantKnowledgeCuisineKnowHow(db, contextA2),
    ).resolves.toEqual(stateA2);
    await expect(
      getRestaurantKnowledgeCuisineKnowHow(db, contextB),
    ).resolves.toEqual(stateB);

    const mismatchedContext = context(organizationBId, establishmentA1Id);
    await expect(
      getRestaurantKnowledgeCuisineKnowHow(db, mismatchedContext),
    ).resolves.toEqual({
      cuisineDescription: null,
      knowHowParticularities: null,
      homemade: null,
    });
    await expect(
      saveRestaurantKnowledgeCuisineKnowHow(db, mismatchedContext, {
        cuisineDescription: 'Cross-tenant write',
        knowHowParticularities: null,
        homemade: null,
      }),
    ).rejects.toThrow();
    await expect(
      getRestaurantKnowledgeCuisineKnowHow(db, contextA1),
    ).resolves.toEqual(stateA1);
  });

  it('treats a missing row as a valid empty state', async () => {
    await expect(
      getRestaurantKnowledgeConceptHistory(db, contextA1),
    ).resolves.toEqual({ concept: null, history: null });
  });

  it('persists Concept-only, Histoire-only and both-empty states independently', async () => {
    await expect(
      saveRestaurantKnowledgeConceptHistory(db, contextA1, {
        concept: 'Cuisine de saison.',
        history: null,
      }),
    ).resolves.toEqual({ concept: 'Cuisine de saison.', history: null });

    await expect(
      saveRestaurantKnowledgeConceptHistory(db, contextA1, {
        concept: null,
        history: 'Fondé en 1998.',
      }),
    ).resolves.toEqual({ concept: null, history: 'Fondé en 1998.' });

    await expect(
      saveRestaurantKnowledgeConceptHistory(db, contextA1, {
        concept: null,
        history: null,
      }),
    ).resolves.toEqual({ concept: null, history: null });
  });

  it('keeps whole-slice reads and writes isolated by organization and establishment', async () => {
    await saveRestaurantKnowledgeConceptHistory(db, contextA1, {
      concept: 'Concept A1',
      history: null,
    });
    await saveRestaurantKnowledgeConceptHistory(db, contextA2, {
      concept: null,
      history: 'Histoire A2',
    });
    await saveRestaurantKnowledgeConceptHistory(db, contextB, {
      concept: 'Concept B',
      history: 'Histoire B',
    });

    await expect(
      getRestaurantKnowledgeConceptHistory(db, contextA1),
    ).resolves.toEqual({ concept: 'Concept A1', history: null });
    await expect(
      getRestaurantKnowledgeConceptHistory(db, contextA2),
    ).resolves.toEqual({ concept: null, history: 'Histoire A2' });
    await expect(
      getRestaurantKnowledgeConceptHistory(db, contextB),
    ).resolves.toEqual({ concept: 'Concept B', history: 'Histoire B' });

    const mismatchedContext = context(organizationBId, establishmentA1Id);
    await expect(
      getRestaurantKnowledgeConceptHistory(db, mismatchedContext),
    ).resolves.toEqual({ concept: null, history: null });
    await expect(
      saveRestaurantKnowledgeConceptHistory(db, mismatchedContext, {
        concept: 'Cross-tenant write',
        history: null,
      }),
    ).rejects.toThrow();
    await expect(
      getRestaurantKnowledgeConceptHistory(db, contextA1),
    ).resolves.toEqual({ concept: 'Concept A1', history: null });
  });
});
