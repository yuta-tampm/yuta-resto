import {
  calculateComboCompletionSuggestions,
  type ComboCalculationItem,
  type ComboCalculationRule,
} from '@yuta/core';

type SuggestionCatalogItem = {
  id: string;
  name: string;
  priceCents: number;
  sortOrder: number;
  isAvailable: boolean;
};

type SuggestionCatalogCategory = {
  isActive: boolean;
  items: SuggestionCatalogItem[];
};

type SuggestionComboRule = ComboCalculationRule & {
  isSuggestionEnabled: boolean;
};

export type ComboCompletionSuggestionGroup = {
  comboRuleId: string;
  comboRuleName: string;
  dismissalKey: string;
  items: Array<{
    id: string;
    name: string;
    priceCents: number;
  }>;
};

export function buildComboCompletionSuggestionGroups(input: {
  canEditItems: boolean;
  orderItems: ComboCalculationItem[];
  comboRules: SuggestionComboRule[];
  catalogCategories: SuggestionCatalogCategory[];
}): ComboCompletionSuggestionGroup[] {
  if (!input.canEditItems) {
    return [];
  }

  const availableItems = input.catalogCategories
    .filter((category) => category.isActive)
    .flatMap((category) => category.items)
    .filter((item) => item.isAvailable);
  const catalogItemById = new Map(
    availableItems.map((item) => [item.id, item]),
  );
  const comboRuleById = new Map(
    input.comboRules.map((rule) => [rule.id, rule]),
  );
  const suggestions = calculateComboCompletionSuggestions(
    input.orderItems,
    input.comboRules.filter((rule) => rule.isSuggestionEnabled),
    availableItems.map((item) => ({
      menuItemId: item.id,
      unitPriceCents: item.priceCents,
    })),
  );
  const groups = new Map<string, ComboCompletionSuggestionGroup>();

  for (const suggestion of suggestions) {
    const catalogItem = catalogItemById.get(suggestion.menuItemId);
    if (!catalogItem) {
      continue;
    }

    const existingGroup = groups.get(suggestion.comboRuleId);
    const item = {
      id: catalogItem.id,
      name: catalogItem.name,
      priceCents: catalogItem.priceCents,
    };
    if (existingGroup) {
      existingGroup.items.push(item);
      continue;
    }

    groups.set(suggestion.comboRuleId, {
      comboRuleId: suggestion.comboRuleId,
      comboRuleName: suggestion.comboRuleName,
      dismissalKey: comboSuggestionStateKey(
        comboRuleById.get(suggestion.comboRuleId),
        input.orderItems,
      ),
      items: [item],
    });
  }

  return [...groups.values()].map((group) => ({
    ...group,
    items: group.items.toSorted((left, right) => {
      const leftConfig = catalogItemById.get(left.id);
      const rightConfig = catalogItemById.get(right.id);
      return (
        (leftConfig?.sortOrder ?? 0) - (rightConfig?.sortOrder ?? 0) ||
        left.name.localeCompare(right.name, 'fr-FR') ||
        left.id.localeCompare(right.id)
      );
    }),
  }));
}

function comboSuggestionStateKey(
  rule: SuggestionComboRule | undefined,
  orderItems: ComboCalculationItem[],
): string {
  if (!rule) {
    return '';
  }

  const eligibleMenuItemIds = new Set(
    rule.groups.flatMap((group) => group.items.map((item) => item.menuItemId)),
  );
  const quantities = new Map<string, number>();
  for (const item of orderItems) {
    if (!eligibleMenuItemIds.has(item.menuItemId)) {
      continue;
    }
    quantities.set(
      item.menuItemId,
      (quantities.get(item.menuItemId) ?? 0) + item.quantity,
    );
  }
  const relevantState = [...quantities.entries()]
    .toSorted(([left], [right]) => left.localeCompare(right))
    .map(([menuItemId, quantity]) => `${menuItemId}=${quantity}`)
    .join(';');
  return `${rule.id}:${relevantState}`;
}
