import { Card, Skeleton } from '@yuta/ui';

export default function SalariesLoading() {
  return (
    <div
      className="grid gap-5"
      aria-busy="true"
      aria-label="Chargement des salariés"
    >
      <div className="grid gap-2">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <Card key={item} className="grid gap-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-8 w-16" />
          </Card>
        ))}
      </div>
      <Card className="grid gap-4">
        {[0, 1, 2, 3].map((item) => (
          <Skeleton key={item} className="h-12 w-full" />
        ))}
      </Card>
    </div>
  );
}
