'use client';

import { Button, Card, ErrorState } from '@yuta/ui';

export default function ReputationError({ reset }: { reset: () => void }) {
  return (
    <Card padding="none">
      <ErrorState
        title="Les avis sont momentanément indisponibles"
        description="Réessayez dans quelques instants. Si le problème persiste, contactez votre responsable ou le support YUTA."
        action={
          <Button type="button" variant="secondary" onClick={reset}>
            Réessayer
          </Button>
        }
      />
    </Card>
  );
}
