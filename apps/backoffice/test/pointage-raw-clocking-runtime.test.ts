import { beforeEach, describe, expect, it, vi } from 'vitest';
vi.mock('server-only', () => ({}));
const calls = vi.hoisted(() => ({
  foundationProof: vi.fn(),
  rawProof: vi.fn(),
  repository: vi.fn(),
  rawRepository: vi.fn(),
  foundation: vi.fn(),
  service: vi.fn(),
  consumer: vi.fn(),
  validation: {
    resolveActiveEntryScope: vi.fn(),
    findCredentialCandidate: vi.fn(),
    findPersonnelEmploymentPeriod: vi.fn(),
    isRateLimitBlocked: vi.fn(),
    recordRateLimitFailure: vi.fn(),
    resetCandidateRateLimit: vi.fn(),
    appendAudit: vi.fn(),
  },
}));
vi.mock('@yuta/db-cloud', () => ({
  assertPointageFoundationDatabaseBoundary: calls.foundationProof,
  assertPointageRawDatabaseBoundary: calls.rawProof,
  createPointageRepository: calls.repository,
  createPointageRawClockingRepository: calls.rawRepository,
}));
vi.mock('../src/server/pointage/service', () => ({
  createPointageServerFoundation: calls.foundation,
}));
vi.mock('../src/server/pointage/raw-clocking-service', () => ({
  createPointageRawClockingService: calls.service,
}));
vi.mock('../src/server/pointage/raw-clocking-bootstrap', () => ({
  getPointageRawClockingConsumer: calls.consumer,
}));
import {
  createPointageCandidateRateLimitDigest,
  createPointageClientRateLimitDigest,
  createPointageLookupDigest,
  derivePointageCredentialKeys,
} from '@yuta/auth';
import type { CloudDatabaseClient } from '@yuta/db-cloud';
import { createPointageRawClockingRuntime } from '../src/server/pointage/raw-clocking-runtime';
import { handlePointageRawClockingRequest } from '../src/server/pointage/raw-clocking-http';

const name = 'yuta_pointage_raw_clocking_test_s9';
const foundationRole = 'yuta_pointage_foundation_runtime';
const rawRole = 'yuta_pointage_raw_writer';
const methods = [
  'resolveActiveEntryScope',
  'findCredentialCandidate',
  'findPersonnelEmploymentPeriod',
  'isRateLimitBlocked',
  'recordRateLimitFailure',
  'resetCandidateRateLimit',
  'appendAudit',
];
const environment = {
  NODE_ENV: 'test' as 'test' | 'development' | 'production',
  YUTA_POINTAGE_SYNTHETIC_TEST_MODE: 'true',
  POINTAGE_TEST_ORIGIN: 'http://127.0.0.1:3001',
  CLOUD_DATABASE_URL: `postgres://test:synthetic@127.0.0.1:56541/${name}`,
};
function client(role: string) {
  const query = Object.assign(
    vi.fn(async () => [{ database: name, session: role, current: role }]),
    {
      options: {
        host: ['127.0.0.1'],
        port: [56541],
        database: name,
        user: role,
        max: 1,
        path: undefined as string | undefined,
      },
    },
  );
  return { $client: query };
}
function setup() {
  const foundation = client(foundationRole),
    raw = client(rawRole);
  const provider = vi.fn(() => ({
    getTrustedClientAddress: vi.fn(async () => ({
      address: '127.0.0.1',
      provenance: 'SERVER_VERIFIED' as const,
    })),
  }));
  return {
    foundation,
    raw,
    provider,
    input: {
      environment: { ...environment },
      listeningHost: '127.0.0.1',
      foundationClient: foundation as unknown as CloudDatabaseClient,
      rawClient: raw as unknown as CloudDatabaseClient,
      encodedAuthSecret: 'synthetic-not-used-by-mocked-constructor',
      stateGuardKey: new Uint8Array(32),
      createSyntheticClientAddressProvider: provider,
    },
  };
}
beforeEach(() => {
  vi.resetAllMocks();
  calls.foundationProof.mockResolvedValue(undefined);
  calls.rawProof.mockResolvedValue(undefined);
  calls.repository.mockReturnValue({
    ...calls.validation,
    issueCredential: vi.fn(),
    resetCredential: vi.fn(),
  });
  calls.foundation.mockReturnValue({
    validateCredential: vi.fn(),
    authorizeEmployeeOperation: vi.fn(),
    issueCredential: vi.fn(),
    resetCredential: vi.fn(),
  });
  calls.rawRepository.mockReturnValue({ marker: 'raw' });
  calls.service.mockReturnValue(Object.freeze({ marker: 'service' }));
});

function expectNoProviderFallback() {
  expect(calls.repository).not.toHaveBeenCalled();
  expect(calls.rawRepository).not.toHaveBeenCalled();
  expect(calls.foundation).not.toHaveBeenCalled();
  expect(calls.service).not.toHaveBeenCalled();
  for (const method of Object.values(calls.validation)) {
    expect(method).not.toHaveBeenCalled();
  }
}

describe('D1a/S9 dual-client admission ordering', () => {
  it('proves both actual clients before provider/hash/lookup and exposes only employee validation', async () => {
    const s = setup();
    expect(await createPointageRawClockingRuntime(s.input)).toEqual({
      marker: 'service',
      context: expect.any(Function),
    });
    expect(s.foundation.$client).toHaveBeenCalledTimes(2);
    expect(s.raw.$client).toHaveBeenCalledTimes(1);
    const order = [
      s.foundation.$client.mock.invocationCallOrder[1],
      s.raw.$client.mock.invocationCallOrder[0],
      calls.foundationProof.mock.invocationCallOrder[0],
      calls.rawProof.mock.invocationCallOrder[0],
      s.provider.mock.invocationCallOrder[0],
      calls.foundation.mock.invocationCallOrder[0],
    ];
    expect(order).toEqual([...order].sort((a, b) => a! - b!));
    expect(calls.repository).toHaveBeenCalledWith(s.foundation);
    expect(calls.rawRepository).toHaveBeenCalledWith(s.raw);
    expect(Object.keys(calls.foundation.mock.calls[0]![0].repository)).toEqual(
      methods,
    );
    expect(Object.keys(calls.service.mock.calls[0]![0].foundation)).toEqual([
      'validateCredential',
      'authorizeEmployeeOperation',
    ]);
  });

  const cases: Array<[string, (s: ReturnType<typeof setup>) => void]> = [
    [
      'missing foundation',
      (s) => {
        s.input.foundationClient = undefined as unknown as CloudDatabaseClient;
      },
    ],
    [
      'missing raw',
      (s) => {
        s.input.rawClient = undefined as unknown as CloudDatabaseClient;
      },
    ],
    [
      'swapped',
      (s) => {
        [s.input.foundationClient, s.input.rawClient] = [
          s.input.rawClient,
          s.input.foundationClient,
        ];
      },
    ],
    [
      'other raw database',
      (s) => {
        s.raw.$client.options.database = name + '_other';
      },
    ],
    [
      'C17 source',
      (s) => {
        s.foundation.$client.options.database =
          'yuta_pointage_foundation_test_s9';
      },
    ],
    [
      'other host',
      (s) => {
        s.raw.$client.options.host = ['localhost'];
      },
    ],
    [
      'other port',
      (s) => {
        s.raw.$client.options.port = [56542];
      },
    ],
    [
      'multiple hosts',
      (s) => {
        s.raw.$client.options.host.push('127.0.0.1');
      },
    ],
    [
      'socket',
      (s) => {
        s.raw.$client.options.path = '/tmp/postgres';
      },
    ],
    [
      'admin foundation',
      (s) => {
        s.foundation.$client.options.user = 'postgres';
      },
    ],
    [
      'admin raw',
      (s) => {
        s.raw.$client.options.user = 'postgres';
      },
    ],
    [
      'unsafe environment',
      (s) => {
        s.input.environment.NODE_ENV = 'production';
      },
    ],
    [
      'unsafe bind',
      (s) => {
        s.input.listeningHost = '0.0.0.0';
      },
    ],
    [
      'unsafe target',
      (s) => {
        s.input.environment.CLOUD_DATABASE_URL =
          environment.CLOUD_DATABASE_URL.replace(name, 'yuta_cloud');
      },
    ],
    [
      'probe failure',
      (s) => {
        s.foundation.$client.mockRejectedValue(
          new Error('private connection detail'),
        );
      },
    ],
    [
      'wrong actual database',
      (s) => {
        s.raw.$client.mockResolvedValue([
          { database: name + '_other', session: rawRole, current: rawRole },
        ]);
      },
    ],
    [
      'C17 actual database',
      (s) => {
        s.raw.$client.mockResolvedValue([
          {
            database: 'yuta_pointage_foundation_test_s9',
            session: rawRole,
            current: rawRole,
          },
        ]);
      },
    ],
    [
      'SET ROLE raw identity',
      (s) => {
        s.raw.$client.mockResolvedValue([
          { database: name, session: 'postgres', current: rawRole },
        ]);
      },
    ],
    [
      'foundation identity mismatch',
      (s) => {
        s.foundation.$client.mockResolvedValue([
          { database: name, session: foundationRole, current: 'postgres' },
        ]);
      },
    ],
  ];
  it.each(cases)(
    '%s refuses before provider or credential construction',
    async (_, mutate) => {
      const s = setup();
      mutate(s);
      await expect(createPointageRawClockingRuntime(s.input)).rejects.toThrow(
        'Pointage runtime is unavailable.',
      );
      expect(s.provider).not.toHaveBeenCalled();
      expect(calls.repository).not.toHaveBeenCalled();
      expect(calls.foundation).not.toHaveBeenCalled();
    },
  );
  it.each(['foundation', 'raw'])(
    '%s effective-proof failure cannot fall back',
    async (role) => {
      const s = setup();
      (role === 'foundation'
        ? calls.foundationProof
        : calls.rawProof
      ).mockRejectedValue(new Error('private ACL detail'));
      await expect(createPointageRawClockingRuntime(s.input)).rejects.toThrow(
        'Pointage runtime is unavailable.',
      );
      expect(s.provider).not.toHaveBeenCalled();
      expect(calls.foundation).not.toHaveBeenCalled();
    },
  );
  it('missing/untrusted provider refuses before credential key construction', async () => {
    const s = setup();
    s.provider.mockReturnValue({
      getTrustedClientAddress: vi.fn(async () => null),
    } as unknown as ReturnType<typeof s.provider>);
    await expect(createPointageRawClockingRuntime(s.input)).rejects.toThrow(
      'Pointage runtime is unavailable.',
    );
    expect(calls.foundationProof).toHaveBeenCalledTimes(1);
    expect(calls.rawProof).toHaveBeenCalledTimes(1);
    expect(s.provider).toHaveBeenCalledTimes(1);
    expectNoProviderFallback();
  });
  it.each([
    'yuta_cloud',
    'yuta_resto',
    'yuta_pointage_foundation_test',
    name + '\n',
    name + ' ',
    'prefix_' + name,
    name.toUpperCase(),
    name + '_suffix',
    'yuta_pointage_raw_clocking_test_',
    'yuta_pointage_raw_clocking_test%5fs9',
  ])(
    'rejects unsafe target name %j without database or provider work',
    async (bad) => {
      const s = setup();
      s.input.environment.CLOUD_DATABASE_URL =
        environment.CLOUD_DATABASE_URL.replace(name, bad);
      await expect(createPointageRawClockingRuntime(s.input)).rejects.toThrow(
        'Pointage runtime is unavailable.',
      );
      expect(s.foundation.$client).not.toHaveBeenCalled();
      expect(s.provider).not.toHaveBeenCalled();
    },
  );
  it('missing provider factory is unavailable without credential construction', async () => {
    const s = setup();
    s.input.createSyntheticClientAddressProvider =
      undefined as unknown as typeof s.provider;
    await expect(createPointageRawClockingRuntime(s.input)).rejects.toThrow(
      'Pointage runtime is unavailable.',
    );
    expectNoProviderFallback();
  });

  it('A7.1/R12.1 HTTP forwarding headers cannot override trusted provider or limiter identity', async () => {
    // Real admission factory, HTTP adapter, service and credential foundation;
    // only database operations/bootstrap publication are injected unit doubles.
    const { createPointageServerFoundation } = await vi.importActual<
      typeof import('../src/server/pointage/service')
    >('../src/server/pointage/service');
    const { createPointageRawClockingService } = await vi.importActual<
      typeof import('../src/server/pointage/raw-clocking-service')
    >('../src/server/pointage/raw-clocking-service');
    calls.foundation.mockImplementation(createPointageServerFoundation);
    calls.service.mockImplementation(createPointageRawClockingService);
    const s = setup();
    const secret = Buffer.alloc(32, 7);
    s.input.encodedAuthSecret = secret.toString('base64url');
    const scope = Object.freeze({
      organizationId: '00000000-0000-4000-8000-000000000001',
      establishmentId: '00000000-0000-4000-8000-000000000002',
      timezone: 'UTC',
      locale: 'fr-FR',
    });
    const trusted = Object.freeze({
      address: '127.0.0.1',
      provenance: 'SERVER_VERIFIED' as const,
    });
    const provider = {
      getTrustedClientAddress: vi.fn(async () => trusted),
    };
    s.provider.mockReturnValue(provider);
    const repository = calls.validation;
    repository.resolveActiveEntryScope.mockResolvedValue(scope);
    repository.findCredentialCandidate.mockResolvedValue(null);
    repository.recordRateLimitFailure.mockResolvedValue({
      failureCount: 1,
      blocked: false,
    });
    const rawRepository = {
      findContinuationCandidate: vi.fn(),
      readEstablishmentSnapshot: vi.fn(),
      withDossierTransaction: vi.fn(),
    };
    calls.rawRepository.mockReturnValue(rawRepository);
    const runtime = await createPointageRawClockingRuntime(s.input);
    calls.consumer.mockResolvedValue(runtime);
    expect(provider.getTrustedClientAddress).toHaveBeenCalledExactlyOnceWith();
    expect(calls.foundation.mock.calls[0]![0].clientAddressProvider).toBe(
      provider,
    );
    const keys = derivePointageCredentialKeys(secret);
    const credential = '12345678';
    const clientDigest = createPointageClientRateLimitDigest(
      keys,
      scope,
      trusted.address,
    );
    const candidateDigest = createPointageCandidateRateLimitDigest(
      keys,
      scope,
      credential,
    );
    const forgedAddresses = ['203.0.113.41', '203.0.113.42', '203.0.113.43'];
    for (const address of forgedAddresses) {
      expect(
        createPointageClientRateLimitDigest(keys, scope, address),
      ).not.toBe(clientDigest);
    }
    const variants: Record<string, string>[] = [
      {},
      {
        Forwarded: 'for=' + forgedAddresses[0],
        'X-Forwarded-For': forgedAddresses[1]!,
        'X-Real-IP': forgedAddresses[2]!,
      },
    ];
    for (const blocked of [true, false]) {
      repository.isRateLimitBlocked.mockImplementation(
        async (_scope, kind, digest) =>
          blocked && kind === 'client' && digest === clientDigest,
      );
      for (const extraHeaders of variants) {
        for (const method of Object.values(repository)) method.mockClear();
        provider.getTrustedClientAddress.mockClear();
        const response = await handlePointageRawClockingRequest(
          new Request(
            environment.POINTAGE_TEST_ORIGIN +
              '/api/pointage/synthetic-test/identify',
            {
              method: 'POST',
              headers: {
                Origin: environment.POINTAGE_TEST_ORIGIN,
                'Content-Type': 'application/json',
                ...extraHeaders,
              },
              body: JSON.stringify({ credential }),
            },
          ),
          'synthetic-test',
          'identify',
        );
        expect(response.status).toBe(blocked ? 429 : 403);
        expect(await response.json()).toEqual({
          code: blocked ? 'POINTAGE_TRY_LATER' : 'POINTAGE_ACCESS_DENIED',
        });
        expect(response.headers.has('set-cookie')).toBe(false);
        expect(
          provider.getTrustedClientAddress,
        ).toHaveBeenCalledExactlyOnceWith();
        expect(
          await provider.getTrustedClientAddress.mock.results[0]!.value,
        ).toBe(trusted);
        expect(
          repository.resolveActiveEntryScope,
        ).toHaveBeenCalledExactlyOnceWith('synthetic-test');
        expect(repository.isRateLimitBlocked.mock.calls).toEqual(
          blocked
            ? [[scope, 'client', clientDigest, expect.any(Date)]]
            : [
                [scope, 'client', clientDigest, expect.any(Date)],
                [scope, 'candidate', candidateDigest, expect.any(Date)],
              ],
        );
        if (blocked) {
          expect(repository.findCredentialCandidate).not.toHaveBeenCalled();
          expect(repository.recordRateLimitFailure).not.toHaveBeenCalled();
        } else {
          expect(
            repository.findCredentialCandidate,
          ).toHaveBeenCalledExactlyOnceWith(
            scope,
            createPointageLookupDigest(keys, scope, credential),
          );
          expect(repository.recordRateLimitFailure.mock.calls).toEqual([
            [
              expect.objectContaining({
                scope,
                keyKind: 'candidate',
                keyDigest: candidateDigest,
              }),
            ],
            [
              expect.objectContaining({
                scope,
                keyKind: 'client',
                keyDigest: clientDigest,
              }),
            ],
          ]);
        }
        expect(repository.resetCandidateRateLimit).not.toHaveBeenCalled();
        expect(repository.findPersonnelEmploymentPeriod).not.toHaveBeenCalled();
        expect(repository.appendAudit).toHaveBeenCalledExactlyOnceWith({
          ...scope,
          eventType: blocked
            ? 'pointage.credential.rate_limited'
            : 'pointage.credential.authentication_denied',
          outcome: 'denied',
          reasonCode: blocked ? 'rate_limited' : 'invalid_credential',
          occurredAt: expect.any(Date),
        });
        for (const method of Object.values(rawRepository)) {
          expect(method).not.toHaveBeenCalled();
        }
      }
    }
    expect(s.provider).toHaveBeenCalledTimes(1);
    expect(trusted).toEqual({
      address: '127.0.0.1',
      provenance: 'SERVER_VERIFIED',
    });
    secret.fill(0);
  });
});
