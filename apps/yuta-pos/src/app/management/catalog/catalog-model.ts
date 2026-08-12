import type { LocalCatalogResponse } from '@yuta/contracts/local-pos';

export type Category = LocalCatalogResponse['categories'][number];
export type Item = Category['items'][number];
export type Station = Item['kitchenStation'];
export type OrderingPolicy = Item['orderingPolicy'];
export type InstructionSettings = LocalCatalogResponse['instructionSettings'];

export const stations: Station[] = ['kitchen', 'bar', 'dessert', 'none'];

export function getItemCount(categories: Category[]): number {
  return categories.reduce(
    (count, category) => count + category.items.length,
    0,
  );
}

export function getStationLabel(station: Station): string {
  const labels: Record<Station, string> = {
    kitchen: 'Cuisine',
    bar: 'Bar',
    dessert: 'Dessert',
    none: 'Sans préparation',
  };
  return labels[station];
}

export function formatCatalogPrice(priceCents: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(priceCents / 100);
}
