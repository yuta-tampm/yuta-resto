import { randomUUID } from 'node:crypto';
import type { TenantContext, TenantRole } from '@yuta/tenant';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  tenant: null as TenantContext | null,
  saveConceptHistory: vi.fn(),
  saveCuisineKnowHow: vi.fn(),
  saveCustomerExperience: vi.fn(),
  updateProfile: vi.fn(),
  revalidatePath: vi.fn(),
}));

vi.mock('server-only', () => ({}));
vi.mock('@yuta/db-cloud', () => ({
  saveRestaurantKnowledgeConceptHistory: mocks.saveConceptHistory,
  saveRestaurantKnowledgeCuisineKnowHow: mocks.saveCuisineKnowHow,
  saveRestaurantKnowledgeCustomerExperience: mocks.saveCustomerExperience,
  updateEstablishmentProfile: mocks.updateProfile,
}));
vi.mock('next/cache', () => ({
  revalidatePath: mocks.revalidatePath,
}));
vi.mock('../src/server/cloud-database', () => ({
  cloudDatabase: { kind: 'test-cloud-database' },
}));
vi.mock('../src/server/auth/session', () => ({
  requireAuthenticatedTenant: vi.fn(async () => ({ tenant: mocks.tenant })),
}));

import { saveConceptHistoryAction } from '../src/app/(authenticated)/etablissement/informations-generales/actions';

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

describe('Concept and Histoire save action', () => {
  beforeEach(() => {
    mocks.saveConceptHistory.mockReset();
    mocks.saveCustomerExperience.mockReset();
    mocks.updateProfile.mockReset();
    mocks.revalidatePath.mockReset();
    mocks.saveConceptHistory.mockResolvedValue({
      concept: 'Concept',
      history: 'Histoire',
    });
  });

  it.each(['OWNER', 'MANAGER'] as const)(
    'saves the whole slice once with MANAGE for %s',
    async (role) => {
      mocks.tenant = context(role);
      const formData = new FormData();
      formData.set('concept', 'Concept');
      formData.set('history', 'Histoire');

      await expect(
        saveConceptHistoryAction(initialState, formData),
      ).resolves.toEqual({
        status: 'success',
        message: 'Concept et histoire enregistrés.',
      });
      expect(mocks.saveConceptHistory).toHaveBeenCalledTimes(1);
      expect(mocks.saveConceptHistory).toHaveBeenCalledWith(
        { kind: 'test-cloud-database' },
        mocks.tenant,
        { concept: 'Concept', history: 'Histoire' },
      );
      expect(mocks.updateProfile).not.toHaveBeenCalled();
      expect(mocks.revalidatePath).toHaveBeenCalledWith(
        '/etablissement/informations-generales',
      );
    },
  );

  it('normalizes both empty form values to the valid empty state', async () => {
    mocks.tenant = context('OWNER');
    const formData = new FormData();
    formData.set('concept', '');
    formData.set('history', '');

    await saveConceptHistoryAction(initialState, formData);

    expect(mocks.saveConceptHistory).toHaveBeenCalledWith(
      { kind: 'test-cloud-database' },
      mocks.tenant,
      { concept: null, history: null },
    );
  });

  it('denies STAFF before persistence and does not inherit profile access', async () => {
    mocks.tenant = context('STAFF');
    const formData = new FormData();
    formData.set('concept', 'Forbidden concept');
    formData.set('history', 'Forbidden history');

    await expect(
      saveConceptHistoryAction(initialState, formData),
    ).rejects.toThrow('Permission denied.');
    expect(mocks.saveConceptHistory).not.toHaveBeenCalled();
    expect(mocks.updateProfile).not.toHaveBeenCalled();
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });
});
