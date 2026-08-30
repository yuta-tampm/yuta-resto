import { requireEstablishment, type TenantContext } from '@yuta/tenant';
import { and, eq } from 'drizzle-orm';
import type { CloudDatabaseClient } from './client';
import { restaurantKnowledgeConceptHistory } from './schema';

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
