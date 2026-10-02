import { randomUUID } from 'node:crypto';
import type { TenantContext, TenantRole } from '@yuta/tenant';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  getConceptHistory: vi.fn(),
  getCommunicationIdentity: vi.fn(),
  getCuisineKnowHow: vi.fn(),
  getCustomerExperience: vi.fn(),
  getTeamCulture: vi.fn(),
}));

vi.mock('server-only', () => ({}));
vi.mock('@yuta/db-cloud', () => ({
  getRestaurantKnowledgeConceptHistory: mocks.getConceptHistory,
  getRestaurantKnowledgeCommunicationIdentity: mocks.getCommunicationIdentity,
  getRestaurantKnowledgeCuisineKnowHow: mocks.getCuisineKnowHow,
  getRestaurantKnowledgeCustomerExperience: mocks.getCustomerExperience,
  getRestaurantKnowledgeTeamCulture: mocks.getTeamCulture,
}));

import {
  loadCommunicationIdentitySection,
  loadConceptHistorySection,
  loadCuisineKnowHowSection,
  loadCustomerExperienceSection,
  loadTeamCultureSection,
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
    mocks.getCustomerExperience.mockReset();
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

describe('Communication Identity loader', () => {
  beforeEach(() => {
    mocks.getConceptHistory.mockReset();
    mocks.getCuisineKnowHow.mockReset();
    mocks.getCustomerExperience.mockReset();
    mocks.getTeamCulture.mockReset();
    mocks.getCommunicationIdentity.mockReset();
    mocks.getCommunicationIdentity.mockResolvedValue({
      toneAndCommunicationStyle: null,
      customerAddressing: null,
      languageElementsAndThingsToAvoid: null,
    });
  });

  it.each(['OWNER', 'MANAGER'] as const)(
    'loads with READ and derives MANAGE for %s',
    async (role) => {
      const tenant = context(role);
      await expect(
        loadCommunicationIdentitySection(
          { kind: 'test-cloud-database' } as never,
          tenant,
        ),
      ).resolves.toEqual({
        communicationIdentity: {
          toneAndCommunicationStyle: null,
          customerAddressing: null,
          languageElementsAndThingsToAvoid: null,
        },
        canManage: true,
      });
      expect(mocks.getCommunicationIdentity).toHaveBeenCalledWith(
        { kind: 'test-cloud-database' },
        tenant,
      );
      expect(mocks.getConceptHistory).not.toHaveBeenCalled();
      expect(mocks.getCuisineKnowHow).not.toHaveBeenCalled();
      expect(mocks.getCustomerExperience).not.toHaveBeenCalled();
      expect(mocks.getTeamCulture).not.toHaveBeenCalled();
    },
  );

  it('denies STAFF before repository access despite Profile read access', async () => {
    await expect(
      loadCommunicationIdentitySection(
        { kind: 'test-cloud-database' } as never,
        context('STAFF'),
      ),
    ).resolves.toBeNull();
    expect(mocks.getCommunicationIdentity).not.toHaveBeenCalled();
    expect(mocks.getConceptHistory).not.toHaveBeenCalled();
    expect(mocks.getCuisineKnowHow).not.toHaveBeenCalled();
    expect(mocks.getCustomerExperience).not.toHaveBeenCalled();
    expect(mocks.getTeamCulture).not.toHaveBeenCalled();
  });
});

describe('Cuisine and savoir-faire loader', () => {
  beforeEach(() => {
    mocks.getConceptHistory.mockReset();
    mocks.getCuisineKnowHow.mockReset();
    mocks.getCustomerExperience.mockReset();
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

describe('Customer Experience loader', () => {
  beforeEach(() => {
    mocks.getConceptHistory.mockReset();
    mocks.getCuisineKnowHow.mockReset();
    mocks.getCustomerExperience.mockReset();
    mocks.getCustomerExperience.mockResolvedValue({
      desiredExperience: null,
      welcomeAndService: null,
      customerAttention: null,
    });
  });

  it.each(['OWNER', 'MANAGER'] as const)(
    'loads with READ and derives MANAGE for %s',
    async (role) => {
      const tenant = context(role);
      await expect(
        loadCustomerExperienceSection(
          { kind: 'test-cloud-database' } as never,
          tenant,
        ),
      ).resolves.toEqual({
        customerExperience: {
          desiredExperience: null,
          welcomeAndService: null,
          customerAttention: null,
        },
        canManage: true,
      });
      expect(mocks.getCustomerExperience).toHaveBeenCalledTimes(1);
      expect(mocks.getConceptHistory).not.toHaveBeenCalled();
      expect(mocks.getCuisineKnowHow).not.toHaveBeenCalled();
    },
  );

  it('denies STAFF before repository access despite Profile read access', async () => {
    await expect(
      loadCustomerExperienceSection(
        { kind: 'test-cloud-database' } as never,
        context('STAFF'),
      ),
    ).resolves.toBeNull();
    expect(mocks.getCustomerExperience).not.toHaveBeenCalled();
    expect(mocks.getConceptHistory).not.toHaveBeenCalled();
    expect(mocks.getCuisineKnowHow).not.toHaveBeenCalled();
  });
});

describe('Team Culture loader', () => {
  beforeEach(() => {
    mocks.getConceptHistory.mockReset();
    mocks.getCuisineKnowHow.mockReset();
    mocks.getCustomerExperience.mockReset();
    mocks.getTeamCulture.mockReset();
    mocks.getTeamCulture.mockResolvedValue({
      valuesAndMindset: null,
      workingTogether: null,
      transmissionAndIntegration: null,
    });
  });

  it.each(['OWNER', 'MANAGER'] as const)(
    'loads with READ and derives MANAGE for %s',
    async (role) => {
      const tenant = context(role);
      await expect(
        loadTeamCultureSection(
          { kind: 'test-cloud-database' } as never,
          tenant,
        ),
      ).resolves.toEqual({
        teamCulture: {
          valuesAndMindset: null,
          workingTogether: null,
          transmissionAndIntegration: null,
        },
        canManage: true,
      });
      expect(mocks.getTeamCulture).toHaveBeenCalledWith(
        { kind: 'test-cloud-database' },
        tenant,
      );
      expect(mocks.getConceptHistory).not.toHaveBeenCalled();
      expect(mocks.getCuisineKnowHow).not.toHaveBeenCalled();
      expect(mocks.getCustomerExperience).not.toHaveBeenCalled();
    },
  );

  it('denies STAFF before repository access despite Profile read access', async () => {
    await expect(
      loadTeamCultureSection(
        { kind: 'test-cloud-database' } as never,
        context('STAFF'),
      ),
    ).resolves.toBeNull();
    expect(mocks.getTeamCulture).not.toHaveBeenCalled();
    expect(mocks.getConceptHistory).not.toHaveBeenCalled();
    expect(mocks.getCuisineKnowHow).not.toHaveBeenCalled();
    expect(mocks.getCustomerExperience).not.toHaveBeenCalled();
  });
});
