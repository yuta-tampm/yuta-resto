import type {
  LocalManagementReportOrder,
  LocalManagementReportsResponse,
} from '@yuta/contracts/local-pos';

const reportTimeZone = 'Europe/Paris';

const dateFormatter = new Intl.DateTimeFormat('fr-FR', {
  day: 'numeric',
  month: 'long',
  timeZone: reportTimeZone,
});

const timeFormatter = new Intl.DateTimeFormat('fr-FR', {
  hour: '2-digit',
  minute: '2-digit',
  timeZone: reportTimeZone,
});

export function formatReportServiceDay(
  serviceDay: LocalManagementReportsResponse['serviceDay'],
): string {
  const start = new Date(serviceDay.start);
  const end = new Date(serviceDay.end);
  return `Service du ${dateFormatter.format(start)}, ${timeFormatter.format(start)} au ${dateFormatter.format(end)}, ${timeFormatter.format(end)}`;
}

export function formatReportTime(value: string | null): string {
  return value ? timeFormatter.format(new Date(value)) : '—';
}

export function reportOrderStatusLabel(
  status: LocalManagementReportOrder['status'],
): string {
  const labels: Record<LocalManagementReportOrder['status'], string> = {
    draft: 'Non envoyée',
    sent: 'Envoyée',
    preparing: 'En préparation',
    ready: 'Prête',
    served: 'Servie',
    paid: 'Payée',
    cancelled: 'Annulée',
  };
  return labels[status];
}

export function reportOrderStatusTone(
  status: LocalManagementReportOrder['status'],
): 'neutral' | 'success' | 'warning' | 'info' | 'danger' {
  if (status === 'paid' || status === 'ready') return 'success';
  if (status === 'cancelled') return 'danger';
  if (status === 'preparing') return 'info';
  if (status === 'draft') return 'warning';
  return 'neutral';
}

export function reportOrderTypeLabel(
  orderType: LocalManagementReportOrder['orderType'],
): string {
  return {
    dine_in: 'Sur place',
    takeaway: 'À emporter',
    delivery: 'Livraison',
  }[orderType];
}

export function reportPaymentModeLabel(
  paymentMode: LocalManagementReportOrder['paymentMode'],
): string {
  return {
    single: 'Paiement unique',
    split_by_items: 'Partage par article',
    split_equally: 'Partage égal',
  }[paymentMode];
}
