import { Button, Input, SegmentedNav } from '@yuta/ui';
import { Search } from 'lucide-react';
import Link from 'next/link';
import type { PosOrdersHomeResponse } from '../../lib/pos-api';
import { homeUrl, views, type OrderView } from '../_lib/orders-home';

export function OrdersHomeToolbar({
  selectedView,
  searchQuery,
  counts,
}: {
  selectedView: OrderView;
  searchQuery: string;
  counts: PosOrdersHomeResponse['counts'];
}) {
  return (
    <div className="grid w-full gap-4 px-4 py-4">
      <div className="flex items-center gap-3">
        <SegmentedNav className="[scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {views.map((item) => (
            <Button
              key={item.value}
              asChild
              variant={item.value === selectedView ? 'primary' : 'secondary'}
              className="min-h-11 shrink-0 px-3 text-xs sm:px-4 sm:text-sm"
            >
              <Link href={homeUrl(item.value, searchQuery)}>
                <span className="sm:hidden">{item.shortLabel}</span>
                <span className="hidden sm:inline">{item.label}</span>
                {item.value !== 'all_today' && (
                  <span className="rounded-full bg-surface-muted px-1.5 py-0.5 text-[10px] font-black text-primary">
                    {item.value === 'open' ? counts.open : counts.paidToday}
                  </span>
                )}
              </Link>
            </Button>
          ))}
        </SegmentedNav>
      </div>

      <form action="/" className="flex gap-3">
        <input type="hidden" name="view" value={selectedView} />
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary/45" />
          <Input
            name="q"
            defaultValue={searchQuery}
            placeholder="Rechercher (table, n commande...)"
            className="min-h-11 pl-10"
          />
        </div>
        <Button
          type="submit"
          variant="secondary"
          aria-label="Rechercher"
          className="min-h-11 shrink-0"
        >
          <Search className="h-4 w-4" />
          <span className="hidden xl:inline">Rechercher</span>
        </Button>
      </form>
    </div>
  );
}
