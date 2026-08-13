'use client';

import type {
  PersonnelCompletenessFilter,
  PersonnelEmployeeListQuery,
  PersonnelEmployeeListResponse,
  PersonnelEmployeeSummary,
  PersonnelEmployeeView,
} from '@yuta/contracts/personnel';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
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
  SimpleTable,
  SimpleTableBody,
  SimpleTableCell,
  SimpleTableHead,
  SimpleTableHeader,
  SimpleTableRow,
  cn,
} from '@yuta/ui';
import {
  CheckCircle2,
  ChevronRight,
  Database,
  FileWarning,
  Plus,
  Search,
  UsersRound,
  X,
} from 'lucide-react';
import { useEffect, useState, useTransition, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { EmployeeCreateDialog } from './employee-create-dialog';
import {
  formatEmployeeDate,
  getContractSummary,
  getEmployeeInitials,
  getEmployeeName,
  getWorkTimeLabel,
  isEmployeeComplete,
} from './salaries-model';

type DetailTab = 'overview' | 'identity' | 'employment';

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
}: {
  data: PersonnelEmployeeListResponse;
  query: PersonnelEmployeeListQuery;
  locale: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState(query.search);
  const [selectedId, setSelectedId] = useState<string | null>(
    data.items[0]?.id ?? null,
  );
  const [detailTab, setDetailTab] = useState<DetailTab>('overview');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  useEffect(() => {
    if (!data.items.some((employee) => employee.id === selectedId)) {
      setSelectedId(data.items[0]?.id ?? null);
      setDetailTab('overview');
    }
  }, [data.items, selectedId]);

  const selectedEmployee =
    data.items.find((employee) => employee.id === selectedId) ?? null;
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
    if (next.cursor) params.set('cursor', next.cursor);
    startTransition(() => router.push(`/equipe/salaries?${params.toString()}`));
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    navigate({ search: search.trim(), cursor: undefined });
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
        <Button size="lg" onClick={() => setCreateDialogOpen(true)}>
          <Plus className="h-5 w-5" aria-hidden />
          Ajouter un salarié
        </Button>
      </header>

      <Alert tone="info" icon={<Database className="h-5 w-5" aria-hidden />}>
        <AlertTitle>Liste connectée aux données de l’établissement</AlertTitle>
        <AlertDescription>
          Les données de démonstration ont été retirées. L’ajout enregistre
          maintenant le dossier minimum et son historique. La modification et le
          départ restent désactivés à cette étape.
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

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
        <Card padding="none" className="min-w-0 overflow-hidden">
          <div className="border-b border-border-default p-4">
            <form
              className="flex flex-col gap-3 lg:flex-row"
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

          {data.items.length === 0 ? (
            <EmptyState
              icon={<UsersRound className="h-9 w-9" aria-hidden />}
              title={
                isFirstUse ? 'Aucun salarié pour le moment' : 'Aucun résultat'
              }
              description={
                isFirstUse
                  ? 'La base est prête, mais aucun dossier salarié n’a encore été enregistré.'
                  : 'Modifiez la recherche, la vue ou le filtre.'
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
              employees={data.items}
              selectedId={selectedId}
              locale={locale}
              onSelect={(id) => {
                setSelectedId(id);
                setDetailTab('overview');
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
            onTabChange={setDetailTab}
            onClose={() => setSelectedId(null)}
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
    </div>
  );
}

function EmployeeList({
  employees,
  selectedId,
  locale,
  onSelect,
}: {
  employees: readonly PersonnelEmployeeSummary[];
  selectedId: string | null;
  locale: string;
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
                  {getContractSummary(employee)}
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
          <button
            key={employee.id}
            type="button"
            onClick={() => onSelect(employee.id)}
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
              <CompletenessBadge employee={employee} />
            </span>
            <span className="mt-3 block text-xs font-medium text-secondary">
              Entrée : {formatEmployeeDate(employee.entryDate, locale)}
            </span>
          </button>
        ))}
      </div>
    </>
  );
}

function EmployeeDetails({
  employee,
  activeTab,
  locale,
  onTabChange,
  onClose,
}: {
  employee: PersonnelEmployeeSummary;
  activeTab: DetailTab;
  locale: string;
  onTabChange: (tab: DetailTab) => void;
  onClose: () => void;
}) {
  const tabs: ReadonlyArray<{ value: DetailTab; label: string }> = [
    { value: 'overview', label: 'Vue d’ensemble' },
    { value: 'identity', label: 'Identité' },
    { value: 'employment', label: 'Relation de travail' },
  ];
  return (
    <Card padding="none" className="overflow-hidden xl:sticky xl:top-4">
      <div className="flex items-start justify-between gap-4 border-b border-border-default p-5">
        <div className="flex min-w-0 items-center gap-3">
          <EmployeeAvatar employee={employee} large />
          <div className="min-w-0">
            <h2 className="truncate text-lg font-black">
              {getEmployeeName(employee)}
            </h2>
            <p className="text-sm text-secondary">{employee.position}</p>
            <div className="mt-2">
              <EmploymentBadge employee={employee} />
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md p-2 text-secondary hover:bg-surface-muted focus:outline-none focus:ring-2 focus:ring-focus-ring"
        >
          <X className="h-4 w-4" aria-hidden />
          <span className="sr-only">Fermer l’aperçu</span>
        </button>
      </div>
      <nav
        className="flex gap-1 overflow-x-auto border-b border-border-default px-3"
        aria-label="Dossier salarié"
      >
        {tabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => onTabChange(tab.value)}
            className={cn(
              'shrink-0 border-b-2 px-2 py-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-focus-ring',
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
      <div className="p-5">
        {activeTab === 'overview' && (
          <DetailSection title="Informations clés">
            <DetailRow
              label="Entrée"
              value={formatEmployeeDate(employee.entryDate, locale)}
            />
            {employee.expectedEndDate && (
              <DetailRow
                label="Fin attendue"
                value={formatEmployeeDate(employee.expectedEndDate, locale)}
              />
            )}
            {employee.departureDate && (
              <DetailRow
                label="Départ"
                value={formatEmployeeDate(employee.departureDate, locale)}
              />
            )}
            <DetailRow
              label="Temps de travail"
              value={getWorkTimeLabel(employee)}
            />
            <DetailRow
              label="Dossier"
              value={<CompletenessBadge employee={employee} />}
            />
          </DetailSection>
        )}
        {activeTab === 'identity' && (
          <DetailSection title="Identité minimale">
            <DetailRow label="Prénoms" value={employee.givenNames} />
            <DetailRow label="Nom" value={employee.familyName} />
          </DetailSection>
        )}
        {activeTab === 'employment' && (
          <DetailSection title="Relation de travail">
            <DetailRow label="Poste" value={employee.position} />
            <DetailRow label="Qualification" value={employee.qualification} />
            <DetailRow label="Contrat" value={getContractSummary(employee)} />
            <DetailRow
              label="Temps de travail"
              value={getWorkTimeLabel(employee)}
            />
          </DetailSection>
        )}
      </div>
    </Card>
  );
}

function DetailSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-border-default p-4">
      <h3 className="text-sm font-bold">{title}</h3>
      <div className="mt-4 grid gap-3">{children}</div>
    </section>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 text-sm">
      <span className="text-secondary">{label}</span>
      <span className="text-right font-semibold">{value}</span>
    </div>
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

function EmploymentBadge({ employee }: { employee: PersonnelEmployeeSummary }) {
  const config = {
    active: { label: 'Actif', tone: 'success' },
    upcoming: { label: 'Entrée à venir', tone: 'info' },
    former: { label: 'Ancien salarié', tone: 'neutral' },
  } as const;
  return (
    <Badge tone={config[employee.view].tone}>
      {config[employee.view].label}
    </Badge>
  );
}
