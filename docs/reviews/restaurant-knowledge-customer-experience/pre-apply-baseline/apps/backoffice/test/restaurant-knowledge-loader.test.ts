import { randomUUID } from 'node:crypto';
import type { TenantContext, TenantRole } from '@yuta/tenant';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  getConceptHistory: vi.fn(),
  getCuisineKnowHow: vi.fn(),
}));

vi.mock('server-only', () => ({}));
vi.mock('@yuta/db-cloud', () => ({
  getRestaurantKnowledgeConceptHistory: mocks.getConceptHistory,
  getRestaurantKnowledgeCuisineKnowHow: mocks.getCuisineKnowHow,
}));

import {
  loadConceptHistorySection,
  loadCuisineKnowHowSection,
} from '../src/app/(authenticated)/etablissement/informations-generales/restaurant-knowledge-loader';

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

describe('Restaurant Knowledge Concept and Histoire loader', () => {
  beforeEach(() => {
    mocks.getConceptHistory.mockReset();
    mocks.getCuisineKnowHow.mockReset();
    mocks.getConceptHistory.mockResolvedValue({
      concept: 'Cuisine ouverte.',
      history: null,
    });
  });

  it.each(['OWNER', 'MANAGER'] as const)(
    'loads the slice with READ and exposes MANAGE for %s',
    async (role) => {
      const tenant = context(role);

      await expect(
        loadConceptHistorySection({} as never, tenant),
      ).resolves.toEqual({
        conceptHistory: { concept: 'Cuisine ouverte.', history: null },
        canManage: true,
      });
      expect(mocks.getConceptHistory).toHaveBeenCalledWith({}, tenant);
      expect(mocks.getCuisineKnowHow).not.toHaveBeenCalled();
    },
  );

  it('does not load or expose the slice to STAFF despite profile read access', async () => {
    await expect(
      loadConceptHistorySection({} as never, context('STAFF')),
    ).resolves.toBeNull();
    expect(mocks.getConceptHistory).not.toHaveBeenCalled();
    expect(mocks.getCuisineKnowHow).not.toHaveBeenCalled();
  });
});

describe('Cuisine and savoir-faire loader', () => {
  beforeEach(() => {
    mocks.getConceptHistory.mockReset();
    mocks.getCuisineKnowHow.mockReset();
    mocks.getCuisineKnowHow.mockResolvedValue({
      cuisineDescription: null,
      knowHowParticularities: null,
      homemade: null,
    });
  });

  it.each(['OWNER', 'MANAGER'] as const)(
    'loads with READ and derives MANAGE for %s',
    async (role) => {
      const tenant = context(role);
      await expect(
        loadCuisineKnowHowSection(
          { kind: 'test-cloud-database' } as never,
          tenant,
        ),
      ).resolves.toEqual({
        cuisineKnowHow: {
          cuisineDescription: null,
          knowHowParticularities: null,
          homemade: null,
        },
        canManage: true,
      });
      expect(mocks.getCuisineKnowHow).toHaveBeenCalledTimes(1);
      expect(mocks.getConceptHistory).not.toHaveBeenCalled();
    },
  );

  it('denies STAFF without issuing a repository read', async () => {
    await expect(
      loadCuisineKnowHowSection(
        { kind: 'test-cloud-database' } as never,
        context('STAFF'),
      ),
    ).resolves.toBeNull();
    expect(mocks.getCuisineKnowHow).not.toHaveBeenCalled();
    expect(mocks.getConceptHistory).not.toHaveBeenCalled();
  });
});
