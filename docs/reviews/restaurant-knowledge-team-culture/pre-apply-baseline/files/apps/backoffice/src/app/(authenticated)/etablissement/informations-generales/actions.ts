'use server';

import { establishmentProfileInputSchema } from '@yuta/contracts';
import {
  saveRestaurantKnowledgeConceptHistory,
  saveRestaurantKnowledgeCuisineKnowHow,
  saveRestaurantKnowledgeCustomerExperience,
  updateEstablishmentProfile,
} from '@yuta/db-cloud';
import { requireEstablishment } from '@yuta/tenant';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import {
  requireEstablishmentPermission,
  requireRestaurantKnowledgePermission,
} from '../../../../server/auth/permissions';
import { requireAuthenticatedTenant } from '../../../../server/auth/session';
import { cloudDatabase } from '../../../../server/cloud-database';

export type GeneralInformationActionState = {
  status: 'idle' | 'success' | 'error';
  message: string | null;
  fieldErrors: Record<string, string>;
};

export type ConceptHistoryActionState = {
  status: 'idle' | 'success' | 'error';
  message: string | null;
};

export type CuisineKnowHowActionState = ConceptHistoryActionState;

export type CustomerExperienceActionState = ConceptHistoryActionState;

const optionalConceptHistoryTextSchema = z
  .string()
  .nullable()
  .transform((value) => (value === '' ? null : value));

const conceptHistoryInputSchema = z
  .object({
    concept: optionalConceptHistoryTextSchema,
    history: optionalConceptHistoryTextSchema,
  })
  .strict();

const cuisineKnowHowInputSchema = z
  .object({
    cuisineDescription: optionalConceptHistoryTextSchema,
    knowHowParticularities: optionalConceptHistoryTextSchema,
    homemade: optionalConceptHistoryTextSchema,
  })
  .strict();

const customerExperienceInputSchema = z
  .object({
    desiredExperience: optionalConceptHistoryTextSchema,
    welcomeAndService: optionalConceptHistoryTextSchema,
    customerAttention: optionalConceptHistoryTextSchema,
  })
  .strict();

export async function saveGeneralInformationAction(
  _previousState: GeneralInformationActionState,
  formData: FormData,
): Promise<GeneralInformationActionState> {
  const { tenant } = await requireAuthenticatedTenant(
    '/etablissement/informations-generales',
  );
  requireEstablishment(tenant);
  requireEstablishmentPermission(tenant, 'establishment.profile.manage');
  const nullable = (key: string) =>
    String(formData.get(key) ?? '').trim() || null;

  try {
    const input = establishmentProfileInputSchema.parse({
      name: formData.get('name'),
      description: nullable('description'),
      addressLine1: nullable('addressLine1'),
      addressLine2: nullable('addressLine2'),
      postalCode: nullable('postalCode'),
      city: nullable('city'),
      countryCode: nullable('countryCode'),
      phone: nullable('phone'),
      email: nullable('email'),
      website: nullable('website'),
      publicPhone: nullable('publicPhone'),
      publicEmail: nullable('publicEmail'),
      logoUrl: nullable('logoUrl'),
      coverImageUrl: nullable('coverImageUrl'),
      languages: formData.getAll('languages').map(String),
      serviceModes: formData.getAll('serviceModes').map(String),
      publicDescription: formData.get('publicDescription') === 'on',
      publicAddress: formData.get('publicAddress') === 'on',
      publicPhoneVisible: formData.get('publicPhoneVisible') === 'on',
      publicEmailVisible: formData.get('publicEmailVisible') === 'on',
      publicWebsite: formData.get('publicWebsite') === 'on',
      publicLanguages: formData.get('publicLanguages') === 'on',
      publicServiceModes: formData.get('publicServiceModes') === 'on',
    });
    const updated = await updateEstablishmentProfile(
      cloudDatabase,
      tenant,
      input,
    );
    if (!updated) {
      return {
        status: 'error',
        message: 'Établissement introuvable.',
        fieldErrors: {},
      };
    }
    revalidatePath('/etablissement/informations-generales');
    return {
      status: 'success',
      message: 'Informations générales enregistrées.',
      fieldErrors: {},
    };
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of error.issues) {
        const field = String(issue.path[0] ?? 'form');
        fieldErrors[field] ??= 'Vérifiez cette valeur.';
      }
      return {
        status: 'error',
        message: 'Certains champs doivent être corrigés.',
        fieldErrors,
      };
    }
    console.error('Failed to save establishment profile.', error);
    return {
      status: 'error',
      message: 'Une erreur est survenue. Réessayez.',
      fieldErrors: {},
    };
  }
}

export async function saveConceptHistoryAction(
  _previousState: ConceptHistoryActionState,
  formData: FormData,
): Promise<ConceptHistoryActionState> {
  const { tenant } = await requireAuthenticatedTenant(
    '/etablissement/informations-generales',
  );
  requireEstablishment(tenant);
  requireRestaurantKnowledgePermission(tenant, 'restaurant-knowledge.manage');

  try {
    const input = conceptHistoryInputSchema.parse({
      concept: formData.get('concept'),
      history: formData.get('history'),
    });
    await saveRestaurantKnowledgeConceptHistory(cloudDatabase, tenant, input);
    revalidatePath('/etablissement/informations-generales');
    return {
      status: 'success',
      message: 'Concept et histoire enregistrés.',
    };
  } catch (error: unknown) {
    if (!(error instanceof z.ZodError)) {
      console.error('Failed to save Restaurant Knowledge Concept/History.', {
        errorName: error instanceof Error ? error.name : 'UnknownError',
      });
    }
    return {
      status: 'error',
      message: 'Une erreur est survenue. Réessayez.',
    };
  }
}

export async function saveCuisineKnowHowAction(
  _previousState: CuisineKnowHowActionState,
  formData: FormData,
): Promise<CuisineKnowHowActionState> {
  const { tenant } = await requireAuthenticatedTenant(
    '/etablissement/informations-generales',
  );
  requireEstablishment(tenant);
  requireRestaurantKnowledgePermission(tenant, 'restaurant-knowledge.manage');

  try {
    const input = cuisineKnowHowInputSchema.parse({
      cuisineDescription: formData.get('cuisineDescription'),
      knowHowParticularities: formData.get('knowHowParticularities'),
      homemade: formData.get('homemade'),
    });
    await saveRestaurantKnowledgeCuisineKnowHow(cloudDatabase, tenant, input);
    revalidatePath('/etablissement/informations-generales');
    return {
      status: 'success',
      message: 'Cuisine et savoir-faire enregistrés.',
    };
  } catch (error: unknown) {
    if (!(error instanceof z.ZodError)) {
      console.error('Failed to save Restaurant Knowledge Cuisine/Know-how.', {
        errorName: error instanceof Error ? error.name : 'UnknownError',
      });
    }
    return {
      status: 'error',
      message: 'Une erreur est survenue. Réessayez.',
    };
  }
}

export async function saveCustomerExperienceAction(
  _previousState: CustomerExperienceActionState,
  formData: FormData,
): Promise<CustomerExperienceActionState> {
  const { tenant } = await requireAuthenticatedTenant(
    '/etablissement/informations-generales',
  );
  requireEstablishment(tenant);
  requireRestaurantKnowledgePermission(tenant, 'restaurant-knowledge.manage');

  try {
    const input = customerExperienceInputSchema.parse({
      desiredExperience: formData.get('desiredExperience'),
      welcomeAndService: formData.get('welcomeAndService'),
      customerAttention: formData.get('customerAttention'),
    });
    await saveRestaurantKnowledgeCustomerExperience(
      cloudDatabase,
      tenant,
      input,
    );
    revalidatePath('/etablissement/informations-generales');
    return {
      status: 'success',
      message: 'Expérience client enregistrée.',
    };
  } catch (error: unknown) {
    if (!(error instanceof z.ZodError)) {
      console.error(
        'Failed to save Restaurant Knowledge Customer Experience.',
        {
          errorName: error instanceof Error ? error.name : 'UnknownError',
        },
      );
    }
    return {
      status: 'error',
      message: 'Une erreur est survenue. Réessayez.',
    };
  }
}
