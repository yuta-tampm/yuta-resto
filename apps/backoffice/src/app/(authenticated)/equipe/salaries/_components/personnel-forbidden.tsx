import { Alert, AlertDescription, AlertTitle, Card } from '@yuta/ui';
import { ShieldX } from 'lucide-react';

export function PersonnelForbidden() {
  return (
    <Card className="mx-auto max-w-2xl">
      <Alert tone="danger" icon={<ShieldX className="h-5 w-5" aria-hidden />}>
        <AlertTitle>Accès réservé</AlertTitle>
        <AlertDescription>
          Seul le propriétaire de l’établissement peut consulter les dossiers
          salariés. Aucune information personnelle n’a été chargée.
        </AlertDescription>
      </Alert>
    </Card>
  );
}
