import { randomUUID } from 'node:crypto';
import type { TenantContext } from '@yuta/tenant';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  tenant: null as TenantContext | null,
  saveDocument: vi.fn(),
  recordDocumentRejected: vi.fn(),
  createAmendment: vi.fn(),
  replaceAmendment: vi.fn(),
  recordAmendmentRejected: vi.fn(),
  revalidatePath: vi.fn(),
  quarantine: vi.fn(),
  scanAndPromote: vi.fn(),
  discard: vi.fn(),
  RepositoryError: class RepositoryError extends Error {
    constructor(
      message: string,
      readonly code: string,
    ) {
      super(message);
    }
  },
  ScannerError: class ScannerError extends Error {},
}));

vi.mock('server-only', () => ({}));
vi.mock('@yuta/db-cloud', () => ({
  listPersonnelDocuments: vi.fn(),
  PersonnelDocumentRepositoryError: mocks.RepositoryError,
  recordPersonnelDocumentUploadRejected: mocks.recordDocumentRejected,
  savePersonnelDocumentMetadata: mocks.saveDocument,
  createPersonnelContractAmendmentMetadata: mocks.createAmendment,
  listPersonnelContractAmendments: vi.fn(),
  PersonnelContractAmendmentRepositoryError: mocks.RepositoryError,
  recordPersonnelContractAmendmentUploadRejected: mocks.recordAmendmentRejected,
  replacePersonnelContractAmendmentMetadata: mocks.replaceAmendment,
}));
vi.mock('next/cache', () => ({ revalidatePath: mocks.revalidatePath }));
vi.mock('../src/server/cloud-database', () => ({
  cloudDatabase: { kind: 'test-cloud-database' },
}));
vi.mock('../src/server/auth/session', () => ({
  requirePersonnelTenant: vi.fn(async () => ({ tenant: mocks.tenant })),
}));
vi.mock('../src/server/personnel-documents/runtime', () => ({
  PersonnelDocumentScannerError: mocks.ScannerError,
}));
vi.mock('../src/server/personnel-documents/signed-pdf', () => ({
  checkSignedPdfFile: vi.fn(async (value: unknown) =>
    value instanceof File
      ? {
          status: 'valid',
          file: value,
          content: new Uint8Array(await value.arrayBuffer()),
        }
      : { status: 'missing' },
  ),
  quarantineSignedPdf: mocks.quarantine,
  scanAndPromoteSignedPdf: mocks.scanAndPromote,
  discardSignedPdf: mocks.discard,
  signedPdfChecksum: vi.fn(() => 'a'.repeat(64)),
}));

import {
  saveEmployeeAmendmentAction,
  saveEmployeeDocumentAction,
  type SaveEmployeeAmendmentActionState,
  type SaveEmployeeDocumentActionState,
} from '../src/app/(authenticated)/equipe/salaries/document-actions';

const storageKey = 'personnel/quarantine/new-object';
const employeeId = '11111111-1111-4111-8111-111111111111';
const amendmentId = '22222222-2222-4222-8222-222222222222';
const document = { id: randomUUID(), revision: 1 };
const amendment = { id: amendmentId, revision: 2 };

const initialDocumentState: SaveEmployeeDocumentActionState = {
  status: 'idle',
  message: null,
  document: null,
};
const initialAmendmentState: SaveEmployeeAmendmentActionState = {
  status: 'idle',
  message: null,
  fieldErrors: {},
  amendment: null,
  values: { effectiveDate: '', reference: '' },
};

function context(): TenantContext {
  return {
    organizationId: randomUUID(),
    establishmentId: randomUUID(),
    actor: {
      type: 'user',
      userId: randomUUID(),
      membershipId: randomUUID(),
      role: 'OWNER',
    },
    locale: 'fr-FR',
    timezone: 'Europe/Paris',
    entitlements: new Set(),
  };
}

beforeEach(() => {
  mocks.tenant = context();
  for (const mock of [
    mocks.saveDocument,
    mocks.recordDocumentRejected,
    mocks.createAmendment,
    mocks.replaceAmendment,
    mocks.recordAmendmentRejected,
    mocks.revalidatePath,
    mocks.quarantine,
    mocks.scanAndPromote,
    mocks.discard,
  ]) {
    mock.mockReset();
  }
  mocks.quarantine.mockResolvedValue(storageKey);
  mocks.scanAndPromote.mockResolvedValue(undefined);
  mocks.discard.mockResolvedValue(undefined);
  mocks.saveDocument.mockResolvedValue({ document, idempotentReplay: false });
  mocks.createAmendment.mockResolvedValue({
    amendment,
    idempotentReplay: false,
  });
  mocks.replaceAmendment.mockResolvedValue({
    amendment,
    idempotentReplay: false,
  });
  const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
  return () => consoleError.mockRestore();
});

describe('signed contract upload after commit', () => {
  it('keeps the committed PDF and success when cache invalidation fails', async () => {
    mocks.revalidatePath.mockImplementation(() => {
      throw new Error('Cache invalidation failed.');
    });

    const result = await saveEmployeeDocumentAction(
      initialDocumentState,
      documentFormData(),
    );

    expect(result).toMatchObject({ status: 'success', document });
    expect(mocks.saveDocument).toHaveBeenCalledOnce();
    expect(mocks.saveDocument.mock.calls[0]?.[2]).toMatchObject({
      storageKey,
    });
    expect(mocks.discard).not.toHaveBeenCalled();
    expect(mocks.recordDocumentRejected).not.toHaveBeenCalled();
  });

  it('discards only the unreferenced retry copy on an idempotent replay', async () => {
    mocks.saveDocument.mockResolvedValue({ document, idempotentReplay: true });
    mocks.revalidatePath.mockImplementation(() => {
      throw new Error('Cache invalidation failed.');
    });

    const result = await saveEmployeeDocumentAction(
      initialDocumentState,
      documentFormData(),
    );

    expect(result).toMatchObject({
      status: 'success',
      message: 'Ce fichier avait déjà été enregistré.',
    });
    expect(mocks.discard).toHaveBeenCalledOnce();
    expect(mocks.discard).toHaveBeenCalledWith(storageKey, expect.any(String));
    expect(mocks.recordDocumentRejected).not.toHaveBeenCalled();
  });

  it('still cleans the temporary object when the scanner rejects it', async () => {
    mocks.scanAndPromote.mockRejectedValue(new mocks.ScannerError('Rejected.'));

    const result = await saveEmployeeDocumentAction(
      initialDocumentState,
      documentFormData(),
    );

    expect(result.status).toBe('error');
    expect(mocks.saveDocument).not.toHaveBeenCalled();
    expect(mocks.discard).toHaveBeenCalledWith(storageKey, expect.any(String));
    expect(mocks.recordDocumentRejected).toHaveBeenCalledWith(
      { kind: 'test-cloud-database' },
      mocks.tenant,
      employeeId,
      'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
      'scanner_rejected',
    );
  });

  it('still cleans the temporary object when persistence fails', async () => {
    mocks.saveDocument.mockRejectedValue(new Error('Database unavailable.'));

    const result = await saveEmployeeDocumentAction(
      initialDocumentState,
      documentFormData(),
    );

    expect(result.status).toBe('error');
    expect(mocks.discard).toHaveBeenCalledWith(storageKey, expect.any(String));
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });
});

describe('signed amendment upload after commit', () => {
  it('keeps a created amendment PDF when cache invalidation fails', async () => {
    mocks.revalidatePath.mockImplementation(() => {
      throw new Error('Cache invalidation failed.');
    });

    const result = await saveEmployeeAmendmentAction(
      initialAmendmentState,
      amendmentFormData('create'),
    );

    expect(result).toMatchObject({ status: 'success', amendment });
    expect(mocks.createAmendment.mock.calls[0]?.[2]).toMatchObject({
      storageKey,
      effectiveDate: '2026-09-01',
    });
    expect(mocks.discard).not.toHaveBeenCalled();
    expect(mocks.recordAmendmentRejected).not.toHaveBeenCalled();
  });

  it('keeps a replacement PDF when cache invalidation fails', async () => {
    mocks.revalidatePath.mockImplementation(() => {
      throw new Error('Cache invalidation failed.');
    });

    const result = await saveEmployeeAmendmentAction(
      initialAmendmentState,
      amendmentFormData('replace'),
    );

    expect(result).toMatchObject({
      status: 'success',
      message: 'Le fichier de cet avenant a été vérifié et remplacé.',
    });
    expect(mocks.replaceAmendment.mock.calls[0]?.[2]).toMatchObject({
      amendmentId,
      expectedRevision: 2,
      storageKey,
    });
    expect(mocks.discard).not.toHaveBeenCalled();
  });

  it('discards only the retry copy on a replayed replacement', async () => {
    mocks.replaceAmendment.mockResolvedValue({
      amendment,
      idempotentReplay: true,
    });

    const result = await saveEmployeeAmendmentAction(
      initialAmendmentState,
      amendmentFormData('replace'),
    );

    expect(result).toMatchObject({
      status: 'success',
      message: 'Cet avenant avait déjà été enregistré.',
    });
    expect(mocks.discard).toHaveBeenCalledOnce();
    expect(mocks.discard).toHaveBeenCalledWith(storageKey, expect.any(String));
  });

  it('still cleans the temporary object on a stale replacement', async () => {
    mocks.replaceAmendment.mockRejectedValue(
      new mocks.RepositoryError('Stale.', 'CONFLICT'),
    );

    const result = await saveEmployeeAmendmentAction(
      initialAmendmentState,
      amendmentFormData('replace'),
    );

    expect(result.status).toBe('conflict');
    expect(mocks.discard).toHaveBeenCalledWith(storageKey, expect.any(String));
  });
});

function pdfFile(): File {
  return new File(['%PDF-1.7 synthetic'], 'contrat.pdf', {
    type: 'application/pdf',
  });
}

function documentFormData(): FormData {
  const formData = new FormData();
  formData.set('employeeId', employeeId);
  formData.set('idempotencyKey', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa');
  formData.set('file', pdfFile());
  return formData;
}

function amendmentFormData(mode: 'create' | 'replace'): FormData {
  const formData = new FormData();
  formData.set('employeeId', employeeId);
  formData.set('idempotencyKey', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb');
  formData.set('mode', mode);
  if (mode === 'replace') {
    formData.set('amendmentId', amendmentId);
    formData.set('expectedRevision', '2');
  } else {
    formData.set('effectiveDate', '2026-09-01');
    formData.set('reference', 'AV-1');
  }
  formData.set('file', pdfFile());
  return formData;
}
