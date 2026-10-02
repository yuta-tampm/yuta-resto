import type { PosDatabaseExecutor } from '@yuta/db-pos/client';
import {
  localUsers,
  orderDiscountItems,
  orderDiscounts,
  orderItems,
  orders,
  payments,
  type Order,
  type OrderItem,
} from '@yuta/db-pos/schema';
import { and, asc, eq, inArray, ne } from 'drizzle-orm';
import { HttpError } from '../http';
import { toOrderSummary } from './order-summary';

export async function getRequiredOrder(
  db: PosDatabaseExecutor,
  orderId: string,
): Promise<Order> {
  const order = await db.query.orders.findFirst({
    where: eq(orders.id, orderId),
  });
  if (!order) {
    throw new HttpError(404, 'ORDER_NOT_FOUND', 'Order not found.');
  }
  return order;
}

export async function getRequiredOrderItem(
  db: PosDatabaseExecutor,
  orderItemId: string,
): Promise<OrderItem> {
  const item = await db.query.orderItems.findFirst({
    where: eq(orderItems.id, orderItemId),
  });
  if (!item) {
    throw new HttpError(404, 'ORDER_ITEM_NOT_FOUND', 'Order item not found.');
  }
  return item;
}

export async function requireActiveLocalUser(
  db: PosDatabaseExecutor,
  userId: string,
): Promise<void> {
  const user = await db.query.localUsers.findFirst({
    where: eq(localUsers.id, userId),
  });
  if (!user?.isActive) {
    throw new HttpError(
      422,
      'STAFF_USER_UNAVAILABLE',
      'The selected local user is not available.',
    );
  }
}

export async function assertOrderCanChangeItems(
  db: PosDatabaseExecutor,
  order: Order,
): Promise<void> {
  if (order.status === 'paid' || order.status === 'cancelled') {
    throw new HttpError(
      409,
      'INVALID_ORDER_STATUS',
      'Paid or cancelled orders cannot be changed.',
    );
  }
  if (order.paymentMode !== 'single') {
    throw new HttpError(
      409,
      'ACTIVE_PAYMENT_SPLIT',
      'Orders with an active payment split cannot be changed.',
    );
  }
  const paidPayment = await db.query.payments.findFirst({
    where: and(eq(payments.orderId, order.id), eq(payments.status, 'paid')),
  });
  if (paidPayment) {
    throw new HttpError(
      409,
      'ORDER_HAS_PAYMENT',
      'Orders with a recorded payment cannot be changed.',
    );
  }
}

export async function cancelItem(
  db: PosDatabaseExecutor,
  item: OrderItem,
  reason?: string,
) {
  return db
    .update(orderItems)
    .set({
      status: 'cancelled',
      cancelledAt: new Date(),
      cancelledReason: reason,
    })
    .where(eq(orderItems.id, item.id))
    .returning();
}

export async function recalculateOrder(
  db: PosDatabaseExecutor,
  orderId: string,
): Promise<void> {
  const activeItems = await db
    .select()
    .from(orderItems)
    .where(
      and(eq(orderItems.orderId, orderId), ne(orderItems.status, 'cancelled')),
    );
  const subtotalCents = activeItems.reduce(
    (sum, item) => sum + item.unitPriceCentsSnapshot * item.quantity,
    0,
  );
  const order = await getRequiredOrder(db, orderId);
  await db
    .update(orders)
    .set({
      subtotalCents,
      totalCents: Math.max(0, subtotalCents - order.discountCents),
      hasAllergy: activeItems.some((item) => item.hasAllergy),
    })
    .where(eq(orders.id, orderId));
}

export async function refreshOrderStatus(
  db: PosDatabaseExecutor,
  orderId: string,
): Promise<void> {
  const order = await getRequiredOrder(db, orderId);
  if (order.status === 'paid' || order.status === 'cancelled') {
    return;
  }
  const items = await db
    .select()
    .from(orderItems)
    .where(
      and(eq(orderItems.orderId, orderId), ne(orderItems.status, 'cancelled')),
    );
  const status =
    items.length === 0
      ? 'draft'
      : items.every((item) => item.status === 'served')
        ? 'served'
        : items.every(
              (item) => item.status === 'ready' || item.status === 'served',
            )
          ? 'ready'
          : items.some((item) => item.status === 'preparing')
            ? 'preparing'
            : items.some((item) => item.status === 'sent')
              ? 'sent'
              : 'draft';
  await db.update(orders).set({ status }).where(eq(orders.id, orderId));
}

export async function loadOrderDetail(db: PosDatabaseExecutor, order: Order) {
  const [items, discountRows] = await Promise.all([
    db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, order.id))
      .orderBy(asc(orderItems.createdAt), asc(orderItems.id)),
    db
      .select()
      .from(orderDiscounts)
      .where(eq(orderDiscounts.orderId, order.id))
      .orderBy(asc(orderDiscounts.createdAt), asc(orderDiscounts.id)),
  ]);
  const discountItemRows =
    discountRows.length === 0
      ? []
      : await db
          .select({
            orderDiscountId: orderDiscountItems.orderDiscountId,
            quantityApplied: orderDiscountItems.quantityApplied,
            orderItemId: orderItems.id,
            itemNameSnapshot: orderItems.itemNameSnapshot,
          })
          .from(orderDiscountItems)
          .innerJoin(
            orderItems,
            eq(orderDiscountItems.orderItemId, orderItems.id),
          )
          .where(
            inArray(
              orderDiscountItems.orderDiscountId,
              discountRows.map((discount) => discount.id),
            ),
          );
  return {
    order: toOrderSummary(order),
    items: items.map(toOrderItem),
    discounts: discountRows.map((discount) => ({
      id: discount.id,
      nameSnapshot: discount.nameSnapshot,
      discountCents: discount.discountCents,
      items: discountItemRows
        .filter((item) => item.orderDiscountId === discount.id)
        .map((item) => ({
          quantityApplied: item.quantityApplied,
          orderItem: {
            id: item.orderItemId,
            itemNameSnapshot: item.itemNameSnapshot,
          },
        })),
    })),
  };
}

export function toOrderItem(item: OrderItem) {
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
  };
}
