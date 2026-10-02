'use client';

import { Button } from '@yuta/ui';
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  Users,
} from 'lucide-react';
import type { Establishment, Result } from '../_lib/booking-types';
import { formatDate } from '../_lib/booking-dates';
import { downloadCalendar } from '../_lib/booking-calendar-export';

export function ConfirmationStep({
  establishment,
  date,
  time,
  partySize,
  result,
}: {
  establishment: Establishment;
  date: string;
  time: string;
  partySize: number;
  result: Result;
}) {
  const confirmed = result.status === 'CONFIRMED';
  return (
    <div className="flex flex-1 flex-col text-center">
      <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-surface-selected text-status-success">
        <CheckCircle2 className="h-11 w-11" aria-hidden />
      </span>
      <h1 className="mt-5 text-2xl font-bold text-status-success">
        {confirmed ? 'Réservation confirmée !' : 'Demande envoyée !'}
      </h1>
      <p className="mt-2 text-sm text-secondary">
        Merci {result.firstName}.{' '}
        {confirmed
          ? 'Votre table est réservée.'
          : 'Le restaurant doit encore confirmer votre demande.'}
      </p>

      <div className="my-7 rounded-lg border border-border-default bg-surface-muted p-5 text-left">
        <SummaryRow icon={MapPin} value={establishment.name} />
        <SummaryRow icon={CalendarDays} value={formatDate(date)} />
        <SummaryRow icon={Clock3} value={time} />
        <SummaryRow
          icon={Users}
          value={`${partySize} personne${partySize > 1 ? 's' : ''}`}
        />
        <p className="mt-4 border-t border-border-default pt-3 text-xs text-muted">
          Référence {result.reference}
        </p>
      </div>

      <Button
        type="button"
        variant="outline"
        fullWidth
        onClick={() => downloadCalendar(establishment, date, time)}
      >
        <CalendarDays aria-hidden /> Ajouter à mon calendrier
      </Button>
      <Button asChild fullWidth className="mt-3">
        <a href={`/${establishment.slug}/reservation/${result.token}`}>
          Voir ma réservation
        </a>
      </Button>
    </div>
  );
}

function SummaryRow({
  icon: Icon,
  value,
}: {
  icon: typeof MapPin;
  value: string;
}) {
  return (
    <p className="flex items-center gap-3 py-1.5 text-sm">
      <Icon className="h-4 w-4 text-muted" aria-hidden />
      <span>{value}</span>
    </p>
  );
}
