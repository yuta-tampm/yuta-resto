import { Button, cn } from '@yuta/ui';
import { Check, CreditCard, Lock, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { v7 as uuidv7 } from 'uuid';
import { cancelOrderAction } from '../../../actions';
import { allergySummaryFromSnapshots } from '../../../_pos-helpers';
import { SendToKitchenButton } from '../../_components/SendToKitchenButton';
import type { OrderDetail } from '../_lib/order-detail-presentation';

export function OrderSendButton({
  order,
  disabled,
  className,
  fullWidth = true,
  label = 'Envoyer',
  completed = false,
  variant = 'secondary',
}: {
  order: OrderDetail;
  disabled: boolean;
  className?: string;
  fullWidth?: boolean;
  label?: string;
  completed?: boolean;
  variant?: 'primary' | 'secondary';
}) {
  if (completed && disabled) {
    return (
      <Button
        variant="secondary"
        disabled
        className={cn(
          fullWidth && 'w-full',
          className,
          'disabled:!border-border-default disabled:!bg-neutral-200 disabled:!text-muted disabled:opacity-100',
        )}
      >
        <Check className="h-4 w-4" />
        Envoyé en cuisine
      </Button>
    );
  }

  return (
    <SendToKitchenButton
      orderId={order.id}
      idempotencyKey={uuidv7()}
      disabled={disabled}
      hasAllergy={order.hasAllergy}
      allergyNote={order.allergyNote}
      allergyAcknowledged={Boolean(order.allergyAcknowledgedAt)}
      itemAllergyWarnings={order.items
        .filter(
          (item) =>
            item.status === 'pending' &&
            item.hasAllergy &&
            !item.allergyAcknowledgedAt,
        )
        .map((item) => ({
          itemName: item.itemNameSnapshot,
          allergyNote: allergySummaryFromSnapshots(
            item.selectedAllergens,
            item.allergySeverity,
            item.allergyNote,
          ),
        }))}
      fullWidth={fullWidth}
      label={label}
      variant={variant}
      className={cn(
        className,
        disabled &&
          'disabled:!border-border-default disabled:!bg-neutral-200 disabled:!text-muted disabled:opacity-100',
      )}
    />
  );
}

export function OrderPaymentButton({
  orderId,
  disabled,
  className,
  fullWidth = true,
  variant = 'primary',
}: {
  orderId: string;
  disabled: boolean;
  className?: string;
  fullWidth?: boolean;
  variant?: 'primary' | 'secondary';
}) {
  if (disabled) {
    return (
      <Button
        variant="secondary"
        disabled
        className={cn(
          fullWidth && 'w-full',
          className,
          'disabled:!border-border-default disabled:!bg-neutral-200 disabled:!text-muted disabled:opacity-100',
        )}
      >
        <CreditCard className="h-4 w-4" />
        Payer
      </Button>
    );
  }

  return (
    <Button
      asChild
      variant={variant}
      className={cn(
        fullWidth && 'w-full',
        variant === 'secondary' &&
          'border-status-success-border bg-status-success-soft text-status-success hover:bg-surface-selected',
        className,
      )}
    >
      <Link href={`/orders/${orderId}/payment`}>
        <CreditCard className="h-4 w-4" />
        Payer
      </Link>
    </Button>
  );
}

export function OrderItemEntryButton({
  orderId,
  disabled,
  className,
}: {
  orderId: string;
  disabled: boolean;
  className?: string;
}) {
  if (disabled) {
    return (
      <Button
        variant="secondary"
        disabled
        className={cn(
          'min-h-12 w-full disabled:!border-border-default disabled:!bg-neutral-200 disabled:!text-muted disabled:opacity-100',
          className,
        )}
      >
        <Plus className="h-4 w-4" />
        Ajouter
        <Lock className="ml-auto h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button
      asChild
      variant="secondary"
      className={cn(
        'min-h-12 w-full border-status-success-border bg-status-success-soft text-status-success hover:bg-surface-selected',
        className,
      )}
    >
      <Link href={`/orders/${orderId}/items`}>
        <Plus className="h-4 w-4" />
        Ajouter
      </Link>
    </Button>
  );
}

export function OrderCancelForm({
  orderId,
  disabled,
}: {
  orderId: string;
  disabled: boolean;
}) {
  return (
    <form action={cancelOrderAction}>
      <input type="hidden" name="orderId" value={orderId} />
      <Button
        type="submit"
        variant="danger"
        className="min-h-12 w-full justify-center border border-status-danger bg-white text-action-danger hover:bg-surface-muted"
        disabled={disabled}
      >
        <Trash2 className="h-4 w-4" />
        Annuler la commande
        {disabled && <Lock className="ml-auto h-4 w-4" />}
      </Button>
    </form>
  );
}
