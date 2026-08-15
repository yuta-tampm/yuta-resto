import { Button, ErrorState, IconTile, PageHeader } from '@yuta/ui';
import { ArrowLeft, Users } from 'lucide-react';
import Link from 'next/link';
import { siteAgentClient } from '../../../lib/site-agent-client';
import { requireLocalManagementSession } from '../../../server/local-management-session';
import { ManagementHeader } from '../_components/ManagementHeader';
import { CreateUserDialog } from './_components/UserDialogs';
import { UsersManagement } from './_components/UsersManagement';

export default async function LocalUsersManagementPage() {
  const session = await requireLocalManagementSession();

  let users;
  try {
    users = (await siteAgentClient.listLocalUsers()).users;
  } catch {
    return (
      <main className="grid min-h-dvh place-items-center bg-canvas p-4">
        <ErrorState
          title="Site-agent indisponible"
          description="Impossible de charger les utilisateurs POS locaux."
          action={
            <div className="flex flex-wrap justify-center gap-2">
              <Button asChild>
                <Link href="/management/users">Réessayer</Link>
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
          title="Équipe POS"
          description="Gérez les utilisateurs, les rôles, les PIN et l’accès au terminal."
          className="[&>div:last-child]:w-full sm:[&>div:last-child]:w-auto"
          media={
            <IconTile tone="brand">
              <Users className="h-5 w-5" />
            </IconTile>
          }
          actions={<CreateUserDialog actorRole={session.user.role} />}
        />
        <UsersManagement users={users} actorRole={session.user.role} />
      </div>
    </main>
  );
}
