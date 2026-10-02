# YUTA Inventaire Product Knowledge

Status: MIGRATION COMPLETE — REPOSITORY CANONICAL

Visibility: Engineering

Owner: YUTA product and engineering

Last updated: 2026-09-29

## Purpose and bounded scope

Inventaire is the future Backoffice capability through which a restaurateur can
work with products concerned by the restaurant's menu activity. Its confirmed
high-level direction covers visible HT and TTC prices, available quantity,
quantity to buy, supplier context, an almost-weekly practical workflow, a
printable supplier purchase list, price maintenance, and contribution of
updated prices to Fiches techniques calculations.

This home is the canonical repository entry point for the reconciled Inventaire
Product Knowledge scope. It keeps Product direction, the current fixture
prototype, executable presentation shape, operational quantity semantics,
authorization, legal/accounting/HACCP status, privacy/security, and readiness
separate. It does not approve a closed V1, article catalogue, physical-count or
inventory-session lifecycle, theoretical-stock engine, movement contract,
purchase formula, valuation model, unit conversion, supplier master, purchasing
workflow, provider integration, OCR, POS depletion, recipe costing, or
production use.

Mouvements de stock, Fournisseurs, Fiches techniques, Carte & menus, POS,
purchasing/orders, invoices/OCR, Conformité, Aujourd'hui, Tâches du jour,
Establishment, and Identity & Access appear only to establish ownership or
exclusion boundaries. Their Product Truth is not migrated here. The `Stock`
navigation group is not one indivisible Product authority.

## Knowledge migration state

The Human-supplied `INVENTAIRE_LEGACY_KNOWLEDGE_EXTRACT.md` with SHA-256
`829cb5c0d1ccef68c2be535123c2a46f2ca3cd7aa821c6eb458828b25bbd874c`
was used only as legacy evidence for the 2026-09-29 reconciliation. The complete
artifact and its final control block were verified before repository
classification began. Export-only transport markers were not copied.

The extract was checked against question-specific current repository authority
and was not copied into this home. Repository reconciliation and bounded
canonicalization are complete.

The repository-only fresh-agent acceptance report
`INVENTAIRE_FRESH_AGENT_ACCEPTANCE_REPORT_PASS.md`, SHA-256
`33f2492e04ed39173ef25718e15ee60c7ea15dbc7d78d70a58e539573d07403f`,
recorded `PASS` with zero material knowledge gaps and zero genuine conflicts.
The test used no Page Chat history, legacy extract, reconciliation report, or
external research. It also confirmed that Salariés, Planning, Pointage,
Formalités, and Tâches du jour were not reopened; Mouvements de stock,
Fournisseurs, Fiches techniques, and every other Page Chat scope were not
migrated.

Following that PASS and the Human-authorized scope-bound cutover on 2026-09-29,
repository knowledge is canonical for the exact Inventaire scope in this home.
The Inventaire Page Chat is `LEGACY EVIDENCE ONLY` for that scope. It remains
available for historical and forensic lookup, but it is no longer current
Product authority. Control Tower retains shaping, genuine-conflict resolution,
Human Decision routing, cross-module reasoning, and governance coordination;
coding agents retain repository discovery, analysis, and separately authorized
execution and verification.

The completed Salariés, Planning, Pointage, Formalités, and Tâches du jour
migrations remain unchanged. Their Page Chats remain `LEGACY EVIDENCE ONLY` for
their respective migrated scopes, and their decision packets were not reopened.

## Confirmed current Product direction

The following ten Human directions are confirmed at high level. The current
fixture prototype does not provide the corresponding real restaurant
capability, so each is `DECIDED_NOT_IMPLEMENTED` at capability level.

| Confirmed direction                     | Exact boundary                                                                                                                                                                                                    | Current repository state                                                                                  |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Products concerned by menu activity     | Preserve the exact Human wording `produits qu'il existe dans le menu`. Sold menu items, ingredients, purchased stock articles, drinks, consumables, recipe components, and catalogue ownership remain unresolved. | `DECIDED_NOT_IMPLEMENTED`; fixtures demonstrate candidate articles only.                                  |
| Price HT visible                        | A distinct HT price must be visible. Currency, source, tax basis, package/unit basis, effective date, history, and owner remain unresolved.                                                                       | `DECIDED_NOT_IMPLEMENTED`; the prototype exposes one display-only purchase-price string, not an HT field. |
| Price TTC visible                       | A distinct TTC price must be visible. Derivation versus storage and tax authority remain unresolved.                                                                                                              | `DECIDED_NOT_IMPLEMENTED`; no TTC field or calculation exists.                                            |
| Quantity available visible              | A quantity called `quantité disponible` must be visible. Physical, last-counted, theoretical, movement-derived, reserved, or manually maintained meaning is unresolved.                                           | `DECIDED_NOT_IMPLEMENTED`; fixture `stock` values are presentation data, not operational quantities.      |
| Quantity to buy visible                 | A purchase-need quantity must be visible. Manual versus derived meaning, formula, target, forecast, lead time, open orders, override, and rounding remain unresolved.                                             | `DECIDED_NOT_IMPLEMENTED`; no quantity-to-buy field or calculation exists.                                |
| Supplier context visible                | Supplier context must be visible for a product. Supplier master ownership, cardinality, preferred supplier, references, terms, and write-back remain unresolved.                                                  | `DECIDED_NOT_IMPLEMENTED`; fixture supplier strings do not provide a supplier capability.                 |
| Almost-weekly practical workflow        | The recurring operation must be practical, efficient, and easy to use. This is frequency and UX direction, not an approved scheduler, reminder, mandatory cycle, or session lifecycle.                            | `DECIDED_NOT_IMPLEMENTED`; no persistent recurring workflow exists.                                       |
| Printable supplier purchase list        | A supplier-oriented purchase list must be printable. Contents, grouping, format, history, authorization, and privacy remain unresolved.                                                                           | `DECIDED_NOT_IMPLEMENTED`; the generic export button is disabled and no list is produced.                 |
| Price maintenance                       | Prices must be updateable. Manual, invoice, import, provider, delivery-note, OCR, validation, effective-date, rollback, and history behavior remain unresolved.                                                   | `DECIDED_NOT_IMPLEMENTED`; edit actions are disabled and no mutation exists.                              |
| Price contribution to Fiches techniques | Updated prices are intended to contribute to Fiches techniques calculations. Mapping, cost basis, conversion, snapshot/live behavior, recalculation, permissions, and write-back remain unresolved.               | `DECIDED_NOT_IMPLEMENTED`; the Fiche technique detail tab is disabled and no contract exists.             |

The confirmed actor wording is `restaurateur`. It does not define an executable
role mapping or grant `OWNER`, `MANAGER`, or `STAFF` permissions.

## Confirmed long-term direction

YUTA should simplify online supplier ordering where possible. METRO appeared
only as an example. This is `LONG_TERM_DIRECTION`, not current V1, provider
approval, API capability, cart creation, order submission, payment,
acknowledgement, receipt, invoice handling, or automatic ordering.

Current requirement: `NO`.

No provider research was performed. No current repository authority establishes
a METRO or other supplier integration.

## Current implementation

| Evidence area                 | Current repository state                                                                                                                                                                                                                                                                                                    | What it establishes                                                                                                       |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Route                         | [`/stock/inventaire`](<../../../apps/backoffice/src/app/(authenticated)/stock/inventaire/page.tsx>) renders `InventoryPage`.                                                                                                                                                                                                | The current Backoffice route exists.                                                                                      |
| Navigation                    | [`backoffice-navigation.ts`](../../../apps/backoffice/src/components/backoffice/backoffice-navigation.ts) lists Inventaire inside the `Stock` navigation group without a capability predicate.                                                                                                                              | Navigation presence only; the group does not combine Product authority.                                                   |
| Authenticated shell           | The parent [`(authenticated)` layout](<../../../apps/backoffice/src/app/(authenticated)/layout.tsx>) requires a server-resolved user session and active tenant context.                                                                                                                                                     | Generic authenticated shell access only; no Inventaire-specific role or operation policy exists.                          |
| Prototype disclosure          | [`PrototypeBackofficeNotice`](../../../apps/backoffice/src/components/backoffice/prototype-backoffice-notice.tsx) says displayed data is not establishment data and creation, modification, and export remain unavailable until persistence exists.                                                                         | The surface is explicitly a demonstration prototype.                                                                      |
| Executable presentation shape | [`inventory-model.ts`](<../../../apps/backoffice/src/app/(authenticated)/stock/inventaire/inventory-model.ts>) defines route-local fields and `Disponible`, `Stock faible`, and `Rupture` status strings.                                                                                                                   | UI fixture shape only; it is not a Product-approved contract, schema, catalogue, or stock model.                          |
| Fixture data                  | [`inventory-fixtures.ts`](<../../../apps/backoffice/src/app/(authenticated)/stock/inventaire/inventory-fixtures.ts>) contains eight fictional entries with stock, thresholds, value, supplier, packaging, and purchase-price strings.                                                                                       | Demonstration content only; no tenant, freshness, legal, valuation, or operational truth.                                 |
| Local interactions            | Client state supports fixture filtering, search, row selection, checkboxes, and details. Non-`Stock actuel` tabs return no rows.                                                                                                                                                                                            | Local presentation behavior only; checkboxes are row selection, not physical counting or validation.                      |
| Disabled operations           | New inventory, export, stock adjustment, article edit, stock tracking, movement, and Fiche technique controls are disabled.                                                                                                                                                                                                 | No count, export, adjustment, mutation, movement, or Fiches techniques integration is implemented.                        |
| Persistence and boundaries    | No Inventaire-specific contract, cloud schema/migration, repository, server loader/action, API, or permission exists.                                                                                                                                                                                                       | No canonical article, quantity, price, supplier, count, movement, or order state exists.                                  |
| Tests                         | [`inventory-model.test.ts`](../../../apps/backoffice/test/inventory-model.test.ts), [`stock-prototype-table-footer.test.tsx`](../../../apps/backoffice/test/stock-prototype-table-footer.test.tsx), and the navigation test cover fixture filtering/formatting/selection, truthful fixture counts, and navigation presence. | Focused prototype-model evidence only; no persistence, authorization, tenant-denial, integration, or Browser QA evidence. |
| UI and normative knowledge    | No Inventaire page pack, Inventaire ADR, normative OpenSpec main spec, active change, or archived Inventaire change exists.                                                                                                                                                                                                 | No detailed approved UI delivery or behavioral contract.                                                                  |

The implementation classification is `PROTOTYPE`. The surface is not connected
to cloud persistence and does not implement an operational inventory system.
Fixture fields, strings, thresholds, values, tabs, locations, supplier names,
and statuses are implementation evidence only.

## Capability and state matrix

| Capability                           | Product status                                                                                                             | Implementation                                 | Legal/accounting/HACCP                                       | Privacy/security                              | Environment   | Readiness / production authorization        | Owner, actor, and scope                                                                                                                    | Explicit exclusions and unresolved boundary                                           |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- | ------------------------------------------------------------ | --------------------------------------------- | ------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------- |
| Inventaire product view              | Ten bounded directions approved; exact V1 unresolved                                                                       | `PROTOTYPE`; fictional route-local data        | `UNVERIFIED`; external review required for regulated meaning | `UNVERIFIED`                                  | `UNVERIFIED`  | `NOT_ASSESSED`; no production authorization | Inventaire Product Knowledge owns the reconciled scope; data owner absent; actor wording is restaurateur; fixture data has no tenant scope | No canonical catalogue, price, quantity, supplier, unit, or operation model           |
| Almost-weekly operational workflow   | Approved frequency and UX direction                                                                                        | `NOT_STARTED` as a persistent workflow         | `NOT_APPLICABLE` to frequency alone                          | `UNVERIFIED` for future actor/data handling   | `NOT_ENABLED` | `NOT_ASSESSED`; no production authorization | Inventaire conceptual scope; executable actors and establishment/location scope unresolved                                                 | No scheduler, reminder, mandatory cycle, session, save/resume, or validation          |
| Printable supplier purchase list     | `APPROVED` at high level                                                                                                   | `NOT_STARTED`; disabled generic export control | `UNVERIFIED`; no evidentiary or order status                 | `UNVERIFIED`                                  | `NOT_ENABLED` | `NOT_ASSESSED`; no production authorization | Inventaire owns the stated need; supplier/order ownership unresolved                                                                       | No approved PDF, spreadsheet, browser-print, grouping, or submission semantics        |
| Price maintenance                    | `APPROVED` at high level                                                                                                   | `NOT_STARTED`                                  | `UNVERIFIED`; no accounting or valuation claim               | `UNVERIFIED`                                  | `NOT_ENABLED` | `NOT_ASSESSED`; no production authorization | Canonical price owner, actor, scope, validation, and history unresolved                                                                    | No import, OCR, provider update, effective-date, or rollback contract                 |
| Fiches techniques price contribution | Relationship approved at high level                                                                                        | `NOT_STARTED`                                  | `UNVERIFIED`; cost basis absent                              | `UNVERIFIED`                                  | `NOT_ENABLED` | `NOT_ASSESSED`; no production authorization | Inventaire/Fiches techniques ownership and tenant projection unresolved                                                                    | No mapping, unit conversion, cost basis, recalculation, or write-back                 |
| Online supplier ordering             | `LONG_TERM_DIRECTION`                                                                                                      | `NOT_STARTED`                                  | `REQUIRES_CURRENT_EXTERNAL_REVIEW` if pursued                | `REQUIRES_CURRENT_EXTERNAL_REVIEW` if pursued | `NOT_ENABLED` | `NOT_ASSESSED`; no production authorization | Owner, actors, provider, credentials, and order authority unresolved                                                                       | No provider contract, cart, submission, payment, acknowledgement, receipt, or invoice |
| Future Today aggregation             | `APPROVED` as a future source-owned information family by [ADR-005](../../decisions/ADR-005-today-operational-steering.md) | `NOT_STARTED`                                  | Inherits future source review; no current claim              | `UNVERIFIED`                                  | `NOT_ENABLED` | `NOT_ASSESSED`; no production authorization | Inventaire or other approved Stock source retains ownership; Today is a consumer                                                           | No current feed, alert semantics, permission bypass, mutation, or task generation     |

Backoffice is globally `NOT_READY`. Documentation, prototype tests, or an
enabled route does not grant production authorization.

## Inventory concept matrix

| Concept                            | Product status                                   | Owner and source                                                        | Shape, unit, and time                                                                             | Mutation, visibility, consumers, and write-back                                             | Implementation / retention                                | Unresolved questions                                                                                          |
| ---------------------------------- | ------------------------------------------------ | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Product concerned by menu activity | Confirmed direction; exact semantics unresolved  | Canonical catalogue owner absent; Human wording is authoritative        | Structured/derived status, unit, and current/historical meaning unresolved                        | Restaurateur visibility directional; mutation and downstream rights unresolved              | Fixture `InventoryItem` only; no persistence or retention | Sold item, ingredient, purchased item, drink, consumable, recipe component, combined catalogue, or projection |
| Price HT                           | Confirmed visible information                    | Canonical price owner/source absent                                     | Currency, stored/derived, package/unit, validity, and history unresolved                          | Update direction confirmed; actor, consumers, and write-back unresolved                     | No distinct field or persistence                          | Tax source, effective date, promotion, validation, supplier and establishment scope                           |
| Price TTC                          | Confirmed visible information                    | Canonical price owner/source absent                                     | Currency expected; stored versus HT-derived unresolved                                            | Visibility directional; mutation and write-back unresolved                                  | No distinct field or persistence                          | Tax authority and relationship to HT                                                                          |
| Quantité disponible                | Confirmed visible information                    | Canonical operational quantity owner/source absent                      | Physical/theoretical/last-count/manual/reserved meaning, unit, freshness, and location unresolved | Restaurateur visibility directional; mutation and consumers unresolved                      | Fixture `stock` number only; no persistence or history    | Calculation, timestamp, validation, scope, and relation to movements/counts                                   |
| Quantité à acheter                 | Confirmed visible information                    | Owner and source absent                                                 | Manual/derived status, unit, formula, and time basis unresolved                                   | Restaurateur visibility directional; purchase-list consumer intended; write-back unresolved | No field, calculation, persistence, or retention          | Target, threshold, forecast, open orders, lead time, rounding, override                                       |
| Supplier context                   | Confirmed visible information                    | Supplier master owner unresolved; Fournisseurs remains a separate scope | Reference structure and history unresolved                                                        | Inventaire may display context; mutation and supplier write-back unapproved                 | Fixture string only; no supplier repository               | Cardinality, preferred supplier, article reference, price, package, terms, lead time                          |
| Price used by Fiches techniques    | Confirmed relationship; exact concept unresolved | Mapping and price/cost owners unresolved                                | HT/TTC/other basis, current/snapshot, package/unit conversion unresolved                          | Fiches techniques is intended consumer; trigger and all write-back unapproved               | No contract or implementation; retention unresolved       | Latest/average/standard cost, refresh, permissions, tenant scope                                              |
| Stock target                       | `PROPOSED_NOT_APPROVED`                          | Assistant proposal only                                                 | Proposed structured current configuration                                                         | Proposed purchase-need consumer; no mutation authority                                      | Not implemented                                           | Entire concept requires Human approval                                                                        |
| Price history                      | `PROPOSED_NOT_APPROVED`                          | Assistant proposal only                                                 | Proposed historical price/source/package records                                                  | Visibility and consumers unapproved                                                         | Not implemented; no retention policy                      | Product need, owner, effective dates, correction, audit, retention                                            |

No inventory session, count line, theoretical-stock balance, variance record,
adjustment, movement, purchase order, invoice, OCR candidate, or recipe-cost
entity is approved or implemented by this scope.

## Ownership, authorization, and tenancy

- **Inventaire:** this home owns reconciled Product Knowledge for the exact
  migration scope. No executable data owner exists for articles, quantities,
  counts, prices, or purchase needs.
- **Mouvements de stock:** remains a separate unmigrated scope and current
  fixture prototype. Inventaire has no movement creation, adjustment, reversal,
  or stock-recalculation contract.
- **Fournisseurs:** remains a separate unmigrated scope and current fixture
  prototype. Supplier visibility does not make Inventaire the supplier master or
  grant supplier mutation.
- **Fiches techniques:** remains a separate unmigrated scope and planned
  placeholder. The confirmed price relationship defines no mapping, cost basis,
  conversion, recalculation, or write-back.
- **Carte & menus:** no approved catalogue projection exists. Human wording
  about menu activity does not make the menu route the Inventaire catalogue.
- **POS:** the restaurant-local POS catalogue is separate local data behind Site
  Agent and `packages/db-pos`; its page pack explicitly excludes stock/inventory.
  No cloud/POS sync, depletion, recipe-use, production, or waste projection is
  approved.
- **Purchasing/orders:** purchase need and a printable list do not establish an
  order, submission, payment, receipt, or invoice owner.
- **Invoices/OCR:** no upload, extraction, matching, validation, canonical write,
  accounting handoff, provider, privacy, or retention contract exists.
- **Aujourd'hui:** may later aggregate actionable source-owned Inventaire facts
  under ADR-005. There is no current feed, link, mutation, or alert contract.
- **Tâches du jour:** owns its separate migrated task scope. Almost-weekly work,
  low stock, counting, or purchasing does not create a task or generation
  contract.
- **Establishment and tenancy:** the route inherits a trusted authenticated
  organization/active-establishment shell. The displayed fixtures are explicitly
  not establishment data. No organization, establishment, storage-location,
  cross-establishment visibility, transfer, or segregation model exists.
- **Authorization:** the route has no navigation predicate or Inventaire-specific
  guard. Generic shell visibility does not approve read, count, save, review,
  validate, adjust, cancel, export, price-edit, threshold, or ordering rights for
  `OWNER`, `MANAGER`, `STAFF`, a counter, or a service actor.

Any future tenant-owned cloud implementation must accept trusted server-derived
organization and active-establishment context, scope every operation, reject
resource-ID-only access, and fail closed. That architecture rule does not create
an Inventaire Product permission model.

## Article, quantity, count, and movement boundary

The confirmed Product direction establishes that products concerned by menu
activity and a quantity called `quantité disponible` must be visible. It does
not determine catalogue identity or whether the quantity is physical,
last-counted, theoretical, movement-derived, manually maintained, or adjusted
for reservations.

The prototype's `stock`, `minimum`, `maximum`, `value`, status, locations, tabs,
and movement labels are fictional executable presentation shape. They do not
approve a physical count, count session, zero-versus-not-counted rule,
save/resume, review/validation lifecycle, theoretical balance, baseline,
variance, cause, adjustment, reversal, or audit model.

No count may overwrite a theoretical balance and no variance cause may be
inferred without an approved future contract. Mouvements de stock remains the
separate scope for any future movement truth.

## Purchase need, supplier, and ordering boundary

`Quantité à acheter` and supplier context are confirmed high-level information.
The repository establishes no manual or derived formula, minimum/target/safety
stock, consumption history, forecast, supplier lead time, open-order deduction,
package rounding, or Human override. The assistant-proposed
`max(0, stock cible - quantité disponible)` formula is not Product Truth.

A printable supplier purchase list is approved at high level. One-list versus
per-supplier grouping, fields, sorting, quantities/units, prices, notes,
branding, browser print, PDF, spreadsheet, history, privacy, and permissions are
unresolved. A list or export is not an order or provider acknowledgement.

Online supplier ordering remains long-term direction. No link, export, cart,
API, credential, submission, payment, acknowledgement, error/retry, receipt,
invoice, or provider capability is approved or implemented.

## Price, value, and Fiches techniques boundary

HT and TTC visibility and price maintenance are confirmed. The repository does
not establish canonical price ownership, currency, source, stored/derived
relationship, VAT source, package/unit basis, effective date, promotions,
validation, history, correction, supplier scope, or establishment scope.

The prototype's `purchasePrice` string and calculated-looking `value` fixtures
do not establish HT, TTC, inventory valuation, accounting stock, food cost, or
price history. The hard-coded estimated-value summary is demonstration text.

Updated prices are intended to contribute to Fiches techniques calculations.
The exact ingredient mapping, HT/TTC/other cost basis, unit conversion,
latest/average/standard cost, snapshot/live semantics, trigger, refresh,
permissions, and write-back remain unresolved. No automatic recipe-cost
recalculation is approved.

## Product, implementation, schema, review, and readiness

| Axis                   | Current status                                                                                                                                                       |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Product direction      | Ten high-level directions plus online-ordering long-term direction are confirmed. Exact V1 and detailed behavior remain unresolved.                                  |
| Implementation         | Fixture-backed Backoffice prototype with local presentation state and disabled operational actions.                                                                  |
| Executable shape       | Route-local TypeScript fixture types and strings only; no transport contract or canonical data model.                                                                |
| Persistence            | No Inventaire cloud schema, migration, repository, service, loader, action, or API.                                                                                  |
| Authorization          | Authenticated tenant shell only; no Inventaire operation catalogue, role mapping, or denial tests.                                                                   |
| UI delivery            | No Inventaire page pack or Browser QA evidence.                                                                                                                      |
| Normative behavior     | No Inventaire ADR, normative main spec, active change, or archived change. ADR-005 controls only future Today/source ownership.                                      |
| Legal/accounting/HACCP | `UNVERIFIED`; current external review required before regulated, evidentiary, fiscal, valuation, traceability, food-safety, or retention claims.                     |
| Privacy/security       | `UNVERIFIED`; price visibility, supplier sensitivity, roles, tenant isolation, credentials, external ordering, logging, and retention require review if implemented. |
| Environment            | `UNVERIFIED`; route presence and tests do not prove a target environment.                                                                                            |
| Readiness              | Capability `NOT_ASSESSED`; global Backoffice `NOT_READY`; no production authorization or deployment evidence.                                                        |

## Grouped Human decisions required

| ID     | Decision packet                                                                                                                                                                                          | Current evidence and status                                                                       | Required authority and non-inference                                                                                                            |
| ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| INV-01 | Close current V1 and define product/article/catalogue semantics and canonical owner.                                                                                                                     | Ten directions exist; exact V1 and `produits du menu` meaning remain unresolved.                  | Human Product, architecture, and data authority. Do not rewrite the scope as ingredients or purchased articles.                                 |
| INV-02 | Define `quantité disponible`, owner, source, freshness, timestamp, unit, scope, validation, and history.                                                                                                 | Confirmed label; fixture `stock` has no authority.                                                | Human Product/data authority. Do not select physical, theoretical, last count, or real-time meaning.                                            |
| INV-03 | Decide physical-count and inventory-session scope, actors, zero/not-counted, save/resume, completion, review, validation, cancellation, reopen, and recount.                                             | No approved or implemented lifecycle.                                                             | Human Product, operations, authorization, and data authority. Do not derive it from disabled tabs/buttons.                                      |
| INV-04 | Decide theoretical stock, baseline, event inputs, Mouvements ownership, recalculation, adjustment, and reversal contract.                                                                                | No cloud balance or movement contract; Mouvements is a separate prototype scope.                  | Human Product for both scopes plus architecture/data authority. Do not overwrite a balance from a count.                                        |
| INV-05 | Decide variance, tolerance, cause, review, validation, resulting adjustment, reversal, and audit.                                                                                                        | Prototype labels only.                                                                            | Human Product, data, operations, and relevant legal authority. Do not infer loss, theft, waste, expiry, or count error.                         |
| INV-06 | Define `quantité à acheter`, manual/derived behavior, formula, thresholds/targets, forecast, lead time, open orders, override, and rounding.                                                             | Confirmed output; no formula or field.                                                            | Human Product/data authority. Do not use the proposed stock-target formula.                                                                     |
| INV-07 | Define base/count/purchase/recipe units, packaging, pack size, net/gross quantity, conversion, decimals, rounding, and partial packages.                                                                 | Fixture free-text units and packaging only.                                                       | Human Product/data authority. Do not infer unit support from fixture numbers.                                                                   |
| INV-08 | Define Inventaire/Fournisseurs ownership, references, cardinality, preferred supplier, price/package/terms, visibility, mutation, and write-back.                                                        | Supplier visibility confirmed; Fournisseurs remains independent.                                  | Human Product for both scopes, architecture, data, and authorization authority. Do not make Inventaire supplier master.                         |
| INV-09 | Define HT/TTC ownership, source, derivation, tax basis, currency, package/unit basis, validity, promotion, maintenance, validation, history, and rollback.                                               | HT/TTC/update directions confirmed; no distinct fields or mutations.                              | Human Product, accounting/tax, data, privacy/security, and authorization authority. Do not infer valuation.                                     |
| INV-10 | Define article/ingredient mapping and the exact Fiches techniques price projection, cost basis, conversion, snapshot/live rule, recalculation, permissions, and write-back.                              | Relationship confirmed; no contract.                                                              | Human Product for both scopes, architecture/data, and accounting authority. Do not invent automatic recipe-cost refresh.                        |
| INV-11 | Define purchase-list contents, supplier grouping, quantities/units/prices, print/export format, history, privacy, ordering boundary, provider role, and submission authority.                            | Printable list approved; online ordering long term; export disabled.                              | Human Product, Fournisseurs/purchasing owner, provider, legal/privacy/security, and operations authority. Do not equate list/export with order. |
| INV-12 | Decide any Carte/menu, cloud catalogue, local POS, sales, recipe-use, production, or waste projection.                                                                                                   | No current projection; POS inventory is explicitly unsupported and local persistence is separate. | Human Product for each scope plus architecture/data authority. Do not create POS depletion or cloud/local sync.                                 |
| INV-13 | Define organization, establishment, storage locations, multi-location, shared stock, cross-establishment access, transfer, and segregation.                                                              | Generic active-tenant shell; fixtures are not establishment data.                                 | Human Product, tenancy, architecture/data, and security authority. Do not infer organization-wide stock or transfers.                           |
| INV-14 | Define every Inventaire actor and permission for read, article manage, count, draft, review, validate, adjust, cancel, export, price visibility/edit, threshold, and order actions.                      | No Inventaire permission or route guard beyond authentication.                                    | Human Product and authorization/security authority. Do not infer permissions from navigation or other Stock pages.                              |
| INV-15 | Decide invoice/import/OCR scope, provider, upload, extraction, matching, candidates, Human reconciliation, confirmation, canonical write, receipt, accounting handoff, privacy, security, and retention. | Assistant proposal only; no implementation.                                                       | Human Product, provider, accounting, privacy/security, data, and operations authority. No silent canonical write.                               |
| INV-16 | Define operational history, snapshots, count/variance/adjustment/price/article/export audit, actor/time, archive/delete/restore, retention, legal hold, and evidence status.                             | No persistence or policy.                                                                         | Human Product, data, legal/accounting/privacy/security, and operations authority. Do not invent event sourcing or legal evidence.               |
| INV-17 | Define operational versus fiscal/year-end inventory, accounting stock/valuation, traceability, lot, expiry, HACCP, food-safety records, mandatory registers, and retention.                              | No current accepted exact-scope evidence.                                                         | Current external legal/accounting/HACCP/food-safety review plus Human Product authority. Do not create a compliance claim.                      |
| INV-18 | Decide UI delivery, accessibility/QA, environment enablement, deployment, operations, provider readiness, and production authorization.                                                                  | Prototype-model tests only; no page pack, Browser QA, environment, or deployment evidence.        | Human Product, UI, security/privacy, operations, and release authority. Do not infer readiness from repository checks.                          |

## Reconciliation accounting and legacy safeguards

The counting unit is one material claim group in this reconciliation ledger.
The ten Human directions are counted individually; implementation evidence,
assistant proposal families, and grouped Human decision packets are counted
separately.

| Disposition               | Count | Counted material                                                                                                                                                                                                                                      |
| ------------------------- | ----: | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CONFIRMED`               |     4 | Exact migration scope; online-ordering long-term direction; future Today source/consumer boundary; cloud Inventaire versus restaurant-local POS separation                                                                                            |
| `IMPLEMENTED`             |     2 | Canonical route/navigation/authenticated shell; fixture prototype/local interactions/tests                                                                                                                                                            |
| `DECIDED_NOT_IMPLEMENTED` |    10 | The ten current Human directions listed above                                                                                                                                                                                                         |
| `PROPOSED`                |     6 | Article/domain replacement; normalized units/cost; structured count workflow/location/mobile/last-count; target/packaging/grouping/export; provider reference/METRO integration; invoice/OCR/history/automatic recipe-cost and assistant module split |
| `UNRESOLVED`              |    18 | `INV-01` through `INV-18`                                                                                                                                                                                                                             |
| `CONFLICT`                |     0 | Four legacy candidates are approved-direction versus unapproved-proposal or owner/consumer distinctions, not disagreements between current authorities                                                                                                |
| `OBSOLETE`                |     0 | No superseded Human Product decision was established                                                                                                                                                                                                  |

The four legacy conflict candidates remain safely classified:

1. Human `produits du menu` wording has authority; raw-material replacement is
   an unapproved proposal and exact catalogue semantics remain `INV-01`.
2. Human `quantité disponible` wording has authority; `dernier comptage` is an
   unapproved proposal and exact semantics remain `INV-02`.
3. Price contribution to Fiches techniques is confirmed; normalized
   supplier-derived cost is unapproved and the contract remains `INV-10`.
4. Printable-list and online-ordering direction does not conflict with separate
   purchasing ownership; exact boundaries remain `INV-11`.

## Explicit non-inferences

Do not infer that:

- a menu item is a stock article or recipe ingredient;
- the route-local `InventoryItem` type is a Product-approved catalogue;
- `stock` fixtures represent physical, theoretical, current, or last-counted
  quantities;
- a physical count, session, theoretical balance, variance, adjustment, or
  movement lifecycle exists;
- minimum/maximum fixtures approve a target-stock purchase formula;
- fixture units, packages, locations, statuses, suppliers, values, or prices are
  canonical;
- supplier visibility grants supplier mutation or master-data ownership;
- an export or printable list is an order, submission, acknowledgement, receipt,
  invoice, synchronization, or evidence;
- METRO is an approved provider or integration;
- invoices, imports, or OCR may update canonical prices;
- current prices are inventory valuation or canonical recipe cost;
- Fiches techniques may mutate Inventaire or recalculate automatically;
- menu/POS sales deplete stock or local POS data synchronizes with cloud data;
- almost-weekly use creates a schedule, reminder, mandatory cycle, or task;
- authenticated route visibility grants an Inventaire operation;
- fixture tests establish persistence, authorization, tenant isolation,
  legal/accounting/HACCP compliance, environment enablement, or production
  readiness.

## Discovery path and accepted repository sufficiency

A repository-only agent should navigate:

1. [`docs/README.md`](../../README.md) and
   [`PRODUCT_KNOWLEDGE.md`](../../PRODUCT_KNOWLEDGE.md);
2. [`MODULE_REGISTRY.md`](../../MODULE_REGISTRY.md) and this home;
3. [ADR-005](../../decisions/ADR-005-today-operational-steering.md) and the
   [Today home](../today/README.md) for the future source/consumer boundary;
4. the current [route](<../../../apps/backoffice/src/app/(authenticated)/stock/inventaire/page.tsx>),
   fixture model/data, components, prototype notice, navigation, authenticated
   layout, and focused tests;
5. the separate Mouvements, Fournisseurs, Fiches techniques, Carte/menu, and
   local [POS](../../products/pos/README.md) evidence only for boundaries; and
6. [`CURRENT_STATE.md`](../../CURRENT_STATE.md), the
   [Authority Model](../../AUTHORITY_MODEL.md), and
   [Production Readiness](../../operations/PRODUCTION_READINESS.md).

Without Page Chat history or the legacy extract, a fresh agent must be able to
state the exact migration scope, ten current directions, online-ordering
long-term direction, unresolved V1 and catalogue semantics, fixture-prototype
implementation, lack of persistence/operations/permissions, every ownership
boundary, all 18 decision packets, and independent legal/accounting/HACCP,
privacy/security, environment, and readiness state. The repository-only
fresh-agent report recorded `PASS` for that discovery on 2026-09-29.

## Status

Repository reconciliation and bounded canonicalization: `COMPLETE` on
2026-09-29.

Fresh-agent acceptance: `PASS` on 2026-09-29, recorded from
`INVENTAIRE_FRESH_AGENT_ACCEPTANCE_REPORT_PASS.md` with SHA-256
`33f2492e04ed39173ef25718e15ee60c7ea15dbc7d78d70a58e539573d07403f`.

Repository authority for the exact migrated Inventaire scope: `CANONICAL`.

Inventaire Page Chat role for that exact scope: `LEGACY EVIDENCE ONLY`.

Inventaire knowledge migration: `COMPLETE` on 2026-09-29.
