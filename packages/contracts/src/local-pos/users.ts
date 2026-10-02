import { z } from 'zod';
import { identifierSchema, isoDateTimeSchema } from '../common';

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

export type LocalUser = z.infer<typeof localUserSchema>;
export type CreateLocalUserInput = z.infer<typeof createLocalUserInputSchema>;
export type UpdateLocalUserInput = z.infer<typeof updateLocalUserInputSchema>;
export type ResetLocalUserPinInput = z.infer<
  typeof resetLocalUserPinInputSchema
>;
export type LocalAuthLoginInput = z.infer<typeof localAuthLoginInputSchema>;
export type LocalAuthSession = z.infer<typeof localAuthSessionSchema>;
