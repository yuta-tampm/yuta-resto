import { z } from 'zod';
import { identifierSchema, isoDateTimeSchema } from '../common';
import { kitchenStationSchema } from './catalog';
import { uuidV7Schema } from './routes';

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

export type SelectedInstructionSnapshot = z.infer<
  typeof selectedInstructionSnapshotSchema
>;
export type ItemVariantSnapshot = z.infer<typeof itemVariantSnapshotSchema>;
export type AllergenSnapshot = z.infer<typeof allergenSnapshotSchema>;
export type AllergySeverity = z.infer<typeof allergySeveritySchema>;
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
