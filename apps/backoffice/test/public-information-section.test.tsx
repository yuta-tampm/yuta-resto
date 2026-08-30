import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { PublicInformationSection } from '../src/app/(authenticated)/etablissement/informations-generales/_components/public-information-section';
import type { GeneralInformationProfile } from '../src/app/(authenticated)/etablissement/informations-generales/general-information-model';

const profile: GeneralInformationProfile = {
  name: 'LUNA',
  description: null,
  addressLine1: null,
  addressLine2: null,
  postalCode: null,
  city: null,
  countryCode: null,
  phone: '+33102030405',
  email: 'primary@example.com',
  website: null,
  publicPhone: '+33999999999',
  publicEmail: 'public@example.com',
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

function renderSection(canEdit: boolean): string {
  return renderToStaticMarkup(
    <PublicInformationSection
      draft={profile}
      canEdit={canEdit}
      fieldErrors={{}}
      setText={vi.fn()}
      setBoolean={vi.fn()}
      onCopyPrimaryContact={vi.fn()}
    />,
  );
}

describe('PublicInformationSection', () => {
  it('renders an explicit non-submit copy action for editors', () => {
    const markup = renderSection(true);

    expect(markup).toContain('Utiliser les coordonnées principales');
    expect(markup).toContain('type="button"');
  });

  it('does not render the mutating copy action for read-only users', () => {
    const markup = renderSection(false);

    expect(markup).not.toContain('Utiliser les coordonnées principales');
    expect(markup).not.toContain('type="button"');
  });
});
