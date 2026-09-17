import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { createServer, type Server } from 'node:http';
import { join, relative, resolve } from 'node:path';
import process from 'node:process';
import { isMainThread } from 'node:worker_threads';
import next from 'next';
import { z } from 'zod';
import {
  decodePointageAuthSecret,
  derivePointageStateGuardKey,
} from '@yuta/auth';
import {
  openPointageTestClient,
  requirePointageTestConfiguration,
} from '../../../../packages/db-cloud/test/helpers/pointage-raw-clocking-test-database';
import type { createPointageRawClockingRuntime } from '../../src/server/pointage/raw-clocking-runtime';

const origin = 'http://127.0.0.1:3001';
const root = resolve(__dirname, '../../../..');
const uuid = z
  .string()
  .uuid()
  .regex(
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/u,
  );
export const pointageTestInitSchema = z
  .object({
    type: z.literal('POINTAGE_TEST_INIT'),
    version: z.literal(1),
    runId: uuid,
    parentPid: z.number().int().positive(),
    childPid: z.number().int().positive(),
    origin: z.literal(origin),
    listenHost: z.literal('127.0.0.1'),
    listenPort: z.literal(3001),
    foundationDatabaseUrl: z.string().min(1),
    rawDatabaseUrl: z.string().min(1),
    encodedAuthSecret: z
      .string()
      .length(43)
      .regex(/^[A-Za-z0-9_-]{42}[AEIMQUYcgkosw048]$/u),
  })
  .strict();
export type PointageTestInit = z.infer<typeof pointageTestInitSchema>;
export const pointageTestStopSchema = z
  .object({
    type: z.literal('POINTAGE_TEST_STOP'),
    version: z.literal(1),
    runId: uuid,
  })
  .strict();
export const pointageAdmissionTraceStageSchema = z.enum([
  'PROCESS_STARTED',
  'LISTENER_BOUND',
  'INIT_VALIDATED',
  'FOUNDATION_CLIENT_OPENED',
  'RAW_CLIENT_OPENED',
  'PROVIDER_ADMISSION_VERIFIED',
  'RUNTIME_FACTORY_ENTERED',
  'RUNTIME_FACTORY_COMPLETED',
  'READY_EMITTED',
  'TEARDOWN_STARTED',
  'FOUNDATION_CLIENT_CLOSED',
  'RAW_CLIENT_CLOSED',
  'LISTENER_CLOSED',
  'PROCESS_TERMINATING',
]);
export const pointageAdmissionTraceFailureSchema = z.enum([
  'PRECHECK',
  'LISTENER',
  'INIT',
  'FOUNDATION_CLIENT',
  'RAW_CLIENT',
  'SAME_DATABASE',
  'PRIVILEGES',
  'F8',
  'PROVIDER',
  'RUNTIME_FACTORY',
  'TEARDOWN',
  'HARNESS_ORCHESTRATION',
  'UNKNOWN',
]);
export const pointageAdmissionTraceSchema = z
  .object({
    type: z.literal('POINTAGE_TEST_ADMISSION_TRACE'),
    version: z.literal(1),
    runId: uuid,
    childPid: z.number().int().positive().safe(),
    seq: z.number().int().positive().safe(),
    stage: pointageAdmissionTraceStageSchema,
    state: z.enum(['ENTER', 'PASS', 'FAIL']),
    failureClass: pointageAdmissionTraceFailureSchema.optional(),
  })
  .strict()
  .superRefine((value, context) => {
    if (
      value.state === 'FAIL'
        ? value.failureClass === undefined
        : Object.hasOwn(value, 'failureClass')
    )
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Invalid trace failure state.',
      });
  });
export type PointageAdmissionTrace = z.infer<
  typeof pointageAdmissionTraceSchema
>;
type AdmissionTraceStage = PointageAdmissionTrace['stage'];
type AdmissionTraceFailureClass = NonNullable<
  PointageAdmissionTrace['failureClass']
>;
type TraceObservation = Pick<
  PointageAdmissionTrace,
  'stage' | 'state' | 'failureClass'
>;

// One-way evidence only. Buffer the two process-start observations until the
// existing diagnostic UUID is available; never wait for an acknowledgement.
export function createPointageAdmissionTraceEmitter(
  send: (message: PointageAdmissionTrace) => void,
) {
  let identity: { runId: string; childPid: number } | undefined;
  let seq = 0;
  const pending: TraceObservation[] = [];
  const publish = (observation: TraceObservation) => {
    if (!identity) {
      pending.push(observation);
      return;
    }
    const message = {
      type: 'POINTAGE_TEST_ADMISSION_TRACE' as const,
      version: 1 as const,
      ...identity,
      seq: ++seq,
      ...observation,
    };
    try {
      send(message);
    } catch {
      /* IPC loss cannot change admission/cleanup. */
    }
  };
  return {
    bind(runId: string, childPid: number) {
      if (identity) return;
      identity = { runId, childPid };
      for (const observation of pending.splice(0)) publish(observation);
    },
    enter: (stage: AdmissionTraceStage) => publish({ stage, state: 'ENTER' }),
    pass: (stage: AdmissionTraceStage) => publish({ stage, state: 'PASS' }),
    fail: (
      stage: AdmissionTraceStage,
      failureClass: AdmissionTraceFailureClass,
    ) => publish({ stage, state: 'FAIL', failureClass }),
  };
}
type Stage = 'LISTENING' | 'INITIALIZING' | 'READY' | 'FAILED' | 'STOPPED';
type Runtime = Awaited<ReturnType<typeof createPointageRawClockingRuntime>>;
type Client = Awaited<ReturnType<typeof openPointageTestClient>>;

type AccessorPairFactory = () => readonly [
  () => Promise<Runtime>,
  () => Promise<Runtime>,
];
type ReconsumerSnapshot = Readonly<{
  pid: number;
  runId: string | undefined;
  mainThread: boolean;
  listener: object;
  inventory: string;
  descriptor: PropertyDescriptor | undefined;
  runtime: object | undefined;
  foundation: object | undefined;
  foundationDb: object | undefined;
  foundationConnection: object | undefined;
  raw: object | undefined;
  rawDb: object | undefined;
  rawConnection: object | undefined;
  runtimeCount: number;
  foundationCount: number;
  rawCount: number;
}>;

function requireProof(condition: boolean): asserts condition {
  if (!condition) throw new Error('Pointage re-consumer proof failed.');
}

function assertGeneration(
  before: ReconsumerSnapshot,
  after: ReconsumerSnapshot,
) {
  const descriptor = after.descriptor;
  requireProof(
    before.pid === after.pid &&
      before.runId === after.runId &&
      after.mainThread &&
      before.mainThread &&
      before.listener === after.listener &&
      before.inventory === after.inventory &&
      !!descriptor &&
      !!before.descriptor &&
      descriptor.value === before.descriptor.value &&
      descriptor.enumerable === false &&
      descriptor.writable === false &&
      descriptor.configurable === false &&
      before.descriptor.enumerable === false &&
      before.descriptor.writable === false &&
      before.descriptor.configurable === false &&
      Object.isFrozen(descriptor.value) &&
      Reflect.ownKeys(descriptor.value).length === 1 &&
      typeof descriptor.value.admit === 'function',
  );
}

// Test-only detector exports; never imported by the application/browser.
export function assertPointageReconsumerSnapshot(
  before: ReconsumerSnapshot,
  after: ReconsumerSnapshot,
) {
  assertGeneration(before, after);
  for (const key of [
    'runtime',
    'foundation',
    'foundationDb',
    'foundationConnection',
    'raw',
    'rawDb',
    'rawConnection',
  ] as const)
    requireProof(!!before[key] && before[key] === after[key]);
  for (const key of ['runtimeCount', 'foundationCount', 'rawCount'] as const)
    requireProof(before[key] === 1 && after[key] === 1);
}

export function assertPointageReconsumerFacade(
  expected: object,
  actual: object,
) {
  requireProof(expected === actual);
}

export function provePointageReconsumers(
  authoritative: Promise<Runtime>,
  pairFactory: AccessorPairFactory,
  snapshot: () => ReconsumerSnapshot,
): Promise<void> {
  // Synchronous E2: the owner has reserved its promise, but initialize has not
  // run its first microtask. Each closure executes the actual bridge resolver.
  const initial = snapshot();
  const first = pairFactory();
  requireProof(first.length === 2 && first[0] !== first[1]);
  requireProof(first[0]() === authoritative);
  requireProof(first[1]() === authoritative);
  assertGeneration(initial, snapshot());
  // This observer must NEVER be awaited by authoritative itself.
  return authoritative.then(async (facade) => {
    const baseline = snapshot();
    assertGeneration(initial, baseline);
    assertPointageReconsumerSnapshot(baseline, baseline);
    const second = pairFactory();
    requireProof(
      second.length === 2 && new Set([...first, ...second]).size === 4,
    );
    const promises = second.map((accessor) => accessor());
    requireProof(promises.every((value) => value === authoritative));
    const facades = await Promise.all(promises);
    for (const value of facades) assertPointageReconsumerFacade(facade, value);
    assertPointageReconsumerSnapshot(baseline, snapshot());
  });
}

export function pointageSourceInventory() {
  const paths: string[] = [];
  function walk(path: string) {
    if (!existsSync(path)) throw new Error('Pointage source is unavailable.');
    for (const entry of readdirSync(path, { withFileTypes: true })) {
      if (entry.isSymbolicLink())
        throw new Error('Pointage source is unavailable.');
      const child = join(path, entry.name);
      if (entry.isDirectory()) walk(child);
      else if (entry.isFile()) paths.push(child);
    }
  }
  for (const path of [
    'apps/backoffice/src',
    ...['auth', 'contracts', 'db-cloud', 'tenant'].map(
      (name) => `packages/${name}/src`,
    ),
  ])
    walk(join(root, path));
  for (const path of [
    'apps/backoffice/test/helpers/pointage-raw-clocking-launcher.ts',
    'apps/backoffice/test/helpers/pointage-raw-clocking-next-child.ts',
    'packages/db-cloud/test/helpers/pointage-raw-clocking-test-database.ts',
    'apps/backoffice/next.config.ts',
    'apps/backoffice/tsconfig.json',
    'apps/backoffice/package.json',
    'package.json',
    'pnpm-lock.yaml',
    ...['auth', 'contracts', 'db-cloud', 'tenant'].flatMap((name) => [
      `packages/${name}/package.json`,
      `packages/${name}/tsconfig.json`,
    ]),
  ])
    paths.push(join(root, path));
  return createHash('sha256')
    .update(
      paths
        .sort()
        .map(
          (path) =>
            `${relative(root, path).replaceAll('\\', '/')}\0${createHash('sha256').update(readFileSync(path)).digest('hex')}\n`,
        )
        .join(''),
    )
    .digest('hex');
}

export function validatePointageTestInit(
  message: unknown,
  environment: NodeJS.ProcessEnv,
  parentPid: number,
  childPid: number,
) {
  if (Buffer.byteLength(JSON.stringify(message) ?? '') > 16_384)
    throw new Error('Pointage initialization refused.');
  const input = pointageTestInitSchema.parse(message);
  if (
    input.parentPid !== parentPid ||
    input.childPid !== childPid ||
    !['development', 'test'].includes(environment.NODE_ENV ?? '') ||
    environment.VERCEL !== undefined ||
    environment.YUTA_POINTAGE_SYNTHETIC_TEST_MODE !== 'true' ||
    environment.POINTAGE_TEST_ORIGIN !== origin
  )
    throw new Error('Pointage initialization refused.');
  const projected = {
    ...environment,
    CLOUD_DATABASE_URL: input.foundationDatabaseUrl,
  };
  const foundation = requirePointageTestConfiguration(
    projected,
    input.foundationDatabaseUrl,
  );
  const raw = requirePointageTestConfiguration(projected, input.rawDatabaseUrl);
  if (
    foundation.target.hostname !== raw.target.hostname ||
    (foundation.target.port || '5432') !== (raw.target.port || '5432') ||
    foundation.name !== raw.name ||
    foundation.target.username !== 'yuta_pointage_foundation_runtime' ||
    raw.target.username !== 'yuta_pointage_raw_writer'
  )
    throw new Error('Pointage initialization refused.');
  return input;
}

export function requirePointageListener(server: Server) {
  const address = server.address();
  if (
    !server.listening ||
    !address ||
    typeof address === 'string' ||
    address.address !== '127.0.0.1' ||
    address.port !== 3001 ||
    `http://${address.address}:${address.port}` !== origin
  )
    throw new Error('Pointage listener is unavailable.');
}

export function pointageChildProofMode(args: readonly string[]) {
  if (args.length === 0) return 'normal' as const;
  if (args.length === 1 && args[0] === '--serve-listener-loss-proof')
    return 'listener-loss' as const;
  if (args.length === 1 && args[0] === '--serve-provider-unavailable-proof')
    return 'provider-unavailable' as const;
  throw new Error('Pointage child arguments refused.');
}

export function pointageListenerProofMode(args: readonly string[]): boolean {
  return pointageChildProofMode(args) === 'listener-loss';
}

// Internal proof verdict, not an IPC payload or application provider contract.
export function assertPointageProviderUnavailableProof(
  evidence: Readonly<{
    providerConstructions: number;
    providerCalls: number;
    unavailableResults: number;
    healthyResults: number;
    runtimeAttempts: number;
    readyCount: number;
    runtimePublished: boolean;
    factoryRejected: boolean;
    foundationCount: number;
    rawCount: number;
    closedClients: number;
    closeFailure: boolean;
    terminalFailure: boolean;
    listenerReleased: boolean;
    generationUnchanged: boolean;
  }>,
) {
  requireProof(
    evidence.providerConstructions === 1 &&
      evidence.providerCalls === 1 &&
      evidence.unavailableResults === 1 &&
      evidence.healthyResults === 0 &&
      evidence.runtimeAttempts === 1 &&
      evidence.readyCount === 0 &&
      !evidence.runtimePublished &&
      evidence.factoryRejected &&
      evidence.foundationCount === 1 &&
      evidence.rawCount === 1 &&
      evidence.closedClients === 2 &&
      !evidence.closeFailure &&
      evidence.terminalFailure &&
      evidence.listenerReleased &&
      evidence.generationUnchanged,
  );
}

export function assertPointageListenerLoss(
  listening: boolean,
  address: ReturnType<Server['address']>,
  guardRejected: boolean,
) {
  requireProof(!listening && address === null && guardRejected);
}

// TEST_ONLY entry. It hosts the existing Next app and never handles a business
// route. All ownership and bootstrap inputs stay in this actual process closure.
export async function runPointageNextChild() {
  // Fixed at launch, before any listener or client exists. Never an IPC selector.
  const proofMode = pointageChildProofMode(process.argv.slice(2));
  const listenerProof = proofMode === 'listener-loss';
  const providerProof = proofMode === 'provider-unavailable';
  if (!isMainThread || !process.send || !process.connected) {
    process.exitCode = 1;
    return;
  }
  const trace = createPointageAdmissionTraceEmitter((message) => {
    if (process.connected) process.send?.(message, () => undefined);
  });
  trace.enter('PROCESS_STARTED');
  trace.pass('PROCESS_STARTED');
  const inventory = pointageSourceInventory();
  let input: PointageTestInit | undefined;
  let diagnosticRunId: string | undefined;
  let seenInit = false;
  let closed = false;
  let nextReady = false;
  let state: Stage = 'INITIALIZING';
  let promise: Promise<Runtime> | undefined;
  let serviceRuntime: Runtime | undefined;
  let runtimeCount = 0;
  let foundationCount = 0;
  let rawCount = 0;
  let providerConstructions = 0;
  let providerCalls = 0;
  let unavailableResults = 0;
  let healthyResults = 0;
  let readyCount = 0;
  let factoryRejected = false;
  let providerAnchor: PropertyDescriptor | undefined;
  let proofStarted = false;
  let listenerLossEstablished = false;
  let finishListenerProof: (() => void) | undefined;
  let clientCloseFailure = false;
  let clientCloseCount = 0;
  let foundation: Client | undefined;
  let raw: Client | undefined;
  let decoded: Uint8Array | undefined;
  let guard: Uint8Array | undefined;
  let shutdown: Promise<void> | undefined;
  let application: ReturnType<typeof next> | undefined;
  const ended = new WeakSet<Client>();
  const sockets = new Set<import('node:net').Socket>();

  async function closeClient(client: Client | undefined) {
    if (!client || ended.has(client)) return;
    const traceStage =
      client === foundation ? 'FOUNDATION_CLIENT_CLOSED' : 'RAW_CLIENT_CLOSED';
    trace.enter(traceStage);
    ended.add(client);
    await client.connection.end({ timeout: 5 }).then(
      () => {
        clientCloseCount++;
        trace.pass(traceStage);
      },
      () => {
        clientCloseFailure = true;
        trace.fail(traceStage, 'TEARDOWN');
      },
    );
  }

  function report(stage: Stage) {
    if (stage === 'READY') {
      trace.enter('READY_EMITTED');
      readyCount++;
      // Prepared lifecycle emission, not delivery/IPC acknowledgement proof.
      trace.pass('READY_EMITTED');
    }
    if (!diagnosticRunId || !process.connected) return;
    process.send?.(
      {
        type: 'POINTAGE_TEST_STATUS',
        version: 1,
        runId: diagnosticRunId,
        childPid: process.pid,
        stage,
        ...(stage === 'FAILED' ? { code: 'POINTAGE_UNAVAILABLE' } : {}),
      },
      () => undefined,
    );
  }
  function live() {
    if (
      closed ||
      !input ||
      state === 'FAILED' ||
      !process.connected ||
      !isMainThread ||
      input.childPid !== process.pid ||
      input.parentPid !== process.ppid
    )
      throw new Error('Pointage runtime is unavailable.');
    validatePointageTestInit(input, process.env, process.ppid, process.pid);
    requirePointageListener(server);
    if (pointageSourceInventory() !== inventory)
      throw new Error('Pointage runtime is unavailable.');
  }
  function unavailable(response: import('node:http').ServerResponse) {
    response.writeHead(503, {
      'Content-Type': 'application/json',
      'Cache-Control': 'private, no-store, max-age=0',
    });
    response.end('{"code":"POINTAGE_UNAVAILABLE"}');
  }
  const server = createServer((request, response) => {
    if (!nextReady || closed) return unavailable(response);
    try {
      live();
      if (
        request.socket.localAddress !== '127.0.0.1' ||
        request.socket.localPort !== 3001
      )
        throw new Error('Pointage listener is unavailable.');
      void application!
        .getRequestHandler()(request, response)
        .catch(() => {
          if (!response.headersSent) unavailable(response);
          void stop(true);
        });
    } catch {
      unavailable(response);
      void stop(true);
    }
  });
  server.on('connection', (socket) => {
    sockets.add(socket);
    socket.once('close', () => sockets.delete(socket));
  });
  server.on('error', () => {
    void stop(true);
  });

  function stop(failed: boolean): Promise<void> {
    if (shutdown) return shutdown;
    trace.enter('TEARDOWN_STARTED');
    closed = true;
    state = failed ? 'FAILED' : 'STOPPED';
    trace.pass('TEARDOWN_STARTED');
    report(state);
    shutdown = (async () => {
      trace.enter('LISTENER_CLOSED');
      const drained = new Promise<void>((done) =>
        server.close(() => {
          if (!server.listening && server.address() === null)
            trace.pass('LISTENER_CLOSED');
          else trace.fail('LISTENER_CLOSED', 'TEARDOWN');
          done();
        }),
      );
      await Promise.race([
        drained,
        new Promise<void>((done) => {
          const timer = setTimeout(done, 10_000);
          timer.unref();
        }),
      ]);
      for (const socket of sockets) socket.destroy();
      await Promise.all([
        closeClient(foundation),
        closeClient(raw),
        Promise.race([
          application?.close?.().catch(() => undefined),
          new Promise<void>((done) => {
            const timer = setTimeout(done, 5_000);
            timer.unref();
          }),
        ]),
      ]);
      let exitCode = failed ? 1 : 0;
      if (listenerProof) {
        try {
          requireProof(
            failed && listenerLossEstablished && !!finishListenerProof,
          );
          finishListenerProof!();
        } catch {
          exitCode = 2;
        }
      }
      if (providerProof) {
        try {
          const key = Symbol.for(
            'yuta.pointage.raw-clocking.test-bootstrap.v1',
          );
          const currentAnchor = Object.getOwnPropertyDescriptor(process, key);
          assertPointageProviderUnavailableProof({
            providerConstructions,
            providerCalls,
            unavailableResults,
            healthyResults,
            runtimeAttempts: runtimeCount,
            readyCount,
            runtimePublished: serviceRuntime !== undefined,
            factoryRejected,
            foundationCount,
            rawCount,
            closedClients: clientCloseCount,
            closeFailure:
              clientCloseFailure ||
              !foundation ||
              !raw ||
              !ended.has(foundation) ||
              !ended.has(raw),
            terminalFailure: failed && closed && state === 'FAILED',
            listenerReleased: !server.listening && server.address() === null,
            generationUnchanged:
              !!input &&
              isMainThread &&
              input.childPid === process.pid &&
              input.parentPid === process.ppid &&
              pointageSourceInventory() === inventory &&
              !!providerAnchor &&
              !!currentAnchor &&
              providerAnchor.value === currentAnchor.value &&
              currentAnchor.enumerable === false &&
              currentAnchor.configurable === false &&
              currentAnchor.writable === false &&
              Object.isFrozen(currentAnchor.value),
          });
        } catch {
          // Same proof/assertion failure convention as listener-loss: exit 1
          // is expected rejection only after ALL internal assertions pass.
          exitCode = 2;
        }
      }
      foundation = raw = undefined;
      serviceRuntime = undefined;
      promise = undefined;
      decoded?.fill(0);
      guard?.fill(0);
      decoded = guard = undefined;
      input = undefined;
      trace.enter('PROCESS_TERMINATING');
      if (process.connected) process.disconnect?.();
      // This process exists solely for the owned test generation. Next may
      // retain development watcher handles after close; never keep that dead
      // generation alive. A forced/uncertain commit is still not a rollback.
      process.exit(exitCode);
    })();
    return shutdown;
  }

  async function initialize(
    factory: typeof createPointageRawClockingRuntime,
  ): Promise<Runtime> {
    let failedStage: AdmissionTraceStage | undefined;
    let failedClass: AdmissionTraceFailureClass = 'UNKNOWN';
    let providerTraceEntered = false;
    let providerTraceFailed = false;
    try {
      live();
      report('INITIALIZING');
      const admitted = input!;
      decoded = decodePointageAuthSecret(admitted.encodedAuthSecret);
      guard = derivePointageStateGuardKey(decoded);
      const environment: NodeJS.ProcessEnv = {
        NODE_ENV: process.env.NODE_ENV,
        YUTA_POINTAGE_SYNTHETIC_TEST_MODE: 'true',
        POINTAGE_TEST_ORIGIN: origin,
        CLOUD_DATABASE_URL: admitted.foundationDatabaseUrl,
      };
      foundationCount++;
      failedStage = 'FOUNDATION_CLIENT_OPENED';
      failedClass = 'FOUNDATION_CLIENT';
      trace.enter(failedStage);
      foundation = await openPointageTestClient(
        environment,
        admitted.foundationDatabaseUrl,
      );
      trace.pass(failedStage);
      failedStage = undefined;
      if (closed) {
        await closeClient(foundation);
        throw new Error();
      }
      live();
      rawCount++;
      failedStage = 'RAW_CLIENT_OPENED';
      failedClass = 'RAW_CLIENT';
      trace.enter(failedStage);
      raw = await openPointageTestClient(environment, admitted.rawDatabaseUrl);
      trace.pass(failedStage);
      failedStage = undefined;
      if (closed) {
        await closeClient(raw);
        throw new Error();
      }
      live();
      trace.enter('RUNTIME_FACTORY_ENTERED');
      runtimeCount++;
      trace.pass('RUNTIME_FACTORY_ENTERED');
      failedStage = 'RUNTIME_FACTORY_COMPLETED';
      failedClass = 'UNKNOWN';
      trace.enter(failedStage);
      const runtime = await factory({
        environment,
        listeningHost: '127.0.0.1',
        foundationClient: foundation.db,
        rawClient: raw.db,
        encodedAuthSecret: admitted.encodedAuthSecret,
        stateGuardKey: guard,
        createSyntheticClientAddressProvider: () => {
          live();
          // The unchanged runtime invokes this only after both identity,
          // same-database, foundation privilege and raw F8 checks succeed.
          providerConstructions++;
          providerAnchor = Object.getOwnPropertyDescriptor(
            process,
            Symbol.for('yuta.pointage.raw-clocking.test-bootstrap.v1'),
          );
          return Object.freeze({
            getTrustedClientAddress: async () => {
              live();
              if (!serviceRuntime && !providerTraceEntered) {
                providerTraceEntered = true;
                trace.enter('PROVIDER_ADMISSION_VERIFIED');
              }
              providerCalls++;
              if (providerProof) {
                unavailableResults++;
                if (!serviceRuntime && !providerTraceFailed) {
                  providerTraceFailed = true;
                  trace.fail('PROVIDER_ADMISSION_VERIFIED', 'PROVIDER');
                }
                return null;
              }
              healthyResults++;
              return {
                address: '127.0.0.1',
                provenance: 'SERVER_VERIFIED' as const,
              };
            },
          });
        },
      });
      if (providerTraceEntered && !providerTraceFailed)
        trace.pass('PROVIDER_ADMISSION_VERIFIED');
      trace.pass('RUNTIME_FACTORY_COMPLETED');
      failedStage = undefined;
      live();
      serviceRuntime = runtime;
      state = 'READY';
      report('READY');
      // Preserve each service admission check. A live prerequisite failure is
      // terminal; ordinary domain denials/conflicts do not stop the generation.
      const call = async <T>(work: () => Promise<T>): Promise<T> => {
        try {
          live();
          const result = await work();
          live();
          if (
            result &&
            typeof result === 'object' &&
            'ok' in result &&
            result.ok === false &&
            'code' in result &&
            result.code === 'POINTAGE_UNAVAILABLE'
          )
            void stop(true);
          return result;
        } catch {
          void stop(true);
          throw new Error('Pointage runtime is unavailable.');
        }
      };
      return Object.freeze({
        context: (slug) => call(() => runtime.context(slug)),
        identify: (request) => call(() => runtime.identify(request)),
        readState: (request) => call(() => runtime.readState(request)),
        mutate: (request) => call(() => runtime.mutate(request)),
        recover: (request) => call(() => runtime.recover(request)),
        end: (request) => call(() => runtime.end(request)),
      } satisfies Runtime);
    } catch {
      if (failedStage && !providerTraceFailed)
        trace.fail(failedStage, failedClass);
      factoryRejected = serviceRuntime === undefined;
      // Do not await shutdown here: it drains this initialization promise.
      void stop(true);
      throw new Error('Pointage runtime is unavailable.');
    }
  }

  async function start(message: unknown) {
    let failedStage: AdmissionTraceStage | undefined;
    try {
      if (Buffer.byteLength(JSON.stringify(message) ?? '') > 16_384 && seenInit)
        throw new Error();
      if (seenInit) {
        const stopMessage = pointageTestStopSchema.parse(message);
        if (!input || stopMessage.runId !== input.runId) throw new Error();
        await stop(pointageSourceInventory() !== inventory);
        return;
      }
      seenInit = true;
      // Diagnostics may echo only a validated run UUID, never rejected input.
      const diagnostic = z.object({ runId: uuid }).safeParse(message);
      if (diagnostic.success) {
        diagnosticRunId = diagnostic.data.runId;
        trace.bind(diagnosticRunId, process.pid);
      }
      failedStage = 'INIT_VALIDATED';
      trace.enter(failedStage);
      input = validatePointageTestInit(
        message,
        process.env,
        process.ppid,
        process.pid,
      );
      trace.pass(failedStage);
      failedStage = 'LISTENER_BOUND';
      trace.enter(failedStage);
      await new Promise<void>((done, reject) => {
        server.once('error', reject);
        server.listen(3001, '127.0.0.1', () => {
          server.off('error', reject);
          done();
        });
      });
      trace.pass(failedStage);
      failedStage = undefined;
      if (closed) {
        server.close();
        return;
      }
      live();
      report('LISTENING');
      application = next({
        dev: true,
        dir: join(root, 'apps/backoffice'),
        hostname: '127.0.0.1',
        port: 3001,
        httpServer: server,
        quiet: true,
      });
      await application.prepare();
      if (closed) {
        await application.close?.();
        return;
      }
      live();
      const key = Symbol.for('yuta.pointage.raw-clocking.test-bootstrap.v1');
      if (Object.getOwnPropertyDescriptor(process, key)) throw new Error();
      Object.defineProperty(process, key, {
        enumerable: false,
        writable: false,
        configurable: false,
        value: Object.freeze({
          admit(
            factory: typeof createPointageRawClockingRuntime,
            pairFactory: AccessorPairFactory,
          ) {
            try {
              live();
              // Callback identity is not authority. A newly evaluated bridge
              // may supply different functions; the generation owns admission.
              if (!promise) {
                promise = Promise.resolve().then(() => initialize(factory));
                // Observe a terminal rejection even if a synchronous detector
                // fails before the caller can receive this reserved promise.
                void promise.catch(() => undefined);
              }
              if (!proofStarted) {
                proofStarted = true;
                const snapshot = (): ReconsumerSnapshot => {
                  live();
                  return {
                    pid: process.pid,
                    runId: input?.runId,
                    mainThread: isMainThread,
                    listener: server,
                    inventory: pointageSourceInventory(),
                    descriptor: Object.getOwnPropertyDescriptor(process, key),
                    runtime: serviceRuntime,
                    foundation,
                    foundationDb: foundation?.db,
                    foundationConnection: foundation?.connection,
                    raw,
                    rawDb: raw?.db,
                    rawConnection: raw?.connection,
                    runtimeCount,
                    foundationCount,
                    rawCount,
                  };
                };
                void provePointageReconsumers(promise, pairFactory, snapshot)
                  .then(() => {
                    live();
                    process.send?.(
                      {
                        type: 'POINTAGE_TEST_RECONSUMER_PROOF',
                        version: 1,
                        runId: input!.runId,
                        childPid: process.pid,
                        result: 'PASS',
                      },
                      () => undefined,
                    );
                    if (listenerProof) {
                      const before = snapshot();
                      requireProof(
                        state === 'READY' && !listenerLossEstablished,
                      );
                      assertPointageReconsumerSnapshot(before, before);
                      // The only fault action: close this generation's own public
                      // Node listener. No STOP, request, endpoint or new receipt.
                      server.close();
                      let rejected = false;
                      try {
                        live();
                      } catch {
                        rejected = true;
                      }
                      assertPointageListenerLoss(
                        server.listening,
                        server.address(),
                        rejected,
                      );
                      listenerLossEstablished = true;
                      finishListenerProof = () => {
                        assertGeneration(before, {
                          ...before,
                          pid: process.pid,
                          runId: input?.runId,
                          mainThread: isMainThread,
                          inventory: pointageSourceInventory(),
                          descriptor: Object.getOwnPropertyDescriptor(
                            process,
                            key,
                          ),
                        });
                        requireProof(
                          closed &&
                            state === 'FAILED' &&
                            !server.listening &&
                            server.address() === null &&
                            runtimeCount === 1 &&
                            foundationCount === 1 &&
                            rawCount === 1 &&
                            serviceRuntime === before.runtime &&
                            foundation === before.foundation &&
                            raw === before.raw &&
                            !!foundation &&
                            !!raw &&
                            ended.has(foundation) &&
                            ended.has(raw) &&
                            clientCloseCount === 2 &&
                            !clientCloseFailure,
                        );
                      };
                      void stop(true);
                    }
                  })
                  .catch(() => {
                    void stop(true);
                  });
              }
              return promise;
            } catch {
              void stop(true);
              return Promise.reject(
                new Error('Pointage runtime is unavailable.'),
              );
            }
          },
        }),
      });
      nextReady = true;
    } catch {
      if (failedStage)
        trace.fail(
          failedStage,
          failedStage === 'INIT_VALIDATED' ? 'INIT' : 'LISTENER',
        );
      await stop(true);
    }
  }
  process.on('message', (message) => {
    void start(message);
  });
  process.once('disconnect', () => {
    void stop(true);
  });
  process.once('SIGINT', () => {
    void stop(false);
  });
  process.once('SIGTERM', () => {
    void stop(false);
  });
}

if (
  resolve(process.argv[1] ?? '') ===
  join(__dirname, 'pointage-raw-clocking-next-child.ts')
) {
  void runPointageNextChild().catch(() => {
    process.exitCode = 1;
  });
}
