import type { AuthenticatedSession } from '@yuta/auth';
import type {
  FormalitesPersonnelDraftMutationOutcome,
  FormalitesPersonnelDraftReadModel,
} from '@yuta/contracts';
import {
  TenantError,
  type MembershipLookupPort,
  type MembershipRecord,
} from '@yuta/tenant';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const infrastructure = vi.hoisted(() => ({
  findSession: vi.fn<(token: string) => Promise<AuthenticatedSession | null>>(),
  membership: vi.fn<MembershipLookupPort['findActiveMembership']>(),
  metadata: vi.fn(),
  cookieGet: vi.fn(),
  headers: vi.fn(),
  database: Object.freeze({ testBoundary: true }),
  readDraft: vi.fn(),
  createDraft: vi.fn(),
  saveDraft: vi.fn(),
  reconcileDraft: vi.fn(),
  abandonDraft: vi.fn(),
}));

vi.mock('server-only', () => ({}));
vi.mock('next/headers', () => ({
  cookies: async () => ({ get: infrastructure.cookieGet }),
  headers: infrastructure.headers,
}));
vi.mock('next/navigation', () => ({
  redirect: (destination: string): never => {
    throw new Error(`REDIRECT:${destination}`);
  },
}));
vi.mock('react', async (importOriginal) => ({
  ...(await importOriginal<typeof import('react')>()),
  cache: <T>(callback: T): T => callback,
}));
vi.mock('../src/server/cloud-database', () => ({
  cloudDatabase: infrastructure.database,
}));
vi.mock('@yuta/db-cloud', () => ({
  createAuthRepository: () => ({ findSession: infrastructure.findSession }),
  createMembershipLookup: () => ({
    findActiveMembership: infrastructure.membership,
  }),
  findAuthenticatedTenantMetadata: infrastructure.metadata,
  readFormalitesPersonnelDraft: infrastructure.readDraft,
  createFormalitesPersonnelDraft: infrastructure.createDraft,
  saveFormalitesPersonnelDraft: infrastructure.saveDraft,
  reconcileFormalitesPersonnelDraft: infrastructure.reconcileDraft,
  abandonFormalitesPersonnelDraft: infrastructure.abandonDraft,
}));

import {
  abandonFormalitesPersonnelDraftAction,
  createFormalitesPersonnelDraftAction,
  loadFormalitesPersonnelDraftAction,
  reconcileFormalitesPersonnelDraftAction,
  saveFormalitesPersonnelDraftAction,
} from '../src/app/(authenticated)/equipe/formalites-personnel/[employeeId]/actions';
import * as permissions from '../src/server/auth/permissions';

const employeeId = '019930d3-2f5d-7d5a-9f96-8f2e25e7c40a';
const draftId = '019930d3-41ea-7282-81e4-2bddc527035d';
const returnTo = '/equipe/formalites-personnel';
const login = `REDIRECT:/connexion?returnTo=${encodeURIComponent(returnTo)}`;
const recovery = `REDIRECT:/resolution-etablissement?returnTo=${encodeURIComponent(returnTo)}`;

beforeEach(() => {
  vi.restoreAllMocks();
  infrastructure.findSession.mockReset().mockResolvedValue(session());
  infrastructure.membership.mockReset().mockResolvedValue(membership());
  infrastructure.metadata.mockReset().mockResolvedValue({
    locale: 'fr-FR',
    timezone: 'Europe/Paris',
    entitlements: [],
  });
  infrastructure.cookieGet
    .mockReset()
    .mockImplementation((name: string) =>
      name === 'yuta_backoffice_session'
        ? { value: 'synthetic-token' }
        : undefined,
    );
  infrastructure.headers.mockReset();
  infrastructure.readDraft.mockReset().mockResolvedValue(editableModel());
  for (const mutation of [
    infrastructure.createDraft,
    infrastructure.saveDraft,
    infrastructure.reconcileDraft,
    infrastructure.abandonDraft,
  ]) {
    mutation.mockReset().mockResolvedValue(successOutcome());
  }
  vi.spyOn(console, 'error').mockImplementation(() => undefined);
});

describe('Formalités persistent draft actions trusted authorization', () => {
  it('loads through actual session, membership, Formalités READ and Personnel READ', async () => {
    const requirePersonnel = vi.spyOn(
      permissions,
      'requirePersonnelPermission',
    );
    const result = await loadFormalitesPersonnelDraftAction(employeeId);
    expect(result).toEqual({ kind: 'success', model: editableModel() });
    expect(infrastructure.findSession).toHaveBeenCalledWith('synthetic-token');
    expect(infrastructure.metadata).toHaveBeenCalledWith(
      infrastructure.database,
      { organizationId: 'org-a', establishmentId: 'est-a' },
    );
    expect(infrastructure.membership).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'user-a',
        organizationId: 'org-a',
        establishmentId: 'est-a',
      }),
    );
    expect(requirePersonnel).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({ organizationId: 'org-a' }),
      'personnel.employee.read',
    );
    expect(infrastructure.readDraft).toHaveBeenCalledWith(
      infrastructure.database,
      expect.objectContaining({
        organizationId: 'org-a',
        establishmentId: 'est-a',
      }),
      employeeId,
    );
  });

  it.each([
    ['create', createFormalitesPersonnelDraftAction, createInput()],
    ['save', saveFormalitesPersonnelDraftAction, saveInput()],
    ['reconcile', reconcileFormalitesPersonnelDraftAction, reconcileInput()],
    ['abandon', abandonFormalitesPersonnelDraftAction, abandonInput()],
  ] as const)(
    'requires actual Formalités MANAGE and independent Personnel READ for %s',
    async (_label, action, input) => {
      const requirePersonnel = vi.spyOn(
        permissions,
        'requirePersonnelPermission',
      );
      await expect(action(input)).resolves.toMatchObject({ kind: 'success' });
      expect(requirePersonnel).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({ organizationId: 'org-a' }),
        'personnel.employee.read',
      );
    },
  );

  it('preserves login redirect before input parsing or repository access', async () => {
    infrastructure.cookieGet.mockReturnValue(undefined);
    await expect(createFormalitesPersonnelDraftAction({})).rejects.toThrow(
      login,
    );
    expect(infrastructure.createDraft).not.toHaveBeenCalled();
  });

  it('preserves scope recovery for missing or mismatched membership', async () => {
    infrastructure.membership.mockResolvedValue(null);
    await expect(
      loadFormalitesPersonnelDraftAction(employeeId),
    ).rejects.toThrow(recovery);
    infrastructure.membership.mockResolvedValue(
      membership({ establishmentId: 'est-b' }),
    );
    await expect(
      loadFormalitesPersonnelDraftAction(employeeId),
    ).rejects.toThrow(recovery);
    expect(infrastructure.readDraft).not.toHaveBeenCalled();
  });

  it('preserves exact missing-establishment 400 behavior', async () => {
    infrastructure.findSession.mockResolvedValue({
      ...session(),
      establishmentId: '',
    });
    infrastructure.membership.mockResolvedValue(
      membership({ establishmentId: '' }),
    );
    await expect(
      loadFormalitesPersonnelDraftAction(employeeId),
    ).rejects.toMatchObject({
      code: 'ESTABLISHMENT_REQUIRED',
      statusCode: 400,
      message: 'An establishment is required.',
    });
  });

  it.each(['MANAGER', 'STAFF'] as const)(
    'preserves exact Formalités 403 for authenticated %s',
    async (role) => {
      infrastructure.membership.mockResolvedValue(membership({ role }));
      await expect(
        createFormalitesPersonnelDraftAction(createInput()),
      ).rejects.toMatchObject({
        code: 'CROSS_TENANT_ACCESS_DENIED',
        statusCode: 403,
        message: 'Permission denied.',
      });
      expect(infrastructure.createDraft).not.toHaveBeenCalled();
    },
  );

  it.each(['YUTA_ADMIN', 'YUTA_SUPPORT'] as const)(
    'does not let %s bypass restaurant membership or grants',
    async (systemRole) => {
      infrastructure.findSession.mockResolvedValue({
        ...session(),
        systemRole,
      });
      infrastructure.membership.mockResolvedValue(null);
      await expect(
        loadFormalitesPersonnelDraftAction(employeeId),
      ).rejects.toThrow(recovery);
      infrastructure.membership.mockResolvedValue(
        membership({ role: 'STAFF' }),
      );
      await expect(
        createFormalitesPersonnelDraftAction(createInput()),
      ).rejects.toMatchObject({ statusCode: 403 });
    },
  );

  it('does not let Formalités permission substitute for Personnel source READ', async () => {
    vi.spyOn(permissions, 'requirePersonnelPermission').mockImplementation(
      () => {
        throw new TenantError(
          'Permission denied.',
          'CROSS_TENANT_ACCESS_DENIED',
          403,
        );
      },
    );
    await expect(
      loadFormalitesPersonnelDraftAction(employeeId),
    ).rejects.toMatchObject({
      statusCode: 403,
    });
    expect(infrastructure.readDraft).not.toHaveBeenCalled();
  });

  it('ignores browser tenant/role claims and rejects unknown command fields', async () => {
    const forged = {
      ...createInput(),
      organizationId: 'org-forged',
      establishmentId: 'est-forged',
      role: 'OWNER',
      permissions: ['formalites.manage'],
    };
    const result = await createFormalitesPersonnelDraftAction(forged);
    expect(result.kind).toBe('validation_error');
    expect(infrastructure.createDraft).not.toHaveBeenCalled();
    expect(infrastructure.metadata).toHaveBeenCalledWith(
      infrastructure.database,
      { organizationId: 'org-a', establishmentId: 'est-a' },
    );
  });
});

describe('Formalités persistent draft actions validation and safe output', () => {
  it.each([
    [
      createFormalitesPersonnelDraftAction,
      { ...createInput(), operationKey: 'short' },
    ],
    [
      saveFormalitesPersonnelDraftAction,
      { ...saveInput(), probationChoice: 'other' },
    ],
    [
      reconcileFormalitesPersonnelDraftAction,
      {
        ...reconcileInput(),
        decisions: [
          { fact: 'position', choice: 'keep' },
          { fact: 'position', choice: 'refresh' },
        ],
      },
    ],
    [
      abandonFormalitesPersonnelDraftAction,
      { ...abandonInput(), abandonmentReason: '   ' },
    ],
  ] as const)(
    'strictly validates untrusted mutation input',
    async (action, input) => {
      await expect(action(input)).resolves.toMatchObject({
        kind: 'validation_error',
      });
    },
  );

  it('maps an invalid repository payload to safe server_error', async () => {
    infrastructure.createDraft.mockResolvedValue({
      kind: 'success',
      replayed: false,
      model: { ...editableModel(), organizationId: 'secret-org' },
      operationKeyHash: 'secret',
      stack: 'secret',
    });
    const result = await createFormalitesPersonnelDraftAction(createInput());
    expect(result).toEqual({ kind: 'server_error' });
    expect(JSON.stringify(result)).not.toMatch(
      /secret-org|operationKey|requestFingerprint|actor|stack/,
    );
  });

  it('maps infrastructure failure to recoverable server_error without internals', async () => {
    infrastructure.saveDraft.mockRejectedValue(
      new Error('database DSN and stack must stay private'),
    );
    const result = await saveFormalitesPersonnelDraftAction(saveInput());
    expect(result).toEqual({ kind: 'server_error' });
    expect(JSON.stringify(result)).not.toContain('database DSN');
  });

  it('fails closed for malformed employee identifiers before repository lookup', async () => {
    await expect(
      loadFormalitesPersonnelDraftAction('not-a-uuid'),
    ).resolves.toEqual({
      kind: 'not_found',
    });
    expect(infrastructure.readDraft).not.toHaveBeenCalled();
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

function editableModel(): FormalitesPersonnelDraftReadModel {
  const values = {
    givenNames: 'Camille',
    familyName: 'Durand',
    position: 'Serveuse',
    qualification: 'Employée',
    employmentTermType: 'indefinite' as const,
    entryDate: '2026-09-01',
    contractWeeklyMinutes: 2_100,
  };
  return {
    state: 'editable',
    draftId,
    formalityType: 'cdi_preparation',
    status: 'draft',
    probationChoice: 'undecided',
    revision: 1,
    draftValues: values,
    currentPersonnelValues: values,
    createdAt: '2026-09-05T00:00:00.000Z',
    updatedAt: '2026-09-05T00:00:00.000Z',
  };
}

function successOutcome(): FormalitesPersonnelDraftMutationOutcome {
  return { kind: 'success', replayed: false, model: editableModel() };
}

function createInput() {
  return {
    employeeId,
    operationKey: 'create-operation-key-0001',
    probationChoice: 'undecided' as const,
  };
}

function saveInput() {
  return {
    employeeId,
    draftId,
    expectedDraftRevision: 1,
    operationKey: 'save-operation-key-000001',
    probationChoice: 'include' as const,
  };
}

function reconcileInput() {
  return {
    employeeId,
    draftId,
    expectedDraftRevision: 1,
    operationKey: 'reconcile-operation-key-01',
    sourceStateFingerprint: 'a'.repeat(64),
    decisions: [{ fact: 'position' as const, choice: 'keep' as const }],
  };
}

function abandonInput() {
  return {
    employeeId,
    draftId,
    expectedDraftRevision: 1,
    operationKey: 'abandon-operation-key-001',
    abandonmentReason: 'Préparation annulée.',
  };
}
