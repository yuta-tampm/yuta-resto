import type {
  PersonnelEmployeeAuditEvent,
  PersonnelEmployeeUnifiedHistoryEvent,
} from '@yuta/contracts/personnel';
import {
  formatContractWeeklyMinutes,
  formatFixedTermReason,
} from './employee-employment';

type MutationEvent = Extract<
  PersonnelEmployeeUnifiedHistoryEvent,
  { kind: 'mutation' }
>;
type BaselineEvent = Extract<
  PersonnelEmployeeUnifiedHistoryEvent,
  { kind: 'cutover_baseline' }
>;
export type EmployeeHistoryGroup =
  | MutationEvent['groups'][number]
  | BaselineEvent['groups'][number];
export type EmployeeHistoryValueSide = 'previous' | 'new' | 'current';

export const employeeHistoryGroupLabels: Record<
  EmployeeHistoryGroup['semanticGroup'],
  string
> = {
  identity: 'Identité',
  role: 'Poste et qualification',
  contract_terms: 'Conditions du contrat',
  work_time: 'Temps de travail',
  entry: 'Date d’entrée',
  departure: 'Départ',
};

export const employeeHistoryClassificationLabels = {
  correction: 'Correction',
  change: 'Changement',
} as const;

export function formatEmployeeHistoryDateTime(value: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function getEmployeeHistoryValueRows(
  group: EmployeeHistoryGroup,
  side: EmployeeHistoryValueSide,
  locale: string,
): Array<{ label: string; value: string }> {
  switch (group.semanticGroup) {
    case 'identity': {
      const values = getGroupValues(group, side);
      return [
        { label: 'Prénoms', value: explicitValue(values.givenNames) },
        { label: 'Nom', value: explicitValue(values.familyName) },
      ];
    }
    case 'role': {
      const values = getGroupValues(group, side);
      return [
        { label: 'Poste', value: explicitValue(values.position) },
        {
          label: 'Qualification',
          value: explicitValue(values.qualification),
        },
      ];
    }
    case 'contract_terms': {
      const values = getGroupValues(group, side);
      return [
        {
          label: 'Type de contrat',
          value: values.employmentTermType === 'indefinite' ? 'CDI' : 'CDD',
        },
        {
          label: 'Fin prévue du CDD',
          value: formatOptionalDate(values.expectedEndDate, locale),
        },
        {
          label: 'Motif du CDD',
          value: values.fixedTermReasonCode
            ? formatFixedTermReason(values.fixedTermReasonCode)
            : 'Non renseigné',
        },
      ];
    }
    case 'work_time': {
      const values = getGroupValues(group, side);
      return [
        {
          label: 'Temps de travail',
          value:
            values.workTimeCategory === 'full_time'
              ? 'Temps plein'
              : 'Temps partiel',
        },
        {
          label: 'Durée hebdomadaire',
          value: formatContractWeeklyMinutes(values.contractWeeklyMinutes),
        },
      ];
    }
    case 'entry': {
      const values = getGroupValues(group, side);
      return [
        {
          label: 'Date d’entrée',
          value: formatOptionalDate(values.entryDate, locale),
        },
      ];
    }
    case 'departure': {
      const values = getGroupValues(group, side);
      return [
        {
          label: 'Date de départ',
          value: formatOptionalDate(values.departureDate, locale),
        },
      ];
    }
  }
}

function getGroupValues<TGroup extends EmployeeHistoryGroup>(
  group: TGroup,
  side: EmployeeHistoryValueSide,
): TGroup extends { currentValues: infer TValues }
  ? TValues
  : TGroup extends { previousValues: infer TValues }
    ? TValues
    : never {
  if ('currentValues' in group) return group.currentValues as never;
  if (side === 'previous') return group.previousValues as never;
  return group.newValues as never;
}

function explicitValue(value: string | null) {
  return value?.trim() ? value : 'Non renseigné';
}

function formatOptionalDate(value: string | null, locale: string) {
  if (!value) return 'Non renseigné';
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(
    new Date(`${value}T12:00:00Z`),
  );
}

export function employeeLegacyHistoryEventLabel(
  eventType: PersonnelEmployeeAuditEvent['eventType'],
) {
  const labels: Record<PersonnelEmployeeAuditEvent['eventType'], string> = {
    'employee.created': 'Dossier créé',
    'employee.duplicate_override_confirmed': 'Doublon potentiel confirmé',
    'employee.identity_updated': 'Identité modifiée',
    'employee.employment_updated': 'Relation de travail modifiée',
    'employee.departure_recorded': 'Départ enregistré',
    'employee.departure_corrected': 'Départ corrigé ou annulé',
    'employee.contract_extraction_requested': 'Analyse locale demandée',
    'employee.contract_extraction_completed': 'Analyse locale terminée',
    'employee.contract_extraction_failed': 'Analyse locale échouée',
    'employee.contract_extraction_applied': 'Suggestions du contrat appliquées',
  };
  return labels[eventType];
}

export function employeeLegacyHistoryFieldLabel(
  field: PersonnelEmployeeAuditEvent['changedFields'][number],
) {
  const labels: Record<
    PersonnelEmployeeAuditEvent['changedFields'][number],
    string
  > = {
    identity: 'identité',
    givenNames: 'prénoms',
    familyName: 'nom',
    position: 'poste',
    qualification: 'qualification',
    employmentTermType: 'type de contrat',
    expectedEndDate: 'fin prévue',
    fixedTermReasonCode: 'motif du CDD',
    workTimeCategory: 'temps de travail',
    contractWeeklyMinutes: 'durée hebdomadaire contractuelle',
    entryDate: 'date d’entrée',
    departureDate: 'date de départ',
  };
  return labels[field];
}
