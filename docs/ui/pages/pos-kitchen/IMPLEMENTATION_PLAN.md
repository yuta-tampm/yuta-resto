# POS Kitchen — Implementation Plan

Status: Dense presentation and ticket projection implemented; later data work deferred

Visibility: Engineering

## Phase 0 — Repository analysis gate

Complete. The target is `/kitchen`, `PAGE`, `EXISTING_PAGE`, integrated, using
`EXISTING_CAPABILITY_RENEWAL`. The inventory covers the shared shell,
05:00 service day, station/status filters, grouping/sorting/counting, item and
order notes, allergy confirmation, transitions, polling, cancellation gap,
local-service/printer truthfulness, contracts, actions, transaction/
idempotency reality, tests, safe persisted baseline, and verification commands.

No runtime, order, item, allergy, payment, or print-job mutation was performed.
Shared context is resolved as `REUSE_APPROVED_SHARED_SHELL`. The design prompt
was run only after approval and its selected TV-first reference is now
approved.

## Phase 1 — Approved visual baseline implementation

Completed on 2026-08-18 after explicit product-owner approval. The real route
was renewed in place with a horizontally scrolling auto-column ticket track,
viewport-bounded cards, independently scrolling ticket bodies, fixed ticket
headers, denser content, a unified scrollable filter band, and 44px action
targets. Server Component data loading, query semantics, actions, polling,
shell, and real persisted data remain unchanged; no fixtures were introduced.

Ready-item retention/grouping was subsequently approved and implemented from
the existing detail response. On 2026-08-19 the product owner explicitly chose
Entrées-before-Plats and Bar-before-Desserts presentation. The route now joins
the current local catalog at render time; no category snapshot or migration was
added.

## Dense TV correction and ticket projection

Completed on 2026-08-18 after explicit approval of the dense mockup. The track
uses content-height multi-column packing, compact headers/items/notes, uncapped
responsive columns, free horizontal overflow, and per-ticket vertical overflow.
The route derives queue status per order/screen group, retains ready rows at
the bottom without a dynamic group heading, and moves a ticket to `Prêt` only
when every active row is ready.
The later combined-counter correction adds a `counter` command scope so Bar and
Dessert bulk transitions stay atomic. No schema, persistence, polling, printer,
or runtime boundary changed.

## Phase 2 — Component refactor

Completed on 2026-08-18 after explicit product-owner approval. The Server
Component keeps data loading and queue orchestration. Route-local
`KitchenFilters` owns station/status navigation, `KitchenTickets` owns the
order-group/ticket presentation, `KitchenItem` owns item details, allergy
confirmation, and the existing transition forms, and `_lib/kitchen-view.ts`
owns pure parsing/counting/grouping/navigation presentation helpers.

`KitchenAutoRefresh` remains the minimal client refresh boundary. The unused
shared `KitchenTicket` was not adopted or changed because this route's
allergy/instruction/variant/action needs have no proven cross-consumer fit.
Markup, actions, focus, loader semantics, and behavior remain unchanged.

## Phase 3 — Approved interactions

The ticket-level preparation correction was explicitly approved on 2026-08-18.
One header action now sends `mark_station_preparing`; site-agent locks the order
and atomically moves matching `sent` rows for the selected production screen.
The `counter` scope includes both Bar and Dessert rows in the same transaction. The
operation is a state-idempotent no-op when no matching row remains. Unfinished
item rows retain only Ready, while a ready row retains one correction back to
preparing.

The correction approved on 2026-08-19 keeps the header action visible after
bulk preparation and changes it to an undo icon. The new
`mark_station_sent` command atomically returns matching `preparing` rows for
only that order/screen to `sent`; ready rows and the other screen are preserved.

The queue correction approved on 2026-08-19 removes only the separate
`En préparation` tab. `À préparer` now combines sent, preparing, and
mixed-completion tickets; `Prêt` remains the fully-ready ticket queue. The
underlying preparing item state and transition contract are unchanged.

The stable-order correction approved on 2026-08-19 removes derived status from
the active-ticket comparator. Active tickets remain oldest-first by their
earliest persisted send timestamp across sent, preparing, and mixed completion;
only full completion moves a ticket to the ready queue.

Route-owned pending/error/success feedback remains unapproved. Any later
feedback must prevent accidental repeated activation, recover from a stale
polled state, and remain truthful about whether the service accepted the
command. Cancellation, restore, whole-order cross-station actions, and new
status transitions remain out of scope.

## Phase 4 — Data integration or extension

Approved and implemented after the production-performance review. The shared
contract now owns a bounded Kitchen query/response, `site-agent` applies the
05:00 service day, production station/status, active/ready ticket projection,
stable ordering, and limit before returning tickets, and the POS route consumes
that single endpoint. The read uses one grouped candidate query, one compact
count query, and one bounded detail/category query; it no longer performs one
HTTP detail request per order or downloads the full catalog on every refresh.

This slice changes no schema, migration, mutation, command transaction,
idempotency, permission, printer, or device ownership.

## Phase 5 follow-up — Event-driven refresh

Approved and implemented after the performance review. `site-agent` now owns a
process-local notification hub and SSE endpoint. Relevant successful mutations
publish only a revision, affected screen, reason, and timestamp after
completion. The
POS proxies the stream through its own origin, validates events, debounces and
coalesces refreshes, disconnects while hidden, and keeps a 60-second polling
fallback. `GET /api/v1/kitchen` remains the sole Kitchen data payload and local
PostgreSQL remains the source of truth. There is no schema, migration, durable
event log, cloud synchronization, or printer behavior change.

The approved sound follow-up adds a compact operator-controlled `Son` button.
Only non-replayed `send_to_kitchen` batches emit `ticket_created`, scoped from
the batch's persisted production stations. The selected screen plays a local
two-tone chime after browser authorization, with a 2.5-second burst cooldown;
all ordinary `state_changed` refreshes remain silent.

## Functional and regression verification gate

Before Phase 5, run at minimum:

```bash
pnpm docs:check
pnpm architecture:check
pnpm typecheck:pos
pnpm test:pos
pnpm build:pos
pnpm typecheck:site-agent
pnpm test:site-agent
pnpm typecheck:db-pos
pnpm test:db-pos
pnpm test:pos:offline
pnpm ui:pack:check pos-kitchen
```

Run contracts/core/UI checks and disposable integration tests when those
boundaries change. Use scoped Prettier plus `pnpm format:check`, reporting any
unrelated baseline failures separately.

## Phase 5 — Visual and responsive QA

Approved and run on 2026-08-19. The current empty state passed at 1366x768,
1024x768, 768x1024, and 390x844 with no document overflow, no visible target
below 44px, truthful local-service/printer wording, accessible filter routes,
and no browser console error. The mobile filter strip scrolls freely and exposes
the initially off-screen queue controls. Active screen and queue links now set
`aria-current="page"` after a Phase 5 accessibility correction.

The populated matrix is truthfully blocked. The local database contains 23
orders, but the newest was created at `2026-08-18T20:20:49.599Z`, before the
current 05:00 service-day boundary, so Kitchen exposes no safe current ticket.
Do not create or transition operational records solely to complete visual QA.
Independent ticket scrolling, allergy priority, direct actions, and live
interaction-height stability therefore retain earlier read-only evidence but
do not have four-viewport Phase 5 evidence.

The in-app browser also keeps agent-created tabs at `visibilityState=visible`,
so hidden-tab polling could not be exercised honestly. The visibility guard is
present in `KitchenAutoRefresh`; this is code evidence, not browser evidence.
Route-owned pending/error/recovery feedback remains unapproved and untested.

## Delivery evidence

Report changed files, current/proposed boundary decisions, exact command
results, browser/device evidence, intentional deviations, untested states,
unrelated failures, and deferred risks. Set the pack to `implemented` only
after as-built synchronization.
