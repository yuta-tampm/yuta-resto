import { describe, expect, it } from 'vitest';
import {
  formalitesPersonnelAbandonDraftInputSchema,
  formalitesPersonnelAbandonmentReasonSchema,
  formalitesPersonnelCreateDraftInputSchema,
  formalitesPersonnelDraftMutationOutcomeSchema,
  formalitesPersonnelDraftReadModelSchema,
  formalitesPersonnelFactSchema,
  formalitesPersonnelFactsSchema,
  formalitesPersonnelProbationChoiceSchema,
  formalitesPersonnelReconcileDraftInputSchema,
  formalitesPersonnelReconciliationDecisionsSchema,
  formalitesPersonnelSaveDraftInputSchema,
} from '../src/formalites';

const employeeId = '11111111-1111-4111-8111-111111111111';
const draftId = '22222222-2222-4222-8222-222222222222';
const operationKey = 'opaque_operation_01';

const facts = {
  givenNames: 'Camille',
  familyName: 'Martin',
  position: 'Cheffe de rang',
  qualification: 'Employée qualifiée',
  employmentTermType: 'indefinite' as const,
  entryDate: '2026-09-01',
  contractWeeklyMinutes: null,
};

describe('Formalités Personnel contracts', () => {
  it('allowlists the exact seven Personnel facts and preserves null minutes', () => {
    expect(formalitesPersonnelFactSchema.options).toEqual([
      'givenNames',
      'familyName',
      'position',
      'qualification',
      'employmentTermType',
      'entryDate',
      'contractWeeklyMinutes',
    ]);
    expect(formalitesPersonnelFactsSchema.parse(facts)).toEqual(facts);
    expect(
      formalitesPersonnelFactsSchema.safeParse({
        ...facts,
        address: 'Not approved',
      }).success,
    ).toBe(false);
    expect(
      formalitesPersonnelFactsSchema.safeParse({
        ...facts,
        contractWeeklyMinutes: 0,
      }).success,
    ).toBe(false);
  });

  it('keeps the formality and probation allowlists bounded', () => {
    expect(formalitesPersonnelProbationChoiceSchema.options).toEqual([
      'undecided',
      'include',
      'exclude',
    ]);
    expect(
      formalitesPersonnelCreateDraftInputSchema.parse({
        employeeId,
        operationKey,
      }),
    ).toEqual({
      employeeId,
      operationKey,
      probationChoice: 'undecided',
    });
    expect(
      formalitesPersonnelCreateDraftInputSchema.safeParse({
        employeeId,
        operationKey,
        formalityType: 'dpae',
      }).success,
    ).toBe(false);
  });

  it('requires a bounded opaque operation key on every mutation', () => {
    const common = { employeeId, draftId, expectedDraftRevision: 1 };
    const cases = [
      [formalitesPersonnelCreateDraftInputSchema, { employeeId }],
      [
        formalitesPersonnelSaveDraftInputSchema,
        { ...common, probationChoice: 'include' },
      ],
      [
        formalitesPersonnelReconcileDraftInputSchema,
        {
          ...common,
          sourceStateFingerprint: 'a'.repeat(64),
          decisions: [],
        },
      ],
      [
        formalitesPersonnelAbandonDraftInputSchema,
        { ...common, abandonmentReason: 'Préparation annulée.' },
      ],
    ] as const;

    for (const [schema, value] of cases) {
      expect(schema.safeParse(value).success).toBe(false);
      expect(
        schema.safeParse({ ...value, operationKey: 'raw tenant/customer data' })
          .success,
      ).toBe(false);
    }
  });

  it('validates exact per-fact reconciliation decisions', () => {
    expect(
      formalitesPersonnelReconciliationDecisionsSchema.parse([
        { fact: 'position', choice: 'keep' },
        { fact: 'qualification', choice: 'refresh' },
      ]),
    ).toHaveLength(2);
    expect(
      formalitesPersonnelReconciliationDecisionsSchema.safeParse([
        { fact: 'position', choice: 'keep' },
        { fact: 'position', choice: 'refresh' },
      ]).success,
    ).toBe(false);
  });

  it('bounds and trims abandonment reasons', () => {
    expect(
      formalitesPersonnelAbandonmentReasonSchema.parse('  Motif valide  '),
    ).toBe('Motif valide');
    expect(
      formalitesPersonnelAbandonmentReasonSchema.safeParse(' ').success,
    ).toBe(false);
    expect(
      formalitesPersonnelAbandonmentReasonSchema.safeParse('x'.repeat(251))
        .success,
    ).toBe(false);
  });

  it('exposes strict safe read models and typed recoverable outcomes', () => {
    const model = {
      state: 'editable' as const,
      draftId,
      formalityType: 'cdi_preparation' as const,
      status: 'draft' as const,
      probationChoice: 'undecided' as const,
      revision: 1,
      draftValues: facts,
      currentPersonnelValues: facts,
      createdAt: '2026-09-05T08:00:00.000Z',
      updatedAt: '2026-09-05T08:00:00.000Z',
    };

    expect(formalitesPersonnelDraftReadModelSchema.parse(model)).toEqual(model);
    for (const internalField of [
      'operationKey',
      'operationKeyHash',
      'requestFingerprint',
      'organizationId',
      'establishmentId',
      'actorUserId',
    ]) {
      expect(
        formalitesPersonnelDraftReadModelSchema.safeParse({
          ...model,
          [internalField]: 'not-public',
        }).success,
      ).toBe(false);
    }

    expect(
      formalitesPersonnelDraftMutationOutcomeSchema.parse({
        kind: 'success',
        replayed: true,
        model,
      }),
    ).toMatchObject({ kind: 'success', replayed: true });
    expect(
      formalitesPersonnelDraftMutationOutcomeSchema.safeParse({
        kind: 'server_error',
        stack: 'not-public',
      }).success,
    ).toBe(false);
  });
});
