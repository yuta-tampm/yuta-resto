import { z } from 'zod';
import { identifierSchema, isoDateTimeSchema } from '../common';
import { personnelEmploymentTermTypeSchema } from '../personnel';

export const formalitesPersonnelFormalityTypeSchema =
  z.literal('cdi_preparation');

export const formalitesPersonnelDraftStatusSchema = z.enum([
  'draft',
  'abandoned',
]);

export const formalitesPersonnelProbationChoiceSchema = z.enum([
  'undecided',
  'include',
  'exclude',
]);

export const formalitesPersonnelFactSchema = z.enum([
  'givenNames',
  'familyName',
  'position',
  'qualification',
  'employmentTermType',
  'entryDate',
  'contractWeeklyMinutes',
]);

export const formalitesPersonnelReconciliationChoiceSchema = z.enum([
  'keep',
  'refresh',
]);

const requiredPersonnelTextSchema = z
  .string()
  .trim()
  .min(1)
  .max(120)
  .refine((value) => !/[\u0000-\u001F\u007F]/u.test(value), {
    message: 'Control characters are not allowed.',
  });

export const formalitesPersonnelFactsSchema = z
  .object({
    givenNames: requiredPersonnelTextSchema,
    familyName: requiredPersonnelTextSchema,
    position: requiredPersonnelTextSchema,
    qualification: requiredPersonnelTextSchema,
    employmentTermType: personnelEmploymentTermTypeSchema,
    entryDate: z.string().date(),
    contractWeeklyMinutes: z.number().int().min(1).max(2_880).nullable(),
  })
  .strict();

export const formalitesPersonnelOperationKeySchema = z
  .string()
  .min(16)
  .max(128)
  .regex(/^[A-Za-z0-9_-]+$/, {
    message: 'Operation key must be an opaque URL-safe technical value.',
  });

export const formalitesPersonnelSourceStateFingerprintSchema = z
  .string()
  .regex(/^[a-f0-9]{64}$/);

export const formalitesPersonnelReconciliationDecisionSchema = z
  .object({
    fact: formalitesPersonnelFactSchema,
    choice: formalitesPersonnelReconciliationChoiceSchema,
  })
  .strict();

export const formalitesPersonnelReconciliationDecisionsSchema = z
  .array(formalitesPersonnelReconciliationDecisionSchema)
  .max(formalitesPersonnelFactSchema.options.length)
  .superRefine((decisions, context) => {
    const seen = new Set<string>();
    decisions.forEach((decision, index) => {
      if (seen.has(decision.fact)) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Each divergent fact may be reconciled only once.',
          path: [index, 'fact'],
        });
      }
      seen.add(decision.fact);
    });
  });

export const formalitesPersonnelAbandonmentReasonSchema = z
  .string()
  .trim()
  .min(1)
  .max(250)
  .refine((value) => !/[\u0000-\u001F\u007F]/u.test(value), {
    message: 'Control characters are not allowed.',
  });

const activeDraftReadModelShape = {
  draftId: identifierSchema,
  formalityType: formalitesPersonnelFormalityTypeSchema,
  status: z.literal('draft'),
  probationChoice: formalitesPersonnelProbationChoiceSchema,
  revision: z.number().int().positive(),
  draftValues: formalitesPersonnelFactsSchema,
  currentPersonnelValues: formalitesPersonnelFactsSchema,
  createdAt: isoDateTimeSchema,
  updatedAt: isoDateTimeSchema,
} as const;

export const formalitesPersonnelEligibleNoDraftReadModelSchema = z
  .object({
    state: z.literal('eligible_no_draft'),
    formalityType: formalitesPersonnelFormalityTypeSchema,
    currentPersonnelValues: formalitesPersonnelFactsSchema,
  })
  .strict();

export const formalitesPersonnelEditableReadModelSchema = z
  .object({
    state: z.literal('editable'),
    ...activeDraftReadModelShape,
  })
  .strict();

export const formalitesPersonnelReconciliationRequiredReadModelSchema = z
  .object({
    state: z.literal('reconciliation_required'),
    ...activeDraftReadModelShape,
    divergentFacts: z.array(formalitesPersonnelFactSchema).min(1),
    sourceStateFingerprint: formalitesPersonnelSourceStateFingerprintSchema,
  })
  .strict();

export const formalitesPersonnelIneligibleRecoveryReadModelSchema = z
  .object({
    state: z.literal('ineligible_recovery'),
    ...activeDraftReadModelShape,
    divergentFacts: z.array(formalitesPersonnelFactSchema),
  })
  .strict();

export const formalitesPersonnelAbandonedReadModelSchema = z
  .object({
    state: z.literal('abandoned'),
    draftId: identifierSchema,
    formalityType: formalitesPersonnelFormalityTypeSchema,
    status: z.literal('abandoned'),
    probationChoice: formalitesPersonnelProbationChoiceSchema,
    revision: z.number().int().positive(),
    draftValues: formalitesPersonnelFactsSchema,
    currentPersonnelValues: formalitesPersonnelFactsSchema,
    abandonmentReason: formalitesPersonnelAbandonmentReasonSchema,
    abandonedAt: isoDateTimeSchema,
    createdAt: isoDateTimeSchema,
    updatedAt: isoDateTimeSchema,
  })
  .strict();

export const formalitesPersonnelDraftReadModelSchema = z.discriminatedUnion(
  'state',
  [
    formalitesPersonnelEligibleNoDraftReadModelSchema,
    formalitesPersonnelEditableReadModelSchema,
    formalitesPersonnelReconciliationRequiredReadModelSchema,
    formalitesPersonnelIneligibleRecoveryReadModelSchema,
    formalitesPersonnelAbandonedReadModelSchema,
  ],
);

const mutationReferenceShape = {
  employeeId: identifierSchema,
  operationKey: formalitesPersonnelOperationKeySchema,
} as const;

export const formalitesPersonnelCreateDraftInputSchema = z
  .object({
    ...mutationReferenceShape,
    probationChoice:
      formalitesPersonnelProbationChoiceSchema.default('undecided'),
  })
  .strict();

const existingDraftMutationShape = {
  ...mutationReferenceShape,
  draftId: identifierSchema,
  expectedDraftRevision: z.number().int().positive(),
} as const;

export const formalitesPersonnelSaveDraftInputSchema = z
  .object({
    ...existingDraftMutationShape,
    probationChoice: formalitesPersonnelProbationChoiceSchema,
  })
  .strict();

export const formalitesPersonnelReconcileDraftInputSchema = z
  .object({
    ...existingDraftMutationShape,
    sourceStateFingerprint: formalitesPersonnelSourceStateFingerprintSchema,
    decisions: formalitesPersonnelReconciliationDecisionsSchema,
  })
  .strict();

export const formalitesPersonnelAbandonDraftInputSchema = z
  .object({
    ...existingDraftMutationShape,
    abandonmentReason: formalitesPersonnelAbandonmentReasonSchema,
  })
  .strict();

const mutationWithModel = <T extends z.ZodTypeAny>(kind: string, model: T) =>
  z
    .object({
      kind: z.literal(kind),
      model,
    })
    .strict();

export const formalitesPersonnelDraftMutationOutcomeSchema =
  z.discriminatedUnion('kind', [
    z
      .object({
        kind: z.literal('success'),
        replayed: z.boolean(),
        model: formalitesPersonnelDraftReadModelSchema,
      })
      .strict(),
    z
      .object({
        kind: z.literal('validation_error'),
        fieldErrors: z.record(z.array(z.string())),
      })
      .strict(),
    mutationWithModel(
      'active_draft_exists',
      formalitesPersonnelDraftReadModelSchema,
    ),
    mutationWithModel('stale_draft', formalitesPersonnelDraftReadModelSchema),
    mutationWithModel(
      'stale_personnel_source',
      formalitesPersonnelDraftReadModelSchema,
    ),
    mutationWithModel(
      'ineligible_recovery',
      formalitesPersonnelIneligibleRecoveryReadModelSchema,
    ),
    mutationWithModel(
      'draft_abandoned',
      formalitesPersonnelAbandonedReadModelSchema,
    ),
    z.object({ kind: z.literal('replay_conflict') }).strict(),
    z.object({ kind: z.literal('not_found') }).strict(),
    z.object({ kind: z.literal('server_error') }).strict(),
  ]);

export type FormalitesPersonnelFormalityType = z.infer<
  typeof formalitesPersonnelFormalityTypeSchema
>;
export type FormalitesPersonnelDraftStatus = z.infer<
  typeof formalitesPersonnelDraftStatusSchema
>;
export type FormalitesPersonnelProbationChoice = z.infer<
  typeof formalitesPersonnelProbationChoiceSchema
>;
export type FormalitesPersonnelFact = z.infer<
  typeof formalitesPersonnelFactSchema
>;
export type FormalitesPersonnelFacts = z.infer<
  typeof formalitesPersonnelFactsSchema
>;
export type FormalitesPersonnelReconciliationChoice = z.infer<
  typeof formalitesPersonnelReconciliationChoiceSchema
>;
export type FormalitesPersonnelReconciliationDecision = z.infer<
  typeof formalitesPersonnelReconciliationDecisionSchema
>;
export type FormalitesPersonnelDraftReadModel = z.infer<
  typeof formalitesPersonnelDraftReadModelSchema
>;
export type FormalitesPersonnelCreateDraftInput = z.infer<
  typeof formalitesPersonnelCreateDraftInputSchema
>;
export type FormalitesPersonnelSaveDraftInput = z.infer<
  typeof formalitesPersonnelSaveDraftInputSchema
>;
export type FormalitesPersonnelReconcileDraftInput = z.infer<
  typeof formalitesPersonnelReconcileDraftInputSchema
>;
export type FormalitesPersonnelAbandonDraftInput = z.infer<
  typeof formalitesPersonnelAbandonDraftInputSchema
>;
export type FormalitesPersonnelDraftMutationOutcome = z.infer<
  typeof formalitesPersonnelDraftMutationOutcomeSchema
>;
