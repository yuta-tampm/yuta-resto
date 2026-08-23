# POS Order Items

Status: Phase 5 combo-completion delivery complete; suggestion eligibility consumed

Visibility: Engineering

Owner: YUTA product and engineering

Protocol revision: 4

Application: `apps/yuta-pos`

Target type: `SURFACE`

Route / entry point: `/orders/[orderId]/items`

Runtime family: `local POS`

Page classification: `EXISTING_PAGE`

Implementation class: `integrated`

Delivery mode: `NEW_CAPABILITY_DISCOVERY`

Package status: `implemented`

Cross-route extension completed: Extension Phase 4 in
`../pos-management-combos/` now filters opted-out rules immediately before this
page invokes the existing completion projection. Payment/check calculation
continues receiving every active rule. The adapter uses only the persisted
boolean; it introduces no category/name/item-count heuristic or hard-coded
combo identity.

Extension Phase 5 consumer QA passes the production-browser viewport matrix at
`1366 × 768`, `1024 × 768`, `768 × 1024`, and `390 × 844` with zero document
overflow. Search, category dismissal, unrelated-item stability, and renewed
same-rule eligibility after another Gua Bao pass without a QA-only order
mutation. Authenticated management QA also passes, so the cross-route extension
is complete.

Scope status: `APPROVED`

Reference status: `APPROVED`

Inventory status: `COMPLETE`

Baseline status: `CAPTURED`

Design prompt status: `READY`

Shared context status: `RESOLVED`

## Current implementation

The dynamic Server Component in
`apps/yuta-pos/src/app/orders/[orderId]/items/page.tsx` loads the real order,
catalog, payment state, instruction settings, and combo context through
`posApi.getPaymentViewData`. It composes the shared service-time POS shell, a
category rail, route-local searchable item browser, desktop order summary,
mobile order dialog, item instruction/allergy dialog, kitchen-send action, and
real links to order detail and payment.

## 2026-08-22 Phase 5 delivery — combo-completion visual and operational QA

The product owner approved the Phase 4 boundary audit by authorizing Phase 5.
Final QA ran against the production POS build and real persisted order
`POS-20260819-201927-F38DEA`. The local service and database were available,
and the printer remained truthfully reported as not configured. QA did not add
an item, send a kitchen batch, capture a payment, or create a print job.

The exact internal viewport matrix passed:

- 1366x768: `190px / 768px / 360px` three-panel workspace, four 171px catalog
  cards per row, multiple truthful suggestion groups, and zero document
  overflow;
- 1024x768: `190px / 426px / 360px` three-panel workspace, two 183px catalog
  cards per row, and zero document overflow. Phase 5 keeps each combo heading
  above its candidate scroller at this width so the first 89x44px `Ajouter`
  action remains immediately visible;
- 768x1024: stacked layout, three 232px catalog cards, 108px two-row category
  menu with 44px targets, 56px mobile-order action, and zero document overflow;
- 390x844: stacked layout, two 168px catalog cards, 108px two-row category
  menu with 44px targets, 56px mobile-order action, and zero document overflow.

Browser interaction QA confirmed that active search hides the shelf and
clearing search restores it. A category link carries the ephemeral current
fingerprints of the visible combo rules and their relevant item quantities;
opening `Gua Bao` directly without that token still allows truthful suggestions
in that category. Adding an unrelated item does not revive a dismissed state.
Adding another rule-relevant item, such as a second Gua Bao, changes the
fingerprint and allows Gua Bao Happy to be suggested again. The
dynamic category links disable framework prefetch so a catalog response
captured before the latest dismissal state cannot restore a stale shelf.
Authenticated browser QA on the reported four-item order confirmed that
selecting `Entrées` loads only Entrées items and removes the current Gua Bao
suggestion without mutating the order.
real order exposed two suggestion groups. Deterministic core and POS tests
cover one-step qualification, multi-step/no-result exclusion, overlapping
priority, unavailable/stale candidates, locked-order omission, stable
dismissal across unrelated item changes, and renewed eligibility after another
rule-relevant item.
Candidate submission still uses the
existing non-optimistic action and visible 44px pending control; Phase 5 did
not force a real mutation or service failure solely for visual evidence.

The four `phase-5-combo-suggestions-*` references are scaled wrapper previews
of exact-size browser iframes; DOM measurements were taken inside each stated
viewport. Browser logs contained no warning or error. The only runtime change
made during Phase 5 is the 1024px presentation breakpoint correction; no
contract, site-agent, db-pos, schema, authorization, payment, kitchen,
printing, offline, or device behavior changed.

## 2026-08-22 Phase 4 delivery — integration and boundary audit

The product owner approved the Phase 3 route interaction by authorizing Phase 4. The as-built diff remains confined to the pure `@yuta/core` projection,
route-local POS mapping/presentation, focused tests, and this stable page pack.
There is no tracked or untracked change in `@yuta/contracts`, `apps/site-agent`,
`packages/db-pos`, migrations, POS transport/facade, Server Action schemas,
manifests, or the lockfile.

The existing path remains authoritative: `posApi.getPaymentViewData()` supplies
the hydrated order, catalog, and active rules; the suggestion form submits the
existing `addOrderItemAction`; site-agent revalidates the order lock and item
availability, snapshots the current item values, applies merge/separate
ordering policy, and recalculates persisted totals. Suggestions do not persist
hypothetical items, estimated savings, impressions, ranking, or client totals.

The full local regression gate passed: db-pos tests (14 passed, 2 skipped),
site-agent tests (70 passed, 9 skipped), POS tests (81 passed), production POS
build, and the disposable-database offline acceptance flow. Architecture,
workspace typechecks, documentation, page-pack, scoped Prettier, and diff
checks also pass. Repository-wide `format:check` currently reports two
unrelated dirty Backoffice formalities files; they were preserved. Phase 4 adds
no runtime code and stops for approval before Phase 5 visual and operational
QA.

## 2026-08-22 operator-feedback correction — mobile catalog interaction

Operator testing at 390x844 exposed two route-local presentation defects. The
mobile outer grid stretched its implicit category row to consume spare viewport
height, leaving a large blank area before search. Catalog-item submission was
working and persisted additions, but the only visible confirmation arrived
after revalidation through the small quantity badge and bottom order count.

The mobile grid now uses start-aligned content while desktop explicitly retains
its stretched fixed-height three-column workspace. Catalog cards now expose a
disabled `Ajout...` overlay with a spinner and accessible pending label while
the unchanged `addOrderItemAction` runs. No optimistic quantity, total, or
success claim was added.

Browser verification at 390x844 reduced the category region to 109px, left a
9px transition to search, preserved the two-column catalog and fixed order
trigger, produced no document-level horizontal overflow, and changed no order
data during QA. POS typecheck and all 81 POS tests pass.

Follow-up operator feedback clarified that the combo shelf is not owned by
`Toutes`: it may appear in any category when the current order has truthful
candidates. Selecting a category dismisses the current shelf for the current
route session. Later unrelated item changes do not revive those dismissed
states, while adding another item relevant to the same rule creates a new state
that may be suggested again. Clean-origin browser QA confirmed a shelf
in the direct `Gua Bao` view and no shelf after category navigation. The
dismissal remains presentation-only and POS now has 84 passing tests.

## 2026-08-22 Phase 3 delivery — route-local combo suggestions

The product owner approved the Phase 2 behavior by authorizing Phase 3. The
route now maps non-cancelled order items, active combo rules, and the real
catalog into the pure core projection. POS owns the presentation filter: only
available items inside active categories can appear, and candidates are grouped
by the qualifying combo in rule-priority order with catalog sort order inside
each group.

`MenuItemBrowser` renders the approved compact `Compléter …` shelf after search
and before the standard item grid. It is absent when there is no truthful
candidate, when the order cannot be edited, and while search contains a
non-empty query. Candidate forms reuse `addOrderItemAction`; the action remains
non-optimistic and the clicked candidate is disabled with visible pending copy
until the existing service mutation and route revalidation finish.

Focused POS tests cover real catalog mapping/order, inactive categories,
unavailable and stale eligible items, and locked-order omission. No API,
contract, site-agent, db-pos, schema, authorization, payment, kitchen, printing,
offline, or device behavior changed. Phase 4 later confirmed these boundaries.

Read-only browser QA used the real local order
`01a01bad-c148-704e-a042-c5f3c8f38dea` at 1280px. The route produced truthful
`Gua Bao Happy` and `Menu Express` groups from the current optimizer and
catalog. Entering `pho` removed the shelf while preserving the matching catalog
result; clearing search restored it. No add control was submitted. The page had
no document-level horizontal overflow and no browser warning or error.

## 2026-08-22 Phase 2 delivery — pure combo-completion projection

The product owner approved both corrected Phase 1 references by authorizing
Phase 2. `packages/core/src/combos.ts` now exports
`calculateComboCompletionSuggestions`, a pure one-item-away projection that
reuses `calculateComboDiscounts` for every hypothetical candidate instead of
reimplementing matching or pricing.

The projection compares the current optimizer result with the result after one
candidate unit. It emits a suggestion only when both the number of positive
combo applications and total discount increase. It therefore inherits active
rule ordering, overlapping-unit consumption, group quantities, pricing modes,
and `maxApplications` from the authoritative calculator. Candidate menu-item
IDs are deduplicated and results are ordered by qualifying rule priority, name,
and item ID.

Focused core tests cover one-step qualification, multi-step exclusion,
multi-quantity groups, higher-priority overlap, bounded applications,
deduplication/order, inactive rules, and non-positive outcomes. Phase 2 does
not import catalog availability into core, render UI, call an action, or change
contracts, site-agent, db-pos, schema, authorization, payment, kitchen,
printing, offline, or device behavior. POS availability/category filtering and
route integration are delivered in Phase 3.

## 2026-08-21 Phase 0 reopening — combo-completion suggestions

The product owner requested a data-driven shortcut for high-frequency combo
completion, initially observed as staff selecting a Gua Bao and then having to
find the eligible house iced tea in another category. The proposal must reuse
the existing catalog item and combo configuration; it must not duplicate a menu
item, create a virtual persisted category, or hard-code a product name or ID.

1. **Target:** route-local suggestion surface inside the existing dynamic page
   `/orders/[orderId]/items`.
2. **Target type:** `SURFACE` hosted by an `EXISTING_PAGE`.
3. **Capability classification:** the page, catalog, order mutations, combo
   management, and combo pricing are existing and integrated; combo-completion
   suggestions are a new flow over that proven domain. Use
   `NEW_CAPABILITY_DISCOVERY` for the new flow while preserving the existing
   page in place and using real data from the first implementation slice.
4. **Implementation class:** `integrated` because the surface depends on the
   current persisted order, active catalog, active combo rules, and the existing
   add-item Server Action.
5. **Current data availability:** `posApi.getPaymentViewData()` already returns
   the order, catalog, and active combo rules. The catalog contract already
   contains rule priority, maximum applications, groups, quantities, eligible
   menu-item IDs, and per-item extra price. No new loader or transport is
   expected.
6. **Current mutation path:** candidate selection must submit the existing
   `addOrderItemAction`; site-agent continues to own availability checks,
   ordering policy, snapshots, totals, locks, and transactions.
7. **Calculation ownership:** presentation code must not reproduce combo
   matching. The approved implementation should add or reuse a pure
   `@yuta/core` projection that shares the authoritative
   `calculateComboDiscounts` semantics, then let POS map returned item IDs to
   currently available catalog items.
8. **Initial product policy proposal:** show only one-item-away completions. A
   candidate qualifies only when hypothetically adding one unit causes the
   authoritative optimizer to produce one additional positive combo
   application. This avoids noisy multi-step upsell and respects rule priority,
   overlap, quantities, and `maxApplications`.
9. **Current active-rule evidence:** the local catalog exposed `Menu Gourmand`
   priority 10, `Gua Bao Happy` priority 20, `Menu Express` priority 30, and
   `Combo Été` priority 40. Gua Bao items overlap Gourmand, Happy, and Express,
   so name/category matching would be incorrect.
10. **Candidate filtering:** later implementation must exclude unavailable
    items, items under inactive categories, missing catalog references, and
    candidates that do not improve an optimizer result. Duplicate candidate
    items are shown once under the highest-priority qualifying rule.
11. **Expected UI boundary:** a compact French `Compléter …` suggestion shelf
    below catalog search and above the normal item grid. It is omitted when no
    truthful candidate exists, the order cannot be edited, or an active search
    query owns the result context.
12. **Protected behavior:** preserve all current loader side effects, order and
    payment locks, item snapshots, ordering policies, variants, instructions,
    allergies, kitchen send, printing, staff attribution, totals, and payment
    combo calculation.
13. **Trust/runtime:** service-time staff selection remains attribution rather
    than authentication. POS still uses
    `apps/yuta-pos -> apps/site-agent -> packages/db-pos -> local PostgreSQL`.
14. **Offline/device:** no offline mutation queue, realtime path, printer
    routing, or device behavior is introduced.
15. **Baseline:**
    `references/phase-0-combo-suggestions-current-1366x768.png`, captured on
    2026-08-21 at 1366x768 from a real persisted `sent`, `single` order
    `POS-20260819-201927-F38DEA`. It contains one Gua Bao and no eligible 25 cl
    house iced tea. No control was submitted. Loading invoked the existing
    payment-summary optimizer and advanced only the order update timestamp.
16. **Shared context:** remains `RESOLVED` with
    `REUSE_APPROVED_SHARED_SHELL`; no shell, navigation, account, management,
    or route change is proposed.
17. **Expected packages:** `apps/yuta-pos`, `packages/core`, and this stable
    page package. Current product/operator docs are updated only when behavior
    is implemented.
18. **Change flags:** database `NO`; API/contract `NO`; permission/auth `NO`;
    runtime/device `NO`. A later finding that requires any of these stops for a
    separate approval.
19. **Required focused tests:** one-item completion, overlapping priorities,
    already-complete rules, `maxApplications`, duplicate candidates,
    unavailable/inactive/missing catalog entries, locked orders, and reuse of
    the current add-item action.
20. **Exact verification:** `pnpm ui:pack:check pos-order-items`,
    `pnpm docs:check`, `pnpm architecture:check`,
    `pnpm -r --if-present typecheck`, `pnpm format:check`,
    `pnpm typecheck:pos`, `pnpm test:pos`, `pnpm build:pos`, and affected core
    checks. Site-agent/contracts/db-pos checks remain regression boundaries even
    though no change is expected there.

Fixture replacement remains forbidden. Phase 0 changes documentation and
visual evidence only; it does not authorize runtime implementation.

## Authority

1. Root and `apps/yuta-pos/AGENTS.md`.
2. `docs/CURRENT_STATE.md`, POS product/operator/offline/QA documentation, and
   current architecture/operations documentation.
3. `docs/ui/DESIGN_TO_CODE_WORKFLOW.md`,
   `docs/ui/DELIVERY_WORKFLOW_MODES.md`, `docs/ui/PAGE_PACK_PROTOCOL.md`,
   `docs/ui/YUTA_FRONTEND_RULES.md`, and `docs/ui/POS_FRONTEND_RULES.md`.
4. Current contracts, site-agent routes/services, db-pos schema, and tests.
5. Current POS shell and adjacent order detail, kitchen, payment, and `/pos`
   implementations.
6. This package, `@yuta/ui`, semantic tokens, and later approved references.

## Phase 0 Implementation Inventory

1. **Target:** `apps/yuta-pos`, real dynamic route
   `/orders/[orderId]/items`.
2. **Target type:** `PAGE`.
3. **Classification:** `EXISTING_PAGE`; it has real persisted data, loaders,
   mutations, validation, transaction-backed commands, and production routes.
4. **Class/mode:** `integrated`, `EXISTING_CAPABILITY_RENEWAL`. The page shows
   printer status and can create a kitchen print job through kitchen send, but
   it does not control hardware, so the UI target itself is not classified as
   device-coupled.
5. **Route/shell/container:** `items/page.tsx`, `MenuItemBrowser.tsx`,
   `MobileOrderDialog.tsx`, `OrderItemNoteDialog.tsx`, and
   `kitchen-send-validation.ts`; shared `PosPageShell.tsx`, `PosHeader.tsx`,
   `PosConnectivityStatus.tsx`, `SendToKitchenButton.tsx`, and
   `AllergyAlert.tsx`.
6. **Trust/identity:** service-time POS has no authenticated staff session in
   the current MVP. `yuta_pos_staff_id` is attribution selection, not auth.
   Item add/update/remove routes do not use a bearer session. Kitchen send
   re-resolves the selected local user and site-agent requires an active user.
   Management PIN/bearer authorization does not apply. This is single-site
   local infrastructure, not cloud tenancy.
7. **Data owner:** `packages/db-pos` owns local users, catalog, orders, items,
   payments, checks, and print jobs; only `apps/site-agent` accesses local
   PostgreSQL. POS has no DB driver or secret.
8. **Transport/contracts:** server-only `pos-api.ts`/`site-agent-client.ts` use
   `@yuta/contracts/local-pos` schemas for catalog, order detail, payment
   summary, add/update item, item commands, and order commands.
9. **Loaders/actions/mutations:** the loader combines order detail, payment
   summary, and catalog. The current payment-summary GET calls
   `optimizeOrder()` for editable `single` orders, so loading this page may
   persist combo/total recalculation and advance `orders.updatedAt`; it is not a
   side-effect-free loader. Server Actions validate form input with Zod, then
   call site-agent to add an item, update quantity/instructions/allergy,
   soft-remove a pending item, or send pending items to kitchen. Site-agent
   repeats strict contract validation and owns totals, snapshots, locks, status
   rules, idempotency, and transactions.
10. **Polling/offline/device:** page content is request-loaded and does not poll.
    The shared health strip polls every 15 seconds while visible and on focus/
    connectivity/visibility events. No offline mutation queue exists. Kitchen
    send atomically snapshots the pending batch and creates durable print jobs;
    physical printing remains site-agent-owned and the browser sees no device
    path.
11. **Shared UI:** reuse current `Alert`, `Badge`, `Button`, `Checkbox`,
    `Dialog`, `IconButton`, `Input`, `Label`, `Select`, `Textarea`, semantic
    tokens, Lucide icons, and route-local responsibility components. Do not
    create a parallel primitive library.
12. **Tests:** contract tests protect commands/schemas; POS client tests protect
    serialization and errors; `kitchen-send-validation.test.ts` protects
    variant/error mapping; site-agent server tests protect routing/strict input;
    financial/order integration tests protect kitchen sends, locks,
    idempotency, staff attribution, and persistence; db-pos tests protect schema
    constraints. There is no focused rendered-page test.
13. **Documentation:** root/current-state, POS README, product spec, user guide,
    offline strategy, QA checklist, deployment/local development, and the UI
    workflow/rules are authoritative.
14. **Protected invariants:** local-only ownership; historical snapshots and no
    hard delete; pending-only free edits; item/order/payment locks; `single`
    payment mode and no paid payment for editing; ordering-policy merge vs
    separate portions; required variant quantities; structured instruction and
    allergy validation; separate POS acknowledgement and kitchen confirmation;
    UUIDv7 kitchen-send idempotency; exact pending-batch ticket creation;
    service-owned totals and combo calculation; truthful health/printer states.
15. **Baseline:** `references/phase-0-current-1366x768.png`, captured 2026-08-14
    at 1366x768 on a clean dev origin using a real persisted draft order with
    three pending items. Site-agent/database were healthy, Internet probe was
    unconfigured, printer was unconfigured, and document horizontal overflow
    was zero. No form/control was submitted. Loading the real route invoked the
    existing payment-summary combo optimization and advanced only the order's
    `updatedAt`; item/status/payment state remained unchanged.
16. **Conflicts:** no mockup was supplied. Phase 0 captured the then-current
    compact POS shell while `/pos` used a route-local prominent variant. The
    product-owner follow-up on 2026-08-16 explicitly supersedes that shell-only
    constraint and standardizes the prominent desktop header across
    non-management service-time routes. Current item cards still use generated
    initials, not catalog images.
17. **Unsupported proposals:** new product imagery/storage, table map, customer
    or delivery-provider data, VAT/fiscal receipt, new navigation, new roles or
    permissions, staff login, cloud sync, offline command queue, realtime,
    printer controls/routing, new item/order/payment states, new schema/API/
    contract fields, or presentation-owned price/combo calculations.
18. **Expected impact:** later approved work should stay in the existing item
    route and justified route-local components/tests plus this package. Shared
    POS components require separate impact review because they have many
    consumers.
19. **Change flags:** database `NO`; API/contract `NO`; permission/auth `NO`;
    runtime/device `NO`. Any requirement for one is a separate proposal.
20. **Verification commands:** `pnpm ui:pack:check pos-order-items`,
    `pnpm docs:check`, `pnpm architecture:check`,
    `pnpm -r --if-present typecheck`, `pnpm format:check`,
    `pnpm typecheck:pos`, `pnpm test:pos`, and `pnpm build:pos`; when an
    affected boundary changes, also `pnpm typecheck:site-agent`,
    `pnpm test:site-agent`, `pnpm typecheck:db-pos`, `pnpm test:db-pos`,
    contracts/core checks, and `pnpm test:pos:offline`.
21. **Proposed later files:** existing files under
    `apps/yuta-pos/src/app/orders/[orderId]/items/`, justified POS tests, and
    this stable package only. Exact files wait for approved design.
22. **Shared context:** YUTA primitives/tokens; current POS service-time shell;
    the real `/pos` -> items -> detail/kitchen/payment flow; and the captured
    target are resolved in `DESIGN_HANDOFF.md`. The Backoffice shell reference
    and management shell do not apply.
23. **Shell/navigation:** `REUSE_APPROVED_SHARED_SHELL`. Keep the shared
    prominent desktop `PosPageShell`/`PosHeader`, logo link to `/`, payment link,
    and truthful connectivity strip. The header has no leading back-arrow action.
    The shared three-line menu exposes `Commandes` -> `/`, `Cuisine` ->
    `/kitchen`, and `Gestion` -> `/management`; below `lg`, retain its compact
    behavior. Desktop keeps category/menu/
    order columns; narrow widths keep horizontal categories and the existing
    mobile order dialog. The direct `Nouvelle commande` action remains Home-only.
    No sidebar replacement, bottom navigation, tenant/account UI, management
    links, or invented routes.

Fixture replacement is forbidden for this existing integrated page.

## References

- `references/design-proposal-04-combo-suggestions-desktop.png` - approved
  Phase 1 desktop combo-completion shelf direction.
- `references/design-proposal-05-combo-suggestions-narrow.png` - approved Phase
  1 390x844 companion preserving the two-row category pattern.

- `references/phase-0-current-1366x768.png` - current real operational
  baseline, evidence only.
- `references/design-proposal-01-desktop-v2.png` - corrected desktop renewal,
  approved for hierarchy, density, spacing, and responsive direction.
- `references/design-proposal-02-narrow-v2.png` - corrected narrow catalog,
  order-dialog, and recovery studies, approved as directional guidance.
- `references/design-proposal-03-send-success.png` - product-requested
  post-kitchen-send success screen for desktop and narrow layouts, approved for
  the later interaction phase.
- `references/phase-5-as-built-1366x768.png` - final desktop operational
  evidence.
- `references/phase-5-as-built-1024x768.png` - final compact-desktop
  operational evidence.
- `references/phase-5-as-built-768x1024.png` - final tablet operational
  evidence.
- `references/phase-5-as-built-390x844.png` - final narrow operational
  evidence.
- `references/design-proposal-01-desktop.png` and
  `design-proposal-02-narrow.png` - rejected first drafts retained as review
  evidence because they invented filter and per-item overflow controls.

## Shared UI context

The target reuses the current service-time POS shell and real order-flow
patterns. The global Backoffice reference is not applicable. Page-specific
density may adapt after approval; shell ownership, routes, status semantics,
and operational actions may not be invented or replaced.

## Protected invariants

- Preserve `apps/yuta-pos -> apps/site-agent -> packages/db-pos -> local PostgreSQL`.
- Preserve real data, active-staff kitchen-send attribution, transactions,
  item/payment locks, snapshots, no-hard-delete behavior, and UUIDv7 replay.
- Preserve ordering policies, variants, instructions, allergy acknowledgement,
  kitchen batch/print-job semantics, and service-owned totals/combos.
- Preserve truthful local-service/printer state and French operator UI.

## Change impact

```text
Files expected to modify: existing route-local item-entry files after design approval; this stable page package
Files expected to create: approved design/QA evidence and justified route-local tests/components only
Packages affected: apps/yuta-pos and docs/ui/pages/pos-order-items
Cross-application impact: none
Database change: NO
API or contract change: NO
Permission/auth change: NO
Runtime/device change: NO
```

## Design approval

Phase 0 inventory, baseline, shared context, protected invariants, and design
prompt were approved by the product owner on 2026-08-14. Design generation may
proceed. The product owner approved the three corrected visual references on
2026-08-15 and authorized Phase 1. The references guide presentation only;
repository copy, routes, data, validation, and operational behavior remain
authoritative.

The product owner additionally approved the product requirement that a
successfully confirmed kitchen send replaces the item-entry workspace with a
dedicated success state. It contains exactly two navigation actions:
`Créer une autre commande` to `/pos` and `Retour aux commandes` to `/`. This is
an approved interaction requirement. The product owner authorized Phase 3 on
2026-08-15.

## Phase 1 delivery

Phase 1 renews only the existing route-local presentation. It widens the
service workspace, strengthens the selected-category treatment, increases
catalog density and visual hierarchy, adds a data-backed current-order status,
aligns the desktop summary with the approved reference, and promotes the narrow
`Voir commande` action. Service-critical payment, quantity, instruction,
kitchen-send, detail, and close controls now provide at least 44px effective
targets.

Changed runtime files are limited to:

- `apps/yuta-pos/src/app/orders/[orderId]/items/page.tsx`;
- `apps/yuta-pos/src/app/orders/[orderId]/items/_components/MenuItemBrowser.tsx`;
- `apps/yuta-pos/src/app/orders/[orderId]/items/_components/MobileOrderDialog.tsx`;
- `apps/yuta-pos/src/app/orders/[orderId]/items/_components/OrderItemNoteDialog.tsx`.

No loader, Server Action, route, contract, site-agent call, authorization,
persistence, transaction, polling, offline, kitchen, payment, or printer
behavior changed. The approved post-send success screen remains deferred to the
interaction phase.

Production-build browser verification used the real persisted draft order
`POS-20260809-072857-FF6F24` without submitting a control or mutating data. At
1366x768 and 390x844, the document had no horizontal overflow, stayed contained
to the viewport, and exposed 44px service controls; the narrow order trigger was
56px. The mobile current-order dialog remained scroll-contained at 728px in an
844px viewport. No browser console warning or error was observed.

Phase 1 verification passed: POS typecheck, 48 POS tests, POS production build,
workspace typecheck, page-pack validation, documentation consistency,
architecture boundaries, scoped Prettier, and `git diff --check`.

## Phase 2 delivery

Phase 2 extracts the duplicated order-item presentation and quantity controls
from the desktop summary and narrow current-order dialog into the route-local
`OrderItemPresentation.tsx` responsibility component. The Server Component
continues to load trusted data and now builds one serialized presentation model
for both layouts; mutation forms remain client-side only where interaction is
required.

The refactor preserves the Phase 1 catalog/order composition, French copy,
routes, accessibility names, edit locks, ordering-policy behavior,
instruction/allergy dialog, Server Actions, site-agent calls, and all
operational boundaries. Product-owner review restored the category submenu as
the first column of the fixed desktop workspace and retained it as a horizontal
row on narrow layouts. It remains backed by the existing category query routes,
marks the current category, and scrolls horizontally without document overflow
when space is constrained. The change introduces no contract, authorization,
persistence, transaction, kitchen, payment, printer, polling, or offline
behavior. The approved post-send success screen remains deferred to Phase 3.

Browser verification on the clean local development instance reused the
persisted draft order `POS-20260814-223049-B857B6` from product-owner review
without submitting a control. At 1366x768 the rendered desktop grid measured
`190px / 816px / 360px`; at 1024x768 it measured `190px / 474px / 360px`. Both
retained the three visible category, catalog, and current-order columns with
zero document overflow. At 768x1024 and 390x844 the 13 category links changed
to the approved horizontal scroller with 44px targets and zero document
overflow. No browser console warning or error was observed on the clean origin.

Phase 2 verification passed: scoped Prettier and diff checks, POS typecheck, 48
POS tests, POS production build, workspace typecheck, page-pack validation,
documentation consistency, and architecture boundaries.

## Phase 3 delivery

Phase 3 adds the approved post-kitchen-send success state without changing the
site-agent command, contract, idempotency key, database transaction, kitchen
batch, print-job ownership, or error mapping. The existing Server Action now
returns a typed success result only after its schema-validated site-agent call
resolves. A route-scoped client boundary consumes that trusted result and
replaces the item-entry workspace; browser-provided query parameters cannot
activate the state.

While the command is pending, kitchen-send controls are disabled and display a
truthful progress label. Existing allergy confirmation and service-error
recovery remain in place. The shared kitchen-send component preserves its
existing refresh behavior on routes that do not opt into the item-route success
screen.

The success state moves focus to its status region and shows a five-second
countdown before automatically navigating to the approved home route `/`. The
two immediate navigation actions remain available: `Créer une autre commande`
to `/pos` and `Retour aux commandes` to `/`. Its copy confirms that the command
was transmitted to the kitchen and that the order remains open for tracking
and payment; it does not claim physical printer success. The product owner
approved the timed home redirect on 2026-08-15.

The countdown is presented as a text-backed success pill with a high-contrast,
large seconds badge so the remaining time is immediately scannable without
relying on color alone.

Product-owner desktop review also corrected the route canvas to match the
approved reference: the service workspace now uses the full available desktop
width instead of stopping at 1600px, and category, catalog, and current-order
areas render as three distinct bordered panels with responsive gaps. At the
`2xl` breakpoint the category and order panels widen to 220px and 440px, while
the catalog grid adds columns as space becomes available so item cards do not
stretch across ultra-wide displays. Narrow layouts retain the existing stacked
composition.

Clean production-build browser QA measured the reference-width 1680px layout
at `220px / 956px / 440px`, with four 218px catalog cards in the first row. At
2560px the shell occupied the complete viewport, the catalog adapted to eight
213px cards, and the fixed side panels remained 220px and 440px. Both viewports
had three distinct 12px-radius bordered panels, zero document overflow, and no
browser warning or error.

The narrow category row now has an explicit pointer-drag interaction in
addition to native scrolling, so touch, stylus, and mouse dragging can move the
horizontal menu without activating a category link. At 390px browser QA
measured 1330px of category content in a 375px viewport and a leftward drag
moved the row from `scrollLeft=0` to `scrollLeft=295` while keeping the selected
category and URL unchanged. Vertical page gestures remain available through
`touch-action: pan-y`.

Focused tests verify the trusted action result, preserved empty-send error,
exact success routes, and exclusion of a printer-success claim. Clean-origin
browser inspection verified that a forged `sendSuccess=true` query parameter
leaves the normal item-entry workspace visible, with no success heading, no
document overflow, and no console error. No real kitchen command or print job
was created solely for Phase 3 browser evidence.

Phase 3 verification passed: scoped Prettier, POS typecheck, 51 POS tests, POS
production build, workspace typecheck, page-pack validation, documentation
consistency, architecture boundaries, and `git diff --check`. Repository-wide
`format:check` was run and remains blocked by 36 pre-existing or out-of-scope
files; the Phase 3 runtime files pass the scoped Prettier check.

## Phase 4 delivery

Phase 4 completed as a no-change integration audit. The renewed route still
loads the existing payment summary, order detail, and catalog through
`posApi.getPaymentViewData()`, which delegates to the schema-validated
site-agent client. Catalog categories/items, order-item snapshots, payment
locks, totals, discounts, instruction settings, allergy data, and order status
continue to come from the current local contracts and service-owned models.

The Phase 2–3 presentation model, category scroller, pending action state, and
timed success navigation use only already-loaded serialization-safe data or
ephemeral browser state. The trusted kitchen-send result is not persisted as a
new field and an untrusted URL parameter still cannot establish success. Staff
attribution remains resolved by the existing Server Action immediately before
the existing `send_to_kitchen` command.

Repository diff and import audits found no change to `packages/contracts`,
`apps/site-agent`, `packages/db-pos`, package manifests, or the lockfile. No
field, enum, permission, API route, transport contract, schema/migration,
transaction rule, runtime dependency, offline queue, printer/device setting, or
persistence owner was added or changed. Cloud organization/establishment
tenancy was not introduced into the local POS boundary.

Phase 4 verification passed contracts, site-agent, and db-pos typechecks plus
the repository architecture boundary check. Boundary integration tests were
not rerun because Phase 4 changed no contract, service, database, offline, or
device behavior; the Phase 3 delivery already passed POS typecheck, 51 POS
tests, and the production build.

## Phase 5 delivery

Phase 5 ran after the functional/regression gate passed. Clean
production-build browser QA used the real persisted order
`POS-20260815-080849-A4505C` with the local service/database available and the
printer truthfully shown as not configured. No item, kitchen command, payment,
or print job was created for final visual evidence.

The final viewport matrix passed:

- 1366x768: three `190px / 768px / 360px` panels, four 171px catalog cards per
  row, desktop payment/current-order controls, and zero document overflow;
- 1024x768: three `190px / 426px / 360px` panels and two 183px catalog cards per
  row. Phase 5 changed this breakpoint from three 118px cards to two usable
  cards without changing the three-panel workflow;
- 768x1024: stacked 753px content, three 232px catalog cards, horizontally
  scrollable 44px category targets, 56px mobile-order action, and zero document
  overflow;
- 390x844: stacked 375px content, two 168px catalog cards, horizontally
  draggable 44px category targets, 56px mobile-order action, and zero document
  overflow.

All four viewports retained the current compact POS shell, truthful text-backed
local-service/printer state, real category/search routes, accessible names, and
the approved desktop versus narrow order composition. Browser logs contained
no warning or error. The 1680px and 2560px evidence recorded during product
review additionally protects the approved full-width panel hierarchy and
ultra-wide catalog adaptation.

Product-owner follow-up on 2026-08-16 supersedes only the historical compact
desktop header choice: all non-management service-time routes now use the
shared prominent desktop header and compact behavior below `lg`. The item-entry
workflow, action ownership, and recorded Phase 5 content evidence remain
unchanged; `Nouvelle commande` is not added to this route.

The same follow-up removes the leading header back arrow from item, payment,
and split-payment screens so their shared header aligns with Home. Logo/Home
navigation, the shared three-line `Commandes`/`Cuisine`/`Gestion` menu, and
approved route-owned workflow actions remain available.

The product owner exercised the trusted success transition during Phase 3.
Phase 5 did not submit another real order solely to recapture it; focused tests
protect trusted action success, the exact two routes, the five-second home
timer copy, and the absence of a physical-print claim. A forged success query
was separately verified to leave the normal workspace visible.

Intentional as-built adaptations and deferred risks:

- 1024px uses two catalog cards per row to preserve readable touch density;
- ultra-wide screens add catalog columns instead of stretching four cards;
- catalog artwork remains generated initials because the current domain has no
  approved image capability;
- native offline order mutation remains unsupported and unchanged;
- physical printer delivery was not tested because no printer is configured,
  and the UI makes no success claim about physical output;
- existing action recovery semantics were preserved; Phase 5 did not expand
  form persistence or add a new retry/offline capability.

Product-owner mobile follow-up on 2026-08-19 keeps the horizontal category menu
sticky at the top of the route content below `lg`, so category selection remains
available while the catalog scrolls. The ancestor uses horizontal clipping
rather than a nested horizontal scroll container, allowing sticky positioning
to follow the existing `PosPageShell` content scroller. Search and catalog
content continue to scroll normally. Staff feedback then moved the narrow menu
to two compact rows with 44px touch targets, reducing the horizontal travel
needed to reach later categories; mobile search padding was tightened to limit
the added vertical cost. Each category now uses a semantic filled surface,
border, and focus ring so every target reads as an interactive chip; the active
category uses the existing success selection treatment. Desktop retains its
fixed category rail. No route, loader, action, contract, persistence,
transaction, or device behavior changed.

The same-device review found that the custom drag threshold could classify a
small finger movement as a drag and suppress the following category click.
Touch now uses the browser's native scrolling/tap handling, while the custom
drag path remains limited to mouse and pen input with a larger movement
threshold. Category taps therefore navigate normally without removing the
two-row horizontal swipe behavior.

A later mouse/pen regression showed that an ordinary click with slight pointer
movement could still cross the original custom threshold. The gesture now
requires at least 16px of horizontal-dominant movement before suppressing link
activation, and pointer capture begins only after that drag intent is proven.
Small or vertical-dominant movement therefore remains targeted at the category
link; real horizontal dragging still scrolls the rail without navigation.

Operator review of the narrow combo shelf found that the inline add action left
too little room to identify candidates with similar names. Narrow suggestion
cards now show the complete real catalog name and price in an unconstrained
text row, with the 44px add action spanning the card below it. Wider layouts
retain the compact inline action. Suggestion semantics, ordering, and the
existing add-item action remain unchanged.

A 2026-08-20 mobile regression showed the correct server-rendered category
markup falling back to a single vertical grid because the POS Tailwind build
did not discover route-local utility classes. The POS stylesheet now registers
`apps/yuta-pos/src` as the PostCSS scanner base, covering both route-owned and
shared POS components even though the Tailwind import is provided by
`@yuta/ui`. Browser verification must confirm the two-row layout,
44px category targets, category navigation, and zero document overflow after a
clean development or production CSS build. The regression gate confirmed all
six required grid/spacing utilities in the production CSS artifact, a clean POS
production build, and 73 passing POS tests.

The same follow-up exposed a local-development-only Turbopack route-manifest
race: the first request to the compiled `/orders/[orderId]/items` route could
temporarily resolve to `/_not-found` after a production build. The POS dev
script now uses Next.js's supported webpack fallback; production build output,
route ownership, loader behavior, contracts, and operational data are
unchanged.

Final verification passed: scoped Prettier, POS typecheck, 51 POS tests, POS
production build, workspace typecheck, contracts/site-agent/db-pos typechecks,
architecture boundaries, page-pack validation, documentation consistency, and
`git diff --check`. Repository-wide `format:check` remains red only for the
previously recorded baseline/out-of-scope files.

## Prompt order

Run `prompts/00_REPOSITORY_ANALYSIS.md` through `05_VISUAL_QA.md` in order and
obtain explicit product-owner approval before every later phase.

## Stop conditions

Stop for any new capability, field, enum, permission, auth/session behavior,
contract, API, schema/migration, runtime, polling/offline, printer/device,
transaction, kitchen, or payment change.

## Final delivery and as-built status

As-built documentation status: `COMPLETE`
