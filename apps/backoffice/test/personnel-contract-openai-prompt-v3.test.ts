import { createHash } from 'node:crypto';

import { describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));

import {
  contractEvaluationCorpusManifestSchema,
  evaluateContractExtractionCandidate,
} from '../src/server/personnel-contract-extraction/evaluation';
import {
  OPENAI_EXTRACTION_PROMPT_V3,
  OPENAI_EXTRACTION_PROMPT_V3_SHA256,
  OpenAiContractExtractionAdapter,
} from '../src/server/personnel-contract-extraction/openai-adapter';
import rawManifest from './fixtures/personnel-contract-evaluation/v1/manifest.json';

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

describe('OpenAI extraction prompt v3 offline behavior', () => {
  it('pins the reviewable prompt and the measured-gap examples', () => {
    expect(OPENAI_EXTRACTION_PROMPT_V3_SHA256).toBe(
      '1a162a4c941a604495ae9b313af4d5bb1027aedadd689379dcd5ba2733f11017',
    );
    expect(
      createHash('sha256').update(OPENAI_EXTRACTION_PROMPT_V3).digest('hex'),
    ).toBe(OPENAI_EXTRACTION_PROMPT_V3_SHA256);
    expect(OPENAI_EXTRACTION_PROMPT_V3).toContain(
      'printed "Garcon de cafe" -> candidateValue "Garcon de cafe", not "Garçon de café"',
    );
    expect(OPENAI_EXTRACTION_PROMPT_V3).toContain(
      'Do not treat a bare duration in hours as weekly.',
    );
  });

  it('sends v3 draft and accepts an exact unaccented position response', async () => {
    const fixture = findFixture('wg2-digital-10');
    const fetchImplementation = fakeProvider(exactResult(fixture));
    const result = await createV3Adapter(fetchImplementation).extract(
      request,
      document,
    );

    const [, init] = fetchImplementation.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(String(init.body));
    expect(body.input[0].content[0]).toEqual({
      type: 'input_text',
      text: OPENAI_EXTRACTION_PROMPT_V3,
    });
    expect(body.text.format).toMatchObject({
      name: 'yuta_contract_extraction_v3',
      strict: true,
      type: 'json_schema',
    });
    expect(evaluateContractExtractionCandidate(fixture, result)).toMatchObject({
      mismatchDiagnostics: [],
      passed: true,
    });
  });

  it('keeps a normalized title as a failure', async () => {
    const fixture = findFixture('wg2-digital-10');
    const semanticResult = exactResult(fixture);
    const position = semanticResult.suggestions.find(
      (suggestion) => suggestion.field === 'position',
    );
    if (!position) throw new Error('The position suggestion is missing.');
    position.candidateValue = 'Maître d’hôtel';

    const result = await createV3Adapter(fakeProvider(semanticResult)).extract(
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

  it('accepts safe omission for a bare non-weekly duration without inventing a value', async () => {
    const fixture = findFixture('wg2-adversarial-05');
    const semanticResult = exactResult(fixture);
    semanticResult.suggestions = semanticResult.suggestions.filter(
      (suggestion) => suggestion.field === 'employmentTermType',
    );
    semanticResult.status = 'partial';

    const result = await createV3Adapter(fakeProvider(semanticResult)).extract(
      request,
      document,
    );
    const outcome = evaluateContractExtractionCandidate(fixture, result);

    expect(outcome).toMatchObject({
      falseSuggestions: 0,
      incorrectHighConfidenceSuggestions: 0,
      abstentionViolations: 0,
      passed: false,
    });
    expect(outcome.mismatchDiagnostics).toContainEqual({
      field: 'contractWeeklyMinutes',
      kinds: ['missing_expected_suggestion'],
    });
  });

  it('retains strict unique-field and status/count validation', async () => {
    await expect(
      createV3Adapter(
        fakeProvider({ status: 'partial', suggestions: [], warnings: [] }),
      ).extract(request, document),
    ).rejects.toMatchObject({ code: 'INVALID_PROVIDER_RESULT' });
  });
});

function createV3Adapter(fetchImplementation: typeof fetch) {
  return new OpenAiContractExtractionAdapter({
    apiKey: 'offline-fake-key',
    model: 'gpt-5.6-luna',
    promptVersion: 'v3',
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
