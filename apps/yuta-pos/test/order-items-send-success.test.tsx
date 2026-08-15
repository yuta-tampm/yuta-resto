import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import {
  AUTO_HOME_REDIRECT_SECONDS,
  OrderItemsSendSuccess,
} from '../src/app/orders/[orderId]/items/OrderItemsSendSuccess';

describe('OrderItemsSendSuccess', () => {
  it('renders exactly the two approved routes without claiming print success', () => {
    const markup = renderToStaticMarkup(
      <OrderItemsSendSuccess orderNumber="POS-TEST-001" />,
    );
    const hrefs = Array.from(
      markup.matchAll(/href="([^"]+)"/g),
      (match) => match[1],
    );

    expect(hrefs).toEqual(['/pos', '/']);
    expect(markup).toContain('Commande envoyée en cuisine');
    expect(markup).toContain('POS-TEST-001');
    expect(markup).toContain('Retour automatique aux commandes dans');
    expect(markup).toContain('>5 s</span>');
    expect(AUTO_HOME_REDIRECT_SECONDS).toBe(5);
    expect(markup).not.toMatch(/imprim(?:é|ee|e)/i);
  });
});
