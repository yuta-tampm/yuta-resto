import type { PersonnelEmployeeUnifiedHistory } from '@yuta/contracts/personnel';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { EmployeeHistoryMetadataFields } from '../src/app/(authenticated)/equipe/salaries/_components/employee-history-metadata-fields';
import { EmployeeHistory } from '../src/app/(authenticated)/equipe/salaries/_components/employee-history';
import type {
  EmployeeEditHistoryMetadataDraft,
  EmployeeEditSemanticGroup,
} from '../src/app/(authenticated)/equipe/salaries/_lib/employee-edit-flow';
import { getEmployeeHistoryValueRows } from '../src/app/(authenticated)/equipe/salaries/_lib/employee-history-presentation';

const drafts: Record<
  EmployeeEditSemanticGroup,
  EmployeeEditHistoryMetadataDraft
> = {
  identity: {
    classification: 'correction',
    effectiveDate: '',
    correctionReason: '',
  },
  role: {
    classification: 'change',
    effectiveDate: '2026-09-03',
    correctionReason: '',
  },
  contract_terms: {
    classification: 'correction',
    effectiveDate: '',
    correctionReason: '',
  },
  work_time: {
    classification: 'correction',
    effectiveDate: '',
    correctionReason: '',
  },
  entry: {
    classification: 'correction',
    effectiveDate: '',
    correctionReason: '',
  },
};

describe('personnel reconstructable history UI', () => {
  it('renders conditional date and reason fields without future-state controls', () => {
    const markup = renderToStaticMarkup(
      <EmployeeHistoryMetadataFields
        groups={['identity', 'role', 'contract_terms', 'entry']}
        drafts={drafts}
        minimumEffectiveDate="2026-08-01"
        maximumEffectiveDate="2026-09-03"
        fieldErrors={{}}
        onDraftChange={() => undefined}
      />,
    );

    expect(markup).toContain('Nature des modifications');
    expect(markup).toContain('Date d’effet');
    expect(markup).toContain('min="2026-08-01"');
    expect(markup).toContain('max="2026-09-03"');
    expect(markup).toContain('Entre la date d’entrée et aujourd’hui');
    expect(markup).toContain('Motif de la correction (facultatif)');
    expect(markup).toContain('La date d’entrée ne peut être corrigée');
    expect(markup).not.toContain('Planifier');
    expect(markup).not.toContain('Activation future');
  });

  it('renders a server date error beside the affected semantic group', () => {
    const markup = renderToStaticMarkup(
      <EmployeeHistoryMetadataFields
        groups={['role']}
        drafts={drafts}
        minimumEffectiveDate="2026-08-01"
        maximumEffectiveDate="2026-09-03"
        fieldErrors={{
          'historyMetadata.role.effectiveDate':
            'La date d’effet ne peut pas être dans le futur.',
        }}
        onDraftChange={() => undefined}
      />,
    );

    expect(markup).toContain('La date d’effet ne peut pas être dans le futur.');
    expect(markup).toContain('role="alert"');
  });

  it('formats previous/new coupled values and explicit nulls safely', () => {
    const rows = getEmployeeHistoryValueRows(
      {
        semanticGroup: 'contract_terms',
        classification: 'change',
        previousValues: {
          employmentTermType: 'indefinite',
          expectedEndDate: null,
          fixedTermReasonCode: null,
        },
        newValues: {
          employmentTermType: 'fixed_term',
          expectedEndDate: '2026-12-31',
          fixedTermReasonCode: 'seasonal_employment',
        },
        effectiveDate: '2026-09-01',
        correctionReason: null,
      },
      'previous',
      'fr-FR',
    );

    expect(rows).toEqual([
      { label: 'Type de contrat', value: 'CDI' },
      { label: 'Fin prévue du CDD', value: 'Non renseigné' },
      { label: 'Motif du CDD', value: 'Non renseigné' },
    ]);
  });

  it('renders legacy and F07 events without internal identifiers or extra controls', () => {
    const history: PersonnelEmployeeUnifiedHistory = {
      items: [
        {
          kind: 'mutation',
          id: '11111111-1111-4111-8111-111111111111',
          actorDisplayName: 'Propriétaire LUNA',
          occurredAt: '2026-09-03T10:30:00.000Z',
          groups: [
            {
              semanticGroup: 'work_time',
              classification: 'change',
              previousValues: {
                workTimeCategory: 'part_time',
                contractWeeklyMinutes: null,
              },
              newValues: {
                workTimeCategory: 'full_time',
                contractWeeklyMinutes: 2_100,
              },
              effectiveDate: '2026-09-03',
              correctionReason: null,
            },
          ],
        },
        {
          kind: 'legacy',
          id: '22222222-2222-4222-8222-222222222222',
          eventType: 'employee.created',
          changedFields: ['identity'],
          actorDisplayName: 'Propriétaire LUNA',
          occurredAt: '2026-08-01T09:00:00.000Z',
          reason: null,
          previousDepartureDate: null,
          newDepartureDate: null,
        },
      ],
      truncated: true,
    };
    const markup = renderToStaticMarkup(
      <EmployeeHistory
        state={{ status: 'success', history, message: null }}
        locale="fr-FR"
        onRetry={() => undefined}
      />,
    );

    expect(markup).toContain('Modification du dossier');
    expect(markup).toContain('Temps de travail');
    expect(markup).toContain('Valeur précédente');
    expect(markup).toContain('Nouvelle valeur');
    expect(markup).toContain('Non renseignée');
    expect(markup).toContain('Dossier créé');
    expect(markup).toContain(
      'Seuls les 50 événements les plus récents sont affichés.',
    );
    expect(markup).not.toContain('11111111-1111-4111-8111-111111111111');
    expect(markup).not.toContain('organizationId');
    expect(markup).not.toContain('operationId');
    expect(markup).not.toContain('payloadVersion');
    expect(markup).not.toContain('revision');
    expect(markup).not.toContain('Rechercher');
    expect(markup).not.toContain('Filtrer');
    expect(markup).not.toContain('Exporter');
    expect(markup).not.toContain('Pagination');
  });

  it('renders the cutover baseline with neutral current-at-cutover wording', () => {
    const history: PersonnelEmployeeUnifiedHistory = {
      items: [
        {
          kind: 'cutover_baseline',
          id: '33333333-3333-4333-8333-333333333333',
          actorDisplayName: null,
          occurredAt: '2026-09-03T08:00:00.000Z',
          groups: [
            {
              semanticGroup: 'identity',
              currentValues: { givenNames: 'Nina', familyName: 'Sierra' },
            },
            {
              semanticGroup: 'role',
              currentValues: {
                position: 'Responsable de salle',
                qualification: 'Employée qualifiée',
              },
            },
            {
              semanticGroup: 'contract_terms',
              currentValues: {
                employmentTermType: 'indefinite',
                expectedEndDate: null,
                fixedTermReasonCode: null,
              },
            },
            {
              semanticGroup: 'work_time',
              currentValues: {
                workTimeCategory: 'full_time',
                contractWeeklyMinutes: 2_100,
              },
            },
            {
              semanticGroup: 'entry',
              currentValues: { entryDate: '2026-08-01' },
            },
            {
              semanticGroup: 'departure',
              currentValues: { departureDate: null },
            },
          ],
        },
      ],
      truncated: false,
    };
    const markup = renderToStaticMarkup(
      <EmployeeHistory
        state={{ status: 'success', history, message: null }}
        locale="fr-FR"
        onRetry={() => undefined}
      />,
    );

    expect(markup).toContain('Début de l’historisation');
    expect(markup).toContain('Valeurs actuelles au début de l’historisation.');
    expect(markup).toContain('Système');
    expect(markup).not.toContain('Valeur précédente');
    expect(markup).not.toContain('Correction');
    expect(markup).not.toContain('Changement');
    expect(markup).not.toContain('Utilisateur supprimé');
    expect(markup).not.toContain('33333333-3333-4333-8333-333333333333');
  });
});
