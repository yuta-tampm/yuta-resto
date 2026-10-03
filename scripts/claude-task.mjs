// Bounded Claude Code task runner implementing the ADR-010 handoff procedure.
// It validates a sourced handoff, prepares one runner-owned Git worktree,
// dispatches Claude with exact tool permissions and retains raw evidence.
// Runner output is evidence for Codex; it never records a gate approval.
// Permission rules and the guard hook are Claude runtime controls, not an OS
// sandbox: an authorized command can itself write anywhere its process can.

import { spawn, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  appendFileSync,
  chmodSync,
  createWriteStream,
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  readlinkSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import {
  basename,
  delimiter,
  dirname,
  extname,
  isAbsolute,
  join,
  relative,
  resolve,
  sep,
} from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { z } from 'zod';
import {
  assertPlainPath,
  checkoutIdentity,
  verifyCheckoutBinding,
} from './task-checkout.mjs';

export const HANDOFF_SCHEMA_VERSION = 1;
export const COLLABORATION_MODES = [
  'CODEX_ONLY',
  'HUMAN_COLLABORATION',
  'CT_BRIDGE',
  'HUMAN_CT_BRIDGE',
];
export const WORKER_TOOLS = ['Read', 'Grep', 'Glob', 'Edit', 'Write', 'Bash'];
export const REVIEWER_TOOLS = ['Read', 'Grep', 'Glob'];
export const REVIEWER_AGENT = 'yuta-readonly-reviewer';
export const TEMPLATE_MARKER = 'REPLACE_WITH_';
export const DEPENDENCY_INSTALL_COMMAND = 'pnpm install --frozen-lockfile';
export const PRESERVATION_SCRIPT = 'scripts/check-format-preservation.mjs';

// Repository areas a worker may never receive in its write allowlist. The
// project settings deny edits to the same areas for every Claude session.
export const PROJECT_PROTECTED_PREFIXES = [
  '.git/',
  '.agents/',
  'openspec/',
  'docs/reviews/',
  'docs/archive/',
];
export const PROTECTED_EDIT_DENIALS = PROJECT_PROTECTED_PREFIXES.map(
  (prefix) => `Edit(./${prefix}**)`,
);

// Tool reads deny all environment filenames and credentials. Approved public
// environment templates are supplied through hash-bound handoff snapshots.
export const CREDENTIAL_READ_DENIALS = [
  'Read(//**/.env)',
  'Read(//**/.env.*)',
  'Read(//**/.private/**)',
  'Read(//**/.credentials.json)',
  'Read(//**/.claude/settings.local.json)',
  'Read(~/.claude/.credentials.json)',
  'Read(~/.ssh/**)',
  'Read(~/.aws/**)',
  'Read(~/.config/gh/**)',
];

// Only the presence of these names is inspected; values are never read.
export const PROVIDER_OVERRIDE_VARIABLES = [
  'ANTHROPIC_API_KEY',
  'ANTHROPIC_AUTH_TOKEN',
  'ANTHROPIC_BASE_URL',
  'CLAUDE_CODE_USE_BEDROCK',
  'CLAUDE_CODE_USE_VERTEX',
  'CLAUDE_CODE_USE_FOUNDRY',
];

const RUNNER_PATH = fileURLToPath(import.meta.url);
const READ_ONLY_TOOLS = new Set(REVIEWER_TOOLS);
const WRITE_TOOLS = new Set(['Edit', 'Write']);
const SANITIZED_AUTH_FIELDS = [
  'loggedIn',
  'authMethod',
  'apiProvider',
  'subscriptionType',
];
const DISPOSABLE_IGNORED_SEGMENTS = new Set([
  'node_modules',
  '.next',
  '.turbo',
  'dist',
  'coverage',
  'test-results',
  'playwright-report',
]);
const WINDOWS_RESERVED_NAME =
  /^(?:con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\..*)?$/iu;
// Paths emitted into permission rules avoid rule/glob syntax; other exact
// paths rely on the guard hook alone.
const RULE_SAFE_PATH = /^[A-Za-z0-9._@+/-]+$/u;
const RUNNER_LIMITATIONS = [
  'Permission rules and the guard hook are Claude runtime controls, not an OS sandbox; authorized commands can write effects of their own.',
  'Runner locks coordinate runner clients only; external processes and servers need explicit coordination.',
  'Runner output is evidence for the orchestrator, not a gate approval.',
];
const isWindows = process.platform === 'win32';

export class ClaudeTaskError extends Error {
  constructor(code, message, details = undefined) {
    super(message);
    this.name = 'ClaudeTaskError';
    this.code = code;
    this.details = details;
  }
}

// ---------------------------------------------------------------------------
// Handoff validation

// Exact repository-relative file paths. Ordinary spaces, Next.js route groups
// `(group)` and dynamic segments `[id]` are real filenames and stay valid.
export function describePathProblem(value) {
  if (/[\u0000-\u001f\u007f]/u.test(value))
    return 'contains control characters';
  if (value.includes('\\')) return 'must use forward slashes';
  if (value.startsWith('/') || value.startsWith('~')) {
    return 'must be repository-relative, not absolute';
  }
  if (value.includes(':')) {
    return 'must not contain a drive or alternate-data-stream separator';
  }
  if (/[*?{}]/u.test(value)) return 'must be exact, without wildcards';
  if (value.endsWith('/')) return 'must name a file, not a directory';
  const segments = value.split('/');
  for (const segment of segments) {
    if (segment === '' || segment === '.') {
      return 'contains an empty or current-directory segment';
    }
    if (segment === '..') return 'must not traverse outside the checkout';
    if (segment !== segment.trim() || segment.endsWith('.')) {
      return 'segments must not start or end with whitespace or end with a dot';
    }
    if (WINDOWS_RESERVED_NAME.test(segment)) {
      return 'uses a reserved Windows device name';
    }
    if (segment.toLowerCase() === '.git')
      return 'must not target Git internals';
  }
  return null;
}

export function isPrivateEnvironmentPath(path) {
  const name = path.split('/').at(-1).toLowerCase();
  return /^\.env(?:\..+)?$/u.test(name) && name !== '.env.example';
}

function isSensitiveReference(path) {
  return (
    isPrivateEnvironmentPath(path) ||
    path
      .split('/')
      .some((part) =>
        ['.private', '.ssh', '.aws'].includes(part.toLowerCase()),
      ) ||
    path.toLowerCase().endsWith('/.credentials.json') ||
    path.toLowerCase() === '.credentials.json' ||
    path.toLowerCase() === '.claude/settings.local.json'
  );
}

export function describeCommandProblem(value) {
  if (
    value !== value.trim() ||
    /\s{2,}|[^\S ]|[\u0000-\u001f\u007f]/u.test(value)
  ) {
    return 'must be trimmed with single ASCII spaces and no control characters';
  }
  if (/[*();&|`$<>"'\\\r\n]/u.test(value)) {
    return 'must be one exact command without wildcards, quoting, redirection or chaining';
  }
  const executableName = basename(value.split(' ')[0]).toLowerCase();
  if (/^(?:git|gh)(?:\.exe|\.cmd|\.bat)?$/u.test(executableName)) {
    return 'direct Git/GitHub commands belong to Codex; use supplied candidate evidence';
  }
  if (value === DEPENDENCY_INSTALL_COMMAND) {
    return 'dependency preparation belongs to the runner prepare step';
  }
  return null;
}

const nonEmptyText = z.string().trim().min(1);
const isNone = (value) => value.trim().toUpperCase() === 'NONE';
const sourcedText = nonEmptyText.refine((value) => !isNone(value), {
  message: 'must name the actual source; NONE grants nothing',
});
const exactPath = nonEmptyText.superRefine((value, context) => {
  const problem = describePathProblem(value);
  if (problem)
    context.addIssue({ code: z.ZodIssueCode.custom, message: problem });
});
const exactCommand = nonEmptyText.superRefine((value, context) => {
  const problem = describeCommandProblem(value);
  if (problem)
    context.addIssue({ code: z.ZodIssueCode.custom, message: problem });
});
const branchName = z
  .string()
  .regex(/^[A-Za-z0-9][A-Za-z0-9._/-]{0,199}$/u, 'invalid branch name')
  .refine(
    (value) =>
      !value.includes('..') &&
      !value.includes('//') &&
      !value.endsWith('/') &&
      !value.endsWith('.lock'),
    'invalid branch name',
  );

export const handoffSchema = z
  .object({
    schemaVersion: z.literal(HANDOFF_SCHEMA_VERSION),
    id: z
      .string()
      .regex(
        /^[a-z0-9][a-z0-9-]{0,62}$/u,
        'must be lowercase kebab-case (max 63 characters)',
      ),
    task: nonEmptyText,
    change: nonEmptyText,
    phase: nonEmptyText,
    goal: nonEmptyText,
    approvedReferences: z
      .array(
        z
          .object({
            path: exactPath,
            sha256: z.string().regex(/^[0-9a-f]{64}$/u, 'must be SHA-256 hex'),
          })
          .strict(),
      )
      .min(1),
    technicalContract: nonEmptyText,
    scope: nonEmptyText,
    exclusions: z.array(nonEmptyText),
    writeAllowlist: z.array(exactPath).min(1),
    protectedPaths: z.array(exactPath),
    collaborationMode: z.enum(COLLABORATION_MODES),
    modeSelectionSource: sourcedText,
    commitAfterTask: z.enum(['YES', 'NO', 'NOT_SELECTED']),
    commitSelectionSource: nonEmptyText,
    actors: z
      .object({
        orchestrator: nonEmptyText,
        implementationAuthor: nonEmptyText,
        integrationReviewer: nonEmptyText,
        independentReviewer: nonEmptyText,
        commitExecutor: nonEmptyText,
      })
      .strict(),
    checkout: z
      .object({
        branch: branchName,
        baseCommit: z
          .string()
          .regex(/^[0-9a-f]{40}$/u, 'must be a full 40-hex commit SHA'),
      })
      .strict(),
    requiredReading: z.array(exactPath).min(1),
    requiredChecks: z.array(exactCommand),
    preparation: z
      .object({ installDependencies: z.boolean(), effects: nonEmptyText })
      .strict(),
    authorizedCommands: z.array(
      z.object({ command: exactCommand, effects: nonEmptyText }).strict(),
    ),
    qa: z
      .object({
        app: nonEmptyText,
        env: nonEmptyText,
        ports: z.array(z.number().int().min(1).max(65535)),
        database: nonEmptyText.refine(
          (value) => isNone(value) || /^[A-Za-z0-9_.-]{1,63}$/u.test(value),
          'must be NONE or a plain database name',
        ),
        testDataRights: nonEmptyText,
      })
      .strict(),
    sharedResources: z.array(
      z
        .string()
        .regex(
          /^[a-z0-9][a-z0-9._-]{0,62}$/u,
          'must be a lowercase resource name',
        ),
    ),
    returnRequirements: z.array(nonEmptyText).min(1),
    limits: z
      .object({
        timeoutMinutes: z.number().int().min(1).max(240),
        maxTurns: z.number().int().min(1).max(500),
      })
      .strict(),
  })
  .strict()
  .superRefine((handoff, context) => {
    const issue = (path, message) =>
      context.addIssue({ code: z.ZodIssueCode.custom, path, message });
    const sameActor = (left, right) =>
      left.trim().toLowerCase() === right.trim().toLowerCase();

    for (const key of [
      'writeAllowlist',
      'protectedPaths',
      'requiredReading',
      'requiredChecks',
      'sharedResources',
    ]) {
      const seen = new Set();
      for (const value of handoff[key]) {
        if (seen.has(value)) issue([key], `duplicate entry ${value}`);
        seen.add(value);
      }
    }

    const protectedPaths = new Set(handoff.protectedPaths);
    for (const reference of handoff.approvedReferences) {
      if (isSensitiveReference(reference.path)) {
        issue(
          ['approvedReferences'],
          `${reference.path} is a private environment/credential path`,
        );
      }
    }
    for (const path of handoff.requiredReading) {
      if (isSensitiveReference(path)) {
        issue(
          ['requiredReading'],
          `${path} is a private environment/credential path`,
        );
      }
    }
    for (const path of handoff.writeAllowlist) {
      if (protectedPaths.has(path)) {
        issue(['writeAllowlist'], `${path} is also a protected path`);
      }
      if (
        PROJECT_PROTECTED_PREFIXES.some((prefix) => path.startsWith(prefix))
      ) {
        issue(['writeAllowlist'], `${path} is inside a project-protected area`);
      }
      if (isPrivateEnvironmentPath(path)) {
        issue(
          ['writeAllowlist'],
          `${path} is a private environment file; env preparation needs an authorized command`,
        );
      }
    }

    if (
      handoff.commitAfterTask !== 'NOT_SELECTED' &&
      isNone(handoff.commitSelectionSource)
    ) {
      issue(
        ['commitSelectionSource'],
        'a YES/NO commit choice needs its actual selection source',
      );
    }
    if (
      handoff.commitAfterTask !== 'YES' &&
      !isNone(handoff.actors.commitExecutor)
    ) {
      issue(
        ['actors', 'commitExecutor'],
        'must be NONE unless COMMIT_AFTER_TASK is YES',
      );
    }
    if (
      handoff.commitAfterTask === 'YES' &&
      (isNone(handoff.actors.commitExecutor) ||
        sameActor(
          handoff.actors.commitExecutor,
          handoff.actors.implementationAuthor,
        ))
    ) {
      issue(
        ['actors', 'commitExecutor'],
        'the runner never assigns commit delivery to the implementation author',
      );
    }
    for (const reviewerKey of ['implementationAuthor', 'integrationReviewer']) {
      if (
        sameActor(
          handoff.actors.independentReviewer,
          handoff.actors[reviewerKey],
        )
      ) {
        issue(
          ['actors', 'independentReviewer'],
          `must be uninvolved, not the ${reviewerKey}`,
        );
      }
    }

    const commands = new Set();
    for (const { command } of handoff.authorizedCommands) {
      if (commands.has(command)) {
        issue(['authorizedCommands'], `duplicate command ${command}`);
      }
      commands.add(command);
    }
    for (const check of handoff.requiredChecks) {
      if (!commands.has(check)) {
        issue(
          ['requiredChecks'],
          `${check} is not listed in authorizedCommands; listing a check grants nothing`,
        );
      }
    }

    if (isNone(handoff.qa.app)) {
      if (handoff.qa.ports.length > 0) {
        issue(['qa', 'ports'], 'ports require a QA app');
      }
      if (!isNone(handoff.qa.database)) {
        issue(['qa', 'database'], 'a database requires a QA app');
      }
      if (!isNone(handoff.qa.testDataRights)) {
        issue(['qa', 'testDataRights'], 'test-data rights require a QA app');
      }
    }
  });

function findTemplateMarkers(value, path = []) {
  if (typeof value === 'string') {
    return value.includes(TEMPLATE_MARKER) ? [path.join('.') || '(root)'] : [];
  }
  if (Array.isArray(value)) {
    return value.flatMap((item, index) =>
      findTemplateMarkers(item, [...path, String(index)]),
    );
  }
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([key, item]) =>
      findTemplateMarkers(item, [...path, key]),
    );
  }
  return [];
}

export function validateHandoff(value) {
  const problems = findTemplateMarkers(value).map(
    (path) =>
      `${path}: template placeholder; a template handoff is not authorized`,
  );
  const parsed = handoffSchema.safeParse(value);
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      problems.push(`${issue.path.join('.') || '(root)'}: ${issue.message}`);
    }
  }
  if (problems.length > 0) {
    throw new ClaudeTaskError(
      'INVALID_HANDOFF',
      `Handoff validation failed with ${problems.length} problem(s).`,
      problems,
    );
  }
  return parsed.data;
}

export function parseHandoffBytes(bytes) {
  let value;
  try {
    value = JSON.parse(bytes.toString('utf8'));
  } catch (error) {
    throw new ClaudeTaskError(
      'INVALID_HANDOFF',
      `Handoff is not valid JSON: ${error.message}`,
    );
  }
  return validateHandoff(value);
}

// ---------------------------------------------------------------------------
// Guard hook: exact Bash commands and exact write paths for worker sessions

const guardSchema = z
  .object({
    schemaVersion: z.literal(HANDOFF_SCHEMA_VERSION),
    task: z.string().min(1),
    identity: z
      .object({
        checkout: z.string(),
        gitDirectory: z.string(),
        commonDirectory: z.string(),
        branch: z.string(),
        head: z.string(),
      })
      .strict(),
    checkout: z.string().min(1),
    writeAllowlist: z.array(z.string().min(1)),
    protectedPaths: z.array(z.string().min(1)),
    commands: z.array(z.string().min(1)),
    decisionLog: z.string().min(1),
  })
  .strict();

const hookInputSchema = z
  .object({
    hook_event_name: z.literal('PreToolUse'),
    tool_name: z.string().min(1),
    tool_input: z.record(z.unknown()),
  })
  .passthrough();

// Returns the first existing path prefix that is a symbolic link or junction.
export function findLinkedSegment(root, relativePath) {
  const segments = relativePath.split('/');
  let current = root;
  for (let index = 0; index < segments.length; index += 1) {
    current = join(current, segments[index]);
    let stats;
    try {
      stats = lstatSync(current);
    } catch {
      return null;
    }
    if (stats.isSymbolicLink()) return segments.slice(0, index + 1).join('/');
    if (!stats.isDirectory()) return null;
  }
  return null;
}

function comparablePath(path) {
  return isWindows ? path.toLowerCase() : path;
}

function resolveWriteTarget(guard, filePath) {
  const absolute = isAbsolute(filePath)
    ? resolve(filePath)
    : resolve(guard.checkout, filePath);
  const local = relative(guard.checkout, absolute);
  if (
    !local ||
    local === '..' ||
    local.startsWith(`..${sep}`) ||
    isAbsolute(local)
  ) {
    return { problem: 'outside the task checkout' };
  }
  const path = local.split(sep).join('/');
  const problem = describePathProblem(path);
  if (problem) return { path, problem };
  const linked = findLinkedSegment(guard.checkout, path);
  if (linked) return { path, problem: `passes through linked path ${linked}` };
  return { path };
}

export function decideToolUse(guard, input) {
  const tool = input.tool_name;
  if (READ_ONLY_TOOLS.has(tool)) return { decision: 'defer', target: null };
  if (tool === 'Bash') {
    const command = input.tool_input.command;
    if (typeof command !== 'string') {
      return {
        decision: 'deny',
        target: null,
        reason: 'Bash input has no command.',
      };
    }
    if (input.tool_input.run_in_background === true) {
      return {
        decision: 'deny',
        target: command,
        reason:
          'Background commands are not authorized; owned processes must finish before returning.',
      };
    }
    return guard.commands.includes(command)
      ? {
          decision: 'allow',
          target: command,
          reason: 'Exact authorized command.',
        }
      : {
          decision: 'deny',
          target: command,
          reason: 'Not an exact authorized command from the handoff.',
        };
  }
  if (WRITE_TOOLS.has(tool)) {
    const filePath = input.tool_input.file_path;
    if (typeof filePath !== 'string') {
      return {
        decision: 'deny',
        target: null,
        reason: `${tool} input has no file_path.`,
      };
    }
    const target = resolveWriteTarget(guard, filePath);
    if (target.problem) {
      return {
        decision: 'deny',
        target: filePath,
        reason: `Write target ${target.problem}.`,
      };
    }
    const key = comparablePath(target.path);
    if (guard.protectedPaths.some((path) => comparablePath(path) === key)) {
      return {
        decision: 'deny',
        target: target.path,
        reason: 'Protected path.',
      };
    }
    return guard.writeAllowlist.some((path) => comparablePath(path) === key)
      ? {
          decision: 'allow',
          target: target.path,
          reason: 'Exact write allowlist path.',
        }
      : {
          decision: 'deny',
          target: target.path,
          reason: 'Not in the exact write allowlist.',
        };
  }
  return {
    decision: 'deny',
    target: null,
    reason: `${tool} is outside the worker tool pool.`,
  };
}

export function writeGuard({
  runDirectory,
  task,
  checkout,
  handoff,
  protectedPaths,
}) {
  const path = join(runDirectory, 'guard.json');
  const identity = checkoutIdentity(checkout);
  if (
    identity.branch !== handoff.checkout.branch ||
    identity.head !== handoff.checkout.baseCommit
  )
    throw new ClaudeTaskError(
      'CHECKOUT_IDENTITY',
      'Guard checkout does not match the handoff branch/base.',
    );
  const guard = {
    schemaVersion: HANDOFF_SCHEMA_VERSION,
    task,
    identity,
    checkout: realpathSync.native(checkout),
    writeAllowlist: handoff.writeAllowlist,
    protectedPaths,
    commands: handoff.authorizedCommands.map(({ command }) => command),
    decisionLog: join(runDirectory, 'hook-decisions.jsonl'),
  };
  const bytes = Buffer.from(`${JSON.stringify(guard, null, 2)}\n`);
  writeFileSync(path, bytes, { flag: 'wx' });
  chmodSync(path, 0o444);
  return { path, sha256: sha256(bytes), guard };
}

function shellSafePath(path) {
  const value = resolve(path).split('\\').join('/');
  if (/["$`%!\u0000-\u001f]/u.test(value)) {
    throw new ClaudeTaskError(
      'UNSAFE_PATH',
      `${value} cannot be quoted safely in the guard hook command.`,
    );
  }
  return value;
}

// Only runner-owned paths (Node, this script and the guard) enter the hook
// command; handoff source paths never do.
export function buildHookCommand({
  guardPath,
  guardSha256,
  nodePath = process.execPath,
  runnerPath = RUNNER_PATH,
}) {
  if (!/^[0-9a-f]{64}$/u.test(guardSha256)) {
    throw new ClaudeTaskError(
      'INVALID_GUARD',
      'Guard hash must be SHA-256 hex.',
    );
  }
  const [node, runner, guard] = [nodePath, runnerPath, guardPath].map(
    shellSafePath,
  );
  return `"${node}" "${runner}" hook --guard "${guard}" --sha256 ${guardSha256}`;
}

// Fails closed: any invalid argument, guard or input exits 2, which blocks the
// tool call.
export function hookMain(argv, stdinText) {
  try {
    const { values } = parseArgs({
      args: argv,
      options: { guard: { type: 'string' }, sha256: { type: 'string' } },
      strict: true,
      allowPositionals: false,
    });
    if (!values.guard || !values.sha256) {
      throw new ClaudeTaskError('USAGE', 'hook requires --guard and --sha256.');
    }
    const bytes = readFileSync(values.guard);
    if (sha256(bytes) !== values.sha256) {
      throw new ClaudeTaskError('GUARD_DRIFT', 'Guard metadata hash mismatch.');
    }
    const guard = guardSchema.parse(JSON.parse(bytes.toString('utf8')));
    const input = hookInputSchema.parse(JSON.parse(stdinText));
    if (!READ_ONLY_TOOLS.has(input.tool_name)) {
      verifyCheckoutBinding(guard.identity);
      if (input.tool_name === 'Edit' || input.tool_name === 'Write') {
        const filePath = input.tool_input.file_path;
        if (typeof filePath === 'string')
          assertPlainPath(
            isAbsolute(filePath) ? filePath : resolve(guard.checkout, filePath),
            { file: true },
          );
      }
    }
    const decision = decideToolUse(guard, input);
    appendFileSync(
      guard.decisionLog,
      `${JSON.stringify({
        at: new Date().toISOString(),
        tool: input.tool_name,
        target: decision.target,
        decision: decision.decision,
        reason: decision.reason ?? null,
      })}\n`,
    );
    if (decision.decision === 'defer')
      return { exitCode: 0, stdout: '', stderr: '' };
    return {
      exitCode: 0,
      stdout: `${JSON.stringify({
        hookSpecificOutput: {
          hookEventName: 'PreToolUse',
          permissionDecision: decision.decision,
          permissionDecisionReason: decision.reason,
        },
      })}\n`,
      stderr: '',
    };
  } catch (error) {
    return {
      exitCode: 2,
      stdout: '',
      stderr: `claude-task guard blocked the tool call: ${error.message}\n`,
    };
  }
}

// ---------------------------------------------------------------------------
// Claude settings, arguments and prompt

export function buildPermissionSettings(kind, handoff, { hookCommand } = {}) {
  const allow = [...REVIEWER_TOOLS];
  const deny = [...CREDENTIAL_READ_DENIALS, ...PROTECTED_EDIT_DENIALS];
  if (kind === 'worker') {
    if (!hookCommand) {
      throw new ClaudeTaskError(
        'INVALID_GUARD',
        'Worker runs require the guard hook.',
      );
    }
    allow.push(
      ...handoff.writeAllowlist
        .filter((path) => RULE_SAFE_PATH.test(path))
        .map((path) => `Edit(./${path})`),
      ...handoff.authorizedCommands.map(({ command }) => `Bash(${command})`),
    );
    deny.push(
      ...handoff.protectedPaths
        .filter((path) => RULE_SAFE_PATH.test(path))
        .map((path) => `Edit(./${path})`),
    );
    return {
      permissions: { allow, deny, defaultMode: 'dontAsk' },
      hooks: {
        PreToolUse: [
          {
            matcher: '*',
            hooks: [{ type: 'command', command: hookCommand, timeout: 30 }],
          },
        ],
      },
    };
  }
  if (kind === 'review') {
    deny.push(
      'Bash',
      'Edit',
      'Write',
      'NotebookEdit',
      'WebFetch',
      'WebSearch',
      'Agent',
    );
    // The reviewer runs no commands, including project hooks.
    return {
      permissions: { allow, deny, defaultMode: 'dontAsk' },
      disableAllHooks: true,
    };
  }
  throw new ClaudeTaskError('INVALID_KIND', `Unknown run kind ${kind}.`);
}

export function buildClaudeArguments({
  kind,
  handoff,
  agentAvailable = false,
  hookCommand,
}) {
  const tools = kind === 'review' ? REVIEWER_TOOLS : WORKER_TOOLS;
  const args = [
    '-p',
    '--tools',
    tools.join(','),
    '--permission-mode',
    'dontAsk',
    '--permission-prompts',
    'none',
    '--setting-sources',
    'project',
    '--strict-mcp-config',
    '--mcp-config',
    '{"mcpServers":{}}',
    '--no-chrome',
    '--disable-slash-commands',
    '--no-session-persistence',
    '--output-format',
    'stream-json',
    '--verbose',
    '--max-turns',
    String(handoff.limits.maxTurns),
    '--settings',
    JSON.stringify(buildPermissionSettings(kind, handoff, { hookCommand })),
  ];
  if (kind === 'review' && agentAvailable) args.push('--agent', REVIEWER_AGENT);
  return args;
}

function formatList(values) {
  return values.length === 0
    ? '  NONE'
    : values.map((v) => `  - ${v}`).join('\n');
}

export function buildPrompt({ kind, handoff, references, candidate }) {
  const lines = [];
  if (kind === 'worker') {
    lines.push(
      'You are the Claude Code implementation author for this bounded same-task handoff.',
      'Codex coordinates and integrates; your output is evidence, not an approval.',
      'Do not ask the collaboration-mode or commit questions again; they are inherited below.',
      'Edit only the write allowlist. Run only the authorized commands, exactly as written, one per Bash call.',
      'Do not stage, commit, push or change Git state. Do not read private environment files or credentials.',
      'Authorized commands must stop any server they start before returning.',
    );
  } else {
    lines.push(
      'You are an uninvolved read-only reviewer with fresh context for the candidate in this checkout.',
      'Inspect the candidate independently with Read, Grep and Glob only; do not rely on author reasoning.',
      'Return APPROVED, CHANGES_REQUESTED or BLOCKED with findings and the exact reviewed paths/hashes.',
      'Codex verifies and records any gate decision under the task mode; this run output is not an approval.',
    );
  }
  lines.push(
    '',
    `Task: ${handoff.task}`,
    `Change: ${handoff.change}`,
    `Phase: ${handoff.phase}`,
    `Goal: ${handoff.goal}`,
    `Technical implementation contract: ${handoff.technicalContract}`,
    `Scope: ${handoff.scope}`,
    `Exclusions:\n${formatList(handoff.exclusions)}`,
    `Write allowlist:\n${formatList(handoff.writeAllowlist)}`,
    `Protected paths:\n${formatList(handoff.protectedPaths)}`,
    `COLLABORATION_MODE: ${handoff.collaborationMode} (source: ${handoff.modeSelectionSource})`,
    `COMMIT_AFTER_TASK: ${handoff.commitAfterTask} (source: ${handoff.commitSelectionSource})`,
    `Actors: orchestrator ${handoff.actors.orchestrator}; implementation author ${handoff.actors.implementationAuthor}; integration reviewer ${handoff.actors.integrationReviewer}; independent reviewer ${handoff.actors.independentReviewer}; commit executor ${handoff.actors.commitExecutor}`,
    `Checkout: branch ${handoff.checkout.branch}; base commit ${handoff.checkout.baseCommit}`,
    `Required reading:\n${formatList(handoff.requiredReading)}`,
    `Required checks:\n${formatList(handoff.requiredChecks)}`,
    `Authorized commands:\n${formatList(
      handoff.authorizedCommands.map(
        (c) => `${c.command} (effects: ${c.effects})`,
      ),
    )}`,
    `QA: app ${handoff.qa.app}; env ${handoff.qa.env}; ports ${
      handoff.qa.ports.join(', ') || 'NONE'
    }; database ${handoff.qa.database}; test-data rights ${handoff.qa.testDataRights}`,
    `Shared resources:\n${formatList(handoff.sharedResources)}`,
    `Return requirements:\n${formatList(handoff.returnRequirements)}`,
  );
  if (candidate) {
    lines.push(
      '',
      `Candidate head: ${candidate.head}`,
      `Candidate changes relative to base:\n${formatList(
        candidate.files.map(
          (file) => `${file.path} ${file.sha256 ?? 'DELETED'}`,
        ),
      )}`,
    );
  }
  lines.push('', 'Approved reference snapshots (verified bytes):');
  for (const reference of references) {
    lines.push(
      `--- BEGIN ${reference.path} sha256=${reference.sha256} ---`,
      reference.content,
      `--- END ${reference.path} ---`,
    );
  }
  return `${lines.join('\n')}\n`;
}

// ---------------------------------------------------------------------------
// Claude runtime discovery and inspection

function isRegularFile(path) {
  try {
    return lstatSync(path).isFile();
  } catch {
    return false;
  }
}

function compareVersions(left, right) {
  const a = left.split('.').map(Number);
  const b = right.split('.').map(Number);
  for (let index = 0; index < 3; index += 1) {
    if (a[index] !== b[index]) return a[index] - b[index];
  }
  return 0;
}

function listDirectories(path) {
  try {
    // Dirent types use lstat semantics, so directory links are not followed.
    return readdirSync(path, { withFileTypes: true }).filter((entry) =>
      entry.isDirectory(),
    );
  } catch {
    return [];
  }
}

// Bounded Desktop layout:
// <Packages>/Claude_*/LocalCache/Roaming/Claude/claude-code/<version>/<hash>/claude.exe
export function findDesktopRuntime(packagesRoot) {
  const candidates = [];
  for (const packageEntry of listDirectories(packagesRoot)) {
    if (!/^Claude_[A-Za-z0-9]+$/u.test(packageEntry.name)) continue;
    const runtimeRoot = join(
      packagesRoot,
      packageEntry.name,
      'LocalCache',
      'Roaming',
      'Claude',
      'claude-code',
    );
    for (const versionEntry of listDirectories(runtimeRoot)) {
      if (!/^\d+\.\d+\.\d+$/u.test(versionEntry.name)) continue;
      const versionRoot = join(runtimeRoot, versionEntry.name);
      for (const hashEntry of listDirectories(versionRoot)) {
        const executable = join(versionRoot, hashEntry.name, 'claude.exe');
        if (isRegularFile(executable)) {
          candidates.push({ version: versionEntry.name, executable });
        }
      }
    }
  }
  if (candidates.length === 0) return null;
  candidates.sort((left, right) =>
    compareVersions(right.version, left.version),
  );
  const newest = candidates.filter(
    (candidate) => candidate.version === candidates[0].version,
  );
  if (newest.length > 1) {
    throw new ClaudeTaskError(
      'CLAUDE_AMBIGUOUS',
      `Several Desktop runtimes exist for version ${newest[0].version}; pass --claude explicitly.`,
    );
  }
  return newest[0].executable;
}

export function resolveClaudeExecutable({
  override,
  env = process.env,
  platform = process.platform,
} = {}) {
  const explicit = override ?? env.CLAUDE_TASK_EXECUTABLE;
  if (explicit) {
    const executable = resolve(explicit);
    if (!isRegularFile(executable)) {
      throw new ClaudeTaskError(
        'CLAUDE_NOT_FOUND',
        `Explicit Claude executable does not exist: ${executable}`,
      );
    }
    return executable;
  }
  const name = platform === 'win32' ? 'claude.exe' : 'claude';
  for (const directory of (env.PATH ?? env.Path ?? '').split(delimiter)) {
    if (!directory) continue;
    const candidate = join(directory, name);
    if (isRegularFile(candidate)) return candidate;
  }
  if (platform === 'win32' && env.LOCALAPPDATA) {
    const desktop = findDesktopRuntime(join(env.LOCALAPPDATA, 'Packages'));
    if (desktop) return desktop;
  }
  throw new ClaudeTaskError(
    'CLAUDE_NOT_FOUND',
    'Claude Code executable not found; pass --claude or set CLAUDE_TASK_EXECUTABLE.',
  );
}

// An explicit override may name a Node script; tests use this for a fake CLI.
function commandFor(executable, args) {
  return ['.mjs', '.js'].includes(extname(executable).toLowerCase())
    ? { file: process.execPath, args: [executable, ...args] }
    : { file: executable, args };
}

export function rejectProviderOverrides(env) {
  const present = PROVIDER_OVERRIDE_VARIABLES.filter(
    (name) => env[name] !== undefined && env[name] !== '',
  );
  if (present.length > 0) {
    throw new ClaudeTaskError(
      'PROVIDER_OVERRIDE_REJECTED',
      `Unset API-key/provider overrides for the subscription flow: ${present.join(', ')}.`,
    );
  }
}

export function sanitizeAuthStatus(value) {
  const sanitized = {};
  if (value && typeof value === 'object') {
    for (const field of SANITIZED_AUTH_FIELDS) {
      const item = value[field];
      if (['string', 'boolean'].includes(typeof item)) sanitized[field] = item;
    }
  }
  return sanitized;
}

function runCli(executable, args, env) {
  const { file, args: fullArgs } = commandFor(executable, args);
  const result = spawnSync(file, fullArgs, {
    encoding: 'utf8',
    env,
    timeout: 60_000,
    windowsHide: true,
  });
  if (result.error) {
    throw new ClaudeTaskError(
      'CLAUDE_START_FAILED',
      `Could not run Claude: ${result.error.message}`,
    );
  }
  return result;
}

export function inspectRuntime(executable, env = process.env) {
  rejectProviderOverrides(env);
  const versionResult = runCli(executable, ['--version'], env);
  const versionOutput = versionResult.stdout.trim();
  const versionMatch = /^(\d+\.\d+\.\d+)/u.exec(versionOutput);
  if (versionResult.status !== 0 || !versionMatch) {
    throw new ClaudeTaskError(
      'CLAUDE_VERSION_UNKNOWN',
      'Claude --version did not report a version.',
    );
  }
  const authResult = runCli(executable, ['auth', 'status'], env);
  let parsed;
  try {
    parsed = JSON.parse(authResult.stdout);
  } catch {
    // Raw output is not retained because it may contain account identifiers.
    throw new ClaudeTaskError(
      'AUTH_STATUS_UNPARSED',
      `Claude auth status was not JSON (exit ${authResult.status}); verify login manually.`,
    );
  }
  const auth = sanitizeAuthStatus(parsed);
  if (auth.loggedIn !== true) {
    throw new ClaudeTaskError('AUTH_REQUIRED', 'Claude is not logged in.');
  }
  if (/api.?key/iu.test(String(auth.authMethod ?? ''))) {
    throw new ClaudeTaskError(
      'API_KEY_AUTH_REJECTED',
      'API-key authentication is not used for this subscription flow.',
    );
  }
  if (auth.apiProvider !== undefined && auth.apiProvider !== 'firstParty') {
    throw new ClaudeTaskError(
      'PROVIDER_REJECTED',
      `Provider ${auth.apiProvider} is not used for this subscription flow.`,
    );
  }
  return { version: versionMatch[1], versionOutput, auth };
}

// ---------------------------------------------------------------------------
// Git, hashing and filesystem helpers

function sha256(bytes) {
  return createHash('sha256').update(bytes).digest('hex');
}

function git(cwd, args, { allowFailure = false, buffer = false } = {}) {
  const result = spawnSync(
    'git',
    ['-c', 'core.autocrlf=false', '-c', 'core.quotepath=false', ...args],
    {
      cwd,
      encoding: buffer ? 'buffer' : 'utf8',
      maxBuffer: 1024 * 1024 * 1024,
      windowsHide: true,
    },
  );
  if (result.error) throw result.error;
  if (result.status !== 0 && !allowFailure) {
    throw new ClaudeTaskError(
      'GIT_FAILED',
      `git ${args.join(' ')} failed: ${String(result.stderr).trim()}`,
    );
  }
  return result;
}

function gitLines(cwd, args) {
  return git(cwd, args)
    .stdout.split('\0')
    .filter((entry) => entry !== '');
}

function samePath(left, right) {
  const a = resolve(left);
  const b = resolve(right);
  return isWindows ? a.toLowerCase() === b.toLowerCase() : a === b;
}

function writeJson(path, value) {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

export function resolveRepositoryRoot(start = process.cwd()) {
  const result = git(start, ['rev-parse', '--show-toplevel'], {
    allowFailure: true,
  });
  if (result.status !== 0) {
    throw new ClaudeTaskError(
      'NOT_A_REPOSITORY',
      `${start} is not a Git checkout.`,
    );
  }
  return realpathSync.native(resolve(result.stdout.trim()));
}

function gitCommonDirectory(cwd) {
  return resolve(
    git(cwd, [
      'rev-parse',
      '--path-format=absolute',
      '--git-common-dir',
    ]).stdout.trim(),
  );
}

// Raw-byte preservation bindings recorded at the base commit.
export function readPreservationBindings(repositoryRoot, baseCommit) {
  const result = git(
    repositoryRoot,
    ['show', `${baseCommit}:${PRESERVATION_SCRIPT}`],
    {
      allowFailure: true,
    },
  );
  if (result.status !== 0) return [];
  return [...result.stdout.matchAll(/^\s*path:\s*'([^']+)',?\s*$/gmu)].map(
    (match) => match[1],
  );
}

export function taskPaths(repositoryRoot, id) {
  assertTaskId(id);
  const tasksRoot = join(repositoryRoot, 'exports', 'claude-tasks');
  const taskRoot = join(tasksRoot, id);
  assertPlainOwnedDirectory(repositoryRoot, 'exports/claude-tasks');
  assertPlainOwnedDirectory(repositoryRoot, `exports/claude-tasks/${id}`);
  assertPlainOwnedDirectory(
    repositoryRoot,
    `exports/claude-tasks/${id}/evidence`,
  );
  const commonDirectory = realpathSync.native(
    gitCommonDirectory(repositoryRoot),
  );
  assertPlainOwnedDirectory(commonDirectory, 'yuta-claude-task-locks');
  return {
    tasksRoot,
    taskRoot,
    checkout: join(taskRoot, 'checkout'),
    evidence: join(taskRoot, 'evidence'),
    locks: join(commonDirectory, 'yuta-claude-task-locks'),
    state: join(taskRoot, 'evidence', 'state.json'),
  };
}

// Check every existing parent before creating any evidence or worktree.
function assertPlainOwnedDirectory(root, localPath) {
  let current = root;
  for (const segment of localPath.split('/')) {
    current = join(current, segment);
    let stats;
    try {
      stats = lstatSync(current);
    } catch (error) {
      if (error.code === 'ENOENT') return;
      throw error;
    }
    if (
      stats.isSymbolicLink() ||
      !stats.isDirectory() ||
      !samePath(realpathSync.native(current), current)
    ) {
      throw new ClaudeTaskError(
        'UNSAFE_PATH',
        `Owned directory is linked or not plain: ${current}`,
      );
    }
  }
}

function assertTaskId(id) {
  if (typeof id !== 'string' || !/^[a-z0-9][a-z0-9-]{0,62}$/u.test(id)) {
    throw new ClaudeTaskError(
      'INVALID_TASK_ID',
      'Pass a valid --task identifier.',
    );
  }
}

function assertWritePathsSafe(checkout, handoff, bindings) {
  const bound = new Set(bindings);
  for (const path of handoff.writeAllowlist) {
    if (bound.has(path)) {
      throw new ClaudeTaskError(
        'PROTECTED_WRITE_PATH',
        `${path} is bound by ${PRESERVATION_SCRIPT}; its raw bytes are protected.`,
      );
    }
    const linked = findLinkedSegment(checkout, path);
    if (linked) {
      throw new ClaudeTaskError(
        'UNSAFE_PATH',
        `${path} passes through linked path ${linked} in the checkout.`,
      );
    }
  }
}

// Raw-byte snapshot of tracked files plus untracked, non-ignored files.
export function snapshotCheckout(checkout) {
  const head = git(checkout, ['rev-parse', 'HEAD']).stdout.trim();
  const paths = new Set([
    ...gitLines(checkout, ['ls-files', '-z']),
    ...gitLines(checkout, ['ls-files', '-z', '--others', '--exclude-standard']),
  ]);
  const files = {};
  for (const path of [...paths].sort()) {
    const absolute = join(checkout, ...path.replace(/\/$/u, '').split('/'));
    let stats;
    try {
      stats = lstatSync(absolute);
    } catch {
      files[path] = null;
      continue;
    }
    if (stats.isSymbolicLink())
      files[path] = `link:${sha256(readlinkSync(absolute))}`;
    else if (stats.isFile()) files[path] = sha256(readFileSync(absolute));
    else files[path] = 'directory';
  }
  const indexSha256 = sha256(
    git(checkout, ['ls-files', '--stage', '-z'], { buffer: true }).stdout,
  );
  return { head, indexSha256, files };
}

export function compareSnapshots(before, after) {
  const changed = [];
  const paths = new Set([
    ...Object.keys(before.files),
    ...Object.keys(after.files),
  ]);
  for (const path of [...paths].sort()) {
    const left = before.files[path] ?? null;
    const right = after.files[path] ?? null;
    if (left !== right) changed.push({ path, before: left, after: right });
  }
  return {
    headChanged: before.head !== after.head,
    indexChanged: before.indexSha256 !== after.indexSha256,
    changed,
  };
}

function candidateFiles(checkout, baseCommit, snapshot) {
  const paths = new Set([
    ...gitLines(checkout, [
      'diff',
      '--name-only',
      '-z',
      '--no-renames',
      baseCommit,
    ]),
    ...gitLines(checkout, ['ls-files', '-z', '--others', '--exclude-standard']),
  ]);
  return [...paths]
    .sort()
    .map((path) => ({ path, sha256: snapshot.files[path] ?? null }));
}

function writeCandidateEvidence(runDirectory, checkout, baseCommit, snapshot) {
  const diff = git(checkout, ['diff', '--binary', '--no-renames', baseCommit], {
    buffer: true,
  }).stdout;
  writeFileSync(join(runDirectory, 'diff.patch'), diff);
  const newFiles = [];
  for (const path of gitLines(checkout, [
    'ls-files',
    '-z',
    '--others',
    '--exclude-standard',
  ])) {
    const segments = path.replace(/\/$/u, '').split('/');
    const source = join(checkout, ...segments);
    if (!isRegularFile(source)) {
      newFiles.push({ path, sha256: null, note: 'not a regular file' });
      continue;
    }
    const bytes = readFileSync(source);
    const target = join(runDirectory, 'new-files', ...segments);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, bytes);
    newFiles.push({ path, sha256: sha256(bytes), bytes: bytes.length });
  }
  const candidate = {
    baseCommit,
    head: snapshot.head,
    diffSha256: sha256(diff),
    files: candidateFiles(checkout, baseCommit, snapshot),
    newFiles,
  };
  writeJson(join(runDirectory, 'candidate.json'), candidate);
  return candidate;
}

// ---------------------------------------------------------------------------
// Locks

export function lockNames(handoff) {
  const names = [`task-${handoff.id}`];
  for (const port of handoff.qa.ports) names.push(`port-${port}`);
  if (!isNone(handoff.qa.database)) {
    names.push(`db-${handoff.qa.database.toLowerCase()}`);
  }
  for (const resource of handoff.sharedResources)
    names.push(`resource-${resource}`);
  return names;
}

// Atomic exclusive files; an existing lock stops the operation and is never
// removed on another runner's behalf.
export function acquireLocks(locksRoot, names, owner) {
  mkdirSync(locksRoot, { recursive: true });
  const token = JSON.stringify({
    ...owner,
    pid: process.pid,
    acquiredAt: new Date().toISOString(),
  });
  const acquired = [];
  const release = () => {
    for (const lockPath of acquired.splice(0)) {
      if (existsSync(lockPath) && readFileSync(lockPath, 'utf8') === token) {
        rmSync(lockPath);
      }
    }
  };
  try {
    for (const name of names) {
      const lockPath = join(locksRoot, `${name}.lock`);
      try {
        writeFileSync(lockPath, token, { flag: 'wx' });
      } catch (error) {
        if (error.code === 'EEXIST') {
          throw new ClaudeTaskError(
            'RESOURCE_LOCKED',
            `${name} is held by another runner operation (${lockPath}); it was not removed.`,
          );
        }
        throw error;
      }
      acquired.push(lockPath);
    }
  } catch (error) {
    release();
    throw error;
  }
  return release;
}

function locksForTask(locksRoot, id) {
  const held = [];
  for (const entry of existsSync(locksRoot) ? readdirSync(locksRoot) : []) {
    if (!entry.endsWith('.lock')) continue;
    let owner = null;
    try {
      owner = readJson(join(locksRoot, entry));
    } catch {
      owner = null;
    }
    if (entry === `task-${id}.lock` || owner?.task === id) {
      held.push({ name: entry.replace(/\.lock$/u, ''), owner });
    }
  }
  return held;
}

// ---------------------------------------------------------------------------
// prepare

function readReferences(repositoryRoot, handoff) {
  return handoff.approvedReferences.map((reference, index) => {
    const source = join(repositoryRoot, ...reference.path.split('/'));
    if (findLinkedSegment(repositoryRoot, reference.path)) {
      throw new ClaudeTaskError(
        'UNSAFE_PATH',
        `Approved reference crosses a linked path: ${reference.path}`,
      );
    }
    if (!isRegularFile(source)) {
      throw new ClaudeTaskError(
        'REFERENCE_MISSING',
        `Approved reference ${reference.path} is missing.`,
      );
    }
    const bytes = readFileSync(source);
    if (sha256(bytes) !== reference.sha256) {
      throw new ClaudeTaskError(
        'REFERENCE_MISMATCH',
        `Approved reference ${reference.path} does not match its recorded SHA-256.`,
      );
    }
    const snapshot = `${String(index + 1).padStart(2, '0')}-${basename(reference.path)}`;
    return { ...reference, snapshot, bytes };
  });
}

function runDependencyInstall(checkout, logPath) {
  // Constant command without interpolation; Windows needs a shell for pnpm.cmd.
  const result = isWindows
    ? spawnSync(DEPENDENCY_INSTALL_COMMAND, {
        cwd: checkout,
        shell: true,
        encoding: 'utf8',
        windowsHide: true,
        maxBuffer: 256 * 1024 * 1024,
      })
    : spawnSync('pnpm', ['install', '--frozen-lockfile'], {
        cwd: checkout,
        encoding: 'utf8',
        maxBuffer: 256 * 1024 * 1024,
      });
  writeFileSync(
    logPath,
    `$ ${DEPENDENCY_INSTALL_COMMAND}\nexit: ${result.status}\n--- stdout ---\n${result.stdout ?? ''}\n--- stderr ---\n${result.stderr ?? ''}${result.error ? `\n--- error ---\n${result.error.message}` : ''}\n`,
  );
  return result.status === 0 && !result.error;
}

function checkoutIsCleanBase(checkout, baseCommit) {
  const head = git(checkout, ['rev-parse', 'HEAD']).stdout.trim();
  const dirty = git(checkout, [
    '--no-optional-locks',
    'status',
    '--porcelain=v1',
    '-z',
    '--untracked-files=all',
  ]).stdout;
  return head === baseCommit && dirty === '';
}

export function prepareTask({ handoffPath, repositoryRoot: start } = {}) {
  if (!handoffPath) {
    throw new ClaudeTaskError('USAGE', 'prepare requires --handoff <file>.');
  }
  const handoffBytes = readFileSync(handoffPath);
  const handoff = parseHandoffBytes(handoffBytes);
  const repositoryRoot = resolveRepositoryRoot(start);
  const paths = taskPaths(repositoryRoot, handoff.id);

  const ignored = git(
    repositoryRoot,
    ['check-ignore', '-q', 'exports/claude-tasks/ownership-probe'],
    { allowFailure: true },
  );
  if (ignored.status !== 0) {
    throw new ClaudeTaskError(
      'TASKS_DIRECTORY_NOT_IGNORED',
      'exports/claude-tasks must be ignored by Git before preparing a task.',
    );
  }
  const { branch, baseCommit } = handoff.checkout;
  if (
    git(repositoryRoot, ['check-ref-format', '--branch', branch], {
      allowFailure: true,
    }).status !== 0
  ) {
    throw new ClaudeTaskError(
      'INVALID_BRANCH',
      `${branch} is not a valid branch name.`,
    );
  }
  if (
    git(
      repositoryRoot,
      ['show-ref', '--verify', '--quiet', `refs/heads/${branch}`],
      {
        allowFailure: true,
      },
    ).status === 0
  ) {
    throw new ClaudeTaskError(
      'BRANCH_EXISTS',
      `Branch ${branch} already exists.`,
    );
  }
  const resolvedBase = git(
    repositoryRoot,
    ['rev-parse', '--verify', '--quiet', `${baseCommit}^{commit}`],
    { allowFailure: true },
  ).stdout.trim();
  if (resolvedBase !== baseCommit) {
    throw new ClaudeTaskError(
      'BASE_NOT_FOUND',
      `Base commit ${baseCommit} does not exist.`,
    );
  }
  const bindings = readPreservationBindings(repositoryRoot, baseCommit);
  const boundWrite = handoff.writeAllowlist.find((path) =>
    bindings.includes(path),
  );
  if (boundWrite) {
    throw new ClaudeTaskError(
      'PROTECTED_WRITE_PATH',
      `${boundWrite} is bound by ${PRESERVATION_SCRIPT}; its raw bytes are protected.`,
    );
  }
  const references = readReferences(repositoryRoot, handoff);

  // Creating the task directory is the atomic ownership claim.
  mkdirSync(paths.tasksRoot, { recursive: true });
  try {
    mkdirSync(paths.taskRoot);
  } catch (error) {
    if (error.code === 'EEXIST') {
      throw new ClaudeTaskError(
        'TASK_EXISTS',
        `Task ${handoff.id} already exists.`,
      );
    }
    throw error;
  }
  mkdirSync(join(paths.evidence, 'references'), { recursive: true });
  writeFileSync(join(paths.evidence, 'handoff.json'), handoffBytes);
  const manifest = references.map(({ bytes, ...reference }) => {
    writeFileSync(
      join(paths.evidence, 'references', reference.snapshot),
      bytes,
    );
    return reference;
  });
  writeJson(join(paths.evidence, 'references.json'), manifest);

  const state = {
    schemaVersion: HANDOFF_SCHEMA_VERSION,
    id: handoff.id,
    repositoryRoot,
    checkout: paths.checkout,
    branch,
    baseCommit,
    handoffSha256: sha256(handoffBytes),
    referencesSha256: sha256(
      readFileSync(join(paths.evidence, 'references.json')),
    ),
    preservationBindings: bindings.length,
    status: 'PREPARING',
    preparedAt: new Date().toISOString(),
    dependencyInstall: handoff.preparation.installDependencies
      ? 'PENDING'
      : 'NOT_AUTHORIZED',
    runs: [],
  };
  writeJson(paths.state, state);

  const fail = (code, message) => {
    state.status = 'PREPARE_FAILED';
    state.failure = { code, message };
    writeJson(paths.state, state);
    throw new ClaudeTaskError(code, message);
  };

  // core.autocrlf=false keeps the initial checkout byte-identical to Git blobs.
  const added = git(
    repositoryRoot,
    ['worktree', 'add', '-b', branch, paths.checkout, baseCommit],
    { allowFailure: true },
  );
  writeFileSync(
    join(paths.evidence, 'worktree-add.log'),
    `${added.stdout}\n${added.stderr}\nexit: ${added.status}\n`,
  );
  if (added.status !== 0) {
    fail('WORKTREE_FAILED', 'git worktree add failed; see worktree-add.log.');
  }
  if (!checkoutIsCleanBase(paths.checkout, baseCommit)) {
    fail('CHECKOUT_DIRTY', 'Prepared checkout is not a clean base checkout.');
  }
  try {
    assertWritePathsSafe(paths.checkout, handoff, bindings);
  } catch (error) {
    fail(error.code, error.message);
  }
  if (handoff.preparation.installDependencies) {
    const installed = runDependencyInstall(
      paths.checkout,
      join(paths.evidence, 'dependency-install.log'),
    );
    state.dependencyInstall = installed ? 'SUCCEEDED' : 'FAILED';
    if (!installed) {
      fail(
        'DEPENDENCY_INSTALL_FAILED',
        'Dependency install failed; see dependency-install.log.',
      );
    }
    if (!checkoutIsCleanBase(paths.checkout, baseCommit)) {
      fail('CHECKOUT_DIRTY', 'Dependency install changed non-ignored files.');
    }
  }
  state.status = 'PREPARED';
  writeJson(paths.state, state);
  return state;
}

// ---------------------------------------------------------------------------
// run / review

export function loadTask(repositoryRoot, id) {
  assertTaskId(id);
  const paths = taskPaths(repositoryRoot, id);
  if (!existsSync(paths.state)) {
    throw new ClaudeTaskError(
      'TASK_NOT_FOUND',
      `Task ${id} has no runner state.`,
    );
  }
  const state = readJson(paths.state);
  if (state.id !== id || !samePath(state.checkout, paths.checkout)) {
    throw new ClaudeTaskError(
      'STATE_MISMATCH',
      'Runner state does not match its owned task path.',
    );
  }
  const handoffBytes = readFileSync(join(paths.evidence, 'handoff.json'));
  if (sha256(handoffBytes) !== state.handoffSha256) {
    throw new ClaudeTaskError(
      'HANDOFF_DRIFT',
      'Frozen handoff bytes changed after prepare.',
    );
  }
  const handoff = parseHandoffBytes(handoffBytes);
  const manifestPath = join(paths.evidence, 'references.json');
  if (sha256(readFileSync(manifestPath)) !== state.referencesSha256) {
    throw new ClaudeTaskError(
      'REFERENCE_DRIFT',
      'Reference manifest changed after prepare.',
    );
  }
  const references = readJson(manifestPath).map((reference) => {
    const bytes = readFileSync(
      join(paths.evidence, 'references', reference.snapshot),
    );
    const original = join(repositoryRoot, ...reference.path.split('/'));
    if (
      sha256(bytes) !== reference.sha256 ||
      !isRegularFile(original) ||
      sha256(readFileSync(original)) !== reference.sha256
    ) {
      throw new ClaudeTaskError(
        'REFERENCE_DRIFT',
        `Approved reference ${reference.path} no longer matches its recorded hash.`,
      );
    }
    return { ...reference, content: bytes.toString('utf8') };
  });
  return { paths, state, handoff, references };
}

function verifyCheckoutIdentity(repositoryRoot, state) {
  const { checkout } = state;
  let stats;
  try {
    stats = lstatSync(checkout);
  } catch {
    throw new ClaudeTaskError(
      'CHECKOUT_MISSING',
      `Owned checkout ${checkout} is missing.`,
    );
  }
  if (stats.isSymbolicLink() || !stats.isDirectory()) {
    throw new ClaudeTaskError(
      'UNSAFE_PATH',
      'Owned checkout is not a plain directory.',
    );
  }
  const expected = join(
    repositoryRoot,
    'exports',
    'claude-tasks',
    state.id,
    'checkout',
  );
  if (!samePath(realpathSync.native(checkout), expected)) {
    throw new ClaudeTaskError(
      'UNSAFE_PATH',
      'Owned checkout resolves outside its recorded path.',
    );
  }
  const top = resolve(
    git(checkout, ['rev-parse', '--show-toplevel']).stdout.trim(),
  );
  if (!samePath(realpathSync.native(top), expected)) {
    throw new ClaudeTaskError(
      'CHECKOUT_IDENTITY',
      'Checkout is not its own Git worktree.',
    );
  }
  if (
    !samePath(gitCommonDirectory(checkout), gitCommonDirectory(repositoryRoot))
  ) {
    throw new ClaudeTaskError(
      'CHECKOUT_IDENTITY',
      'Checkout belongs to another repository.',
    );
  }
  const branch = git(checkout, ['symbolic-ref', '--short', 'HEAD'], {
    allowFailure: true,
  }).stdout.trim();
  if (branch !== state.branch) {
    throw new ClaudeTaskError(
      'CHECKOUT_IDENTITY',
      `Checkout is not on ${state.branch}.`,
    );
  }
  if (
    git(checkout, ['merge-base', '--is-ancestor', state.baseCommit, 'HEAD'], {
      allowFailure: true,
    }).status !== 0
  ) {
    throw new ClaudeTaskError(
      'CHECKOUT_IDENTITY',
      'Checkout HEAD does not descend from the base.',
    );
  }
}

// A project setting that disables hooks would silently remove the guard.
function assertHooksEnabled(checkout) {
  const settingsPath = join(checkout, '.claude', 'settings.json');
  if (!existsSync(settingsPath)) return;
  let settings;
  try {
    settings = readJson(settingsPath);
  } catch {
    throw new ClaudeTaskError(
      'PROJECT_SETTINGS_INVALID',
      'Checkout .claude/settings.json is not valid JSON.',
    );
  }
  if (settings?.disableAllHooks === true) {
    throw new ClaudeTaskError(
      'HOOKS_DISABLED',
      'Checkout project settings disable the guard hook.',
    );
  }
}

export function parseClaudeStream(text) {
  let init = null;
  let result = null;
  const toolUses = [];
  const toolErrors = new Map();
  for (const line of text.split(/\r?\n/u)) {
    if (!line.trim()) continue;
    let event;
    try {
      event = JSON.parse(line);
    } catch {
      continue;
    }
    if (event.type === 'system' && event.subtype === 'init') init = event;
    if (event.type === 'result') result = event;
    if (!Array.isArray(event.message?.content)) continue;
    for (const item of event.message.content) {
      if (event.type === 'assistant' && item?.type === 'tool_use') {
        const input = item.input ?? {};
        toolUses.push({
          id: item.id ?? null,
          name: item.name,
          target:
            input.command ??
            input.file_path ??
            input.pattern ??
            input.path ??
            null,
        });
      }
      if (event.type === 'user' && item?.type === 'tool_result') {
        toolErrors.set(item.tool_use_id, item.is_error === true);
      }
    }
  }
  for (const use of toolUses) {
    use.isError = toolErrors.has(use.id) ? toolErrors.get(use.id) : null;
  }
  return { init, result, toolUses };
}

function readDecisions(path) {
  if (!path || !existsSync(path)) return [];
  return readFileSync(path, 'utf8')
    .split(/\r?\n/u)
    .filter(Boolean)
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch {
        return { invalid: line };
      }
    });
}

function spawnClaude({
  executable,
  args,
  cwd,
  env,
  input,
  timeoutMs,
  stdoutPath,
  stderrPath,
}) {
  return new Promise((resolvePromise) => {
    const { file, args: fullArgs } = commandFor(executable, args);
    const startedAt = new Date().toISOString();
    const child = spawn(file, fullArgs, {
      cwd,
      env,
      windowsHide: true,
      detached: !isWindows,
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    const stdout = createWriteStream(stdoutPath);
    const stderr = createWriteStream(stderrPath);
    child.stdout.pipe(stdout);
    child.stderr.pipe(stderr);
    child.stdin.on('error', () => {});
    child.stdin.end(input);
    let timedOut = false;
    let startError = null;
    const timer = setTimeout(() => {
      timedOut = true;
      if (isWindows) {
        spawnSync('taskkill', ['/PID', String(child.pid), '/T', '/F'], {
          windowsHide: true,
          stdio: 'ignore',
        });
      } else {
        try {
          process.kill(-child.pid, 'SIGKILL');
        } catch {
          child.kill('SIGKILL');
        }
      }
    }, timeoutMs);
    child.on('error', (error) => {
      startError = error.message;
    });
    child.on('close', (exitCode, signal) => {
      clearTimeout(timer);
      let pending = 2;
      const done = () => {
        pending -= 1;
        if (pending === 0) {
          resolvePromise({
            startedAt,
            endedAt: new Date().toISOString(),
            exitCode,
            signal,
            timedOut,
            startError,
          });
        }
      };
      stdout.end(done);
      stderr.end(done);
    });
  });
}

function findViolations({ kind, handoff, changes, stream, decisions }) {
  const violations = [];
  if (changes.indexChanged) {
    violations.push({
      rule: 'INDEX_CHANGED',
      detail: 'Claude changed staging state; staging is not assigned.',
    });
  }
  if (changes.headChanged) {
    violations.push({
      rule: 'HEAD_CHANGED',
      detail: 'Claude changed HEAD; commit delivery is not assigned.',
    });
  }
  const allowed = new Set(kind === 'worker' ? handoff.writeAllowlist : []);
  const protectedPaths = new Set(handoff.protectedPaths);
  for (const { path } of changes.changed) {
    if (protectedPaths.has(path)) {
      violations.push({ rule: 'PROTECTED_PATH_CHANGED', path });
    } else if (!allowed.has(path)) {
      violations.push({
        rule:
          kind === 'review'
            ? 'REVIEW_CHANGED_FILES'
            : 'OUTSIDE_WRITE_ALLOWLIST',
        path,
      });
    }
  }
  const pool = new Set(kind === 'review' ? REVIEWER_TOOLS : WORKER_TOOLS);
  for (const tool of stream.init?.tools ?? []) {
    if (!pool.has(tool))
      violations.push({ rule: 'UNEXPECTED_TOOL_POOL', tool });
  }
  if ((stream.init?.mcp_servers ?? []).length > 0) {
    violations.push({ rule: 'UNEXPECTED_MCP_SERVERS' });
  }
  for (const use of stream.toolUses) {
    if (!pool.has(use.name))
      violations.push({ rule: 'UNEXPECTED_TOOL_USE', tool: use.name });
  }
  if (kind === 'worker') {
    const commands = new Set(
      handoff.authorizedCommands.map(({ command }) => command),
    );
    for (const use of stream.toolUses) {
      // A missing result is not proof of denial.
      if (
        use.name === 'Bash' &&
        !commands.has(use.target) &&
        use.isError !== true
      ) {
        violations.push({
          rule: 'UNAUTHORIZED_COMMAND_EXECUTED',
          command: use.target,
        });
      }
    }
    const guarded = stream.toolUses.some(
      (use) => use.name === 'Bash' || WRITE_TOOLS.has(use.name),
    );
    if (guarded && decisions.length === 0) {
      violations.push({ rule: 'GUARD_HOOK_NOT_OBSERVED' });
    }
  }
  return violations;
}

export async function runTask({
  repositoryRoot: start,
  id,
  kind,
  claude,
  env = process.env,
  timeoutMs,
} = {}) {
  if (!['worker', 'review'].includes(kind)) {
    throw new ClaudeTaskError('INVALID_KIND', `Unknown run kind ${kind}.`);
  }
  const repositoryRoot = resolveRepositoryRoot(start);
  assertTaskId(id);
  const paths = taskPaths(repositoryRoot, id);
  if (!existsSync(paths.state)) {
    throw new ClaudeTaskError(
      'TASK_NOT_FOUND',
      `Task ${id} has no runner state.`,
    );
  }
  const handoffForLocks = parseHandoffBytes(
    readFileSync(join(paths.evidence, 'handoff.json')),
  );
  if (handoffForLocks.id !== id) {
    throw new ClaudeTaskError(
      'STATE_MISMATCH',
      'Frozen handoff does not belong to this task.',
    );
  }
  const release = acquireLocks(paths.locks, lockNames(handoffForLocks), {
    task: id,
    operation: kind,
  });
  try {
    // Everything below is serialized by the task lock and re-verified.
    const { state, handoff, references } = loadTask(repositoryRoot, id);
    if (
      state.status !== 'PREPARED' &&
      !/^(WORKER|REVIEW)_/u.test(state.status)
    ) {
      throw new ClaudeTaskError(
        'TASK_NOT_RUNNABLE',
        `Task ${id} is ${state.status}.`,
      );
    }
    verifyCheckoutIdentity(repositoryRoot, state);
    const before = snapshotCheckout(state.checkout);
    const previous = state.runs.at(-1);
    let driftSincePreviousRun = [];
    if (previous) {
      const recorded = readJson(
        join(paths.evidence, previous.directory, 'after.json'),
      );
      const drift = compareSnapshots(recorded, before);
      driftSincePreviousRun = drift.changed.map((change) => change.path);
      if (
        kind === 'worker' &&
        (drift.headChanged || drift.indexChanged || drift.changed.length > 0)
      ) {
        throw new ClaudeTaskError(
          'CANDIDATE_DRIFT',
          'Checkout changed since the last recorded run; record or integrate it before another worker run.',
          driftSincePreviousRun,
        );
      }
    } else if (
      kind === 'worker' &&
      (before.head !== state.baseCommit ||
        candidateFiles(state.checkout, state.baseCommit, before).length > 0)
    ) {
      throw new ClaudeTaskError(
        'CHECKOUT_NOT_CLEAN',
        'The first worker run needs a clean base checkout.',
      );
    }

    const executable = resolveClaudeExecutable({ override: claude, env });
    const runtime = inspectRuntime(executable, env);
    const sequence = state.runs.length + 1;
    const directory = `runs/${String(sequence).padStart(3, '0')}-${kind}`;
    const runDirectory = join(paths.evidence, ...directory.split('/'));
    mkdirSync(runDirectory, { recursive: true });

    let guard = null;
    if (kind === 'worker') {
      assertHooksEnabled(state.checkout);
      const bindings = readPreservationBindings(
        repositoryRoot,
        state.baseCommit,
      );
      assertWritePathsSafe(state.checkout, handoff, bindings);
      guard = writeGuard({
        runDirectory,
        task: id,
        checkout: state.checkout,
        handoff,
        protectedPaths: [...new Set([...handoff.protectedPaths, ...bindings])],
      });
    }
    const candidateBefore =
      kind === 'review'
        ? {
            head: before.head,
            files: candidateFiles(state.checkout, state.baseCommit, before),
          }
        : null;
    const agentAvailable =
      kind === 'review' &&
      isRegularFile(
        join(state.checkout, '.claude', 'agents', `${REVIEWER_AGENT}.md`),
      );
    const hookCommand = guard
      ? buildHookCommand({ guardPath: guard.path, guardSha256: guard.sha256 })
      : undefined;
    const args = buildClaudeArguments({
      kind,
      handoff,
      agentAvailable,
      hookCommand,
    });
    const prompt = buildPrompt({
      kind,
      handoff,
      references,
      candidate: candidateBefore,
    });
    writeJson(join(runDirectory, 'before.json'), before);
    writeFileSync(join(runDirectory, 'prompt.txt'), prompt);
    writeJson(join(runDirectory, 'runtime.json'), { executable, ...runtime });
    writeJson(join(runDirectory, 'arguments.json'), args);

    const processResult = await spawnClaude({
      executable,
      args,
      cwd: state.checkout,
      env,
      input: prompt,
      timeoutMs: timeoutMs ?? handoff.limits.timeoutMinutes * 60_000,
      stdoutPath: join(runDirectory, 'stdout.jsonl'),
      stderrPath: join(runDirectory, 'stderr.log'),
    });
    const stream = parseClaudeStream(
      readFileSync(join(runDirectory, 'stdout.jsonl'), 'utf8'),
    );
    const decisions = readDecisions(guard?.guard.decisionLog);
    const after = snapshotCheckout(state.checkout);
    writeJson(join(runDirectory, 'after.json'), after);
    const changes = compareSnapshots(before, after);
    const violations = findViolations({
      kind,
      handoff,
      changes,
      stream,
      decisions,
    });
    if (guard && sha256(readFileSync(guard.path)) !== guard.sha256) {
      violations.push({ rule: 'GUARD_DRIFT' });
    }
    const candidate = writeCandidateEvidence(
      runDirectory,
      state.checkout,
      state.baseCommit,
      after,
    );
    if (typeof stream.result?.result === 'string') {
      writeFileSync(join(runDirectory, 'result.txt'), stream.result.result);
    }
    const succeeded =
      processResult.exitCode === 0 &&
      !processResult.timedOut &&
      stream.result?.subtype === 'success' &&
      stream.result?.is_error === false;
    const outcome =
      violations.length > 0
        ? 'SCOPE_VIOLATION'
        : succeeded
          ? 'SUCCEEDED'
          : processResult.timedOut
            ? 'TIMED_OUT'
            : 'FAILED';
    const limitations = [...RUNNER_LIMITATIONS];
    if (!stream.init)
      limitations.push('No init event; the actual tool pool was not observed.');
    const receipt = {
      schemaVersion: HANDOFF_SCHEMA_VERSION,
      task: id,
      kind,
      sequence,
      outcome,
      violations,
      limitations,
      ...processResult,
      runtime: { executable, ...runtime },
      arguments: args,
      guard: guard
        ? { path: guard.path, sha256: guard.sha256, decisions }
        : null,
      session: {
        id: stream.init?.session_id ?? stream.result?.session_id ?? null,
        model: stream.init?.model ?? null,
        permissionMode: stream.init?.permissionMode ?? null,
        tools: stream.init?.tools ?? null,
        mcpServers: stream.init?.mcp_servers ?? null,
      },
      result: stream.result
        ? {
            subtype: stream.result.subtype ?? null,
            isError: stream.result.is_error ?? null,
            numTurns: stream.result.num_turns ?? null,
            durationMs: stream.result.duration_ms ?? null,
          }
        : null,
      toolUses: stream.toolUses,
      permissionDenials: (stream.result?.permission_denials ?? []).map(
        (denial) => ({
          tool: denial.tool_name ?? null,
          target:
            denial.tool_input?.command ?? denial.tool_input?.file_path ?? null,
        }),
      ),
      handoffSha256: state.handoffSha256,
      referencesSha256: state.referencesSha256,
      checkout: {
        path: state.checkout,
        branch: state.branch,
        baseCommit: state.baseCommit,
        headBefore: before.head,
        headAfter: after.head,
      },
      driftSincePreviousRun,
      changes: changes.changed,
      candidate,
      evidenceDirectory: runDirectory,
    };
    writeJson(join(runDirectory, 'receipt.json'), receipt);
    state.runs.push({ sequence, kind, directory, outcome });
    state.status = `${kind.toUpperCase()}_${outcome}`;
    writeJson(paths.state, state);
    return receipt;
  } finally {
    release();
  }
}

// ---------------------------------------------------------------------------
// status / cleanup

export function readTaskStatus({ repositoryRoot: start, id } = {}) {
  const repositoryRoot = resolveRepositoryRoot(start);
  assertTaskId(id);
  const paths = taskPaths(repositoryRoot, id);
  if (!existsSync(paths.state)) {
    throw new ClaudeTaskError(
      'TASK_NOT_FOUND',
      `Task ${id} has no runner state.`,
    );
  }
  const state = readJson(paths.state);
  let integrity = 'INTACT';
  try {
    loadTask(repositoryRoot, id);
  } catch (error) {
    integrity = error.code ?? 'UNKNOWN';
  }
  let checkout = { exists: false };
  if (existsSync(paths.checkout)) {
    const status = git(
      paths.checkout,
      [
        '--no-optional-locks',
        'status',
        '--porcelain=v1',
        '-z',
        '--untracked-files=all',
      ],
      { allowFailure: true },
    );
    checkout = {
      exists: true,
      head: git(paths.checkout, ['rev-parse', 'HEAD'], {
        allowFailure: true,
      }).stdout.trim(),
      dirtyEntries: status.stdout.split('\0').filter(Boolean),
    };
  }
  return { state, integrity, locks: locksForTask(paths.locks, id), checkout };
}

function isDisposableIgnored(path) {
  const segments = path.replace(/\/$/u, '').split('/');
  const name = segments.at(-1);
  return (
    segments.some((segment) => DISPOSABLE_IGNORED_SEGMENTS.has(segment)) ||
    name.endsWith('.tsbuildinfo') ||
    name === 'next-env.d.ts'
  );
}

export function cleanupTask({ repositoryRoot: start, id } = {}) {
  const repositoryRoot = resolveRepositoryRoot(start);
  assertTaskId(id);
  const paths = taskPaths(repositoryRoot, id);
  if (!existsSync(paths.state)) {
    throw new ClaudeTaskError(
      'TASK_NOT_FOUND',
      `Task ${id} has no runner state.`,
    );
  }
  const release = acquireLocks(paths.locks, [`task-${id}`], {
    task: id,
    operation: 'cleanup',
  });
  try {
    const state = readJson(paths.state);
    if (state.id !== id || !samePath(state.checkout, paths.checkout)) {
      throw new ClaudeTaskError(
        'UNSAFE_PATH',
        'Recorded checkout is not the owned task path.',
      );
    }
    if (state.status === 'CLEANED') {
      throw new ClaudeTaskError(
        'ALREADY_CLEANED',
        `Task ${id} was already cleaned.`,
      );
    }
    if (state.status === 'PREPARING' || state.status.endsWith('_RUNNING')) {
      throw new ClaudeTaskError(
        'TASK_ACTIVE',
        `Task ${id} is ${state.status}; refuse cleanup during an unfinished operation.`,
      );
    }
    const held = locksForTask(paths.locks, id).filter(
      (lock) =>
        lock.owner?.operation !== 'cleanup' || lock.owner?.pid !== process.pid,
    );
    if (held.length > 0) {
      throw new ClaudeTaskError(
        'RESOURCE_LOCKED',
        `Task ${id} has active locks: ${held.map((lock) => lock.name).join(', ')}.`,
      );
    }
    verifyCheckoutIdentity(repositoryRoot, state);
    const listed = git(repositoryRoot, ['worktree', 'list', '--porcelain'])
      .stdout.split(/\r?\n/u)
      .filter((line) => line.startsWith('worktree '))
      .some((line) => samePath(line.slice('worktree '.length), paths.checkout));
    if (!listed) {
      throw new ClaudeTaskError(
        'CHECKOUT_IDENTITY',
        'Checkout is not a registered worktree.',
      );
    }
    const entries = git(state.checkout, [
      '--no-optional-locks',
      'status',
      '--porcelain=v1',
      '-z',
      '--untracked-files=all',
      '--ignored=matching',
    ])
      .stdout.split('\0')
      .filter(Boolean);
    const dirty = entries.filter((entry) => !entry.startsWith('!! '));
    if (dirty.length > 0) {
      throw new ClaudeTaskError(
        'CHECKOUT_DIRTY',
        'Checkout has uncommitted or untracked candidate work; integrate it before cleanup.',
        dirty,
      );
    }
    const unknownIgnored = entries
      .map((entry) => entry.slice(3))
      .filter((path) => !isDisposableIgnored(path));
    if (unknownIgnored.length > 0) {
      throw new ClaudeTaskError(
        'UNKNOWN_IGNORED_FILES',
        'Checkout has ignored files other than known dependency/build/cache outputs.',
        unknownIgnored,
      );
    }
    // Native removal without --force; the branch and evidence are retained.
    git(repositoryRoot, ['worktree', 'remove', state.checkout]);
    state.status = 'CLEANED';
    state.cleanedAt = new Date().toISOString();
    writeJson(paths.state, state);
    return state;
  } finally {
    release();
  }
}

// ---------------------------------------------------------------------------
// CLI

const USAGE = `Usage: node scripts/claude-task.mjs <command> [options]

Commands:
  validate --handoff <file>              Validate a handoff without mutation
  prepare  --handoff <file>              Freeze the handoff and create the owned worktree
  run      --task <id> [--claude <exe>]  Dispatch the implementation author
  review   --task <id> [--claude <exe>]  Dispatch a fresh read-only reviewer
  status   --task <id>                   Report state without mutation
  cleanup  --task <id>                   Remove a clean owned worktree; keep branch/evidence
  hook     --guard <file> --sha256 <hex> Guard hook used by worker sessions (stdin JSON)

Common option: --repo <path> (defaults to the current Git checkout).`;

export async function main(argv = process.argv.slice(2)) {
  const [command, ...rest] = argv;
  const { values } = parseArgs({
    args: rest,
    options: {
      handoff: { type: 'string' },
      task: { type: 'string' },
      repo: { type: 'string' },
      claude: { type: 'string' },
    },
    strict: true,
    allowPositionals: false,
  });
  const repositoryRoot = values.repo;
  switch (command) {
    case 'validate': {
      if (!values.handoff) throw new ClaudeTaskError('USAGE', USAGE);
      const handoff = parseHandoffBytes(readFileSync(values.handoff));
      return { ok: true, result: { valid: true, id: handoff.id } };
    }
    case 'prepare':
      return {
        ok: true,
        result: prepareTask({ handoffPath: values.handoff, repositoryRoot }),
      };
    case 'run':
    case 'review': {
      const receipt = await runTask({
        repositoryRoot,
        id: values.task,
        kind: command === 'run' ? 'worker' : 'review',
        claude: values.claude,
      });
      return {
        ok: receipt.outcome === 'SUCCEEDED',
        result: {
          outcome: receipt.outcome,
          violations: receipt.violations,
          session: receipt.session,
          evidenceDirectory: receipt.evidenceDirectory,
        },
      };
    }
    case 'status':
      return {
        ok: true,
        result: readTaskStatus({ repositoryRoot, id: values.task }),
      };
    case 'cleanup':
      return {
        ok: true,
        result: cleanupTask({ repositoryRoot, id: values.task }),
      };
    default:
      throw new ClaudeTaskError('USAGE', USAGE);
  }
}

if (process.argv[1] && samePath(process.argv[1], RUNNER_PATH)) {
  const argv = process.argv.slice(2);
  if (argv[0] === 'hook') {
    let stdinText = '';
    try {
      stdinText = readFileSync(0, 'utf8');
    } catch {
      stdinText = '';
    }
    const { exitCode, stdout, stderr } = hookMain(argv.slice(1), stdinText);
    process.stdout.write(stdout);
    process.stderr.write(stderr);
    process.exitCode = exitCode;
  } else {
    main(argv)
      .then(({ ok, result }) => {
        console.log(JSON.stringify(result, null, 2));
        process.exitCode = ok ? 0 : 1;
      })
      .catch((error) => {
        console.error(
          JSON.stringify(
            {
              code: error.code ?? 'UNEXPECTED',
              message: error.message,
              details: error.details,
            },
            null,
            2,
          ),
        );
        process.exitCode = 1;
      });
  }
}
