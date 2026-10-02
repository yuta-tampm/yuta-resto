import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { PDFDocument } from 'pdf-lib';
import { describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));

import {
  contractEvaluationCorpusManifestSchema,
  evaluateContractExtractionCandidate,
} from '../src/server/personnel-contract-extraction/evaluation';
import {
  OpenAiContractExtractionAdapter,
  type OpenAiExtractionObservation,
} from '../src/server/personnel-contract-extraction/openai-adapter';
import rawV1Manifest from './fixtures/personnel-contract-evaluation/v1/manifest.json';

const evaluationRun = process.env.YUTA_OPENAI_EVALUATION_RUN;
const manifest = contractEvaluationCorpusManifestSchema.parse(rawV1Manifest);
const approvedModel =
  evaluationRun === 'approved-terra-full-corpus'
    ? ('gpt-5.6-terra' as const)
    : ('gpt-5.6-luna' as const);
const completedFixtureIds = new Set([
  'wg2-digital-cdd-35h',
  'wg2-scan-clear-cdd',
  'wg2-scan-degraded-partial',
  'wg2-adversarial-instruction',
]);
const approvedFixtureIds =
  evaluationRun === 'approved-synthetic-only'
    ? ['wg2-digital-cdd-35h']
    : evaluationRun === 'approved-three-representative'
      ? [
          'wg2-scan-clear-cdd',
          'wg2-scan-degraded-partial',
          'wg2-adversarial-instruction',
        ]
      : evaluationRun === 'approved-remaining-corpus'
        ? manifest.fixtures
            .map((fixture) => fixture.id)
            .filter((fixtureId) => !completedFixtureIds.has(fixtureId))
        : evaluationRun === 'approved-terra-full-corpus'
          ? manifest.fixtures.map((fixture) => fixture.id)
          : [];

if (
  evaluationRun === 'approved-remaining-corpus' &&
  approvedFixtureIds.length !== 56
) {
  throw new Error(
    'The approved remaining corpus must contain exactly 56 PDFs.',
  );
}
if (
  evaluationRun === 'approved-terra-full-corpus' &&
  approvedFixtureIds.length !== 60
) {
  throw new Error('The approved Terra corpus must contain exactly 60 PDFs.');
}
describe.skipIf(approvedFixtureIds.length === 0)(
  'approved OpenAI synthetic PDF smoke call',
  () => {
    it.each(approvedFixtureIds)(
      'sends exactly the locked fictional fixture %s and records sanitized metrics',
      { timeout: 60_000 },
      async (fixtureId) => {
        const apiKey = process.env.YUTA_OPENAI_EVALUATION_API_KEY?.trim();
        if (!apiKey) {
          throw new Error(
            'YUTA_OPENAI_EVALUATION_API_KEY is required for the approved synthetic smoke call.',
          );
        }

        expect(manifest.syntheticOnly).toBe(true);
        const fixture = manifest.fixtures.find(
          (candidate) => candidate.id === fixtureId,
        );
        if (!fixture)
          throw new Error('The locked synthetic smoke fixture is missing.');

        const fixturePath = path.join(
          process.cwd(),
          'test',
          'fixtures',
          'personnel-contract-evaluation',
          'v1',
          fixture.file,
        );
        const bytes = await readFile(fixturePath);
        expect(createHash('sha256').update(bytes).digest('hex')).toBe(
          fixture.sha256,
        );
        const pdf = await PDFDocument.load(bytes);
        expect(pdf.getPageCount()).toBe(fixture.pageCount);

        let observation: OpenAiExtractionObservation | undefined;
        const adapter = new OpenAiContractExtractionAdapter({
          apiKey,
          model: approvedModel,
          onCompleted: (value) => {
            observation = value;
          },
        });
        const startedAt = performance.now();
        const result = await adapter.extract(
          {
            requestId: '11111111-1111-4111-8111-111111111111',
            employeeId: '22222222-2222-4222-8222-222222222222',
            documentId: '33333333-3333-4333-8333-333333333333',
            documentVersion: 1,
            employeeRevision: 1,
            scenario: 'complete',
          },
          {
            source: 'synthetic_fixture',
            pageCount: fixture.pageCount,
            scenario: 'complete',
            bytes,
          },
        );
        const latencyMilliseconds = Math.round(performance.now() - startedAt);
        const outcome = evaluateContractExtractionCandidate(fixture, result);
        const pricing =
          observation?.model === 'gpt-5.6-terra'
            ? { input: 2, output: 12 }
            : { input: 0.2, output: 1.2 };
        const estimatedCostUsd = observation
          ? ((observation.inputTokens ?? 0) * pricing.input +
              (observation.outputTokens ?? 0) * pricing.output) /
            1_000_000
          : undefined;

        console.info(
          'YUTA_OPENAI_SYNTHETIC_SMOKE',
          JSON.stringify({
            fixtureId: fixture.id,
            model: observation?.model,
            promptVersion: observation?.promptVersion,
            latencyMilliseconds,
            inputTokens: observation?.inputTokens,
            outputTokens: observation?.outputTokens,
            totalTokens: observation?.totalTokens,
            estimatedCostUsd,
            status: result.status,
            suggestionCount: result.suggestions.length,
            outcome,
          }),
        );

        expect(outcome).toMatchObject({
          schemaValid: true,
          falseSuggestions: 0,
          incorrectHighConfidenceSuggestions: 0,
          abstentionViolations: 0,
          passed: true,
        });
      },
    );
  },
);
