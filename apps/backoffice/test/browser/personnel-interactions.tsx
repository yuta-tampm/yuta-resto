import { useEmployeeHistory } from '@/app/(authenticated)/equipe/salaries/_components/use-employee-history';
import type { DetailTab } from '@/app/(authenticated)/equipe/salaries/_components/employee-details';
import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import type { FormalitesPersonnelDraftReadModel } from '@yuta/contracts';
import {
  CdiDraftWorkspace,
  type MutateCdiDraftWorkspaceAction,
} from '@/app/(authenticated)/equipe/formalites-personnel/_components/cdi-draft-workspace';

type MutationResult = Awaited<ReturnType<MutateCdiDraftWorkspaceAction>>;
const firstEmployee = '019930d3-2f5d-7d5a-9f96-8f2e25e7c40a';
const secondEmployee = '019930d3-2f5d-7d5a-9f96-8f2e25e7c40b';
const facts = {
  givenNames: 'Synthetic',
  familyName: 'Employee',
  position: 'Serveuse',
  qualification: 'Employée',
  employmentTermType: 'indefinite' as const,
  entryDate: '2026-09-01',
  contractWeeklyMinutes: 2100,
};
function editable(
  revision = 2,
  probationChoice: 'undecided' | 'include' | 'exclude' = 'undecided',
): FormalitesPersonnelDraftReadModel {
  return {
    state: 'editable',
    draftId: '019930d3-41ea-7282-81e4-2bddc527035d',
    formalityType: 'cdi_preparation',
    status: 'draft',
    probationChoice,
    revision,
    draftValues: facts,
    currentPersonnelValues: facts,
    createdAt: '2026-09-05T00:00:00.000Z',
    updatedAt: '2026-09-05T01:00:00.000Z',
  };
}
const pending: Array<{
  resolve: (result: MutationResult) => void;
  reject: (reason: Error) => void;
  model: FormalitesPersonnelDraftReadModel;
}> = [];
const controller = {
  calls: [] as Array<{ kind: string; input: Record<string, unknown> }>,
  refresh: (
    _revision: number,
    _choice: 'undecided' | 'include' | 'exclude',
  ) => {},
  switchEmployee: () => {},
  settle(
    kind: 'reject' | 'success' | 'stale_draft' | 'server_error' | 'forbidden',
  ) {
    const request = pending.shift();
    if (!request) throw Error('No pending synthetic action');
    if (kind === 'reject')
      request.reject(Error('Synthetic transport rejection'));
    else if (kind === 'success')
      request.resolve({ kind, replayed: false, model: request.model });
    else if (kind === 'stale_draft')
      request.resolve({ kind, model: request.model });
    else if (kind === 'forbidden') request.resolve({ kind: 'forbidden' });
    else request.resolve({ kind: 'server_error' });
  },
};
Object.assign(window, { personnelTest: controller });
function Harness() {
  const [employeeId, setEmployeeId] = useState(firstEmployee);
  const [model, setModel] = useState(() => editable());
  controller.refresh = (revision, choice) =>
    setModel(editable(revision, choice));
  controller.switchEmployee = () => {
    setEmployeeId(secondEmployee);
    setModel(editable(5, 'exclude'));
  };
  function mutation(kind: string): MutateCdiDraftWorkspaceAction {
    return (input) => {
      if (!input || typeof input !== 'object')
        throw Error('Invalid fixture command');
      const command = { ...input };
      controller.calls.push({ kind, input: command });
      const choice =
        'probationChoice' in command &&
        (command.probationChoice === 'include' ||
          command.probationChoice === 'exclude')
          ? command.probationChoice
          : 'undecided';
      return new Promise((resolve, reject) =>
        pending.push({ resolve, reject, model: editable(3, choice) }),
      );
    };
  }
  return (
    <CdiDraftWorkspace
      employeeId={employeeId}
      employeeName={
        employeeId === firstEmployee ? 'Employee One' : 'Employee Two'
      }
      initialModel={model}
      employeeDossierHref="/equipe/salaries/fixture"
      locale="fr-FR"
      createAction={mutation('create')}
      saveAction={mutation('save')}
      reconcileAction={mutation('reconcile')}
      abandonAction={mutation('abandon')}
      loadAction={async () => ({ kind: 'success', model: editable(3) })}
    />
  );
}
type AccessResult =
  import('@/app/(authenticated)/equipe/salaries/actions').LoadEmployeeAccessHistoryActionResult;
type UnifiedResult =
  import('@/app/(authenticated)/equipe/salaries/actions').LoadEmployeeUnifiedHistoryActionResult;
type HistoryCall = {
  employeeId: string;
  operationId: string;
  cursor?: string;
  kind: 'access' | 'history';
};
const historyPending: Array<{
  call: HistoryCall;
  resolve: (result: AccessResult | UnifiedResult) => void;
  reject: (error: Error) => void;
}> = [];
const historyController = {
  calls: [] as HistoryCall[],
  renders: [] as Array<{ employeeId: string; access: string; history: string }>,
  switchEmployee: () => {},
  settle(index: number, outcome: 'success' | 'error' | 'reject' = 'success') {
    const request = historyPending[index];
    if (!request) throw Error('Missing synthetic history request');
    if (outcome === 'reject') {
      request.reject(Error('Synthetic history transport failure'));
      return;
    }
    if (outcome === 'error') {
      request.resolve({ status: 'error', message: 'Accès refusé.' });
      return;
    }
    if (request.call.kind === 'history') {
      request.resolve({
        status: 'success',
        history: {
          items: [],
          truncated: request.call.employeeId === firstEmployee,
        },
      });
      return;
    }
    request.resolve({
      status: 'success',
      history: {
        items: [
          {
            id: request.call.employeeId,
            eventType: 'employee.dossier_viewed',
            actorDisplayName:
              request.call.employeeId === firstEmployee
                ? 'OLD EMPLOYEE'
                : 'NEW EMPLOYEE',
            occurredAt: '2026-10-03T00:00:00.000Z',
          },
        ],
        pageInfo: {
          hasMore: true,
          nextCursor:
            request.call.employeeId === firstEmployee
              ? 'cursor-old'
              : 'cursor-new',
        },
      },
    });
  },
};
Object.assign(window, { personnelHistoryTest: historyController });
export function loadEmployeeAccessHistoryAction(
  employeeId: string,
  operationId: string,
  cursor?: string,
): Promise<AccessResult> {
  const call: HistoryCall = { employeeId, operationId, cursor, kind: 'access' };
  historyController.calls.push(call);
  return new Promise((resolve, reject) =>
    historyPending.push({
      call,
      resolve: (result) => resolve(result as AccessResult),
      reject,
    }),
  );
}
export function loadEmployeeUnifiedHistoryAction(
  employeeId: string,
  operationId: string,
): Promise<UnifiedResult> {
  const call: HistoryCall = { employeeId, operationId, kind: 'history' };
  historyController.calls.push(call);
  return new Promise((resolve, reject) =>
    historyPending.push({
      call,
      resolve: (result) => resolve(result as UnifiedResult),
      reject,
    }),
  );
}
function HistoryHarness() {
  const [employeeId, setEmployeeId] = useState(firstEmployee);
  const [tab, setTab] = useState<DetailTab>('overview');
  const history = useEmployeeHistory(employeeId, tab);
  historyController.switchEmployee = () => setEmployeeId(secondEmployee);
  historyController.renders.push({
    employeeId,
    access: JSON.stringify(history.accessHistoryState),
    history: JSON.stringify(history.historyState),
  });
  return (
    <>
      <button
        onClick={() => {
          setTab('access');
          history.openTab('access');
        }}
      >
        Access
      </button>
      <button
        onClick={() => {
          setTab('history');
          history.openTab('history');
        }}
      >
        History
      </button>
      <button onClick={history.nextAccessHistory}>Next</button>
      <button onClick={history.previousAccessHistory}>Previous</button>
      <button onClick={history.retryAccessHistory}>Retry Access</button>
      <button onClick={history.retryHistory}>Retry History</button>
      <pre data-testid="access-state">
        {JSON.stringify(history.accessHistoryState)}
      </pre>
      <pre data-testid="history-state">
        {JSON.stringify(history.historyState)}
      </pre>
      <span data-testid="access-page">{history.accessHistoryPageIndex}</span>
    </>
  );
}

const container = document.getElementById('root');
if (!container) throw Error('Missing browser fixture root');
createRoot(container).render(
  new URLSearchParams(window.location.search).get('surface') === 'history' ? (
    <HistoryHarness />
  ) : (
    <Harness />
  ),
);
