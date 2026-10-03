export type EmployeeHistoryLoadResult<THistory> =
  | { status: 'success'; history: THistory }
  | { status: 'error'; message: string };

export type EmployeeHistoryLoadingState<THistory> =
  | { status: 'idle' | 'loading'; history: null; message: null }
  | { status: 'success'; history: THistory; message: null }
  | { status: 'error'; history: null; message: string };

export const employeeHistoryLoadFailureMessage =
  'Impossible de charger l’historique. Réessayez.';
export const employeeAccessHistoryLoadFailureMessage =
  'Impossible de charger les consultations. Réessayez.';

const idleEmployeeHistoryState = {
  status: 'idle',
  history: null,
  message: null,
} as const;

/**
 * Starts one audited history request and returns its cancellation. Results
 * that settle after cancellation are ignored so a stale response never
 * replaces the state of a newer operation, tab or employee.
 */
export function startEmployeeHistoryLoad<THistory>(
  load: () => Promise<EmployeeHistoryLoadResult<THistory>>,
  failureMessage: string,
  setState: (state: EmployeeHistoryLoadingState<THistory>) => void,
): () => void {
  let active = true;
  setState({ status: 'loading', history: null, message: null });
  void load()
    .then((result) => {
      if (!active) return;
      setState(
        result.status === 'success'
          ? { status: 'success', history: result.history, message: null }
          : { status: 'error', history: null, message: result.message },
      );
    })
    .catch(() => {
      if (!active) return;
      setState({ status: 'error', history: null, message: failureMessage });
    });
  return () => {
    active = false;
  };
}

export type AccessHistoryCursorState = {
  cursor: string | undefined;
  cursorStack: string[];
  pageIndex: number;
};

export const firstAccessHistoryCursorState: AccessHistoryCursorState = {
  cursor: undefined,
  cursorStack: [''],
  pageIndex: 0,
};

export function getPreviousAccessHistoryCursorState(
  current: AccessHistoryCursorState,
): AccessHistoryCursorState {
  const pageIndex = Math.max(0, current.pageIndex - 1);
  return {
    cursor: current.cursorStack[pageIndex] || undefined,
    cursorStack: current.cursorStack,
    pageIndex,
  };
}

export function getNextAccessHistoryCursorState(
  current: AccessHistoryCursorState,
  nextCursor: string | null,
): AccessHistoryCursorState | null {
  if (!nextCursor) return null;
  const pageIndex = current.pageIndex + 1;
  return {
    cursor: nextCursor,
    cursorStack: [...current.cursorStack.slice(0, pageIndex), nextCursor],
    pageIndex,
  };
}

export type EmployeeHistoryTab = 'history' | 'access';

type EmployeeHistoryRequest<THistory> = {
  operationId: string;
  state: EmployeeHistoryLoadingState<THistory>;
};

/**
 * History and access-history requests of exactly one employee. An empty
 * operation identifier means no request; every request uses a fresh one.
 */
export type EmployeeHistoryScope<THistory, TAccessHistory> = {
  employeeId: string | null;
  history: EmployeeHistoryRequest<THistory>;
  access: EmployeeHistoryRequest<TAccessHistory> & {
    cursorState: AccessHistoryCursorState;
  };
};

type PagedAccessHistory = { pageInfo: { nextCursor: string | null } };

export type EmployeeHistoryCommand<THistory, TAccessHistory> =
  | {
      type: 'select';
      employeeId: string | null;
      openTab: EmployeeHistoryTab | null;
      operationId: string;
    }
  | { type: 'open' | 'retry'; tab: EmployeeHistoryTab; operationId: string }
  | { type: 'previous_access' | 'next_access'; operationId: string }
  | { type: 'refresh_history'; employeeId: string; operationId: string }
  | {
      type: 'history_loaded';
      employeeId: string;
      operationId: string;
      state: EmployeeHistoryLoadingState<THistory>;
    }
  | {
      type: 'access_loaded';
      employeeId: string;
      operationId: string;
      state: EmployeeHistoryLoadingState<TAccessHistory>;
    };

export function createEmployeeHistoryScope<THistory, TAccessHistory>(
  employeeId: string | null,
): EmployeeHistoryScope<THistory, TAccessHistory> {
  return {
    employeeId,
    history: { operationId: '', state: idleEmployeeHistoryState },
    access: {
      operationId: '',
      cursorState: firstAccessHistoryCursorState,
      state: idleEmployeeHistoryState,
    },
  };
}

/**
 * A scope that belongs to another employee is never displayed, so a changed
 * employee shows no previous history before its own scope is selected.
 */
export function getVisibleEmployeeHistoryScope<THistory, TAccessHistory>(
  scope: EmployeeHistoryScope<THistory, TAccessHistory>,
  employeeId: string | null,
): EmployeeHistoryScope<THistory, TAccessHistory> {
  return scope.employeeId === employeeId
    ? scope
    : createEmployeeHistoryScope(employeeId);
}

/**
 * Selecting another employee discards every operation, cursor and result of
 * the previous one; only the open history tab receives a fresh operation.
 * Results are kept only for the current employee and operation, so late
 * completions of cancelled, retried or other-employee requests are ignored.
 */
export function reduceEmployeeHistoryScope<
  THistory,
  TAccessHistory extends PagedAccessHistory,
>(
  scope: EmployeeHistoryScope<THistory, TAccessHistory>,
  command: EmployeeHistoryCommand<THistory, TAccessHistory>,
): EmployeeHistoryScope<THistory, TAccessHistory> {
  switch (command.type) {
    case 'select': {
      if (command.employeeId === scope.employeeId) return scope;
      const selected = createEmployeeHistoryScope<THistory, TAccessHistory>(
        command.employeeId,
      );
      return command.employeeId && command.openTab
        ? reduceEmployeeHistoryScope(selected, {
            type: 'open',
            tab: command.openTab,
            operationId: command.operationId,
          })
        : selected;
    }
    case 'open':
    case 'retry':
      if (command.tab === 'history') {
        return {
          ...scope,
          history: {
            operationId: command.operationId,
            state: idleEmployeeHistoryState,
          },
        };
      }
      return {
        ...scope,
        access: {
          operationId: command.operationId,
          cursorState:
            command.type === 'open'
              ? firstAccessHistoryCursorState
              : scope.access.cursorState,
          state: idleEmployeeHistoryState,
        },
      };
    case 'previous_access':
      return {
        ...scope,
        access: {
          operationId: command.operationId,
          cursorState: getPreviousAccessHistoryCursorState(
            scope.access.cursorState,
          ),
          state: idleEmployeeHistoryState,
        },
      };
    case 'next_access': {
      const next = getNextAccessHistoryCursorState(
        scope.access.cursorState,
        scope.access.state.status === 'success'
          ? scope.access.state.history.pageInfo.nextCursor
          : null,
      );
      if (!next) return scope;
      return {
        ...scope,
        access: {
          operationId: command.operationId,
          cursorState: next,
          state: idleEmployeeHistoryState,
        },
      };
    }
    case 'refresh_history':
      if (command.employeeId !== scope.employeeId) return scope;
      return {
        ...scope,
        history: {
          operationId: command.operationId,
          state: idleEmployeeHistoryState,
        },
      };
    case 'history_loaded':
      if (
        command.employeeId !== scope.employeeId ||
        command.operationId !== scope.history.operationId
      ) {
        return scope;
      }
      return { ...scope, history: { ...scope.history, state: command.state } };
    case 'access_loaded':
      if (
        command.employeeId !== scope.employeeId ||
        command.operationId !== scope.access.operationId
      ) {
        return scope;
      }
      return { ...scope, access: { ...scope.access, state: command.state } };
  }
}
