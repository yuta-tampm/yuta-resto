import type {
  PersonnelEmployeeAccessEvent,
  PersonnelEmployeeAccessHistory,
} from '@yuta/contracts/personnel';
import { Alert, AlertDescription, AlertTitle, Button } from '@yuta/ui';
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  LoaderCircle,
  RotateCcw,
} from 'lucide-react';
import { type EmployeeHistoryLoadingState } from '../_lib/employee-history-loading';
import { formatEmployeeHistoryDateTime } from '../_lib/employee-history-presentation';
import { DetailSection } from './employee-presentation';

export type AccessHistoryLoadState =
  EmployeeHistoryLoadingState<PersonnelEmployeeAccessHistory>;

export function EmployeeAccessHistory({
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
                {formatEmployeeHistoryDateTime(event.occurredAt, locale)} ·{' '}
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

export function accessEventLabel(
  eventType: PersonnelEmployeeAccessEvent['eventType'],
): string {
  const labels: Record<PersonnelEmployeeAccessEvent['eventType'], string> = {
    'employee.dossier_viewed': 'Dossier consulté',
    'employee.history_viewed': 'Historique des modifications consulté',
    'employee.access_history_viewed': 'Historique des consultations consulté',
  };
  return labels[eventType];
}
