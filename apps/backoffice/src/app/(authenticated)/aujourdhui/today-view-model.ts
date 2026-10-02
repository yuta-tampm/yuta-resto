import type { GoogleReviewContentAvailability } from '@yuta/contracts/reputation';
import { getDateInTimezone } from '@/lib/local-time';

export type TodayReviewPreview = {
  id: string;
  source: 'GOOGLE' | 'DIRECT';
  authorName: string;
  rating: number | null;
  excerpt: string;
  receivedLabel: string;
  googleContentAvailability: GoogleReviewContentAvailability;
};

export function projectTodayReviewPreview(
  item: {
    id: string;
    source: 'GOOGLE' | 'DIRECT';
    authorName: string | null;
    rating: number | null;
    content: string | null;
    receivedAt: Date;
    googleContentAvailability?: GoogleReviewContentAvailability;
  },
  now: Date,
  locale: string,
): TodayReviewPreview {
  const availability =
    item.source === 'GOOGLE'
      ? (item.googleContentAvailability ?? 'legacy')
      : 'not_applicable';
  const unavailable = availability === 'unavailable';
  return {
    id: item.id,
    source: item.source,
    authorName: unavailable
      ? 'Avis Google'
      : (item.authorName ?? 'Client anonyme'),
    rating: unavailable ? null : item.rating,
    excerpt: unavailable
      ? 'Le contenu Google n’est pas disponible. Votre travail dans YUTA est conservé.'
      : item.content || 'Aucun commentaire.',
    receivedLabel: unavailable
      ? 'Travail YUTA conservé'
      : formatRelativeTime(item.receivedAt, now, locale),
    googleContentAvailability: availability,
  };
}

export const activeReservationStatuses = [
  'PENDING',
  'CONFIRMED',
  'SEATED',
] as const;

export type TodayReservationTone = 'success' | 'warning' | 'info' | 'neutral';

export type TodayServiceState = 'completed' | 'current' | 'upcoming';

export type TodayServicePeriod = {
  id: string;
  startTime: string;
  endTime: string;
  capacity: number;
};

export type TodayBookingException = {
  kind: 'CLOSED_ALL_DAY' | 'CLOSED_SERVICE' | 'MODIFIED_HOURS' | 'BLOCKED_SLOT';
  servicePeriodId: string | null;
  startTime: string | null;
  endTime: string | null;
  capacityOverride: number | null;
};

export function getLocalDateTimeParts(
  timezone: string,
  date = new Date(),
): { localDate: string; localTime: string; dayOfWeek: number } {
  const timeParts = new Intl.DateTimeFormat('en-GB', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  const localTimeValues = new Map(
    timeParts.map((part) => [part.type, part.value]),
  );
  const localDate = getDateInTimezone(timezone, date);
  const localTime = `${localTimeValues.get('hour')}:${localTimeValues.get('minute')}`;
  const dayOfWeek = new Date(`${localDate}T12:00:00Z`).getUTCDay();
  return { localDate, localTime, dayOfWeek };
}

export function formatLocalDateHeading(
  localDate: string,
  locale: string,
): string {
  const formatted = new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${localDate}T12:00:00Z`));
  return formatted.charAt(0).toLocaleUpperCase(locale) + formatted.slice(1);
}

export function isActiveTodayReservation(status: string): boolean {
  return activeReservationStatuses.includes(
    status as (typeof activeReservationStatuses)[number],
  );
}

export function reservationStatusPresentation(status: string): {
  label: string;
  tone: TodayReservationTone;
} {
  switch (status) {
    case 'CONFIRMED':
      return { label: 'Confirmée', tone: 'success' };
    case 'PENDING':
      return { label: 'En attente', tone: 'warning' };
    case 'SEATED':
      return { label: 'Installée', tone: 'info' };
    default:
      return { label: status, tone: 'neutral' };
  }
}

export function getServiceState(
  startTime: string,
  endTime: string,
  localTime: string,
): TodayServiceState {
  const start = startTime.slice(0, 5);
  const end = endTime.slice(0, 5);
  if (localTime < start) return 'upcoming';
  if (localTime >= end) return 'completed';
  return 'current';
}

export function resolveServicePeriodForToday<T extends TodayServicePeriod>(
  period: T,
  exceptions: readonly TodayBookingException[],
): T | null {
  if (exceptions.some((exception) => exception.kind === 'CLOSED_ALL_DAY')) {
    return null;
  }
  const relevant = exceptions.filter(
    (exception) =>
      exception.servicePeriodId === null ||
      exception.servicePeriodId === period.id,
  );
  if (relevant.some((exception) => exception.kind === 'CLOSED_SERVICE')) {
    return null;
  }
  const modified = relevant.find(
    (exception) => exception.kind === 'MODIFIED_HOURS',
  );
  if (!modified) return period;
  const startTime = modified.startTime ?? period.startTime;
  const endTime = modified.endTime ?? period.endTime;
  if (endTime <= startTime) return null;
  return {
    ...period,
    startTime,
    endTime,
    capacity: modified.capacityOverride ?? period.capacity,
  };
}

export function serviceStateLabel(state: TodayServiceState): string {
  if (state === 'current') return 'En cours';
  if (state === 'completed') return 'Terminé';
  return 'À venir';
}

export function formatRelativeTime(
  value: Date,
  now: Date,
  locale: string,
): string {
  const elapsedMinutes = Math.max(
    1,
    Math.round((now.getTime() - value.getTime()) / 60_000),
  );
  const formatter = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  if (elapsedMinutes < 60) return formatter.format(-elapsedMinutes, 'minute');
  const hours = Math.round(elapsedMinutes / 60);
  if (hours < 24) return formatter.format(-hours, 'hour');
  return formatter.format(-Math.round(hours / 24), 'day');
}
export const BOOKING_SCHEDULE_HREF =
  '/etablissement/horaires-services#horaires-hebdomadaires';
