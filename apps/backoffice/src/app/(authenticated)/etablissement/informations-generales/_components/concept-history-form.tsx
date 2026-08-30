'use client';

import { Alert, AlertDescription, Button, Card, Separator } from '@yuta/ui';
import { Save } from 'lucide-react';
import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
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
    <Card padding="none" radius="lg" className="overflow-hidden">
      <div className="px-5 py-4">
        <p className="text-xs font-bold uppercase tracking-wide text-action-primary">
          Restaurant Knowledge
        </p>
        <h2 className="mt-1 font-bold">Concept &amp; histoire</h2>
        <p className="mt-1 text-sm text-muted">
          Décrivez librement le concept du restaurant et son histoire.
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

        {canManage && (
          <div className="flex justify-end">
            <ConceptHistorySubmitButton disabled={!isDirty} />
          </div>
        )}
      </form>
    </Card>
  );
}

function ConceptHistorySubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant="success"
      loading={pending}
      disabled={disabled}
    >
      <Save className="h-4 w-4" aria-hidden />
      {pending ? 'Enregistrement…' : 'Enregistrer le concept et l’histoire'}
    </Button>
  );
}
