import 'server-only';
import type {
  PersonnelContractExtractionRequest,
  PersonnelContractExtractionReviewResult,
} from '@yuta/contracts/personnel';
import type { PreparedSyntheticContract } from '../personnel-contract-extraction/service';

export type AiCapabilityMap = {
  'personnel.contract.extract_fields@1': {
    input: Readonly<{
      request: PersonnelContractExtractionRequest;
      document: PreparedSyntheticContract;
    }>;
    result: PersonnelContractExtractionReviewResult;
  };
};
export type AiCapability = keyof AiCapabilityMap;
export type PersonnelExtractionInput = AiCapabilityMap[AiCapability]['input'];
export type AiRuntimeConfiguration = Readonly<{
  configurationId: 'personnel-synthetic';
  configurationVersion: 1;
  environment: 'development';
  mode: 'deterministic-synthetic' | 'openai-synthetic';
  credentialConfigured: boolean;
  storedProviderOnce: boolean;
}>;
// Personnel creates this only after authorization, exact versions and source controls.
export type AiExecutionDescriptor = Readonly<{
  purpose: 'synthetic-personnel-contract-evaluation';
  classification: 'synthetic';
  modality: 'pdf';
  provenance: PreparedSyntheticContract['source'];
  scenario: PreparedSyntheticContract['scenario'];
  configurationId: AiRuntimeConfiguration['configurationId'];
  configurationVersion: AiRuntimeConfiguration['configurationVersion'];
}>;
export interface AiExecutor {
  readonly configuration: AiRuntimeConfiguration;
  execute<C extends AiCapability>(
    capability: C,
    input: AiCapabilityMap[C]['input'],
    descriptor: AiExecutionDescriptor,
  ): Promise<AiCapabilityMap[C]['result']>;
}
export type AiDenialCode =
  | 'INVALID_INPUT'
  | 'INELIGIBLE'
  | 'MAPPING_DENIED'
  | 'INVALID_RESULT'
  | 'TIMEOUT'
  | 'ADAPTER_FAILURE';
export type AiObservation = Readonly<{
  capability: AiCapability;
  capabilityVersion: 1;
  policyVersion: 1;
  deploymentId?: string;
  deploymentVersion?: number;
  outcome: 'success' | 'denied' | 'failure';
  reason?: AiDenialCode;
  latencyMilliseconds: number;
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
}>;
export type AiTokenUsage = Pick<
  AiObservation,
  'inputTokens' | 'outputTokens' | 'totalTokens'
>;
