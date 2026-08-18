# POS Order Detail - Data and Interaction Specification

Status: Receipt-printing Phase 5 verified; data/interaction boundary implemented

Visibility: Engineering

## Runtime and trust boundary

`apps/yuta-pos -> apps/site-agent -> packages/db-pos -> local PostgreSQL`.
There is no cloud tenant or authenticated service-time staff session. Staff
cookie selection is attribution, not authorization. Management bearer/PIN does
not apply. Browser code receives no database/device credentials.

## Data ownership and transport

Site-agent alone owns POS persistence, transactions, printers, and devices.
Server-only POS adapters call local HTTP routes and validate
`@yuta/contracts/local-pos`. db-pos owns orders, items, discounts, checks,
payments, local users, and durable print jobs.

## Current domain mapping

| Current field/model/contract          | UI presentation    | Existing transformation                   | Gap                           |
| ------------------------------------- | ------------------ | ----------------------------------------- | ----------------------------- |
| order identity/type/status/timestamps | header and summary | hydrated dates; French labels             | creator unresolved            |
| item snapshots                        | active list        | cancelled excluded; price times quantity  | row count, item status hidden |
| notes/instructions/variants/allergens | item detail/alert  | snapshot labels and severity              | none for current display      |
| subtotal/discount/total               | totals/disclosure  | euro formatting; persisted discount items | none for approved display     |
| checks/payments/paid/remaining        | action eligibility | paid payments filtered                    | most financial detail hidden  |
| order/item timestamps                 | Historique         | earliest dates plus next-step heuristic   | not audit/events              |
| payment mode                          | edit eligibility   | single/no-paid-payment rule               | mode hidden                   |
| selected local user                   | send attribution   | cookie/fallback active staff              | not auth; creator not loaded  |
| printer status/jobs                   | health/send        | site-agent status/job creation            | fixed Cuisine row unsupported |

## Current interactions

- Logo -> `/`; menu Commandes -> `/`, Cuisine -> `/kitchen`, Gestion ->
  `/management`.
- `Ajouter` -> item entry only when editable.
- `Payer` -> payment unless paid/cancelled.
- `Envoyer en cuisine` submits the existing server action; allergies may open
  the existing confirmation dialog.
- `Annuler la commande` posts the existing fixed-reason cancel command when
  unpaid/no paid payment; no confirmation or editable reason exists.
- No search, filter, overflow, customer, print, refund, or history interaction.

## Approved draft interaction refinement

`Remise` becomes a presentation-only disclosure in the renewed design:

- default state is collapsed and shows the service-owned aggregate amount;
- expanded state lists each real `order.discounts` entry with its existing
  service-provided label and amount;
- each entry may also list its persisted applied items from
  `discount.items[].quantityApplied` and snapshot item name, without resolving
  or inferring against the current catalog;
- subtotal and total remain visible and unchanged in both states;
- the trigger is keyboard/touch operable and exposes expanded state
  semantically;
- the detail region is read-only and contains no add/edit/remove/apply action.

No loader, calculation, contract, persistence, or transaction change is
approved. If the current payload cannot provide a truthful label and amount for
an entry, stop for review instead of inventing display data.

## Mutations / actions / transactions

Kitchen send is Zod/contract validated, resolves active staff, uses UUIDv7,
locks/validates the exact pending batch, transitions items, and creates durable
station print jobs in site-agent. Cancel locks the order, rejects paid/
partially-paid cases, cancels active items, voids unpaid checks, and updates the
order. Presentation must not own transitions. Send errors currently redirect to
item entry; cancel errors have no page-local recovery UI.

## Validation

Server Actions parse identifiers with Zod; site-agent parses again and enforces
transactions. The kitchen client manages pending/allergy acknowledgement. This
detail route has no editable form state to preserve. Do not invent cancellation
recovery/confirmation in Phase 0.

## Operational and UI states

Current: populated/item-empty, enabled/disabled, paid/cancelled locks, allergy
alert/dialog, kitchen pending/success/error, and shared health. Generic Next
loading/not-found/error applies because no route-local boundary exists. Design
studies may depict truthful missing/error/conflict/locked/degraded states but
must not claim page-specific recovery already exists.

## Polling / offline / device behavior

Order data is request-loaded and does not poll. Health checks run initially,
every 15 seconds while visible, and on focus/connectivity/visibility events. No
offline mutation queue exists. Site-agent owns durable jobs/hardware; UI must
distinguish command success, queued work, availability, and physical output.

## Loader side effects and performance

`getPaymentViewData` makes payment-summary and catalog requests concurrently,
then order detail. Payment summary may run `optimizeOrder` for open `single`
orders, mutating discounts/totals/`updatedAt`. Catalog/combo rules are not
directly rendered. Optimization/request reduction is deferred to a separately
approved performance/data proposal.

## Decisions that must not be guessed

Cancellation confirmation/reason/recovery; creator identity; real station/
printer assignment; authoritative audit events; narrow action consolidation;
loader mutation/removal; request consolidation; new realtime/offline behavior.

## Implemented persistence/contract boundary

Phase 3 adds narrow transport contracts and order-scoped site-agent routes. It
reuses the existing `print_jobs` persistence unchanged. No field, enum,
permission, schema, migration, audit source, station assignment, or payment
transaction changed.

## Receipt-printing Phase 0 gap map (historical)

| Concern          | Current authority/evidence                                | Missing decision or implementation                        |
| ---------------- | --------------------------------------------------------- | --------------------------------------------------------- |
| job type         | `customer_receipt` enum exists                            | no active creation flow                                   |
| job persistence  | `print_jobs` links order/check/payment and snapshots JSON | receipt payload is not defined/created                    |
| payment response | nullable `printJob` contract                              | financial service returns `null` and tests require no job |
| service route    | management list/test/job-command routes                   | no narrow order-scoped receipt command                    |
| worker           | claims/renders `kitchen_ticket` and `test`                | no receipt schema, claim, renderer, or physical QA        |
| order data       | persisted item/discount/check/payment snapshots           | approved target/content still needs implementation        |
| merchant data    | no local approved receipt profile                         | excluded; neutral non-fiscal heading only                 |
| trust            | service-time staff cookie is attribution                  | service-time local access approved; no role claim         |
| UI status        | shared printer health only                                | no per-order receipt job state or polling contract        |
| reprint          | management command requeues a printed job                 | route flow approved; receipt worker support missing       |

### Implemented domain command boundary

The approved direction uses a dedicated order-scoped command with a UUIDv7
idempotency key and an explicit whole-order or paid-check target. The browser
must not submit totals, receipt lines,
raw payload JSON, printer name, device path, or status. Site-agent re-reads and
validates persisted snapshots, paid state, target ownership, and replay input,
then creates the durable job transactionally.

No generic `POST /print-jobs` browser capability exists. Phase 3 implements the
narrow contract, route, transaction, worker, and status read described here.

### Approved design data dictionary

- stored/snapshotted: order/check/payment identifiers, order number, table/
  reference, order type, item/check allocations, item name/price snapshots,
  discount names/amounts/items, subtotal/discount/total, payment method,
  tendered/change/tip, paid-by snapshot, paid/created timestamps;
- derived by site-agent at job creation: printable lines, formatted monetary
  values, receipt target label, item count, immutable renderer settings;
- transient UI: submitting, action feedback, disclosure/selector state;
- integration-owned: queue status, worker status, device availability,
  physical printed timestamp;
- deliberately unavailable/excluded: merchant legal/VAT identity, tax
  breakdown, fiscal sequence, and cloud establishment data.

For equal-split checks, item allocation may be absent by design; receipt
content cannot be guessed from full-order rows. For item-split checks, the
implementation uses persisted check allocations and check discount snapshots.

### Approved UI command placement

`Imprimer le reçu` is a route-owned secondary action inside the existing
three-line menu. It precedes and is visually separated from the shared
Commandes/Cuisine/Gestion links. It must not become global navigation. On
desktop this maps conceptually to the shared header's secondary-action menu; on
compact layouts it appears once inside the existing combined menu. The additive
`pageMenuActions` API implements this without changing navigation ownership.

### Phase 2 consumer review and shell decision

Every service-time `PosPageShell` consumer was inspected. Most rely on the
default `PosServiceNavigation`; Home alone supplies custom secondary navigation
to omit its self-link. Therefore the order page must not use or replace
`secondaryActions` to add receipt printing. The additive
`pageMenuActions` slot preserves all current consumers and keeps navigation
centralized.

The former native `details` disclosure could not provide reliable controlled
close/focus behavior when a nested page action opens a dialog. Phase 3 extracts
only that disclosure into an application-wide `PosHeaderMenu` Client Component.
`PosHeader` and `PosPageShell` remain server composition. This is the only
shared-shell change.

### Phase 2 serializable presentation model

Proposed UI-only model names are illustrative TypeScript ownership, not a
contract:

```text
ReceiptTargetPresentation
  targetKind: order | check
  targetId: UUID
  label: string
  amountCents: integer
  availability: available | payment_pending | cancelled
  splitMode: single | items | equal
  latestJob: null | ReceiptJobPresentation

ReceiptJobPresentation
  jobId: UUID
  status: pending | printing | printed | failed
  createdAt: ISO datetime
  printedAt: ISO datetime | null
  errorMessage: safe string | null
  printerAvailability: ready | not_configured | disabled | unavailable
```

The server constructs this model from validated local responses. The browser
may select one supplied target ID but cannot supply or alter amounts, receipt
lines, allocations, discounts, payments, printer state, job state, timestamps,
or renderer settings.

For `single`, the presentation exposes one order target only when the order is
fully paid. For split modes, it may show all non-void checks for context but
marks only persisted `paid` checks available. Item-split labels may summarize
persisted check allocations. Equal-split labels contain the check label/amount
only and never reuse full-order item rows.

### Phase 2 command/result boundary implemented in Phase 3

The browser submits only:

```text
operationId: UUIDv7
orderId: UUID
target: { kind: order } | { kind: check, checkId: UUID }
intent: print | retry | reprint
jobId: UUID only for retry/reprint
```

Site-agent must re-read and validate target ownership, fully paid state,
receipt job relationship, intent/state transition, and operation replay before
creating or requeueing an immutable job. `retry` requeues an existing failed
snapshot; `reprint` creates a separately attributable request from the original
printed snapshot. An already pending/printing equivalent request returns its
current job instead of creating an accidental duplicate.

The safe UI result contains the selected target plus job ID/status/timestamps,
safe error text, replay flag, and summarized printer availability. It does not
contain raw JSON payload, ESC/POS bytes, device path, printer routing, legal
merchant data, or hidden queue metadata.

### Phase 2 status read and polling proposal

A narrow order-scoped status read is implemented; the management queue API cannot
be reused because it requires a management bearer and exposes a different
operator scope. The POS server adapter validates the response before passing a
safe model to the client.

Polling is two seconds only while the receipt status surface is open, the page
is visible, and the selected job is `pending` or `printing`. It pauses while
hidden, refreshes once on focus/visibility return, and stops for terminal
states. This is job tracking, not order polling and not an offline mutation
queue. A closed surface may retain the last response locally but makes no
background request.

### Phase 2 error and recovery mapping

| Boundary result                 | UI response                                                      |
| ------------------------------- | ---------------------------------------------------------------- |
| unpaid/invalid/foreign target   | close pending state, explain conflict, offer order refresh       |
| local service unavailable       | preserve selection, no success claim, offer retry                |
| idempotent replay               | show returned existing job and continue tracking                 |
| job `pending`/`printing`        | show queued/printing text; printer warning remains independent   |
| job `failed`                    | show safe failure text and immutable-snapshot retry              |
| job `printed`                   | show printed timestamp and deliberate reprint                    |
| printer unavailable after queue | keep durable queued truth; never downgrade job to client failure |

No optimistic `Imprimé` state exists. The browser never mutates order/payment
state as recovery.

## Phase 4 integration verification

No extension is required. `order_discounts` owns the persisted discount
name/amount snapshot; `order_discount_items` owns the applied quantity and
order-item relationship; the referenced order item owns the historical item
name snapshot. Site-agent returns this relationship through the existing
strict `localOrderDiscountSchema`, and the server-only POS adapter preserves it
without transformation. Presentation uses only those fields.

The approved UI neither resolves current catalog labels nor duplicates combo
matching. Missing `discount.items` detail remains an empty list and causes no
invented description. Loader optimization/request reduction remains deferred.
