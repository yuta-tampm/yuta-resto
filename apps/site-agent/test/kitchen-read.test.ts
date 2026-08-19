import { describe, expect, it } from 'vitest';
import { summarizeKitchenCounts } from '../src/services/site-agent-service';

describe('Kitchen read counts', () => {
  const rows = [
    {
      orderId: 'order-kitchen-active',
      station: 'kitchen' as const,
      hasUnfinished: true,
    },
    {
      orderId: 'order-kitchen-ready',
      station: 'kitchen' as const,
      hasUnfinished: false,
    },
    {
      orderId: 'order-counter-mixed',
      station: 'bar' as const,
      hasUnfinished: false,
    },
    {
      orderId: 'order-counter-mixed',
      station: 'dessert' as const,
      hasUnfinished: true,
    },
    {
      orderId: 'order-counter-ready',
      station: 'dessert' as const,
      hasUnfinished: false,
    },
  ];

  it('counts station orders separately and Cuisine queues by unique order', () => {
    expect(summarizeKitchenCounts(rows, 'kitchen')).toEqual({
      stations: { kitchen: 2, bar: 1, dessert: 2 },
      queues: { active: 1, ready: 1 },
    });
  });

  it('deduplicates Bar and Dessert into one counter ticket', () => {
    expect(summarizeKitchenCounts(rows, 'counter')).toEqual({
      stations: { kitchen: 2, bar: 1, dessert: 2 },
      queues: { active: 1, ready: 1 },
    });
  });
});
