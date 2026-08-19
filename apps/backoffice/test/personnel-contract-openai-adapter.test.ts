import { describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));

import {
  OpenAiContractExtractionAdapter,
  OpenAiContractExtractionError,
} from '../src/server/personnel-contract-extraction/openai-adapter';

const request = {
  requestId: '11111111-1111-4111-8111-111111111111',
  employeeId: '22222222-2222-4222-8222-222222222222',
  documentId: '33333333-3333-4333-8333-333333333333',
  documentVersion: 2,
  employeeRevision: 4,
  scenario: 'complete' as const,
};

const document = {
  source: 'synthetic_fixture' as const,
  pageCount: 2,
  scenario: 'complete' as const,
  bytes: new Uint8Array([37, 80, 68, 70, 45, 49, 46, 55]),
};

function providerResponse(overrides: Record<string, unknown> = {}) {
  return {
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
                  excerpt: 'Fonctions de Chef de rang.',
                  issueCodes: [],
                },
              ],
              warnings: [],
            }),
          },
        ],
      },
    ],
    usage: { input_tokens: 100, output_tokens: 20, total_tokens: 120 },
    ...overrides,
  };
}

describe('OpenAI synthetic contract extraction adapter', () => {
  it('sends one transient direct-PDF request and rebuilds the YUTA envelope', async () => {
    const observations: unknown[] = [];
    const fetchImplementation = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(providerResponse()), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
    );
    const adapter = new OpenAiContractExtractionAdapter({
      apiKey: 'test-key',
      model: 'gpt-5.6-luna',
      fetchImplementation,
      now: () => new Date('2026-08-19T10:00:00.000Z'),
      onCompleted: (observation) => observations.push(observation),
    });

    await expect(adapter.extract(request, document)).resolves.toMatchObject({
      schemaVersion: 1,
      requestId: request.requestId,
      document: { id: request.documentId, version: 2 },
      employeeRevision: 4,
      pageCount: 2,
      status: 'complete',
      expiresAt: '2026-08-19T10:15:00.000Z',
    });

    expect(fetchImplementation).toHaveBeenCalledTimes(1);
    const [url, init] = fetchImplementation.mock.calls[0] as [
      string,
      RequestInit,
    ];
    expect(url).toBe('https://api.openai.com/v1/responses');
    const body = JSON.parse(String(init.body));
    expect(body).toMatchObject({
      model: 'gpt-5.6-luna',
      store: false,
      reasoning: { effort: 'low' },
      text: {
        format: {
          type: 'json_schema',
          name: 'yuta_contract_extraction_v1',
          strict: true,
        },
      },
    });
    expect(body).not.toHaveProperty('tools');
    expect(body).not.toHaveProperty('background');
    expect(body.input[1].content[0]).toMatchObject({
      type: 'input_file',
      filename: 'yuta-synthetic-contract.pdf',
    });
    expect(body.input[1].content[0].file_data).toMatch(
      /^data:application\/pdf;base64,/,
    );
    expect(observations).toEqual([
      {
        model: 'gpt-5.6-luna',
        promptVersion: 'v1',
        inputTokens: 100,
        outputTokens: 20,
        totalTokens: 120,
      },
    ]);
  });

  it('fails closed before network access for a missing or non-PDF fixture', async () => {
    const fetchImplementation = vi.fn();
    const adapter = new OpenAiContractExtractionAdapter({
      apiKey: 'test-key',
      model: 'gpt-5.6-luna',
      fetchImplementation,
    });
    await expect(
      adapter.extract(request, { ...document, bytes: undefined }),
    ).rejects.toMatchObject({ code: 'INVALID_SYNTHETIC_DOCUMENT' });
    await expect(
      adapter.extract(request, {
        ...document,
        bytes: new Uint8Array([78, 79, 80, 69]),
      }),
    ).rejects.toMatchObject({ code: 'INVALID_SYNTHETIC_DOCUMENT' });
    expect(fetchImplementation).not.toHaveBeenCalled();
  });

  it('does not expose provider bodies and rejects output outside the allowlist', async () => {
    const rejected = new OpenAiContractExtractionAdapter({
      apiKey: 'test-key',
      model: 'gpt-5.6-luna',
      fetchImplementation: vi
        .fn()
        .mockResolvedValue(
          new Response('secret provider diagnostics', { status: 429 }),
        ),
    });
    await expect(rejected.extract(request, document)).rejects.toEqual(
      expect.objectContaining({
        code: 'PROVIDER_FAILURE',
        status: 429,
        message: 'The OpenAI evaluation request was rejected.',
      }),
    );

    const malformed = new OpenAiContractExtractionAdapter({
      apiKey: 'test-key',
      model: 'gpt-5.6-luna',
      fetchImplementation: vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify(
            providerResponse({
              output: [
                {
                  type: 'message',
                  content: [
                    {
                      type: 'output_text',
                      text: JSON.stringify({
                        status: 'complete',
                        suggestions: [],
                        warnings: [],
                        providerPayload: true,
                      }),
                    },
                  ],
                },
              ],
            }),
          ),
          { status: 200 },
        ),
      ),
    });
    await expect(malformed.extract(request, document)).rejects.toBeInstanceOf(
      OpenAiContractExtractionError,
    );
  });
});
