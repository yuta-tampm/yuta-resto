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
It is also the canonical repository home for current Formalités Product,
ownership, implementation, legal-status, and readiness boundaries.

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

- Formalités generated employee versions, replacement, actual legal-template
  content and qualification, PDF/file storage, signature, signed-artifact
  handoff, final retention policy, and production operation remain unimplemented
  or separately gated. The bounded persistent-draft foundation does not
  implement those stages. A separate GLOBAL YUTA legal-template persistence
  foundation is implemented without an application runtime or legal content.
- Planning and Tâches du jour remain planned surfaces with unresolved Product
  Decision status. Pointage has a separately approved and implemented bounded
  employee raw-clocking slice with `CLOCK_IN`/`CLOCK_OUT`, immutable raw
  attendance evidence and derived sessions; it is not a Personnel workflow.
  This does not implement corrections or Planning/Today/payroll integration.
  Real employee attendance and production enablement remain `NOT_AUTHORIZED`;
  all seven legal/privacy/provenance blockers remain unresolved.
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
| GLOBAL YUTA legal-template foundation  | Implemented repository foundation for stable identities, one active working draft, and immutable frozen versions; no actual legal content, qualification, publication, runtime, or tenant customization. |
| Future Formalités generation/signature | Approved generated-version direction plus separately proposed or gated file-storage, signature, Documents-handoff, final-retention, and production stages; none is implemented by the persistent draft. |
| Planning                               | Planned related surface; no implemented Personnel integration.                                                                                                                                    |
| Pointage authority/access foundation | Implemented cloud foundation reads the scoped Personnel dossier and employment period without transferring ownership or writing Personnel state; no Today integration. |
| Pointage usable raw clocking | Implemented bounded employee route and raw-clocking service recheck current Personnel eligibility; Pointage owns immutable raw attendance evidence. Real attendance and production remain unauthorized. |
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
| GLOBAL YUTA legal-template foundation  | `—`              | `IMPLEMENTED`  | `NOT_ENABLED`      | `BLOCKED`            | `BLOCKED` — actual content, external legal review, privacy/retention, runtime, and operations  | `NEEDS REVIEW` for Product Decision; bounded repository persistence is verified |
| Generated unsigned Formalités version  | `APPROVED`       | `NOT_STARTED`  | `NOT_ENABLED`      | `BLOCKED`            | `BLOCKED` — qualified template, file storage, privacy/retention, and operations                | `OK` for F5-07 Product direction; implementation remains separately gated |
| Signature and Documents handoff        | `PROPOSED`       | `NOT_STARTED`  | `NOT_ENABLED`      | `BLOCKED`            | `BLOCKED` — provider, legal/privacy/security, storage, evidence, and operations                | `NEEDS REVIEW` — signed-artifact ownership is settled; workflow is not    |
| Planning                               | `—`              | `NOT_STARTED`  | `NOT_ENABLED`      | `NOT_ASSESSED`       | `NOT_ASSESSED`                                                                                | `NEEDS REVIEW` — planned wording does not resolve Product Decision status |
| Pointage authority/access foundation | `APPROVED` | `IMPLEMENTED` | `NOT_ENABLED` | `BLOCKED` | `BLOCKED` — trusted production client-address provenance and legal/privacy gates | `OK` — bounded foundation only; no readiness promotion |
| Pointage usable raw clocking | `APPROVED` | `IMPLEMENTED` | `NOT_ENABLED` | `BLOCKED` | `BLOCKED` — trusted production client-address provenance and six legal/privacy gates | `OK` — synthetic/disposable evidence only; real attendance unauthorized |
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
- Pointage authority and usable raw clocking read only the trusted scoped
  Personnel dossier, display-name projection and employment period. Personnel
  remains the canonical employee/lifecycle source; Pointage credentials,
  continuations and raw events do not create a second employee identity or
  write Personnel state. Pointage owns immutable actual-work evidence. Planning,
  corrections, payroll, Tâches du jour and Today integration remain separately
  reviewable and are not implemented by this slice.
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

The global operation catalog is exactly `formalites.template.read`,
`formalites.template.draft.manage`, `formalites.template.review.submit`,
`formalites.template.publish`, and `formalites.template.retire`. A trusted,
active `YUTA_ADMIN` has explicit grants for those five operations;
`YUTA_SUPPORT` has none. Prefixes, wildcards, tenant roles, and restaurant
memberships do not grant access. These technical grants authorize only the
corresponding repository or future runtime operation. They do not make the
actor a legal reviewer and do not establish review, publication,
qualification, or legal compliance.

This foundation does not add a Platform Admin application, actual CDI/CDD
content, legal-review evidence storage, publication/qualification/retirement,
generation, signature or Documents handoff. Its bounded lifecycle row records
implemented persistence in a `NOT_ENABLED`, production-blocked environment;
production gates remain unchanged. Future legal-template scope elsewhere in
this Home refers to those excluded content/lifecycle stages, not absence of this
separate persistence foundation.

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
There is no standalone global “qualification role.” Qualification is a bounded
result of the exact version, current accepted external review evidence,
applicability envelope, authorized publication, and non-retired state defined
by the governance specification.

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
excluded. This governance contract does not promote any lifecycle/readiness
value or close production/legal/privacy gates; no production enablement follows.

### Reconciled Formalités authority map

This section records the repository reconciliation completed on 2026-09-28.
The supplied legacy extract is provenance only. The reconciliation step did not
replace current Product authority, create a legal conclusion, or by itself
retire Formalités Page Chat authority. Product, implementation, legal status,
environment, readiness, and production authorization are independent
dimensions.
Current Formalités production readiness is `BLOCKED` and production
authorization is `NOT_AUTHORIZED`; only the path, evidence, and decisions needed
to reach a future production review remain unresolved.

The explicit Human Product direction remains current because no later Human
decision supersedes it: Formalités is intended to assist the employee
administrative journey through `Embauche -> Vie du contrat -> Départ ->
Archives`. Its high-level purpose is to help identify actions, documents,
evidence, deadlines, current state, and next steps rather than act only as PDF
storage. The Product model distinguishes `Action`, `Document`, and `Preuve` and
preserves historical contract/version chains instead of overwriting them.
This confirms direction and information architecture only. It does not approve
the exact current V1 beyond the persistent draft, any specific legal workflow,
legal rule, provider integration, or implementation.

| Capability | Product status | Implementation | Legal / regulatory status | Environment | Readiness / production authorization | Actors and scope | Unresolved boundary |
| ---------- | -------------- | -------------- | ------------------------- | ----------- | ------------------------------------ | ---------------- | ------------------- |
| Broad employee administration lifecycle (`Embauche -> Vie du contrat -> Départ -> Archives`) | `CONFIRMED` high-level Human Product direction; exact current V1 beyond the persistent draft is `UNRESOLVED` | `PARTIAL` only through separately classified bounded slices; the lifecycle as a whole is not implemented | `NOT_APPLICABLE` to the direction; specific legal workflows require current external review | `NOT_ENABLED` as a whole | `BLOCKED` / `NOT_AUTHORIZED` | Restaurateur/employer and employee at direction level; current implemented tenant actor remains OWNER only | Exact V1 capability set, workflow order, permissions, evidence, and rollout |
| Generic Formalités walkthrough | `APPROVED` for its fictional prototype boundary | `PROTOTYPE` in React memory | `NOT_APPLICABLE`; it is fictional and creates no legal outcome | `DEVELOPMENT_ONLY` | `BLOCKED` / `NOT_AUTHORIZED` | `OWNER` in the current Backoffice context | No durable or production behavior may be inferred |
| Persistent CDI preparation draft | `APPROVED` | `IMPLEMENTED` | `NOT_APPLICABLE` to the persistence mechanics; the draft is not legal advice or a contract | `DEVELOPMENT_ONLY`, explicit opt-in, production fail-closed | `BLOCKED` / `NOT_AUTHORIZED` | Tenant `OWNER`; active organization and establishment; independent `formalites.read` or `formalites.manage` plus Personnel source read where required | Final retention and every post-draft transition |
| Generated unsigned Formalités version | `APPROVED` Product direction in F5-07 | `NOT_STARTED` | `REQUIRES_CURRENT_EXTERNAL_REVIEW` for template content and use | `NOT_ENABLED` | `BLOCKED` / `NOT_AUTHORIZED` | Planned `OWNER` confirmation in trusted tenant scope | Required input authority, qualified template selection, rendering, storage, and replacement implementation |
| GLOBAL YUTA legal-template persistence foundation | Current normative bounded foundation; Product Decision lifecycle value `—` pending separate assignment | `IMPLEMENTED` in `packages/db-cloud` | `NOT_APPLICABLE` to persistence; actual content/review is `REQUIRES_CURRENT_EXTERNAL_REVIEW` | `NOT_ENABLED`; no application runtime | `BLOCKED` / `NOT_AUTHORIZED` | Trusted active internal user with exact system operation; global scope, no organization or establishment owner | Product Decision assignment, actual content, review evidence, qualification, publication, retirement, runtime, and operations |
| Template legal-review governance | Current normative documentary contract; Product Decision lifecycle value `—` pending separate assignment | Runtime and evidence store `NOT_STARTED` | `REQUIRES_CURRENT_EXTERNAL_REVIEW`; no accepted review is present | `NOT_ENABLED` | `BLOCKED` / `NOT_AUTHORIZED` | External reviewer and internal publisher must be distinct; existing system grants do not prove qualification | Product Decision assignment, reviewer engagement, evidence persistence, publisher composition, applicability sources, and current review |
| Restaurant-customized templates | `CONFIRMED` high-level future Human Product direction; explicitly `OUT_OF_SCOPE` for the first global-only foundation | `NOT_STARTED` | `NOT_APPLICABLE` to the direction; actual template content/use requires current external review | `NOT_ENABLED` | `BLOCKED` / `NOT_AUTHORIZED` | No approved tenant customization actor or permission model | Roadmap timing, global-plus-tenant model, ownership, review, and applicability |
| Electronic signature and signed-artifact handoff | Excluded from the approved current phase; future workflow `PROPOSED` | `NOT_STARTED` | `REQUIRES_CURRENT_EXTERNAL_REVIEW` | `NOT_ENABLED` | `BLOCKED` / `NOT_AUTHORIZED` | No approved provider actor; a resulting signed artifact belongs to Documents | Provider, identity/evidence model, acceptance semantics, recovery, and handoff |
| Declarations, external submissions, and provider integrations | Current connected draft explicitly excludes DPAE/DSN and providers; broader direction is `UNRESOLVED` | `NOT_STARTED` | `REQUIRES_CURRENT_EXTERNAL_REVIEW` | `NOT_ENABLED` | `BLOCKED` / `NOT_AUTHORIZED` | No approved submitting actor or integration scope | Product scope, legal rules, acknowledgements, retries, evidence, and operations |
| Retention, deletion, legal hold, and audit operations | Requirements are acknowledged; final behavior is `UNRESOLVED` | No cleanup or final policy implementation | `REQUIRES_CURRENT_EXTERNAL_REVIEW` | `NOT_ENABLED` for production | `BLOCKED` / `NOT_AUTHORIZED` | Current draft retains active and abandoned records; no actor has approved cleanup authority | Per-class duration, rights process, legal hold, backup propagation, audit access, and deletion execution |

#### Persistent CDI draft: exact current model

- The only supported `formalityType` is `cdi_preparation`. Eligibility requires
  a current scoped Personnel dossier whose current employment term is CDI; no
  full-time, upcoming, departure, probation-law, or other legal eligibility gate
  is added.
- The seven duplicated draft/source facts are `givenNames`, `familyName`,
  `position`, `qualification`, `employmentTermType`, `entryDate`, and
  `contractWeeklyMinutes`. Formalités also owns `probationChoice`, exactly
  `undecided`, `include`, or `exclude`; `include` is preparation metadata only.
- Persisted draft statuses are exactly `draft` and `abandoned`. Commands are
  exactly `create`, `save`, `reconcile`, and `abandon`; outcomes are exactly
  `created`, `saved`, `reconciled`, and `abandoned`. Save is explicit and there
  is no autosave.
- At most one `draft` exists per organization, establishment, employee, and
  formality type. Abandon requires a non-blank reason, retains the record, and
  makes it read-only. A new draft may be created after abandonment when current
  eligibility holds.
- Reopen and edit operate on the durable draft. When Personnel source facts
  diverge, the server requires a decision for every divergent fact: `keep`
  preserves the Formalités draft value while acknowledging the new Personnel
  source, and `refresh` copies the current trusted Personnel value into both.
  Neither choice writes back to Personnel.

#### Draft, document, signature, submission, and evidence states

| Term | Current repository meaning |
| ---- | -------------------------- |
| Transient UI state | The generic fictional walkthrough; it is not durable business data. |
| Persistent / saved / reopened draft | The implemented employee-connected `draft` record above. Save and reopen do not make a contract or legal document. |
| Abandoned draft | Implemented retained `abandoned` record with reason; no hard delete or automatic expiry. |
| Validated draft | No approved persisted lifecycle state or transition exists. Do not infer one from UI review or completeness. |
| Generated unsigned output | Approved future F5-07 Product direction: immutable version after explicit OWNER confirmation, with replacement superseding rather than overwriting. No generator, file, or state is implemented. |
| Final document | No separate approved or implemented Formalités state establishes finality or legal validity. |
| Employer signature | No approved or implemented signature transition. |
| Employee signature / acceptance | No approved or implemented acceptance transition. |
| Signed artifact | If produced through a future approved process, Documents owns it; a draft, template, frozen template candidate, or unsigned generated version is not that artifact. |
| Submitted / declarative artifact | No DPAE, DSN, government, provider submission, acknowledgement, or retry capability is approved or implemented here. |
| Archived evidence | Current draft retention and immutable template versions preserve their own records. Neither is legal-review evidence, submission evidence, or a signed Documents archive. |

#### Legal workflow inventory

The legacy extract discussed the following workflows. Current repository
authority creates no deadlines, eligibility rules, required-document lists,
submission rules, or legal outcomes for them.

| Workflow | Current Product authority | Implementation | Legal status |
| -------- | ------------------------- | -------------- | ------------ |
| DPAE and DSN | Their category belongs to the confirmed long-term direction; they are excluded from the current persistent draft and exact V1 behavior is unresolved | None | `REQUIRES_CURRENT_EXTERNAL_REVIEW` |
| CDD renewal | Category belongs to the confirmed long-term direction; exact V1 behavior is proposed or unresolved | None | `REQUIRES_CURRENT_EXTERNAL_REVIEW` |
| Mutuelle / prévoyance | Category belongs to the confirmed long-term direction; exact V1 behavior is proposed or unresolved | None | `REQUIRES_CURRENT_EXTERNAL_REVIEW` |
| Santé au travail | Category belongs to the confirmed long-term direction; exact V1 behavior is proposed or unresolved | None | `REQUIRES_CURRENT_EXTERNAL_REVIEW` |
| Accident du travail / trajet | Category belongs to the confirmed long-term direction; exact V1 behavior is proposed or unresolved | None | `REQUIRES_CURRENT_EXTERNAL_REVIEW` |
| Titre de séjour / right to work | Category belongs to the confirmed long-term direction; exact V1 behavior is proposed or unresolved | None | `REQUIRES_CURRENT_EXTERNAL_REVIEW` |
| Entretien de parcours professionnel | Category belongs to the confirmed long-term direction; exact V1 behavior is proposed or unresolved | None | `REQUIRES_CURRENT_EXTERNAL_REVIEW` |
| Departure documents | Category belongs to the confirmed long-term direction; exact V1 behavior is proposed or unresolved | None | `REQUIRES_CURRENT_EXTERNAL_REVIEW` |
| Discipline | Category belongs to the confirmed long-term direction; exact V1 behavior is proposed or unresolved | None | `REQUIRES_CURRENT_EXTERNAL_REVIEW` |
| Family-related events | Category belongs to the confirmed long-term direction; exact V1 behavior is proposed or unresolved | None | `REQUIRES_CURRENT_EXTERNAL_REVIEW` |
| CDI clauses and legally required data | Contract preparation belongs to the confirmed direction; the current draft stores seven Personnel facts and one preparation choice only, and no current legal clause set is approved | None beyond those draft fields | `REQUIRES_CURRENT_EXTERNAL_REVIEW` |

No DPAE, URSSAF, DSN, TESE, France Travail, mutuelle, santé au travail,
payroll/accounting, electronic-signature, document-submission, or government API
integration is implemented. YUTA may assist with preparation, checklists,
completeness, and evidence under an approved scope; it must not autonomously
certify compliance, determine a legal outcome, recommend dismissal, validate a
legal document, sign, file, or submit.

#### Remaining decision packets

These eight grouped decisions remain open. They are not authorization to begin
Product or legal work.

| ID | Exact decision | Current evidence and affected capability | Product / legal impact and required authority | An agent must not infer |
| -- | -------------- | ---------------------------------------- | --------------------------------------------- | ----------------------- |
| `FORM-01` | Which exact capability is current V1 beyond the persistent CDI draft, and what is its rollout order? | The high-level lifecycle is confirmed; current authority implements the bounded draft and approves F5-07 direction without selecting the next workflow | Product owner; current external legal review for the selected legal workflow | That every hiring, contract-life, departure, or archive category is current V1 |
| `FORM-02` | When does restaurant customization enter the roadmap, and what exact global-plus-tenant model applies? | The high-level customization direction is confirmed; the first foundation expressly remains global and non-tenant | Product and architecture owners, then legal/privacy review | Tenant customization in the current foundation, current implementation, or a decided delivery date |
| `FORM-03` | Which actual template content and applicability envelope may be qualified | Empty legal-content foundation; `HR-TEMPLATE-01` blocked | Product plus qualified French employment-law reviewer | That a frozen version, checksum, or applicability assertion is reviewed or compliant |
| `FORM-04` | What Product Decision status applies to the global template foundation/governance, and how review evidence, publication, qualification, and retirement execute | Normative foundation/governance and persistence exist; no separately assigned Product Decision value, runtime, evidence store, or completed review | Product owner, security, privacy, legal reviewer, and internal publication authority | That implementation or a system grant creates Product approval, or that review submission alone qualifies a template |
| `FORM-05` | How generated unsigned output is implemented and stored | F5-07 Product direction; no generator, approved template selector, renderer, or private file store | Product, architecture, privacy, security, operations, and legal review | That the persistent draft may already finalize or generate a contract |
| `FORM-06` | Whether to introduce electronic signature and the exact Documents handoff | Signed artifacts belong to Documents; provider and workflow absent | Product, legal, privacy, security, operations, and provider approval | Signature validity, acceptance semantics, or automatic handoff |
| `FORM-07` | Which exact legal workflows and external declarations/integrations enter current V1, and with what behavior? | Their categories may belong to the confirmed high-level direction, but the current draft excludes them and exact rules/integrations are not approved | Product owner and current qualified legal review, plus provider/security/operations review where applicable | That category inclusion approves deadlines, required documents, eligibility, submissions, acknowledgements, or retries |
| `FORM-08` | Per-class retention, deletion, legal hold, audit access, rights, backup propagation, and production rollout | `HR-LEGAL-01`, `HR-RET-01`, `HR-STORE-01`, `HR-SCAN-01`, `HR-SIGN-01`, and `HR-AUDIT-01` are blocked | Legal/DPO/privacy, security, operations, and Product owners | Infinite retention, cleanup authority, production enablement, or readiness |

Restaurant customization is therefore a confirmed high-level future Product
direction under `FORM-02`. It remains excluded from the implemented global-only
first foundation, and its timing and exact model remain unresolved. The older
statement that Formalités data were not active is obsolete: tenant persistent
drafts and the separate global template foundation now persist data. Broad
lifecycle direction and bounded implementation describe different dimensions.
“Qualified” means only the exact governance prerequisites in the normative
specification and is never a general legal-compliance guarantee.

## 7. Data and ownership

| Scope                                  | Runtime owner                | Data owner / persistence boundary                                                                                   |
| -------------------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Employee dossier and current facts     | `apps/backoffice`            | `packages/db-cloud` personnel schema and repositories                                                               |
| Reconstructable Personnel history      | `apps/backoffice`            | `packages/db-cloud`; immutable Personnel event/group evidence scoped by organization, establishment, and employee   |
| Signed personnel document metadata     | `apps/backoffice`            | `packages/db-cloud`; development PDF bytes remain outside PostgreSQL in private local storage                       |
| Registre du personnel                  | `apps/backoffice`            | `packages/db-cloud`; transient PDF output is not the data source                                                    |
| Formalités generic prototype           | `apps/backoffice`            | `N/A`; fictional illustrative state exists only in React memory                                                     |
| Formalités persistent draft foundation | `apps/backoffice`            | `packages/db-cloud`; Formalités-owned draft/receipt state with full organization, establishment, and employee scope |
| GLOBAL YUTA legal-template foundation  | No application runtime       | `packages/db-cloud`; global identities, active working drafts, and immutable frozen versions; no tenant owner       |
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
| Pointage | The foundation and bounded employee raw-clocking slice resolve trusted scoped dossier/employment period and minimal display name; they do not write Personnel or integrate Today. | Personnel owns employee dossier/lifecycle; Pointage owns its credentials/authority and immutable raw actual-work evidence. Planning, corrections and downstream integrations require separate approval. |
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
- Planning and Tâches du jour are not implemented Personnel capabilities merely
  because routes or navigation entries exist. Pointage now has a bounded usable
  employee raw-clocking slice, but it remains a separate capability: it does not
  add a Personnel workflow, correction, history/total view, Today/Planning/
  payroll integration, real-attendance authorization or production readiness.

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
| What authorizes tenant Formalités reads and mutations?            | [Formalités authorization specification](../../../openspec/specs/authorization/formalites/spec.md), then current Backoffice guards and denial tests.                                                                                                                                                                     |
| What global template persistence is normative and implemented?    | [Legal-template foundation specification](../../../openspec/specs/formalites/legal-template-foundation/spec.md), [schema](../../../packages/db-cloud/src/schema/formalites-legal-templates.ts), repository, and focused tests.                                                                                            |
| What does future template qualification require?                  | [Template legal-review governance specification](../../../openspec/specs/formalites/template-legal-review-governance/spec.md). It defines prerequisites, not current legal approval or runtime.                                                                                                                           |
| What globally authorizes template repository operations?          | [Platform Admin Formalités authorization specification](../../../openspec/specs/authorization/platform-admin-formalites-template-administration/spec.md) and [Identity / Access Product Knowledge](../identity-access/README.md).                                                                                         |
| Which legal, privacy, provider, and production gates are open?    | [`PRODUCTION_READINESS.md`](../../operations/PRODUCTION_READINESS.md), especially `HR-LEGAL-01`, `HR-TEMPLATE-01`, `HR-FORMALITY-01`, `HR-RET-01`, `HR-STORE-01`, `HR-SCAN-01`, `HR-SIGN-01`, and `HR-AUDIT-01`.                                               |
| Is Personnel production-ready?                                   | [`PRODUCTION_READINESS.md`](../../operations/PRODUCTION_READINESS.md), including `PERSONNEL` and `AI_PERSONNEL` gates.                                                                                                                                                                                                    |
| What is implemented in the repository?                           | [Backoffice Personnel routes](<../../../apps/backoffice/src/app/(authenticated)/equipe/salaries>), [Register route](<../../../apps/backoffice/src/app/(authenticated)/equipe/registre-personnel>), [Formalités route](<../../../apps/backoffice/src/app/(authenticated)/equipe/formalites-personnel>), and current tests. |
| What is the executable persisted shape?                          | [`packages/db-cloud` personnel schema](../../../packages/db-cloud/src/schema/personnel.ts), [Formalités schema](../../../packages/db-cloud/src/schema/formalites.ts), and the current Personnel, Documents, Register, and Formalités repositories.                                                                        |

## 11. Agent interpretation rules

1. Do not treat a page pack as Product Intent authority for the whole Personnel
   module; use it for its specific UI delivery scope and evidence.
2. Do not treat code existence, local QA, or a production build as proof of
   production readiness or current deployment.
3. Keep the generic in-memory Formalités prototype, bounded persistent draft
   foundation, global legal-template persistence foundation, generated unsigned
   version, signature, signed Documents artifact, submission, and archived
   evidence distinct.
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
8. Do not treat a frozen template version, checksum, applicability declaration,
   system authorization grant, or submitted review as proof of qualification or
   legal compliance. Use the exact governance prerequisites and require current
   external legal evidence.
9. Do not infer MANAGER, STAFF, restaurant membership, `YUTA_SUPPORT`, wildcard,
   or system-role authority beyond the exact current operation catalog and
   trusted-context checks.
10. Do not restore legacy workflow details, deadlines, eligibility rules,
    required documents, integrations, or closed candidate change identities as
    current requirements. Use the reconciled authority map and preserve its open
    decisions.

## 12. OpenSpec position

The approved [Personnel reconstructable-value-history specification](../../../openspec/specs/personnel/reconstructable-value-history/spec.md)
is normative for precise observable F07 behavior inside the accepted Personnel,
tenancy, privacy, and runtime boundaries. This file remains the broader Product
Knowledge context and does not claim production enablement.

The completed planning evidence is archived at
`openspec/changes/archive/2026-09-03-personnel-reconstructable-value-history`.
Sync and archive do not authorize production migration, cutover, cleanup,
anonymization, deployment, or Production Readiness.

## 13. Formalités knowledge migration and authority cutover

### Exact migrated scope

The migration covers only the reconciled Formalités knowledge recorded in this
shared Personnel/Formalités home: the confirmed employee-administration
lifecycle direction; the assistant, checklist, and action purpose; Action,
Document, and Preuve distinctions; non-overwriting contract/document history;
Personnel, Formalités, and Documents ownership; the bounded persistent CDI
preparation draft and its reconciliation behavior; tenant Formalités
authorization; the global legal-template foundation, its exact five-operation
catalog, and qualification prerequisites; the future restaurant-customization
direction and its current exclusion; draft, generated, signed, submitted, and
archived evidence distinctions; independent Product, implementation, legal,
environment, readiness, and production dimensions; the eight `FORM-01` through
`FORM-08` decision packets; and the explicit non-inferences above.

This scope does not migrate or retire authority for Personnel capabilities
outside Formalités, Documents generally, Planning, Pointage, Avis &
commentaires, Conformité, Establishment, Today, Marketing, or any other module
or Page Chat. This shared home remains the canonical entry point; no parallel
Formalités home is created.

### Fresh-agent acceptance evidence

The repository-only `FORMALITES_FRESH_AGENT_ACCEPTANCE_REPORT.md` has SHA-256
`b3f78506fc01313f09e2d062a7610f498dfa4f798c36b55626449bbae1340965`.
The fresh agent used no Page Chat history, legacy extract, reconciliation
report, correction report, or external legal research. It reported:

```text
REPOSITORY_MUTATED: NO
PAGE_CHAT_HISTORY_USED: NO
LEGACY_EXTRACT_USED: NO
RECONCILIATION_REPORT_USED: NO
CORRECTION_REPORT_USED: NO
EXTERNAL_LEGAL_RESEARCH_USED: NO
MATERIAL_KNOWLEDGE_GAPS: 0
GENUINE_CONFLICTS_IDENTIFIED: 0
FRESH_AGENT_ACCEPTANCE: PASS
READY_FOR_AUTHORITY_CUTOVER: YES
```

The report establishes repository discoverability for the exact migrated scope
only. It is acceptance evidence rather than Product or legal authority, is not
legal advice or compliance evidence, and does not authorize production or
resolve `FORM-01` through `FORM-08`.

### Authority state after cutover

Repository reconciliation, bounded canonicalization, fresh-agent acceptance,
and the Human-authorized cutover are complete for the exact Formalités scope
above. Under the
[Authority Model](../../AUTHORITY_MODEL.md#scope-bound-legacy-page-chat-transition):

- the repository is canonical knowledge for this migrated Formalités scope;
- the Formalités Page Chat is `LEGACY EVIDENCE ONLY` for this exact scope and
  remains available for historical or forensic lookup;
- Codex owns repository discovery, shaping, cross-module reasoning and
  governance coordination under
  [task collaboration](../../YUTA_AUTOMATED_CHANGE_WORKFLOW.md#task-collaboration-and-delegated-review).
  CT advice is optional in `CT_BRIDGE` or `HUMAN_CT_BRIDGE`; unresolved
  Product/authority decisions still require the owning Human.
- Coding Agents execute and verify only the selected task's authorized scope;
  routine gates use the mode-defined review mechanism.

This cutover does not delete or invalidate historical evidence, change another
Page Chat's authority, migrate unrelated Personnel scope, close an unresolved
item, create a current legal-compliance claim, authorize implementation or
production, or change the current `BLOCKED`, `NOT_AUTHORIZED`, and `NOT_READY`
states.

## 14. Status

Status: APPROVED

Formalités repository reconciliation, bounded canonicalization, fresh-agent
acceptance, and authority cutover: `COMPLETE` on 2026-09-28. Formalités Page
Chat role for the exact migrated scope: `LEGACY EVIDENCE ONLY`.

## 15. Salariés / Personnel dossier knowledge reconciliation

### Migration scope and authority state

This section is the canonical repository entry point for the reconciled
Salariés / Personnel dossier knowledge extracted from the legacy Page Chat. It
covers the Personnel purpose, the F01–F12 capability map, employee dossier data
families, F03 dossier behavior, F07 reconstructable history, authorization and
tenancy, current-fact/document boundaries, Register, the bounded links to
Formalités and Pointage, readiness, and the remaining grouped decisions.

The legacy extract was evidence only. Its SHA-256 was
`143c386af9a287c159703ae80fa675a29c67f5ca1420df99fc9a53fdf6e95ca2`.
The reconciliation did not copy the extract, accept its classifications without
repository evidence, or create Product, legal, privacy, security, or production
authority. Repository reconciliation and bounded canonicalization are complete.

The canonical owner remains this shared Personnel home. No parallel Salariés
home is created. The completed Formalités and Pointage migrations are unchanged,
and Planning knowledge is outside this migration.

### Fresh-agent acceptance evidence and authority cutover

The repository-only
`SALARIES_PERSONNEL_DOSSIER_FRESH_AGENT_ACCEPTANCE_REPORT_PASS.md` has SHA-256
`efa58a3beffc05d22fa62278998b2ea9ccc4f1639a6fdd140c2fcb10bcebebc3`.
The fresh agent used no Page Chat history, legacy extract, reconciliation
report, correction report, remediation report, or external research. It
reported:

```text
REPOSITORY_MUTATED: NO
PAGE_CHAT_HISTORY_USED: NO
LEGACY_EXTRACT_USED: NO
RECONCILIATION_REPORT_USED: NO
CORRECTION_REPORT_USED: NO
REMEDIATION_REPORT_USED: NO
EXTERNAL_RESEARCH_USED: NO
MATERIAL_KNOWLEDGE_GAPS: 0
GENUINE_CONFLICTS_IDENTIFIED: 0
POINTAGE_SCOPE_REOPENED: NO
FORMALITES_SCOPE_REOPENED: NO
PLANNING_SCOPE_MIGRATED: NO
FRESH_AGENT_ACCEPTANCE: PASS
READY_FOR_AUTHORITY_CUTOVER: YES
```

The report establishes repository discoverability for the exact reconciled
scope only. It is acceptance evidence rather than Product, implementation,
legal, privacy, security, environment, readiness, or production authority and
does not resolve `SAL-01` through `SAL-11`.

Repository reconciliation, bounded canonicalization, fresh-agent acceptance,
and the Human-authorized cutover are complete for the exact Salariés /
Personnel dossier scope above. Under the
[Authority Model](../../AUTHORITY_MODEL.md#scope-bound-legacy-page-chat-transition):

- the repository is canonical knowledge for this migrated scope;
- the Salariés Page Chat is `LEGACY EVIDENCE ONLY` for this exact scope and
  remains available for historical or forensic lookup;
- Codex owns repository discovery, shaping, cross-module reasoning and
  governance coordination under
  [task collaboration](../../YUTA_AUTOMATED_CHANGE_WORKFLOW.md#task-collaboration-and-delegated-review).
  CT advice is optional in `CT_BRIDGE` or `HUMAN_CT_BRIDGE`; unresolved
  Product/authority decisions still require the owning Human.
- Coding Agents execute and verify only the selected task's authorized scope;
  routine gates use the mode-defined review mechanism.

This cutover does not retire authority for Personnel scope outside this
reconciliation, migrate the full Register or Documents capabilities, migrate
Planning, reopen the completed Formalités or Pointage migrations, change
another Page Chat's authority, close a SAL decision, authorize Product work or
production, or create a current legal, privacy, or security conclusion.

### Canonical Personnel dossier model

Personnel owns the establishment-scoped employee dossier and its approved
current employment facts. A dossier is distinct from a cloud user, membership,
application role, Pointage credential, and POS staff identity. Current repository
authority does not require an employee to have a cloud user and defines no
persisted employee-to-user relation. It also does not establish a global person
record, cross-establishment dossier identity, transfer, or merge model.

The current bounded dossier supports list/search/sort, read, create, minimum
edit, non-destructive departure/correction/reopening, completeness and action
overview, access evidence, and reconstructable history. The current structured
facts are given names, family name, position, qualification, employment term,
expected end date, controlled fixed-term reason, work-time category,
contractual weekly minutes, entry date, departure date, and revision/system
metadata. Birth, contact, address, national identifiers, salary, probation,
monthly-hours semantics, payroll facts, and trainee-specific facts are not part
of the current approved executable dossier model.

At Product-map level, salary/remuneration, probation, monthly hours, and
`stagiaire` are confirmed high-level Personnel inclusions. They are intended to
support bounded employment or contract workflows when those workflows are
separately approved. This inclusion does not approve their exact current V1,
domain fields, units, optionality, validation, permissions, history, legal use,
downstream projection, or implementation. Contractual weekly minutes remain the
only implemented duration authority; no monthly derivation is approved.

Current Personnel reads and mutations are server-authorized, fail closed, and
scoped by trusted `organizationId`, `establishmentId`, and employee identifier.
The implemented operation catalog grants Personnel employee, document,
extraction, and Register operations to `OWNER` only. No `MANAGER`, `STAFF`,
self-service, support, or service-role Personnel authority may be inferred.

Departure is a dated, non-destructive Personnel fact. The repository derives
upcoming, active, and former views from current facts; it does not define a
general employment state machine for suspension, archive, deletion, restore,
rehire, transfer, or anonymization.

### F01–F12 capability matrix

| ID  | Capability                                  | Current Product / ownership position                                                                                                                                                               | Implementation and environment                                                                                                                                                                               | Legal, privacy, readiness, and limits                                                                                                                                |
| --- | ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| F01 | Consult / search employees                  | Approved bounded Personnel capability; Personnel owns the dossier.                                                                                                                                 | Implemented repository slice for scoped list, search, filter, sort, and lifecycle views; live environment unverified.                                                                                        | OWNER-only; production remains blocked.                                                                                                                              |
| F02 | Add an employee                             | Approved bounded Personnel capability.                                                                                                                                                             | Implemented create flow with validation, duplicate review, idempotency, audit, and scoped persistence.                                                                                                       | Required fields are only the current contract/schema fields; no document-family expansion follows.                                                                   |
| F03 | Manage the employee dossier                 | Approved bounded Personnel capability and current-fact source.                                                                                                                                     | Implemented read/edit, revision conflict, idempotency, audit, non-destructive departure, reopening, completeness, and access evidence.                                                                       | No employee self-service or broader role policy; production gates remain open.                                                                                       |
| F04 | Contract and current employment facts       | Personnel owns the current structured facts. Salary/remuneration, probation, and monthly hours are confirmed high-level Personnel inclusions; Formalités and Documents own their separate outputs. | Employment term, end date, fixed-term reason, work-time category, weekly minutes, role facts, entry, and departure are implemented. Salary, probation, and monthly hours are not implemented dossier fields. | Their exact V1, domain model, permissions, history, legal/privacy treatment, payroll boundary, and signed-document reconciliation remain unresolved.                 |
| F05 | Documents                                   | Documents owns signed employment artifacts; Personnel supplies current facts and employee context.                                                                                                 | Development-only signed base-contract and signed-amendment storage/scan are implemented with production fail-closed.                                                                                         | Other document families, sensitive visibility, retention, rights, and production storage are unresolved; no broad upload catalog is approved.                        |
| F06 | Incomplete dossiers / actions               | Personnel owns bounded completeness and action derivation.                                                                                                                                         | Implemented development slice for incomplete dossier, missing signed base contract, and departure within five days.                                                                                          | This is not a legal-compliance alert catalog; broader rules and notifications remain unresolved.                                                                     |
| F07 | Modify a value with reconstructable history | Approved Personnel capability; the normative F07 specification controls exact behavior.                                                                                                            | Implemented and tested for the six bounded value groups below; live/production use remains blocked.                                                                                                          | It is not general event sourcing. The retention value is a Product baseline awaiting external review.                                                                |
| F08 | Formalités integration                      | Personnel owns seven source facts; Formalités owns draft/workflow state and cannot write the source facts back.                                                                                    | Separately implemented, OWNER-only, development-only CDI draft projection and reconciliation.                                                                                                                | Formalités migration remains complete; this mission does not reopen or extend it.                                                                                    |
| F09 | Departure                                   | Personnel owns the departure fact.                                                                                                                                                                 | Implemented dated departure, correction/cancellation with reason, former view, and reopening behavior.                                                                                                       | Departure is not deletion and creates no legal-termination conclusion; archive/rehire/deletion semantics remain unresolved.                                          |
| F10 | Personnel Register / PDF                    | Register is the separate current owner of register records, append-only corrections, sequence, audit, and transient PDF; Personnel supplies candidates.                                            | Implemented OWNER-only, development-only, one-establishment route with production fail-closed.                                                                                                               | Exact legally reviewed field dictionary, intern/service-civic coverage, retention/legal hold, and production authorization remain open. No compliance claim is made. |
| F11 | Trainee                                     | `Stagiaire` inclusion in the Human-approved F01–F12 map is confirmed; its exact current V1 and domain model remain unresolved.                                                                     | Not implemented as a trainee-specific dossier, document, lifecycle, or permission model.                                                                                                                     | The unresolved decision concerns the exact model, scope, documents, permissions, and legal rules. Employee contract semantics cannot be reused automatically.        |
| F12 | Planning / Pointage / Formalités links      | Each module retains ownership of its facts and authorization.                                                                                                                                      | Formalités consumes its exact projection; Pointage consumes a minimal employee eligibility/display projection and owns clocking; Planning remains a placeholder.                                             | No generic cross-module write-back or inherited permission exists. Planning Product Truth is not migrated here.                                                      |

### Personnel data-family matrix

| Data family                             | Owner and source                                                                                                                                         | Current / historical / documentary                                                 | Current repository status                                         | Consumers and write-back                                                                                | Open boundary                                                                                              |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Employee identity                       | Personnel direct entry                                                                                                                                   | Current; `givenNames` and `familyName` are in F07 identity history                 | Implemented                                                       | Bounded Formalités and Pointage projections; no consumer write-back                                     | Contact, birth, national identity, user linkage, and global-person model                                   |
| Role                                    | Personnel                                                                                                                                                | Current plus F07 history for `position` and `qualification`                        | Implemented                                                       | Bounded Formalités projection; no write-back                                                            | Canonical job-classification catalog                                                                       |
| Contract terms                          | Personnel current-fact source                                                                                                                            | Current plus F07 history for term, expected end, and fixed-term reason             | Implemented bounded fields                                        | Formalités reads an allowlist; Documents remains artifact owner                                         | Salary, probation, payroll boundary, and documentary reconciliation                                        |
| Contractual work time                   | Personnel                                                                                                                                                | Current plus F07 history for category and weekly minutes                           | Implemented bounded fields                                        | Only separately approved consumers                                                                      | Monthly-hours meaning and other work-time projections                                                      |
| Entry                                   | Personnel                                                                                                                                                | Current plus correction-only F07 history                                           | Implemented                                                       | Bounded Formalités projection                                                                           | Relationship to legally reviewed hiring evidence                                                           |
| Departure                               | Personnel                                                                                                                                                | Current plus F07 correction/cancellation history                                   | Implemented                                                       | Separately authorized lifecycle consumers                                                               | Archive, deletion, rehire, anonymization, and legal-termination semantics                                  |
| Completeness and action overview        | Personnel derivation over current facts and Documents presence                                                                                           | Current derived view                                                               | Implemented development slice                                     | Personnel UI only under current authority                                                               | Broader rule catalog and notifications                                                                     |
| Signed employment artifacts             | Documents                                                                                                                                                | Documentary base contract and amendments                                           | Implemented development-only storage/scan; production fail-closed | Personnel links context; Formalités may hand off a future signed result only through separate authority | Other families, access segmentation, retention, rights, storage, and signature workflow                    |
| Personnel value history                 | Personnel atomic mutations and cutover baseline                                                                                                          | Historical structured evidence                                                     | Implemented for six bounded groups                                | Personnel Historique only under current approval                                                        | Cleanup, legal hold, production migration, and external validation                                         |
| Register                                | Register from explicit inscription/correction, with Personnel as candidate source                                                                        | Separate current record, append-only correction history, audit, transient PDF      | Implemented development-only                                      | No silent dossier backfill and no Personnel-history inference                                           | Legally reviewed dictionary, non-employee persons, retention, legal hold, production                       |
| Formalités draft snapshot               | Formalités from seven allowlisted Personnel facts                                                                                                        | Separate durable draft and acknowledged source snapshot                            | Implemented development-only                                      | No Formalités-to-Personnel write-back                                                                   | Post-draft lifecycle remains governed in Formalités scope                                                  |
| Pointage eligibility/display projection | Personnel supplies minimal dossier/employment identity; Pointage owns clocking authority and evidence                                                    | Current read projection; clocking is not Personnel history                         | Implemented in the separate Pointage scope                        | No Pointage-to-Personnel write-back                                                                     | No broader Personnel projection is authorized here                                                         |
| High-level-only Personnel inclusions    | Personnel Product direction includes salary/remuneration, probation, monthly hours, and `stagiaire`; exact executable ownership/model remains unresolved | No approved current or historical representation beyond implemented weekly minutes | Not implemented as canonical dossier fields                       | No payroll, Formalités, trainee, or other downstream projection/write-back approved                     | Exact fields, units, optionality, validation, permissions, history, legal/privacy treatment, and lifecycle |

### F07 Personnel history model

The normative source is the
[Personnel reconstructable-value-history specification](../../../openspec/specs/personnel/reconstructable-value-history/spec.md).
It covers exactly six groups:

1. identity: given names and family name;
2. role: position and qualification;
3. contract terms: term, expected end, and fixed-term reason;
4. contractual work time: category and weekly minutes;
5. entry date; and
6. departure date.

`CORRECTION` replaces an erroneous current value and records prior/new evidence.
`CHANGE` records a business-effective change for role, contract terms, or
contractual work time; its effective date must be within the employment period
and cannot be future-dated. Identity supports both `CORRECTION` and `CHANGE`
without a separate business-effective date. Entry is correction-only. Departure
correction/cancellation is handled by its exact normative rules. Reasons are
required for entry correction, contract correction, contractual-work-time
correction, and departure correction/cancellation; they are optional for
identity and role correction and are not required for `CHANGE`.

The current-value mutation, history append, revision check, and idempotency
result are atomic. Existing dossiers at cutover receive exactly one eager
baseline; dossiers created afterward do not receive a fabricated baseline, and
the system does not invent pre-cutover history. Historique is OWNER-only and
returns the newest 50 entries, with no approved search, filter, pagination, or
export.

The retention baseline is employment plus five years after departure for this
bounded F07 history. That value is approved Product behavior, not a statement of
current French law or privacy compliance. Cleanup, anonymization, legal hold,
backup propagation, production migration, and operational execution remain
unimplemented and require current external legal/privacy review plus separate
Product, security, and operations authority.

### Current fact, history, document, and downstream boundaries

| Kind                             | Meaning                                                                                      | Source of truth   | What must not be inferred                                                                 |
| -------------------------------- | -------------------------------------------------------------------------------------------- | ----------------- | ----------------------------------------------------------------------------------------- |
| Current Personnel fact           | The current structured employee/employment value used by the dossier                         | Personnel dossier | A signed artifact, legal conclusion, cloud identity, or clocking record                   |
| Personnel history evidence       | The bounded prior/new F07 record created with an atomic current-fact mutation                | Personnel history | General event sourcing, document history, Register history, or pre-cutover reconstruction |
| Signed artifact                  | Protected signed base contract or amendment                                                  | Documents         | That its text automatically overwrites Personnel facts or proves current legal compliance |
| Formalités draft/source snapshot | Formalités-owned preparation and divergence evidence over seven source facts                 | Formalités        | Ownership of current Personnel facts or write-back permission                             |
| Register record/history/PDF      | Explicit Register inscription, append-only correction evidence, and transient representation | Register          | A copy of the dossier, Personnel F07 history, or legal-compliance proof                   |
| Pointage event                   | Raw work/attendance evidence and credential/session state                                    | Pointage          | Personnel identity/account authority or Personnel history                                 |

### Product, implementation, schema, law/privacy, and readiness

These dimensions remain independent:

- Product authority approves the bounded dossier, current-fact ownership, F07,
  and the explicit cross-module boundaries above. Open decisions remain open.
- Code, schema, migrations, and tests evidence the implemented repository slice;
  composite keys and foreign keys do not decide the future global-person model.
- Page-pack and local QA evidence describes development behavior and does not
  prove live deployment or production operation.
- No repository evidence in this reconciliation is current legal advice,
  legal-compliance evidence, privacy compliance, or security certification.
- `PRODUCTION_READINESS.md` keeps `PERSONNEL` and `AI_PERSONNEL` not ready and
  the Personnel legal, template, formality, retention, storage, scanning,
  signature, audit, and Register gates blocked.
- AI-assisted document analysis is a confirmed high-level Product direction for
  a separately approved bounded workflow. Suggestions remain untrusted: a Human
  must review, correct, and confirm them before the normal server mutation can
  make a fact canonical. Silent canonical write is not allowed.
- Current extraction evidence is local/synthetic or guarded fictional-document
  development evidence. Real-personnel-file use with an external AI provider is
  not authorized until the required legal, privacy, security, provider, and
  operations gates are approved. No exact provider, model, prompt, storage,
  document inventory, taxonomy, confidence model, or production architecture is
  approved by this high-level direction.

### Grouped decisions still required

Each packet is one coherent authority decision; raw legacy questions are not
counted separately.

| ID     | Exact decision                                                                                                                                                                              | Current evidence and why unresolved                                                                                                                   | Required authority and non-inference                                                                                                                                      |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SAL-01 | Decide global person, employee-to-user, multi-establishment, transfer, merge, and account-lifecycle semantics.                                                                              | Current dossiers are establishment-owned and have no persisted user relation; schema shape does not decide the Product model.                         | Human Product plus identity/tenancy/security review. Do not equate employee, user, membership, role, email, or Pointage credential.                                       |
| SAL-02 | Decide any expansion of canonical dossier fields and validation beyond the current executable set.                                                                                          | Birth, contact, address, national identifiers, status/category, and similar fields appear only in legacy/proposed material.                           | Human Product plus legal/privacy/security review. Do not add or expose fields from mockups or legacy lists.                                                               |
| SAL-03 | Decide lifecycle behavior beyond entry, current views, dated departure, correction/cancellation, and reopening.                                                                             | No current authority defines suspension, archive, delete, restore, transfer, rehire, or anonymization as a state machine.                             | Human Product, legal/privacy, data, and operations authority. Do not invent transitions.                                                                                  |
| SAL-04 | Decide broader roles, self-service, service actors, and field-level visibility.                                                                                                             | Current exact permissions are OWNER-only.                                                                                                             | Human Product and security/authorization review. Do not infer MANAGER, STAFF, employee-self, support, or service access.                                                  |
| SAL-05 | Decide the exact salary/remuneration, probation, and monthly-hours V1: fields, units, optionality, validation, executable ownership, permissions, history, and payroll/downstream boundary. | Their high-level Personnel inclusion is confirmed, while current schema implements weekly-time facts only and no exact model.                         | Human Product plus legal/privacy/security and payroll-boundary review. Do not infer calculations, monthly derivation, visibility, history, or synchronization.            |
| SAL-06 | Decide broader document families, per-family ownership/access, retention/rights, production storage, signature, and reconciliation with current facts.                                      | Only signed base contracts and amendments have current development implementation; F07 does not govern document history.                              | Human Product plus legal/privacy/security/operations review. Do not infer RIB, identity, residence, health, or other upload support.                                      |
| SAL-07 | Decide the production Register dictionary, covered person types, legal presentation, retention/legal hold, permissions, and operations.                                                     | Register ownership and development implementation are resolved; legal/production suitability is not.                                                  | Human Product plus current external legal/privacy/security/operations review. Do not claim legal compliance.                                                              |
| SAL-08 | Decide the exact trainee V1, relationship/domain model, fields, convention/documents, lifecycle, organization/establishment semantics, Register relation, and permissions.                  | `Stagiaire` inclusion in F11 is confirmed; no trainee-specific executable model or implementation exists.                                             | Human Product plus legal/privacy/security review. Do not reopen inclusion or reuse employee/CDI/CDD semantics automatically.                                              |
| SAL-09 | Decide any real-data AI/OCR provider, model, prompt, document inventory/taxonomy, error/recovery behavior, storage/data handling, retention, and production controls.                       | Human-reviewed AI assistance is confirmed; current evidence is local/synthetic or fictional-document development use, while real-file use is blocked. | Human Product plus legal/privacy/security/provider/operations approval. Human review, correction, and confirmation remain mandatory; silent canonical write is forbidden. |
| SAL-10 | Decide additional projections and write-back rules for Planning, payroll, absences, advances, benefits, Today, notifications, imports, and exports.                                         | Formalités and Pointage have only their own bounded current relationships; Planning remains undecided.                                                | Human Product, owning-module, tenancy, privacy, and authorization decisions. Do not migrate another module's Product Truth here.                                          |
| SAL-11 | Decide cross-family retention, deletion/anonymization, data-subject rights, legal holds, audit access, backup propagation, and operational evidence.                                        | F07 has only its bounded Product baseline; other families and executable cleanup have no final policy.                                                | Current external legal/privacy review plus Human Product, security, and operations approval. Do not generalize the F07 five-year value.                                   |

### Reconciliation accounting and historical safeguards

The counting unit is one grouped material assertion, assigned exactly one
primary disposition even when other lifecycle dimensions are also recorded.
The 48 groups reconcile as follows: `CONFIRMED: 13`, `IMPLEMENTED: 12`,
`DECIDED_NOT_IMPLEMENTED: 0`, `PROPOSED: 6`, `UNRESOLVED: 11`, `CONFLICT: 0`,
and `OBSOLETE: 6`.

The correction splits the former aggregate compensation-direction unit into
three high-level Product inclusions: salary/remuneration, probation, and monthly
hours. This adds two counting units. Those three inclusions, F11 `stagiaire`,
and Human-confirmed AI document assistance are `CONFIRMED`; their exact models
remain inside the same 11 unresolved decision packets. No implementation,
legal/privacy, readiness, or downstream-integration disposition changes.

The obsolete groups include the old claims that F07 lacked a normative source
or remained future-only, that Documents supported only a base contract, that
Register ownership/implementation was unknown, and stale pre-delivery route or
page-pack observations. They remain historical evidence and must not override
the current repository. Proposed material includes broader role, person,
document, Planning, notification, and import/export ideas that lack sufficient
current Human authority. Exact salary/probation/monthly-hours, trainee, and AI
models are unresolved rather than evidence against their confirmed high-level
Product inclusion.

The obsolete Register-direction group also records that Excel/XLSX was an
earlier output direction. The Human-superseding direction is structured Register
persistence plus a transient PDF, one employee per PDF page, employee-entry
order, and history-preserving corrections instead of overwrite. Excel/XLSX is
not current Product behavior, and this provenance does not authorize an Excel
export. Register remains the current owner; current behavior is governed by the
Register Product Knowledge, page pack, implementation, and tests. Provenance:
`SALARIES_PERSONNEL_DOSSIER_LEGACY_KNOWLEDGE_EXTRACT.md`, SHA-256
`143c386af9a287c159703ae80fa675a29c67f5ca1420df99fc9a53fdf6e95ca2`.

The apparent legacy tensions are not current conflicts: current repository
authority separates account identity from Personnel, establishes a separate
Register owner, keeps document support bounded, and treats establishment-scoped
implementation as evidence rather than a decision about a global-person model.
No genuine unresolved authority conflict remains in this migrated scope.

### Discovery and fresh-agent acceptance

A repository-only agent should follow:

1. [`docs/README.md`](../../README.md);
2. [`docs/PRODUCT_KNOWLEDGE.md`](../../PRODUCT_KNOWLEDGE.md);
3. [`docs/MODULE_REGISTRY.md`](../../MODULE_REGISTRY.md);
4. this Personnel Product Knowledge home and this reconciliation section;
5. the [Salariés page pack](../../ui/pages/backoffice-equipe-salaries/README.md),
   [Register page pack](../../ui/pages/backoffice-equipe-registre-personnel/README.md),
   F07 normative specification, and the unchanged Formalités/Pointage homes;
6. the current Personnel contracts, schema, repositories, server authorization,
   routes, focused tests, and F07 reviews; and
7. [`PRODUCTION_READINESS.md`](../../operations/PRODUCTION_READINESS.md).

Without Page Chat history, the legacy extract, or the reconciliation,
correction, and remediation reports, the fresh agent recovered the exact
migrated scope, F01–F12 boundaries, current fields, identity/account separation,
ownership and tenant scope, current OWNER-only authorization, F03 and F07
behavior, fact/history/document distinctions,
Register/Formalités/Pointage/Planning boundaries, readiness, all 11 decision
packets, zero genuine conflicts, and the prohibition on legal/privacy or
production inference. The accepted report records that result; the authority
cutover above changes only the knowledge-routing role for this exact scope.
