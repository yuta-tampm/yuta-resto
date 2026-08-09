import { Button, ErrorState, IconTile, PageHeader } from '@yuta/ui';
import { ArrowLeft, Printer } from 'lucide-react';
import Link from 'next/link';
import { siteAgentClient } from '../../../lib/site-agent-client';
import { requireLocalManagementCredentials } from '../../../server/local-management-session';
import { PrintingManagement } from './PrintingManagement';
import { PrintingAutoRefresh } from './PrintingAutoRefresh';

export default async function LocalPrintingManagementPage() {
  const { token } = await requireLocalManagementCredentials();

  let jobs;
  let settings;
  let printerStatus;
  try {
    const [jobsResponse, settingsResponse, printerStatusResponse] =
      await Promise.all([
        siteAgentClient.listPrintJobs(token, { limit: 100 }),
        siteAgentClient.getPrintSettings(token),
        siteAgentClient.getPrinterStatus(),
      ]);
    jobs = jobsResponse.printJobs;
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
      <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-6 md:px-8">
        <PageHeader
          eyebrow="Gestion locale"
          title="File d’impression"
          description="Suivez les tickets internes Cuisine et BAR stockés dans la base POS locale."
          media={
            <IconTile tone="neutral">
              <Printer className="h-5 w-5" />
            </IconTile>
          }
          actions={
            <Button asChild variant="secondary">
              <Link href="/management">
                <ArrowLeft className="h-4 w-4" />
                Retour
              </Link>
            </Button>
          }
        />
        <PrintingAutoRefresh />
        <PrintingManagement
          jobs={jobs}
          settings={settings}
          printerStatus={printerStatus}
        />
      </div>
    </main>
  );
}
