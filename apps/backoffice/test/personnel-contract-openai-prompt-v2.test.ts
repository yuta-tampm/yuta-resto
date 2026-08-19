import { createHash } from 'node:crypto';

import { describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));

import {
  contractEvaluationCorpusManifestSchema,
  evaluateContractExtractionCandidate,
} from '../src/server/personnel-contract-extraction/evaluation';
import {
  OPENAI_EXTRACTION_PROMPT_V2,
  OPENAI_EXTRACTION_PROMPT_V2_SHA256,
  OpenAiContractExtractionAdapter,
} from '../src/server/personnel-contract-extraction/openai-adapter';
import rawManifest from './fixtures/personnel-contract-evaluation/v1/manifest.json';

const manifest = contractEvaluationCorpusManifestSchema.parse(rawManifest);
const clearScanFixture = findClearScanFixture();

type FakeSemanticSuggestion = {
  field: 'position' | 'employmentTermType' | 'contractWeeklyMinutes';
  candidateValue: string | number;
  confidence: 'high' | 'medium';
  sourcePage: number;
  excerpt: string;
  issueCodes: never[];
};

type FakeSemanticResult = {
  status: 'complete' | 'partial' | 'no_result' | 'unsupported';
  suggestions: FakeSemanticSuggestion[];
  warnings: string[];
};

const request = {
  requestId: '11111111-1111-4111-8111-111111111111',
  employeeId: '22222222-2222-4222-8222-222222222222',
  documentId: '33333333-3333-4333-8333-333333333333',
  documentVersion: 1,
  employeeRevision: 1,
  scenario: 'complete' as const,
};

const document = {
  source: 'synthetic_fixture' as const,
  pageCount: 2,
  scenario: 'complete' as const,
  bytes: new Uint8Array([37, 80, 68, 70, 45, 49, 46, 55]),
};

describe('OpenAI extraction prompt v2 offline behavior', () => {
  it('keeps the approved prompt text pinned to its reviewed fingerprint', () => {
    const fingerprint = createHash('sha256')
      .update(OPENAI_EXTRACTION_PROMPT_V2)
      .digest('hex');

    expect(OPENAI_EXTRACTION_PROMPT_V2_SHA256).toBe(
      '74a7caee7db5266f546474f82973f40ad09f56b750b1ffd2b2519d7c6906f67f',
    );
    expect(fingerprint).toBe(OPENAI_EXTRACTION_PROMPT_V2_SHA256);
  });

  it('sends approved v2 and accepts an exact fake extraction', async () => {
    const fetchImplementation = fakeProvider(exactSemanticResult());
    const result = await createV2Adapter(fetchImplementation).extract(
      request,
      document,
    );

    expect(fetchImplementation).toHaveBeenCalledTimes(1);
    const [, init] = fetchImplementation.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(String(init.body));
    expect(body.input[0].content[0]).toEqual({
      type: 'input_text',
      text: OPENAI_EXTRACTION_PROMPT_V2,
    });
    expect(body.text.format).toMatchObject({
      type: 'json_schema',
      name: 'yuta_contract_extraction_v2',
      strict: true,
    });
    expect(
      evaluateContractExtractionCandidate(clearScanFixture, result),
    ).toMatchObject({
      schemaValid: true,
      mismatchDiagnostics: [],
      passed: true,
    });
  });

  it('diagnoses a French orthographic rewrite without weakening exact matching', async () => {
    const semanticResult = exactSemanticResult();
    semanticResult.suggestions[1] = {
      ...semanticResult.suggestions[1]!,
      candidateValue: 'Hôte d’accueil',
      excerpt: 'Fonction exercee: Hôte d’accueil.',
    };
    const result = await createV2Adapter(fakeProvider(semanticResult)).extract(
      request,
      document,
    );

    expect(
      evaluateContractExtractionCandidate(clearScanFixture, result),
    ).toMatchObject({
      falseSuggestions: 1,
      incorrectHighConfidenceSuggestions: 1,
      mismatchDiagnostics: [
        {
          field: 'position',
          kinds: [
            'missing_expected_suggestion',
            'candidate_value',
            'orthographic_variation',
          ],
        },
      ],
      passed: false,
    });
  });

  it('diagnoses a wrong source page separately from a wrong value', async () => {
    const semanticResult = exactSemanticResult();
    semanticResult.suggestions[1] = {
      ...semanticResult.suggestions[1]!,
      sourcePage: 1,
    };
    const result = await createV2Adapter(fakeProvider(semanticResult)).extract(
      request,
      document,
    );

    expect(
      evaluateContractExtractionCandidate(clearScanFixture, result),
    ).toMatchObject({
      mismatchDiagnostics: [
        {
          field: 'position',
          kinds: ['missing_expected_suggestion', 'source_page'],
        },
      ],
      passed: false,
    });
  });

  it('rejects fake v2 results whose status/count or field uniqueness is inconsistent', async () => {
    await expect(
      createV2Adapter(
        fakeProvider({ status: 'partial', suggestions: [], warnings: [] }),
      ).extract(request, document),
    ).rejects.toMatchObject({ code: 'INVALID_PROVIDER_RESULT' });

    const duplicate = exactSemanticResult();
    duplicate.status = 'partial';
    duplicate.suggestions = [
      duplicate.suggestions[1]!,
      { ...duplicate.suggestions[1]!, confidence: 'medium' },
    ];
    await expect(
      createV2Adapter(fakeProvider(duplicate)).extract(request, document),
    ).rejects.toMatchObject({ code: 'INVALID_PROVIDER_RESULT' });
  });
});

function createV2Adapter(fetchImplementation: typeof fetch) {
  return new OpenAiContractExtractionAdapter({
    apiKey: 'offline-fake-key',
    model: 'gpt-5.6-luna',
    promptVersion: 'v2',
    fetchImplementation,
  });
}

function fakeProvider(
  semanticResult: unknown,
): ReturnType<typeof vi.fn> & typeof fetch {
  return vi.fn().mockResolvedValue(
    new Response(
      JSON.stringify({
        status: 'completed',
        output: [
          {
            type: 'message',
            content: [
              {
                type: 'output_text',
                text: JSON.stringify(semanticResult),
              },
            ],
          },
        ],
        usage: { input_tokens: 100, output_tokens: 20, total_tokens: 120 },
      }),
      { status: 200, headers: { 'content-type': 'application/json' } },
    ),
  ) as ReturnType<typeof vi.fn> & typeof fetch;
}

function exactSemanticResult(): FakeSemanticResult {
  return {
    status: 'complete' as 'complete' | 'partial',
    suggestions: clearScanFixture.expected.suggestions.map((suggestion) => ({
      ...suggestion,
      confidence: 'high',
      excerpt: 'Exact fictional evidence.',
      issueCodes: [],
    })),
    warnings: ['image_only_document'],
  };
}

function findClearScanFixture() {
  const fixture = manifest.fixtures.find(
    (candidate) => candidate.id === 'wg2-scan-clear-03',
  );
  if (!fixture) throw new Error('The clear-scan fixture is missing.');
  return fixture;
}
