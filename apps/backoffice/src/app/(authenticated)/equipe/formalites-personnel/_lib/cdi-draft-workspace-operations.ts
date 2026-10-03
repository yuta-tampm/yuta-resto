import type {
  FormalitesPersonnelDraftMutationActionResult,
  LoadFormalitesPersonnelDraftActionResult,
} from './cdi-draft-workspace-action-result';
import type { WorkspaceFeedback } from './cdi-draft-workspace-feedback';
import {
  createWorkspaceIntent,
  prepareWorkspaceOperation,
  settleWorkspaceOperation,
  type WorkspaceMutationKind,
  type WorkspaceOperation,
} from './cdi-draft-workspace-state';

export type WorkspaceMutationRun = {
  operation: WorkspaceOperation | null;
  outcome: FormalitesPersonnelDraftMutationActionResult;
};

/**
 * Runs one CDI draft mutation with duplicate-submit protection. A rejected
 * server call is treated as an unconfirmed `server_error`, so the operation
 * becomes `uncertain` and a retry of the same intent reuses the same key.
 * Returns `null` while another mutation is still pending.
 */
export async function runWorkspaceMutation(input: {
  current: WorkspaceOperation | null;
  kind: WorkspaceMutationKind;
  intentPayload: Readonly<Record<string, unknown>>;
  createKey: () => string;
  onPending: (operation: WorkspaceOperation) => void;
  run: (
    operationKey: string,
  ) => Promise<FormalitesPersonnelDraftMutationActionResult>;
}): Promise<WorkspaceMutationRun | null> {
  const preparation = prepareWorkspaceOperation(
    input.current,
    input.kind,
    createWorkspaceIntent(input.kind, input.intentPayload),
    input.createKey,
  );
  if (preparation.kind === 'blocked') return null;

  input.onPending(preparation.operation);
  let outcome: FormalitesPersonnelDraftMutationActionResult;
  try {
    outcome = await input.run(preparation.operation.key);
  } catch {
    outcome = { kind: 'server_error' };
  }
  return {
    operation: settleWorkspaceOperation(preparation.operation, outcome),
    outcome,
  };
}

export function workspaceReloadFailureFeedback(
  result: Exclude<
    LoadFormalitesPersonnelDraftActionResult,
    { kind: 'success' }
  >,
): WorkspaceFeedback {
  switch (result.kind) {
    case 'forbidden':
      return {
        tone: 'danger',
        title: 'Accès refusé',
        description:
          'Votre accès actuel ne permet plus de consulter ou de modifier ce brouillon.',
        recoverable: false,
      };
    case 'not_found':
      return {
        tone: 'danger',
        title: 'Actualisation impossible',
        description: 'Ce dossier n’est plus disponible dans cet établissement.',
        recoverable: false,
      };
    case 'server_error':
      return {
        tone: 'danger',
        title: 'Actualisation impossible',
        description: 'Réessayez dans quelques instants.',
        recoverable: true,
      };
  }
}

/** Loads the authoritative draft model; a rejection becomes `server_error`. */
export async function reloadWorkspaceModel(
  load: () => Promise<LoadFormalitesPersonnelDraftActionResult>,
): Promise<LoadFormalitesPersonnelDraftActionResult> {
  try {
    return await load();
  } catch {
    return { kind: 'server_error' };
  }
}
