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
export const personnelFixedTermReasonCodeSchema = z.enum([
  'employee_replacement',
  'temporary_activity_increase',
  'seasonal_employment',
  'customary_use_employment',
]);
export const personnelCompletenessReasonSchema = z.enum([
  'given_names_missing',
  'family_name_missing',
  'position_missing',
  'qualification_missing',
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
    givenNames: z.string().max(120),
    familyName: z.string().max(120),
    position: z.string().max(120),
    qualification: z.string().max(120),
    employmentTermType: personnelEmploymentTermTypeSchema,
    expectedEndDate: dateOnlySchema.nullable(),
    fixedTermReasonCode: personnelFixedTermReasonCodeSchema.nullable(),
    workTimeCategory: personnelWorkTimeCategorySchema,
    contractWeeklyMinutes: z.number().int().min(1).max(2_880).nullable(),
    entryDate: dateOnlySchema,
    departureDate: dateOnlySchema.nullable(),
    view: personnelEmployeeViewSchema,
    completenessReasons: z.array(personnelCompletenessReasonSchema),
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
    fixedTermReasonCode: personnelFixedTermReasonCodeSchema.nullable(),
    workTimeCategory: personnelWorkTimeCategorySchema,
    contractWeeklyMinutes: z.number().int().min(1).max(2_880),
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
    if (
      input.employmentTermType === 'fixed_term' &&
      !input.fixedTermReasonCode
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['fixedTermReasonCode'],
        message: 'A supported reason is required for a fixed term.',
      });
    }
    if (
      input.employmentTermType === 'indefinite' &&
      input.fixedTermReasonCode
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['fixedTermReasonCode'],
        message: 'An indefinite term must not have a fixed-term reason.',
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

export const updatePersonnelEmployeeInputSchema = z
  .object({
    idempotencyKey: identifierSchema,
    employeeId: identifierSchema,
    expectedRevision: z.coerce.number().int().positive(),
    givenNames: personnelRequiredTextSchema,
    familyName: personnelRequiredTextSchema,
    position: personnelRequiredTextSchema,
    qualification: personnelRequiredTextSchema,
    employmentTermType: personnelEmploymentTermTypeSchema,
    expectedEndDate: dateOnlySchema.nullable(),
    fixedTermReasonCode: personnelFixedTermReasonCodeSchema.nullable(),
    workTimeCategory: personnelWorkTimeCategorySchema,
    contractWeeklyMinutes: z.number().int().min(1).max(2_880).nullable(),
    entryDate: dateOnlySchema,
    confirmFixedTermReasonClear: z.boolean().default(false),
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
    if (
      input.employmentTermType === 'indefinite' &&
      input.fixedTermReasonCode
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['fixedTermReasonCode'],
        message: 'An indefinite term must not have a fixed-term reason.',
      });
    }
    if (input.expectedEndDate && input.expectedEndDate < input.entryDate) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['expectedEndDate'],
        message: 'The expected end date must be on or after the entry date.',
      });
    }
  });

export const setPersonnelEmployeeDepartureInputSchema = z
  .object({
    idempotencyKey: identifierSchema,
    employeeId: identifierSchema,
    expectedRevision: z.coerce.number().int().positive(),
    departureDate: dateOnlySchema.nullable(),
    correctionReason: z.string().trim().min(3).max(250).nullable(),
    confirmNonDeletion: z.literal(true),
  })
  .strict();

export const personnelDuplicateCandidateSchema = z
  .object({
    id: identifierSchema,
    displayName: z.string().min(1).max(241),
    position: z.string().min(1).max(120),
    entryDate: dateOnlySchema,
    departureDate: dateOnlySchema.nullable(),
  })
  .strict();

export const personnelEmployeeAuditEventTypeSchema = z.enum([
  'employee.created',
  'employee.duplicate_override_confirmed',
  'employee.identity_updated',
  'employee.employment_updated',
  'employee.departure_recorded',
  'employee.departure_corrected',
]);

export const personnelEmployeeAuditFieldSchema = z.enum([
  'identity',
  'givenNames',
  'familyName',
  'position',
  'qualification',
  'employmentTermType',
  'expectedEndDate',
  'fixedTermReasonCode',
  'workTimeCategory',
  'contractWeeklyMinutes',
  'entryDate',
  'departureDate',
]);

export const personnelEmployeeAuditEventSchema = z
  .object({
    id: identifierSchema,
    eventType: personnelEmployeeAuditEventTypeSchema,
    changedFields: z.array(personnelEmployeeAuditFieldSchema),
    actorDisplayName: z.string().min(1).max(200).nullable(),
    occurredAt: isoDateTimeSchema,
    reason: z.string().min(3).max(250).nullable(),
    previousDepartureDate: dateOnlySchema.nullable(),
    newDepartureDate: dateOnlySchema.nullable(),
  })
  .strict();

export const personnelEmployeeAuditHistorySchema = z
  .object({
    items: z.array(personnelEmployeeAuditEventSchema).max(50),
    truncated: z.boolean(),
  })
  .strict();

export const personnelEmployeeAccessEventTypeSchema = z.enum([
  'employee.dossier_viewed',
  'employee.history_viewed',
  'employee.access_history_viewed',
]);

export const personnelEmployeeAccessEventSchema = z
  .object({
    id: identifierSchema,
    eventType: personnelEmployeeAccessEventTypeSchema,
    actorDisplayName: z.string().min(1).max(200).nullable(),
    occurredAt: isoDateTimeSchema,
  })
  .strict();

export const personnelEmployeeAccessHistorySchema = z
  .object({
    items: z.array(personnelEmployeeAccessEventSchema).max(10),
    pageInfo: pageInfoSchema,
  })
  .strict();

export const personnelDocumentCategorySchema = z.enum([
  'signed_employment_contract',
]);

export const personnelDocumentSchema = z
  .object({
    id: identifierSchema,
    employeeId: identifierSchema,
    category: personnelDocumentCategorySchema,
    filename: z.string().min(1).max(180),
    mediaType: z.literal('application/pdf'),
    byteSize: z
      .number()
      .int()
      .positive()
      .max(10 * 1024 * 1024),
    version: z.number().int().positive(),
    revision: z.number().int().positive(),
    uploadedAt: isoDateTimeSchema,
  })
  .strict();

export const personnelDocumentListSchema = z
  .object({
    items: z.array(personnelDocumentSchema).max(1),
  })
  .strict();

export const savePersonnelDocumentMetadataInputSchema = z
  .object({
    idempotencyKey: identifierSchema,
    employeeId: identifierSchema,
    expectedRevision: z.number().int().positive().nullable(),
    category: personnelDocumentCategorySchema,
    filename: z.string().trim().min(1).max(180),
    mediaType: z.literal('application/pdf'),
    byteSize: z
      .number()
      .int()
      .positive()
      .max(10 * 1024 * 1024),
    checksum: z.string().regex(/^[a-f0-9]{64}$/u),
    storageKey: identifierSchema,
  })
  .strict();

const personnelContractAmendmentReferenceSchema = z
  .string()
  .trim()
  .min(1)
  .max(80)
  .refine((value) => !/[\u0000-\u001F\u007F]/u.test(value), {
    message: 'Control characters are not allowed.',
  });

const personnelContractAmendmentFileMetadataShape = {
  filename: z.string().trim().min(1).max(180),
  mediaType: z.literal('application/pdf'),
  byteSize: z
    .number()
    .int()
    .positive()
    .max(10 * 1024 * 1024),
  checksum: z.string().regex(/^[a-f0-9]{64}$/u),
  storageKey: identifierSchema,
} as const;

export const personnelContractAmendmentSchema = z
  .object({
    id: identifierSchema,
    employeeId: identifierSchema,
    effectiveDate: dateOnlySchema,
    reference: personnelContractAmendmentReferenceSchema.nullable(),
    filename: z.string().min(1).max(180),
    mediaType: z.literal('application/pdf'),
    byteSize: z
      .number()
      .int()
      .positive()
      .max(10 * 1024 * 1024),
    version: z.number().int().positive(),
    revision: z.number().int().positive(),
    uploadedAt: isoDateTimeSchema,
  })
  .strict();

export const personnelContractAmendmentListSchema = z
  .object({
    items: z.array(personnelContractAmendmentSchema).max(10),
    pageInfo: pageInfoSchema,
  })
  .strict();

export const createPersonnelContractAmendmentMetadataInputSchema = z
  .object({
    idempotencyKey: identifierSchema,
    employeeId: identifierSchema,
    effectiveDate: dateOnlySchema,
    reference: personnelContractAmendmentReferenceSchema.nullable(),
    ...personnelContractAmendmentFileMetadataShape,
  })
  .strict();

export const replacePersonnelContractAmendmentMetadataInputSchema = z
  .object({
    idempotencyKey: identifierSchema,
    employeeId: identifierSchema,
    amendmentId: identifierSchema,
    expectedRevision: z.number().int().positive(),
    ...personnelContractAmendmentFileMetadataShape,
  })
  .strict();

export type PersonnelEmployeeView = z.infer<typeof personnelEmployeeViewSchema>;
export type PersonnelCompletenessReason = z.infer<
  typeof personnelCompletenessReasonSchema
>;
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
export type UpdatePersonnelEmployeeInput = z.infer<
  typeof updatePersonnelEmployeeInputSchema
>;
export type SetPersonnelEmployeeDepartureInput = z.infer<
  typeof setPersonnelEmployeeDepartureInputSchema
>;
export type PersonnelDuplicateCandidate = z.infer<
  typeof personnelDuplicateCandidateSchema
>;
export type PersonnelEmployeeAuditEvent = z.infer<
  typeof personnelEmployeeAuditEventSchema
>;
export type PersonnelEmployeeAuditHistory = z.infer<
  typeof personnelEmployeeAuditHistorySchema
>;
export type PersonnelEmployeeAccessEvent = z.infer<
  typeof personnelEmployeeAccessEventSchema
>;
export type PersonnelEmployeeAccessHistory = z.infer<
  typeof personnelEmployeeAccessHistorySchema
>;
export type PersonnelDocumentCategory = z.infer<
  typeof personnelDocumentCategorySchema
>;
export type PersonnelDocument = z.infer<typeof personnelDocumentSchema>;
export type PersonnelDocumentList = z.infer<typeof personnelDocumentListSchema>;
export type SavePersonnelDocumentMetadataInput = z.infer<
  typeof savePersonnelDocumentMetadataInputSchema
>;
export type PersonnelContractAmendment = z.infer<
  typeof personnelContractAmendmentSchema
>;
export type PersonnelContractAmendmentList = z.infer<
  typeof personnelContractAmendmentListSchema
>;
export type CreatePersonnelContractAmendmentMetadataInput = z.infer<
  typeof createPersonnelContractAmendmentMetadataInputSchema
>;
export type ReplacePersonnelContractAmendmentMetadataInput = z.infer<
  typeof replacePersonnelContractAmendmentMetadataInputSchema
>;
