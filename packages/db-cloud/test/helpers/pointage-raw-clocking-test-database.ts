import { createHash, createHmac } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import {
  copyFile,
  mkdir,
  mkdtemp,
  readFile,
  rm,
  writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { basename, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import postgres from 'postgres';
import { z } from 'zod';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import * as schema from '../../src/schema';
import {
  POINTAGE_FOUNDATION_RUNTIME_COLUMNS,
  assertPointageRawDatabaseBoundary,
} from '../../src/pointage-raw-clocking-repository';

const databaseRule = /^yuta_pointage_raw_clocking_test(?:_[a-z0-9]+)?$/;
const loopback = new Set(['localhost', '127.0.0.1', '[::1]']);
const packageRoot = resolve(fileURLToPath(new URL('../..', import.meta.url)));
const canonicalMigrationRoot = join(packageRoot, 'drizzle');
const extensionRoot = join(
  packageRoot,
  'test',
  'fixtures',
  'pointage-raw-clocking',
);
const journalSchema = z
  .object({
    version: z.string(),
    dialect: z.literal('postgresql'),
    entries: z.array(
      z
        .object({
          idx: z.number().int().nonnegative(),
          version: z.string(),
          when: z.number().int().positive(),
          tag: z.string().regex(/^\d{4}_[a-z0-9_]+$/u),
          breakpoints: z.boolean(),
        })
        .strict(),
    ),
  })
  .strict();
const extensionManifestSchema = z
  .object({
    version: z.literal(1),
    entry: journalSchema.shape.entries.element,
    sqlSha256: z.string().regex(/^[a-f0-9]{64}$/u),
    snapshotSha256: z.string().regex(/^[a-f0-9]{64}$/u),
  })
  .strict();

export const POINTAGE_RAW_CLOCKING_EXTENSION_TAG = '0021_abandoned_black_queen';

export function pointageCanonicalMigrationDirectory(): string {
  return canonicalMigrationRoot;
}

export function pointageRawClockingExtensionSqlPath(): string {
  return join(extensionRoot, `${POINTAGE_RAW_CLOCKING_EXTENSION_TAG}.sql`);
}

export async function createPointageDisposableMigrationDirectory(
  environment: NodeJS.ProcessEnv,
  bootstrapUrl: string,
  expectedContainerId: string,
): Promise<string> {
  await requireIsolatedPointageTestCluster(
    environment,
    bootstrapUrl,
    expectedContainerId,
  );
  return assemblePointageDisposableMigrationDirectory();
}

// Pure test-fixture assembly is not migration authority. Callers still need
// the D1 target/identity guard, and role provisioning uses the stronger
// isolated-cluster admission before any extension execution.
export async function assemblePointageDisposableMigrationDirectory(): Promise<string> {
  const [journalValue, manifestValue, extensionSql, extensionSnapshot] =
    await Promise.all([
      readFile(join(canonicalMigrationRoot, 'meta', '_journal.json'), 'utf8'),
      readFile(join(extensionRoot, 'extension.json'), 'utf8'),
      readFile(pointageRawClockingExtensionSqlPath()),
      readFile(join(extensionRoot, '0021_snapshot.json')),
    ]);
  const journal = journalSchema.parse(JSON.parse(journalValue));
  const manifest = extensionManifestSchema.parse(JSON.parse(manifestValue));
  const last = journal.entries.at(-1);
  if (
    last?.tag !== '0020_formalites_legal_template_foundation' ||
    manifest.entry.idx !== journal.entries.length ||
    manifest.entry.tag !== POINTAGE_RAW_CLOCKING_EXTENSION_TAG ||
    manifest.entry.when <= last.when ||
    createHash('sha256').update(extensionSql).digest('hex') !==
      manifest.sqlSha256 ||
    createHash('sha256').update(extensionSnapshot).digest('hex') !==
      manifest.snapshotSha256
  ) {
    throw new Error('Pointage disposable migration manifest refused.');
  }
  const directory = await mkdtemp(join(tmpdir(), 'yuta-pointage-migration-'));
  try {
    await mkdir(join(directory, 'meta'));
    for (const entry of journal.entries) {
      await copyFile(
        join(canonicalMigrationRoot, `${entry.tag}.sql`),
        join(directory, `${entry.tag}.sql`),
      );
    }
    await copyFile(
      pointageRawClockingExtensionSqlPath(),
      join(directory, `${manifest.entry.tag}.sql`),
    );
    await writeFile(
      join(directory, 'meta', '_journal.json'),
      `${JSON.stringify(
        { ...journal, entries: [...journal.entries, manifest.entry] },
        null,
        2,
      )}\n`,
    );
    return directory;
  } catch {
    await removePointageDisposableMigrationDirectory(directory);
    throw new Error('Pointage disposable migration assembly refused.');
  }
}

export async function removePointageDisposableMigrationDirectory(
  directory: string,
): Promise<void> {
  const target = resolve(directory);
  const root = resolve(tmpdir());
  if (
    !target.startsWith(root + sep) ||
    !basename(target).startsWith('yuta-pointage-migration-')
  ) {
    throw new Error('Unexpected temporary fixture path; cleanup refused.');
  }
  await rm(target, { recursive: true });
}

export function exactPointageTestDatabaseName(name: string): boolean {
  return databaseRule.exec(name)?.[0] === name;
}

export function requirePointageTestDatabaseIdentity(
  expected: string,
  actual: unknown,
): void {
  if (
    typeof actual !== 'string' ||
    actual !== expected ||
    !exactPointageTestDatabaseName(expected) ||
    !exactPointageTestDatabaseName(actual)
  ) {
    throw new Error('Pointage disposable database identity refused.');
  }
}

// Test infrastructure only. No dotenv loading, database creation, schema repair,
// role provisioning or production provider is hidden in this connection helper.
export function requirePointageTestConfiguration(
  environment: NodeJS.ProcessEnv,
  databaseUrl: string,
) {
  if (
    !['development', 'test'].includes(environment.NODE_ENV ?? '') ||
    environment.VERCEL !== undefined ||
    environment.YUTA_POINTAGE_SYNTHETIC_TEST_MODE !== 'true' ||
    !environment.POINTAGE_TEST_ORIGIN ||
    /[\s\\]/u.test(databaseUrl)
  ) {
    throw new Error('Pointage disposable configuration refused.');
  }
  const target = new URL(databaseUrl);
  const origin = new URL(environment.POINTAGE_TEST_ORIGIN);
  const name = target.pathname.slice(1);
  // Validate raw authority as well as URL parsing: URL normalization must not
  // turn numeric/encoded host aliases into an approved loopback spelling.
  const rawAuthority = /^postgres(?:ql)?:\/\/([^/?#]+)\//u.exec(
    databaseUrl,
  )?.[1];
  const rawHost = rawAuthority?.slice(rawAuthority.lastIndexOf('@') + 1);
  const originAuthority = /^https?:\/\/([^/?#]+)\/?$/u.exec(
    environment.POINTAGE_TEST_ORIGIN,
  )?.[1];
  if (
    !['postgres:', 'postgresql:'].includes(target.protocol) ||
    !loopback.has(target.hostname) ||
    rawHost !== target.host ||
    target.search ||
    target.hash ||
    !exactPointageTestDatabaseName(name) ||
    !['http:', 'https:'].includes(origin.protocol) ||
    !loopback.has(origin.hostname) ||
    originAuthority !== origin.host ||
    origin.username ||
    origin.password ||
    !target.username ||
    !target.password
  ) {
    throw new Error('Pointage disposable configuration refused.');
  }
  return { target, name };
}

export async function openPointageTestDatabase(
  environment: NodeJS.ProcessEnv,
  databaseUrl: string,
) {
  const { target, name } = requirePointageTestConfiguration(
    environment,
    databaseUrl,
  );
  const connection = postgres(target.toString(), {
    max: 1,
    onnotice: () => undefined,
  });
  try {
    const [identity] = await connection<{ name: string }[]>`
      select current_database() as name
    `;
    requirePointageTestDatabaseIdentity(name, identity?.name);
    return connection;
  } catch {
    await connection.end();
    throw new Error('Pointage disposable database identity refused.');
  }
}

export async function openPointageTestClient(
  environment: NodeJS.ProcessEnv,
  databaseUrl: string,
) {
  const connection = await openPointageTestDatabase(environment, databaseUrl);
  return { connection, db: drizzle(connection, { schema }) };
}

export async function migratePointageCanonicalTestDatabase(
  client: Awaited<ReturnType<typeof openPointageTestClient>>,
): Promise<void> {
  await migrate(client.db, {
    migrationsFolder: pointageCanonicalMigrationDirectory(),
  });
}

export async function migratePointageDisposableExtension(
  client: Awaited<ReturnType<typeof openPointageTestClient>>,
  environment: NodeJS.ProcessEnv,
  bootstrapUrl: string,
  expectedContainerId: string,
): Promise<void> {
  const migrationDirectory = await createPointageDisposableMigrationDirectory(
    environment,
    bootstrapUrl,
    expectedContainerId,
  );
  try {
    await migrate(client.db, { migrationsFolder: migrationDirectory });
  } finally {
    await removePointageDisposableMigrationDirectory(migrationDirectory);
  }
}

// Mirrors this explicitly authorized disposable bootstrap run only. The
// bootstrap secret is never the writer secret and is never a runtime fallback.
export function pointageDisposableWriterUrl(bootstrapUrl: string): string {
  const target = new URL(bootstrapUrl);
  if (target.username !== 'pointage_bootstrap_20260908a') {
    throw new Error('Unexpected Pointage bootstrap identity.');
  }
  target.password = createHmac('sha256', target.password)
    .update('pointage-disposable-writer-b20260908a')
    .digest('hex');
  target.username = 'yuta_pointage_raw_writer';
  return target.toString();
}

// Explicit test bootstrap only, never called by opening a connection. Docker
// identity plus private tmpfs and exact loopback port prove this is an isolated
// test cluster, not a database with a conveniently matching name on a shared
// server. Existing roles are refused rather than silently repaired.
async function requireIsolatedPointageTestCluster(
  environment: NodeJS.ProcessEnv,
  bootstrapUrl: string,
  expectedContainerId: string,
): Promise<void> {
  const { target } = requirePointageTestConfiguration(
    environment,
    bootstrapUrl,
  );
  if (!/^[a-f0-9]{64}$/u.test(expectedContainerId)) {
    throw new Error('Pointage disposable cluster identity refused.');
  }
  const inspectionSchema = z
    .array(
      z.object({
        Id: z.string(),
        State: z.object({ Running: z.boolean() }),
        Config: z.object({ Labels: z.record(z.string()).nullable() }),
        Mounts: z.array(z.unknown()),
        HostConfig: z.object({
          Tmpfs: z.record(z.string()).nullable(),
          PortBindings: z.record(
            z.array(z.object({ HostIp: z.string(), HostPort: z.string() })),
          ),
        }),
      }),
    )
    .length(1);
  let isolated = false;
  try {
    if (
      process.env.DOCKER_HOST !== undefined ||
      environment.DOCKER_HOST !== undefined
    )
      throw new Error('Remote Docker override refused.');
    const endpoint: unknown = JSON.parse(
      execFileSync(
        'docker',
        ['context', 'inspect', '--format', '{{json .Endpoints.docker.Host}}'],
        { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] },
      ),
    );
    if (
      endpoint !== 'npipe:////./pipe/dockerDesktopLinuxEngine' &&
      endpoint !== 'unix:///var/run/docker.sock'
    )
      throw new Error('Non-local Docker context refused.');
    const [cluster] = inspectionSchema.parse(
      JSON.parse(
        execFileSync('docker', ['inspect', expectedContainerId], {
          encoding: 'utf8',
          stdio: ['ignore', 'pipe', 'ignore'],
        }),
      ),
    );
    const ports = cluster!.HostConfig.PortBindings;
    isolated =
      cluster!.Id === expectedContainerId &&
      cluster!.State.Running &&
      cluster!.Config.Labels?.['yuta.change'] ===
        'pointage-usable-raw-clocking' &&
      /^[a-z0-9]+$/u.test(
        cluster!.Config.Labels?.['yuta.disposable-run'] ?? '',
      ) &&
      cluster!.Mounts.length === 0 &&
      Object.keys(cluster!.HostConfig.Tmpfs ?? {}).length === 1 &&
      cluster!.HostConfig.Tmpfs?.['/var/lib/postgresql/data'] ===
        'rw,size=512m' &&
      Object.keys(ports).length === 1 &&
      ports['5432/tcp']?.length === 1 &&
      ports['5432/tcp'][0]!.HostIp === '127.0.0.1' &&
      target.hostname === '127.0.0.1' &&
      ports['5432/tcp'][0]!.HostPort === target.port;
  } catch {
    throw new Error('Pointage disposable cluster identity refused.');
  }
  if (!isolated)
    throw new Error('Pointage disposable cluster identity refused.');
}

export async function provisionPointageTestRoles(
  environment: NodeJS.ProcessEnv,
  bootstrapUrl: string,
  expectedContainerId: string,
): Promise<void> {
  await requireIsolatedPointageTestCluster(
    environment,
    bootstrapUrl,
    expectedContainerId,
  );
  const writerUrl = new URL(pointageDisposableWriterUrl(bootstrapUrl));
  if (!/^[a-f0-9]{64}$/u.test(writerUrl.password))
    throw new Error('Pointage disposable writer material refused.');
  const db = await openPointageTestDatabase(environment, bootstrapUrl);
  try {
    await db.begin(async (tx) => {
      const [state] = await tx`
        select current_user=session_user and current_user='pointage_bootstrap_20260908a' as bootstrap,
          not exists (select 1 from pg_roles where rolname in ('yuta_pointage_raw_lock_owner','yuta_pointage_raw_writer')) as absent,
          (select count(*) from drizzle.__drizzle_migrations)=21 as canonical,
          to_regclass('public.pointage_raw_events') is null
            and to_regclass('public.pointage_raw_command_receipts') is null
            and to_regclass('public.pointage_continuations') is null
            and to_regprocedure('public.pointage_raw_lock_dossier(uuid,uuid,uuid)') is null
            as raw_absent
      `;
      if (
        !state?.bootstrap ||
        !state.absent ||
        !state.canonical ||
        !state.raw_absent
      )
        throw new Error('Pointage disposable bootstrap state refused.');
      await tx`create role yuta_pointage_raw_lock_owner nologin nosuperuser nocreatedb nocreaterole noreplication nobypassrls noinherit`;
      // Only a validated hex digest is interpolated into this fixed DDL; neither
      // credentials nor the SQL text are emitted as evidence or error output.
      await tx.unsafe(
        `create role yuta_pointage_raw_writer login nosuperuser nocreatedb nocreaterole noreplication nobypassrls noinherit password '${writerUrl.password}'`,
      );
      const roles = await tx`
        select rolname, rolcanlogin, rolsuper, rolcreatedb, rolcreaterole, rolreplication, rolbypassrls, rolinherit
        from pg_roles where rolname in ('yuta_pointage_raw_lock_owner','yuta_pointage_raw_writer') order by rolname
      `;
      if (
        roles.length !== 2 ||
        roles.some(
          (role) =>
            role.rolcanlogin !==
              (role.rolname === 'yuta_pointage_raw_writer') ||
            role.rolsuper ||
            role.rolcreatedb ||
            role.rolcreaterole ||
            role.rolreplication ||
            role.rolbypassrls ||
            role.rolinherit,
        )
      )
        throw new Error('Pointage disposable role attributes refused.');
    });
  } catch {
    throw new Error('Pointage disposable role provisioning refused.');
  } finally {
    await db.end();
  }
}

export function pointageDisposableFoundationUrl(bootstrapUrl: string): string {
  const target = new URL(bootstrapUrl);
  if (target.username !== 'pointage_bootstrap_20260908a')
    throw new Error('Unexpected Pointage bootstrap identity.');
  target.password = createHmac('sha256', target.password)
    .update('pointage-disposable-foundation-d1a')
    .digest('hex');
  target.username = 'yuta_pointage_foundation_runtime';
  return target.toString();
}

// D1a only: provision after verified isolated-cluster/actual-target admission.
// Never invoked by application composition and never rewrites the test extension.
export async function provisionPointageFoundationTestRole(
  environment: NodeJS.ProcessEnv,
  bootstrapUrl: string,
  expectedContainerId: string,
): Promise<void> {
  await requireIsolatedPointageTestCluster(
    environment,
    bootstrapUrl,
    expectedContainerId,
  );
  const raw = await openPointageTestClient(
    environment,
    pointageDisposableWriterUrl(bootstrapUrl),
  );
  try {
    await assertPointageRawDatabaseBoundary(raw.db);
  } finally {
    await raw.connection.end();
  }
  const { name } = requirePointageTestConfiguration(environment, bootstrapUrl);
  const password = new URL(pointageDisposableFoundationUrl(bootstrapUrl))
    .password;
  if (!/^[a-f0-9]{64}$/u.test(password))
    throw new Error('Pointage disposable foundation material refused.');
  const db = await openPointageTestDatabase(environment, bootstrapUrl);
  try {
    await db.begin(async (tx) => {
      const [state] = await tx`
        select current_user=session_user and current_user='pointage_bootstrap_20260908a' as bootstrap,
          not exists (select 1 from pg_roles where rolname='yuta_pointage_foundation_runtime') as absent,
          has_database_privilege('yuta_pointage_raw_writer',current_database(),'TEMP') as writer_temp
      `;
      if (!state?.bootstrap || !state.absent)
        throw new Error('Pointage disposable foundation state refused.');
      await tx.unsafe(
        `create role yuta_pointage_foundation_runtime login nosuperuser nocreatedb nocreaterole noreplication nobypassrls noinherit password '${password}'`,
      );
      // PostgreSQL has no per-role DENY overriding PUBLIC TEMP. Restrict the
      // verified disposable target, never a shared cluster or application ACL.
      await tx.unsafe(`revoke temporary on database "${name}" from public`);
      // Preserve, never expand, the writer's pre-existing effective TEMP right
      // used by the approved D4b poisoned-caller regression. PostgreSQL cannot
      // deny PUBLIC's grant to the foundation role individually.
      if (state.writer_temp === true)
        await tx.unsafe(
          `grant temporary on database "${name}" to yuta_pointage_raw_writer`,
        );
      await tx.unsafe(
        `grant connect on database "${name}" to yuta_pointage_foundation_runtime`,
      );
      await tx`grant usage on schema public to yuta_pointage_foundation_runtime`;
      for (const [table, grants] of Object.entries(
        POINTAGE_FOUNDATION_RUNTIME_COLUMNS,
      )) {
        for (const [privilege, columns] of Object.entries(grants)) {
          if (columns.length)
            await tx.unsafe(
              `grant ${privilege} (${columns.join(', ')}) on public.${table} to yuta_pointage_foundation_runtime`,
            );
        }
      }
    });
  } catch {
    throw new Error('Pointage disposable foundation provisioning refused.');
  } finally {
    await db.end();
  }
}
