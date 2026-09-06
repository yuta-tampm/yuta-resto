type MembershipField = {
  value: string;
};

type TenantSwitchForm = {
  requestSubmit(): void;
};

export function submitTenantSwitch({
  currentMembershipId,
  targetMembershipId,
  pending,
  membershipField,
  form,
}: Readonly<{
  currentMembershipId: string;
  targetMembershipId: string;
  pending: boolean;
  membershipField: MembershipField | null;
  form: TenantSwitchForm | null;
}>): boolean {
  if (
    pending ||
    targetMembershipId === currentMembershipId ||
    !membershipField ||
    !form
  ) {
    return false;
  }

  membershipField.value = targetMembershipId;
  form.requestSubmit();
  return true;
}
