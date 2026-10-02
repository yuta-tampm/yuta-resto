import type { posApi } from '../../../../../lib/pos-api';

type PaymentViewData = Awaited<ReturnType<typeof posApi.getPaymentViewData>>;

export type PaymentViewOrder = PaymentViewData['order'];

export function getInitialItemSplitState(
  itemChecks: Array<{
    checkLabel: string;
    items: Array<{
      quantity: number;
      orderItem: {
        id: string;
      };
    }>;
  }>,
): {
  clientCount: number | undefined;
  quantities: Record<string, number>;
} {
  if (itemChecks.length === 0) {
    return {
      clientCount: undefined,
      quantities: {},
    };
  }

  const quantities: Record<string, number> = {};
  let maxClientIndex = itemChecks.length;

  itemChecks.forEach((check, index) => {
    const clientIndex = parseClientIndex(check.checkLabel) ?? index + 1;
    maxClientIndex = Math.max(maxClientIndex, clientIndex);

    check.items.forEach((item) => {
      quantities[`client${clientIndex}:${item.orderItem.id}`] = item.quantity;
    });
  });

  return {
    clientCount: maxClientIndex,
    quantities,
  };
}

function parseClientIndex(label: string): number | null {
  const match = /^Client\s+(\d+)$/i.exec(label.trim());
  const parsedIndex = match ? Number(match[1]) : null;

  if (
    !Number.isInteger(parsedIndex) ||
    parsedIndex === null ||
    parsedIndex < 1
  ) {
    return null;
  }

  return parsedIndex;
}

export function paymentErrorMessage(error: string): string {
  const messages: Record<string, string> = {
    invalid_amount: 'Saisir un montant valide, par exemple 31 ou 31,00.',
    invalid_input: 'Le montant donné doit couvrir le montant encaissé.',
    invalid_status: 'Cette commande ou ce ticket ne peut pas être encaissé.',
    invalid_split: 'La répartition des tickets est invalide.',
    overpayment: 'Le montant encaissé dépasse le reste à payer.',
    not_found: 'Commande ou ticket introuvable.',
  };

  return messages[error] ?? "Impossible d'enregistrer le paiement.";
}

export function formatDiscountItems(
  items: Array<{
    quantityApplied: number;
    orderItem: {
      itemNameSnapshot: string;
    };
  }>,
): string {
  if (items.length === 0) {
    return 'Articles combo non disponibles';
  }

  return items
    .map(
      (item) => `${item.quantityApplied} x ${item.orderItem.itemNameSnapshot}`,
    )
    .join(' + ');
}

export function formatCheckDiscountItems(
  items: Array<{
    quantityApplied: number;
    checkItem: {
      orderItem: {
        itemNameSnapshot: string;
      };
    };
  }>,
): string {
  if (items.length === 0) {
    return 'Articles combo non disponibles';
  }

  return items
    .map(
      (item) =>
        `${item.quantityApplied} x ${item.checkItem.orderItem.itemNameSnapshot}`,
    )
    .join(' + ');
}

export function toItemSplitItems(items: PaymentViewOrder['items']) {
  return items.map((item) => ({
    id: item.id,
    menuItemId: item.menuItemId,
    name: item.itemNameSnapshot,
    quantity: item.quantity,
    unitPriceCents: item.unitPriceCentsSnapshot,
    createdAt: item.createdAt.toISOString(),
  }));
}

export function toItemSplitComboRules(
  rules: PaymentViewData['activeComboRules'],
) {
  return rules.map((rule) => ({
    id: rule.id,
    name: rule.name,
    pricingMode: rule.pricingMode,
    comboPriceCents: rule.comboPriceCents,
    priceDeltaCents: rule.priceDeltaCents,
    basePricingGroupName: rule.basePricingGroupName,
    priority: rule.priority,
    maxApplications: rule.maxApplications,
    isActive: rule.isActive,
    groups: rule.groups.map((group) => ({
      id: group.id,
      name: group.name,
      minQuantity: group.minQuantity,
      maxQuantity: group.maxQuantity,
      sortOrder: group.sortOrder,
      items: group.items.map((item) => ({
        id: item.id,
        menuItemId: item.menuItemId,
        extraPriceCents: item.extraPriceCents,
      })),
    })),
  }));
}
