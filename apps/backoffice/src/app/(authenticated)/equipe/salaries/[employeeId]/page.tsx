import { findPersonnelEmployee } from '@yuta/db-cloud';
import { Alert, AlertDescription, AlertTitle, Card } from '@yuta/ui';
import { requireEstablishment } from '@yuta/tenant';
import { ShieldX } from 'lucide-react';
import { notFound } from 'next/navigation';
import { z } from 'zod';
import { hasPersonnelPermission } from '../../../../../server/auth/permissions';
import { requireAuthenticatedTenant } from '../../../../../server/auth/session';
import { cloudDatabase } from '../../../../../server/cloud-database';
import { EmployeeFullDossierPage } from '../_components/salaries-page';
import { isFormalitesReadPrototypeEnabled } from '../../formalites-personnel/_lib/formalites-read-prototype-runtime';
import { isContractExtractionPrototypeEnabled } from '../_lib/contract-extraction-prototype-runtime';
import { getBusinessDate } from '../salaries-model';

type PageProps = { params: Promise<{ employeeId: string }> };

const employeeIdSchema = z.string().uuid();

export default async function Page({ params }: PageProps) {
  const { employeeId } = await params;
  const path = `/equipe/salaries/${employeeId}`;
  const { tenant } = await requireAuthenticatedTenant(path);
  requireEstablishment(tenant);

  if (!hasPersonnelPermission(tenant, 'personnel.employee.read')) {
    return <PersonnelForbidden />;
  }
  if (!employeeIdSchema.safeParse(employeeId).success) notFound();

  const businessDate = getBusinessDate(tenant.timezone);
  const employee = await findPersonnelEmployee(
    cloudDatabase,
    tenant,
    employeeId,
    businessDate,
  );
  if (!employee) notFound();

  return (
    <EmployeeFullDossierPage
      initialEmployee={employee}
      locale={tenant.locale}
      businessDate={businessDate}
      contractExtractionPrototypeEnabled={
        isContractExtractionPrototypeEnabled() &&
        hasPersonnelPermission(tenant, 'personnel.document.extract')
      }
      formalitesReadPrototypeEnabled={isFormalitesReadPrototypeEnabled()}
    />
  );
}

function PersonnelForbidden() {
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
