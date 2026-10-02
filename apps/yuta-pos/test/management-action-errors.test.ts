import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  requireLocalManagementCredentials: vi.fn(),
  signInLocalUser: vi.fn(),
  createCatalogCategory: vi.fn(),
  createTestPrintJob: vi.fn(),
  deleteComboGroup: vi.fn(),
  updateEstablishmentProfile: vi.fn(),
  cookieSet: vi.fn(),
}));

vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));

vi.mock('next/navigation', () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT ${url}`);
  }),
}));

vi.mock('next/headers', () => ({
  cookies: vi.fn(async () => ({ set: mocks.cookieSet })),
}));

vi.mock('../src/server/local-management-session', () => ({
  localManagementSessionCookie: 'yuta_pos_management_session',
  requireLocalManagementCredentials: mocks.requireLocalManagementCredentials,
}));

vi.mock('../src/lib/site-agent-client', async (importOriginal) => {
  const original =
    await importOriginal<typeof import('../src/lib/site-agent-client')>();
  return {
    SiteAgentClientError: original.SiteAgentClientError,
    siteAgentClient: {
      signInLocalUser: mocks.signInLocalUser,
      createCatalogCategory: mocks.createCatalogCategory,
      createTestPrintJob: mocks.createTestPrintJob,
      deleteComboGroup: mocks.deleteComboGroup,
      updateEstablishmentProfile: mocks.updateEstablishmentProfile,
    },
  };
});

import { signInManagementAction } from '../src/app/management/actions';
import { createCatalogCategoryAction } from '../src/app/management/catalog/actions';
import { deleteComboGroupAction } from '../src/app/management/combos/actions';
import { saveEstablishmentProfileAction } from '../src/app/management/establishment/actions';
import { createTestPrintJobAction } from '../src/app/management/printing/actions';
import { SiteAgentClientError } from '../src/lib/site-agent-client';

const expiredSession = new Error('NEXT_REDIRECT /management/login');
const comboGroupId = '019fe22c-bcab-73dc-af5d-2829d53b99ec';

function categoryForm(): FormData {
  const formData = new FormData();
  formData.set('name', 'Entrées');
  formData.set('sortOrder', '1');
  return formData;
}

function establishmentForm(): FormData {
  const formData = new FormData();
  formData.set('displayName', 'YUTA Luna');
  formData.set('revision', '1');
  return formData;
}

function loginForm(): FormData {
  const formData = new FormData();
  formData.set('userId', '019fe22c-bcb3-747d-8df3-eb8aef155d3c');
  formData.set('pin', '1234');
  return formData;
}

const idleState = { error: null, success: null };

describe('management actions with an expired session', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireLocalManagementCredentials.mockRejectedValue(expiredSession);
  });

  it('let the login redirect escape instead of reporting the service as unavailable', async () => {
    await expect(
      createCatalogCategoryAction(idleState, categoryForm()),
    ).rejects.toBe(expiredSession);
    await expect(createTestPrintJobAction(idleState)).rejects.toBe(
      expiredSession,
    );
    await expect(deleteComboGroupAction(comboGroupId, idleState)).rejects.toBe(
      expiredSession,
    );
    await expect(
      saveEstablishmentProfileAction(
        {
          status: 'idle',
          message: null,
          fieldError: null,
          profile: null,
        },
        establishmentForm(),
      ),
    ).rejects.toBe(expiredSession);

    expect(mocks.createCatalogCategory).not.toHaveBeenCalled();
    expect(mocks.createTestPrintJob).not.toHaveBeenCalled();
    expect(mocks.deleteComboGroup).not.toHaveBeenCalled();
    expect(mocks.updateEstablishmentProfile).not.toHaveBeenCalled();
  });
});

describe('printing action errors', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireLocalManagementCredentials.mockResolvedValue({
      token: 'token',
    });
  });

  it('shows a French fallback instead of the technical site-agent message', async () => {
    mocks.createTestPrintJob.mockRejectedValue(
      new SiteAgentClientError(
        502,
        'INVALID_ERROR_RESPONSE',
        'The site agent returned an invalid error response.',
      ),
    );

    await expect(createTestPrintJobAction(idleState)).resolves.toEqual({
      error: 'L’opération d’impression n’a pas pu être effectuée.',
      success: null,
    });
  });
});

describe('management sign-in errors', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('reports a wrong user or PIN only for invalid credentials', async () => {
    mocks.signInLocalUser.mockRejectedValue(
      new SiteAgentClientError(
        401,
        'LOCAL_INVALID_CREDENTIALS',
        'The selected user or PIN is invalid.',
      ),
    );

    await expect(
      signInManagementAction({ error: null }, loginForm()),
    ).resolves.toEqual({ error: 'Utilisateur ou PIN incorrect.' });
  });

  it('keeps the rate-limit message', async () => {
    mocks.signInLocalUser.mockRejectedValue(
      new SiteAgentClientError(429, 'LOCAL_LOGIN_RATE_LIMITED', 'Too many.'),
    );

    await expect(
      signInManagementAction({ error: null }, loginForm()),
    ).resolves.toEqual({
      error: 'Trop de tentatives. Réessayez dans quelques minutes.',
    });
  });

  it('reports other site-agent errors without blaming the PIN', async () => {
    mocks.signInLocalUser.mockRejectedValue(
      new SiteAgentClientError(500, 'INTERNAL_ERROR', 'Boom.'),
    );

    await expect(
      signInManagementAction({ error: null }, loginForm()),
    ).resolves.toEqual({
      error: 'Connexion impossible pour le moment. Réessayez.',
    });
  });

  it('reports an unreachable local service', async () => {
    mocks.signInLocalUser.mockRejectedValue(new TypeError('fetch failed'));

    await expect(
      signInManagementAction({ error: null }, loginForm()),
    ).resolves.toEqual({
      error: 'Le service local est indisponible. Réessayez plus tard.',
    });
  });
});
