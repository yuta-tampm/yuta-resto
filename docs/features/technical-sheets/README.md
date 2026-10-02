# YUTA Fiches techniques Product Knowledge

Status: MIGRATION COMPLETE — REPOSITORY CANONICAL

Visibility: Engineering

Owner: YUTA product and engineering

Last updated: 2026-09-29

## Purpose and bounded scope

Fiches techniques is the future Backoffice capability for structuring and using
a restaurant's reference recipes. Its fixed bounded V1 direction covers recipe
definition, reference portions, ingredient quantities, preparation scaling,
assisted recipe paste with mandatory Human validation, Inventaire-backed price
context, theoretical recipe cost, reusable intermediate preparations, manual
entry, duplication, Excel export, and an exception-oriented list.

This home is the canonical repository destination for the reconciled Fiches
techniques knowledge scope. It separates approved Product direction from the
current placeholder, executable contracts, source-price facts, recipe-cost
truth, production facts, legal/accounting/HACCP/allergen/nutrition status,
privacy/security, environment availability, and production readiness. It does
not approve an exact schema, workflow, formula, provider, permission model,
retention policy, cross-module write-back, environment enablement, or production
use.

Inventaire, Mouvements de stock, Fournisseurs, Tâches du jour, Salariés,
Planning, Pointage, Formalités, General Information / Restaurant Knowledge,
Carte & menus, POS, Production, purchasing/orders, receipts, invoices/OCR,
Allergènes, Nutrition, Conformité, Establishment, and Identity & Access appear
only to establish ownership or exclusion boundaries. Their Product Truth is not
migrated here. The `Stock` navigation group creates no shared Product authority.

## Knowledge migration state

The Human-supplied `FICHES_TECHNIQUES_LEGACY_KNOWLEDGE_EXTRACT.md`, SHA-256
`e65f8ab8c4f21046ec3eb12c35c0777c3b19eae8175486255b3681ce0d65b883`,
was used only as legacy evidence for the 2026-09-29 reconciliation. Its complete
1,164 lines, exact heading, and all 25 final control fields were verified before
repository classification. Transport-only citation markers were not copied.

The extract was reconciled against current question-specific repository
authority rather than adopted verbatim. Bounded repository canonicalization is
complete.

The repository-only fresh-agent acceptance report
`FICHES_TECHNIQUES_FRESH_AGENT_ACCEPTANCE_REPORT_PASS.md`, SHA-256
`29a6234f9816e29fe2c8fbc7ed397438734bfd70ec932609f72ddeb5621bc1dc`,
was read in full at 490 lines. Its exact heading and all 29 final control values
were verified. The assessment used no Page Chat history, legacy extract,
reconciliation report, or external research and did not mutate the repository.
It recorded `PASS`, zero material knowledge gaps, zero genuine conflicts, and
readiness for the separately Human-authorized authority cutover. It confirmed
that no completed migration was reopened, no adjacent scope was migrated, and
no Product, implementation, legal/accounting, allergen/nutrition,
privacy/security, OpenSpec, environment, readiness, or production authority was
created. The report is acceptance/discovery evidence only.

Following that PASS and the Human-authorized scope-bound cutover on 2026-09-29,
repository knowledge is canonical for the exact Fiches techniques scope in this
home. The Fiches techniques Page Chat is `LEGACY EVIDENCE ONLY` for that scope.
It remains available for historical and forensic lookup, but it is no longer
current Product or shaping authority. Control Tower retains shaping,
genuine-conflict resolution, Human Decision routing, cross-module reasoning,
and governance coordination; coding agents retain repository discovery,
analysis, and separately authorized execution and verification.

The completed Inventaire, Mouvements de stock, Fournisseurs, Tâches du jour,
Salariés, Planning, Pointage, Formalités, and General Information / Restaurant
Knowledge migrations remain unchanged. Their authority records and decision
packets were not reopened.

## Confirmed current Product directions

The Human fixed the following bounded functional perimeter. Each direction is
`APPROVED` at Product level and `DECIDED_NOT_IMPLEMENTED` as a real Fiches
techniques capability in the current repository.

|   # | Approved direction                                                                                                                                 | Current implementation disposition                                    |
| --: | -------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
|   1 | Help the restaurateur establish fiches techniques easily and efficiently from recipes.                                                             | No operational fiche capability exists.                               |
|   2 | Define each reference recipe for a reference number of portions.                                                                                   | No recipe or portion model exists.                                    |
|   3 | Let the user request another preparation quantity without changing the reference recipe.                                                           | No scaling behavior exists.                                           |
|   4 | Use available current price data projected from Inventaire at the approved high-level boundary.                                                    | No price projection or ingredient/article contract exists.            |
|   5 | Calculate theoretical total recipe cost and theoretical cost per portion.                                                                          | No costing logic exists.                                              |
|   6 | Show an existing selling price as context, when available, with a simple ratio-matière direction.                                                  | No dish mapping, selling-price projection, or ratio formula exists.   |
|   7 | Prioritize creation by pasting a free-form recipe.                                                                                                 | The placeholder has no input flow.                                    |
|   8 | Propose extracted portions, ingredients, quantities, and units from pasted text.                                                                   | No extraction service, model, or provider is selected or implemented. |
|   9 | Match proposed ingredients to known Inventaire information and surface ambiguities.                                                                | No mapping model or candidate workflow exists.                        |
|  10 | Never silently invent uncertain or missing ingredients, quantities, units, or mappings; require Human validation/correction before canonical save. | No canonical save path exists.                                        |
|  11 | Keep manual entry available.                                                                                                                       | No manual form exists.                                                |
|  12 | Allow duplication of an existing fiche.                                                                                                            | No fiche record or duplication operation exists.                      |
|  13 | Support simple standard same-dimension conversions; use product-specific conversions only when an explicit relation exists.                        | No canonical unit or conversion model exists.                         |
|  14 | Reuse intermediate preparations or sub-recipes as recipe components.                                                                               | No sub-recipe graph or preparation model exists.                      |
|  15 | Show price source/date and surface missing or old prices.                                                                                          | No source, freshness, or stale-price rule exists.                     |
|  16 | Export reference or scaled preparation data to Excel.                                                                                              | No export contract or operation exists.                               |
|  17 | Make the main list exception-oriented so fiches needing attention are easy to identify.                                                            | No list, status contract, or canonical exception enum exists.         |

### Fixed bounded V1 and exclusions

The current V1 is the combined perimeter above: a fiche linked directionally to
a dish, reference portions, ingredients and quantities, Inventaire matching and
price context, theoretical total/per-portion cost, contextual selling price and
simple ratio direction, scaling, assisted paste with Human review, manual entry,
duplication, simple conversions, intermediate preparations, price provenance and
freshness, Excel export, and an exception-oriented list.

The exact executable model remains unresolved. Advanced nutrition, advanced
allergens, sophisticated cooking-yield behavior, labor cost, and complete
accounting-profitability calculation are outside the current V1. These are
bounded exclusions, not permanent rejection and not an approved roadmap.

## Current implementation

| Evidence                   | Verified repository state                                                                                                                                                         | Boundary                                                                                                               |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Route                      | [`/stock/fiches-techniques`](<../../../apps/backoffice/src/app/(authenticated)/stock/fiches-techniques/page.tsx>) renders `PlannedBackofficePage`.                                | Canonical current route, but a placeholder is `NOT_STARTED` implementation for the Product capability.                 |
| Authenticated shell        | The parent [`(authenticated)` layout](<../../../apps/backoffice/src/app/(authenticated)/layout.tsx>) requires a server-validated authenticated tenant and a user actor.           | Generic shell only; it is not Fiches-specific authorization.                                                           |
| Navigation                 | [`backoffice-navigation.ts`](../../../apps/backoffice/src/components/backoffice/backoffice-navigation.ts) exposes `Fiches techniques` under `Stock` with no capability predicate. | Navigation visibility grants no fiche operation.                                                                       |
| Placeholder UI             | [`planned-backoffice-page.tsx`](../../../apps/backoffice/src/components/backoffice/planned-backoffice-page.tsx) shows shared construction/empty-state copy.                       | No recipe, costing, import, mapping, export, list, or recovery UI.                                                     |
| Tests                      | [`backoffice-navigation.test.ts`](../../../apps/backoffice/test/backoffice-navigation.test.ts) checks label, order, and route ownership.                                          | Navigation evidence only; no Fiches behavior, authorization, tenancy, persistence, calculation, export, or Browser QA. |
| Contracts and persistence  | No Fiches-specific contract, schema, migration, repository, service, loader, action, API, provider adapter, or persisted record was found.                                        | No canonical executable fiche, recipe, ingredient, mapping, cost, price snapshot, preparation, or export truth.        |
| Normative and UI knowledge | No Fiches ADR, normative OpenSpec main spec, active/archived Fiches change, or page pack was found.                                                                               | No detailed behavioral or delivered-UI contract.                                                                       |

Current lifecycle values are Product Decision `APPROVED` for the bounded
directions, Implementation `NOT_STARTED`, Environment `NOT_ENABLED`, Production
Readiness `NOT_ASSESSED`, and External Dependency `BLOCKED` for any applicable
regulated, provider-backed, or production use pending current review. Global
Backoffice readiness remains `NOT_READY`. No production authorization or dated
deployment evidence exists.

## Capability and state matrix

| Capability                                    | Product status                                                     | Implementation | Legal/accounting/HACCP; allergen/nutrition; privacy/security                                  | Environment/readiness/authorization                          | Owner, actors, and scope                                                                                                | Exclusions and unresolved boundary                                                                                 |
| --------------------------------------------- | ------------------------------------------------------------------ | -------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Reference fiche and manual recipe entry       | `APPROVED` bounded direction; exact identity/V1 unresolved         | `NOT_STARTED`  | Not legal advice; regulated and privacy/security status `UNVERIFIED`                          | `NOT_ENABLED`; `NOT_ASSESSED`; no production authorization   | Fiches semantic owner; actor only described as restaurateur; tenant scope unresolved                                    | No approved fields, lifecycle, history, role, or cross-establishment behavior                                      |
| Portion scaling and simple conversions        | `APPROVED` direction                                               | `NOT_STARTED`  | No accounting, nutrition, or production conclusion                                            | Same as above                                                | Fiches owns derived recipe view; mutation/retention unresolved                                                          | No precision, rounding, indivisible-unit, density, package, or actual-production rule                              |
| Assisted recipe paste and extraction          | `APPROVED` with mandatory Human validation and no silent invention | `NOT_STARTED`  | Provider/privacy/security status `UNVERIFIED`; no allergen or nutrition verification          | No provider selected or enabled; no production authorization | Fiches owns only Human-validated future recipe truth; raw-input ownership/retention unresolved                          | No provider/model, confidence threshold, upload, learning, logging, or silent save                                 |
| Ingredient-to-Inventaire matching             | `APPROVED` direction; exact mapping unresolved                     | `NOT_STARTED`  | No food-safety or accounting meaning                                                          | No cross-module contract or readiness                        | Fiches owns recipe ingredient semantics; Inventaire retains its article/price scope                                     | Ingredient is not an Inventaire article; no cardinality, override, version, or write-back rule                     |
| Inventaire-backed theoretical costing         | `APPROVED` direction; cost basis unresolved                        | `NOT_STARTED`  | Accounting/tax status `UNVERIFIED`; theoretical cost is not valuation                         | No enabled projection or readiness                           | Fiches owns theoretical calculation presentation; source price remains outside Fiches                                   | No latest/paid/reference/average/standard basis, HT/TTC/VAT choice, live/snapshot rule, or automatic recalculation |
| Selling-price context and ratio matière       | `APPROVED` direction; formula unresolved                           | `NOT_STARTED`  | No profitability, pricing, legal, or accounting conclusion                                    | No Carte projection or readiness                             | Carte & menus retains semantic ownership of cloud dish/selling-price context; exact executable owner/mapping unresolved | No recommendation, denominator, tax basis, rounding, or write-back                                                 |
| Intermediate preparations                     | `APPROVED` recipe-composition direction                            | `NOT_STARTED`  | No HACCP, conservation, allergen, nutrition, or production conclusion                         | Not enabled or assessed                                      | Fiches semantic owner of recipe definition; actor/scope unresolved                                                      | No recursion, cycle, nesting, yield, version propagation, stock, batch, or actual-consumption semantics            |
| Duplication, Excel export, and exception list | `APPROVED` directions; exact contracts unresolved                  | `NOT_STARTED`  | Export is not legal, accounting, HACCP, or production evidence; privacy/security `UNVERIFIED` | Not enabled or assessed                                      | Fiches semantic scope; permissions and tenant predicates unresolved                                                     | Duplication is not versioning; no lifecycle, columns, status enum, stale threshold, history, or retention          |

## Fiche-technique concept matrix

| Concept                       | Product status; semantic owner; source                                   | Classification and form                                  | Time and unit                                                          | Mutation, visibility, consumers, and write-back                                            | Implementation, retention, and open questions                                         |
| ----------------------------- | ------------------------------------------------------------------------ | -------------------------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------- |
| Fiche technique               | `APPROVED`; Fiches; Human-fixed perimeter                                | Structured future recipe/business record                 | Effective time and unit not established                                | Mutation/visibility unresolved; restaurateur consumer; no cross-module write-back approved | `NOT_STARTED`; retention unresolved; identity/lifecycle/version open                  |
| Reference recipe              | `APPROVED`; Fiches; Human-fixed perimeter                                | Structured recipe definition                             | Current definition; units per ingredient unresolved                    | Future Human-managed record; scaling/cost/export consumers; no external write-back         | `NOT_STARTED`; history/version open                                                   |
| Reference portions            | `APPROVED`; Fiches; Human-fixed perimeter                                | Structured recipe input                                  | Recipe-definition time; conceptual portions                            | Future Human-managed value; scaling and per-portion cost consume it                        | `NOT_STARTED`; portion-size and validation semantics open                             |
| Target portions               | `APPROVED`; Fiches; user request                                         | Derived preparation input/view                           | Use-time context; conceptual portions                                  | User-selectable; scaling/export consume it; no stock/production write-back                 | `NOT_STARTED`; persistence, limits, precision, and rounding open                      |
| Ingredient                    | `APPROVED`; Fiches; manual or Human-validated extraction                 | Structured recipe concept, distinct from article/offer   | Recipe-definition time; recipe unit unresolved                         | Future Human validation; costing/scaling consume it; no Inventaire write-back              | `NOT_STARTED`; identity/mapping/cardinality/version open                              |
| Inventaire price projection   | `APPROVED` at high level; source outside Fiches; Inventaire relationship | Projected cost input, not selected cost basis            | Current context desired; source time/date and unit must remain visible | Source mutation is not owned by Fiches; calculation may consume it; no write-back          | `NOT_STARTED`; price family, precedence, freshness, conversion, live/snapshot open    |
| Theoretical total recipe cost | `APPROVED`; Fiches; derived from quantities and a future selected basis  | Derived cost, not accounting valuation                   | Calculation time unresolved; currency unresolved                       | Derived/read-only; restaurateur consumer; no external write-back                           | `NOT_STARTED`; formula, missing-price behavior, precision, and retention open         |
| Theoretical cost per portion  | `APPROVED`; Fiches; derived                                              | Derived cost/portion, not accounting valuation           | Calculation time unresolved; currency/portion                          | Derived/read-only; restaurateur consumer; no external write-back                           | `NOT_STARTED`; denominator, zero/invalid portions, rounding, and retention open       |
| Existing selling price        | `APPROVED` as context; Carte & menus semantic source                     | Projected price, not Fiches-owned cost truth             | Current/historical behavior and tax basis unresolved                   | Read context only in Fiches; no write-back                                                 | `NOT_STARTED`; dish mapping, price source, HT/TTC, availability open                  |
| Ratio matière                 | `APPROVED` as simple direction; Fiches presentation                      | Derived contextual indicator, not verified profitability | Calculation time/basis unresolved; percentage form not yet contractual | Derived/read-only; no price recommendation or write-back                                   | `NOT_STARTED`; exact formula, tax basis, rounding, meaning, retention open            |
| Intermediate preparation      | `APPROVED`; Fiches; Human-fixed perimeter                                | Structured reusable recipe/preparation definition        | Effective time and output/yield unit unresolved                        | Future Human-managed definition; other recipes consume it; no stock/production write-back  | `NOT_STARTED`; recursion, cycles, nesting, yield, costing, versioning, retention open |

The five proposal-only concepts remain outside the canonical current model:
learning ingredient mappings, historical cost comparison, a tablet production-
sheet UI, supplier fields in the exact Excel contract, and structured automatic
marinade/sauce/garnish sections. They are `PROPOSED`, not approved requirements.

## Ownership, authorization, and tenancy

- **Fiches techniques:** semantic owner of future reference-recipe definitions,
  recipe ingredients/quantities, reference portions, derived scaled views,
  theoretical cost presentation, intermediate-preparation definitions, assisted
  structuring review, and fiche export. No executable data owner exists.
- **Inventaire:** repository-canonical for its own bounded article/price and
  quantity directions. It may later project article/price information; Fiches
  cannot mutate Inventaire. `INV-01` through `INV-18` remain unchanged.
- **Mouvements de stock:** repository-canonical for its bounded movement
  direction. Recipe save, scaling, export, POS sale, or planned preparation does
  not create a movement. `MDS-01` through `MDS-18` remain unchanged.
- **Fournisseurs:** repository-canonical for supplier information, offers/prices,
  and purchase-preparation direction. Supplier article/offer and price facts are
  not recipe ingredients or selected recipe-cost truth. `FOU-01` through
  `FOU-18` remain unchanged.
- **Carte & menus:** retains semantic ownership of an existing cloud dish and
  its selling price in this bounded relationship. Exact cloud record owner,
  mapping, lifecycle, and projection contract remain unresolved; Fiches has no
  write-back authority.
- **POS:** owns restaurant-local catalog and sale facts behind Site Agent and
  `@yuta/db-pos`. It is a separate failure and data boundary; no cloud recipe,
  ingredient, sale-depletion, or price synchronization is approved.
- **Production:** remains a separate, unmigrated scope. A recipe definition,
  target portion count, or intermediate preparation is not a production batch,
  actual yield, actual consumption, or execution record.
- **Allergènes, Nutrition, and Conformité:** are not migrated. Ingredient names
  do not establish verified declarations, nutrition, HACCP, storage, shelf-life,
  traceability, lot, or food-safety facts.
- **Establishment and Identity & Access:** the route currently inherits the
  authenticated Backoffice tenant shell only. No Fiches operation catalogue,
  role mapping, resource predicate, or cross-scope denial test exists.

All currently authenticated tenant users see the navigation item because it has
no `requires` predicate. That is presentation visibility, not read/create/edit/
duplicate/validate/export/view-cost/archive/delete authority. Organization versus
establishment ownership, sharing, templates, cross-establishment copy, local
overrides, and cross-scope denial remain unresolved. Browser-supplied tenant,
membership, role, permission, or entitlement values would remain untrusted under
the repository tenancy rules.

## Fiche, recipe, dish, and ingredient model

A fiche technique is the future business record around a reference recipe. The
reference recipe holds ingredient lines, quantities, units, and reference
portions only after future validation. The fixed direction allows a relationship
to an existing dish, but a fiche is not the dish, a cloud menu item, or a local
POS catalog item. An ingredient is a recipe concept and is not automatically an
Inventaire article or supplier offer. Exact identities, cardinalities, unmapped
ingredient behavior, mappings, lifecycle, and mutation authority remain open.

## Portions, scaling, units, and sub-recipes

Target portions must derive preparation quantities without changing the
reference recipe. No formula beyond that relationship is approved: decimal
precision, rounding, indivisible items, tiny quantities, validation, limits,
and sub-recipe scaling remain open. Target quantity is not actual production,
sale, stock consumption, or waste.

Simple standard same-dimension conversion is approved direction. No canonical
unit set, dimension model, density, package conversion, product-specific
equivalence, precision, rounding, net/gross, partial-package rule, or versioned
conversion source exists. Product-specific conversion requires an explicit
future relation; it cannot be guessed.

Intermediate preparations may be reused as recipe components. No recursion,
nesting depth, cycle handling, version/cost/yield propagation, output unit,
waste, stock, batch, or production semantics are approved.

## Assisted recipe ingestion

Free-form paste is the priority assisted entry direction. A future extraction
may propose reference portions, ingredients, quantities, and units and may offer
Inventaire candidates. The result is always a proposal: uncertainty and missing
data must be explicit, and Human review/correction is mandatory before any
future canonical save. Silent invention and silent canonical writes are
forbidden.

Provider/model choice, input size/formats, prompts, confidence, failure/retry,
manual fallback, raw-input/result persistence, minimization, logging, retention,
training use, credentials, cost, residency, and environment controls are
unresolved. Learning corrected mappings is proposal-only and has no approved
persistence or scope.

## Price, cost, Inventaire, and Fournisseurs model

Inventaire price availability is a future source projection; it is not by
itself the recipe cost basis. Supplier observed price, actually paid price,
reference price, Inventaire operational price, selected theoretical recipe
cost input, and accounting valuation remain distinct. No latest, paid,
reference, average, standard, manual-override, HT, TTC, VAT, currency, package,
or normalized-unit basis is selected.

The current direction requires theoretical total recipe cost and cost per
reference portion, with price source/date visible and missing or old prices
surfaced. Exact summation, conversions, missing/partial-price behavior,
denominator, zero portions, precision, rounding, stale threshold, invalidation,
recalculation, and error states remain open.

Live versus snapshot behavior is unresolved. A current source price must not
silently rewrite historical recipe truth. No historical cost model, comparison,
version boundary, recalculation trigger, override, or retained snapshot exists.
Fiches has no Inventaire or Fournisseurs write-back authority, and neither
adjacent module may automatically rewrite a future canonical fiche without an
approved contract.

## Selling price, ratio, and Carte model

An existing selling price may be displayed as external context when a future
approved dish mapping and projection make it available. Carte & menus retains
semantic ownership of that price; Fiches may not change it. The exact ratio-
matière formula, numerator/denominator, HT/TTC/VAT basis, rounding, missing-price
behavior, history, and financial meaning are unresolved. The direction creates
no selling-price recommendation, verified margin, accounting profitability, or
automatic Carte/Menu write-back.

## Duplication, lifecycle, export, and list model

Manual creation and duplication are approved directions. Duplication is not
versioning. No draft/saved/validated/active/archived/deleted lifecycle, version,
effective date, copy provenance, archive/restore, correction, or immutable
history is approved.

Excel export may cover the reference recipe or one derived scaled preparation.
Exact workbook/sheet/columns, identifiers, source price/date, supplier context,
cost fields, formulas versus values, units, locale, filename, metadata,
permissions, retention, regeneration, and historical reproducibility are open.
An export is not production, stock, legal, accounting, HACCP, allergen, or
nutrition evidence.

The main list should help identify fiches needing attention. Completeness,
missing price, and old price are direction-level examples only; no canonical
status enum, transition, severity, threshold, ownership, action, filter, or
readiness meaning is established.

## Product, implementation, shape, legal, and readiness axes

| Axis                      | Current Fiches techniques result                                                                                                              |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Product Intent            | Seventeen bounded directions and the fixed current V1 are approved; detailed executable contracts remain open.                                |
| Implemented State         | `NOT_STARTED`; authenticated route/navigation/shared placeholder only.                                                                        |
| Executable Shape          | Planned-page title/description and generic empty state only; no fiche fields, fixtures, enums, or domain types.                               |
| Price Source              | Future Inventaire/Fournisseurs projections remain separately owned and contractually unresolved.                                              |
| Recipe Cost Truth         | No selected cost basis, calculation record, snapshot, or historical truth exists.                                                             |
| Production Truth          | No production batch, yield, actual consumption, stock movement, or POS depletion exists or is approved here.                                  |
| Persistence               | No Fiches cloud schema, migration, repository, service, loader, action, or API.                                                               |
| Authorization             | Generic authenticated tenant shell only; no Fiches operations, roles, tenant predicates, or denial tests.                                     |
| UI delivery               | No page pack, Fiches interaction test, accessibility/visual QA, or Browser QA.                                                                |
| Normative behavior        | No Fiches ADR, normative OpenSpec spec, active change, or archived change.                                                                    |
| Legal/accounting/HACCP    | `UNVERIFIED`; no legal, tax, valuation, profitability, traceability, retention, food-safety, or evidentiary conclusion.                       |
| Allergen/nutrition        | Outside bounded current V1 at advanced level and otherwise `UNVERIFIED`; no declaration or calculation.                                       |
| Privacy/security/provider | `UNVERIFIED`; inputs, actors, prices, exports, providers, credentials, tenant isolation, logging, and retention require decisions and review. |
| Environment               | `NOT_ENABLED`; repository route presence does not prove a target runtime.                                                                     |
| Readiness                 | Capability `NOT_ASSESSED`; global Backoffice `NOT_READY`; no production authorization or deployment evidence.                                 |

## Grouped Human decisions required

| ID    | Exact decision packet                                                                                                                                                                                 | Current evidence and why unresolved                                                                                                                            | Required authority and coding non-inference                                                                                                                               |
| ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FT-01 | Close exact executable V1; define fiche/reference-recipe identity, fields, uniqueness, required/optional data, and canonical owner.                                                                   | The bounded V1 is fixed, but no executable model exists. Legal/accounting/HACCP/allergen/nutrition/privacy/security status is `UNVERIFIED` where applicable.   | Human Product plus architecture/data authority. Do not adopt placeholder copy or invent fields/enums.                                                                     |
| FT-02 | Define fiche-to-dish/Menu identity, cardinality, missing/unlinked behavior, lookup, lifecycle, selling-price projection, and write-back.                                                              | Link direction exists; Carte scope is unmigrated and no contract exists. Status `UNVERIFIED`.                                                                  | Human Product for both scopes plus architecture/data/authorization authority. Do not equate fiche, dish, menu item, or POS item and do not write back.                    |
| FT-03 | Define ingredient-to-Inventaire article mapping, cardinality, candidates, unmapped/custom ingredients, confidence, Human override, source/version, and write-back.                                    | Matching direction exists; `INV-10` remains open. Food-safety and privacy/security status `UNVERIFIED`.                                                        | Human Product for both scopes plus data/architecture/security authority. Do not make ingredient equal article or invent a canonical match.                                |
| FT-04 | Define recipe/Inventaire/purchase units, dimensions, package/net/gross semantics, conversions, density/product relations, decimals, precision, rounding, and versioning.                              | Only simple same-dimension direction is approved; `INV-07`/`FOU-06` stay open. Accounting/HACCP status `UNVERIFIED`.                                           | Human Product/data/operations and applicable accounting authority. Do not invent units, density, package conversion, or rounding.                                         |
| FT-05 | Define reference/target portion validation, scaling formula, precision, rounding, indivisible/tiny quantities, limits, and whether target context persists.                                           | Scaling direction is approved; exact calculation absent.                                                                                                       | Human Product/data authority. Do not change reference recipe or infer actual production/sales.                                                                            |
| FT-06 | Define intermediate-preparation identity, output/yield unit, recursion/nesting/cycles, scaling, version/cost propagation, and stock/production boundary.                                              | Reuse direction exists; no graph/model. HACCP/allergen/nutrition status `UNVERIFIED`.                                                                          | Human Product/data plus Production/Stock and applicable external authority. Do not create batches, movements, actual yield, or recursion rules.                           |
| FT-07 | Select source-price families, ownership, precedence, reliability, currency, HT/TTC/VAT, package/unit basis, promotions, manual override, and recipe cost basis.                                       | Inventaire/Fournisseurs relationships exist; `INV-09`, `INV-10`, `FOU-11`, and `FOU-13` remain open. Accounting/tax status `REQUIRES_CURRENT_EXTERNAL_REVIEW`. | Human Product for all owners plus data/accounting/tax authority. Do not select latest/paid/reference/average/standard cost or tax basis.                                  |
| FT-08 | Decide live versus snapshot cost, effective time, recalculation trigger, invalidation, versioning, historical comparison, correction, and current-price effects on history.                           | Current price direction exists; history comparison is proposed. Accounting/privacy status `UNVERIFIED`.                                                        | Human Product/data/accounting authority. Do not silently rewrite historical truth or approve comparison.                                                                  |
| FT-09 | Define total and per-portion formulas, missing/partial-price behavior, denominator validation, currency, precision, rounding, errors, and persisted/derived status.                                   | Outputs are approved; no formulas exist. Accounting status `REQUIRES_CURRENT_EXTERNAL_REVIEW`.                                                                 | Human Product/data/accounting authority. Do not present theoretical cost as valuation.                                                                                    |
| FT-10 | Define selling-price source, dish availability, ratio-matière formula, tax basis, rounding, missing states, meaning, history, and any recommendation boundary.                                        | Context and simple ratio direction exist; no formula/contract. Accounting/legal status `REQUIRES_CURRENT_EXTERNAL_REVIEW`.                                     | Human Product for Fiches/Carte plus accounting/tax authority. Do not infer profitability or recommend/write selling price.                                                |
| FT-11 | Define assisted-paste inputs, parser/provider/model, structured output, uncertainty/confidence, Human review, failure/manual fallback, raw/result persistence, correction, and learning.              | Paste/extraction/Human-validation directions exist; learning is proposed. Privacy/security/provider status `REQUIRES_CURRENT_EXTERNAL_REVIEW`.                 | Human Product, provider, privacy/security, architecture/data/operations authority. Do not silently save, invent data, select a provider, or persist learning.             |
| FT-12 | Define create/manual/duplicate behavior, copy provenance, draft/validated/active/archive/delete states, versioning, effective dates, correction, restore, and propagation.                            | Manual and duplication directions exist; no state machine. Legal/privacy status `UNVERIFIED`.                                                                  | Human Product/data/legal/privacy authority. Do not equate duplication with versioning or derive lifecycle from labels.                                                    |
| FT-13 | Define price source/date display, freshness timestamp, missing/stale thresholds, states, severity, action, overrides, and recalculation effects.                                                      | Transparency/alerts direction exists; examples are not enums. Accounting/privacy status `UNVERIFIED`.                                                          | Human Product for Fiches/source owners plus data/accounting authority. Do not invent threshold or canonical labels.                                                       |
| FT-14 | Define reference/scaled Excel export contract, fields, costs, source/date, optional supplier context, values/formulas, locale, filename, permissions, history, retention, and reproducibility.        | Excel direction exists; supplier field is proposed. Privacy/legal/accounting status `UNVERIFIED`.                                                              | Human Product/UI/data/privacy/security/operations authority. Do not treat export as evidence or add proposed columns.                                                     |
| FT-15 | Decide every Mouvements/POS/Production relationship: recipe use, planned/actual preparation, yield, waste, sale depletion, consumption, batch, movement, sync, and cross-write.                       | Only exclusion boundaries exist; adjacent scopes retain authority. HACCP/accounting status `REQUIRES_CURRENT_EXTERNAL_REVIEW` if later included.               | Human Product for every owner plus architecture/data/operations/external authority. Do not create stock effects, production, or cloud/local sync.                         |
| FT-16 | Define actors and read/create/edit/duplicate/validate/view-cost/export/archive/delete permissions, organization/establishment ownership, sharing, templates, copy, overrides, and cross-scope denial. | Generic authenticated shell and visible navigation only. Privacy/security status `UNVERIFIED`.                                                                 | Human Product and authorization/tenancy/security authority. Do not inherit generic roles or Stock access.                                                                 |
| FT-17 | Define recipe/mapping/price/cost/export history, actor/time audit, snapshots, archive/delete/restore, retention, legal hold, data rights, and evidentiary status.                                     | No persistence or policy. Legal/accounting/privacy/security status `REQUIRES_CURRENT_EXTERNAL_REVIEW`.                                                         | Human Product/data/legal/accounting/privacy/security/operations authority. Do not invent immutability, audit proof, or retention.                                         |
| FT-18 | Decide whether and how allergens, nutrition, conservation, shelf life, HACCP, traceability, lots, food safety, labor, and accounting profitability ever relate to Fiches.                             | Advanced allergen/nutrition, sophisticated yield, labor, and complete profitability are current-V1 exclusions; no conclusions exist.                           | Future Human Product plus qualified legal/accounting/HACCP/allergen/nutrition authority. Do not derive claims from ingredients or turn exclusions into rejection/roadmap. |
| FT-19 | Decide list/page information architecture, accessibility, error/recovery, page pack, QA, environment enablement, monitoring, deployment, external gates, and production authorization.                | Placeholder/navigation test only; no page pack or runtime evidence. External status `BLOCKED` where review applies.                                            | Human Product/UI, privacy/security, operations, external reviewers, and release authority. Do not infer readiness from docs, route, or checks.                            |

## Reconciliation accounting and conflict disposition

The counting unit is one material claim group in this reconciliation ledger.
The 17 Human directions are counted individually; implementation evidence,
proposal families, and grouped Human decision packets are counted separately.

| Disposition               | Count | Counted material                                                                                                                                                                                                     |
| ------------------------- | ----: | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CONFIRMED`               |     5 | Exact Fiches-only migration scope; fixed bounded V1 plus five exclusions; Fiches semantic ownership; adjacent source/consumer and non-write-back boundaries; cloud Backoffice versus restaurant-local POS separation |
| `IMPLEMENTED`             |     2 | Canonical route/navigation/authenticated shell; shared planned placeholder plus navigation-route tests                                                                                                               |
| `DECIDED_NOT_IMPLEMENTED` |    17 | The 17 current Human directions listed above                                                                                                                                                                         |
| `PROPOSED`                |     5 | Mapping learning; historical cost comparison; tablet production-sheet UI; supplier in the exact export contract; structured automatic recipe sections                                                                |
| `UNRESOLVED`              |    19 | `FT-01` through `FT-19`                                                                                                                                                                                              |
| `CONFLICT`                |     0 | Five legacy candidates are concept/mapping, source/basis, current/history, source/consumer, or definition/execution distinctions rather than conflicting current authorities                                         |
| `OBSOLETE`                |     0 | The initial narrower Human scope was incorporated and enriched; no superseded Human Product decision was established                                                                                                 |

The five legacy conflict candidates reconcile without choosing their open
contracts:

1. A recipe ingredient and Inventaire article are distinct concepts connected
   only by a future mapping (`FT-03`).
2. An available/current Inventaire price is a source fact, not the selected
   recipe cost basis (`FT-07`).
3. Current price and historical recipe cost require an unresolved live/snapshot/
   history contract (`FT-08`).
4. A fiche may consume dish/selling-price context while Carte & menus retains
   that semantic ownership and no write-back is approved (`FT-02`, `FT-10`).
5. A reusable sub-recipe is a recipe definition, not a production batch,
   movement, actual yield, or actual consumption (`FT-06`, `FT-15`).

## Migration and separate-scope safety

Inventaire, Mouvements de stock, Fournisseurs, Tâches du jour, Salariés,
Planning, Pointage, Formalités, and General Information / Restaurant Knowledge
were not reopened. Their repository-canonical homes, Page Chat roles, lifecycle
records, and decision packets remain unchanged.

Carte & menus, POS, Production, Allergènes/Nutrition, purchasing/orders,
receipts, invoices/OCR, and every other Page Chat were not migrated. Shared
navigation, cross-references, source projections, and exclusions create no
shared Product authority. No other Page Chat role changed.

## Explicit non-inferences

This reconciliation does not establish that:

- a fiche, recipe, cloud dish, local POS item, ingredient, Inventaire article,
  or supplier offer are identical;
- a reference portion or scaled quantity is an actual sale or production fact;
- recipe save, scale, export, POS sale, or preparation creates stock movement,
  balance change, consumption, waste, batch, or production truth;
- current/available source price is the selected recipe cost basis;
- supplier price is recipe cost truth or accounting valuation;
- current price rewrites a historical cost;
- theoretical recipe cost or ratio matière is margin, profitability, tax,
  accounting, or pricing advice;
- a selling price may be changed from Fiches techniques;
- ingredient names establish allergen, nutrition, HACCP, conservation,
  traceability, lot, shelf-life, or food-safety facts;
- the system may silently invent or save uncertain extraction or mapping data;
- simple conversions approve density, package, product-specific, precision, or
  rounding behavior;
- duplication creates a version or any lifecycle state;
- list labels are canonical enums;
- Excel export proves production, stock, legal, accounting, HACCP, allergen, or
  nutrition evidence;
- navigation visibility grants a Fiches operation, role, or tenant scope; or
- repository documentation, route presence, or checks prove environment
  enablement, deployment, external approval, or production readiness.

## Discovery path and fresh-agent test input

A repository-only agent should follow:

1. [`docs/README.md`](../../README.md) for the documentation index;
2. [`PRODUCT_KNOWLEDGE.md`](../../PRODUCT_KNOWLEDGE.md) for bounded Product
   routing;
3. [`MODULE_REGISTRY.md`](../../MODULE_REGISTRY.md) for independent lifecycle
   dimensions and implementation evidence;
4. this Fiches techniques home for approved direction, boundaries, states,
   decisions, and non-inferences;
5. the current [route](<../../../apps/backoffice/src/app/(authenticated)/stock/fiches-techniques/page.tsx>),
   shared placeholder, navigation, authenticated layout, and navigation test;
6. the repository-canonical [Inventaire](../inventory/README.md),
   [Mouvements de stock](../stock-movements/README.md), and
   [Fournisseurs](../suppliers/README.md) homes for boundary evidence;
7. [POS Product Knowledge](../../products/pos/README.md), Restaurant Knowledge
   boundaries, tenancy/authentication architecture, and any future owning
   Carte/Production source without transferring their authority; and
8. [`CURRENT_STATE.md`](../../CURRENT_STATE.md) and
   [`operations/PRODUCTION_READINESS.md`](../../operations/PRODUCTION_READINESS.md)
   for cross-product orientation and gates.

Without Page Chat history or this legacy extract, a fresh agent must be able to
recover: the exact Fiches-only scope; all 17 approved directions; the fixed
bounded V1 and five exclusions; `NOT_STARTED` placeholder state; all concept and
cross-module distinctions; mandatory Human review and no-silent-invention rule;
the absence of executable contracts; `FT-01` through `FT-19`; all legal,
accounting, HACCP, allergen/nutrition, privacy/security, environment, readiness,
and production limits; the Page Chat's `LEGACY EVIDENCE ONLY` role; and the next
authority for implementation and adjacent boundaries. The repository-only
acceptance report above records that this discovery test passed.

## Related authority

- [Authority Model](../../AUTHORITY_MODEL.md)
- [Lifecycle Status Model](../../LIFECYCLE_STATUS_MODEL.md)
- [Current State](../../CURRENT_STATE.md)
- [Production Readiness](../../operations/PRODUCTION_READINESS.md)
- [Tenancy architecture](../../architecture/TENANCY.md)
- [Authentication architecture](../../architecture/AUTHENTICATION.md)

## Status

- Reconciliation and bounded canonicalization: complete.
- Fresh-agent acceptance: `PASS` with zero material gaps and zero genuine
  conflicts.
- Repository authority cutover: complete for the exact bounded scope.
- Fiches techniques Page Chat: `LEGACY EVIDENCE ONLY` for that scope.
- Product direction: `APPROVED` for the bounded perimeter above.
- Implementation: `NOT_STARTED` beyond route/navigation/shared placeholder.
- Environment: `NOT_ENABLED`.
- Production readiness: `NOT_ASSESSED`; global Backoffice `NOT_READY`.
- Production authorization: absent.
- Open grouped Human decisions: 19 (`FT-01` through `FT-19`).
- External legal/accounting/HACCP/allergen/nutrition/privacy/security/provider
  review: required before applicable regulated, provider-backed, or production
  use; no conclusion was created by this reconciliation.
