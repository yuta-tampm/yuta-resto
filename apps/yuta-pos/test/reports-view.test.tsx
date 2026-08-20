import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { ReportsView } from '../src/app/management/reports/_components/ReportsView';
import {
  formatReportServiceDay,
  formatReportTime,
} from '../src/app/management/reports/_lib/reports-presentation';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}));

const orderId = '11111111-1111-4111-8111-111111111111';
const report = {
  serviceDay: {
    start: '2026-08-20T03:00:00.000Z',
    end: '2026-08-21T03:00:00.000Z',
  },
  generatedAt: '2026-08-20T12:32:00.000Z',
  summary: {
    paidRevenueCents: 128_450,
    paidOrderCount: 42,
    openOrderCount: 7,
  },
  orders: [
    {
      id: orderId,
      orderNumber: 'POS-REPORT-1',
      tableLabel: 'Table 4',
      orderType: 'dine_in' as const,
      status: 'paid' as const,
      paymentMode: 'split_by_items' as const,
      totalCents: 6840,
      createdAt: '2026-08-20T10:18:00.000Z',
      paidAt: '2026-08-20T11:06:00.000Z',
    },
  ],
  pagination: {
    page: 1,
    pageSize: 50,
    totalItems: 1,
    totalPages: 1,
  },
};

describe('Management reports presentation', () => {
  it('renders real summary values and the validated POS order destination', () => {
    const markup = renderToStaticMarkup(<ReportsView report={report} />);

    expect(markup).toContain('Encaissé aujourd’hui');
    expect(markup).toContain('284,50');
    expect(markup).toContain('Commandes payées');
    expect(markup).toContain('POS-REPORT-1');
    expect(markup).toContain(`href="/orders/${orderId}"`);
    expect(markup).not.toContain('Prototype');
    expect(markup).not.toContain('DEMO-');
  });

  it('renders real zeros with a distinct empty activity state', () => {
    const markup = renderToStaticMarkup(
      <ReportsView
        report={{
          ...report,
          summary: {
            paidRevenueCents: 0,
            paidOrderCount: 0,
            openOrderCount: 0,
          },
          orders: [],
          pagination: { ...report.pagination, totalItems: 0 },
        }}
      />,
    );

    expect(markup).toContain('0,00');
    expect(markup).toContain('Aucune commande dans cette activité');
    expect(markup).toContain('valeurs réelles');
  });

  it('formats service boundaries explicitly in Europe/Paris', () => {
    expect(formatReportServiceDay(report.serviceDay)).toBe(
      'Service du 20 août, 05:00 au 21 août, 05:00',
    );
    expect(formatReportTime(report.generatedAt)).toBe('14:32');
    expect(formatReportTime(null)).toBe('—');
  });
});
