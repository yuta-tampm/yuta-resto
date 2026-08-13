'use server';

import { createPersonnelEmployeeInputSchema } from '@yuta/contracts/personnel';
import {
  createPersonnelEmployee,
  PersonnelDuplicateError,
  PersonnelRepositoryError,
} from '@yuta/db-cloud';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requirePersonnelPermission } from '../../../../server/auth/permissions';
import { requirePersonnelTenant } from '../../../../server/auth/session';
import { cloudDatabase } from '../../../../server/cloud-database';
import { getBusinessDate } from './salaries-model';

export type CreateEmployeeActionState = {
  status: 'idle' | 'error' | 'duplicate' | 'success';
  message: string | null;
  fieldErrors: Record<string, string>;
  duplicateCandidates: Array<{
    id: string;
    displayName: string;
    position: string;
    entryDate: string;
    departureDate: string | null;
  }>;
};

export async function createEmployeeAction(
  _previousState: CreateEmployeeActionState,
  formData: FormData,
): Promise<CreateEmployeeActionState> {
  const { tenant } = await requirePersonnelTenant('/equipe/salaries');
  requirePersonnelPermission(tenant, 'personnel.employee.manage');

  try {
    const employmentTermType = String(formData.get('employmentTermType') ?? '');
    const input = createPersonnelEmployeeInputSchema.parse({
      idempotencyKey: formData.get('idempotencyKey'),
      givenNames: formData.get('givenNames'),
      familyName: formData.get('familyName'),
      position: formData.get('position'),
      qualification: formData.get('qualification'),
      employmentTermType,
      expectedEndDate:
        employmentTermType === 'fixed_term'
          ? nullableText(formData.get('expectedEndDate'))
          : null,
      workTimeCategory: formData.get('workTimeCategory'),
      entryDate: formData.get('entryDate'),
      confirmDuplicate: formData.get('confirmDuplicate') === 'true',
      duplicateOverrideReason: nullableText(
        formData.get('duplicateOverrideReason'),
      ),
    });
    await createPersonnelEmployee(
      cloudDatabase,
      tenant,
      input,
      getBusinessDate(tenant.timezone),
    );
    revalidatePath('/equipe/salaries');
    return {
      status: 'success',
      message: 'Le dossier salarié a été enregistré.',
      fieldErrors: {},
      duplicateCandidates: [],
    };
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of error.issues) {
        const field = String(issue.path[0] ?? 'form');
        fieldErrors[field] ??= frenchFieldError(field);
      }
      return {
        status: 'error',
        message: 'Certains champs doivent être corrigés.',
        fieldErrors,
        duplicateCandidates: [],
      };
    }
    if (error instanceof PersonnelDuplicateError) {
      return {
        status: 'duplicate',
        message:
          'Un dossier portant le même nom existe peut-être dans cet établissement.',
        fieldErrors: {},
        duplicateCandidates: error.candidates,
      };
    }
    if (
      error instanceof PersonnelRepositoryError &&
      error.code === 'IDEMPOTENCY_CONFLICT'
    ) {
      return {
        status: 'error',
        message:
          'Cette tentative a déjà été utilisée avec d’autres valeurs. Fermez puis rouvrez le formulaire.',
        fieldErrors: {},
        duplicateCandidates: [],
      };
    }
    console.error('Failed to create personnel employee.', error);
    return {
      status: 'error',
      message: 'Impossible d’enregistrer le dossier. Réessayez.',
      fieldErrors: {},
      duplicateCandidates: [],
    };
  }
}

function nullableText(value: FormDataEntryValue | null): string | null {
  const normalized = String(value ?? '').trim();
  return normalized || null;
}

function frenchFieldError(field: string): string {
  const messages: Record<string, string> = {
    givenNames: 'Renseignez les prénoms (120 caractères maximum).',
    familyName: 'Renseignez le nom (120 caractères maximum).',
    position: 'Renseignez le poste (120 caractères maximum).',
    qualification: 'Renseignez la qualification (120 caractères maximum).',
    employmentTermType: 'Choisissez CDI ou CDD.',
    expectedEndDate: 'Renseignez une date de fin valide pour le CDD.',
    workTimeCategory: 'Choisissez le temps de travail.',
    entryDate: 'Renseignez une date d’entrée valide.',
    duplicateOverrideReason:
      'Expliquez en quelques mots pourquoi il s’agit d’un dossier distinct.',
  };
  return messages[field] ?? 'Vérifiez cette valeur.';
}
