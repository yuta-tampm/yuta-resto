import { Card, Panel, Skeleton } from '@yuta/ui';

export function AccessAuditLoading() {
  return (
    <Panel
      title="Historique des accès"
      description="Chargement de l'historique sécurisé…"
      bodyClassName="gap-4 p-4"
      aria-busy="true"
      aria-live="polite"
    >
      <span className="sr-only">Chargement de l'historique des accès</span>
      <Skeleton className="h-12 w-full" />
      <div className="grid gap-3">
        {[0, 1, 2].map((item) => (
          <Card key={item} padding="sm" className="grid gap-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </Card>
        ))}
      </div>
    </Panel>
  );
}
