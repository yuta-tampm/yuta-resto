'use server';

import { establishmentProfileInputSchema } from '@yuta/contracts';
import {
  createRestaurantKnowledgeValidatedItem,
  removeRestaurantKnowledgeValidatedItem,
  saveRestaurantKnowledgeConceptHistory,
  saveRestaurantKnowledgeCommunicationIdentity,
  saveRestaurantKnowledgeCuisineKnowHow,
  saveRestaurantKnowledgeCustomerExperience,
  saveRestaurantKnowledgeTeamCulture,
  updateRestaurantKnowledgeValidatedItem,
  updateEstablishmentProfile,
  type RestaurantKnowledgeCommunicationIdentityInput,
  type RestaurantKnowledgeValidatedItemValue,
} from '@yuta/db-cloud';
import { requireEstablishment } from '@yuta/tenant';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import {
  requireEstablishmentPermission,
  requireRestaurantKnowledgePermission,
} from '@/server/auth/permissions';
import { requireAuthenticatedTenant } from '@/server/auth/session';
import { requireBackofficeCapabilityAvailable } from '@/server/backoffice-exposure';
import { cloudDatabase } from '@/server/cloud-database';

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

export type TeamCultureActionState = ConceptHistoryActionState;

export type CommunicationIdentityActionState = {
  status: 'idle' | 'success' | 'error';
  message: string | null;
  savedCommunicationIdentity: RestaurantKnowledgeCommunicationIdentityInput | null;
};

export type ValidatedKnowledgeActionState = {
  status: 'idle' | 'success' | 'error';
  message: string | null;
  fieldError: string | null;
  item: RestaurantKnowledgeValidatedItemValue | null;
  removedItemId: string | null;
};

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

const teamCultureInputSchema = z
  .object({
    valuesAndMindset: optionalConceptHistoryTextSchema,
    workingTogether: optionalConceptHistoryTextSchema,
    transmissionAndIntegration: optionalConceptHistoryTextSchema,
  })
  .strict();

const communicationIdentityInputSchema = z
  .object({
    toneAndCommunicationStyle: optionalConceptHistoryTextSchema,
    customerAddressing: optionalConceptHistoryTextSchema,
    languageElementsAndThingsToAvoid: optionalConceptHistoryTextSchema,
  })
  .strict();

const validatedKnowledgeStatementSchema = z
  .string()
  .refine((value) => /\S/u.test(value), {
    message:
      'Saisissez une connaissance contenant au moins un caractère autre qu’un espace.',
  });

const validatedKnowledgeCreateSchema = z
  .object({ statement: validatedKnowledgeStatementSchema })
  .strict();

const validatedKnowledgeUpdateSchema = z
  .object({
    id: z.string().uuid(),
    statement: validatedKnowledgeStatementSchema,
  })
  .strict();

const validatedKnowledgeRemoveSchema = z
  .object({ id: z.string().uuid() })
  .strict();

const validatedKnowledgeValidationFailure = (
  error: z.ZodError,
): ValidatedKnowledgeActionState => ({
  status: 'error',
  message: 'Cette connaissance doit être corrigée.',
  fieldError:
    error.issues.find((issue) => issue.path[0] === 'statement')?.message ??
    null,
  item: null,
  removedItemId: null,
});

const informationPagePath = '/etablissement/informations-generales';

async function requireRestaurantKnowledgeManager() {
  requireBackofficeCapabilityAvailable('restaurant-knowledge');
  const { tenant } = await requireAuthenticatedTenant(informationPagePath);
  requireEstablishment(tenant);
  requireRestaurantKnowledgePermission(tenant, 'restaurant-knowledge.manage');
  return tenant;
}

type RestaurantKnowledgeTenant = Awaited<
  ReturnType<typeof requireRestaurantKnowledgeManager>
>;

function readFormFields(
  formData: FormData,
  fields: readonly string[],
): Record<string, FormDataEntryValue | null> {
  return Object.fromEntries(
    fields.map((field) => [field, formData.get(field)]),
  );
}

function logKnowledgeSaveFailure(error: unknown, label: string): void {
  if (error instanceof z.ZodError) return;
  console.error(`Failed to save Restaurant Knowledge ${label}.`, {
    errorName: error instanceof Error ? error.name : 'UnknownError',
  });
}

async function saveKnowledgeTextSection<Input>(
  formData: FormData,
  section: {
    fields: readonly string[];
    schema: z.ZodType<Input, z.ZodTypeDef, unknown>;
    save: (
      database: typeof cloudDatabase,
      tenant: RestaurantKnowledgeTenant,
      input: Input,
    ) => Promise<unknown>;
    successMessage: string;
    failureLabel: string;
  },
): Promise<ConceptHistoryActionState> {
  const tenant = await requireRestaurantKnowledgeManager();
  try {
    const input = section.schema.parse(
      readFormFields(formData, section.fields),
    );
    await section.save(cloudDatabase, tenant, input);
    revalidatePath(informationPagePath);
    return { status: 'success', message: section.successMessage };
  } catch (error: unknown) {
    logKnowledgeSaveFailure(error, section.failureLabel);
    return {
      status: 'error',
      message: 'Une erreur est survenue. Réessayez.',
    };
  }
}

export async function saveGeneralInformationAction(
  _previousState: GeneralInformationActionState,
  formData: FormData,
): Promise<GeneralInformationActionState> {
  const { tenant } = await requireAuthenticatedTenant(informationPagePath);
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
    revalidatePath(informationPagePath);
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
  return saveKnowledgeTextSection(formData, {
    fields: ['concept', 'history'],
    schema: conceptHistoryInputSchema,
    save: saveRestaurantKnowledgeConceptHistory,
    successMessage: 'Concept et histoire enregistrés.',
    failureLabel: 'Concept/History',
  });
}

export async function saveCuisineKnowHowAction(
  _previousState: CuisineKnowHowActionState,
  formData: FormData,
): Promise<CuisineKnowHowActionState> {
  return saveKnowledgeTextSection(formData, {
    fields: ['cuisineDescription', 'knowHowParticularities', 'homemade'],
    schema: cuisineKnowHowInputSchema,
    save: saveRestaurantKnowledgeCuisineKnowHow,
    successMessage: 'Cuisine et savoir-faire enregistrés.',
    failureLabel: 'Cuisine/Know-how',
  });
}

export async function saveCustomerExperienceAction(
  _previousState: CustomerExperienceActionState,
  formData: FormData,
): Promise<CustomerExperienceActionState> {
  return saveKnowledgeTextSection(formData, {
    fields: ['desiredExperience', 'welcomeAndService', 'customerAttention'],
    schema: customerExperienceInputSchema,
    save: saveRestaurantKnowledgeCustomerExperience,
    successMessage: 'Expérience client enregistrée.',
    failureLabel: 'Customer Experience',
  });
}

export async function saveTeamCultureAction(
  _previousState: TeamCultureActionState,
  formData: FormData,
): Promise<TeamCultureActionState> {
  return saveKnowledgeTextSection(formData, {
    fields: [
      'valuesAndMindset',
      'workingTogether',
      'transmissionAndIntegration',
    ],
    schema: teamCultureInputSchema,
    save: saveRestaurantKnowledgeTeamCulture,
    successMessage: 'Équipe et culture enregistrées.',
    failureLabel: 'Team Culture',
  });
}

export async function saveCommunicationIdentityAction(
  previousState: CommunicationIdentityActionState,
  formData: FormData,
): Promise<CommunicationIdentityActionState> {
  const tenant = await requireRestaurantKnowledgeManager();

  try {
    const input = communicationIdentityInputSchema.parse(
      readFormFields(formData, [
        'toneAndCommunicationStyle',
        'customerAddressing',
        'languageElementsAndThingsToAvoid',
      ]),
    );
    const savedCommunicationIdentity =
      await saveRestaurantKnowledgeCommunicationIdentity(
        cloudDatabase,
        tenant,
        input,
      );
    revalidatePath(informationPagePath);
    return {
      status: 'success',
      message: 'Identité de communication enregistrée.',
      savedCommunicationIdentity,
    };
  } catch (error: unknown) {
    logKnowledgeSaveFailure(error, 'Communication Identity');
    return {
      status: 'error',
      message: 'Une erreur est survenue. Réessayez.',
      savedCommunicationIdentity: previousState.savedCommunicationIdentity,
    };
  }
}

export async function createValidatedKnowledgeAction(
  _previousState: ValidatedKnowledgeActionState,
  formData: FormData,
): Promise<ValidatedKnowledgeActionState> {
  const tenant = await requireRestaurantKnowledgeManager();

  try {
    const input = validatedKnowledgeCreateSchema.parse({
      statement: formData.get('statement'),
    });
    const item = await createRestaurantKnowledgeValidatedItem(
      cloudDatabase,
      tenant,
      input.statement,
    );
    if (!item) {
      return validatedKnowledgeError('Établissement introuvable.');
    }
    revalidatePath(informationPagePath);
    return {
      status: 'success',
      message: 'Connaissance validée ajoutée.',
      fieldError: null,
      item,
      removedItemId: null,
    };
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return validatedKnowledgeValidationFailure(error);
    }
    console.error('Failed to create Restaurant Knowledge validated item.', {
      errorName: error instanceof Error ? error.name : 'UnknownError',
    });
    return validatedKnowledgeError('Une erreur est survenue. Réessayez.');
  }
}

export async function updateValidatedKnowledgeAction(
  _previousState: ValidatedKnowledgeActionState,
  formData: FormData,
): Promise<ValidatedKnowledgeActionState> {
  const tenant = await requireRestaurantKnowledgeManager();

  try {
    const input = validatedKnowledgeUpdateSchema.parse({
      id: formData.get('id'),
      statement: formData.get('statement'),
    });
    const item = await updateRestaurantKnowledgeValidatedItem(
      cloudDatabase,
      tenant,
      input.id,
      input.statement,
    );
    if (!item) {
      return validatedKnowledgeError('Cette connaissance n’existe plus.');
    }
    revalidatePath(informationPagePath);
    return {
      status: 'success',
      message: 'Connaissance validée enregistrée.',
      fieldError: null,
      item,
      removedItemId: null,
    };
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return validatedKnowledgeValidationFailure(error);
    }
    console.error('Failed to update Restaurant Knowledge validated item.', {
      errorName: error instanceof Error ? error.name : 'UnknownError',
    });
    return validatedKnowledgeError('Une erreur est survenue. Réessayez.');
  }
}

export async function removeValidatedKnowledgeAction(
  _previousState: ValidatedKnowledgeActionState,
  formData: FormData,
): Promise<ValidatedKnowledgeActionState> {
  const tenant = await requireRestaurantKnowledgeManager();

  try {
    const input = validatedKnowledgeRemoveSchema.parse({
      id: formData.get('id'),
    });
    const removed = await removeRestaurantKnowledgeValidatedItem(
      cloudDatabase,
      tenant,
      input.id,
    );
    if (!removed) {
      return validatedKnowledgeError('Cette connaissance n’existe plus.');
    }
    revalidatePath(informationPagePath);
    return {
      status: 'success',
      message: 'Connaissance validée retirée.',
      fieldError: null,
      item: null,
      removedItemId: input.id,
    };
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return validatedKnowledgeValidationFailure(error);
    }
    console.error('Failed to remove Restaurant Knowledge validated item.', {
      errorName: error instanceof Error ? error.name : 'UnknownError',
    });
    return validatedKnowledgeError('Une erreur est survenue. Réessayez.');
  }
}

function validatedKnowledgeError(
  message: string,
): ValidatedKnowledgeActionState {
  return {
    status: 'error',
    message,
    fieldError: null,
    item: null,
    removedItemId: null,
  };
}
