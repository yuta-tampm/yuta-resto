'use client';

import type { PersonnelEmployeeSummary } from '@yuta/contracts/personnel';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  cn,
} from '@yuta/ui';
import {
  BadgeCheck,
  BriefcaseBusiness,
  CheckCircle2,
  CalendarDays,
  CalendarX2,
  Clock3,
  FileWarning,
  ExternalLink,
  FileText,
  Pencil,
  RotateCcw,
  GraduationCap,
  IdCard,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { EmployeeDocuments } from './employee-documents';
import { EmployeeEmploymentDetails } from './employee-employment-details';
import {
  EmployeeHistory,
  type EmployeeHistoryLoadState,
} from './employee-history';
import {
  formatEmployeeDate,
  getContractSummary,
  getEmployeeDossierHref,
  getEmployeeName,
  getWorkTimeLabel,
  isEmployeeComplete,
} from '../salaries-model';
import {
  type AccessHistoryLoadState,
  EmployeeAccessHistory,
} from './employee-access-history';
import {
  OverviewFact,
  DetailSection,
  EmployeeAvatar,
  CompletenessBadge,
  EmploymentBadge,
} from './employee-presentation';

export type DetailTab =
  | 'overview'
  | 'identity'
  | 'employment'
  | 'history'
  | 'access'
  | 'documents';

export type EmployeeDetailsMode = 'dialog' | 'page';

export function EmployeeDetails({
  employee,
  activeTab,
  locale,
  businessDate,
  onTabChange,
  onClose,
  onEdit,
  onDeparture,
  historyState,
  accessHistoryState,
  accessHistoryPageIndex,
  dossierAccessError,
  onRetryHistory,
  onRetryAccessHistory,
  onPreviousAccessHistory,
  onNextAccessHistory,
  onRetryDossierAccess,
  requestDocumentAdd,
  focusDeparture,
  contractExtractionPrototypeEnabled,
  formalitesReadPrototypeEnabled = false,
  mode = 'dialog',
}: {
  employee: PersonnelEmployeeSummary;
  activeTab: DetailTab;
  locale: string;
  businessDate: string;
  onTabChange: (tab: DetailTab) => void;
  onClose?: () => void;
  onEdit: (origin: HTMLElement) => void;
  onDeparture: () => void;
  historyState: EmployeeHistoryLoadState;
  accessHistoryState: AccessHistoryLoadState;
  accessHistoryPageIndex: number;
  dossierAccessError: string | null;
  onRetryHistory: () => void;
  onRetryAccessHistory: () => void;
  onPreviousAccessHistory: () => void;
  onNextAccessHistory: () => void;
  onRetryDossierAccess: () => void;
  requestDocumentAdd: boolean;
  focusDeparture: boolean;
  contractExtractionPrototypeEnabled: boolean;
  formalitesReadPrototypeEnabled?: boolean;
  mode?: EmployeeDetailsMode;
}) {
  const departureFactRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (activeTab === 'overview' && focusDeparture) {
      departureFactRef.current?.focus();
    }
  }, [activeTab, focusDeparture]);
  const tabs: ReadonlyArray<{ value: DetailTab; label: string }> = [
    { value: 'overview', label: 'Vue d’ensemble' },
    { value: 'identity', label: 'Identité' },
    { value: 'employment', label: 'Relation de travail' },
    { value: 'history', label: 'Historique' },
    { value: 'access', label: 'Consultations' },
    { value: 'documents', label: 'Documents' },
  ];
  const content = (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex flex-col gap-5 border-b border-border-default bg-surface p-5 pr-14 sm:flex-row sm:items-center sm:justify-between sm:p-6 sm:pr-14">
        <div className="flex min-w-0 items-center gap-3">
          <EmployeeAvatar employee={employee} large />
          <div className="min-w-0">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">
              Dossier salarié
            </p>
            {mode === 'dialog' ? (
              <DialogTitle asChild>
                <h2 className="truncate text-xl font-black">
                  {getEmployeeName(employee)}
                </h2>
              </DialogTitle>
            ) : (
              <h1 className="truncate text-2xl font-black">
                {getEmployeeName(employee)}
              </h1>
            )}
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <p className="text-sm font-medium text-secondary">
                {employee.position}
              </p>
              <EmploymentBadge
                employee={employee}
                businessDate={businessDate}
              />
            </div>
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-1 sm:justify-end">
          {mode === 'dialog' && (
            <Button asChild type="button" variant="ghost" size="sm">
              <Link href={getEmployeeDossierHref(employee.id)}>
                <ExternalLink className="h-4 w-4" aria-hidden />
                Ouvrir le dossier complet
              </Link>
            </Button>
          )}
          {mode === 'page' && formalitesReadPrototypeEnabled ? (
            <Button asChild type="button" variant="secondary" size="sm">
              <Link href={`/equipe/formalites-personnel/${employee.id}`}>
                <FileText className="h-4 w-4" aria-hidden />
                Préparer un projet CDI
              </Link>
            </Button>
          ) : null}
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={(event) => onEdit(event.currentTarget)}
          >
            <Pencil className="h-4 w-4" aria-hidden />
            Modifier
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={onDeparture}>
            <CalendarX2 className="h-4 w-4" aria-hidden />
            {employee.departureDate ? 'Corriger le départ' : 'Départ'}
          </Button>
        </div>
      </div>
      <nav
        className="flex shrink-0 gap-1 overflow-x-auto border-b border-border-default bg-surface px-3 sm:px-5"
        aria-label="Dossier salarié"
      >
        {tabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => onTabChange(tab.value)}
            className={cn(
              'shrink-0 border-b-2 px-3 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-focus-ring',
              activeTab === tab.value
                ? 'border-action-primary text-action-primary'
                : 'border-transparent text-secondary',
            )}
            aria-current={activeTab === tab.value ? 'page' : undefined}
          >
            {tab.label}
          </button>
        ))}
      </nav>
      <div className="min-h-0 flex-1 overflow-y-auto bg-surface-muted p-4 sm:p-6">
        {dossierAccessError && (
          <Alert tone="danger" className="mb-4">
            <AlertTitle>Traçabilité indisponible</AlertTitle>
            <AlertDescription>{dossierAccessError}</AlertDescription>
            <div className="mt-3">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={onRetryDossierAccess}
              >
                <RotateCcw className="h-4 w-4" aria-hidden />
                Réessayer
              </Button>
            </div>
          </Alert>
        )}
        {activeTab === 'overview' && (
          <section className="rounded-xl border border-border-default bg-surface p-5 shadow-sm sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-bold">Informations clés</h3>
                <p className="mt-1 text-sm text-secondary">
                  Situation actuelle du dossier salarié.
                </p>
              </div>
              <CompletenessBadge employee={employee} />
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <OverviewFact
                icon={<CalendarDays className="h-4 w-4" aria-hidden />}
                label="Entrée"
                value={formatEmployeeDate(employee.entryDate, locale)}
              />
              <div
                ref={departureFactRef}
                tabIndex={-1}
                className="rounded-lg focus:outline-none focus:ring-2 focus:ring-focus-ring"
              >
                <OverviewFact
                  icon={<CalendarX2 className="h-4 w-4" aria-hidden />}
                  label={employee.departureDate ? 'Départ' : 'Fin attendue'}
                  value={
                    employee.departureDate
                      ? formatEmployeeDate(employee.departureDate, locale)
                      : employee.expectedEndDate
                        ? formatEmployeeDate(employee.expectedEndDate, locale)
                        : 'Non renseignée'
                  }
                />
              </div>
              <OverviewFact
                icon={<Clock3 className="h-4 w-4" aria-hidden />}
                label="Temps de travail"
                value={getWorkTimeLabel(employee)}
              />
              <OverviewFact
                icon={
                  isEmployeeComplete(employee) ? (
                    <CheckCircle2 className="h-4 w-4" aria-hidden />
                  ) : (
                    <FileWarning className="h-4 w-4" aria-hidden />
                  )
                }
                label="État du dossier"
                value={isEmployeeComplete(employee) ? 'Complet' : 'À compléter'}
              />
            </div>
            <div className="mt-5 border-t border-border-default pt-4">
              <CompletenessGuidance employee={employee} onEdit={onEdit} />
            </div>
          </section>
        )}
        {activeTab === 'identity' && (
          <DetailSection
            title="Identité minimale"
            description="Informations d’identité enregistrées dans le dossier salarié."
          >
            <OverviewFact
              icon={<IdCard className="h-4 w-4" aria-hidden />}
              label="Prénoms"
              value={employee.givenNames}
            />
            <OverviewFact
              icon={<BadgeCheck className="h-4 w-4" aria-hidden />}
              label="Nom"
              value={employee.familyName}
            />
          </DetailSection>
        )}
        {activeTab === 'employment' && (
          <>
            <DetailSection
              title="Relation de travail"
              description="Situation contractuelle principale du salarié."
            >
              <OverviewFact
                icon={<BriefcaseBusiness className="h-4 w-4" aria-hidden />}
                label="Poste"
                value={employee.position}
              />
              <OverviewFact
                icon={<GraduationCap className="h-4 w-4" aria-hidden />}
                label="Qualification"
                value={employee.qualification}
              />
              <OverviewFact
                icon={<FileText className="h-4 w-4" aria-hidden />}
                label="Contrat"
                value={getContractSummary(employee)}
              />
              <OverviewFact
                icon={<Clock3 className="h-4 w-4" aria-hidden />}
                label="Temps de travail"
                value={getWorkTimeLabel(employee)}
              />
            </DetailSection>
            <EmployeeEmploymentDetails employee={employee} />
          </>
        )}
        {activeTab === 'history' && (
          <EmployeeHistory
            state={historyState}
            locale={locale}
            onRetry={onRetryHistory}
          />
        )}
        {activeTab === 'access' && (
          <EmployeeAccessHistory
            state={accessHistoryState}
            locale={locale}
            pageIndex={accessHistoryPageIndex}
            onRetry={onRetryAccessHistory}
            onPrevious={onPreviousAccessHistory}
            onNext={onNextAccessHistory}
          />
        )}
        {activeTab === 'documents' && (
          <EmployeeDocuments
            employee={employee}
            locale={locale}
            requestAdd={requestDocumentAdd}
            contractExtractionPrototypeEnabled={
              contractExtractionPrototypeEnabled
            }
          />
        )}
      </div>
    </div>
  );

  if (mode === 'page') {
    return (
      <div className="min-h-[calc(100vh-12rem)] overflow-hidden rounded-xl border border-border-default bg-surface shadow-sm">
        {content}
      </div>
    );
  }

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose?.();
      }}
    >
      <DialogContent
        variant="right-panel"
        closeLabel="Fermer le dossier"
        className="w-full max-w-none overflow-hidden p-0 lg:w-[min(88vw,60rem)]"
      >
        {content}
      </DialogContent>
    </Dialog>
  );
}

export function CompletenessGuidance({
  employee,
  onEdit,
}: {
  employee: PersonnelEmployeeSummary;
  onEdit: (origin: HTMLElement) => void;
}) {
  if (employee.completenessReasons.length === 0) {
    return (
      <p className="text-xs text-secondary">
        Toutes les informations minimales sont renseignées.
      </p>
    );
  }
  const labels = {
    given_names_missing: 'prénoms',
    family_name_missing: 'nom',
    position_missing: 'poste',
    qualification_missing: 'qualification',
  } as const;
  return (
    <Alert
      tone="warning"
      icon={<FileWarning className="h-4 w-4" aria-hidden />}
    >
      <AlertTitle>Informations à compléter</AlertTitle>
      <AlertDescription>
        Champs manquants :{' '}
        {employee.completenessReasons
          .map((reason) => labels[reason])
          .join(', ')}
        .
      </AlertDescription>
      <div className="mt-3">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={(event) => onEdit(event.currentTarget)}
        >
          <Pencil className="h-4 w-4" aria-hidden />
          Compléter le dossier
        </Button>
      </div>
    </Alert>
  );
}
