import { z } from 'zod';
import { identifierSchema, isoDateTimeSchema } from '../common';
import { localOrderSummarySchema } from './orders';
import { uuidV7Schema } from './routes';

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
export const localPaymentSummaryResponseSchema = z
  .object({
    order: localOrderSummarySchema,
    checks: z.array(localCheckSchema),
    payments: z.array(localPaymentSchema),
    paidCents: z.number().int().nonnegative(),
    remainingCents: z.number().int().nonnegative(),
  })
  .strict();

export type PayLocalOrderInput = z.infer<typeof payLocalOrderInputSchema>;
export type PayLocalCheckInput = z.infer<typeof payLocalCheckInputSchema>;
export type CreateLocalChecksByItemsInput = z.infer<
  typeof createLocalChecksByItemsInputSchema
>;
