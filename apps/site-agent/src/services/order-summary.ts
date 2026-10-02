import type { LocalOrderSummary } from '@yuta/contracts/local-pos';
import type { orders } from '@yuta/db-pos/schema';

export function toOrderSummary(
  order: typeof orders.$inferSelect,
): LocalOrderSummary {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    tableLabel: order.tableLabel,
    orderType: order.orderType,
    status: order.status,
    subtotalCents: order.subtotalCents,
    discountCents: order.discountCents,
    totalCents: order.totalCents,
    paymentMode: order.paymentMode,
    note: order.note,
    hasAllergy: order.hasAllergy,
    allergyNote: order.allergyNote,
    allergyAcknowledgedAt: order.allergyAcknowledgedAt?.toISOString() ?? null,
    createdBy: order.createdBy,
    sentAt: order.sentAt?.toISOString() ?? null,
    paidAt: order.paidAt?.toISOString() ?? null,
    cancelledAt: order.cancelledAt?.toISOString() ?? null,
    cancelledReason: order.cancelledReason,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
  };
}
