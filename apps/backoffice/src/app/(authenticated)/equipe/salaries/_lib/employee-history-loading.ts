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

export const idleEmployeeHistoryState = {
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
