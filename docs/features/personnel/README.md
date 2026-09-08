# YUTA Personnel Product Knowledge

Visibility: Engineering

Owner: YUTA product and engineering

Proposed: 2026-08-26

## 1. Purpose

Personnel is the Backoffice module for establishment-scoped employee dossiers,
their approved employment facts, protected signed-employment documents, and
bounded personnel workflows that depend on those facts. This document is the
canonical Product Knowledge entry point for the module. It does not replace
the specific UI page packs, tracked code and tests, executable schemas,
production-readiness evidence, or the approved normative Personnel OpenSpec specification.

## 2. Users and roles

The currently implemented Personnel, Documents, Register, and connected
Formalités slices are `OWNER`-only. The server derives the role, organization,
active establishment, and personnel permissions from the authenticated
session. `STAFF` is denied, and no `MANAGER` Personnel authority is currently
approved or implemented.

Formalités-owned state has a separate authorization prerequisite:
`formalites.read` and `formalites.manage`, both OWNER-only, independent of
Personnel permissions. Its [normative authorization specification](../../../openspec/specs/authorization/formalites/spec.md)
does not expand Personnel authority. The bounded employee-connected persistent
draft composes these guards with independent Personnel source-read checks. The
generic fictional prototype and existing grant mapping remain unchanged.

## 3. Scope

### Current bounded scope

- A real, establishment-owned employee dossier supports bounded list, search,
  sort, read, create, minimum-field edit, non-destructive departure/reopening,
  completeness, minimized access evidence, and a locally implemented
  reconstructable history for approved Personnel facts from the F07 cutover
  onward.
- The dossier's structured employee and current-employment facts are the
  Personnel source for bounded downstream projections. Login identities and
  tenant memberships are access records, not employee dossiers.

### Development-only scope

- The dossier `Documents` capability supports one signed base employment
  contract and distinct signed amendments. Metadata is persisted in
  `packages/db-cloud`; PDF bytes use private local storage and scanning, and the
  runtime fails closed in production.
- Registre du personnel provides an employee-only real-data inscription,
  correction, read, and transient PDF-export slice. It is enabled only in
  development and is not a legal-compliance claim.
- Formalités retains a fictional generic in-memory walkthrough and provides an
  off-by-default employee-connected persistent CDI preparation draft. The
  connected flow reads exactly seven allowlisted Personnel facts and persists
  only Formalités-owned draft, reconciliation, abandonment, and replay state in
  `packages/db-cloud`. It remains development-only and production-disabled.
- Contract-extraction review has bounded local/synthetic evidence. This does
  not authorize external OCR/AI processing of real personnel files.

### Future or proposed scope

- Formalités generated versions, replacement, legal templates, PDF/file
  storage, signature, signed-artifact handoff, final retention policy, and
  production operation remain proposed or separately gated. The bounded
  persistent-draft foundation does not implement those stages.
- Planning, the usable Pointage clocking workflow, and Tâches du jour remain
  planned surfaces with unresolved Product Decision status. Pointage now has a
  separately approved and implemented server-only authority/access foundation;
  that foundation does not make the placeholder a usable workflow.
- Any broader employee category, document category, pre-cutover history
  reconstruction, production file provider, OCR/AI provider, or production
  operation remains separately approval-gated.

## 4. Capability map

| Capability                             | Current boundary                                                                                                                                                                                  |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Employee dossier / Salariés            | Real establishment-scoped minimum dossier and current-employment facts, with OWNER-only bounded reads/mutations and local F07 value history from cutover onward.                                  |
| Personnel documents                    | Development-only signed base-contract and signed-amendment flows; signed artifacts remain distinct from structured Personnel facts.                                                               |
| Registre du personnel                  | Development-only register records, reasoned corrections, and transient export derived from reviewed Personnel candidates; it is not silently created from a dossier.                              |
| Formalités generic prototype           | OWNER-only fictional walkthrough with in-memory state; it remains separate from employee-connected persistence.                                                                                   |
| Formalités persistent draft foundation | OWNER-only, development-only CDI preparation draft with explicit save/reopen/reconciliation/abandonment, exactly seven Personnel source facts, and no Personnel write-back or generated artifact. |
| Future Formalités generation/signature | Proposed generated-version, legal-template, file-storage, signature, Documents-handoff, final-retention, and production stages; not implemented by the persistent foundation.                     |
| Planning                               | Planned related surface; no implemented Personnel integration.                                                                                                                                    |
| Pointage authority/access foundation   | Implemented cloud server foundation reads the scoped Personnel dossier and employment period without transferring ownership or writing Personnel state; no Today integration.                     |
| Future usable Pointage workflow        | Planned related surface; no browser transport, raw attendance evidence, clock-in/out UI, correction flow or downstream integration is implemented.                                                |
| Tâches du jour                         | Planned related surface; no implemented Personnel or Today integration.                                                                                                                           |

## 5. Lifecycle summary

Except for the explicitly marked Personnel Documents row, these values reuse
the approved bounded assignments in
[`MODULE_REGISTRY.md`](../../MODULE_REGISTRY.md). The Documents row records
only what current code and readiness evidence support; its Product Decision
status remains unresolved until a dedicated registry assignment is approved.

| Capability                             | Product Decision | Implementation | Environment        | Production Readiness | External Dependency                                                                           | Review Marker                                                             |
| -------------------------------------- | ---------------- | -------------- | ------------------ | -------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Employee dossier / Salariés            | `APPROVED`       | `IMPLEMENTED`  | `UNVERIFIED`       | `BLOCKED`            | `BLOCKED` — personnel legal/privacy/retention/operations gates                                | `OK` for bounded repository scope; live environment is unverified         |
| Personnel documents                    | `—`              | `IMPLEMENTED`  | `DEVELOPMENT_ONLY` | `BLOCKED`            | `BLOCKED` — approved private EU storage, scanning, retention, rights, and operations evidence | `NEEDS REVIEW` — no dedicated approved Module Registry row                |
| Registre du personnel                  | `APPROVED`       | `IMPLEMENTED`  | `DEVELOPMENT_ONLY` | `BLOCKED`            | `BLOCKED` — legal register dictionary, retention, and operations                              | `OK`                                                                      |
| Formalités generic prototype           | `APPROVED`       | `PROTOTYPE`    | `DEVELOPMENT_ONLY` | `BLOCKED`            | `BLOCKED` — legal templates, privacy, storage, signature, and operations                      | `OK`                                                                      |
| Formalités persistent draft foundation | `APPROVED`       | `IMPLEMENTED`  | `DEVELOPMENT_ONLY` | `BLOCKED`            | `BLOCKED` — legal/template/privacy/retention/operations gates                                 | `OK` for bounded local repository scope; production remains deferred      |
| Future Formalités generation/signature | `PROPOSED`       | `NOT_STARTED`  | `NOT_ENABLED`      | `BLOCKED`            | `BLOCKED` — legal/template/privacy/storage/signature gates                                    | `OK` — separate from the persistent draft foundation                      |
| Planning                               | `—`              | `NOT_STARTED`  | `NOT_ENABLED`      | `NOT_ASSESSED`       | `NOT_ASSESSED`                                                                                | `NEEDS REVIEW` — planned wording does not resolve Product Decision status |
| Pointage authority/access foundation   | `APPROVED`       | `IMPLEMENTED`  | `NOT_ENABLED`      | `BLOCKED`            | `BLOCKED` — trusted production client-address provenance and legal/privacy gates              | `OK` — bounded foundation only; no usable clocking or readiness promotion |
| Future usable Pointage workflow        | `—`              | `NOT_STARTED`  | `NOT_ENABLED`      | `NOT_ASSESSED`       | `NOT_ASSESSED`                                                                                | `NEEDS REVIEW` — foundation approval does not approve the workflow        |
| Tâches du jour                         | `—`              | `NOT_STARTED`  | `NOT_ENABLED`      | `NOT_ASSESSED`       | `NOT_ASSESSED`                                                                                | `NEEDS REVIEW` — planned wording does not resolve Product Decision status |

## 6. Business boundaries

- Personnel owns the current structured employee dossier and current-employment
  facts for its bounded repository scope. It is separate from cloud user and
  membership identity and from restaurant-local POS staff.
- Formalités depends on an allowlisted Personnel projection. The bounded
  persistent foundation owns its draft, reconciliation, abandonment, and replay
  state. Future generated versions remain Formalités-owned; neither current nor
  future Formalités state may overwrite Personnel facts automatically.
- Documents owns signed base-contract and amendment artifacts. A structured
  employment summary or generated Formalités version is not itself a signed
  artifact.
- Registre du personnel depends on reviewed Personnel candidate facts but owns
  its register-specific inscription, sequence, correction history, audit, and
  transient representation.
- The Pointage authority/access foundation reads only trusted scoped Personnel
  dossier and employment-period data. Personnel remains the canonical employee
  and lifecycle source; Pointage credentials and contexts do not create a
  second employee identity. Planning, the usable Pointage workflow and Tâches du
  jour remain separately reviewable, and no Today integration is implemented.
- Repository implementation, local QA, and development enablement do not close
  legal, privacy, security, provider, operational, or production gates.

### GLOBAL YUTA Formalités legal-template foundation

A separate [legal-template persistence foundation](../../../openspec/specs/formalites/legal-template-foundation/spec.md)
is implemented in `packages/db-cloud` for GLOBAL YUTA Formalités resources.
It owns stable template identities, at most one active mutable working draft
per identity, and immutable frozen template versions. A frozen template
version is a review candidate, not a generated employee contract or a
reviewed, published or qualified template. These resources have no tenant
owner; administration uses the existing exact system-operation authority,
not restaurant membership.

This foundation does not add a Platform Admin application, actual CDI/CDD
content, legal-review evidence storage, publication/qualification/retirement,
generation, signature or Documents handoff. Existing lifecycle/readiness
values and production gates remain unchanged. Future legal-template scope
elsewhere in this Home refers to those excluded content/lifecycle stages,
not absence of this separate persistence foundation.

### GLOBAL YUTA Formalités template governance

The [normative legal-review governance contract](../../../openspec/specs/formalites/template-legal-review-governance/spec.md)
defines the documentary prerequisites for future qualification and publication
of GLOBAL YUTA Formalités templates. Formalités remains their semantic owner;
Platform Admin remains the future internal administration runtime/access
boundary. These resources are not organization- or establishment-owned, and
restaurant memberships provide no global administration authority.

External/manual review requires an identifiable reviewer with evidenced
authority and competence for the exact review scope, but no YUTA account.
The three review outcomes are `APPROVED`, `CHANGES_REQUIRED`, and `REJECTED`.
Qualification binds to the exact immutable version/checksum and reviewed
applicability envelope, including conditions and effective dates; it also
requires complete accepted review evidence, a current approved review,
successful authorized publication and a non-retired version. Authorization
allow or review completion alone does not establish qualification.

The external reviewer must differ from the internal publisher; the recorder
may be that publisher. An authorized `YUTA_ADMIN` may record/link received
external evidence within the future publication action, but does not author
or alter the legal opinion. This creates no standalone evidence CRUD, reviewer
identity in YUTA, or sixth system operation. The existing five-operation
authorization foundation and tenant isolation remain unchanged.

Content or applicability changes require a new version and new review.
Supersession preserves historical attribution, while retirement blocks future
use without rewriting historical evidence or previously generated artifacts.
Authorization audit,
legal-review evidence and publication/retirement audit retain distinct meanings.
Qualification is not a legal-compliance or final-contract guarantee; the
normative contract controls the exact bounded wording. Privacy and retention
decisions remain prerequisites before corresponding evidence processing or
persistence; deferred retention duration is not permission to collect or store.

This is a governance contract, not a template implementation, actual legal
review, publication service, evidence store or Platform Admin application.
Generation, PDF, signature, Documents handoff and provider integration remain
excluded. Existing lifecycle/readiness values and production/legal/privacy
gates are unchanged; no production enablement follows.

## 7. Data and ownership

| Scope                                  | Runtime owner                | Data owner / persistence boundary                                                                                   |
| -------------------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Employee dossier and current facts     | `apps/backoffice`            | `packages/db-cloud` personnel schema and repositories                                                               |
| Reconstructable Personnel history      | `apps/backoffice`            | `packages/db-cloud`; immutable Personnel event/group evidence scoped by organization, establishment, and employee   |
| Signed personnel document metadata     | `apps/backoffice`            | `packages/db-cloud`; development PDF bytes remain outside PostgreSQL in private local storage                       |
| Registre du personnel                  | `apps/backoffice`            | `packages/db-cloud`; transient PDF output is not the data source                                                    |
| Formalités generic prototype           | `apps/backoffice`            | `N/A`; fictional illustrative state exists only in React memory                                                     |
| Formalités persistent draft foundation | `apps/backoffice`            | `packages/db-cloud`; Formalités-owned draft/receipt state with full organization, establishment, and employee scope |
| Future generated Formalités artifacts  | `apps/backoffice` (proposed) | `NEEDS REVIEW`; no generated-file, signature, Documents-handoff, or production storage boundary is implemented      |

Every persisted Personnel and Register operation uses trusted organization and
active-establishment scope. Browser-provided tenant, role, permission, employee,
or storage scope is not authority.

## 8. Related modules

| Related module        | Relationship                                                                                                                                                               | Source of truth / direction                                                                                                                                                                                  |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Formalités            | Reads exactly seven allowlisted Personnel facts for the bounded persistent draft; future generated versions remain Formalités-owned.                                       | Personnel supplies current employee facts; Formalités owns its bounded draft/reconciliation state and never writes those facts back.                                                                         |
| Registre du personnel | Uses reviewed employee candidates without silently registering every dossier.                                                                                              | Personnel owns current dossier facts; Register owns register records, corrections, and representation.                                                                                                       |
| Documents             | Stores signed base-contract and amendment evidence within the employee dossier experience.                                                                                 | Personnel owns structured facts; Documents owns signed artifacts and their versions.                                                                                                                         |
| Planning              | Relationship is recorded, but the current route is only a planned placeholder.                                                                                             | Personnel remains the employee identity source; future Planning ownership needs approval.                                                                                                                    |
| Pointage              | The server-only foundation resolves trusted scoped dossier/employment period; no Personnel write, Today integration, browser workflow or raw evidence exists.              | Personnel owns employee dossier/lifecycle; Pointage owns its credentials/authority and future raw actual-work evidence under the normative foundation specs.                                                 |
| Today                 | Any relationship is only a potential future relationship through capabilities such as Pointage or Tâches du jour; no direct Personnel -> Today integration is implemented. | This document does not approve such an integration. If later approved, it must consume through the appropriate owning module and source of truth rather than making Today a second employee identity source. |
| Tâches du jour        | Relationship to Personnel and Today is recorded, but the current route is only a planned placeholder.                                                                      | Future task ownership needs review; Personnel identity must not be duplicated silently.                                                                                                                      |

## 9. Current limitations and non-goals

- A bounded development-only Formalités draft can be saved and reopened. No
  generated PDF, legal template, signature request, delivery, production
  operation, or automatic Documents link is implemented.
- No approved legal template set or production e-signature boundary is ready.
- Production Personnel remains blocked by the applicable legal/DPO/privacy,
  retention, private EU storage, scanning, audit, signature, backup/recovery,
  security, and operations gates.
- Real personnel files must not be sent to an external OCR/AI provider until
  every `PERSONNEL` and `AI_PERSONNEL` gate is approved. Synthetic or local
  evaluation is not production evidence.
- F07 locally retains typed previous/new evidence for approved Identity, Role,
  Contract terms, Work time, Entry, and Departure changes. Its cutover
  baseline means only “current values at the start of historisation”; it does
  not reconstruct missing pre-cutover facts or constitute a legal register.
- Classification and conditional metadata are evaluated per changed semantic
  group. Applicable `CHANGE` dates may be in the past or today, never in the
  future; no scheduled or pending Personnel state exists.
- The existing `Historique` remains OWNER-only and newest-50, without search,
  filter, pagination, or export. The approved five-year post-departure rule is
  represented only as retention eligibility; no cleanup executor, legal-hold
  authority, or production rollout is introduced.
- The Register development slice is not a legal-compliance certification, and
  its transient PDF is not the canonical data source.
- Planning, the usable Pointage workflow, and Tâches du jour are not implemented
  Personnel capabilities merely because their routes or navigation entries
  exist. The Pointage authority/access foundation remains a separate server-only
  prerequisite, not a usable Personnel or Pointage page.

## 10. Source map

| Question                                                         | Read this source                                                                                                                                                                                                                                                                                                          |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| What is the Personnel module boundary and capability map?        | This Product Knowledge home.                                                                                                                                                                                                                                                                                              |
| What is the approved lifecycle assignment?                       | [`MODULE_REGISTRY.md`](../../MODULE_REGISTRY.md) and [`LIFECYCLE_STATUS_MODEL.md`](../../LIFECYCLE_STATUS_MODEL.md).                                                                                                                                                                                                      |
| How should conflicting sources be interpreted?                   | [`AUTHORITY_MODEL.md`](../../AUTHORITY_MODEL.md).                                                                                                                                                                                                                                                                         |
| What is the detailed Salariés UI delivery and as-built evidence? | [Salariés page pack](../../ui/pages/backoffice-equipe-salaries/README.md).                                                                                                                                                                                                                                                |
| What precise reconstructable-history behavior is normative?      | [Personnel reconstructable-value-history specification](../../../openspec/specs/personnel/reconstructable-value-history/spec.md).                                                                                                                                                                                         |
| What is the detailed Register delivery boundary?                 | [Registre du personnel page pack](../../ui/pages/backoffice-equipe-registre-personnel/README.md).                                                                                                                                                                                                                         |
| What is prototype versus durable Formalités scope?               | [Formalités page pack](../../ui/pages/backoffice-equipe-formalites-personnel/README.md).                                                                                                                                                                                                                                  |
| What persistent Formalités draft behavior is normative?          | [Formalités persistent-draft foundation specification](../../../openspec/specs/formalites/persistent-draft-foundation/spec.md).                                                                                                                                                                                           |
| Is Personnel production-ready?                                   | [`PRODUCTION_READINESS.md`](../../operations/PRODUCTION_READINESS.md), including `PERSONNEL` and `AI_PERSONNEL` gates.                                                                                                                                                                                                    |
| What is implemented in the repository?                           | [Backoffice Personnel routes](<../../../apps/backoffice/src/app/(authenticated)/equipe/salaries>), [Register route](<../../../apps/backoffice/src/app/(authenticated)/equipe/registre-personnel>), [Formalités route](<../../../apps/backoffice/src/app/(authenticated)/equipe/formalites-personnel>), and current tests. |
| What is the executable persisted shape?                          | [`packages/db-cloud` personnel schema](../../../packages/db-cloud/src/schema/personnel.ts), [Formalités schema](../../../packages/db-cloud/src/schema/formalites.ts), and the current Personnel, Documents, Register, and Formalités repositories.                                                                        |

## 11. Agent interpretation rules

1. Do not treat a page pack as Product Intent authority for the whole Personnel
   module; use it for its specific UI delivery scope and evidence.
2. Do not treat code existence, local QA, or a production build as proof of
   production readiness or current deployment.
3. Keep the generic in-memory Formalités prototype, bounded persistent draft
   foundation, and proposed generation/signature lifecycle distinct.
4. Do not map `planned` to a Product Decision status. Use `—` and
   `NEEDS REVIEW` when the approved evidence cannot resolve it.
5. When sources conflict, apply the Authority Model and retain `CONFLICT` or
   `NEEDS REVIEW`; do not silently choose or normalize a source.
6. Do not silently duplicate Personnel employee identity or current-employment
   facts in another module when the approved Personnel source already owns
   them. Today does not currently consume Personnel data. If a future Today
   integration is approved, it must consume through the appropriate owning
   module and source of truth rather than becoming a second employee identity
   source.
7. The approved Personnel reconstructable-value-history main spec is normative for precise F07 behavior; this file remains the broader Product Knowledge source.

## 12. OpenSpec position

The approved [Personnel reconstructable-value-history specification](../../../openspec/specs/personnel/reconstructable-value-history/spec.md)
is normative for precise observable F07 behavior inside the accepted Personnel,
tenancy, privacy, and runtime boundaries. This file remains the broader Product
Knowledge context and does not claim production enablement.

The completed planning evidence is archived at
`openspec/changes/archive/2026-09-03-personnel-reconstructable-value-history`.
Sync and archive do not authorize production migration, cutover, cleanup,
anonymization, deployment, or Production Readiness.

## 13. Status

Status: APPROVED
