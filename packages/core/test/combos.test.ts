import { describe, expect, it } from 'vitest';
import {
  calculateComboCompletionSuggestions,
  calculateComboDiscounts,
  type ComboCalculationItem,
  type ComboCalculationRule,
} from '../src/combos';

const date = new Date('2026-07-27T12:00:00.000Z');
const fixedRule: ComboCalculationRule = {
  id: 'rule-a',
  name: 'Combo A',
  pricingMode: 'fixed',
  comboPriceCents: 1400,
  priceDeltaCents: 0,
  basePricingGroupName: null,
  priority: 10,
  maxApplications: null,
  isActive: true,
  groups: [
    {
      id: 'main',
      name: 'Plat',
      minQuantity: 1,
      maxQuantity: 1,
      sortOrder: 10,
      items: [{ menuItemId: 'pho', extraPriceCents: 100 }],
    },
    {
      id: 'drink',
      name: 'Boisson',
      minQuantity: 1,
      maxQuantity: 1,
      sortOrder: 20,
      items: [{ menuItemId: 'coca', extraPriceCents: 0 }],
    },
  ],
};

describe('shared combo calculator', () => {
  it('matches repeated quantities without reusing units', () => {
    const discounts = calculateComboDiscounts(
      [
        {
          id: 'line-pho',
          menuItemId: 'pho',
          unitPriceCentsSnapshot: 1400,
          quantity: 2,
          createdAt: date,
        },
        {
          id: 'line-coca',
          menuItemId: 'coca',
          unitPriceCentsSnapshot: 300,
          quantity: 2,
          createdAt: date,
        },
      ],
      [fixedRule],
    );

    expect(discounts).toHaveLength(2);
    expect(discounts.map((discount) => discount.discountCents)).toEqual([
      200, 200,
    ]);
  });

  it('supports base-item-plus-delta pricing', () => {
    const discounts = calculateComboDiscounts(
      [
        {
          id: 'line-pho',
          menuItemId: 'pho',
          unitPriceCentsSnapshot: 1400,
          quantity: 1,
          createdAt: date,
        },
        {
          id: 'line-coca',
          menuItemId: 'coca',
          unitPriceCentsSnapshot: 300,
          quantity: 1,
          createdAt: date,
        },
      ],
      [
        {
          ...fixedRule,
          pricingMode: 'base_item_plus_delta',
          priceDeltaCents: 200,
          basePricingGroupName: 'Plat',
          groups: fixedRule.groups.map((group) => ({
            ...group,
            items: group.items.map((item) => ({
              ...item,
              extraPriceCents: 0,
            })),
          })),
        },
      ],
    );

    expect(discounts[0]?.discountCents).toBe(100);
  });
});

describe('combo completion suggestions', () => {
  it('suggests only items that complete a positive combo in one step', () => {
    const suggestions = calculateComboCompletionSuggestions(
      [calculationItem('line-pho', 'pho', 1400)],
      [fixedRule],
      [
        { menuItemId: 'coca', unitPriceCents: 300 },
        { menuItemId: 'dessert', unitPriceCents: 500 },
      ],
    );

    expect(suggestions).toEqual([
      {
        comboRuleId: 'rule-a',
        comboRuleName: 'Combo A',
        comboRulePriority: 10,
        menuItemId: 'coca',
      },
    ]);
  });

  it('does not expose a multi-step combo before only one group remains', () => {
    const threeGroupRule: ComboCalculationRule = {
      ...fixedRule,
      id: 'gourmand',
      name: 'Menu Gourmand',
      comboPriceCents: 1800,
      groups: [
        fixedRule.groups[0],
        {
          id: 'starter',
          name: 'Entrée',
          minQuantity: 1,
          maxQuantity: 1,
          sortOrder: 20,
          items: [{ menuItemId: 'nem', extraPriceCents: 0 }],
        },
        {
          id: 'dessert',
          name: 'Dessert',
          minQuantity: 1,
          maxQuantity: 1,
          sortOrder: 30,
          items: [{ menuItemId: 'mochi', extraPriceCents: 0 }],
        },
      ],
    };

    expect(
      calculateComboCompletionSuggestions(
        [calculationItem('line-pho', 'pho', 1400)],
        [threeGroupRule],
        [
          { menuItemId: 'nem', unitPriceCents: 500 },
          { menuItemId: 'mochi', unitPriceCents: 500 },
        ],
      ),
    ).toEqual([]);

    expect(
      calculateComboCompletionSuggestions(
        [
          calculationItem('line-pho', 'pho', 1400),
          calculationItem('line-nem', 'nem', 500),
        ],
        [threeGroupRule],
        [{ menuItemId: 'mochi', unitPriceCents: 500 }],
      ),
    ).toEqual([
      {
        comboRuleId: 'gourmand',
        comboRuleName: 'Menu Gourmand',
        comboRulePriority: 10,
        menuItemId: 'mochi',
      },
    ]);
  });

  it('completes a multi-quantity group with one additional unit', () => {
    const twoDrinkRule: ComboCalculationRule = {
      ...fixedRule,
      id: 'two-drinks',
      name: 'Combo deux boissons',
      comboPriceCents: 1500,
      groups: [
        fixedRule.groups[0],
        {
          ...fixedRule.groups[1],
          minQuantity: 2,
          maxQuantity: 2,
        },
      ],
    };

    expect(
      calculateComboCompletionSuggestions(
        [
          calculationItem('line-pho', 'pho', 1400),
          calculationItem('line-coca', 'coca', 300),
        ],
        [twoDrinkRule],
        [{ menuItemId: 'coca', unitPriceCents: 300 }],
      ),
    ).toEqual([
      {
        comboRuleId: 'two-drinks',
        comboRuleName: 'Combo deux boissons',
        comboRulePriority: 10,
        menuItemId: 'coca',
      },
    ]);
  });

  it('respects higher-priority consumption across overlapping rules', () => {
    const higherPriorityRule: ComboCalculationRule = {
      ...fixedRule,
      id: 'gourmand',
      name: 'Menu Gourmand',
      priority: 10,
      comboPriceCents: 1700,
      groups: [
        {
          ...fixedRule.groups[0],
          items: [{ menuItemId: 'gua-bao', extraPriceCents: 0 }],
        },
        {
          id: 'starter',
          name: 'Entrée',
          minQuantity: 1,
          maxQuantity: 1,
          sortOrder: 20,
          items: [{ menuItemId: 'nem', extraPriceCents: 0 }],
        },
        {
          id: 'dessert',
          name: 'Dessert',
          minQuantity: 1,
          maxQuantity: 1,
          sortOrder: 30,
          items: [{ menuItemId: 'mochi', extraPriceCents: 0 }],
        },
      ],
    };
    const guaBaoHappyRule: ComboCalculationRule = {
      ...fixedRule,
      id: 'gua-bao-happy',
      name: 'Gua Bao Happy',
      priority: 20,
      comboPriceCents: 1300,
      groups: [
        {
          ...fixedRule.groups[0],
          items: [{ menuItemId: 'gua-bao', extraPriceCents: 0 }],
        },
        {
          ...fixedRule.groups[1],
          items: [{ menuItemId: 'iced-tea', extraPriceCents: 0 }],
        },
      ],
    };

    const suggestions = calculateComboCompletionSuggestions(
      [
        calculationItem('line-gua-bao', 'gua-bao', 1100),
        calculationItem('line-nem', 'nem', 550),
        calculationItem('line-mochi', 'mochi', 550),
      ],
      [guaBaoHappyRule, higherPriorityRule],
      [{ menuItemId: 'iced-tea', unitPriceCents: 350 }],
    );

    expect(suggestions).toEqual([]);
  });

  it('respects max applications and permits the next application when allowed', () => {
    const completePair = [
      calculationItem('line-pho', 'pho', 1400),
      calculationItem('line-coca', 'coca', 300),
      calculationItem('line-pho-2', 'pho', 1400),
    ];

    expect(
      calculateComboCompletionSuggestions(
        completePair,
        [{ ...fixedRule, maxApplications: 1 }],
        [{ menuItemId: 'coca', unitPriceCents: 300 }],
      ),
    ).toEqual([]);

    expect(
      calculateComboCompletionSuggestions(
        completePair,
        [{ ...fixedRule, maxApplications: 2 }],
        [{ menuItemId: 'coca', unitPriceCents: 300 }],
      ),
    ).toHaveLength(1);
  });

  it('deduplicates candidate menu items and orders results by rule priority', () => {
    const dessertRule: ComboCalculationRule = {
      ...fixedRule,
      id: 'dessert-rule',
      name: 'Dessert Combo',
      priority: 30,
      comboPriceCents: 600,
      groups: [
        {
          ...fixedRule.groups[0],
          items: [{ menuItemId: 'coffee', extraPriceCents: 0 }],
        },
        {
          ...fixedRule.groups[1],
          items: [{ menuItemId: 'mochi', extraPriceCents: 0 }],
        },
      ],
    };

    const suggestions = calculateComboCompletionSuggestions(
      [
        calculationItem('line-pho', 'pho', 1400),
        calculationItem('line-coffee', 'coffee', 300),
      ],
      [dessertRule, fixedRule],
      [
        { menuItemId: 'mochi', unitPriceCents: 500 },
        { menuItemId: 'coca', unitPriceCents: 300 },
        { menuItemId: 'coca', unitPriceCents: 300 },
      ],
    );

    expect(suggestions.map((suggestion) => suggestion.menuItemId)).toEqual([
      'coca',
      'mochi',
    ]);
  });

  it('ignores inactive rules and non-positive combo outcomes', () => {
    expect(
      calculateComboCompletionSuggestions(
        [calculationItem('line-pho', 'pho', 1400)],
        [
          { ...fixedRule, id: 'inactive', isActive: false },
          { ...fixedRule, id: 'not-a-discount', comboPriceCents: 1800 },
        ],
        [{ menuItemId: 'coca', unitPriceCents: 300 }],
      ),
    ).toEqual([]);
  });
});

function calculationItem(
  id: string,
  menuItemId: string,
  unitPriceCentsSnapshot: number,
): ComboCalculationItem {
  return {
    id,
    menuItemId,
    unitPriceCentsSnapshot,
    quantity: 1,
    createdAt: date,
  };
}
