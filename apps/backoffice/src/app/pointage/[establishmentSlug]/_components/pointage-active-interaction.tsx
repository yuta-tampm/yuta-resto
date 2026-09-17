'use client';

import { Alert, Button, Card } from '@yuta/ui';
import {
  pointageCalendarLabel,
  pointageFailureCopy,
  type PointagePresentation,
} from '../_lib/pointage-interaction';

export function PointageActiveInteraction({
  snapshot,
  onMutate,
  onEnd,
  onRecover,
  onRefresh,
}: {
  snapshot: PointagePresentation;
  onMutate: () => Promise<void>;
  onEnd: () => void;
  onRecover: () => Promise<void>;
  onRefresh: () => Promise<void>;
}) {
  return (
    <Card className="min-w-0" padding="lg">
      <section
        aria-label="Situation de pointage"
        className="grid min-w-0 gap-6"
      >
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="grid min-w-0 gap-4"
        >
          {snapshot.phase === 'ACTIVE' && (
            <>
              <h2 className="wrap-anywhere text-lg font-semibold">
                {snapshot.employee.displayName}
              </h2>
              <p>
                {snapshot.employee.status === 'CLOCKED_IN'
                  ? 'Pointé'
                  : 'Non pointé'}
              </p>
              {snapshot.employee.openSessionStart && (
                <p className="wrap-anywhere">
                  Arrivée enregistrée le{' '}
                  {pointageCalendarLabel(
                    snapshot.employee.openSessionStart.instant,
                    snapshot.employee.openSessionStart,
                  )}
                </p>
              )}
            </>
          )}
          {snapshot.phase === 'MUTATION_PENDING' && (
            <p>Enregistrement en cours…</p>
          )}
          {snapshot.phase === 'RECOVERY_PENDING' && (
            <p>Vérification en cours…</p>
          )}
          {snapshot.phase === 'STATE_REFRESH_PENDING' && (
            <p>Actualisation en cours…</p>
          )}
          {snapshot.phase === 'RECEIPT' && (
            <>
              <h2 className="text-lg font-semibold">
                {snapshot.receipt.kind === 'CLOCK_IN'
                  ? 'Arrivée enregistrée'
                  : 'Départ enregistré'}
              </h2>
              <p className="wrap-anywhere">
                {pointageCalendarLabel(
                  snapshot.receipt.acceptedAt,
                  snapshot.receipt,
                )}
              </p>
            </>
          )}
        </div>
        {snapshot.phase === 'FAILURE' && (
          <Alert tone="warning" role="alert">
            {pointageFailureCopy[snapshot.code]}
          </Alert>
        )}
        {snapshot.phase === 'ACTIVE' && (
          <Button
            type="button"
            size="lg"
            fullWidth
            onClick={() => {
              void onMutate();
            }}
          >
            {snapshot.employee.status === 'CLOCKED_IN'
              ? 'Enregistrer mon départ'
              : 'Enregistrer mon arrivée'}
          </Button>
        )}
        {snapshot.phase === 'MUTATION_PENDING' && (
          <Button type="button" size="lg" fullWidth disabled aria-busy="true">
            Enregistrement en cours…
          </Button>
        )}
        {snapshot.phase === 'FAILURE' && snapshot.action && (
          <Button
            type="button"
            size="lg"
            fullWidth
            onClick={() => {
              if (snapshot.action === 'recover') void onRecover();
              else void onRefresh();
            }}
          >
            {snapshot.action === 'recover'
              ? 'Vérifier le résultat'
              : 'Actualiser ma situation'}
          </Button>
        )}
        {(snapshot.phase === 'RECOVERY_PENDING' ||
          snapshot.phase === 'STATE_REFRESH_PENDING') && (
          <Button type="button" size="lg" fullWidth disabled aria-busy="true">
            {snapshot.phase === 'RECOVERY_PENDING'
              ? 'Vérifier le résultat'
              : 'Actualiser ma situation'}
          </Button>
        )}
        <Button
          type="button"
          size="lg"
          variant="secondary"
          fullWidth
          onClick={onEnd}
        >
          Terminer
        </Button>
      </section>
    </Card>
  );
}
