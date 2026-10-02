import type { ComboCalculationItem, ComboCalculationRule } from '@yuta/core';
import { describe, expect, it } from 'vitest';
import { buildComboCompletionSuggestionGroups } from '../src/app/orders/[orderId]/items/_lib/combo-completion-suggestions';

const comboRule: ComboCalculationRule & { isSuggestionEnabled: boolean } = {
  id: 'gua-bao-happy',
  name: 'Gua Bao Happy',
  pricingMode: 'fixed',
  comboPriceCents: 1300,
  priceDeltaCents: 0,
  basePricingGroupName: null,
  priority: 20,
  maxApplications: null,
  isActive: true,
  isSuggestionEnabled: true,
  groups: [
    {
      id: 'bao-group',
      name: 'Gua Bao',
      minQuantity: 1,
      maxQuantity: 1,
      sortOrder: 10,
      items: [{ menuItemId: 'bao', extraPriceCents: 0 }],
    },
    {
      id: 'drink-group',
      name: 'Boisson',
      minQuantity: 1,
      maxQuantity: 1,
      sortOrder: 20,
      items: [
        { menuItemId: 'tea-peach', extraPriceCents: 0 },
        { menuItemId: 'tea-house', extraPriceCents: 0 },
        { menuItemId: 'stale-tea', extraPriceCents: 0 },
      ],
    },
  ],
};

const orderItems: ComboCalculationItem[] = [
  {
    id: 'line-bao',
    menuItemId: 'bao',
    unitPriceCentsSnapshot: 1100,
    quantity: 1,
    createdAt: new Date('2026-08-22T12:00:00.000Z'),
  },
];

describe('combo completion suggestion presentation', () => {
  it('maps real available items from active categories and uses catalog order', () => {
    const groups = buildComboCompletionSuggestionGroups({
      canEditItems: true,
      orderItems,
      comboRules: [comboRule],
      catalogCategories: [
        {
          isActive: true,
          items: [
            catalogItem('tea-peach', 'Thé pêche', 350, 30),
            catalogItem('tea-house', 'Thé glacé maison 25 cl', 250, 10),
          ],
        },
      ],
    });

    expect(groups).toEqual([
      {
        comboRuleId: 'gua-bao-happy',
        comboRuleName: 'Gua Bao Happy',
        dismissalKey: 'gua-bao-happy:bao=1',
        items: [
          {
            id: 'tea-house',
            name: 'Thé glacé maison 25 cl',
            priceCents: 250,
          },
          { id: 'tea-peach', name: 'Thé pêche', priceCents: 350 },
        ],
      },
    ]);
  });

  it('excludes unavailable items, inactive categories, and stale rule items', () => {
    const groups = buildComboCompletionSuggestionGroups({
      canEditItems: true,
      orderItems,
      comboRules: [comboRule],
      catalogCategories: [
        {
          isActive: true,
          items: [
            {
              ...catalogItem('tea-house', 'Thé glacé maison 25 cl', 250, 10),
              isAvailable: false,
            },
          ],
        },
        {
          isActive: false,
          items: [catalogItem('tea-peach', 'Thé pêche', 350, 20)],
        },
      ],
    });

    expect(groups).toEqual([]);
  });

  it('omits suggestions when the order cannot be edited', () => {
    const groups = buildComboCompletionSuggestionGroups({
      canEditItems: false,
      orderItems,
      comboRules: [comboRule],
      catalogCategories: [
        {
          isActive: true,
          items: [catalogItem('tea-house', 'Thé glacé maison 25 cl', 250, 10)],
        },
      ],
    });

    expect(groups).toEqual([]);
  });

  it('excludes opted-out rules without changing their active discount state', () => {
    const groups = buildComboCompletionSuggestionGroups({
      canEditItems: true,
      orderItems,
      comboRules: [{ ...comboRule, isSuggestionEnabled: false }],
      catalogCategories: [
        {
          isActive: true,
          items: [catalogItem('tea-house', 'Thé glacé maison 25 cl', 250, 10)],
        },
      ],
    });

    expect(comboRule.isActive).toBe(true);
    expect(groups).toEqual([]);
  });

  it('changes dismissal state only when a rule-relevant item changes', () => {
    const catalogCategories = [
      {
        isActive: true,
        items: [catalogItem('tea-house', 'Thé glacé maison 25 cl', 250, 10)],
      },
    ];
    const baseline = buildComboCompletionSuggestionGroups({
      canEditItems: true,
      orderItems,
      comboRules: [comboRule],
      catalogCategories,
    });
    const withUnrelatedItem = buildComboCompletionSuggestionGroups({
      canEditItems: true,
      orderItems: [
        ...orderItems,
        {
          id: 'line-soup',
          menuItemId: 'soup',
          unitPriceCentsSnapshot: 1650,
          quantity: 1,
          createdAt: new Date('2026-08-22T12:01:00.000Z'),
        },
      ],
      comboRules: [comboRule],
      catalogCategories,
    });
    const withAnotherBao = buildComboCompletionSuggestionGroups({
      canEditItems: true,
      orderItems: [{ ...orderItems[0], quantity: 2 }],
      comboRules: [comboRule],
      catalogCategories,
    });

    expect(withUnrelatedItem[0]?.dismissalKey).toBe(baseline[0]?.dismissalKey);
    expect(withAnotherBao[0]?.dismissalKey).not.toBe(baseline[0]?.dismissalKey);
    expect(withAnotherBao[0]?.dismissalKey).toBe('gua-bao-happy:bao=2');
  });
});

function catalogItem(
  id: string,
  name: string,
  priceCents: number,
  sortOrder: number,
) {
  return {
    id,
    name,
    priceCents,
    sortOrder,
    isAvailable: true,
  };
}
