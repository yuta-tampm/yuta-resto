import assert from 'node:assert/strict';
import { spawn, execFileSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  writeFileSync,
  unlinkSync,
  symlinkSync,
  linkSync,
  rmSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve, dirname } from 'node:path';
import { createRequire } from 'node:module';
import {
  applications,
  outputs,
  lockName,
  preflight,
  safePath,
  invalidateOutputs,
  validateOutput,
  validateOutputs,
  acquireLock,
  runBootstrap,
} from './generate-next-types.mjs';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = (path) =>
  readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const manifest = JSON.parse(read('package.json'));
const apps = [
  ['apps/backoffice', '@yuta/backoffice'],
  ['apps/web', '@yuta/web'],
  ['apps/booking-web', '@yuta/booking-web'],
  ['apps/feedback-web', '@yuta/feedback-web'],
  ['apps/yuta-pos', '@yuta/pos'],
  ['apps/yuta-display', '@yuta/display'],
];
const workflow = read('.github/workflows/ci.yml');
const expectedRun = 'pnpm typegen:next && pnpm -r --if-present typecheck';

test('root bootstrap targets exactly the six Next apps in approved order', () => {
  assert.equal(
    manifest.scripts['typegen:next'],
    'node scripts/generate-next-types.mjs',
  );
  assert.deepEqual(applications, apps);
  for (const [path, name] of apps) {
    const app = JSON.parse(read(`${path}/package.json`));
    assert.equal(app.name, name);
    assert.equal(app.dependencies.next, '^16.2.9');
    assert.equal(app.scripts.typecheck, 'tsc --noEmit');
    assert.equal(app.scripts.pretypecheck, undefined);
    assert.equal(app.scripts.postinstall, undefined);
  }
});

test('existing root aliases keep their bounded meanings', () => {
  assert.equal(manifest.scripts.typecheck, 'pnpm --filter @yuta/web typecheck');
  assert.equal(manifest.scripts.pretypecheck, undefined);
  assert.equal(manifest.scripts.postinstall, undefined);
  for (const [alias, name] of [
    ['backoffice', '@yuta/backoffice'],
    ['booking', '@yuta/booking-web'],
    ['feedback', '@yuta/feedback-web'],
    ['pos', '@yuta/pos'],
    ['display', '@yuta/display'],
  ]) {
    for (const verb of ['typecheck', 'dev', 'build']) {
      assert.equal(
        manifest.scripts[`${verb}:${alias}`],
        `pnpm --filter ${name} ${verb}`,
      );
    }
  }
});

test('CI gates recursive typecheck in its own job with no failure bypass', () => {
  const job = workflow
    .split('  architecture-and-typecheck:')[1]
    .split('  cloud-tests:')[0];
  assert.ok(job.includes(`run: ${expectedRun}`));
  assert.ok(
    job.indexOf('pnpm install --frozen-lockfile') < job.indexOf(expectedRun),
  );
  assert.doesNotMatch(job, /continue-on-error|always\(\)|\|\|\s*true/);
  assert.equal(workflow.split(expectedRun).length - 1, 1);
});

test('both development guides document the same explicit prerequisite', () => {
  for (const path of ['README.md', 'docs/DEVELOPMENT_WORKFLOW.md']) {
    const text = read(path);
    assert.ok(text.includes(expectedRun));
    assert.ok(text.includes('exclusive checkout'));
    assert.match(text, /not an equivalent/);
    assert.ok(!text.includes('--fail-if-no-match exec next typegen'));
    assert.ok(text.includes('$LASTEXITCODE -eq 0'));
    assert.match(text, /not.*(generate|hand-edit)|without implicit/);
  }
});

test('Next declarations have only the six exact root-anchored ignore rules', () => {
  const rules = read('.gitignore').split(/\r?\n/);
  assert.deepEqual(
    rules.filter((rule) => rule.includes('.d.ts')),
    apps.map(([path]) => `/${path}/next-env.d.ts`),
  );
});

test('POS offline acceptance no longer captures or restores generated declarations', () => {
  const source = read('scripts/test-pos-offline.mjs');
  assert.match(source, /import \{ existsSync \} from 'node:fs';/);
  assert.match(source, /!existsSync\(tsxCli\) \|\| !existsSync\(nextCli\)/);
  assert.doesNotMatch(
    source,
    /next-env\.d\.ts|posNextEnv|originalPosNextEnv|readFileSync|writeFileSync/,
  );
});

const require = createRequire(
  new URL('../apps/backoffice/package.json', import.meta.url),
);
const ts = require('typescript');
const tsEntry = require.resolve('typescript');
// Focused component/process fixtures, not Phase 3 actual-Next acceptance.
// No Formalités data or candidate baseline is substituted by these fixtures.
const valid = {
  [outputs[0]]:
    '/// <reference types="next" />\n/// <reference types="next/image-types/global" />\nimport "./.next/types/routes.d.ts";',
  [outputs[1]]:
    'type AppRoutes = "/"; type LayoutRoutes = "/"; interface ParamMap {} export type { AppRoutes, LayoutRoutes, ParamMap };',
  [outputs[2]]:
    'import type { AppRoutes, LayoutRoutes, ParamMap } from "./routes.js"; type AppPageConfig<Route extends AppRoutes = AppRoutes> = { default: unknown }; type LayoutConfig<Route extends LayoutRoutes = LayoutRoutes> = { default: unknown };',
  [outputs[3]]:
    'declare module "next/cache" { export function cacheLife(profile: "default"): void; }',
};

function put(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
}

function fixture(t) {
  const directory = mkdtempSync(resolve(tmpdir(), 'yuta-typegen-unit-'));
  execFileSync('git', ['init', '--quiet', directory]);
  t.after(() => {
    assert.equal(
      existsSync(resolve(directory, lockName)),
      false,
      'owned lock must be released',
    );
    rmSync(directory, { recursive: true, force: true });
  });
  for (const [path, name] of apps) {
    const app = resolve(directory, path);
    put(resolve(app, 'package.json'), JSON.stringify({ name }));
    put(
      resolve(app, 'node_modules/typescript/package.json'),
      JSON.stringify({
        name: 'typescript',
        version: ts.version,
        main: tsEntry,
      }),
    );
    put(
      resolve(app, 'node_modules/next/package.json'),
      JSON.stringify({
        name: 'next',
        version: '16.2.9',
        bin: { next: 'cli.cjs' },
      }),
    );
    put(
      resolve(app, 'node_modules/next/cli.cjs'),
      `
const fs = require('node:fs');
const path = require('node:path');
fs.appendFileSync(path.resolve('../../trace'), JSON.stringify({ app: process.cwd(), args: process.execArgv, pid: process.pid }) + '\\n');
const mode = fs.existsSync('mode') ? fs.readFileSync('mode', 'utf8') : '';
if (mode === 'throw') throw new Error('focused config failure');
if (mode === 'reject') Promise.reject(new Error('focused async rejection'));
else if (mode === 'early') process.exit(0);
else if (mode === 'signal') process.kill(process.pid, 'SIGKILL');
else if (mode === 'hang') {
  fs.writeFileSync('child.pid', String(process.pid));
  setInterval(() => {}, 1000);
} else {
  const outputs = ${JSON.stringify(valid)};
  const keys = Object.keys(outputs);
  if (mode === 'missing') delete outputs[keys[1]];
  if (mode === 'empty') outputs[keys[1]] = '';
  if (mode === 'malformed') outputs[keys[1]] = 'type = {';
  if (mode === 'wrong') outputs[keys[2]] = outputs[keys[2]].replace('./routes.js', './wrong.js');
  if (mode === 'write') { fs.mkdirSync(keys[0]); }
  for (const [name, value] of Object.entries(outputs)) {
    fs.mkdirSync(path.dirname(name), { recursive: true });
    fs.writeFileSync(name, value);
  }
}
`,
    );
  }
  return directory;
}

function trace(directory) {
  const path = resolve(directory, 'trace');
  return existsSync(path)
    ? readFileSync(path, 'utf8').trim().split('\n').map(JSON.parse)
    : [];
}

function noLock(directory) {
  assert.equal(existsSync(resolve(directory, lockName)), false);
}

function setMode(directory, mode, index = 0) {
  put(resolve(directory, apps[index][0], 'mode'), mode);
}

test('preflight resolves installed real Next and TypeScript for all six canonical apps read-only', () => {
  for (const application of applications) {
    const app = preflight(root, application);
    assert.equal(app.ts.version, ts.version);
    assert.ok(app.cli.endsWith('next'));
  }
});

test('six sequential focused processes use strict arguments/shell:false and validate 24 fresh outputs', async (t) => {
  const directory = fixture(t);
  const seen = [];
  await runBootstrap(directory, {
    spawnProcess(command, args, options) {
      seen.push([command, args, options]);
      assert.equal(options.shell, false);
      assert.equal(options.stdio, 'inherit');
      return spawn(command, args, options);
    },
  });
  noLock(directory);
  assert.equal(seen.length, 6);
  assert.deepEqual(
    trace(directory).map((row) => row.app),
    apps.map(([path]) => resolve(directory, path)),
  );
  for (const [index, [command, args, options]] of seen.entries()) {
    assert.equal(command, process.execPath);
    assert.equal(args[0], '--unhandled-rejections=strict');
    assert.equal(args[2], 'typegen');
    assert.equal(options.cwd, resolve(directory, apps[index][0]));
    assert.equal(
      validateOutputs(directory, preflight(directory, apps[index])).length,
      4,
    );
  }
});

for (let index = 0; index < apps.length; index += 1) {
  test(`focused failure at position ${index + 1} stops later generators and releases lock`, async (t) => {
    const directory = fixture(t);
    setMode(directory, 'throw', index);
    let recursive = false;
    await assert.rejects(async () => {
      await runBootstrap(directory);
      recursive = true;
    });
    assert.equal(recursive, false);
    assert.equal(trace(directory).length, index + 1);
    noLock(directory);
  });
}

for (const mode of [
  'reject',
  'early',
  'missing',
  'empty',
  'malformed',
  'wrong',
  'write',
  'signal',
]) {
  test(`focused ${mode} fails closed, rejects stale output and releases owned lock`, async (t) => {
    const directory = fixture(t);
    const app = preflight(directory, apps[0]);
    for (const [name, content] of Object.entries(valid))
      put(resolve(app.appDirectory, name), content);
    setMode(directory, mode);
    await assert.rejects(runBootstrap(directory));
    assert.equal(trace(directory).length, 1);
    if (mode === 'early')
      for (const name of outputs)
        assert.equal(existsSync(resolve(app.appDirectory, name)), false);
    noLock(directory);
  });
}

for (const mode of [
  'missing-app',
  'missing-package',
  'name',
  'version',
  'cli',
  'ts',
  'ts-mismatch',
]) {
  test(`all-six preflight ${mode} fails before any generation and releases lock`, async (t) => {
    const directory = fixture(t);
    const app = resolve(directory, apps[5][0]);
    if (mode === 'missing-app') rmSync(app, { recursive: true });
    if (mode === 'missing-package') unlinkSync(resolve(app, 'package.json'));
    if (mode === 'name') put(resolve(app, 'package.json'), '{"name":"wrong"}');
    if (mode === 'version')
      put(
        resolve(app, 'node_modules/next/package.json'),
        '{"name":"next","version":"99.0.0","bin":{"next":"cli.cjs"}}',
      );
    if (mode === 'cli') unlinkSync(resolve(app, 'node_modules/next/cli.cjs'));
    if (mode === 'ts')
      unlinkSync(resolve(app, 'node_modules/typescript/package.json'));
    if (mode === 'ts-mismatch')
      put(
        resolve(app, 'node_modules/typescript/package.json'),
        JSON.stringify({ name: 'typescript', version: '0.0.0', main: tsEntry }),
      );
    await assert.rejects(runBootstrap(directory));
    assert.equal(trace(directory).length, 0);
    noLock(directory);
  });
}

test('revalidates later app before invocation after initial preflight', async (t) => {
  const directory = fixture(t);
  await assert.rejects(
    runBootstrap(directory, {
      spawnProcess(command, args, options) {
        const child = spawn(command, args, options);
        child.once('close', () =>
          put(
            resolve(directory, apps[1][0], 'package.json'),
            '{"name":"changed"}',
          ),
        );
        return child;
      },
    }),
  );
  assert.equal(trace(directory).length, 1);
  noLock(directory);
});

test('fresh invalidation removes only four outputs and retains other generated/source files', (t) => {
  const directory = fixture(t);
  const app = preflight(directory, apps[0]);
  for (const [name, content] of Object.entries(valid))
    put(resolve(app.appDirectory, name), content);
  put(resolve(app.appDirectory, '.next/keep'), 'keep');
  invalidateOutputs(directory, app);
  for (const name of outputs)
    assert.equal(existsSync(resolve(app.appDirectory, name)), false);
  assert.equal(
    readFileSync(resolve(app.appDirectory, '.next/keep'), 'utf8'),
    'keep',
  );
});

for (const name of outputs) {
  test(`structural validation for ${name} requires parseable nonempty correct structure`, () => {
    validateOutput(ts, name, valid[name]);
    for (const content of ['', 'type = {', 'export {};'])
      assert.throws(() => validateOutput(ts, name, content));
  });
}

test('cross-file route import/export consistency fails closed', (t) => {
  const directory = fixture(t);
  const app = preflight(directory, apps[0]);
  for (const [name, content] of Object.entries(valid))
    put(resolve(app.appDirectory, name), content);
  put(
    resolve(app.appDirectory, outputs[2]),
    valid[outputs[2]].replace('AppRoutes,', 'UnknownRoute, AppRoutes,'),
  );
  assert.throws(() => validateOutputs(directory, app), /missing route exports/);
});

for (const mode of [
  'parent-link',
  'file-link',
  'hard-link',
  'tracked',
  'directory',
]) {
  test(`unsafe output ${mode} rejected without invalidation or external writes`, async (t) => {
    const directory = fixture(t);
    const app = resolve(directory, apps[0][0]);
    const outside = resolve(directory, 'outside');
    mkdirSync(outside);
    put(resolve(outside, 'keep'), 'unchanged');
    if (mode === 'parent-link')
      symlinkSync(outside, resolve(app, '.next'), 'junction');
    if (mode === 'file-link')
      symlinkSync(resolve(outside, 'keep'), resolve(app, outputs[0]), 'file');
    if (mode === 'hard-link')
      linkSync(resolve(outside, 'keep'), resolve(app, outputs[0]));
    if (mode === 'directory') mkdirSync(resolve(app, outputs[0]));
    if (mode === 'tracked') {
      put(resolve(app, outputs[0]), 'tracked');
      execFileSync('git', ['add', '--', resolve(app, outputs[0])], {
        cwd: directory,
      });
    }
    await assert.rejects(runBootstrap(directory));
    assert.equal(trace(directory).length, 0);
    assert.equal(readFileSync(resolve(outside, 'keep'), 'utf8'), 'unchanged');
    noLock(directory);
  });
}

test('out-of-root path is rejected', (t) => {
  const directory = fixture(t);
  assert.throws(
    () => safePath(directory, resolve(directory, '../outside')),
    /Unsafe path/,
  );
});

test('lock contention preserves owner; owner releases after conflict', (t) => {
  const directory = fixture(t);
  const release = acquireLock(directory);
  const content = readFileSync(resolve(directory, lockName), 'utf8');
  assert.throws(() => acquireLock(directory));
  assert.equal(readFileSync(resolve(directory, lockName), 'utf8'), content);
  release();
  noLock(directory);
});

for (const name of ['.next/lock', '.next/dev/lock']) {
  test(`existing Next lock ${name} rejects safely without removing it`, async (t) => {
    const directory = fixture(t);
    put(resolve(directory, apps[0][0], name), 'other owner');
    await assert.rejects(runBootstrap(directory));
    assert.equal(
      readFileSync(resolve(directory, apps[0][0], name), 'utf8'),
      'other owner',
    );
    noLock(directory);
  });
}

test('actual spawn error closes child lifecycle and releases lock', async (t) => {
  const directory = fixture(t);
  await assert.rejects(
    runBootstrap(directory, {
      spawnProcess(command, args, options) {
        return spawn(resolve(directory, 'missing-executable'), args, options);
      },
    }),
  );
  assert.equal(trace(directory).length, 0);
  noLock(directory);
});

test('synchronous spawn exception releases lock', async (t) => {
  const directory = fixture(t);
  await assert.rejects(
    runBootstrap(directory, {
      spawnProcess() {
        throw new Error('spawn refused');
      },
    }),
  );
  noLock(directory);
});

test('actual hanging child timeout awaits termination then releases lock; contender cannot remove owner', async (t) => {
  const directory = fixture(t);
  setMode(directory, 'hang');
  let childPid;
  let closed = false;
  const result = runBootstrap(directory, {
    timeoutMs: 1000,
    spawnProcess(command, args, options) {
      const child = spawn(command, args, options);
      childPid = child.pid;
      child.once('close', () => {
        closed = true;
      });
      assert.throws(() => acquireLock(directory));
      assert.equal(existsSync(resolve(directory, lockName)), true);
      return child;
    },
  });
  await assert.rejects(result, /timed out/);
  assert.equal(closed, true);
  assert.throws(() => process.kill(childPid, 0));
  assert.equal(trace(directory).length, 1);
  noLock(directory);
});

test('overlapping bootstrap invocation rejects before invalidation and preserves active owner', async (t) => {
  const directory = fixture(t);
  setMode(directory, 'hang');
  const owner = runBootstrap(directory, { timeoutMs: 1000 });
  const ownerFailure = assert.rejects(owner, /timed out/);
  const token = readFileSync(resolve(directory, lockName), 'utf8');
  await assert.rejects(runBootstrap(directory), /EEXIST/);
  assert.equal(readFileSync(resolve(directory, lockName), 'utf8'), token);
  await ownerFailure;
  assert.equal(trace(directory).length, 1);
  noLock(directory);
});

test('abort terminates only the owned child and releases lock after close', async (t) => {
  const directory = fixture(t);
  setMode(directory, 'hang');
  const controller = new AbortController();
  let childPid;
  const result = runBootstrap(directory, {
    signal: controller.signal,
    spawnProcess(command, args, options) {
      const child = spawn(command, args, options);
      childPid = child.pid;
      child.once('spawn', () => controller.abort());
      return child;
    },
  });
  await assert.rejects(result, /interrupted/);
  assert.throws(() => process.kill(childPid, 0));
  noLock(directory);
});
