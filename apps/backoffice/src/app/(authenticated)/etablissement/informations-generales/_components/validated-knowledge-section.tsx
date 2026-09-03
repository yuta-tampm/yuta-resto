'use client';

import {
  Alert,
  AlertDescription,
  Button,
  Card,
  FormField,
  Label,
  Separator,
  Textarea,
} from '@yuta/ui';
import { Plus, RotateCcw, Save, Trash2 } from 'lucide-react';
import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import {
  createValidatedKnowledgeAction,
  removeValidatedKnowledgeAction,
  updateValidatedKnowledgeAction,
  type ValidatedKnowledgeActionState,
} from '../actions';
import {
  hasNonWhitespace,
  type ValidatedKnowledgeItem,
} from '../validated-knowledge-model';

const validationMessage =
  'Saisissez une connaissance contenant au moins un caractère autre qu’un espace.';

const idleState: ValidatedKnowledgeActionState = {
  status: 'idle',
  message: null,
  fieldError: null,
  item: null,
  removedItemId: null,
};

export function ValidatedKnowledgeSection({
  items,
  canManage,
}: {
  items: ValidatedKnowledgeItem[];
  canManage: boolean;
}) {
  const [createdItems, setCreatedItems] = useState<ValidatedKnowledgeItem[]>(
    [],
  );
  const [removedIds, setRemovedIds] = useState<string[]>([]);
  const [newDraftKey, setNewDraftKey] = useState<string | null>(null);
  const visibleItems = [...items, ...createdItems].filter(
    (item, index, all) =>
      !removedIds.includes(item.id) &&
      all.findIndex((candidate) => candidate.id === item.id) === index,
  );

  return (
    <Card padding="none" radius="lg" className="overflow-hidden">
      <div className="px-5 py-4">
        <p className="text-xs font-bold uppercase tracking-wide text-action-primary">
          Restaurant Knowledge
        </p>
        <h2 className="mt-1 font-bold">Connaissances validées</h2>
        <p className="mt-1 text-sm text-muted">
          Conservez ici des connaissances descriptives de l’établissement,
          validées manuellement par une personne autorisée.
        </p>
      </div>
      <Separator />
      <div className="grid gap-4 p-5">
        {visibleItems.length === 0 && !newDraftKey ? (
          <p className="text-sm text-muted">
            Aucune connaissance validée pour le moment.
          </p>
        ) : null}

        {visibleItems.map((item) =>
          canManage ? (
            <ValidatedKnowledgeItemForm
              key={item.id}
              item={item}
              onRemoved={(id) =>
                setRemovedIds((current) =>
                  current.includes(id) ? current : [...current, id],
                )
              }
            />
          ) : (
            <p
              key={item.id}
              className="whitespace-pre-wrap rounded-lg border border-border-default bg-surface-muted p-4 text-sm text-primary"
            >
              {item.statement}
            </p>
          ),
        )}

        {canManage && newDraftKey ? (
          <ValidatedKnowledgeCreateForm
            key={newDraftKey}
            onCancel={() => setNewDraftKey(null)}
            onCreated={(item) => {
              setCreatedItems((current) =>
                current.some((candidate) => candidate.id === item.id)
                  ? current
                  : [...current, item],
              );
              setNewDraftKey(null);
            }}
          />
        ) : null}

        {canManage && !newDraftKey ? (
          <div className="flex justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setNewDraftKey(`draft:${crypto.randomUUID()}`)}
            >
              <Plus className="h-4 w-4" aria-hidden />
              Ajouter une connaissance
            </Button>
          </div>
        ) : null}
      </div>
    </Card>
  );
}

function ValidatedKnowledgeCreateForm({
  onCancel,
  onCreated,
}: {
  onCancel: () => void;
  onCreated: (item: ValidatedKnowledgeItem) => void;
}) {
  const [state, action] = useActionState(
    createValidatedKnowledgeAction,
    idleState,
  );
  const [statement, setStatement] = useState('');
  const invalid = !hasNonWhitespace(statement);

  useEffect(() => {
    if (state.status === 'success' && state.item) onCreated(state.item);
  }, [onCreated, state.item, state.status]);

  return (
    <form action={action} className="grid gap-3 rounded-lg border p-4">
      <ValidatedKnowledgeFeedback state={state} />
      <ValidatedKnowledgeField
        id="validated-knowledge-new"
        statement={statement}
        onChange={setStatement}
        error={
          statement.length > 0 && invalid ? validationMessage : state.fieldError
        }
      />
      <div className="flex flex-wrap justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Annuler
        </Button>
        <ValidatedKnowledgeSubmitButton disabled={invalid} label="Ajouter" />
      </div>
    </form>
  );
}

function ValidatedKnowledgeItemForm({
  item,
  onRemoved,
}: {
  item: ValidatedKnowledgeItem;
  onRemoved: (id: string) => void;
}) {
  const [updateState, updateAction] = useActionState(
    updateValidatedKnowledgeAction,
    idleState,
  );
  const [removeState, removeAction] = useActionState(
    removeValidatedKnowledgeAction,
    idleState,
  );
  const canonicalItem = updateState.item ?? item;
  const [statement, setStatement] = useState(item.statement);
  const [pendingRemoval, setPendingRemoval] = useState(false);
  const invalid = !hasNonWhitespace(statement);
  const dirty = statement !== canonicalItem.statement;

  useEffect(() => {
    if (updateState.status === 'success' && updateState.item) {
      setStatement(updateState.item.statement);
      setPendingRemoval(false);
    }
  }, [updateState.item, updateState.status]);

  useEffect(() => {
    if (removeState.status === 'success' && removeState.removedItemId) {
      onRemoved(removeState.removedItemId);
    }
  }, [onRemoved, removeState.removedItemId, removeState.status]);

  const activeState = pendingRemoval ? removeState : updateState;

  return (
    <form
      action={pendingRemoval ? removeAction : updateAction}
      className="grid gap-3 rounded-lg border p-4"
    >
      <input type="hidden" name="id" value={item.id} />
      <ValidatedKnowledgeFeedback state={activeState} />
      {pendingRemoval ? (
        <Alert tone="warning">
          <AlertDescription>
            Cette connaissance sera retirée après votre confirmation.
          </AlertDescription>
        </Alert>
      ) : (
        <ValidatedKnowledgeField
          id={`validated-knowledge-${item.id}`}
          statement={statement}
          onChange={setStatement}
          error={dirty && invalid ? validationMessage : updateState.fieldError}
        />
      )}
      <div className="flex flex-wrap justify-end gap-2">
        {pendingRemoval ? (
          <Button
            type="button"
            variant="ghost"
            onClick={() => setPendingRemoval(false)}
          >
            <RotateCcw className="h-4 w-4" aria-hidden />
            Annuler le retrait
          </Button>
        ) : (
          <Button
            type="button"
            variant="ghost"
            onClick={() => setPendingRemoval(true)}
          >
            <Trash2 className="h-4 w-4" aria-hidden />
            Retirer
          </Button>
        )}
        <ValidatedKnowledgeSubmitButton
          disabled={pendingRemoval ? false : !dirty || invalid}
          label={pendingRemoval ? 'Confirmer le retrait' : 'Enregistrer'}
          danger={pendingRemoval}
        />
      </div>
    </form>
  );
}

function ValidatedKnowledgeField({
  id,
  statement,
  onChange,
  error,
}: {
  id: string;
  statement: string;
  onChange: (value: string) => void;
  error: string | null | false;
}) {
  const errorId = `${id}-error`;
  return (
    <FormField
      label={<Label htmlFor={id}>Connaissance</Label>}
      error={error ? <span id={errorId}>{error}</span> : undefined}
    >
      <Textarea
        id={id}
        name="statement"
        value={statement}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
      />
    </FormField>
  );
}

function ValidatedKnowledgeFeedback({
  state,
}: {
  state: ValidatedKnowledgeActionState;
}) {
  if (!state.message || state.fieldError) return null;
  return (
    <Alert
      tone={state.status === 'success' ? 'success' : 'danger'}
      role={state.status === 'success' ? 'status' : 'alert'}
    >
      <AlertDescription>{state.message}</AlertDescription>
    </Alert>
  );
}

function ValidatedKnowledgeSubmitButton({
  disabled,
  label,
  danger = false,
}: {
  disabled: boolean;
  label: string;
  danger?: boolean;
}) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant={danger ? 'danger' : 'success'}
      loading={pending}
      disabled={disabled}
    >
      <Save className="h-4 w-4" aria-hidden />
      {pending ? 'Enregistrement…' : label}
    </Button>
  );
}
