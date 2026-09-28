# YUTA Product Knowledge Entry Point

Status: Current

Visibility: Engineering

Owner: YUTA product and engineering

Last reviewed: 2026-09-28

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

- Implemented/current boundary: `docs/features/public-booking/README.md`
- Durable broader intent: `docs/features/public-booking/PRODUCT_SPEC.md`
- Remaining work/readiness: `docs/features/public-booking/STATUS.md`
- Decision: ADR-002
- Implementation: `apps/booking-web`, Backoffice reservation routes,
  `packages/booking`, contracts, and db-cloud booking persistence

The master product specification contains future direction. Do not describe
all of it as implemented.

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

For the bounded Satisfaction client / Feedback direct scope recorded in the
same Reputation home, repository-only fresh-agent acceptance also passed and
the Human authorized the authority cutover. Repository knowledge is canonical
for this scope. The shared Avis Page Chat is now `LEGACY EVIDENCE ONLY` for both
known migrated Avis and Satisfaction scopes. The nine Satisfaction Human
decision packets and two trusted-boundary conflicts remain open; hardening
Apply is not authorized. Marketing, Visibility, other Reputation scopes, and
all other Page Chats retain their existing authority.

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

### Today

- Approved Product Decision:
  `docs/decisions/ADR-005-today-operational-steering.md`
- Canonical Product Knowledge home: `docs/features/today/README.md`
- UI delivery evidence: `docs/ui/pages/today/README.md`
- Source-module behavior and ownership: Reservations / Booking administration,
  Reputation, and the owning module for each approved future information family
- Implementation: `apps/backoffice/src/app/(authenticated)/aujourdhui`

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
