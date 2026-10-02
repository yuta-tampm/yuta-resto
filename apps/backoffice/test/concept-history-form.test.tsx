import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  saveConceptHistoryAction: vi.fn(),
}));

vi.mock(
  '../src/app/(authenticated)/etablissement/informations-generales/actions',
  () => ({
    saveConceptHistoryAction: mocks.saveConceptHistoryAction,
  }),
);

import { ConceptHistoryForm } from '../src/app/(authenticated)/etablissement/informations-generales/_components/concept-history-form';

describe('ConceptHistoryForm', () => {
  it('renders one explicit save for the whole editable slice without saving on render', () => {
    const markup = renderToStaticMarkup(
      <ConceptHistoryForm
        conceptHistory={{ concept: 'Concept', history: 'Histoire' }}
        canManage
      />,
    );

    expect(markup.match(/<form/g)).toHaveLength(1);
    expect(markup.match(/type="submit"/g)).toHaveLength(1);
    expect(markup).toContain('Enregistrer le concept et l’histoire');
    expect(markup).toContain('name="concept"');
    expect(markup).toContain('name="history"');
    expect(mocks.saveConceptHistoryAction).not.toHaveBeenCalled();
  });

  it('renders a read-only slice without any save control', () => {
    const markup = renderToStaticMarkup(
      <ConceptHistoryForm
        conceptHistory={{ concept: null, history: null }}
        canManage={false}
      />,
    );

    expect(markup).toContain('Concept &amp; histoire');
    expect(markup.match(/disabled=""/g)).toHaveLength(2);
    expect(markup).not.toContain('type="submit"');
    expect(mocks.saveConceptHistoryAction).not.toHaveBeenCalled();
  });
});
