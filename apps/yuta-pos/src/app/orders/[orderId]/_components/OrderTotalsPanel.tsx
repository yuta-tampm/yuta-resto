import { formatEuros } from '@yuta/core';
import { Card, Separator, cn } from '@yuta/ui';
import { ChevronRight } from 'lucide-react';

type OrderDiscount = {
  id: string;
  nameSnapshot: string;
  discountCents: number;
  items: Array<{
    quantityApplied: number;
    orderItem: {
      id: string;
      itemNameSnapshot: string;
    };
  }>;
};

type OrderTotalsPanelProps = {
  subtotalCents: number;
  discountCents: number;
  totalCents: number;
  discounts: OrderDiscount[];
  className?: string;
};

export function OrderTotalsPanel({
  subtotalCents,
  discountCents,
  totalCents,
  discounts,
  className,
}: OrderTotalsPanelProps) {
  const hasDiscountDetail = discountCents > 0 && discounts.length > 0;

  return (
    <Card padding="none" className={cn('rounded-lg shadow-none', className)}>
      <div className="grid p-4">
        <AmountRow label="Sous-total" value={subtotalCents} />
        {hasDiscountDetail ? (
          <details className="group border-b border-border-default">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 rounded-md py-2 text-sm outline-none transition-colors hover:bg-surface-muted focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 [&::-webkit-details-marker]:hidden">
              <span className="inline-flex items-center gap-1.5 font-semibold text-primary/60">
                Remise
                <ChevronRight className="h-4 w-4 transition-transform group-open:rotate-90" />
              </span>
              <Amount value={-discountCents} />
            </summary>
            <ul
              className="grid gap-2 pb-3 pl-3"
              aria-label="Détail des remises"
            >
              {discounts.map((discount) => (
                <li
                  key={discount.id}
                  className="flex items-start justify-between gap-3 text-sm"
                >
                  <div className="min-w-0">
                    <p className="font-black">{discount.nameSnapshot}</p>
                    {discount.items.length > 0 && (
                      <p className="mt-0.5 text-xs font-semibold leading-5 text-primary/55">
                        {formatDiscountItems(discount.items)}
                      </p>
                    )}
                  </div>
                  <Amount value={-discount.discountCents} />
                </li>
              ))}
            </ul>
          </details>
        ) : (
          <AmountRow label="Remise" value={-discountCents} />
        )}
        <div className="flex items-center justify-between gap-3 pt-3">
          <span className="text-lg font-black">Total</span>
          <span className="text-xl font-black text-status-success">
            {formatEuros(totalCents)}
          </span>
        </div>
      </div>
    </Card>
  );
}

function AmountRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex min-h-11 items-center justify-between gap-3 border-b border-border-default py-2 text-sm">
      <span className="font-semibold text-primary/60">{label}</span>
      <Amount value={value} />
    </div>
  );
}

function Amount({ value }: { value: number }) {
  return (
    <span className="shrink-0 font-black">
      {value < 0 ? '-' : ''}
      {formatEuros(Math.abs(value))}
    </span>
  );
}

function formatDiscountItems(items: OrderDiscount['items']): string {
  return items
    .map(
      (item) => `${item.quantityApplied} × ${item.orderItem.itemNameSnapshot}`,
    )
    .join(' + ');
}
