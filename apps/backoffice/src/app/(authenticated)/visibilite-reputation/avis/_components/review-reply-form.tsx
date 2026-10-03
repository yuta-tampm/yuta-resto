'use client';

import { Button, Badge, Textarea } from '@yuta/ui';
import { Bot, FilePenLine } from 'lucide-react';
import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { saveReplyDraftAction } from '../actions';
import {
  initialReputationActionState,
  ReviewActionMessage,
} from './review-action-feedback';
import type { ReviewDetailRecord } from '../reviews-model';
import { ReviewPublication } from './review-publication';

export function ReviewReplyForm({
  review,
  canCreateReply,
  canPublishGoogle = false,
  releaseA = false,
}: {
  review: ReviewDetailRecord;
  canCreateReply: boolean;
  canPublishGoogle?: boolean;
  releaseA?: boolean;
}) {
  const [state, action] = useActionState(
    saveReplyDraftAction,
    initialReputationActionState,
  );
  const [reply, setReply] = useState(review.latestReply?.content ?? '');

  return (
    <form action={action} className="border-t border-border-default p-4">
      <input type="hidden" name="feedbackId" value={review.id} />
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 font-bold text-brand-800">
          {releaseA ? (
            <FilePenLine className="h-4 w-4" aria-hidden />
          ) : (
            <Bot className="h-4 w-4" />
          )}
          Brouillon de réponse
        </h2>
        {review.latestReply && (
          <Badge variant="outline">{review.latestReply.status}</Badge>
        )}
      </div>
      <Textarea
        name="content"
        value={reply}
        onChange={(event) => setReply(event.target.value)}
        placeholder="Rédigez une réponse manuelle…"
        className="mt-3 min-h-40 leading-6"
        maxLength={4_000}
        disabled={!canCreateReply}
      />
      <p className="mt-2 text-xs text-muted">
        {canPublishGoogle
          ? 'Enregistrer conserve un brouillon dans YUTA. Une confirmation distincte du texte enregistré est nécessaire avant tout envoi à Google.'
          : 'Enregistrer conserve un brouillon dans YUTA, sans approbation ni publication.'}
      </p>
      <ReviewActionMessage state={state} />
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <ReplySubmit disabled={!canCreateReply || reply.trim().length === 0} />
        {canPublishGoogle && (
          <ReviewPublication
            key={`${review.id}:${review.latestReply?.id}:${review.latestReply?.revision}:${review.publicationReceipt?.attemptId}:${review.publicationReceipt?.state}:${review.publicationReceipt?.reconciledAt}`}
            review={review}
            enabled={canPublishGoogle}
            unsaved={reply !== (review.latestReply?.content ?? '')}
          />
        )}
      </div>
    </form>
  );
}

function ReplySubmit({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant="secondary"
      loading={pending}
      disabled={disabled || pending}
    >
      <FilePenLine className="h-4 w-4" />
      {pending ? 'Enregistrement du brouillon…' : 'Enregistrer'}
    </Button>
  );
}
