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

export const restaurantKnowledgeCuisineKnowHow = pgTable(
  'restaurant_knowledge_cuisine_know_how',
  {
    organizationId: uuid('organization_id').notNull(),
    establishmentId: uuid('establishment_id').notNull(),
    cuisineDescription: text('cuisine_description'),
    knowHowParticularities: text('know_how_particularities'),
    homemade: text('homemade'),
  },
  (table) => [
    primaryKey({
      columns: [table.organizationId, table.establishmentId],
      name: 'restaurant_knowledge_cuisine_know_how_scope_pk',
    }),
    foreignKey({
      columns: [table.organizationId, table.establishmentId],
      foreignColumns: [establishments.organizationId, establishments.id],
      name: 'restaurant_knowledge_cuisine_know_how_establishment_scope_fk',
    }).onDelete('restrict'),
  ],
);

export type RestaurantKnowledgeCuisineKnowHow =
  typeof restaurantKnowledgeCuisineKnowHow.$inferSelect;

export const restaurantKnowledgeCustomerExperience = pgTable(
  'restaurant_knowledge_customer_experience',
  {
    organizationId: uuid('organization_id').notNull(),
    establishmentId: uuid('establishment_id').notNull(),
    desiredExperience: text('desired_experience'),
    welcomeAndService: text('welcome_and_service'),
    customerAttention: text('customer_attention'),
  },
  (table) => [
    primaryKey({
      columns: [table.organizationId, table.establishmentId],
      name: 'restaurant_knowledge_customer_experience_scope_pk',
    }),
    foreignKey({
      columns: [table.organizationId, table.establishmentId],
      foreignColumns: [establishments.organizationId, establishments.id],
      name: 'restaurant_knowledge_customer_experience_establishment_scope_fk',
    }).onDelete('restrict'),
  ],
);

export type RestaurantKnowledgeCustomerExperience =
  typeof restaurantKnowledgeCustomerExperience.$inferSelect;
