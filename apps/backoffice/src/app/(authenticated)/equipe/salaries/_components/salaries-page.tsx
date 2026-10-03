'use client';

import type {
  PersonnelCompletenessFilter,
  PersonnelEmployeeListQuery,
  PersonnelEmployeeListResponse,
  PersonnelEmployeeSummary,
  PersonnelEmployeeSort,
  PersonnelEmployeeView,
  PersonnelActionOverviewItemKind,
} from '@yuta/contracts/personnel';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Card,
  EmptyState,
  Input,
  MetricCard,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  cn,
} from '@yuta/ui';
import { BookOpen, Database, Plus, Search, UsersRound } from 'lucide-react';
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
import { EmployeeEditDialog } from './employee-edit-dialog';
import {
  EmployeeActionOverview,
  type PersonnelActionOverviewState,
} from './employee-action-overview';
import { useEmployeeDossierAccess } from '../_lib/employee-dossier-access';
import {
  getEmployeeEditCommitRefreshPlan,
  restoreEmployeeEditFocus,
} from '../_lib/employee-history-refresh';
import { type DetailTab, EmployeeDetails } from './employee-details';
import { EmployeeList } from './employee-list';
import { useEmployeeHistory } from './use-employee-history';

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
  const { dossierAccessError, recordDossierAccess } =
    useEmployeeDossierAccess();

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

  const history = useEmployeeHistory(selectedId, detailTab);
  const { refreshHistoryAfterSave } = history;

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
      restoreEmployeeEditFocus(origin, (callback) =>
        requestAnimationFrame(callback),
      );
    },
    [],
  );

  const handleEmployeeSaved = useCallback(
    (employee: PersonnelEmployeeSummary, message: string | null) => {
      const refreshPlan = getEmployeeEditCommitRefreshPlan(
        'drawer',
        detailTab === 'history',
        () => crypto.randomUUID(),
      );
      setRecentlySavedEmployee(employee);
      refreshHistoryAfterSave(employee.id, refreshPlan.historyOperationId);
      if (refreshPlan.closeEditor) setEditingEmployee(null);
      setEditSuccessMessage(
        message ?? 'Les modifications ont été enregistrées.',
      );
      restoreActionFocus(editActionOriginRef);
    },
    [detailTab, refreshHistoryAfterSave, restoreActionFocus],
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
            historyState={history.historyState}
            accessHistoryState={history.accessHistoryState}
            accessHistoryPageIndex={history.accessHistoryPageIndex}
            dossierAccessError={dossierAccessError}
            requestDocumentAdd={documentAddRequested}
            focusDeparture={focusDepartureRequested}
            contractExtractionPrototypeEnabled={
              contractExtractionPrototypeEnabled
            }
            onTabChange={(tab) => {
              setDetailTab(tab);
              history.openTab(tab);
            }}
            onClose={() => {
              setSelectedId(null);
              setRecentlySavedEmployee(null);
              setActionTargetEmployee(null);
              setDocumentAddRequested(false);
              setFocusDepartureRequested(false);
              restoreActionFocus(drawerActionOriginRef);
            }}
            onEdit={(origin) => {
              editActionOriginRef.current = origin;
              setEditSuccessMessage(null);
              setEditingEmployee(selectedEmployee);
            }}
            onDeparture={() => setDepartureEmployee(selectedEmployee)}
            onRetryHistory={history.retryHistory}
            onRetryAccessHistory={history.retryAccessHistory}
            onPreviousAccessHistory={history.previousAccessHistory}
            onNextAccessHistory={history.nextAccessHistory}
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
          businessDate={businessDate}
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
