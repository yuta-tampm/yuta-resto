import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  saveCuisineKnowHowAction: vi.fn(),
}));

vi.mock(
  '../src/app/(authenticated)/etablissement/informations-generales/actions',
  () => ({
    saveCuisineKnowHowAction: mocks.saveCuisineKnowHowAction,
  }),
);

import { CuisineKnowHowForm } from '../src/app/(authenticated)/etablissement/informations-generales/_components/cuisine-know-how-form';

const values = {
  cuisineDescription: 'Cuisine',
  knowHowParticularities: 'Savoir-faire',
  homemade: 'Fait maison',
};

describe('CuisineKnowHowForm', () => {
  it('renders one explicit whole-slice save and does not autosave on render', () => {
    const markup = renderToStaticMarkup(
      <CuisineKnowHowForm cuisineKnowHow={values} canManage />,
    );

    expect(markup.match(/<form/g)).toHaveLength(1);
    expect(markup.match(/type="submit"/g)).toHaveLength(1);
    expect(markup).toContain('Enregistrer la cuisine et le savoir-faire');
    expect(markup).toContain('name="cuisineDescription"');
    expect(markup).toContain('name="knowHowParticularities"');
    expect(markup).toContain('name="homemade"');
    expect(markup).toContain('disabled=""');
    expect(mocks.saveCuisineKnowHowAction).not.toHaveBeenCalled();
  });

  it('renders READ-only values without a save control', () => {
    const markup = renderToStaticMarkup(
      <CuisineKnowHowForm cuisineKnowHow={values} canManage={false} />,
    );

    expect(markup).toContain('Cuisine &amp; savoir-faire');
    expect(markup.match(/disabled=""/g)).toHaveLength(3);
    expect(markup).not.toContain('type="submit"');
    expect(mocks.saveCuisineKnowHowAction).not.toHaveBeenCalled();
  });
});
