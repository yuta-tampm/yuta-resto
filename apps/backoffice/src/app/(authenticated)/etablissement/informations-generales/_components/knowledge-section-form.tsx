'use client';

import { Alert, AlertDescription, Button, Card, Separator } from '@yuta/ui';
import { Save } from 'lucide-react';
import type { ReactNode } from 'react';
import { useFormStatus } from 'react-dom';

type KnowledgeSectionResult = {
  status: 'idle' | 'success' | 'error';
  message: string | null;
};

export function KnowledgeSectionForm({
  title,
  description,
  canManage,
  state,
  formAction,
  announceResult = false,
  submitButton,
  children,
}: {
  title: string;
  description: ReactNode;
  canManage: boolean;
  state: KnowledgeSectionResult;
  formAction: (formData: FormData) => void;
  /** Announces errors with `role="alert"` instead of the default status. */
  announceResult?: boolean;
  submitButton: ReactNode;
  children: ReactNode;
}) {
  return (
    <Card padding="none" radius="lg" className="overflow-hidden">
      <div className="px-5 py-4">
        <p className="text-xs font-bold uppercase tracking-wide text-action-primary">
          Restaurant Knowledge
        </p>
        <h2 className="mt-1 font-bold">{title}</h2>
        <p className="mt-1 text-sm text-muted">{description}</p>
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
            {...(announceResult
              ? { role: state.status === 'success' ? 'status' : 'alert' }
              : {})}
          >
            <AlertDescription>{state.message}</AlertDescription>
          </Alert>
        )}

        {children}

        {canManage && <div className="flex justify-end">{submitButton}</div>}
      </form>
    </Card>
  );
}

export function KnowledgeSubmitButton({
  disabled,
  label,
}: {
  disabled: boolean;
  label: string;
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
      {pending ? 'Enregistrement…' : label}
    </Button>
  );
}
