import { describe, expect, it } from 'vitest';
import {
  calculateCompletion,
  copyPrimaryContactToPublic,
  safeHttpUrl,
  type GeneralInformationProfile,
} from '../src/app/(authenticated)/etablissement/informations-generales/general-information-model';

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

describe('general information model', () => {
  it('copies both populated primary contacts over existing public values', () => {
    const result = copyPrimaryContactToPublic({
      ...profile,
      phone: '+33102030405',
      email: 'primary@example.com',
      publicPhone: '+33999999999',
      publicEmail: 'public@example.com',
    });

    expect(result.publicPhone).toBe('+33102030405');
    expect(result.publicEmail).toBe('primary@example.com');
  });

  it.each([
    {
      sourceLabel: 'null phone',
      phone: null,
      email: 'primary@example.com',
      expectedPhone: '+33999999999',
      expectedEmail: 'primary@example.com',
    },
    {
      sourceLabel: 'empty phone',
      phone: '',
      email: 'primary@example.com',
      expectedPhone: '+33999999999',
      expectedEmail: 'primary@example.com',
    },
    {
      sourceLabel: 'null email',
      phone: '+33102030405',
      email: null,
      expectedPhone: '+33102030405',
      expectedEmail: 'public@example.com',
    },
    {
      sourceLabel: 'empty email',
      phone: '+33102030405',
      email: '',
      expectedPhone: '+33102030405',
      expectedEmail: 'public@example.com',
    },
  ])(
    'copies each field independently when the source has $sourceLabel',
    ({ phone, email, expectedPhone, expectedEmail }) => {
      const result = copyPrimaryContactToPublic({
        ...profile,
        phone,
        email,
        publicPhone: '+33999999999',
        publicEmail: 'public@example.com',
      });

      expect(result.publicPhone).toBe(expectedPhone);
      expect(result.publicEmail).toBe(expectedEmail);
    },
  );

  it.each([
    { phone: null, email: null },
    { phone: '', email: '' },
    { phone: null, email: '' },
    { phone: '', email: null },
  ])(
    'keeps both public values when both sources are empty',
    ({ phone, email }) => {
      const current = {
        ...profile,
        phone,
        email,
        publicPhone: '+33999999999',
        publicEmail: 'public@example.com',
      };

      expect(copyPrimaryContactToPublic(current)).toEqual(current);
    },
  );

  it('preserves unrelated profile fields', () => {
    const result = copyPrimaryContactToPublic({
      ...profile,
      name: 'LUNA Paris',
      description: 'Restaurant vietnamien',
      phone: '+33102030405',
      email: 'primary@example.com',
      publicPhone: null,
      publicEmail: null,
      languages: ['fr', 'vi'],
      publicDescription: true,
    });

    expect(result).toMatchObject({
      name: 'LUNA Paris',
      description: 'Restaurant vietnamien',
      languages: ['fr', 'vi'],
      publicDescription: true,
    });
  });

  it('does not link public contacts to later primary-contact changes', () => {
    const copied = copyPrimaryContactToPublic({
      ...profile,
      phone: '+33102030405',
      email: 'primary@example.com',
    });
    const laterDraft = {
      ...copied,
      phone: '+33111111111',
      email: 'updated@example.com',
    };

    expect(laterDraft.publicPhone).toBe('+33102030405');
    expect(laterDraft.publicEmail).toBe('primary@example.com');
  });

  it('keeps the existing completion calculation based on supported fields', () => {
    expect(calculateCompletion(profile)).toBe(7);
    expect(
      calculateCompletion({
        ...profile,
        description: 'Restaurant vietnamien',
        addressLine1: '1 rue de Paris',
        postalCode: '75001',
        city: 'Paris',
        countryCode: 'FR',
        phone: '+33102030405',
        email: 'contact@example.com',
        website: 'https://example.com',
        publicPhone: '+33102030405',
        publicEmail: 'bonjour@example.com',
        logoUrl: 'https://example.com/logo.png',
        languages: ['fr'],
        serviceModes: ['DINE_IN'],
      }),
    ).toBe(100);
  });

  it('allows only complete HTTP(S) URLs in local image previews', () => {
    expect(safeHttpUrl('https://example.com/logo.png')).toBe(
      'https://example.com/logo.png',
    );
    expect(safeHttpUrl('http://localhost/logo.png')).toBe(
      'http://localhost/logo.png',
    );
    expect(safeHttpUrl('javascript:alert(1)')).toBeNull();
    expect(safeHttpUrl('not-a-url')).toBeNull();
    expect(safeHttpUrl(null)).toBeNull();
  });
});
