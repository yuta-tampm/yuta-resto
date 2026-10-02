export type CustomerExperienceDraft = {
  desiredExperience: string | null;
  welcomeAndService: string | null;
  customerAttention: string | null;
};

export function customerExperienceDraft(
  desiredExperience: string | null,
  welcomeAndService: string | null,
  customerAttention: string | null,
): CustomerExperienceDraft {
  return { desiredExperience, welcomeAndService, customerAttention };
}

export function updateDesiredExperience(
  draft: CustomerExperienceDraft,
  desiredExperience: string,
): CustomerExperienceDraft {
  return { ...draft, desiredExperience };
}

export function updateWelcomeAndService(
  draft: CustomerExperienceDraft,
  welcomeAndService: string,
): CustomerExperienceDraft {
  return { ...draft, welcomeAndService };
}

export function updateCustomerAttention(
  draft: CustomerExperienceDraft,
  customerAttention: string,
): CustomerExperienceDraft {
  return { ...draft, customerAttention };
}

export function isCustomerExperienceDirty(
  initial: CustomerExperienceDraft,
  draft: CustomerExperienceDraft,
): boolean {
  return (
    draft.desiredExperience !== initial.desiredExperience ||
    draft.welcomeAndService !== initial.welcomeAndService ||
    draft.customerAttention !== initial.customerAttention
  );
}
