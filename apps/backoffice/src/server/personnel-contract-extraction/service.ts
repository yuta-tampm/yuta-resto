import 'server-only';

import {
  personnelContractExtractionRequestSchema,
  personnelContractExtractionReviewResultSchema,
  type PersonnelContractExtractionRequest,
  type PersonnelContractExtractionReviewResult,
} from '@yuta/contracts/personnel';
import { PDFDocument, StandardFonts } from 'pdf-lib';

export type PreparedSyntheticContract = Readonly<{
  source: 'synthetic_fixture';
  pageCount: number;
  scenario: PersonnelContractExtractionRequest['scenario'];
  bytes?: Uint8Array;
}>;

export type ResolvedContractExtractionTarget = Readonly<{
  employeeRevision: number;
  documentId: string;
  documentVersion: number;
}>;

export interface ContractPdfPreparer {
  prepare(
    bytes: Uint8Array,
    scenario: PersonnelContractExtractionRequest['scenario'],
  ): Promise<PreparedSyntheticContract>;
}

export interface ContractExtractionAdapter {
  extract(
    request: PersonnelContractExtractionRequest,
    document: PreparedSyntheticContract,
  ): Promise<unknown>;
}

export type ContractExtractionDependencies = Readonly<{
  authorizeAndResolve(
    request: PersonnelContractExtractionRequest,
  ): Promise<ResolvedContractExtractionTarget>;
  consumeRateLimit(): void;
  preparer: ContractPdfPreparer;
  adapter: ContractExtractionAdapter;
  timeoutMilliseconds?: number;
  now?: () => Date;
}>;

export class ContractExtractionServiceError extends Error {
  constructor(
    message: string,
    readonly code:
      | 'DOCUMENT_STALE'
      | 'EMPLOYEE_CONFLICT'
      | 'RATE_LIMITED'
      | 'PREPARATION_FAILED'
      | 'INVALID_RESULT'
      | 'TIMEOUT'
      | 'SERVICE_FAILURE',
  ) {
    super(message);
    this.name = 'ContractExtractionServiceError';
  }
}

export async function runSyntheticContractExtraction(
  rawRequest: PersonnelContractExtractionRequest,
  dependencies: ContractExtractionDependencies,
): Promise<PersonnelContractExtractionReviewResult> {
  const request = personnelContractExtractionRequestSchema.parse(rawRequest);

  // This callback owns trusted-session authorization and scoped metadata
  // resolution. It must complete before any fixture bytes are prepared or an
  // adapter is invoked.
  const target = await dependencies.authorizeAndResolve(request);
  if (
    target.documentId !== request.documentId ||
    target.documentVersion !== request.documentVersion
  ) {
    throw new ContractExtractionServiceError(
      'The signed contract version has changed.',
      'DOCUMENT_STALE',
    );
  }
  if (target.employeeRevision !== request.employeeRevision) {
    throw new ContractExtractionServiceError(
      'The employee dossier has changed.',
      'EMPLOYEE_CONFLICT',
    );
  }

  dependencies.consumeRateLimit();

  let prepared: PreparedSyntheticContract;
  try {
    const bytes = await createSyntheticContractPdf();
    prepared = await dependencies.preparer.prepare(bytes, request.scenario);
  } catch (error: unknown) {
    if (error instanceof ContractExtractionServiceError) throw error;
    throw new ContractExtractionServiceError(
      'The synthetic PDF could not be prepared.',
      'PREPARATION_FAILED',
    );
  }

  const timeoutMilliseconds = dependencies.timeoutMilliseconds ?? 45_000;
  let rawResult: unknown;
  try {
    rawResult = await withTimeout(
      dependencies.adapter.extract(request, prepared),
      timeoutMilliseconds,
    );
  } catch (error: unknown) {
    if (error instanceof ContractExtractionServiceError) throw error;
    throw new ContractExtractionServiceError(
      'The synthetic extraction service failed.',
      'SERVICE_FAILURE',
    );
  }

  const result =
    personnelContractExtractionReviewResultSchema.safeParse(rawResult);
  if (!result.success) {
    throw new ContractExtractionServiceError(
      'The extraction result did not match the YUTA contract.',
      'INVALID_RESULT',
    );
  }
  if (
    result.data.requestId !== request.requestId ||
    result.data.document.id !== request.documentId ||
    result.data.document.version !== request.documentVersion ||
    result.data.employeeRevision !== request.employeeRevision ||
    result.data.pageCount !== prepared.pageCount
  ) {
    throw new ContractExtractionServiceError(
      'The extraction result does not match the requested versions.',
      'INVALID_RESULT',
    );
  }
  return result.data;
}

export class SyntheticContractPdfPreparer implements ContractPdfPreparer {
  async prepare(
    bytes: Uint8Array,
    scenario: PersonnelContractExtractionRequest['scenario'],
  ): Promise<PreparedSyntheticContract> {
    const document = await PDFDocument.load(bytes);
    const pageCount = document.getPageCount();
    if (pageCount < 1 || pageCount > 40) {
      throw new ContractExtractionServiceError(
        'The synthetic PDF page count is outside the approved limit.',
        'PREPARATION_FAILED',
      );
    }
    return { source: 'synthetic_fixture', pageCount, scenario, bytes };
  }
}

export class DeterministicSyntheticExtractionAdapter implements ContractExtractionAdapter {
  constructor(private readonly now: () => Date = () => new Date()) {}

  async extract(
    request: PersonnelContractExtractionRequest,
    document: PreparedSyntheticContract,
  ): Promise<unknown> {
    if (document.scenario === 'failure') {
      throw new ContractExtractionServiceError(
        'Synthetic failure requested.',
        'SERVICE_FAILURE',
      );
    }
    if (document.scenario === 'timeout') {
      throw new ContractExtractionServiceError(
        'Synthetic timeout requested.',
        'TIMEOUT',
      );
    }

    const suggestions =
      document.scenario === 'no_result' || document.scenario === 'unsupported'
        ? []
        : [
            {
              field: 'position' as const,
              candidateValue: 'Chef de rang',
              confidence: 'high' as const,
              sourcePage: 2,
              excerpt:
                'Le salarié exercera les fonctions de chef de rang au sein de l’établissement.',
              issueCodes: [],
            },
            ...(document.scenario === 'partial'
              ? []
              : [
                  {
                    field: 'employmentTermType' as const,
                    candidateValue: 'fixed_term' as const,
                    confidence: 'medium' as const,
                    sourcePage: 1,
                    excerpt:
                      'Le présent contrat est conclu pour une durée déterminée.',
                    issueCodes: ['blocked_by_dependency' as const],
                  },
                  {
                    field: 'contractWeeklyMinutes' as const,
                    candidateValue: 2_100,
                    confidence: 'low' as const,
                    sourcePage: 3,
                    excerpt:
                      'La durée hebdomadaire de travail est fixée à trente-cinq heures.',
                    issueCodes: [],
                  },
                ]),
          ];
    const status =
      document.scenario === 'partial'
        ? 'partial'
        : document.scenario === 'no_result'
          ? 'no_result'
          : document.scenario === 'unsupported'
            ? 'unsupported'
            : 'complete';
    return {
      schemaVersion: 1,
      requestId: request.requestId,
      document: {
        id: request.documentId,
        version: request.documentVersion,
      },
      employeeRevision: request.employeeRevision,
      status,
      pageCount: document.pageCount,
      suggestions,
      warnings:
        status === 'partial'
          ? ['some_fields_not_detected']
          : status === 'unsupported'
            ? ['image_only_document']
            : [],
      expiresAt: new Date(this.now().getTime() + 15 * 60 * 1_000).toISOString(),
    };
  }
}

export class DevelopmentExtractionRateLimiter {
  private readonly attempts = new Map<string, number[]>();

  constructor(
    private readonly limit = 10,
    private readonly windowMilliseconds = 24 * 60 * 60 * 1_000,
    private readonly now: () => number = () => Date.now(),
  ) {}

  consume(scopeKey: string): void {
    const earliest = this.now() - this.windowMilliseconds;
    const current = (this.attempts.get(scopeKey) ?? []).filter(
      (timestamp) => timestamp > earliest,
    );
    if (current.length >= this.limit) {
      throw new ContractExtractionServiceError(
        'The local extraction rate limit has been reached.',
        'RATE_LIMITED',
      );
    }
    current.push(this.now());
    this.attempts.set(scopeKey, current);
  }
}

async function createSyntheticContractPdf(): Promise<Uint8Array> {
  const document = await PDFDocument.create();
  const font = await document.embedFont(StandardFonts.Helvetica);
  const pages = [
    'Contrat de travail synthetique - CDD',
    'Poste synthetique - Chef de rang',
    'Duree synthetique - 35 heures par semaine',
  ];
  for (const text of pages) {
    const page = document.addPage([595, 842]);
    page.drawText(text, { x: 48, y: 790, size: 12, font });
  }
  return document.save();
}

async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMilliseconds: number,
): Promise<T> {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<never>((_resolve, reject) => {
        timeout = setTimeout(
          () =>
            reject(
              new ContractExtractionServiceError(
                'The synthetic extraction request timed out.',
                'TIMEOUT',
              ),
            ),
          timeoutMilliseconds,
        );
      }),
    ]);
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}
