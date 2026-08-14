import { personnelEmployeeListQuerySchema } from '@yuta/contracts/personnel';
import { listPersonnelEmployees } from '@yuta/db-cloud';
import { Alert, AlertDescription, AlertTitle, Card } from '@yuta/ui';
import { requireEstablishment } from '@yuta/tenant';
import { ShieldX } from 'lucide-react';
import { hasPersonnelPermission } from '../../../../server/auth/permissions';
import { requireAuthenticatedTenant } from '../../../../server/auth/session';
import { cloudDatabase } from '../../../../server/cloud-database';
import { getBusinessDate } from './salaries-model';
import { SalariesPage } from './salaries-page';

type PageSearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function Page({
  searchParams,
}: {
  searchParams: PageSearchParams;
}) {
  const { tenant } = await requireAuthenticatedTenant('/equipe/salaries');
  requireEstablishment(tenant);

  if (!hasPersonnelPermission(tenant, 'personnel.employee.read')) {
    return <PersonnelForbidden />;
  }

  const values = await searchParams;
  const parsedQuery = personnelEmployeeListQuerySchema.safeParse({
    view: first(values.view),
    search: first(values.search),
    completeness: first(values.completeness),
    cursor: first(values.cursor),
    limit: first(values.limit),
  });
  const query = parsedQuery.success
    ? parsedQuery.data
    : personnelEmployeeListQuerySchema.parse({});
  const businessDate = getBusinessDate(tenant.timezone);
  const data = await listPersonnelEmployees(
    cloudDatabase,
    tenant,
    query,
    businessDate,
  );
  return (
    <SalariesPage
      data={data}
      query={query}
      locale={tenant.locale}
      businessDate={businessDate}
    />
  );
}

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
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
