import { describe, expect, it } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { TodayReviewsPanel } from '../src/app/(authenticated)/aujourdhui/_components/today-reviews-panel';
import {
  BOOKING_SCHEDULE_HREF,
  getLocalDateTimeParts,
  getServiceState,
  isActiveTodayReservation,
  reservationStatusPresentation,
  resolveServicePeriodForToday,
  projectTodayReviewPreview,
} from '../src/app/(authenticated)/aujourdhui/today-view-model';
import { formatTimeRange } from '../src/lib/local-time';

describe('today view model', () => {
  it('links booking schedule management to its canonical owner', () => {
    expect(BOOKING_SCHEDULE_HREF).toBe(
      '/etablissement/horaires-services#horaires-hebdomadaires',
    );
  });

  it('derives the establishment date and time across a UTC day boundary', () => {
    expect(
      getLocalDateTimeParts(
        'Europe/Paris',
        new Date('2026-08-06T23:30:00.000Z'),
      ),
    ).toEqual({
      localDate: '2026-08-07',
      localTime: '01:30',
      dayOfWeek: 5,
    });
  });

  it.each([
    ['PENDING', true],
    ['CONFIRMED', true],
    ['SEATED', true],
    ['COMPLETED', false],
    ['CANCELLED', false],
    ['NO_SHOW', false],
  ] as const)('classifies %s reservations', (status, expected) => {
    expect(isActiveTodayReservation(status)).toBe(expected);
  });

  it('derives upcoming, current, and completed service states', () => {
    expect(getServiceState('11:00', '14:00', '10:59')).toBe('upcoming');
    expect(getServiceState('11:00', '14:00', '11:00')).toBe('current');
    expect(getServiceState('11:00', '14:00', '13:59')).toBe('current');
    expect(getServiceState('11:00', '14:00', '14:00')).toBe('completed');
  });

  it('applies dated booking closures and modified hours', () => {
    const period = {
      id: 'lunch',
      startTime: '11:30:00',
      endTime: '14:00:00',
      capacity: 40,
    };
    expect(
      resolveServicePeriodForToday(period, [
        {
          kind: 'MODIFIED_HOURS',
          servicePeriodId: 'lunch',
          startTime: '12:00:00',
          endTime: '15:00:00',
          capacityOverride: 24,
        },
      ]),
    ).toEqual({
      ...period,
      startTime: '12:00:00',
      endTime: '15:00:00',
      capacity: 24,
    });
    expect(
      resolveServicePeriodForToday(period, [
        {
          kind: 'CLOSED_ALL_DAY',
          servicePeriodId: null,
          startTime: null,
          endTime: null,
          capacityOverride: null,
        },
      ]),
    ).toBeNull();
  });

  it('provides stable French status labels and time ranges', () => {
    expect(reservationStatusPresentation('CONFIRMED')).toEqual({
      label: 'Confirmée',
      tone: 'success',
    });
    expect(formatTimeRange('11:30', '14:00')).toBe('11:30–14:00');
  });
});

describe('Today minimized Google content availability', () => {
  const now = new Date('2026-10-01T12:00:00.000Z');
  const item = {
    id: 'local-work-id',
    source: 'GOOGLE' as const,
    authorName: 'Synthetic author',
    rating: 5,
    content: 'Synthetic current Google content',
    receivedAt: new Date('2026-10-01T11:00:00Z'),
  };

  it('keeps unavailable managed local work explicit without anonymous/empty-content placeholders or stale fields', () => {
    const preview = projectTodayReviewPreview(
      { ...item, googleContentAvailability: 'unavailable' },
      now,
      'fr-FR',
    );
    expect(preview).toEqual({
      id: 'local-work-id',
      source: 'GOOGLE',
      authorName: 'Avis Google',
      rating: null,
      excerpt:
        'Le contenu Google n’est pas disponible. Votre travail dans YUTA est conservé.',
      receivedLabel: 'Travail YUTA conservé',
      googleContentAvailability: 'unavailable',
    });
    expect(JSON.stringify(preview)).not.toMatch(
      /Synthetic|Client anonyme|Aucun commentaire/u,
    );
  });

  it('renders the unavailable-content notice and preserves the local-work link without a fabricated rating', () => {
    const preview = projectTodayReviewPreview(
      { ...item, googleContentAvailability: 'unavailable' },
      now,
      'fr-FR',
    );
    const markup = renderToStaticMarkup(
      createElement(TodayReviewsPanel, {
        releaseA: true,
        section: {
          state: 'ready',
          data: { attentionCount: 1, items: [preview] },
        },
      }),
    );
    expect(markup).toContain('Contenu indisponible');
    expect(markup).toContain('Votre travail dans YUTA est conservé.');
    expect(markup).toContain(
      '/visibilite-reputation/avis?selected=local-work-id',
    );
    expect(markup).not.toContain('sur 5');
    expect(markup).not.toContain('Aucun commentaire.');
  });

  it('uses currently available provider fields and own local received date', () => {
    expect(
      projectTodayReviewPreview(
        { ...item, googleContentAvailability: 'available' },
        now,
        'fr-FR',
      ),
    ).toMatchObject({
      authorName: 'Synthetic author',
      rating: 5,
      excerpt: 'Synthetic current Google content',
      googleContentAvailability: 'available',
      receivedLabel: 'il y a 1 heure',
    });
  });

  it('keeps a valid available review without a comment distinct from unavailable content', () => {
    expect(
      projectTodayReviewPreview(
        { ...item, content: null, googleContentAvailability: 'available' },
        now,
        'fr-FR',
      ),
    ).toMatchObject({
      excerpt: 'Aucun commentaire.',
      googleContentAvailability: 'available',
      rating: 5,
    });
  });

  it('preserves legacy Google and DIRECT presentation without classifying them as managed cache', () => {
    expect(
      projectTodayReviewPreview(
        { ...item, authorName: null, content: null },
        now,
        'fr-FR',
      ),
    ).toMatchObject({
      authorName: 'Client anonyme',
      excerpt: 'Aucun commentaire.',
      googleContentAvailability: 'legacy',
    });
    expect(
      projectTodayReviewPreview(
        { ...item, source: 'DIRECT', googleContentAvailability: 'unavailable' },
        now,
        'fr-FR',
      ),
    ).toMatchObject({
      authorName: 'Synthetic author',
      excerpt: 'Synthetic current Google content',
      googleContentAvailability: 'not_applicable',
    });
  });

  it('serializes only the rendered local-work preview fields', () => {
    const preview = projectTodayReviewPreview(
      {
        ...item,
        ...{
          reviewName: 'provider-private',
          remoteReply: 'provider-private',
          note: 'local-private',
        },
      },
      now,
      'fr-FR',
    );
    expect(JSON.stringify(preview)).not.toContain('private');
    expect(Object.keys(preview).sort()).toEqual(
      [
        'authorName',
        'excerpt',
        'googleContentAvailability',
        'id',
        'rating',
        'receivedLabel',
        'source',
      ].sort(),
    );
  });
});
