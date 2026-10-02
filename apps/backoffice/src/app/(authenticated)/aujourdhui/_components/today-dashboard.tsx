import { Alert, AlertTitle, AlertDescription, Button, cn } from '@yuta/ui';
import { CalendarPlus } from 'lucide-react';
import Link from 'next/link';
import type { TodayDashboardData } from '../today-data';
import { TodayReservationsPanel } from './today-reservations-panel';
import { TodayReviewsPanel } from './today-reviews-panel';
import { TodayServicesPanel } from './today-services-panel';
import { TodaySummaryCards } from './today-summary-cards';
import { formatLocalDateHeading } from '../today-view-model';

export function TodayDashboard({ data }: { data: TodayDashboardData }) {
  return (
    <div className="flex w-full flex-col gap-6">
      <header className="flex flex-col gap-4 border-b border-border-default pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-muted">
            {formatLocalDateHeading(data.localDate, data.locale)}
          </p>
          <h1 className="mt-1 text-3xl font-black tracking-tight">
            Bonjour, {data.displayName}.
          </h1>
          <p className="mt-1 text-sm text-secondary">
            Voici votre plan d’action pour aujourd’hui.
          </p>
        </div>
        {data.bookingEnabled && (
          <Button asChild variant="success" className="self-start lg:self-end">
            <Link
              href={`/reservations?date=${data.localDate}`}
              aria-label="Ajouter une réservation"
            >
              <CalendarPlus className="h-4 w-4" aria-hidden />
              Ajouter une réservation
            </Link>
          </Button>
        )}
      </header>

      <TodaySummaryCards data={data} />
      {data.setupSummary && (
        <Alert tone="info">
          <AlertTitle>{data.setupSummary.title}</AlertTitle>
          <AlertDescription>
            {data.setupSummary.description}
            {data.setupSummary.setupHref && (
              <Button asChild variant="secondary" size="sm" className="mt-3">
                <Link href={data.setupSummary.setupHref}>
                  Préparer la connexion Google
                </Link>
              </Button>
            )}
          </AlertDescription>
        </Alert>
      )}

      <section
        className={cn(
          'grid items-start gap-5',
          !data.releaseA &&
            'xl:grid-cols-[minmax(0,1.45fr)_minmax(19rem,0.75fr)]',
        )}
      >
        {!data.releaseA && data.bookingEnabled && (
          <TodayReservationsPanel
            section={data.reservations}
            localDate={data.localDate}
          />
        )}

        <aside className="grid gap-5">
          {!data.releaseA && data.bookingEnabled && (
            <TodayServicesPanel
              section={data.services}
              canManageSettings={data.canManageBookingSettings}
            />
          )}
          {data.reviews.state !== 'hidden' && (
            <TodayReviewsPanel
              section={data.reviews}
              releaseA={data.releaseA}
            />
          )}
        </aside>
      </section>
    </div>
  );
}
