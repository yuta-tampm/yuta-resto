import type { PersonnelEmployeeSummary } from '@yuta/contracts/personnel';
import { Badge, cn } from '@yuta/ui';
import { CheckCircle2, FileWarning } from 'lucide-react';
import {
  getEmployeeInitials,
  getEmploymentStatusPresentation,
  isEmployeeComplete,
} from '../salaries-model';

export function OverviewFact({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border-default bg-surface-muted p-4">
      <div className="flex items-center gap-2 text-secondary">
        <span className="grid h-7 w-7 place-items-center rounded-md bg-surface text-action-primary">
          {icon}
        </span>
        <span className="text-xs font-semibold uppercase tracking-wide">
          {label}
        </span>
      </div>
      <div className="mt-3 text-base font-bold text-primary">{value}</div>
    </div>
  );
}

export function DetailSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border-default bg-surface p-5 shadow-sm">
      <h3 className="text-lg font-bold">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-secondary">{description}</p>
      )}
      <div className="mt-4 grid gap-3 sm:grid-cols-2">{children}</div>
    </section>
  );
}

export function EmployeeAvatar({
  employee,
  large = false,
}: {
  employee: PersonnelEmployeeSummary;
  large?: boolean;
}) {
  return (
    <span
      className={cn(
        'grid shrink-0 place-items-center rounded-full bg-surface-muted font-bold text-secondary',
        large ? 'h-12 w-12 text-sm' : 'h-9 w-9 text-xs',
      )}
      aria-hidden
    >
      {getEmployeeInitials(employee)}
    </span>
  );
}

export function CompletenessBadge({
  employee,
}: {
  employee: PersonnelEmployeeSummary;
}) {
  const complete = isEmployeeComplete(employee);
  return (
    <Badge tone={complete ? 'success' : 'warning'}>
      {complete ? (
        <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
      ) : (
        <FileWarning className="h-3.5 w-3.5" aria-hidden />
      )}
      {complete ? 'Complet' : 'À compléter'}
    </Badge>
  );
}

export function EmploymentBadge({
  employee,
  businessDate,
}: {
  employee: PersonnelEmployeeSummary;
  businessDate: string;
}) {
  const presentation = getEmploymentStatusPresentation(employee, businessDate);
  return <Badge tone={presentation.tone}>{presentation.label}</Badge>;
}

export function DepartureNoticeBadge({
  employee,
  businessDate,
}: {
  employee: PersonnelEmployeeSummary;
  businessDate: string;
}) {
  const presentation = getEmploymentStatusPresentation(employee, businessDate);
  return presentation.tone === 'warning' ? (
    <Badge tone="warning">{presentation.label}</Badge>
  ) : null;
}
