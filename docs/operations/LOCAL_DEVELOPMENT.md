# Local Database Development

Status: Current

Visibility: Engineering

Owner: YUTA engineering

Last updated: 2026-10-01

## Status

This document describes the database-development workflow defined by
`docs/architecture/DATABASE_BOUNDARIES.md`.

The legacy `packages/db`, its migration history, and runtime `DATABASE_URL`
contract have been removed. Cloud and POS database commands now target only
their explicit packages and connection variables.

The destructive development reset completed on 2026-07-28. The legacy shared
and display volumes were deleted, and the cloud, POS, and display databases
were recreated from their separate `0000_initial` baselines without seed data.
The cloud development seed was then applied to create the initial organization,
establishment, owner account, membership, entitlements, and reputation
settings. POS and display remain unseeded.

`apps/yuta-pos` has completed its runtime cutover: its source, image, and
runtime service use `SITE_AGENT_URL` and receive no database connection string.

## Database boundaries

Development uses three isolated database boundaries:

| Boundary           | Owner                                 | Connection variable    | Data                                                                |
| ------------------ | ------------------------------------- | ---------------------- | ------------------------------------------------------------------- |
| Cloud              | `packages/db-cloud`                   | `CLOUD_DATABASE_URL`   | Auth, organizations, establishments, reputation, reservations, SaaS |
| Local POS          | `apps/site-agent` + `packages/db-pos` | `POS_DATABASE_URL`     | Orders, payments, kitchen, printers, local users, local catalog     |
| Standalone display | `apps/yuta-display/src/db`            | `DISPLAY_DATABASE_URL` | Display-owned media and playlist state                              |

They must not share a database name, Docker volume, migration directory, or
Drizzle configuration.

The POS and display databases are independent even when they run on the same
local PostgreSQL server.

## Target development topology

```text
docker-compose.cloud.dev.yml
└── cloud-db (yuta_cloud)

docker-compose.local.dev.yml
└── pos-db (yuta_pos)

apps/yuta-display/docker-compose.dev.yml
└── display-db (yuta_display)
```

Example local-only connection values:

```env
CLOUD_DATABASE_URL=postgres://yuta_cloud:yuta_cloud@localhost:55431/yuta_cloud
POS_DATABASE_URL=postgres://yuta_pos:yuta_pos@localhost:55432/yuta_pos
DISPLAY_DATABASE_URL=postgres://yuta_display:yuta_display@localhost:55433/yuta_display
```

These are development examples only. Do not reuse development credentials in
production.

After cloning the repository or resetting development databases, synchronize
ignored `.env.local` files without printing their secrets:

```bash
pnpm dev:env:sync
```

The command updates only development files, removes obsolete generic
`DATABASE_URL` and `DISABLE_AUTH` keys, and refuses to run when
`NODE_ENV=production`. It never edits `.env.production`.

It configures `apps/feedback-web/.env.local` with the cloud development URL and
a retained or newly generated feedback IP-hash salt. Run the public feedback
app on port 3006:

```bash
pnpm dev:feedback
```

After the cloud schema and seed are available, open
`http://localhost:3006/luna`. The localhost slug lookup exists only in
development; production requires an active verified hostname.

## Environment ownership

- Cloud server code may receive `CLOUD_DATABASE_URL`.
- Only `site-agent` may receive `POS_DATABASE_URL`.
- POS browser/client code receives no database URL.
- Standalone display server code may receive `DISPLAY_DATABASE_URL`.
- No application environment file may contain both cloud and POS connection
  strings.
- A root orchestration file may reference multiple URLs only when it does not
  expose them to application bundles.
- Validate runtime environment variables with Zod at startup.

The initial local API uses:

```env
SITE_AGENT_HOST=127.0.0.1
SITE_AGENT_PORT=3004
SITE_AGENT_ALLOWED_ORIGIN=http://localhost:3003

# Optional; enables the physical internal-ticket worker when the Linux host
# exposes the paired TM-m30 RFCOMM character device.
POS_PRINTER_DEVICE=/dev/rfcomm1
POS_PRINT_POLL_INTERVAL_MS=1000

# Server-side URL used by apps/yuta-pos; never expose it as NEXT_PUBLIC_*
SITE_AGENT_URL=http://127.0.0.1:3004
```

Run `pnpm dev:site-agent` after the POS database schema is available. The
service validates `POS_DATABASE_URL` at startup and exposes `/health`; it does
not receive `CLOUD_DATABASE_URL`. The POS health endpoint now checks this local
API instead of opening a database connection for its connectivity probe.
`GET /api/v1/printer-status` exposes only safe worker, device, and queue state.
Its device probe uses stat/access checks and never opens the RFCOMM channel.
When `POS_PRINTER_DEVICE` is unset, kitchen ticket jobs remain in the local
queue for manual inspection. When set, the path must already be a character
device (`test -c /dev/rfcomm1`) accessible to the `site-agent` process.

## Backoffice instance exposure

`apps/backoffice` reads server-only `BACKOFFICE_EXPOSURE_PROFILE` at request
boundaries. Valid values are `internal` and `release-a`; unset development/test
selection retains the broader internal modules with their existing guards.
Invalid values in any environment and unset production selection fail closed
with safe `503` behavior. Building the application does not select or activate
a deployed profile. See [ADR-009](../decisions/ADR-009-release-a-customer-exposure.md)
and [Deployment](DEPLOYMENT.md#backoffice-instance-exposure).

For an already prepared, authorized local cloud target, select A only for the
process started from the current terminal; no environment file edit is needed:

```powershell
$env:BACKOFFICE_EXPOSURE_PROFILE = 'release-a'
pnpm dev:backoffice
# After stopping the owned development server:
Remove-Item Env:BACKOFFICE_EXPOSURE_PROFILE
```

Use `internal` instead to exercise the broader internal composition. Restart the
owned process when changing its selection; browser queries, cookies and forms
cannot override it. A exposes Today, Google Avis, the basic Establishment Profile,
OWNER Google Integrations and permitted Users & Access under current grants.
Deferred hosted routes/actions/APIs, including Booking, Knowledge and Pointage,
are denied. This selection alone grants no Pointage runtime admission or other
development opt-in.

A Today/Avis attention uses local `NEW`, `TO_PROCESS`, `DRAFTED`, `FOLLOW_UP`:
counts are not capped by preview/pagination and STAFF remains assigned-only.
Google fixtures and local `PUBLISHED` rows are not actual-provider retrieval or
remote-publication evidence. The bounded retrieval source path below is
separate from exposure selection; no publication path is added. Exposure
verification uses a separately verified, task-owned disposable cloud target and
process-only credentials/provider overrides; do not repoint guarded tests to
the persistent development databases. No provider call or customer activation
follows from this local selection.

## Google review retrieval and cache maintenance

Backoffice uses server-only `GOOGLE_REVIEW_RETRIEVAL_ENABLED`. Only exact `true`
admits new review retrieval; missing, false or invalid values keep it disabled
before credential/token/provider access. Existing OAuth and verified binding
remain separate. The flag is no substitute for the [actual-provider admission
prerequisites](DEPLOYMENT.md#google-review-retrieval-admission-and-cache-disposal).
This source delivery supplies no actual project credentials or environment
activation. Use isolated process-only synthetic fixtures with strict external
call denial; they are not evidence of Google project eligibility.

`POST /api/internal/reputation/google-cache-maintenance` authenticates a
dedicated `REPUTATION_CACHE_MAINTENANCE_SECRET` bearer credential before loading
the database runtime. Configure at least 32 characters with no whitespace;
missing/invalid configuration or authorization fails closed with no-store
responses. This exact machine path may pass exposure availability, which
grants no authorization. It processes at most 25 due trusted organization/
establishment scope pairs per request, up to 500 cache rows plus a separate
500-row retrieval-state batch per scope, and returns only own cleanup counts.
It makes no provider request and preserves local workflow, drafts, notes and
history. Cleanup remains independent of the retrieval flag.

[Reputation](../features/reputation/README.md#bounded-release-a-google-review-retrieval)
owns the 29-day content and at-most-30-day reference deadlines. Read denial and
the bounded purge mechanism do not prove timely physical disposal: this source
delivery installs no scheduler and verifies no backup/restoration handling.

## Schema workflow

Use schema push only for disposable design databases:

```bash
pnpm db:cloud:push
pnpm db:pos:push
pnpm --filter @yuta/display db:push
```

Do not generate a chain of compatibility migrations from the legacy shared
schema. Do not backfill legacy development data.

All active database boundaries now have committed clean baselines:

- `packages/db-cloud/drizzle/0000_initial.sql` creates the 17-table cloud
  boundary;
- `packages/db-pos/drizzle/0000_initial.sql` creates the 16-table local POS
  boundary;
- ordered POS migrations through `0010_chubby_proemial_gods.sql` add approved
  local capabilities, including the singleton establishment receipt profile;
- both baselines have been applied with `db:migrate` to empty PostgreSQL
  databases;
- both seeds are idempotent and their guarded integration suites pass on those
  migrated databases.
- `apps/yuta-display/drizzle/0000_initial.sql` creates the standalone
  app-owned `display_media` table, uses application-generated UUIDv7 IDs, and
  has been verified through migrate plus CRUD on an empty PostgreSQL database.

The canonical cloud migration journal currently ends at
`0020_formalites_legal_template_foundation`. Pointage raw-clocking remains a
synthetic/disposable-only change: its SQL, snapshot, roles, helper and raw
tables live under the guarded test fixture and are not consumed by
`pnpm db:cloud:migrate`. Shared development databases must not create Pointage
test roles or append that extension. The Pointage harness first proves the
canonical journal migrates without those roles, then applies the extension only
inside its verified loopback `tmpfs` test cluster.

## Disposable Pointage manual test

Use an interactive local terminal with repository dependencies installed and
Docker Desktop running its local Linux engine. Ports `3001` (Backoffice) and
`65431` (a deny sink that must remain closed) must be free. Stop any development
server you own through its terminal before starting; the command never stops
an existing port occupant. Run from the repository root:

```powershell
pnpm --filter @yuta/backoffice pointage:manual:test
```

The command provisions a new loopback PostgreSQL container with disposable
`tmpfs` data, applies the existing canonical migrations and guarded Pointage
test extension there, and starts the existing Backoffice employee route. It
does not require editing `.env` files, running the shared development seed or
reset, or supplying a database URL. Use only the two generated synthetic
employees; real employees and real attendance are not authorized.

Preflight refuses a non-development/test `NODE_ENV`, any `VERCEL` or CI
indicator, a remote Docker override/context, an unavailable local Docker
Desktop Linux engine, occupied ports, or noninteractive output. An unset
`NODE_ENV` is accepted by this explicitly invoked local command. Unknown
application environment keys or relevant source/environment drift also stop
the session. Resolve the reported local prerequisite and rerun; do not remove
guards or introduce real credentials. The child receives a fixed in-memory
profile with nonempty invalid provider values and a denied cloud database URL.

Wait for the terminal handoff. It appears only after context and admission
readiness pass, and contains the local URL, generation ID, two synthetic names,
their different eight-digit PINs, each initial `NOT_CLOCKED_IN` state, and the
stop instruction. PINs appear once in that terminal. Keep the terminal open;
do not pipe or save its output, copy PINs into evidence, or include them in
screenshots. Scrollback cannot be erased by the command. Lost PINs are replaced
by stopping and starting a new generation, not recovered from storage.

### Microsoft Edge checklist

1. Open the exact printed URL in Edge. Identify the first synthetic employee
   with their printed PIN and check the displayed name and `Non pointé` state.
2. Select `Enregistrer mon arrivée`, check the arrival receipt, then `Terminer`.
   Identify that employee again, check `Pointé`, record their departure and
   check the departure receipt.
3. Select `Terminer` and identify the second employee with their own PIN. They
   must still be `Non pointé`. Repeat their arrival/departure flow. After each
   `Terminer`, the previous name, state, receipt and PIN must disappear before
   another employee uses the shared device.
4. To exercise a stale-state conflict, identify the same synthetic employee in
   two visible Edge windows before recording one arrival. Record the arrival
   in one window, then try the stale arrival in the other. On a conflict use
   `Actualiser ma situation` and check the current state before acting again.
   If a request instead reports an unknown result, use `Vérifier le résultat`
   to retry that result check; do not assume the first request failed to commit.
5. Press Ctrl+C in the owning terminal and wait for cleanup. Refresh the old
   URL: no admitted Pointage owner remains, so the old session must not serve
   attendance. Successful cleanup releases port `3001`; a later ordinary
   Backoffice server does not restore this generation's admission.

This checklist is a manual operational observation, not formal VERIFY or
Browser QA evidence. Reset by stopping, waiting for cleanup, and rerunning the
same command. Each run creates a new generation, URL, employees and PINs; the
previous disposable data is removed.

On Windows, the package runner may display `Terminate batch job (Y/N)?` after
Ctrl+C. Wait for the CLI's resource-cleanup confirmation, then answer `N` to
any remaining runner prompt. The interrupted wrapper may return a nonzero
status even after successful cleanup; verify the cleanup confirmation and
released port rather than treating the wrapper status alone as proof. Do not
close the terminal while cleanup is still pending.

### Stop failures and exact-resource recovery

Ctrl+C, SIGTERM and handled failures trigger cleanup of the owned child,
database clients and verified container. A startup or cleanup failure exits
nonzero and reports sanitized stage/resource identity. Power loss, an OS
crash or an uncatchable force-kill can leave resources behind. Do not reuse
that fixture or issue a broad process/container removal command.

For a leftover container, use the generation ID from that run's terminal
handoff or failure report. Its UUID without hyphens, truncated to 24 characters,
is both the container suffix and the `yuta.disposable-run` label value. Inspect
only that exact candidate; the following output excludes container environment
values:

```powershell
$pointageGeneration = '<exact generation UUID>'
$pointageSuffix = ([guid]$pointageGeneration).ToString('N').Substring(0, 24)
$pointageContainerName = 'yuta-pointage-next-' + $pointageSuffix
docker container inspect --format '{{.Id}} {{.Name}} {{json .Config.Labels}}' $pointageContainerName
```

Verify the exact name and matching `yuta.disposable-run` value, then record the
full returned container ID (also match the failure report's ID if available).
Only then remove that verified ID with
`docker container rm --force <verified-exact-container-id>`, and confirm that
`docker container inspect --format '{{.Id}}' <verified-exact-container-id>`
reports no such container. Never remove all containers sharing a label. If the generation or
ownership cannot be established, stop recovery and request inspection.

On Windows, inspect an occupied port without stopping its owner:

```powershell
Get-NetTCPConnection -LocalPort 3001 -State Listen -ErrorAction SilentlyContinue |
  Select-Object LocalAddress, LocalPort, OwningProcess
Get-CimInstance Win32_Process -Filter 'ProcessId = <observed-pid>' |
  Select-Object ProcessId, ParentProcessId, ExecutablePath
```

Return to the owning terminal for a normal stop. If it is gone, establish that
the exact PID and parent belong to the failed generation before any targeted
termination; a port number or `node` process name alone is not ownership proof.
Do not kill another developer's server. Confirm port `3001` is released before
starting a new run; port `65431` must also remain closed.

## Root scripts

The root provides explicit database commands for the cloud and POS boundaries:

```text
db:cloud:push
db:cloud:generate
db:cloud:migrate
db:cloud:seed
db:cloud:seed:demo
db:pos:push
db:pos:generate
db:pos:migrate
db:pos:seed
db:reset:dev
architecture:check
```

Display migration scripts remain in `@yuta/display` because its database has
only one owning application.

Run `pnpm architecture:check` before pushing changes. The same command runs in
CI and rejects legacy `@yuta/db` usage, cross-runtime imports, generic
`DATABASE_URL` configuration, database dependencies in client modules, and
invalid migration baselines.

## Guarded development reset

Preview the exact commands and targets without changing Docker state:

```bash
pnpm db:reset:dev --dry-run
```

The script targets only these development Compose projects:

- `yuta-cloud-dev` through `docker-compose.cloud.dev.yml`;
- `yuta-pos-dev` through `docker-compose.local.dev.yml`;
- `yuta-display-dev` through
  `apps/yuta-display/docker-compose.dev.yml`.

It also removes the explicitly named legacy development containers and volumes
reported by the reset audit. It never discovers targets through a wildcard.

An actual reset is destructive and requires:

```bash
CONFIRM_DB_RESET=true pnpm db:reset:dev
```

On PowerShell:

```powershell
$env:CONFIRM_DB_RESET = 'true'
pnpm db:reset:dev
Remove-Item Env:CONFIRM_DB_RESET
```

The command refuses to run when `NODE_ENV=production`, recreates all three
databases from their `0000_initial` migrations, and leaves seed data disabled
by default. To seed the cloud and POS development databases after migration,
also set `SEED_DB_RESET=true`. The display boundary currently has no seed.

Never add or use a production reset script.

## Seed ownership

The new packages now expose independent seed commands:

```bash
pnpm db:cloud:seed
pnpm db:pos:seed
```

The cloud seed requires `CLOUD_DATABASE_URL`. It creates or updates:

- the LUNA organization with LUNA and LuNa Poitiers establishments;
- development hostnames and cloud entitlements for both establishments;
- LUNA owner and manager accounts with their establishment memberships;
- one YuTa platform administrator without a restaurant membership;
- the initial reputation settings.

`YUTA_CLOUD_SEED_PASSWORD` is always required. `pnpm dev:env:sync` generates a
random value in the ignored `packages/db-cloud/.env.local`; deployments supply
their own value.

The POS seed requires `POS_DATABASE_URL`. It creates or updates:

- local admin, staff, and kitchen identities with development PIN hashes;
- the 12-category Luna operating menu with 52 immediately available products;
- an unavailable zero-price Saturday special for weekly manager configuration;
- Gua Bao Happy, Menu Express, Menu Gourmand, and Combo Ete rules and groups.

The POS seed does not create cloud users, tenant memberships, reputation data,
sample orders, payment history, print jobs, or device credentials.
`YUTA_POS_SEED_ADMIN_PIN`, `YUTA_POS_SEED_STAFF_PIN`, and
`YUTA_POS_SEED_KITCHEN_PIN` are required and contain four to eight digits.
`pnpm dev:env:sync` generates random local values in the ignored
`packages/db-pos/.env.local`. The seed stores only scrypt hashes.

Both seeds generate new business IDs with UUIDv7 in application code and are
idempotent through stable natural keys.

### Cloud reputation demo data

After the normal cloud seed has created the development organization,
establishment, and owner, an optional guarded seed can populate the admin
`customers/reviews` page:

```powershell
$env:CONFIRM_CLOUD_DEMO_SEED = 'true'
pnpm db:cloud:seed:demo
Remove-Item Env:CONFIRM_CLOUD_DEMO_SEED
```

The demo seed creates a small, idempotent set of Google and direct feedback,
published and draft replies, internal notes, and direct-feedback details. Demo
feedback is marked with `providerMetadata.demo = true`, so it remains
distinguishable from imported or customer-created records.

The existing LUNA demo dataset remains scoped to establishment slug `luna`.
The same command also creates one positive and one negative synthetic direct
feedback record for `luna-poitiers`, each with a direct-feedback detail and no
customer contact data. It does not configure external review URLs.

The command refuses to run without `CONFIRM_CLOUD_DEMO_SEED=true` and requires
the normal cloud foundation seed to exist first. Run it only against a local
database or an explicitly approved demo environment. Never run it against a
customer or production database.

Display seed data may include placeholder media records only when the
corresponding local files exist.

Never seed Google OAuth tokens. Never use the cloud organization seed to
initialize POS data.

## Integration-test guard

Database integration tests are boundary-specific and disabled by default. Run
them only against disposable databases with the matching URL and an explicit
confirmation:

```powershell
$env:YUTA_ALLOW_DATABASE_INTEGRATION_TESTS = 'true'
$env:CLOUD_DATABASE_URL = 'postgres://.../yuta_cloud_test'
pnpm test:db-cloud
pnpm test:booking-web

$env:POS_DATABASE_URL = 'postgres://.../yuta_pos_test'
pnpm test:db-pos
pnpm test:site-agent

Remove-Item Env:YUTA_ALLOW_DATABASE_INTEGRATION_TESTS
```

Never set the integration-test confirmation flag in a production environment.

## Fresh-install verification

Run the repeatable offline POS acceptance test:

```powershell
pnpm test:pos:offline
```

The command creates a disposable PostgreSQL 17 container backed by `tmpfs`,
applies `db-pos/0000_initial`, seeds local data, builds and starts the POS,
starts `site-agent` without cloud configuration, creates an order through the
local API, and verifies that POS health remains available while the Internet
probe is unavailable. It removes its processes and disposable container on
success or failure. Ports `3003` and `3004` must be free by default. Override
the acceptance-only ports with `YUTA_OFFLINE_POS_PORT` and
`YUTA_OFFLINE_SITE_AGENT_PORT` when local services are already running.

Before the first real deployment, also verify:

- each active boundary builds from its own `0000_initial` followed by its
  ordered feature migrations;
- cloud schema contains no POS operational tables;
- POS schema contains no cloud auth, OAuth, organization-membership, or
  subscription tables;
- display schema contains no POS mirror tables;
- POS operates when cloud services and Internet are unavailable;
- no client bundle contains a DB client or connection string;
- UUIDv7 business IDs are generated by application/service code.

## Boundary verification

Runtime source and workspace dependencies must not reference `packages/db`,
`@yuta/db`, or the generic `DATABASE_URL`. Historical design documents may
mention them only when describing the completed migration.
