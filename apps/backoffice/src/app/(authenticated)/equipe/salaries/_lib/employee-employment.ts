import type { PersonnelEmployeeSummary } from '@yuta/contracts/personnel';

export const fixedTermReasonOptions = [
  { value: 'employee_replacement', label: 'Remplacement d’un salarié' },
  {
    value: 'temporary_activity_increase',
    label: 'Accroissement temporaire d’activité',
  },
  { value: 'seasonal_employment', label: 'Emploi saisonnier' },
  { value: 'customary_use_employment', label: 'CDD d’usage' },
] as const satisfies ReadonlyArray<{
  value: NonNullable<PersonnelEmployeeSummary['fixedTermReasonCode']>;
  label: string;
}>;

export function formatFixedTermReason(
  reason: PersonnelEmployeeSummary['fixedTermReasonCode'],
): string {
  if (!reason) return 'Non renseigné';
  return (
    fixedTermReasonOptions.find((option) => option.value === reason)?.label ??
    'Non renseigné'
  );
}

export function formatContractWeeklyMinutes(minutes: number | null): string {
  if (minutes === null) return 'Non renseignée';
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  if (remainder === 0) {
    return `${hours} ${hours === 1 ? 'heure' : 'heures'} par semaine`;
  }
  return `${hours} h ${String(remainder).padStart(2, '0')} par semaine`;
}

export function splitContractWeeklyMinutes(minutes: number | null): {
  hours: string;
  minutes: string;
} {
  if (minutes === null) return { hours: '', minutes: '' };
  return {
    hours: String(Math.floor(minutes / 60)),
    minutes: String(minutes % 60),
  };
}

export function combineContractWeeklyMinutes(
  hours: string,
  minutes: string,
): string {
  if (!hours.trim() && !minutes.trim()) return '';
  const parsedHours = Number(hours);
  const parsedMinutes = Number(minutes);
  if (!Number.isInteger(parsedHours) || !Number.isInteger(parsedMinutes)) {
    return '';
  }
  return String(parsedHours * 60 + parsedMinutes);
}
