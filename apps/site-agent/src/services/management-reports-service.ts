import {
  localManagementReportsQuerySchema,
  localManagementReportsResponseSchema,
  type LocalManagementReportsQuery,
} from '@yuta/contracts/local-pos';
import { getServiceDayWindow } from '@yuta/core';
import type { PosDatabaseClient } from '@yuta/db-pos/client';
import { orders, payments } from '@yuta/db-pos/schema';
import { and, count, desc, eq, gte, inArray, lt, or, sql } from 'drizzle-orm';

const openOrderStatuses = [
  'draft',
  'sent',
  'preparing',
  'ready',
  'served',
] as const;

export function createManagementReportsService(
  db: PosDatabaseClient,
  options: { now?: () => Date } = {},
) {
  async function getManagementReport(input: LocalManagementReportsQuery) {
    const query = localManagementReportsQuerySchema.parse(input);
    const generatedAt = (options.now ?? (() => new Date()))();
    const serviceDay = getServiceDayWindow(generatedAt);
    const createdDuringService = and(
      gte(orders.createdAt, serviceDay.start),
      lt(orders.createdAt, serviceDay.end),
    )!;
    const paidOrderDuringService = and(
      eq(orders.status, 'paid'),
      gte(orders.paidAt, serviceDay.start),
      lt(orders.paidAt, serviceDay.end),
    )!;
    const openOrderDuringService = and(
      createdDuringService,
      inArray(orders.status, openOrderStatuses),
    )!;
    const activityCondition = or(createdDuringService, paidOrderDuringService)!;
    const paidPaymentDuringService = and(
      eq(payments.status, 'paid'),
      gte(payments.paidAt, serviceDay.start),
      lt(payments.paidAt, serviceDay.end),
    )!;

    const [paidRevenueRows, paidOrderRows, openOrderRows, activityCountRows] =
      await Promise.all([
        db
          .select({
            value: sql<string>`coalesce(sum(${payments.amountCents}), 0)::bigint`,
          })
          .from(payments)
          .where(paidPaymentDuringService),
        db
          .select({ value: count() })
          .from(orders)
          .where(paidOrderDuringService),
        db
          .select({ value: count() })
          .from(orders)
          .where(openOrderDuringService),
        db.select({ value: count() }).from(orders).where(activityCondition),
      ]);

    const totalItems = activityCountRows[0]?.value ?? 0;
    const pagination = resolveManagementReportsPagination({
      requestedPage: query.page,
      pageSize: query.limit,
      totalItems,
    });
    const activityAt = sql<Date>`greatest(${orders.createdAt}, coalesce(${orders.paidAt}, ${orders.createdAt}))`;
    const rows = await db
      .select({
        id: orders.id,
        orderNumber: orders.orderNumber,
        tableLabel: orders.tableLabel,
        orderType: orders.orderType,
        status: orders.status,
        paymentMode: orders.paymentMode,
        totalCents: orders.totalCents,
        createdAt: orders.createdAt,
        paidAt: orders.paidAt,
        activityAt,
      })
      .from(orders)
      .where(activityCondition)
      .orderBy(desc(activityAt), desc(orders.id))
      .limit(query.limit)
      .offset(pagination.offset);

    return localManagementReportsResponseSchema.parse({
      serviceDay: {
        start: serviceDay.start.toISOString(),
        end: serviceDay.end.toISOString(),
      },
      generatedAt: generatedAt.toISOString(),
      summary: {
        paidRevenueCents: safeNonnegativeInteger(
          paidRevenueRows[0]?.value ?? 0,
        ),
        paidOrderCount: paidOrderRows[0]?.value ?? 0,
        openOrderCount: openOrderRows[0]?.value ?? 0,
      },
      orders: rows.map((order) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        tableLabel: order.tableLabel,
        orderType: order.orderType,
        status: order.status,
        paymentMode: order.paymentMode,
        totalCents: order.totalCents,
        createdAt: order.createdAt.toISOString(),
        paidAt: order.paidAt?.toISOString() ?? null,
      })),
      pagination: {
        page: pagination.page,
        pageSize: query.limit,
        totalItems,
        totalPages: pagination.totalPages,
      },
    });
  }

  return { getManagementReport };
}

export function resolveManagementReportsPagination(input: {
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

function safeNonnegativeInteger(value: string | number): number {
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < 0) {
    throw new Error(
      'Management report aggregate is outside the safe integer range.',
    );
  }
  return parsed;
}
