'use client';

import {
  Button,
  Card,
  EmptyState,
  ErrorState,
  MetricCard,
  PageHeader,
  Alert,
  AlertTitle,
  AlertDescription,
} from '@yuta/ui';
import { MessageCircle, RefreshCw, Settings } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { ReviewDetail } from './review-detail';
import { ReviewsListPanel } from './reviews-list-panel';
import { GoogleReviewRetrievalPanel } from './google-review-retrieval-panel';
import type {
  ReviewsPageData,
  ReviewsPageMode,
  UpdateReviewsQuery,
} from '../reviews-model';

export function ReviewsPage({
  data,
  mode = 'all',
}: {
  data: ReviewsPageData;
  mode?: ReviewsPageMode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const currentSearchParams = useSearchParams();
  const directOnly = mode === 'direct';
  const [selectionIntent, setSelectionIntent] = useState(
    data.detail?.id ?? null,
  );
  const [heldView, setHeldView] = useState<Pick<
    ReviewsPageData,
    'items' | 'detail' | 'pagination' | 'counters' | 'attentionCount'
  > | null>(null);
  const viewData: ReviewsPageData =
    heldView && data.permissions.canRetrieveGoogle
      ? {
          ...data,
          ...heldView,
          items: heldView.items.flatMap((item) => {
            const latest = data.items.find((current) => current.id === item.id);
            // Keep order, but always honor current scoped/expiry projections and local changes.
            return latest ? [latest] : [];
          }),
          detail: data.detail,
        }
      : data;

  function holdWorkingView() {
    setHeldView(
      (current) =>
        current ?? {
          items: data.items,
          detail: data.detail,
          pagination: data.pagination,
          counters: data.counters,
          attentionCount: data.attentionCount,
        },
    );
    // Pin the local work identity before any later local Save revalidates this route.
    const workingIds = (heldView?.items ?? data.items)
      .map((item) => item.id)
      .join(',');
    if (
      (data.detail && currentSearchParams.get('selected') !== data.detail.id) ||
      (workingIds && currentSearchParams.get('working') !== workingIds)
    ) {
      const params = new URLSearchParams(currentSearchParams.toString());
      if (data.detail) params.set('selected', data.detail.id);
      if (workingIds) params.set('working', workingIds);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }

  function inspectUpdatedList() {
    setHeldView(null);
    const params = new URLSearchParams(currentSearchParams.toString());
    if (params.has('working')) {
      params.delete('working');
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    } else router.refresh();
  }

  const updateQuery: UpdateReviewsQuery = (updates, options) => {
    setHeldView(null);
    if (!Object.hasOwn(updates, 'selected')) setSelectionIntent(null);
    const params = new URLSearchParams(currentSearchParams.toString());
    params.delete('working');
    for (const [key, value] of Object.entries(updates)) {
      if (value === null || value === '' || value === 'ALL') {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    }
    if (!options?.keepSelected) params.delete('selected');
    if (!Object.hasOwn(updates, 'page')) params.delete('page');
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex w-full flex-col gap-5">
      <PageHeader
        eyebrow="Visibilité & réputation"
        title={directOnly ? 'Satisfaction client' : 'Avis & commentaires'}
        description={
          directOnly
            ? 'Consultez les avis transmis directement par vos clients sur le web.'
            : data.releaseA
              ? 'Consultez et traitez les avis Google enregistrés dans YUTA.'
              : 'Centralisez les avis Google et les retours directs de vos clients.'
        }
        actions={
          directOnly || data.releaseA ? undefined : (
            <>
              <Button variant="secondary" disabled>
                <RefreshCw className="h-4 w-4" />
                Synchroniser
              </Button>
              <Button variant="secondary" disabled>
                <Settings className="h-4 w-4" />
                Paramètres
              </Button>
            </>
          )
        }
      />

      {data.state === 'unavailable' && (
        <Card padding="none">
          <ErrorState
            title="Les avis sont momentanément indisponibles"
            description={
              data.releaseA
                ? 'Réessayez dans quelques instants. Si le problème persiste, contactez votre responsable ou le support YUTA.'
                : 'Vérifiez la base locale, appliquez les migrations et relancez le seed.'
            }
            action={
              data.releaseA ? (
                <Button variant="secondary" onClick={() => router.refresh()}>
                  Réessayer
                </Button>
              ) : undefined
            }
          />
        </Card>
      )}

      {data.state === 'ready' && (
        <>
          <ReviewsMetrics data={viewData} directOnly={directOnly} />
          {!directOnly && data.permissions.canRetrieveGoogle && (
            <GoogleReviewRetrievalPanel
              summary={data.retrievalSummary ?? null}
              review={viewData.detail}
              selectionIntent={selectionIntent}
              onBeforeRetrieval={holdWorkingView}
              onInspect={inspectUpdatedList}
              hasHeldView={Boolean(
                heldView || currentSearchParams.has('working'),
              )}
            />
          )}
          {data.setupSummary && (
            <Alert tone="info">
              <AlertTitle>{data.setupSummary.title}</AlertTitle>
              <AlertDescription>
                {data.setupSummary.description}
                {data.setupSummary.setupHref && (
                  <Button
                    asChild
                    variant="secondary"
                    size="sm"
                    className="mt-3"
                  >
                    <Link href={data.setupSummary.setupHref}>
                      Préparer la connexion Google
                    </Link>
                  </Button>
                )}
              </AlertDescription>
            </Alert>
          )}

          <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(420px,0.85fr)]">
            <ReviewsListPanel
              data={viewData}
              directOnly={directOnly}
              updateQuery={updateQuery}
              onOpenReview={setSelectionIntent}
            />

            {viewData.detail ? (
              <ReviewDetail
                key={viewData.detail.id}
                review={viewData.detail}
                assignableUsers={data.assignableUsers}
                permissions={data.permissions}
                releaseA={data.releaseA}
                googleRetrievalAvailable={Boolean(
                  data.retrievalSummary?.enabled && data.retrievalSummary.bound,
                )}
              />
            ) : (
              <Card padding="none">
                <EmptyState
                  icon={<MessageCircle className="mx-auto h-8 w-8" />}
                  title={
                    data.selectedUnavailable
                      ? 'Cet avis n’est pas disponible'
                      : 'Sélectionnez un avis'
                  }
                  description={
                    data.selectedUnavailable
                      ? 'Choisissez un avis accessible dans la liste.'
                      : undefined
                  }
                />
              </Card>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function ReviewsMetrics({
  data,
  directOnly,
}: {
  data: ReviewsPageData;
  directOnly: boolean;
}) {
  if (data.releaseA) {
    return (
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <MetricCard
          label="Total"
          value={data.counters.total}
          helper="Avis Google enregistrés dans YUTA"
        />
        <MetricCard
          label="Nouveaux"
          value={data.counters.new}
          helper="Statut Nouveau dans YUTA"
        />
        <MetricCard
          label="À traiter"
          value={data.attentionCount}
          helper="Nouveau, à traiter, brouillon ou à suivre"
        />
      </section>
    );
  }
  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      <MetricCard
        label="Total"
        value={data.counters.total}
        helper={directOnly ? 'Retours directs' : 'Google et retours directs'}
      />
      <MetricCard
        label="Nouveaux"
        value={data.counters.new}
        helper="À consulter"
      />
      <MetricCard
        label="Sans réponse"
        value={data.counters.unanswered ?? 0}
        helper="Action recommandée"
      />
      <MetricCard
        label="Négatifs"
        value={data.counters.negative ?? 0}
        helper="À surveiller"
      />
      <MetricCard
        label="Avec incident"
        value={data.counters.withIncident ?? 0}
        helper="Suivi opérationnel"
      />
    </section>
  );
}
