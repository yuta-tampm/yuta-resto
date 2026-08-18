'use client';

import type {
  PersonnelActionOverviewCorrectionItem,
  PersonnelActionOverviewDepartureItem,
  PersonnelActionOverviewItemKind,
  PersonnelActionOverviewResponse,
  PersonnelEmployeeSummary,
} from '@yuta/contracts/personnel';
import { Alert, AlertDescription, AlertTitle, Button, Card } from '@yuta/ui';
import {
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  FileWarning,
  LoaderCircle,
  RotateCcw,
  UserRound,
} from 'lucide-react';
import { useEffect, useState, useTransition } from 'react';
import {
  loadPersonnelActionOverviewAction,
  resolvePersonnelActionTargetAction,
} from '../actions';
import { getActionPresentation } from '../employee-action-overview-model';

export type PersonnelActionOverviewState =
  | { status: 'success'; overview: PersonnelActionOverviewResponse }
  | { status: 'error'; message: string };

export function EmployeeActionOverview({
  initialState,
  locale,
  businessDate,
  onTargetReady,
}: {
  initialState: PersonnelActionOverviewState;
  locale: string;
  businessDate: string;
  onTargetReady: (
    kind: PersonnelActionOverviewItemKind,
    employee: PersonnelEmployeeSummary,
    origin: HTMLElement,
  ) => void;
}) {
  const [state, setState] = useState(initialState);
  const [correctionCursors, setCorrectionCursors] = useState<string[]>(['']);
  const [departureCursors, setDepartureCursors] = useState<string[]>(['']);
  const [correctionPage, setCorrectionPage] = useState(0);
  const [departurePage, setDeparturePage] = useState(0);
  const [actionEmployeeId, setActionEmployeeId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isLoading, startLoading] = useTransition();

  useEffect(() => {
    setState(initialState);
    setCorrectionCursors(['']);
    setDepartureCursors(['']);
    setCorrectionPage(0);
    setDeparturePage(0);
  }, [initialState]);

  function load(correctionCursor: string, departureCursor: string) {
    setNotice(null);
    startLoading(async () => {
      const result = await loadPersonnelActionOverviewAction({
        correctionCursor: correctionCursor || undefined,
        departureCursor: departureCursor || undefined,
      });
      setState(
        result.status === 'success'
          ? result
          : { status: 'error', message: result.message },
      );
    });
  }

  function openTarget(
    item:
      | PersonnelActionOverviewCorrectionItem
      | PersonnelActionOverviewDepartureItem,
    origin: HTMLElement,
  ) {
    setNotice(null);
    setActionEmployeeId(item.employeeId);
    void resolvePersonnelActionTargetAction(item.employeeId, item.kind)
      .then((result) => {
        if (result.status === 'ready') {
          onTargetReady(item.kind, result.employee, origin);
          return;
        }
        setNotice(result.message);
        if (result.status === 'changed') {
          load(
            correctionCursors[correctionPage] ?? '',
            departureCursors[departurePage] ?? '',
          );
        }
      })
      .catch(() => setNotice('Impossible d’ouvrir cette action. Réessayez.'))
      .finally(() => setActionEmployeeId(null));
  }

  if (state.status === 'error') {
    return (
      <Card padding="none" className="min-w-0 overflow-hidden">
        <div className="p-4 sm:p-5">
          <h2 className="text-lg font-bold">À traiter</h2>
          <Alert tone="danger" className="mt-3">
            <AlertTitle>Actions indisponibles</AlertTitle>
            <AlertDescription>{state.message}</AlertDescription>
            <div className="mt-3">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                disabled={isLoading}
                onClick={() => load('', '')}
              >
                {isLoading ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden />
                ) : (
                  <RotateCcw className="h-4 w-4" aria-hidden />
                )}
                Réessayer
              </Button>
            </div>
          </Alert>
        </div>
      </Card>
    );
  }

  const { overview } = state;
  const empty =
    overview.corrections.items.length === 0 &&
    overview.departures.items.length === 0;

  return (
    <Card padding="none" className="min-w-0 overflow-hidden">
      <div className="border-b border-border-default p-4 sm:p-5">
        <h2 className="text-lg font-bold">À traiter</h2>
        <p className="mt-1 text-sm text-secondary">
          Actions et échéances à vérifier pour cet établissement.
        </p>
      </div>

      {notice && (
        <Alert tone="info" className="m-4 mb-0" role="status">
          <AlertDescription>{notice}</AlertDescription>
        </Alert>
      )}

      {overview.corrections.documentSourceStatus === 'unavailable' && (
        <Alert tone="warning" className="m-4 mb-0">
          <AlertTitle>Vérification des contrats indisponible</AlertTitle>
          <AlertDescription>
            Les dossiers incomplets restent affichés. Aucun contrat n’est
            signalé comme manquant tant que la vérification échoue.
          </AlertDescription>
        </Alert>
      )}

      {empty ? (
        <div className="p-6 text-center">
          <p className="font-bold">Aucune action immédiate</p>
          <p className="mt-1 text-sm text-secondary">
            Aucun dossier à corriger ni départ dans les cinq prochains jours.
          </p>
        </div>
      ) : (
        <div className="grid min-w-0 lg:grid-cols-2 lg:divide-x lg:divide-border-default">
          <ActionGroup
            id="employee-corrections"
            title="À corriger"
            items={overview.corrections.items}
            page={correctionPage}
            hasMore={overview.corrections.pageInfo.hasMore}
            nextCursor={overview.corrections.pageInfo.nextCursor}
            loading={isLoading}
            actionEmployeeId={actionEmployeeId}
            locale={locale}
            businessDate={businessDate}
            onOpen={openTarget}
            onPrevious={() => {
              const nextPage = Math.max(0, correctionPage - 1);
              setCorrectionPage(nextPage);
              load(
                correctionCursors[nextPage] ?? '',
                departureCursors[departurePage] ?? '',
              );
            }}
            onNext={() => {
              const cursor = overview.corrections.pageInfo.nextCursor;
              if (!cursor) return;
              const nextPage = correctionPage + 1;
              setCorrectionCursors((current) => [
                ...current.slice(0, nextPage),
                cursor,
              ]);
              setCorrectionPage(nextPage);
              load(cursor, departureCursors[departurePage] ?? '');
            }}
          />
          <ActionGroup
            id="employee-departures"
            title="Échéances proches"
            items={overview.departures.items}
            page={departurePage}
            hasMore={overview.departures.pageInfo.hasMore}
            nextCursor={overview.departures.pageInfo.nextCursor}
            loading={isLoading}
            actionEmployeeId={actionEmployeeId}
            locale={locale}
            businessDate={businessDate}
            onOpen={openTarget}
            onPrevious={() => {
              const nextPage = Math.max(0, departurePage - 1);
              setDeparturePage(nextPage);
              load(
                correctionCursors[correctionPage] ?? '',
                departureCursors[nextPage] ?? '',
              );
            }}
            onNext={() => {
              const cursor = overview.departures.pageInfo.nextCursor;
              if (!cursor) return;
              const nextPage = departurePage + 1;
              setDepartureCursors((current) => [
                ...current.slice(0, nextPage),
                cursor,
              ]);
              setDeparturePage(nextPage);
              load(correctionCursors[correctionPage] ?? '', cursor);
            }}
          />
        </div>
      )}
    </Card>
  );
}

function ActionGroup({
  id,
  title,
  items,
  page,
  hasMore,
  nextCursor,
  loading,
  actionEmployeeId,
  locale,
  businessDate,
  onOpen,
  onPrevious,
  onNext,
}: {
  id: string;
  title: string;
  items: ReadonlyArray<
    PersonnelActionOverviewCorrectionItem | PersonnelActionOverviewDepartureItem
  >;
  page: number;
  hasMore: boolean;
  nextCursor: string | null;
  loading: boolean;
  actionEmployeeId: string | null;
  locale: string;
  businessDate: string;
  onOpen: (
    item:
      | PersonnelActionOverviewCorrectionItem
      | PersonnelActionOverviewDepartureItem,
    origin: HTMLElement,
  ) => void;
  onPrevious: () => void;
  onNext: () => void;
}) {
  const warning = id === 'employee-departures';
  return (
    <section className="min-w-0 p-3 sm:p-4" aria-labelledby={`${id}-title`}>
      <h3
        id={`${id}-title`}
        className={
          warning
            ? 'font-bold text-status-warning'
            : 'font-bold text-status-danger'
        }
      >
        {title}
      </h3>
      {items.length === 0 ? (
        <p className="py-5 text-sm text-secondary">Aucun élément.</p>
      ) : (
        <ul className="mt-2 divide-y divide-border-default">
          {items.map((item) => {
            const presentation = getActionPresentation(
              item,
              locale,
              businessDate,
            );
            const busy = actionEmployeeId === item.employeeId;
            return (
              <li
                key={`${item.employeeId}-${item.kind}`}
                className="grid min-w-0 gap-3 py-3 first:pt-2 last:pb-0 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <span
                    className={
                      warning
                        ? 'grid h-9 w-9 shrink-0 place-items-center rounded-full bg-status-warning-soft text-status-warning'
                        : 'grid h-9 w-9 shrink-0 place-items-center rounded-full bg-status-danger-soft text-status-danger'
                    }
                    aria-hidden
                  >
                    {item.kind === 'departure_within_five_days' ? (
                      <CalendarClock className="h-4 w-4" />
                    ) : item.kind === 'missing_signed_base_contract' ? (
                      <FileWarning className="h-4 w-4" />
                    ) : (
                      <UserRound className="h-4 w-4" />
                    )}
                  </span>
                  <div className="min-w-0">
                    <p className="break-words text-sm font-bold text-primary">
                      {item.employeeDisplayName}
                    </p>
                    <p className="mt-0.5 text-sm text-secondary">
                      {presentation.reason}
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  disabled={loading || actionEmployeeId !== null}
                  className="w-full sm:w-auto"
                  onClick={(event) => onOpen(item, event.currentTarget)}
                >
                  {busy && (
                    <LoaderCircle
                      className="h-4 w-4 animate-spin"
                      aria-hidden
                    />
                  )}
                  {presentation.actionLabel}
                </Button>
              </li>
            );
          })}
        </ul>
      )}
      {(page > 0 || hasMore) && (
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-border-default pt-3">
          <Button
            type="button"
            size="sm"
            variant="ghost"
            disabled={page === 0 || loading}
            onClick={onPrevious}
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
            Précédent
          </Button>
          <span className="text-xs text-muted">Page {page + 1}</span>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            disabled={!hasMore || !nextCursor || loading}
            onClick={onNext}
          >
            Suivant
            <ChevronRight className="h-4 w-4" aria-hidden />
          </Button>
        </div>
      )}
    </section>
  );
}
