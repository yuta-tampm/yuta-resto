import {
  localCatalogCategoryResponseSchema,
  localCatalogItemResponseSchema,
  type CreateLocalCatalogCategoryInput,
  type CreateLocalCatalogItemInput,
  type UpdateLocalCatalogCategoryInput,
  type UpdateLocalCatalogItemInput,
} from '@yuta/contracts/local-pos';
import type { PosDatabaseClient } from '@yuta/db-pos/client';
import { menuCategories, menuItems } from '@yuta/db-pos/schema';
import { and, asc, eq, ne, sql } from 'drizzle-orm';
import { v7 as uuidv7 } from 'uuid';
import { HttpError } from '../http';
import {
  assertInstructionAssignments,
  ensureInstructionSettings,
  resolveInstructionConfig,
} from './instruction-settings-service';

export function createCatalogManagementService(db: PosDatabaseClient) {
  async function createCatalogCategory(input: CreateLocalCatalogCategoryInput) {
    await assertCategoryNameAvailable(input.name);
    const settings = await ensureInstructionSettings(db);
    assertInstructionAssignments(settings, input);
    const [created] = await db
      .insert(menuCategories)
      .values({ id: uuidv7(), ...input })
      .returning();
    return localCatalogCategoryResponseSchema.parse({
      category: { ...toCategory(created), items: [] },
    });
  }

  async function updateCatalogCategory(
    categoryId: string,
    input: UpdateLocalCatalogCategoryInput,
  ) {
    const current = await requireCategory(categoryId);
    if (input.name !== undefined) {
      await assertCategoryNameAvailable(input.name, categoryId);
    }
    const settings = await ensureInstructionSettings(db);
    assertInstructionAssignments(settings, {
      defaultInstructionCodes:
        input.defaultInstructionCodes ?? current.defaultInstructionCodes,
      additionalInstructionCodes:
        input.additionalInstructionCodes ?? current.additionalInstructionCodes,
    });
    const [updated] = await db
      .update(menuCategories)
      .set(input)
      .where(eq(menuCategories.id, categoryId))
      .returning();
    const items = await db
      .select()
      .from(menuItems)
      .where(eq(menuItems.categoryId, categoryId))
      .orderBy(asc(menuItems.sortOrder), asc(menuItems.name));
    return localCatalogCategoryResponseSchema.parse({
      category: {
        ...toCategory(updated),
        items: items.map((item) =>
          toItem(item, resolveInstructionConfig(settings, updated, item)),
        ),
      },
    });
  }

  async function createCatalogItem(input: CreateLocalCatalogItemInput) {
    const category = await requireCategory(input.categoryId);
    await assertItemNameAvailable(input.categoryId, input.name);
    assertOrderingConfiguration(input);
    const settings = await ensureInstructionSettings(db);
    assertInstructionAssignments(settings, input);
    const [created] = await db
      .insert(menuItems)
      .values({ id: uuidv7(), ...input })
      .returning();
    return localCatalogItemResponseSchema.parse({
      item: toItem(
        created,
        resolveInstructionConfig(settings, category, created),
      ),
    });
  }

  async function updateCatalogItem(
    itemId: string,
    input: UpdateLocalCatalogItemInput,
  ) {
    const current = await db.query.menuItems.findFirst({
      where: eq(menuItems.id, itemId),
    });
    if (!current) throw catalogItemNotFoundError();

    const categoryId = input.categoryId ?? current.categoryId;
    const category = await requireCategory(categoryId);
    if (input.name !== undefined || input.categoryId !== undefined) {
      await assertItemNameAvailable(
        categoryId,
        input.name ?? current.name,
        itemId,
      );
    }
    assertOrderingConfiguration({ ...current, ...input });
    const settings = await ensureInstructionSettings(db);
    assertInstructionAssignments(settings, {
      defaultInstructionCodes:
        input.defaultInstructionCodes === undefined
          ? current.defaultInstructionCodes
          : input.defaultInstructionCodes,
      additionalInstructionCodes:
        input.additionalInstructionCodes === undefined
          ? current.additionalInstructionCodes
          : input.additionalInstructionCodes,
    });
    const [updated] = await db
      .update(menuItems)
      .set(input)
      .where(eq(menuItems.id, itemId))
      .returning();
    return localCatalogItemResponseSchema.parse({
      item: toItem(
        updated,
        resolveInstructionConfig(settings, category, updated),
      ),
    });
  }

  async function requireCategory(categoryId: string) {
    const category = await db.query.menuCategories.findFirst({
      where: eq(menuCategories.id, categoryId),
    });
    if (!category) {
      throw new HttpError(
        404,
        'CATALOG_CATEGORY_NOT_FOUND',
        'The requested catalog category does not exist.',
      );
    }
    return category;
  }

  async function assertCategoryNameAvailable(
    name: string,
    excludedId?: string,
  ): Promise<void> {
    const existing = await db.query.menuCategories.findFirst({
      where: excludedId
        ? and(
            sql`lower(${menuCategories.name}) = lower(${name})`,
            ne(menuCategories.id, excludedId),
          )
        : sql`lower(${menuCategories.name}) = lower(${name})`,
    });
    if (existing) {
      throw new HttpError(
        409,
        'CATALOG_CATEGORY_NAME_CONFLICT',
        'A category with this name already exists.',
      );
    }
  }

  async function assertItemNameAvailable(
    categoryId: string,
    name: string,
    excludedId?: string,
  ): Promise<void> {
    const conditions = [
      eq(menuItems.categoryId, categoryId),
      sql`lower(${menuItems.name}) = lower(${name})`,
    ];
    if (excludedId) conditions.push(ne(menuItems.id, excludedId));
    const existing = await db.query.menuItems.findFirst({
      where: and(...conditions),
    });
    if (existing) {
      throw new HttpError(
        409,
        'CATALOG_ITEM_NAME_CONFLICT',
        'An item with this name already exists in the category.',
      );
    }
  }

  return {
    createCatalogCategory,
    updateCatalogCategory,
    createCatalogItem,
    updateCatalogItem,
  };
}

function catalogItemNotFoundError(): HttpError {
  return new HttpError(
    404,
    'CATALOG_ITEM_NOT_FOUND',
    'The requested catalog item does not exist.',
  );
}

function toCategory(category: typeof menuCategories.$inferSelect) {
  return {
    id: category.id,
    name: category.name,
    sortOrder: category.sortOrder,
    isActive: category.isActive,
    defaultInstructionCodes: category.defaultInstructionCodes,
    additionalInstructionCodes: category.additionalInstructionCodes,
  };
}

function toItem(
  item: typeof menuItems.$inferSelect,
  instructionConfig: {
    defaultOptions: Array<{
      code: string;
      label: string;
      conflictsWith: string[];
    }>;
    additionalOptions: Array<{
      code: string;
      label: string;
      conflictsWith: string[];
    }>;
  },
) {
  return {
    id: item.id,
    categoryId: item.categoryId,
    name: item.name,
    description: item.description,
    priceCents: item.priceCents,
    kitchenStation: item.kitchenStation,
    orderingPolicy: item.orderingPolicy,
    variantOptions: item.variantOptions,
    requiredVariantQuantity: item.requiredVariantQuantity,
    defaultInstructionCodes: item.defaultInstructionCodes,
    additionalInstructionCodes: item.additionalInstructionCodes,
    instructionConfig,
    isAvailable: item.isAvailable,
    sortOrder: item.sortOrder,
  };
}

function assertOrderingConfiguration(input: {
  orderingPolicy: 'merge' | 'separate';
  variantOptions: Array<{ code: string; label: string }>;
  requiredVariantQuantity: number;
}): void {
  const codes = input.variantOptions.map(({ code }) => code);
  if (new Set(codes).size !== codes.length) {
    throw new HttpError(
      422,
      'DUPLICATE_VARIANT_CODE',
      'Variant option codes must be unique.',
    );
  }
  if (input.requiredVariantQuantity > 0 && input.variantOptions.length === 0) {
    throw new HttpError(
      422,
      'VARIANT_OPTIONS_REQUIRED',
      'Required variant quantity needs at least one variant option.',
    );
  }
  if (input.requiredVariantQuantity === 0 && input.variantOptions.length > 0) {
    throw new HttpError(
      422,
      'VARIANT_QUANTITY_REQUIRED',
      'Variant options need a required quantity per portion.',
    );
  }
  if (
    input.requiredVariantQuantity > 0 &&
    input.orderingPolicy !== 'separate'
  ) {
    throw new HttpError(
      422,
      'VARIANT_ITEM_SEPARATE_PORTION_REQUIRED',
      'Items with required variants must use separate portions.',
    );
  }
}
