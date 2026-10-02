'use client';

import { Button } from '@yuta/ui';
import { ChevronLeft } from 'lucide-react';

export function StepActions({
  canContinue,
  loading = false,
  continueLabel = 'Continuer',
  onBack,
  onContinue,
}: {
  canContinue: boolean;
  loading?: boolean;
  continueLabel?: string;
  onBack: () => void;
  onContinue?: () => void;
}) {
  return (
    <div className="mt-auto grid grid-cols-[auto_1fr] gap-3">
      <Button type="button" variant="ghost" onClick={onBack}>
        <ChevronLeft aria-hidden /> Retour
      </Button>
      <Button
        type={onContinue ? 'button' : 'submit'}
        fullWidth
        loading={loading}
        disabled={!canContinue}
        onClick={onContinue}
      >
        {continueLabel}
      </Button>
    </div>
  );
}
