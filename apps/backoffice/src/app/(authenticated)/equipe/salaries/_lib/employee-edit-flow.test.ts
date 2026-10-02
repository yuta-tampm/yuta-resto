import { describe, expect, it } from 'vitest';
import {
  areClientHistoryMetadataDraftsReady,
  createEmployeeEditHistoryMetadataDrafts,
  getAllowedHistoryClassifications,
  getClientObservedChangedGroups,
  hasEmployeeEditUnsavedChanges,
  historyMetadataRequirements,
  isClientHistoryMetadataDraftValid,
  isEmployeeEditSubmitDisabled,
  serializeClientHistoryMetadata,
  type EmployeeEditHistoryMetadataDraft,
  type EmployeeEditSemanticGroup,
  type EmployeeEditDraftSnapshot,
} from './employee-edit-flow';

const initialDraft: EmployeeEditDraftSnapshot = {
  givenNames: 'Nina',
  familyName: 'F03-Sierra',
  position: 'Responsable de salle',
  qualification: 'Employée qualifiée',
  employmentTermType: 'fixed_term',
  expectedEndDate: '2026-12-31',
  fixedTermReasonCode: 'seasonal_employment',
  workTimeCategory: 'full_time',
  contractWeeklyHours: '35',
  contractWeeklyMinuteRemainder: '0',
  entryDate: '2026-08-23',
};

const historyDrafts: Record<
  EmployeeEditSemanticGroup,
  EmployeeEditHistoryMetadataDraft
> = {
  identity: {
    classification: 'correction',
    effectiveDate: '',
    correctionReason: 'Nom saisi incorrectement',
  },
  role: {
    classification: 'change',
    effectiveDate: '2026-09-01',
    correctionReason: '',
  },
  contract_terms: {
    classification: 'correction',
    effectiveDate: '',
    correctionReason: 'Contrat corrigé',
  },
  work_time: {
    classification: 'correction',
    effectiveDate: '',
    correctionReason: 'Durée corrigée',
  },
  entry: {
    classification: 'correction',
    effectiveDate: '',
    correctionReason: 'Date corrigée',
  },
};

const effectiveDateBoundaries = {
  minimumEffectiveDate: '2026-08-23',
  maximumEffectiveDate: '2026-09-03',
};

describe('employee edit flow', () => {
  it('does not report changes for the current loaded values', () => {
    expect(hasEmployeeEditUnsavedChanges(initialDraft, initialDraft)).toBe(
      false,
    );
    expect(
      hasEmployeeEditUnsavedChanges(initialDraft, { ...initialDraft }),
    ).toBe(false);
  });

  it.each([
    { givenNames: 'Nina Marie' },
    { familyName: 'F03-Luna' },
    { position: 'Cheffe de rang' },
    { qualification: 'Agent de maîtrise' },
    { employmentTermType: 'indefinite' },
    { expectedEndDate: '2027-01-31' },
    { fixedTermReasonCode: 'replacement' },
    { workTimeCategory: 'part_time' },
    { contractWeeklyHours: '24' },
    { contractWeeklyMinuteRemainder: '30' },
    { entryDate: '2026-08-24' },
  ])('detects an unsaved edit change: %o', (change) => {
    expect(
      hasEmployeeEditUnsavedChanges(initialDraft, {
        ...initialDraft,
        ...change,
      }),
    ).toBe(true);
  });

  it('stops reporting a change when the loaded value is restored', () => {
    const changed = { ...initialDraft, position: 'Cheffe de rang' };
    expect(hasEmployeeEditUnsavedChanges(initialDraft, changed)).toBe(true);
    expect(
      hasEmployeeEditUnsavedChanges(initialDraft, {
        ...changed,
        position: initialDraft.position,
      }),
    ).toBe(false);
  });

  it('groups coupled fields for presentation without claiming server authority', () => {
    expect(
      getClientObservedChangedGroups(initialDraft, {
        ...initialDraft,
        givenNames: 'Nina Marie',
        employmentTermType: 'indefinite',
        expectedEndDate: '',
        fixedTermReasonCode: '',
        contractWeeklyHours: '30',
      }),
    ).toEqual(['identity', 'contract_terms', 'work_time']);
  });

  it('allows both meanings for identity but correction only for entry', () => {
    expect(getAllowedHistoryClassifications('identity')).toEqual([
      'correction',
      'change',
    ]);
    expect(getAllowedHistoryClassifications('entry')).toEqual(['correction']);
  });

  it('applies the approved effective-date and correction-reason matrix', () => {
    expect(historyMetadataRequirements('role', 'change')).toEqual({
      effectiveDate: 'required',
      correctionReason: 'hidden',
    });
    expect(historyMetadataRequirements('identity', 'correction')).toEqual({
      effectiveDate: 'hidden',
      correctionReason: 'optional',
    });
    expect(historyMetadataRequirements('contract_terms', 'correction')).toEqual(
      {
        effectiveDate: 'hidden',
        correctionReason: 'required',
      },
    );
    expect(historyMetadataRequirements('entry', 'correction')).toEqual({
      effectiveDate: 'hidden',
      correctionReason: 'required',
    });
  });

  it('accepts today or a past effective date and rejects a future date', () => {
    const draft = {
      classification: 'change' as const,
      effectiveDate: '2026-09-03',
      correctionReason: '',
    };
    expect(
      isClientHistoryMetadataDraftValid('role', draft, effectiveDateBoundaries),
    ).toBe(true);
    expect(
      isClientHistoryMetadataDraftValid(
        'role',
        { ...draft, effectiveDate: '2026-09-04' },
        effectiveDateBoundaries,
      ),
    ).toBe(false);
  });

  it('requires a reason only for the approved correction groups', () => {
    const correction = {
      classification: 'correction' as const,
      effectiveDate: '',
      correctionReason: '',
    };
    expect(
      isClientHistoryMetadataDraftValid(
        'identity',
        correction,
        effectiveDateBoundaries,
      ),
    ).toBe(true);
    expect(
      isClientHistoryMetadataDraftValid(
        'work_time',
        correction,
        effectiveDateBoundaries,
      ),
    ).toBe(false);
    expect(
      isClientHistoryMetadataDraftValid(
        'work_time',
        { ...correction, correctionReason: 'Durée contractuelle corrigée' },
        effectiveDateBoundaries,
      ),
    ).toBe(true);
  });

  it('normalizes all changed groups into one metadata payload', () => {
    expect(
      JSON.parse(
        serializeClientHistoryMetadata(
          ['identity', 'role', 'work_time'],
          historyDrafts,
        ),
      ),
    ).toEqual([
      {
        semanticGroup: 'identity',
        classification: 'correction',
        effectiveDate: null,
        correctionReason: 'Nom saisi incorrectement',
      },
      {
        semanticGroup: 'role',
        classification: 'change',
        effectiveDate: '2026-09-01',
        correctionReason: null,
      },
      {
        semanticGroup: 'work_time',
        classification: 'correction',
        effectiveDate: null,
        correctionReason: 'Durée corrigée',
      },
    ]);
  });

  it('does not submit metadata drafts for unchanged groups', () => {
    expect(serializeClientHistoryMetadata([], historyDrafts)).toBe('[]');
  });

  it('keeps the whole submit unavailable when one group is incomplete', () => {
    expect(
      areClientHistoryMetadataDraftsReady(
        ['identity', 'role'],
        {
          ...historyDrafts,
          role: { ...historyDrafts.role, effectiveDate: '' },
        },
        effectiveDateBoundaries,
      ),
    ).toBe(false);
  });

  it('prevents submit while pending even when the form is otherwise ready', () => {
    expect(isEmployeeEditSubmitDisabled({ ready: true, pending: true })).toBe(
      true,
    );
    expect(isEmployeeEditSubmitDisabled({ ready: true, pending: false })).toBe(
      false,
    );
  });

  it('clears stale metadata when the authoritative conflict version is loaded', () => {
    expect(createEmployeeEditHistoryMetadataDrafts()).toEqual({
      identity: {
        classification: '',
        effectiveDate: '',
        correctionReason: '',
      },
      role: {
        classification: '',
        effectiveDate: '',
        correctionReason: '',
      },
      contract_terms: {
        classification: '',
        effectiveDate: '',
        correctionReason: '',
      },
      work_time: {
        classification: '',
        effectiveDate: '',
        correctionReason: '',
      },
      entry: {
        classification: 'correction',
        effectiveDate: '',
        correctionReason: '',
      },
    });
  });
});
