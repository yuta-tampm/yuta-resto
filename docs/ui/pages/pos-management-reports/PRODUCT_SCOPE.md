# POS Management Reports — Product Scope

Status: Approved scope implemented and Phase 5 verified

Visibility: Engineering

## User goal

An authenticated local administrator or manager can understand the current
restaurant service day at a glance, inspect the orders that explain it, and
open the correct existing POS order for operational follow-up.

## Minimum proposed capability

- Show paid revenue captured during the current service day.
- Show the number of orders fully paid during the current service day.
- Show the number of open orders created during the current service day.
- Show one bounded, paginated list of orders created or fully paid during that
  service day.
- Open `/orders/<orderId>` from a report row.
- State the exact 05:00-to-05:00 interval and the point-in-time refresh status.
- Provide truthful loading, empty, local-service/database error,
  forbidden/session-expired, and retry states.

The product owner approved this minimum scope through `R0-01` to `R0-10` on
2026-08-20. Phase 4 implements the corresponding local read-only vertical
slice; Phase 5 browser and as-built validation remains separately gated.

## Product meaning

This is a local operational overview for service follow-up. It is not a cash
register closing, accounting ledger, fiscal report, tax statement, bank
reconciliation, payout report, or cloud analytics product.

The recommended first-slice labels are intentionally narrow:

- `Encaissé aujourd'hui` means principal amounts on currently paid payment
  rows whose `paidAt` falls in the service day.
- `Commandes payées` means parent orders that reached `paid` during the service
  day, counted once.
- `Commandes ouvertes` means current non-final orders created during the
  service day.
- `Activité du jour` means orders created or fully paid during that interval.

These labels must not be replaced by `chiffre d'affaires net`, `ventes`,
`clôture`, or another accounting/fiscal claim without separate approval.

## Current boundaries

- Local single-site POS only; no organization/establishment cloud tenancy.
- Active local `admin` and `manager` only.
- `apps/yuta-pos` presents; `site-agent` authorizes and calculates;
  `packages/db-pos` owns local facts.
- No browser-side database access or financial source-of-truth calculation.
- No operational data is synchronized to cloud persistence.
- The report is read-only and has no device or printer responsibility.

## Approved shell boundary

The page reuses the shared POS Management shell. Page-specific work may add a
report title, service-day explanation, metric cards, bounded list, refresh, and
row links. It may not redesign `ManagementHeader`, introduce navigation, or
change session/account behavior.

## Out of scope

- calendar/date-range/history reporting;
- charts, trends, forecasts, targets, comparisons, or KPIs;
- payment-method breakdown, tips, cash drawer, shifts, payouts, or bank data;
- refund/reversal workflow or net-revenue accounting;
- VAT, taxes, legal receipts, invoices, Z reports, exports, PDFs, CSVs;
- cloud Backoffice dashboards, cross-site aggregation, synchronization;
- editing/cancelling/paying/refunding from the report;
- check-specific detail routes or a duplicate order-detail surface;
- live SSE/polling, notifications, offline cache, stored aggregates;
- schema, migration, report table, or precomputed daily snapshot;
- customer, staff-performance, menu-item, combo, kitchen, or printer analytics.

## Relationships

- `/management` remains the entry hub and owns availability of the card.
- `/orders/<orderId>` remains the only destination for order detail.
- POS Home `/` is adjacent behavioral evidence for service-day predicates and
  pagination, not the authorization or financial report endpoint.
- Payment capture and split behavior remain owned by the existing payment flow.
- Backoffice and cloud persistence are explicitly unrelated.

## Approval boundary

Phase 1 visual generation and review were completed on 2026-08-20. Phase 2 was
separately authorized and completed as a development-only fictional prototype.
Phase 3 interaction work was separately authorized and completed on 2026-08-20.
Phase 4 was explicitly authorized and implemented on 2026-08-20 with contracts,
protected site-agent authorization/read logic, the authenticated POS route,
and focused tests. Phase 5 was separately authorized and completed on
2026-08-20.
