import type {
  PersonnelEmployeeUnifiedHistory,
  PersonnelEmployeeUnifiedHistoryEvent,
} from '@yuta/contracts/personnel';
import { Alert, AlertDescription, AlertTitle, Button } from '@yuta/ui';
import { Clock3, Database, LoaderCircle, RotateCcw } from 'lucide-react';
import {
  employeeHistoryClassificationLabels,
  employeeHistoryGroupLabels,
  employeeLegacyHistoryEventLabel,
  employeeLegacyHistoryFieldLabel,
  formatEmployeeHistoryDateTime,
  getEmployeeHistoryValueRows,
  type EmployeeHistoryGroup,
  type EmployeeHistoryValueSide,
} from '../_lib/employee-history-presentation';
import { formatEmployeeDate } from '../salaries-model';

export type EmployeeHistoryLoadState =
  | { status: 'idle' | 'loading'; history: null; message: null }
  | {
      status: 'success';
      history: PersonnelEmployeeUnifiedHistory;
      message: null;
    }
  | { status: 'error'; history: null; message: string };

export function EmployeeHistory({
  state,
  locale,
  onRetry,
}: {
  state: EmployeeHistoryLoadState;
  locale: string;
  onRetry: () => void;
}) {
  if (state.status === 'idle' || state.status === 'loading') {
    return (
      <HistorySection>
        <p
          className="flex items-center gap-2 text-sm text-secondary"
          role="status"
        >
          <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden />
          Chargement de l’historique…
        </p>
      </HistorySection>
    );
  }
  if (state.status === 'error') {
    return (
      <HistorySection>
        <Alert tone="danger">
          <AlertTitle>Historique indisponible</AlertTitle>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
        <Button type="button" variant="secondary" size="sm" onClick={onRetry}>
          <RotateCcw className="h-4 w-4" aria-hidden />
          Réessayer
        </Button>
      </HistorySection>
    );
  }
  const history = state.history;
  if (!history) return null;
  if (history.items.length === 0) {
    return (
      <HistorySection>
        <p className="text-sm text-secondary">
          Aucun événement n’a encore été enregistré pour ce dossier.
        </p>
      </HistorySection>
    );
  }
  return (
    <HistorySection>
      <ol className="grid gap-4">
        {history.items.map((event) => (
          <li key={event.id}>
            <HistoryEvent event={event} locale={locale} />
          </li>
        ))}
      </ol>
      {history.truncated && (
        <p className="mt-4 text-xs text-secondary">
          Seuls les 50 événements les plus récents sont affichés.
        </p>
      )}
    </HistorySection>
  );
}

function HistorySection({ children }: { children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border-default bg-surface p-5 shadow-sm">
      <h3 className="text-lg font-bold">Historique du dossier</h3>
      <div className="mt-4 grid gap-3">{children}</div>
    </section>
  );
}

function HistoryEvent({
  event,
  locale,
}: {
  event: PersonnelEmployeeUnifiedHistoryEvent;
  locale: string;
}) {
  if (event.kind === 'legacy') {
    return <LegacyHistoryEvent event={event} locale={locale} />;
  }
  if (event.kind === 'cutover_baseline') {
    return (
      <article className="rounded-lg border border-border-default p-4">
        <HistoryEventHeading
          icon={<Database className="h-4 w-4" aria-hidden />}
          title="Début de l’historisation"
          metadata={`${formatEmployeeHistoryDateTime(event.occurredAt, locale)} · Système`}
        />
        <p className="mt-3 text-sm text-secondary">
          Valeurs actuelles au début de l’historisation.
        </p>
        <div className="mt-4 grid gap-3">
          {event.groups.map((group) => (
            <HistoryGroupValues
              key={group.semanticGroup}
              group={group}
              side="current"
              locale={locale}
            />
          ))}
        </div>
      </article>
    );
  }
  return (
    <article className="rounded-lg border border-border-default p-4">
      <HistoryEventHeading
        icon={<Clock3 className="h-4 w-4" aria-hidden />}
        title="Modification du dossier"
        metadata={`${formatEmployeeHistoryDateTime(event.occurredAt, locale)} · ${event.actorDisplayName ?? 'Utilisateur supprimé'}`}
      />
      <div className="mt-4 grid gap-4">
        {event.groups.map((group) => (
          <div
            key={group.semanticGroup}
            className="rounded-lg bg-surface-muted p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="font-bold">
                {employeeHistoryGroupLabels[group.semanticGroup]}
              </h4>
              <span className="rounded-full bg-surface px-2.5 py-1 text-xs font-semibold text-secondary">
                {employeeHistoryClassificationLabels[group.classification]}
              </span>
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <HistoryGroupValues
                group={group}
                side="previous"
                locale={locale}
                title="Valeur précédente"
              />
              <HistoryGroupValues
                group={group}
                side="new"
                locale={locale}
                title="Nouvelle valeur"
              />
            </div>
            {(group.effectiveDate || group.correctionReason) && (
              <dl className="mt-3 grid gap-2 border-t border-border-default pt-3 text-sm">
                {group.effectiveDate && (
                  <div className="flex flex-wrap justify-between gap-2">
                    <dt className="text-secondary">Date d’effet</dt>
                    <dd className="font-medium">
                      {formatEmployeeDate(group.effectiveDate, locale)}
                    </dd>
                  </div>
                )}
                {group.correctionReason && (
                  <div>
                    <dt className="text-secondary">Motif de la correction</dt>
                    <dd className="mt-1 font-medium">
                      {group.correctionReason}
                    </dd>
                  </div>
                )}
              </dl>
            )}
          </div>
        ))}
      </div>
    </article>
  );
}

function HistoryGroupValues({
  group,
  side,
  locale,
  title,
}: {
  group: EmployeeHistoryGroup;
  side: EmployeeHistoryValueSide;
  locale: string;
  title?: string;
}) {
  const rows = getEmployeeHistoryValueRows(group, side, locale);
  return (
    <div className="rounded-md border border-border-default bg-surface p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-secondary">
        {title ?? employeeHistoryGroupLabels[group.semanticGroup]}
      </p>
      <dl className="mt-2 grid gap-2 text-sm">
        {rows.map((row) => (
          <div key={row.label} className="flex flex-wrap justify-between gap-2">
            <dt className="text-secondary">{row.label}</dt>
            <dd className="max-w-[65%] break-words text-right font-medium">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function LegacyHistoryEvent({
  event,
  locale,
}: {
  event: Extract<PersonnelEmployeeUnifiedHistoryEvent, { kind: 'legacy' }>;
  locale: string;
}) {
  return (
    <article className="flex gap-3 rounded-lg border border-border-default p-4">
      <span className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-surface-muted text-secondary">
        <Clock3 className="h-3.5 w-3.5" aria-hidden />
      </span>
      <div className="min-w-0 text-sm">
        <p className="font-bold">
          {employeeLegacyHistoryEventLabel(event.eventType)}
        </p>
        <p className="mt-1 text-xs text-secondary">
          {formatEmployeeHistoryDateTime(event.occurredAt, locale)} ·{' '}
          {event.actorDisplayName ?? 'Utilisateur supprimé'}
        </p>
        {event.changedFields.length > 0 && (
          <p className="mt-2 text-xs text-secondary">
            Champs :{' '}
            {event.changedFields
              .map(employeeLegacyHistoryFieldLabel)
              .join(', ')}
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
    </article>
  );
}

function HistoryEventHeading({
  icon,
  title,
  metadata,
}: {
  icon: React.ReactNode;
  title: string;
  metadata: string;
}) {
  return (
    <div className="flex gap-3">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-surface-muted text-secondary">
        {icon}
      </span>
      <div>
        <h4 className="font-bold">{title}</h4>
        <p className="mt-1 text-xs text-secondary">{metadata}</p>
      </div>
    </div>
  );
}
