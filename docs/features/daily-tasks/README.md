# YUTA Tâches du jour Product Knowledge

Status: APPROVED — KNOWLEDGE MIGRATION COMPLETE

Visibility: Engineering

Owner: YUTA product and engineering

Last updated: 2026-09-29

## Purpose and bounded scope

Tâches du jour is the future Backoffice source capability for restaurant work
that an employee needs to consult for a specific day. Its confirmed high-level
direction covers date- and employee-relevant tasks, time and priority ordering,
secondary non-mandatory work, applicability influenced by date and employee
`poste`, employee consultation, and print or digital checking.

This home is the canonical repository entry point for the reconciled Tâches du
jour Product Knowledge scope. It keeps Product direction, implementation,
executable data shape, authorization, legal/privacy/compliance status, and
readiness separate. It does not approve an exact V1, task schema, lifecycle,
permission model, generation engine, recurrence model, or production use.

The reconciliation covers Tâches du jour only. References to Aujourd'hui,
Planning, Personnel, Pointage, Formalités, fiche de poste, Resources,
Compliance, Stock, Technical Sheets, Notifications, Establishment, and Identity
& Access establish ownership or exclusion boundaries; they do not migrate those
capabilities.

## Knowledge migration state

The Human-supplied `TACHES_DU_JOUR_LEGACY_KNOWLEDGE_EXTRACT.md` with SHA-256
`2f5c5eb6f6a76fbe618850c5d47b98639c5a2c083257019e8fbdfe06361431fb`
was used only as legacy evidence for the 2026-09-28 reconciliation. The complete
artifact, including its final control block, was verified before repository
classification began. Export-only transport markers were ignored.

The extract was not copied into this home, and its classifications were checked
against question-specific repository authority. Repository reconciliation,
bounded canonicalization, fresh-agent acceptance, and the Human-authorized
authority cutover are complete for the exact scope in this home.

The completed Salariés, Planning, Pointage, and Formalités migrations remain
unchanged. Their Page Chats remain `LEGACY EVIDENCE ONLY` for their respective
migrated scopes, and their open decision packets were not reopened.

## Fresh-agent acceptance and authority cutover

The repository-only
`TACHES_DU_JOUR_FRESH_AGENT_ACCEPTANCE_REPORT_PASS.md` has SHA-256
`4adfe7e9e12269a129f765036c7e8d4dd576211cc71ab0dfcd497450459a99a2`.
The fresh agent used no Page Chat history, legacy extract, reconciliation
report, or external research. It reported:

```text
REPOSITORY_MUTATED: NO
PAGE_CHAT_HISTORY_USED: NO
LEGACY_EXTRACT_USED: NO
RECONCILIATION_REPORT_USED: NO
EXTERNAL_RESEARCH_USED: NO
MATERIAL_KNOWLEDGE_GAPS: 0
GENUINE_CONFLICTS_IDENTIFIED: 0
SALARIES_SCOPE_REOPENED: NO
PLANNING_SCOPE_REOPENED: NO
POINTAGE_SCOPE_REOPENED: NO
FORMALITES_SCOPE_REOPENED: NO
AUJOURDHUI_SCOPE_MIGRATED: NO
RESSOURCES_INTERNES_SCOPE_MIGRATED: NO
CONFORMITE_SCOPE_MIGRATED: NO
OTHER_PAGE_SCOPE_MIGRATED: NO
TACHES_DU_JOUR_PAGE_AUTHORITY_RETIRED: NO
FRESH_AGENT_ACCEPTANCE: PASS
READY_FOR_AUTHORITY_CUTOVER: YES
```

The report establishes repository discoverability for this exact bounded
Tâches du jour scope. It is acceptance and discovery evidence only: it creates
no Product, legal, privacy, security, implementation, readiness, or production
authority and does not resolve `TJD-01` through `TJD-15`.

For this exact migrated scope after the Human-authorized cutover:

- the repository is canonical knowledge;
- the Tâches du jour Page Chat is `LEGACY EVIDENCE ONLY` and remains available
  for historical or forensic lookup;
- Control Tower owns shaping, genuine conflict resolution, Human Decision
  routing, cross-module reasoning, and governance coordination; and
- Coding Agents use repository discovery for analysis and perform only
  separately authorized execution and verification.

This cutover does not migrate Aujourd'hui, Ressources internes, Conformité, or
another Page Chat scope; change Salariés, Planning, Pointage, or Formalités
authority; select task-library, fiche de poste, Planning-generation,
check-completion, or print/digital-source semantics; approve implementation or
production; or create a current legal, privacy, or security conclusion.

## Confirmed current Product direction

The following six Human decisions are confirmed at conceptual Product level.
Current tracked code establishes that none is implemented by the placeholder
route.

| Confirmed direction            | Exact boundary                                                                                                                                                             | Current implementation    |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| Date and employee view         | A daily operational view relates work to a specific date and employee. The exact assignment and filtering model remains open.                                              | `DECIDED_NOT_IMPLEMENTED` |
| Time and priority ordering     | The employee view is not an unstructured flat list; time and priority both influence presentation. No enum, ranking algorithm, due-time model, or tie-breaker is approved. | `DECIDED_NOT_IMPLEMENTED` |
| Secondary tasks                | Some work may be secondary and non-mandatory. No `OPTIONAL`, `SECONDARY`, or priority enum is approved.                                                                    | `DECIDED_NOT_IMPLEMENTED` |
| Date and `poste` applicability | Relevant work depends on the date and the concerned employee's `poste`. This does not approve a Personnel projection or Planning-driven generation.                        | `DECIDED_NOT_IMPLEMENTED` |
| Employee consultation          | An employee can conceptually consult their relevant daily work. Read filtering, identity, device, and permission details remain open.                                      | `DECIDED_NOT_IMPLEMENTED` |
| Print and digital checking     | The direction includes a printable form and a screen on which work can be checked. The channels, V1 inclusion, persistence, and source of truth remain open.               | `DECIDED_NOT_IMPLEMENTED` |

The current purpose also implies a manager need to populate useful tasks, but
the manager workflow is unresolved. No create, edit, assign, review, or template
operation is approved by that need alone.

## Confirmed long-term direction

YUTA may assist a restaurateur with creating a `fiche de poste` by presenting
task models for selection and allowing custom tasks to be added. This is a
confirmed long-term direction, not a current V1 requirement or implementation.

The owner of fiche de poste and task models, their document or operational
meaning, selection/reference/copy semantics, versioning, employee
acknowledgement, permissions, and any daily-task generation remain unresolved.
If fiche de poste becomes an official employment document, current external
legal and privacy review is required before production use.

## Current implementation

| Evidence area          | Current repository state                                                                                                                                            | What it establishes                                                                                                      |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Route                  | [`/equipe/taches-quotidiennes`](<../../../apps/backoffice/src/app/(authenticated)/equipe/taches-quotidiennes/page.tsx>) exists.                                     | The current route is known. The legacy assistant route `/team/daily-tasks` does not exist and is not canonical.          |
| Renderer               | The route renders [`PlannedBackofficePage`](../../../apps/backoffice/src/components/backoffice/planned-backoffice-page.tsx).                                        | Shared construction copy only; no task list, form, filter, check, print, empty-task state, or domain interaction exists. |
| Navigation             | [`backoffice-navigation.ts`](../../../apps/backoffice/src/components/backoffice/backoffice-navigation.ts) links `Tâches du jour` under `Gestion de l'équipe`.       | Navigation presence only. The item has no task-specific capability predicate.                                            |
| Authenticated shell    | The parent [`(authenticated)` layout](<../../../apps/backoffice/src/app/(authenticated)/layout.tsx>) requires a current server-resolved session and tenant context. | Generic authenticated organization/establishment context only; it does not define task permissions.                      |
| Contracts and schema   | No task-specific transport contract, cloud schema, migration, or executable task enum exists.                                                                       | No executable task data shape is established.                                                                            |
| Repository and actions | No task repository, domain service, loader, action, or mutation exists.                                                                                             | There is no persisted task capability or cross-module write.                                                             |
| Tests                  | [`backoffice-navigation.test.ts`](../../../apps/backoffice/test/backoffice-navigation.test.ts) checks the label in navigation order.                                | Navigation evidence only; no focused task behavior or authorization test exists.                                         |
| UI knowledge           | No `docs/ui/pages/daily-tasks/` page pack exists. The generic page-pack route mapping is not delivery evidence.                                                     | UI delivery and Browser QA are not established.                                                                          |
| Normative behavior     | No task-specific normative main spec, accepted ADR, or task OpenSpec change defines detailed behavior.                                                              | Exact V1 and detailed behavior remain unresolved. ADR-005 controls only the Today/source ownership boundary.             |

The implementation classification is `NOT_STARTED`: an authenticated
placeholder and navigation link are implemented, while the capability is not.
Fixture or prototype content from Compliance, Today visual references, or other
pages is not task implementation or Product Truth.

## Capability and state matrix

| Capability                          | Product status                                                                                                      | Implementation                  | Legal/compliance                                                      | Privacy/security | Environment   | Readiness / production authorization        | Owner and actors                                                                  | Scope and unresolved boundary                                                                       |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------- | --------------------------------------------------------------------- | ---------------- | ------------- | ------------------------------------------- | --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Daily operational task view         | `APPROVED` at the six bounded directions above; exact V1 unresolved                                                 | `NOT_STARTED`; placeholder only | `UNVERIFIED`; no compliance claim                                     | `UNVERIFIED`     | `NOT_ENABLED` | `NOT_ASSESSED`; no production authorization | Tâches du jour conceptual owner; employee and manager journeys are incomplete     | Intended restaurant context; exact organization/establishment data scope and permissions unresolved |
| Assisted fiche de poste composition | Confirmed `LONG_TERM_DIRECTION`                                                                                     | `NOT_STARTED`                   | `REQUIRES_CURRENT_EXTERNAL_REVIEW` if used as an official HR document | `UNVERIFIED`     | `NOT_ENABLED` | `NOT_ASSESSED`; no production authorization | Owner unresolved; restaurateur is the conceptual author                           | Task-model ownership, document meaning, versioning, acknowledgement, and generation unresolved      |
| Task library and routines           | `PROPOSED_NOT_APPROVED` beyond task models in the fiche direction                                                   | `NOT_STARTED`                   | `UNVERIFIED`                                                          | `UNVERIFIED`     | `NOT_ENABLED` | `NOT_ASSESSED`; no production authorization | Owner and manager permissions unresolved                                          | Location, tenancy, recurrence, versions, and relationship to fiche de poste unresolved              |
| Planning-driven generation          | `PROPOSED_NOT_APPROVED`                                                                                             | `NOT_STARTED`                   | `UNVERIFIED`                                                          | `UNVERIFIED`     | `NOT_ENABLED` | `NOT_ASSESSED`; no production authorization | No approved owner, trigger, or actor                                              | No Planning contract, projection, generation, regeneration, or write-back exists                    |
| Future Today aggregation            | `APPROVED` as a source-owned information family by [ADR-005](../../decisions/ADR-005-today-operational-steering.md) | `NOT_STARTED`                   | `UNVERIFIED`                                                          | `UNVERIFIED`     | `NOT_ENABLED` | `NOT_ASSESSED`; no production authorization | Tâches du jour retains future task-record ownership; Today is the future consumer | Source-specific read model, states, permissions, and integration contract unresolved                |

Backoffice is globally `NOT_READY`. Repository presence, typechecking, future
QA, or an enabled environment would not by itself grant production
authorization.

## Task concept matrix

| Concept             | Product status and source                                                            | Owner                                                            | Template or instance                          | Mutation, visibility, consumers, and write-back                                                             | Implementation / retention                        | Unresolved questions                                                                       |
| ------------------- | ------------------------------------------------------------------------------------ | ---------------------------------------------------------------- | --------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Daily task          | Confirmed conceptual direction from the six Human decisions                          | Tâches du jour at semantic record level; exact data owner absent | Instance-like concept; exact model unresolved | Employee consultation confirmed; all mutation authority and cross-module write-back unresolved              | No schema or implementation; retention unresolved | Fields, creation, assignment, lifecycle, dates, persistence, history                       |
| Secondary task      | Confirmed conceptual direction                                                       | Tâches du jour conceptual scope                                  | Unresolved                                    | Must be distinguishable to the employee; no enum, mutation, or downstream meaning approved                  | Not implemented; retention unresolved             | Representation, ordering, completion treatment, legal significance                         |
| Task model          | Confirmed only for the long-term assisted fiche de poste direction                   | Unresolved                                                       | Template-like                                 | Restaurateur may conceptually select models and add custom tasks; editing and write-back unresolved         | Not implemented; retention unresolved             | Whether it is the same concept as an operational template and whether it can generate work |
| Task library        | `PROPOSED_NOT_APPROVED`                                                              | Unresolved                                                       | Proposed collection                           | Proposed manager configuration and consumption by tasks/fiche; no authority or write-back approved          | Not implemented; retention unresolved             | Location, ownership, scope, permissions, versions, consumers                               |
| Routine             | `PROPOSED_NOT_APPROVED`                                                              | Unresolved                                                       | Proposed rule/template                        | No mutation authority, visibility, or consumer is approved                                                  | Not implemented; retention unresolved             | Whether separate from template, recurrence, exceptions, pause/resume                       |
| Daily task instance | Existence is implied only at conceptual daily-view level; exact entity is unresolved | Tâches du jour semantic scope; executable owner absent           | Instance-like                                 | Employee visibility is directional; creation, assignment, mutation, verification, and write-back unresolved | Not implemented; retention unresolved             | Snapshot versus live rendering, source, history, regeneration                              |

No separate recurrence rule, generated occurrence, paused routine, copied task,
or exception concept is approved. The repository must not create those concepts
from the assistant-proposed `template -> daily instance` architecture.

## Ownership, authorization, and tenancy

- **Tâches du jour:** ADR-005 assigns future task records and state to this
  source capability. It does not decide ownership of a task library, task
  models, routines, or fiche de poste.
- **Aujourd'hui:** may later aggregate relevant pending or blocked task facts.
  It has no current integration, task persistence, mutation, or permission to
  bypass the source module.
- **Personnel:** owns employee dossier, current-employment, and `poste` facts.
  No Personnel-to-task projection or task write-back exists. Employment state,
  `poste`, or application role does not make an employee task-eligible or grant
  task permission.
- **Planning:** owns planned work in its separately migrated scope. A task due
  time is not a shift, a task assignment is not a Planning assignment, and no
  generation, synchronization, or cross-write is approved.
- **Pointage:** owns credentials, raw actual-work events, continuations, and
  derived sessions. Task checks, completion, timestamps, or evidence are not
  attendance or actual-work evidence. No cross-write exists.
- **Formalités:** owns administrative drafts and formal workflows. A task is not
  a formalité, and task completion is not administrative evidence.
- **Fiche de poste:** exact owner and legal/documentary boundary remain open.
  Long-lived responsibility text is not automatically a daily task, task
  library, or generator.
- **Resources / Procedures:** canonical procedure content remains separately
  owned. A possible link is unapproved; linking must not transfer ownership or
  allow task editing to alter the procedure.
- **Compliance:** requirements, controls, legal rules, and compliance evidence
  remain separately owned. The disabled `Créer une tâche` prototype control is
  not an integration. Task completion cannot mark compliance `PASS`.
- **Establishment:** provides trusted cloud organization and active
  establishment context. The route inherits that generic authenticated shell,
  but no task-specific organization/establishment ownership or authorization
  policy is approved.

The current placeholder is reachable by authenticated `OWNER`, `MANAGER`, and
`STAFF` users because its navigation item has no task-specific predicate. This
is implementation evidence for placeholder visibility only. It does not approve
read, create, edit, assign, complete, verify, reopen, delete, template, print,
or export permissions for any actor.

Any future tenant-owned implementation must derive organization,
establishment, membership, role, permission, and entitlement from trusted
server context, apply task-specific server authorization, scope every owned
operation to the approved owner, and fail closed on cross-scope access. The
exact task policy and whether tasks are establishment-owned remain Human
decisions.

## Template, routine, and daily-instance boundary

Confirmed:

- daily work exists as a conceptual Product direction;
- task models may assist future fiche de poste composition; and
- ADR-005 treats future task records and state as source-owned by Tâches du
  jour rather than Today.

Proposed and not approved:

- a library located inside Tâches du jour;
- separate template, routine, rule, and generated-instance entities;
- immutable daily snapshots when templates change;
- recurring, service-based, event-based, or Planning-based generation; and
- team/shared tasks and a fixed task taxonomy.

No task concept has executable schema, persistence, versioning, recurrence,
history, or mutation authority. Whether fiche de poste owns, copies, or
references a task model remains unresolved.

## Employee, `poste`, date, and Planning boundary

Date and `poste` affect task applicability at Product direction level. An
employee should be able to consult relevant daily work. Those directions do not
decide:

- whether the task is first assigned to an employee, `poste`, team, service, or
  shift;
- how Personnel facts are projected or how active, upcoming, departed, or
  cross-establishment employees are handled;
- whether an unassigned task is allowed;
- whether every employee with a `poste` is eligible;
- who creates, assigns, reassigns, owns, verifies, or watches work; or
- whether Planning supplies context, triggers generation, or reacts to changes.

No projection, generation contract, synchronization, or write-back exists.

## Completion, evidence, and print/digital boundary

The word `check` establishes only a high-level digital follow-up direction. It
does not establish viewed, acknowledged, started, completed, verified, skipped,
blocked, cancelled, overdue, reopened, archived, or deleted states. No actor,
timestamp, persistence, transition, retry, audit, or notification semantics are
approved.

No completion-evidence requirement or model is approved for notes, checklists,
measurements, quantities, photos, files, signatures, manager verification,
rejection, or immutable evidence. An attachment would not prove authenticity;
a checked task would not be manager-verified, attendance evidence,
administrative evidence, or compliance evidence.

Printing is confirmed as a direction, but printable fields, privacy, completion
on paper, re-entry, reconciliation, and retention remain open. Digital status is
not selected as canonical. Paper and digital do not currently form competing
authorities because neither completion workflow exists; the source-of-truth
question is unresolved rather than a genuine conflict.

## Product, implementation, schema, review, and readiness

These axes remain independent:

- **Product:** the six bounded current directions, the long-term fiche de poste
  direction, and ADR-005 ownership boundary are confirmed. Fifteen grouped
  Human decisions remain open.
- **Implementation:** the canonical route, navigation link, authenticated shell,
  and shared placeholder render. No task capability is implemented.
- **Executable data shape:** no task contract, enum, schema, migration,
  repository, action, or persistence exists.
- **Authorization:** generic authentication and tenant resolution exist. No
  task-specific actor or operation policy exists.
- **Legal/compliance:** no current legal, HACCP, safety, employment, or
  compliance conclusion exists. Claims tied to official fiche de poste,
  regulated tasks, or compliance evidence require current external review.
- **Privacy/security:** employee visibility, free text, files, signatures,
  monitoring, ranking, retention, export, audit, and isolation behavior are
  unverified and unresolved.
- **Environment and readiness:** the capability is `NOT_ENABLED`, readiness is
  `NOT_ASSESSED`, Backoffice is `NOT_READY`, no deployment evidence exists, and
  production is unauthorized.

## Grouped Human decisions required

Each packet is one coherent authority decision. Raw legacy questions are not
counted separately.

| ID     | Exact decision                                                                                                                            | Current evidence and why unresolved                                                                                           | Legal/privacy/security status                                                            | Required authority and what coding agents must not infer                                                                                                 |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| TJD-01 | Define the exact current V1 and core task entity/fields.                                                                                  | Six conceptual directions exist; no normative model, schema, or exact V1 exists.                                              | `UNVERIFIED`                                                                             | Human Product, architecture, data, and security authority. Do not derive fields or enums from generic task products.                                     |
| TJD-02 | Decide task-model, template, routine, library, and daily-instance concepts and ownership.                                                 | Task models occur in the long-term fiche direction; the remaining architecture is assistant-proposed.                         | `UNVERIFIED`                                                                             | Human Product and architecture/data authority. Do not place a library in Tâches du jour or create recurrence/versioning automatically.                   |
| TJD-03 | Decide fiche de poste ownership and whether it owns, copies, or references task models or creates daily work.                             | The assisted authoring direction is confirmed; document and generation semantics are absent.                                  | `REQUIRES_CURRENT_EXTERNAL_REVIEW` if the fiche has official HR meaning                  | Human Product plus Personnel/Documents/Resources ownership and legal/privacy review. Do not equate responsibility text, a task model, and a daily task.  |
| TJD-04 | Decide task generation and applicability, including manual, date, `poste`, service, employee, event, routine, and Planning inputs.        | Date and `poste` applicability is confirmed; every generation mechanism is unresolved or proposed.                            | `UNVERIFIED`                                                                             | Human Product, Planning owner, architecture, and security authority. Do not make Planning a trigger or regenerate after shift changes.                   |
| TJD-05 | Decide the Personnel projection and employee eligibility across lifecycle and establishments.                                             | Personnel owns current facts; no projection exists and active employment does not imply task eligibility.                     | `REQUIRES_CURRENT_EXTERNAL_REVIEW`                                                       | Human Product, Personnel owner, tenancy, legal/privacy, and security authority. Do not copy Personnel facts or infer eligibility.                        |
| TJD-06 | Decide assignment, responsibility, creator, verifier, watcher, team/poste assignment, unassigned work, reassignment, and override.        | No task actor model exists.                                                                                                   | `UNVERIFIED`                                                                             | Human Product and authorization authority. Do not equate assignment, permission, responsibility, or verification.                                        |
| TJD-07 | Decide exact time, relative moment, service period, manual order, priority, secondary-task, urgent, overdue, safety, and legal semantics. | Time plus priority and secondary/non-mandatory direction is confirmed; exact values and algorithms are absent.                | `REQUIRES_CURRENT_EXTERNAL_REVIEW` for safety/legal significance                         | Human Product plus relevant compliance/legal authority. Do not invent enums, ranking, escalation, or obligation.                                         |
| TJD-08 | Decide lifecycle, digital `check`, completion, verification, evidence, reopen, and error/recovery semantics.                              | No task state or transition is approved or implemented.                                                                       | `UNVERIFIED`; external review required before evidentiary use                            | Human Product, data, authorization, privacy/security, and applicable legal/compliance authority. Do not turn a checkbox into completion or verification. |
| TJD-09 | Decide print and digital V1, canonical source, paper completion, re-entry, reconciliation, printable fields, and privacy.                 | Both channels are directional; neither workflow or source of truth exists.                                                    | `REQUIRES_CURRENT_EXTERNAL_REVIEW`                                                       | Human Product, privacy/security, data, and operations authority. Do not select digital or paper as canonical.                                            |
| TJD-10 | Decide manager and employee journeys, self-service, roles, and every read/mutation/export operation.                                      | The manager population need and employee consultation direction exist; route visibility is generic only.                      | `UNVERIFIED`                                                                             | Human Product and authorization/security authority. Do not inherit OWNER/MANAGER/STAFF or employee rights from another module.                           |
| TJD-11 | Decide the source-specific Today projection, read model, states, permissions, links, and whether any mutation is allowed.                 | ADR-005 approves future aggregation while retaining source ownership; no integration exists.                                  | `UNVERIFIED`                                                                             | Human Product for Tâches du jour and Today plus architecture/security authority. Do not let Today own or mutate task records.                            |
| TJD-12 | Decide any projection or link with Formalités, Compliance, Resources/Procedures, Stock, or Technical Sheets.                              | Ownership boundaries exist; no approved task integration exists.                                                              | `REQUIRES_CURRENT_EXTERNAL_REVIEW` where rules or evidence have legal/compliance meaning | Human Product and every owning module plus legal/privacy/security authority. Do not convert tasks into procedures, formal acts, controls, or proof.      |
| TJD-13 | Decide notifications, escalation, channels, devices, shared-screen behavior, offline queue, retry, and failure recovery.                  | No notification, device, or offline task model exists.                                                                        | `UNVERIFIED`                                                                             | Human Product, architecture, security/privacy, and operations authority. Do not infer email, SMS, push, kiosk, or offline support.                       |
| TJD-14 | Decide history, snapshots, audit, versions, retention, archive, deletion, restore, data-subject rights, and analytics boundaries.         | No persistence or policy exists.                                                                                              | `REQUIRES_CURRENT_EXTERNAL_REVIEW`                                                       | Human Product plus legal/privacy/security/data/operations authority. Do not invent event sourcing, legal evidence, monitoring, or employee scoring.      |
| TJD-15 | Decide UI delivery, QA, environment enablement, deployment, operations, external review, and production authorization.                    | No page pack or task QA exists; the placeholder is `NOT_ENABLED`, readiness is `NOT_ASSESSED`, and Backoffice is `NOT_READY`. | `REQUIRES_CURRENT_EXTERNAL_REVIEW` before sensitive or production use                    | Human Product, UI, legal/privacy/security, operations, and release authority. Do not infer readiness from future code or checks.                         |

## Reconciliation accounting and historical safeguards

The counting unit is one grouped material claim or decision packet, assigned one
primary disposition:

| Disposition               | Count | Counted material                                                                                                                                                                              |
| ------------------------- | ----: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CONFIRMED`               |    11 | Migration scope, operational purpose, long-term assisted fiche direction, Today ownership, and Personnel, Planning, Pointage, Formalités, Resources, Compliance, and Establishment boundaries |
| `IMPLEMENTED`             |     2 | Canonical route/navigation presence and authenticated shared-placeholder rendering                                                                                                            |
| `DECIDED_NOT_IMPLEMENTED` |     6 | The six current Human directions listed above                                                                                                                                                 |
| `PROPOSED`                |     5 | Library location, template/routine/instance snapshot architecture, Planning generation, expanded taxonomy/team/moment model, and expanded employee interaction/analytics policy               |
| `UNRESOLVED`              |    15 | `TJD-01` through `TJD-15`                                                                                                                                                                     |
| `CONFLICT`                |     0 | The four legacy candidates resolve to owner/consumer, present/long-term, or approved/proposed distinctions; the remaining questions are open rather than contradictory                        |
| `OBSOLETE`                |     1 | The earlier assistant pipeline that assigned a fixed fiche/rules/Planning/task architecture; it has no Product authority and must not be resurrected                                          |

No assistant proposal became Product Truth. The nonexistent `/team/daily-tasks`
path, Compliance prototype button, Today visual concepts, and generic
navigation do not establish task behavior.

## Explicit non-inferences

Do not infer that:

- Planning generates, assigns, or regenerates tasks;
- a `poste`, role, active employee, or membership grants task eligibility or
  permission;
- a task due time is a shift or a task assignment is a Planning assignment;
- checked means completed, verified, attended, compliant, or legally proven;
- a photo, file, note, or signature is required or authentic evidence;
- task history is Personnel history, actual-work evidence, an inspection
  register, or a basis for performance scoring;
- Today, fiche de poste, Resources, or Compliance owns task records;
- a task library belongs inside Tâches du jour;
- print or digital is the canonical completion source;
- recurrence, notifications, offline behavior, or employee self-service exists;
  or
- placeholder, typecheck, future tests, or repository documentation establishes
  environment enablement or production readiness.

## Discovery path and fresh-agent acceptance

A repository-only agent should navigate:

1. [`docs/README.md`](../../README.md) and
   [`PRODUCT_KNOWLEDGE.md`](../../PRODUCT_KNOWLEDGE.md);
2. [`MODULE_REGISTRY.md`](../../MODULE_REGISTRY.md) and this home;
3. [ADR-005](../../decisions/ADR-005-today-operational-steering.md) and the
   [Today home](../today/README.md) for source/consumer ownership;
4. the current [route](<../../../apps/backoffice/src/app/(authenticated)/equipe/taches-quotidiennes/page.tsx>),
   shared [placeholder](../../../apps/backoffice/src/components/backoffice/planned-backoffice-page.tsx),
   [navigation](../../../apps/backoffice/src/components/backoffice/backoffice-navigation.ts),
   authenticated layout, and navigation test;
5. [Personnel](../personnel/README.md), [Planning](../planning/README.md),
   [Pointage](../pointage/README.md), and [Establishment](../establishment/README.md)
   for bounded ownership;
6. [`CURRENT_STATE.md`](../../CURRENT_STATE.md), the
   [Authority Model](../../AUTHORITY_MODEL.md), and
   [Production Readiness](../../operations/PRODUCTION_READINESS.md).

Without Page Chat history, the legacy extract, the reconciliation report, or
external research, the fresh agent recovered the six current directions, the
long-term fiche direction, current route and placeholder status, source
ownership, absence of task data and operations, authorization and tenancy
limits, all cross-module exclusions, all 15 open decision packets, and the
independent legal, privacy, and readiness state. The repository-only acceptance
passed with zero material knowledge gaps and zero genuine conflicts.

## Status

Repository reconciliation and bounded canonicalization: `COMPLETE` on
2026-09-29.

Fresh-agent acceptance: `PASS`.

Authority cutover: `COMPLETE` on 2026-09-29.

Tâches du jour Page Chat role: `LEGACY EVIDENCE ONLY` for the exact migrated
scope in this home.
