import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { ConceptHistoryFields } from '../src/app/(authenticated)/etablissement/informations-generales/_components/concept-history-fields';

function renderFields(
  concept: string | null,
  history: string | null,
  canManage = true,
): string {
  return renderToStaticMarkup(
    <ConceptHistoryFields
      draft={{ concept, history }}
      canManage={canManage}
      onConceptChange={vi.fn()}
      onHistoryChange={vi.fn()}
    />,
  );
}

describe('ConceptHistoryFields', () => {
  it.each([
    { concept: null, history: null },
    { concept: 'Concept seulement', history: null },
    { concept: null, history: 'Histoire seulement' },
  ])('renders independent optional values', ({ concept, history }) => {
    const markup = renderFields(concept, history);

    expect(markup).toContain('name="concept"');
    expect(markup).toContain('name="history"');
    if (concept) expect(markup).toContain(concept);
    if (history) expect(markup).toContain(history);
  });

  it('makes both fields read-only without MANAGE', () => {
    const markup = renderFields('Concept', 'Histoire', false);

    expect(markup.match(/disabled=""/g)).toHaveLength(2);
  });
});
