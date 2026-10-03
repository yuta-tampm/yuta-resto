import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ReviewDetailRecord } from '../src/app/(authenticated)/visibilite-reputation/avis/reviews-model';

const mocks = vi.hoisted(() => ({
  actionState: {
    error: null as string | null,
    success: null as string | null,
  },
  pending: false,
  saveReplyDraftAction: vi.fn(),
}));

vi.mock(
  '../src/app/(authenticated)/visibilite-reputation/avis/actions',
  () => ({
    saveReplyDraftAction: mocks.saveReplyDraftAction,
  }),
);
vi.mock('react-dom', () => ({
  useFormStatus: () => ({ pending: mocks.pending }),
}));
vi.mock(
  '../src/app/(authenticated)/visibilite-reputation/avis/publication-actions',
  () => ({
    previewGoogleReplyAction: vi.fn(),
    confirmGoogleReplyAction: vi.fn(),
    reconcileGoogleReplyAction: vi.fn(),
  }),
);
vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react')>();
  return {
    ...actual,
    useActionState: () => [mocks.actionState, vi.fn()],
  };
});

import { ReviewReplyForm } from '../src/app/(authenticated)/visibilite-reputation/avis/_components/review-reply-form';

const review: ReviewDetailRecord = {
  id: 'google-review-1',
  source: 'GOOGLE',
  authorName: 'Client',
  authorAvatarUrl: null,
  rating: 5,
  content: 'Excellent',
  sentiment: null,
  urgency: null,
  status: 'NEW',
  assignedToUserId: null,
  receivedAt: '2026-09-24T12:00:00.000Z',
  incidentId: null,
  replyStatus: 'DRAFT',
  externalUrl: null,
  analysis: null,
  latestReply: {
    id: 'reply-1',
    content: 'Merci pour votre avis.',
    status: 'DRAFT',
  },
  notes: [],
};

function renderForm(canCreateReply = true) {
  return renderToStaticMarkup(
    <ReviewReplyForm review={review} canCreateReply={canCreateReply} />,
  );
}

function submitTag(markup: string) {
  const tag = markup.match(/<button\b[^>]*type="submit"[^>]*>/)?.[0];
  expect(tag).toBeDefined();
  return tag ?? '';
}

describe('ReviewReplyForm pending draft save', () => {
  beforeEach(() => {
    mocks.actionState = { error: null, success: null };
    mocks.pending = false;
    mocks.saveReplyDraftAction.mockReset();
  });

  it('keeps the existing idle label and enabled draft form', () => {
    const markup = renderForm();
    const button = submitTag(markup);

    expect(markup).toContain('>Enregistrer</button>');
    expect(markup).not.toContain('Enregistrement du brouillon…');
    expect(button).not.toContain('disabled=""');
    expect(button).not.toContain('aria-busy');
    expect(button).not.toContain('data-loading');
    expect(markup).toContain('name="feedbackId" value="google-review-1"');
    expect(markup).toContain('name="content"');
    expect(markup.match(/<textarea\b[^>]*>/)?.[0]).not.toContain('disabled=""');
    expect(markup.match(/<form\b[^>]*>/)?.[0]).not.toContain('aria-busy');
  });

  it('uses the same pending status for visible feedback and button semantics', () => {
    mocks.pending = true;
    const markup = renderForm();
    const button = submitTag(markup);

    expect(markup).toContain('>Enregistrement du brouillon…</button>');
    expect(markup).not.toContain('>Enregistrer</button>');
    expect(button).toContain('disabled=""');
    expect(button).toContain('aria-busy="true"');
    expect(button).toContain('data-loading=""');
    expect(markup.match(/<textarea\b[^>]*>/)?.[0]).not.toContain('disabled=""');
    expect(markup.match(/<form\b[^>]*>/)?.[0]).not.toContain('aria-busy');
  });

  it('preserves permission and empty-content disabled paths while idle', () => {
    const forbidden = renderForm(false);
    expect(submitTag(forbidden)).toContain('disabled=""');
    expect(forbidden.match(/<textarea\b[^>]*>/)?.[0]).toContain('disabled=""');

    const empty = renderToStaticMarkup(
      <ReviewReplyForm
        review={{ ...review, latestReply: null }}
        canCreateReply
      />,
    );
    expect(submitTag(empty)).toContain('disabled=""');
    expect(empty.match(/<textarea\b[^>]*>/)?.[0]).not.toContain('disabled=""');
  });

  it('keeps the existing success and error result presentation', () => {
    mocks.actionState = { error: null, success: 'Brouillon enregistré.' };
    const success = renderForm();
    expect(success).toContain('role="status"');
    expect(success).toContain('Brouillon enregistré.');

    mocks.actionState = { error: 'Échec de l’enregistrement.', success: null };
    const error = renderForm();
    expect(error).toContain('role="alert"');
    expect(error).toContain('Échec de l’enregistrement.');
  });

  it('shows manual-only wording and hides publication controls without permission/admission', () => {
    const markup = renderToStaticMarkup(
      <ReviewReplyForm review={review} canCreateReply releaseA />,
    );
    expect(markup).toContain('sans approbation ni publication');
    expect(markup).not.toContain('Vérifier puis publier');
    expect(markup).not.toContain('Vérifier le résultat Google');
    expect(markup).not.toContain('lucide-bot');
    expect(markup).not.toContain('activée avec le connecteur');
  });
  it('shows separate permitted confirmation and truthful pending/unknown results without publishing from render', () => {
    const permitted = {
      ...review,
      canRecoverReference: true,
      latestReply: { ...review.latestReply!, revision: 1 },
    };
    const markup = renderToStaticMarkup(
      <ReviewReplyForm
        review={permitted}
        canCreateReply
        canPublishGoogle
        releaseA
      />,
    );
    expect(markup).toContain('confirmation distincte du texte enregistré');
    const button = markup.match(/<button\b[^>]*type="button"[^>]*>/)?.[0];
    expect(button).not.toContain('disabled=""');
    for (const state of ['PENDING', 'UNCONFIRMED', 'REJECTED'] as const) {
      const receipt = {
        attemptId: 'attempt-1',
        replyId: 'older-reply',
        revision: 1,
        state,
        errorCategory: null,
        confirmedAt: '2030-01-01T00:00:00Z',
        observedAt: null,
        reconciledAt: null,
        superseded: false,
      };
      const result = renderToStaticMarkup(
        <ReviewReplyForm
          review={{ ...permitted, publicationReceipt: receipt }}
          canCreateReply
          canPublishGoogle
          releaseA
        />,
      );
      expect(result).toContain('ancienne version');
      expect(result).not.toContain('Réponse observée et approuvée par Google');
    }
    expect(mocks.saveReplyDraftAction).not.toHaveBeenCalled();
  });
  it('explains changed remote replies and offers fresh confirmation without claiming a write', () => {
    const markup = renderToStaticMarkup(
      <ReviewReplyForm
        review={{
          ...review,
          canRecoverReference: true,
          latestReply: { ...review.latestReply!, revision: 1 },
          publicationReceipt: {
            attemptId: 'attempt-1',
            replyId: 'reply-1',
            revision: 1,
            state: 'FAILED',
            errorCategory: 'REMOTE_CHANGED',
            confirmedAt: '2030-01-01T00:00:00Z',
            observedAt: null,
            reconciledAt: null,
            superseded: false,
          },
        }}
        canCreateReply
        canPublishGoogle
        releaseA
      />,
    );
    expect(markup).toContain('La réponse sur Google a changé');
    expect(markup).toContain('Aucun envoi n’a été effectué');
    expect(markup).toContain('préparez une nouvelle confirmation');
    expect(
      markup.match(/<button\b[^>]*type="button"[^>]*>/)?.[0],
    ).not.toContain('disabled=""');
  });
});
