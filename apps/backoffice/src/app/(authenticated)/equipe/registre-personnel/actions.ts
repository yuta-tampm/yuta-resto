'use server';

import {
  createPersonnelRegisterEntryInputSchema,
  correctPersonnelRegisterEntryInputSchema,
  type PersonnelRegisterFacts,
  type PersonnelRegisterPage,
} from '@yuta/contracts/personnel';
import {
  correctPersonnelRegisterEntry,
  createPersonnelRegisterEntry,
  listPersonnelRegister,
  PersonnelRegisterRepositoryError,
} from '@yuta/db-cloud';
import { revalidatePath } from 'next/cache';
import { randomUUID } from 'node:crypto';
import { requirePersonnelPermission } from '../../../../server/auth/permissions';
import { requirePersonnelTenant } from '../../../../server/auth/session';
import { cloudDatabase } from '../../../../server/cloud-database';
import { isPersonnelRegisterEnabled } from './_lib/personnel-register-runtime';

export type PersonnelRegisterActionState = {
  status: 'idle' | 'success' | 'error' | 'conflict';
  message: string | null;
  fieldErrors: Record<string, string>;
};

export type LoadPersonnelRegisterPageResult =
  | { status: 'success'; data: PersonnelRegisterPage }
  | { status: 'stale' | 'error'; message: string };

export async function loadPersonnelRegisterPageAction(
  cursor: string | null,
): Promise<LoadPersonnelRegisterPageResult> {
  if (!isPersonnelRegisterEnabled()) {
    return {
      status: 'error',
      message: 'Le registre réel est désactivé dans cet environnement.',
    };
  }
  try {
    const { tenant } = await requirePersonnelTenant(
      '/equipe/registre-personnel',
    );
    requirePersonnelPermission(tenant, 'personnel.register.read');
    const data = await listPersonnelRegister(
      cloudDatabase,
      tenant,
      { cursor: cursor ?? undefined, limit: 50 },
      randomUUID(),
    );
    return { status: 'success', data };
  } catch (error) {
    if (
      error instanceof PersonnelRegisterRepositoryError &&
      error.code === 'STALE_CURSOR'
    ) {
      return {
        status: 'stale',
        message: 'Le registre a changé. Actualisez-le avant de continuer.',
      };
    }
    console.error('Personnel register page load failed.', error);
    return {
      status: 'error',
      message: 'La page suivante est indisponible. Réessayez.',
    };
  }
}

export async function inscribePersonnelRegisterAction(
  _previous: PersonnelRegisterActionState,
  formData: FormData,
): Promise<PersonnelRegisterActionState> {
  return mutateRegister('inscribe', formData);
}

export async function correctPersonnelRegisterAction(
  _previous: PersonnelRegisterActionState,
  formData: FormData,
): Promise<PersonnelRegisterActionState> {
  return mutateRegister('correct', formData);
}

async function mutateRegister(
  mode: 'inscribe' | 'correct',
  formData: FormData,
): Promise<PersonnelRegisterActionState> {
  if (!isPersonnelRegisterEnabled()) {
    return failure('Le registre réel est désactivé dans cet environnement.');
  }
  try {
    const { tenant } = await requirePersonnelTenant();
    requirePersonnelPermission(tenant, 'personnel.register.read');
    requirePersonnelPermission(tenant, 'personnel.employee.manage');
    const facts = parseFacts(formData);
    if (mode === 'inscribe') {
      const parsed = createPersonnelRegisterEntryInputSchema.safeParse({
        operationId: text(formData, 'operationId'),
        employeeId: text(formData, 'employeeId'),
        facts,
      });
      if (!parsed.success)
        return validationFailure(parsed.error.flatten().fieldErrors);
      await createPersonnelRegisterEntry(cloudDatabase, tenant, parsed.data);
    } else {
      const parsed = correctPersonnelRegisterEntryInputSchema.safeParse({
        operationId: text(formData, 'operationId'),
        entryId: text(formData, 'entryId'),
        expectedRevision: Number(text(formData, 'expectedRevision')),
        effectiveDate: text(formData, 'effectiveDate'),
        reason: text(formData, 'reason'),
        facts,
      });
      if (!parsed.success)
        return validationFailure(parsed.error.flatten().fieldErrors);
      await correctPersonnelRegisterEntry(cloudDatabase, tenant, parsed.data);
    }
    revalidatePath('/equipe/registre-personnel');
    return {
      status: 'success',
      message:
        mode === 'inscribe'
          ? 'Inscription enregistrée.'
          : 'Correction ajoutée à l’historique.',
      fieldErrors: {},
    };
  } catch (error) {
    if (error instanceof PersonnelRegisterRepositoryError) {
      if (error.code === 'CONFLICT' || error.code === 'EMPLOYEE_CHANGED') {
        return {
          status: 'conflict',
          message:
            'Les données ont changé. Fermez, actualisez puis vérifiez à nouveau.',
          fieldErrors: {},
        };
      }
      if (error.code === 'EMPLOYEE_ALREADY_INSCRIBED') {
        return failure('Ce salarié est déjà inscrit dans le registre.');
      }
      if (error.code === 'IDEMPOTENCY_CONFLICT') {
        return failure(
          'Cette tentative a déjà été utilisée avec un autre contenu.',
        );
      }
      if (error.code === 'NO_CHANGES') {
        return failure('Aucune information n’a été modifiée.');
      }
    }
    console.error('Personnel register mutation failed.', error);
    return failure(
      'Enregistrement impossible. Vérifiez les informations et réessayez.',
    );
  }
}

function parseFacts(formData: FormData): PersonnelRegisterFacts {
  return {
    givenNames: text(formData, 'givenNames'),
    familyName: text(formData, 'familyName'),
    nationalityCode: text(formData, 'nationalityCode').toUpperCase(),
    nationalityLabel: text(formData, 'nationalityLabel'),
    birthDate: text(formData, 'birthDate'),
    sex: text(formData, 'sex') as PersonnelRegisterFacts['sex'],
    position: text(formData, 'position'),
    qualification: text(formData, 'qualification'),
    entryDate: text(formData, 'entryDate'),
    departureDate: nullableText(formData, 'departureDate'),
    protectedAuthorization: {
      required: bool(formData, 'protectedAuthorizationRequired'),
      authorizationDate: nullableText(formData, 'protectedAuthorizationDate'),
      requestDate: nullableText(formData, 'protectedAuthorizationRequestDate'),
    },
    workAuthorization: {
      required: bool(formData, 'workAuthorizationRequired'),
      titleType: nullableText(formData, 'workAuthorizationTitleType'),
      orderNumber: nullableText(formData, 'workAuthorizationOrderNumber'),
    },
    employmentTermType: text(
      formData,
      'employmentTermType',
    ) as PersonnelRegisterFacts['employmentTermType'],
    workTimeCategory: text(
      formData,
      'workTimeCategory',
    ) as PersonnelRegisterFacts['workTimeCategory'],
    temporaryWorkCompany: parseThirdParty(formData, 'temporaryWorkCompany'),
    employerGroup: parseThirdParty(formData, 'employerGroup'),
    specialContract: text(
      formData,
      'specialContract',
    ) as PersonnelRegisterFacts['specialContract'],
  };
}

function parseThirdParty(
  formData: FormData,
  prefix: string,
): PersonnelRegisterFacts['temporaryWorkCompany'] {
  if (!bool(formData, `${prefix}Required`)) return null;
  return {
    legalName: text(formData, `${prefix}LegalName`),
    address: {
      line1: text(formData, `${prefix}AddressLine1`),
      line2: nullableText(formData, `${prefix}AddressLine2`),
      postalCode: text(formData, `${prefix}PostalCode`),
      city: text(formData, `${prefix}City`),
      countryCode: text(formData, `${prefix}CountryCode`).toUpperCase(),
    },
  };
}

function text(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : '';
}
function nullableText(formData: FormData, key: string): string | null {
  return text(formData, key) || null;
}
function bool(formData: FormData, key: string): boolean {
  return formData.get(key) === 'on' || formData.get(key) === 'true';
}
function failure(message: string): PersonnelRegisterActionState {
  return { status: 'error', message, fieldErrors: {} };
}
function validationFailure(
  errors: Record<string, string[] | undefined>,
): PersonnelRegisterActionState {
  return {
    status: 'error',
    message: 'Certaines informations sont invalides ou manquantes.',
    fieldErrors: Object.fromEntries(
      Object.entries(errors).flatMap(([key, values]) =>
        values?.[0] ? [[key, values[0]]] : [],
      ),
    ),
  };
}
