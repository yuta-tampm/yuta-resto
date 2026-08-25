# Préparer un projet de contrat CDI — Data and Interaction Specification

Status: Phase 5 field-decision scope proposed; Phase 4 local state implemented

Visibility: Engineering

## Runtime and trust boundary

The server requires an authenticated tenant, active establishment, and existing
`personnel.employee.read` permission. Browser scope is never trusted. The page
then renders only a compile-time fictional fixture.

## Data ownership and transport

There is no runtime transport or persistence. A route-local typed object owns
all Phase 1 display values. It contains no employee, organization,
establishment, document, or request identifier.

## Current domain mapping

| Prototype group         | UI presentation               | Runtime source                    | Gap                                          |
| ----------------------- | ----------------------------- | --------------------------------- | -------------------------------------------- |
| reusable employee facts | six read-only labelled values | fictional fixture                 | future authorized Salariés mapping           |
| contract-specific facts | three missing values          | fictional fixture                 | future Formalités input model and validation |
| readiness               | blocked summary               | derived from fixed missing values | future approved lifecycle                    |

The model is a presentation fixture, not a contract or database schema.

## Current interactions

The page is read-only. The generation button is disabled. There is no selection,
edit, submit, retry, preview, download, or dossier handoff.

## Mutations / actions / transactions

None.

## Validation

No input exists. Tests assert the bounded fixture, explicit fictional-data
notice, absence of an employee identifier, and disabled generation control.

## Operational and UI states

Authenticated OWNER: fictional readiness screen. Unauthorized: existing
server authorization fails closed before rendering the page. No loading,
database, provider, success, or recovery state exists because no service runs.

## Polling / offline / device behavior

Not applicable.

## Decisions that must not be guessed

Real field mapping, form fields/enums, validation rules, conflict handling,
approved template contents/applicability, provider selection, exact audit
taxonomy, retention periods, rights/legal-hold behavior, and production owners.

## Approved F5-07 logical lifecycle

| State/result         | Meaning                                                       | OWNER behavior                                                 |
| -------------------- | ------------------------------------------------------------- | -------------------------------------------------------------- |
| `DRAFT`              | saved work in progress; no PDF                                | return, edit, explicitly save, generate when ready, or abandon |
| `GENERATED`          | immutable draft-document version                              | review or start a new draft; never edit in place               |
| `SUPERSEDED`         | older generated version replaced by a newer generated version | read-only history                                              |
| `ABANDONED`          | unfinished work stopped with a required reason                | read-only history; no hard delete                              |
| `INCOMPLETE`         | derived result: required facts are missing                    | complete the draft                                             |
| `READY`              | derived result: required facts pass validation                | OWNER may confirm generation                                   |
| `ATTENTION_REQUIRED` | derived result: an explicit OWNER decision is still needed    | review flagged facts                                           |

Only one active CDI `DRAFT` may exist for an employee in the active
establishment. Generating a replacement never overwrites the earlier artifact.
The lifecycle is approved as product intent but is not implemented in Phase 1.

## Approved F5-08 boundaries

| Concern              | Approved product boundary                                                                            | Still required before implementation/production                                              |
| -------------------- | ---------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| templates            | use only externally reviewed, versioned French employment templates                                  | qualified reviewer, exact templates, clauses, applicability and effective dates              |
| YUTA responsibility  | populate data, flag missing/inconsistent facts, require OWNER confirmation                           | exact validation rules and reviewed non-legal-advice copy                                    |
| files                | generated PDF outside Neon in approved private EU storage                                            | provider/architecture, encryption, isolation, scanning, backup/restore and deletion evidence |
| signature            | external provider later; signed artifact belongs to Documents                                        | provider, DPA, legal evidence model, recovery and exit plan                                  |
| audit                | actor/action/time/state/version; no sensitive values or document content in logs                     | taxonomy, access, retention and review procedure                                             |
| retention and rights | no invented duration or automatic hard delete                                                        | legal/DPO-approved per-class schedule, legal hold and deletion propagation                   |
| AI                   | assist extraction/completeness only; OWNER confirms; no automatic employee update or issue/sign/send | approved provider/project, EU/retention/DPA evidence, evaluation and operations controls     |

F5-08 is documentation authority for these product boundaries only. It creates
no runtime data owner, transport, persistence, provider, or production approval.

## Proposed persistence/contract changes

No persistence or contract change is authorized yet. A later proposal may store
draft facts and lifecycle metadata in Neon while keeping generated files outside
Neon in a separately approved private EU store. It must define trusted tenant
scope, revision/conflict handling, idempotency, audit events, retention, and
cross-tenant denial tests before implementation.

## Phase 2 offline interaction model

Status: `APPROVED AND IMPLEMENTED OFFLINE`

Phase 2 introduces only a route-local presentation model. The following names
describe UI state and are not transport contracts, database fields, or legal
rules:

```text
activeStep: SOURCE | INPUTS | REVIEW
draftValues: fictional address, fictional remuneration, fictional probation choice
checkpointValues: nullable copy of draftValues held in React memory
reviewAcknowledged: boolean held in React memory
demoReadiness: INCOMPLETE | ATTENTION_REQUIRED | READY
```

The reducer/readiness functions must be pure and deterministic. They receive no
tenant, employee, document, provider, or session identifier. Reloading or leaving
the route destroys all Phase 2 state and returns to the canonical fictional
fixture.

### Implemented local transitions

| Event                   | Allowed local result                                                | Explicitly forbidden implication                        |
| ----------------------- | ------------------------------------------------------------------- | ------------------------------------------------------- |
| edit illustrative field | update `draftValues`; mark difference from checkpoint               | employee update or durable draft save                   |
| continue to review      | allowed only when demo input requirements are met                   | legal validation or template completeness               |
| simulate checkpoint     | copy current values into `checkpointValues`; show local-only notice | server/database/browser-storage persistence             |
| acknowledge review      | set local boolean; keep generation disabled                         | OWNER legal approval or document generation             |
| reset demonstration     | restore canonical fictional fixture after local confirmation        | deletion, abandonment, audit event, or retention action |

### Demo-only readiness

- `INCOMPLETE`: at least one illustrative value is empty.
- `ATTENTION_REQUIRED`: the fictional probation choice remains “à décider” or
  the local review has not been acknowledged.
- `READY`: the three illustrative values are populated and the review is
  acknowledged. UI copy must add “pour cette démonstration uniquement”.

These rules are deliberately insufficient for a real CDI and must never be
reused as legal/domain validation. No persistence, contract, API, audit, file,
provider, or production change is implemented.

## Phase 3 trusted read model

Status: `APPROVED AND IMPLEMENTED — DEVELOPMENT READ-ONLY`

The route `employeeId` is untrusted input. The server must validate it as a UUID,
resolve the authenticated session and active establishment, require the existing
OWNER-only `personnel.employee.read` permission, and call the current
`findPersonnelEmployee` repository. That repository constrains reads by
`employeeId + organizationId + establishmentId`.

The allowed Phase 3 presentation projection is:

```text
employeeId: route/navigation only; never displayed
givenNames + familyName -> employee name
position -> position
qualification -> qualification
employmentTermType -> current contract type
entryDate -> entry date
contractWeeklyMinutes -> weekly duration or an explicit missing value
```

`revision`, timestamps, status/view, completeness reasons, departure data, CDD
reason/end date, documents, audit history, and every identity or contract fact
outside this list are not passed to the Formalités presentation component.

Phase 3 introduces no client mutation state. The only interactions are opening
the integrated read-only route and returning to the same full dossier. Invalid,
missing, and cross-tenant targets return not found; forbidden users receive no
employee projection. Repository/database failure uses the route error boundary.
No local checkpoint, browser storage, server action, write, audit, or transport
contract is added.

## Phase 4 connected local state

Status: `APPROVED AND IMPLEMENTED — DEVELOPMENT LOCAL-ONLY`

Phase 4 keeps the Phase 3 server read and passes its existing allowlisted
presentation projection into the smallest possible client interaction boundary.
Trusted identifiers, tenant scope, authorization, and repository access remain
server-owned.

The client owns only ephemeral presentation state:

```text
activeStep: SOURCE | INPUTS | REVIEW
draftValues:
  employeeAddress: initially empty
  contractualRemuneration: initially empty
  probationChoice: initially undecided
checkpointValues: nullable in-memory copy of draftValues
reviewAcknowledged: boolean
demoReadiness: INCOMPLETE | ATTENTION_REQUIRED | READY
```

Allowed local events are the existing Phase 2 edit, continue/back, checkpoint,
review acknowledgement, and reset transitions. The same demo-only validation
may be reused. No event crosses a server, API, database, URL, cookie,
`localStorage`, or `sessionStorage` boundary.

Reload, navigation, or closing the page discards all Phase 4 input. No custom
leave-page warning is proposed. The return link goes to the same employee's full
dossier, but it does not carry draft state. The connected component receives no
repository object and must not expose additional employee fields.

No action may update Salariés, create a Formalités record, implement `DRAFT`,
write audit evidence, generate or preview a document, or contact a provider.

## Phase 5 decision matrix

Status: `INTERNAL DRAFT COMPLETE — EXTERNAL REVIEW BLOCKED — NO DATA MODEL AUTHORITY`

### Source boundary

This matrix was prepared on 2026-08-23 from current repository evidence and the
following official French sources:

- [Code du travail, article R. 1221-34](https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006072050/LEGISCTA000024199963/): information about the employment relationship;
- [Arrêté du 3 juin 2024, annexe 1](https://www.legifrance.gouv.fr/loda/article_lc/LEGIARTI000049729455): official information-document model;
- [Code du travail, article L. 3123-6](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000033020080/): additional written-contract information for part-time work;
- [Code du travail, article L. 1221-23](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000019071102/): trial periods and renewal must be expressly stipulated; and
- [Ministry of Labour CDI overview](https://travail-emploi.gouv.fr/le-contrat-de-travail-duree-indeterminee-cdi): a full-time CDI may be verbal, while the employer still has written-information duties.

These sources identify information duties and special written-form conditions;
they do not constitute YUTA's approved employment-contract template. Collective
agreements, the employee's situation, and qualified review may add or change
requirements. `HR-TEMPLATE-01`, `HR-FORMALITY-01`, `HR-LEGAL-01`,
`HR-RET-01`, and `HR-AUDIT-01` remain blocked.

### Applicability matrix

The statuses below are product proposals, not legal eligibility decisions.

| Employee situation                                                  | Repository signal                                                                            | Phase 5 proposal            | Reason / remaining evidence                                                                              |
| ------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | --------------------------- | -------------------------------------------------------------------------------------------------------- |
| upcoming full-time CDI                                              | `view=upcoming`, `employmentTermType=indefinite`, `workTimeCategory=full_time`, no departure | `CANDIDATE_FIRST_SLICE`     | smallest route-compatible use case; still blocked on approved template and qualified review              |
| upcoming part-time CDI                                              | upcoming + indefinite + part-time                                                            | `BLOCKED`                   | requires the complete L. 3123-6 schedule/change/notification/complementary-hours dictionary              |
| active CDD converting to CDI                                        | active + fixed-term                                                                          | `BLOCKED`                   | effective date, continuity, seniority, prior trial period, and replacement-document behavior need review |
| active CDI missing a signed base document                           | active + indefinite + missing document                                                       | `BLOCKED`                   | do not reconstruct or backdate a contract without a reviewed remediation workflow                        |
| active CDI with changed terms                                       | active + indefinite                                                                          | `EXCLUDED_FROM_FIRST_SLICE` | belongs to the existing amendment boundary, not a second base CDI draft                                  |
| former employee or effective departure                              | former/departure signal                                                                      | `EXCLUDED_FROM_FIRST_SLICE` | no new base-contract preparation in the proposed first slice                                             |
| apprenticeship, professionalisation, temporary work, or work abroad | not represented by the current dossier model                                                 | `EXCLUDED_AND_UNSUPPORTED`  | requires separate contract type, template, fields, and review                                            |

Current Phase 4 must continue to show no eligibility result. Its fictional active
CDI employee is suitable for interface QA only and is not an example of the
proposed first slice.

### Candidate CDI field dictionary

`SALARIES_READ_ONLY` means the current employee dossier may be a source after a
fresh scoped read. `FORMALITES_INPUT` means a future draft would own a reviewed
snapshot. `REFERENCE_OR_DERIVED` means the value must come from an approved
employer/template/legal configuration, not browser invention.

| Business fact / proposed French label                         | Proposed owner and current evidence                                               | Requirement / format proposal                                                      | Factual validation proposal                                                               | Template/review status                                               |
| ------------------------------------------------------------- | --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| employee identity / `Identité du salarié`                     | `SALARIES_READ_ONLY`; given and family names exist                                | required text for the candidate slice                                              | both names present in the fresh dossier snapshot                                          | repository-ready; template mapping blocked                           |
| employee address / `Adresse du salarié`                       | `FORMALITES_INPUT`; absent from Salariés                                          | only if the reviewed template requires it; structured address, not one free string | required components depend on approved country/address policy                             | `BLOCKED`; the Phase 4 address is illustrative only                  |
| employer legal identity / `Employeur`                         | `REFERENCE_OR_DERIVED`; no approved legal-entity profile                          | required; legal name and registration reference                                    | selected establishment must resolve to one approved employing entity                      | `BLOCKED` by `CORP-01`, `HR-TEMPLATE-01`                             |
| work location(s) and employer address / `Lieu de travail`     | `REFERENCE_OR_DERIVED` plus possible `FORMALITES_INPUT`; not in personnel dossier | required information; one or more structured locations                             | at least one approved location; no browser-supplied tenant scope                          | `BLOCKED`; employer/location authority missing                       |
| position, functions, category / `Emploi et fonctions`         | `SALARIES_READ_ONLY` for position/qualification; functions and category absent    | required information; reviewed controlled mapping may be needed                    | dossier position/qualification present; missing reviewed category mapping is blocking     | partial repository evidence; legal/template mapping blocked          |
| hire/effective date / `Date d'embauche`                       | `SALARIES_READ_ONLY`; `entryDate` exists                                          | required ISO date snapshot                                                         | must match the selected upcoming dossier and approved business date rules                 | repository-ready; semantic/template review blocked                   |
| indefinite term / `Contrat à durée indéterminée`              | `REFERENCE_OR_DERIVED`; current dossier has term type                             | fixed value for the CDI slice                                                      | selected dossier must satisfy the approved applicability rule                             | applicability decision not yet approved                              |
| trial-period decision / `Période d'essai`                     | future `FORMALITES_INPUT`; absent from dossier                                    | conditional explicit yes/no; if yes, reviewed duration/conditions/renewal choice   | no default assumption; written terms required when used                                   | `BLOCKED` by template, collective-agreement, and qualified review    |
| base remuneration / `Rémunération de base`                    | future `FORMALITES_INPUT`; absent                                                 | required reviewed money/currency/period representation                             | positive amount and permitted period only after payroll/legal design                      | `BLOCKED`; Phase 4 free text must not be reused                      |
| premiums and benefits in kind / `Primes et avantages`         | future `FORMALITES_INPUT` or approved employer configuration                      | conditional itemized values                                                        | each item has reviewed type, amount/basis, and applicability                              | `BLOCKED` by payroll/template review                                 |
| payment timing and method / `Versement de la rémunération`    | `REFERENCE_OR_DERIVED`; no current authority                                      | required information or reviewed legal/collective reference                        | approved option/reference must exist                                                      | `BLOCKED`                                                            |
| working duration / `Durée du travail`                         | `SALARIES_READ_ONLY`; category and weekly minutes exist                           | required snapshot; reviewed weekly/monthly/arrangement representation              | minutes must be present and consistent with the approved work-time category               | partial repository evidence; template rule blocked                   |
| part-time distribution / `Répartition du temps de travail`    | future `FORMALITES_INPUT`; absent                                                 | conditional for part-time; structured days/weeks distribution                      | required only for an approved part-time slice                                             | `BLOCKED`; part-time excluded from first slice                       |
| part-time changes, schedule notice, complementary-hour limits | future `REFERENCE_OR_DERIVED` and possibly `FORMALITES_INPUT`; absent             | conditional part-time clauses/information                                          | complete set must be approved together; no isolated free text                             | `BLOCKED`; part-time excluded from first slice                       |
| paid-leave information / `Congés payés`                       | `REFERENCE_OR_DERIVED`; absent                                                    | required information or permitted legal/collective reference                       | approved reference/version must be resolvable                                             | `BLOCKED`                                                            |
| training information / `Formation professionnelle`            | `REFERENCE_OR_DERIVED`; absent                                                    | required information or permitted reference                                        | approved employer policy/reference must exist                                             | `BLOCKED`                                                            |
| termination procedure and notice / `Rupture et préavis`       | `REFERENCE_OR_DERIVED`; absent                                                    | required information or permitted legal/collective references                      | references must be versioned and applicable to the employee category                      | `BLOCKED`                                                            |
| collective agreements / `Conventions et accords collectifs`   | `REFERENCE_OR_DERIVED`; absent from trusted tenant configuration                  | required list for the information duty                                             | at least one reviewed applicability result, including explicit none only if legally valid | `BLOCKED` by `HR-TEMPLATE-01` and employer configuration             |
| social-protection regimes / `Protection sociale`              | `REFERENCE_OR_DERIVED`; absent                                                    | required information list                                                          | approved employer affiliations and effective dates                                        | `BLOCKED`                                                            |
| document issue/version/OWNER confirmation                     | future Formalités/Documents metadata; not a contract fact                         | required operational evidence for YUTA generation, separate from employee facts    | immutable template version and explicit OWNER confirmation                                | deferred to persistence/generation design; `HR-FORMALITY-01` blocked |
| DPAE recipient/proof                                          | separate hiring-formality owner; absent                                           | linked process decision, not automatically a CDI input                             | must not be inferred from a contract draft                                                | `BLOCKED`; outside first Formalités draft slice                      |

### Derived readiness proposal

No real `READY` result is approved. A later proposal may derive:

- `INCOMPLETE` when an approved required field is absent;
- `ATTENTION_REQUIRED` when a conditional choice or reviewer-owned applicability
  decision is unresolved; and
- `READY_FOR_OWNER_REVIEW` only when the selected approved template version and
  every applicable factual field pass validation.

`READY_FOR_OWNER_REVIEW` would never mean legally valid, signed, issued, or sent.
The current Phase 4 `READY` remains demonstration-only and is not reused.

### Review outcome

The internal matrix is complete enough to expose the blockers, but no row is
approved for persistence or runtime. Product must approve the proposed first
slice. A qualified French employment-law/template reviewer must approve the
template, applicability, wording, conditions, and mappings. The DPO/privacy,
security, and operations owners must close the named production gates before any
real data or production use.

No row above becomes a Zod schema, transport field, database column, readiness
rule, UI control, or executable template mapping during Phase 5.

## F08 Phase 0 interaction reconciliation

The current F08-compatible path ends before persistence:

```text
trusted employee dossier read
-> allowlisted six-field Formalités presentation
-> local illustrative input/review state
-> disabled generation
```

There is no Formalités write model or transport. The current `CREATE_CHECKPOINT`
reducer event copies local values only inside React memory; it is not F5-07
`DRAFT`. `READY` means demo completeness only. Reload or navigation discards
both without an audit event.

Any later durable design must first receive the qualified field/applicability
and template evidence, then define trusted snapshot inputs, revisions,
idempotency, one active draft, transitions, immutable generated versions,
minimized audit, file-reference/storage boundary, retention, failure recovery,
and cross-tenant denial. Generated draft ownership stays in Formalités; a signed
artifact remains a separate Documents concern.

Phase 0 adds no field, schema, migration, contract, API, server action,
repository, permission, audit definition, persistence, file, PDF, template,
signature, AI/provider, real personnel data, or production behavior.
