import 'server-only';
import {
  personnelContractExtractionRequestSchema,
  personnelContractExtractionScenarioSchema,
  type PersonnelContractExtractionReviewResult,
} from '@yuta/contracts/personnel';
import { z } from 'zod';
import type { ContractExtractionAdapter } from '../personnel-contract-extraction/service';
import type {
  AiExecutor,
  AiExecutionDescriptor,
  AiRuntimeConfiguration,
  AiObservation,
  AiDenialCode,
  AiTokenUsage,
  PersonnelExtractionInput,
} from './contracts';
import {
  eligibleDeployments,
  selectDeployment,
  SYNTHETIC_EXTRACTION_POLICY_VERSION,
  type AiDeployment,
  type AiStaticMapping,
} from './policy';
const inputSchema = z
  .object({
    request: personnelContractExtractionRequestSchema,
    document: z
      .object({
        source: z.enum([
          'synthetic_fixture',
          'synthetic_upload',
          'stored_synthetic_document',
        ]),
        pageCount: z.number().int().min(1).max(40),
        scenario: personnelContractExtractionScenarioSchema,
        bytes: z.instanceof(Uint8Array).optional(),
      })
      .strict(),
  })
  .strict();
export class AiExecutionError extends Error {
  constructor(readonly code: AiDenialCode) {
    super('The synthetic capability execution failed.');
    this.name = 'AiExecutionError';
  }
}
export type AiExecutorOptions = Readonly<{
  configuration: AiRuntimeConfiguration;
  deployments?: readonly AiDeployment[];
  mapping?: AiStaticMapping;
  resolveAdapter(
    deployment: AiDeployment,
    captureUsage: (usage: AiTokenUsage) => void,
  ): ContractExtractionAdapter;
  validateResult(
    raw: unknown,
    input: PersonnelExtractionInput,
  ): PersonnelContractExtractionReviewResult;
  timeoutMilliseconds?: number;
  nowMilliseconds?: () => number;
  observe?: (observation: AiObservation) => void | Promise<void>;
}>;
export function createAiExecutor(options: AiExecutorOptions): AiExecutor {
  // Bind the trusted versioned configuration to this executor, without secrets.
  const configuration = Object.freeze({
    configurationId: options.configuration.configurationId,
    configurationVersion: options.configuration.configurationVersion,
    environment: options.configuration.environment,
    mode: options.configuration.mode,
    credentialConfigured: options.configuration.credentialConfigured,
    storedProviderOnce: options.configuration.storedProviderOnce,
  });
  return {
    configuration,
    async execute(capability, input, descriptor) {
      const now = options.nowMilliseconds ?? (() => performance.now());
      const started = now();
      let selected: AiDeployment | undefined;
      let usage: AiTokenUsage = {};
      let terminal = false;
      const observe = (
        outcome: AiObservation['outcome'],
        reason?: AiDenialCode,
      ) => {
        if (terminal) return;
        terminal = true;
        const elapsed = now() - started;
        const observation: AiObservation = {
          capability: 'personnel.contract.extract_fields@1',
          capabilityVersion: 1,
          policyVersion: SYNTHETIC_EXTRACTION_POLICY_VERSION,
          ...(selected
            ? {
                deploymentId: selected.deploymentId,
                deploymentVersion: selected.deploymentVersion,
              }
            : {}),
          outcome,
          ...(reason ? { reason } : {}),
          latencyMilliseconds: Number.isFinite(elapsed)
            ? Math.max(0, Math.round(elapsed))
            : 0,
          ...(outcome === 'success' ? usage : {}),
        };
        try {
          const pending = options.observe?.(observation);
          if (pending) void pending.catch(() => undefined);
        } catch {
          /* Optional observations do not alter domain audit or results. */
        }
      };
      try {
        const parsed = inputSchema.safeParse(input);
        if (
          !parsed.success ||
          !descriptor ||
          typeof descriptor !== 'object' ||
          parsed.data.document.scenario !== parsed.data.request.scenario ||
          descriptor.provenance !== parsed.data.document.source ||
          descriptor.scenario !== parsed.data.document.scenario
        )
          throw new AiExecutionError('INVALID_INPUT');
        const eligible = eligibleDeployments(
          capability,
          descriptor,
          configuration,
          options.deployments,
        );
        if (eligible.length === 0) throw new AiExecutionError('INELIGIBLE');
        selected = selectDeployment(
          descriptor,
          configuration,
          eligible,
          options.mapping,
        );
        if (!selected) throw new AiExecutionError('MAPPING_DENIED');
        const adapter = options.resolveAdapter(selected, (candidate) => {
          if (terminal) return;
          const sanitized: {
            inputTokens?: number;
            outputTokens?: number;
            totalTokens?: number;
          } = {};
          for (const key of [
            'inputTokens',
            'outputTokens',
            'totalTokens',
          ] as const) {
            const value = candidate[key];
            if (
              typeof value === 'number' &&
              Number.isFinite(value) &&
              value >= 0
            )
              sanitized[key] = value;
          }
          usage = sanitized;
        });
        let timer: ReturnType<typeof setTimeout> | undefined;
        let raw: unknown;
        const timeout = options.timeoutMilliseconds ?? 45_000;
        if (!Number.isFinite(timeout) || timeout <= 0)
          throw new AiExecutionError('INVALID_INPUT');
        try {
          raw = await Promise.race([
            Promise.resolve().then(() =>
              adapter.extract(parsed.data.request, parsed.data.document),
            ),
            new Promise<never>((_resolve, reject) => {
              timer = setTimeout(
                () => reject(new AiExecutionError('TIMEOUT')),
                timeout,
              );
            }),
          ]);
        } finally {
          if (timer) clearTimeout(timer);
        }
        let result: PersonnelContractExtractionReviewResult;
        try {
          result = options.validateResult(raw, parsed.data);
        } catch {
          throw new AiExecutionError('INVALID_RESULT');
        }
        observe('success');
        return result;
      } catch (error: unknown) {
        const code =
          error instanceof AiExecutionError ? error.code : 'ADAPTER_FAILURE';
        observe(
          code === 'INELIGIBLE' ||
            code === 'MAPPING_DENIED' ||
            code === 'INVALID_INPUT'
            ? 'denied'
            : 'failure',
          code,
        );
        // Existing domain adapter errors retain their safe mapping at the service boundary.
        throw error;
      }
    },
  };
}
