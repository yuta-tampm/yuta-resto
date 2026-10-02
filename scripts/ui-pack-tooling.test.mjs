import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
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
  assert.ok(result.tree.includes('prompt-provenance.json'));
  assert.ok(!result.tree.includes('prompt-template.json'));

  const readme = readFileSync(join(result.destination, 'README.md'), 'utf8');
  assert.match(readme, /Application: `apps\/yuta-pos`/u);
  assert.match(readme, /Protocol revision: 4/u);
  assert.match(readme, /Target type: `SCREEN`/u);
  assert.match(readme, /Page classification: `UNKNOWN`/u);
  assert.match(readme, /Package status: `design`/u);
  assert.match(readme, /Baseline status: `PENDING`/u);
  assert.match(readme, /Design prompt status: `PENDING`/u);
  assert.match(readme, /Shared context status: `PENDING`/u);
  assert.match(readme, /Prompt snapshot topology: `GENERATED_SNAPSHOTS`/u);
  assert.match(readme, /Prompt provenance: `prompt-provenance\.json`/u);

  const provenance = readJson(
    join(result.destination, 'prompt-provenance.json'),
  );
  assert.equal(provenance.schemaVersion, 1);
  assert.equal(provenance.topology, 'GENERATED_SNAPSHOTS');
  assert.equal(provenance.sealed, true);
  assert.equal(provenance.templateRevision, 'prompt-template-v1');
  assert.equal(provenance.prompts.length, 6);
  assert.ok(
    provenance.prompts.every(
      (prompt) => prompt.templateRevision === provenance.templateRevision,
    ),
  );
  assert.ok(provenance.generation.commit || provenance.generation.timestamp);
  for (const prompt of provenance.prompts) {
    assert.ok(requiredFixturePrompts.includes(prompt.filename));
    assert.equal(
      prompt.templateSource,
      `docs/ui/templates/page/prompts/${prompt.filename}`,
    );
    assert.ok(!prompt.templateSource.includes('\\'));
    assert.equal(prompt.templateRevision, 'prompt-template-v1');
    assert.equal(
      prompt.templateSha256,
      hashFile(join(root, ...prompt.templateSource.split('/'))),
    );
    assert.equal(
      prompt.snapshotSha256,
      hashFile(join(result.destination, 'prompts', prompt.filename)),
    );
    assert.equal(prompt.templateSha256, prompt.snapshotSha256);
    assert.equal(prompt.localModificationState, 'NONE');
    assert.equal(prompt.provenanceStatus, 'PROVEN');
  }

  const withoutSharedContext = readme.replace(
    /\nShared context status: `PENDING`\n/u,
    '\n',
  );
  writeFileSync(join(result.destination, 'README.md'), withoutSharedContext);
  const missingSharedContextValidation = validateUiPacks({
    repositoryRoot: root,
    slug: 'pos-management-printing',
  });
  assert.ok(
    missingSharedContextValidation.errors.some(
      (error) => error.rule === 'missing-shared-context',
    ),
  );
  writeFileSync(join(result.destination, 'README.md'), readme);
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
  assert.ok(
    validation.warnings.some(
      (warning) => warning.rule === 'missing-prompt-provenance',
    ),
  );
});

test('requires complete generated provenance and detects sealed prompt changes', () => {
  const root = createFixtureRepository();
  const result = createUiPack({
    repositoryRoot: root,
    app: 'yuta-pos',
    slug: 'sealed-snapshot',
    target: '/sealed',
    targetType: 'SCREEN',
  });
  const provenancePath = join(result.destination, 'prompt-provenance.json');
  const provenance = readJson(provenancePath);

  unlinkSync(provenancePath);
  let validation = validateUiPacks({
    repositoryRoot: root,
    slug: 'sealed-snapshot',
  });
  assert.ok(
    validation.errors.some(
      (error) => error.rule === 'missing-prompt-provenance',
    ),
  );

  writeJson(provenancePath, {
    ...provenance,
    prompts: provenance.prompts.slice(1),
  });
  validation = validateUiPacks({
    repositoryRoot: root,
    slug: 'sealed-snapshot',
  });
  assert.ok(
    validation.errors.some(
      (error) => error.rule === 'missing-prompt-provenance-entry',
    ),
  );

  writeJson(provenancePath, {
    ...provenance,
    prompts: [...provenance.prompts, provenance.prompts[0]],
  });
  validation = validateUiPacks({
    repositoryRoot: root,
    slug: 'sealed-snapshot',
  });
  assert.ok(
    validation.errors.some(
      (error) => error.rule === 'duplicate-prompt-provenance',
    ),
  );

  writeJson(provenancePath, provenance);
  const snapshotPath = join(
    result.destination,
    'prompts',
    '03_INTERACTIONS.md',
  );
  const changedSnapshot = `${readFileSync(snapshotPath, 'utf8')}\nChanged after seal.\n`;
  writeFileSync(snapshotPath, changedSnapshot);
  validation = validateUiPacks({
    repositoryRoot: root,
    slug: 'sealed-snapshot',
  });
  assert.ok(
    validation.errors.some((error) => error.rule === 'sealed-prompt-mismatch'),
  );
  assert.equal(readFileSync(snapshotPath, 'utf8'), changedSnapshot);
});

test('keeps an old sealed snapshot valid when the canonical template changes', () => {
  const root = createFixtureRepository();
  const result = createUiPack({
    repositoryRoot: root,
    app: 'backoffice',
    slug: 'template-evolution',
    target: '/template-evolution',
    targetType: 'PAGE',
  });
  const snapshotPath = join(
    result.destination,
    'prompts',
    '02_COMPONENT_REFACTOR.md',
  );
  const snapshotBefore = readFileSync(snapshotPath, 'utf8');
  const templatePath = join(
    root,
    'docs',
    'ui',
    'templates',
    'page',
    'prompts',
    '02_COMPONENT_REFACTOR.md',
  );
  writeFileSync(
    templatePath,
    `${readFileSync(templatePath, 'utf8')}\nNew canonical revision content.\n`,
  );

  const validation = validateUiPacks({
    repositoryRoot: root,
    slug: 'template-evolution',
  });
  assert.deepEqual(validation.errors, []);
  assert.equal(readFileSync(snapshotPath, 'utf8'), snapshotBefore);
});

test('accepts proven historical prompts from mixed template revisions', () => {
  const root = createFixtureRepository();
  const result = createUiPack({
    repositoryRoot: root,
    app: 'backoffice',
    slug: 'mixed-history',
    target: '/mixed-history',
    targetType: 'PAGE',
  });
  const provenancePath = join(result.destination, 'prompt-provenance.json');
  const provenance = readJson(provenancePath);
  provenance.templateRevision = null;
  provenance.prompts[0].templateRevision = 'prompt-template-v0';
  writeJson(provenancePath, provenance);

  const validation = validateUiPacks({
    repositoryRoot: root,
    slug: 'mixed-history',
  });
  assert.deepEqual(validation.errors, []);
  assert.deepEqual(validation.warnings, []);
});

test('warns for partial provenance with an unavailable historical source and still enforces the sealed hash', () => {
  const root = createFixtureRepository();
  const result = createUiPack({
    repositoryRoot: root,
    app: 'yuta-pos',
    slug: 'partial-history',
    target: '/partial-history',
    targetType: 'SCREEN',
  });
  const provenancePath = join(result.destination, 'prompt-provenance.json');
  const provenance = readJson(provenancePath);
  const prompt = provenance.prompts[0];
  provenance.templateRevision = null;
  prompt.templateRevision = 'prompt-template-v0';
  prompt.provenanceStatus = 'PARTIAL';
  writeJson(provenancePath, provenance);
  unlinkSync(join(root, ...prompt.templateSource.split('/')));

  let validation = validateUiPacks({
    repositoryRoot: root,
    slug: 'partial-history',
  });
  assert.deepEqual(validation.errors, []);
  assert.ok(
    validation.warnings.some(
      (warning) => warning.rule === 'partial-prompt-provenance',
    ),
  );

  const snapshotPath = join(result.destination, 'prompts', prompt.filename);
  const changedSnapshot = `${readFileSync(snapshotPath, 'utf8')}\nChanged after seal.\n`;
  writeFileSync(snapshotPath, changedSnapshot);
  validation = validateUiPacks({
    repositoryRoot: root,
    slug: 'partial-history',
  });
  assert.ok(
    validation.errors.some((error) => error.rule === 'sealed-prompt-mismatch'),
  );
  assert.ok(
    validation.warnings.some(
      (warning) => warning.rule === 'partial-prompt-provenance',
    ),
  );
  assert.equal(readFileSync(snapshotPath, 'utf8'), changedSnapshot);
});

test('warns without failing when historical provenance needs review', () => {
  const root = createFixtureRepository();
  const result = createUiPack({
    repositoryRoot: root,
    app: 'backoffice',
    slug: 'unresolved-history',
    target: '/unresolved-history',
    targetType: 'PAGE',
  });
  const provenancePath = join(result.destination, 'prompt-provenance.json');
  const provenance = readJson(provenancePath);
  provenance.templateRevision = null;
  provenance.prompts[0].templateRevision = null;
  provenance.prompts[0].templateSource = null;
  provenance.prompts[0].templateSha256 = null;
  provenance.prompts[0].localModificationState = 'UNKNOWN';
  provenance.prompts[0].provenanceStatus = 'NEEDS_REVIEW';
  writeJson(provenancePath, provenance);

  const validation = validateUiPacks({
    repositoryRoot: root,
    slug: 'unresolved-history',
  });
  assert.deepEqual(validation.errors, []);
  assert.ok(
    validation.warnings.some(
      (warning) => warning.rule === 'unresolved-prompt-provenance',
    ),
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
    readme.replace(
      'Shared context status: `RESOLVED`',
      'Shared context status: `BLOCKED`',
    ),
  );
  validation = validateUiPacks({
    repositoryRoot: root,
    slug: 'pos-order-entry',
  });
  assert.ok(
    validation.errors.some(
      (error) => error.rule === 'incomplete-shared-context',
    ),
  );
  writeFileSync(readmePath, readme);

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

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function hashFile(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
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
      'Shared context status: `PENDING`',
      'Shared context status: `RESOLVED`',
    )
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
