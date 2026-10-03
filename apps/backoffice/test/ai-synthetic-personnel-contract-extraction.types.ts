import type {
  AiExecutor,
  AiExecutionDescriptor,
  PersonnelExtractionInput,
} from '../src/server/ai/contracts';
import type { PersonnelContractExtractionReviewResult } from '@yuta/contracts/personnel';
// This file is included by Backoffice tsc, rather than transpiled as a runtime test.
export function checkCapabilityTypes(
  executor: AiExecutor,
  input: PersonnelExtractionInput,
  descriptor: AiExecutionDescriptor,
): Promise<PersonnelContractExtractionReviewResult> {
  const result: Promise<PersonnelContractExtractionReviewResult> =
    executor.execute('personnel.contract.extract_fields@1', input, descriptor);
  // @ts-expect-error Unsupported capability must not compile.
  executor.execute('reviews.reply@1', input, descriptor);
  // @ts-expect-error Unsupported business contract version must not compile.
  executor.execute('personnel.contract.extract_fields@2', input, descriptor);
  // @ts-expect-error Missing required prepared document must not compile.
  const invalidInput: PersonnelExtractionInput = { request: input.request };
  void invalidInput;
  const arbitraryCapability: string = 'personnel.contract.extract_fields@1';
  // @ts-expect-error Arbitrary strings must not compile.
  executor.execute(arbitraryCapability, input, descriptor);
  // @ts-expect-error Result is a review, not an arbitrary string.
  const wrongResult: Promise<string> = result;
  void wrongResult;
  return result;
}
export function typedMock(
  result: PersonnelContractExtractionReviewResult,
): AiExecutor {
  return {
    configuration: {
      configurationId: 'personnel-synthetic',
      configurationVersion: 1,
      environment: 'development',
      mode: 'deterministic-synthetic',
      credentialConfigured: false,
      storedProviderOnce: false,
    },
    async execute() {
      return result;
    },
  };
}
