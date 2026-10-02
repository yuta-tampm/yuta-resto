# YUTA Development Workflow

Status: Current

Visibility: Engineering

Owner: YUTA engineering

Last updated: 2026-10-02

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
