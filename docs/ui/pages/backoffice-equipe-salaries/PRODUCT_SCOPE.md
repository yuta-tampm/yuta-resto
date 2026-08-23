# Backoffice Équipe — Salariés — Product Scope

Status: Read and development create slices implemented; production collection gated

Visibility: Engineering

## User goal

An authorized restaurant owner or personnel manager needs one establishment-
scoped place to maintain the minimum employee and employment-relationship
information required for daily personnel administration.

## Recommended MVP

- minimum legal identity: family name and given names;
- poste and qualification;
- employment start and optional departure date;
- minimal approved contract summary;
- full-time or part-time indicator;
- expected end date when relevant;
- derived upcoming, active, and former views;
- search, practical filters, and explainable completeness;
- manual create/edit and non-destructive departure;
- minimal auditable create, update, and departure events.

Remuneration, bank/social-security data, documents, and legal-generation flows
are excluded. This scope was approved on 2026-08-13 for the typed-fixture
Phase 1 prototype.

## Current approved capabilities

The repository now contains the approved real read-only foundation inside the
authenticated Backoffice shell: OWNER authorization, minimum personnel
contract/schema, tenant-scoped repository, and list/search/filter UI. It is not
evidence that employee writes, audit history, retention operations, or the
deferred capability waves are implemented.

## Product and runtime boundaries

- authenticated cloud Backoffice;
- proposed owner: current establishment using trusted `organizationId` and
  `establishmentId`;
- future persistence owner after approval: server-only `@yuta/db-cloud`;
- POS local users and data are separate and never synchronized;
- Display/public apps have no ownership;
- multiple-establishment person merging/transfers are deferred.

## Users and authorization proposal

- `OWNER`: proposed `personnel.employee.read` and
  `personnel.employee.manage` for the first production slices;
- `MANAGER`: denied; future personnel-specific delegation requires approval;
- `STAFF`: deny;
- public/service actors: deny;
- system roles never bypass active restaurant membership;
- navigation visibility is not authorization;
- no entitlement is introduced without a separate product/module decision.

## Sensitive-data boundary

Before restricted fields enter scope, approve purpose/legal basis, field-level
access, encryption, storage/download behavior, logging, retention, archive
separation, deletion/legal hold, backup/restore, and data-subject workflows.

## Approved change boundary

Phase 1 may create a truthful responsive UI prototype with typed fictional
fixtures inside the current shell. Employee domain/persistence, database,
API/contracts, real mutations, and new permissions remain proposals requiring
separate approval.

On 2026-08-13, the product boundary was also approved for documentation-only
Phase 4 technical preparation. That approval allows the team to describe a
future data model, request flow, delivery order, and tests. It does not allow
database, migration, API, permission, repository, or real-storage code.

## Deferred capabilities

- secure employee documents and optional OCR;
- RIB, NIR, identity/work-authorization documents, remuneration, and payroll;
- contract/amendment generation and Formalités integration;
- DPAE, DSN, signature, government, or provider integration;
- detailed part-time and apprenticeship workflows;
- interns/stagiaires and personnel-register PDF;
- electronic-register compliance claims;
- alerts, bulk import/export, organization-wide HR, transfers/deduplication;
- employee self-service, recruitment, leave, absence, disciplinary, or medical management.

## Future capability waves

Deferred means retained for later discovery and approval, not discarded. The
following intent is recorded without authorizing Phase 1 implementation.

### Wave A — Secure employee documents

Phase 0 for this wave was completed read-only on 2026-08-15. It is a new
capability inside the existing `/equipe/salaries` dossier, so it follows
`NEW_CAPABILITY_DISCOVERY` without creating another page pack or route.

#### Phase 0 MVP — approved for Phase 1 prototype only

The smallest useful release is an OWNER-only `Documents` dossier tab for the
selected establishment. It may provide only these repository-backed actions:

- list the employee's documents and their safe metadata;
- upload one file into an approved document category;
- open or download an available file after a fresh server authorization check;
- replace a file without silently overwriting its history;
- show upload, security-processing, available, rejected, and unavailable states;
- record every sensitive document access and mutation as an allowlisted event.

The MVP does not decide that every commonly collected HR document is justified.
Before a category is enabled, the controller/product owner must approve its
purpose, required/optional status, recipients, expiry semantics, and retention
class. Candidate groups for later category-by-category approval are employment
or contract supporting documents and identity/residence/work-authorization
evidence where applicable. RIB, NIR/social-security data, medical or
disciplinary files, remuneration/payroll material, and unrestricted free-form
attachments are not part of this MVP proposal.

#### Users and authorization proposal

- `OWNER`: list, view/download, upload, and replace within the current trusted
  establishment scope;
- `MANAGER`: denied until a personnel-specific delegation decision exists;
- `STAFF`, employee self-service, public actors, service actors, and YUTA system
  roles without an active restaurant membership: denied;
- navigation and hidden controls never replace server authorization;
- no new entitlement is proposed.

#### Ownership and runtime boundary

- each document belongs to one establishment-owned employee dossier and carries
  both trusted `organizationId` and `establishmentId` scope;
- the same person employed in another establishment has a separate dossier and
  separate documents; there is no organization-wide file library, transfer, or
  automatic sharing;
- metadata would remain server-owned cloud data behind `@yuta/db-cloud` after a
  later approval;
- binary files require a new private cloud object-storage boundary selected and
  approved in a later technical phase; the local Display upload directory is a
  separate runtime and cannot be reused;
- no permanent public file URL or browser-trusted storage key is permitted.

#### Sensitive-data boundary

Every employee document is confidential personal data. Identity,
residence/work-authorization, bank, social-security, medical, disciplinary,
payroll, and signed contractual material require progressively narrower,
purpose-specific handling. File content, original filenames, storage keys, and
document values must not enter URLs, analytics, generic application logs, error
messages, or unrestricted audit metadata.

The controller/DPO or legal owner must approve the information notice,
recipients, rights workflow, and a per-category active/archive/deletion schedule.
The security owner must approve private storage, encryption, key and secret
separation, malware quarantine, short-lived authorized delivery, audit access,
backup/restore, incident response, and provider responsibilities before real
files are collected.

#### Explicitly deferred from this wave

- OCR, extraction, automatic field population, classification, and AI analysis;
- camera-specific scanning, cropping, image enhancement, or document capture;
- electronic signature, contract generation, Formalités, DPAE/DSN, or provider
  and government integrations;
- document deletion, archive administration, legal hold, rights-request tools,
  and employee self-service;
- bulk import/export, ZIP download, public/share links, email delivery, and
  cross-establishment transfer or sharing;
- expiry/missing-document alerts until category requirements, dates, and a real
  resolving action are approved;
- manager delegation and document-specific permissions beyond the OWNER-only MVP.

OCR remains optional in a later wave. Any extracted value must be reviewed and
validated before it can become authoritative employee data.

#### Phase 2 technical boundary — proposal awaiting decisions

Phase 2 technical design was authorized on 2026-08-15 without implementation
authority. The recommended first real slice, after all approvals, is narrower
than the full visual prototype:

- one product-approved category, `Contrat de travail signé`, pending
  legal/privacy approval and never a generic attachment bucket;
- OWNER-only list, add, view/download, and explicit replace;
- PDF only, up to the product-approved proposed 10 MiB limit;
- one current document per category with failure-safe version replacement;
- private object storage separate from Neon/PostgreSQL, with quarantine and
  verified processing before availability;
- separate future document read/manage permissions and allowlisted personnel
  document audit events;
- no deletion, archive administration, OCR, alerts, sharing, export, manager
  access, employee self-service, or cross-establishment reuse.

The product owner selected the signed employment contract as the first category
and PDF up to 10 MiB as its initial file boundary on 2026-08-15. A signed
contract amendment is a separate future category, not a replacement version of
the contract. The category still requires legal/privacy approval, and absence
must not make a dossier incomplete when a written contract is not applicable.
Exact retention, provider, scanning service, delivery method, backup/restore
responsibility, incident owner, and rights/deletion operation remain decisions.
Phase 2 records these choices but does not implement them. Scaleway Paris is the
provisional engineering preference, with OVHcloud EU, AWS S3 Paris, and
Cloudflare R2 EU retained as alternatives. Storage and malware scanning remain
separate replaceable services.

The product owner approved this Phase 0 boundary, design direction, and the
typed-fixture Phase 1 prototype on 2026-08-15. This authorizes presentation
discovery only; it does not authorize real implementation, category collection,
storage, or production use.

#### Phase 3 local implementation boundary

On 2026-08-15 the product owner separately authorized a local-only real vertical
slice. It implements OWNER-only list, add, replace, view, and download for the
signed employment contract, PDF only up to 10 MiB. Metadata belongs to the
organization + establishment + employee dossier in `@yuta/db-cloud`; binary
content remains outside PostgreSQL behind a private storage service. The local
adapter quarantines content and requires Microsoft Defender to accept it before
metadata is committed and the file is available.

Production use is explicitly blocked. No external storage/scanner provider,
retention/deletion schedule, backup/restore process, legal/privacy sign-off, or
incident owner is inferred from the local implementation. Signed amendments,
work authorization, identity, bank, medical, payroll, free-form documents, OCR,
sharing, manager access, and employee self-service remain outside this slice.

### Documents Wave B — Signed contract amendments

Phase 0 for this wave was completed read-only on 2026-08-15. The containing
Documents tab is integrated locally, but a signed amendment is not an existing
category, contract value, schema value, repository behavior, action, or UI row.
This flow therefore follows `NEW_CAPABILITY_DISCOVERY` inside the stable
`backoffice-equipe-salaries` page pack.

#### Phase 0 local MVP — approved for design discovery only

The smallest useful local discovery scope is OWNER-only and establishment-owned:

- list zero or more signed amendments separately from the signed employment
  contract;
- add one signed amendment PDF to the selected employee dossier;
- view or download an available amendment after fresh server authorization;
- replace a mistaken scan of the same amendment without treating a later legal
  amendment as a replacement version;
- show safe loading, empty, uploading, security-processing, available,
  rejected, conflict, unavailable, success, and retry states;
- record the same class of allowlisted sensitive document access/mutation events
  as the implemented contract flow.

An amendment is a distinct contractual document. It never overwrites or
silently changes the base signed contract. Multiple amendments may coexist and
their ordering must be understandable. Phase 0 recommends an amendment display
label and an effective date for design discovery, but whether effective date,
signature date, amendment number, or another identifier is mandatory remains a
product/legal decision. The UI must not infer structured employment changes
from the PDF.

#### Users, ownership, and sensitive data

- `OWNER`: proposed list/add/view/download/replace within the active trusted
  organization + establishment + employee scope;
- `MANAGER`, `STAFF`, employee self-service, public and service actors: denied;
- reuse the existing document-specific server permissions only after a later
  technical approval confirms they cover this category;
- each amendment belongs to exactly one establishment-owned employee dossier;
  no organization-wide library, transfer, or cross-establishment sharing;
- PDF bytes remain confidential personal data outside Neon/PostgreSQL behind
  the current replaceable private-storage/scanner services for local work;
- filenames, content, storage keys, checksums, dates, and document meaning must
  not enter URLs, analytics, generic logs, or unrestricted audit metadata.

#### Explicitly deferred from Documents Wave B

- production provider selection and deployment;
- generating or editing an amendment, clause templates, electronic signature,
  email delivery, Formalités, DPAE/DSN, or government/provider integration;
- OCR, classification, extracted-field suggestions, or automatic employee
  record updates from PDF content;
- amendment expiry/missing alerts or dossier completeness rules;
- delete/archive/legal hold, rights administration, bulk import/export, ZIP,
  public/share links, manager delegation, or employee self-service;
- other document categories, remuneration/payroll, bank, social-security,
  medical, disciplinary, identity, or work-authorization files.

The Phase 0 design scope may reuse the existing PDF-only 10 MiB local file
boundary as a proposal, not as implementation authority. It may explore a
separate `Avenants signés` section and `Ajouter un avenant` action inside the
current Documents tab. It must stop before schema, migration, enum, contract,
repository, permission, server action, storage, or runtime code.

The product owner approved this Phase 0 boundary, generated visual direction,
and a typed-fixture local Phase 1 prototype on 2026-08-15. Phase 1 may show only
fictional amendments with a persistent demonstration notice and disabled
actions. It does not authorize contracts, persistence, storage, or real file
behavior.

#### Phase 1 presentation boundary

- two fictional amendment examples may demonstrate the approved responsive
  hierarchy;
- filenames must visibly identify themselves as examples and contain no real
  employee data;
- `Ajouter un avenant`, `Consulter`, `Télécharger`, and `Remplacer` remain
  disabled and make no request;
- the proposed effective date is labelled as proposed and is not a stored or
  validated business field;
- no amendment ID, URL, storage key, tenant value, transport schema, or server
  action is introduced.

#### Phase 2 technical boundary — proposal awaiting approval

Phase 2 was authorized on 2026-08-15 for documentation only. Repository reality
rules out treating amendments as another single document-category slot: the
implemented contract aggregate is unique by employee and category, while one
employee may have several distinct amendments. The recommended later design is
therefore a separate establishment-owned amendment aggregate with immutable file
versions. It may reuse the existing storage, scanner, permission, audit,
idempotency, and server-delivery patterns without changing the signed-contract
record.

The recommended minimum product model is:

- one opaque server-owned amendment identity per distinct legal amendment;
- one required effective date used for display and deterministic ordering;
- an optional bounded amendment reference copied from the document when one is
  present, never invented or inferred from the filename;
- no free-form title, signature date, applicability period, extracted clause,
  or automatic employee-field update in the local MVP;
- newest effective date first, with server creation time and opaque identity as
  stable tie-breakers; return at most ten items per cursor page;
- a correction upload creates a new immutable version of the same amendment;
  a later legal amendment always creates a new amendment identity.

The effective date is presentation metadata only in this wave. It does not
change employment status, contract dates, salary, working time, completeness,
or any Formalités rule. The proposed category code
`signed_employment_contract_amendment` is an allowlisted domain/audit label, not
approval to extend the current PostgreSQL enum.

The recommendation is to reuse `personnel.document.read` and
`personnel.document.manage`, which are already OWNER-only, instead of adding
equivalent amendment permissions. Every request still reauthorizes against the
trusted organization + establishment + employee dossier. Storage remains PDF
only, 10 MiB maximum, private, provider-neutral, quarantined, scanned, and
server-mediated with no stable or public URL.

The product owner must approve or revise the effective-date/reference model,
ten-item ordering, separate aggregate, permission reuse, audit behavior, and
local-only delivery boundary before Phase 3 implementation. Exact retention,
deletion, legal hold, employee-rights handling, production storage/scanning,
backup/restore, monitoring, and incident ownership remain production blockers.

#### Phase 3 local implementation status

AB2-01 through AB2-09 and local implementation were approved on 2026-08-15.
The delivered slice follows the Phase 2 boundary:

- each amendment is a separate establishment-owned aggregate and never changes
  the base signed-contract record;
- effective date is required, a bounded reference is optional, and no PDF field
  is extracted into employee data;
- list order is newest effective date first with ten-item cursor pages;
- add and replace are OWNER-only, retry-safe, revision-protected, audited, and
  scanned before metadata commit/current-version swap;
- view/download reauthorize through the Backoffice server and expose no stable
  storage URL;
- the existing provider-neutral local storage and Microsoft Defender scanner
  remain the only runtime implementation.

The Phase 1 fixture and demonstration notice are removed. AB2-10 and production
storage/scanning, retention, rights, deletion, backup/restore, monitoring, and
incident ownership remain blocked and unimplemented.

### Wave C — Extended employment and Formalités reuse

Wave C starts in read-only Phase 0 under `NEW_CAPABILITY_DISCOVERY`. The
containing Salaries page is integrated, but the complementary employment facts
and Formalités domain do not exist. This phase changes documentation only and
does not authorize a schema, migration, contract, API, permission, repository,
server action, fixture, or runtime implementation.

#### Proposed smallest useful MVP

The primary user remains an OWNER working in the active establishment. The MVP
would extend the existing `Relation de travail` tab of one employee dossier;
it would not create a route, a second employee record, or an HR hub. It explores
only two complementary structured facts:

1. a controlled fixed-term-contract reason, applicable only to CDD;
2. the contractual weekly duration, displayed as hours per week and proposed
   for later storage as integer minutes rather than floating-point hours.

The existing employment term, expected end date, work-time category, entry
date, departure date, and revision remain authoritative. The proposed fields
must not be inferred from a filename, signed PDF, schedule, time-tracking
record, or Formalités document.

#### Product boundary

- Salariés owns reusable, establishment-scoped structured employment facts.
- A future Formalités capability owns formality-specific requirements, legal
  validation, templates, clauses, generation, submission/status, and lifecycle.
- Documents owns signed evidence and immutable file versions; it does not
  extract or silently apply employee facts.
- Planning owns planned schedules and Pointage owns observed time. Neither is
  the source of contractual weekly duration.
- Payroll, remuneration calculation, payment, declarations, and accounting are
  outside the Salaries capability.

Each dossier remains owned by one organization and one establishment. The same
human at two establishments remains two dossiers unless a separately approved
transfer/merge capability is designed. OWNER is the only proposed actor;
MANAGER, STAFF, employee self-service, public users, and service actors are
denied. No new permission is approved in Phase 0. Any later implementation must
reassess whether the existing OWNER-only employee permissions are sufficient,
especially before adding a more sensitive field.

#### Sensitive data and deferred capability

CDD reason and contracted duration are confidential employment facts.
Remuneration, probation, and apprenticeship data are more sensitive and are
not part of this MVP. Generic logs, URLs, analytics, and audit metadata must
never expose old/new values for future sensitive fields. A later audit may name
an allowlisted field group without copying the value.

Explicitly deferred:

- contractual remuneration, payroll, bank, tax, or social-security data;
- probation periods, renewals, and legal eligibility rules;
- detailed part-time distribution or schedule generation;
- apprenticeship-specific data and workflows;
- Formalités status, templates, clauses, generation, e-signature, DPAE/DSN,
  provider, government submission, and external delivery;
- missing-data alerts and dated events, retained for Wave D;
- personnel register and PDF export, retained for Wave E;
- OCR, extraction, classification, and automatic employee-field updates;
- manager delegation, employee self-service, cross-establishment transfer,
  dossier merge, or global-person identity;
- production retention, deletion, legal, privacy, security, and operational
  approvals.

The design prompt may show a neutral explanation that Formalités is not yet
available, but it must not show a link, status, generated form, or actionable
workflow. The product owner approved this Phase 0 boundary, generated visual
direction, and a local Phase 1 prototype on 2026-08-16. The prototype is an
explicitly fictional, read-only presentation and does not authorize real data
or later implementation work.

#### Phase 2 proposed boundary

Phase 2 keeps the two-field MVP but narrows real-data support. A later first
slice may support only employee replacement, temporary activity increase,
seasonal employment, and customary-use CDD. Unsupported or special legal cases
must fail closed; no free-text `other` is allowed. Contractual weekly duration
is represented as integer minutes and does not alter full-/part-time category,
Planning, Pointage, or payroll.

Existing dossiers may remain unfilled during rollout, and these fields do not
change current dossier completeness initially. WC2-01 through WC2-12 were
approved for local Phase 3 on 2026-08-16. The existing OWNER edit flow,
employee aggregate, permissions, revision/idempotency protection, and minimized
audit are now reused locally. Production use remains separately gated.

### Wave D — Actionable issues and events

Status: `PHASE 3 LOCAL REAL DATA IMPLEMENTED — PRODUCTION NOT AUTHORIZED`

Wave D is `NEW_CAPABILITY_DISCOVERY` for a new `À traiter` surface inside the
already integrated `/equipe/salaries` page. It stays in this stable page pack
and does not create another route, dashboard, tab, or navigation item.

#### User and job

The primary user is the `OWNER` of the active establishment. The job is to see
which currently supported employee-dossier actions need attention without
opening every dossier. MANAGER, STAFF, employees, public users, and service
actors remain denied.

#### Proposed smallest MVP

`À traiter` is a derived, current overview, not a persisted task system. It may
show only these three item kinds:

1. an active or upcoming employee dossier is missing one or more currently
   approved minimum fields; resolving action: open the existing edit flow;
2. an active or upcoming employee has no available signed base employment
   contract; resolving action: open the existing `Documents` flow to add it;
3. an active employee has a recorded departure date from today through the
   next five establishment-local calendar days; action: open the dossier and
   the existing departure review/correction flow.

The first two are issues to correct. The third is a dated event to review and
must not be presented as an error. Missing signed evidence remains separate
from current dossier completeness. A missing amendment is not actionable
because no rule requires every employee to have an amendment.

Each item identifies the employee, uses a safe issue/event label, shows a date
only when relevant, and offers only an action already supported by the page.
The surface is absent or reduced to a compact neutral state when there is
nothing to handle. It must not become a fourth metric card.

#### Product and ownership boundary

- Salariés owns the derived overview and employee-dossier completeness.
- Documents owns signed-contract availability and the existing protected add
  flow; `À traiter` never reads or displays file bytes, filenames, versions, or
  storage details.
- Departure dates remain employee-dossier facts. The existing five-day rule
  uses the establishment business date and does not schedule a notification.
- Formalités, Planning, Pointage, payroll, and external providers do not feed
  this Phase 0 MVP.
- Every item remains owned by organization + establishment + employee dossier.
  No organization-wide or cross-establishment employee view is proposed.

The overview should be computed from authoritative current records rather than
copied into a new task table. Correcting the source record makes the derived
item disappear on the next authorized read. Phase 0 approves no persistence,
acknowledgement state, or background worker.

#### Sensitive data

Employee names, missing field groups, contract-presence status, and departure
dates are confidential employment information. The browser must not receive
another organization or establishment scope. UI, logs, analytics, URLs, and
audit metadata must not include document names, storage keys, CDD reasons,
weekly duration values, or old/new field values.

Viewing a multi-employee action overview is a sensitive read. A later technical
phase must approve one bounded, deduplicated overview-access event or another
appropriate security-log owner. Phase 0 explicitly rejects one audit event per
visible item because that would create noisy duplicate employee history.

#### Explicitly deferred

- persistent tasks, assignment, owner, status, comments, completion,
  acknowledgement, dismiss, snooze, manual priority, or bulk actions;
- email, SMS, push, browser notification, calendar entry, polling, scheduled
  job, outbox, or external reminder provider;
- CDD expected-end alerts until the meaning, threshold, and supported resolving
  action are approved; expected end must not be treated as recorded departure;
- document expiry, amendment requirements, document-category rules, OCR, or
  automatic extraction;
- Formalités status/deadlines, DPAE/DSN, generated documents, signature,
  government submission, or provider status;
- probation, training, medical, disciplinary, payroll, remuneration,
  time-tracking, schedule, or register/PDF alerts;
- MANAGER delegation, employee self-service, cross-establishment overview,
  global person, transfer, or merge;
- new schema, task/notification table, public API, or new permission; the
  approved local contract, repository, server actions, and minimized audit
  event are limited to the Phase 3 implementation;
- production rollout before the existing personnel/document legal, privacy,
  retention, security, provider, and operations gates are closed.

#### Phase 0 approval register

| ID     | Proposed decision                                                                  | Status                       |
| ------ | ---------------------------------------------------------------------------------- | ---------------------------- |
| WD0-01 | Keep `À traiter` inside `/equipe/salaries`; no new route, tab, navigation, or KPI  | Approved for local prototype |
| WD0-02 | Treat it as a derived overview, not persisted task management                      | Approved for local prototype |
| WD0-03 | Limit MVP to incomplete dossier, missing signed base contract, and 5-day departure | Approved for local prototype |
| WD0-04 | Reuse only supported edit, document-add, and departure-review entry points         | Approved for local prototype |
| WD0-05 | Keep OWNER-only organization + establishment + employee scope                      | Approved for local prototype |
| WD0-06 | Require later approval for one minimized overview-access audit strategy            | Approved for local prototype |
| WD0-07 | Defer CDD expiry, Formalités, reminders, tasks, assignment, and bulk behavior      | Approved for local prototype |
| WD0-08 | Keep local discovery separate from production authorization                        | Approved for local prototype |

#### Phase 3 local implementation status

The product owner approved WD2-01 through WD2-12 and local real-data Phase 3 on
2026-08-17. The development-only surface now uses bounded derived reads,
five-item group pages, neutral ordering, fresh server-authorized action
targets, truthful partial failure, source refresh, existing OWNER permissions,
and one minimized cross-employee overview audit event. No task persistence or
background delivery exists. Production delivery remains unauthorized.

### Wave E — Personnel register and PDF export

Status: `PHASE 0 READY FOR PRODUCT REVIEW — DESIGN PROMPT NOT AUTHORIZED`

Wave E is `NEW_CAPABILITY_DISCOVERY` for an establishment-wide register flow.
The containing Salariés page is integrated, but the repository has no personnel-
register aggregate, immutable hiring order, complete legally required field set,
stagiaire/service-civique records, register retention process, or PDF generator.

#### User and job

The first user is the `OWNER` of the active establishment. The job is to review
the establishment's ordered personnel register, understand which required
information is missing, and download a protected PDF representation when the
structured source is ready. MANAGER, STAFF, employees, public users, and service
actors remain denied in the proposed first slice.

#### Proposed smallest MVP

1. Add a secondary `Registre du personnel` entry point from Salariés to a
   proposed dedicated route, `/equipe/registre-personnel`. This route and a
   dedicated page pack are proposals, not implementation authority.
2. Show one read-only register for the active establishment in stable hiring or
   arrival order. Former people retained by the approved rule remain visible.
3. Keep salariés and the legally separate stagiaire/service-civique part
   distinguishable. Phase 0 does not pretend the absent stagiaire domain exists.
4. Show a truthful readiness summary when current records cannot supply all
   required register mentions. No compliance badge is permitted.
5. Offer a server-authorized PDF export only as a representation of the same
   structured register. The PDF is not the source of truth, is not stored by
   default, and never receives a public or stable URL.

The preferred one-person-per-page PDF remains a presentation proposal. Product
and legal review must decide whether it preserves the required order,
readability, completeness, and inspection use before implementation.

#### Repository reconciliation

The current employee dossier can supply names, position, qualification, entry
and departure dates, CDD status, and part-time status. It does not store all
mentions listed by current French rules, including nationality, birth date,
sex, conditional hiring/dismissal authorization, work-authorization title,
temporary-work company, employer-group information, apprenticeship or
professionalization status, and the separate stagiaire details. Current mutable
rows and the bounded employee history also do not prove an indelible register or
reconstruct every dated state.

The applicable official sources reviewed on 2026-08-17 are:

- [Code du travail L1221-13 to L1221-15-1](https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006072050/LEGISCTA000006195588/2026-05-18),
  including establishment ownership, hiring/arrival order, indelible entries,
  the separate stagiaire/service-civique part, and authorized inspection/CSE access;
- [Code du travail D1221-23 to D1221-27](https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006072050/LEGISCTA000018482871/2026-05-08/),
  including conditional fields, event timing, annexes, and five-year retention
  after departure;
- [Code du travail D8113-2](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000018520854),
  requiring a substitute support to remain understandable, presentable, and
  protected against alteration;
- [CNIL personnel-management guidance](https://www.cnil.fr/fr/les-regles-pour-la-gestion-du-personnel)
  and its [2026 retention reference](https://cnil.fr/fr/referentiel-durees-conservation-donnees-rh)
  for access control, logging, information/rights handling, and retention governance.

These sources inform discovery only. YUTA does not claim legal compliance.
`D8113-3` still contains legacy declaration wording while current CNIL guidance
states that this processing is no longer declared to CNIL under the former
regime; legal/DPO review must resolve the operational requirement before any
electronic-register claim.

#### Ownership and authorization proposal

- the register belongs to one organization and one establishment; every future
  lookup repeats both trusted identifiers and never authorizes by person ID alone;
- employee, stagiaire, and service-civique records are not login users or POS staff;
- a later technical phase should approve distinct
  `personnel.register.read` and `personnel.register.export` permissions, initially
  assigned only to OWNER, instead of assuming employee-list access authorizes a
  cross-person export;
- CSE and inspection access does not create a YUTA public link or external user
  account in the MVP; the OWNER remains responsible for presenting the register;
- multi-establishment work, transfer, duplicate/global-person identity, and
  organization-wide registers remain separate decisions.

#### Sensitive data and controls

The register combines confidential personal and employment information across
multiple people. Birth date, nationality, sex, work-authorization references,
employer relationships, tutor identity, dates, and the PDF must not enter URLs,
analytics, generic logs, browser storage, or unrestricted audit metadata.

A later read/export must be logged as one minimized register access event with
actor, establishment, action, and time, never the exported field values or PDF
content. Retention, correction without erasing prior facts, legal hold,
information/rights handling, backup/restore, incident response, and operational
ownership require explicit approval before real collection or production use.

#### Explicitly deferred

- schema, migration, register ledger/snapshots, contracts, repository, route,
  permission, audit event, PDF generator, storage, and production behavior;
- creation or editing from the register, destructive correction, bulk import,
  organization-wide export, public/share links, scheduled export, and email;
- stagiaire/service-civique management beyond its truthful separate placeholder;
- work-permit annex storage, detached-worker annexes, CSE/inspection portal,
  e-signature, certification, timestamp authority, or compliance attestation;
- DPAE/DSN, Formalités, payroll, Planning, Pointage, providers, and government submission;
- OCR, document extraction, AI suggestions, and automatic employee updates,
  retained for the separately reviewed Wave F;
- production delivery before product, legal/DPO, privacy, retention, security,
  backup/restore, and operations gates are approved.

#### Phase 0 approval register

| ID     | Proposed decision                                                                               | Status              |
| ------ | ----------------------------------------------------------------------------------------------- | ------------------- |
| WE0-01 | Use proposed dedicated route `/equipe/registre-personnel`, entered from Salariés                | Approved for design |
| WE0-02 | Keep one establishment-owned register in stable hiring/arrival order                            | Approved for design |
| WE0-03 | Keep salariés and the separate stagiaire/service-civique part distinct                          | Approved for design |
| WE0-04 | Treat structured register data as source of truth; PDF is a protected representation only       | Approved for design |
| WE0-05 | Show missing required information truthfully and make no compliance claim                       | Approved for design |
| WE0-06 | Start OWNER-only and propose separate register read/export permissions for later approval       | Approved for design |
| WE0-07 | Require reconstructable, non-destructive history and five-year post-departure retention review  | Approved for design |
| WE0-08 | Log minimized register reads/exports without field values or PDF content                        | Approved for design |
| WE0-09 | Keep CSE/inspection presentation server-mediated; no public link or external account in the MVP | Approved for design |
| WE0-10 | Defer OCR/AI to Wave F and all production/legal/provider expansion to separate gates            | Approved for design |

## Relationships

Formalités, Planning, Pointage, and other Équipe routes remain planned surfaces.
Future Formalités should consume approved employee data rather than duplicate
it. `Utilisateurs & accès` manages login identities and memberships, not employees.

## Wave F Phase 0 — document extraction and reviewed suggestions

Status: `PHASE 0 APPROVED — DESIGN PROMPT EXECUTED; DRAFT VISUAL REVIEW PENDING`.

### Repository reality and classification

Wave F is `NEW_CAPABILITY_DISCOVERY` inside the existing integrated
`/equipe/salaries` employee drawer and Documents tab. The repository currently
has an OWNER-only, organization + establishment + employee scoped document
flow for signed base contracts and amendments. PDF files are kept outside
PostgreSQL, quarantined, checked by Microsoft Defender, and delivered only
through the Backoffice server. There is no OCR library, AI SDK, AI provider,
extraction contract, suggestion store, extraction permission, extraction audit,
or automatic employee update.

The external functional pack treats OCR as optional and explicitly forbids
faking it when no approved capability exists. Repository behavior and the
current secure-document boundary remain authoritative.

### Recommended MVP

The first MVP analyses only the current, security-verified signed base
employment contract of an employee who already exists. It may propose changes
to the existing employment fields, but never writes them automatically. The
OWNER compares the current value, detected value, confidence, and source page,
then accepts or rejects each suggestion. A later approved apply action must
reuse the existing employee validation, expected revision, idempotency, and
minimized changed-field audit.

The MVP does not start employee creation from a file. The current document
aggregate requires an existing employee ID; a file-first creation flow would
need separately designed temporary ownership, expiry, cleanup, duplicate
handling, and recovery. It also does not analyse amendments in the first slice:
multiple amendment versions and effective-date precedence require a separate
decision.

### Product boundary, user, and ownership

- audience: OWNER only; no MANAGER, STAFF, employee self-service, public, or service actor;
- ownership: trusted organization + active establishment + employee + exact document/version;
- entry point: the current Documents tab in the employee drawer; no new route,
  sidebar item, chatbot, or organization-wide extraction queue;
- source: the verified private PDF bytes; filename, employee names, browser
  scope, or AI output never authorize a read or write;
- destination: suggestions are untrusted review material; the employee dossier
  remains authoritative only after the normal server mutation succeeds;
- register boundary: no accepted suggestion silently rewrites an existing
  personnel-register inscription or its append-only history.

### Sensitive-data boundary

Employment contracts may contain names, addresses, signatures, remuneration,
bank/tax/social identifiers, health or union information, and unrelated clauses.
Even when only employment fields are requested, a remote provider could receive
the complete PDF. Production or real-file provider use therefore requires an
approved provider, EU processing/residency decision, DPA, training/retention
terms, access controls, incident handling, deletion, observability, cost limits,
and legal/DPO/privacy/security review.

Document text is untrusted input, including instructions embedded in a PDF. It
must never change prompts, invoke tools, follow links, select a tenant, authorize
an action, or bypass allowlisted schemas and employee-domain validation.

### Explicitly deferred

- AI/OCR service, SDK, provider account, API key, prompt, model, extraction
  contract, schema, migration, repository, job, route, server action, and real
  extraction behavior;
- real PDF transmission, persistent OCR text, raw model response, embeddings,
  vector store, training corpus, analytics payload, or browser storage;
- file-first employee creation, identity documents, passports, work permits,
  medical/bank/payroll files, images/camera capture, free-form document types;
- amendment extraction, cross-document reconciliation, register updates,
  Formalités, DPAE/DSN, payroll, Planning, Pointage, and legal calculations;
- automatic acceptance, automatic save, bulk processing, background queue,
  scheduled retry, notifications, chatbot, document generation, and e-signature;
- production until provider, privacy, security, retention/deletion,
  backup/restore, incident, cost, and operations gates are approved.

### Phase 0 decision register

| ID     | Recommended decision                                                                                                      | Status              |
| ------ | ------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| WF0-01 | Start with one verified signed base contract for one existing employee                                                    | Approved for design |
| WF0-02 | Keep the first audience OWNER-only and use trusted organization + establishment + employee + document-version scope       | Approved for design |
| WF0-03 | Run extraction only after the existing quarantine and security scan has succeeded                                         | Approved for design |
| WF0-04 | Introduce a server-only provider-neutral extraction interface later; do not couple UI/domain logic to one AI vendor       | Approved for design |
| WF0-05 | Suggest only existing allowlisted employment fields; exclude identity, departure, remuneration, payroll, and unknown data | Approved for design |
| WF0-06 | Show current/detected values, confidence, source page, and explicit per-field accept/reject                               | Approved for design |
| WF0-07 | Never auto-save; a later apply action reuses employee revision/idempotency/validation and changed-field audit             | Approved for design |
| WF0-08 | Keep raw PDF text/model response transient by default and never put values or snippets in generic logs/audit              | Approved for design |
| WF0-09 | Propose distinct OWNER-only extraction permission and minimized requested/completed/applied audit events in Phase 2       | Approved for design |
| WF0-10 | Make Phase 1 a typed-fixture UI prototype with no file read, OCR, AI call, provider, or persistence                       | Approved for design |
| WF0-11 | Defer new-employee file-first, amendments, identity/work-permit documents, multi-file merge, and chatbot                  | Approved for design |
| WF0-12 | Keep every real-file provider and production use behind legal/DPO/privacy/security/provider/operations approval           | Approved for design |

### Wave F Phase 1 approved boundary

Status: `LOCAL TYPED-FIXTURE PROTOTYPE IMPLEMENTED — REAL EXTRACTION BLOCKED`.

The approved Phase 1 slice adds a development-only presentation prototype to
the existing signed base-contract card. Its three typed suggestions are
fictional, choices remain browser-local, and the apply action is disabled. It
does not read or transmit a PDF, call OCR/AI, expose an extraction endpoint,
persist a result, mutate an employee, analyse amendments, or render in a
production build.

## Wave F Phase 2 — interaction and service decisions

Status: `TECHNICAL DESIGN READY FOR PRODUCT REVIEW — NO IMPLEMENTATION`.

Phase 2 keeps one provider-neutral server boundary and recommends a staged
hybrid pipeline: YUTA resolves and checks the exact available PDF locally, then
an approved adapter may perform structured multimodal extraction. A future
OpenAI adapter is one option, not domain authority and not a direct browser
dependency. No provider is enabled by this design.

The first real apply slice should remain smaller than the discovery allowlist.
`position` and `contractWeeklyMinutes` can be independently validated by the
existing employee mutation. `employmentTermType` may still be shown as an
untrusted suggestion, but changing CDI to CDD cannot be applied unless an
explicit expected end date and supported CDD reason are also present and
reviewed. Phase 2 does not weaken that existing repository rule.

### Phase 2 decision register

| ID     | Recommended decision                                                                                                                                  | Status                    |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| WF2-01 | Keep extraction behind one Backoffice server-only, provider-neutral application interface                                                             | Approved local Phase 3    |
| WF2-02 | Resolve bytes internally from trusted scope and the exact available base-contract version; browser never supplies a storage key or file URL           | Approved local Phase 3    |
| WF2-03 | Separate local PDF preflight/preparation from the replaceable semantic-extraction adapter                                                             | Approved local Phase 3    |
| WF2-04 | If OpenAI is later selected, use a vision-capable Responses request with inline file input, strict structured output, and `store: false`              | Approved as deferred gate |
| WF2-05 | Do not use Files, Conversations, Assistants, vector stores, background mode, web search, tools, or public URLs for this flow                          | Approved local Phase 3    |
| WF2-06 | Block any remote real-file call until EU regional processing, approved retention controls, DPA, legal/DPO/privacy/security, and operations gates pass | Approved; remains blocked |
| WF2-07 | Make the first Phase 3 provider exercise use synthetic non-personnel PDFs unless WF2-06 is separately evidenced and approved                          | Approved local Phase 3    |
| WF2-08 | Return only a strict allowlisted result; discard PDF preparation text and raw provider output after the request                                       | Approved local Phase 3    |
| WF2-09 | Keep reviewed suggestions transient in browser memory; refresh, close, document replacement, or employee conflict invalidates them                    | Approved local Phase 3    |
| WF2-10 | Apply only `position` and `contractWeeklyMinutes` initially; keep CDI/CDD review-only until all coupled fields are supported                          | Approved local Phase 3    |
| WF2-11 | Treat selected browser values as untrusted input and reuse fresh authorization, employee revision, Zod validation, idempotency, and audit             | Approved local Phase 3    |
| WF2-12 | Add a distinct future `personnel.document.extract` permission for OWNER; applying also requires `personnel.employee.manage`                           | Approved local Phase 3    |
| WF2-13 | Use synchronous foreground extraction for the first slice: one in-flight request, 45-second timeout, no automatic retry, manual retry only            | Approved local Phase 3    |
| WF2-14 | Limit the first slice to one PDF, 10 MiB, 40 pages, and 10 requests per establishment per rolling 24 hours                                            | Approved local Phase 3    |
| WF2-15 | Record minimized requested/completed/failed/applied audit outcomes without PDF text, snippets, values, prompts, responses, or provider IDs            | Approved local Phase 3    |
| WF2-16 | Require synthetic/approved eval fixtures, cross-tenant denial, prompt-injection, malformed output, stale version, conflict, and cost tests            | Approved local Phase 3    |

The 2026-08-18 approval authorized only the local synthetic Phase 3 slice
described below. Provider SDKs/secrets, real personnel-file extraction,
production processing, new schema/migration, and remote transmission remain
outside that approval.

## Wave F Phase 3 — local synthetic vertical slice

Status: `IMPLEMENTED LOCALLY — REAL PERSONNEL FILES AND PRODUCTION BLOCKED`.

The approved Phase 3 slice generates a three-page fictional PDF in server
memory and passes only that fixture through a replaceable local preparer and
deterministic adapter. The signed personnel contract shown in the UI is never
opened, read, copied, or transmitted for extraction. No AI/OCR provider, SDK,
API key, remote request, result table, queue, worker, schema, or migration was
added.

The development-only review implements complete, partial, no-result,
unsupported, failure, timeout, manual retry, document-stale, employee-conflict,
and apply states. Only `position` and `contractWeeklyMinutes` may be applied.
`employmentTermType` is visibly review-only because CDD requires the coupled
end-date and controlled-reason fields.

Every server request repeats trusted OWNER authorization and exact
organization + establishment + employee + document/version resolution before
fixture preparation. Apply additionally requires employee-management
permission, revalidates the deterministic result, preserves the existing
revision/idempotency/domain update path, and writes minimized extraction audit
events to the existing personnel audit table. The 10-request/24-hour limit is
development-process memory only and is not production coordination.

## Wave F Phase 4 — local integration hardening

Status: `COMPLETED LOCALLY — REAL FILES, EXTERNAL AI, AND PRODUCTION BLOCKED`.

Phase 4 keeps the Phase 3 product boundary and adds no provider or file access.
Apply now requires a matching, tenant-scoped
`employee.contract_extraction_completed` audit event for the same employee,
request, document ID, document version, and complete/partial outcome. The grant
expires after 15 minutes. A fabricated, mismatched, cross-establishment, or
expired review cannot reach the employee update path.

The client now discards the entire review after an employee/document version
change or apply conflict instead of leaving stale suggestions selectable.
Radio groups remain controlled from first render, eliminating the React state
warning found during live QA. Internal phase language was removed from the
French interface. Browser verification covered complete, partial, unsupported,
failure, timeout, manual retry, selection, focus restoration, console output,
and horizontal overflow at 1440/1024/768/390. No employee suggestion was
applied during browser QA.

## Wave F Phase 5 — local finalization

Status: `COMPLETED LOCALLY — SYNTHETIC TEST FLOW ONLY`.

Phase 5 adds no capability. It closes the approved local Wave F slice with
signed-in functional, responsive, accessibility, console, and as-built
evidence. The review still analyses only the server-generated fictional PDF;
the signed contract displayed on the employee dossier is not opened or sent to
an extraction service. No suggestion was applied during final evidence.

Real personnel-file processing, external AI/OCR, provider evaluation, shared
production rate limiting, provider secrets, production operations, and legal/
privacy/security approval remain outside the completed local Wave F boundary.

## Wave G Phase 0 — synthetic AI/OCR provider evaluation discovery

Status: `PHASE 2 OFFLINE CORPUS COMPLETE; PHASE 3 TEST PROJECT CREATED — NO API CALL AUTHORIZED`.

Wave G remains a `FLOW + INTEGRATION` discovery inside the existing signed base-
contract Documents surface. The containing Salariés page stays an integrated
existing page; the unimplemented capability is evaluation and selection of a
replaceable AI/OCR adapter. It does not create a new route or a general YUTA AI
platform.

### Smallest Phase 0 MVP

The MVP is an evaluation specification, not a runtime feature. A later,
separately approved phase may compare candidates using only generated fictional
French employment-contract PDFs with known expected answers. The evaluation
must reuse the Wave F allowlist, strict result schema, 45-second foreground
boundary, OWNER review, and no-automatic-save rule.

The first provider evaluation is limited to OpenAI Responses direct-PDF
extraction with strict structured output. YUTA may compare approved pinned
OpenAI model snapshots or request settings against the same corpus, but it does
not benchmark a second external provider in this wave. Local native-text
extraction, Tesseract, another self-hosted OCR engine, Azure Document
Intelligence, Google Document AI, and a local-first OCR pipeline are outside the
current direction. If OpenAI later fails the approved safety, quality, cost, EU,
or retention gates, replacing it requires a new explicit provider decision; the
provider-neutral adapter prevents that decision from changing business logic or
the restaurant UI.

### Users and ownership

Phase 0 serves YUTA product, engineering, privacy, security, and operations
reviewers. It adds no new restaurant user or UI permission. Any future runtime
request remains OWNER-initiated and server-authorized under trusted
organization + establishment + employee + exact document/version scope.
Synthetic evaluation fixtures are repository-owned test assets with no tenant,
employee, document-storage, or register ownership.

### Recommended evaluation direction

YUTA uses a combined ownership model: it may rent general infrastructure and
one external AI service, while retaining the prompt, strict result shape,
validation, authorization, cost limits, OWNER confirmation, and audit rules.
OpenAI is the only external provider proposed for the first synthetic
evaluation. This is an evaluation priority, not production approval.

Compare only pinned OpenAI model snapshots and request settings that are
actually available in an approved EU project at evaluation time. Do not
hard-code a mutable alias or price into the product contract. Record actual
per-document input/output usage, latency, refusal, and accuracy from the
synthetic run. The provider adapter remains YUTA-owned so a later approved
replacement does not alter business rules or UI.

### Explicitly deferred

- SDK/library installation, API keys, billing, and secrets;
- any external request, including a request containing only synthetic bytes;
- any signed employee PDF read, copy, OCR, text extraction, or transmission;
- real employee text, names, metadata, prompts, responses, or page images;
- local native-text extraction, Tesseract, or another self-hosted AI/OCR engine;
- Azure, Google, or another second external AI/OCR provider in this wave;
- Files API, vector store, File Search, background mode, batch, fine-tuning,
  embeddings, web search, tools, or provider-side training;
- provider selection, production adapter, shared rate limiting, monitoring,
  deployment, support ownership, and incident response;
- amendments, identity/work-permit documents, multi-file reconciliation,
  file-first employee creation, automatic save, and register updates;
- schema, migration, result store, queue, job, public API, or generic AI package.

### Phase 0 decision register

| ID     | Decision                                                                                                                                     | Status                      |
| ------ | -------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| WG0-01 | Keep Wave G inside the existing Documents review flow and stable Salariés page pack                                                          | Approved 2026-08-18         |
| WG0-02 | Make Phase 0 documentation/evaluation design only, with no SDK, key, provider call, file read, or implementation                             | Approved 2026-08-18         |
| WG0-03 | Use only generated fictional French contracts with machine-known answers in any later benchmark                                              | Approved 2026-08-18         |
| WG0-04 | Evaluate OpenAI Responses direct-PDF extraction as the only external AI/OCR provider path in this wave                                       | Approved 2026-08-18         |
| WG0-05 | Do not self-host native extraction/OCR and do not benchmark Azure, Google, or another second provider in the current phase                   | Approved 2026-08-18         |
| WG0-06 | Preserve the YUTA-owned provider-neutral server interface, prompt boundary, and strict result schema                                         | Approved 2026-08-18         |
| WG0-07 | Keep `position` and weekly minutes as the only apply-capable fields; CDI/CDD remains review-only                                             | Approved 2026-08-18         |
| WG0-08 | Require 100% schema-valid-or-rejected responses, zero unsupported-field leakage, and zero prompt-instruction execution                       | Approved 2026-08-18         |
| WG0-09 | Require no incorrect high-confidence suggestion in the approved benchmark and favor unresolved output over guessing                          | Approved 2026-08-18         |
| WG0-10 | Measure exact-field accuracy, abstention, latency p50/p95, timeout/failure rate, and actual cost per synthetic document                      | Approved 2026-08-18         |
| WG0-11 | Keep the current Wave F UI and make provider/model identity invisible to restaurant users                                                    | Approved 2026-08-18         |
| WG0-12 | Keep production files in private EU storage outside Neon; an AI request never becomes document storage or a source of truth                  | Approved 2026-08-18         |
| WG0-13 | Verify OpenAI EU storage/processing, eligible endpoint/model/file mode, approved retention controls, DPA/subprocessors, AIPD, and operations | Approved production blocker |
| WG0-14 | Require a separate approval before synthetic provider calls and another approval before any real personnel-file pilot                        | Approved 2026-08-18         |

Phase 0 changes documentation only. No design generation is needed because the
approved Wave F review UI and its states remain unchanged.

Product authorized the offline Phase 2 track and temporary-account Phase 3
design preparation on 2026-08-19 while the Phase 1 Sales response remains
pending. Product then reviewed the ten-file starter and authorized expansion to
the full 60 entirely fictional PDFs on 2026-08-19. Phase 2 owns their versioned
answer manifest and a strict offline scorer. It does not change the restaurant
UI or authorize an external request.

Product separately authorized creation of the disposable `YUTA AI Test`
project under the current personal/pre-incorporation API organization on
2026-08-19. The dashboard reports `Global` geography and data-retention control
`None`; the private project ID is not repository data. On the same date,
product separately approved USD 10 prepaid organization credit with automatic
reload disabled, a USD 5 monthly hard project limit, the dashboard's 100%
alert, and a project allowlist limited to `gpt-5.6-luna` and
`gpt-5.6-terra`. A project service account/key named
`yuta-ai-evaluation-local` was created with a private, uncommitted secret. Its
only assigned role is `YUTA AI Evaluation Caller`, limited to model requests;
the preset `member` role was removed.

Product separately authorized the minimal adapter and one first Phase 4
synthetic call on 2026-08-19. The SDK-free server adapter used the
`gpt-5.6-luna` alias, direct Base64 PDF input, `store: false`, strict structured
output, no tools, no background mode, and the fixed hashed
`wg2-digital-cdd-35h.pdf` fixture. The call completed and passed the strict YUTA
schema and expected-answer scorer. Product then authorized three representative
calls covering clear scan, degraded partial scan, and adversarial instruction
content. All three passed on their first attempt; the batch used 13,701 input
and 427 output tokens with an estimated cost of USD 0.0032526.

Product then authorized the remaining 56 calls. The full Luna baseline ran once
without retry and passed 58/60 documents: 20/20 digital, 14/15 clear scan,
14/15 degraded scan, and 10/10 adversarial. All responses were schema-valid and
no request timed out or failed at the provider. One clear-scan response included
a false high-confidence suggestion, which violates WG0-09; one degraded-scan
response had only a safe status mismatch. This configuration therefore fails
the selection gate and is not approved for real files or production. Full
billed-cost reconciliation remains pending because the Usage dashboard had not
yet ingested the run. No provider response, provider ID, prompt, PDF content, or
secret was persisted. The temporary environment cannot be promoted to
production; a company-owned environment must be rebuilt and requalified
separately.

## Wave G Phase 5 — Luna/Terra comparison

Product separately authorized a full `gpt-5.6-terra` comparison under the same
synthetic-only controls. Terra also passed 58/60 documents: 20/20 digital,
13/15 clear scan, 15/15 degraded scan, and 10/10 adversarial. All 60 responses
were schema-valid and there were no provider failures, timeouts, arbitrary-key
leaks, or abstention violations. Terra corrected Luna's safe status-only
mismatch, but produced two incorrect high-confidence suggestions on clear scans
instead of Luna's one. Visual review confirmed those fully fictional PDFs and
their expected answers are correct and legible. Both configurations therefore
fail WG0-09 and neither is selected.

At the prices checked on 2026-08-19, Terra costs ten times Luna per input and
output token. The Usage dashboard later showed a partial 98/120 requests,
328,421 tokens, and USD 0.40, so final billed-cost reconciliation is still
open. No additional call is authorized by this result. Product must next
either reject the two current configurations or approve a predefined new
candidate before a clean full-corpus rerun. Real personnel files, employee
updates from AI, production use, and the separate legal/privacy/security/
operations gates remain outside this approval.

## Wave G Phase 5 — Luna/prompt-v2 result

Product separately authorized one complete Luna/v2 run over the frozen 60-PDF
fictional corpus on 2026-08-19. All fixtures ran once without retry. The
candidate passed 46/60: digital 14/20, clear scan 9/15, degraded scan 15/15,
and adversarial 8/10. Eleven outputs still rewrote `position` with incorrect
high confidence, one provider result failed v2 local consistency validation,
and two adversarial outputs safely omitted an expected duration. V2 therefore
fails WG0-09 by a wide margin and is not a product candidate. Its temporary
run gate was removed. No further call, real personnel file, employee update,
or production use is authorized by this result.

## Wave G Phase 5 — approved prompt v3 and candidate corpus v2

Product approved the exact v3 text on 2026-08-19. V3 uses held-out fictional examples to
teach literal position transcription without copying any answer from the
benchmark. It does not weaken exact matching or allow a bare duration in hours
to become weekly minutes. Offline review found that two frozen corpus-v1
fixtures expect that unsafe conversion despite lacking weekly wording.
Candidate corpus v2 fixes only those two fictional PDFs with explicit weekly
wording, preserves all expected answers and the other 58 PDF hashes, and passed
offline structural and visual review. Product approved corpus v2 and one
complete Luna/v3 run on 2026-08-19. The sequential, no-retry run passed 58/60:
digital 20/20, clear scan 13/15, degraded scan 15/15, and adversarial 10/10.
One clear scan produced an incorrect high-confidence orthographic rewrite and
another produced a locally invalid result after provider completion. V3 still
fails WG0-09 and is not selected. Its single-use external gate was removed.
No further call, real-file path, employee update, or production capability is
authorized.

## Wave G Phase 5 — approved prompt v4

Product requested an offline v4 preparation after reviewing the v3 result and
approved its exact text on 2026-08-19. V4
keeps the same model, corpus v2, response schema, local validation, scorer, and
safety gate. It changes only position-value boundary wording and final
unique-field/status-count construction. Because raw failed provider output was
not retained, these are testable hypotheses derived from sanitized failure
categories, not claims about the exact v3 text. At this preparation point V4
was not yet selected, was not the adapter default, had no external run gate,
and authorized no API call, real file, employee update, or production use.

Product separately authorized one complete Luna/v4 run over corpus v2. The 60
fictional PDFs ran sequentially once with no retry. The result was 59/60:
digital 20/20, clear scan 14/15, degraded scan 15/15, and adversarial 10/10.
One clear-scan response was rejected locally as invalid; every other response
was schema-valid. There were no incorrect high-confidence suggestions,
abstention violations, or provider failures, and maximum observed latency was
7,498 ms. This meets the current synthetic schema-or-reject, safety, exact
accuracy, and latency thresholds. Product selected Luna/v4/corpus-v2 as the
winner of the synthetic evaluation on 2026-08-19. This is an evaluation
decision only, not a real-file or production approval. The synthetic comparison
is closed, the single-use run gate remains removed, the generic adapter default
remains v1, and no further external request is authorized.

## Wave G Phase 6 — development integration

Status: `IMPLEMENTED WITH FICTIONAL PDF; PRODUCTION FAIL-CLOSED`.

The existing Documents review action may use the selected Luna/v4 configuration
only when the server runs in development and the explicit
`openai-synthetic` mode is configured with the evaluation key. YUTA generates
the PDF sent to the adapter; the stored signed contract is neither opened nor
sent. Offline development keeps the deterministic synthetic mode. Missing or
invalid configuration and all non-development runtimes reject the operation.
This phase adds no employee-data automation, real-file path, schema, migration,
new UI, production account, or production approval.

## Wave G Phase 8 — stored fictional contract offline integration

Status: `IMPLEMENTED; ONE PROVIDER QA COMPLETE — PRODUCTION BLOCKED`.

The next proposed development step is to exercise the same path that a later
production implementation would need: resolve and open the current signed
contract from YUTA Documents instead of asking OWNER to upload the same PDF a
second time. This is not a real-file pilot. Only an exact repository-owned
fictional fixture that the server registered when it entered the local
development document store may be eligible.

Eligibility is server-owned and uses metadata already persisted for the current
document version. A dedicated resolver binds trusted organization,
establishment, employee, document ID, current version, storage key, media type,
byte size, and checksum. The checksum must match the one approved repository
fixture before storage is opened. A browser confirmation, filename, dossier
name, or development environment alone is insufficient. After opening the
eligible object, YUTA recomputes and matches byte size, PDF signature, and
SHA-256 before preparation. Replacement, missing storage, size/page failure, or
hash mismatch invalidates the path.

The proposed first user remains OWNER. Starting extraction continues to require
`personnel.document.read` and `personnel.document.extract`; applying a supported
suggestion also requires `personnel.employee.manage`. The existing trusted
tenant scope, current employee/document version checks, rate limit, Luna/v4
adapter, strict YUTA result contract, 15-minute review, explicit per-field
choice, apply audit, and no-automatic-update rule remain unchanged.

The generated and explicit-upload sources remain available as development test
tools. The stored-fictional source is offered only when the current contract is
eligible. It is forced through a fixture-specific deterministic adapter that
returns the frozen expected `Chef de rang`, CDD, and 35-hour review and has no
network capability. No provider/model/prompt/account control becomes
restaurant-facing.

Out of scope for Phase 8:

- opening, hashing, or transmitting an arbitrary document already in storage;
- treating an OWNER checkbox or local filename as proof that a file is fictional;
- real employee or customer data;
- production object storage, production malware scanning, retention,
  deletion, backup/restore, incident response, or operational ownership;
- OpenAI production organization/project, EU processing approval, retention
  agreement, DPA/subprocessor approval, or a real-file pilot;
- schema, migration, automatic employee update, background processing, batch
  extraction, or another provider.

Product approved this scope and its offline implementation on 2026-08-20, then
separately authorized exactly one provider-backed QA request with the exact
stored fictional fixture. That single Luna/v4 request completed successfully;
the one-time gate was removed by stopping the privileged process immediately
afterward. Any additional provider request and every real-file pilot remain
separate approval gates.

## F02 Phase 0 — add-employee scope reconciliation

Capability status: `EXISTING DEVELOPMENT CAPABILITY — PHASE 1 IMPLEMENTED`.

### Current user and outcome

The current user is an authenticated OWNER acting in one trusted active
establishment. The implemented outcome is one establishment-owned minimum
employee dossier. It is not a login account, organization-wide person, payroll
worker, personnel-register inscription, Formalités draft, or document folder.

The current required creation facts are:

- given names and family name;
- position and qualification;
- CDI or CDD;
- full-time or part-time category;
- contractual weekly duration in minutes;
- establishment-local entry date; and
- for CDD only, one supported reason and an expected end date on or after the
  entry date.

Possible same-establishment duplicates require an explicit bounded reason
before a separate dossier may be created. The server owns scope, actor,
identifiers, timestamps, revision, audit, and retry receipts.

### Repository conflict with the downloaded F02 flow

The downloaded dossier proposes a broad progressive onboarding sequence that
starts with optional documents and later includes remuneration, probation,
contract-specific details, and review. Repository reality is narrower:

- the current signed-contract flow needs an existing employee ID and cannot be
  an initial creation step;
- no approved identity, work-permit, RIB, or general employee-document category
  exists;
- remuneration, probation, apprenticeship, detailed part-time distribution,
  work authorization, additional contract types, and file-first creation are
  absent or separately blocked; and
- the current create command persists one minimum dossier atomically rather
  than saving a resumable multi-step onboarding draft.

The external flow must therefore be narrowed to existing capability before any
UI proposal is approved.

### Approved product decisions

| ID     | Decision needed                              | Recommendation                                                                                                       | Status              |
| ------ | -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | ------------------- |
| F02-01 | One dialog or multi-step creation            | Keep one dialog for the current minimum facts; progressive completion happens in the full dossier after creation     | Approved 2026-08-23 |
| F02-02 | Behavior after committed success             | Keep the success message and offer `Ouvrir le dossier`; do not navigate automatically                                | Approved 2026-08-23 |
| F02-03 | Documents during creation                    | Do not add a document step; use the existing signed-contract action only after the employee dossier exists           | Approved 2026-08-23 |
| F02-04 | Meaning of completion                        | Say `Dossier minimum créé`; do not claim legal, document, payroll, register, or onboarding completeness              | Approved 2026-08-23 |
| F02-05 | Closing a modified form                      | Ask for confirmation before discarding non-empty unsaved input; cancellation before any input remains immediate      | Approved 2026-08-23 |
| F02-06 | Fields and contract categories in next slice | Preserve the exact current field set and CDI/CDD branches; add no new field, enum, validation rule, or document type | Approved 2026-08-23 |
| F02-07 | Authorization and establishment scope        | Remain OWNER-only and active-establishment-only; MANAGER and STAFF remain denied                                     | Approved 2026-08-23 |
| F02-08 | Production availability                      | Keep production collection blocked until recorded privacy, retention, security, and operations gates are approved    | Approved 2026-08-23 |

These decisions authorized only the bounded Phase 1 implementation and
fictional authenticated baseline. They do not authorize production, real
employee QA, new HR fields, documents, remuneration, templates, AI,
Formalités, or register writes.

## F03 Phase 0 — manage-employee-dossier scope

Capability status: `EXISTING DEVELOPMENT CAPABILITY — DECISIONS PROPOSED`.

### Current user and outcome

The current user is an authenticated OWNER acting in one trusted active
establishment. F03 updates the current minimum employee dossier; it does not
create a new employee, end employment, replace a signed contract, produce a
contract draft, write the personnel register, or update payroll.

The existing editable facts are given names, family name, position,
qualification, CDI/CDD, expected CDD end date, controlled CDD reason, full-time
or part-time category, contractual weekly duration, and entry date. The server
owns scope, actor, revision, timestamps, audit, and retry receipts.

### Proposed product decisions

| ID     | Decision needed                       | Recommendation                                                                                                      | Status   |
| ------ | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | -------- |
| F03-01 | Entry surfaces                        | Keep `Modifier` in both quick view and full dossier; both use one shared editor                                     | Proposed |
| F03-02 | Editor structure                      | Keep one combined minimum identity/employment dialog; do not create separate mutations per read-only tab            | Proposed |
| F03-03 | Editable field boundary               | Preserve the exact current field set; add no payroll, remuneration, document, authorization, register, or HR field  | Proposed |
| F03-04 | Unsaved close                         | Require confirmation before discarding modified unsaved values; untouched or successfully saved close is immediate  | Proposed |
| F03-05 | Successful save                       | Close the editor, keep the current quick view/full dossier open, and show the committed values plus success message | Proposed |
| F03-06 | F03/F07 history boundary              | Keep current minimized audit as traceability only; F07 separately owns approval of reconstructable value history    | Proposed |
| F03-07 | Authorization and establishment scope | Remain OWNER-only and active-establishment-only; MANAGER and STAFF remain denied                                    | Proposed |
| F03-08 | Production availability               | Keep production collection blocked until privacy, retention, security, legal, and operations gates are approved     | Proposed |

Approval of these decisions would authorize only the smallest Phase 1 renewal:
capture the authenticated fictional-data edit baseline, add dirty-close
protection, and verify existing behavior. It would not authorize a new field,
history schema, value snapshot, audit payload, route, permission, real employee,
or production use.
