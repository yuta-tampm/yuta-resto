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
import { useRef, useState, type ComponentProps } from 'react';
import type { ReviewDetailRecord, ReviewsPageData } from '../reviews-model';
import { ReviewDetail } from './review-detail';
import styles from './review-quick-panel.module.css';

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
  const [exitingState, setExitingState] = useState(() => ({
    review,
    loading,
    data,
  }));
  const content = open ? { review, loading, data } : exitingState;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          setExitingState({ review, loading, data });
          onClose();
        }
      }}
    >
      <DialogContent
        variant="right-panel"
        closeLabel="Fermer le détail de l’avis"
        closeClassName="right-3 top-3 flex h-11 w-11 items-center justify-center"
        className={`${styles.content} flex flex-col overflow-hidden bg-surface p-0 sm:max-w-2xl`}
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
          {content.data.state === 'unavailable' ? (
            <ErrorState
              title="Cet avis est momentanément indisponible"
              description="Réessayez dans quelques instants."
              action={
                <Button variant="secondary" onClick={onRetry}>
                  Réessayer
                </Button>
              }
            />
          ) : content.loading ? (
            <div className="grid gap-4 p-4" role="status" aria-live="polite">
              <span className="text-sm text-secondary">
                Chargement de l’avis…
              </span>
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
          ) : content.review ? (
            <ReviewDetail
              key={content.review.id}
              review={content.review}
              assignableUsers={content.data.assignableUsers}
              permissions={content.data.permissions}
              releaseA={content.data.releaseA}
              googleRetrievalAvailable={Boolean(
                content.data.retrievalSummary?.enabled &&
                content.data.retrievalSummary.bound,
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
