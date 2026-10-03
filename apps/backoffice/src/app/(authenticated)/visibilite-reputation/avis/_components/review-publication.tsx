'use client';
import { useEffect, useRef, useState, useTransition } from 'react';
import { useFormStatus } from 'react-dom';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@yuta/ui';
import { Send } from 'lucide-react';
import type {
  GoogleReplyPreviewResponse,
  GoogleReplyPublicationReceipt,
  GoogleReplyPublicationState,
} from '@yuta/contracts/reputation';
import {
  confirmGoogleReplyAction,
  previewGoogleReplyAction,
  reconcileGoogleReplyAction,
} from '../publication-actions';
import type { ReviewDetailRecord } from '../reviews-model';

const labels: Record<GoogleReplyPublicationState, string> = {
  PREVIEW: 'Confirmation à vérifier',
  DISPATCHING: 'Envoi en cours — résultat à vérifier',
  UNCERTAIN: 'Résultat de l’envoi indéterminé',
  FAILED: 'Envoi refusé ou non effectué',
  UNCONFIRMED: 'Visibilité et résultat Google à confirmer',
  PENDING: 'Google a reçu la réponse — en attente de validation',
  REJECTED: 'Réponse refusée par Google',
  APPROVED: 'Réponse observée et approuvée par Google',
};
const recovery: Record<
  NonNullable<GoogleReplyPublicationReceipt['errorCategory']>,
  string
> = {
  PREVIEW_EXPIRED:
    'La confirmation a expiré avant l’envoi. Aucun envoi n’a été effectué. Vérifiez à nouveau la réponse puis préparez une nouvelle confirmation.',
  REMOTE_CHANGED:
    'La réponse sur Google a changé depuis votre vérification. Aucun envoi n’a été effectué. Vérifiez la nouvelle réponse puis préparez une nouvelle confirmation.',
  AUTH_REQUIRED:
    'La connexion Google doit être renouvelée par le propriétaire avant de préparer une nouvelle confirmation.',
  PROVIDER_REJECTED:
    'Google a refusé la demande. Vérifiez la connexion et le contenu avant une nouvelle confirmation.',
  PROVIDER_UNAVAILABLE:
    'Google ou le réseau est indisponible. Vérifiez le résultat Google avant toute nouvelle tentative.',
  INVALID_RESPONSE:
    'Le résultat Google n’a pas pu être interprété. Vérifiez le résultat Google avant toute nouvelle tentative.',
};
export function ReviewPublication({
  review,
  enabled,
  unsaved,
}: {
  review: ReviewDetailRecord;
  enabled: boolean;
  unsaved: boolean;
}) {
  const [preview, setPreview] = useState<GoogleReplyPreviewResponse | null>(
    null,
  );
  const [localReceipt, setReceipt] =
    useState<GoogleReplyPublicationReceipt | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expired, setExpired] = useState(false);
  const [pending, startTransition] = useTransition();
  const { pending: saving } = useFormStatus();
  const trigger = useRef<HTMLButtonElement>(null);
  const receipt = localReceipt ?? review.publicationReceipt;
  const unresolved =
    receipt &&
    ['DISPATCHING', 'UNCERTAIN', 'UNCONFIRMED'].includes(receipt.state);
  useEffect(() => {
    const update = () =>
      setExpired(
        Boolean(preview && Date.parse(preview.expiresAt) <= Date.now()),
      );
    update();
    if (!preview) return;
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [preview]);
  function prepare(retry = false) {
    const replyId = retry ? receipt?.replyId : review.latestReply?.id;
    const revision = retry ? receipt?.revision : review.latestReply?.revision;
    if (!replyId || !revision) return;
    setError(null);
    startTransition(async () => {
      try {
        const result = await previewGoogleReplyAction({
          feedbackId: review.id,
          replyId,
          revision,
          ...(retry && receipt ? { retryParentId: receipt.attemptId } : {}),
        });
        setPreview(result.value);
        setError(result.error);
      } catch {
        setError(
          'Votre accès a changé. Reconnectez-vous avant de préparer une réponse.',
        );
      }
    });
  }
  function confirm() {
    if (!preview || unsaved || Date.parse(preview.expiresAt) <= Date.now())
      return;
    const attemptId = preview.attemptId;
    startTransition(async () => {
      try {
        const result = await confirmGoogleReplyAction({ attemptId });
        setReceipt(result.value);
        setError(result.error);
        setPreview(null);
      } catch {
        setPreview(null);
        setError(
          'Le résultat n’est pas connu. Rechargez la page puis vérifiez Google avant toute nouvelle tentative.',
        );
      }
    });
  }
  function reconcile() {
    if (!receipt) return;
    setError(null);
    startTransition(async () => {
      try {
        const result = await reconcileGoogleReplyAction({
          attemptId: receipt.attemptId,
        });
        setReceipt(result.value);
        setError(result.error);
      } catch {
        setError(
          'La vérification est indisponible. Votre travail est conservé.',
        );
      }
    });
  }
  return (
    <div className="min-w-0">
      <Button
        ref={trigger}
        type="button"
        fullWidth
        loading={pending}
        disabled={
          !enabled ||
          !review.canRecoverReference ||
          !review.latestReply?.revision ||
          unsaved ||
          saving ||
          pending ||
          Boolean(unresolved)
        }
        onClick={() => prepare()}
      >
        <Send className="h-4 w-4" aria-hidden />
        Vérifier puis publier
      </Button>
      {enabled && unsaved && (
        <p className="mt-2 text-xs text-muted">
          Enregistrez les modifications avant de préparer la confirmation.
        </p>
      )}
      {receipt && (
        <div className="mt-3 space-y-2 text-sm" role="status">
          <p className="font-semibold">{labels[receipt.state]}</p>
          {receipt.errorCategory && <p>{recovery[receipt.errorCategory]}</p>}
          {receipt.replyId !== review.latestReply?.id && (
            <p>
              Ce résultat concerne une ancienne version. Votre nouveau brouillon
              reste indépendant.
            </p>
          )}
          {receipt.observedAt && (
            <p className="text-xs text-muted">
              Observation Google :{' '}
              {new Date(receipt.observedAt).toLocaleString('fr-FR')}.
            </p>
          )}
          <p className="text-xs text-muted">
            Un envoi ou un texte local ne prouve pas sa visibilité publique.
            Aucune nouvelle tentative n’est automatique.
          </p>
          {enabled && (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              loading={pending}
              disabled={pending || saving}
              onClick={reconcile}
            >
              Vérifier le résultat Google
            </Button>
          )}
          {enabled &&
            receipt.reconciledAt &&
            ['UNCERTAIN', 'UNCONFIRMED'].includes(receipt.state) && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                disabled={pending || saving || unsaved}
                onClick={() => prepare(true)}
              >
                Vérifier une nouvelle tentative du même texte
              </Button>
            )}
        </div>
      )}
      {error && (
        <p role="alert" className="mt-2 text-sm text-status-danger">
          {error}
        </p>
      )}
      <Dialog
        open={Boolean(preview)}
        onOpenChange={(open) => {
          if (!open && !pending) setPreview(null);
        }}
      >
        <DialogContent
          closeLabel="Fermer la confirmation"
          className="max-h-[90dvh] w-[calc(100%-2rem)] overflow-y-auto"
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            trigger.current?.focus();
          }}
          onEscapeKeyDown={(event) => {
            if (pending) event.preventDefault();
          }}
          onInteractOutside={(event) => {
            if (pending) event.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle>Confirmer la réponse sur Google</DialogTitle>
            <DialogDescription>
              Cette réponse sera envoyée à l’avis sélectionné de l’établissement
              actif. Elle peut devenir publique sur Google et remplacera toute
              réponse existante.
            </DialogDescription>
          </DialogHeader>
          {preview && (
            <div className="my-4 space-y-4 text-sm">
              <p>
                Établissement : <strong>{preview.establishmentName}</strong>.
              </p>
              <p>
                Avis de <strong>{review.authorName ?? 'Client Google'}</strong>
                {review.rating ? ` — ${review.rating}/5` : ''}.
              </p>
              {preview.retry && (
                <p className="font-semibold">
                  Nouvelle tentative du même texte enregistré. Le résultat de
                  l’envoi précédent reste indéterminé.
                </p>
              )}
              {preview.remoteReply && (
                <section>
                  <h3 className="font-semibold">
                    Réponse actuellement observée sur Google
                  </h3>
                  <p className="mt-2 whitespace-pre-wrap break-words rounded-lg bg-surface-muted p-3">
                    {preview.remoteReply.content}
                  </p>
                </section>
              )}
              <section>
                <h3 className="font-semibold">
                  Texte exact à envoyer — version {preview.revision}
                </h3>
                <p className="mt-2 whitespace-pre-wrap break-words rounded-lg border border-border-default p-3">
                  {preview.text}
                </p>
              </section>
              <p className="text-xs text-muted">
                Confirmation valable jusqu’à{' '}
                {new Date(preview.expiresAt).toLocaleTimeString('fr-FR')}.
                Google peut retarder ou refuser sa validation. Une autre
                personne peut modifier la réponse sur Google entre la
                vérification et l’envoi.
              </p>
              {unsaved && (
                <p role="alert">
                  Le texte a changé. Fermez puis enregistrez et vérifiez la
                  nouvelle version.
                </p>
              )}
              {expired && (
                <p role="alert">
                  La confirmation a expiré. Fermez puis vérifiez à nouveau la
                  réponse.
                </p>
              )}
            </div>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              disabled={pending}
              onClick={() => setPreview(null)}
            >
              Annuler
            </Button>
            <Button
              type="button"
              loading={pending}
              disabled={pending || unsaved || expired}
              onClick={confirm}
            >
              {pending ? 'Envoi en cours…' : 'Confirmer et envoyer à Google'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
