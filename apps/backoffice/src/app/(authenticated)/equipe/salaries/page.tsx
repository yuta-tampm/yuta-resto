import { personnelEmployeeListQuerySchema } from '@yuta/contracts/personnel';
import {
  listPersonnelActionOverview,
  listPersonnelEmployees,
} from '@yuta/db-cloud';
import { Alert, AlertDescription, AlertTitle, Card } from '@yuta/ui';
import { requireEstablishment } from '@yuta/tenant';
import { ShieldX } from 'lucide-react';
import { hasPersonnelPermission } from '../../../../server/auth/permissions';
import { requireAuthenticatedTenant } from '../../../../server/auth/session';
import { cloudDatabase } from '../../../../server/cloud-database';
import { getBusinessDate } from './salaries-model';
import { SalariesPage } from './_components/salaries-page';
import { isContractExtractionPrototypeEnabled } from './_lib/contract-extraction-prototype-runtime';
import { isPersonnelActionOverviewEnabled } from './_lib/personnel-action-overview-runtime';

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
  const actionOverviewState =
    isPersonnelActionOverviewEnabled() &&
    hasPersonnelPermission(tenant, 'personnel.document.read')
      ? await listPersonnelActionOverview(
          cloudDatabase,
          tenant,
          {},
          businessDate,
        )
          .then((overview) => ({ status: 'success' as const, overview }))
          .catch((error: unknown) => {
            console.error(
              'Failed to load the initial personnel action overview.',
              error,
            );
            return {
              status: 'error' as const,
              message: 'La liste des actions est indisponible. Réessayez.',
            };
          })
      : null;
  return (
    <SalariesPage
      data={data}
      query={query}
      locale={tenant.locale}
      businessDate={businessDate}
      actionOverviewState={actionOverviewState}
      contractExtractionPrototypeEnabled={
        isContractExtractionPrototypeEnabled() &&
        hasPersonnelPermission(tenant, 'personnel.document.extract')
      }
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
