import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('../src/app/actions', () => ({ cancelOrderAction: vi.fn() }));

import { OrderCancelForm } from '../src/app/orders/[orderId]/_components/OrderCancelForm';

const orderId = '019fe22c-bcab-73dc-af5d-2829d53b99ec';

describe('OrderCancelForm', () => {
  it('only opens a confirmation dialog instead of submitting the cancel command', () => {
    const markup = renderToStaticMarkup(
      <OrderCancelForm orderId={orderId} disabled={false} />,
    );

    expect(markup).toContain('Annuler la commande');
    expect(markup).toContain('type="button"');
    expect(markup).toContain('aria-haspopup="dialog"');
    expect(markup).not.toContain('<form');
    expect(markup).not.toContain('type="submit"');
  });

  it('stays disabled for orders that cannot be cancelled', () => {
    const markup = renderToStaticMarkup(
      <OrderCancelForm orderId={orderId} disabled />,
    );

    expect(markup).toContain('disabled=""');
  });
});
