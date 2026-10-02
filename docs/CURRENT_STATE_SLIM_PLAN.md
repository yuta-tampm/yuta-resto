# YUTA CURRENT_STATE Slimming Plan

Status: APPROVED

Visibility: Engineering

Owner: YUTA product and engineering

Planned: 2026-08-27

## 1. Goal and target role

Keep [`CURRENT_STATE.md`](CURRENT_STATE.md) as the repository-wide
current-state summary and routing layer. After slimming, it should let a reader
quickly understand YUTA's active product/runtime families, the bounded maturity
of major products, and where to read authoritative detail.

The target document should be:

- cross-product rather than dominated by one feature;
- current rather than a Phase/Wave/F-number chronology;
- routing-first, with links to approved Product Knowledge Homes, the Module
  Registry, page-pack evidence, and readiness sources;
- explicit that repository implementation is not deployed-production evidence;
  and
- concise enough that agents can scan it before opening a scoped source.

It must not become a Product Knowledge Home, architecture authority, lifecycle
registry, UI delivery log, phase history, or production-readiness register.
Accepted decisions, the approved Authority Model, executable implementation,
and dated operational evidence retain their existing roles.

This plan does not impose a fixed line target. Completeness of routing and
preservation of unique information take priority over an arbitrary reduction.

## 2. Current structure inventory

The current file has 832 lines. Sizes below include each level-two heading and
its content up to the next level-two heading.

| Current section                | Approx size | Current role                                                                    | Main issue                                                                                                                |
| ------------------------------ | ----------: | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `Product scope`                |    21 lines | Cross-runtime scope and separation summary.                                     | Useful, but repeats architecture and mixes durable boundaries with Backoffice product detail.                             |
| `Implemented`                  |    48 lines | Repository implementation highlights.                                           | Starts as a useful overview, then expands into route-level POS behavior and Phase 5 QA detail.                            |
| `Back-office surface maturity` |   580 lines | Integrated/prototype/planned grouping plus detailed Personnel delivery history. | Seventy percent of the document; mixes Product Knowledge, lifecycle, UI delivery, provider evaluation, QA, and readiness. |
| `Active and partial work`      |    11 lines | High-level Booking, Reputation, and external dependency summary.                | Useful orientation, but duplicates feature status and readiness sources.                                                  |
| `Planned`                      |     7 lines | Reserved Platform Admin and future-module direction.                            | Broad and useful, but must route to the Registry/architecture without creating Product Decision values.                   |
| `Documentation status`         |   155 lines | Documentation routing followed by F03–F07 Personnel chronology.                 | The first paragraphs are routing; the remaining content is misplaced delivery/provenance detail.                          |

The 580-line Backoffice section contains four materially different roles:

- an integrated/data-backed surface list and bounded Booking/Reputation detail;
- a fixture-prototype list and safety warning;
- current Personnel capability summaries; and
- extensive Formalités, Documents, Register, OCR/AI, F02–F08, and Wave D–G
  chronology.

These roles must be handled separately rather than deleting the whole section.

## 3. Section-by-section action map

Allowed actions are `KEEP`, `ROUTE`, `CONDENSE`, `HISTORICAL`, and
`NEEDS REVIEW`. `HISTORICAL` means remove from the future current summary only
after its destination/provenance is verified; it does not authorize deleting or
archiving the source evidence.

| Current section / content block                                                                                 | Action               | Keep in CURRENT_STATE?                                                                      | Destination / canonical source                                                                                                                                                                 | Reason                                                                                                                                       | Confidence                                                  |
| --------------------------------------------------------------------------------------------------------------- | -------------------- | ------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| Document metadata and purpose                                                                                   | `KEEP`               | Yes, revised to state the summary/routing role.                                             | [`AUTHORITY_MODEL.md`](AUTHORITY_MODEL.md) and [`README.md`](README.md).                                                                                                                       | Readers need scope and authority warnings at entry.                                                                                          | High                                                        |
| `Product scope` runtime-family overview                                                                         | `CONDENSE`           | Yes.                                                                                        | [ADR-001](decisions/ADR-001-runtime-families-and-product-visibility.md), [ADR-003](decisions/ADR-003-database-ownership-boundaries.md), and architecture docs.                                 | Cloud, POS, and Display separation is essential orientation, but durable rules should be linked rather than repeated.                        | High                                                        |
| `Product scope` detailed Backoffice exclusions and rooms/tables wording                                         | `ROUTE`              | Keep only a short public/local visibility and bounded Backoffice statement.                 | [`PRODUCT_KNOWLEDGE.md`](PRODUCT_KNOWLEDGE.md), Establishment Home, and Module Registry.                                                                                                       | Detailed ownership belongs to scoped sources; Rooms/Tables lifecycle remains unresolved.                                                     | High for routing; review required for Rooms/Tables wording. |
| `Implemented` monorepo/packages/runtime foundations                                                             | `CONDENSE`           | Yes, as a short repository foundation summary.                                              | [`REPOSITORY_MAP.md`](REPOSITORY_MAP.md), architecture, manifests, and code/tests.                                                                                                             | Useful cross-product context; implementation claims must remain repository-scoped.                                                           | High                                                        |
| `Implemented` Identity / Access, Public Web, Booking, Today, Establishment, Personnel, POS, and Display bullets | `ROUTE`              | Yes, one bounded line per major product or a compact product table.                         | Approved homes, public feature docs, POS docs, and Module Registry.                                                                                                                            | Prevents broad summary text from overriding more specific current sources.                                                                   | High                                                        |
| POS required-options implementation paragraph                                                                   | `HISTORICAL`         | No detailed behavior; retain only “local ordering is implemented” if needed.                | [`products/pos/README.md`](products/pos/README.md), [`pos-order-items` page pack](ui/pages/pos-order-items/README.md), and current code/tests.                                                 | Exact option/allergy/transaction behavior is already preserved in scoped current evidence.                                                   | High                                                        |
| POS Management Reports Phase 5 paragraph                                                                        | `HISTORICAL`         | Keep at most one repository-scope Reports mention.                                          | [`products/pos/README.md`](products/pos/README.md), [`pos-management-reports` page pack](ui/pages/pos-management-reports/README.md), Site Agent Home, and release-specific readiness evidence. | Viewport, focus, QA, service-day, and deployment-preflight detail is page-pack/operations evidence.                                          | High                                                        |
| Kitchen read model, SSE, polling, and chime paragraph                                                           | `HISTORICAL`         | Keep at most one bounded Kitchen capability mention.                                        | [`products/pos/README.md`](products/pos/README.md), [`pos-kitchen` page pack](ui/pages/pos-kitchen/README.md), Site Agent Home, and QA checklist.                                              | Detailed operational behavior is preserved in POS Product Knowledge and UI evidence.                                                         | High                                                        |
| `Back-office surface maturity` introduction                                                                     | `KEEP` / `CONDENSE`  | Yes.                                                                                        | Module Registry and Product Knowledge routing.                                                                                                                                                 | The warning that navigation visibility does not prove implementation remains valuable.                                                       | High                                                        |
| Integrated/data-backed surface list                                                                             | `CONDENSE`           | Yes, as grouped orientation without lifecycle values.                                       | Module Registry plus Identity / Access, Today, Establishment, Booking, and Reputation sources.                                                                                                 | A short maturity map is useful; detailed state belongs to scoped sources.                                                                    | High                                                        |
| Reservation routes, mutations, states, and timezone paragraphs                                                  | `ROUTE`              | No detailed flow.                                                                           | [`features/public-booking/README.md`](features/public-booking/README.md) and [`STATUS.md`](features/public-booking/STATUS.md).                                                                 | The feature sources already retain current bounded implementation and remaining work.                                                        | High                                                        |
| Reputation canonical-route and connector paragraphs                                                             | `ROUTE`              | No route-level detail; retain a one-line product summary.                                   | [`features/reputation/README.md`](features/reputation/README.md), [`STATUS.md`](features/reputation/STATUS.md), and Module Registry.                                                           | The current feature pair separates implemented connector foundation from incomplete synchronization.                                         | High                                                        |
| Fixture prototype warning                                                                                       | `KEEP` / `CONDENSE`  | Yes, as a short rule plus a link.                                                           | Module Registry rows and Today Home for future aggregation boundaries.                                                                                                                         | Prevents fixture UI from being described as an implemented product capability.                                                               | High                                                        |
| Room/table map, compliance monitoring, and creative studio classifications                                      | `NEEDS REVIEW`       | Preserve current bounded wording until each surface has a reviewed registry/source mapping. | Establishment Home for Rooms/Tables boundary; Today Home for future Compliance aggregation; current route/code evidence.                                                                       | These surfaces do not all have dedicated registry rows, so the slim summary must not invent lifecycle values.                                | Medium                                                      |
| Stock inventory, movements, and suppliers prototype list                                                        | `ROUTE`              | Keep one grouped prototype statement, no lifecycle table.                                   | Module Registry Stock rows and Today Home.                                                                                                                                                     | Registry confirms fixture-backed prototype implementation with unresolved Product Decision status.                                           | High                                                        |
| Formalités Phase 2–4 development-prototype chronology                                                           | `HISTORICAL`         | Keep one bounded present-state sentence.                                                    | Personnel Home and [`backoffice-equipe-formalites-personnel` page pack](ui/pages/backoffice-equipe-formalites-personnel/README.md).                                                            | The approved Home distinguishes prototype from durable scope; the page pack preserves delivery evidence.                                     | High                                                        |
| Formalités Phase 5, legal-review brief, F08, F5-07, and F5-08 detail                                            | `HISTORICAL`         | Keep only durable-scope status separation and readiness routing.                            | Personnel Home, Formalités page pack, Module Registry, and Production Readiness.                                                                                                               | Product/operational decisions and provenance exist in scoped sources; summary must not reproduce them.                                       | High                                                        |
| Salariés current dossier/read/create/edit/departure/history paragraphs                                          | `CONDENSE` / `ROUTE` | Yes, one repository-scope Personnel summary.                                                | Personnel Home and [`backoffice-equipe-salaries` page pack](ui/pages/backoffice-equipe-salaries/README.md).                                                                                    | Current capability matters cross-product; field, interaction, audit, and QA detail does not.                                                 | High                                                        |
| F02 employee-creation reconciliation                                                                            | `HISTORICAL`         | No detailed chronology.                                                                     | Salariés page pack sections for F02.                                                                                                                                                           | The full page pack retains decisions, interaction boundaries, and QA provenance.                                                             | High                                                        |
| CDD reason/weekly-duration, Documents, amendments, and secure-file implementation detail                        | `ROUTE`              | Keep a short development-only Documents summary.                                            | Personnel Home, Salariés page pack, executable schema/code, and Production Readiness.                                                                                                          | Current boundary is relevant; schema/field/file-processing detail belongs to owning evidence.                                                | High                                                        |
| Wave D `À traiter` and Wave E Register delivery/QA history                                                      | `HISTORICAL`         | Keep current bounded summaries for development-only overview/Register only.                 | Salariés page pack and [`backoffice-equipe-registre-personnel` page pack](ui/pages/backoffice-equipe-registre-personnel/README.md).                                                            | Wave and viewport history is preserved in page packs.                                                                                        | High                                                        |
| Wave F synthetic extraction and provider-neutral design                                                         | `HISTORICAL`         | Keep one sentence that external real-file OCR/AI is not authorized.                         | Personnel Home, Salariés page pack, and Production Readiness.                                                                                                                                  | Detailed phases are implementation/design evidence, not cross-product summary.                                                               | High                                                        |
| Wave G Phase 0–8 provider, corpus, prompt, benchmark, cost, QA, and local-apply chronology                      | `HISTORICAL`         | Keep only a bounded synthetic/development evaluation statement and production prohibition.  | Salariés page pack, [`OPENAI_PROVIDER_ELIGIBILITY.md`](operations/OPENAI_PROVIDER_ELIGIBILITY.md), and Production Readiness.                                                                   | The page pack contains Wave G evidence; model runs, token/cost results, prompts, fixtures, and approvals should not dominate current state.  | High                                                        |
| Orphan `no-external-call disclosure` fragment after Phase 8                                                     | `NEEDS REVIEW`       | Preserve until its intended source/context is confirmed.                                    | Compare Git history and the Salariés Wave G Phase 8 sources.                                                                                                                                   | It is a sentence fragment and exact text was not found in the current page-pack corpus; do not silently discard possible provenance.         | High that review is required.                               |
| Planned empty surfaces and durable Formalités list                                                              | `CONDENSE` / `ROUTE` | Keep only grouped planned/prototype distinctions.                                           | Module Registry, Personnel Home, Today Home, and current code for unregistered surfaces.                                                                                                       | Prevents planned routes from becoming Product Decision claims and keeps prototype/durable Formalités separate.                               | High except unregistered surfaces.                          |
| `Active and partial work`                                                                                       | `CONDENSE` / `ROUTE` | Yes, as a short “open work/readiness” section.                                              | Booking Status, Reputation Status, Module Registry, and Production Readiness.                                                                                                                  | Useful cross-product orientation without duplicating status detail.                                                                          | High                                                        |
| `Planned` Platform Admin and future modules                                                                     | `CONDENSE`           | Yes, one short reserved/future paragraph.                                                   | Module Registry, Repository Map, and architecture overview.                                                                                                                                    | The reserved boundary is approved but the capability is not implemented; additional modules require scoped decisions.                        | High                                                        |
| `Documentation status` reset/history paragraph                                                                  | `HISTORICAL`         | No, unless one brief historical pointer is retained.                                        | Documentation Policy, Git history, and the cleanup audit.                                                                                                                                      | It describes previous cleanup policy, not product current state.                                                                             | High                                                        |
| `Documentation status` readiness/deployment/UI catalog routing                                                  | `ROUTE`              | Yes, in a compact “How to read this summary” section.                                       | Production Readiness, Deployment, and `packages/ui/src/index.ts`.                                                                                                                              | The source routing remains valid but should not be mixed with product chronology.                                                            | High                                                        |
| F03–F07 chronology under `Documentation status`                                                                 | `HISTORICAL`         | No detailed chronology.                                                                     | Salariés page pack F03–F07 sections, Personnel Home, and current code/tests.                                                                                                                   | Misplaced delivery history is fully represented by scoped sources; selected current capability outcomes can remain in the Personnel summary. | High                                                        |

No action in this map authorizes deleting content or changing lifecycle values.

## 4. Product/runtime target outline

The approved outline is based on current YUTA products and authority, not a
generic template:

1. **Purpose and how to read this summary**
   - repository summary role;
   - link to Authority Model, Product Knowledge, Module Registry, and readiness;
   - repository state versus live deployment warning.
2. **Runtime families and durable separation**
   - Cloud/public;
   - restaurant-local POS + Site Agent;
   - standalone Display;
   - links to ADR-001, ADR-003, and architecture.
3. **Cross-product current snapshot**
   - Public Website;
   - Identity / Access and Backoffice foundation;
   - Public Booking / Reservations;
   - Reputation / Public Feedback;
   - Establishment;
   - Today;
   - Personnel;
   - POS and Site Agent;
   - Display;
   - reserved Platform Admin.
4. **Backoffice maturity at a glance**
   - integrated/data-backed families;
   - fixture prototypes;
   - planned placeholders;
   - no duplicated lifecycle table.
5. **Readiness and external dependencies**
   - cross-product warning and links only;
   - no copied gate register or provider benchmark chronology.
6. **Current routing map**
   - direct links to Product Knowledge Homes, feature statuses, POS docs,
     page-pack index, operations, and Module Registry.

The snapshot should state bounded outcomes in prose and route all five lifecycle
dimensions to the Module Registry. It should not copy registry rows.

## 5. Product Knowledge routing map

| Topic currently detailed in CURRENT_STATE | Future summary in CURRENT_STATE                                                                                                                                                | Route to                                                                                                                                              |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Personnel                                 | OWNER-only establishment-scoped dossier is implemented in the repository; Documents, Register, and Formalités have distinct development/production boundaries.                 | [Personnel Home](features/personnel/README.md), [Module Registry](MODULE_REGISTRY.md), and Salariés/Register/Formalités page packs.                   |
| Today                                     | Implemented establishment dashboard over current source-owned Reservations, service-period, and Reputation projections; future families are separate from current integration. | [Today Home](features/today/README.md), [ADR-005](decisions/ADR-005-today-operational-steering.md), and Today page pack.                              |
| Establishment                             | Implemented bounded cloud establishment profile and editor; Booking-owned schedules and local POS establishment data remain separate.                                          | [Establishment Home](features/establishment/README.md), [ADR-006](decisions/ADR-006-cloud-establishment-profile-context.md), and relevant page packs. |
| Identity / Access                         | Repository has authentication/session and tenant/membership foundations; unresolved workflows remain unresolved despite Home approval.                                         | [Identity / Access Home](features/identity-access/README.md), authentication/tenancy architecture, and Module Registry.                               |
| Site Agent                                | Restaurant-local runtime owns POS APIs, `packages/db-pos`, realtime, printing, and device boundaries; live site evidence is separate.                                          | [Site Agent Home](products/pos/site-agent/README.md), POS Home, ADR-003, Deployment, and Module Registry.                                             |
| Display                                   | Standalone local signage runtime owns its database and media boundary; deployment/device readiness is not inferred.                                                            | [Display Home](products/display/README.md), ADR-003, and operations evidence.                                                                         |
| Public Booking                            | Bounded public and Backoffice reservation flows are implemented in the repository with remaining release/readiness work.                                                       | [Public Booking README](features/public-booking/README.md), [Booking Status](features/public-booking/STATUS.md), ADR-002, and Module Registry.        |
| Reputation                                | Direct feedback and bounded inbox/connector foundations are implemented; end-to-end provider synchronization and publication remain separately scoped.                         | [Reputation README](features/reputation/README.md), [Reputation Status](features/reputation/STATUS.md), ADR-004, and Module Registry.                 |
| POS                                       | Restaurant-local ordering, payment, kitchen, printing, management, and reports are implemented behind Site Agent; environment/readiness is release-specific.                   | [POS Home](products/pos/README.md), [Site Agent Home](products/pos/site-agent/README.md), POS page-pack index, QA checklist, and Deployment.          |
| Public Website                            | Public marketing/legal/integration surface exists; public visibility must not expose local operational capabilities.                                                           | [Public Website](features/public-website/README.md), ADR-001, and Module Registry.                                                                    |

These future summaries are routing proposals, not new lifecycle assignments or
production claims. Step 6.2B2 must verify the final wording against the current
registry and owning sources at execution time.

## 6. UI chronology map

| Chronology block                                                                        | Unique information?                                                                                              | Existing page-pack/source                                                                             | Proposed treatment                                                                                        |
| --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| POS Reports Phase 5 viewports, focus, and state QA                                      | No unique authority found in CURRENT_STATE.                                                                      | [`pos-management-reports`](ui/pages/pos-management-reports/README.md), POS Home, QA checklist.        | `HISTORICAL` from current summary; keep one Reports capability line and route to evidence.                |
| Kitchen bounded read model, SSE, polling, TV layout, and chime delivery                 | No; current behavior/evidence exists in scoped POS sources.                                                      | [`pos-kitchen`](ui/pages/pos-kitchen/README.md), POS Home, Site Agent Home.                           | `HISTORICAL` detailed delivery; retain a bounded Kitchen summary.                                         |
| Required-option pre-add flow                                                            | No; behavior and QA are preserved elsewhere.                                                                     | [`pos-order-items`](ui/pages/pos-order-items/README.md), POS Home, QA checklist.                      | `HISTORICAL` detailed delivery; route from POS summary.                                                   |
| Formalités Phases 2–5, F5-07/F5-08, and F08                                             | No for delivery chronology; current prototype/durable distinction remains material.                              | [Formalités page pack](ui/pages/backoffice-equipe-formalites-personnel/README.md) and Personnel Home. | Remove Phase sequence from summary; retain one current prototype sentence and one durable-scope sentence. |
| Salariés F02–F07                                                                        | No after mapping; the Salariés pack contains the decisions, interaction specs, plans, QA, and as-built evidence. | [Salariés page pack](ui/pages/backoffice-equipe-salaries/README.md) and its companion files.          | `HISTORICAL` from current summary; keep a current Personnel capability summary.                           |
| Wave D `À traiter`                                                                      | No; detailed development-only scope and QA are in the Salariés pack.                                             | Salariés page pack.                                                                                   | `HISTORICAL`; mention only as a development-only derived overview if needed.                              |
| Wave E Register                                                                         | No; Register source records scope, corrections, transient export, and QA.                                        | [Register page pack](ui/pages/backoffice-equipe-registre-personnel/README.md) and Personnel Home.     | `HISTORICAL`; keep a one-line development-only Register summary.                                          |
| Wave F synthetic extraction                                                             | No; current boundary and delivery provenance exist in Personnel/page-pack sources.                               | Personnel Home and Salariés page pack.                                                                | `HISTORICAL`; retain prohibition on treating synthetic evidence as production approval.                   |
| Wave G Phases 0–8, model/prompt/corpus comparisons, usage, cost, and provider-backed QA | No for detailed chronology; Wave G is extensively recorded across the Salariés page pack.                        | Salariés page pack, Provider Eligibility dossier, and Production Readiness.                           | `HISTORICAL`; keep only the current development/synthetic boundary and real-file/production prohibition.  |
| Orphan Phase 8 `no-external-call disclosure` fragment                                   | Unclear.                                                                                                         | No exact matching sentence found in current Personnel/page-pack/operations sources.                   | `NEEDS REVIEW`; compare Git history and intended Phase 8 paragraph before removing it.                    |

Page packs remain unchanged and searchable. `HISTORICAL` here changes only what
belongs in the current summary; it does not archive or delete UI evidence.

## 7. Production/readiness map

| Current statement family                                                             | Future treatment                                                                                                                | Authority / evidence                                                                                            |
| ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| General production/deployment distinction                                            | Keep one cross-product warning: repository implementation and local QA do not prove a deployed production version or readiness. | Authority Model, Lifecycle Status Model, Production Readiness, and dated deployment/runtime evidence.           |
| Public Booking blockers                                                              | Route; do not duplicate individual gates or promote `BLOCKED`.                                                                  | Booking Status, Module Registry, and `BOOK-01` in Production Readiness.                                         |
| Reputation/provider blockers                                                         | Route; retain only that external synchronization/release work remains separately gated.                                         | Reputation Status, Module Registry, and `REPUTATION-01`.                                                        |
| Personnel legal/privacy/template/storage/scanning/signature gates                    | Keep a short high-risk boundary, then route all detail.                                                                         | Personnel Home and `PERSONNEL` gates in Production Readiness.                                                   |
| External personnel OCR/AI prohibition                                                | Keep the prohibition at summary level; route provider/account/model/corpus details.                                             | Personnel Home, `AI_PERSONNEL` gates, and Provider Eligibility dossier.                                         |
| Personal OpenAI sandbox, synthetic benchmark, prompts, token/cost and request counts | Remove from the current summary after confirming page-pack provenance; do not translate it into readiness.                      | Salariés page pack and dated provider evidence. Synthetic/personal-project results are not production evidence. |
| POS timezone, devices, printer, host, migration, backup, and release evidence        | State only that readiness is release/site-specific and route detail.                                                            | Module Registry, `POS-01`, Deployment, POS QA, and dated release evidence.                                      |
| Site Agent live environment                                                          | Do not infer deployment from repository implementation.                                                                         | Site Agent Home, Module Registry, Deployment, and dated runtime evidence.                                       |
| Display deployment/device/media readiness                                            | Do not add a readiness claim; route to its Home and operations evidence.                                                        | Display Home, Module Registry, and Production Readiness when a scoped gate exists.                              |
| Global cloud/company/legal/security/vendor readiness                                 | Route from one high-level statement; do not copy the gate table.                                                                | Production Readiness.                                                                                           |

Step 6.2B2 must not copy lifecycle values from memory or legacy prose. If it
uses a value, it must match the current bounded Module Registry/Readiness source
and remain explicitly scoped.

## 8. Planned / prototype surface map

| Surface                                                                    | Current evidence                                                                                                                            | Future CURRENT_STATE treatment                                                                                                                               |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Stock Inventory, Suppliers, and Movements                                  | Fixture-backed `PROTOTYPE` repository slices; Product Decision unresolved in Module Registry.                                               | One grouped fixture-prototype statement plus Registry link; do not call the product capability implemented.                                                  |
| Technical Sheets                                                           | Placeholder; Registry records `NOT_STARTED` / `NOT_ENABLED` with unresolved Product Decision.                                               | Group under planned placeholders and route to Registry; do not infer approval.                                                                               |
| Planning, Pointage, and Tâches du jour                                     | Placeholder routes; their own Product Decision values remain unresolved, while Today has separately approved future aggregation categories. | Keep source capability status separate from Today future aggregation; route to Personnel/Today Homes and Registry.                                           |
| Durable Formalités                                                         | `PROPOSED`, not started, not enabled; development prototype is a separate bounded capability.                                               | Preserve the two-scope distinction in two short statements and route to Personnel Home/Registry.                                                             |
| Rooms and Tables                                                           | Current UI prototype wording exists, but Establishment Home explicitly says ADR-006 does not approve detailed Rooms/Tables lifecycle.       | `NEEDS REVIEW`; keep bounded current wording until a reviewed registry/source assignment exists.                                                             |
| Compliance and Creative Studio                                             | Fixture/demo wording exists, but no dedicated current registry rows were found.                                                             | `NEEDS REVIEW`; do not invent Product Decision or environment values during slimming.                                                                        |
| Menu content, internal resources, marketing creation, modules/subscription | Listed as planned/empty in CURRENT_STATE without a dedicated approved source identified by this plan.                                       | `NEEDS REVIEW`; retain a short unresolved summary without inferring Product Decision, and do not remove it until a dedicated source/Registry mapping exists. |
| Platform Admin                                                             | Reserved runtime boundary, no tracked app; Registry records the bounded reserved status.                                                    | Keep one sentence and route to Registry/architecture.                                                                                                        |

The future summary should use labels such as “fixture-backed UI prototype” and
“planned placeholder” as repository descriptions, not as substitutes for the
five lifecycle dimensions.

## 9. Historical destination strategy for CURRENT_STATE-only chronology

Most long chronology has an existing destination:

- Personnel F02–F07 and Waves D/F/G: Salariés page pack;
- Wave E: Register page pack;
- Formalités phases and F08: Formalités and Salariés page packs;
- POS delivery/QA: route-specific POS page packs and POS docs;
- Booking/Reputation current details: feature README/STATUS pairs; and
- production/provider gates: Production Readiness and Provider Eligibility.

For any statement not found in those sources, Step 6.2B2 must apply this order:

1. preserve a selected current milestone in the slim summary when it is still
   cross-product and unique;
2. mark it `NEEDS REVIEW` and leave it in place when its current role is
   uncertain;
3. do not rely on Git-only recovery during Step 6.2B2; and
4. defer the archive destination and recovery strategy to a later cleanup step.

The orphan Phase 8 fragment is the only concrete CURRENT_STATE-only chronology
risk found by this plan. Step 6.2B2 may remove it only if its provenance is
positively identified from a current source or Git history. Otherwise it must
remain in `CURRENT_STATE.md` and be marked for later review. No archive path is
created in this step.

## 10. Risk list

| Risk                                                        | Affected section                                                          | Mitigation                                                                                                         |
| ----------------------------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Losing a unique product or data-ownership decision          | Personnel/Formalités and planned surfaces                                 | Map every removed paragraph to an approved Home, ADR, Registry row, page pack, or explicit review item.            |
| Losing implementation provenance                            | POS Phase 5, F02–F08, Waves D–G                                           | Keep page packs unchanged; link their README, and preserve unique chronology that has no verified destination.     |
| Introducing lifecycle drift while simplifying prose         | All product summaries and prototype/planned groups                        | Do not reproduce lifecycle tables; verify any retained value directly against Module Registry and Lifecycle Model. |
| Routing to a Home that is not approved                      | Product routing map                                                       | Only the six verified approved Homes are called canonical; public feature docs retain their current roles/status.  |
| Treating synthetic/local evidence as production proof       | Wave F/G, Personnel documents, POS QA                                     | Keep repository/environment/readiness dimensions separate and route to dated operational evidence.                 |
| Oversimplifying a production blocker                        | Active/partial work and readiness statements                              | Preserve a high-level warning and route to Production Readiness/feature status instead of paraphrasing every gate. |
| Losing prototype safety wording                             | Fixture prototype section                                                 | Retain the rule that fixture UI/local presentation is not a persisted capability.                                  |
| Inventing Product Decision for unregistered placeholders    | Rooms/Tables, Compliance, Creative, menu/resources/marketing/subscription | Keep `NEEDS REVIEW`; do not normalize from route/navigation wording.                                               |
| Archive policy is not approved                              | Any CURRENT_STATE-only chronology                                         | Preserve unique material during Step 6.2B2; decide archive and recovery strategy in a later cleanup step.          |
| External provider status has changed outside the repository | Wave G/provider submission                                                | Preserve the existing bounded repository wording unless newer dated, authorized repository evidence exists.        |
| Corrupted or orphan sentence hides provenance               | Wave G Phase 8 fragment                                                   | Remove only after positively identifying provenance; otherwise preserve it and mark it for later review.           |
| Broad summary becomes a second source of truth              | Entire target document                                                    | Keep routing-first structure, minimal bounded claims, and explicit authority disclaimer.                           |

## 11. Proposed execution scope for Step 6.2B2

### Files allowed to modify

- `docs/CURRENT_STATE.md` only.

No index/link update is required for the proposed outline because
`CURRENT_STATE.md` remains at its current path and is already indexed.

### Files explicitly protected

- all Product Knowledge Homes;
- `docs/MODULE_REGISTRY.md`;
- `docs/AUTHORITY_MODEL.md`;
- `docs/LIFECYCLE_STATUS_MODEL.md`;
- every page pack and page-pack index;
- accepted decisions;
- architecture documents;
- `docs/operations/PRODUCTION_READINESS.md`;
- all feature/product README, STATUS, Product Spec, operator, QA, and operations
  documents;
- code, schemas, contracts, tests, and runtime configuration; and
- all OpenSpec files and directories.

### Expected validation

- run `pnpm docs:check`;
- run a local/inbound Markdown link check for `CURRENT_STATE.md`;
- run targeted Markdown formatting;
- compare every retained lifecycle/readiness phrase to the current Module
  Registry and Production Readiness source;
- confirm all six approved Product Knowledge Homes remain canonical and linked;
- verify every historical paragraph removed from the current summary has a
  verified page-pack/source destination;
- confirm no unique information is lost;
- preserve any unique chronology without a verified destination and do not
  rely on Git-only recovery;
- confirm only `docs/CURRENT_STATE.md` changed in Step 6.2B2; and
- run repository-required read-only validation without changing generated or
  protected files.

Step 6.2B2 must not combine slimming with lifecycle normalization, archive
execution, task cleanup, Product Spec review, page-pack edits, or OpenSpec work.

## 12. Readiness for CURRENT_STATE slimming

Status: READY

### Safe sections to slim

- `Product scope`: condense to runtime families and route durable boundaries.
- `Implemented`: replace feature/detail bullets with a compact cross-product
  repository snapshot.
- integrated Booking/Reputation detail: route to feature README/STATUS sources.
- POS required-options, Reports, and Kitchen chronology: route to POS docs and
  page packs.
- Formalités Phase 2–5/F08 and Personnel F02–F07/Wave D–G chronology only where
  the page-pack destination has been verified.
- `Active and partial work`: condense to source links.
- `Documentation status`: retain routing, remove mapped delivery chronology from
  the current summary.

### Preserved unresolved sections

- Rooms/Tables, Compliance, Creative Studio, and planned menu/resources/
  marketing/subscription surfaces remain in a short explicit `NEEDS REVIEW`
  summary without an inferred Product Decision until dedicated source/Registry
  mappings exist;
- the orphan Phase 8 `no-external-call disclosure` fragment remains unless its
  provenance is positively identified from a current source or Git history;
- any paragraph whose exact unique content cannot be found in the proposed
  Product Knowledge, page-pack, or operations destination remains preserved;
  and
- external provider-response wording remains unchanged unless newer dated,
  authorized evidence exists in the repository.

### Blocking questions

None. YUTA has approved the routing-first outline and the preservation rules
above. This readiness does not authorize starting Step 6.2B2 in this step; it
only records that the plan's review questions have been resolved. Archive
strategy remains intentionally deferred to a later cleanup step.

## 13. Document status

Status: APPROVED
