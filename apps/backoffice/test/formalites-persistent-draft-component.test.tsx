import type { FormalitesPersonnelDraftReadModel } from '@yuta/contracts';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}));
import {
  CdiDraftWorkspace,
  workspaceFeedbackForOutcome,
} from '../src/app/(authenticated)/equipe/formalites-personnel/_components/cdi-draft-workspace';

describe('Formalités persistent draft workspace rendering', () => {
  it('renders eligible no-draft with an explicit Create and no autosave fields', () => {
    const markup = renderWorkspace(eligibleNoDraftModel());
    expect(markup).toContain('Aucun brouillon actif');
    expect(markup).toContain('Créer le brouillon');
    expect(markup).toContain('Valeurs actuelles du dossier salarié');
    expect(markup).not.toContain('Enregistrer');
    expectForbiddenContentAbsent(markup);
  });

  it('renders editable DRAFT with all probation choices including UNDECIDED Save', () => {
    const markup = renderWorkspace(editableModel());
    expect(markup).toContain('Brouillon en cours');
    expect(markup).toContain('À décider');
    expect(markup).toContain('Prévoir une période d’essai');
    expect(markup).toContain('Ne pas prévoir de période d’essai');
    expect(markup).toContain('Enregistrer');
    expect(markup).toContain('Abandonner le brouillon');
    expect(markup).toContain('aria-label="Décision de préparation');
    expectForbiddenContentAbsent(markup);
  });

  it('renders only server-derived divergences with draft/current KEEP/REFRESH controls', () => {
    const markup = renderWorkspace(reconciliationModel());
    expect(markup).toContain('Le dossier salarié a changé');
    expect(markup).toContain('Valeur du brouillon');
    expect(markup).toContain('Valeur actuelle du dossier salarié');
    expect(markup).toContain('Ancien poste');
    expect(markup).toContain('Nouveau poste');
    expect(markup).toContain('Conserver la valeur du brouillon');
    expect(markup).toContain('Reprendre la valeur actuelle du dossier salarié');
    expect(markup).toContain('Valider les choix');
    expect(markup).not.toContain('Prénoms</legend>');
    expect(markup).not.toContain('Enregistrer');
    expectForbiddenContentAbsent(markup);
  });

  it('renders non-CDI recovery as read/abandon only', () => {
    const markup = renderWorkspace(ineligibleModel());
    expect(markup).toContain('ne peut plus être modifié');
    expect(markup).toContain('Valeurs conservées dans le brouillon');
    expect(markup).toContain('Valeurs actuelles du dossier salarié');
    expect(markup).toContain('Abandonner le brouillon');
    expect(markup).not.toContain('Créer le brouillon');
    expect(markup).not.toContain('Valider les choix');
    expect(markup).not.toContain('>Enregistrer<');
    expectForbiddenContentAbsent(markup);
  });

  it('renders an abandoned record read-only with its retained reason', () => {
    const markup = renderWorkspace(abandonedModel());
    expect(markup).toContain('Brouillon abandonné — lecture seule');
    expect(markup).toContain('Besoin de recrutement annulé');
    expect(markup).toContain('Créer un nouveau brouillon');
    expect(markup).not.toContain('Enregistrer');
    expect(markup).not.toContain('Valider les choix');
    expectForbiddenContentAbsent(markup);
  });

  it('does not offer a new draft from an abandoned record when current Personnel is non-CDI', () => {
    const model = abandonedModel();
    const markup = renderWorkspace({
      ...model,
      currentPersonnelValues: {
        ...model.currentPersonnelValues,
        employmentTermType: 'fixed_term',
      },
    });
    expect(markup).toContain('Brouillon abandonné — lecture seule');
    expect(markup).not.toContain('Créer un nouveau brouillon');
  });

  it('provides safe French recovery messages for every typed failure state', () => {
    const model = editableModel();
    const cases = [
      workspaceFeedbackForOutcome({
        kind: 'validation_error',
        fieldErrors: { probationChoice: ['internal detail'] },
      }),
      workspaceFeedbackForOutcome({ kind: 'stale_draft', model }),
      workspaceFeedbackForOutcome({
        kind: 'stale_personnel_source',
        model: reconciliationModel(),
      }),
      workspaceFeedbackForOutcome({ kind: 'replay_conflict' }),
      workspaceFeedbackForOutcome({ kind: 'server_error' }),
      workspaceFeedbackForOutcome({ kind: 'not_found' }),
    ];
    expect(cases.map((entry) => entry.title)).toEqual([
      'Informations à vérifier',
      'Le brouillon a été modifié ailleurs',
      'Le dossier salarié a encore changé',
      'Envoi à reprendre',
      'Enregistrement incertain',
      'Dossier indisponible',
    ]);
    expect(JSON.stringify(cases)).not.toMatch(
      /internal detail|operationKey|fingerprint|organizationId|establishmentId|stack/i,
    );
  });

  it('keeps abandon, dirty-close and focus recovery bounded to this workspace', () => {
    const source = readFileSync(
      'src/app/(authenticated)/equipe/formalites-personnel/_components/cdi-draft-workspace.tsx',
      'utf8',
    );
    expect(source).toContain("window.addEventListener('beforeunload'");
    expect(source).toContain('window.confirm(');
    expect(source).toContain('maxLength={250}');
    expect(source).toContain('required');
    expect(source).toContain('focusSoon(abandonmentReasonRef)');
    expect(source).toContain(
      'focusElementSoon(`reconcile-${missingFact}-keep`)',
    );
    expect(source).not.toMatch(
      /localStorage|sessionStorage|setInterval|autosave/i,
    );
  });
});

describe('Formalités persistent route and protected prototype boundaries', () => {
  it('composes Formalités READ, independent Personnel READ and scoped repository read', () => {
    const source = readFileSync(
      'src/app/(authenticated)/equipe/formalites-personnel/[employeeId]/page.tsx',
      'utf8',
    );
    expect(source).toContain(
      "requireFormalitesTenant('formalites.read', path)",
    );
    expect(source).toContain(
      "requirePersonnelPermission(tenant, 'personnel.employee.read')",
    );
    expect(source).toContain('readFormalitesPersonnelDraft(');
    expect(source).toContain('isFormalitesReadPrototypeEnabled()');
    expect(source).toContain('if (!draftModel) notFound()');
    expect(source).not.toContain('organizationId:');
    expect(source).not.toContain('establishmentId:');
  });

  it.each([
    [
      'src/app/(authenticated)/equipe/formalites-personnel/page.tsx',
      'dca3e2bd45570847b95117ffe9c3acc7a332d08dd0a3383f2974d65f34326fe4',
    ],
    [
      'src/app/(authenticated)/equipe/formalites-personnel/_lib/formalites-read-prototype-runtime.ts',
      '8e68816d2e69b7ef373806a10bc313dd12650b7f651b2a1ff8e7be3b3f99eb50',
    ],
    [
      'src/app/(authenticated)/equipe/formalites-personnel/_lib/cdi-draft-prototype.ts',
      'c186e16f54a16d0447a727583166123df1498f83193efda9b97e258603c574cb',
    ],
    [
      'src/app/(authenticated)/equipe/formalites-personnel/_components/cdi-draft-readiness-prototype.tsx',
      '89cdfceaa840a0ce2f939aef5f4f77ff1ef8d27b8cb79e5269d3f64e96ea52c1',
    ],
    [
      'src/components/backoffice/backoffice-navigation.ts',
      '6deaa75874a35b114248d349433ab1c71b8e4e788411908786c5e89d6c4d0a97',
    ],
  ])(
    'keeps protected prototype/gate/navigation bytes unchanged: %s',
    (path, hash) => {
      expect(sha256(path)).toBe(hash);
    },
  );
});

function renderWorkspace(model: FormalitesPersonnelDraftReadModel): string {
  return renderToStaticMarkup(
    <CdiDraftWorkspace
      employeeId="019930d3-2f5d-7d5a-9f96-8f2e25e7c40a"
      employeeName="Camille Durand"
      initialModel={model}
      employeeDossierHref="/equipe/salaries/019930d3-2f5d-7d5a-9f96-8f2e25e7c40a"
      locale="fr-FR"
      loadAction={vi.fn()}
      createAction={vi.fn()}
      saveAction={vi.fn()}
      reconcileAction={vi.fn()}
      abandonAction={vi.fn()}
    />,
  );
}

function expectForbiddenContentAbsent(markup: string) {
  expect(markup).not.toMatch(
    /Adresse fictive|Rémunération|reviewAcknowledged|operationKey|sourceStateFingerprint|requestFingerprint|organizationId|establishmentId|actorUserId|stack trace|Générer|Signer|PDF/i,
  );
}

function sha256(path: string): string {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

const currentValues = {
  givenNames: 'Camille',
  familyName: 'Durand',
  position: 'Nouveau poste',
  qualification: 'Employée',
  employmentTermType: 'indefinite' as const,
  entryDate: '2026-09-01',
  contractWeeklyMinutes: 2_100,
};

function eligibleNoDraftModel(): FormalitesPersonnelDraftReadModel {
  return {
    state: 'eligible_no_draft',
    formalityType: 'cdi_preparation',
    currentPersonnelValues: currentValues,
  };
}

function editableModel(): Extract<
  FormalitesPersonnelDraftReadModel,
  { state: 'editable' }
> {
  return {
    state: 'editable',
    draftId: '019930d3-41ea-7282-81e4-2bddc527035d',
    formalityType: 'cdi_preparation',
    status: 'draft',
    probationChoice: 'undecided',
    revision: 2,
    draftValues: currentValues,
    currentPersonnelValues: currentValues,
    createdAt: '2026-09-05T00:00:00.000Z',
    updatedAt: '2026-09-05T01:00:00.000Z',
  };
}

function reconciliationModel(): Extract<
  FormalitesPersonnelDraftReadModel,
  { state: 'reconciliation_required' }
> {
  return {
    ...editableModel(),
    state: 'reconciliation_required',
    draftValues: { ...currentValues, position: 'Ancien poste' },
    divergentFacts: ['position'],
    sourceStateFingerprint: 'a'.repeat(64),
  };
}

function ineligibleModel(): Extract<
  FormalitesPersonnelDraftReadModel,
  { state: 'ineligible_recovery' }
> {
  return {
    ...editableModel(),
    state: 'ineligible_recovery',
    currentPersonnelValues: {
      ...currentValues,
      employmentTermType: 'fixed_term',
    },
    divergentFacts: ['employmentTermType'],
  };
}

function abandonedModel(): Extract<
  FormalitesPersonnelDraftReadModel,
  { state: 'abandoned' }
> {
  return {
    ...editableModel(),
    state: 'abandoned',
    status: 'abandoned',
    abandonmentReason: 'Besoin de recrutement annulé',
    abandonedAt: '2026-09-05T02:00:00.000Z',
  };
}
