import { config } from 'dotenv';
import { eq, inArray } from 'drizzle-orm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { v7 as uuidv7 } from 'uuid';
import {
  createPosDatabaseClient,
  type PosDatabaseClient,
} from '@yuta/db-pos/client';
import {
  comboRuleGroupItems,
  comboRuleGroups,
  comboRules,
  menuCategories,
  menuItems,
} from '@yuta/db-pos/schema';
import { createComboManagementService } from '../src/services/combo-management-service';

config({ path: '.env.test' });
config({ path: '.env.local' });

const integrationTest =
  process.env.POS_DATABASE_URL &&
  process.env.YUTA_ALLOW_DATABASE_INTEGRATION_TESTS === 'true'
    ? describe
    : describe.skip;

integrationTest('combo management integration', () => {
  let db: PosDatabaseClient;
  const categoryId = uuidv7();
  const menuItemId = uuidv7();
  let ruleId: string | null = null;

  beforeAll(async () => {
    db = createPosDatabaseClient(process.env);
    await db.insert(menuCategories).values({
      id: categoryId,
      name: `Combo integration ${categoryId}`,
    });
    await db.insert(menuItems).values({
      id: menuItemId,
      categoryId,
      name: `Combo item ${menuItemId}`,
      priceCents: 1200,
      kitchenStation: 'kitchen',
    });
  });

  afterAll(async () => {
    if (!db) return;

    if (ruleId) {
      const groups = await db
        .select({ id: comboRuleGroups.id })
        .from(comboRuleGroups)
        .where(eq(comboRuleGroups.comboRuleId, ruleId));
      const groupIds = groups.map(({ id }) => id);
      if (groupIds.length > 0) {
        await db
          .delete(comboRuleGroupItems)
          .where(inArray(comboRuleGroupItems.comboRuleGroupId, groupIds));
      }
      await db
        .delete(comboRuleGroups)
        .where(eq(comboRuleGroups.comboRuleId, ruleId));
      await db.delete(comboRules).where(eq(comboRules.id, ruleId));
    }

    await db.delete(menuItems).where(eq(menuItems.id, menuItemId));
    await db.delete(menuCategories).where(eq(menuCategories.id, categoryId));
    await db.$client.end({ timeout: 5 });
  });

  it('enforces structure, conflicts, active locks, and transactional group deletion', async () => {
    const service = createComboManagementService(db);
    const created = await service.createComboRule({
      name: `Integration rule ${categoryId}`,
      pricingMode: 'fixed',
      comboPriceCents: 1000,
      priceDeltaCents: 0,
      basePricingGroupName: null,
      priority: 10,
      maxApplications: null,
      isActive: false,
      isSuggestionEnabled: true,
    });
    ruleId = created.comboRule.id;
    expect(created.comboRule.isActive).toBe(false);
    expect(created.comboRule.isSuggestionEnabled).toBe(true);

    await expect(
      service.updateComboRule(ruleId, { isActive: true }),
    ).rejects.toMatchObject({ code: 'COMBO_RULE_STRUCTURE_REQUIRED' });
    await expect(
      service.createComboRule({
        name: created.comboRule.name.toUpperCase(),
        pricingMode: 'fixed',
        comboPriceCents: 1000,
        priceDeltaCents: 0,
        basePricingGroupName: null,
        priority: 20,
        maxApplications: null,
        isActive: false,
        isSuggestionEnabled: true,
      }),
    ).rejects.toMatchObject({ code: 'COMBO_RULE_NAME_CONFLICT' });

    const createdGroup = await service.createComboGroup({
      comboRuleId: ruleId,
      name: 'Plat',
      minQuantity: 1,
      maxQuantity: 1,
      sortOrder: 10,
    });
    const groupId = createdGroup.group.id;
    const createdItem = await service.createComboGroupItem({
      comboRuleGroupId: groupId,
      menuItemId,
      extraPriceCents: 0,
    });

    await expect(
      service.createComboGroupItem({
        comboRuleGroupId: groupId,
        menuItemId,
        extraPriceCents: 0,
      }),
    ).rejects.toMatchObject({ code: 'COMBO_GROUP_ITEM_CONFLICT' });

    await service.updateComboRule(ruleId, {
      pricingMode: 'base_item_plus_delta',
      basePricingGroupName: 'Missing',
      priceDeltaCents: 200,
    });
    await expect(
      service.updateComboRule(ruleId, { isActive: true }),
    ).rejects.toMatchObject({ code: 'COMBO_BASE_GROUP_INVALID' });
    await service.updateComboRule(ruleId, { basePricingGroupName: 'Plat' });
    const active = await service.updateComboRule(ruleId, { isActive: true });
    expect(active.comboRule.isActive).toBe(true);
    const suggestionDisabled = await service.updateComboRule(ruleId, {
      isSuggestionEnabled: false,
    });
    expect(suggestionDisabled.comboRule).toMatchObject({
      isActive: true,
      isSuggestionEnabled: false,
    });

    await expect(
      service.updateComboGroup(groupId, { sortOrder: 20 }),
    ).rejects.toMatchObject({ code: 'COMBO_RULE_MUST_BE_INACTIVE' });
    await expect(
      service.deleteComboGroupItem(createdItem.item.id),
    ).rejects.toMatchObject({ code: 'COMBO_RULE_MUST_BE_INACTIVE' });

    await service.updateComboRule(ruleId, { isActive: false });
    await service.deleteComboGroup(groupId);
    expect(
      await db
        .select()
        .from(comboRuleGroupItems)
        .where(eq(comboRuleGroupItems.comboRuleGroupId, groupId)),
    ).toHaveLength(0);
    expect(
      await db
        .select()
        .from(comboRuleGroups)
        .where(eq(comboRuleGroups.id, groupId)),
    ).toHaveLength(0);
  });
});
