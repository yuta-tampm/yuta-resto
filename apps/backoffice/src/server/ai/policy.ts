import 'server-only';
import type {
  AiCapability,
  AiExecutionDescriptor,
  AiRuntimeConfiguration,
} from './contracts';
export const DEVELOPMENT_OPENAI_EXTRACTION_MODEL = 'gpt-5.6-luna' as const;
export const DEVELOPMENT_OPENAI_EXTRACTION_PROMPT_VERSION = 'v4' as const;
export const SYNTHETIC_EXTRACTION_POLICY_VERSION = 1 as const;
export type AiExecutionKind =
  | 'deterministic'
  | 'openai'
  | 'stored-offline'
  | 'stored-provider-once';
export type AiDeployment = Readonly<{
  deploymentId: string;
  deploymentVersion: number;
  capability: AiCapability;
  purpose: AiExecutionDescriptor['purpose'];
  classification: AiExecutionDescriptor['classification'];
  modality: AiExecutionDescriptor['modality'];
  environment: 'development';
  kind: AiExecutionKind;
}>;
const deployment = (kind: AiExecutionKind): AiDeployment =>
  Object.freeze({
    deploymentId: 'personnel-' + kind,
    deploymentVersion: 1,
    capability: 'personnel.contract.extract_fields@1',
    purpose: 'synthetic-personnel-contract-evaluation',
    classification: 'synthetic',
    modality: 'pdf',
    environment: 'development',
    kind,
  });
export const SYNTHETIC_EXTRACTION_DEPLOYMENTS: readonly AiDeployment[] =
  Object.freeze([
    deployment('deterministic'),
    deployment('openai'),
    deployment('stored-offline'),
    deployment('stored-provider-once'),
  ]);
export type AiStaticMapping = Readonly<Record<AiExecutionKind, string>>;
export const SYNTHETIC_EXTRACTION_MAPPING: AiStaticMapping = Object.freeze({
  deterministic: 'personnel-deterministic',
  openai: 'personnel-openai',
  'stored-offline': 'personnel-stored-offline',
  'stored-provider-once': 'personnel-stored-provider-once',
});
export function executionKind(
  descriptor: AiExecutionDescriptor,
  configuration: AiRuntimeConfiguration,
): AiExecutionKind {
  if (descriptor.provenance === 'stored_synthetic_document')
    return configuration.storedProviderOnce
      ? 'stored-provider-once'
      : 'stored-offline';
  return descriptor.scenario === 'complete' &&
    configuration.mode === 'openai-synthetic'
    ? 'openai'
    : 'deterministic';
}
export function eligibleDeployments(
  capability: AiCapability,
  descriptor: AiExecutionDescriptor,
  configuration: AiRuntimeConfiguration,
  deployments: readonly AiDeployment[] = SYNTHETIC_EXTRACTION_DEPLOYMENTS,
): readonly AiDeployment[] {
  if (
    capability !== 'personnel.contract.extract_fields@1' ||
    descriptor.purpose !== 'synthetic-personnel-contract-evaluation' ||
    descriptor.classification !== 'synthetic' ||
    descriptor.modality !== 'pdf' ||
    configuration.environment !== 'development' ||
    configuration.configurationId !== 'personnel-synthetic' ||
    configuration.configurationVersion !== 1 ||
    descriptor.configurationId !== configuration.configurationId ||
    descriptor.configurationVersion !== configuration.configurationVersion ||
    !['deterministic-synthetic', 'openai-synthetic'].includes(
      configuration.mode,
    ) ||
    typeof configuration.credentialConfigured !== 'boolean' ||
    typeof configuration.storedProviderOnce !== 'boolean' ||
    (configuration.mode === 'openai-synthetic' &&
      !configuration.credentialConfigured) ||
    (configuration.storedProviderOnce &&
      (configuration.mode !== 'openai-synthetic' ||
        !configuration.credentialConfigured)) ||
    ![
      'synthetic_fixture',
      'synthetic_upload',
      'stored_synthetic_document',
    ].includes(descriptor.provenance) ||
    ![
      'complete',
      'partial',
      'no_result',
      'unsupported',
      'failure',
      'timeout',
    ].includes(descriptor.scenario) ||
    (descriptor.provenance === 'stored_synthetic_document' &&
      descriptor.scenario !== 'complete')
  )
    return [];
  const kind = executionKind(descriptor, configuration);
  return deployments.filter(
    (record) =>
      record.capability === capability &&
      record.purpose === descriptor.purpose &&
      record.classification === descriptor.classification &&
      record.modality === descriptor.modality &&
      record.environment === configuration.environment &&
      record.kind === kind &&
      /^[a-z][a-z0-9-]{0,63}$/.test(record.deploymentId) &&
      Number.isSafeInteger(record.deploymentVersion) &&
      record.deploymentVersion > 0,
  );
}
export function selectDeployment(
  descriptor: AiExecutionDescriptor,
  configuration: AiRuntimeConfiguration,
  eligible: readonly AiDeployment[],
  mapping: AiStaticMapping = SYNTHETIC_EXTRACTION_MAPPING,
): AiDeployment | undefined {
  const id = mapping[executionKind(descriptor, configuration)];
  const matches = eligible.filter((record) => record.deploymentId === id);
  return matches.length === 1 ? matches[0] : undefined;
}
