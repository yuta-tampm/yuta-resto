# POS Kitchen

Status: Implemented, including the approved bounded Phase 4 Kitchen read model

Visibility: Engineering

Owner: YUTA product and engineering

Protocol revision: 4

Application: `apps/yuta-pos`

Target type: `PAGE`

Route / entry point: `/kitchen`

Runtime family: restaurant-local POS

Page classification: `EXISTING_PAGE`

Implementation class: `integrated`

Delivery mode: `EXISTING_CAPABILITY_RENEWAL`

Package status: `implemented`

Scope status: `APPROVED`

Reference status: `APPROVED`

Inventory status: `COMPLETE`

Baseline status: `CAPTURED`

Design prompt status: `READY`

Shared context status: `RESOLVED`

Current generated reference:
`references/draft-tv-entrees-first-auto-columns-16x9.png`.
It remains the approved presentation reference. The later dense packing review
is implemented in the route without changing contracts or persistence.

## Current implementation

`apps/yuta-pos/src/app/kitchen/page.tsx` is a real Server Component backed by
persisted local POS orders. It calls the bounded `GET /api/v1/kitchen` read
model with the selected screen, queue, and 100-ticket limit. `site-agent`
applies the current 05:00-to-05:00 service day and production station/status
predicates before selecting ticket IDs, then loads the selected order/item rows
with only their category presentation metadata. It derives one queue status per
order/screen ticket, keeps ready rows at the
bottom of an in-progress ticket, and moves the ticket to `Prêt` only when all
its active rows are ready. Active tickets keep their original oldest-first
kitchen-send order while item states change. It exposes
the existing kitchen transitions and separate allergy confirmation through
server actions in `apps/yuta-pos/src/app/actions/kitchen-actions.ts`.

The route exposes two ticket queues. `À préparer` combines sent, preparing,
and mixed-completion tickets; `Prêt` contains only tickets whose active rows
are all ready. `En préparation` remains an item status but is not repeated as
an item badge or exposed as a separate queue tab.

The route uses the POS-wide `PosPageShell`, prominent `PosHeader`, shared
service navigation, and `PosConnectivityStatus`. `KitchenAutoRefresh` listens
to the same-origin notification-only event stream, refreshes the Server
Component after matching changes, and retains a 60-second visible fallback. No
fixture, order, item, allergy record, payment, or print job was created or
changed for this inventory.

The same client boundary renders the compact `Son` control. After explicit
browser authorization, `ticket_created` events for the selected screen play a
short local chime; `state_changed`, reconnect, and fallback refreshes remain
silent.

## Authority

Read in order:

1. root and nearest `AGENTS.md` files;
2. `docs/CURRENT_STATE.md`, `docs/architecture/DATABASE_BOUNDARIES.md`, and the
   current POS product/operator/offline/QA documentation;
3. `docs/ui/README.md`, `docs/ui/DESIGN_TO_CODE_WORKFLOW.md`,
   `docs/ui/DELIVERY_WORKFLOW_MODES.md`, and
   `docs/ui/YUTA_FRONTEND_RULES.md`;
4. implemented contracts, schema, service ownership, actions, and tests;
5. `docs/ui/POS_FRONTEND_RULES.md`;
6. this page package;
7. `@yuta/ui` exports and semantic tokens;
8. visual references.

## Documents

- `PRODUCT_SCOPE.md`
- `UI_SPEC.md`
- `DATA_AND_INTERACTION_SPEC.md`
- `DESIGN_HANDOFF.md`
- `IMPLEMENTATION_PLAN.md`
- `ACCEPTANCE_CHECKLIST.md`

## References

- `references/draft-tv-entrees-first-auto-columns-16x9.png` — current wide-TV
  DRAFT showing Entrées before other unfinished items and as many readable
  columns as the effective viewport permits.
- `references/draft-tv-completed-items-grouping-16x9.png` — preceding
  interaction DRAFT that established unfinished-first and `Terminés` grouping.
- `references/draft-tv-independent-ticket-scroll-16x9.png` — preceding DRAFT
  that established continuous horizontal queue scrolling and independent
  vertical ticket scrolling.
- `references/draft-tv-full-allergy-notes-16x9.png` — superseded DRAFT that
  established complete allergy/note visibility before the ticket-scroll choice.
- `references/draft-tv-variable-ticket-length-16x9.png` — superseded DRAFT that
  established variable ticket height but underrepresented long safety content.
- `references/draft-tv-dense-command-grid-16x9.png` — superseded first DRAFT;
  its uniformly short tickets overstated real-world command density.
- `references/phase-0-current-empty-1366x768.png` — persisted empty queue at
  the default Cuisine / À préparer state on 2026-08-18.
- `references/phase-0-current-empty-390x844.png` — the same persisted state at
  the narrow POS fallback viewport.

The generated image is a non-authoritative design proposal. The Phase 0 images
remain current-state evidence. Generated ticket contents and counts are
illustrative presentation data, not fixtures, persisted records, or contract
authority. Item-rich, allergy, cancellation, and transition states were not
manufactured in the runtime.

## Shared UI context

Shell mode: `REUSE_APPROVED_SHARED_SHELL`.

Reuse the application-owned `PosPageShell`, `PosHeader`, compact menu below
`lg`, `PosConnectivityStatus`, full-viewport route canvas, semantic tokens,
Geist/Inter typography, and the real service navigation destinations:
`Commandes` -> `/`, `Cuisine` -> `/kitchen`, and `Gestion` -> `/management`.
The logo continues to link to `/`. Kitchen owns its station/queue controls and
workflow actions. No sidebar, bottom navigation, account area, management
header, Backoffice shell, `Tous` queue, or new route may be invented.

## Protected invariants

- Keep `apps/yuta-pos -> apps/site-agent -> packages/db-pos -> local
PostgreSQL`; no cloud persistence or synchronization.
- Preserve the local 05:00 service-day cutoff and restaurant-server local time.
- Preserve station snapshots `kitchen`, `bar`, `dessert`, and the exclusion of
  `none` from production queues.
- Preserve item states `sent`, `preparing`, and `ready`, their current
  transitions, paid-order correction behavior, and cancelled-order/item
  restrictions.
- Preserve separate POS send acknowledgement and kitchen allergy confirmation;
  an allergic item cannot become ready before kitchen confirmation.
- Preserve item/order notes, quick-instruction snapshots, selected-variant
  snapshots, historical item name/quantity/station data, and grouping by
  order/table.
- Preserve notification-only SSE plus the 60-second visible-tab Kitchen
  fallback and the shared 15-second visible/focus local-health/printer refresh.
  Do not claim that event payloads are authoritative order data.
- Preserve site-agent command validation and service ownership. The selected
  staff cookie supplies attribution for allergy confirmation; it is not a
  management authorization session.
- Preserve durable kitchen-send print-job ownership upstream. `/kitchen`
  itself neither creates print jobs nor proves physical output; the shared
  strip may only show the safe site-agent printer summary.
- Preserve historical no-hard-delete and order-status recalculation behavior.

## Repository conflicts and gaps found in Phase 0

- The Phase 0 newest-100/N+1 read limitation was removed in the separately
  approved Phase 4 data slice. The ticket limit now applies after service-day,
  screen, and queue selection; one compact count query plus a bounded ticket-ID
  query and detail query replace per-order detail requests.
- Product/QA prose says cancelled orders are read-only on Kitchen, while order
  cancellation changes every active item to `cancelled` and the page excludes
  cancelled items. The current `Commande annulee` branch is therefore not a
  stable reachable queue state after refresh. Product intent must be resolved
  before a design shows cancelled cards.
- Order-item kitchen transitions and allergy confirmation are service-owned,
  but unlike `send_to_kitchen` they have no UUIDv7 operation key and are not
  wrapped in the order-lock transaction shown for order commands. Do not alter
  these semantics during visual work; concurrency/idempotency hardening needs
  separate approval and tests.
- The route has a truthful empty state but no route-specific loading skeleton,
  load-error recovery, form pending feedback, or visible non-conflict command
  error. `INVALID_ITEM_STATUS` is silently recovered by revalidation; other
  service errors reach the framework boundary.
- At 390x844 the document has no horizontal overflow, but the two segmented
  navigation rows scroll internally and use 36px-high controls. A later design
  should review touch sizing without removing queue density or filters.
- The route now derives the selected queue at ticket level. This fixes the
  earlier behavior where a ready item disappeared from an in-progress ticket;
  projected counts include every active row retained by that ticket.
- Catalog categories have names and sort order, including `Entrées`, but the
  persisted/order-detail item contract does not expose a category snapshot.
  The product owner explicitly approved a mutable live-catalog join on
  2026-08-19, accepting that category edits can change historical Kitchen
  ordering and color.

## Change impact

```text
Files expected to modify: Kitchen route/loader, site-agent service/routes, local POS contract/client, tests, and current docs
Files expected to create: dedicated site-agent Kitchen route and read-count test
Packages affected: apps/yuta-pos, apps/site-agent, packages/contracts
Cross-application impact: none
Database change: NO
API or contract change: YES
Permission/auth change: NO
Runtime/device change: NO
```

The server-owned Kitchen read model was approved and implemented as Phase 4.

## Design approval

The product owner approved the current TV-first reference and authorized Phase
1 on 2026-08-18. Phase 1 renews the route with an auto-column ticket track,
continuous free horizontal scrolling, viewport-bounded tickets, independent
vertical ticket-body scrolling, fixed ticket headers, denser item rows, and
44px transition/filter targets. It preserves the runtime boundary, actions,
polling, shell, contracts, and persisted data.

The approved image also depicts ready-item retention/grouping and Entrées-first
ordering. The product owner later approved the ticket projection: completed
rows stay crossed out at the bottom until all active rows are ready. A later
stability correction removed the dynamic `Terminés` heading so an item
transition does not add ticket height. Entrées-first and Bar-before-Desserts
were later implemented through the approved current-catalog join, with distinct
Entrée and Bar item surfaces.

The product owner authorized Phase 2 on 2026-08-18. The refactor keeps the
route page responsible for loading/orchestration and extracts only route-local
filters, tickets, item/allergy/action presentation, and pure Kitchen view
helpers. `KitchenAutoRefresh` remains the only Kitchen client boundary. No
shared component, action, contract, API, transaction, or runtime owner changed.

The reviewed populated state then received a presentation correction: order
numbers are hidden from Kitchen tickets, order notes and order/item allergy
blocks span the available ticket width, and the primary Prepare/Ready controls
use compact 44px icon buttons with accessible names. Their forms and actions
are unchanged.

The subsequent dense-TV approval replaces full-height ticket columns with a
content-height multi-column track. Short tickets pack below one another, the
number of readable columns follows the effective viewport, and overflow
continues horizontally without snapping. Only a ticket that reaches the board
height scrolls its own body. Item rows, ticket metadata, order notes, and
allergy panels use compact spacing while retaining complete text and 44px
transition targets.

The populated-state allergy correction keeps both safety layers compact. A
legacy order-level allergy with no detail renders as a single warning row; when
its send acknowledgement exists, a labeled shield icon replaces the former
text badge. Item-level allergy details remain fully visible. After Kitchen
confirmation, the detail panel reduces its padding and replaces `Cuisine
informée` with an accessible shield icon; the unconfirmed state retains the
explicit confirmation button.

The ticket-action correction moves preparation to one flame button in the
ticket header. It calls the contract-owned `mark_station_preparing` order
command, and site-agent locks the order before atomically changing every
matching `sent` row for that station. Other stations and ready rows are not
changed. After preparation starts, the header position remains visible with an
undo icon backed by `mark_station_sent`; site-agent atomically returns only the
same ticket/station's preparing rows to sent. Unfinished item rows retain only
their Ready action; ready rows retain only one reopen-to-preparing action.

The approved header-density correction reduces header padding, promotes the
service mode to a larger solid semantic badge, and keeps the order note in its
own full-width information panel without the redundant `Note commande:` label.

## Prompt order

1. `prompts/00_REPOSITORY_ANALYSIS.md`
2. `prompts/01_VISUAL_BASELINE.md`
3. `prompts/02_COMPONENT_REFACTOR.md`
4. `prompts/03_INTERACTIONS.md`
5. `prompts/04_DATA_INTEGRATION.md`
6. `prompts/05_VISUAL_QA.md`

Review and approve each later phase separately.

## Stop conditions

Stop before unapproved pending/error interaction work or any contract/data
extension. Also stop if a proposal requires a new queue endpoint,
field, enum, permission, service-time login, route, schema/migration,
idempotency model, transaction boundary, polling/realtime mechanism, printer
route, device setting, or change to the shared POS shell.

## Final delivery and as-built status

Current implementation locations/files changed:

- `apps/yuta-pos/src/app/kitchen/page.tsx`;
- `apps/yuta-pos/src/app/kitchen/kitchen.module.css`;
- `apps/yuta-pos/src/app/kitchen/_components/KitchenFilters.tsx`;
- `apps/yuta-pos/src/app/kitchen/_components/KitchenTickets.tsx`;
- `apps/yuta-pos/src/app/kitchen/_components/KitchenItem.tsx`;
- `apps/yuta-pos/src/app/kitchen/_lib/kitchen-view.ts`;
- `apps/yuta-pos/test/kitchen-view.test.ts`.

Verification commands and results are documented in
`ACCEPTANCE_CHECKLIST.md`. Phase 5 browser geometry is complete for the current
empty state at 1366x768, 1024x768, 768x1024, and 390x844. Populated ticket,
allergy, direct-transition, and independent ticket-scroll evidence is not
claimed across that matrix because the newest persisted order predates the
current 05:00 service-day window.

No operational record was manufactured for Phase 5. The production route used
the real site-agent and local PostgreSQL state; 23 orders remain persisted, but
the newest was created at `2026-08-18T20:20:49.599Z` and is outside the current
service day.

Intentional deviations from the approved image: current status filtering
remains authoritative. Ready-item retention/grouping and Entrées-first sorting
are implemented; the latter follows mutable current-catalog metadata rather
than an order-time category snapshot.

As-built documentation status: Phase 5 partial evidence synchronized; populated
responsive QA and browser-hidden polling evidence remain blocked
