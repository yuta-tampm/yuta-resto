import { Button } from '@yuta/ui';
import { Plus, ReceiptText } from 'lucide-react';
import Link from 'next/link';

export function EmptyOrders() {
  return (
    <div className="grid min-h-[60vh] place-items-center text-center">
      <div>
        <ReceiptText className="mx-auto h-10 w-10 text-primary/35" />
        <h2 className="mt-4 text-lg font-bold">Aucune commande</h2>
        <p className="mt-1 text-sm text-primary/55">
          Cette vue est vide pour le moment.
        </p>
        <Button asChild variant="primary" className="mt-4 min-h-11">
          <Link href="/pos">
            <Plus className="h-4 w-4" />
            Nouvelle commande
          </Link>
        </Button>
      </div>
    </div>
  );
}
