import { requireEstablishment, type TenantContext } from '@yuta/tenant';
import { and, eq } from 'drizzle-orm';
import type { CloudDatabaseClient } from './client';
import {
  restaurantKnowledgeConceptHistory,
  restaurantKnowledgeCommunicationIdentity,
  restaurantKnowledgeCuisineKnowHow,
  restaurantKnowledgeCustomerExperience,
  restaurantKnowledgeTeamCulture,
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

export type RestaurantKnowledgeCustomerExperienceInput = {
  desiredExperience: string | null;
  welcomeAndService: string | null;
  customerAttention: string | null;
};

const emptyCustomerExperience =
  (): RestaurantKnowledgeCustomerExperienceInput => ({
    desiredExperience: null,
    welcomeAndService: null,
    customerAttention: null,
  });

export async function getRestaurantKnowledgeCustomerExperience(
  db: CloudDatabaseClient,
  context: TenantContext,
): Promise<RestaurantKnowledgeCustomerExperienceInput> {
  requireEstablishment(context);
  const [row] = await db
    .select({
      desiredExperience:
        restaurantKnowledgeCustomerExperience.desiredExperience,
      welcomeAndService:
        restaurantKnowledgeCustomerExperience.welcomeAndService,
      customerAttention:
        restaurantKnowledgeCustomerExperience.customerAttention,
    })
    .from(restaurantKnowledgeCustomerExperience)
    .where(
      and(
        eq(
          restaurantKnowledgeCustomerExperience.organizationId,
          context.organizationId,
        ),
        eq(
          restaurantKnowledgeCustomerExperience.establishmentId,
          context.establishmentId,
        ),
      ),
    )
    .limit(1);

  return row ?? emptyCustomerExperience();
}

export async function saveRestaurantKnowledgeCustomerExperience(
  db: CloudDatabaseClient,
  context: TenantContext,
  input: RestaurantKnowledgeCustomerExperienceInput,
): Promise<RestaurantKnowledgeCustomerExperienceInput> {
  requireEstablishment(context);
  const [row] = await db
    .insert(restaurantKnowledgeCustomerExperience)
    .values({
      organizationId: context.organizationId,
      establishmentId: context.establishmentId,
      desiredExperience: input.desiredExperience,
      welcomeAndService: input.welcomeAndService,
      customerAttention: input.customerAttention,
    })
    .onConflictDoUpdate({
      target: [
        restaurantKnowledgeCustomerExperience.organizationId,
        restaurantKnowledgeCustomerExperience.establishmentId,
      ],
      set: {
        desiredExperience: input.desiredExperience,
        welcomeAndService: input.welcomeAndService,
        customerAttention: input.customerAttention,
      },
    })
    .returning({
      desiredExperience:
        restaurantKnowledgeCustomerExperience.desiredExperience,
      welcomeAndService:
        restaurantKnowledgeCustomerExperience.welcomeAndService,
      customerAttention:
        restaurantKnowledgeCustomerExperience.customerAttention,
    });

  return row ?? emptyCustomerExperience();
}

export type RestaurantKnowledgeTeamCultureInput = {
  valuesAndMindset: string | null;
  workingTogether: string | null;
  transmissionAndIntegration: string | null;
};

const emptyTeamCulture = (): RestaurantKnowledgeTeamCultureInput => ({
  valuesAndMindset: null,
  workingTogether: null,
  transmissionAndIntegration: null,
});

export async function getRestaurantKnowledgeTeamCulture(
  db: CloudDatabaseClient,
  context: TenantContext,
): Promise<RestaurantKnowledgeTeamCultureInput> {
  requireEstablishment(context);
  const [row] = await db
    .select({
      valuesAndMindset: restaurantKnowledgeTeamCulture.valuesAndMindset,
      workingTogether: restaurantKnowledgeTeamCulture.workingTogether,
      transmissionAndIntegration:
        restaurantKnowledgeTeamCulture.transmissionAndIntegration,
    })
    .from(restaurantKnowledgeTeamCulture)
    .where(
      and(
        eq(
          restaurantKnowledgeTeamCulture.organizationId,
          context.organizationId,
        ),
        eq(
          restaurantKnowledgeTeamCulture.establishmentId,
          context.establishmentId,
        ),
      ),
    )
    .limit(1);

  return row ?? emptyTeamCulture();
}

export async function saveRestaurantKnowledgeTeamCulture(
  db: CloudDatabaseClient,
  context: TenantContext,
  input: RestaurantKnowledgeTeamCultureInput,
): Promise<RestaurantKnowledgeTeamCultureInput> {
  requireEstablishment(context);
  const [row] = await db
    .insert(restaurantKnowledgeTeamCulture)
    .values({
      organizationId: context.organizationId,
      establishmentId: context.establishmentId,
      valuesAndMindset: input.valuesAndMindset,
      workingTogether: input.workingTogether,
      transmissionAndIntegration: input.transmissionAndIntegration,
    })
    .onConflictDoUpdate({
      target: [
        restaurantKnowledgeTeamCulture.organizationId,
        restaurantKnowledgeTeamCulture.establishmentId,
      ],
      set: {
        valuesAndMindset: input.valuesAndMindset,
        workingTogether: input.workingTogether,
        transmissionAndIntegration: input.transmissionAndIntegration,
      },
    })
    .returning({
      valuesAndMindset: restaurantKnowledgeTeamCulture.valuesAndMindset,
      workingTogether: restaurantKnowledgeTeamCulture.workingTogether,
      transmissionAndIntegration:
        restaurantKnowledgeTeamCulture.transmissionAndIntegration,
    });

  return row ?? emptyTeamCulture();
}

export type RestaurantKnowledgeCommunicationIdentityInput = {
  toneAndCommunicationStyle: string | null;
  customerAddressing: string | null;
  languageElementsAndThingsToAvoid: string | null;
};

const emptyCommunicationIdentity =
  (): RestaurantKnowledgeCommunicationIdentityInput => ({
    toneAndCommunicationStyle: null,
    customerAddressing: null,
    languageElementsAndThingsToAvoid: null,
  });

export async function getRestaurantKnowledgeCommunicationIdentity(
  db: CloudDatabaseClient,
  context: TenantContext,
): Promise<RestaurantKnowledgeCommunicationIdentityInput> {
  requireEstablishment(context);
  const [row] = await db
    .select({
      toneAndCommunicationStyle:
        restaurantKnowledgeCommunicationIdentity.toneAndCommunicationStyle,
      customerAddressing:
        restaurantKnowledgeCommunicationIdentity.customerAddressing,
      languageElementsAndThingsToAvoid:
        restaurantKnowledgeCommunicationIdentity.languageElementsAndThingsToAvoid,
    })
    .from(restaurantKnowledgeCommunicationIdentity)
    .where(
      and(
        eq(
          restaurantKnowledgeCommunicationIdentity.organizationId,
          context.organizationId,
        ),
        eq(
          restaurantKnowledgeCommunicationIdentity.establishmentId,
          context.establishmentId,
        ),
      ),
    )
    .limit(1);

  return row ?? emptyCommunicationIdentity();
}

export async function saveRestaurantKnowledgeCommunicationIdentity(
  db: CloudDatabaseClient,
  context: TenantContext,
  input: RestaurantKnowledgeCommunicationIdentityInput,
): Promise<RestaurantKnowledgeCommunicationIdentityInput> {
  requireEstablishment(context);
  const [row] = await db
    .insert(restaurantKnowledgeCommunicationIdentity)
    .values({
      organizationId: context.organizationId,
      establishmentId: context.establishmentId,
      toneAndCommunicationStyle: input.toneAndCommunicationStyle,
      customerAddressing: input.customerAddressing,
      languageElementsAndThingsToAvoid: input.languageElementsAndThingsToAvoid,
    })
    .onConflictDoUpdate({
      target: [
        restaurantKnowledgeCommunicationIdentity.organizationId,
        restaurantKnowledgeCommunicationIdentity.establishmentId,
      ],
      set: {
        toneAndCommunicationStyle: input.toneAndCommunicationStyle,
        customerAddressing: input.customerAddressing,
        languageElementsAndThingsToAvoid:
          input.languageElementsAndThingsToAvoid,
      },
    })
    .returning({
      toneAndCommunicationStyle:
        restaurantKnowledgeCommunicationIdentity.toneAndCommunicationStyle,
      customerAddressing:
        restaurantKnowledgeCommunicationIdentity.customerAddressing,
      languageElementsAndThingsToAvoid:
        restaurantKnowledgeCommunicationIdentity.languageElementsAndThingsToAvoid,
    });

  return row ?? emptyCommunicationIdentity();
}
