'use client';

import { Alert, AlertDescription, AlertTitle, Button, Card } from '@yuta/ui';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function SalariesError({ reset }: { reset: () => void }) {
  return (
    <Card className="mx-auto max-w-2xl">
      <Alert
        tone="danger"
        icon={<AlertCircle className="h-5 w-5" aria-hidden />}
      >
        <AlertTitle>Impossible de charger les salariés</AlertTitle>
        <AlertDescription>
          Aucune donnée partielle n’est affichée. Vous pouvez relancer le
          chargement.
        </AlertDescription>
        <div className="mt-4">
          <Button variant="secondary" onClick={reset}>
            <RefreshCw className="h-4 w-4" aria-hidden />
            Réessayer
          </Button>
        </div>
      </Alert>
    </Card>
  );
}
