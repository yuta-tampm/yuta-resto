import { z } from 'zod';
import { identifierSchema, isoDateTimeSchema } from '../common';

export const googleReplyTextSchema = z
  .string()
  .min(1)
  .refine(
    (text) => new TextEncoder().encode(text).byteLength <= 4096,
    'The Google reply exceeds 4096 UTF-8 bytes.',
  );
export const googleReplyPublicationStateSchema = z.enum([
  'PREVIEW',
  'DISPATCHING',
  'UNCERTAIN',
  'FAILED',
  'UNCONFIRMED',
  'PENDING',
  'REJECTED',
  'APPROVED',
]);
export type GoogleReplyPublicationState = z.infer<
  typeof googleReplyPublicationStateSchema
>;
export const googleReplyPublicationErrorSchema = z.enum([
  'AUTH_REQUIRED',
  'REMOTE_CHANGED',
  'PREVIEW_EXPIRED',
  'PROVIDER_REJECTED',
  'PROVIDER_UNAVAILABLE',
  'INVALID_RESPONSE',
]);
export const googleReplyPreviewInputSchema = z
  .object({
    feedbackId: identifierSchema,
    replyId: identifierSchema,
    revision: z.number().int().positive(),
    retryParentId: identifierSchema.optional(),
  })
  .strict();
export type GoogleReplyPreviewInput = z.infer<
  typeof googleReplyPreviewInputSchema
>;
export const googleReplyAttemptInputSchema = z
  .object({
    attemptId: identifierSchema,
  })
  .strict();
export type GoogleReplyAttemptInput = z.infer<
  typeof googleReplyAttemptInputSchema
>;
export const googleReplyPublicationReceiptSchema = z
  .object({
    attemptId: identifierSchema,
    replyId: identifierSchema,
    revision: z.number().int().positive(),
    state: googleReplyPublicationStateSchema,
    errorCategory: googleReplyPublicationErrorSchema.nullable(),
    confirmedAt: isoDateTimeSchema.nullable(),
    observedAt: isoDateTimeSchema.nullable(),
    reconciledAt: isoDateTimeSchema.nullable(),
    superseded: z.boolean(),
  })
  .strict();
export type GoogleReplyPublicationReceipt = z.infer<
  typeof googleReplyPublicationReceiptSchema
>;
export const googleReplyPreviewResponseSchema = z
  .object({
    attemptId: identifierSchema,
    feedbackId: identifierSchema,
    replyId: identifierSchema,
    revision: z.number().int().positive(),
    text: googleReplyTextSchema,
    establishmentName: z.string().min(1).max(255),
    expiresAt: isoDateTimeSchema,
    remoteReply: z
      .object({ content: z.string().max(4096) })
      .strict()
      .nullable(),
    retry: z.boolean(),
  })
  .strict();
export type GoogleReplyPreviewResponse = z.infer<
  typeof googleReplyPreviewResponseSchema
>;
