export type CdiDraftPrototypeField = {
  label: string;
  value: string;
};

export type CdiDraftPrototypeData = {
  fictionalEmployee: string;
  reusableFields: readonly CdiDraftPrototypeField[];
};

export type CdiDraftPrototypeStep = 'SOURCE' | 'INPUTS' | 'REVIEW';

export type FictionalProbationChoice = 'undecided' | 'yes' | 'no';

export type CdiDraftPrototypeValues = {
  address: string;
  remuneration: string;
  probationChoice: FictionalProbationChoice;
};

export type CdiDraftPrototypeState = {
  activeStep: CdiDraftPrototypeStep;
  draftValues: CdiDraftPrototypeValues;
  checkpointValues: CdiDraftPrototypeValues | null;
  reviewAcknowledged: boolean;
  validationAttempted: boolean;
};

export type CdiDraftPrototypeAction =
  | {
      type: 'EDIT_VALUE';
      field: keyof CdiDraftPrototypeValues;
      value: string;
    }
  | { type: 'SET_STEP'; step: CdiDraftPrototypeStep }
  | { type: 'REQUEST_REVIEW' }
  | { type: 'CREATE_CHECKPOINT' }
  | { type: 'SET_REVIEW_ACKNOWLEDGED'; acknowledged: boolean }
  | { type: 'RESET' };

export type CdiDraftDemoReadiness =
  | 'INCOMPLETE'
  | 'ATTENTION_REQUIRED'
  | 'READY';

export const cdiDraftPrototypeData: CdiDraftPrototypeData = {
  fictionalEmployee: 'Camille Martin',
  reusableFields: [
    { label: 'Identité', value: 'Camille Martin' },
    { label: 'Poste', value: 'Cheffe de rang' },
    { label: 'Qualification', value: 'Employée qualifiée' },
    { label: 'Type de contrat', value: 'CDI' },
    { label: "Date d'entrée prévue", value: '1 septembre 2026' },
    { label: 'Durée hebdomadaire', value: '35 h par semaine' },
  ],
};

const initialDraftValues: CdiDraftPrototypeValues = {
  address: '',
  remuneration: '',
  probationChoice: 'undecided',
};

export function createCdiDraftPrototypeState(): CdiDraftPrototypeState {
  return {
    activeStep: 'SOURCE',
    draftValues: { ...initialDraftValues },
    checkpointValues: null,
    reviewAcknowledged: false,
    validationAttempted: false,
  };
}

export function cdiDraftPrototypeReducer(
  state: CdiDraftPrototypeState,
  action: CdiDraftPrototypeAction,
): CdiDraftPrototypeState {
  switch (action.type) {
    case 'EDIT_VALUE':
      return {
        ...state,
        draftValues: {
          ...state.draftValues,
          [action.field]: action.value,
        },
        reviewAcknowledged: false,
      };
    case 'SET_STEP':
      return {
        ...state,
        activeStep: action.step,
      };
    case 'REQUEST_REVIEW':
      return hasRequiredDemoInputs(state.draftValues)
        ? {
            ...state,
            activeStep: 'REVIEW',
            validationAttempted: true,
          }
        : {
            ...state,
            activeStep: 'INPUTS',
            validationAttempted: true,
          };
    case 'CREATE_CHECKPOINT':
      return {
        ...state,
        checkpointValues: { ...state.draftValues },
      };
    case 'SET_REVIEW_ACKNOWLEDGED':
      return {
        ...state,
        reviewAcknowledged: action.acknowledged,
      };
    case 'RESET':
      return createCdiDraftPrototypeState();
  }
}

export function hasRequiredDemoInputs(
  values: CdiDraftPrototypeValues,
): boolean {
  return (
    values.address.trim().length > 0 && values.remuneration.trim().length > 0
  );
}

export function getCdiDraftDemoReadiness(
  values: CdiDraftPrototypeValues,
  reviewAcknowledged: boolean,
): CdiDraftDemoReadiness {
  if (!hasRequiredDemoInputs(values)) return 'INCOMPLETE';
  if (values.probationChoice === 'undecided' || !reviewAcknowledged) {
    return 'ATTENTION_REQUIRED';
  }
  return 'READY';
}

export function isCdiDraftCheckpointDirty(
  state: CdiDraftPrototypeState,
): boolean {
  if (!state.checkpointValues) return true;
  return (
    state.draftValues.address !== state.checkpointValues.address ||
    state.draftValues.remuneration !== state.checkpointValues.remuneration ||
    state.draftValues.probationChoice !== state.checkpointValues.probationChoice
  );
}
