import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { GeneralInformationProfile } from '../src/app/(authenticated)/etablissement/informations-generales/general-information-model';

const mocks = vi.hoisted(() => ({
  actionState: {
    status: 'idle' as 'idle' | 'success' | 'error',
    message: null as string | null,
    fieldErrors: {} as Record<string, string>,
  },
  draftOverride: null as GeneralInformationProfile | null,
  pending: false,
  saveGeneralInformationAction: vi.fn(),
}));

vi.mock(
  '../src/app/(authenticated)/etablissement/informations-generales/actions',
  () => ({
    saveGeneralInformationAction: mocks.saveGeneralInformationAction,
  }),
);
vi.mock('react-dom', () => ({
  useFormStatus: () => ({ pending: mocks.pending }),
}));
vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react')>();
  return {
    ...actual,
    useActionState: () => [mocks.actionState, vi.fn()],
    useState: (initial: unknown) => [mocks.draftOverride ?? initial, vi.fn()],
  };
});
vi.mock(
  '../src/app/(authenticated)/etablissement/informations-generales/_components/identity-section',
  () => ({
    IdentitySection: ({
      draft,
      fieldErrors,
    }: {
      draft: GeneralInformationProfile;
      fieldErrors: Record<string, string>;
    }) => (
      <div>
        <span>{draft.name}</span>
        {fieldErrors.name && <span>{fieldErrors.name}</span>}
      </div>
    ),
  }),
);
vi.mock(
  '../src/app/(authenticated)/etablissement/informations-generales/_components/coordinates-section',
  () => ({ CoordinatesSection: () => null }),
);
vi.mock(
  '../src/app/(authenticated)/etablissement/informations-generales/_components/public-information-section',
  () => ({ PublicInformationSection: () => null }),
);
vi.mock(
  '../src/app/(authenticated)/etablissement/informations-generales/_components/languages-service-modes-section',
  () => ({ LanguagesServiceModesSection: () => null }),
);
vi.mock(
  '../src/app/(authenticated)/etablissement/informations-generales/_components/general-information-preview',
  () => ({ GeneralInformationPreview: () => null }),
);

import { GeneralInformationForm } from '../src/app/(authenticated)/etablissement/informations-generales/_components/general-information-form';

const profile: GeneralInformationProfile = {
  name: 'LUNA',
  description: null,
  addressLine1: null,
  addressLine2: null,
  postalCode: null,
  city: null,
  countryCode: null,
  phone: null,
  email: null,
  website: null,
  publicPhone: null,
  publicEmail: null,
  logoUrl: null,
  coverImageUrl: null,
  languages: [],
  serviceModes: [],
  publicDescription: false,
  publicAddress: false,
  publicPhoneVisible: false,
  publicEmailVisible: false,
  publicWebsite: false,
  publicLanguages: false,
  publicServiceModes: false,
};

describe('GeneralInformationForm async feedback baseline', () => {
  beforeEach(() => {
    mocks.actionState = { status: 'idle', message: null, fieldErrors: {} };
    mocks.draftOverride = null;
    mocks.pending = false;
    mocks.saveGeneralInformationAction.mockReset();
  });

  it('keeps the existing action-specific pending label and native busy state', () => {
    mocks.pending = true;
    mocks.draftOverride = { ...profile, name: 'Brouillon LUNA' };

    const markup = renderToStaticMarkup(
      <GeneralInformationForm profile={profile} canEdit />,
    );

    expect(markup).toContain('Brouillon LUNA');
    expect(markup).toContain('Enregistrement…');
    expect(markup).toContain('disabled=""');
    expect(markup).toContain('aria-busy="true"');
    expect(markup).toContain('data-loading=""');
  });

  it('preserves failed draft context and the authoritative error result', () => {
    mocks.draftOverride = { ...profile, name: 'Brouillon conservé' };
    mocks.actionState = {
      status: 'error',
      message: 'Certains champs doivent être corrigés.',
      fieldErrors: { name: 'Vérifiez cette valeur.' },
    };

    const markup = renderToStaticMarkup(
      <GeneralInformationForm profile={profile} canEdit />,
    );

    expect(markup).toContain('Brouillon conservé');
    expect(markup).toContain('Certains champs doivent être corrigés.');
    expect(markup).toContain('Vérifiez cette valeur.');
    expect(markup).not.toMatch(/<button[^>]*disabled=""/);
  });

  it('renders the authoritative returned success without replacing the form', () => {
    mocks.actionState = {
      status: 'success',
      message: 'Informations générales enregistrées.',
      fieldErrors: {},
    };

    const markup = renderToStaticMarkup(
      <GeneralInformationForm profile={profile} canEdit />,
    );

    expect(markup).toContain('Informations générales enregistrées.');
    expect(markup).toContain('<form');
    expect(markup).toContain('Enregistrer');
  });
});
