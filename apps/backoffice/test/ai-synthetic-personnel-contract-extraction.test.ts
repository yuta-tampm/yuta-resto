import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
vi.mock('server-only', () => ({}));
import type {
  AiExecutionDescriptor,
  AiObservation,
  AiRuntimeConfiguration,
  PersonnelExtractionInput,
} from '../src/server/ai/contracts';
import { createAiExecutor } from '../src/server/ai/executor';
import {
  eligibleDeployments,
  selectDeployment,
  SYNTHETIC_EXTRACTION_DEPLOYMENTS,
  SYNTHETIC_EXTRACTION_MAPPING,
  DEVELOPMENT_OPENAI_EXTRACTION_MODEL,
  DEVELOPMENT_OPENAI_EXTRACTION_PROMPT_VERSION,
} from '../src/server/ai/policy';
import { createPersonnelExtractionExecutor } from '../src/server/ai/runtime';
import {
  DeterministicSyntheticExtractionAdapter,
  runSyntheticContractExtraction,
  SyntheticContractPdfPreparer,
  validateContractExtractionResult,
} from '../src/server/personnel-contract-extraction/service';
import { DevelopmentContractExtractionReviewStore } from '../src/server/personnel-contract-extraction/review-store';
import { StoredSyntheticProviderQaGate } from '../src/server/personnel-contract-extraction/stored-synthetic-document';
const request = {
  requestId: '11111111-1111-4111-8111-111111111111',
  employeeId: '22222222-2222-4222-8222-222222222222',
  documentId: '33333333-3333-4333-8333-333333333333',
  documentVersion: 2,
  employeeRevision: 4,
  scenario: 'complete' as const,
};
const input: PersonnelExtractionInput = {
  request,
  document: {
    source: 'synthetic_fixture',
    scenario: 'complete',
    pageCount: 3,
    bytes: new Uint8Array([37, 80, 68, 70]),
  },
};
const configuration: AiRuntimeConfiguration = {
  configurationId: 'personnel-synthetic',
  configurationVersion: 1,
  environment: 'development',
  mode: 'deterministic-synthetic',
  credentialConfigured: false,
  storedProviderOnce: false,
};
const descriptor: AiExecutionDescriptor = {
  purpose: 'synthetic-personnel-contract-evaluation',
  classification: 'synthetic',
  modality: 'pdf',
  provenance: 'synthetic_fixture',
  scenario: 'complete',
  configurationId: 'personnel-synthetic',
  configurationVersion: 1,
};
const now = () => new Date('2026-10-03T12:00:00.000Z');
async function result() {
  return new DeterministicSyntheticExtractionAdapter(now).extract(
    request,
    input.document,
  );
}
function executor(
  options: Partial<Parameters<typeof createAiExecutor>[0]> = {},
) {
  const resolveAdapter = vi.fn(
    () => new DeterministicSyntheticExtractionAdapter(now),
  );
  const observe = vi.fn();
  return {
    resolveAdapter,
    observe,
    instance: createAiExecutor({
      configuration,
      resolveAdapter,
      observe,
      validateResult: validateContractExtractionResult,
      ...options,
    }),
  };
}
afterEach(() => vi.useRealTimers());
describe('typed synthetic capability policy and executor', () => {
  it('declares exactly four versioned execution kinds with one Luna/v4 owner', () => {
    expect(
      SYNTHETIC_EXTRACTION_DEPLOYMENTS.map((record) => record.kind),
    ).toEqual([
      'deterministic',
      'openai',
      'stored-offline',
      'stored-provider-once',
    ]);
    expect(DEVELOPMENT_OPENAI_EXTRACTION_MODEL).toBe('gpt-5.6-luna');
    expect(DEVELOPMENT_OPENAI_EXTRACTION_PROMPT_VERSION).toBe('v4');
    expect(JSON.stringify(SYNTHETIC_EXTRACTION_DEPLOYMENTS)).not.toMatch(
      /apiKey|credential|Bearer/,
    );
  });
  it.each([
    { classification: 'real' },
    { classification: 'unknown' },
    { purpose: 'unknown' },
    { modality: 'image' },
    { provenance: 'unknown' },
    { configurationVersion: 9 },
    { configurationId: 'unknown' },
    { scenario: 'unknown' },
  ])(
    'denies unsupported domain descriptor %j before adapter resolution',
    async (bad) => {
      const spy = executor();
      await expect(
        spy.instance.execute('personnel.contract.extract_fields@1', input, {
          ...descriptor,
          ...bad,
        } as AiExecutionDescriptor),
      ).rejects.toBeDefined();
      expect(spy.resolveAdapter).not.toHaveBeenCalled();
      expect(spy.observe).toHaveBeenCalledTimes(1);
    },
  );
  it.each(['production', 'test', undefined])(
    'denies runtime environment %s at policy and composition',
    async (environment) => {
      const config = {
        ...configuration,
        environment,
      } as AiRuntimeConfiguration;
      expect(
        eligibleDeployments(
          'personnel.contract.extract_fields@1',
          descriptor,
          config,
        ),
      ).toEqual([]);
      const spy = executor({ configuration: config });
      await expect(
        spy.instance.execute(
          'personnel.contract.extract_fields@1',
          input,
          descriptor,
        ),
      ).rejects.toMatchObject({ code: 'INELIGIBLE' });
      expect(spy.resolveAdapter).not.toHaveBeenCalled();
      expect(() =>
        createPersonnelExtractionExecutor({
          environment: { NODE_ENV: environment },
        }),
      ).toThrow();
    },
  );
  it('denies empty eligibility, missing mapping and mapping outside the eligible set without substitution', async () => {
    for (const options of [
      { deployments: [] },
      {
        mapping: {
          ...SYNTHETIC_EXTRACTION_MAPPING,
          deterministic: 'personnel-openai',
        },
      },
      { mapping: {} as typeof SYNTHETIC_EXTRACTION_MAPPING },
    ]) {
      const spy = executor(options);
      await expect(
        spy.instance.execute(
          'personnel.contract.extract_fields@1',
          input,
          descriptor,
        ),
      ).rejects.toBeDefined();
      expect(spy.resolveAdapter).not.toHaveBeenCalled();
    }
    const eligible = eligibleDeployments(
      'personnel.contract.extract_fields@1',
      descriptor,
      configuration,
    );
    expect(selectDeployment(descriptor, configuration, eligible)).toEqual(
      selectDeployment(descriptor, configuration, eligible),
    );
  });
  it('rejects a runtime capability or invalid payload before resolving the adapter', async () => {
    const spy = executor();
    await expect(
      spy.instance.execute(
        'personnel.contract.extract_fields@2' as 'personnel.contract.extract_fields@1',
        input,
        descriptor,
      ),
    ).rejects.toBeDefined();
    await expect(
      spy.instance.execute(
        'personnel.contract.extract_fields@1',
        {
          ...input,
          request: { ...request, classification: 'synthetic' },
        } as PersonnelExtractionInput,
        descriptor,
      ),
    ).rejects.toMatchObject({ code: 'INVALID_INPUT' });
    await expect(
      spy.instance.execute(
        'personnel.contract.extract_fields@1',
        {} as PersonnelExtractionInput,
        descriptor,
      ),
    ).rejects.toMatchObject({ code: 'INVALID_INPUT' });
    expect(spy.resolveAdapter).not.toHaveBeenCalled();
  });
  it('rejects wrong identities, versions, pages, outcome, malformed and extra-key results', async () => {
    const good = (await result()) as Record<string, unknown>;
    for (const bad of [
      null,
      { ...good, extra: 'canary' },
      { ...good, requestId: request.employeeId },
      { ...good, document: { id: request.documentId, version: 99 } },
      { ...good, document: { id: request.employeeId, version: 2 } },
      { ...good, employeeRevision: 99 },
      { ...good, pageCount: 4 },
      { ...good, status: 'wrong' },
      {
        ...good,
        suggestions: [
          {
            field: 'position',
            candidateValue: 'canary',
            confidence: 'high',
            sourcePage: 4,
            excerpt: 'canary',
            issueCodes: [],
          },
        ],
      },
    ]) {
      const spy = executor({
        resolveAdapter: () => ({ extract: async () => bad }),
      });
      await expect(
        spy.instance.execute(
          'personnel.contract.extract_fields@1',
          input,
          descriptor,
        ),
      ).rejects.toMatchObject({ code: 'INVALID_RESULT' });
      expect(spy.observe).toHaveBeenCalledWith(
        expect.objectContaining({
          outcome: 'failure',
          reason: 'INVALID_RESULT',
        }),
      );
    }
  });
  it('publishes only one failure for timeout, ignores late usage/result and creates no review', async () => {
    vi.useFakeTimers();
    let complete!: (result: unknown) => void;
    let usage!: (tokens: { inputTokens: number }) => void;
    const validate = vi.fn(validateContractExtractionResult);
    const review = new DevelopmentContractExtractionReviewStore();
    const spy = executor({
      timeoutMilliseconds: 5,
      validateResult: validate,
      resolveAdapter: (_deployment, capture) => {
        usage = capture;
        return {
          extract: () =>
            new Promise((resolve) => {
              complete = resolve;
            }),
        };
      },
    });
    const running = spy.instance
      .execute('personnel.contract.extract_fields@1', input, descriptor)
      .then((value) =>
        review.save({ organizationId: 'test', establishmentId: 'test' }, value),
      );
    const rejected = expect(running).rejects.toMatchObject({ code: 'TIMEOUT' });
    await vi.advanceTimersByTimeAsync(6);
    await rejected;
    usage({ inputTokens: 999 });
    complete(await result());
    await vi.advanceTimersByTimeAsync(1);
    expect(validate).not.toHaveBeenCalled();
    expect(spy.observe).toHaveBeenCalledTimes(1);
    expect(spy.observe.mock.calls[0]?.[0]).toMatchObject({
      outcome: 'failure',
      reason: 'TIMEOUT',
    });
    expect(
      review.find({ organizationId: 'test', establishmentId: 'test' }, request),
    ).toEqual({ status: 'missing' });
  });
  it('excludes content, IDs, paths, secrets and invalid counters, and isolates a throwing sink', async () => {
    const canary = 'SECRET_CANARY_DO_NOT_LOG';
    const observations: AiObservation[] = [];
    const good = (await result()) as Record<string, unknown>;
    const spy = executor({
      observe: (event) => {
        observations.push(event);
        throw new Error(canary);
      },
      resolveAdapter: (_deployment, capture) => {
        capture({
          inputTokens: 3,
          outputTokens: -1,
          totalTokens: Infinity,
          secret: canary,
        } as never);
        return {
          extract: async () => ({
            ...good,
            suggestions: [
              {
                field: 'position',
                candidateValue: canary,
                confidence: 'high',
                sourcePage: 1,
                excerpt: canary,
                issueCodes: [],
              },
            ],
          }),
        };
      },
    });
    await expect(
      spy.instance.execute(
        'personnel.contract.extract_fields@1',
        input,
        descriptor,
      ),
    ).resolves.toMatchObject({ status: 'complete' });
    expect(JSON.stringify(observations)).not.toContain(canary);
    expect(JSON.stringify(observations)).not.toContain(request.employeeId);
    expect(observations[0]).toMatchObject({ inputTokens: 3 });
    expect(observations[0]).not.toHaveProperty('outputTokens');
    expect(observations[0]).not.toHaveProperty('totalTokens');
    const failed = executor({
      observe: (event) => {
        observations.push(event);
      },
      resolveAdapter: () => ({
        extract: async () => {
          throw new Error(canary);
        },
      }),
    });
    await expect(
      failed.instance.execute(
        'personnel.contract.extract_fields@1',
        input,
        descriptor,
      ),
    ).rejects.toThrow(canary);
    expect(JSON.stringify(observations)).not.toContain(canary);
  });
  it('isolates an asynchronously rejected observation sink', async () => {
    const spy = executor({
      observe: async () => {
        throw new Error('sink canary');
      },
    });
    await expect(
      spy.instance.execute(
        'personnel.contract.extract_fields@1',
        input,
        descriptor,
      ),
    ).resolves.toMatchObject({ status: 'complete' });
    await Promise.resolve();
  });
  it('rejects a missing prepared scenario before invoking the adapter', async () => {
    const spy = executor();
    const { scenario: _scenario, ...document } = input.document;
    await expect(
      spy.instance.execute(
        'personnel.contract.extract_fields@1',
        { request, document } as PersonnelExtractionInput,
        descriptor,
      ),
    ).rejects.toMatchObject({ code: 'INVALID_INPUT' });
    expect(spy.resolveAdapter).not.toHaveBeenCalled();
  });
  it('substitutes an eligible versioned mock without changing service, result or scoped review contract', async () => {
    const record = {
      ...SYNTHETIC_EXTRACTION_DEPLOYMENTS[0]!,
      deploymentId: 'personnel-offline-mock',
      deploymentVersion: 2,
    };
    const spy = executor({
      deployments: [record],
      mapping: {
        ...SYNTHETIC_EXTRACTION_MAPPING,
        deterministic: record.deploymentId,
      },
    });
    const output = await runSyntheticContractExtraction(request, {
      authorizeAndResolve: async () => ({
        employeeRevision: 4,
        documentId: request.documentId,
        documentVersion: 2,
      }),
      consumeRateLimit: () => undefined,
      preparer: new SyntheticContractPdfPreparer(),
      executor: spy.instance,
    });
    const review = new DevelopmentContractExtractionReviewStore(() =>
      now().getTime(),
    );
    review.save(
      { organizationId: 'fictional', establishmentId: 'fictional' },
      output,
    );
    expect(
      review.find(
        { organizationId: 'fictional', establishmentId: 'fictional' },
        request,
      ).status,
    ).toBe('valid');
    expect(spy.observe).toHaveBeenCalledWith(
      expect.objectContaining({
        deploymentId: 'personnel-offline-mock',
        deploymentVersion: 2,
        outcome: 'success',
      }),
    );
  });
});
describe('offline server composition', () => {
  it.each(['unexpected', 'openai-synthetic'])(
    'rejects invalid or uncredentialed mode %s even for local scenarios',
    (mode) => {
      expect(() =>
        createPersonnelExtractionExecutor({
          environment: {
            NODE_ENV: 'development',
            YUTA_PERSONNEL_CONTRACT_EXTRACTION_MODE: mode,
          },
        }),
      ).toThrow();
    },
  );
  it.each([
    'complete',
    'partial',
    'no_result',
    'unsupported',
    'failure',
    'timeout',
  ] as const)(
    'keeps default/scenario %s on deterministic execution',
    async (scenario) => {
      const fetchImplementation = vi.fn<typeof fetch>();
      const observations: AiObservation[] = [];
      const configured = createPersonnelExtractionExecutor({
        environment: { NODE_ENV: 'development' },
        fetchImplementation,
        observe: (event) => {
          observations.push(event);
        },
      });
      const run = runSyntheticContractExtraction(
        { ...request, scenario },
        {
          authorizeAndResolve: async () => ({
            employeeRevision: 4,
            documentId: request.documentId,
            documentVersion: 2,
          }),
          consumeRateLimit: () => undefined,
          preparer: new SyntheticContractPdfPreparer(),
          executor: configured,
        },
      );
      if (scenario === 'failure' || scenario === 'timeout')
        await expect(run).rejects.toBeDefined();
      else await expect(run).resolves.toHaveProperty('status');
      expect(fetchImplementation).not.toHaveBeenCalled();
      expect(observations[0]?.deploymentId).toBe('personnel-deterministic');
    },
  );
  it('keeps explicit provider non-complete scenarios local', async () => {
    const fetchImplementation = vi.fn<typeof fetch>();
    const configured = createPersonnelExtractionExecutor({
      environment: {
        NODE_ENV: 'development',
        YUTA_PERSONNEL_CONTRACT_EXTRACTION_MODE: 'openai-synthetic',
        YUTA_OPENAI_EVALUATION_API_KEY: 'fake-key',
      },
      fetchImplementation,
    });
    await expect(
      configured.execute(
        'personnel.contract.extract_fields@1',
        {
          request: { ...request, scenario: 'partial' },
          document: { ...input.document, scenario: 'partial' },
        },
        { ...descriptor, scenario: 'partial' },
      ),
    ).resolves.toMatchObject({ status: 'partial' });
    expect(fetchImplementation).not.toHaveBeenCalled();
  });
  it('retains stored checksum/page/once/remap guards using fake fetch', async () => {
    const bytes = new Uint8Array(
      await readFile(
        resolve(
          process.cwd(),
          'test/fixtures/personnel-contract-evaluation/v2/wg2-digital-cdd-35h.pdf',
        ),
      ),
    );
    const gate = new StoredSyntheticProviderQaGate({
      NODE_ENV: 'development',
      YUTA_PERSONNEL_CONTRACT_STORED_PROVIDER_QA: 'approved-once',
    });
    const fetchImplementation = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({
          status: 'completed',
          output: [
            {
              type: 'message',
              content: [
                {
                  type: 'output_text',
                  text: JSON.stringify({
                    status: 'no_result',
                    suggestions: [],
                    warnings: [],
                  }),
                },
              ],
            },
          ],
          usage: { input_tokens: 1, output_tokens: 2, total_tokens: 3 },
        }),
        { status: 200 },
      ),
    );
    const configured = createPersonnelExtractionExecutor({
      environment: {
        NODE_ENV: 'development',
        YUTA_PERSONNEL_CONTRACT_EXTRACTION_MODE: 'openai-synthetic',
        YUTA_OPENAI_EVALUATION_API_KEY: 'fake-key',
      },
      fetchImplementation,
      storedProviderQaGate: gate,
    });
    const stored = {
      ...input,
      document: {
        source: 'stored_synthetic_document' as const,
        scenario: 'complete' as const,
        pageCount: 2,
        bytes,
      },
    };
    const provenance = {
      ...descriptor,
      provenance: 'stored_synthetic_document' as const,
    };
    await expect(
      configured.execute(
        'personnel.contract.extract_fields@1',
        { ...stored, document: { ...stored.document, pageCount: 3 } },
        provenance,
      ),
    ).rejects.toBeDefined();
    await expect(
      configured.execute(
        'personnel.contract.extract_fields@1',
        {
          ...stored,
          document: {
            ...stored.document,
            bytes: new Uint8Array([37, 80, 68, 70]),
          },
        },
        provenance,
      ),
    ).rejects.toBeDefined();
    expect(fetchImplementation).not.toHaveBeenCalled();
    expect(gate.isEnabled()).toBe(true);
    await expect(
      configured.execute(
        'personnel.contract.extract_fields@1',
        stored,
        provenance,
      ),
    ).resolves.toMatchObject({ status: 'no_result', pageCount: 2 });
    await expect(
      configured.execute(
        'personnel.contract.extract_fields@1',
        stored,
        provenance,
      ),
    ).rejects.toBeDefined();
    expect(fetchImplementation).toHaveBeenCalledTimes(1);
    expect(gate.isEnabled()).toBe(false);
    const body = JSON.parse(
      String(fetchImplementation.mock.calls[0]?.[1]?.body),
    );
    expect(body.model).toBe('gpt-5.6-luna');
    expect(body.store).toBe(false);
    expect(body.input[1].content[0].file_data).toMatch(
      /^data:application\/pdf;base64,/,
    );
  });
});
