# POS Management Reports — Data and Interaction Specification

Status: Phase 4 integration implemented and Phase 5 interactions verified

Visibility: Engineering

## Ownership map

```text
Management Server Component
  -> server-only site-agent client with bearer session
    -> protected site-agent report read model
      -> db-pos orders + payments (+ bounded supporting joins)
        -> local PostgreSQL
```

The browser owns presentation and navigation only. It does not receive database
access, select a site, prove a role, aggregate money, or choose a timezone.

## Service-day window

Current authority is `getServiceDayWindow(now)`:

- start: local process wall clock at 05:00;
- end: next local calendar day at 05:00;
- interval: start inclusive, end exclusive;
- before 05:00: use the previous calendar day's start;
- DST: wall-clock dates can produce a 23- or 25-hour elapsed interval;
- response: transport exact ISO `start` and `end` values.

There is no configurable establishment timezone field. Phase 4 pins the
`site-agent` process contract to `TZ=Europe/Paris` and fails startup if the
resolved runtime timezone differs. Deployment still requires a separate Luna
host and process preflight before release. The UI must not accept a
browser-selected timezone.

## Implemented derived values

| UI value     | Source and predicate                                                                     | Notes                                                             |
| ------------ | ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Paid revenue | sum `payments.amountCents` where status is `paid` and `paidAt >= start AND paidAt < end` | includes partial/full/split principal; excludes tip/tender/change |
| Paid orders  | count `orders` where status is `paid` and `paidAt` is in window                          | one parent order, never checks/payments                           |
| Open orders  | count `orders` with non-final status and `createdAt` in window                           | statuses match POS Home                                           |
| Day activity | orders where `createdAt` or final `paidAt` is in window                                  | deduplicate by order ID                                           |
| Order link   | `/orders/${order.id}`                                                                    | use validated response ID                                         |

All monetary values cross transport as integer cents. The UI formats them as
EUR; it does not recompute discounts, paid state, or remaining balance.

## Payment semantics

- Full and partial payment rows with `status=paid` are authoritative captured
  principal.
- Split-check payments contribute their own payment amounts once.
- Completing one check does not count a paid order unless all non-void checks
  are paid and the parent order is final `paid`.
- `void` checks contribute no independent count or amount.
- `pending` and `failed` payments contribute nothing.
- Tips, cash tendered, and change are separate fields and do not contribute to
  the proposed paid-revenue metric.
- `orders.totalCents`, check totals, and combo snapshots explain orders but are
  not summed as paid revenue.

## Cancellation and refund semantics

- A cancellable order has no paid payment. Once cancelled, it contributes to no
  metric; it may appear in activity when created inside the service day.
- Cancelling voids unpaid checks, so those checks remain history, not revenue.
- A current product refund mutation does not exist. `refunded` is only a
  persistence/contract state. The first slice proposes excluding refunded rows
  and making no gross/net/refund claim. Historical implications require
  `R0-07` approval before data integration.

## Implemented response contract

```text
serviceDay: { start, end }
generatedAt: ISO timestamp
summary: {
  paidRevenueCents
  paidOrderCount
  openOrderCount
}
orders: Array<{
  id
  orderNumber
  tableLabel
  orderType
  status
  paymentMode
  totalCents
  createdAt
  paidAt
}>
pagination: { page, pageSize, totalItems, totalPages }
```

This minimized, serialization-safe shape is implemented by
`localManagementReportsResponseSchema` in `@yuta/contracts/local-pos`.

After Phase 3 review, this field set is final for the first integration
proposal: no prototype-only disclosure state, refresh attempt, expanded row,
or demo-order warning crosses the future transport boundary. Default page size
remains 50 and maximum 100.

## Query and consistency rules

- Site-agent computes all predicates against one captured `now` and one service
  window per request.
- Metrics are global for the window, never totals of the visible page.
- Rows use deterministic descending activity time then stable order ID.
- An order matching both created and paid predicates appears once.
- The list is bounded; approved default is 50 and maximum is 100.
- Do not fetch every order then aggregate in POS/React.
- Reuse predicate helpers or a dedicated read-model service so POS Home and
  reports cannot silently drift.
- The first slice uses existing tables. A new table, materialized aggregate, or
  index requires measured evidence and separate approval.

## Interactions

### Phase 3 development prototype

- Refresh uses a 500 ms browser timer, disables its control while pending, and
  announces pending/completion text. It performs no request and preserves the
  fictional values.
- Pagination uses seven `DEMO-*` rows and a three-item fixture page solely to
  exercise first/middle/last bounds. It moves focus to the activity heading and
  clears row/order notices on page change.
- Narrow rows show prioritized identity, status, service, and total, then one
  `aria-expanded`/`aria-controls` disclosure for times, fictional payment mode,
  and the demo-order action.
- Activating the demo-order action focuses a warning that navigation was
  blocked. No `/orders/*` href or operational identifier exists.
- Every state is component-local and is discarded on navigation/reload. The
  simulated delay and page size are not production contract values.

The following interaction model is implemented by the Phase 4 local read slice.

### Initial load

1. POS validates the local Management cookie server-side.
2. POS calls the protected report endpoint with the bearer.
3. Site-agent validates active admin/manager role.
4. Site-agent computes and returns the bounded read model.
5. POS renders exact metrics, interval, list, and generated time.

### Refresh and pagination

- `Actualiser` requests a fresh server read; it owns no mutation.
- Pagination changes only the bounded row page; metrics remain window-wide.
- Loading keeps previous values only if the UI clearly marks them as stale;
  the recommended first slice uses navigation loading and no stale cache.
- No automatic polling or SSE is approved.

### Open an order

- Use a real link to `/orders/<orderId>`.
- Preserve standard new/current-tab behavior.
- Missing order handling remains owned by the existing order-detail route.
- Do not redirect directly into payment or create a report-detail page.

## State model

| State                    | Required behavior                                                                  |
| ------------------------ | ---------------------------------------------------------------------------------- |
| Loading                  | skeleton/pending text; no false zero values                                        |
| Empty                    | three real zero metrics plus no rows; explain service window                       |
| Error                    | no fabricated/stale totals; identify local service/database failure and retry      |
| Missing/expired session  | no report body; redirect to `/management/login`                                    |
| Forbidden role           | site-agent returns 403 with no body; POS follows approved login/forbidden recovery |
| Internet offline         | report remains available when POS/site-agent/db-pos are healthy                    |
| Site-agent or DB offline | report unavailable; retry after local recovery                                     |
| Success                  | show interval, generated time, metrics, bounded list                               |

## Security and privacy

Financial aggregates are Management-only even though nearby service-time order
reads exist. Never place the bearer in client state, query strings, logs, or
response fields. Do not expose payment IDs, checks, PIN/auth hashes, database
keys, operational reasons, or unnecessary staff identity.

## Phase 4 test coverage

- 04:59/05:00 boundaries and start-inclusive/end-exclusive behavior;
- DST wall-clock window behavior under the supported deployment timezone;
- partial/full/split payment aggregation and no double counting;
- final split order counted once; partial split not counted paid;
- pending/failed/refunded exclusion;
- cancelled-order metric/list behavior;
- older order paid today; same-day unpaid/cancelled order;
- stable bounded pagination beyond 200 orders;
- active admin/manager success; missing/expired/staff/kitchen denial;
- no report body on 401/403;
- POS link opens the correct order;
- local-service/database failure and Internet-only outage behavior.

Contract, pagination, environment/timezone, HTTP auth denial, POS client, and UI
presentation tests run without operational data. A guarded disposable-database
integration test covers payment principal, partial/split behavior, refunded and
pending exclusion, cancellation, half-open boundaries, older paid orders, and
more than 200 activity rows. It runs only with `POS_DATABASE_URL` plus
`YUTA_ALLOW_DATABASE_INTEGRATION_TESTS=true`; Phase 4 does not authorize running
it against Luna or another operational database.
