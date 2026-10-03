import {
  createPersonnelContractAmendmentMetadataInputSchema,
  replacePersonnelContractAmendmentMetadataInputSchema,
  savePersonnelDocumentMetadataInputSchema,
} from '@yuta/contracts/personnel';
import { z } from 'zod';
import { nullableText } from './form-values';

// Browser command fields only: file metadata is derived on the server after
// the PDF has been checked, so it is validated later by the repository.
const documentUploadCommandSchema =
  savePersonnelDocumentMetadataInputSchema.pick({
    idempotencyKey: true,
    employeeId: true,
    expectedRevision: true,
  });

const amendmentUploadCommandSchema = z.discriminatedUnion('mode', [
  createPersonnelContractAmendmentMetadataInputSchema
    .pick({
      idempotencyKey: true,
      employeeId: true,
      effectiveDate: true,
      reference: true,
    })
    .extend({ mode: z.literal('create') }),
  replacePersonnelContractAmendmentMetadataInputSchema
    .pick({
      idempotencyKey: true,
      employeeId: true,
      amendmentId: true,
      expectedRevision: true,
    })
    .extend({ mode: z.literal('replace') }),
]);

export type AmendmentUploadCommand = z.infer<
  typeof amendmentUploadCommandSchema
>;

export function parseDocumentUploadCommand(formData: FormData) {
  return documentUploadCommandSchema.safeParse({
    idempotencyKey: formData.get('idempotencyKey'),
    employeeId: formData.get('employeeId'),
    expectedRevision: revisionValue(formData.get('expectedRevision')),
  });
}

export function parseAmendmentUploadCommand(formData: FormData) {
  const mode = formData.get('mode');
  const command = {
    idempotencyKey: formData.get('idempotencyKey'),
    employeeId: formData.get('employeeId'),
  };
  return amendmentUploadCommandSchema.safeParse(
    mode === 'replace'
      ? {
          mode,
          ...command,
          amendmentId: formData.get('amendmentId'),
          expectedRevision: revisionValue(formData.get('expectedRevision')),
        }
      : {
          mode,
          ...command,
          effectiveDate: formData.get('effectiveDate'),
          reference: nullableText(formData.get('reference')),
        },
  );
}

function revisionValue(value: FormDataEntryValue | null): number | null {
  const raw = String(value ?? '').trim();
  if (!raw) return null;
  return /^\d+$/u.test(raw) ? Number(raw) : Number.NaN;
}
