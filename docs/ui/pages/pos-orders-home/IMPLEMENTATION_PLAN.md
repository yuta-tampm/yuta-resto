# POS Orders Home — Implementation Plan

Status: Phase 5 complete; package implemented

Visibility: Engineering

## Phase 0 — Repository analysis gate

Complete. The route is `EXISTING_PAGE`, integrated, and governed by `EXISTING_CAPABILITY_RENEWAL`. The implementation/data/control inventory, trust boundary, real desktop/narrow baseline, shared context, change flags, risks, and design-generation prompt are documented. No runtime code or operational data was changed.

The product owner approved proceeding from this gate. No design generation was requested or run.

## Phase 1 — Approved visual baseline implementation

Complete for the approved header-only scope on 2026-08-15:

- re-ran the repository/route audit for drift and retained the Phase 0 classification and boundaries;
- renewed `apps/yuta-pos/src/app/page.tsx` in place using real persisted data;
- enabled the existing `PosPageShell` prominent-header mode and full-width shell treatment while retaining bounded Home controls and order content;
- retained Home-specific title/copy/actions and the shared health strip; desktop keeps `Nouvelle commande` direct and moves `Cuisine`/`Gestion` into the approved three-line secondary menu, while the existing compact menu below `lg` contains all three destinations;
- preserved all three service-day views, GET search semantics, status/action mapping, direct routes, responsive order renderers, mobile FAB, and the current loader;
- made no database, API/contract, permission/auth, runtime/device, order/payment/kitchen/print, or data-access change.

The approved direction covered only the header. Dead `Filtres` and desktop ellipsis controls remain documented and unchanged; removal or real behavior requires a later approved scope.

## Phase 2 — Component refactor

Complete for the approved shared-header responsibility on 2026-08-15:

- extended the POS-wide `PosHeader` and `PosPageShell` composition API with generic `secondaryActions` and `secondaryMenuLabel` slots;
- made the shared header own desktop versus compact rendering, 48px prominent secondary trigger geometry, right-edge dropdown anchoring, and combined compact navigation;
- removed the Home-owned `<details>`/breakpoint/dropdown implementation while retaining Home-owned route labels and links;
- preserved backward compatibility for `/pos`, `/kitchen`, and order routes that continue to provide only `actions`;
- added `pos-header.test.tsx` contract coverage without introducing a new test framework;
- verified the same geometry and routes in development and production browsers against real persisted data.

No order-list decomposition, adjacent-route refactor, shared package change, or behavior/data boundary change was made.

Product-owner real-device correction completed on 2026-08-16:

- changed `PosPageShell` from an overridable centered `max-w-6xl` canvas to a full-viewport operational invariant;
- removed redundant `maxWidthClassName` call-site overrides;
- removed Home subheader/order-content and order-detail `max-w-7xl` caps;
- removed `max-w-7xl` from the authenticated management header and all management route-level main containers;
- retained intentional bounds on the order-entry form, management login card, dialogs, success cards, and other task-focused content;
- preserved all route behavior, local authorization, data loading, mutations, device ownership, and responsive breakpoints.

## Phase 3 — Approved interactions

Complete for the product-owner-approved Home cleanup on 2026-08-16:

- replaced the misleading `Filtres` submit affordance with an explicit `Rechercher` submit action for the existing GET form;
- removed the desktop ellipsis because it had no handler, menu, or repository-backed capability;
- removed the duplicated mobile allergy badge so each order presentation exposes the warning once;
- preserved `view` in the search form and `q` in segmented-view URLs;
- preserved every existing order detail/payment navigation and status-dependent action;
- added no filter model, overflow action, mutation, API, contract, schema, permission, realtime, offline queue, customer, fiscal, or printer capability.

Functional browser QA may exercise only GET navigation, query preservation, keyboard submission, accessible names, and document overflow. Safe retry remains deferred because Home still has no route-owned error boundary and adding one was not approved in this phase.

## Phase 4 — Data integration or extension

Complete as an explicitly approved no-op audit on 2026-08-16.

- The existing integrated boundary remains `apps/yuta-pos -> apps/site-agent -> packages/db-pos -> local PostgreSQL` using `@yuta/contracts/local-pos`.
- Home already receives every field required by the approved UI from persisted local order details.
- Stored totals/statuses, item/allergy fields, service-day filtering, and service-owned locks remain authoritative.
- Contract tests passed 23/23; site-agent passed 38 tests with six opt-in integration tests skipped; db-pos passed 14 tests with one opt-in integration test skipped.
- `POS_DATABASE_URL` and `RUN_POS_INTEGRATION_TESTS` were absent from the test shell, so suites capable of mutation remained skipped and the live local database was not used.
- No browser persistence, fixture, cloud sync, API, contract, schema, migration, index, caching, pagination, or runtime/device change was introduced.

The present `3 × (1 + N)` local HTTP fan-out and 200-order pre-filter cap remain documented risks. Changing list aggregation or pagination requires a separate performance/data proposal with an approved impact boundary; it is not silently folded into this page renewal.

## Functional and regression verification gate

Run these exact existing commands before Phase 5, scoped further only with an explicit recorded reason:

```bash
pnpm ui:pack:check pos-orders-home
pnpm docs:check
pnpm architecture:check
pnpm -r --if-present typecheck
pnpm format:check
pnpm typecheck:pos
pnpm test:pos
pnpm build:pos
pnpm typecheck:site-agent
pnpm test:site-agent
pnpm typecheck:db-pos
pnpm test:db-pos
pnpm test:pos:offline
```

Run contract/core/UI tests if later implementation touches those packages. Never claim lint; no lint command exists.

## Phase 5 — Visual and responsive QA

Complete on 2026-08-16 against the clean production build on port 3003 and current persisted local data.

- Captured 1366×768, 1024×768, 768×1024, and 390×844.
- Verified the desktop table, tablet rows, and mobile cards at their intended breakpoints with zero document-level horizontal overflow.
- Verified open and activity with one naturally persisted `sent` order; verified paid-today and search no-match truthful empty states.
- Verified generated service-day links preserve `q`; Home/detail/payment/new-order/kitchen/management routes remain repository-backed.
- Removed the last touch-target gap by raising Home segmented/search/order actions to at least 44px; repeated geometry found no visible target below 40px and order actions measured 44px.
- Verified accessible search/menu names, keyboard focus on the secondary-navigation summary, direct essential actions, and absence of dead controls.
- The current local service/database were healthy, Internet remained unknown, and printer remained not configured.

No order was created, edited, sent, cancelled, paid, transitioned, or printed for QA. Loading/framework error, safe retry, degraded local service/database, internal scrolling with many orders, and allergy appearance could not be safely or truthfully produced from current persisted conditions; source behavior and these evidence gaps remain recorded.

## Approved post-Phase-5 performance/data extension

The product owner subsequently approved the separately deferred level-two correction:

- add one validated `GET /api/v1/orders/home` read endpoint;
- move service-day filtering, view sorting, search, counts, item row count, and allergy aggregation to site-agent/db-pos;
- return 50-row pages with server-owned totals and preserve `view`/`q` in navigation;
- replace `3 × (1 + N)` local HTTP requests with one local HTTP request and three bounded database reads;
- remove the historical 200-newest-created-orders pre-filter cap;
- add the db-pos `(status, paid_at)` index migration for the paid-today predicate;
- retain all existing mutation services, locks, stored totals/statuses, local trust boundary, and authorization behavior.

The migration is generated but is not applied to the current operational database as a QA side effect. Unit/contract/route tests and read-only live verification are required; insufficient naturally persisted rows to exercise page two remains a truthful browser-QA limitation.

## Delivery evidence

Later delivery must report changed files, checks/results, unrelated baseline failures, real-data browser evidence, intentional deviations, deferred performance/data-access work, and unchanged database/API/auth/runtime flags. The package can become `implemented` only after final as-built synchronization.
