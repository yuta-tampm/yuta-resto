# POS management combos — Implementation Plan

Status: All phases complete and approved

Visibility: Engineering

## Phase 0 — repository and design handoff

Completed read-only repository analysis, shared-context resolution,
authenticated baseline capture, and design prompt preparation. No runtime code
was changed. Stop for approval.

## Phase 1 — approved visual baseline

Completed on 2026-08-13 after explicit approval. The real route now reuses
`ManagementHeader`; the protected page loader and Server Actions remain in
place. Page-local rule/group/item disclosure implements the approved
hierarchy, density, and responsive direction. No fixtures, contracts, API,
auth, schema, or device behavior changed. Desktop and 390 px authenticated
evidence is recorded under `references/`.

## Phase 2 — component responsibilities

Completed on 2026-08-13. The Phase 1 composition is now separated into
route-local page orchestration, overview/disclosure, rule dialogs, group/item
dialogs, dialog support, and pure presentation-model helpers. All components
remain within the combos route. No shared primitive, framework, Server Action,
contract, business rule, or runtime boundary changed.

## Phase 3 — interactions and states

Completed on 2026-08-13. Rule/group/item dialogs now use viewport-contained
internal scrolling with persistent actions, associated labels, and guarded
pending dismissal. Stale not-found failures expose route-local refresh
recovery; conflict, structure, service, and validation messages are covered by
focused tests. Authenticated browser QA verified initial/returned focus,
client-side required validation, confirmation cancellation, active locks,
disclosure state, narrow containment, no horizontal overflow, and truthful
site-agent-unavailable behavior without intentionally submitting a mutation.
Server Action and site-agent semantics remain unchanged.

## Phase 4 — data integration verification

Completed on 2026-08-13 without runtime changes. The audit verified catalogue
loading, trusted local-session recovery, Server Action parsing, shared Zod
contracts, response parsing, bearer forwarding, site-agent authorization and
validation, group-delete transaction ownership, route revalidation,
`@yuta/core` matching, order/check persistence, and historical snapshots.
Focused contract, management integration, and combo persistence integration
tests were added and pass with isolated UUID records and cleanup.

The broader existing financial integration test remains environment-sensitive:
on the shared local database it encountered three pending print jobs while its
combined printer assertion expects exactly two, before reaching combo/payment
assertions. Phase 4 did not delete or rewrite the operator print queue; focused
combo persistence coverage was used instead.

## Phase 5 — visual and accessibility QA

Completed on 2026-08-13. Authenticated as-built evidence was captured at
`1366 × 768`, `1024 × 768`, `768 × 1024`, and `390 × 844` against the real
local site-agent response. Every viewport has zero document-level horizontal
overflow. Browser QA verified disclosure by keyboard, visible focus, initial
dialog focus, client-side required validation, Escape dismissal, focus return,
active structural locks, direct narrow actions, and a `390 × 844` editor kept
inside the viewport with an independently scrolling field region.

Visual QA identified route-local `size="sm"` icon/action triggers below the
preferred POS touch size. The rule, group, item, toggle, and delete triggers now
use a minimum `44 × 44` target without changing their actions or shared button
primitive. POS typecheck, 34 tests, production build, and final browser
verification pass after the adjustment. The package and reference inventory
now describe the as-built result.

Product-owner approval of Phase 5 and final delivery was recorded on
2026-08-13.

Every phase stops for product-owner approval before the next phase.
