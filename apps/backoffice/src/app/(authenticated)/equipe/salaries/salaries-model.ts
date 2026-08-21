import type { PersonnelEmployeeSummary } from '@yuta/contracts/personnel';

export function getEmployeeName(employee: PersonnelEmployeeSummary): string {
  return `${employee.givenNames} ${employee.familyName}`;
}

export function getEmployeeDossierHref(employeeId: string): string {
  return `/equipe/salaries/${employeeId}`;
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

export type EmploymentStatusPresentation = {
  label: string;
  tone: 'success' | 'info' | 'warning' | 'neutral';
};

export function getEmploymentStatusPresentation(
  employee: PersonnelEmployeeSummary,
  businessDate: string,
): EmploymentStatusPresentation {
  if (employee.view === 'former') {
    return { label: 'Ancien salarié', tone: 'neutral' };
  }
  if (employee.view === 'upcoming') {
    return { label: 'Entrée à venir', tone: 'info' };
  }
  if (employee.departureDate) {
    const daysUntilDeparture = differenceInCalendarDays(
      employee.departureDate,
      businessDate,
    );
    if (daysUntilDeparture === 0) {
      return { label: 'Dernier jour', tone: 'warning' };
    }
    if (daysUntilDeparture === 1) {
      return { label: 'Départ demain', tone: 'warning' };
    }
    if (daysUntilDeparture >= 2 && daysUntilDeparture <= 5) {
      return {
        label: `Départ dans ${daysUntilDeparture} jours`,
        tone: 'warning',
      };
    }
  }
  return { label: 'Actif', tone: 'success' };
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

function differenceInCalendarDays(laterDate: string, earlierDate: string) {
  return Math.round(
    (Date.parse(`${laterDate}T00:00:00Z`) -
      Date.parse(`${earlierDate}T00:00:00Z`)) /
      86_400_000,
  );
}
