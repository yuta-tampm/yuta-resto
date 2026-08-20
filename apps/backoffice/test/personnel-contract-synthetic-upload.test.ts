import { describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));

import {
  createDevelopmentSyntheticPdfLoader,
  MAX_DEVELOPMENT_SYNTHETIC_UPLOAD_BYTES,
  SYNTHETIC_UPLOAD_ATTESTATION,
} from '../src/server/personnel-contract-extraction/synthetic-upload';

function formData(file: File, attested = true): FormData {
  const data = new FormData();
  data.set('syntheticPdf', file);
  if (attested) {
    data.set('syntheticAttestation', SYNTHETIC_UPLOAD_ATTESTATION);
  }
  return data;
}

describe('development synthetic PDF upload', () => {
  it('keeps the generated fixture path when no upload was supplied', () => {
    expect(createDevelopmentSyntheticPdfLoader(undefined, 'complete')).toBe(
      undefined,
    );
  });

  it('accepts an attested bounded fictional PDF for the complete scenario', async () => {
    const file = new File(['%PDF-1.4\nfictional'], 'fictional-contract.pdf', {
      type: 'application/pdf',
    });
    const loader = createDevelopmentSyntheticPdfLoader(
      formData(file),
      'complete',
    );

    await expect(loader?.()).resolves.toMatchObject({
      source: 'synthetic_upload',
    });
  });

  it('rejects missing attestation, non-complete scenarios, and invalid PDF content', async () => {
    const file = new File(['not-a-pdf'], 'fictional-contract.pdf', {
      type: 'application/pdf',
    });

    expect(() =>
      createDevelopmentSyntheticPdfLoader(formData(file, false), 'complete'),
    ).toThrow('attestation');
    expect(() =>
      createDevelopmentSyntheticPdfLoader(formData(file), 'partial'),
    ).toThrow('complete scenario');

    const loader = createDevelopmentSyntheticPdfLoader(
      formData(file),
      'complete',
    );
    await expect(loader?.()).rejects.toThrow('not a valid PDF');
  });

  it('rejects non-PDF metadata and uploads above the local limit', () => {
    const textFile = new File(['%PDF'], 'fictional-contract.txt', {
      type: 'text/plain',
    });
    const oversized = new File(
      [new Uint8Array(MAX_DEVELOPMENT_SYNTHETIC_UPLOAD_BYTES + 1)],
      'fictional-contract.pdf',
      { type: 'application/pdf' },
    );

    expect(() =>
      createDevelopmentSyntheticPdfLoader(formData(textFile), 'complete'),
    ).toThrow('metadata');
    expect(() =>
      createDevelopmentSyntheticPdfLoader(formData(oversized), 'complete'),
    ).toThrow('metadata');
  });
});
