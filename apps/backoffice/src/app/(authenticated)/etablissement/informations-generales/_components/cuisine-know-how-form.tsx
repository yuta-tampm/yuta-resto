'use client';

import { Alert, AlertDescription, Button, Card, Separator } from '@yuta/ui';
import { Save } from 'lucide-react';
import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
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
    <Card padding="none" radius="lg" className="overflow-hidden">
      <div className="px-5 py-4">
        <p className="text-xs font-bold uppercase tracking-wide text-action-primary">
          Restaurant Knowledge
        </p>
        <h2 className="mt-1 font-bold">Cuisine &amp; savoir-faire</h2>
        <p className="mt-1 text-sm text-muted">
          Décrivez librement la cuisine, les particularités du savoir-faire et
          ce qui est fait maison.
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

        {canManage && (
          <div className="flex justify-end">
            <CuisineKnowHowSubmitButton disabled={!isDirty} />
          </div>
        )}
      </form>
    </Card>
  );
}

function CuisineKnowHowSubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant="success"
      loading={pending}
      disabled={disabled}
    >
      <Save className="h-4 w-4" aria-hidden />
      {pending
        ? 'Enregistrement…'
        : 'Enregistrer la cuisine et le savoir-faire'}
    </Button>
  );
}
