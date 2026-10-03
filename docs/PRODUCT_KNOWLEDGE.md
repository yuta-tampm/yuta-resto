# YUTA Product Knowledge Entry Point

Status: Current

Visibility: Engineering

Owner: YUTA product and engineering

Last reviewed: 2026-10-03

## Purpose

This file is a navigation entry point. It does not contain all YUTA Product
Knowledge and does not replace the documents, OpenSpec artifacts, code, tests,
schemas, or operational evidence to which it points.

Use it to find the right source for a question and to keep **Product Intent**,
**Implemented State**, and **Unknown / Unverified** separate.

Use the approved [`AUTHORITY_MODEL.md`](AUTHORITY_MODEL.md) to choose authority
by question type, [`LIFECYCLE_STATUS_MODEL.md`](LIFECYCLE_STATUS_MODEL.md) to
interpret status dimensions, and [`MODULE_REGISTRY.md`](MODULE_REGISTRY.md) to
locate bounded capabilities, ownership, evidence, and review markers.

Discover progressively: this product map -> the bounded Module Registry row ->
its owning feature/product home -> relevant accepted decisions, normative main
specs and UI knowledge -> current code, schemas and tests. A Page Chat remains
Product/shaping authority for its unmigrated scope. For an exact scope with a
recorded fresh-agent migration PASS, the repository is canonical knowledge and
the Page Chat is legacy evidence only; see the [Authority Model](AUTHORITY_MODEL.md#scope-bound-legacy-page-chat-transition).

## The four knowledge locations

### `docs/`

`docs/` contains current architecture, accepted decisions, feature/product
intent and behavior, UI delivery rules and page evidence, operational rules,
readiness gates, and task specifications.

Do not treat every document under `docs/` as equal authority:

- `docs/decisions/` records accepted durable decisions and why they were made;
- `docs/features/` and `docs/products/` describe product intent, current
  behavior, limits, and future direction for covered modules;
- `docs/architecture/` defines durable runtime, data, tenant, authentication,
  identity, and dependency boundaries;
- `docs/ui/` governs UI delivery and contains page-specific product,
  interaction, design, implementation, and QA evidence;
- `docs/operations/` defines setup, deployment, recovery, provider eligibility,
  external deliverables, and production-readiness gates;
- `docs/CURRENT_STATE.md` is a broad current-state summary that must be checked
  against specific sources and code for material claims;
- `docs/tasks/` contains task instructions or work history and is **not** a
  default Product Knowledge source of truth.

For shared AI/file-storage questions, read
[AI and Storage architecture](architecture/AI_AND_STORAGE.md) for the consolidated
direction, outstanding provider/data decisions and bounded fresh-chat handoff.
It separates agreed direction from implementation and operational approval;
capability-specific Product Knowledge and normative specs retain their own roles.

### `openspec/specs/`

This location owns normalized, approved **precise observable behavioral
requirements** after promotion through the approved
[OpenSpec Normativity Policy](OPENSPEC_YUTA_NORMATIVITY_POLICY_REVIEW.md).

A main spec is normative only when its exact delta passed the accountable
approval gate, sync was explicitly authorized and completed successfully, and
the resulting main specs passed validation and diff review. File existence
alone is not authority. The directory now contains successfully gated, synced,
and validated main specs; use the current tree and capability links rather than
a historical empty-tree assumption.

Product Knowledge remains the broader Product Intent and context source.
Normative main specs operate inside accepted durable product, architecture,
security, runtime, and data-ownership boundaries and must not silently override
them.

### `openspec/changes/`

This location is intended for proposed or in-progress deltas: proposals,
designs, task plans, delta specs, and implementation/verification artifacts.

A change is non-normative and is not evidence that a capability is implemented:

- a proposed change is Product Intent under review;
- an applied change still requires code/test evidence;
- approval permits sync, while sync mechanically promotes approved content into
  main specs; the change artifact itself remains non-normative;
- conflicting change artifacts must not silently override accepted decisions or
  current documents.

Inspect the current directory and exact change status rather than relying on a
cached active-change count. Change presence never makes a delta normative.

### Code, schemas, contracts, manifests, and tests

Repository implementation is evidence of **Implemented State**, not by itself
the reason or complete product intent.

Use:

- package manifests for active packages, versions, scripts, and direct
  workspace dependencies;
- Next.js routes and application services for current entry points and runtime
  behavior;
- `packages/contracts` for serialization-safe transport boundaries;
- `packages/db-cloud`, `packages/db-pos`, and
  `apps/yuta-display/src/db` for executable persistence shape;
- server authorization and tenant resolution for trusted access behavior;
- tests for covered invariants, denial behavior, and state transitions.

The presence of a route is not proof that a feature is integrated. A route may
be a redirect, planned page, fixture prototype, development-only slice, or
production capability. Inspect its data source, mutations, guards, contracts,
and tests.

## Route questions to the right source

| Question                                         | Read first                                                        | Then verify with                                                                         |
| ------------------------------------------------ | ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| What products/apps exist?                        | `REPOSITORY_MAP.md`, accepted runtime ADRs                        | app/package manifests and directory structure                                            |
| What is YUTA's current overall state?            | `CURRENT_STATE.md`                                                | the relevant feature/product doc and code                                                |
| Why was an architecture/product boundary chosen? | `docs/decisions/`                                                 | current architecture and implementation                                                  |
| What should a feature do?                        | its `docs/features/<feature>/` or `docs/products/<product>/` home | accepted ADRs, status source, and code                                                   |
| What is implemented now?                         | specific current feature/product README                           | routes, contracts, schemas, services, tests                                              |
| What remains or is blocked?                      | adjacent `STATUS.md` and `PRODUCTION_READINESS.md`                | current external/operational evidence where authorized                                   |
| Who owns data and runtime behavior?              | `docs/architecture/`                                              | schemas, manifests, imports, server boundaries                                           |
| How is cloud access authorized?                  | `TENANCY.md`, `AUTHENTICATION.md`, `IDENTITY_AND_MEMBERSHIP.md`   | server guards, repositories, denial tests                                                |
| How should a UI be changed?                      | `docs/ui/README.md`, delivery modes, app UI rules                 | nearest `AGENTS.md`, page pack, current route/tests                                      |
| What does a page-pack screenshot prove?          | its reference README and page-pack README                         | only visual/as-built evidence; never infer domain or permission                          |
| How is a runtime deployed or recovered?          | `docs/operations/DEPLOYMENT.md`                                   | current manifests, environment contracts, deployment evidence                            |
| Is a capability production-ready?                | `docs/operations/PRODUCTION_READINESS.md`                         | named dated evidence; code existence is insufficient                                     |
| What did a task ask for?                         | `docs/tasks/`                                                     | current authoritative docs and implementation; task text is not current truth by default |
| What does OpenSpec currently require?            | approved `openspec/specs/` when present                           | relevant change status and implemented evidence                                          |

## Primary product and module sources

### Product Release identity

- Canonical Product Knowledge home: `docs/features/product-release/README.md`
- Runtime current-release authority: `CURRENT_YUTA_PRODUCT_RELEASE` in
  `packages/core/src/product-release.ts`
- Implemented direct presentation consumers: Public Web and authenticated
  Backoffice

### Public website

- Product source: `docs/features/public-website/README.md`
- Decision/architecture context: runtime-family and visibility ADRs
- Implementation: `apps/web`
- Direct-feedback boundary: use `docs/features/reputation/README.md` and
  ADR-004, with `apps/feedback-web` as current implementation evidence.

### Public booking

- Canonical bounded Reservations Product Knowledge and reconciled current
  implementation boundary: `docs/features/public-booking/README.md`
- Durable broader intent: `docs/features/public-booking/PRODUCT_SPEC.md`
- Remaining work/readiness: `docs/features/public-booking/STATUS.md`
- Decision: ADR-002
- Implementation: `apps/booking-web`, Backoffice reservation routes,
  `packages/booking`, contracts, and db-cloud booking persistence

The Reservations home preserves the Human-fixed current V1, RD-01 through
RD-18, eight excluded long-term directions, 13 unapproved proposal payloads,
implementation evidence, and 22 unresolved decision packets. Repository-only
fresh-agent acceptance passed on 2026-09-29, and the Human-authorized
scope-bound authority cutover is complete. Repository knowledge is canonical
for this exact migrated scope, and the Reservations Page Chat is legacy
evidence only for it. Product approval and cutover do not establish
implementation, legal qualification, provider readiness, target-environment
evidence, or production authorization. The master product specification also
contains broader future direction. Today, Planning, all other modules, and all
other Page Chats retain their existing authority.

### Reputation and direct feedback

- Canonical Avis/Reputation Product Knowledge and provider/flow matrix:
  `docs/features/reputation/README.md`
- Implementation tracker, not Product authority:
  `docs/features/reputation/STATUS.md`
- Decision: ADR-004
- Implementation: `apps/feedback-web`, Backoffice reputation/integration
  routes, contracts, tenant resolution, and db-cloud reputation persistence

Public direct-feedback collection is approved. The provider-independent Avis
intent covers recent/unanswered visibility, grounded AI-draft direction,
manual edit and Human validation before external publication. Facebook and
Instagram have confirmed Human-decided high-level inclusion; each provider's
`CURRENT_V1_STATUS` remains `UNRESOLVED`. Google Product V1, exact provider
interaction types, AI/Restaurant Knowledge consumption, publication,
synchronization, retry, approval workflow and analytics remain unresolved.
Confirmed provider inclusion does not approve a provider contract, integration
behavior, automation or production enablement. Current code and plans are implementation evidence
and do not approve those Product/provider boundaries.

For the exact bounded Avis & commentaires scope recorded in the Reputation
home, repository-only fresh-agent acceptance passed and the Human authorized
the authority cutover. Repository knowledge is canonical for that scope, and
the shared Avis Page Chat is legacy evidence only for that migrated Avis scope.

For the original bounded Satisfaction client / Feedback direct scope recorded
in the same Reputation home, repository-only fresh-agent acceptance passed and
the Human authorized the authority cutover. Repository knowledge is canonical
for this scope. The shared Avis Page Chat is now `LEGACY EVIDENCE ONLY` for both
known migrated Avis and Satisfaction scopes. The nine Satisfaction Human
decision packets and two trusted-boundary conflicts remain open; hardening
Apply is not authorized. Marketing, Visibility, other Reputation scopes, and
all other Page Chats retain their existing authority.

The [Satisfaction supplemental reconciliation](features/reputation/README.md#14-satisfaction-supplemental-experience-client-reconciliation)
now consolidates the separate `Expérience client v` evidence into that existing
home. Current routing remains `Satisfaction client` at
`/visibilite-reputation/satisfaction`; Restaurant Knowledge's descriptive
`Expérience client` remains a separate owner. Supplemental Product directions
do not extend the implemented inbox/settings or approve exact executable V1.
`SAT-01` through `SAT-09` remain unchanged and open; new `SAT-10` keeps
improvement-action ownership, lifecycle, effect observation and Today/task
relationships unresolved. The contact Product/UI conflict is additional to the
two existing trusted-boundary conflicts. The
[Human-exception supplemental authority update](features/reputation/README.md#supplemental-human-exception-authority-update)
is complete: repository knowledge is canonical for this exact supplemental
delta and `Expérience client v` is `LEGACY_EVIDENCE_ONLY`, with historical access
retained. The Human accepted delta repository sufficiency PASS with zero
material gaps; strict execution remains `BLOCKED_BY_ENVIRONMENT`, formal delta
fresh-agent PASS is NO, and no rerun is required. The home records automatic
prohibited-context exposure and exclusion from evidence, with no intentional
memory-index/personal-context use in that assessment. Original Satisfaction
PASS/cutover, shared Avis Page Chat role, implementation and readiness remain
unchanged.

### Restaurant Backoffice foundation

- Canonical Identity / Access Product Knowledge home:
  `docs/features/identity-access/README.md`
- Bounded Formalités READ/MANAGE authorization prerequisite:
  [normative specification](../openspec/specs/authorization/formalites/spec.md).
- Bounded Formalités persistent-draft behavior:
  [normative specification](../openspec/specs/formalites/persistent-draft-foundation/spec.md);
  employee-connected development-only persistence with no production
  enablement.
- Overall maturity: `docs/CURRENT_STATE.md`
- Trust and ownership: authentication, tenancy, identity/membership, and data
  model architecture documents
- UI behavior: applicable Backoffice page pack under `docs/ui/pages/`
- Implementation: `apps/backoffice` and server-only `@yuta/db-cloud` consumers

Backoffice routes include integrated capabilities, fixture prototypes,
development-only slices, redirects, and planned pages. Never infer maturity
from navigation visibility.

### Establishment

- Approved Product Decisions:
  - `docs/decisions/ADR-006-cloud-establishment-profile-context.md` for the
    bounded Cloud Establishment Profile;
  - `docs/decisions/ADR-007-composed-general-information-and-restaurant-knowledge.md`
    for the composed `Informations generales` page and separate Restaurant
    Knowledge capability.
- Canonical Product Knowledge home: `docs/features/establishment/README.md`
- Canonical page-level Product Knowledge home:
  `docs/features/establishment/general-information/README.md`
- Trust and ownership context: `docs/architecture/TENANCY.md` and
  `docs/architecture/DATA_MODEL.md`
- General-profile UI evidence:
  `docs/ui/pages/establishment-general-information/README.md`
- Booking-owned hours/services evidence:
  `docs/ui/pages/hours-services/README.md` and Public Booking knowledge
- Implementation: `apps/backoffice/src/app/(authenticated)/etablissement`,
  `packages/db-cloud/src/establishment-profile-repository.ts`,
  `packages/db-cloud/src/restaurant-knowledge-repository.ts`, and Booking
  administration repositories

The general-information page composes the implemented Establishment Profile,
five implemented Restaurant Knowledge descriptive slices—Concept/Histoire,
Cuisine/savoir-faire, Expérience client, Équipe & culture and Identité de
communication—and the implemented `Connaissances validées` item collection.
Page composition does not assign a shared data owner or permission boundary.
Restaurant Knowledge is their canonical owner, Organization is the
tenancy/access envelope, and dedicated READ/MANAGE authorization remains
independent from Establishment Profile. Remaining knowledge families and
integrations must not be inferred from the existing route.

The 2026-09-28 bounded repository reconciliation, repository-only fresh-agent
acceptance, and Human-authorized authority cutover are complete for this
composed page and current Restaurant Knowledge scope. The page-level home
records the acceptance evidence, exact scope, cross-dimension model, confirmed
long-term directions, and eight unresolved decision packets. Repository
knowledge is canonical for that exact migrated scope, and the responsible
General Information / Restaurant Knowledge Page Chat is legacy evidence only
for that scope. Other Establishment capabilities and all other Page Chats
retain their existing authority.

### Horaires & services

- Canonical knowledge for the exact migrated Horaires & services scope:
  `docs/features/establishment/hours-services/README.md`.
- Existing schedule administration remains Booking-owned under ADR-006;
  `/etablissement/horaires-services` persists Booking periods and exceptions.
- Four high-level Human directions, 17 unapproved proposals, one menu ambiguity,
  six historical provider references and 20 open `HS` packets are preserved.
  Exact public-hours/service/publication V1 remains unresolved. No distinct
  public-hours model or provider-hours publication is implemented.
- C1's stale period-edit-location wording was corrected against the later
  specific page sources and current canonical owners; no genuine C1 conflict
  remains. The Human-exception authority cutover is complete: repository
  knowledge is canonical for this exact scope, and the Horaires Page Chat is
  `LEGACY EVIDENCE ONLY`. The Human accepted repository sufficiency as `PASS`
  with zero material gaps and genuine conflicts. Strict fresh-agent execution
  remains `BLOCKED_BY_ENVIRONMENT`; formal fresh-agent PASS is not recorded,
  and no further rerun is required. The home records the exact Human exception;
  Product decisions, implementation and readiness remain unchanged.
- Read the existing Establishment/General Information, Booking, Today and
  Reputation authorities through the home; their migrated scope is unchanged.

### Salle & tables

- Bounded reconciled knowledge and discovery home:
  `docs/features/establishment/rooms-tables/README.md`.
- Four high-level Human directions cover plan input with tables or empty,
  practical operational usefulness, efficient assignment and restaurateur
  filling preferences. Exact V1, physical structure/data owner and assignment
  owner remain unresolved. The home preserves MEDIUM confidence for purpose
  and preferences, 25 explicitly unapproved proposal payloads, seven design
  tensions, nine capabilities/concepts, four unqualified historical references
  and 25 open `ST` decisions. No confirmed legacy long-term or obsolete Human
  decision is invented.
- `/etablissement/salles-tables` is the current authenticated fixture viewer,
  with local room/table selection, a prototype notice and small fixture/model
  and navigation tests. No dedicated cloud import, room/table persistence,
  assignment, geometry, permission, page pack, Browser QA or production
  authorization is established. The proposed `/establishment/rooms-tables`
  remains historical provenance only.
- Establishment placement is discovery routing, not canonical data ownership.
  Booking retains capacity/periods/exceptions and Reservations truth. Its
  independently approved non-guaranteed space preference is unimplemented;
  precise assignment/interactive plan remain excluded long-term directions.
  POS still uses separate local order labels; no table mapping, QR contract,
  projection or write-back is created.
- Reconciliation and the Human-exception authority cutover are complete.
  Repository knowledge is canonical for this exact scope; Salle & tables Page
  Chat is `LEGACY_EVIDENCE_ONLY`. The home records the exact Human decision:
  repository sufficiency PASS, zero material gaps and genuine conflicts,
  strict fresh-agent execution `BLOCKED_BY_ENVIRONMENT`, formal fresh-agent
  PASS NO, memory-index access YES, prohibited content used as evidence NO,
  and no additional rerun required. The exception changes knowledge authority
  only; all Product, implementation, authorization, qualification, readiness,
  completed migrations and other Page Chat authority remain unchanged.

### Création de contenus

- Canonical repository knowledge for the exact migrated Content scope:
  `docs/features/content-creation/README.md`.
- `Création de contenus v` maps to the `Création de contenus` page;
  `Marketing & contenu` is navigation only. `Créations visuelles v` maps to the
  separate `Créations visuelles` page; its subsequent cutover is recorded below;
  `Expérience client v` maps to Satisfaction client,
  outside this Content reconciliation; its supplemental reconciliation is
  recorded in the Reputation home above.
- Twenty Human-current directions preserve restaurant-specific textual
  assistance from ideas/details/photos, suggested subjects, one principal
  proposal, conversational rewrite/manual edit, base/channel wording,
  save/history/reuse, separate Visual handoff and Human validation. Four legacy
  confidence values remain MEDIUM. Exact executable V1, Content aggregate/data/
  persistence/media owners, role grants, AI/provider and lifecycle remain open.
- `/marketing/contenus` is only an authenticated shared planned placeholder;
  functional capability is `NOT_STARTED`. The separate visual fixture
  prototype is not Content implementation. No Content contract, schema,
  repository, source projection/write-back, upload, AI generation, social
  publication, operation policy, page pack or Browser QA evidence exists.
- The home preserves three distinct long-term directions, four explicitly
  unapproved proposal payloads, all 27 raw questions in 24 open `CDC` packets,
  four non-conflicting design tensions, nine capabilities, eight concepts and
  Instagram/Facebook/Google textual-adaptation provenance. Google meaning
  remains unresolved; no provider, legal/privacy/copyright qualification is
  created. Restaurant Knowledge already owns communication identity; Content
  suggestions and generated copy create no canonical source mutation.
- Reconciliation, exact-name remediation and the Human-exception authority
  cutover are complete. Repository knowledge is canonical for this exact scope;
  `Création de contenus v` Page Chat is `LEGACY_EVIDENCE_ONLY`. The home records
  the exact Human decision: repository sufficiency PASS, zero material gaps
  and bounded genuine conflicts, strict fresh-agent execution
  `BLOCKED_BY_ENVIRONMENT`, automatic prohibited-context exposure YES,
  prohibited content used as evidence NO, intentional memory/personal/prior-
  conversation access NO, formal fresh-agent PASS NO and no additional rerun.
  At that Content cutover, Visual was ACTIVE, unreconciled and unmigrated;
  its subsequent authority transition is recorded below. At that Content
  cutover, Satisfaction supplemental consolidation had not been performed; its
  current record is in the Reputation home above. All completed migrations, source owners,
  Satisfaction/Avis conflicts, separate scopes, environment and readiness remain
  unchanged. The exception changes knowledge authority only.

### Créations visuelles

- Canonical repository knowledge for the exact migrated Visual scope:
  `docs/features/visual-creation/README.md`.
- `Créations visuelles v` maps to the `Créations visuelles` menu page at
  `/marketing/studio-creatif`; `Marketing & contenu` is navigation only.
  Current Creative Studio code is the authenticated fixture prototype exposed
  by that navigation, not approval of its fixture fields or a complete Visual
  capability. Functional visual creation remains `NOT_STARTED`.
- Seven HIGH-confidence Human directions cover practical restaurant visual
  creation, supplied identity and respect for it, a usage limit depending on
  forfait, flyer/affiche/photo-with-text examples, description and/or photo
  input, and text rework/validation before creation. Exact executable V1,
  visual identity/data/media owners, lifecycle, permissions, providers and
  quota mechanics remain unresolved.
- Fourteen full proposal families remain explicitly unapproved. The home
  preserves all 25 raw questions in 22 open packets: 21 decision packets and
  one evidence-coverage packet. Fifteen capabilities and thirteen concepts
  are derived inventories; zero legacy long-term directions or tensions are
  invented. Four historical URLs for three products remain unqualified.
- Available extraction history was used, but physical Page Chat history
  exhaustiveness remains `UNVERIFIED`. The Human's E2 approval covers the
  general direction and explicit statements, not every E1 detail or later
  E6/E7 proposals. No exact V1 follows from Assistant wording or current UI.
- The [Human-exception authority cutover](features/visual-creation/README.md#human-exception-authority-cutover)
  is complete: repository knowledge is canonical for this exact Visual scope,
  and `Créations visuelles v` is `LEGACY_EVIDENCE_ONLY`. The Human accepted
  repository-only recovery/sufficiency PASS with zero material gaps and genuine
  Visual conflicts. Strict fresh-agent execution remains
  `BLOCKED_BY_ENVIRONMENT`; automatic prohibited-context exposure and the
  intentional memory-index query remain recorded YES, their results were not
  evidence, formal fresh-agent PASS is NO and no additional rerun is required.
  The home records the complete independent assessment/exception axes. Content
  remains separately canonical with `Création de contenus v` as
  `LEGACY_EVIDENCE_ONLY`. At that Visual cutover, Satisfaction was not reopened
  and `Expérience client v` supplemental consolidation had not been performed;
  its current record is in the Reputation home above. The exception changes knowledge
  authority only; source ownership, operation grants, external qualification,
  environment and readiness remain unchanged.

### Ressources internes

- Canonical repository entry point for the migrated Ressources internes scope:
  `docs/features/internal-resources/README.md`
- Current route:
  `apps/backoffice/src/app/(authenticated)/etablissement/ressources-internes/page.tsx`
- Current implementation: authenticated shared planned placeholder and tested
  navigation only; no Ressources-internes contract, schema, repository,
  persistence, operation permission, page pack, provider integration, or
  Browser QA exists.
- Confirmed bounded directions: four conceptual content families—internal
  announcements, internal documents, general procedures, and `fiches de
poste`—plus practical/effective/easy use, simple organized team sharing, and
  externally hosted restaurant-created video. The exact provider is not
  selected.
- Thirteen detailed proposal families remain `PROPOSED_NOT_APPROVED`, and
  `RI-01` through `RI-20` keep exact V1, ownership, executable shape,
  authorization, tenancy, storage, provider, cross-module, external-review,
  UI, environment, and release decisions open.
- Ressources internes remains distinct from Personnel, Tâches du jour, Today,
  Formalités/Documents, Restaurant Knowledge, Conformité, Marketing/Website,
  Identity / Access, and local products. No projection or write-back exists.
- Reconciliation, proposal-payload remediation, repository-only fresh-agent
  acceptance, and the Human-authorized authority cutover are complete. The
  accepted report recovered all eight Human-current items, thirteen exact
  proposal payloads, twenty `RI` packets, and the one obsolete claim with zero
  material gaps and zero genuine conflicts. Repository knowledge is canonical
  for this exact migrated scope, and the Ressources internes Page Chat is
  `LEGACY EVIDENCE ONLY`. All `RI` decisions and lifecycle/readiness limits
  remain unchanged.

### Veille & conformité

- Canonical Product Knowledge — migration PASS:
  `docs/features/compliance/README.md`
- Current route:
  `apps/backoffice/src/app/(authenticated)/conformite/veille/page.tsx`
- Current implementation: authenticated fixture-backed prototype with local
  tab/selection state, fictional actions/domains/dates/percentages, disabled
  operations, generic trusted tenant context, and small model/navigation tests.
  No compliance-specific contract, schema, migration, repository, persistence,
  operation permission, file storage, upload/scan/OCR, source/provider service,
  page pack, Browser QA, dated environment evidence, or production authorization
  exists.
- The fixed Product perimeter preserves twenty Human-current directions for a
  digital administrative/compliance dossier and targeted restaurant regulatory
  monitoring, six long-term directions, four principal sections, cautious
  status presentation, no misleading global compliance score, Human-validated
  AI assistance, visible source references, and strict legal/applicability/
  evidence limits.
- Six exact proposal families remain `PROPOSED_NOT_APPROVED`; seven compliance
  domains are illustrative rather than exhaustive; eight external references
  are `LEGACY_REFERENCE_ONLY` and require current qualified review.
- `VC-01` through `VC-23` keep exact V1, source/jurisdiction/currentness,
  applicability, requirement/control/evidence, dossier/files, time,
  notifications, cross-module, authorization, history, UI, operations,
  environment, and release decisions open. No projection or write-back exists.
- Bounded reconciliation, `VC-PA-02` proposal-payload remediation,
  repository-only fresh-agent acceptance, and the Human-authorized authority
  cutover are complete. The accepted report recovered all twenty Human-current
  directions, six long-term directions, six exact unapproved proposal
  payloads, all 23 `VC` packets, `VC-HIST-01`, five tensions, seven illustrative
  domains, and eight legacy-only references with zero material gaps and zero
  genuine conflicts. Repository knowledge is canonical for this exact migrated
  scope, and the Veille & conformité Page Chat is `LEGACY EVIDENCE ONLY`. All
  Product, proposal, packet, legal/currentness, implementation, authorization,
  environment, readiness, and production limits remain unchanged.

### Carte & menus

- Bounded Product Knowledge — migration PASS:
  `docs/features/menu-catalog/README.md`
- Current route:
  `apps/backoffice/src/app/(authenticated)/etablissement/carte-menus/page.tsx`
- Current UI implementation: authenticated shared planned placeholder only;
  the canonical route and navigation are tested, but no Carte-specific page
  pack, loader, action, contract, schema, repository, persistence, permission,
  Browser QA, ADR, or normative OpenSpec spec exists.
- Approved bounded directions: manage part of restaurant menu information
  without owning order/payment/transaction behavior; remain broadly suitable
  without an unnecessarily heavy model; support `menu` as a combo/composition
  of multiple dishes.
- Exact V1, terminology, data owner, item/category/combo models, selling-price
  semantics, states, media, authorization, lifecycle, POS/channel contracts,
  regulated content, environment and readiness remain in `CM-01` through
  `CM-18`.
- Local POS catalogue and combo behavior is separate restaurant-local Product
  and runtime truth. Fiches techniques, Inventaire, Mouvements de stock,
  Fournisseurs and Restaurant Knowledge retain their repository-canonical
  ownership and non-write-back boundaries.
- Bounded reconciliation and the repository-only fresh-agent acceptance PASS
  are complete. Following Human-authorized cutover, repository knowledge is
  canonical for this exact scope and Carte & menus Page Chat is legacy evidence
  only for it. All other Page Chats retain their existing authority.

### Today

- Approved Product Decision:
  `docs/decisions/ADR-005-today-operational-steering.md`
- Canonical Product Knowledge home: `docs/features/today/README.md`
- UI delivery evidence: `docs/ui/pages/today/README.md`
- Source-module behavior and ownership: Reservations / Booking administration,
  Reputation, and the owning module for each approved future information family
- Implementation: `apps/backoffice/src/app/(authenticated)/aujourdhui`

The 2026-09-29 bounded Aujourd'hui reconciliation, repository-only fresh-agent
acceptance, and Human-authorized authority cutover are complete. The Today home
preserves HD-01 through HD-17, the current Reservations, booking-service, and
Reputation implementation, source-owner and authorization boundaries, 15
unapproved proposal payloads, both obsolete claims, and TODAY-01 through
TODAY-17. The accepted report recorded zero material knowledge gaps and zero
genuine authority conflicts. Repository knowledge is canonical for this exact
migrated scope, and the Aujourd'hui Page Chat is `LEGACY EVIDENCE ONLY` for that
scope. Exact V1, every `TODAY` packet, environment, readiness, and production
authorization remain unchanged.

### Personnel, Documents, register, and Formalités

- Canonical Product Knowledge home: `docs/features/personnel/README.md`
- The same home is the canonical repository entry point for the reconciled
  Formalités capability, ownership, legal-status, and readiness model. The
  2026-09-28 repository reconciliation, repository-only fresh-agent acceptance,
  and scope-bound authority cutover are complete. Repository knowledge is
  canonical for that exact migrated Formalités scope, and the Formalités Page
  Chat is legacy evidence only for that scope. Other Personnel capabilities and
  all other Page Chats retain their existing authority.
- The same home now records the completed bounded Salariés / Personnel dossier
  reconciliation: F01–F12, current data families, F03, normative F07, OWNER-only
  authorization, tenancy, Register/Documents boundaries, cross-module
  projections, readiness, and 11 grouped open decisions. It preserves confirmed
  high-level inclusion of salary/remuneration, probation, monthly hours,
  `stagiaire`, and Human-confirmed AI document assistance while leaving their
  exact models, current V1, implementation, legal/privacy status, and downstream
  integration separately classified. Repository-only fresh-agent acceptance
  passed, and the Human-authorized scope-bound authority cutover is complete.
  Repository knowledge is canonical for this exact Salariés / Personnel dossier
  scope, and the Salariés Page Chat is legacy evidence only for this scope. The
  cutover does not reopen the completed Formalités or Pointage migrations,
  migrate Planning Product Truth or the full Register/Documents capabilities,
  resolve a SAL decision, or change another Page Chat's authority.
- Normative F07 behavior:
  `openspec/specs/personnel/reconstructable-value-history/spec.md`
- Current summary and production gates: `CURRENT_STATE.md` and
  `docs/operations/PRODUCTION_READINESS.md`
- Detailed delivery evidence:
  - `docs/ui/pages/backoffice-equipe-salaries/`
  - `docs/ui/pages/backoffice-equipe-registre-personnel/`
  - `docs/ui/pages/backoffice-equipe-formalites-personnel/`
- Implementation: personnel routes/guards in `apps/backoffice` and personnel
  plus Formalités schema/repositories in `packages/db-cloud`

Always state the environment boundary. Repository-local or development-only
implementation does not mean production approval, legal validation, approved
templates, or connected OCR/AI.

Treat the generic fictional in-memory Formalités prototype, the bounded
employee-connected persistent CDI preparation draft, and the proposed future
generation/signature lifecycle as separate scopes. The persistent foundation
owns only its development-only draft, reconciliation, abandonment, and replay
state. F5-07 provides approved Product direction for a future generated unsigned
version, but no generated artifact is implemented. Actual approved legal
content, private file storage, signature, Documents handoff, final retention
policy, external declarations/integrations, and production operation remain
unimplemented, unresolved, or separately gated.

The Human-approved high-level lifecycle (`Embauche -> Vie du contrat -> Départ
-> Archives`) remains confirmed Product direction: Formalités is intended to
assist with actions, documents, evidence, deadlines, current state, and next
steps across the employee administrative journey. Restaurant-customized
templates also remain confirmed high-level future direction. Neither direction
defines the exact current V1, approves specific legal workflow rules, or proves
implementation. The implemented first template foundation remains global and
non-tenant; restaurant customization is outside that foundation, and its timing
and exact model remain unresolved.

The [Formalités template legal-review governance specification](../openspec/specs/formalites/template-legal-review-governance/spec.md)
now defines the bounded documentary contract for external review and exact
version/applicability qualification prerequisites. Use the Personnel Product
Knowledge home for context. This normative contract does not implement
templates, legal-evidence persistence, Platform Admin runtime or publication,
and does not change lifecycle/readiness or close production/legal/privacy gates.

The separate [Formalités legal-template foundation](../openspec/specs/formalites/legal-template-foundation/spec.md)
now defines the implemented global identity/working-draft/frozen-version
persistence boundary. Use the Personnel Home for context; it is not the
employee-connected preparation draft, generated contract, legal-review
evidence store or publication/qualification workflow. No Platform Admin
runtime or production enablement follows.

### Planning

- Canonical repository entry point for the reconciled Planning scope:
  `docs/features/planning/README.md`
- The bounded reconciliation confirms high-level restaurant staffing needs,
  multi-poste and weekly-hours inputs, availability and free-text constraints,
  generation, infeasibility explanations and resolution proposals, manager
  editing/duplication/reuse, a pre-generation change check, absence awareness,
  multi-week planning, law-aware direction, and Human-controlled arbitration.
- Exact current V1, domain entities, Personnel projection, Absence ownership,
  authorization, timezone/overnight behavior, generation architecture,
  warning/block rules, lifecycle, employee visibility, calculations,
  notifications, history, and production enablement remain grouped in 14 open
  decision packets.
- Current implementation is only the authenticated `/equipe/planning`
  placeholder. No Planning-specific operation, action, contract, schema,
  repository, persistence, page pack, ADR, normative spec, or QA evidence exists.
- Personnel remains the employee-fact owner; no Personnel-to-Planning projection
  or Planning write-back is approved. Pointage remains the actual-work evidence
  owner, and no planned/actual synchronization exists. Absence ownership remains
  unresolved.
- Planning is `NOT_ENABLED`, capability readiness is `NOT_ASSESSED`, Backoffice
  remains `NOT_READY`, and production authorization is absent. Current legal,
  privacy, and security review remains required.
- Repository-only fresh-agent acceptance passed, and the Human-authorized
  scope-bound authority cutover is complete. Repository knowledge is canonical
  for this exact Planning scope, and the Planning Page Chat is legacy evidence
  only for that scope. No related capability, open decision, implementation,
  readiness state, production authorization, or other Page Chat authority
  changed.

### Tâches du jour

- Canonical repository entry point for the reconciled Tâches du jour scope:
  `docs/features/daily-tasks/README.md`
- Six bounded current Product directions are confirmed: date/employee task
  view, time and priority ordering, secondary non-mandatory tasks, date and
  `poste` applicability, employee consultation, and print or digital checking.
  Each is `DECIDED_NOT_IMPLEMENTED`; exact V1 and detailed semantics remain
  unresolved.
- Assisted fiche de poste composition from selectable task models plus custom
  tasks is a confirmed long-term direction. Fiche ownership, task-library
  ownership, template/routine/daily-instance architecture, and generation are
  unresolved or proposed, not current requirements.
- Current implementation is only the authenticated
  `/equipe/taches-quotidiennes` shared placeholder and navigation link. No task
  contract, schema, migration, repository, action, persistence, task-specific
  authorization, focused behavior test, page pack, Browser QA, ADR, or normative
  task spec exists. The legacy `/team/daily-tasks` route is not current.
- ADR-005 assigns future task records and state to Tâches du jour while Today
  remains a future aggregate consumer. There is no current Today integration.
  Personnel owns employee facts, Planning owns planned work, and Pointage owns
  actual-work evidence; no projection, generation, synchronization, or
  cross-write is approved.
- Fifteen grouped Human decision packets remain open. Legal, compliance,
  privacy, security, environment, readiness, and production authorization are
  independently unresolved or absent. The capability is `NOT_ENABLED`, its
  readiness is `NOT_ASSESSED`, and Backoffice is `NOT_READY`.
- Reconciliation, bounded canonicalization, repository-only fresh-agent
  acceptance, and the Human-authorized authority cutover are complete. The
  repository is canonical for this exact migrated Tâches du jour scope, and its
  Page Chat is `LEGACY EVIDENCE ONLY`. No TJD decision, implementation,
  legal/privacy/readiness state, completed migration, or other Page Chat
  authority changed.

### Inventaire

- Canonical repository entry point for the reconciled Inventaire scope:
  `docs/features/inventory/README.md`
- Ten bounded current Product directions are confirmed: products concerned by
  menu activity; visible HT price, TTC price, available quantity, quantity to
  buy, and supplier context; an almost-weekly practical workflow; a printable
  supplier purchase list; price maintenance; and price contribution to Fiches
  techniques. Each is `DECIDED_NOT_IMPLEMENTED` as a real restaurant capability.
- Simplified online supplier ordering is a confirmed long-term direction.
  METRO is an example only; no provider, API, cart, order, payment, receipt, or
  invoice capability is approved.
- Current implementation is the authenticated `/stock/inventaire`
  fixture-backed prototype. It has route-local fictional data, local filtering
  and selection, disabled operational actions, and focused prototype-model
  tests. It has no cloud contract, schema, migration, repository, server action,
  API, persistence, Inventaire permission, page pack, Browser QA, ADR, or
  normative spec.
- Exact V1, article/catalogue semantics, available-quantity source, physical
  count/session, theoretical stock, movements, variance, purchase formula,
  units, supplier ownership, HT/TTC basis, Fiches techniques projection,
  ordering, POS relationship, tenancy, permissions, OCR, history, legal meaning,
  and readiness remain grouped in 18 open decision packets.
- Mouvements de stock, Fournisseurs, and Fiches techniques remain independent
  repository-canonical scopes. The Fiches techniques Page Chat is legacy
  evidence only for its migrated scope. The `Stock` navigation group creates no
  shared Product authority. The restaurant-local POS catalogue remains separate
  and does not support stock/inventory.
- Reconciliation, bounded canonicalization, repository-only fresh-agent
  acceptance, and the Human-authorized scope-bound authority cutover are
  complete. Repository knowledge is canonical for this exact Inventaire scope,
  and the Inventaire Page Chat is `LEGACY EVIDENCE ONLY`. No `INV` decision,
  implementation, legal/accounting/HACCP/privacy/security or readiness state,
  adjacent Stock migration, completed migration, or other Page Chat authority
  changed.

### Fournisseurs

- Canonical repository entry point for the reconciled Fournisseurs scope:
  `docs/features/suppliers/README.md`
- Twenty-two bounded current Product directions are confirmed. They cover a
  dedicated capability with value beyond an address book; separate inventory
  and purchase cadence; lead time; recalculation after new Inventaire context;
  stable configuration versus dynamic needs; list preparation rather than
  automatic ordering; PDF/Excel export and supplier grouping; minimum/target
  stock direction; package-aware quantity suggestion; high-level need states;
  pending-order suppression; simple local ordered/expected-delivery state;
  supplier/invoice price sources; observed/paid/reference price separation;
  price history and unit normalization; promotion safeguards; and supplier-side
  price acquisition with bounded Inventaire projection. Each is
  `DECIDED_NOT_IMPLEMENTED` as a real restaurant capability.
- The bounded V1 direction includes supplier management, product-to-supplier
  relationships, purchasing cadence/lead time, purchase-need preparation,
  supplier-grouped lists, PDF/Excel/print/generic copy, simple local ordered and
  expected-delivery state, and price acquisition/history. Exact workflow,
  entities, formulas, fields, lifecycle, permissions, and cross-scope contracts
  remain unresolved in 18 grouped Human decision packets.
- Current implementation is the authenticated `/stock/fournisseurs`
  fixture-backed prototype. It has seven fictional suppliers, local filters and
  selection, hard-coded tabs/summaries, disabled operational actions, and
  focused prototype-model tests. It has no cloud contract, schema, migration,
  repository, server action, API, persistence, supplier permission, page pack,
  Browser QA, ADR, or normative spec.
- Fournisseurs is the semantic Product owner of bounded supplier information,
  configuration, offers/pricing acquisition direction, and purchase
  preparation. Exact supplier master, data owner, organization/establishment
  scope, and mutation authority remain unresolved. Supplier article is not the
  canonical YUTA article; recommendation/list/order/acknowledgment/delivery/
  receipt/invoice/payment/movement remain distinct.
- Online ordering and reliable provider integration are long-term directions.
  METRO is an example only. Automated invoice processing remains long-term and
  unresolved; cost-variation analysis and automatic recipe recalculation remain
  proposed. No provider, credential, accounting valuation, recipe-cost truth,
  automatic cross-write, or production capability is approved.
- Inventaire and Mouvements de stock remain repository-canonical and unchanged.
  Fiches techniques is separately repository-canonical after fresh-agent PASS
  and authority cutover; its Page Chat is legacy evidence only. Purchasing/
  orders, receipts, invoices/OCR, and all other Page Chat scopes remain separate
  and unmigrated.
- Reconciliation, bounded canonicalization, repository-only fresh-agent
  acceptance, and the Human-authorized scope-bound cutover are complete.
  Repository knowledge is canonical for this exact Fournisseurs scope, and the
  Fournisseurs Page Chat is `LEGACY EVIDENCE ONLY`. No `FOU` decision,
  implementation, legal/accounting/commercial/privacy/security or readiness
  state, adjacent migration, completed migration, or other Page Chat authority
  changed.

### Mouvements de stock

- Canonical repository entry point for the reconciled Mouvements de stock
  scope: `docs/features/stock-movements/README.md`
- Eight bounded current Product directions are confirmed: stock `+/-`;
  Inventaire-originated change; purchase/invoice-originated change; manual
  movement mainly for `gaspillage`; weekly consumption visibility;
  consumption-coherence/problem detection; procurement forecasting support;
  and reduction of waste, overstock, and insufficient stock. Each is
  `DECIDED_NOT_IMPLEMENTED` as a real restaurant capability.
- Current implementation is the authenticated `/stock/mouvements`
  fixture-backed prototype. It has eight fictional rows, local filters and
  selection, hard-coded summaries, disabled operational actions, and focused
  prototype-model tests. It has no cloud contract, schema, migration,
  repository, server action, API, persistence, movement permission, page pack,
  Browser QA, ADR, or normative spec.
- Movement, stock balance, physical count, and source-event truth remain
  separate. Exact V1, movement identity/projection, balance application,
  Inventaire trigger, purchase/invoice/receipt/OCR contract, manual causes,
  time/sign/units, lifecycle/correction, consumption, anomalies, forecasting,
  transfers, adjacent ownership, permissions, history, legal meaning, and
  readiness remain grouped in 18 open decision packets.
- Inventaire and Fournisseurs remain repository-canonical and unchanged. Fiches
  techniques is separately repository-canonical after fresh-agent PASS and
  authority cutover; POS and Production provide no approved cloud movement
  source, and local POS stock synchronization remains unsupported.
- Reconciliation, bounded canonicalization, repository-only fresh-agent
  acceptance, and the Human-authorized scope-bound cutover are complete.
  Repository knowledge is canonical for this exact scope, and the Mouvements de
  stock Page Chat is `LEGACY EVIDENCE ONLY`. No `MDS` decision, implementation,
  legal/privacy/readiness state, completed migration, or other Page Chat
  authority changed.

### Fiches techniques

- Canonical repository destination for the reconciled Fiches techniques scope:
  `docs/features/technical-sheets/README.md`
- Seventeen bounded current Product directions and a fixed current V1 are
  confirmed. They cover reference recipes and portions, derived scaling,
  assisted paste with mandatory Human review and no silent invention,
  Inventaire matching and price context, theoretical total/per-portion cost,
  contextual selling price and ratio direction, manual entry, duplication,
  simple conversions, intermediate preparations, price provenance/freshness,
  Excel export, and an exception-oriented list. Each is
  `DECIDED_NOT_IMPLEMENTED` as a real capability.
- Advanced nutrition, advanced allergens, sophisticated cooking yield, labor
  cost, and complete accounting-profitability calculation are outside the
  current V1. These are exclusions, not permanent rejection or an approved
  roadmap.
- Current implementation is only authenticated `/stock/fiches-techniques`
  route/navigation plus the shared planned placeholder and navigation tests. No
  fiche/recipe contract, schema, migration, repository, action, API,
  persistence, Fiches operation permission, costing logic, assisted-ingestion
  adapter, export, page pack, Browser QA, ADR, or normative spec exists.
- Fiche, reference recipe, dish/menu item, local POS item, recipe ingredient,
  Inventaire article, supplier offer, intermediate preparation, production
  batch, and stock movement remain distinct. Fiches owns future recipe
  definition and theoretical cost presentation; it receives only future
  approved projections from adjacent owners and has no cross-module write-back.
- Exact executable V1/identity, dish mapping, ingredient mapping, units,
  scaling, sub-recipes, source price/cost basis, live/snapshot/history,
  calculations, ratio, assisted ingestion, lifecycle, freshness states, export,
  adjacent integrations, authorization/tenancy, audit/retention, regulated
  boundaries, UI, environment, and readiness remain grouped in 19 Human
  decision packets (`FT-01` through `FT-19`).
- Reconciliation, bounded canonicalization, repository-only fresh-agent
  acceptance, and the Human-authorized authority cutover are complete.
  Repository knowledge is canonical for this exact Fiches techniques scope, and
  its Page Chat is `LEGACY EVIDENCE ONLY`. No `FT` decision, implementation,
  legal/privacy/readiness state, completed migration, or other Page Chat
  authority changed.

### Pointage authority, access and usable raw clocking

- Canonical Pointage Product Knowledge home; fresh-agent migration PASS recorded:
  `docs/features/pointage/README.md`
- Precise normative ownership and behavioral boundaries:
  `openspec/specs/pointage/authority-foundation/spec.md`
- Precise normative credential, continuation and authorization behavior:
  `openspec/specs/authorization/pointage/spec.md`
- Precise normative raw-clocking behavior:
  `openspec/specs/pointage/raw-clocking/spec.md`
- Current implementation: portable primitives in `packages/auth`, guarded
  credential/raw-event/receipt/continuation persistence in `packages/db-cloud`,
  and employee transport/UI plus server composition in `apps/backoffice`
- Employee page and QA evidence:
  `docs/ui/pages/backoffice-pointage-employee/README.md`
- Personnel relationship: `docs/features/personnel/README.md`
- Security architecture: `docs/architecture/AUTHENTICATION.md`

The cloud/online authority foundation and bounded employee raw-clocking slice
are approved and implemented. The employee route
`/pointage/[establishmentSlug]` supports identification, `CLOCK_IN`,
`CLOCK_OUT`, immutable canonical raw evidence, derived current state/session,
shared-device clearing and a minimal server-only manager read. Browser QA passed
with the three recorded residual lifecycle-evidence limitations.

Canonical production migrations still exclude raw-clocking persistence. The
implemented attendance path remains synthetic/disposable-only; real employee
attendance and production enablement are not authorized. There is no manager UI,
correction, history/total view, Planning/Today/payroll integration, POS/Site
Agent/offline/sync behavior or production trusted-client-address provider.
Legal/privacy gates and trusted production client-address provenance remain
blocked.

For the exact bounded scope recorded in the Pointage home, repository-only
fresh-agent acceptance passed and the Human authorized the authority cutover.
Repository knowledge is canonical for that scope, and the Pointage Page Chat is
legacy evidence only. No other Page Chat authority, Product decision,
implementation state, environment status, readiness gate, or unresolved item
changes by association.

### Local POS and Site Agent

- Canonical Site Agent Product Knowledge home:
  `docs/products/pos/site-agent/README.md`
- Product/current behavior: `docs/products/pos/README.md`
- Durable product intent: `docs/products/pos/PRODUCT_SPEC.md`
- Operator behavior: `docs/products/pos/USER_GUIDE.md`
- Failure/offline direction: `docs/products/pos/OFFLINE_STRATEGY.md`
- Acceptance: `docs/products/pos/QA_CHECKLIST.md`
- UI route evidence: `docs/ui/pages/README.md` and the relevant POS page pack
- Operations: local development and deployment documents
- Implementation: `apps/yuta-pos -> apps/site-agent -> packages/db-pos`

POS orders, payments, kitchen state, print jobs, local users, catalog, and
reports are restaurant-local. They must not be presented as public YUTA cloud
service capabilities or synchronized to cloud persistence.

### Standalone Display

- Canonical Product Knowledge home:
  `docs/products/display/README.md`
- Current entry points: `REPOSITORY_MAP.md`, `CURRENT_STATE.md`, Display
  `AGENTS.md`, and operations docs
- Implementation: `apps/yuta-display` and its app-owned database under
  `src/db`

Treat detailed product questions not answered by the approved home or its
linked sources as Unknown / Unverified rather than inferring them from UI code.

### Shared foundation

- Package roles and boundaries: root `AGENTS.md`, `REPOSITORY_MAP.md`, and
  nearest package `AGENTS.md`
- Active versions/scripts/dependencies: each package's `package.json`
- Public UI exports: `packages/ui/src/index.ts`
- Executable data shape: the active schema entry points, not prose catalogs

The legacy `packages/db` is not an active tracked package. Do not restore or use
`@yuta/db`.

## Safe interpretation rules for agents

1. Label every material conclusion as Product Intent, Implemented State, or
   Unknown / Unverified.
2. Do not convert a product spec, page pack, screenshot, task, backlog item, or
   OpenSpec change into an implementation claim.
3. Do not convert code existence into product approval, production readiness,
   legal compliance, or public marketing scope.
4. Verify tenant, database, and runtime ownership in architecture and code
   before proposing a change.
5. Treat browser-provided organization, establishment, role, permission,
   entitlement, membership, or tenant values as untrusted.
6. Keep cloud, POS, and Display persistence separate.
7. Treat `docs/tasks/` as task/history context only unless a current authority
   explicitly incorporates its decisions.
8. Treat UI references as visual evidence only. They do not define navigation,
   fields, permissions, APIs, schemas, or business rules.
9. When sources conflict, report the conflict and evidence. Do not silently
   choose the source that best fits the requested change.
10. Before treating a filesystem directory as an active product or package,
    verify Git tracking, its package manifest, workspace membership, and actual
    imports or dependencies. The removed legacy `packages/db` path and any
    local residue under it must not be used to restore or depend on `@yuta/db`.

## Current governance routing

- [`AUTHORITY_MODEL.md`](AUTHORITY_MODEL.md) selects authority by question type
  and defines conflict handling.
- [`LIFECYCLE_STATUS_MODEL.md`](LIFECYCLE_STATUS_MODEL.md) defines the five
  independent lifecycle dimensions.
- [`MODULE_REGISTRY.md`](MODULE_REGISTRY.md) routes products, runtimes, modules,
  capabilities, owners, evidence, lifecycle values, and review markers.
- The approved
  [`OPENSPEC_YUTA_NORMATIVITY_POLICY_REVIEW.md`](OPENSPEC_YUTA_NORMATIVITY_POLICY_REVIEW.md)
  governs approval, sync, validation, conflict, modification, and rollback for
  normative main specs.
- Approved feature/product homes provide broader Product Knowledge and context
  for their bounded scope.
- [`CURRENT_STATE.md`](CURRENT_STATE.md) remains a broad summary that must be
  verified against the applicable specific authority.

## OpenSpec integration checkpoint

The default schema is `yuta-spec-driven` and the normative main-spec role is
enabled. Inspect the current `openspec/specs/` and `openspec/changes/` trees for
their live contents; historical counts are not a navigation authority.

Successfully gated, synced, and validated main specs are the primary authority
for precise behavior inside accepted durable boundaries. Product Knowledge
remains broader intent/context; code and tests remain repository Implemented
State evidence; dated runtime, deployment, readiness, and external evidence
remain authority for live and production claims. OpenSpec changes are always
proposed or in-progress, and an empty main-spec directory establishes no
behavioral requirement.

## Historical audit

- [`docs/archive/knowledge-normalization/KNOWLEDGE_AUDIT.md`](archive/knowledge-normalization/KNOWLEDGE_AUDIT.md)
  records the initial evidence and questions that led to the approved
  governance models. Use the current models and registry for present routing;
  use the audit only for historical provenance.
