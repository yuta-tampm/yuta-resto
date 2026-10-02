import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { CdiDraftConnectedReadPrototype } from '../src/app/(authenticated)/equipe/formalites-personnel/_components/cdi-draft-connected-read-prototype';
import { createCdiDraftConnectedReadModel } from '../src/app/(authenticated)/equipe/formalites-personnel/_lib/cdi-draft-connected-read-model';

const model = createCdiDraftConnectedReadModel(
  {
    givenNames: 'Camille',
    familyName: 'Martin',
    position: 'Cheffe de rang',
    qualification: 'Employée qualifiée',
    employmentTermType: 'indefinite',
    entryDate: '2026-09-01',
    contractWeeklyMinutes: 2_100,
  },
  'fr-FR',
);

describe('connected CDI draft local-interaction prototype', () => {
  it('projects only the six approved employee facts', () => {
    expect(model.employeeName).toBe('Camille Martin');
    expect(model.fields).toEqual([
      { label: 'Identité', value: 'Camille Martin' },
      { label: 'Poste', value: 'Cheffe de rang' },
      { label: 'Qualification', value: 'Employée qualifiée' },
      { label: 'Type de contrat actuel', value: 'CDI' },
      { label: "Date d'entrée", value: '01 sept. 2026' },
      { label: 'Durée hebdomadaire', value: '35 h par semaine' },
    ]);
    expect(Object.keys(model)).toEqual(['employeeName', 'fields']);
    expect(JSON.stringify(model)).not.toMatch(
      /employeeId|organizationId|establishmentId|revision|createdAt|updatedAt/,
    );
  });

  it('renders the trusted source before the local-only input step', () => {
    const markup = renderToStaticMarkup(
      <CdiDraftConnectedReadPrototype
        model={model}
        employeeDossierHref="/equipe/salaries/fictional-id"
      />,
    );

    expect(markup).toContain('Prototype connecté — saisie locale uniquement');
    expect(markup).toContain(
      'Les trois valeurs saisies ne sont ni enregistrées',
    );
    expect(markup).toContain('Camille Martin');
    expect(markup).toContain('/equipe/salaries/fictional-id');
    expect(markup).toContain('Informations à compléter');
    expect(markup).toContain('Vérification');
    expect(markup).not.toContain('Non disponible dans cette phase');
    expect(markup).not.toContain('<input');
    expect(markup).not.toContain('Simuler l’enregistrement');
    expect(markup).not.toContain('brouillon enregistré');
  });
});
