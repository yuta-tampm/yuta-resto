// Shared checkout identity checks. These coordinate guarded clients, not an OS sandbox.
import { execFileSync } from 'node:child_process';
import { lstatSync, realpathSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

export function reject(message) {
  throw new Error(`TASK_GUARD: ${message}`);
}

export function assertGitEnvironment(env = process.env) {
  for (const name of [
    'GIT_DIR',
    'GIT_WORK_TREE',
    'GIT_INDEX_FILE',
    'GIT_COMMON_DIR',
    'GIT_OBJECT_DIRECTORY',
    'GIT_ALTERNATE_OBJECT_DIRECTORIES',
    'GIT_CONFIG_GLOBAL',
    'GIT_CONFIG_SYSTEM',
    'GIT_CONFIG_COUNT',
    'GIT_CONFIG_PARAMETERS',
    'GIT_CONFIG',
  ]) {
    if (env[name]) reject(`Inherited ${name} is forbidden.`);
  }
}

export function gitAt(cwd, args) {
  assertGitEnvironment();
  return execFileSync(
    'git',
    ['-c', 'core.autocrlf=false', '-c', 'core.safecrlf=false', ...args],
    {
      cwd,
      encoding: 'utf8',
      windowsHide: true,
      maxBuffer: 32 * 1024 * 1024,
    },
  ).trim();
}

export function pathKey(value) {
  const absolute = resolve(value);
  return process.platform === 'win32' ? absolute.toLowerCase() : absolute;
}

export function assertPlainPath(value, { file = false } = {}) {
  const absolute = resolve(value);
  const ancestors = [];
  for (
    let cursor = absolute;
    dirname(cursor) !== cursor;
    cursor = dirname(cursor)
  )
    ancestors.unshift(cursor);
  for (const current of ancestors) {
    let stat;
    try {
      stat = lstatSync(current);
    } catch (error) {
      if (error.code === 'ENOENT') return;
      throw error;
    }
    if (stat.isSymbolicLink()) reject(`Linked path: ${current}`);
    if (current === absolute && file && (!stat.isFile() || stat.nlink !== 1))
      reject(`Non-regular or hardlinked file: ${current}`);
    if (current !== absolute && !stat.isDirectory())
      reject(`Non-directory parent: ${current}`);
  }
}

export function checkoutIdentity(checkout) {
  assertPlainPath(checkout);
  const top = gitAt(checkout, ['rev-parse', '--show-toplevel']);
  if (
    pathKey(realpathSync.native(top)) !== pathKey(realpathSync.native(checkout))
  )
    reject('Command must use the exact worktree root.');
  const gitDirectory = gitAt(checkout, [
    'rev-parse',
    '--path-format=absolute',
    '--git-dir',
  ]);
  const commonDirectory = gitAt(checkout, [
    'rev-parse',
    '--path-format=absolute',
    '--git-common-dir',
  ]);
  assertPlainPath(gitDirectory);
  assertPlainPath(commonDirectory);
  if (pathKey(gitDirectory) === pathKey(commonDirectory))
    reject('Primary checkout is read-only for task writes.');
  const branch = gitAt(checkout, ['symbolic-ref', '--short', 'HEAD']);
  if (['main', 'master'].includes(branch))
    reject('Default branch is forbidden for task writes.');
  return {
    checkout: realpathSync.native(checkout),
    gitDirectory,
    commonDirectory,
    branch,
    head: gitAt(checkout, ['rev-parse', 'HEAD']),
  };
}

export function verifyCheckoutBinding(binding) {
  const current = checkoutIdentity(binding.checkout);
  for (const field of ['checkout', 'gitDirectory', 'commonDirectory']) {
    if (binding[field] && pathKey(current[field]) !== pathKey(binding[field]))
      reject(`${field} changed.`);
  }
  if (current.branch !== binding.branch || current.head !== binding.head)
    reject('Branch or exact HEAD changed.');
  return current;
}

export function taskStorage(identity) {
  return {
    registry: join(identity.commonDirectory, 'yuta-task-guards'),
    claim: join(identity.gitDirectory, 'yuta-task-guard-id'),
  };
}
