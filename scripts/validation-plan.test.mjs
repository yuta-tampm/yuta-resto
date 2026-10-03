import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { after, test } from 'node:test';
import {
  classifyPaths,
  fullPlan,
  planCi,
  planGit,
  toolingTestPaths,
} from './validation-plan.mjs';

const fixtures = [];
const sourceRoot = fileURLToPath(new URL('../', import.meta.url));
const git = (root, args) =>
  execFileSync('git', ['-c', 'core.autocrlf=false', ...args], {
    cwd: root,
    encoding: 'utf8',
  }).trim();
function fixture() {
  const root = mkdtempSync(join(tmpdir(), 'yuta-validation-'));
  fixtures.push(root);
  git(root, ['init', '--quiet', '--initial-branch=main']);
  git(root, ['config', 'user.email', 'fixture@example.invalid']);
  git(root, ['config', 'user.name', 'Validation fixture']);
  write(root, 'README.md', 'baseline\n');
  git(root, ['add', '.']);
  git(root, ['commit', '--quiet', '-m', 'fixture']);
  return { root, base: git(root, ['rev-parse', 'HEAD']) };
}
function write(root, path, content = 'fixture\n') {
  mkdirSync(join(root, path, '..'), { recursive: true });
  writeFileSync(join(root, path), content);
}
after(() => {
  for (const root of fixtures) {
    assert.ok(
      resolve(root).startsWith(resolve(join(tmpdir(), 'yuta-validation-'))),
    );
    rmSync(root, { recursive: true, force: true });
  }
});

test('docs-only changes keep baseline guards without runtime flags', () => {
  const plan = classifyPaths([
    'AGENTS.md',
    'docs/architecture/AI_AND_STORAGE.md',
    'openspec/specs/x/spec.md',
    'docs/reviews/qa.png',
  ]);
  for (const key of [
    'full',
    'typecheck',
    'topology',
    'cloudTests',
    'cloudBuilds',
    'localTests',
    'uiTests',
  ])
    assert.equal(plan[key], false, key);
  assert.deepEqual(plan.toolingTests, []);
});

test('cloud/local owners require distinct family checks and global typecheck', () => {
  for (const path of [
    'apps/backoffice/src/server/x.ts',
    'apps/feedback-web/src/app/page.tsx',
    'packages/db-cloud/src/repository.ts',
    'packages/booking/src/index.ts',
  ]) {
    const plan = classifyPaths([path]);
    assert.equal(plan.cloudTests, true);
    assert.equal(plan.cloudBuilds, true);
    assert.equal(plan.localTests, false);
    assert.equal(plan.typecheck, true);
  }
  for (const path of [
    'apps/yuta-pos/src/app/page.tsx',
    'apps/site-agent/src/server.ts',
    'apps/yuta-display/src/db/schema.ts',
    'packages/db-pos/src/schema.ts',
  ]) {
    const plan = classifyPaths([path]);
    assert.equal(plan.localTests, true);
    assert.equal(plan.cloudTests, false);
    assert.equal(plan.typecheck, true);
  }
});

test('all shared owners cover both consumers and the existing UI suite', () => {
  for (const name of ['auth', 'contracts', 'core', 'tenant', 'ui']) {
    const plan = classifyPaths([`packages/${name}/src/index.ts`]);
    for (const key of [
      'typecheck',
      'cloudTests',
      'cloudBuilds',
      'localTests',
      'uiTests',
    ])
      assert.equal(plan[key], true, `${name}:${key}`);
  }
});

test('unknown/global/config/dependency/planner changes fail closed to full', () => {
  for (const path of [
    'new-directory/code.ts',
    'pnpm-lock.yaml',
    'package.json',
    '.github/workflows/ci.yml',
    'scripts/validation-plan.mjs',
    'scripts/generate-next-types.mjs',
    'apps/backoffice/package.json',
    'apps/yuta-pos/tsconfig.json',
    'packages/contracts/new.config.mjs',
    '.prettierignore',
    'docs/code.mjs',
    'apps/future/src/index.ts',
    '.agents/skills/x/script.mjs',
  ]) {
    assert.equal(classifyPaths([path]).full, true, path);
  }
  for (const paths of [
    null,
    ['../README.md'],
    ['/README.md'],
    ['a\\b'],
    ['a\nb'],
    ['a//b'],
  ])
    assert.equal(classifyPaths(paths).full, true);
});

test('tooling dependencies are retained; the full runner avoids repeating planner tests', () => {
  const plan = classifyPaths(['scripts/task-checkout.mjs']);
  assert.deepEqual(plan.toolingTests, [
    'scripts/claude-task.test.mjs',
    'scripts/task-guard.test.mjs',
  ]);
  assert.equal(plan.typecheck, false);
  const all = toolingTestPaths(sourceRoot, ['ALL']);
  assert.ok(all.includes('scripts/next-generated-types-bootstrap.test.mjs'));
  assert.ok(!all.includes('scripts/format-policy/check.test.mjs'));
  const withOwner = toolingTestPaths(sourceRoot, [
    'ALL',
    'scripts/format-policy/check.test.mjs',
  ]);
  assert.equal(
    withOwner.filter((path) => path === 'scripts/format-policy/check.test.mjs')
      .length,
    1,
  );
  assert.ok(all.includes('scripts/engineering-skills/acceptance.test.mjs'));
  assert.ok(!all.includes('scripts/validation-plan.test.mjs'));
  for (const key of [
    'typecheck',
    'topology',
    'cloudTests',
    'cloudBuilds',
    'localTests',
    'uiTests',
  ])
    assert.equal(fullPlan('fixture')[key], true);
});

test('local input retains staged paths hidden by a worktree restoration and untracked runtime paths', () => {
  const { root, base } = fixture();
  write(root, 'apps/backoffice/src/x.ts');
  git(root, ['add', '.']);
  rmSync(join(root, 'apps/backoffice/src/x.ts'));
  write(root, 'apps/site-agent/src/new.ts');
  const plan = planGit({ root, base });
  assert.equal(plan.cloudTests, true);
  assert.equal(plan.localTests, true);
  assert.ok(plan.paths.includes('apps/backoffice/src/x.ts'));
  assert.ok(plan.paths.includes('apps/site-agent/src/new.ts'));
});

test('renames retain deleted runtime ownership even when destination is documentation', () => {
  const { root } = fixture();
  write(root, 'apps/backoffice/src/x.ts');
  git(root, ['add', '.']);
  git(root, ['commit', '--quiet', '-m', 'runtime']);
  const base = git(root, ['rev-parse', 'HEAD']);
  mkdirSync(join(root, 'docs'), { recursive: true });
  git(root, ['mv', 'apps/backoffice/src/x.ts', 'docs/x.md']);
  const plan = planGit({ root, base });
  assert.equal(plan.cloudTests, true);
  assert.ok(plan.paths.includes('apps/backoffice/src/x.ts'));
  assert.ok(plan.paths.includes('docs/x.md'));
});

test('missing commit, mismatched checkout, subdirectory and inherited Git redirect select full', () => {
  const { root, base } = fixture();
  assert.equal(planGit({ root, base: 'f'.repeat(40) }).full, true);
  write(root, 'README.md', 'changed\n');
  git(root, ['add', '.']);
  git(root, ['commit', '--quiet', '-m', 'doc']);
  assert.equal(planGit({ root, base, head: base }).full, true);
  mkdirSync(join(root, 'docs'), { recursive: true });
  assert.equal(planGit({ root: join(root, 'docs'), base }).full, true);
  const saved = process.env.GIT_INDEX_FILE;
  process.env.GIT_INDEX_FILE = join(root, 'foreign-index');
  try {
    assert.equal(planGit({ root, base }).full, true);
  } finally {
    if (saved === undefined) delete process.env.GIT_INDEX_FILE;
    else process.env.GIT_INDEX_FILE = saved;
  }
});

test('CI selects the exact synthetic merge tree and validates event parents', () => {
  const { root, base: original } = fixture();
  git(root, ['checkout', '--quiet', '-b', 'feature']);
  write(root, 'docs/proposal.md');
  git(root, ['add', '.']);
  git(root, ['commit', '--quiet', '-m', 'doc']);
  const prHead = git(root, ['rev-parse', 'HEAD']);
  git(root, ['checkout', '--quiet', 'main']);
  write(root, 'docs/base.md');
  git(root, ['add', '.']);
  git(root, ['commit', '--quiet', '-m', 'base advance']);
  const base = git(root, ['rev-parse', 'HEAD']);
  git(root, [
    'merge',
    '--quiet',
    '--no-ff',
    'feature',
    '-m',
    'synthetic merge',
  ]);
  const merged = git(root, ['rev-parse', 'HEAD']);
  const eventPath = join(tmpdir(), `yuta-validation-event-${process.pid}.json`);
  // Event data is outside the repository candidate; cleanup targets this exact owned file.
  writeFileSync(
    eventPath,
    JSON.stringify({
      pull_request: { base: { sha: base }, head: { sha: prHead } },
    }),
  );
  try {
    const env = {
      GITHUB_EVENT_NAME: 'pull_request',
      GITHUB_SHA: merged,
      GITHUB_EVENT_PATH: eventPath,
    };
    const plan = planCi(root, env);
    assert.equal(plan.full, false);
    assert.equal(plan.testedHead, merged);
    assert.deepEqual(plan.paths, ['docs/proposal.md']);
    assert.equal(planCi(root, { ...env, GITHUB_SHA: prHead }).full, true);
    writeFileSync(
      eventPath,
      JSON.stringify({
        pull_request: { base: { sha: original }, head: { sha: prHead } },
      }),
    );
    assert.equal(planCi(root, env).full, true);
    assert.equal(
      planCi(root, { GITHUB_EVENT_NAME: 'push', GITHUB_SHA: merged }).full,
      true,
    );
    assert.equal(
      planCi(root, { GITHUB_EVENT_NAME: 'pull_request' }).full,
      true,
    );
  } finally {
    rmSync(eventPath);
  }
});

test('unavailable selected tooling test selects full', () => {
  const { root, base } = fixture();
  write(root, 'scripts/task-guard.mjs');
  assert.equal(planGit({ root, base }).full, true);
});

test('CI retains required names, prerequisite denial, exact checkout and conditional checks', () => {
  const workflow = readFileSync(
    join(sourceRoot, '.github/workflows/ci.yml'),
    'utf8',
  );
  assert.match(workflow, /push:\s*branches:\s*- main/u);
  assert.match(
    workflow,
    /group:.*github\.event\.pull_request\.number.*github\.run_id/u,
  );
  assert.match(
    workflow,
    /cancel-in-progress:.*github\.event_name == 'pull_request'/u,
  );
  assert.ok(!workflow.includes('paths-ignore:'));
  assert.ok(
    workflow.includes('pnpm typegen:next && pnpm -r --if-present typecheck'),
  );
  assert.ok(workflow.includes('pnpm --filter @yuta/ui test'));
  assert.ok(workflow.includes('node scripts/validation-plan.mjs --ci'));
  assert.ok(workflow.includes('pnpm test:validation-plan'));
  const flags = {
    'cloud-tests': 'cloudTests',
    'cloud-builds': 'cloudBuilds',
    'local-tests': 'localTests',
  };
  for (const [job, flag] of Object.entries(flags)) {
    const section = workflow
      .split(`  ${job}:\n`)[1]
      ?.split(/\n  [a-z-]+:\n/u)[0];
    assert.ok(section, job);
    assert.match(section, /needs: architecture-and-typecheck/u);
    assert.match(section, /if:.*always\(\).*!cancelled\(\)/u);
    assert.match(
      section,
      /PREREQUISITE_RESULT.*needs\.architecture-and-typecheck\.result/u,
    );
    assert.ok(section.includes('test "$PREREQUISITE_RESULT" = success'));
    assert.ok(section.includes('case "$SELECTED" in true|false)'));
    assert.ok(section.includes(`outputs.${flag}`));
    assert.ok(section.includes('ref: ${{ github.sha }}'));
  }
  assert.equal(workflow.match(/ref: \$\{\{ github\.sha \}\}/gu)?.length, 4);
});

test('tooling CLI executes only selected tests, discovers nested ALL once, and propagates failures', () => {
  const { root } = fixture();
  const cli = join(sourceRoot, 'scripts/validation-plan.mjs');
  write(
    root,
    'scripts/one.test.mjs',
    "import test from 'node:test'; test('ONLY_ONE', () => {});\n",
  );
  write(
    root,
    'scripts/nested/two.test.mjs',
    "import test from 'node:test'; test('NESTED_TWO', () => {});\n",
  );
  write(
    root,
    'scripts/validation-plan.test.mjs',
    "throw new Error('Planner regression must not be repeated by ALL');\n",
  );
  // Model a normal CI CLI, not an inherited Node test-runner child context.
  const env = { ...process.env };
  delete env.NODE_TEST_CONTEXT;
  const run = (selection) =>
    spawnSync(
      process.execPath,
      [cli, '--run-tooling', JSON.stringify(selection)],
      { cwd: root, encoding: 'utf8', timeout: 15000, env },
    );
  const selected = run(['scripts/one.test.mjs']);
  assert.equal(selected.status, 0, selected.stderr);
  assert.match(selected.stdout, /ONLY_ONE/u);
  assert.doesNotMatch(selected.stdout, /NESTED_TWO/u);
  const empty = run([]);
  assert.equal(empty.status, 0, empty.stderr);
  assert.equal(empty.stdout, '');
  const all = run(['ALL']);
  assert.equal(all.status, 0, all.stderr);
  assert.match(all.stdout, /ONLY_ONE/u);
  assert.match(all.stdout, /NESTED_TWO/u);
  write(
    root,
    'scripts/fail.test.mjs',
    "import test from 'node:test'; test('failure propagates', () => { throw new Error('owned fixture failure'); });\n",
  );
  assert.notEqual(run(['scripts/fail.test.mjs']).status, 0);
  assert.notEqual(run(['../foreign.test.mjs']).status, 0);
  assert.notEqual(
    spawnSync(process.execPath, [cli, '--run-tooling', 'not-json'], {
      cwd: root,
      encoding: 'utf8',
      timeout: 15000,
    }).status,
    0,
  );
});

test('dedicated formatting inputs require their owner suite despite docs or full classification', () => {
  for (const path of [
    '.prettierignore',
    '.prettierrc.json',
    'pnpm-lock.yaml',
    'pnpm-workspace.yaml',
    '.npmrc',
    'scripts/check-format-preservation.mjs',
    'scripts/format-policy/check.mjs',
    'apps/backoffice/scripts/generate-personnel-contract-evaluation-corpus.py',
    'apps/backoffice/test/fixtures/personnel-contract-evaluation/v1/manifest.json',
    'openspec/changes/repository-format-policy-and-baseline-remediation/tasks.md',
    'docs/reviews/repository-format-policy-and-baseline-remediation/02b-design-review.md',
    '.agents/skills/openspec-apply-change/SKILL.md',
  ]) {
    const plan = classifyPaths(['package.json', path]);
    assert.equal(plan.full, true, path);
    assert.deepEqual(
      plan.toolingTests,
      ['ALL', 'scripts/format-policy/check.test.mjs'],
      path,
    );
  }
});

test('formatting dependency changes retain owner validation while root script-only edits do not', () => {
  const { root } = fixture();
  const manifest = {
    packageManager: 'pnpm@11.8.0',
    devDependencies: { prettier: '3.8.4' },
    scripts: { test: 'old' },
  };
  write(root, 'package.json', JSON.stringify(manifest));
  git(root, ['add', '.']);
  git(root, ['commit', '--quiet', '-m', 'manifest']);
  const base = git(root, ['rev-parse', 'HEAD']);
  write(
    root,
    'package.json',
    JSON.stringify({ ...manifest, scripts: { test: 'new' } }),
  );
  assert.ok(
    !planGit({ root, base }).toolingTests.includes(
      'scripts/format-policy/check.test.mjs',
    ),
  );
  for (const script of ['format', 'format:check']) {
    write(
      root,
      'package.json',
      JSON.stringify({
        ...manifest,
        scripts: { ...manifest.scripts, [script]: 'changed formatting route' },
      }),
    );
    assert.deepEqual(planGit({ root, base }).toolingTests, [
      'ALL',
      'scripts/format-policy/check.test.mjs',
    ]);
  }
  write(
    root,
    'package.json',
    JSON.stringify({ ...manifest, devDependencies: { prettier: 'different' } }),
  );
  git(root, ['add', 'package.json']);
  write(root, 'package.json', JSON.stringify(manifest));
  const required = planGit({ root, base });
  assert.deepEqual(required.toolingTests, [
    'ALL',
    'scripts/format-policy/check.test.mjs',
  ]);
  assert.match(required.reasons.join(' '), /unavailable/u);
});

test('CI formatting route and toolchain changes require owner checks while selection-only edits do not', () => {
  const { root } = fixture();
  const path = '.github/workflows/ci.yml';
  const workflow =
    'env:\n  NODE_VERSION: 24.17.0\n  PNPM_VERSION: 11.8.0\njobs:\n  baseline:\n    steps:\n      - run: pnpm format:check\n';
  write(root, path, workflow);
  git(root, ['add', '.']);
  git(root, ['commit', '--quiet', '-m', 'CI route']);
  const base = git(root, ['rev-parse', 'HEAD']);
  write(root, path, workflow + '      - run: pnpm test:validation-plan\n');
  assert.ok(
    !planGit({ root, base }).toolingTests.includes(
      'scripts/format-policy/check.test.mjs',
    ),
  );
  for (const changed of [
    workflow.replace('pnpm format:check', 'echo skipped'),
    workflow.replace('24.17.0', 'different'),
    workflow.replace('11.8.0', 'different'),
  ]) {
    write(root, path, changed);
    assert.deepEqual(planGit({ root, base }).toolingTests, [
      'ALL',
      'scripts/format-policy/check.test.mjs',
    ]);
  }
});

test('generic tooling reports a separate owner lane and explicit owner failure is enforced', () => {
  const { root } = fixture();
  const cli = join(sourceRoot, 'scripts/validation-plan.mjs');
  write(
    root,
    'scripts/portable.test.mjs',
    "import test from 'node:test'; test('portable baseline', () => {});\n",
  );
  write(
    root,
    'scripts/format-policy/check.test.mjs',
    "throw new Error('owner prerequisites unavailable');\n",
  );
  const env = { ...process.env };
  delete env.NODE_TEST_CONTEXT;
  const summary = join(root, 'summary.txt');
  const run = (selection) =>
    spawnSync(
      process.execPath,
      [cli, '--run-tooling', JSON.stringify(selection)],
      {
        cwd: root,
        encoding: 'utf8',
        timeout: 15000,
        env: { ...env, GITHUB_STEP_SUMMARY: summary },
      },
    );
  const generic = run(['ALL']);
  assert.equal(generic.status, 0, generic.stderr);
  assert.match(generic.stdout, /NOT_RUN by generic tooling/u);
  assert.match(
    readFileSync(summary, 'utf8'),
    /approved owner validation remains separate/u,
  );
  assert.notEqual(
    run(['ALL', 'scripts/format-policy/check.test.mjs']).status,
    0,
  );
  assert.notEqual(run(['scripts/format-policy/check.test.mjs']).status, 0);
});
