import { config } from 'dotenv';
import { eq, inArray } from 'drizzle-orm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { v7 as uuidv7 } from 'uuid';
import {
  createPosDatabaseClient,
  type PosDatabaseClient,
} from '@yuta/db-pos/client';
import {
  checkDiscountItems,
  checkDiscounts,
  checkItems,
  checks,
  comboRuleGroupItems,
  comboRuleGroups,
  comboRules,
  localUsers,
  menuCategories,
  menuItems,
  orderDiscountItems,
  orderDiscounts,
  orderItems,
  orders,
} from '@yuta/db-pos/schema';
import { createComboPersistenceService } from '../src/services/combo-persistence-service';

config({ path: '.env.test' });
config({ path: '.env.local' });

const integrationTest =
  process.env.POS_DATABASE_URL &&
  process.env.YUTA_ALLOW_DATABASE_INTEGRATION_TESTS === 'true'
    ? describe
    : describe.skip;

integrationTest('combo persistence integration', () => {
  let db: PosDatabaseClient;
  const userId = uuidv7();
  const categoryId = uuidv7();
  const mainItemId = uuidv7();
  const drinkItemId = uuidv7();
  const ruleId = uuidv7();
  const mainGroupId = uuidv7();
  const drinkGroupId = uuidv7();
  const orderId = uuidv7();
  const mainOrderItemId = uuidv7();
  const drinkOrderItemId = uuidv7();
  const checkId = uuidv7();
  const originalRuleName = `Persistence combo ${ruleId}`;

  beforeAll(async () => {
    db = createPosDatabaseClient(process.env);
    await db.insert(localUsers).values({
      id: userId,
      name: `Combo persistence ${userId}`,
      role: 'admin',
    });
    await db.insert(menuCategories).values({
      id: categoryId,
      name: `Combo persistence ${categoryId}`,
    });
    await db.insert(menuItems).values([
      {
        id: mainItemId,
        categoryId,
        name: `Main ${mainItemId}`,
        priceCents: 1400,
        kitchenStation: 'kitchen',
      },
      {
        id: drinkItemId,
        categoryId,
        name: `Drink ${drinkItemId}`,
        priceCents: 300,
        kitchenStation: 'bar',
      },
    ]);
    await db.insert(comboRules).values({
      id: ruleId,
      name: originalRuleName,
      comboPriceCents: 1400,
      priority: 1,
      isSuggestionEnabled: false,
    });
    await db.insert(comboRuleGroups).values([
      {
        id: mainGroupId,
        comboRuleId: ruleId,
        name: 'Plat',
        minQuantity: 1,
        maxQuantity: 1,
        sortOrder: 1,
      },
      {
        id: drinkGroupId,
        comboRuleId: ruleId,
        name: 'Boisson',
        minQuantity: 1,
        maxQuantity: 1,
        sortOrder: 2,
      },
    ]);
    await db.insert(comboRuleGroupItems).values([
      {
        id: uuidv7(),
        comboRuleGroupId: mainGroupId,
        menuItemId: mainItemId,
        extraPriceCents: 0,
      },
      {
        id: uuidv7(),
        comboRuleGroupId: drinkGroupId,
        menuItemId: drinkItemId,
        extraPriceCents: 0,
      },
    ]);
    await db.insert(orders).values({
      id: orderId,
      orderNumber: `COMBO-${orderId}`,
      tableLabel: 'Combo persistence',
      orderType: 'dine_in',
      subtotalCents: 1700,
      totalCents: 1700,
      createdBy: userId,
    });
    await db.insert(orderItems).values([
      {
        id: mainOrderItemId,
        orderId,
        menuItemId: mainItemId,
        itemNameSnapshot: 'Main snapshot',
        unitPriceCentsSnapshot: 1400,
        kitchenStationSnapshot: 'kitchen',
        quantity: 1,
      },
      {
        id: drinkOrderItemId,
        orderId,
        menuItemId: drinkItemId,
        itemNameSnapshot: 'Drink snapshot',
        unitPriceCentsSnapshot: 300,
        kitchenStationSnapshot: 'bar',
        quantity: 1,
      },
    ]);
  });

  afterAll(async () => {
    if (!db) return;

    const checkDiscountRows = await db
      .select({ id: checkDiscounts.id })
      .from(checkDiscounts)
      .where(eq(checkDiscounts.checkId, checkId));
    if (checkDiscountRows.length > 0) {
      await db.delete(checkDiscountItems).where(
        inArray(
          checkDiscountItems.checkDiscountId,
          checkDiscountRows.map(({ id }) => id),
        ),
      );
    }
    await db.delete(checkDiscounts).where(eq(checkDiscounts.checkId, checkId));
    await db.delete(checkItems).where(eq(checkItems.checkId, checkId));
    await db.delete(checks).where(eq(checks.id, checkId));

    const orderDiscountRows = await db
      .select({ id: orderDiscounts.id })
      .from(orderDiscounts)
      .where(eq(orderDiscounts.orderId, orderId));
    if (orderDiscountRows.length > 0) {
      await db.delete(orderDiscountItems).where(
        inArray(
          orderDiscountItems.orderDiscountId,
          orderDiscountRows.map(({ id }) => id),
        ),
      );
    }
    await db.delete(orderDiscounts).where(eq(orderDiscounts.orderId, orderId));
    await db.delete(orderItems).where(eq(orderItems.orderId, orderId));
    await db.delete(orders).where(eq(orders.id, orderId));
    await db
      .delete(comboRuleGroupItems)
      .where(
        inArray(comboRuleGroupItems.comboRuleGroupId, [
          mainGroupId,
          drinkGroupId,
        ]),
      );
    await db
      .delete(comboRuleGroups)
      .where(eq(comboRuleGroups.comboRuleId, ruleId));
    await db.delete(comboRules).where(eq(comboRules.id, ruleId));
    await db
      .delete(menuItems)
      .where(inArray(menuItems.id, [mainItemId, drinkItemId]));
    await db.delete(menuCategories).where(eq(menuCategories.id, categoryId));
    await db.delete(localUsers).where(eq(localUsers.id, userId));
    await db.$client.end({ timeout: 5 });
  });

  it('persists order/check discounts and keeps historical snapshots', async () => {
    await db.transaction(async (tx) => {
      await createComboPersistenceService(tx).optimizeOrder(orderId);
    });
    const order = await db.query.orders.findFirst({
      where: eq(orders.id, orderId),
    });
    expect(order).toMatchObject({
      subtotalCents: 1700,
      discountCents: 300,
      totalCents: 1400,
    });
    const [orderDiscount] = await db
      .select()
      .from(orderDiscounts)
      .where(eq(orderDiscounts.orderId, orderId));
    expect(orderDiscount).toMatchObject({
      comboRuleId: ruleId,
      nameSnapshot: originalRuleName,
      discountCents: 300,
    });
    expect(
      await db
        .select()
        .from(orderDiscountItems)
        .where(eq(orderDiscountItems.orderDiscountId, orderDiscount.id)),
    ).toHaveLength(2);

    await db.insert(checks).values({
      id: checkId,
      orderId,
      checkLabel: 'Client 1',
      splitMode: 'items',
      subtotalCents: 1700,
      totalCents: 1700,
    });
    await db.insert(checkItems).values([
      {
        id: uuidv7(),
        checkId,
        orderItemId: mainOrderItemId,
        quantity: 1,
        amountCentsSnapshot: 1400,
      },
      {
        id: uuidv7(),
        checkId,
        orderItemId: drinkOrderItemId,
        quantity: 1,
        amountCentsSnapshot: 300,
      },
    ]);
    await db.transaction(async (tx) => {
      await createComboPersistenceService(tx).optimizeCheck(checkId);
    });
    const check = await db.query.checks.findFirst({
      where: eq(checks.id, checkId),
    });
    expect(check).toMatchObject({ discountCents: 300, totalCents: 1400 });
    const [checkDiscount] = await db
      .select()
      .from(checkDiscounts)
      .where(eq(checkDiscounts.checkId, checkId));
    expect(checkDiscount).toMatchObject({
      comboRuleId: ruleId,
      nameSnapshot: originalRuleName,
      discountCents: 300,
    });
    expect(
      await db
        .select()
        .from(checkDiscountItems)
        .where(eq(checkDiscountItems.checkDiscountId, checkDiscount.id)),
    ).toHaveLength(2);

    await db
      .update(comboRules)
      .set({ name: `${originalRuleName} renamed`, isActive: false })
      .where(eq(comboRules.id, ruleId));
    expect(
      await db.query.orderDiscounts.findFirst({
        where: eq(orderDiscounts.id, orderDiscount.id),
      }),
    ).toMatchObject({ nameSnapshot: originalRuleName, discountCents: 300 });
    expect(
      await db.query.checkDiscounts.findFirst({
        where: eq(checkDiscounts.id, checkDiscount.id),
      }),
    ).toMatchObject({ nameSnapshot: originalRuleName, discountCents: 300 });
  });
});
