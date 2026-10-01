import { Card, Skeleton } from '@yuta/ui';

export default function ReputationLoading() {
  return (
    <div className="flex w-full flex-col gap-5" aria-busy="true">
      <div className="border-b border-border-default pb-5">
        <Skeleton className="h-4 w-44" />
        <Skeleton className="mt-3 h-9 w-64 max-w-full" />
        <Skeleton className="mt-3 h-4 w-80 max-w-full" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <Card key={index} padding="lg">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-4 h-8 w-14" />
            <Skeleton className="mt-3 h-4 w-40 max-w-full" />
          </Card>
        ))}
      </div>

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(420px,0.85fr)]">
        <Card padding="none" className="overflow-hidden">
          <div className="border-b border-border-default p-4">
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="grid gap-3 p-4">
            {Array.from({ length: 5 }, (_, index) => (
              <Skeleton key={index} className="h-20 w-full" />
            ))}
          </div>
        </Card>
        <Card className="min-h-96">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="mt-4 h-24 w-full" />
          <Skeleton className="mt-4 h-40 w-full" />
        </Card>
      </div>
    </div>
  );
}
