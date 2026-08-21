import { Alert, AlertDescription, AlertTitle, Card } from '@yuta/ui';
import { requireEstablishment } from '@yuta/tenant';
import { ShieldX } from 'lucide-react';
import { BackofficePage } from '../../../../components/backoffice/backoffice-page';
import { hasPersonnelPermission } from '../../../../server/auth/permissions';
import { requireAuthenticatedTenant } from '../../../../server/auth/session';
import { CdiDraftReadinessPrototype } from './_components/cdi-draft-readiness-prototype';

export default async function Page() {
  const { tenant } = await requireAuthenticatedTenant(
    '/equipe/formalites-personnel',
  );
  requireEstablishment(tenant);

  if (!hasPersonnelPermission(tenant, 'personnel.employee.read')) {
    return <PersonnelFormalitiesForbidden />;
  }

  return (
    <BackofficePage
      title="Préparer un projet de contrat CDI"
      description="Vérifiez les informations qui pourraient préparer un futur projet de contrat."
    >
      <CdiDraftReadinessPrototype />
    </BackofficePage>
  );
}

function PersonnelFormalitiesForbidden() {
  return (
    <Card className="mx-auto max-w-2xl">
      <Alert tone="danger" icon={<ShieldX className="h-5 w-5" aria-hidden />}>
        <AlertTitle>Accès réservé</AlertTitle>
        <AlertDescription>
          Seul le propriétaire de l’établissement peut consulter les formalités
          du personnel. Aucune donnée salariée n’a été chargée.
        </AlertDescription>
      </Alert>
    </Card>
  );
}
