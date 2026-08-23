'use server';

import {
  applyPersonnelContractExtractionInputSchema,
  createPersonnelEmployeeInputSchema,
  personnelContractExtractionRequestSchema,
  setPersonnelEmployeeDepartureInputSchema,
  updatePersonnelEmployeeInputSchema,
  type PersonnelContractAmendment,
  type PersonnelContractExtractionReviewResult,
  type PersonnelContractExtractionRequest,
  type PersonnelContractAmendmentList,
  type PersonnelEmployeeAccessHistory,
  type PersonnelEmployeeAuditHistory,
  type PersonnelEmployeeSummary,
  type PersonnelActionOverviewItemKind,
  type PersonnelActionOverviewQuery,
  type PersonnelActionOverviewResponse,
  type PersonnelDocument,
  type PersonnelDocumentList,
} from '@yuta/contracts/personnel';
import {
  createPersonnelEmployee,
  findPersonnelEmployee,
  listPersonnelEmployeeAccessHistory,
  listPersonnelEmployeeAuditHistory,
  PersonnelConflictError,
  PersonnelDuplicateError,
  PersonnelRepositoryError,
  recordPersonnelEmployeeAccess,
  recordPersonnelContractExtractionAudit,
  setPersonnelEmployeeDeparture,
  updatePersonnelEmployee,
  validatePersonnelContractExtractionReviewGrant,
  listPersonnelDocuments,
  PersonnelDocumentRepositoryError,
  recordPersonnelDocumentUploadRejected,
  resolvePersonnelDocumentExtractionSource,
  savePersonnelDocumentMetadata,
  createPersonnelContractAmendmentMetadata,
  listPersonnelContractAmendments,
  PersonnelContractAmendmentRepositoryError,
  recordPersonnelContractAmendmentUploadRejected,
  replacePersonnelContractAmendmentMetadata,
  listPersonnelActionOverview,
  resolvePersonnelActionTarget,
  type PersonnelDocumentExtractionSource,
} from '@yuta/db-cloud';
import { revalidatePath } from 'next/cache';
import { createHash } from 'node:crypto';
import { z } from 'zod';
import { requirePersonnelPermission } from '../../../../server/auth/permissions';
import { requirePersonnelTenant } from '../../../../server/auth/session';
import { cloudDatabase } from '../../../../server/cloud-database';
import {
  getPersonnelDocumentRuntime,
  PersonnelDocumentScannerError,
} from '../../../../server/personnel-documents/runtime';
import { getBusinessDate } from './salaries-model';
import {
  ContractExtractionServiceError,
  DevelopmentExtractionRateLimiter,
  runSyntheticContractExtraction,
  SyntheticContractPdfPreparer,
} from '../../../../server/personnel-contract-extraction/service';
import { createDevelopmentContractExtractionAdapter } from '../../../../server/personnel-contract-extraction/runtime';
import type { OpenAiExtractionObservation } from '../../../../server/personnel-contract-extraction/openai-adapter';
import { developmentContractExtractionReviewStore } from '../../../../server/personnel-contract-extraction/review-store';
import { createDevelopmentSyntheticPdfLoader } from '../../../../server/personnel-contract-extraction/synthetic-upload';
import {
  createStoredSyntheticDocumentLoader,
  identifyApprovedStoredSyntheticFixture,
  StoredSyntheticFixtureExtractionAdapter,
  StoredSyntheticProviderQaExtractionAdapter,
  StoredSyntheticProviderQaGate,
} from '../../../../server/personnel-contract-extraction/stored-synthetic-document';
import { isContractExtractionPrototypeEnabled } from './_lib/contract-extraction-prototype-runtime';
import { isPersonnelActionOverviewEnabled } from './_lib/personnel-action-overview-runtime';

export type CreateEmployeeActionState = {
  status: 'idle' | 'error' | 'duplicate' | 'success';
  message: string | null;
  employeeId: string | null;
  fieldErrors: Record<string, string>;
  duplicateCandidates: Array<{
    id: string;
    displayName: string;
    position: string;
    entryDate: string;
    departureDate: string | null;
  }>;
};

export type UpdateEmployeeActionState = {
  status: 'idle' | 'error' | 'conflict' | 'success';
  message: string | null;
  fieldErrors: Record<string, string>;
  currentEmployee: PersonnelEmployeeSummary | null;
};

export type DepartureEmployeeActionState = {
  status: 'idle' | 'error' | 'conflict' | 'success';
  message: string | null;
  fieldErrors: Record<string, string>;
  currentEmployee: PersonnelEmployeeSummary | null;
};

export type LoadEmployeeHistoryActionResult =
  | { status: 'success'; history: PersonnelEmployeeAuditHistory }
  | { status: 'error'; message: string };

export type LoadEmployeeAccessHistoryActionResult =
  | { status: 'success'; history: PersonnelEmployeeAccessHistory }
  | { status: 'error'; message: string };

export type LoadEmployeeDocumentsActionResult =
  | { status: 'success'; documents: PersonnelDocumentList }
  | { status: 'error'; message: string };

export type LoadPersonnelActionOverviewActionResult =
  | { status: 'success'; overview: PersonnelActionOverviewResponse }
  | { status: 'error'; message: string };

export type ResolvePersonnelActionTargetActionResult =
  | { status: 'ready'; employee: PersonnelEmployeeSummary }
  | { status: 'changed'; message: string }
  | { status: 'error'; message: string };

export type SaveEmployeeDocumentActionState = {
  status: 'idle' | 'error' | 'conflict' | 'success';
  message: string | null;
  document: PersonnelDocument | null;
};

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

export type LoadEmployeeAmendmentsActionResult =
  | { status: 'success'; amendments: PersonnelContractAmendmentList }
  | { status: 'error'; message: string };

export type SaveEmployeeAmendmentActionState = {
  status: 'idle' | 'error' | 'conflict' | 'success';
  message: string | null;
  fieldErrors: Record<string, string>;
  amendment: PersonnelContractAmendment | null;
  values: {
    effectiveDate: string;
    reference: string;
  };
};

const createAmendmentFormSchema = z
  .object({
    effectiveDate: z.string().date(),
    reference: z.string().trim().min(1).max(80).nullable(),
  })
  .strict();
const replaceAmendmentFormSchema = z
  .object({
    amendmentId: z.string().uuid(),
    expectedRevision: z.coerce.number().int().positive(),
  })
  .strict();

const developmentExtractionRateLimiter = new DevelopmentExtractionRateLimiter();
const storedSyntheticProviderQaGate = new StoredSyntheticProviderQaGate();

export async function loadPersonnelActionOverviewAction(
  query: PersonnelActionOverviewQuery,
): Promise<LoadPersonnelActionOverviewActionResult> {
  if (!isPersonnelActionOverviewEnabled()) {
    return actionOverviewUnavailable();
  }
  const { tenant } = await requirePersonnelTenant('/equipe/salaries');
  requirePersonnelPermission(tenant, 'personnel.employee.read');
  requirePersonnelPermission(tenant, 'personnel.document.read');
  try {
    const overview = await listPersonnelActionOverview(
      cloudDatabase,
      tenant,
      query,
      getBusinessDate(tenant.timezone),
    );
    return { status: 'success', overview };
  } catch (error: unknown) {
    console.error('Failed to load the personnel action overview.', error);
    return actionOverviewUnavailable();
  }
}

export async function resolvePersonnelActionTargetAction(
  employeeId: string,
  kind: PersonnelActionOverviewItemKind,
): Promise<ResolvePersonnelActionTargetActionResult> {
  if (!isPersonnelActionOverviewEnabled()) {
    return actionOverviewUnavailable();
  }
  const { tenant } = await requirePersonnelTenant('/equipe/salaries');
  requirePersonnelPermission(tenant, 'personnel.employee.read');
  if (kind === 'incomplete_employee_dossier') {
    requirePersonnelPermission(tenant, 'personnel.employee.manage');
  } else if (kind === 'missing_signed_base_contract') {
    requirePersonnelPermission(tenant, 'personnel.document.read');
    requirePersonnelPermission(tenant, 'personnel.document.manage');
  }
  try {
    const result = await resolvePersonnelActionTarget(
      cloudDatabase,
      tenant,
      employeeId,
      kind,
      getBusinessDate(tenant.timezone),
    );
    return result.status === 'ready'
      ? result
      : {
          status: 'changed',
          message:
            'Cette action n’est plus nécessaire. La liste a été actualisée.',
        };
  } catch (error: unknown) {
    console.error('Failed to resolve a personnel action target.', error);
    return {
      status: 'error',
      message: 'Impossible d’ouvrir cette action. Réessayez.',
    };
  }
}

function actionOverviewUnavailable(): {
  status: 'error';
  message: string;
} {
  return {
    status: 'error',
    message: 'La liste des actions est indisponible. Réessayez.',
  };
}

export async function loadEmployeeDocumentsAction(
  employeeId: string,
  operationId: string,
): Promise<LoadEmployeeDocumentsActionResult> {
  const { tenant } = await requirePersonnelTenant('/equipe/salaries');
  requirePersonnelPermission(tenant, 'personnel.document.read');
  try {
    const documents = await listPersonnelDocuments(
      cloudDatabase,
      tenant,
      employeeId,
      operationId,
    );
    return { status: 'success', documents };
  } catch (error: unknown) {
    console.error('Failed to load personnel documents.', error);
    return {
      status: 'error',
      message: 'Impossible de charger les documents. Réessayez.',
    };
  }
}

export async function startContractExtractionAction(
  rawRequest: unknown,
  syntheticUpload?: FormData,
): Promise<StartContractExtractionActionResult> {
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
          getBusinessDate(tenant.timezone),
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
        getBusinessDate(tenant.timezone),
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
      getBusinessDate(tenant.timezone),
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

export async function saveEmployeeDocumentAction(
  _previousState: SaveEmployeeDocumentActionState,
  formData: FormData,
): Promise<SaveEmployeeDocumentActionState> {
  const { tenant } = await requirePersonnelTenant('/equipe/salaries');
  requirePersonnelPermission(tenant, 'personnel.document.manage');
  const employeeId = String(formData.get('employeeId') ?? '');
  const idempotencyKey = String(formData.get('idempotencyKey') ?? '');
  let storageKey: string | null = null;
  try {
    const file = formData.get('file');
    if (!(file instanceof File) || file.size === 0) {
      return documentError('Sélectionnez un fichier PDF.');
    }
    if (file.size > 10 * 1024 * 1024) {
      await recordRejectedSafe(employeeId, idempotencyKey, 'invalid_file');
      return documentError('Le fichier ne doit pas dépasser 10 Mo.');
    }
    const content = new Uint8Array(await file.arrayBuffer());
    if (
      file.type !== 'application/pdf' ||
      new TextDecoder('ascii').decode(content.slice(0, 5)) !== '%PDF-'
    ) {
      await recordRejectedSafe(employeeId, idempotencyKey, 'invalid_file');
      return documentError('Seuls les fichiers PDF valides sont acceptés.');
    }

    const runtime = await getPersonnelDocumentRuntime();
    storageKey = await runtime.storage.putQuarantinedObject(content);
    const quarantined = await runtime.storage.readQuarantinedObject(storageKey);
    await runtime.scanner.inspectQuarantinedObject(quarantined);
    await runtime.storage.promoteVerifiedObject(storageKey);

    const rawRevision = String(formData.get('expectedRevision') ?? '').trim();
    const result = await savePersonnelDocumentMetadata(cloudDatabase, tenant, {
      idempotencyKey,
      employeeId,
      expectedRevision: rawRevision ? Number(rawRevision) : null,
      category: 'signed_employment_contract',
      filename: sanitizeDocumentFilename(file.name),
      mediaType: 'application/pdf',
      byteSize: file.size,
      checksum: createHash('sha256').update(content).digest('hex'),
      storageKey,
    });
    if (result.idempotentReplay) {
      await runtime.storage.removeObject(storageKey);
    }
    revalidatePath('/equipe/salaries');
    return {
      status: 'success',
      message: result.idempotentReplay
        ? 'Ce fichier avait déjà été enregistré.'
        : 'Le contrat signé a été vérifié et enregistré.',
      document: result.document,
    };
  } catch (error: unknown) {
    if (storageKey) {
      try {
        const runtime = await getPersonnelDocumentRuntime();
        await runtime.storage.removeObject(storageKey);
      } catch {
        console.error('Failed to clean up a personnel document object.');
      }
    }
    if (
      error instanceof PersonnelDocumentRepositoryError &&
      error.code === 'CONFLICT'
    ) {
      return {
        status: 'conflict',
        message:
          'Le document a changé depuis son ouverture. Rechargez la liste avant de réessayer.',
        document: null,
      };
    }
    if (error instanceof PersonnelDocumentScannerError) {
      await recordRejectedSafe(employeeId, idempotencyKey, 'scanner_rejected');
      return documentError(
        'Le fichier n’a pas été accepté par le contrôle de sécurité.',
      );
    }
    if (error instanceof z.ZodError) {
      await recordRejectedSafe(employeeId, idempotencyKey, 'invalid_file');
      return documentError('Vérifiez le fichier puis réessayez.');
    }
    await recordRejectedSafe(employeeId, idempotencyKey, 'storage_failure');
    console.error('Failed to save a personnel document.', error);
    return documentError(
      'Impossible d’enregistrer le document pour le moment. Réessayez.',
    );
  }

  async function recordRejectedSafe(
    rejectedEmployeeId: string,
    operationId: string,
    reasonCode: 'invalid_file' | 'scanner_rejected' | 'storage_failure',
  ) {
    try {
      await recordPersonnelDocumentUploadRejected(
        cloudDatabase,
        tenant,
        rejectedEmployeeId,
        operationId,
        reasonCode,
      );
    } catch {
      console.error('Failed to record a rejected personnel document upload.');
    }
  }
}

export async function loadEmployeeAmendmentsAction(
  employeeId: string,
  cursor?: string,
): Promise<LoadEmployeeAmendmentsActionResult> {
  const { tenant } = await requirePersonnelTenant('/equipe/salaries');
  requirePersonnelPermission(tenant, 'personnel.document.read');
  try {
    const amendments = await listPersonnelContractAmendments(
      cloudDatabase,
      tenant,
      employeeId,
      cursor,
    );
    return { status: 'success', amendments };
  } catch (error: unknown) {
    console.error('Failed to load personnel contract amendments.', error);
    return {
      status: 'error',
      message: 'Impossible de charger les avenants. Réessayez.',
    };
  }
}

export async function saveEmployeeAmendmentAction(
  _previousState: SaveEmployeeAmendmentActionState,
  formData: FormData,
): Promise<SaveEmployeeAmendmentActionState> {
  const { tenant } = await requirePersonnelTenant('/equipe/salaries');
  requirePersonnelPermission(tenant, 'personnel.document.manage');
  const employeeId = String(formData.get('employeeId') ?? '');
  const amendmentId = nullableText(formData.get('amendmentId'));
  const idempotencyKey = String(formData.get('idempotencyKey') ?? '');
  const mode = formData.get('mode') === 'replace' ? 'replace' : 'create';
  const values = {
    effectiveDate: String(formData.get('effectiveDate') ?? ''),
    reference: String(formData.get('reference') ?? ''),
  };
  let storageKey: string | null = null;
  try {
    const commandInput =
      mode === 'replace'
        ? replaceAmendmentFormSchema.parse({
            amendmentId,
            expectedRevision: formData.get('expectedRevision'),
          })
        : createAmendmentFormSchema.parse({
            effectiveDate: formData.get('effectiveDate'),
            reference: nullableText(formData.get('reference')),
          });
    const file = formData.get('file');
    if (!(file instanceof File) || file.size === 0) {
      return amendmentError(
        'Sélectionnez un fichier PDF.',
        {
          file: 'Sélectionnez un fichier PDF.',
        },
        values,
      );
    }
    if (file.size > 10 * 1024 * 1024) {
      await recordRejectedSafe('invalid_file');
      return amendmentError(
        'Le fichier ne doit pas dépasser 10 Mo.',
        {
          file: 'Choisissez un fichier de 10 Mo maximum.',
        },
        values,
      );
    }
    const content = new Uint8Array(await file.arrayBuffer());
    if (
      file.type !== 'application/pdf' ||
      new TextDecoder('ascii').decode(content.slice(0, 5)) !== '%PDF-'
    ) {
      await recordRejectedSafe('invalid_file');
      return amendmentError(
        'Seuls les fichiers PDF valides sont acceptés.',
        {
          file: 'Choisissez un fichier PDF valide.',
        },
        values,
      );
    }
    const runtime = await getPersonnelDocumentRuntime();
    storageKey = await runtime.storage.putQuarantinedObject(content);
    const quarantined = await runtime.storage.readQuarantinedObject(storageKey);
    await runtime.scanner.inspectQuarantinedObject(quarantined);
    await runtime.storage.promoteVerifiedObject(storageKey);
    const fileMetadata = {
      idempotencyKey,
      employeeId,
      filename: sanitizeDocumentFilename(file.name, 'avenant-signe'),
      mediaType: 'application/pdf' as const,
      byteSize: file.size,
      checksum: createHash('sha256').update(content).digest('hex'),
      storageKey,
    };
    const result =
      mode === 'replace'
        ? await replacePersonnelContractAmendmentMetadata(
            cloudDatabase,
            tenant,
            {
              ...fileMetadata,
              amendmentId:
                'amendmentId' in commandInput ? commandInput.amendmentId : '',
              expectedRevision:
                'expectedRevision' in commandInput
                  ? commandInput.expectedRevision
                  : 0,
            },
          )
        : await createPersonnelContractAmendmentMetadata(
            cloudDatabase,
            tenant,
            {
              ...fileMetadata,
              effectiveDate:
                'effectiveDate' in commandInput
                  ? commandInput.effectiveDate
                  : '',
              reference:
                'reference' in commandInput ? commandInput.reference : null,
            },
          );
    if (result.idempotentReplay) {
      await runtime.storage.removeObject(storageKey);
    }
    revalidatePath('/equipe/salaries');
    return {
      status: 'success',
      message: result.idempotentReplay
        ? 'Cet avenant avait déjà été enregistré.'
        : mode === 'replace'
          ? 'Le fichier de cet avenant a été vérifié et remplacé.'
          : 'L’avenant signé a été vérifié et enregistré.',
      fieldErrors: {},
      amendment: result.amendment,
      values: { effectiveDate: '', reference: '' },
    };
  } catch (error: unknown) {
    if (storageKey) {
      try {
        const runtime = await getPersonnelDocumentRuntime();
        await runtime.storage.removeObject(storageKey);
      } catch {
        console.error('Failed to clean up a personnel amendment object.');
      }
    }
    if (
      error instanceof PersonnelContractAmendmentRepositoryError &&
      error.code === 'CONFLICT'
    ) {
      return {
        status: 'conflict',
        message:
          'Cet avenant a changé depuis son ouverture. Rechargez la liste avant de réessayer.',
        fieldErrors: {},
        amendment: null,
        values,
      };
    }
    if (
      error instanceof PersonnelContractAmendmentRepositoryError &&
      error.code === 'IDEMPOTENCY_CONFLICT'
    ) {
      return amendmentError(
        'Cette tentative a déjà été utilisée avec d’autres valeurs. Fermez puis rouvrez le formulaire.',
        {},
        values,
      );
    }
    if (
      error instanceof PersonnelContractAmendmentRepositoryError &&
      error.code === 'NOT_FOUND'
    ) {
      return amendmentError(
        'Cet avenant n’est plus disponible. Rechargez la liste puis réessayez.',
        {},
        values,
      );
    }
    if (error instanceof PersonnelDocumentScannerError) {
      await recordRejectedSafe('scanner_rejected');
      return amendmentError(
        'Le fichier n’a pas été accepté par le contrôle de sécurité.',
        {},
        values,
      );
    }
    if (error instanceof z.ZodError) {
      await recordRejectedSafe('invalid_file');
      const fieldErrors: Record<string, string> = {};
      for (const issue of error.issues) {
        const field = String(issue.path[0] ?? 'form');
        fieldErrors[field] ??=
          field === 'effectiveDate'
            ? 'Indiquez une date d’effet valide.'
            : field === 'reference'
              ? 'La référence doit contenir 80 caractères maximum.'
              : 'Vérifiez cette valeur.';
      }
      return amendmentError(
        'Certains champs doivent être corrigés.',
        fieldErrors,
        values,
      );
    }
    await recordRejectedSafe('storage_failure');
    console.error('Failed to save a personnel contract amendment.', error);
    return amendmentError(
      'Impossible d’enregistrer l’avenant pour le moment. Réessayez.',
      {},
      values,
    );
  }

  async function recordRejectedSafe(
    reasonCode: 'invalid_file' | 'scanner_rejected' | 'storage_failure',
  ) {
    try {
      await recordPersonnelContractAmendmentUploadRejected(
        cloudDatabase,
        tenant,
        employeeId,
        idempotencyKey,
        reasonCode,
        mode === 'replace' ? (amendmentId ?? undefined) : undefined,
      );
    } catch {
      console.error('Failed to record a rejected amendment upload.');
    }
  }
}

function documentError(message: string): SaveEmployeeDocumentActionState {
  return { status: 'error', message, document: null };
}

function amendmentError(
  message: string,
  fieldErrors: Record<string, string> = {},
  values: SaveEmployeeAmendmentActionState['values'] = {
    effectiveDate: '',
    reference: '',
  },
): SaveEmployeeAmendmentActionState {
  return {
    status: 'error',
    message,
    fieldErrors,
    amendment: null,
    values,
  };
}

function sanitizeDocumentFilename(
  value: string,
  fallback = 'contrat-signe',
): string {
  const normalized = value
    .replaceAll('\\', '/')
    .split('/')
    .at(-1)
    ?.replace(/[\u0000-\u001F\u007F]/gu, '')
    .trim();
  const base = normalized?.replace(/\.pdf$/iu, '').trim() || fallback;
  return `${base.slice(0, 176)}.pdf`;
}

export async function loadEmployeeAccessHistoryAction(
  employeeId: string,
  operationId: string,
  cursor?: string,
): Promise<LoadEmployeeAccessHistoryActionResult> {
  const { tenant } = await requirePersonnelTenant('/equipe/salaries');
  requirePersonnelPermission(tenant, 'personnel.employee.read');

  try {
    const allowed = await recordPersonnelEmployeeAccess(
      cloudDatabase,
      tenant,
      employeeId,
      'employee.access_history_viewed',
      operationId,
    );
    if (!allowed) {
      return {
        status: 'error',
        message: 'Impossible de charger les consultations. Réessayez.',
      };
    }
    const history = await listPersonnelEmployeeAccessHistory(
      cloudDatabase,
      tenant,
      employeeId,
      cursor,
    );
    return { status: 'success', history };
  } catch (error: unknown) {
    console.error('Failed to load personnel employee access history.', error);
    return {
      status: 'error',
      message: 'Impossible de charger les consultations. Réessayez.',
    };
  }
}

export async function loadEmployeeHistoryAction(
  employeeId: string,
  operationId: string,
): Promise<LoadEmployeeHistoryActionResult> {
  const { tenant } = await requirePersonnelTenant('/equipe/salaries');
  requirePersonnelPermission(tenant, 'personnel.employee.read');

  try {
    const allowed = await recordPersonnelEmployeeAccess(
      cloudDatabase,
      tenant,
      employeeId,
      'employee.history_viewed',
      operationId,
    );
    if (!allowed) {
      return {
        status: 'error',
        message: 'Impossible de charger l’historique. Réessayez.',
      };
    }
    const history = await listPersonnelEmployeeAuditHistory(
      cloudDatabase,
      tenant,
      employeeId,
    );
    return { status: 'success', history };
  } catch (error: unknown) {
    console.error('Failed to load personnel employee history.', error);
    return {
      status: 'error',
      message: 'Impossible de charger l’historique. Réessayez.',
    };
  }
}

export async function recordEmployeeDossierViewAction(
  employeeId: string,
  operationId: string,
): Promise<{ status: 'success' } | { status: 'error'; message: string }> {
  const { tenant } = await requirePersonnelTenant('/equipe/salaries');
  requirePersonnelPermission(tenant, 'personnel.employee.read');
  try {
    const allowed = await recordPersonnelEmployeeAccess(
      cloudDatabase,
      tenant,
      employeeId,
      'employee.dossier_viewed',
      operationId,
    );
    return allowed
      ? { status: 'success' }
      : {
          status: 'error',
          message: 'La traçabilité du dossier est indisponible. Réessayez.',
        };
  } catch (error: unknown) {
    console.error('Failed to record personnel dossier access.', error);
    return {
      status: 'error',
      message: 'La traçabilité du dossier est indisponible. Réessayez.',
    };
  }
}

export async function createEmployeeAction(
  _previousState: CreateEmployeeActionState,
  formData: FormData,
): Promise<CreateEmployeeActionState> {
  const { tenant } = await requirePersonnelTenant('/equipe/salaries');
  requirePersonnelPermission(tenant, 'personnel.employee.manage');

  try {
    const employmentTermType = String(formData.get('employmentTermType') ?? '');
    const input = createPersonnelEmployeeInputSchema.parse({
      idempotencyKey: formData.get('idempotencyKey'),
      givenNames: formData.get('givenNames'),
      familyName: formData.get('familyName'),
      position: formData.get('position'),
      qualification: formData.get('qualification'),
      employmentTermType,
      expectedEndDate:
        employmentTermType === 'fixed_term'
          ? nullableText(formData.get('expectedEndDate'))
          : null,
      fixedTermReasonCode:
        employmentTermType === 'fixed_term'
          ? nullableText(formData.get('fixedTermReasonCode'))
          : null,
      workTimeCategory: formData.get('workTimeCategory'),
      contractWeeklyMinutes: contractWeeklyMinutes(formData),
      entryDate: formData.get('entryDate'),
      confirmDuplicate: formData.get('confirmDuplicate') === 'true',
      duplicateOverrideReason: nullableText(
        formData.get('duplicateOverrideReason'),
      ),
    });
    const result = await createPersonnelEmployee(
      cloudDatabase,
      tenant,
      input,
      getBusinessDate(tenant.timezone),
    );
    revalidatePath('/equipe/salaries');
    return {
      status: 'success',
      message: 'Le dossier minimum a été créé.',
      employeeId: result.employee.id,
      fieldErrors: {},
      duplicateCandidates: [],
    };
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of error.issues) {
        const field = String(issue.path[0] ?? 'form');
        fieldErrors[field] ??= frenchFieldError(field);
      }
      return {
        status: 'error',
        message: 'Certains champs doivent être corrigés.',
        employeeId: null,
        fieldErrors,
        duplicateCandidates: [],
      };
    }
    if (error instanceof PersonnelDuplicateError) {
      return {
        status: 'duplicate',
        message:
          'Un dossier portant le même nom existe peut-être dans cet établissement.',
        employeeId: null,
        fieldErrors: {},
        duplicateCandidates: error.candidates,
      };
    }
    if (
      error instanceof PersonnelRepositoryError &&
      error.code === 'IDEMPOTENCY_CONFLICT'
    ) {
      return {
        status: 'error',
        message:
          'Cette tentative a déjà été utilisée avec d’autres valeurs. Fermez puis rouvrez le formulaire.',
        employeeId: null,
        fieldErrors: {},
        duplicateCandidates: [],
      };
    }
    console.error('Failed to create personnel employee.', error);
    return {
      status: 'error',
      message: 'Impossible d’enregistrer le dossier. Réessayez.',
      employeeId: null,
      fieldErrors: {},
      duplicateCandidates: [],
    };
  }
}

export async function updateEmployeeAction(
  _previousState: UpdateEmployeeActionState,
  formData: FormData,
): Promise<UpdateEmployeeActionState> {
  const { tenant } = await requirePersonnelTenant('/equipe/salaries');
  requirePersonnelPermission(tenant, 'personnel.employee.manage');

  try {
    const employmentTermType = String(formData.get('employmentTermType') ?? '');
    const input = updatePersonnelEmployeeInputSchema.parse({
      idempotencyKey: formData.get('idempotencyKey'),
      employeeId: formData.get('employeeId'),
      expectedRevision: formData.get('expectedRevision'),
      givenNames: formData.get('givenNames'),
      familyName: formData.get('familyName'),
      position: formData.get('position'),
      qualification: formData.get('qualification'),
      employmentTermType,
      expectedEndDate:
        employmentTermType === 'fixed_term'
          ? nullableText(formData.get('expectedEndDate'))
          : null,
      fixedTermReasonCode:
        employmentTermType === 'fixed_term'
          ? nullableText(formData.get('fixedTermReasonCode'))
          : null,
      workTimeCategory: formData.get('workTimeCategory'),
      contractWeeklyMinutes: contractWeeklyMinutes(formData),
      entryDate: formData.get('entryDate'),
      confirmFixedTermReasonClear:
        formData.get('confirmFixedTermReasonClear') === 'true',
    });
    const result = await updatePersonnelEmployee(
      cloudDatabase,
      tenant,
      input,
      getBusinessDate(tenant.timezone),
    );
    revalidatePath('/equipe/salaries');
    return {
      status: 'success',
      message: result.updated
        ? 'Les modifications ont été enregistrées.'
        : 'Aucune modification à enregistrer.',
      fieldErrors: {},
      currentEmployee: result.employee,
    };
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of error.issues) {
        const field = String(issue.path[0] ?? 'form');
        fieldErrors[field] ??= frenchFieldError(field);
      }
      return {
        status: 'error',
        message: 'Certains champs doivent être corrigés.',
        fieldErrors,
        currentEmployee: null,
      };
    }
    if (
      error instanceof PersonnelRepositoryError &&
      error.code === 'INVALID_EMPLOYMENT_DATES'
    ) {
      return {
        status: 'error',
        message:
          'La date d’entrée ne peut pas être postérieure au départ déjà enregistré.',
        fieldErrors: {
          entryDate: 'Choisissez une date antérieure ou égale au départ.',
        },
        currentEmployee: null,
      };
    }
    if (error instanceof PersonnelConflictError) {
      return {
        status: 'conflict',
        message:
          'Ce dossier a été modifié depuis son ouverture. Vos valeurs sont conservées : rechargez la version actuelle avant de réessayer.',
        fieldErrors: {},
        currentEmployee: error.currentEmployee,
      };
    }
    if (
      error instanceof PersonnelRepositoryError &&
      error.code === 'IDEMPOTENCY_CONFLICT'
    ) {
      return {
        status: 'error',
        message:
          'Cette tentative a déjà été utilisée avec d’autres valeurs. Fermez puis rouvrez le formulaire.',
        fieldErrors: {},
        currentEmployee: null,
      };
    }
    if (
      error instanceof PersonnelRepositoryError &&
      error.code === 'FIXED_TERM_REASON_REQUIRED'
    ) {
      return {
        status: 'error',
        message: 'Choisissez un motif pris en charge pour ce CDD.',
        fieldErrors: {
          fixedTermReasonCode: 'Choisissez le motif du CDD.',
        },
        currentEmployee: null,
      };
    }
    if (
      error instanceof PersonnelRepositoryError &&
      error.code === 'FIXED_TERM_REASON_CLEAR_CONFIRMATION_REQUIRED'
    ) {
      return {
        status: 'error',
        message: 'Confirmez la suppression du motif CDD avant de continuer.',
        fieldErrors: {
          confirmFixedTermReasonClear:
            'Confirmez que le motif CDD doit être supprimé.',
        },
        currentEmployee: null,
      };
    }
    console.error('Failed to update personnel employee.', error);
    return {
      status: 'error',
      message: 'Impossible d’enregistrer les modifications. Réessayez.',
      fieldErrors: {},
      currentEmployee: null,
    };
  }
}

export async function setEmployeeDepartureAction(
  _previousState: DepartureEmployeeActionState,
  formData: FormData,
): Promise<DepartureEmployeeActionState> {
  const { tenant } = await requirePersonnelTenant('/equipe/salaries');
  requirePersonnelPermission(tenant, 'personnel.employee.manage');

  try {
    const input = setPersonnelEmployeeDepartureInputSchema.parse({
      idempotencyKey: formData.get('idempotencyKey'),
      employeeId: formData.get('employeeId'),
      expectedRevision: formData.get('expectedRevision'),
      departureDate: nullableText(formData.get('departureDate')),
      correctionReason: nullableText(formData.get('correctionReason')),
      confirmNonDeletion: formData.get('confirmNonDeletion') === 'true',
    });
    const result = await setPersonnelEmployeeDeparture(
      cloudDatabase,
      tenant,
      input,
      getBusinessDate(tenant.timezone),
    );
    revalidatePath('/equipe/salaries');
    return {
      status: 'success',
      message: result.updated
        ? input.departureDate
          ? 'Le départ a été enregistré.'
          : 'Le départ planifié a été annulé.'
        : 'Aucune modification à enregistrer.',
      fieldErrors: {},
      currentEmployee: result.employee,
    };
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of error.issues) {
        const field = String(issue.path[0] ?? 'form');
        fieldErrors[field] ??= frenchFieldError(field);
      }
      return {
        status: 'error',
        message: 'Vérifiez les informations avant de confirmer.',
        fieldErrors,
        currentEmployee: null,
      };
    }
    if (error instanceof PersonnelConflictError) {
      return {
        status: 'conflict',
        message:
          'Ce dossier a été modifié depuis son ouverture. Rechargez la version actuelle avant de réessayer.',
        fieldErrors: {},
        currentEmployee: error.currentEmployee,
      };
    }
    if (error instanceof PersonnelRepositoryError) {
      if (error.code === 'IDEMPOTENCY_CONFLICT') {
        return {
          status: 'error',
          message:
            'Cette tentative a déjà été utilisée avec d’autres valeurs. Fermez puis rouvrez le formulaire.',
          fieldErrors: {},
          currentEmployee: null,
        };
      }
      if (error.code === 'INVALID_EMPLOYMENT_DATES') {
        return {
          status: 'error',
          message:
            'Le dernier jour travaillé ne peut pas être antérieur à la date d’entrée.',
          fieldErrors: {
            departureDate:
              'Choisissez une date égale ou postérieure à l’entrée.',
          },
          currentEmployee: null,
        };
      }
      if (error.code === 'REASON_REQUIRED') {
        return {
          status: 'error',
          message:
            'Une raison est obligatoire pour corriger ou annuler un départ.',
          fieldErrors: {
            correctionReason: 'Expliquez brièvement la correction.',
          },
          currentEmployee: null,
        };
      }
      if (error.code === 'DEPARTURE_DATE_REQUIRED') {
        return {
          status: 'error',
          message: 'Renseignez le dernier jour travaillé.',
          fieldErrors: {
            departureDate: 'Choisissez une date de départ.',
          },
          currentEmployee: null,
        };
      }
    }
    console.error('Failed to set personnel employee departure.', error);
    return {
      status: 'error',
      message: 'Impossible d’enregistrer le départ. Réessayez.',
      fieldErrors: {},
      currentEmployee: null,
    };
  }
}

function nullableText(value: FormDataEntryValue | null): string | null {
  const normalized = String(value ?? '').trim();
  return normalized || null;
}

function contractWeeklyMinutes(formData: FormData): number | null {
  const hoursValue = String(formData.get('contractWeeklyHours') ?? '').trim();
  const minutesValue = String(
    formData.get('contractWeeklyMinuteRemainder') ?? '',
  ).trim();
  if (!hoursValue && !minutesValue) return null;

  const hours = Number(hoursValue);
  const minutes = Number(minutesValue);
  if (
    !Number.isInteger(hours) ||
    !Number.isInteger(minutes) ||
    hours < 0 ||
    hours > 48 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return Number.NaN;
  }
  return hours * 60 + minutes;
}

function frenchFieldError(field: string): string {
  const messages: Record<string, string> = {
    givenNames: 'Renseignez les prénoms (120 caractères maximum).',
    familyName: 'Renseignez le nom (120 caractères maximum).',
    position: 'Renseignez le poste (120 caractères maximum).',
    qualification: 'Renseignez la qualification (120 caractères maximum).',
    employmentTermType: 'Choisissez CDI ou CDD.',
    expectedEndDate: 'Renseignez une date de fin valide pour le CDD.',
    fixedTermReasonCode: 'Choisissez le motif du CDD.',
    workTimeCategory: 'Choisissez le temps de travail.',
    contractWeeklyMinutes:
      'Renseignez une durée comprise entre 1 minute et 48 heures.',
    entryDate: 'Renseignez une date d’entrée valide.',
    confirmFixedTermReasonClear:
      'Confirmez que le motif CDD doit être supprimé.',
    duplicateOverrideReason:
      'Expliquez en quelques mots pourquoi il s’agit d’un dossier distinct.',
    departureDate: 'Renseignez une date de départ valide.',
    correctionReason: 'Expliquez brièvement la correction.',
    confirmNonDeletion: 'Confirmez que le dossier doit être conservé.',
  };
  return messages[field] ?? 'Vérifiez cette valeur.';
}
