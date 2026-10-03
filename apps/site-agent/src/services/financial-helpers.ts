import type { PayLocalOrderInput } from '@yuta/contracts/local-pos';
import type { PosDatabaseExecutor } from '@yuta/db-pos/client';
import {
  checks,
  orders,
  payments,
  printJobs,
  type Check,
  type Order,
  type Payment,
} from '@yuta/db-pos/schema';
import { and, eq, isNull, ne, sql } from 'drizzle-orm';
import { HttpError } from '../http';

export async function lockOrder(
  db: PosDatabaseExecutor,
  orderId: string,
): Promise<void> {
  const result = await db
    .select({ id: orders.id })
    .from(orders)
    .where(eq(orders.id, orderId))
    .for('update');
  if (!result[0]) {
    throw new HttpError(404, 'ORDER_NOT_FOUND', 'Order not found.');
  }
}

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

export async function getRequiredCheck(
  db: PosDatabaseExecutor,
  checkId: string,
): Promise<Check> {
  const check = await db.query.checks.findFirst({
    where: eq(checks.id, checkId),
  });
  if (!check) {
    throw new HttpError(404, 'CHECK_NOT_FOUND', 'Check not found.');
  }
  return check;
}

export function assertOrderPayable(order: Order): void {
  if (order.status === 'paid' || order.status === 'cancelled') {
    throw new HttpError(409, 'ORDER_NOT_PAYABLE', 'Order is not payable.');
  }
}

export async function assertNoPaidChecks(
  db: PosDatabaseExecutor,
  orderId: string,
): Promise<void> {
  const paid = await db.query.checks.findFirst({
    where: and(eq(checks.orderId, orderId), eq(checks.status, 'paid')),
  });
  if (paid) {
    throw new HttpError(
      409,
      'PAID_CHECK_EXISTS',
      'Cannot replace a split after a check has been paid.',
    );
  }
}

export async function voidOpenChecks(
  db: PosDatabaseExecutor,
  orderId: string,
): Promise<void> {
  await db
    .update(checks)
    .set({ status: 'void' })
    .where(and(eq(checks.orderId, orderId), ne(checks.status, 'paid')));
}

export async function sumPaid(
  db: PosDatabaseExecutor,
  orderId: string,
  checkId: string | null,
): Promise<number> {
  const rows = await db
    .select({ total: sql<number>`coalesce(sum(${payments.amountCents}), 0)` })
    .from(payments)
    .where(
      checkId
        ? and(eq(payments.checkId, checkId), eq(payments.status, 'paid'))
        : and(
            eq(payments.orderId, orderId),
            isNull(payments.checkId),
            eq(payments.status, 'paid'),
          ),
    );
  return Number(rows[0]?.total ?? 0);
}

export async function allChecksPaid(
  db: PosDatabaseExecutor,
  orderId: string,
): Promise<boolean> {
  const rows = await db
    .select()
    .from(checks)
    .where(and(eq(checks.orderId, orderId), ne(checks.status, 'void')));
  return rows.length > 0 && rows.every((check) => check.status === 'paid');
}

export function assertPaymentReplay(
  payment: Payment,
  orderId: string,
  checkId: string | null,
  input: PayLocalOrderInput,
): void {
  if (
    payment.orderId !== orderId ||
    payment.checkId !== checkId ||
    payment.method !== input.method ||
    payment.amountCents !== input.amountCents ||
    payment.tenderedCents !== (input.tenderedCents ?? input.amountCents) ||
    payment.tipCents !== (input.tipCents ?? 0)
  ) {
    throw new HttpError(
      409,
      'IDEMPOTENCY_CONFLICT',
      'Idempotency key was reused with different payment input.',
    );
  }
}

export function toCheck(
  check: Check,
  items: Array<{
    id: string;
    quantity: number;
    amountCentsSnapshot: number;
    orderItem: {
      id: string;
      itemNameSnapshot: string;
      unitPriceCentsSnapshot: number;
    };
  }> = [],
  discounts: Array<{
    id: string;
    nameSnapshot: string;
    discountCents: number;
    items: Array<{
      quantityApplied: number;
      checkItem: {
        id: string;
        orderItem: {
          id: string;
          itemNameSnapshot: string;
        };
      };
    }>;
  }> = [],
) {
  return {
    id: check.id,
    orderId: check.orderId,
    checkLabel: check.checkLabel,
    splitMode: check.splitMode,
    status: check.status,
    subtotalCents: check.subtotalCents,
    discountCents: check.discountCents,
    totalCents: check.totalCents,
    items,
    discounts,
    createdAt: check.createdAt.toISOString(),
  };
}

export function toPayment(payment: Payment) {
  return {
    id: payment.id,
    orderId: payment.orderId,
    checkId: payment.checkId,
    method: payment.method,
    amountCents: payment.amountCents,
    tenderedCents: payment.tenderedCents,
    changeCents: payment.changeCents,
    tipCents: payment.tipCents,
    status: payment.status,
    paidBy: payment.paidBy,
    paidAt: payment.paidAt?.toISOString() ?? null,
    createdAt: payment.createdAt.toISOString(),
  };
}

export function toPrintJob(job: typeof printJobs.$inferSelect) {
  return {
    id: job.id,
    orderId: job.orderId,
    checkId: job.checkId,
    paymentId: job.paymentId,
    type: job.jobType,
    source: job.source,
    status: job.status,
    printerName: job.printerName,
    summary: {
      orderNumber:
        typeof job.payload.orderNumber === 'string'
          ? job.payload.orderNumber
          : null,
      tableLabel:
        typeof job.payload.tableLabel === 'string'
          ? job.payload.tableLabel
          : null,
      itemCount: Array.isArray(job.payload.items)
        ? job.payload.items.length
        : 0,
    },
    errorMessage: job.errorMessage,
    createdAt: job.createdAt.toISOString(),
    printedAt: job.printedAt?.toISOString() ?? null,
  };
}
