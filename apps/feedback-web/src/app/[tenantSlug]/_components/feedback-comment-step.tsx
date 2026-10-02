'use client';

import type { PublicFeedbackSubmission } from '@yuta/contracts/reputation';
import { Button, Checkbox, FormField, Input, Label, Textarea } from '@yuta/ui';
import { LockKeyhole } from 'lucide-react';
import type { FormEvent } from 'react';
import { InlineError } from './feedback-notices';

export function CommentStep({
  form,
  establishmentName,
  error,
  isSubmitting,
  onChange,
  onSubmit,
}: {
  form: PublicFeedbackSubmission;
  establishmentName: string;
  error: string | null;
  isSubmitting: boolean;
  onChange: (
    updater: (current: PublicFeedbackSubmission) => PublicFeedbackSubmission,
  ) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form className="flex flex-1 flex-col pt-8" onSubmit={onSubmit}>
      <h1 className="text-2xl font-bold">Parlez-nous de votre expérience</h1>
      <p className="mt-2 text-sm text-secondary">
        Votre retour nous aide à nous améliorer.
      </p>

      <div className="mt-7 grid gap-5">
        <FormField label="Votre avis">
          <Textarea
            value={form.comment}
            onChange={(event) =>
              onChange((current) => ({
                ...current,
                comment: event.target.value,
              }))
            }
            maxLength={4_000}
            rows={6}
            placeholder="Décrivez ce que vous avez apprécié ou ce qui pourrait être amélioré…"
          />
          <p className="mt-1 text-right text-xs text-muted">
            {form.comment.length} / 4000
          </p>
        </FormField>

        <FormField label="Votre prénom (optionnel)">
          <Input
            value={form.customerName}
            onChange={(event) =>
              onChange((current) => ({
                ...current,
                customerName: event.target.value,
              }))
            }
            autoComplete="given-name"
            maxLength={255}
            placeholder="Prénom"
          />
        </FormField>

        <FormField label="Votre e-mail (optionnel)">
          <Input
            type="email"
            value={form.customerEmail}
            onChange={(event) =>
              onChange((current) => ({
                ...current,
                customerEmail: event.target.value,
              }))
            }
            autoComplete="email"
            maxLength={320}
            placeholder="email@exemple.com"
          />
          <p className="mt-1 text-xs text-muted">
            Pour un éventuel suivi si nécessaire.
          </p>
        </FormField>

        <Label className="flex cursor-pointer items-start gap-3 text-sm font-normal leading-6">
          <Checkbox
            className="mt-0.5"
            checked={form.consentToContact}
            onCheckedChange={(checked) =>
              onChange((current) => ({
                ...current,
                consentToContact: checked === true,
              }))
            }
          />
          J&apos;accepte que {establishmentName} me contacte si nécessaire
          concernant mon avis.
        </Label>

        <div className="hidden" aria-hidden="true">
          <Label htmlFor="website">Site web</Label>
          <Input
            id="website"
            tabIndex={-1}
            autoComplete="off"
            value={form.website}
            onChange={(event) =>
              onChange((current) => ({
                ...current,
                website: event.target.value,
              }))
            }
          />
        </div>
      </div>

      {error && <InlineError message={error} />}

      <div className="mt-auto pt-8">
        <p className="mb-4 flex items-center justify-center gap-2 text-xs font-medium text-brand-700">
          <LockKeyhole className="h-4 w-4" aria-hidden="true" />
          Votre retour reste privé et confidentiel
        </p>
        <Button type="submit" size="lg" fullWidth loading={isSubmitting}>
          Envoyer mon avis
        </Button>
      </div>
    </form>
  );
}
