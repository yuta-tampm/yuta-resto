import { z } from 'zod';
import { identifierSchema, isoDateTimeSchema } from '../common';
import {
  localOrderDiscountSchema,
  localOrderItemSchema,
  localOrderSummarySchema,
  localPaymentModeSchema,
} from './orders';
import { localPaymentSchema } from './payments';
import { uuidV7Schema } from './routes';

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

export type CreatePrintJobInput = z.infer<typeof createPrintJobInputSchema>;
export type PrintJobsQuery = z.infer<typeof printJobsQuerySchema>;
export type LocalPrintJobsResponse = z.infer<
  typeof localPrintJobsResponseSchema
>;
export type PrintJobCommand = z.infer<typeof printJobCommandSchema>;
export type PrintFontSizePreset = z.infer<typeof printFontSizePresetSchema>;
export type LocalPrintSettings = z.infer<typeof localPrintSettingsSchema>;
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
