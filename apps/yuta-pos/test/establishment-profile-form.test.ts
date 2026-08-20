import { describe, expect, it } from 'vitest';
import { getEstablishmentProfileFormState } from '../src/app/management/establishment/_lib/establishment-profile-form';

describe('establishment profile form state', () => {
  it('requires a valid changed value before saving', () => {
    expect(
      getEstablishmentProfileFormState({
        baseline: 'Le Jardin',
        draft: 'Le Jardin',
        revision: 1,
      }),
    ).toEqual({ isDirty: false, isValid: true });
    expect(
      getEstablishmentProfileFormState({
        baseline: 'Le Jardin',
        draft: 'Nouveau Jardin',
        revision: 1,
      }),
    ).toEqual({ isDirty: true, isValid: true });
    expect(
      getEstablishmentProfileFormState({
        baseline: 'Le Jardin',
        draft: '   ',
        revision: 1,
      }),
    ).toEqual({ isDirty: true, isValid: false });
  });
});
