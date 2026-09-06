# YuTa

YuTa is a modular restaurant platform built with Next.js, TypeScript, Tailwind
CSS, and shared workspace packages. Cloud SaaS, local POS, and standalone
display runtimes share code deliberately but keep separate data ownership and
failure domains.

## Cloud/public-service applications

- `apps/web` — public website and general tenant-facing public flows (port 3000).
- `apps/backoffice` — authenticated restaurant back-office (port 3001).
- `apps/booking-web` — independent public booking app (port 3005).
- `apps/feedback-web` — independent public direct-feedback app (port 3006).
- `apps/platform-admin` — reserved for future internal YUTA administration;
  not implemented.

## Local operational products

- `apps/yuta-display` — standalone local digital signage (port 3002).
- `apps/yuta-pos` — local-only restaurant POS client (port 3003).
- `apps/site-agent` — local POS API/device boundary (port 3004).

Local products remain first-class monorepo components because they share logic,
contracts, UI, tooling, and CI. Their presence in the repository does not make
checkout, payment, billing, invoicing, cash-register, or money-management
workflows public YUTA service claims.

## Shared packages

- `packages/auth` — portable authentication contracts and primitives.
- `packages/contracts` — shared transport DTOs, events, and Zod schemas.
- `packages/core` — pure shared business logic and registries.
- `packages/booking` — pure public-booking domain logic.
- `packages/tenant` — trusted cloud tenant context and authorization guards.
- `packages/db-cloud` — cloud SaaS persistence.
- `packages/db-pos` — local POS persistence owned at runtime by site-agent.
- `packages/ui` — shared components, app shells, and semantic design tokens.

The legacy shared `@yuta/db` has been removed. POS operational data must never
be stored in or synchronized to the cloud database. Display persistence is
standalone and app-owned.

## Development

Use the Node.js and pnpm versions declared in `package.json`.

```bash
pnpm install
pnpm typegen:next
pnpm dev:env:sync
pnpm dev
```

`dev:env:sync` creates or retains random local seed credentials in ignored
`.env.local` files. Seed commands fail closed when required credentials are
missing; no stable seed password or PIN is stored in tracked documentation.

Useful application commands:

```bash
pnpm dev:backoffice
pnpm dev:booking
pnpm dev:feedback
pnpm dev:pos
pnpm dev:site-agent
pnpm dev:display
```

Start isolated development databases from the repository root:

```bash
docker compose --project-name yuta-cloud-dev -f docker-compose.cloud.dev.yml up -d --wait
docker compose --project-name yuta-pos-dev -f docker-compose.local.dev.yml up -d --wait
docker compose --project-name yuta-display-dev -f apps/yuta-display/docker-compose.dev.yml up -d --wait
```

Use `pnpm db:reset:dev --dry-run` before the guarded development reset. The
destructive command requires `CONFIRM_DB_RESET=true` and must never target
production.

## Quality and documentation

```bash
pnpm architecture:check
pnpm typegen:next && pnpm -r --if-present typecheck
```

`typegen:next` runs the installed Next.js type generator for Backoffice, Web,
Booking Web, Feedback Web, POS, and Display with strict rejection handling.
It stops on process failure or invalid fresh generated output; a raw Next exit
code alone is not treated as success.
Run it after a clean checkout/install, route/config changes, or removal of
generated output. It needs no database setup or copied environment files.
The existing root `typecheck` alias still checks only Web.

Direct app typechecks do not generate Next types automatically. Even for one
app, run the validated root prerequisite first, for example:

```bash
pnpm typegen:next && pnpm --filter @yuta/backoffice typecheck
```

Missing Next/image/route declarations on a clean checkout require this
prerequisite, not weaker compiler settings. `next-env.d.ts` is generated tooling
output, not hand-maintained source; do not commit regeneration-only edits.
The six generated next-env files are untracked and explicitly ignored.

Use an exclusive checkout: stop your own Next dev/build/typegen processes
before bootstrap. Conflicting bootstrap or Next locks are rejected; do not
remove another process's lock. After resolving a failure, rerun the validated
root bootstrap before typechecking. It invalidates only the four approved
generated type files per app, never source files or the whole `.next` directory.
Raw `next typegen` is a low-level diagnostic, not an equivalent fail-closed
bootstrap.

On older PowerShell without `&&`, run the second command only if
`$LASTEXITCODE -eq 0`; never continue after generation fails.

Run relevant package tests and application builds for the changed area. Start
with [`AGENTS.md`](AGENTS.md), [`docs/README.md`](docs/README.md), and
[`docs/CURRENT_STATE.md`](docs/CURRENT_STATE.md).
