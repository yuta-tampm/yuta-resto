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

export const restaurantKnowledgeTeamCulture = pgTable(
  'restaurant_knowledge_team_culture',
  {
    organizationId: uuid('organization_id').notNull(),
    establishmentId: uuid('establishment_id').notNull(),
    valuesAndMindset: text('values_and_mindset'),
    workingTogether: text('working_together'),
    transmissionAndIntegration: text('transmission_and_integration'),
  },
  (table) => [
    primaryKey({
      columns: [table.organizationId, table.establishmentId],
      name: 'restaurant_knowledge_team_culture_scope_pk',
    }),
    foreignKey({
      columns: [table.organizationId, table.establishmentId],
      foreignColumns: [establishments.organizationId, establishments.id],
      name: 'restaurant_knowledge_team_culture_establishment_scope_fk',
    }).onDelete('restrict'),
  ],
);

export type RestaurantKnowledgeTeamCulture =
  typeof restaurantKnowledgeTeamCulture.$inferSelect;

export const restaurantKnowledgeCommunicationIdentity = pgTable(
  'restaurant_knowledge_communication_identity',
  {
    organizationId: uuid('organization_id').notNull(),
    establishmentId: uuid('establishment_id').notNull(),
    toneAndCommunicationStyle: text('tone_and_communication_style'),
    customerAddressing: text('customer_addressing'),
    languageElementsAndThingsToAvoid: text(
      'language_elements_and_things_to_avoid',
    ),
  },
  (table) => [
    primaryKey({
      columns: [table.organizationId, table.establishmentId],
      name: 'restaurant_knowledge_communication_identity_scope_pk',
    }),
    foreignKey({
      columns: [table.organizationId, table.establishmentId],
      foreignColumns: [establishments.organizationId, establishments.id],
      name: 'restaurant_knowledge_communication_identity_establishment_fk',
    }).onDelete('restrict'),
  ],
);

export type RestaurantKnowledgeCommunicationIdentity =
  typeof restaurantKnowledgeCommunicationIdentity.$inferSelect;

export const restaurantKnowledgeValidatedItems = pgTable(
  'restaurant_knowledge_validated_items',
  {
    organizationId: uuid('organization_id').notNull(),
    establishmentId: uuid('establishment_id').notNull(),
    id: uuid('id').notNull(),
    statement: text('statement').notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.organizationId, table.establishmentId, table.id],
      name: 'restaurant_knowledge_validated_items_scope_item_pk',
    }),
    foreignKey({
      columns: [table.organizationId, table.establishmentId],
      foreignColumns: [establishments.organizationId, establishments.id],
      name: 'restaurant_knowledge_validated_items_establishment_scope_fk',
    }).onDelete('restrict'),
  ],
);

export type RestaurantKnowledgeValidatedItem =
  typeof restaurantKnowledgeValidatedItems.$inferSelect;
