import { localEstablishmentDisplayNameSchema } from '@yuta/contracts/local-pos';
import { z } from 'zod';

export const kitchenPrintPayloadSchema = z
  .object({
    orderNumber: z.string().min(1),
    tableLabel: z.string().nullable(),
    orderType: z.enum(['dine_in', 'takeaway', 'delivery']),
    orderNote: z.string().nullable(),
    createdAt: z.string().datetime(),
    items: z.array(
      z
        .object({
          name: z.string().min(1),
          quantity: z.number().int().positive(),
          note: z.string().nullable(),
          quickInstructions: z.array(
            z.object({ labelSnapshot: z.string().min(1) }).passthrough(),
          ),
          selectedVariants: z.array(
            z
              .object({
                labelSnapshot: z.string().min(1),
                quantity: z.number().int().positive(),
              })
              .passthrough(),
          ),
          hasAllergy: z.boolean(),
          allergenCodes: z.array(z.string()),
          selectedAllergens: z
            .array(
              z.object({
                code: z.string().min(1),
                labelSnapshot: z.string().min(1),
              }),
            )
            .default([]),
          allergySeverity: z
            .enum([
              'intolerance',
              'allergy',
              'severe_no_traces',
              'mild',
              'severe',
            ])
            .nullable(),
          allergyNote: z.string().nullable(),
          station: z.enum(['kitchen', 'bar', 'dessert', 'none']),
          categoryName: z.string().min(1).default('Autres'),
        })
        .passthrough(),
    ),
    ticketDestination: z.enum(['kitchen', 'counter']).optional(),
    ticketDestinations: z
      .array(z.enum(['kitchen', 'counter']))
      .min(1)
      .max(2)
      .optional(),
    includeAllItems: z.boolean().default(false),
    copies: z.number().int().min(1).max(3).default(1),
    fontSizePreset: z
      .enum(['compact', 'standard', 'large'])
      .default('standard'),
    topPaddingLines: z.number().int().min(0).max(8).default(1),
    leftPaddingChars: z.number().int().min(0).max(8).default(2),
    bottomPaddingLines: z.number().int().min(0).max(8).default(3),
  })
  .passthrough();

export const customerReceiptPayloadSchema = z
  .object({
    version: z.literal(1),
    documentType: z.literal('non_fiscal'),
    establishmentDisplayName: localEstablishmentDisplayNameSchema.optional(),
    orderNumber: z.string().min(1),
    tableLabel: z.string().min(1),
    orderType: z.enum(['dine_in', 'takeaway', 'delivery']),
    targetKind: z.enum(['order', 'check']),
    targetLabel: z.string().min(1),
    createdAt: z.string().datetime(),
    paidAt: z.string().datetime(),
    items: z.array(
      z.object({
        name: z.string().min(1),
        quantity: z.number().int().positive(),
        unitPriceCents: z.number().int().nonnegative(),
        totalCents: z.number().int().nonnegative(),
      }),
    ),
    discounts: z.array(
      z.object({
        name: z.string().min(1),
        amountCents: z.number().int().nonnegative(),
      }),
    ),
    subtotalCents: z.number().int().nonnegative(),
    discountCents: z.number().int().nonnegative(),
    totalCents: z.number().int().nonnegative(),
    payments: z.array(
      z.object({
        method: z.enum(['cash', 'card', 'ticket_resto', 'other']),
        amountCents: z.number().int().positive(),
        tenderedCents: z.number().int().nonnegative().nullable(),
        changeCents: z.number().int().nonnegative().nullable(),
        tipCents: z.number().int().nonnegative(),
        paidBy: z.string().nullable(),
        paidAt: z.string().datetime(),
      }),
    ),
    copies: z.literal(1),
    fontSizePreset: z.enum(['compact', 'standard', 'large']),
    topPaddingLines: z.number().int().min(0).max(8),
    leftPaddingChars: z.number().int().min(0).max(8),
    bottomPaddingLines: z.number().int().min(0).max(8),
  })
  .passthrough();
