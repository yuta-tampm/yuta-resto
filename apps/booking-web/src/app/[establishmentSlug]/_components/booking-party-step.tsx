'use client';

import { Button, IconButton } from '@yuta/ui';
import { ArrowRight, Minus, Plus } from 'lucide-react';
import type { Establishment } from '../_lib/booking-types';
import { StepIntro } from './booking-step-intro';

export function PartyStep({
  establishment,
  value,
  minimum,
  maximum,
  onChange,
  onContinue,
}: {
  establishment: Establishment;
  value: number;
  minimum: number;
  maximum: number;
  onChange: (value: number) => void;
  onContinue: () => void;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <p className="mb-1 text-sm text-secondary text-center">
        Bienvenue au {establishment.name}
      </p>
      <StepIntro
        title="Combien de personnes ?"
        description="Sélectionnez le nombre de convives."
      />
      <div className="flex flex-col items-center py-8">
        <div className="flex items-center gap-8">
          <IconButton
            type="button"
            variant="outline"
            size="lg"
            className="rounded-full"
            disabled={value <= minimum}
            onClick={() => onChange(Math.max(minimum, value - 1))}
            aria-label="Diminuer le nombre de personnes"
          >
            <Minus aria-hidden />
          </IconButton>
          <span
            className="min-w-12 text-center text-5xl font-bold tabular-nums"
            aria-live="polite"
            aria-atomic="true"
          >
            {value}
          </span>
          <IconButton
            type="button"
            variant="primary"
            size="lg"
            className="rounded-full"
            disabled={value >= maximum}
            onClick={() => onChange(Math.min(maximum, value + 1))}
            aria-label="Augmenter le nombre de personnes"
          >
            <Plus aria-hidden />
          </IconButton>
        </div>
        <p className="mt-5 text-sm text-muted">
          Tables de {minimum} à {maximum} personnes
        </p>
      </div>

      <div className="rounded-lg bg-surface-muted px-4 py-3 text-center text-sm text-secondary">
        Pour les groupes de plus de {maximum} personnes, contactez directement
        le restaurant
        {establishment.publicPhone ? (
          <>
            {' au '}
            <a
              href={`tel:${establishment.publicPhone}`}
              className="font-semibold text-primary underline underline-offset-2"
            >
              {establishment.publicPhone}
            </a>
            .
          </>
        ) : (
          '.'
        )}
      </div>

      <div className="mt-auto pt-7">
        <Button type="button" fullWidth size="lg" onClick={onContinue}>
          Continuer <ArrowRight className="h-4 w-4" aria-hidden />
        </Button>
      </div>
    </div>
  );
}
