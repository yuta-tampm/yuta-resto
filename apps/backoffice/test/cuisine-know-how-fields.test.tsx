import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { CuisineKnowHowFields } from '../src/app/(authenticated)/etablissement/informations-generales/_components/cuisine-know-how-fields';

function renderFields(
  cuisineDescription: string | null,
  knowHowParticularities: string | null,
  homemade: string | null,
  canManage = true,
): string {
  return renderToStaticMarkup(
    <CuisineKnowHowFields
      draft={{ cuisineDescription, knowHowParticularities, homemade }}
      canManage={canManage}
      onCuisineDescriptionChange={vi.fn()}
      onKnowHowParticularitiesChange={vi.fn()}
      onHomemadeChange={vi.fn()}
    />,
  );
}

describe('CuisineKnowHowFields', () => {
  it.each([
    [null, null, null],
    ['Cuisine seulement', null, null],
    [null, 'Savoir-faire seulement', null],
    [null, null, 'Fait maison seulement'],
  ] as const)(
    'renders the valid empty and single-value states',
    (cuisineDescription, knowHowParticularities, homemade) => {
      const markup = renderFields(
        cuisineDescription,
        knowHowParticularities,
        homemade,
      );
      expect(markup).toContain('name="cuisineDescription"');
      expect(markup).toContain('name="knowHowParticularities"');
      expect(markup).toContain('name="homemade"');
      if (cuisineDescription) expect(markup).toContain(cuisineDescription);
      if (knowHowParticularities)
        expect(markup).toContain(knowHowParticularities);
      if (homemade) expect(markup).toContain(homemade);
    },
  );

  it('makes all three fields read-only without MANAGE', () => {
    expect(
      renderFields('Cuisine', 'Savoir-faire', 'Maison', false).match(
        /disabled=""/g,
      ),
    ).toHaveLength(3);
  });
});
