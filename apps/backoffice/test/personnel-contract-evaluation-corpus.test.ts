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
import rawManifest from './fixtures/personnel-contract-evaluation/v1/manifest.json';

const fixtureDirectory = path.join(
  process.cwd(),
  'test',
  'fixtures',
  'personnel-contract-evaluation',
  'v1',
);
const manifest = contractEvaluationCorpusManifestSchema.parse(rawManifest);

describe('Wave G offline personnel contract evaluation corpus', () => {
  it('contains the approved sixty-fixture benchmark distribution', () => {
    expect(manifest.fixtures).toHaveLength(60);
    expect(countClasses()).toEqual({
      digital_text: 20,
      clear_scan: 15,
      degraded_scan: 15,
      adversarial: 10,
    });
  });

  it('keeps every fixture hash, PDF signature, and page count stable', async () => {
    for (const fixture of manifest.fixtures) {
      const bytes = await readFile(path.join(fixtureDirectory, fixture.file));
      expect(bytes.subarray(0, 4).toString('ascii')).toBe('%PDF');
      expect(createHash('sha256').update(bytes).digest('hex')).toBe(
        fixture.sha256,
      );
      const document = await PDFDocument.load(bytes);
      expect(document.getPageCount()).toBe(fixture.pageCount);
    }
  });

  it('accepts exact normalized answers and rejects unsafe guesses', () => {
    for (const fixture of manifest.fixtures) {
      const exact = candidateFor(fixture);
      expect(evaluateContractExtractionCandidate(fixture, exact)).toMatchObject(
        {
          schemaValid: true,
          falseSuggestions: 0,
          incorrectHighConfidenceSuggestions: 0,
          abstentionViolations: 0,
          passed: true,
        },
      );

      const forbiddenField = fixture.expected.mustAbstainFrom[0];
      if (forbiddenField) {
        const unsafe = candidateFor(fixture, {
          field: forbiddenField,
          candidateValue:
            forbiddenField === 'contractWeeklyMinutes'
              ? 2_100
              : forbiddenField === 'employmentTermType'
                ? 'indefinite'
                : 'Poste invente',
          confidence: 'high',
          sourcePage: 1,
          excerpt: 'Valeur inventee pour verifier le rejet.',
          issueCodes: [],
        });
        const outcome = evaluateContractExtractionCandidate(fixture, unsafe);
        expect(outcome.passed).toBe(false);
        if (outcome.schemaValid) {
          expect(outcome.incorrectHighConfidenceSuggestions).toBeGreaterThan(0);
          expect(outcome.abstentionViolations).toBeGreaterThan(0);
        }
      }
    }
  });

  it('rejects provider keys outside the strict YUTA result contract', () => {
    const fixture = manifest.fixtures[0]!;
    const candidate = {
      ...candidateFor(fixture),
      providerPayload: { arbitrary: true },
    };
    expect(
      evaluateContractExtractionCandidate(fixture, candidate),
    ).toMatchObject({
      schemaValid: false,
      passed: false,
    });
  });
});

function countClasses() {
  return Object.fromEntries(
    ['digital_text', 'clear_scan', 'degraded_scan', 'adversarial'].map(
      (fixtureClass) => [
        fixtureClass,
        manifest.fixtures.filter((fixture) => fixture.class === fixtureClass)
          .length,
      ],
    ),
  );
}

function candidateFor(
  fixture: (typeof manifest.fixtures)[number],
  extraSuggestion?: {
    field: 'position' | 'employmentTermType' | 'contractWeeklyMinutes';
    candidateValue: string | number;
    confidence: 'high';
    sourcePage: number;
    excerpt: string;
    issueCodes: [];
  },
) {
  return {
    schemaVersion: 1,
    requestId: '11111111-1111-4111-8111-111111111111',
    document: {
      id: '22222222-2222-4222-8222-222222222222',
      version: 1,
    },
    employeeRevision: 1,
    status: fixture.expected.status,
    pageCount: fixture.pageCount,
    suggestions: [
      ...fixture.expected.suggestions.map((suggestion) => ({
        ...suggestion,
        confidence: 'high' as const,
        excerpt: 'Extrait synthetique correspondant a la reponse attendue.',
        issueCodes: [],
      })),
      ...(extraSuggestion ? [extraSuggestion] : []),
    ],
    warnings:
      fixture.expected.status === 'partial' ? ['some_fields_not_detected'] : [],
    expiresAt: '2026-08-19T12:15:00.000Z',
  };
}
