import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  AuthError,
  generatePointageContinuation,
  type AuthenticatedSession,
} from '@yuta/auth';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const infrastructure = vi.hoisted(() => ({
  findSession: vi.fn(),
  signIn: vi.fn(),
  switchTenant: vi.fn(),
  activateSelection: vi.fn(),
  listAvailableTenants: vi.fn(),
  metadata: vi.fn(),
  membership: vi.fn(),
  cookieGet: vi.fn(),
  cookieSet: vi.fn(),
  cookieDelete: vi.fn(),
  headers: vi.fn(),
  employees: vi.fn(),
  overview: vi.fn(),
  frame: vi.fn(),
}));
vi.mock('server-only', () => ({}));
vi.mock('next/headers', () => ({
  cookies: async () => ({
    get: infrastructure.cookieGet,
    set: infrastructure.cookieSet,
    delete: infrastructure.cookieDelete,
  }),
  headers: infrastructure.headers,
}));
vi.mock('next/navigation', () => ({
  redirect: (url: string): never => {
    throw new Error(`REDIRECT:${url}`);
  },
}));
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));
vi.mock('react', async (original) => ({
  ...(await original<typeof import('react')>()),
  cache: <T>(value: T): T => value,
}));
vi.mock('../src/server/cloud-database', () => ({
  cloudDatabase: Object.freeze({ test: true }),
}));
vi.mock('@yuta/db-cloud', () => ({
  createAuthRepository: () => ({
    findSession: infrastructure.findSession,
    signIn: infrastructure.signIn,
    switchTenant: infrastructure.switchTenant,
    activateSelection: infrastructure.activateSelection,
    listAvailableTenants: infrastructure.listAvailableTenants,
  }),
  createMembershipLookup: () => ({
    findActiveMembership: infrastructure.membership,
  }),
  findAuthenticatedTenantMetadata: infrastructure.metadata,
  listPersonnelEmployees: infrastructure.employees,
  listPersonnelActionOverview: infrastructure.overview,
}));
vi.mock('../src/components/backoffice/backoffice-frame', () => ({
  BackofficeFrame: infrastructure.frame,
}));
vi.mock(
  '../src/app/(authenticated)/equipe/salaries/_components/salaries-page',
  () => ({ SalariesPage: vi.fn() }),
);

import {
  getCurrentSession,
  requireBackofficeSession,
  requireAuthenticatedTenant,
  requirePersonnelTenant,
} from '../src/server/auth/session';
import { loginAction } from '../src/app/(public)/connexion/actions';
import { switchTenantAction } from '../src/app/(authenticated)/actions';
import { selectEstablishmentAction } from '../src/app/(public)/selection-etablissement/actions';
import AuthenticatedLayout from '../src/app/(authenticated)/layout';
import PersonnelPage from '../src/app/(authenticated)/equipe/salaries/page';

let token: string;
beforeEach(() => {
  vi.clearAllMocks();
  token = generatePointageContinuation();
  infrastructure.findSession.mockResolvedValue(null);
  infrastructure.cookieGet.mockImplementation((name: string) =>
    ['yuta_backoffice_session', 'yuta_backoffice_selection'].includes(name)
      ? { value: token }
      : undefined,
  );
  infrastructure.headers.mockResolvedValue(
    new Headers({ Authorization: `Pointage ${token}` }),
  );
  infrastructure.signIn.mockRejectedValue(
    new AuthError('Invalid credentials.', 'INVALID_CREDENTIALS'),
  );
  infrastructure.switchTenant.mockRejectedValue(
    new AuthError('Invalid session.', 'SESSION_INVALID'),
  );
  infrastructure.activateSelection.mockRejectedValue(
    new AuthError('Invalid ticket.', 'SELECTION_TICKET_INVALID'),
  );
});

describe('A1.2 CLOUD_AUTH Backoffice composition (repository result is a double)', () => {
  it('does not turn the Pointage header into login credentials', async () => {
    const result = await loginAction({ error: null }, new FormData());
    expect(result.error).toBeTruthy();
    expect(infrastructure.signIn).not.toHaveBeenCalled();
    expect(infrastructure.cookieSet).not.toHaveBeenCalled();
  });
  it('passes a continuation password to credential verification without creating cookies or success redirect', async () => {
    const form = new FormData();
    form.set('email', 'synthetic@example.test');
    form.set('password', token);
    expect((await loginAction({ error: null }, form)).error).toBeTruthy();
    expect(infrastructure.signIn).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({
        email: 'synthetic@example.test',
        password: token,
      }),
    );
    expect(infrastructure.cookieSet).not.toHaveBeenCalled();
  });
  it('passes the exact cookie to lookup and redirects without cloud authority', async () => {
    expect(await getCurrentSession()).toBeNull();
    expect(infrastructure.findSession).toHaveBeenCalledExactlyOnceWith(token);
    await expect(requireBackofficeSession()).rejects.toThrow(
      'REDIRECT:/connexion?returnTo=%2Faujourdhui',
    );
    expect(infrastructure.findSession).toHaveBeenLastCalledWith(token);
    expect(infrastructure.cookieSet).not.toHaveBeenCalled();
    expect(infrastructure.signIn).not.toHaveBeenCalled();
    expect(infrastructure.switchTenant).not.toHaveBeenCalled();
  });
  it('ignores a Pointage header without a cloud cookie', async () => {
    infrastructure.cookieGet.mockReturnValue(undefined);
    expect(await getCurrentSession()).toBeNull();
    expect(infrastructure.findSession).not.toHaveBeenCalled();
  });
  it('retains a legitimate cloud-session positive control', async () => {
    const session: AuthenticatedSession = {
      id: 'cloud-session',
      userId: 'cloud-user',
      userName: 'Synthetic',
      userEmail: 'synthetic@example.test',
      systemRole: null,
      organizationId: 'org',
      establishmentId: 'est',
      expiresAt: new Date('2099-01-01'),
    };
    infrastructure.cookieGet.mockReturnValue({
      value: 'legitimate-cloud-token',
    });
    infrastructure.findSession.mockResolvedValue(session);
    expect(await requireBackofficeSession()).toEqual(session);
    expect(infrastructure.findSession).toHaveBeenCalledExactlyOnceWith(
      'legitimate-cloud-token',
    );
  });
});
describe('A1.2 MEMBERSHIP composition', () => {
  it('does not resolve tenant metadata or membership after failed cloud authentication', async () => {
    await expect(requireAuthenticatedTenant()).rejects.toThrow(
      'REDIRECT:/connexion',
    );
    expect(infrastructure.findSession).toHaveBeenCalledExactlyOnceWith(token);
    expect(infrastructure.metadata).not.toHaveBeenCalled();
    expect(infrastructure.membership).not.toHaveBeenCalled();
  });
  it.each(['session', 'selection'] as const)(
    'does not turn %s proof into a scoped session',
    async (kind) => {
      const membershipId = '11111111-1111-4111-8111-111111111111';
      const form = new FormData();
      form.set('membershipId', membershipId);
      const result =
        kind === 'session'
          ? await switchTenantAction({ error: null }, form)
          : await selectEstablishmentAction({ error: null }, form);
      expect(result.error).toBeTruthy();
      const method =
        kind === 'session'
          ? infrastructure.switchTenant
          : infrastructure.activateSelection;
      expect(method).toHaveBeenCalledExactlyOnceWith(
        kind === 'session'
          ? { token, membershipId }
          : { selectionToken: token, membershipId },
      );
      expect(infrastructure.cookieSet).not.toHaveBeenCalled();
      expect(infrastructure.cookieDelete).not.toHaveBeenCalled();
    },
  );
});
describe('A1.2 PERSONNEL real guards and page', () => {
  it('denies continuation-only Personnel composition before dossier access', async () => {
    await expect(requirePersonnelTenant()).rejects.toThrow(
      'REDIRECT:/connexion',
    );
    await expect(
      PersonnelPage({ searchParams: Promise.resolve({}) }),
    ).rejects.toThrow('REDIRECT:/connexion');
    expect(infrastructure.findSession).toHaveBeenCalledWith(token);
    expect(infrastructure.metadata).not.toHaveBeenCalled();
    expect(infrastructure.membership).not.toHaveBeenCalled();
    expect(infrastructure.employees).not.toHaveBeenCalled();
    expect(infrastructure.overview).not.toHaveBeenCalled();
  });
});
describe('A1.2 PLANNING current authenticated surface', () => {
  it('real layout rejects before protected shell continuation', async () => {
    await expect(
      AuthenticatedLayout({ children: 'PLANNING_SENTINEL' }),
    ).rejects.toThrow('REDIRECT:/connexion');
    expect(infrastructure.findSession).toHaveBeenCalledExactlyOnceWith(token);
    expect(infrastructure.listAvailableTenants).not.toHaveBeenCalled();
    expect(infrastructure.frame).not.toHaveBeenCalled();
  });
  it('keeps the current Planning placeholder and no Planning operation inventory', () => {
    const root = resolve(process.cwd(), 'src');
    const files = (dir: string): string[] =>
      readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
        e.isDirectory() ? files(resolve(dir, e.name)) : [resolve(dir, e.name)],
      );
    const planning = files(root).filter((p) => /[\\/]planning[\\/]/.test(p));
    expect(planning).toEqual([
      resolve(root, 'app/(authenticated)/equipe/planning/page.tsx'),
    ]);
    const page = readFileSync(planning[0]!, 'utf8');
    expect(page).toContain('<PlannedBackofficePage');
    expect(page).not.toMatch(/continuation|pointage|use server|Authorization/i);
    const layout = readFileSync(
      resolve(root, 'app/(authenticated)/layout.tsx'),
      'utf8',
    );
    expect(layout).toContain('await requireAuthenticatedTenant()');
  });
});
