'use server';

import {
  applyPersonnelContractExtractionInputSchema,
  personnelContractExtractionRequestSchema,
  type PersonnelContractExtractionReviewResult,
  type PersonnelContractExtractionRequest,
  type PersonnelEmployeeSummary,
} from '@yuta/contracts/personnel';
import {
  findPersonnelEmployee,
  PersonnelConflictError,
  recordPersonnelContractExtractionAudit,
  updatePersonnelEmployee,
  validatePersonnelContractExtractionReviewGrant,
  listPersonnelDocuments,
  resolvePersonnelDocumentExtractionSource,
  type PersonnelDocumentExtractionSource,
} from '@yuta/db-cloud';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requirePersonnelPermission } from '@/server/auth/permissions';
import { requirePersonnelTenant } from '@/server/auth/session';
import { requireBackofficePageAvailable } from '@/server/backoffice-exposure';
import { cloudDatabase } from '@/server/cloud-database';
import { getDateInTimezone } from '@/lib/local-time';
import { getPersonnelDocumentRuntime } from '@/server/personnel-documents/runtime';
import {
  ContractExtractionServiceError,
  DevelopmentExtractionRateLimiter,
  runSyntheticContractExtraction,
  SyntheticContractPdfPreparer,
} from '@/server/personnel-contract-extraction/service';
import { createDevelopmentContractExtractionAdapter } from '@/server/personnel-contract-extraction/runtime';
import type { OpenAiExtractionObservation } from '@/server/personnel-contract-extraction/openai-adapter';
import { developmentContractExtractionReviewStore } from '@/server/personnel-contract-extraction/review-store';
import { createDevelopmentSyntheticPdfLoader } from '@/server/personnel-contract-extraction/synthetic-upload';
import {
  createStoredSyntheticDocumentLoader,
  identifyApprovedStoredSyntheticFixture,
  StoredSyntheticFixtureExtractionAdapter,
  StoredSyntheticProviderQaExtractionAdapter,
  StoredSyntheticProviderQaGate,
} from '@/server/personnel-contract-extraction/stored-synthetic-document';
import { isContractExtractionPrototypeEnabled } from './_lib/contract-extraction-prototype-runtime';

export type StartContractExtractionActionResult =
  | {
      status: 'success';
      result: PersonnelContractExtractionReviewResult;
    }
  | {
      status: 'error';
      code:
        | 'unavailable'
        | 'document_stale'
        | 'employee_conflict'
        | 'rate_limited'
        | 'timeout'
        | 'failed';
      message: string;
    };

export type StoredSyntheticContractEligibilityActionResult =
  | { status: 'eligible'; mode: 'offline' | 'provider_once' }
  | { status: 'unavailable'; message: string };

export type ApplyContractExtractionActionResult =
  | {
      status: 'success';
      message: string;
      employee: PersonnelEmployeeSummary;
    }
  | {
      status: 'error' | 'conflict';
      message: string;
      currentEmployee: PersonnelEmployeeSummary | null;
    };

const developmentExtractionRateLimiter = new DevelopmentExtractionRateLimiter();

const storedSyntheticProviderQaGate = new StoredSyntheticProviderQaGate();

export async function startContractExtractionAction(
  rawRequest: unknown,
  syntheticUpload?: FormData,
): Promise<StartContractExtractionActionResult> {
  requireBackofficePageAvailable('/equipe/salaries');
  if (!isContractExtractionPrototypeEnabled()) {
    return extractionError(
      'unavailable',
      'L’analyse locale est disponible uniquement en développement.',
    );
  }
  const { tenant } = await requirePersonnelTenant('/equipe/salaries');
  requirePersonnelPermission(tenant, 'personnel.document.read');
  requirePersonnelPermission(tenant, 'personnel.document.extract');

  let request: PersonnelContractExtractionRequest | null = null;
  let storedSource: PersonnelDocumentExtractionSource | null = null;
  try {
    request = personnelContractExtractionRequestSchema.parse(rawRequest);
    const requestedSource = syntheticUpload?.get('syntheticSource');
    if (
      requestedSource !== null &&
      requestedSource !== undefined &&
      requestedSource !== 'synthetic_upload' &&
      requestedSource !== 'stored_synthetic_document'
    ) {
      throw new ContractExtractionServiceError(
        'The development extraction source is invalid.',
        'PREPARATION_FAILED',
      );
    }
    const useStoredSource = requestedSource === 'stored_synthetic_document';
    const useStoredProviderQa =
      useStoredSource && storedSyntheticProviderQaGate.isEnabled();
    let providerObservation: OpenAiExtractionObservation | undefined;
    const providerQaStartedAt = useStoredProviderQa
      ? performance.now()
      : undefined;
    if (useStoredSource && request.scenario !== 'complete') {
      throw new ContractExtractionServiceError(
        'The stored fictional document supports only the complete scenario.',
        'PREPARATION_FAILED',
      );
    }
    const uploadedLoader = useStoredSource
      ? undefined
      : createDevelopmentSyntheticPdfLoader(syntheticUpload, request.scenario);
    const loadPdf = useStoredSource
      ? async () => {
          if (!storedSource) {
            throw new ContractExtractionServiceError(
              'The stored fictional document was not resolved.',
              'PREPARATION_FAILED',
            );
          }
          const runtime = await getPersonnelDocumentRuntime();
          return createStoredSyntheticDocumentLoader(
            storedSource,
            runtime.storage,
          )();
        }
      : uploadedLoader;
    const result = await runSyntheticContractExtraction(request, {
      authorizeAndResolve: async (authorizedRequest) => {
        // Repeat permission checks inside the service-owned resolution step so
        // no fixture is prepared before trusted authorization succeeds.
        requirePersonnelPermission(tenant, 'personnel.document.read');
        requirePersonnelPermission(tenant, 'personnel.document.extract');
        const employee = await findPersonnelEmployee(
          cloudDatabase,
          tenant,
          authorizedRequest.employeeId,
          getDateInTimezone(tenant.timezone),
        );
        const document = useStoredSource
          ? await resolvePersonnelDocumentExtractionSource(
              cloudDatabase,
              tenant,
              {
                employeeId: authorizedRequest.employeeId,
                documentId: authorizedRequest.documentId,
                documentVersion: authorizedRequest.documentVersion,
              },
            ).then((source) => {
              if (!identifyApprovedStoredSyntheticFixture(source)) {
                throw new ContractExtractionServiceError(
                  'The stored contract is not an approved fictional fixture.',
                  'PREPARATION_FAILED',
                );
              }
              storedSource = source;
              return {
                id: source.documentId,
                version: source.documentVersion,
              };
            })
          : (
              await listPersonnelDocuments(
                cloudDatabase,
                tenant,
                authorizedRequest.employeeId,
                authorizedRequest.requestId,
              )
            ).items.find((item) => item.id === authorizedRequest.documentId);
        if (!employee || !document) {
          throw new ContractExtractionServiceError(
            'The scoped extraction target was not found.',
            'DOCUMENT_STALE',
          );
        }
        await recordPersonnelContractExtractionAudit(cloudDatabase, tenant, {
          employeeId: authorizedRequest.employeeId,
          requestId: authorizedRequest.requestId,
          documentId: authorizedRequest.documentId,
          documentVersion: authorizedRequest.documentVersion,
          eventType: 'employee.contract_extraction_requested',
          outcomeCode: 'requested',
          suggestionCount: 0,
        });
        return {
          employeeRevision: employee.revision,
          documentId: document.id,
          documentVersion: document.version,
        };
      },
      consumeRateLimit: () =>
        developmentExtractionRateLimiter.consume(
          `${tenant.organizationId}:${tenant.establishmentId}`,
        ),
      loadPdf,
      preparer: new SyntheticContractPdfPreparer(),
      adapter: useStoredSource
        ? useStoredProviderQa
          ? new StoredSyntheticProviderQaExtractionAdapter(
              createDevelopmentContractExtractionAdapter({
                scenario: request.scenario,
                onCompleted: (observation) => {
                  providerObservation = observation;
                },
              }),
              storedSyntheticProviderQaGate,
            )
          : new StoredSyntheticFixtureExtractionAdapter()
        : createDevelopmentContractExtractionAdapter({
            scenario: request.scenario,
          }),
    });
    if (useStoredProviderQa && providerQaStartedAt !== undefined) {
      console.info(
        'YUTA_OPENAI_STORED_SYNTHETIC_QA',
        JSON.stringify({
          fixtureId: 'wg2-digital-cdd-35h',
          model: providerObservation?.model,
          promptVersion: providerObservation?.promptVersion,
          latencyMilliseconds: Math.round(
            performance.now() - providerQaStartedAt,
          ),
          inputTokens: providerObservation?.inputTokens,
          outputTokens: providerObservation?.outputTokens,
          totalTokens: providerObservation?.totalTokens,
          status: result.status,
          suggestionCount: result.suggestions.length,
        }),
      );
    }
    await recordPersonnelContractExtractionAudit(cloudDatabase, tenant, {
      employeeId: request.employeeId,
      requestId: request.requestId,
      documentId: request.documentId,
      documentVersion: request.documentVersion,
      eventType: 'employee.contract_extraction_completed',
      outcomeCode: result.status,
      suggestionCount: result.suggestions.length,
    });
    developmentContractExtractionReviewStore.save(
      {
        organizationId: tenant.organizationId,
        establishmentId: tenant.establishmentId,
      },
      result,
    );
    return { status: 'success', result };
  } catch (error: unknown) {
    if (request) {
      await recordContractExtractionFailureSafe(
        tenant,
        request,
        error instanceof ContractExtractionServiceError
          ? extractionAuditOutcome(error.code)
          : 'failed',
      );
    }
    if (error instanceof ContractExtractionServiceError) {
      switch (error.code) {
        case 'DOCUMENT_STALE':
          return extractionError(
            'document_stale',
            'Le contrat signé a été remplacé. Relancez l’analyse sur sa version actuelle.',
          );
        case 'EMPLOYEE_CONFLICT':
          return extractionError(
            'employee_conflict',
            'Le dossier salarié a été modifié. Rechargez-le avant de relancer l’analyse.',
          );
        case 'RATE_LIMITED':
          return extractionError(
            'rate_limited',
            'La limite locale de 10 analyses par établissement sur 24 heures est atteinte.',
          );
        case 'TIMEOUT':
          return extractionError(
            'timeout',
            'L’analyse locale a dépassé le délai prévu. Vous pouvez réessayer manuellement.',
          );
        case 'PREPARATION_FAILED':
          return extractionError(
            'failed',
            syntheticUpload?.get('syntheticSource') ===
              'stored_synthetic_document'
              ? 'Le contrat fictif enregistré n’est pas disponible pour ce test hors ligne.'
              : 'Le PDF fictif n’est pas valide ou dépasse la limite de 750 Ko.',
          );
        default:
          return extractionError(
            'failed',
            'Le résultat local n’a pas pu être validé. Consultez le PDF ou réessayez.',
          );
      }
    }
    if (error instanceof z.ZodError) {
      return extractionError(
        'failed',
        'La demande d’analyse locale n’est pas valide.',
      );
    }
    console.error('Synthetic personnel contract extraction failed.');
    return extractionError(
      'failed',
      'L’analyse locale est indisponible. Réessayez.',
    );
  }
}

export async function loadStoredSyntheticContractEligibilityAction(
  employeeId: string,
  documentId: string,
  documentVersion: number,
): Promise<StoredSyntheticContractEligibilityActionResult> {
  requireBackofficePageAvailable('/equipe/salaries');
  const unavailable: StoredSyntheticContractEligibilityActionResult = {
    status: 'unavailable',
    message:
      'Seul un contrat fictif YUTA reconnu peut être analysé depuis Documents.',
  };
  if (!isContractExtractionPrototypeEnabled()) return unavailable;

  const { tenant } = await requirePersonnelTenant('/equipe/salaries');
  requirePersonnelPermission(tenant, 'personnel.document.read');
  requirePersonnelPermission(tenant, 'personnel.document.extract');
  try {
    const source = await resolvePersonnelDocumentExtractionSource(
      cloudDatabase,
      tenant,
      { employeeId, documentId, documentVersion },
    );
    return identifyApprovedStoredSyntheticFixture(source)
      ? {
          status: 'eligible',
          mode: storedSyntheticProviderQaGate.isEnabled()
            ? 'provider_once'
            : 'offline',
        }
      : unavailable;
  } catch {
    return unavailable;
  }
}

export async function applyContractExtractionAction(
  rawInput: unknown,
): Promise<ApplyContractExtractionActionResult> {
  requireBackofficePageAvailable('/equipe/salaries');
  if (!isContractExtractionPrototypeEnabled()) {
    return {
      status: 'error',
      message:
        'L’application locale est disponible uniquement en développement.',
      currentEmployee: null,
    };
  }
  const { tenant } = await requirePersonnelTenant('/equipe/salaries');
  requirePersonnelPermission(tenant, 'personnel.document.read');
  requirePersonnelPermission(tenant, 'personnel.document.extract');
  requirePersonnelPermission(tenant, 'personnel.employee.manage');
  const reviewScope = {
    organizationId: tenant.organizationId,
    establishmentId: tenant.establishmentId,
  };

  try {
    const input = applyPersonnelContractExtractionInputSchema.parse(rawInput);
    const [employee, documents] = await Promise.all([
      findPersonnelEmployee(
        cloudDatabase,
        tenant,
        input.request.employeeId,
        getDateInTimezone(tenant.timezone),
      ),
      listPersonnelDocuments(
        cloudDatabase,
        tenant,
        input.request.employeeId,
        input.request.requestId,
      ),
    ]);
    const document = documents.items.find(
      (item) => item.id === input.request.documentId,
    );
    if (!document || document.version !== input.request.documentVersion) {
      developmentContractExtractionReviewStore.delete(
        reviewScope,
        input.request.requestId,
      );
      return {
        status: 'conflict',
        message:
          'Le contrat signé a été remplacé. Les suggestions ont été supprimées.',
        currentEmployee: employee,
      };
    }
    if (!employee || employee.revision !== input.request.employeeRevision) {
      developmentContractExtractionReviewStore.delete(
        reviewScope,
        input.request.requestId,
      );
      return {
        status: 'conflict',
        message:
          'Le dossier salarié a été modifié. Rechargez-le et relancez l’analyse.',
        currentEmployee: employee,
      };
    }

    const storedReview = developmentContractExtractionReviewStore.find(
      reviewScope,
      input.request,
    );
    if (storedReview.status !== 'valid') {
      if (storedReview.status === 'mismatch') {
        developmentContractExtractionReviewStore.delete(
          reviewScope,
          input.request.requestId,
        );
      }
      return {
        status: 'conflict',
        message:
          storedReview.status === 'expired'
            ? 'Cette analyse a expiré. Relancez-la avant d’appliquer des champs.'
            : 'Cette analyse temporaire n’est plus disponible. Relancez-la avant d’appliquer des champs.',
        currentEmployee: employee,
      };
    }
    const review = storedReview.review;
    if (review.status !== 'complete' && review.status !== 'partial') {
      developmentContractExtractionReviewStore.delete(
        reviewScope,
        input.request.requestId,
      );
      return {
        status: 'error',
        message: 'Cette analyse ne contient aucun champ applicable.',
        currentEmployee: employee,
      };
    }
    const reviewGrant = await validatePersonnelContractExtractionReviewGrant(
      cloudDatabase,
      tenant,
      {
        employeeId: input.request.employeeId,
        requestId: input.request.requestId,
        documentId: input.request.documentId,
        documentVersion: input.request.documentVersion,
        outcomeCode: review.status,
      },
    );
    if (reviewGrant !== 'valid') {
      developmentContractExtractionReviewStore.delete(
        reviewScope,
        input.request.requestId,
      );
      return {
        status: 'conflict',
        message:
          reviewGrant === 'expired'
            ? 'Cette analyse a expiré. Relancez-la avant d’appliquer des champs.'
            : 'Cette analyse n’est plus disponible. Relancez-la avant d’appliquer des champs.',
        currentEmployee: employee,
      };
    }
    for (const selected of input.selectedSuggestions) {
      const matchingSuggestion = review.suggestions.find(
        (suggestion) =>
          suggestion.field === selected.field &&
          suggestion.candidateValue === selected.candidateValue &&
          !suggestion.issueCodes.includes('blocked_by_dependency'),
      );
      if (!matchingSuggestion) {
        developmentContractExtractionReviewStore.delete(
          reviewScope,
          input.request.requestId,
        );
        return {
          status: 'error',
          message:
            'Une suggestion ne correspond plus au résultat local validé. Relancez l’analyse.',
          currentEmployee: employee,
        };
      }
    }

    const position = input.selectedSuggestions.find(
      (suggestion) => suggestion.field === 'position',
    );
    const weeklyMinutes = input.selectedSuggestions.find(
      (suggestion) => suggestion.field === 'contractWeeklyMinutes',
    );
    const updateResult = await updatePersonnelEmployee(
      cloudDatabase,
      tenant,
      {
        idempotencyKey: input.idempotencyKey,
        employeeId: employee.id,
        expectedRevision: input.request.employeeRevision,
        givenNames: employee.givenNames,
        familyName: employee.familyName,
        position:
          position?.field === 'position'
            ? position.candidateValue
            : employee.position,
        qualification: employee.qualification,
        employmentTermType: employee.employmentTermType,
        expectedEndDate: employee.expectedEndDate,
        fixedTermReasonCode: employee.fixedTermReasonCode,
        workTimeCategory: employee.workTimeCategory,
        contractWeeklyMinutes:
          weeklyMinutes?.field === 'contractWeeklyMinutes'
            ? weeklyMinutes.candidateValue
            : employee.contractWeeklyMinutes,
        entryDate: employee.entryDate,
        confirmFixedTermReasonClear: false,
      },
      getDateInTimezone(tenant.timezone),
      new Date(),
      {
        requestId: input.request.requestId,
        documentId: input.request.documentId,
        documentVersion: input.request.documentVersion,
        selectedFields: input.selectedSuggestions.map(
          (suggestion) => suggestion.field,
        ),
      },
    );
    developmentContractExtractionReviewStore.delete(
      reviewScope,
      input.request.requestId,
    );
    revalidatePath('/equipe/salaries');
    return {
      status: 'success',
      message: updateResult.updated
        ? 'Les champs sélectionnés ont été enregistrés.'
        : 'Les valeurs sélectionnées étaient déjà à jour.',
      employee: updateResult.employee,
    };
  } catch (error: unknown) {
    if (error instanceof PersonnelConflictError) {
      return {
        status: 'conflict',
        message:
          'Le dossier salarié a été modifié. Rechargez-le et relancez l’analyse.',
        currentEmployee: error.currentEmployee,
      };
    }
    if (error instanceof z.ZodError) {
      return {
        status: 'error',
        message: 'Les champs sélectionnés ne sont pas valides.',
        currentEmployee: null,
      };
    }
    console.error('Failed to apply synthetic contract extraction suggestions.');
    return {
      status: 'error',
      message: 'Impossible d’enregistrer les suggestions. Réessayez.',
      currentEmployee: null,
    };
  }
}

function extractionError(
  code: Extract<
    StartContractExtractionActionResult,
    { status: 'error' }
  >['code'],
  message: string,
): StartContractExtractionActionResult {
  return { status: 'error', code, message };
}

function extractionAuditOutcome(
  code: ContractExtractionServiceError['code'],
):
  | 'document_stale'
  | 'employee_conflict'
  | 'rate_limited'
  | 'timeout'
  | 'failed' {
  switch (code) {
    case 'DOCUMENT_STALE':
      return 'document_stale';
    case 'EMPLOYEE_CONFLICT':
      return 'employee_conflict';
    case 'RATE_LIMITED':
      return 'rate_limited';
    case 'TIMEOUT':
      return 'timeout';
    default:
      return 'failed';
  }
}

async function recordContractExtractionFailureSafe(
  tenant: Awaited<ReturnType<typeof requirePersonnelTenant>>['tenant'],
  request: PersonnelContractExtractionRequest,
  outcomeCode:
    | 'document_stale'
    | 'employee_conflict'
    | 'rate_limited'
    | 'timeout'
    | 'failed',
) {
  try {
    await recordPersonnelContractExtractionAudit(cloudDatabase, tenant, {
      employeeId: request.employeeId,
      requestId: request.requestId,
      documentId: request.documentId,
      documentVersion: request.documentVersion,
      eventType: 'employee.contract_extraction_failed',
      outcomeCode,
      suggestionCount: 0,
    });
  } catch {
    // A denied or stale cross-scope target intentionally produces no audit row.
  }
}
