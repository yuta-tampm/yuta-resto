# YUTA Product Knowledge Entry Point

Status: Current

Visibility: Engineering

Owner: YUTA product and engineering

Last reviewed: 2026-08-27

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
alone is not authority. The directory is currently empty, so the normative role
is enabled but no normative main-spec content exists yet.

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

The directory exists, but it contains no current change artifact.

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

- Product/current boundary: `docs/features/reputation/README.md`
- Remaining work: `docs/features/reputation/STATUS.md`
- Decision: ADR-004
- Implementation: `apps/feedback-web`, Backoffice reputation/integration
  routes, contracts, tenant resolution, and db-cloud reputation persistence

AI assistance, Google synchronization, and publication must be checked
individually; their presence in schemas or plans is not proof of a connected
production service.

### Restaurant Backoffice foundation

- Canonical Identity / Access Product Knowledge home:
  `docs/features/identity-access/README.md`
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
  `packages/db-cloud/src/establishment-profile-repository.ts`, and Booking
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
- Current summary and production gates: `CURRENT_STATE.md` and
  `docs/operations/PRODUCTION_READINESS.md`
- Detailed delivery evidence:
  - `docs/ui/pages/backoffice-equipe-salaries/`
  - `docs/ui/pages/backoffice-equipe-registre-personnel/`
  - `docs/ui/pages/backoffice-equipe-formalites-personnel/`
- Implementation: personnel routes/guards in `apps/backoffice` and personnel
  schema/repositories in `packages/db-cloud`

Always state the environment boundary. Repository-local or development-only
implementation does not mean production approval, legal validation, approved
templates, or connected OCR/AI.

Treat the employee-connected, in-memory Formalités development prototype as a
separate capability from the proposed durable Formalités lifecycle. The latter
includes any persisted draft/version records, generated documents, approved
templates, private storage, signature, lifecycle/history, and production
operation; it is not implemented by the current prototype.

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

Current observed state:

```text
default schema                 yuta-spec-driven
normative main-spec role       enabled
normative main-spec count      0
active OpenSpec change count   0
```

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
