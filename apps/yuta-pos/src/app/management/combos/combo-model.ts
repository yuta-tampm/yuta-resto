import type { LocalCatalogResponse } from '@yuta/contracts/local-pos';

export type ComboRule = LocalCatalogResponse['comboRules'][number];
export type ComboGroup = ComboRule['groups'][number];
export type GroupItem = ComboGroup['items'][number];
export type CatalogItem =
  LocalCatalogResponse['categories'][number]['items'][number];

export function formatComboPrice(priceCents: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(priceCents / 100);
}

export function getComboPricingSummary(rule: ComboRule): string {
  if (rule.pricingMode === 'fixed') {
    return `Prix fixe ${formatComboPrice(rule.comboPriceCents)}`;
  }

  return `${rule.basePricingGroupName ?? 'Groupe manquant'} + ${formatComboPrice(rule.priceDeltaCents)}`;
}
