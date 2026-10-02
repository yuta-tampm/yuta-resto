import 'server-only';

import type { PersonnelContractExtractionScenario } from '@yuta/contracts/personnel';

import {
  ContractExtractionServiceError,
  type ContractExtractionDependencies,
} from './service';

export const MAX_DEVELOPMENT_SYNTHETIC_UPLOAD_BYTES = 750 * 1024;
export const SYNTHETIC_UPLOAD_ATTESTATION = 'fictional-only';

type SyntheticPdfLoader = NonNullable<
  ContractExtractionDependencies['loadPdf']
>;

export function createDevelopmentSyntheticPdfLoader(
  formData: FormData | undefined,
  scenario: PersonnelContractExtractionScenario,
): SyntheticPdfLoader | undefined {
  if (!formData) return undefined;

  if (scenario !== 'complete') {
    throw invalidUpload(
      'An uploaded synthetic PDF is supported only by the complete scenario.',
    );
  }
  if (formData.get('syntheticAttestation') !== SYNTHETIC_UPLOAD_ATTESTATION) {
    throw invalidUpload('The fictional-data attestation is required.');
  }

  const entry = formData.get('syntheticPdf');
  if (!(entry instanceof File)) {
    throw invalidUpload('A synthetic PDF file is required.');
  }
  const normalizedName = entry.name.trim().toLowerCase();
  if (
    entry.name.length > 160 ||
    !normalizedName.endsWith('.pdf') ||
    entry.type !== 'application/pdf' ||
    entry.size < 4 ||
    entry.size > MAX_DEVELOPMENT_SYNTHETIC_UPLOAD_BYTES
  ) {
    throw invalidUpload('The synthetic PDF metadata is outside the limits.');
  }

  return async () => {
    const bytes = new Uint8Array(await entry.arrayBuffer());
    if (
      bytes.byteLength !== entry.size ||
      Buffer.from(bytes.subarray(0, 4)).toString('ascii') !== '%PDF'
    ) {
      throw invalidUpload('The selected file is not a valid PDF.');
    }
    return { source: 'synthetic_upload', bytes };
  };
}

function invalidUpload(message: string): ContractExtractionServiceError {
  return new ContractExtractionServiceError(message, 'PREPARATION_FAILED');
}
