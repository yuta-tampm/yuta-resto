import { IconTile, PageHeader } from '@yuta/ui';
import { ListChecks } from 'lucide-react';
import { requireLocalManagementSession } from '../../server/local-management-session';
import { ManagementHeader } from './_components/ManagementHeader';
import { ManagementModules } from './_components/ManagementModules';

export default async function ManagementHomePage() {
  const session = await requireLocalManagementSession();

  return (
    <main className="min-h-dvh bg-canvas text-primary">
      <ManagementHeader
        userName={session.user.name}
        userRole={session.user.role}
      />

      <div className="mx-auto grid w-full max-w-7xl content-start gap-4 px-4 py-4 md:px-6">
        <PageHeader
          title="Gestion locale"
          description="Accédez aux paramètres et contenus essentiels de votre POS local."
          media={
            <IconTile tone="brand">
              <ListChecks className="h-5 w-5" />
            </IconTile>
          }
        />

        <ManagementModules />
      </div>
    </main>
  );
}
