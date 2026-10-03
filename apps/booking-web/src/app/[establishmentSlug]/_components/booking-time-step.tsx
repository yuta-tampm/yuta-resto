'use client';

import { Button } from '@yuta/ui';
import { Clock3 } from 'lucide-react';
import type { Establishment, Slot } from '../_lib/booking-types';
import { formatDate } from '../_lib/booking-dates';
import { StepIntro } from './booking-step-intro';
import { StepActions } from './booking-step-actions';

export function TimeStep({
  establishment,
  date,
  partySize,
  slots,
  value,
  onChange,
  onContinue,
  onBack,
}: {
  establishment: Establishment;
  date: string;
  partySize: number;
  slots: Slot[];
  value: string;
  onChange: (value: string) => void;
  onContinue: () => void;
  onBack: () => void;
}) {
  const availableSlots = slots.filter((slot) => slot.available);
  return (
    <div className="flex flex-1 flex-col">
      <StepIntro
        title="Choisissez l’horaire"
        description={`Disponibilités pour ${partySize} personne${partySize > 1 ? 's' : ''} le ${formatDate(date)}.`}
      />
      <div className="my-8 flex-1">
        {availableSlots.length > 0 ? (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {availableSlots.map((slot) => (
              <Button
                key={slot.time}
                type="button"
                size="md"
                variant={value === slot.time ? 'primary' : 'outline'}
                onClick={() => onChange(slot.time)}
              >
                {slot.time}
              </Button>
            ))}
          </div>
        ) : (
          <div className="rounded-lg bg-surface-muted px-5 py-10 text-center">
            <Clock3 className="mx-auto h-8 w-8 text-muted" aria-hidden />
            <p className="mt-3 font-medium">Aucun horaire disponible</p>
            <p className="mt-1 text-sm text-secondary">
              Revenez à l’étape précédente pour choisir une autre date.
            </p>
          </div>
        )}
      </div>
      <StepActions
        canContinue={Boolean(value)}
        onBack={onBack}
        onContinue={onContinue}
      />
    </div>
  );
}
