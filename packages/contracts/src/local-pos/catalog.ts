import { z } from 'zod';
import { identifierSchema } from '../common';

export const kitchenStationSchema = z.enum([
  'kitchen',
  'bar',
  'dessert',
  'none',
]);

export const itemOrderingPolicySchema = z.enum(['merge', 'separate']);
const catalogOptionCodeSchema = z
  .string()
  .trim()
  .regex(/^[A-Z0-9_]{1,50}$/);
export const catalogItemVariantOptionSchema = z
  .object({
    code: catalogOptionCodeSchema,
    label: z.string().trim().min(1).max(100),
  })
  .strict();

export const localQuickInstructionOptionSchema = z
  .object({
    code: catalogOptionCodeSchema,
    label: z.string().trim().min(1).max(100),
    conflictsWith: z.array(catalogOptionCodeSchema).max(20),
  })
  .strict();
export const localAllergenOptionSchema = z
  .object({
    code: catalogOptionCodeSchema,
    label: z.string().trim().min(1).max(100),
  })
  .strict();
export const localInstructionSettingsSchema = z
  .object({
    quickInstructionOptions: z
      .array(localQuickInstructionOptionSchema)
      .max(200),
    allergenOptions: z.array(localAllergenOptionSchema).max(100),
  })
  .strict();
export const localItemInstructionConfigSchema = z
  .object({
    defaultOptions: z.array(localQuickInstructionOptionSchema).max(100),
    additionalOptions: z.array(localQuickInstructionOptionSchema).max(100),
  })
  .strict();

export const localCatalogItemSchema = z
  .object({
    id: identifierSchema,
    categoryId: identifierSchema,
    name: z.string().min(1),
    description: z.string().nullable(),
    priceCents: z.number().int().nonnegative(),
    kitchenStation: kitchenStationSchema,
    orderingPolicy: itemOrderingPolicySchema,
    variantOptions: z.array(catalogItemVariantOptionSchema).max(20),
    requiredVariantQuantity: z.number().int().min(0).max(100),
    defaultInstructionCodes: z
      .array(catalogOptionCodeSchema)
      .max(100)
      .nullable(),
    additionalInstructionCodes: z
      .array(catalogOptionCodeSchema)
      .max(100)
      .nullable(),
    instructionConfig: localItemInstructionConfigSchema,
    isAvailable: z.boolean(),
    sortOrder: z.number().int(),
  })
  .strict();

export const localCatalogCategorySchema = z
  .object({
    id: identifierSchema,
    name: z.string().min(1),
    sortOrder: z.number().int(),
    isActive: z.boolean(),
    defaultInstructionCodes: z.array(catalogOptionCodeSchema).max(100),
    additionalInstructionCodes: z.array(catalogOptionCodeSchema).max(100),
    items: z.array(localCatalogItemSchema),
  })
  .strict();

export const comboPricingModeSchema = z.enum(['fixed', 'base_item_plus_delta']);
export const localComboRuleGroupItemSchema = z
  .object({
    id: identifierSchema,
    menuItemId: identifierSchema,
    extraPriceCents: z.number().int().nonnegative(),
  })
  .strict();
export const localComboRuleGroupSchema = z
  .object({
    id: identifierSchema,
    name: z.string().min(1),
    minQuantity: z.number().int().nonnegative(),
    maxQuantity: z.number().int().nonnegative(),
    sortOrder: z.number().int(),
    items: z.array(localComboRuleGroupItemSchema),
  })
  .strict();
export const localComboRuleSchema = z
  .object({
    id: identifierSchema,
    name: z.string().min(1),
    pricingMode: comboPricingModeSchema,
    comboPriceCents: z.number().int().nonnegative(),
    priceDeltaCents: z.number().int(),
    basePricingGroupName: z.string().nullable(),
    priority: z.number().int(),
    maxApplications: z.number().int().positive().nullable(),
    isActive: z.boolean(),
    isSuggestionEnabled: z.boolean(),
    groups: z.array(localComboRuleGroupSchema),
  })
  .strict();

export const localCatalogResponseSchema = z
  .object({
    categories: z.array(localCatalogCategorySchema),
    comboRules: z.array(localComboRuleSchema),
    instructionSettings: localInstructionSettingsSchema,
  })
  .strict();

const catalogNameSchema = z.string().trim().min(1).max(255);
const catalogSortOrderSchema = z.number().int().min(-100_000).max(100_000);
const catalogPriceCentsSchema = z.number().int().min(0).max(100_000_000);

export const createLocalCatalogCategoryInputSchema = z
  .object({
    name: catalogNameSchema,
    sortOrder: catalogSortOrderSchema.default(0),
    defaultInstructionCodes: z
      .array(catalogOptionCodeSchema)
      .max(100)
      .default([]),
    additionalInstructionCodes: z
      .array(catalogOptionCodeSchema)
      .max(100)
      .default([]),
  })
  .strict();

export const updateLocalCatalogCategoryInputSchema = z
  .object({
    name: catalogNameSchema.optional(),
    sortOrder: catalogSortOrderSchema.optional(),
    isActive: z.boolean().optional(),
    defaultInstructionCodes: z
      .array(catalogOptionCodeSchema)
      .max(100)
      .optional(),
    additionalInstructionCodes: z
      .array(catalogOptionCodeSchema)
      .max(100)
      .optional(),
  })
  .strict()
  .refine((values) => Object.keys(values).length > 0, {
    message: 'At least one category field is required.',
  });

export const createLocalCatalogItemInputSchema = z
  .object({
    categoryId: identifierSchema,
    name: catalogNameSchema,
    description: z.string().trim().max(2000).nullable().default(null),
    priceCents: catalogPriceCentsSchema,
    kitchenStation: kitchenStationSchema,
    orderingPolicy: itemOrderingPolicySchema.default('merge'),
    variantOptions: z.array(catalogItemVariantOptionSchema).max(20).default([]),
    requiredVariantQuantity: z.number().int().min(0).max(100).default(0),
    defaultInstructionCodes: z
      .array(catalogOptionCodeSchema)
      .max(100)
      .nullable()
      .default(null),
    additionalInstructionCodes: z
      .array(catalogOptionCodeSchema)
      .max(100)
      .nullable()
      .default(null),
    isAvailable: z.boolean().default(true),
    sortOrder: catalogSortOrderSchema.default(0),
  })
  .strict();

export const updateLocalCatalogItemInputSchema = z
  .object({
    categoryId: identifierSchema.optional(),
    name: catalogNameSchema.optional(),
    description: z.string().trim().max(2000).nullable().optional(),
    priceCents: catalogPriceCentsSchema.optional(),
    kitchenStation: kitchenStationSchema.optional(),
    orderingPolicy: itemOrderingPolicySchema.optional(),
    variantOptions: z.array(catalogItemVariantOptionSchema).max(20).optional(),
    requiredVariantQuantity: z.number().int().min(0).max(100).optional(),
    defaultInstructionCodes: z
      .array(catalogOptionCodeSchema)
      .max(100)
      .nullable()
      .optional(),
    additionalInstructionCodes: z
      .array(catalogOptionCodeSchema)
      .max(100)
      .nullable()
      .optional(),
    isAvailable: z.boolean().optional(),
    sortOrder: catalogSortOrderSchema.optional(),
  })
  .strict()
  .refine((values) => Object.keys(values).length > 0, {
    message: 'At least one catalog-item field is required.',
  });

export const localCatalogCategoryResponseSchema = z
  .object({ category: localCatalogCategorySchema })
  .strict();

export const localCatalogItemResponseSchema = z
  .object({ item: localCatalogItemSchema })
  .strict();

export const updateLocalInstructionSettingsInputSchema =
  localInstructionSettingsSchema;

const comboRuleNameSchema = z.string().trim().min(1).max(255);
const comboMoneySchema = z.number().int().min(0).max(100_000_000);
const comboSignedMoneySchema = z
  .number()
  .int()
  .min(-100_000_000)
  .max(100_000_000);
const comboPrioritySchema = z.number().int().min(-100_000).max(100_000);

export const createLocalComboRuleInputSchema = z
  .object({
    name: comboRuleNameSchema,
    pricingMode: comboPricingModeSchema,
    comboPriceCents: comboMoneySchema,
    priceDeltaCents: comboSignedMoneySchema.default(0),
    basePricingGroupName: comboRuleNameSchema.nullable().default(null),
    priority: comboPrioritySchema.default(0),
    maxApplications: z.number().int().positive().max(10_000).nullable(),
    isActive: z.boolean().default(false),
    isSuggestionEnabled: z.boolean().default(true),
  })
  .strict();

export const updateLocalComboRuleInputSchema = z
  .object({
    name: comboRuleNameSchema.optional(),
    pricingMode: comboPricingModeSchema.optional(),
    comboPriceCents: comboMoneySchema.optional(),
    priceDeltaCents: comboSignedMoneySchema.optional(),
    basePricingGroupName: comboRuleNameSchema.nullable().optional(),
    priority: comboPrioritySchema.optional(),
    maxApplications: z
      .number()
      .int()
      .positive()
      .max(10_000)
      .nullable()
      .optional(),
    isActive: z.boolean().optional(),
    isSuggestionEnabled: z.boolean().optional(),
  })
  .strict()
  .refine((values) => Object.keys(values).length > 0, {
    message: 'At least one combo-rule field is required.',
  });

export const createLocalComboGroupInputSchema = z
  .object({
    comboRuleId: identifierSchema,
    name: comboRuleNameSchema,
    minQuantity: z.number().int().min(0).max(100),
    maxQuantity: z.number().int().min(0).max(100),
    sortOrder: comboPrioritySchema.default(0),
  })
  .strict()
  .refine((values) => values.maxQuantity >= values.minQuantity, {
    message: 'Group maxQuantity must be greater than or equal to minQuantity.',
  });

export const updateLocalComboGroupInputSchema = z
  .object({
    name: comboRuleNameSchema.optional(),
    minQuantity: z.number().int().min(0).max(100).optional(),
    maxQuantity: z.number().int().min(0).max(100).optional(),
    sortOrder: comboPrioritySchema.optional(),
  })
  .strict()
  .refine((values) => Object.keys(values).length > 0, {
    message: 'At least one combo-group field is required.',
  })
  .refine(
    (values) =>
      values.minQuantity === undefined ||
      values.maxQuantity === undefined ||
      values.maxQuantity >= values.minQuantity,
    {
      message:
        'Group maxQuantity must be greater than or equal to minQuantity.',
    },
  );

export const createLocalComboGroupItemInputSchema = z
  .object({
    comboRuleGroupId: identifierSchema,
    menuItemId: identifierSchema,
    extraPriceCents: comboMoneySchema.default(0),
  })
  .strict();

export const updateLocalComboGroupItemInputSchema = z
  .object({ extraPriceCents: comboMoneySchema })
  .strict();

export const localComboRuleResponseSchema = z
  .object({ comboRule: localComboRuleSchema })
  .strict();

export const localComboGroupResponseSchema = z
  .object({ group: localComboRuleGroupSchema })
  .strict();

export const localComboGroupItemResponseSchema = z
  .object({ item: localComboRuleGroupItemSchema })
  .strict();

export const localComboDeleteResponseSchema = z
  .object({ success: z.literal(true) })
  .strict();

export type LocalCatalogResponse = z.infer<typeof localCatalogResponseSchema>;
export type LocalItemInstructionConfig = z.infer<
  typeof localItemInstructionConfigSchema
>;
export type LocalInstructionSettings = z.infer<
  typeof localInstructionSettingsSchema
>;
export type UpdateLocalInstructionSettingsInput = z.infer<
  typeof updateLocalInstructionSettingsInputSchema
>;
export type CreateLocalCatalogCategoryInput = z.infer<
  typeof createLocalCatalogCategoryInputSchema
>;
export type UpdateLocalCatalogCategoryInput = z.infer<
  typeof updateLocalCatalogCategoryInputSchema
>;
export type CreateLocalCatalogItemInput = z.infer<
  typeof createLocalCatalogItemInputSchema
>;
export type UpdateLocalCatalogItemInput = z.infer<
  typeof updateLocalCatalogItemInputSchema
>;
export type CreateLocalComboRuleInput = z.infer<
  typeof createLocalComboRuleInputSchema
>;
export type UpdateLocalComboRuleInput = z.infer<
  typeof updateLocalComboRuleInputSchema
>;
export type CreateLocalComboGroupInput = z.infer<
  typeof createLocalComboGroupInputSchema
>;
export type UpdateLocalComboGroupInput = z.infer<
  typeof updateLocalComboGroupInputSchema
>;
export type CreateLocalComboGroupItemInput = z.infer<
  typeof createLocalComboGroupItemInputSchema
>;
export type UpdateLocalComboGroupItemInput = z.infer<
  typeof updateLocalComboGroupItemInputSchema
>;
