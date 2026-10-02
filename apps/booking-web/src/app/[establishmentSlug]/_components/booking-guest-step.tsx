'use client';

import { FormField, Input, Label } from '@yuta/ui';
import type { Establishment } from '../_lib/booking-types';
import { StepIntro } from './booking-step-intro';
import { StepActions } from './booking-step-actions';

export function GuestStep({
  establishment,
  loading,
  onSubmit,
  onBack,
}: {
  establishment: Establishment;
  loading: boolean;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onBack: () => void;
}) {
  return (
    <form className="flex flex-1 flex-col" onSubmit={onSubmit}>
      <StepIntro
        title="Vos informations"
        description="Nous en avons besoin pour confirmer votre réservation."
      />
      <div className="my-7 grid gap-4">
        <FormField label={<Label htmlFor="first-name">Prénom</Label>}>
          <Input
            id="first-name"
            name="firstName"
            autoComplete="given-name"
            required
          />
        </FormField>
        <FormField label={<Label htmlFor="last-name">Nom</Label>}>
          <Input
            id="last-name"
            name="lastName"
            autoComplete="family-name"
            required
          />
        </FormField>
        <FormField label={<Label htmlFor="email">E-mail</Label>}>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
          />
        </FormField>
        <FormField label={<Label htmlFor="phone">Téléphone</Label>}>
          <Input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            required
          />
        </FormField>
        <div>
          <FormField
            label={
              <Label htmlFor="special-requirements">
                Demandes particulières (facultatif)
              </Label>
            }
          >
            <Input
              id="special-requirements"
              name="specialRequirements"
              placeholder="Allergies, anniversaire, accessibilité…"
              maxLength={1000}
            />
          </FormField>
        </div>
        <label className="flex cursor-pointer items-start gap-3 text-sm text-secondary">
          <input
            name="policyAccepted"
            type="checkbox"
            required
            className="mt-1"
          />
          <span>
            J’accepte la politique de réservation.{' '}
            {establishment.bookingPolicy && (
              <span className="text-muted">{establishment.bookingPolicy}</span>
            )}
          </span>
        </label>
        <label className="flex cursor-pointer items-start gap-3 text-sm text-secondary">
          <input name="marketingConsent" type="checkbox" className="mt-1" />
          Je souhaite recevoir les actualités du restaurant.
        </label>
      </div>
      <StepActions
        loading={loading}
        canContinue
        continueLabel="Confirmer la réservation"
        onBack={onBack}
      />
    </form>
  );
}
