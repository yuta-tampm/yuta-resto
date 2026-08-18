# POS Order Detail

Status: Receipt-printing Phase 5 completed; physical-printer verification deferred

Visibility: Engineering

Owner: YUTA product and engineering

Protocol revision: 4

Application: `apps/yuta-pos`

Target type: `PAGE`

Route / entry point: `/orders/[orderId]` / `apps/yuta-pos/src/app/orders/[orderId]/page.tsx`

Runtime family: `local POS`

Page classification: `EXISTING_PAGE`

Implementation class: `device-coupled`

Delivery mode: `NEW_CAPABILITY_DISCOVERY`

Package status: `implemented`

Scope status: `APPROVED`

Reference status: `APPROVED`

Inventory status: `COMPLETE`

Baseline status: `CAPTURED`

Design prompt status: `READY`

Shared context status: `RESOLVED`

Receipt-specific Phase 1 design proposals were generated and approved on
2026-08-18. They remain presentation authority only; the current containing-
page and prior renewal references remain runtime evidence.

## Current implementation

The dynamic Server Component loads the real order, items, discounts, checks,
payments, and catalog through `posApi.getPaymentViewData`. It derives action
availability and renders the shared service-time shell, order summary, active
items, service-owned totals, a presentation-derived status history,
information, kitchen send, payment/item navigation, and cancellation.

The containing page and its previous visual renewal remain implemented. The
approved Phase 3 slice now adds an explicit route-owned customer-receipt action,
order-scoped site-agent endpoints, authoritative immutable snapshots, durable
idempotent `customer_receipt` jobs, and local worker rendering. It creates one
non-fiscal paid `REÇU DE PAIEMENT` copy only after a deliberate action; payment capture
still creates no receipt job.

## Authority

Root and app instructions; current state and POS product/operator/offline/QA/
operations docs; `docs/ui/DESIGN_TO_CODE_WORKFLOW.md`,
`docs/ui/DELIVERY_WORKFLOW_MODES.md`, `docs/ui/PAGE_PACK_PROTOCOL.md`,
`docs/ui/YUTA_FRONTEND_RULES.md`, and `docs/ui/POS_FRONTEND_RULES.md`; current
contracts, site-agent services, db-pos schema, tests, shared POS shell, adjacent
service-time routes, this pack, and later approved visual references.

## Phase 0 Implementation Inventory

1. **Target/class:** `apps/yuta-pos`, `/orders/[orderId]`, `PAGE`,
   `EXISTING_PAGE`, `integrated`, `EXISTING_CAPABILITY_RENEWAL`. Persisted data,
   real commands, transactions, and navigation prove an existing mature
   capability.
2. **Route/shell:** `orders/[orderId]/page.tsx` composes shared `PosPageShell`,
   `PosHeader`, `PosConnectivityStatus`, `AllergyAlert`, and
   `SendToKitchenButton`. It is a Server Component with a small kitchen-send/
   allergy client boundary.
3. **Trust/identity:** service-time POS has no authenticated staff session.
   Cookie `yuta_pos_staff_id` selects attribution, not authorization. Kitchen
   send re-resolves an active local user. Management PIN/bearer auth and cloud
   tenancy do not apply.
4. **Ownership:** `apps/yuta-pos -> apps/site-agent -> packages/db-pos -> local
PostgreSQL`. Browser UI owns neither persistence nor transactions; no POS
   data synchronizes to cloud.
5. **Transport/contracts:** server-only `pos-api.ts`/`site-agent-client.ts` use
   `@yuta/contracts/local-pos`. Existing order states are `draft`, `sent`,
   `preparing`, `ready`, `served`, `paid`, `cancelled`; item states add
   `pending`; types are `dine_in`, `takeaway`, `delivery`; payment modes are
   `single`, `split_by_items`, `split_equally`.
6. **Loader:** `getPaymentViewData` requests payment summary and catalog in
   parallel, then order detail. The page does not directly use returned catalog/
   active combo rules. For an editable `single` order, payment summary calls
   `optimizeOrder`, which may replace discounts, recalculate totals, and update
   the order timestamp. Loading is therefore not always side-effect free.
7. **Mapping:** cancelled items are excluded. Article count is active rows, not
   summed quantity. Items show snapshot name/price, quantity, note,
   instructions, variants, allergy, and line total. Totals show subtotal,
   aggregate discount, and total. Discount names, checks, payments, paid and
   remaining values are loaded but not displayed.
8. **Status/history:** French badges map the seven existing order states. The
   history is a UI heuristic from order/item timestamps, not an event/audit log;
   it shows completed steps and one expected next step.
9. **Actions:** `Ajouter` links to `/orders/[orderId]/items` only for unpaid
   `single` orders without a paid payment. `Payer` links to payment unless final.
   `Envoyer en cuisine` requires pending items and a non-final order; site-agent
   owns UUIDv7 idempotency, active-staff validation, allergies, exact-batch
   locks/transitions, and durable station print jobs. Errors redirect to item
   entry. Cancellation is disabled for final/partially-paid orders; otherwise it
   posts a fixed reason with no current confirmation dialog.
10. **Navigation:** logo -> `/`; three-line menu: Commandes -> `/`, Cuisine ->
    `/kitchen`, Gestion -> `/management`. This route does not receive Home's
    direct `Nouvelle commande`; the shared header has no leading back arrow.
11. **Responsive/states:** desktop actions live in the header; narrow also shows
    Send/Pay in the body. Full-screen content scrolls internally. Existing
    states include item empty, disabled actions, allergy dialog, kitchen pending,
    and shared health. There is no route-local loading/error/not-found boundary.
12. **Polling/offline/device:** order data does not poll. The health strip checks
    initially, every 15 seconds while visible, and on focus/connectivity/
    visibility events. There is no offline mutation queue. Site-agent owns print
    jobs/hardware; printer health does not prove physical output.
13. **Tests:** POS client/kitchen action tests protect transport and attribution;
    contracts protect schemas/UUIDv7; site-agent server/financial integration
    tests protect routing, combo optimization, payments, locks, idempotency,
    kitchen send and print jobs; db-pos tests protect constraints. No focused
    rendered detail-page test or focused cancellation integration test was found.
14. **Baseline:** real paid order `POS-20260809-072800-CA8511`, captured
    2026-08-16 at actual 1280x720 and 390x844. Service/database available,
    printer not configured, horizontal overflow zero. Narrow internal scroller:
    716px viewport, 1148px content. Persisted timestamp/totals/items/discount
    remained unchanged after capture.
15. **Safe-state blockers:** current service day, 05:00-05:00 local, had two
    `sent/single` orders and no paid order. Opening them could persist loader
    optimization, so they were not used. No safe current cancelled, allergy,
    empty, draft, ready, served, split, loading/error/degraded baseline existed;
    no fixture or operational mutation was created.
16. **Unsupported presentation:** `Creee par Utilisateur` is placeholder identity,
    not resolved staff/auth. `Imprimante cuisine = Cuisine` is not a real printer
    assignment/health value. Remove or defer them; do not expand them. Do not
    present the heuristic history as audit, or invent overflow/filter/customer/
    printer/refund actions.
17. **Impact/flags:** later scope should stay page-local plus focused tests and
    this pack. Shared-shell work needs separate consumer review. Database `NO`;
    API/contract `NO`; permission/auth `NO`; runtime/device `NO`. Loader mutation
    or request reduction is a separate performance/data proposal.
18. **Exact later verification:** `pnpm ui:pack:check pos-order-detail`,
    `pnpm docs:check`, `pnpm architecture:check`,
    `pnpm -r --if-present typecheck`, `pnpm format:check`,
    `pnpm typecheck:pos`, `pnpm test:pos`, `pnpm build:pos`; if an owned boundary
    is approved to change, also site-agent/db-pos typechecks and tests,
    `pnpm --filter @yuta/contracts typecheck`,
    `pnpm --filter @yuta/contracts test`, and `pnpm test:pos:offline`.
19. **Shared context:** global `@yuta/ui` primitives/tokens; compact service-time
    POS shell; Home, `/pos`, completed item entry, detail, kitchen, and payment
    flow. Management/login remain separate.
20. **Shell mode:** `REUSE_APPROVED_SHARED_SHELL`. Keep the full-width prominent
    header, truthful health strip, full-screen canvas, global three-line menu,
    and existing responsive behavior. Do not create a Backoffice/dashboard shell.

Fixture replacement is forbidden for this existing integrated page.

## Active Phase 0 inventory — customer receipt printing

1. **Target and mode:** the containing target remains `PAGE` and
   `EXISTING_PAGE`; the requested receipt-print flow is new behavior on that
   page. Some print-job scaffolding exists but the end-to-end flow is absent,
   so the initiative uses `NEW_CAPABILITY_DISCOVERY` and is `device-coupled`.
2. **Current product truth:** current Product Spec, User Guide, Offline
   Strategy, QA checklist, service implementation, and tests intentionally say
   that payment creates no `customer_receipt` job. The stale contrary paragraph
   in the POS README was corrected during this read-only documentation phase.
3. **Existing scaffolding:** `customer_receipt` already exists in the local
   print-job enum/contract. `print_jobs` already has nullable `orderId`,
   `checkId`, and `paymentId`, an immutable JSON payload, status, timestamps,
   and a unique idempotency key. This is reuse evidence, not proof that receipt
   printing is implemented.
4. **Missing command:** `createPrintJobInputSchema` exists, but site-agent
   exposes no generic or order-scoped receipt creation route and the POS client
   has no receipt creation method or Server Action. Existing print-job routes
   are management-authenticated list/test/command operations.
5. **Payment behavior:** `localPaymentCaptureResponseSchema` permits a nullable
   print job, but `financial-service.ts` currently returns `printJob: null` and
   integration tests assert that full/check payment creates zero receipt jobs.
6. **Worker gap:** the physical worker claims only pending `kitchen_ticket` and
   `test` jobs. It validates a kitchen payload and renders production tickets;
   it cannot safely claim or render `customer_receipt`.
7. **Queue behavior:** `/management/printing` can list historical receipt rows
   and requeue a printed job, but labels receipts as historical compatibility.
   Requeueing an unsupported receipt would not make the current worker process
   it.
8. **Authoritative data available:** persisted order/check/item/discount/payment
   snapshots can support a non-fiscal receipt: item names, quantities, unit or
   allocated amounts, discount snapshots, subtotal/discount/total, payment
   method, tendered/change, tip, paid-by snapshot, and timestamps.
9. **Authoritative data absent:** db-pos has no approved receipt merchant
   profile for legal name, postal address, SIRET/SIREN, VAT number, tax-rate
   breakdown, fiscal sequence, certification, or retention/legal archive.
   Cloud establishment data cannot be read or synchronized into this local
   flow merely to fill those fields.
10. **Document ambiguity:** `in hóa đơn` must be resolved as one of: an unpaid
    pre-bill (`addition`), a paid non-fiscal customer receipt (`reçu non
fiscal`), or a fiscal/VAT invoice. The recommended first slice is an
    explicit paid non-fiscal receipt; no fiscal claim is approved.
11. **Single/split ambiguity:** product must decide whether the order view
    prints one full-order receipt, one receipt per paid check, or both. Equal
    and item-based checks already retain different authoritative allocations;
    presentation must not reconstruct them in the browser.
12. **Trigger ambiguity:** explicit print after payment is recommended. Automatic
    printing inside payment would change the financial transaction and replay
    contract and therefore requires separate approval.
13. **Trust boundary:** service-time order detail has no authenticated staff
    session. `yuta_pos_staff_id` is attribution only. Product must choose
    service-time local availability or management-only printing; the UI cannot
    truthfully claim per-role authorization without a new trusted boundary.
14. **Proposed service boundary:** if approved, use a narrow order-scoped
    receipt command validated by `@yuta/contracts/local-pos`, not a browser-
    supplied generic raw print payload. Site-agent must validate paid target,
    lock/read authoritative snapshots, create a UUIDv7-idempotent durable job,
    and own all receipt calculations/formatting inputs.
15. **Proposed worker boundary:** add a dedicated receipt payload schema and
    ESC/POS renderer, then explicitly allow `customer_receipt` claims. Keep
    physical device path, queue transition, retry/reprint, failure, cut, and
    worker ownership inside site-agent.
16. **Proposed UI state:** a future action must distinguish available,
    submitting, queued, printer unavailable, failed, printed, and reprint. API
    acceptance means queued, not physically printed. The existing shared health
    strip may report printer state but is not receipt-job status.
17. **Current live blocker:** the read-only status check on 2026-08-18 reported
    printer `not_configured`, worker `disabled`, and 13 pending jobs. Phase 0
    created no job. Physical QA requires a configured Linux/TM-m30 worker and an
    explicitly approved paid QA target.
18. **Persistence impact:** existing `print_jobs` may be sufficient for a
    minimal non-fiscal snapshot. Receipt/merchant settings, fiscal fields,
    numbering, or audit requirements would change this to a schema/migration
    proposal and are not approved.
19. **Baseline:** reuse final containing-page evidence from 2026-08-18 at
    1366x768, 1024x768, 768x1024, and 390x844. It truthfully shows the safe paid
    order with no receipt action and an unconfigured printer. No active order or
    mutation was needed.
20. **Fixture rule:** runtime fixture replacement remains forbidden. A labelled
    static design study may show proposed receipt-action states only after
    product scope is approved; it cannot claim backend/device completion.
21. **Expected verification if implementation is later approved:** page-pack,
    docs, architecture, workspace typecheck/format; contracts, POS, site-agent,
    db-pos, offline tests/typechecks; POS build; worker renderer/failure/retry
    tests; browser responsive/accessibility QA; and real Linux/TM-m30 evidence
    before physical success is claimed.

## Design approval

Product approved the recommended Phase 1 discovery direction on 2026-08-18:

1. a non-fiscal paid `REÇU DE PAIEMENT`, never an unpaid addition or fiscal/VAT invoice;
2. the whole paid order in `single` mode and each paid check for split modes;
3. explicit printing only, never coupled automatically to payment capture;
4. availability from the current service-time order view, without inventing
   role authorization from the attribution-only staff cookie;
5. immutable local order/check/item/discount/payment snapshots only, with no
   invented legal merchant identity, SIRET, VAT, tax breakdown, or cloud lookup;
6. one copy on the existing local TM-m30 using snapshotted current safe print
   presentation settings;
7. truthful submitting, queued, unavailable, failed, printed, and reprint
   states; queue acceptance never means physical output;
8. `Imprimer le reçu` belongs to this route's page-specific section inside the
   existing three-line menu. It appears before and visually separate from the
   shared Commandes/Cuisine/Gestion navigation and is not a global nav item.

For split orders, the menu action may open a route-owned target chooser showing
only paid checks. Equal-split receipts must not invent full-order item
allocations. Reprint reuses the immutable original snapshot. An unavailable or
disabled worker may still accept a durable queued request, but the UI must show
that degraded state explicitly and must not say `Imprimé`.

Phase 0 scope is approved and the receipt-specific design prompt is `READY`.
The user explicitly started Phase 1 design generation and approved its
direction on 2026-08-18, then authorized Phase 2 boundary documentation. Five
responsive/state proposals were produced without changing runtime code or
operational data. PB2-01 through PB2-14 and Phase 3 implementation were then
explicitly approved on 2026-08-18.

## Receipt-printing Phase 1 design result

- `references/receipt-phase-1-desktop-1366x768.png` studies the open menu and
  paid-single confirmation with truthful unconfigured-printer warning.
- `references/receipt-phase-1-tablet-1024x768.png` studies the paid-check
  chooser for split modes.
- `references/receipt-phase-1-tablet-768x1024.png` studies the queued/degraded
  status in portrait tablet layout.
- `references/receipt-phase-1-mobile-390x844.png` studies one compact menu entry
  and a queued-status sheet without body duplication.
- `references/receipt-phase-1-state-board.png` covers unavailable, ready,
  submitting, queued, failed, printed/reprint, paid-check selection, and menu
  anatomy.

The retained tablet and state-board images each received a targeted correction:
the open trigger stays the three-line button, and unsupported refund receipt
content was removed. All images are presentation proposals labelled as not
implemented. The selected visual direction is approved.

## Receipt-printing Phase 2 boundary result

Phase 2 defined the implementation boundary used by Phase 3:

1. add a backward-compatible `pageMenuActions` composition slot to the shared
   service-time shell; never replace or copy its navigation;
2. isolate menu open/close, Escape, outside-click, focus return, and action-
   selection close behavior in a small application-wide client menu component;
3. keep `PosPageShell`, `PosHeader`, and the order route as Server Components;
4. keep receipt presentation/model derivation route-local and pure;
5. isolate chooser, confirmation, request-pending, job tracking, failure, and
   recovery state in one route-local client flow;
6. use a thin validated Server Action and server-only POS adapter; site-agent
   remains the sole paid-target, snapshot, idempotency, queue, renderer, retry,
   reprint, and device authority;
7. render all active split checks for context but enable printing only for
   persisted `paid` checks; never infer equal-split item allocation;
8. poll only the selected receipt job while its status is `pending` or
   `printing`, the status surface is open, and the document is visible;
9. retain the latest terminal status in the UI, stop polling at `printed` or
   `failed`, and distinguish retry from immutable-snapshot reprint;
10. add no new schema, role, management-token dependency, payment coupling,
    cloud lookup, raw browser payload, or global navigation entry.

Exact component responsibilities and serializable models are recorded in
`UI_SPEC.md` and `DATA_AND_INTERACTION_SPEC.md`.

## Receipt-printing Phase 3 implementation result

Phase 3 implements the approved slice without expanding fiscal or authorization
scope:

1. `@yuta/contracts/local-pos` owns explicit target, intent, view, command, and
   job-status schemas;
2. site-agent exposes order-scoped receipt view/command/status routes without a
   management bearer requirement;
3. the service locks the order, validates persisted paid order/check state,
   snapshots items, allocations, discounts, totals, payments, and safe print
   presentation settings, then inserts one idempotent durable print job;
4. retry and reprint create deliberate new jobs from the immutable source
   snapshot; equal split never invents item allocation;
5. the worker claims `customer_receipt`, renders one neutral non-fiscal ticket,
   and retains existing device/write/status ownership;
6. `PosHeaderMenu` owns controlled menu disclosure while `PosHeader`,
   `PosPageShell`, and the route remain Server Components;
7. the route-local client flow opens from the page action, selects paid targets,
   shows degraded printer truth, and polls only its selected pending job while
   visible;
8. `financial-service` remains unchanged and payment capture still returns
   `printJob: null`.

No receipt command was submitted against the operational database and no
physical output was created for Phase 3 QA.

Phase 3 verification passed with 28 contract tests, 62 POS tests, 45 active
site-agent tests, the focused disposable-PostgreSQL financial/receipt
integration test, 14 active db-pos tests, the POS production build, offline POS
acceptance on isolated ports, page-pack/docs/architecture checks, and the full
workspace typecheck. The first manual integration invocation revealed that the
local test environment was shared; its two accidentally claimed pre-existing
kitchen jobs were identified by exact ID/time and restored to `pending` with
`printedAt = null`. The worker integration harness now scopes claims to its test
order, and the rerun passed without touching unrelated jobs.

## Receipt-printing Phase 5 result

Phase 5 was explicitly approved on 2026-08-18. Functional verification passed
for contracts, db-pos, site-agent, POS, the disposable PostgreSQL receipt flow,
the production POS build, offline acceptance, workspace typechecks, page-pack,
documentation, and architecture checks.

Browser QA used only paid order `POS-20260809-072800-CA8511`. The route-owned
menu action and confirmation dialog were verified at 1366x768, 1024x768,
768x1024, and 390x844 with zero document/body horizontal overflow. The dialog
showed the authoritative `Commande complète` target and 35.00 EUR total,
retained the non-fiscal qualification, and truthfully warned that the printer
was not configured. Escape closed the dialog and returned focus to the menu.

No `Imprimer` submission was made. The operational receipt view still reported
`latestJob: null`; no job, order, payment, settings, or device state was
changed. Hardware verification remains deferred because the local environment
has no configured Linux/TM-m30 worker. Production renderer and worker behavior
were instead verified with `pnpm test:receipt-preview` against disposable
PostgreSQL, producing real ESC/POS bytes without using operational data.

Merchant/restaurant identity remains intentionally absent because no approved
local authoritative profile exists. Adding it belongs to a separate governed
Management capability and does not reopen this Phase 5 result.

## References

- `references/phase-0-current-paid-1280x720.png` - real paid desktop baseline.
- `references/phase-0-current-paid-390x844.png` - real paid narrow baseline.
- `references/draft-order-detail-1366x768.png` - generated desktop renewal
  proposal targeting 1366x768.
- `references/draft-order-detail-1024x768.png` - generated tablet renewal
  proposal targeting 1024x768.
- `references/draft-order-detail-390x844.png` - generated narrow renewal
  proposal targeting 390x844.
- `references/draft-order-detail-state-studies.png` - generated state board for
  current order locks, kitchen-send, allergy, empty, and degraded conditions.
- `references/draft-order-detail-1366x768-v2.png` - desktop refinement with the
  `Remise` disclosure collapsed by default.
- `references/draft-order-detail-1024x768-v2.png` - tablet refinement with the
  `Remise` disclosure collapsed by default.
- `references/draft-order-detail-390x844-v2.png` - narrow refinement with the
  `Remise` disclosure collapsed by default.
- `references/draft-order-detail-discount-disclosure.png` - focused closed/open
  interaction study using service-provided discount detail only.
- `references/phase-1-paid-1366x768-collapsed.png` and
  `references/phase-1-paid-1366x768-expanded.png` - production-build desktop
  evidence for the safe paid order.
- `references/phase-1-paid-1024x768-collapsed.png` and
  `references/phase-1-paid-768x1024-collapsed.png` - production-build tablet
  evidence.
- `references/phase-1-paid-390x844-collapsed.png` and
  `references/phase-1-paid-390x844-expanded.png` - production-build narrow
  evidence.
- `references/phase-2-paid-1366x768.png`,
  `references/phase-2-paid-390x844-collapsed.png`, and
  `references/phase-2-paid-390x844-expanded.png` - presentation-parity evidence
  after the route-local component refactor.
- `references/phase-3-paid-1366x768-expanded.png`,
  `references/phase-3-paid-390x844-collapsed.png`, and
  `references/phase-3-paid-390x844-expanded.png` - approved persisted
  discount-item detail evidence.
- `references/visual-correction-paid-1366x768.png`,
  `references/visual-correction-paid-1024x768.png`,
  `references/visual-correction-paid-768x1024.png`,
  `references/visual-correction-paid-390x844.png`, and
  `references/visual-correction-paid-390x844-expanded.png` - corrected
  implementation evidence aligned to the approved responsive `v2` hierarchy.
- `references/phase-5-as-built-paid-1366x768-collapsed.png`,
  `references/phase-5-as-built-paid-1366x768-expanded.png`,
  `references/phase-5-as-built-paid-1024x768-collapsed.png`,
  `references/phase-5-as-built-paid-768x1024-collapsed.png`,
  `references/phase-5-as-built-paid-390x844-collapsed.png`, and
  `references/phase-5-as-built-paid-390x844-expanded.png` - final production
  Phase 5 evidence for the approved summary/action states and discount
  disclosure.

The Phase 0 captures are evidence only. The selected `v2` proposals and
discount study are approved for Phase 1; other generated proposals remain draft
context and authorize no additional behavior.

## Shared UI context

Resolved in `DESIGN_HANDOFF.md`. Reuse the existing shared POS shell and global
navigation. Page content may adapt after approval; shell ownership, routes,
health truthfulness, and management/login separation may not.

## Protected invariants

Local-only persistence; service-owned totals/status transitions; historical
snapshots and soft cancellation; payment/order/item locks; active-staff
attribution; allergy validation; UUIDv7 idempotency; exact pending-batch print
job creation; no cloud sync, offline mutation queue, browser device access, or
presentation-owned state.

## Previous visual-renewal change impact

```text
Files expected to modify: apps/yuta-pos/src/app/orders/[orderId]/page.tsx; stable page pack
Files expected to create: route-local totals component; focused render test; browser evidence
Packages affected: apps/yuta-pos; docs/ui
Cross-application impact: none expected
Database change: NO
API or contract change: NO
Permission/auth change: NO
Runtime/device change: NO
```

## Change impact

```text
Files expected to modify: PROPOSAL - order-detail action/composition; POS product/operator/QA docs; printing-management labels if approved
Files expected to create: PROPOSAL - route-local receipt state/action; POS Server Action; site-agent receipt command/renderer tests
Packages affected: apps/yuta-pos; apps/site-agent; packages/contracts; possibly packages/db-pos; docs
Cross-application impact: none; cloud and Display remain excluded
Database change: NO

The implemented receipt slice reuses existing `print_jobs`. A future merchant
profile would be a separate governed capability with its own impact decision.
API or contract change: PROPOSAL
Permission/auth change: PROPOSAL
Runtime/device change: PROPOSAL
```

## Previous visual-renewal approval history

Phase 0 and design generation were approved on 2026-08-16. The product owner
then requested a read-only `Remise` disclosure, collapsed by default, approved
the resulting `v2` direction, and explicitly started Phase 1. Product scope and
the selected `v2` responsive/disclosure references are approved for this phase.
Phase 1 was approved and Phase 2 was explicitly started on 2026-08-17. Phase 3
was then explicitly approved on 2026-08-17 for persisted discount-item detail.
Phase 4 was explicitly approved on 2026-08-17 and verified that no data
extension is required. Phase 5 was explicitly approved on 2026-08-18 and
completed with final production-browser evidence.

Those approvals do not authorize implementation of the active receipt-printing
initiative. Its Phase 0 scope is approved, while design generation and every
implementation phase remain separately gated.

## Phase 1 delivery evidence

Implementation:

- `apps/yuta-pos/src/app/orders/[orderId]/page.tsx` renews the real page in
  place with an item-dominant responsive layout, truthful summary, derived
  `Suivi opérationnel`, supported information only, and clearer final-state
  controls.
- `apps/yuta-pos/src/app/orders/[orderId]/_components/OrderTotalsPanel.tsx`
  owns the required native, default-collapsed, read-only discount disclosure.
- `apps/yuta-pos/test/order-totals-panel.test.tsx` protects collapsed markup,
  real detail rendering, aggregate totals, and the no-detail fallback.

Behavior preserved: the existing loader, real order/discount payload,
authorization/attribution boundary, action conditions, server actions,
transactions, calculations, locks, idempotency, printing, health polling, and
local-only persistence are unchanged. No fixture or operational mutation was
introduced.

Production-build browser QA used only paid order
`POS-20260809-072800-CA8511`. At 1366x768, 1024x768, 768x1024, and 390x844,
document overflow was 0. The narrow internal scroller measured 716px client
height and 1170px content height. The disclosure was closed on load and opened
read-only to the real `Menu Express` discount; desktop and narrow remained at 0
horizontal overflow. Console errors/warnings were empty. Creator and fixed
kitchen-printer placeholders were absent. Disabled Send/Pay controls used a
neutral surface/text treatment with full opacity.

Visual-correction update: the shared header remains unchanged, while the
approved page-level Send/Pay/Add action row is now present with truthful lock
states. The current heuristic progression remains explicitly non-audit data but
is presented as the approved connected stepper. Native `<details>/<summary>`
continues to provide discount disclosure state without a client boundary.

Verification results:

- `pnpm ui:pack:check pos-order-detail`, `pnpm docs:check`, and
  `pnpm architecture:check` passed.
- `pnpm -r --if-present typecheck`, `pnpm typecheck:pos`, `pnpm test:pos`
  (14 files / 58 tests), and `pnpm build:pos` passed.
- Scoped Prettier and `git diff --check` passed.
- Full `pnpm format:check` remains blocked outside this page scope. The current
  run is dominated by generated files under
  `apps/backoffice/.next-codex-stale-20260817-1/` and also reports existing
  management-printing/order-items pack, UI-pack tooling, and other unrelated
  files. No unrelated file was reformatted.

## Phase 2 delivery evidence

The route remains a Server Component and retains loader invocation, payment
filtering, action-availability derivation, responsive layout composition, and
all runtime ownership. Presentation was split only by stable page-owned
responsibility:

- `_components/OrderSummaryHeader.tsx` owns summary/status presentation and
  responsive action placement.
- `_components/OrderArticlesPanel.tsx` owns the real active-item list and its
  existing item-entry navigation.
- `_components/OrderTotalsPanel.tsx`, `_components/OrderProgressPanel.tsx`, and
  `_components/OrderInfoPanel.tsx` own the three right-rail responsibilities.
- `_components/OrderDetailActions.tsx` keeps current send/payment/cancellation
  adapters together while preserving the existing server actions and the
  already-established kitchen-send client boundary.
- `_lib/order-detail-presentation.ts` owns only serialization-safe page types
  and deterministic labels/progression derivation. It performs no I/O.

No component was promoted to app-wide ownership or `@yuta/ui`; no new client
boundary was added. The native default-collapsed `Remise` disclosure, all
visible Phase 1 output, and every protected loader/action invariant remain
unchanged.

Phase 2 verification passed: scoped Prettier, page-pack validation, docs and
architecture checks, the full recursive workspace typecheck, POS typecheck,
POS tests (14 files / 58 tests), and the POS production build. Browser QA used
only paid order `POS-20260809-072800-CA8511` on the restarted development stack.
At 1366x768 and 390x844, document and body horizontal overflow were 0. The
narrow internal scroller measured 716px client height and 1143px content height.
`Remise` was closed on load and expanded read-only to the persisted
`Menu Express` line at -1.50 EUR with 0 horizontal overflow. No control form was
submitted, no active order was opened, and the temporary viewport override was
reset after QA.

## Phase 3 delivery evidence

The approved `Remise` disclosure now presents each persisted discount as a
compact catalog-style row: snapshot discount name and amount on the first line,
followed by the applied snapshot item quantities/names joined with `+`. The
detail comes directly from existing `discount.items[].quantityApplied` and
`orderItem.itemNameSnapshot` contract fields. A discount with no persisted item
detail keeps the truthful name/amount row without catalog inference.

The disclosure remains native, closed by default, keyboard/touch operable, and
read-only. Aggregate discount, subtotal, total, calculations, loader, combo
matching, persistence, contracts, transactions, and actions are unchanged. No
new client state or runtime boundary was introduced.

Phase 3 browser QA used only paid order `POS-20260809-072800-CA8511`. At
1366x768 and 390x844, the disclosure remained closed on load and document/body
horizontal overflow was 0. Opening it rendered the persisted `Menu Express`
discount at -1.50 EUR with `1 × Bún Thịt Nướng + 1 × Mochi glacé (2 pcs)` and
still 0 overflow. The narrow internal scroller remained 716px high with 1143px
content while collapsed. Click/touch-style activation was verified. The
in-app browser driver could not establish a stable focused native-summary
target for a keyboard press, so keyboard activation was not claimed as runtime
automation evidence; native `<details>/<summary>` semantics and visible focus
styling remain unchanged. No action form was submitted and no active order was
opened for this QA.

Phase 3 verification passed: focused POS tests (14 files / 58 tests), POS
typecheck and production build, scoped Prettier and `git diff --check`,
page-pack/docs/architecture checks, and the full recursive workspace typecheck.
Full repository formatting was not rerun because the known outside-scope
format baseline remains unrelated; no unrelated file was reformatted.

## Phase 4 delivery evidence

No runtime source change was required. The approved presentation already maps
the existing authoritative data path end to end:

1. db-pos persists discount name/amount snapshots in `order_discounts` and the
   exact applied order-item quantities in `order_discount_items`.
2. Site-agent joins each applied row to the persisted
   `order_items.item_name_snapshot` and returns it with order detail.
3. `@yuta/contracts/local-pos` already validates
   `discount.items[].quantityApplied` plus the order-item id/name snapshot.
4. The server-only POS adapter passes those validated discount rows through;
   the route presents them without catalog lookup or recalculation.

A read-only request to the safe paid order returned `Menu Express`, -1.50 EUR,
`1 × Bún Thịt Nướng`, and `1 × Mochi glacé (2 pcs)`, matching Phase 3 browser
evidence. Database, API/contract, auth, transaction, runtime/device, and cloud
impact remain `NO`. The existing payment-summary optimization side effect and
unused catalog request are still deferred; Phase 4 does not authorize changing
the loader request shape.

Phase 4 verification passed: page-pack, documentation, architecture, scoped
format/diff checks, contracts tests (2 files / 26 tests), core combo tests (1
file / 2 tests), and POS tests (14 files / 58 tests). Site-agent/db-pos
integration mutation suites were not rerun because no boundary implementation
changed; the live order-detail verification was intentionally read-only.

## Approved visual-correction delivery

After reviewing the Phase 3 implementation against the approved responsive
`v2` references, the product owner identified substantial visual drift and
approved a correction pass on 2026-08-17 before Phase 5. The correction changes
presentation only:

- desktop summary now uses the approved identity/status block plus four
  separated operational metrics;
- narrow summary shows the identity icon, three compact metrics, and a truthful
  final-state actions-disabled banner;
- Send, Pay, and Add are visible as the approved three-action row with current
  conditions and disabled locks; the existing shared-header actions remain;
- article rows use clear separators and the supported snapshot hierarchy;
- operational progression is a connected horizontal stepper while remaining a
  timestamp heuristic rather than an audit log;
- totals, information, absent-note dash, destructive cancellation separation,
  and desktop right-rail/mobile stacking follow the approved hierarchy;
- route-local CSS Modules own the responsive grids and component-specific
  presentation so dynamic-route Tailwind source scanning cannot drop critical
  layout rules.

Safe paid-order browser QA at 1366x768, 1024x768, 768x1024, and 390x844 found
0 document/body horizontal overflow. The contained scroller measured 662px /
779px at desktop, 662px / 795px at 1024x768, 918px / 1256px at 768x1024, and
716px / 1332px at narrow. `Remise` remained closed on load; narrow expansion
showed the real `Menu Express` composition with 0 overflow. The temporary
viewport override was reset. No form was submitted and only the safe paid order
was used for this QA.

The correction adds no field, calculation, action condition, mutation,
contract, database, auth, runtime, device, or client-state change. The real
table label `d` is retained even where generated references depicted `d4`.

## Prompt order

1. `prompts/00_REPOSITORY_ANALYSIS.md`
2. `prompts/01_VISUAL_BASELINE.md`
3. `prompts/02_COMPONENT_REFACTOR.md`
4. `prompts/03_INTERACTIONS.md`
5. `prompts/04_DATA_INTEGRATION.md`
6. `prompts/05_VISUAL_QA.md`

## Stop conditions

Stop for any new field, enum, permission/session, contract/API, schema/migration,
route, cancellation semantics, offline/realtime behavior, printer/device control,
or change to totals, locks, idempotency, kitchen batching, or loader persistence.

## Final delivery and as-built status

Final implementation locations/files changed:

- `apps/yuta-pos/src/app/orders/[orderId]/page.tsx` retains loader/action
  eligibility and composes the final responsive page.
- `apps/yuta-pos/src/app/orders/[orderId]/_components/` owns page-local summary,
  action, articles, totals, progression, and supported information presentation.
- `apps/yuta-pos/src/app/orders/[orderId]/_lib/` owns deterministic labels and
  progression derivation only.
- `apps/yuta-pos/test/order-totals-panel.test.tsx` protects the default-collapsed
  real discount disclosure.
- This page pack and its Phase 5 screenshots record final authority/evidence.

Verification commands and results: POS typecheck, 58 POS tests, POS production
build, page-pack validation, documentation consistency, architecture boundaries,
scoped Prettier, and `git diff --check` passed. Full repository format remains
blocked by the unrelated generated Backoffice build and other pre-existing
outside-scope files recorded above.

Functional/regression QA result: existing loader, action eligibility, native
discount disclosure, service-owned totals, locks, idempotency, kitchen batching,
health polling, and local-only runtime ownership remain unchanged. No action was
submitted and no active order was opened.

Visual/browser/device evidence: final production QA on safe paid order
`POS-20260809-072800-CA8511` at 1366x768, 1024x768, 768x1024, and 390x844 had
zero document/body horizontal overflow and no console warning/error. The 768px
summary breakpoint was corrected during QA so all four facts remain readable.
Controls measured 48px on desktop/tablet and 64px on narrow. `Remise` was closed
by default and expanded read-only to the persisted `Menu Express` composition.
The local service/database were available and the printer remained unconfigured.

Intentional deviations: unavailable non-paid, error, allergy, and active-order
states were not fabricated. The native summary was focusable, but the in-app
driver still did not toggle it through synthetic Enter; click/touch expansion,
native semantics, focus styling, and rendered content were verified.

Deferred proposals and risks: payment-summary loader mutation/request redundancy;
missing focused cancellation integration coverage; safe non-paid/error/allergy
browser states were unavailable without operational mutation.

As-built documentation status: `COMPLETE`; package status is `implemented`.
