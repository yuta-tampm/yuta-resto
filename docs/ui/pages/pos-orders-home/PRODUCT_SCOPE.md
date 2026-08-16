# POS Orders Home — Product Scope

Status: Approved and implemented

Visibility: Engineering

## User goal

Let a restaurant operator scan and reopen current-service orders quickly, distinguish open work from paid or broader service-day activity, and reach the next repository-backed action without leaving the local POS operating context.

## Current approved capabilities

- View open orders created during the current 05:00-to-05:00 local service day.
- View orders paid during that service day, based on `paidAt`.
- View orders created or paid during that service day.
- Search the selected view by table/repere label or order number through `?q=`.
- Open order detail, open payment for eligible non-paid/non-cancelled statuses, create a new order, open kitchen, and enter local management.
- See stored status, creation time, stored total, order-item row count, order type, and an allergy warning derived from order or item data.
- See local server/database/Internet/printer health through the shared POS status strip.

## Current boundaries

Home is an unauthenticated service-time route on the single-site local POS installation. Its GET order endpoints do not require the management bearer session. A chosen local user on creation/payment/kitchen operations is recorded for attribution where current commands require it; this is not proof that Home is authorized by a staff login.

Operational persistence stays in local PostgreSQL, owned by `packages/db-pos` and accessed only by `apps/site-agent`. There is no POS-to-cloud synchronization and no organization/establishment tenancy on this route.

## Approved change boundary

Phase 0 creates only this documentation/evidence package. A later approved renewal may reorganize Home presentation and route-local components while preserving current data, links, query semantics, health strip, service-day rules, and status-based action availability.

The approved POS service-time shell is reused. Home adopts the existing full-width/prominent desktop header variant from `/pos` while retaining Home-specific title and real actions; below `lg`, it uses the existing compact action menu. Following real-device review on 2026-08-16, the Home subheader and order content also span the full route width instead of retaining the previous `max-w-7xl` desktop cap. Backoffice navigation, a new sidebar/bottom navigation, and a new shell implementation are excluded. The authenticated `ManagementHeader` remains a distinct authorization-aware shell but follows the same full-viewport width rule.

Database, API/contract, permission/auth, runtime/device, and cross-application changes were all `NO` for the original UI renewal. The subsequently approved performance/data extension changes the local API/contract and adds one db-pos query index migration. Permission/auth, runtime/device, cloud, and mutation ownership remain unchanged.

## Out of scope

- Customer profile or CRM data.
- Delivery-provider integration.
- Fiscal/VAT/invoice/certified cash-register behavior.
- New order, item, kitchen, payment, or print states.
- Staff login or new roles/permissions.
- Cloud sync, cloud tenancy, or cloud reporting.
- Browser-owned persistence, offline mutation queue, or background synchronization.
- New realtime/WebSocket/SSE behavior.
- New printer controls, physical-device paths, test-print, reprint, or queue actions.
- Presentation-owned totals, status transitions, or service-day calculations.

## Proposed capabilities requiring approval

- A real advanced filter model and panel. No current filter contract, state, or action exists.
- Any overflow action menu. The current desktop ellipsis has no behavior.
- Home-level send, cancel, serve, reopen, kitchen-transition, print, or customer actions.
- Route-level loading/error/retry UI beyond current Next.js failure handling.

The product owner approved their Phase 3 removal on 2026-08-16. `Filtres` was replaced by the truthful existing GET-search submit action `Rechercher`; the actionless desktop `Options` ellipsis was removed. Do not restore them or invent behavior from a visual proposal.

The product owner later approved server-side service-day/search aggregation and 50-row pagination specifically to remove the repeated Home list/detail fan-out and 200-order cap. This approval does not include advanced filters, new business states, mutations, authorization, cloud sync, realtime, or device behavior.

## Relationships

- Upstream: `/orders/[orderId]/items` success state redirects to `/` after five seconds and links to `/` immediately.
- New order: `/pos` creates an order and enters `/orders/[orderId]/items`.
- Detail: `/orders/[orderId]` owns item editing entry, kitchen send, cancellation rules, and summary/history.
- Kitchen: `/kitchen` owns production transitions and 10-second visible-tab polling.
- Payment: `/orders/[orderId]/payment` owns payment/split transactions.
- Management: `/management` owns authenticated local administration; its session model does not apply automatically to Home.
