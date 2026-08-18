import { Card, Skeleton } from '@yuta/ui';

export default function PersonnelRegisterLoading() {
  return (
    <div
      className="grid gap-5"
      aria-busy="true"
      aria-label="Chargement du registre du personnel"
    >
      <div className="grid gap-2">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-9 w-80 max-w-full" />
        <Skeleton className="h-4 w-64 max-w-full" />
      </div>
      <Card className="grid gap-3">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-16 w-full" />
      </Card>
      <Card className="grid gap-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </Card>
    </div>
  );
}
