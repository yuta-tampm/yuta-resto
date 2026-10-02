'use client';

import { useActionState, useState } from 'react';
import {
  KnowledgeSectionForm,
  KnowledgeSubmitButton,
} from './knowledge-section-form';
import {
  saveConceptHistoryAction,
  type ConceptHistoryActionState,
} from '../actions';
import {
  updateConcept,
  updateHistory,
  type ConceptHistoryDraft,
} from '../concept-history-model';
import { ConceptHistoryFields } from './concept-history-fields';

const initialState: ConceptHistoryActionState = {
  status: 'idle',
  message: null,
};

export function ConceptHistoryForm({
  conceptHistory,
  canManage,
}: {
  conceptHistory: ConceptHistoryDraft;
  canManage: boolean;
}) {
  const [state, formAction] = useActionState(
    saveConceptHistoryAction,
    initialState,
  );
  const [draft, setDraft] = useState(conceptHistory);
  const isDirty =
    draft.concept !== conceptHistory.concept ||
    draft.history !== conceptHistory.history;

  return (
    <KnowledgeSectionForm
      title="Concept & histoire"
      description="Décrivez librement le concept du restaurant et son histoire."
      canManage={canManage}
      state={state}
      formAction={formAction}
      submitButton={
        <KnowledgeSubmitButton
          disabled={!isDirty}
          label="Enregistrer le concept et l’histoire"
        />
      }
    >
      <ConceptHistoryFields
        draft={draft}
        canManage={canManage}
        onConceptChange={(concept) =>
          setDraft((current) => updateConcept(current, concept))
        }
        onHistoryChange={(history) =>
          setDraft((current) => updateHistory(current, history))
        }
      />
    </KnowledgeSectionForm>
  );
}
