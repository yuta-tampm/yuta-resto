# POS Orders Home

Status: Implemented

Visibility: Engineering

Owner: YUTA product and engineering

Protocol revision: 4

Application: `apps/yuta-pos`

Target type: `PAGE`

Route / entry point: `/` (`apps/yuta-pos/src/app/page.tsx`)

Runtime family: restaurant local POS

Page classification: `EXISTING_PAGE`

Implementation class: `integrated`

Delivery mode: `EXISTING_CAPABILITY_RENEWAL`

Current capability maturity: persisted, operational, and data-backed; UI renewal candidate with known dead controls and incomplete route-level failure presentation

Package status: `implemented`

Scope status: `APPROVED`

Reference status: `APPROVED`

Inventory status: `COMPLETE`

Baseline status: `CAPTURED`

Phase 1 status: `COMPLETE` for the approved header-only scope

Phase 2 status: `COMPLETE` for the approved shared-header action refactor

Phase 3 status: `COMPLETE` for the approved dead-control and allergy-presentation cleanup

Phase 4 status: `COMPLETE_NO_CHANGE` after validating the existing local persisted-data path

Phase 5 status: `COMPLETE` with production as-built evidence

Post-Phase-5 performance/data extension: `IMPLEMENTED` and live read-only verified

Full-viewport correction: `COMPLETE` following real-device review on 2026-08-16

Design prompt status: `READY`

Shared context status: `RESOLVED`

Reference decision: Product direction reviewed on 2026-08-15 approves a full-width/prominent desktop header matching the established `/pos` header scale. Follow-up review keeps `Nouvelle commande` directly visible on desktop and moves `Cuisine`/`Gestion` into the three-line secondary-navigation menu. This is header-only direction, not approval of a full-page design.

## Current implementation

The Server Component at `/` is the local service home and command list. It loads one bounded persisted summary page through `posApi.listOrdersHome()`, `siteAgentClient`, `@yuta/contracts/local-pos`, `apps/site-agent`, and `packages/db-pos`. It provides open, paid-today, and all-today service-day views; server-side query search and pagination; responsive order renderers; navigation to order detail and payment; and the shared POS local health strip.

`/orders` is a legacy alias that redirects to `/`. The success screen after `/orders/[orderId]/items` also returns automatically to `/` after five seconds and exposes immediate links to `/` and `/pos`.

The repository already contains committed Phase 0 and implementation work for `pos-order-items` (`8c3dc37`, `54bc366`) and a committed structural import refactor at current `HEAD` (`50805a1`). No uncommitted POS route or `pos-order-items` changes existed before this package was created. Unrelated uncommitted `backoffice-equipe-salaries` files were preserved.

## Authority

Read in order:

1. root `AGENTS.md` and `apps/yuta-pos/AGENTS.md`;
2. `docs/README.md`, `docs/CURRENT_STATE.md`, and current architecture/operations documents;
3. `docs/products/pos/README.md`, `PRODUCT_SPEC.md`, `USER_GUIDE.md`, `OFFLINE_STRATEGY.md`, and `QA_CHECKLIST.md`;
4. `docs/ui/DESIGN_TO_CODE_WORKFLOW.md`, `DELIVERY_WORKFLOW_MODES.md`, `PAGE_PACK_PROTOCOL.md`, `YUTA_FRONTEND_RULES.md`, and `POS_FRONTEND_RULES.md`;
5. implemented contracts, site-agent services, db-pos schema, route code, and tests;
6. this page package;
7. current `@yuta/ui` exports/tokens;
8. visual references.

## Documents

- `PRODUCT_SCOPE.md`
- `UI_SPEC.md`
- `DATA_AND_INTERACTION_SPEC.md`
- `DESIGN_HANDOFF.md`
- `IMPLEMENTATION_PLAN.md`
- `ACCEPTANCE_CHECKLIST.md`

## References

- `references/phase-0-current-1366x768.png` — current real-data desktop baseline.
- `references/phase-0-current-390x844.png` — current real-data narrow baseline.
- `references/header-direction-full-width.png` — reviewed header-only direction supplied by the product owner.
- `references/phase-1-header-1366x768.png` — Phase 1 real-data desktop evidence.
- `references/phase-1-header-1024x768.png` — Phase 1 real-data compact-desktop evidence.
- `references/phase-1-header-768x1024.png` — Phase 1 real-data tablet evidence.
- `references/phase-1-header-390x844.png` — Phase 1 real-data mobile evidence.
- `references/phase-1-header-secondary-menu-1366x768.jpg` — reviewed desktop secondary menu open.
- `references/phase-1-header-secondary-menu-390x844.jpg` — compact mobile menu open.
- `references/phase-2-shared-header-menu-1366x768.jpg` — production evidence after shared-header ownership.
- `references/phase-2-shared-header-menu-390x844.jpg` — compact production evidence after shared-header ownership.
- `references/phase-3-interactions-1366x768.png` — production desktop evidence after dead-control cleanup.
- `references/phase-3-interactions-390x844.png` — production mobile evidence with accessible search submit.
- `references/phase-5-as-built-1366x768.png` — final desktop table evidence.
- `references/phase-5-as-built-1024x768.png` — final compact-desktop/tablet-row evidence.
- `references/phase-5-as-built-768x1024.png` — final tablet portrait evidence.
- `references/phase-5-as-built-390x844.png` — final mobile card evidence.
- `references/README.md` — capture conditions, state coverage, and non-authority.

Images are evidence and presentation guidance only.

## Shared UI context

Shell mode: `REUSE_APPROVED_SHARED_SHELL`.

Reuse `PosPageShell`, `PosHeader`, `PosConnectivityStatus`, semantic tokens, `@yuta/ui`, and `lucide-react`. On desktop, Home adopts the approved full-width/prominent header variant already established by `/pos`; `Nouvelle commande` remains directly visible while `Cuisine` and `Gestion` live in a dedicated three-line secondary menu. Below `lg`, the existing compact menu contains all three destinations. The Home title, description, command views, search, primary action set, responsive renderers, and mobile FAB remain route-specific. This page must remain a POS service screen, not a Backoffice dashboard or the authenticated management shell.

Phase 2 makes `PosHeader`/`PosPageShell` the owner of primary versus secondary action composition. Home now supplies route-specific action content through the generic `actions` and `secondaryActions` slots; it no longer owns breakpoint, trigger sizing, dropdown positioning, or duplicate compact-menu markup.

Product-owner follow-up on 2026-08-16 makes the prominent desktop mode the default for every non-management `PosPageShell` route while retaining compact behavior below `lg`. Route-owned workflow actions remain unchanged, and the direct `Nouvelle commande` navigation action remains exclusive to Home. Management and login keep their separate authorization-aware surfaces.

The same follow-up standardizes the three-line navigation trigger across those
service-time routes. Sibling routes expose `Commandes`, `Cuisine`, and
`Gestion`; Home omits its `Commandes` self-link and retains `Cuisine` and
`Gestion` in the menu.

The POS-wide shell now spans the available viewport on every operational route. Home subheader/order content and management route-level content no longer retain desktop `max-w-7xl` caps. Focused forms, login cards, dialogs, and success cards remain intentionally bounded.

Approved real destinations are `/pos`, `/kitchen`, `/management`, `/orders/[orderId]`, and `/orders/[orderId]/payment`. The prominent desktop header uses the full available viewport width and the established `/pos` scale. Desktop exposes `/pos` directly and groups `/kitchen` plus `/management` in secondary navigation; below `lg`, all header destinations collapse into the existing compact menu. The Home list changes from cards below `md`, to rows from `md` through `xl`, to a table at `xl`.

## Protected invariants

- `apps/yuta-pos -> apps/site-agent -> packages/db-pos -> local PostgreSQL`.
- No cloud synchronization or cloud tenancy substitution.
- The Home route currently has no authenticated staff session. Staff IDs are attribution, not authorization.
- Management PIN/bearer authorization applies to management routes, not automatically to Home/order endpoints.
- The 05:00 local service-day window and current view semantics remain authoritative.
- Stored order totals/statuses and service-owned order/payment/kitchen/print locks remain authoritative.
- Home reads must not mutate, recalculate, pay, cancel, send, print, or enqueue offline work.
- Existing local-service/database/Internet/printer health distinctions remain truthful.

## Change impact

```text
Files expected to modify: apps/yuta-pos Home/client files; apps/site-agent order route/service/tests; packages/contracts local-pos contract/tests; packages/db-pos order schema/migration metadata; POS product docs; this page pack
Files expected to create: focused Home summary tests; db-pos paid-at index migration and snapshot; Phase 0 through Phase 5 evidence within this stable page pack
Packages affected: apps/yuta-pos, apps/site-agent, packages/contracts, packages/db-pos, docs/ui/pages/pos-orders-home
Cross-application impact: local POS stack only
Database change: YES
API or contract change: YES
Permission/auth change: NO
Runtime/device change: NO
```

The original Phase 0 through Phase 5 UI renewal retained all four `NO` flags. The product owner subsequently approved the isolated performance/data extension recorded below; permission/auth and runtime/device remain unchanged.

## Phase 1 delivery

The product owner approved continuing to Phase 1 and the supplied header direction. Phase 1 renewed the existing Home header in place: `PosPageShell` now uses its established prominent-header mode, the header and truthful health strip span the viewport, the Home command controls remain independently bounded, and desktop action targets use the established prominent scale. A follow-up approval keeps `Nouvelle commande` directly visible on desktop and places `Cuisine`/`Gestion` in an accessible three-line menu. Below `lg`, the existing compact action menu remains authoritative and contains all three destinations.

No full-page design generation was requested or run. Phase 3 later removed the unsupported controls after explicit product-owner approval; it did not invent filter or overflow behavior.

## Phase 2 delivery

The product owner approved the shared-header refactor after reviewing the route-local menu limitation and test gap. `PosHeader` now provides generic secondary-action ownership while preserving every existing caller that supplies only `actions`. Home retains only its real route links. Two server-rendered contract tests protect the direct/secondary link composition, desktop trigger geometry classes, dropdown anchoring, and backward-compatible compact menu. Development and production browser QA verified equal 48px action/trigger heights, a 256px menu anchored 16px inside the viewport, correct destinations, and no document overflow.

## Phase 3 delivery

The product owner approved interaction cleanup on 2026-08-16. Home now labels the existing GET-form submit action `Rechercher`, removes the actionless desktop `Options` ellipsis, and presents the mobile allergy warning once per order. Search/view query semantics and every repository-backed order action remain unchanged. No new capability or mutation boundary was introduced. Phase 5 visual QA was subsequently completed.

## Phase 4 delivery

The product owner explicitly approved Phase 4 on 2026-08-16. Repository evidence reconfirmed that Home is already an integrated persisted-data page and needs no data extension for the approved UI. Contracts, site-agent, and db-pos type/test gates passed while opt-in database integration suites remained disabled, protecting the live local database. The known repeated list/detail fan-out and 200-order pre-filter cap remain documented for a separate performance proposal. Database, API/contract, permission/auth, and runtime/device change flags remain `NO`.

## Phase 5 delivery

The product owner explicitly approved Phase 5 on 2026-08-16. A clean production build was verified at 1366×768, 1024×768, 768×1024, and 390×844 using one naturally present persisted `sent` order. The intended desktop/tablet/mobile renderers were exclusive at their breakpoints; every viewport had zero document-level horizontal overflow. Home controls and order actions now meet the 44px touch target, accessible names and focus remain available, all three service-day views and search no-match are truthful, and dead controls remain absent. No operational mutation was used. Unavailable real states and safe degraded/error conditions remain explicitly documented rather than fabricated.

## Post-Phase-5 performance/data extension

After Phase 5, the product owner explicitly approved returning to the separately deferred performance/data work. Home now makes one local HTTP request to `GET /api/v1/orders/home` instead of repeating list-plus-detail loading for every view and order. Site-agent owns the 05:00 service-day predicates, search, sort, counts, 50-row pagination, item row count, and allergy aggregation. The data path uses three bounded database reads independent of page population and no longer pre-filters against only the newest 200 created orders.

The extension adds local-pos transport schemas and a db-pos `(status, paid_at)` index migration. It does not add a mutation, table/column, cloud synchronization, staff authorization, offline queue, realtime, device control, or presentation-owned calculation. The migration was generated but was not applied to the running local database merely for QA.

## Prompt order

1. `prompts/00_REPOSITORY_ANALYSIS.md`
2. `prompts/01_VISUAL_BASELINE.md`
3. `prompts/02_COMPONENT_REFACTOR.md`
4. `prompts/03_INTERACTIONS.md`
5. `prompts/04_DATA_INTEGRATION.md`
6. `prompts/05_VISUAL_QA.md`

Review and approve each phase before starting the next.

## Design approval

The product owner approved the supplied full-width/prominent header direction on 2026-08-15, then approved keeping `Nouvelle commande` direct and placing `Cuisine`/`Gestion` in the shared secondary menu. Subsequent real-device review approved the full-viewport POS canvas. No generated full-page design was requested; the approved owner-supplied direction and final as-built matrix are the visual authority, while repository-backed routes/data/behavior remain authoritative over image content.

## Stop conditions

Stop for product/engineering approval if work would add a filter panel, overflow actions, cancellation/printing/customer features, a new business route/status/role/session, realtime transport, offline mutation queue, any API/contract/schema/migration beyond the approved read-only Home endpoint/index, cloud sync, device control, or presentation-owned total/status transition. Stop if a visual proposal changes the POS shell or management authorization boundary.

## Final delivery and as-built status

Phase 3 implementation location: `apps/yuta-pos/src/app/page.tsx`; prior shared-header/full-viewport work remains in `PosHeader.tsx`, `PosPageShell.tsx`, order call sites, and management route wrappers.

Phase 3 verification: scoped POS typecheck, 13 files/54 tests, production build, page-pack check, documentation check, architecture check, recursive workspace typecheck, scoped Prettier, browser DOM/accessibility/overflow assertions, and `git diff --check` pass. Repository-wide `format:check` remains red on 29 pre-existing out-of-scope files. The offline harness was not run because its required free port 3004 was occupied by the deliberately running site-agent.

Phase 4 verification: `@yuta/contracts` passed 23/23 tests; site-agent typecheck passed and tests reported 38 passed/6 skipped; db-pos typecheck passed and tests reported 14 passed/1 skipped. Skipped suites require explicit integration environment variables, which were absent to protect the live database.

Post-Phase-5 verification: contracts pass 24/24; site-agent passes 42 tests with seven opt-in integration tests skipped; db-pos passes 14 tests with one opt-in integration test skipped; POS passes 55/55; the POS production build and recursive workspace typecheck pass. Documentation, architecture, page-pack, scoped Prettier, and diff checks pass. Repository-wide `format:check` remains red on the same 29 out-of-scope baseline files. The offline harness truthfully stops because port 3004 is occupied by the required running site-agent; the stack was not stopped merely to satisfy the harness. The production route and endpoint were rechecked read-only against the naturally persisted three-item order.

Functional/regression QA result: `PASS` for the implemented Home package and approved performance/data extension.

Visual/browser evidence: the final Phase 5 matrix in `references/` and metrics in `references/README.md`. Post-extension production QA retained 1366/1366 CSS-pixel geometry with the natural persisted order showing three item rows and no document overflow.

Intentional deviations: no route-owned safe-retry/error boundary was added; keyboard focus and native semantics were verified, but automation did not reliably dispatch Enter and device keyboard activation remains a follow-up. No persisted allergy order existed, so the single-badge correction lacks real-data visual evidence.

Deferred proposals and risks: route-owned loading/error/safe retry, real many-order page-two browser evidence, and richer persisted-state visual coverage remain unimplemented or unavailable.

As-built documentation status: `COMPLETE`
