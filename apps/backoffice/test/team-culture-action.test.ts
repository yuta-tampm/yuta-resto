import { randomUUID } from 'node:crypto';
import { TenantError, type TenantContext, type TenantRole } from '@yuta/tenant';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  tenant: null as TenantContext | null,
  denyManage: false,
  requireRestaurantKnowledgePermission: vi.fn(),
  saveTeamCulture: vi.fn(),
  saveConceptHistory: vi.fn(),
  saveCuisineKnowHow: vi.fn(),
  saveCustomerExperience: vi.fn(),
  updateProfile: vi.fn(),
  revalidatePath: vi.fn(),
}));

vi.mock('server-only', () => ({}));
vi.mock('@yuta/db-cloud', () => ({
  saveRestaurantKnowledgeTeamCulture: mocks.saveTeamCulture,
  saveRestaurantKnowledgeConceptHistory: mocks.saveConceptHistory,
  saveRestaurantKnowledgeCuisineKnowHow: mocks.saveCuisineKnowHow,
  saveRestaurantKnowledgeCustomerExperience: mocks.saveCustomerExperience,
  updateEstablishmentProfile: mocks.updateProfile,
}));
vi.mock('next/cache', () => ({ revalidatePath: mocks.revalidatePath }));
vi.mock('../src/server/cloud-database', () => ({
  cloudDatabase: { kind: 'test-cloud-database' },
}));
vi.mock('../src/server/auth/session', () => ({
  requireAuthenticatedTenant: vi.fn(async () => ({ tenant: mocks.tenant })),
}));
vi.mock('../src/server/auth/permissions', async () => {
  const actual = await vi.importActual<
    typeof import('../src/server/auth/permissions')
  >('../src/server/auth/permissions');
  return {
    ...actual,
    requireRestaurantKnowledgePermission: (
      ...args: Parameters<typeof actual.requireRestaurantKnowledgePermission>
    ) => {
      mocks.requireRestaurantKnowledgePermission(...args);
      if (mocks.denyManage) {
        throw new TenantError(
          'Permission denied.',
          'CROSS_TENANT_ACCESS_DENIED',
          403,
        );
      }
      return actual.requireRestaurantKnowledgePermission(...args);
    },
  };
});

import { saveTeamCultureAction } from '../src/app/(authenticated)/etablissement/informations-generales/actions';
import { hasEstablishmentPermission } from '../src/server/auth/permissions';

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
    entitlements: new Set(),
  };
}

const initialState = { status: 'idle' as const, message: null };

function populatedFormData() {
  const formData = new FormData();
  formData.set('valuesAndMindset', 'Bienveillance et exigence');
  formData.set('workingTogether', 'Décider ensemble au briefing');
  formData.set(
    'transmissionAndIntegration',
    'Accompagner chaque nouvelle arrivée',
  );
  return formData;
}

describe('Team Culture save action', () => {
  beforeEach(() => {
    mocks.denyManage = false;
    mocks.requireRestaurantKnowledgePermission.mockReset();
    mocks.saveTeamCulture.mockReset();
    mocks.saveConceptHistory.mockReset();
    mocks.saveCuisineKnowHow.mockReset();
    mocks.saveCustomerExperience.mockReset();
    mocks.updateProfile.mockReset();
    mocks.revalidatePath.mockReset();
  });

  it.each(['OWNER', 'MANAGER'] as const)(
    'saves the whole slice exactly once with MANAGE for %s',
    async (role) => {
      mocks.tenant = context(role);
      const formData = populatedFormData();
      formData.set('organizationId', randomUUID());
      formData.set('establishmentId', randomUUID());
      formData.set('role', 'STAFF');
      formData.set('permission', 'establishment.profile.manage');
      formData.set('unrelated', 'not forwarded');

      await expect(
        saveTeamCultureAction(initialState, formData),
      ).resolves.toEqual({
        status: 'success',
        message: 'Équipe et culture enregistrées.',
      });
      expect(mocks.requireRestaurantKnowledgePermission).toHaveBeenCalledWith(
        mocks.tenant,
        'restaurant-knowledge.manage',
      );
      expect(mocks.saveTeamCulture).toHaveBeenCalledTimes(1);
      expect(mocks.saveTeamCulture).toHaveBeenCalledWith(
        { kind: 'test-cloud-database' },
        mocks.tenant,
        {
          valuesAndMindset: 'Bienveillance et exigence',
          workingTogether: 'Décider ensemble au briefing',
          transmissionAndIntegration: 'Accompagner chaque nouvelle arrivée',
        },
      );
      expect(mocks.saveConceptHistory).not.toHaveBeenCalled();
      expect(mocks.saveCuisineKnowHow).not.toHaveBeenCalled();
      expect(mocks.saveCustomerExperience).not.toHaveBeenCalled();
      expect(mocks.updateProfile).not.toHaveBeenCalled();
      expect(mocks.revalidatePath).toHaveBeenCalledWith(
        '/etablissement/informations-generales',
      );
      expect(mocks.revalidatePath).toHaveBeenCalledTimes(1);
    },
  );

  it('normalizes only exact empty strings and preserves whitespace', async () => {
    mocks.tenant = context('OWNER');
    const formData = new FormData();
    formData.set('valuesAndMindset', '');
    formData.set('workingTogether', '   ');
    formData.set('transmissionAndIntegration', '');

    await saveTeamCultureAction(initialState, formData);

    expect(mocks.saveTeamCulture).toHaveBeenCalledWith(
      { kind: 'test-cloud-database' },
      mocks.tenant,
      {
        valuesAndMindset: null,
        workingTogether: '   ',
        transmissionAndIntegration: null,
      },
    );
  });

  it('denies STAFF before parsing or persistence without Profile substitution', async () => {
    mocks.tenant = context('STAFF');
    expect(
      hasEstablishmentPermission(mocks.tenant, 'establishment.profile.manage'),
    ).toBe(false);
    expect(
      hasEstablishmentPermission(mocks.tenant, 'establishment.profile.read'),
    ).toBe(true);

    await expect(
      saveTeamCultureAction(initialState, new FormData()),
    ).rejects.toThrow('Permission denied.');
    expect(mocks.saveTeamCulture).not.toHaveBeenCalled();
    expect(mocks.updateProfile).not.toHaveBeenCalled();
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });

  it('enforces MANAGE independently when the test boundary models READ without MANAGE', async () => {
    mocks.tenant = context('OWNER');
    mocks.denyManage = true;

    await expect(
      saveTeamCultureAction(initialState, populatedFormData()),
    ).rejects.toThrow('Permission denied.');
    expect(mocks.requireRestaurantKnowledgePermission).toHaveBeenCalledWith(
      mocks.tenant,
      'restaurant-knowledge.manage',
    );
    expect(mocks.saveTeamCulture).not.toHaveBeenCalled();
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });

  it('returns a content-safe recoverable error and does not revalidate on persistence failure', async () => {
    mocks.tenant = context('MANAGER');
    mocks.saveTeamCulture.mockRejectedValue(new Error('database unavailable'));
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);

    await expect(
      saveTeamCultureAction(initialState, populatedFormData()),
    ).resolves.toEqual({
      status: 'error',
      message: 'Une erreur est survenue. Réessayez.',
    });
    expect(mocks.saveTeamCulture).toHaveBeenCalledTimes(1);
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
    expect(consoleError).toHaveBeenCalledWith(
      'Failed to save Restaurant Knowledge Team Culture.',
      { errorName: 'Error' },
    );
    expect(JSON.stringify(consoleError.mock.calls)).not.toContain(
      'Bienveillance et exigence',
    );
    consoleError.mockRestore();
  });
});
