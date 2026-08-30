import { randomUUID } from 'node:crypto';
import type { TenantContext, TenantRole } from '@yuta/tenant';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  getConceptHistory: vi.fn(),
}));

vi.mock('server-only', () => ({}));
vi.mock('@yuta/db-cloud', () => ({
  getRestaurantKnowledgeConceptHistory: mocks.getConceptHistory,
}));

import { loadConceptHistorySection } from '../src/app/(authenticated)/etablissement/informations-generales/restaurant-knowledge-loader';

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

describe('Restaurant Knowledge page loader', () => {
  beforeEach(() => {
    mocks.getConceptHistory.mockReset();
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
    },
  );

  it('does not load or expose the slice to STAFF despite profile read access', async () => {
    await expect(
      loadConceptHistorySection({} as never, context('STAFF')),
    ).resolves.toBeNull();
    expect(mocks.getConceptHistory).not.toHaveBeenCalled();
  });
});
