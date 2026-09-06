# YUTA Development Workflow

Status: Current

Visibility: Engineering

Owner: YUTA engineering

Last updated: 2026-09-04

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

Dependabot currently monitors GitHub Actions only. npm/pnpm version updates stay
manual until GitHub Dependabot supports the repository's pnpm 11 lockfile.

Use `docs/tasks/TASK_TEMPLATE.md` for substantial work and an ADR for durable
architectural decisions. Do not claim a command passed when it was not run.
