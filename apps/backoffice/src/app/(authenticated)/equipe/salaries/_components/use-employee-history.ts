'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  loadEmployeeAccessHistoryAction,
  loadEmployeeUnifiedHistoryAction,
} from '../actions';
import {
  employeeAccessHistoryLoadFailureMessage,
  employeeHistoryLoadFailureMessage,
  firstAccessHistoryCursorState,
  getNextAccessHistoryCursorState,
  getPreviousAccessHistoryCursorState,
  idleEmployeeHistoryState,
  startEmployeeHistoryLoad,
} from '../_lib/employee-history-loading';
import { type AccessHistoryLoadState } from './employee-access-history';
import { type DetailTab } from './employee-details';
import { type EmployeeHistoryLoadState } from './employee-history';

/**
 * Owns the audited history and access-history loads of one displayed dossier.
 * A load starts only for the active tab and a fresh operation identifier;
 * clearing the identifier stops loading without starting a new audit trace.
 */
export function useEmployeeHistory(
  employeeId: string | null,
  activeTab: DetailTab,
) {
  const [historyState, setHistoryState] = useState<EmployeeHistoryLoadState>(
    idleEmployeeHistoryState,
  );
  const [historyOperationId, setHistoryOperationId] = useState('');
  const [accessHistoryState, setAccessHistoryState] =
    useState<AccessHistoryLoadState>(idleEmployeeHistoryState);
  const [accessHistoryOperationId, setAccessHistoryOperationId] = useState('');
  const [accessHistoryCursorState, setAccessHistoryCursorState] = useState(
    firstAccessHistoryCursorState,
  );
  const accessHistoryCursor = accessHistoryCursorState.cursor;

  useEffect(() => {
    if (activeTab !== 'history' || !employeeId || !historyOperationId) return;
    return startEmployeeHistoryLoad(
      () => loadEmployeeUnifiedHistoryAction(employeeId, historyOperationId),
      employeeHistoryLoadFailureMessage,
      setHistoryState,
    );
  }, [activeTab, employeeId, historyOperationId]);

  useEffect(() => {
    if (activeTab !== 'access' || !employeeId || !accessHistoryOperationId) {
      return;
    }
    return startEmployeeHistoryLoad(
      () =>
        loadEmployeeAccessHistoryAction(
          employeeId,
          accessHistoryOperationId,
          accessHistoryCursor,
        ),
      employeeAccessHistoryLoadFailureMessage,
      setAccessHistoryState,
    );
  }, [accessHistoryCursor, accessHistoryOperationId, activeTab, employeeId]);

  const resetHistory = useCallback(() => {
    setHistoryOperationId('');
    setHistoryState(idleEmployeeHistoryState);
    setAccessHistoryOperationId('');
    setAccessHistoryCursorState(firstAccessHistoryCursorState);
    setAccessHistoryState(idleEmployeeHistoryState);
  }, []);

  const openTab = useCallback((tab: DetailTab) => {
    if (tab === 'history') {
      setHistoryOperationId(crypto.randomUUID());
    }
    if (tab === 'access') {
      setAccessHistoryCursorState(firstAccessHistoryCursorState);
      setAccessHistoryOperationId(crypto.randomUUID());
    }
  }, []);

  const refreshHistoryAfterSave = useCallback((operationId: string) => {
    setHistoryState(idleEmployeeHistoryState);
    setHistoryOperationId(operationId);
  }, []);

  function retryHistory() {
    setHistoryOperationId(crypto.randomUUID());
  }

  function retryAccessHistory() {
    setAccessHistoryOperationId(crypto.randomUUID());
  }

  function previousAccessHistory() {
    setAccessHistoryCursorState(
      getPreviousAccessHistoryCursorState(accessHistoryCursorState),
    );
    setAccessHistoryOperationId(crypto.randomUUID());
  }

  function nextAccessHistory() {
    const next = getNextAccessHistoryCursorState(
      accessHistoryCursorState,
      accessHistoryState.status === 'success'
        ? accessHistoryState.history.pageInfo.nextCursor
        : null,
    );
    if (!next) return;
    setAccessHistoryCursorState(next);
    setAccessHistoryOperationId(crypto.randomUUID());
  }

  return {
    historyState,
    accessHistoryState,
    accessHistoryPageIndex: accessHistoryCursorState.pageIndex,
    openTab,
    resetHistory,
    refreshHistoryAfterSave,
    retryHistory,
    retryAccessHistory,
    previousAccessHistory,
    nextAccessHistory,
  };
}
