'use client';

import { Button, PoweredByYuta, YutaBrandMark } from '@yuta/ui';
import { Store } from 'lucide-react';

export function WelcomeStep({
  establishmentName,
  onContinue,
}: {
  establishmentName: string;
  onContinue: () => void;
}) {
  return (
    <section className="flex flex-1 flex-col text-center">
      <div className="flex items-center justify-between text-sm font-semibold">
        <YutaBrandMark />
        <span className="text-secondary">FR</span>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center py-10">
        <span className="grid h-24 w-24 place-items-center rounded-full bg-brand-50 text-brand-600">
          <Store className="h-12 w-12" aria-hidden="true" />
        </span>
        <p className="mt-7 text-sm font-semibold uppercase tracking-[0.2em] text-secondary">
          Bienvenue chez
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          {establishmentName}
        </h1>

        <div className="mt-10 max-w-sm">
          <h2 className="text-xl font-bold">Votre avis compte</h2>
          <p className="mt-3 leading-7 text-secondary">
            Aidez-nous à nous améliorer en partageant votre expérience. Vos
            retours sont confidentiels et transmis directement à notre équipe.
          </p>
        </div>
      </div>

      <Button size="lg" fullWidth onClick={onContinue}>
        Commencer
      </Button>
      <PoweredByYuta className="mt-5" />
    </section>
  );
}
