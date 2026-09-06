import type {
  ReputationReviewSocialLinksOutcome,
  ReputationReviewSocialLinksReadModel,
} from '@yuta/contracts/reputation';
import type { TenantContext, TenantRole } from '@yuta/tenant';
import { randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  tenant: null as TenantContext | null,
  requireReputationTenant: vi.fn(),
  requireReputationPermission: vi.fn(),
  readReputationReviewSocialLinks: vi.fn(),
  saveReviewSocialLinksAction: vi.fn(),
  refresh: vi.fn(),
}));

vi.mock('server-only', () => ({}));
vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: mocks.refresh }),
}));
vi.mock('@yuta/db-cloud', () => ({
  readReputationReviewSocialLinks: mocks.readReputationReviewSocialLinks,
}));
vi.mock('../src/server/cloud-database', () => ({
  cloudDatabase: { kind: 'test-cloud-database' },
}));
vi.mock('../src/server/auth/session', () => ({
  requireReputationTenant: mocks.requireReputationTenant,
}));
vi.mock('../src/server/auth/permissions', () => ({
  requireReputationPermission: mocks.requireReputationPermission,
}));
vi.mock(
  '../src/app/(authenticated)/visibilite-reputation/satisfaction/actions',
  () => ({
    saveReviewSocialLinksAction: mocks.saveReviewSocialLinksAction,
  }),
);

import { ReviewSocialLinksSettingsSection } from '../src/app/(authenticated)/visibilite-reputation/satisfaction/page';
import {
  ReviewSocialLinksSettings,
  ReviewSocialLinksSettingsLoading,
} from '../src/app/(authenticated)/visibilite-reputation/satisfaction/_components/review-social-links-settings';
import {
  applyReviewSocialLinksOutcome,
  canSubmitReviewSocialLinks,
  createReviewSocialLinksSubmissionGate,
  createReviewSocialLinksViewState,
  prepareReviewSocialLinksSave,
  reloadReviewSocialLinksConflict,
  updateReviewSocialLinksDraft,
  validateReviewSocialLinksDraft,
} from '../src/app/(authenticated)/visibilite-reputation/satisfaction/_lib/review-social-links-state';

const model: ReputationReviewSocialLinksReadModel = {
  values: {
    googleReviewUrl: 'https://g.page/yuta/review',
    facebookReviewUrl: 'https://www.facebook.com/yuta',
    instagramUrl: 'https://www.instagram.com/yuta',
  },
  stateToken: 'a'.repeat(64),
};
const success = { kind: 'success' as const, model };

describe('Reputation review social links settings model', () => {
  it('normalizes empty, add, replace, clear and mixed edits into one atomic input', () => {
    const emptyModel = {
      ...model,
      values: {
        googleReviewUrl: null,
        facebookReviewUrl: null,
        instagramUrl: null,
      },
    };
    let state = createReviewSocialLinksViewState({
      kind: 'success',
      model: emptyModel,
    });
    state = updateReviewSocialLinksDraft(
      state,
      'googleReviewUrl',
      ' https://g.page/new/review ',
    );
    state = updateReviewSocialLinksDraft(
      state,
      'facebookReviewUrl',
      'https://m.facebook.com/yuta',
    );
    let prepared = prepareReviewSocialLinksSave(state);
    expect(prepared.kind).toBe('ready');
    if (prepared.kind !== 'ready') return;
    expect(prepared.state.status).toBe('saving');
    expect(prepared.input.proposedValues).toEqual({
      googleReviewUrl: 'https://g.page/new/review',
      facebookReviewUrl: 'https://m.facebook.com/yuta',
      instagramUrl: null,
    });

    state = createReviewSocialLinksViewState(success);
    state = updateReviewSocialLinksDraft(
      state,
      'googleReviewUrl',
      'https://www.google.com/maps/place/yuta',
    );
    state = updateReviewSocialLinksDraft(state, 'facebookReviewUrl', '');
    state = updateReviewSocialLinksDraft(
      state,
      'instagramUrl',
      'https://instagram.com/yuta-new',
    );
    prepared = prepareReviewSocialLinksSave(state);
    expect(prepared.kind).toBe('ready');
    if (prepared.kind !== 'ready') return;
    expect(prepared.input).toEqual({
      expectedValues: model.values,
      proposedValues: {
        googleReviewUrl: 'https://www.google.com/maps/place/yuta',
        facebookReviewUrl: null,
        instagramUrl: 'https://instagram.com/yuta-new',
      },
      expectedStateToken: model.stateToken,
    });
  });

  it('keeps invalid draft, maps the field error and prevents submit', () => {
    let state = createReviewSocialLinksViewState(success);
    state = updateReviewSocialLinksDraft(
      state,
      'googleReviewUrl',
      'https://example.invalid/review',
    );
    expect(canSubmitReviewSocialLinks(state)).toBe(false);
    const prepared = prepareReviewSocialLinksSave(state);
    expect(prepared.kind).toBe('blocked');
    expect(prepared.state.status).toBe('invalid');
    expect(prepared.state.draft.googleReviewUrl).toBe(
      'https://example.invalid/review',
    );
    expect(prepared.state.fieldErrors.googleReviewUrl).toContain('destination');
  });

  it('makes an invalid Google draft reachable on blur and enables Save after correction', () => {
    let state = createReviewSocialLinksViewState(success);
    state = updateReviewSocialLinksDraft(
      state,
      'googleReviewUrl',
      'https://example.invalid/review',
    );
    state = validateReviewSocialLinksDraft(state);

    expect(state.status).toBe('invalid');
    expect(state.fieldErrors.googleReviewUrl).toContain('destination');
    expect(canSubmitReviewSocialLinks(state)).toBe(false);
    expect(state.draft.googleReviewUrl).toBe('https://example.invalid/review');

    state = updateReviewSocialLinksDraft(
      state,
      'googleReviewUrl',
      'https://www.google.com/maps/place/yuta-corrected',
    );

    expect(state.fieldErrors.googleReviewUrl).toBeUndefined();
    expect(state.status).toBe('dirty');
    expect(canSubmitReviewSocialLinks(state)).toBe(true);
  });

  it.each([
    ['facebookReviewUrl', 'https://example.invalid/facebook'],
    ['instagramUrl', 'https://example.invalid/instagram'],
  ] as const)(
    'maps blur validation to the invalid %s field',
    (field, value) => {
      const state = validateReviewSocialLinksDraft(
        updateReviewSocialLinksDraft(
          createReviewSocialLinksViewState(success),
          field,
          value,
        ),
      );

      expect(state.status).toBe('invalid');
      expect(state.fieldErrors[field]).toContain('destination');
      expect(canSubmitReviewSocialLinks(state)).toBe(false);
    },
  );

  it('keeps the shared-schema submit fallback and does not define a private provider validator', () => {
    const invalid = updateReviewSocialLinksDraft(
      createReviewSocialLinksViewState(success),
      'instagramUrl',
      'not-a-url',
    );
    const prepared = prepareReviewSocialLinksSave(invalid);
    expect(prepared.kind).toBe('blocked');
    expect(prepared.state.fieldErrors.instagramUrl).toBeDefined();

    const stateSource = readFileSync(
      'src/app/(authenticated)/visibilite-reputation/satisfaction/_lib/review-social-links-state.ts',
      'utf8',
    );
    expect(stateSource).toContain(
      'reputationReviewSocialLinksValuesSchema.safeParse',
    );
    expect(stateSource).not.toMatch(
      /google\.com|google\.fr|g\.page|facebook\.com|instagram\.com|fb\.me/,
    );
  });

  it('blocks normalized no-op submissions and reports the no-change state', () => {
    const state = createReviewSocialLinksViewState(success);
    expect(canSubmitReviewSocialLinks(state)).toBe(false);
    const prepared = prepareReviewSocialLinksSave(state);
    expect(prepared.kind).toBe('blocked');
    expect(prepared.state.status).toBe('no_change');
  });

  it('prevents a second submission until the active attempt finishes', () => {
    const gate = createReviewSocialLinksSubmissionGate();
    expect(gate.tryStart()).toBe(true);
    expect(gate.tryStart()).toBe(false);
    gate.finish();
    expect(gate.tryStart()).toBe(true);
  });

  it('replaces baseline after success/no-change and preserves draft on retryable error', () => {
    const dirty = updateReviewSocialLinksDraft(
      createReviewSocialLinksViewState(success),
      'instagramUrl',
      '',
    );
    const serverError = applyReviewSocialLinksOutcome(dirty, {
      kind: 'server_error',
    });
    expect(serverError.draft.instagramUrl).toBe('');
    expect(serverError.status).toBe('server_error');

    const committedModel = {
      values: { ...model.values, instagramUrl: null },
      stateToken: 'b'.repeat(64),
    };
    const committed = applyReviewSocialLinksOutcome(serverError, {
      kind: 'success',
      model: committedModel,
    });
    expect(committed.baseline).toEqual(committedModel);
    expect(committed.draft.instagramUrl).toBe('');
    expect(committed.status).toBe('saved');

    expect(
      applyReviewSocialLinksOutcome(committed, {
        kind: 'no_change',
        model: committedModel,
      }).status,
    ).toBe('no_change');
  });

  it('keeps a conflicting draft until explicit authoritative reload', () => {
    const dirty = updateReviewSocialLinksDraft(
      createReviewSocialLinksViewState(success),
      'facebookReviewUrl',
      'https://facebook.com/local-draft',
    );
    const authoritative = {
      values: {
        ...model.values,
        facebookReviewUrl: 'https://facebook.com/authoritative',
      },
      stateToken: 'c'.repeat(64),
    };
    const conflict = applyReviewSocialLinksOutcome(dirty, {
      kind: 'conflict',
      model: authoritative,
    });
    expect(conflict.draft.facebookReviewUrl).toContain('local-draft');
    expect(canSubmitReviewSocialLinks(conflict)).toBe(false);

    const reloaded = reloadReviewSocialLinksConflict(conflict);
    expect(reloaded.draft.facebookReviewUrl).toContain('authoritative');
    expect(reloaded.baseline).toEqual(authoritative);
  });

  it.each([
    { kind: 'configuration_unavailable' } as const,
    { kind: 'server_error' } as const,
  ])('keeps $kind fail closed without a writable baseline', (outcome) => {
    const state = createReviewSocialLinksViewState(outcome);
    expect(state.baseline).toBeNull();
    expect(canSubmitReviewSocialLinks(state)).toBe(false);
    expect(prepareReviewSocialLinksSave(state).kind).toBe('blocked');
  });
});

describe('Reputation review social links settings component', () => {
  it('renders one labelled form without exposing token or internal identifiers', () => {
    const markup = renderSettings(success);
    expect(markup.match(/<form/g)).toHaveLength(1);
    expect(markup).toContain('Liens d’avis et réseaux sociaux');
    expect(markup).toContain('Lien Google');
    expect(markup).toContain('Lien Facebook');
    expect(markup).toContain('Lien Instagram');
    expect(markup).toContain('Enregistrer');
    expect(markup).not.toContain(model.stateToken);
    expect(markup).not.toMatch(
      /settingsId|auditId|actorId|organizationId|establishmentId/i,
    );
  });

  it('renders unavailable and loading states with no enabled Save path', () => {
    const unavailable = renderSettings({
      kind: 'configuration_unavailable',
    });
    expect(unavailable).toContain('Configuration indisponible');
    expect(unavailable).toContain('disabled=""');
    expect(unavailable).not.toContain(model.stateToken);

    const loading = renderToStaticMarkup(<ReviewSocialLinksSettingsLoading />);
    expect(loading).toContain('aria-busy="true"');
    expect(loading).toContain('Chargement de la configuration');
  });

  it('uses one stable DOM order after the existing inbox without CSS order utilities', () => {
    const source = readFileSync(
      'src/app/(authenticated)/visibilite-reputation/satisfaction/page.tsx',
      'utf8',
    );
    expect(source.indexOf('{reviewsPage}')).toBeGreaterThan(-1);
    expect(source.indexOf('{reviewsPage}')).toBeLessThan(
      source.indexOf('<Suspense'),
    );

    const componentSource = readFileSync(
      'src/app/(authenticated)/visibilite-reputation/satisfaction/_components/review-social-links-settings.tsx',
      'utf8',
    );
    expect(componentSource).not.toMatch(/\border-(first|last|none|[0-9]+)/);
    expect(componentSource.match(/<form/g)).toHaveLength(1);
    expect(componentSource).not.toMatch(
      /autosave|localStorage|sessionStorage/i,
    );
    expect(componentSource).toContain('submissionGate.current.tryStart()');
    expect(componentSource).toContain('.current?.focus()');
    expect(componentSource).toContain(
      'validateReviewSocialLinksDraft(current)',
    );
    expect(componentSource).toContain(
      'aria-describedby={error ? errorId : undefined}',
    );
  });
});

describe('Reputation review social links OWNER projection', () => {
  beforeEach(() => {
    mocks.tenant = context('OWNER');
    mocks.requireReputationTenant.mockReset();
    mocks.requireReputationTenant.mockImplementation(async () => ({
      session: { userId: randomUUID() },
      tenant: mocks.tenant,
    }));
    mocks.requireReputationPermission.mockReset();
    mocks.readReputationReviewSocialLinks.mockReset();
    mocks.readReputationReviewSocialLinks.mockResolvedValue(success);
  });

  it('loads the model only for trusted OWNER after settings permission', async () => {
    const section = await ReviewSocialLinksSettingsSection();
    const markup = renderToStaticMarkup(section);
    expect(markup).toContain('Liens d’avis et réseaux sociaux');
    expect(mocks.requireReputationPermission).toHaveBeenCalledWith(
      mocks.tenant,
      'reputation.settings.manage',
    );
    expect(mocks.readReputationReviewSocialLinks).toHaveBeenCalledWith(
      { kind: 'test-cloud-database' },
      mocks.tenant,
    );
  });

  it.each(['MANAGER', 'STAFF'] as const)(
    'keeps the inbox but returns no settings section/model for %s',
    async (role) => {
      mocks.tenant = context(role);
      await expect(ReviewSocialLinksSettingsSection()).resolves.toBeNull();
      expect(mocks.requireReputationPermission).not.toHaveBeenCalled();
      expect(mocks.readReputationReviewSocialLinks).not.toHaveBeenCalled();
    },
  );
});

function renderSettings(
  initialOutcome:
    | { kind: 'success'; model: ReputationReviewSocialLinksReadModel }
    | { kind: 'configuration_unavailable' }
    | { kind: 'server_error' },
): string {
  return renderToStaticMarkup(
    <ReviewSocialLinksSettings
      initialOutcome={initialOutcome}
      saveAction={vi.fn<
        (input: unknown) => Promise<ReputationReviewSocialLinksOutcome>
      >()}
    />,
  );
}

function context(role: TenantRole): TenantContext {
  return {
    organizationId: randomUUID(),
    establishmentId: randomUUID(),
    actor: {
      type: 'user',
      userId: randomUUID(),
      membershipId: randomUUID(),
      role,
    },
    locale: 'fr-FR',
    timezone: 'Europe/Paris',
    entitlements: new Set(['reputation.enabled']),
  };
}
