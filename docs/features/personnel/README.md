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
production-readiness evidence, or future normative OpenSpec specifications.

## 2. Users and roles

The currently implemented Personnel, Documents, Register, and connected
Formalités slices are `OWNER`-only. The server derives the role, organization,
active establishment, and personnel permissions from the authenticated
session. `STAFF` is denied, and no `MANAGER` Personnel authority is currently
approved or implemented.

## 3. Scope

### Current bounded scope

- A real, establishment-owned employee dossier supports bounded list, search,
  sort, read, create, minimum-field edit, non-destructive departure/reopening,
  completeness, and minimized history/access evidence.
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
- Formalités provides a fictional generic walkthrough and an off-by-default,
  employee-connected development prototype. The connected flow reads six
  allowlisted Personnel facts and keeps illustrative inputs and checkpoints in
  React memory only.
- Contract-extraction review has bounded local/synthetic evidence. This does
  not authorize external OCR/AI processing of real personnel files.

### Future or proposed scope

- A durable Formalités draft, generated-version, replacement, abandonment,
  signature, and signed-artifact handoff lifecycle is proposed but not
  implemented or enabled.
- Planning, Pointage, and Tâches du jour are planned surfaces with unresolved
  Product Decision status. Their placeholders do not establish an implemented
  capability or data owner.
- Any broader employee category, document category, reconstructed value
  history, production file provider, OCR/AI provider, or production operation
  remains separately approval-gated.

## 4. Capability map

| Capability                       | Current boundary                                                                                                                                                     |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Employee dossier / Salariés      | Real establishment-scoped minimum employee dossier and current-employment facts, with OWNER-only bounded reads and mutations.                                        |
| Personnel documents              | Development-only signed base-contract and signed-amendment flows; signed artifacts remain distinct from structured Personnel facts.                                  |
| Registre du personnel            | Development-only register records, reasoned corrections, and transient export derived from reviewed Personnel candidates; it is not silently created from a dossier. |
| Formalités development prototype | OWNER-only, development-only projection and in-memory interaction; no durable Formalités record or generated artifact exists.                                        |
| Durable Formalités lifecycle     | Proposed draft/version/generation/signature boundary; implementation is not started and its durable data owner still needs review.                                   |
| Planning                         | Planned related surface; no implemented Personnel integration.                                                                                                       |
| Pointage                         | Planned related surface; no implemented Personnel or Today integration.                                                                                              |
| Tâches du jour                   | Planned related surface; no implemented Personnel or Today integration.                                                                                              |

## 5. Lifecycle summary

Except for the explicitly marked Personnel Documents row, these values reuse
the approved bounded assignments in
[`MODULE_REGISTRY.md`](../../MODULE_REGISTRY.md). The Documents row records
only what current code and readiness evidence support; its Product Decision
status remains unresolved until a dedicated registry assignment is approved.

| Capability                       | Product Decision | Implementation | Environment        | Production Readiness | External Dependency                                                                           | Review Marker                                                             |
| -------------------------------- | ---------------- | -------------- | ------------------ | -------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Employee dossier / Salariés      | `APPROVED`       | `IMPLEMENTED`  | `UNVERIFIED`       | `BLOCKED`            | `BLOCKED` — personnel legal/privacy/retention/operations gates                                | `OK` for bounded repository scope; live environment is unverified         |
| Personnel documents              | `—`              | `IMPLEMENTED`  | `DEVELOPMENT_ONLY` | `BLOCKED`            | `BLOCKED` — approved private EU storage, scanning, retention, rights, and operations evidence | `NEEDS REVIEW` — no dedicated approved Module Registry row                |
| Registre du personnel            | `APPROVED`       | `IMPLEMENTED`  | `DEVELOPMENT_ONLY` | `BLOCKED`            | `BLOCKED` — legal register dictionary, retention, and operations                              | `OK`                                                                      |
| Formalités development prototype | `APPROVED`       | `PROTOTYPE`    | `DEVELOPMENT_ONLY` | `BLOCKED`            | `BLOCKED` — legal templates, privacy, storage, signature, and operations                      | `OK`                                                                      |
| Durable Formalités lifecycle     | `PROPOSED`       | `NOT_STARTED`  | `NOT_ENABLED`      | `BLOCKED`            | `BLOCKED` — legal/template/privacy/storage/signature gates                                    | `OK` — not merged with the development prototype                          |
| Planning                         | `—`              | `NOT_STARTED`  | `NOT_ENABLED`      | `NOT_ASSESSED`       | `NOT_ASSESSED`                                                                                | `NEEDS REVIEW` — planned wording does not resolve Product Decision status |
| Pointage                         | `—`              | `NOT_STARTED`  | `NOT_ENABLED`      | `NOT_ASSESSED`       | `NOT_ASSESSED`                                                                                | `NEEDS REVIEW` — planned wording does not resolve Product Decision status |
| Tâches du jour                   | `—`              | `NOT_STARTED`  | `NOT_ENABLED`      | `NOT_ASSESSED`       | `NOT_ASSESSED`                                                                                | `NEEDS REVIEW` — planned wording does not resolve Product Decision status |

## 6. Business boundaries

- Personnel owns the current structured employee dossier and current-employment
  facts for its bounded repository scope. It is separate from cloud user and
  membership identity and from restaurant-local POS staff.
- Formalités depends on an allowlisted Personnel projection. A future durable
  Formalités capability would own its draft and generated versions; it must not
  overwrite Personnel facts automatically.
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

| Scope                              | Runtime owner                | Data owner / persistence boundary                                                             |
| ---------------------------------- | ---------------------------- | --------------------------------------------------------------------------------------------- |
| Employee dossier and current facts | `apps/backoffice`            | `packages/db-cloud` personnel schema and repositories                                         |
| Signed personnel document metadata | `apps/backoffice`            | `packages/db-cloud`; development PDF bytes remain outside PostgreSQL in private local storage |
| Registre du personnel              | `apps/backoffice`            | `packages/db-cloud`; transient PDF output is not the data source                              |
| Formalités development prototype   | `apps/backoffice`            | `N/A`; illustrative values and checkpoints exist only in React memory                         |
| Durable Formalités                 | `apps/backoffice` (proposed) | `NEEDS REVIEW`; no durable schema, repository, or file boundary is implemented                |

Every persisted Personnel and Register operation uses trusted organization and
active-establishment scope. Browser-provided tenant, role, permission, employee,
or storage scope is not authority.

## 8. Related modules

| Related module        | Relationship                                                                                                                                                               | Source of truth / direction                                                                                                                                                                                  |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Formalités            | Reads an allowlisted Personnel projection; future drafts/generated versions remain Formalités-owned.                                                                       | Personnel supplies current employee facts; Formalités owns only its bounded formality state.                                                                                                                 |
| Registre du personnel | Uses reviewed employee candidates without silently registering every dossier.                                                                                              | Personnel owns current dossier facts; Register owns register records, corrections, and representation.                                                                                                       |
| Documents             | Stores signed base-contract and amendment evidence within the employee dossier experience.                                                                                 | Personnel owns structured facts; Documents owns signed artifacts and their versions.                                                                                                                         |
| Planning              | Relationship is recorded, but the current route is only a planned placeholder.                                                                                             | Personnel remains the employee identity source; future Planning ownership needs approval.                                                                                                                    |
| Pointage              | Relationship to Personnel and Today is recorded, but no integration is implemented.                                                                                        | Future data direction and owner need review; no current source may be inferred from the placeholder.                                                                                                         |
| Today                 | Any relationship is only a potential future relationship through capabilities such as Pointage or Tâches du jour; no direct Personnel -> Today integration is implemented. | This document does not approve such an integration. If later approved, it must consume through the appropriate owning module and source of truth rather than making Today a second employee identity source. |
| Tâches du jour        | Relationship to Personnel and Today is recorded, but the current route is only a planned placeholder.                                                                      | Future task ownership needs review; Personnel identity must not be duplicated silently.                                                                                                                      |

## 9. Current limitations and non-goals

- No durable Formalités record, saved draft, generated PDF, signature request,
  delivery, or automatic Documents link is implemented.
- No approved legal template set or production e-signature boundary is ready.
- Production Personnel remains blocked by the applicable legal/DPO/privacy,
  retention, private EU storage, scanning, audit, signature, backup/recovery,
  security, and operations gates.
- Real personnel files must not be sent to an external OCR/AI provider until
  every `PERSONNEL` and `AI_PERSONNEL` gate is approved. Synthetic or local
  evaluation is not production evidence.
- The current dossier history is deliberately minimized and is not a complete
  reconstructable value history or legal register.
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
| What is the detailed Register delivery boundary?                 | [Registre du personnel page pack](../../ui/pages/backoffice-equipe-registre-personnel/README.md).                                                                                                                                                                                                                         |
| What is prototype versus durable Formalités scope?               | [Formalités page pack](../../ui/pages/backoffice-equipe-formalites-personnel/README.md).                                                                                                                                                                                                                                  |
| Is Personnel production-ready?                                   | [`PRODUCTION_READINESS.md`](../../operations/PRODUCTION_READINESS.md), including `PERSONNEL` and `AI_PERSONNEL` gates.                                                                                                                                                                                                    |
| What is implemented in the repository?                           | [Backoffice Personnel routes](<../../../apps/backoffice/src/app/(authenticated)/equipe/salaries>), [Register route](<../../../apps/backoffice/src/app/(authenticated)/equipe/registre-personnel>), [Formalités route](<../../../apps/backoffice/src/app/(authenticated)/equipe/formalites-personnel>), and current tests. |
| What is the executable persisted shape?                          | [`packages/db-cloud` personnel schema](../../../packages/db-cloud/src/schema/personnel.ts) and the current personnel, document, amendment, and register repositories.                                                                                                                                                     |

## 11. Agent interpretation rules

1. Do not treat a page pack as Product Intent authority for the whole Personnel
   module; use it for its specific UI delivery scope and evidence.
2. Do not treat code existence, local QA, or a production build as proof of
   production readiness or current deployment.
3. Do not merge the development Formalités prototype with the proposed durable
   Formalités lifecycle.
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
7. OpenSpec is not currently normative for Personnel.

## 12. OpenSpec position

There is no normative Personnel specification under `openspec/specs/` today.
This file remains broader Product Knowledge context. After YUTA explicitly
approves OpenSpec specifications as normative, approved Personnel specs may
become the primary authority for specific behavioral requirements inside the
accepted product, architecture, and security boundaries. No OpenSpec artifact
is created or modified by this step.

## 13. Status

Status: APPROVED
