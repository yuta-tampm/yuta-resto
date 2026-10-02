import 'server-only';

import {
  ContractExtractionServiceError,
  DeterministicSyntheticExtractionAdapter,
  type ContractExtractionAdapter,
  type PreparedSyntheticContract,
} from './service';
import {
  OpenAiContractExtractionAdapter,
  type OpenAiExtractionObservation,
} from './openai-adapter';

export const DEVELOPMENT_OPENAI_EXTRACTION_MODEL = 'gpt-5.6-luna' as const;
export const DEVELOPMENT_OPENAI_EXTRACTION_PROMPT_VERSION = 'v4' as const;

export type ContractExtractionRuntimeEnvironment = Readonly<{
  NODE_ENV?: string;
  YUTA_PERSONNEL_CONTRACT_EXTRACTION_MODE?: string;
  YUTA_OPENAI_EVALUATION_API_KEY?: string;
}>;

export type CreateDevelopmentContractExtractionAdapterOptions = Readonly<{
  environment?: ContractExtractionRuntimeEnvironment;
  fetchImplementation?: typeof fetch;
  now?: () => Date;
  scenario?: PreparedSyntheticContract['scenario'];
  onCompleted?: (observation: OpenAiExtractionObservation) => void;
}>;

export function createDevelopmentContractExtractionAdapter(
  options: CreateDevelopmentContractExtractionAdapterOptions = {},
): ContractExtractionAdapter {
  const environment = options.environment ?? process.env;
  if (environment.NODE_ENV !== 'development') {
    throw configurationError(
      'Personnel contract extraction is unavailable outside development.',
    );
  }

  const mode =
    environment.YUTA_PERSONNEL_CONTRACT_EXTRACTION_MODE?.trim() ||
    'deterministic-synthetic';

  if (
    mode === 'deterministic-synthetic' ||
    (options.scenario !== undefined && options.scenario !== 'complete')
  ) {
    return new DeterministicSyntheticExtractionAdapter(options.now);
  }

  if (mode !== 'openai-synthetic') {
    throw configurationError(
      'The personnel contract extraction mode is not approved.',
    );
  }

  const apiKey = environment.YUTA_OPENAI_EVALUATION_API_KEY?.trim();
  if (!apiKey) {
    throw configurationError(
      'The synthetic OpenAI evaluation key is not configured.',
    );
  }

  return new OpenAiContractExtractionAdapter({
    apiKey,
    model: DEVELOPMENT_OPENAI_EXTRACTION_MODEL,
    promptVersion: DEVELOPMENT_OPENAI_EXTRACTION_PROMPT_VERSION,
    fetchImplementation: options.fetchImplementation,
    now: options.now,
    onCompleted: options.onCompleted,
  });
}

function configurationError(message: string): ContractExtractionServiceError {
  return new ContractExtractionServiceError(message, 'SERVICE_FAILURE');
}
