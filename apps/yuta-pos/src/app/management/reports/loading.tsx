import { Skeleton } from '@yuta/ui';

export default function ManagementReportsLoading() {
  return (
    <main
      className="min-h-dvh bg-canvas text-primary"
      aria-busy="true"
      aria-label="Chargement des rapports locaux"
    >
      <div className="h-16 border-b border-primary bg-primary" />
      <div className="grid gap-3 px-4 py-4 md:px-6">
        <Skeleton className="h-11 w-44" />
        <Skeleton className="h-28 w-full" />
        <div className="grid gap-3 md:grid-cols-3">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
        <Skeleton className="h-80 w-full" />
      </div>
      <p className="sr-only" role="status">
        Chargement des rapports locaux…
      </p>
    </main>
  );
}
