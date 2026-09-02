export type TeamCultureDraft = {
  valuesAndMindset: string | null;
  workingTogether: string | null;
  transmissionAndIntegration: string | null;
};

export function teamCultureDraft(
  valuesAndMindset: string | null,
  workingTogether: string | null,
  transmissionAndIntegration: string | null,
): TeamCultureDraft {
  return { valuesAndMindset, workingTogether, transmissionAndIntegration };
}

export function updateValuesAndMindset(
  draft: TeamCultureDraft,
  valuesAndMindset: string,
): TeamCultureDraft {
  return { ...draft, valuesAndMindset };
}

export function updateWorkingTogether(
  draft: TeamCultureDraft,
  workingTogether: string,
): TeamCultureDraft {
  return { ...draft, workingTogether };
}

export function updateTransmissionAndIntegration(
  draft: TeamCultureDraft,
  transmissionAndIntegration: string,
): TeamCultureDraft {
  return { ...draft, transmissionAndIntegration };
}

export function canonicalTeamCultureValue(value: string | null): string | null {
  return value === '' ? null : value;
}

export function isTeamCultureDirty(
  initial: TeamCultureDraft,
  draft: TeamCultureDraft,
): boolean {
  return (
    canonicalTeamCultureValue(draft.valuesAndMindset) !==
      canonicalTeamCultureValue(initial.valuesAndMindset) ||
    canonicalTeamCultureValue(draft.workingTogether) !==
      canonicalTeamCultureValue(initial.workingTogether) ||
    canonicalTeamCultureValue(draft.transmissionAndIntegration) !==
      canonicalTeamCultureValue(initial.transmissionAndIntegration)
  );
}
