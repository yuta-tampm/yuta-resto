'use server';

import {
  createPersonnelEmployeeInputSchema,
  setPersonnelEmployeeDepartureInputSchema,
  updatePersonnelEmployeeInputSchema,
  type PersonnelContractAmendment,
  type PersonnelContractAmendmentList,
  type PersonnelEmployeeAccessHistory,
  type PersonnelEmployeeAuditHistory,
  type PersonnelEmployeeSummary,
  type PersonnelDocument,
  type PersonnelDocumentList,
} from '@yuta/contracts/personnel';
import {
  createPersonnelEmployee,
  listPersonnelEmployeeAccessHistory,
  listPersonnelEmployeeAuditHistory,
  PersonnelConflictError,
  PersonnelDuplicateError,
  PersonnelRepositoryError,
  recordPersonnelEmployeeAccess,
  setPersonnelEmployeeDeparture,
  updatePersonnelEmployee,
  listPersonnelDocuments,
  PersonnelDocumentRepositoryError,
  recordPersonnelDocumentUploadRejected,
  savePersonnelDocumentMetadata,
  createPersonnelContractAmendmentMetadata,
  listPersonnelContractAmendments,
  PersonnelContractAmendmentRepositoryError,
  recordPersonnelContractAmendmentUploadRejected,
  replacePersonnelContractAmendmentMetadata,
} from '@yuta/db-cloud';
import { revalidatePath } from 'next/cache';
import { createHash } from 'node:crypto';
import { z } from 'zod';
import { requirePersonnelPermission } from '../../../../server/auth/permissions';
import { requirePersonnelTenant } from '../../../../server/auth/session';
import { cloudDatabase } from '../../../../server/cloud-database';
import {
  getPersonnelDocumentRuntime,
  PersonnelDocumentScannerError,
} from '../../../../server/personnel-documents/runtime';
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

export type LoadEmployeeAccessHistoryActionResult =
  | { status: 'success'; history: PersonnelEmployeeAccessHistory }
  | { status: 'error'; message: string };

export type LoadEmployeeDocumentsActionResult =
  | { status: 'success'; documents: PersonnelDocumentList }
  | { status: 'error'; message: string };

export type SaveEmployeeDocumentActionState = {
  status: 'idle' | 'error' | 'conflict' | 'success';
  message: string | null;
  document: PersonnelDocument | null;
};

export type LoadEmployeeAmendmentsActionResult =
  | { status: 'success'; amendments: PersonnelContractAmendmentList }
  | { status: 'error'; message: string };

export type SaveEmployeeAmendmentActionState = {
  status: 'idle' | 'error' | 'conflict' | 'success';
  message: string | null;
  fieldErrors: Record<string, string>;
  amendment: PersonnelContractAmendment | null;
  values: {
    effectiveDate: string;
    reference: string;
  };
};

const createAmendmentFormSchema = z
  .object({
    effectiveDate: z.string().date(),
    reference: z.string().trim().min(1).max(80).nullable(),
  })
  .strict();
const replaceAmendmentFormSchema = z
  .object({
    amendmentId: z.string().uuid(),
    expectedRevision: z.coerce.number().int().positive(),
  })
  .strict();

export async function loadEmployeeDocumentsAction(
  employeeId: string,
  operationId: string,
): Promise<LoadEmployeeDocumentsActionResult> {
  const { tenant } = await requirePersonnelTenant('/equipe/salaries');
  requirePersonnelPermission(tenant, 'personnel.document.read');
  try {
    const documents = await listPersonnelDocuments(
      cloudDatabase,
      tenant,
      employeeId,
      operationId,
    );
    return { status: 'success', documents };
  } catch (error: unknown) {
    console.error('Failed to load personnel documents.', error);
    return {
      status: 'error',
      message: 'Impossible de charger les documents. Réessayez.',
    };
  }
}

export async function saveEmployeeDocumentAction(
  _previousState: SaveEmployeeDocumentActionState,
  formData: FormData,
): Promise<SaveEmployeeDocumentActionState> {
  const { tenant } = await requirePersonnelTenant('/equipe/salaries');
  requirePersonnelPermission(tenant, 'personnel.document.manage');
  const employeeId = String(formData.get('employeeId') ?? '');
  const idempotencyKey = String(formData.get('idempotencyKey') ?? '');
  let storageKey: string | null = null;
  try {
    const file = formData.get('file');
    if (!(file instanceof File) || file.size === 0) {
      return documentError('Sélectionnez un fichier PDF.');
    }
    if (file.size > 10 * 1024 * 1024) {
      await recordRejectedSafe(employeeId, idempotencyKey, 'invalid_file');
      return documentError('Le fichier ne doit pas dépasser 10 Mo.');
    }
    const content = new Uint8Array(await file.arrayBuffer());
    if (
      file.type !== 'application/pdf' ||
      new TextDecoder('ascii').decode(content.slice(0, 5)) !== '%PDF-'
    ) {
      await recordRejectedSafe(employeeId, idempotencyKey, 'invalid_file');
      return documentError('Seuls les fichiers PDF valides sont acceptés.');
    }

    const runtime = await getPersonnelDocumentRuntime();
    storageKey = await runtime.storage.putQuarantinedObject(content);
    const quarantined = await runtime.storage.readQuarantinedObject(storageKey);
    await runtime.scanner.inspectQuarantinedObject(quarantined);
    await runtime.storage.promoteVerifiedObject(storageKey);

    const rawRevision = String(formData.get('expectedRevision') ?? '').trim();
    const result = await savePersonnelDocumentMetadata(cloudDatabase, tenant, {
      idempotencyKey,
      employeeId,
      expectedRevision: rawRevision ? Number(rawRevision) : null,
      category: 'signed_employment_contract',
      filename: sanitizeDocumentFilename(file.name),
      mediaType: 'application/pdf',
      byteSize: file.size,
      checksum: createHash('sha256').update(content).digest('hex'),
      storageKey,
    });
    if (result.idempotentReplay) {
      await runtime.storage.removeObject(storageKey);
    }
    revalidatePath('/equipe/salaries');
    return {
      status: 'success',
      message: result.idempotentReplay
        ? 'Ce fichier avait déjà été enregistré.'
        : 'Le contrat signé a été vérifié et enregistré.',
      document: result.document,
    };
  } catch (error: unknown) {
    if (storageKey) {
      try {
        const runtime = await getPersonnelDocumentRuntime();
        await runtime.storage.removeObject(storageKey);
      } catch {
        console.error('Failed to clean up a personnel document object.');
      }
    }
    if (
      error instanceof PersonnelDocumentRepositoryError &&
      error.code === 'CONFLICT'
    ) {
      return {
        status: 'conflict',
        message:
          'Le document a changé depuis son ouverture. Rechargez la liste avant de réessayer.',
        document: null,
      };
    }
    if (error instanceof PersonnelDocumentScannerError) {
      await recordRejectedSafe(employeeId, idempotencyKey, 'scanner_rejected');
      return documentError(
        'Le fichier n’a pas été accepté par le contrôle de sécurité.',
      );
    }
    if (error instanceof z.ZodError) {
      await recordRejectedSafe(employeeId, idempotencyKey, 'invalid_file');
      return documentError('Vérifiez le fichier puis réessayez.');
    }
    await recordRejectedSafe(employeeId, idempotencyKey, 'storage_failure');
    console.error('Failed to save a personnel document.', error);
    return documentError(
      'Impossible d’enregistrer le document pour le moment. Réessayez.',
    );
  }

  async function recordRejectedSafe(
    rejectedEmployeeId: string,
    operationId: string,
    reasonCode: 'invalid_file' | 'scanner_rejected' | 'storage_failure',
  ) {
    try {
      await recordPersonnelDocumentUploadRejected(
        cloudDatabase,
        tenant,
        rejectedEmployeeId,
        operationId,
        reasonCode,
      );
    } catch {
      console.error('Failed to record a rejected personnel document upload.');
    }
  }
}

export async function loadEmployeeAmendmentsAction(
  employeeId: string,
  cursor?: string,
): Promise<LoadEmployeeAmendmentsActionResult> {
  const { tenant } = await requirePersonnelTenant('/equipe/salaries');
  requirePersonnelPermission(tenant, 'personnel.document.read');
  try {
    const amendments = await listPersonnelContractAmendments(
      cloudDatabase,
      tenant,
      employeeId,
      cursor,
    );
    return { status: 'success', amendments };
  } catch (error: unknown) {
    console.error('Failed to load personnel contract amendments.', error);
    return {
      status: 'error',
      message: 'Impossible de charger les avenants. Réessayez.',
    };
  }
}

export async function saveEmployeeAmendmentAction(
  _previousState: SaveEmployeeAmendmentActionState,
  formData: FormData,
): Promise<SaveEmployeeAmendmentActionState> {
  const { tenant } = await requirePersonnelTenant('/equipe/salaries');
  requirePersonnelPermission(tenant, 'personnel.document.manage');
  const employeeId = String(formData.get('employeeId') ?? '');
  const amendmentId = nullableText(formData.get('amendmentId'));
  const idempotencyKey = String(formData.get('idempotencyKey') ?? '');
  const mode = formData.get('mode') === 'replace' ? 'replace' : 'create';
  const values = {
    effectiveDate: String(formData.get('effectiveDate') ?? ''),
    reference: String(formData.get('reference') ?? ''),
  };
  let storageKey: string | null = null;
  try {
    const commandInput =
      mode === 'replace'
        ? replaceAmendmentFormSchema.parse({
            amendmentId,
            expectedRevision: formData.get('expectedRevision'),
          })
        : createAmendmentFormSchema.parse({
            effectiveDate: formData.get('effectiveDate'),
            reference: nullableText(formData.get('reference')),
          });
    const file = formData.get('file');
    if (!(file instanceof File) || file.size === 0) {
      return amendmentError(
        'Sélectionnez un fichier PDF.',
        {
          file: 'Sélectionnez un fichier PDF.',
        },
        values,
      );
    }
    if (file.size > 10 * 1024 * 1024) {
      await recordRejectedSafe('invalid_file');
      return amendmentError(
        'Le fichier ne doit pas dépasser 10 Mo.',
        {
          file: 'Choisissez un fichier de 10 Mo maximum.',
        },
        values,
      );
    }
    const content = new Uint8Array(await file.arrayBuffer());
    if (
      file.type !== 'application/pdf' ||
      new TextDecoder('ascii').decode(content.slice(0, 5)) !== '%PDF-'
    ) {
      await recordRejectedSafe('invalid_file');
      return amendmentError(
        'Seuls les fichiers PDF valides sont acceptés.',
        {
          file: 'Choisissez un fichier PDF valide.',
        },
        values,
      );
    }
    const runtime = await getPersonnelDocumentRuntime();
    storageKey = await runtime.storage.putQuarantinedObject(content);
    const quarantined = await runtime.storage.readQuarantinedObject(storageKey);
    await runtime.scanner.inspectQuarantinedObject(quarantined);
    await runtime.storage.promoteVerifiedObject(storageKey);
    const fileMetadata = {
      idempotencyKey,
      employeeId,
      filename: sanitizeDocumentFilename(file.name, 'avenant-signe'),
      mediaType: 'application/pdf' as const,
      byteSize: file.size,
      checksum: createHash('sha256').update(content).digest('hex'),
      storageKey,
    };
    const result =
      mode === 'replace'
        ? await replacePersonnelContractAmendmentMetadata(
            cloudDatabase,
            tenant,
            {
              ...fileMetadata,
              amendmentId:
                'amendmentId' in commandInput ? commandInput.amendmentId : '',
              expectedRevision:
                'expectedRevision' in commandInput
                  ? commandInput.expectedRevision
                  : 0,
            },
          )
        : await createPersonnelContractAmendmentMetadata(
            cloudDatabase,
            tenant,
            {
              ...fileMetadata,
              effectiveDate:
                'effectiveDate' in commandInput
                  ? commandInput.effectiveDate
                  : '',
              reference:
                'reference' in commandInput ? commandInput.reference : null,
            },
          );
    if (result.idempotentReplay) {
      await runtime.storage.removeObject(storageKey);
    }
    revalidatePath('/equipe/salaries');
    return {
      status: 'success',
      message: result.idempotentReplay
        ? 'Cet avenant avait déjà été enregistré.'
        : mode === 'replace'
          ? 'Le fichier de cet avenant a été vérifié et remplacé.'
          : 'L’avenant signé a été vérifié et enregistré.',
      fieldErrors: {},
      amendment: result.amendment,
      values: { effectiveDate: '', reference: '' },
    };
  } catch (error: unknown) {
    if (storageKey) {
      try {
        const runtime = await getPersonnelDocumentRuntime();
        await runtime.storage.removeObject(storageKey);
      } catch {
        console.error('Failed to clean up a personnel amendment object.');
      }
    }
    if (
      error instanceof PersonnelContractAmendmentRepositoryError &&
      error.code === 'CONFLICT'
    ) {
      return {
        status: 'conflict',
        message:
          'Cet avenant a changé depuis son ouverture. Rechargez la liste avant de réessayer.',
        fieldErrors: {},
        amendment: null,
        values,
      };
    }
    if (
      error instanceof PersonnelContractAmendmentRepositoryError &&
      error.code === 'IDEMPOTENCY_CONFLICT'
    ) {
      return amendmentError(
        'Cette tentative a déjà été utilisée avec d’autres valeurs. Fermez puis rouvrez le formulaire.',
        {},
        values,
      );
    }
    if (
      error instanceof PersonnelContractAmendmentRepositoryError &&
      error.code === 'NOT_FOUND'
    ) {
      return amendmentError(
        'Cet avenant n’est plus disponible. Rechargez la liste puis réessayez.',
        {},
        values,
      );
    }
    if (error instanceof PersonnelDocumentScannerError) {
      await recordRejectedSafe('scanner_rejected');
      return amendmentError(
        'Le fichier n’a pas été accepté par le contrôle de sécurité.',
        {},
        values,
      );
    }
    if (error instanceof z.ZodError) {
      await recordRejectedSafe('invalid_file');
      const fieldErrors: Record<string, string> = {};
      for (const issue of error.issues) {
        const field = String(issue.path[0] ?? 'form');
        fieldErrors[field] ??=
          field === 'effectiveDate'
            ? 'Indiquez une date d’effet valide.'
            : field === 'reference'
              ? 'La référence doit contenir 80 caractères maximum.'
              : 'Vérifiez cette valeur.';
      }
      return amendmentError(
        'Certains champs doivent être corrigés.',
        fieldErrors,
        values,
      );
    }
    await recordRejectedSafe('storage_failure');
    console.error('Failed to save a personnel contract amendment.', error);
    return amendmentError(
      'Impossible d’enregistrer l’avenant pour le moment. Réessayez.',
      {},
      values,
    );
  }

  async function recordRejectedSafe(
    reasonCode: 'invalid_file' | 'scanner_rejected' | 'storage_failure',
  ) {
    try {
      await recordPersonnelContractAmendmentUploadRejected(
        cloudDatabase,
        tenant,
        employeeId,
        idempotencyKey,
        reasonCode,
        mode === 'replace' ? (amendmentId ?? undefined) : undefined,
      );
    } catch {
      console.error('Failed to record a rejected amendment upload.');
    }
  }
}

function documentError(message: string): SaveEmployeeDocumentActionState {
  return { status: 'error', message, document: null };
}

function amendmentError(
  message: string,
  fieldErrors: Record<string, string> = {},
  values: SaveEmployeeAmendmentActionState['values'] = {
    effectiveDate: '',
    reference: '',
  },
): SaveEmployeeAmendmentActionState {
  return {
    status: 'error',
    message,
    fieldErrors,
    amendment: null,
    values,
  };
}

function sanitizeDocumentFilename(
  value: string,
  fallback = 'contrat-signe',
): string {
  const normalized = value
    .replaceAll('\\', '/')
    .split('/')
    .at(-1)
    ?.replace(/[\u0000-\u001F\u007F]/gu, '')
    .trim();
  const base = normalized?.replace(/\.pdf$/iu, '').trim() || fallback;
  return `${base.slice(0, 176)}.pdf`;
}

export async function loadEmployeeAccessHistoryAction(
  employeeId: string,
  operationId: string,
  cursor?: string,
): Promise<LoadEmployeeAccessHistoryActionResult> {
  const { tenant } = await requirePersonnelTenant('/equipe/salaries');
  requirePersonnelPermission(tenant, 'personnel.employee.read');

  try {
    const allowed = await recordPersonnelEmployeeAccess(
      cloudDatabase,
      tenant,
      employeeId,
      'employee.access_history_viewed',
      operationId,
    );
    if (!allowed) {
      return {
        status: 'error',
        message: 'Impossible de charger les consultations. Réessayez.',
      };
    }
    const history = await listPersonnelEmployeeAccessHistory(
      cloudDatabase,
      tenant,
      employeeId,
      cursor,
    );
    return { status: 'success', history };
  } catch (error: unknown) {
    console.error('Failed to load personnel employee access history.', error);
    return {
      status: 'error',
      message: 'Impossible de charger les consultations. Réessayez.',
    };
  }
}

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
      fixedTermReasonCode:
        employmentTermType === 'fixed_term'
          ? nullableText(formData.get('fixedTermReasonCode'))
          : null,
      workTimeCategory: formData.get('workTimeCategory'),
      contractWeeklyMinutes: contractWeeklyMinutes(formData),
      entryDate: formData.get('entryDate'),
      confirmFixedTermReasonClear:
        formData.get('confirmFixedTermReasonClear') === 'true',
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
  };
  return messages[field] ?? 'Vérifiez cette valeur.';
}
