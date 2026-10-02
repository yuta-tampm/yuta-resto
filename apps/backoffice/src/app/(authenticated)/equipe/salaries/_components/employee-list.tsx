import type { PersonnelEmployeeSummary } from '@yuta/contracts/personnel';
import {
  Badge,
  SimpleTable,
  SimpleTableBody,
  SimpleTableCell,
  SimpleTableHead,
  SimpleTableHeader,
  SimpleTableRow,
  cn,
} from '@yuta/ui';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import {
  formatEmployeeDate,
  getContractSummary,
  getEmployeeDossierHref,
  getEmployeeName,
} from '../salaries-model';
import {
  EmployeeAvatar,
  CompletenessBadge,
  DepartureNoticeBadge,
} from './employee-presentation';

export function EmployeeList({
  employees,
  selectedId,
  locale,
  businessDate,
  onSelect,
}: {
  employees: readonly PersonnelEmployeeSummary[];
  selectedId: string | null;
  locale: string;
  businessDate: string;
  onSelect: (id: string) => void;
}) {
  return (
    <>
      <div className="hidden md:block">
        <SimpleTable>
          <SimpleTableHeader>
            <SimpleTableRow>
              <SimpleTableHead>Salarié</SimpleTableHead>
              <SimpleTableHead>Poste</SimpleTableHead>
              <SimpleTableHead>Relation</SimpleTableHead>
              <SimpleTableHead>Date d’entrée</SimpleTableHead>
              <SimpleTableHead>Dossier</SimpleTableHead>
            </SimpleTableRow>
          </SimpleTableHeader>
          <SimpleTableBody>
            {employees.map((employee) => (
              <SimpleTableRow
                key={employee.id}
                className={
                  employee.id === selectedId ? 'bg-surface-selected' : undefined
                }
                aria-selected={employee.id === selectedId}
              >
                <SimpleTableCell>
                  <button
                    type="button"
                    className="flex w-full items-center gap-3 rounded-md text-left focus:outline-none focus:ring-2 focus:ring-focus-ring"
                    onClick={() => onSelect(employee.id)}
                    aria-label={`Consulter ${getEmployeeName(employee)}`}
                  >
                    <EmployeeAvatar employee={employee} />
                    <span className="font-bold">
                      {getEmployeeName(employee)}
                    </span>
                  </button>
                </SimpleTableCell>
                <SimpleTableCell>{employee.position}</SimpleTableCell>
                <SimpleTableCell>
                  <span className="flex flex-wrap items-center gap-2">
                    <span>{getContractSummary(employee)}</span>
                    <DepartureNoticeBadge
                      employee={employee}
                      businessDate={businessDate}
                    />
                  </span>
                </SimpleTableCell>
                <SimpleTableCell>
                  {formatEmployeeDate(employee.entryDate, locale)}
                </SimpleTableCell>
                <SimpleTableCell>
                  <CompletenessBadge employee={employee} />
                </SimpleTableCell>
              </SimpleTableRow>
            ))}
          </SimpleTableBody>
        </SimpleTable>
      </div>

      <div className="grid gap-3 p-3 md:hidden">
        {employees.map((employee) => (
          <Link
            key={employee.id}
            href={getEmployeeDossierHref(employee.id)}
            className={cn(
              'rounded-lg border p-4 text-left focus:outline-none focus:ring-2 focus:ring-focus-ring',
              employee.id === selectedId
                ? 'border-action-primary bg-surface-selected'
                : 'border-border-default bg-surface',
            )}
          >
            <span className="flex items-start justify-between gap-3">
              <span className="flex min-w-0 items-center gap-3">
                <EmployeeAvatar employee={employee} />
                <span className="min-w-0">
                  <span className="block truncate font-bold">
                    {getEmployeeName(employee)}
                  </span>
                  <span className="block text-sm text-secondary">
                    {employee.position}
                  </span>
                </span>
              </span>
              <ChevronRight
                className="h-5 w-5 shrink-0 text-muted"
                aria-hidden
              />
            </span>
            <span className="mt-3 flex flex-wrap items-center gap-2">
              <Badge tone="neutral">{getContractSummary(employee)}</Badge>
              <DepartureNoticeBadge
                employee={employee}
                businessDate={businessDate}
              />
              <CompletenessBadge employee={employee} />
            </span>
            <span className="mt-3 block text-xs font-medium text-secondary">
              Entrée : {formatEmployeeDate(employee.entryDate, locale)}
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}
