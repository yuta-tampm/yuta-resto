import type { PersonnelEmployeeSummary } from '@yuta/contracts/personnel';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { EmployeeEmploymentDetails } from './employee-employment-details';

const fictionalEmployee: PersonnelEmployeeSummary = {
  id: '01923e4c-8c5a-7a6b-8c9d-001122334455',
  givenNames: 'Camille',
  familyName: 'Martin',
  position: 'Cheffe de rang',
  qualification: 'Employée qualifiée',
  employmentTermType: 'indefinite',
  expectedEndDate: null,
  fixedTermReasonCode: null,
  workTimeCategory: 'full_time',
  contractWeeklyMinutes: 2_100,
  entryDate: '2026-09-01',
  departureDate: null,
  view: 'active',
  completenessReasons: [],
  revision: 1,
  createdAt: '2026-08-23T10:00:00.000Z',
  updatedAt: '2026-08-23T10:00:00.000Z',
};

describe('employee current-contract details', () => {
  it('separates reusable declared facts from the signed document', () => {
    const markup = renderToStaticMarkup(
      <EmployeeEmploymentDetails employee={fictionalEmployee} />,
    );

    expect(markup).toContain(
      'Ces informations déclarées peuvent être réutilisées pour préparer une formalité.',
    );
    expect(markup).toContain(
      'Le contrat signé, lorsqu’il existe, reste consultable dans Documents.',
    );
    expect(markup).not.toContain(
      'Les formalités associées ne sont pas encore disponibles.',
    );
  });
});
