import type { PersonnelEmployeeSummary } from '@yuta/contracts/personnel';

export function getEmployeeName(employee: PersonnelEmployeeSummary): string {
  return `${employee.givenNames} ${employee.familyName}`;
}

export function getEmployeeInitials(
  employee: PersonnelEmployeeSummary,
): string {
  return `${employee.givenNames.charAt(0)}${employee.familyName.charAt(0)}`.toUpperCase();
}

export function getContractSummary(employee: PersonnelEmployeeSummary): string {
  return employee.employmentTermType === 'indefinite' ? 'CDI' : 'CDD';
}

export function getWorkTimeLabel(employee: PersonnelEmployeeSummary): string {
  return employee.workTimeCategory === 'full_time'
    ? 'Temps plein'
    : 'Temps partiel';
}

export function isEmployeeComplete(
  employee: PersonnelEmployeeSummary,
): boolean {
  return employee.completenessReasons.length === 0;
}

export function formatEmployeeDate(value: string, locale = 'fr-FR'): string {
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${value}T12:00:00Z`));
}

export function getBusinessDate(timezone: string, date = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const values = new Map(parts.map((part) => [part.type, part.value]));
  return `${values.get('year')}-${values.get('month')}-${values.get('day')}`;
}
