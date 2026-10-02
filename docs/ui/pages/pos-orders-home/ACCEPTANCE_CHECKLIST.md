# POS Orders Home — Acceptance Checklist

## Phase 0 repository and application

- [x] `git status` was checked before page-pack work.
- [x] Unrelated dirty Backoffice files were preserved.
- [x] `pos-order-items` and structural-refactor history was checked; no related uncommitted files existed.
- [x] Root/application instructions and current workflow, POS product, operator, offline, QA, local-development, and deployment sources were reviewed.
- [x] Target is `apps/yuta-pos` `/`, `PAGE`, `EXISTING_PAGE`, `integrated`, `EXISTING_CAPABILITY_RENEWAL`.
- [x] Current persisted-data maturity, loader/contract/service/db ownership, side effects, and performance risk are recorded.
- [x] Trust/session, staff-attribution, management-auth, service-day, cloud-separation, and device boundaries are recorded.
- [x] Shared global/application/flow/page context is resolved.
- [x] Exactly one shell mode, `REUSE_APPROVED_SHARED_SHELL`, is recorded.
- [x] Product direction approves the existing `/pos` full-width/prominent desktop header scale for Home, without copying unsupported `/pos` content/actions.
- [x] Every visible control/route and status-based primary action is audited.
- [x] Dead `Filtres` and desktop `Options` controls are identified and not promoted to capabilities.
- [x] Real desktop and narrow baselines were captured without fixtures or operational mutations.
- [x] Baseline date, route, viewports, data/health conditions, overflow metrics, and missing states are recorded.
- [x] Loader reads were confirmed not to recalculate or mutate orders.
- [x] The design prompt is self-contained and explicitly excludes unsupported concepts.
- [x] Database, API/contract, permission/auth, and runtime/device change flags are all `NO`.
- [x] No runtime source change remains from Phase 0 QA.

## Product-owner approval gates

- [x] Product owner approved Phase 0 inventory and protected invariants by requesting Phase 1.
- [ ] Product owner approved scope and dead-control recommendation.
- [x] Product owner approved baseline and shared context by requesting Phase 1.
- [ ] Product owner explicitly requested design generation.
- [ ] Generated design is recorded as `DRAFT` and reviewed against repository reality.
- [x] Product owner approved the supplied header-only design reference.
- [x] Product owner explicitly approved Phase 1 implementation.
- [x] Product owner explicitly approved the Phase 2 shared-header refactor.
- [x] Product owner approved the 2026-08-16 app-wide full-viewport correction after testing on a real device.
- [x] Product owner explicitly approved Phase 3 interaction cleanup.
- [x] Product owner explicitly approved the Phase 4 data-integration audit.
- [x] Product owner explicitly approved Phase 5 visual and delivery QA.
- [x] Product owner explicitly approved the separately deferred post-Phase-5 performance/data correction.

## Existing-page protection for later phases

- [x] Real data is not replaced by fixtures.
- [x] Service-day cutoff/view membership and search query preservation remain unchanged.
- [x] Stored status/total authority and item-count semantics are preserved.
- [x] Order/payment/kitchen/print mutations and locks remain site-agent-owned.
- [x] Home remains outside management-session authorization.
- [x] No cloud tenancy/synchronization, offline mutation queue, or invented realtime behavior is added.
- [x] No unsupported filter/overflow/customer/provider/fiscal/printer action was activated.

## UI and responsive QA for later phases

- [x] Existing POS service-time shell, full-width/prominent desktop header variant, compact menu below `lg`, and health strip are reused.
- [x] Desktop keeps `Nouvelle commande` direct and exposes `Cuisine`/`Gestion` only through the accessible three-line secondary menu.
- [x] Sibling non-management service-time routes use the same three-line trigger with `Commandes`/`Cuisine`/`Gestion`; Home omits its self-link.
- [x] `PosHeader`/`PosPageShell` own secondary-menu rendering; Home no longer owns menu geometry or breakpoint markup.
- [x] Header actions map only to `/pos`, `/kitchen`, and `/management`.
- [x] Order actions remain mapped only to current detail/payment routes and status rules.
- [x] Selected-view empty and search no-match states are truthful; unavailable loading/error/retry/degraded evidence gaps are recorded.
- [x] Allergy appears once per intended order presentation and uses text plus an icon; no current persisted allergy order existed for visual evidence.
- [x] No document-level horizontal overflow at 1366×768, 1024×768, 768×1024, and 390×844.
- [x] Keyboard focus, icon accessible names, and touch targets are verified; many-order internal scrolling remains a real-data evidence gap.
- [x] Essential per-order actions remain direct; only approved global secondary destinations move into the header menu.
- [x] Development and production QA both verify 48px direct/menu controls, a 256px dropdown, a 16px right inset, correct routes, and no document overflow.
- [x] `PosPageShell`, Home subheader/content, and authenticated management wrappers no longer impose `max-w-6xl` or `max-w-7xl` route caps.
- [x] Focused forms, dialogs, success cards, and management login remain intentionally bounded for readability.
- [x] Production geometry verifies Home at 1920/1920, 1366/1366, and 390/390 CSS pixels with no document-level horizontal overflow.
- [x] Production geometry verifies `/pos` and `/kitchen` shells at 1920/1920 CSS pixels; the `/pos` form remains intentionally bounded.
- [x] Unauthenticated management routes keep a full-viewport canvas and redirect to the bounded login card; authenticated management geometry remains session-gated.
- [x] The unsupported `Filtres` control is replaced by the truthful existing GET action `Rechercher`.
- [x] The actionless desktop `Options` ellipsis is removed without inventing overflow behavior.
- [x] Mobile allergy presentation renders one warning per order.
- [x] Phase 3 production QA finds no `Filtres` or `Options` button at 1366×768 and 390×844.
- [x] The search submit has the accessible name `Rechercher` at desktop and mobile breakpoints.
- [x] GET search and service-day link generation preserve `view` and `q` without operational mutation.
- [x] Phase 3 desktop/mobile captures have no document-level horizontal overflow.
- [x] Phase 4 reconfirms that current persisted detail responses provide every approved Home field.
- [x] Phase 4 introduces no database, API/contract, permission/auth, runtime/device, fixture, or cloud change.
- [x] The `3 × (1 + N)` fan-out and 200-order pre-filter cap remain deferred to a separately approved performance/data proposal.
- [x] Phase 5 captured the required 1366×768, 1024×768, 768×1024, and 390×844 production matrix.
- [x] Desktop, tablet, and mobile renderers are exclusive at their intended breakpoints.
- [x] Visible Home controls have no target below 40px and direct order actions measure 44px.
- [x] The approved performance/data proposal replaces Home fan-out with one bounded summary endpoint.
- [x] Service-day predicates, search, sort, tab counts, item row count, and allergy aggregation are site-agent-owned.
- [x] Home results use server-side 50-row pagination and no longer depend on the old 200-row pre-filter.
- [x] The new contract/route are read-only and preserve existing order/payment/kitchen/print mutation ownership.
- [x] The db-pos paid-today query index migration is generated but not applied to the operational QA database.

## Verification for later phases

- [x] `pnpm ui:pack:check pos-orders-home` is the discovered pack check.
- [x] Exact repository/POS/site-agent/db-pos/offline commands are recorded in `IMPLEMENTATION_PLAN.md`.
- [x] `pnpm docs:check`
- [x] `pnpm architecture:check`
- [x] `pnpm -r --if-present typecheck`
- [ ] `pnpm format:check`
- [x] `pnpm typecheck:pos`
- [x] `pnpm test:pos`
- [x] `pnpm build:pos`
- [x] `pnpm typecheck:site-agent`
- [x] `pnpm test:site-agent`
- [x] `pnpm typecheck:db-pos`
- [x] `pnpm test:db-pos`
- [ ] `pnpm test:pos:offline`

Phase 0 documentation checks actually run are recorded in the delivery report; unchecked entries above remain later implementation gates unless updated with truthful results.

Phase 1 intentionally did not run site-agent, db-pos, or offline suites because it changed presentation only and did not touch their runtime, contracts, persistence, or mutation behavior. Their commands remain later full-delivery gates.

Phase 3 attempted `pnpm test:pos:offline`, but the harness correctly stopped because port 3004 was occupied by the required running site-agent. The service was not stopped because the product owner explicitly requires POS to run with the full local stack. No offline behavior changed in Phase 3.

Phase 4 additionally ran `@yuta/contracts` tests (23/23), site-agent tests (38 passed, six opt-in integration tests skipped), and db-pos tests (14 passed, one opt-in integration test skipped). The shell had neither `POS_DATABASE_URL` nor `RUN_POS_INTEGRATION_TESTS`, so mutation-capable integration suites did not use the live local database.

The post-Phase-5 extension passes contracts 24/24, site-agent 42 passed/7 skipped, db-pos 14 passed/1 skipped, and POS 55/55 before full repository gates. The new skipped site-agent case is an opt-in disposable-database test for the actual summary SQL. A real-data page-two state is unavailable without manufacturing more orders, so pagination-browser evidence is limited to source/unit coverage.

Phase 2 added two shared-header contract tests. The full-viewport correction adds a shared-shell width assertion; the scoped POS suite now passes 13 files and 54 tests.

The initial Phase 1 recursive workspace typecheck passed. During the secondary-menu follow-up, the same command reached all POS/local packages successfully but failed in unrelated generated Backoffice `.next/dev/types/routes.d.ts` syntax; `pnpm typecheck:pos` remained green. The generated `apps/backoffice/next-env.d.ts` side effect was restored exactly.

## Completion

- [x] Functional/regression QA precedes final visual QA.
- [x] Intentional deviations and deferred risks are recorded.
- [x] Stable page pack matches the Phase 3 as-built implementation.
- [x] Package status changes to `implemented` only after as-built synchronization.
