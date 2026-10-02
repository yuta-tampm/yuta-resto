import {
  reputationReviewSocialLinkFieldValues,
  reputationReviewSocialLinkIssueCodeSchema,
  reputationReviewSocialLinksValuesSchema,
  type ReputationReviewSocialLinkField,
  type ReputationReviewSocialLinkIssueCode,
  type ReputationReviewSocialLinksOutcome,
  type ReputationReviewSocialLinksReadModel,
  type ReputationReviewSocialLinksSaveInput,
  type ReputationReviewSocialLinksValues,
} from '@yuta/contracts/reputation';

export type ReviewSocialLinksInitialOutcome =
  | {
      kind: 'success';
      model: ReputationReviewSocialLinksReadModel;
    }
  | Extract<
      ReputationReviewSocialLinksOutcome,
      { kind: 'configuration_unavailable' }
    >
  | Extract<ReputationReviewSocialLinksOutcome, { kind: 'server_error' }>;

export type ReviewSocialLinksDraft = Record<
  ReputationReviewSocialLinkField,
  string
>;

export type ReviewSocialLinksViewStatus =
  | 'idle'
  | 'dirty'
  | 'invalid'
  | 'saving'
  | 'saved'
  | 'no_change'
  | 'server_error'
  | 'conflict'
  | 'configuration_unavailable';

export type ReviewSocialLinksViewState = {
  baseline: ReputationReviewSocialLinksReadModel | null;
  conflictModel: ReputationReviewSocialLinksReadModel | null;
  draft: ReviewSocialLinksDraft;
  fieldErrors: Partial<Record<ReputationReviewSocialLinkField, string>>;
  status: ReviewSocialLinksViewStatus;
};

export type ReviewSocialLinksSavePreparation =
  | {
      kind: 'ready';
      state: ReviewSocialLinksViewState;
      input: ReputationReviewSocialLinksSaveInput;
    }
  | {
      kind: 'blocked';
      state: ReviewSocialLinksViewState;
      focusField: ReputationReviewSocialLinkField | null;
    };

export type ReviewSocialLinksSubmissionGate = {
  tryStart(): boolean;
  finish(): void;
};

const blankDraft: ReviewSocialLinksDraft = {
  googleReviewUrl: '',
  facebookReviewUrl: '',
  instagramUrl: '',
};

const issueMessages: Record<ReputationReviewSocialLinkIssueCode, string> = {
  INVALID_TYPE: "L'adresse doit être saisie sous forme de texte.",
  TOO_LONG: "L'adresse ne peut pas dépasser 2 048 caractères.",
  MALFORMED_URL: 'Saisissez une adresse web complète et valide.',
  HTTPS_REQUIRED: "L'adresse doit commencer par https://.",
  CREDENTIALS_FORBIDDEN:
    "L'adresse ne peut pas contenir d'identifiant ou de mot de passe.",
  HOST_NOT_ALLOWED: "Cette destination n'est pas autorisée pour ce service.",
  PATH_NOT_ALLOWED: 'Cette destination ne correspond pas au format attendu.',
};

export function createReviewSocialLinksSubmissionGate(): ReviewSocialLinksSubmissionGate {
  let inFlight = false;
  return {
    tryStart() {
      if (inFlight) return false;
      inFlight = true;
      return true;
    },
    finish() {
      inFlight = false;
    },
  };
}

export function createReviewSocialLinksViewState(
  initialOutcome: ReviewSocialLinksInitialOutcome,
): ReviewSocialLinksViewState {
  if (initialOutcome.kind === 'success') {
    return {
      baseline: initialOutcome.model,
      conflictModel: null,
      draft: draftFromValues(initialOutcome.model.values),
      fieldErrors: {},
      status: 'idle',
    };
  }

  return {
    baseline: null,
    conflictModel: null,
    draft: { ...blankDraft },
    fieldErrors: {},
    status:
      initialOutcome.kind === 'configuration_unavailable'
        ? 'configuration_unavailable'
        : 'server_error',
  };
}

export function updateReviewSocialLinksDraft(
  state: ReviewSocialLinksViewState,
  field: ReputationReviewSocialLinkField,
  value: string,
): ReviewSocialLinksViewState {
  const draft = { ...state.draft, [field]: value };
  const fieldErrors = { ...state.fieldErrors };
  delete fieldErrors[field];

  return {
    ...state,
    draft,
    fieldErrors,
    status:
      state.status === 'conflict'
        ? 'conflict'
        : firstErrorField(fieldErrors)
          ? 'invalid'
          : isNormalizedDraftDirty(draft, state.baseline?.values ?? null)
            ? 'dirty'
            : 'idle',
  };
}

export function validateReviewSocialLinksDraft(
  state: ReviewSocialLinksViewState,
): ReviewSocialLinksViewState {
  if (
    !state.baseline ||
    state.status === 'saving' ||
    state.status === 'conflict' ||
    state.status === 'configuration_unavailable'
  ) {
    return state;
  }

  const parsed = reputationReviewSocialLinksValuesSchema.safeParse(state.draft);
  if (!parsed.success) {
    return {
      ...state,
      fieldErrors: fieldErrorsFromIssues(parsed.error.issues),
      status: 'invalid',
    };
  }

  return {
    ...state,
    fieldErrors: {},
    status: valuesEqual(parsed.data, state.baseline.values) ? 'idle' : 'dirty',
  };
}

export function canSubmitReviewSocialLinks(
  state: ReviewSocialLinksViewState,
): boolean {
  if (
    !state.baseline ||
    state.status === 'saving' ||
    state.status === 'conflict' ||
    state.status === 'configuration_unavailable'
  ) {
    return false;
  }

  const parsed = reputationReviewSocialLinksValuesSchema.safeParse(state.draft);
  return parsed.success && !valuesEqual(parsed.data, state.baseline.values);
}

export function prepareReviewSocialLinksSave(
  state: ReviewSocialLinksViewState,
): ReviewSocialLinksSavePreparation {
  if (
    !state.baseline ||
    state.status === 'saving' ||
    state.status === 'conflict' ||
    state.status === 'configuration_unavailable'
  ) {
    return { kind: 'blocked', state, focusField: null };
  }

  const parsed = reputationReviewSocialLinksValuesSchema.safeParse(state.draft);
  if (!parsed.success) {
    const fieldErrors = fieldErrorsFromIssues(parsed.error.issues);
    return {
      kind: 'blocked',
      state: { ...state, fieldErrors, status: 'invalid' },
      focusField: firstErrorField(fieldErrors),
    };
  }

  if (valuesEqual(parsed.data, state.baseline.values)) {
    return {
      kind: 'blocked',
      state: { ...state, fieldErrors: {}, status: 'no_change' },
      focusField: null,
    };
  }

  return {
    kind: 'ready',
    state: { ...state, fieldErrors: {}, status: 'saving' },
    input: {
      expectedValues: state.baseline.values,
      proposedValues: parsed.data,
      expectedStateToken: state.baseline.stateToken,
    },
  };
}

export function applyReviewSocialLinksOutcome(
  state: ReviewSocialLinksViewState,
  outcome: ReputationReviewSocialLinksOutcome,
): ReviewSocialLinksViewState {
  if (outcome.kind === 'success' || outcome.kind === 'no_change') {
    return {
      baseline: outcome.model,
      conflictModel: null,
      draft: draftFromValues(outcome.model.values),
      fieldErrors: {},
      status: outcome.kind === 'success' ? 'saved' : 'no_change',
    };
  }

  if (outcome.kind === 'validation_error') {
    const fieldErrors = Object.fromEntries(
      outcome.issues.map((issue) => [issue.field, issueMessages[issue.code]]),
    ) as Partial<Record<ReputationReviewSocialLinkField, string>>;
    return { ...state, fieldErrors, status: 'invalid' };
  }

  if (outcome.kind === 'conflict') {
    return {
      ...state,
      conflictModel: outcome.model,
      fieldErrors: {},
      status: 'conflict',
    };
  }

  if (outcome.kind === 'configuration_unavailable') {
    return {
      ...state,
      baseline: null,
      conflictModel: null,
      fieldErrors: {},
      status: 'configuration_unavailable',
    };
  }

  return { ...state, fieldErrors: {}, status: 'server_error' };
}

export function reloadReviewSocialLinksConflict(
  state: ReviewSocialLinksViewState,
): ReviewSocialLinksViewState {
  if (!state.conflictModel) return state;
  return {
    baseline: state.conflictModel,
    conflictModel: null,
    draft: draftFromValues(state.conflictModel.values),
    fieldErrors: {},
    status: 'idle',
  };
}

function fieldErrorsFromIssues(
  issues: ReadonlyArray<{ path: PropertyKey[]; message: string }>,
): Partial<Record<ReputationReviewSocialLinkField, string>> {
  const errors: Partial<Record<ReputationReviewSocialLinkField, string>> = {};
  for (const issue of issues) {
    const field = issue.path.find((part) =>
      reputationReviewSocialLinkFieldValues.includes(
        part as ReputationReviewSocialLinkField,
      ),
    ) as ReputationReviewSocialLinkField | undefined;
    const code = reputationReviewSocialLinkIssueCodeSchema.safeParse(
      issue.message,
    );
    if (field && code.success && !errors[field]) {
      errors[field] = issueMessages[code.data];
    }
  }
  return errors;
}

function firstErrorField(
  errors: Partial<Record<ReputationReviewSocialLinkField, string>>,
): ReputationReviewSocialLinkField | null {
  return (
    reputationReviewSocialLinkFieldValues.find((field) => errors[field]) ?? null
  );
}

function draftFromValues(
  values: ReputationReviewSocialLinksValues,
): ReviewSocialLinksDraft {
  return {
    googleReviewUrl: values.googleReviewUrl ?? '',
    facebookReviewUrl: values.facebookReviewUrl ?? '',
    instagramUrl: values.instagramUrl ?? '',
  };
}

function isNormalizedDraftDirty(
  draft: ReviewSocialLinksDraft,
  baseline: ReputationReviewSocialLinksValues | null,
): boolean {
  if (!baseline) return false;
  const parsed = reputationReviewSocialLinksValuesSchema.safeParse(draft);
  if (!parsed.success) {
    return reputationReviewSocialLinkFieldValues.some(
      (field) => draft[field] !== (baseline[field] ?? ''),
    );
  }
  return !valuesEqual(parsed.data, baseline);
}

function valuesEqual(
  left: ReputationReviewSocialLinksValues,
  right: ReputationReviewSocialLinksValues,
): boolean {
  return reputationReviewSocialLinkFieldValues.every(
    (field) => left[field] === right[field],
  );
}
