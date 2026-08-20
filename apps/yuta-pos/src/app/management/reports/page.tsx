import { Button, ErrorState } from '@yuta/ui';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  SiteAgentClientError,
  siteAgentClient,
} from '../../../lib/site-agent-client';
import { requireLocalManagementCredentials } from '../../../server/local-management-session';
import { ManagementHeader } from '../_components/ManagementHeader';
import { ReportsRefreshButton } from './_components/ReportsRefreshButton';
import { ReportsView } from './_components/ReportsView';

type ManagementReportsPageProps = {
  searchParams: Promise<{ page?: string }>;
};

const reportPageSize = 50;

export default async function ManagementReportsPage({
  searchParams,
}: ManagementReportsPageProps) {
  const { session, token } = await requireLocalManagementCredentials();
  const requestedPage = positivePage((await searchParams).page);

  try {
    const report = await siteAgentClient.getManagementReport(token, {
      page: requestedPage,
      limit: reportPageSize,
    });
    return (
      <main className="min-h-dvh bg-canvas text-primary">
        <ManagementHeader
          userName={session.user.name}
          userRole={session.user.role}
        />
        <ReportsView report={report} />
      </main>
    );
  } catch (error) {
    if (
      error instanceof SiteAgentClientError &&
      (error.status === 401 || error.status === 403)
    ) {
      redirect('/management/login');
    }

    return (
      <main className="min-h-dvh bg-canvas text-primary">
        <ManagementHeader
          userName={session.user.name}
          userRole={session.user.role}
        />
        <div className="grid min-h-[calc(100dvh-65px)] place-items-center p-4">
          <ErrorState
            title="Rapport local indisponible"
            description="Impossible de lire les commandes et paiements locaux. Vérifiez le site-agent, PostgreSQL et sa configuration Europe/Paris, puis réessayez."
            action={
              <div className="flex flex-wrap justify-center gap-2">
                <ReportsRefreshButton label="Réessayer" />
                <Button asChild variant="secondary" className="min-h-11">
                  <Link href="/management">Retour à la gestion</Link>
                </Button>
              </div>
            }
          />
        </div>
      </main>
    );
  }
}

function positivePage(value: string | undefined): number {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : 1;
}
