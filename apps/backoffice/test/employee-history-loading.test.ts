import { describe, expect, it, vi } from 'vitest';
import {
  employeeAccessHistoryLoadFailureMessage,
  employeeHistoryLoadFailureMessage,
  firstAccessHistoryCursorState,
  getNextAccessHistoryCursorState,
  getPreviousAccessHistoryCursorState,
  startEmployeeHistoryLoad,
  type EmployeeHistoryLoadResult,
  type EmployeeHistoryLoadingState,
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
