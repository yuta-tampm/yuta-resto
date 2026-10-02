'use client';

import type { CreatePublicReservationInput } from '@yuta/contracts/reservations';
import { Alert, AlertDescription, PoweredByYuta, Progress } from '@yuta/ui';
import { useMemo, useState } from 'react';
import type { Establishment, Slot, Result } from '../_lib/booking-types';
import { startOfDay } from '../_lib/booking-dates';
import { RestaurantBrand } from './booking-restaurant-brand';
import { PartyStep } from './booking-party-step';
import { DateStep } from './booking-date-step';
import { TimeStep } from './booking-time-step';
import { GuestStep } from './booking-guest-step';
import { ConfirmationStep } from './booking-confirmation-step';

export function BookingFlow({
  establishment,
  source,
}: {
  establishment: Establishment;
  source: CreatePublicReservationInput['source'];
}) {
  const today = useMemo(() => startOfDay(new Date()), []);
  const [step, setStep] = useState(1);
  const [partySize, setPartySize] = useState(
    Math.max(2, establishment.minimumPartySize),
  );
  const [date, setDate] = useState('');
  const [calendarMonth, setCalendarMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [slots, setSlots] = useState<Slot[]>([]);
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<Result | null>(null);

  async function loadSlots() {
    if (!date) return;
    setLoading(true);
    setError('');
    setTime('');
    try {
      const response = await fetch(
        `/api/public/booking/establishments/${encodeURIComponent(establishment.slug)}/availability?date=${date}&partySize=${partySize}`,
      );
      const body = (await response.json()) as {
        slots?: Slot[];
        error?: { message: string };
      };
      if (!response.ok) {
        throw new Error(body.error?.message ?? 'Créneaux indisponibles.');
      }
      setSlots(body.slots ?? []);
      setStep(3);
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : 'Créneaux indisponibles.',
      );
    } finally {
      setLoading(false);
    }
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const firstName = String(data.get('firstName') ?? '');
    const payload: CreatePublicReservationInput = {
      date,
      time,
      partySize,
      guest: {
        firstName,
        lastName: String(data.get('lastName') ?? ''),
        email: String(data.get('email') ?? ''),
        phone: String(data.get('phone') ?? ''),
      },
      specialRequirements:
        String(data.get('specialRequirements') ?? '') || undefined,
      source,
      marketingConsent: data.get('marketingConsent') === 'on',
      policyAccepted: true,
      idempotencyKey: crypto.randomUUID(),
    };

    setLoading(true);
    setError('');
    try {
      const response = await fetch(
        `/api/public/booking/establishments/${encodeURIComponent(establishment.slug)}/reservations`,
        {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(payload),
        },
      );
      const body = (await response.json()) as {
        reservation?: { reference: string; status: string };
        publicToken?: string;
        error?: { message: string };
      };
      if (!response.ok || !body.reservation || !body.publicToken) {
        throw new Error(body.error?.message ?? 'La réservation a échoué.');
      }
      setResult({
        reference: body.reservation.reference,
        status: body.reservation.status,
        token: body.publicToken,
        firstName,
      });
      setStep(5);
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : 'La réservation a échoué.',
      );
    } finally {
      setLoading(false);
    }
  }

  function goBack() {
    setError('');
    setStep((current) => Math.max(1, current - 1));
  }

  return (
    <div className={`flex h-dvh flex-col sm:max-h-225`}>
      <RestaurantBrand establishment={establishment} />
      <div
        className={
          'flex flex-1 px-6 pb-5 sm:px-8 sm:pb-7 sm:pt-8 min-h-0 flex-col overflow-y-auto'
        }
      >
        {step === 1 && (
          <PartyStep
            establishment={establishment}
            value={partySize}
            minimum={establishment.minimumPartySize}
            maximum={establishment.maximumPartySize}
            onChange={setPartySize}
            onContinue={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <DateStep
            establishment={establishment}
            selectedDate={date}
            month={calendarMonth}
            today={today}
            bookingWindowDays={establishment.bookingWindowDays}
            loading={loading}
            onSelect={setDate}
            onMonthChange={setCalendarMonth}
            onContinue={loadSlots}
            onBack={goBack}
          />
        )}

        {step === 3 && (
          <TimeStep
            establishment={establishment}
            date={date}
            partySize={partySize}
            slots={slots}
            value={time}
            onChange={setTime}
            onContinue={() => setStep(4)}
            onBack={goBack}
          />
        )}

        {step === 4 && (
          <GuestStep
            establishment={establishment}
            loading={loading}
            onSubmit={submit}
            onBack={goBack}
          />
        )}

        {step === 5 && result && (
          <ConfirmationStep
            establishment={establishment}
            date={date}
            time={time}
            partySize={partySize}
            result={result}
          />
        )}

        {error && (
          <Alert tone="danger" className="mt-5">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>

      <PoweredByYuta className="shrink-0 border-t border-border-default px-5 py-3" />
    </div>
  );
}

function BookingProgress() {
  return (
    <div className="mb-7" aria-label="Étape 1 sur 5">
      <div className="mb-2 flex items-center justify-between text-xs">
        <span className="font-semibold text-primary">Étape 1 sur 5</span>
        <span className="text-muted">Personnes</span>
      </div>
      <Progress value={20} aria-label="Progression de la réservation : 20 %" />
    </div>
  );
}
