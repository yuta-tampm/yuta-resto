// Disposable Git-fixture and fake-CLI tests for scripts/claude-task.mjs.
// Fixtures live in one owned temporary directory; no app database,
// environment file, credential or network access is used.

import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  realpathSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { after, describe, test } from 'node:test';
import { fileURLToPath } from 'node:url';

import {
  CREDENTIAL_READ_DENIALS,
  PROTECTED_EDIT_DENIALS,
  PROVIDER_OVERRIDE_VARIABLES,
  acquireLocks,
  buildClaudeArguments,
  buildHookCommand,
  cleanupTask,
  describeCommandProblem,
  describePathProblem,
  findDesktopRuntime,
  findLinkedSegment,
  hookMain,
  prepareTask,
  readTaskStatus,
  rejectProviderOverrides,
  resolveClaudeExecutable,
  runTask,
  sanitizeAuthStatus,
  snapshotCheckout,
  compareSnapshots,
  taskPaths,
  validateHandoff,
  writeGuard,
} from './claude-task.mjs';

const scriptsDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = dirname(scriptsDirectory);
const runnerPath = join(scriptsDirectory, 'claude-task.mjs');
const fixtureRoot = realpathSync.native(
  mkdtempSync(join(tmpdir(), 'claude-task-test-')),
);
after(() => rmSync(fixtureRoot, { recursive: true, force: true }));

const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const ROUTE_GROUP_PATH = 'src/(group) dir/page file.txt';

function git(cwd, ...args) {
  const result = spawnSync(
    'git',
    [
      '-c',
      'core.autocrlf=false',
      '-c',
      'user.name=Fixture',
      '-c',
      'user.email=fixture@example.invalid',
      '-c',
      'commit.gpgsign=false',
      ...args,
    ],
    { cwd, encoding: 'utf8', windowsHide: true },
  );
  if (result.status !== 0) {
    throw new Error(`git ${args.join(' ')} failed: ${result.stderr}`);
  }
  return result.stdout.trim();
}

function writeFiles(root, files) {
  for (const [path, content] of Object.entries(files)) {
    const target = join(root, ...path.split('/'));
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, content);
  }
}

let repositoryCounter = 0;
function createRepository({ ignoreExports = true } = {}) {
  repositoryCounter += 1;
  const root = join(fixtureRoot, `repo-${repositoryCounter}`);
  mkdirSync(root);
  git(root, 'init', '-q', '-b', 'main');
  writeFiles(root, {
    '.gitignore': `${ignoreExports ? '/exports/*\n' : ''}node_modules\n`,
    'src/allowed.txt': 'base\n',
    'src/other.txt': 'base\n',
    [ROUTE_GROUP_PATH]: 'base\n',
    'src/bound.txt': 'bound\n',
    'docs/plan.md': '# Plan\n',
    'scripts/check-format-preservation.mjs':
      "const preservedArtifacts = [\n  {\n    path: 'src/bound.txt',\n  },\n];\n",
  });
  git(root, 'add', '-A');
  git(root, 'commit', '-q', '-m', 'base');
  return { root, base: git(root, 'rev-parse', 'HEAD') };
}

function makeHandoff(base, overrides = {}) {
  return {
    schemaVersion: 1,
    id: 'fixture-task',
    task: 'Fixture task',
    change: 'NONE',
    phase: 'Service / Domain',
    goal: 'Exercise the runner',
    approvedReferences: [{ path: 'docs/plan.md', sha256: sha256('# Plan\n') }],
    technicalContract: 'Fixture contract',
    scope: 'Fixture scope',
    exclusions: ['No commit'],
    writeAllowlist: ['src/allowed.txt', ROUTE_GROUP_PATH],
    protectedPaths: ['docs/plan.md'],
    collaborationMode: 'CODEX_ONLY',
    modeSelectionSource: 'Fixture user selected CODEX_ONLY',
    commitAfterTask: 'YES',
    commitSelectionSource: 'Fixture user selected YES',
    actors: {
      orchestrator: 'Codex',
      implementationAuthor: 'Claude Code',
      integrationReviewer: 'Codex',
      independentReviewer: 'Fresh reviewer',
      commitExecutor: 'Codex',
    },
    checkout: { branch: 'claude/fixture-task', baseCommit: base },
    requiredReading: ['docs/plan.md'],
    requiredChecks: ['node --test fixture.test.mjs'],
    preparation: { installDependencies: false, effects: 'NONE' },
    authorizedCommands: [
      { command: 'node --test fixture.test.mjs', effects: 'Fixture only' },
    ],
    qa: {
      app: 'NONE',
      env: 'NONE',
      ports: [],
      database: 'NONE',
      testDataRights: 'NONE',
    },
    sharedResources: [],
    returnRequirements: ['Evidence'],
    limits: { timeoutMinutes: 5, maxTurns: 10 },
    ...overrides,
  };
}

function writeHandoff(handoff) {
  const path = join(
    fixtureRoot,
    `handoff-${repositoryCounter}-${handoff.id}.json`,
  );
  writeFileSync(path, `${JSON.stringify(handoff, null, 2)}\n`);
  return path;
}

function preparedTask(overrides = {}) {
  const repository = createRepository();
  const handoff = makeHandoff(repository.base, overrides);
  const state = prepareTask({
    handoffPath: writeHandoff(handoff),
    repositoryRoot: repository.root,
  });
  return {
    ...repository,
    handoff,
    state,
    paths: taskPaths(repository.root, handoff.id),
  };
}

function assertCode(code) {
  return (error) => {
    assert.equal(error.code, code, `${error.code}: ${error.message}`);
    return true;
  };
}

const fakeClaudePath = join(fixtureRoot, 'fake-claude.mjs');
writeFileSync(
  fakeClaudePath,
  `import { readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
const args = process.argv.slice(2);
const scenario = process.env.FAKE_CLAUDE_SCENARIO ?? 'success';
if (args[0] === '--version') {
  process.stdout.write('2.1.286 (Claude Code)\\n');
  process.exit(0);
}
if (args[0] === 'auth') {
  process.stdout.write(JSON.stringify({
    loggedIn: scenario !== 'logged-out',
    authMethod: scenario === 'api-key' ? 'api_key' : 'claude.ai',
    apiProvider: 'firstParty',
    email: 'person@example.invalid',
    orgId: 'org-fixture',
    subscriptionType: 'pro',
  }));
  process.exit(0);
}
readFileSync(0);
const tools = args[args.indexOf('--tools') + 1].split(',');
const emit = (event) => process.stdout.write(JSON.stringify(event) + '\\n');
emit({ type: 'system', subtype: 'init', session_id: 'fake-session', model: 'fake-model',
  permissionMode: 'dontAsk', tools: scenario === 'extra-tool' ? [...tools, 'Agent'] : tools,
  mcp_servers: [] });
if (scenario === 'hang') {
  setInterval(() => {}, 1000);
} else {
  if (scenario === 'edit-allowed') writeFileSync('src/(group) dir/page file.txt', 'changed\\n');
  if (scenario === 'edit-outside') writeFileSync('src/new outside.txt', 'outside\\n');
  if (scenario === 'stage-allowed') {
    writeFileSync('src/(group) dir/page file.txt', 'staged\\n');
    const staged = spawnSync('git', ['add', '--', 'src/(group) dir/page file.txt']);
    if (staged.status !== 0) throw new Error('Fixture staging failed');
  }
  if (scenario === 'unauthorized-bash') {
    emit({ type: 'assistant', message: { content: [{ type: 'tool_use', id: 't1', name: 'Bash',
      input: { command: 'curl https://example.invalid' } }] } });
    emit({ type: 'user', message: { content: [{ type: 'tool_result', tool_use_id: 't1',
      is_error: false, content: 'ok' }] } });
  }
  if (scenario !== 'no-result') {
    emit({ type: 'result', subtype: scenario === 'error' ? 'error_max_turns' : 'success',
      is_error: scenario === 'error', num_turns: 1, duration_ms: 5, result: 'done',
      session_id: 'fake-session', permission_denials: [] });
  }
}
`,
);

function fakeEnv(scenario) {
  const env = { ...process.env, FAKE_CLAUDE_SCENARIO: scenario };
  for (const name of PROVIDER_OVERRIDE_VARIABLES) delete env[name];
  return env;
}

function run(task, kind, scenario, extra = {}) {
  return runTask({
    repositoryRoot: task.root,
    id: task.handoff.id,
    kind,
    claude: fakeClaudePath,
    env: fakeEnv(scenario),
    ...extra,
  });
}

// ---------------------------------------------------------------------------

describe('handoff validation', () => {
  test('accepts a sourced handoff with route-group, bracket and spaced paths', () => {
    const handoff = validateHandoff(
      makeHandoff('a'.repeat(40), {
        writeAllowlist: [
          'apps/backoffice/src/app/(authenticated)/route/page.tsx',
          'apps/web/src/app/[slug]/page with space.tsx',
          'apps/web/.env.example',
        ],
      }),
    );
    assert.equal(handoff.writeAllowlist.length, 3);
  });

  test('the example handoff is a visible template and never executable', () => {
    const example = JSON.parse(
      readFileSync(
        join(scriptsDirectory, 'claude-task', 'example-handoff.json'),
        'utf8',
      ),
    );
    assert.throws(
      () => validateHandoff(example),
      (error) =>
        error.code === 'INVALID_HANDOFF' &&
        error.details.some((detail) => detail.includes('template placeholder')),
    );
    const filled = JSON.parse(JSON.stringify(example), (key, value) => {
      if (typeof value !== 'string' || !value.includes('REPLACE_WITH_'))
        return value;
      if (key === 'sha256') return 'c'.repeat(64);
      if (key === 'baseCommit') return 'd'.repeat(40);
      return value.replaceAll(/REPLACE_WITH_[A-Z0-9_]+/gu, 'example');
    });
    assert.equal(validateHandoff(filled).id, 'example-task');
  });

  test('rejects unsafe paths but not real repository filenames', () => {
    for (const path of [
      '../escape.txt',
      'src/../../escape.txt',
      '/absolute.txt',
      'C:/absolute.txt',
      '~/home.txt',
      'src\\windows.txt',
      'src/*.ts',
      'src/file?.ts',
      'src/{a,b}.ts',
      'src/file.txt:stream',
      'src/bell\u0007.txt',
      'src/./file.txt',
      'src//file.txt',
      'src/dir/',
      'src/con.txt',
      'src/trailing.',
      'src/ leading.txt',
      '.git/config',
      'packages/sub/.git/config',
    ]) {
      assert.notEqual(describePathProblem(path), null, path);
    }
    for (const path of [
      'apps/backoffice/src/app/(authenticated)/route/page.tsx',
      'apps/web/src/app/[locale]/(public)/contact/page.tsx',
      'docs/a file with spaces.md',
    ]) {
      assert.equal(describePathProblem(path), null, path);
    }
  });

  test('rejects protected areas, private env files and unsafe commands', () => {
    const base = 'a'.repeat(40);
    for (const writeAllowlist of [
      ['openspec/changes/x/tasks.md'],
      ['.agents/skills/x/SKILL.md'],
      ['docs/reviews/x.md'],
      ['apps/web/.env.local'],
      ['.env'],
    ]) {
      assert.throws(
        () => validateHandoff(makeHandoff(base, { writeAllowlist })),
        assertCode('INVALID_HANDOFF'),
        writeAllowlist[0],
      );
    }
    for (const command of [
      'pnpm test && curl x',
      'pnpm test | tee out',
      'git commit -m x',
      'git\tstatus',
      'git\tcommit -m task',
      'gh\tpr create',
      'GIT.EXE\u00a0-C . add file',
      'node scripts/check-proof.mjs\u0000',
      'git push',
      'git -C . add file',
      'git.exe -C . add file',
      'GIT -C . add file',
      'gh.exe pr create',
      'C:/tools/GIT.EXE -C . commit -m task',
      'git -C . commit -m task',
      'git --git-dir elsewhere push',
      'gh pr create',
      'pnpm install --frozen-lockfile',
      'node -e "x"',
      'pnpm  test',
    ]) {
      assert.notEqual(describeCommandProblem(command), null, command);
    }
    assert.equal(
      describeCommandProblem('pnpm exec prettier --write CLAUDE.md'),
      null,
    );
  });

  test('rejects unsourced choices, unauthorized checks and self-review', () => {
    const base = 'a'.repeat(40);
    const invalid = [
      { modeSelectionSource: 'NONE' },
      { commitSelectionSource: 'NONE' },
      { requiredChecks: ['pnpm docs:check'] },
      {
        actors: {
          orchestrator: 'Codex',
          implementationAuthor: 'Claude Code',
          integrationReviewer: 'Codex',
          independentReviewer: 'Claude Code',
          commitExecutor: 'Codex',
        },
      },
      {
        actors: {
          orchestrator: 'Codex',
          implementationAuthor: 'Claude Code',
          integrationReviewer: 'Codex',
          independentReviewer: 'Fresh reviewer',
          commitExecutor: 'Claude Code',
        },
      },
      {
        qa: {
          app: 'NONE',
          env: 'NONE',
          ports: [3187],
          database: 'NONE',
          testDataRights: 'NONE',
        },
      },
      { unexpected: true },
    ];
    for (const overrides of invalid) {
      assert.throws(
        () => validateHandoff(makeHandoff(base, overrides)),
        assertCode('INVALID_HANDOFF'),
        JSON.stringify(overrides),
      );
    }
  });
});

describe('Claude settings and guard hook', () => {
  const handoff = validateHandoff(makeHandoff('a'.repeat(40)));
  const guardSha = 'e'.repeat(64);

  test('worker settings use exact rules plus the guard hook and no bypass', () => {
    const hookCommand = buildHookCommand({
      guardPath: join(fixtureRoot, 'guard.json'),
      guardSha256: guardSha,
    });
    const args = buildClaudeArguments({ kind: 'worker', handoff, hookCommand });
    const settings = JSON.parse(args[args.indexOf('--settings') + 1]);
    assert.equal(
      args[args.indexOf('--tools') + 1],
      'Read,Grep,Glob,Edit,Write,Bash',
    );
    assert.ok(settings.permissions.allow.includes('Edit(./src/allowed.txt)'));
    assert.ok(
      !settings.permissions.allow.some((rule) => rule.includes('(group)')),
      'route-group paths are enforced by the hook, not rule syntax',
    );
    assert.ok(
      settings.permissions.allow.includes('Bash(node --test fixture.test.mjs)'),
    );
    assert.ok(
      !settings.permissions.allow.some((rule) => rule.startsWith('Edit(/')),
    );
    for (const rule of [
      ...CREDENTIAL_READ_DENIALS,
      ...PROTECTED_EDIT_DENIALS,
    ]) {
      assert.ok(settings.permissions.deny.includes(rule), rule);
    }
    assert.equal(settings.permissions.defaultMode, 'dontAsk');
    const hook = settings.hooks.PreToolUse[0];
    assert.equal(hook.matcher, '*');
    assert.ok(hook.hooks[0].command.includes(`--sha256 ${guardSha}`));
    assert.ok(!hook.hooks[0].command.includes('allowed.txt'));
    for (const forbidden of [
      'bypassPermissions',
      'acceptEdits',
      '--dangerously-skip-permissions',
      '--allow-dangerously-skip-permissions',
      '--bare',
    ]) {
      assert.ok(!args.includes(forbidden), forbidden);
    }
    assert.throws(
      () => buildClaudeArguments({ kind: 'worker', handoff }),
      assertCode('INVALID_GUARD'),
    );
  });

  test('reviewer has only Read/Grep/Glob, no hooks and no shell or write rights', () => {
    const args = buildClaudeArguments({
      kind: 'review',
      handoff,
      agentAvailable: true,
    });
    const settings = JSON.parse(args[args.indexOf('--settings') + 1]);
    assert.equal(args[args.indexOf('--tools') + 1], 'Read,Grep,Glob');
    assert.equal(args[args.indexOf('--agent') + 1], 'yuta-readonly-reviewer');
    assert.equal(settings.hooks, undefined);
    assert.equal(settings.disableAllHooks, true);
    for (const tool of ['Bash', 'Edit', 'Write', 'Agent', 'WebFetch']) {
      assert.ok(settings.permissions.deny.includes(tool), tool);
    }
    for (const flag of [
      '--strict-mcp-config',
      '--no-chrome',
      '--no-session-persistence',
    ]) {
      assert.ok(args.includes(flag), flag);
    }
  });

  test('hook command quotes only runner-owned paths and rejects unsafe ones', () => {
    assert.throws(
      () =>
        buildHookCommand({
          guardPath: join(fixtureRoot, 'a"b.json'),
          guardSha256: guardSha,
        }),
      assertCode('UNSAFE_PATH'),
    );
    assert.throws(
      () =>
        buildHookCommand({
          guardPath: join(fixtureRoot, 'g.json'),
          guardSha256: 'x',
        }),
      assertCode('INVALID_GUARD'),
    );
  });

  test('hook allows exact commands and paths, denies others and fails closed', () => {
    const checkout = join(fixtureRoot, 'hook-checkout');
    const repository = createRepository();
    git(
      repository.root,
      'worktree',
      'add',
      '-b',
      handoff.checkout.branch,
      checkout,
      repository.base,
    );
    const runDirectory = join(fixtureRoot, 'hook-run');
    mkdirSync(runDirectory);
    const guard = writeGuard({
      runDirectory,
      task: 'hook-task',
      checkout,
      handoff: {
        ...handoff,
        checkout: { ...handoff.checkout, baseCommit: repository.base },
      },
      protectedPaths: ['src/protected.txt', 'src/bound.txt'],
    });
    const hookArgs = ['--guard', guard.path, '--sha256', guard.sha256];
    const call = (toolName, toolInput) =>
      hookMain(
        hookArgs,
        JSON.stringify({
          hook_event_name: 'PreToolUse',
          tool_name: toolName,
          tool_input: toolInput,
        }),
      );
    const decision = (result) => {
      assert.equal(result.exitCode, 0, result.stderr);
      return result.stdout
        ? JSON.parse(result.stdout).hookSpecificOutput.permissionDecision
        : 'defer';
    };

    assert.equal(
      decision(call('Bash', { command: 'node --test fixture.test.mjs' })),
      'allow',
    );
    for (const command of [
      'node --test fixture.test.mjs ',
      'node --test fixture.test.mjs && curl x',
      'git status',
      'ls',
    ]) {
      assert.equal(decision(call('Bash', { command })), 'deny', command);
    }
    assert.equal(
      decision(
        call('Bash', {
          command: 'node --test fixture.test.mjs',
          run_in_background: true,
        }),
      ),
      'deny',
    );
    assert.equal(
      decision(
        call('Write', {
          file_path: join(checkout, 'src', '(group) dir', 'page file.txt'),
        }),
      ),
      'allow',
    );
    assert.equal(
      decision(call('Edit', { file_path: 'src/allowed.txt' })),
      'allow',
    );
    for (const filePath of [
      join(checkout, 'src', 'other.txt'),
      join(checkout, 'src', 'protected.txt'),
      join(checkout, '..', 'escape.txt'),
      `${join(checkout, 'src', 'allowed.txt')}:stream`,
      join(fixtureRoot, 'elsewhere.txt'),
    ]) {
      assert.equal(
        decision(call('Write', { file_path: filePath })),
        'deny',
        filePath,
      );
    }
    assert.equal(
      decision(call('Read', { file_path: join(checkout, 'src', 'other.txt') })),
      'defer',
    );
    assert.equal(
      decision(call('NotebookEdit', { notebook_path: 'x.ipynb' })),
      'deny',
    );
    assert.equal(decision(call('Agent', { prompt: 'x' })), 'deny');

    assert.equal(hookMain(hookArgs, 'not json').exitCode, 2);
    assert.equal(
      hookMain(hookArgs, JSON.stringify({ tool_name: 'Bash' })).exitCode,
      2,
    );
    assert.equal(
      hookMain(['--guard', guard.path, '--sha256', 'f'.repeat(64)], '{}')
        .exitCode,
      2,
    );
    assert.equal(hookMain([], '{}').exitCode, 2);

    git(checkout, 'switch', '-c', 'codex/wrong-hook-branch');
    assert.equal(call('Write', { file_path: 'src/allowed.txt' }).exitCode, 2);
    assert.equal(
      readFileSync(join(checkout, 'src/allowed.txt'), 'utf8'),
      'base\n',
    );
    git(checkout, 'switch', handoff.checkout.branch);

    const logged = readFileSync(guard.guard.decisionLog, 'utf8')
      .trim()
      .split('\n');
    assert.ok(logged.length >= 10);

    // The real CLI entry point honours the same contract through stdin.
    const viaCli = spawnSync(
      process.execPath,
      [runnerPath, 'hook', ...hookArgs],
      {
        input: JSON.stringify({
          hook_event_name: 'PreToolUse',
          tool_name: 'Bash',
          tool_input: { command: 'node --test fixture.test.mjs' },
        }),
        encoding: 'utf8',
      },
    );
    assert.equal(viaCli.status, 0, viaCli.stderr);
    assert.equal(
      JSON.parse(viaCli.stdout).hookSpecificOutput.permissionDecision,
      'allow',
    );
    const invalidCli = spawnSync(
      process.execPath,
      [runnerPath, 'hook', ...hookArgs],
      {
        input: '{',
        encoding: 'utf8',
      },
    );
    assert.equal(invalidCli.status, 2);
  });

  test('hook and prepare refuse writes through linked directories', () => {
    const checkout = join(fixtureRoot, 'link-checkout');
    const outside = join(fixtureRoot, 'link-outside');
    const repository = createRepository();
    git(
      repository.root,
      'worktree',
      'add',
      '-b',
      handoff.checkout.branch,
      checkout,
      repository.base,
    );
    mkdirSync(outside);
    symlinkSync(
      outside,
      join(checkout, 'linked'),
      process.platform === 'win32' ? 'junction' : 'dir',
    );
    assert.equal(findLinkedSegment(checkout, 'linked/file.txt'), 'linked');
    assert.equal(findLinkedSegment(checkout, 'plain/file.txt'), null);
    const runDirectory = join(fixtureRoot, 'link-run');
    mkdirSync(runDirectory);
    const guard = writeGuard({
      runDirectory,
      task: 'link-task',
      checkout,
      handoff: {
        checkout: {
          branch: handoff.checkout.branch,
          baseCommit: repository.base,
        },
        writeAllowlist: ['linked/file.txt'],
        authorizedCommands: [],
      },
      protectedPaths: [],
    });
    const result = hookMain(
      ['--guard', guard.path, '--sha256', guard.sha256],
      JSON.stringify({
        hook_event_name: 'PreToolUse',
        tool_name: 'Write',
        tool_input: { file_path: join(checkout, 'linked', 'file.txt') },
      }),
    );
    assert.equal(result.exitCode, 2);
    assert.equal(existsSync(join(outside, 'file.txt')), false);
  });

  const projectSettingsPath = join(repositoryRoot, '.claude', 'settings.json');
  test(
    'project settings deny the same credential reads and protected edits',
    {
      skip:
        !existsSync(projectSettingsPath) &&
        '.claude/settings.json is not present',
    },
    () => {
      const settings = JSON.parse(readFileSync(projectSettingsPath, 'utf8'));
      for (const rule of [
        ...CREDENTIAL_READ_DENIALS,
        ...PROTECTED_EDIT_DENIALS,
      ]) {
        assert.ok(settings.permissions.deny.includes(rule), rule);
      }
      assert.ok(settings.permissions.deny.includes('Read(//**/.env.*)'));
      assert.equal(settings.permissions.defaultMode, undefined);
    },
  );
});

describe('Claude runtime discovery and account status', () => {
  test('auth status keeps only sanitized subscription metadata', () => {
    const sanitized = sanitizeAuthStatus({
      loggedIn: true,
      authMethod: 'claude.ai',
      apiProvider: 'firstParty',
      subscriptionType: 'pro',
      email: 'person@example.invalid',
      orgId: 'org',
    });
    assert.deepEqual(Object.keys(sanitized).sort(), [
      'apiProvider',
      'authMethod',
      'loggedIn',
      'subscriptionType',
    ]);
    assert.throws(
      () => rejectProviderOverrides({ ANTHROPIC_API_KEY: 'set' }),
      assertCode('PROVIDER_OVERRIDE_REJECTED'),
    );
    rejectProviderOverrides({ ANTHROPIC_API_KEY: '' });
  });

  test('Desktop discovery is bounded to the versioned hash layout', () => {
    const packages = join(fixtureRoot, 'Packages');
    const runtime = (version, hash, packageName = 'Claude_abc123') => {
      const directory = join(
        packages,
        packageName,
        'LocalCache',
        'Roaming',
        'Claude',
        'claude-code',
        version,
        hash,
      );
      mkdirSync(directory, { recursive: true });
      writeFileSync(join(directory, 'claude.exe'), '');
      return join(directory, 'claude.exe');
    };
    assert.equal(findDesktopRuntime(packages), null);
    runtime('2.1.200', 'old');
    const newest = runtime('2.1.286', '635c18');
    runtime('9.9.9', 'other', 'NotClaude_abc');
    assert.equal(findDesktopRuntime(packages), newest);
    runtime('2.1.286', 'second');
    assert.throws(
      () => findDesktopRuntime(packages),
      assertCode('CLAUDE_AMBIGUOUS'),
    );
    assert.throws(
      () =>
        resolveClaudeExecutable({ override: join(fixtureRoot, 'missing.exe') }),
      assertCode('CLAUDE_NOT_FOUND'),
    );
  });
});

describe('prepare, run, review, status and cleanup with Git fixtures', () => {
  test('private reference inputs fail while public templates are supplied as snapshots', () => {
    const repository = createRepository();
    for (const privatePath of [
      '.env.staging',
      '.env.backup',
      '.private/secret.md',
      '.claude/settings.local.json',
    ]) {
      assert.throws(
        () =>
          validateHandoff(
            makeHandoff(repository.base, {
              approvedReferences: [
                { path: privatePath, sha256: 'a'.repeat(64) },
              ],
            }),
          ),
        assertCode('INVALID_HANDOFF'),
      );
    }
    writeFiles(repository.root, {
      '.env.example': 'PUBLIC_FIXTURE_URL=http://example.invalid\n',
    });
    const handoff = makeHandoff(repository.base, {
      approvedReferences: [
        {
          path: '.env.example',
          sha256: sha256('PUBLIC_FIXTURE_URL=http://example.invalid\n'),
        },
      ],
    });
    const state = prepareTask({
      repositoryRoot: repository.root,
      handoffPath: writeHandoff(handoff),
    });
    const paths = taskPaths(repository.root, state.id);
    assert.equal(
      readFileSync(
        join(paths.evidence, 'references', '01-.env.example'),
        'utf8',
      ),
      'PUBLIC_FIXTURE_URL=http://example.invalid\n',
    );
  });

  test('prepare refuses linked exports parents before any external mutation', () => {
    for (const linkedParent of ['exports', 'exports/claude-tasks']) {
      const repository = createRepository();
      const external = join(fixtureRoot, `external-${repositoryCounter}`);
      mkdirSync(external);
      const target = join(repository.root, linkedParent);
      mkdirSync(dirname(target), { recursive: true });
      symlinkSync(
        external,
        target,
        process.platform === 'win32' ? 'junction' : 'dir',
      );
      const handoff = makeHandoff(repository.base);
      assert.throws(
        () =>
          prepareTask({
            repositoryRoot: repository.root,
            handoffPath: writeHandoff(handoff),
          }),
        assertCode('UNSAFE_PATH'),
      );
      assert.deepEqual(readdirSync(external), []);
      assert.equal(
        git(repository.root, 'branch', '--list', handoff.checkout.branch),
        '',
      );
    }
  });

  test('staging state is attributed even when source bytes are unchanged', async () => {
    const task = preparedTask();
    writeFileSync(join(task.paths.checkout, 'src/allowed.txt'), 'pending\n');
    const before = snapshotCheckout(task.paths.checkout);
    git(task.paths.checkout, 'add', '--', 'src/allowed.txt');
    const after = snapshotCheckout(task.paths.checkout);
    assert.deepEqual(compareSnapshots(before, after), {
      headChanged: false,
      indexChanged: true,
      changed: [],
    });
    const receipt = await run(preparedTask(), 'worker', 'stage-allowed');
    assert.equal(receipt.outcome, 'SCOPE_VIOLATION');
    assert.ok(receipt.violations.some((item) => item.rule === 'INDEX_CHANGED'));
  });

  test('resource locks are shared across separate worktrees of one repository', () => {
    const repository = createRepository();
    const other = join(fixtureRoot, `linked-${repositoryCounter}`);
    git(
      repository.root,
      'worktree',
      'add',
      '-q',
      '-b',
      'codex/shared-lock-probe',
      other,
      repository.base,
    );
    const first = taskPaths(repository.root, 'first');
    const second = taskPaths(other, 'second');
    assert.equal(first.locks, second.locks);
    const release = acquireLocks(first.locks, ['port-3187'], { task: 'first' });
    try {
      assert.throws(
        () => acquireLocks(second.locks, ['port-3187'], { task: 'second' }),
        assertCode('RESOURCE_LOCKED'),
      );
    } finally {
      release();
    }
  });

  test('unfinished preparation cannot overlap execution or cleanup', async () => {
    const task = preparedTask();
    const state = JSON.parse(readFileSync(task.paths.state, 'utf8'));
    state.status = 'PREPARING';
    writeFileSync(task.paths.state, JSON.stringify(state));
    await assert.rejects(
      run(task, 'worker', 'success'),
      assertCode('TASK_NOT_RUNNABLE'),
    );
    assert.throws(
      () => cleanupTask({ repositoryRoot: task.root, id: task.handoff.id }),
      assertCode('TASK_ACTIVE'),
    );
    assert.ok(existsSync(task.paths.checkout));
  });

  test('prepare creates one clean owned worktree and freezes its handoff', () => {
    const task = preparedTask();
    assert.equal(task.state.status, 'PREPARED');
    assert.equal(git(task.paths.checkout, 'rev-parse', 'HEAD'), task.base);
    assert.equal(git(task.paths.checkout, 'status', '--porcelain'), '');
    assert.equal(
      readFileSync(
        join(task.paths.evidence, 'references', '01-plan.md'),
        'utf8',
      ),
      '# Plan\n',
    );
    assert.equal(task.state.dependencyInstall, 'NOT_AUTHORIZED');
    assert.equal(task.state.preservationBindings, 1);
    assert.throws(
      () =>
        prepareTask({
          handoffPath: writeHandoff(task.handoff),
          repositoryRoot: task.root,
        }),
      assertCode('BRANCH_EXISTS'),
    );
  });

  test('prepare refuses mismatched references, bound paths and unignored task roots', () => {
    const repository = createRepository();
    const mismatched = makeHandoff(repository.base, {
      approvedReferences: [{ path: 'docs/plan.md', sha256: 'f'.repeat(64) }],
    });
    assert.throws(
      () =>
        prepareTask({
          handoffPath: writeHandoff(mismatched),
          repositoryRoot: repository.root,
        }),
      assertCode('REFERENCE_MISMATCH'),
    );
    assert.ok(!existsSync(taskPaths(repository.root, mismatched.id).taskRoot));
    const bound = makeHandoff(repository.base, {
      writeAllowlist: ['src/bound.txt'],
    });
    assert.throws(
      () =>
        prepareTask({
          handoffPath: writeHandoff(bound),
          repositoryRoot: repository.root,
        }),
      assertCode('PROTECTED_WRITE_PATH'),
    );
    const unignored = createRepository({ ignoreExports: false });
    assert.throws(
      () =>
        prepareTask({
          handoffPath: writeHandoff(makeHandoff(unignored.base)),
          repositoryRoot: unignored.root,
        }),
      assertCode('TASKS_DIRECTORY_NOT_IGNORED'),
    );
  });

  test('worker run retains guard, diff and sanitized runtime evidence', async () => {
    const task = preparedTask();
    const receipt = await run(task, 'worker', 'edit-allowed');
    assert.equal(
      receipt.outcome,
      'SUCCEEDED',
      JSON.stringify(receipt.violations),
    );
    assert.deepEqual(
      receipt.candidate.files.map((file) => file.path),
      [ROUTE_GROUP_PATH],
    );
    assert.equal(receipt.candidate.files[0].sha256, sha256('changed\n'));
    const runDirectory = receipt.evidenceDirectory;
    assert.match(
      readFileSync(join(runDirectory, 'diff.patch'), 'utf8'),
      /\+changed/u,
    );
    assert.equal(
      sha256(readFileSync(join(runDirectory, 'guard.json'))),
      receipt.guard.sha256,
    );
    const runtime = readFileSync(join(runDirectory, 'runtime.json'), 'utf8');
    assert.ok(
      !runtime.includes('example.invalid') && !runtime.includes('org-fixture'),
    );
    assert.equal(JSON.parse(runtime).auth.subscriptionType, 'pro');
    assert.equal(receipt.session.id, 'fake-session');
    assert.ok(
      receipt.limitations.some((item) => item.includes('not an OS sandbox')),
    );
    assert.equal(
      readTaskStatus({ repositoryRoot: task.root, id: task.handoff.id }).locks
        .length,
      0,
    );
  });

  test('scope violations, missing results and timeouts are not successes', async () => {
    const outside = preparedTask();
    const outsideReceipt = await run(outside, 'worker', 'edit-outside');
    assert.equal(outsideReceipt.outcome, 'SCOPE_VIOLATION');
    assert.deepEqual(outsideReceipt.violations, [
      { rule: 'OUTSIDE_WRITE_ALLOWLIST', path: 'src/new outside.txt' },
    ]);
    assert.equal(
      outsideReceipt.candidate.newFiles[0].sha256,
      sha256('outside\n'),
    );
    assert.ok(
      existsSync(
        join(
          outsideReceipt.evidenceDirectory,
          'new-files',
          'src',
          'new outside.txt',
        ),
      ),
    );

    const bash = await run(preparedTask(), 'worker', 'unauthorized-bash');
    assert.deepEqual(
      bash.violations.map((violation) => violation.rule).sort(),
      ['GUARD_HOOK_NOT_OBSERVED', 'UNAUTHORIZED_COMMAND_EXECUTED'],
    );

    const tool = await run(preparedTask(), 'worker', 'extra-tool');
    assert.deepEqual(tool.violations, [
      { rule: 'UNEXPECTED_TOOL_POOL', tool: 'Agent' },
    ]);

    assert.equal(
      (await run(preparedTask(), 'worker', 'no-result')).outcome,
      'FAILED',
    );
    assert.equal(
      (await run(preparedTask(), 'worker', 'error')).outcome,
      'FAILED',
    );
    const timed = await run(preparedTask(), 'worker', 'hang', {
      timeoutMs: 1500,
    });
    assert.equal(timed.outcome, 'TIMED_OUT');

    await assert.rejects(
      run(preparedTask(), 'worker', 'api-key'),
      assertCode('API_KEY_AUTH_REJECTED'),
    );
    await assert.rejects(
      run(preparedTask(), 'worker', 'logged-out'),
      assertCode('AUTH_REQUIRED'),
    );
  });

  test('shared resource locks fail without removing another holder', async () => {
    const task = preparedTask({
      qa: {
        app: 'web',
        env: 'NONE',
        ports: [3187],
        database: 'NONE',
        testDataRights: 'NONE',
      },
    });
    const release = acquireLocks(task.paths.locks, ['port-3187'], {
      task: 'other-task',
    });
    try {
      await assert.rejects(
        run(task, 'worker', 'success'),
        assertCode('RESOURCE_LOCKED'),
      );
      assert.ok(existsSync(join(task.paths.locks, 'port-3187.lock')));
      assert.ok(!existsSync(join(task.paths.locks, 'task-fixture-task.lock')));
    } finally {
      release();
    }
    assert.equal((await run(task, 'worker', 'success')).outcome, 'SUCCEEDED');
  });

  test('candidate and handoff drift block dependent runs; review records drift', async () => {
    const task = preparedTask();
    assert.equal(
      (await run(task, 'worker', 'edit-allowed')).outcome,
      'SUCCEEDED',
    );
    writeFileSync(
      join(task.paths.checkout, 'src', 'allowed.txt'),
      'integrated\n',
    );
    await assert.rejects(
      run(task, 'worker', 'success'),
      assertCode('CANDIDATE_DRIFT'),
    );
    const review = await run(task, 'review', 'success');
    assert.equal(review.outcome, 'SUCCEEDED');
    assert.deepEqual(review.driftSincePreviousRun, ['src/allowed.txt']);
    assert.equal(review.guard, null);

    const reviewChange = preparedTask();
    const changed = await run(reviewChange, 'review', 'edit-allowed');
    assert.deepEqual(changed.violations, [
      { rule: 'REVIEW_CHANGED_FILES', path: ROUTE_GROUP_PATH },
    ]);

    const statePath = task.paths.state;
    const stateBefore = readFileSync(statePath);
    const status = readTaskStatus({
      repositoryRoot: task.root,
      id: task.handoff.id,
    });
    assert.equal(status.integrity, 'INTACT');
    assert.deepEqual(readFileSync(statePath), stateBefore);

    writeFileSync(join(task.paths.evidence, 'handoff.json'), '{}\n');
    assert.equal(
      readTaskStatus({ repositoryRoot: task.root, id: task.handoff.id })
        .integrity,
      'HANDOFF_DRIFT',
    );
  });

  test('cleanup refuses dirty or unknown ignored work and retains branch/evidence', async () => {
    const task = preparedTask();
    await run(task, 'worker', 'edit-allowed');
    const cleanup = () =>
      cleanupTask({ repositoryRoot: task.root, id: task.handoff.id });

    assert.throws(cleanup, assertCode('CHECKOUT_DIRTY'));
    assert.ok(existsSync(task.paths.checkout));

    const release = acquireLocks(task.paths.locks, ['task-fixture-task'], {
      task: 'fixture-task',
    });
    try {
      git(task.paths.checkout, 'add', '-A');
      git(
        task.paths.checkout,
        'commit',
        '-q',
        '-m',
        'integrated by orchestrator',
      );
      assert.throws(cleanup, assertCode('RESOURCE_LOCKED'));
    } finally {
      release();
    }

    writeFiles(task.paths.checkout, { 'exports/local-notes.txt': 'unknown\n' });
    assert.throws(cleanup, assertCode('UNKNOWN_IGNORED_FILES'));
    rmSync(join(task.paths.checkout, 'exports'), { recursive: true });

    writeFiles(task.paths.checkout, { 'node_modules/pkg/index.js': 'cache\n' });
    const state = cleanup();
    assert.equal(state.status, 'CLEANED');
    assert.ok(!existsSync(task.paths.checkout));
    assert.equal(
      git(task.root, 'branch', '--list', 'claude/fixture-task'),
      'claude/fixture-task',
    );
    assert.ok(
      existsSync(
        join(task.paths.evidence, 'runs', '001-worker', 'receipt.json'),
      ),
    );
    assert.throws(cleanup, assertCode('ALREADY_CLEANED'));
    await assert.rejects(
      run(task, 'worker', 'success'),
      assertCode('TASK_NOT_RUNNABLE'),
    );
  });
});
