import { randomUUID } from 'node:crypto';
import type { TenantContext, TenantRole } from '@yuta/tenant';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  tenant: null as TenantContext | null,
  saveCuisineKnowHow: vi.fn(),
  saveConceptHistory: vi.fn(),
  updateProfile: vi.fn(),
  revalidatePath: vi.fn(),
}));

vi.mock('server-only', () => ({}));
vi.mock('@yuta/db-cloud', () => ({
  saveRestaurantKnowledgeCuisineKnowHow: mocks.saveCuisineKnowHow,
  saveRestaurantKnowledgeConceptHistory: mocks.saveConceptHistory,
  updateEstablishmentProfile: mocks.updateProfile,
}));
vi.mock('next/cache', () => ({ revalidatePath: mocks.revalidatePath }));
vi.mock('../src/server/cloud-database', () => ({
  cloudDatabase: { kind: 'test-cloud-database' },
}));
vi.mock('../src/server/auth/session', () => ({
  requireAuthenticatedTenant: vi.fn(async () => ({ tenant: mocks.tenant })),
}));

import { saveCuisineKnowHowAction } from '../src/app/(authenticated)/etablissement/informations-generales/actions';

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

describe('Cuisine and savoir-faire save action', () => {
  beforeEach(() => {
    mocks.saveCuisineKnowHow.mockReset();
    mocks.saveConceptHistory.mockReset();
    mocks.updateProfile.mockReset();
    mocks.revalidatePath.mockReset();
  });

  it.each(['OWNER', 'MANAGER'] as const)(
    'saves the whole slice exactly once with MANAGE for %s',
    async (role) => {
      mocks.tenant = context(role);
      const formData = new FormData();
      formData.set('cuisineDescription', 'Cuisine');
      formData.set('knowHowParticularities', 'Savoir-faire');
      formData.set('homemade', 'Fait maison');

      await expect(
        saveCuisineKnowHowAction(initialState, formData),
      ).resolves.toEqual({
        status: 'success',
        message: 'Cuisine et savoir-faire enregistrés.',
      });
      expect(mocks.saveCuisineKnowHow).toHaveBeenCalledTimes(1);
      expect(mocks.saveCuisineKnowHow).toHaveBeenCalledWith(
        { kind: 'test-cloud-database' },
        mocks.tenant,
        {
          cuisineDescription: 'Cuisine',
          knowHowParticularities: 'Savoir-faire',
          homemade: 'Fait maison',
        },
      );
      expect(mocks.saveConceptHistory).not.toHaveBeenCalled();
      expect(mocks.updateProfile).not.toHaveBeenCalled();
      expect(mocks.revalidatePath).toHaveBeenCalledTimes(1);
    },
  );

  it('normalizes all empty form values to the valid empty state', async () => {
    mocks.tenant = context('OWNER');
    const formData = new FormData();
    formData.set('cuisineDescription', '');
    formData.set('knowHowParticularities', '');
    formData.set('homemade', '');

    await saveCuisineKnowHowAction(initialState, formData);

    expect(mocks.saveCuisineKnowHow).toHaveBeenCalledWith(
      { kind: 'test-cloud-database' },
      mocks.tenant,
      {
        cuisineDescription: null,
        knowHowParticularities: null,
        homemade: null,
      },
    );
  });

  it('denies STAFF before persistence without Profile inheritance', async () => {
    mocks.tenant = context('STAFF');
    const formData = new FormData();

    await expect(
      saveCuisineKnowHowAction(initialState, formData),
    ).rejects.toThrow('Permission denied.');
    expect(mocks.saveCuisineKnowHow).not.toHaveBeenCalled();
    expect(mocks.saveConceptHistory).not.toHaveBeenCalled();
    expect(mocks.updateProfile).not.toHaveBeenCalled();
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });

  it('keeps the form recoverable when persistence fails', async () => {
    mocks.tenant = context('MANAGER');
    mocks.saveCuisineKnowHow.mockRejectedValue(
      new Error('database unavailable'),
    );
    const formData = new FormData();
    formData.set('cuisineDescription', 'Draft conservé par le navigateur');
    formData.set('knowHowParticularities', 'Savoir-faire');
    formData.set('homemade', 'Fait maison');

    await expect(
      saveCuisineKnowHowAction(initialState, formData),
    ).resolves.toEqual({
      status: 'error',
      message: 'Une erreur est survenue. Réessayez.',
    });
    expect(mocks.saveCuisineKnowHow).toHaveBeenCalledTimes(1);
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });
});
