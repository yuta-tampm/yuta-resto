import { z } from 'zod';
import { isoDateTimeSchema } from '../common';

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

export type LocalEstablishmentProfile = z.infer<
  typeof localEstablishmentProfileSchema
>;
export type UpdateLocalEstablishmentProfileInput = z.infer<
  typeof updateLocalEstablishmentProfileInputSchema
>;
