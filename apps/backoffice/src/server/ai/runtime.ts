import 'server-only';
import { createAiExecutor } from './executor';
import type { AiExecutor, AiObservation } from './contracts';
import {
  DEVELOPMENT_OPENAI_EXTRACTION_MODEL,
  DEVELOPMENT_OPENAI_EXTRACTION_PROMPT_VERSION,
} from './policy';
import {
  ContractExtractionServiceError,
  DeterministicSyntheticExtractionAdapter,
  validateContractExtractionResult,
} from '../personnel-contract-extraction/service';
import { OpenAiContractExtractionAdapter } from '../personnel-contract-extraction/openai-adapter';
import {
  StoredSyntheticFixtureExtractionAdapter,
  StoredSyntheticProviderQaExtractionAdapter,
  type StoredSyntheticProviderQaGate,
} from '../personnel-contract-extraction/stored-synthetic-document';
import type { ContractExtractionRuntimeEnvironment } from '../personnel-contract-extraction/runtime';
export type CreatePersonnelExtractionExecutorOptions = Readonly<{
  environment?: ContractExtractionRuntimeEnvironment;
  fetchImplementation?: typeof fetch;
  now?: () => Date;
  timeoutMilliseconds?: number;
  storedProviderQaGate?: StoredSyntheticProviderQaGate;
  observe?: (observation: AiObservation) => void | Promise<void>;
}>;
export function createPersonnelExtractionExecutor(
  options: CreatePersonnelExtractionExecutorOptions = {},
): AiExecutor {
  const environment = options.environment ?? process.env;
  const mode =
    environment.YUTA_PERSONNEL_CONTRACT_EXTRACTION_MODE?.trim() ||
    'deterministic-synthetic';
  const apiKey = environment.YUTA_OPENAI_EVALUATION_API_KEY?.trim();
  const storedProviderOnce = options.storedProviderQaGate?.isEnabled() ?? false;
  if (
    environment.NODE_ENV !== 'development' ||
    (mode !== 'deterministic-synthetic' && mode !== 'openai-synthetic') ||
    (mode === 'openai-synthetic' && !apiKey) ||
    (storedProviderOnce && mode !== 'openai-synthetic')
  )
    throw new ContractExtractionServiceError(
      'The synthetic capability configuration is unavailable.',
      'SERVICE_FAILURE',
    );
  return createAiExecutor({
    configuration: {
      configurationId: 'personnel-synthetic',
      configurationVersion: 1,
      environment: 'development',
      mode,
      credentialConfigured: Boolean(apiKey),
      storedProviderOnce,
    },
    timeoutMilliseconds: options.timeoutMilliseconds,
    validateResult: validateContractExtractionResult,
    observe: (observation) => {
      if (
        observation.deploymentId === 'personnel-stored-provider-once' &&
        observation.outcome === 'success'
      ) {
        // Provider diagnostics are bridged from validated, allowlisted terminal metadata.
        console.info(
          'YUTA_OPENAI_STORED_SYNTHETIC_QA',
          JSON.stringify({
            capability: observation.capability,
            capabilityVersion: observation.capabilityVersion,
            deploymentId: observation.deploymentId,
            deploymentVersion: observation.deploymentVersion,
            policyVersion: observation.policyVersion,
            model: DEVELOPMENT_OPENAI_EXTRACTION_MODEL,
            promptVersion: DEVELOPMENT_OPENAI_EXTRACTION_PROMPT_VERSION,
            latencyMilliseconds: observation.latencyMilliseconds,
            inputTokens: observation.inputTokens,
            outputTokens: observation.outputTokens,
            totalTokens: observation.totalTokens,
            outcome: observation.outcome,
          }),
        );
      }
      return options.observe?.(observation);
    },
    resolveAdapter: (deployment, captureUsage) => {
      if (deployment.kind === 'deterministic')
        return new DeterministicSyntheticExtractionAdapter(options.now);
      if (deployment.kind === 'stored-offline')
        return new StoredSyntheticFixtureExtractionAdapter(options.now);
      const provider = new OpenAiContractExtractionAdapter({
        apiKey: apiKey ?? '',
        model: DEVELOPMENT_OPENAI_EXTRACTION_MODEL,
        promptVersion: DEVELOPMENT_OPENAI_EXTRACTION_PROMPT_VERSION,
        fetchImplementation: options.fetchImplementation,
        now: options.now,
        onCompleted: (metadata) =>
          captureUsage({
            inputTokens: metadata.inputTokens,
            outputTokens: metadata.outputTokens,
            totalTokens: metadata.totalTokens,
          }),
      });
      if (deployment.kind === 'stored-provider-once') {
        if (!options.storedProviderQaGate)
          throw new ContractExtractionServiceError(
            'The stored provider gate is unavailable.',
            'SERVICE_FAILURE',
          );
        return new StoredSyntheticProviderQaExtractionAdapter(
          provider,
          options.storedProviderQaGate,
        );
      }
      return provider;
    },
  });
}
