export type ValidatedKnowledgeItem = {
  id: string;
  statement: string;
};

export type ValidatedKnowledgeDraft = {
  key: string;
  id: string | null;
  acceptedStatement: string | null;
  statement: string;
  pendingRemoval: boolean;
};

export function hasNonWhitespace(value: string): boolean {
  return /\S/u.test(value);
}

export function draftFromValidatedItem(
  item: ValidatedKnowledgeItem,
): ValidatedKnowledgeDraft {
  return {
    key: item.id,
    id: item.id,
    acceptedStatement: item.statement,
    statement: item.statement,
    pendingRemoval: false,
  };
}

export function newValidatedKnowledgeDraft(
  key: string,
): ValidatedKnowledgeDraft {
  return {
    key,
    id: null,
    acceptedStatement: null,
    statement: '',
    pendingRemoval: false,
  };
}

export function isValidatedKnowledgeDraftDirty(
  draft: ValidatedKnowledgeDraft,
): boolean {
  return draft.pendingRemoval || draft.statement !== draft.acceptedStatement;
}

export function markValidatedKnowledgeForRemoval(
  draft: ValidatedKnowledgeDraft,
): ValidatedKnowledgeDraft {
  return { ...draft, pendingRemoval: true };
}

export function undoValidatedKnowledgeRemoval(
  draft: ValidatedKnowledgeDraft,
): ValidatedKnowledgeDraft {
  return { ...draft, pendingRemoval: false };
}

export function acceptValidatedKnowledgeStatement(
  draft: ValidatedKnowledgeDraft,
  item: ValidatedKnowledgeItem,
): ValidatedKnowledgeDraft {
  return {
    key: item.id,
    id: item.id,
    acceptedStatement: item.statement,
    statement: item.statement,
    pendingRemoval: false,
  };
}
