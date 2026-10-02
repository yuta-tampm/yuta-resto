import { formatEuros } from '@yuta/core';
import { Badge } from '@yuta/ui';
import { Tags } from 'lucide-react';
import { v7 as uuidv7 } from 'uuid';
import { payCheckAction } from '../../../../actions';
import { formatCheckDiscountItems } from '../_lib/payment-view';
import { AmountRow } from './AmountRow';
import { PaymentCaptureForm } from './PaymentCaptureForm';

export function CheckPaymentList({
  checks,
  payments,
  orderId,
}: {
  checks: Array<{
    id: string;
    checkLabel: string;
    splitMode: string;
    status: string;
    subtotalCents: number;
    discountCents: number;
    totalCents: number;
    items: Array<{
      quantity: number;
      amountCentsSnapshot: number;
      orderItem: {
        itemNameSnapshot: string;
        unitPriceCentsSnapshot: number;
      };
    }>;
    discounts: Array<{
      id: string;
      nameSnapshot: string;
      discountCents: number;
      items: Array<{
        quantityApplied: number;
        checkItem: {
          orderItem: {
            itemNameSnapshot: string;
          };
        };
      }>;
    }>;
  }>;
  payments: Array<{
    checkId: string | null;
    amountCents: number;
    status: string;
  }>;
  orderId: string;
}) {
  return (
    <div className="grid gap-3">
      {checks.map((check) => {
        const paidCents = payments
          .filter(
            (payment) =>
              payment.checkId === check.id && payment.status === 'paid',
          )
          .reduce((total, payment) => total + payment.amountCents, 0);
        const remainingCents = Math.max(0, check.totalCents - paidCents);

        return (
          <div
            key={check.id}
            className="rounded-lg border border-border-default bg-canvas p-3"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-bold">{check.checkLabel}</p>
                <p className="text-sm text-primary/55">
                  {check.splitMode === 'equal'
                    ? 'Part égale'
                    : 'Articles assignés'}
                </p>
              </div>
              <Badge
                tone={check.status === 'paid' ? 'success' : 'neutral'}
                variant={check.status === 'paid' ? 'soft' : 'outline'}
              >
                {check.status === 'paid' ? 'Payée' : 'Ouverte'}
              </Badge>
            </div>

            <div className="mt-3 grid gap-2 rounded-lg border border-border-default bg-white p-3">
              {check.items.length > 0 ? (
                <div className="grid gap-1.5">
                  {check.items.map((item) => (
                    <div
                      key={`${check.id}-${item.orderItem.itemNameSnapshot}-${item.quantity}`}
                      className="flex items-center justify-between gap-3 text-sm"
                    >
                      <span className="font-semibold text-primary/70">
                        {item.quantity} x {item.orderItem.itemNameSnapshot}
                      </span>
                      <span className="font-bold">
                        {formatEuros(item.amountCentsSnapshot)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="font-semibold text-primary/70">
                    Part égale
                  </span>
                  <span className="font-bold">
                    {formatEuros(check.subtotalCents)}
                  </span>
                </div>
              )}

              {check.discounts.length > 0 && (
                <div className="grid gap-1.5 rounded-lg bg-surface-muted p-2">
                  <div className="flex items-center justify-between gap-3 text-xs font-black">
                    <span className="inline-flex items-center gap-1">
                      <Tags className="h-3.5 w-3.5" />
                      Combos de ce ticket
                    </span>
                    <span>-{formatEuros(check.discountCents)}</span>
                  </div>
                  {check.discounts.map((discount) => (
                    <div
                      key={discount.id}
                      className="flex items-start justify-between gap-3 rounded-lg bg-white px-2 py-1.5 text-xs"
                    >
                      <div>
                        <p className="font-bold">{discount.nameSnapshot}</p>
                        <p className="mt-0.5 font-semibold text-primary/55">
                          {formatCheckDiscountItems(discount.items)}
                        </p>
                      </div>
                      <span className="font-black">
                        -{formatEuros(discount.discountCents)}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div className="grid gap-1 border-t border-border-default pt-2">
                <AmountRow
                  label="Sous-total ticket"
                  value={check.subtotalCents}
                />
                <AmountRow
                  label="Remises ticket"
                  value={-check.discountCents}
                />
                <AmountRow label="Total ticket" value={check.totalCents} />
                <AmountRow label="Déjà payé" value={paidCents} />
                <div className="flex items-center justify-between gap-3 pt-1">
                  <span className="font-black">Reste ticket</span>
                  <span className="text-lg font-black">
                    {formatEuros(remainingCents)}
                  </span>
                </div>
              </div>
            </div>

            {check.status !== 'paid' && (
              <PaymentCaptureForm
                action={payCheckAction}
                orderId={orderId}
                checkId={check.id}
                remainingCents={remainingCents}
                idempotencyKey={uuidv7()}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
