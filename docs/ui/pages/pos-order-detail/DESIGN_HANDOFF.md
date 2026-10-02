# POS Order Detail - Design Handoff

Status: Receipt-printing Phase 5 completed; physical-printer verification deferred

Visibility: Engineering

## Active receipt-printing Phase 0 handoff

Inventory status: `COMPLETE`

Baseline status: `CAPTURED`

Shared context status: `RESOLVED`

Design prompt status: `READY`

Delivery mode: `NEW_CAPABILITY_DISCOVERY`

The containing route remains an implemented `EXISTING_PAGE`; receipt printing
is the newly implemented device-coupled Phase 3 flow. The final prior Phase 5
paid-order screenshots remain the pre-receipt containing-page baseline. New
browser and device evidence is not claimed before separate Phase 5 approval.

Shell mode remains exactly `REUSE_APPROVED_SHARED_SHELL`. The receipt proposal
may adapt only page-owned action/content regions. `Imprimer le reçu` belongs in
the page-specific section of the existing three-line menu, before and visually
separate from Commandes/Cuisine/Gestion. It is not global navigation. The
proposal cannot otherwise change the shared header, health strip, shared
routes, management/login shell, device configuration, or Home-only navigation.

### Receipt design context matrix

| Layer              | Owner/source                                                      | Status                         | Reuse exactly                                         | May adapt after approval        | Excluded                               |
| ------------------ | ----------------------------------------------------------------- | ------------------------------ | ----------------------------------------------------- | ------------------------------- | -------------------------------------- |
| YUTA global        | `@yuta/ui`, semantic tokens, shared frontend rules                | APPROVED                       | primitives, focus, status semantics, Lucide           | page composition                | raw colors/frameworks                  |
| POS application    | POS rules, `PosPageShell`, health polling                         | APPROVED                       | full-width shell, navigation, truthful printer health | route-owned action placement    | browser device access, new shell       |
| Printing flow      | site-agent queue/worker, db-pos `print_jobs`, management printing | IMPLEMENTED for approved slice | durable jobs, snapshots, transitions, local ownership | receipt command/renderer        | generic raw payload, cloud sync        |
| Order/payment flow | persisted order/check/payment snapshots                           | APPROVED for current behavior  | paid/check/payment invariants                         | approved receipt target/content | payment mutation or recalculation      |
| Receipt capability | explicit paid non-fiscal route flow                               | IMPLEMENTED                    | paid targets, immutable jobs, truthful states         | Phase 5 evidence only           | fiscal claim or invented merchant data |

### Curated receipt design-tool bundle

Supply only:

1. final Phase 5 containing-page screenshots at 1366x768, 1024x768,
   768x1024, and 390x844;
2. current page action components and shared POS shell/health references;
3. current payment/check data mapping and printing queue/worker truth;
4. the approved receipt target, content, access, trigger, menu placement,
   copies, and status model;
5. the POS viewport/touch/accessibility profile and explicit exclusions.

Do not use fixtures to imply that a receipt job exists. A labelled design study
may contain hypothetical state copy only after the product owner approves the
domain boundary.

### Approved product direction

- non-fiscal paid `REÇU DE PAIEMENT` only;
- whole paid `single` order and each paid check for split modes;
- explicit service-time action, never payment-triggered;
- route-owned placement inside the existing three-line menu, before and
  separated from shared navigation;
- immutable local order/check/item/discount/payment snapshots only;
- neutral non-fiscal heading; no invented merchant legal/VAT identity;
- one copy on the current local TM-m30 using snapshotted safe settings;
- truthful submitting, queued, unavailable, failed, printed, and immutable-
  snapshot reprint states.

### Ready-to-use receipt design prompt

```text
Use case: ui-mockup.
Asset: high-fidelity interaction design study for adding explicit customer-receipt printing to the existing integrated local restaurant POS route `/orders/[orderId]`.
Output is DRAFT design only, not implementation code and not evidence that printing works.

Reuse the current Phase 5 paid-order screenshots at 1366x768, 1024x768, 768x1024, and 390x844 as containing-page evidence. Keep `REUSE_APPROVED_SHARED_SHELL`: full-width prominent POS header, logo -> `/`, truthful service/database/printer health strip, contained page scrolling, and current Send/Pay/Add/cancel regions. Do not introduce a back arrow, sidebar, bottom navigation, account UI, management shell, or Backoffice shell.

Add one route-owned `Imprimer le reçu` entry inside the existing three-line menu. Place it before and visually separate from the shared Commandes `/`, Cuisine `/kitchen`, and Gestion `/management` links. It is an action on the displayed order, not navigation and not a global POS menu item. Keep Send, Pay, and Add in their current primary action regions. On compact layouts, show the receipt entry only once inside the existing combined menu; do not duplicate it in the body.

Approved document: non-fiscal paid `REÇU DE PAIEMENT` only. For `single` mode, target the whole paid order. For `split_by_items` and `split_equally`, target each paid check; a route-owned chooser may list only paid checks with a clear label, paid amount, and status. Never offer an unpaid target. Equal-split receipts must not invent full-order item allocation; item-split receipts use only persisted check allocations.

Approved trigger/access: explicit request from the service-time order view only. Never auto-print during payment capture. The service-time staff cookie is attribution, not authorization; do not invent roles, permissions, login, or management bearer behavior.

Approved content authority: immutable local order/check/item/discount/payment snapshots, including identifiers/labels, authoritative item or check allocation, snapshot prices, discount names/amounts, subtotal/discount/total, payment method, tendered/change/tip, paid-by snapshot, and timestamps only when present for the target. Use a neutral `REÇU DE PAIEMENT` heading and retain `Document non fiscal`. Do not invent restaurant legal name/address, SIRET/SIREN, VAT number/rates, tax breakdown, fiscal sequence, invoice number, certification, customer identity, or cloud establishment data.

Approved print behavior: one copy on the existing local TM-m30 with immutable safe print presentation settings captured in the job. The browser never supplies raw receipt lines, ESC/POS bytes, device path, printer route, totals, or job status. No printer configuration/settings UI belongs in this design.

Design text-backed states: unavailable before the target is fully paid; available `Imprimer le reçu`; confirmation or target selection; submitting with replay protection; `Ajouté à la file d’impression`; queued while printer is not configured or worker disabled; failed with a truthful recovery path; `Imprimé` only after worker/job evidence; and `Réimprimer le reçu` using the immutable original snapshot. Durable queue acceptance is not physical output. Printer health is not receipt-job status. If the printer is unavailable, enqueue may still succeed but the degraded warning must remain explicit.

Study the menu closed/open states and the smallest route-owned status/chooser surface needed after selecting the menu action. Design at 1366x768, 1024x768, 768x1024, and 390x844 with no horizontal overflow, no clipped menu, at least 44px touch targets, keyboard operation, visible focus, semantic menu/dialog controls, managed focus, and color-independent state meaning. Use concise French operational copy, `@yuta/ui` semantics, current typography/tokens, and Lucide icons.

Protected runtime boundary: `apps/yuta-pos -> apps/site-agent -> packages/db-pos -> local PostgreSQL`; site-agent owns validation, paid-target locking/read, UUIDv7 idempotency, immutable job creation, renderer, queue, retry/reprint, device write, and physical status. No cloud sync, browser database/device access, offline mutation queue, payment/order recalculation, new schema claim, new role model, generic raw print API, fixture, or active-order mutation.

Deliver a focused annotated state board plus desktop/tablet/narrow compositions showing the closed/open three-line menu and the route-owned receipt flow. Clearly label hypothetical states and do not claim runtime/device completion.
```

### Phase 1 generation result

The user explicitly started and approved Phase 1 on 2026-08-18. Built-in
ImageGen produced five workspace-bound `APPROVED` presentation references:

- `references/receipt-phase-1-desktop-1366x768.png` - open three-line menu and
  paid-single queue confirmation;
- `references/receipt-phase-1-tablet-1024x768.png` - split paid-check chooser;
- `references/receipt-phase-1-tablet-768x1024.png` - portrait queued/degraded
  status;
- `references/receipt-phase-1-mobile-390x844.png` - compact open menu and queued
  status sheet;
- `references/receipt-phase-1-state-board.png` - seven receipt states and menu
  action/navigation anatomy.

Targeted edit passes restored the three-line trigger on tablet proposals and
removed an unsupported refund-receipt row from the state board. No runtime,
contract, API, worker, printer, order, payment, check, or print-job data changed.

The user then authorized Phase 2 component/interaction boundary documentation,
approved PB2-01 through PB2-14, and separately started Phase 3 on 2026-08-18.
The approved shell composition, route-local ownership, target selection,
command/result model, polling, and recovery boundary are implemented. The
presentation references still do not prove browser parity or physical output;
those remain Phase 5 evidence.

## Previous visual-renewal handoff

## Phase 0 source

The complete inventory is in `README.md`. This is an existing integrated local
POS page using `EXISTING_CAPABILITY_RENEWAL`; fixtures and changes to real
transactions/data ownership are forbidden.

## Shared UI context resolution

Previous renewal shared context status: `RESOLVED`

| Layer           | Owner/source                                  | Reference status | Reuse exactly                                              | May adapt                  | Excluded                          | Decision/blocker |
| --------------- | --------------------------------------------- | ---------------- | ---------------------------------------------------------- | -------------------------- | --------------------------------- | ---------------- |
| YUTA global     | `@yuta/ui`, tokens, global rules              | APPROVED         | primitives, semantic states, focus, Lucide                 | route composition/density  | raw colors, new framework         | none             |
| POS application | POS rules, shared shell/header/health         | APPROVED         | full-width prominent header, compact menu, truthful health | existing responsive slots  | Backoffice/management/login shell | none             |
| Order flow      | Home, `/pos`, items, detail, payment, kitchen | APPROVED         | real routes/status/action vocabulary                       | page-local grouping        | new routes/capabilities           | none             |
| Target          | current route and Phase 0 evidence            | APPROVED         | loaders/actions/data hierarchy                             | approved Phase 1 hierarchy | fixtures/invented data/actions    | none             |

Shell mode: `REUSE_APPROVED_SHARED_SHELL`.

Keep the full-width shared header, logo/home link, connectivity strip, and
three-line menu with Commandes `/`, Cuisine `/kitchen`, Gestion `/management`.
Do not add a leading back arrow or Home-only direct `Nouvelle commande` action.
There is no account area, service-time login, sidebar, or bottom navigation.
Management/login shells are excluded.

Curated bundle:

1. `phase-0-current-paid-1280x720.png` and
   `phase-0-current-paid-390x844.png` as current evidence.
2. Current route, shared shell/header/health, allergy, and kitchen-send files.
3. Completed Home, `/pos`, and item-entry page packs as shared flow context.
4. Current detail, payment, kitchen, and management implementations for route
   boundaries only.
5. This pack's scope/data specifications and POS viewport matrix.

## Current baseline capture

Previous renewal baseline status: `CAPTURED`

- Files: `phase-0-current-paid-1280x720.png`,
  `phase-0-current-paid-390x844.png`.
- Route/state: `/orders/019fe56b-e32d-7266-b37a-d4db4aca8511`, real persisted
  paid/single order `POS-20260809-072800-CA8511`; subtotal EUR36.50, aggregate
  discount EUR1.50, total EUR35.00, six active item rows, no pending item,
  allergy, or note.
- Date/runtime: 2026-08-16 Europe/Paris on `http://127.0.0.1:3003`, current
  site-agent/local PostgreSQL; service/database available, printer not
  configured, Internet state unknown.
- Session: no authenticated service-time staff session and no management bearer.
- Geometry: actual viewports 1280x720 and 390x844; document horizontal overflow
  zero. Narrow route uses an internal 716px-high scroller with 1148px content.
- Safety: no action was clicked. Because the order is paid, payment summary
  skipped combo optimization. A post-capture detail read confirmed unchanged
  `updatedAt`, totals, items, and discount count.
- Blocked states: current service day contained two open `sent/single` orders;
  opening them could trigger persisted optimization. No safe current-day paid,
  cancelled, allergy, empty, draft, ready, served, split, loader-error, or
  degraded detail state existed. No data was created/edited/sent/cancelled/
  paid/printed for evidence.

## Design-generation prompt

Previous renewal design prompt status: `READY`

### Ready-to-use prompt

```text
Use case: ui-mockup.
Asset: high-fidelity UI renewal proposal for the existing integrated local restaurant POS route `/orders/[orderId]`.
Goal: help French-speaking service staff scan a real order, understand operational/payment readiness, add items when eligible, send the exact pending batch to kitchen, open payment, or cancel an eligible unpaid order.
Baseline inputs: `phase-0-current-paid-1280x720.png` and `phase-0-current-paid-390x844.png` are real paid-order evidence, not edit targets or behavior authority.

Shell mode: `REUSE_APPROVED_SHARED_SHELL`. Keep the full-width prominent shared POS header, logo -> `/`, truthful local-service/database/printer strip, and three-line menu: Commandes -> `/`, Cuisine -> `/kitchen`, Gestion -> `/management`. Below `lg`, retain compact shared-header behavior. Do not add a leading back arrow, sidebar, bottom navigation, account/session UI, or the Home-only direct `Nouvelle commande` button. Do not use the Backoffice or management shell.

Real data only: order id/number, table or reference label, type (`dine_in`, `takeaway`, `delivery`), order status (`draft`, `sent`, `preparing`, `ready`, `served`, `paid`, `cancelled`), payment mode (`single`, `split_by_items`, `split_equally`), timestamps, order note/allergy; active item rows with quantity, snapshot name/unit price, note, quick instructions, selected variants, structured allergy and item timestamps/status; order discounts; checks/payments used for locks; service-owned subtotal/discount/total.

Real actions and conditions: `Ajouter` -> `/orders/<id>/items` only for non-final `single` orders with no paid payment; `Payer` -> `/orders/<id>/payment` unless paid/cancelled; `Envoyer en cuisine` only with pending items on a non-final order, using current allergy confirmation, active-staff attribution, UUIDv7 idempotency, locks, exact pending batch, status transitions and durable print-job creation owned by site-agent; `Annuler la commande` only when not paid/cancelled and no payment is paid, using the current fixed reason. Do not invent a cancel confirmation/reason editor without separate approval. Kitchen-send failure currently recovers on the item-entry route.

Content hierarchy: shared shell and health; order identity/status/time/type/allergy; primary kitchen-send/payment actions; conditional item-entry action; compact active item list; service-owned subtotal/aggregate discount/total; an operational progression explicitly understood as presentation-derived rather than an audit log; supported type/table/note information; separated destructive cancellation.

Approved totals refinement: present `Remise` as a read-only disclosure. It is collapsed by default and still shows the service-owned aggregate discount. When expanded, show one read-only row per real `order.discounts` entry using only its service-provided label and amount. Keep subtotal and total unchanged. Provide keyboard/touch operation, semantic expanded state, a clear chevron, and at least a 44px trigger. Do not add discount apply/edit/remove/catalog-management controls or presentation-owned calculations.

Responsive outputs: one 1366x768 desktop proposal, one 1024x768 tablet study, and one 390x844 narrow proposal. Keep the full-screen operational canvas, contained vertical scrolling, zero document horizontal overflow, readable dense item/totals content, no clipped control, no essential hover-only behavior, and at least 44px service-critical touch targets. Study the current narrow duplication of Send/Pay between header menu and body, but do not remove reachability or change action conditions without approval.

Required truthful state studies: populated draft/sent/preparing/ready/served; paid; cancelled; no active items; allergy attention/confirmation; send pending/success/conflict/failure; partially-paid or split locked edit; loader/not-found/site-agent/database failure using existing generic capability truthfully; local service available while printer is unconfigured; offline/degraded health without an offline mutation queue. Distinguish order command success, durable print-job creation, printer availability, and physical print output.

Protected invariants: `apps/yuta-pos -> apps/site-agent -> packages/db-pos -> local PostgreSQL`; browser owns no persistence/transactions/devices; no cloud tenancy/sync; no authenticated service-time staff session; staff selection is attribution, not authorization; management PIN/bearer does not apply; service-owned totals/combo/payment calculations, locks, validation and status transitions; historical item snapshots and soft cancellation; UUIDv7 kitchen idempotency; exact pending-batch print jobs; existing health polling cadence; no offline mutation queue. Loading an open single order can currently run service-owned combo optimization; do not redesign data access in this visual proposal.

Visual/accessibility constraints: French operational copy, current POS typography, `@yuta/ui`, semantic tokens, Lucide icons, restrained high-contrast density, visible focus, semantic controls, keyboard/touch operation, managed dialog focus, text-backed statuses, clear disabled/pending/error states. Do not copy raw colors or add a UI/state/data framework.

Remove or defer unsupported placeholders: `Creee par Utilisateur` is not resolved creator identity or authorization; `Imprimante cuisine = Cuisine` is not real printer assignment/health. Do not upgrade the heuristic history into an audit trail.

Explicit exclusions: invented filter panel or overflow actions; customer profile/CRM/loyalty; delivery-provider integrations; table-map/reservation data; fiscal/VAT/invoice/receipt/refund features; new order/item/payment/kitchen states; new roles/permissions/staff login; cloud sync/tenancy; offline mutation queue; unsupported realtime; printer setup/routing/reprint controls; new API/contract/schema/migration; presentation-owned totals, discount/combo logic or status transitions; invented creator/station/device/audit data; new routes or navigation.

Output: DRAFT design proposals, not implementation code. Annotate hierarchy, responsive behavior, action availability, scroll containment, and state truthfulness. Review for shared-shell fidelity, current route/action/data fidelity, touch speed, accessibility, no invented capability, and clear distinction between operational facts and placeholder/derived presentation.
```

## Handoff result

Product-owner approval to run design generation was received on 2026-08-16.
ImageGen produced three responsive draft proposals and one state-study board
from the ready prompt and the two Phase 0 baselines:

- `references/draft-order-detail-1366x768.png` - desktop target, generated at
  1672x941.
- `references/draft-order-detail-1024x768.png` - tablet target, generated at
  1448x1086.
- `references/draft-order-detail-390x844.png` - narrow target, generated at
  852x1846.
- `references/draft-order-detail-state-studies.png` - eight-panel study of
  current order, action-lock, kitchen-send, allergy, empty, and degraded states,
  generated at 1672x941.

The generated dimensions preserve the target viewport aspect ratios but are
not browser captures. The desktop proposal received two factual correction
passes: an invented allergy card was removed, and header/body kitchen-send and
payment controls were made visibly locked for the real paid-order study. The
creator and kitchen-printer placeholders are absent from all three proposals.

On 2026-08-16 the product owner refined the totals interaction: `Remise` is a
read-only disclosure, collapsed by default with the aggregate amount visible,
and expanded to show only service-provided `order.discounts` entries. ImageGen
produced non-destructive `v2` responsive proposals and a focused interaction
study:

- `references/draft-order-detail-1366x768-v2.png` - 1672x941.
- `references/draft-order-detail-1024x768-v2.png` - 1448x1086.
- `references/draft-order-detail-390x844-v2.png` - 852x1846.
- `references/draft-order-detail-discount-disclosure.png` - 1672x941 closed/
  open study with semantic and touch guidance.

The first interaction-board generation invented promotional names and was not
saved to the page pack. The retained board uses structural labels rather than
claiming unknown runtime detail values.

The product owner approved the `v2` responsive direction, read-only discount
study, product scope, and Phase 1 implementation. Selected reference status is
`APPROVED`; superseded proposals and the broader state board remain draft
context only. Phase 1 is implemented with production-build evidence. Phase 2
has not started.
