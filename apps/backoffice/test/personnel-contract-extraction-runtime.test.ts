import { describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));

import {
  DEVELOPMENT_OPENAI_EXTRACTION_MODEL,
  DEVELOPMENT_OPENAI_EXTRACTION_PROMPT_VERSION,
  createDevelopmentContractExtractionAdapter,
} from '../src/server/personnel-contract-extraction/runtime';
import {
  ContractExtractionServiceError,
  DeterministicSyntheticExtractionAdapter,
  runSyntheticContractExtraction,
  SyntheticContractPdfPreparer,
} from '../src/server/personnel-contract-extraction/service';
import { OpenAiContractExtractionAdapter } from '../src/server/personnel-contract-extraction/openai-adapter';

describe('development personnel contract extraction runtime', () => {
  it('keeps deterministic synthetic extraction as the offline default', () => {
    const adapter = createDevelopmentContractExtractionAdapter({
      environment: { NODE_ENV: 'development' },
    });

    expect(adapter).toBeInstanceOf(DeterministicSyntheticExtractionAdapter);
  });

  it.each(['production', 'test', undefined])(
    'fails closed when NODE_ENV is %s',
    (nodeEnvironment) => {
      expect(() =>
        createDevelopmentContractExtractionAdapter({
          environment: {
            NODE_ENV: nodeEnvironment,
            YUTA_PERSONNEL_CONTRACT_EXTRACTION_MODE: 'openai-synthetic',
            YUTA_OPENAI_EVALUATION_API_KEY: 'test-key',
          },
        }),
      ).toThrowError(ContractExtractionServiceError);
    },
  );

  it('fails closed for a missing key or an unknown mode', () => {
    expect(() =>
      createDevelopmentContractExtractionAdapter({
        environment: {
          NODE_ENV: 'development',
          YUTA_PERSONNEL_CONTRACT_EXTRACTION_MODE: 'openai-synthetic',
        },
      }),
    ).toThrowError(ContractExtractionServiceError);

    expect(() =>
      createDevelopmentContractExtractionAdapter({
        environment: {
          NODE_ENV: 'development',
          YUTA_PERSONNEL_CONTRACT_EXTRACTION_MODE: 'unexpected',
          YUTA_OPENAI_EVALUATION_API_KEY: 'test-key',
        },
      }),
    ).toThrowError(ContractExtractionServiceError);
  });

  it('selects the approved Luna/v4 adapter only with the explicit development mode', () => {
    const fetchImplementation = vi.fn<typeof fetch>();
    const adapter = createDevelopmentContractExtractionAdapter({
      environment: {
        NODE_ENV: 'development',
        YUTA_PERSONNEL_CONTRACT_EXTRACTION_MODE: 'openai-synthetic',
        YUTA_OPENAI_EVALUATION_API_KEY: 'test-key',
      },
      fetchImplementation,
    });

    expect(adapter).toBeInstanceOf(OpenAiContractExtractionAdapter);
    expect(DEVELOPMENT_OPENAI_EXTRACTION_MODEL).toBe('gpt-5.6-luna');
    expect(DEVELOPMENT_OPENAI_EXTRACTION_PROMPT_VERSION).toBe('v4');
    expect(fetchImplementation).not.toHaveBeenCalled();
  });

  it('keeps non-complete UI test scenarios local without provider access', () => {
    const fetchImplementation = vi.fn<typeof fetch>();
    const adapter = createDevelopmentContractExtractionAdapter({
      environment: {
        NODE_ENV: 'development',
        YUTA_PERSONNEL_CONTRACT_EXTRACTION_MODE: 'openai-synthetic',
        YUTA_OPENAI_EVALUATION_API_KEY: 'test-key',
      },
      fetchImplementation,
      scenario: 'timeout',
    });

    expect(adapter).toBeInstanceOf(DeterministicSyntheticExtractionAdapter);
    expect(fetchImplementation).not.toHaveBeenCalled();
  });

  it('runs the development flow end to end with a generated fictional PDF and a fake provider response', async () => {
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
                    status: 'complete',
                    suggestions: [
                      {
                        field: 'position',
                        candidateValue: 'Chef de rang',
                        confidence: 'high',
                        sourcePage: 2,
                        excerpt: 'Poste synthetique - Chef de rang',
                        issueCodes: [],
                      },
                      {
                        field: 'employmentTermType',
                        candidateValue: 'fixed_term',
                        confidence: 'high',
                        sourcePage: 1,
                        excerpt: 'Contrat de travail synthetique - CDD',
                        issueCodes: ['blocked_by_dependency'],
                      },
                      {
                        field: 'contractWeeklyMinutes',
                        candidateValue: 2100,
                        confidence: 'high',
                        sourcePage: 3,
                        excerpt: 'Duree synthetique - 35 heures par semaine',
                        issueCodes: [],
                      },
                    ],
                    warnings: [],
                  }),
                },
              ],
            },
          ],
        }),
        { status: 200, headers: { 'content-type': 'application/json' } },
      ),
    );
    const adapter = createDevelopmentContractExtractionAdapter({
      environment: {
        NODE_ENV: 'development',
        YUTA_PERSONNEL_CONTRACT_EXTRACTION_MODE: 'openai-synthetic',
        YUTA_OPENAI_EVALUATION_API_KEY: 'test-key',
      },
      fetchImplementation,
      now: () => new Date('2026-08-19T10:00:00.000Z'),
    });
    const request = {
      requestId: '11111111-1111-4111-8111-111111111111',
      employeeId: '22222222-2222-4222-8222-222222222222',
      documentId: '33333333-3333-4333-8333-333333333333',
      documentVersion: 2,
      employeeRevision: 4,
      scenario: 'complete' as const,
    };

    await expect(
      runSyntheticContractExtraction(request, {
        authorizeAndResolve: async () => ({
          employeeRevision: 4,
          documentId: request.documentId,
          documentVersion: 2,
        }),
        consumeRateLimit: vi.fn(),
        preparer: new SyntheticContractPdfPreparer(),
        adapter,
      }),
    ).resolves.toMatchObject({
      requestId: request.requestId,
      pageCount: 3,
      status: 'complete',
    });

    expect(fetchImplementation).toHaveBeenCalledTimes(1);
    const [, init] = fetchImplementation.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(String(init.body));
    expect(body.model).toBe('gpt-5.6-luna');
    expect(body.store).toBe(false);
    expect(body.input[0].content[0].text).toContain(
      'Construct the final result once:',
    );
    expect(body.input[1].content[0].file_data).toMatch(
      /^data:application\/pdf;base64,JVBER/,
    );
  });
});
