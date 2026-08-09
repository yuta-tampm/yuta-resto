DELETE FROM "combo_rule_group_items" AS "group_item"
USING "combo_rule_groups" AS "combo_group",
  "combo_rules" AS "combo_rule",
  "menu_items" AS "menu_item"
WHERE "group_item"."combo_rule_group_id" = "combo_group"."id"
  AND "combo_group"."combo_rule_id" = "combo_rule"."id"
  AND "group_item"."menu_item_id" = "menu_item"."id"
  AND "combo_rule"."name" IN ('Menu Express', 'Menu Gourmand')
  AND "menu_item"."name" = 'Assortiment – Mix LUNA (11 pcs)';
