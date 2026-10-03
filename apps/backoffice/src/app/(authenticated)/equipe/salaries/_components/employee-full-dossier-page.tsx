'use client';

import type { PersonnelEmployeeSummary } from '@yuta/contracts/personnel';
import { Alert, AlertDescription, Button } from '@yuta/ui';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { EmployeeDepartureDialog } from './employee-departure-dialog';
import { EmployeeEditDialog } from './employee-edit-dialog';
import { type DetailTab, EmployeeDetails } from './employee-details';
import { useEmployeeHistory } from './use-employee-history';
import { useEmployeeDossierAccess } from '../_lib/employee-dossier-access';
import {
  getEmployeeEditCommitRefreshPlan,
  restoreEmployeeEditFocus,
} from '../_lib/employee-history-refresh';

export function EmployeeFullDossierPage({
  initialEmployee,
  locale,
  businessDate,
  contractExtractionPrototypeEnabled,
  formalitesReadPrototypeEnabled,
}: {
  initialEmployee: PersonnelEmployeeSummary;
  locale: string;
  businessDate: string;
  contractExtractionPrototypeEnabled: boolean;
  formalitesReadPrototypeEnabled: boolean;
}) {
  const [employee, setEmployee] = useState(initialEmployee);
  const [activeTab, setActiveTab] = useState<DetailTab>('overview');
  const [editing, setEditing] = useState(false);
  const [departureOpen, setDepartureOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const editActionOriginRef = useRef<HTMLElement | null>(null);
  const { dossierAccessError, recordDossierAccess } =
    useEmployeeDossierAccess();
  const accessRecordedEmployeeRef = useRef<string | null>(null);

  const restoreEditFocus = useCallback(() => {
    const origin = editActionOriginRef.current;
    editActionOriginRef.current = null;
    restoreEmployeeEditFocus(origin, (callback) =>
      requestAnimationFrame(callback),
    );
  }, []);

  useEffect(() => {
    if (
      initialEmployee.id !== employee.id ||
      initialEmployee.revision >= employee.revision
    ) {
      setEmployee(initialEmployee);
    }
  }, [employee.id, employee.revision, initialEmployee]);

  useEffect(() => {
    if (accessRecordedEmployeeRef.current === employee.id) return;
    accessRecordedEmployeeRef.current = employee.id;
    recordDossierAccess(employee.id);
  }, [employee.id, recordDossierAccess]);

  const history = useEmployeeHistory(employee.id, activeTab);

  return (
    <div className="grid gap-4">
      <div>
        <Button asChild variant="ghost" size="sm">
          <Link href="/equipe/salaries">
            <ChevronLeft className="h-4 w-4" aria-hidden />
            Retour aux salariés
          </Link>
        </Button>
      </div>
      {successMessage && (
        <Alert tone="success">
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}
      <EmployeeDetails
        employee={employee}
        activeTab={activeTab}
        locale={locale}
        businessDate={businessDate}
        historyState={history.historyState}
        accessHistoryState={history.accessHistoryState}
        accessHistoryPageIndex={history.accessHistoryPageIndex}
        dossierAccessError={dossierAccessError}
        requestDocumentAdd={false}
        focusDeparture={false}
        contractExtractionPrototypeEnabled={contractExtractionPrototypeEnabled}
        formalitesReadPrototypeEnabled={formalitesReadPrototypeEnabled}
        mode="page"
        onTabChange={(tab) => {
          setActiveTab(tab);
          history.openTab(tab);
        }}
        onEdit={(origin) => {
          editActionOriginRef.current = origin;
          setSuccessMessage(null);
          setEditing(true);
        }}
        onDeparture={() => setDepartureOpen(true)}
        onRetryHistory={history.retryHistory}
        onRetryAccessHistory={history.retryAccessHistory}
        onPreviousAccessHistory={history.previousAccessHistory}
        onNextAccessHistory={history.nextAccessHistory}
        onRetryDossierAccess={() => recordDossierAccess(employee.id)}
      />
      {editing && (
        <EmployeeEditDialog
          employee={employee}
          businessDate={businessDate}
          open
          onSaved={(savedEmployee, message) => {
            const refreshPlan = getEmployeeEditCommitRefreshPlan(
              'full_dossier',
              activeTab === 'history',
              () => crypto.randomUUID(),
            );
            setEmployee(savedEmployee);
            history.refreshHistoryAfterSave(
              savedEmployee.id,
              refreshPlan.historyOperationId,
            );
            if (refreshPlan.closeEditor) setEditing(false);
            setSuccessMessage(
              message ?? 'Les modifications ont été enregistrées.',
            );
            restoreEditFocus();
          }}
          onOpenChange={(open) => {
            setEditing(open);
            if (!open) restoreEditFocus();
          }}
        />
      )}
      {departureOpen && (
        <EmployeeDepartureDialog
          employee={employee}
          businessDate={businessDate}
          locale={locale}
          open
          onOpenChange={setDepartureOpen}
        />
      )}
    </div>
  );
}
