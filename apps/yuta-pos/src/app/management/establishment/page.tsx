import { Button, ErrorState, IconTile, PageHeader } from '@yuta/ui';
import { ArrowLeft, Store } from 'lucide-react';
import Link from 'next/link';
import { siteAgentClient } from '../../../lib/site-agent-client';
import { requireLocalManagementCredentials } from '../../../server/local-management-session';
import { ManagementHeader } from '../_components/ManagementHeader';
import { EstablishmentProfileForm } from './_components/EstablishmentProfileForm';

export default async function EstablishmentManagementPage() {
  const { session, token } = await requireLocalManagementCredentials();
  let profile;
  try {
    profile = await siteAgentClient.getEstablishmentProfile(token);
  } catch {
    return (
      <main className="grid min-h-dvh place-items-center bg-canvas p-4">
        <ErrorState
          title="Profil local indisponible"
          description="Impossible de charger l’identité locale de cet établissement."
          action={
            <Button asChild variant="secondary">
              <Link href="/management/establishment">Réessayer</Link>
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
          title="Établissement"
          description="Configurez le nom affiché localement sur les futurs reçus de paiement non fiscaux."
          media={
            <IconTile tone="neutral">
              <Store className="h-5 w-5" />
            </IconTile>
          }
        />

        <EstablishmentProfileForm profile={profile} />
      </div>
    </main>
  );
}
