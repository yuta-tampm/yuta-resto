import { randomBytes } from 'node:crypto';
import {
  createPointageCredentialVerifier,
  createPointageLookupDigest,
  derivePointageCredentialKeys,
} from '@yuta/auth';
import type { PointageRepository } from '@yuta/db-cloud';
import {
  resolveAuthenticatedTenant,
  TenantError,
  type TenantContext,
} from '@yuta/tenant';
import { describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));
import {
  POINTAGE_OPERATIONS,
  PointageAuthorizationError,
  createPointageManagerContext,
  createPointageEmployeeContext,
  requirePointageManagerOperation,
  type PointageEmployeeOperation,
  type VerifiedPointageCredential,
} from '../src/server/pointage/authorization';
import {
  createPointageServerFoundation,
  type TrustedPointageClientAddressProvider,
} from '../src/server/pointage/service';

const encodedSecret = randomBytes(32).toString('base64url');
const scope = Object.freeze({
  organizationId: '11111111-1111-4111-8111-111111111111',
  establishmentId: '22222222-2222-4222-8222-222222222222',
  locale: 'fr-FR',
  timezone: 'Europe/Paris',
});
const session = Object.freeze({
  id: 'session',
  userId: '33333333-3333-4333-8333-333333333333',
  userName: 'Manager',
  userEmail: 'manager@example.test',
  systemRole: null,
  organizationId: scope.organizationId,
  establishmentId: scope.establishmentId,
  expiresAt: new Date('2030-01-01T00:00:00Z'),
});

function tenant(role: 'OWNER' | 'MANAGER' | 'STAFF'): TenantContext {
  return Object.freeze({
    organizationId: scope.organizationId,
    establishmentId: scope.establishmentId,
    actor: Object.freeze({
      type: 'user' as const,
      userId: session.userId,
      membershipId: '44444444-4444-4444-8444-444444444444',
      role,
    }),
    locale: 'fr-FR',
    timezone: 'Europe/Paris',
    entitlements: new Set<string>(),
  });
}

const trustedProvider: TrustedPointageClientAddressProvider = {
  async getTrustedClientAddress() {
    return { address: '203.0.113.8', provenance: 'SERVER_VERIFIED' };
  },
};

function repository(
  overrides: Partial<PointageRepository> = {},
): PointageRepository {
  return {
    resolveActiveEntryScope: vi.fn(async () => scope),
    findCredentialCandidate: vi.fn(async () => null),
    findPersonnelEmploymentPeriod: vi.fn(async () => ({
      personnelDossierId: '55555555-5555-4555-8555-555555555555',
      entryDate: '2026-01-01',
      departureDate: null,
    })),
    isRateLimitBlocked: vi.fn(async () => false),
    recordRateLimitFailure: vi.fn(async () => ({
      blocked: false,
      failureCount: 1,
    })),
    resetCandidateRateLimit: vi.fn(async () => undefined),
    appendAudit: vi.fn(async () => undefined),
    issueCredential: vi.fn(async (command) => {
      await command.createMaterial(1);
      return {
        credentialId: '66666666-6666-7666-8666-666666666666',
        credentialVersion: 1,
      };
    }),
    resetCredential: vi.fn(async (command) => {
      await command.createMaterial(2);
      return {
        credentialId: '77777777-7777-7777-8777-777777777777',
        credentialVersion: 2,
        supersededCredentialId: '66666666-6666-4666-8666-666666666666',
      };
    }),
    ...overrides,
  } as PointageRepository;
}

describe('Pointage closed authority catalog', () => {
  it('contains exactly three employee and three manager operations', () => {
    expect(POINTAGE_OPERATIONS).toEqual([
      'pointage.employee.identify',
      'pointage.employee.state.read',
      'pointage.employee.operation.create',
      'pointage.establishment.read',
      'pointage.credential.issue',
      'pointage.credential.reset',
    ]);
  });

  it.each(['OWNER', 'MANAGER'] as const)(
    'grants dedicated scoped manager authority to %s',
    (role) => {
      const context = createPointageManagerContext({
        session,
        tenant: tenant(role),
        operation: 'pointage.credential.issue',
      });
      expect(context).toMatchObject({
        actorType: 'POINTAGE_MANAGER',
        role,
        organizationId: scope.organizationId,
        establishmentId: scope.establishmentId,
      });
      expect(Object.isFrozen(context)).toBe(true);
      expect(() =>
        requirePointageManagerOperation(context, 'pointage.credential.reset'),
      ).toThrow(PointageAuthorizationError);
    },
  );

  it('denies STAFF, unknown operations and mismatched validated scope', () => {
    expect(() =>
      createPointageManagerContext({
        session,
        tenant: tenant('STAFF'),
        operation: 'pointage.credential.issue',
      }),
    ).toThrow(PointageAuthorizationError);
    expect(() =>
      createPointageEmployeeContext({
        credential: {
          proofType: 'VERIFIED_POINTAGE_CREDENTIAL',
          organizationId: scope.organizationId,
          establishmentId: scope.establishmentId,
          personnelDossierId: '55555555-5555-4555-8555-555555555555',
          credentialId: '66666666-6666-4666-8666-666666666666',
          credentialVersion: 1,
        },
        operation: 'pointage.credential.issue' as never,
      }),
    ).toThrow(PointageAuthorizationError);
    expect(() =>
      createPointageManagerContext({
        session,
        tenant: tenant('OWNER'),
        operation: 'personnel.employee.manage',
      }),
    ).toThrow(PointageAuthorizationError);
    expect(() =>
      createPointageManagerContext({
        session: { ...session, establishmentId: 'foreign' },
        tenant: tenant('OWNER'),
        operation: 'pointage.establishment.read',
      }),
    ).toThrow(PointageAuthorizationError);
  });

  it.each(['missing', 'suspended'] as const)(
    'cannot compose manager authority when membership is %s',
    async (membershipState) => {
      await expect(
        resolveAuthenticatedTenant({
          userId: session.userId,
          organizationId: scope.organizationId,
          establishmentId: scope.establishmentId,
          membershipLookup: {
            async findActiveMembership() {
              return membershipState === 'missing'
                ? null
                : {
                    membershipId: '44444444-4444-4444-8444-444444444444',
                    userId: session.userId,
                    organizationId: scope.organizationId,
                    establishmentId: scope.establishmentId,
                    role: 'OWNER' as const,
                    status: 'suspended' as const,
                  };
            },
          },
          tenantMetadata: {
            locale: scope.locale,
            timezone: scope.timezone,
            entitlements: [],
          },
        }),
      ).rejects.toBeInstanceOf(TenantError);
    },
  );
});

describe('Pointage server foundation', () => {
  it('fails composition closed without secret or a trusted-address provider', () => {
    expect(() =>
      createPointageServerFoundation({
        repository: repository(),
        encodedAuthSecret: 'invalid',
        clientAddressProvider: trustedProvider,
      }),
    ).toThrow();
    expect(() =>
      createPointageServerFoundation({
        repository: repository(),
        encodedAuthSecret: encodedSecret,
        clientAddressProvider: null as never,
      }),
    ).toThrow('Trusted Pointage client-address provider is required.');
  });

  it('records minimized attribution when trusted manager composition is denied', async () => {
    const appendAudit = vi.fn(async () => undefined);
    const foundation = createPointageServerFoundation({
      repository: repository({ appendAudit }),
      encodedAuthSecret: encodedSecret,
      clientAddressProvider: trustedProvider,
    });
    await expect(
      foundation.authorizeManagerOperation({
        session,
        tenant: tenant('STAFF'),
        operation: 'pointage.credential.issue',
      }),
    ).resolves.toBeNull();
    expect(appendAudit).toHaveBeenCalledWith(
      expect.objectContaining({
        eventType: 'pointage.authorization.denied',
        outcome: 'denied',
        reasonCode: 'operation_not_granted',
        managerUserId: session.userId,
        requestedOperation: 'pointage.credential.issue',
      }),
    );
  });

  it('refuses untrusted provenance before credential processing', async () => {
    const findCredentialCandidate = vi.fn(async () => null);
    const foundation = createPointageServerFoundation({
      repository: repository({ findCredentialCandidate }),
      encodedAuthSecret: encodedSecret,
      clientAddressProvider: {
        async getTrustedClientAddress() {
          return null;
        },
      },
    });
    await expect(
      foundation.validateCredential({
        establishmentSlug: 'restaurant',
        credential: '12345678',
      }),
    ).resolves.toEqual({ status: 'POINTAGE_UNAVAILABLE' });
    expect(findCredentialCandidate).not.toHaveBeenCalled();
  });

  it('returns only generic invalid results for malformed and unknown candidates', async () => {
    const repo = repository();
    const foundation = createPointageServerFoundation({
      repository: repo,
      encodedAuthSecret: encodedSecret,
      clientAddressProvider: trustedProvider,
    });
    for (const credential of ['bad', '12345678']) {
      await expect(
        foundation.validateCredential({
          establishmentSlug: 'restaurant',
          credential,
        }),
      ).resolves.toEqual({ status: 'POINTAGE_CREDENTIAL_INVALID' });
    }
    expect(repo.recordRateLimitFailure).toHaveBeenCalledTimes(4);
  });

  it('maps distributed blocking and repository failure to generic public outcomes', async () => {
    const blocked = createPointageServerFoundation({
      repository: repository({
        isRateLimitBlocked: vi.fn(async (_scope, kind) => kind === 'client'),
      }),
      encodedAuthSecret: encodedSecret,
      clientAddressProvider: trustedProvider,
    });
    await expect(
      blocked.validateCredential({
        establishmentSlug: 'restaurant',
        credential: '12345678',
      }),
    ).resolves.toEqual({ status: 'POINTAGE_TRY_LATER' });

    const unavailable = createPointageServerFoundation({
      repository: repository({
        resolveActiveEntryScope: vi.fn(async () => {
          throw new Error('database unavailable');
        }),
      }),
      encodedAuthSecret: encodedSecret,
      clientAddressProvider: trustedProvider,
    });
    await expect(
      unavailable.validateCredential({
        establishmentSlug: 'restaurant',
        credential: '12345678',
      }),
    ).resolves.toEqual({ status: 'POINTAGE_UNAVAILABLE' });
  });

  it('separates verified identity proof from employee authority', async () => {
    const credential = '12345678';
    const keys = derivePointageCredentialKeys(
      Buffer.from(encodedSecret, 'base64url'),
    );
    const stored = await createPointageCredentialVerifier(keys, credential);
    const lookupDigest = createPointageLookupDigest(keys, scope, credential);
    const repo = repository({
      findCredentialCandidate: vi.fn(async (_scope, digest) =>
        digest === lookupDigest
          ? {
              id: '66666666-6666-4666-8666-666666666666',
              personnelDossierId: '55555555-5555-4555-8555-555555555555',
              credentialVersion: 1,
              credentialFormatVersion: 1,
              algorithmVersion: 'scrypt-v1',
              keyVersion: 1,
              salt: stored.salt,
              verifier: stored.verifier,
              supersededAt: null,
            }
          : null,
      ),
    });
    const foundation = createPointageServerFoundation({
      repository: repo,
      encodedAuthSecret: encodedSecret,
      clientAddressProvider: trustedProvider,
    });
    const result = await foundation.validateCredential({
      establishmentSlug: 'restaurant',
      credential,
    });
    expect(result.status).toBe('VERIFIED');
    if (result.status !== 'VERIFIED')
      throw new Error('Expected credential proof.');
    expect(result.credential.proofType).toBe('VERIFIED_POINTAGE_CREDENTIAL');
    expect(result.credential).not.toHaveProperty('operation');
    expect(repo.resetCandidateRateLimit).toHaveBeenCalledOnce();
  });

  it('rejects a superseded credential with the same public shape as an unknown credential', async () => {
    const keys = derivePointageCredentialKeys(
      Buffer.from(encodedSecret, 'base64url'),
    );
    const stored = await createPointageCredentialVerifier(keys, '12345678');
    const foundation = createPointageServerFoundation({
      repository: repository({
        findCredentialCandidate: vi.fn(async () => ({
          id: '66666666-6666-4666-8666-666666666666',
          personnelDossierId: '55555555-5555-4555-8555-555555555555',
          credentialVersion: 1,
          credentialFormatVersion: 1,
          algorithmVersion: 'scrypt-v1',
          keyVersion: 1,
          salt: stored.salt,
          verifier: stored.verifier,
          supersededAt: new Date('2026-01-01T00:00:00Z'),
        })),
      }),
      encodedAuthSecret: encodedSecret,
      clientAddressProvider: trustedProvider,
    });
    await expect(
      foundation.validateCredential({
        establishmentSlug: 'restaurant',
        credential: '12345678',
      }),
    ).resolves.toEqual({ status: 'POINTAGE_CREDENTIAL_INVALID' });
  });

  it('rejects an unsupported credential version through the generic path', async () => {
    const keys = derivePointageCredentialKeys(
      Buffer.from(encodedSecret, 'base64url'),
    );
    const stored = await createPointageCredentialVerifier(keys, '12345678');
    const foundation = createPointageServerFoundation({
      repository: repository({
        findCredentialCandidate: vi.fn(async () => ({
          id: '66666666-6666-4666-8666-666666666666',
          personnelDossierId: '55555555-5555-4555-8555-555555555555',
          credentialVersion: 1,
          credentialFormatVersion: 2,
          algorithmVersion: 'future-algorithm',
          keyVersion: 2,
          salt: stored.salt,
          verifier: stored.verifier,
          supersededAt: null,
        })),
      }),
      encodedAuthSecret: encodedSecret,
      clientAddressProvider: trustedProvider,
    });
    await expect(
      foundation.validateCredential({
        establishmentSlug: 'restaurant',
        credential: '12345678',
      }),
    ).resolves.toEqual({ status: 'POINTAGE_CREDENTIAL_INVALID' });
  });

  it.each([
    'pointage.employee.identify',
    'pointage.employee.state.read',
    'pointage.employee.operation.create',
  ] as const)(
    'applies the inclusive Personnel lifecycle guard to %s',
    async (operation) => {
      const verified: VerifiedPointageCredential = Object.freeze({
        proofType: 'VERIFIED_POINTAGE_CREDENTIAL',
        organizationId: scope.organizationId,
        establishmentId: scope.establishmentId,
        personnelDossierId: '55555555-5555-4555-8555-555555555555',
        credentialId: '66666666-6666-4666-8666-666666666666',
        credentialVersion: 1,
      });
      const cases = [
        ['2025-12-31T12:00:00Z', false],
        ['2026-01-01T12:00:00Z', true],
        ['2026-01-15T12:00:00Z', true],
        ['2026-01-31T12:00:00Z', true],
        ['2026-02-01T12:00:00Z', false],
      ] as const;
      for (const [instant, eligible] of cases) {
        const foundation = createPointageServerFoundation({
          repository: repository({
            findPersonnelEmploymentPeriod: vi.fn(async () => ({
              personnelDossierId: verified.personnelDossierId,
              entryDate: '2026-01-01',
              departureDate: '2026-01-31',
            })),
          }),
          encodedAuthSecret: encodedSecret,
          clientAddressProvider: trustedProvider,
          now: () => new Date(instant),
        });
        const context = await foundation.authorizeEmployeeOperation({
          credential: verified,
          entryScope: scope,
          operation: operation as PointageEmployeeOperation,
        });
        expect(context !== null).toBe(eligible);
        if (context !== null) {
          expect(context.operation).toBe(operation);
          expect(Object.isFrozen(context)).toBe(true);
        }
      }
    },
  );

  it('derives the current business date from the trusted establishment timezone', async () => {
    const verified: VerifiedPointageCredential = Object.freeze({
      proofType: 'VERIFIED_POINTAGE_CREDENTIAL',
      organizationId: scope.organizationId,
      establishmentId: scope.establishmentId,
      personnelDossierId: '55555555-5555-4555-8555-555555555555',
      credentialId: '66666666-6666-4666-8666-666666666666',
      credentialVersion: 1,
    });
    const foundation = createPointageServerFoundation({
      repository: repository({
        findPersonnelEmploymentPeriod: vi.fn(async () => ({
          personnelDossierId: verified.personnelDossierId,
          entryDate: '2026-01-01',
          departureDate: null,
        })),
      }),
      encodedAuthSecret: encodedSecret,
      clientAddressProvider: trustedProvider,
      now: () => new Date('2025-12-31T23:30:00Z'),
    });
    await expect(
      foundation.authorizeEmployeeOperation({
        credential: verified,
        entryScope: scope,
        operation: 'pointage.employee.identify',
      }),
    ).resolves.toMatchObject({ operation: 'pointage.employee.identify' });
  });

  it('keeps issue/reset independent from employment dates and returns plaintext only after repository success', async () => {
    const findPersonnelEmploymentPeriod = vi.fn(async () => null);
    const repo = repository({ findPersonnelEmploymentPeriod });
    const issuedManager = createPointageManagerContext({
      session,
      tenant: tenant('OWNER'),
      operation: 'pointage.credential.issue',
    });
    const resetManager = createPointageManagerContext({
      session,
      tenant: tenant('MANAGER'),
      operation: 'pointage.credential.reset',
    });
    const foundation = createPointageServerFoundation({
      repository: repo,
      encodedAuthSecret: encodedSecret,
      clientAddressProvider: trustedProvider,
      generateCredential: () => '12345678',
    });
    await expect(
      foundation.issueCredential({
        manager: issuedManager,
        personnelDossierId: '55555555-5555-4555-8555-555555555555',
      }),
    ).resolves.toMatchObject({
      presentationType: 'ONE_TIME_POINTAGE_CREDENTIAL',
      credential: '12345678',
      credentialVersion: 1,
    });
    await expect(
      foundation.resetCredential({
        manager: resetManager,
        personnelDossierId: '55555555-5555-4555-8555-555555555555',
      }),
    ).resolves.toMatchObject({ credential: '12345678', credentialVersion: 2 });
    expect(findPersonnelEmploymentPeriod).not.toHaveBeenCalled();
    expect(Object.keys(foundation).sort()).toEqual([
      'authorizeEmployeeOperation',
      'authorizeManagerOperation',
      'issueCredential',
      'resetCredential',
      'validateCredential',
    ]);
  });

  it('never returns a generated credential when persistence fails', async () => {
    const foundation = createPointageServerFoundation({
      repository: repository({
        issueCredential: vi.fn(async (command) => {
          await command.createMaterial(1);
          throw new Error('audit write failed');
        }),
      }),
      encodedAuthSecret: encodedSecret,
      clientAddressProvider: trustedProvider,
      generateCredential: () => '12345678',
    });
    const manager = createPointageManagerContext({
      session,
      tenant: tenant('OWNER'),
      operation: 'pointage.credential.issue',
    });
    await expect(
      foundation.issueCredential({
        manager,
        personnelDossierId: '55555555-5555-4555-8555-555555555555',
      }),
    ).rejects.toThrow('audit write failed');
  });

  it('audits an exact lifecycle grant denial without running the command', async () => {
    const appendAudit = vi.fn(async () => undefined);
    const resetCredential = vi.fn(repository().resetCredential);
    const foundation = createPointageServerFoundation({
      repository: repository({ appendAudit, resetCredential }),
      encodedAuthSecret: encodedSecret,
      clientAddressProvider: trustedProvider,
    });
    const issueOnlyManager = createPointageManagerContext({
      session,
      tenant: tenant('OWNER'),
      operation: 'pointage.credential.issue',
    });
    await expect(
      foundation.resetCredential({
        manager: issueOnlyManager,
        personnelDossierId: '55555555-5555-4555-8555-555555555555',
      }),
    ).rejects.toBeInstanceOf(PointageAuthorizationError);
    expect(resetCredential).not.toHaveBeenCalled();
    expect(appendAudit).toHaveBeenCalledWith(
      expect.objectContaining({
        eventType: 'pointage.authorization.denied',
        outcome: 'denied',
        reasonCode: 'operation_not_granted',
        requestedOperation: 'pointage.credential.reset',
      }),
    );
  });
});
