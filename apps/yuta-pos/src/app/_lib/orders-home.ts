import type { LocalOrdersHomeView } from '@yuta/contracts/local-pos';
import type { PosOrderHomeRow } from '../../lib/pos-api';
import { posTimeZone } from '../../lib/pos-time-zone';

export type OrderView = LocalOrdersHomeView;

export type OrderRow = PosOrderHomeRow;

export const views: Array<{
  value: OrderView;
  label: string;
  shortLabel: string;
}> = [
  { value: 'open', label: 'Ouvertes', shortLabel: 'Ouvertes' },
  {
    value: 'paid_today',
    label: "Payees aujourd'hui",
    shortLabel: 'Payees',
  },
  {
    value: 'all_today',
    label: "Activite aujourd'hui",
    shortLabel: 'Activite',
  },
];

export function orderHasAllergy(order: OrderRow): boolean {
  return order.hasAllergy;
}

export function homeUrl(
  view: OrderView,
  searchQuery: string,
  page?: number,
): string {
  const params = new URLSearchParams({ view });

  if (searchQuery.length > 0) {
    params.set('q', searchQuery);
  }
  if (page && page > 1) {
    params.set('page', String(page));
  }

  return `/?${params.toString()}`;
}

export function parseView(value: string | undefined): OrderView {
  if (value === 'paid_today' || value === 'all_today') {
    return value;
  }

  return 'open';
}

export function parsePage(value: string | undefined): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
}

export function statusLabel(status: string): string {
  const labels: Record<string, string> = {
    draft: 'Non envoyee',
    sent: 'Envoyee',
    preparing: 'En preparation',
    ready: 'Prete',
    served: 'Servie',
    paid: 'Payee',
    cancelled: 'Annulee',
  };

  return labels[status] ?? status;
}

export function statusBadgeProps(status: string) {
  if (status === 'sent') {
    return { tone: 'success', variant: 'soft' } as const;
  }

  if (status === 'preparing') {
    return { tone: 'info', variant: 'soft' } as const;
  }

  if (status === 'draft') {
    return { tone: 'warning', variant: 'soft' } as const;
  }

  if (status === 'ready') {
    return { tone: 'success', variant: 'solid' } as const;
  }

  if (status === 'paid') {
    return { tone: 'neutral', variant: 'soft' } as const;
  }

  if (status === 'cancelled') {
    return { tone: 'danger', variant: 'solid' } as const;
  }

  return { tone: 'neutral', variant: 'outline' } as const;
}

export function statusAccentClass(status: string): string {
  const classes: Record<string, string> = {
    draft: 'border-status-warning',
    sent: 'border-status-success',
    preparing: 'border-status-info',
    ready: 'border-status-success',
    served: 'border-border-default',
    paid: 'border-border-default',
    cancelled: 'border-status-danger',
  };

  return classes[status] ?? 'border-border-default';
}

export function orderTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    dine_in: 'Sur place',
    takeaway: 'A emporter',
    delivery: 'Livraison',
  };

  return labels[type] ?? type;
}

export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: posTimeZone,
  }).format(date);
}
