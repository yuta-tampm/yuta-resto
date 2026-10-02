import { describe, expect, it } from 'vitest';
import {
  canonicalCommunicationIdentityValue,
  communicationIdentityDraft,
  isCommunicationIdentityDirty,
  updateCustomerAddressing,
  updateLanguageElementsAndThingsToAvoid,
  updateToneAndCommunicationStyle,
} from '../src/app/(authenticated)/etablissement/informations-generales/communication-identity-model';

describe('Communication Identity model', () => {
  it('exposes exactly three independently updateable values', () => {
    const initial = communicationIdentityDraft(null, null, null);
    const updated = updateLanguageElementsAndThingsToAvoid(
      updateCustomerAddressing(
        updateToneAndCommunicationStyle(initial, 'Ton'),
        'Adresse',
      ),
      'Langage',
    );

    expect(updated).toEqual({
      toneAndCommunicationStyle: 'Ton',
      customerAddressing: 'Adresse',
      languageElementsAndThingsToAvoid: 'Langage',
    });
    expect(Object.keys(updated)).toEqual([
      'toneAndCommunicationStyle',
      'customerAddressing',
      'languageElementsAndThingsToAvoid',
    ]);
  });

  it('canonicalizes only empty string to null without trimming', () => {
    expect(canonicalCommunicationIdentityValue(null)).toBeNull();
    expect(canonicalCommunicationIdentityValue('')).toBeNull();
    expect(canonicalCommunicationIdentityValue('abc')).toBe('abc');
    expect(canonicalCommunicationIdentityValue('   ')).toBe('   ');
  });

  it('treats initial null and draft empty string as not dirty', () => {
    expect(
      isCommunicationIdentityDirty(
        communicationIdentityDraft(null, null, null),
        communicationIdentityDraft('', null, null),
      ),
    ).toBe(false);
  });

  it('treats initial text and draft empty string as dirty', () => {
    expect(
      isCommunicationIdentityDirty(
        communicationIdentityDraft('abc', null, null),
        communicationIdentityDraft('', null, null),
      ),
    ).toBe(true);
  });

  it('treats initial null and draft text as dirty', () => {
    expect(
      isCommunicationIdentityDirty(
        communicationIdentityDraft(null, null, null),
        communicationIdentityDraft('abc', null, null),
      ),
    ).toBe(true);
  });

  it('is not dirty after empty-string save canonicalizes to null without remount', () => {
    const retainedBrowserDraft = communicationIdentityDraft('', '', '');
    const canonicalSavedBaseline = communicationIdentityDraft(null, null, null);

    expect(
      isCommunicationIdentityDirty(
        canonicalSavedBaseline,
        retainedBrowserDraft,
      ),
    ).toBe(false);
  });
});
