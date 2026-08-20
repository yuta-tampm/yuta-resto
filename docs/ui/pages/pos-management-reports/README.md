# POS Management Reports

Status: Phase 5 as-built QA complete

Visibility: Engineering

Owner: YUTA product and engineering

Protocol revision: 4

Application: `apps/yuta-pos`

Target type: `PAGE`

Route / entry point: `/management/reports`

Runtime family: restaurant-local POS

Page classification: `NEW_PAGE`

Implementation class: `integrated`

Delivery mode: `NEW_CAPABILITY_DISCOVERY`

Package status: `implemented`

Scope status: `APPROVED`

Reference status: `APPROVED`

Inventory status: `COMPLETE`

Baseline status: `NOT_APPLICABLE`

Design prompt status: `READY`

Shared context status: `RESOLVED`

Current generated references:

- `references/design-proposal-01-desktop.png`;
- `references/design-proposal-02-mobile.png`.

Current production as-built references:

- `references/phase-05-as-built-1366x768.png`;
- `references/phase-05-as-built-1024x768.png`;
- `references/phase-05-as-built-768x1024.png`;
- `references/phase-05-as-built-390x844.png`;
- `references/phase-05-empty-390x844.png`;
- `references/phase-05-error-390x844.png`.

The product owner approved both references on 2026-08-20 for hierarchy,
density, responsive composition, fixed-service-day presentation, and the
read-only operational direction.
`design-proposal-01-mobile.png` is retained as the superseded first generation;
it used `période sélectionnée`, which incorrectly implied date-range scope.

## Current implementation

`/management/reports` is now a real authenticated Server Component using the
shared `ManagementHeader`. The Management hub links to it as available. The POS
validates the HttpOnly Management session, sends its bearer only from the
server-side site-agent client, and renders validated response values with
manual refresh, loading, real-zero/empty, local dependency error, pagination,
and direct `/orders/{orderId}` links.

`GET /api/v1/management/reports` is a strict, admin/manager-protected site-agent
read. It captures one 05:00 service window, sums paid payment principal, counts
final paid and service-day open orders, and returns a bounded/deduplicated
activity page. All aggregation remains server/database-side. There is no report
table, migration, cloud read/sync, browser aggregation, export, polling, cache,
fiscal/accounting claim, mutation, or device behavior.

Every Phase 2–3 fixture, `DEMO-*` value, development gate, simulated timer, and
blocked demo-order action has been removed. Site-agent now requires
`TZ=Europe/Paris` and verifies the runtime-resolved timezone at startup. Luna
host timezone verification remains an explicit deployment preflight; this
repository change does not mutate the server machine.

## Authority

1. Root, POS, site-agent, contracts, and db-pos `AGENTS.md` files.
2. `docs/CURRENT_STATE.md`, current POS product, operator, offline, QA,
   architecture, and operations documentation.
3. Current local-pos contracts, db-pos schemas, site-agent services/routes,
   POS session/client code, and behavior tests.
4. `docs/ui/README.md`, `DESIGN_TO_CODE_WORKFLOW.md`,
   `DELIVERY_WORKFLOW_MODES.md`, `PAGE_PACK_PROTOCOL.md`,
   `UI_WORKFLOW_DELIVERY_CHECKLIST.md`, and `UI_PACK_TOOLING_SPEC.md`.
5. `docs/ui/YUTA_FRONTEND_RULES.md` and
   `docs/ui/POS_FRONTEND_RULES.md`.
6. The approved local Management shell and its as-built evidence.
7. This package and later explicit product/design/data approval.
8. `@yuta/ui` exports, semantic tokens, and approved visual references.

## Phase 0 Implementation Inventory (historical baseline)

1. **Target:** new local POS Management page `/management/reports`.
2. **Classification:** `NEW_PAGE` / `NEW_CAPABILITY_DISCOVERY`; the hub
   placeholder is not a route or implemented capability.
3. **Future implementation class:** integrated, read-only, local operational
   reporting. It is not device-coupled and owns no mutation.
4. **Containing route:** `apps/yuta-pos/src/app/management/page.tsx` requires a
   local Management session and composes `ManagementHeader` plus
   `ManagementModules`.
5. **Placeholder:** `ManagementModules.tsx` renders `Rapports locaux` with
   `href: null`; Phase 1 must not make it available until a truthful route state
   is approved.
6. **Shell:** reuse `management/_components/ManagementHeader.tsx`, full-width
   Management canvas, signed-in user/role, return-to-POS, account menu, and an
   in-content return link. Do not use `PosPageShell` or a Backoffice shell.
7. **Local session:** the HttpOnly `yuta_pos_management_session` cookie is read
   server-side. `requireLocalManagementCredentials()` validates the bearer with
   site-agent and accepts only active `admin` or `manager` users. Staff and
   kitchen roles are not report readers.
8. **Trust boundary:** a new financial report read must re-authorize the bearer
   at site-agent. Browser role values, query-derived scope, and the current
   unauthenticated orders-home endpoint are not authorization.
9. **Runtime/data owner:** `apps/yuta-pos -> apps/site-agent -> packages/db-pos
-> local PostgreSQL`. Reports never read or synchronize cloud data.
10. **Current transport gap:** `@yuta/contracts/local-pos` has no report route,
    query, response, aggregate, or row schema. `site-agent-client.ts` and
    `pos-api.ts` have no report method.
11. **Current persistence:** `orders`, `order_items`, `checks`, and `payments`
    already hold the required source facts. No report table or persisted daily
    aggregate exists or is proposed for the first slice.
12. **Service day:** `@yuta/core#getServiceDayWindow()` returns the half-open
    window `[05:00 local process time, 05:00 next local calendar day)`. Before
    05:00, the start is the previous calendar day. DST follows host wall-clock
    transitions. No establishment-timezone field, `TZ` setting, or runtime
    timezone assertion currently exists.
13. **Open-order authority:** POS Home defines open as order status `draft`,
    `sent`, `preparing`, `ready`, or `served`, with `createdAt` inside the
    current service day. Paid and cancelled orders are excluded.
14. **Paid-order authority:** count orders once when `status = paid` and
    `orders.paidAt` is inside the service day. A split order becomes paid only
    after all non-void checks are paid; partial payments do not increment this
    count.
15. **Paid-revenue authority:** repository QA says a paid payment amount appears
    in daily revenue. The proposed source is the sum of `payments.amountCents`
    for `status = paid` and `payments.paidAt` inside the service day. This
    includes partial and split-check payments exactly once and excludes cash
    tender/change and tips from revenue.
16. **Order totals are not revenue:** `orders.totalCents` is an order/combo
    snapshot. Summing it would omit partial payments and can double count or
    misstate split activity. Financial aggregation remains site-agent-owned.
17. **Cancelled semantics:** current cancellation is allowed only before any
    paid payment. It marks the order cancelled, cancels active items, and voids
    unpaid checks. Cancelled orders contribute neither open count, paid count,
    nor revenue; a cancelled order created in the service day may remain in the
    day's activity list with a clear cancelled state.
18. **Refund semantics:** `refunded` exists in the payment enum and columns, but
    no current service, route, UI, or test performs a refund. The first report
    cannot claim gross/net sales, refund accounting, reversal dates, or fiscal
    reconciliation. Treatment of future refunded rows requires approval.
19. **Split semantics:** open or paid checks are not orders. Payment amounts are
    summed from payment rows; paid orders are counted once from the final order
    state; void checks contribute nothing. The list links to the parent order,
    not a check-specific route.
20. **Day-list candidate:** reuse the POS Home activity predicate—orders created
    or fully paid in the service day—so an older order paid today appears once,
    and a same-day cancelled order remains visible. Exact columns and whether
    the list must expose per-order paid amounts require approval.
21. **Navigation target:** each row uses the trusted response `order.id` to build
    `/orders/<orderId>`. It opens the existing POS order detail, never a cloud
    order, report-detail clone, payment screen, or check route.
22. **Loading/freshness:** no report cache, polling, SSE subscription, or offline
    snapshot exists. The first slice should be a server-owned point-in-time read
    with explicit refresh/retry, not a live accounting ledger.
23. **Offline/degraded:** loss of Internet alone does not block local reporting.
    Loss of POS server, site-agent, or local PostgreSQL blocks the read and must
    show a truthful local-service/database error. No stale result may be shown
    as current unless a cache policy is separately approved.
24. **Session states:** missing/invalid/expired sessions currently redirect to
    `/management/login`. A protected site-agent report endpoint must return 401
    for invalid session and 403 for non-admin/manager; no financial body may be
    returned on denial.
25. **Empty state:** zero metrics plus an empty list is a valid service-day
    result, not a system error. Copy must explain the 05:00-to-05:00 window.
26. **Pagination:** the day list must be bounded and deterministic. The current
    orders-home pattern uses page/limit and stable time/id ordering; unbounded
    all-history reads or client aggregation are forbidden.
27. **Shared UI:** `ManagementHeader`, `PageHeader`, `Card`, `Badge`, `Button`,
    `Alert`, `EmptyState`, `ErrorState`, `Skeleton`, semantic tokens, Lucide
    icons, French copy, visible focus, and touch-safe controls are available.
28. **No current baseline:** `NOT_APPLICABLE` because the page is absent. The
    approved Management home and establishment as-built references provide the
    containing-shell context only.
29. **Tests to reuse/extend later:** orders-home service-day/pagination tests,
    financial integration tests, management auth route/server tests, POS
    site-agent-client tests, and local contract/schema tests. No report test
    currently exists.
30. **Exact Phase 0 checks:** `pnpm ui:pack:check pos-management-reports`,
    `pnpm docs:check`, targeted Prettier, and `git diff --check`. Runtime code,
    data, schema, API, and contracts do not change in this phase.

## Shared UI context

Shared context status is `RESOLVED`. Shell mode is
`REUSE_APPROVED_SHARED_SHELL`.

- Reuse the approved dark `ManagementHeader`, account/session area,
  return-to-POS action, full-width operational canvas, and responsive
  Management conventions.
- Reuse an in-content `Retour à la gestion` route action and the established
  French operational tone.
- A report summary may adapt into a compact metric grid and one bounded list.
- Do not add a sidebar, drawer, bottom navigation, date-range navigation,
  charts, export controls, cloud selector, fiscal badges, or a second account
  area.

## Protected invariants

- Local-only data and `POS -> site-agent -> db-pos` ownership.
- Server-side active local admin/manager authorization and HttpOnly cookie flow.
- Integer minor units, authoritative payment rows, and service-owned financial
  calculation.
- Current order, payment, split, combo snapshot, cancellation, and historical
  semantics.
- The 05:00 service-day predicates until product explicitly approves a change.
- Bounded deterministic reads, truthful local-service failure, and no cloud
  synchronization.
- Read-only reporting: no order/payment/check mutation, refund, close-day,
  export, fiscal, accounting, or device behavior.

## Change impact

```text
Files expected to modify: apps/yuta-pos Management hub/client/login; site-agent env/server/route/service registration; local-pos contracts; offline harness; focused current POS/deployment docs/tests; this package
Files expected to create: real apps/yuta-pos/src/app/management/reports components/loading/presentation; protected site-agent report route/service; focused unit/integration/presentation tests; Phase 5 as-built references
Packages affected: apps/yuta-pos, apps/site-agent, packages/contracts, docs
Cross-application impact: none
Database change: NO
API or contract change: YES
Permission/auth change: NO
Runtime/device change: YES
```

The implementation reuses existing admin/manager authorization and source
tables. No report table, migration, cloud integration, device change, or
browser-owned aggregation was introduced. A measured performance problem may
create a later index proposal; it is not pre-approved by this pack. The runtime
impact is the fail-closed `TZ=Europe/Paris` site-agent requirement, not a device
change.

## Approved product/data decisions

The product owner approved `R0-01` through `R0-10` on 2026-08-20:

- `R0-01`: retain the current half-open 05:00-to-05:00 service-day rule and
  require the Luna host plus `site-agent` runtime to be explicitly pinned to
  `Europe/Paris` before real report integration. A new timezone field is not
  part of this page slice.
- `R0-02`: paid revenue is paid payment principal captured during the service
  day, including partial/split payments and excluding tips, tendered cash,
  change, pending/failed rows, and refunded rows.
- `R0-03`: paid-order count is final paid parent orders by `orders.paidAt`, one
  per order, never payments or checks.
- `R0-04`: open count remains service-day-scoped and uses the current POS Home
  non-final statuses.
- `R0-05`: day activity uses `created during day OR fully paid during day`,
  includes same-day cancelled orders, and includes older orders paid today.
- `R0-06`: the first list uses order number, table/service label, order type,
  status, created/paid times, order total, payment mode when useful, and the
  direct order link. Per-order service-day paid principal is deferred.
- `R0-07`: refund, net revenue, fiscal, accounting, and reconciliation semantics
  remain explicitly excluded.
- `R0-08`: the first slice is a point-in-time read with manual refresh and no
  polling, cached offline result, export, or date-range control.
- `R0-09`: default page size is 50, maximum 100, with the proposed truthful
  empty/error/login recovery states and copy direction.
- `R0-10`: the Management hub card becomes available only with the first real
  authorized vertical slice, never for a fixture-only prototype.

## Documents and prompt order

See `PRODUCT_SCOPE.md`, `UI_SPEC.md`, `DATA_AND_INTERACTION_SPEC.md`,
`DESIGN_HANDOFF.md`, `IMPLEMENTATION_PLAN.md`, `ACCEPTANCE_CHECKLIST.md`, and
the six prompts under `prompts/`. Every later phase needs explicit approval.

## References

`references/README.md` records the approved shared-shell sources and the empty
page-specific reference state. Images remain non-authoritative.

## Design approval

After explicit Phase 1 authorization, the built-in image generation tool
created the desktop and narrow references on 2026-08-20 from the curated
Management shell bundle. The product owner approved their visual direction on
2026-08-20. Approval covers hierarchy, density, responsive behavior, fixed
service-day wording, manual refresh, metric order, stacked mobile rows, and
direct order actions. Generated values, exact raster dimensions, icons, font
metrics, and colors remain illustrative rather than implementation authority.

Phase 1 itself changed no runtime, route, fixture, component, contract, API,
schema, migration, or operational data.

The product owner authorized Phase 2 on 2026-08-20. The development-only route,
typed fixture, presentation component, and focused tests are complete. These
fixtures and the environment gate must be removed before Phase 4 real
integration; they are not a production data or component blueprint.

The product owner authorized Phase 3 on 2026-08-20. The browser-local refresh,
pagination, narrow disclosure, focus recovery, and blocked fictional-order
behavior are complete. The interaction model and proposed response dictionary
are now final for the later integration proposal.

The product owner authorized Phase 4 on 2026-08-20. The real local read slice,
strict contract, protected endpoint, POS integration, states, real order links,
hub availability, timezone fail-closed configuration, focused tests, and
fixture removal are complete.

The product owner authorized Phase 5 on 2026-08-20. Production-build browser QA
is complete at 1366×768, 1024×768, 768×1024, and 390×844, together with empty,
local dependency error, retry, logout/login, pagination, refresh, and direct
order-link behavior. Luna release remains blocked until operations verifies the
host timezone and supplies `TZ=Europe/Paris` to site-agent.

## Final delivery and as-built status

Phase 5 was approved and completed on 2026-08-20 against an isolated disposable
PostgreSQL database and a fresh production-build origin. The success matrix
used six synthetic QA orders; a temporary 57-row activity set verified bounded
pagination before being removed. Empty and route-specific database-failure
states were then verified without touching an operational database.

Every required viewport has zero horizontal document overflow. Report actions
measure at least 44px, mobile uses stacked rows, statuses remain textual, and
browser warning/error logs are empty. Manual refresh now performs a reliable
point-in-time reload instead of remaining indefinitely pending. Pagination
restores visible focus to `Commandes du service`, the validated row opens the
exact POS order, and login fields have programmatic accessible names.

The four success captures plus narrow empty/error evidence are stored under
`references/`. No cloud request, operational query, schema, migration, report
table, export, fiscal/accounting behavior, polling, cache, or device behavior
was introduced. The disposable QA runtime was removed after capture.

As-built documentation status: `COMPLETE`

## Stop conditions

Stop whenever later work would change timezone/service-day rules, payment or
refund semantics, order/check counting, local roles, session flow, data
ownership, schema, cloud scope, fiscal/accounting claims, export, polling,
offline caching, or devices beyond an explicitly approved vertical slice.
