import 'server-only';
import { normalizeTenantSlug } from '@yuta/tenant';
import {
  assertPointageFoundationDatabaseBoundary,
  assertPointageRawDatabaseBoundary,
  createPointageRepository,
  createPointageRawClockingRepository,
  type CloudDatabaseClient,
} from '@yuta/db-cloud';
import {
  createPointageServerFoundation,
  type PointageValidationRepository,
  type TrustedPointageClientAddressProvider,
} from './service';
import { createPointageRawClockingService } from './raw-clocking-service';
import {
  requirePointageRuntimeTarget,
  requirePointageClientSource,
  requirePointageClientIdentity,
  requirePointageActualTarget,
  refusePointageRuntime,
} from './raw-clocking-test-boundary';

// Construction is explicitly injected and test-only. No singleton, environment
// client, production provider or manager repository escapes this factory.
export async function createPointageRawClockingRuntime(
  input: Readonly<{
    environment: NodeJS.ProcessEnv;
    listeningHost: string;
    foundationClient?: CloudDatabaseClient;
    rawClient?: CloudDatabaseClient;
    encodedAuthSecret: string;
    stateGuardKey: Uint8Array;
    createSyntheticClientAddressProvider: () => TrustedPointageClientAddressProvider;
  }>,
) {
  try {
    const target = requirePointageRuntimeTarget(
      input.environment,
      input.listeningHost,
    );
    const foundationClient = input.foundationClient;
    const rawClient = input.rawClient;
    requirePointageClientSource(
      foundationClient,
      target,
      'yuta_pointage_foundation_runtime',
    );
    requirePointageClientSource(rawClient, target, 'yuta_pointage_raw_writer');
    if (
      foundationClient === rawClient ||
      foundationClient.$client === rawClient.$client
    )
      refusePointageRuntime();
    const guardKey = Uint8Array.from(input.stateGuardKey);
    if (guardKey.length !== 32) refusePointageRuntime();

    async function requireReady() {
      const currentTarget = requirePointageRuntimeTarget(
        input.environment,
        input.listeningHost,
      );
      if (
        currentTarget.hostname !== target.hostname ||
        currentTarget.port !== target.port ||
        currentTarget.name !== target.name
      )
        refusePointageRuntime();
      requirePointageClientSource(
        foundationClient,
        target,
        'yuta_pointage_foundation_runtime',
      );
      requirePointageClientSource(
        rawClient,
        target,
        'yuta_pointage_raw_writer',
      );
      await requirePointageActualTarget(foundationClient, target);
      const foundationDatabase = await requirePointageClientIdentity(
        foundationClient,
        target,
        'yuta_pointage_foundation_runtime',
      );
      const rawDatabase = await requirePointageClientIdentity(
        rawClient,
        target,
        'yuta_pointage_raw_writer',
      );
      if (foundationDatabase !== rawDatabase) refusePointageRuntime();
      await assertPointageFoundationDatabaseBoundary(foundationClient);
      await assertPointageRawDatabaseBoundary(rawClient);
    }
    await requireReady();
    const provider = input.createSyntheticClientAddressProvider();
    const address = await provider?.getTrustedClientAddress();
    if (
      !address ||
      address.provenance !== 'SERVER_VERIFIED' ||
      !address.address
    )
      refusePointageRuntime();

    const repository = createPointageRepository(foundationClient);
    const validation: PointageValidationRepository = Object.freeze({
      resolveActiveEntryScope: repository.resolveActiveEntryScope,
      findCredentialCandidate: repository.findCredentialCandidate,
      findPersonnelEmploymentPeriod: repository.findPersonnelEmploymentPeriod,
      isRateLimitBlocked: repository.isRateLimitBlocked,
      recordRateLimitFailure: repository.recordRateLimitFailure,
      resetCandidateRateLimit: repository.resetCandidateRateLimit,
      appendAudit: repository.appendAudit,
    });
    const foundation = createPointageServerFoundation({
      repository: validation,
      encodedAuthSecret: input.encodedAuthSecret,
      clientAddressProvider: provider,
    });
    const service = createPointageRawClockingService({
      foundation: Object.freeze({
        validateCredential: foundation.validateCredential,
        authorizeEmployeeOperation: foundation.authorizeEmployeeOperation,
      }),
      repository: createPointageRawClockingRepository(rawClient),
      stateGuardKey: guardKey,
      requireReady,
      resolveEntryScope: validation.resolveActiveEntryScope,
    });
    return Object.freeze({
      ...service,
      async context(establishmentSlug: string) {
        await requireReady();
        let slug: string;
        try {
          slug = normalizeTenantSlug(establishmentSlug);
        } catch {
          return null;
        }
        if (!(await validation.resolveActiveEntryScope(slug))) return null;
        return { available: true as const };
      },
    });
  } catch {
    return refusePointageRuntime();
  }
}
