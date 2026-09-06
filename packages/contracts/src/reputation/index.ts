import { z } from 'zod';
import {
  establishmentIdSchema,
  identifierSchema,
  organizationIdSchema,
} from '../common';

export const feedbackStatusValues = [
  'NEW',
  'TO_PROCESS',
  'DRAFTED',
  'REPLIED',
  'FOLLOW_UP',
  'RESOLVED',
  'ARCHIVED',
  'SPAM',
] as const;
export const feedbackStatusSchema = z.enum(feedbackStatusValues);
export type FeedbackStatus = z.infer<typeof feedbackStatusSchema>;

export const feedbackSourceValues = ['GOOGLE', 'DIRECT'] as const;
export const feedbackSourceSchema = z.enum(feedbackSourceValues);
export type FeedbackSource = z.infer<typeof feedbackSourceSchema>;

export const feedbackTypeValues = ['PUBLIC_REVIEW', 'DIRECT_FEEDBACK'] as const;
export const feedbackTypeSchema = z.enum(feedbackTypeValues);
export type FeedbackType = z.infer<typeof feedbackTypeSchema>;

export const feedbackSentimentValues = [
  'POSITIVE',
  'NEUTRAL',
  'NEGATIVE',
] as const;
export const feedbackSentimentSchema = z.enum(feedbackSentimentValues);
export type FeedbackSentiment = z.infer<typeof feedbackSentimentSchema>;

export const feedbackUrgencyValues = [
  'LOW',
  'MEDIUM',
  'HIGH',
  'CRITICAL',
] as const;
export const feedbackUrgencySchema = z.enum(feedbackUrgencyValues);
export type FeedbackUrgency = z.infer<typeof feedbackUrgencySchema>;

export const feedbackTopicValues = [
  'FOOD_QUALITY',
  'WAITING_TIME',
  'WELCOME',
  'SERVICE',
  'CLEANLINESS',
  'PRICE',
  'PORTION_SIZE',
  'ORDER_ACCURACY',
  'ONLINE_ORDER',
  'DELIVERY',
  'AMBIENCE',
  'ALLERGEN',
  'STAFF_BEHAVIOUR',
  'OTHER',
] as const;
export const feedbackTopicSchema = z.enum(feedbackTopicValues);
export type FeedbackTopic = z.infer<typeof feedbackTopicSchema>;

export const feedbackToneValues = [
  'DEFAULT',
  'WARMER',
  'PROFESSIONAL',
  'SHORTER',
  'EMPATHETIC',
  'LIGHTER',
  'APOLOGETIC',
  'SOLUTION_ORIENTED',
] as const;
export const feedbackToneSchema = z.enum(feedbackToneValues);

export const servicePeriodValues = ['LUNCH', 'DINNER', 'OTHER'] as const;
export const servicePeriodSchema = z.enum(servicePeriodValues);

export const feedbackAnalysisSchema = z.object({
  sentiment: feedbackSentimentSchema,
  urgency: feedbackUrgencySchema,
  summary: z.string().trim().min(1).max(500),
  topics: z.array(feedbackTopicSchema).max(8),
  suggestedAction: z.string().trim().max(500).nullable(),
  requiresFollowUp: z.boolean(),
  requiresManagerAttention: z.boolean(),
  confidence: z.number().min(0).max(1).nullable(),
});
export type FeedbackAnalysisOutput = z.infer<typeof feedbackAnalysisSchema>;

export const publicFeedbackSubmissionSchema = z
  .object({
    rating: z.coerce.number().int().min(1).max(5),
    topics: z.array(feedbackTopicSchema).max(8).default([]),
    comment: z.string().trim().max(4_000).optional().default(''),
    customerName: z.string().trim().max(255).optional().default(''),
    customerEmail: z
      .union([z.string().trim().email().max(320), z.literal('')])
      .optional()
      .default(''),
    customerPhone: z.string().trim().max(40).optional().default(''),
    consentToContact: z.boolean().default(false),
    orderReference: z.string().trim().max(100).optional().default(''),
    visitDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date.')
      .optional(),
    servicePeriod: servicePeriodSchema.nullable().optional(),
    sourceTag: z
      .enum(['table', 'receipt', 'counter', 'click_collect', 'email', 'other'])
      .optional(),
    website: z.string().max(255).optional().default(''),
  })
  .superRefine((value, context) => {
    const hasContact = Boolean(value.customerEmail || value.customerPhone);
    if (hasContact && !value.consentToContact) {
      context.addIssue({
        code: 'custom',
        path: ['consentToContact'],
        message:
          'Le consentement est obligatoire lorsque des coordonnées sont fournies.',
      });
    }
  });
export type PublicFeedbackSubmission = z.infer<
  typeof publicFeedbackSubmissionSchema
>;

export const publicFeedbackResponseSchema = z.object({
  feedbackId: identifierSchema,
  status: z.literal('received'),
});
export type PublicFeedbackResponse = z.infer<
  typeof publicFeedbackResponseSchema
>;

export const feedbackListQuerySchema = z.object({
  source: feedbackSourceSchema.optional(),
  status: feedbackStatusSchema.optional(),
  rating: z.coerce.number().int().min(1).max(5).optional(),
  sentiment: feedbackSentimentSchema.optional(),
  urgency: feedbackUrgencySchema.optional(),
  hasIncident: z.coerce.boolean().optional(),
  assignedTo: identifierSchema.optional(),
  search: z.string().trim().max(200).optional(),
  sort: z
    .enum([
      'newest',
      'oldest',
      'rating_asc',
      'rating_desc',
      'urgency_desc',
      'unanswered',
    ])
    .default('newest'),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(25),
});
export type FeedbackListQuery = z.infer<typeof feedbackListQuerySchema>;

export const feedbackScopeSchema = z.object({
  organizationId: organizationIdSchema,
  establishmentId: establishmentIdSchema,
});

export const updateFeedbackSchema = z
  .object({
    status: feedbackStatusSchema.optional(),
    assignedToUserId: identifierSchema.nullable().optional(),
  })
  .refine(
    (value) =>
      value.status !== undefined || value.assignedToUserId !== undefined,
    'At least one field is required.',
  );

export const generateReplySchema = z.object({
  tone: feedbackToneSchema.optional().default('DEFAULT'),
  language: z.string().trim().min(2).max(35).optional().default('fr'),
  instructions: z.string().trim().max(1_000).optional(),
});

export const saveReplySchema = z.object({
  content: z.string().trim().min(1).max(4_000),
});

export const createInternalNoteSchema = z.object({
  content: z.string().trim().min(1).max(4_000),
});

export const incidentPriorityValues = [
  'LOW',
  'MEDIUM',
  'HIGH',
  'CRITICAL',
] as const;
export const incidentPrioritySchema = z.enum(incidentPriorityValues);

export const incidentStatusValues = [
  'OPEN',
  'IN_PROGRESS',
  'RESOLVED',
  'CLOSED',
] as const;
export const incidentStatusSchema = z.enum(incidentStatusValues);

export const createIncidentSchema = z.object({
  feedbackItemId: identifierSchema,
  category: z.string().trim().min(1).max(100),
  priority: incidentPrioritySchema,
  ownerUserId: identifierSchema.nullable().optional(),
  title: z.string().trim().min(1).max(255),
  description: z.string().trim().max(4_000).nullable().optional(),
  internalNotes: z.string().trim().max(4_000).nullable().optional(),
  dueAt: z.string().datetime().nullable().optional(),
});

export const reputationReviewSocialLinkProviderValues = [
  'GOOGLE',
  'FACEBOOK',
  'INSTAGRAM',
] as const;
export const reputationReviewSocialLinkProviderSchema = z.enum(
  reputationReviewSocialLinkProviderValues,
);
export type ReputationReviewSocialLinkProvider = z.infer<
  typeof reputationReviewSocialLinkProviderSchema
>;

export const reputationReviewSocialLinkFieldValues = [
  'googleReviewUrl',
  'facebookReviewUrl',
  'instagramUrl',
] as const;
export const reputationReviewSocialLinkFieldSchema = z.enum(
  reputationReviewSocialLinkFieldValues,
);
export type ReputationReviewSocialLinkField = z.infer<
  typeof reputationReviewSocialLinkFieldSchema
>;

export const reputationReviewSocialLinkIssueCodeValues = [
  'INVALID_TYPE',
  'TOO_LONG',
  'MALFORMED_URL',
  'HTTPS_REQUIRED',
  'CREDENTIALS_FORBIDDEN',
  'HOST_NOT_ALLOWED',
  'PATH_NOT_ALLOWED',
] as const;
export const reputationReviewSocialLinkIssueCodeSchema = z.enum(
  reputationReviewSocialLinkIssueCodeValues,
);
export type ReputationReviewSocialLinkIssueCode = z.infer<
  typeof reputationReviewSocialLinkIssueCodeSchema
>;

type ReputationReviewSocialLinkPolicy = Readonly<{
  hosts: Readonly<Record<string, string | null>>;
}>;

const reputationReviewSocialLinkPolicies: Readonly<
  Record<ReputationReviewSocialLinkProvider, ReputationReviewSocialLinkPolicy>
> = {
  GOOGLE: {
    hosts: {
      'g.page': null,
      'maps.app.goo.gl': null,
      'google.com': '/maps/',
      'www.google.com': '/maps/',
      'google.fr': '/maps/',
      'www.google.fr': '/maps/',
      'search.google.com': '/local/writereview',
    },
  },
  FACEBOOK: {
    hosts: {
      'facebook.com': null,
      'www.facebook.com': null,
      'm.facebook.com': null,
      'fb.me': null,
    },
  },
  INSTAGRAM: {
    hosts: {
      'instagram.com': null,
      'www.instagram.com': null,
    },
  },
};

export type ReputationReviewSocialLinkValidationResult =
  | Readonly<{ success: true; value: string | null }>
  | Readonly<{
      success: false;
      issueCode: ReputationReviewSocialLinkIssueCode;
    }>;

export const validateReputationReviewSocialLink = (
  provider: ReputationReviewSocialLinkProvider,
  input: unknown,
): ReputationReviewSocialLinkValidationResult => {
  if (input === null) {
    return { success: true, value: null };
  }
  if (typeof input !== 'string') {
    return { success: false, issueCode: 'INVALID_TYPE' };
  }

  const value = input.trim();
  if (value.length === 0) {
    return { success: true, value: null };
  }
  if (value.length > 2_048) {
    return { success: false, issueCode: 'TOO_LONG' };
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(value);
  } catch {
    return { success: false, issueCode: 'MALFORMED_URL' };
  }

  if (parsedUrl.protocol !== 'https:') {
    return { success: false, issueCode: 'HTTPS_REQUIRED' };
  }
  if (parsedUrl.username !== '' || parsedUrl.password !== '') {
    return { success: false, issueCode: 'CREDENTIALS_FORBIDDEN' };
  }

  const hosts = reputationReviewSocialLinkPolicies[provider].hosts;
  if (!Object.prototype.hasOwnProperty.call(hosts, parsedUrl.hostname)) {
    return { success: false, issueCode: 'HOST_NOT_ALLOWED' };
  }
  const pathPrefix = hosts[parsedUrl.hostname];
  if (pathPrefix !== null && !parsedUrl.pathname.startsWith(pathPrefix)) {
    return { success: false, issueCode: 'PATH_NOT_ALLOWED' };
  }

  return { success: true, value };
};

const createReputationReviewSocialLinkSchema = (
  provider: ReputationReviewSocialLinkProvider,
) =>
  z.union([z.string(), z.null()]).transform((input, context) => {
    const result = validateReputationReviewSocialLink(provider, input);
    if (!result.success) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: result.issueCode,
      });
      return z.NEVER;
    }
    return result.value;
  });

export const reputationGoogleReviewUrlSchema =
  createReputationReviewSocialLinkSchema('GOOGLE');
export const reputationFacebookReviewUrlSchema =
  createReputationReviewSocialLinkSchema('FACEBOOK');
export const reputationInstagramUrlSchema =
  createReputationReviewSocialLinkSchema('INSTAGRAM');

export const reputationReviewSocialLinksValuesSchema = z
  .object({
    googleReviewUrl: reputationGoogleReviewUrlSchema,
    facebookReviewUrl: reputationFacebookReviewUrlSchema,
    instagramUrl: reputationInstagramUrlSchema,
  })
  .strict();
export type ReputationReviewSocialLinksValues = z.infer<
  typeof reputationReviewSocialLinksValuesSchema
>;

export const reputationReviewSocialLinksStateTokenSchema = z
  .string()
  .regex(/^[a-f0-9]{64}$/);

export const reputationReviewSocialLinksReadModelSchema = z
  .object({
    values: reputationReviewSocialLinksValuesSchema,
    stateToken: reputationReviewSocialLinksStateTokenSchema,
  })
  .strict();
export type ReputationReviewSocialLinksReadModel = z.infer<
  typeof reputationReviewSocialLinksReadModelSchema
>;

export const reputationReviewSocialLinksSaveInputSchema = z
  .object({
    expectedValues: reputationReviewSocialLinksValuesSchema,
    proposedValues: reputationReviewSocialLinksValuesSchema,
    expectedStateToken: reputationReviewSocialLinksStateTokenSchema,
  })
  .strict();
export type ReputationReviewSocialLinksSaveInput = z.infer<
  typeof reputationReviewSocialLinksSaveInputSchema
>;

const reputationReviewSocialLinksModelOutcomeSchema = (
  kind: 'success' | 'no_change' | 'conflict',
) =>
  z
    .object({
      kind: z.literal(kind),
      model: reputationReviewSocialLinksReadModelSchema,
    })
    .strict();

export const reputationReviewSocialLinksValidationIssueSchema = z
  .object({
    field: reputationReviewSocialLinkFieldSchema,
    code: reputationReviewSocialLinkIssueCodeSchema,
  })
  .strict();

export const reputationReviewSocialLinksOutcomeSchema = z.discriminatedUnion(
  'kind',
  [
    reputationReviewSocialLinksModelOutcomeSchema('success'),
    reputationReviewSocialLinksModelOutcomeSchema('no_change'),
    z
      .object({
        kind: z.literal('validation_error'),
        issues: z
          .array(reputationReviewSocialLinksValidationIssueSchema)
          .min(1)
          .max(reputationReviewSocialLinkFieldValues.length),
      })
      .strict(),
    reputationReviewSocialLinksModelOutcomeSchema('conflict'),
    z.object({ kind: z.literal('configuration_unavailable') }).strict(),
    z.object({ kind: z.literal('server_error') }).strict(),
  ],
);
export type ReputationReviewSocialLinksOutcome = z.infer<
  typeof reputationReviewSocialLinksOutcomeSchema
>;

export const projectPublicReputationReviewSocialLinks = (
  values: Readonly<Record<ReputationReviewSocialLinkField, unknown>>,
): ReputationReviewSocialLinksValues => {
  const project = (
    provider: ReputationReviewSocialLinkProvider,
    value: unknown,
  ): string | null => {
    const result = validateReputationReviewSocialLink(provider, value);
    return result.success ? result.value : null;
  };

  return {
    googleReviewUrl: project('GOOGLE', values.googleReviewUrl),
    facebookReviewUrl: project('FACEBOOK', values.facebookReviewUrl),
    instagramUrl: project('INSTAGRAM', values.instagramUrl),
  };
};
