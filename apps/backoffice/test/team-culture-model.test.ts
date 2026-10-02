import { describe, expect, it } from 'vitest';
import {
  canonicalTeamCultureValue,
  isTeamCultureDirty,
  teamCultureDraft,
  updateTransmissionAndIntegration,
  updateValuesAndMindset,
  updateWorkingTogether,
} from '../src/app/(authenticated)/etablissement/informations-generales/team-culture-model';

describe('Team Culture model', () => {
  it('exposes exactly three independently updateable values', () => {
    const initial = teamCultureDraft(null, null, null);
    const updated = updateTransmissionAndIntegration(
      updateWorkingTogether(
        updateValuesAndMindset(initial, 'Valeurs'),
        'Collaboration',
      ),
      'Transmission',
    );

    expect(updated).toEqual({
      valuesAndMindset: 'Valeurs',
      workingTogether: 'Collaboration',
      transmissionAndIntegration: 'Transmission',
    });
    expect(Object.keys(updated)).toEqual([
      'valuesAndMindset',
      'workingTogether',
      'transmissionAndIntegration',
    ]);
  });

  it('canonicalizes only empty string to null without trimming', () => {
    expect(canonicalTeamCultureValue(null)).toBeNull();
    expect(canonicalTeamCultureValue('')).toBeNull();
    expect(canonicalTeamCultureValue('abc')).toBe('abc');
    expect(canonicalTeamCultureValue('   ')).toBe('   ');
  });

  it('treats initial null and draft empty string as not dirty', () => {
    expect(
      isTeamCultureDirty(
        teamCultureDraft(null, null, null),
        teamCultureDraft('', null, null),
      ),
    ).toBe(false);
  });

  it('treats initial text and draft empty string as dirty', () => {
    expect(
      isTeamCultureDirty(
        teamCultureDraft('abc', null, null),
        teamCultureDraft('', null, null),
      ),
    ).toBe(true);
  });

  it('treats initial null and draft text as dirty', () => {
    expect(
      isTeamCultureDirty(
        teamCultureDraft(null, null, null),
        teamCultureDraft('abc', null, null),
      ),
    ).toBe(true);
  });

  it('is not dirty after empty-string save canonicalizes to null without remount', () => {
    const retainedBrowserDraft = teamCultureDraft('', null, null);
    const revalidatedServerState = teamCultureDraft(null, null, null);

    expect(
      isTeamCultureDirty(revalidatedServerState, retainedBrowserDraft),
    ).toBe(false);
  });
});
