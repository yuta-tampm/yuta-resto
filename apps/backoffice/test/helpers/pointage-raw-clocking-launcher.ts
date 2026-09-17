import { fork, spawn, type ChildProcess } from 'node:child_process';
import { randomBytes, randomUUID } from 'node:crypto';
import { watch } from 'node:fs';
import { createServer } from 'node:net';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { z } from 'zod';
import {
  createPointageCredentialVerifier,
  createPointageLookupDigest,
  derivePointageCredentialKeys,
  generatePointageCredential,
  POINTAGE_CREDENTIAL_FORMAT_VERSION,
} from '@yuta/auth';
import { createPointageRepository } from '@yuta/db-cloud';
import {
  requirePointageTestConfiguration,
  openPointageTestClient,
  provisionPointageTestRoles,
  provisionPointageFoundationTestRole,
  pointageDisposableFoundationUrl,
  pointageDisposableWriterUrl,
} from '../../../../packages/db-cloud/test/helpers/pointage-raw-clocking-test-database';
import {
  pointageSourceInventory,
  pointageAdmissionTraceSchema,
  type PointageAdmissionTrace,
  type PointageTestInit,
} from './pointage-raw-clocking-next-child';

const root = resolve(__dirname, '../../../..');
const origin = 'http://127.0.0.1:3001';
const statusSchema = z
  .object({
    type: z.literal('POINTAGE_TEST_STATUS'),
    version: z.literal(1),
    runId: z.string().uuid(),
    childPid: z.number().int().positive(),
    stage: z.enum(['LISTENING', 'INITIALIZING', 'READY', 'FAILED', 'STOPPED']),
    code: z.literal('POINTAGE_UNAVAILABLE').optional(),
  })
  .strict();
export type PointageTestStatus = z.infer<typeof statusSchema>;

// Invalid trace invalidates evidence only; it must not stop/repair admission.
export function createPointageAdmissionTraceCollector(
  runId: string,
  childPid: number,
) {
  const rows: PointageAdmissionTrace[] = [];
  const entered = new Set<PointageAdmissionTrace['stage']>();
  const finished = new Set<PointageAdmissionTrace['stage']>();
  let invalid = false;
  let readyObserved = false;
  const refuse = (): never => {
    invalid = true;
    throw new Error('Pointage admission trace evidence refused.');
  };
  const requireValid = () => {
    if (invalid) refuse();
  };
  return {
    accept(message: unknown) {
      const parsed = pointageAdmissionTraceSchema.safeParse(message);
      if (
        invalid ||
        !parsed.success ||
        parsed.data.runId !== runId ||
        parsed.data.childPid !== childPid ||
        parsed.data.seq !== rows.length + 1
      )
        refuse();
      if (!parsed.success) return;
      const row = parsed.data;
      if (row.state === 'ENTER') {
        if (entered.has(row.stage)) refuse();
        entered.add(row.stage);
      } else {
        if (!entered.has(row.stage) || finished.has(row.stage)) refuse();
        finished.add(row.stage);
      }
      rows.push(Object.freeze(row));
    },
    observeReady() {
      requireValid();
      const expected = [
        'RUNTIME_FACTORY_COMPLETED:PASS',
        'READY_EMITTED:ENTER',
        'READY_EMITTED:PASS',
      ];
      if (
        readyObserved ||
        rows
          .slice(-3)
          .map((r) => `${r.stage}:${r.state}`)
          .join(',') !== expected.join(',') ||
        rows.some((r) => r.state === 'FAIL')
      )
        refuse();
      for (const stage of [
        'PROCESS_STARTED',
        'INIT_VALIDATED',
        'LISTENER_BOUND',
        'FOUNDATION_CLIENT_OPENED',
        'RAW_CLIENT_OPENED',
        'RUNTIME_FACTORY_ENTERED',
        'PROVIDER_ADMISSION_VERIFIED',
      ] as const)
        if (!rows.some((r) => r.stage === stage && r.state === 'PASS'))
          refuse();
      readyObserved = true;
    },
    requireValid,
    requireReadyEvidence() {
      requireValid();
      if (!readyObserved)
        throw new Error('Pointage admission trace READY evidence missing.');
    },
    formatEvidence() {
      const result = this.snapshot();
      const identity =
        result.valid && rows.length > 0 ? 'PASS' : 'NOT_ESTABLISHED';
      return (
        [
          'seq | stage | state | failureClass',
          ...result.rows.map(
            (r) =>
              `${r.seq} | ${r.stage} | ${r.state} | ${r.failureClass ?? '-'}`,
          ),
          `runId equality: ${identity}`,
          `PID equality: ${identity}`,
          `sequence monotonic: ${identity}`,
          `TRACE EVIDENCE: ${result.valid && rows.length > 0 ? 'VALID' : 'INVALID_OR_MISSING'}`,
          `LAST_ENTERED: ${result.lastEntered ?? 'NOT_OBSERVED'}`,
          `LAST_PASSED: ${result.lastPassed ?? 'NOT_OBSERVED'}`,
          `failureClass: ${result.failureClass}`,
        ].join('\n') + '\n'
      );
    },
    snapshot() {
      const lastEntered =
        rows.findLast((r) => r.state === 'ENTER')?.stage ?? null;
      const lastPassed =
        rows.findLast((r) => r.state === 'PASS')?.stage ?? null;
      const failureClass = invalid
        ? 'UNKNOWN'
        : (rows.findLast((r) => r.state === 'FAIL')?.failureClass ?? 'UNKNOWN');
      return Object.freeze({
        valid: !invalid,
        readyObserved,
        lastEntered,
        lastPassed,
        failureClass,
        rows: Object.freeze(
          rows.map(({ seq, stage, state, failureClass }) =>
            Object.freeze({
              seq,
              stage,
              state,
              ...(failureClass ? { failureClass } : {}),
            }),
          ),
        ),
      });
    },
  };
}

// No generic exit is sufficient: child exit 1 is proof-gated in this mode,
// while independent parent/database/listener observations are also mandatory.
export function assertPointageProviderUnavailableResult(
  result: Readonly<{
    exitCode: number | null;
    signalCode: string | null;
    stages: readonly string[];
    ownedClients: number;
    rawDelta: number;
    receiptDelta: number;
    listenerReleased: boolean;
  }>,
) {
  if (
    result.exitCode !== 1 ||
    result.signalCode !== null ||
    result.stages.join(',') !== 'LISTENING,INITIALIZING,FAILED' ||
    result.ownedClients !== 0 ||
    result.rawDelta !== 0 ||
    result.receiptDelta !== 0 ||
    !result.listenerReleased
  )
    throw new Error('Pointage provider-unavailable evidence refused.');
}

const reconsumerProofSchema = z
  .object({
    type: z.literal('POINTAGE_TEST_RECONSUMER_PROOF'),
    version: z.literal(1),
    runId: z.string().uuid(),
    childPid: z.number().int().positive(),
    result: z.literal('PASS'),
  })
  .strict();

// Private IPC evidence validation, not application readiness/authority.
export function createPointageReconsumerReceiptCollector(
  runId: string,
  childPid: number,
) {
  let received = false;
  let invalid = false;
  return {
    accept(message: unknown) {
      const parsed = reconsumerProofSchema.safeParse(message);
      if (
        invalid ||
        received ||
        !parsed.success ||
        parsed.data.runId !== runId ||
        parsed.data.childPid !== childPid
      ) {
        invalid = true;
        throw new Error('Pointage re-consumer evidence refused.');
      }
      received = true;
    },
    requireComplete() {
      if (!received || invalid)
        throw new Error('Pointage re-consumer evidence missing.');
    },
  };
}

export function pointageChildEnvironment(
  environment: NodeJS.ProcessEnv,
): NodeJS.ProcessEnv {
  // Validate before sanitizing; never erase VERCEL to manufacture eligibility.
  if (
    !['development', 'test'].includes(environment.NODE_ENV ?? '') ||
    environment.VERCEL !== undefined
  )
    throw new Error('Pointage test launch refused.');
  const result: NodeJS.ProcessEnv = { NODE_ENV: 'development' };
  for (const key of [
    'SystemRoot',
    'WINDIR',
    'COMSPEC',
    'PATH',
    'PATHEXT',
    'TEMP',
    'TMP',
  ]) {
    const actual = Object.keys(environment).find(
      (name) => name.toUpperCase() === key.toUpperCase(),
    );
    if (actual && environment[actual] !== undefined)
      result[key] = environment[actual];
  }
  return {
    ...result,
    NODE_ENV: 'development',
    YUTA_POINTAGE_SYNTHETIC_TEST_MODE: 'true',
    POINTAGE_TEST_ORIGIN: origin,
    NEXT_TELEMETRY_DISABLED: '1',
  };
}

export function spawnPointageNextChild(
  environment: NodeJS.ProcessEnv,
  mode?: '--serve-listener-loss-proof' | '--serve-provider-unavailable-proof',
) {
  if (
    mode !== undefined &&
    mode !== '--serve-listener-loss-proof' &&
    mode !== '--serve-provider-unavailable-proof'
  )
    throw new Error('Pointage child arguments refused.');
  const child = fork(
    join(__dirname, 'pointage-raw-clocking-next-child.ts'),
    mode === undefined ? [] : [mode],
    {
      cwd: join(root, 'apps/backoffice'),
      env: pointageChildEnvironment(environment),
      execArgv: [
        '--import',
        pathToFileURL(
          join(root, 'packages/db-cloud/node_modules/tsx/dist/loader.mjs'),
        ).href,
      ],
      stdio: ['ignore', 'pipe', 'pipe', 'ipc'],
    },
  );
  // Discard complete streams; sanitized IPC alone is observable test status.
  child.stdout?.resume();
  child.stderr?.resume();
  return child;
}

export async function stopPointageNextChild(
  child: ChildProcess,
  runId: string,
) {
  const pid = child.pid;
  if (!pid || child.exitCode !== null || child.signalCode !== null) return;
  const exited = new Promise<void>((done) => child.once('exit', () => done()));
  if (child.connected)
    child.send(
      { type: 'POINTAGE_TEST_STOP', version: 1, runId },
      () => undefined,
    );
  const timer = setTimeout(() => {
    // Only this exact fork handle/PID. Never kill an unrelated listener/process.
    if (
      child.pid === pid &&
      child.exitCode === null &&
      child.signalCode === null
    )
      child.kill('SIGKILL');
  }, 20_000);
  try {
    await exited;
  } finally {
    clearTimeout(timer);
  }
}

export function launchPointageNextChild(
  input: Omit<PointageTestInit, 'parentPid' | 'childPid'>,
  environment: NodeJS.ProcessEnv = process.env,
  mode?: '--serve-listener-loss-proof' | '--serve-provider-unavailable-proof',
) {
  const before = pointageSourceInventory();
  const child = spawnPointageNextChild(environment, mode);
  if (!child.pid) throw new Error('Pointage test launch refused.');
  const statuses: PointageTestStatus[] = [];
  const admissionTrace = createPointageAdmissionTraceCollector(
    input.runId,
    child.pid,
  );
  const proof = createPointageReconsumerReceiptCollector(
    input.runId,
    child.pid,
  );
  let invalidMessage = false;
  child.on('message', (message) => {
    if (
      typeof message === 'object' &&
      message !== null &&
      'type' in message &&
      message.type === 'POINTAGE_TEST_ADMISSION_TRACE'
    ) {
      try {
        admissionTrace.accept(message);
      } catch {
        /* Trace evidence remains invalid; runtime authority is unchanged. */
      }
      return;
    }
    if (
      typeof message === 'object' &&
      message !== null &&
      'type' in message &&
      message.type === 'POINTAGE_TEST_RECONSUMER_PROOF'
    ) {
      try {
        proof.accept(message);
      } catch {
        invalidMessage = true;
        void stopPointageNextChild(child, input.runId);
      }
      return;
    }
    const parsed = statusSchema.safeParse(message);
    if (
      !parsed.success ||
      parsed.data.childPid !== child.pid ||
      parsed.data.runId !== input.runId
    ) {
      invalidMessage = true;
      void stopPointageNextChild(child, input.runId);
      return;
    }
    if (parsed.data.stage === 'READY') {
      try {
        admissionTrace.observeReady();
      } catch {
        /* READY stays authoritative; trace evidence does not. */
      }
    }
    statuses.push(parsed.data);
  });
  const watcher = watch(root, { recursive: true }, (_event, file) => {
    const path = file?.toString().replaceAll('\\', '/');
    if (
      path &&
      !/^(?:apps\/backoffice\/(?:src\/|test\/helpers\/pointage-raw-clocking-|next\.config\.ts$|tsconfig\.json$|package\.json$)|packages\/(?:auth|contracts|db-cloud|tenant)\/(?:src\/|test\/helpers\/pointage-raw-clocking-test-database\.ts$|package\.json$|tsconfig\.json$)|package\.json$|pnpm-lock\.yaml$)/u.test(
        path,
      )
    )
      return;
    try {
      if (pointageSourceInventory() === before) return;
    } catch {
      /* Fail closed. */
    }
    void stopPointageNextChild(child, input.runId);
  });
  watcher.on('error', () => {
    void stopPointageNextChild(child, input.runId);
  });
  child.once('exit', () => watcher.close());
  child.send(
    { ...input, parentPid: process.pid, childPid: child.pid },
    () => undefined,
  );
  return {
    child,
    statuses,
    admissionTrace,
    requireValidMessages: () => {
      admissionTrace.requireValid();
      if (invalidMessage) throw new Error('Pointage child evidence refused.');
    },
    requireReconsumerProof: () => {
      admissionTrace.requireReadyEvidence();
      if (invalidMessage)
        throw new Error('Pointage re-consumer evidence refused.');
      proof.requireComplete();
    },
    stop: () => stopPointageNextChild(child, input.runId),
  };
}

function quietCommand(
  command: string,
  args: string[],
  environment: NodeJS.ProcessEnv,
  cwd = root,
): Promise<string> {
  return new Promise((done, reject) => {
    const child = spawn(command, args, {
      cwd,
      env: environment,
      windowsHide: true,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    const chunks: Buffer[] = [];
    child.stdout.on('data', (chunk: Buffer) => chunks.push(chunk));
    child.stderr.resume();
    child.once('error', () =>
      reject(new Error('Pointage disposable setup unavailable.')),
    );
    child.once('close', (code) =>
      code === 0
        ? done(Buffer.concat(chunks).toString('utf8').trim())
        : reject(new Error('Pointage disposable setup unavailable.')),
    );
  });
}

// Parent-only synthetic infrastructure. No shared DB, dotenv fallback, cleanup,
// production provider or independently generated stateGuard key exists here.
export async function provisionPointageNextFixture(
  environment: NodeJS.ProcessEnv = process.env,
) {
  const safe = pointageChildEnvironment(environment);
  await new Promise<void>((done, reject) => {
    const probe = createServer();
    probe.once('error', reject);
    probe.listen(3001, '127.0.0.1', () => probe.close(() => done()));
  });
  const runId = randomUUID();
  const suffix = runId.replaceAll('-', '').slice(0, 24);
  const name = `yuta_pointage_raw_clocking_test_${suffix}`;
  const password = randomBytes(32).toString('hex');
  const target = new URL(
    `postgres://pointage_bootstrap_20260908a:${password}@127.0.0.1:5432/${name}`,
  );
  const databasePort = await new Promise<number>((done, reject) => {
    const probe = createServer();
    probe.once('error', reject);
    probe.listen(0, '127.0.0.1', () => {
      const address = probe.address();
      if (
        !address ||
        typeof address === 'string' ||
        address.address !== '127.0.0.1'
      ) {
        probe.close();
        reject(new Error('Pointage disposable setup unavailable.'));
        return;
      }
      probe.close(() => done(address.port));
    });
  });
  target.port = String(databasePort);
  requirePointageTestConfiguration(safe, target.toString());
  // Docker must be the local Desktop engine, not a remote context/override.
  if (
    environment.DOCKER_HOST !== undefined ||
    environment.DOCKER_CONTEXT !== undefined
  )
    throw new Error('Pointage disposable setup unavailable.');
  const context = JSON.parse(
    await quietCommand('docker', ['context', 'inspect'], safe),
  ) as unknown;
  const endpoint = z
    .array(
      z.object({
        Endpoints: z.object({ docker: z.object({ Host: z.string() }) }),
      }),
    )
    .length(1)
    .parse(context)[0]!.Endpoints.docker.Host;
  if (
    ![
      'npipe:////./pipe/dockerDesktopLinuxEngine',
      'unix:///var/run/docker.sock',
    ].includes(endpoint)
  )
    throw new Error('Pointage disposable setup unavailable.');
  const containerId = await quietCommand(
    'docker',
    [
      'run',
      '-d',
      '--name',
      `yuta-pointage-next-${suffix}`,
      '--label',
      'yuta.change=pointage-usable-raw-clocking',
      '--label',
      `yuta.disposable-run=${suffix}`,
      '--publish',
      `127.0.0.1:${databasePort}:5432`,
      '--tmpfs',
      '/var/lib/postgresql/data:rw,size=512m',
      '--env',
      'POSTGRES_USER',
      '--env',
      'POSTGRES_PASSWORD',
      '--env',
      'POSTGRES_DB',
      'postgres:17',
    ],
    {
      ...safe,
      POSTGRES_USER: 'pointage_bootstrap_20260908a',
      POSTGRES_PASSWORD: password,
      POSTGRES_DB: name,
    },
  );
  if (!/^[a-f0-9]{64}$/u.test(containerId))
    throw new Error('Pointage disposable setup unavailable.');
  const portText = await quietCommand(
    'docker',
    ['port', containerId, '5432/tcp'],
    safe,
  );
  const port = /^127\.0\.0\.1:(\d+)$/u.exec(portText)?.[1];
  if (!port || port !== target.port)
    throw new Error('Pointage disposable setup unavailable.');
  const bootstrapUrl = target.toString();
  requirePointageTestConfiguration(safe, bootstrapUrl);
  let admin: Awaited<ReturnType<typeof openPointageTestClient>> | undefined;
  for (let attempt = 0; attempt < 40; attempt++) {
    try {
      admin = await openPointageTestClient(safe, bootstrapUrl);
      break;
    } catch {
      await new Promise((done) => setTimeout(done, 250));
    }
  }
  if (!admin) throw new Error('Pointage disposable setup unavailable.');
  const secret = randomBytes(32);
  let stage = 'role admission';
  try {
    await provisionPointageTestRoles(safe, bootstrapUrl, containerId);
    stage = 'journaled migration';
    await quietCommand(
      process.execPath,
      [
        join(root, 'packages/db-cloud/node_modules/drizzle-kit/bin.cjs'),
        'migrate',
      ],
      { ...safe, CLOUD_DATABASE_URL: bootstrapUrl },
      join(root, 'packages/db-cloud'),
    );
    stage = 'foundation admission';
    await provisionPointageFoundationTestRole(safe, bootstrapUrl, containerId);
    stage = 'synthetic fixture';
    const scope = {
      organizationId: randomUUID(),
      establishmentId: randomUUID(),
      personnelDossierId: randomUUID(),
    };
    const slug = `synthetic-next-${suffix}`;
    const userId = randomUUID();
    await admin.connection.begin(async (sql) => {
      await sql`insert into public.organizations(id,name,slug) values(${scope.organizationId},'Synthetic Next',${'synthetic-' + scope.organizationId})`;
      await sql`insert into public.establishments(id,organization_id,name,slug,timezone) values(${scope.establishmentId},${scope.organizationId},'Synthetic Next',${slug},'UTC')`;
      await sql`insert into public.personnel_employee_dossiers(id,organization_id,establishment_id,given_names,family_name,position,qualification,employment_term_type,work_time_category,entry_date) values(${scope.personnelDossierId},${scope.organizationId},${scope.establishmentId},'Synthetic','Next','Test','Test','indefinite','full_time','2020-01-01')`;
      await sql`insert into public.users(id,auth_provider_id,email) values(${userId},${'synthetic-' + userId},${userId + '@example.test'})`;
    });
    const keys = derivePointageCredentialKeys(secret);
    let credential = '';
    await createPointageRepository(admin.db).issueCredential({
      scope,
      personnelDossierId: scope.personnelDossierId,
      managerUserId: userId,
      now: new Date(),
      createMaterial: async () => {
        credential = generatePointageCredential();
        return {
          ...(await createPointageCredentialVerifier(keys, credential)),
          credentialFormatVersion: POINTAGE_CREDENTIAL_FORMAT_VERSION,
          lookupDigest: createPointageLookupDigest(keys, scope, credential),
        };
      },
    });
    const input = {
      type: 'POINTAGE_TEST_INIT',
      version: 1,
      runId,
      origin,
      listenHost: '127.0.0.1',
      listenPort: 3001,
      foundationDatabaseUrl: pointageDisposableFoundationUrl(bootstrapUrl),
      rawDatabaseUrl: pointageDisposableWriterUrl(bootstrapUrl),
      encodedAuthSecret: secret.toString('base64url'),
    } satisfies Omit<PointageTestInit, 'parentPid' | 'childPid'>;
    return {
      input,
      scope,
      slug,
      credential,
      containerId,
      name,
      admin,
      close: () => admin!.connection.end({ timeout: 5 }),
    };
  } catch {
    await admin.connection.end({ timeout: 5 });
    throw new Error(
      `Pointage disposable setup unavailable at ${stage}; evidence retained.`,
    );
  } finally {
    secret.fill(0);
  }
}

if (
  resolve(process.argv[1] ?? '') ===
  join(__dirname, 'pointage-raw-clocking-launcher.ts')
) {
  void (async () => {
    if (process.argv.length !== 3 || process.argv[2] !== '--serve')
      throw new Error();
    const fixture = await provisionPointageNextFixture();
    const running = launchPointageNextChild(fixture.input);
    process.once('SIGINT', () => {
      void running.stop();
    });
    process.once('SIGTERM', () => {
      void running.stop();
    });
    running.child.once('exit', () => {
      void fixture.close();
    });
  })().catch(() => {
    process.stderr.write('POINTAGE_UNAVAILABLE\n');
    process.exitCode = 1;
  });
}
