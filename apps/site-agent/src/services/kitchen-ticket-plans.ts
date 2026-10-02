import {
  printJobs,
  type Order,
  type OrderItem,
  type PrintSettings,
} from '@yuta/db-pos/schema';

export function kitchenProductionStations(
  station: 'kitchen' | 'bar' | 'dessert' | 'counter',
): Array<'kitchen' | 'bar' | 'dessert'> {
  return station === 'counter' ? ['bar', 'dessert'] : [station];
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

export function buildTicketPlans(items: OrderItem[], settings: PrintSettings) {
  const kitchenItems = items.filter(
    (item) => item.kitchenStationSnapshot === 'kitchen',
  );
  const plans = [
    ...(settings.kitchenEnabled && kitchenItems.length > 0
      ? [
          {
            destination: 'kitchen' as const,
            items: kitchenItems,
            copies: settings.kitchenCopies,
            includeAllItems: false,
          },
        ]
      : []),
    ...(settings.counterEnabled
      ? [
          {
            destination: 'counter' as const,
            items,
            copies: settings.counterCopies,
            includeAllItems: true,
          },
        ]
      : []),
  ];
  return plans.length > 0
    ? plans
    : [
        {
          destination: 'kitchen' as const,
          items: [],
          copies: settings.kitchenCopies,
          includeAllItems: false,
        },
      ];
}

export function buildKitchenPayload(
  order: Order,
  items: OrderItem[],
  ticketDestination: 'kitchen' | 'counter',
  copies: number,
  settings: PrintSettings,
  categoryByMenuItemId: Map<string, string>,
  includeAllItems = false,
) {
  return {
    orderId: order.id,
    orderNumber: order.orderNumber,
    tableLabel: order.tableLabel,
    orderType: order.orderType,
    orderNote: order.note,
    hasAllergy: items.some((item) => item.hasAllergy),
    allergyNote: order.allergyNote,
    allergyAcknowledgedAt: order.allergyAcknowledgedAt?.toISOString() ?? null,
    createdAt: new Date().toISOString(),
    ticketDestination,
    includeAllItems,
    copies,
    fontSizePreset: settings.fontSizePreset,
    topPaddingLines: settings.topPaddingLines,
    leftPaddingChars: settings.leftPaddingChars,
    bottomPaddingLines: settings.bottomPaddingLines,
    items: items.map((item) => ({
      orderItemId: item.id,
      name: item.itemNameSnapshot,
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
      station: item.kitchenStationSnapshot,
      categoryName: categoryByMenuItemId.get(item.menuItemId) ?? 'Autres',
    })),
  };
}
