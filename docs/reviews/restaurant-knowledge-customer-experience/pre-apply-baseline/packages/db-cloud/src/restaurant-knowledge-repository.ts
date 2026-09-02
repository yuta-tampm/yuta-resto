import { requireEstablishment, type TenantContext } from '@yuta/tenant';
import { and, eq } from 'drizzle-orm';
import type { CloudDatabaseClient } from './client';
import {
  restaurantKnowledgeConceptHistory,
  restaurantKnowledgeCuisineKnowHow,
} from './schema';

export type RestaurantKnowledgeConceptHistoryInput = {
  concept: string | null;
  history: string | null;
};

const emptyConceptHistory = (): RestaurantKnowledgeConceptHistoryInput => ({
  concept: null,
  history: null,
});

export async function getRestaurantKnowledgeConceptHistory(
  db: CloudDatabaseClient,
  context: TenantContext,
): Promise<RestaurantKnowledgeConceptHistoryInput> {
  requireEstablishment(context);
  const [row] = await db
    .select({
      concept: restaurantKnowledgeConceptHistory.concept,
      history: restaurantKnowledgeConceptHistory.history,
    })
    .from(restaurantKnowledgeConceptHistory)
    .where(
      and(
        eq(
          restaurantKnowledgeConceptHistory.organizationId,
          context.organizationId,
        ),
        eq(
          restaurantKnowledgeConceptHistory.establishmentId,
          context.establishmentId,
        ),
      ),
    )
    .limit(1);

  return row ?? emptyConceptHistory();
}

export async function saveRestaurantKnowledgeConceptHistory(
  db: CloudDatabaseClient,
  context: TenantContext,
  input: RestaurantKnowledgeConceptHistoryInput,
): Promise<RestaurantKnowledgeConceptHistoryInput> {
  requireEstablishment(context);
  const [row] = await db
    .insert(restaurantKnowledgeConceptHistory)
    .values({
      organizationId: context.organizationId,
      establishmentId: context.establishmentId,
      concept: input.concept,
      history: input.history,
    })
    .onConflictDoUpdate({
      target: [
        restaurantKnowledgeConceptHistory.organizationId,
        restaurantKnowledgeConceptHistory.establishmentId,
      ],
      set: {
        concept: input.concept,
        history: input.history,
      },
    })
    .returning({
      concept: restaurantKnowledgeConceptHistory.concept,
      history: restaurantKnowledgeConceptHistory.history,
    });

  return row ?? emptyConceptHistory();
}

export type RestaurantKnowledgeCuisineKnowHowInput = {
  cuisineDescription: string | null;
  knowHowParticularities: string | null;
  homemade: string | null;
};

const emptyCuisineKnowHow = (): RestaurantKnowledgeCuisineKnowHowInput => ({
  cuisineDescription: null,
  knowHowParticularities: null,
  homemade: null,
});

export async function getRestaurantKnowledgeCuisineKnowHow(
  db: CloudDatabaseClient,
  context: TenantContext,
): Promise<RestaurantKnowledgeCuisineKnowHowInput> {
  requireEstablishment(context);
  const [row] = await db
    .select({
      cuisineDescription: restaurantKnowledgeCuisineKnowHow.cuisineDescription,
      knowHowParticularities:
        restaurantKnowledgeCuisineKnowHow.knowHowParticularities,
      homemade: restaurantKnowledgeCuisineKnowHow.homemade,
    })
    .from(restaurantKnowledgeCuisineKnowHow)
    .where(
      and(
        eq(
          restaurantKnowledgeCuisineKnowHow.organizationId,
          context.organizationId,
        ),
        eq(
          restaurantKnowledgeCuisineKnowHow.establishmentId,
          context.establishmentId,
        ),
      ),
    )
    .limit(1);

  return row ?? emptyCuisineKnowHow();
}

export async function saveRestaurantKnowledgeCuisineKnowHow(
  db: CloudDatabaseClient,
  context: TenantContext,
  input: RestaurantKnowledgeCuisineKnowHowInput,
): Promise<RestaurantKnowledgeCuisineKnowHowInput> {
  requireEstablishment(context);
  const [row] = await db
    .insert(restaurantKnowledgeCuisineKnowHow)
    .values({
      organizationId: context.organizationId,
      establishmentId: context.establishmentId,
      cuisineDescription: input.cuisineDescription,
      knowHowParticularities: input.knowHowParticularities,
      homemade: input.homemade,
    })
    .onConflictDoUpdate({
      target: [
        restaurantKnowledgeCuisineKnowHow.organizationId,
        restaurantKnowledgeCuisineKnowHow.establishmentId,
      ],
      set: {
        cuisineDescription: input.cuisineDescription,
        knowHowParticularities: input.knowHowParticularities,
        homemade: input.homemade,
      },
    })
    .returning({
      cuisineDescription: restaurantKnowledgeCuisineKnowHow.cuisineDescription,
      knowHowParticularities:
        restaurantKnowledgeCuisineKnowHow.knowHowParticularities,
      homemade: restaurantKnowledgeCuisineKnowHow.homemade,
    });

  return row ?? emptyCuisineKnowHow();
}
