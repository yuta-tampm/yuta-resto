'use client';

import { useActionState, useState } from 'react';
import {
  KnowledgeSectionForm,
  KnowledgeSubmitButton,
} from './knowledge-section-form';
import {
  saveCustomerExperienceAction,
  type CustomerExperienceActionState,
} from '../actions';
import {
  isCustomerExperienceDirty,
  updateCustomerAttention,
  updateDesiredExperience,
  updateWelcomeAndService,
  type CustomerExperienceDraft,
} from '../customer-experience-model';
import { CustomerExperienceFields } from './customer-experience-fields';

const initialState: CustomerExperienceActionState = {
  status: 'idle',
  message: null,
};

export function CustomerExperienceForm({
  customerExperience,
  canManage,
}: {
  customerExperience: CustomerExperienceDraft;
  canManage: boolean;
}) {
  const [state, formAction] = useActionState(
    saveCustomerExperienceAction,
    initialState,
  );
  const [draft, setDraft] = useState(customerExperience);
  const isDirty = isCustomerExperienceDirty(customerExperience, draft);

  return (
    <KnowledgeSectionForm
      title="Expérience client"
      description="Décrivez librement l’expérience souhaitée, le style d’accueil et les attentions générales portées aux clients."
      canManage={canManage}
      state={state}
      formAction={formAction}
      submitButton={
        <KnowledgeSubmitButton
          disabled={!isDirty}
          label="Enregistrer l’expérience client"
        />
      }
    >
      <CustomerExperienceFields
        draft={draft}
        canManage={canManage}
        onDesiredExperienceChange={(desiredExperience) =>
          setDraft((current) =>
            updateDesiredExperience(current, desiredExperience),
          )
        }
        onWelcomeAndServiceChange={(welcomeAndService) =>
          setDraft((current) =>
            updateWelcomeAndService(current, welcomeAndService),
          )
        }
        onCustomerAttentionChange={(customerAttention) =>
          setDraft((current) =>
            updateCustomerAttention(current, customerAttention),
          )
        }
      />
    </KnowledgeSectionForm>
  );
}
