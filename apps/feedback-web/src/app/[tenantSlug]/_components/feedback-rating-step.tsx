'use client';

import { Button, cn } from '@yuta/ui';
import { Star } from 'lucide-react';
import { PrivacyNotice, InlineError } from './feedback-notices';

const ratingLabels = [
  '',
  'Très décevant',
  'Décevant',
  'Moyen',
  'Très bien',
  'Excellent',
] as const;

export function RatingStep({
  rating,
  error,
  onRatingChange,
  onContinue,
}: {
  rating: number;
  error: string | null;
  onRatingChange: (rating: number) => void;
  onContinue: () => void;
}) {
  return (
    <section className="flex flex-1 flex-col pt-14 text-center">
      <h1 className="text-2xl font-bold leading-tight">
        Quelle note globale donnez-vous à votre expérience ?
      </h1>
      <p className="mt-3 text-sm text-secondary">Sélectionnez une note</p>

      <div
        className="mt-10 flex justify-center gap-2"
        role="radiogroup"
        aria-label="Note globale"
      >
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={rating === value}
            aria-label={`${value} étoile${value > 1 ? 's' : ''}, ${ratingLabels[value]}`}
            onClick={() => onRatingChange(value)}
            className="rounded-md p-1 text-brand-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          >
            <Star
              className={cn('h-11 w-11', rating >= value && 'fill-brand-500')}
              aria-hidden="true"
            />
          </button>
        ))}
      </div>
      <div className="mt-3 flex justify-between text-xs text-secondary">
        <span>Très décevant</span>
        <span>Excellent</span>
      </div>
      {rating > 0 && (
        <p className="mt-5 font-semibold text-brand-700">
          {ratingLabels[rating]}
        </p>
      )}

      {error && <InlineError message={error} />}

      <div className="mt-auto space-y-4 pt-10">
        <PrivacyNotice />
        <Button size="lg" fullWidth onClick={onContinue}>
          Continuer
        </Button>
      </div>
    </section>
  );
}
