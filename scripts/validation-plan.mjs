// Conservative check selection. Unknown inputs always retain the full baseline.
import { execFileSync } from 'node:child_process';
import { appendFileSync, existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

const gitRedirects = [
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
];
const shaPattern = /^[a-f0-9]{40}$/u;
const rootDocs = new Set([
  'AGENTS.md',
  'CLAUDE.md',
  'README.md',
  '.github/pull_request_template.md',
]);
const cloud = new Set([
  'apps/web',
  'apps/backoffice',
  'apps/booking-web',
  'apps/feedback-web',
  'packages/db-cloud',
  'packages/booking',
]);
const local = new Set([
  'apps/site-agent',
  'apps/yuta-pos',
  'apps/yuta-display',
  'packages/db-pos',
]);
const shared = new Set([
  'packages/auth',
  'packages/contracts',
  'packages/core',
  'packages/tenant',
  'packages/ui',
]);
const tooling = new Map([
  [
    'scripts/claude-task.mjs',
    ['scripts/claude-task.test.mjs', 'scripts/task-guard.test.mjs'],
  ],
  ['scripts/claude-task.test.mjs', ['scripts/claude-task.test.mjs']],
  [
    'scripts/task-checkout.mjs',
    ['scripts/claude-task.test.mjs', 'scripts/task-guard.test.mjs'],
  ],
  ['scripts/task-guard.mjs', ['scripts/task-guard.test.mjs']],
  ['scripts/task-guard.test.mjs', ['scripts/task-guard.test.mjs']],
  ['scripts/ui-pack-tooling.mjs', ['scripts/ui-pack-tooling.test.mjs']],
  ['scripts/ui-pack-tooling.test.mjs', ['scripts/ui-pack-tooling.test.mjs']],
  ['scripts/create-ui-pack.mjs', ['scripts/ui-pack-tooling.test.mjs']],
  ['scripts/check-ui-pack.mjs', ['scripts/ui-pack-tooling.test.mjs']],
]);

// This owner lane binds external generator sources, approval bytes and a renderer image.
// It is not an environment-independent repository CI suite.
const formatOwnerTest = 'scripts/format-policy/check.test.mjs';
const formatOwnerNote =
  formatOwnerTest +
  ': NOT_RUN by generic tooling; approved owner validation remains separate.';
function formatOwnerInput(path) {
  return (
    [
      '.prettierignore',
      '.prettierrc.json',
      'pnpm-lock.yaml',
      'pnpm-workspace.yaml',
      '.npmrc',
      'scripts/check-format-preservation.mjs',
      'apps/backoffice/scripts/generate-personnel-contract-evaluation-corpus.py',
    ].includes(path) ||
    path.startsWith('scripts/format-policy/') ||
    path.startsWith(
      'apps/backoffice/test/fixtures/personnel-contract-evaluation/',
    ) ||
    path.startsWith(
      'openspec/changes/repository-format-policy-and-baseline-remediation/',
    ) ||
    path.startsWith(
      'docs/reviews/repository-format-policy-and-baseline-remediation/',
    ) ||
    /^\.agents\/skills\/openspec-[^/]+\//u.test(path)
  );
}

export function fullPlan(reason) {
  return {
    schemaVersion: 1,
    full: true,
    typecheck: true,
    topology: true,
    cloudTests: true,
    cloudBuilds: true,
    localTests: true,
    uiTests: true,
    toolingTests: ['ALL'],
    paths: [],
    reasons: [reason],
  };
}

function safePath(path) {
  return (
    typeof path === 'string' &&
    path.length > 0 &&
    !path.includes('\\') &&
    !path.includes('\n') &&
    !path.includes('\r') &&
    !path.includes('\0') &&
    !path.split('/').some((part) => ['', '.', '..'].includes(part)) &&
    !path.startsWith('/') &&
    !/^[A-Za-z]:/u.test(path)
  );
}

export function classifyPaths(paths) {
  if (!Array.isArray(paths) || paths.some((path) => !safePath(path)))
    return fullPlan('Invalid changed-path input');
  const selected = {
    schemaVersion: 1,
    full: false,
    typecheck: false,
    topology: false,
    cloudTests: false,
    cloudBuilds: false,
    localTests: false,
    uiTests: false,
    toolingTests: [],
    paths: [...new Set(paths)].sort(),
    reasons: [],
  };
  if (selected.paths.some(formatOwnerInput))
    return {
      ...fullPlan(
        'Dedicated formatting owner inputs changed; its full suite is required',
      ),
      toolingTests: ['ALL', formatOwnerTest],
      paths: selected.paths,
    };
  const tests = new Set();
  for (const path of selected.paths) {
    const owner = path.split('/').slice(0, 2).join('/');
    if (
      rootDocs.has(path) ||
      (/^(docs|openspec)\//u.test(path) &&
        /\.(md|png|jpg|jpeg|webp|gif|pdf|svg)$/u.test(path))
    ) {
      selected.reasons.push(`Documentation: ${path}`);
    } else if (tooling.has(path)) {
      for (const test of tooling.get(path)) tests.add(test);
      selected.reasons.push(`Bounded tooling: ${path}`);
    } else if (cloud.has(owner) || local.has(owner) || shared.has(owner)) {
      // Manifests/config can alter dependencies, scripts and the selection assumptions.
      if (
        /(^|\/)(package\.json|[^/]*config[^/]*|[^/]*\.ya?ml|\.env[^/]*)$/u.test(
          path,
        )
      ) {
        return {
          ...fullPlan(`Runtime configuration: ${path}`),
          paths: selected.paths,
        };
      }
      selected.typecheck = true;
      if (cloud.has(owner) || shared.has(owner)) {
        selected.cloudTests = true;
        selected.cloudBuilds = true;
      }
      if (local.has(owner) || shared.has(owner)) selected.localTests = true;
      if (shared.has(owner)) selected.uiTests = true;
      selected.reasons.push(`Runtime owner: ${owner}`);
    } else {
      return {
        ...fullPlan(`Unclassified or global path: ${path}`),
        paths: selected.paths,
      };
    }
  }
  selected.toolingTests = [...tests].sort();
  if (!selected.paths.length)
    selected.reasons.push('No changed paths; baseline guards still run');
  return selected;
}

const git = (root, args) =>
  execFileSync('git', ['-c', 'core.autocrlf=false', ...args], {
    cwd: root,
    encoding: 'utf8',
    maxBuffer: 32 * 1024 * 1024,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
const splitPaths = (output) => output.split('\0').filter(Boolean);
const ensureCommit = (root, sha) => {
  if (!shaPattern.test(sha ?? ''))
    throw new Error('Missing or invalid exact commit SHA');
  if (git(root, ['rev-parse', '--verify', `${sha}^{commit}`]).trim() !== sha)
    throw new Error('Commit not available');
};

export function planGit({
  root,
  base,
  head,
  forceFull = false,
  expectedParents,
}) {
  try {
    if (gitRedirects.some((key) => process.env[key] !== undefined))
      throw new Error('Inherited Git override');
    const actualRoot = git(root, ['rev-parse', '--show-toplevel']).trim();
    if (resolve(actualRoot).toLowerCase() !== resolve(root).toLowerCase())
      throw new Error('Not the checkout root');
    const actualHead = git(root, ['rev-parse', 'HEAD']).trim();
    ensureCommit(root, actualHead);
    if (head !== undefined) {
      ensureCommit(root, head);
      if (head !== actualHead)
        throw new Error('Checkout does not match tested commit');
    }
    if (forceFull)
      return {
        ...fullPlan('Full baseline requested'),
        testedHead: actualHead,
        base: base ?? null,
      };
    ensureCommit(root, base);
    if (expectedParents) {
      for (const parent of expectedParents) ensureCommit(root, parent);
      const parents = git(root, ['cat-file', '-p', actualHead])
        .split('\n')
        .filter((line) => line.startsWith('parent '))
        .map((line) => line.slice(7));
      if (
        parents.length !== 2 ||
        parents.some((parent, i) => parent !== expectedParents[i]) ||
        base !== parents[0]
      ) {
        throw new Error('PR merge/base/head identity mismatch');
      }
    }
    const diff = ['diff', '--no-renames', '--name-only', '-z'];
    const paths =
      head === undefined
        ? [
            ...splitPaths(git(root, [...diff, base, '--'])),
            ...splitPaths(git(root, [...diff, '--cached', base, '--'])),
            ...splitPaths(
              git(root, ['ls-files', '--others', '--exclude-standard', '-z']),
            ),
          ]
        : splitPaths(git(root, [...diff, base, head, '--']));
    let plan = classifyPaths(paths);
    // Unrelated script/CI selection edits do not change the format owner's inputs.
    // Compare base, final, index and working inputs so staged dependency edits cannot hide.
    for (const path of paths.filter((path) =>
      ['package.json', '.github/workflows/ci.yml'].includes(path),
    )) {
      const dependencyInput = (text) => {
        if (path === '.github/workflows/ci.yml')
          return JSON.stringify({
            formatRoutes: [
              ...text.matchAll(/^\s*(?:- )?run: pnpm format:check\s*$/gm),
            ].length,
            toolchain: [
              ...text.matchAll(/^\s*(NODE_VERSION|PNPM_VERSION):[ \t]*(.+)$/gm),
            ].map((match) => [match[1], match[2].trim()]),
          });
        const manifest = JSON.parse(text);
        return JSON.stringify({
          ...Object.fromEntries(
            [
              'packageManager',
              'engines',
              'dependencies',
              'devDependencies',
              'optionalDependencies',
              'peerDependencies',
              'pnpm',
              'overrides',
              'resolutions',
            ].map((key) => [key, manifest[key] ?? null]),
          ),
          formatRoute: {
            format: manifest.scripts?.format ?? null,
            check: manifest.scripts?.['format:check'] ?? null,
          },
        });
      };
      let ownerImpact = true;
      try {
        const before = dependencyInput(git(root, ['show', base + ':' + path]));
        const inputs =
          head === undefined
            ? [
                git(root, ['show', 'HEAD:' + path]),
                git(root, ['show', ':' + path]),
                readFileSync(join(root, path), 'utf8'),
              ]
            : [git(root, ['show', head + ':' + path])];
        ownerImpact = inputs.some((input) => dependencyInput(input) !== before);
      } catch {
        /* Unavailable or malformed dependency input requires owner validation. */
      }
      if (ownerImpact)
        plan = {
          ...fullPlan(
            'Formatting route or dependency/toolchain inputs changed; owner validation required',
          ),
          toolingTests: ['ALL', formatOwnerTest],
          paths: plan.paths,
        };
    }
    // A removed or unavailable tool test cannot become a silent omission.
    if (
      plan.toolingTests.some(
        (path) => path !== 'ALL' && !existsSync(join(root, path)),
      )
    ) {
      return {
        ...fullPlan('Selected tooling test is unavailable'),
        toolingTests: [
          'ALL',
          ...plan.toolingTests.filter((path) => path !== 'ALL'),
        ],
        paths: plan.paths,
        testedHead: actualHead,
        base,
      };
    }
    return {
      ...plan,
      testedHead: actualHead,
      base,
      candidate: head === undefined ? 'WORKING_TREE_AND_INDEX' : 'COMMIT',
    };
  } catch (error) {
    return fullPlan(`Uncertain Git input: ${error.message}`);
  }
}

export function planCi(root, env = process.env) {
  try {
    if (env.GITHUB_EVENT_NAME !== 'pull_request')
      return planGit({ root, head: env.GITHUB_SHA, forceFull: true });
    const event = JSON.parse(readFileSync(env.GITHUB_EVENT_PATH, 'utf8'));
    const base = event.pull_request?.base?.sha;
    const prHead = event.pull_request?.head?.sha;
    if (
      !shaPattern.test(env.GITHUB_SHA ?? '') ||
      !shaPattern.test(prHead ?? '')
    )
      throw new Error('Invalid PR identity');
    return planGit({
      root,
      base,
      head: env.GITHUB_SHA,
      expectedParents: [base, prHead],
    });
  } catch (error) {
    return fullPlan(`Uncertain CI event: ${error.message}`);
  }
}

export function toolingTestPaths(root, selection) {
  const explicit = selection.filter((path) => path !== 'ALL');
  const discovered = selection.includes('ALL')
    ? readdirSync(join(root, 'scripts'), { recursive: true })
        .filter((path) => path.endsWith('.test.mjs'))
        .map((path) => 'scripts/' + path.replaceAll('\\', '/'))
        .filter(
          (path) =>
            path !== 'scripts/validation-plan.test.mjs' &&
            path !== formatOwnerTest,
        )
    : [];
  return [...new Set([...discovered, ...explicit])].sort();
}

export function main(argv = process.argv.slice(2), env = process.env) {
  const { values } = parseArgs({
    args: argv,
    options: {
      base: { type: 'string' },
      head: { type: 'string' },
      full: { type: 'boolean' },
      ci: { type: 'boolean' },
      'run-tooling': { type: 'string' },
    },
  });
  const root = process.cwd();
  if (values['run-tooling'] !== undefined) {
    const selection = JSON.parse(values['run-tooling']);
    if (
      !Array.isArray(selection) ||
      selection.some(
        (path) =>
          path !== 'ALL' &&
          (!safePath(path) || !/^scripts\/.*\.test\.mjs$/u.test(path)),
      )
    ) {
      throw new Error('Invalid tooling test selection');
    }
    const tests = toolingTestPaths(root, selection);
    if (selection.includes('ALL') && !selection.includes(formatOwnerTest)) {
      console.log(formatOwnerNote);
      if (env.GITHUB_STEP_SUMMARY)
        appendFileSync(env.GITHUB_STEP_SUMMARY, formatOwnerNote + '\n');
    }
    if (selection.includes('ALL') && !tests.length)
      throw new Error('Full tooling suite is empty');
    if (tests.length)
      execFileSync(process.execPath, ['--test', ...tests], {
        cwd: root,
        stdio: 'inherit',
      });
    return;
  }
  const plan = values.ci
    ? planCi(root, env)
    : planGit({
        root,
        base: values.base,
        head: values.head,
        forceFull: values.full,
      });
  console.log(JSON.stringify(plan, null, 2));
  if (values.ci && env.GITHUB_OUTPUT) {
    const keys = [
      'typecheck',
      'topology',
      'cloudTests',
      'cloudBuilds',
      'localTests',
      'uiTests',
    ];
    appendFileSync(
      env.GITHUB_OUTPUT,
      keys.map((key) => `${key}=${plan[key]}\n`).join('') +
        `toolingTests=${JSON.stringify(plan.toolingTests)}\n`,
    );
  }
  if (values.ci && env.GITHUB_STEP_SUMMARY) {
    appendFileSync(
      env.GITHUB_STEP_SUMMARY,
      `### Validation plan\n\n\`\`\`json\n${JSON.stringify(plan, null, 2)}\n\`\`\`\n`,
    );
  }
  return plan;
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
)
  main();
