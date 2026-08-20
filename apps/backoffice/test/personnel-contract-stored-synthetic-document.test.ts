import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));

import type { PersonnelDocumentExtractionSource } from '@yuta/db-cloud';
import type { PersonnelContractExtractionRequest } from '@yuta/contracts/personnel';
import type { PersonnelDocumentStorage } from '../src/server/personnel-documents/runtime';
import {
  createStoredSyntheticDocumentLoader,
  identifyApprovedStoredSyntheticFixture,
  StoredSyntheticFixtureExtractionAdapter,
  StoredSyntheticProviderQaExtractionAdapter,
  StoredSyntheticProviderQaGate,
} from '../src/server/personnel-contract-extraction/stored-synthetic-document';
import {
  type PreparedSyntheticContract,
  runSyntheticContractExtraction,
} from '../src/server/personnel-contract-extraction/service';
import { SyntheticContractPdfPreparer } from '../src/server/personnel-contract-extraction/service';

const approvedChecksum =
  '5b4fd463bc96874262109d279a1189a3b765ea17cb7214913bdfbbc39bec3a27';

describe('stored synthetic personnel contract source', () => {
  it('recognizes only the approved bounded fixture in development', () => {
    expect(
      identifyApprovedStoredSyntheticFixture(source(), 'development'),
    ).toEqual({
      fixtureId: 'wg2-digital-cdd-35h',
      sha256: approvedChecksum,
    });
    expect(
      identifyApprovedStoredSyntheticFixture(
        source({ checksum: 'a'.repeat(64) }),
        'development',
      ),
    ).toBeNull();
    expect(
      identifyApprovedStoredSyntheticFixture(source(), 'production'),
    ).toBeNull();
    expect(identifyApprovedStoredSyntheticFixture(source(), 'test')).toBeNull();
  });

  it('does not open storage for an unknown hash or a non-development runtime', () => {
    const storage = fakeStorage(new Uint8Array());

    expect(() =>
      createStoredSyntheticDocumentLoader(
        source({ checksum: 'b'.repeat(64) }),
        storage,
        'development',
      ),
    ).toThrow('not an approved development fixture');
    expect(() =>
      createStoredSyntheticDocumentLoader(source(), storage, 'production'),
    ).toThrow('not an approved development fixture');
    expect(storage.openAvailableObject).not.toHaveBeenCalled();
  });

  it('opens and returns the exact approved fixture for offline extraction', async () => {
    const bytes = new Uint8Array(
      await readFile(
        resolve(
          process.cwd(),
          'test/fixtures/personnel-contract-evaluation/v2/wg2-digital-cdd-35h.pdf',
        ),
      ),
    );
    const storage = fakeStorage(bytes);
    const loader = createStoredSyntheticDocumentLoader(
      source({ byteSize: bytes.byteLength }),
      storage,
      'development',
    );

    await expect(loader()).resolves.toEqual({
      source: 'stored_synthetic_document',
      bytes,
    });
    expect(storage.openAvailableObject).toHaveBeenCalledOnce();
  });

  it('rejects changed bytes after the allowlisted metadata check', async () => {
    const bytes = new TextEncoder().encode('%PDF-changed-fictional-content');
    const storage = fakeStorage(bytes);
    const loader = createStoredSyntheticDocumentLoader(
      source({ byteSize: bytes.byteLength }),
      storage,
      'development',
    );

    await expect(loader()).rejects.toThrow(
      'no longer matches the approved fixture',
    );
  });

  it('runs the stored fixture end to end with the offline adapter only', async () => {
    const bytes = new Uint8Array(
      await readFile(
        resolve(
          process.cwd(),
          'test/fixtures/personnel-contract-evaluation/v2/wg2-digital-cdd-35h.pdf',
        ),
      ),
    );
    const loader = createStoredSyntheticDocumentLoader(
      source({ byteSize: bytes.byteLength }),
      fakeStorage(bytes),
      'development',
    );
    const deterministic = new StoredSyntheticFixtureExtractionAdapter(
      () => new Date('2026-08-20T20:00:00.000Z'),
    );
    const adapter = {
      extract: vi.fn(
        (
          request: PersonnelContractExtractionRequest,
          document: PreparedSyntheticContract,
        ) => deterministic.extract(request, document),
      ),
    };

    const result = await runSyntheticContractExtraction(
      {
        requestId: '33333333-3333-4333-8333-333333333333',
        employeeId: '44444444-4444-4444-8444-444444444444',
        documentId: '11111111-1111-4111-8111-111111111111',
        documentVersion: 2,
        employeeRevision: 3,
        scenario: 'complete',
      },
      {
        authorizeAndResolve: vi.fn().mockResolvedValue({
          employeeRevision: 3,
          documentId: '11111111-1111-4111-8111-111111111111',
          documentVersion: 2,
        }),
        consumeRateLimit: vi.fn(),
        loadPdf: loader,
        preparer: new SyntheticContractPdfPreparer(),
        adapter,
      },
    );

    expect(result.status).toBe('complete');
    expect(result.suggestions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: 'position',
          candidateValue: 'Chef de rang',
        }),
        expect.objectContaining({
          field: 'contractWeeklyMinutes',
          candidateValue: 2_100,
        }),
      ]),
    );
    expect(adapter.extract).toHaveBeenCalledOnce();
    expect(adapter.extract.mock.calls[0]?.[1]).toMatchObject({
      source: 'stored_synthetic_document',
    });
  });

  it('allows exactly one provider QA for the exact stored fixture', async () => {
    const bytes = new Uint8Array(
      await readFile(
        resolve(
          process.cwd(),
          'test/fixtures/personnel-contract-evaluation/v2/wg2-digital-cdd-35h.pdf',
        ),
      ),
    );
    const provider = {
      extract: vi.fn().mockResolvedValue({ status: 'complete' }),
    };
    const gate = new StoredSyntheticProviderQaGate({
      NODE_ENV: 'development',
      YUTA_PERSONNEL_CONTRACT_STORED_PROVIDER_QA: 'approved-once',
    });
    const adapter = new StoredSyntheticProviderQaExtractionAdapter(
      provider,
      gate,
    );
    const request: PersonnelContractExtractionRequest = {
      requestId: '33333333-3333-4333-8333-333333333333',
      employeeId: '44444444-4444-4444-8444-444444444444',
      documentId: '11111111-1111-4111-8111-111111111111',
      documentVersion: 2,
      employeeRevision: 3,
      scenario: 'complete',
    };
    const document: PreparedSyntheticContract = {
      source: 'stored_synthetic_document',
      bytes,
      pageCount: 2,
      scenario: 'complete',
    };

    await expect(adapter.extract(request, document)).resolves.toEqual({
      status: 'complete',
    });
    await expect(adapter.extract(request, document)).rejects.toThrow(
      'already consumed',
    );
    expect(provider.extract).toHaveBeenCalledOnce();
    expect(provider.extract.mock.calls[0]?.[1]).toMatchObject({
      source: 'synthetic_upload',
    });
  });

  it('blocks provider QA before the adapter for missing approval or changed bytes', async () => {
    const provider = { extract: vi.fn() };
    const noApproval = new StoredSyntheticProviderQaExtractionAdapter(
      provider,
      new StoredSyntheticProviderQaGate({ NODE_ENV: 'development' }),
    );
    const request: PersonnelContractExtractionRequest = {
      requestId: '33333333-3333-4333-8333-333333333333',
      employeeId: '44444444-4444-4444-8444-444444444444',
      documentId: '11111111-1111-4111-8111-111111111111',
      documentVersion: 2,
      employeeRevision: 3,
      scenario: 'complete',
    };
    const changedDocument: PreparedSyntheticContract = {
      source: 'stored_synthetic_document',
      bytes: new TextEncoder().encode('%PDF-changed'),
      pageCount: 2,
      scenario: 'complete',
    };

    await expect(noApproval.extract(request, changedDocument)).rejects.toThrow(
      'fixture shape is not approved',
    );
    expect(provider.extract).not.toHaveBeenCalled();
  });
});

function source(
  overrides: Partial<PersonnelDocumentExtractionSource> = {},
): PersonnelDocumentExtractionSource {
  return {
    documentId: '11111111-1111-4111-8111-111111111111',
    documentVersion: 2,
    storageKey: '22222222-2222-4222-8222-222222222222',
    mediaType: 'application/pdf',
    byteSize: 3_000,
    checksum: approvedChecksum,
    ...overrides,
  };
}

function fakeStorage(bytes: Uint8Array): PersonnelDocumentStorage {
  return {
    putQuarantinedObject: vi.fn(),
    readQuarantinedObject: vi.fn(),
    promoteVerifiedObject: vi.fn(),
    openAvailableObject: vi.fn().mockResolvedValue(bytes),
    removeObject: vi.fn(),
  };
}
