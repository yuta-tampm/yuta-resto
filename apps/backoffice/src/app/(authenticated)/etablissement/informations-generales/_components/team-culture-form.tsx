'use client';

import { useActionState, useState } from 'react';
import {
  KnowledgeSectionForm,
  KnowledgeSubmitButton,
} from './knowledge-section-form';
import { saveTeamCultureAction, type TeamCultureActionState } from '../actions';
import {
  isTeamCultureDirty,
  updateTransmissionAndIntegration,
  updateValuesAndMindset,
  updateWorkingTogether,
  type TeamCultureDraft,
} from '../team-culture-model';
import { TeamCultureFields } from './team-culture-fields';

const initialState: TeamCultureActionState = {
  status: 'idle',
  message: null,
};

export function TeamCultureForm({
  teamCulture,
  canManage,
}: {
  teamCulture: TeamCultureDraft;
  canManage: boolean;
}) {
  const [state, formAction] = useActionState(
    saveTeamCultureAction,
    initialState,
  );
  const [draft, setDraft] = useState(teamCulture);
  const isDirty = isTeamCultureDirty(teamCulture, draft);

  return (
    <KnowledgeSectionForm
      title="Équipe & culture"
      description="Décrivez les valeurs, la collaboration et la transmission propres à votre établissement."
      canManage={canManage}
      state={state}
      formAction={formAction}
      announceResult
      submitButton={<TeamCultureSubmitButton disabled={!isDirty} />}
    >
      <TeamCultureFields
        draft={draft}
        canManage={canManage}
        onValuesAndMindsetChange={(valuesAndMindset) =>
          setDraft((current) =>
            updateValuesAndMindset(current, valuesAndMindset),
          )
        }
        onWorkingTogetherChange={(workingTogether) =>
          setDraft((current) => updateWorkingTogether(current, workingTogether))
        }
        onTransmissionAndIntegrationChange={(transmissionAndIntegration) =>
          setDraft((current) =>
            updateTransmissionAndIntegration(
              current,
              transmissionAndIntegration,
            ),
          )
        }
      />
    </KnowledgeSectionForm>
  );
}

export function TeamCultureSubmitButton({ disabled }: { disabled: boolean }) {
  return (
    <KnowledgeSubmitButton
      disabled={disabled}
      label="Enregistrer équipe & culture"
    />
  );
}
