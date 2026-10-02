export function formatEmployeeAmendmentDate(
  date: string,
  locale: string,
): string {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeZone: 'UTC',
  }).format(new Date(`${date}T12:00:00.000Z`));
}
