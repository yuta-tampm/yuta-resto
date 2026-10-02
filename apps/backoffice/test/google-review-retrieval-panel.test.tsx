import type { GoogleReviewRetrievalSummary } from '@yuta/contracts/reputation';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock(
  '../src/app/(authenticated)/visibilite-reputation/avis/actions',
  () => ({
    retrieveGoogleReviewsAction: vi.fn(),
  }),
);

import {
  GoogleReviewRetrievalPanel,
  googleRetrievalMessage,
} from '../src/app/(authenticated)/visibilite-reputation/avis/_components/google-review-retrieval-panel';
import { ReviewDetail } from '../src/app/(authenticated)/visibilite-reputation/avis/_components/review-detail';
import type { ReviewDetailRecord } from '../src/app/(authenticated)/visibilite-reputation/avis/reviews-model';

vi.mock(
  '../src/app/(authenticated)/visibilite-reputation/avis/_components/review-management-form',
  () => ({ ReviewManagementForm: () => null }),
);
vi.mock(
  '../src/app/(authenticated)/visibilite-reputation/avis/_components/review-notes-section',
  () => ({ ReviewNotesSection: () => null }),
);
vi.mock(
  '../src/app/(authenticated)/visibilite-reputation/avis/_components/review-reply-form',
  () => ({ ReviewReplyForm: () => null }),
);

const summary: GoogleReviewRetrievalSummary = {
  state: 'never',
  enabled: true,
  bound: true,
  lastAttemptKind: null,
  lastAttemptAt: null,
  lastSuccessfulAt: null,
  lastRecentSuccessAt: null,
  lastError: null,
  coverage: 'none',
  continuationHandle: null,
  lastBatchCount: null,
  currentContentAvailable: false,
};

const review: ReviewDetailRecord = {
  id: '00000000-0000-4000-8000-000000000001',
  source: 'GOOGLE',
  authorName: null,
  authorAvatarUrl: null,
  rating: null,
  content: null,
  sentiment: null,
  urgency: null,
  status: 'DRAFTED',
  assignedToUserId: null,
  receivedAt: '2026-10-01T10:00:00.000Z',
  incidentId: null,
  replyStatus: 'DRAFT',
  externalUrl: null,
  analysis: null,
  latestReply: null,
  notes: [],
  googleContentAvailability: 'unavailable',
  canRecoverReference: true,
};

function renderPanel(overrides: Partial<GoogleReviewRetrievalSummary> = {}) {
  return renderToStaticMarkup(
    <GoogleReviewRetrievalPanel
      summary={{ ...summary, ...overrides }}
      review={review}
      selectionIntent={review.id}
      onBeforeRetrieval={() => {}}
      onInspect={() => {}}
    />,
  );
}

describe('Google review retrieval presentation', () => {
  it('distinguishes never, disabled and first empty success without inventing freshness', () => {
    expect(googleRetrievalMessage(summary)).toContain('Aucune récupération');
    expect(googleRetrievalMessage({ ...summary, enabled: false })).toContain(
      'pas encore disponible',
    );
    expect(
      googleRetrievalMessage({
        ...summary,
        state: 'completed_empty',
        lastAttemptKind: 'recent',
      }),
    ).toContain('n’a renvoyé aucun avis');
    expect(renderPanel()).not.toContain('Dernière page récente récupérée');
  });

  it('does not call an empty older page zero reviews or extend recent freshness', () => {
    expect(
      googleRetrievalMessage({
        ...summary,
        state: 'completed_empty',
        lastAttemptKind: 'history',
      }),
    ).toContain('Cela ne signifie pas');
    const markup = renderPanel({
      coverage: 'partial',
      continuationHandle: '00000000-0000-4000-8000-000000000002',
    });
    expect(markup).toContain('Voir plus d’avis');
    expect(markup).toContain('Historique partiellement chargé');
    expect(markup).toContain('récemment mis à jour');
  });

  it('announces pending without disabling or replacing local editors', () => {
    const markup = renderPanel({ state: 'pending' });
    expect(markup).toContain('aria-live="polite"');
    expect(markup).toContain('Vous pouvez continuer votre travail');
    expect(markup).toContain('Vérifier l’état');
    expect(markup.match(/<button[^>]*>/)?.[0]).toContain('disabled=""');
  });

  it('offers explicit inspection for added/changed work and truthful safe errors', () => {
    expect(
      googleRetrievalMessage(summary, {
        kind: 'completed',
        summary,
        addedCount: 2,
        changedCount: 1,
      }),
    ).toContain('2 avis ajoutés, 1 avis modifiés');
    expect(
      googleRetrievalMessage(summary, {
        kind: 'invalid_continuation',
        summary,
        addedCount: null,
        changedCount: null,
      }),
    ).toContain('n’est plus disponible');
    expect(
      googleRetrievalMessage({
        ...summary,
        state: 'failed',
        lastError: 'NOT_FOUND',
      }),
    ).toContain('Avis indisponible sur Google');
    expect(
      googleRetrievalMessage({
        ...summary,
        state: 'failed',
        lastError: 'NOT_FOUND',
      }),
    ).not.toContain('supprimé');
  });

  it('shows absent content and STAFF handoff instead of an empty customer review', () => {
    const markup = renderToStaticMarkup(
      <ReviewDetail
        review={review}
        assignableUsers={[]}
        permissions={{
          canManageFeedback: false,
          canCreateNote: true,
          canCreateReply: true,
          canRetrieveGoogle: false,
        }}
        releaseA
      />,
    );
    expect(markup).toContain('Contenu Google indisponible');
    expect(markup).toContain('Votre travail dans YUTA est conservé');
    expect(markup).toContain('Demandez au propriétaire');
    expect(markup).not.toContain('Client anonyme');
    expect(markup).not.toContain('Aucun commentaire');
  });

  it('does not promise a detail retry while retrieval admission is disabled', () => {
    const markup = renderToStaticMarkup(
      <ReviewDetail
        review={review}
        assignableUsers={[]}
        permissions={{
          canManageFeedback: true,
          canCreateNote: true,
          canCreateReply: true,
          canRetrieveGoogle: true,
        }}
        googleRetrievalAvailable={false}
        releaseA
      />,
    );
    expect(markup).toContain(
      'récupération Google est actuellement indisponible',
    );
    expect(markup).not.toContain('depuis les commandes Google');
  });

  it('presents temporary remote replies separately without claiming YUTA publication', () => {
    const markup = renderToStaticMarkup(
      <ReviewDetail
        review={{
          ...review,
          googleContentAvailability: 'available',
          googleReviewChanged: true,
          remoteReply: {
            content: 'Synthetic remote reply',
            updatedAt: '2026-10-01T10:00:00.000Z',
            status: null,
          },
        }}
        assignableUsers={[]}
        permissions={{
          canManageFeedback: true,
          canCreateNote: true,
          canCreateReply: true,
          canRetrieveGoogle: true,
        }}
        releaseA
      />,
    );
    expect(markup).toContain('Avis modifié — à vérifier');
    expect(markup).toContain('Réponse actuellement récupérée sur Google');
    expect(markup).toContain('Synthetic remote reply');
    expect(markup).toContain('ne confirme aucune publication depuis YUTA');
  });
});
