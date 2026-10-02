import type { CdiDraftConnectedReadModel } from '../_lib/cdi-draft-connected-read-model';
import {
  CdiDraftWorkspace,
  type LoadCdiDraftWorkspaceAction,
  type MutateCdiDraftWorkspaceAction,
} from './cdi-draft-workspace';
import { CdiDraftReadinessPrototype } from './cdi-draft-readiness-prototype';

export function CdiDraftConnectedReadPrototype({
  model,
  employeeDossierHref,
  employeeId,
  locale = 'fr-FR',
  loadAction,
  createAction,
  saveAction,
  reconcileAction,
  abandonAction,
}: {
  model: CdiDraftConnectedReadModel;
  employeeDossierHref: string;
  employeeId?: string;
  locale?: string;
  loadAction?: LoadCdiDraftWorkspaceAction;
  createAction?: MutateCdiDraftWorkspaceAction;
  saveAction?: MutateCdiDraftWorkspaceAction;
  reconcileAction?: MutateCdiDraftWorkspaceAction;
  abandonAction?: MutateCdiDraftWorkspaceAction;
}) {
  if (
    model.draftModel &&
    employeeId &&
    loadAction &&
    createAction &&
    saveAction &&
    reconcileAction &&
    abandonAction
  ) {
    return (
      <CdiDraftWorkspace
        employeeId={employeeId}
        employeeName={model.employeeName}
        initialModel={model.draftModel}
        employeeDossierHref={employeeDossierHref}
        locale={locale}
        loadAction={loadAction}
        createAction={createAction}
        saveAction={saveAction}
        reconcileAction={reconcileAction}
        abandonAction={abandonAction}
      />
    );
  }

  return (
    <CdiDraftReadinessPrototype
      data={{
        fictionalEmployee: model.employeeName,
        reusableFields: model.fields,
      }}
      connectedEmployeeDossierHref={employeeDossierHref}
    />
  );
}
