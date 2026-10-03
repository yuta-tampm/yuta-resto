# YUTA Development Workflow

Status: Current

Visibility: Engineering

Owner: YUTA engineering

Last updated: 2026-10-03

1. Read root and nearest nested `AGENTS.md`.
2. Read `docs/README.md`, `docs/CURRENT_STATE.md`, and relevant current docs.
3. Inspect existing code, tests, package scripts, and the dirty worktree.
4. Define goal, scope, affected boundaries, security requirements, acceptance
   criteria, validation, and documentation impact.
5. Implement the smallest coherent change and update tests and docs together.
6. Report commands actually run, results, and unresolved risks.

Baseline checks:

```bash
pnpm install
pnpm dev:env:sync
pnpm docs:check
pnpm format:check
pnpm architecture:check
pnpm typegen:next && pnpm -r --if-present typecheck
```

### Next generated-type prerequisite

`pnpm typegen:next` is the root bootstrap command for exactly
`apps/backoffice`, `apps/web`, `apps/booking-web`, `apps/feedback-web`,
`apps/yuta-pos`, and `apps/yuta-display`. It invokes their installed
Next 16.2.9 public CLI sequentially through `scripts/generate-next-types.mjs`,
using strict unhandled-rejection handling and installed TypeScript to validate
fresh output. Missing/mismatched packages, process failure, or invalid output
stop the bootstrap. CI runs this same prerequisite in its
typecheck job before recursive TypeScript; a separate build job is not a
substitute.

Run generation after a clean checkout/install, route/config changes, or
removal of `.next` output. No database bootstrap or environment-file copying
is required for generation. Dependencies can be installed reproducibly with
`pnpm install --frozen-lockfile` before running the command.

The root `typecheck` alias remains Web-only; app `typecheck` scripts remain
`tsc --noEmit` without implicit pretypecheck/postinstall generation. Before a
direct `pnpm --filter <package> typecheck`, run `pnpm typegen:next`, even for
one app. Raw `next typegen` is only a low-level diagnostic, not an equivalent
fail-closed prerequisite.
Only proceed if generation succeeds. Older PowerShell users without `&&`
must check `$LASTEXITCODE -eq 0` before running the next command.

Next owns `next-env.d.ts` and `.next` declarations; do not hand-edit them or
commit regeneration-only changes. The six next-env files are untracked with
exact root-anchored ignore rules. Missing generated types are not a
reason to loosen TypeScript settings or copy another app's declarations.

Bootstrap requires an exclusive checkout: stop your own Next dev/build/typegen
processes first. An atomic `.tmp-next-typegen.lock` rejects overlapping bootstrap
runs; existing `.next/lock` and `.next/dev/lock` also cause rejection. Do not
remove another run's lock or kill unrelated processes. This lock does not
control arbitrary external Next invocations.

Before each app, bootstrap checks bounded non-linked/untracked paths and
invalidates only `next-env.d.ts`, `.next/types/routes.d.ts`,
`.next/types/validator.ts`, and `.next/types/cache-life.d.ts`. All four must be
freshly generated, parseable and structurally valid. No complete `.next` removal
or source editing is performed. A failed run may leave partial ignored output;
after resolving the cause, rerun `pnpm typegen:next` from the beginning, then
typecheck only on success. The 120-second per-child timeout terminates and waits
for the owned generator before releasing its lock. Changed Next versions or
output layouts require review rather than silently skipping validation.

### Parallel tasks and worktrees

Each simultaneous task has one primary writer, its own branch and its own Git
worktree. Branches alone do not isolate writers who share one directory. Create
the worktree from a clear base commit; uncommitted changes in the main checkout
do not transfer automatically. Other actors inspect rather than edit
concurrently. Delegated implementation handoffs follow the
[Claude Code implementation delegation](YUTA_AUTOMATED_CHANGE_WORKFLOW.md#claude-code-implementation-delegation)
procedure.

Each worktree needs its own dependency installation, for example
`pnpm install --frozen-lockfile`, and the ignored environment files its assigned
checks require. `pnpm dev:env:sync` writes ignored `.env.local` files and does
not seed a database. Inspect its targets before using it because it selects
shared local development database URLs. Give parallel runtime work separate
ports and disposable data, or serialize conflicting runs on shared ports,
databases and locks. Code work may proceed in parallel when write ownership is
isolated.

Agents read a needed skill directly from its exact
`.agents/skills/<skill-name>/SKILL.md`. Direct reading does not register a
command, invoke a skill or grant tool rights.

### Guarded task writes and commits

Before a task's first source write, the orchestrator creates a distinct linked
worktree and task branch, checks its clean exact base, and registers one primary
writer using `scripts/task-guard.mjs`. Registration reserves a non-reusable task
ID in the shared Git common directory and one claim in that worktree's Git
directory. It never edits primary-checkout sources. Dependency installation and
worktree creation are explicit preparation, before writer dispatch.

Registration JSON uses schema version 1 and records `task`, `writer`,
`sessionId`, `collaborationMode`, `modeSource`, `commitAfterTask`,
`commitSource`, `baseCommit`, exact repository-relative `writePaths`, and
exact authorized `commands`. Use the actual current session and user decision
sources; placeholders and another task's decisions grant no authority.
`NOT_SELECTED` permits authorized implementation but blocks staging/commit.

Commands run from the exact task worktree root inside its attributed Codex
session:

```powershell
Get-Content -Raw -LiteralPath task-binding.json | pnpm task:guard register
pnpm task:guard check --writer /root
pnpm task:guard snapshot --writer /root
Get-Content -Raw -LiteralPath task-writes.json | pnpm task:guard write --writer /root
Get-Content -Raw -LiteralPath task-commit.json | pnpm task:guard commit --writer /root
```

Supply binding, write and commit JSON through stdin or an external evidence
directory; do not add it as an untracked source in a checkout that must be
clean for registration. A write request is an array of exact `path` and
`contentBase64` objects. All targets are validated before the first mutation.
A commit request contains `message` and `review`. The review receipt has
`schemaVersion: 1`, `verdict: APPROVED`, an actual separate `reviewer`,
`source`, external `evidencePath`, `evidenceSha256` and `candidateDigest`
from snapshot. The orchestrator verifies the real review source; these fields
attribute evidence rather than authenticate the reviewer.

Each guarded operation acquires an exclusive task lock and rechecks the
repository, worktree, branch, exact expected HEAD, writer/session attribution,
allowlist and candidate. Inherited Git redirection/configuration variables,
linked parents, non-regular targets, hardlinks and out-of-scope staged/untracked
files are rejected. Snapshot includes HEAD, index tree, raw bytes, Git mode,
filesystem mode, file type and deletions. Commit requires sourced `YES`,
unchanged independent review evidence and candidate, stages only reviewed paths,
and checks staged blobs/modes plus the committed tree. A failed or interrupted
commit retains `COMMITTING`; re-entry inspects the outcome and never blindly
repeats commit. Preserve that state/evidence and request bounded recovery when
the outcome differs or HEAD did not advance. Do not delete another client's
lock or silently replace a task claim.

When a pending actual user commit choice arrives, pass
`{"choice":"YES","source":"<actual current-user reply>"}` (or `NO`) to
`pnpm task:guard select-commit --writer /root`. A selected choice is sticky;
this command does not silently replace it.

#### Codex hook coverage and activation

`.codex/hooks.json` connects `Bash` and `apply_patch` to this guard. Invalid
or missing binding returns the supported explicit `PreToolUse` denial. Shell
calls must match exact declared commands; background/interactive shells and
direct Git mutations are denied. Declare guarded write/commit CLI commands
when those author routes are needed. The orchestrator prepares/registers the
checkout before author dispatch; a hook-protected author cannot bootstrap an
unregistered checkout by bypassing the guard.

Review and trust the exact project hook through Codex's `/hooks` interface,
then reload/start the task context in the intended checkout and test a denied
inert operation. Merely committing a hook does not activate it in an existing
chat. Codex session IDs are attribution; subagents may share their parent's
session ID. Give each implementation author its own context/checkout and keep
reviewers read-only. A `write_stdin` continuation does not receive a new
pre-tool check, so interactive write channels are not authorized.

[Official hook documentation](https://learn.chatgpt.com/docs/hooks) defines the
supported paths and trust requirements. Hook launch failure, timeout, disabled
hooks and specialized tool paths can bypass runtime interception. These guards
coordinate cooperating clients, not an OS sandbox; authorized commands can have
their own effects. Repository delivery proves the guarded CLI and hook adapter,
not universal desktop enforcement. Use the guarded CLI for source writes and
commits until actual hook activation/denial has been observed. The initial
implementation of the guard itself uses an attributed clean-base bootstrap;
subsequent task writes use the guarded entry points.

Independent completion review checks checkout isolation and the exact candidate
in addition to content and validation evidence. Missing or drifted identity
blocks approval. [ADR-011](decisions/ADR-011-task-checkout-guards.md) records this
bounded decision.

### Claude task runner

`CLAUDE.md` imports `AGENTS.md` and adds Claude startup caveats.
`.claude/settings.json` preapproves routine inspection, denies reads of private
environment files and credentials, and denies edits to Git internals,
`.agents/`, `openspec/`, `docs/reviews/` and `docs/archive/`. Public
`.env.example` templates can be supplied through hash-bound approved-reference
snapshots in the handoff. Direct Read/Grep/Glob access to `.env` and all `.env.*`
names is blocked, including templates, to avoid gaps for private variants such
as `.env.staging` and `.env.backup`. Personal `.claude/settings.local.json`
is ignored by Git. The `yuta-readonly-reviewer` agent has only Read, Grep and
Glob.

`scripts/claude-task.mjs` implements the
[Claude Code implementation delegation](YUTA_AUTOMATED_CHANGE_WORKFLOW.md#claude-code-implementation-delegation)
handoff for Codex. A handoff records authorization; it does not create it, and
Codex verifies every source before use. Start from
`scripts/claude-task/example-handoff.json`. That example is a template: its
`REPLACE_WITH_` placeholders make it fail validation until the placeholders are
replaced with actual sourced values.

```bash
pnpm claude-task validate --handoff <file>
pnpm claude-task prepare --handoff <file>
pnpm claude-task run --task <id> [--claude <executable>]
pnpm claude-task review --task <id> [--claude <executable>]
pnpm claude-task status --task <id>
pnpm claude-task cleanup --task <id>
pnpm test:claude-task
```

- `validate` checks the strict versioned handoff without mutation. Write paths
  must be exact repository-relative files. Ordinary spaces, route groups such
  as `(authenticated)` and dynamic segments such as `[id]` are valid. Traversal,
  absolute paths, wildcards, control characters, `:` stream separators,
  reserved device names, protected areas, private env files and raw-byte
  bindings in `scripts/check-format-preservation.mjs` are rejected. Each
  authorized command is one exact command without quoting or chaining. Direct
  Git/GitHub commands stay with Codex, including forms with global Git options;
  every required check must also be an authorized command. Private environment
  or credential paths cannot become approved-reference or reading inputs.
- `prepare` verifies the base commit and approved reference hashes. It
  snapshots those references, creates an unused branch and one clean owned
  worktree at `exports/claude-tasks/<id>/checkout` with per-command
  `core.autocrlf=false`, and keeps evidence in
  `exports/claude-tasks/<id>/evidence`. It runs
  `pnpm install --frozen-lockfile` only when the handoff authorizes dependency
  preparation. It rejects linked parent directories before creating evidence
  or the checkout and never generates or copies private env files.
- `run` dispatches the implementation author and `review` dispatches a fresh
  read-only reviewer. Both use project-only setting sources, no MCP servers,
  no Chrome integration, no slash commands, no session persistence and
  `dontAsk` permissions without bypass. Worker sessions receive Read, Grep,
  Glob, Edit, Write and Bash. A runner-written, read-only, hash-pinned guard
  file sits outside the checkout and backs a PreToolUse hook (`hook`
  subcommand). The hook allows only exact authorized commands and exact
  allowlisted write paths, denies background commands, links and every other
  tool, and fails closed on invalid input. Reviewer sessions receive only Read,
  Grep and Glob, with hooks disabled.
- Each run first acquires atomic task, port, database and shared-resource
  locks. It then re-verifies the frozen handoff, reference hashes and checkout
  identity, and retains the prompt, sanitized version and subscription status,
  arguments, stream output, tool uses, hook decisions, raw-byte before and
  after snapshots, the binary diff and the bytes of every new file. Writes
  outside the allowlist, unexpected tools, executed unauthorized commands,
  unobserved guard hooks, HEAD changes and timeouts are recorded as failures.
  Changes are never reverted. Exit code zero without a successful Claude
  result is not a success. Candidate drift blocks another worker run; a review
  records it.
- `status` reports state, integrity, locks and checkout entries without
  mutation. `cleanup` removes only the recorded owned worktree, with native Git
  and without force. It refuses held locks, dirty or untracked candidates and
  ignored files other than dependency, build or cache output. The branch and
  evidence are always retained.

Claude discovery uses `--claude`, `CLAUDE_TASK_EXECUTABLE`, `PATH`, or on
Windows the newest Desktop runtime under
`%LOCALAPPDATA%\Packages\Claude_*\LocalCache\Roaming\Claude\claude-code\<version>\<hash>\claude.exe`.
API-key or third-party provider overrides are rejected for this subscription
flow. Only sanitized login, method, provider and subscription fields are kept.

Limits: permission rules and the guard hook are Claude runtime controls, not
an OS sandbox. An authorized command, such as a test or formatter, can write
caches, generated output or other effects of its own; post-run byte snapshots
attribute checkout bytes and staging state. Runner locks use the shared Git
common directory, so clients from separate worktrees of this repository share
the same port/database/resource namespace. They coordinate runner clients only.
Serialize external QA servers, shared ports and databases explicitly, and make
authorized commands stop the servers they start. Stale locks from a crashed
runner stay in place until Codex confirms their owner has stopped. Runner
output is evidence for Codex, never a gate approval or commit. Re-verify tool
restrictions after Claude Code version changes.

### External design-intelligence controls

Read [External Design Intelligence](ui/EXTERNAL_DESIGN_INTELLIGENCE.md) before
using or maintaining the project-local advisory integration. Its acceptance,
procurement, install and verification gates remain separate. Windows local
NTFS on one volume and a known Python 3.10+ executable are the bounded host;
other hosts or unknown ownership stop rather than receive a fallback installer.

The new Phase-A control test command constructs inert local fixtures only:

```bash
python -B -m unittest discover -s scripts/ui-ux-pro-max -p test_bootstrap.py
```

It does not fetch the accepted archive, run upstream Python or install a skill.
Native filesystem tests use exclusively owned temporary directories alongside
the repository on its volume, outside all skill discovery roots.

After a separately authorized installation has a verified receipt, the bounded
content check and supported query surface are:

```bash
python -B scripts/ui-ux-pro-max/bootstrap.py verify-content
python -B scripts/ui-ux-pro-max/query.py "keyboard accessibility" --domain ux --max-results 3
```

These are new tooling commands, not application/package scripts. A content
check alone is not full `VERIFIED_NO_CHANGE` or Codex activation evidence.
Phase A does not authorize running the query on real upstream bytes. The
`install` and `replace-reviewed` command modes currently stop at the
pre-procurement boundary; guarded placement/update mechanics are exercised only
with inert fixtures. Actual orchestration, smoke and fresh-context activation
remain the separately authorized tasks 5.x, followed by final setup validation
in task 6.1. Never use npm/npx/dlx/uipro or formatter/install-all workarounds.

Run only the relevant package tests and application builds in addition to the
baseline. Database integration tests require their documented disposable
database guards. Documentation-only changes do not require application builds,
but paths and links must be verified.

Repository-wide grouped checks used by CI are:

```bash
pnpm test:cloud
pnpm test:local
pnpm build:cloud
```

`test:local` includes the disposable PostgreSQL offline POS acceptance flow.

`docs:check` enforces the current-document index, metadata, local Markdown
links, Booking architecture aliases, and instruction-file consistency.
`format:check` covers Prettier-managed repository files; generated Next.js
declarations, Drizzle metadata, the generated POS service worker, and the pnpm
lockfile are excluded through `.prettierignore`.

The current user's 2026-10-01 decision authorizes a bounded quick formatting
gate: `scripts/check-format-preservation.mjs` verifies 67 explicitly listed
snapshot paths before Prettier runs. The same exact paths are excluded from
Prettier writes and checks. These include generated skills, historical review
and archive records, two active planning artifacts, canonical decision JSON,
and the Pointage generated snapshot. The guard accepts only their recorded raw
Git-object or checkout hashes and the reviewed exclusion policy; missing or
changed artifacts and changed exclusions fail. The registration is scoped to
these snapshots, not permanent immutability inferred from incidental hash
references. An intentional revision requires separate owner review and an
explicit update to the corresponding preservation binding.

This formatter-plus-preservation gate is separate from acceptance of
`repository-format-policy-and-baseline-remediation`. It does not certify
generated reproducibility, V-LOCK, or the full alternate-validation contract.
That change and its blocked work remain blocked; historical failures, approvals,
and parent task states are preserved.

Dependabot currently monitors GitHub Actions only. npm/pnpm version updates stay
manual until GitHub Dependabot supports the repository's pnpm 11 lockfile.

Use `docs/tasks/TASK_TEMPLATE.md` for substantial work and an ADR for durable
architectural decisions. Do not claim a command passed when it was not run.
