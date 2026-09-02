'use client';

import { Alert, AlertDescription, Button, Card, Separator } from '@yuta/ui';
import { Save } from 'lucide-react';
import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
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
    <Card padding="none" radius="lg" className="overflow-hidden">
      <div className="px-5 py-4">
        <p className="text-xs font-bold uppercase tracking-wide text-action-primary">
          Restaurant Knowledge
        </p>
        <h2 className="mt-1 font-bold">Équipe &amp; culture</h2>
        <p className="mt-1 text-sm text-muted">
          Décrivez les valeurs, la collaboration et la transmission propres à
          votre établissement.
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

        <TeamCultureFields
          draft={draft}
          canManage={canManage}
          onValuesAndMindsetChange={(valuesAndMindset) =>
            setDraft((current) =>
              updateValuesAndMindset(current, valuesAndMindset),
            )
          }
          onWorkingTogetherChange={(workingTogether) =>
            setDraft((current) =>
              updateWorkingTogether(current, workingTogether),
            )
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

        {canManage && (
          <div className="flex justify-end">
            <TeamCultureSubmitButton disabled={!isDirty} />
          </div>
        )}
      </form>
    </Card>
  );
}

export function TeamCultureSubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant="success"
      loading={pending}
      disabled={disabled}
    >
      <Save className="h-4 w-4" aria-hidden />
      {pending ? 'Enregistrement…' : 'Enregistrer équipe & culture'}
    </Button>
  );
}
