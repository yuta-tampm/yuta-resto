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

export const personnelActionOverviewItemKindSchema = z.enum([
  'incomplete_employee_dossier',
  'missing_signed_base_contract',
  'departure_within_five_days',
]);

const personnelActionOverviewBaseItemSchema = z
  .object({
    employeeId: identifierSchema,
    employeeDisplayName: z.string().trim().min(1).max(241),
  })
  .strict();

export const personnelActionOverviewCorrectionItemSchema =
  personnelActionOverviewBaseItemSchema.extend({
    kind: z.enum([
      'incomplete_employee_dossier',
      'missing_signed_base_contract',
    ]),
  });

export const personnelActionOverviewDepartureItemSchema =
  personnelActionOverviewBaseItemSchema.extend({
    kind: z.literal('departure_within_five_days'),
    departureDate: dateOnlySchema,
  });

export const personnelActionOverviewQuerySchema = z
  .object({
    correctionCursor: z.string().max(500).optional(),
    departureCursor: z.string().max(500).optional(),
  })
  .strict();

export const personnelActionOverviewResponseSchema = z
  .object({
    corrections: z
      .object({
        items: z.array(personnelActionOverviewCorrectionItemSchema).max(5),
        pageInfo: pageInfoSchema,
        documentSourceStatus: z.enum(['ready', 'unavailable']),
      })
      .strict(),
    departures: z
      .object({
        items: z.array(personnelActionOverviewDepartureItemSchema).max(5),
        pageInfo: pageInfoSchema,
      })
      .strict(),
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
  'employee.contract_extraction_requested',
  'employee.contract_extraction_completed',
  'employee.contract_extraction_failed',
  'employee.contract_extraction_applied',
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

export const personnelContractExtractionScenarioSchema = z.enum([
  'complete',
  'partial',
  'no_result',
  'unsupported',
  'failure',
  'timeout',
]);

export const personnelContractExtractionFieldSchema = z.enum([
  'position',
  'employmentTermType',
  'contractWeeklyMinutes',
]);

export const personnelContractExtractionConfidenceSchema = z.enum([
  'high',
  'medium',
  'low',
]);

export const personnelContractExtractionIssueCodeSchema = z.enum([
  'blocked_by_dependency',
  'ambiguous_value',
]);

export const personnelContractExtractionWarningSchema = z.enum([
  'some_fields_not_detected',
  'image_only_document',
]);

const personnelContractExtractionSuggestionBaseSchema = z
  .object({
    confidence: personnelContractExtractionConfidenceSchema,
    sourcePage: z.number().int().min(1).max(40),
    excerpt: z.string().trim().min(1).max(240),
    issueCodes: z
      .array(personnelContractExtractionIssueCodeSchema)
      .max(2)
      .default([]),
  })
  .strict();

export const personnelContractExtractionSuggestionSchema = z.discriminatedUnion(
  'field',
  [
    personnelContractExtractionSuggestionBaseSchema.extend({
      field: z.literal('position'),
      candidateValue: personnelRequiredTextSchema,
    }),
    personnelContractExtractionSuggestionBaseSchema.extend({
      field: z.literal('employmentTermType'),
      candidateValue: personnelEmploymentTermTypeSchema,
    }),
    personnelContractExtractionSuggestionBaseSchema.extend({
      field: z.literal('contractWeeklyMinutes'),
      candidateValue: z.number().int().min(1).max(2_880),
    }),
  ],
);

export const personnelContractExtractionRequestSchema = z
  .object({
    requestId: identifierSchema,
    employeeId: identifierSchema,
    documentId: identifierSchema,
    documentVersion: z.number().int().positive(),
    employeeRevision: z.number().int().positive(),
    scenario: personnelContractExtractionScenarioSchema.default('complete'),
  })
  .strict();

export const personnelContractExtractionReviewResultSchema = z
  .object({
    schemaVersion: z.literal(1),
    requestId: identifierSchema,
    document: z
      .object({
        id: identifierSchema,
        version: z.number().int().positive(),
      })
      .strict(),
    employeeRevision: z.number().int().positive(),
    status: z.enum(['complete', 'partial', 'no_result', 'unsupported']),
    pageCount: z.number().int().min(1).max(40),
    suggestions: z.array(personnelContractExtractionSuggestionSchema).max(8),
    warnings: z.array(personnelContractExtractionWarningSchema).max(4),
    expiresAt: isoDateTimeSchema,
  })
  .strict()
  .superRefine((result, context) => {
    for (const [index, suggestion] of result.suggestions.entries()) {
      if (suggestion.sourcePage > result.pageCount) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['suggestions', index, 'sourcePage'],
          message: 'The source page must exist in the prepared document.',
        });
      }
    }
    if (
      (result.status === 'no_result' || result.status === 'unsupported') &&
      result.suggestions.length > 0
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['suggestions'],
        message: 'This result status cannot contain suggestions.',
      });
    }
  });

export const applyPersonnelContractExtractionInputSchema = z
  .object({
    idempotencyKey: identifierSchema,
    request: personnelContractExtractionRequestSchema,
    selectedSuggestions: z
      .array(
        z.discriminatedUnion('field', [
          z
            .object({
              field: z.literal('position'),
              candidateValue: personnelRequiredTextSchema,
            })
            .strict(),
          z
            .object({
              field: z.literal('contractWeeklyMinutes'),
              candidateValue: z.number().int().min(1).max(2_880),
            })
            .strict(),
        ]),
      )
      .min(1)
      .max(2)
      .superRefine((suggestions, context) => {
        if (
          new Set(suggestions.map((item) => item.field)).size !==
          suggestions.length
        ) {
          context.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Each field may be selected only once.',
          });
        }
      }),
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

export const personnelRegisterSexSchema = z.enum(['F', 'M']);
export const personnelRegisterSpecialContractSchema = z.enum([
  'none',
  'apprenticeship',
  'professionalization',
]);

const personnelRegisterAddressSchema = z
  .object({
    line1: z.string().trim().min(1).max(160),
    line2: z.string().trim().max(160).nullable(),
    postalCode: z.string().trim().min(1).max(20),
    city: z.string().trim().min(1).max(120),
    countryCode: z
      .string()
      .trim()
      .regex(/^[A-Z]{2}$/u),
  })
  .strict();

const personnelRegisterThirdPartySchema = z
  .object({
    legalName: z.string().trim().min(1).max(180),
    address: personnelRegisterAddressSchema,
  })
  .strict();

export const personnelRegisterFactsSchema = z
  .object({
    givenNames: personnelRequiredTextSchema,
    familyName: personnelRequiredTextSchema,
    nationalityCode: z
      .string()
      .trim()
      .regex(/^[A-Z]{2}$/u),
    nationalityLabel: z.string().trim().min(1).max(120),
    birthDate: dateOnlySchema,
    sex: personnelRegisterSexSchema,
    position: personnelRequiredTextSchema,
    qualification: personnelRequiredTextSchema,
    entryDate: dateOnlySchema,
    departureDate: dateOnlySchema.nullable(),
    protectedAuthorization: z
      .object({
        required: z.boolean(),
        authorizationDate: dateOnlySchema.nullable(),
        requestDate: dateOnlySchema.nullable(),
      })
      .strict(),
    workAuthorization: z
      .object({
        required: z.boolean(),
        titleType: z.string().trim().min(1).max(120).nullable(),
        orderNumber: z.string().trim().min(1).max(120).nullable(),
      })
      .strict(),
    employmentTermType: personnelEmploymentTermTypeSchema,
    workTimeCategory: personnelWorkTimeCategorySchema,
    temporaryWorkCompany: personnelRegisterThirdPartySchema.nullable(),
    employerGroup: personnelRegisterThirdPartySchema.nullable(),
    specialContract: personnelRegisterSpecialContractSchema,
  })
  .strict()
  .superRefine((facts, context) => {
    if (facts.departureDate && facts.departureDate < facts.entryDate) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['departureDate'],
        message: 'The departure date must not be before the entry date.',
      });
    }
    if (
      facts.protectedAuthorization.required &&
      !facts.protectedAuthorization.authorizationDate &&
      !facts.protectedAuthorization.requestDate
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['protectedAuthorization'],
        message: 'An authorization or request date is required.',
      });
    }
    if (
      facts.workAuthorization.required &&
      (!facts.workAuthorization.titleType ||
        !facts.workAuthorization.orderNumber)
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['workAuthorization'],
        message: 'The work authorization title and order number are required.',
      });
    }
  });

export const personnelRegisterEntrySchema = z
  .object({
    id: identifierSchema,
    employeeId: identifierSchema,
    sequence: z.number().int().positive(),
    revision: z.number().int().positive(),
    facts: personnelRegisterFactsSchema,
    inscribedAt: isoDateTimeSchema,
    updatedAt: isoDateTimeSchema,
  })
  .strict();

export const personnelRegisterReadinessSchema = z.enum([
  'ready',
  'incomplete',
  'unsupported_category',
  'empty',
]);

export const personnelRegisterPageSchema = z
  .object({
    items: z.array(personnelRegisterEntrySchema).max(50),
    snapshotRevision: z.number().int().nonnegative(),
    readiness: personnelRegisterReadinessSchema,
    pageInfo: pageInfoSchema,
  })
  .strict();

export const personnelRegisterCandidateSchema = z
  .object({
    employeeId: identifierSchema,
    givenNames: z.string().max(120),
    familyName: z.string().max(120),
    position: z.string().max(120),
    qualification: z.string().max(120),
    entryDate: dateOnlySchema,
    departureDate: dateOnlySchema.nullable(),
    employmentTermType: personnelEmploymentTermTypeSchema,
    workTimeCategory: personnelWorkTimeCategorySchema,
  })
  .strict();

export const personnelRegisterCandidateListSchema = z
  .object({ items: z.array(personnelRegisterCandidateSchema).max(100) })
  .strict();

export const personnelRegisterListQuerySchema = z
  .object({
    cursor: z.string().max(500).optional(),
    limit: z.literal(50).default(50),
  })
  .strict();

export const createPersonnelRegisterEntryInputSchema = z
  .object({
    operationId: identifierSchema,
    employeeId: identifierSchema,
    facts: personnelRegisterFactsSchema,
  })
  .strict();

export const correctPersonnelRegisterEntryInputSchema = z
  .object({
    operationId: identifierSchema,
    entryId: identifierSchema,
    expectedRevision: z.number().int().positive(),
    effectiveDate: dateOnlySchema,
    reason: z.string().trim().min(3).max(250),
    facts: personnelRegisterFactsSchema,
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
export type PersonnelActionOverviewItemKind = z.infer<
  typeof personnelActionOverviewItemKindSchema
>;
export type PersonnelActionOverviewCorrectionItem = z.infer<
  typeof personnelActionOverviewCorrectionItemSchema
>;
export type PersonnelActionOverviewDepartureItem = z.infer<
  typeof personnelActionOverviewDepartureItemSchema
>;
export type PersonnelActionOverviewQuery = z.infer<
  typeof personnelActionOverviewQuerySchema
>;
export type PersonnelActionOverviewResponse = z.infer<
  typeof personnelActionOverviewResponseSchema
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
export type PersonnelContractExtractionScenario = z.infer<
  typeof personnelContractExtractionScenarioSchema
>;
export type PersonnelContractExtractionField = z.infer<
  typeof personnelContractExtractionFieldSchema
>;
export type PersonnelContractExtractionSuggestion = z.infer<
  typeof personnelContractExtractionSuggestionSchema
>;
export type PersonnelContractExtractionRequest = z.infer<
  typeof personnelContractExtractionRequestSchema
>;
export type PersonnelContractExtractionReviewResult = z.infer<
  typeof personnelContractExtractionReviewResultSchema
>;
export type ApplyPersonnelContractExtractionInput = z.infer<
  typeof applyPersonnelContractExtractionInputSchema
>;
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
export type PersonnelRegisterFacts = z.infer<
  typeof personnelRegisterFactsSchema
>;
export type PersonnelRegisterEntry = z.infer<
  typeof personnelRegisterEntrySchema
>;
export type PersonnelRegisterPage = z.infer<typeof personnelRegisterPageSchema>;
export type PersonnelRegisterCandidate = z.infer<
  typeof personnelRegisterCandidateSchema
>;
export type PersonnelRegisterCandidateList = z.infer<
  typeof personnelRegisterCandidateListSchema
>;
export type PersonnelRegisterListQuery = z.infer<
  typeof personnelRegisterListQuerySchema
>;
export type CreatePersonnelRegisterEntryInput = z.infer<
  typeof createPersonnelRegisterEntryInputSchema
>;
export type CorrectPersonnelRegisterEntryInput = z.infer<
  typeof correctPersonnelRegisterEntryInputSchema
>;
