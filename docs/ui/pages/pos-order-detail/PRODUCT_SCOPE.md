# POS Order Detail - Product Scope

Status: Receipt-printing Phase 5 completed within approved scope

Visibility: Engineering

## User goal

Let service staff inspect one persisted local order, understand its operational
and payment readiness, continue item entry, send pending items to kitchen, open
payment, or cancel an eligible unpaid order.

Active discovery goal: let an operator explicitly request a truthful customer
document from this view without moving printer/device ownership into the POS
browser or claiming fiscal/physical success that the local system cannot prove.

## Active Phase 0 proposal - receipt printing

Repository evidence classifies the containing route as `EXISTING_PAGE` and the
new flow as `NEW_CAPABILITY_DISCOVERY`. The flow is device-coupled because it
requires a validated site-agent command, durable print-job snapshot, local
worker/ESC-POS rendering, queue state, and physical printer evidence.

Approved first vertical slice:

- explicit `Imprimer le reçu` action rather than automatic payment printing;
- paid non-fiscal receipt only;
- whole paid `single` order and each paid split check;
- authoritative persisted order/check/item/discount/payment snapshots;
- one copy on the existing local TM-m30;
- durable UUIDv7-idempotent queue creation in site-agent;
- truthful queued, printer-unavailable, failed, printed, and reprint states;
- no cloud lookup, browser device access, or fiscal claim.
- page-specific placement in the existing three-line menu, visually separated
  from shared Commandes/Cuisine/Gestion navigation.

This approves Phase 1 design discovery only. No runtime capability or
implementation phase is approved.

## Current approved capabilities

- Display the real label, order number/type/status/time, active items,
  notes/instructions/variants/allergies, and service-owned totals.
- Navigate to item entry and payment when current locks permit.
- Send the exact pending batch with allergy confirmation, active-staff
  attribution, idempotency, transaction locks, and durable print jobs.
- Cancel an unpaid order with no paid payment using the existing fixed reason.
- Show shared local service/database/printer health truthfully.
- Use existing order/item/payment state enums only.

## Current boundaries

This is a single-site local service-time route. Server-only POS adapters call
site-agent; site-agent owns trusted validation, transactions, printers/devices;
db-pos owns local PostgreSQL. Nothing synchronizes to cloud. Selected staff is
attribution, not authentication. Management authorization does not apply.

## Approved change boundary

The approved Phase 1 renewal stays in the existing page, one justified
route-local totals component, focused tests, and this pack. It reuses the shared
POS shell without redefining navigation. Database, API/contract, permission/
auth, runtime/device, and cross-application changes remain excluded.

## Product-owner design decisions

- Present `Remise` as a read-only disclosure when the order has persisted
  discount detail. It is collapsed by default and continues to show only the
  aggregate discount amount.
- When expanded, list only the real entries already returned in
  `order.discounts`, using their service-provided labels and amounts.
- The disclosure does not add, edit, remove, apply, or recalculate a discount.
  Subtotal, aggregate discount, and total remain service-owned.

This decision refines the draft design only. Phase 1 implementation remains
gated by approval of the complete visual direction and product scope.

## Previous visual-renewal out of scope

Customer/CRM or delivery-provider data; reservations/table map; invoice,
receipt, VAT/fiscal or refund flows; new states; new roles/permissions/login;
cloud tenancy/sync; offline mutation queue; unsupported realtime; printer
setup/routing/reprint; new API/contract/schema/migration; presentation-owned
totals or status transitions.

Receipt printing was deliberately excluded from the previous renewal. Opening
this Phase 0 makes it a proposal only; it does not retroactively approve it.

## Approved receipt decisions

- Document: non-fiscal paid `REÇU DE PAIEMENT`; no addition, fiscal invoice, VAT claim, or
  certified cash-register behavior.
- Target: whole paid `single` order and each paid check for split modes.
- Trigger: explicit request from the order detail only; payment remains
  unchanged and never prints automatically.
- Placement: page-specific `Imprimer le reçu` entry inside the existing
  three-line menu, before and separated from shared navigation.
- Access: current service-time local availability. The staff cookie remains
  attribution only and no per-role authorization is claimed.
- Content: persisted local target, item/allocation, discount, total, payment,
  tender/change/tip, paid-by snapshot, and timestamps where authoritative.
- Merchant authority: use the neutral `REÇU DE PAIEMENT` heading and retain the `Document non fiscal` qualifier. Do not
  invent legal identity or read cloud establishment data.
- Copies/settings: one copy on the existing local TM-m30 with immutable safe
  presentation settings captured in the job.
- Reprint: available from the same route flow after a printed snapshot exists;
  it requeues that immutable snapshot rather than rebuilding current data.
- Unavailable printer: durable enqueue remains allowed, with an explicit
  queued/unavailable message and no physical-success claim.

## Phase 2 decisions approved and implemented in Phase 3

- PB2-01: preserve the Server Component route and add no receipt loader or UI
  until the vertical slice can be wired end to end.
- PB2-02: extend the application shell composition with additive
  `pageMenuActions`; do not replace/copy shared navigation.
- PB2-03: isolate controlled menu disclosure behavior in a small POS-wide client
  component while keeping shell/header composition server-owned.
- PB2-04: keep receipt components and pure presentation mapping route-local.
- PB2-05: allow service-time local access without a management session or new
  role claim; site-agent still validates every target and command.
- PB2-06: paid `single` uses one order target; split modes use paid checks only.
- PB2-07: show unpaid non-void checks disabled for context, never printable.
- PB2-08: equal-split display never invents item allocation.
- PB2-09: one stable UUIDv7 protects each deliberate print/retry/reprint request.
- PB2-10: queue acceptance, printer availability, job failure, and physical
  print evidence are distinct state axes.
- PB2-11: poll only the selected non-terminal job while its status UI is visible.
- PB2-12: retry reuses a failed immutable snapshot; reprint starts a deliberate
  new request from a printed immutable snapshot.
- PB2-13: management printing routes/components are not reused in service time.
- PB2-14: no schema, merchant profile, receipt settings, payment coupling,
  cloud lookup, raw browser payload, or offline mutation queue enters the slice.

PB2-01 through PB2-14 and Phase 3 implementation were explicitly approved on
2026-08-18. Phase 3 implements them without expanding into fiscal documents,
merchant data, automatic payment printing, new authorization, or cloud data.

## Receipt non-goals for the recommended first slice

- fiscal/VAT compliance, certified cash-register behavior, legal invoice
  numbering, refunds/credit notes, or tax archive;
- automatic cloud synchronization or reading cloud establishment data;
- browser-supplied raw ESC/POS payloads, printer paths, or routing;
- changing payment totals, combo optimization, checks, payment capture, or
  order status as a side effect of printing;
- treating queue acceptance as proof of physical paper output;
- fixtures presented as an implemented receipt capability.

## Proposed capabilities requiring approval

- Removing loader combo optimization or reducing its three local requests is a
  separate performance/data proposal.
- Cancellation confirmation, reason editing, or recovery redesign requires
  product/behavior approval.
- Resolved creator identity and real station/printer assignment need proven
  data/contract support; otherwise remove the placeholders.
- A true audit history requires an authoritative event source; the current
  heuristic timeline is not one.

## Relationships

Home `/` opens detail. Item entry `/orders/[orderId]/items` returns here or
links onward. Payment is `/orders/[orderId]/payment`; kitchen is `/kitchen`.
New order entry remains `/pos`, with its direct header button Home-only.
Management `/management` and login use separate ownership/shell behavior.
