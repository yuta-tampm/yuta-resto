import { findPersonnelEmployee } from '@yuta/db-cloud';
import { Alert, AlertDescription, AlertTitle, Card } from '@yuta/ui';
import { requireEstablishment } from '@yuta/tenant';
import { ShieldX } from 'lucide-react';
import { notFound } from 'next/navigation';
import { z } from 'zod';
import { BackofficePage } from '../../../../../components/backoffice/backoffice-page';
import { hasPersonnelPermission } from '../../../../../server/auth/permissions';
import { requireAuthenticatedTenant } from '../../../../../server/auth/session';
import { cloudDatabase } from '../../../../../server/cloud-database';
import { getBusinessDate } from '../../salaries/salaries-model';
import { CdiDraftConnectedReadPrototype } from '../_components/cdi-draft-connected-read-prototype';
import { createCdiDraftConnectedReadModel } from '../_lib/cdi-draft-connected-read-model';
import { isFormalitesReadPrototypeEnabled } from '../_lib/formalites-read-prototype-runtime';

type PageProps = { params: Promise<{ employeeId: string }> };

const employeeIdSchema = z.string().uuid();

export default async function Page({ params }: PageProps) {
  if (!isFormalitesReadPrototypeEnabled()) notFound();

  const { employeeId } = await params;
  const path = `/equipe/formalites-personnel/${employeeId}`;
  const { tenant } = await requireAuthenticatedTenant(path);
  requireEstablishment(tenant);

  if (!hasPersonnelPermission(tenant, 'personnel.employee.read')) {
    return <PersonnelFormalitiesForbidden />;
  }
  if (!employeeIdSchema.safeParse(employeeId).success) notFound();

  const employee = await findPersonnelEmployee(
    cloudDatabase,
    tenant,
    employeeId,
    getBusinessDate(tenant.timezone),
  );
  if (!employee) notFound();

  const model = createCdiDraftConnectedReadModel(employee, tenant.locale);

  return (
    <BackofficePage
      title="Préparer un projet de contrat CDI"
      description="Testez localement les informations à compléter à partir d’un dossier salarié fictif de développement."
    >
      <CdiDraftConnectedReadPrototype
        model={model}
        employeeDossierHref={`/equipe/salaries/${employeeId}`}
      />
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
