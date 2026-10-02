import {
  localKitchenSendResponseSchema,
  localOrderDetailResponseSchema,
  type LocalOrderCommand,
} from '@yuta/contracts/local-pos';
import type { PosDatabaseExecutor } from '@yuta/db-pos/client';
import {
  menuCategories,
  menuItems,
  orderItems,
  orders,
  payments,
  printJobs,
} from '@yuta/db-pos/schema';
import { and, eq, inArray } from 'drizzle-orm';
import { v7 as uuidv7 } from 'uuid';
import { HttpError } from '../http';
import {
  buildKitchenPayload,
  buildTicketPlans,
  kitchenProductionStations,
  toPrintJob,
} from './kitchen-ticket-plans';
import {
  getRequiredOrder,
  loadOrderDetail,
  refreshOrderStatus,
  requireActiveLocalUser,
} from './order-command-helpers';
import { ensurePrintSettings } from './print-settings-service';

export async function markKitchenStationPreparing(
  db: PosDatabaseExecutor,
  orderId: string,
  station: 'kitchen' | 'bar' | 'dessert' | 'counter',
) {
  const order = await getRequiredOrder(db, orderId);
  if (order.status === 'cancelled') {
    throw new HttpError(
      409,
      'ORDER_CANCELLED',
      'Cancelled orders cannot be changed.',
    );
  }

  const preparedItems = await db
    .update(orderItems)
    .set({ status: 'preparing', readyAt: null, servedAt: null })
    .where(
      and(
        eq(orderItems.orderId, orderId),
        kitchenStationCondition(station),
        eq(orderItems.status, 'sent'),
      ),
    )
    .returning({ id: orderItems.id });

  if (preparedItems.length > 0) {
    await refreshOrderStatus(db, orderId);
  }
  return localOrderDetailResponseSchema.parse(
    await loadOrderDetail(db, await getRequiredOrder(db, orderId)),
  );
}

export async function markKitchenStationSent(
  db: PosDatabaseExecutor,
  orderId: string,
  station: 'kitchen' | 'bar' | 'dessert' | 'counter',
) {
  const order = await getRequiredOrder(db, orderId);
  if (order.status === 'cancelled') {
    throw new HttpError(
      409,
      'ORDER_CANCELLED',
      'Cancelled orders cannot be changed.',
    );
  }

  const revertedItems = await db
    .update(orderItems)
    .set({ status: 'sent', readyAt: null, servedAt: null })
    .where(
      and(
        eq(orderItems.orderId, orderId),
        kitchenStationCondition(station),
        eq(orderItems.status, 'preparing'),
      ),
    )
    .returning({ id: orderItems.id });

  if (revertedItems.length > 0) {
    await refreshOrderStatus(db, orderId);
  }
  return localOrderDetailResponseSchema.parse(
    await loadOrderDetail(db, await getRequiredOrder(db, orderId)),
  );
}

function kitchenStationCondition(
  station: 'kitchen' | 'bar' | 'dessert' | 'counter',
) {
  return inArray(
    orderItems.kitchenStationSnapshot,
    kitchenProductionStations(station),
  );
}

export async function sendToKitchen(
  db: PosDatabaseExecutor,
  orderId: string,
  command: Extract<LocalOrderCommand, { action: 'send_to_kitchen' }>,
) {
  await requireActiveLocalUser(db, command.staffUserId);
  const existingJob = await db.query.printJobs.findFirst({
    where: eq(printJobs.idempotencyKey, command.idempotencyKey),
  });
  if (existingJob) {
    if (
      existingJob.orderId !== orderId ||
      existingJob.jobType !== 'kitchen_ticket'
    ) {
      throw new HttpError(
        409,
        'IDEMPOTENCY_CONFLICT',
        'Idempotency key is already used by another command.',
      );
    }
    const detail = await loadOrderDetail(
      db,
      await getRequiredOrder(db, orderId),
    );
    return localKitchenSendResponseSchema.parse({
      ...detail,
      printJob: toPrintJob(existingJob),
      replayed: true,
    });
  }
  const paymentWithKey = await db.query.payments.findFirst({
    where: eq(payments.idempotencyKey, command.idempotencyKey),
  });
  if (paymentWithKey) {
    throw new HttpError(
      409,
      'IDEMPOTENCY_CONFLICT',
      'Idempotency key is already used by a payment.',
    );
  }

  const order = await getRequiredOrder(db, orderId);
  if (order.status === 'paid' || order.status === 'cancelled') {
    throw new HttpError(
      409,
      'INVALID_ORDER_STATUS',
      'Paid or cancelled orders cannot be sent to kitchen.',
    );
  }
  const pendingItems = await db
    .select()
    .from(orderItems)
    .where(
      and(eq(orderItems.orderId, orderId), eq(orderItems.status, 'pending')),
    );
  if (pendingItems.length === 0) {
    throw new HttpError(
      409,
      'EMPTY_KITCHEN_SEND',
      'Order has no pending items to send.',
    );
  }
  const [settings, itemCategories] = await Promise.all([
    ensurePrintSettings(db),
    db
      .select({
        menuItemId: menuItems.id,
        categoryName: menuCategories.name,
        requiredVariantQuantity: menuItems.requiredVariantQuantity,
        variantOptions: menuItems.variantOptions,
      })
      .from(menuItems)
      .innerJoin(menuCategories, eq(menuItems.categoryId, menuCategories.id))
      .where(
        inArray(
          menuItems.id,
          pendingItems.map((item) => item.menuItemId),
        ),
      ),
  ]);
  const categoryByMenuItemId = new Map(
    itemCategories.map((item) => [item.menuItemId, item.categoryName]),
  );
  const variantPolicyByMenuItemId = new Map(
    itemCategories.map((item) => [item.menuItemId, item]),
  );
  const incompleteVariantItem = pendingItems.find((item) => {
    const policy = variantPolicyByMenuItemId.get(item.menuItemId);
    const requiredPerPortion = policy?.requiredVariantQuantity ?? 0;
    const allowedCodes = new Set(
      policy?.variantOptions.map(({ code }) => code) ?? [],
    );
    return (
      item.selectedVariants.some(({ code }) => !allowedCodes.has(code)) ||
      (requiredPerPortion > 0 &&
        item.selectedVariants.reduce(
          (sum, variant) => sum + variant.quantity,
          0,
        ) !==
          item.quantity * requiredPerPortion)
    );
  });
  if (incompleteVariantItem) {
    const requiredTotal =
      incompleteVariantItem.quantity *
      (variantPolicyByMenuItemId.get(incompleteVariantItem.menuItemId)
        ?.requiredVariantQuantity ?? 0);
    throw new HttpError(
      422,
      'INVALID_VARIANT_QUANTITY',
      `Select exactly ${requiredTotal} item variants before sending.`,
    );
  }

  const allergyItems = pendingItems.filter(
    (item) => item.hasAllergy && !item.allergyAcknowledgedAt,
  );
  if (allergyItems.length > 0 && !command.allergyAcknowledged) {
    throw new HttpError(
      409,
      'ALLERGY_ACKNOWLEDGEMENT_REQUIRED',
      'Every pending item allergy must be acknowledged before sending.',
    );
  }
  const now = new Date();
  if (allergyItems.length > 0) {
    await db
      .update(orderItems)
      .set({
        allergyAcknowledgedAt: now,
        allergyAcknowledgedBy: command.staffUserId,
      })
      .where(
        inArray(
          orderItems.id,
          allergyItems.map((item) => item.id),
        ),
      );
  }
  await db
    .update(orderItems)
    .set({ status: 'sent', sentAt: now })
    .where(
      and(eq(orderItems.orderId, orderId), eq(orderItems.status, 'pending')),
    );
  const [sentOrder] = await db
    .update(orders)
    .set({
      status: 'sent',
      sentAt: order.sentAt ?? now,
      ...(allergyItems.length > 0
        ? {
            hasAllergy: true,
            allergyAcknowledgedAt: now,
            allergyAcknowledgedBy: command.staffUserId,
          }
        : {}),
    })
    .where(eq(orders.id, orderId))
    .returning();

  const sentItems = pendingItems.map((item) => ({
    ...item,
    status: 'sent' as const,
    sentAt: now,
    allergyAcknowledgedAt:
      item.hasAllergy && !item.allergyAcknowledgedAt
        ? now
        : item.allergyAcknowledgedAt,
  }));
  const ticketPlans = buildTicketPlans(sentItems, settings);
  const createdPrintJobs = await db
    .insert(printJobs)
    .values(
      ticketPlans.map((plan, index) => ({
        id: uuidv7(),
        orderId,
        source: 'pos' as const,
        printerName:
          plan.destination === 'kitchen'
            ? 'tm-m30-cuisine'
            : 'tm-m30-bar-desserts',
        jobType: 'kitchen_ticket' as const,
        payload: buildKitchenPayload(
          sentOrder,
          plan.items,
          plan.destination,
          plan.copies,
          settings,
          categoryByMenuItemId,
          plan.includeAllItems,
        ),
        idempotencyKey: index === 0 ? command.idempotencyKey : null,
      })),
    )
    .returning();
  const printJob = createdPrintJobs[0];
  if (!printJob) throw new Error('Kitchen send did not create a print job.');
  const detail = await loadOrderDetail(db, sentOrder);

  return localKitchenSendResponseSchema.parse({
    ...detail,
    printJob: toPrintJob(printJob),
    replayed: false,
  });
}
