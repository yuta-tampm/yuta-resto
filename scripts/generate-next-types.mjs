import { spawn, execFileSync } from 'node:child_process';
import {
  closeSync,
  fstatSync,
  lstatSync,
  openSync,
  readFileSync,
  realpathSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, isAbsolute, relative, resolve, sep } from 'node:path';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';

export const repositoryRoot = fileURLToPath(new URL('../', import.meta.url));
export const applications = Object.freeze(
  [
    ['apps/backoffice', '@yuta/backoffice'],
    ['apps/web', '@yuta/web'],
    ['apps/booking-web', '@yuta/booking-web'],
    ['apps/feedback-web', '@yuta/feedback-web'],
    ['apps/yuta-pos', '@yuta/pos'],
    ['apps/yuta-display', '@yuta/display'],
  ].map(Object.freeze),
);
export const outputs = Object.freeze([
  'next-env.d.ts',
  '.next/types/routes.d.ts',
  '.next/types/validator.ts',
  '.next/types/cache-life.d.ts',
]);
export const lockName = '.tmp-next-typegen.lock';

function requireCondition(condition, message) {
  if (!condition) throw new Error(message);
}

function statIfPresent(path) {
  try {
    return lstatSync(path);
  } catch (error) {
    if (error.code === 'ENOENT') return undefined;
    throw error;
  }
}

// Check every existing parent without following links. Missing output parents
// are allowed, but an existing directory/file of the wrong kind is not.
export function safePath(root, path, kind = 'file') {
  const base = resolve(root);
  const target = resolve(path);
  const rel = relative(base, target);
  requireCondition(
    rel && !isAbsolute(rel) && rel !== '..' && !rel.startsWith(`..${sep}`),
    `Unsafe path: ${target}`,
  );
  const rootStat = lstatSync(base);
  requireCondition(
    rootStat.isDirectory() &&
      !rootStat.isSymbolicLink() &&
      realpathSync(base) === base,
    `Unsafe root: ${base}`,
  );
  const parts = rel.split(sep);
  let current = base;
  for (const [index, part] of parts.entries()) {
    current = resolve(current, part);
    const stat = statIfPresent(current);
    if (!stat) return undefined;
    requireCondition(
      !stat.isSymbolicLink() && realpathSync(current) === current,
      `Linked path: ${current}`,
    );
    const last = index === parts.length - 1;
    requireCondition(
      last && kind !== 'directory'
        ? stat.isFile() && (kind === 'dependency-file' || stat.nlink === 1)
        : stat.isDirectory(),
      `Unexpected path kind: ${current}`,
    );
    if (last) return stat;
  }
}

function assertUntracked(root, paths) {
  const tracked = execFileSync(
    'git',
    ['ls-files', '-z', '--', ...paths.map((path) => relative(root, path))],
    { cwd: root, encoding: 'utf8' },
  );
  requireCondition(
    tracked.length === 0,
    `Generated target is tracked source: ${tracked.replaceAll('\0', ', ')}`,
  );
}

export function assertNoNextLocks(root, appDirectory) {
  for (const name of ['.next/lock', '.next/dev/lock']) {
    const path = resolve(appDirectory, name);
    requireCondition(
      !safePath(root, path),
      `Next process lock exists: ${path}; use an exclusive checkout`,
    );
  }
}

export function preflight(root, application) {
  const [path, name] = application;
  const appDirectory = resolve(root, path);
  requireCondition(
    safePath(root, appDirectory, 'directory'),
    `Missing app: ${path}`,
  );
  const manifestPath = resolve(appDirectory, 'package.json');
  requireCondition(safePath(root, manifestPath), `Missing package: ${path}`);
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  requireCondition(manifest.name === name, `Package name mismatch: ${path}`);
  const require = createRequire(manifestPath);
  const nextManifestPath = require.resolve('next/package.json');
  const nextManifest = JSON.parse(readFileSync(nextManifestPath, 'utf8'));
  requireCondition(
    nextManifest.name === 'next' && nextManifest.version === '16.2.9',
    `Unreviewed Next version: ${path}`,
  );
  const bin =
    typeof nextManifest.bin === 'string'
      ? nextManifest.bin
      : nextManifest.bin?.next;
  requireCondition(
    typeof bin === 'string' && bin.length > 0,
    `Missing public Next CLI: ${path}`,
  );
  const nextRoot = realpathSync(dirname(nextManifestPath));
  const cli = resolve(nextRoot, bin);
  requireCondition(
    safePath(nextRoot, cli, 'dependency-file'),
    `Invalid public Next CLI: ${path}`,
  );
  const tsManifest = JSON.parse(
    readFileSync(require.resolve('typescript/package.json'), 'utf8'),
  );
  requireCondition(
    tsManifest.name === 'typescript' && typeof tsManifest.version === 'string',
    `Invalid TypeScript package: ${path}`,
  );
  const ts = require('typescript');
  requireCondition(
    ts.version === tsManifest.version &&
      typeof ts.createSourceFile === 'function' &&
      typeof ts.isTypeAliasDeclaration === 'function',
    `Invalid TypeScript parser: ${path}`,
  );
  assertNoNextLocks(root, appDirectory);
  return { path, name, appDirectory, cli, ts };
}

function checkedOutputs(root, app) {
  requireCondition(
    safePath(root, app.appDirectory, 'directory'),
    'Missing app directory',
  );
  const paths = outputs.map((name) => resolve(app.appDirectory, name));
  for (const path of paths) safePath(app.appDirectory, path);
  assertUntracked(root, paths);
  return paths;
}

export function invalidateOutputs(root, app) {
  assertNoNextLocks(root, app.appDirectory);
  const paths = checkedOutputs(root, app);
  for (const path of paths) {
    assertUntracked(root, [path]);
    if (safePath(app.appDirectory, path)) unlinkSync(path);
  }
  for (const path of paths)
    requireCondition(
      !safePath(app.appDirectory, path),
      `Output not absent: ${path}`,
    );
}

export function validateOutput(ts, name, content) {
  requireCondition(content.trim().length > 0, `Empty output: ${name}`);
  const source = ts.createSourceFile(
    name,
    content,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );
  requireCondition(
    source.parseDiagnostics.length === 0,
    `Malformed TypeScript output: ${name}`,
  );
  const statements = [...source.statements];
  const aliases = statements.filter(ts.isTypeAliasDeclaration);
  const imports = statements.filter(ts.isImportDeclaration);
  const named = (nodes, expected) =>
    nodes.some((node) => node.name?.text === expected);
  if (name === outputs[0]) {
    const refs = source.typeReferenceDirectives.map((ref) => ref.fileName);
    requireCondition(
      refs.includes('next') &&
        refs.includes('next/image-types/global') &&
        imports.some(
          (node) => node.moduleSpecifier.text === './.next/types/routes.d.ts',
        ),
      'Invalid next-env references',
    );
  } else if (name === outputs[1]) {
    const exported = statements
      .filter(ts.isExportDeclaration)
      .flatMap((node) =>
        node.exportClause && ts.isNamedExports(node.exportClause)
          ? node.exportClause.elements.map((element) => element.name.text)
          : [],
      );
    requireCondition(
      named(aliases, 'AppRoutes') &&
        named(statements.filter(ts.isInterfaceDeclaration), 'ParamMap') &&
        ['AppRoutes', 'LayoutRoutes', 'ParamMap'].every((key) =>
          exported.includes(key),
        ),
      'Invalid route declarations/exports',
    );
  } else if (name === outputs[2]) {
    const routeImport = imports.find(
      (node) =>
        node.moduleSpecifier.text === './routes.js' &&
        node.importClause?.isTypeOnly,
    );
    const bindings = routeImport?.importClause?.namedBindings;
    const names =
      bindings && ts.isNamedImports(bindings)
        ? bindings.elements.map((node) => node.name.text)
        : [];
    const config = (key) =>
      aliases.some(
        (node) =>
          node.name.text === key &&
          ts.isTypeLiteralNode(node.type) &&
          node.typeParameters?.some((param) => param.name.text === 'Route') &&
          node.type.members.some(
            (member) => member.name?.getText(source) === 'default',
          ),
      );
    requireCondition(
      ['AppRoutes', 'LayoutRoutes', 'ParamMap'].every((key) =>
        names.includes(key),
      ) &&
        config('AppPageConfig') &&
        config('LayoutConfig'),
      'Invalid validator references/configs',
    );
  } else if (name === outputs[3]) {
    const module = statements.find(
      (node) =>
        ts.isModuleDeclaration(node) &&
        node.name.text === 'next/cache' &&
        node.modifiers?.some(
          (modifier) => modifier.kind === ts.SyntaxKind.DeclareKeyword,
        ),
    );
    requireCondition(
      module?.body &&
        ts.isModuleBlock(module.body) &&
        module.body.statements.some(
          (node) =>
            ts.isFunctionDeclaration(node) && node.name?.text === 'cacheLife',
        ),
      'Invalid cache-life declarations',
    );
  } else {
    throw new Error(`Unexpected output: ${name}`);
  }
  return source;
}

export function validateOutputs(root, app) {
  const paths = checkedOutputs(root, app);
  const parsed = paths.map((path, index) => {
    requireCondition(
      safePath(app.appDirectory, path),
      `Missing fresh output: ${path}`,
    );
    return validateOutput(app.ts, outputs[index], readFileSync(path, 'utf8'));
  });
  const routeExports = parsed[1].statements
    .filter(app.ts.isExportDeclaration)
    .flatMap((node) =>
      node.exportClause && app.ts.isNamedExports(node.exportClause)
        ? node.exportClause.elements.map((item) => item.name.text)
        : [],
    );
  for (const node of parsed[2].statements.filter(app.ts.isImportDeclaration)) {
    if (node.moduleSpecifier.text !== './routes.js') continue;
    const bindings = node.importClause?.namedBindings;
    requireCondition(
      bindings &&
        app.ts.isNamedImports(bindings) &&
        bindings.elements.every((item) =>
          routeExports.includes(item.propertyName?.text ?? item.name.text),
        ),
      'Validator imports missing route exports',
    );
  }
  return paths;
}

export function acquireLock(root) {
  const path = resolve(root, lockName);
  safePath(root, path);
  assertUntracked(root, [path]);
  const descriptor = openSync(path, 'wx');
  const identity = fstatSync(descriptor);
  const token = randomUUID();
  try {
    writeFileSync(descriptor, token);
  } catch (error) {
    closeSync(descriptor);
    const current = safePath(root, path);
    if (current?.ino === identity.ino && current.dev === identity.dev)
      unlinkSync(path);
    throw error;
  }
  closeSync(descriptor);
  return () => {
    const current = safePath(root, path);
    requireCondition(
      current?.ino === identity.ino &&
        current.dev === identity.dev &&
        readFileSync(path, 'utf8') === token,
      'Owned bootstrap lock was replaced; refusing removal',
    );
    unlinkSync(path);
  };
}

// Dependency injection is for focused module tests only. The CLI has no target,
// timeout, executable or output-validation override.
export function runChild(
  app,
  { spawnProcess = spawn, timeoutMs = 120_000, signal } = {},
) {
  return new Promise((resolveRun, reject) => {
    if (signal?.aborted) {
      reject(new Error('Bootstrap interrupted'));
      return;
    }
    let child;
    let failure;
    let timer;
    const terminate = (reason) => {
      failure ??= new Error(reason);
      if (child?.pid && child.exitCode === null && child.signalCode === null)
        child.kill('SIGKILL');
    };
    const abort = () => terminate('Bootstrap interrupted');
    try {
      child = spawnProcess(
        process.execPath,
        ['--unhandled-rejections=strict', app.cli, 'typegen'],
        { cwd: app.appDirectory, shell: false, stdio: 'inherit' },
      );
    } catch (error) {
      reject(error);
      return;
    }
    child.once('error', (error) => {
      failure ??= error;
    });
    child.once('close', (code, childSignal) => {
      clearTimeout(timer);
      signal?.removeEventListener('abort', abort);
      if (failure || code !== 0 || childSignal)
        reject(
          failure ??
            new Error(
              `Next failed: ${app.name}; exit=${code}; signal=${childSignal}`,
            ),
        );
      else resolveRun();
    });
    timer = setTimeout(
      () =>
        terminate(`Next typegen timed out after ${timeoutMs}ms: ${app.name}`),
      timeoutMs,
    );
    signal?.addEventListener('abort', abort, { once: true });
    if (signal?.aborted) abort();
  });
}

export async function runBootstrap(root = repositoryRoot, processOptions = {}) {
  const release = acquireLock(root);
  try {
    for (const application of applications) preflight(root, application);
    for (const application of applications) {
      const app = preflight(root, application);
      invalidateOutputs(root, app);
      console.log(`[typegen:next] ${app.path}: strict Next 16.2.9 start`);
      await runChild(app, processOptions);
      const paths = validateOutputs(root, app);
      console.log(
        `[typegen:next] ${app.path}: exit 0; ${paths.length}/4 fresh outputs validated`,
      );
    }
  } finally {
    release();
  }
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const controller = new AbortController();
  const interrupt = () => controller.abort();
  process.on('SIGINT', interrupt);
  process.on('SIGTERM', interrupt);
  try {
    requireCondition(
      process.argv.length === 2,
      'typegen:next accepts no arguments',
    );
    await runBootstrap(repositoryRoot, { signal: controller.signal });
  } catch (error) {
    console.error(`[typegen:next] FAILED: ${error.message}`);
    process.exitCode = 1;
  } finally {
    process.off('SIGINT', interrupt);
    process.off('SIGTERM', interrupt);
  }
}
