import {
  localOrdersHomeQuerySchema,
  localOrdersHomeResponseSchema,
  localOrdersQuerySchema,
  localOrdersResponseSchema,
  type LocalOrdersHomeQuery,
  type LocalOrdersHomeView,
  type LocalOrdersQuery,
} from '@yuta/contracts/local-pos';
import { getServiceDayWindow } from '@yuta/core';
import type { PosDatabaseClient } from '@yuta/db-pos/client';
import { orderItems, orders } from '@yuta/db-pos/schema';
import {
  and,
  asc,
  count,
  desc,
  eq,
  getTableColumns,
  gte,
  inArray,
  lt,
  or,
  sql,
} from 'drizzle-orm';
import { toOrderSummary } from './order-summary';

export function createOrderListService(db: PosDatabaseClient) {
  async function listOrders(input: LocalOrdersQuery) {
    const query = localOrdersQuerySchema.parse(input);
    const rows = query.status
      ? await db
          .select()
          .from(orders)
          .where(eq(orders.status, query.status))
          .orderBy(desc(orders.createdAt))
          .limit(query.limit)
      : await db
          .select()
          .from(orders)
          .orderBy(desc(orders.createdAt))
          .limit(query.limit);

    return localOrdersResponseSchema.parse({
      orders: rows.map(toOrderSummary),
    });
  }

  async function listOrdersHome(input: LocalOrdersHomeQuery) {
    const query = localOrdersHomeQuerySchema.parse(input);
    const serviceDay = getServiceDayWindow(new Date());
    const createdDuringService = and(
      gte(orders.createdAt, serviceDay.start),
      lt(orders.createdAt, serviceDay.end),
    )!;
    const paidDuringService = and(
      gte(orders.paidAt, serviceDay.start),
      lt(orders.paidAt, serviceDay.end),
    )!;
    const openCondition = and(
      createdDuringService,
      inArray(orders.status, ['draft', 'sent', 'preparing', 'ready', 'served']),
    )!;
    const paidTodayCondition = and(
      eq(orders.status, 'paid'),
      paidDuringService,
    )!;
    const allTodayCondition = or(createdDuringService, paidDuringService)!;
    const viewConditions: Record<LocalOrdersHomeView, typeof openCondition> = {
      open: openCondition,
      paid_today: paidTodayCondition,
      all_today: allTodayCondition,
    };
    const searchPattern = `%${escapeLikePattern(query.q)}%`;
    const searchCondition = query.q
      ? or(
          sql<boolean>`${orders.tableLabel} ilike ${searchPattern} escape '\\'`,
          sql<boolean>`${orders.orderNumber} ilike ${searchPattern} escape '\\'`,
        )!
      : undefined;
    const selectedCondition = searchCondition
      ? and(viewConditions[query.view], searchCondition)!
      : viewConditions[query.view];

    const [[counts], [total]] = await Promise.all([
      db
        .select({
          open: sql<number>`count(*) filter (where ${openCondition})::int`,
          paidToday: sql<number>`count(*) filter (where ${paidTodayCondition})::int`,
          allToday: sql<number>`count(*) filter (where ${allTodayCondition})::int`,
        })
        .from(orders),
      db.select({ value: count() }).from(orders).where(selectedCondition),
    ]);
    const totalItems = Number(total?.value ?? 0);
    const pagination = resolveOrdersHomePagination({
      requestedPage: query.page,
      pageSize: query.limit,
      totalItems,
    });
    const itemSummary = db
      .select({
        orderId: orderItems.orderId,
        itemCount: count(orderItems.id).as('item_count'),
        itemHasAllergy: sql<boolean>`bool_or(${orderItems.hasAllergy})`.as(
          'item_has_allergy',
        ),
      })
      .from(orderItems)
      .groupBy(orderItems.orderId)
      .as('item_summary');
    const baseQuery = db
      .select({
        ...getTableColumns(orders),
        itemCount: sql<number>`coalesce(${itemSummary.itemCount}, 0)::int`,
        itemHasAllergy: sql<boolean>`coalesce(${itemSummary.itemHasAllergy}, false)`,
      })
      .from(orders)
      .leftJoin(itemSummary, eq(itemSummary.orderId, orders.id))
      .where(selectedCondition);
    const rows =
      query.view === 'paid_today'
        ? await baseQuery
            .orderBy(
              desc(orders.paidAt),
              desc(orders.createdAt),
              asc(orders.id),
            )
            .limit(query.limit)
            .offset(pagination.offset)
        : await baseQuery
            .orderBy(desc(orders.createdAt), asc(orders.id))
            .limit(query.limit)
            .offset(pagination.offset);

    return localOrdersHomeResponseSchema.parse({
      serviceDay: {
        start: serviceDay.start.toISOString(),
        end: serviceDay.end.toISOString(),
      },
      view: query.view,
      query: query.q,
      orders: rows.map(({ itemCount, itemHasAllergy, ...order }) => ({
        ...toOrderSummary({
          ...order,
          hasAllergy: order.hasAllergy || itemHasAllergy,
        }),
        itemCount: Number(itemCount),
      })),
      counts: {
        open: Number(counts?.open ?? 0),
        paidToday: Number(counts?.paidToday ?? 0),
        allToday: Number(counts?.allToday ?? 0),
      },
      pagination: {
        page: pagination.page,
        pageSize: query.limit,
        totalItems,
        totalPages: pagination.totalPages,
      },
    });
  }

  return { listOrders, listOrdersHome };
}

export function resolveOrdersHomePagination(input: {
  requestedPage: number;
  pageSize: number;
  totalItems: number;
}) {
  const totalPages = Math.max(1, Math.ceil(input.totalItems / input.pageSize));
  const page = Math.min(input.requestedPage, totalPages);
  return {
    page,
    totalPages,
    offset: (page - 1) * input.pageSize,
  };
}

export function escapeLikePattern(value: string): string {
  return value
    .replaceAll('\\', '\\\\')
    .replaceAll('%', '\\%')
    .replaceAll('_', '\\_');
}
