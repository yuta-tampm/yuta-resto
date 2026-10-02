import { describe, expect, it } from 'vitest';
import {
  cuisineKnowHowDraft,
  updateCuisineDescription,
  updateHomemade,
  updateKnowHowParticularities,
} from '../src/app/(authenticated)/etablissement/informations-generales/cuisine-know-how-model';

describe('Cuisine and savoir-faire draft model', () => {
  it.each([
    [null, null, null],
    ['Cuisine seulement', null, null],
    [null, 'Savoir-faire seulement', null],
    [null, null, 'Fait maison seulement'],
  ] as const)(
    'accepts empty and every independent single-value state',
    (cuisineDescription, knowHowParticularities, homemade) => {
      expect(
        cuisineKnowHowDraft(
          cuisineDescription,
          knowHowParticularities,
          homemade,
        ),
      ).toEqual({ cuisineDescription, knowHowParticularities, homemade });
    },
  );

  const initial = {
    cuisineDescription: 'Cuisine conservée',
    knowHowParticularities: 'Savoir-faire conservé',
    homemade: 'Fait maison conservé',
  };

  it('updates each value without changing the other two', () => {
    expect(updateCuisineDescription(initial, 'Nouvelle cuisine')).toEqual({
      ...initial,
      cuisineDescription: 'Nouvelle cuisine',
    });
    expect(
      updateKnowHowParticularities(initial, 'Nouveau savoir-faire'),
    ).toEqual({
      ...initial,
      knowHowParticularities: 'Nouveau savoir-faire',
    });
    expect(updateHomemade(initial, 'Nouveau fait maison')).toEqual({
      ...initial,
      homemade: 'Nouveau fait maison',
    });
  });
});
