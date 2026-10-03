import type { AssignableReputationUser } from '@yuta/contracts/cloud-admin';
import { Avatar, Badge, Button, Card, IconButton, cn } from '@yuta/ui';
import { ExternalLink, UserRound } from 'lucide-react';
import { ReviewAnalysisSection } from './review-analysis-section';
import { ReviewManagementForm } from './review-management-form';
import { ReviewNotesSection } from './review-notes-section';
import {
  ReviewRating,
  ReviewSourceMark,
  isGoogleContentUnavailable,
  reviewAuthorLabel,
  reviewContentLabel,
} from './review-presentation';
import { ReviewReplyForm } from './review-reply-form';
import {
  formatRelativeDate,
  getInitials,
  statusLabels,
  statusTones,
  type ReviewDetailRecord,
  type ReviewsPageData,
} from '../reviews-model';

export function ReviewDetail({
  review,
  assignableUsers,
  permissions,
  releaseA = false,
  googleRetrievalAvailable = false,
  className,
}: {
  review: ReviewDetailRecord;
  assignableUsers: AssignableReputationUser[];
  permissions: ReviewsPageData['permissions'];
  releaseA?: boolean;
  googleRetrievalAvailable?: boolean;
  className?: string;
}) {
  return (
    <Card
      padding="none"
      className={cn('overflow-hidden xl:sticky xl:top-0', className)}
    >
      <div className="flex items-center justify-between border-b border-border-default p-4">
        <div className="flex items-center gap-3">
          <ReviewSourceMark source={review.source} />
          <div>
            <p className="font-bold">
              {review.source === 'GOOGLE' ? 'Avis Google' : 'Retour direct'}
            </p>
            <p className="text-xs text-muted">
              {formatRelativeDate(review.receivedAt)}
            </p>
          </div>
        </div>
        {review.source === 'GOOGLE' && review.externalUrl && (
          <IconButton asChild variant="ghost" aria-label="Ouvrir sur Google">
            <a href={review.externalUrl} target="_blank" rel="noreferrer">
              <ExternalLink className="h-4 w-4" />
            </a>
          </IconButton>
        )}
      </div>

      <section className="p-4">
        <div className="rounded-lg border border-border-default p-4">
          <div className="flex items-center gap-3">
            <Avatar
              fallback={getInitials(review.authorName)}
              src={review.authorAvatarUrl}
            />
            <div className="flex-1">
              <p className="font-bold">{reviewAuthorLabel(review)}</p>
              {review.rating && <ReviewRating value={review.rating} />}
            </div>
            <Badge tone={statusTones[review.status]}>
              {statusLabels[review.status]}
            </Badge>
          </div>
          <p className="mt-4 text-sm leading-6">{reviewContentLabel(review)}</p>
          {review.googleReviewChanged && (
            <Badge className="mt-3" tone="warning">
              Avis modifié — à vérifier
            </Badge>
          )}
          {isGoogleContentUnavailable(review) && (
            <p className="mt-3 text-sm text-secondary">
              {permissions.canRetrieveGoogle &&
              review.canRecoverReference &&
              googleRetrievalAvailable
                ? 'La récupération de cet avis peut être réessayée depuis les commandes Google.'
                : permissions.canRetrieveGoogle && review.canRecoverReference
                  ? 'La récupération Google est actuellement indisponible. Contactez le propriétaire ou le support YUTA ; votre travail reste accessible.'
                  : permissions.canRetrieveGoogle
                    ? 'Le lien de récupération n’est plus disponible. Contactez le propriétaire ou le support YUTA pour examiner la situation.'
                    : 'Demandez au propriétaire ou à un responsable de vérifier cet avis. Vous pouvez continuer votre travail dans YUTA.'}
            </p>
          )}
        </div>
      </section>

      {review.remoteReply && (
        <section className="border-t border-border-default p-4">
          <h2 className="font-bold">
            Réponse actuellement récupérée sur Google
          </h2>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-6">
            {review.remoteReply.content}
          </p>
          <p className="mt-2 text-xs text-muted">
            Copie temporaire distincte de votre brouillon YUTA. Elle ne confirme
            aucune publication depuis YUTA.
          </p>
        </section>
      )}

      <ReviewManagementForm
        review={review}
        assignableUsers={assignableUsers}
        canManageFeedback={permissions.canManageFeedback}
      />
      {!releaseA && <ReviewAnalysisSection review={review} />}
      {review.source === 'GOOGLE' && (
        <ReviewReplyForm
          review={review}
          canCreateReply={permissions.canCreateReply}
          releaseA={releaseA}
        />
      )}
      <ReviewNotesSection
        review={review}
        canCreateNote={permissions.canCreateNote}
      />

      {review.source === 'DIRECT' && (
        <section className="border-t border-border-default p-4">
          <Button variant="secondary" fullWidth disabled>
            <UserRound className="h-4 w-4" />
            Créer un incident
          </Button>
        </section>
      )}
    </Card>
  );
}
