'use client';

import { Button } from '@yuta/ui';
import { Check, ExternalLink } from 'lucide-react';
import type { ExternalLinks } from '../_lib/feedback-types';
import { FeedbackShell } from './feedback-shell';
import { PrivacyNotice } from './feedback-notices';

export function FeedbackSuccess({
  establishmentName,
  externalLinks,
  onReset,
}: {
  establishmentName: string;
  externalLinks: ExternalLinks;
  onReset: () => void;
}) {
  const links = [
    { label: 'Donner mon avis sur Google', href: externalLinks.google },
    { label: 'Recommander sur Facebook', href: externalLinks.facebook },
    { label: 'Voir sur Instagram', href: externalLinks.instagram },
  ].filter((link): link is { label: string; href: string } =>
    Boolean(link.href),
  );

  return (
    <FeedbackShell>
      <section className="flex flex-1 flex-col text-center">
        <div className="flex flex-1 flex-col justify-center py-10">
          <div className="relative mx-auto h-28 w-40" aria-hidden="true">
            <span className="absolute left-3 top-12 h-1.5 w-1.5 rounded-full bg-brand-400" />
            <span className="absolute left-8 top-5 h-1 w-1 rounded-full bg-status-rating" />
            <span className="absolute left-12 top-16 h-1 w-1 rounded-full bg-brand-300" />
            <span className="absolute right-5 top-9 h-1.5 w-1.5 rounded-full bg-brand-500" />
            <span className="absolute right-10 top-4 h-1 w-1 rounded-full bg-brand-300" />
            <span className="absolute right-2 top-16 h-1 w-1 rounded-full bg-status-rating" />
            <span className="absolute left-1/2 top-1/2 grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-status-success text-inverse shadow-sm">
              <Check className="h-11 w-11" />
            </span>
          </div>
          <h1 className="mt-5 text-xl font-bold text-brand-700">
            Merci pour votre retour !
          </h1>
          <p className="mx-auto mt-4 max-w-xs text-sm leading-7 text-secondary">
            Votre avis a bien été transmis à l&apos;équipe de{' '}
            {establishmentName}.
          </p>

          <div className="mt-7">
            <PrivacyNotice />
          </div>

          {links.length > 0 && (
            <div className="mt-5 grid gap-3">
              <p className="text-sm font-semibold text-secondary">
                Partagez aussi votre expérience publiquement
              </p>
              {links.map((link) => (
                <Button key={link.href} variant="secondary" asChild>
                  <a href={link.href} target="_blank" rel="noopener noreferrer">
                    {link.label}
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  </a>
                </Button>
              ))}
            </div>
          )}
        </div>

        <div className="grid gap-4">
          <Button
            asChild
            variant="outline"
            size="lg"
            fullWidth
            className="border-brand-400 text-brand-700"
          >
            <a href="/">Fermer</a>
          </Button>
          <button
            type="button"
            onClick={onReset}
            className="mx-auto rounded px-2 py-1 text-sm font-medium text-brand-700 underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          >
            Donner un autre avis
          </button>
        </div>
      </section>
    </FeedbackShell>
  );
}
