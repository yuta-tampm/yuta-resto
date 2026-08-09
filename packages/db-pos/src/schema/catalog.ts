import {
  boolean,
  check,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { itemOrderingPolicyEnum, kitchenStationEnum } from './enums';

export type MenuItemVariantOption = {
  code: string;
  label: string;
};

export type QuickInstructionOption = {
  code: string;
  label: string;
  conflictsWith: string[];
};

export type AllergenOption = {
  code: string;
  label: string;
};

const createdAt = () =>
  timestamp('created_at', { withTimezone: true }).defaultNow().notNull();
const updatedAt = () =>
  timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdateFn(() => new Date());

export const menuCategories = pgTable(
  'menu_categories',
  {
    id: uuid('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    sortOrder: integer('sort_order').default(0).notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    defaultInstructionCodes: jsonb('default_instruction_codes')
      .$type<string[]>()
      .default([])
      .notNull(),
    additionalInstructionCodes: jsonb('additional_instruction_codes')
      .$type<string[]>()
      .default([])
      .notNull(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [
    index('menu_categories_sort_order_idx').on(table.sortOrder),
    index('menu_categories_is_active_idx').on(table.isActive),
  ],
);

export const menuItems = pgTable(
  'menu_items',
  {
    id: uuid('id').primaryKey(),
    categoryId: uuid('category_id')
      .notNull()
      .references(() => menuCategories.id),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    priceCents: integer('price_cents').notNull(),
    kitchenStation: kitchenStationEnum('kitchen_station').notNull(),
    orderingPolicy: itemOrderingPolicyEnum('ordering_policy')
      .default('merge')
      .notNull(),
    variantOptions: jsonb('variant_options')
      .$type<MenuItemVariantOption[]>()
      .default([])
      .notNull(),
    requiredVariantQuantity: integer('required_variant_quantity')
      .default(0)
      .notNull(),
    defaultInstructionCodes: jsonb('default_instruction_codes').$type<
      string[] | null
    >(),
    additionalInstructionCodes: jsonb('additional_instruction_codes').$type<
      string[] | null
    >(),
    isAvailable: boolean('is_available').default(true).notNull(),
    sortOrder: integer('sort_order').default(0).notNull(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [
    index('menu_items_category_id_idx').on(table.categoryId),
    index('menu_items_kitchen_station_idx').on(table.kitchenStation),
    index('menu_items_is_available_idx').on(table.isAvailable),
    index('menu_items_sort_order_idx').on(table.sortOrder),
    check(
      'menu_items_required_variant_quantity_non_negative_check',
      sql`${table.requiredVariantQuantity} >= 0`,
    ),
  ],
);

export const posInstructionSettings = pgTable(
  'pos_instruction_settings',
  {
    id: varchar('id', { length: 32 }).primaryKey(),
    quickInstructionOptions: jsonb('quick_instruction_options')
      .$type<QuickInstructionOption[]>()
      .default([])
      .notNull(),
    allergenOptions: jsonb('allergen_options')
      .$type<AllergenOption[]>()
      .default([])
      .notNull(),
    updatedAt: updatedAt(),
  },
  (table) => [
    check(
      'pos_instruction_settings_singleton_check',
      sql`${table.id} = 'default'`,
    ),
  ],
);

export type MenuCategory = typeof menuCategories.$inferSelect;
export type MenuItem = typeof menuItems.$inferSelect;
export type PosInstructionSettings = typeof posInstructionSettings.$inferSelect;
