'use client';

import { Button } from '@yuta/ui';
import { CircleCheckBig, FilePlus2, List } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export const AUTO_HOME_REDIRECT_SECONDS = 5;

export function OrderItemsSendSuccess({
  orderNumber,
}: {
  orderNumber: string;
}) {
  const [secondsRemaining, setSecondsRemaining] = useState(
    AUTO_HOME_REDIRECT_SECONDS,
  );

  useEffect(() => {
    const countdownId = window.setInterval(() => {
      setSecondsRemaining((current) => Math.max(0, current - 1));
    }, 1_000);
    const redirectId = window.setTimeout(() => {
      window.location.assign('/');
    }, AUTO_HOME_REDIRECT_SECONDS * 1_000);

    return () => {
      window.clearInterval(countdownId);
      window.clearTimeout(redirectId);
    };
  }, []);

  return (
    <section
      role="status"
      aria-labelledby="kitchen-send-success-title"
      className="flex min-h-full items-center justify-center bg-canvas p-4 sm:p-8"
    >
      <div className="grid w-full max-w-2xl justify-items-center gap-5 rounded-2xl border border-border-default bg-white px-5 py-8 text-center shadow-sm sm:gap-6 sm:px-10 sm:py-12">
        <span className="grid h-20 w-20 place-items-center rounded-full border-4 border-status-success text-status-success">
          <CircleCheckBig className="h-12 w-12" aria-hidden="true" />
        </span>

        <div className="grid gap-3">
          <h2
            id="kitchen-send-success-title"
            className="text-2xl font-black sm:text-3xl"
          >
            Commande envoyée en cuisine
          </h2>
          <p className="text-base font-semibold text-primary/65 sm:text-lg">
            La commande a bien été transmise à la cuisine.
          </p>
        </div>

        <p className="rounded-lg bg-status-success-soft px-4 py-2 text-base font-black text-primary sm:text-lg">
          {orderNumber}
        </p>

        <p className="font-semibold text-primary/65">
          La commande reste ouverte pour le suivi et le paiement.
        </p>

        <p
          className="inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-status-success-border bg-status-success-soft px-4 py-2 text-sm font-black text-primary"
          aria-live="polite"
        >
          <span>Retour automatique aux commandes dans</span>
          <span className="min-w-14 rounded-full bg-action-primary px-3 py-1 text-lg leading-none text-inverse shadow-sm">
            {secondsRemaining} s
          </span>
        </p>

        <div className="grid w-full max-w-lg gap-3">
          <Button asChild variant="primary" className="h-14 text-base">
            <Link href="/pos">
              <FilePlus2 className="h-5 w-5" />
              Créer une autre commande
            </Link>
          </Button>
          <Button asChild variant="secondary" className="h-14 text-base">
            <Link href="/">
              <List className="h-5 w-5" />
              Retour aux commandes
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
