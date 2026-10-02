'use client';

import type {
  GoogleReviewRetrievalInput,
  GoogleReviewRetrievalOutcome,
  GoogleReviewRetrievalSummary,
} from '@yuta/contracts/reputation';
import { Button, Card } from '@yuta/ui';
import { RefreshCw } from 'lucide-react';
import { useEffect, useRef, useState, useTransition } from 'react';
import { retrieveGoogleReviewsAction } from '../actions';
import type { ReviewDetailRecord } from '../reviews-model';
import { formatAbsoluteDate } from '../reviews-model';
import { isGoogleContentUnavailable } from './review-presentation';

export function googleRetrievalMessage(
  summary: GoogleReviewRetrievalSummary,
  outcome: GoogleReviewRetrievalOutcome | null = null,
): string {
  if (!summary.enabled)
    return 'La récupération Google n’est pas encore disponible pour votre établissement. Votre travail dans YUTA reste accessible.';
  if (!summary.bound)
    return 'Demandez au propriétaire de préparer la connexion Google. Aucun résultat de récupération n’est confirmé.';
  if (outcome?.kind === 'no_reference')
    return 'Le lien de récupération de cet avis n’est plus disponible. Votre travail dans YUTA est conservé.';
  if (outcome?.kind === 'invalid_continuation')
    return 'La suite de cette récupération n’est plus disponible. Actualisez les avis récemment mis à jour avant de demander une autre page.';
  if (summary.state === 'pending' || outcome?.kind === 'pending')
    return 'Récupération des avis Google en cours. Vous pouvez continuer votre travail dans YUTA.';
  if (summary.state === 'failed' || outcome?.kind === 'failed') {
    if (summary.lastError === 'NOT_FOUND')
      return 'Avis indisponible sur Google. Votre travail dans YUTA est conservé.';
    if (
      summary.lastError === 'AUTH_REQUIRED' ||
      summary.lastError === 'FORBIDDEN'
    )
      return 'L’accès Google doit être vérifié par le propriétaire. Votre travail dans YUTA est conservé.';
    if (
      summary.lastError === 'IDENTITY_CONFLICT' ||
      summary.lastError === 'STALE_AUTHORITY'
    )
      return 'La connexion ou l’association de cet avis doit être vérifiée. Aucun travail YUTA n’a été remplacé.';
    return 'La récupération Google a échoué. Réessayez ; votre travail et les copies encore disponibles sont conservés.';
  }
  if (outcome?.kind === 'completed')
    return `${outcome.addedCount ?? 0} avis ajoutés, ${outcome.changedCount ?? 0} avis modifiés. Consultez la liste mise à jour quand vous êtes prêt.`;
  if (summary.state === 'completed_empty')
    return summary.lastAttemptKind === 'history'
      ? 'La dernière page demandée ne contenait aucun avis. Cela ne signifie pas que l’établissement n’a aucun avis sur Google.'
      : summary.lastAttemptKind === 'detail'
        ? 'Le contenu de cet avis n’est pas disponible. Votre travail dans YUTA est conservé.'
        : 'La dernière récupération des avis récemment mis à jour n’a renvoyé aucun avis.';
  if (summary.state === 'completed_content')
    return 'Les avis récupérés sont disponibles. Les changements Google sont consultés séparément de vos notes et brouillons.';
  if (summary.state === 'unavailable')
    return 'Le contenu Google n’est pas disponible. Votre travail dans YUTA est conservé.';
  return 'Aucune récupération des avis Google n’est encore confirmée pour cette connexion.';
}

export function GoogleReviewRetrievalPanel({
  summary,
  review,
  selectionIntent,
  onBeforeRetrieval,
  onInspect,
  hasHeldView = false,
}: {
  summary: GoogleReviewRetrievalSummary | null;
  review: ReviewDetailRecord | null;
  selectionIntent: string | null;
  onBeforeRetrieval: () => void;
  onInspect: () => void;
  hasHeldView?: boolean;
}) {
  const [outcome, setOutcome] = useState<GoogleReviewRetrievalOutcome | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const busy = useRef(false);
  const visitStarted = useRef(false);
  const inspectedDetails = useRef(new Set<string>());
  const initialVisit = useRef({ summary, review });
  const current = outcome?.summary ?? summary;

  async function perform(input: GoogleReviewRetrievalInput) {
    if (busy.current) return;
    busy.current = true;
    setError(null);
    onBeforeRetrieval();
    try {
      const result = await retrieveGoogleReviewsAction(input);
      setOutcome(result.outcome);
      setError(result.error);
    } catch {
      setError(
        'La récupération est indisponible. Votre travail dans YUTA est conservé. Réessayez ou contactez votre responsable.',
      );
    } finally {
      busy.current = false;
    }
  }

  useEffect(() => {
    if (visitStarted.current) return;
    visitStarted.current = true;
    const initial = initialVisit.current;
    if (initial.review) inspectedDetails.current.add(initial.review.id);
    if (!initial.summary?.enabled || !initial.summary.bound) return;
    // A mounted visit is the only automatic recent trigger; filters and Save never rerun it.
    startTransition(async () => {
      if (
        initial.review &&
        isGoogleContentUnavailable(initial.review) &&
        initial.review.canRecoverReference
      ) {
        await perform({ kind: 'detail', feedbackId: initial.review.id });
      }
      const freshAt = initial.summary?.lastRecentSuccessAt;
      if (
        !initial.summary?.currentContentAvailable ||
        !freshAt ||
        Date.now() - new Date(freshAt).getTime() >= 15 * 60_000
      ) {
        await perform({ kind: 'recent', trigger: 'visit' });
      }
    });
  }, []);

  useEffect(() => {
    if (
      pending ||
      busy.current ||
      !current?.enabled ||
      !current.bound ||
      !review ||
      review.id !== selectionIntent ||
      inspectedDetails.current.has(review.id)
    )
      return;
    inspectedDetails.current.add(review.id);
    // Only explicit item opening creates a new detail intent, never filter-driven selection.
    if (isGoogleContentUnavailable(review) && review.canRecoverReference) {
      startTransition(async () => {
        await perform({ kind: 'detail', feedbackId: review.id });
      });
    }
  }, [selectionIntent, review, pending, current]);

  if (!current) {
    return (
      <Card>
        <p role="status" className="text-sm text-secondary">
          L’état de la récupération Google est indisponible. Votre travail dans
          YUTA reste accessible.
        </p>
      </Card>
    );
  }
  const fetching = pending || current.state === 'pending';
  const enabled = current.enabled && current.bound && !fetching;
  function inspect() {
    // The next persisted receipt owns the state after explicit inspection.
    setOutcome(null);
    setError(null);
    onInspect();
  }
  return (
    <Card className="space-y-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 space-y-2">
          <h2 className="font-bold">Récupération des avis Google</h2>
          <p className="text-sm text-secondary">
            Jusqu’à 50 avis récemment mis à jour par page. Votre historique de
            travail YUTA est conservé séparément.
          </p>
          <p
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className="text-sm text-secondary"
          >
            {pending
              ? 'Récupération des avis Google en cours. Vous pouvez continuer votre travail dans YUTA.'
              : googleRetrievalMessage(current, outcome)}
          </p>
          {current.lastRecentSuccessAt && (
            <p className="text-xs text-muted">
              Dernière page récente récupérée :{' '}
              {formatAbsoluteDate(current.lastRecentSuccessAt)}.
            </p>
          )}
          {current.coverage === 'partial' && (
            <p className="text-xs text-muted">
              Historique partiellement chargé. Des pages supplémentaires peuvent
              être demandées.
            </p>
          )}
          {current.coverage === 'end' && (
            <p className="text-xs text-muted">
              Fin des pages de cette récupération. Le travail YUTA peut aussi
              contenir des avis dont le contenu Google n’est plus disponible.
            </p>
          )}
        </div>
        <Button
          variant="secondary"
          loading={pending}
          disabled={!enabled}
          onClick={() =>
            startTransition(async () => {
              await perform({ kind: 'recent', trigger: 'manual' });
            })
          }
        >
          <RefreshCw className="h-4 w-4" aria-hidden />
          Actualiser
        </Button>
      </div>
      {error && (
        <p role="alert" className="text-sm text-status-danger">
          {error}
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        {current.continuationHandle && (
          <Button
            variant="outline"
            disabled={!enabled}
            onClick={() =>
              startTransition(async () => {
                if (current.continuationHandle)
                  await perform({
                    kind: 'history',
                    continuationHandle: current.continuationHandle,
                  });
              })
            }
          >
            Voir plus d’avis
          </Button>
        )}
        {review &&
          isGoogleContentUnavailable(review) &&
          review.canRecoverReference && (
            <Button
              variant="outline"
              disabled={!enabled}
              onClick={() =>
                startTransition(async () => {
                  await perform({ kind: 'detail', feedbackId: review.id });
                })
              }
            >
              Récupérer cet avis
            </Button>
          )}
        {(outcome?.kind === 'completed' || hasHeldView) && (
          <Button variant="outline" disabled={pending} onClick={inspect}>
            Voir la liste mise à jour
          </Button>
        )}
        {current.state === 'pending' && !pending && (
          <Button variant="outline" onClick={inspect}>
            Vérifier l’état
          </Button>
        )}
      </div>
    </Card>
  );
}
