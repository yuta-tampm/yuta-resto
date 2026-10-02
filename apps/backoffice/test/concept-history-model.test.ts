import { describe, expect, it } from 'vitest';
import {
  conceptHistoryDraft,
  updateConcept,
  updateHistory,
} from '../src/app/(authenticated)/etablissement/informations-generales/concept-history-model';

describe('Concept and Histoire draft model', () => {
  it.each([
    { concept: null, history: null },
    { concept: 'Cuisine ouverte.', history: null },
    { concept: null, history: 'Maison fondée en 1998.' },
  ])('accepts independent optional values', ({ concept, history }) => {
    expect(conceptHistoryDraft(concept, history)).toEqual({ concept, history });
  });

  it('updates Concept without changing Histoire', () => {
    expect(
      updateConcept(
        { concept: 'Ancien concept', history: 'Histoire conservée' },
        'Nouveau concept',
      ),
    ).toEqual({ concept: 'Nouveau concept', history: 'Histoire conservée' });
  });

  it('updates Histoire without changing Concept', () => {
    expect(
      updateHistory(
        { concept: 'Concept conservé', history: 'Ancienne histoire' },
        'Nouvelle histoire',
      ),
    ).toEqual({ concept: 'Concept conservé', history: 'Nouvelle histoire' });
  });
});
