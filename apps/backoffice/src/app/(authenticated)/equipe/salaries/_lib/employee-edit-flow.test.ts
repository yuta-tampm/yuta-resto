import { describe, expect, it } from 'vitest';
import {
  hasEmployeeEditUnsavedChanges,
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
});
