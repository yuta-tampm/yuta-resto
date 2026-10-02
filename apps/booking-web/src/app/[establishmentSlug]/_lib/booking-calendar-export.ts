import type { Establishment } from './booking-types';

export function downloadCalendar(
  establishment: Establishment,
  date: string,
  time: string,
) {
  const start = `${date.replaceAll('-', '')}T${time.replace(':', '')}00`;
  const content = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VEVENT',
    `DTSTART;TZID=${establishment.timezone}:${start}`,
    `SUMMARY:Réservation — ${establishment.name}`,
    establishment.address ? `LOCATION:${establishment.address}` : '',
    'END:VEVENT',
    'END:VCALENDAR',
  ]
    .filter(Boolean)
    .join('\r\n');
  const link = document.createElement('a');
  link.href = `data:text/calendar;charset=utf-8,${encodeURIComponent(content)}`;
  link.download = `reservation-${establishment.slug}.ics`;
  link.click();
}
