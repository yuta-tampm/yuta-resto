'use client';

import { useActionState, useState } from 'react';
import {
  KnowledgeSectionForm,
  KnowledgeSubmitButton,
} from './knowledge-section-form';
import {
  saveCommunicationIdentityAction,
  type CommunicationIdentityActionState,
} from '../actions';
import {
  isCommunicationIdentityDirty,
  updateCustomerAddressing,
  updateLanguageElementsAndThingsToAvoid,
  updateToneAndCommunicationStyle,
  type CommunicationIdentityDraft,
} from '../communication-identity-model';
import { CommunicationIdentityFields } from './communication-identity-fields';

const initialState: CommunicationIdentityActionState = {
  status: 'idle',
  message: null,
  savedCommunicationIdentity: null,
};

export function CommunicationIdentityForm({
  communicationIdentity,
  canManage,
}: {
  communicationIdentity: CommunicationIdentityDraft;
  canManage: boolean;
}) {
  const [state, formAction] = useActionState(
    saveCommunicationIdentityAction,
    initialState,
  );
  const [draft, setDraft] = useState(communicationIdentity);
  const acceptedBaseline =
    state.savedCommunicationIdentity ?? communicationIdentity;
  const isDirty = isCommunicationIdentityDirty(acceptedBaseline, draft);

  return (
    <KnowledgeSectionForm
      title="Identité de communication"
      description="Décrivez le ton, la manière de vous adresser aux clients et les éléments de langage propres à votre établissement."
      canManage={canManage}
      state={state}
      formAction={formAction}
      announceResult
      submitButton={<CommunicationIdentitySubmitButton disabled={!isDirty} />}
    >
      <CommunicationIdentityFields
        draft={draft}
        canManage={canManage}
        onToneAndCommunicationStyleChange={(toneAndCommunicationStyle) =>
          setDraft((current) =>
            updateToneAndCommunicationStyle(current, toneAndCommunicationStyle),
          )
        }
        onCustomerAddressingChange={(customerAddressing) =>
          setDraft((current) =>
            updateCustomerAddressing(current, customerAddressing),
          )
        }
        onLanguageElementsAndThingsToAvoidChange={(
          languageElementsAndThingsToAvoid,
        ) =>
          setDraft((current) =>
            updateLanguageElementsAndThingsToAvoid(
              current,
              languageElementsAndThingsToAvoid,
            ),
          )
        }
      />
    </KnowledgeSectionForm>
  );
}

export function CommunicationIdentitySubmitButton({
  disabled,
}: {
  disabled: boolean;
}) {
  return (
    <KnowledgeSubmitButton
      disabled={disabled}
      label="Enregistrer identité de communication"
    />
  );
}
