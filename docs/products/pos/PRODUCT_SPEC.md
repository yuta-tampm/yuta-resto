# YUTA POS Product Specification

Status: Current Product Intent

Owner: YUTA product and engineering

Document role: Current broader Product Intent and product rationale

Visibility: Engineering and restaurant-local operations

Last updated: 2026-08-28

## 1. Purpose and authority

This document owns the broader Product Intent for YUTA POS:

- product rationale and restaurant-local operating goals;
- operator experience principles;
- durable business invariants;
- product-specific non-goals; and
- future and unresolved design space that remains separately reviewable.

It does not own current runtime or database ownership, executable schemas,
exact APIs or routes, service signatures, package structure, realtime or
authentication implementation, printer adapters, deployment, hardware/site
readiness, or Production Readiness. Those questions must be resolved through
the current authorities in [Technical authority routing](#14-technical-authority-routing).

Current repository implementation is evidence of Implemented State. It does
not prove which version, migration, configuration, printer, device, or site is
currently deployed or ready in production.

## 2. Product position

YUTA POS is a restaurant-local operational product for taking orders,
coordinating kitchen work, recording operational payments, producing
non-fiscal tickets, and supporting bounded local management and reporting.

It is designed for fast, repeated use by restaurant operators on local devices.
Its critical operational path must not depend on public Internet or cloud
availability while the restaurant's local infrastructure remains healthy.

YUTA POS is a first-class maintained YUTA product. Its local ordering,
payments, kitchen, printing, user, catalog, and reporting capabilities must not
be presented as public YUTA cloud-service capabilities.

## 3. Product boundaries

### 3.1 In scope

The broader POS intent covers:

- fast touch-oriented order creation and item entry;
- an explicit order and order-item lifecycle;
- durable historical snapshots of operational facts;
- kitchen production and correction workflows;
- combo recognition as a commercial discount rule;
- full and split-payment outcomes;
- durable, observable, retryable non-fiscal printing;
- bounded local catalog, combo, establishment, printing, and user management;
- restaurant-local operational reports; and
- degraded operation and recovery within the accepted local runtime boundary.

### 3.2 Product-specific non-goals

This Product Spec does not approve or claim:

- certified cash-register compliance or fiscal receipt issuance;
- VAT, accounting, or legal cash-register certification;
- cloud persistence or synchronization of POS operational data;
- browser ownership of database, transaction, printing, or device access;
- browser-only emergency operation after loss of the local server;
- public cloud exposure of restaurant-local operational capabilities;
- automatic identity synchronization between cloud users and local POS users;
- automatic synchronization between the cloud Establishment profile and the
  local POS establishment record;
- remote management, cloud analytics/export, or multi-site aggregation;
- a complete Rooms/Tables or floor-plan management capability; or
- support/readiness claims for every printer, payment device, restaurant, or
  deployment environment.

Any future capability in these areas requires its own accepted scope and the
applicable architecture, security, data, compliance, operations, and readiness
work.

## 4. Operator experience goals

The POS experience should optimize for real restaurant operations:

- fast entry with minimal navigation and avoidable confirmation steps;
- large, touch-friendly targets and clear current-order context;
- one-tap addition for plain items when no required choice exists;
- immediate required-option selection when an item requires a variant;
- allergy capture kept distinct from commercial option selection;
- clear success, error, conflict, degraded, and recovery feedback;
- predictable behavior under repeated actions or temporary local failures;
- French operator-facing language unless a later approved localization scope
  says otherwise; and
- accessible names, keyboard behavior, and visible focus where applicable.

Exact pages, layouts, components, and current interaction details belong to the
POS page packs and current application rather than this document.

## 5. Core operational journey

The durable product journey is:

1. An operator opens an order and identifies its restaurant context using the
   bounded order-entry model.
2. The operator adds menu items quickly, including required options and any
   operator notes or allergy information.
3. Production items are sent to the kitchen in explicit batches.
4. Kitchen operators see and advance production work, with bounded correction
   and recovery behavior.
5. The commercial total is calculated from durable item facts and applicable
   combo discounts.
6. The operator records a full payment or an approved split-payment outcome.
7. The order closes only when its required operational and payment invariants
   are satisfied.
8. Non-fiscal print work is created from committed state and can be observed and
   retried independently of the transaction that produced it.

The bounded current flow may use a free-form table or service label. That does
not approve a broader Rooms/Tables, floor-plan, reservation, or seating model.

## 6. Durable business invariants

### 6.1 Explicit lifecycle

Orders and order items must have explicit, reviewable lifecycle transitions.
Transitions must not be inferred solely from which screen is visible, and
repeated commands must not silently create duplicate durable effects.

The exact current statuses, transition guards, request schemas, and error
responses are executable implementation details owned by current contracts,
schema, services, and tests.

### 6.2 Historical accuracy

Operational history must remain understandable after catalog or configuration
changes. Orders, items, discounts, checks, payments, kitchen batches, and print
work must preserve the facts needed to explain what happened at the time.

Where a mutable catalog or rule contributes to an order, the committed order
must retain the relevant historical label, price, tax-independent commercial
amount, option, and discount facts rather than depending only on today's
catalog state.

### 6.3 No silent hard deletion

Committed operational history must not be silently hard-deleted. Cancellation,
voiding, correction, reversal, or supersession must be explicit and auditable
within the owning workflow.

This principle does not define exact retention law, fiscal compliance, or a
universal deletion policy for every technical record. Those questions require
their applicable approved scope.

## 7. Kitchen product semantics

The kitchen works from production items and preparation context, not from
commercial combo names or discount lines.

Durable kitchen intent includes:

- only eligible production work is sent;
- each send produces an identifiable batch or equivalent durable boundary;
- repeated sends do not duplicate the same committed production effect;
- preparation progress and completion are explicit;
- corrections are deliberate and preserve operational history;
- temporary realtime loss has a recovery path to committed local state; and
- audio or visual attention cues assist the operator but are not the source of
  truth for kitchen state.

Exact queues, status values, realtime transport, polling fallback, chime
behavior, routes, and screen layout belong to current Product Knowledge, page
packs, contracts, code, and tests.

## 8. Combo product semantics

A combo is a deterministic commercial rule applied to eligible order items. It
does not become a synthetic kitchen product and must not hide the actual items
that need preparation.

Combo behavior should:

- use committed item facts and eligible rule configuration;
- produce explainable discount results;
- avoid assigning one item to incompatible overlapping benefits;
- preserve which items and rule produced a committed discount;
- remain stable for historical orders after later rule changes; and
- keep operator suggestions distinct from the final committed calculation.

Exact algorithms, data models, service functions, and management screens are
owned by current implementation sources.

## 9. Payments and splits

YUTA POS records operational payment facts. It does not claim fiscal,
accounting, acquiring, or certified cash-register authority.

### 9.1 Full payment

A full-payment workflow should record a committed payment outcome against the
remaining payable amount and close the order only after all required
invariants succeed atomically.

### 9.2 Split by items

An item split should let an operator allocate eligible order items to a check
or payment share while preserving the connection between items, applicable
discounts, and the order total. The same payable value must not be allocated
twice.

### 9.3 Equal split

An equal split should distribute the remaining payable value predictably.
Rounding must be deterministic, explicit, and conserve the total: the sum of
all shares must equal the amount being split.

### 9.4 Balanced close

Across full and split workflows:

- committed allocations and payments must not exceed the eligible remainder;
- discounts must be allocated or represented without changing the order total;
- retries must not duplicate payments, checks, or closure effects;
- partial progress must remain understandable and recoverable; and
- an order closes only when its required payable balance is satisfied.

Exact payment methods, status values, rounding implementation, APIs, and
transaction boundaries belong to current contracts, schema, services, and
tests. Refunds, new payment hardware, invoicing, fiscalization, and cash
management remain separately reviewable.

## 10. Printing and hardware intent

Printing is an operational, non-fiscal capability.

When a committed operation requires a ticket:

- print work should be durably recorded after or with the owning committed
  state;
- operators should be able to observe pending, successful, and failed work;
- failed jobs should be safely retryable;
- repeated requests should not silently create unintended duplicate effects;
- printer failure must not corrupt or roll back an already committed order or
  payment; and
- recovery should distinguish transaction success from physical-output
  success.

This document does not define printer model, transport, device path, worker
cadence, command language, station wiring, or site configuration. Those are
current implementation and deployment concerns.

Repository implementation does not mean a named restaurant, host, printer, or
device is `READY`. Hardware/site readiness requires dated evidence for the
explicit environment and scope.

## 11. Local management, reports, and identity

### 11.1 Bounded local management

The POS product may provide local management for the operational configuration
it owns, including catalog, combos, establishment display/receipt context,
printing, and local users. Management actions must preserve operational history
and respect the trusted Site Agent boundary.

This intent does not approve cloud administration, remote fleet management, or
automatic multi-site distribution.

### 11.2 Restaurant-local reports

Operational reports should help restaurant operators understand local orders,
payments, items, and activity using the committed local facts owned by POS.
Report results must be explainable, deterministic for their selected scope, and
must not be presented as fiscal or certified accounting output.

Exact service-day rules, measures, filters, routes, exports, and current UI
belong to current Product Knowledge, page packs, code, and tests. Cloud
analytics/export is separately reviewable.

### 11.3 Separate local access control

Restaurant-local POS access is controlled separately from cloud identity and
membership. Cloud users must not be treated as local POS identities, and cloud
roles must not silently authorize local operations.

The product intent is fail-closed local access, accountable operator actions,
and least privilege appropriate to the restaurant-local boundary. Exact local
roles, permissions, credential/PIN storage, sessions, versioning, route
protection, and administration behavior belong to the approved Site Agent
Product Knowledge and current code/tests.

## 12. Local-first and resilience

Local-first means POS operational work can continue without Internet or cloud
when the restaurant LAN, local POS server, Site Agent, local PostgreSQL, and
required devices remain healthy.

Local-first does not mean that a browser can continue durable operation after
losing the local server. Current browser-offline emergency order entry is not
implemented. A cached application shell, browser standby, or temporary UI state
must not be confused with durable operational ownership.

Durable local operations should:

- commit through the trusted local service and persistence boundary;
- use atomic and idempotent behavior for critical mutations;
- recover from browser refresh or transient connection loss by reading
  committed local state;
- preserve queued print work independently of the browser session; and
- fail visibly when required local infrastructure is unavailable.

Detailed failure modes, PWA behavior, backup expectations, and recovery limits
are owned by [Offline Strategy](OFFLINE_STRATEGY.md) and the
[Site Agent Product Knowledge Home](site-agent/README.md).

This Product Spec does not introduce browser-side operational replication,
multi-master state, speculative outboxes, or offline synchronization.

## 13. Cloud and local separation

POS operational data remains restaurant-local. Orders, payments, kitchen
state, print work, local users, catalog, and operational reports must not be
silently synchronized into cloud persistence.

The following are separate trust and ownership boundaries:

- cloud identities/memberships versus local POS users; and
- the cloud Establishment profile versus the local POS establishment record.

Similar names or fields do not create a shared source of truth or authorize
copying between those boundaries.

Cloud analytics/export, remote management, multi-site aggregation, cloud-user
mapping, Establishment mapping, or any transfer of local operational data is
future design space. Each capability requires an accepted Product Decision and
explicit data minimization, contracts, security, ownership, operations,
failure, and readiness review. None is an existing roadmap commitment in this
document.

## 14. Technical authority routing

For current technical or implementation questions, use these sources rather
than this Product Spec:

| Question                                                         | Current authority                                                                                                                                     |
| ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Runtime families, product visibility, and cloud/local separation | [ADR-001](../../decisions/ADR-001-runtime-families-and-product-visibility.md) and [ADR-003](../../decisions/ADR-003-database-ownership-boundaries.md) |
| Browser, Site Agent, and database ownership                      | [Database Boundaries](../../architecture/DATABASE_BOUNDARIES.md) and [Site Agent Product Knowledge](site-agent/README.md)                             |
| Current POS scope and behavior                                   | [POS README](README.md) and the [Module Registry](../../MODULE_REGISTRY.md)                                                                           |
| Current local persistence                                        | [`packages/db-pos` schema and migrations](../../../packages/db-pos)                                                                                   |
| Current transport contracts                                      | [`@yuta/contracts/local-pos`](../../../packages/contracts/src/local-pos) and current consumers                                                        |
| Exact routes, services, auth, realtime, printing, and UI         | [Site Agent code/tests](../../../apps/site-agent), [POS code/tests](../../../apps/yuta-pos), and their nearest instructions                           |
| Route-level UI intent and evidence                               | [POS page-pack index](../../ui/pages/README.md) and the owning page pack                                                                              |
| Operator behavior and acceptance                                 | [User Guide](USER_GUIDE.md) and [QA Checklist](QA_CHECKLIST.md)                                                                                       |
| Offline/degraded behavior                                        | [Offline Strategy](OFFLINE_STRATEGY.md) and [Site Agent Product Knowledge](site-agent/README.md)                                                      |
| Deployment and site readiness                                    | [Deployment](../../operations/DEPLOYMENT.md) and [Production Readiness](../../operations/PRODUCTION_READINESS.md)                                     |

Package manifests, executable schema/migrations, contracts, current code, and
tests describe repository implementation. Dated deployment/runtime evidence is
still required for claims about a live restaurant environment.

## 15. Fiscal and legal boundary

YUTA POS currently records operational payments and produces non-fiscal
tickets.

This Product Spec does not claim:

- certified cash-register compliance;
- fiscal receipt issuance;
- VAT certification;
- accounting certification; or
- legal cash-register certification.

Any future fiscal, invoicing, tax, certified-payment, or accounting capability
requires a separate approved scope plus applicable legal/compliance ownership,
data design, auditability, operations, certification, and readiness evidence.

## 16. Future and unresolved design space

The following may remain useful product context, but each is separately
reviewable and receives no lifecycle assignment from this document:

- browser-offline emergency order entry;
- remote management and multi-site operations;
- cloud analytics or bounded export;
- any local-to-cloud data transfer;
- cloud-user/local-user or cloud-Establishment/local-establishment mapping;
- new payment methods or hardware;
- refunds, cash-management, fiscalization, VAT, and invoicing;
- Rooms/Tables, floor plans, reservations, or seating management;
- multiple-printer or fleet management;
- additional printer/device models;
- new local access roles or permission models; and
- new integrations, APIs, packages, schemas, or deployment topologies.

Future designs must preserve historical accuracy, explicit ownership,
idempotency, failure isolation, local operational continuity, and the accepted
cloud/POS separation unless a higher-authority accepted durable decision
explicitly changes the relevant boundary.

## 17. Product acceptance outcomes

The broader product intent is satisfied only when the applicable bounded scope
can demonstrate that:

- operators can create and progress orders quickly and predictably;
- committed item, discount, payment, kitchen, and print history remains
  explainable after configuration changes;
- kitchen work reflects production items rather than commercial discount
  constructs;
- full and split payments conserve totals and cannot close an unbalanced order;
- retries and transient failures do not duplicate critical durable effects;
- printing failures remain observable and do not corrupt committed operations;
- cloud outage does not stop the healthy restaurant-local runtime;
- local server loss is reported honestly rather than presented as supported
  browser-offline operation;
- local identity and data remain separate from cloud trust and persistence;
- reports and tickets remain explicitly operational and non-fiscal; and
- environment, device, and production-readiness claims are supported by dated,
  scope-specific evidence.

Exact verification procedures and current evidence belong to the QA Checklist,
page packs, test suites, and Production Readiness sources.

## 18. Historical context — non-authoritative

Earlier versions of this document combined Product Intent with an initial
technical blueprint: technology choices, schema and service catalogs,
implementation sequencing, printer-adapter details, and a sample Luna seed.
Those details helped explain the original implementation path but are not
current architecture, execution instructions, configuration, or deployment
evidence.

Current technical questions must use the authorities routed above. Historical
provenance remains available in repository history; this step does not create
or choose a separate archive.

## 19. OpenSpec future role

This Product Spec retains broader Product Intent, product rationale, non-goals,
and context. Once YUTA explicitly approves `openspec/specs/` as normative,
approved OpenSpec specs may own precise behavioral requirements inside accepted
durable boundaries.

Accepted ADR, runtime, database, security, and product-boundary decisions remain
higher authority for those durable boundaries. An OpenSpec change remains
non-normative until promoted through the approved lifecycle, and neither an
OpenSpec spec nor repository implementation proves deployment or Production
Readiness.
