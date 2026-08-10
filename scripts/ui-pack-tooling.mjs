import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  realpathSync,
  renameSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { basename, join, relative, resolve, sep } from 'node:path';

export const frontendApplications = new Map([
  ['web', 'apps/web'],
  ['backoffice', 'apps/backoffice'],
  ['booking-web', 'apps/booking-web'],
  ['feedback-web', 'apps/feedback-web'],
  ['yuta-pos', 'apps/yuta-pos'],
  ['yuta-display', 'apps/yuta-display'],
]);

export const targetTypes = new Set([
  'PAGE',
  'SCREEN',
  'SURFACE',
  'FLOW',
  'UNKNOWN',
]);

const packageStates = new Set([
  'design',
  'approved',
  'implementation-ready',
  'implemented',
]);
const scopeStates = new Set(['DRAFT', 'REVIEWED', 'APPROVED']);
const referenceStates = new Set(['NONE', 'DRAFT', 'REVIEWED', 'APPROVED']);
const inventoryStates = new Set(['PENDING', 'COMPLETE']);
const baselineStates = new Set([
  'PENDING',
  'CAPTURED',
  'BLOCKED',
  'NOT_APPLICABLE',
]);
const designPromptStates = new Set(['PENDING', 'READY']);
const sharedContextStates = new Set(['PENDING', 'RESOLVED', 'BLOCKED']);
const pageClassifications = new Set(['NEW_PAGE', 'EXISTING_PAGE', 'UNKNOWN']);
const implementationClasses = new Set([
  'visual-only',
  'interactive',
  'integrated',
  'device-coupled',
  'UNKNOWN',
]);

const requiredFiles = [
  'README.md',
  'UI_SPEC.md',
  'DATA_AND_INTERACTION_SPEC.md',
  'IMPLEMENTATION_PLAN.md',
  'ACCEPTANCE_CHECKLIST.md',
];

const lifecycleRequiredFiles = ['DESIGN_HANDOFF.md'];

const requiredPrompts = [
  '00_REPOSITORY_ANALYSIS.md',
  '01_VISUAL_BASELINE.md',
  '02_COMPONENT_REFACTOR.md',
  '03_INTERACTIONS.md',
  '04_DATA_INTEGRATION.md',
  '05_VISUAL_QA.md',
];

const lifecycleFields = [
  'Target type',
  'Page classification',
  'Implementation class',
  'Package status',
  'Scope status',
  'Reference status',
  'Inventory status',
  'Baseline status',
  'Design prompt status',
];

export function normalizeApplication(input, repositoryRoot) {
  if (typeof input !== 'string' || input.length === 0) {
    throw new Error('Frontend application is required.');
  }
  const normalized = input.replaceAll('\\', '/').replace(/^apps\//u, '');
  const canonical = frontendApplications.get(normalized);

  if (!canonical || !existsSync(join(repositoryRoot, canonical))) {
    throw new Error(`Unknown frontend application: ${input}`);
  }

  return canonical;
}

export function validateSlug(slug) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(slug)) {
    throw new Error(
      'Slug must be lowercase, accent-free, and hyphenated with no path separators.',
    );
  }

  const forbidden = new Set(['new', 'final', 'latest']);
  const segments = slug.split('-');
  if (
    segments.some(
      (segment) => forbidden.has(segment) || /^v\d+$/u.test(segment),
    )
  ) {
    throw new Error(
      'Slug must not contain version or temporary-name segments.',
    );
  }
}

export function parseCreateArguments(arguments_) {
  const values = new Map();
  const allowed = new Set(['app', 'slug', 'target', 'type']);
  for (let index = 0; index < arguments_.length; index += 1) {
    const argument = arguments_[index];
    if (!argument.startsWith('--')) {
      throw new Error(`Unexpected argument: ${argument}`);
    }
    const key = argument.slice(2);
    if (!allowed.has(key)) {
      throw new Error(`Unknown option: ${argument}`);
    }
    if (values.has(key)) {
      throw new Error(`Duplicate option: ${argument}`);
    }
    const value = arguments_[index + 1];
    if (!value || value.startsWith('--')) {
      throw new Error(`Missing value for ${argument}`);
    }
    values.set(key, value);
    index += 1;
  }

  for (const required of ['app', 'slug', 'target']) {
    if (!values.has(required)) {
      throw new Error(`Missing required option: --${required}`);
    }
  }

  const targetType = (values.get('type') ?? 'UNKNOWN').toUpperCase();
  if (!targetTypes.has(targetType)) {
    throw new Error(`Invalid target type: ${targetType}`);
  }
  validateTarget(values.get('target'));

  return {
    app: values.get('app'),
    slug: values.get('slug'),
    target: values.get('target'),
    targetType,
  };
}

export function createUiPack({
  repositoryRoot,
  app,
  slug,
  target,
  targetType = 'UNKNOWN',
}) {
  validateSlug(slug);
  validateTarget(target);
  const canonicalApp = normalizeApplication(app, repositoryRoot);
  const normalizedType = targetType.toUpperCase();
  if (!targetTypes.has(normalizedType)) {
    throw new Error(`Invalid target type: ${targetType}`);
  }

  const templateRoot = join(repositoryRoot, 'docs', 'ui', 'templates', 'page');
  const pagesRoot = join(repositoryRoot, 'docs', 'ui', 'pages');
  if (!existsSync(templateRoot)) {
    throw new Error(`Missing canonical template: ${templateRoot}`);
  }
  mkdirSync(pagesRoot, { recursive: true });

  const realRepositoryRoot = realpathSync(repositoryRoot);
  const realPagesRoot = realpathSync(pagesRoot);
  if (!isWithin(realRepositoryRoot, realPagesRoot)) {
    throw new Error('UI pages root resolves outside the repository.');
  }

  const destination = resolve(realPagesRoot, slug);
  if (!isWithin(realPagesRoot, destination) || destination === realPagesRoot) {
    throw new Error('Resolved package destination is unsafe.');
  }
  if (existsSync(destination)) {
    throw new Error(`UI page package already exists: ${slug}`);
  }

  const staging = join(
    realPagesRoot,
    `.${slug}.tmp-${process.pid}-${Math.random().toString(16).slice(2)}`,
  );

  try {
    cpSync(templateRoot, staging, {
      recursive: true,
      errorOnExist: true,
      force: false,
    });
    populateGeneratedMetadata(staging, {
      canonicalApp,
      slug,
      target,
      targetType: normalizedType,
    });
    renameSync(staging, destination);
  } catch (error) {
    if (existsSync(staging) && isWithin(realPagesRoot, staging)) {
      rmSync(staging, { recursive: true, force: true });
    }
    throw error;
  }

  return {
    canonicalApp,
    destination,
    tree: listTree(destination),
  };
}

function validateTarget(target) {
  if (
    typeof target !== 'string' ||
    target.trim() === '' ||
    /[\r\n`]/u.test(target)
  ) {
    throw new Error(
      'Target must be a non-empty single-line value without backticks.',
    );
  }
}

export function validateUiPacks({ repositoryRoot, slug }) {
  const pagesRoot = join(repositoryRoot, 'docs', 'ui', 'pages');
  if (!existsSync(pagesRoot)) {
    return {
      errors: [
        issue('missing-pages-root', 'docs/ui/pages', 'Directory is missing.'),
      ],
      warnings: [],
      checkedPackages: [],
    };
  }

  const packageNames = slug
    ? [slug]
    : readdirSync(pagesRoot)
        .filter((name) => !name.startsWith('.'))
        .filter((name) => {
          const path = join(pagesRoot, name);
          return statSync(path).isDirectory();
        })
        .sort();

  const errors = [];
  const warnings = [];
  const checkedPackages = [];

  for (const packageName of packageNames) {
    const packagePath = join(pagesRoot, packageName);
    if (!existsSync(packagePath) || !statSync(packagePath).isDirectory()) {
      errors.push(
        issue(
          'missing-package',
          `docs/ui/pages/${packageName}`,
          'Package directory does not exist.',
        ),
      );
      continue;
    }

    checkedPackages.push(packageName);
    validatePackage({
      repositoryRoot,
      packageName,
      packagePath,
      errors,
      warnings,
    });
  }

  return { errors, warnings, checkedPackages };
}

function populateGeneratedMetadata(
  packageRoot,
  { canonicalApp, slug, target, targetType },
) {
  const readmePath = join(packageRoot, 'README.md');
  let readme = readFileSync(readmePath, 'utf8');
  const title = slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

  readme = readme
    .replace('# <Page or screen name>', `# ${title}`)
    .replace('Application: `<apps/...>`', `Application: \`${canonicalApp}\``)
    .replace(
      'Route / entry point: `<real route or screen entry>`',
      `Route / entry point: \`${target}\``,
    )
    .replace(
      'Runtime family: `<cloud | public cloud | local POS | standalone local | repository-defined value>`',
      'Runtime family: `UNKNOWN`',
    )
    .replace('Target type: `UNKNOWN`', `Target type: \`${targetType}\``)
    .replace(
      'Application-specific UI rules: `<path or "none; use nearest AGENTS/product docs">`.',
      `Application-specific UI rules: \`${applicationRule(canonicalApp) ?? 'none; use nearest AGENTS/product docs'}\`.`,
    );

  writeFileSync(readmePath, readme, 'utf8');

  const referencePath = join(packageRoot, 'references', 'README.md');
  if (existsSync(referencePath)) {
    const reference = readFileSync(referencePath, 'utf8')
      .replace(
        '# <Page or screen name> — Reference Metadata',
        `# ${title} — Reference Metadata`,
      )
      .replace(
        'Reference status: `NONE | DRAFT | REVIEWED | APPROVED`',
        'Reference status: `NONE`',
      );
    writeFileSync(referencePath, reference, 'utf8');
  }
}

function validatePackage({
  repositoryRoot,
  packageName,
  packagePath,
  errors,
  warnings,
}) {
  const relativePackage = `docs/ui/pages/${packageName}`;
  try {
    validateSlug(packageName);
  } catch (error) {
    errors.push(issue('invalid-slug', relativePackage, error.message));
  }

  for (const file of requiredFiles) {
    if (!existsSync(join(packagePath, file))) {
      errors.push(
        issue(
          'missing-file',
          `${relativePackage}/${file}`,
          'Required file is missing.',
        ),
      );
    }
  }

  const readmePath = join(packagePath, 'README.md');
  if (!existsSync(readmePath)) return;
  const readme = readFileSync(readmePath, 'utf8');
  const metadata = parseMetadata(readme);

  if (!readme.includes('YUTA_FRONTEND_RULES.md')) {
    errors.push(
      issue(
        'missing-shared-rule',
        readmePath,
        'README must reference docs/ui/YUTA_FRONTEND_RULES.md.',
      ),
    );
  }

  if (
    !existsSync(join(packagePath, 'PRODUCT_SCOPE.md')) &&
    !hasResolvedField(readme, 'Product scope omission')
  ) {
    errors.push(
      issue(
        'missing-product-scope',
        relativePackage,
        'PRODUCT_SCOPE.md or a resolved Product scope omission is required.',
      ),
    );
  }

  const referencesPath = join(packagePath, 'references');
  if (!existsSync(referencesPath) || !statSync(referencesPath).isDirectory()) {
    errors.push(
      issue(
        'missing-references',
        `${relativePackage}/references`,
        'Directory is missing.',
      ),
    );
  }

  const promptsPath = join(packagePath, 'prompts');
  for (const prompt of requiredPrompts) {
    if (!existsSync(join(promptsPath, prompt))) {
      errors.push(
        issue(
          'missing-prompt',
          `${relativePackage}/prompts/${prompt}`,
          'Prompt is missing.',
        ),
      );
    }
  }
  if (existsSync(join(promptsPath, 'CODEX_PROMPT.md'))) {
    errors.push(
      issue(
        'monolithic-prompt',
        `${relativePackage}/prompts/CODEX_PROMPT.md`,
        'Six phase prompts must not be replaced by one prompt.',
      ),
    );
  }

  const appValue = unquote(metadata.get('Application'));
  const normalizedApp = [...frontendApplications.values()].includes(appValue)
    ? appValue
    : undefined;
  if (!normalizedApp || !existsSync(join(repositoryRoot, normalizedApp))) {
    errors.push(
      issue(
        'invalid-application',
        readmePath,
        'Application metadata is missing or unknown.',
      ),
    );
  } else {
    const requiredRule = applicationRule(normalizedApp);
    if (requiredRule && !readme.includes(requiredRule)) {
      errors.push(
        issue(
          'missing-application-rule',
          readmePath,
          `README must reference ${requiredRule}.`,
        ),
      );
    }
  }

  if (!metadata.has('Package status')) {
    warnings.push(
      issue(
        'legacy-lifecycle',
        relativePackage,
        'Lifecycle metadata is required when this stable package is next modified.',
      ),
    );
    return;
  }

  for (const file of lifecycleRequiredFiles) {
    if (!existsSync(join(packagePath, file))) {
      errors.push(
        issue(
          'missing-lifecycle-file',
          `${relativePackage}/${file}`,
          'Current lifecycle packages require this file.',
        ),
      );
    }
  }

  for (const field of lifecycleFields) {
    if (!metadata.has(field)) {
      errors.push(issue('missing-metadata', readmePath, `Missing ${field}.`));
    }
  }

  const packageStatus = unquote(metadata.get('Package status'));
  const targetType = unquote(metadata.get('Target type'));
  const classification = unquote(metadata.get('Page classification'));
  const implementationClass = unquote(metadata.get('Implementation class'));
  const scopeStatus = unquote(metadata.get('Scope status'));
  const referenceStatus = unquote(metadata.get('Reference status'));
  const inventoryStatus = unquote(metadata.get('Inventory status'));
  const baselineStatus = unquote(metadata.get('Baseline status'));
  const designPromptStatus = unquote(metadata.get('Design prompt status'));
  const protocolRevisionValue = metadata.has('Protocol revision')
    ? Number(unquote(metadata.get('Protocol revision')))
    : undefined;
  const requiresSharedContext =
    protocolRevisionValue !== undefined && protocolRevisionValue >= 4;
  const sharedContextStatus = metadata.has('Shared context status')
    ? unquote(metadata.get('Shared context status'))
    : undefined;

  if (sharedContextStatus === undefined) {
    const target = requiresSharedContext ? errors : warnings;
    target.push(
      issue(
        requiresSharedContext
          ? 'missing-shared-context'
          : 'legacy-shared-context',
        readmePath,
        requiresSharedContext
          ? 'Protocol revision 4 requires Shared context status.'
          : 'Add Protocol revision 4 and Shared context status when this lifecycle package is next actively migrated.',
      ),
    );
  }

  validateEnum(
    packageStates,
    packageStatus,
    'Package status',
    readmePath,
    errors,
  );
  validateEnum(targetTypes, targetType, 'Target type', readmePath, errors);
  validateEnum(
    pageClassifications,
    classification,
    'Page classification',
    readmePath,
    errors,
  );
  validateEnum(
    implementationClasses,
    implementationClass,
    'Implementation class',
    readmePath,
    errors,
  );
  validateEnum(scopeStates, scopeStatus, 'Scope status', readmePath, errors);
  validateEnum(
    referenceStates,
    referenceStatus,
    'Reference status',
    readmePath,
    errors,
  );
  validateEnum(
    inventoryStates,
    inventoryStatus,
    'Inventory status',
    readmePath,
    errors,
  );
  validateEnum(
    baselineStates,
    baselineStatus,
    'Baseline status',
    readmePath,
    errors,
  );
  validateEnum(
    designPromptStates,
    designPromptStatus,
    'Design prompt status',
    readmePath,
    errors,
  );
  if (sharedContextStatus !== undefined) {
    validateEnum(
      sharedContextStates,
      sharedContextStatus,
      'Shared context status',
      readmePath,
      errors,
    );
  }

  if (!packageStates.has(packageStatus)) return;
  if (packageStatus === 'design') return;

  requireResolvedLifecycle({
    readme,
    readmePath,
    targetType,
    classification,
    implementationClass,
    scopeStatus,
    referenceStatus,
    inventoryStatus,
    baselineStatus,
    designPromptStatus,
    sharedContextStatus,
    errors,
  });
  validateReferenceMetadata({
    packagePath,
    relativePackage,
    referenceStatus,
    errors,
  });

  if (packageStatus === 'approved') return;

  for (const heading of [
    'Current implementation',
    'Protected invariants',
    'Change impact',
    'Design approval',
    'Stop conditions',
  ]) {
    if (!hasResolvedSection(readme, heading)) {
      errors.push(
        issue(
          'incomplete-section',
          readmePath,
          `Section "${heading}" is missing or unresolved.`,
        ),
      );
    }
  }

  validateChangeImpact(readme, readmePath, errors);
  validateCommands(repositoryRoot, packagePath, relativePackage, errors);

  if (packageStatus === 'implemented') {
    const finalSection = section(readme, 'Final delivery and as-built status');
    if (!finalSection || /<[^>]+>|PENDING/u.test(finalSection)) {
      errors.push(
        issue(
          'missing-as-built-evidence',
          readmePath,
          'Implemented status requires resolved final delivery and as-built evidence.',
        ),
      );
    }
  }
}

function validateReferenceMetadata({
  packagePath,
  relativePackage,
  referenceStatus,
  errors,
}) {
  const metadataPath = join(packagePath, 'references', 'README.md');
  if (!existsSync(metadataPath)) {
    errors.push(
      issue(
        'missing-reference-metadata',
        `${relativePackage}/references/README.md`,
        'Reference metadata is required for approved or later packages.',
      ),
    );
    return;
  }

  const metadata = parseMetadata(readFileSync(metadataPath, 'utf8'));
  const recordedStatus = unquote(metadata.get('Reference status'));
  if (recordedStatus !== referenceStatus) {
    errors.push(
      issue(
        'reference-status-mismatch',
        `${relativePackage}/references/README.md`,
        `Reference metadata must use Reference status: ${referenceStatus}.`,
      ),
    );
  }
}

function requireResolvedLifecycle({
  readme,
  readmePath,
  targetType,
  classification,
  implementationClass,
  scopeStatus,
  referenceStatus,
  inventoryStatus,
  baselineStatus,
  designPromptStatus,
  sharedContextStatus,
  errors,
}) {
  if (
    targetType === 'UNKNOWN' ||
    classification === 'UNKNOWN' ||
    implementationClass === 'UNKNOWN' ||
    inventoryStatus !== 'COMPLETE' ||
    scopeStatus !== 'APPROVED'
  ) {
    errors.push(
      issue(
        'unresolved-lifecycle',
        readmePath,
        'Approved or later status requires resolved target/classification/class, approved scope, and complete inventory.',
      ),
    );
  }

  const baselineResolved =
    (classification === 'EXISTING_PAGE' && baselineStatus === 'CAPTURED') ||
    (classification === 'NEW_PAGE' && baselineStatus === 'NOT_APPLICABLE');
  if (!baselineResolved || designPromptStatus !== 'READY') {
    errors.push(
      issue(
        'incomplete-design-handoff',
        readmePath,
        'Approved or later status requires a captured existing-page baseline (or NOT_APPLICABLE for NEW_PAGE) and Design prompt status READY.',
      ),
    );
  }

  if (sharedContextStatus !== undefined && sharedContextStatus !== 'RESOLVED') {
    errors.push(
      issue(
        'incomplete-shared-context',
        readmePath,
        'Approved or later status requires Shared context status: RESOLVED.',
      ),
    );
  }

  if (
    referenceStatus !== 'APPROVED' &&
    !(
      referenceStatus === 'NONE' &&
      hasResolvedField(readme, 'No-image reference reason')
    )
  ) {
    errors.push(
      issue(
        'unapproved-reference',
        readmePath,
        'Use an APPROVED reference or a resolved no-image reason.',
      ),
    );
  }
}

function validateChangeImpact(readme, readmePath, errors) {
  for (const field of [
    'Files expected to modify',
    'Files expected to create',
    'Packages affected',
    'Cross-application impact',
  ]) {
    if (!hasResolvedField(readme, field)) {
      errors.push(
        issue('incomplete-impact', readmePath, `${field} is unresolved.`),
      );
    }
  }

  for (const field of [
    'Database change',
    'API or contract change',
    'Permission/auth change',
    'Runtime/device change',
  ]) {
    const value = unquote(parseMetadata(readme).get(field));
    if (!new Set(['YES', 'NO', 'PROPOSAL']).has(value)) {
      errors.push(
        issue(
          'invalid-impact-flag',
          readmePath,
          `${field} must be YES, NO, or PROPOSAL.`,
        ),
      );
    }
  }
}

function validateCommands(
  repositoryRoot,
  packagePath,
  relativePackage,
  errors,
) {
  const rootPackage = readJson(join(repositoryRoot, 'package.json'));
  const rootScripts = new Set(Object.keys(rootPackage.scripts ?? {}));
  const markdown = collectMarkdown(packagePath)
    .map((file) => readFileSync(file, 'utf8'))
    .join('\n');
  const commands = extractPnpmCommands(markdown);

  if (commands.length === 0) {
    errors.push(
      issue(
        'missing-verification-command',
        relativePackage,
        'Implementation-ready packages require exact pnpm commands.',
      ),
    );
    return;
  }

  for (const command of commands) {
    if (command.filter) {
      const workspace = findWorkspaceByName(repositoryRoot, command.filter);
      if (
        !workspace ||
        !new Set(Object.keys(workspace.scripts ?? {})).has(command.script)
      ) {
        errors.push(
          issue(
            'unknown-verification-command',
            relativePackage,
            `Unknown filtered command: pnpm --filter ${command.filter} ${command.script}`,
          ),
        );
      }
    } else if (!rootScripts.has(command.script)) {
      errors.push(
        issue(
          'unknown-verification-command',
          relativePackage,
          `Unknown root command: pnpm ${command.script}`,
        ),
      );
    }
  }
}

function extractPnpmCommands(content) {
  const commands = [];
  const filtered = /\bpnpm\s+--filter\s+([^\s`]+)\s+([^\s`]+)/gu;
  for (const match of content.matchAll(filtered)) {
    commands.push({ filter: match[1], script: cleanCommandToken(match[2]) });
  }

  const root = /\bpnpm\s+([^\s`]+)/gu;
  for (const match of content.matchAll(root)) {
    const script = cleanCommandToken(match[1]);
    if (script.startsWith('-') || script === 'exec') continue;
    if (
      !commands.some((command) => command.script === script && command.filter)
    ) {
      commands.push({ script });
    }
  }
  return commands;
}

function cleanCommandToken(value) {
  return value.replace(/[),.;]+$/u, '');
}

function findWorkspaceByName(repositoryRoot, name) {
  for (const workspaceGroup of ['apps', 'packages']) {
    const groupPath = join(repositoryRoot, workspaceGroup);
    if (!existsSync(groupPath)) continue;

    for (const entry of readdirSync(groupPath, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const canonical = `${workspaceGroup}/${entry.name}`;
      const packagePath = join(groupPath, entry.name, 'package.json');
      if (!existsSync(packagePath)) continue;
      const manifest = readJson(packagePath);
      if (
        manifest.name === name ||
        canonical === name ||
        basename(canonical) === name
      ) {
        return manifest;
      }
    }
  }
  return undefined;
}

function collectMarkdown(root) {
  const files = [];
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    const path = join(root, entry.name);
    if (entry.isDirectory()) files.push(...collectMarkdown(path));
    else if (entry.isFile() && entry.name.endsWith('.md')) files.push(path);
  }
  return files;
}

function parseMetadata(content) {
  const metadata = new Map();
  for (const line of content.split(/\r?\n/u)) {
    const match = /^([A-Za-z][A-Za-z /-]*):\s*(.*)$/u.exec(line);
    if (match) metadata.set(match[1], match[2].trim());
  }
  return metadata;
}

function hasResolvedField(content, field) {
  const value = unquote(parseMetadata(content).get(field));
  return Boolean(value && !value.includes('<') && value !== 'UNKNOWN');
}

function hasResolvedSection(content, heading) {
  const value = section(content, heading);
  return Boolean(value && value.trim() && !/<[^>]+>/u.test(value));
}

function section(content, heading) {
  const marker = `## ${heading}`;
  const start = content.indexOf(marker);
  if (start < 0) return undefined;
  const bodyStart = start + marker.length;
  const nextHeading = content.indexOf('\n## ', bodyStart);
  return content
    .slice(bodyStart, nextHeading < 0 ? undefined : nextHeading)
    .trim();
}

function validateEnum(allowed, value, field, path, errors) {
  if (!allowed.has(value)) {
    errors.push(
      issue(
        'invalid-metadata',
        path,
        `${field} has invalid value: ${value ?? ''}`,
      ),
    );
  }
}

function applicationRule(application) {
  if (application === 'apps/backoffice') return 'BACKOFFICE_FRONTEND_RULES.md';
  if (application === 'apps/yuta-pos') return 'POS_FRONTEND_RULES.md';
  return undefined;
}

function listTree(root) {
  return collectPaths(root)
    .map((path) => relative(root, path).replaceAll('\\', '/'))
    .sort();
}

function collectPaths(root) {
  const paths = [];
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    const path = join(root, entry.name);
    paths.push(path);
    if (entry.isDirectory()) paths.push(...collectPaths(path));
  }
  return paths;
}

function isWithin(parent, child) {
  const relativePath = relative(parent, child);
  return (
    relativePath === '' ||
    (!relativePath.startsWith(`..${sep}`) && relativePath !== '..')
  );
}

function unquote(value) {
  if (!value) return value;
  return value.replace(/^`|`$/gu, '').trim();
}

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function issue(rule, path, detail) {
  return { rule, path, detail };
}
