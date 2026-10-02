export type CommunicationIdentityDraft = {
  toneAndCommunicationStyle: string | null;
  customerAddressing: string | null;
  languageElementsAndThingsToAvoid: string | null;
};

export function communicationIdentityDraft(
  toneAndCommunicationStyle: string | null,
  customerAddressing: string | null,
  languageElementsAndThingsToAvoid: string | null,
): CommunicationIdentityDraft {
  return {
    toneAndCommunicationStyle,
    customerAddressing,
    languageElementsAndThingsToAvoid,
  };
}

export function updateToneAndCommunicationStyle(
  draft: CommunicationIdentityDraft,
  toneAndCommunicationStyle: string,
): CommunicationIdentityDraft {
  return { ...draft, toneAndCommunicationStyle };
}

export function updateCustomerAddressing(
  draft: CommunicationIdentityDraft,
  customerAddressing: string,
): CommunicationIdentityDraft {
  return { ...draft, customerAddressing };
}

export function updateLanguageElementsAndThingsToAvoid(
  draft: CommunicationIdentityDraft,
  languageElementsAndThingsToAvoid: string,
): CommunicationIdentityDraft {
  return { ...draft, languageElementsAndThingsToAvoid };
}

export function canonicalCommunicationIdentityValue(
  value: string | null,
): string | null {
  return value === '' ? null : value;
}

export function isCommunicationIdentityDirty(
  acceptedBaseline: CommunicationIdentityDraft,
  draft: CommunicationIdentityDraft,
): boolean {
  return (
    canonicalCommunicationIdentityValue(draft.toneAndCommunicationStyle) !==
      canonicalCommunicationIdentityValue(
        acceptedBaseline.toneAndCommunicationStyle,
      ) ||
    canonicalCommunicationIdentityValue(draft.customerAddressing) !==
      canonicalCommunicationIdentityValue(
        acceptedBaseline.customerAddressing,
      ) ||
    canonicalCommunicationIdentityValue(
      draft.languageElementsAndThingsToAvoid,
    ) !==
      canonicalCommunicationIdentityValue(
        acceptedBaseline.languageElementsAndThingsToAvoid,
      )
  );
}
