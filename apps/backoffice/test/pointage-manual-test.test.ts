import type { ChildProcess } from 'node:child_process';
import { EventEmitter } from 'node:events';
import { readFileSync, type FSWatcher } from 'node:fs';
import { resolve } from 'node:path';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  assertManualParentEnvironment,
  assertManualReady,
  assertManualTerminal,
  cleanupManualResources,
  coordinateManualPointage,
  createManualEnvironment,
  createManualHandoff,
  generateDistinctManualCredential,
  inspectManualEnvironment,
  manualEnvFiles,
  removeManualContainer,
  sealManualParentEnvironment,
} from '../scripts/pointage-manual-test';
import {
  createPointageManualShadowProfile,
  launchPointageNextChild,
  pointageChildEnvironment,
  pointageManualShadowValues,
  provisionPointageNextFixture,
  type PointageNextFixtureIdentity,
  type PointageNextFixtureResource,
} from './helpers/pointage-raw-clocking-launcher';

const processEffects = vi.hoisted(() => ({
  spawn: vi.fn<
    (command: string, args: readonly string[], options: object) => EventEmitter
  >(() => {
    throw new Error('Unexpected process creation in a pure test.');
  }),
  fork: vi.fn<typeof import('node:child_process').fork>(() => {
    throw new Error('Unexpected process creation in a pure test.');
  }),
}));
const resourceEffects = vi.hoisted(() => ({
  watch: vi.fn<typeof import('node:fs').watch>(() => {
    throw new Error('Unexpected filesystem watcher in a pure test.');
  }),
  createServer: vi.fn<() => object>(() => {
    throw new Error('Unexpected socket creation in a pure test.');
  }),
  openClient: vi.fn(async () => {
    throw new Error('Unexpected database connection in a pure test.');
  }),
}));
vi.mock('node:child_process', async (importOriginal) => ({
  ...(await importOriginal<typeof import('node:child_process')>()),
  spawn: processEffects.spawn,
  fork: processEffects.fork,
}));
vi.mock('node:fs', async (importOriginal) => ({
  ...(await importOriginal<typeof import('node:fs')>()),
  watch: resourceEffects.watch,
}));
vi.mock('node:net', async (importOriginal) => ({
  ...(await importOriginal<typeof import('node:net')>()),
  createServer: resourceEffects.createServer,
}));
vi.mock(
  '../../../packages/db-cloud/test/helpers/pointage-raw-clocking-test-database',
  async (importOriginal) => ({
    ...(await importOriginal<
      typeof import('../../../packages/db-cloud/test/helpers/pointage-raw-clocking-test-database')
    >()),
    openPointageTestClient: resourceEffects.openClient,
  }),
);

const runId = '11111111-1111-4111-8111-111111111111';
const otherRunId = '22222222-2222-4222-8222-222222222222';
const files = Object.fromEntries(
  manualEnvFiles.map((name) => [name, undefined]),
);
const environment = { NODE_ENV: 'test' as const, PATH: 'synthetic-path' };

describe('manual Pointage environment boundary (pure, no child or database)', () => {
  it('imports the CLI without starting Docker or Next', () => {
    expect(processEffects.spawn).not.toHaveBeenCalled();
    expect(processEffects.fork).not.toHaveBeenCalled();
  });

  it('runs the manual command directly in Node so Ctrl+C reaches the owned cleanup handlers', () => {
    const manifest = JSON.parse(
      readFileSync(resolve(__dirname, '../package.json'), 'utf8'),
    ) as {
      scripts: Record<string, string>;
      devDependencies: Record<string, string>;
    };
    expect(manifest.scripts['pointage:manual:test']).toBe(
      'node --import tsx scripts/pointage-manual-test.ts',
    );
    expect(manifest.devDependencies.tsx).toBeTruthy();
  });

  it('inventories all four development env files and relevant process key names only', () => {
    const inventory = inspectManualEnvironment(
      { ...environment, AUTH_SECRET: 'process-value-must-not-appear' },
      {
        ...files,
        '.env.development.local':
          '# synthetic fixture\nAUTH_SECRET=first-private-value\nexport CLOUD_DATABASE_SSL=false\n',
        '.env.local': 'AUTH_SECRET=second-private-value\n',
        '.env.development': '',
      },
    );
    expect(inventory.files.map(({ name }) => name)).toEqual([
      '.env.development.local',
      '.env.local',
      '.env.development',
      '.env',
    ]);
    expect(inventory.files).toContainEqual({
      name: '.env.development.local',
      keys: ['AUTH_SECRET', 'CLOUD_DATABASE_SSL'],
      present: true,
    });
    expect(inventory.files).toContainEqual({
      name: '.env.development',
      keys: [],
      present: true,
    });
    expect(inventory.files).toContainEqual({
      name: '.env',
      keys: [],
      present: false,
    });
    expect(inventory.originalKeys).toContain('AUTH_SECRET');
    expect(JSON.stringify(inventory)).not.toMatch(
      /private-value|must-not-appear/,
    );
  });

  it.each([
    ['production mode', { NODE_ENV: 'production' }],
    ['unknown mode', { NODE_ENV: 'preview' }],
    ['empty mode', { NODE_ENV: '' }],
    ['Vercel marker', { VERCEL: '' }],
    ['CI marker', { CI: 'false' }],
    ['GitHub Actions marker', { GITHUB_ACTIONS: '' }],
    ['Docker host override', { DOCKER_HOST: 'tcp://synthetic.invalid:2375' }],
    ['Docker context override', { DOCKER_CONTEXT: 'default' }],
  ])('rejects %s before sanitization', (_label, patch) => {
    expect(() =>
      createManualEnvironment(
        { ...environment, ...patch } as NodeJS.ProcessEnv,
        files,
      ),
    ).toThrow();
  });

  it('admits absent NODE_ENV only through the explicit manual entrypoint', () => {
    // Next narrows NODE_ENV statically; a fresh CLI process can omit it.
    const absent = {} as NodeJS.ProcessEnv;
    expect(() => pointageChildEnvironment(absent)).toThrow();
    expect(createManualEnvironment(absent, files).environment.NODE_ENV).toBe(
      'development',
    );
    expect(
      createManualEnvironment({ NODE_ENV: 'development' }, files).environment
        .NODE_ENV,
    ).toBe('development');
  });

  it.each(manualEnvFiles)(
    'rejects an unknown application key in %s',
    (name) => {
      expect(() =>
        createManualEnvironment(environment, {
          ...files,
          [name]: 'NEW_PROVIDER_SECRET=synthetic-unreviewed-value\n',
        }),
      ).toThrow();
    },
  );

  it.each([
    'YUTA_NEW_PROVIDER_SECRET',
    'NEXT_PUBLIC_UNREVIEWED_URL',
    'GOOGLE_NEW_CLIENT_SECRET',
  ])('rejects an unreviewed original application key %s', (key) => {
    expect(() =>
      createManualEnvironment({ ...environment, [key]: 'synthetic' }, files),
    ).toThrow();
  });

  it('replaces real-looking inputs with the exact frozen safe profile and retains only OS allowlisted values', () => {
    const original = {
      ...environment,
      AUTH_SECRET: 'unrelated-synthetic-auth-secret',
      CLOUD_DATABASE_URL:
        'postgres://synthetic:synthetic@remote.invalid/yuta_cloud',
      GOOGLE_CLIENT_SECRET: 'unrelated-synthetic-provider-secret',
      RANDOM_UNRELATED_VALUE: 'must-not-be-inherited',
      NODE_OPTIONS: '--require=unreviewed.js',
    };
    const created = createManualEnvironment(original, files);
    const child = pointageChildEnvironment(
      created.environment,
      created.profile,
    );
    expect(Object.isFrozen(created.profile)).toBe(true);
    expect(created.profile).toEqual(pointageManualShadowValues);
    expect(child).toMatchObject(pointageManualShadowValues);
    expect(child.PATH).toBe('synthetic-path');
    expect(child.RANDOM_UNRELATED_VALUE).toBeUndefined();
    expect(child.NODE_OPTIONS).toBeUndefined();
    expect(JSON.stringify(child)).not.toMatch(
      /unrelated-synthetic|remote\.invalid|must-not-be-inherited/,
    );
    expect(child.CLOUD_DATABASE_SSL).toBe('false');
    expect(child.NEXT_PUBLIC_APP_URL).toBe('http://127.0.0.1:3001');
    expect(child.YUTA_PERSONNEL_CONTRACT_EXTRACTION_MODE).toBe(
      'deterministic-synthetic',
    );
    const denyTarget = new URL(child.CLOUD_DATABASE_URL!);
    expect(denyTarget.hostname).toBe('127.0.0.1');
    expect(denyTarget.port).toBe('65431');
    expect(original.AUTH_SECRET).toBe('unrelated-synthetic-auth-secret');
  });

  it('keeps existing launcher callers free of manual shadow settings', () => {
    const child = pointageChildEnvironment({
      ...environment,
      AUTH_SECRET: 'synthetic-discarded',
      CLOUD_DATABASE_URL: 'synthetic-discarded',
      Path: 'case-insensitive-os-path',
    });
    for (const key of Object.keys(pointageManualShadowValues)) {
      expect(child[key]).toBeUndefined();
    }
    expect(child.YUTA_POINTAGE_SYNTHETIC_TEST_MODE).toBe('true');
    expect(child.POINTAGE_TEST_ORIGIN).toBe('http://127.0.0.1:3001');
    expect(child.NEXT_TELEMETRY_DISABLED).toBe('1');
  });

  it.each(['USERPROFILE', 'userprofile'])(
    'preserves only the manual parent Docker context directory from %s',
    (profileKey) => {
      const directory = 'C:\\Users\\SyntheticPointage';
      const original = {
        ...environment,
        [profileKey]: directory,
        APPDATA: 'synthetic-unlisted-appdata',
        DOCKER_CONFIG: 'synthetic-unreviewed-docker-config',
        AUTH_SECRET: 'synthetic-original-auth-secret',
      };
      const created = createManualEnvironment(original, files);
      const withoutDirectory = createManualEnvironment(environment, files);
      expect(created.environment).toEqual({
        ...withoutDirectory.environment,
        USERPROFILE: directory,
      });
      expect(created.profile).toEqual(pointageManualShadowValues);
      const child = pointageChildEnvironment(
        created.environment,
        created.profile,
      );
      expect(child.USERPROFILE).toBeUndefined();
      expect(child.userprofile).toBeUndefined();
      expect(child).toMatchObject(pointageManualShadowValues);
      const defaultChild = pointageChildEnvironment(original);
      expect(defaultChild.USERPROFILE).toBeUndefined();
      expect(defaultChild.userprofile).toBeUndefined();
      expect(
        JSON.stringify([created.environment, child, defaultChild]),
      ).not.toMatch(
        /synthetic-unlisted-appdata|synthetic-unreviewed-docker-config|synthetic-original-auth-secret/,
      );
    },
  );

  it('seals the parent against inherited secrets and unlisted values for reused subprocess helpers', () => {
    const target: NodeJS.ProcessEnv = {
      ...environment,
      AUTH_SECRET: 'synthetic-original-auth-secret',
      CLOUD_DATABASE_URL:
        'postgres://synthetic:synthetic@remote.invalid/yuta_cloud',
      GOOGLE_CLIENT_SECRET: 'synthetic-original-provider-secret',
      OPENAI_API_KEY: 'synthetic-unlisted-secret',
      UNLISTED_PRIVATE_DATA: 'synthetic-unlisted-value',
      NODE_OPTIONS: '--require=unreviewed.js',
    };
    const safe = createManualEnvironment(target, files).environment;
    sealManualParentEnvironment(target, safe);
    expect(target).toEqual(safe);
    expect(target).toMatchObject(pointageManualShadowValues);
    expect(target.PATH).toBe('synthetic-path');
    expect(target.OPENAI_API_KEY).toBeUndefined();
    expect(target.UNLISTED_PRIVATE_DATA).toBeUndefined();
    expect(target.NODE_OPTIONS).toBeUndefined();
    expect(JSON.stringify(target)).not.toMatch(
      /synthetic-original|synthetic-unlisted|remote\.invalid/,
    );
    expect(() => assertManualParentEnvironment(target, safe)).not.toThrow();
  });

  it.each(['added-key', 'changed-shadow', 'deleted-shadow'])(
    'refuses parent environment drift through %s',
    (drift) => {
      const safe = createManualEnvironment(environment, files).environment;
      const target: NodeJS.ProcessEnv = { ...environment };
      sealManualParentEnvironment(target, safe);
      if (drift === 'added-key')
        target.UNLISTED_PRIVATE_DATA = 'synthetic-added-value';
      if (drift === 'changed-shadow')
        target.AUTH_SECRET = 'synthetic-changed-secret';
      if (drift === 'deleted-shadow') delete target.CLOUD_DATABASE_URL;
      expect(() => assertManualParentEnvironment(target, safe)).toThrow(
        'PARENT_ENV_CHANGED',
      );
    },
  );

  it('compares parent environment values independently of property insertion order', () => {
    const safe = createManualEnvironment(environment, files).environment;
    const reordered = Object.fromEntries(
      Object.entries(safe).reverse(),
    ) as NodeJS.ProcessEnv;
    expect(() => assertManualParentEnvironment(reordered, safe)).not.toThrow();
  });

  it.each(Object.keys(pointageManualShadowValues))(
    'rejects missing, empty, undefined or altered shadow %s',
    (key) => {
      const missing: Record<string, unknown> = {
        ...pointageManualShadowValues,
      };
      delete missing[key];
      for (const input of [
        missing,
        ...['', undefined, 'unreviewed-value'].map((value) => ({
          ...pointageManualShadowValues,
          [key]: value,
        })),
      ]) {
        expect(() => createPointageManualShadowProfile(input)).toThrow();
      }
    },
  );

  it('rejects extra shadow keys and structural copies that lack approved profile identity', () => {
    expect(() =>
      createPointageManualShadowProfile({
        ...pointageManualShadowValues,
        UNKNOWN_SECRET: 'synthetic',
      }),
    ).toThrow();
    const approved = createPointageManualShadowProfile(
      pointageManualShadowValues,
    );
    expect(() => pointageChildEnvironment(environment, approved)).not.toThrow();
    expect(() =>
      pointageChildEnvironment(environment, { ...approved }),
    ).toThrow();
  });

  it.each([
    [false, false],
    [false, true],
    [true, false],
  ])(
    'refuses a noninteractive handoff (stdin %s, stdout %s)',
    (input, output) =>
      expect(() => assertManualTerminal(input, output)).toThrow(),
  );
  it('admits only an interactive input and output terminal', () => {
    expect(() => assertManualTerminal(true, true)).not.toThrow();
  });
});

function readyRunning() {
  return {
    child: {
      pid: 123,
      exitCode: null as number | null,
      signalCode: null as string | null,
    },
    statuses: ['LISTENING', 'INITIALIZING', 'READY'].map((stage) => ({
      stage,
      runId,
      childPid: 123,
    })),
    requireValidMessages: vi.fn(),
    requireReconsumerProof: vi.fn(),
  };
}

describe('manual Pointage readiness and one-time handoff (pure)', () => {
  it('requires validated neutral context together with live generation proof', () => {
    const running = readyRunning();
    expect(() =>
      assertManualReady(running, { available: true }, runId),
    ).not.toThrow();
    expect(running.requireValidMessages).toHaveBeenCalled();
    expect(running.requireReconsumerProof).toHaveBeenCalled();
  });

  it.each([
    undefined,
    {},
    { available: false },
    { code: 'POINTAGE_UNAVAILABLE' },
    { available: true, credential: '12345678' },
  ])('rejects missing or non-neutral context %#', (context) =>
    expect(() => assertManualReady(readyRunning(), context, runId)).toThrow(),
  );

  it.each([
    'listener-only',
    'initializing',
    'failed',
    'wrong-generation',
    'wrong-pid',
    'exited',
    'signalled',
  ])('refuses %s even when the context is available', (state) => {
    const running = readyRunning();
    if (state === 'listener-only')
      running.statuses = running.statuses.slice(0, 1);
    if (state === 'initializing')
      running.statuses = running.statuses.slice(0, 2);
    if (state === 'failed')
      running.statuses.push({ stage: 'FAILED', runId, childPid: 123 });
    if (state === 'wrong-generation') running.statuses[2]!.runId = otherRunId;
    if (state === 'wrong-pid') running.statuses[2]!.childPid = 124;
    if (state === 'exited') running.child.exitCode = 0;
    if (state === 'signalled') running.child.signalCode = 'SIGTERM';
    expect(() =>
      assertManualReady(running, { available: true }, runId),
    ).toThrow();
  });

  it.each(['requireValidMessages', 'requireReconsumerProof'] as const)(
    'does not announce readiness when %s rejects',
    (method) => {
      const running = readyRunning();
      running[method].mockImplementation(() => {
        throw new Error('synthetic missing proof');
      });
      expect(() =>
        assertManualReady(running, { available: true }, runId),
      ).toThrow();
    },
  );

  const handoff = () => ({
    runId,
    slug: 'synthetic-next-111111111111411181111111',
    employees: [
      {
        displayName: 'Synthetic One',
        credential: '12345678',
        state: 'NOT_CLOCKED_IN' as const,
        personnelDossierId: runId,
      },
      {
        displayName: 'Synthetic Two',
        credential: '87654321',
        state: 'NOT_CLOCKED_IN' as const,
        personnelDossierId: otherRunId,
      },
    ],
  });

  it('prints two synthetic PINs exactly once with the permitted handoff fields', () => {
    const write = vi.fn<(text: string) => void>();
    const present = createManualHandoff(write);
    present(handoff());
    const output = write.mock.calls.map(([text]) => text).join('');
    expect(output).toContain(
      'http://127.0.0.1:3001/pointage/synthetic-next-111111111111411181111111',
    );
    expect(output).toContain(runId);
    expect(output).toContain('Synthetic One');
    expect(output).toContain('Synthetic Two');
    expect(output.match(/12345678/g)).toHaveLength(1);
    expect(output.match(/87654321/g)).toHaveLength(1);
    expect(output.match(/NOT_CLOCKED_IN/g)).toHaveLength(2);
    expect(output).toContain('Ctrl+C');
    expect(output).not.toMatch(
      /synthetic-db-secret|synthetic-continuation|synthetic-guard/,
    );
    expect(() => present(handoff())).toThrow();
    expect(write.mock.calls.map(([text]) => text).join('')).toBe(output);
  });

  it('refuses secret-bearing extra fields before printing anything', () => {
    const write = vi.fn();
    const value = {
      ...handoff(),
      databaseUrl: 'synthetic-db-secret',
      continuation: 'synthetic-continuation',
      stateGuard: 'synthetic-guard',
    };
    expect(() => createManualHandoff(write)(value)).toThrow();
    expect(write).not.toHaveBeenCalled();
  });

  it.each([
    'same-pin',
    'same-dossier',
    'one-employee',
    'invalid-pin',
    'invalid-slug',
    'invalid-generation',
  ])('prints nothing for %s', (invalid) => {
    const value = handoff();
    if (invalid === 'same-pin')
      value.employees[1]!.credential = value.employees[0]!.credential;
    if (invalid === 'same-dossier')
      value.employees[1]!.personnelDossierId =
        value.employees[0]!.personnelDossierId;
    if (invalid === 'one-employee') value.employees.pop();
    if (invalid === 'invalid-pin') value.employees[0]!.credential = '1234';
    if (invalid === 'invalid-slug') value.slug = '../unrelated';
    if (invalid === 'invalid-generation') value.runId = 'invalid-generation';
    const write = vi.fn();
    expect(() => createManualHandoff(write)(value)).toThrow();
    expect(write).not.toHaveBeenCalled();
  });
});

const startupStages = [
  'preflight',
  'provision',
  'prepare',
  'start',
  'ready',
  'present',
  'waitForStop',
] as const;
function orchestration() {
  const calls: string[] = [];
  const steps = {
    ...Object.fromEntries(
      startupStages.map((stage) => [
        stage,
        vi.fn(async () => {
          calls.push(stage);
        }),
      ]),
    ),
    cleanup: vi.fn(async () => {
      calls.push('cleanup');
    }),
  } as Record<
    (typeof startupStages)[number] | 'cleanup',
    ReturnType<typeof vi.fn<() => Promise<void>>>
  >;
  return { calls, steps, controller: new AbortController() };
}

describe('manual Pointage lifecycle and independent cleanup (pure mocked steps)', () => {
  it('presents credentials after readiness and cleans up after normal stop', async () => {
    const { calls, steps, controller } = orchestration();
    await coordinateManualPointage(steps, controller.signal);
    expect(calls).toEqual([...startupStages, 'cleanup']);
    expect(steps.cleanup).toHaveBeenCalledTimes(1);
  });

  it.each(startupStages)(
    'stops after %s failure and always cleans up',
    async (failed) => {
      const { calls, steps, controller } = orchestration();
      steps[failed].mockImplementation(async () => {
        calls.push(failed);
        throw new Error(`synthetic ${failed} failure`);
      });
      await expect(
        coordinateManualPointage(steps, controller.signal),
      ).rejects.toThrow();
      expect(calls).toEqual([
        ...startupStages.slice(0, startupStages.indexOf(failed) + 1),
        'cleanup',
      ]);
      expect(steps.cleanup).toHaveBeenCalledTimes(1);
      if (startupStages.indexOf(failed) < startupStages.indexOf('present')) {
        expect(steps.present).not.toHaveBeenCalled();
      }
    },
  );

  it.each(startupStages.slice(0, -1))(
    'does not enter the next stage after a stop during %s',
    async (stage) => {
      const { calls, steps, controller } = orchestration();
      steps[stage].mockImplementation(async () => {
        calls.push(stage);
        controller.abort();
      });
      await expect(
        coordinateManualPointage(steps, controller.signal),
      ).rejects.toThrow();
      expect(calls).toEqual([
        ...startupStages.slice(0, startupStages.indexOf(stage) + 1),
        'cleanup',
      ]);
      expect(steps.cleanup).toHaveBeenCalledTimes(1);
    },
  );

  it('performs no startup work when stop was already requested', async () => {
    const { calls, steps, controller } = orchestration();
    controller.abort();
    await expect(
      coordinateManualPointage(steps, controller.signal),
    ).rejects.toThrow();
    expect(calls).toEqual(['cleanup']);
  });

  it('waits for an in-flight provision to settle before cleaning up its resources', async () => {
    const { calls, steps, controller } = orchestration();
    let completeProvision: (() => void) | undefined;
    const started = Promise.withResolvers<void>();
    steps.provision.mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          calls.push('provision');
          completeProvision = resolve;
          started.resolve();
        }),
    );
    const running = coordinateManualPointage(steps, controller.signal);
    const result = expect(running).rejects.toThrow();
    await started.promise;
    controller.abort();
    expect(steps.cleanup).not.toHaveBeenCalled();
    completeProvision!();
    await result;
    expect(calls).toEqual(['preflight', 'provision', 'cleanup']);
    expect(steps.start).not.toHaveBeenCalled();
  });

  it('does not hide a cleanup failure after a successful session', async () => {
    const { steps, controller } = orchestration();
    steps.cleanup.mockRejectedValue(new Error('synthetic cleanup failure'));
    await expect(
      coordinateManualPointage(steps, controller.signal),
    ).rejects.toThrow();
  });

  it('reports both startup and cleanup failures without disclosing raw errors', async () => {
    const { steps, controller } = orchestration();
    steps.start.mockRejectedValue(new Error('synthetic-startup-secret'));
    steps.cleanup.mockRejectedValue(new Error('synthetic-cleanup-secret'));
    const result = coordinateManualPointage(steps, controller.signal);
    await expect(result).rejects.toThrow('STARTUP_FAILED_AND_CLEANUP_FAILED');
    await expect(result.catch(String)).resolves.not.toMatch(
      /synthetic-startup-secret|synthetic-cleanup-secret/,
    );
  });

  const cleanupStages = [
    'stopChild',
    'closeClient',
    'removeContainer',
    'checkPort',
  ] as const;
  it.each(cleanupStages)(
    'continues owned cleanup after %s fails and sanitizes errors',
    async (failed) => {
      const calls: string[] = [];
      const steps = Object.fromEntries(
        cleanupStages.map((stage) => [
          stage,
          async () => {
            calls.push(stage);
            if (stage === failed)
              throw new Error('postgres://private-value-must-not-leak');
          },
        ]),
      );
      const result = cleanupManualResources(steps);
      await expect(result).rejects.toThrow('CLEANUP_FAILED');
      await expect(result.catch(String)).resolves.not.toContain(
        'private-value-must-not-leak',
      );
      expect(calls).toEqual(cleanupStages);
    },
  );

  it('allows cleanup before any resource has been acquired', async () => {
    await expect(cleanupManualResources({})).resolves.toBeUndefined();
  });
});

describe('manual Pointage distinct credentials and exact container ownership (pure)', () => {
  it('regenerates a collision before returning a distinct credential', () => {
    const generate = vi
      .fn()
      .mockReturnValueOnce('12345678')
      .mockReturnValueOnce('87654321');
    expect(
      generateDistinctManualCredential(new Set(['12345678']), generate),
    ).toBe('87654321');
    expect(generate).toHaveBeenCalledTimes(2);
  });

  it('fails closed after bounded repeated credential collisions', () => {
    const generate = vi.fn(() => '12345678');
    expect(() =>
      generateDistinctManualCredential(new Set(['12345678']), generate),
    ).toThrow();
    expect(generate).toHaveBeenCalledTimes(10);
  });

  const owned = {
    containerName: 'yuta-pointage-next-111111111111411181111111',
    generationLabel: '111111111111411181111111',
    containerId: 'a'.repeat(64),
  };
  const inspection = `"/${owned.containerName}" "${owned.generationLabel}"`;
  const query = [
    'ps',
    '-aq',
    '--no-trunc',
    '--filter',
    `id=${owned.containerId}`,
  ];
  const nameQuery = [
    'ps',
    '-aq',
    '--no-trunc',
    '--filter',
    `name=^/${owned.containerName}$`,
  ];

  it('removes only the recorded ID after exact name and generation validation and verifies absence', async () => {
    const command = vi
      .fn<(args: string[]) => Promise<string>>()
      .mockResolvedValueOnce(owned.containerId)
      .mockResolvedValueOnce(inspection)
      .mockResolvedValueOnce(owned.containerId)
      .mockResolvedValueOnce('');
    await removeManualContainer(owned, command);
    expect(command.mock.calls.map(([args]) => args)).toEqual([
      query,
      [
        'inspect',
        '--format',
        '{{json .Name}} {{json (index .Config.Labels "yuta.disposable-run")}}',
        owned.containerId,
      ],
      ['rm', '-f', owned.containerId],
      query,
    ]);
  });

  it('recovers a failed-before-return fixture by exact name and matching generation label', async () => {
    const command = vi
      .fn<(args: string[]) => Promise<string>>()
      .mockResolvedValueOnce(owned.containerId)
      .mockResolvedValueOnce(inspection)
      .mockResolvedValueOnce(owned.containerId)
      .mockResolvedValueOnce('');
    await removeManualContainer(
      {
        containerName: owned.containerName,
        generationLabel: owned.generationLabel,
      },
      command,
    );
    expect(command).toHaveBeenNthCalledWith(1, nameQuery);
    expect(command).toHaveBeenCalledWith(['rm', '-f', owned.containerId]);
    expect(command).toHaveBeenLastCalledWith(query);
  });

  it('refuses a renamed recorded container even when its original name no longer exists', async () => {
    const command = vi.fn(async (args: string[]) => {
      if (args[0] === 'ps') {
        return args.includes(`id=${owned.containerId}`)
          ? owned.containerId
          : '';
      }
      if (args[0] === 'inspect') {
        return `"/renamed-container" "${owned.generationLabel}"`;
      }
      throw new Error('An unverified container must not be removed.');
    });
    await expect(removeManualContainer(owned, command)).rejects.toThrow(
      'CONTAINER_OWNERSHIP_REFUSED',
    );
    expect(command).toHaveBeenNthCalledWith(1, query);
    expect(command.mock.calls.some(([args]) => args[0] === 'rm')).toBe(false);
  });

  it('allows repeated cleanup once the owned container is absent', async () => {
    const command = vi.fn(async () => '');
    await removeManualContainer(owned, command);
    await removeManualContainer(owned, command);
    expect(command.mock.calls).toEqual([[query], [query]]);
  });

  it.each(['different-id', 'multiple-containers', 'wrong-name', 'wrong-label'])(
    'never removes a container when discovery gives %s',
    async (mismatch) => {
      const command = vi
        .fn<(args: string[]) => Promise<string>>()
        .mockResolvedValueOnce(
          mismatch === 'different-id'
            ? 'b'.repeat(64)
            : mismatch === 'multiple-containers'
              ? `${owned.containerId}\n${'b'.repeat(64)}`
              : owned.containerId,
        )
        .mockResolvedValueOnce(
          mismatch === 'wrong-name'
            ? `"/unrelated-container" "${owned.generationLabel}"`
            : `"/${owned.containerName}" "222222222222422282222222"`,
        );
      await expect(removeManualContainer(owned, command)).rejects.toThrow(
        'CONTAINER_OWNERSHIP_REFUSED',
      );
      expect(command.mock.calls.some(([args]) => args[0] === 'rm')).toBe(false);
    },
  );

  it.each([
    { containerName: 'yuta-pointage-next-*' },
    { generationLabel: '222222222222422282222222' },
    { containerId: 'invalid-id' },
  ])(
    'refuses invalid local ownership metadata before Docker inspection %#',
    async (patch) => {
      const command = vi.fn(async () => '');
      await expect(
        removeManualContainer({ ...owned, ...patch }, command),
      ).rejects.toThrow('CONTAINER_OWNERSHIP_REFUSED');
      expect(command).not.toHaveBeenCalled();
    },
  );

  it('reports a container still present after removal as cleanup failure', async () => {
    const command = vi
      .fn<(args: string[]) => Promise<string>>()
      .mockResolvedValueOnce(owned.containerId)
      .mockResolvedValueOnce(inspection)
      .mockResolvedValueOnce(owned.containerId)
      .mockResolvedValueOnce(owned.containerId);
    await expect(removeManualContainer(owned, command)).rejects.toThrow(
      'CONTAINER_CLEANUP_FAILED',
    );
    expect(command).toHaveBeenLastCalledWith(query);
  });

  it('does not turn a failed removal command into a successful cleanup', async () => {
    const command = vi
      .fn<(args: string[]) => Promise<string>>()
      .mockResolvedValueOnce(owned.containerId)
      .mockResolvedValueOnce(inspection)
      .mockRejectedValueOnce(new Error('synthetic Docker refusal'));
    await expect(removeManualContainer(owned, command)).rejects.toThrow();
    expect(command.mock.calls).toHaveLength(3);
  });
});

describe('manual launcher setup failure ownership (mocked processes and watchers)', () => {
  class FakeWatcher extends EventEmitter implements FSWatcher {
    close = vi.fn();
    ref() {
      return this;
    }
    unref() {
      return this;
    }
  }

  beforeEach(() => {
    processEffects.fork.mockClear();
    processEffects.spawn.mockClear();
    resourceEffects.watch.mockClear();
    resourceEffects.createServer.mockClear();
  });

  const input: Parameters<typeof launchPointageNextChild>[0] = {
    type: 'POINTAGE_TEST_INIT',
    version: 1,
    runId,
    origin: 'http://127.0.0.1:3001',
    listenHost: '127.0.0.1',
    listenPort: 3001,
    foundationDatabaseUrl:
      'postgres://synthetic:synthetic@127.0.0.1:56541/yuta_pointage_raw_clocking_test_u2',
    rawDatabaseUrl:
      'postgres://synthetic:synthetic@127.0.0.1:56541/yuta_pointage_raw_clocking_test_u2',
    encodedAuthSecret: Buffer.alloc(32, 7).toString('base64url'),
  };

  it.each(['watch-registration', 'init-send'] as const)(
    'retains the exact child and awaits one idempotent stop after %s fails',
    async (failed) => {
      const child = Object.assign(new EventEmitter(), {
        pid: 12345,
        exitCode: null as number | null,
        signalCode: null as NodeJS.Signals | null,
        connected: true,
        stdout: { resume: vi.fn() },
        stderr: { resume: vi.fn() },
        send: vi.fn((message: { type: string }) => {
          if (failed === 'init-send' && message.type === 'POINTAGE_TEST_INIT') {
            throw new Error('Synthetic INIT send failure.');
          }
          return true;
        }),
        kill: vi.fn(),
      });
      const watcher = new FakeWatcher();
      processEffects.fork.mockReturnValueOnce(child as unknown as ChildProcess);
      if (failed === 'watch-registration') {
        resourceEffects.watch.mockImplementationOnce(() => {
          throw new Error('Synthetic watch registration failure.');
        });
      } else {
        resourceEffects.watch.mockReturnValueOnce(watcher);
      }
      const profile = createPointageManualShadowProfile(
        pointageManualShadowValues,
      );
      const running = launchPointageNextChild(
        input,
        environment,
        undefined,
        profile,
      );
      expect(running.child).toBe(child);
      expect(() => running.requireValidMessages()).toThrow();
      expect(() => running.requireReconsumerProof()).toThrow();
      expect(running.statuses).toEqual([]);
      const stop = running.stop();
      expect(running.stop()).toBe(stop);
      let stopped = false;
      void stop.then(() => {
        stopped = true;
      });
      await Promise.resolve();
      expect(stopped).toBe(false);
      expect(
        child.send.mock.calls.filter(
          ([message]) => message.type === 'POINTAGE_TEST_STOP',
        ),
      ).toEqual([
        [
          { type: 'POINTAGE_TEST_STOP', version: 1, runId },
          expect.any(Function),
        ],
      ]);
      if (failed === 'init-send') expect(watcher.close).toHaveBeenCalled();
      child.exitCode = 0;
      child.connected = false;
      child.emit('exit', 0, null);
      await stop;
      expect(stopped).toBe(true);
      expect(running.stop()).toBe(stop);
      expect(child.kill).not.toHaveBeenCalled();
      expect(processEffects.fork).toHaveBeenCalledTimes(1);
      expect(processEffects.spawn).not.toHaveBeenCalled();
      expect(resourceEffects.createServer).not.toHaveBeenCalled();
    },
  );

  it.each([
    'invalid-generation',
    '11111111-1111-1111-8111-111111111111',
    '11111111-1111-7111-8111-111111111111',
    '11111111-1111-4111-7111-111111111111',
    'AAAAAAAA-AAAA-4AAA-8AAA-AAAAAAAAAAAA',
  ])(
    'rejects invalid lowercase UUID v4 generation %s before resource creation',
    async (invalidRunId) => {
      const onGeneration = vi.fn();
      const onContainer = vi.fn();
      await expect(
        provisionPointageNextFixture(environment, {
          runId: invalidRunId,
          onGeneration,
          onContainer,
        }),
      ).rejects.toThrow('Pointage disposable setup options refused.');
      expect(onGeneration).not.toHaveBeenCalled();
      expect(onContainer).not.toHaveBeenCalled();
      expect(resourceEffects.createServer).not.toHaveBeenCalled();
      expect(processEffects.spawn).not.toHaveBeenCalled();
      expect(processEffects.fork).not.toHaveBeenCalled();
    },
  );
});

describe('manual fixture ownership before provisioning returns (mocked resources)', () => {
  beforeEach(() => {
    processEffects.spawn.mockClear();
    processEffects.fork.mockClear();
    resourceEffects.createServer.mockClear();
    resourceEffects.openClient.mockClear();
  });

  class FixtureProbe extends EventEmitter {
    listen(_port: number, _host: string, listening: () => void) {
      listening();
      return this;
    }
    close(closed?: () => void) {
      closed?.();
      return this;
    }
    address() {
      return { address: '127.0.0.1', port: 56541 };
    }
  }

  function commandResult(output: string, exitCode: number) {
    const stdout = new EventEmitter();
    const child = Object.assign(new EventEmitter(), {
      stdout,
      stderr: { resume: vi.fn() },
    });
    queueMicrotask(() => {
      stdout.emit('data', Buffer.from(output));
      child.emit('close', exitCode);
    });
    return child;
  }

  it.each(['docker-run', 'docker-port'] as const)(
    'retains verified cleanup identity when %s fails before fixture return',
    async (failed) => {
      const events: string[] = [];
      const containerId = 'a'.repeat(64);
      const suffix = runId.replaceAll('-', '').slice(0, 24);
      const expected = {
        runId,
        databaseName: `yuta_pointage_raw_clocking_test_${suffix}`,
        containerName: `yuta-pointage-next-${suffix}`,
        generationLabel: suffix,
      };
      const onGeneration = vi.fn((identity: PointageNextFixtureIdentity) => {
        events.push('generation');
        expect(identity).toEqual(expected);
        expect(Object.isFrozen(identity)).toBe(true);
      });
      const onContainer = vi.fn((resource: PointageNextFixtureResource) => {
        events.push('container');
        expect(resource).toEqual({ ...expected, containerId });
        expect(Object.isFrozen(resource)).toBe(true);
      });
      resourceEffects.createServer
        .mockImplementationOnce(() => new FixtureProbe())
        .mockImplementationOnce(() => new FixtureProbe());
      processEffects.spawn
        .mockImplementationOnce((_command, args) => {
          events.push(`docker:${args[0]}`);
          return commandResult(
            JSON.stringify([
              {
                Endpoints: {
                  docker: { Host: 'npipe:////./pipe/dockerDesktopLinuxEngine' },
                },
              },
            ]),
            0,
          );
        })
        .mockImplementationOnce((_command, args) => {
          events.push(`docker:${args[0]}`);
          expect(onGeneration).toHaveBeenCalledTimes(1);
          expect(args).toContain(expected.containerName);
          expect(args).toContain(`yuta.disposable-run=${suffix}`);
          return commandResult(
            failed === 'docker-run' ? '' : containerId,
            failed === 'docker-run' ? 1 : 0,
          );
        });
      if (failed === 'docker-port') {
        processEffects.spawn.mockImplementationOnce((_command, args) => {
          events.push(`docker:${args[0]}`);
          expect(onContainer).toHaveBeenCalledTimes(1);
          expect(args).toEqual(['port', containerId, '5432/tcp']);
          return commandResult('', 1);
        });
      }
      await expect(
        provisionPointageNextFixture(environment, {
          runId,
          onGeneration,
          onContainer,
        }),
      ).rejects.toThrow('Pointage disposable setup unavailable.');
      expect(events).toEqual(
        failed === 'docker-run'
          ? ['generation', 'docker:context', 'docker:run']
          : [
              'generation',
              'docker:context',
              'docker:run',
              'container',
              'docker:port',
            ],
      );
      expect(onContainer).toHaveBeenCalledTimes(
        failed === 'docker-run' ? 0 : 1,
      );
      expect(resourceEffects.openClient).not.toHaveBeenCalled();
      expect(processEffects.fork).not.toHaveBeenCalled();

      const ownership =
        onContainer.mock.calls[0]?.[0] ?? onGeneration.mock.calls[0]![0];
      const cleanup = vi
        .fn<(args: string[]) => Promise<string>>()
        .mockResolvedValueOnce(containerId)
        .mockResolvedValueOnce(`"/${expected.containerName}" "${suffix}"`)
        .mockResolvedValueOnce(containerId)
        .mockResolvedValueOnce('');
      await removeManualContainer(ownership, cleanup);
      expect(cleanup).toHaveBeenNthCalledWith(1, [
        'ps',
        '-aq',
        '--no-trunc',
        '--filter',
        failed === 'docker-run'
          ? `name=^/${expected.containerName}$`
          : `id=${containerId}`,
      ]);
      expect(cleanup).toHaveBeenCalledWith(['rm', '-f', containerId]);
    },
  );
});
