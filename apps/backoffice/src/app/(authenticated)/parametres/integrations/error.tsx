'use client';

import { Button, Card, ErrorState } from '@yuta/ui';

export default function IntegrationsError({ reset }: { reset: () => void }) {
  return (
    <Card padding="none">
      <ErrorState
        title="Impossible de charger les intégrations"
        description="Les données de connexion sont temporairement indisponibles. Réessayez sans quitter cette page."
        action={
          <Button type="button" variant="secondary" onClick={reset}>
            Réessayer
          </Button>
        }
      />
    </Card>
  );
}
