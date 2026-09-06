import { describe, expect, it } from 'vitest';
import {
  derivePersonnelHistoryMutationEvidence,
  PersonnelHistoryMetadataError,
} from '../src/personnel-history-domain';

const current = {
  givenNames: 'Camille',
  familyName: 'Martin',
  position: 'Serveuse',
  qualification: 'Employée',
  employmentTermType: 'indefinite' as const,
  expectedEndDate: null,
  fixedTermReasonCode: null,
  workTimeCategory: 'full_time' as const,
  contractWeeklyMinutes: 2_100,
  entryDate: '2026-01-01',
  departureDate: null,
};

function proposed() {
  return {
    idempotencyKey: '019b7a84-aec8-7000-8000-000000000001',
    employeeId: '019b7a84-aec8-7000-8000-000000000002',
    expectedRevision: 1,
    ...current,
    confirmFixedTermReasonClear: false,
  };
}

describe('personnel reconstructable history domain', () => {
  it('derives server-side groups and validates mixed metadata independently', () => {
    const evidence = derivePersonnelHistoryMutationEvidence({
      current,
      businessDate: '2026-08-13',
      proposed: {
        ...proposed(),
        givenNames: 'Camille Marie',
        position: 'Cheffe de rang',
        workTimeCategory: 'part_time',
        contractWeeklyMinutes: 1_500,
        historyMetadata: [
          {
            semanticGroup: 'identity',
            classification: 'correction',
            effectiveDate: null,
            correctionReason: null,
          },
          {
            semanticGroup: 'role',
            classification: 'change',
            effectiveDate: '2026-08-01',
            correctionReason: null,
          },
          {
            semanticGroup: 'work_time',
            classification: 'correction',
            effectiveDate: null,
            correctionReason: 'Durée contractuelle mal saisie.',
          },
        ],
      },
    });
    expect(evidence.map((item) => item.semanticGroup)).toEqual([
      'identity',
      'role',
      'work_time',
    ]);
    expect(evidence[0]?.previousSnapshot.values).toMatchObject({
      givenNames: 'Camille',
    });
    expect(evidence[0]?.newSnapshot.values).toMatchObject({
      givenNames: 'Camille Marie',
    });
  });

  it.each([
    ['missing metadata', { position: 'Cheffe' }, []],
    [
      'metadata for unchanged group',
      {},
      [
        {
          semanticGroup: 'role',
          classification: 'correction',
          effectiveDate: null,
          correctionReason: null,
        },
      ],
    ],
    [
      'future effective date',
      { position: 'Cheffe' },
      [
        {
          semanticGroup: 'role',
          classification: 'change',
          effectiveDate: '2026-08-14',
          correctionReason: null,
        },
      ],
    ],
    [
      'effective date before entry',
      { position: 'Cheffe' },
      [
        {
          semanticGroup: 'role',
          classification: 'change',
          effectiveDate: '2025-12-31',
          correctionReason: null,
        },
      ],
    ],
    [
      'entry classified as change',
      { entryDate: '2026-02-01' },
      [
        {
          semanticGroup: 'entry',
          classification: 'change',
          effectiveDate: null,
          correctionReason: null,
        },
      ],
    ],
    [
      'missing contractual correction reason',
      { contractWeeklyMinutes: 2_000 },
      [
        {
          semanticGroup: 'work_time',
          classification: 'correction',
          effectiveDate: null,
          correctionReason: null,
        },
      ],
    ],
  ])('rejects the whole evidence set for %s', (_label, changes, metadata) => {
    expect(() =>
      derivePersonnelHistoryMutationEvidence({
        current,
        businessDate: '2026-08-13',
        proposed: {
          ...proposed(),
          ...changes,
          historyMetadata: metadata,
        },
      }),
    ).toThrow(PersonnelHistoryMetadataError);
  });

  it('rejects an effective date after an existing departure', () => {
    expect(() =>
      derivePersonnelHistoryMutationEvidence({
        current: { ...current, departureDate: '2026-07-31' },
        businessDate: '2026-08-13',
        proposed: {
          ...proposed(),
          position: 'Cheffe',
          historyMetadata: [
            {
              semanticGroup: 'role',
              classification: 'change',
              effectiveDate: '2026-08-01',
              correctionReason: null,
            },
          ],
        },
      }),
    ).toThrow(PersonnelHistoryMetadataError);
  });

  it('allows Identity CHANGE and optional Role correction reason without dates', () => {
    const evidence = derivePersonnelHistoryMutationEvidence({
      current,
      businessDate: '2026-08-13',
      proposed: {
        ...proposed(),
        familyName: 'Durand',
        qualification: 'Employée qualifiée',
        historyMetadata: [
          {
            semanticGroup: 'identity',
            classification: 'change',
            effectiveDate: null,
            correctionReason: null,
          },
          {
            semanticGroup: 'role',
            classification: 'correction',
            effectiveDate: null,
            correctionReason: 'Qualification rectifiée.',
          },
        ],
      },
    });
    expect(evidence).toHaveLength(2);
  });

  it.each([
    [
      'duplicate group metadata',
      { position: 'Cheffe' },
      [
        {
          semanticGroup: 'role',
          classification: 'correction',
          effectiveDate: null,
          correctionReason: null,
        },
        {
          semanticGroup: 'role',
          classification: 'correction',
          effectiveDate: null,
          correctionReason: null,
        },
      ],
    ],
    [
      'missing effective date',
      { position: 'Cheffe' },
      [
        {
          semanticGroup: 'role',
          classification: 'change',
          effectiveDate: null,
          correctionReason: null,
        },
      ],
    ],
    [
      'effective date on correction',
      { position: 'Cheffe' },
      [
        {
          semanticGroup: 'role',
          classification: 'correction',
          effectiveDate: '2026-08-13',
          correctionReason: null,
        },
      ],
    ],
    [
      'correction reason on change',
      { position: 'Cheffe' },
      [
        {
          semanticGroup: 'role',
          classification: 'change',
          effectiveDate: '2026-08-13',
          correctionReason: 'Not a correction.',
        },
      ],
    ],
    [
      'entry correction without reason',
      { entryDate: '2026-02-01' },
      [
        {
          semanticGroup: 'entry',
          classification: 'correction',
          effectiveDate: null,
          correctionReason: null,
        },
      ],
    ],
  ])(
    'rejects invalid conditional metadata: %s',
    (_label, changes, metadata) => {
      expect(() =>
        derivePersonnelHistoryMutationEvidence({
          current,
          businessDate: '2026-08-13',
          proposed: {
            ...proposed(),
            ...changes,
            historyMetadata: metadata,
          },
        }),
      ).toThrow(PersonnelHistoryMetadataError);
    },
  );
});
