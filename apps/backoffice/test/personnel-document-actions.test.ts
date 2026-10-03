import { randomUUID } from 'node:crypto';
import type { TenantContext } from '@yuta/tenant';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

const mocks = vi.hoisted(() => ({
  tenant: null as TenantContext | null,
  saveDocument: vi.fn(),
  recordDocumentRejected: vi.fn(),
  createAmendment: vi.fn(),
  replaceAmendment: vi.fn(),
  recordAmendmentRejected: vi.fn(),
  revalidatePath: vi.fn(),
  checkFile: vi.fn(),
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
  checkSignedPdfFile: mocks.checkFile,
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
    mocks.checkFile,
    mocks.quarantine,
    mocks.scanAndPromote,
    mocks.discard,
  ]) {
    mock.mockReset();
  }
  mocks.checkFile.mockImplementation(async (value: unknown) =>
    value instanceof File
      ? {
          status: 'valid',
          file: value,
          content: new Uint8Array(await value.arrayBuffer()),
        }
      : { status: 'missing' },
  );
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

function expectNoUploadSideEffects() {
  expect(mocks.checkFile).not.toHaveBeenCalled();
  expect(mocks.quarantine).not.toHaveBeenCalled();
  expect(mocks.scanAndPromote).not.toHaveBeenCalled();
  expect(mocks.discard).not.toHaveBeenCalled();
  expect(mocks.saveDocument).not.toHaveBeenCalled();
  expect(mocks.createAmendment).not.toHaveBeenCalled();
  expect(mocks.replaceAmendment).not.toHaveBeenCalled();
  expect(mocks.recordDocumentRejected).not.toHaveBeenCalled();
  expect(mocks.recordAmendmentRejected).not.toHaveBeenCalled();
  expect(mocks.revalidatePath).not.toHaveBeenCalled();
}

describe('signed contract upload command boundary', () => {
  it.each([
    ['employeeId', 'not-a-uuid'],
    ['employeeId', null],
    ['idempotencyKey', 'not-a-uuid'],
    ['idempotencyKey', null],
    ['expectedRevision', '0'],
    ['expectedRevision', '-1'],
    ['expectedRevision', '1.5'],
    ['expectedRevision', 'abc'],
  ])(
    'rejects %s=%s before reading the file or recording a rejection',
    async (field, value) => {
      const result = await saveEmployeeDocumentAction(
        initialDocumentState,
        withFields(documentFormData(), { [field]: value }),
      );

      expect(result).toEqual({
        status: 'error',
        message:
          'Le formulaire n’est plus à jour. Rechargez la liste avant de réessayer.',
        document: null,
      });
      expectNoUploadSideEffects();
    },
  );

  it('passes a validated replacement revision to the repository', async () => {
    await saveEmployeeDocumentAction(
      initialDocumentState,
      withFields(documentFormData(), { expectedRevision: ' 4 ' }),
    );

    expect(mocks.saveDocument.mock.calls[0]?.[2]).toMatchObject({
      employeeId,
      idempotencyKey: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
      expectedRevision: 4,
    });
  });

  it.each([
    ['too_large', 'Le fichier ne doit pas dépasser 10 Mo.'],
    ['invalid', 'Seuls les fichiers PDF valides sont acceptés.'],
  ])(
    'records a legitimate %s file rejection in the trusted scope',
    async (status, message) => {
      mocks.checkFile.mockResolvedValue({ status });

      const result = await saveEmployeeDocumentAction(
        initialDocumentState,
        documentFormData(),
      );

      expect(result).toEqual({ status: 'error', message, document: null });
      expect(mocks.quarantine).not.toHaveBeenCalled();
      expect(mocks.recordDocumentRejected).toHaveBeenCalledWith(
        { kind: 'test-cloud-database' },
        mocks.tenant,
        employeeId,
        'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
        'invalid_file',
      );
    },
  );

  it('does not record a missing file as a rejected upload', async () => {
    const formData = documentFormData();
    formData.delete('file');

    const result = await saveEmployeeDocumentAction(
      initialDocumentState,
      formData,
    );

    expect(result.message).toBe('Sélectionnez un fichier PDF.');
    expect(mocks.recordDocumentRejected).not.toHaveBeenCalled();
    expect(mocks.quarantine).not.toHaveBeenCalled();
  });

  it('keeps invalid server-derived file metadata as an invalid file', async () => {
    mocks.saveDocument.mockRejectedValue(fileMetadataError());

    const result = await saveEmployeeDocumentAction(
      initialDocumentState,
      documentFormData(),
    );

    expect(result).toEqual({
      status: 'error',
      message: 'Vérifiez le fichier puis réessayez.',
      document: null,
    });
    expect(mocks.discard).toHaveBeenCalledWith(storageKey, expect.any(String));
    expect(mocks.recordDocumentRejected).toHaveBeenCalledWith(
      { kind: 'test-cloud-database' },
      mocks.tenant,
      employeeId,
      'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
      'invalid_file',
    );
  });

  it('records a storage failure and allows a retry with the same command', async () => {
    mocks.quarantine
      .mockRejectedValueOnce(new Error('Storage unavailable.'))
      .mockResolvedValueOnce(storageKey);
    const formData = documentFormData();

    const failed = await saveEmployeeDocumentAction(
      initialDocumentState,
      formData,
    );
    const retried = await saveEmployeeDocumentAction(failed, formData);

    expect(failed.status).toBe('error');
    expect(mocks.recordDocumentRejected).toHaveBeenCalledWith(
      { kind: 'test-cloud-database' },
      mocks.tenant,
      employeeId,
      'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
      'storage_failure',
    );
    expect(retried).toMatchObject({ status: 'success', document });
    expect(mocks.saveDocument).toHaveBeenCalledOnce();
  });
});

describe('signed amendment upload command boundary', () => {
  it.each([
    [
      'create',
      { effectiveDate: 'not-a-date' },
      { effectiveDate: 'Indiquez une date d’effet valide.' },
    ],
    [
      'create',
      { effectiveDate: null },
      { effectiveDate: 'Indiquez une date d’effet valide.' },
    ],
    [
      'create',
      { reference: 'R'.repeat(81) },
      { reference: 'La référence doit contenir 80 caractères maximum.' },
    ],
    [
      'create',
      { employeeId: 'not-a-uuid' },
      { employeeId: 'Vérifiez cette valeur.' },
    ],
    [
      'replace',
      { amendmentId: null },
      { amendmentId: 'Vérifiez cette valeur.' },
    ],
    [
      'replace',
      { expectedRevision: '0' },
      { expectedRevision: 'Vérifiez cette valeur.' },
    ],
    [
      'replace',
      { expectedRevision: null },
      { expectedRevision: 'Vérifiez cette valeur.' },
    ],
    [
      'replace',
      { idempotencyKey: 'retry' },
      { idempotencyKey: 'Vérifiez cette valeur.' },
    ],
  ] as const)(
    'rejects an invalid %s command %j without side effects',
    async (mode, fields, fieldErrors) => {
      const formData = withFields(amendmentFormData(mode), fields);

      const result = await saveEmployeeAmendmentAction(
        initialAmendmentState,
        formData,
      );

      expect(result).toEqual({
        status: 'error',
        message: 'Certains champs doivent être corrigés.',
        fieldErrors,
        amendment: null,
        values: {
          effectiveDate: String(formData.get('effectiveDate') ?? ''),
          reference: String(formData.get('reference') ?? ''),
        },
      });
      expectNoUploadSideEffects();
    },
  );

  it.each([null, 'delete', 'REPLACE'])(
    'rejects the unsupported mode %s instead of falling back to create',
    async (mode) => {
      const result = await saveEmployeeAmendmentAction(
        initialAmendmentState,
        withFields(amendmentFormData('create'), { mode }),
      );

      expect(result).toMatchObject({
        status: 'error',
        message: 'Certains champs doivent être corrigés.',
        fieldErrors: { mode: 'Vérifiez cette valeur.' },
      });
      expectNoUploadSideEffects();
    },
  );

  it('creates with only create command fields, ignoring stray replace fields', async () => {
    await saveEmployeeAmendmentAction(
      initialAmendmentState,
      withFields(amendmentFormData('create'), {
        amendmentId,
        expectedRevision: '2',
      }),
    );

    expect(mocks.replaceAmendment).not.toHaveBeenCalled();
    expect(mocks.createAmendment.mock.calls[0]?.[2]).toEqual({
      idempotencyKey: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
      employeeId,
      effectiveDate: '2026-09-01',
      reference: 'AV-1',
      filename: 'contrat.pdf',
      mediaType: 'application/pdf',
      byteSize: pdfFile().size,
      checksum: 'a'.repeat(64),
      storageKey,
    });
  });

  it('stores an empty reference as null', async () => {
    await saveEmployeeAmendmentAction(
      initialAmendmentState,
      withFields(amendmentFormData('create'), { reference: '   ' }),
    );

    expect(mocks.createAmendment.mock.calls[0]?.[2]).toMatchObject({
      reference: null,
    });
  });

  it('replaces with only replace command fields, ignoring stray create fields', async () => {
    await saveEmployeeAmendmentAction(
      initialAmendmentState,
      withFields(amendmentFormData('replace'), {
        effectiveDate: '2026-09-01',
        reference: 'AV-1',
      }),
    );

    expect(mocks.createAmendment).not.toHaveBeenCalled();
    expect(mocks.replaceAmendment.mock.calls[0]?.[2]).toEqual({
      idempotencyKey: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
      employeeId,
      amendmentId,
      expectedRevision: 2,
      filename: 'contrat.pdf',
      mediaType: 'application/pdf',
      byteSize: pdfFile().size,
      checksum: 'a'.repeat(64),
      storageKey,
    });
  });

  it('discards only the retry copy on a replayed creation', async () => {
    mocks.createAmendment.mockResolvedValue({
      amendment,
      idempotentReplay: true,
    });

    const result = await saveEmployeeAmendmentAction(
      initialAmendmentState,
      amendmentFormData('create'),
    );

    expect(result).toMatchObject({
      status: 'success',
      message: 'Cet avenant avait déjà été enregistré.',
    });
    expect(mocks.discard).toHaveBeenCalledOnce();
    expect(mocks.discard).toHaveBeenCalledWith(storageKey, expect.any(String));
  });

  it('records a scanner rejection for the replaced amendment only', async () => {
    mocks.scanAndPromote.mockRejectedValue(new mocks.ScannerError('Rejected.'));

    const result = await saveEmployeeAmendmentAction(
      initialAmendmentState,
      amendmentFormData('replace'),
    );

    expect(result).toMatchObject({
      status: 'error',
      message: 'Le fichier n’a pas été accepté par le contrôle de sécurité.',
    });
    expect(mocks.discard).toHaveBeenCalledWith(storageKey, expect.any(String));
    expect(mocks.recordAmendmentRejected).toHaveBeenCalledWith(
      { kind: 'test-cloud-database' },
      mocks.tenant,
      employeeId,
      'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
      'scanner_rejected',
      amendmentId,
    );
  });

  it('records a legitimate invalid file without an amendment for creation', async () => {
    mocks.checkFile.mockResolvedValue({ status: 'too_large' });

    const result = await saveEmployeeAmendmentAction(
      initialAmendmentState,
      amendmentFormData('create'),
    );

    expect(result).toMatchObject({
      status: 'error',
      fieldErrors: { file: 'Choisissez un fichier de 10 Mo maximum.' },
      values: { effectiveDate: '2026-09-01', reference: 'AV-1' },
    });
    expect(mocks.quarantine).not.toHaveBeenCalled();
    expect(mocks.recordAmendmentRejected).toHaveBeenCalledWith(
      { kind: 'test-cloud-database' },
      mocks.tenant,
      employeeId,
      'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
      'invalid_file',
      undefined,
    );
  });

  it('keeps invalid server-derived file metadata as an invalid file', async () => {
    mocks.createAmendment.mockRejectedValue(fileMetadataError());

    const result = await saveEmployeeAmendmentAction(
      initialAmendmentState,
      amendmentFormData('create'),
    );

    expect(result).toMatchObject({
      status: 'error',
      message: 'Certains champs doivent être corrigés.',
      fieldErrors: { filename: 'Vérifiez cette valeur.' },
    });
    expect(mocks.discard).toHaveBeenCalledWith(storageKey, expect.any(String));
    expect(mocks.recordAmendmentRejected).toHaveBeenCalledWith(
      { kind: 'test-cloud-database' },
      mocks.tenant,
      employeeId,
      'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
      'invalid_file',
      undefined,
    );
  });

  it('records a storage failure, cleans up, and preserves the safe values', async () => {
    mocks.createAmendment.mockRejectedValue(new Error('Database unavailable.'));

    const result = await saveEmployeeAmendmentAction(
      initialAmendmentState,
      amendmentFormData('create'),
    );

    expect(result).toEqual({
      status: 'error',
      message: 'Impossible d’enregistrer l’avenant pour le moment. Réessayez.',
      fieldErrors: {},
      amendment: null,
      values: { effectiveDate: '2026-09-01', reference: 'AV-1' },
    });
    expect(mocks.discard).toHaveBeenCalledWith(storageKey, expect.any(String));
    expect(mocks.recordAmendmentRejected).toHaveBeenCalledWith(
      { kind: 'test-cloud-database' },
      mocks.tenant,
      employeeId,
      'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
      'storage_failure',
      undefined,
    );
  });
});

function fileMetadataError(): z.ZodError {
  return new z.ZodError([
    {
      code: z.ZodIssueCode.custom,
      path: ['filename'],
      message: 'Invalid filename.',
    },
  ]);
}

function withFields(
  formData: FormData,
  fields: Readonly<Record<string, string | null>>,
): FormData {
  for (const [name, value] of Object.entries(fields)) {
    if (value === null) formData.delete(name);
    else formData.set(name, value);
  }
  return formData;
}

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
