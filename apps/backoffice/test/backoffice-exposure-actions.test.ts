import type { AuthenticatedSession } from '@yuta/auth';
import type { MembershipLookupPort, MembershipRecord } from '@yuta/tenant';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const infrastructure = vi.hoisted(() => ({
  findSession: vi.fn<(token: string) => Promise<AuthenticatedSession | null>>(),
  membership: vi.fn<MembershipLookupPort['findActiveMembership']>(),
  metadata: vi.fn(),
  cookieGet: vi.fn(),
  database: Object.freeze({ testBoundary: true }),
  deferredRepository: vi.fn(),
  documentRuntime: vi.fn(),
  extractionAdapter: vi.fn(),
  syntheticPdfLoader: vi.fn(),
  revalidatePath: vi.fn(),
  fetch: vi.fn(),
}));

vi.mock('server-only', () => ({}));
vi.mock('next/headers', () => ({
  cookies: async () => ({ get: infrastructure.cookieGet }),
}));
vi.mock('next/navigation', () => ({
  redirect: (destination: string): never => {
    throw new Error(`REDIRECT:${destination}`);
  },
}));
vi.mock('next/cache', () => ({
  revalidatePath: infrastructure.revalidatePath,
}));
vi.mock('react', async (importOriginal) => ({
  ...(await importOriginal<typeof import('react')>()),
  cache: <T>(callback: T): T => callback,
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
  ...Object.fromEntries(
    [
      'addReservationInternalNote',
      'createPublicReservation',
      'findPublicBookingConfiguration',
      'updateReservationDetails',
      'updateReservationStatus',
      'saveBookingSettings',
      'createBookingServicePeriod',
      'deleteBookingServicePeriod',
      'createBookingException',
      'deleteBookingException',
      'createPersonnelEmployee',
      'findPersonnelEmployee',
      'listPersonnelEmployeeAccessHistory',
      'listPersonnelEmployeeAuditHistory',
      'listPersonnelEmployeeUnifiedHistory',
      'recordPersonnelEmployeeAccess',
      'recordPersonnelContractExtractionAudit',
      'setPersonnelEmployeeDeparture',
      'updatePersonnelEmployee',
      'validatePersonnelContractExtractionReviewGrant',
      'listPersonnelDocuments',
      'recordPersonnelDocumentUploadRejected',
      'resolvePersonnelDocumentExtractionSource',
      'savePersonnelDocumentMetadata',
      'createPersonnelContractAmendmentMetadata',
      'listPersonnelContractAmendments',
      'recordPersonnelContractAmendmentUploadRejected',
      'replacePersonnelContractAmendmentMetadata',
      'listPersonnelActionOverview',
      'resolvePersonnelActionTarget',
      'listPersonnelRegister',
      'createPersonnelRegisterEntry',
      'correctPersonnelRegisterEntry',
      'readFormalitesPersonnelDraft',
      'createFormalitesPersonnelDraft',
      'saveFormalitesPersonnelDraft',
      'reconcileFormalitesPersonnelDraft',
      'abandonFormalitesPersonnelDraft',
      'saveReputationReviewSocialLinks',
      'createRestaurantKnowledgeValidatedItem',
      'removeRestaurantKnowledgeValidatedItem',
      'saveRestaurantKnowledgeConceptHistory',
      'saveRestaurantKnowledgeCommunicationIdentity',
      'saveRestaurantKnowledgeCuisineKnowHow',
      'saveRestaurantKnowledgeCustomerExperience',
      'saveRestaurantKnowledgeTeamCulture',
      'updateRestaurantKnowledgeValidatedItem',
    ].map((name) => [
      name,
      (...args: unknown[]) => infrastructure.deferredRepository(name, args),
    ]),
  ),
}));
vi.mock(
  '../src/server/personnel-documents/runtime',
  async (importOriginal) => ({
    ...(await importOriginal<
      typeof import('../src/server/personnel-documents/runtime')
    >()),
    getPersonnelDocumentRuntime: infrastructure.documentRuntime,
  }),
);
vi.mock('../src/server/ai/runtime', () => ({
  createPersonnelExtractionExecutor: infrastructure.extractionAdapter,
}));
vi.mock(
  '../src/server/personnel-contract-extraction/synthetic-upload',
  async (importOriginal) => ({
    ...(await importOriginal<
      typeof import('../src/server/personnel-contract-extraction/synthetic-upload')
    >()),
    createDevelopmentSyntheticPdfLoader: infrastructure.syntheticPdfLoader,
  }),
);

import * as reservationActions from '../src/app/(authenticated)/reservations/reservation-actions';
import * as bookingSettingsActions from '../src/app/(authenticated)/etablissement/booking-settings-actions';
import * as servicePeriodActions from '../src/app/(authenticated)/etablissement/booking-service-period-actions';
import * as bookingExceptionActions from '../src/app/(authenticated)/etablissement/booking-exception-actions';
import * as personnelEmployeeActions from '../src/app/(authenticated)/equipe/salaries/actions';
import * as personnelActionOverviewActions from '../src/app/(authenticated)/equipe/salaries/action-overview-actions';
import * as personnelContractExtractionActions from '../src/app/(authenticated)/equipe/salaries/contract-extraction-actions';
import * as personnelDocumentActions from '../src/app/(authenticated)/equipe/salaries/document-actions';
import * as registerActions from '../src/app/(authenticated)/equipe/registre-personnel/actions';
import * as formalitesActions from '../src/app/(authenticated)/equipe/formalites-personnel/[employeeId]/actions';
import * as satisfactionActions from '../src/app/(authenticated)/visibilite-reputation/satisfaction/actions';
import * as knowledgeActions from '../src/app/(authenticated)/etablissement/informations-generales/actions';
import {
  requireAuthenticatedTenant,
  requireBookingTenant,
} from '../src/server/auth/session';
import { requireFormalitesTenant } from '../src/server/auth/formalites';
import * as permissions from '../src/server/auth/permissions';

const personnelActions = {
  ...personnelEmployeeActions,
  ...personnelActionOverviewActions,
  ...personnelContractExtractionActions,
  ...personnelDocumentActions,
};

const employeeId = '019930d3-2f5d-7d5a-9f96-8f2e25e7c40a';
const draftId = '019930d3-41ea-7282-81e4-2bddc527035d';
const operationId = '019930d3-3d79-7c11-9f28-3edcdde17050';
const idle = { status: 'idle' as const, message: null };
const idleFields = { ...idle, fieldErrors: {} };
const idleEmployee = { ...idleFields, currentEmployee: null };
const idleKnowledge = {
  ...idle,
  fieldError: null,
  item: null,
  removedItemId: null,
};
const draftInput = { employeeId, operationKey: 'synthetic-operation-key-001' };

function form(): FormData {
  const result = new FormData();
  for (const [key, value] of Object.entries({
    id: operationId,
    reservationId: operationId,
    employeeId,
    statement: 'Cuisine guidée par les saisons.',
    concept: 'Cuisine ouverte.',
    history: '',
    name: 'Service du soir',
    dayOfWeek: '1',
    startTime: '19:00',
    endTime: '22:00',
    capacity: '20',
    body: 'Synthetic local note.',
    status: 'CONFIRMED',
    exposure: 'internal',
    permissions: 'restaurant-knowledge.manage',
  }))
    result.set(key, value);
  return result;
}

// Every exported deferred action is invoked directly. URL admission alone is
// insufficient because Next can replay an action ID at a permitted page URL.
const deferredActions: ReadonlyArray<
  readonly [string, () => Promise<unknown>]
> = [
  [
    'updateReservationStatusAction',
    () => reservationActions.updateReservationStatusAction(idleFields, form()),
  ],
  [
    'addReservationNoteAction',
    () => reservationActions.addReservationNoteAction(idleFields, form()),
  ],
  [
    'updateReservationDetailsAction',
    () => reservationActions.updateReservationDetailsAction(idleFields, form()),
  ],
  [
    'createManualReservationAction',
    () => reservationActions.createManualReservationAction(idleFields, form()),
  ],
  [
    'saveBookingSettingsAction',
    () => bookingSettingsActions.saveBookingSettingsAction(idleFields, form()),
  ],
  [
    'createServicePeriodAction',
    () => servicePeriodActions.createServicePeriodAction(idleFields, form()),
  ],
  [
    'deleteServicePeriodAction',
    () => servicePeriodActions.deleteServicePeriodAction(idleFields, form()),
  ],
  [
    'createExceptionAction',
    () => bookingExceptionActions.createExceptionAction(idleFields, form()),
  ],
  [
    'deleteExceptionAction',
    () => bookingExceptionActions.deleteExceptionAction(idleFields, form()),
  ],
  [
    'loadPersonnelActionOverviewAction',
    () => personnelActions.loadPersonnelActionOverviewAction({}),
  ],
  [
    'resolvePersonnelActionTargetAction',
    () =>
      personnelActions.resolvePersonnelActionTargetAction(
        employeeId,
        'incomplete_employee_dossier',
      ),
  ],
  [
    'loadEmployeeDocumentsAction',
    () => personnelActions.loadEmployeeDocumentsAction(employeeId, operationId),
  ],
  [
    'startContractExtractionAction',
    () =>
      personnelActions.startContractExtractionAction({
        employeeId,
        operationId,
        scenario: 'complete',
      }),
  ],
  [
    'loadStoredSyntheticContractEligibilityAction',
    () =>
      personnelActions.loadStoredSyntheticContractEligibilityAction(
        employeeId,
        operationId,
        1,
      ),
  ],
  [
    'applyContractExtractionAction',
    () =>
      personnelActions.applyContractExtractionAction({
        employeeId,
        operationId,
      }),
  ],
  [
    'saveEmployeeDocumentAction',
    () =>
      personnelActions.saveEmployeeDocumentAction(
        { ...idle, document: null },
        form(),
      ),
  ],
  [
    'loadEmployeeAmendmentsAction',
    () =>
      personnelActions.loadEmployeeAmendmentsAction(employeeId, operationId),
  ],
  [
    'saveEmployeeAmendmentAction',
    () =>
      personnelActions.saveEmployeeAmendmentAction(
        {
          ...idleFields,
          amendment: null,
          values: { effectiveDate: '', reference: '' },
        },
        form(),
      ),
  ],
  [
    'loadEmployeeAccessHistoryAction',
    () =>
      personnelActions.loadEmployeeAccessHistoryAction(employeeId, operationId),
  ],
  [
    'loadEmployeeHistoryAction',
    () => personnelActions.loadEmployeeHistoryAction(employeeId, operationId),
  ],
  [
    'loadEmployeeUnifiedHistoryAction',
    () =>
      personnelActions.loadEmployeeUnifiedHistoryAction(
        employeeId,
        operationId,
      ),
  ],
  [
    'recordEmployeeDossierViewAction',
    () =>
      personnelActions.recordEmployeeDossierViewAction(employeeId, operationId),
  ],
  [
    'createEmployeeAction',
    () =>
      personnelActions.createEmployeeAction(
        { ...idleFields, employeeId: null, duplicateCandidates: [] },
        form(),
      ),
  ],
  [
    'updateEmployeeAction',
    () => personnelActions.updateEmployeeAction(idleEmployee, form()),
  ],
  [
    'setEmployeeDepartureAction',
    () => personnelActions.setEmployeeDepartureAction(idleEmployee, form()),
  ],
  [
    'loadPersonnelRegisterPageAction',
    () => registerActions.loadPersonnelRegisterPageAction(null),
  ],
  [
    'inscribePersonnelRegisterAction',
    () => registerActions.inscribePersonnelRegisterAction(idleFields, form()),
  ],
  [
    'correctPersonnelRegisterAction',
    () => registerActions.correctPersonnelRegisterAction(idleFields, form()),
  ],
  [
    'loadFormalitesPersonnelDraftAction',
    () => formalitesActions.loadFormalitesPersonnelDraftAction(employeeId),
  ],
  [
    'createFormalitesPersonnelDraftAction',
    () =>
      formalitesActions.createFormalitesPersonnelDraftAction({
        ...draftInput,
        probationChoice: 'undecided',
      }),
  ],
  [
    'saveFormalitesPersonnelDraftAction',
    () =>
      formalitesActions.saveFormalitesPersonnelDraftAction({
        ...draftInput,
        draftId,
        expectedDraftRevision: 1,
        probationChoice: 'include',
      }),
  ],
  [
    'reconcileFormalitesPersonnelDraftAction',
    () =>
      formalitesActions.reconcileFormalitesPersonnelDraftAction({
        ...draftInput,
        draftId,
        expectedDraftRevision: 1,
        sourceStateFingerprint: 'a'.repeat(64),
        decisions: [{ fact: 'position', choice: 'keep' }],
      }),
  ],
  [
    'abandonFormalitesPersonnelDraftAction',
    () =>
      formalitesActions.abandonFormalitesPersonnelDraftAction({
        ...draftInput,
        draftId,
        expectedDraftRevision: 1,
        abandonmentReason: 'Préparation annulée.',
      }),
  ],
  [
    'saveReviewSocialLinksAction',
    () =>
      satisfactionActions.saveReviewSocialLinksAction({
        expectedValues: {
          googleReviewUrl: null,
          facebookReviewUrl: null,
          instagramUrl: null,
        },
        proposedValues: {
          googleReviewUrl: null,
          facebookReviewUrl: null,
          instagramUrl: null,
        },
        expectedStateToken: 'a'.repeat(64),
      }),
  ],
  [
    'saveConceptHistoryAction',
    () => knowledgeActions.saveConceptHistoryAction(idle, form()),
  ],
  [
    'saveCuisineKnowHowAction',
    () => knowledgeActions.saveCuisineKnowHowAction(idle, form()),
  ],
  [
    'saveCustomerExperienceAction',
    () => knowledgeActions.saveCustomerExperienceAction(idle, form()),
  ],
  [
    'saveTeamCultureAction',
    () => knowledgeActions.saveTeamCultureAction(idle, form()),
  ],
  [
    'saveCommunicationIdentityAction',
    () =>
      knowledgeActions.saveCommunicationIdentityAction(
        { ...idle, savedCommunicationIdentity: null },
        form(),
      ),
  ],
  [
    'createValidatedKnowledgeAction',
    () =>
      knowledgeActions.createValidatedKnowledgeAction(idleKnowledge, form()),
  ],
  [
    'updateValidatedKnowledgeAction',
    () =>
      knowledgeActions.updateValidatedKnowledgeAction(idleKnowledge, form()),
  ],
  [
    'removeValidatedKnowledgeAction',
    () =>
      knowledgeActions.removeValidatedKnowledgeAction(idleKnowledge, form()),
  ],
];

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv('BACKOFFICE_EXPOSURE_PROFILE', 'release-a');
  infrastructure.findSession.mockResolvedValue(session());
  infrastructure.membership.mockResolvedValue(membership());
  infrastructure.metadata.mockResolvedValue({
    locale: 'fr-FR',
    timezone: 'Europe/Paris',
    entitlements: ['booking.enabled', 'reputation.enabled'],
  });
  infrastructure.cookieGet.mockImplementation((name: string) =>
    name === 'yuta_backoffice_session'
      ? { value: 'synthetic-token' }
      : undefined,
  );
  vi.stubGlobal('fetch', infrastructure.fetch);
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('Release A invoked deferred Server Action availability', () => {
  it('accounts for every current deferred action export', () => {
    const exportedNames = [
      reservationActions,
      bookingSettingsActions,
      servicePeriodActions,
      bookingExceptionActions,
      personnelActions,
      registerActions,
      formalitesActions,
      satisfactionActions,
      knowledgeActions,
    ]
      .flatMap((module) => Object.keys(module))
      .filter((name) => name !== 'saveGeneralInformationAction');
    expect(deferredActions).toHaveLength(42);
    expect(deferredActions.map(([name]) => name).sort()).toEqual(
      exportedNames.sort(),
    );
  });

  it('uses a valid OWNER fixture through actual session, tenant and grants in internal', async () => {
    vi.stubEnv('BACKOFFICE_EXPOSURE_PROFILE', 'internal');
    const { tenant } = await requireBookingTenant();
    await expect(
      requireFormalitesTenant('formalites.manage'),
    ).resolves.toMatchObject({ tenant });
    await expect(
      requireAuthenticatedTenant('/etablissement/informations-generales'),
    ).resolves.toMatchObject({ tenant });
    expect(
      permissions.hasRestaurantKnowledgePermission(
        tenant,
        'restaurant-knowledge.manage',
      ),
    ).toBe(true);
    expect(infrastructure.findSession).toHaveBeenCalledWith('synthetic-token');
    expect(infrastructure.membership).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'user-a',
        organizationId: 'org-a',
        establishmentId: 'est-a',
      }),
    );
    expect(infrastructure.deferredRepository).not.toHaveBeenCalled();
  });

  describe.each(['development', 'test'] as const)(
    'NODE_ENV=%s',
    (environment) => {
      it.each(deferredActions)(
        'denies %s before session, data, provider or success effects',
        async (_name, invoke) => {
          vi.stubEnv('NODE_ENV', environment);
          await expect(invoke()).rejects.toThrow(
            'REDIRECT:/aujourdhui?exposure=unavailable',
          );
          expect(infrastructure.cookieGet).not.toHaveBeenCalled();
          expect(infrastructure.findSession).not.toHaveBeenCalled();
          expect(infrastructure.membership).not.toHaveBeenCalled();
          expect(infrastructure.metadata).not.toHaveBeenCalled();
          expect(infrastructure.deferredRepository).not.toHaveBeenCalled();
          expect(infrastructure.documentRuntime).not.toHaveBeenCalled();
          expect(infrastructure.extractionAdapter).not.toHaveBeenCalled();
          expect(infrastructure.syntheticPdfLoader).not.toHaveBeenCalled();
          expect(infrastructure.fetch).not.toHaveBeenCalled();
          expect(infrastructure.revalidatePath).not.toHaveBeenCalled();
        },
      );
    },
  );

  it('denies Knowledge before parsing browser input or considering a false grant', async () => {
    infrastructure.membership.mockResolvedValue(membership({ role: 'STAFF' }));
    vi.stubEnv('BACKOFFICE_EXPOSURE_PROFILE', 'internal');
    const { tenant } = await requireAuthenticatedTenant(
      '/etablissement/informations-generales',
    );
    expect(
      permissions.hasRestaurantKnowledgePermission(
        tenant,
        'restaurant-knowledge.manage',
      ),
    ).toBe(false);
    vi.clearAllMocks();
    vi.stubEnv('BACKOFFICE_EXPOSURE_PROFILE', 'release-a');
    const input = form();
    const readInput = vi.spyOn(input, 'get');
    const requireGrant = vi.spyOn(
      permissions,
      'requireRestaurantKnowledgePermission',
    );
    await expect(
      knowledgeActions.createValidatedKnowledgeAction(idleKnowledge, input),
    ).rejects.toThrow('REDIRECT:/aujourdhui?exposure=unavailable');
    expect(readInput).not.toHaveBeenCalled();
    expect(requireGrant).not.toHaveBeenCalled();
    expect(infrastructure.deferredRepository).not.toHaveBeenCalled();
  });

  it.each([
    [
      'loadPersonnelActionOverviewAction',
      {
        status: 'error',
        message: 'La liste des actions est indisponible. Réessayez.',
      },
    ],
    [
      'resolvePersonnelActionTargetAction',
      {
        status: 'error',
        message: 'La liste des actions est indisponible. Réessayez.',
      },
    ],
    [
      'startContractExtractionAction',
      {
        status: 'error',
        code: 'unavailable',
        message: 'L’analyse locale est disponible uniquement en développement.',
      },
    ],
    [
      'loadStoredSyntheticContractEligibilityAction',
      {
        status: 'unavailable',
        message:
          'Seul un contrat fictif YUTA reconnu peut être analysé depuis Documents.',
      },
    ],
    [
      'applyContractExtractionAction',
      {
        status: 'error',
        message:
          'L’application locale est disponible uniquement en développement.',
        currentEmployee: null,
      },
    ],
    [
      'loadPersonnelRegisterPageAction',
      {
        status: 'error',
        message: 'Le registre réel est désactivé dans cet environnement.',
      },
    ],
    [
      'inscribePersonnelRegisterAction',
      {
        status: 'error',
        message: 'Le registre réel est désactivé dans cet environnement.',
        fieldErrors: {},
      },
    ],
    [
      'correctPersonnelRegisterAction',
      {
        status: 'error',
        message: 'Le registre réel est désactivé dans cet environnement.',
        fieldErrors: {},
      },
    ],
  ] as const)(
    'preserves the internal development-disabled result for %s',
    async (name, result) => {
      vi.stubEnv('BACKOFFICE_EXPOSURE_PROFILE', 'internal');
      vi.stubEnv('NODE_ENV', 'test');
      const invoke = deferredActions.find(
        ([exportName]) => exportName === name,
      )?.[1];
      if (!invoke) throw new Error(`Missing deferred action fixture: ${name}`);
      await expect(invoke()).resolves.toEqual(result);
      expect(infrastructure.findSession).not.toHaveBeenCalled();
      expect(infrastructure.deferredRepository).not.toHaveBeenCalled();
      expect(infrastructure.documentRuntime).not.toHaveBeenCalled();
      expect(infrastructure.extractionAdapter).not.toHaveBeenCalled();
      expect(infrastructure.fetch).not.toHaveBeenCalled();
      expect(infrastructure.revalidatePath).not.toHaveBeenCalled();
    },
  );
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
