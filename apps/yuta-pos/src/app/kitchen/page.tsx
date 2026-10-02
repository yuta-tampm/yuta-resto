import { Badge, Card } from '@yuta/ui';
import { ChefHat, Wifi } from 'lucide-react';
import { PosPageShell } from '../../components/pos/PosPageShell';
import { KitchenAutoRefresh } from './_components/KitchenAutoRefresh';
import { KitchenFilters } from './_components/KitchenFilters';
import { KitchenTickets } from './_components/KitchenTickets';
import {
  kitchenQueueLimit,
  parseKitchenQueue,
  parseKitchenScreen,
} from './_lib/kitchen-view';
import { posApi } from '../../lib/pos-api';

type KitchenPageProps = {
  searchParams: Promise<{
    station?: string;
    status?: string;
  }>;
};

export default async function KitchenPage({ searchParams }: KitchenPageProps) {
  const { station, status } = await searchParams;
  const selectedScreen = parseKitchenScreen(station);
  const selectedQueue = parseKitchenQueue(status);
  const response = await posApi.listKitchenQueue({
    screen: selectedScreen,
    queue: selectedQueue,
    limit: kitchenQueueLimit,
  });
  const groups = response.tickets.map((ticket) => ({
    ...ticket,
    items: ticket.items.map((item) => ({ ...item, order: ticket.order })),
  }));
  const stationCounts = response.counts.stations;
  const queueCounts = response.counts.queues;
  const visibleOrderCount = queueCounts[selectedQueue];

  return (
    <PosPageShell
      title="Cuisine"
      description="Suivi des préparations du service"
      contentClassName="overflow-hidden pb-3"
      actions={
        <>
          <Badge
            variant="outline"
            className="hidden border-white/25 text-white md:flex"
          >
            {visibleOrderCount} commande(s)
          </Badge>
        </>
      }
      subHeader={
        <KitchenFilters
          queueCounts={queueCounts}
          selectedQueue={selectedQueue}
          selectedScreen={selectedScreen}
          stationCounts={stationCounts}
          liveUpdatesControl={
            <KitchenAutoRefresh selectedScreen={selectedScreen} />
          }
        />
      }
    >
      <div className="flex h-full min-h-0 flex-col gap-3">
        {groups.length === 0 ? (
          <Card className="grid min-h-0 flex-1 place-items-center text-center shadow-none">
            <div>
              <ChefHat className="mx-auto h-10 w-10 text-primary/35" />
              <h2 className="mt-4 text-lg font-black">Aucun article</h2>
              <p className="mt-1 text-sm font-semibold text-primary/55">
                Rien à afficher pour ce poste et ce statut.
              </p>
            </div>
          </Card>
        ) : (
          <KitchenTickets groups={groups} selectedScreen={selectedScreen} />
        )}

        <footer className="flex shrink-0 flex-wrap items-center justify-between gap-3 rounded-lg border border-border-default bg-white px-4 py-2 text-xs font-bold text-primary/55">
          <span>Dernière mise à jour : {formatTime(new Date())}</span>
          <span className="inline-flex items-center gap-1 text-primary">
            <Wifi className="h-3.5 w-3.5 text-status-success" />
            Connecté
          </span>
        </footer>
      </div>
    </PosPageShell>
  );
}

function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(date);
}
