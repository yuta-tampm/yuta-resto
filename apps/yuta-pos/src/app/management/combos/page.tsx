import { Button, ErrorState, IconTile, PageHeader } from '@yuta/ui';
import { ArrowLeft, Layers3 } from 'lucide-react';
import Link from 'next/link';
import { siteAgentClient } from '../../../lib/site-agent-client';
import { requireLocalManagementSession } from '../../../server/local-management-session';
import { ManagementHeader } from '../_components/ManagementHeader';
import { ComboManagement } from './ComboManagement';
import { CreateComboRuleButton } from './ComboRuleDialogs';

export default async function LocalComboManagementPage() {
  const session = await requireLocalManagementSession();

  let catalog;
  try {
    catalog = await siteAgentClient.getCatalog();
  } catch {
    return (
      <main className="grid min-h-dvh place-items-center bg-canvas p-4">
        <ErrorState
          title="Site-agent indisponible"
          description="Impossible de charger les formules POS locales."
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
      <div className="mx-auto grid w-full max-w-7xl gap-3 px-4 py-4 md:px-6">
        <Link
          href="/management"
          className="inline-flex min-h-11 w-fit items-center gap-2 text-sm font-semibold text-status-success hover:underline focus:outline-none focus:ring-2 focus:ring-focus-ring focus:ring-offset-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à la gestion
        </Link>
        <PageHeader
          title="Formules et combos"
          description="Configurez les groupes éligibles, les suppléments, la priorité et le mode de prix."
          media={
            <IconTile tone="info">
              <Layers3 className="h-5 w-5" />
            </IconTile>
          }
          actions={<CreateComboRuleButton />}
        />
        <ComboManagement
          comboRules={catalog.comboRules}
          catalogItems={catalog.categories.flatMap(
            (category) => category.items,
          )}
        />
      </div>
    </main>
  );
}
