import { spawn } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { watch } from 'node:fs';
import { readFile, stat } from 'node:fs/promises';
import { createServer } from 'node:net';
import { join, resolve } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import { z } from 'zod';
import {
  createPointageCredentialVerifier,
  createPointageLookupDigest,
  decodePointageAuthSecret,
  derivePointageCredentialKeys,
  generatePointageCredential,
  POINTAGE_CREDENTIAL_FORMAT_VERSION,
} from '@yuta/auth';
import {
  pointageContextResponseSchema,
  pointageIdentifyResponseSchema,
} from '@yuta/contracts';
import { createPointageRepository } from '@yuta/db-cloud';
import {
  createPointageManualShadowProfile,
  launchPointageNextChild,
  pointageChildEnvironment,
  pointageManualShadowValues,
  provisionPointageNextFixture,
} from '../test/helpers/pointage-raw-clocking-launcher';
import { derivePointageRawChain } from '../src/server/pointage/raw-chain';

const root = resolve(__dirname, '../../..');
const app = join(root, 'apps/backoffice');
const origin = 'http://127.0.0.1:3001';
export const manualEnvFiles = Object.freeze([
  '.env.development.local',
  '.env.local',
  '.env.development',
  '.env',
] as const);
const osKeys = [
  'SystemRoot',
  'WINDIR',
  'COMSPEC',
  'PATH',
  'PATHEXT',
  'TEMP',
  'TMP',
  'USERPROFILE',
] as const;
const runtimeKeys = new Set([
  'YUTA_POINTAGE_SYNTHETIC_TEST_MODE',
  'POINTAGE_TEST_ORIGIN',
  'NEXT_TELEMETRY_DISABLED',
]);
const ciKeys = [
  'CI',
  'CONTINUOUS_INTEGRATION',
  'BUILD_NUMBER',
  'RUN_ID',
  'GITHUB_ACTIONS',
  'TF_BUILD',
  'TEAMCITY_VERSION',
  'JENKINS_URL',
  'BUILDKITE',
  'CIRCLECI',
  'GITLAB_CI',
];

export class ManualPointageError extends Error {
  constructor(readonly code: string) {
    super(`Pointage manual test: ${code}`);
    this.name = 'ManualPointageError';
  }
}

export function assertManualTerminal(inputTTY: boolean, outputTTY: boolean) {
  if (!inputTTY || !outputTTY)
    throw new ManualPointageError('INTERACTIVE_TERMINAL_REQUIRED');
}

export function inspectManualEnvironment(
  environment: NodeJS.ProcessEnv,
  files: Readonly<Record<string, string | undefined>>,
) {
  if (
    (environment.NODE_ENV !== undefined &&
      !['development', 'test'].includes(environment.NODE_ENV)) ||
    environment.VERCEL !== undefined ||
    ciKeys.some((key) => environment[key] !== undefined) ||
    environment.DOCKER_HOST !== undefined ||
    environment.DOCKER_CONTEXT !== undefined
  )
    throw new ManualPointageError('LOCAL_ENVIRONMENT_REQUIRED');
  const known = new Set(Object.keys(pointageManualShadowValues));
  if (
    Object.keys(files).some(
      (name) =>
        !manualEnvFiles.includes(name as (typeof manualEnvFiles)[number]),
    )
  )
    throw new ManualPointageError('ENV_INVENTORY_REFUSED');
  const inventory = manualEnvFiles.map((name) => {
    const contents = files[name];
    // Over-approximate dotenv key syntax (including export and colon syntax).
    // Only names survive this function; multiline false positives fail closed.
    const keys = [
      ...new Set(
        [
          ...(contents?.matchAll(
            /^\s*(?:export\s+)?([\w.-]+)\s*(?:=|:\s)/gmu,
          ) ?? []),
        ].map((match) => match[1]!),
      ),
    ].sort();
    if (keys.some((key) => !known.has(key)))
      throw new ManualPointageError('UNKNOWN_ENV_KEY');
    return Object.freeze({
      name,
      present: contents !== undefined,
      keys: Object.freeze(keys),
    });
  });
  const originalKeys = Object.keys(environment)
    .filter((key) =>
      /^(?:AUTH_|CLOUD_|GOOGLE_|REPUTATION_|YUTA_|NEXT_PUBLIC_|POINTAGE_)/u.test(
        key,
      ),
    )
    .sort();
  if (originalKeys.some((key) => !known.has(key) && !runtimeKeys.has(key)))
    throw new ManualPointageError('UNKNOWN_PROCESS_ENV_KEY');
  return Object.freeze({
    files: Object.freeze(inventory),
    originalKeys: Object.freeze(originalKeys),
  });
}

export function createManualEnvironment(
  environment: NodeJS.ProcessEnv,
  files: Readonly<Record<string, string | undefined>>,
) {
  const inventory = inspectManualEnvironment(environment, files);
  const source: NodeJS.ProcessEnv = {
    NODE_ENV: environment.NODE_ENV ?? 'development',
  };
  for (const key of osKeys) {
    const actual = Object.keys(environment).find(
      (name) => name.toUpperCase() === key.toUpperCase(),
    );
    if (actual !== undefined && environment[actual] !== undefined)
      source[key] = environment[actual];
  }
  const profile = createPointageManualShadowProfile(pointageManualShadowValues);
  return Object.freeze({
    environment: Object.freeze({
      ...pointageChildEnvironment(source, profile),
      // Docker Desktop resolves its current local context through this OS
      // directory. Next's existing child allowlist still excludes it.
      ...(source.USERPROFILE === undefined
        ? {}
        : { USERPROFILE: source.USERPROFILE }),
    }),
    profile,
    inventory,
  });
}

export function sealManualParentEnvironment(
  target: NodeJS.ProcessEnv,
  safe: Readonly<NodeJS.ProcessEnv>,
) {
  // Reused database guards launch Docker synchronously from this CLI process.
  // Seal that parent too; explicit child env alone does not cover those calls.
  for (const key of Object.keys(target)) delete target[key];
  for (const [key, value] of Object.entries(safe)) {
    if (value !== undefined) target[key] = value;
  }
}

export function assertManualParentEnvironment(
  target: NodeJS.ProcessEnv,
  safe: Readonly<NodeJS.ProcessEnv>,
) {
  const entries = (value: NodeJS.ProcessEnv) =>
    Object.entries(value)
      .filter((entry) => entry[1] !== undefined)
      .sort(([left], [right]) => left.localeCompare(right));
  if (JSON.stringify(entries(target)) !== JSON.stringify(entries(safe)))
    throw new ManualPointageError('PARENT_ENV_CHANGED');
}

type ManualRunningEvidence = Readonly<{
  child: { pid?: number; exitCode: number | null; signalCode: string | null };
  statuses: readonly { stage: string; runId: string; childPid: number }[];
  requireValidMessages(): void;
  requireReconsumerProof(): void;
}>;

export function assertManualReady(
  running: ManualRunningEvidence,
  context: unknown,
  runId: string,
) {
  if (
    !pointageContextResponseSchema.safeParse(context).success ||
    running.child.exitCode !== null ||
    running.child.signalCode !== null ||
    !running.child.pid ||
    !running.statuses.some((status) => status.stage === 'READY') ||
    running.statuses.some(
      (status) =>
        ['FAILED', 'STOPPED'].includes(status.stage) ||
        status.runId !== runId ||
        status.childPid !== running.child.pid,
    )
  )
    throw new ManualPointageError('READINESS_REFUSED');
  running.requireValidMessages();
  running.requireReconsumerProof();
}

const employeeSchema = z
  .object({
    personnelDossierId: z.string().uuid(),
    displayName: z
      .string()
      .min(1)
      .max(160)
      .regex(/^[^\r\n\x00-\x1f\x7f]+$/u),
    credential: z.string().regex(/^[0-9]{8}$/u),
    state: z.literal('NOT_CLOCKED_IN'),
  })
  .strict();
const handoffSchema = z
  .object({
    runId: z.string().uuid(),
    slug: z.string().regex(/^synthetic-next-[a-f0-9]{24}$/u),
    employees: z.array(employeeSchema).length(2),
  })
  .strict();
export type ManualEmployee = z.infer<typeof employeeSchema>;

export function createManualHandoff(write: (text: string) => void) {
  let presented = false;
  return (input: z.infer<typeof handoffSchema>) => {
    if (presented) throw new ManualPointageError('HANDOFF_ALREADY_PRESENTED');
    const parsed = handoffSchema.safeParse(input);
    if (
      !parsed.success ||
      new Set(input.employees.map((e) => e.credential)).size !== 2 ||
      new Set(input.employees.map((e) => e.personnelDossierId)).size !== 2
    )
      throw new ManualPointageError('HANDOFF_REFUSED');
    presented = true;
    write(
      [
        '\nPOINTAGE — READY (données synthétiques temporaires)',
        `URL : ${origin}/pointage/${input.slug}`,
        `Génération : ${input.runId}`,
        ...input.employees.map(
          (employee) =>
            `${employee.displayName} | PIN : ${employee.credential} | ${employee.state}`,
        ),
        'Ouvrez cette URL dans Edge. Ctrl+C pour arrêter et supprimer les données temporaires.',
        'PIN affichés une seule fois ; ne conservez pas de capture de ce terminal.\n',
      ].join('\n'),
    );
  };
}

export async function cleanupManualResources(steps: {
  stopChild?: () => Promise<void>;
  closeClient?: () => Promise<void>;
  removeContainer?: () => Promise<void>;
  checkPort?: () => Promise<void>;
}) {
  let failed = false;
  for (const step of [
    steps.stopChild,
    steps.closeClient,
    steps.removeContainer,
    steps.checkPort,
  ]) {
    try {
      await step?.();
    } catch {
      failed = true;
    }
  }
  if (failed) throw new ManualPointageError('CLEANUP_FAILED');
}

export async function coordinateManualPointage(
  steps: {
    preflight(): Promise<void>;
    provision(): Promise<void>;
    prepare(): Promise<void>;
    start(): Promise<void>;
    ready(): Promise<void>;
    present(): void | Promise<void>;
    waitForStop(): Promise<void>;
    cleanup(): Promise<void>;
  },
  signal: AbortSignal,
) {
  let failure: unknown;
  try {
    for (const step of [
      steps.preflight,
      steps.provision,
      steps.prepare,
      steps.start,
      steps.ready,
      steps.present,
    ]) {
      if (signal.aborted) throw new ManualPointageError('STOP_REQUESTED');
      await step();
    }
    if (signal.aborted) throw new ManualPointageError('STOP_REQUESTED');
    await steps.waitForStop();
  } catch (error) {
    failure = error;
  }
  try {
    await steps.cleanup();
  } catch {
    if (failure)
      throw new ManualPointageError(
        `${failure instanceof ManualPointageError ? failure.code : 'STARTUP_FAILED'}_AND_CLEANUP_FAILED`,
      );
    throw new ManualPointageError('CLEANUP_FAILED');
  }
  if (failure) throw failure;
}

export async function requireManualPortFree(port: number) {
  await new Promise<void>((done, reject) => {
    const server = createServer();
    server.once('error', () =>
      reject(new ManualPointageError(`PORT_${port}_UNAVAILABLE`)),
    );
    server.listen(port, '127.0.0.1', () =>
      server.close((error) =>
        error ? reject(new ManualPointageError('PORT_PROBE_FAILED')) : done(),
      ),
    );
  });
}

async function readEnvironmentInventory() {
  const files: Record<string, string | undefined> = {};
  const stamps: Record<string, string | null> = {};
  for (const name of manualEnvFiles) {
    try {
      const path = join(app, name);
      const before = await stat(path);
      files[name] = await readFile(path, 'utf8');
      const after = await stat(path);
      if (before.mtimeMs !== after.mtimeMs || before.size !== after.size)
        throw new ManualPointageError('ENV_CHANGED');
      stamps[name] =
        `${after.dev}:${after.ino}:${after.size}:${after.mtimeMs}:${after.ctimeMs}`;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT')
        throw new ManualPointageError('ENV_INVENTORY_REFUSED');
      files[name] = undefined;
      stamps[name] = null;
    }
  }
  return { files, stamp: JSON.stringify(stamps) };
}

async function docker(args: string[], environment: NodeJS.ProcessEnv) {
  return new Promise<string>((done, reject) => {
    const child = spawn('docker', args, {
      cwd: root,
      env: environment,
      windowsHide: true,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    const chunks: Buffer[] = [];
    let bytes = 0;
    const timer = setTimeout(() => child.kill(), 60_000);
    child.stdout.on('data', (chunk: Buffer) => {
      bytes += chunk.length;
      if (bytes > 65536) child.kill();
      else chunks.push(chunk);
    });
    child.stderr.resume();
    child.once('error', () => {
      clearTimeout(timer);
      reject(new ManualPointageError('DOCKER_UNAVAILABLE'));
    });
    child.once('close', (code) => {
      clearTimeout(timer);
      if (code !== 0 || bytes > 65536)
        reject(new ManualPointageError('DOCKER_UNAVAILABLE'));
      else done(Buffer.concat(chunks).toString('utf8').trim());
    });
  });
}

type Fixture = Awaited<ReturnType<typeof provisionPointageNextFixture>>;
type Running = ReturnType<typeof launchPointageNextChild>;
type OwnedContainer = {
  containerName: string;
  generationLabel: string;
  containerId?: string;
};

export async function removeManualContainer(
  owned: OwnedContainer,
  command: (args: string[]) => Promise<string>,
) {
  if (
    !/^yuta-pointage-next-[a-f0-9]{24}$/u.test(owned.containerName) ||
    !/^[a-f0-9]{24}$/u.test(owned.generationLabel) ||
    owned.containerName !== `yuta-pointage-next-${owned.generationLabel}` ||
    (owned.containerId !== undefined &&
      !/^[a-f0-9]{64}$/u.test(owned.containerId))
  )
    throw new ManualPointageError('CONTAINER_OWNERSHIP_REFUSED');
  // Prefer the immutable owned ID. A renamed owned container must not be
  // mistaken for an absent resource merely because its old name disappeared.
  const filter = owned.containerId
    ? `id=${owned.containerId}`
    : `name=^/${owned.containerName}$`;
  const ids = await command(['ps', '-aq', '--no-trunc', '--filter', filter]);
  if (ids === '') return;
  if (
    !/^[a-f0-9]{64}$/u.test(ids) ||
    (owned.containerId && ids !== owned.containerId)
  )
    throw new ManualPointageError('CONTAINER_OWNERSHIP_REFUSED');
  const details = await command([
    'inspect',
    '--format',
    '{{json .Name}} {{json (index .Config.Labels "yuta.disposable-run")}}',
    ids,
  ]);
  if (
    details !==
    `${JSON.stringify('/' + owned.containerName)} ${JSON.stringify(owned.generationLabel)}`
  )
    throw new ManualPointageError('CONTAINER_OWNERSHIP_REFUSED');
  await command(['rm', '-f', ids]);
  if (
    (await command(['ps', '-aq', '--no-trunc', '--filter', `id=${ids}`])) !== ''
  )
    throw new ManualPointageError('CONTAINER_CLEANUP_FAILED');
}

export function generateDistinctManualCredential(
  existing: ReadonlySet<string>,
  generate: () => string = generatePointageCredential,
): string {
  for (let attempt = 0; attempt < 10; attempt++) {
    const candidate = generate();
    if (/^[0-9]{8}$/u.test(candidate) && !existing.has(candidate))
      return candidate;
  }
  throw new ManualPointageError('FIXTURE_CREDENTIAL_COLLISION');
}

async function prepareEmployees(fixture: Fixture): Promise<ManualEmployee[]> {
  const secondId = randomUUID();
  const secondScope = { ...fixture.scope, personnelDossierId: secondId };
  await fixture.admin.connection`
    insert into public.personnel_employee_dossiers(
      id,organization_id,establishment_id,given_names,family_name,position,
      qualification,employment_term_type,work_time_category,entry_date
    ) values(${secondId},${fixture.scope.organizationId},${fixture.scope.establishmentId},
      'Synthetic','Deux','Test','Test','indefinite','full_time','2020-01-01')
  `;
  const secret = decodePointageAuthSecret(fixture.input.encodedAuthSecret);
  let credential = '';
  try {
    const keys = derivePointageCredentialKeys(secret);
    await createPointageRepository(fixture.admin.db).issueCredential({
      scope: secondScope,
      personnelDossierId: secondId,
      managerUserId: fixture.managerUserId,
      now: new Date(),
      createMaterial: async () => {
        credential = generateDistinctManualCredential(
          new Set([fixture.credential]),
        );
        return {
          ...(await createPointageCredentialVerifier(keys, credential)),
          credentialFormatVersion: POINTAGE_CREDENTIAL_FORMAT_VERSION,
          lookupDigest: createPointageLookupDigest(
            keys,
            secondScope,
            credential,
          ),
        };
      },
    });
  } finally {
    secret.fill(0);
  }
  if (credential === fixture.credential)
    throw new ManualPointageError('FIXTURE_CREDENTIAL_COLLISION');
  const employees = [
    {
      personnelDossierId: fixture.scope.personnelDossierId,
      displayName: 'Synthetic Next',
      credential: fixture.credential,
      state: 'NOT_CLOCKED_IN' as const,
    },
    {
      personnelDossierId: secondId,
      displayName: 'Synthetic Deux',
      credential,
      state: 'NOT_CLOCKED_IN' as const,
    },
  ];
  for (const employee of employees) {
    const rows = await fixture.admin.connection`
      select id from public.pointage_raw_events
      where organization_id=${fixture.scope.organizationId} and establishment_id=${fixture.scope.establishmentId}
        and personnel_dossier_id=${employee.personnelDossierId}
    `;
    if (
      rows.length !== 0 ||
      derivePointageRawChain(
        { ...fixture.scope, personnelDossierId: employee.personnelDossierId },
        rows,
        new Set(['UTC']),
      ).state !== 'NOT_CLOCKED_IN'
    )
      throw new ManualPointageError('FIXTURE_INITIAL_STATE_REFUSED');
  }
  return employees;
}

async function probeEmployees(slug: string, employees: ManualEmployee[]) {
  for (const employee of employees) {
    const response = await fetch(`${origin}/api/pointage/${slug}/identify`, {
      method: 'POST',
      headers: { Origin: origin, 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential: employee.credential }),
      signal: AbortSignal.timeout(30_000),
    });
    if (response.status !== 200)
      throw new ManualPointageError('EMPLOYEE_ADMISSION_REFUSED');
    const result = pointageIdentifyResponseSchema.safeParse(
      await response.json(),
    );
    if (!result.success)
      throw new ManualPointageError('EMPLOYEE_ADMISSION_REFUSED');
    const ended = await fetch(`${origin}/api/pointage/${slug}/end`, {
      method: 'POST',
      headers: {
        Origin: origin,
        'Content-Type': 'application/json',
        Authorization: `Pointage ${result.data.continuation}`,
      },
      body: '{}',
      signal: AbortSignal.timeout(30_000),
    });
    if (
      ended.status !== 204 ||
      result.data.state.status !== 'NOT_CLOCKED_IN' ||
      result.data.state.displayName !== employee.displayName
    )
      throw new ManualPointageError('EMPLOYEE_INITIAL_STATE_REFUSED');
  }
}

export async function runManualPointage() {
  const controller = new AbortController();
  const stop = () => controller.abort();
  // Windows console delivery and package-runner forwarding can both deliver
  // the stop signal. Keep handlers installed until owned cleanup has finished.
  process.on('SIGINT', stop);
  process.on('SIGTERM', stop);
  const runId = randomUUID();
  let stage = 'PREFLIGHT';
  let setup: ReturnType<typeof createManualEnvironment> | undefined;
  let envStamp = '';
  let profileSnapshot = '';
  let watcher: ReturnType<typeof watch> | undefined;
  let owned: OwnedContainer | undefined;
  let fixture: Fixture | undefined;
  let running: Running | undefined;
  let employees: ManualEmployee[] = [];
  let context: unknown;
  let fatal: string | undefined;
  let cleanup: Promise<void> | undefined;
  const fail = (code: string) => {
    fatal ??= code;
    controller.abort();
  };
  const requireProfile = async () => {
    const current = await readEnvironmentInventory();
    if (setup) assertManualParentEnvironment(process.env, setup.environment);
    if (
      !setup ||
      current.stamp !== envStamp ||
      !Object.isFrozen(setup.environment) ||
      JSON.stringify(setup.environment) !== profileSnapshot ||
      JSON.stringify(
        inspectManualEnvironment(process.env, current.files).files,
      ) !== JSON.stringify(setup.inventory.files)
    )
      throw new ManualPointageError('ENV_CHANGED');
  };
  try {
    await coordinateManualPointage(
      {
        async preflight() {
          assertManualTerminal(
            process.stdin.isTTY === true,
            process.stdout.isTTY === true,
          );
          const inventory = await readEnvironmentInventory();
          setup = createManualEnvironment(process.env, inventory.files);
          sealManualParentEnvironment(process.env, setup.environment);
          assertManualParentEnvironment(process.env, setup.environment);
          envStamp = inventory.stamp;
          profileSnapshot = JSON.stringify(setup.environment);
          await requireManualPortFree(3001);
          await requireManualPortFree(65431);
          const endpoint = await docker(
            [
              'context',
              'inspect',
              '--format',
              '{{json .Endpoints.docker.Host}}',
            ],
            setup.environment,
          );
          if (
            ![
              '"npipe:////./pipe/dockerDesktopLinuxEngine"',
              '"unix:///var/run/docker.sock"',
            ].includes(endpoint)
          )
            throw new ManualPointageError('LOCAL_DOCKER_REQUIRED');
          await docker(
            ['info', '--format', '{{.OSType}}'],
            setup.environment,
          ).then((os) => {
            if (os !== 'linux')
              throw new ManualPointageError('LINUX_DOCKER_REQUIRED');
          });
          watcher = watch(app, (_event, filename) => {
            if (
              filename === null ||
              manualEnvFiles.includes(
                filename.toString() as (typeof manualEnvFiles)[number],
              )
            )
              fail('ENV_CHANGED');
          });
          watcher.on('error', () => fail('ENV_WATCH_FAILED'));
        },
        async provision() {
          stage = 'FIXTURE';
          fixture = await provisionPointageNextFixture(setup!.environment, {
            runId,
            onGeneration(identity) {
              owned = identity;
              if (controller.signal.aborted)
                throw new ManualPointageError('STOP_REQUESTED');
            },
            onContainer(resource) {
              owned = resource;
              if (controller.signal.aborted)
                throw new ManualPointageError('STOP_REQUESTED');
            },
          });
        },
        async prepare() {
          stage = 'EMPLOYEES';
          employees = await prepareEmployees(fixture!);
        },
        async start() {
          stage = 'START';
          await requireProfile();
          await requireManualPortFree(3001);
          await requireManualPortFree(65431);
          running = launchPointageNextChild(
            fixture!.input,
            setup!.environment,
            undefined,
            setup!.profile,
          );
          running.child.once('exit', () => {
            if (!cleanup) fail('CHILD_EXITED');
          });
          running.child.once('error', () => fail('CHILD_FAILED'));
        },
        async ready() {
          stage = 'READINESS';
          const deadline = Date.now() + 240_000;
          while (Date.now() < deadline) {
            if (
              controller.signal.aborted ||
              running!.statuses.some((s) => s.stage === 'FAILED')
            )
              throw new ManualPointageError(fatal ?? 'READINESS_REFUSED');
            try {
              const response = await fetch(
                `${origin}/api/pointage/${fixture!.slug}/context`,
                { cache: 'no-store', signal: AbortSignal.timeout(5000) },
              );
              if (response.status === 200) {
                context = await response.json();
                assertManualReady(running!, context, runId);
                break;
              }
            } catch {
              /* Next may still be compiling; bounded and never accepted as READY. */
            }
            await delay(500);
          }
          assertManualReady(running!, context, runId);
          await probeEmployees(fixture!.slug, employees);
          await requireProfile();
          assertManualReady(running!, context, runId);
        },
        present() {
          stage = 'SERVING';
          createManualHandoff((text) => process.stdout.write(text))({
            runId,
            slug: fixture!.slug,
            employees,
          });
        },
        async waitForStop() {
          if (!controller.signal.aborted)
            await new Promise<void>((done) =>
              controller.signal.addEventListener('abort', () => done(), {
                once: true,
              }),
            );
          if (fatal) throw new ManualPointageError(fatal);
        },
        async cleanup() {
          cleanup ??= (async () => {
            watcher?.close();
            await cleanupManualResources({
              stopChild: running ? () => running!.stop() : undefined,
              closeClient: fixture ? () => fixture!.close() : undefined,
              removeContainer: owned
                ? () =>
                    removeManualContainer(owned!, (args) =>
                      docker(args, setup!.environment),
                    )
                : undefined,
              checkPort: running
                ? () => requireManualPortFree(3001)
                : undefined,
            });
          })();
          await cleanup;
        },
      },
      controller.signal,
    );
    process.stdout.write(
      'Pointage arrêté ; ressources temporaires supprimées, port 3001 libéré.\n',
    );
  } catch (error) {
    const code =
      error instanceof ManualPointageError ? error.code : `${stage}_FAILED`;
    process.stderr.write(
      `POINTAGE_MANUAL_TEST ${code}\nGénération : ${runId}\n`,
    );
    if (code.includes('CLEANUP') && owned)
      process.stderr.write(
        `Vérification manuelle requise : ${owned.containerName}; yuta.disposable-run=${owned.generationLabel}${owned.containerId ? '; ID=' + owned.containerId : ''}. Voir LOCAL_DEVELOPMENT.md.\n`,
      );
    process.exitCode = 1;
  } finally {
    process.removeListener('SIGINT', stop);
    process.removeListener('SIGTERM', stop);
  }
}

if (
  resolve(process.argv[1] ?? '') === join(__dirname, 'pointage-manual-test.ts')
) {
  if (process.argv.length !== 2) {
    process.stderr.write('POINTAGE_MANUAL_TEST ARGUMENTS_REFUSED\n');
    process.exitCode = 1;
  } else void runManualPointage();
}
