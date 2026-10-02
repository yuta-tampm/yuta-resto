import { createHash } from 'node:crypto';
import { z } from 'zod';

export const FORMALITES_LEGAL_SOURCE_PROFILE =
  'formalites.legal-source.utf8-lf.v1';

export type FormalitesLegalTemplateErrorCode =
  | 'NOT_FOUND'
  | 'ACTIVE_DRAFT_EXISTS'
  | 'STALE_DRAFT_REVISION'
  | 'DRAFT_FROZEN'
  | 'INVALID_SOURCE'
  | 'INVALID_APPLICABILITY'
  | 'INTEGRITY_FAILURE';

export class FormalitesLegalTemplateError extends Error {
  constructor(readonly code: FormalitesLegalTemplateErrorCode) {
    super(code);
    this.name = 'FormalitesLegalTemplateError';
  }
}

function decodeSource(input: unknown, profile: unknown): string {
  if (
    profile !== FORMALITES_LEGAL_SOURCE_PROFILE ||
    !(input instanceof Uint8Array)
  ) {
    throw new FormalitesLegalTemplateError('INVALID_SOURCE');
  }
  try {
    const value = new TextDecoder('utf-8', {
      fatal: true,
      ignoreBOM: true,
    }).decode(Buffer.from(input));
    if (value.startsWith('\uFEFF')) throw new Error('Leading BOM');
    return value;
  } catch {
    throw new FormalitesLegalTemplateError('INVALID_SOURCE');
  }
}

export function validateFormalitesLegalSource(
  input: unknown,
  profile: unknown,
): Buffer {
  const value = decodeSource(input, profile);
  if (value.includes('\r'))
    throw new FormalitesLegalTemplateError('INVALID_SOURCE');
  return Buffer.from(value, 'utf8');
}

export function canonicalizeFormalitesLegalSource(
  input: unknown,
  profile: unknown,
): Buffer {
  const value = decodeSource(input, profile)
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n');
  return validateFormalitesLegalSource(Buffer.from(value, 'utf8'), profile);
}

export function hashFormalitesLegalSource(input: Uint8Array): string {
  return createHash('sha256').update(input).digest('hex');
}

const dimensionSchema = z
  .discriminatedUnion('kind', [
    z.object({ kind: z.literal('unknown') }).strict(),
    z
      .object({
        kind: z.literal('assertions'),
        values: z.array(z.string().min(1)).min(1),
      })
      .strict(),
    z
      .object({
        kind: z.literal('canonicalReferences'),
        values: z
          .array(
            z
              .object({
                owner: z.string().min(1),
                referenceId: z.string().min(1),
              })
              .strict(),
          )
          .min(1),
      })
      .strict(),
  ])
  .superRefine((value, ctx) => {
    // No canonical owner/reference binding is approved for any dimension in V1.
    if (value.kind === 'canonicalReferences')
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'No approved canonical reference binding',
      });
  });

const applicabilityShape = {
  jurisdiction: dimensionSchema,
  contractCategory: dimensionSchema,
  workingTimeBoundary: dimensionSchema,
  employeeCategories: dimensionSchema,
  employerCategories: dimensionSchema,
  collectiveAgreementAssumptions: dimensionSchema,
  effectiveDateConstraints: dimensionSchema,
  exclusions: dimensionSchema,
  bindingConditions: dimensionSchema,
};

const storedApplicabilitySchema = z.object(applicabilityShape).strict();
const inputApplicabilitySchema = z
  .object({
    jurisdiction: dimensionSchema.default({ kind: 'unknown' }),
    contractCategory: dimensionSchema.default({ kind: 'unknown' }),
    workingTimeBoundary: dimensionSchema.default({ kind: 'unknown' }),
    employeeCategories: dimensionSchema.default({ kind: 'unknown' }),
    employerCategories: dimensionSchema.default({ kind: 'unknown' }),
    collectiveAgreementAssumptions: dimensionSchema.default({
      kind: 'unknown',
    }),
    effectiveDateConstraints: dimensionSchema.default({ kind: 'unknown' }),
    exclusions: dimensionSchema.default({ kind: 'unknown' }),
    bindingConditions: dimensionSchema.default({ kind: 'unknown' }),
  })
  .strict();

export type FormalitesTemplateApplicability = z.infer<
  typeof storedApplicabilitySchema
>;

export function parseFormalitesTemplateApplicability(
  input: unknown,
): FormalitesTemplateApplicability {
  const result = inputApplicabilitySchema.safeParse(input);
  if (!result.success)
    throw new FormalitesLegalTemplateError('INVALID_APPLICABILITY');
  return result.data;
}

export function validateStoredFormalitesTemplateApplicability(
  input: unknown,
): FormalitesTemplateApplicability {
  const result = storedApplicabilitySchema.safeParse(input);
  if (!result.success)
    throw new FormalitesLegalTemplateError('INTEGRITY_FAILURE');
  return result.data;
}

export const formalitesTemplateIdentityInput = z
  .object({ legalPurpose: z.string().min(1) })
  .strict();
export const formalitesTemplateIdInput = z
  .object({ templateId: z.string().uuid() })
  .strict();
export const formalitesTemplateDraftLocator = formalitesTemplateIdInput
  .extend({ draftId: z.string().uuid() })
  .strict();
export const formalitesTemplateVersionLocator = formalitesTemplateIdInput
  .extend({ versionId: z.string().uuid() })
  .strict();
export const formalitesTemplateFreezeInput = formalitesTemplateDraftLocator
  .extend({ expectedRevision: z.number().int().positive().max(2147483647) })
  .strict();

const sourceInput = {
  contentProfile: z.literal(FORMALITES_LEGAL_SOURCE_PROFILE),
  sourceBytes: z
    .instanceof(Uint8Array)
    .transform((bytes) => Buffer.from(bytes)),
  applicability: z.unknown().transform(parseFormalitesTemplateApplicability),
};
export const formalitesTemplateCreateDraftInput = formalitesTemplateIdInput
  .extend(sourceInput)
  .strict();
export const formalitesTemplateEditDraftInput = formalitesTemplateFreezeInput
  .extend(sourceInput)
  .strict();
