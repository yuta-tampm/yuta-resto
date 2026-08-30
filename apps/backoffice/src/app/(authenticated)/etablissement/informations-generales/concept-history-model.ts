export type ConceptHistoryDraft = {
  concept: string | null;
  history: string | null;
};

export function conceptHistoryDraft(
  concept: string | null,
  history: string | null,
): ConceptHistoryDraft {
  return { concept, history };
}

export function updateConcept(
  draft: ConceptHistoryDraft,
  concept: string,
): ConceptHistoryDraft {
  return { ...draft, concept };
}

export function updateHistory(
  draft: ConceptHistoryDraft,
  history: string,
): ConceptHistoryDraft {
  return { ...draft, history };
}
