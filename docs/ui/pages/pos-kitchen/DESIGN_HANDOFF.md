# POS Kitchen — Design Handoff

Status: TV-first design approved; Phase 1 visual baseline implemented

Visibility: Engineering

## Phase 0 source

The Implementation Inventory is recorded across this package, principally
`README.md` and `DATA_AND_INTERACTION_SPEC.md`. The target is the existing
integrated local POS production queue at `/kitchen`, renewed through
`EXISTING_CAPABILITY_RENEWAL`. Real data, command semantics, polling, local
service ownership, allergy rules, and printer truthfulness are protected.

## Shared UI context resolution

Shared context status: `RESOLVED`

| Layer        | Owner/source                                                                     | Reference status                | Reuse exactly                                                                                  | May adapt                                                              | Excluded                                                 | Decision/blocker |
| ------------ | -------------------------------------------------------------------------------- | ------------------------------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | -------------------------------------------------------- | ---------------- |
| YUTA global  | `@yuta/ui` exports, semantic tokens, shared frontend rules                       | APPROVED repository source      | primitives, tokens, Geist/Inter, focus/accessibility rules, lucide icons                       | composition and operational density                                    | raw colors, new UI framework, Backoffice shell reference | resolved         |
| Application  | `PosPageShell`, `PosHeader`, `PosHeaderMenu`, `PosConnectivityStatus`, POS rules | APPROVED current implementation | full-viewport canvas, prominent desktop header, compact menu below `lg`, truthful health strip | route-owned title/actions/content                                      | sidebar, bottom nav, account area, management header     | resolved         |
| Section/flow | `/`, `/orders/[orderId]/items`, `/orders/[orderId]`, `/management/printing`      | APPROVED implemented flow       | real navigation, send/Kitchen/payment/printing ownership and device truthfulness               | Kitchen hierarchy only                                                 | moving upstream send or print controls into Kitchen      | resolved         |
| Page/screen  | current `/kitchen` code and Phase 0 captures                                     | DRAFT baseline evidence         | real stations/statuses/data/actions/empty state                                                | hierarchy, spacing, responsive grouping, accessible feedback proposals | invented data/actions/states                             | resolved         |

Shell mode: `REUSE_APPROVED_SHARED_SHELL`.

Shell owner: `apps/yuta-pos/src/components/pos/PosPageShell.tsx`,
`PosHeader.tsx`, `PosHeaderMenu.tsx`, and `PosConnectivityStatus.tsx`. Header
and health strip are outside page-local redesign scope. Allowed shared routes
are `Commandes` -> `/`, `Cuisine` -> `/kitchen`, and `Gestion` ->
`/management`; the logo returns to `/`. There is no primary sidebar, bottom
navigation, or account/session area on service-time routes. The separately
authenticated management shell must not be imported.

Curated design-tool bundle:

- `references/phase-0-current-empty-1366x768.png`;
- `references/phase-0-current-empty-390x844.png`;
- current `PosPageShell`/header/menu/health implementation;
- `docs/ui/pages/pos-orders-home/` and `pos-order-items/` only for established
  service-time shell and density consistency;
- `PRODUCT_SCOPE.md`, `UI_SPEC.md`, and `DATA_AND_INTERACTION_SPEC.md`;
- `docs/ui/POS_FRONTEND_RULES.md`.

The Backoffice-oriented shared brand reference is not a POS shell authority and
must not be supplied as navigation or layout direction.

## Current baseline capture

Baseline status: `CAPTURED`

Capture date: 2026-08-18, Europe/Paris. Both captures used the production POS
already running at `http://localhost:3003` and site-agent at
`http://127.0.0.1:3004`. Site-agent returned database `ready`; the hydrated
health strip reported local server/database available, Internet check not
configured (`Service local`), and printer `not_configured`.

| File                                 | Route/state                      | Viewport | Persisted/runtime conditions                                                        |
| ------------------------------------ | -------------------------------- | -------- | ----------------------------------------------------------------------------------- |
| `phase-0-current-empty-1366x768.png` | `/kitchen`, Cuisine / À préparer | 1366x768 | 0 rows across all station/status counts; no mutations; desktop header badge visible |
| `phase-0-current-empty-390x844.png`  | `/kitchen`, Cuisine / À préparer | 390x844  | same data; compact header menu; internally scrolling filter rows                    |

At both viewports, `document.scrollWidth === document.clientWidth` and
`body.scrollWidth === body.clientWidth`. The page intentionally keeps the
document at viewport height and scrolls the route content internally. The
390px segmented row contains an off-viewport `Prêt` link inside its own
horizontal scroll region, not document overflow.

Important states not visible: populated groups, item quantity > 1, order/item
notes, variants, each kitchen status, paid order, allergy unconfirmed/
confirmed, cancelled behavior, transition pending/error/conflict/success,
database/site-agent failure, Internet local-only, and other printer states.
There was no safe persisted current-service work, so Phase 0 did not create an
order, send a batch, confirm an allergy, click a transition, or change a print
job merely for evidence.

## Design-generation prompt

Design prompt status: `RUN` on 2026-08-18

### Ready-to-use prompt

Create a UI design proposal, not implementation code, for the existing YUTA
local POS route `/kitchen` in `apps/yuta-pos`. This is a `PAGE`,
`EXISTING_PAGE`, integrated `EXISTING_CAPABILITY_RENEWAL`. Use the supplied
real persisted empty-state captures at 1366x768 and 390x844. Preserve current
repository behavior; improve only information hierarchy, scan speed, density,
spacing, responsive composition, touch usability, accessibility, and truthful
state communication.

Treat a wall-mounted 16:9 Kitchen TV at 1920x1080 as the primary proposal.
Replace the sparse full-width order stack with a dense horizontal ticket track
whose visible column count follows the effective viewport and a minimum
readable ticket width, without a hard maximum. Compress station and status
controls into one route-owned band while preserving the shared shell. The
selected status remains a single derived ticket queue: do not turn the page
into a Kanban board.

Operator context: restaurant production staff monitor one station and one
ticket queue during service. The queue is not a full command list or a
management dashboard. The current local service day is 05:00 inclusive to the
next 05:00 exclusive in restaurant-server local time. The UI exposes exactly
two production screens: Cuisine (`kitchen`) and one two-line Bar / Desserts
button (`counter`) that combines persisted `bar` and `dessert` rows. Current
ticket queues are exactly À préparer (sent, preparing, and mixed-completion
tickets) and Prêt (fully-ready tickets); do not add a separate En préparation
tab or `Tous`. Station and queue badges count unique order tickets rather than
item rows. Switching screen preserves the selected active or ready queue.

Use shell mode `REUSE_APPROVED_SHARED_SHELL`. Reuse the full-viewport
`PosPageShell`, prominent desktop `PosHeader`, compact menu below `lg`, shared
`PosConnectivityStatus`, YUTA semantic tokens, Geist Sans with Inter fallback,
`@yuta/ui`, and lucide icons. The only shared service navigation is Commandes
-> `/`, Cuisine -> `/kitchen`, and Gestion -> `/management`; the logo returns
to `/`. Do not add or replace header, sidebar, bottom navigation, breadcrumb,
account/session area, management header, Backoffice shell, or route.

Design order groups around real persisted fields only: table/reference label,
order number/type, optional paid state, order note, legacy order-allergy
compatibility alert, item-row count, and elapsed time. Each production row has
quantity, item-name snapshot, current item status, structured quick-instruction
snapshots, selected variant quantities/labels, optional item note, and an
expanded item-allergy warning. Allergy warning must appear before ordinary
notes. Kitchen confirmation is separate from the earlier POS send
acknowledgement. An allergic item cannot become ready until the operator uses
`Confirmer l'allergie`; confirmed state says `Cuisine informée`.

Keep current transitions direct: the ticket-header `Tout préparer` moves every
`sent` row for that order/screen to `preparing`. On the counter screen this
means Bar and Dessert together. The header control then stays visible with an
undo icon that returns only preparing rows for that order/screen to `sent`; unfinished rows expose item-level `Prêt`; ready rows
retain only the `Réouvrir` correction.
Paid orders remain correctable in Kitchen. Do not design a new cancellation or
restore action. Cancellation visibility is unresolved: product prose mentions
read-only cancelled orders, but current cancellation marks every active item
cancelled and the queue excludes cancelled items. Do not show cancelled cards
as a resolved design fact; annotate this as a product decision needed.

Preserve the refresh-only client boundary: notification-only SSE may trigger
`router.refresh()`, with a 60-second visible fallback; do not imply that event
payloads are authoritative order data. Preserve the shared health strip's
separate local server/database/Internet and safe printer states. Printer
`ready` is only a device-access/queue summary; queue acceptance is not physical
paper success. Kitchen status transitions create no print job. Physical device
paths, print routing/settings, retry/reprint, and the durable queue belong to
site-agent and `/management/printing`.

Use 1920x1080 as the primary TV frame. Later coordinated proposals still need
to cover 1366x768, 1024x768, 768x1024, and 390x844.
Keep the route full viewport, permit contained horizontal scrolling for station
or status filters when necessary, and prevent document-level horizontal
overflow. Review the current 36px filter height against the POS 44px touch
target rule. Keep direct actions reachable, with no essential hover-only UI,
visible focus, accessible names, text-backed status, and clear disabled/pending
feedback.

Show or annotate truthful proposals for: populated queue, empty selected
queue, loading, data-load error plus safe retry, transition pending, stale
status conflict, other command failure, success acknowledgement, unconfirmed
and confirmed allergy, and degraded local health. Do not imply these missing
feedback states are currently implemented; mark them as proposed interaction
work requiring approval. Do not generate raw production identifiers or data.

Explicitly exclude fixtures, financial totals/discounts/payment controls,
customer/CRM data, table maps, reservations, staff scheduling/login, cloud
tenancy or synchronization, browser-offline mutation queue, background sync,
new statuses/stations/routes/permissions, API/contract/schema/migration,
presentation-owned business rules, printer/device configuration, physical
print-success claims, or a redesigned shared shell.

For the approved TV pass, return one 16:9 DRAFT proposal with clear scan order,
filter behavior, allergy priority, and exclusions. Landscape/tablet,
portrait-tablet, narrow, and interaction-state variants remain later design
work. Mark every output `DRAFT` pending explicit product-owner review.

## Handoff result

The approved design-generation pass first produced
`references/draft-tv-dense-command-grid-16x9.png`. It increased density, then a
targeted correction fixed mixed status queues and inconsistent counters. Product
review subsequently identified that its uniformly short tickets overstated
real-world density.

The variable-length iteration then showed a fully visible ten-item order and
mixed ticket lengths. Product review required complete allergy and note content
without hidden detail.

The full-content iteration then expanded allergen names, allergy notes,
structured modifiers, and ordinary notes without hidden detail.

Product direction selects continuous free horizontal queue scrolling. Do not
snap by a fixed-column page and do not auto-advance. It also selects independent
vertical scrolling inside each ticket body when that ticket exceeds the
viewport-bounded maximum height.

The independent-scroll iteration used the product owner's annotated scrollbar
position, kept ticket headers fixed, and pinned allergy summaries outside each
scrolling body.

The mixed-completion iteration preserved that scroll model and showed ready
rows under `Terminés` until the full ticket became ready.

This image proposes new grouping/count behavior: the ticket moves to `Prêt`
only when every active production row is ready. Current runtime filters rows by
item status before grouping, so implementation is a separately approval-gated
behavior change, not visual CSS work.

The approved presentation reference is
`references/draft-tv-entrees-first-auto-columns-16x9.png`. It removes any hard
column limit, showing six complete columns plus a partial seventh on a wider
effective viewport. Within unfinished rows, `ENTRÉES` appears before `PLATS`,
while `Terminés` remains last. The repository has catalog category order but no
order-item category snapshot. It was initially data-decision dependent; on
2026-08-19 the product owner explicitly approved the mutable local-catalog join
now used for this ordering and color treatment.

The product owner approved this reference and Phase 1 on 2026-08-18. Phase 1
implements its safe presentation subset: auto columns, free horizontal queue
scrolling, bounded tickets, independent vertical body scrolling, fixed
headers, and denser controls. It intentionally uses no generated content as
fixtures or operational data. Mixed-completion grouping and Entrées-first data
ordering were approved and implemented in later corrections.
