'use client';

import type { LocalManagementReportsResponse } from '@yuta/contracts/local-pos';
import { Button } from '@yuta/ui';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

const activityFocusKey = 'yuta-pos-reports-focus-activity';

export function ReportsPagination({
  pagination,
}: {
  pagination: LocalManagementReportsResponse['pagination'];
}) {
  useEffect(() => {
    if (window.sessionStorage.getItem(activityFocusKey) !== 'true') return;

    window.sessionStorage.removeItem(activityFocusKey);
    window.requestAnimationFrame(() => {
      document.getElementById('reports-orders-title')?.focus();
    });
  }, [pagination.page]);

  function preserveActivityFocus() {
    window.sessionStorage.setItem(activityFocusKey, 'true');
  }

  return (
    <nav
      aria-label="Pagination des commandes du rapport"
      className="flex items-center justify-between gap-3 border-t border-border-default pt-3"
    >
      {pagination.page > 1 ? (
        <Button asChild variant="secondary" className="min-h-11">
          <Link
            href={reportUrl(pagination.page - 1)}
            onClick={preserveActivityFocus}
          >
            <ChevronLeft className="h-4 w-4" />
            Précédent
          </Link>
        </Button>
      ) : (
        <Button disabled variant="secondary" className="min-h-11">
          <ChevronLeft className="h-4 w-4" />
          Précédent
        </Button>
      )}
      <p className="text-center text-sm font-semibold text-secondary">
        Page {pagination.page} sur {pagination.totalPages} ·{' '}
        {pagination.totalItems} commande(s)
      </p>
      {pagination.page < pagination.totalPages ? (
        <Button asChild variant="secondary" className="min-h-11">
          <Link
            href={reportUrl(pagination.page + 1)}
            onClick={preserveActivityFocus}
          >
            Suivant
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      ) : (
        <Button disabled variant="secondary" className="min-h-11">
          Suivant
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </nav>
  );
}

function reportUrl(page: number): string {
  return page > 1 ? `/management/reports?page=${page}` : '/management/reports';
}
