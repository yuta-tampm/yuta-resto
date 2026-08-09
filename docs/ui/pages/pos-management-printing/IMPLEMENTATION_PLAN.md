# POS management printing — Implementation Plan

Status: Phase 5 complete

Visibility: Engineering

## Phase 0 — Repository analysis gate (`COMPLETE`)

Run `prompts/00_REPOSITORY_ANALYSIS.md`. Produce the complete Implementation
Inventory. Make no code changes.

Do not continue while the target application/runtime, classification,
data/session boundary, protected invariants, current visual baseline, or
required commands remain ambiguous.

Completed on 2026-08-09 from current repository code, contracts, tests, and
documentation. The visual baseline is repository-derived; authenticated browser
and physical device evidence are explicitly deferred to their later QA gates.
No runtime implementation code changed in this phase.

`DESIGN_HANDOFF.md` contains the authenticated baseline evidence and the design
prompt used to produce the approved `design-proposal-02.png`. The package moved
to `implementation-ready` after scope and reference approval.

## Phase 1 — Visual baseline

For `NEW_PAGE`, typed fixtures may be used only when explicitly approved.

For `EXISTING_PAGE`, improve the real implementation in place. Preserve real
data, authorization/session, mutations/actions, validation, transport,
polling/offline/device behavior, and tests.

Do not change contracts, permissions, schema, or unrelated routes.

Completed on 2026-08-09. The existing route was restyled in place using the
approved proposal 02 direction. It now has the management header, compact
truthful printer metrics, desktop settings/preview composition, settings
collapsed below `xl`, compact complete-queue counters, and a denser recent-job
table. Real session, data loading, pagination, polling, settings, job commands,
test printing, validation, transport, and site-agent/device ownership were
preserved. No contract, permission, schema, API, or runtime behavior changed.

## Phase 2 — Component refactor

Extract meaningful units by responsibility while preserving appearance and
behavior. Reuse `@yuta/ui`; do not prematurely promote feature-specific
components to the shared package.

Completed on 2026-08-09. The route remains the trusted Server Component loader
and now delegates the management header, printer-status presentation,
settings/test-print state, and queue/job actions to route-local components.
`PrintingManagement.tsx` is a server-side composition component. Client
boundaries are limited to `PrintSettingsCard.tsx`, `PrintJobsCard.tsx`, and the
existing visibility-aware `PrintingAutoRefresh.tsx`. No appearance, action,
validation, pagination, polling, contract, persistence, or device behavior was
changed, and no feature component was promoted to `@yuta/ui`.

## Phase 3 — Approved interactions

Implement only approved interactions and current state transitions. Preserve
authoritative business logic and the current trusted boundary.

Completed on 2026-08-09. The approved failure-reason interaction now provides
client-side empty-value feedback with `aria-invalid`/`aria-describedby` while
the existing Zod validation remains authoritative on the server and
site-agent. Job command success messages are exposed as status feedback, and
the existing invalid-status/not-found conflicts now offer an explicit
`Actualiser` recovery that calls `router.refresh()`. Existing server actions,
state transitions, pending buttons, polling, contracts, persistence, and
device ownership are unchanged. No Phase 4 data or integration work was
started.

## Phase 4 — Data integration or extension

Map the current domain and transport first. Existing pages normally require no
data rewrite for a visual refactor. Stop for approval before adding fields,
enums, permissions, contracts, APIs, schema/migrations, runtime dependencies,
or privileged device settings.

Completed on 2026-08-09 as a verified no-op integration phase. Every approved
UI field and action already maps to `@yuta/contracts/local-pos`, the existing
site-agent client and routes, the print job/settings/status services, and
`@yuta/db-pos` persistence. Authenticated jobs/settings/actions continue to use
fresh local management credentials; safe printer-status observation remains
read-only and does not open or claim RFCOMM. No data gap was identified, so no
field, enum, permission, contract, API route, schema/migration, dependency,
printer route, or persistence owner was added or changed.

## Functional and regression verification gate

Before Phase 5, run applicable behavior-protecting tests, target-application
typecheck/tests/build, and affected contract/domain/database/runtime/device
checks. Resolve regressions before declaring visual parity.

## Phase 5 — Visual and responsive QA

Use the target application's viewport/device matrix and operational QA
requirements only after the functional/regression gate. Run exact existing
repository checks, attach evidence, and synchronize the page package with the
as-built result.

Completed on 2026-08-09 against a clean production build. Authenticated browser
QA covered the POS matrix at `1366 x 768`, `1024 x 768`, `768 x 1024`, and
`390 x 844`. The wide layout keeps settings and previews side by side; all
smaller widths keep settings collapsed by default and expose the same real
actions. Every viewport had equal document client and scroll widths, the
production console was clean, and compact controls measured at least 44 pixels
high. At `1024 x 768`, the expanded settings grid retained three aligned fields
per row and 44-pixel select controls. The resulting captures are stored under
`references/` and the page package is synchronized with the as-built result.

Physical TM-m30 paper, cutter, and Bluetooth output were not exercised. The UI
therefore continues to report the real non-configured/disabled state and does
not claim a physical print result. Live queue records were not mutated solely
to manufacture empty, failed, conflict, or printed screenshots.

After completion, the owner approved a usability correction to the header. The
global shell now groups POS return and the role-labelled account menu on the
right, moves management return into page context above the title, and uses an
accessible icon-only POS return at narrow widths. The same production viewport
matrix and interaction checks were rerun, and the Phase 5 evidence was refreshed.

## Delivery evidence

Report files changed, protected invariants, commands/results, browser/device
evidence, deviations, blocked proposals, and risks.
