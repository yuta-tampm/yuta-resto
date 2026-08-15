import { Button, ErrorState, IconTile, PageHeader } from '@yuta/ui';
import { ArrowLeft, Utensils } from 'lucide-react';
import Link from 'next/link';
import { siteAgentClient } from '../../../lib/site-agent-client';
import { requireLocalManagementSession } from '../../../server/local-management-session';
import { ManagementHeader } from '../_components/ManagementHeader';
import { CatalogManagement } from './_components/CatalogManagement';

export default async function LocalCatalogManagementPage() {
  const session = await requireLocalManagementSession();

  let catalog;
  try {
    catalog = await siteAgentClient.getCatalog();
  } catch {
    return (
      <main className="grid min-h-dvh place-items-center bg-canvas p-4">
        <ErrorState
          title="Site-agent indisponible"
          description="Impossible de charger le catalogue POS local."
          action={
            <div className="flex flex-wrap justify-center gap-2">
              <Button asChild>
                <Link href="/management/catalog">Réessayer</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/management">Retour à la gestion</Link>
              </Button>
            </div>
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
      <div className="mx-auto grid w-full max-w-7xl gap-3 px-4 py-4 md:px-6">
        <Link
          href="/management"
          className="inline-flex min-h-11 w-fit items-center gap-2 text-sm font-semibold text-status-success hover:underline focus:outline-none focus:ring-2 focus:ring-focus-ring focus:ring-offset-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à la gestion
        </Link>
        <PageHeader
          title="Menu et catégories"
          description="Gérez les prix, la disponibilité, l’ordre d’affichage et les postes de préparation."
          media={
            <IconTile tone="success">
              <Utensils className="h-5 w-5" />
            </IconTile>
          }
        />
        <CatalogManagement
          categories={catalog.categories}
          instructionSettings={catalog.instructionSettings}
        />
      </div>
    </main>
  );
}
