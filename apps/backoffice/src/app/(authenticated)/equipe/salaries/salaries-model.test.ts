import type { PersonnelEmployeeSummary } from '@yuta/contracts/personnel';
import { describe, expect, it } from 'vitest';
import {
  formatEmployeeDate,
  getBusinessDate,
  getContractSummary,
  getEmployeeInitials,
  getEmployeeName,
  getEmploymentStatusPresentation,
  getWorkTimeLabel,
} from './salaries-model';

const employee: PersonnelEmployeeSummary = {
  id: '01923e4c-8c5a-7a6b-8c9d-001122334455',
  givenNames: 'Élodie',
  familyName: 'Martin',
  position: 'Cheffe de rang',
  qualification: 'Employée qualifiée',
  employmentTermType: 'indefinite',
  expectedEndDate: null,
  workTimeCategory: 'full_time',
  entryDate: '2026-01-02',
  departureDate: null,
  view: 'active',
  completenessReasons: [],
  revision: 1,
  createdAt: '2026-01-02T10:00:00.000Z',
  updatedAt: '2026-01-02T10:00:00.000Z',
};

describe('salaries view model', () => {
  it('derives presentation labels from safe contract fields', () => {
    expect(getEmployeeName(employee)).toBe('Élodie Martin');
    expect(getEmployeeInitials(employee)).toBe('ÉM');
    expect(getContractSummary(employee)).toBe('CDI');
    expect(getWorkTimeLabel(employee)).toBe('Temps plein');
    expect(formatEmployeeDate(employee.entryDate)).toContain('2026');
  });

  it('derives the establishment business date from its timezone', () => {
    expect(
      getBusinessDate('Europe/Paris', new Date('2026-08-12T22:30:00Z')),
    ).toBe('2026-08-13');
  });

  it('warns during the five calendar days before departure', () => {
    const departingEmployee = {
      ...employee,
      departureDate: '2026-08-14',
    };
    expect(
      getEmploymentStatusPresentation(departingEmployee, '2026-08-08'),
    ).toEqual({ label: 'Actif', tone: 'success' });
    expect(
      getEmploymentStatusPresentation(departingEmployee, '2026-08-09'),
    ).toEqual({ label: 'Départ dans 5 jours', tone: 'warning' });
    expect(
      getEmploymentStatusPresentation(departingEmployee, '2026-08-13'),
    ).toEqual({ label: 'Départ demain', tone: 'warning' });
    expect(
      getEmploymentStatusPresentation(departingEmployee, '2026-08-14'),
    ).toEqual({ label: 'Dernier jour', tone: 'warning' });
    expect(
      getEmploymentStatusPresentation(
        { ...departingEmployee, view: 'former' },
        '2026-08-15',
      ),
    ).toEqual({ label: 'Ancien salarié', tone: 'neutral' });
  });
});
