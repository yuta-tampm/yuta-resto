// Native disposable Git fixtures; no app runtime, database, credentials or network.
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  existsSync,
  linkSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, dirname } from 'node:path';
import { after, test } from 'node:test';
import {
  registerTask,
  writeTaskFiles,
  inspectTask,
  readBinding,
  commitTask,
  codexHook,
  selectCommit,
} from './task-guard.mjs';
import { assertGitEnvironment, taskStorage } from './task-checkout.mjs';
import { acquireLocks } from './claude-task.mjs';

const root = mkdtempSync(join(tmpdir(), 'yt-guard-'));
after(() => {
  assert.equal(dirname(resolve(root)), resolve(tmpdir()));
  rmSync(root, { recursive: true, force: true });
});
let counter = 0;
const actor = { writer: 'author', sessionId: 'fixture-session' };
const sha = (b) => createHash('sha256').update(b).digest('hex');
function git(cwd, ...args) {
  return execFileSync('git', ['-c', 'core.autocrlf=false', ...args], {
    cwd,
    encoding: 'utf8',
    windowsHide: true,
  }).trim();
}
function fixture(choice = 'YES') {
  const id = 'fixture-' + ++counter,
    primary = join(root, id),
    checkout = join(root, id + '-wt');
  mkdirSync(primary);
  git(primary, 'init', '-q', '-b', 'main');
  git(primary, 'config', 'user.name', 'Fixture');
  git(primary, 'config', 'user.email', 'fixture@example.invalid');
  git(primary, 'config', 'commit.gpgsign', 'false');
  writeFileSync(join(primary, 'allowed.txt'), 'base\n');
  writeFileSync(join(primary, 'other.txt'), 'other\n');
  git(primary, 'add', '.');
  git(primary, 'commit', '-qm', 'base');
  const base = git(primary, 'rev-parse', 'HEAD');
  git(primary, 'worktree', 'add', '-q', '-b', 'codex/' + id, checkout, base);
  const config = {
    schemaVersion: 1,
    task: id,
    writer: actor.writer,
    sessionId: actor.sessionId,
    collaborationMode: 'CODEX_ONLY',
    modeSource: 'Fixture user',
    commitAfterTask: choice,
    commitSource: 'Fixture user',
    baseCommit: base,
    writePaths: ['allowed.txt', 'new.txt', 'link', 'link/file.txt'],
    commands: ['node --test fixture.test.mjs'],
  };
  return {
    id,
    primary,
    checkout,
    base,
    config,
    binding: registerTask(checkout, config),
  };
}
const write = (
  f,
  paths = [
    {
      path: 'allowed.txt',
      contentBase64: Buffer.from('changed\n').toString('base64'),
    },
  ],
  who = actor,
) => writeTaskFiles(f.checkout, who, paths);
function review(f) {
  const candidate = inspectTask(f.checkout, actor),
    evidencePath = join(root, f.id + '-review.txt'),
    source = 'Fixture independent result';
  writeFileSync(evidencePath, 'APPROVED by reviewer: ' + candidate.digest);
  return {
    schemaVersion: 1,
    verdict: 'APPROVED',
    reviewer: 'reviewer',
    source,
    evidencePath,
    evidenceSha256: sha(readFileSync(evidencePath)),
    candidateDigest: candidate.digest,
  };
}
test('registration refuses primary/main, dirty/detached and duplicate task/worktree claims', () => {
  const f = fixture();
  assert.throws(() => registerTask(f.primary, f.config), /Primary/);
  assert.throws(
    () => registerTask(f.checkout, { ...f.config, task: 'other-task' }),
    /already claimed/,
  );
  const second = join(root, f.id + '-second');
  git(f.primary, 'worktree', 'add', '-q', '-b', 'codex/second', second, f.base);
  assert.throws(() => registerTask(second, f.config), /already claimed/);
  writeFileSync(join(second, 'new.txt'), 'dirty');
  assert.throws(
    () => registerTask(second, { ...f.config, task: 'dirty-task' }),
    /clean exact base/,
  );
  rmSync(join(second, 'new.txt'));
  git(second, 'checkout', '--detach', f.base);
  assert.throws(() =>
    registerTask(second, { ...f.config, task: 'detached-task' }),
  );
});
test('wrong writer/session, branch and exact HEAD are denied before mutation', () => {
  const f = fixture();
  assert.throws(
    () => write(f, undefined, { ...actor, writer: 'other' }),
    /attribution/,
  );
  assert.throws(
    () => write(f, undefined, { ...actor, sessionId: 'other' }),
    /attribution/,
  );
  git(f.checkout, 'switch', '-c', 'codex/wrong');
  assert.throws(() => write(f), /Branch or exact HEAD/);
  git(f.checkout, 'switch', f.binding.branch);
  git(f.checkout, 'commit', '--allow-empty', '-qm', 'unexpected');
  assert.throws(() => write(f), /Branch or exact HEAD/);
  assert.equal(readFileSync(join(f.checkout, 'allowed.txt'), 'utf8'), 'base\n');
});
test('all paths validated before effects; path escapes, private files and links denied', () => {
  const f = fixture();
  const first = {
    path: 'allowed.txt',
    contentBase64: Buffer.from('bad').toString('base64'),
  };
  for (const path of [
    '../escape.txt',
    'other.txt',
    '.env.local',
    'allowed.txt:stream',
    'a\\b.txt',
  ]) {
    assert.throws(() => write(f, [first, { path, contentBase64: '' }]));
    assert.equal(
      readFileSync(join(f.checkout, 'allowed.txt'), 'utf8'),
      'base\n',
    );
  }
  const outside = join(root, f.id + '-outside');
  mkdirSync(outside);
  symlinkSync(
    outside,
    join(f.checkout, 'link'),
    process.platform === 'win32' ? 'junction' : 'dir',
  );
  assert.throws(
    () => write(f, [first, { path: 'link/file.txt', contentBase64: '' }]),
    /Linked path/,
  );
  assert.equal(readFileSync(join(f.checkout, 'allowed.txt'), 'utf8'), 'base\n');
  assert.equal(existsSync(join(outside, 'file.txt')), false);
  rmSync(join(f.checkout, 'link'));
  linkSync(join(f.checkout, 'allowed.txt'), join(root, f.id + '-hardlink'));
  assert.throws(() => write(f), /hardlinked/);
});
test('inherited Git redirects and operation concurrency fail before writes', () => {
  const f = fixture();
  for (const key of [
    'GIT_DIR',
    'GIT_WORK_TREE',
    'GIT_INDEX_FILE',
    'GIT_CONFIG_GLOBAL',
    'GIT_CONFIG_SYSTEM',
    'GIT_CONFIG_COUNT',
  ])
    assert.throws(
      () => assertGitEnvironment({ [key]: 'fixture' }),
      /forbidden/,
    );
  const release = acquireLocks(
    taskStorage(f.binding).registry,
    ['operation-' + f.id],
    { writer: 'other' },
  );
  try {
    assert.throws(() => write(f), /held by another/);
    assert.equal(
      readFileSync(join(f.checkout, 'allowed.txt'), 'utf8'),
      'base\n',
    );
  } finally {
    release();
  }
});
test('NO and NOT_SELECTED refuse commit; actual pending choice can be recorded once', () => {
  for (const choice of ['NO', 'NOT_SELECTED']) {
    const f = fixture(choice);
    write(f);
    assert.throws(
      () => commitTask(f.checkout, actor, review(f), 'fixture change'),
      /not YES/,
    );
    assert.equal(git(f.checkout, 'rev-parse', 'HEAD'), f.base);
    assert.equal(git(f.checkout, 'diff', '--cached', '--name-only'), '');
    if (choice === 'NOT_SELECTED') {
      selectCommit(f.checkout, actor, {
        choice: 'YES',
        source: 'Fixture actual user reply',
      });
      assert.throws(
        () =>
          selectCommit(f.checkout, actor, {
            choice: 'NO',
            source: 'Replacement',
          }),
        /already selected/,
      );
    }
  }
});
test('missing, self, stale or changed evidence refuses staging/commit', () => {
  const f = fixture();
  write(f);
  assert.throws(() =>
    commitTask(f.checkout, actor, undefined, 'fixture change'),
  );
  const receipt = review(f);
  assert.throws(
    () =>
      commitTask(
        f.checkout,
        actor,
        { ...receipt, reviewer: actor.writer },
        'fixture change',
      ),
    /Independent/,
  );
  writeFileSync(receipt.evidencePath, 'tampered');
  assert.throws(
    () => commitTask(f.checkout, actor, receipt, 'fixture change'),
    /evidence bytes/,
  );
  const current = review(f);
  write(f, [
    {
      path: 'allowed.txt',
      contentBase64: Buffer.from('later').toString('base64'),
    },
  ]);
  assert.throws(
    () => commitTask(f.checkout, actor, current, 'fixture change'),
    /candidate changed/,
  );
  assert.equal(git(f.checkout, 'diff', '--cached', '--name-only'), '');
});
test('unrelated staged/untracked paths refuse writes and commit, preserving both', () => {
  const f = fixture();
  write(f);
  const receipt = review(f);
  writeFileSync(join(f.checkout, 'other.txt'), 'unrelated');
  git(f.checkout, 'add', 'other.txt');
  assert.throws(
    () => commitTask(f.checkout, actor, receipt, 'fixture change'),
    /outside allowlist/,
  );
  assert.throws(() => write(f), /outside allowlist/);
  assert.equal(
    readFileSync(join(f.checkout, 'other.txt'), 'utf8'),
    'unrelated',
  );
  assert.equal(git(f.checkout, 'diff', '--cached', '--name-only'), 'other.txt');
});
test('commit includes reviewed tracked/untracked bytes and deletions and is replay safe', () => {
  const f = fixture();
  write(f, [
    { path: 'new.txt', contentBase64: Buffer.from('new\n').toString('base64') },
  ]);
  rmSync(join(f.checkout, 'allowed.txt'));
  const receipt = review(f),
    result = commitTask(f.checkout, actor, receipt, 'fixture isolated change');
  assert.notEqual(result.commit, f.base);
  assert.equal(git(f.checkout, 'show', 'HEAD:new.txt'), 'new');
  assert.equal(git(f.checkout, 'status', '--porcelain'), '');
  assert.equal(
    commitTask(f.checkout, actor, receipt, 'fixture isolated change').commit,
    result.commit,
  );
  assert.throws(() => write(f), /complete/);
  assert.equal(git(f.primary, 'rev-parse', 'HEAD'), f.base);
});
test('uncertain successful commit is inspected and recovered without another commit', () => {
  const f = fixture();
  write(f);
  const receipt = review(f);
  git(f.checkout, 'add', 'allowed.txt');
  const loaded = readBinding(f.checkout);
  loaded.binding.status = 'COMMITTING';
  loaded.binding.pending = {
    tree: git(f.checkout, 'write-tree'),
    parent: f.base,
    candidateDigest: receipt.candidateDigest,
  };
  writeFileSync(loaded.path, JSON.stringify(loaded.binding));
  git(f.checkout, 'commit', '-qm', 'already executed');
  const executed = git(f.checkout, 'rev-parse', 'HEAD'),
    result = commitTask(f.checkout, actor, undefined, 'do not replay');
  assert.equal(result.commit, executed);
  assert.equal(result.recovered, true);
});
test('failed native commit is not blindly retried', () => {
  const f = fixture();
  write(f);
  const receipt = review(f),
    hooks = join(root, f.id + '-hooks');
  mkdirSync(hooks);
  writeFileSync(join(hooks, 'pre-commit'), '#!/bin/sh\nexit 1\n', {
    mode: 0o755,
  });
  git(f.checkout, 'config', 'core.hooksPath', hooks);
  assert.throws(() => commitTask(f.checkout, actor, receipt, 'blocked commit'));
  assert.equal(readBinding(f.checkout).binding.status, 'COMMITTING');
  assert.throws(
    () => commitTask(f.checkout, actor, receipt, 'blocked commit'),
    /did not advance HEAD/,
  );
  assert.equal(git(f.checkout, 'rev-parse', 'HEAD'), f.base);
});
test('Codex hook returns supported explicit denials and validates branch/patch/command scope', () => {
  const f = fixture();
  const input = {
    hook_event_name: 'PreToolUse',
    cwd: f.checkout,
    session_id: actor.sessionId,
    tool_name: 'apply_patch',
    tool_input: {
      command:
        '*** Begin Patch\n*** Update File: allowed.txt\n@@\n-base\n+changed\n*** End Patch',
    },
  };
  const decision = (input) =>
    codexHook(input).hookSpecificOutput.permissionDecision;
  assert.equal(decision(input), 'allow');
  assert.equal(
    decision({
      ...input,
      tool_input: {
        command:
          '*** Begin Patch\n*** Update File: ../escape.txt\n*** End Patch',
      },
    }),
    'deny',
  );
  assert.equal(
    decision({
      ...input,
      tool_name: 'Bash',
      tool_input: { command: 'git commit -am bypass' },
    }),
    'deny',
  );
  assert.equal(
    decision({
      ...input,
      tool_name: 'Bash',
      tool_input: { command: f.config.commands[0] },
    }),
    'allow',
  );
  assert.equal(
    decision({
      ...input,
      tool_name: 'Bash',
      tool_input: { command: f.config.commands[0], tty: true },
    }),
    'deny',
  );
  assert.equal(decision({ ...input, cwd: f.primary }), 'deny');
  assert.equal(decision(null), 'deny');
  git(f.checkout, 'switch', '-c', 'codex/wrong-hook');
  assert.equal(decision(input), 'deny');
  assert.equal(readFileSync(join(f.checkout, 'allowed.txt'), 'utf8'), 'base\n');
});

test('index-only unrelated staged path is denied before write or staging', () => {
  const f = fixture();
  write(f);
  const receipt = review(f);
  writeFileSync(join(f.checkout, 'other.txt'), 'index-only');
  git(f.checkout, 'add', 'other.txt');
  writeFileSync(join(f.checkout, 'other.txt'), 'other\n');
  const index = git(f.checkout, 'write-tree'),
    before = readFileSync(join(f.checkout, 'allowed.txt'));
  assert.throws(
    () =>
      write(f, [
        {
          path: 'allowed.txt',
          contentBase64: Buffer.from('must not write').toString('base64'),
        },
      ]),
    /outside allowlist/,
  );
  assert.throws(
    () => commitTask(f.checkout, actor, receipt, 'must not stage'),
    /outside allowlist/,
  );
  assert.equal(git(f.checkout, 'write-tree'), index);
  assert.deepEqual(readFileSync(join(f.checkout, 'allowed.txt')), before);
  assert.equal(git(f.checkout, 'rev-parse', 'HEAD'), f.base);
});
