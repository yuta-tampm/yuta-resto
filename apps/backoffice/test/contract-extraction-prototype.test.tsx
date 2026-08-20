import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('../src/app/(authenticated)/equipe/salaries/actions', () => ({
  startContractExtractionAction: vi.fn(),
  applyContractExtractionAction: vi.fn(),
}));

import { ContractExtractionPrototype } from '../src/app/(authenticated)/equipe/salaries/_components/contract-extraction-prototype';

describe('ContractExtractionPrototype', () => {
  it('labels the synthetic local boundary and waits for an explicit analysis click', () => {
    const markup = renderToStaticMarkup(
      <ContractExtractionPrototype
        employee={{
          id: '11111111-1111-4111-8111-111111111111',
          givenNames: 'Camille',
          familyName: 'Martin',
          position: 'Employé polyvalent',
          qualification: 'Employé',
          employmentTermType: 'indefinite',
          expectedEndDate: null,
          fixedTermReasonCode: null,
          workTimeCategory: 'full_time',
          contractWeeklyMinutes: null,
          entryDate: '2026-08-01',
          departureDate: null,
          view: 'active',
          completenessReasons: [],
          revision: 3,
          createdAt: '2026-08-01T10:00:00.000Z',
          updatedAt: '2026-08-18T10:00:00.000Z',
        }}
        document={{
          id: '22222222-2222-4222-8222-222222222222',
          employeeId: '11111111-1111-4111-8111-111111111111',
          category: 'signed_employment_contract',
          filename: 'contrat.pdf',
          mediaType: 'application/pdf',
          byteSize: 1024,
          version: 1,
          revision: 1,
          uploadedAt: '2026-08-18T10:00:00.000Z',
        }}
        onClose={vi.fn()}
        onApplied={vi.fn()}
      />,
    );

    expect(markup).toContain('Local — PDF synthétique généré');
    expect(markup).toContain('Test local avec données fictives');
    expect(markup).toContain('n’est pas lu ni transmis');
    expect(markup).toContain('PDF fictif à tester');
    expect(markup).toContain('750 Ko maximum');
    expect(markup).toContain('Analyser le PDF généré');
    expect(markup).toContain('Aucune requête externe ne part avant votre clic');
  });
});
