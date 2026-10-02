# POS Kitchen — Product Scope

Status: Current implemented Kitchen scope

Visibility: Engineering

## User goal

Give restaurant production staff a fast, station-specific view of the current
service queue so they can see preparation details and allergies, advance or
correct item status, and keep the POS order state synchronized through the
local service.

## Current approved capabilities

- Filter production work between `Cuisine` and one combined `Bar` / `Desserts`
  screen. Bar and dessert remain distinct persisted production stations.
- Use two ticket queues: `À préparer` combines sent, preparing, and
  mixed-completion tickets; `Prêt` contains only fully-ready tickets. There is
  no separate `En préparation` tab and deliberately no `Tous` view.
- Show independent order counts beside `Bar` and `Desserts` inside their shared
  button. Queue badges count unique combined-screen tickets, so an order with
  both stations still contributes once to `À préparer` or `Prêt`.
- Preserve the selected `À préparer` or `Prêt` queue when switching screen.
- Within unfinished rows, show catalog `Entrées` before other Cuisine courses
  and Bar rows before Dessert rows. Use a warning-soft background for Entrées
  and an info-soft background for Bar; completed rows remain last and retain
  their ready treatment.
- Limit work to orders created in the current local 05:00 service day.
- Group item rows by order/table and show order number/type, paid state when
  applicable, row count, elapsed time, order note, item quantity/name/status,
  quick instructions, variants, note, and allergy warning.
- Confirm an item allergy separately in Kitchen, then permit `ready`.
- Move all `sent` rows in one order/screen ticket to `preparing` from one
  header action, then retain that header position as an undo action that moves
  only `preparing` rows for the same order/screen back to `sent`; keep
  item-level `sent/preparing -> ready` and one ready-state correction back to
  `preparing`.
- Refresh after matching local SSE notifications and retain a 60-second
  visible-tab polling fallback.
- Let the operator explicitly enable or mute a local new-ticket chime. Sound
  applies only to non-replayed batches affecting the selected screen and is
  rate-limited during bursts.
- Show the shared local server/database/Internet/printer summary without
  claiming physical printing success.
- Pack short tickets by content height across responsive TV columns; continue
  the queue with free horizontal scrolling and scroll only an overflowing
  ticket body vertically.
- Keep ready rows crossed out below unfinished rows without inserting a dynamic
  group heading; move the ticket to `Prêt` only after every active production
  row is ready.
- Keep active-ticket order stable by original kitchen-send time, oldest first;
  sent/preparing/mixed transitions do not change a ticket's rank.

## Current boundaries

The route is local-only and uses:

```text
apps/yuta-pos -> apps/site-agent -> packages/db-pos -> local PostgreSQL
```

It has no cloud tenant, organization, establishment membership, or cloud
session. Service-time order reads and item commands do not use the management
PIN/bearer session. The active local staff selected by the POS cookie is
validated by site-agent only when Kitchen records allergy-confirmation
attribution. Trusted device configuration and the physical printer remain
site-agent/host concerns.

## Approved change boundary

Only the Phase 0 page pack and read-only evidence are approved now. A future
approved renewal may change Kitchen presentation and route-local component
boundaries while reusing the existing shell, route, data, commands, and
polling. Shared header/navigation, service behavior, contracts, persistence,
authorization, transactions, and devices are excluded.

## Out of scope

- Fixtures or fabricated production orders.
- A full order-history or `Tous` Kitchen view.
- Combo discounts, payment controls, totals, refunds, fiscal/VAT receipts, or
  customer/CRM data.
- Table maps, reservations, staff scheduling, or service-time staff login.
- New cancellation/restore controls on this route.
- New printer routing, settings, queue controls, device paths, or a physical
  print-success claim.
- WebSocket, durable event replay, browser-offline mutation queues, background
  sync, or cloud synchronization.
- Backoffice shell/navigation, a new sidebar, bottom navigation, or account
  area.

## Implemented Phase 4 data slice

- A site-agent Kitchen read model applies the service-day/station/status
  boundary before the bounded ticket limit and returns authoritative counts
  without the former newest-100/N+1 limitation.

## Proposed capabilities requiring approval

- A product decision on whether cancelled orders should remain visible as
  read-only cards or remain absent from the active production queue.
- Transaction/locking/idempotency hardening for item-status and Kitchen allergy
  commands.
- Route-specific loading, load-error/retry, pending, success, conflict, and
  stale-command feedback.
- Any touch-target/layout change that requires changing shared primitives or
  the application shell.

## Relationships

- `/orders/[orderId]/items` sends pending batches to Kitchen and atomically
  creates durable internal print jobs through site-agent.
- `/` is the current-service command list and the place for full command
  lookup.
- `/orders/[orderId]` owns order detail and cancellation.
- `/orders/[orderId]/payment` owns payment and combo presentation.
- `/management/printing` owns authenticated queue/settings/status operations;
  Kitchen only consumes the shared safe summary.
