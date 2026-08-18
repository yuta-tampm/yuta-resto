import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { OrderTotalsPanel } from '../src/app/orders/[orderId]/_components/OrderTotalsPanel';

describe('OrderTotalsPanel', () => {
  it('renders discount detail in a disclosure that is closed by default', () => {
    const markup = renderToStaticMarkup(
      <OrderTotalsPanel
        subtotalCents={3650}
        discountCents={150}
        totalCents={3500}
        discounts={[
          {
            id: 'discount-1',
            nameSnapshot: 'Remise fidélité',
            discountCents: 100,
            items: [
              {
                quantityApplied: 1,
                orderItem: {
                  id: 'item-1',
                  itemNameSnapshot: 'Plat du jour',
                },
              },
              {
                quantityApplied: 2,
                orderItem: {
                  id: 'item-2',
                  itemNameSnapshot: 'Thé glacé maison',
                },
              },
            ],
          },
          {
            id: 'discount-2',
            nameSnapshot: 'Offre combinée',
            discountCents: 50,
            items: [],
          },
        ]}
      />,
    );

    expect(markup).toContain('<details class="group');
    expect(markup).not.toContain('<details open=""');
    expect(markup).toContain('<summary');
    expect(markup).toContain('Détail des remises');
    expect(markup).toContain('Remise fidélité');
    expect(markup).toContain('1 × Plat du jour + 2 × Thé glacé maison');
    expect(markup).toContain('Offre combinée');
    expect(markup).toContain('-1,50');
    expect(markup).toContain('35,00');
  });

  it('keeps a non-interactive aggregate row when no detail is available', () => {
    const markup = renderToStaticMarkup(
      <OrderTotalsPanel
        subtotalCents={1200}
        discountCents={0}
        totalCents={1200}
        discounts={[]}
      />,
    );

    expect(markup).not.toContain('<details');
    expect(markup).toContain('Remise');
    expect(markup).toContain('0,00');
    expect(markup).toContain('12,00');
  });
});
