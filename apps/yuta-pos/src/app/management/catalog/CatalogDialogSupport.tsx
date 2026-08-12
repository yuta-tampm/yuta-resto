'use client';

import {
  Alert,
  AlertDescription,
  Button,
  ConfirmDialog,
  DialogFooter,
} from '@yuta/ui';
import { Eye, EyeOff } from 'lucide-react';
import { useActionState, useEffect, useRef, useState } from 'react';
import type { CatalogActionState } from './actions';

export const initialCatalogActionState: CatalogActionState = {
  error: null,
  success: null,
};

export function CatalogEditorFooter({
  pending,
  onCancel,
  sticky = false,
}: {
  pending: boolean;
  onCancel(): void;
  sticky?: boolean;
}) {
  return (
    <DialogFooter
      className={
        sticky
          ? 'shrink-0 border-t border-border-default bg-surface px-4 py-3 sm:px-6'
          : undefined
      }
    >
      <Button type="button" variant="secondary" onClick={onCancel}>
        Annuler
      </Button>
      <Button type="submit" loading={pending}>
        Enregistrer
      </Button>
    </DialogFooter>
  );
}

export function CatalogActionFeedback({
  state,
}: {
  state: CatalogActionState;
}) {
  if (!state.error) return null;

  return (
    <Alert tone="danger">
      <AlertDescription>{state.error}</AlertDescription>
    </Alert>
  );
}

export function useCloseCatalogDialogOnSuccess(
  state: CatalogActionState,
  setOpen: (open: boolean) => void,
) {
  useEffect(() => {
    if (state.success) setOpen(false);
  }, [state.success, setOpen]);
}

export function CatalogToggleDialog({
  title,
  description,
  triggerLabel,
  confirmLabel,
  active,
  action,
}: {
  title: string;
  description: string;
  triggerLabel: string;
  confirmLabel: string;
  active: boolean;
  action: (
    state: CatalogActionState,
    formData: FormData,
  ) => Promise<CatalogActionState>;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    action,
    initialCatalogActionState,
  );
  useCloseCatalogDialogOnSuccess(state, setOpen);

  return (
    <>
      <form ref={formRef} action={formAction} />
      <Button
        type="button"
        variant={active ? 'danger' : 'secondary'}
        size="sm"
        loading={pending}
        aria-label={triggerLabel}
        onClick={() => setOpen(true)}
      >
        {active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title={title}
        description={
          <span className="grid gap-2">
            <span>{description}</span>
            {state.error && (
              <span className="font-medium text-status-danger" role="alert">
                {state.error}
              </span>
            )}
          </span>
        }
        confirmLabel={confirmLabel}
        cancelLabel="Annuler"
        tone={active ? 'danger' : 'primary'}
        onConfirm={() => formRef.current?.requestSubmit()}
      />
    </>
  );
}
