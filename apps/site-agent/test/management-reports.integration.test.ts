import { getServiceDayWindow } from '@yuta/core';
import {
  createPosDatabaseClient,
  type PosDatabaseClient,
} from '@yuta/db-pos/client';
import { checks, localUsers, orders, payments } from '@yuta/db-pos/schema';
import { config } from 'dotenv';
import { inArray } from 'drizzle-orm';
import { v7 as uuidv7 } from 'uuid';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createManagementReportsService } from '../src/services/management-reports-service';

config({ path: '.env.test' });
config({ path: '.env.local' });

const integrationTest =
  process.env.POS_DATABASE_URL &&
  process.env.YUTA_ALLOW_DATABASE_INTEGRATION_TESTS === 'true'
    ? describe
    : describe.skip;

integrationTest('local Management reports integration', () => {
  let db: PosDatabaseClient;
  const now = new Date();
  const serviceDay = getServiceDayWindow(now);
  const userId = uuidv7();
  const fullPaidOrderId = uuidv7();
  const partialOrderId = uuidv7();
  const refundedOrderId = uuidv7();
  const cancelledOrderId = uuidv7();
  const boundaryStartOrderId = uuidv7();
  const boundaryEndOrderId = uuidv7();
  const voidCheckId = uuidv7();
  const fillerOrderIds = Array.from({ length: 201 }, () => uuidv7());
  const orderIds = [
    fullPaidOrderId,
    partialOrderId,
    refundedOrderId,
    cancelledOrderId,
    boundaryStartOrderId,
    boundaryEndOrderId,
    ...fillerOrderIds,
  ];
  const paymentIds = Array.from({ length: 7 }, () => uuidv7());
  const before = {
    paidRevenueCents: 0,
    paidOrderCount: 0,
    openOrderCount: 0,
    totalItems: 0,
  };

  beforeAll(async () => {
    db = createPosDatabaseClient(process.env);
    const reportService = createManagementReportsService(db, {
      now: () => now,
    });
    const baseline = await reportService.getManagementReport({
      page: 1,
      limit: 1,
    });
    Object.assign(before, {
      ...baseline.summary,
      totalItems: baseline.pagination.totalItems,
    });

    await db.insert(localUsers).values({
      id: userId,
      name: `Reports integration ${userId}`,
      role: 'admin',
    });
    await db.insert(orders).values([
      {
        id: fullPaidOrderId,
        orderNumber: `REPORT-${fullPaidOrderId}`,
        tableLabel: 'Older paid today',
        orderType: 'dine_in',
        status: 'paid',
        paymentMode: 'split_equally',
        totalCents: 3000,
        createdBy: userId,
        createdAt: new Date(serviceDay.start.getTime() - 60_000),
        paidAt: new Date(serviceDay.start.getTime() + 60 * 60 * 1000),
      },
      {
        id: partialOrderId,
        orderNumber: `REPORT-${partialOrderId}`,
        tableLabel: 'Partial split',
        orderType: 'dine_in',
        status: 'served',
        paymentMode: 'split_by_items',
        totalCents: 2500,
        createdBy: userId,
        createdAt: new Date(serviceDay.start.getTime() + 2 * 60 * 60 * 1000),
      },
      {
        id: refundedOrderId,
        orderNumber: `REPORT-${refundedOrderId}`,
        tableLabel: 'Refund excluded',
        orderType: 'takeaway',
        status: 'served',
        totalCents: 700,
        createdBy: userId,
        createdAt: new Date(serviceDay.start.getTime() + 3 * 60 * 60 * 1000),
      },
      {
        id: cancelledOrderId,
        orderNumber: `REPORT-${cancelledOrderId}`,
        tableLabel: 'Cancelled activity',
        orderType: 'delivery',
        status: 'cancelled',
        totalCents: 900,
        createdBy: userId,
        createdAt: new Date(serviceDay.start.getTime() + 4 * 60 * 60 * 1000),
        cancelledAt: new Date(serviceDay.start.getTime() + 5 * 60 * 60 * 1000),
      },
      {
        id: boundaryStartOrderId,
        orderNumber: `REPORT-${boundaryStartOrderId}`,
        tableLabel: 'Start inclusive',
        orderType: 'dine_in',
        status: 'draft',
        createdBy: userId,
        createdAt: serviceDay.start,
      },
      {
        id: boundaryEndOrderId,
        orderNumber: `REPORT-${boundaryEndOrderId}`,
        tableLabel: 'End exclusive',
        orderType: 'dine_in',
        status: 'paid',
        totalCents: 1100,
        createdBy: userId,
        createdAt: new Date(serviceDay.start.getTime() - 120_000),
        paidAt: serviceDay.end,
      },
      ...fillerOrderIds.map((id, index) => ({
        id,
        orderNumber: `REPORT-${id}`,
        tableLabel: `Cancelled filler ${index}`,
        orderType: 'dine_in' as const,
        status: 'cancelled' as const,
        createdBy: userId,
        createdAt: new Date(serviceDay.start.getTime() + 10_000 + index),
        cancelledAt: new Date(serviceDay.start.getTime() + 20_000 + index),
      })),
    ]);
    await db.insert(checks).values({
      id: voidCheckId,
      orderId: fullPaidOrderId,
      checkLabel: 'Voided split excluded',
      splitMode: 'equal',
      status: 'void',
      subtotalCents: 900,
      totalCents: 900,
    });
    await db.insert(payments).values([
      {
        id: paymentIds[0],
        orderId: fullPaidOrderId,
        method: 'card',
        amountCents: 1000,
        status: 'paid',
        paidAt: serviceDay.start,
      },
      {
        id: paymentIds[1],
        orderId: fullPaidOrderId,
        method: 'cash',
        amountCents: 2000,
        tenderedCents: 2500,
        changeCents: 500,
        tipCents: 200,
        status: 'paid',
        paidAt: new Date(serviceDay.start.getTime() + 30_000),
      },
      {
        id: paymentIds[2],
        orderId: partialOrderId,
        method: 'card',
        amountCents: 500,
        status: 'paid',
        paidAt: new Date(serviceDay.start.getTime() + 2 * 60 * 60 * 1000),
      },
      {
        id: paymentIds[3],
        orderId: refundedOrderId,
        method: 'card',
        amountCents: 700,
        status: 'refunded',
        paidAt: new Date(serviceDay.start.getTime() + 3 * 60 * 60 * 1000),
        refundedAt: new Date(serviceDay.start.getTime() + 4 * 60 * 60 * 1000),
      },
      {
        id: paymentIds[4],
        orderId: boundaryEndOrderId,
        method: 'card',
        amountCents: 1100,
        status: 'paid',
        paidAt: serviceDay.end,
      },
      {
        id: paymentIds[5],
        orderId: boundaryStartOrderId,
        method: 'card',
        amountCents: 400,
        status: 'pending',
      },
      {
        id: paymentIds[6],
        orderId: refundedOrderId,
        method: 'card',
        amountCents: 800,
        status: 'failed',
      },
    ]);
  });

  afterAll(async () => {
    await db.delete(payments).where(inArray(payments.id, paymentIds));
    await db.delete(checks).where(inArray(checks.id, [voidCheckId]));
    await db.delete(orders).where(inArray(orders.id, orderIds));
    await db.delete(localUsers).where(inArray(localUsers.id, [userId]));
    await db.$client.end({ timeout: 5 });
  });

  it('uses payment, order, cancellation, refund, boundary, and bounded semantics', async () => {
    const reportService = createManagementReportsService(db, {
      now: () => now,
    });
    const report = await reportService.getManagementReport({
      page: 999,
      limit: 50,
    });

    expect(report.summary.paidRevenueCents - before.paidRevenueCents).toBe(
      3500,
    );
    expect(report.summary.paidOrderCount - before.paidOrderCount).toBe(1);
    expect(report.summary.openOrderCount - before.openOrderCount).toBe(3);
    expect(report.pagination.totalItems - before.totalItems).toBe(206);
    expect(report.pagination.totalPages).toBeGreaterThanOrEqual(5);
    expect(report.pagination.page).toBe(report.pagination.totalPages);
  });
});
