'use client';

import { useActionState, useState } from 'react';
import {
  KnowledgeSectionForm,
  KnowledgeSubmitButton,
} from './knowledge-section-form';
import {
  saveCuisineKnowHowAction,
  type CuisineKnowHowActionState,
} from '../actions';
import {
  updateCuisineDescription,
  updateHomemade,
  updateKnowHowParticularities,
  type CuisineKnowHowDraft,
} from '../cuisine-know-how-model';
import { CuisineKnowHowFields } from './cuisine-know-how-fields';

const initialState: CuisineKnowHowActionState = {
  status: 'idle',
  message: null,
};

export function CuisineKnowHowForm({
  cuisineKnowHow,
  canManage,
}: {
  cuisineKnowHow: CuisineKnowHowDraft;
  canManage: boolean;
}) {
  const [state, formAction] = useActionState(
    saveCuisineKnowHowAction,
    initialState,
  );
  const [draft, setDraft] = useState(cuisineKnowHow);
  const isDirty =
    draft.cuisineDescription !== cuisineKnowHow.cuisineDescription ||
    draft.knowHowParticularities !== cuisineKnowHow.knowHowParticularities ||
    draft.homemade !== cuisineKnowHow.homemade;

  return (
    <KnowledgeSectionForm
      title="Cuisine & savoir-faire"
      description="Décrivez librement la cuisine, les particularités du savoir-faire et ce qui est fait maison."
      canManage={canManage}
      state={state}
      formAction={formAction}
      submitButton={
        <KnowledgeSubmitButton
          disabled={!isDirty}
          label="Enregistrer la cuisine et le savoir-faire"
        />
      }
    >
      <CuisineKnowHowFields
        draft={draft}
        canManage={canManage}
        onCuisineDescriptionChange={(cuisineDescription) =>
          setDraft((current) =>
            updateCuisineDescription(current, cuisineDescription),
          )
        }
        onKnowHowParticularitiesChange={(knowHowParticularities) =>
          setDraft((current) =>
            updateKnowHowParticularities(current, knowHowParticularities),
          )
        }
        onHomemadeChange={(homemade) =>
          setDraft((current) => updateHomemade(current, homemade))
        }
      />
    </KnowledgeSectionForm>
  );
}
