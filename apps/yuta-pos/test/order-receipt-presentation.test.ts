import { describe, expect, it } from 'vitest';
import {
  formatReceiptMoney,
  receiptAvailabilityLabel,
  receiptCommandIntent,
  receiptSubmitLabel,
} from '../src/app/orders/[orderId]/_lib/order-receipt-presentation';

const job = {
  id: '019c9b83-7c2d-70e5-8000-000000000001',
  orderId: '019c9b83-7c2d-70e5-8000-000000000002',
  checkId: null,
  paymentId: null,
  type: 'customer_receipt' as const,
  source: 'pos' as const,
  status: 'printed' as const,
  printerName: 'tm-m30-receipt',
  summary: { orderNumber: 'POS-1', tableLabel: 'Table 1', itemCount: 1 },
  errorMessage: null,
  createdAt: '2026-08-18T12:00:00.000Z',
  printedAt: '2026-08-18T12:01:00.000Z',
};

describe('order receipt presentation', () => {
  it('maps terminal job state to deliberate retry and reprint intents', () => {
    expect(receiptCommandIntent(null)).toBe('print');
    expect(receiptCommandIntent({ ...job, status: 'failed' })).toBe('retry');
    expect(receiptCommandIntent(job)).toBe('reprint');
  });

  it('keeps payment and queue labels text-backed', () => {
    expect(receiptAvailabilityLabel('payment_pending')).toBe(
      'Paiement en attente',
    );
    expect(
      receiptSubmitLabel({
        intent: 'print',
        pending: false,
        status: 'pending',
      }),
    ).toBe("En attente d'impression…");
    expect(
      receiptSubmitLabel({
        intent: 'reprint',
        pending: false,
        status: 'printed',
      }),
    ).toBe('Réimprimer');
    expect(formatReceiptMoney(1490)).toContain('14,90');
  });
});
