import { describe, expect, it } from 'vitest';
import {
  lunaCategorySeeds,
  lunaComboSeeds,
  lunaDessertNames,
  lunaEntryNames,
  lunaMainDishNames,
  lunaMenuItemSeeds,
} from '../src/luna-seed-data';
import {
  lunaCategoryInstructionConfigs,
  lunaQuickInstructionOptions,
} from '../src/luna-instruction-seed-data';

describe('Luna POS seed data', () => {
  it('contains the approved complete menu without duplicate names', () => {
    expect(lunaCategorySeeds).toHaveLength(12);
    expect(lunaMenuItemSeeds).toHaveLength(53);
    expect(lunaComboSeeds).toHaveLength(4);
    expect(new Set(lunaCategorySeeds.map(({ name }) => name)).size).toBe(12);
    expect(new Set(lunaMenuItemSeeds.map(({ name }) => name)).size).toBe(53);
    expect(new Set(lunaComboSeeds.map(({ name }) => name)).size).toBe(4);
  });

  it('keeps the weekly Saturday special unavailable at zero until configured', () => {
    expect(
      lunaMenuItemSeeds.find(({ name }) => name === 'Plat spécial du samedi'),
    ).toMatchObject({ priceCents: 0, isAvailable: false });
  });

  it('routes menu items to an internal kitchen, bar, or dessert station', () => {
    expect(
      lunaMenuItemSeeds.some(({ kitchenStation }) => kitchenStation === 'none'),
    ).toBe(false);
    expect(
      lunaMenuItemSeeds.filter(
        ({ kitchenStation }) => kitchenStation === 'bar',
      ),
    ).toHaveLength(21);
    expect(
      lunaMenuItemSeeds.filter(
        ({ kitchenStation }) => kitchenStation === 'dessert',
      ),
    ).toHaveLength(5);
  });

  it('references only seeded products from every combo group', () => {
    const itemNames = new Set(lunaMenuItemSeeds.map(({ name }) => name));
    const referencedNames = lunaComboSeeds.flatMap(({ groups }) =>
      groups.flatMap(({ items }) => items.map(({ name }) => name)),
    );

    expect(referencedNames.every((name) => itemNames.has(name))).toBe(true);
    expect(lunaEntryNames).toHaveLength(10);
    expect(lunaDessertNames).toHaveLength(5);
    expect(lunaMainDishNames).toHaveLength(13);
  });

  it('uses the confirmed 25 cl iced tea and formula prices', () => {
    const icedTeaName = 'Thé glacé maison citron & citronnelle – 25 cl';
    const guaBaoHappy = lunaComboSeeds.find(
      ({ name }) => name === 'Gua Bao Happy',
    );
    const summerCombo = lunaComboSeeds.find(({ name }) => name === 'Combo Été');
    const express = lunaComboSeeds.find(({ name }) => name === 'Menu Express');
    const gourmand = lunaComboSeeds.find(
      ({ name }) => name === 'Menu Gourmand',
    );

    expect(guaBaoHappy).toMatchObject({
      pricingMode: 'fixed',
      comboPriceCents: 1250,
    });
    expect(
      guaBaoHappy?.groups.flatMap(({ items }) => items.map(({ name }) => name)),
    ).toContain(icedTeaName);
    expect(summerCombo).toMatchObject({
      pricingMode: 'base_item_plus_delta',
      priceDeltaCents: 250,
    });
    expect(
      summerCombo?.groups.flatMap(({ items }) => items.map(({ name }) => name)),
    ).toContain(icedTeaName);
    expect(express?.priceDeltaCents).toBe(400);
    expect(gourmand?.priceDeltaCents).toBe(800);

    const mixLunaName = 'Assortiment – Mix LUNA (11 pcs)';
    expect(
      express?.groups.flatMap(({ items }) => items.map(({ name }) => name)),
    ).not.toContain(mixLunaName);
    expect(
      gourmand?.groups.flatMap(({ items }) => items.map(({ name }) => name)),
    ).not.toContain(mixLunaName);
  });

  it('requires one pork-or-vegan nem choice for every child menu', () => {
    expect(
      lunaMenuItemSeeds.find(({ name }) => name === 'Menu Petit Enfant'),
    ).toMatchObject({
      orderingPolicy: 'separate',
      requiredVariantQuantity: 1,
      variantOptions: [
        { code: 'NEMS_PORC', label: '2 nems porc' },
        { code: 'NEMS_VEGAN', label: '2 nems vegan' },
      ],
    });
  });

  it('configures alcohol-free cocktails through local instruction data', () => {
    expect(lunaQuickInstructionOptions).toContainEqual({
      code: 'SANS_ALCOOL',
      label: 'Sans alcool',
      conflictsWith: [],
    });
    expect(
      lunaCategoryInstructionConfigs['Cocktails & mocktails']
        .defaultInstructionCodes,
    ).toContain('SANS_ALCOOL');
  });
});
