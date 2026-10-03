import { Button } from '@yuta/ui';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { homeUrl, type OrderView } from '../_lib/orders-home';

export function OrdersPagination({
  view,
  searchQuery,
  pagination,
}: {
  view: OrderView;
  searchQuery: string;
  pagination: {
    page: number;
    totalPages: number;
    totalItems: number;
  };
}) {
  return (
    <nav
      aria-label="Pagination des commandes"
      className="mt-4 flex items-center justify-between gap-3 border-t border-border-default pt-4"
    >
      {pagination.page > 1 ? (
        <Button asChild variant="secondary" className="min-h-11">
          <Link href={homeUrl(view, searchQuery, pagination.page - 1)}>
            <ChevronLeft className="h-4 w-4" />
            Précédent
          </Link>
        </Button>
      ) : (
        <Button variant="secondary" className="min-h-11" disabled>
          <ChevronLeft className="h-4 w-4" />
          Précédent
        </Button>
      )}
      <p className="text-center text-sm font-semibold text-primary/65">
        Page {pagination.page} sur {pagination.totalPages} ·{' '}
        {pagination.totalItems} commande(s)
      </p>
      {pagination.page < pagination.totalPages ? (
        <Button asChild variant="secondary" className="min-h-11">
          <Link href={homeUrl(view, searchQuery, pagination.page + 1)}>
            Suivant
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      ) : (
        <Button variant="secondary" className="min-h-11" disabled>
          Suivant
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </nav>
  );
}
