import { Button, ErrorState, IconTile, PageHeader } from '@yuta/ui';
import { ArrowLeft, Printer } from 'lucide-react';
import Link from 'next/link';
import { siteAgentClient } from '../../../lib/site-agent-client';
import { requireLocalManagementCredentials } from '../../../server/local-management-session';
import { ManagementHeader } from '../_components/ManagementHeader';
import { PrintingAutoRefresh } from './_components/PrintingAutoRefresh';
import { PrintingManagement } from './_components/PrintingManagement';

type LocalPrintingManagementPageProps = {
  searchParams: Promise<{ page?: string }>;
};

const printJobsPageSize = 10;

export default async function LocalPrintingManagementPage({
  searchParams,
}: LocalPrintingManagementPageProps) {
  const { session, token } = await requireLocalManagementCredentials();
  const requestedPage = positivePage((await searchParams).page);

  let jobs;
  let summary;
  let pagination;
  let settings;
  let printerStatus;
  try {
    const [jobsResponse, settingsResponse, printerStatusResponse] =
      await Promise.all([
        siteAgentClient.listPrintJobs(token, {
          page: requestedPage,
          limit: printJobsPageSize,
        }),
        siteAgentClient.getPrintSettings(token),
        siteAgentClient.getPrinterStatus(),
      ]);
    jobs = jobsResponse.printJobs;
    summary = jobsResponse.summary;
    pagination = jobsResponse.pagination;
    settings = settingsResponse;
    printerStatus = printerStatusResponse;
  } catch {
    return (
      <main className="grid min-h-dvh place-items-center bg-canvas p-4">
        <ErrorState
          title="Site-agent indisponible"
          description="Impossible de charger la file d’impression locale."
          action={
            <Button asChild variant="secondary">
              <Link href="/management">Retour à la gestion</Link>
            </Button>
          }
        />
      </main>
    );
  }

  return (
    <main className="min-h-dvh bg-canvas text-primary">
      <ManagementHeader
        userName={session.user.name}
        userRole={session.user.role}
      />

      <div className="grid w-full gap-3 px-4 py-4 md:px-6">
        <Link
          href="/management"
          className="inline-flex min-h-11 w-fit items-center gap-2 text-sm font-semibold text-status-success hover:underline focus:outline-none focus:ring-2 focus:ring-focus-ring focus:ring-offset-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à la gestion
        </Link>
        <PageHeader
          eyebrow="Gestion locale"
          title="File d’impression"
          description="Suivez les tickets internes Cuisine et BAR stockés dans la base POS locale."
          media={
            <IconTile tone="neutral">
              <Printer className="h-5 w-5" />
            </IconTile>
          }
        />
        <PrintingAutoRefresh />
        <PrintingManagement
          jobs={jobs}
          summary={summary}
          pagination={pagination}
          settings={settings}
          printerStatus={printerStatus}
        />
      </div>
    </main>
  );
}

function positivePage(value: string | undefined): number {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : 1;
}
