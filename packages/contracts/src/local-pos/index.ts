import { z } from 'zod';
import { identifierSchema, isoDateTimeSchema } from '../common';

export const localPosApiVersion = 'v1' as const;
export const localPosApiBasePath = `/api/${localPosApiVersion}` as const;
export const uuidV7Schema = identifierSchema.refine(
  (value) => value[14]?.toLowerCase() === '7',
  'Expected a UUIDv7 value.',
);

export const localPosRoutes = {
  health: '/health',
  authLogin: `${localPosApiBasePath}/auth/login`,
  authSession: `${localPosApiBasePath}/auth/session`,
  localUsers: `${localPosApiBasePath}/local-users`,
  catalog: `${localPosApiBasePath}/catalog`,
  catalogCategories: `${localPosApiBasePath}/catalog/categories`,
  catalogItems: `${localPosApiBasePath}/catalog/items`,
  instructionSettings: `${localPosApiBasePath}/catalog/instruction-settings`,
  comboRules: `${localPosApiBasePath}/catalog/combo-rules`,
  comboRuleGroups: `${localPosApiBasePath}/catalog/combo-groups`,
  comboRuleGroupItems: `${localPosApiBasePath}/catalog/combo-group-items`,
  orders: `${localPosApiBasePath}/orders`,
  ordersHome: `${localPosApiBasePath}/orders/home`,
  kitchenQueue: `${localPosApiBasePath}/kitchen`,
  kitchenEvents: `${localPosApiBasePath}/kitchen/events`,
  orderItems: `${localPosApiBasePath}/order-items`,
  payments: `${localPosApiBasePath}/payments`,
  printJobs: `${localPosApiBasePath}/print-jobs`,
  printTest: `${localPosApiBasePath}/print-jobs/test`,
  printSettings: `${localPosApiBasePath}/print-settings`,
  establishmentProfile: `${localPosApiBasePath}/establishment-profile`,
  managementReports: `${localPosApiBasePath}/management/reports`,
  printerStatus: `${localPosApiBasePath}/printer-status`,
} as const;

export const siteAgentHealthResponseSchema = z
  .object({
    status: z.enum(['ok', 'degraded']),
    database: z.enum(['ready', 'unavailable']),
    service: z.literal('site-agent'),
    apiVersion: z.literal(localPosApiVersion),
    checkedAt: isoDateTimeSchema,
  })
  .strict();

export const localUserRoleSchema = z.enum([
  'admin',
  'manager',
  'staff',
  'kitchen',
]);

export const localUserSchema = z
  .object({
    id: identifierSchema,
    name: z.string().min(1),
    email: z.string().email().nullable(),
    role: localUserRoleSchema,
    isActive: z.boolean(),
  })
  .strict();

export const localUsersResponseSchema = z
  .object({ users: z.array(localUserSchema) })
  .strict();

export const localPinSchema = z
  .string()
  .trim()
  .regex(/^\d{4,8}$/, 'PIN must contain between 4 and 8 digits.');

const localUserNameSchema = z.string().trim().min(1).max(255);
const localUserEmailSchema = z.string().trim().email().max(320).nullable();

export const createLocalUserInputSchema = z
  .object({
    name: localUserNameSchema,
    email: localUserEmailSchema,
    role: localUserRoleSchema,
    pin: localPinSchema,
  })
  .strict();

export const updateLocalUserInputSchema = z
  .object({
    name: localUserNameSchema.optional(),
    email: localUserEmailSchema.optional(),
    role: localUserRoleSchema.optional(),
    isActive: z.boolean().optional(),
  })
  .strict()
  .refine((values) => Object.keys(values).length > 0, {
    message: 'At least one local-user field is required.',
  });

export const resetLocalUserPinInputSchema = z
  .object({ pin: localPinSchema })
  .strict();

export const localUserResponseSchema = z
  .object({ user: localUserSchema })
  .strict();

export const localAuthLoginInputSchema = z
  .object({
    userId: identifierSchema,
    pin: localPinSchema,
  })
  .strict();

export const localAuthSessionSchema = z
  .object({
    id: identifierSchema,
    user: localUserSchema,
    expiresAt: isoDateTimeSchema,
  })
  .strict();

export const localAuthLoginResponseSchema = z
  .object({
    token: z.string().min(32).max(200),
    session: localAuthSessionSchema,
  })
  .strict();

export const localAuthSessionResponseSchema = z
  .object({ session: localAuthSessionSchema })
  .strict();

export const localAuthLogoutResponseSchema = z
  .object({ success: z.literal(true) })
  .strict();

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

export const localOrderTypeSchema = z.enum(['dine_in', 'takeaway', 'delivery']);
export const localOrderStatusSchema = z.enum([
  'draft',
  'sent',
  'preparing',
  'ready',
  'served',
  'paid',
  'cancelled',
]);
export const localOrderItemStatusSchema = z.enum([
  'pending',
  'sent',
  'preparing',
  'ready',
  'served',
  'cancelled',
]);
export const localPaymentModeSchema = z.enum([
  'single',
  'split_by_items',
  'split_equally',
]);
export const allergySeveritySchema = z.enum([
  'intolerance',
  'allergy',
  'severe_no_traces',
]);

export const createLocalOrderInputSchema = z
  .object({
    tableLabel: z.string().trim().min(1).max(255),
    orderType: localOrderTypeSchema,
    staffUserId: identifierSchema,
    note: z.string().trim().max(2000).optional(),
  })
  .strict();

export const localOrderSummarySchema = z
  .object({
    id: identifierSchema,
    orderNumber: z.string().min(1),
    tableLabel: z.string().min(1),
    orderType: localOrderTypeSchema,
    status: localOrderStatusSchema,
    subtotalCents: z.number().int().nonnegative(),
    discountCents: z.number().int().nonnegative(),
    totalCents: z.number().int().nonnegative(),
    paymentMode: localPaymentModeSchema,
    note: z.string().nullable(),
    hasAllergy: z.boolean(),
    allergyNote: z.string().nullable(),
    allergyAcknowledgedAt: isoDateTimeSchema.nullable(),
    createdBy: identifierSchema,
    sentAt: isoDateTimeSchema.nullable(),
    paidAt: isoDateTimeSchema.nullable(),
    cancelledAt: isoDateTimeSchema.nullable(),
    cancelledReason: z.string().nullable(),
    createdAt: isoDateTimeSchema,
    updatedAt: isoDateTimeSchema,
  })
  .strict();

export const localOrdersQuerySchema = z
  .object({
    status: localOrderStatusSchema.optional(),
    limit: z.coerce.number().int().min(1).max(200).default(50),
  })
  .strict();

export const localOrdersResponseSchema = z
  .object({ orders: z.array(localOrderSummarySchema) })
  .strict();

export const localOrdersHomeViewSchema = z.enum([
  'open',
  'paid_today',
  'all_today',
]);

export const localOrdersHomeQuerySchema = z
  .object({
    view: localOrdersHomeViewSchema.default('open'),
    q: z.string().trim().max(255).default(''),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().min(1).max(100).default(50),
  })
  .strict();

export const localOrdersHomeRowSchema = localOrderSummarySchema
  .extend({
    itemCount: z.number().int().nonnegative(),
  })
  .strict();

export const localOrdersHomeResponseSchema = z
  .object({
    serviceDay: z
      .object({
        start: isoDateTimeSchema,
        end: isoDateTimeSchema,
      })
      .strict(),
    view: localOrdersHomeViewSchema,
    query: z.string(),
    orders: z.array(localOrdersHomeRowSchema),
    counts: z
      .object({
        open: z.number().int().nonnegative(),
        paidToday: z.number().int().nonnegative(),
        allToday: z.number().int().nonnegative(),
      })
      .strict(),
    pagination: z
      .object({
        page: z.number().int().positive(),
        pageSize: z.number().int().positive(),
        totalItems: z.number().int().nonnegative(),
        totalPages: z.number().int().positive(),
      })
      .strict(),
  })
  .strict();

export const localManagementReportsQuerySchema = z
  .object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().min(1).max(100).default(50),
  })
  .strict();

export const localManagementReportOrderSchema = z
  .object({
    id: identifierSchema,
    orderNumber: z.string().min(1),
    tableLabel: z.string().min(1),
    orderType: localOrderTypeSchema,
    status: localOrderStatusSchema,
    paymentMode: localPaymentModeSchema,
    totalCents: z.number().int().nonnegative(),
    createdAt: isoDateTimeSchema,
    paidAt: isoDateTimeSchema.nullable(),
  })
  .strict();

export const localManagementReportsResponseSchema = z
  .object({
    serviceDay: z
      .object({
        start: isoDateTimeSchema,
        end: isoDateTimeSchema,
      })
      .strict(),
    generatedAt: isoDateTimeSchema,
    summary: z
      .object({
        paidRevenueCents: z.number().int().nonnegative(),
        paidOrderCount: z.number().int().nonnegative(),
        openOrderCount: z.number().int().nonnegative(),
      })
      .strict(),
    orders: z.array(localManagementReportOrderSchema),
    pagination: z
      .object({
        page: z.number().int().positive(),
        pageSize: z.number().int().positive().max(100),
        totalItems: z.number().int().nonnegative(),
        totalPages: z.number().int().positive(),
      })
      .strict(),
  })
  .strict();

export const localOrderResponseSchema = z
  .object({ order: localOrderSummarySchema })
  .strict();

export const selectedInstructionSnapshotSchema = z
  .object({
    instructionId: z.string().min(1),
    code: z.string().min(1),
    labelSnapshot: z.string().min(1),
  })
  .strict();
export const itemVariantSnapshotSchema = z
  .object({
    code: z.string().min(1),
    labelSnapshot: z.string().min(1),
    quantity: z.number().int().positive(),
  })
  .strict();
export const allergenSnapshotSchema = z
  .object({
    code: z.string().min(1),
    labelSnapshot: z.string().min(1),
  })
  .strict();
export const localOrderItemSchema = z
  .object({
    id: identifierSchema,
    orderId: identifierSchema,
    menuItemId: identifierSchema,
    itemNameSnapshot: z.string().min(1),
    unitPriceCentsSnapshot: z.number().int().nonnegative(),
    kitchenStationSnapshot: kitchenStationSchema,
    quantity: z.number().int().positive(),
    note: z.string().nullable(),
    quickInstructions: z.array(selectedInstructionSnapshotSchema),
    selectedVariants: z.array(itemVariantSnapshotSchema),
    hasAllergy: z.boolean(),
    allergenCodes: z.array(z.string()),
    selectedAllergens: z.array(allergenSnapshotSchema),
    allergySeverity: allergySeveritySchema.nullable(),
    allergyNote: z.string().nullable(),
    allergyAcknowledgedAt: isoDateTimeSchema.nullable(),
    allergyKitchenConfirmedAt: isoDateTimeSchema.nullable(),
    status: localOrderItemStatusSchema,
    sentAt: isoDateTimeSchema.nullable(),
    readyAt: isoDateTimeSchema.nullable(),
    servedAt: isoDateTimeSchema.nullable(),
    cancelledAt: isoDateTimeSchema.nullable(),
    cancelledReason: z.string().nullable(),
    createdAt: isoDateTimeSchema,
    updatedAt: isoDateTimeSchema,
  })
  .strict();
export const localOrderDiscountItemSchema = z
  .object({
    quantityApplied: z.number().int().positive(),
    orderItem: z
      .object({
        id: identifierSchema,
        itemNameSnapshot: z.string().min(1),
      })
      .strict(),
  })
  .strict();
export const localOrderDiscountSchema = z
  .object({
    id: identifierSchema,
    nameSnapshot: z.string().min(1),
    discountCents: z.number().int().nonnegative(),
    items: z.array(localOrderDiscountItemSchema),
  })
  .strict();
export const localOrderDetailResponseSchema = z
  .object({
    order: localOrderSummarySchema,
    items: z.array(localOrderItemSchema),
    discounts: z.array(localOrderDiscountSchema),
  })
  .strict();

export const localKitchenScreenSchema = z.enum(['kitchen', 'counter']);
export const localKitchenQueueSchema = z.enum(['active', 'ready']);
export const localKitchenQueueQuerySchema = z
  .object({
    screen: localKitchenScreenSchema.default('kitchen'),
    queue: localKitchenQueueSchema.default('active'),
    limit: z.coerce.number().int().min(1).max(200).default(100),
  })
  .strict();
export const localKitchenQueueItemSchema = localOrderItemSchema
  .extend({
    categoryName: z.string().min(1).nullable(),
    categorySortOrder: z.number().int().nullable(),
    itemSortOrder: z.number().int().nullable(),
  })
  .strict();
export const localKitchenQueueResponseSchema = z
  .object({
    serviceDay: z
      .object({
        start: isoDateTimeSchema,
        end: isoDateTimeSchema,
      })
      .strict(),
    screen: localKitchenScreenSchema,
    queue: localKitchenQueueSchema,
    tickets: z.array(
      z
        .object({
          order: localOrderSummarySchema,
          items: z.array(localKitchenQueueItemSchema).min(1),
        })
        .strict(),
    ),
    counts: z
      .object({
        stations: z
          .object({
            kitchen: z.number().int().nonnegative(),
            bar: z.number().int().nonnegative(),
            dessert: z.number().int().nonnegative(),
          })
          .strict(),
        queues: z
          .object({
            active: z.number().int().nonnegative(),
            ready: z.number().int().nonnegative(),
          })
          .strict(),
      })
      .strict(),
  })
  .strict();
export const localKitchenEventScreenSchema = z.enum([
  'kitchen',
  'counter',
  'all',
]);
export const localKitchenEventReasonSchema = z.enum([
  'ticket_created',
  'state_changed',
]);
export const localKitchenEventSchema = z
  .object({
    type: z.literal('kitchen_changed'),
    revision: z.string().min(1),
    screen: localKitchenEventScreenSchema,
    reason: localKitchenEventReasonSchema,
    occurredAt: isoDateTimeSchema,
  })
  .strict();
export const localOrderItemResponseSchema = z
  .object({ item: localOrderItemSchema })
  .strict();

export const addLocalOrderItemInputSchema = z
  .object({
    menuItemId: identifierSchema,
    quantity: z.number().int().positive().default(1),
    note: z.string().trim().max(2000).optional(),
  })
  .strict();

export const updateLocalOrderItemInputSchema = z
  .object({
    quantity: z.number().int().positive().optional(),
    note: z.string().trim().max(300).nullable().optional(),
    selectedInstructionCodes: z
      .array(z.string().trim().min(1))
      .max(20)
      .optional(),
    selectedVariants: z
      .array(
        z
          .object({
            code: z.string().trim().min(1),
            quantity: z.number().int().nonnegative(),
          })
          .strict(),
      )
      .max(20)
      .optional(),
    hasAllergy: z.boolean().optional(),
    allergenCodes: z.array(z.string().trim().min(1)).max(20).optional(),
    allergySeverity: allergySeveritySchema.nullable().optional(),
    allergyNote: z.string().trim().max(300).nullable().optional(),
  })
  .strict()
  .refine((values) => Object.keys(values).length > 0, {
    message: 'At least one order-item field is required.',
  });

export const localOrderItemCommandSchema = z.discriminatedUnion('action', [
  z.object({ action: z.literal('remove_pending') }).strict(),
  z
    .object({
      action: z.literal('cancel'),
      reason: z.string().trim().max(2000).optional(),
    })
    .strict(),
  z.object({ action: z.literal('restore') }).strict(),
  z.object({ action: z.literal('mark_sent') }).strict(),
  z.object({ action: z.literal('mark_preparing') }).strict(),
  z.object({ action: z.literal('mark_ready') }).strict(),
  z
    .object({
      action: z.literal('confirm_allergy'),
      staffUserId: identifierSchema,
    })
    .strict(),
]);

export const localOrderCommandSchema = z.discriminatedUnion('action', [
  z
    .object({
      action: z.literal('cancel'),
      reason: z.string().trim().max(2000).optional(),
    })
    .strict(),
  z
    .object({
      action: z.literal('send_to_kitchen'),
      idempotencyKey: uuidV7Schema,
      allergyAcknowledged: z.boolean().default(false),
      staffUserId: identifierSchema,
    })
    .strict(),
  z
    .object({
      action: z.literal('mark_station_preparing'),
      station: z.enum(['kitchen', 'bar', 'dessert', 'counter']),
    })
    .strict(),
  z
    .object({
      action: z.literal('mark_station_sent'),
      station: z.enum(['kitchen', 'bar', 'dessert', 'counter']),
    })
    .strict(),
]);

export const paymentMethodSchema = z.enum([
  'cash',
  'card',
  'ticket_resto',
  'other',
]);

const paymentCaptureFields = {
  method: paymentMethodSchema,
  amountCents: z.number().int().positive(),
  tenderedCents: z.number().int().positive().optional(),
  tipCents: z.number().int().nonnegative().optional(),
  staffUserId: identifierSchema,
  idempotencyKey: uuidV7Schema,
};

export const payLocalOrderInputSchema = z.object(paymentCaptureFields).strict();
export const payLocalCheckInputSchema = z
  .object({ checkId: identifierSchema, ...paymentCaptureFields })
  .strict();

export const splitLocalOrderEquallyInputSchema = z
  .object({ parts: z.number().int().min(2).max(99) })
  .strict();

export const splitCheckItemSchema = z
  .object({
    orderItemId: identifierSchema,
    quantity: z.number().int().positive(),
  })
  .strict();
export const createLocalChecksByItemsInputSchema = z
  .object({
    checks: z
      .array(
        z
          .object({
            checkLabel: z.string().trim().min(1).max(255),
            items: z.array(splitCheckItemSchema).min(1),
          })
          .strict(),
      )
      .min(1),
  })
  .strict();

export const localCheckStatusSchema = z.enum(['open', 'paid', 'void']);
export const localCheckItemSchema = z
  .object({
    id: identifierSchema,
    quantity: z.number().int().positive(),
    amountCentsSnapshot: z.number().int().nonnegative(),
    orderItem: z
      .object({
        id: identifierSchema,
        itemNameSnapshot: z.string().min(1),
        unitPriceCentsSnapshot: z.number().int().nonnegative(),
      })
      .strict(),
  })
  .strict();
export const localCheckDiscountItemSchema = z
  .object({
    quantityApplied: z.number().int().positive(),
    checkItem: z
      .object({
        id: identifierSchema,
        orderItem: z
          .object({
            id: identifierSchema,
            itemNameSnapshot: z.string().min(1),
          })
          .strict(),
      })
      .strict(),
  })
  .strict();
export const localCheckDiscountSchema = z
  .object({
    id: identifierSchema,
    nameSnapshot: z.string().min(1),
    discountCents: z.number().int().nonnegative(),
    items: z.array(localCheckDiscountItemSchema),
  })
  .strict();
export const localCheckSchema = z
  .object({
    id: identifierSchema,
    orderId: identifierSchema,
    checkLabel: z.string().min(1),
    splitMode: z.enum(['items', 'equal']),
    status: localCheckStatusSchema,
    subtotalCents: z.number().int().nonnegative(),
    discountCents: z.number().int().nonnegative(),
    totalCents: z.number().int().nonnegative(),
    items: z.array(localCheckItemSchema),
    discounts: z.array(localCheckDiscountSchema),
    createdAt: isoDateTimeSchema,
  })
  .strict();
export const localChecksResponseSchema = z
  .object({ checks: z.array(localCheckSchema) })
  .strict();

export const localPaymentStatusSchema = z.enum([
  'pending',
  'paid',
  'refunded',
  'failed',
]);
export const localPaymentSchema = z
  .object({
    id: identifierSchema,
    orderId: identifierSchema,
    checkId: identifierSchema.nullable(),
    method: paymentMethodSchema,
    amountCents: z.number().int().positive(),
    tenderedCents: z.number().int().nonnegative().nullable(),
    changeCents: z.number().int().nonnegative().nullable(),
    tipCents: z.number().int().nonnegative(),
    status: localPaymentStatusSchema,
    paidBy: z.string().nullable(),
    paidAt: isoDateTimeSchema.nullable(),
    createdAt: isoDateTimeSchema,
  })
  .strict();

export const printJobTypeSchema = z.enum([
  'kitchen_ticket',
  'customer_receipt',
  'test',
]);
export const printJobStatusSchema = z.enum([
  'pending',
  'printing',
  'printed',
  'failed',
]);
export const printJobSourceSchema = z.enum([
  'pos',
  'kitchen',
  'delivery',
  'manual',
]);
export const printJobsQuerySchema = z
  .object({
    status: printJobStatusSchema.optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(200).default(50),
  })
  .strict();
export const createPrintJobInputSchema = z
  .object({
    type: printJobTypeSchema,
    orderId: identifierSchema,
    orderItemIds: z.array(identifierSchema).optional(),
    checkId: identifierSchema.optional(),
    paymentId: identifierSchema.optional(),
    idempotencyKey: uuidV7Schema.optional(),
  })
  .strict();
export const localPrintJobSchema = z
  .object({
    id: identifierSchema,
    orderId: identifierSchema.nullable(),
    checkId: identifierSchema.nullable(),
    paymentId: identifierSchema.nullable(),
    type: printJobTypeSchema,
    source: printJobSourceSchema,
    status: printJobStatusSchema,
    printerName: z.string().min(1),
    summary: z
      .object({
        orderNumber: z.string().nullable(),
        tableLabel: z.string().nullable(),
        itemCount: z.number().int().nonnegative(),
      })
      .strict(),
    errorMessage: z.string().nullable(),
    createdAt: isoDateTimeSchema,
    printedAt: isoDateTimeSchema.nullable(),
  })
  .strict();
export const localKitchenSendResponseSchema = z
  .object({
    order: localOrderSummarySchema,
    items: z.array(localOrderItemSchema),
    discounts: z.array(localOrderDiscountSchema),
    printJob: localPrintJobSchema,
    replayed: z.boolean(),
  })
  .strict();
export const localPaymentCaptureResponseSchema = z
  .object({
    payment: localPaymentSchema,
    printJob: localPrintJobSchema.nullable(),
    replayed: z.boolean(),
  })
  .strict();
export const localPaymentSummaryResponseSchema = z
  .object({
    order: localOrderSummarySchema,
    checks: z.array(localCheckSchema),
    payments: z.array(localPaymentSchema),
    paidCents: z.number().int().nonnegative(),
    remainingCents: z.number().int().nonnegative(),
  })
  .strict();
export const localPrintJobsResponseSchema = z
  .object({
    printJobs: z.array(localPrintJobSchema),
    summary: z
      .object({
        pending: z.number().int().nonnegative(),
        printing: z.number().int().nonnegative(),
        printed: z.number().int().nonnegative(),
        failed: z.number().int().nonnegative(),
      })
      .strict(),
    pagination: z
      .object({
        page: z.number().int().positive(),
        pageSize: z.number().int().positive(),
        totalItems: z.number().int().nonnegative(),
        totalPages: z.number().int().positive(),
      })
      .strict(),
  })
  .strict();
export const printerOperationalStatusSchema = z.enum([
  'ready',
  'printing',
  'attention',
  'unavailable',
  'not_configured',
]);
export const printerDeviceStatusSchema = z.enum([
  'ready',
  'missing',
  'not_writable',
  'invalid',
  'not_configured',
]);
export const localPrinterStatusSchema = z
  .object({
    status: printerOperationalStatusSchema,
    worker: z.enum(['running', 'disabled']),
    device: printerDeviceStatusSchema,
    queue: z
      .object({
        pending: z.number().int().nonnegative(),
        printing: z.number().int().nonnegative(),
        failed: z.number().int().nonnegative(),
      })
      .strict(),
    lastPrintedAt: isoDateTimeSchema.nullable(),
    lastFailureAt: isoDateTimeSchema.nullable(),
    checkedAt: isoDateTimeSchema,
  })
  .strict();
export const receiptTargetInputSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('order') }).strict(),
  z.object({ kind: z.literal('check'), checkId: identifierSchema }).strict(),
]);
export const receiptJobIntentSchema = z.enum(['print', 'retry', 'reprint']);
export const receiptJobCommandInputSchema = z
  .object({
    operationId: uuidV7Schema,
    target: receiptTargetInputSchema,
    intent: receiptJobIntentSchema,
    jobId: identifierSchema.optional(),
  })
  .strict()
  .superRefine((value, context) => {
    const requiresJob = value.intent === 'retry' || value.intent === 'reprint';
    if (requiresJob !== Boolean(value.jobId)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['jobId'],
        message:
          'jobId is required for retry/reprint and forbidden for a new print.',
      });
    }
  });
export const localReceiptTargetSchema = z
  .object({
    kind: z.enum(['order', 'check']),
    id: identifierSchema,
    label: z.string().min(1),
    amountCents: z.number().int().nonnegative(),
    availability: z.enum(['available', 'payment_pending', 'cancelled']),
    splitMode: z.enum(['single', 'items', 'equal']),
    latestJob: localPrintJobSchema.nullable(),
  })
  .strict();
export const localReceiptViewResponseSchema = z
  .object({
    orderId: identifierSchema,
    paymentMode: localPaymentModeSchema,
    targets: z.array(localReceiptTargetSchema),
    printer: localPrinterStatusSchema,
  })
  .strict();
export const localReceiptCommandResponseSchema = z
  .object({
    target: localReceiptTargetSchema,
    printJob: localPrintJobSchema,
    replayed: z.boolean(),
    printer: localPrinterStatusSchema,
  })
  .strict();
export const localReceiptJobStatusResponseSchema = z
  .object({
    printJob: localPrintJobSchema,
    printer: localPrinterStatusSchema,
  })
  .strict();
export const printJobCommandSchema = z.discriminatedUnion('action', [
  z.object({ action: z.literal('mark_printing') }).strict(),
  z.object({ action: z.literal('mark_printed') }).strict(),
  z
    .object({
      action: z.literal('mark_failed'),
      errorMessage: z.string().trim().min(1).max(2000),
    })
    .strict(),
  z.object({ action: z.literal('retry') }).strict(),
  z.object({ action: z.literal('reprint') }).strict(),
]);
export const printFontSizePresetSchema = z.enum([
  'compact',
  'standard',
  'large',
]);
const printDestinationEnabledInputSchema = z.preprocess((value) => {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return value;
}, z.boolean());
export const localPrintSettingsSchema = z
  .object({
    kitchenEnabled: z.boolean(),
    counterEnabled: z.boolean(),
    kitchenCopies: z.number().int().min(1).max(3),
    counterCopies: z.number().int().min(1).max(3),
    fontSizePreset: printFontSizePresetSchema,
    topPaddingLines: z.number().int().min(0).max(8),
    leftPaddingChars: z.number().int().min(0).max(8),
    bottomPaddingLines: z.number().int().min(0).max(8),
  })
  .strict()
  .refine((settings) => settings.kitchenEnabled || settings.counterEnabled, {
    message: 'At least one print destination must remain enabled.',
    path: ['counterEnabled'],
  });
export const updateLocalPrintSettingsInputSchema = z
  .object({
    kitchenEnabled: printDestinationEnabledInputSchema,
    counterEnabled: printDestinationEnabledInputSchema,
    kitchenCopies: z.coerce.number().int().min(1).max(3),
    counterCopies: z.coerce.number().int().min(1).max(3),
    fontSizePreset: printFontSizePresetSchema,
    topPaddingLines: z.coerce.number().int().min(0).max(8),
    leftPaddingChars: z.coerce.number().int().min(0).max(8),
    bottomPaddingLines: z.coerce.number().int().min(0).max(8),
  })
  .strict()
  .refine((settings) => settings.kitchenEnabled || settings.counterEnabled, {
    message: 'At least one print destination must remain enabled.',
    path: ['counterEnabled'],
  });

export const localEstablishmentDisplayNameSchema = z
  .string()
  .trim()
  .min(1, 'Restaurant display name is required.')
  .max(80, 'Restaurant display name must contain at most 80 characters.')
  .refine(
    (value) => !/[\u0000-\u001f\u007f]/u.test(value),
    'Restaurant display name must not contain control characters.',
  );

export const localEstablishmentProfileSchema = z
  .object({
    displayName: localEstablishmentDisplayNameSchema.nullable(),
    revision: z.number().int().nonnegative(),
    updatedAt: isoDateTimeSchema.nullable(),
  })
  .strict();

export const updateLocalEstablishmentProfileInputSchema = z
  .object({
    displayName: localEstablishmentDisplayNameSchema,
    revision: z.coerce.number().int().nonnegative(),
  })
  .strict();

export type SiteAgentHealthResponse = z.infer<
  typeof siteAgentHealthResponseSchema
>;
export type LocalUser = z.infer<typeof localUserSchema>;
export type CreateLocalUserInput = z.infer<typeof createLocalUserInputSchema>;
export type UpdateLocalUserInput = z.infer<typeof updateLocalUserInputSchema>;
export type ResetLocalUserPinInput = z.infer<
  typeof resetLocalUserPinInputSchema
>;
export type LocalAuthLoginInput = z.infer<typeof localAuthLoginInputSchema>;
export type LocalAuthSession = z.infer<typeof localAuthSessionSchema>;
export type LocalCatalogResponse = z.infer<typeof localCatalogResponseSchema>;
export type LocalItemInstructionConfig = z.infer<
  typeof localItemInstructionConfigSchema
>;
export type SelectedInstructionSnapshot = z.infer<
  typeof selectedInstructionSnapshotSchema
>;
export type ItemVariantSnapshot = z.infer<typeof itemVariantSnapshotSchema>;
export type AllergenSnapshot = z.infer<typeof allergenSnapshotSchema>;
export type AllergySeverity = z.infer<typeof allergySeveritySchema>;
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
export type CreateLocalOrderInput = z.infer<typeof createLocalOrderInputSchema>;
export type LocalOrderSummary = z.infer<typeof localOrderSummarySchema>;
export type LocalOrdersQuery = z.infer<typeof localOrdersQuerySchema>;
export type LocalOrdersHomeView = z.infer<typeof localOrdersHomeViewSchema>;
export type LocalOrdersHomeQuery = z.infer<typeof localOrdersHomeQuerySchema>;
export type LocalOrdersHomeRow = z.infer<typeof localOrdersHomeRowSchema>;
export type LocalOrdersHomeResponse = z.infer<
  typeof localOrdersHomeResponseSchema
>;
export type LocalManagementReportsQuery = z.infer<
  typeof localManagementReportsQuerySchema
>;
export type LocalManagementReportOrder = z.infer<
  typeof localManagementReportOrderSchema
>;
export type LocalManagementReportsResponse = z.infer<
  typeof localManagementReportsResponseSchema
>;
export type LocalKitchenScreen = z.infer<typeof localKitchenScreenSchema>;
export type LocalKitchenQueue = z.infer<typeof localKitchenQueueSchema>;
export type LocalKitchenQueueQuery = z.infer<
  typeof localKitchenQueueQuerySchema
>;
export type LocalKitchenQueueResponse = z.infer<
  typeof localKitchenQueueResponseSchema
>;
export type LocalKitchenEventScreen = z.infer<
  typeof localKitchenEventScreenSchema
>;
export type LocalKitchenEventReason = z.infer<
  typeof localKitchenEventReasonSchema
>;
export type LocalKitchenEvent = z.infer<typeof localKitchenEventSchema>;
export type AddLocalOrderItemInput = z.infer<
  typeof addLocalOrderItemInputSchema
>;
export type UpdateLocalOrderItemInput = z.infer<
  typeof updateLocalOrderItemInputSchema
>;
export type LocalOrderItemCommand = z.infer<typeof localOrderItemCommandSchema>;
export type LocalOrderCommand = z.infer<typeof localOrderCommandSchema>;
export type PayLocalOrderInput = z.infer<typeof payLocalOrderInputSchema>;
export type PayLocalCheckInput = z.infer<typeof payLocalCheckInputSchema>;
export type CreateLocalChecksByItemsInput = z.infer<
  typeof createLocalChecksByItemsInputSchema
>;
export type CreatePrintJobInput = z.infer<typeof createPrintJobInputSchema>;
export type PrintJobsQuery = z.infer<typeof printJobsQuerySchema>;
export type LocalPrintJobsResponse = z.infer<
  typeof localPrintJobsResponseSchema
>;
export type PrintJobCommand = z.infer<typeof printJobCommandSchema>;
export type PrintFontSizePreset = z.infer<typeof printFontSizePresetSchema>;
export type LocalPrintSettings = z.infer<typeof localPrintSettingsSchema>;
export type LocalEstablishmentProfile = z.infer<
  typeof localEstablishmentProfileSchema
>;
export type UpdateLocalEstablishmentProfileInput = z.infer<
  typeof updateLocalEstablishmentProfileInputSchema
>;
export type LocalPrinterStatus = z.infer<typeof localPrinterStatusSchema>;
export type ReceiptTargetInput = z.infer<typeof receiptTargetInputSchema>;
export type ReceiptJobIntent = z.infer<typeof receiptJobIntentSchema>;
export type ReceiptJobCommandInput = z.infer<
  typeof receiptJobCommandInputSchema
>;
export type LocalReceiptTarget = z.infer<typeof localReceiptTargetSchema>;
export type LocalReceiptViewResponse = z.infer<
  typeof localReceiptViewResponseSchema
>;
export type LocalReceiptCommandResponse = z.infer<
  typeof localReceiptCommandResponseSchema
>;
export type LocalReceiptJobStatusResponse = z.infer<
  typeof localReceiptJobStatusResponseSchema
>;
export type UpdateLocalPrintSettingsInput = z.infer<
  typeof updateLocalPrintSettingsInputSchema
>;
export type LocalPrintJob = z.infer<typeof localPrintJobSchema>;
