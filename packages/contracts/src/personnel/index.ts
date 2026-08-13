import { z } from 'zod';
import { identifierSchema, isoDateTimeSchema, pageInfoSchema } from '../common';

export const personnelEmployeeViewSchema = z.enum([
  'active',
  'upcoming',
  'former',
]);
export const personnelCompletenessFilterSchema = z.enum([
  'all',
  'complete',
  'incomplete',
]);
export const personnelEmploymentTermTypeSchema = z.enum([
  'indefinite',
  'fixed_term',
]);
export const personnelWorkTimeCategorySchema = z.enum([
  'full_time',
  'part_time',
]);

const dateOnlySchema = z.string().date();
const personnelRequiredTextSchema = z
  .string()
  .trim()
  .min(1)
  .max(120)
  .refine((value) => !/[\u0000-\u001F\u007F]/u.test(value), {
    message: 'Control characters are not allowed.',
  });

export const personnelEmployeeListQuerySchema = z
  .object({
    view: personnelEmployeeViewSchema.default('active'),
    search: z.string().trim().max(120).default(''),
    completeness: personnelCompletenessFilterSchema.default('all'),
    cursor: z.string().max(500).optional(),
    limit: z.coerce.number().int().min(1).max(100).default(25),
  })
  .strict();

export const personnelEmployeeSummarySchema = z
  .object({
    id: identifierSchema,
    givenNames: z.string().min(1).max(120),
    familyName: z.string().min(1).max(120),
    position: z.string().min(1).max(120),
    qualification: z.string().min(1).max(120),
    employmentTermType: personnelEmploymentTermTypeSchema,
    expectedEndDate: dateOnlySchema.nullable(),
    workTimeCategory: personnelWorkTimeCategorySchema,
    entryDate: dateOnlySchema,
    departureDate: dateOnlySchema.nullable(),
    view: personnelEmployeeViewSchema,
    completenessReasons: z.array(z.string().min(1).max(120)),
    revision: z.number().int().positive(),
    createdAt: isoDateTimeSchema,
    updatedAt: isoDateTimeSchema,
  })
  .strict();

export const personnelEmployeeCountsSchema = z
  .object({
    active: z.number().int().nonnegative(),
    upcoming: z.number().int().nonnegative(),
    former: z.number().int().nonnegative(),
    incomplete: z.number().int().nonnegative(),
  })
  .strict();

export const personnelEmployeeListResponseSchema = z
  .object({
    items: z.array(personnelEmployeeSummarySchema),
    counts: personnelEmployeeCountsSchema,
    pageInfo: pageInfoSchema,
  })
  .strict();

export const createPersonnelEmployeeInputSchema = z
  .object({
    idempotencyKey: identifierSchema,
    givenNames: personnelRequiredTextSchema,
    familyName: personnelRequiredTextSchema,
    position: personnelRequiredTextSchema,
    qualification: personnelRequiredTextSchema,
    employmentTermType: personnelEmploymentTermTypeSchema,
    expectedEndDate: dateOnlySchema.nullable(),
    workTimeCategory: personnelWorkTimeCategorySchema,
    entryDate: dateOnlySchema,
    confirmDuplicate: z.boolean().default(false),
    duplicateOverrideReason: z.string().trim().min(3).max(250).nullable(),
  })
  .strict()
  .superRefine((input, context) => {
    if (input.employmentTermType === 'fixed_term' && !input.expectedEndDate) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['expectedEndDate'],
        message: 'An expected end date is required for a fixed term.',
      });
    }
    if (input.employmentTermType === 'indefinite' && input.expectedEndDate) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['expectedEndDate'],
        message: 'An indefinite term must not have an expected end date.',
      });
    }
    if (input.expectedEndDate && input.expectedEndDate < input.entryDate) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['expectedEndDate'],
        message: 'The expected end date must be on or after the entry date.',
      });
    }
    if (input.confirmDuplicate && !input.duplicateOverrideReason) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['duplicateOverrideReason'],
        message: 'A reason is required to confirm a possible duplicate.',
      });
    }
  });

export const personnelDuplicateCandidateSchema = z
  .object({
    id: identifierSchema,
    displayName: z.string().min(1).max(241),
    position: z.string().min(1).max(120),
    entryDate: dateOnlySchema,
    departureDate: dateOnlySchema.nullable(),
  })
  .strict();

export type PersonnelEmployeeView = z.infer<typeof personnelEmployeeViewSchema>;
export type PersonnelCompletenessFilter = z.infer<
  typeof personnelCompletenessFilterSchema
>;
export type PersonnelEmployeeListQuery = z.infer<
  typeof personnelEmployeeListQuerySchema
>;
export type PersonnelEmployeeSummary = z.infer<
  typeof personnelEmployeeSummarySchema
>;
export type PersonnelEmployeeListResponse = z.infer<
  typeof personnelEmployeeListResponseSchema
>;
export type CreatePersonnelEmployeeInput = z.infer<
  typeof createPersonnelEmployeeInputSchema
>;
export type PersonnelDuplicateCandidate = z.infer<
  typeof personnelDuplicateCandidateSchema
>;
