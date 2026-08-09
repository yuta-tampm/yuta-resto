import assert from 'node:assert/strict';
import {
  cpSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, test } from 'node:test';
import {
  createUiPack,
  normalizeApplication,
  parseCreateArguments,
  validateSlug,
  validateUiPacks,
} from './ui-pack-tooling.mjs';

const sourceRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const temporaryRoots = [];

afterEach(() => {
  for (const root of temporaryRoots.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
});

test('normalizes canonical applications and parses generator arguments', () => {
  const root = createFixtureRepository();
  assert.equal(normalizeApplication('yuta-pos', root), 'apps/yuta-pos');
  assert.equal(
    normalizeApplication('apps/backoffice', root),
    'apps/backoffice',
  );
  assert.deepEqual(
    parseCreateArguments([
      '--app',
      'yuta-pos',
      '--slug',
      'pos-management-printing',
      '--target',
      '/management/printing',
      '--type',
      'screen',
    ]),
    {
      app: 'yuta-pos',
      slug: 'pos-management-printing',
      target: '/management/printing',
      targetType: 'SCREEN',
    },
  );
  assert.throws(
    () => normalizeApplication('unknown', root),
    /Unknown frontend/u,
  );
  assert.throws(
    () =>
      parseCreateArguments([
        '--app',
        'web',
        '--slug',
        'home',
        '--target',
        '/\nunsafe',
      ]),
    /single-line/u,
  );
  assert.throws(
    () =>
      parseCreateArguments([
        '--app',
        'web',
        '--slug',
        'home',
        '--target',
        '/',
        '--unknown',
        'value',
      ]),
    /Unknown option/u,
  );
});

test('rejects invalid, traversal, versioned, and temporary slugs', () => {
  for (const slug of [
    '../escape',
    'Bad-Slug',
    'page_v2',
    'screen-v2',
    'new-page',
  ]) {
    assert.throws(() => validateSlug(slug));
  }
});

test('generates a complete design package without overwriting an existing one', () => {
  const root = createFixtureRepository();
  const options = {
    repositoryRoot: root,
    app: 'yuta-pos',
    slug: 'pos-management-printing',
    target: '/management/printing',
    targetType: 'SCREEN',
  };

  const result = createUiPack(options);
  assert.equal(result.canonicalApp, 'apps/yuta-pos');
  assert.ok(result.tree.includes('references/README.md'));
  assert.ok(result.tree.includes('DESIGN_HANDOFF.md'));
  assert.ok(result.tree.includes('prompts/05_VISUAL_QA.md'));

  const readme = readFileSync(join(result.destination, 'README.md'), 'utf8');
  assert.match(readme, /Application: `apps\/yuta-pos`/u);
  assert.match(readme, /Target type: `SCREEN`/u);
  assert.match(readme, /Page classification: `UNKNOWN`/u);
  assert.match(readme, /Package status: `design`/u);
  assert.match(readme, /Baseline status: `PENDING`/u);
  assert.match(readme, /Design prompt status: `PENDING`/u);
  assert.match(readme, /POS_FRONTEND_RULES\.md/u);

  assert.throws(() => createUiPack(options), /already exists/u);
  assert.equal(
    readdirSync(join(root, 'docs', 'ui', 'pages')).filter((name) =>
      name.startsWith('.pos-management-printing.tmp-'),
    ).length,
    0,
  );
});

test('validates a generated design package and detects missing structure', () => {
  const root = createFixtureRepository();
  const result = createUiPack({
    repositoryRoot: root,
    app: 'backoffice',
    slug: 'reservation-detail',
    target: '/reservations/example',
    targetType: 'PAGE',
  });

  let validation = validateUiPacks({ repositoryRoot: root });
  assert.deepEqual(validation.errors, []);
  assert.deepEqual(validation.warnings, []);

  unlinkSync(join(result.destination, 'prompts', '03_INTERACTIONS.md'));
  validation = validateUiPacks({
    repositoryRoot: root,
    slug: 'reservation-detail',
  });
  assert.ok(validation.errors.some((error) => error.rule === 'missing-prompt'));

  unlinkSync(join(result.destination, 'DESIGN_HANDOFF.md'));
  validation = validateUiPacks({
    repositoryRoot: root,
    slug: 'reservation-detail',
  });
  assert.ok(
    validation.errors.some((error) => error.rule === 'missing-lifecycle-file'),
  );
});

test('keeps legacy packages valid with a lifecycle warning', () => {
  const root = createFixtureRepository();
  const packageRoot = join(root, 'docs', 'ui', 'pages', 'legacy-page');
  mkdirSync(join(packageRoot, 'references'), { recursive: true });
  mkdirSync(join(packageRoot, 'prompts'), { recursive: true });

  writeFileSync(
    join(packageRoot, 'README.md'),
    '# Legacy\n\nApplication: `apps/backoffice`\n\nRead `YUTA_FRONTEND_RULES.md` and `BACKOFFICE_FRONTEND_RULES.md`.\n',
  );
  for (const file of [...requiredFixtureFiles, 'PRODUCT_SCOPE.md']) {
    writeFileSync(join(packageRoot, file), `# ${file}\n`);
  }
  for (const prompt of requiredFixturePrompts) {
    writeFileSync(join(packageRoot, 'prompts', prompt), `# ${prompt}\n`);
  }

  const validation = validateUiPacks({ repositoryRoot: root });
  assert.deepEqual(validation.errors, []);
  assert.ok(
    validation.warnings.some((warning) => warning.rule === 'legacy-lifecycle'),
  );
});

test('rejects unresolved implementation-ready metadata and unknown commands', () => {
  const root = createFixtureRepository();
  const result = createUiPack({
    repositoryRoot: root,
    app: 'yuta-pos',
    slug: 'pos-order-entry',
    target: '/pos',
    targetType: 'SCREEN',
  });
  const readmePath = join(result.destination, 'README.md');
  let readme = readFileSync(readmePath, 'utf8').replace(
    'Package status: `design`',
    'Package status: `implementation-ready`',
  );
  writeFileSync(readmePath, readme);

  let validation = validateUiPacks({
    repositoryRoot: root,
    slug: 'pos-order-entry',
  });
  assert.ok(
    validation.errors.some((error) => error.rule === 'unresolved-lifecycle'),
  );

  readme = makeImplementationReady(readme);
  writeFileSync(readmePath, readme);
  validation = validateUiPacks({
    repositoryRoot: root,
    slug: 'pos-order-entry',
  });
  assert.deepEqual(validation.errors, []);

  writeFileSync(
    readmePath,
    readme.replace('Baseline status: `CAPTURED`', 'Baseline status: `BLOCKED`'),
  );
  validation = validateUiPacks({
    repositoryRoot: root,
    slug: 'pos-order-entry',
  });
  assert.ok(
    validation.errors.some(
      (error) => error.rule === 'incomplete-design-handoff',
    ),
  );
  writeFileSync(readmePath, readme);

  const referencePath = join(result.destination, 'references', 'README.md');
  const reference = readFileSync(referencePath, 'utf8');
  writeFileSync(
    referencePath,
    reference.replace('Reference status: `NONE`', 'Reference status: `DRAFT`'),
  );
  validation = validateUiPacks({
    repositoryRoot: root,
    slug: 'pos-order-entry',
  });
  assert.ok(
    validation.errors.some(
      (error) => error.rule === 'reference-status-mismatch',
    ),
  );
  writeFileSync(referencePath, reference);

  const planPath = join(result.destination, 'IMPLEMENTATION_PLAN.md');
  writeFileSync(
    planPath,
    `${readFileSync(planPath, 'utf8')}\n\n\`pnpm --filter @yuta/core test\`\n\n\`pnpm command:missing\`\n`,
  );

  validation = validateUiPacks({
    repositoryRoot: root,
    slug: 'pos-order-entry',
  });
  assert.ok(
    validation.errors.some(
      (error) => error.rule === 'unknown-verification-command',
    ),
  );
  assert.ok(
    !validation.errors.some((error) => error.detail.includes('@yuta/core')),
  );
});

test('implemented status requires resolved delivery and as-built evidence', () => {
  const root = createFixtureRepository();
  const result = createUiPack({
    repositoryRoot: root,
    app: 'web',
    slug: 'public-home',
    target: '/',
    targetType: 'PAGE',
  });
  const readmePath = join(result.destination, 'README.md');
  const readme = makeImplementationReady(
    readFileSync(readmePath, 'utf8'),
  ).replace(
    'Package status: `implementation-ready`',
    'Package status: `implemented`',
  );
  writeFileSync(readmePath, readme);

  const validation = validateUiPacks({
    repositoryRoot: root,
    slug: 'public-home',
  });
  assert.ok(
    validation.errors.some(
      (error) => error.rule === 'missing-as-built-evidence',
    ),
  );
});

const requiredFixtureFiles = [
  'UI_SPEC.md',
  'DATA_AND_INTERACTION_SPEC.md',
  'IMPLEMENTATION_PLAN.md',
  'ACCEPTANCE_CHECKLIST.md',
];

const requiredFixturePrompts = [
  '00_REPOSITORY_ANALYSIS.md',
  '01_VISUAL_BASELINE.md',
  '02_COMPONENT_REFACTOR.md',
  '03_INTERACTIONS.md',
  '04_DATA_INTEGRATION.md',
  '05_VISUAL_QA.md',
];

function createFixtureRepository() {
  const root = mkdtempSync(join(tmpdir(), 'yuta-ui-pack-'));
  temporaryRoots.push(root);

  writeJson(join(root, 'package.json'), {
    scripts: {
      'docs:check': 'node docs.mjs',
      'architecture:check': 'node architecture.mjs',
      'format:check': 'prettier --check .',
    },
  });

  for (const [name, canonical] of [
    ['@yuta/web', 'apps/web'],
    ['@yuta/backoffice', 'apps/backoffice'],
    ['@yuta/booking-web', 'apps/booking-web'],
    ['@yuta/feedback-web', 'apps/feedback-web'],
    ['@yuta/pos', 'apps/yuta-pos'],
    ['@yuta/display', 'apps/yuta-display'],
    ['@yuta/core', 'packages/core'],
  ]) {
    writeJson(join(root, canonical, 'package.json'), {
      name,
      scripts: { typecheck: 'tsc --noEmit', test: 'node --test' },
    });
  }

  const templateTarget = join(root, 'docs', 'ui', 'templates', 'page');
  mkdirSync(dirname(templateTarget), { recursive: true });
  cpSync(join(sourceRoot, 'docs', 'ui', 'templates', 'page'), templateTarget, {
    recursive: true,
  });
  mkdirSync(join(root, 'docs', 'ui', 'pages'), { recursive: true });
  return root;
}

function writeJson(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}

function makeImplementationReady(readme) {
  return readme
    .replace(
      'Page classification: `UNKNOWN`',
      'Page classification: `EXISTING_PAGE`',
    )
    .replace(
      'Implementation class: `UNKNOWN`',
      'Implementation class: `integrated`',
    )
    .replace(
      'Package status: `design`',
      'Package status: `implementation-ready`',
    )
    .replace('Scope status: `DRAFT`', 'Scope status: `APPROVED`')
    .replace('Inventory status: `PENDING`', 'Inventory status: `COMPLETE`')
    .replace('Baseline status: `PENDING`', 'Baseline status: `CAPTURED`')
    .replace('Design prompt status: `PENDING`', 'Design prompt status: `READY`')
    .replace(
      'No-image reference reason: `<required when Reference status is NONE after design approval>`',
      'No-image reference reason: `Approved without an image reference`',
    )
    .replace(
      'Files expected to modify:',
      'Files expected to modify: apps/example/page.tsx',
    )
    .replace('Files expected to create:', 'Files expected to create: NONE')
    .replace('Packages affected:', 'Packages affected: target application')
    .replace('Cross-application impact:', 'Cross-application impact: NONE')
    .replace('Database change: YES | NO | PROPOSAL', 'Database change: NO')
    .replace(
      'API or contract change: YES | NO | PROPOSAL',
      'API or contract change: NO',
    )
    .replace(
      'Permission/auth change: YES | NO | PROPOSAL',
      'Permission/auth change: NO',
    )
    .replace(
      'Runtime/device change: YES | NO | PROPOSAL',
      'Runtime/device change: NO',
    );
}
