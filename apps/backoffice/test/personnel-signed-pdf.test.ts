import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => {
  const calls: string[] = [];
  return {
    calls,
    runtime: {
      storage: {
        putQuarantinedObject: vi.fn(async () => {
          calls.push('put');
          return 'storage-key';
        }),
        readQuarantinedObject: vi.fn(async () => {
          calls.push('read');
          return new Uint8Array([1]);
        }),
        promoteVerifiedObject: vi.fn(async () => {
          calls.push('promote');
        }),
        removeObject: vi.fn(async () => {
          calls.push('remove');
        }),
      },
      scanner: {
        inspectQuarantinedObject: vi.fn(async () => {
          calls.push('scan');
        }),
      },
    },
  };
});

vi.mock('server-only', () => ({}));
vi.mock('../src/server/personnel-documents/runtime', () => ({
  getPersonnelDocumentRuntime: async () => mocks.runtime,
}));

import {
  checkSignedPdfFile,
  discardSignedPdf,
  quarantineSignedPdf,
  scanAndPromoteSignedPdf,
  signedPdfChecksum,
} from '../src/server/personnel-documents/signed-pdf';

const pdfBytes = new TextEncoder().encode('%PDF-1.7 synthetic');

describe('checkSignedPdfFile', () => {
  it('reports a missing or empty file', async () => {
    expect(await checkSignedPdfFile(null)).toEqual({ status: 'missing' });
    expect(await checkSignedPdfFile('text')).toEqual({ status: 'missing' });
    expect(
      await checkSignedPdfFile(
        new File([], 'empty.pdf', { type: 'application/pdf' }),
      ),
    ).toEqual({ status: 'missing' });
  });

  it('rejects files larger than 10 MB before reading them', async () => {
    const file = new File([new Uint8Array(10 * 1024 * 1024 + 1)], 'big.pdf', {
      type: 'application/pdf',
    });
    expect(await checkSignedPdfFile(file)).toEqual({ status: 'too_large' });
  });

  it('requires the PDF media type and PDF signature', async () => {
    expect(
      await checkSignedPdfFile(
        new File([pdfBytes], 'contract.txt', { type: 'text/plain' }),
      ),
    ).toEqual({ status: 'invalid' });
    expect(
      await checkSignedPdfFile(
        new File(['not a pdf'], 'contract.pdf', { type: 'application/pdf' }),
      ),
    ).toEqual({ status: 'invalid' });
  });

  it('returns the file and its content when valid', async () => {
    const file = new File([pdfBytes], 'contract.pdf', {
      type: 'application/pdf',
    });
    const result = await checkSignedPdfFile(file);
    expect(result.status).toBe('valid');
    if (result.status === 'valid') {
      expect(result.file).toBe(file);
      expect(result.content).toEqual(pdfBytes);
    }
  });
});

describe('signed PDF storage', () => {
  beforeEach(() => {
    mocks.calls.length = 0;
    vi.clearAllMocks();
  });

  it('computes a SHA-256 hex checksum', () => {
    expect(signedPdfChecksum(new TextEncoder().encode('abc'))).toBe(
      'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
    );
  });

  it('quarantines, scans and only then promotes the object', async () => {
    const storageKey = await quarantineSignedPdf(pdfBytes);
    await scanAndPromoteSignedPdf(storageKey);
    expect(storageKey).toBe('storage-key');
    expect(mocks.calls).toEqual(['put', 'read', 'scan', 'promote']);
  });

  it('does not promote an object rejected by the scanner', async () => {
    mocks.runtime.scanner.inspectQuarantinedObject.mockRejectedValueOnce(
      new Error('rejected'),
    );
    await expect(scanAndPromoteSignedPdf('storage-key')).rejects.toThrow(
      'rejected',
    );
    expect(mocks.runtime.storage.promoteVerifiedObject).not.toHaveBeenCalled();
  });

  it('discards stored objects and only logs cleanup failures', async () => {
    await discardSignedPdf(null, 'unused');
    expect(mocks.runtime.storage.removeObject).not.toHaveBeenCalled();

    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    mocks.runtime.storage.removeObject.mockRejectedValueOnce(new Error('disk'));
    await expect(
      discardSignedPdf('storage-key', 'Failed to clean up.'),
    ).resolves.toBeUndefined();
    expect(consoleError).toHaveBeenCalledWith('Failed to clean up.');
    consoleError.mockRestore();
  });
});
