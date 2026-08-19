import { describe, expect, it } from 'vitest';
import {
  countGroupsByQueue,
  countGroupsByProductionStation,
  groupsForKitchenQueue,
  itemsForKitchenScreen,
  kitchenGroupStatus,
  kitchenItemTone,
  kitchenUrl,
  parseKitchenQueue,
  parseKitchenScreen,
  sortKitchenGroups,
  sortKitchenItems,
  type KitchenQueueItem,
} from '../src/app/kitchen/_lib/kitchen-view';

describe('Kitchen view navigation', () => {
  it('uses one active queue plus the ready queue', () => {
    expect(parseKitchenScreen(undefined)).toBe('kitchen');
    expect(parseKitchenScreen('unknown')).toBe('kitchen');
    expect(parseKitchenScreen('bar')).toBe('counter');
    expect(parseKitchenScreen('dessert')).toBe('counter');
    expect(parseKitchenScreen('counter')).toBe('counter');
    expect(parseKitchenQueue(undefined)).toBe('active');
    expect(parseKitchenQueue('sent')).toBe('active');
    expect(parseKitchenQueue('preparing')).toBe('active');
    expect(parseKitchenQueue('ready')).toBe('ready');
    expect(kitchenUrl('counter', 'active')).toBe(
      '/kitchen?station=counter&status=active',
    );
  });
});

describe('Kitchen ticket queues', () => {
  it('keeps sent, preparing, and mixed-completion tickets together until every item is ready', () => {
    const items = [
      kitchenItem('order-sent', 'sent'),
      kitchenItem('order-preparing', 'preparing'),
      kitchenItem('order-mixed', 'preparing'),
      kitchenItem('order-mixed', 'ready'),
      kitchenItem('order-ready', 'ready'),
    ];

    const activeGroups = groupsForKitchenQueue(items, 'active');
    const readyGroups = groupsForKitchenQueue(items, 'ready');

    expect(activeGroups.map((group) => group.order.id)).toEqual([
      'order-sent',
      'order-preparing',
      'order-mixed',
    ]);
    expect(kitchenGroupStatus(activeGroups[2]!)).toBe('preparing');
    expect(readyGroups.map((group) => group.order.id)).toEqual(['order-ready']);
  });

  it('counts unique order tickets by queue and station', () => {
    const items = [
      kitchenItem('order-1', 'sent'),
      kitchenItem('order-1', 'ready'),
      kitchenItem('order-2', 'preparing'),
      kitchenItem('order-3', 'ready'),
      kitchenItem('order-4', 'sent', 'bar'),
      kitchenItem('order-4', 'sent', 'dessert'),
      kitchenItem('order-5', 'sent', 'dessert'),
    ];

    expect(
      countGroupsByQueue(
        items.filter((item) => item.kitchenStationSnapshot === 'kitchen'),
      ),
    ).toEqual({ active: 2, ready: 1 });
    expect(countGroupsByProductionStation(items)).toEqual({
      kitchen: 3,
      bar: 1,
      dessert: 2,
    });
    expect(
      itemsForKitchenScreen(items, 'counter').map(
        (item) => item.kitchenStationSnapshot,
      ),
    ).toEqual(['bar', 'dessert', 'dessert']);
  });

  it('keeps active tickets in sent-time order when their item statuses change', () => {
    const initialItems = [
      kitchenItem('order-newest', 'sent', 'kitchen', '2026-08-19T12:20:00Z'),
      kitchenItem('order-oldest', 'sent', 'kitchen', '2026-08-19T12:00:00Z'),
      kitchenItem('order-middle', 'sent', 'kitchen', '2026-08-19T12:10:00Z'),
    ];
    const transitionedItems = [
      kitchenItem('order-newest', 'sent', 'kitchen', '2026-08-19T12:20:00Z'),
      kitchenItem(
        'order-oldest',
        'preparing',
        'kitchen',
        '2026-08-19T12:00:00Z',
      ),
      kitchenItem(
        'order-middle',
        'preparing',
        'kitchen',
        '2026-08-19T12:10:00Z',
      ),
      kitchenItem('order-middle', 'ready', 'kitchen', '2026-08-19T12:10:00Z'),
    ];

    const orderedIds = (items: KitchenQueueItem[]) =>
      sortKitchenGroups(groupsForKitchenQueue(items, 'active'), 'active').map(
        (group) => group.order.id,
      );

    expect(orderedIds(initialItems)).toEqual([
      'order-oldest',
      'order-middle',
      'order-newest',
    ]);
    expect(orderedIds(transitionedItems)).toEqual([
      'order-oldest',
      'order-middle',
      'order-newest',
    ]);
  });

  it('orders starters before mains and Bar before Desserts with distinct tones', () => {
    const main = kitchenItem('main', 'sent', 'kitchen', undefined, {
      categoryName: 'Plat du jour',
      categorySortOrder: 50,
      itemSortOrder: 10,
    });
    const secondStarter = kitchenItem(
      'starter-2',
      'sent',
      'kitchen',
      undefined,
      {
        categoryName: 'Entrées',
        categorySortOrder: 10,
        itemSortOrder: 20,
      },
    );
    const firstStarter = kitchenItem(
      'starter-1',
      'sent',
      'kitchen',
      undefined,
      {
        categoryName: 'Entrées',
        categorySortOrder: 10,
        itemSortOrder: 10,
      },
    );
    const dessert = kitchenItem('dessert', 'sent', 'dessert');
    const bar = kitchenItem('bar', 'sent', 'bar');

    expect(
      sortKitchenItems([main, secondStarter, firstStarter], 'kitchen').map(
        (item) => item.order.id,
      ),
    ).toEqual(['starter-1', 'starter-2', 'main']);
    expect(
      sortKitchenItems([dessert, bar], 'counter').map(
        (item) => item.kitchenStationSnapshot,
      ),
    ).toEqual(['bar', 'dessert']);
    expect(kitchenItemTone(firstStarter, 'kitchen')).toBe('starter');
    expect(kitchenItemTone(main, 'kitchen')).toBe('default');
    expect(kitchenItemTone(bar, 'counter')).toBe('bar');
    expect(kitchenItemTone(dessert, 'counter')).toBe('default');
  });
});

function kitchenItem(
  orderId: string,
  status: KitchenQueueItem['status'],
  station: KitchenQueueItem['kitchenStationSnapshot'] = 'kitchen',
  sentAt = '2026-08-19T12:00:00Z',
  presentation: Pick<
    KitchenQueueItem,
    'categoryName' | 'categorySortOrder' | 'itemSortOrder'
  > = {
    categoryName:
      station === 'kitchen'
        ? 'Plat du jour'
        : station === 'dessert'
          ? 'Desserts'
          : 'Boissons',
    categorySortOrder: 0,
    itemSortOrder: 0,
  },
): KitchenQueueItem {
  const timestamp = new Date(sentAt);
  return {
    id: `${orderId}-${status}-${station}`,
    status,
    kitchenStationSnapshot: station,
    sentAt: timestamp,
    readyAt: status === 'ready' ? timestamp : null,
    createdAt: timestamp,
    order: { id: orderId },
    ...presentation,
  } as KitchenQueueItem;
}
