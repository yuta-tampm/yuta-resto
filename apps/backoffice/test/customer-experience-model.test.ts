import { describe, expect, it } from 'vitest';
import {
  customerExperienceDraft,
  isCustomerExperienceDirty,
  updateCustomerAttention,
  updateDesiredExperience,
  updateWelcomeAndService,
} from '../src/app/(authenticated)/etablissement/informations-generales/customer-experience-model';

describe('Customer Experience draft model', () => {
  it.each([
    [null, null, null],
    ['Expérience seulement', null, null],
    [null, 'Accueil seulement', null],
    [null, null, 'Attention seulement'],
  ] as const)(
    'accepts empty and every independent single-value state',
    (desiredExperience, welcomeAndService, customerAttention) => {
      expect(
        customerExperienceDraft(
          desiredExperience,
          welcomeAndService,
          customerAttention,
        ),
      ).toEqual({ desiredExperience, welcomeAndService, customerAttention });
    },
  );

  const initial = {
    desiredExperience: 'Expérience conservée',
    welcomeAndService: 'Accueil conservé',
    customerAttention: 'Attention conservée',
  };

  it('updates each value without changing the other two', () => {
    expect(updateDesiredExperience(initial, 'Nouvelle expérience')).toEqual({
      ...initial,
      desiredExperience: 'Nouvelle expérience',
    });
    expect(updateWelcomeAndService(initial, 'Nouvel accueil')).toEqual({
      ...initial,
      welcomeAndService: 'Nouvel accueil',
    });
    expect(updateCustomerAttention(initial, 'Nouvelle attention')).toEqual({
      ...initial,
      customerAttention: 'Nouvelle attention',
    });
  });

  it('reports dirty state only when one of the three values changes', () => {
    expect(isCustomerExperienceDirty(initial, initial)).toBe(false);
    expect(
      isCustomerExperienceDirty(initial, {
        ...initial,
        welcomeAndService: 'Accueil modifié',
      }),
    ).toBe(true);
  });
});
