# POS Kitchen — Data and Interaction Specification

Status: Dense TV layout and ticket-state projection implemented

Visibility: Engineering

## Runtime and trust boundary

```text
apps/yuta-pos Server Component / Server Actions
  -> @yuta/contracts/local-pos HTTP transport
  -> apps/site-agent
  -> packages/db-pos
  -> local PostgreSQL
```

Kitchen is a trusted-LAN service-time surface, not a cloud-tenant or local
management screen. Site-agent enforces the configured browser origin and is
expected to bind only to trusted local interfaces. Order reads and item-status
commands do not require the management bearer session. For
`confirm_allergy`, the POS Server Action resolves the `yuta_pos_staff_id`
cookie or an active staff fallback and site-agent verifies that local user is
active; this is attribution, not an authenticated kitchen role boundary.

## Data ownership and transport

- `packages/db-pos/src/schema/orders.ts` owns order/item persistence and
  historical snapshots.
- `apps/site-agent/src/services/site-agent-service.ts` owns the bounded order
  list; `order-command-service.ts` owns detail reads and item/order commands.
- `packages/contracts/src/local-pos/index.ts` defines strict Zod schemas for
  order summaries/details and item commands.
- `apps/yuta-pos/src/lib/site-agent-client.ts` validates every response and
  sends no database URL to the browser.
- `apps/yuta-pos/src/lib/pos-api.ts` hydrates ISO timestamps into server-side
  `Date` values and composes the current list-plus-detail Kitchen read.
- `apps/yuta-pos/src/app/kitchen/page.tsx` owns query parsing, service-day and
  queue filtering, counts, sorting, grouping, and presentation.

## Current domain mapping

| Current field/model/contract                   | UI presentation                 | Existing transformation                                       | Gap                                         |
| ---------------------------------------------- | ------------------------------- | ------------------------------------------------------------- | ------------------------------------------- |
| `searchParams.station`                         | Cuisine / Bar + Desserts screen | `bar`/`dessert`/`counter` -> combined counter screen          | URL is not typed beyond local parser        |
| `searchParams.status`                          | À préparer / Prêt               | `ready` -> ready; invalid/legacy -> active                    | no separate preparing tab or `Tous`         |
| `getServiceDayWindow(new Date())`              | current production service      | server-local 05:00 inclusive to next 05:00 exclusive          | relies on runtime local timezone            |
| `order.createdAt`                              | queue inclusion                 | filtered after newest-100 order list                          | can omit older current-service work         |
| `item.kitchenStationSnapshot`                  | screen queue                    | `kitchen` alone; `bar` + `dessert` on counter screen          | `none` excluded                             |
| `item.status`                                  | item/status queue               | only `sent`, `preparing`, `ready`                             | cancelled rows absent                       |
| station/queue counts                           | badge numbers                   | Bar and Dessert count separately; queue deduplicates by order | quantities never affect counts              |
| `order.tableLabel`, `orderNumber`, `orderType` | group heading/context           | French order-type label map                                   | unknown type falls back to raw value        |
| `order.status`                                 | paid/cancelled badge            | only paid/cancelled badges render                             | cancelled group is not stable after refresh |
| `order.note`                                   | order instruction               | trimmed, shown above items                                    | none                                        |
| order legacy allergy summary                   | group compatibility alert       | `AllergyAlert`                                                | distinct from item KDS confirmation         |
| item snapshot name/quantity                    | production row                  | persisted historical values                                   | row quantity transitions as one unit        |
| `quickInstructions[]`                          | badges                          | stored code/label snapshots                                   | none                                        |
| `selectedVariants[]`                           | `quantity x label` text         | joined with separators                                        | none                                        |
| item `note`                                    | ordinary note                   | direct text                                                   | must remain below allergy warning           |
| item allergy fields                            | danger alert                    | local helper builds severity/allergen/detail text             | ready is blocked until KDS confirm          |
| `sentAt`, `readyAt`, `createdAt`               | elapsed minutes                 | sent/created for active; ready/created for ready              | minute label uses render time only          |
| shared `/api/health` response                  | local/printer strip             | five local states plus safe printer summary                   | does not prove paper/cover/cutter/output    |

## Current reads and interactions

1. `GET /api/v1/kitchen` validates the selected `screen`, `queue`, and bounded
   ticket `limit` through the shared local-POS contract.
2. `site-agent` applies the 05:00 local service day, production statuses, and
   selected station predicate in PostgreSQL. A grouped ticket-ID query applies
   the selected active/ready queue and limit before the detail read.
3. A compact grouped count query returns unique-order station and selected-screen
   queue counts. One bounded detail query joins only the selected order/items
   with current category name/sort metadata; discounts and full catalog data
   are not loaded.
4. Active tickets sort by their immutable earliest
   `sentAt`/creation fallback, oldest first, without a status-priority key;
   ready tickets sort newest first by their ready/creation fallback.
5. Screen links preserve the selected active or ready queue. Legacy `bar` and
   `dessert` links resolve to the combined `counter` screen; legacy `sent` and
   `preparing` status values safely resolve to the active queue.
6. Queue links preserve the screen and switch between active and ready.
7. `KitchenAutoRefresh` calls `router.refresh()` after a matching local SSE
   notification, on recovery/reconnect, and every 60 seconds as a visible-tab
   fallback, only while the browser-local screen schedule permits automatic
   refresh.
8. The shared health strip fetches `/api/health` on mount, every 15 seconds
   while visible, and on online/offline/focus/visibility events, only while the
   same schedule permits automatic refresh.
9. Ticket preparation is one native form posting order ID and selected screen;
   item completion/correction forms continue to post one item ID.

## Mutations / actions / transactions

| UI action            | Contract command                     | Site-agent rule                                                   | Transaction/idempotency reality                                   |
| -------------------- | ------------------------------------ | ----------------------------------------------------------------- | ----------------------------------------------------------------- |
| Tout préparer        | `mark_station_preparing`             | `kitchen`, or `bar` + `dessert` together for `counter`            | order lock + one transaction; state-idempotent when none remain   |
| Annuler préparation  | `mark_station_sent`                  | matching `preparing` rows for the selected screen                 | order lock + one transaction; state-idempotent when none remain   |
| Prêt                 | `mark_ready`                         | allowed from `sent` or `preparing`; allergy confirmation required | no command key; no explicit order lock/transaction                |
| Réouvrir             | `mark_preparing`                     | ready -> preparing                                                | item command; no explicit order lock                              |
| Confirmer l'allergie | `confirm_allergy` plus `staffUserId` | active user, allergic item, Kitchen state                         | overwrites confirmation timestamp/actor on repeat; no command key |

The service contract still accepts item-level `mark_sent`, but Kitchen no
longer exposes that second ready-row correction control. The single visible
correction returns a ready row to `preparing`.

Ticket preparation locks the order, updates every matching `sent` row in one
statement, and refreshes order status only when rows changed. It does not
create a print job. After each successful item command, site-agent recalculates
order totals and refreshes the order status. The POS action revalidates `/kitchen`.
`INVALID_ITEM_STATUS` is treated as a stale-poll conflict and silently
revalidated; all other errors throw. There is no route-owned pending/success/
error state in the current forms.

The adjacent `send_to_kitchen` order command is different: site-agent locks the
order in a database transaction, requires a UUIDv7 idempotency key, confirms
POS-side allergy acknowledgement, snapshots the batch, updates pending items,
and creates durable station print jobs atomically. Do not copy that print
responsibility into `/kitchen` presentation.

## Validation

- Query values use allowlisted local parsers with safe defaults.
- Server Actions parse `orderItemId` as UUID.
- Transport commands and responses use strict Zod contracts.
- Site-agent validates existence, active/cancelled order state, exact allowed
  transition, active staff attribution for Kitchen allergy confirmation, and
  the allergy-before-ready rule.
- The UI disables `Prêt` while an allergic item lacks Kitchen confirmation,
  but site-agent remains authoritative.
- There is no submitted value to preserve, but current form errors do not have
  an operator-facing recovery model.

## Operational and UI states

- Implemented: persisted populated queue, selected screen/queue, true empty
  state, paid-order badge and transitions, order/item notes, variants,
  allergies, confirmed/unconfirmed allergy UI, ready-disabled rule, safe stale
  status revalidation, visible-tab polling, local/database/server/Internet and
  printer summary states.
- Structurally present but not stable after refresh: cancelled-order read-only
  action branch, because cancellation also removes all active rows from the
  queue.
- Missing route-owned states: loading skeleton, data-load error and retry,
  transition pending, visible stale-conflict notice, non-conflict command error,
  and explicit success acknowledgement.
- Safe Phase 0 browser evidence: persisted empty queue with local database
  ready and printer not configured.
- Not captured: item-rich, allergy, ready, paid, cancellation, service/database
  failure, printer ready/printing/attention/unavailable. No mutation was used
  to produce them.

## Implemented ticket-state projection

The page derives one queue per order/screen group from its active production
rows:

- any group that is not fully ready -> `À préparer`;
- all rows `ready` -> `Prêt`.

An item that becomes ready stays in its current in-progress ticket, moves below
unfinished rows without adding a completed-section heading, and retains the
existing ready correction command. Only the final active row becoming ready
moves the ticket to `Prêt`.
Allergy confirmation remains authoritative before an allergic row can become
ready. Cancelled rows remain excluded.

The shared button shows separate unique-order counts for Bar and Dessert. The
selected queue counter represents unique combined-screen tickets, so an order
with rows in both stations contributes to both station numbers but only once to
the `À préparer` or `Prêt` number. Product quantities never affect a counter.
Targeted pure-view tests cover mixed-completion retention, final ready movement,
and projected screen/queue counts. The local command contract adds the
transactional `counter` scope; polling, schema, and persistence remain unchanged.

## Implemented course and station ordering

The Kitchen read model joins each persisted `menuItemId` to only its current
category name/order and item order. It does not load the full catalog. Within each
unfinished Cuisine section, a normalized exact `Entrée`/`Entrées` category is
first, followed by other categories in catalog order. On the combined counter
screen, Bar is first and Desserts second. Completed rows remain last.

This is deliberately a mutable live-catalog join because order items do not
contain a category snapshot. Reassigning or renaming a catalog category can
therefore change historical Kitchen ordering and color. No schema, migration,
or operational-data rewrite was introduced.

## Refresh / offline / device behavior

- `site-agent` exposes `GET /api/v1/kitchen/events` as a notification-only SSE
  stream. Successful Kitchen-affecting mutations publish a revision,
  `kitchen`/`counter`/`all` scope, `ticket_created`/`state_changed` reason, and
  timestamp after persistence completes; no order or item payload is sent
  through SSE.
- The POS proxies that stream at same-origin `/api/kitchen-events`. A matching
  event triggers the existing authoritative `router.refresh()` read, with a
  200 ms debounce and coalescing while another refresh is pending.
- Kitchen keeps a 60-second visible-tab poll as a failure-recovery fallback.
  Hidden tabs close the stream; visibility, focus, online recovery, and stream
  connection each reload current state to close missed-event races.
- `ticket_created` is emitted only for a non-replayed `send_to_kitchen` batch
  and only to screens represented by that batch's pending production stations.
  When the operator has authorized browser audio, the selected screen plays a
  local two-tone chime at most once per 2.5 seconds. All `state_changed` events
  are silent. Sound preference is local to the browser; autoplay policy may
  require a new operator activation after restart.
- Health/printer polling is 15 seconds while visible and reacts to focus and
  browser connectivity events.
- Internet loss can still show `Mode local` while LAN, POS, site-agent, and
  PostgreSQL remain usable. Loss of site-agent/PostgreSQL blocks operations.
- The shared printer summary comes from worker configuration, read-only device
  stat/access checks, and queue state. Polling never opens the RFCOMM device.
- Durable production tickets are created when the POS sends a batch, not by a
  Kitchen status transition. Queue acceptance is not physical print success.
- Browser-offline operations and cloud synchronization do not exist.

## Tests and verification inventory

Behavior-related coverage exists in:

- `apps/yuta-pos/test/orders-service-day.test.ts`;
- `apps/yuta-pos/test/site-agent-client.test.ts`;
- `apps/yuta-pos/test/pos-header.test.tsx` and
  `pos-header-menu.test.tsx`;
- `apps/yuta-pos/test/kitchen-send-action.test.ts` and
  `kitchen-send-validation.test.ts` for the upstream send flow;
- `apps/site-agent/test/financial.integration.test.ts` for atomic/idempotent
  kitchen send and print-job creation;
- `apps/site-agent/test/server.test.ts` for HTTP validation/origin and SSE
  boundaries, plus `kitchen-event-hub.test.ts` for revisions, scope, and
  unsubscribe behavior;
- `apps/site-agent/test/local-printer-worker.test.ts` and
  `printer-status-service.test.ts` for device truthfulness;
- `packages/db-pos/test/schema.test.ts` and `schema.integration.test.ts`.

There is no dedicated browser unit test for station/queue navigation,
grouping/sorting/counts, SSE reconnection/visibility, Kitchen allergy confirmation, or
the direct item-transition matrix. The POS QA checklist describes the manual
cases. Later behavior changes require targeted tests rather than relying only
on the checklist.

## Decisions that must not be guessed

- Whether cancelled orders should remain visible or disappear.
- Whether item transition commands need operation IDs, order locks, or atomic
  status/totals/order-state refresh.
- Operator feedback and retry semantics for stale, failed, or repeated
  commands.
- Whether the current SSE plus 60-second fallback should later become a durable
  replay log, ETag/version protocol, or database-backed realtime transport.
- Any service-time authentication/authorization model.
- Any printer routing, settings, physical success, or reprint behavior.

## Proposed persistence/contract changes

The dedicated Kitchen read contract, `GET /api/v1/kitchen` endpoint, and
notification-only event contract are implemented. The SSE hub is process-local
and deliberately carries no order data. They add no schema, migration,
permission, transaction, persistence-owner, or device change. Command
concurrency/idempotency hardening remains only a proposal.
