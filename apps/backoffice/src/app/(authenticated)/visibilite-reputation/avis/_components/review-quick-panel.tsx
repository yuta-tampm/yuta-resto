'use client';

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  EmptyState,
  ErrorState,
  Skeleton,
} from '@yuta/ui';
import { useRef, type ComponentProps } from 'react';
import type { ReviewDetailRecord, ReviewsPageData } from '../reviews-model';
import { ReviewDetail } from './review-detail';

export function ReviewQuickPanel({
  open,
  review,
  loading,
  data,
  onClose,
  onRetry,
  onCloseAutoFocus,
}: {
  open: boolean;
  review: ReviewDetailRecord | null;
  loading: boolean;
  data: ReviewsPageData;
  onClose: () => void;
  onRetry: () => void;
  onCloseAutoFocus: ComponentProps<typeof DialogContent>['onCloseAutoFocus'];
}) {
  const titleRef = useRef<HTMLHeadingElement>(null);

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent
        variant="right-panel"
        closeLabel="Fermer le détail de l’avis"
        closeClassName="right-3 top-3 flex h-11 w-11 items-center justify-center"
        className="flex flex-col overflow-hidden bg-surface p-0 sm:max-w-2xl"
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          titleRef.current?.focus();
        }}
        onCloseAutoFocus={onCloseAutoFocus}
      >
        <DialogHeader className="shrink-0 border-b border-border-default p-4 pr-16 text-left">
          <DialogTitle ref={titleRef} tabIndex={-1}>
            Détail de l’avis
          </DialogTitle>
          <DialogDescription>
            Consultez l’avis et enregistrez votre traitement.
          </DialogDescription>
        </DialogHeader>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          {data.state === 'unavailable' ? (
            <ErrorState
              title="Cet avis est momentanément indisponible"
              description="Réessayez dans quelques instants."
              action={
                <Button variant="secondary" onClick={onRetry}>
                  Réessayer
                </Button>
              }
            />
          ) : loading ? (
            <div className="grid gap-4 p-4" role="status" aria-live="polite">
              <span className="text-sm text-secondary">
                Chargement de l’avis…
              </span>
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
          ) : review ? (
            <ReviewDetail
              key={review.id}
              review={review}
              assignableUsers={data.assignableUsers}
              permissions={data.permissions}
              releaseA={data.releaseA}
              googleRetrievalAvailable={Boolean(
                data.retrievalSummary?.enabled && data.retrievalSummary.bound,
              )}
              className="rounded-none border-0 shadow-none xl:static"
            />
          ) : (
            <EmptyState
              title="Cet avis n’est pas disponible"
              description="Fermez le détail et choisissez un avis accessible dans la liste."
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
