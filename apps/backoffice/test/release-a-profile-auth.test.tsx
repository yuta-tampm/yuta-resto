import type { AuthenticatedSession } from '@yuta/auth';
import type { MembershipLookupPort, MembershipRecord } from '@yuta/tenant';
import { TenantError } from '@yuta/tenant';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { GeneralInformationProfile } from '../src/app/(authenticated)/etablissement/informations-generales/general-information-model';

const infrastructure = vi.hoisted(() => ({
  database: Object.freeze({ testBoundary: 'release-a-profile-auth' }),
  findSession: vi.fn<(token: string) => Promise<AuthenticatedSession | null>>(),
  membership: vi.fn<MembershipLookupPort['findActiveMembership']>(),
  metadata: vi.fn(),
  cookieGet: vi.fn(),
  notFound: vi.fn((): never => {
    throw new Error('NOT_FOUND');
  }),
  getProfile: vi.fn(),
  getConceptHistory: vi.fn(),
  getCuisineKnowHow: vi.fn(),
  getCustomerExperience: vi.fn(),
  getTeamCulture: vi.fn(),
  getCommunicationIdentity: vi.fn(),
  listValidatedKnowledge: vi.fn(),
  profileRender: vi.fn(),
  knowledgeRender: vi.fn(),
  loadIntegration: vi.fn(),
  listManageableEstablishments: vi.fn(),
  listOrganizationUsers: vi.fn(),
}));

vi.mock('server-only', () => ({}));
vi.mock('next/headers', () => ({
  cookies: async () => ({ get: infrastructure.cookieGet }),
}));
vi.mock('next/navigation', () => ({
  redirect: (destination: string): never => {
    throw new Error(`REDIRECT:${destination}`);
  },
  notFound: infrastructure.notFound,
}));
vi.mock('react', async (importOriginal) => ({
  ...(await importOriginal<typeof import('react')>()),
  cache: <T,>(callback: T): T => callback,
}));
vi.mock('../src/server/cloud-database', () => ({
  cloudDatabase: infrastructure.database,
}));
vi.mock('@yuta/db-cloud', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@yuta/db-cloud')>()),
  createAuthRepository: () => ({ findSession: infrastructure.findSession }),
  createMembershipLookup: () => ({
    findActiveMembership: infrastructure.membership,
  }),
  findAuthenticatedTenantMetadata: infrastructure.metadata,
  getEstablishmentProfile: infrastructure.getProfile,
  getRestaurantKnowledgeConceptHistory: infrastructure.getConceptHistory,
  getRestaurantKnowledgeCuisineKnowHow: infrastructure.getCuisineKnowHow,
  getRestaurantKnowledgeCustomerExperience:
    infrastructure.getCustomerExperience,
  getRestaurantKnowledgeTeamCulture: infrastructure.getTeamCulture,
  getRestaurantKnowledgeCommunicationIdentity:
    infrastructure.getCommunicationIdentity,
  listRestaurantKnowledgeValidatedItems: infrastructure.listValidatedKnowledge,
  createTenantUserRepository: () => ({
    listManageableEstablishments: infrastructure.listManageableEstablishments,
    listOrganizationUsers: infrastructure.listOrganizationUsers,
  }),
}));
vi.mock(
  '../src/app/(authenticated)/etablissement/informations-generales/_components/general-information-form',
  () => ({
    GeneralInformationForm: (props: {
      profile: GeneralInformationProfile;
      canEdit: boolean;
    }) => {
      infrastructure.profileRender(props);
      return (
        <section data-profile-editable={String(props.canEdit)}>
          {JSON.stringify(props.profile)}
        </section>
      );
    },
  }),
);
vi.mock(
  '../src/app/(authenticated)/etablissement/informations-generales/_components/concept-history-form',
  () => ({
    ConceptHistoryForm: (props: unknown) => {
      infrastructure.knowledgeRender('concept-history', props);
      return <section>{JSON.stringify(props)}</section>;
    },
  }),
);
vi.mock(
  '../src/app/(authenticated)/etablissement/informations-generales/_components/cuisine-know-how-form',
  () => ({
    CuisineKnowHowForm: (props: unknown) => {
      infrastructure.knowledgeRender('cuisine-know-how', props);
      return <section>{JSON.stringify(props)}</section>;
    },
  }),
);
vi.mock(
  '../src/app/(authenticated)/etablissement/informations-generales/_components/customer-experience-form',
  () => ({
    CustomerExperienceForm: (props: unknown) => {
      infrastructure.knowledgeRender('customer-experience', props);
      return <section>{JSON.stringify(props)}</section>;
    },
  }),
);
vi.mock(
  '../src/app/(authenticated)/etablissement/informations-generales/_components/team-culture-form',
  () => ({
    TeamCultureForm: (props: unknown) => {
      infrastructure.knowledgeRender('team-culture', props);
      return <section>{JSON.stringify(props)}</section>;
    },
  }),
);
vi.mock(
  '../src/app/(authenticated)/etablissement/informations-generales/_components/communication-identity-form',
  () => ({
    CommunicationIdentityForm: (props: unknown) => {
      infrastructure.knowledgeRender('communication-identity', props);
      return <section>{JSON.stringify(props)}</section>;
    },
  }),
);
vi.mock(
  '../src/app/(authenticated)/etablissement/informations-generales/_components/validated-knowledge-section',
  () => ({
    ValidatedKnowledgeSection: (props: unknown) => {
      infrastructure.knowledgeRender('validated-knowledge', props);
      return <section>{JSON.stringify(props)}</section>;
    },
  }),
);
vi.mock(
  '../src/app/(authenticated)/parametres/integrations/google-integration-loader',
  () => ({ loadGoogleIntegrationPageData: infrastructure.loadIntegration }),
);
vi.mock(
  '../src/app/(authenticated)/parametres/integrations/_components/google-connector-panel',
  () => ({ GoogleConnectorPanel: () => null }),
);
vi.mock(
  '../src/app/(authenticated)/parametres/integrations/_components/google-location-selector-panel',
  () => ({ GoogleLocationSelectorPanel: () => null }),
);
vi.mock(
  '../src/app/(authenticated)/parametres/integrations/_components/integration-status-alerts',
  () => ({ IntegrationStatusAlerts: () => null }),
);
vi.mock(
  '../src/app/(authenticated)/parametres/utilisateurs-acces/_components/access-audit-history',
  () => ({ AccessAuditHistory: () => null }),
);
vi.mock(
  '../src/app/(authenticated)/parametres/utilisateurs-acces/_components/users-page',
  () => ({ UsersPage: () => null }),
);

import GeneralInformationPage from '../src/app/(authenticated)/etablissement/informations-generales/page';
import * as knowledgeLoaders from '../src/app/(authenticated)/etablissement/informations-generales/restaurant-knowledge-loader';
import SettingsIntegrationsPage from '../src/app/(authenticated)/parametres/integrations/page';
import SettingsUsersPage from '../src/app/(authenticated)/parametres/utilisateurs-acces/page';
import {
  hasEstablishmentPermission,
  requireReputationPermission,
} from '../src/server/auth/permissions';
import {
  requireReputationTenant,
  requireUserManagementTenant,
} from '../src/server/auth/session';

const basicProfile: GeneralInformationProfile = {
  name: 'Synthetic restaurant',
  description: 'Existing basic profile',
  addressLine1: null,
  addressLine2: null,
  postalCode: null,
  city: null,
  countryCode: null,
  phone: null,
  email: null,
  website: null,
  publicPhone: null,
  publicEmail: null,
  logoUrl: null,
  coverImageUrl: null,
  languages: ['fr'],
  serviceModes: ['DINE_IN'],
  publicDescription: true,
  publicAddress: false,
  publicPhoneVisible: false,
  publicEmailVisible: false,
  publicWebsite: false,
  publicLanguages: true,
  publicServiceModes: true,
};
const knowledgeReads = [
  infrastructure.getConceptHistory,
  infrastructure.getCuisineKnowHow,
  infrastructure.getCustomerExperience,
  infrastructure.getTeamCulture,
  infrastructure.getCommunicationIdentity,
  infrastructure.listValidatedKnowledge,
];
const knowledgeLoaderNames = [
  'loadConceptHistorySection',
  'loadCuisineKnowHowSection',
  'loadCustomerExperienceSection',
  'loadTeamCultureSection',
  'loadCommunicationIdentitySection',
  'loadValidatedKnowledgeSection',
] as const;
const knowledgeSentinels = [
  'private-concept',
  'private-cuisine',
  'private-experience',
  'private-team',
  'private-communication',
  'private-validated-item',
];

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv('NODE_ENV', 'test');
  vi.stubEnv('BACKOFFICE_EXPOSURE_PROFILE', 'release-a');
  infrastructure.findSession.mockResolvedValue(session());
  infrastructure.membership.mockResolvedValue(membership());
  infrastructure.metadata.mockResolvedValue({
    locale: 'fr-FR',
    timezone: 'Europe/Paris',
    entitlements: ['reputation.enabled'],
  });
  infrastructure.cookieGet.mockImplementation((name: string) =>
    name === 'yuta_backoffice_session'
      ? { value: 'synthetic-profile-auth-token' }
      : undefined,
  );
  infrastructure.getProfile.mockResolvedValue(basicProfile);
  infrastructure.getConceptHistory.mockResolvedValue({
    concept: knowledgeSentinels[0],
    history: null,
  });
  infrastructure.getCuisineKnowHow.mockResolvedValue({
    cuisineDescription: knowledgeSentinels[1],
    knowHowParticularities: null,
    homemade: null,
  });
  infrastructure.getCustomerExperience.mockResolvedValue({
    desiredExperience: knowledgeSentinels[2],
    welcomeAndService: null,
    customerAttention: null,
  });
  infrastructure.getTeamCulture.mockResolvedValue({
    valuesAndMindset: knowledgeSentinels[3],
    workingTogether: null,
    transmissionAndIntegration: null,
  });
  infrastructure.getCommunicationIdentity.mockResolvedValue({
    toneAndCommunicationStyle: knowledgeSentinels[4],
    customerAddressing: null,
    languageElementsAndThingsToAvoid: null,
  });
  infrastructure.listValidatedKnowledge.mockResolvedValue([
    { id: 'knowledge-item-a', statement: knowledgeSentinels[5] },
  ]);
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});

describe('actual general-information page exposure composition', () => {
  it.each([
    ['OWNER', true],
    ['MANAGER', true],
    ['STAFF', false],
  ] as const)(
    'renders only the basic profile for A %s with existing edit grant %s',
    async (role, canEdit) => {
      infrastructure.membership.mockResolvedValue(membership({ role }));
      const loads = knowledgeLoaderNames.map((name) =>
        vi.spyOn(knowledgeLoaders, name),
      );
      const page = await GeneralInformationPage();
      const markup = renderToStaticMarkup(page);

      expect(markup).toContain('Informations générales');
      expect(markup).toContain(basicProfile.name);
      expect(markup).toContain(`data-profile-editable="${canEdit}"`);
      expect(infrastructure.profileRender).toHaveBeenCalledWith({
        profile: basicProfile,
        canEdit,
      });
      expect(infrastructure.getProfile).toHaveBeenCalledExactlyOnceWith(
        infrastructure.database,
        expect.objectContaining({
          organizationId: 'org-a',
          establishmentId: 'est-a',
          actor: expect.objectContaining({ role }),
        }),
      );
      for (const load of loads) expect(load).not.toHaveBeenCalled();
      for (const read of knowledgeReads) expect(read).not.toHaveBeenCalled();
      expect(infrastructure.knowledgeRender).not.toHaveBeenCalled();
      for (const secret of knowledgeSentinels) {
        expect(JSON.stringify(page)).not.toContain(secret);
        expect(markup).not.toContain(secret);
      }
    },
  );

  it.each(['OWNER', 'MANAGER'] as const)(
    'keeps all six real Knowledge loads and render props for internal %s',
    async (role) => {
      vi.stubEnv('BACKOFFICE_EXPOSURE_PROFILE', 'internal');
      infrastructure.membership.mockResolvedValue(membership({ role }));
      const loads = knowledgeLoaderNames.map((name) =>
        vi.spyOn(knowledgeLoaders, name),
      );
      const page = await GeneralInformationPage();
      const markup = renderToStaticMarkup(page);

      for (const load of loads) expect(load).toHaveBeenCalledOnce();
      for (const read of knowledgeReads) {
        expect(read).toHaveBeenCalledExactlyOnceWith(
          infrastructure.database,
          expect.objectContaining({
            organizationId: 'org-a',
            establishmentId: 'est-a',
            actor: expect.objectContaining({ role }),
          }),
        );
      }
      expect(infrastructure.knowledgeRender).toHaveBeenCalledTimes(6);
      for (const [, props] of infrastructure.knowledgeRender.mock.calls) {
        expect(props).toHaveProperty('canManage', true);
      }
      for (const secret of knowledgeSentinels) {
        expect(JSON.stringify(page)).toContain(secret);
        expect(markup).toContain(secret);
      }
    },
  );

  it('keeps internal STAFF profile read-only and denies Knowledge repository reads', async () => {
    vi.stubEnv('BACKOFFICE_EXPOSURE_PROFILE', 'internal');
    infrastructure.membership.mockResolvedValue(membership({ role: 'STAFF' }));
    renderToStaticMarkup(await GeneralInformationPage());
    expect(infrastructure.profileRender).toHaveBeenCalledWith({
      profile: basicProfile,
      canEdit: false,
    });
    for (const read of knowledgeReads) expect(read).not.toHaveBeenCalled();
    expect(infrastructure.knowledgeRender).not.toHaveBeenCalled();
  });

  it('provides operator/support recovery for a missing A basic profile', async () => {
    infrastructure.getProfile.mockResolvedValue(null);
    const markup = renderToStaticMarkup(await GeneralInformationPage());
    expect(markup).toContain(
      'Les informations de l’établissement sont indisponibles',
    );
    expect(markup).toContain('administrateur');
    expect(markup).toContain('l’assistance YUTA');
    expect(infrastructure.notFound).not.toHaveBeenCalled();
    expect(infrastructure.profileRender).not.toHaveBeenCalled();
    for (const read of knowledgeReads) expect(read).not.toHaveBeenCalled();
  });

  it('keeps internal missing-profile notFound behavior', async () => {
    vi.stubEnv('BACKOFFICE_EXPOSURE_PROFILE', 'internal');
    infrastructure.getProfile.mockResolvedValue(null);
    await expect(GeneralInformationPage()).rejects.toThrow('NOT_FOUND');
    expect(infrastructure.notFound).toHaveBeenCalledOnce();
    expect(infrastructure.profileRender).not.toHaveBeenCalled();
  });

  it.each([
    { status: 'suspended' as const },
    { organizationId: 'foreign-organization' },
    { establishmentId: 'foreign-establishment' },
    { userId: 'foreign-user' },
  ])(
    'keeps trusted membership denial before basic-profile data for %j',
    async (invalid) => {
      infrastructure.membership.mockResolvedValue(membership(invalid));
      await expect(GeneralInformationPage()).rejects.toThrow(
        'REDIRECT:/resolution-etablissement?returnTo=%2Fetablissement%2Finformations-generales',
      );
      expect(infrastructure.getProfile).not.toHaveBeenCalled();
      for (const read of knowledgeReads) expect(read).not.toHaveBeenCalled();
    },
  );
});

describe('actual common auth helpers preserve grants and safe A denial', () => {
  it.each(['MANAGER', 'STAFF'] as const)(
    'redirects A %s Integrations to permitted restricted recovery before its loader',
    async (role) => {
      infrastructure.membership.mockResolvedValue(membership({ role }));
      await expect(
        SettingsIntegrationsPage({ searchParams: Promise.resolve({}) }),
      ).rejects.toThrow('REDIRECT:/aujourdhui?exposure=restricted');
      expect(infrastructure.loadIntegration).not.toHaveBeenCalled();
    },
  );

  it('redirects A STAFF Users & Access before its protected repositories', async () => {
    infrastructure.membership.mockResolvedValue(membership({ role: 'STAFF' }));
    await expect(
      SettingsUsersPage({ searchParams: Promise.resolve({}) }),
    ).rejects.toThrow('REDIRECT:/aujourdhui?exposure=restricted');
    expect(infrastructure.listManageableEstablishments).not.toHaveBeenCalled();
    expect(infrastructure.listOrganizationUsers).not.toHaveBeenCalled();
  });

  it.each(['/visibilite-reputation/avis', '/parametres/integrations'])(
    'uses the same safe recovery for missing reputation entitlement at %s',
    async (returnTo) => {
      infrastructure.metadata.mockResolvedValue({
        locale: 'fr-FR',
        timezone: 'Europe/Paris',
        entitlements: [],
      });
      await expect(requireReputationTenant(returnTo)).rejects.toThrow(
        'REDIRECT:/aujourdhui?exposure=restricted',
      );
      expect(infrastructure.loadIntegration).not.toHaveBeenCalled();
    },
  );

  it('allows A OWNER Integrations through its actual helper with unchanged grants', async () => {
    const { tenant } = await requireReputationTenant(
      '/parametres/integrations',
    );
    expect(tenant.actor).toMatchObject({ role: 'OWNER' });
    expect(tenant.entitlements).toEqual(new Set(['reputation.enabled']));
    expect(() =>
      requireReputationPermission(tenant, 'reputation.connector.manage'),
    ).not.toThrow();
    expect(
      hasEstablishmentPermission(tenant, 'establishment.profile.manage'),
    ).toBe(true);
    expect(infrastructure.metadata).toHaveBeenCalledWith(
      infrastructure.database,
      { organizationId: 'org-a', establishmentId: 'est-a' },
    );
  });

  it.each([
    ['OWNER', true, true],
    ['MANAGER', false, true],
    ['STAFF', false, false],
  ] as const)(
    'retains A %s reputation read, connector=%s and profile edit=%s',
    async (role, connectorGrant, profileEditGrant) => {
      infrastructure.membership.mockResolvedValue(membership({ role }));
      const { tenant } = await requireReputationTenant();
      expect(() =>
        requireReputationPermission(tenant, 'reputation.read'),
      ).not.toThrow();
      const requireConnectorGrant = () =>
        requireReputationPermission(tenant, 'reputation.connector.manage');
      if (connectorGrant) expect(requireConnectorGrant).not.toThrow();
      else expect(requireConnectorGrant).toThrow(TenantError);
      expect(
        hasEstablishmentPermission(tenant, 'establishment.profile.manage'),
      ).toBe(profileEditGrant);
    },
  );

  it.each(['OWNER', 'MANAGER'] as const)(
    'keeps A %s existing Users & Access helper permission',
    async (role) => {
      infrastructure.membership.mockResolvedValue(membership({ role }));
      expect((await requireUserManagementTenant()).tenant.actor).toMatchObject({
        role,
      });
    },
  );

  it('keeps internal Integrations denial as the existing permission error', async () => {
    vi.stubEnv('BACKOFFICE_EXPOSURE_PROFILE', 'internal');
    infrastructure.membership.mockResolvedValue(
      membership({ role: 'MANAGER' }),
    );
    expect(
      (await requireReputationTenant('/parametres/integrations')).tenant.actor,
    ).toMatchObject({
      role: 'MANAGER',
    });
    await expect(
      SettingsIntegrationsPage({ searchParams: Promise.resolve({}) }),
    ).rejects.toThrow(TenantError);
    expect(infrastructure.loadIntegration).not.toHaveBeenCalled();
  });

  it.each(['MANAGER', 'STAFF'] as const)(
    'redirects A %s from an explicit connector requirement to restricted recovery',
    async (role) => {
      infrastructure.membership.mockResolvedValue(membership({ role }));
      await expect(
        requireReputationTenant('/parametres/integrations', {
          requires: 'reputation.connector.manage',
        }),
      ).rejects.toThrow('REDIRECT:/aujourdhui?exposure=restricted');
    },
  );

  it('throws the permission error for an explicit connector requirement in internal', async () => {
    vi.stubEnv('BACKOFFICE_EXPOSURE_PROFILE', 'internal');
    infrastructure.membership.mockResolvedValue(
      membership({ role: 'MANAGER' }),
    );
    await expect(
      requireReputationTenant('/parametres/integrations', {
        requires: 'reputation.connector.manage',
      }),
    ).rejects.toThrow(TenantError);
  });

  it('allows an A OWNER through an explicit connector requirement', async () => {
    const { tenant } = await requireReputationTenant(
      '/parametres/integrations',
      { requires: 'reputation.connector.manage' },
    );
    expect(tenant.actor).toMatchObject({ role: 'OWNER' });
  });

  it('does not derive a connector requirement from the return path alone', async () => {
    infrastructure.membership.mockResolvedValue(
      membership({ role: 'MANAGER' }),
    );
    const { tenant } = await requireReputationTenant(
      '/parametres/integrations',
    );
    expect(tenant.actor).toMatchObject({ role: 'MANAGER' });
  });

  it('keeps internal STAFF Users & Access denial as the existing permission error', async () => {
    vi.stubEnv('BACKOFFICE_EXPOSURE_PROFILE', 'internal');
    infrastructure.membership.mockResolvedValue(membership({ role: 'STAFF' }));
    await expect(requireUserManagementTenant()).rejects.toThrow(TenantError);
  });

  it('keeps internal missing Reputation entitlement as FEATURE_NOT_ENABLED', async () => {
    vi.stubEnv('BACKOFFICE_EXPOSURE_PROFILE', 'internal');
    infrastructure.metadata.mockResolvedValue({
      locale: 'fr-FR',
      timezone: 'Europe/Paris',
      entitlements: [],
    });
    await expect(requireReputationTenant()).rejects.toMatchObject({
      code: 'FEATURE_NOT_ENABLED',
      statusCode: 403,
    });
  });
});

function session(): AuthenticatedSession {
  return {
    id: 'session-a',
    userId: 'user-a',
    userName: 'Synthetic Owner',
    userEmail: 'owner@example.test',
    systemRole: null,
    organizationId: 'org-a',
    establishmentId: 'est-a',
    expiresAt: new Date('2099-01-01T00:00:00Z'),
  };
}

function membership(
  overrides: Partial<MembershipRecord> = {},
): MembershipRecord {
  return {
    membershipId: 'member-a',
    userId: 'user-a',
    organizationId: 'org-a',
    establishmentId: 'est-a',
    status: 'active',
    role: 'OWNER',
    ...overrides,
  };
}
