import { formatEuros } from '@yuta/core';
import { Badge, Card, Separator } from '@yuta/ui';
import { Tags, TriangleAlert } from 'lucide-react';
import { allergySummaryFromSnapshots } from '../../../../_pos-helpers';
import {
  formatDiscountItems,
  type PaymentViewOrder,
} from '../_lib/payment-view';
import { AmountRow } from './AmountRow';

type PaymentSummaryCardProps = {
  order: PaymentViewOrder;
  activeOrderItems: PaymentViewOrder['items'];
  cancelledOrderItems: PaymentViewOrder['items'];
  paidCents: number;
  remainingCents: number;
};

export function PaymentSummaryCard({
  order,
  activeOrderItems,
  cancelledOrderItems,
  paidCents,
  remainingCents,
}: PaymentSummaryCardProps) {
  return (
    <Card className="rounded-lg p-0">
      <div className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold">Récapitulatif</h2>
            <p className="mt-1 text-sm text-primary/55">
              Les combos sont calculés au paiement.
            </p>
          </div>
          {order.discountCents > 0 ? (
            <Badge tone="success" variant="soft" className="gap-1">
              <Tags className="h-3.5 w-3.5" />
              Combo actif
            </Badge>
          ) : (
            <Badge variant="outline">Aucune remise</Badge>
          )}
        </div>
      </div>
      <Separator />
      <div className="grid gap-3 p-5">
        {activeOrderItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-3"
          >
            <div>
              <p className="font-semibold">
                {item.quantity} x {item.itemNameSnapshot}
              </p>
              {item.note && (
                <p className="mt-1 text-xs font-semibold text-primary/55">
                  Note: {item.note}
                </p>
              )}
              {item.quickInstructions.length > 0 && (
                <p className="mt-1 text-xs font-black text-status-info">
                  {item.quickInstructions
                    .map((instruction) => instruction.labelSnapshot)
                    .join(' · ')}
                </p>
              )}
              {item.selectedVariants.length > 0 && (
                <p className="mt-1 text-xs font-black text-primary/65">
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
            <p className="font-bold">
              {formatEuros(item.unitPriceCentsSnapshot * item.quantity)}
            </p>
          </div>
        ))}
        {cancelledOrderItems.length > 0 && (
          <div className="mt-2 grid gap-2 rounded-lg border border-border-default bg-canvas p-3">
            <p className="text-xs font-black uppercase text-primary/45">
              Articles annulés
            </p>
            {cancelledOrderItems.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between gap-3 text-primary/55"
              >
                <div>
                  <p className="font-semibold line-through">
                    {item.quantity} x {item.itemNameSnapshot}
                  </p>
                  <p className="mt-0.5 text-xs font-bold">
                    Annulé - non facturé
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold line-through">
                    {formatEuros(item.unitPriceCentsSnapshot * item.quantity)}
                  </p>
                  <p className="mt-0.5 text-xs font-black">0,00 €</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {order.discounts.length > 0 && (
        <>
          <Separator />
          <div className="grid gap-3 bg-surface-muted p-5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="inline-flex items-center gap-2 text-sm font-black text-primary">
                <Tags className="h-4 w-4" />
                Remises combos
              </h3>
              <span className="text-sm font-black text-primary">
                -{formatEuros(order.discountCents)}
              </span>
            </div>
            {order.discounts.map((discount) => (
              <div
                key={discount.id}
                className="rounded-lg border border-border-default bg-white px-3 py-2"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{discount.nameSnapshot}</p>
                    <p className="mt-1 text-xs font-semibold text-primary/55">
                      {formatDiscountItems(discount.items)}
                    </p>
                  </div>
                  <p className="font-black">
                    -{formatEuros(discount.discountCents)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <Separator />
      <div className="grid gap-2 p-5">
        <AmountRow label="Sous-total articles" value={order.subtotalCents} />
        <AmountRow label="Remises combos" value={-order.discountCents} />
        <div className="flex items-center justify-between gap-3 rounded-lg border border-border-default bg-canvas px-3 py-2">
          <span className="font-black">Total après combos</span>
          <span className="text-lg font-black">
            {formatEuros(order.totalCents)}
          </span>
        </div>
        <AmountRow label="Déjà payé" value={paidCents} />
        <div className="mt-2 flex items-center justify-between border-t border-border-default pt-4">
          <span className="text-lg font-black">Reste à payer</span>
          <span className="text-2xl font-black">
            {formatEuros(remainingCents)}
          </span>
        </div>
      </div>
    </Card>
  );
}
