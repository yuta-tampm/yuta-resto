import 'server-only';

import {
  POINTAGE_CREDENTIAL_ALGORITHM_VERSION,
  POINTAGE_CREDENTIAL_FORMAT_VERSION,
  POINTAGE_CREDENTIAL_KEY_VERSION,
  createPointageCandidateRateLimitDigest,
  createPointageClientRateLimitDigest,
  createPointageCredentialVerifier,
  createPointageLookupDigest,
  decodePointageAuthSecret,
  derivePointageCredentialKeys,
  generatePointageCredential,
  normalizePointageCredential,
  runPointageDummyVerification,
  verifyPointageCredential,
  type PointageCredentialKeys,
  type AuthenticatedSession,
} from '@yuta/auth';
import {
  PointageCredentialAlreadyExistsError,
  PointageCredentialCollisionExhaustedError,
  PointageCredentialMissingError,
  PointageDossierNotInScopeError,
  type PointageAuditReasonCode,
  type PointageAuditWrite,
  type PointageCredentialMaterial,
  type PointageRepository,
  type PointageRepositoryScope,
} from '@yuta/db-cloud';
import { normalizeTenantSlug, type TenantContext } from '@yuta/tenant';
import {
  POINTAGE_OPERATIONS,
  PointageAuthorizationError,
  createPointageEmployeeContext,
  createPointageManagerContext,
  requirePointageManagerOperation,
  type PointageEmployeeContext,
  type PointageEmployeeOperation,
  type PointageManagerContext,
  type PointageManagerOperation,
  type VerifiedPointageCredential,
} from './authorization';

const RATE_WINDOW_MS = 15 * 60 * 1_000;
const RATE_BLOCK_MS = 15 * 60 * 1_000;
const CANDIDATE_FAILURE_LIMIT = 5;
const CLIENT_FAILURE_LIMIT = 30;

export type PointageEntryScope = Readonly<{
  organizationId: string;
  establishmentId: string;
  locale: string;
  timezone: string;
}>;

export type TrustedPointageClientAddress = Readonly<{
  address: string;
  provenance: 'SERVER_VERIFIED';
}>;

export interface TrustedPointageClientAddressProvider {
  getTrustedClientAddress(): Promise<TrustedPointageClientAddress | null>;
}

export type PointageValidationResult =
  | Readonly<{
      status: 'VERIFIED';
      credential: VerifiedPointageCredential;
      entryScope: PointageEntryScope;
    }>
  | Readonly<{
      status:
        | 'POINTAGE_CREDENTIAL_INVALID'
        | 'POINTAGE_TRY_LATER'
        | 'POINTAGE_UNAVAILABLE';
    }>;

export type OneTimePointageCredentialPresentation = Readonly<{
  presentationType: 'ONE_TIME_POINTAGE_CREDENTIAL';
  credential: string;
  credentialId: string;
  credentialVersion: number;
}>;

type ValidationRepository = Pick<
  PointageRepository,
  | 'resolveActiveEntryScope'
  | 'findCredentialCandidate'
  | 'isRateLimitBlocked'
  | 'recordRateLimitFailure'
  | 'resetCandidateRateLimit'
  | 'appendAudit'
  | 'findPersonnelEmploymentPeriod'
>;

function normalizeEstablishmentSlug(value: string): string | null {
  try {
    return normalizeTenantSlug(value);
  } catch {
    return null;
  }
}

function businessDate(now: Date, timezone: string): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now);
  const read = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value;
  const year = read('year');
  const month = read('month');
  const day = read('day');
  if (year === undefined || month === undefined || day === undefined) {
    throw new Error('Trusted Pointage business date could not be derived.');
  }
  return `${year}-${month}-${day}`;
}

function credentialMaterial(
  keys: PointageCredentialKeys,
  scope: PointageRepositoryScope,
  credential: string,
  verifier: Awaited<ReturnType<typeof createPointageCredentialVerifier>>,
): PointageCredentialMaterial {
  return Object.freeze({
    lookupDigest: createPointageLookupDigest(keys, scope, credential),
    credentialFormatVersion: POINTAGE_CREDENTIAL_FORMAT_VERSION,
    algorithmVersion: verifier.algorithmVersion,
    keyVersion: verifier.keyVersion,
    salt: verifier.salt,
    verifier: verifier.verifier,
  });
}

export function createPointageServerFoundation(
  input: Readonly<{
    repository: PointageRepository;
    encodedAuthSecret: string;
    clientAddressProvider: TrustedPointageClientAddressProvider;
    now?: () => Date;
    generateCredential?: () => string;
  }>,
) {
  if (
    input.clientAddressProvider === null ||
    typeof input.clientAddressProvider?.getTrustedClientAddress !== 'function'
  ) {
    throw new Error('Trusted Pointage client-address provider is required.');
  }
  const keys = derivePointageCredentialKeys(
    decodePointageAuthSecret(input.encodedAuthSecret),
  );
  const now = input.now ?? (() => new Date());
  const generateCredential =
    input.generateCredential ?? generatePointageCredential;

  async function appendDeniedAudit(
    scope: PointageRepositoryScope,
    reasonCode: PointageAuditReasonCode,
    eventType: PointageAuditWrite['eventType'],
    extra: Partial<PointageAuditWrite> = {},
  ): Promise<void> {
    await input.repository.appendAudit({
      ...scope,
      ...extra,
      eventType,
      outcome: 'denied',
      reasonCode,
      occurredAt: now(),
    });
  }

  async function validateCredentialInternal(
    request: Readonly<{
      establishmentSlug: string;
      credential: string;
    }>,
  ): Promise<PointageValidationResult> {
    const slug = normalizeEstablishmentSlug(request.establishmentSlug);
    if (slug === null) {
      return Object.freeze({ status: 'POINTAGE_UNAVAILABLE' });
    }
    const resolvedScope = await input.repository.resolveActiveEntryScope(slug);
    if (resolvedScope === null) {
      return Object.freeze({ status: 'POINTAGE_UNAVAILABLE' });
    }
    const entryScope = Object.freeze({ ...resolvedScope });
    const trustedClient =
      await input.clientAddressProvider.getTrustedClientAddress();
    if (
      trustedClient === null ||
      trustedClient.provenance !== 'SERVER_VERIFIED' ||
      trustedClient.address.length === 0
    ) {
      await appendDeniedAudit(
        entryScope,
        'client_address_untrusted',
        'pointage.credential.authentication_denied',
      );
      return Object.freeze({ status: 'POINTAGE_UNAVAILABLE' });
    }

    const attemptTime = now();
    const clientDigest = createPointageClientRateLimitDigest(
      keys,
      entryScope,
      trustedClient.address,
    );
    if (
      await input.repository.isRateLimitBlocked(
        entryScope,
        'client',
        clientDigest,
        attemptTime,
      )
    ) {
      await appendDeniedAudit(
        entryScope,
        'rate_limited',
        'pointage.credential.rate_limited',
      );
      return Object.freeze({ status: 'POINTAGE_TRY_LATER' });
    }

    const normalized = normalizePointageCredential(request.credential);
    const candidateDigest = createPointageCandidateRateLimitDigest(
      keys,
      entryScope,
      normalized ?? request.credential,
    );
    if (
      await input.repository.isRateLimitBlocked(
        entryScope,
        'candidate',
        candidateDigest,
        attemptTime,
      )
    ) {
      await appendDeniedAudit(
        entryScope,
        'rate_limited',
        'pointage.credential.rate_limited',
      );
      return Object.freeze({ status: 'POINTAGE_TRY_LATER' });
    }

    const candidate =
      normalized === null
        ? null
        : await input.repository.findCredentialCandidate(
            entryScope,
            createPointageLookupDigest(keys, entryScope, normalized),
          );
    const supportedCurrent =
      candidate !== null &&
      candidate.supersededAt === null &&
      candidate.credentialFormatVersion ===
        POINTAGE_CREDENTIAL_FORMAT_VERSION &&
      candidate.algorithmVersion === POINTAGE_CREDENTIAL_ALGORITHM_VERSION &&
      candidate.keyVersion === POINTAGE_CREDENTIAL_KEY_VERSION;
    const valid = supportedCurrent
      ? await verifyPointageCredential(keys, normalized!, {
          algorithmVersion: POINTAGE_CREDENTIAL_ALGORITHM_VERSION,
          keyVersion: POINTAGE_CREDENTIAL_KEY_VERSION,
          salt: candidate.salt,
          verifier: candidate.verifier,
        })
      : await runPointageDummyVerification(
          keys,
          entryScope,
          normalized ?? request.credential,
        );

    if (!valid || !supportedCurrent || candidate === null) {
      await Promise.all([
        input.repository.recordRateLimitFailure({
          scope: entryScope,
          keyKind: 'candidate',
          keyDigest: candidateDigest,
          now: attemptTime,
          windowMs: RATE_WINDOW_MS,
          failureLimit: CANDIDATE_FAILURE_LIMIT,
          blockMs: RATE_BLOCK_MS,
        }),
        input.repository.recordRateLimitFailure({
          scope: entryScope,
          keyKind: 'client',
          keyDigest: clientDigest,
          now: attemptTime,
          windowMs: RATE_WINDOW_MS,
          failureLimit: CLIENT_FAILURE_LIMIT,
          blockMs: RATE_BLOCK_MS,
        }),
      ]);
      const reasonCode: PointageAuditReasonCode =
        candidate?.supersededAt !== null &&
        candidate?.supersededAt !== undefined
          ? 'superseded_credential'
          : candidate !== null && !supportedCurrent
            ? 'unsupported_version'
            : 'invalid_credential';
      await appendDeniedAudit(
        entryScope,
        reasonCode,
        'pointage.credential.authentication_denied',
        candidate === null
          ? {}
          : {
              personnelDossierId: candidate.personnelDossierId,
              credentialId: candidate.id,
              credentialVersion: candidate.credentialVersion,
            },
      );
      return Object.freeze({ status: 'POINTAGE_CREDENTIAL_INVALID' });
    }

    await input.repository.resetCandidateRateLimit(
      entryScope,
      candidateDigest,
      attemptTime,
    );
    const credential = Object.freeze({
      proofType: 'VERIFIED_POINTAGE_CREDENTIAL' as const,
      organizationId: entryScope.organizationId,
      establishmentId: entryScope.establishmentId,
      personnelDossierId: candidate.personnelDossierId,
      credentialId: candidate.id,
      credentialVersion: candidate.credentialVersion,
    });
    await input.repository.appendAudit({
      ...entryScope,
      eventType: 'pointage.credential.authentication_succeeded',
      outcome: 'succeeded',
      personnelDossierId: candidate.personnelDossierId,
      credentialId: candidate.id,
      credentialVersion: candidate.credentialVersion,
      occurredAt: attemptTime,
    });
    return Object.freeze({ status: 'VERIFIED', credential, entryScope });
  }

  async function validateCredential(
    request: Readonly<{
      establishmentSlug: string;
      credential: string;
    }>,
  ): Promise<PointageValidationResult> {
    try {
      return await validateCredentialInternal(request);
    } catch {
      return Object.freeze({ status: 'POINTAGE_UNAVAILABLE' });
    }
  }

  async function authorizeEmployeeOperationInternal(
    inputOperation: Readonly<{
      credential: VerifiedPointageCredential;
      entryScope: PointageEntryScope;
      operation: PointageEmployeeOperation;
    }>,
  ): Promise<PointageEmployeeContext | null> {
    if (
      inputOperation.credential.organizationId !==
        inputOperation.entryScope.organizationId ||
      inputOperation.credential.establishmentId !==
        inputOperation.entryScope.establishmentId
    ) {
      return null;
    }
    const employment = await input.repository.findPersonnelEmploymentPeriod(
      inputOperation.entryScope,
      inputOperation.credential.personnelDossierId,
    );
    if (employment === null) {
      await appendDeniedAudit(
        inputOperation.entryScope,
        'dossier_not_in_scope',
        'pointage.authorization.denied',
        { requestedOperation: inputOperation.operation },
      );
      return null;
    }
    const currentBusinessDate = businessDate(
      now(),
      inputOperation.entryScope.timezone,
    );
    const reason =
      currentBusinessDate < employment.entryDate
        ? 'before_entry'
        : employment.departureDate !== null &&
            currentBusinessDate > employment.departureDate
          ? 'after_departure'
          : null;
    if (reason !== null) {
      await appendDeniedAudit(
        inputOperation.entryScope,
        reason,
        'pointage.evidence_eligibility.denied',
        {
          personnelDossierId: employment.personnelDossierId,
          credentialId: inputOperation.credential.credentialId,
          credentialVersion: inputOperation.credential.credentialVersion,
          requestedOperation: inputOperation.operation,
        },
      );
      return null;
    }
    return createPointageEmployeeContext({
      credential: inputOperation.credential,
      operation: inputOperation.operation,
    });
  }

  async function authorizeEmployeeOperation(
    inputOperation: Readonly<{
      credential: VerifiedPointageCredential;
      entryScope: PointageEntryScope;
      operation: PointageEmployeeOperation;
    }>,
  ): Promise<PointageEmployeeContext | null> {
    try {
      return await authorizeEmployeeOperationInternal(inputOperation);
    } catch {
      return null;
    }
  }

  async function authorizeManagerOperation(
    inputOperation: Readonly<{
      session: AuthenticatedSession;
      tenant: TenantContext;
      operation: string;
    }>,
  ): Promise<PointageManagerContext | null> {
    try {
      return createPointageManagerContext(inputOperation);
    } catch {
      if (
        inputOperation.tenant.establishmentId !== null &&
        inputOperation.tenant.actor.type === 'user'
      ) {
        try {
          await appendDeniedAudit(
            {
              organizationId: inputOperation.tenant.organizationId,
              establishmentId: inputOperation.tenant.establishmentId,
            },
            'operation_not_granted',
            'pointage.authorization.denied',
            {
              managerUserId: inputOperation.tenant.actor.userId,
              requestedOperation: (
                POINTAGE_OPERATIONS as readonly string[]
              ).includes(inputOperation.operation)
                ? inputOperation.operation
                : undefined,
            },
          );
        } catch {
          // Authority remains denied when attribution persistence is unavailable.
        }
      }
      return null;
    }
  }

  async function appendLifecycleDenial(
    manager: PointageManagerContext,
    personnelDossierId: string,
    operation: PointageManagerOperation,
    error: unknown,
  ): Promise<void> {
    const reasonCode =
      error instanceof PointageAuthorizationError
        ? 'operation_not_granted'
        : error instanceof PointageDossierNotInScopeError
          ? 'dossier_not_in_scope'
          : undefined;
    try {
      await input.repository.appendAudit({
        organizationId: manager.organizationId,
        establishmentId: manager.establishmentId,
        eventType: 'pointage.authorization.denied',
        outcome: 'denied',
        reasonCode,
        managerUserId: manager.userId,
        personnelDossierId:
          error instanceof PointageDossierNotInScopeError
            ? undefined
            : personnelDossierId,
        requestedOperation: operation,
        occurredAt: now(),
      });
    } catch {
      // The original command stays failed and no plaintext is returned.
    }
  }

  async function issueCredential(
    inputCommand: Readonly<{
      manager: PointageManagerContext;
      personnelDossierId: string;
    }>,
  ): Promise<OneTimePointageCredentialPresentation> {
    let plaintext: string | null = null;
    try {
      requirePointageManagerOperation(
        inputCommand.manager,
        'pointage.credential.issue',
      );
      const persisted = await input.repository.issueCredential({
        scope: inputCommand.manager,
        personnelDossierId: inputCommand.personnelDossierId,
        managerUserId: inputCommand.manager.userId,
        now: now(),
        createMaterial: async () => {
          plaintext = generateCredential();
          const verifier = await createPointageCredentialVerifier(
            keys,
            plaintext,
          );
          return credentialMaterial(
            keys,
            inputCommand.manager,
            plaintext,
            verifier,
          );
        },
      });
      if (plaintext === null) {
        throw new Error('Pointage credential presentation was not created.');
      }
      return Object.freeze({
        presentationType: 'ONE_TIME_POINTAGE_CREDENTIAL',
        credential: plaintext,
        ...persisted,
      });
    } catch (error: unknown) {
      plaintext = null;
      if (
        error instanceof PointageAuthorizationError ||
        error instanceof PointageDossierNotInScopeError ||
        error instanceof PointageCredentialAlreadyExistsError ||
        error instanceof PointageCredentialCollisionExhaustedError
      ) {
        await appendLifecycleDenial(
          inputCommand.manager,
          inputCommand.personnelDossierId,
          'pointage.credential.issue',
          error,
        );
      }
      throw error;
    }
  }

  async function resetCredential(
    inputCommand: Readonly<{
      manager: PointageManagerContext;
      personnelDossierId: string;
    }>,
  ): Promise<OneTimePointageCredentialPresentation> {
    let plaintext: string | null = null;
    try {
      requirePointageManagerOperation(
        inputCommand.manager,
        'pointage.credential.reset',
      );
      const persisted = await input.repository.resetCredential({
        scope: inputCommand.manager,
        personnelDossierId: inputCommand.personnelDossierId,
        managerUserId: inputCommand.manager.userId,
        now: now(),
        createMaterial: async () => {
          plaintext = generateCredential();
          const verifier = await createPointageCredentialVerifier(
            keys,
            plaintext,
          );
          return credentialMaterial(
            keys,
            inputCommand.manager,
            plaintext,
            verifier,
          );
        },
      });
      if (plaintext === null) {
        throw new Error('Pointage credential presentation was not created.');
      }
      return Object.freeze({
        presentationType: 'ONE_TIME_POINTAGE_CREDENTIAL',
        credential: plaintext,
        credentialId: persisted.credentialId,
        credentialVersion: persisted.credentialVersion,
      });
    } catch (error: unknown) {
      plaintext = null;
      if (
        error instanceof PointageAuthorizationError ||
        error instanceof PointageDossierNotInScopeError ||
        error instanceof PointageCredentialMissingError ||
        error instanceof PointageCredentialCollisionExhaustedError
      ) {
        await appendLifecycleDenial(
          inputCommand.manager,
          inputCommand.personnelDossierId,
          'pointage.credential.reset',
          error,
        );
      }
      throw error;
    }
  }

  return Object.freeze({
    validateCredential,
    authorizeEmployeeOperation,
    authorizeManagerOperation,
    issueCredential,
    resetCredential,
  });
}

export type PointageServerFoundation = ReturnType<
  typeof createPointageServerFoundation
>;
