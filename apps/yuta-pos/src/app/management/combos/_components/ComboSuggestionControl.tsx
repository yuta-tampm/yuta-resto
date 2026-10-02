'use client';

import { Switch } from '@yuta/ui';
import { useActionState, useEffect, useId, useRef } from 'react';
import { setComboRuleSuggestionEnabledAction } from '../actions';
import { getComboSuggestionStatus, type ComboRule } from '../combo-model';
import {
  ComboActionFeedback,
  initialComboActionState,
} from './ComboDialogSupport';

export function ComboSuggestionControl({ rule }: { rule: ComboRule }) {
  const formRef = useRef<HTMLFormElement>(null);
  const submissionRequestedRef = useRef(false);
  const statusId = useId();
  const [state, action, pending] = useActionState(
    setComboRuleSuggestionEnabledAction.bind(
      null,
      rule.id,
      !rule.isSuggestionEnabled,
    ),
    initialComboActionState,
  );

  useEffect(() => {
    if (!pending) submissionRequestedRef.current = false;
  }, [pending, state]);

  function requestUpdate() {
    if (pending || submissionRequestedRef.current) return;
    submissionRequestedRef.current = true;
    formRef.current?.requestSubmit();
  }

  return (
    <div className="grid min-h-11 gap-2 rounded-lg border border-border-default bg-surface px-3 py-2 sm:col-span-2 lg:col-span-1 lg:min-w-60">
      <form ref={formRef} action={action} />
      <div className="flex min-w-0 items-center justify-between gap-3">
        <label
          htmlFor={`${statusId}-switch`}
          className="min-w-0 cursor-pointer"
        >
          <span className="block text-sm font-bold">
            Suggestion à la commande
          </span>
          <span
            id={statusId}
            className="mt-0.5 block text-xs font-medium text-secondary"
            aria-live="polite"
          >
            {getComboSuggestionStatus(rule, pending)}
          </span>
        </label>
        <Switch
          id={`${statusId}-switch`}
          checked={rule.isSuggestionEnabled}
          disabled={pending}
          aria-describedby={statusId}
          aria-label={`${rule.isSuggestionEnabled ? 'Désactiver' : 'Activer'} les suggestions pour ${rule.name}`}
          className="relative after:absolute after:-inset-y-2.5 after:inset-x-0"
          onCheckedChange={requestUpdate}
        />
      </div>
      {!rule.isActive && rule.isSuggestionEnabled && !pending && (
        <p className="text-xs text-muted">
          Une formule inactive ne peut pas être suggérée.
        </p>
      )}
      <ComboActionFeedback
        state={pending ? initialComboActionState : state}
        showSuccess
      />
    </div>
  );
}
