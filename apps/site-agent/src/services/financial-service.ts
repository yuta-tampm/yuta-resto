import {
  localChecksResponseSchema,
  localOrderResponseSchema,
  localPaymentCaptureResponseSchema,
  localPaymentSummaryResponseSchema,
  type CreateLocalChecksByItemsInput,
  type PayLocalCheckInput,
  type PayLocalOrderInput,
} from '@yuta/contracts/local-pos';
import { splitCents } from '@yuta/core';
import type { PosDatabaseExecutor } from '@yuta/db-pos/client';
import {
  checkDiscountItems,
  checkDiscounts,
  checkItems,
  checks,
  localUsers,
  orderItems,
  orders,
  payments,
  printJobs,
  type Check,
} from '@yuta/db-pos/schema';
import { and, asc, eq, inArray, ne } from 'drizzle-orm';
import { v7 as uuidv7 } from 'uuid';
import { HttpError } from '../http';
import { createComboPersistenceService } from './combo-persistence-service';
import {
  allChecksPaid,
  assertNoPaidChecks,
  assertOrderPayable,
  assertPaymentReplay,
  getRequiredCheck,
  getRequiredOrder,
  lockOrder,
  sumPaid,
  toCheck,
  toPayment,
  toPrintJob,
  voidOpenChecks,
} from './financial-helpers';
import { toOrderSummary } from './order-summary';

export function createFinancialService(db: PosDatabaseExecutor) {
  async function splitOrderEqually(orderId: string, parts: number) {
    return db.transaction(async (tx) => {
      await lockOrder(tx, orderId);
      let order = await getRequiredOrder(tx, orderId);
      assertOrderPayable(order);
      await assertNoPaidChecks(tx, orderId);
      await voidOpenChecks(tx, orderId);
      await createComboPersistenceService(tx).optimizeOrder(orderId);
      order = await getRequiredOrder(tx, orderId);
      const totals = splitCents(order.totalCents, parts);
      const created: Check[] = [];
      for (let index = 0; index < totals.length; index++) {
        const [check] = await tx
          .insert(checks)
          .values({
            id: uuidv7(),
            orderId,
            checkLabel: `Part ${index + 1}`,
            splitMode: 'equal',
            subtotalCents: totals[index],
            totalCents: totals[index],
          })
          .returning();
        created.push(check);
      }
      await tx
        .update(orders)
        .set({ paymentMode: 'split_equally' })
        .where(eq(orders.id, orderId));
      return localChecksResponseSchema.parse({
        checks: created.map((check) => toCheck(check)),
      });
    });
  }

  async function createChecksByItems(
    orderId: string,
    input: CreateLocalChecksByItemsInput,
  ) {
    return db.transaction(async (tx) => {
      await lockOrder(tx, orderId);
      const order = await getRequiredOrder(tx, orderId);
      assertOrderPayable(order);
      await assertNoPaidChecks(tx, orderId);
      await createComboPersistenceService(tx).clearOrderDiscounts(orderId);
      await voidOpenChecks(tx, orderId);
      const activeItems = await tx
        .select()
        .from(orderItems)
        .where(
          and(
            eq(orderItems.orderId, orderId),
            ne(orderItems.status, 'cancelled'),
          ),
        );
      const byId = new Map(activeItems.map((item) => [item.id, item]));
      const assigned = new Map<string, number>();
      for (const requestedCheck of input.checks) {
        for (const requestedItem of requestedCheck.items) {
          if (!byId.has(requestedItem.orderItemId)) {
            throw new HttpError(
              422,
              'INVALID_SPLIT',
              'Check includes an invalid order item.',
            );
          }
          assigned.set(
            requestedItem.orderItemId,
            (assigned.get(requestedItem.orderItemId) ?? 0) +
              requestedItem.quantity,
          );
        }
      }
      for (const [itemId, quantity] of assigned) {
        if (quantity > (byId.get(itemId)?.quantity ?? 0)) {
          throw new HttpError(
            422,
            'INVALID_SPLIT',
            'Assigned quantity exceeds the order item quantity.',
          );
        }
      }

      const created: Check[] = [];
      for (const requestedCheck of input.checks) {
        const subtotalCents = requestedCheck.items.reduce((sum, requested) => {
          const item = byId.get(requested.orderItemId);
          return sum + (item?.unitPriceCentsSnapshot ?? 0) * requested.quantity;
        }, 0);
        const [check] = await tx
          .insert(checks)
          .values({
            id: uuidv7(),
            orderId,
            checkLabel: requestedCheck.checkLabel,
            splitMode: 'items',
            subtotalCents,
            totalCents: subtotalCents,
          })
          .returning();
        await tx.insert(checkItems).values(
          requestedCheck.items.map((requested) => {
            const item = byId.get(requested.orderItemId);
            if (!item) {
              throw new HttpError(
                422,
                'INVALID_SPLIT',
                'Check includes an invalid order item.',
              );
            }
            return {
              id: uuidv7(),
              checkId: check.id,
              orderItemId: item.id,
              quantity: requested.quantity,
              amountCentsSnapshot:
                item.unitPriceCentsSnapshot * requested.quantity,
            };
          }),
        );
        await createComboPersistenceService(tx).optimizeCheck(check.id);
        created.push(await getRequiredCheck(tx, check.id));
      }
      await tx
        .update(orders)
        .set({ paymentMode: 'split_by_items' })
        .where(eq(orders.id, orderId));
      return localChecksResponseSchema.parse({
        checks: created.map((check) => toCheck(check)),
      });
    });
  }

  async function cancelOrderSplit(orderId: string) {
    return db.transaction(async (tx) => {
      await lockOrder(tx, orderId);
      const order = await getRequiredOrder(tx, orderId);
      assertOrderPayable(order);
      await assertNoPaidChecks(tx, orderId);
      await voidOpenChecks(tx, orderId);
      await createComboPersistenceService(tx).optimizeOrder(orderId);
      const [updated] = await tx
        .update(orders)
        .set({ paymentMode: 'single' })
        .where(eq(orders.id, orderId))
        .returning();
      return localOrderResponseSchema.parse({
        order: toOrderSummary(updated),
      });
    });
  }

  async function payOrder(orderId: string, input: PayLocalOrderInput) {
    return capturePayment(orderId, null, input);
  }

  async function payCheck(orderId: string, input: PayLocalCheckInput) {
    return capturePayment(orderId, input.checkId, input);
  }

  async function capturePayment(
    orderId: string,
    checkId: string | null,
    input: PayLocalOrderInput,
  ) {
    return db.transaction(async (tx) => {
      await lockOrder(tx, orderId);
      const existing = await tx.query.payments.findFirst({
        where: eq(payments.idempotencyKey, input.idempotencyKey),
      });
      if (existing) {
        assertPaymentReplay(existing, orderId, checkId, input);
        const existingJob =
          (await tx.query.printJobs.findFirst({
            where: eq(printJobs.idempotencyKey, input.idempotencyKey),
          })) ?? null;
        return localPaymentCaptureResponseSchema.parse({
          payment: toPayment(existing),
          printJob: existingJob ? toPrintJob(existingJob) : null,
          replayed: true,
        });
      }
      const conflictingJob = await tx.query.printJobs.findFirst({
        where: eq(printJobs.idempotencyKey, input.idempotencyKey),
      });
      if (conflictingJob) {
        throw new HttpError(
          409,
          'IDEMPOTENCY_CONFLICT',
          'Idempotency key belongs to another command.',
        );
      }
      const user = await tx.query.localUsers.findFirst({
        where: eq(localUsers.id, input.staffUserId),
      });
      if (!user?.isActive) {
        throw new HttpError(
          422,
          'STAFF_USER_UNAVAILABLE',
          'The selected local user is not available.',
        );
      }
      let order = await getRequiredOrder(tx, orderId);
      assertOrderPayable(order);
      let totalCents: number;
      let paidCents: number;
      if (checkId) {
        const check = await getRequiredCheck(tx, checkId);
        if (check.orderId !== orderId) {
          throw new HttpError(
            422,
            'CHECK_ORDER_MISMATCH',
            'Check does not belong to this order.',
          );
        }
        if (check.status !== 'open') {
          throw new HttpError(
            409,
            'CHECK_NOT_PAYABLE',
            'Check is not payable.',
          );
        }
        totalCents = check.totalCents;
        paidCents = await sumPaid(tx, orderId, checkId);
      } else {
        if (order.paymentMode !== 'single') {
          throw new HttpError(
            409,
            'ACTIVE_PAYMENT_SPLIT',
            'Split orders must be paid by check.',
          );
        }
        await createComboPersistenceService(tx).optimizeOrder(orderId);
        order = await getRequiredOrder(tx, orderId);
        totalCents = order.totalCents;
        paidCents = await sumPaid(tx, orderId, null);
      }
      const remainingCents = Math.max(0, totalCents - paidCents);
      if (remainingCents === 0) {
        throw new HttpError(
          409,
          'ALREADY_PAID',
          'The payment target is already fully paid.',
        );
      }
      if (input.amountCents > remainingCents) {
        throw new HttpError(
          422,
          'OVERPAYMENT',
          'Payment amount exceeds the remaining total.',
        );
      }
      const tenderedCents = input.tenderedCents ?? input.amountCents;
      if (tenderedCents < input.amountCents) {
        throw new HttpError(
          422,
          'INVALID_TENDER',
          'Tendered amount cannot be lower than payment amount.',
        );
      }
      const [payment] = await tx
        .insert(payments)
        .values({
          id: uuidv7(),
          orderId,
          checkId,
          method: input.method,
          amountCents: input.amountCents,
          tenderedCents,
          changeCents: tenderedCents - input.amountCents,
          tipCents: input.tipCents ?? 0,
          status: 'paid',
          paidBy: user.name,
          paidAt: new Date(),
          idempotencyKey: input.idempotencyKey,
        })
        .returning();
      const fullyPaid = paidCents + input.amountCents >= totalCents;
      if (checkId && fullyPaid) {
        await tx
          .update(checks)
          .set({ status: 'paid' })
          .where(eq(checks.id, checkId));
      }
      if (
        (!checkId && fullyPaid) ||
        (checkId && (await allChecksPaid(tx, orderId)))
      ) {
        await tx
          .update(orders)
          .set({ status: 'paid', paidAt: new Date() })
          .where(eq(orders.id, orderId));
      }
      return localPaymentCaptureResponseSchema.parse({
        payment: toPayment(payment),
        printJob: null,
        replayed: false,
      });
    });
  }

  async function getPaymentSummary(orderId: string) {
    let order = await getRequiredOrder(db, orderId);
    if (
      order.paymentMode === 'single' &&
      order.status !== 'paid' &&
      order.status !== 'cancelled'
    ) {
      await createComboPersistenceService(db).optimizeOrder(orderId);
      order = await getRequiredOrder(db, orderId);
    }
    const [checkRows, paymentRows] = await Promise.all([
      db
        .select()
        .from(checks)
        .where(eq(checks.orderId, orderId))
        .orderBy(asc(checks.createdAt), asc(checks.id)),
      db
        .select()
        .from(payments)
        .where(eq(payments.orderId, orderId))
        .orderBy(asc(payments.createdAt), asc(payments.id)),
    ]);
    const checkItemRows =
      checkRows.length === 0
        ? []
        : await db
            .select({
              id: checkItems.id,
              checkId: checkItems.checkId,
              quantity: checkItems.quantity,
              amountCentsSnapshot: checkItems.amountCentsSnapshot,
              orderItemId: orderItems.id,
              itemNameSnapshot: orderItems.itemNameSnapshot,
              unitPriceCentsSnapshot: orderItems.unitPriceCentsSnapshot,
            })
            .from(checkItems)
            .innerJoin(orderItems, eq(checkItems.orderItemId, orderItems.id))
            .where(
              inArray(
                checkItems.checkId,
                checkRows.map((check) => check.id),
              ),
            );
    const checkDiscountRows =
      checkRows.length === 0
        ? []
        : await db
            .select()
            .from(checkDiscounts)
            .where(
              inArray(
                checkDiscounts.checkId,
                checkRows.map((check) => check.id),
              ),
            )
            .orderBy(asc(checkDiscounts.createdAt), asc(checkDiscounts.id));
    const checkDiscountItemRows =
      checkDiscountRows.length === 0
        ? []
        : await db
            .select({
              checkDiscountId: checkDiscountItems.checkDiscountId,
              quantityApplied: checkDiscountItems.quantityApplied,
              checkItemId: checkItems.id,
              orderItemId: orderItems.id,
              itemNameSnapshot: orderItems.itemNameSnapshot,
            })
            .from(checkDiscountItems)
            .innerJoin(
              checkItems,
              eq(checkDiscountItems.checkItemId, checkItems.id),
            )
            .innerJoin(orderItems, eq(checkItems.orderItemId, orderItems.id))
            .where(
              inArray(
                checkDiscountItems.checkDiscountId,
                checkDiscountRows.map((discount) => discount.id),
              ),
            );
    const paidCents = paymentRows
      .filter((payment) => payment.status === 'paid')
      .reduce((sum, payment) => sum + payment.amountCents, 0);
    return localPaymentSummaryResponseSchema.parse({
      order: toOrderSummary(order),
      checks: checkRows.map((check) =>
        toCheck(
          check,
          checkItemRows
            .filter((item) => item.checkId === check.id)
            .map((item) => ({
              id: item.id,
              quantity: item.quantity,
              amountCentsSnapshot: item.amountCentsSnapshot,
              orderItem: {
                id: item.orderItemId,
                itemNameSnapshot: item.itemNameSnapshot,
                unitPriceCentsSnapshot: item.unitPriceCentsSnapshot,
              },
            })),
          checkDiscountRows
            .filter((discount) => discount.checkId === check.id)
            .map((discount) => ({
              id: discount.id,
              nameSnapshot: discount.nameSnapshot,
              discountCents: discount.discountCents,
              items: checkDiscountItemRows
                .filter((item) => item.checkDiscountId === discount.id)
                .map((item) => ({
                  quantityApplied: item.quantityApplied,
                  checkItem: {
                    id: item.checkItemId,
                    orderItem: {
                      id: item.orderItemId,
                      itemNameSnapshot: item.itemNameSnapshot,
                    },
                  },
                })),
            })),
        ),
      ),
      payments: paymentRows.map(toPayment),
      paidCents,
      remainingCents: Math.max(0, order.totalCents - paidCents),
    });
  }

  return {
    splitOrderEqually,
    createChecksByItems,
    cancelOrderSplit,
    payOrder,
    payCheck,
    getPaymentSummary,
  };
}
