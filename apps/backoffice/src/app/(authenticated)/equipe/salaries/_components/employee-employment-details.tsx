import type { PersonnelEmployeeSummary } from '@yuta/contracts/personnel';
import { Info } from 'lucide-react';
import {
  formatContractWeeklyMinutes,
  formatFixedTermReason,
} from '../_lib/employee-employment';

export function EmployeeEmploymentDetails({
  employee,
}: {
  employee: PersonnelEmployeeSummary;
}) {
  const fixedTermReason =
    employee.employmentTermType === 'indefinite'
      ? 'Non applicable — contrat CDI'
      : formatFixedTermReason(employee.fixedTermReasonCode);

  return (
    <section
      className="mt-4 rounded-xl border border-border-default bg-surface p-5 shadow-sm"
      aria-labelledby="employee-employment-details-title"
    >
      <div>
        <h3
          id="employee-employment-details-title"
          className="text-sm font-bold"
        >
          Informations contractuelles complémentaires
        </h3>
        <p className="mt-1 text-sm text-secondary">
          Informations déclarées dans le dossier salarié.
        </p>
      </div>

      <dl className="mt-4 grid gap-3 sm:grid-cols-2">
        <EmploymentFact
          label="Motif du CDD"
          value={fixedTermReason}
          muted={employee.employmentTermType === 'indefinite'}
        />
        <EmploymentFact
          label="Durée hebdomadaire contractuelle"
          value={formatContractWeeklyMinutes(employee.contractWeeklyMinutes)}
          muted={employee.contractWeeklyMinutes === null}
        />
      </dl>

      <div className="mt-4 flex items-start gap-2 rounded-lg border border-border-default bg-surface-muted px-4 py-3 text-sm text-secondary">
        <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
        <p>Les formalités associées ne sont pas encore disponibles.</p>
      </div>
    </section>
  );
}

function EmploymentFact({
  label,
  value,
  muted = false,
}: {
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div className="rounded-lg border border-border-default bg-surface px-4 py-3">
      <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
        {label}
      </dt>
      <dd
        className={
          muted
            ? 'mt-1 text-sm font-semibold text-secondary'
            : 'mt-1 text-sm font-semibold'
        }
      >
        {value}
      </dd>
    </div>
  );
}
