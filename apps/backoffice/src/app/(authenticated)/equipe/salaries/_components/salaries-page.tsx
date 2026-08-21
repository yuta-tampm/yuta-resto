'use client';

import type {
  PersonnelCompletenessFilter,
  PersonnelEmployeeListQuery,
  PersonnelEmployeeListResponse,
  PersonnelEmployeeAccessEvent,
  PersonnelEmployeeAccessHistory,
  PersonnelEmployeeAuditHistory,
  PersonnelEmployeeAuditEvent,
  PersonnelEmployeeSummary,
  PersonnelEmployeeSort,
  PersonnelEmployeeView,
  PersonnelActionOverviewItemKind,
} from '@yuta/contracts/personnel';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Button,
  Card,
  Dialog,
  DialogContent,
  DialogTitle,
  EmptyState,
  Input,
  MetricCard,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SimpleTable,
  SimpleTableBody,
  SimpleTableCell,
  SimpleTableHead,
  SimpleTableHeader,
  SimpleTableRow,
  cn,
} from '@yuta/ui';
import {
  BadgeCheck,
  BookOpen,
  BriefcaseBusiness,
  CheckCircle2,
  CalendarDays,
  CalendarX2,
  Clock3,
  ChevronLeft,
  ChevronRight,
  Database,
  FileWarning,
  Eye,
  ExternalLink,
  FileText,
  LoaderCircle,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  GraduationCap,
  IdCard,
  UsersRound,
} from 'lucide-react';
import Link from 'next/link';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
  type FormEvent,
} from 'react';
import { useRouter } from 'next/navigation';
import { EmployeeCreateDialog } from './employee-create-dialog';
import { EmployeeDepartureDialog } from './employee-departure-dialog';
import { EmployeeDocuments } from './employee-documents';
import { EmployeeEditDialog } from './employee-edit-dialog';
import { EmployeeEmploymentDetails } from './employee-employment-details';
import {
  EmployeeActionOverview,
  type PersonnelActionOverviewState,
} from './employee-action-overview';
import {
  loadEmployeeAccessHistoryAction,
  loadEmployeeHistoryAction,
  recordEmployeeDossierViewAction,
} from '../actions';
import {
  formatEmployeeDate,
  getContractSummary,
  getEmployeeDossierHref,
  getEmployeeInitials,
  getEmployeeName,
  getEmploymentStatusPresentation,
  getWorkTimeLabel,
  isEmployeeComplete,
} from '../salaries-model';

type DetailTab =
  | 'overview'
  | 'identity'
  | 'employment'
  | 'history'
  | 'access'
  | 'documents';
type HistoryLoadState =
  | { status: 'idle' | 'loading'; history: null; message: null }
  | {
      status: 'success';
      history: PersonnelEmployeeAuditHistory;
      message: null;
    }
  | { status: 'error'; history: null; message: string };
type AccessHistoryLoadState =
  | { status: 'idle' | 'loading'; history: null; message: null }
  | {
      status: 'success';
      history: PersonnelEmployeeAccessHistory;
      message: null;
    }
  | { status: 'error'; history: null; message: string };

type EmployeeDetailsMode = 'dialog' | 'page';

const viewOptions: ReadonlyArray<{
  value: PersonnelEmployeeView;
  label: string;
}> = [
  { value: 'active', label: 'Actifs' },
  { value: 'upcoming', label: 'Entrées à venir' },
  { value: 'former', label: 'Anciens salariés' },
];

export function SalariesPage({
  data,
  query,
  locale,
  businessDate,
  actionOverviewState,
  contractExtractionPrototypeEnabled,
}: {
  data: PersonnelEmployeeListResponse;
  query: PersonnelEmployeeListQuery;
  locale: string;
  businessDate: string;
  actionOverviewState: PersonnelActionOverviewState | null;
  contractExtractionPrototypeEnabled: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState(query.search);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detailTab, setDetailTab] = useState<DetailTab>('overview');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] =
    useState<PersonnelEmployeeSummary | null>(null);
  const [recentlySavedEmployee, setRecentlySavedEmployee] =
    useState<PersonnelEmployeeSummary | null>(null);
  const [actionTargetEmployee, setActionTargetEmployee] =
    useState<PersonnelEmployeeSummary | null>(null);
  const [documentAddRequested, setDocumentAddRequested] = useState(false);
  const [focusDepartureRequested, setFocusDepartureRequested] = useState(false);
  const drawerActionOriginRef = useRef<HTMLElement | null>(null);
  const editActionOriginRef = useRef<HTMLElement | null>(null);
  const [editSuccessMessage, setEditSuccessMessage] = useState<string | null>(
    null,
  );
  const [departureEmployee, setDepartureEmployee] =
    useState<PersonnelEmployeeSummary | null>(null);
  const [historyState, setHistoryState] = useState<HistoryLoadState>({
    status: 'idle',
    history: null,
    message: null,
  });
  const [historyOperationId, setHistoryOperationId] = useState('');
  const [accessHistoryState, setAccessHistoryState] =
    useState<AccessHistoryLoadState>({
      status: 'idle',
      history: null,
      message: null,
    });
  const [accessHistoryOperationId, setAccessHistoryOperationId] = useState('');
  const [accessHistoryCursor, setAccessHistoryCursor] = useState<
    string | undefined
  >(undefined);
  const [accessHistoryCursorStack, setAccessHistoryCursorStack] = useState<
    string[]
  >(['']);
  const [accessHistoryPageIndex, setAccessHistoryPageIndex] = useState(0);
  const [dossierAccessError, setDossierAccessError] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (
      selectedId &&
      !data.items.some((employee) => employee.id === selectedId) &&
      recentlySavedEmployee?.id !== selectedId &&
      actionTargetEmployee?.id !== selectedId
    ) {
      setSelectedId(null);
      setDetailTab('overview');
    }
  }, [actionTargetEmployee, data.items, recentlySavedEmployee, selectedId]);

  useEffect(() => {
    if (!recentlySavedEmployee) return;
    const refreshedEmployee = data.items.find(
      (employee) => employee.id === recentlySavedEmployee.id,
    );
    if (
      refreshedEmployee &&
      refreshedEmployee.revision >= recentlySavedEmployee.revision
    ) {
      setRecentlySavedEmployee(null);
    }
  }, [data.items, recentlySavedEmployee]);

  function recordDossierAccess(employeeId: string) {
    setDossierAccessError(null);
    void recordEmployeeDossierViewAction(employeeId, crypto.randomUUID())
      .then((result) => {
        if (result.status === 'error') {
          setDossierAccessError(result.message);
        }
      })
      .catch(() => {
        setDossierAccessError(
          'La traçabilité du dossier est indisponible. Réessayez.',
        );
      });
  }

  useEffect(() => {
    if (detailTab !== 'history' || !selectedId || !historyOperationId) return;
    let active = true;
    setHistoryState({ status: 'loading', history: null, message: null });
    void loadEmployeeHistoryAction(selectedId, historyOperationId)
      .then((result) => {
        if (!active) return;
        setHistoryState(
          result.status === 'success'
            ? { status: 'success', history: result.history, message: null }
            : { status: 'error', history: null, message: result.message },
        );
      })
      .catch(() => {
        if (!active) return;
        setHistoryState({
          status: 'error',
          history: null,
          message: 'Impossible de charger l’historique. Réessayez.',
        });
      });
    return () => {
      active = false;
    };
  }, [detailTab, historyOperationId, selectedId]);

  useEffect(() => {
    if (detailTab !== 'access' || !selectedId || !accessHistoryOperationId) {
      return;
    }
    let active = true;
    setAccessHistoryState({ status: 'loading', history: null, message: null });
    void loadEmployeeAccessHistoryAction(
      selectedId,
      accessHistoryOperationId,
      accessHistoryCursor,
    )
      .then((result) => {
        if (!active) return;
        setAccessHistoryState(
          result.status === 'success'
            ? { status: 'success', history: result.history, message: null }
            : { status: 'error', history: null, message: result.message },
        );
      })
      .catch(() => {
        if (!active) return;
        setAccessHistoryState({
          status: 'error',
          history: null,
          message: 'Impossible de charger les consultations. Réessayez.',
        });
      });
    return () => {
      active = false;
    };
  }, [accessHistoryCursor, accessHistoryOperationId, detailTab, selectedId]);

  const displayedEmployees = data.items.map((employee) =>
    recentlySavedEmployee?.id === employee.id &&
    recentlySavedEmployee.revision > employee.revision
      ? recentlySavedEmployee
      : employee,
  );
  const selectedEmployee =
    displayedEmployees.find((employee) => employee.id === selectedId) ??
    (recentlySavedEmployee?.id === selectedId ? recentlySavedEmployee : null) ??
    (actionTargetEmployee?.id === selectedId ? actionTargetEmployee : null);
  const isFirstUse =
    data.counts.active + data.counts.upcoming + data.counts.former === 0;

  function navigate(next: Partial<PersonnelEmployeeListQuery>) {
    const params = new URLSearchParams();
    const merged = { ...query, ...next };
    params.set('view', merged.view);
    if (merged.search) params.set('search', merged.search);
    if (merged.completeness !== 'all') {
      params.set('completeness', merged.completeness);
    }
    if (merged.sort !== 'entry_date_desc') {
      params.set('sort', merged.sort);
    }
    if (next.cursor) params.set('cursor', next.cursor);
    startTransition(() => router.push(`/equipe/salaries?${params.toString()}`));
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    navigate({ search: search.trim(), cursor: undefined });
  }

  const restoreActionFocus = useCallback(
    (originRef: { current: HTMLElement | null }) => {
      const origin = originRef.current;
      originRef.current = null;
      requestAnimationFrame(() => {
        if (origin?.isConnected) origin.focus();
      });
    },
    [],
  );

  const handleEmployeeSaved = useCallback(
    (employee: PersonnelEmployeeSummary, message: string | null) => {
      setRecentlySavedEmployee(employee);
      setEditingEmployee(null);
      setEditSuccessMessage(
        message ?? 'Les modifications ont été enregistrées.',
      );
      restoreActionFocus(editActionOriginRef);
    },
    [restoreActionFocus],
  );

  function openActionTarget(
    kind: PersonnelActionOverviewItemKind,
    employee: PersonnelEmployeeSummary,
    origin: HTMLElement,
  ) {
    if (kind === 'incomplete_employee_dossier') {
      editActionOriginRef.current = origin;
      setEditSuccessMessage(null);
      setEditingEmployee(employee);
      return;
    }
    drawerActionOriginRef.current = origin;
    setActionTargetEmployee(employee);
    setSelectedId(employee.id);
    setEditSuccessMessage(null);
    setDocumentAddRequested(kind === 'missing_signed_base_contract');
    setFocusDepartureRequested(kind === 'departure_within_five_days');
    recordDossierAccess(employee.id);
    setDetailTab(
      kind === 'missing_signed_base_contract' ? 'documents' : 'overview',
    );
    setHistoryOperationId('');
    setHistoryState({ status: 'idle', history: null, message: null });
    setAccessHistoryOperationId('');
    setAccessHistoryCursor(undefined);
    setAccessHistoryCursorStack(['']);
    setAccessHistoryPageIndex(0);
    setAccessHistoryState({ status: 'idle', history: null, message: null });
  }

  return (
    <div className="flex w-full flex-col gap-5" aria-busy={isPending}>
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Salariés</h1>
          <p className="mt-1 text-sm text-secondary">
            Consultez les dossiers minimums rattachés à cet établissement.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="secondary" size="lg">
            <Link href="/equipe/registre-personnel">
              <BookOpen className="h-5 w-5" aria-hidden />
              Registre du personnel
            </Link>
          </Button>
          <Button size="lg" onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-5 w-5" aria-hidden />
            Ajouter un salarié
          </Button>
        </div>
      </header>

      <Alert tone="info" icon={<Database className="h-5 w-5" aria-hidden />}>
        <AlertTitle>Liste connectée aux données de l’établissement</AlertTitle>
        <AlertDescription>
          Les données de démonstration ont été retirées. L’ajout enregistre
          maintenant le dossier minimum et son historique. La modification est
          également enregistrée avec contrôle de version. Le départ conserve le
          dossier et son historique.
        </AlertDescription>
      </Alert>

      <section className="grid gap-3 sm:grid-cols-3" aria-label="Synthèse">
        <MetricCard
          label="Salariés actifs"
          value={data.counts.active}
          helper="En poste actuellement"
        />
        <MetricCard
          label="Entrées à venir"
          value={data.counts.upcoming}
          helper="Après la date locale du jour"
        />
        <MetricCard
          label="Dossiers à compléter"
          value={data.counts.incomplete}
          helper="Selon les informations minimums"
        />
      </section>

      {actionOverviewState && (
        <EmployeeActionOverview
          initialState={actionOverviewState}
          locale={locale}
          businessDate={businessDate}
          onTargetReady={openActionTarget}
        />
      )}

      <div>
        <Card padding="none" className="min-w-0 overflow-hidden">
          <div className="border-b border-border-default p-4">
            <form
              className="flex flex-col gap-3 lg:flex-row lg:flex-wrap"
              onSubmit={submitSearch}
            >
              <div className="relative min-w-0 flex-1">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                  aria-hidden
                />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Rechercher un salarié, un poste…"
                  aria-label="Rechercher un salarié"
                  className="pl-9"
                  disabled={isPending}
                />
              </div>
              <div className="w-full lg:w-56">
                <Select
                  value={query.completeness}
                  disabled={isPending}
                  onValueChange={(value) =>
                    navigate({
                      completeness: value as PersonnelCompletenessFilter,
                      cursor: undefined,
                    })
                  }
                >
                  <SelectTrigger aria-label="Filtrer selon la complétude">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les dossiers</SelectItem>
                    <SelectItem value="complete">Dossiers complets</SelectItem>
                    <SelectItem value="incomplete">À compléter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full lg:w-56">
                <Select
                  value={query.sort}
                  disabled={isPending}
                  onValueChange={(value) =>
                    navigate({
                      sort: value as PersonnelEmployeeSort,
                      cursor: undefined,
                    })
                  }
                >
                  <SelectTrigger aria-label="Trier les salariés">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entry_date_desc">
                      Date d’entrée — plus récente
                    </SelectItem>
                    <SelectItem value="name_asc">Nom — A à Z</SelectItem>
                    <SelectItem value="name_desc">Nom — Z à A</SelectItem>
                    <SelectItem value="position_asc">Poste — A à Z</SelectItem>
                    <SelectItem value="position_desc">Poste — Z à A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" variant="secondary" disabled={isPending}>
                Rechercher
              </Button>
              <Button
                type="button"
                variant="ghost"
                disabled={isPending}
                onClick={() => {
                  setSearch('');
                  navigate({
                    search: '',
                    completeness: 'all',
                    sort: 'entry_date_desc',
                    cursor: undefined,
                  });
                }}
              >
                Réinitialiser
              </Button>
            </form>

            <nav
              className="mt-4 flex gap-1 overflow-x-auto"
              aria-label="Situation d’emploi"
            >
              {viewOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    navigate({ view: option.value, cursor: undefined })
                  }
                  className={cn(
                    'shrink-0 border-b-2 px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-focus-ring',
                    query.view === option.value
                      ? 'border-action-primary text-action-primary'
                      : 'border-transparent text-secondary hover:text-primary',
                  )}
                  aria-current={
                    query.view === option.value ? 'page' : undefined
                  }
                  disabled={isPending}
                >
                  {option.label}{' '}
                  <span className="text-xs">{data.counts[option.value]}</span>
                </button>
              ))}
            </nav>
          </div>

          {editSuccessMessage && (
            <Alert tone="success" className="m-4 mb-0">
              <AlertDescription>{editSuccessMessage}</AlertDescription>
            </Alert>
          )}

          {displayedEmployees.length === 0 ? (
            <EmptyState
              icon={<UsersRound className="h-9 w-9" aria-hidden />}
              title={
                isFirstUse ? 'Aucun salarié pour le moment' : 'Aucun résultat'
              }
              description={
                isFirstUse
                  ? 'La base est prête, mais aucun dossier salarié n’a encore été enregistré.'
                  : 'Modifiez la recherche, la vue, le filtre ou le tri.'
              }
              action={
                !isFirstUse ? (
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setSearch('');
                      navigate({
                        search: '',
                        completeness: 'all',
                        sort: 'entry_date_desc',
                        cursor: undefined,
                      });
                    }}
                  >
                    Réinitialiser
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <EmployeeList
              employees={displayedEmployees}
              selectedId={selectedId}
              locale={locale}
              businessDate={businessDate}
              onSelect={(id) => {
                setRecentlySavedEmployee(null);
                setActionTargetEmployee(null);
                setDocumentAddRequested(false);
                setFocusDepartureRequested(false);
                setEditSuccessMessage(null);
                setSelectedId(id);
                setDetailTab('overview');
                recordDossierAccess(id);
                setHistoryOperationId('');
                setHistoryState({
                  status: 'idle',
                  history: null,
                  message: null,
                });
                setAccessHistoryOperationId('');
                setAccessHistoryCursor(undefined);
                setAccessHistoryCursorStack(['']);
                setAccessHistoryPageIndex(0);
                setAccessHistoryState({
                  status: 'idle',
                  history: null,
                  message: null,
                });
              }}
            />
          )}

          {data.pageInfo.hasMore && data.pageInfo.nextCursor && (
            <div className="border-t border-border-default p-4 text-center">
              <Button
                variant="secondary"
                disabled={isPending}
                onClick={() =>
                  navigate({ cursor: data.pageInfo.nextCursor ?? undefined })
                }
              >
                Page suivante
              </Button>
            </div>
          )}
        </Card>

        {selectedEmployee && (
          <EmployeeDetails
            employee={selectedEmployee}
            activeTab={detailTab}
            locale={locale}
            businessDate={businessDate}
            historyState={historyState}
            accessHistoryState={accessHistoryState}
            accessHistoryPageIndex={accessHistoryPageIndex}
            dossierAccessError={dossierAccessError}
            requestDocumentAdd={documentAddRequested}
            focusDeparture={focusDepartureRequested}
            contractExtractionPrototypeEnabled={
              contractExtractionPrototypeEnabled
            }
            onTabChange={(tab) => {
              setDetailTab(tab);
              if (tab === 'history') {
                setHistoryOperationId(crypto.randomUUID());
              }
              if (tab === 'access') {
                setAccessHistoryCursor(undefined);
                setAccessHistoryCursorStack(['']);
                setAccessHistoryPageIndex(0);
                setAccessHistoryOperationId(crypto.randomUUID());
              }
            }}
            onClose={() => {
              setSelectedId(null);
              setRecentlySavedEmployee(null);
              setActionTargetEmployee(null);
              setDocumentAddRequested(false);
              setFocusDepartureRequested(false);
              restoreActionFocus(drawerActionOriginRef);
            }}
            onEdit={() => {
              setEditSuccessMessage(null);
              setEditingEmployee(selectedEmployee);
            }}
            onDeparture={() => setDepartureEmployee(selectedEmployee)}
            onRetryHistory={() => setHistoryOperationId(crypto.randomUUID())}
            onRetryAccessHistory={() =>
              setAccessHistoryOperationId(crypto.randomUUID())
            }
            onPreviousAccessHistory={() => {
              const previousIndex = Math.max(0, accessHistoryPageIndex - 1);
              setAccessHistoryPageIndex(previousIndex);
              setAccessHistoryCursor(
                accessHistoryCursorStack[previousIndex] || undefined,
              );
              setAccessHistoryOperationId(crypto.randomUUID());
            }}
            onNextAccessHistory={() => {
              const nextCursor =
                accessHistoryState.status === 'success'
                  ? accessHistoryState.history.pageInfo.nextCursor
                  : null;
              if (!nextCursor) return;
              const nextIndex = accessHistoryPageIndex + 1;
              setAccessHistoryCursorStack((current) => [
                ...current.slice(0, nextIndex),
                nextCursor,
              ]);
              setAccessHistoryPageIndex(nextIndex);
              setAccessHistoryCursor(nextCursor);
              setAccessHistoryOperationId(crypto.randomUUID());
            }}
            onRetryDossierAccess={() =>
              recordDossierAccess(selectedEmployee.id)
            }
          />
        )}
      </div>

      {createDialogOpen && (
        <EmployeeCreateDialog
          open
          onOpenChange={setCreateDialogOpen}
          locale={locale}
        />
      )}
      {editingEmployee && (
        <EmployeeEditDialog
          employee={editingEmployee}
          open
          onSaved={handleEmployeeSaved}
          onOpenChange={(open) => {
            if (!open) {
              setEditingEmployee(null);
              restoreActionFocus(editActionOriginRef);
            }
          }}
        />
      )}
      {departureEmployee && (
        <EmployeeDepartureDialog
          employee={departureEmployee}
          businessDate={businessDate}
          locale={locale}
          open
          onOpenChange={(open) => {
            if (!open) setDepartureEmployee(null);
          }}
        />
      )}
    </div>
  );
}

export function EmployeeFullDossierPage({
  initialEmployee,
  locale,
  businessDate,
  contractExtractionPrototypeEnabled,
}: {
  initialEmployee: PersonnelEmployeeSummary;
  locale: string;
  businessDate: string;
  contractExtractionPrototypeEnabled: boolean;
}) {
  const [employee, setEmployee] = useState(initialEmployee);
  const [activeTab, setActiveTab] = useState<DetailTab>('overview');
  const [editing, setEditing] = useState(false);
  const [departureOpen, setDepartureOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [historyState, setHistoryState] = useState<HistoryLoadState>({
    status: 'idle',
    history: null,
    message: null,
  });
  const [historyOperationId, setHistoryOperationId] = useState('');
  const [accessHistoryState, setAccessHistoryState] =
    useState<AccessHistoryLoadState>({
      status: 'idle',
      history: null,
      message: null,
    });
  const [accessHistoryOperationId, setAccessHistoryOperationId] = useState('');
  const [accessHistoryCursor, setAccessHistoryCursor] = useState<
    string | undefined
  >(undefined);
  const [accessHistoryCursorStack, setAccessHistoryCursorStack] = useState<
    string[]
  >(['']);
  const [accessHistoryPageIndex, setAccessHistoryPageIndex] = useState(0);
  const [dossierAccessError, setDossierAccessError] = useState<string | null>(
    null,
  );
  const accessRecordedEmployeeRef = useRef<string | null>(null);

  useEffect(() => {
    if (
      initialEmployee.id !== employee.id ||
      initialEmployee.revision >= employee.revision
    ) {
      setEmployee(initialEmployee);
    }
  }, [employee.id, employee.revision, initialEmployee]);

  const recordDossierAccess = useCallback(() => {
    setDossierAccessError(null);
    void recordEmployeeDossierViewAction(employee.id, crypto.randomUUID())
      .then((result) => {
        if (result.status === 'error') {
          setDossierAccessError(result.message);
        }
      })
      .catch(() => {
        setDossierAccessError(
          'La traçabilité du dossier est indisponible. Réessayez.',
        );
      });
  }, [employee.id]);

  useEffect(() => {
    if (accessRecordedEmployeeRef.current === employee.id) return;
    accessRecordedEmployeeRef.current = employee.id;
    recordDossierAccess();
  }, [employee.id, recordDossierAccess]);

  useEffect(() => {
    if (activeTab !== 'history' || !historyOperationId) return;
    let active = true;
    setHistoryState({ status: 'loading', history: null, message: null });
    void loadEmployeeHistoryAction(employee.id, historyOperationId)
      .then((result) => {
        if (!active) return;
        setHistoryState(
          result.status === 'success'
            ? { status: 'success', history: result.history, message: null }
            : { status: 'error', history: null, message: result.message },
        );
      })
      .catch(() => {
        if (!active) return;
        setHistoryState({
          status: 'error',
          history: null,
          message: 'Impossible de charger l’historique. Réessayez.',
        });
      });
    return () => {
      active = false;
    };
  }, [activeTab, employee.id, historyOperationId]);

  useEffect(() => {
    if (activeTab !== 'access' || !accessHistoryOperationId) return;
    let active = true;
    setAccessHistoryState({ status: 'loading', history: null, message: null });
    void loadEmployeeAccessHistoryAction(
      employee.id,
      accessHistoryOperationId,
      accessHistoryCursor,
    )
      .then((result) => {
        if (!active) return;
        setAccessHistoryState(
          result.status === 'success'
            ? { status: 'success', history: result.history, message: null }
            : { status: 'error', history: null, message: result.message },
        );
      })
      .catch(() => {
        if (!active) return;
        setAccessHistoryState({
          status: 'error',
          history: null,
          message: 'Impossible de charger les consultations. Réessayez.',
        });
      });
    return () => {
      active = false;
    };
  }, [accessHistoryCursor, accessHistoryOperationId, activeTab, employee.id]);

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
        historyState={historyState}
        accessHistoryState={accessHistoryState}
        accessHistoryPageIndex={accessHistoryPageIndex}
        dossierAccessError={dossierAccessError}
        requestDocumentAdd={false}
        focusDeparture={false}
        contractExtractionPrototypeEnabled={contractExtractionPrototypeEnabled}
        mode="page"
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab === 'history') {
            setHistoryOperationId(crypto.randomUUID());
          }
          if (tab === 'access') {
            setAccessHistoryCursor(undefined);
            setAccessHistoryCursorStack(['']);
            setAccessHistoryPageIndex(0);
            setAccessHistoryOperationId(crypto.randomUUID());
          }
        }}
        onEdit={() => {
          setSuccessMessage(null);
          setEditing(true);
        }}
        onDeparture={() => setDepartureOpen(true)}
        onRetryHistory={() => setHistoryOperationId(crypto.randomUUID())}
        onRetryAccessHistory={() =>
          setAccessHistoryOperationId(crypto.randomUUID())
        }
        onPreviousAccessHistory={() => {
          const previousIndex = Math.max(0, accessHistoryPageIndex - 1);
          setAccessHistoryPageIndex(previousIndex);
          setAccessHistoryCursor(
            accessHistoryCursorStack[previousIndex] || undefined,
          );
          setAccessHistoryOperationId(crypto.randomUUID());
        }}
        onNextAccessHistory={() => {
          const nextCursor =
            accessHistoryState.status === 'success'
              ? accessHistoryState.history.pageInfo.nextCursor
              : null;
          if (!nextCursor) return;
          const nextIndex = accessHistoryPageIndex + 1;
          setAccessHistoryCursorStack((current) => [
            ...current.slice(0, nextIndex),
            nextCursor,
          ]);
          setAccessHistoryPageIndex(nextIndex);
          setAccessHistoryCursor(nextCursor);
          setAccessHistoryOperationId(crypto.randomUUID());
        }}
        onRetryDossierAccess={recordDossierAccess}
      />
      {editing && (
        <EmployeeEditDialog
          employee={employee}
          open
          onSaved={(savedEmployee, message) => {
            setEmployee(savedEmployee);
            setEditing(false);
            setSuccessMessage(
              message ?? 'Les modifications ont été enregistrées.',
            );
          }}
          onOpenChange={setEditing}
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

function EmployeeList({
  employees,
  selectedId,
  locale,
  businessDate,
  onSelect,
}: {
  employees: readonly PersonnelEmployeeSummary[];
  selectedId: string | null;
  locale: string;
  businessDate: string;
  onSelect: (id: string) => void;
}) {
  return (
    <>
      <div className="hidden md:block">
        <SimpleTable>
          <SimpleTableHeader>
            <SimpleTableRow>
              <SimpleTableHead>Salarié</SimpleTableHead>
              <SimpleTableHead>Poste</SimpleTableHead>
              <SimpleTableHead>Relation</SimpleTableHead>
              <SimpleTableHead>Date d’entrée</SimpleTableHead>
              <SimpleTableHead>Dossier</SimpleTableHead>
            </SimpleTableRow>
          </SimpleTableHeader>
          <SimpleTableBody>
            {employees.map((employee) => (
              <SimpleTableRow
                key={employee.id}
                className={
                  employee.id === selectedId ? 'bg-surface-selected' : undefined
                }
                aria-selected={employee.id === selectedId}
              >
                <SimpleTableCell>
                  <button
                    type="button"
                    className="flex w-full items-center gap-3 rounded-md text-left focus:outline-none focus:ring-2 focus:ring-focus-ring"
                    onClick={() => onSelect(employee.id)}
                    aria-label={`Consulter ${getEmployeeName(employee)}`}
                  >
                    <EmployeeAvatar employee={employee} />
                    <span className="font-bold">
                      {getEmployeeName(employee)}
                    </span>
                  </button>
                </SimpleTableCell>
                <SimpleTableCell>{employee.position}</SimpleTableCell>
                <SimpleTableCell>
                  <span className="flex flex-wrap items-center gap-2">
                    <span>{getContractSummary(employee)}</span>
                    <DepartureNoticeBadge
                      employee={employee}
                      businessDate={businessDate}
                    />
                  </span>
                </SimpleTableCell>
                <SimpleTableCell>
                  {formatEmployeeDate(employee.entryDate, locale)}
                </SimpleTableCell>
                <SimpleTableCell>
                  <CompletenessBadge employee={employee} />
                </SimpleTableCell>
              </SimpleTableRow>
            ))}
          </SimpleTableBody>
        </SimpleTable>
      </div>

      <div className="grid gap-3 p-3 md:hidden">
        {employees.map((employee) => (
          <Link
            key={employee.id}
            href={getEmployeeDossierHref(employee.id)}
            className={cn(
              'rounded-lg border p-4 text-left focus:outline-none focus:ring-2 focus:ring-focus-ring',
              employee.id === selectedId
                ? 'border-action-primary bg-surface-selected'
                : 'border-border-default bg-surface',
            )}
          >
            <span className="flex items-start justify-between gap-3">
              <span className="flex min-w-0 items-center gap-3">
                <EmployeeAvatar employee={employee} />
                <span className="min-w-0">
                  <span className="block truncate font-bold">
                    {getEmployeeName(employee)}
                  </span>
                  <span className="block text-sm text-secondary">
                    {employee.position}
                  </span>
                </span>
              </span>
              <ChevronRight
                className="h-5 w-5 shrink-0 text-muted"
                aria-hidden
              />
            </span>
            <span className="mt-3 flex flex-wrap items-center gap-2">
              <Badge tone="neutral">{getContractSummary(employee)}</Badge>
              <DepartureNoticeBadge
                employee={employee}
                businessDate={businessDate}
              />
              <CompletenessBadge employee={employee} />
            </span>
            <span className="mt-3 block text-xs font-medium text-secondary">
              Entrée : {formatEmployeeDate(employee.entryDate, locale)}
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}

function EmployeeDetails({
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
  mode = 'dialog',
}: {
  employee: PersonnelEmployeeSummary;
  activeTab: DetailTab;
  locale: string;
  businessDate: string;
  onTabChange: (tab: DetailTab) => void;
  onClose?: () => void;
  onEdit: () => void;
  onDeparture: () => void;
  historyState: HistoryLoadState;
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
          <Button type="button" variant="secondary" size="sm" onClick={onEdit}>
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

function EmployeeHistory({
  state,
  locale,
  onRetry,
}: {
  state: HistoryLoadState;
  locale: string;
  onRetry: () => void;
}) {
  if (state.status === 'idle' || state.status === 'loading') {
    return (
      <DetailSection title="Historique du dossier">
        <p
          className="flex items-center gap-2 text-sm text-secondary"
          role="status"
        >
          <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden />
          Chargement de l’historique…
        </p>
      </DetailSection>
    );
  }
  if (state.status === 'error') {
    return (
      <DetailSection title="Historique du dossier">
        <Alert tone="danger">
          <AlertTitle>Historique indisponible</AlertTitle>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
        <Button type="button" variant="secondary" size="sm" onClick={onRetry}>
          <RotateCcw className="h-4 w-4" aria-hidden />
          Réessayer
        </Button>
      </DetailSection>
    );
  }
  if (!state.history) return null;
  const { history } = state;
  if (history.items.length === 0) {
    return (
      <DetailSection title="Historique du dossier">
        <p className="text-sm text-secondary">
          Aucun événement n’a encore été enregistré pour ce dossier.
        </p>
      </DetailSection>
    );
  }
  return (
    <DetailSection title="Historique du dossier">
      <ol className="grid gap-4">
        {history.items.map((event) => (
          <li key={event.id} className="flex gap-3">
            <span className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-surface-muted text-secondary">
              <Clock3 className="h-3.5 w-3.5" aria-hidden />
            </span>
            <div className="min-w-0 text-sm">
              <p className="font-bold">{auditEventLabel(event.eventType)}</p>
              <p className="mt-1 text-xs text-secondary">
                {formatAuditDateTime(event.occurredAt, locale)} ·{' '}
                {event.actorDisplayName ?? 'Utilisateur supprimé'}
              </p>
              {event.changedFields.length > 0 && (
                <p className="mt-2 text-xs text-secondary">
                  Champs : {event.changedFields.map(auditFieldLabel).join(', ')}
                </p>
              )}
              {(event.previousDepartureDate || event.newDepartureDate) && (
                <p className="mt-2 text-xs text-secondary">
                  Départ :{' '}
                  {event.previousDepartureDate
                    ? formatEmployeeDate(event.previousDepartureDate, locale)
                    : 'non renseigné'}{' '}
                  →{' '}
                  {event.newDepartureDate
                    ? formatEmployeeDate(event.newDepartureDate, locale)
                    : 'annulé'}
                </p>
              )}
              {event.reason && (
                <p className="mt-2 rounded-md bg-surface-muted px-2 py-1 text-xs">
                  Motif : {event.reason}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
      {history.truncated && (
        <p className="mt-4 text-xs text-secondary">
          Seuls les 50 événements les plus récents sont affichés.
        </p>
      )}
    </DetailSection>
  );
}

function EmployeeAccessHistory({
  state,
  locale,
  pageIndex,
  onRetry,
  onPrevious,
  onNext,
}: {
  state: AccessHistoryLoadState;
  locale: string;
  pageIndex: number;
  onRetry: () => void;
  onPrevious: () => void;
  onNext: () => void;
}) {
  if (state.status === 'idle' || state.status === 'loading') {
    return (
      <DetailSection title="Historique des consultations">
        <p
          className="flex items-center gap-2 text-sm text-secondary"
          role="status"
        >
          <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden />
          Chargement des consultations…
        </p>
      </DetailSection>
    );
  }
  if (state.status === 'error') {
    return (
      <DetailSection title="Historique des consultations">
        <Alert tone="danger">
          <AlertTitle>Consultations indisponibles</AlertTitle>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
        <Button type="button" variant="secondary" size="sm" onClick={onRetry}>
          <RotateCcw className="h-4 w-4" aria-hidden />
          Réessayer
        </Button>
      </DetailSection>
    );
  }
  if (!state.history) return null;
  const { history } = state;
  if (history.items.length === 0) {
    return (
      <DetailSection title="Historique des consultations">
        <p className="text-sm text-secondary">
          Aucune consultation n’a encore été enregistrée pour ce dossier.
        </p>
      </DetailSection>
    );
  }
  return (
    <DetailSection title="Historique des consultations">
      <p className="text-sm text-secondary">
        Ouvertures récentes du dossier et de ses historiques par les
        propriétaires autorisés.
      </p>
      <ol className="grid gap-4">
        {history.items.map((event) => (
          <li key={event.id} className="flex gap-3">
            <span className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-surface-muted text-action-primary">
              <Eye className="h-4 w-4" aria-hidden />
            </span>
            <div className="min-w-0 text-sm">
              <p className="font-bold">{accessEventLabel(event.eventType)}</p>
              <p className="mt-1 text-xs text-secondary">
                {formatAuditDateTime(event.occurredAt, locale)} ·{' '}
                {event.actorDisplayName ?? 'Utilisateur supprimé'}
              </p>
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-2 flex items-center justify-between gap-3 border-t border-border-default pt-4">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={onPrevious}
          disabled={pageIndex === 0}
        >
          <ChevronLeft className="h-4 w-4" aria-hidden />
          Précédent
        </Button>
        <span className="text-xs font-semibold text-secondary">
          Page {pageIndex + 1} · 10 par page
        </span>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={onNext}
          disabled={!history.pageInfo.hasMore}
        >
          Suivant
          <ChevronRight className="h-4 w-4" aria-hidden />
        </Button>
      </div>
    </DetailSection>
  );
}

function CompletenessGuidance({
  employee,
  onEdit,
}: {
  employee: PersonnelEmployeeSummary;
  onEdit: () => void;
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
        <Button type="button" variant="secondary" size="sm" onClick={onEdit}>
          <Pencil className="h-4 w-4" aria-hidden />
          Compléter le dossier
        </Button>
      </div>
    </Alert>
  );
}

function accessEventLabel(
  eventType: PersonnelEmployeeAccessEvent['eventType'],
): string {
  const labels: Record<PersonnelEmployeeAccessEvent['eventType'], string> = {
    'employee.dossier_viewed': 'Dossier consulté',
    'employee.history_viewed': 'Historique des modifications consulté',
    'employee.access_history_viewed': 'Historique des consultations consulté',
  };
  return labels[eventType];
}

function auditEventLabel(eventType: PersonnelEmployeeAuditEvent['eventType']) {
  const labels: Record<PersonnelEmployeeAuditEvent['eventType'], string> = {
    'employee.created': 'Dossier créé',
    'employee.duplicate_override_confirmed': 'Doublon potentiel confirmé',
    'employee.identity_updated': 'Identité modifiée',
    'employee.employment_updated': 'Relation de travail modifiée',
    'employee.departure_recorded': 'Départ enregistré',
    'employee.departure_corrected': 'Départ corrigé ou annulé',
    'employee.contract_extraction_requested': 'Analyse locale demandée',
    'employee.contract_extraction_completed': 'Analyse locale terminée',
    'employee.contract_extraction_failed': 'Analyse locale échouée',
    'employee.contract_extraction_applied': 'Suggestions du contrat appliquées',
  };
  return labels[eventType];
}

function auditFieldLabel(
  field: PersonnelEmployeeAuditEvent['changedFields'][number],
) {
  const labels: Record<
    PersonnelEmployeeAuditEvent['changedFields'][number],
    string
  > = {
    identity: 'identité',
    givenNames: 'prénoms',
    familyName: 'nom',
    position: 'poste',
    qualification: 'qualification',
    employmentTermType: 'type de contrat',
    expectedEndDate: 'fin prévue',
    fixedTermReasonCode: 'motif du CDD',
    workTimeCategory: 'temps de travail',
    contractWeeklyMinutes: 'durée hebdomadaire contractuelle',
    entryDate: 'date d’entrée',
    departureDate: 'date de départ',
  };
  return labels[field];
}

function formatAuditDateTime(value: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function OverviewFact({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border-default bg-surface-muted p-4">
      <div className="flex items-center gap-2 text-secondary">
        <span className="grid h-7 w-7 place-items-center rounded-md bg-surface text-action-primary">
          {icon}
        </span>
        <span className="text-xs font-semibold uppercase tracking-wide">
          {label}
        </span>
      </div>
      <div className="mt-3 text-base font-bold text-primary">{value}</div>
    </div>
  );
}

function DetailSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border-default bg-surface p-5 shadow-sm">
      <h3 className="text-lg font-bold">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-secondary">{description}</p>
      )}
      <div className="mt-4 grid gap-3 sm:grid-cols-2">{children}</div>
    </section>
  );
}

function EmployeeAvatar({
  employee,
  large = false,
}: {
  employee: PersonnelEmployeeSummary;
  large?: boolean;
}) {
  return (
    <span
      className={cn(
        'grid shrink-0 place-items-center rounded-full bg-surface-muted font-bold text-secondary',
        large ? 'h-12 w-12 text-sm' : 'h-9 w-9 text-xs',
      )}
      aria-hidden
    >
      {getEmployeeInitials(employee)}
    </span>
  );
}

function CompletenessBadge({
  employee,
}: {
  employee: PersonnelEmployeeSummary;
}) {
  const complete = isEmployeeComplete(employee);
  return (
    <Badge tone={complete ? 'success' : 'warning'}>
      {complete ? (
        <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
      ) : (
        <FileWarning className="h-3.5 w-3.5" aria-hidden />
      )}
      {complete ? 'Complet' : 'À compléter'}
    </Badge>
  );
}

function EmploymentBadge({
  employee,
  businessDate,
}: {
  employee: PersonnelEmployeeSummary;
  businessDate: string;
}) {
  const presentation = getEmploymentStatusPresentation(employee, businessDate);
  return <Badge tone={presentation.tone}>{presentation.label}</Badge>;
}

function DepartureNoticeBadge({
  employee,
  businessDate,
}: {
  employee: PersonnelEmployeeSummary;
  businessDate: string;
}) {
  const presentation = getEmploymentStatusPresentation(employee, businessDate);
  return presentation.tone === 'warning' ? (
    <Badge tone="warning">{presentation.label}</Badge>
  ) : null;
}
