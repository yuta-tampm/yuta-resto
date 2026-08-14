'use server';

import {
  createPersonnelEmployeeInputSchema,
  setPersonnelEmployeeDepartureInputSchema,
  updatePersonnelEmployeeInputSchema,
  type PersonnelEmployeeAuditHistory,
  type PersonnelEmployeeSummary,
} from '@yuta/contracts/personnel';
import {
  createPersonnelEmployee,
  listPersonnelEmployeeAuditHistory,
  PersonnelConflictError,
  PersonnelDuplicateError,
  PersonnelRepositoryError,
  recordPersonnelEmployeeAccess,
  setPersonnelEmployeeDeparture,
  updatePersonnelEmployee,
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

export type UpdateEmployeeActionState = {
  status: 'idle' | 'error' | 'conflict' | 'success';
  message: string | null;
  fieldErrors: Record<string, string>;
  currentEmployee: PersonnelEmployeeSummary | null;
};

export type DepartureEmployeeActionState = {
  status: 'idle' | 'error' | 'conflict' | 'success';
  message: string | null;
  fieldErrors: Record<string, string>;
  currentEmployee: PersonnelEmployeeSummary | null;
};

export type LoadEmployeeHistoryActionResult =
  | { status: 'success'; history: PersonnelEmployeeAuditHistory }
  | { status: 'error'; message: string };

export async function loadEmployeeHistoryAction(
  employeeId: string,
  operationId: string,
): Promise<LoadEmployeeHistoryActionResult> {
  const { tenant } = await requirePersonnelTenant('/equipe/salaries');
  requirePersonnelPermission(tenant, 'personnel.employee.read');

  try {
    const allowed = await recordPersonnelEmployeeAccess(
      cloudDatabase,
      tenant,
      employeeId,
      'employee.history_viewed',
      operationId,
    );
    if (!allowed) {
      return {
        status: 'error',
        message: 'Impossible de charger l’historique. Réessayez.',
      };
    }
    const history = await listPersonnelEmployeeAuditHistory(
      cloudDatabase,
      tenant,
      employeeId,
    );
    return { status: 'success', history };
  } catch (error: unknown) {
    console.error('Failed to load personnel employee history.', error);
    return {
      status: 'error',
      message: 'Impossible de charger l’historique. Réessayez.',
    };
  }
}

export async function recordEmployeeDossierViewAction(
  employeeId: string,
  operationId: string,
): Promise<{ status: 'success' } | { status: 'error'; message: string }> {
  const { tenant } = await requirePersonnelTenant('/equipe/salaries');
  requirePersonnelPermission(tenant, 'personnel.employee.read');
  try {
    const allowed = await recordPersonnelEmployeeAccess(
      cloudDatabase,
      tenant,
      employeeId,
      'employee.dossier_viewed',
      operationId,
    );
    return allowed
      ? { status: 'success' }
      : {
          status: 'error',
          message: 'La traçabilité du dossier est indisponible. Réessayez.',
        };
  } catch (error: unknown) {
    console.error('Failed to record personnel dossier access.', error);
    return {
      status: 'error',
      message: 'La traçabilité du dossier est indisponible. Réessayez.',
    };
  }
}

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

export async function updateEmployeeAction(
  _previousState: UpdateEmployeeActionState,
  formData: FormData,
): Promise<UpdateEmployeeActionState> {
  const { tenant } = await requirePersonnelTenant('/equipe/salaries');
  requirePersonnelPermission(tenant, 'personnel.employee.manage');

  try {
    const employmentTermType = String(formData.get('employmentTermType') ?? '');
    const input = updatePersonnelEmployeeInputSchema.parse({
      idempotencyKey: formData.get('idempotencyKey'),
      employeeId: formData.get('employeeId'),
      expectedRevision: formData.get('expectedRevision'),
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
    });
    const result = await updatePersonnelEmployee(
      cloudDatabase,
      tenant,
      input,
      getBusinessDate(tenant.timezone),
    );
    revalidatePath('/equipe/salaries');
    return {
      status: 'success',
      message: result.updated
        ? 'Les modifications ont été enregistrées.'
        : 'Aucune modification à enregistrer.',
      fieldErrors: {},
      currentEmployee: result.employee,
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
        currentEmployee: null,
      };
    }
    if (
      error instanceof PersonnelRepositoryError &&
      error.code === 'INVALID_EMPLOYMENT_DATES'
    ) {
      return {
        status: 'error',
        message:
          'La date d’entrée ne peut pas être postérieure au départ déjà enregistré.',
        fieldErrors: {
          entryDate: 'Choisissez une date antérieure ou égale au départ.',
        },
        currentEmployee: null,
      };
    }
    if (error instanceof PersonnelConflictError) {
      return {
        status: 'conflict',
        message:
          'Ce dossier a été modifié depuis son ouverture. Vos valeurs sont conservées : rechargez la version actuelle avant de réessayer.',
        fieldErrors: {},
        currentEmployee: error.currentEmployee,
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
        currentEmployee: null,
      };
    }
    console.error('Failed to update personnel employee.', error);
    return {
      status: 'error',
      message: 'Impossible d’enregistrer les modifications. Réessayez.',
      fieldErrors: {},
      currentEmployee: null,
    };
  }
}

export async function setEmployeeDepartureAction(
  _previousState: DepartureEmployeeActionState,
  formData: FormData,
): Promise<DepartureEmployeeActionState> {
  const { tenant } = await requirePersonnelTenant('/equipe/salaries');
  requirePersonnelPermission(tenant, 'personnel.employee.manage');

  try {
    const input = setPersonnelEmployeeDepartureInputSchema.parse({
      idempotencyKey: formData.get('idempotencyKey'),
      employeeId: formData.get('employeeId'),
      expectedRevision: formData.get('expectedRevision'),
      departureDate: nullableText(formData.get('departureDate')),
      correctionReason: nullableText(formData.get('correctionReason')),
      confirmNonDeletion: formData.get('confirmNonDeletion') === 'true',
    });
    const result = await setPersonnelEmployeeDeparture(
      cloudDatabase,
      tenant,
      input,
      getBusinessDate(tenant.timezone),
    );
    revalidatePath('/equipe/salaries');
    return {
      status: 'success',
      message: result.updated
        ? input.departureDate
          ? 'Le départ a été enregistré.'
          : 'Le départ planifié a été annulé.'
        : 'Aucune modification à enregistrer.',
      fieldErrors: {},
      currentEmployee: result.employee,
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
        message: 'Vérifiez les informations avant de confirmer.',
        fieldErrors,
        currentEmployee: null,
      };
    }
    if (error instanceof PersonnelConflictError) {
      return {
        status: 'conflict',
        message:
          'Ce dossier a été modifié depuis son ouverture. Rechargez la version actuelle avant de réessayer.',
        fieldErrors: {},
        currentEmployee: error.currentEmployee,
      };
    }
    if (error instanceof PersonnelRepositoryError) {
      if (error.code === 'IDEMPOTENCY_CONFLICT') {
        return {
          status: 'error',
          message:
            'Cette tentative a déjà été utilisée avec d’autres valeurs. Fermez puis rouvrez le formulaire.',
          fieldErrors: {},
          currentEmployee: null,
        };
      }
      if (error.code === 'INVALID_EMPLOYMENT_DATES') {
        return {
          status: 'error',
          message:
            'Le dernier jour travaillé ne peut pas être antérieur à la date d’entrée.',
          fieldErrors: {
            departureDate:
              'Choisissez une date égale ou postérieure à l’entrée.',
          },
          currentEmployee: null,
        };
      }
      if (error.code === 'REASON_REQUIRED') {
        return {
          status: 'error',
          message:
            'Une raison est obligatoire pour corriger ou annuler un départ.',
          fieldErrors: {
            correctionReason: 'Expliquez brièvement la correction.',
          },
          currentEmployee: null,
        };
      }
      if (error.code === 'DEPARTURE_DATE_REQUIRED') {
        return {
          status: 'error',
          message: 'Renseignez le dernier jour travaillé.',
          fieldErrors: {
            departureDate: 'Choisissez une date de départ.',
          },
          currentEmployee: null,
        };
      }
    }
    console.error('Failed to set personnel employee departure.', error);
    return {
      status: 'error',
      message: 'Impossible d’enregistrer le départ. Réessayez.',
      fieldErrors: {},
      currentEmployee: null,
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
    departureDate: 'Renseignez une date de départ valide.',
    correctionReason: 'Expliquez brièvement la correction.',
    confirmNonDeletion: 'Confirmez que le dossier doit être conservé.',
  };
  return messages[field] ?? 'Vérifiez cette valeur.';
}
