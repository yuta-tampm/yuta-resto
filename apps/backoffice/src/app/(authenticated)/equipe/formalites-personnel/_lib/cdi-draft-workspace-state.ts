import type {
  FormalitesPersonnelDraftMutationOutcome,
  FormalitesPersonnelDraftReadModel,
  FormalitesPersonnelFact,
  FormalitesPersonnelProbationChoice,
  FormalitesPersonnelReconciliationChoice,
} from '@yuta/contracts';

export type WorkspaceMutationKind = 'create' | 'save' | 'reconcile' | 'abandon';

export type WorkspaceOperation = {
  kind: WorkspaceMutationKind;
  key: string;
  intent: string;
  status: 'pending' | 'uncertain';
};

export type WorkspaceOperationPreparation =
  | { kind: 'blocked'; operation: WorkspaceOperation }
  | { kind: 'submit'; operation: WorkspaceOperation };

export const probationChoiceLabels: Record<
  FormalitesPersonnelProbationChoice,
  string
> = {
  undecided: 'À décider',
  include: 'Prévoir une période d’essai',
  exclude: 'Ne pas prévoir de période d’essai',
};

export const personnelFactLabels: Record<FormalitesPersonnelFact, string> = {
  givenNames: 'Prénoms',
  familyName: 'Nom',
  position: 'Poste',
  qualification: 'Qualification',
  employmentTermType: 'Type de contrat',
  entryDate: 'Date d’entrée',
  contractWeeklyMinutes: 'Durée hebdomadaire',
};

export const reconciliationChoiceLabels: Record<
  FormalitesPersonnelReconciliationChoice,
  string
> = {
  keep: 'Conserver la valeur du brouillon',
  refresh: 'Reprendre la valeur actuelle du dossier salarié',
};

export function createWorkspaceIntent(
  kind: WorkspaceMutationKind,
  payload: Readonly<Record<string, unknown>>,
): string {
  return `${kind}:${stableSerialize(payload)}`;
}

export function prepareWorkspaceOperation(
  current: WorkspaceOperation | null,
  kind: WorkspaceMutationKind,
  intent: string,
  createKey: () => string,
): WorkspaceOperationPreparation {
  if (current?.status === 'pending') {
    return { kind: 'blocked', operation: current };
  }
  if (
    current?.status === 'uncertain' &&
    current.kind === kind &&
    current.intent === intent
  ) {
    return {
      kind: 'submit',
      operation: { ...current, status: 'pending' },
    };
  }
  return {
    kind: 'submit',
    operation: {
      kind,
      key: createKey(),
      intent,
      status: 'pending',
    },
  };
}

export function settleWorkspaceOperation(
  operation: WorkspaceOperation,
  outcome: FormalitesPersonnelDraftMutationOutcome,
): WorkspaceOperation | null {
  return outcome.kind === 'server_error'
    ? { ...operation, status: 'uncertain' }
    : null;
}

export function probationChoiceFromModel(
  model: FormalitesPersonnelDraftReadModel,
): FormalitesPersonnelProbationChoice {
  return model.state === 'eligible_no_draft'
    ? 'undecided'
    : model.probationChoice;
}

export function hasWorkspaceUnsavedChanges(input: {
  model: FormalitesPersonnelDraftReadModel;
  probationChoice: FormalitesPersonnelProbationChoice;
  reconciliationChoices: Partial<
    Record<FormalitesPersonnelFact, FormalitesPersonnelReconciliationChoice>
  >;
  abandonmentReason: string;
}): boolean {
  const savedChoice = probationChoiceFromModel(input.model);
  return (
    input.probationChoice !== savedChoice ||
    Object.keys(input.reconciliationChoices).length > 0 ||
    input.abandonmentReason.length > 0
  );
}

export function retainRelevantReconciliationChoices(
  choices: Partial<
    Record<FormalitesPersonnelFact, FormalitesPersonnelReconciliationChoice>
  >,
  model: FormalitesPersonnelDraftReadModel,
): Partial<
  Record<FormalitesPersonnelFact, FormalitesPersonnelReconciliationChoice>
> {
  if (model.state !== 'reconciliation_required') return {};
  return Object.fromEntries(
    model.divergentFacts.flatMap((fact) =>
      choices[fact] ? [[fact, choices[fact]]] : [],
    ),
  );
}

export function createOpaqueOperationKey(): string {
  return globalThis.crypto.randomUUID().replaceAll('-', '');
}

function stableSerialize(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map(stableSerialize).join(',')}]`;
  }
  if (value && typeof value === 'object') {
    return `{${Object.entries(value)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, entry]) => `${JSON.stringify(key)}:${stableSerialize(entry)}`)
      .join(',')}}`;
  }
  return JSON.stringify(value);
}
