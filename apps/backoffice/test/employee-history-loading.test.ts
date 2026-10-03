import { describe, expect, it, vi } from 'vitest';
import {
  createEmployeeHistoryScope,
  employeeAccessHistoryLoadFailureMessage,
  employeeHistoryLoadFailureMessage,
  firstAccessHistoryCursorState,
  getNextAccessHistoryCursorState,
  getPreviousAccessHistoryCursorState,
  getVisibleEmployeeHistoryScope,
  reduceEmployeeHistoryScope,
  startEmployeeHistoryLoad,
  type EmployeeHistoryCommand,
  type EmployeeHistoryLoadResult,
  type EmployeeHistoryLoadingState,
  type EmployeeHistoryScope,
} from '../src/app/(authenticated)/equipe/salaries/_lib/employee-history-loading';

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((onResolve, onReject) => {
    resolve = onResolve;
    reject = onReject;
  });
  return { promise, resolve, reject };
}

async function settle() {
  await new Promise((resolve) => setTimeout(resolve, 0));
}

describe('employee history loading', () => {
  it('shows loading, then the loaded history', async () => {
    const request = deferred<EmployeeHistoryLoadResult<string>>();
    const states: EmployeeHistoryLoadingState<string>[] = [];

    startEmployeeHistoryLoad(
      () => request.promise,
      employeeHistoryLoadFailureMessage,
      (state) => states.push(state),
    );
    expect(states).toEqual([
      { status: 'loading', history: null, message: null },
    ]);

    request.resolve({ status: 'success', history: 'page-1' });
    await settle();
    expect(states.at(-1)).toEqual({
      status: 'success',
      history: 'page-1',
      message: null,
    });
  });

  it('keeps the safe server error message', async () => {
    const states: EmployeeHistoryLoadingState<string>[] = [];

    startEmployeeHistoryLoad<string>(
      async () => ({ status: 'error', message: 'Accès refusé.' }),
      employeeHistoryLoadFailureMessage,
      (state) => states.push(state),
    );
    await settle();

    expect(states.at(-1)).toEqual({
      status: 'error',
      history: null,
      message: 'Accès refusé.',
    });
  });

  it('recovers a rejected request with the retryable French message', async () => {
    const states: EmployeeHistoryLoadingState<string>[] = [];

    startEmployeeHistoryLoad<string>(
      () => Promise.reject(new Error('network')),
      employeeAccessHistoryLoadFailureMessage,
      (state) => states.push(state),
    );
    await settle();

    expect(states.at(-1)).toEqual({
      status: 'error',
      history: null,
      message: 'Impossible de charger les consultations. Réessayez.',
    });
  });

  it('ignores stale responses and rejections after cancellation', async () => {
    const staleSuccess = deferred<EmployeeHistoryLoadResult<string>>();
    const staleFailure = deferred<EmployeeHistoryLoadResult<string>>();
    const setState = vi.fn();

    const cancelSuccess = startEmployeeHistoryLoad(
      () => staleSuccess.promise,
      employeeHistoryLoadFailureMessage,
      setState,
    );
    const cancelFailure = startEmployeeHistoryLoad(
      () => staleFailure.promise,
      employeeHistoryLoadFailureMessage,
      setState,
    );
    cancelSuccess();
    cancelFailure();
    staleSuccess.resolve({ status: 'success', history: 'stale' });
    staleFailure.reject(new Error('stale'));
    await settle();

    expect(setState).toHaveBeenCalledTimes(2);
    expect(setState).toHaveBeenNthCalledWith(1, {
      status: 'loading',
      history: null,
      message: null,
    });
    expect(setState).toHaveBeenNthCalledWith(2, {
      status: 'loading',
      history: null,
      message: null,
    });
  });

  it('moves through access-history pages with the cursor stack', () => {
    const second = getNextAccessHistoryCursorState(
      firstAccessHistoryCursorState,
      'cursor-2',
    );
    expect(second).toEqual({
      cursor: 'cursor-2',
      cursorStack: ['', 'cursor-2'],
      pageIndex: 1,
    });

    const third = getNextAccessHistoryCursorState(second!, 'cursor-3');
    expect(third).toEqual({
      cursor: 'cursor-3',
      cursorStack: ['', 'cursor-2', 'cursor-3'],
      pageIndex: 2,
    });

    const backToSecond = getPreviousAccessHistoryCursorState(third!);
    expect(backToSecond).toEqual({
      cursor: 'cursor-2',
      cursorStack: ['', 'cursor-2', 'cursor-3'],
      pageIndex: 1,
    });

    const firstAgain = getPreviousAccessHistoryCursorState(backToSecond);
    expect(firstAgain).toEqual({
      cursor: undefined,
      cursorStack: ['', 'cursor-2', 'cursor-3'],
      pageIndex: 0,
    });
    expect(getPreviousAccessHistoryCursorState(firstAgain).pageIndex).toBe(0);

    expect(getNextAccessHistoryCursorState(firstAgain, 'cursor-2b')).toEqual({
      cursor: 'cursor-2b',
      cursorStack: ['', 'cursor-2b'],
      pageIndex: 1,
    });
  });

  it('does not advance without a next cursor', () => {
    expect(
      getNextAccessHistoryCursorState(firstAccessHistoryCursorState, null),
    ).toBeNull();
  });
});

type AccessPage = {
  page: string;
  pageInfo: { nextCursor: string | null };
};
type Scope = EmployeeHistoryScope<string, AccessPage>;
type Command = EmployeeHistoryCommand<string, AccessPage>;

const idle = { status: 'idle', history: null, message: null } as const;

function apply(scope: Scope, ...commands: Command[]): Scope {
  return commands.reduce(reduceEmployeeHistoryScope<string, AccessPage>, scope);
}

function accessPage(page: string, nextCursor: string | null) {
  return {
    status: 'success',
    history: { page, pageInfo: { nextCursor } },
    message: null,
  } as const;
}

function select(
  employeeId: string | null,
  openTab: 'history' | 'access' | null,
  operationId: string,
): Command {
  return { type: 'select', employeeId, openTab, operationId };
}

/** Employee A on the second access page with a loaded history. */
function employeeAOnSecondAccessPage(): Scope {
  return apply(
    createEmployeeHistoryScope<string, AccessPage>(null),
    select('employee-a', null, 'unused'),
    { type: 'open', tab: 'history', operationId: 'a-history' },
    {
      type: 'history_loaded',
      employeeId: 'employee-a',
      operationId: 'a-history',
      state: { status: 'success', history: 'a-history', message: null },
    },
    { type: 'open', tab: 'access', operationId: 'a-access-1' },
    {
      type: 'access_loaded',
      employeeId: 'employee-a',
      operationId: 'a-access-1',
      state: accessPage('a-1', 'a-cursor-2'),
    },
    { type: 'next_access', operationId: 'a-access-2' },
    {
      type: 'access_loaded',
      employeeId: 'employee-a',
      operationId: 'a-access-2',
      state: accessPage('a-2', null),
    },
  );
}

describe('employee-scoped history requests', () => {
  it('hides another employee’s results before its own scope is selected', () => {
    const scope = employeeAOnSecondAccessPage();

    expect(getVisibleEmployeeHistoryScope(scope, 'employee-a')).toBe(scope);
    expect(getVisibleEmployeeHistoryScope(scope, 'employee-b')).toEqual({
      employeeId: 'employee-b',
      history: { operationId: '', state: idle },
      access: {
        operationId: '',
        cursorState: firstAccessHistoryCursorState,
        state: idle,
      },
    });
  });

  it('starts the open tab of a new employee with a fresh operation and no old cursor', () => {
    const scope = employeeAOnSecondAccessPage();
    expect(scope.access.cursorState.cursor).toBe('a-cursor-2');

    const onAccess = apply(scope, select('employee-b', 'access', 'b-access'));
    expect(onAccess).toEqual({
      employeeId: 'employee-b',
      history: { operationId: '', state: idle },
      access: {
        operationId: 'b-access',
        cursorState: firstAccessHistoryCursorState,
        state: idle,
      },
    });

    const onHistory = apply(scope, select('employee-b', 'history', 'b-hist'));
    expect(onHistory.history).toEqual({ operationId: 'b-hist', state: idle });
    expect(onHistory.access.operationId).toBe('');

    const onOverview = apply(scope, select('employee-b', null, 'unused'));
    expect(onOverview).toEqual(createEmployeeHistoryScope('employee-b'));
  });

  it('clears every request when no employee is selected', () => {
    expect(
      apply(employeeAOnSecondAccessPage(), select(null, 'history', 'unused')),
    ).toEqual(createEmployeeHistoryScope(null));
  });

  it('keeps the current scope when the same employee is selected again', () => {
    const scope = employeeAOnSecondAccessPage();
    expect(apply(scope, select('employee-a', 'access', 'ignored'))).toBe(scope);
  });

  it('ignores late completions of a previous employee or operation', () => {
    const scope = apply(
      employeeAOnSecondAccessPage(),
      select('employee-b', 'access', 'b-access'),
    );
    const late = apply(
      scope,
      {
        type: 'history_loaded',
        employeeId: 'employee-a',
        operationId: 'a-history',
        state: { status: 'success', history: 'a-stale', message: null },
      },
      {
        type: 'access_loaded',
        employeeId: 'employee-a',
        operationId: 'b-access',
        state: accessPage('a-stale', 'a-cursor-stale'),
      },
      {
        type: 'access_loaded',
        employeeId: 'employee-b',
        operationId: 'a-access-2',
        state: accessPage('b-stale', null),
      },
    );
    expect(late).toBe(scope);

    const loaded = apply(scope, {
      type: 'access_loaded',
      employeeId: 'employee-b',
      operationId: 'b-access',
      state: accessPage('b-1', null),
    });
    expect(loaded.access.state).toEqual(accessPage('b-1', null));
  });

  it('ignores a pending completion after a retry replaced its operation', () => {
    const failed = apply(
      createEmployeeHistoryScope<string, AccessPage>('employee-a'),
      { type: 'open', tab: 'history', operationId: 'first' },
      {
        type: 'history_loaded',
        employeeId: 'employee-a',
        operationId: 'first',
        state: { status: 'error', history: null, message: 'Accès refusé.' },
      },
    );
    expect(failed.history.state).toEqual({
      status: 'error',
      history: null,
      message: 'Accès refusé.',
    });

    const retried = apply(failed, {
      type: 'retry',
      tab: 'history',
      operationId: 'second',
    });
    expect(retried.history).toEqual({ operationId: 'second', state: idle });
    expect(
      apply(retried, {
        type: 'history_loaded',
        employeeId: 'employee-a',
        operationId: 'first',
        state: { status: 'success', history: 'stale', message: null },
      }),
    ).toBe(retried);
  });

  it('retries a failed access page on the same cursor with a fresh operation', () => {
    const failed = apply(employeeAOnSecondAccessPage(), {
      type: 'access_loaded',
      employeeId: 'employee-a',
      operationId: 'a-access-2',
      state: {
        status: 'error',
        history: null,
        message: employeeAccessHistoryLoadFailureMessage,
      },
    });

    const retried = apply(failed, {
      type: 'retry',
      tab: 'access',
      operationId: 'a-access-retry',
    });
    expect(retried.access).toEqual({
      operationId: 'a-access-retry',
      cursorState: failed.access.cursorState,
      state: idle,
    });
    expect(retried.access.cursorState.cursor).toBe('a-cursor-2');
  });

  it('keeps same-employee paging and restarts from the first page on reopen', () => {
    const second = employeeAOnSecondAccessPage();
    expect(second.access.cursorState).toEqual({
      cursor: 'a-cursor-2',
      cursorStack: ['', 'a-cursor-2'],
      pageIndex: 1,
    });
    expect(second.access.state).toEqual(accessPage('a-2', null));

    expect(apply(second, { type: 'next_access', operationId: 'none' })).toBe(
      second,
    );

    const first = apply(second, {
      type: 'previous_access',
      operationId: 'a-access-3',
    });
    expect(first.access).toEqual({
      operationId: 'a-access-3',
      cursorState: {
        cursor: undefined,
        cursorStack: ['', 'a-cursor-2'],
        pageIndex: 0,
      },
      state: idle,
    });

    const reopened = apply(second, {
      type: 'open',
      tab: 'access',
      operationId: 'a-access-reopen',
    });
    expect(reopened.access).toEqual({
      operationId: 'a-access-reopen',
      cursorState: firstAccessHistoryCursorState,
      state: idle,
    });
    expect(reopened.history).toBe(second.history);
  });

  it('refreshes history after a save only for the displayed employee', () => {
    const scope = employeeAOnSecondAccessPage();

    expect(
      apply(scope, {
        type: 'refresh_history',
        employeeId: 'employee-b',
        operationId: 'b-refresh',
      }),
    ).toBe(scope);

    const refreshed = apply(scope, {
      type: 'refresh_history',
      employeeId: 'employee-a',
      operationId: 'a-refresh',
    });
    expect(refreshed.history).toEqual({
      operationId: 'a-refresh',
      state: idle,
    });
    expect(refreshed.access).toBe(scope.access);

    const inactive = apply(scope, {
      type: 'refresh_history',
      employeeId: 'employee-a',
      operationId: '',
    });
    expect(inactive.history).toEqual({ operationId: '', state: idle });
  });
});
