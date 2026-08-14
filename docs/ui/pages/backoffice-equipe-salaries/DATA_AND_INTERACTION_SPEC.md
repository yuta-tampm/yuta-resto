# Backoffice Équipe — Salariés — Data and Interaction Specification

Status: Real read/create/edit/departure slices implemented for development; production approval pending

Visibility: Engineering

## Runtime and trust boundary

The server validates the Backoffice session and active membership, then resolves
trusted organization and establishment context. Browser state, form fields,
URLs, cookies, roles, permissions, entitlements, and identifiers are never
authorization proof. Employee access fails closed for wrong or missing
scope, suspended/stale membership, or missing personnel authorization.

## Data ownership and transport

The implemented development boundary is:

```text
apps/backoffice server -> approved @yuta/contracts schemas
-> establishment-scoped @yuta/db-cloud repository -> cloud PostgreSQL
```

All employee queries include `organizationId` and `establishmentId`, including
resource-ID lookups. Browser bundles receive no database or trusted scope.

`users` and `tenant_memberships` are login/access records, not employees.
Employee creation must not create login access implicitly, or vice versa.

## Decision and implementation status

Phase 2 mapped the prototype into domain proposals. The approved MVP subset is
now implemented for development: contracts, cloud persistence, migrations,
OWNER-only permissions, tenant-scoped reads/mutations, concurrency,
idempotency receipts, and mutation audit. Production collection remains
blocked by the readiness decisions recorded below.

The former Phase 1 `EmployeeFixture` was discovery evidence only and has been
removed from the integrated route. Current contracts and schema were reconciled
against repository boundaries rather than copied from that fixture.

## Implemented MVP aggregate boundary

The MVP aggregate root is an establishment employee dossier: one operational
employment relationship for one person at one establishment. It owns the
minimum identity snapshot and employment facts needed by this page.

```text
organization
└── establishment
    └── employee dossier
        ├── minimum identity snapshot
        ├── establishment employment relationship
        └── domain event references / audit history
```

This is deliberately not an organization-wide `person`, login user, payroll
worker, POS staff record, document folder, or legal personnel register entry.
The identity snapshot and employment relationship are distinct conceptual
parts of the dossier even if a future approved transaction saves them together.

## MVP data dictionary

This dictionary explains ownership and meaning; executable schema authority
remains `packages/db-cloud/src/schema/personnel.ts`.

| Concept                                   | Classification                       | Proposed source and semantics                                                          | Phase 1 mapping / Phase 3 gate                                               |
| ----------------------------------------- | ------------------------------------ | -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Employee dossier ID                       | Stored                               | Opaque resource ID scoped by trusted organization and establishment                    | Fixture `id`; identifier strategy remains unapproved                         |
| Organization ID                           | Integration-owned                    | Derived from validated session/tenant context and repeated on tenant-owned persistence | Never accepted from fixture/form as trusted scope                            |
| Establishment ID                          | Integration-owned                    | Active establishment from validated membership                                         | Establishment owns the MVP dossier                                           |
| Given names                               | Stored                               | Required minimum identity text after normalization and length validation               | Fixture `givenNames`; exact legal/name rules need approval                   |
| Family name                               | Stored                               | Required minimum identity text after normalization and length validation               | Fixture `familyName`; exact legal/name rules need approval                   |
| Display name / initials                   | Derived                              | Presentation from approved identity fields                                             | `getEmployeeName` and `getEmployeeInitials`; never stored for authority      |
| Poste                                     | Stored proposal                      | Establishment operational job label                                                    | Fixture `position`; controlled vocabulary versus bounded text unresolved     |
| Qualification                             | Stored proposal                      | Employment qualification relevant to the relationship                                  | Fixture `qualification`; vocabulary/legal owner unresolved                   |
| Entry date                                | Stored                               | Required establishment-local calendar date on which the relationship begins            | Fixture `startDate`; date-only canonical representation required             |
| Departure date                            | Stored, nullable                     | Effective final establishment-local date; setting it never deletes the dossier         | Fixture `departureDate`; correction/reopening requires audit                 |
| Expected end date                         | Stored, conditional proposal         | Planned end for a finite relationship, distinct from actual departure                  | Fixture `expectedEndDate`; proposed rules appear in Domain validation        |
| Work-time category                        | Stored proposal                      | Minimum full-time/part-time fact                                                       | Fixture `workSchedule`; exact values and transitions require approval        |
| Contract facts                            | Stored proposal                      | Smallest approved structured facts about the relationship                              | Fixture `contractSummary` is display-only and must not be persisted verbatim |
| Contract summary                          | Derived                              | Localized presentation from approved contract facts                                    | Fixture string only; no enum or legal vocabulary inferred                    |
| Operational status                        | Derived                              | Upcoming, active, or former from entry/departure dates and establishment business date | `getEmployeeView`; no persisted status enum by default                       |
| Completeness issues                       | Derived                              | Stable issue codes plus localized explanations from missing/invalid approved MVP facts | Fixture strings are illustrative; no opaque `isComplete` source of truth     |
| Summary counts                            | Derived                              | Counts over the authorized establishment-scoped result                                 | Fixture count helpers; never organization/global counts                      |
| Audit event ID/type/time                  | Integration-owned                    | Server-created immutable event metadata for create/update/departure/correction         | Fixture `history` strings are illustrative, not authoritative events         |
| Actor user ID                             | Integration-owned                    | Validated session actor stored with mutation audit                                     | Never supplied as trusted form data                                          |
| Created/updated timestamps                | Integration-owned                    | Server/database timestamps; `updatedAt` may be the optimistic concurrency token        | Not represented as authoritative fixture fields                              |
| Search, filters, selected row, detail tab | Transient UI                         | Presentation state only                                                                | Current client state; never persisted as employee facts                      |
| Pending/error/conflict/success state      | Transient request UI                 | One operation lifecycle; success only after committed persistence                      | Prototype simulator only                                                     |
| Formalités/document/provider status       | External/integration-owned, deferred | Owned by its future approved capability and referenced through explicit contracts      | Must not be stored as arbitrary employee fields                              |
| Register order                            | Deferred domain value                | Stable establishment hiring/history order independent of operational sorting           | Requires separate register/legal design                                      |

Excluded: NIR, RIB, documents, health/disciplinary data, remuneration, payroll,
work-authorization files, apprenticeship, interns, and provider/Formalités data.

## Interaction map

| ID   | User/system action                               | Read/write effect                                                                                                         | Required states and recovery                                                                                            | Delivery status             |
| ---- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| I-01 | Enter `/equipe/salaries`                         | Resolve trusted session, membership, organization, establishment, role/permission, then read an establishment-scoped list | Loading; missing scope; forbidden without data disclosure; service error and retry; first-use empty                     | Real read implemented       |
| I-02 | Select active/upcoming/former view               | Re-query only the authorized result by derived status                                                                     | Selected view remains textual; empty-filter result differs from first-use empty                                         | Real read implemented       |
| I-03 | Search or filter completeness                    | Change transient list criteria and re-query; never change domain data                                                     | Reset; no-result state; pending controls disabled                                                                       | Real read implemented       |
| I-04 | Select a row/card                                | Explicitly select a dossier and open its read-only right drawer; no employee mutation                                     | Nothing selected on initial load; selected feedback; wide desktop/full-width mobile drawer; closing clears selection    | Real read implemented       |
| I-05 | Change dossier detail tab                        | Change the transient drawer section                                                                                       | Keyboard/focus state; no route or mutation implication                                                                  | Real read implemented       |
| I-06 | Start employee creation                          | Open progressive minimum-dossier form                                                                                     | Validation preserves values; duplicate candidate warning; cancel has no effect                                          | Implemented for development |
| I-07 | Submit employee creation                         | Atomic creation of one establishment dossier plus audit event                                                             | Pending; idempotent retry; duplicate confirmation if approved; persisted success only after commit; recoverable failure | Implemented for development |
| I-08 | Edit approved identity/employment facts          | Scoped update using expected revision, idempotent retry, and field-group audit                                            | Validation; pending; conflict preserves input and requires current-version reload; committed success                    | Implemented for development |
| I-09 | Record departure                                 | Scoped update of effective departure date plus audit event; never delete                                                  | Confirmation with date/non-deletion copy; validation; conflict; success; correction path                                | Implemented for development |
| I-10 | Correct or clear a scheduled/incorrect departure | Scoped correction with before/after date, bounded reason, revision guard, and immutable audit                             | Reason required; conflict preserves input and requires current-version reload; committed success                        | Implemented for development |
| I-11 | Retry list/read                                  | Repeat safe read under freshly resolved trusted scope                                                                     | Loading then success/empty/error; no stale browser scope reuse                                                          | Implemented                 |
| I-12 | Resolve edit conflict                            | Keep submitted values separately, fetch current record, then user reloads or reapplies intentionally                      | Never silently overwrite; no success until a new guarded commit                                                         | Prototype explanation only  |
| I-13 | View employee history                            | On demand, read at most 50 allowlisted audit events under the full trusted employee scope                                 | Loading; newest first; empty; unavailable and retry; no raw metadata, operation ID, actor ID, or tenant ID              | Real read implemented       |

Operational sorting and filtering never define future personnel-register
ordering. Pagination follows approved repository behavior; the raster
`10 / page` selector has no product authority.

## State transition semantics

```text
read: idle -> loading -> ready | empty | forbidden | unavailable | error
error -> retry -> loading

mutation: editing -> validation-error | pending
pending -> persisted-success | conflict | save-error
conflict -> reload-current | reapply-and-resubmit | cancel
save-error -> retry-with-idempotency | return-to-editing
```

- `empty` means the authorized establishment has no employee dossiers;
- `no results` means authorized dossiers exist but current filters match none;
- `forbidden` reveals no counts, names, identifiers, or existence signal;
- `pending` disables duplicate submissions and destructive navigation from the
  active form;
- `persisted success` is allowed only after the domain write and required audit
  event commit together;
- validation, conflict, and save errors preserve user-entered values;
- retry must not create a second dossier or duplicate audit event.

## Completeness and future actionable-event semantics

MVP completeness is derived from approved minimum fields and returns stable
issue codes, localized explanations, and a supported next action. Avoid a
persisted opaque `isComplete` flag when underlying facts can explain the state.
The first production slice may evaluate identity names, poste, qualification,
entry date, minimum contract facts, work-time category, and conditional
expected end date only after Phase 3 approves the exact rules.

Future actionable events use a separate concept. An event may become visible
only when its wave provides a real employee, issue/event type, relevant date,
urgency where meaningful, and supported resolution. Missing data must not be
silently conflated with an upcoming expiry, contract, or formality event.

## Future Documents interaction proposal

After secure-document approval, an employee dossier may expose a `Documents`
section with only repository-backed view, add/upload, replace, and download
actions. Each action requires server-derived scope and field/action permission.
Failed uploads must remain visible and retryable without pretending success.

Document categories, requirements, expiry dates, and completeness rules are
not defined by the UI or external feedback. OCR suggestions remain untrusted
until user review and normal validation succeed.

## Future Formalités and register interactions

Formalités navigation/status requires a real approved route, authorization,
and data handoff. Salariés supplies reusable structured data; Formalités owns
document-specific rules and generation.

A personnel-register entry point requires an approved route and domain. Its
historical hiring order, former-employee position, register-relevant history,
stagiaire section, retention, and PDF export semantics are independent from
operational list filters, sorting, and pagination.

## Future mutation proposals

1. create minimum employee relationship;
2. list/read by trusted establishment scope;
3. edit approved fields with conflict handling;
4. record departure without deletion;
5. append minimal audit events without sensitive metadata.

No mutation is authorized by this document.

## Multiple-establishment and duplicate semantics

Phase 2 recommends the following boundary for Phase 3 approval:

- each dossier belongs to exactly one organization and establishment;
- the same human working at two establishments has two separate establishment
  dossiers in the MVP;
- no organization-wide global person ID, automatic merge, transfer, or shared
  mutation is introduced;
- a departure at establishment A never changes establishment B;
- transferring someone is modelled as a departure/correction at the source and
  a separately authorized creation at the destination until a later transfer
  capability is approved;
- searching or counting never crosses the active establishment in the MVP.

Duplicate detection is advisory, tenant-scoped, and not identity proof. Before
creation, the server may return candidates from the same establishment using
normalized family/given names plus overlapping or nearby relationship dates.
Names alone must not create a uniqueness constraint or automatic merge. Phase 3
must choose whether an authorized OWNER may confirm “create anyway” and how
that override is audited. NIR, bank data, documents, email, phone, or date of
birth may not be collected merely to improve duplicate matching in this MVP.

## Conflict and idempotency semantics

- list/read responses may expose an opaque revision token derived from a
  server-owned version or `updatedAt`; the exact mechanism remains a persistence decision;
- update and departure commands include the expected revision but never trusted tenant scope;
- the repository update predicate includes organization ID, establishment ID,
  dossier ID, and expected revision;
- zero updated rows are resolved as not-found/forbidden or conflict without
  leaking cross-tenant existence;
- a conflict returns a stable code and current safe-to-read revision, never a
  last-write-wins overwrite;
- create/retry needs a server-validated idempotency key scoped to the actor,
  establishment, and operation;
- audit append and domain mutation commit atomically.

## Departure semantics

- `departureDate` is the actual effective relationship end date, not the
  expected finite-contract end;
- setting a future departure may keep the employee operationally active until
  that establishment-local date; the exact inclusive/exclusive boundary must
  be approved in Phase 3;
- setting a past/current departure moves the dossier to former through derived
  status and does not archive or delete identity/history;
- the confirmation shows employee, establishment, effective date, and explicit
  non-deletion copy;
- correcting or clearing a mistaken departure is a separate audited mutation,
  not history deletion;
- hard deletion is outside MVP; retention/archive/legal-hold behavior remains
  a Phase 3/legal decision.

## Validation proposal

- Zod validates untrusted transport input server-side;
- dates use canonical representation and establishment locale for display;
- departure cannot erase the relationship;
- conditional fields follow an approved domain, not UI guesses;
- validation/conflict/save failures preserve input;
- duplicate candidates never auto-block or auto-merge without an approved
  rule and override audit;
- justified free text is length-bounded.

## States

Loading, empty, forbidden, scope unavailable, validation, conflict, pending,
persisted success, service/database error, retry/recovery, derived employment
status, and actionable completeness. Prototype states must be labelled.

## Authorization proposal

Phase 3 recommends two application permissions following current Backoffice
conventions:

- `personnel.employee.read`;
- `personnel.employee.manage`.

No feature entitlement key is introduced. The repository has no approved
commercial/module decision for Salariés, and an invented entitlement would
create an unsupported product gate. If product later makes the capability
entitled, that is a separate decision and migration.

### Role/action matrix

| Action                                                            | OWNER                       | MANAGER | STAFF | Notes                                                              |
| ----------------------------------------------------------------- | --------------------------- | ------- | ----- | ------------------------------------------------------------------ |
| See Salariés navigation                                           | Allow                       | Hide    | Hide  | Visibility is convenience only; route still enforces authorization |
| List/search/filter/read dossier drawer                            | `personnel.employee.read`   | Deny    | Deny  | Requires active establishment membership and trusted scope         |
| Read minimal history                                              | `personnel.employee.read`   | Deny    | Deny  | Only approved personnel events, not generic auth/provider logs     |
| Create/edit minimum dossier                                       | `personnel.employee.manage` | Deny    | Deny  | Actor and tenant scope are server-derived                          |
| Record/correct departure                                          | `personnel.employee.manage` | Deny    | Deny  | Confirmation and correction reason/audit required                  |
| Confirm duplicate override                                        | `personnel.employee.manage` | Deny    | Deny  | Required bounded reason; never automatic merge                     |
| Hard delete, merge, transfer, documents, Formalités, register/PDF | Deny                        | Deny    | Deny  | Deferred capability or prohibited in MVP                           |

Manager delegation is not represented by the broad `MANAGER` role. A future
personnel-specific delegation model must be approved before manager access.
Service actors and public actors are denied. Navigation filtering never
substitutes for route, query, repository, and mutation authorization.

### Field/action matrix

| Field/concept                                                                        | List                | Quick view                | Create/edit                                        | Departure             | Audit/history                                      |
| ------------------------------------------------------------------------------------ | ------------------- | ------------------------- | -------------------------------------------------- | --------------------- | -------------------------------------------------- |
| Given names, family name                                                             | Read                | Read                      | Write                                              | Read for confirmation | Changed concept plus protected before/after values |
| Poste, qualification                                                                 | Read                | Read                      | Write                                              | Read                  | Changed concept plus protected before/after values |
| Entry date                                                                           | Read                | Read                      | Write with validation                              | Read                  | Before/after values                                |
| Employment term type                                                                 | Derived label       | Read                      | Write `indefinite` or `fixed_term` only            | Read                  | Before/after values                                |
| Expected end date                                                                    | When relevant       | Read                      | Required for `fixed_term`; absent for `indefinite` | Read                  | Before/after values                                |
| Work-time category                                                                   | Read                | Read                      | Write `full_time` or `part_time` only              | Read                  | Before/after values                                |
| Departure date                                                                       | Derived status/date | Read                      | No general edit                                    | Record or correct     | Effective date and correction reason               |
| Organization/establishment, actor, revision, timestamps                              | Never editable      | Safe derived context only | Server-owned                                       | Server-owned          | Server-owned metadata                              |
| NIR, RIB, remuneration, contact/address, birth, documents, medical/disciplinary data | Hidden              | Hidden                    | Denied                                             | Denied                | Denied in MVP                                      |

The two employment term values are operational structured facts for this MVP;
they do not authorize contract generation, motifs, clauses, apprenticeship,
seasonality, probation, working-hours distribution, or legal conclusions.

Security tests later cover allowed OWNER, wrong organization/establishment,
suspended/stale access, MANAGER/STAFF/service/public denial, missing personnel
permission, and resource-ID-only lookup.

## Sensitive data and retention

### Purpose and minimization

Proposed purpose: establishment personnel administration for creating,
finding, updating, and ending the minimum employment relationship. Collection
is limited to the Phase 3 field matrix. No data may be repurposed for payroll,
monitoring, performance scoring, marketing, document generation, or automated
decision-making.

Before production launch, the restaurant/controller must publish the applicable
employee information notice, identify its legal bases and recipients, register
the processing activity, and provide access/rectification workflows. YUTA must
document its processor/security obligations. These controller-specific legal
facts cannot be inferred by UI or schema.

### Active and archive policy proposal

- while the relationship is current or upcoming, the minimum dossier and
  approved audit history remain in the active personnel base;
- after departure, the dossier leaves the active operational list and enters a
  logically or physically separated archive with narrower OWNER-only access;
- archive access is purposeful, logged, and never restored merely to simplify search;
- each field/event receives a retention class tied to a documented purpose,
  legal obligation, or applicable limitation period;
- legal hold suspends scheduled deletion only for identified records and a
  documented matter; releasing the hold resumes the schedule;
- backup copies follow bounded expiry and restoration procedures that reapply
  deletion/hold state;
- no hard-delete UI exists in MVP. Scheduled deletion/anonymization occurs only
  after the approved class expires and no hold applies.

There is no blanket “keep the whole dossier for five years” decision. French
law requires personnel-register mentions to be retained for five years after
the employee or trainee leaves the establishment; this constrains the future
register capability, not every Salariés field, document, or audit payload.

The production retention schedule remains a blocking controller/legal sign-off
because exact archival periods for the professional dossier depend on purpose,
applicable obligation, and limitation period. Phase 4 mutations must not start
in production until a per-class schedule and deletion/archive operational owner
are approved. Development-only mutations already exist and do not satisfy this
production gate.

### Security controls required before persistence

- encryption in transit and provider-managed encryption at rest;
- no employee values in URLs, analytics, client logs, application logs, error
  messages, notification payloads, or generic audit JSON;
- structured allowlisted audit metadata only;
- least-privilege database/service access and secret separation;
- read and mutation authorization rechecked server-side on every operation;
- monitored access logs, backup/restore tests, incident response, and breach handling;
- exports, downloads, uploads, OCR, and documents remain disabled.

## Audit approval proposal

Event semantics proposed for approval:

- `employee.created`;
- `employee.identity_updated`;
- `employee.employment_updated`;
- `employee.departure_recorded`;
- `employee.departure_corrected`;
- `employee.duplicate_override_confirmed`.

Approved sensitive-read events:

- `employee.dossier_viewed` when OWNER opens the selected dossier detail;
- `employee.history_viewed` when OWNER opens/retries the history read.

Sensitive-read events use the same trusted organization, establishment,
employee, actor, operation ID, and server timestamp rules. They are security
audit evidence and are excluded from the employee's business-change timeline.
Repeated delivery with the same operation ID records one access event.

Every event carries a server-created event ID, occurred-at timestamp, trusted
organization and establishment scope, employee dossier ID, actor user ID when
available, and operation/correlation ID. Domain events record only allowlisted
changed concepts and the minimum protected before/after values necessary for
accountability; no full form snapshot, document content, NIR, RIB, free-form
notes, IP address, or user-agent is copied into employee audit metadata.

Departure correction and duplicate override require a short bounded reason.
The mutation and event append are atomic. Audit is append-only to application
users; correction creates a new event and never edits history. OWNER may read
the minimal employee history, while operational/security administrators access
under separate infrastructure controls. Audit retention uses its own approved
retention class rather than inheriting the dossier or register duration.

## Concurrency and idempotency approval proposal

- transport exposes an opaque `revision`; clients do not derive or edit it;
- updates, departure, and correction use compare-and-set with that revision and
  the full trusted tenant predicate;
- conflict returns a stable `CONFLICT` error without cross-tenant existence leakage;
- conflict UI preserves submitted values and lets the user reload current data,
  compare, and intentionally resubmit; there is no automatic last-write-wins;
- create and retry use a UUID idempotency key generated for one form attempt;
- server scope is actor user, organization, establishment, command type, and key;
- same key and same validated payload returns the original committed outcome;
  same key with a different payload returns conflict;
- idempotency receipts persist an `expiresAt` value 24 hours after creation,
  and every personnel mutation first removes expired receipts for its trusted
  organization/establishment scope; replay queries therefore see only active
  receipts after cleanup;
- domain mutation, idempotency outcome, and audit event commit atomically.

## Domain validation approval proposal

- names: trimmed Unicode text, each 1–120 characters; preserve diacritics and
  internal spaces/hyphens; no automatic uppercasing;
- poste and qualification: required bounded text, each 1–120 characters for
  MVP; no inferred repository-wide enum;
- entry, expected-end, and departure values: canonical date-only strings,
  displayed using establishment locale;
- `employmentTermType`: `indefinite` or `fixed_term`;
- expected end is absent for `indefinite` and required on/after entry for
  `fixed_term`;
- `workTimeCategory`: `full_time` or `part_time`; detailed hours/distribution are deferred;
- departure is on/after entry; on the effective departure date the dossier
  remains active through that establishment-local business day and becomes
  former on the following day;
- future departure remains visible in active operations with its scheduled date;
- completeness derives from missing/invalid approved facts using stable codes,
  not a stored boolean;
- duplicate candidates use normalized exact names plus overlapping/current
  relationship dates in the same establishment; OWNER may create anyway only
  with a bounded reason and audit event.

These rules are a proposed MVP domain contract. French localized labels must
not imply broader contract/legal support.

## Cross-tenant and security test matrix

| Case                                                                                     | Expected result                                                |
| ---------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| Active OWNER in matching organization/establishment                                      | Allowed for approved read/manage action                        |
| MANAGER, STAFF, public actor, or service actor                                           | Denied without employee data                                   |
| Missing establishment context                                                            | Fail closed before repository access                           |
| Suspended/stale/removed membership                                                       | Fail closed and recover session/scope                          |
| Browser-supplied organization, establishment, role, permission, actor, or revision scope | Ignored/revalidated; never authorization proof                 |
| Employee ID from another organization or establishment                                   | Indistinguishable not-found/denied response; no existence leak |
| Repository lookup/update by employee ID alone                                            | Test must fail; API forbidden by design                        |
| Correct ID with stale revision                                                           | `CONFLICT`; no mutation or success audit                       |
| Repeated create with same idempotency key/payload                                        | Same committed outcome; one dossier and one audit event        |
| Same idempotency key with different payload                                              | Conflict; no second write                                      |
| Duplicate override without reason                                                        | Validation failure; input preserved                            |
| Departure before entry                                                                   | Validation failure; no mutation                                |
| Audit append failure                                                                     | Whole mutation rolls back                                      |
| Unauthorized list/count/search/history                                                   | No names, counts, identifiers, or existence signal             |

Property/integration tests must generate at least two organizations and two
establishments and cover list, read, create, edit, departure, correction,
duplicate override, audit, conflict, and retry. Navigation tests are additional
UX coverage, not security evidence.

## External compliance references

Reviewed 2026-08-13:

- CNIL, [Les règles pour la gestion du personnel](https://www.cnil.fr/fr/les-regles-pour-la-gestion-du-personnel):
  limited access, traceability, employee information/rights, limited retention,
  and processing-register expectations;
- CNIL, [Référentiel des durées de conservation — gestion des ressources humaines](https://www.cnil.fr/sites/default/files/2026-04/referentiel_durees_de_conservation_gestion_des_ressources_humaines.pdf):
  active versus intermediate archive separation and purpose-specific schedules;
- Légifrance, [Code du travail, article R1221-26](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000031392972):
  five-year retention for personnel-register mentions after departure.

These sources define constraints, not a claim that the current prototype is a
personnel register or legally compliant HR system. Controller/DPO/legal review
remains required before production collection.

## Polling / offline / device behavior

Not applicable. No polling, offline queue, provider, local service, printer,
worker, or hardware owner exists.

## Implemented decision register and production gates

Implemented for the approved development MVP:

1. establishment employee dossier is the transaction/ownership boundary;
2. minimum identity and employment facts save atomically for create;
3. separate dossiers represent the same human across establishments;
4. `OWNER` receives the two personnel permissions; every other actor is denied;
5. no feature entitlement is introduced;
6. exact MVP fields and validation are the Domain validation proposal above;
7. business-date departure semantics use the establishment timezone and become
   former on the day after the effective departure date;
8. duplicate candidates are advisory; OWNER override requires reason and audit;
9. opaque revision and compare-and-set conflict are active; idempotent retry
   records a 24-hour expiry and tenant-scoped mutation entry points remove
   expired receipts before replay evaluation;
10. the six-event mutation-audit taxonomy, atomic append, minimization, and
    OWNER history access are active;
11. active/archive separation, legal hold, deletion, backup, and incident controls
    are required, with a per-class retention schedule before production launch;
12. documents, Formalités, events, register/PDF, apprenticeship, OCR, sensitive
    fields, manager delegation, transfers, merges, and hard delete remain deferred.

Still blocking production deployment/collection:

- controller/DPO/legal sign-off on purpose, legal bases, employee notice,
  recipients, rights workflow, and per-class retention/deletion schedule;
- security owner sign-off on encryption, least privilege, logs, backup/restore,
  incident response, and audit access operations;
- production migration/rollback review and deployment evidence for the already
  implemented schema and executable tests.

## Persistence/contract implementation status

The approved MVP contracts, repositories, schema, local migrations,
authorization, idempotency receipts, and mutation audit are implemented for
development. Sensitive dossier/history reads are audited locally and excluded
from the business-change timeline. Archive/deletion jobs, legal hold, a global
maintenance scheduler for inactive establishments, and production
backup/restore evidence are not implemented or approved. Deferred capability
waves remain proposals and receive separate approval.
