import { createHash } from 'node:crypto';

import { describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));

import {
  contractEvaluationCorpusManifestSchema,
  evaluateContractExtractionCandidate,
} from '../src/server/personnel-contract-extraction/evaluation';
import {
  OPENAI_EXTRACTION_PROMPT_V4,
  OPENAI_EXTRACTION_PROMPT_V4_SHA256,
  OpenAiContractExtractionAdapter,
} from '../src/server/personnel-contract-extraction/openai-adapter';
import rawManifest from './fixtures/personnel-contract-evaluation/v2/manifest.json';

const manifest = contractEvaluationCorpusManifestSchema.parse(rawManifest);

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

describe('OpenAI extraction prompt v4 offline behavior', () => {
  it('pins the reviewable prompt and its two measured-gap rules', () => {
    expect(OPENAI_EXTRACTION_PROMPT_V4_SHA256).toBe(
      '24e76f787c56a5e8c3e350d4be9623cbb6149cf6eef5f45a028b7566807d6ed4',
    );
    expect(
      createHash('sha256').update(OPENAI_EXTRACTION_PROMPT_V4).digest('hex'),
    ).toBe(OPENAI_EXTRACTION_PROMPT_V4_SHA256);
    expect(OPENAI_EXTRACTION_PROMPT_V4).toContain(
      'Exclude the label, separator, and punctuation that merely ends the surrounding sentence.',
    );
    expect(OPENAI_EXTRACTION_PROMPT_V4).toContain(
      'Count the final suggestions after all omissions',
    );
  });

  it('sends v4 and accepts the exact clear-scan-07 position boundary', async () => {
    const fixture = findFixture('wg2-scan-clear-07');
    const fetchImplementation = fakeProvider(exactResult(fixture));
    const result = await createV4Adapter(fetchImplementation).extract(
      request,
      document,
    );

    const [, init] = fetchImplementation.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(String(init.body));
    expect(body.input[0].content[0]).toEqual({
      type: 'input_text',
      text: OPENAI_EXTRACTION_PROMPT_V4,
    });
    expect(body.text.format).toMatchObject({
      name: 'yuta_contract_extraction_v4',
      strict: true,
      type: 'json_schema',
    });
    expect(evaluateContractExtractionCandidate(fixture, result)).toMatchObject({
      mismatchDiagnostics: [],
      passed: true,
    });
  });

  it('keeps a sentence-ending period inside candidateValue as a failure', async () => {
    const fixture = findFixture('wg2-scan-clear-07');
    const semanticResult = exactResult(fixture);
    const position = semanticResult.suggestions.find(
      (suggestion) => suggestion.field === 'position',
    );
    if (!position) throw new Error('The position suggestion is missing.');
    position.candidateValue = 'Responsable de bar.';

    const result = await createV4Adapter(fakeProvider(semanticResult)).extract(
      request,
      document,
    );

    expect(evaluateContractExtractionCandidate(fixture, result)).toMatchObject({
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

  it('retains strict rejection for duplicate fields and status/count mismatch', async () => {
    const fixture = findFixture('wg2-scan-clear-09');
    const semanticResult = exactResult(fixture);
    semanticResult.status = 'partial';
    semanticResult.suggestions.push({ ...semanticResult.suggestions[0] });

    await expect(
      createV4Adapter(fakeProvider(semanticResult)).extract(request, document),
    ).rejects.toMatchObject({ code: 'INVALID_PROVIDER_RESULT' });
  });
});

function createV4Adapter(fetchImplementation: typeof fetch) {
  return new OpenAiContractExtractionAdapter({
    apiKey: 'offline-fake-key',
    model: 'gpt-5.6-luna',
    promptVersion: 'v4',
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

function exactResult(fixture: ReturnType<typeof findFixture>) {
  return {
    status: fixture.expected.status,
    suggestions: fixture.expected.suggestions.map((suggestion) => ({
      ...suggestion,
      confidence: 'high' as const,
      excerpt: 'Exact fictional evidence.',
      issueCodes: [],
    })),
    warnings: [],
  };
}

function findFixture(fixtureId: string) {
  const fixture = manifest.fixtures.find(
    (candidate) => candidate.id === fixtureId,
  );
  if (!fixture) throw new Error(`Fixture ${fixtureId} is missing.`);
  return fixture;
}
