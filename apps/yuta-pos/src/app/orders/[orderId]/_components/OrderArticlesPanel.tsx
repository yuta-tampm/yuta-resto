import { formatEuros } from '@yuta/core';
import { Badge, Card, Separator, cn } from '@yuta/ui';
import { TriangleAlert } from 'lucide-react';
import { allergySummaryFromSnapshots } from '../../../_pos-helpers';
import type { OrderDetail } from '../_lib/order-detail-presentation';

export function OrderArticlesPanel({ items }: { items: OrderDetail['items'] }) {
  return (
    <Card padding="none" className="rounded-lg shadow-none">
      <div className="p-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-black">Articles</h3>
          <Badge tone="success" variant="soft" size="sm">
            {items.length}
          </Badge>
        </div>
      </div>
      <Separator />
      <div className="grid px-4">
        {items.length === 0 ? (
          <p className="rounded-lg bg-canvas p-3 text-sm font-semibold text-primary/55">
            Aucun article pour le moment.
          </p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className={cn(
                'grid min-h-12 grid-cols-[24px_minmax(0,1fr)_auto] items-start gap-3 border-b border-border-default py-3 text-sm last:border-b-0',
                item.status === 'cancelled' && 'opacity-60',
              )}
            >
              <span className="font-black">{item.quantity}</span>
              <div className="min-w-0">
                <p className="truncate font-black">{item.itemNameSnapshot}</p>
                {item.note && (
                  <p className="mt-1 text-xs font-semibold text-primary/55">
                    Note: {item.note}
                  </p>
                )}
                {item.quickInstructions.length > 0 && (
                  <p className="mt-1 text-sm font-black text-status-info">
                    {item.quickInstructions
                      .map((instruction) => instruction.labelSnapshot)
                      .join(' · ')}
                  </p>
                )}
                {item.selectedVariants.length > 0 && (
                  <p className="mt-1 text-sm font-black text-primary/65">
                    Options:{' '}
                    {item.selectedVariants
                      .map(
                        (variant) =>
                          `${variant.quantity}× ${variant.labelSnapshot}`,
                      )
                      .join(' · ')}
                  </p>
                )}
                {item.hasAllergy && (
                  <p className="mt-1 inline-flex items-start gap-1 rounded-md bg-status-danger-soft px-2 py-1 text-xs font-black text-status-danger">
                    <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    {allergySummaryFromSnapshots(
                      item.selectedAllergens,
                      item.allergySeverity,
                      item.allergyNote,
                    )}
                  </p>
                )}
              </div>
              <span className="font-black">
                {formatEuros(item.unitPriceCentsSnapshot * item.quantity)}
              </span>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
