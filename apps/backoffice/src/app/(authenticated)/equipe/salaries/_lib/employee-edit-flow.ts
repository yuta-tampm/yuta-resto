export type EmployeeEditDraftSnapshot = {
  givenNames: string;
  familyName: string;
  position: string;
  qualification: string;
  employmentTermType: string;
  expectedEndDate: string;
  fixedTermReasonCode: string;
  workTimeCategory: string;
  contractWeeklyHours: string;
  contractWeeklyMinuteRemainder: string;
  entryDate: string;
};

export const employeeEditSemanticGroups = [
  'identity',
  'role',
  'contract_terms',
  'work_time',
  'entry',
] as const;

export type EmployeeEditSemanticGroup =
  (typeof employeeEditSemanticGroups)[number];
export type EmployeeEditHistoryClassification = 'correction' | 'change';

export type EmployeeEditHistoryMetadataDraft = {
  classification: EmployeeEditHistoryClassification | '';
  effectiveDate: string;
  correctionReason: string;
};

export type EmployeeEditHistoryMetadataField =
  | 'classification'
  | 'effectiveDate'
  | 'correctionReason';

export function createEmployeeEditHistoryMetadataDrafts(): Record<
  EmployeeEditSemanticGroup,
  EmployeeEditHistoryMetadataDraft
> {
  const emptyDraft = (): EmployeeEditHistoryMetadataDraft => ({
    classification: '',
    effectiveDate: '',
    correctionReason: '',
  });
  return {
    identity: emptyDraft(),
    role: emptyDraft(),
    contract_terms: emptyDraft(),
    work_time: emptyDraft(),
    entry: { ...emptyDraft(), classification: 'correction' },
  };
}

export function employeeEditHistoryFieldKey(
  group: EmployeeEditSemanticGroup,
  field: EmployeeEditHistoryMetadataField,
): string {
  return `historyMetadata.${group}.${field}`;
}

const semanticGroupFields: Record<
  EmployeeEditSemanticGroup,
  readonly (keyof EmployeeEditDraftSnapshot)[]
> = {
  identity: ['givenNames', 'familyName'],
  role: ['position', 'qualification'],
  contract_terms: [
    'employmentTermType',
    'expectedEndDate',
    'fixedTermReasonCode',
  ],
  work_time: [
    'workTimeCategory',
    'contractWeeklyHours',
    'contractWeeklyMinuteRemainder',
  ],
  entry: ['entryDate'],
};

export function getClientObservedChangedGroups(
  initial: EmployeeEditDraftSnapshot,
  current: EmployeeEditDraftSnapshot,
): EmployeeEditSemanticGroup[] {
  return employeeEditSemanticGroups.filter((group) =>
    semanticGroupFields[group].some(
      (field) => initial[field] !== current[field],
    ),
  );
}

export function getAllowedHistoryClassifications(
  group: EmployeeEditSemanticGroup,
): readonly EmployeeEditHistoryClassification[] {
  return group === 'entry' ? ['correction'] : ['correction', 'change'];
}

export function historyMetadataRequirements(
  group: EmployeeEditSemanticGroup,
  classification: EmployeeEditHistoryClassification | '',
): {
  effectiveDate: 'hidden' | 'required';
  correctionReason: 'hidden' | 'optional' | 'required';
} {
  if (classification === 'change') {
    return {
      effectiveDate:
        group === 'role' || group === 'contract_terms' || group === 'work_time'
          ? 'required'
          : 'hidden',
      correctionReason: 'hidden',
    };
  }
  if (classification !== 'correction') {
    return { effectiveDate: 'hidden', correctionReason: 'hidden' };
  }
  return {
    effectiveDate: 'hidden',
    correctionReason:
      group === 'contract_terms' || group === 'work_time' || group === 'entry'
        ? 'required'
        : 'optional',
  };
}

export function isClientHistoryMetadataDraftValid(
  group: EmployeeEditSemanticGroup,
  draft: EmployeeEditHistoryMetadataDraft,
  boundaries: { minimumEffectiveDate: string; maximumEffectiveDate: string },
): boolean {
  if (
    !getAllowedHistoryClassifications(group).includes(
      draft.classification as EmployeeEditHistoryClassification,
    )
  ) {
    return false;
  }
  const requirements = historyMetadataRequirements(group, draft.classification);
  if (
    requirements.effectiveDate === 'required' &&
    (!draft.effectiveDate ||
      draft.effectiveDate < boundaries.minimumEffectiveDate ||
      draft.effectiveDate > boundaries.maximumEffectiveDate)
  ) {
    return false;
  }
  if (
    requirements.correctionReason === 'required' &&
    draft.correctionReason.trim().length < 3
  ) {
    return false;
  }
  return true;
}

export function areClientHistoryMetadataDraftsReady(
  groups: readonly EmployeeEditSemanticGroup[],
  drafts: Readonly<
    Record<EmployeeEditSemanticGroup, EmployeeEditHistoryMetadataDraft>
  >,
  boundaries: { minimumEffectiveDate: string; maximumEffectiveDate: string },
): boolean {
  return groups.every((group) =>
    isClientHistoryMetadataDraftValid(group, drafts[group], boundaries),
  );
}

export function serializeClientHistoryMetadata(
  groups: readonly EmployeeEditSemanticGroup[],
  drafts: Readonly<
    Record<EmployeeEditSemanticGroup, EmployeeEditHistoryMetadataDraft>
  >,
): string {
  return JSON.stringify(
    groups.map((semanticGroup) => {
      const draft = drafts[semanticGroup];
      const requirements = historyMetadataRequirements(
        semanticGroup,
        draft.classification,
      );
      return {
        semanticGroup,
        classification: draft.classification,
        effectiveDate:
          requirements.effectiveDate === 'required'
            ? draft.effectiveDate
            : null,
        correctionReason:
          requirements.correctionReason === 'hidden'
            ? null
            : draft.correctionReason.trim() || null,
      };
    }),
  );
}

export function isEmployeeEditSubmitDisabled(input: {
  ready: boolean;
  pending: boolean;
}): boolean {
  return !input.ready || input.pending;
}

export function hasEmployeeEditUnsavedChanges(
  initial: EmployeeEditDraftSnapshot,
  current: EmployeeEditDraftSnapshot,
): boolean {
  return (Object.keys(initial) as Array<keyof EmployeeEditDraftSnapshot>).some(
    (field) => initial[field] !== current[field],
  );
}
