'use client';

import { Alert, AlertDescription, AlertTitle, Button } from '@yuta/ui';
import { CheckCircle2, RefreshCw, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { LocalUserActionState } from '../users-action-state';

export function ActionFeedback({ state }: { state: LocalUserActionState }) {
  if (!state.error) return null;
  return (
    <Alert tone="danger" role="alert">
      <AlertTitle>Impossible d’enregistrer</AlertTitle>
      <AlertDescription>{state.error}</AlertDescription>
      {state.recovery === 'refresh' && <RefreshRecoveryButton />}
    </Alert>
  );
}

function RefreshRecoveryButton() {
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

export function LocalUserActionSuccess({
  state,
}: {
  state: LocalUserActionState;
}) {
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

export function useCloseOnSuccess(
  state: LocalUserActionState,
  setOpen: (open: boolean) => void,
) {
  useEffect(() => {
    if (state.success) setOpen(false);
  }, [state.success, setOpen]);
}
