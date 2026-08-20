# POS Management Reports — Acceptance Checklist

Status: Phase 5 complete

Visibility: Engineering

## Phase 0 repository gate

- [x] Git status was inspected before documentation changes.
- [x] Root and relevant nested instructions were read.
- [x] Current POS and full UI workflow authority were inspected.
- [x] Route absence and hub placeholder were confirmed from source.
- [x] Classification is `NEW_PAGE` / `NEW_CAPABILITY_DISCOVERY`.
- [x] Local Management shell/session and admin/manager boundary are recorded.
- [x] Site-agent, db-pos, contracts, orders, payments, splits, cancels, refunds,
      service day, pagination, offline, and tests were inventoried.
- [x] No operational data was queried or mutated.
- [x] No runtime code, route, component, fixture, API, contract, schema, or
      migration was created or changed.
- [x] Baseline is truthfully `NOT_APPLICABLE`.
- [x] Shared context is `RESOLVED` with `REUSE_APPROVED_SHARED_SHELL`.
- [x] Product/data decisions `R0-01` through `R0-10` are explicit.
- [x] Phase 0 stops before Phase 1 approval.

## Product approval gate

- [x] Approve exact 05:00 service day and require Luna/`site-agent`
      `Europe/Paris` runtime pinning before integration.
- [x] Approve paid-payment principal revenue semantics.
- [x] Approve final paid-order count semantics.
- [x] Approve service-day-scoped open count.
- [x] Approve created-or-paid activity membership and cancelled rows.
- [x] Approve first-slice row fields and defer per-order paid principal.
- [x] Approve refund/net/fiscal/accounting exclusions.
- [x] Approve manual point-in-time refresh and no polling/cache/export/range.
- [x] Approve pagination and state/recovery copy direction.
- [x] Approve hub-card availability only with real integration.

## Design gate

- [x] Phase 1 is explicitly authorized.
- [x] Desktop and narrow references are generated from the curated context.
- [x] Shared Management shell is unchanged.
- [x] No sidebar, new navigation, chart, export, range, fiscal/cloud concept, or
      unsupported action is introduced.
- [x] Loading, empty, error, login/forbidden, and narrow states are reviewed.
- [x] Reference status becomes `APPROVED`, or an approved no-image decision is
      recorded.
- [x] Scope status becomes `APPROVED` only after product decisions are resolved.

## Data and authorization gate

- [x] The report endpoint requires and validates the local bearer before data
      access.
- [x] Active admin and manager succeed; missing/expired/staff/kitchen fail
      closed with no financial response.
- [x] One server-captured service window drives every metric and row predicate.
- [x] Paid revenue sums paid payment principal by payment `paidAt` only.
- [x] Partial and split payments are counted once; tips/tender/change are absent.
- [x] Final paid orders are counted once; partial/split-open orders are not.
- [x] Open and activity membership match approved predicates.
- [x] Cancelled and refunded states match approved semantics.
- [x] Rows are deduplicated, minimized, deterministically ordered, and bounded.
- [x] No browser aggregation, cloud read/sync, schema, report table, or migration
      is introduced without separate approval.

## Phase 2 prototype gate

- [x] Phase 2 was explicitly authorized after Phase 00 recheck.
- [x] The route is available only when `NODE_ENV` is `development` and returns
      `notFound()` otherwise.
- [x] Shared `ManagementHeader` and current `@yuta/ui` primitives are reused.
- [x] The prototype is visibly labelled and every order number is `DEMO-*`.
- [x] No site-agent, session, operational-data, API, contract, schema, or
      migration call/change was introduced.
- [x] At the Phase 2 gate, refresh, pagination, and order-opening actions were
      disabled and no real order link was rendered.
- [x] The Management hub card remains unavailable with `href: null`.
- [x] Focused presentation and environment-gate tests pass.
- [x] Fixture and development-gate removal is required before Phase 4.
- [x] Phase 3 remained separately approval-gated until explicit authorization.

## Phase 3 interaction gate

- [x] Phase 3 was explicitly authorized after the completed Phase 2 handoff.
- [x] Refresh exposes disabled/pending and polite completion feedback while
      keeping all state browser-local and fictional.
- [x] Pagination is bounded and deterministic; page changes restore focus to
      the activity heading.
- [x] Narrow rows expose one accessible disclosure using `aria-expanded` and
      `aria-controls`.
- [x] Demo-order activation focuses a warning and cannot navigate to a real POS
      order.
- [x] No `/orders/*` link, site-agent call, session read, operational ID/data,
      hub link, mutation, range, export, polling, cache, API, contract, schema,
      or migration was added.
- [x] Fixture page size and timing are explicitly non-production test devices.
- [x] The interaction map and response data dictionary are final for Phase 4
      review.
- [x] Phase 4 remained separately approval-gated until explicit authorization.

## UI and interaction gate

- [x] Page uses `ManagementHeader` and an in-content return link.
- [x] Exact service interval and generated/refresh time are visible.
- [x] Metrics do not show false zeros while loading.
- [x] Empty state distinguishes zero activity from failure.
- [x] Local-service/database outage gives truthful retry; Internet-only outage
      does not falsely block local reporting.
- [x] Session expiry reveals no financial content and has a clear login path.
- [x] Each order link opens the correct `/orders/<orderId>`.
- [x] No report mutation, payment, cancellation, refund, export, or device action
      exists.
- [x] Pagination and refresh preserve accessible focus and pending feedback.

## Functional test gate

- [x] 04:59/05:00, half-open boundaries, and DST behavior are tested.
- [x] Full, partial, split, void, pending, failed, refunded, and cancellation
      cases are tested.
- [x] Older-created/paid-today and same-day-created cases are tested.
- [x] More than 200 matching orders remain discoverable.
- [x] Authorization denial and no-body behavior are tested.
- [x] Site-agent/client contracts reject malformed data.
- [x] Existing order, payment, POS Home, session, and offline tests still pass.

## Visual and accessibility gate

- [x] Phase 5 was explicitly authorized by the product owner on 2026-08-20.
- [x] Browser evidence exists at 1366×768, 1024×768, 768×1024, and 390×844.
- [x] No horizontal page overflow or clipped action exists.
- [x] Narrow rows preserve information priority without a clipped table.
- [x] Controls are keyboard-operable, visibly focused, and at least 44px where
      touch applies.
- [x] Status/error meaning is textual, not color-only.
- [x] Loading announcements and recovery paths are accessible.

## Verification and completion

- [x] `pnpm ui:pack:check pos-management-reports`
- [x] `pnpm docs:check`
- [x] `pnpm architecture:check`
- [x] `pnpm -r --if-present typecheck`
- [x] Targeted POS/site-agent/db-pos/contracts tests and typechecks as applicable
- [x] `pnpm test:pos:offline`
- [x] `pnpm build:pos`
- [x] Targeted formatting and `git diff --check`
- [x] Guarded integration tests use only an authorized disposable database.
- [x] Page pack and current POS docs match the Phase 5 as-built result.
- [x] No unrelated changes were altered and no commit, push, reset, operational
      seed, or operational query occurred.

The full-repository `pnpm format:check` was also run. It remains red on 23
pre-existing files outside this Phase 4 scope; scoped formatting passes. The
first offline run then exposed the new fail-closed timezone requirement in the
harness, and the second met a pre-existing port-3003 listener. The final run
passed on isolated non-default ports and executed the guarded report test
against only its disposable PostgreSQL database.

Phase 5 browser QA used a fresh production origin and an isolated disposable
database. Six synthetic success rows, a temporary 57-row pagination set, an
empty state, and a route-specific database failure were exercised and then
removed with the disposable runtime. All four viewports had zero horizontal
overflow, report actions measured at least 44px, pagination restored visible
heading focus, the direct order link resolved exactly, recovery succeeded, and
browser warning/error logs were empty.
