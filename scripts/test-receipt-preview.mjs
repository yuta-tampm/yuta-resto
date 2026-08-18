import { spawn } from 'node:child_process';
import { randomInt, randomUUID } from 'node:crypto';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const container = `yuta-receipt-preview-${randomUUID().slice(0, 8)}`;
const pnpmEntrypoint = process.env.npm_execpath;
let started = false;

function run(command, args, options = {}) {
  return new Promise((resolveRun, reject) => {
    const child = spawn(command, args, {
      cwd: root,
      env: options.env ?? process.env,
      shell: false,
      stdio: options.quiet ? 'pipe' : 'inherit',
    });
    let stdout = '';
    if (options.quiet) child.stdout.on('data', (value) => (stdout += value));
    child.once('error', reject);
    child.once('exit', (code) =>
      code === 0
        ? resolveRun(stdout.trim())
        : reject(new Error(`${command} ${args.join(' ')} exited with ${code}`)),
    );
  });
}

function runPnpm(args, options) {
  return pnpmEntrypoint
    ? run(process.execPath, [pnpmEntrypoint, ...args], options)
    : run('pnpm', args, options);
}

async function main() {
  try {
    if (
      !existsSync(
        resolve(root, 'apps/site-agent/node_modules/tsx/dist/cli.mjs'),
      )
    ) {
      throw new Error(
        'Install workspace dependencies before running this test.',
      );
    }
    await run(
      'docker',
      [
        'run',
        '--detach',
        '--name',
        container,
        '--env',
        'POSTGRES_DB=yuta_receipt_preview',
        '--env',
        'POSTGRES_USER=yuta_pos',
        '--env',
        'POSTGRES_PASSWORD=yuta_receipt_preview',
        '--publish',
        '127.0.0.1::5432',
        '--tmpfs',
        '/var/lib/postgresql/data',
        'postgres:17-alpine',
      ],
      { quiet: true },
    );
    started = true;
    for (let attempt = 0; attempt < 30; attempt += 1) {
      try {
        await run(
          'docker',
          [
            'exec',
            container,
            'pg_isready',
            '-U',
            'yuta_pos',
            '-d',
            'yuta_receipt_preview',
          ],
          { quiet: true },
        );
        break;
      } catch {
        if (attempt === 29)
          throw new Error('Disposable PostgreSQL did not become ready.');
        await new Promise((resolveDelay) => setTimeout(resolveDelay, 500));
      }
    }
    const mapping = await run('docker', ['port', container, '5432/tcp'], {
      quiet: true,
    });
    const port = Number(mapping.split(':').at(-1));
    const env = {
      ...process.env,
      POS_DATABASE_URL: `postgres://yuta_pos:yuta_receipt_preview@127.0.0.1:${port}/yuta_receipt_preview`,
      YUTA_POS_SEED_ADMIN_PIN: String(randomInt(100000, 1000000)),
      YUTA_POS_SEED_STAFF_PIN: String(randomInt(100000, 1000000)),
      YUTA_POS_SEED_KITCHEN_PIN: String(randomInt(100000, 1000000)),
    };
    const output = resolve(
      root,
      'apps/yuta-pos/.tmp/prints',
      `receipt-e2e-${Date.now()}`,
    );
    console.log('Migrating disposable receipt-preview database...');
    await runPnpm(['--filter', '@yuta/db-pos', 'db:migrate'], { env });
    await runPnpm(
      [
        '--filter',
        '@yuta/site-agent',
        'exec',
        'tsx',
        'src/scripts/test-receipt-preview.ts',
        output,
      ],
      { env },
    );
  } finally {
    if (started)
      await run('docker', ['rm', '--force', container], { quiet: true }).catch(
        () => undefined,
      );
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
