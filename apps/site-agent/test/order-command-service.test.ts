import type { OrderItem, PrintSettings } from '@yuta/db-pos/schema';
import { describe, expect, it } from 'vitest';
import { buildTicketPlans } from '../src/services/order-command-service';

const kitchenItem = {
  kitchenStationSnapshot: 'kitchen',
} as OrderItem;
const barItem = { kitchenStationSnapshot: 'bar' } as OrderItem;

function settings(overrides: Partial<PrintSettings> = {}): PrintSettings {
  return {
    id: 'default',
    kitchenEnabled: true,
    counterEnabled: true,
    kitchenCopies: 1,
    counterCopies: 1,
    fontSizePreset: 'standard',
    topPaddingLines: 1,
    leftPaddingChars: 2,
    bottomPaddingLines: 3,
    updatedAt: new Date(0),
    ...overrides,
  };
}

describe('order ticket planning', () => {
  it('creates only the enabled Cuisine destination', () => {
    const plans = buildTicketPlans(
      [kitchenItem, barItem],
      settings({ counterEnabled: false }),
    );

    expect(plans).toHaveLength(1);
    expect(plans[0]).toMatchObject({
      destination: 'kitchen',
      items: [kitchenItem],
      includeAllItems: false,
    });
  });

  it('creates only the enabled full BAR destination', () => {
    const items = [kitchenItem, barItem];
    const plans = buildTicketPlans(items, settings({ kitchenEnabled: false }));

    expect(plans).toHaveLength(1);
    expect(plans[0]).toMatchObject({
      destination: 'counter',
      items,
      includeAllItems: true,
    });
  });

  it('keeps an idempotency anchor without printing unrelated items', () => {
    const plans = buildTicketPlans(
      [barItem],
      settings({ counterEnabled: false }),
    );

    expect(plans).toEqual([
      expect.objectContaining({
        destination: 'kitchen',
        items: [],
        includeAllItems: false,
      }),
    ]);
  });
});
