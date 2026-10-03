import type { FormalitesPersonnelDraftReadModel } from '@yuta/contracts';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}));
import { CdiDraftWorkspace } from '../src/app/(authenticated)/equipe/formalites-personnel/_components/cdi-draft-workspace';
import {
  AbandonedDraft,
  EditableDraft,
  EligibleNoDraft,
  IneligibleRecovery,
  ReconciliationRequired,
  WorkspaceFeedbackAlert,
} from '../src/app/(authenticated)/equipe/formalites-personnel/_components/cdi-draft-workspace-panels';
import {
  abandonmentReasonRequiredFeedback,
  incompleteReconciliationFeedback,
  workspaceFeedbackForOutcome,
  workspaceReloadedFeedback,
  workspaceSavedFeedback,
} from '../src/app/(authenticated)/equipe/formalites-personnel/_lib/cdi-draft-workspace-feedback';
import {
  getActiveNavigationHref,
  getVisibleNavigationSections,
} from '../src/components/backoffice/backoffice-navigation';

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

  it('presents a forbidden action truthfully without inviting a retry', () => {
    const feedback = workspaceFeedbackForOutcome({ kind: 'forbidden' });
    expect(feedback).toEqual({
      tone: 'danger',
      title: 'Action non autorisée',
      description: 'Votre accès actuel ne permet pas de modifier ce brouillon.',
      recoverable: false,
    });
    const markup = renderToStaticMarkup(
      <WorkspaceFeedbackAlert
        feedback={feedback}
        feedbackRef={{ current: null }}
        pending={false}
        onReload={vi.fn()}
      />,
    );
    expect(markup).toContain('Action non autorisée');
    expect(markup).not.toContain('Recharger la version enregistrée');
    expect(markup).not.toMatch(/Réessayez/);
    expect(markup).toContain('tabindex="-1"');
    expect(markup).toContain('focus:ring-2');
  });

  it('keeps the reload action on recoverable feedback only', () => {
    const markup = renderToStaticMarkup(
      <WorkspaceFeedbackAlert
        feedback={workspaceFeedbackForOutcome({ kind: 'server_error' })}
        feedbackRef={{ current: null }}
        pending={false}
        onReload={vi.fn()}
      />,
    );
    expect(markup).toContain('Recharger la version enregistrée');
  });

  it('disables every mutation control while locked without a loading state', () => {
    const noop = vi.fn();
    const markups = [
      renderToStaticMarkup(
        <EligibleNoDraft
          model={eligibleNoDraftModel()}
          locale="fr-FR"
          pending={false}
          locked
          onCreate={noop}
        />,
      ),
      renderToStaticMarkup(
        <EditableDraft
          model={editableModel()}
          locale="fr-FR"
          probationChoice="include"
          pending={false}
          locked
          onProbationChoice={noop}
          onSave={noop}
          onAbandon={noop}
        />,
      ),
      renderToStaticMarkup(
        <ReconciliationRequired
          model={reconciliationModel()}
          locale="fr-FR"
          choices={{}}
          pending={false}
          locked
          onChoice={noop}
          onReconcile={noop}
          onAbandon={noop}
        />,
      ),
      renderToStaticMarkup(
        <IneligibleRecovery
          model={ineligibleModel()}
          locale="fr-FR"
          pending={false}
          locked
          onAbandon={noop}
        />,
      ),
      renderToStaticMarkup(
        <AbandonedDraft
          model={abandonedModel()}
          locale="fr-FR"
          pending={false}
          locked
          onCreate={noop}
        />,
      ),
    ];
    for (const markup of markups) {
      const buttons = markup.match(/<button\b[^>]*>/g) ?? [];
      expect(buttons.length).toBeGreaterThan(0);
      for (const button of buttons) expect(button).toMatch(/\bdisabled=""/);
      expect(markup).not.toContain('aria-busy="true"');
    }
  });

  it('keeps local workspace feedback copy and fresh feedback objects', () => {
    expect(workspaceSavedFeedback()).toEqual({
      tone: 'success',
      title: 'Modifications enregistrées',
      description:
        'Le brouillon affiché correspond maintenant à la version enregistrée.',
      recoverable: false,
    });
    expect(workspaceReloadedFeedback()).toEqual({
      tone: 'info',
      title: 'Données actualisées',
      description: 'La dernière version enregistrée est affichée.',
      recoverable: false,
    });
    expect(incompleteReconciliationFeedback()).toEqual({
      tone: 'danger',
      title: 'Choix incomplet',
      description:
        'Choisissez une action pour chaque information différente avant de continuer.',
      recoverable: false,
    });
    expect(abandonmentReasonRequiredFeedback()).toEqual({
      tone: 'danger',
      title: 'Motif requis',
      description: 'Saisissez un motif entre 1 et 250 caractères.',
      recoverable: false,
    });
    expect(incompleteReconciliationFeedback()).not.toBe(
      incompleteReconciliationFeedback(),
    );
  });

  it('keeps abandon, dirty-close and focus recovery bounded to this workspace', () => {
    const componentsDirectory =
      'src/app/(authenticated)/equipe/formalites-personnel/_components';
    const workspace = readFileSync(
      `${componentsDirectory}/cdi-draft-workspace.tsx`,
      'utf8',
    );
    const panels = readFileSync(
      `${componentsDirectory}/cdi-draft-workspace-panels.tsx`,
      'utf8',
    );
    const fields = readFileSync(
      `${componentsDirectory}/cdi-draft-workspace-fields.tsx`,
      'utf8',
    );
    expect(workspace).toContain("window.addEventListener('beforeunload'");
    expect(workspace).toContain('window.confirm(');
    expect(workspace).toContain('focusSoon(abandonmentReasonRef)');
    expect(workspace).toContain('reasonRef={abandonmentReasonRef}');
    expect(workspace).toContain(
      'focusElementSoon(`reconcile-${missingFact}-keep`)',
    );
    expect(panels).toContain('ref={reasonRef}');
    expect(panels).toContain('maxLength={250}');
    expect(panels).toContain('required');
    for (const source of [workspace, panels, fields]) {
      expect(source).not.toMatch(
        /localStorage|sessionStorage|setInterval|autosave/i,
      );
    }
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
  ])('keeps protected prototype/gate bytes unchanged: %s', (path, hash) => {
    expect(sha256(path)).toBe(hash);
  });

  // The original protected navigation SHA-256 was
  // 6deaa75874a35b114248d349433ab1c71b8e4e788411908786c5e89d6c4d0a97.
  // The approved release-a-customer-exposure-foundation deltas qualify hosted
  // navigation by availability. This checks preserved internal behavior and
  // the approved A exclusion; it does not claim those historical bytes match.
  it('preserves original internal navigation inventory and Formalités access prerequisites', () => {
    const capabilities = {
      bookingEnabled: true,
      reputationEnabled: true,
      canManageBookingSettings: true,
      canManageUsers: true,
      canReadPersonnel: true,
      canManageGoogleConnector: true,
    };
    const internal = getVisibleNavigationSections({
      ...capabilities,
      exposureProfile: 'internal',
    });
    expect(getVisibleNavigationSections(capabilities)).toEqual(internal);
    expect(
      internal.map((section) => ({
        title: section.title,
        items: section.items.map(({ label, href, requires }) => ({
          label,
          href,
          ...(requires ? { requires } : {}),
        })),
      })),
    ).toEqual(originalInternalNavigation);

    const withoutPersonnel = getVisibleNavigationSections({
      ...capabilities,
      exposureProfile: 'internal',
      canReadPersonnel: false,
    });
    expect(
      withoutPersonnel.flatMap((section) =>
        section.items.map((item) => item.href),
      ),
    ).toEqual(
      internal
        .flatMap((section) => section.items.map((item) => item.href))
        .filter(
          (href) =>
            href !== '/equipe/salaries' &&
            href !== '/equipe/formalites-personnel',
        ),
    );
    expect(
      getActiveNavigationHref(
        '/equipe/formalites-personnel/employee',
        internal,
      ),
    ).toBe('/equipe/formalites-personnel');
    expect(
      getActiveNavigationHref('/equipe/registre-personnel/employee', internal),
    ).toBe('/equipe/salaries');
  });

  it('excludes generic and connected Formalités navigation in A despite valid existing prerequisites', () => {
    const sections = getVisibleNavigationSections({
      exposureProfile: 'release-a',
      bookingEnabled: true,
      reputationEnabled: true,
      canManageBookingSettings: true,
      canManageUsers: true,
      canReadPersonnel: true,
      canManageGoogleConnector: true,
    });
    expect(
      sections.flatMap((section) => section.items.map((item) => item.href)),
    ).not.toContain('/equipe/formalites-personnel');
    for (const path of [
      '/equipe/formalites-personnel',
      '/equipe/formalites-personnel/employee',
    ]) {
      expect(getActiveNavigationHref(path, sections)).toBeUndefined();
    }
  });
});

const originalInternalNavigation = [
  {
    title: 'Accueil',
    items: [{ label: 'Aujourd’hui', href: '/aujourdhui' }],
  },
  {
    title: 'Réservations',
    items: [
      {
        label: 'Réservations',
        href: '/reservations',
        requires: ['bookingEnabled'],
      },
      {
        label: 'Paramètres de réservation',
        href: '/reservations/parametres',
        requires: ['bookingEnabled', 'canManageBookingSettings'],
      },
    ],
  },
  {
    title: 'Établissement',
    items: [
      {
        label: 'Informations générales',
        href: '/etablissement/informations-generales',
      },
      {
        label: 'Horaires & services',
        href: '/etablissement/horaires-services',
        requires: ['bookingEnabled', 'canManageBookingSettings'],
      },
      {
        label: 'Salle & tables',
        href: '/etablissement/salles-tables',
        requires: ['bookingEnabled'],
      },
      { label: 'Carte & menus', href: '/etablissement/carte-menus' },
      {
        label: 'Ressources internes',
        href: '/etablissement/ressources-internes',
      },
    ],
  },
  {
    title: 'Stock',
    items: [
      { label: 'Inventaire', href: '/stock/inventaire' },
      { label: 'Mouvements de stock', href: '/stock/mouvements' },
      { label: 'Fiches techniques', href: '/stock/fiches-techniques' },
      { label: 'Fournisseurs', href: '/stock/fournisseurs' },
    ],
  },
  {
    title: 'Gestion de l’équipe',
    items: [
      {
        label: 'Salariés',
        href: '/equipe/salaries',
        requires: ['canReadPersonnel'],
      },
      { label: 'Planning', href: '/equipe/planning' },
      { label: 'Pointage', href: '/equipe/pointage' },
      { label: 'Tâches du jour', href: '/equipe/taches-quotidiennes' },
      {
        label: 'Formalités du personnel',
        href: '/equipe/formalites-personnel',
        requires: ['canReadPersonnel'],
      },
    ],
  },
  {
    title: 'Conformité',
    items: [{ label: 'Veille & conformité', href: '/conformite/veille' }],
  },
  {
    title: 'Visibilité & réputation',
    items: [
      {
        label: 'Satisfaction client',
        href: '/visibilite-reputation/satisfaction',
        requires: ['reputationEnabled'],
      },
      {
        label: 'Avis & commentaires',
        href: '/visibilite-reputation/avis',
        requires: ['reputationEnabled'],
      },
    ],
  },
  {
    title: 'Marketing & contenu',
    items: [
      { label: 'Créations visuelles', href: '/marketing/studio-creatif' },
      { label: 'Création de contenus', href: '/marketing/contenus' },
    ],
  },
  {
    title: 'Paramètres',
    items: [
      { label: 'Modules & abonnement', href: '/parametres/abonnement' },
      {
        label: 'Utilisateurs & accès',
        href: '/parametres/utilisateurs-acces',
        requires: ['canManageUsers'],
      },
    ],
  },
];

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

function eligibleNoDraftModel(): Extract<
  FormalitesPersonnelDraftReadModel,
  { state: 'eligible_no_draft' }
> {
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
