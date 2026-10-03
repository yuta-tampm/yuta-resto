import { findPersonnelEmployee } from '@yuta/db-cloud';
import { requireEstablishment } from '@yuta/tenant';
import { notFound } from 'next/navigation';
import { z } from 'zod';
import { hasPersonnelPermission } from '@/server/auth/permissions';
import { requireAuthenticatedTenant } from '@/server/auth/session';
import { cloudDatabase } from '@/server/cloud-database';
import { getDateInTimezone } from '@/lib/local-time';
import { PersonnelForbidden } from '../_components/personnel-forbidden';
import { EmployeeFullDossierPage } from '../_components/employee-full-dossier-page';
import { isFormalitesReadPrototypeEnabled } from '../../formalites-personnel/_lib/formalites-read-prototype-runtime';
import { isContractExtractionPrototypeEnabled } from '../_lib/contract-extraction-prototype-runtime';

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

  const businessDate = getDateInTimezone(tenant.timezone);
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
