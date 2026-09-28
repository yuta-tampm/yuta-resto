# Planning Product Knowledge

Status: `APPROVED — KNOWLEDGE MIGRATION COMPLETE`

Visibility: Engineering

Owner: YUTA Product and Planning

## Purpose and bounded scope

Planning helps a restaurant manager prepare planned team work from restaurant
staffing needs, employee planning inputs, availability, constraints, and
absences. The confirmed direction covers generation, understandable
infeasibility explanations, proposed resolutions, Human-controlled editing,
duplication, reuse of current data, a pre-generation change check, and planning
across multiple future weeks.

This home covers only Planning knowledge. Personnel, Pointage, Formalités,
Absences, Today, Tasks, Payroll, Establishment, Notifications, and employee
self-service appear only to define ownership and integration boundaries. Their
own Product Truth is not migrated here.

The exact current V1, domain model, permissions, legal behavior, publication
lifecycle, and production model remain unresolved. The confirmed direction is
not an implementation contract.

## Knowledge migration state

The legacy evidence file
`PLANNING_LEGACY_KNOWLEDGE_EXTRACT.md` has SHA-256
`9e54638b206ce72a9624fda8cac0940aa37d068a4ff64ca9c8b402319b883836`.
It was reconciled as evidence only; it was not copied, and its classifications
were not accepted without current repository evidence.

Repository reconciliation, bounded canonicalization, fresh-agent acceptance,
and the Human-authorized authority cutover are complete for the exact scope in
this home.

The completed Salariés, Pointage, and Formalités migrations remain unchanged.
Their Page Chats remain `LEGACY EVIDENCE ONLY` for their respective migrated
scopes, and their open decision packets were not reopened.

## Fresh-agent acceptance and authority cutover

The repository-only `PLANNING_FRESH_AGENT_ACCEPTANCE_REPORT_PASS.md` has
SHA-256
`0e9d74a6c3034c603d24bc540b32684588ff13fbbda50e3454e7451c78ef87ca`.
The fresh agent used no Page Chat history, legacy extract, reconciliation
report, remediation report, previous acceptance report, or external research.
It reported:

```text
REPOSITORY_MUTATED: NO
PAGE_CHAT_HISTORY_USED: NO
LEGACY_EXTRACT_USED: NO
RECONCILIATION_REPORT_USED: NO
REMEDIATION_REPORT_USED: NO
PREVIOUS_ACCEPTANCE_REPORT_USED: NO
EXTERNAL_RESEARCH_USED: NO
MATERIAL_KNOWLEDGE_GAPS: 0
GENUINE_CONFLICTS_IDENTIFIED: 0
SALARIES_SCOPE_REOPENED: NO
POINTAGE_SCOPE_REOPENED: NO
FORMALITES_SCOPE_REOPENED: NO
OTHER_PAGE_SCOPE_MIGRATED: NO
FRESH_AGENT_ACCEPTANCE: PASS
READY_FOR_AUTHORITY_CUTOVER: YES
```

The report establishes repository discoverability for this exact bounded
Planning scope only. It is acceptance evidence rather than Product,
implementation, legal, privacy, security, environment, readiness, or
production authority and does not resolve `PLAN-01` through `PLAN-14`.

Under the
[Authority Model](../../AUTHORITY_MODEL.md#scope-bound-legacy-page-chat-transition):

- the repository is canonical knowledge for this migrated Planning scope;
- the Planning Page Chat is `LEGACY EVIDENCE ONLY` for this exact scope and
  remains available for historical or forensic lookup;
- Control Tower owns shaping, genuine conflict resolution, Human Decision
  routing, cross-module reasoning, and governance coordination; and
- Coding Agents use repository discovery for analysis and perform only
  separately authorized execution and verification.

This cutover does not migrate related capabilities, change another Page Chat's
authority, create or resolve a Product decision, approve implementation or
production, or create a current legal, privacy, or security conclusion.

## Confirmed Product direction

The following are confirmed high-level Product direction:

1. Managers can describe restaurant staffing needs by service, including
   headcount, poste, and a time range to cover.
2. An employee may be capable of covering multiple postes, including different
   postes across services.
3. Planning needs a weekly-hours input, service availability, and manager-entered
   specific constraints for an employee.
4. Managers may enter specific constraints in free text. Any structured or
   legally enforceable interpretation remains unresolved.
5. YUTA is intended to generate a planning from current restaurant needs and
   approved source data.
6. When the requested planning is infeasible, YUTA should explain why and
   propose resolution options rather than silently breaking constraints.
7. The manager retains final Product arbitration, subject to separately
   verified non-overridable legal rules.
8. Managers can edit and duplicate a planning and reuse stored, updated data.
9. Before new generation, the workflow should check for new constraints,
   updates, leave, or absences.
10. Planning must account for absences, while the canonical owner and approval
    workflow for absence records remain undecided.
11. A planning period may cover multiple future weeks. A week may remain a
    display or working unit; the exact period and version model is unresolved.
12. Planning is intended to account for current French labor rules. No exact
    legal number, rule, warning, block, or override behavior is currently
    verified or approved.

The current repository does not establish an exact shift, assignment, staffing
need, break, recurrence, template, status, version, publication, or
communication contract.

## Long-term directions

These directions are non-current provenance. They do not extend current V1,
approve an implementation, or change any `PLAN-01` through `PLAN-14` decision.

### Future impact detection after source changes

| Classification field             | Current value          |
| -------------------------------- | ---------------------- |
| `FUTURE_IMPACT_DETECTION_STATUS` | `LONG_TERM_DIRECTION`  |
| `HUMAN_APPROVAL_SCOPE`           | `BROAD_DIRECTION_ONLY` |
| `CURRENT_REQUIREMENT`            | `NO`                   |
| `IMPLEMENTATION_STATUS`          | `NOT_IMPLEMENTED`      |

Provenance: an assistant proposed that changes to employee availability or
other relevant source data could identify already-created future plannings that
might be affected. The Human broadly accepted the surrounding Planning
direction, but did not approve this behavior item by item or approve exact
rules.

This is distinct from the confirmed pre-generation change check:

| Direction                                                                          | Classification                                 |
| ---------------------------------------------------------------------------------- | ---------------------------------------------- |
| Before generating a new planning, ask whether relevant inputs changed              | Confirmed high-level current Product direction |
| After source data changes, identify existing future plannings that may be affected | Non-current long-term direction only           |

Future impact detection does not authorize an impact-analysis engine,
automatic invalidation or regeneration, notifications, audit, or a source-change
event model. Triggering sources, examined plannings, synchronous/asynchronous
behavior, impact granularity, persistence, warnings, notification,
acknowledgment, manager action, regeneration, history/audit, authorization, and
retention remain unresolved within the existing Personnel/source, generation,
notification, history, and authorization decision packets.

### Better Planning assistance over time

| Classification field                 | Current value                                                                 |
| ------------------------------------ | ----------------------------------------------------------------------------- |
| `BETTER_ASSISTANCE_OVER_TIME_STATUS` | `LONG_TERM_DIRECTION`                                                         |
| `CURRENT_REQUIREMENT`                | `NO`                                                                          |
| `IMPLEMENTATION_STATUS`              | `NOT_IMPLEMENTED`                                                             |
| Provenance                           | Legacy medium-confidence direction, not item-by-item current Product approval |

The broad aspiration is that Planning assistance may improve over time. Its
illustrative mechanisms have narrower authority:

| Illustrative possibility | Exact behavior status   |
| ------------------------ | ----------------------- |
| Optimization             | `PROPOSED_NOT_APPROVED` |
| Equity                   | `PROPOSED_NOT_APPROVED` |
| Forecasting              | `PROPOSED_NOT_APPROVED` |

These examples do not authorize an optimization objective, fairness metric,
equitable-hours allocation, cost or revenue optimization, staffing forecasting,
adaptive planning, model learning, automatic preference learning, autonomous
planning, or performance scoring. Exact objectives, measures, inputs,
algorithms, provider/model choices, explanations, Human controls, data use, and
legal/privacy effects remain unresolved inside the existing generation and
calculation decision packets.

## Current implementation

The current implementation is only a planned Backoffice surface:

- navigation exposes `/equipe/planning`;
- the route renders the shared `PlannedBackofficePage` empty state;
- the enclosing authenticated layout requires a validated session and trusted
  tenant context before rendering the protected shell;
- there is no Planning-specific operation catalog, permission guard, action,
  loader, contract, schema, repository, persistence, domain service, generation
  engine, page pack, ADR, normative Planning spec, or Planning QA evidence;
- a focused test confirms the authenticated shell boundary, the single
  placeholder route, and the absence of a Planning operation inventory.

The placeholder title and description are implementation evidence only. They do
not approve the detailed Product model or establish development usability.

Current evidence:

- [Planning route](<../../../apps/backoffice/src/app/(authenticated)/equipe/planning/page.tsx>)
- [Shared planned page](../../../apps/backoffice/src/components/backoffice/planned-backoffice-page.tsx)
- [Authenticated layout](<../../../apps/backoffice/src/app/(authenticated)/layout.tsx>)
- [Authorization catalog](../../../apps/backoffice/src/server/auth/permissions.ts)
- [Focused cross-domain test](../../../apps/backoffice/test/pointage-cross-domain-auth.test.ts)

## Capability and state matrix

| Capability                                         | Product status                                 | Implementation                                                               | Legal/privacy/security                                                      | Environment/readiness                              | Owner and current limits                                                                 |
| -------------------------------------------------- | ---------------------------------------------- | ---------------------------------------------------------------------------- | --------------------------------------------------------------------------- | -------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Staffing needs by service                          | Confirmed high-level direction                 | Not implemented                                                              | Legal not applicable to the need itself; privacy/security model unresolved  | `NOT_ENABLED`; capability readiness `NOT_ASSESSED` | Planning; exact entity and Establishment service dependency unresolved                   |
| Multi-poste planning input                         | Confirmed high-level direction                 | Not implemented                                                              | Exact visibility and mutation policy unresolved                             | Not enabled or production-authorized               | Planning need; source ownership and skill model unresolved                               |
| Weekly-hours input                                 | Confirmed Planning need                        | No Planning projection; Personnel has a separate current weekly-minutes fact | Legal use requires current external review                                  | Not enabled                                        | Personnel remains fact owner; Planning consumption is undecided                          |
| Service availability and constraints               | Confirmed broad direction, including free text | Not implemented                                                              | Sensitive content, visibility, validation, and legal meaning require review | Not enabled                                        | Exact owner, actor, hard/soft behavior, and schema unresolved                            |
| Planning generation                                | Confirmed high-level direction                 | Not implemented                                                              | Exact legal constraints require current external review                     | Not enabled; readiness not assessed                | Planning; algorithm, solver, AI, optimization, and partial regeneration unresolved       |
| Infeasibility explanation and resolution proposals | Confirmed high-level direction                 | Not implemented                                                              | A proposal cannot override a verified legal block                           | Not enabled                                        | Planning; explanation and proposal contract unresolved                                   |
| Manager edit, duplicate, and reuse                 | Confirmed high-level direction                 | Not implemented                                                              | Authorization, audit, and privacy unresolved                                | Not enabled                                        | Planning; copy is not recurrence or a template by default                                |
| Pre-generation change check                        | Confirmed high-level direction                 | Not implemented                                                              | Absence and constraint privacy unresolved                                   | Not enabled                                        | Planning workflow; exact inputs and persistence unresolved                               |
| Absence awareness/input                            | Confirmed Planning need                        | No Planning or separate Absence implementation found                         | Requires current legal/privacy/security review                              | Not enabled                                        | Canonical owner, approval, reasons, and write authority unresolved                       |
| Multi-week planning                                | Confirmed high-level direction                 | Not implemented                                                              | Legal rules remain period-specific review inputs                            | Not enabled                                        | Planning; exact period, week, version, and publication units unresolved                  |
| Law-aware planning and Human arbitration           | Confirmed direction only                       | Not implemented                                                              | `REQUIRES_CURRENT_EXTERNAL_REVIEW`; no current rule is verified here        | Not enabled; no production authorization           | Human arbitration cannot override verified non-overridable law                           |
| Draft/publication/communication                    | Exact lifecycle not approved                   | Not implemented                                                              | Communication duties require current review                                 | Not enabled                                        | `Brouillon`, `Prévisionnel`, and `Publié` remain proposals                               |
| Employee view or self-service                      | Unresolved                                     | Not implemented                                                              | Privacy, access, and acknowledgment semantics unresolved                    | Not enabled                                        | No own-shift view, submission, swap, request, or acknowledgment is approved              |
| Notifications                                      | Unresolved                                     | Not implemented                                                              | Contact use, delivery, retention, and failure handling unresolved           | Not enabled                                        | No email, SMS, push, in-app, reminder, or acknowledgment capability is approved          |
| Totals, comparisons, payroll, or costing           | Unresolved                                     | Not implemented                                                              | Calculations cannot establish legal compliance or payroll truth             | Not enabled                                        | No duration, break, overtime, cost, payroll, or planned/actual contract is approved      |
| History and versioning                             | Unresolved                                     | Not implemented                                                              | Retention, deletion, audit access, and legal evidence require review        | Not enabled                                        | No event sourcing, immutable publication evidence, restore, or archive model is approved |

Backoffice overall remains `NOT_READY`. Planning capability readiness is
`NOT_ASSESSED`, its environment is `NOT_ENABLED`, and production authorization
is absent.

## Planning concept matrix

| Concept                | Product status and owner                                                 | Source/mutation/visibility                                  | Consumers and write-back                                        | Implementation and unresolved boundary                                                 |
| ---------------------- | ------------------------------------------------------------------------ | ----------------------------------------------------------- | --------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Planning period        | Confirmed Planning concept                                               | Manager input intended; exact authority unresolved          | Planning generation only; no external write-back approved       | Not implemented; start/end, week, version, and publication granularity unresolved      |
| Staffing need          | Confirmed Planning concept                                               | Restaurant manager; structured intent                       | Generation; manager editing intended                            | Not implemented; exact schema, service owner, and unassigned representation unresolved |
| Shift/time block       | Conceptually required by from/to work direction                          | Generated or manager-edited source is intended              | Planning only                                                   | Exact entity, break, overlap, overnight, and status model unresolved                   |
| Employee assignment    | Confirmed conceptual output owned by Planning                            | Generated or manager-edited; employee visibility unresolved | No Pointage, Personnel, payroll, or notification write-back     | Not implemented; relationship to shift and unassigned need unresolved                  |
| Multi-poste capability | Confirmed Planning input direction                                       | Source and mutation authority unresolved                    | Generation eligibility                                          | Not implemented; no primary/secondary, proficiency, history, or skill catalog approved |
| Weekly-hours input     | Confirmed Planning need; underlying current fact remains Personnel-owned | No approved Planning read projection                        | No write-back to Personnel                                      | No Planning implementation; comparison and calculation semantics unresolved            |
| Service availability   | Confirmed broad direction                                                | Actor, owner, structure, and visibility unresolved          | Planning generation                                             | Not implemented; exact day/service/time representation unresolved                      |
| Planning constraint    | Confirmed free-text manager input direction                              | Planning-oriented input; sensitive-data rules unresolved    | Generation, explanation, and proposals                          | Not implemented; structured taxonomy, preference, and hard/legal behavior unresolved   |
| Absence                | Confirmed Planning-relevant information                                  | Canonical owner and approval/mutation authority unresolved  | Planning may need to consume it; no write-back approved         | Not implemented; reason, privacy, granularity, and workflow unresolved                 |
| Generated planning     | Confirmed Planning output direction                                      | Generator plus manager arbitration intended                 | Planning only unless later approved                             | Not implemented; exact domain, determinism, AI, and optimization unresolved            |
| Published planning     | Proposed concept only                                                    | Actor and visibility unresolved                             | Communication and acknowledgment are separate, unapproved steps | Not implemented; no canonical state or transition exists                               |

## Ownership, authorization, and tenancy

| Boundary        | Current authority                                                                                                                                                                    |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Planning        | Owns planned work only where the confirmed direction is later expressed in an approved exact model. It does not yet own persisted Planning resources.                                |
| Personnel       | Canonical owner of employee dossiers and current employment facts. Planning has no approved read projection and no write-back authority. `SAL-01` through `SAL-11` remain unchanged. |
| Pointage        | Owns credentials, continuations, immutable raw clock events, derived attendance/session state, and actual-work evidence. Planning neither writes nor replaces Pointage evidence.     |
| Formalités      | Owns administrative drafts and workflow evidence. A planned shift is not a contract, signature, generated legal document, or Formalités record.                                      |
| Absences        | Planning awareness/input is confirmed; canonical ownership, approval, mutation, and privacy remain unresolved. No separate implemented Absence capability was found.                 |
| Establishment   | Owns trusted identity, locale, timezone, and tenant context. Planning consumption of timezone, service periods, or opening hours needs an exact approved contract.                   |
| Today and Tasks | No current Planning integration. Today future aggregation authority does not establish Planning or Tasks behavior.                                                                   |
| Payroll         | No approved input, result, calculation, comparison, or write-back relationship.                                                                                                      |

The current placeholder inherits the authenticated layout. That layout requires
a trusted server session and selected tenant with a user actor. It does not
establish Planning Product permissions. No Planning operation exists for
`OWNER`, `MANAGER`, `STAFF`, employee/self, service, or system actors, and no
read/create/edit/delete/assign/publish/notify/export authorization is approved
or implemented.

Because there is no Planning data access, no Planning repository currently
demonstrates organization/establishment predicates or cross-scope denial. The
Product direction is restaurant/establishment-oriented, while exact resource
ownership, organization scope, establishment scope, and cross-establishment
behavior remain unresolved. Future implementation must derive trusted scope on
the server and fail closed under the repository tenancy rules.

## Planned work, actual work, and Personnel facts

| Truth                                     | Canonical owner                            | Mutation authority                                            | Current projection                                                      |
| ----------------------------------------- | ------------------------------------------ | ------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Planned work                              | Planning, after an exact model is approved | Unresolved; manager control is confirmed only at a high level | No persisted Planning record or outbound projection                     |
| Actual-work evidence                      | Pointage                                   | Dedicated Pointage authority                                  | No Planning write, substitution, or reconciliation                      |
| Employee dossier/current employment facts | Personnel                                  | Authorized Personnel operations                               | No approved Personnel-to-Planning projection and no Planning write-back |
| Administrative draft/workflow evidence    | Formalités                                 | Authorized Formalités operations                              | No Planning integration                                                 |
| Absence record                            | Owner unresolved                           | Approval and mutation unresolved                              | Planning awareness/input need only                                      |
| Payroll fact or result                    | Payroll boundary unresolved                | Not approved                                                  | No Planning relationship                                                |

A planned assignment never proves actual work. Pointage evidence never proves a
planned assignment and must not silently modify Planning. Personnel schema facts,
including current weekly minutes, do not authorize Planning consumption.

## Generation, constraints, and arbitration

Generation, understandable infeasibility explanations, resolution proposals,
and Human-controlled editing are confirmed Product direction. The exact
architecture is unresolved: no deterministic solver, AI generator, AI parser,
priority hierarchy, partial regeneration, or learning system is approved or
implemented. Optimization, equity, and forecasting are illustrative
`PROPOSED_NOT_APPROVED` possibilities under the non-current long-term direction
above; their exact behavior remains unresolved.

YUTA must not silently break a constraint merely to produce a result. The exact
classification of preference, operational hard constraint, verified legal
block, warning, and manager override remains unresolved. Human arbitration is a
Product control; it is not authority to violate a verified non-overridable legal
rule.

Historical Page Chat legal examples are provenance only. This reconciliation
performed no external research and creates no current legal, privacy, or
security conclusion.

## Time, lifecycle, publication, and communication

- Multiple future weeks are confirmed; exact period and week boundaries are
  unresolved.
- Establishment owns the trusted timezone, but Planning timezone consumption,
  storage instants, local display, business date, overnight shifts, daylight
  saving transitions, and cross-week behavior are not approved or implemented.
- Save, publish, republish, unpublish, supersede, cancel, archive, and restore
  transitions are unresolved.
- `Prévisionnel`, `Brouillon`, and `Publié` are proposed labels, not canonical
  states.
- Save does not imply publish. Publish does not imply communication.
  Communication does not imply employee acknowledgment, and acknowledgment does
  not imply legal acceptance.
- No notification, immutable communication evidence, employee acknowledgment,
  change log, previous version, retention, or deletion model is approved.

## Product, implementation, legal/privacy, and readiness

These dimensions remain independent:

- **Product:** the high-level directions above are confirmed; exact V1 and 14
  grouped decisions remain open.
- **Implementation:** only the authenticated placeholder surface and its focused
  regression evidence exist.
- **Executable shape:** no Planning-specific contract, schema, enum, repository,
  action, permission, or API exists.
- **Legal/regulatory:** labor-law-aware intent requires current external review;
  no historical number or rule is current authority.
- **Privacy/security:** constraint and absence sensitivity, visibility,
  retention, auditing, notification data, and employee access remain unresolved.
- **Environment:** `NOT_ENABLED` for Planning.
- **Readiness:** Planning capability `NOT_ASSESSED`; Backoffice overall
  `NOT_READY`.
- **Production authorization:** absent. No deployment or live Planning evidence
  exists.

## Grouped Human decisions required

| ID      | Exact decision                                                                                                                                           | Current evidence and non-inference                                            | Required authority                                                       |
| ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| PLAN-01 | Exact current V1 and Planning domain model: need, shift, assignment, unassigned need, break, recurrence, template, delete/cancel/archive                 | High-level direction only; no assistant-authored entity or state is canonical | Human Product plus architecture/data review                              |
| PLAN-02 | Personnel projection, employee eligibility, employment-state handling, and cross-establishment behavior                                                  | Personnel remains canonical; no projection exists                             | Human Product, Personnel, tenancy, authorization, privacy                |
| PLAN-03 | Multi-poste, availability, and constraint ownership/model, actors, visibility, history, and hard/soft semantics                                          | Broad directions confirmed; exact model absent                                | Human Product, privacy/security, authorization                           |
| PLAN-04 | Absence owner, reasons, approval, mutation, privacy, granularity, and Planning consumption                                                               | Awareness/input need confirmed; owner absent                                  | Human Product, legal/privacy/security, owning capability                 |
| PLAN-05 | Period, timezone, storage, local display, overnight, business date, week, and daylight-saving semantics                                                  | Establishment owns timezone; no Planning contract                             | Human Product, Establishment, architecture/data                          |
| PLAN-06 | Generation architecture and behavior: manual/algorithmic/solver/AI, parsing, priorities, optimization, explanations, proposals, and partial regeneration | Generation direction confirmed; architecture absent                           | Human Product, architecture, privacy/security, legal where applicable    |
| PLAN-07 | Preference/warning/hard-block taxonomy, manager override, and legally non-overridable behavior                                                           | Human arbitration and law-aware direction coexist                             | Human Product plus current external legal review and security/operations |
| PLAN-08 | Draft/save/publication/republish/unpublish/communication/acknowledgment/cancel/archive lifecycle                                                         | Exact states and transitions are proposals                                    | Human Product, legal/privacy, authorization, operations                  |
| PLAN-09 | OWNER/MANAGER/STAFF and employee/self/service/system permissions, visibility, submissions, swaps, and requests                                           | Authenticated shell only; no Planning operation inventory                     | Human Product, authorization, tenancy, privacy/security                  |
| PLAN-10 | Duration, breaks, totals, contract comparison, overtime, cost, and payroll boundary                                                                      | No approved calculations or payroll projection                                | Human Product, Payroll, current external legal/privacy review            |
| PLAN-11 | Any Planning/Pointage projection or planned-versus-actual comparison                                                                                     | Ownership separation is normative; no projection exists                       | Human Product, Planning, Pointage, authorization                         |
| PLAN-12 | Publication/change notifications, channels, contact data, retries, failure, and acknowledgment                                                           | No notification capability approved                                           | Human Product, Notifications, privacy/security, operations               |
| PLAN-13 | Audit, history, versions, immutable communication evidence, retention, deletion, and restore                                                             | No model exists                                                               | Human Product, legal/privacy/security, data/operations                   |
| PLAN-14 | Environment enablement, QA, deployment, monitoring, support, recovery, readiness, and production authorization                                           | Placeholder only; Planning not enabled                                        | Human Product, engineering, security, operations, release authority      |

No coding agent may resolve these packets autonomously.

## Reconciliation accounting and historical safeguards

The counting unit is one grouped material assertion assigned exactly one primary
disposition. Product, implementation, legal/privacy, environment, and readiness
axes are still recorded separately.

| Disposition               | Count | Reconciled groups                                                                                                                                                                                                     |
| ------------------------- | ----: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CONFIRMED`               |    19 | Sixteen high-level Planning directions plus Personnel ownership, planned/actual ownership separation, and Formalités separation                                                                                       |
| `IMPLEMENTED`             |     2 | Authenticated placeholder/navigation surface; trusted shell boundary and focused regression evidence                                                                                                                  |
| `DECIDED_NOT_IMPLEMENTED` |     0 | Confirmed direction is recorded on the Product axis rather than collapsed into an implementation disposition                                                                                                          |
| `PROPOSED`                |    10 | Exact UI areas, multi-poste detail, structured constraint/availability model, solver/AI architecture, states, views/presets, interactions, recurrence/templates, absence detail, and assistant-authored V1 exclusions |
| `UNRESOLVED`              |    14 | `PLAN-01` through `PLAN-14`                                                                                                                                                                                           |
| `CONFLICT`                |     0 | The four apparent tensions reconcile by ownership, maturity, or separate axes                                                                                                                                         |
| `OBSOLETE`                |     1 | Legacy implementation-unknown evidence is superseded by the current placeholder-only repository inventory                                                                                                             |

Total: 46 grouped material assertions.

The two long-term-direction entries above clarify provenance and current-versus-
non-current classification inside the existing grouped assertions. They create
no new capability group or decision packet and do not change this accounting.

Weekly and multi-week planning coexist: week may be a working/display unit
inside a multi-week period. Personnel remains the employee fact owner while
Planning-specific inputs need an approved boundary. Law-aware direction and
Human arbitration coexist only when verified non-overridable law remains a hard
boundary. Absence awareness does not decide canonical Absence ownership. These
are not genuine current authority conflicts.

Do not resurrect proposed exact statuses, solver/AI architecture, recurrence,
notifications, self-service, payroll integration, or legal examples as current
authority. Do not infer Product approval from the placeholder, implementation
from navigation, or readiness from future tests.

## Discovery path and fresh-agent acceptance

A repository-only agent should follow:

1. [`docs/README.md`](../../README.md);
2. [`docs/PRODUCT_KNOWLEDGE.md`](../../PRODUCT_KNOWLEDGE.md);
3. [`docs/MODULE_REGISTRY.md`](../../MODULE_REGISTRY.md);
4. this Planning home;
5. the current route, shared placeholder, authenticated layout, permission
   catalog, and focused regression test linked above;
6. [Personnel Product Knowledge](../personnel/README.md),
   [Pointage Product Knowledge](../pointage/README.md), the
   [Pointage authority specification](../../../openspec/specs/pointage/authority-foundation/spec.md),
   and [Establishment Product Knowledge](../establishment/README.md) for
   boundaries; and
7. [`CURRENT_STATE.md`](../../CURRENT_STATE.md) and
   [`PRODUCTION_READINESS.md`](../../operations/PRODUCTION_READINESS.md).

Without Page Chat history, the legacy extract, the reconciliation or
remediation reports, or the previous acceptance report, the fresh agent
recovered the exact migrated scope, confirmed directions, placeholder-only
implementation, all concept and ownership boundaries, lack of
Personnel/Pointage/Absence/payroll projections, absence of Planning permissions
and persistence, time/legal/privacy/readiness limits, the distinct
pre-generation check and future-impact direction, the non-current
better-assistance aspiration, the proposed-not-approved status of
optimization/equity/forecasting, all 14 decision packets, zero genuine
conflicts, and every explicit non-inference above. The accepted report records
that result; the authority cutover changes only the knowledge-routing role for
this exact scope.
