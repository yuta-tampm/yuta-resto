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
- Planning, Pointage, and Tâches du jour are planned surfaces with unresolved
  Product Decision status. Their placeholders do not establish an implemented
  capability or data owner.
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
| Pointage                               | Planned related surface; no implemented Personnel or Today integration.                                                                                                                           |
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
| Pointage                               | `—`              | `NOT_STARTED`  | `NOT_ENABLED`      | `NOT_ASSESSED`       | `NOT_ASSESSED`                                                                                | `NEEDS REVIEW` — planned wording does not resolve Product Decision status |
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
- Planning, Pointage, and Tâches du jour may relate to Personnel, but their
  placeholders neither duplicate Personnel identity nor establish an
  integration. Any future integration must preserve the approved Personnel
  source rather than silently creating a second employee identity source.
- Repository implementation, local QA, and development enablement do not close
  legal, privacy, security, provider, operational, or production gates.

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
| Pointage              | Relationship to Personnel and Today is recorded, but no integration is implemented.                                                                                        | Future data direction and owner need review; no current source may be inferred from the placeholder.                                                                                                         |
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
- Planning, Pointage, and Tâches du jour are not implemented Personnel
  capabilities merely because their routes or navigation entries exist.

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
