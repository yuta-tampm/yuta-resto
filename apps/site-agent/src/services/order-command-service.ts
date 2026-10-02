import {
  localOrderDetailResponseSchema,
  localOrderItemResponseSchema,
  type AddLocalOrderItemInput,
  type LocalOrderCommand,
  type LocalOrderItemCommand,
  type UpdateLocalOrderItemInput,
} from '@yuta/contracts/local-pos';
import type { PosDatabaseExecutor } from '@yuta/db-pos/client';
import {
  checks,
  menuCategories,
  menuItems,
  orderItems,
  orders,
  payments,
  type OrderItem,
} from '@yuta/db-pos/schema';
import { and, eq, ne, sql } from 'drizzle-orm';
import { v7 as uuidv7 } from 'uuid';
import { HttpError } from '../http';
import {
  buildAllergenSnapshots,
  buildInstructionSnapshots,
  buildVariantSnapshots,
} from './instruction-snapshots';
import {
  ensureInstructionSettings,
  resolveInstructionConfig,
} from './instruction-settings-service';
import {
  assertOrderCanChangeItems,
  cancelItem,
  getRequiredOrder,
  getRequiredOrderItem,
  loadOrderDetail,
  recalculateOrder,
  refreshOrderStatus,
  requireActiveLocalUser,
  toOrderItem,
} from './order-command-helpers';
import {
  markKitchenStationPreparing,
  markKitchenStationSent,
  sendToKitchen,
} from './order-kitchen-commands';

export {
  buildTicketPlans,
  kitchenProductionStations,
} from './kitchen-ticket-plans';

export function createOrderCommandService(db: PosDatabaseExecutor) {
  async function getOrderDetail(orderId: string) {
    const order = await getRequiredOrder(db, orderId);
    return localOrderDetailResponseSchema.parse(
      await loadOrderDetail(db, order),
    );
  }

  async function addOrderItem(orderId: string, input: AddLocalOrderItemInput) {
    return db.transaction(async (tx) => {
      await tx.execute(
        sql`select ${orders.id} from ${orders} where ${orders.id} = ${orderId} for update`,
      );
      const order = await getRequiredOrder(tx, orderId);
      await assertOrderCanChangeItems(tx, order);
      const menuItem = await tx.query.menuItems.findFirst({
        where: eq(menuItems.id, input.menuItemId),
      });
      if (!menuItem) {
        throw new HttpError(404, 'MENU_ITEM_NOT_FOUND', 'Menu item not found.');
      }
      if (!menuItem.isAvailable) {
        throw new HttpError(
          422,
          'MENU_ITEM_UNAVAILABLE',
          'Menu item is not available.',
        );
      }

      const requiresSeparatePortion = menuItem.orderingPolicy === 'separate';
      if (menuItem.requiredVariantQuantity > 0 && !requiresSeparatePortion) {
        throw new HttpError(
          422,
          'VARIANT_ITEM_SEPARATE_PORTION_REQUIRED',
          'Items with required variants must use separate portions.',
        );
      }
      if (requiresSeparatePortion && input.quantity !== 1) {
        throw new HttpError(
          422,
          'SEPARATE_PORTION_QUANTITY_REQUIRED',
          'This menu item must be added one portion at a time.',
        );
      }

      const selectedVariants = buildVariantSnapshots(
        menuItem.variantOptions,
        menuItem.requiredVariantQuantity,
        input.quantity,
        input.selectedVariants ?? [],
      );
      const existing = requiresSeparatePortion
        ? undefined
        : await tx.query.orderItems.findFirst({
            where: and(
              eq(orderItems.orderId, orderId),
              eq(orderItems.menuItemId, menuItem.id),
              eq(orderItems.status, 'pending'),
              sql`${orderItems.note} is null`,
            ),
          });
      let item: OrderItem;
      if (existing && !input.note) {
        [item] = await tx
          .update(orderItems)
          .set({ quantity: existing.quantity + input.quantity })
          .where(eq(orderItems.id, existing.id))
          .returning();
      } else {
        [item] = await tx
          .insert(orderItems)
          .values({
            id: uuidv7(),
            orderId,
            menuItemId: menuItem.id,
            itemNameSnapshot: menuItem.name,
            unitPriceCentsSnapshot: menuItem.priceCents,
            kitchenStationSnapshot: menuItem.kitchenStation,
            quantity: input.quantity,
            note: input.note,
            selectedVariants,
          })
          .returning();
      }

      await recalculateOrder(tx, orderId);
      return localOrderItemResponseSchema.parse({ item: toOrderItem(item) });
    });
  }

  async function updateOrderItem(
    orderItemId: string,
    input: UpdateLocalOrderItemInput,
  ) {
    const item = await getRequiredOrderItem(db, orderItemId);
    const order = await getRequiredOrder(db, item.orderId);
    const menuItem = await db.query.menuItems.findFirst({
      where: eq(menuItems.id, item.menuItemId),
    });
    if (!menuItem) {
      throw new HttpError(404, 'MENU_ITEM_NOT_FOUND', 'Menu item not found.');
    }
    const [category, instructionSettings] = await Promise.all([
      db.query.menuCategories.findFirst({
        where: eq(menuCategories.id, menuItem.categoryId),
      }),
      ensureInstructionSettings(db),
    ]);
    if (!category) {
      throw new HttpError(
        404,
        'MENU_CATEGORY_NOT_FOUND',
        'Menu category not found.',
      );
    }
    await assertOrderCanChangeItems(db, order);
    if (item.status !== 'pending') {
      throw new HttpError(
        409,
        'INVALID_ITEM_STATUS',
        'Only pending order items can be edited.',
      );
    }

    const quantity = input.quantity ?? item.quantity;
    if (
      menuItem.orderingPolicy === 'separate' &&
      input.quantity !== undefined &&
      quantity !== 1
    ) {
      throw new HttpError(
        422,
        'SEPARATE_PORTION_QUANTITY_REQUIRED',
        'This menu item must remain a single portion.',
      );
    }
    const requestedAllergens = input.allergenCodes ?? item.allergenCodes;
    const hasAllergy = input.hasAllergy ?? item.hasAllergy;
    const allergySeverity = hasAllergy
      ? (input.allergySeverity ?? item.allergySeverity)
      : null;
    const allergyNote = hasAllergy
      ? (input.allergyNote ?? item.allergyNote)
      : null;
    const allergenCodes = hasAllergy ? requestedAllergens : [];
    const selectedAllergens = hasAllergy
      ? buildAllergenSnapshots(
          instructionSettings.allergenOptions,
          allergenCodes,
        )
      : [];
    if (hasAllergy && allergenCodes.length === 0) {
      throw new HttpError(
        422,
        'ALLERGEN_REQUIRED',
        'At least one allergen is required.',
      );
    }
    if (hasAllergy && !allergySeverity) {
      throw new HttpError(
        422,
        'ALLERGY_SEVERITY_REQUIRED',
        'Allergy severity is required.',
      );
    }
    if (hasAllergy && allergenCodes.includes('OTHER') && !allergyNote) {
      throw new HttpError(
        422,
        'ALLERGY_DETAIL_REQUIRED',
        'Allergy details are required for Other.',
      );
    }

    const instructionConfig = resolveInstructionConfig(
      instructionSettings,
      category,
      menuItem,
    );
    const quickInstructions = input.selectedInstructionCodes
      ? buildInstructionSnapshots(
          [
            ...instructionConfig.defaultOptions,
            ...instructionConfig.additionalOptions,
          ],
          input.selectedInstructionCodes,
        )
      : item.quickInstructions;
    const selectedVariants = input.selectedVariants
      ? buildVariantSnapshots(
          menuItem.variantOptions,
          menuItem.requiredVariantQuantity,
          quantity,
          input.selectedVariants,
        )
      : item.selectedVariants;
    const allergyChanged =
      hasAllergy !== item.hasAllergy ||
      allergySeverity !== item.allergySeverity ||
      allergyNote !== item.allergyNote ||
      JSON.stringify(allergenCodes) !== JSON.stringify(item.allergenCodes);
    const [updated] = await db
      .update(orderItems)
      .set({
        quantity,
        note: input.note === undefined ? item.note : input.note,
        quickInstructions,
        selectedVariants,
        hasAllergy,
        allergenCodes,
        selectedAllergens,
        allergySeverity,
        allergyNote,
        allergyAcknowledgedAt: allergyChanged
          ? null
          : item.allergyAcknowledgedAt,
        allergyAcknowledgedBy: allergyChanged
          ? null
          : item.allergyAcknowledgedBy,
        allergyKitchenConfirmedAt: allergyChanged
          ? null
          : item.allergyKitchenConfirmedAt,
        allergyKitchenConfirmedBy: allergyChanged
          ? null
          : item.allergyKitchenConfirmedBy,
      })
      .where(eq(orderItems.id, item.id))
      .returning();

    await recalculateOrder(db, item.orderId);
    return localOrderItemResponseSchema.parse({ item: toOrderItem(updated) });
  }

  async function executeOrderItemCommand(
    orderItemId: string,
    command: LocalOrderItemCommand,
  ) {
    if (command.action === 'confirm_allergy') {
      await requireActiveLocalUser(db, command.staffUserId);
    }

    const item = await getRequiredOrderItem(db, orderItemId);
    const order = await getRequiredOrder(db, item.orderId);
    if (order.status === 'cancelled') {
      throw new HttpError(
        409,
        'ORDER_CANCELLED',
        'Cancelled orders cannot be changed.',
      );
    }

    let updated: OrderItem;
    if (command.action === 'remove_pending') {
      await assertOrderCanChangeItems(db, order);
      if (item.status !== 'pending') {
        throw new HttpError(
          409,
          'INVALID_ITEM_STATUS',
          'Only pending items can be removed.',
        );
      }
      [updated] = await cancelItem(db, item, 'Removed before kitchen send');
    } else if (command.action === 'cancel') {
      await assertOrderCanChangeItems(db, order);
      if (item.status === 'cancelled') {
        updated = item;
      } else {
        [updated] = await cancelItem(db, item, command.reason);
      }
    } else if (command.action === 'restore') {
      await assertOrderCanChangeItems(db, order);
      if (item.status !== 'cancelled') {
        updated = item;
      } else {
        [updated] = await db
          .update(orderItems)
          .set({
            status: item.sentAt ? 'sent' : 'pending',
            cancelledAt: null,
            cancelledReason: null,
          })
          .where(eq(orderItems.id, item.id))
          .returning();
      }
    } else if (command.action === 'confirm_allergy') {
      if (!item.hasAllergy) {
        throw new HttpError(
          422,
          'NO_ALLERGY_WARNING',
          'This item has no allergy warning.',
        );
      }
      if (!['sent', 'preparing', 'ready'].includes(item.status)) {
        throw new HttpError(
          409,
          'INVALID_ITEM_STATUS',
          'Only kitchen items can have their allergy confirmed.',
        );
      }
      [updated] = await db
        .update(orderItems)
        .set({
          allergyKitchenConfirmedAt: new Date(),
          allergyKitchenConfirmedBy: command.staffUserId,
        })
        .where(eq(orderItems.id, item.id))
        .returning();
    } else {
      const target =
        command.action === 'mark_sent'
          ? 'sent'
          : command.action === 'mark_preparing'
            ? 'preparing'
            : 'ready';
      const allowed =
        target === 'sent'
          ? ['preparing', 'ready']
          : target === 'preparing'
            ? ['sent', 'ready']
            : ['sent', 'preparing'];
      if (!allowed.includes(item.status)) {
        throw new HttpError(
          409,
          'INVALID_ITEM_STATUS',
          `Cannot mark item ${target} from status ${item.status}.`,
        );
      }
      if (
        target === 'ready' &&
        item.hasAllergy &&
        !item.allergyKitchenConfirmedAt
      ) {
        throw new HttpError(
          409,
          'ALLERGY_CONFIRMATION_REQUIRED',
          'Kitchen must confirm the allergy before marking the item ready.',
        );
      }
      [updated] = await db
        .update(orderItems)
        .set({
          status: target,
          ...(target === 'ready' ? { readyAt: new Date() } : {}),
          ...(target === 'sent' || target === 'preparing'
            ? { readyAt: null, servedAt: null }
            : {}),
        })
        .where(eq(orderItems.id, item.id))
        .returning();
    }

    await recalculateOrder(db, item.orderId);
    await refreshOrderStatus(db, item.orderId);
    return localOrderItemResponseSchema.parse({ item: toOrderItem(updated) });
  }

  async function executeOrderCommand(
    orderId: string,
    command: LocalOrderCommand,
  ) {
    return db.transaction(async (tx) => {
      await tx.execute(
        sql`select ${orders.id} from ${orders} where ${orders.id} = ${orderId} for update`,
      );
      if (command.action === 'cancel') {
        return cancelOrder(tx, orderId, command.reason);
      }
      if (command.action === 'mark_station_preparing') {
        return markKitchenStationPreparing(tx, orderId, command.station);
      }
      if (command.action === 'mark_station_sent') {
        return markKitchenStationSent(tx, orderId, command.station);
      }
      return sendToKitchen(tx, orderId, command);
    });
  }

  return {
    getOrderDetail,
    addOrderItem,
    updateOrderItem,
    executeOrderItemCommand,
    executeOrderCommand,
  };
}

async function cancelOrder(
  db: PosDatabaseExecutor,
  orderId: string,
  reason?: string,
) {
  const order = await getRequiredOrder(db, orderId);
  if (order.status === 'cancelled') {
    return localOrderDetailResponseSchema.parse({
      ...(await loadOrderDetail(db, order)),
    });
  }
  if (order.status === 'paid') {
    throw new HttpError(409, 'ORDER_PAID', 'Paid orders cannot be cancelled.');
  }
  const paidPayment = await db.query.payments.findFirst({
    where: and(eq(payments.orderId, orderId), eq(payments.status, 'paid')),
  });
  if (paidPayment) {
    throw new HttpError(
      409,
      'ORDER_HAS_PAYMENT',
      'Orders with paid payments cannot be cancelled.',
    );
  }

  const now = new Date();
  await db
    .update(orderItems)
    .set({ status: 'cancelled', cancelledAt: now, cancelledReason: reason })
    .where(
      and(eq(orderItems.orderId, orderId), ne(orderItems.status, 'cancelled')),
    );
  await db
    .update(checks)
    .set({ status: 'void' })
    .where(and(eq(checks.orderId, orderId), ne(checks.status, 'paid')));
  const [cancelled] = await db
    .update(orders)
    .set({
      status: 'cancelled',
      cancelledAt: now,
      cancelledReason: reason,
      paymentMode: 'single',
    })
    .where(eq(orders.id, orderId))
    .returning();

  return localOrderDetailResponseSchema.parse(
    await loadOrderDetail(db, cancelled),
  );
}
