import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { EqualSplitDialogContent } from '../src/app/orders/[orderId]/payment/_components/EqualSplitDialogContent';
import { ItemSplitDialogContent } from '../src/app/orders/[orderId]/payment/_components/ItemSplitDialogContent';

const orderId = '019fe22c-bcab-73dc-af5d-2829d53b99ec';
const noopAction = () => undefined;

describe('EqualSplitDialogContent', () => {
  it('previews the exact shares site-agent creates', () => {
    const markup = renderToStaticMarkup(
      <EqualSplitDialogContent
        action={noopAction}
        orderId={orderId}
        totalCents={1000}
        initialParts={3}
      />,
    );

    expect(markup).toContain('1 × 3,34');
    expect(markup).toContain('2 × 3,33');
    expect(markup).toContain('10,00');
    expect(markup).not.toContain('Ajustement');
  });

  it('shows a single amount when the total divides evenly', () => {
    const markup = renderToStaticMarkup(
      <EqualSplitDialogContent
        action={noopAction}
        orderId={orderId}
        totalCents={1200}
        initialParts={4}
      />,
    );

    expect(markup).toContain('3,00');
    expect(markup).not.toContain('×');
  });
});

describe('ItemSplitDialogContent', () => {
  it('names every icon-only control', () => {
    const markup = renderToStaticMarkup(
      <ItemSplitDialogContent
        action={noopAction}
        orderId={orderId}
        comboRules={[]}
        items={[
          {
            id: '019fe22c-bcb3-747d-8df3-eb8aef155d3c',
            menuItemId: '019fe22c-bcb3-747d-8df3-eb8aef155d3d',
            name: 'Bo bun',
            quantity: 2,
            unitPriceCents: 1290,
            createdAt: '2026-10-02T12:00:00.000Z',
          },
        ]}
      />,
    );

    expect(markup).toContain('aria-label="Ajouter un client"');
    expect(markup).toContain('aria-label="Retirer Bo bun du client 1"');
    expect(markup).toContain('aria-label="Ajouter Bo bun au client 1"');
  });
});
