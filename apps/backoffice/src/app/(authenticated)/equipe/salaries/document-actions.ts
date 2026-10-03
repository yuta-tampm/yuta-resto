'use server';

import {
  type PersonnelContractAmendment,
  type PersonnelContractAmendmentList,
  type PersonnelDocument,
  type PersonnelDocumentList,
} from '@yuta/contracts/personnel';
import {
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
import { z } from 'zod';
import { requirePersonnelPermission } from '@/server/auth/permissions';
import { requirePersonnelTenant } from '@/server/auth/session';
import { cloudDatabase } from '@/server/cloud-database';
import { PersonnelDocumentScannerError } from '@/server/personnel-documents/runtime';
import {
  checkSignedPdfFile,
  discardSignedPdf,
  quarantineSignedPdf,
  scanAndPromoteSignedPdf,
  signedPdfChecksum,
} from '@/server/personnel-documents/signed-pdf';
import { nullableText } from './_lib/form-values';

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
    const upload = await checkSignedPdfFile(formData.get('file'));
    if (upload.status === 'missing') {
      return documentError('Sélectionnez un fichier PDF.');
    }
    if (upload.status === 'too_large') {
      await recordRejectedSafe(employeeId, idempotencyKey, 'invalid_file');
      return documentError('Le fichier ne doit pas dépasser 10 Mo.');
    }
    if (upload.status === 'invalid') {
      await recordRejectedSafe(employeeId, idempotencyKey, 'invalid_file');
      return documentError('Seuls les fichiers PDF valides sont acceptés.');
    }
    const { file, content } = upload;

    storageKey = await quarantineSignedPdf(content);
    await scanAndPromoteSignedPdf(storageKey);

    const rawRevision = String(formData.get('expectedRevision') ?? '').trim();
    const result = await savePersonnelDocumentMetadata(cloudDatabase, tenant, {
      idempotencyKey,
      employeeId,
      expectedRevision: rawRevision ? Number(rawRevision) : null,
      category: 'signed_employment_contract',
      filename: sanitizeDocumentFilename(file.name),
      mediaType: 'application/pdf',
      byteSize: file.size,
      checksum: signedPdfChecksum(content),
      storageKey,
    });
    // The metadata is committed: the object is either referenced or, for a
    // replay, an unreferenced retry copy. Never reach the cleanup below.
    const persistedStorageKey = storageKey;
    storageKey = null;
    if (result.idempotentReplay) {
      await discardSignedPdf(
        persistedStorageKey,
        'Failed to clean up a replayed personnel document object.',
      );
    }
    revalidateSalariesAfterCommit();
    return {
      status: 'success',
      message: result.idempotentReplay
        ? 'Ce fichier avait déjà été enregistré.'
        : 'Le contrat signé a été vérifié et enregistré.',
      document: result.document,
    };
  } catch (error: unknown) {
    await discardSignedPdf(
      storageKey,
      'Failed to clean up a personnel document object.',
    );
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
    const upload = await checkSignedPdfFile(formData.get('file'));
    if (upload.status === 'missing') {
      return amendmentError(
        'Sélectionnez un fichier PDF.',
        {
          file: 'Sélectionnez un fichier PDF.',
        },
        values,
      );
    }
    if (upload.status === 'too_large') {
      await recordRejectedSafe('invalid_file');
      return amendmentError(
        'Le fichier ne doit pas dépasser 10 Mo.',
        {
          file: 'Choisissez un fichier de 10 Mo maximum.',
        },
        values,
      );
    }
    if (upload.status === 'invalid') {
      await recordRejectedSafe('invalid_file');
      return amendmentError(
        'Seuls les fichiers PDF valides sont acceptés.',
        {
          file: 'Choisissez un fichier PDF valide.',
        },
        values,
      );
    }
    const { file, content } = upload;
    storageKey = await quarantineSignedPdf(content);
    await scanAndPromoteSignedPdf(storageKey);
    const fileMetadata = {
      idempotencyKey,
      employeeId,
      filename: sanitizeDocumentFilename(file.name, 'avenant-signe'),
      mediaType: 'application/pdf' as const,
      byteSize: file.size,
      checksum: signedPdfChecksum(content),
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
    const persistedStorageKey = storageKey;
    storageKey = null;
    if (result.idempotentReplay) {
      await discardSignedPdf(
        persistedStorageKey,
        'Failed to clean up a replayed personnel amendment object.',
      );
    }
    revalidateSalariesAfterCommit();
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
    await discardSignedPdf(
      storageKey,
      'Failed to clean up a personnel amendment object.',
    );
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

function revalidateSalariesAfterCommit() {
  try {
    revalidatePath('/equipe/salaries');
  } catch (error: unknown) {
    console.error('Failed to revalidate personnel documents.', error);
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
