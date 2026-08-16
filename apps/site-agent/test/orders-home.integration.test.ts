import { getServiceDayWindow } from '@yuta/core';
import {
  createPosDatabaseClient,
  type PosDatabaseClient,
} from '@yuta/db-pos/client';
import {
  localUsers,
  menuCategories,
  menuItems,
  orderItems,
  orders,
} from '@yuta/db-pos/schema';
import { config } from 'dotenv';
import { inArray } from 'drizzle-orm';
import { v7 as uuidv7 } from 'uuid';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createSiteAgentService } from '../src/services/site-agent-service';

config({ path: '.env.test' });
config({ path: '.env.local' });

const integrationTest =
  process.env.POS_DATABASE_URL &&
  process.env.YUTA_ALLOW_DATABASE_INTEGRATION_TESTS === 'true'
    ? describe
    : describe.skip;

integrationTest('POS Home summary integration', () => {
  let db: PosDatabaseClient;
  const userId = uuidv7();
  const categoryId = uuidv7();
  const menuItemId = uuidv7();
  const currentOpenId = uuidv7();
  const priorOpenId = uuidv7();
  const paidTodayId = uuidv7();
  const cancelledTodayId = uuidv7();
  const orderIds = [currentOpenId, priorOpenId, paidTodayId, cancelledTodayId];
  const uniqueLabel = `Home integration ${currentOpenId}`;

  beforeAll(async () => {
    db = createPosDatabaseClient(process.env);
    const serviceDay = getServiceDayWindow(new Date());
    await db.insert(localUsers).values({
      id: userId,
      name: `Home integration ${userId}`,
      role: 'admin',
    });
    await db.insert(menuCategories).values({
      id: categoryId,
      name: `Home integration ${categoryId}`,
    });
    await db.insert(menuItems).values({
      id: menuItemId,
      categoryId,
      name: `Home integration ${menuItemId}`,
      priceCents: 1200,
      kitchenStation: 'kitchen',
    });
    await db.insert(orders).values([
      {
        id: currentOpenId,
        orderNumber: `HOME-${currentOpenId}`,
        tableLabel: uniqueLabel,
        orderType: 'dine_in',
        status: 'sent',
        totalCents: 1200,
        createdBy: userId,
        createdAt: new Date(serviceDay.start.getTime() + 60 * 60 * 1000),
      },
      {
        id: priorOpenId,
        orderNumber: `HOME-${priorOpenId}`,
        tableLabel: 'Prior open',
        orderType: 'dine_in',
        status: 'sent',
        createdBy: userId,
        createdAt: new Date(serviceDay.start.getTime() - 1),
      },
      {
        id: paidTodayId,
        orderNumber: `HOME-${paidTodayId}`,
        tableLabel: 'Paid today',
        orderType: 'takeaway',
        status: 'paid',
        createdBy: userId,
        createdAt: new Date(serviceDay.start.getTime() - 24 * 60 * 60 * 1000),
        paidAt: new Date(serviceDay.start.getTime() + 2 * 60 * 60 * 1000),
      },
      {
        id: cancelledTodayId,
        orderNumber: `HOME-${cancelledTodayId}`,
        tableLabel: 'Cancelled today',
        orderType: 'delivery',
        status: 'cancelled',
        createdBy: userId,
        createdAt: new Date(serviceDay.start.getTime() + 3 * 60 * 60 * 1000),
      },
    ]);
    await db.insert(orderItems).values({
      id: uuidv7(),
      orderId: currentOpenId,
      menuItemId,
      itemNameSnapshot: 'Allergy item',
      unitPriceCentsSnapshot: 1200,
      kitchenStationSnapshot: 'kitchen',
      quantity: 1,
      hasAllergy: true,
    });
  });

  afterAll(async () => {
    await db.delete(orderItems).where(inArray(orderItems.orderId, orderIds));
    await db.delete(orders).where(inArray(orders.id, orderIds));
    await db.delete(menuItems).where(inArray(menuItems.id, [menuItemId]));
    await db
      .delete(menuCategories)
      .where(inArray(menuCategories.id, [categoryId]));
    await db.delete(localUsers).where(inArray(localUsers.id, [userId]));
    await db.$client.end({ timeout: 5 });
  });

  it('applies service-day views and returns persisted summary fields', async () => {
    const service = createSiteAgentService(db);
    const open = await service.listOrdersHome({
      view: 'open',
      q: uniqueLabel,
      page: 1,
      limit: 50,
    });
    const paid = await service.listOrdersHome({
      view: 'paid_today',
      q: '',
      page: 1,
      limit: 50,
    });
    const activity = await service.listOrdersHome({
      view: 'all_today',
      q: uniqueLabel,
      page: 99,
      limit: 50,
    });

    expect(open.orders).toEqual([
      expect.objectContaining({
        id: currentOpenId,
        itemCount: 1,
        hasAllergy: true,
        totalCents: 1200,
      }),
    ]);
    expect(open.counts.open).toBeGreaterThanOrEqual(1);
    expect(paid.orders.some(({ id }) => id === paidTodayId)).toBe(true);
    expect(activity.orders.map(({ id }) => id)).toEqual([currentOpenId]);
    expect(activity.pagination.page).toBe(1);
  });
});
