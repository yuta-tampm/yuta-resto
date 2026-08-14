# POS Order Items

Status: Phase 1 ready for review

Visibility: Engineering

Owner: YUTA product and engineering

Protocol revision: 4

Application: `apps/yuta-pos`

Target type: `PAGE`

Route / entry point: `/orders/[orderId]/items`

Runtime family: `local POS`

Page classification: `EXISTING_PAGE`

Implementation class: `integrated`

Delivery mode: `EXISTING_CAPABILITY_RENEWAL`

Package status: `implementation-ready`

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
16. **Conflicts:** no mockup was supplied. The current page uses the compact POS
    shell while `/pos` now opts into a route-local prominent variant in an
    uncommitted sibling task; design must reuse the current target shell and
    cannot silently propagate `/pos`'s variant. Current item cards use generated
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
23. **Shell/navigation:** `REUSE_CURRENT_TARGET`. Keep the current compact
    `PosPageShell`/`PosHeader`, logo link to `/`, back link to order detail,
    payment link, and truthful connectivity strip. Desktop keeps category/menu/
    order columns; narrow widths keep horizontal categories and the existing
    mobile order dialog. No sidebar replacement, bottom navigation, tenant/
    account UI, management links, or invented routes.

Fixture replacement is forbidden for this existing integrated page.

## References

- `references/phase-0-current-1366x768.png` - current real operational
  baseline, evidence only.
- `references/design-proposal-01-desktop-v2.png` - corrected desktop renewal,
  approved for hierarchy, density, spacing, and responsive direction.
- `references/design-proposal-02-narrow-v2.png` - corrected narrow catalog,
  order-dialog, and recovery studies, approved as directional guidance.
- `references/design-proposal-03-send-success.png` - product-requested
  post-kitchen-send success screen for desktop and narrow layouts, approved for
  the later interaction phase.
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
an approved interaction requirement, not evidence that runtime behavior is
implemented.

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
- `apps/yuta-pos/src/app/orders/[orderId]/items/MenuItemBrowser.tsx`;
- `apps/yuta-pos/src/app/orders/[orderId]/items/MobileOrderDialog.tsx`;
- `apps/yuta-pos/src/app/orders/[orderId]/items/OrderItemNoteDialog.tsx`.

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

Phase 2 is not approved.

## Prompt order

Run `prompts/00_REPOSITORY_ANALYSIS.md` through `05_VISUAL_QA.md` in order and
obtain explicit product-owner approval before every later phase.

## Stop conditions

Stop for any new capability, field, enum, permission, auth/session behavior,
contract, API, schema/migration, runtime, polling/offline, printer/device,
transaction, kitchen, or payment change.

## Final delivery and as-built status

As-built documentation status: `PENDING`
