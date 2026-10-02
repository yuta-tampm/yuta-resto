import { randomUUID } from 'node:crypto';
import { TenantError, type TenantContext, type TenantRole } from '@yuta/tenant';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  tenant: null as TenantContext | null,
  denyManage: false,
  requireRestaurantKnowledgePermission: vi.fn(),
  saveCommunicationIdentity: vi.fn(),
  saveTeamCulture: vi.fn(),
  saveConceptHistory: vi.fn(),
  saveCuisineKnowHow: vi.fn(),
  saveCustomerExperience: vi.fn(),
  updateProfile: vi.fn(),
  revalidatePath: vi.fn(),
}));

vi.mock('server-only', () => ({}));
vi.mock('@yuta/db-cloud', () => ({
  saveRestaurantKnowledgeCommunicationIdentity: mocks.saveCommunicationIdentity,
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

import { saveCommunicationIdentityAction } from '../src/app/(authenticated)/etablissement/informations-generales/actions';
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

const initialState = {
  status: 'idle' as const,
  message: null,
  savedCommunicationIdentity: null,
};

function populatedFormData() {
  const formData = new FormData();
  formData.set('toneAndCommunicationStyle', 'Chaleureux et direct');
  formData.set('customerAddressing', 'Avec naturel et attention');
  formData.set(
    'languageElementsAndThingsToAvoid',
    'Privilégier les mots simples',
  );
  return formData;
}

describe('Communication Identity save action', () => {
  beforeEach(() => {
    mocks.denyManage = false;
    mocks.requireRestaurantKnowledgePermission.mockReset();
    mocks.saveCommunicationIdentity.mockReset();
    mocks.saveCommunicationIdentity.mockImplementation(
      async (_db, _tenant, input) => input,
    );
    mocks.saveTeamCulture.mockReset();
    mocks.saveConceptHistory.mockReset();
    mocks.saveCuisineKnowHow.mockReset();
    mocks.saveCustomerExperience.mockReset();
    mocks.updateProfile.mockReset();
    mocks.revalidatePath.mockReset();
  });

  it.each(['OWNER', 'MANAGER'] as const)(
    'saves the exact whole slice once with MANAGE for %s',
    async (role) => {
      mocks.tenant = context(role);
      const formData = populatedFormData();
      formData.set('organizationId', randomUUID());
      formData.set('establishmentId', randomUUID());
      formData.set('role', 'STAFF');
      formData.set('permission', 'establishment.profile.manage');
      formData.set('marketingPermission', 'marketing.manage');
      formData.set('unrelated', 'not forwarded');

      await expect(
        saveCommunicationIdentityAction(initialState, formData),
      ).resolves.toEqual({
        status: 'success',
        message: 'Identité de communication enregistrée.',
        savedCommunicationIdentity: {
          toneAndCommunicationStyle: 'Chaleureux et direct',
          customerAddressing: 'Avec naturel et attention',
          languageElementsAndThingsToAvoid: 'Privilégier les mots simples',
        },
      });
      expect(mocks.requireRestaurantKnowledgePermission).toHaveBeenCalledWith(
        mocks.tenant,
        'restaurant-knowledge.manage',
      );
      expect(mocks.saveCommunicationIdentity).toHaveBeenCalledTimes(1);
      expect(mocks.saveCommunicationIdentity).toHaveBeenCalledWith(
        { kind: 'test-cloud-database' },
        mocks.tenant,
        {
          toneAndCommunicationStyle: 'Chaleureux et direct',
          customerAddressing: 'Avec naturel et attention',
          languageElementsAndThingsToAvoid: 'Privilégier les mots simples',
        },
      );
      expect(mocks.saveTeamCulture).not.toHaveBeenCalled();
      expect(mocks.saveConceptHistory).not.toHaveBeenCalled();
      expect(mocks.saveCuisineKnowHow).not.toHaveBeenCalled();
      expect(mocks.saveCustomerExperience).not.toHaveBeenCalled();
      expect(mocks.updateProfile).not.toHaveBeenCalled();
      expect(mocks.revalidatePath).toHaveBeenCalledTimes(1);
      expect(mocks.revalidatePath).toHaveBeenCalledWith(
        '/etablissement/informations-generales',
      );
    },
  );

  it('normalizes only exact empty strings and preserves whitespace', async () => {
    mocks.tenant = context('OWNER');
    const formData = new FormData();
    formData.set('toneAndCommunicationStyle', '');
    formData.set('customerAddressing', '   ');
    formData.set('languageElementsAndThingsToAvoid', '');

    await expect(
      saveCommunicationIdentityAction(initialState, formData),
    ).resolves.toMatchObject({
      savedCommunicationIdentity: {
        toneAndCommunicationStyle: null,
        customerAddressing: '   ',
        languageElementsAndThingsToAvoid: null,
      },
    });
    expect(mocks.saveCommunicationIdentity).toHaveBeenCalledWith(
      { kind: 'test-cloud-database' },
      mocks.tenant,
      {
        toneAndCommunicationStyle: null,
        customerAddressing: '   ',
        languageElementsAndThingsToAvoid: null,
      },
    );
  });

  it('denies STAFF before parsing or persistence without Profile substitution', async () => {
    mocks.tenant = context('STAFF');
    expect(
      hasEstablishmentPermission(mocks.tenant, 'establishment.profile.read'),
    ).toBe(true);

    await expect(
      saveCommunicationIdentityAction(initialState, new FormData()),
    ).rejects.toThrow('Permission denied.');
    expect(mocks.saveCommunicationIdentity).not.toHaveBeenCalled();
    expect(mocks.updateProfile).not.toHaveBeenCalled();
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });

  it('enforces MANAGE independently at the server authorization boundary', async () => {
    mocks.tenant = context('OWNER');
    mocks.denyManage = true;

    await expect(
      saveCommunicationIdentityAction(initialState, populatedFormData()),
    ).rejects.toThrow('Permission denied.');
    expect(mocks.requireRestaurantKnowledgePermission).toHaveBeenCalledWith(
      mocks.tenant,
      'restaurant-knowledge.manage',
    );
    expect(mocks.saveCommunicationIdentity).not.toHaveBeenCalled();
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });

  it('retains the prior accepted baseline on a content-safe recoverable error', async () => {
    mocks.tenant = context('MANAGER');
    mocks.saveCommunicationIdentity.mockRejectedValue(
      new Error('database unavailable'),
    );
    const previousState = {
      status: 'success' as const,
      message: 'Identité de communication enregistrée.',
      savedCommunicationIdentity: {
        toneAndCommunicationStyle: 'Baseline',
        customerAddressing: null,
        languageElementsAndThingsToAvoid: null,
      },
    };
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);

    await expect(
      saveCommunicationIdentityAction(previousState, populatedFormData()),
    ).resolves.toEqual({
      status: 'error',
      message: 'Une erreur est survenue. Réessayez.',
      savedCommunicationIdentity: previousState.savedCommunicationIdentity,
    });
    expect(mocks.saveCommunicationIdentity).toHaveBeenCalledTimes(1);
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
    expect(consoleError).toHaveBeenCalledWith(
      'Failed to save Restaurant Knowledge Communication Identity.',
      { errorName: 'Error' },
    );
    expect(JSON.stringify(consoleError.mock.calls)).not.toContain(
      'Chaleureux et direct',
    );
    consoleError.mockRestore();
  });
});
