import 'server-only';

import {
  personnelContractExtractionConfidenceSchema,
  personnelContractExtractionFieldSchema,
  personnelContractExtractionReviewResultSchema,
  personnelEmploymentTermTypeSchema,
} from '@yuta/contracts/personnel';
import { z } from 'zod';

const expectedSuggestionBaseSchema = z
  .object({
    sourcePage: z.number().int().min(1).max(40),
  })
  .strict();

const expectedSuggestionSchema = z.discriminatedUnion('field', [
  expectedSuggestionBaseSchema.extend({
    field: z.literal('position'),
    candidateValue: z.string().trim().min(1).max(160),
  }),
  expectedSuggestionBaseSchema.extend({
    field: z.literal('employmentTermType'),
    candidateValue: personnelEmploymentTermTypeSchema,
  }),
  expectedSuggestionBaseSchema.extend({
    field: z.literal('contractWeeklyMinutes'),
    candidateValue: z.number().int().min(1).max(2_880),
  }),
]);

export const contractEvaluationFixtureSchema = z
  .object({
    id: z.string().regex(/^wg2-[a-z0-9-]+$/),
    class: z.enum([
      'digital_text',
      'clear_scan',
      'degraded_scan',
      'adversarial',
    ]),
    file: z.string().regex(/^[a-z0-9-]+\.pdf$/),
    sha256: z.string().regex(/^[a-f0-9]{64}$/),
    pageCount: z.number().int().min(1).max(40),
    expected: z
      .object({
        status: z.enum(['complete', 'partial', 'no_result', 'unsupported']),
        suggestions: z.array(expectedSuggestionSchema).max(8),
        mustAbstainFrom: z.array(personnelContractExtractionFieldSchema).max(3),
      })
      .strict(),
  })
  .strict()
  .superRefine((fixture, context) => {
    const expectedFields = new Set(
      fixture.expected.suggestions.map((suggestion) => suggestion.field),
    );
    for (const [index, field] of fixture.expected.mustAbstainFrom.entries()) {
      if (expectedFields.has(field)) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['expected', 'mustAbstainFrom', index],
          message: 'A required suggestion cannot also require abstention.',
        });
      }
    }
    for (const [index, suggestion] of fixture.expected.suggestions.entries()) {
      if (suggestion.sourcePage > fixture.pageCount) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['expected', 'suggestions', index, 'sourcePage'],
          message: 'The expected source page must exist in the fixture.',
        });
      }
    }
  });

export const contractEvaluationCorpusManifestSchema = z
  .object({
    schemaVersion: z.literal(1),
    corpusId: z.enum(['yuta-wg2-contracts-v1', 'yuta-wg2-contracts-v2']),
    generatorVersion: z.union([z.literal(2), z.literal(3)]),
    syntheticOnly: z.literal(true),
    fixtures: z.array(contractEvaluationFixtureSchema).length(60),
  })
  .strict()
  .superRefine((manifest, context) => {
    const identityMatches =
      (manifest.corpusId === 'yuta-wg2-contracts-v1' &&
        manifest.generatorVersion === 2) ||
      (manifest.corpusId === 'yuta-wg2-contracts-v2' &&
        manifest.generatorVersion === 3);
    if (!identityMatches) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['generatorVersion'],
        message: 'The corpus and generator versions must match.',
      });
    }

    const identifiers = new Set<string>();
    const files = new Set<string>();
    for (const [index, fixture] of manifest.fixtures.entries()) {
      if (identifiers.has(fixture.id)) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['fixtures', index, 'id'],
          message: 'Fixture identifiers must be unique.',
        });
      }
      if (files.has(fixture.file)) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['fixtures', index, 'file'],
          message: 'Fixture filenames must be unique.',
        });
      }
      identifiers.add(fixture.id);
      files.add(fixture.file);
    }
  });

export type ContractEvaluationFixture = z.infer<
  typeof contractEvaluationFixtureSchema
>;

export type ContractEvaluationOutcome = Readonly<{
  schemaValid: boolean;
  statusMatch: boolean;
  exactMatches: number;
  missingSuggestions: number;
  falseSuggestions: number;
  incorrectHighConfidenceSuggestions: number;
  abstentionViolations: number;
  mismatchDiagnostics: readonly ContractEvaluationFieldMismatch[];
  passed: boolean;
}>;

export type ContractEvaluationMismatchKind =
  | 'missing_expected_suggestion'
  | 'unexpected_suggestion'
  | 'candidate_value'
  | 'source_page'
  | 'duplicate_field'
  | 'orthographic_variation';

export type ContractEvaluationFieldMismatch = Readonly<{
  field: z.infer<typeof personnelContractExtractionFieldSchema>;
  kinds: readonly ContractEvaluationMismatchKind[];
}>;

const evaluationFields = [
  'position',
  'employmentTermType',
  'contractWeeklyMinutes',
] as const;

export function evaluateContractExtractionCandidate(
  rawFixture: ContractEvaluationFixture,
  rawCandidate: unknown,
): ContractEvaluationOutcome {
  const fixture = contractEvaluationFixtureSchema.parse(rawFixture);
  const parsedCandidate =
    personnelContractExtractionReviewResultSchema.safeParse(rawCandidate);
  if (!parsedCandidate.success) {
    return {
      schemaValid: false,
      statusMatch: false,
      exactMatches: 0,
      missingSuggestions: fixture.expected.suggestions.length,
      falseSuggestions: 0,
      incorrectHighConfidenceSuggestions: 0,
      abstentionViolations: 0,
      mismatchDiagnostics: [],
      passed: false,
    };
  }

  const candidate = parsedCandidate.data;
  const expectedKeys = new Set(fixture.expected.suggestions.map(suggestionKey));
  const candidateKeys = candidate.suggestions.map(suggestionKey);
  const exactMatches = candidateKeys.filter((key) =>
    expectedKeys.has(key),
  ).length;
  const falseSuggestions = candidateKeys.length - exactMatches;
  const incorrectHighConfidenceSuggestions = candidate.suggestions.filter(
    (suggestion) =>
      suggestion.confidence ===
        personnelContractExtractionConfidenceSchema.enum.high &&
      !expectedKeys.has(suggestionKey(suggestion)),
  ).length;
  const abstentionFields = new Set(fixture.expected.mustAbstainFrom);
  const abstentionViolations = candidate.suggestions.filter((suggestion) =>
    abstentionFields.has(suggestion.field),
  ).length;
  const missingSuggestions = fixture.expected.suggestions.length - exactMatches;
  const statusMatch = candidate.status === fixture.expected.status;
  const mismatchDiagnostics = evaluationFields.flatMap((field) => {
    const expected = fixture.expected.suggestions.find(
      (suggestion) => suggestion.field === field,
    );
    const actual = candidate.suggestions.filter(
      (suggestion) => suggestion.field === field,
    );
    const kinds = new Set<ContractEvaluationMismatchKind>();

    if (actual.length > 1) kinds.add('duplicate_field');
    if (!expected) {
      if (actual.length > 0) kinds.add('unexpected_suggestion');
    } else {
      if (
        !actual.some(
          (suggestion) => suggestionKey(suggestion) === suggestionKey(expected),
        )
      ) {
        kinds.add('missing_expected_suggestion');
      }
      for (const suggestion of actual) {
        if (suggestion.candidateValue !== expected.candidateValue) {
          kinds.add('candidate_value');
          if (
            typeof suggestion.candidateValue === 'string' &&
            typeof expected.candidateValue === 'string' &&
            normalizeOrthography(suggestion.candidateValue) ===
              normalizeOrthography(expected.candidateValue)
          ) {
            kinds.add('orthographic_variation');
          }
        }
        if (suggestion.sourcePage !== expected.sourcePage) {
          kinds.add('source_page');
        }
      }
    }

    return kinds.size > 0 ? [{ field, kinds: [...kinds] }] : [];
  });

  return {
    schemaValid: true,
    statusMatch,
    exactMatches,
    missingSuggestions,
    falseSuggestions,
    incorrectHighConfidenceSuggestions,
    abstentionViolations,
    mismatchDiagnostics,
    passed:
      statusMatch &&
      missingSuggestions === 0 &&
      falseSuggestions === 0 &&
      incorrectHighConfidenceSuggestions === 0 &&
      abstentionViolations === 0,
  };
}

function normalizeOrthography(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/\p{Mark}/gu, '')
    .toLocaleLowerCase('fr-FR')
    .replace(/['’`-]/g, ' ')
    .replace(/[^\p{Letter}\p{Number}]+/gu, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

function suggestionKey(suggestion: {
  field: string;
  candidateValue: string | number;
  sourcePage: number;
}): string {
  return JSON.stringify([
    suggestion.field,
    suggestion.candidateValue,
    suggestion.sourcePage,
  ]);
}
