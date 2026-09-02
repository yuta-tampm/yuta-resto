'use client';

import { Alert, AlertDescription, Button, Card, Separator } from '@yuta/ui';
import { Save } from 'lucide-react';
import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
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
    <Card padding="none" radius="lg" className="overflow-hidden">
      <div className="px-5 py-4">
        <p className="text-xs font-bold uppercase tracking-wide text-action-primary">
          Restaurant Knowledge
        </p>
        <h2 className="mt-1 font-bold">Identité de communication</h2>
        <p className="mt-1 text-sm text-muted">
          Décrivez le ton, la manière de vous adresser aux clients et les
          éléments de langage propres à votre établissement.
        </p>
      </div>
      <Separator />
      <form action={formAction} className="grid gap-4 p-5">
        {!canManage && (
          <Alert tone="info">
            <AlertDescription>
              Votre rôle permet de consulter ces informations, mais pas de les
              modifier.
            </AlertDescription>
          </Alert>
        )}
        {state.message && (
          <Alert
            tone={state.status === 'success' ? 'success' : 'danger'}
            role={state.status === 'success' ? 'status' : 'alert'}
          >
            <AlertDescription>{state.message}</AlertDescription>
          </Alert>
        )}

        <CommunicationIdentityFields
          draft={draft}
          canManage={canManage}
          onToneAndCommunicationStyleChange={(toneAndCommunicationStyle) =>
            setDraft((current) =>
              updateToneAndCommunicationStyle(
                current,
                toneAndCommunicationStyle,
              ),
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

        {canManage && (
          <div className="flex justify-end">
            <CommunicationIdentitySubmitButton disabled={!isDirty} />
          </div>
        )}
      </form>
    </Card>
  );
}

export function CommunicationIdentitySubmitButton({
  disabled,
}: {
  disabled: boolean;
}) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant="success"
      loading={pending}
      disabled={disabled}
    >
      <Save className="h-4 w-4" aria-hidden />
      {pending ? 'Enregistrement…' : 'Enregistrer identité de communication'}
    </Button>
  );
}
