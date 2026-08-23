import { describe, expect, it } from 'vitest';
import {
  hasEmployeeCreateUnsavedInput,
  type EmployeeCreateDraftSnapshot,
} from './employee-create-flow';

const emptyDraft: EmployeeCreateDraftSnapshot = {
  givenNames: '',
  familyName: '',
  position: '',
  qualification: '',
  employmentTermType: 'indefinite',
  workTimeCategory: 'full_time',
  entryDate: '',
  expectedEndDate: '',
  fixedTermReasonCode: '',
  contractWeeklyHours: '',
  contractWeeklyMinuteRemainder: '0',
  duplicateReason: '',
};

describe('employee create flow', () => {
  it('does not treat untouched defaults or whitespace as unsaved input', () => {
    expect(hasEmployeeCreateUnsavedInput(emptyDraft)).toBe(false);
    expect(
      hasEmployeeCreateUnsavedInput({
        ...emptyDraft,
        givenNames: '   ',
        duplicateReason: '  ',
      }),
    ).toBe(false);
  });

  it.each([
    { givenNames: 'Camille' },
    { familyName: 'Martin' },
    { position: 'Serveuse' },
    { qualification: 'Employée' },
    { employmentTermType: 'fixed_term' },
    { workTimeCategory: 'part_time' },
    { entryDate: '2026-08-23' },
    { expectedEndDate: '2026-12-31' },
    { fixedTermReasonCode: 'seasonal_employment' },
    { contractWeeklyHours: '35' },
    { contractWeeklyMinuteRemainder: '30' },
    { duplicateReason: 'Homonyme confirmé' },
  ])('detects an unsaved create change: %o', (change) => {
    expect(hasEmployeeCreateUnsavedInput({ ...emptyDraft, ...change })).toBe(
      true,
    );
  });
});
