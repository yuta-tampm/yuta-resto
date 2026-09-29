# YUTA Carte & menus Product Knowledge

Status: MIGRATION PASS — REPOSITORY CANONICAL

Visibility: Engineering

Owner: YUTA product and engineering

Last updated: 2026-09-29

## Purpose and bounded scope

Carte & menus is the Backoffice capability for managing part of one
restaurant's menu information. The approved direction is broadly useful to
restaurants while keeping the domain model proportionate to YUTA's intended
scope. The capability must eventually support `menu` in the sense of a
combo/composition of multiple dishes.

Carte & menus is an information capability. A displayed selling price may
later be part of approved menu information, but this capability does not own
orders, checkout, payment, accounting, invoicing, or financial transactions.

This home covers only the Carte & menus migration scope. It does not migrate or
reopen Fiches techniques, Inventaire, Mouvements de stock, Fournisseurs, POS,
Display, Website/Site Agent, ordering channels, Production, Allergens,
Nutrition, Marketing, Restaurant Knowledge, Establishment Profile, Identity &
Access, or another Page Chat scope.

## Knowledge migration state

The corrected legacy evidence file
`CARTE_MENUS_LEGACY_KNOWLEDGE_EXTRACT.md` was fully read and reconciled at
SHA-256
`978fc3be8bdf6cbf295f5a66680035a50e777417c90a5fe8c7705e7da4647eb0`.
It had the expected 1,120 lines, heading, and extraction control block. It was
treated as legacy evidence, was not copied into this repository, and did not
override current Product, implementation, data-shape, authorization, legal, or
readiness authority.

The repository-only fresh-agent acceptance report
`CARTE_MENUS_FRESH_AGENT_ACCEPTANCE_REPORT_PASS.md` was fully read at 578
logical lines and verified at SHA-256
`c24e7d588a6ef6e8996fe822891a75f0ba2f3d5e9ceb065c7a3cfa4070e8e6ce`.
Its heading was exactly `# CARTE & MENUS FRESH-AGENT ACCEPTANCE REPORT`, and
its exact 33-field final control block matched.

The report recorded repository-only execution with no repository mutation,
Page Chat history, legacy extract, reconciliation report, or external research;
zero material knowledge gaps and zero genuine conflicts; and no reopening of
Fiches techniques, Inventaire, Mouvements de stock, Fournisseurs, Tâches du
jour, Salariés, Planning, Pointage, Formalités, or General Information /
Restaurant Knowledge. It also recorded no migration of POS, Display,
Website/Site Agent, delivery/click-and-collect, Production,
Allergens/Nutrition, Marketing, or any other scope; no current
legal/compliance/accounting claim, allergen/nutrition conclusion, or
privacy/security conclusion; and no OpenSpec change or Product code change.
At report time Carte & menus Page Chat authority was correctly still active;
the verdict was `PASS` and `READY_FOR_AUTHORITY_CUTOVER: YES`.

The report is acceptance and discovery evidence only. It creates no Product
behavior, executable V1, implementation authorization, regulated conclusion,
environment enablement, readiness, deployment, or production authorization.

Following that PASS and the Human-authorized cutover on 2026-09-29, this
repository home is canonical knowledge for the exact bounded Carte & menus
scope described here. Carte & menus Page Chat is `LEGACY EVIDENCE ONLY` for
that same scope. Its history remains available as provenance and does not
override current repository authority.

No OpenSpec change was created or advanced. No Product/application code,
schema, migration, API, contract, authorization, permission, test, deployment,
or other completed migration was changed.

## Authority after cutover

- The repository is canonical knowledge for the exact migrated Carte & menus
  scope in this home.
- Carte & menus Page Chat is `LEGACY EVIDENCE ONLY` for that scope.
- Control Tower owns shaping, genuine-conflict resolution, Human Decision
  routing, cross-module reasoning, and governance coordination.
- Coding Agent owns repository discovery, analysis, and separately authorized
  execution and verification.

## Approved directions and current disposition

The four preserved Human facts have different meanings. The first three are
substantive Product directions; the fourth is UI-request provenance.

| Approved direction                                                                                                                | Current repository disposition                                                                                                                                                                                                       |
| --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Manage part of the restaurant's menu information without becoming an order, checkout, payment, accounting, or transaction system. | `DECIDED_NOT_IMPLEMENTED` as a real Carte capability. The route is only a placeholder and has no data or operations. The non-transaction boundary remains `CONFIRMED`.                                                               |
| Remain broadly suitable for restaurants without an unnecessarily heavy domain/database model.                                     | `DECIDED_NOT_IMPLEMENTED`. No cloud Carte domain model exists, so no implemented model can yet satisfy or violate this qualitative constraint. It approves no table count or architecture.                                           |
| Support `menu` as a combo/composition of multiple dishes.                                                                         | `DECIDED_NOT_IMPLEMENTED`. No cloud combo model, behavior, persistence, or UI exists. Exact composition remains unresolved.                                                                                                          |
| The Human requested a UI/Codex pack targeting `etablissement/carte-menus`.                                                        | `CONFIRMED` as request provenance only. The current repository route independently confirms `/etablissement/carte-menus`; the generated Page Chat pack is absent from the repository and is not Product or implementation authority. |

The exact executable V1 beyond these bounded directions is unresolved. Current
code shape and the historical generated pack cannot complete it.

## Current implementation evidence

| Evidence                        | Verified repository state                                                                                                                                                                                                                                                                                                                    | Boundary                                                                                                                                                  |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Canonical route                 | [`/etablissement/carte-menus`](<../../../apps/backoffice/src/app/(authenticated)/etablissement/carte-menus/page.tsx>) exists and is the route asserted by current navigation tests.                                                                                                                                                          | This independently resolves the route question; the historical request did not prove it.                                                                  |
| Navigation                      | [`backoffice-navigation.ts`](../../../apps/backoffice/src/components/backoffice/backoffice-navigation.ts) exposes `Carte & menus` under `Établissement` without a Carte-specific capability predicate. [`backoffice-navigation.test.ts`](../../../apps/backoffice/test/backoffice-navigation.test.ts) verifies the label, section and route. | Navigation visibility is not a Carte operation permission or capability enablement.                                                                       |
| Authentication shell            | The route is under the authenticated layout, which requires trusted active tenant context.                                                                                                                                                                                                                                                   | Generic authenticated access is not a Product-approved Carte role or operation policy.                                                                    |
| Page                            | The route renders the shared [`PlannedBackofficePage`](../../../apps/backoffice/src/components/backoffice/planned-backoffice-page.tsx) with static title/description and an empty state.                                                                                                                                                     | No Carte list, form, fixture, loader, action, mutation, persisted read, or recovery flow exists.                                                          |
| Cloud contracts and persistence | No Carte-specific cloud contract, schema, migration, repository, service, loader, action, API, record, or test was found.                                                                                                                                                                                                                    | There is no canonical executable cloud Carte, Menu, Catalogue, item, category, price, composition, state, publication, or synchronization truth.          |
| Seed-only shape                 | `packages/db-cloud/src/seed.ts` inserts a generic tenant-entitlement key named `menu.public`; no tracked Carte route, navigation rule, operation, repository, or consumer uses it.                                                                                                                                                           | This seed string is executable demo/configuration shape only. It does not approve public-menu behavior, entitlement semantics, publication, or readiness. |
| UI delivery                     | `docs/ui/pages/carte-menus/` is absent. No current Carte page pack, visual baseline, acceptance checklist, design review, or Browser QA evidence exists.                                                                                                                                                                                     | Historical generated pack and mockups remain Page Chat artifacts only.                                                                                    |
| OpenSpec and decisions          | No Carte/Menu/Catalogue normative main spec, active change, archived change, or dedicated ADR was found.                                                                                                                                                                                                                                     | This mission creates none.                                                                                                                                |
| Environment and release         | No Carte-specific environment, deployment, monitoring, recovery, external review, or production-authorization evidence exists.                                                                                                                                                                                                               | The capability is `NOT_ENABLED` and `NOT_ASSESSED`; global Backoffice remains `NOT_READY`.                                                                |

Implementation accounting treats the canonical route/navigation/authenticated
shell and its shared placeholder/test evidence as two material implementation
groups. The approved menu-information, proportionate-model, and combo
directions remain absent as real behavior.

## Capability and state matrix

| Capability                        | Product status                                                                  | Implementation                                                                       | Legal/tax, allergen/nutrition, privacy/security                                             | Environment and readiness                                                                     | Owner, actors and scope                                                                                                   | Explicit exclusions and open boundaries                                                                   |
| --------------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Carte/menu information management | `APPROVED` at bounded purpose level                                             | `NOT_STARTED`; authenticated placeholder only                                        | Exact price/tax and regulated content `UNVERIFIED`; privacy/security `UNVERIFIED`           | `NOT_ENABLED`; capability `NOT_ASSESSED`; Backoffice `NOT_READY`; no production authorization | Carte & menus semantic owner; exact actors/operations unresolved; route has trusted organization/establishment shell only | No order/payment/transaction ownership; exact V1, data owner, fields, tenancy and lifecycle open          |
| Lightweight/general-purpose model | `APPROVED` qualitative direction                                                | `NOT_STARTED`; no cloud model                                                        | `NOT_APPLICABLE` to the qualitative constraint; later data/privacy/security review required | No environment or readiness evidence                                                          | Product/architecture/data authority required                                                                              | No fixed table count, normalization ban, performance guarantee, or rejection of advanced concepts follows |
| Menu/formule combo                | `APPROVED` at high level                                                        | `NOT_STARTED` in cloud Carte                                                         | Price/tax/allergen/nutrition/privacy/security `UNVERIFIED` where later applicable           | Not enabled, assessed or production-authorized                                                | Carte & menus semantic owner; actors, establishment ownership and operations unresolved                                   | No sections, choices, supplements, nesting, propagation, pricing or lifecycle approved                    |
| Route and placeholder UI          | Requested target `CONFIRMED`; exact future UI unresolved                        | `/etablissement/carte-menus` and shared placeholder `IMPLEMENTED`; navigation tested | `NOT_APPLICABLE` to route existence; capability security policy still unresolved            | Repository code only; no page-pack QA or deployment evidence                                  | `apps/backoffice`; any authenticated active-tenant user currently reaches the generic shell                               | Route presence proves no Product fields, behavior, permission, persistence or readiness                   |
| Selling-price information         | Compatible with the approved non-transaction boundary; exact model `UNRESOLVED` | No cloud field or behavior                                                           | `REQUIRES_CURRENT_EXTERNAL_REVIEW` for HT/TTC/VAT, consumer display and fiscal meaning      | Not enabled or assessed                                                                       | Carte & menus is the high-level semantic source in the protected Fiches relationship; executable owner unresolved         | Not recipe cost, supplier price, accounting valuation, payment or price recommendation                    |
| POS and channel projections       | `UNRESOLVED` for cloud Carte                                                    | No cloud/POS/channel mapping, publication or synchronization                         | Provider, tax, consumer-information, privacy/security status `UNVERIFIED`                   | No channel readiness or production authorization                                              | Each runtime/channel retains separate ownership                                                                           | No identity mapping, automatic sync, retry, acknowledgment, override or write-back                        |

## Carte, Menu and Catalogue concept matrix

| Concept                              | Product status and semantic owner                                                                        | Source/classification and form                                                                          | Time/price/mutation/visibility                                                    | Consumers, write-back, implementation and retention                                              | Open questions                                                                                    |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------- |
| Carte                                | Exact concept `UNRESOLVED`; probable scope label only                                                    | Legacy/Human language; possible full offering; no structured cloud entity                               | No effective time, price context, mutation or visibility contract                 | No approved consumer/write-back; `NOT_STARTED`; retention absent                                 | One/many, relationship to Catalogue and categories, ownership/lifecycle                           |
| Menu as full offering                | Terminology `UNRESOLVED`                                                                                 | Ambiguous legacy usage; no separate entity                                                              | No approved attributes or state                                                   | No implementation or retention                                                                   | Whether this is synonymous with Carte or should be avoided                                        |
| Menu/formule combo                   | High-level concept `APPROVED`; Carte & menus semantic owner                                              | Composition of multiple dishes; exact structure unresolved                                              | Price, effective time, mutation, visibility and availability unresolved           | No consumer/write-back; `NOT_STARTED`; retention absent                                          | Fixed/configurable, references/snapshots, sections, choices, supplements, nesting and propagation |
| Catalogue                            | Exact concept and data owner `UNRESOLVED`                                                                | Possible collection/owner vocabulary; no cloud record                                                   | No lifecycle, price, mutation or visibility contract                              | No cloud implementation; local POS catalogue is separate and creates no write-back               | Carte/Catalogue relationship, shared versus establishment scope, item identity                    |
| Sellable item/dish                   | High-level menu-information notion only; exact identity `UNRESOLVED`                                     | Possible item; no approved enum or cloud structure                                                      | Selling price may later be context; all time/state/mutation semantics open        | No cloud implementation; not automatically a fiche, stock article, supplier offer or POS item    | Types, uniqueness, mappings, categories, variants, lifecycle                                      |
| Category/section                     | `PROPOSED`; owner unresolved                                                                             | Assistant/page-pack proposal only                                                                       | Ordering, visibility and cardinality unresolved                                   | No implementation, consumer or retention                                                         | Category versus section, hierarchy, global/per-Carte scope, membership and order                  |
| Displayed selling price              | Exact semantics `UNRESOLVED`; Carte & menus high-level semantic source for the protected Fiches boundary | Possible item/combo information, not transaction                                                        | HT/TTC/VAT, currency, effective date, history, override and visibility unresolved | No cloud implementation; Fiches may only consume a future approved projection with no write-back | Canonical owner, tax basis, channel prices, promotions and permissions                            |
| Availability/visibility/orderability | `PROPOSED` labels; concepts must remain distinct                                                         | UI/data proposals only                                                                                  | Actor, schedule, channel, reset and history unresolved                            | No implementation or write-back; stock does not determine them                                   | Exact states, transitions, source and relationship to publication/stock                           |
| Local POS catalogue/combo            | Separate POS Product authority; not Carte Product truth                                                  | Implemented restaurant-local structured data under Site Agent/`packages/db-pos`                         | Local pricing, availability, options, combo and historical snapshot behavior only | Consumed by local POS operations; no cloud write-back/sync; local retention rules apply          | Any future identity/projection/sync contract requires a separate decision                         |
| Channel projection                   | `UNRESOLVED`                                                                                             | No approved Website, Site Agent, Display, borne, click-and-collect, delivery or printed-menu projection | Publication/effective time/override/acknowledgment unresolved                     | No consumer contract, sync or write-back                                                         | Per-channel fields, errors/retry, provider rejection and readiness                                |

The implementation-only local POS types, schema fields, enums, prices,
availability, allergens, variants, instructions and combo rules remain POS
truth. They are not a proposed shortcut for cloud Carte.

## Ownership, authorization and tenancy boundaries

- **Carte & menus:** semantic owner for the bounded restaurant sellable-offering
  and selling-price context described here. Exact cloud data owner is absent.
- **Fiches techniques:** repository-canonical owner of reference recipes,
  ingredients, quantities, portions and theoretical cost presentation. A fiche
  is not a sellable item. Selling price is future read-only context in Fiches;
  no recommendation or write-back exists. `FT-01` through `FT-19` are unchanged.
- **Inventaire:** repository-canonical for its approved article/quantity/price
  directions. A stock/purchase article is not a sellable item; stock does not
  automatically determine availability. `INV-01` through `INV-18` are unchanged.
- **Mouvements de stock:** repository-canonical for its bounded movement
  directions. A sale or refund creates no cloud movement automatically.
  `MDS-01` through `MDS-18` are unchanged.
- **Fournisseurs:** repository-canonical for supplier, offer, supplier-side
  price and purchase-preparation directions. Supplier article/price is not a
  sellable item/price. `FOU-01` through `FOU-18` are unchanged.
- **POS/Site Agent:** owns restaurant-local catalogue, combos, orders, payments,
  tax-independent commercial snapshots and operational data through
  `packages/db-pos`. Cloud/POS persistence, identity and failure domains remain
  separate; no synchronization or mapping is approved.
- **Display:** owns its standalone media/runtime data. It consumes no cloud
  Carte projection and shares no persistence.
- **Website, Site Agent as a channel, borne, click-and-collect and delivery:** no
  Carte consumer, publication, orderability, provider, acknowledgment, retry,
  override or write-back contract is approved.
- **Marketing and Restaurant Knowledge:** retain their own descriptive/content
  authority. Restaurant Knowledge does not duplicate menu/catalogue facts and
  neither scope silently writes the other. `RK-01` through `RK-08` are unchanged.
- **Establishment Profile:** supplies no Carte data. Route grouping and trusted
  establishment context do not transfer profile ownership to Carte.
- **Authorization:** any user with a valid active tenant currently reaches the
  generic route shell. No Carte-specific read/create/edit/category/composition/
  price/availability/media/channel/publish/archive/delete operation catalogue,
  role mapping, resource predicate, or denial test exists.
- **Tenancy:** if establishment-owned cloud data is approved later, repository
  rules require trusted server-derived `organizationId` and `establishmentId`
  predicates and fail-closed authorization. Organization sharing, local
  overrides and cross-establishment copy/templates remain unresolved.

## Carte, item and category model

Confirmed Product scope requires menu information but does not approve a
canonical Carte, Catalogue, category or sellable-item entity. No item-type enum
for dish, drink, dessert, extra, packaging, service charge, formula or channel
item exists in cloud Carte authority. One versus multiple cartes, category
versus section, hierarchy, membership cardinality, empty-category behavior,
global versus per-Carte categories, ordering and channel-specific ordering are
unresolved.

The historical `cards`, `cardCategories`, `menuItems`, `sortOrder`,
drag-and-drop, active/hidden/available fields and proposed UI arrangement stay
`PROPOSED`. The local POS `menu_categories` and `menu_items` are implemented
only inside the separate restaurant-local runtime.

## Formule and combo model

The only approved cloud direction is support for a `menu` meaning a
combo/composition of multiple dishes. No implementation exists.

Fixed versus configurable composition, base versus derived price, sections,
choice groups, required/optional choices, minimum/maximum choices, included
items, supplements, `extraPrice`, item references versus snapshots, rename or
price propagation, deletion behavior, nesting, availability and versioning all
remain unresolved. The names `formulas`, `formulaSections` and
`formulaSectionItems` are historical assistant proposals, not approved tables
or fields. The implemented local POS combo model remains separate POS truth.

## Price, tax and cost model

- Selling price may be compatible with information management, but no cloud
  selling-price field or canonical owner/contract is implemented.
- HT/TTC/VAT, currency, effective dates, price history, promotions, channel
  prices, service prices, manual overrides and price permissions are unresolved.
- Displaying a price would not make Carte a payment or transaction system.
- Fiches owns theoretical recipe-cost presentation and may only read a future
  approved selling-price projection. It cannot recommend or write price.
- Fournisseurs owns supplier-side price directions. Supplier price is not
  selling price or accounting valuation and has no Carte write-back.
- No margin, ratio, recommendation, accounting, fiscal, tax or legal-compliance
  conclusion is created here. Exact regulated behavior requires qualified
  current external review.

## Visibility, availability, orderability and stock

Visibility, availability, orderability, publication and stock are independent
questions. The labels `active`, `visible`, `hidden`, `available`, `temporarily
unavailable`, `sold out`, `orderable`, `published`, `archived` and `in stock`
do not form an approved state machine.

No actor, scope, schedule, channel override, reset, source, history or
write-back is established. Establishment opening hours do not automatically
govern items. Inventaire quantity does not automatically set availability, POS
sales do not create cloud movements, and publication does not prove provider
acknowledgment or synchronization.

## Variants, options, modifiers, descriptions and media

Variants, sizes, modifier groups, required/optional choices, supplements,
removals, ingredient exclusions, inheritance, price deltas, availability and
cardinality are unresolved. A modifier is not an ingredient, an option is not
a recipe variant, and local POS shapes do not establish cloud Carte Product
approval.

Internal/customer-facing names, short/long descriptions, image/gallery,
storage owner, upload, alt text, translation and Marketing copy are unresolved.
No cloud Carte media or translation foundation is approved. Display media and
Personnel document storage belong to other bounded runtimes/scopes.

## POS, channels and publication

Cloud Carte and local POS currently have no shared identity, category mapping,
price mapping, tax/runtime configuration, modifier mapping, availability
contract, synchronization, conflict-resolution rule, local override, write-back
or offline contract. Similar labels do not create identity.

Website, Site Agent, Display, borne, click-and-collect, delivery providers and
printed menu have no approved Carte consumer contract. Publication,
synchronization, partial failure, provider rejection, retry, acknowledgment,
orderability and write-back remain unresolved. The seed-only `menu.public` key
does not approve or implement any of these behaviors.

## Allergens, nutrition and dietary labels

No cloud Carte allergen source, Human-validation rule, consumer-display rule,
ingredient declaration, dietary tag, vegan/vegetarian/halal claim, spicy badge
or nutrition behavior is approved or implemented. Names and recipes cannot be
used to derive verified allergens, and a tag is not legal certification.
Allergen, nutrition, food-safety and consumer-information behavior requires
separate Product authority and current qualified external review.

## Product, implementation, shape, legal and readiness axes

| Axis                         | Current conclusion                                                                                                                           |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Product Intent               | Three substantive high-level directions plus UI-target provenance are confirmed; exact executable V1 remains unresolved.                     |
| Implemented State            | Canonical authenticated route/navigation and shared placeholder exist; no Carte behavior, data or Carte-specific authorization exists.       |
| Executable Data Shape        | No cloud Carte schema/contract exists. A seed-only `menu.public` key and the complete local POS shapes do not establish cloud Product truth. |
| POS runtime truth            | Local catalogue/combo/order behavior is implemented and separately authoritative for POS only.                                               |
| Channel truth                | No cloud Carte projection/publication/synchronization contract exists.                                                                       |
| Legal/tax/allergen/nutrition | `UNVERIFIED`; exact included behavior requires current qualified external review.                                                            |
| Privacy/security             | `UNVERIFIED`; fields, actors, authorization, media, logs, retention and providers are undecided.                                             |
| Environment                  | Carte capability `NOT_ENABLED`; route repository presence is not environment evidence.                                                       |
| Readiness                    | Capability `NOT_ASSESSED`; Backoffice `NOT_READY`; no production authorization or deployment evidence.                                       |

## Grouped Human decisions required

Every packet remains `UNRESOLVED`. Legal/tax/allergen/nutrition/privacy/security
status is `UNVERIFIED` or `REQUIRES_CURRENT_EXTERNAL_REVIEW` where stated.

| ID    | Exact question and affected concepts                                                                                                                                                 | Current evidence and why unresolved                                                                                                                                              | Coding non-inference and required authority                                                                                                                                |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CM-01 | Define exact V1 and canonical meanings of Carte, Menu as offering, Menu/formule as combo, Catalogue, section and category.                                                           | Only bounded purpose/combo directions exist; route and historical UI artifacts cannot settle terminology. Regulated status is `UNVERIFIED`.                                      | Do not choose names or scope from code/mockups. Human Product and terminology authority required.                                                                          |
| CM-02 | Define canonical sellable-item identity, item types, uniqueness, establishment ownership and any organization sharing.                                                               | No cloud entity/contract exists; local POS and adjacent records are separate. Privacy/security `UNVERIFIED`.                                                                     | Do not invent an enum or equate dish, fiche, article, offer or POS item. Human Product plus architecture/data/tenancy authority required.                                  |
| CM-03 | Define Carte/category/section identity, hierarchy, membership, global/per-Carte scope, empty behavior and ordering.                                                                  | Historical tables, `sortOrder` and drag-and-drop are proposals.                                                                                                                  | Do not create hierarchy, cardinality or reorder semantics. Human Product/UI/data authority required.                                                                       |
| CM-04 | Define combo composition, fixed/configurable behavior, sections, choices/min/max, references/snapshots, propagation, deletion, nesting and availability.                             | High-level combo is approved; exact assistant tables/fields and local POS model have no cloud authority. Price/legal status `UNVERIFIED`.                                        | Do not reuse the proposed schema or POS rules. Human Product plus architecture/data authority required.                                                                    |
| CM-05 | Define variants, sizes, options, modifiers, supplements, removals, ingredient exclusions, inheritance, price deltas and cardinality.                                                 | All are proposal/open space; no cloud shape. Allergen/tax status `UNVERIFIED`.                                                                                                   | Do not import POS fields or equate modifiers with ingredients. Human Product/data and applicable external authority required.                                              |
| CM-06 | Define selling-price owner, HT/TTC/VAT, currency, effective dates, promotions, channel/service prices, history, overrides and permissions.                                           | Price may be information, but no approved contract exists. Tax/accounting/consumer status `REQUIRES_CURRENT_EXTERNAL_REVIEW`.                                                    | Do not infer a field, tax basis, margin, valuation or recommendation. Human Product/data/authorization plus qualified tax/accounting/legal authority required.             |
| CM-07 | Define visible/hidden/active/available/sold-out/orderable/published/archived/stock distinctions, actors, schedules, reset and history.                                               | Mockup labels exist only historically; Stock owners prohibit automatic inference. Legal/food-safety status `UNVERIFIED`.                                                         | Do not create a state machine or stock automation. Human Product for Carte/Inventaire/Mouvements plus data/operations authority required.                                  |
| CM-08 | Define names/descriptions, image/gallery, storage/upload, alt text, translation, Marketing copy and ownership.                                                                       | No cloud Carte media/translation contract exists; other media stores are separate. Privacy/security status `REQUIRES_CURRENT_EXTERNAL_REVIEW` if uploads/providers are included. | Do not reuse Display or Personnel storage or transfer Marketing/Restaurant Knowledge ownership. Human Product/UI/content/architecture/security/privacy authority required. |
| CM-09 | Define Fiche-to-sellable-item identity, zero/one/many cardinality, missing/multiple fiches, price/cost projection, variant and version behavior.                                     | Protected Fiches authority establishes only distinct identities, future read projection and no write-back. Accounting/allergen status `UNVERIFIED`.                              | Do not reopen `FT-*`, make recipes sellable items or change price from Fiches. Human Product for both scopes plus data/external authority required.                        |
| CM-10 | Define Inventaire article and Mouvements relationships, stock/availability projection, units, source events and any write-back.                                                      | Protected `INV-*`/`MDS-*` boundaries deny automatic identity, availability, depletion and refund reversal. Accounting/food-safety status `UNVERIFIED`.                           | Do not reopen protected packets or create stock automation. Human Product for all owners plus data/operations/external authority required.                                 |
| CM-11 | Define cloud Carte versus local POS item/category/combo identity, source ownership, mapping, price, tax/runtime config, sync, conflicts, overrides, write-back and offline behavior. | ADR-003 proves separate runtimes; no mapping or sync contract exists. Fiscal/security status `REQUIRES_CURRENT_EXTERNAL_REVIEW` where applicable.                                | Do not adopt local schema or sync data. Human Product for Carte/POS plus architecture/data/security/operations authority required.                                         |
| CM-12 | Define Website, Site Agent, Display, borne, click-and-collect, delivery and printed-menu consumers, projected fields and orderability.                                               | No channel contract exists. Provider/consumer/legal/privacy status `REQUIRES_CURRENT_EXTERNAL_REVIEW`.                                                                           | Do not migrate channels or assume public visibility. Human Product for each owner plus provider/legal/privacy/security authority required.                                 |
| CM-13 | Define publication versus synchronization, acknowledgments, errors, retries, partial success, provider rejection, overrides and write-back.                                          | No operation, queue, adapter, provider or history exists. Provider/privacy/security status `REQUIRES_CURRENT_EXTERNAL_REVIEW`.                                                   | Do not treat save/publish/sync/acknowledgment as synonyms. Human Product/architecture/provider/operations authority required.                                              |
| CM-14 | Define allergen source/validation/display, ingredient declarations, dietary labels/claims and nutrition.                                                                             | No approved cloud Carte behavior; local POS labels and recipe data are insufficient. Status `REQUIRES_CURRENT_EXTERNAL_REVIEW`.                                                  | Do not derive or certify claims. Human Product plus qualified allergen/nutrition/food-safety/legal authority required.                                                     |
| CM-15 | Define actors and read/create/edit/category/composition/price/availability/media/channel/publish/archive/delete permissions and tenant predicates.                                   | Generic authenticated shell only; navigation is unconditional and no operations exist. Privacy/security `UNVERIFIED`.                                                            | Do not infer from OWNER/MANAGER/STAFF labels or visibility. Human Product plus authorization/security/tenancy authority and denial tests required.                         |
| CM-16 | Define draft/active/published/unavailable/superseded/archive/delete/duplicate/version/schedule history, restore, retention and legal hold.                                           | No cloud persistence or policy; UI labels have no lifecycle authority. Legal/privacy/security status `REQUIRES_CURRENT_EXTERNAL_REVIEW`.                                         | Do not invent state machines, soft deletion, event sourcing or retention. Human Product/data/legal/privacy/security/operations authority required.                         |
| CM-17 | Define current UI scope and create/approve a page pack, states, interactions, accessibility, responsive behavior and Browser QA.                                                     | Canonical route/placeholder are known; historical pack is absent and non-authoritative.                                                                                          | Do not reconstruct generated mockups as approval. Human Product/UI authority plus repository workflow and QA evidence required.                                            |
| CM-18 | Define environment enablement, legal/tax/allergen/nutrition/privacy/security gates, deployment, monitoring, recovery, channel readiness and production authorization.                | No capability evidence; global Backoffice is `NOT_READY`. Status `REQUIRES_CURRENT_EXTERNAL_REVIEW`.                                                                             | Do not infer readiness from docs, route or checks. Applicable qualified reviewers, operations and release authority required.                                              |

## Reconciliation accounting and conflict disposition

The counting unit is one material claim group in this ledger. Human directions,
implementation groups, proposal families, decision packets and superseded
legacy positions are counted separately.

| Disposition               | Count | Counted material                                                                                                                                                                                                                                                                                                       |
| ------------------------- | ----: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CONFIRMED`               |     8 | Exact Carte-only migration scope; information/non-transaction purpose; proportionate general-purpose direction; combo high-level requirement; UI-target provenance; independently verified canonical route; cloud/POS/Display runtime separation; protected cross-module ownership/non-write-back boundaries           |
| `IMPLEMENTED`             |     2 | Canonical route/navigation/authenticated shell; shared placeholder and focused navigation assertions                                                                                                                                                                                                                   |
| `DECIDED_NOT_IMPLEMENTED` |     3 | Real menu-information capability; proportionate cloud domain/data model; cloud menu/formule combo capability                                                                                                                                                                                                           |
| `PROPOSED`                |    10 | Carte/category/item entity family; formula entity family; reusable item references; displayed-price data semantics; allergen/dietary tags; multiple cartes; active/hidden/available states; sort/drag-and-drop; tabs/selector/category/item/formula UI; cloud catalogue as a data owner/source distinct from local POS |
| `UNRESOLVED`              |    18 | `CM-01` through `CM-18`                                                                                                                                                                                                                                                                                                |
| `CONFLICT`                |     0 | Four legacy candidates reconcile as terminology, intent/implementation, runtime, or state distinctions rather than disagreement between current authorities                                                                                                                                                            |
| `OBSOLETE`                |     3 | Assistant's three-table-only V1; `menus` as settled Carte naming; early overbroad mockup fields/modules                                                                                                                                                                                                                |

The four possible legacy conflicts are classified without autonomous Product
resolution:

1. `Menu` as whole offering versus combo remains a terminology decision in
   `CM-01`, not a contradiction between current authorities.
2. Selling-price information and the non-transaction boundary describe
   different dimensions; exact price semantics remain `CM-06`.
3. Cloud Carte and local POS are separate runtime owners; their future identity
   or synchronization remains `CM-11`.
4. Availability and stock are distinct; any future projection remains `CM-07`
   and `CM-10`.

## Explicit non-inferences

Do not infer that:

- Carte, Menu and Catalogue are synonyms;
- the current placeholder, navigation, static description or `menu.public`
  seed key defines the Product, operations, entitlement or public behavior;
- historical generated tables, fields, labels, mocks or page-pack files are
  approved or present in the repository;
- exact current V1 can be reconstructed from a local POS implementation;
- a sellable item is a fiche, recipe, Inventaire article, supplier offer or
  local POS item;
- selling price is recipe cost, supplier price, accounting valuation, payment
  or a recommendation;
- visibility, availability, orderability, publication and stock are the same;
- a route or authenticated shell grants a Carte-specific operation;
- establishment route grouping proves establishment-only data ownership or
  excludes a future organization-owned projection;
- local POS catalogue/combo fields may be copied to cloud persistence;
- Website, Site Agent, Display or ordering channels consume Carte data;
- a name, recipe, tag or local POS allergen code is a verified regulated claim;
- documentation checks prove environment enablement, legal validity, provider
  readiness, deployment or production authorization.

## Completed-migration and separate-scope safety

Fiches techniques, Inventaire, Mouvements de stock, Fournisseurs, Tâches du
jour, Salariés, Planning, Pointage, Formalités, General Information / Restaurant
Knowledge, Avis and Satisfaction remain unchanged and repository-canonical for
their exact completed scopes. This reconciliation changes none of their
decision packets or Page Chat roles.

POS, Display, Website/Site Agent, borne, click-and-collect, delivery,
Production, Allergens/Nutrition, Marketing and other Page Chats were not
migrated. No full Stock, ordering, publication or channel domain was created.

## Discovery path and accepted fresh-agent result

A repository-only agent should navigate:

1. [`docs/README.md`](../../README.md) and
   [`PRODUCT_KNOWLEDGE.md`](../../PRODUCT_KNOWLEDGE.md);
2. [`MODULE_REGISTRY.md`](../../MODULE_REGISTRY.md) and this home;
3. the current [route](<../../../apps/backoffice/src/app/(authenticated)/etablissement/carte-menus/page.tsx>),
   shared placeholder, navigation and focused navigation tests;
4. [`packages/db-cloud`](../../../packages/db-cloud) and
   [`packages/contracts`](../../../packages/contracts) to confirm the absence
   of a cloud Carte model and the seed-only `menu.public` shape;
5. the protected [Fiches techniques](../technical-sheets/README.md),
   [Inventaire](../inventory/README.md), [Mouvements de stock](../stock-movements/README.md),
   [Fournisseurs](../suppliers/README.md) and
   [General Information / Restaurant Knowledge](../establishment/general-information/README.md)
   homes only for their boundaries;
6. [POS Product Knowledge](../../products/pos/README.md), the
   [POS specification](../../products/pos/PRODUCT_SPEC.md),
   [Site Agent](../../products/pos/site-agent/README.md) and
   [Display](../../products/display/README.md) only for separate runtime truth;
7. [`CURRENT_STATE.md`](../../CURRENT_STATE.md), the
   [Authority Model](../../AUTHORITY_MODEL.md),
   [Tenancy](../../architecture/TENANCY.md),
   [Database Boundaries](../../architecture/DATABASE_BOUNDARIES.md), and
   [Production Readiness](../../operations/PRODUCTION_READINESS.md).

Without Page Chat history, the legacy extract, or the reconciliation report, the
accepted fresh agent found the exact migration scope; three substantive
directions; UI-request provenance; canonical route and placeholder state;
absence of a current page pack, cloud model, or Carte operations; current V1
limits; terminology and concept status; combo requirement and open composition;
price/non-transaction/tax/cost boundaries; state/stock distinctions;
variants/media/schedule status; protected cross-module boundaries; POS/channel
separation; allergens/nutrition limits; authorization and tenancy state;
lifecycle/readiness axes; and all 18 `CM-*` packets.

The test passed with zero material gaps and zero genuine conflicts. At report
time it correctly found that Page Chat authority had not yet been retired. This
subsequent Human-authorized cutover changes only the bounded knowledge-authority
state recorded above: the repository is now canonical and Carte & menus Page
Chat is legacy evidence only for this exact scope.

## Related authority

- [`docs/AUTHORITY_MODEL.md`](../../AUTHORITY_MODEL.md)
- [`docs/LIFECYCLE_STATUS_MODEL.md`](../../LIFECYCLE_STATUS_MODEL.md)
- [`docs/architecture/DATABASE_BOUNDARIES.md`](../../architecture/DATABASE_BOUNDARIES.md)
- [`docs/architecture/TENANCY.md`](../../architecture/TENANCY.md)
- [`docs/operations/PRODUCTION_READINESS.md`](../../operations/PRODUCTION_READINESS.md)
- [`docs/features/technical-sheets/README.md`](../technical-sheets/README.md)
- [`docs/features/inventory/README.md`](../inventory/README.md)
- [`docs/features/stock-movements/README.md`](../stock-movements/README.md)
- [`docs/features/suppliers/README.md`](../suppliers/README.md)
- [`docs/features/establishment/general-information/README.md`](../establishment/general-information/README.md)
