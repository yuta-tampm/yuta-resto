# Pos Management Printing

Status: Implemented

Visibility: Engineering

Owner: YUTA product and engineering

Prompt snapshot topology: GENERATED_SNAPSHOTS

Prompt provenance: prompt-provenance.json

Application: `apps/yuta-pos`

Target type: `SCREEN`

Route / entry point: `/management/printing`

Runtime family: `local POS`

Page classification: `EXISTING_PAGE`

Implementation class: `device-coupled`

Package status: `implemented`

Scope status: `APPROVED`

Reference status: `APPROVED`

Inventory status: `COMPLETE`

Baseline status: `CAPTURED`

Design prompt status: `READY`

No-image reference reason: Not applicable; `design-proposal-02.png` is the
approved visual reference.

## Current implementation

The existing Server Component route is
`apps/yuta-pos/src/app/management/printing/page.tsx`. It requires a valid local
admin or manager session, loads paginated jobs, print settings, and safe printer
status from `apps/site-agent`, and renders the current management shell. The
Phase 2 structure uses the shared
`apps/yuta-pos/src/app/management/_components/ManagementHeader.tsx` alongside
`PrinterStatusCard.tsx`, `PrintSettingsCard.tsx`, and `PrintJobsCard.tsx` behind
the server-side composition in `PrintingManagement.tsx`. Client state is limited
to settings/test-print actions, queue/job actions and pagination, plus the
visibility-aware five-second refresh in `PrintingAutoRefresh.tsx`. Server
actions in `actions.ts` validate commands and settings with
`@yuta/contracts/local-pos`, forward them to the site-agent, and revalidate this
route.

## Authority

Read in order:

1. root `AGENTS.md`;
2. nearest application `AGENTS.md`;
3. `docs/CURRENT_STATE.md` and relevant architecture, product, feature,
   operations, and QA docs;
4. `docs/ui/README.md`, `docs/ui/DESIGN_TO_CODE_WORKFLOW.md`, and
   `docs/ui/YUTA_FRONTEND_RULES.md`;
5. implemented contracts, schema, session/authorization, business logic, and
   tests;
6. target-application UI rules;
7. this page package;
8. `@yuta/ui` exports and semantic tokens;
9. visual references.

Application-specific UI rules: `docs/ui/POS_FRONTEND_RULES.md`.

## Documents

- `PRODUCT_SCOPE.md`
- `UI_SPEC.md`
- `DATA_AND_INTERACTION_SPEC.md`
- `DESIGN_HANDOFF.md`
- `IMPLEMENTATION_PLAN.md`
- `ACCEPTANCE_CHECKLIST.md`

## References

The authenticated baseline, approved design, interaction evidence, and final
as-built captures are stored under `references/`. The Phase 5 captures cover
the complete POS viewport matrix with the current populated,
printer-not-configured state. Physical printer evidence remains explicitly
deferred; browser state is not treated as proof of paper or cutter output.

## Protected invariants

- Keep the runtime chain `apps/yuta-pos -> apps/site-agent -> @yuta/db-pos`.
- Require the local management cookie and a validated admin or manager session.
- Keep print data local; do not introduce cloud persistence or synchronization.
- Keep contracts and validation in `@yuta/contracts/local-pos` and authoritative
  job/settings/device behavior in the site-agent services.
- Preserve queue pagination, complete-queue summary counts, status transitions,
  retry/reprint/test actions, and conflict recovery.
- Preserve visible-page polling every five seconds, immediate focus/visibility
  refresh, and no refresh while hidden or blocked by the browser-local screen
  schedule.
- Printer status must remain safe and observational: polling must not open,
  claim, read, or write the RFCOMM device. Only explicit print/test work may use
  the device path.
- A ready channel must not be presented as proof of paper or physical success.
- Real data and current actions must never be replaced with fixtures.

## Change impact

```text
Files expected to modify: apps/yuta-pos/src/app/management/printing/* and the page-pack documents; reuse existing management session/sign-out behavior
Files expected to create: none approved
Packages affected: apps/yuta-pos
Cross-application impact: none
Database change: NO
API or contract change: NO
Permission/auth change: NO
Runtime/device change: NO
```

## Design approval

`design-proposal-02.png` was approved by the product owner on 2026-08-09. The
approved direction retains the proposal 01 visual language, adds the management
header to this screen by reusing current management capabilities, and keeps
settings collapsed below the desktop `xl` layout. Proposal 02 corrects the
remaining domain/state issues and is visual authority within the documented
scope; implementation and product documentation remain behavior authority.

## Prompt order

1. `prompts/00_REPOSITORY_ANALYSIS.md`
2. `prompts/01_VISUAL_BASELINE.md`
3. `prompts/02_COMPONENT_REFACTOR.md`
4. `prompts/03_INTERACTIONS.md`
5. `prompts/04_DATA_INTEGRATION.md`
6. `prompts/05_VISUAL_QA.md`

Review each phase before starting the next.

## Phase 1 implementation status

Phase 1 was completed on 2026-08-09 in the existing implementation:

- `apps/yuta-pos/src/app/management/printing/page.tsx` now renders the approved
  management header while reusing the validated local management session and
  existing sign-out action;
- `apps/yuta-pos/src/app/management/printing/PrintingManagement.tsx` implements
  the approved density, truthful status metrics, desktop settings/preview
  layout, below-`xl` collapsed settings, compact queue summary, and recent-job
  table while retaining every current action and state;
- no contracts, permissions, database schema, API routes, polling rules,
  site-agent behavior, or printer/device ownership changed.

The desktop production-build capture is
`references/phase-01-implementation-1366x768.png`. The production browser pass
confirmed the authenticated real-data screen and no console warnings or errors.
The later Phase 5 production-browser pass completed the tablet and narrow
viewport evidence and confirmed the below-`xl` collapsed behavior.

Intentional Phase 1 deviations from the visual board:

- the route header does not duplicate an “updated at” value; the existing
  truthful printer-status timestamp remains in the printer card;
- compact job actions remain labelled buttons rather than proposal icon-only
  controls so current action meaning and accessible names stay explicit.

This historical Phase 1 gate remained `implementation-ready`; Phase 5 has since
completed the final as-built/visual QA synchronization.

## Phase 2 implementation status

Phase 2 was completed on 2026-08-09 without changing the Phase 1 appearance or
behavior:

- `page.tsx` retains trusted session validation, site-agent loading, error
  handling, and route orchestration;
- `apps/yuta-pos/src/app/management/_components/ManagementHeader.tsx` owns the
  shared server-rendered POS Management header and existing sign-out action;
- `PrinterStatusCard.tsx` owns truthful printer-state presentation without a
  client boundary;
- `PrintSettingsCard.tsx` owns settings, preview, save state, and explicit test
  printing;
- `PrintJobsCard.tsx` owns the complete queue summary, pagination, job rows,
  status-specific actions, and failure dialog;
- `PrintingManagement.tsx` is now a small server-side composition component;
- `PrintingAutoRefresh.tsx` remains the independent visibility-aware polling
  boundary.

Focused validation passed with 23 POS tests, 37 site-agent tests and one skipped
site-agent test, POS typecheck, and the POS production build. Authenticated
browser DOM inspection confirmed the real printer state, complete queue counts,
three populated jobs, order links, and current `Démarrer`/`Échec` actions after
the extraction. The already-running development tab retained an older Phase 1
HMR hydration log caused by its stale server/client snapshot. A clean production
browser reload was blocked by the browser localhost URL policy; the production
build itself completed successfully. Phase 1 visual evidence remains applicable
because Phase 2 made no visual changes. Clean browser/viewport sign-off remains
part of Phase 5.

On 2026-08-12 the proven header was promoted to the shared POS Management owner
while implementing catalogue Phase 1. Authenticated production-browser QA of
`/management/printing` confirmed the same heading, brand, return-to-POS and
account behavior with no horizontal overflow or console warnings/errors.

## Phase 3 implementation status

Phase 3 was completed on 2026-08-09 and is limited to interactions already
approved in proposal 02 and this page package:

- submitting the failure dialog with a blank or whitespace-only reason now
  stays client-side and displays `Le motif est requis.` with accessible field
  error linkage;
- server and site-agent Zod validation, the 2000-character limit, submitted
  value preservation, pending state, and failure transition remain unchanged;
- invalid-status and missing-job responses now carry route-local refresh
  recovery metadata and display an `Actualiser` button that uses the existing
  Next.js router refresh;
- job command success messages are rendered with `role="status"` when the
  updated row remains mounted.

Authenticated browser verification opened a real pending-job failure dialog,
submitted it empty without mutating the queue, confirmed `aria-invalid=true`,
the linked error description, Escape-to-close behavior, and a clean console
apart from normal development information. Evidence is captured in
`references/phase-03-validation-error.png`. Conflict recovery was verified by
the typed server-action mapping and production build; triggering a real
conflict was intentionally avoided because it would require changing the live
queue concurrently.

## Phase 4 integration status

Phase 4 was completed on 2026-08-09 as an evidence-backed no-op. The audit
followed each approved display and mutation through the current local chain:

```text
authenticated POS route/server action
  -> serialization-safe @yuta/contracts/local-pos schema
  -> existing site-agent client and route
  -> site-agent print job/settings/status service
  -> @yuta/db-pos print_jobs or print_settings when persistence is required
```

The audit confirmed complete mappings for job rows and total counters,
ten-ticket pagination, all status transitions, failure reasons, retry/reprint,
settings, previews, test jobs, and safe printer status. The UI does not require
raw print payloads, new timestamps, filters, hardware configuration, or another
data owner. The management token remains required for queue/settings mutations;
printer-status inspection remains intentionally safe and observational.

No runtime file changed in Phase 4. No field, enum, role, contract, API,
schema/migration, database access, runtime dependency, printer route, device
setting, or cloud synchronization was introduced. Detailed mapping evidence is
recorded in `DATA_AND_INTERACTION_SPEC.md`.

The Phase 4 functional gate passed with 12 contract tests; 14 db-pos tests and
one skipped integration test; 37 site-agent tests and one skipped integration
test; 23 POS tests; the POS production build; page-pack, documentation and
architecture checks; and the complete monorepo typecheck. Database integration
tests were not required because Phase 4 made no schema, query, migration, or
runtime data change.

## Phase 5 visual and responsive QA status

Phase 5 was completed on 2026-08-09 against the authenticated production build:

- the POS matrix was verified at `1366 x 768`, `1024 x 768`, `768 x 1024`, and
  `390 x 844`;
- the desktop composition keeps settings and previews side by side, while all
  smaller widths start with settings collapsed and retain direct access to test
  printing and queue actions;
- no viewport had horizontal overflow, and the production console was clean;
- tablet and narrow interactive controls measure at least 44 pixels high;
- the expanded `1024 x 768` settings form preserves two aligned rows of three
  controls with 44-pixel select targets;
- final viewport captures are recorded in `references/`.

The authenticated state remained real throughout QA. No print job was changed
only to generate screenshots, and no physical printer test was performed. The
current non-configured printer state remains truthful and is not physical-device
sign-off.

## Post-Phase 5 header usability correction

The product-owner reference supplied after Phase 5 replaces the centered
management action with a clearer shell hierarchy. The global header now keeps
the YUTA identity on the left and groups POS return plus a role-labelled account
menu on the right. Sign-out remains the same server action and is available from
the account menu. On narrow screens the POS return is an accessible icon-only
control. The logo and local-management identity also link directly to
`/management`. The management return is a touch-sized breadcrumb directly above
the page title. Session, role validation, routes, and sign-out behavior are
unchanged.

## Phase 0 Implementation Inventory

1. **Target app and route:** `apps/yuta-pos`, `/management/printing`.
2. **Target type:** `SCREEN`.
3. **Classification:** `EXISTING_PAGE`; the route and real integrated behavior already exist.
4. **Implementation class:** `device-coupled`; the browser uses the site-agent boundary and the local printer worker owns hardware access.
5. **Current files and conventions:** `page.tsx`, `PrintingManagement.tsx`, `PrintingAutoRefresh.tsx`, and `actions.ts`; Server Components for trusted loading, narrow Client Components for browser state/effects, French operator copy, `lucide-react`, `@yuta/ui`, and semantic tokens.
6. **Auth/session boundary:** `requireLocalManagementCredentials()` reads `yuta_pos_management_session`, validates it through the site-agent, accepts only `admin` or `manager`, and redirects invalid sessions to `/management/login`.
7. **Data owner/persistence:** `apps/site-agent` owns local operations and accesses `@yuta/db-pos`; `print_jobs` and `print_settings` are local POS data.
8. **Contracts:** local routes, queries, responses, settings, printer status, job commands, and serialization-safe types come from `packages/contracts/src/local-pos/index.ts`.
9. **Loaders/actions/mutations:** `page.tsx` loads jobs (10 per page), settings, and status in parallel. `actions.ts` handles job commands, failure reason, settings save, and test-print creation, then revalidates the route.
10. **Polling/offline/device:** refresh every five seconds only while visible and the browser-local screen schedule permits it, and immediately on focus/visibility under the same condition. Status is safe and does not touch RFCOMM. The site-agent worker owns job claiming and device I/O, including while the browser is in standby.
11. **UI primitives/tokens:** `PageHeader`, `Card`, `StatCard`, `Alert`, `Badge`, `Button`, `Dialog`, `FormField`, `Input`, `Select`, `Pagination`, `Separator`, `EmptyState`, and semantic tokens from `@yuta/ui`.
12. **Tests:** `apps/yuta-pos/test/site-agent-client.test.ts`, `apps/site-agent/test/server.test.ts`, `print-job-pagination.test.ts`, `printer-status-service.test.ts`, and `local-printer-worker.test.ts`.
13. **Authoritative docs:** root/POS `AGENTS.md`, `docs/CURRENT_STATE.md`, POS README, product spec, user guide, offline strategy, QA checklist, applicable operations docs, and shared/POS UI governance.
14. **Protected invariants:** local-only runtime, trusted management session, site-agent ownership, real queue/actions, validated transitions, polling rules, safe status semantics, and exclusive device ownership.
15. **Visual baseline/evidence:** authenticated screenshots captured on 2026-08-09 at `1366 x 768` and `1024 x 768` cover the management header, printer-not-configured status, settings/test panel, queue summary cards, and populated recent-ticket list. No physical printer result was captured.
16. **Design conflicts:** proposal 02 is approved visual authority, but its
    layout yields to protected behavior and truthful current domain state.
17. **Unsupported concepts:** new fields, filters, bulk commands, printer discovery/configuration, cloud sync, changed status enums, new roles, and automatic hardware probing require separate approval.
18. **Expected impact:** documentation only. A later approved visual pass should update the existing feature in place without database, API, permission, cross-app, or device-runtime changes.
19. **Flags:** none currently used or proposed.
20. **Exact verification commands:** `pnpm ui:pack:check pos-management-printing`, `pnpm docs:check`, `pnpm architecture:check`, `pnpm -r --if-present typecheck`, and `pnpm format:check`. Later behavior changes also require narrow POS/site-agent tests and builds.
21. **Proposed files:** Phase 0 modifies only this page package and its index entry. Runtime files remain unchanged until scope and visual authority are approved.

Fixture replacement is forbidden for this existing integrated screen. Phase 0
is complete and the separately approved Phase 1 implementation is recorded
above.

## Stop conditions

Stop and request approval when implementation would require an unsupported
product capability, field, enum, permission, contract, API route,
schema/migration, runtime dependency, hardware/device setting, or change to a
protected business invariant.

## Final delivery and as-built status

Final implementation locations/files changed: the existing
`apps/yuta-pos/src/app/management/printing/` route, its route-local components
and server actions, plus this page package and its evidence files. Shared
contracts, persistence, API routes, permissions, and device runtime were not
changed.

Verification commands and results: POS, site-agent, contract, and db-pos tests;
POS typecheck and production build; page-pack, documentation, architecture, and
monorepo typechecks all passed. `pnpm format:check` was also run and reports only
the pre-existing unrelated `apps/web/tsconfig.json` formatting issue.

Functional/regression QA result: existing authenticated loading, pagination,
polling, settings, test printing, queue commands, validation, conflict recovery,
transport, persistence, and device ownership remain protected and their
applicable test suites pass.

Visual/browser/device evidence: authenticated production captures cover
`1366 x 768`, `1024 x 768` collapsed and expanded, `768 x 1024`, and
`390 x 844`. There is no horizontal overflow, compact controls meet the
44-pixel target, and the production console is clean. Physical TM-m30 paper,
cutter, and Bluetooth output were not tested.

Intentional deviations: the page header does not duplicate the printer
timestamp already shown in the status card; compact job controls retain labels
instead of becoming icon-only. The later owner-supplied header correction takes
precedence over the previously centered management navigation: that link is now
page-context navigation above the title.

Deferred proposals and risks: physical printer acceptance remains an
operational device check. Empty, printed, failed, and conflict states were not
manufactured by mutating the live queue solely for screenshots; their current
implementation and automated coverage remain authoritative.

As-built documentation status: `COMPLETE`
