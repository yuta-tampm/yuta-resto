import { execFileSync, fork } from 'node:child_process';
import { createHash, randomUUID } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { describe, expect, it, vi } from 'vitest';
import { createPointagePresentationController } from '../src/app/pointage/[establishmentSlug]/_components/pointage-employee';
import { z } from 'zod';
import { requirePointageTestConfiguration } from '../../../packages/db-cloud/test/helpers/pointage-raw-clocking-test-database';
import {
  createPointageStateGuard,
  decodePointageAuthSecret,
  derivePointageStateGuardKey,
  createPointageCredentialVerifier,
  createPointageLookupDigest,
  derivePointageCredentialKeys,
  generatePointageCredential,
  POINTAGE_CREDENTIAL_FORMAT_VERSION,
} from '@yuta/auth';
import { createPointageRepository } from '@yuta/db-cloud';
import {
  pointageIdentifyResponseSchema,
  pointageStateResponseSchema,
  pointageCommittedReceiptSchema,
} from '@yuta/contracts';
import {
  validatePointageTestInit,
  assertPointageReconsumerSnapshot,
  assertPointageReconsumerFacade,
  provePointageReconsumers,
  pointageListenerProofMode,
  assertPointageListenerLoss,
  pointageChildProofMode,
  assertPointageProviderUnavailableProof,
  pointageAdmissionTraceSchema,
  pointageTestInitSchema,
  pointageTestStopSchema,
  createPointageAdmissionTraceEmitter,
  type PointageAdmissionTrace,
} from './helpers/pointage-raw-clocking-next-child';
import {
  pointageChildEnvironment,
  spawnPointageNextChild,
  stopPointageNextChild,
  provisionPointageNextFixture,
  launchPointageNextChild,
  createPointageReconsumerReceiptCollector,
  assertPointageProviderUnavailableResult,
  createPointageAdmissionTraceCollector,
} from './helpers/pointage-raw-clocking-launcher';

const environment = {
  ...process.env,
  NODE_ENV: 'test' as const,
  VERCEL: undefined,
};
const base = {
  type: 'POINTAGE_TEST_INIT',
  version: 1,
  runId: randomUUID(),
  parentPid: 1,
  childPid: 2,
  origin: 'http://127.0.0.1:3001',
  listenHost: '127.0.0.1',
  listenPort: 3001,
  foundationDatabaseUrl:
    'postgres://yuta_pointage_foundation_runtime:synthetic@127.0.0.1:56541/yuta_pointage_raw_clocking_test_u2',
  rawDatabaseUrl:
    'postgres://yuta_pointage_raw_writer:synthetic@127.0.0.1:56541/yuta_pointage_raw_clocking_test_u2',
  encodedAuthSecret: Buffer.alloc(32, 7).toString('base64url'),
};
const safe = pointageChildEnvironment(environment);

function requireProviderUnavailableTrace(
  trace: ReturnType<typeof createPointageAdmissionTraceCollector>,
) {
  trace.requireValid();
  const snapshot = trace.snapshot();
  expect(snapshot.valid).toBe(true);
  // Generic validation deliberately permits an unused collector; this proof does not.
  expect(snapshot.rows.length).toBeGreaterThan(0);
  expect(snapshot.rows.map(({ seq }) => seq)).toEqual(
    snapshot.rows.map((_row, index) => index + 1),
  );
  const providerRows = snapshot.rows.filter(
    ({ stage }) => stage === 'PROVIDER_ADMISSION_VERIFIED',
  );
  expect(providerRows).toEqual([
    expect.objectContaining({ state: 'ENTER' }),
    expect.objectContaining({ state: 'FAIL', failureClass: 'PROVIDER' }),
  ]);
  expect(snapshot.readyObserved).toBe(false);
  expect(
    snapshot.rows.filter(
      ({ stage, state }) => stage === 'READY_EMITTED' && state === 'PASS',
    ),
  ).toHaveLength(0);
}

describe('ADMISSION_TRACE_V1 pure', () => {
  const runId = '00000000-0000-4000-8000-000000000001';
  const childPid = 321;
  const first = {
    type: 'POINTAGE_TEST_ADMISSION_TRACE',
    version: 1,
    runId,
    childPid,
    seq: 1,
    stage: 'PROCESS_STARTED',
    state: 'ENTER',
  } as const;
  const collector = () =>
    createPointageAdmissionTraceCollector(runId, childPid);
  it('provider proof rejects an empty valid collector and incomplete provider evidence', () => {
    const trace = collector();
    expect(() => trace.requireValid()).not.toThrow();
    expect(() => requireProviderUnavailableTrace(trace)).toThrow();
    trace.accept({ ...first, stage: 'PROVIDER_ADMISSION_VERIFIED' });
    expect(() => requireProviderUnavailableTrace(trace)).toThrow();
    trace.accept({
      ...first,
      stage: 'PROVIDER_ADMISSION_VERIFIED',
      seq: 2,
      state: 'FAIL',
      failureClass: 'PROVIDER',
    });
    expect(() => requireProviderUnavailableTrace(trace)).not.toThrow();
    trace.accept({ ...first, stage: 'READY_EMITTED', seq: 3 });
    trace.accept({ ...first, stage: 'READY_EMITTED', seq: 4, state: 'PASS' });
    expect(() => requireProviderUnavailableTrace(trace)).toThrow();
  });
  it.each([
    ['version', { version: 2 }],
    ['extra field', { details: 'not permitted' }],
    ['runId', { runId: '00000000-0000-4000-8000-000000000002' }],
    ['childPid', { childPid: 322 }],
    ['seq zero', { seq: 0 }],
    ['sequence gap', { seq: 2 }],
    ['unknown stage', { stage: 'DEBUG' }],
    ['unknown state', { state: 'OK' }],
    ['FAIL missing class', { state: 'FAIL' }],
    ['FAIL invalid class', { state: 'FAIL', failureClass: 'raw exception' }],
    ['PASS with class', { state: 'PASS', failureClass: 'UNKNOWN' }],
    ['ENTER with class', { failureClass: 'UNKNOWN' }],
    ['explicit undefined class', { failureClass: undefined }],
  ])('rejects %s and keeps invalidity sticky', (_name, patch) => {
    const trace = collector();
    expect(() => trace.accept({ ...first, ...patch })).toThrow();
    expect(() => trace.accept(first)).toThrow();
    expect(trace.snapshot().failureClass).toBe('UNKNOWN');
  });
  it('rejects duplicate/decreasing seq and repeated stage without resetting', () => {
    for (const seq of [1, 2, 3]) {
      const trace = collector();
      trace.accept(first);
      trace.accept({ ...first, seq: 2, state: 'PASS' });
      expect(() => trace.accept({ ...first, seq })).toThrow();
    }
  });
  it('rejects inbound trace with both exact existing inbound schemas', () => {
    expect(pointageTestInitSchema.safeParse(first).success).toBe(false);
    expect(pointageTestStopSchema.safeParse(first).success).toBe(false);
    expect(() =>
      validatePointageTestInit(first, environment, 1, childPid),
    ).toThrow();
  });
  it('accepts normal ordered trace, READY, immutable sanitized rows and UNKNOWN without a FAIL', () => {
    const trace = collector();
    // A read before queued IPC arrives is missing evidence, not corruption.
    expect(() => trace.requireReadyEvidence()).toThrow();
    const emitter = createPointageAdmissionTraceEmitter((message) =>
      trace.accept(message),
    );
    emitter.enter('PROCESS_STARTED');
    emitter.pass('PROCESS_STARTED');
    expect(trace.snapshot().rows).toHaveLength(0);
    emitter.bind(runId, childPid);
    for (const stage of [
      'INIT_VALIDATED',
      'LISTENER_BOUND',
      'FOUNDATION_CLIENT_OPENED',
      'RAW_CLIENT_OPENED',
      'RUNTIME_FACTORY_ENTERED',
    ] as const) {
      emitter.enter(stage);
      emitter.pass(stage);
    }
    emitter.enter('RUNTIME_FACTORY_COMPLETED');
    emitter.enter('PROVIDER_ADMISSION_VERIFIED');
    emitter.pass('PROVIDER_ADMISSION_VERIFIED');
    emitter.pass('RUNTIME_FACTORY_COMPLETED');
    emitter.enter('READY_EMITTED');
    emitter.pass('READY_EMITTED');
    trace.observeReady();
    trace.requireReadyEvidence();
    expect(trace.snapshot()).toMatchObject({
      valid: true,
      readyObserved: true,
      lastEntered: 'READY_EMITTED',
      lastPassed: 'READY_EMITTED',
      failureClass: 'UNKNOWN',
    });
    expect(Object.isFrozen(trace.snapshot().rows)).toBe(true);
    expect(trace.formatEvidence()).toContain('runId equality: PASS');
    expect(trace.formatEvidence()).not.toContain(runId);
    expect(trace.formatEvidence()).not.toContain(String(childPid));
    expect(() => trace.observeReady()).toThrow();
  });
  it('rejects READY without its required preceding trace and cannot repair it retrospectively', () => {
    const trace = collector();
    trace.accept(first);
    expect(() => trace.observeReady()).toThrow();
    expect(() => trace.requireReadyEvidence()).toThrow();
  });
  it('records a legitimate provider FAIL without READY and allows existing cleanup observations', () => {
    const trace = collector();
    trace.accept({ ...first, stage: 'PROVIDER_ADMISSION_VERIFIED' });
    trace.accept({
      ...first,
      stage: 'PROVIDER_ADMISSION_VERIFIED',
      seq: 2,
      state: 'FAIL',
      failureClass: 'PROVIDER',
    });
    trace.accept({ ...first, stage: 'TEARDOWN_STARTED', seq: 3 });
    trace.accept({
      ...first,
      stage: 'TEARDOWN_STARTED',
      seq: 4,
      state: 'PASS',
    });
    trace.requireValid();
    expect(trace.snapshot()).toMatchObject({
      lastEntered: 'TEARDOWN_STARTED',
      lastPassed: 'TEARDOWN_STARTED',
      failureClass: 'PROVIDER',
      readyObserved: false,
    });
  });
  it('retains an unfinished stage with UNKNOWN when no owned FAIL exists', () => {
    const trace = collector();
    trace.accept(first);
    trace.accept({ ...first, seq: 2, state: 'PASS' });
    trace.accept({ ...first, stage: 'INIT_VALIDATED', seq: 3 });
    expect(trace.snapshot()).toMatchObject({
      lastEntered: 'INIT_VALIDATED',
      lastPassed: 'PROCESS_STARTED',
      failureClass: 'UNKNOWN',
    });
  });
  it('emits strict rows without waiting, resetting sequence or propagating IPC loss', () => {
    const messages: PointageAdmissionTrace[] = [];
    const emitter = createPointageAdmissionTraceEmitter((message) => {
      messages.push(message);
      throw new Error('synthetic IPC loss');
    });
    emitter.bind(runId, childPid);
    expect(() => emitter.enter('PROCESS_STARTED')).not.toThrow();
    emitter.bind('00000000-0000-4000-8000-000000000002', 999);
    expect(() => emitter.pass('PROCESS_STARTED')).not.toThrow();
    expect(messages.map((m) => m.seq)).toEqual([1, 2]);
    expect(
      messages.every(
        (m) =>
          m.runId === runId &&
          m.childPid === childPid &&
          pointageAdmissionTraceSchema.safeParse(m).success,
      ),
    ).toBe(true);
  });
});

async function requireFreshFixture(
  fixture: Awaited<ReturnType<typeof provisionPointageNextFixture>>,
) {
  pointageChildEnvironment(process.env);
  if (
    process.env.DOCKER_HOST !== undefined ||
    process.env.DOCKER_CONTEXT !== undefined
  )
    throw new Error('Pointage disposable provenance refused.');
  const env = { ...process.env, POINTAGE_TEST_ORIGIN: base.origin };
  const foundation = requirePointageTestConfiguration(
    env,
    fixture.input.foundationDatabaseUrl,
  );
  const raw = requirePointageTestConfiguration(
    env,
    fixture.input.rawDatabaseUrl,
  );
  expect(foundation.name === fixture.name && raw.name === fixture.name).toBe(
    true,
  );
  expect(foundation.target.host === raw.target.host).toBe(true);
  const endpoint: unknown = JSON.parse(
    execFileSync(
      'docker',
      ['context', 'inspect', '--format', '{{json .Endpoints.docker.Host}}'],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] },
    ),
  );
  expect(
    [
      'npipe:////./pipe/dockerDesktopLinuxEngine',
      'unix:///var/run/docker.sock',
    ].includes(String(endpoint)),
  ).toBe(true);
  const inspection = z
    .array(
      z.object({
        Id: z.string(),
        State: z.object({ Running: z.boolean() }),
        Config: z.object({ Labels: z.record(z.string()) }),
        Mounts: z.array(z.unknown()),
        HostConfig: z.object({
          Tmpfs: z.record(z.string()),
          PortBindings: z.record(
            z.array(z.object({ HostIp: z.string(), HostPort: z.string() })),
          ),
        }),
      }),
    )
    .length(1)
    .parse(
      JSON.parse(
        execFileSync('docker', ['inspect', fixture.containerId], {
          encoding: 'utf8',
          stdio: ['ignore', 'pipe', 'ignore'],
        }),
      ),
    )[0]!;
  // Boolean assertions prevent accidental credential-bearing inspection output.
  expect(
    inspection.Id === fixture.containerId && inspection.State.Running,
  ).toBe(true);
  expect(
    inspection.Config.Labels['yuta.change'] === 'pointage-usable-raw-clocking',
  ).toBe(true);
  expect(
    /^[a-z0-9]+$/.test(inspection.Config.Labels['yuta.disposable-run'] ?? ''),
  ).toBe(true);
  expect(
    inspection.Mounts.length === 0 &&
      Object.keys(inspection.HostConfig.Tmpfs).length === 1 &&
      inspection.HostConfig.Tmpfs['/var/lib/postgresql/data'] ===
        'rw,size=512m',
  ).toBe(true);
  const ports = inspection.HostConfig.PortBindings;
  expect(
    Object.keys(ports).length === 1 &&
      ports['5432/tcp']?.length === 1 &&
      ports['5432/tcp'][0]?.HostIp === '127.0.0.1' &&
      ports['5432/tcp'][0]?.HostPort === foundation.target.port &&
      foundation.target.hostname === '127.0.0.1',
  ).toBe(true);
  const [actual] = await fixture.admin
    .connection`select current_database() as name`;
  expect(
    actual?.name === fixture.name &&
      actual?.name === foundation.name &&
      actual?.name === raw.name,
  ).toBe(true);
}

describe('D1b independent re-consumer detectors (not actual Next proof)', () => {
  type Snapshot = Parameters<typeof assertPointageReconsumerSnapshot>[0];
  type Runtime = Awaited<Parameters<typeof provePointageReconsumers>[0]>;
  function snapshot(): Snapshot {
    return {
      pid: 12,
      runId: base.runId,
      mainThread: true,
      listener: {},
      inventory: 'fixed-synthetic-inventory',
      descriptor: {
        enumerable: false,
        writable: false,
        configurable: false,
        value: Object.freeze({ admit: () => undefined }),
      },
      runtime: {},
      foundation: {},
      foundationDb: {},
      foundationConnection: {},
      raw: {},
      rawDb: {},
      rawConnection: {},
      runtimeCount: 1,
      foundationCount: 1,
      rawCount: 1,
    };
  }
  const runtime = Object.freeze({
    context: async () => null,
  }) as unknown as Runtime;
  it('accepts four independent closures and one exact reserved promise', async () => {
    const before = snapshot();
    const promise = Promise.resolve(runtime);
    const closures = new Set<() => Promise<Runtime>>();
    const pair = () => {
      const a = () => promise,
        b = () => promise;
      closures.add(a);
      closures.add(b);
      return [a, b] as const;
    };
    await provePointageReconsumers(promise, pair, () => before);
    expect(closures.size).toBe(4);
  });
  it('detects closure reuse within a pair', () => {
    const value = snapshot(),
      promise = Promise.resolve(runtime),
      acquire = () => promise;
    expect(() =>
      provePointageReconsumers(
        promise,
        () => [acquire, acquire],
        () => value,
      ),
    ).toThrow();
  });
  it('detects reused closures across E2 and E3', async () => {
    const value = snapshot(),
      promise = Promise.resolve(runtime);
    const pair = [() => promise, () => promise] as const;
    await expect(
      provePointageReconsumers(
        promise,
        () => pair,
        () => value,
      ),
    ).rejects.toThrow();
  });
  it.each(['different', 'async-wrapper', 'then-wrapper'])(
    'detects %s promise',
    (kind) => {
      const value = snapshot(),
        promise = Promise.resolve(runtime);
      const acquire =
        kind === 'different'
          ? () => Promise.resolve(runtime)
          : kind === 'async-wrapper'
            ? async () => promise
            : () => promise.then((v) => v);
      expect(() =>
        provePointageReconsumers(
          promise,
          () => [acquire, () => promise],
          () => value,
        ),
      ).toThrow();
    },
  );
  it('detects a different resolved facade', () => {
    expect(() => assertPointageReconsumerFacade(runtime, {})).toThrow();
  });
  it.each([
    'runtime',
    'foundation',
    'foundationDb',
    'foundationConnection',
    'raw',
    'rawDb',
    'rawConnection',
    'listener',
  ] as const)('detects changed %s reference', (key) => {
    const before = snapshot();
    expect(() =>
      assertPointageReconsumerSnapshot(before, { ...before, [key]: {} }),
    ).toThrow();
  });
  it.each(['enumerable', 'writable', 'configurable'] as const)(
    'detects changed descriptor %s',
    (key) => {
      const before = snapshot();
      expect(() =>
        assertPointageReconsumerSnapshot(before, {
          ...before,
          descriptor: { ...before.descriptor, [key]: true },
        }),
      ).toThrow();
    },
  );
  it('detects changed anchor object', () => {
    const before = snapshot();
    expect(() =>
      assertPointageReconsumerSnapshot(before, {
        ...before,
        descriptor: {
          ...before.descriptor,
          value: Object.freeze({ admit: () => undefined }),
        },
      }),
    ).toThrow();
  });
  it.each(['runtimeCount', 'foundationCount', 'rawCount'] as const)(
    'detects duplicate %s',
    (key) => {
      const before = snapshot();
      expect(() =>
        assertPointageReconsumerSnapshot(before, { ...before, [key]: 2 }),
      ).toThrow();
    },
  );
  const receipt = {
    type: 'POINTAGE_TEST_RECONSUMER_PROOF',
    version: 1,
    runId: base.runId,
    childPid: 12,
    result: 'PASS',
  };
  it('requires one exact receipt; duplicate permanently invalidates evidence', () => {
    const collector = createPointageReconsumerReceiptCollector(base.runId, 12);
    expect(() => collector.requireComplete()).toThrow();
    collector.accept(receipt);
    collector.requireComplete();
    expect(() => collector.accept(receipt)).toThrow();
    expect(() => collector.requireComplete()).toThrow();
  });
  it.each([
    { version: 2 },
    { runId: randomUUID() },
    { childPid: 13 },
    { result: 'FAIL' },
    { counters: 1 },
    { secret: 'synthetic' },
    { type: 'OTHER' },
  ])('rejects malformed proof receipt %#', (patch) => {
    const collector = createPointageReconsumerReceiptCollector(base.runId, 12);
    expect(() => collector.accept({ ...receipt, ...patch })).toThrow();
    expect(() => collector.requireComplete()).toThrow();
  });
  it('actual getter and proof factory share the private complete resolver', async () => {
    const source = await readFile(
      resolve(__dirname, '../src/server/pointage/raw-clocking-bootstrap.ts'),
      'utf8',
    );
    expect(source).toContain('export const getPointageRawClockingConsumer =');
    expect(
      source.match(/function createIndependentPointageAccessor\(\)/g),
    ).toHaveLength(1);
    expect(source).toContain('Object.getOwnPropertyDescriptor(process, key)');
    expect(source).not.toContain('async function');
    expect(source).not.toContain('getPointageRawClockingConsumer(');
    for (const operation of [
      'context',
      'identify',
      'state',
      'clock-in',
      'clock-out',
      'recover',
      'end',
    ]) {
      const route = await readFile(
        resolve(
          __dirname,
          '../src/app/api/pointage/[establishmentSlug]',
          operation,
          'route.ts',
        ),
        'utf8',
      );
      expect(route).toContain('raw-clocking-http');
      expect(route).not.toMatch(
        /postgres|createPointageRawClockingRuntime|openPointageTestClient/,
      );
    }
    const http = await readFile(
      resolve(__dirname, '../src/server/pointage/raw-clocking-http.ts'),
      'utf8',
    );
    expect(http).toContain('getPointageRawClockingConsumer');
    expect(http).toContain("from './raw-clocking-bootstrap'");
  });
});

describe('D1b strict private bootstrap contract', () => {
  it('U8 accepts exactly the three child argv sets and no proof-mode channel in INIT/environment', () => {
    expect(pointageChildProofMode([])).toBe('normal');
    expect(pointageChildProofMode(['--serve-listener-loss-proof'])).toBe(
      'listener-loss',
    );
    expect(pointageChildProofMode(['--serve-provider-unavailable-proof'])).toBe(
      'provider-unavailable',
    );
    for (const args of [
      ['--unknown'],
      [
        '--serve-provider-unavailable-proof',
        '--serve-provider-unavailable-proof',
      ],
      ['--serve-listener-loss-proof', '--serve-provider-unavailable-proof'],
      ['--serve-provider-unavailable-proof', '--serve-listener-loss-proof'],
    ])
      expect(() => pointageChildProofMode(args)).toThrow();
    for (const key of ['mode', 'proofMode', 'provider', 'argv']) {
      expect(() =>
        validatePointageTestInit(
          { ...base, [key]: '--serve-provider-unavailable-proof' },
          safe,
          1,
          2,
        ),
      ).toThrow();
      expect(
        pointageChildEnvironment({
          ...environment,
          [key]: '--serve-provider-unavailable-proof',
        }),
      ).not.toHaveProperty(key);
    }
  });
  it('U8 rejects every false-positive provider-stage/teardown verdict', () => {
    const evidence = {
      providerConstructions: 1,
      providerCalls: 1,
      unavailableResults: 1,
      healthyResults: 0,
      runtimeAttempts: 1,
      readyCount: 0,
      runtimePublished: false,
      factoryRejected: true,
      foundationCount: 1,
      rawCount: 1,
      closedClients: 2,
      closeFailure: false,
      terminalFailure: true,
      listenerReleased: true,
      generationUnchanged: true,
    };
    assertPointageProviderUnavailableProof(evidence);
    for (const [key, value] of Object.entries(evidence)) {
      const invalid = typeof value === 'boolean' ? !value : value + 1;
      expect(() =>
        assertPointageProviderUnavailableProof({ ...evidence, [key]: invalid }),
      ).toThrow();
    }
    // Earlier DB/role/F8 rejection never reaches provider construction.
    expect(() =>
      assertPointageProviderUnavailableProof({
        ...evidence,
        providerConstructions: 0,
        providerCalls: 0,
        unavailableResults: 0,
      }),
    ).toThrow();
    const result = {
      exitCode: 1,
      signalCode: null,
      stages: ['LISTENING', 'INITIALIZING', 'FAILED'],
      ownedClients: 0,
      rawDelta: 0,
      receiptDelta: 0,
      listenerReleased: true,
    };
    assertPointageProviderUnavailableResult(result);
    for (const patch of [
      { exitCode: 0 },
      { exitCode: 2 },
      { exitCode: null },
      { signalCode: 'SIGKILL' },
      { stages: ['FAILED'] },
      { stages: ['LISTENING', 'INITIALIZING', 'READY', 'FAILED'] },
      { ownedClients: 1 },
      { rawDelta: 1 },
      { receiptDelta: 1 },
      { listenerReleased: false },
    ])
      expect(() =>
        assertPointageProviderUnavailableResult({ ...result, ...patch }),
      ).toThrow();
  });
  it('U8 proof mode is launch-only, not environment/request/browser input', async () => {
    const child = await readFile(
      resolve(__dirname, 'helpers/pointage-raw-clocking-next-child.ts'),
      'utf8',
    );
    const launch = await readFile(
      resolve(__dirname, 'helpers/pointage-raw-clocking-launcher.ts'),
      'utf8',
    );
    expect(
      child.match(/pointageChildProofMode\(process\.argv\.slice\(2\)\)/g),
    ).toHaveLength(1);
    expect(
      child.indexOf('pointageChildProofMode(process.argv.slice(2))'),
    ).toBeLessThan(child.indexOf('let seenInit'));
    expect(child).not.toMatch(
      /process\.env\.(?:PROOF|POINTAGE_PROOF|PROVIDER_UNAVAILABLE)/,
    );
    expect(child).not.toMatch(/request\.(?:headers|url|body).*providerProof/);
    expect(launch).toContain('mode === undefined ? [] : [mode]');
  });
  it('accepts only the fixed launch-only listener proof argv', () => {
    expect(pointageListenerProofMode([])).toBe(false);
    expect(pointageListenerProofMode(['--serve-listener-loss-proof'])).toBe(
      true,
    );
    for (const args of [
      ['--other'],
      ['--serve-listener-loss-proof', '--serve-listener-loss-proof'],
      ['--serve-listener-loss-proof', '--other'],
    ])
      expect(() => pointageListenerProofMode(args)).toThrow();
  });
  it('listener proof refuses a missing close, residual address or accepting guard', () => {
    assertPointageListenerLoss(false, null, true);
    expect(() => assertPointageListenerLoss(true, null, true)).toThrow();
    expect(() => assertPointageListenerLoss(false, 'residual', true)).toThrow();
    expect(() => assertPointageListenerLoss(false, null, false)).toThrow();
  });
  it('accepts exactly the root-secret message, never a stateGuard input', () => {
    expect(validatePointageTestInit(base, safe, 1, 2)).toEqual(base);
    expect(() =>
      validatePointageTestInit(
        { ...base, stateGuardKeyBase64: base.encodedAuthSecret },
        safe,
        1,
        2,
      ),
    ).toThrow();
  });
  it.each([
    { listenHost: '0.0.0.0' },
    { listenPort: 3002 },
    { parentPid: 3 },
    { childPid: 3 },
    { encodedAuthSecret: base.encodedAuthSecret + '=' },
    { unknown: true },
    { rawDatabaseUrl: base.rawDatabaseUrl.replace('_u2', '_other') },
    {
      rawDatabaseUrl: base.rawDatabaseUrl.replace(
        'yuta_pointage_raw_writer',
        'postgres',
      ),
    },
    {
      foundationDatabaseUrl: base.foundationDatabaseUrl.replace(
        'yuta_pointage_foundation_runtime',
        'pointage_bootstrap_20260908a',
      ),
    },
    {
      rawDatabaseUrl: base.rawDatabaseUrl.replace(
        'yuta_pointage_raw_clocking_test_u2',
        'yuta_cloud',
      ),
    },
    {
      rawDatabaseUrl: base.rawDatabaseUrl.replace(
        'yuta_pointage_raw_clocking_test_u2',
        'yuta_pointage_foundation_test_c17',
      ),
    },
    { encodedAuthSecret: 'x'.repeat(16_385) },
  ])('rejects malformed/unsafe inputs before any database work %#', (patch) => {
    expect(() =>
      validatePointageTestInit({ ...base, ...patch }, safe, 1, 2),
    ).toThrow();
  });
  it('rejects unsafe parent before environment sanitization', () => {
    expect(() =>
      pointageChildEnvironment({ ...environment, NODE_ENV: 'production' }),
    ).toThrow();
    expect(() =>
      pointageChildEnvironment({ ...environment, VERCEL: '1' }),
    ).toThrow();
    const env = pointageChildEnvironment({
      ...environment,
      NODE_OPTIONS: '--inspect',
      CLOUD_DATABASE_URL: 'not-inherited',
      NEXT_PUBLIC_SECRET: 'not-inherited',
    });
    expect(env).not.toHaveProperty('NODE_OPTIONS');
    expect(env).not.toHaveProperty('CLOUD_DATABASE_URL');
    expect(env).not.toHaveProperty('NEXT_PUBLIC_SECRET');
  });
});

describe.sequential('D1b actual child negative admission (no database)', () => {
  async function refuse(
    patch: Record<string, unknown>,
    childEnvironment?: NodeJS.ProcessEnv,
  ) {
    const child = childEnvironment
      ? fork(
          resolve(__dirname, 'helpers/pointage-raw-clocking-next-child.ts'),
          [],
          {
            cwd: resolve(__dirname, '../../..'),
            env: childEnvironment,
            execArgv: [
              '--import',
              pathToFileURL(
                resolve(
                  __dirname,
                  '../../../packages/db-cloud/node_modules/tsx/dist/loader.mjs',
                ),
              ).href,
            ],
            stdio: ['ignore', 'pipe', 'pipe', 'ipc'],
          },
        )
      : spawnPointageNextChild(environment);
    child.stdout?.resume();
    child.stderr?.resume();
    const messages: unknown[] = [];
    child.on('message', (message) => messages.push(message));
    const exit = new Promise<number | null>((done) => child.once('exit', done));
    child.send(
      { ...base, parentPid: process.pid, childPid: child.pid, ...patch },
      () => undefined,
    );
    try {
      expect(await exit).toBe(1);
      expect(messages).toContainEqual({
        type: 'POINTAGE_TEST_STATUS',
        version: 1,
        runId: base.runId,
        childPid: child.pid,
        stage: 'FAILED',
        code: 'POINTAGE_UNAVAILABLE',
      });
      expect(
        messages.some(
          (message) => (message as { stage?: string }).stage === 'READY',
        ),
      ).toBe(false);
    } finally {
      await stopPointageNextChild(child, base.runId);
    }
  }
  it.each([
    { stateGuardKeyBase64: base.encodedAuthSecret },
    { unknown: true },
    { encodedAuthSecret: 'x'.repeat(16_385) },
    { parentPid: 1 },
    { childPid: 1 },
    { listenHost: '0.0.0.0' },
    { listenPort: 3002 },
    { rawDatabaseUrl: base.rawDatabaseUrl.replace('_u2', '_other') },
    {
      rawDatabaseUrl: base.rawDatabaseUrl.replace(
        'yuta_pointage_raw_writer',
        'postgres',
      ),
    },
    {
      foundationDatabaseUrl: base.foundationDatabaseUrl.replace(
        'yuta_pointage_foundation_runtime',
        'pointage_bootstrap_20260908a',
      ),
    },
    {
      rawDatabaseUrl: base.rawDatabaseUrl.replace(
        'yuta_pointage_raw_clocking_test_u2',
        'yuta_cloud',
      ),
    },
    {
      rawDatabaseUrl: base.rawDatabaseUrl.replace(
        'yuta_pointage_raw_clocking_test_u2',
        'yuta_pointage_foundation_test_c17',
      ),
    },
  ])(
    'actual process refuses unsafe INIT %#',
    async (patch) => {
      await refuse(patch);
    },
    30_000,
  );
  it('actual process refuses production/VERCEL before listener/client', async () => {
    await refuse({}, { ...safe, NODE_ENV: 'production' });
    await refuse({}, { ...safe, VERCEL: '1' });
  }, 30_000);
  it('EADDRINUSE retains the existing listener and refuses without another port', async () => {
    const server = createServer();
    await new Promise<void>((done, reject) => {
      server.once('error', reject);
      server.listen(3001, '127.0.0.1', done);
    });
    try {
      await refuse({});
      expect(server.listening).toBe(true);
    } finally {
      await new Promise<void>((done) => server.close(() => done()));
    }
  }, 30_000);
  it('repeated INIT is terminal even during listener preparation', async () => {
    const child = spawnPointageNextChild(environment);
    const exit = new Promise<number | null>((done) => child.once('exit', done));
    const message = { ...base, parentPid: process.pid, childPid: child.pid };
    const statuses: unknown[] = [];
    child.on('message', (value) => statuses.push(value));
    child.send(message, () => undefined);
    child.send(message, () => undefined);
    try {
      expect(await exit).toBe(1);
      expect(
        statuses.some(
          (value) => (value as { stage?: string }).stage === 'FAILED',
        ),
      ).toBe(true);
      expect(
        statuses.some(
          (value) => (value as { stage?: string }).stage === 'READY',
        ),
      ).toBe(false);
    } finally {
      await stopPointageNextChild(child, base.runId);
    }
  }, 30_000);
});

describe
  .runIf(process.env.YUTA_POINTAGE_SYNTHETIC_TEST_MODE === 'true')
  .sequential('D1b actual Next file routes (guarded disposable only)', () => {
    type Fixture = Awaited<ReturnType<typeof provisionPointageNextFixture>>;
    type Running = ReturnType<typeof launchPointageNextChild>;
    const pause = (ms: number) =>
      new Promise<void>((done) => setTimeout(done, ms));
    const route = (fixture: Fixture, operation: string) =>
      `${base.origin}/api/pointage/${fixture.slug}/${operation}`;
    async function ready(
      fixture: Fixture,
      running: Running,
      diagnose?: (stage: string) => void,
    ) {
      let lastObservation = '';
      const observe = (stage: string) => {
        const observation = `${stage} statuses=${running.statuses.map((s) => s.stage).join(',')}`;
        if (observation !== lastObservation) diagnose?.(observation);
        lastObservation = observation;
      };
      for (let attempt = 0; attempt < 100; attempt++) {
        if (
          running.child.exitCode !== null ||
          running.child.signalCode !== null
        ) {
          observe('CHILD_EXIT_BEFORE_READY');
          break;
        }
        let stage = 'CONTEXT_FETCH';
        try {
          const response = await fetch(route(fixture, 'context'), {
            signal: AbortSignal.timeout(5_000),
          });
          const ok = response.status === 200;
          observe(`CONTEXT_HTTP_${response.status}`);
          stage = 'CONTEXT_BODY_CANCEL';
          await response.body?.cancel();
          if (ok) {
            stage = 'RECONSUMER_PROOF';
            running.requireReconsumerProof();
            stage = 'INITIALIZING_COUNT';
            expect(
              running.statuses.filter((s) => s.stage === 'INITIALIZING'),
            ).toHaveLength(1);
            stage = 'READY_COUNT';
            expect(
              running.statuses.filter((s) => s.stage === 'READY'),
            ).toHaveLength(1);
            observe('COMPLETE_ADMISSION_AND_RECONSUMER_PROOF');
            return;
          }
        } catch {
          observe(`${stage}_NOT_COMPLETE`);
          /* Only neutral context retries during initial compilation. */
        }
        await pause(250);
      }
      observe('READY_LOOP_ENDED');
      throw new Error('E5 fresh admission did not complete.');
    }
    async function clientsClosed(fixture: Fixture) {
      const rows = await fixture.admin
        .connection`select count(*)::int as count from pg_stat_activity where datname=current_database() and usename in ('yuta_pointage_foundation_runtime','yuta_pointage_raw_writer')`;
      expect(rows[0]?.count).toBe(0);
    }
    async function noAttendance(fixture: Fixture) {
      const rows = await fixture.admin
        .connection`select (select count(*)::int from public.pointage_raw_events where organization_id=${fixture.scope.organizationId} and establishment_id=${fixture.scope.establishmentId} and personnel_dossier_id=${fixture.scope.personnelDossierId}) as raw, (select count(*)::int from public.pointage_raw_command_receipts where organization_id=${fixture.scope.organizationId} and establishment_id=${fixture.scope.establishmentId} and personnel_dossier_id=${fixture.scope.personnelDossierId}) as receipts`;
      expect(rows[0]?.raw === 0 && rows[0]?.receipts === 0).toBe(true);
    }
    async function continuation(fixture: Fixture) {
      const rows = await fixture.admin
        .connection`select id, credential_id, credential_version, issued_at::text, idle_expires_at::text, absolute_expires_at::text, ended_at::text, extract(epoch from issued_at)*1000 as issued_ms, extract(epoch from idle_expires_at)*1000 as idle_ms, extract(epoch from absolute_expires_at)*1000 as absolute_ms from public.pointage_continuations where organization_id=${fixture.scope.organizationId} and establishment_id=${fixture.scope.establishmentId} and personnel_dossier_id=${fixture.scope.personnelDossierId}`;
      expect(rows.length).toBe(1);
      expect(rows[0]?.ended_at === null).toBe(true);
      return rows[0]!;
    }
    async function databaseNow(fixture: Fixture) {
      const [row] = await fixture.admin
        .connection`select extract(epoch from clock_timestamp())*1000 as now`;
      return Number(row!.now);
    }
    async function waitPast(fixture: Fixture, deadline: number) {
      for (;;) {
        const remaining = deadline - (await databaseNow(fixture));
        if (remaining < -100) return;
        await pause(Math.min(20_000, Math.max(150, remaining + 150)));
      }
    }
    async function state(fixture: Fixture, token: string) {
      return fetch(route(fixture, 'state'), {
        method: 'POST',
        headers: {
          Origin: base.origin,
          'Content-Type': 'application/json',
          Authorization: `Pointage ${token}`,
        },
        body: '{}',
        signal: AbortSignal.timeout(15_000),
      });
    }

    it('U8 PROVIDER_UNAVAILABLE_ACTUAL_PROCESS rejects before READY with exact teardown and no attendance', async () => {
      const fixture = await provisionPointageNextFixture(process.env);
      await requireFreshFixture(fixture);
      const counts = async () => {
        const [row] = await fixture.admin.connection`select
          (select count(*)::int from public.pointage_raw_events) as raw,
          (select count(*)::int from public.pointage_raw_command_receipts) as receipts,
          (select count(*)::int from pg_stat_activity where datname=current_database()
            and usename in ('yuta_pointage_foundation_runtime','yuta_pointage_raw_writer')) as clients`;
        return {
          raw: Number(row!.raw),
          receipts: Number(row!.receipts),
          clients: Number(row!.clients),
        };
      };
      const before = await counts();
      expect(before).toEqual({ raw: 0, receipts: 0, clients: 0 });
      const running = launchPointageNextChild(
        fixture.input,
        process.env,
        '--serve-provider-unavailable-proof',
      );
      try {
        const limit = Date.now() + 120_000;
        while (
          running.child.exitCode === null &&
          running.child.signalCode === null &&
          Date.now() < limit
        ) {
          try {
            // Context invokes the existing lazy actual-route bootstrap. No
            // credential or attendance request is sent to force a response window.
            const response = await fetch(route(fixture, 'context'), {
              signal: AbortSignal.timeout(5_000),
            });
            await response.body?.cancel();
          } catch {
            /* Terminal admission may naturally close transport. */
          }
          await pause(250);
        }
        // Verdict precedes finally/STOP; no forced kill can count as proof.
        const after = await counts();
        console.info(
          'PROVIDER_UNAVAILABLE_ADMISSION_TRACE_V1\n' +
            running.admissionTrace.formatEvidence(),
        );
        running.requireValidMessages();
        requireProviderUnavailableTrace(running.admissionTrace);
        expect(running.child.pid).toBeGreaterThan(0);
        expect(running.child.pid).not.toBe(process.pid);
        let listenerReleased = false;
        await new Promise<void>((done, reject) => {
          const probe = createServer();
          probe.once('error', reject);
          probe.listen(3001, '127.0.0.1', () =>
            probe.close(() => {
              listenerReleased = true;
              done();
            }),
          );
        });
        assertPointageProviderUnavailableResult({
          exitCode: running.child.exitCode,
          signalCode: running.child.signalCode,
          stages: running.statuses.map(({ stage }) => stage),
          ownedClients: after.clients,
          rawDelta: after.raw - before.raw,
          receiptDelta: after.receipts - before.receipts,
          listenerReleased,
        });
        console.info(
          `PROVIDER_UNAVAILABLE_ACTUAL_PROCESS: PASS pid=${running.child.pid} runId=${fixture.input.runId} argv=provider-unavailable disposableDB=${fixture.name} foundation=yuta_pointage_foundation_runtime raw=yuta_pointage_raw_writer SAME_DB=PASS D1_D1a_F8=PASS providerStage=REACHED unavailable=1 healthy=0 READY=0 published=0 replacement=0 closedClients=2 remainingClients=0 exit=1 signal=null listenerReleased=true rawDelta=0 receiptDelta=0`,
        );
      } finally {
        await running.stop();
        await fixture.close();
      }
    }, 180_000);

    it('U8 healthy actual routes preserve canonical receipts, concurrency, lifecycle and controlled U6/U7 transport', async () => {
      const fixture = await provisionPointageNextFixture(process.env);
      await requireFreshFixture(fixture);
      const running = launchPointageNextChild(fixture.input, process.env);
      const network = globalThis.fetch;
      let controller:
        | ReturnType<typeof createPointagePresentationController>
        | undefined;
      const endRequests: Promise<Response>[] = [];
      try {
        await ready(fixture, running);
        const [clients] = await fixture.admin.connection`select
          count(*) filter (where usename='yuta_pointage_foundation_runtime')::int as foundation,
          count(*) filter (where usename='yuta_pointage_raw_writer')::int as raw
          from pg_stat_activity where datname=current_database()`;
        expect(clients?.foundation === 1 && clients?.raw === 1).toBe(true);
        const post = (
          operation: string,
          payload: unknown,
          token?: string,
          slug = fixture.slug,
        ) =>
          network(`${base.origin}/api/pointage/${slug}/${operation}`, {
            method: 'POST',
            headers: {
              Origin: base.origin,
              'Content-Type': 'application/json',
              ...(token ? { Authorization: `Pointage ${token}` } : {}),
            },
            body: JSON.stringify(payload),
            signal: AbortSignal.timeout(20_000),
          });
        const identify = async () => {
          const response = await post('identify', {
            credential: fixture.credential,
          });
          expect(response.status).toBe(200);
          expect(response.headers.has('set-cookie')).toBe(false);
          return pointageIdentifyResponseSchema.parse(await response.json());
        };
        const canonical = async (expected: string[]) => {
          const rows = await fixture.admin
            .connection`select e.organization_id,e.establishment_id,e.personnel_dossier_id,
            e.kind,e.ordinal::text,e.id,e.timezone_name,e.utc_offset_seconds,e.business_date::text,
            to_char(e.accepted_at at time zone 'UTC','YYYY-MM-DD"T"HH24:MI:SS.US"Z"') as instant,
            r.event_id,r.request_id,r.intent_fingerprint
            from public.pointage_raw_events e left join public.pointage_raw_command_receipts r
            on (r.organization_id,r.establishment_id,r.personnel_dossier_id,r.event_id)=
              (e.organization_id,e.establishment_id,e.personnel_dossier_id,e.id)
            order by e.ordinal`;
          expect(rows.map((row) => row.kind)).toEqual(expected);
          expect(
            rows.every(
              (row, index) =>
                row.organization_id === fixture.scope.organizationId &&
                row.establishment_id === fixture.scope.establishmentId &&
                row.personnel_dossier_id === fixture.scope.personnelDossierId &&
                row.event_id === row.id &&
                Number(row.ordinal) === index + 1 &&
                typeof row.request_id === 'string' &&
                /^[a-f0-9]{64}$/.test(String(row.intent_fingerprint)),
            ),
          ).toBe(true);
          const [count] = await fixture.admin
            .connection`select count(*)::int as n from public.pointage_raw_command_receipts`;
          expect(count?.n === expected.length).toBe(true);
          return rows;
        };
        const denied = async (
          response: Response,
          code = 'POINTAGE_ACCESS_DENIED',
          status = 403,
        ) => {
          expect(response.status).toBe(status);
          expect(await response.json()).toEqual({ code });
          expect(response.headers.has('set-cookie')).toBe(false);
        };
        await canonical([]);
        await denied(await post('state', {}));
        // Existing Personnel fixture boundary: neither upcoming nor former may identify.
        for (const period of ['upcoming', 'former']) {
          if (period === 'upcoming')
            await fixture.admin
              .connection`update public.personnel_employee_dossiers set entry_date=current_date+1 where id=${fixture.scope.personnelDossierId} and organization_id=${fixture.scope.organizationId} and establishment_id=${fixture.scope.establishmentId}`;
          else
            await fixture.admin
              .connection`update public.personnel_employee_dossiers set entry_date='2020-01-01',departure_date=current_date-1 where id=${fixture.scope.personnelDossierId} and organization_id=${fixture.scope.organizationId} and establishment_id=${fixture.scope.establishmentId}`;
          await denied(
            await post('identify', { credential: fixture.credential }),
          );
        }
        await fixture.admin
          .connection`update public.personnel_employee_dossiers set departure_date=null where id=${fixture.scope.personnelDossierId} and organization_id=${fixture.scope.organizationId} and establishment_id=${fixture.scope.establishmentId}`;
        const employee = await identify();
        const token = employee.continuation;
        expect(employee.state.status).toBe('NOT_CLOCKED_IN');
        expect(employee.state.openSessionStart).toBeNull();
        const intent = {
          requestId: randomUUID(),
          observedStateGuard: employee.state.stateGuard,
        };
        const invalidTime = await post(
          'clock-in',
          { ...intent, acceptedAt: '2000-01-01T00:00:00.000000Z' },
          token,
        );
        await denied(invalidTime, 'POINTAGE_REQUEST_INVALID', 400);
        await canonical([]);
        const accepted = await post('clock-in', intent, token);
        expect(accepted.status).toBe(200);
        const receipt = pointageCommittedReceiptSchema.parse(
          await accepted.json(),
        );
        const rows = await canonical(['CLOCK_IN']);
        expect(
          rows[0]?.request_id === intent.requestId &&
            rows[0]?.instant === receipt.acceptedAt &&
            rows[0]?.timezone_name === receipt.timezoneName &&
            rows[0]?.business_date === receipt.businessDate &&
            rows[0]?.utc_offset_seconds === receipt.utcOffsetSeconds,
        ).toBe(true);
        for (const operation of ['clock-in', 'recover']) {
          const response = await post(
            operation,
            operation === 'recover' ? { ...intent, kind: 'CLOCK_IN' } : intent,
            token,
          );
          expect(response.status).toBe(200);
          expect(
            JSON.stringify(await response.json()) === JSON.stringify(receipt),
          ).toBe(true);
          expect(
            JSON.stringify(await canonical(['CLOCK_IN'])) ===
              JSON.stringify(rows),
          ).toBe(true);
        }
        await denied(
          await post('clock-out', intent, token),
          'POINTAGE_REQUEST_CONFLICT',
          409,
        );
        const current = pointageStateResponseSchema.parse(
          await (await post('state', {}, token)).json(),
        );
        expect(current.state.status).toBe('CLOCKED_IN');
        expect(
          current.state.openSessionStart?.instant === receipt.acceptedAt,
        ).toBe(true);
        const competing = await Promise.all(
          [randomUUID(), randomUUID()].map((requestId) =>
            post(
              'clock-out',
              { requestId, observedStateGuard: current.state.stateGuard },
              token,
            ),
          ),
        );
        expect(competing.map((r) => r.status).sort()).toEqual([200, 409]);
        for (const response of competing) await response.body?.cancel();
        await canonical(['CLOCK_IN', 'CLOCK_OUT']);
        expect(
          pointageStateResponseSchema.parse(
            await (await post('state', {}, token)).json(),
          ).state.status,
        ).toBe('NOT_CLOCKED_IN');
        expect((await post('end', {}, token)).status).toBe(204);
        await denied(await post('state', {}, token));
        await denied(
          await post('recover', { ...intent, kind: 'CLOCK_IN' }, token),
        );

        // Controlled network boundary only: real responses are never fabricated.
        // Relative URL and Origin emulate transport context, not browser QA.
        let loss: 'none' | 'before-dispatch' | 'after-commit' = 'none';
        const sent: { operation: string; body: string }[] = [];
        let hold: ((response: Response) => Promise<Response>) | undefined;
        vi.stubGlobal(
          'fetch',
          async (input: string | URL | Request, init?: RequestInit) => {
            const url = new URL(String(input), base.origin);
            if (
              url.origin !== base.origin ||
              !url.pathname.startsWith(`/api/pointage/${fixture.slug}/`)
            )
              throw new Error('Controlled Pointage transport scope refused.');
            const operation = url.pathname.split('/').at(-1)!;
            const body = String(init?.body ?? '');
            sent.push({ operation, body });
            const isMutation =
              operation === 'clock-in' || operation === 'clock-out';
            const currentLoss = loss;
            if (isMutation) loss = 'none';
            if (isMutation && currentLoss === 'before-dispatch')
              throw new Error('Synthetic transport not dispatched.');
            const request = network(url, {
              ...init,
              headers: { ...init?.headers, Origin: base.origin },
            });
            if (operation === 'end') endRequests.push(request);
            const response = await request;
            if (isMutation && currentLoss === 'after-commit') {
              expect(response.status).toBe(200);
              await response.body?.cancel();
              throw new Error(
                'Synthetic acknowledgement loss after actual commit.',
              );
            }
            if (operation === 'state' && hold) return hold(response);
            return response;
          },
        );
        for (const failure of ['after-commit', 'before-dispatch'] as const) {
          controller = createPointagePresentationController(fixture.slug);
          controller.setPin(fixture.credential);
          await controller.identify();
          expect(controller.getSnapshot().phase).toBe('ACTIVE');
          const start = sent.length;
          loss = failure;
          await controller.mutate();
          expect(controller.getSnapshot().phase).toBe('FAILURE');
          const original = sent[start]!;
          await controller.recover();
          expect(controller.getSnapshot().phase).toBe('RECEIPT');
          const attempts = sent.slice(start);
          expect(attempts.map((x) => x.operation)).toEqual(
            failure === 'after-commit'
              ? ['clock-in', 'recover']
              : ['clock-out', 'recover', 'clock-out'],
          );
          const recovered = JSON.parse(attempts[1]!.body) as Record<
            string,
            unknown
          >;
          const frozen = JSON.parse(original.body) as Record<string, unknown>;
          expect(
            recovered.requestId === frozen.requestId &&
              recovered.observedStateGuard === frozen.observedStateGuard,
          ).toBe(true);
          if (failure === 'before-dispatch')
            expect(attempts[2]!.body === original.body).toBe(true);
          await canonical(
            failure === 'after-commit'
              ? ['CLOCK_IN', 'CLOCK_OUT', 'CLOCK_IN']
              : ['CLOCK_IN', 'CLOCK_OUT', 'CLOCK_IN', 'CLOCK_OUT'],
          );
          controller.end();
          expect(controller.getSnapshot().phase).toBe('NEUTRAL');
          await Promise.all(endRequests);
          controller.dispose();
        }
        vi.unstubAllGlobals();

        // An open session does not grant a post-departure exception, even replay.
        const finalEmployee = await identify();
        const finalIntent = {
          requestId: randomUUID(),
          observedStateGuard: finalEmployee.state.stateGuard,
        };
        expect(
          (await post('clock-in', finalIntent, finalEmployee.continuation))
            .status,
        ).toBe(200);
        const beforeDeparture = await canonical([
          'CLOCK_IN',
          'CLOCK_OUT',
          'CLOCK_IN',
          'CLOCK_OUT',
          'CLOCK_IN',
        ]);
        await fixture.admin
          .connection`update public.personnel_employee_dossiers set departure_date=current_date-1 where id=${fixture.scope.personnelDossierId} and organization_id=${fixture.scope.organizationId} and establishment_id=${fixture.scope.establishmentId}`;
        await denied(await post('state', {}, finalEmployee.continuation));
        await denied(
          await post(
            'clock-out',
            {
              requestId: randomUUID(),
              observedStateGuard: finalEmployee.state.stateGuard,
            },
            finalEmployee.continuation,
          ),
        );
        await denied(
          await post(
            'recover',
            { ...finalIntent, kind: 'CLOCK_IN' },
            finalEmployee.continuation,
          ),
        );
        expect(
          JSON.stringify(
            await canonical([
              'CLOCK_IN',
              'CLOCK_OUT',
              'CLOCK_IN',
              'CLOCK_OUT',
              'CLOCK_IN',
            ]),
          ) === JSON.stringify(beforeDeparture),
        ).toBe(true);
        await running.stop();
        expect(running.child.exitCode).toBe(0);
        expect(running.child.signalCode).toBeNull();
        await clientsClosed(fixture);
        running.requireReconsumerProof();
        console.info(
          `U8_HEALTHY_PARTIAL_MATRIX: PASS pid=${running.child.pid} runId=${fixture.input.runId} D1_D1a_F8=PASS clients=1+1 routeChain=PASS SQL=5_raw_5_receipts sameReplay=PASS differentIntent=409 concurrency=one_acceptance U7=committed_recover_and_real_UNCONFIRMED_same_tuple_resend departure=deny_no_auto_close exit=0 clientsAfter=0 retainedDB=${fixture.name}`,
        );
      } finally {
        controller?.dispose();
        await Promise.allSettled(endRequests);
        vi.unstubAllGlobals();
        await running.stop();
        await fixture.close();
      }
    }, 240_000);

    it('U8 scoped actual transport denies other establishments and fences a late committed receipt after clear', async () => {
      const fixture = await provisionPointageNextFixture(process.env);
      await requireFreshFixture(fixture);
      const otherOrganization = randomUUID();
      const sameOrgEstablishment = randomUUID();
      const otherOrgEstablishment = randomUUID();
      const suffix = fixture.input.runId.replaceAll('-', '');
      const otherSlugs = [
        `synthetic-same-${suffix}`,
        `synthetic-other-${suffix}`,
      ];
      await fixture.admin.connection.begin(async (sql) => {
        await sql`insert into public.organizations(id,name,slug) values(${otherOrganization},'Synthetic U8 scope',${'synthetic-org-' + suffix})`;
        await sql`insert into public.establishments(id,organization_id,name,slug,timezone) values
          (${sameOrgEstablishment},${fixture.scope.organizationId},'Synthetic U8 same organization',${otherSlugs[0]!},'UTC'),
          (${otherOrgEstablishment},${otherOrganization},'Synthetic U8 other organization',${otherSlugs[1]!},'UTC')`;
      });
      const running = launchPointageNextChild(fixture.input, process.env);
      const network = globalThis.fetch;
      let controller:
        | ReturnType<typeof createPointagePresentationController>
        | undefined;
      let release: (() => void) | undefined;
      const endRequests: Promise<Response>[] = [];
      try {
        await ready(fixture, running);
        const identifiedResponse = await network(route(fixture, 'identify'), {
          method: 'POST',
          headers: {
            Origin: base.origin,
            'Content-Type': 'application/json',
            Forwarded: 'for=203.0.113.1',
            'X-Forwarded-For': '203.0.113.2',
            'X-Real-IP': '203.0.113.3',
          },
          body: JSON.stringify({ credential: fixture.credential }),
        });
        expect(identifiedResponse.status).toBe(200);
        const employee = pointageIdentifyResponseSchema.parse(
          await identifiedResponse.json(),
        );
        for (const slug of otherSlugs) {
          for (const operation of ['state', 'clock-in', 'identify']) {
            const payload =
              operation === 'identify'
                ? { credential: fixture.credential }
                : operation === 'state'
                  ? {}
                  : {
                      requestId: randomUUID(),
                      observedStateGuard: employee.state.stateGuard,
                    };
            const response = await network(
              `${base.origin}/api/pointage/${slug}/${operation}`,
              {
                method: 'POST',
                headers: {
                  Origin: base.origin,
                  'Content-Type': 'application/json',
                  Authorization: `Pointage ${employee.continuation}`,
                },
                body: JSON.stringify(payload),
              },
            );
            expect(response.status).toBe(403);
            expect(await response.json()).toEqual({
              code: 'POINTAGE_ACCESS_DENIED',
            });
          }
        }
        // Browser role/membership claims are not a cloud-user or Pointage grant.
        const staff = await network(route(fixture, 'state'), {
          method: 'POST',
          headers: {
            Origin: base.origin,
            'Content-Type': 'application/json',
            'X-Role': 'STAFF',
            'X-Organization-Id': fixture.scope.organizationId,
            'X-Establishment-Id': fixture.scope.establishmentId,
          },
          body: '{}',
        });
        expect(staff.status).toBe(403);
        expect(await staff.json()).toEqual({ code: 'POINTAGE_ACCESS_DENIED' });
        // No manager transport is invented. Unsupported authority-bearing input
        // to an existing route is rejected instead of dispatched as a grant.
        const broad = await network(route(fixture, 'state'), {
          method: 'POST',
          headers: {
            Origin: base.origin,
            'Content-Type': 'application/json',
            Authorization: `Pointage ${employee.continuation}`,
          },
          body: JSON.stringify({
            operation: 'pointage.establishment.read',
            role: 'STAFF',
          }),
        });
        expect(broad.status).toBe(400);
        expect(await broad.json()).toEqual({
          code: 'POINTAGE_REQUEST_INVALID',
        });
        await noAttendance(fixture);

        let arrived!: () => void;
        const committedResponseArrived = new Promise<void>((done) => {
          arrived = done;
        });
        const held = new Promise<void>((done) => {
          release = done;
        });
        const sent: string[] = [];
        vi.stubGlobal(
          'fetch',
          async (input: string | URL | Request, init?: RequestInit) => {
            const url = new URL(String(input), base.origin);
            if (
              url.origin !== base.origin ||
              !url.pathname.startsWith(`/api/pointage/${fixture.slug}/`)
            )
              throw new Error('Controlled Pointage transport scope refused.');
            const operation = url.pathname.split('/').at(-1)!;
            sent.push(operation);
            const request = network(url, {
              ...init,
              headers: { ...init?.headers, Origin: base.origin },
            });
            if (operation === 'end') endRequests.push(request);
            const response = await request;
            if (operation === 'clock-in') {
              expect(response.status).toBe(200);
              // Hold only delivery of the genuine server response, after commit.
              arrived();
              await held;
            }
            return response;
          },
        );
        controller = createPointagePresentationController(fixture.slug);
        controller.setPin(fixture.credential);
        await controller.identify();
        expect(controller.getSnapshot().phase).toBe('ACTIVE');
        const pending = controller.mutate();
        await Promise.race([
          committedResponseArrived,
          pause(20_000).then(() => {
            throw new Error('Actual commit was not observed.');
          }),
        ]);
        const generation = controller.getGeneration();
        controller.end();
        expect(controller.getSnapshot()).toEqual({ phase: 'NEUTRAL', pin: '' });
        expect(controller.getGeneration()).toBeGreaterThan(generation);
        await Promise.all(endRequests);
        controller.setPin(fixture.credential);
        await controller.identify();
        const fresh = controller.getSnapshot();
        expect(fresh.phase).toBe('ACTIVE');
        release!();
        await pending;
        expect(controller.getSnapshot() === fresh).toBe(true);
        const count = sent.length;
        await controller.recover();
        expect(sent.length).toBe(count);
        expect(sent).not.toContain('recover');
        const [rows] = await fixture.admin.connection`select
          (select count(*)::int from public.pointage_raw_events) as raw,
          (select count(*)::int from public.pointage_raw_command_receipts) as receipts,
          (select count(*)::int from public.pointage_raw_events where organization_id<>${fixture.scope.organizationId}
            or establishment_id<>${fixture.scope.establishmentId} or personnel_dossier_id<>${fixture.scope.personnelDossierId}) as outside`;
        expect(
          rows?.raw === 1 && rows?.receipts === 1 && rows?.outside === 0,
        ).toBe(true);
        controller.end();
        await Promise.all(endRequests);
        controller.dispose();
        vi.unstubAllGlobals();
        await running.stop();
        expect(running.child.exitCode).toBe(0);
        expect(running.child.signalCode).toBeNull();
        await clientsClosed(fixture);
        console.info(
          `U8_SCOPE_CLEAR: PASS pid=${running.child.pid} runId=${fixture.input.runId} D1_D1a_F8=PASS sameOrgDifferentEstablishment=DENIED otherOrg=DENIED untrustedRoleClaims=DENIED broadOperation=DENIED lateCommittedResponse=FENCED freshIdentifyOldTuple=ABSENT raw=1 receipts=1 outsideScope=0 exit=0 clientsAfter=0 retainedDB=${fixture.name}`,
        );
      } finally {
        release?.();
        controller?.dispose();
        await Promise.allSettled(endRequests);
        vi.unstubAllGlobals();
        await running.stop();
        await fixture.close();
      }
    }, 180_000);

    it('E5-LISTENER-LOSS independently terminates the admitted owner without STOP', async () => {
      const fixture = await provisionPointageNextFixture(process.env);
      await requireFreshFixture(fixture);
      await noAttendance(fixture);
      const running = launchPointageNextChild(
        fixture.input,
        process.env,
        '--serve-listener-loss-proof',
      );
      try {
        const limit = Date.now() + 120_000;
        while (
          running.child.exitCode === null &&
          running.child.signalCode === null &&
          Date.now() < limit
        ) {
          try {
            const response = await fetch(route(fixture, 'context'), {
              signal: AbortSignal.timeout(5_000),
            });
            await response.body?.cancel();
          } catch {
            /* The proof closes its listener without any operation. */
          }
          await pause(250);
        }
        // No STOP/watchdog is sent before this verdict. Exit 2 cannot pass.
        expect(running.child.exitCode).toBe(1);
        expect(running.child.signalCode).toBeNull();
        running.requireReconsumerProof();
        expect(running.statuses.map((s) => s.stage)).toEqual([
          'LISTENING',
          'INITIALIZING',
          'READY',
          'FAILED',
        ]);
        await expect(
          fetch(route(fixture, 'context'), {
            signal: AbortSignal.timeout(3_000),
          }),
        ).rejects.toThrow();
        await clientsClosed(fixture);
        await noAttendance(fixture);
        console.info(
          `E5-LISTENER-LOSS pid=${running.child.pid} runId=${fixture.input.runId} ownerAssertions=PASS exit=1 signal=null clients=0 raw=0 receipts=0 retainedDB=${fixture.name}`,
        );
      } finally {
        await running.stop();
        await fixture.close();
      }
    }, 180_000);

    it.each(['DEPARTURE', 'RESET', 'IDLE', 'ABSOLUTE'] as const)(
      'E5-%s uses A-issued continuation only after A exit and B independent admission',
      async (kind) => {
        const started = performance.now();
        const diagnose = (stage: string) => {
          if (kind === 'IDLE')
            console.info(
              `E5-IDLE DIAG elapsedMs=${Math.round(performance.now() - started)} ${stage}`,
            );
        };
        diagnose('PARENT_PREFLIGHT_AND_DISPOSABLE_PROVISION_START');
        const fixture = await provisionPointageNextFixture(process.env).catch(
          () => {
            diagnose('PREFLIGHT_OR_PROVISION_FAILED_NO_CHILD');
            throw new Error('E5 disposable preflight or provision failed.');
          },
        );
        diagnose(
          `DISPOSABLE_PROVISION_PASS db=${fixture.name} container=${fixture.containerId}`,
        );
        await requireFreshFixture(fixture).catch(() => {
          diagnose('PARENT_FRESH_FIXTURE_CHECK_FAILED');
          throw new Error('E5 fresh fixture check failed.');
        });
        diagnose('PARENT_PREFLIGHT_PASS');
        await noAttendance(fixture);
        const a = launchPointageNextChild(fixture.input, process.env);
        diagnose(`A_SPAWN pid=${a.child.pid} runId=${fixture.input.runId}`);
        let b: Running | undefined;
        try {
          await ready(fixture, a, (stage) => diagnose(`A_${stage}`));
          diagnose('A_D1_D1a_SAME_DB_PRIVILEGE_F8_PROVIDER_FACTORY_PASS');
          const identified = await fetch(route(fixture, 'identify'), {
            method: 'POST',
            headers: {
              Origin: base.origin,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ credential: fixture.credential }),
            signal: AbortSignal.timeout(15_000),
          });
          expect(identified.status).toBe(200);
          diagnose('A_IDENTIFY_SCOPED_PREREQUISITES_PASS');
          // Do not retain the employee state/identity; only the opaque token.
          const token = pointageIdentifyResponseSchema.parse(
            await identified.json(),
          ).continuation;
          const original = await continuation(fixture);
          expect(
            Number(original.absolute_ms) - Number(original.issued_ms),
          ).toBe(120_000);
          expect(Number(original.idle_ms) - Number(original.issued_ms)).toBe(
            60_000,
          );
          expect(
            (await databaseNow(fixture)) < Number(original.idle_ms) - 15_000,
          ).toBe(true);
          await a.stop();
          expect(a.child.exitCode).toBe(0);
          expect(a.child.signalCode).toBeNull();
          await clientsClosed(fixture);
          diagnose('A_STOP_EXIT_0_CLIENTS_CLOSED_PASS');
          expect(
            JSON.stringify(await continuation(fixture)) ===
              JSON.stringify(original),
          ).toBe(true);
          await noAttendance(fixture);
          await requireFreshFixture(fixture);
          if (kind === 'DEPARTURE') {
            await fixture.admin
              .connection`update public.personnel_employee_dossiers set departure_date='2020-01-01' where organization_id=${fixture.scope.organizationId} and establishment_id=${fixture.scope.establishmentId} and id=${fixture.scope.personnelDossierId}`;
          }
          if (kind === 'RESET') {
            const [old] = await fixture.admin
              .connection`select id, credential_version, issued_by_user_id from public.pointage_employee_credentials where organization_id=${fixture.scope.organizationId} and establishment_id=${fixture.scope.establishmentId} and personnel_dossier_id=${fixture.scope.personnelDossierId} and superseded_at is null`;
            expect(
              old?.id === original.credential_id &&
                old?.credential_version === original.credential_version,
            ).toBe(true);
            const keys = derivePointageCredentialKeys(
              decodePointageAuthSecret(fixture.input.encodedAuthSecret),
            );
            const reset = await createPointageRepository(
              fixture.admin.db,
            ).resetCredential({
              scope: fixture.scope,
              personnelDossierId: fixture.scope.personnelDossierId,
              managerUserId: String(old!.issued_by_user_id),
              now: new Date(),
              createMaterial: async () => {
                const credential = generatePointageCredential();
                return {
                  ...(await createPointageCredentialVerifier(keys, credential)),
                  credentialFormatVersion: POINTAGE_CREDENTIAL_FORMAT_VERSION,
                  lookupDigest: createPointageLookupDigest(
                    keys,
                    fixture.scope,
                    credential,
                  ),
                };
              },
            });
            const current = await fixture.admin
              .connection`select id, credential_version from public.pointage_employee_credentials where organization_id=${fixture.scope.organizationId} and establishment_id=${fixture.scope.establishmentId} and personnel_dossier_id=${fixture.scope.personnelDossierId} and superseded_at is null`;
            expect(
              current.length === 1 &&
                current[0]?.id === reset.credentialId &&
                current[0]?.credential_version ===
                  Number(original.credential_version) + 1 &&
                current[0]?.id !== original.credential_id,
            ).toBe(true);
          }
          const runIdB = randomUUID();
          // Only original approved INIT configuration crosses; no A runtime/client.
          b = launchPointageNextChild(
            { ...fixture.input, runId: runIdB },
            process.env,
          );
          diagnose(`B_SPAWN pid=${b.child.pid} runId=${runIdB}`);
          await ready(fixture, b, (stage) => diagnose(`B_${stage}`));
          expect(
            b.child.pid !== a.child.pid && runIdB !== fixture.input.runId,
          ).toBe(true);
          expect(
            JSON.stringify(await continuation(fixture)) ===
              JSON.stringify(original),
          ).toBe(true);
          let beforeDenial = original;
          if (kind === 'IDLE') {
            await waitPast(fixture, Number(original.idle_ms));
            expect(
              (await databaseNow(fixture)) <
                Number(original.absolute_ms) - 5_000,
            ).toBe(true);
          } else if (kind === 'ABSOLUTE') {
            let last = original;
            while (
              (await databaseNow(fixture)) <
              Number(original.absolute_ms) - 25_000
            ) {
              expect(
                (await databaseNow(fixture)) < Number(last.idle_ms) - 5_000,
              ).toBe(true);
              const response = await state(fixture, token);
              expect(response.status).toBe(200);
              expect(
                pointageStateResponseSchema.safeParse(await response.json())
                  .success,
              ).toBe(true);
              const next = await continuation(fixture);
              expect(
                next.issued_at === original.issued_at &&
                  next.absolute_expires_at === original.absolute_expires_at &&
                  next.credential_id === original.credential_id &&
                  Number(next.idle_ms) >= Number(last.idle_ms) &&
                  Number(next.idle_ms) <= Number(original.absolute_ms),
              ).toBe(true);
              last = next;
              await pause(20_000);
            }
            expect(Number(last.idle_ms) === Number(original.absolute_ms)).toBe(
              true,
            );
            await waitPast(fixture, Number(original.absolute_ms));
            beforeDenial = last;
          } else {
            expect(
              (await databaseNow(fixture)) < Number(original.idle_ms) - 5_000,
            ).toBe(true);
          }
          const denied = await state(fixture, token);
          expect(denied.status).toBe(403);
          expect(await denied.json()).toEqual({
            code: 'POINTAGE_ACCESS_DENIED',
          });
          const now = await databaseNow(fixture);
          if (kind === 'DEPARTURE' || kind === 'RESET')
            expect(
              now < Number(original.idle_ms) &&
                now < Number(original.absolute_ms),
            ).toBe(true);
          if (kind === 'IDLE')
            expect(
              now > Number(original.idle_ms) &&
                now < Number(original.absolute_ms),
            ).toBe(true);
          expect(
            JSON.stringify(await continuation(fixture)) ===
              JSON.stringify(beforeDenial),
          ).toBe(true);
          await noAttendance(fixture);
          await b.stop();
          expect(b.child.exitCode).toBe(0);
          expect(b.child.signalCode).toBeNull();
          await clientsClosed(fixture);
          console.info(
            `E5-${kind} PID_A=${a.child.pid} PID_B=${b.child.pid} runId_A=${fixture.input.runId} runId_B=${runIdB} A_exit=0 A_clients=0 continuationSurvived=true endedUnchanged=true originalDeadlines=true B_freshAdmission=true transfer=false route=state result=403_POINTAGE_ACCESS_DENIED rawBeforeAfter=0 receiptsBeforeAfter=0 elapsedMs=${Math.round(now - Number(original.issued_ms))} retainedDB=${fixture.name}`,
          );
        } finally {
          diagnose(
            `A_OUTCOME_BEFORE_TEARDOWN exit=${a.child.exitCode} signal=${a.child.signalCode} stages=${a.statuses.map((s) => s.stage).join(',')}`,
          );
          await a.stop();
          await b?.stop();
          try {
            await clientsClosed(fixture);
            diagnose(
              `TEARDOWN_CLIENTS_CLOSED_PASS A_exit=${a.child.exitCode} A_signal=${a.child.signalCode} B_exit=${b?.child.exitCode ?? 'NOT_STARTED'}`,
            );
            await new Promise<void>((done, reject) => {
              const probe = createServer();
              probe.once('error', reject);
              probe.listen(3001, '127.0.0.1', () =>
                probe.close((error) => (error ? reject(error) : done())),
              );
            });
            diagnose('PORT_3001_RELEASE_PASS');
          } finally {
            if (kind === 'IDLE') {
              // Bypass console reporter filtering, not IPC validation. No raw
              // message/identity/secret dump and no disk evidence side channel.
              try {
                process.stdout.write(
                  'E5-IDLE A ADMISSION_TRACE_V1\n' +
                    a.admissionTrace.formatEvidence(),
                  () => undefined,
                );
                if (b)
                  process.stdout.write(
                    'E5-IDLE B ADMISSION_TRACE_V1\n' +
                      b.admissionTrace.formatEvidence(),
                    () => undefined,
                  );
              } catch {
                /* Missing output is not permission to alter cleanup. */
              }
            }
            await fixture.close();
          }
        }
      },
      240_000,
    );

    it('E4 rejects controlled source byte drift and restores only the exact preimage after child exit', async () => {
      const bridge = resolve(
        __dirname,
        '../src/server/pointage/raw-clocking-bootstrap.ts',
      );
      const original = await readFile(bridge);
      const changed = Buffer.concat([
        original,
        Buffer.from(
          '\n// Pointage E4 controlled harmless source-byte drift.\n',
          'utf8',
        ),
      ]);
      const digest = (bytes: Buffer) =>
        createHash('sha256').update(bytes).digest('hex');
      const originalHash = digest(original);
      const changedHash = digest(changed);
      const fixture = await provisionPointageNextFixture(process.env);
      await requireFreshFixture(fixture);
      const running = launchPointageNextChild(fixture.input, process.env);
      let changedByTest = false;
      try {
        let ready = false;
        const contextUrl = `http://127.0.0.1:3001/api/pointage/${fixture.slug}/context`;
        for (
          let attempt = 0;
          attempt < 60 && running.child.exitCode === null;
          attempt++
        ) {
          try {
            const response = await fetch(contextUrl, {
              signal: AbortSignal.timeout(5_000),
            });
            ready = response.status === 200;
            await response.body?.cancel();
          } catch {
            /* Owned child startup only. */
          }
          if (ready) break;
          await new Promise((done) => setTimeout(done, 250));
        }
        expect(ready).toBe(true);
        running.requireReconsumerProof();
        expect((await readFile(bridge)).equals(original)).toBe(true);
        expect(changedHash).not.toBe(originalHash);
        // This single approved target is not a module-reevaluation/E3 trigger.
        await writeFile(bridge, changed);
        changedByTest = true;
        expect((await readFile(bridge)).equals(changed)).toBe(true);
        let unavailable: 'GENERIC_503' | 'CLOSED_TRANSPORT' | undefined;
        try {
          const response = await fetch(contextUrl, {
            signal: AbortSignal.timeout(5_000),
          });
          expect(response.status).toBe(503);
          expect(await response.json()).toEqual({
            code: 'POINTAGE_UNAVAILABLE',
          });
          unavailable = 'GENERIC_503';
        } catch (error) {
          if (!(error instanceof TypeError)) throw error;
          unavailable = 'CLOSED_TRANSPORT';
        }
        await running.stop();
        expect(running.child.exitCode).toBe(1);
        expect(running.child.signalCode).toBeNull();
        expect(
          running.statuses.filter(({ stage }) => stage === 'FAILED'),
        ).toHaveLength(1);
        expect(
          running.statuses.filter(({ stage }) => stage === 'INITIALIZING'),
        ).toHaveLength(1);
        expect(
          running.statuses.filter(({ stage }) => stage === 'READY'),
        ).toHaveLength(1);
        const remaining = await fixture.admin
          .connection`select count(*)::int as count from pg_stat_activity where datname=current_database() and usename in ('yuta_pointage_foundation_runtime','yuta_pointage_raw_writer')`;
        expect(remaining[0]?.count).toBe(0);
        // Sanitized parent evidence: no URLs, secrets, employee or attendance data.
        console.info(
          `E4 original=${originalHash} changed=${changedHash} exit=1 clients=0 denial=${unavailable}`,
        );
      } finally {
        await running.stop();
        if (changedByTest) {
          if (
            running.child.exitCode === null &&
            running.child.signalCode === null
          )
            throw new Error(
              'E4 restoration refused before confirmed child exit.',
            );
          if (!(await readFile(bridge)).equals(changed))
            throw new Error(
              'E4 restoration refused: controlled preimage drifted.',
            );
          await writeFile(bridge, original);
          expect((await readFile(bridge)).equals(original)).toBe(true);
          console.info(`E4 restored=${digest(await readFile(bridge))}`);
        }
        await fixture.close();
      }
    }, 180_000);

    it('rejects a failed second client, widened foundation privileges and helper body/ACL drift on actual child handles', async () => {
      const fixture = await provisionPointageNextFixture(process.env);
      async function refused(input = fixture.input) {
        await requireFreshFixture(fixture);
        const running = launchPointageNextChild(
          { ...input, runId: randomUUID() },
          process.env,
        );
        try {
          for (
            let attempt = 0;
            attempt < 60 && running.child.exitCode === null;
            attempt++
          ) {
            let response: Response | undefined;
            try {
              response = await fetch(
                `http://127.0.0.1:3001/api/pointage/${fixture.slug}/context`,
                { signal: AbortSignal.timeout(5_000) },
              );
            } catch {
              /* Startup/failure closes the socket. */
            }
            if (response) {
              expect(response.status).not.toBe(200);
              await response.body?.cancel();
            }
            if (running.statuses.some(({ stage }) => stage === 'FAILED')) break;
            await new Promise((done) => setTimeout(done, 250));
          }
          expect(
            running.statuses.some(({ stage }) => stage === 'INITIALIZING'),
            `Admission stages=${running.statuses.map(({ stage }) => stage).join(',')}; exit=${running.child.exitCode}; signal=${running.child.signalCode}`,
          ).toBe(true);
          expect(running.statuses.some(({ stage }) => stage === 'FAILED')).toBe(
            true,
          );
          expect(running.statuses.some(({ stage }) => stage === 'READY')).toBe(
            false,
          );
        } finally {
          await running.stop();
        }
        expect(running.child.exitCode).toBe(1);
        const connections = await fixture.admin
          .connection`select count(*)::int as count from pg_stat_activity where datname=current_database() and usename in ('yuta_pointage_foundation_runtime','yuta_pointage_raw_writer')`;
        expect(connections[0]?.count).toBe(0);
      }
      try {
        const bad = new URL(fixture.input.rawDatabaseUrl);
        bad.password = 'deliberately-invalid-synthetic-password';
        await refused({ ...fixture.input, rawDatabaseUrl: bad.toString() });
        await fixture.admin
          .connection`grant select on public.pointage_raw_events to yuta_pointage_foundation_runtime`;
        try {
          await refused();
        } finally {
          await fixture.admin
            .connection`revoke select on public.pointage_raw_events from yuta_pointage_foundation_runtime`;
        }
        await fixture.admin
          .connection`grant execute on function public.pointage_raw_lock_dossier(uuid,uuid,uuid) to public`;
        try {
          await refused();
        } finally {
          await fixture.admin
            .connection`revoke execute on function public.pointage_raw_lock_dossier(uuid,uuid,uuid) from public`;
        }
        const original = await fixture.admin
          .connection`select pg_get_functiondef('public.pointage_raw_lock_dossier(uuid,uuid,uuid)'::regprocedure) as definition`;
        const definition: unknown = original[0]?.definition;
        if (typeof definition !== 'string')
          throw new Error('Synthetic helper definition unavailable.');
        await fixture.admin.connection.unsafe(
          `create or replace function public.pointage_raw_lock_dossier(p_organization_id uuid, p_establishment_id uuid, p_personnel_dossier_id uuid) returns void language plpgsql security definer set search_path=pg_catalog as $test$ begin raise exception 'Synthetic rejection'; end $test$`,
        );
        try {
          await refused();
        } finally {
          await fixture.admin.connection.unsafe(definition);
        }
      } finally {
        await fixture.close();
      }
    }, 360_000);

    it('admits one actual runtime for concurrent routes and uses the existing child-derived stateGuard key', async () => {
      const fixture = await provisionPointageNextFixture(process.env);
      await requireFreshFixture(fixture);
      const running = launchPointageNextChild(fixture.input, process.env);
      try {
        const contextUrl = `http://127.0.0.1:3001/api/pointage/${fixture.slug}/context`;
        let available = false;
        const httpStatuses = new Set<number>();
        for (let attempt = 0; attempt < 120; attempt++) {
          if (running.child.exitCode !== null) break;
          try {
            const first = await Promise.all(
              Array.from({ length: 4 }, () =>
                fetch(contextUrl, { signal: AbortSignal.timeout(5_000) }),
              ),
            );
            for (const response of first) {
              httpStatuses.add(response.status);
              await response.body?.cancel();
            }
            available = first.every((response) => response.status === 200);
          } catch {
            /* Startup gate. */
          }
          if (available) break;
          await new Promise((done) => setTimeout(done, 500));
        }
        expect(
          available,
          `Actual Next admission; HTTP=${[...httpStatuses].join(',')}; stages=${running.statuses.map(({ stage }) => stage).join(',')}`,
        ).toBe(true);
        const responses = await Promise.all(
          Array.from({ length: 8 }, () => fetch(contextUrl)),
        );
        expect(responses.map((response) => response.status)).toEqual(
          Array(8).fill(200),
        );
        expect(
          running.statuses.filter(({ stage }) => stage === 'INITIALIZING'),
        ).toHaveLength(1);
        expect(
          running.statuses.filter(({ stage }) => stage === 'READY'),
        ).toHaveLength(1);
        const response = await fetch(
          contextUrl.replace('/context', '/identify'),
          {
            method: 'POST',
            headers: {
              Origin: base.origin,
              'Content-Type': 'application/json',
              Host: 'forged.example',
              Forwarded: 'for=203.0.113.4',
              'X-Forwarded-For': '203.0.113.5',
              'X-Real-IP': '203.0.113.6',
            },
            body: JSON.stringify({ credential: fixture.credential }),
          },
        );
        expect(response.status).toBe(200);
        const body = pointageIdentifyResponseSchema.parse(
          await response.json(),
        );
        expect(
          body.state.stateGuard ===
            createPointageStateGuard(
              derivePointageStateGuardKey(
                decodePointageAuthSecret(fixture.input.encodedAuthSecret),
              ),
              { ...fixture.scope, headEventId: null },
            ),
        ).toBe(true);
        const command = async (operation: string, payload: unknown) =>
          fetch(contextUrl.replace('/context', '/' + operation), {
            method: 'POST',
            headers: {
              Origin: base.origin,
              'Content-Type': 'application/json',
              Authorization: `Pointage ${body.continuation}`,
            },
            body: JSON.stringify(payload),
            signal: AbortSignal.timeout(15_000),
          });
        const stateResponse = await command('state', {});
        expect(stateResponse.status).toBe(200);
        const before = pointageStateResponseSchema.parse(
          await stateResponse.json(),
        );
        const requestId = randomUUID();
        const intent = {
          requestId,
          observedStateGuard: before.state.stateGuard,
        };
        const accepted = await command('clock-in', intent);
        expect(accepted.status).toBe(200);
        const receipt = pointageCommittedReceiptSchema.parse(
          await accepted.json(),
        );
        const recovered = await command('recover', {
          ...intent,
          kind: 'CLOCK_IN',
        });
        expect(recovered.status).toBe(200);
        expect(
          JSON.stringify(await recovered.json()) === JSON.stringify(receipt),
        ).toBe(true);
        const after = pointageStateResponseSchema.parse(
          await (await command('state', {})).json(),
        );
        expect(after.state.status).toBe('CLOCKED_IN');
        expect(
          (
            await command('clock-out', {
              requestId: randomUUID(),
              observedStateGuard: after.state.stateGuard,
            })
          ).status,
        ).toBe(200);
        expect((await command('end', {})).status).toBe(204);
        expect((await command('state', {})).status).toBe(403);

        // Historical mtime-only attempt FAILED: no new factory was observed.
        // This is independent re-consumer proof, never actual Next HMR proof.
        running.requireReconsumerProof();
        expect(
          running.statuses.filter(({ stage }) => stage === 'INITIALIZING'),
        ).toHaveLength(1);
        expect(
          running.statuses.filter(({ stage }) => stage === 'READY'),
        ).toHaveLength(1);
        const connections = await fixture.admin
          .connection`select usename, count(*)::int as count from pg_stat_activity where datname=current_database() and usename in ('yuta_pointage_foundation_runtime','yuta_pointage_raw_writer') group by usename order by usename`;
        expect(connections.map((row) => row.count)).toEqual([1, 1]);

        const freshIdentification = await fetch(
          contextUrl.replace('/context', '/identify'),
          {
            method: 'POST',
            headers: {
              Origin: base.origin,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ credential: fixture.credential }),
            signal: AbortSignal.timeout(15_000),
          },
        );
        expect(freshIdentification.status).toBe(200);
        const prior = pointageIdentifyResponseSchema.parse(
          await freshIdentification.json(),
        );
        await running.stop();
        expect(running.child.exitCode).toBe(0);

        // Standard Next CLI has no owner/anchor/provider even with synthetic flags.
        // A persisted old continuation is not enough to enable that process.
        const normal = fork(
          resolve(__dirname, '../node_modules/next/dist/bin/next'),
          ['dev', '--hostname', '127.0.0.1', '-p', '3001'],
          {
            cwd: resolve(__dirname, '..'),
            env: pointageChildEnvironment(process.env),
            execArgv: [],
            stdio: ['ignore', 'pipe', 'pipe', 'ipc'],
          },
        );
        normal.stdout?.resume();
        normal.stderr?.resume();
        try {
          let denied = false;
          for (
            let attempt = 0;
            attempt < 60 && normal.exitCode === null;
            attempt++
          ) {
            try {
              const response = await fetch(contextUrl, {
                signal: AbortSignal.timeout(5_000),
              });
              denied =
                response.status === 503 &&
                ((await response.json()) as { code?: string }).code ===
                  'POINTAGE_UNAVAILABLE';
            } catch {
              /* Wait for normal Next startup only. */
            }
            if (denied) break;
            await new Promise((done) => setTimeout(done, 250));
          }
          expect(denied).toBe(true);
          const noProvider = await fetch(
            contextUrl.replace('/context', '/state'),
            {
              method: 'POST',
              headers: {
                Origin: base.origin,
                'Content-Type': 'application/json',
                Authorization: `Pointage ${prior.continuation}`,
              },
              body: '{}',
              signal: AbortSignal.timeout(15_000),
            },
          );
          expect(noProvider.status).toBe(503);
        } finally {
          if (normal.exitCode === null && normal.signalCode === null) {
            const exit = new Promise<void>((done) =>
              normal.once('exit', () => done()),
            );
            normal.kill('SIGTERM');
            const timer = setTimeout(() => {
              if (normal.exitCode === null && normal.signalCode === null)
                normal.kill('SIGKILL');
            }, 20_000);
            try {
              await exit;
            } finally {
              clearTimeout(timer);
            }
          }
        }
        await requireFreshFixture(fixture);
        const restarted = launchPointageNextChild(
          { ...fixture.input, runId: randomUUID() },
          process.env,
        );
        try {
          let ready = false;
          for (
            let attempt = 0;
            attempt < 60 && restarted.child.exitCode === null;
            attempt++
          ) {
            try {
              const response = await fetch(contextUrl, {
                signal: AbortSignal.timeout(5_000),
              });
              ready = response.status === 200;
              await response.body?.cancel();
            } catch {
              /* Fresh generation. */
            }
            if (ready) break;
            await new Promise((done) => setTimeout(done, 250));
          }
          expect(ready).toBe(true);
          expect(restarted.child.pid !== running.child.pid).toBe(true);
          expect(
            restarted.statuses.filter(({ stage }) => stage === 'INITIALIZING'),
          ).toHaveLength(1);
          restarted.requireReconsumerProof();
          const smoke = await fetch(base.origin + '/', {
            redirect: 'manual',
            signal: AbortSignal.timeout(30_000),
          });
          expect(smoke.status).toBe(307);
          expect(smoke.headers.get('location')).toBe('/aujourdhui');
          await smoke.body?.cancel();
          console.info('E5-NON-POINTAGE-SMOKE root=307 location=/aujourdhui');
          restarted.child.disconnect();
          await restarted.stop();
          // IPC loss is terminal failure, not the successful STOP path.
          expect(restarted.child.exitCode).toBe(1);
          expect(restarted.child.signalCode).toBeNull();
          const remaining = await fixture.admin
            .connection`select count(*)::int as count from pg_stat_activity where datname=current_database() and usename in ('yuta_pointage_foundation_runtime','yuta_pointage_raw_writer')`;
          expect(remaining[0]?.count).toBe(0);
          const rows = await fixture.admin
            .connection`select count(*)::int as count from public.pointage_raw_events where organization_id=${fixture.scope.organizationId} and establishment_id=${fixture.scope.establishmentId} and personnel_dossier_id=${fixture.scope.personnelDossierId}`;
          expect(rows[0]?.count).toBe(2);
          console.info(
            `E5-IPC-DISCONNECT pid=${restarted.child.pid} exit=1 signal=null clients=0; E5-CLEAN-STOP pid=${running.child.pid} exit=0; E5-NO-OWNER context/state=503; E5-FRESH-PROCESS admission=PASS`,
          );
        } finally {
          await restarted.stop();
        }
      } finally {
        await running.stop();
        await fixture.close();
      }
    }, 360_000);
  });
