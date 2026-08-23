'use client';

import {
  Alert,
  AlertDescription,
  Button,
  ConfirmDialog,
  DialogFooter,
} from '@yuta/ui';
import { RefreshCw, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useRef, useState } from 'react';
import type { ComboActionState } from '../combo-action-state';

export const initialComboActionState: ComboActionState = {
  error: null,
  success: null,
};

export function ComboEditorFooter({
  pending,
  onCancel,
}: {
  pending: boolean;
  onCancel(): void;
}) {
  return (
    <DialogFooter className="shrink-0 border-t border-border-default bg-surface px-4 py-3 sm:px-6">
      <Button
        type="button"
        variant="secondary"
        className="min-h-11 sm:min-h-10"
        disabled={pending}
        onClick={onCancel}
      >
        Annuler
      </Button>
      <Button type="submit" className="min-h-11 sm:min-h-10" loading={pending}>
        Enregistrer
      </Button>
    </DialogFooter>
  );
}

export function ComboActionFeedback({
  state,
  showSuccess = false,
}: {
  state: ComboActionState;
  showSuccess?: boolean;
}) {
  if (!state.error && (!showSuccess || !state.success)) return null;

  if (showSuccess && state.success) {
    return (
      <Alert tone="success" role="status">
        <AlertDescription>{state.success}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert tone="danger" role="alert">
      <AlertDescription>{state.error}</AlertDescription>
      {state.recovery === 'refresh' && <ComboRefreshRecoveryButton />}
    </Alert>
  );
}

export function ComboFeedbackDescription({
  text,
  error,
  recovery,
}: {
  text: string;
  error: string | null;
  recovery?: 'refresh';
}) {
  return (
    <span className="grid gap-2">
      <span>{text}</span>
      {error && (
        <span className="grid gap-2" role="alert">
          <span className="font-medium text-status-danger">{error}</span>
          {recovery === 'refresh' && <ComboRefreshRecoveryButton />}
        </span>
      )}
    </span>
  );
}

export function ComboDeleteAction({
  title,
  description,
  label,
  disabled,
  action,
}: {
  title: string;
  description: string;
  label: string;
  disabled: boolean;
  action: (
    state: ComboActionState,
    formData: FormData,
  ) => Promise<ComboActionState>;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const submissionRequestedRef = useRef(false);
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    action,
    initialComboActionState,
  );
  useCloseComboDialogOnSuccess(state, setOpen);
  useEffect(() => {
    if (!pending) submissionRequestedRef.current = false;
  }, [pending, state]);

  return (
    <>
      <form ref={formRef} action={formAction} />
      <Button
        type="button"
        variant="danger"
        size="sm"
        className="min-h-11 min-w-11"
        disabled={disabled}
        loading={pending}
        aria-label={label}
        onClick={() => setOpen(true)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={(nextOpen) => {
          if (!pending || nextOpen) setOpen(nextOpen);
        }}
        title={title}
        description={
          <ComboFeedbackDescription
            text={description}
            error={state.error}
            recovery={state.recovery}
          />
        }
        confirmLabel={pending ? 'Suppression…' : 'Supprimer'}
        cancelLabel="Annuler"
        onConfirm={() => {
          if (pending || submissionRequestedRef.current) return;
          submissionRequestedRef.current = true;
          formRef.current?.requestSubmit();
        }}
      />
    </>
  );
}

function ComboRefreshRecoveryButton() {
  const router = useRouter();

  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      className="w-fit min-h-11"
      onClick={() => router.refresh()}
    >
      <RefreshCw className="h-4 w-4" />
      Actualiser
    </Button>
  );
}

export function useCloseComboDialogOnSuccess(
  state: ComboActionState,
  setOpen: (open: boolean) => void,
) {
  useEffect(() => {
    if (state.success) setOpen(false);
  }, [state.success, setOpen]);
}
