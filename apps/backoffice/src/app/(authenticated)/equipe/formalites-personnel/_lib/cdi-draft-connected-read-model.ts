import type { PersonnelEmployeeSummary } from '@yuta/contracts/personnel';

type ConnectedEmployeeSource = Pick<
  PersonnelEmployeeSummary,
  | 'givenNames'
  | 'familyName'
  | 'position'
  | 'qualification'
  | 'employmentTermType'
  | 'entryDate'
  | 'contractWeeklyMinutes'
>;

export type CdiDraftConnectedReadModel = {
  employeeName: string;
  fields: readonly { label: string; value: string }[];
};

export function createCdiDraftConnectedReadModel(
  employee: ConnectedEmployeeSource,
  locale: string,
): CdiDraftConnectedReadModel {
  return {
    employeeName: `${employee.givenNames} ${employee.familyName}`,
    fields: [
      {
        label: 'Identité',
        value: `${employee.givenNames} ${employee.familyName}`,
      },
      { label: 'Poste', value: employee.position },
      { label: 'Qualification', value: employee.qualification },
      {
        label: 'Type de contrat actuel',
        value: employee.employmentTermType === 'indefinite' ? 'CDI' : 'CDD',
      },
      {
        label: "Date d'entrée",
        value: formatDate(employee.entryDate, locale),
      },
      {
        label: 'Durée hebdomadaire',
        value: formatWeeklyMinutes(employee.contractWeeklyMinutes),
      },
    ],
  };
}

function formatDate(value: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${value}T12:00:00Z`));
}

function formatWeeklyMinutes(value: number | null): string {
  if (value === null) return 'Non renseignée';
  const hours = Math.floor(value / 60);
  const minutes = value % 60;
  return minutes === 0
    ? `${hours} h par semaine`
    : `${hours} h ${minutes.toString().padStart(2, '0')} par semaine`;
}
