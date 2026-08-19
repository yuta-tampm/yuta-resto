import { describe, expect, it, vi } from 'vitest';
import {
  createKitchenEventHub,
  kitchenEventScreenForStation,
  kitchenEventScreensForStations,
} from '../src/services/kitchen-event-hub';

describe('Kitchen event hub', () => {
  it('publishes monotonic notification-only revisions and unsubscribes', () => {
    const hub = createKitchenEventHub({
      bootId: 'test-boot',
      now: () => new Date('2026-08-19T10:00:00.000Z'),
    });
    const listener = vi.fn();
    const unsubscribe = hub.subscribe(listener);

    expect(hub.publish('kitchen')).toEqual({
      type: 'kitchen_changed',
      revision: 'test-boot:1',
      screen: 'kitchen',
      reason: 'state_changed',
      occurredAt: '2026-08-19T10:00:00.000Z',
    });
    expect(hub.publish('all', 'ticket_created')).toMatchObject({
      revision: 'test-boot:2',
      reason: 'ticket_created',
    });
    unsubscribe();
    hub.publish('counter');

    expect(listener).toHaveBeenCalledTimes(2);
  });

  it('maps persisted stations to the screen that needs refreshing', () => {
    expect(kitchenEventScreenForStation('kitchen')).toBe('kitchen');
    expect(kitchenEventScreenForStation('bar')).toBe('counter');
    expect(kitchenEventScreenForStation('dessert')).toBe('counter');
    expect(kitchenEventScreenForStation('counter')).toBe('counter');
    expect(kitchenEventScreenForStation('none')).toBe('all');
    expect(
      kitchenEventScreensForStations([
        'kitchen',
        'bar',
        'dessert',
        'bar',
        'none',
      ]),
    ).toEqual(['kitchen', 'counter']);
  });
});
