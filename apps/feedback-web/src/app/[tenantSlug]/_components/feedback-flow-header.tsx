'use client';

import { ArrowLeft } from 'lucide-react';
import type { FlowStep } from '../_lib/feedback-types';

export function FlowHeader({
  step,
  onBack,
}: {
  step: FlowStep;
  onBack: () => void;
}) {
  return (
    <header>
      <div className="grid grid-cols-[2.5rem_1fr_2.5rem] items-center">
        <button
          type="button"
          onClick={onBack}
          className="grid h-10 w-10 place-items-center rounded-full hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          aria-label="Revenir à l'étape précédente"
        >
          <ArrowLeft className="h-5 w-5" aria-hidden="true" />
        </button>
        <p className="text-center text-sm font-semibold" aria-live="polite">
          Étape {step} sur 5
        </p>
      </div>
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-neutral-100">
        <div
          className="h-full rounded-full bg-action-primary transition-[width]"
          style={{ width: `${(step / 5) * 100}%` }}
        />
      </div>
    </header>
  );
}
