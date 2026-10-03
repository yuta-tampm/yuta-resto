'use client';

import { cn } from '@yuta/ui';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Establishment } from '../_lib/booking-types';
import { calendarDays, addDays, toLocalDate } from '../_lib/booking-dates';
import { StepIntro } from './booking-step-intro';
import { StepActions } from './booking-step-actions';

const weekdayLabels = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

export function DateStep({
  establishment,
  selectedDate,
  month,
  today,
  bookingWindowDays,
  loading,
  onSelect,
  onMonthChange,
  onContinue,
  onBack,
}: {
  establishment: Establishment;
  selectedDate: string;
  month: Date;
  today: Date;
  bookingWindowDays: number;
  loading: boolean;
  onSelect: (value: string) => void;
  onMonthChange: (value: Date) => void;
  onContinue: () => void;
  onBack: () => void;
}) {
  const maximumDate = addDays(today, bookingWindowDays);
  const days = calendarDays(month);
  const canGoPrevious =
    month.getFullYear() > today.getFullYear() ||
    month.getMonth() > today.getMonth();

  return (
    <div className="flex flex-1 flex-col">
      <StepIntro
        title="Choisissez la date"
        description="Sélectionnez le jour de votre venue."
      />
      <div className="my-7">
        <div className="mb-4 flex items-center justify-between">
          <button
            type="button"
            className="rounded-full p-2 hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-30"
            disabled={!canGoPrevious}
            onClick={() =>
              onMonthChange(
                new Date(month.getFullYear(), month.getMonth() - 1, 1),
              )
            }
            aria-label="Mois précédent"
          >
            <ChevronLeft aria-hidden />
          </button>
          <p className="font-semibold capitalize">
            {month.toLocaleDateString('fr-FR', {
              month: 'long',
              year: 'numeric',
            })}
          </p>
          <button
            type="button"
            className="rounded-full p-2 hover:bg-surface-muted"
            onClick={() =>
              onMonthChange(
                new Date(month.getFullYear(), month.getMonth() + 1, 1),
              )
            }
            aria-label="Mois suivant"
          >
            <ChevronRight aria-hidden />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center">
          {weekdayLabels.map((label) => (
            <span key={label} className="py-2 text-xs font-medium text-muted">
              {label}
            </span>
          ))}
          {days.map((day) => {
            const value = toLocalDate(day);
            const isCurrentMonth = day.getMonth() === month.getMonth();
            const disabled =
              !isCurrentMonth || day < today || day > maximumDate;
            const selected = selectedDate === value;
            return (
              <button
                key={value}
                type="button"
                disabled={disabled}
                onClick={() => onSelect(value)}
                className={cn(
                  'mx-auto flex h-10 w-10 items-center justify-center rounded-full text-sm transition',
                  selected
                    ? 'bg-action-primary font-semibold text-inverse shadow-sm'
                    : 'hover:bg-surface-selected',
                  disabled && 'cursor-not-allowed text-muted opacity-30',
                )}
                aria-pressed={selected}
              >
                {day.getDate()}
              </button>
            );
          })}
        </div>
      </div>
      <StepActions
        canContinue={Boolean(selectedDate)}
        loading={loading}
        onBack={onBack}
        onContinue={onContinue}
      />
    </div>
  );
}
