import 'server-only';
import { z } from 'zod';
import type { CloudDatabaseClient } from '@yuta/db-cloud';

const nameRule = /^yuta_pointage_raw_clocking_test(?:_[a-z0-9]+)?$/;
const loopback = new Set(['localhost', '127.0.0.1', '[::1]']);
const identitySchema = z
  .array(
    z.object({
      database: z.string(),
      session: z.string(),
      current: z.string(),
    }),
  )
  .length(1);

export function refusePointageRuntime(): never {
  throw new Error('Pointage runtime is unavailable.');
}

export function requirePointageRuntimeTarget(
  environment: NodeJS.ProcessEnv,
  listeningHost: string,
) {
  const text = environment.CLOUD_DATABASE_URL;
  if (
    !text ||
    /[\s\\]/u.test(text) ||
    !['development', 'test'].includes(environment.NODE_ENV ?? '') ||
    environment.VERCEL !== undefined ||
    environment.YUTA_POINTAGE_SYNTHETIC_TEST_MODE !== 'true' ||
    environment.POINTAGE_TEST_ORIGIN !== 'http://127.0.0.1:3001' ||
    !loopback.has(listeningHost)
  )
    refusePointageRuntime();
  try {
    const target = new URL(text);
    const authority = /^postgres(?:ql)?:\/\/([^/?#]+)\//u.exec(text)?.[1];
    const host = authority?.slice(authority.lastIndexOf('@') + 1);
    const name = target.pathname.slice(1);
    if (
      !['postgres:', 'postgresql:'].includes(target.protocol) ||
      !loopback.has(target.hostname) ||
      host !== target.host ||
      !target.username ||
      !target.password ||
      target.search ||
      target.hash ||
      nameRule.exec(name)?.[0] !== name
    )
      refusePointageRuntime();
    return Object.freeze({
      hostname: target.hostname,
      port: Number(target.port || 5432),
      name,
    });
  } catch {
    return refusePointageRuntime();
  }
}

type Target = ReturnType<typeof requirePointageRuntimeTarget>;
export type PointageRuntimeRole =
  | 'yuta_pointage_foundation_runtime'
  | 'yuta_pointage_raw_writer';

// Inspect the actual injected driver's source, not a separately asserted URL.
// No client/credentials are constructed from CLOUD_DATABASE_URL here.
export function requirePointageClientSource(
  client: CloudDatabaseClient | undefined,
  target: Target,
  role: PointageRuntimeRole,
): asserts client is CloudDatabaseClient {
  const options = client?.$client?.options;
  if (
    !options ||
    options.host.length !== 1 ||
    options.port.length !== 1 ||
    options.host[0] !== target.hostname ||
    options.port[0] !== target.port ||
    options.database !== target.name ||
    options.user !== role ||
    options.path ||
    options.max !== 1
  )
    refusePointageRuntime();
}

export async function requirePointageClientIdentity(
  client: CloudDatabaseClient,
  target: Target,
  role: PointageRuntimeRole,
): Promise<string> {
  try {
    const [identity] = identitySchema.parse(
      await client.$client`
      select current_database() as database, session_user as session, current_user as current
    `,
    );
    if (
      !identity ||
      identity.database !== target.name ||
      nameRule.exec(identity.database)?.[0] !== identity.database ||
      identity.session !== role ||
      identity.current !== role
    )
      refusePointageRuntime();
    return identity.database;
  } catch {
    return refusePointageRuntime();
  }
}

export async function requirePointageActualTarget(
  client: CloudDatabaseClient,
  target: Target,
) {
  try {
    const rows = z
      .array(z.object({ database: z.string() }))
      .length(1)
      .parse(await client.$client`select current_database() as database`);
    const actual = rows[0]!.database;
    if (actual !== target.name || nameRule.exec(actual)?.[0] !== actual)
      refusePointageRuntime();
  } catch {
    refusePointageRuntime();
  }
}
