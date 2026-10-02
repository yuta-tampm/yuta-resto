import {
  localKitchenQueueQuerySchema,
  localKitchenQueueResponseSchema,
  type LocalKitchenQueueQuery,
  type LocalKitchenScreen,
  type LocalOrderSummary,
} from '@yuta/contracts/local-pos';
import { getServiceDayWindow } from '@yuta/core';
import type { PosDatabaseClient } from '@yuta/db-pos/client';
import {
  menuCategories,
  menuItems,
  orderItems,
  orders,
} from '@yuta/db-pos/schema';
import {
  and,
  asc,
  desc,
  eq,
  getTableColumns,
  gte,
  inArray,
  lt,
  sql,
} from 'drizzle-orm';
import { toOrderSummary } from './order-summary';

export function createKitchenQueueService(db: PosDatabaseClient) {
  async function listKitchenQueue(input: LocalKitchenQueueQuery) {
    const query = localKitchenQueueQuerySchema.parse(input);
    const serviceDay = getServiceDayWindow(new Date());
    const serviceCondition = and(
      gte(orders.createdAt, serviceDay.start),
      lt(orders.createdAt, serviceDay.end),
    )!;
    const productionStatusCondition = inArray(orderItems.status, [
      'sent',
      'preparing',
      'ready',
    ]);
    const selectedStationCondition = kitchenScreenCondition(query.screen);
    const unfinishedGroup = sql<boolean>`bool_or(${orderItems.status} in ('sent', 'preparing'))`;
    const groupSortDate =
      query.queue === 'ready'
        ? sql<Date>`min(coalesce(${orderItems.readyAt}, ${orderItems.createdAt}))`
        : sql<Date>`min(coalesce(${orderItems.sentAt}, ${orderItems.createdAt}))`;

    const [candidateOrders, countRows] = await Promise.all([
      db
        .select({ id: orders.id, sortAt: groupSortDate.as('sort_at') })
        .from(orders)
        .innerJoin(orderItems, eq(orderItems.orderId, orders.id))
        .where(
          and(
            serviceCondition,
            productionStatusCondition,
            selectedStationCondition,
          ),
        )
        .groupBy(orders.id)
        .having(
          query.queue === 'ready'
            ? sql<boolean>`not (${unfinishedGroup})`
            : unfinishedGroup,
        )
        .orderBy(
          query.queue === 'ready' ? desc(groupSortDate) : asc(groupSortDate),
          asc(orders.id),
        )
        .limit(query.limit),
      db
        .select({
          orderId: orderItems.orderId,
          station: orderItems.kitchenStationSnapshot,
          hasUnfinished: unfinishedGroup.as('has_unfinished'),
        })
        .from(orderItems)
        .innerJoin(orders, eq(orders.id, orderItems.orderId))
        .where(
          and(
            serviceCondition,
            productionStatusCondition,
            inArray(orderItems.kitchenStationSnapshot, [
              'kitchen',
              'bar',
              'dessert',
            ]),
          ),
        )
        .groupBy(orderItems.orderId, orderItems.kitchenStationSnapshot),
    ]);

    const orderIds = candidateOrders.map(({ id }) => id);
    const detailRows =
      orderIds.length === 0
        ? []
        : await db
            .select({
              order: getTableColumns(orders),
              item: getTableColumns(orderItems),
              categoryName: menuCategories.name,
              categorySortOrder: menuCategories.sortOrder,
              itemSortOrder: menuItems.sortOrder,
            })
            .from(orderItems)
            .innerJoin(orders, eq(orders.id, orderItems.orderId))
            .innerJoin(menuItems, eq(menuItems.id, orderItems.menuItemId))
            .innerJoin(
              menuCategories,
              eq(menuCategories.id, menuItems.categoryId),
            )
            .where(
              and(
                inArray(orderItems.orderId, orderIds),
                productionStatusCondition,
                selectedStationCondition,
              ),
            )
            .orderBy(asc(orderItems.createdAt), asc(orderItems.id));

    const ticketsByOrder = new Map<
      string,
      {
        order: LocalOrderSummary;
        items: Array<ReturnType<typeof toKitchenOrderItem>>;
      }
    >();
    for (const row of detailRows) {
      const item = toKitchenOrderItem(row.item, row);
      const ticket = ticketsByOrder.get(row.order.id);
      if (ticket) {
        ticket.items.push(item);
      } else {
        ticketsByOrder.set(row.order.id, {
          order: toOrderSummary(row.order),
          items: [item],
        });
      }
    }

    const counts = summarizeKitchenCounts(countRows, query.screen);

    return localKitchenQueueResponseSchema.parse({
      serviceDay: {
        start: serviceDay.start.toISOString(),
        end: serviceDay.end.toISOString(),
      },
      screen: query.screen,
      queue: query.queue,
      tickets: orderIds.flatMap((orderId) => {
        const ticket = ticketsByOrder.get(orderId);
        return ticket ? [ticket] : [];
      }),
      counts,
    });
  }

  return { listKitchenQueue };
}

function kitchenScreenCondition(screen: LocalKitchenScreen) {
  return screen === 'kitchen'
    ? eq(orderItems.kitchenStationSnapshot, 'kitchen')
    : inArray(orderItems.kitchenStationSnapshot, ['bar', 'dessert']);
}

function isStationOnScreen(
  station: 'kitchen' | 'bar' | 'dessert',
  screen: LocalKitchenScreen,
): boolean {
  return screen === 'kitchen' ? station === 'kitchen' : station !== 'kitchen';
}

export function summarizeKitchenCounts(
  rows: Array<{
    orderId: string;
    station: 'kitchen' | 'bar' | 'dessert' | 'none';
    hasUnfinished: boolean;
  }>,
  screen: LocalKitchenScreen,
) {
  const stations = { kitchen: 0, bar: 0, dessert: 0 };
  const selectedOrderState = new Map<string, boolean>();
  for (const row of rows) {
    if (
      row.station !== 'kitchen' &&
      row.station !== 'bar' &&
      row.station !== 'dessert'
    ) {
      continue;
    }
    stations[row.station] += 1;
    if (!isStationOnScreen(row.station, screen)) continue;
    selectedOrderState.set(
      row.orderId,
      (selectedOrderState.get(row.orderId) ?? false) || row.hasUnfinished,
    );
  }
  const queues = { active: 0, ready: 0 };
  for (const hasUnfinished of selectedOrderState.values()) {
    queues[hasUnfinished ? 'active' : 'ready'] += 1;
  }
  return { stations, queues };
}

function toKitchenOrderItem(
  item: typeof orderItems.$inferSelect,
  presentation: {
    categoryName: string;
    categorySortOrder: number;
    itemSortOrder: number;
  },
) {
  return {
    id: item.id,
    orderId: item.orderId,
    menuItemId: item.menuItemId,
    itemNameSnapshot: item.itemNameSnapshot,
    unitPriceCentsSnapshot: item.unitPriceCentsSnapshot,
    kitchenStationSnapshot: item.kitchenStationSnapshot,
    quantity: item.quantity,
    note: item.note,
    quickInstructions: item.quickInstructions,
    selectedVariants: item.selectedVariants,
    hasAllergy: item.hasAllergy,
    allergenCodes: item.allergenCodes,
    selectedAllergens: item.selectedAllergens,
    allergySeverity: item.allergySeverity,
    allergyNote: item.allergyNote,
    allergyAcknowledgedAt: item.allergyAcknowledgedAt?.toISOString() ?? null,
    allergyKitchenConfirmedAt:
      item.allergyKitchenConfirmedAt?.toISOString() ?? null,
    status: item.status,
    sentAt: item.sentAt?.toISOString() ?? null,
    readyAt: item.readyAt?.toISOString() ?? null,
    servedAt: item.servedAt?.toISOString() ?? null,
    cancelledAt: item.cancelledAt?.toISOString() ?? null,
    cancelledReason: item.cancelledReason,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
    categoryName: presentation.categoryName,
    categorySortOrder: presentation.categorySortOrder,
    itemSortOrder: presentation.itemSortOrder,
  };
}
