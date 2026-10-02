import { describe, expect, it, vi } from 'vitest';
import { submitTenantSwitch } from '../src/components/backoffice/tenant-switcher-submission';

const membershipA = '00000000-0000-4000-8000-000000000001';
const membershipB = '00000000-0000-4000-8000-000000000002';

describe('authenticated tenant switch submission', () => {
  it('submits the target membership immediately when another tenant is selected', () => {
    const membershipField = { value: membershipA };
    const requestSubmit = vi.fn();

    const submitted = submitTenantSwitch({
      currentMembershipId: membershipA,
      targetMembershipId: membershipB,
      pending: false,
      membershipField,
      form: { requestSubmit },
    });

    expect(submitted).toBe(true);
    expect(membershipField.value).toBe(membershipB);
    expect(requestSubmit).toHaveBeenCalledOnce();
  });

  it('does not submit when the authoritative membership is selected again', () => {
    const requestSubmit = vi.fn();

    const submitted = submitTenantSwitch({
      currentMembershipId: membershipA,
      targetMembershipId: membershipA,
      pending: false,
      membershipField: { value: membershipA },
      form: { requestSubmit },
    });

    expect(submitted).toBe(false);
    expect(requestSubmit).not.toHaveBeenCalled();
  });

  it('prevents a duplicate submission while switching is pending', () => {
    const requestSubmit = vi.fn();

    const submitted = submitTenantSwitch({
      currentMembershipId: membershipA,
      targetMembershipId: membershipB,
      pending: true,
      membershipField: { value: membershipA },
      form: { requestSubmit },
    });

    expect(submitted).toBe(false);
    expect(requestSubmit).not.toHaveBeenCalled();
  });
});
