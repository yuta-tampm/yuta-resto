# YUTA Mouvements de stock Product Knowledge

Status: MIGRATION COMPLETE — REPOSITORY CANONICAL

Visibility: Engineering

Owner: YUTA product and engineering

Last updated: 2026-09-29

## Purpose and bounded scope

Mouvements de stock is the future Backoffice capability for explaining stock
changes and using their history to support restaurant operations. Its confirmed
high-level direction covers stock `+/-`, Inventaire-originated change,
purchase/invoice-originated change, manual movement mainly for `gaspillage`,
weekly consumption visibility, consumption-coherence and problem detection,
procurement forecasting support, and reduction of waste, overstock, and
insufficient stock.

This home is the canonical repository entry point for the reconciled Mouvements
de stock Product Knowledge scope. It keeps Product direction, movement truth,
source-event truth, stock-balance truth, physical-count truth, executable UI
shape, authorization, legal/accounting/HACCP status, privacy/security, and
readiness separate. It does not approve a closed V1, movement entity, ledger,
balance formula, source projection, movement types, sign convention, units,
lifecycle, correction or reversal model, forecast formula, provider/OCR
integration, retention rule, or production use.

Inventaire, Fournisseurs, Fiches techniques, Carte & menus, POS, purchasing,
receipts, invoices/OCR, Production, losses/waste, transfers, Conformité,
Aujourd'hui, Tâches du jour, Establishment, and Identity & Access appear only to
establish ownership or exclusion boundaries. Their Product Truth is not
migrated here. The `Stock` navigation group is not one indivisible Product
authority.

## Knowledge migration state

The Human-supplied `MOUVEMENTS_DE_STOCK_LEGACY_KNOWLEDGE_EXTRACT.md` with
SHA-256
`ed03e1672f4e283c6b2f51819c06a12157c59727605c5f549a15dfbe64f2cb99`
was used only as legacy evidence for the 2026-09-29 reconciliation. The complete
artifact, heading, and final control block were verified before repository
classification began. Export-only transport markers were not copied.

The extract was checked against question-specific current repository authority
and was not copied into this home. Repository reconciliation and bounded
canonicalization are complete.

The repository-only fresh-agent acceptance report
`MOUVEMENTS_DE_STOCK_FRESH_AGENT_ACCEPTANCE_REPORT_PASS.md`, SHA-256
`ece9684589b25a83cd3d9db34ad6738242f3e3f3e59ba34f637aeace511998eb`,
recorded `PASS` with zero material knowledge gaps and zero genuine conflicts.
The test used no Page Chat history, legacy extract, reconciliation report, or
external research. It also confirmed that Inventaire, Tâches du jour, Salariés,
Planning, Pointage, and Formalités were not reopened; Fournisseurs, Fiches
techniques, and every other Page Chat scope were not migrated.

The PASS covered only the bounded Mouvements de stock Product Knowledge in this
home. It did not approve an exact V1, implementation, movement or balance model,
source contract, formula, permission, legal/accounting/HACCP/privacy conclusion,
environment, readiness, or production use.

Following that PASS and the Human-authorized scope-bound cutover on 2026-09-29,
repository knowledge is canonical for the exact Mouvements de stock scope in
this home. The Mouvements de stock Page Chat is `LEGACY EVIDENCE ONLY` for that
scope. It remains available for historical and forensic lookup, but it is no
longer current Product authority. Control Tower retains shaping, genuine-
conflict resolution, Human Decision routing, cross-module reasoning, and
governance coordination; coding agents retain repository discovery, analysis,
and separately authorized execution and verification.

The completed Inventaire, Tâches du jour, Salariés, Planning, Pointage, and
Formalités migrations remain unchanged. Their authority records and decision
packets were not reopened. Fournisseurs and Fiches techniques remain separate
unmigrated scopes.

## Confirmed current Product directions

The following eight Human directions are confirmed at high level. The current
fixture prototype does not provide the corresponding real restaurant
capability, so each is `DECIDED_NOT_IMPLEMENTED` at capability level.

| Confirmed direction                                                                     | Exact boundary                                                                                                                                  | Current repository state                                                                      |
| --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Stock movement represents stock `+/-`                                                   | A movement explains a stock change. Exact entity, source projection, sign, balance application, and lifecycle remain unresolved.                | `DECIDED_NOT_IMPLEMENTED`; fixtures display signed quantities only.                           |
| Inventaire is a high-level source of stock change                                       | The relationship is confirmed. Count, variance, validation trigger, overwrite versus adjustment, idempotency, and write-back remain unresolved. | `DECIDED_NOT_IMPLEMENTED`; no Inventaire-to-Mouvements contract or integration exists.        |
| Purchase is a high-level source of stock change, with invoice reading intended as input | Order, delivery, physical receipt, invoice, credit note, payment, OCR, confirmation, and movement generation remain distinct and unresolved.    | `DECIDED_NOT_IMPLEMENTED`; supplier and delivery-note fixture strings are demonstration data. |
| Manual movement remains available, mainly for `gaspillage`                              | Exact causes, actor, note/evidence, units, effective time, correction, reversal, and permissions remain unresolved.                             | `DECIDED_NOT_IMPLEMENTED`; `Nouveau mouvement` and row actions are disabled.                  |
| Movement history supports weekly consumption visibility                                 | Actual versus estimated meaning, window, inputs, exclusions, units, reliability, and persistence remain unresolved.                             | `DECIDED_NOT_IMPLEMENTED`; no weekly analytics or formula exists.                             |
| Movement data supports consumption-coherence and problem detection                      | Anomaly, expected range, threshold, alert, block, investigation, notification, and confidence remain unresolved.                                | `DECIDED_NOT_IMPLEMENTED`; no anomaly engine or workflow exists.                              |
| Movement data supports a procurement forecast figure                                    | Forecast output, horizon, algorithm, owner, inputs, confidence, override, consumers, and write-back remain unresolved.                          | `DECIDED_NOT_IMPLEMENTED`; no forecast or recommendation exists.                              |
| Operational outcomes include reducing waste, overstock, and insufficient stock          | These are Product outcomes, not approved classifications, formulas, automation, or proof of causality.                                          | `DECIDED_NOT_IMPLEMENTED`; fixture summaries do not measure these outcomes.                   |

The confirmed actor context is a restaurant operator or restaurateur. It does
not define an executable role mapping or grant `OWNER`, `MANAGER`, `STAFF`,
receiver, counter, or service permissions.

## Current implementation

| Evidence area                 | Current repository state                                                                                                                                                                                                                                                                                                         | What it establishes                                                                                                                                      |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Route                         | [`/stock/mouvements`](<../../../apps/backoffice/src/app/(authenticated)/stock/mouvements/page.tsx>) renders `StockMovementsPage`.                                                                                                                                                                                                | The current Backoffice route exists.                                                                                                                     |
| Navigation                    | [`backoffice-navigation.ts`](../../../apps/backoffice/src/components/backoffice/backoffice-navigation.ts) lists `Mouvements de stock` inside `Stock` without a capability predicate.                                                                                                                                             | Navigation presence only; it creates no shared Stock authority or movement permission.                                                                   |
| Authenticated shell           | The parent [`(authenticated)` layout](<../../../apps/backoffice/src/app/(authenticated)/layout.tsx>) requires a server-resolved user session and active tenant context.                                                                                                                                                          | Generic authenticated-shell access only.                                                                                                                 |
| Prototype disclosure          | [`PrototypeBackofficeNotice`](../../../apps/backoffice/src/components/backoffice/prototype-backoffice-notice.tsx) states that displayed values are not establishment data and creation, modification, and export are unavailable until persistence exists.                                                                       | The surface is explicitly a demonstration prototype.                                                                                                     |
| Executable presentation shape | [`stock-movements-model.ts`](<../../../apps/backoffice/src/app/(authenticated)/stock/mouvements/stock-movements-model.ts>) defines route-local fields plus `Entrée`, `Sortie`, `Ajustement`, `Transfert`, `Validé`, and `Annulé` strings.                                                                                        | Fixture UI shape only; no Product-approved enum, schema, lifecycle, or ledger.                                                                           |
| Fixture data                  | [`stock-movements-fixtures.ts`](<../../../apps/backoffice/src/app/(authenticated)/stock/mouvements/stock-movements-fixtures.ts>) contains eight fictional rows with signed quantities, references, users, locations, values, suppliers, delivery notes, and POS/transfer/waste labels.                                           | Demonstration content only; no source event, tenant, accounting, stock, or operational truth.                                                            |
| Local interactions            | Client state provides type/category/zone filters, search, row selection, checkboxes, details, and reset.                                                                                                                                                                                                                         | Local presentation behavior only; selection is not validation, posting, or application.                                                                  |
| Hard-coded summaries          | Summary cards show fictional entries, exits, adjustments, transfers, values, and movement total.                                                                                                                                                                                                                                 | Demo presentation only; no aggregation, balance, valuation, or period calculation.                                                                       |
| Disabled operations           | Date range, export, new movement, row actions, print, and cancellation are disabled.                                                                                                                                                                                                                                             | No create, post, apply, export, print, correction, reversal, cancellation, or deletion exists.                                                           |
| Persistence and boundaries    | No Mouvements-specific cloud contract, schema/migration, repository, service, loader/action, API, operation catalogue, or permission exists.                                                                                                                                                                                     | No executable movement entity, balance, source projection, history, or mutation authority exists.                                                        |
| Tests                         | [`stock-movements-model.test.ts`](../../../apps/backoffice/test/stock-movements-model.test.ts), [`stock-prototype-table-footer.test.tsx`](../../../apps/backoffice/test/stock-prototype-table-footer.test.tsx), and the navigation test cover fixture filtering, selection, formatting, truthful fixture counts, and navigation. | Focused prototype-model evidence only; no persistence, source integration, authorization, tenant-denial, lifecycle, calculation, or Browser QA evidence. |
| UI and normative knowledge    | No Mouvements page pack, ADR, normative OpenSpec main spec, active change, or archived Mouvements change exists.                                                                                                                                                                                                                 | No detailed approved UI delivery or behavioral contract.                                                                                                 |

The implementation classification is `PROTOTYPE`. The route is not connected to
cloud persistence and does not implement an operational movement or stock
system. Fixture types, signs, reasons, dates, zones, users, values, supplier
references, POS labels, and transfer labels are implementation evidence only.

## Capability and state matrix

| Capability                              | Product status                                         | Implementation                          | Legal/accounting/HACCP                                                                    | Privacy/security                                                      | Environment   | Readiness / production authorization        | Owner, actors, and scope                                                                   | Explicit exclusions and unresolved boundary                                                     |
| --------------------------------------- | ------------------------------------------------------ | --------------------------------------- | ----------------------------------------------------------------------------------------- | --------------------------------------------------------------------- | ------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| Mouvements de stock view                | Eight bounded directions approved; exact V1 unresolved | `PROTOTYPE`; fictional route-local data | `UNVERIFIED`; external review required for evidentiary or regulated meaning               | `UNVERIFIED`                                                          | `UNVERIFIED`  | `NOT_ASSESSED`; no production authorization | Product Knowledge owns the reconciled scope; executable data owner and actors absent       | No canonical movement, balance, type, source, lifecycle, or permission model                    |
| Inventaire-originated change            | `APPROVED` at relationship level                       | `NOT_STARTED`                           | `UNVERIFIED`                                                                              | `UNVERIFIED` for future actor/data flow                               | `NOT_ENABLED` | `NOT_ASSESSED`; no production authorization | Ownership and trigger unresolved across independently authoritative scopes                 | No automatic count, variance, adjustment, overwrite, movement, or write-back                    |
| Purchase/invoice-originated change      | `APPROVED` at relationship level                       | `NOT_STARTED`                           | `REQUIRES_CURRENT_EXTERNAL_REVIEW` if invoice, receipt, valuation, or evidence is pursued | `REQUIRES_CURRENT_EXTERNAL_REVIEW` if documents/providers are pursued | `NOT_ENABLED` | `NOT_ASSESSED`; no production authorization | Purchasing, receipt, invoice, OCR, and movement owners unresolved                          | Invoice is not receipt; no OCR, confirmation, duplicate handling, or movement generation        |
| Manual movement mainly for `gaspillage` | `APPROVED` at high level                               | `NOT_STARTED`; disabled create action   | `REQUIRES_CURRENT_EXTERNAL_REVIEW` for waste, traceability, or evidentiary meaning        | `UNVERIFIED`                                                          | `NOT_ENABLED` | `NOT_ASSESSED`; no production authorization | Exact actor, establishment/location scope, cause and mutation authority unresolved         | No approved cause taxonomy, note/evidence rule, correction, reversal, or deletion               |
| Weekly consumption visibility           | `APPROVED` objective                                   | `NOT_STARTED`                           | `NOT_APPLICABLE` to the objective alone                                                   | `UNVERIFIED` for future operational data                              | `NOT_ENABLED` | `NOT_ASSESSED`; no production authorization | Analytical owner and consumers unresolved                                                  | No formula, window, unit conversion, reliability, or persistence                                |
| Coherence/problem detection             | `APPROVED` objective                                   | `NOT_STARTED`                           | `NOT_APPLICABLE` to the objective alone                                                   | `UNVERIFIED`                                                          | `NOT_ENABLED` | `NOT_ASSESSED`; no production authorization | Analytical owner, actors, visibility, and consumers unresolved                             | No anomaly definition, threshold, alert, notification, block, or investigation workflow         |
| Procurement forecast support            | `APPROVED` objective                                   | `NOT_STARTED`                           | `NOT_APPLICABLE` to the objective alone                                                   | `UNVERIFIED`                                                          | `NOT_ENABLED` | `NOT_ASSESSED`; no production authorization | Owner unresolved among Mouvements, Fournisseurs/purchasing, or another approved projection | No algorithm, horizon, forecast/recommendation distinction, confidence, override, or write-back |
| Waste/overstock/understock reduction    | `APPROVED` outcome direction                           | `NOT_STARTED`                           | `REQUIRES_CURRENT_EXTERNAL_REVIEW` if waste or regulated claims are pursued               | `UNVERIFIED`                                                          | `NOT_ENABLED` | `NOT_ASSESSED`; no production authorization | Outcome attribution and responsible capability unresolved                                  | No metric, automation, causal claim, required action, or task generation                        |

Backoffice is globally `NOT_READY`. Documentation, prototype tests, or an
enabled route does not grant production authorization.

## Movement concept matrix

| Concept                              | Product status                 | Semantic owner and source                                                                   | Movement or balance                                            | Structure/time                                                        | Mutation, visibility, consumers, and write-back                                              | Implementation / retention                     | Unresolved boundary                                                                                  |
| ------------------------------------ | ------------------------------ | ------------------------------------------------------------------------------------------- | -------------------------------------------------------------- | --------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ---------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Stock movement                       | Confirmed high-level concept   | Mouvements Product scope; exact executable owner and source projection unresolved           | Movement, not balance                                          | Entity versus projection and effective time unresolved                | Restaurant-facing history/analysis intended; mutation and write-back unresolved              | Fixture rows only; no persistence or retention | Identity, source reference, type, sign, lifecycle, stock effect, correction, history                 |
| Inventaire-originated movement       | Confirmed relationship         | Cross-scope ownership unresolved; Inventaire remains independently authoritative            | Potential movement; count/variance are not movement by default | Trigger and effective time unresolved                                 | Intended movement analysis consumer; no cross-write                                          | Not implemented; no retention                  | Count versus variance, validation, idempotency, adjustment versus overwrite, recovery                |
| Purchase/invoice-originated movement | Confirmed relationship         | Purchase is a high-level source; invoice reading is intended input; exact owners unresolved | Potential movement; invoice and receipt remain source facts    | Source, confirmation, and effective time unresolved                   | Movement/analysis consumers intended; no provider or write-back                              | Not implemented; no retention                  | Order/delivery/receipt/invoice/credit/return/payment distinctions, OCR, duplicates, discrepancies    |
| Manual `gaspillage` movement         | Confirmed high-level concept   | Mouvements conceptual scope; manual source                                                  | Potential movement                                             | Structured input intended; exact cause/time unresolved                | Restaurant operator intended; create/apply/correct permissions unresolved                    | Not implemented; no retention                  | Causes, evidence, units, lifecycle, correction, reversal, deletion                                   |
| Stock balance                        | `UNRESOLVED`                   | No canonical owner or source                                                                | Balance, not movement                                          | Physical/theoretical/available/materialized/derived status unresolved | Mutation, visibility, consumers, and reconciliation unresolved                               | No balance persistence or history              | Baseline, application, ordering, rebuild, snapshots, consistency, reconciliation                     |
| Weekly consumption                   | Confirmed analytical output    | Exact analytical owner unresolved; future source data unresolved                            | Derived value, not movement or balance                         | Weekly intent; formula/effective window unresolved                    | Restaurateur visibility intended; consumers/write-back unresolved                            | Not implemented; no retention                  | Actual/estimated meaning, purchases, losses, variances, cadence, missing data, units, confidence     |
| Coherence/problem signal             | Confirmed analytical objective | Owner and inputs unresolved                                                                 | Derived signal                                                 | Threshold/window/confidence unresolved                                | Visibility, notification, investigation, block, and write-back unresolved                    | Not implemented; no retention                  | Anomaly definition, expected range, incomplete data, shortage and waste semantics                    |
| Procurement forecast                 | Confirmed analytical objective | Owner unresolved; future movement/history inputs not defined                                | Derived forecast or recommendation unresolved                  | Horizon and algorithm unresolved                                      | Restaurateur visibility intended; purchasing/Fournisseurs consumer and write-back unresolved | Not implemented; no retention                  | History window, target, lead time, packages, orders, opening days, seasonality, confidence, override |
| Fixture movement row                 | Implementation evidence only   | Route-local fixture owner                                                                   | Displayed as movement                                          | String dates/times and signed quantity                                | Local filter/selection/details only                                                          | Eight in-memory rows; no retention             | No Product semantics may be inferred from fixture fields or values                                   |

## Ownership, authorization, and tenancy

- **Mouvements de stock:** this home owns reconciled Product Knowledge for the
  exact migration scope. No executable data owner exists for movement records,
  balances, source projections, analytics, or forecasts.
- **Inventaire:** remains repository-canonical for its completed migrated scope.
  The Mouvements direction does not define `quantité disponible`, counting,
  variance, validation, adjustment, or write-back and does not alter any
  `INV-01` through `INV-18` packet.
- **Fournisseurs and purchasing:** remain separate unmigrated scopes. Supplier
  identity, references, prices, terms, purchase recommendations, orders,
  delivery, receipt, invoice, and payment are not Mouvements-owned merely
  because they may be sources or consumers.
- **Fiches techniques, POS, and Production:** no approved movement source or
  integration exists. Recipe definitions and POS sales are not actual stock
  consumption; no local/cloud synchronization is permitted or inferred.
- **Locations/transfers:** fixture zones, destination, and transfer rows are
  demonstration strings. No storage-location, transfer, in-transit,
  multi-location, organization-wide stock, or cross-establishment contract
  exists.
- **Aujourd'hui and Tâches du jour:** may consume future approved source-owned
  actionable Stock facts only through separate contracts. A movement, shortage,
  waste signal, anomaly, or forecast does not create a task.
- **Establishment and tenancy:** the route inherits the generic authenticated
  organization/active-establishment shell. Fixtures are explicitly not
  establishment data. No movement-specific organization, establishment,
  location, or cross-establishment model exists.
- **Authorization:** the route has no navigation predicate or Mouvements-specific
  guard. Generic shell visibility does not approve read, create, draft, post,
  apply, correct, reverse, delete, export, transfer, value visibility, receipt,
  or system operations.

Any future tenant-owned cloud implementation must accept trusted server-derived
organization and active-establishment context, scope every operation, reject
resource-ID-only access, and fail closed. That architecture rule does not create
a Mouvements Product permission model.

## Movement, balance, and source-event boundary

A movement is a future approved record or projection explaining why stock
changed. A balance is a quantity at a point in time. A physical count is a
measured quantity. A source fact may be an Inventaire validation, purchase,
delivery, physical receipt, invoice, manual declaration, POS sale, production
event, waste declaration, or transfer only after its owning scope approves the
relationship.

Current authority does not define a movement entity, balance, baseline,
application order, recalculation, materialization, snapshots, rebuild,
reconciliation, or consistency model. It does not establish that balances are
derived from movements or that applying a movement updates a balance.

The Inventaire relationship is confirmed only at high level. No current
contract decides whether a count or variance creates a movement, when
validation occurs, whether every count or only a non-zero variance produces a
change, whether stock is overwritten or adjusted, or how idempotency,
duplicates, recovery, and write-back work.

The purchase relationship is confirmed only at high level, with invoice reading
intended as input. Order, supplier acknowledgment, dispatch, delivery, physical
receipt, discrepancy, invoice, credit note, return, payment, and movement remain
distinct. Invoice is not physical receipt, and no OCR or canonical-write path is
approved.

## Manual movement, time, sign, units, and lifecycle

Manual movement mainly for `gaspillage` is confirmed. The repository does not
approve a cause taxonomy covering loss, waste, breakage, expiry, staff or
production consumption, donation, theft suspicion, unexplained variance, or
correction. Unexplained variance is not automatically waste.

Fixture `date`, `time`, positive/negative quantities, types, statuses, units,
zones, references, values, notes, and users are executable presentation shape.
They do not define occurred-at, effective, recorded, created, posted, applied,
corrected, reversed, imported, invoice, receipt, or Inventaire time. They do not
approve a sign convention, entry/exit direction, resulting balance, base/count/
purchase/recipe unit, package conversion, decimals, rounding, or partial
packages.

No draft, pending, posted, validated, applied, rejected, cancelled, reversed,
superseded, or archived lifecycle is approved. Save, post, stock effect,
accounting validation, correction, reversal, and deletion remain separate. The
repository does not approve editing applied movement records, linked reversal,
partial reversal, hard deletion, admin repair, immutable event sourcing, or an
append-only ledger.

## Consumption, anomaly, and forecast boundary

Weekly consumption visibility, consumption-coherence/problem detection, and a
forecast figure for procurement needs are confirmed Product objectives. No
exact formula, data inputs, period, horizon, algorithm, owner, threshold,
confidence, alert, investigation, recommendation, override, persistence, or
write-back is approved or implemented.

The proposed `stock précédent + achats - stock actuel` formula, rolling
four-week average, coverage calculation, `À surveiller` interface, anomaly
thresholds, reliability indicator, weather/reservations/opening-days/
seasonality/events/traffic inputs, and movement-to-Fournisseurs split remain
`PROPOSED_NOT_APPROVED`.

Stock decrease is not automatically consumption. Known loss, waste, count
error, correction, return, transfer, production use, missing purchase data,
irregular counting cadence, and unexplained variance cannot be included or
excluded without an approved model. A forecast is not automatically a purchase
recommendation, order, supplier write-back, task, or automated action.

## Product, implementation, schema, review, and readiness

| Axis                   | Current status                                                                                                                                                                                                 |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Product direction      | Eight high-level directions are confirmed. Exact V1 and detailed behavior remain unresolved.                                                                                                                   |
| Implementation         | Fixture-backed Backoffice prototype with local presentation state and disabled operational actions.                                                                                                            |
| Executable shape       | Route-local TypeScript fixture types, fields, strings, and formatting only; no transport contract or canonical data model.                                                                                     |
| Persistence            | No Mouvements cloud schema, migration, repository, service, loader, action, or API.                                                                                                                            |
| Authorization          | Authenticated tenant shell only; no movement operation catalogue, role mapping, scoped resource predicate, or denial tests.                                                                                    |
| UI delivery            | No Mouvements page pack or Browser QA evidence.                                                                                                                                                                |
| Normative behavior     | No Mouvements ADR, normative main spec, active change, or archived change. ADR-005 controls only future Today/source ownership.                                                                                |
| Legal/accounting/HACCP | `UNVERIFIED`; current external review required before accounting, fiscal, valuation, receipt-evidence, waste-reporting, traceability, lot, expiry, food-safety, register, retention, or audit-evidence claims. |
| Privacy/security       | `UNVERIFIED`; actor history, values, supplier/source documents, roles, tenant isolation, exports, credentials, logging, and retention require review if implemented.                                           |
| Environment            | `UNVERIFIED`; route presence and tests do not prove a target environment.                                                                                                                                      |
| Readiness              | Capability `NOT_ASSESSED`; global Backoffice `NOT_READY`; no production authorization or deployment evidence.                                                                                                  |

## Grouped Human decisions required

| ID     | Decision packet                                                                                                                                                                                              | Current evidence and status                                                                | Required authority and non-inference                                                                                                                               |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| MDS-01 | Close exact V1 and page information architecture, including ledger versus pilotage, sections, default view, details, filters, and actions.                                                                   | Eight directions exist; fixture UI and assistant layouts have no Product authority.        | Human Product/UI authority. Do not promote the current table or proposed two-view layout.                                                                          |
| MDS-02 | Define the movement concept, canonical identity, standalone entity versus source-event projection or mixed model, source reference, owner, and mutation authority.                                           | High-level `+/-` concept only; fixture `StockMovement` is route-local.                     | Human Product, architecture, and data authority. Do not select event sourcing or a fixture schema.                                                                 |
| MDS-03 | Define stock balance ownership and semantics, baseline, movement application/order, materialization, recalculation, snapshots, rebuild, reconciliation, and consistency.                                     | No balance contract or persistence exists.                                                 | Human Product, architecture, and data authority. Do not assume movement application changes a balance or that balance derives from movements.                      |
| MDS-04 | Define the Inventaire trigger, count/variance relationship, validation, adjustment versus overwrite, actor, time, idempotency, recovery, and write-back.                                                     | Relationship confirmed; Inventaire packets remain unresolved and unchanged.                | Human Product for both scopes, architecture/data, authorization, and operations authority. Do not reopen Inventaire or automate the trigger.                       |
| MDS-05 | Define purchase/order/delivery/receipt/invoice/credit/return/payment/OCR distinctions, authoritative source, Human confirmation, duplicates, discrepancies, dates, and movement generation.                  | Purchase/invoice direction confirmed; no implementing capability exists.                   | Human Product for all owning scopes, provider, data, accounting/legal, privacy/security, and operations authority. Invoice is not receipt.                         |
| MDS-06 | Define manual movement current-V1 inclusion, supported causes, loss/waste distinctions, actor, note/evidence, and relationship to unexplained variance.                                                      | Manual movement mainly for `gaspillage` is confirmed; no taxonomy or mutation exists.      | Human Product, operations, data, authorization, and relevant legal/HACCP authority. Do not classify all variance as waste.                                         |
| MDS-07 | Define effective and recorded times, sign/direction, quantity, resulting balance, units, packages, conversion, decimals, rounding, and partial packages.                                                     | Fixture strings and signed values only.                                                    | Human Product, architecture/data, and operations authority. Do not infer business time, sign convention, or conversions from fixtures.                             |
| MDS-08 | Define save/post/apply/validate lifecycle plus editing, correction, reversal, cancellation, deletion, partial reversal, original visibility, idempotency, and admin repair.                                  | Disabled cancel/action controls and fixture statuses only.                                 | Human Product, data, authorization, operations, and relevant accounting/legal authority. Do not invent a state machine, immutable ledger, or hard-delete rule.     |
| MDS-09 | Define weekly consumption meaning, actual versus estimated status, formula, period, inputs, losses/corrections, irregular counts, missing data, units, confidence, owner, and persistence.                   | Objective confirmed; proposed formula unapproved.                                          | Human Product, data/analytics, and operations authority. Do not equate stock decrease with consumption.                                                            |
| MDS-10 | Define coherence/problem/anomaly semantics, expected ranges, incomplete data, waste/shortage signals, thresholds, severity, alert/block/notification/investigation, confidence, and owner.                   | Objective confirmed; proposed `À surveiller` UI and thresholds unapproved.                 | Human Product, data/analytics, UI, operations, privacy/security authority. Do not create alerts or tasks.                                                          |
| MDS-11 | Define procurement forecast versus recommendation, owner, output, horizon, algorithm, inputs, data quality, confidence, Human override, consumers, and write-back.                                           | Objective confirmed; exact model and owner unresolved.                                     | Human Product for Mouvements and purchasing/Fournisseurs, data/analytics, operations, and provider authority. Do not select an owner or advanced inputs.           |
| MDS-12 | Define locations and transfers, source/destination, same/intra/cross-establishment scope, request, dispatch, in-transit, receipt, discrepancy, partial receipt, cancellation, and shared-stock rules.        | Fixture zones/destination/transfer rows only.                                              | Human Product, tenancy, architecture/data, authorization, and operations authority. Do not invent transfer capability or organization-wide stock.                  |
| MDS-13 | Define Fournisseurs/purchasing ownership for supplier facts, recommendations, orders, receipts, prices, commercial terms, source references, consumers, and write-back.                                      | Boundary only; Fournisseurs remains unmigrated.                                            | Human Product for both scopes, architecture/data, authorization, provider, and operations authority. Do not migrate Fournisseurs or turn a forecast into an order. |
| MDS-14 | Define any Fiches techniques, POS, sales/refund, recipe, Production, actual-use, yield, or waste source projection.                                                                                          | No approved integration; POS inventory/cloud sync is explicitly unsupported.               | Human Product for each scope plus architecture/data and operations authority. Do not infer actual consumption or cloud/local synchronization.                      |
| MDS-15 | Define actors and movement-specific read/create/draft/post/apply/correct/reverse/delete/export/transfer/value/receipt permissions plus organization, establishment, location, and cross-establishment scope. | Generic authenticated shell only; navigation is unconditional.                             | Human Product and authorization/security/tenancy authority. Do not infer permissions from roles, route visibility, or fixtures.                                    |
| MDS-16 | Define movement/source/balance/history, audit, actor/time evidence, exports, archive/delete/restore, anonymization, retention, legal hold, and evidentiary status.                                           | No persistence, history, audit, or policy.                                                 | Human Product, data, legal/accounting/HACCP/privacy/security, and operations authority. Do not invent event sourcing, immutability, or retention.                  |
| MDS-17 | Define operational versus accounting/fiscal movement, valuation, receipt evidence, waste obligations, traceability, lot, expiry, HACCP, registers, retention, and audit evidence.                            | No accepted exact-scope authority or implementation.                                       | Current external qualified legal/accounting/HACCP/food-safety/privacy review plus Human Product authority. Do not create a compliance claim.                       |
| MDS-18 | Define UI delivery, accessibility/QA, environment enablement, deployment, operations, monitoring, downstream readiness, and production authorization.                                                        | Prototype-model tests only; no page pack, Browser QA, environment, or deployment evidence. | Human Product, UI, security/privacy, operations, and release authority. Do not infer readiness from code, tests, or documentation.                                 |

## Reconciliation accounting and legacy safeguards

The counting unit is one material claim group in this reconciliation ledger.
The eight Human directions are counted individually; implementation evidence,
assistant proposal families, and grouped Human decision packets are counted
separately.

| Disposition               | Count | Counted material                                                                                                                                                                                                                     |
| ------------------------- | ----: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `CONFIRMED`               |     4 | Exact Mouvements-only migration scope; movement-versus-balance separation; independent Stock-scope authority; cloud Mouvements versus restaurant-local POS separation                                                                |
| `IMPLEMENTED`             |     2 | Canonical route/navigation/authenticated shell; fixture prototype/local interactions/tests                                                                                                                                           |
| `DECIDED_NOT_IMPLEMENTED` |     8 | The eight current Human directions listed above                                                                                                                                                                                      |
| `PROPOSED`                |     7 | Pilotage/history/table/detail UI; anomaly/`À surveiller`/reliability; consumption/rolling-average/coverage formulas; loss-entry UI; invoice/OCR confirmation flow; Mouvements/Fournisseurs ownership split; advanced forecast inputs |
| `UNRESOLVED`              |    18 | `MDS-01` through `MDS-18`                                                                                                                                                                                                            |
| `CONFLICT`                |     0 | Four legacy candidates are direction-versus-exact-contract or objective-versus-owner/formula distinctions, not disagreements between current authorities                                                                             |
| `OBSOLETE`                |     0 | No superseded Human Product decision was established                                                                                                                                                                                 |

The four legacy conflict candidates remain safely classified:

1. Purchase/invoice input is confirmed; invoice versus physical receipt and the
   exact source-event contract remain `MDS-05`.
2. Inventaire-originated change is confirmed; automatic generation and its
   trigger remain `MDS-04`.
3. Weekly consumption is confirmed as an objective; unexplained stock decrease
   is not consumption and the formula remains `MDS-09`.
4. Procurement forecasting is confirmed as an objective; owner, algorithm, and
   write-back remain `MDS-11` and `MDS-13`.

## Explicit non-inferences

Do not infer that:

- the route-local `StockMovement` type or fixture strings are a canonical
  movement entity, enum, lifecycle, cause list, schema, or API;
- a movement is a stock balance or that balances are derived from movements;
- a physical count or variance is a movement before an approved contract;
- Inventaire automatically creates, applies, or reverses a movement;
- invoice, order, delivery, physical receipt, payment, and movement are the same
  event;
- invoice/OCR/provider output may create canonical movement or stock data;
- fixture signs define entry/exit conventions or resulting stock;
- technical fixture dates represent business-effective time;
- `Validé` means posted, applied, accounting-validated, or immutable;
- cancellation means correction, reversal, deletion, or balance restoration;
- unexplained variance or every stock decrease is consumption or `gaspillage`;
- the proposed consumption, average, coverage, anomaly, or forecast formula is
  approved;
- a forecast is an order, purchasing recommendation, supplier write-back, task,
  or automated action;
- fixture transfer, POS, supplier, delivery-note, value, or waste labels approve
  those Product capabilities or integrations;
- POS sales, recipe definitions, or Production facts create cloud movements;
- local POS data synchronizes with cloud stock;
- shared organization means shared stock or cross-establishment transfer;
- authenticated route visibility grants a movement operation;
- fixture tests establish persistence, source correctness, authorization,
  tenant isolation, accounting/legal/HACCP validity, environment enablement, or
  production readiness.

## Discovery path and fresh-agent test input

A repository-only agent should navigate:

1. [`docs/README.md`](../../README.md) and
   [`PRODUCT_KNOWLEDGE.md`](../../PRODUCT_KNOWLEDGE.md);
2. [`MODULE_REGISTRY.md`](../../MODULE_REGISTRY.md) and this home;
3. the completed [Inventaire home](../inventory/README.md) only for its protected
   source/ownership boundary;
4. [ADR-005](../../decisions/ADR-005-today-operational-steering.md) and the
   [Today home](../today/README.md) only for future source/consumer ownership;
5. the current [route](<../../../apps/backoffice/src/app/(authenticated)/stock/mouvements/page.tsx>),
   fixture model/data, components, prototype notice, navigation, authenticated
   layout, and focused tests;
6. the separate Fournisseurs, Fiches techniques, purchasing, POS, Production,
   and local [POS](../../products/pos/README.md) evidence only for boundaries;
7. [`CURRENT_STATE.md`](../../CURRENT_STATE.md), the
   [Authority Model](../../AUTHORITY_MODEL.md),
   [Tenancy](../../architecture/TENANCY.md), and
   [Production Readiness](../../operations/PRODUCTION_READINESS.md).

Without Page Chat history or the legacy extract, a fresh agent must be able to
state the exact migration scope, eight current directions, unresolved V1,
fixture-prototype implementation, movement/balance/source-event distinctions,
Inventaire and purchase/invoice boundaries, manual `gaspillage` direction,
time/sign/unit/lifecycle limitations, consumption/anomaly/forecast objectives,
all 18 decision packets, independent ownership boundaries, and separate
legal/accounting/HACCP, privacy/security, environment, and readiness state. The
repository-only fresh-agent report recorded `PASS` for that discovery on
2026-09-29.

## Status

Repository reconciliation and bounded canonicalization: `COMPLETE` on
2026-09-29.

Fresh-agent acceptance: `PASS` on 2026-09-29, recorded from
`MOUVEMENTS_DE_STOCK_FRESH_AGENT_ACCEPTANCE_REPORT_PASS.md` with SHA-256
`ece9684589b25a83cd3d9db34ad6738242f3e3f3e59ba34f637aeace511998eb`.

Repository authority for the exact migrated Mouvements de stock scope:
`CANONICAL`.

Mouvements de stock Page Chat role for that exact scope:
`LEGACY EVIDENCE ONLY`.

Mouvements de stock knowledge migration: `COMPLETE` on 2026-09-29.
