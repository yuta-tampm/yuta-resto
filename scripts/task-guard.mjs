// Explicit guarded write/commit entry points and a Codex PreToolUse adapter.
// Session/writer fields attribute work; they do not authenticate a human or subagent.
import { createHash } from 'node:crypto';
import {
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { dirname, isAbsolute, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { z } from 'zod';
import {
  acquireLocks,
  describeCommandProblem,
  describePathProblem,
  isPrivateEnvironmentPath,
} from './claude-task.mjs';
import {
  assertPlainPath,
  checkoutIdentity,
  gitAt,
  pathKey,
  reject,
  taskStorage,
  verifyCheckoutBinding,
} from './task-checkout.mjs';

const text = z.string().min(1);
const sha = z.string().regex(/^[a-f0-9]{64}$/u);
const exactPath = text.refine(
  (value) =>
    !describePathProblem(value) &&
    !isPrivateEnvironmentPath(value) &&
    !value
      .split('/')
      .some((part) => ['.private', '.ssh', '.aws'].includes(part)) &&
    !value.endsWith('.credentials.json'),
);
const configSchema = z
  .object({
    schemaVersion: z.literal(1),
    task: z.string().regex(/^[a-z0-9][a-z0-9-]{0,62}$/u),
    writer: text,
    sessionId: text,
    collaborationMode: z.enum([
      'CODEX_ONLY',
      'HUMAN_COLLABORATION',
      'CT_BRIDGE',
      'HUMAN_CT_BRIDGE',
    ]),
    modeSource: text,
    commitAfterTask: z.enum(['YES', 'NO', 'NOT_SELECTED']),
    commitSource: text,
    baseCommit: z.string().regex(/^[a-f0-9]{40}$/u),
    writePaths: z.array(exactPath).min(1),
    commands: z
      .array(text.refine((value) => !describeCommandProblem(value)))
      .default([]),
  })
  .strict();
const bindingSchema = configSchema
  .extend({
    checkout: text,
    gitDirectory: text,
    commonDirectory: text,
    branch: text,
    head: text,
    status: z.enum(['ACTIVE', 'COMMITTING', 'COMPLETE']),
    pending: z
      .object({ tree: text, parent: text, candidateDigest: sha })
      .strict()
      .optional(),
    commit: text.optional(),
  })
  .strict();
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');
const readJson = (path) => {
  assertPlainPath(path, { file: true });
  return JSON.parse(readFileSync(path, 'utf8'));
};
const jsonBytes = (value) => `${JSON.stringify(value, null, 2)}\n`;

function replaceJson(path, value) {
  assertPlainPath(path, { file: true });
  const temporary = `${path}.${process.pid}.tmp`;
  writeFileSync(temporary, jsonBytes(value), { flag: 'wx' });
  renameSync(temporary, path);
}

function target(binding, path) {
  exactPath.parse(path);
  if (
    !binding.writePaths.some(
      (allowed) =>
        pathKey(join(binding.checkout, allowed)) ===
        pathKey(join(binding.checkout, path)),
    )
  )
    reject(`Path outside allowlist: ${path}`);
  const absolute = join(binding.checkout, path);
  assertPlainPath(absolute, { file: true });
  return absolute;
}

export function registerTask(checkout, value) {
  const config = configSchema.parse(value);
  if (
    new Set(config.writePaths.map((p) => pathKey(join(checkout, p)))).size !==
    config.writePaths.length
  )
    reject('Duplicate write paths.');
  const identity = checkoutIdentity(checkout);
  if (
    identity.head !== config.baseCommit ||
    gitAt(checkout, ['status', '--porcelain'])
  )
    reject('Registration requires a clean exact base.');
  const storage = taskStorage(identity);
  assertPlainPath(storage.registry);
  mkdirSync(storage.registry, { recursive: true });
  const release = acquireLocks(storage.registry, ['registration'], {
    task: config.task,
    writer: config.writer,
  });
  const path = join(storage.registry, `${config.task}.json`);
  try {
    verifyCheckoutBinding(identity);
    if (gitAt(checkout, ['status', '--porcelain']))
      reject('Checkout changed during registration.');
    if (existsSync(storage.claim) || existsSync(path))
      reject('Task ID or worktree is already claimed.');
    for (const allowed of config.writePaths)
      target({ ...config, ...identity }, allowed);
    const binding = { ...config, ...identity, status: 'ACTIVE' };
    writeFileSync(path, jsonBytes(binding), { flag: 'wx' });
    // A failed claim leaves the reserved task ID; it is never silently reused.
    writeFileSync(storage.claim, config.task, { flag: 'wx' });
    return binding;
  } finally {
    release();
  }
}

export function readBinding(checkout) {
  const identity = checkoutIdentity(checkout);
  const storage = taskStorage(identity);
  assertPlainPath(storage.claim, { file: true });
  const task = readFileSync(storage.claim, 'utf8');
  if (!/^[a-z0-9][a-z0-9-]{0,62}$/u.test(task)) reject('Invalid task claim.');
  const path = join(storage.registry, `${task}.json`);
  const binding = bindingSchema.parse(readJson(path));
  if (binding.task !== task) reject('Claim mismatch.');
  for (const key of ['checkout', 'gitDirectory', 'commonDirectory'])
    if (pathKey(binding[key]) !== pathKey(identity[key]))
      reject(`Claim ${key} mismatch.`);
  return { binding, path, storage };
}

function withTask(
  checkout,
  actor,
  operation,
  { allowComplete = false, allowPending = false } = {},
) {
  const loaded = readBinding(checkout);
  const release = acquireLocks(
    loaded.storage.registry,
    [`operation-${loaded.binding.task}`],
    { task: loaded.binding.task, writer: actor.writer },
  );
  try {
    const binding = bindingSchema.parse(readJson(loaded.path));
    if (
      binding.writer !== actor.writer ||
      binding.sessionId !== actor.sessionId
    )
      reject('Writer/session attribution mismatch.');
    if (binding.status === 'COMMITTING' && !allowPending)
      reject('Uncertain commit: inspect outcome before another operation.');
    if (binding.status === 'COMPLETE' && !allowComplete)
      reject('Task is complete; writes are closed.');
    if (binding.status !== 'COMMITTING') verifyCheckoutBinding(binding);
    return operation(binding, loaded.path);
  } finally {
    release();
  }
}

export function candidateSnapshot(binding) {
  verifyCheckoutBinding(binding);
  if (gitAt(binding.checkout, ['ls-files', '--unmerged']))
    reject('Unmerged index entries.');
  const changed = gitAt(binding.checkout, [
    'diff',
    '--name-only',
    '--no-renames',
    '-z',
    'HEAD',
  ])
    .split('\0')
    .filter(Boolean);
  const untracked = gitAt(binding.checkout, [
    'ls-files',
    '--others',
    '--exclude-standard',
    '-z',
  ])
    .split('\0')
    .filter(Boolean);
  const staged = gitAt(binding.checkout, [
    'diff',
    '--cached',
    '--name-only',
    '--no-renames',
    '-z',
    'HEAD',
  ])
    .split('\0')
    .filter(Boolean);
  const paths = [...new Set([...changed, ...staged, ...untracked])].sort();
  const files = paths.map((path) => {
    const absolute = target(binding, path);
    if (!existsSync(absolute))
      return { path, type: 'deleted', mode: null, sha256: null, bytes: 0 };
    const index = gitAt(binding.checkout, ['ls-files', '--stage', '--', path]);
    const mode = index
      ? index.split(' ')[0]
      : process.platform !== 'win32' && lstatSync(absolute).mode & 0o111
        ? '100755'
        : '100644';
    if (!['100644', '100755'].includes(mode)) reject('Unsupported file mode.');
    const bytes = readFileSync(absolute);
    return {
      path,
      type: 'file',
      mode,
      filesystemMode: lstatSync(absolute).mode & 0o777,
      sha256: hash(bytes),
      blob: createHash('sha1')
        .update(Buffer.from('blob ' + bytes.length + '\0'))
        .update(bytes)
        .digest('hex'),
      bytes: bytes.length,
    };
  });
  const snapshot = {
    task: binding.task,
    checkout: binding.checkout,
    commonDirectory: binding.commonDirectory,
    branch: binding.branch,
    baseCommit: binding.baseCommit,
    head: binding.head,
    indexTree: gitAt(binding.checkout, ['write-tree']),
    files,
  };
  return { ...snapshot, digest: hash(JSON.stringify(snapshot)) };
}

export function inspectTask(checkout, actor) {
  return withTask(checkout, actor, (binding) => candidateSnapshot(binding));
}

export function writeTaskFiles(checkout, actor, value) {
  const writes = z
    .array(
      z
        .object({
          path: exactPath,
          contentBase64: z
            .string()
            .regex(
              /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/u,
            ),
        })
        .strict(),
    )
    .min(1)
    .parse(value);
  return withTask(checkout, actor, (binding) => {
    candidateSnapshot(binding);
    if (
      new Set(writes.map((write) => pathKey(join(checkout, write.path))))
        .size !== writes.length
    )
      reject('Duplicate write target.');
    const prepared = writes.map((write) => ({
      absolute: target(binding, write.path),
      bytes: Buffer.from(write.contentBase64, 'base64'),
    }));
    // Validate every target before the first mutation. Failures retain effects; no automatic rollback.
    for (const write of prepared) {
      verifyCheckoutBinding(binding);
      assertPlainPath(write.absolute, { file: true });
      mkdirSync(dirname(write.absolute), { recursive: true });
      writeFileSync(write.absolute, write.bytes);
    }
    return candidateSnapshot(binding);
  });
}

export function selectCommit(checkout, actor, value) {
  const selection = z
    .object({ choice: z.enum(['YES', 'NO']), source: text })
    .strict()
    .parse(value);
  return withTask(checkout, actor, (binding, path) => {
    if (binding.commitAfterTask !== 'NOT_SELECTED')
      reject('Commit choice already selected; do not silently replace it.');
    binding.commitAfterTask = selection.choice;
    binding.commitSource = selection.source;
    replaceJson(path, binding);
    return binding;
  });
}

function validateReview(binding, candidate, value) {
  const receipt = z
    .object({
      schemaVersion: z.literal(1),
      verdict: z.literal('APPROVED'),
      reviewer: text,
      source: text,
      evidencePath: text,
      evidenceSha256: sha,
      candidateDigest: sha,
    })
    .strict()
    .parse(value);
  if (receipt.reviewer === binding.writer || receipt.source === 'NONE')
    reject('Independent sourced review is required.');
  assertPlainPath(receipt.evidencePath, { file: true });
  if (hash(readFileSync(receipt.evidencePath)) !== receipt.evidenceSha256)
    reject('Review evidence bytes changed.');
  if (receipt.candidateDigest !== candidate.digest)
    reject('Reviewed candidate changed.');
  // The orchestrator must verify the actual separate reviewer/evidence source.
  // A receipt cannot authenticate its author or manufacture gate authority.
}

function recoverCommit(binding, path) {
  const identity = checkoutIdentity(binding.checkout);
  if (
    identity.branch !== binding.branch ||
    pathKey(identity.commonDirectory) !== pathKey(binding.commonDirectory)
  )
    reject('Commit recovery identity changed.');
  const actual = identity.head;
  if (actual === binding.pending.parent)
    reject(
      'Commit did not advance HEAD; retain pending state for explicit recovery.',
    );
  const parents = gitAt(binding.checkout, [
    'show',
    '-s',
    '--format=%P',
    actual,
  ]);
  if (
    parents !== binding.pending.parent ||
    gitAt(binding.checkout, ['rev-parse', `${actual}^{tree}`]) !==
      binding.pending.tree ||
    gitAt(binding.checkout, ['status', '--porcelain'])
  )
    reject('Uncertain outcome differs from reviewed commit.');
  binding.head = actual;
  binding.commit = actual;
  binding.status = 'COMPLETE';
  delete binding.pending;
  replaceJson(path, binding);
  return { commit: actual, replayed: false, recovered: true };
}

export function commitTask(checkout, actor, review, message) {
  if (
    typeof message !== 'string' ||
    !message.trim() ||
    /[\r\n\0]/u.test(message)
  )
    reject('Commit message must be one non-empty line.');
  return withTask(
    checkout,
    actor,
    (binding, path) => {
      if (binding.status === 'COMPLETE') {
        if (gitAt(checkout, ['status', '--porcelain']))
          reject('Completed checkout changed.');
        return { commit: binding.commit, replayed: false };
      }
      if (binding.status === 'COMMITTING') return recoverCommit(binding, path);
      if (binding.commitAfterTask !== 'YES')
        reject('COMMIT_AFTER_TASK is not YES.');
      const candidate = candidateSnapshot(binding);
      if (candidate.files.length === 0) reject('No task changes to commit.');
      validateReview(binding, candidate, review);
      const paths = candidate.files.map((file) => file.path);
      gitAt(checkout, ['add', '--', ...paths]);
      const after = candidateSnapshot(binding);
      if (JSON.stringify(after.files) !== JSON.stringify(candidate.files))
        reject('Candidate bytes/modes changed while staging.');
      for (const file of after.files) {
        const entry = gitAt(checkout, ['ls-files', '--stage', '--', file.path]);
        if (file.type === 'deleted') {
          if (entry) reject('Deleted path remains staged.');
        } else if (!entry.startsWith(file.mode + ' ' + file.blob + ' 0\t'))
          reject('Staged blob/mode differs from reviewed raw bytes.');
      }
      const tree = gitAt(checkout, ['write-tree']);
      const staged = gitAt(checkout, [
        'diff',
        '--cached',
        '--name-only',
        '--no-renames',
        '-z',
        'HEAD',
      ])
        .split('\0')
        .filter(Boolean)
        .sort();
      if (JSON.stringify(staged) !== JSON.stringify(paths))
        reject('Staged paths differ from reviewed candidate.');
      binding.status = 'COMMITTING';
      binding.pending = {
        tree,
        parent: binding.head,
        candidateDigest: candidate.digest,
      };
      replaceJson(path, binding);
      // Failure retains COMMITTING. Re-entry only inspects, never repeats git commit.
      gitAt(checkout, ['commit', '-m', message]);
      return recoverCommit(binding, path);
    },
    { allowComplete: true, allowPending: true },
  );
}

export function codexHook(input) {
  try {
    const event = z
      .object({
        hook_event_name: z.literal('PreToolUse'),
        cwd: text,
        session_id: text,
        tool_name: text,
        tool_input: z.record(z.unknown()),
      })
      .passthrough()
      .parse(input);
    const checkout =
      event.tool_input.workdir ?? event.tool_input.cwd ?? event.cwd;
    const { binding } = readBinding(checkout);
    return withTask(
      checkout,
      { writer: binding.writer, sessionId: event.session_id },
      (current) => {
        candidateSnapshot(current);
        if (event.tool_name === 'Bash') {
          if (
            event.tool_input.run_in_background === true ||
            event.tool_input.tty === true
          )
            reject('Background/interactive shells are not guarded.');
          if (!current.commands.includes(event.tool_input.command))
            reject(
              'Not an exact declared command; direct Git mutations are forbidden.',
            );
        } else if (event.tool_name === 'apply_patch') {
          const patch = z.string().parse(event.tool_input.command);
          const headers = [
            ...patch.matchAll(
              /^\*\*\* (?:Add File|Update File|Delete File|Move to): (.+)$/gmu,
            ),
          ].map((match) => match[1]);
          if (headers.length === 0)
            reject('Patch contains no supported file headers.');
          for (const header of headers) {
            const local = isAbsolute(header)
              ? relative(current.checkout, header).split('\\').join('/')
              : header;
            target(current, local);
          }
        } else reject('Unsupported tool path.');
        return {
          hookSpecificOutput: {
            hookEventName: 'PreToolUse',
            permissionDecision: 'allow',
            permissionDecisionReason:
              'Verified task checkout and exact operation scope.',
          },
        };
      },
    );
  } catch (error) {
    return {
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'deny',
        permissionDecisionReason: error.message,
      },
    };
  }
}

export function main(argv = process.argv.slice(2), stdin = undefined) {
  const [command, ...rest] = argv;
  const { values } = parseArgs({
    args: rest,
    options: {
      writer: { type: 'string' },
      review: { type: 'string' },
      message: { type: 'string' },
    },
    strict: true,
    allowPositionals: false,
  });
  const checkout = process.cwd();
  const actor = {
    writer: values.writer,
    sessionId: process.env.CODEX_THREAD_ID ?? process.env.CODEX_SESSION_ID,
  };
  const input = () => JSON.parse(stdin ?? readFileSync(0, 'utf8'));
  switch (command) {
    case 'register':
      return registerTask(checkout, input());
    case 'check':
    case 'snapshot':
      return inspectTask(checkout, actor);
    case 'write':
      return writeTaskFiles(checkout, actor, input());
    case 'select-commit':
      return selectCommit(checkout, actor, input());
    case 'commit': {
      const request = values.review
        ? { review: readJson(values.review), message: values.message }
        : input();
      return commitTask(checkout, actor, request.review, request.message);
    }
    case 'hook':
      try {
        return codexHook(input());
      } catch {
        return codexHook(null);
      }
    default:
      reject('Use register/check/snapshot/write/select-commit/commit/hook.');
  }
}

if (
  process.argv[1] &&
  pathKey(process.argv[1]) === pathKey(fileURLToPath(import.meta.url))
) {
  try {
    process.stdout.write(jsonBytes(main()));
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  }
}
