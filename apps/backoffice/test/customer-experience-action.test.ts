import { randomUUID } from 'node:crypto';
import type { TenantContext, TenantRole } from '@yuta/tenant';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  tenant: null as TenantContext | null,
  saveCustomerExperience: vi.fn(),
  saveConceptHistory: vi.fn(),
  saveCuisineKnowHow: vi.fn(),
  updateProfile: vi.fn(),
  revalidatePath: vi.fn(),
}));

vi.mock('server-only', () => ({}));
vi.mock('@yuta/db-cloud', () => ({
  saveRestaurantKnowledgeCustomerExperience: mocks.saveCustomerExperience,
  saveRestaurantKnowledgeConceptHistory: mocks.saveConceptHistory,
  saveRestaurantKnowledgeCuisineKnowHow: mocks.saveCuisineKnowHow,
  updateEstablishmentProfile: mocks.updateProfile,
}));
vi.mock('next/cache', () => ({ revalidatePath: mocks.revalidatePath }));
vi.mock('../src/server/cloud-database', () => ({
  cloudDatabase: { kind: 'test-cloud-database' },
}));
vi.mock('../src/server/auth/session', () => ({
  requireAuthenticatedTenant: vi.fn(async () => ({ tenant: mocks.tenant })),
}));

import { saveCustomerExperienceAction } from '../src/app/(authenticated)/etablissement/informations-generales/actions';

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

describe('Customer Experience save action', () => {
  beforeEach(() => {
    mocks.saveCustomerExperience.mockReset();
    mocks.saveConceptHistory.mockReset();
    mocks.saveCuisineKnowHow.mockReset();
    mocks.updateProfile.mockReset();
    mocks.revalidatePath.mockReset();
  });

  it.each(['OWNER', 'MANAGER'] as const)(
    'saves the whole slice exactly once with MANAGE for %s',
    async (role) => {
      mocks.tenant = context(role);
      const formData = new FormData();
      formData.set('desiredExperience', 'Expérience souhaitée');
      formData.set('welcomeAndService', 'Accueil et service');
      formData.set('customerAttention', 'Attention particulière');

      await expect(
        saveCustomerExperienceAction(initialState, formData),
      ).resolves.toEqual({
        status: 'success',
        message: 'Expérience client enregistrée.',
      });
      expect(mocks.saveCustomerExperience).toHaveBeenCalledTimes(1);
      expect(mocks.saveCustomerExperience).toHaveBeenCalledWith(
        { kind: 'test-cloud-database' },
        mocks.tenant,
        {
          desiredExperience: 'Expérience souhaitée',
          welcomeAndService: 'Accueil et service',
          customerAttention: 'Attention particulière',
        },
      );
      expect(mocks.saveConceptHistory).not.toHaveBeenCalled();
      expect(mocks.saveCuisineKnowHow).not.toHaveBeenCalled();
      expect(mocks.updateProfile).not.toHaveBeenCalled();
      expect(mocks.revalidatePath).toHaveBeenCalledTimes(1);
    },
  );

  it('normalizes all empty form values to the valid empty state', async () => {
    mocks.tenant = context('OWNER');
    const formData = new FormData();
    formData.set('desiredExperience', '');
    formData.set('welcomeAndService', '');
    formData.set('customerAttention', '');

    await saveCustomerExperienceAction(initialState, formData);

    expect(mocks.saveCustomerExperience).toHaveBeenCalledWith(
      { kind: 'test-cloud-database' },
      mocks.tenant,
      {
        desiredExperience: null,
        welcomeAndService: null,
        customerAttention: null,
      },
    );
  });

  it('denies STAFF before persistence without Profile inheritance', async () => {
    mocks.tenant = context('STAFF');
    const formData = new FormData();

    await expect(
      saveCustomerExperienceAction(initialState, formData),
    ).rejects.toThrow('Permission denied.');
    expect(mocks.saveCustomerExperience).not.toHaveBeenCalled();
    expect(mocks.saveConceptHistory).not.toHaveBeenCalled();
    expect(mocks.saveCuisineKnowHow).not.toHaveBeenCalled();
    expect(mocks.updateProfile).not.toHaveBeenCalled();
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });

  it('keeps the form recoverable when persistence fails', async () => {
    mocks.tenant = context('MANAGER');
    mocks.saveCustomerExperience.mockRejectedValue(
      new Error('database unavailable'),
    );
    const formData = new FormData();
    formData.set('desiredExperience', 'Draft conservé par le navigateur');
    formData.set('welcomeAndService', 'Accueil');
    formData.set('customerAttention', 'Attention');

    await expect(
      saveCustomerExperienceAction(initialState, formData),
    ).resolves.toEqual({
      status: 'error',
      message: 'Une erreur est survenue. Réessayez.',
    });
    expect(mocks.saveCustomerExperience).toHaveBeenCalledTimes(1);
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });
});
