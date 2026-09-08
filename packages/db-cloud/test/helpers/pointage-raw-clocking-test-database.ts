import { createHmac } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import postgres from 'postgres';
import { z } from 'zod';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from '../../src/schema';

const databaseRule = /^yuta_pointage_raw_clocking_test(?:_[a-z0-9]+)?$/;
const loopback = new Set(['localhost', '127.0.0.1', '[::1]']);

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
export async function provisionPointageTestRoles(
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
  const writerUrl = new URL(pointageDisposableWriterUrl(bootstrapUrl));
  if (!/^[a-f0-9]{64}$/u.test(writerUrl.password))
    throw new Error('Pointage disposable writer material refused.');
  const db = await openPointageTestDatabase(environment, bootstrapUrl);
  try {
    await db.begin(async (tx) => {
      const [state] = await tx`
        select current_user=session_user and current_user='pointage_bootstrap_20260908a' as bootstrap,
          not exists (select 1 from pg_roles where rolname in ('yuta_pointage_raw_lock_owner','yuta_pointage_raw_writer')) as absent,
          not exists (select 1 from pg_tables where schemaname not in ('pg_catalog','information_schema')) as empty
      `;
      if (!state?.bootstrap || !state.absent || !state.empty)
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
