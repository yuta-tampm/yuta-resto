type SuggestionGroup = {
  dismissalKey: string;
};

export function hiddenComboSuggestionKeys(token?: string): Set<string> {
  return new Set(
    token
      ?.split(',')
      .map((value) => value.trim())
      .filter(Boolean) ?? [],
  );
}

export function comboSuggestionDismissalToken(
  groups: SuggestionGroup[],
  existingToken?: string,
): string {
  const keys = hiddenComboSuggestionKeys(existingToken);
  for (const group of groups) {
    keys.add(group.dismissalKey);
  }
  return [...keys].toSorted().join(',');
}
