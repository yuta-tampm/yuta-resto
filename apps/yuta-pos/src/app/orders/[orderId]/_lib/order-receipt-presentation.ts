import type {
  LocalPrintJob,
  LocalReceiptTarget,
  ReceiptJobIntent,
} from '@yuta/contracts/local-pos';

export function receiptCommandIntent(
  job: LocalPrintJob | null,
): ReceiptJobIntent {
  if (job?.status === 'failed') return 'retry';
  if (job?.status === 'printed') return 'reprint';
  return 'print';
}

export function receiptAvailabilityLabel(
  availability: LocalReceiptTarget['availability'],
): string {
  if (availability === 'available') return 'Payée';
  if (availability === 'cancelled') return 'Annulée';
  return 'Paiement en attente';
}

export function receiptSubmitLabel(input: {
  intent: ReceiptJobIntent;
  pending: boolean;
  status: LocalPrintJob['status'] | null;
}): string {
  if (input.pending) return 'Demande en cours…';
  if (input.status === 'printing') return 'Impression en cours…';
  if (input.status === 'pending') return "En attente d'impression…";
  if (input.intent === 'retry') return "Réessayer l'impression";
  if (input.intent === 'reprint') return 'Réimprimer';
  return 'Imprimer';
}

export function formatReceiptMoney(cents: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(cents / 100);
}
