import {
  foreignKey,
  pgTable,
  primaryKey,
  text,
  uuid,
} from 'drizzle-orm/pg-core';
import { establishments } from './tenancy';

export const restaurantKnowledgeConceptHistory = pgTable(
  'restaurant_knowledge_concept_history',
  {
    organizationId: uuid('organization_id').notNull(),
    establishmentId: uuid('establishment_id').notNull(),
    concept: text('concept'),
    history: text('history'),
  },
  (table) => [
    primaryKey({
      columns: [table.organizationId, table.establishmentId],
      name: 'restaurant_knowledge_concept_history_scope_pk',
    }),
    foreignKey({
      columns: [table.organizationId, table.establishmentId],
      foreignColumns: [establishments.organizationId, establishments.id],
      name: 'restaurant_knowledge_concept_history_establishment_scope_fk',
    }).onDelete('restrict'),
  ],
);

export type RestaurantKnowledgeConceptHistory =
  typeof restaurantKnowledgeConceptHistory.$inferSelect;
