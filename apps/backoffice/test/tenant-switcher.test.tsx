import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const membershipA = '00000000-0000-4000-8000-000000000001';
const membershipB = '00000000-0000-4000-8000-000000000002';

const mocks = vi.hoisted(() => ({
  error: null as string | null,
  pending: false,
  selectValue: null as string | null,
  selectDisabled: false,
  onValueChange: null as ((value: string) => void) | null,
  submitTenantSwitch: vi.fn(() => true),
  switchTenantAction: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  usePathname: () => '/aujourdhui',
}));
vi.mock('../src/app/(authenticated)/actions', () => ({
  switchTenantAction: mocks.switchTenantAction,
}));
vi.mock('../src/components/backoffice/tenant-switcher-submission', () => ({
  submitTenantSwitch: mocks.submitTenantSwitch,
}));
vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react')>();
  return {
    ...actual,
    useActionState: () => [
      { error: mocks.error },
      mocks.switchTenantAction,
      mocks.pending,
    ],
  };
});
vi.mock('@yuta/ui', () => ({
  cn: (...values: Array<string | undefined>) =>
    values.filter(Boolean).join(' '),
  Select: ({
    children,
    value,
    disabled,
    onValueChange,
  }: {
    children: ReactNode;
    value: string;
    disabled: boolean;
    onValueChange(value: string): void;
  }) => {
    mocks.selectValue = value;
    mocks.selectDisabled = disabled;
    mocks.onValueChange = onValueChange;
    return <div>{children}</div>;
  },
  SelectContent: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  SelectGroup: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  SelectItem: ({ children }: { children: ReactNode }) => (
    <span>{children}</span>
  ),
  SelectLabel: ({ children }: { children: ReactNode }) => (
    <span>{children}</span>
  ),
  SelectTrigger: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  SelectValue: () => null,
}));

import { TenantSwitcher } from '../src/components/backoffice/tenant-switcher';

const tenants = [
  {
    membershipId: membershipA,
    organizationId: '00000000-0000-4000-8000-000000000010',
    organizationName: 'LUNA',
    organizationSlug: 'luna',
    establishmentId: '00000000-0000-4000-8000-000000000011',
    establishmentName: 'LUNA',
    establishmentSlug: 'luna',
    role: 'OWNER' as const,
    locale: 'fr-FR',
    timezone: 'Europe/Paris',
  },
  {
    membershipId: membershipB,
    organizationId: '00000000-0000-4000-8000-000000000010',
    organizationName: 'LUNA',
    organizationSlug: 'luna',
    establishmentId: '00000000-0000-4000-8000-000000000012',
    establishmentName: 'LuNa Poitiers',
    establishmentSlug: 'luna-poitiers',
    role: 'OWNER' as const,
    locale: 'fr-FR',
    timezone: 'Europe/Paris',
  },
];

describe('TenantSwitcher', () => {
  beforeEach(() => {
    mocks.error = null;
    mocks.pending = false;
    mocks.selectValue = null;
    mocks.selectDisabled = false;
    mocks.onValueChange = null;
    mocks.submitTenantSwitch.mockClear();
  });

  it('keeps the authoritative membership displayed and initiates switching on selection', () => {
    const markup = renderToStaticMarkup(
      <TenantSwitcher tenants={tenants} currentMembershipId={membershipA} />,
    );

    expect(mocks.selectValue).toBe(membershipA);
    expect(markup).toContain(`name="membershipId" value="${membershipA}"`);
    expect(markup).not.toContain('type="submit"');

    expect(mocks.onValueChange).not.toBeNull();
    mocks.onValueChange?.(membershipB);

    expect(mocks.submitTenantSwitch).toHaveBeenCalledWith(
      expect.objectContaining({
        currentMembershipId: membershipA,
        targetMembershipId: membershipB,
        pending: false,
      }),
    );
  });

  it('disables selection and exposes a textual pending state while switching', () => {
    mocks.pending = true;

    const markup = renderToStaticMarkup(
      <TenantSwitcher tenants={tenants} currentMembershipId={membershipA} />,
    );

    expect(mocks.selectValue).toBe(membershipA);
    expect(mocks.selectDisabled).toBe(true);
    expect(markup).toContain('aria-busy="true"');
    expect(markup).toContain('role="status"');
    expect(markup).toContain('Changement d’établissement…');
  });

  it('returns to the authoritative membership and exposes a failed switch', () => {
    mocks.error = "Vous n'avez plus accès à cet établissement.";

    const markup = renderToStaticMarkup(
      <TenantSwitcher tenants={tenants} currentMembershipId={membershipA} />,
    );

    expect(mocks.selectValue).toBe(membershipA);
    expect(markup).toContain('role="alert"');
    expect(markup).toContain(
      'Vous n&#x27;avez plus accès à cet établissement.',
    );
  });
});
