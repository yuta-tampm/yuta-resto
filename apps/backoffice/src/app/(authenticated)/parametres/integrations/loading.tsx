import { Card, Skeleton } from '@yuta/ui';

export default function IntegrationsLoading() {
  return (
    <div className="flex w-full flex-col gap-6" aria-busy="true">
      <div className="border-b border-border-default pb-5">
        <Skeleton className="h-4 w-44" />
        <Skeleton className="mt-3 h-9 w-56 max-w-full" />
        <Skeleton className="mt-3 h-4 w-80 max-w-full" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <Card className="min-h-64">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="mt-4 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-2/3" />
          <Skeleton className="mt-6 h-10 w-40" />
        </Card>
        <Card className="min-h-64">
          <Skeleton className="h-5 w-52" />
          <Skeleton className="mt-4 h-10 w-full" />
          <Skeleton className="mt-3 h-10 w-full" />
        </Card>
      </div>
    </div>
  );
}
