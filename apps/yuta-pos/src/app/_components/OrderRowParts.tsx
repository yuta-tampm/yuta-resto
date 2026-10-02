import { Badge, Button } from '@yuta/ui';
import { CreditCard, Send, TriangleAlert } from 'lucide-react';
import Link from 'next/link';
import {
  statusBadgeProps,
  statusLabel,
  type OrderRow,
} from '../_lib/orders-home';

export function OrderAllergyBadge() {
  return (
    <Badge tone="danger" variant="solid" size="sm" className="mt-2 gap-1">
      <TriangleAlert className="h-3.5 w-3.5" />
      Allergie
    </Badge>
  );
}

export function StatusBadge({ status }: { status: string }) {
  return <Badge {...statusBadgeProps(status)}>{statusLabel(status)}</Badge>;
}

export function renderPrimaryOrderAction(order: OrderRow) {
  if (order.status === 'paid' || order.status === 'cancelled') {
    return null;
  }

  if (order.status === 'draft') {
    return (
      <Button asChild variant="primary" size="sm" className="min-h-11">
        <Link href={`/orders/${order.id}`}>
          <Send className="h-4 w-4" />
          Envoyer
        </Link>
      </Button>
    );
  }

  return (
    <Button asChild variant="primary" size="sm" className="min-h-11">
      <Link href={`/orders/${order.id}/payment`}>
        <CreditCard className="h-4 w-4" />
        Payer
      </Link>
    </Button>
  );
}
