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

Future `À traiter` behavior should distinguish:

- incomplete dossier data or missing approved documents;
- upcoming expiry, contract, or formality events.

Every item must identify the employee, issue, relevant date when applicable,
and an actually supported resolving action. Do not add a fourth KPI merely to
display alerts or show generic warnings with no resolution.

### Wave E — Personnel register and PDF export

A future register entry point may be discoverable from Salariés, but it requires
approved routing, stable establishment hiring order, retained former employees,
reconstructable dated history, stagiaire semantics where supported, retention,
and legal/immutability review. PDF is an export of structured data, never the
source of truth or evidence by itself of electronic-register compliance.

The preferred one-employee-per-page format remains a future presentation
proposal until that capability wave is reviewed.

## Relationships

Formalités, Planning, Pointage, and other Équipe routes remain planned surfaces.
Future Formalités should consume approved employee data rather than duplicate
it. `Utilisateurs & accès` manages login identities and memberships, not employees.
