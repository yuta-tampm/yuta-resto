'use server';

import {
  createPersonnelEmployeeInputSchema,
  setPersonnelEmployeeDepartureInputSchema,
  updatePersonnelEmployeeInputSchema,
  type PersonnelEmployeeAccessHistory,
  type PersonnelEmployeeAuditHistory,
  type PersonnelEmployeeUnifiedHistory,
  type PersonnelEmployeeSummary,
} from '@yuta/contracts/personnel';
import {
  createPersonnelEmployee,
  listPersonnelEmployeeAccessHistory,
  listPersonnelEmployeeAuditHistory,
  listPersonnelEmployeeUnifiedHistory,
  PersonnelConflictError,
  PersonnelDuplicateError,
  PersonnelRepositoryError,
  recordPersonnelEmployeeAccess,
  setPersonnelEmployeeDeparture,
  updatePersonnelEmployee,
} from '@yuta/db-cloud';
import type { TenantContext } from '@yuta/tenant';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requirePersonnelPermission } from '@/server/auth/permissions';
import { requirePersonnelTenant } from '@/server/auth/session';
import { cloudDatabase } from '@/server/cloud-database';
import { getDateInTimezone } from '@/lib/local-time';
import { mapPersonnelHistoryMetadataError } from './_lib/employee-history-action-errors';
import { nullableText } from './_lib/form-values';
import {
  employeeUpdateIssueField,
  rootIssueField,
  zodFieldErrors,
} from './_lib/personnel-action-errors';

export type CreateEmployeeActionState = {
  status: 'idle' | 'error' | 'duplicate' | 'success';
  message: string | null;
  employeeId: string | null;
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

export type LoadEmployeeUnifiedHistoryActionResult =
  | { status: 'success'; history: PersonnelEmployeeUnifiedHistory }
  | { status: 'error'; message: string };

export type LoadEmployeeAccessHistoryActionResult =
  | { status: 'success'; history: PersonnelEmployeeAccessHistory }
  | { status: 'error'; message: string };

export async function loadEmployeeAccessHistoryAction(
  employeeId: string,
  operationId: string,
  cursor?: string,
): Promise<LoadEmployeeAccessHistoryActionResult> {
  return loadTracedEmployeeHistory({
    employeeId,
    operationId,
    eventType: 'employee.access_history_viewed',
    failureMessage: 'Impossible de charger les consultations. Réessayez.',
    logMessage: 'Failed to load personnel employee access history.',
    load: (tenant) =>
      listPersonnelEmployeeAccessHistory(
        cloudDatabase,
        tenant,
        employeeId,
        cursor,
      ),
  });
}

export async function loadEmployeeHistoryAction(
  employeeId: string,
  operationId: string,
): Promise<LoadEmployeeHistoryActionResult> {
  return loadTracedEmployeeHistory({
    employeeId,
    operationId,
    eventType: 'employee.history_viewed',
    failureMessage: 'Impossible de charger l’historique. Réessayez.',
    logMessage: 'Failed to load personnel employee history.',
    load: (tenant) =>
      listPersonnelEmployeeAuditHistory(cloudDatabase, tenant, employeeId),
  });
}

export async function loadEmployeeUnifiedHistoryAction(
  employeeId: string,
  operationId: string,
): Promise<LoadEmployeeUnifiedHistoryActionResult> {
  return loadTracedEmployeeHistory({
    employeeId,
    operationId,
    eventType: 'employee.history_viewed',
    failureMessage: 'Impossible de charger l’historique. Réessayez.',
    logMessage: 'Failed to load unified personnel employee history.',
    load: (tenant) =>
      listPersonnelEmployeeUnifiedHistory(cloudDatabase, tenant, employeeId),
  });
}

/**
 * Authorization failures propagate unchanged. The access trace must be
 * recorded before the scoped history read; any later failure is recoverable.
 */
async function loadTracedEmployeeHistory<THistory>(input: {
  employeeId: string;
  operationId: string;
  eventType: 'employee.history_viewed' | 'employee.access_history_viewed';
  failureMessage: string;
  logMessage: string;
  load: (tenant: TenantContext) => Promise<THistory>;
}): Promise<
  | { status: 'success'; history: THistory }
  | { status: 'error'; message: string }
> {
  const { tenant } = await requirePersonnelTenant('/equipe/salaries');
  requirePersonnelPermission(tenant, 'personnel.employee.read');

  try {
    const allowed = await recordPersonnelEmployeeAccess(
      cloudDatabase,
      tenant,
      input.employeeId,
      input.eventType,
      input.operationId,
    );
    if (!allowed) {
      return { status: 'error', message: input.failureMessage };
    }
    const history = await input.load(tenant);
    return { status: 'success', history };
  } catch (error: unknown) {
    console.error(input.logMessage, error);
    return { status: 'error', message: input.failureMessage };
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
      fixedTermReasonCode:
        employmentTermType === 'fixed_term'
          ? nullableText(formData.get('fixedTermReasonCode'))
          : null,
      workTimeCategory: formData.get('workTimeCategory'),
      contractWeeklyMinutes: contractWeeklyMinutes(formData),
      entryDate: formData.get('entryDate'),
      confirmDuplicate: formData.get('confirmDuplicate') === 'true',
      duplicateOverrideReason: nullableText(
        formData.get('duplicateOverrideReason'),
      ),
    });
    const result = await createPersonnelEmployee(
      cloudDatabase,
      tenant,
      input,
      getDateInTimezone(tenant.timezone),
    );
    revalidatePath('/equipe/salaries');
    return {
      status: 'success',
      message: 'Le dossier minimum a été créé.',
      employeeId: result.employee.id,
      fieldErrors: {},
      duplicateCandidates: [],
    };
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return {
        status: 'error',
        message: 'Certains champs doivent être corrigés.',
        employeeId: null,
        fieldErrors: zodFieldErrors(error, rootIssueField, frenchFieldError),
        duplicateCandidates: [],
      };
    }
    if (error instanceof PersonnelDuplicateError) {
      return {
        status: 'duplicate',
        message:
          'Un dossier portant le même nom existe peut-être dans cet établissement.',
        employeeId: null,
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
        employeeId: null,
        fieldErrors: {},
        duplicateCandidates: [],
      };
    }
    console.error('Failed to create personnel employee.', error);
    return {
      status: 'error',
      message: 'Impossible d’enregistrer le dossier. Réessayez.',
      employeeId: null,
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
  const businessDate = getDateInTimezone(tenant.timezone);
  let submittedHistoryMetadata: unknown;

  try {
    const employmentTermType = String(formData.get('employmentTermType') ?? '');
    submittedHistoryMetadata = parseHistoryMetadata(
      formData.get('historyMetadata'),
    );
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
      fixedTermReasonCode:
        employmentTermType === 'fixed_term'
          ? nullableText(formData.get('fixedTermReasonCode'))
          : null,
      workTimeCategory: formData.get('workTimeCategory'),
      contractWeeklyMinutes: contractWeeklyMinutes(formData),
      entryDate: formData.get('entryDate'),
      confirmFixedTermReasonClear:
        formData.get('confirmFixedTermReasonClear') === 'true',
      historyMetadata: submittedHistoryMetadata,
    });
    const result = await updatePersonnelEmployee(
      cloudDatabase,
      tenant,
      input,
      businessDate,
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
      return {
        status: 'error',
        message: 'Certains champs doivent être corrigés.',
        fieldErrors: zodFieldErrors(
          error,
          (path) => employeeUpdateIssueField(path, submittedHistoryMetadata),
          frenchFieldError,
        ),
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
    if (
      error instanceof PersonnelRepositoryError &&
      error.code === 'PERSONNEL_HISTORY_METADATA_INVALID'
    ) {
      const mapped = mapPersonnelHistoryMetadataError({
        repositoryMessage: error.message,
        submittedMetadata: submittedHistoryMetadata,
        businessDate,
        entryDate: String(formData.get('entryDate') ?? ''),
      });
      return {
        status: 'error',
        message: mapped.message,
        fieldErrors: mapped.fieldErrors,
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
    if (
      error instanceof PersonnelRepositoryError &&
      error.code === 'FIXED_TERM_REASON_REQUIRED'
    ) {
      return {
        status: 'error',
        message: 'Choisissez un motif pris en charge pour ce CDD.',
        fieldErrors: {
          fixedTermReasonCode: 'Choisissez le motif du CDD.',
        },
        currentEmployee: null,
      };
    }
    if (
      error instanceof PersonnelRepositoryError &&
      error.code === 'FIXED_TERM_REASON_CLEAR_CONFIRMATION_REQUIRED'
    ) {
      return {
        status: 'error',
        message: 'Confirmez la suppression du motif CDD avant de continuer.',
        fieldErrors: {
          confirmFixedTermReasonClear:
            'Confirmez que le motif CDD doit être supprimé.',
        },
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
      getDateInTimezone(tenant.timezone),
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
      return {
        status: 'error',
        message: 'Vérifiez les informations avant de confirmer.',
        fieldErrors: zodFieldErrors(error, rootIssueField, frenchFieldError),
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

function parseHistoryMetadata(value: FormDataEntryValue | null): unknown {
  const raw = String(value ?? '').trim();
  if (!raw) return undefined;
  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
}

function contractWeeklyMinutes(formData: FormData): number | null {
  const hoursValue = String(formData.get('contractWeeklyHours') ?? '').trim();
  const minutesValue = String(
    formData.get('contractWeeklyMinuteRemainder') ?? '',
  ).trim();
  if (!hoursValue && !minutesValue) return null;

  const hours = Number(hoursValue);
  const minutes = Number(minutesValue);
  if (
    !Number.isInteger(hours) ||
    !Number.isInteger(minutes) ||
    hours < 0 ||
    hours > 48 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return Number.NaN;
  }
  return hours * 60 + minutes;
}

function frenchFieldError(field: string): string {
  const messages: Record<string, string> = {
    givenNames: 'Renseignez les prénoms (120 caractères maximum).',
    familyName: 'Renseignez le nom (120 caractères maximum).',
    position: 'Renseignez le poste (120 caractères maximum).',
    qualification: 'Renseignez la qualification (120 caractères maximum).',
    employmentTermType: 'Choisissez CDI ou CDD.',
    expectedEndDate: 'Renseignez une date de fin valide pour le CDD.',
    fixedTermReasonCode: 'Choisissez le motif du CDD.',
    workTimeCategory: 'Choisissez le temps de travail.',
    contractWeeklyMinutes:
      'Renseignez une durée comprise entre 1 minute et 48 heures.',
    entryDate: 'Renseignez une date d’entrée valide.',
    confirmFixedTermReasonClear:
      'Confirmez que le motif CDD doit être supprimé.',
    duplicateOverrideReason:
      'Expliquez en quelques mots pourquoi il s’agit d’un dossier distinct.',
    departureDate: 'Renseignez une date de départ valide.',
    correctionReason: 'Expliquez brièvement la correction.',
    confirmNonDeletion: 'Confirmez que le dossier doit être conservé.',
    historyMetadata: 'Vérifiez la nature des modifications.',
  };
  if (field.endsWith('.classification')) {
    return 'Choisissez Correction ou Changement.';
  }
  if (field.endsWith('.effectiveDate')) {
    return 'Renseignez une date d’effet valide.';
  }
  if (field.endsWith('.correctionReason')) {
    return 'Expliquez brièvement la correction.';
  }
  return messages[field] ?? 'Vérifiez cette valeur.';
}
