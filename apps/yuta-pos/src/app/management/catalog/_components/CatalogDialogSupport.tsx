'use client';

import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  ConfirmDialog,
  DialogFooter,
} from '@yuta/ui';
import { CheckCircle2, Eye, EyeOff, RefreshCw, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  startTransition,
  useActionState,
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from 'react';
import type { CatalogActionState } from '../actions';

export const initialCatalogActionState: CatalogActionState = {
  error: null,
  success: null,
};

export function useCatalogEditorAction(
  action: (
    state: CatalogActionState,
    formData: FormData,
  ) => Promise<CatalogActionState>,
) {
  const [state, dispatch, pending] = useActionState(
    action,
    initialCatalogActionState,
  );
  const submit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      startTransition(() => dispatch(formData));
    },
    [dispatch],
  );

  return { state, submit, pending };
}

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
      <Button
        type="button"
        variant="secondary"
        className="min-h-11 sm:min-h-10"
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

export function CatalogActionFeedback({
  state,
}: {
  state: CatalogActionState;
}) {
  if (!state.error) return null;

  return <CatalogErrorFeedback state={state} />;
}

function CatalogErrorFeedback({ state }: { state: CatalogActionState }) {
  return (
    <Alert tone="danger" role="alert">
      <AlertTitle>Impossible d’enregistrer</AlertTitle>
      <AlertDescription>{state.error}</AlertDescription>
      {state.recovery === 'refresh' && <CatalogRefreshRecoveryButton />}
    </Alert>
  );
}

function CatalogRefreshRecoveryButton() {
  const router = useRouter();

  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      className="mt-3 min-h-11"
      onClick={() => router.refresh()}
    >
      <RefreshCw className="h-4 w-4" />
      Actualiser
    </Button>
  );
}

export function CatalogActionSuccess({ state }: { state: CatalogActionState }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!state.success) {
      setVisible(false);
      return;
    }

    setVisible(true);
    const timeoutId = window.setTimeout(() => setVisible(false), 5_000);
    return () => window.clearTimeout(timeoutId);
  }, [state]);

  if (!state.success || !visible) return null;

  return (
    <Alert
      tone="success"
      icon={<CheckCircle2 className="h-5 w-5" />}
      className="fixed right-4 top-4 z-[70] w-[calc(100%-2rem)] max-w-sm pr-12 shadow-lg"
      role="status"
      aria-live="polite"
    >
      <AlertTitle>Modification enregistrée</AlertTitle>
      <AlertDescription>{state.success}</AlertDescription>
      <button
        type="button"
        className="absolute right-1 top-1 inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg focus:outline-none focus:ring-2 focus:ring-focus-ring"
        aria-label="Fermer la confirmation"
        onClick={() => setVisible(false)}
      >
        <X className="h-4 w-4" />
      </button>
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
        className="min-h-11 min-w-11 lg:min-h-9 lg:min-w-9"
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
              <span className="grid gap-2" role="alert">
                <span className="font-medium text-status-danger">
                  {state.error}
                </span>
                {state.recovery === 'refresh' && (
                  <CatalogRefreshRecoveryButton />
                )}
              </span>
            )}
          </span>
        }
        confirmLabel={confirmLabel}
        cancelLabel="Annuler"
        tone={active ? 'danger' : 'primary'}
        onConfirm={() => formRef.current?.requestSubmit()}
      />
      <CatalogActionSuccess state={state} />
    </>
  );
}
