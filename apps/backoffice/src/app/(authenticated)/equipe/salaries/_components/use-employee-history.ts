'use client';

import type {
  PersonnelEmployeeAccessHistory,
  PersonnelEmployeeUnifiedHistory,
} from '@yuta/contracts/personnel';
import { useCallback, useEffect, useReducer } from 'react';
import {
  loadEmployeeAccessHistoryAction,
  loadEmployeeUnifiedHistoryAction,
} from '../actions';
import {
  createEmployeeHistoryScope,
  employeeAccessHistoryLoadFailureMessage,
  employeeHistoryLoadFailureMessage,
  getVisibleEmployeeHistoryScope,
  reduceEmployeeHistoryScope,
  startEmployeeHistoryLoad,
  type EmployeeHistoryScope,
} from '../_lib/employee-history-loading';
import { type DetailTab } from './employee-details';

type EmployeeHistoryState = EmployeeHistoryScope<
  PersonnelEmployeeUnifiedHistory,
  PersonnelEmployeeAccessHistory
>;

function historyTab(tab: DetailTab) {
  return tab === 'history' || tab === 'access' ? tab : null;
}

/**
 * Owns the audited history and access-history loads of one displayed dossier.
 * Operations, cursors and results are scoped to `employeeId`: another
 * employee immediately hides them, cancels their loads and, when a history
 * tab is open, starts that tab with a fresh operation identifier. A load
 * starts only for the active tab and a fresh operation identifier.
 */
export function useEmployeeHistory(
  employeeId: string | null,
  activeTab: DetailTab,
) {
  const [scope, dispatch] = useReducer(
    reduceEmployeeHistoryScope<
      PersonnelEmployeeUnifiedHistory,
      PersonnelEmployeeAccessHistory
    >,
    null,
    createEmployeeHistoryScope<
      PersonnelEmployeeUnifiedHistory,
      PersonnelEmployeeAccessHistory
    >,
  );
  const visible: EmployeeHistoryState = getVisibleEmployeeHistoryScope(
    scope,
    employeeId,
  );
  const historyOperationId =
    activeTab === 'history' ? visible.history.operationId : '';
  const accessOperationId =
    activeTab === 'access' ? visible.access.operationId : '';
  const accessCursor = visible.access.cursorState.cursor;

  useEffect(() => {
    if (scope.employeeId === employeeId) return;
    dispatch({
      type: 'select',
      employeeId,
      openTab: historyTab(activeTab),
      operationId: crypto.randomUUID(),
    });
  }, [activeTab, employeeId, scope.employeeId]);

  useEffect(() => {
    if (!employeeId || !historyOperationId) return;
    return startEmployeeHistoryLoad(
      () => loadEmployeeUnifiedHistoryAction(employeeId, historyOperationId),
      employeeHistoryLoadFailureMessage,
      (state) =>
        dispatch({
          type: 'history_loaded',
          employeeId,
          operationId: historyOperationId,
          state,
        }),
    );
  }, [employeeId, historyOperationId]);

  useEffect(() => {
    if (!employeeId || !accessOperationId) return;
    return startEmployeeHistoryLoad(
      () =>
        loadEmployeeAccessHistoryAction(
          employeeId,
          accessOperationId,
          accessCursor,
        ),
      employeeAccessHistoryLoadFailureMessage,
      (state) =>
        dispatch({
          type: 'access_loaded',
          employeeId,
          operationId: accessOperationId,
          state,
        }),
    );
  }, [accessCursor, accessOperationId, employeeId]);

  const openTab = useCallback((tab: DetailTab) => {
    const openedTab = historyTab(tab);
    if (!openedTab) return;
    dispatch({
      type: 'open',
      tab: openedTab,
      operationId: crypto.randomUUID(),
    });
  }, []);

  const refreshHistoryAfterSave = useCallback(
    (savedEmployeeId: string, operationId: string) => {
      dispatch({
        type: 'refresh_history',
        employeeId: savedEmployeeId,
        operationId,
      });
    },
    [],
  );

  const retryHistory = useCallback(() => {
    dispatch({
      type: 'retry',
      tab: 'history',
      operationId: crypto.randomUUID(),
    });
  }, []);

  const retryAccessHistory = useCallback(() => {
    dispatch({
      type: 'retry',
      tab: 'access',
      operationId: crypto.randomUUID(),
    });
  }, []);

  const previousAccessHistory = useCallback(() => {
    dispatch({ type: 'previous_access', operationId: crypto.randomUUID() });
  }, []);

  const nextAccessHistory = useCallback(() => {
    dispatch({ type: 'next_access', operationId: crypto.randomUUID() });
  }, []);

  return {
    historyState: visible.history.state,
    accessHistoryState: visible.access.state,
    accessHistoryPageIndex: visible.access.cursorState.pageIndex,
    openTab,
    refreshHistoryAfterSave,
    retryHistory,
    retryAccessHistory,
    previousAccessHistory,
    nextAccessHistory,
  };
}
