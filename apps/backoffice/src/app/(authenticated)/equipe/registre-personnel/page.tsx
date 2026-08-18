import {
  listPersonnelRegister,
  listPersonnelRegisterCandidates,
} from '@yuta/db-cloud';
import { Alert, AlertDescription, AlertTitle, Card } from '@yuta/ui';
import { requireEstablishment } from '@yuta/tenant';
import { ShieldX } from 'lucide-react';
import { randomUUID } from 'node:crypto';
import { hasPersonnelPermission } from '../../../../server/auth/permissions';
import { requireAuthenticatedTenant } from '../../../../server/auth/session';
import { cloudDatabase } from '../../../../server/cloud-database';
import { PersonnelRegisterPage } from './_components/personnel-register-page';
import { isPersonnelRegisterEnabled } from './_lib/personnel-register-runtime';

export default async function Page() {
  const { tenant } = await requireAuthenticatedTenant(
    '/equipe/registre-personnel',
  );
  requireEstablishment(tenant);
  if (!hasPersonnelPermission(tenant, 'personnel.register.read'))
    return <PersonnelRegisterForbidden />;
  if (!isPersonnelRegisterEnabled()) return <PersonnelRegisterUnavailable />;
  const [data, candidates] = await Promise.all([
    listPersonnelRegister(cloudDatabase, tenant, { limit: 50 }, randomUUID()),
    listPersonnelRegisterCandidates(cloudDatabase, tenant),
  ]);
  return (
    <PersonnelRegisterPage
      data={data}
      candidates={candidates.items}
      locale={tenant.locale}
    />
  );
}
function PersonnelRegisterForbidden() {
  return (
    <Card className="mx-auto max-w-2xl">
      <Alert tone="danger" icon={<ShieldX className="h-5 w-5" aria-hidden />}>
        <AlertTitle>Accès réservé</AlertTitle>
        <AlertDescription>
          Seul le propriétaire de l’établissement peut consulter le registre.
          Aucune donnée du personnel n’a été chargée.
        </AlertDescription>
      </Alert>
    </Card>
  );
}
function PersonnelRegisterUnavailable() {
  return (
    <Card className="mx-auto max-w-2xl">
      <Alert tone="warning">
        <AlertTitle>Registre indisponible</AlertTitle>
        <AlertDescription>
          Cette version réelle est limitée au développement local. Elle reste
          désactivée en production.
        </AlertDescription>
      </Alert>
    </Card>
  );
}
