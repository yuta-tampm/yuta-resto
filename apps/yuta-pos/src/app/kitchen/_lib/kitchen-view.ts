import type { PosOrder, PosOrderItem } from '../../../lib/pos-api';

export type KitchenScreen = 'kitchen' | 'counter';
export type KitchenProductionStation = 'kitchen' | 'bar' | 'dessert';
export type KitchenStatusFilter = 'sent' | 'preparing' | 'ready';
export type KitchenQueueFilter = 'active' | 'ready';
export type KitchenOrderStatus = PosOrder['status'];
export type KitchenItemTone = 'default' | 'starter' | 'bar';
export type KitchenQueueItem = PosOrderItem & {
  order: PosOrder;
  categoryName: string | null;
  categorySortOrder: number | null;
  itemSortOrder: number | null;
};
export type KitchenOrderGroup = {
  order: PosOrder;
  items: KitchenQueueItem[];
};
export const kitchenQueueLimit = 100;

export function parseKitchenScreen(value: string | undefined): KitchenScreen {
  if (value === 'counter' || value === 'bar' || value === 'dessert') {
    return 'counter';
  }

  return 'kitchen';
}

export function parseKitchenQueue(
  value: string | undefined,
): KitchenQueueFilter {
  return value === 'ready' ? 'ready' : 'active';
}

export function kitchenUrl(
  screen: KitchenScreen,
  queue: KitchenQueueFilter,
): string {
  return `/kitchen?station=${screen}&status=${queue}`;
}

export function itemsForKitchenScreen(
  items: KitchenQueueItem[],
  screen: KitchenScreen,
): KitchenQueueItem[] {
  return items.filter((item) =>
    screen === 'kitchen'
      ? item.kitchenStationSnapshot === 'kitchen'
      : item.kitchenStationSnapshot === 'bar' ||
        item.kitchenStationSnapshot === 'dessert',
  );
}

export function groupItemsByOrder(
  items: KitchenQueueItem[],
): KitchenOrderGroup[] {
  const groups = new Map<string, KitchenOrderGroup>();

  for (const item of items) {
    const group = groups.get(item.order.id);
    if (group) {
      group.items.push(item);
    } else {
      groups.set(item.order.id, { order: item.order, items: [item] });
    }
  }

  return Array.from(groups.values());
}

export function sortKitchenItems(
  items: KitchenQueueItem[],
  screen: KitchenScreen,
): KitchenQueueItem[] {
  return items.toSorted((left, right) => {
    const priorityDifference =
      kitchenItemPriority(left, screen) - kitchenItemPriority(right, screen);
    if (priorityDifference) return priorityDifference;

    const categoryDifference =
      (left.categorySortOrder ?? Number.MAX_SAFE_INTEGER) -
      (right.categorySortOrder ?? Number.MAX_SAFE_INTEGER);
    if (categoryDifference) return categoryDifference;

    const itemDifference =
      (left.itemSortOrder ?? Number.MAX_SAFE_INTEGER) -
      (right.itemSortOrder ?? Number.MAX_SAFE_INTEGER);
    if (itemDifference) return itemDifference;

    return (
      left.createdAt.getTime() - right.createdAt.getTime() ||
      left.id.localeCompare(right.id)
    );
  });
}

export function kitchenItemTone(
  item: KitchenQueueItem,
  screen: KitchenScreen,
): KitchenItemTone {
  if (screen === 'counter' && item.kitchenStationSnapshot === 'bar') {
    return 'bar';
  }

  if (screen === 'kitchen' && isStarterCategory(item.categoryName)) {
    return 'starter';
  }

  return 'default';
}

export function kitchenGroupStatus(
  group: KitchenOrderGroup,
): KitchenStatusFilter {
  if (group.items.every((item) => item.status === 'ready')) {
    return 'ready';
  }

  if (group.items.every((item) => item.status === 'sent')) {
    return 'sent';
  }

  return 'preparing';
}

export function groupsForKitchenQueue(
  items: KitchenQueueItem[],
  queue: KitchenQueueFilter,
): KitchenOrderGroup[] {
  return groupItemsByOrder(items).filter((group) =>
    queue === 'ready'
      ? kitchenGroupStatus(group) === 'ready'
      : kitchenGroupStatus(group) !== 'ready',
  );
}

export function sortKitchenGroups(
  groups: KitchenOrderGroup[],
  queue: KitchenQueueFilter,
): KitchenOrderGroup[] {
  return groups.toSorted((left, right) => {
    const leftDate = kitchenGroupSortDate(left, queue);
    const rightDate = kitchenGroupSortDate(right, queue);
    const dateDifference =
      queue === 'ready'
        ? rightDate.getTime() - leftDate.getTime()
        : leftDate.getTime() - rightDate.getTime();

    return dateDifference || left.order.id.localeCompare(right.order.id);
  });
}

export function countGroupsByQueue(
  items: KitchenQueueItem[],
): Record<KitchenQueueFilter, number> {
  const counts = { active: 0, ready: 0 } satisfies Record<
    KitchenQueueFilter,
    number
  >;

  for (const group of groupItemsByOrder(items)) {
    const queue = kitchenGroupStatus(group) === 'ready' ? 'ready' : 'active';
    counts[queue] += 1;
  }

  return counts;
}

export function countGroupsByProductionStation(
  items: KitchenQueueItem[],
): Record<KitchenProductionStation, number> {
  const orderIdsByStation = {
    kitchen: new Set<string>(),
    bar: new Set<string>(),
    dessert: new Set<string>(),
  } satisfies Record<KitchenProductionStation, Set<string>>;

  for (const item of items) {
    const station = item.kitchenStationSnapshot;

    if (station !== 'kitchen' && station !== 'bar' && station !== 'dessert') {
      continue;
    }

    orderIdsByStation[station].add(item.order.id);
  }

  return {
    kitchen: orderIdsByStation.kitchen.size,
    bar: orderIdsByStation.bar.size,
    dessert: orderIdsByStation.dessert.size,
  };
}

export function groupTimeLabel(items: PosOrderItem[]): string {
  const firstDate = items
    .map((item) => item.sentAt ?? item.readyAt ?? item.createdAt)
    .toSorted((left, right) => left.getTime() - right.getTime())[0];

  return firstDate ? elapsedLabel(firstDate) : '';
}

export function orderTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    dine_in: 'Sur place',
    takeaway: 'À emporter',
    delivery: 'Livraison',
  };

  return labels[type] ?? type;
}

function elapsedLabel(date: Date): string {
  const minutes = Math.max(
    0,
    Math.floor((Date.now() - date.getTime()) / 60000),
  );

  if (minutes < 1) {
    return "à l'instant";
  }

  return `${minutes} min`;
}

function kitchenGroupSortDate(
  group: KitchenOrderGroup,
  queue: KitchenQueueFilter,
): Date {
  const dates = group.items.map((item) =>
    queue === 'ready'
      ? (item.readyAt ?? item.createdAt)
      : (item.sentAt ?? item.createdAt),
  );

  return (
    dates.toSorted((left, right) => left.getTime() - right.getTime())[0] ??
    new Date(0)
  );
}

function kitchenItemPriority(
  item: KitchenQueueItem,
  screen: KitchenScreen,
): number {
  if (screen === 'counter') {
    return item.kitchenStationSnapshot === 'bar' ? 0 : 1;
  }

  return isStarterCategory(item.categoryName) ? 0 : 1;
}

function isStarterCategory(categoryName: string | null): boolean {
  const normalizedName = categoryName
    ?.normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLocaleLowerCase('fr-FR');

  return normalizedName === 'entree' || normalizedName === 'entrees';
}
