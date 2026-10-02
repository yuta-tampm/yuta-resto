import type { PosOrderDetail } from '../../../../lib/pos-api';

export type OrderDetail = PosOrderDetail['order'] & {
  items: PosOrderDetail['items'];
  discounts: PosOrderDetail['discounts'];
};

export type OrderProgressEvent = {
  done: boolean;
  highlight: boolean;
  label: string;
  time: string;
};

export function buildOrderProgressEvents(
  order: OrderDetail,
): OrderProgressEvent[] {
  const sentAt =
    order.sentAt ??
    firstItemDate(order, ['sent', 'preparing', 'ready', 'served']);
  const preparingAt = firstItemDate(order, ['preparing', 'ready', 'served']);
  const readyAt = firstItemReadyDate(order);
  const servedAt = firstItemServedDate(order);
  const hasActiveItems = activeItemCount(order) > 0;

  return [
    {
      done: true,
      highlight: false,
      label: 'Commande créée',
      time: formatOrderTime(order.createdAt),
    },
    {
      done: Boolean(sentAt),
      highlight: true,
      label: 'Commande envoyée en cuisine',
      time: sentAt ? formatOrderTime(sentAt) : '-',
    },
    {
      done: Boolean(preparingAt),
      highlight: order.status === 'preparing',
      label: preparingAt ? 'Préparation en cours' : 'En attente de préparation',
      time: preparingAt ? formatOrderTime(preparingAt) : '-',
    },
    {
      done: Boolean(readyAt),
      highlight: order.status === 'ready',
      label: 'Prête',
      time: readyAt ? formatOrderTime(readyAt) : '-',
    },
    {
      done: Boolean(servedAt),
      highlight: order.status === 'served',
      label: 'Servie',
      time: servedAt ? formatOrderTime(servedAt) : '-',
    },
    {
      done: Boolean(order.paidAt),
      highlight: order.status === 'paid',
      label: 'Payée',
      time: order.paidAt ? formatOrderTime(order.paidAt) : '-',
    },
    {
      done: Boolean(order.cancelledAt),
      highlight: order.status === 'cancelled',
      label:
        order.status === 'cancelled' || !hasActiveItems
          ? 'Annulée'
          : 'Annulation partielle',
      time: order.cancelledAt
        ? formatOrderTime(order.cancelledAt)
        : firstItemCancelledTime(order),
    },
  ].filter(
    (event) => event.done || isNextOrderProgressEvent(event.label, order),
  );
}

export function activeItemCount(order: OrderDetail): number {
  return order.items.filter((item) => item.status !== 'cancelled').length;
}

export function statusLabel(status: string): string {
  const labels: Record<string, string> = {
    draft: 'Non envoyée',
    sent: 'Envoyée',
    preparing: 'En préparation',
    ready: 'Prête',
    served: 'Servie',
    paid: 'Payée',
    cancelled: 'Annulée',
  };

  return labels[status] ?? status;
}

export function statusBadgeProps(status: string) {
  if (status === 'sent' || status === 'ready') {
    return { tone: 'success', variant: 'soft' } as const;
  }

  if (status === 'preparing') {
    return { tone: 'info', variant: 'soft' } as const;
  }

  if (status === 'draft') {
    return { tone: 'warning', variant: 'soft' } as const;
  }

  if (status === 'paid') {
    return { tone: 'neutral', variant: 'soft' } as const;
  }

  if (status === 'cancelled') {
    return { tone: 'danger', variant: 'solid' } as const;
  }

  return { tone: 'neutral', variant: 'outline' } as const;
}

export function orderTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    dine_in: 'Sur place',
    takeaway: 'À emporter',
    delivery: 'Livraison',
  };

  return labels[type] ?? type;
}

export function formatOrderTime(date: Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function isNextOrderProgressEvent(label: string, order: OrderDetail): boolean {
  if (order.status === 'cancelled' || order.status === 'paid') {
    return false;
  }

  if (label === 'Commande envoyée en cuisine') {
    return order.status === 'draft';
  }

  if (label === 'En attente de préparation') {
    return order.status === 'sent';
  }

  if (label === 'Prête') {
    return order.status === 'preparing';
  }

  if (label === 'Servie') {
    return order.status === 'ready';
  }

  if (label === 'Payée') {
    return order.status === 'served';
  }

  return false;
}

function firstItemDate(order: OrderDetail, statuses: string[]): Date | null {
  const dates = order.items
    .filter((item) => statuses.includes(item.status))
    .map((item) => item.readyAt ?? item.sentAt ?? item.createdAt)
    .sort((left, right) => left.getTime() - right.getTime());

  return dates[0] ?? null;
}

function firstItemReadyDate(order: OrderDetail): Date | null {
  const dates = order.items
    .filter((item) => item.readyAt)
    .map((item) => item.readyAt as Date)
    .sort((left, right) => left.getTime() - right.getTime());

  return dates[0] ?? null;
}

function firstItemServedDate(order: OrderDetail): Date | null {
  const dates = order.items
    .filter((item) => item.servedAt)
    .map((item) => item.servedAt as Date)
    .sort((left, right) => left.getTime() - right.getTime());

  return dates[0] ?? null;
}

function firstItemCancelledTime(order: OrderDetail): string {
  const dates = order.items
    .filter((item) => item.cancelledAt)
    .map((item) => item.cancelledAt as Date)
    .sort((left, right) => left.getTime() - right.getTime());

  return dates[0] ? formatOrderTime(dates[0]) : '-';
}
