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
- Control Tower owns shaping, genuine conflict resolution, Human Decision
  routing, cross-module reasoning, and governance coordination; and
- Coding Agents use repository discovery for analysis and perform only
  separately authorized execution and verification.

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
