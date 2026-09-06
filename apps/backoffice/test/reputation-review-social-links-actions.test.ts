import type { TenantContext, TenantRole } from '@yuta/tenant';
import { randomUUID } from 'node:crypto';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  tenant: null as TenantContext | null,
  session: { userId: '00000000-0000-4000-8000-000000000001' },
  requireReputationTenant: vi.fn(),
  requireReputationPermission: vi.fn(),
  saveReputationReviewSocialLinks: vi.fn(),
  revalidatePath: vi.fn(),
}));

vi.mock('server-only', () => ({}));
vi.mock('@yuta/db-cloud', () => ({
  saveReputationReviewSocialLinks: mocks.saveReputationReviewSocialLinks,
}));
vi.mock('next/cache', () => ({ revalidatePath: mocks.revalidatePath }));
vi.mock('../src/server/cloud-database', () => ({
  cloudDatabase: { kind: 'test-cloud-database' },
}));
vi.mock('../src/server/auth/session', () => ({
  requireReputationTenant: mocks.requireReputationTenant,
}));
vi.mock('../src/server/auth/permissions', () => ({
  requireReputationPermission: mocks.requireReputationPermission,
}));

import { saveReviewSocialLinksAction } from '../src/app/(authenticated)/visibilite-reputation/satisfaction/actions';

const values = {
  googleReviewUrl: 'https://g.page/yuta/review',
  facebookReviewUrl: 'https://www.facebook.com/yuta',
  instagramUrl: 'https://www.instagram.com/yuta',
};
const input = {
  expectedValues: { ...values },
  proposedValues: { ...values, instagramUrl: null },
  expectedStateToken: 'a'.repeat(64),
};

describe('Reputation review social links server action', () => {
  beforeEach(() => {
    mocks.tenant = context('OWNER');
    mocks.requireReputationTenant.mockReset();
    mocks.requireReputationTenant.mockImplementation(async () => ({
      session: mocks.session,
      tenant: mocks.tenant,
    }));
    mocks.requireReputationPermission.mockReset();
    mocks.requireReputationPermission.mockImplementation(
      (tenant: TenantContext) => {
        if (tenant.actor.type !== 'user' || tenant.actor.role !== 'OWNER') {
          throw new Error('Permission denied.');
        }
      },
    );
    mocks.saveReputationReviewSocialLinks.mockReset();
    mocks.saveReputationReviewSocialLinks.mockResolvedValue({
      kind: 'success',
      model: { values: input.proposedValues, stateToken: 'b'.repeat(64) },
    });
    mocks.revalidatePath.mockReset();
  });

  it('authorizes trusted OWNER before passing the whole mutation to the repository', async () => {
    await expect(saveReviewSocialLinksAction(input)).resolves.toEqual({
      kind: 'success',
      model: { values: input.proposedValues, stateToken: 'b'.repeat(64) },
    });

    expect(mocks.requireReputationTenant).toHaveBeenCalledWith(
      '/visibilite-reputation/satisfaction',
    );
    expect(mocks.requireReputationPermission).toHaveBeenCalledWith(
      mocks.tenant,
      'reputation.settings.manage',
    );
    expect(
      mocks.requireReputationPermission.mock.invocationCallOrder[0],
    ).toBeLessThan(
      mocks.saveReputationReviewSocialLinks.mock.invocationCallOrder[0] ?? 0,
    );
    expect(mocks.saveReputationReviewSocialLinks).toHaveBeenCalledWith(
      { kind: 'test-cloud-database' },
      mocks.tenant,
      input,
    );
    expect(mocks.revalidatePath).toHaveBeenCalledWith(
      '/visibilite-reputation/satisfaction',
    );
  });

  it.each(['MANAGER', 'STAFF'] as const)(
    'denies %s before repository parsing or persistence',
    async (role) => {
      mocks.tenant = context(role);
      await expect(saveReviewSocialLinksAction(input)).rejects.toThrow(
        'Permission denied.',
      );
      expect(mocks.saveReputationReviewSocialLinks).not.toHaveBeenCalled();
      expect(mocks.revalidatePath).not.toHaveBeenCalled();
    },
  );

  it('does not inspect browser authority claims before trusted authorization', async () => {
    mocks.tenant = context('STAFF');
    const rawInput = {
      ...input,
      organization: randomUUID(),
      establishment: randomUUID(),
      role: 'OWNER',
      permission: 'reputation.settings.manage',
    };

    await expect(saveReviewSocialLinksAction(rawInput)).rejects.toThrow(
      'Permission denied.',
    );
    expect(mocks.saveReputationReviewSocialLinks).not.toHaveBeenCalled();
  });

  it.each([
    [
      'no_change',
      { kind: 'no_change', model: { values, stateToken: 'c'.repeat(64) } },
    ],
    [
      'validation_error',
      {
        kind: 'validation_error',
        issues: [{ field: 'googleReviewUrl', code: 'HOST_NOT_ALLOWED' }],
      },
    ],
    [
      'conflict',
      { kind: 'conflict', model: { values, stateToken: 'd'.repeat(64) } },
    ],
    ['configuration_unavailable', { kind: 'configuration_unavailable' }],
    ['server_error', { kind: 'server_error' }],
  ] as const)(
    'returns safe %s without route revalidation',
    async (_kind, outcome) => {
      mocks.saveReputationReviewSocialLinks.mockResolvedValue(outcome);
      await expect(saveReviewSocialLinksAction(input)).resolves.toEqual(
        outcome,
      );
      expect(mocks.revalidatePath).not.toHaveBeenCalled();
    },
  );
});

function context(role: TenantRole): TenantContext {
  return {
    organizationId: randomUUID(),
    establishmentId: randomUUID(),
    actor: {
      type: 'user',
      userId: randomUUID(),
      membershipId: randomUUID(),
      role,
    },
    locale: 'fr-FR',
    timezone: 'Europe/Paris',
    entitlements: new Set(['reputation.enabled']),
  };
}
