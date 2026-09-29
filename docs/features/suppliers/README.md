# YUTA Fournisseurs Product Knowledge

Status: MIGRATION COMPLETE — REPOSITORY CANONICAL

Visibility: Engineering

Owner: YUTA product and engineering

Last updated: 2026-09-29

## Purpose and bounded scope

Fournisseurs is the future Backoffice capability that gives supplier management
operational purchasing value beyond an address book. Its confirmed direction
helps a restaurateur understand what to buy, where and when to buy it, how much
to prepare, at what price, and how supplier-side pricing may support later food
cost updates.

This home is the canonical repository destination for the reconciled
Fournisseurs knowledge scope. It keeps Product direction, supplier information,
supplier offers, dynamic purchase needs, purchasing stages, executable UI shape,
authorization, legal/accounting/commercial status, privacy/security, and
readiness separate. It does not approve a canonical supplier master, exact V1
workflow, purchasing or order system, invoice/OCR capability, accounting
valuation, recipe-cost model, provider integration, permission model, retention
policy, environment enablement, or production use.

Inventaire, Mouvements de stock, Fiches techniques, Carte & menus, POS,
purchasing/orders, receipts, invoices/OCR, Production, Conformité, Aujourd'hui,
Tâches du jour, Establishment, Identity & Access, and Documents appear only to
establish ownership or exclusion boundaries. Their Product Truth is not migrated
here. The `Stock` navigation group is not one indivisible Product authority.

## Knowledge migration state

The Human-supplied `FOURNISSEURS_LEGACY_KNOWLEDGE_EXTRACT.md` with SHA-256
`eeb22c86e563a0c3c686fcd3f9bf75230763bd141d0f76f0944aa829585cad53`
was used only as legacy evidence for the 2026-09-29 reconciliation. The complete
artifact, exact heading, and final control fields were verified before repository
classification began. Export-only transport markers were not copied.

The extract was checked against question-specific current repository authority
and was not copied into this home. Repository reconciliation and bounded
canonicalization are complete.

The repository-only fresh-agent acceptance report
`FOURNISSEURS_FRESH_AGENT_ACCEPTANCE_REPORT_PASS.md`, SHA-256
`f37a69f6ac447d5cb54681f7c090c188c37d052fff570b33f9319c3b4c490219`,
recorded `PASS` with zero material knowledge gaps and zero genuine conflicts.
The complete 503-line report, heading, and all 21 final control fields were
verified. It used no Page Chat history, legacy extract, reconciliation report,
agent memory, or external research and did not mutate the repository. It also
confirmed that Inventaire, Mouvements de stock, Tâches du jour, Salariés,
Planning, Pointage, and Formalités were not reopened; Fiches techniques,
purchasing, receipt/invoice/OCR, and every other Page Chat scope were not
migrated. The report is acceptance/discovery evidence only; it creates no new
Product, implementation, legal, accounting, commercial, privacy, security,
provider, environment, readiness, or production authority.

Following that PASS and the Human-authorized scope-bound cutover on 2026-09-29,
repository knowledge is canonical for the exact Fournisseurs scope in this
home. The Fournisseurs Page Chat is `LEGACY EVIDENCE ONLY` for that scope. It
remains available for historical and forensic lookup, but it is no longer
current Product authority. Control Tower retains shaping, genuine-conflict
resolution, Human Decision routing, cross-module reasoning, and governance
coordination; coding agents retain repository discovery, analysis, and
separately authorized execution and verification.

The completed Inventaire, Mouvements de stock, Tâches du jour, Salariés,
Planning, Pointage, and Formalités migrations remain unchanged. Their authority
records and decision packets were not reopened. Fiches techniques,
purchasing/orders, receipts, invoices/OCR, and every other Page Chat scope remain
separate and unmigrated by this reconciliation.

## Confirmed current Product directions

The following 22 Human directions are confirmed at high level. The current
fixture prototype does not provide the corresponding real restaurant capability,
so each is `DECIDED_NOT_IMPLEMENTED` at capability level.

| Confirmed direction                                                                   | Exact boundary                                                                                                                         | Current repository state                                                         |
| ------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Keep the Fournisseurs page                                                            | Preserve a dedicated supplier capability. This does not approve the current layout or fields.                                          | `DECIDED_NOT_IMPLEMENTED` as a real supplier capability; a fixture route exists. |
| Create value beyond an address book                                                   | Help with purchasing preparation and supplier pricing, without becoming a complete purchasing system.                                  | `DECIDED_NOT_IMPLEMENTED`; current UI is a fictional directory/dashboard.        |
| Separate Inventaire cadence from supplier purchase cadence                            | Weekly inventory does not imply buying from every supplier weekly.                                                                     | `DECIDED_NOT_IMPLEMENTED`; no cadence model exists.                              |
| Use lead time in purchase timing                                                      | Stock may require earlier purchase preparation when supplier lead time would otherwise cause shortage.                                 | `DECIDED_NOT_IMPLEMENTED`; fixture delivery strings drive no behavior.           |
| Recalculate needs after a new Inventaire                                              | Dynamic purchase needs must reflect updated Inventaire context. Exact trigger and formula remain unresolved.                           | `DECIDED_NOT_IMPLEMENTED`; no Inventaire integration exists.                     |
| Separate stable supplier configuration from dynamic needs                             | Inventaire must not overwrite supplier configuration; recommendations change with current context.                                     | `DECIDED_NOT_IMPLEMENTED`; neither persistence model exists.                     |
| Prepare a purchase list in V1                                                         | V1 prepares information for Human use and does not submit supplier orders automatically.                                               | `DECIDED_NOT_IMPLEMENTED`; no list is generated.                                 |
| Export PDF and Excel                                                                  | Prepared purchase information must support these export directions. Exact formats remain unresolved.                                   | `DECIDED_NOT_IMPLEMENTED`; export is disabled.                                   |
| Group needs by supplier                                                               | Purchase needs must be groupable for supplier-oriented preparation.                                                                    | `DECIDED_NOT_IMPLEMENTED`; fixtures are supplier rows, not grouped needs.        |
| Support minimum and target stock direction                                            | Both may contribute to replenishment. Exact ownership, units, and formula remain unresolved.                                           | `DECIDED_NOT_IMPLEMENTED`; no operational stock facts or formula exist.          |
| Suggest quantity with packaging awareness                                             | A suggestion may round to supplier packaging. Exact conversion and rounding remain unresolved.                                         | `DECIDED_NOT_IMPLEMENTED`; no supplier offer/package model exists.               |
| Express need categories                                                               | High-level categories cover buy now, plan later, monitor, sufficient stock, and insufficient data. They are not canonical enums.       | `DECIDED_NOT_IMPLEMENTED`; no need-state engine exists.                          |
| Suppress duplicate recommendations for pending ordered items                          | A locally ordered item with expected delivery must not appear as if nothing were ordered. Reliability and lifecycle remain unresolved. | `DECIDED_NOT_IMPLEMENTED`; no pending-order state exists.                        |
| Support a simple local mark-ordered state                                             | V1 may record a local Human declaration and simple expected delivery. This is not supplier acknowledgment.                             | `DECIDED_NOT_IMPLEMENTED`; current order controls are disabled.                  |
| Prefer a reliable supplier source, otherwise recent invoices                          | Both are candidate price sources subject to validation and exact precedence decisions.                                                 | `DECIDED_NOT_IMPLEMENTED`; there is no import or provider connection.            |
| Do not overwrite actually paid price with public observed price                       | Public or portal observations and restaurant transaction facts remain distinct.                                                        | `DECIDED_NOT_IMPLEMENTED`; neither fact is persisted.                            |
| Distinguish observed, last paid, and YUTA reference prices                            | These are three separate Product concepts, without approved selection or accounting rules.                                             | `DECIDED_NOT_IMPLEMENTED`; fixture amounts do not implement them.                |
| Historize prices                                                                      | Price change history is required direction; exact price families, effective time, corrections, and retention remain unresolved.        | `DECIDED_NOT_IMPLEMENTED`; no history exists.                                    |
| Use invoice as a possible price source                                                | A supplier invoice may evidence the last actually paid price. It is not receipt or movement evidence.                                  | `DECIDED_NOT_IMPLEMENTED`; no invoice capability exists.                         |
| Normalize package price to a reference unit                                           | High-level normalization is required for operational comparison/use. Exact units and conversion remain unresolved.                     | `DECIDED_NOT_IMPLEMENTED`; no conversion model exists.                           |
| Avoid making exceptional promotion the permanent reference                            | Promotion handling must preserve the distinction between exceptional and ongoing price facts.                                          | `DECIDED_NOT_IMPLEMENTED`; no promotion or reference-price logic exists.         |
| Acquire supplier-side prices in Fournisseurs and show operational price in Inventaire | This is a source/consumer direction. Exact ownership, projection, acceptance, and write-back remain unresolved.                        | `DECIDED_NOT_IMPLEMENTED`; no cross-module contract exists.                      |

The bounded current V1 direction also includes supplier management,
product-to-supplier relationships, usual purchase cadence, lead time, purchase
need preparation, supplier grouping, purchase lists, printing and generic copy,
simple expected delivery, and price acquisition/history. Exact information
architecture, entities, fields, calculations, and workflow remain grouped in
the decision packets below.

The confirmed actor wording is `restaurateur`. It does not define an executable
role mapping or grant `OWNER`, `MANAGER`, `STAFF`, purchasing, receiving,
accounting, or service permissions.

## Long-term and proposed directions

- Online supplier ordering and reliable provider connectors are
  `LONG_TERM_DIRECTION`. They are outside current V1. METRO is an example only;
  no provider, portal, API, credential, cart, submission, payment, tracking,
  scraping, or browser-automation contract is approved.
- More automated invoice import, extraction, and matching is
  `LONG_TERM_DIRECTION`; the exact OCR capability and every canonical write
  remain unresolved.
- Analysis of supplier price changes affecting food cost is `PROPOSED`. Its
  placement in the legacy long-term section does not establish current Human
  approval or Fiches techniques behavior.
- Multi-supplier comparison/preference, a dedicated `Mettre à jour les prix`
  UI, supplier detail tabs, landing tabs, price-freshness labels, the exact
  `Copier la liste` control, automatic average-consumption learning, a safety
  margin, the exact target-stock formula, and automatic recipe recalculation
  are `PROPOSED`, not approved requirements.

## Current implementation

| Evidence area                 | Current repository state                                                                                                                                                                                                                                                   | What it establishes                                                                                                                           |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Route                         | [`/stock/fournisseurs`](<../../../apps/backoffice/src/app/(authenticated)/stock/fournisseurs/page.tsx>) renders `SuppliersPage`.                                                                                                                                           | The current Backoffice route exists.                                                                                                          |
| Navigation                    | [`backoffice-navigation.ts`](../../../apps/backoffice/src/components/backoffice/backoffice-navigation.ts) lists `Fournisseurs` inside `Stock` without a capability predicate.                                                                                              | Navigation presence only; it creates no shared Stock authority or supplier permission.                                                        |
| Authenticated shell           | The parent [`(authenticated)` layout](<../../../apps/backoffice/src/app/(authenticated)/layout.tsx>) requires a server-resolved user session and active tenant context.                                                                                                    | Generic authenticated shell access only; no Fournisseurs-specific policy exists.                                                              |
| Prototype disclosure          | [`PrototypeBackofficeNotice`](../../../apps/backoffice/src/components/backoffice/prototype-backoffice-notice.tsx) says displayed data is demonstration data, not establishment data, and that creation, modification, and export are unavailable until persistence exists. | The surface is explicitly a prototype.                                                                                                        |
| Executable presentation shape | [`suppliers-model.ts`](<../../../apps/backoffice/src/app/(authenticated)/stock/fournisseurs/suppliers-model.ts>) defines route-local supplier fields, `Actif`/`Inactif`, filter shape, and hard-coded tab counts.                                                          | UI fixture shape only; it is not a Product contract, supplier entity, status lifecycle, or schema.                                            |
| Fixture data                  | [`suppliers-fixtures.ts`](<../../../apps/backoffice/src/app/(authenticated)/stock/fournisseurs/suppliers-fixtures.ts>) contains seven fictional supplier records with contacts, commercial strings, delivery strings, order amounts, and statistics.                       | Demonstration content only; no tenant, commercial, contractual, accounting, or operational truth.                                             |
| Local interactions            | Client state supports tab/filter/search changes, supplier selection, and closing the detail panel.                                                                                                                                                                         | Local presentation behavior only.                                                                                                             |
| Disabled operations           | Export, new supplier, row actions, contact, new order, edits, and `Produits`, `Commandes`, and `Livraisons` detail tabs are disabled.                                                                                                                                      | No supplier mutation, export, purchase-list, order, delivery, contact, or offer workflow is implemented.                                      |
| Persistence and boundaries    | No supplier-specific contract, cloud schema/migration, repository, service, loader/action, API, persistence, or operation catalogue exists.                                                                                                                                | No canonical supplier, contact, offer, price, recommendation, list, order, delivery, or invoice state exists.                                 |
| Tests                         | [`suppliers-model.test.ts`](../../../apps/backoffice/test/suppliers-model.test.ts), the shared stock prototype footer test, and navigation tests cover fixture filtering/selection, truthful fixture counts, and route presence.                                           | Focused prototype-model evidence only; no persistence, authorization, tenancy, pricing, purchasing, provider, export, or Browser QA evidence. |
| UI and normative knowledge    | No Fournisseurs page pack, Fournisseurs ADR, normative OpenSpec main spec, active change, or archived Fournisseurs change exists.                                                                                                                                          | No detailed approved UI delivery or behavioral contract.                                                                                      |

The implementation classification is `PROTOTYPE`. Fixture supplier names,
contacts, categories, statuses, addresses, delivery/payment strings, minimums,
charges, prices, orders, statistics, tabs, counts, and labels are executable
presentation shape only.

## Capability and state matrix

| Capability                                                 | Product status                                           | Implementation                                             | Legal/accounting/commercial                                                                                   | Privacy/security                                                                 | Environment and readiness                                                                    | Owner, actor, and scope                                                                                                                         | Explicit exclusions and unresolved boundary                                                                 |
| ---------------------------------------------------------- | -------------------------------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Supplier information and management                        | `APPROVED` at high level; exact V1 and master unresolved | `PROTOTYPE`; fictional list/detail only                    | `UNVERIFIED`; identity, contacts, commercial terms, contracts, and evidentiary meaning require current review | `UNVERIFIED`; contact data, roles, tenant isolation, audit, and retention absent | `UNVERIFIED`; capability `NOT_ASSESSED`, Backoffice `NOT_READY`, no production authorization | Fournisseurs is semantic Product owner; executable data owner absent; actor is only `restaurateur`; organization/establishment scope unresolved | No approved master fields, uniqueness, lifecycle, archive, sharing, or mutation policy                      |
| Supplier article/offer and price acquisition               | `APPROVED` direction; exact offer model unresolved       | `NOT_STARTED`; fixture categories/terms are not offers     | `UNVERIFIED`; no tax, commercial, invoice, valuation, or contract conclusion                                  | `UNVERIFIED`; provider credentials and source data require review                | `NOT_ENABLED`; no provider or downstream readiness                                           | Fournisseurs semantic scope; canonical article, offer, and price owners unresolved                                                              | No barcode/reference/cardinality/unit/availability/effective-date/source-precedence contract                |
| Purchase-need preparation                                  | `APPROVED` bounded V1 direction                          | `NOT_STARTED`                                              | `UNVERIFIED`; recommendation is not an order or accounting record                                             | `UNVERIFIED`; actor, values, exports, history, and visibility absent             | `NOT_ENABLED`; no production authorization                                                   | Fournisseurs owns supplier-side preparation direction; Inventaire retains its quantities and unresolved purchase-need display                   | No formula, thresholds, confidence, stale-data, override, or approved automatic action                      |
| Purchase list/export/print/copy                            | `APPROVED` direction; exact formats/UI unresolved        | `NOT_STARTED`; generic export disabled                     | `UNVERIFIED`; no order, contract, or evidentiary status                                                       | `UNVERIFIED`; export content/access/retention absent                             | `NOT_ENABLED`; no readiness evidence                                                         | Fournisseurs Product scope; permissions and tenant scope unresolved                                                                             | List/export/copy does not submit an order                                                                   |
| Local ordered and expected-delivery state                  | `APPROVED` bounded V1 direction                          | `NOT_STARTED`; order/delivery UI is disabled fixture shape | `UNVERIFIED`; not supplier acknowledgment, contract, receipt, invoice, or payment                             | `UNVERIFIED`; actor/history/correction/retention absent                          | `NOT_ENABLED`; no readiness evidence                                                         | Fournisseurs direction; purchasing, receipt, and movement owners unresolved                                                                     | No full order lifecycle, dispatch, receipt, invoice, payment, or automatic movement                         |
| Supplier pricing/history and invoice-assisted candidate    | `APPROVED` concepts/direction; exact rules unresolved    | `NOT_STARTED`                                              | `REQUIRES_CURRENT_EXTERNAL_REVIEW` before VAT, accounting, invoice, valuation, contractual, or food-cost use  | `UNVERIFIED`; invoice/contact/provider data and retention absent                 | `NOT_ENABLED`; no downstream readiness                                                       | Fournisseurs semantic acquisition source; exact price/master/data owner and consumer contracts unresolved                                       | No HT/TTC/VAT rule, precedence, validation, unit conversion, valuation, or canonical write                  |
| Online ordering/provider integration                       | `LONG_TERM_DIRECTION`; current requirement `NO`          | `NOT_STARTED`                                              | `REQUIRES_CURRENT_EXTERNAL_REVIEW` if pursued                                                                 | `REQUIRES_CURRENT_EXTERNAL_REVIEW` if credentials/provider data are used         | `NOT_ENABLED`; provider and production readiness absent                                      | Future ownership and actors unresolved                                                                                                          | METRO is an example; no required provider, portal, API, cart, submission, payment, scraping, or credentials |
| Cost-variation analysis and automatic recipe recalculation | `PROPOSED`                                               | `NOT_STARTED`                                              | `UNVERIFIED`; no approved recipe-cost or accounting basis                                                     | `UNVERIFIED`                                                                     | `NOT_ENABLED`; not production-authorized                                                     | Fiches techniques scope remains unmigrated; exact ownership unresolved                                                                          | No automatic recipe mutation, recalculation, alert, or food-cost truth                                      |

No row is production-authorized.

## Supplier concept matrix

| Concept                                   | Product status and semantic owner                     | Kind, source, time, and mutation                                                                                      | Visibility, consumers, and write-back                                                                               | Implementation, retention, and unresolved questions                                                          |
| ----------------------------------------- | ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Supplier                                  | `APPROVED` concept; Fournisseurs semantic owner       | Supplier master candidate; structured current identity/configuration; exact source/effective time/mutation unresolved | Fournisseurs; bounded supplier context may be projected to Inventaire; no silent write-back                         | Fixture-only; no persistence or retention; identity, scope, uniqueness, contacts, lifecycle unresolved       |
| Supplier article/offer                    | Relationship `APPROVED`; exact model unresolved       | Offer candidate linked to, but distinct from, a canonical YUTA article; source/effective dates/mutation unresolved    | Fournisseurs; potential purchase planning and price consumers; no automatic article mutation                        | Not implemented; reference, package, unit, cardinality, availability, price, promotions, history unresolved  |
| Purchase cadence                          | `APPROVED`; Fournisseurs semantic scope               | Stable supplier/offer configuration candidate; current/effective-time rules unresolved                                | Fournisseurs purchase preparation; no write-back to Inventaire                                                      | Not implemented; supplier versus offer level, calendar, cut-off, fallback, history unresolved                |
| Lead time                                 | `APPROVED`; Fournisseurs semantic scope               | Stable supplier/offer configuration candidate; not a guaranteed delivery date                                         | Purchase timing/recommendation consumer; no automatic order                                                         | Fixture delivery strings only; level, source, calendar, effective dates, fallback unresolved                 |
| Purchase recommendation/need              | `APPROVED` direction; dynamic owner split unresolved  | Derived dynamic fact using Inventaire context and supplier configuration; exact inputs/time/mutation unresolved       | Fournisseurs preparation; Inventaire keeps its canonical bounded display direction; no order or movement write-back | Not implemented; formula, categories, confidence, staleness, overrides, persistence/history unresolved       |
| Supplier-grouped purchase list            | `APPROVED`; Fournisseurs scope                        | Transient or persisted projection unresolved; Human-edit/mutation unresolved                                          | PDF/Excel/print/generic-copy direction; no submission write-back                                                    | Not implemented; entity, fields, totals, permissions, formats, retention unresolved                          |
| Observed supplier price                   | `APPROVED` distinction; Fournisseurs source direction | Source observation, current or historical; acceptance/mutation unresolved                                             | Candidate only; must not overwrite paid price; possible Inventaire projection after validation                      | Not implemented; provider reliability, currency, HT/TTC, unit basis, effective time, retention unresolved    |
| Last actually paid price                  | `APPROVED` distinction; exact data owner unresolved   | Historical transaction fact candidate, with invoice as possible source; Human validation/correction unresolved        | Price/reference consumers only after an approved contract; no receipt/movement write-back                           | Not implemented; invoice matching, discounts/fees/credits, effective time, corrections, retention unresolved |
| YUTA reference price                      | `APPROVED` distinction; exact owner unresolved        | Derived or selected operational reference; source precedence and mutation unresolved                                  | Directionally visible in Inventaire and potentially consumed by Fiches techniques; no silent cross-write            | Not implemented; accounting status, basis, selection, promotion treatment, history, rollback unresolved      |
| Local ordered state and expected delivery | `APPROVED` bounded direction; exact owner unresolved  | Human declaration and expected-date candidate; current/history/correction unresolved                                  | Suppresses duplicate recommendation only under a future reliable contract; no supplier/receipt/movement write-back  | Not implemented; quantity, lifecycle, staleness, cancel/amend/partial receipt, retention unresolved          |

## Ownership, authorization, and tenancy boundaries

- **Fournisseurs:** semantic Product owner of bounded supplier information,
  supplier-side configuration, offers/pricing acquisition direction, purchase
  preparation, supplier-grouped lists, and simple local ordered/expected-
  delivery direction. Exact executable master, persistence owner, organization
  versus establishment scope, and mutation authority remain unresolved.
- **Inventaire:** remains canonical for its completed migrated quantities,
  purchase-need display, and operational-price presentation directions. This
  reconciliation does not change `INV-01` through `INV-18`, choose a formula,
  or authorize Fournisseurs to overwrite Inventaire.
- **Mouvements de stock:** remains canonical for its completed migrated scope.
  Recommendation, list, order declaration, invoice, or delivery does not create
  a stock movement. This reconciliation does not change `MDS-01` through
  `MDS-18`.
- **Fiches techniques:** owns any future ingredient use and recipe-cost
  semantics. A price-contribution direction does not define cost basis,
  automatic recalculation, history, or write-back.
- **Purchasing/orders:** recommendation, list, draft, submitted order,
  acknowledgment, dispatch, delivery, receipt, invoice, credit, return, payment,
  and movement remain distinct. This home migrates no complete lifecycle.
- **Receipts and invoices/OCR:** physical receipt and invoice are distinct. An
  invoice may be a price candidate; it does not prove physical receipt or create
  stock/movement data. Upload, OCR, matching, confirmation, retention, and
  accounting handoff remain separate unresolved scope.
- **POS/Menu:** local POS catalogue and operational data remain isolated from
  cloud persistence. No cloud supplier, stock, price, recipe, or order
  synchronization is approved.
- **Establishment and tenancy:** the current route inherits trusted
  server-resolved organization and active-establishment context. Fixtures are
  explicitly not establishment data. No supplier data-scope or cross-
  establishment sharing model exists.
- **Authorization:** the route has no navigation predicate or Fournisseurs-
  specific guard. Generic shell visibility does not grant read, create, edit,
  contact, offer, price, invoice, list, export, order, expected-delivery,
  credential, archive, or delete operations.

Any future tenant-owned cloud implementation must accept trusted server-derived
organization and active-establishment context, scope every operation, reject
resource-ID-only access, and fail closed. That architecture rule does not create
a Fournisseurs Product permission model.

## Supplier/article/offer boundary

A supplier concept and product-to-supplier relationship are confirmed. The
repository does not define legal/trade identity, identifier, address/contact
roles, account number, active/archive lifecycle, uniqueness, or sharing scope.
Supplier identity remains distinct from contact records.

The repository also does not define supplier reference/name, YUTA article
mapping, barcode, package, purchase unit, quantity per package, price,
promotion, availability, URL, lead time, minimum order, effective dates, or
history as a canonical offer. A supplier article is not the canonical YUTA
article. One visible fixture supplier does not establish cardinality.

Multiple offers, preferred/default or alternative supplier, cheapest/fastest
selection, establishment preference, and manual override remain proposed or
unresolved. A future preferred supplier must not imply exclusivity or automatic
selection without approval.

## Purchase need, cadence, and lead-time boundary

The approved directions are:

- inventory cadence differs from purchase cadence;
- supplier or product cycles may be weekly, biweekly, multi-month, or on demand;
- lead time may require earlier purchase preparation;
- stable supplier configuration remains separate from dynamic needs;
- new Inventaire context must cause needs to be recalculated under a future
  approved contract;
- minimum stock, target stock, lead time, packaging, pending ordered quantity,
  expected delivery, and manual override may contribute;
- suggested quantity may round to supplier packaging; and
- need categories exist at high level but are not canonical labels or enums.

No exact formula, input authority, consumption source/window, threshold, safety
margin, stale-data behavior, next purchase opportunity, unit conversion,
rounding, confidence, override, recalculation trigger, persistence, history, or
write-back is approved. Pending-order suppression requires reliable state;
local `marquer comme commandé` is not provider acknowledgment.

## Purchase list, order, and delivery boundary

The current direction separates these stages:

1. a dynamic purchase recommendation;
2. a supplier-grouped Human-prepared list;
3. PDF/Excel export, print, or generic copy of that list;
4. a simple local Human mark-ordered declaration;
5. a simple expected-delivery value;
6. a future submitted supplier order;
7. supplier acknowledgment;
8. dispatch/delivery;
9. physical receipt;
10. invoice or credit note; and
11. payment.

Only stages 1 through 5 are confirmed bounded V1 directions, and none is
implemented. Export/copy is not order submission. Mark ordered is not supplier
acknowledgment. Expected delivery is not dispatch, delivery, or receipt. Invoice
is not physical receipt or payment. No stage creates a movement automatically.

## Price, invoice, Inventaire, and Fiches techniques boundary

Observed supplier price, last actually paid price, and YUTA reference price are
distinct approved concepts. Catalogue/public/portal/negotiated/invoice prices,
package/unit price, HT/TTC/VAT, discount, promotion, rebate, delivery charge,
operational price, inventory valuation, and recipe cost must remain distinct.

A reliable supplier source may provide an observed candidate. A recent invoice
may provide evidence for the last actually paid price. An observed public price
must not silently overwrite the paid price, and an exceptional promotion need
not become the permanent reference. Exact source precedence, reliability,
Human confirmation, tax/currency/unit basis, discounts/fees/credits, promotion
detection, reference selection, effective time, history, correction, rollback,
and retention remain unresolved.

Package-to-reference-unit normalization is high-level direction only. Purchase,
stock, and recipe units; conversions; decimals; rounding; net/gross quantity;
partial packages; errors; and versioning remain unresolved. No accounting or
inventory valuation is created here.

Invoice upload/OCR, supplier and line matching, candidate extraction, Human
confirmation, duplicate handling, correspondence memory, retention, accounting
handoff, and canonical price update are unresolved and unmigrated. Invoice
import must not create stock or a movement automatically.

Inventaire may later display supplier context, current operational price,
source, update date, evolution, and refreshed purchase need. This is a
source/consumer direction without silent write-back and without resolving the
Inventaire quantity-to-buy formula. Validated/reference prices may later
contribute to Fiches techniques, but article/ingredient mapping, exact cost
basis, unit conversion, latest/average/standard cost, snapshot/live behavior,
recalculation trigger, historical recipe cost, permissions, and write-back
remain unresolved. Automatic recipe recalculation is not approved.

## Online ordering and provider boundary

Online supplier ordering is a long-term direction and is excluded from current
V1. Provider integration is not a required dependency, and METRO is only an
example. Link-out, portal, prefilled search/cart, API, browser automation,
credentials, authentication, cart creation, submission, acknowledgment,
payment, tracking, retry, and receipt/invoice import are unresolved. No external
provider research was performed, and no credential, scraping, provider,
commercial, or production readiness claim exists.

## Product, implementation, shape, legal, and readiness axes

| Axis                        | Current Fournisseurs result                                                                                                                                            |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Product Intent              | Twenty-two bounded directions are confirmed; exact workflow, domain model, permissions, and many cross-scope contracts remain unresolved.                              |
| Implemented State           | Authenticated fixture-backed prototype with local filtering/selection and disabled operations.                                                                         |
| Executable Data Shape       | Route-local TypeScript fields and strings only; no transport contract or canonical data model.                                                                         |
| Supplier truth              | No canonical supplier master, contact, offer, price, recommendation, list, order, delivery, or invoice truth exists.                                                   |
| Persistence                 | No Fournisseurs cloud schema, migration, repository, service, loader, action, or API.                                                                                  |
| Authorization               | Authenticated tenant shell only; no supplier operation catalogue, role mapping, scoped resource predicate, or denial tests.                                            |
| UI delivery                 | No Fournisseurs page pack or Browser QA evidence.                                                                                                                      |
| Normative behavior          | No Fournisseurs ADR, normative main spec, active change, or archived change. ADR-005 controls only future Today/source ownership.                                      |
| Legal/accounting/commercial | `UNVERIFIED`; current external review is required before tax, invoice, valuation, accounting, contractual, pricing, receipt-evidence, retention, or production claims. |
| Privacy/security            | `UNVERIFIED`; supplier contacts, actor history, invoice data, exports, credentials, access, tenant isolation, logging, and retention require review if implemented.    |
| Environment                 | `UNVERIFIED`; route presence and tests do not prove a target environment.                                                                                              |
| Readiness                   | Capability `NOT_ASSESSED`; global Backoffice `NOT_READY`; no production authorization or deployment evidence.                                                          |

## Grouped Human decisions required

| ID     | Decision packet                                                                                                                                                                                                        | Current evidence and status                                                                | Required authority and non-inference                                                                                                                     |
| ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FOU-01 | Close exact V1 and page information architecture, including supplier management, needs, lists, prices, sections, defaults, details, filters, and actions.                                                              | Bounded V1 direction exists; fixture UI and assistant layouts have no Product authority.   | Human Product/UI authority. Do not promote current or proposed tabs, cards, tables, or controls.                                                         |
| FOU-02 | Define supplier identity, contacts, canonical master, uniqueness, active/archive lifecycle, mutation authority, organization/establishment ownership, and sharing.                                                     | Fournisseurs is semantic owner; executable data owner absent.                              | Human Product, architecture/data, authorization, tenancy, privacy, legal/commercial authority. Do not adopt fixture fields.                              |
| FOU-03 | Define supplier article/offer identity, supplier/YUTA references, mapping cardinality, package/unit, availability, minimums, price, promotion, URL, effective dates, and history.                                      | Relationship direction only; no contract/schema.                                           | Human Product, architecture/data, and commercial authority. Supplier article is not YUTA article.                                                        |
| FOU-04 | Decide single/multiple offers, preferred/default/alternative supplier, establishment preference, comparison, selection, override, and history.                                                                         | Multi-supplier/preference is proposed.                                                     | Human Product, data, and operations authority. Do not infer exclusivity or automatic choice.                                                             |
| FOU-05 | Define purchase cadence and lead time level, representation, calendars/cut-offs, effective dates, fallback, missing-data behavior, and operational meaning.                                                            | High-level cadence/lead-time directions confirmed.                                         | Human Product, data, and operations authority. Lead time is not guaranteed delivery.                                                                     |
| FOU-06 | Define purchase/stock/recipe units, packages, conversions, net/gross quantity, partial packages, minimum order, rounding, errors, and versioning.                                                                      | Packaging/normalization directions confirmed; no model.                                    | Human Product, architecture/data, operations, accounting, and Fiches authority. Do not invent conversions.                                               |
| FOU-07 | Define purchase-need inputs, exact formula, minimum/target stock, thresholds, consumption, safety margin, categories, stale/incomplete data, confidence, overrides, and persistence.                                   | Direction confirmed; algorithm/labels unresolved.                                          | Human Product for Fournisseurs/Inventaire plus data/analytics authority. Do not resolve `INV-06` or promote labels into enums.                           |
| FOU-08 | Define Inventaire-to-Fournisseurs refresh/projection, recalculation trigger, snapshots, write-back, failure/retry, ownership, and current-price/purchase-need display.                                                 | Source/consumer direction confirmed; Inventaire remains canonical.                         | Human Product for both scopes, architecture/data, authorization, and operations authority. No silent write-back or Inventaire reopening.                 |
| FOU-09 | Define purchase-list entity/projection, grouping, fields, prices/totals/notes, editability, PDF/Excel/print/copy formats, permissions, history, and retention.                                                         | High-level list/export direction confirmed.                                                | Human Product/UI, data, privacy/security, and operations authority. Export/copy is not submission.                                                       |
| FOU-10 | Define local ordered/expected-delivery state, quantity/date source, reliability, duplicate suppression, staleness, amend/cancel, partial receipt, correction, and history.                                             | Bounded direction confirmed; no implementation.                                            | Human Product, data, operations, and authorization authority. Local declaration is not acknowledgment or receipt.                                        |
| FOU-11 | Define observed/paid/reference price ownership, source precedence, reliability, validation, HT/TTC/VAT/currency/unit basis, promotions/discounts/fees, history, corrections, rollback, and reference selection.        | Three concepts and safeguards confirmed; rules absent.                                     | Human Product, architecture/data, accounting/legal/commercial, privacy/security authority. Do not create valuation.                                      |
| FOU-12 | Define invoice upload/import/OCR, provider, supplier/line matching, candidate fields, Human confirmation, duplicates, correspondence memory, retention, accounting handoff, and canonical price write.                 | Invoice may be price source; automated processing is long-term/unresolved.                 | Human Product for invoice/Fournisseurs, provider, data, accounting/legal, privacy/security, and operations authority. No automatic stock/movement write. |
| FOU-13 | Define price projection to Fiches techniques, article/ingredient mapping, cost basis, units, latest/average/standard cost, snapshot/live behavior, recalculation, history, permissions, and write-back.                | Contribution direction confirmed; cost analysis and automatic recalculation are proposed.  | Human Product for Fiches/Fournisseurs, data, accounting, and operations authority. Do not migrate Fiches techniques.                                     |
| FOU-14 | Decide any online ordering/provider boundary: link-out, portal, search/cart prefill, API/automation, credentials/authentication, submission, acknowledgment, payment, tracking, retry, import, and provider selection. | Long-term direction only; METRO example; no provider evidence.                             | Future Human Product, provider, commercial/legal, privacy/security, and operations authority. No research, scraping, or credentials approved.            |
| FOU-15 | Define recommendation/list/order/acknowledgment/dispatch/delivery/receipt/invoice/credit/return/payment/movement boundaries, owners, identifiers, dates, discrepancies, and cross-writes.                              | Stages are distinct; adjacent scopes unmigrated.                                           | Human Product for every owning scope plus architecture/data, accounting/legal, authorization, and operations authority. Do not conflate stages.          |
| FOU-16 | Define actors and supplier-specific read/create/edit/contact/offer/price/import/list/export/mark-ordered/expected-delivery/credential/archive/delete permissions plus tenant predicates.                               | Generic authenticated shell only.                                                          | Human Product and authorization/security/tenancy authority. Do not infer from route visibility or generic roles.                                         |
| FOU-17 | Define supplier/contact/offer/price/list/order/invoice history, audit, archive/delete/restore/anonymization, retention, legal hold, evidentiary status, and commercial/privacy obligations.                            | No policy or persistence exists.                                                           | Human Product, data, legal/accounting/commercial/privacy/security, and operations authority. Do not invent immutability or retention.                    |
| FOU-18 | Define UI delivery, accessibility/QA, environment enablement, provider/downstream readiness, deployment, monitoring/recovery, and production authorization.                                                            | Prototype-model tests only; no page pack, Browser QA, environment, or deployment evidence. | Human Product/UI, security/privacy, operations, external reviewer, and release authority. Do not infer readiness from code or documentation.             |

## Reconciliation accounting and legacy safeguards

The counting unit is one material claim group in this reconciliation ledger.
The 22 Human directions are counted individually; implementation evidence,
assistant proposal families, grouped Human decision packets, and superseded
legacy positions are counted separately.

| Disposition               | Count | Counted material                                                                                                                                                                                                                                                              |
| ------------------------- | ----: | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CONFIRMED`               |     5 | Exact Fournisseurs-only migration scope; semantic Product ownership; bounded V1 purpose/perimeter; purchasing-stage separation; independent adjacent-scope and cloud/local ownership boundaries                                                                               |
| `IMPLEMENTED`             |     2 | Canonical route/navigation/authenticated shell; fixture prototype/local interactions/tests                                                                                                                                                                                    |
| `DECIDED_NOT_IMPLEMENTED` |    22 | The 22 current Human directions listed above                                                                                                                                                                                                                                  |
| `PROPOSED`                |    11 | Multi-supplier comparison; exact Inventaire price-update UI; supplier-detail tabs; landing tabs; price-freshness labels; exact copy control; average-consumption learning; safety margin; exact target-stock formula; automatic recipe recalculation; cost-variation analysis |
| `UNRESOLVED`              |    18 | `FOU-01` through `FOU-18`                                                                                                                                                                                                                                                     |
| `CONFLICT`                |     0 | Six legacy candidates are semantic-owner/data-owner, high-level/exact-contract, source/consumer, or stage distinctions, not disagreements between current authorities                                                                                                         |
| `OBSOLETE`                |     4 | Fournisseurs as directory only; automatic ordering in current V1; latest public website price as current cost; every Inventaire causing purchase from every supplier                                                                                                          |

The six legacy conflict candidates remain safely classified:

1. Fournisseurs is semantic owner while the exact supplier master/data owner is
   unresolved; this does not contradict Inventaire.
2. Quantity-to-buy direction exists while its exact formula remains `FOU-07`
   and `INV-06` remains unchanged.
3. Supplier-side price may feed Inventaire under a future projection; that does
   not authorize silent write-back.
4. Reference price may later contribute to Fiches techniques; the cost basis
   and recalculation contract remain `FOU-13` and separate Fiches authority.
5. Purchase list and local mark ordered remain distinct from a supplier order.
6. Invoice may evidence price while physical receipt and stock movement remain
   separate events.

## Explicit non-inferences

Do not infer that:

- route-local `Supplier` fields, `Actif`/`Inactif`, tabs, categories, or fixture
  values are canonical Product entities, enums, schemas, terms, or statistics;
- a supplier string is a canonical supplier entity or one visible supplier
  establishes cardinality;
- supplier article is the canonical YUTA article;
- preferred supplier is exclusive or automatic;
- supplier, offer, contact, price, recommendation, list, order, delivery, or
  invoice persistence exists;
- supplier price is accounting valuation or recipe-cost truth;
- package price is unit price, or latest/public price is paid/reference price;
- a new Inventaire has an approved trigger, formula, or write-back contract;
- need-category wording is a canonical enum;
- a recommendation is a list, order, task, movement, or automated action;
- a list/export/copy submits an order;
- mark ordered means supplier acknowledgment;
- expected delivery means dispatch, delivery, or receipt;
- invoice, physical receipt, payment, and stock movement are the same event;
- invoice/OCR/provider output may create canonical price, stock, movement, or
  order data without an approved Human-validation contract;
- local POS data synchronizes with cloud supplier or stock data;
- shared organization means shared supplier commercial terms or stock;
- authenticated route visibility grants a Fournisseurs operation;
- fixture tests establish persistence, source correctness, authorization,
  tenant isolation, legal/accounting/commercial/privacy validity, environment
  enablement, provider readiness, or production authorization.

## Discovery path and fresh-agent test input

A repository-only agent should navigate:

1. [`docs/README.md`](../../README.md) and
   [`PRODUCT_KNOWLEDGE.md`](../../PRODUCT_KNOWLEDGE.md);
2. [`MODULE_REGISTRY.md`](../../MODULE_REGISTRY.md) and this home;
3. the completed [Inventaire](../inventory/README.md) and
   [Mouvements de stock](../stock-movements/README.md) homes only for protected
   source/consumer and event boundaries;
4. [ADR-005](../../decisions/ADR-005-today-operational-steering.md) and the
   [Today home](../today/README.md) only for future source ownership;
5. the current [route](<../../../apps/backoffice/src/app/(authenticated)/stock/fournisseurs/page.tsx>),
   fixture model/data, components, prototype notice, navigation, authenticated
   layout, and focused tests;
6. the separate Fiches techniques, purchasing/orders, receipts, invoices/OCR,
   POS/Menu, Production, and [local POS](../../products/pos/README.md) evidence
   only for boundaries;
7. [`CURRENT_STATE.md`](../../CURRENT_STATE.md), the
   [Authority Model](../../AUTHORITY_MODEL.md),
   [Tenancy](../../architecture/TENANCY.md), and
   [Production Readiness](../../operations/PRODUCTION_READINESS.md).

Without Page Chat history or the legacy extract, a fresh agent must be able to
state the exact migration scope; 22 current directions; bounded V1 and explicit
exclusions; semantic owner versus unresolved data owner; prototype state;
supplier/article/offer limits; cadence, lead-time, packaging, need, pending-
order and list boundaries; purchasing-stage distinctions; observed/paid/
reference price separation; invoice, Inventaire, Fiches and Mouvements
boundaries; long-term provider status; all 18 decision packets; independent
legal/privacy/readiness axes; protected completed migrations; repository
canonical authority; and the Fournisseurs Page Chat role as
`LEGACY EVIDENCE ONLY`.

Fresh-agent acceptance: `PASS`.

## Related authority

- [`docs/AUTHORITY_MODEL.md`](../../AUTHORITY_MODEL.md)
- [`docs/LIFECYCLE_STATUS_MODEL.md`](../../LIFECYCLE_STATUS_MODEL.md)
- [`docs/architecture/TENANCY.md`](../../architecture/TENANCY.md)
- [`docs/operations/PRODUCTION_READINESS.md`](../../operations/PRODUCTION_READINESS.md)
- [`docs/features/inventory/README.md`](../inventory/README.md)
- [`docs/features/stock-movements/README.md`](../stock-movements/README.md)
- [`docs/features/today/README.md`](../today/README.md)
- [`docs/decisions/ADR-005-today-operational-steering.md`](../../decisions/ADR-005-today-operational-steering.md)
