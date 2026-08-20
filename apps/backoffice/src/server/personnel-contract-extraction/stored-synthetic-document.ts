import 'server-only';

import type { PersonnelDocumentExtractionSource } from '@yuta/db-cloud';
import type { PersonnelContractExtractionRequest } from '@yuta/contracts/personnel';
import { createHash } from 'node:crypto';

import type { PersonnelDocumentStorage } from '../personnel-documents/runtime';
import {
  type ContractExtractionAdapter,
  ContractExtractionServiceError,
  type ContractExtractionDependencies,
  type PreparedSyntheticContract,
} from './service';
import { MAX_DEVELOPMENT_SYNTHETIC_UPLOAD_BYTES } from './synthetic-upload';

const APPROVED_STORED_SYNTHETIC_FIXTURES = new Map([
  [
    '5b4fd463bc96874262109d279a1189a3b765ea17cb7214913bdfbbc39bec3a27',
    'wg2-digital-cdd-35h',
  ],
]);
const STORED_PROVIDER_QA_APPROVAL = 'approved-once';

export type StoredSyntheticProviderQaEnvironment = Readonly<{
  NODE_ENV?: string;
  YUTA_PERSONNEL_CONTRACT_STORED_PROVIDER_QA?: string;
}>;

type SyntheticPdfLoader = NonNullable<
  ContractExtractionDependencies['loadPdf']
>;

export function identifyApprovedStoredSyntheticFixture(
  source: PersonnelDocumentExtractionSource,
  environment = process.env.NODE_ENV,
): Readonly<{ fixtureId: string; sha256: string }> | null {
  if (environment !== 'development') return null;
  if (
    source.mediaType !== 'application/pdf' ||
    source.byteSize < 4 ||
    source.byteSize > MAX_DEVELOPMENT_SYNTHETIC_UPLOAD_BYTES
  ) {
    return null;
  }
  const fixtureId = APPROVED_STORED_SYNTHETIC_FIXTURES.get(source.checksum);
  return fixtureId ? { fixtureId, sha256: source.checksum } : null;
}

export function createStoredSyntheticDocumentLoader(
  source: PersonnelDocumentExtractionSource,
  storage: PersonnelDocumentStorage,
  environment = process.env.NODE_ENV,
): SyntheticPdfLoader {
  const fixture = identifyApprovedStoredSyntheticFixture(source, environment);
  if (!fixture) {
    throw unavailable(
      'The stored document is not an approved development fixture.',
    );
  }

  return async () => {
    let bytes: Uint8Array;
    try {
      bytes = await storage.openAvailableObject(source.storageKey);
    } catch {
      throw unavailable('The approved stored fixture is unavailable.');
    }
    const checksum = createHash('sha256').update(bytes).digest('hex');
    if (
      bytes.byteLength !== source.byteSize ||
      Buffer.from(bytes.subarray(0, 4)).toString('ascii') !== '%PDF' ||
      checksum !== fixture.sha256
    ) {
      throw unavailable(
        'The stored document no longer matches the approved fixture.',
      );
    }
    return { source: 'stored_synthetic_document', bytes };
  };
}

export class StoredSyntheticFixtureExtractionAdapter implements ContractExtractionAdapter {
  constructor(private readonly now: () => Date = () => new Date()) {}

  async extract(
    request: PersonnelContractExtractionRequest,
    document: PreparedSyntheticContract,
  ): Promise<unknown> {
    if (
      document.source !== 'stored_synthetic_document' ||
      document.scenario !== 'complete' ||
      document.pageCount !== 2
    ) {
      throw unavailable('The stored fixture shape is not approved.');
    }
    return {
      schemaVersion: 1,
      requestId: request.requestId,
      document: {
        id: request.documentId,
        version: request.documentVersion,
      },
      employeeRevision: request.employeeRevision,
      status: 'complete',
      pageCount: 2,
      suggestions: [
        {
          field: 'employmentTermType',
          candidateValue: 'fixed_term',
          confidence: 'high',
          sourcePage: 1,
          excerpt: 'Contrat à durée déterminée',
          issueCodes: ['blocked_by_dependency'],
        },
        {
          field: 'position',
          candidateValue: 'Chef de rang',
          confidence: 'high',
          sourcePage: 2,
          excerpt: 'Poste : Chef de rang',
          issueCodes: [],
        },
        {
          field: 'contractWeeklyMinutes',
          candidateValue: 2_100,
          confidence: 'high',
          sourcePage: 2,
          excerpt: '35 heures par semaine',
          issueCodes: [],
        },
      ],
      warnings: [],
      expiresAt: new Date(this.now().getTime() + 15 * 60 * 1_000).toISOString(),
    };
  }
}

export class StoredSyntheticProviderQaGate {
  private consumed = false;

  constructor(
    private readonly environment: StoredSyntheticProviderQaEnvironment = process.env,
  ) {}

  isEnabled(): boolean {
    return (
      this.environment.NODE_ENV === 'development' &&
      this.environment.YUTA_PERSONNEL_CONTRACT_STORED_PROVIDER_QA?.trim() ===
        STORED_PROVIDER_QA_APPROVAL &&
      !this.consumed
    );
  }

  consume(): void {
    if (!this.isEnabled()) {
      throw unavailable(
        'The one-time stored-fixture provider QA is not approved or was already consumed.',
      );
    }
    this.consumed = true;
  }
}

export class StoredSyntheticProviderQaExtractionAdapter implements ContractExtractionAdapter {
  constructor(
    private readonly providerAdapter: ContractExtractionAdapter,
    private readonly gate: StoredSyntheticProviderQaGate,
  ) {}

  async extract(
    request: PersonnelContractExtractionRequest,
    document: PreparedSyntheticContract,
  ): Promise<unknown> {
    const bytes = document.bytes;
    const checksum = bytes
      ? createHash('sha256').update(bytes).digest('hex')
      : null;
    if (
      document.source !== 'stored_synthetic_document' ||
      document.scenario !== 'complete' ||
      document.pageCount !== 2 ||
      !bytes ||
      !APPROVED_STORED_SYNTHETIC_FIXTURES.has(checksum ?? '')
    ) {
      throw unavailable(
        'The stored provider-QA fixture shape is not approved.',
      );
    }

    this.gate.consume();
    return this.providerAdapter.extract(request, {
      ...document,
      source: 'synthetic_upload',
    });
  }
}

function unavailable(message: string): ContractExtractionServiceError {
  return new ContractExtractionServiceError(message, 'PREPARATION_FAILED');
}
