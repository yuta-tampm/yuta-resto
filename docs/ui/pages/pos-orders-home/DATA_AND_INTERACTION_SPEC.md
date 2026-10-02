# POS Orders Home — Data and Interaction Specification

Status: Implemented, including approved post-Phase-5 performance/data extension

Visibility: Engineering

## Runtime and trust boundary

```text
apps/yuta-pos Server Component
  -> server-only siteAgentClient
    -> apps/site-agent local HTTP API
      -> @yuta/db-pos Drizzle schema/client
        -> local PostgreSQL
```

The browser never receives database credentials or owns transactions. POS operational data is not copied or synchronized to cloud persistence.

Home and the current order GET endpoints have no authenticated staff-session requirement. `createdBy`, payment staff, kitchen acknowledgement staff, and selected-staff cookies are attribution within current commands, not authorization for Home. The HttpOnly management cookie and bearer role check protect management APIs/pages only; they are not implicitly forwarded to Home order listing.

## Loaders and operational side effects

`OrdersHomePage` parses `view`, trimmed `q`, and positive `page`, then makes one server-side call through `posApi.listOrdersHome()` and `siteAgentClient.listOrdersHome()`:

```text
GET /api/v1/orders/home?view=<view>&q=<query>&page=<page>&limit=50
```

The site-agent computes the local 05:00 service-day window, applies the selected view and case-insensitive table/order-number search in PostgreSQL, calculates unsearched counts for all three tabs, returns one bounded summary page, and includes persisted totals/statuses plus row count and order-or-item allergy presence. Pagination is clamped to the last available page. The current implementation performs three bounded database reads per Home request—counts, selected-view total, and summary rows—independent of the number of orders on the page.

This replaces the historical `3 × (1 + N)` local HTTP fan-out and removes the 200-newest-orders pre-filter cap. Detail rows, discounts, and mutation services are no longer loaded merely to render Home.

The loader remains read-only. It does not call `recalculateOrder()`, update status, or enqueue printing. Health polling performs read-only health/database/device stat-access/queue-summary checks; it does not open the printer channel. The performance extension made no order, payment, kitchen, print, or live-database mutation; its index migration was generated but not applied to the operational database during QA.

## Current domain mapping

| Current field/model/contract | UI presentation                | Existing transformation              | Gap/risk                                                                     |
| ---------------------------- | ------------------------------ | ------------------------------------ | ---------------------------------------------------------------------------- |
| `order.id`                   | detail/payment route parameter | URL encoded by link                  | trusted service identifier; no browser authorization claim                   |
| `orderNumber`                | Commande/search                | site-agent `ILIKE` contains search   | no customer identity                                                         |
| `tableLabel`                 | Repere/table/search            | site-agent `ILIKE` contains search   | no customer identity                                                         |
| `orderType`                  | Sur place/A emporter/Livraison | route-local label map                | no provider integration                                                      |
| `status`                     | badge/accent/action            | route-local map                      | unknown values fall back to raw text/neutral styling                         |
| `createdAt`                  | time/sort                      | hydrated `Date`, `fr-FR` hour/minute | no elapsed-time polling                                                      |
| `paidAt`                     | paid-today membership/sort     | hydrated nullable `Date`             | paid view sorts by `paidAt`; activity sorts by creation time                 |
| `itemCount`                  | article count                  | grouped database row count           | counts rows including cancelled rows, not active quantity sum                |
| `hasAllergy`                 | `Allergie` badge               | order flag OR any item flag in SQL   | shown once per responsive order presentation                                 |
| `totalCents`                 | formatted euro total           | `@yuta/core/formatEuros`             | stored service value only; presentation must not recalculate                 |
| health response              | local status strip             | client state map                     | initial checking, 15-second visible polling; order list itself does not poll |

## Service-day views and sorting

The service day is local runtime time from 05:00 inclusive to the next 05:00 exclusive.

- `open`: created in the window and status in `draft`, `sent`, `preparing`, `ready`, `served`; sort by `createdAt` descending.
- `paid_today`: status `paid` and `paidAt` in the window; sort by `paidAt` descending, falling back to `createdAt` only defensively.
- `all_today`: created in the window OR paid in the window; sort by `createdAt` descending.
- Unknown/missing `view` defaults to `open`.
- Search trims `q`, matches only `tableLabel` and `orderNumber` case-insensitively in PostgreSQL, and preserves `q` when changing segmented view or page.
- Results use 50 rows per page. Tab counts ignore `q`; pagination total applies both the selected view and `q`.

## Current interactions and visible controls

| Visible control                     | Current behavior                                           | Decision for renewal                                             |
| ----------------------------------- | ---------------------------------------------------------- | ---------------------------------------------------------------- |
| Logo                                | `/`                                                        | preserve                                                         |
| Nouvelle commande                   | `/pos`                                                     | preserve direct primary action                                   |
| Cuisine                             | `/kitchen`                                                 | preserve                                                         |
| Gestion                             | `/management`; destination enforces its own session        | preserve; do not imply Home authorization                        |
| Ouvertes / Payees / Activite        | GET navigation using `view`, preserving `q`                | preserve semantics                                               |
| Search                              | GET form to `/` with hidden `view` and `Rechercher` submit | preserve repository-backed query behavior                        |
| Order detail                        | `/orders/[orderId]`                                        | preserve                                                         |
| Draft `Envoyer`                     | navigates to detail; does not send directly                | preserve behavior or relabel only with approved UI copy decision |
| Sent/preparing/ready/served `Payer` | `/orders/[orderId]/payment`                                | preserve                                                         |
| Paid/cancelled                      | detail only, no primary mutation action                    | preserve                                                         |
| Desktop ellipsis `Options`          | removed in Phase 3; no repository-backed action existed    | do not restore without separately approved capability            |
| Mobile FAB                          | `/pos`, icon-only with `Nouvelle commande` accessible name | preserve                                                         |

Home does not own cancel, send-to-kitchen, item edits, kitchen transitions, payment capture, split creation, printing, or printer management. Those remain in adjacent routes and site-agent transactions.

## Operational and UI states

- Loading: no route `loading.tsx`; server work completes before content or framework loading is shown.
- Empty: `Aucune commande`, explanatory text, and `/pos` action for the selected/search-filtered result.
- Load error: no route-owned catch/retry; site-agent/order contract failure rejects the Server Component and falls to framework error handling.
- Search no-match: uses the same empty state as a genuinely empty service-day view.
- Health checking/degraded: shared status strip independently distinguishes local server, database, Internet, and printer states.
- Unauthorized/forbidden: not applicable to current Home GET path; management handles its own redirect/session.
- Pending/success: navigation feedback only; Home has no mutations.
- Order-list freshness: no polling/realtime; navigation/reload refreshes server data.

## Tests and verification evidence

- `apps/yuta-pos/test/orders-service-day.test.ts` retains semantic regression coverage for cutoff, paid-time membership, and after-midnight behavior.
- `apps/yuta-pos/test/site-agent-client.test.ts` protects the single Home endpoint query and response validation.
- `apps/site-agent/test/server.test.ts` protects Home route parsing/dispatch at the local HTTP boundary.
- `apps/site-agent/test/orders-home.test.ts` protects pagination bounds without database mutation.
- `apps/site-agent/test/orders-home.integration.test.ts` opt-in coverage exercises the actual service-day SQL, search, paid-time membership, item count, allergy aggregation, and page clamp against a disposable database.
- Site-agent/db-pos integration tests protect order, kitchen, payment, idempotency, locking, print, and persistence behavior adjacent to Home.
- `docs/products/pos/QA_CHECKLIST.md` defines manual open/paid/activity service-day cases.

There is no focused component test for Home search, sorting, action mapping, responsive renderers, empty/error UI, row-count meaning, or allergy presentation. Phase 3 browser QA protects the rendered search/query and removed-control behavior available with current real data.

## Decisions that must not be guessed

Do not guess an advanced filter vocabulary, overflow contents, customer record, provider source, cancellation/printing action, status transition, staff authorization, realtime transport, or offline queue. Do not convert row count into quantity count or exclude cancelled items without an explicit product decision and regression coverage.

## Proposed persistence/contract changes

The separately approved post-Phase-5 extension adds the versioned Home query/response contract and `GET /api/v1/orders/home`, plus the db-pos `orders_status_paid_at_idx` migration. It adds no table, column, API mutation, browser persistence, cloud path, authorization rule, runtime, or device behavior. The migration must follow normal local deployment procedure before relying on the new index in an installed environment; the endpoint remains functionally correct before the index is applied.
