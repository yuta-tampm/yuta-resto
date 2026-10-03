import type {
  FormalitesPersonnelDraftMutationOutcome,
  FormalitesPersonnelDraftReadModel,
} from '@yuta/contracts';

/**
 * Local action result for a trusted Formalités or Personnel permission denial
 * (403). It carries no tenant, role or permission detail; login, scope
 * recovery and other authorization failures are never mapped to it.
 */
export type CdiDraftWorkspaceForbiddenResult = { kind: 'forbidden' };

export type LoadFormalitesPersonnelDraftActionResult =
  | { kind: 'success'; model: FormalitesPersonnelDraftReadModel }
  | { kind: 'not_found' }
  | { kind: 'server_error' }
  | CdiDraftWorkspaceForbiddenResult;

export type FormalitesPersonnelDraftMutationActionResult =
  | FormalitesPersonnelDraftMutationOutcome
  | CdiDraftWorkspaceForbiddenResult;
