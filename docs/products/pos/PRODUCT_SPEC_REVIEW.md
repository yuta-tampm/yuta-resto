# POS Product Spec Authority Review

Status: APPROVED

Visibility: Engineering

Owner: YUTA product and engineering

Last updated: 2026-08-28

## 1. Executive summary

[`PRODUCT_SPEC.md`](PRODUCT_SPEC.md) should remain the stable home for the POS
product's broader durable intent: restaurant-local operation, fast order entry,
historical accuracy, kitchen production semantics, payment and split outcomes,
reliable non-fiscal printing, operator-oriented management, and explicit
non-goals. Some of this intent is repeated in current sources, but the Product
Spec is still the only consolidated statement of several business invariants
and the original product rationale.

The document is not a reliable current authority for runtime ownership,
database access, exact schema, API or service signatures, package layout,
realtime transport, local authentication implementation, printer adapter
details, deployment, or production readiness. Those sections are substantially
superseded or qualified by accepted ADRs, current architecture, the approved
Site Agent Product Knowledge Home, executable contracts/schema, current code
and tests, package manifests, and operations sources.

The Module Registry records the bounded POS capability as Product Decision
`APPROVED`, repository Implementation `IMPLEMENTED`, Environment `UNVERIFIED`,
and Production Readiness `NOT_READY`. This review does not change those values,
does not infer a deployed version, and does not approve any broader or future
capability.

**Recommendation: `UPDATE IN PLACE`.** Preserve the stable path and unique
Product Intent, remove or simplify superseded technical prescriptions, and
route current implementation and architecture to their owning sources. A split
would introduce a second active POS Product Intent source without a clearer
ownership boundary.

## 2. Section inventory

The classification is the primary treatment for each section. A section marked
`ROUTE_TO_CURRENT_SOURCE` may still contribute a short durable principle; a
section marked `SUPERSEDED_ARCHITECTURE` may contain Product Intent that must be
extracted before its technical detail is simplified.

| PRODUCT_SPEC section                       | Current role                                                                                                                      | Classification            | Current source / destination                                                                                                           | Confidence |
| ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------- | ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| Preamble and status note                   | Correctly warns that architecture is superseded, but still presents the file as a combined product and technical reference.       | `ROUTE_TO_CURRENT_SOURCE` | Authority Model, Product Knowledge routing, POS README, and Site Agent Home.                                                           | High       |
| 0. Purpose                                 | Defines the restaurant-internal, local, non-fiscal product boundary and hardware-oriented operating context.                      | `KEEP_CURRENT_INTENT`     | Retain durable scope and non-goals; route current behavior and readiness elsewhere.                                                    | High       |
| 1. Repository Fit                          | Describes application and package responsibilities that are now governed by accepted runtime/database boundaries.                 | `SUPERSEDED_ARCHITECTURE` | ADR-001, ADR-003, Database Boundaries, POS README, Site Agent Home, and current manifests.                                             | High       |
| 2. Tech Stack                              | Prescribes versions, libraries, and platform choices that can drift independently of Product Intent.                              | `ROUTE_TO_CURRENT_SOURCE` | Package manifests, root and nested instructions, current code, and the UI export catalog.                                              | High       |
| 3. Language Rules                          | Contains a durable French operator-UX expectation mixed with engineering conventions already governed elsewhere.                  | `ROUTE_TO_CURRENT_SOURCE` | Retain the operator-language outcome; route engineering rules to repository/app instructions.                                          | High       |
| 4. Core POS Flow                           | Consolidates the fast local order-to-kitchen-to-payment workflow and the initial free-label/no-table-map boundary.                | `KEEP_CURRENT_INTENT`     | Retain as product flow; current implementation routes to POS README, page packs, code, and tests.                                      | High       |
| 5.1 Historical Accuracy                    | Defines durable snapshots and preservation of historical order facts.                                                             | `KEEP_CURRENT_INTENT`     | Retain; executable enforcement belongs to db-pos schema, Site Agent transactions, and tests.                                           | High       |
| 5.2 Kitchen Rules                          | Mixes durable production-item semantics with current queue, prepare/undo, notification, and chime details.                        | `KEEP_CURRENT_INTENT`     | Retain production and correction outcomes; route exact current workflow to POS README, page pack, contracts, and code/tests.           | High       |
| 5.3 Combos                                 | Defines combos as deterministic payment-time discounts rather than kitchen products.                                              | `KEEP_CURRENT_INTENT`     | Retain intent; current algorithm and persistence route to contracts, Site Agent, db-pos, and tests.                                    | High       |
| 5.4 Split Payment                          | Defines durable allocation, conservation, and close-order outcomes.                                                               | `KEEP_CURRENT_INTENT`     | Retain business invariants; route exact flows and rounding implementation to current code/tests and POS sources.                       | High       |
| 5.5 No Hard Delete                         | Defines durable operational-history preservation.                                                                                 | `KEEP_CURRENT_INTENT`     | Retain; route enforcement details to schema, services, and tests.                                                                      | High       |
| 6. Status Model                            | Prescribes exact order/item enum values and transitions now represented by executable sources.                                    | `ROUTE_TO_CURRENT_SOURCE` | `@yuta/contracts`, db-pos schema, Site Agent services, POS README, and tests.                                                          | High       |
| 7. Database Rules                          | Mixes valid business invariants with technical ownership and transaction prescriptions.                                           | `SUPERSEDED_ARCHITECTURE` | Extract unique invariants; route ownership and implementation to ADR-003, Database Boundaries, Site Agent Home, schema, and tests.     | High       |
| 8. Database Tables, 8.1-8.16               | Provides an exact historic table/type catalog that can diverge from active migrations and schema.                                 | `SUPERSEDED_ARCHITECTURE` | `packages/db-pos/src/schema`, migrations, repositories, contracts, and integration tests.                                              | High       |
| 9. Order Service Requirements              | Lists exact service functions and transaction shapes rather than product outcomes.                                                | `SUPERSEDED_ARCHITECTURE` | Site Agent routes/services, local-pos and order contracts, db-pos repositories, and tests.                                             | High       |
| 10. Combo Engine                           | Combines useful deterministic discount intent with exact function-level implementation.                                           | `ROUTE_TO_CURRENT_SOURCE` | Retain deterministic and explainable outcomes; route algorithm shape to current services/contracts/tests.                              | High       |
| 11. Payment and Split Workflows, 11.1-11.3 | Owns durable full-payment, item-split, equal-split, rounding, and closure outcomes, mixed with implementation signatures.         | `KEEP_CURRENT_INTENT`     | Keep outcomes and invariants; route current UI/API behavior to POS README, page packs, contracts, and tests.                           | High       |
| 12. UI Requirements                        | Defines fast, touch-oriented operator outcomes and a target screen set, some now implemented with more precise page packs.        | `KEEP_CURRENT_INTENT`     | Keep UX principles; route route-level truth to the POS page-pack index and current application.                                        | High       |
| 13. Admin MVP                              | Defines local catalog, combo, establishment, and report management intent now partly or fully represented by current sources.     | `ROUTE_TO_CURRENT_SOURCE` | POS README, page packs, Site Agent Home, schema, code, and tests.                                                                      | High       |
| 14. Print Gateway                          | Mixes durable queued/retryable non-fiscal printing intent with exact Epson/RFCOMM, station, endpoint, and adapter details.        | `ROUTE_TO_CURRENT_SOURCE` | Keep reliable-printing outcome; route exact implementation to Site Agent Home, POS README/User Guide, current code, and site evidence. | High       |
| 15. Implementation Order                   | Records a delivery sequence rather than current authority or status.                                                              | `HISTORICAL_CONTEXT`      | Preserve as provenance until a later archive decision; use current sources for implementation state.                                   | High       |
| 16. Seed Data                              | Describes a Luna-specific sample catalog and quantities that are configuration/evidence rather than durable product requirements. | `ROUTE_TO_CURRENT_SOURCE` | Current db-pos seed source, tests, deployment records, and site configuration.                                                         | High       |
| 17. Acceptance Criteria                    | Combines durable product outcomes with checks now tracked more precisely by QA, page packs, tests, and readiness sources.         | `ROUTE_TO_CURRENT_SOURCE` | Retain unique outcome criteria; route current verification to QA Checklist, page packs, test suites, and Production Readiness.         | High       |

No section is classified as `DELETE`. Technical content must not be removed in
a later execution step until its unique Product Intent has either been retained
or routed to a verified current destination.

## 3. Unique Product Intent map

| Intent / requirement group               | Still current?                                                                                                                                                                               | Already represented elsewhere?                                                                            | Recommended home                                                                             |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Restaurant-local, local-first operation  | Yes, within the accepted local runtime boundary. It means independence from cloud availability, not independence from the restaurant LAN and local services.                                 | Strongly represented by ADR-001/003, POS README, Offline Strategy, and Site Agent Home.                   | Retain the product outcome in Product Spec; route topology and failure mechanics.            |
| Fast order entry                         | Yes: touch-oriented, low-friction item entry and a short path from order opening to kitchen and payment remain durable operator goals.                                                       | Current UI details are represented by POS README and page packs.                                          | Retain principles and core journey in Product Spec.                                          |
| Order lifecycle and historical accuracy  | Yes: durable orders, snapshots, explicit transitions, correction rather than silent history loss, and no hard deletion remain core.                                                          | Exact statuses and enforcement exist in contracts, schema, services, and tests.                           | Retain invariants in Product Spec; route executable state definitions.                       |
| Kitchen workflow                         | Yes: kitchen receives production items, not commercial combo labels or discount lines; send/prepare/correct outcomes remain durable.                                                         | Current queues, batches, SSE fallback, chime, and UI are documented elsewhere.                            | Retain kitchen semantics; route exact mechanics and current behavior.                        |
| Payments and split workflows             | Yes: full payment, item allocation, equal split, rounding/conservation, and close-only-when-balanced are unique consolidated intent.                                                         | Current UI/services/contracts/tests represent the implemented subset.                                     | Retain business outcomes and invariants in Product Spec.                                     |
| Durable printing                         | Yes: committed print work must be durable, observable, retryable, and separate from fiscal certification.                                                                                    | Current print jobs, worker, settings, adapter, and operator behavior are documented and tested elsewhere. | Retain reliability outcome; route implementation and readiness.                              |
| Local management                         | Yes for bounded local catalog, combo, establishment, printing, and operator administration.                                                                                                  | POS README and page packs provide current scope.                                                          | Retain broad local-management intent; route implemented screens and data shape.              |
| Reports                                  | Yes as restaurant-local operational reporting, not cloud analytics or fiscal accounting.                                                                                                     | Current reports, service-day behavior, and limitations are in POS README/page pack/code/tests.            | Retain non-fiscal local reporting intent; route current metrics and implementation.          |
| Local users and permissions              | Yes as a separate local operational identity boundary, but exact role/permission workflow is not Product Spec authority.                                                                     | Site Agent Home, POS README, schema, auth services, and tests provide current implementation.             | Retain separation and least-privilege intent; route exact roles/auth behavior.               |
| Offline and degraded operation           | Yes as cloud-outage resilience while local infrastructure is healthy. Browser-only emergency operation is not current MVP behavior.                                                          | Offline Strategy and Site Agent Home are explicit.                                                        | Retain bounded resilience outcome; do not use Product Spec to imply browser-offline support. |
| Hardware and device expectations         | Yes as a local-device product concern, including reliable printing and recoverable failure. Exact models/transports are implementation and deployment facts.                                 | Site Agent Home, User Guide, code, and readiness sources cover current details.                           | Retain device-support outcomes; route exact adapter and site validation.                     |
| Fiscal/non-fiscal boundary               | Yes and materially important: the POS records operational payments and produces non-fiscal tickets; certified cash-register, VAT, tax receipt, and legal certification remain outside scope. | POS README, User Guide, and repository visibility rules reinforce it.                                     | Retain prominently in Product Spec.                                                          |
| Multi-site and future cloud relationship | Only as separately reviewable future context. Current durable boundaries prohibit synchronizing POS operational data to cloud persistence.                                                   | ADR-001/003, Database Boundaries, Offline Strategy, and Site Agent Home govern current separation.        | Preserve questions as `NEEDS_REVIEW`; do not retain sync as approved direction.              |
| Operator UX principles                   | Yes: speed, large touch targets, clear feedback, French operator language, and recovery/error visibility remain useful.                                                                      | Current page packs and UI provide implementation evidence.                                                | Retain principles in Product Spec; route exact layouts and components.                       |
| Non-goals                                | Yes: no public cloud capability claim, no table map in the initial bounded flow, no fiscal/certified accounting, no cloud operational sync, and no browser database ownership.               | Distributed across current product and architecture sources.                                              | Retain product-specific non-goals, subject to accepted durable boundaries.                   |
| Future extensibility                     | Useful only as context: additional devices, remote management, exports, analytics, or broader multi-site workflows require scoped decisions.                                                 | No single current source approves the full future set.                                                    | Retain as unresolved design space, never as approved or implemented behavior.                |

## 4. Superseded architecture map

| Technical/architecture topic                            | Why superseded                                                                                                                                                                   | Current authority                                                                                                            |
| ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `apps/yuta-pos` versus `apps/site-agent` responsibility | The Product Spec cannot assign browser/server, transaction, persistence, printing, or device ownership. The POS is the client; Site Agent is the trusted local service boundary. | ADR-003, Database Boundaries, approved Site Agent Home, root/app instructions, and current code.                             |
| `packages/db-pos` ownership                             | Direct or ambiguous ownership language is replaced by the accepted rule that Site Agent is its only runtime owner.                                                               | ADR-003, Database Boundaries, Site Agent Home, and `packages/db-pos/AGENTS.md`.                                              |
| Browser/server database boundary                        | Browser bundles cannot own DB connections, credentials, trusted state, transactions, or device access.                                                                           | Database Boundaries, root/POS/Site Agent instructions, architecture checks, and current imports.                             |
| Cloud/POS separation                                    | Operational orders, payments, kitchen, print, local-user, catalog, and report data remain restaurant-local and are never synchronized to cloud persistence.                      | ADR-001, ADR-003, Database Boundaries, Offline Strategy, POS README, and Site Agent Home.                                    |
| Exact routes and APIs                                   | Function lists and endpoint assumptions can drift from executable route and contract surfaces.                                                                                   | Current Site Agent routes/services, POS server edges, `@yuta/contracts`, and tests.                                          |
| Package tree and technology stack                       | Suggested placement, libraries, and versions are not durable Product Intent.                                                                                                     | Current manifests, exports, root and nested instructions, Repository Map, and code.                                          |
| Schema/model prescriptions                              | Exact tables, columns, enums, relationships, and indexes are executable technical state, not product authority.                                                                  | db-pos schema, migration journal, repositories, contracts, and integration tests.                                            |
| Printing/device architecture                            | Epson model, RFCOMM transport, queue endpoint, worker cadence, and adapter wiring describe a bounded implementation, not universal readiness.                                    | Site Agent Home, POS README/User Guide, print services/routes/schema/tests, Deployment, and dated site/device evidence.      |
| Realtime/SSE implementation                             | SSE routes, event hubs, polling fallback, and refresh timing are current implementation choices.                                                                                 | Current kitchen contracts, Site Agent event hub/route, POS page pack/code, and tests.                                        |
| Local authentication implementation                     | Exact credential storage, session, role, route, and cutover behavior must follow current trusted local auth sources. Cloud identity does not authorize local POS operation.      | Site Agent Home, POS README, db-pos auth/user schema, Site Agent auth services/routes, and tests.                            |
| Deployment assumptions                                  | Repository implementation, a sample Luna environment, or a documented printer does not prove any restaurant/host is deployed or ready.                                           | Deployment authority, Production Readiness `POS-01`, migration journal, and dated host/device/release evidence.              |
| Cloud synchronization assumptions                       | The accepted boundary is no synchronization of POS operational data to cloud persistence. A future export or analytics flow cannot be inferred from old extensibility language.  | ADR-001/003, Database Boundaries, Offline Strategy, Site Agent Home, and a future accepted decision/spec if one is approved. |
| Seed catalog and establishment values                   | Exact sample quantities and labels are mutable configuration and test/development evidence.                                                                                      | Current db-pos seed files, tests, and restaurant-specific deployment/configuration evidence.                                 |

## 5. Product Intent vs Implemented State

### Current bounded repository implementation

The Module Registry records the bounded POS scope as approved and implemented
in the repository, while its environment remains unverified and production
readiness remains not ready. Current behavior must be read from the POS README,
approved Site Agent Home, POS page packs, executable contracts/schema, code, and
tests. Those sources describe repository Implemented State; they do not prove
which commit, migration, timezone, device configuration, or printer is live at
a restaurant.

### Broader Product Intent and future direction

The Product Spec should continue to own broader product rationale, operator
experience goals, business invariants, non-fiscal scope, non-goals, and useful
future context. Retaining future context does not assign it `APPROVED`, call it
implemented, or authorize production enablement.

### Unresolved or separately reviewable

The following require scoped decisions before execution:

- browser-offline emergency order entry or browser-side replicated state;
- remote management, multi-site aggregation, cloud analytics, or export;
- any movement or synchronization of POS operational data toward cloud;
- mapping cloud users to local POS users or cloud Establishment to the local
  POS establishment record;
- new payment hardware/methods, refunds, cash-management, fiscalization, VAT,
  invoicing, or certified-receipt workflows;
- table/floor-plan management beyond the free-label bounded flow;
- multiple-printer/fleet assumptions and support for additional device models;
  and
- exact future permissions, APIs, schema, packages, deployment topology, and
  production service objectives.

### Historical context

The implementation sequence, original schema/service catalog, seed snapshot,
and older adapter assumptions have provenance value. They must not be called
current technical authority. This review neither chooses an archive destination
nor moves or deletes that history.

## 6. Offline / resilience treatment

`Local-first` currently means that POS operational work does not depend on the
Internet or cloud when the restaurant LAN, Site Agent, local PostgreSQL, and
required devices remain healthy. It does not mean the browser can continue
durable order entry after losing the local server.

The current PWA caches a bounded static shell/assets; navigation and mutations
still require the local runtime. Browser standby is an energy/refresh behavior
and does not stop Site Agent, PostgreSQL, printing, or other durable services.
Committed local transactions and print jobs can survive process/browser
recovery according to their owning persistence and worker behavior, but that
does not remove host, database, backup, migration, or device readiness gates.

Browser-only emergency operation, client-side replication, multi-master state,
and an offline synchronization outbox are not current MVP behavior. Any future
such direction remains separately reviewable and must not silently weaken the
accepted no-cloud-sync boundary.

## 7. Printing / hardware treatment

The durable Product Intent is reliable non-fiscal printing: print work follows
committed operations, is persisted, observable, retryable, and fails without
corrupting order/payment state. The repository implements a bounded print-job
queue, worker, settings, status, and local adapter behind Site Agent.

Exact printer model, transport, station mapping, connection path, retry timing,
and device commands are current implementation or deployment details. They
belong to Site Agent/code/operator sources and may differ by release. Repository
support for an Epson TM-m30 path does not prove that a specific printer, host,
restaurant, or environment is configured or ready. Readiness is site-, device-,
host-, migration-, and release-specific and requires dated evidence under
`POS-01`.

Nothing in the Product Spec may turn these tickets into fiscal receipts or
evidence of tax/cash-register certification.

## 8. Cloud / local relationship

- POS operational data is restaurant-local and must not be synchronized to
  cloud persistence under the current accepted boundary.
- Analytics, export, aggregation, or remote-management ideas are separately
  reviewable capabilities. A bounded future export would require an accepted
  decision, data minimization, contracts, ownership, security, operations, and
  readiness evidence; it is not an implied synchronization roadmap.
- Cloud identities/memberships and local POS users are separate trust domains.
  Neither silently provisions or authorizes the other.
- The cloud Establishment profile and the local POS establishment record are
  separate data owners. Similar fields do not establish synchronization or a
  shared source of truth.
- Multi-site oversight is not approved merely because the Product Spec mentions
  extensibility. It needs a bounded Product Decision that preserves local
  operational isolation and the public-visibility rules.

## 9. Recommended treatment

### Option A — UPDATE IN PLACE

In a later separately approved execution step:

1. keep `PRODUCT_SPEC.md` at its stable path as broader POS Product Intent;
2. preserve the unique intent mapped above, especially business invariants,
   operator outcomes, non-fiscal boundaries, non-goals, and unresolved future
   context;
3. add a concise current-versus-future and Product-Intent-versus-implementation
   distinction;
4. replace exact schema, service signatures, endpoint lists, package/technology
   prescriptions, printer wiring, auth internals, seed counts, and rollout
   assumptions with links to current authorities;
5. preserve historical material until a destination is positively identified;
   and
6. mark unresolved future capabilities without assigning lifecycle values.

`SPLIT` is not recommended because unique intent is distributed throughout the
file and a second active spec would create routing ambiguity. `KEEP AS-IS` is
unsafe because agents can treat precise but superseded technical content as
current authority. The cleanup treatment itself does not need another
`NEEDS REVIEW` choice, although the future capabilities listed above do.

## 10. OpenSpec future role

The Product Spec should retain broader Product Intent, non-goals, context, and
rationale. If YUTA explicitly approves `openspec/specs/` as normative, approved
OpenSpec specs may become the primary authority for precise behavioral
requirements inside accepted durable boundaries. Accepted ADR/runtime/database
decisions remain durable authority, and an OpenSpec change remains
non-normative until promoted by the approved lifecycle. Neither OpenSpec nor
repository implementation proves deployment or production readiness.

## 11. Proposed execution scope

### Default file allowed in a later step

- `docs/products/pos/PRODUCT_SPEC.md` only.

The path remains stable, so no inbound link needs to change by default. If the
execution discovers a specifically inaccurate routing statement elsewhere,
scope must be explicitly expanded before changing that file.

### Protected content and files

- preserve every unique Product Intent group until its retained wording or
  verified destination is explicit;
- do not change any lifecycle value, production gate, runtime/data boundary,
  or current behavior claim;
- do not change POS README, User Guide, Offline Strategy, QA Checklist, Site
  Agent Home, page packs, accepted ADRs, architecture, operations, code,
  schema, migrations, contracts, tests, or OpenSpec;
- do not create speculative APIs, packages, tables, sync flows, device support,
  or deployment claims; and
- do not archive, move, merge, or delete historical content in that step.

### Required execution validation

- map each removed technical prescription to a current authority or preserve it
  as clearly historical context;
- confirm all unique Product Intent and unresolved questions remain represented;
- compare runtime/database/cloud boundaries with ADR-001/003, Database
  Boundaries, and the Site Agent Home;
- compare current behavior claims with POS README, page packs, contracts,
  schema, code, and tests;
- compare readiness claims with Production Readiness and dated deployment
  evidence;
- run `pnpm docs:check`, `pnpm architecture:check`, targeted Prettier, Markdown
  link checks, and `git diff --check`; and
- confirm only the separately approved execution files changed.

## 12. Review validation

- Only this review file is created by Step 6.2D3.
- `PRODUCT_SPEC.md` remains unchanged at SHA-256
  `C8B529CA54DF196A4D5CE32600DCF8CBE8F49F75957F34FC954803C1837FD0C0`.
- No lifecycle assignment is changed or newly inferred.
- Accepted ADR-001/003, the approved Site Agent Home, current architecture,
  manifests, code, contracts, schema, and tests control technical questions.
- Every unique Product Intent group has a retained home or is marked separately
  reviewable; none is proposed for deletion.

Status: APPROVED
