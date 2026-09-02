'use client';

import { Alert, AlertDescription, Button, Card, Separator } from '@yuta/ui';
import { Save } from 'lucide-react';
import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
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
    <Card padding="none" radius="lg" className="overflow-hidden">
      <div className="px-5 py-4">
        <p className="text-xs font-bold uppercase tracking-wide text-action-primary">
          Restaurant Knowledge
        </p>
        <h2 className="mt-1 font-bold">Expérience client</h2>
        <p className="mt-1 text-sm text-muted">
          Décrivez librement l’expérience souhaitée, le style d’accueil et les
          attentions générales portées aux clients.
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
          <Alert tone={state.status === 'success' ? 'success' : 'danger'}>
            <AlertDescription>{state.message}</AlertDescription>
          </Alert>
        )}

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

        {canManage && (
          <div className="flex justify-end">
            <CustomerExperienceSubmitButton disabled={!isDirty} />
          </div>
        )}
      </form>
    </Card>
  );
}

function CustomerExperienceSubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant="success"
      loading={pending}
      disabled={disabled}
    >
      <Save className="h-4 w-4" aria-hidden />
      {pending ? 'Enregistrement…' : 'Enregistrer l’expérience client'}
    </Button>
  );
}
