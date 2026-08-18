import { describe, expect, it } from 'vitest';
import { getActionPresentation } from '../employee-action-overview-model';

describe('employee action overview presentation', () => {
  it('maps corrections to the approved existing flows', () => {
    expect(
      getActionPresentation(
        {
          employeeId: '11111111-1111-4111-8111-111111111111',
          employeeDisplayName: 'Camille Martin',
          kind: 'incomplete_employee_dossier',
        },
        'fr-FR',
        '2026-08-17',
      ),
    ).toEqual({
      reason: 'Dossier incomplet',
      actionLabel: 'Compléter le dossier',
    });
    expect(
      getActionPresentation(
        {
          employeeId: '22222222-2222-4222-8222-222222222222',
          employeeDisplayName: 'Léa Bernard',
          kind: 'missing_signed_base_contract',
        },
        'fr-FR',
        '2026-08-17',
      ).actionLabel,
    ).toBe('Ajouter le contrat');
  });

  it('presents the approved five-day departure window relative to business date', () => {
    const presentation = getActionPresentation(
      {
        employeeId: '33333333-3333-4333-8333-333333333333',
        employeeDisplayName: 'Hugo Petit',
        kind: 'departure_within_five_days',
        departureDate: '2026-08-22',
      },
      'fr-FR',
      '2026-08-17',
    );
    expect(presentation.reason).toContain('Départ dans 5 jours');
    expect(presentation.actionLabel).toBe('Voir le départ');
  });
});
