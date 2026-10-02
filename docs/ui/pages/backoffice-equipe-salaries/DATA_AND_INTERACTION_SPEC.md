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

| Concept                                             | Classification                       | Proposed source and semantics                                                          | Phase 1 mapping / Phase 3 gate                                               |
| --------------------------------------------------- | ------------------------------------ | -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Employee dossier ID                                 | Stored                               | Opaque resource ID scoped by trusted organization and establishment                    | Fixture `id`; identifier strategy remains unapproved                         |
| Organization ID                                     | Integration-owned                    | Derived from validated session/tenant context and repeated on tenant-owned persistence | Never accepted from fixture/form as trusted scope                            |
| Establishment ID                                    | Integration-owned                    | Active establishment from validated membership                                         | Establishment owns the MVP dossier                                           |
| Given names                                         | Stored                               | Required minimum identity text after normalization and length validation               | Fixture `givenNames`; exact legal/name rules need approval                   |
| Family name                                         | Stored                               | Required minimum identity text after normalization and length validation               | Fixture `familyName`; exact legal/name rules need approval                   |
| Display name / initials                             | Derived                              | Presentation from approved identity fields                                             | `getEmployeeName` and `getEmployeeInitials`; never stored for authority      |
| Poste                                               | Stored proposal                      | Establishment operational job label                                                    | Fixture `position`; controlled vocabulary versus bounded text unresolved     |
| Qualification                                       | Stored proposal                      | Employment qualification relevant to the relationship                                  | Fixture `qualification`; vocabulary/legal owner unresolved                   |
| Entry date                                          | Stored                               | Required establishment-local calendar date on which the relationship begins            | Fixture `startDate`; date-only canonical representation required             |
| Departure date                                      | Stored, nullable                     | Effective final establishment-local date; setting it never deletes the dossier         | Fixture `departureDate`; correction/reopening requires audit                 |
| Expected end date                                   | Stored, conditional proposal         | Planned end for a finite relationship, distinct from actual departure                  | Fixture `expectedEndDate`; proposed rules appear in Domain validation        |
| Work-time category                                  | Stored proposal                      | Minimum full-time/part-time fact                                                       | Fixture `workSchedule`; exact values and transitions require approval        |
| Contract facts                                      | Stored proposal                      | Smallest approved structured facts about the relationship                              | Fixture `contractSummary` is display-only and must not be persisted verbatim |
| Contract summary                                    | Derived                              | Localized presentation from approved contract facts                                    | Fixture string only; no enum or legal vocabulary inferred                    |
| Operational status                                  | Derived                              | Upcoming, active, or former from entry/departure dates and establishment business date | `getEmployeeView`; no persisted status enum by default                       |
| Completeness issues                                 | Derived                              | Stable issue codes plus localized explanations from missing/invalid approved MVP facts | Fixture strings are illustrative; no opaque `isComplete` source of truth     |
| Summary counts                                      | Derived                              | Counts over the authorized establishment-scoped result                                 | Fixture count helpers; never organization/global counts                      |
| Audit event ID/type/time                            | Integration-owned                    | Server-created immutable event metadata for create/update/departure/correction         | Fixture `history` strings are illustrative, not authoritative events         |
| Actor user ID                                       | Integration-owned                    | Validated session actor stored with mutation audit                                     | Never supplied as trusted form data                                          |
| Created/updated timestamps                          | Integration-owned                    | Server/database timestamps; `updatedAt` may be the optimistic concurrency token        | Not represented as authoritative fixture fields                              |
| Search, filters, ordering, selected row, detail tab | Transient UI                         | Presentation state only; ordering is validated and executed by the server              | Current client/URL state; never persisted as employee facts                  |
| Pending/error/conflict/success state                | Transient request UI                 | One operation lifecycle; success only after committed persistence                      | Prototype simulator only                                                     |
| Formalités/document/provider status                 | External/integration-owned, deferred | Owned by its future approved capability and referenced through explicit contracts      | Must not be stored as arbitrary employee fields                              |
| Register order                                      | Deferred domain value                | Stable establishment hiring/history order independent of operational sorting           | Requires separate register/legal design                                      |

Excluded: NIR, RIB, documents, health/disciplinary data, remuneration, payroll,
work-authorization files, apprenticeship, interns, and provider/Formalités data.

## Interaction map

| ID   | User/system action                               | Read/write effect                                                                                                         | Required states and recovery                                                                                            | Delivery status             |
| ---- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| I-01 | Enter `/equipe/salaries`                         | Resolve trusted session, membership, organization, establishment, role/permission, then read an establishment-scoped list | Loading; missing scope; forbidden without data disclosure; service error and retry; first-use empty                     | Real read implemented       |
| I-02 | Select active/upcoming/former view               | Re-query only the authorized result by derived status                                                                     | Selected view remains textual; empty-filter result differs from first-use empty                                         | Real read implemented       |
| I-03 | Search, filter completeness, or change ordering  | Change transient list criteria and re-query the complete authorized result; never change domain data                      | Cursor reset; no-result state; pending controls disabled; cursor/order mismatch rejected                                | Real read implemented       |
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
| I-14 | Page employee consultation history               | Read 10 collapsed access entries at a time with an opaque server cursor under the full trusted employee scope             | Newest first; previous/next; stable page boundaries; no raw actor/tenant/operation metadata                             | Real read implemented       |

Operational sorting and filtering never define future personnel-register
ordering. Pagination follows approved repository behavior; the raster
`10 / page` selector has no product authority.

The implemented ordering values are `entry_date_desc` (default), `name_asc`,
`name_desc`, `position_asc`, and `position_desc`. Name ordering uses family
name, given names, then employee ID. Position ordering uses position, family
name, given names, then employee ID. Every cursor contains its ordering and
the corresponding last-row keys; a cursor from another ordering is rejected.

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
- a successful edit closes only the edit dialog, keeps the selected employee
  dossier open, and immediately presents the committed employee returned by the
  server while the route refresh reconciles the list in the background;
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

## Documents capability discovery and Phase 2 proposal

Status: `PHASE 3 LOCAL VERTICAL SLICE IMPLEMENTED — PRODUCTION APPROVAL BLOCKED`.

Repository analysis on 2026-08-15 found no Backoffice/cloud upload service,
private object-storage adapter, document contract, document table, document
permission, malware-processing flow, or document test. The only physical upload
implementation belongs to the standalone local Display runtime and is not a
reusable cloud personnel boundary.

The Phase 1 presentation prototype therefore uses only route-local typed
fictional objects. Those objects contain no resource ID, URL, storage key,
tenant value, or transport shape. All document actions are disabled. This
fixture shape is not a database schema, API contract, or persistence design.

### Proposed interaction map

| ID   | User action               | Required server behavior after later approval                                                                                  | Truthful UI states                                                        |
| ---- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------- |
| D-01 | Open `Documents`          | Reauthorize OWNER and resolve employee by organization + establishment + employee ID before returning safe metadata            | Loading, empty, forbidden without disclosure, service error and retry     |
| D-02 | Add one document          | Validate category and metadata, accept a bounded file, quarantine it, verify type/content, then make it available atomically   | Selecting, uploading, processing, rejected, failed with retry, available  |
| D-03 | View or download          | Reauthorize every request, resolve the scoped document, record access, and deliver through a private short-lived mechanism     | Pending, opened/downloaded, expired delivery, unavailable, retry          |
| D-04 | Replace current document  | Validate a new file, preserve explicit version/audit semantics, and switch current version only after safe processing succeeds | Confirmation, processing, success, rejected, conflict, prior version safe |
| D-05 | Inspect document activity | Return only allowlisted document events and safe actor labels; never return storage keys, raw metadata, or file content        | Loading, empty, unavailable, retry                                        |

No action is implemented or authorized by this proposal. Delete, archive,
legal hold, rights administration, bulk export, sharing, OCR, and generation
have no UI action in this MVP.

### Proposed UI/data dictionary — not a schema

| Concept                       | Classification          | Purpose and boundary                                                                                           |
| ----------------------------- | ----------------------- | -------------------------------------------------------------------------------------------------------------- |
| Employee dossier ID           | Server-owned reference  | Must resolve with trusted organization and establishment scope; never authorizes access alone                  |
| Document ID                   | Server-owned identifier | Opaque resource identifier; every lookup repeats full trusted scope                                            |
| Approved category code        | Stored proposal         | Stable allowlist approved category-by-category; never arbitrary user text or inferred from filename            |
| Display label                 | Derived/localized       | French category label from the approved code                                                                   |
| Original filename             | Sensitive metadata      | Sanitized for display; never used as a storage path or placed in URL/logs                                      |
| Media type and byte size      | Verified metadata       | Derived and verified server-side; browser declaration is untrusted                                             |
| Optional relevant/expiry date | Stored proposal         | Exists only for an approved category with defined meaning and resolving action                                 |
| Availability state            | Derived workflow state  | Proposed values: uploading/processing/available/rejected/unavailable; must reflect real storage/security state |
| Current version and revision  | Server-owned state      | Supports explicit replace/conflict behavior; does not authorize indefinite retention of old binaries           |
| Storage provider key          | Infrastructure secret   | Never exposed as UI data, accepted from the browser, or stored in generic audit metadata                       |
| Uploader/actor and timestamps | Server-owned metadata   | Resolved from session/server time and projected only as safe display identity                                  |

Document binary content is not PostgreSQL row content. A later design may keep
safe metadata in cloud persistence and encrypted binary objects in a private
cloud storage service, but provider choice, region, keys, lifecycle, backup,
restore, deletion, and contractual responsibilities remain unapproved.

### Proposed authorization matrix

| Action                              | OWNER | MANAGER | STAFF/public/service/self-service | Boundary                                                                   |
| ----------------------------------- | ----- | ------- | --------------------------------- | -------------------------------------------------------------------------- |
| List safe document metadata         | Allow | Deny    | Deny                              | Trusted organization + establishment + employee scope                      |
| Upload into an approved category    | Allow | Deny    | Deny                              | Fresh server authorization; category/file checks; quarantine               |
| View/download an available document | Allow | Deny    | Deny                              | Fresh check for each request; short-lived private delivery; audit required |
| Replace current document            | Allow | Deny    | Deny                              | Explicit version/conflict behavior and audit required                      |
| Delete/archive/share/export/OCR     | Deny  | Deny    | Deny                              | Deferred or separately prohibited capability                               |

This proposal may later introduce document-specific permissions rather than
silently broadening `personnel.employee.read/manage`. That naming and mapping is
a Phase 3 authorization decision; Phase 0 does not add permissions.

### Proposed document audit events

Every successful sensitive access or mutation needs an allowlisted event, at
minimum: document list opened, document viewed, document downloaded, upload
completed, upload rejected, and document replaced. Denied access and security
processing failures require operational security traces without copying file
content, filenames, provider keys, URLs, or extracted values into generic audit
metadata. Event retention and who may inspect document audit history remain
separate approvals.

### Privacy, retention, and security gates

- approve each category's purpose, required/optional status, recipients,
  relevant/expiry date semantics, and rights workflow;
- approve a per-category and per-version active/archive/deletion schedule; do
  not infer one blanket duration for every document;
- keep files private, encrypted in transit and at rest, and isolated by least
  privilege; delivery must not create a stable public URL;
- quarantine new files and verify content/type before they become available;
- define limits for count, size, MIME/content types, filenames, and processing
  time during the later technical-design phase;
- define provider region/responsibilities, secret/key management, backups,
  restore tests, incident response, and deletion propagation before production;
- support data-subject access/rectification workflows without exposing another
  employee or establishment.

CNIL guidance limits personnel access to people who need it, requires defined
retention and rights information, and recommends authorization management,
operation tracing, backups, incident preparation, encryption, and cloud risk
assessment. These references guide the approval gates; this page pack does not
claim legal compliance:

- <https://www.cnil.fr/fr/les-regles-pour-la-gestion-du-personnel>
- <https://www.cnil.fr/fr/guide-de-la-securite-des-donnees-personnelles>
- <https://www.cnil.fr/fr/referentiel-durees-conservation-donnees-rh>

Document categories, requirements, expiry dates, and completeness rules are
not defined by the UI or external feedback. OCR suggestions remain untrusted
until user review and normal validation succeed in a separately approved wave.

### Documents Wave A Phase 2 technical design — proposal only

Phase 2 was authorized on 2026-08-15 for technical design and decision
preparation only. It creates no schema, migration, contract, API, permission,
provider connection, storage object, background worker, or real-file behavior.

#### Repository reuse and new boundaries

- reuse the current trusted Backoffice session, OWNER-only personnel guard,
  employee dossier, organization/establishment scoping, UUIDv7 convention,
  optimistic revision pattern, idempotent command pattern, and allowlisted
  personnel audit projection;
- do not reuse `users`, `tenant_memberships`, `auth_audit_events`, Neon database
  rows, or the local Display upload directory as document storage;
- keep safe document metadata in the future cloud personnel persistence
  boundary and binary content in a separate private object-storage boundary;
- keep provider credentials, object keys, checksums, quarantine results, and
  delivery details server-only;
- do not convert the Phase 1 fixture objects directly into contracts or tables.

#### Provider-neutral storage and scanner services

Later application logic must depend on two stable service boundaries rather
than a provider SDK:

```text
PersonnelDocumentStorage
  putQuarantinedObject
  openAvailableObject
  promoteVerifiedObject
  removeObject

PersonnelDocumentScanner
  inspectQuarantinedObject
```

The provider-specific storage adapter owns endpoint, region, credentials,
bucket naming, encryption options, and SDK error translation. The scanner
adapter separately owns malware/content inspection. Switching storage provider
must require only a new storage adapter, configuration, provider dependency,
and provider contract tests; document domain, authorization, audit, UI, and
scanner logic must remain unchanged. Switching scanner follows the same rule.

#### Private EU storage shortlist — no provider selected

| Option                            | Repository fit                                                                 | Required review before selection                                                     |
| --------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| Scaleway Object Storage `fr-par`  | Provisional recommendation: EU-native, S3-compatible, encryption and lifecycle | Public service endpoint, IAM, DPA/subprocessors, backup residency, exit and restore  |
| OVHcloud Object Storage EU region | EU-native and S3-compatible with managed or customer-provided encryption       | Exact region, effective bucket isolation/IAM, replication, DPA, deletion and restore |
| Amazon S3 Paris `eu-west-3`       | Mature IAM, encryption, logging, lifecycle, and security ecosystem             | Non-EU parent transfer assessment, DPA/subprocessors, cost and service complexity    |
| Cloudflare R2 `eu` jurisdiction   | S3-compatible EU jurisdiction and portable adapter surface                     | EU jurisdiction at bucket creation, DPA/transfer review, logging and scanner flow    |

Official product evidence used for this shortlist:

- Scaleway regions, lifecycle and object-lock concepts:
  <https://www.scaleway.com/en/docs/object-storage/concepts/>;
- Scaleway bucket encryption:
  <https://www.scaleway.com/en/docs/object-storage/how-to/enable-sse-one/>;
- OVHcloud server-side encryption:
  <https://help.ovhcloud.com/csm/fr-ca-public-cloud-storage-s3-encrypt-objects-sse-c?id=kb_article_view&sysparm_article=KB0047326>;
- Amazon S3 region and object-location behavior:
  <https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html>;
- Cloudflare R2 EU jurisdiction restrictions:
  <https://developers.cloudflare.com/r2/reference/data-location/>.

`Scaleway fr-par` is the provisional engineering recommendation for the first
slice, not an approved provider. Provider selection requires current pricing,
contract, DPA/subprocessor, security, operations, backup/restore, incident, and
exit review. S3 compatibility helps portability but does not by itself make
providers behaviorally identical.

#### Mandatory provider requirements

- effective object, replica, backup, security-processing, and disaster-recovery
  location remains inside the approved EU/EEA perimeter;
- private buckets with public access disabled, least-privilege service
  identities, separated quarantine/available namespaces, TLS, and encryption
  at rest;
- no employee name, original filename, tenant ID, or other personal value in
  object keys, provider tags, public URLs, metrics, or unrestricted logs;
- documented DPA, subprocessors, support/administrative access, incident notice,
  deletion propagation, return/export, and contract termination behavior;
- versioning/lifecycle configuration consistent with the approved retention
  schedule, without accidental indefinite backup or replica retention;
- auditable access and configuration changes, secret rotation, capacity/cost
  monitoring, restore tests, and provider outage/retry behavior;
- scanner processing location and any scanner subprocessors follow the same
  approved residency and contractual rules;
- an export-and-delete exit test proves that a replacement adapter can migrate
  objects without changing domain identifiers or browser behavior.

These requirements follow the CNIL cloud and processor guidance on effective
location, encryption, access control, logging, backup, contractual allocation,
and verification of processor guarantees:
<https://www.cnil.fr/fr/securite-cloud-informatique-en-nuage> and
<https://www.cnil.fr/fr/securite-gerer-la-sous-traitance>.

#### Conceptual aggregate — not database tables

| Concept                  | Responsibility                                                                                                |
| ------------------------ | ------------------------------------------------------------------------------------------------------------- |
| Employee document        | Establishment-owned category slot, current safe version pointer, availability state, revision, and timestamps |
| Document version         | Immutable version number, sanitized display filename, verified type/size, content checksum, processing result |
| Private binary object    | Provider-owned encrypted bytes addressed only by a server-side opaque key; never a browser or audit value     |
| Document command receipt | Bounded idempotency result for add/replace commands, following the existing personnel command pattern         |
| Personnel document event | Immutable allowlisted access/mutation event scoped by organization, establishment, and employee dossier       |
| Processing job           | Infrastructure-owned quarantine/verification attempt with bounded retry and operational diagnostics           |

The recommended MVP allows at most one current document per approved category.
Replacement creates a new immutable version and changes the current pointer
only after the new version is verified as available. The prior available
version remains current when processing fails. Retention of superseded binaries
is still a legal/security decision, not an automatic indefinite history rule.

#### Proposed file and category limits

- category is a server-side allowlisted code; no unrestricted `Autre` category
  and no user-authored category name;
- the product-approved first-slice category is
  `signed_employment_contract` (`Contrat de travail signé`); it remains blocked
  until legal/privacy approves its purpose, recipients, applicability,
  required/optional status, rights handling, and retention class;
- absence of this document must not make a dossier incomplete when no written
  contract exists or collection is not applicable;
- a signed contract amendment is a distinct future category, not a replacement
  version of the employment contract; unrestricted employment-supporting files
  and work-authorization evidence remain deferred category decisions;
- the product-approved first-slice format is PDF only, with a 10 MiB maximum;
  JPEG, PNG, Office files, archives, executables, scripts, password-protected
  files, and other formats are denied in this slice;
- one current signed employment contract is proposed for the enabled category;
  correction uploads use immutable versions and do not redefine a legal
  amendment as a replacement;
- filename length, page/image limits, content/type verification, and processing
  timeout require security-owner confirmation before implementation.

#### Proposed lifecycle

```text
selected locally
-> authenticated upload accepted into private quarantine
-> uploading
-> processing and verified type/content checks
-> available OR rejected/unavailable
```

For replacement, the existing available version remains readable throughout
upload and processing. A successful verification switches the current version
inside one metadata transaction. A rejected or timed-out replacement never
overwrites the current version.

Database and object storage cannot share one transaction. The later
implementation therefore needs explicit compensation: remove abandoned
quarantine objects, retry bounded processing, mark unresolved objects for
operator review, and never report success until both metadata and storage state
agree. Cleanup must always repeat trusted organization and establishment scope.

#### Proposed server request boundaries

1. every list, add, access, and replace request rederives the tenant and actor
   from the validated server session;
2. the employee is resolved by organization + establishment + employee ID
   before document metadata is read or changed;
3. add/replace validates the category, idempotency key, expected revision,
   filename, declared size/type, and actual received content;
4. files enter a private quarantine namespace; a quarantined or processing
   object is never deliverable;
5. view/download performs a fresh permission and scope check, records an
   allowlisted access grant, and uses an application-controlled response for
   the first slice; stable or public URLs are forbidden;
6. the response exposes only localized category, sanitized filename, verified
   type/size, safe status, version, relevant date when approved, and server
   timestamps.

The recommended first slice uses a server-mediated upload and download for the
10 MiB limit because it keeps authorization, auditing, and provider details in
one server boundary. Direct browser-to-provider upload and short-lived signed
delivery remain later scaling options requiring separate threat review.

#### Proposed document-specific permissions

Introduce separate future permissions `personnel.document.read` and
`personnel.document.manage`, both mapped only to OWNER initially. This avoids
silently treating generic employee read access as authorization for file
content and allows a later manager decision without broadening all personnel
permissions. The names and mapping are proposals only; current
`personnel.employee.read/manage` behavior remains unchanged.

#### Proposed allowlisted events

Reuse the personnel audit infrastructure and its strict organization,
establishment, employee, actor, operation-ID, and safe-projection rules; do not
reuse authentication audit events. Proposed document event types are:

- `employee.documents_viewed`, deduplicated per explicit Documents-tab open;
- `employee.document_viewed` and `employee.document_download_granted`, recorded
  for every successful content-access grant;
- `employee.document_upload_completed` and
  `employee.document_upload_rejected`;
- `employee.document_replaced` only after the new version becomes current.

The employee business-change history must continue filtering out sensitive
access events. A later document activity view may project only safe event type,
localized category, version number, actor display name, and timestamp. It must
not expose filenames, content, provider keys, checksums, tenant IDs, operation
IDs, scanner output, or raw metadata. Denied attempts and scanner failures use
restricted operational security logs rather than the employee-facing history.

#### Proposed stable error semantics

| Condition                              | Safe result/state                                                   |
| -------------------------------------- | ------------------------------------------------------------------- |
| Wrong tenant, employee, or document    | One non-disclosing not-found/forbidden result                       |
| Category not enabled                   | Category unavailable; no upload starts                              |
| Unsupported, oversized, or locked file | Field-level rejection preserving the user's category selection      |
| Storage unavailable                    | Retryable upload/access failure; no success or current-version swap |
| Processing rejected or timed out       | Rejected/unavailable with safe reason code and recovery guidance    |
| Stale document revision                | Conflict requiring current metadata reload before replace retry     |
| Expired delivery                       | Fresh authorization and a new delivery request                      |

#### Phase 2 decisions awaiting approval

| Decision | Recommended choice                                                                      | Required approver       |
| -------- | --------------------------------------------------------------------------------------- | ----------------------- |
| D2-01    | First category: signed employment contract; no generic attachment category              | Product + legal/privacy |
| D2-02    | Separate document read/manage permissions, OWNER-only initially                         | Product + security      |
| D2-03    | PDF only, 10 MiB maximum, one current file for the first approved category              | Product + security      |
| D2-04    | Private EU-region object storage separate from Neon; server-side adapter and quarantine | Security + operations   |
| D2-05    | Server-mediated first-slice upload/download; no stable public or provider URL           | Security + engineering  |
| D2-06    | Reuse personnel audit infrastructure with separate document event projection            | Product + security      |
| D2-07    | Per-category/version retention; no automatic hard delete or indefinite retention        | Legal/privacy + ops     |
| D2-08    | Replacement becomes current only after verification; prior version survives failure     | Product + engineering   |
| D2-09    | Separate EU-approved scanner adapter; storage provider does not imply malware scanning  | Security + operations   |

D2-01's category and D2-03's PDF/10 MiB product choices were approved by the
product owner on 2026-08-15. A signed amendment remains a separate deferred
category. D2-01 still requires legal/privacy approval, and D2-03 still requires
security approval plus confirmation of version and processing limits. Neither
decision is a real-file implementation authorization.

No production-capable vertical slice may start while D2-01 through D2-09 or
their approved revisions remain unresolved. Provider selection,
malware-scanning service, retention durations, backup/restore procedure,
rights/deletion operations, and incident ownership remain release blockers. The
later local-only authorization below does not resolve those production gates.

#### Phase 3 local implementation reconciliation

Product implementation authority was granted on 2026-08-15 for local
development only. The delivered slice follows the provider-neutral proposal but
does not resolve production-provider or legal/operations decisions:

- D2-01/D2-03 product choice is implemented as
  `signed_employment_contract`, PDF only, 10 MiB maximum;
- D2-02 is implemented locally with separate read/manage permissions mapped to
  OWNER only;
- D2-05 uses server-mediated upload and delivery with no public or stable file
  URL;
- D2-06/D2-08 use allowlisted personnel events, bounded idempotency receipts,
  immutable versions, expected revision, and verification before current-version
  replacement;
- D2-04/D2-09 use replaceable interfaces with private local filesystem storage
  and Microsoft Defender; production adapters remain unselected;
- D2-07 remains unresolved, so production collection and release are blocked.

The local runtime removes failed quarantine/available objects when scanning or
metadata persistence fails. Superseded versions remain inaccessible through the
current-content endpoint; their final retention/deletion behavior must be
approved before production.

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
- `employee.history_viewed` when OWNER opens/retries the business history read;
- `employee.access_history_viewed` when OWNER opens/retries the consultation
  history itself.

Sensitive-read events use the same trusted organization, establishment,
employee, actor, operation ID, and server timestamp rules. They are security
audit evidence and are excluded from the employee's business-change timeline.
Repeated delivery with the same operation ID records one access event.
The OWNER-only `Consultations` tab reads 10 collapsed sensitive-read entries per
page on demand using an opaque server cursor. It returns only the action label,
server time, actor display name, and minimal next-page information; tenant IDs,
actor IDs, operation IDs, metadata, IP address, and user-agent are not exposed
to the browser.
For readability, the consultation timeline collapses an immediately preceding
`employee.dossier_viewed` from the same actor into the more specific history
open that followed within two minutes. Both immutable source events remain in
the database; a standalone dossier open remains visible.

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
- a recorded departure derives a warning badge during the final five calendar
  days: days 5 through 2 show `Départ dans X jours`, day 1 shows `Départ demain`,
  and day 0 shows `Dernier jour`; this presentation does not change persistence
  or active/former semantics;
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

## Documents Wave B Phase 0 — signed amendments

Capability status: `PROPOSAL — READ-ONLY DISCOVERY`

Repository reality on 2026-08-15:

- `personnelDocumentCategorySchema` and the PostgreSQL category enum allow only
  `signed_employment_contract`;
- the UI and save action hard-code that category and support one current
  category slot with immutable correction versions;
- no signed-amendment category, relationship, metadata, list behavior, mutation,
  or test exists;
- the current private local storage, scanner, server delivery, document
  permissions, audit infrastructure, and full trusted tenant scope are reusable
  boundaries only after later approval.

### Proposed interaction map — not implemented

| ID   | Operator intent               | Proposed safe behavior                                                                  | Required states                                                      |
| ---- | ----------------------------- | --------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| AB-1 | Inspect signed amendments     | Load only amendment metadata for the trusted employee dossier, separately from contract | Loading, empty, ready, forbidden, unavailable, retry                 |
| AB-2 | Add a distinct amendment      | Validate proposed metadata and one bounded PDF, quarantine/check, then make available   | Selecting, validation, uploading, processing, success/rejected/retry |
| AB-3 | View or download an amendment | Fresh authorization and scoped lookup for every access; server-mediated local delivery  | Pending, available, unavailable, retry                               |
| AB-4 | Correct one amendment scan    | Create a new immutable version for that same amendment; never replace another amendment | Confirmation, conflict, processing, success/failure                  |

### Proposed UI/data dictionary — not a schema

| Concept                    | Classification         | Phase 0 boundary                                                                     |
| -------------------------- | ---------------------- | ------------------------------------------------------------------------------------ |
| Employee dossier reference | Server-owned           | Always resolved with trusted organization + establishment scope                      |
| Amendment reference        | Server-owned proposal  | Distinguishes multiple amendments; opaque ID alone never authorizes access           |
| Category code              | Stored proposal        | Separate allowlisted signed-amendment category; not implemented in enum/contracts    |
| Display label              | Product proposal       | Neutral French label; no unrestricted sensitive description                          |
| Effective/signature date   | Product/legal decision | One or both may support ordering, but neither is approved as mandatory               |
| Amendment number           | Product/legal decision | Must not be invented or inferred from filename/content                               |
| Filename/type/size/status  | Sensitive safe view    | Same sanitization, verification, and safe projection principles as the contract flow |
| Correction version         | Server-owned proposal  | Corrects the same amendment scan; not a later legal amendment                        |

The design may temporarily order fictional examples by a clearly labelled
proposed effective date. It must not treat that choice as a contract or schema
decision. Before Phase 2, product/legal must decide the minimum distinguishing
metadata and whether chronology uses effective date, signature date, explicit
sequence, or a combination.

### Authorization, audit, and sensitive boundary

The Phase 0 proposal is OWNER-only. MANAGER, STAFF, self-service, public, and
service actors remain denied. Every later repository request must carry trusted
organization + establishment + employee scope and must not accept browser role,
permission, tenant, category, or storage keys as authority.

Proposed successful events mirror the existing document taxonomy while safely
identifying the allowlisted amendment category: list opened, upload completed or
rejected, viewed, download granted, and correction replacement completed. Safe
employee-facing projections must omit filenames, dates/meaning, storage keys,
checksums, scanner output, raw metadata, tenant IDs, and operation IDs.

Signed amendments are confidential contractual personal data. Phase 0 adds no
retention rule, completeness rule, automatic employee-field update, production
provider, or legal-compliance claim.

### Documents Wave B Phase 1 prototype status

The approved local prototype uses two typed fictional items with only filename,
proposed effective date, and byte size. The UI derives localized date/size
labels, adds a persistent demonstration notice, and disables all amendment
actions. It creates no amendment resource identifier, category code, transport
shape, server-owned state, storage metadata, audit event, or mutation. The
prototype values are presentation evidence and must not be converted directly
into a database table or contract.

### Documents Wave B Phase 2 technical proposal

Capability status: `TECHNICAL PROPOSAL — NO REAL DATA`

#### Recommended aggregate and safe read model

The implemented `personnel_documents` uniqueness rule represents one current
document per employee/category and is correct for the base signed contract. It
cannot represent several distinct amendments. Phase 2 therefore recommends a
separate logical amendment aggregate and immutable amendment versions rather
than weakening or overloading the signed-contract invariant.

| Value                                             | Ownership                   | Recommended Phase 3 boundary                                                                         |
| ------------------------------------------------- | --------------------------- | ---------------------------------------------------------------------------------------------------- |
| Amendment ID                                      | Server-owned                | Opaque identity for one distinct legal amendment; never authorizes access alone                      |
| Organization, establishment, employee             | Trusted server scope        | Repeated on every lookup, mutation, version, receipt, audit, cleanup, and delivery operation         |
| Effective date                                    | Stored, required proposal   | ISO business date; display/order only; does not mutate employment data                               |
| Amendment reference                               | Stored, optional proposal   | Bounded value copied from the document when available; no inferred or free-form title                |
| Current version and revision                      | Server-owned                | Positive counters for immutable correction versions and optimistic conflict detection                |
| Filename, media type, size, checksum, storage key | Sensitive version metadata  | Same sanitization and server-only storage principles as the existing contract slice                  |
| Upload/scan progress                              | Transient application state | Not a committed amendment; failure cleans the object and records only an allowlisted rejection event |

The safe browser item would expose only the opaque amendment ID, proposed
effective date, optional reference, sanitized filename, PDF type, byte size,
current version, revision, and uploaded time. It must omit tenant IDs, storage
key, checksum, scanner output, uploader ID, operation ID, and raw audit metadata.

#### Ordering and paging

- newest effective date first;
- then newest server creation time and opaque ID for a stable order;
- cursor pagination with ten items per page;
- replacement does not change the amendment's effective date or list position;
- changing metadata is deferred; a wrong effective date requires a separately
  approved correction flow rather than silently rewriting history.

#### Command and failure semantics

Add receives employee ID, effective date, optional reference, idempotency key,
and one bounded PDF. Replace additionally receives amendment ID and expected
revision. Browser input never supplies trusted tenant, role, permission,
category, storage key, checksum, or processing result.

The later server flow is: authorize -> validate -> write private quarantine ->
scan -> promote -> atomically commit scoped amendment/version/receipt/audit
metadata -> return a safe item. A failure before metadata commit removes the
new object and leaves no visible amendment. Replacement verifies the new object
before swapping the current-version pointer; a failure preserves the old
version. Duplicate retries return the committed result, while key reuse with a
different payload returns a stable conflict.

#### Authorization and audit recommendation

Reuse the implemented OWNER-only `personnel.document.read` and
`personnel.document.manage` permissions. MANAGER, STAFF, public, service, and
self-service actors remain denied. Every list, item, mutation, and content grant
must include trusted organization + establishment + employee scope; amendment
ID alone always fails closed.

Opening the Documents tab should append one deduplicated
`employee.documents_viewed` event for the whole surface, not a second event just
because the amendment section is present. Successful add, rejected upload,
view, download grant, and replacement may reuse the existing document event
taxonomy with the allowlisted amendment category and opaque amendment ID.
Employee-facing audit projections omit the filename, effective date, reference,
storage/scanner values, tenant IDs, and operation IDs.

#### Phase 2 decision register

| ID     | Recommended choice                                                                      | Approval state                      |
| ------ | --------------------------------------------------------------------------------------- | ----------------------------------- |
| AB2-01 | Separate amendment aggregate; do not alter the base-contract single-slot meaning        | Product/engineering pending         |
| AB2-02 | Required effective date; optional bounded reference; no other structured legal metadata | Product/legal pending               |
| AB2-03 | Effective-date descending cursor order, ten items per page                              | Product pending                     |
| AB2-04 | Reuse existing OWNER-only document read/manage permissions                              | Product/security pending            |
| AB2-05 | PDF only, 10 MiB, existing provider-neutral storage/scanner boundaries                  | Security pending for real-file work |
| AB2-06 | One Documents-surface open event; reuse allowlisted item mutation/access events         | Product/security pending            |
| AB2-07 | Verification-before-commit/add and verification-before-swap/replace                     | Engineering/security pending        |
| AB2-08 | Local-only first vertical slices; production provider and release remain blocked        | Product/operations pending          |
| AB2-09 | No metadata edit/delete/archive/legal hold in the local MVP                             | Product/legal pending               |
| AB2-10 | Per-category/version retention, rights, backup, restore, incident and deletion rules    | Legal/security/operations pending   |

Phase 2 creates no schema, migration, enum, transport contract, repository,
permission, API, server action, storage object, or real employee data.

### Documents Wave B Phase 3 local implementation reconciliation

AB2-01 through AB2-09 were approved on 2026-08-15 for local implementation.
Migration `0008_omniscient_colonel_america.sql` adds separate scoped amendment,
immutable-version, and hashed command-receipt metadata. The current
`signed_employment_contract` enum and its one-category uniqueness rule are
unchanged.

The implemented read contract exposes the safe Phase 2 fields and ten-item
cursor page. Add stores required effective date and optional bounded reference;
replace accepts amendment ID plus expected revision and preserves the aggregate
metadata. Both commands use 24-hour actor/establishment-scoped idempotency
receipts. File bytes use the existing local private storage and scanner, while
content access uses a separate scoped server route and fresh authorization.

Opening Documents still writes one deduplicated `employee.documents_viewed`
event through the base document load. Amendment listing adds no second open
event. Add/reject/view/download/replace reuse minimized document event names
with the allowlisted amendment category. Phase 3 adds no metadata edit,
delete/archive/legal hold, extraction, employment-field mutation, new role, new
entitlement, production provider, or production release behavior.

AB2-10 remains unresolved. Production stays fail-closed until retention,
employee-rights handling, deletion propagation, backups/restores, providers,
monitoring, and incident ownership are approved and implemented.

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

## Wave C Phase 0 — extended employment and Formalités reuse

### Repository inventory

The real employee dossier currently stores identity, position, qualification,
CDI/CDD, expected CDD end date, full-/part-time category, entry/departure dates,
and a revision. The `Relation de travail` tab displays the existing subset.
`/equipe/formalites-personnel` is a truthful planned page: no Formalités domain,
contract, persistence, workflow, generation service, status model, or test was
found. Signed documents and amendments are separate evidence aggregates and do
not update these employee facts.

### Phase 0 conceptual dictionary

This table is discovery input, not a database or transport design.

| Concept                           | Classification                      | Proposed owner and boundary                                                      |
| --------------------------------- | ----------------------------------- | -------------------------------------------------------------------------------- |
| Employment term and expected end  | Existing stored employee facts      | Employee dossier, organization + establishment scoped                            |
| Work-time category                | Existing stored employee fact       | Employee dossier; does not describe a schedule                                   |
| CDD reason                        | Proposed stored confidential fact   | Employee dossier; controlled value, applicable only to CDD                       |
| Contractual weekly duration       | Proposed stored confidential fact   | Employee dossier; display hours/week, later domain proposal uses integer minutes |
| Completeness for Wave C           | Proposed derived value              | Derived from approved applicable fields; never stored as authority               |
| Open section, draft input, errors | Transient UI state                  | Browser only; never authorization or domain authority                            |
| Signed PDF and amendment files    | Existing integration-owned evidence | Documents aggregates; never a source for automatic extraction                    |
| Formalités status/output          | Deferred integration-owned value    | Future Formalités domain, not Salariés                                           |

No exact enum values for the CDD reason are approved. The design may use
clearly fictional labels to test comprehension, but Phase 2 must define the
allowlist, applicability, correction history, validation, and legal ownership
before implementation. No free-text reason or named replacement employee is
proposed. The exact minimum/maximum weekly duration and representation also
remain Phase 2 decisions.

### Authorization, ownership, and sensitive handling

Every future read or mutation must derive the active organization,
establishment, membership, role, and permissions from the trusted server
session. Lookup by employee ID alone and browser-provided tenant or role values
remain forbidden. The proposed Phase 0 audience is OWNER only; no permission or
entitlement change is approved.

CDD reason and contracted duration are confidential personnel data. Future
mutation audit must record actor, employee, establishment, action, time, and an
allowlisted changed-field group, but not copy sensitive old/new values into
generic audit metadata. Reads, retention, employee rights, deletion, legal
hold, backup/restore, and production monitoring require later approval.

### Interaction proposal for design discovery

1. OWNER opens an employee dossier and selects `Relation de travail`.
2. Existing authoritative employment information loads unchanged.
3. A distinct complementary-contract section explains present, missing, and
   not-applicable information without implying persistence.
4. CDD reason is not applicable for CDI. Contractual duration may be missing
   without being guessed from `Temps plein` or `Temps partiel`.
5. Any future edit would require server validation, expected revision,
   idempotent retry, minimized audit, conflict recovery, and a fresh scoped
   read. None of those mutations is authorized in Phase 0.

Required discovery states are loading, ready, incomplete, not applicable,
forbidden, validation, pending, conflict, save failure with preserved input and
retry, and responsive layout. Remuneration, probation, weekly distribution,
apprenticeship, Formalités workflow, alerts, register/PDF, OCR, delegation,
self-service, transfer, and merge remain deferred.

### Wave C Phase 1 local prototype status

The approved prototype adds a route-local typed presentation fixture to the
existing `Relation de travail` tab. It displays a fictional CDD reason and
fictional weekly duration. For an existing CDI dossier, the CDD-reason
presentation changes to `Non applicable — contrat CDI`; this is display logic,
not a persisted completeness or legal rule.

The section is labelled `Prototype` and `Aperçu sans sauvegarde`. It states that
the values are fictional, are not attached to the selected employee, and cannot
be edited or saved. The existing header `Modifier` action retains its current
real minimum-field behavior and does not submit either prototype value. No
fixture identity, tenant scope, request payload, action, URL, storage value, or
server-owned state exists.

Phase 1 creates no schema, migration, enum, contract, permission, API,
repository, server action, audit event, Formalités status, or real employee
data. The two fixture values remain presentation evidence and must not be copied
directly into a later data model.

### Wave C Phase 2 technical proposal

Capability status: `APPROVED FOR LOCAL PHASE 3; PRODUCTION BLOCKED`

Phase 2 was authorized on 2026-08-16 for documentation only. It maps the
approved prototype to domain choices without changing the fixture or creating a
schema, migration, enum, contract, permission, API, repository, action, or real
employee data.

#### Current legal-source boundary

Reviewed on 2026-08-16:

- Légifrance, [Code du travail, article L1242-2](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000037312980),
  lists the principal cases in which a fixed-term contract may be concluded;
- Légifrance, [Code du travail, article L1242-3](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000052437237),
  contains additional special cases and changed on 2026-01-01;
- Légifrance, [Code du travail, article L3121-27](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000033020376),
  states the 35-hour statutory week for full-time work, while other provisions
  and collective agreements may affect interpretation.

YUTA records operator-declared contract facts; it does not certify that a CDD
reason or weekly duration is legally valid. The controlled list must be
versioned and re-reviewed before production. No free-text `other` choice is
recommended because it would hide unsupported legal cases.

#### Proposed safe domain values

This is a contract proposal, not a table definition.

| Value                      | Classification                    | Proposed Phase 3 rule                                                                       |
| -------------------------- | --------------------------------- | ------------------------------------------------------------------------------------------- |
| `fixedTermReasonCode`      | Nullable confidential stored fact | Null for CDI; required for supported CDD writes                                             |
| `contractWeeklyMinutes`    | Nullable confidential stored fact | Positive integer minutes; independent from Planning and Pointage                            |
| Reason/duration labels     | Derived presentation              | French labels from stable codes and minute formatter                                        |
| Applicability/completeness | Derived presentation              | Reason not applicable for CDI; neither field changes current dossier completeness initially |
| Draft inputs/errors        | Transient UI state                | Preserved after validation, conflict, or save failure                                       |

Recommended first allowlist for restaurant use:

| Stable code                   | French label                        | Initial support    |
| ----------------------------- | ----------------------------------- | ------------------ |
| `employee_replacement`        | Remplacement d’un salarié           | Supported proposal |
| `temporary_activity_increase` | Accroissement temporaire d’activité | Supported proposal |
| `seasonal_employment`         | Emploi saisonnier                   | Supported proposal |
| `customary_use_employment`    | CDD d’usage                         | Supported proposal |

Replacement sub-reasons, the replaced person's identity, business-owner or
agricultural replacement, defined-purpose CDD, recruitment/training/research/
reconversion cases, and future legal categories remain unsupported. The UI must
say `Cas non pris en charge` and stop rather than accepting free text or silently
mapping the case to a supported code.

`contractWeeklyMinutes` is proposed as an integer to avoid decimal-hour
rounding. The UI uses separate `Heures` and `Minutes` inputs, accepts minutes
from 0 to 59, and validates a total from 1 to 2,880 minutes (48 hours). This is
a safe MVP input boundary, not a legal-compliance guarantee. Exceptions or
collective-agreement interpretations are not handled automatically.

#### Applicability and transition rules

- existing rows remain null after a later additive migration and are displayed
  as `Non renseigné`;
- Wave C fields do not change the existing completeness count during rollout;
- CDI requires a null CDD reason and displays `Non applicable — contrat CDI`;
- changing CDD to CDI requires confirmation and clears the reason atomically;
- changing CDI to CDD requires the existing expected end date plus one supported
  reason before save;
- weekly duration does not infer or rewrite `Temps plein`/`Temps partiel`;
- a possible mismatch is not auto-corrected because collective rules are not
  represented;
- signed contracts and amendments never populate either field automatically.

#### Mutation, authorization, and audit proposal

Reuse the employee dossier aggregate and the existing OWNER-only
`personnel.employee.read` / `personnel.employee.manage` permissions. Every read
and mutation repeats trusted organization + establishment + employee scope.
Resource ID alone, browser-provided scope, MANAGER, STAFF, public, service, and
self-service actors remain denied.

The existing header `Modifier` action is the only edit entry point. A later
mutation extends the existing revision-protected, idempotent, atomic employee
update instead of adding a second endpoint or save button. Validation failure
preserves both fields; stale revision returns the existing conflict flow; retry
with the same key returns the committed result.

Reuse `employee.employment_updated`. Audit metadata may list the allowlisted
field groups `fixedTermReasonCode` and `contractWeeklyMinutes`, but must not copy
old/new reason or duration values. Opening the dossier already creates the
deduplicated sensitive-read event; opening the employment tab adds no duplicate
event. The employee history uses safe French field labels only.

#### Phase 2 decision register

| ID     | Recommended choice                                                            | Approval state             |
| ------ | ----------------------------------------------------------------------------- | -------------------------- |
| WC2-01 | Reuse the establishment-owned employee dossier aggregate                      | Approved for local Phase 3 |
| WC2-02 | Add nullable reason-code and integer-minute concepts                          | Approved for local Phase 3 |
| WC2-03 | Support only the four restaurant-relevant reason codes above                  | Approved for local Phase 3 |
| WC2-04 | No free-text `other`; unsupported cases fail closed                           | Approved for local Phase 3 |
| WC2-05 | Accept 1–2,880 minutes with separate hours/minutes inputs                     | Approved for local Phase 3 |
| WC2-06 | Keep legacy nulls and exclude Wave C fields from completeness initially       | Approved for local Phase 3 |
| WC2-07 | Reuse the single existing edit flow, revision, idempotency, and atomic update | Approved for local Phase 3 |
| WC2-08 | Reuse existing OWNER-only employee permissions                                | Approved for local Phase 3 |
| WC2-09 | Reuse minimized employment audit without old/new values                       | Approved for local Phase 3 |
| WC2-10 | One dossier-open event; no employment-tab duplicate                           | Approved for local Phase 3 |
| WC2-11 | Documents and Formalités cannot write these facts in this wave                | Approved for local Phase 3 |
| WC2-12 | Deliver local vertical slices before any production consideration             | Approved for local Phase 3 |

#### Proposed later vertical slices

1. additive nullable storage + safe read projection + tenant-isolation tests;
2. OWNER edit of supported fields through the existing dialog/action;
3. extend employee creation with the same rules after edit behavior is proven;
4. remove the Wave C fixture and no-save notice, then perform responsive,
   authorization, conflict, retry, audit, and as-built QA.

### Wave C Phase 3 local implementation reconciliation

The product owner approved WC2-01 through WC2-12 and local Phase 3 on
2026-08-16. Migration `0009_heavy_sauron.sql` adds the two nullable columns and
the four-value reason enum. Existing rows remain null. Contracts, scoped reads,
create/edit actions, revision/idempotency handling, and minimized employment
audit now carry the approved fields.

The existing `Modifier` dialog remains the only edit entry point. CDD creation
requires a supported reason and weekly duration; edit preserves legacy nulls,
requires a reason for new CDD transitions, and requires explicit confirmation
before a stored CDD reason is cleared by switching to CDI. The detail card now
reads persisted values and the fictional prototype/no-save notice is removed.
Documents and Formalités do not write either value.

This implementation is local only. The supported legal subset, production
privacy/retention/operations, deployment, and production data collection still
require separate approval.

## Wave D Phase 0 — `À traiter` data and interaction discovery

Status: `PHASE 1 TYPED FIXTURE — NO CONTRACT, QUERY, OR REAL DATA AUTHORIZED`

### Repository inventory

- `PersonnelEmployeeListResponse` already returns employee summaries, active /
  upcoming / former view, `completenessReasons`, `departureDate`, counts, and a
  cursor page under trusted organization + establishment scope.
- current minimum completeness covers only given names, family name, position,
  and qualification;
- the existing presentation already labels recorded departures during the last
  five establishment-local calendar days;
- signed base-contract availability exists in personnel document persistence,
  but the current contract/repository reads it only for one scoped employee
  when the `Documents` tab opens;
- no batch document-presence projection, action-item contract, combined loader,
  task/notification table, acknowledgement state, assignment, scheduled job,
  polling, or personnel notification outbox exists;
- the booking notification/outbox domain belongs to booking and must not be
  reused for personnel by analogy;
- Formalités remains a planned placeholder with no status or deadline source.

### Proposed derived UI model

This UI model is not a database schema.

| Proposed kind                  | Authoritative source                                      | Inclusion rule                                                                  | Safe presentation                                       | Existing resolving entry point |
| ------------------------------ | --------------------------------------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------- | ------------------------------ |
| `incomplete_employee_dossier`  | employee summary `view` + `completenessReasons`           | active/upcoming employee with at least one approved minimum reason              | employee name + `Dossier incomplet`                     | existing edit dialog           |
| `missing_signed_base_contract` | existing signed-base-contract record/availability         | active/upcoming employee with no current available signed base contract         | employee name + `Contrat signé manquant`                | existing Documents add flow    |
| `departure_within_five_days`   | employee summary `view` + `departureDate` + business date | active employee, departure from business date through business date plus 5 days | employee name + text-backed relative label + exact date | existing departure review flow |

Former employees are excluded from the first MVP. Missing documents do not add
employee `completenessReasons` and do not alter the existing incomplete count.
`expectedEndDate` is not a substitute for `departureDate`. Missing amendments
are not derived as issues.

The item identity, grouping, ordering, maximum visible count, cursor shape, and
refresh contract remain later interaction/technical decisions. Phase 0 rejects
using array index, employee name, or a browser-composed tenant value as a
trusted resource identity.

### Proposed interaction map

| Interaction                          | Current reality                                      | Phase 0 proposal                                                                     |
| ------------------------------------ | ---------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Load `/equipe/salaries`              | loads paged employee list/counts only                | later load a bounded derived overview under the same trusted scope                   |
| Select incomplete dossier item       | no item exists                                       | select exact employee and open existing edit flow                                    |
| Select missing-contract item         | document flow opens only from selected dossier       | select exact employee, open drawer `Documents`, then existing add action             |
| Select upcoming-departure item       | five-day badge exists in list/drawer                 | select exact employee and expose existing departure review/correction action         |
| Finish an existing resolving action  | route refreshes its authoritative source             | refresh overview; never mark an item complete in browser state                       |
| Dismiss / snooze / assign / bulk act | no domain or persistence exists                      | not available                                                                        |
| Retry                                | page and document reads have separate failure states | later retry only the failed derived source without fabricating missing-document data |

### Authorization and ownership

The route remains authenticated and establishment-required. Proposed access is
OWNER-only. Employee-derived items require `personnel.employee.read`; a
missing-document item also requires `personnel.document.read`. Because both
permissions currently allow only OWNER, Phase 0 proposes no new role or
permission. A later manager delegation cannot infer document status from
employee-read access alone.

Every read must repeat trusted `organizationId` + `establishmentId` scope and,
for item actions, the employee/resource scope. Resource-ID-only lookup and
browser-provided organization, establishment, role, permission, item kind, or
document-presence value are forbidden. The same person at two establishments
produces independent dossier-derived items.

### Date, refresh, and truth rules

- use the establishment timezone to derive the business date;
- departure inclusion is calendar-date based and reuses the approved 0–5-day
  presentation rule;
- source records, not a cached browser item, decide whether an item still exists;
- no polling interval, scheduled evaluation, background job, or push delivery
  is approved; a normal authorized read/refresh recomputes the overview;
- partial document-source failure must show document status as unavailable,
  never interpret the failure as “contract missing”;
- no-items means no supported derived issue/event exists at read time; it is
  not a legal-compliance or personnel-completeness guarantee.

### Sensitive read, audit, and retention

The overview exposes a cross-employee summary of confidential HR states. A
later phase must select an audit owner and approve a single bounded,
deduplicated overview-access event. Do not append one employee-history event
per rendered item and do not include the item list, missing fields, filenames,
dates, or document metadata in audit payloads.

The Phase 0 design stores no action item, acknowledgement, or derived snapshot,
so it adds no separate action-item retention class. Source employee, document,
and audit retention remain governed by their own unresolved production gates.

### Required later states and tests

Before real implementation, approve a contract/query design and test:

- two organizations and two establishments with no cross-scope names, counts,
  issue kinds, dates, or existence leakage;
- OWNER success and MANAGER/STAFF/public denial;
- active/upcoming/former inclusion boundaries;
- 0, 1, 2, 5, and 6 calendar days around a recorded departure;
- missing minimum fields independently from missing signed contract;
- unavailable document source not becoming a false missing-contract item;
- source correction followed by fresh read removes only the resolved item;
- bounded result ordering/pagination once those decisions are approved;
- responsive, keyboard, focus, loading, no-items, partial-error, full-error,
  retry, and forbidden presentation.

Phase 0 creates no schema, migration, enum, contract, repository query, loader,
action, API, permission, audit event, task state, notification behavior,
fixture, or UI component.

### Phase 1 fixture boundary

The route-local prototype owns a presentation-only discriminated union and
three immutable fictional items. Its `draft-*` identities are not employee,
document, tenant, or future action-item identifiers. The component receives no
trusted scope and performs no reads or writes. Its disabled buttons make no
navigation, dialog, action, or refresh claim.

This fixture is disposable discovery evidence. It must not be extended into a
transport contract or mapped directly to a table. Phase 2 must still decide
ordering, limits, truthful source-state composition, interaction entry points,
and the minimized overview-access audit design before real integration can be
proposed.

### Wave D Phase 2 technical proposal

Capability status: `PHASE 3 LOCAL REAL-DATA SLICE — PRODUCTION BLOCKED`

Phase 2 was authorized on 2026-08-16 for documentation only. It maps the
approved prototype to a bounded read model and interaction contract without
changing the fixture or creating a schema, migration, transport contract,
repository query, server action, permission, audit event, or real-data UI.

#### Proposed read ownership and source composition

A later real slice should add one establishment-scoped personnel overview read
behind the Backoffice server boundary. It receives trusted `organizationId` and
`establishmentId` from the validated session plus the establishment business
date. It must not derive scope, role, permissions, business date, or document
presence from browser input.

The read remains derived; no action-item table or snapshot is proposed. Use
bounded set-based reads rather than calling the existing per-employee document
loader in a loop:

1. one employee-source read for incomplete active/upcoming dossiers and active
   departures in the 0–5 local-day window;
2. one document-metadata presence read for active/upcoming employees without a
   current available `signed_employment_contract` record;
3. merge only safe item projections under the same trusted tenant scope.

The overview reads document metadata presence only. It never reads storage
keys, filenames, versions, file bytes, scanner/provider state, amendments, or
PDF contents. A document-source error stays distinct from an absent contract.

#### Proposed transport-safe UI model

This is a read-contract proposal, not a database schema.

| Field                    | Classification              | Rule                                                                                                |
| ------------------------ | --------------------------- | --------------------------------------------------------------------------------------------------- |
| `kind`                   | Derived allowlisted value   | `incomplete_employee_dossier`, `missing_signed_base_contract`, or `departure_within_five_days` only |
| `employeeId`             | Scoped resource reference   | Used only to request a fresh server-authorized action target; never trusted by itself               |
| `employeeDisplayName`    | Confidential presentation   | Given/family name only; no email, phone, qualification, CDD reason, or weekly duration              |
| `departureDate`          | Confidential date-only fact | Present only for the departure item; relative copy is derived with the establishment business date  |
| `pageInfo.nextCursor`    | Opaque transient navigation | Five items per group; no total count and no cursor in the page URL                                  |
| `documentSourceStatus`   | Transient source truth      | `ready` or `unavailable`; unavailable never produces a missing-contract item                        |
| labels/icons/action copy | Derived presentation        | Mapped from `kind` in the UI; not supplied as trusted behavior by the browser                       |

No item has a persisted task ID. A client render key may combine the allowlisted
kind and employee ID, but that value has no authorization or mutation meaning.
Do not return completeness reason details, document identifiers, filenames,
storage metadata, source row versions, audit IDs, organization IDs, or
establishment IDs in the overview item.

#### Ordering, limits, and group navigation

- show at most five correction items and five dated events per group page;
- use independent opaque cursors and independent `Précédent` / `Suivant`
  controls; hide controls when one page is sufficient;
- keep previous cursors only as transient client state, following the existing
  consultations pagination pattern; reload resets both groups to page one;
- do not show a total, `Voir tout`, hidden-item count, infinite scroll, or new
  route;
- order correction items neutrally by family name, given names, employee ID,
  then kind (`incomplete_employee_dossier` before
  `missing_signed_base_contract` only as a deterministic tie-breaker);
- order dated events by departure date ascending, then family name, given
  names, and employee ID;
- do not compute priority or urgency scores.

The correction cursor represents the merged ordering across employee and
document sources. When the document source is unavailable, show the first
bounded incomplete-dossier page plus a partial-warning row, disable correction
pagination, and reset that group to page one on retry. This avoids presenting
an incomplete merged page as complete.

#### Proposed action-target resolution

Overview items can reference employees outside the currently loaded employee
list page. A later action therefore cannot reuse `data.items` as authority or
place an employee identifier in the URL. It should request a fresh
server-authorized target under organization + establishment + employee scope
and recheck the item's source condition before opening a flow.

| Item action            | Fresh-result behavior                                                                                                                                                                                                                                                     |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Compléter le dossier` | If still incomplete, open the existing edit dialog with the current employee revision and focus the first missing minimum field. If resolved, show a neutral changed-state message and refresh.                                                                           |
| `Ajouter le contrat`   | If the signed base contract is still absent, open the existing dossier drawer on `Documents` and reveal the existing add form. If a contract now exists or document status is unavailable, do not open an upload form; show the current truthful state and refresh/retry. |
| `Voir le départ`       | If the departure still falls within 0–5 local days, open the existing dossier overview and focus its departure information. Do not open the correction dialog automatically; the existing explicit `Corriger le départ` action remains separate.                          |

The browser-provided employee ID and expected kind are untrusted hints. The
server repeats OWNER permission and tenant scope, loads the current dossier,
and returns a non-disclosing not-found/forbidden result. No overview button
marks, dismisses, acknowledges, assigns, or mutates an item.

#### Refresh and truthful state contract

- initial authorized read may use the page server loader; group pagination and
  retry may use a later validated server action without adding a public API;
- pagination keeps current items visible with `aria-busy`, disables the active
  group's controls, and replaces them only after a successful response;
- edit and departure success already refresh the route; a later Documents
  parent callback must also refresh after a verified contract save;
- after any resolving flow, source truth decides whether the item remains;
  never remove it optimistically in browser state;
- a stale or resolved target shows `Cet élément a changé. La liste a été
actualisée.` rather than opening an inappropriate flow;
- employee-source failure replaces the complete surface with error + retry and
  no stale names, counts, kinds, or dates;
- document-source failure keeps truthful employee-derived items, adds
  `Statut des contrats indisponible`, and never fabricates contract issues;
- a genuine no-items result uses one compact neutral line and does not claim
  legal or HR completeness;
- route-level forbidden remains non-disclosing and does not mount the overview;
- no polling, timer, scheduled job, notification, background refresh, email,
  SMS, push, calendar delivery, or outbox is proposed.

#### Authorization and proposed minimized audit owner

Real reads require both existing OWNER-only permissions:
`personnel.employee.read` for the surface and
`personnel.document.read` before contract-presence items can be returned.
Action targets additionally require the existing manage permission owned by
their real resolving flow. Every repository call repeats organization +
establishment scope; resource-ID-only lookup remains forbidden.

The recommended later sensitive-read owner is one
`personnel.action_overview_viewed` event in `auth_audit_events` per authorized
overview read, scoped to actor + organization + establishment with no subject
employee. It must not create one employee-history event per item and must not
store item IDs, names, counts, issue kinds, dates, completeness reasons,
document metadata, cursor values, browser data, token data, or file data. This
new allowlisted event and its retention/visibility still require security and
product approval before implementation; it should not appear in an employee's
`Historique` or `Consultations` timeline.

#### Phase 2 decision register

| ID     | Recommended choice                                                                                                              | Approval state             |
| ------ | ------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| WD2-01 | Keep a derived overview; create no task/snapshot persistence                                                                    | Approved for local Phase 3 |
| WD2-02 | Use one tenant-scoped overview owner with bounded set-based employee and document-presence reads; no per-employee document loop | Approved for local Phase 3 |
| WD2-03 | Return only kind, employee ID/display name, optional departure date, page info, and document-source status                      | Approved for local Phase 3 |
| WD2-04 | Use independent five-item cursor pages per group with previous/next; no totals, `Voir tout`, URL cursor, or new route           | Approved for local Phase 3 |
| WD2-05 | Use neutral name/kind ordering for corrections and earliest-departure ordering for events                                       | Approved for local Phase 3 |
| WD2-06 | Revalidate a fresh tenant-scoped action target; never use the current list page or browser item as authority                    | Approved for local Phase 3 |
| WD2-07 | Open existing edit, Documents-add, and departure-review entry points exactly as mapped above                                    | Approved for local Phase 3 |
| WD2-08 | Refresh from source after real flow success; no optimistic completion, polling, or background delivery                          | Approved for local Phase 3 |
| WD2-09 | Treat document-source failure as partial unavailability, never as a missing contract; full employee failure discloses no items  | Approved for local Phase 3 |
| WD2-10 | Reuse existing OWNER employee/document permissions and strict organization + establishment + employee scope                     | Approved for local Phase 3 |
| WD2-11 | Record one minimized `personnel.action_overview_viewed` event in `auth_audit_events`, not per-item history                      | Approved for local Phase 3 |
| WD2-12 | Replace the development fixture with the real local slice; production remains blocked                                           | Approved for local Phase 3 |

#### Required tests before any real-data slice

- two organizations and two establishments with no cross-scope names, item
  existence, dates, source status, or cursor leakage;
- OWNER success; MANAGER, STAFF, service, public, missing-establishment, and
  missing document-permission denial;
- active/upcoming/former boundaries and departure days 0, 1, 2, 5, and 6;
- one employee producing zero, one, or both correction kinds without merging
  their actions;
- signed base contract present, absent, replaced, quarantined/unavailable, and
  document-query failure without inspecting file bytes;
- deterministic five-item cursor pages with ties, no duplicate/omitted items,
  separate group navigation, and retry reset after partial failure;
- stale target resolved/changed between overview read and click;
- successful edit, document add, or departure correction followed by a fresh
  derived read;
- exactly one minimized overview audit event per authorized read and no event
  or disclosure for denied reads;
- loading, no-items, partial-error, full-error, retry, changed-state, keyboard,
  focus, accessible names, 1440/1024/768/390 layout, and horizontal overflow.

### Wave D Phase 3 local implementation reconciliation

WD2-01 through WD2-12 and the local real-data slice were approved on
2026-08-17. The implementation adds a transport-safe bounded contract, one
tenant-scoped derived repository read, fresh target revalidation, server
actions, and the real `À traiter` UI. It reuses the existing employee edit,
Documents add, and departure-review flows. The fixture and its disclosure were
removed.

No schema, migration, task table, reminder, notification, scheduler, public
API, or new permission was added. Document composition reads presence metadata
only. Each authorized overview read records one minimized
`personnel.action_overview_viewed` event with actor, organization, and
establishment only. The UI and its actions are guarded by development mode;
production neither queries nor renders the overview.

Contract, Backoffice, and database-repository tests cover the bounded model,
presentation mapping, tenant isolation, paging, target revalidation, and audit
shape. Database integration execution remains conditional on the repository's
explicit local test opt-in.

### Wave D Phase 4 integration and production-boundary audit

Phase 4 was authorized and completed on 2026-08-17 as a local integration and
production-boundary audit. It did not authorize production delivery. The audit
reconfirmed this path:

```text
validated OWNER session and active establishment
-> development-only runtime gate
-> employee/document OWNER permissions
-> organization + establishment scoped derived repository reads
-> minimized transport model
-> fresh organization + establishment + employee target revalidation
-> existing edit, Documents-add, or departure-review flow
```

The duplicated environment checks in the page loader and server actions now
use one tested runtime-gate helper. It returns enabled only for
`development`; `production`, `test`, and missing values fail closed. A fresh
production build was started locally on an isolated port with the authenticated
OWNER session: `/equipe/salaries` rendered normally, made no Wave D surface
visible, and produced no browser warning or error. The development server still
rendered the real item and action without prototype disclosure.

No schema, migration, repository semantics, transport field, permission,
public API, audit payload, task persistence, notification, file-provider, or
production behavior changed in Phase 4. The mutation-capable database
integration suite remains opt-in and was not forced against the configured
local database. Production remains blocked by the existing legal, privacy,
retention, security, backup/restore, and operations gates.

## Wave E Phase 0 data and interaction inventory

### Current repository fields versus register needs

| Register information                          | Current repository evidence  | Phase 0 disposition                                           |
| --------------------------------------------- | ---------------------------- | ------------------------------------------------------------- |
| Names                                         | `givenNames`, `familyName`   | Reuse proposal                                                |
| Employment/job                                | `position`                   | Reuse proposal; legal wording review required                 |
| Qualification                                 | `qualification`              | Reuse proposal                                                |
| Entry and exit dates                          | `entryDate`, `departureDate` | Reuse proposal                                                |
| CDD mention                                   | `employmentTermType`         | Derivable presentation proposal                               |
| Part-time mention                             | `workTimeCategory`           | Derivable presentation proposal                               |
| Nationality                                   | Absent                       | New confidential field proposal; not authorized               |
| Birth date                                    | Absent                       | New confidential field proposal; not authorized               |
| Sex                                           | Absent                       | New confidential field proposal; not authorized               |
| Hiring/dismissal authorization date/request   | Absent                       | Conditional model unresolved                                  |
| Work-authorization title type/number and copy | Absent                       | More-sensitive conditional domain; separate document decision |
| Temporary-work company name/address           | Absent                       | Worker-category/domain unresolved                             |
| Employer-group name/address                   | Absent                       | Worker-category/domain unresolved                             |
| Apprentice/professionalization mention        | Absent                       | Apprenticeship domain deferred                                |
| Stagiaire name, dates, tutor, place           | No stagiaire aggregate       | Separate register part deferred from implementation           |
| Service-civique arrival details               | No service-civique aggregate | Separate register part unresolved                             |

CDD reason, expected end date, contractual weekly minutes, signed PDFs, audit
metadata, login identity, and POS user data are not automatically register
fields. They must not be exported merely because they exist elsewhere.

### Missing domain guarantees

The current employee table stores mutable current values and orders the employee
list for product browsing, not as an indelible register. `createdAt`, employee
UUID, `entryDate`, and current list order are not approved substitutes for a
stable legal hiring/arrival sequence. The employee history is bounded to
allowlisted business events and cannot reconstruct all prior values or every
legally relevant event.

A later technical phase must choose and approve a register-owned append-only
ledger, dated versions, or another demonstrably non-destructive model. It must
define correction semantics, arrival sequence, former-person retention,
multi-establishment cases, and how employee facts are copied or referenced
without creating two conflicting sources of truth. Phase 0 selects none of
these storage designs.

### Proposed interaction map

```text
OWNER opens Salariés
-> chooses proposed Registre du personnel entry point
-> server rederives active organization and establishment
-> server checks proposed register-read permission
-> register read returns ordered minimized rows plus readiness state
-> UI shows missing information without inventing values
-> OWNER requests PDF
-> server reauthorizes proposed export permission and source version
-> server creates one protected response from the same ordered snapshot
-> minimized export audit is recorded
-> browser downloads without a public or stable URL
```

Every later read and export fails closed. Browser-supplied organization,
establishment, role, permission, sequence, person category, or snapshot version
is untrusted. An export cannot reuse a stale browser copy as authority.

### Proposed data classes

- **Stored later, after approval:** missing register fields, person category,
  canonical arrival sequence, dated corrections/history, retention markers.
- **Derived:** CDD and part-time labels from current controlled fields; readiness
  counts from the approved required-field rules.
- **Transient:** open sections, responsive layout, export pending/error state.
- **Generated:** PDF bytes from one authorized structured snapshot; not stored
  by default and never a source field.
- **External/legal:** work-authorization copies, detached-worker annexes,
  inspection/CSE presentation rules; not integrated in the MVP.

### Authorization, audit, and retention proposal

Current `personnel.employee.read` does not by itself authorize a multi-person
register or export. Phase 2 must decide whether to add
`personnel.register.read` and `personnel.register.export`, initially OWNER-only.
Every query remains organization + establishment scoped.

Proposed allowlisted audit actions are `personnel.register_viewed` and
`personnel.register_exported`. Audit payloads may contain only actor, trusted
scope, action, time, and a non-sensitive snapshot/version identifier. They must
not contain names, birth dates, nationality, sex, authorization numbers,
missing-field values, PDF bytes, filenames, or download URLs.

Five-year retention after a person leaves the establishment is the reviewed
legal baseline for register mentions, but its start event, archives, legal
hold, correction, deletion, backups, and rights workflow require legal/DPO and
operations approval. Phase 0 creates no retention job or deletion behavior.

### Phase 0 change flags

```text
Files modified: existing page-pack Markdown only
Files created: none
Packages affected: documentation only
Cross-application impact: none
Database change: NO; future register history and missing fields are PROPOSALS
API or contract change: NO; future read/export contracts are PROPOSALS
Permission/auth change: NO; separate read/export permissions are PROPOSALS
Audit change: NO; minimized read/export events are PROPOSALS
Runtime/provider change: NO
PDF generation/storage: NO; server-mediated transient export is a PROPOSAL
Operational data: unchanged
Production: NOT AUTHORIZED
```

## F08 Phase 0 — Formalités handoff and result boundary

The current trusted handoff is a server read, not a Formalités aggregate:

```text
full employee dossier
-> development-only gated employee Formalités route
-> authenticated OWNER + active-establishment scope
-> composite-scoped employee read
-> six-field presentation projection
-> three illustrative values in React memory only
-> disabled generation
```

Current reusable projection: employee name, position, qualification, current
CDI/CDD label, entry date, and contractual weekly duration. It excludes
revision, addresses, remuneration, probation details, employer legal identity,
collective agreement, template/version, documents, and every generated-result
identifier. The route identifier is untrusted lookup input and never grants
scope.

There is no current write contract. The local checkpoint, review acknowledgement,
and demo readiness disappear on reload/navigation and create no employee,
Formalités, document, file, or audit row. No preview or generation action runs.

Future persistence must not be inferred from the external flow. Before design,
it requires an approved eligibility/field/template matrix and must separately
define trusted scope, draft snapshot semantics, one-active-draft invariant,
revision conflict, idempotency, transitions, immutable generated versions,
minimized audit, file ownership, retention, and cross-tenant denial. A generated
Formalités version is not a signed Documents artifact and cannot update
Salariés automatically.

```text
F08 Phase 0 change record
Runtime/UI/code/test behavior: NO
Schema/migration/API/transport: NO
Permission or audit event: NO
Persistence/template/PDF/file/signature/provider: NO
Employee/formality/document operational data: NO
Real personnel data or external request: NO
Production behavior: unchanged
```

## F07 Phase 0 — employee change-history inventory

### Current persistence and read model

`personnel_employee_audit_events` is establishment-owned and binds every row to
organization, establishment, and employee. It stores actor user ID, event type,
operation ID, allowlisted changed field names, JSON metadata, and transaction
time. It is not a row-version snapshot table.

`listPersonnelEmployeeAuditHistory` rederives the trusted establishment scope,
filters to the strict employee event allowlist, orders by `(createdAt, id)`
descending, reads at most 51 rows, returns the newest 50, and exposes
`truncated: true` when older supported events exist. It sanitizes every event
type, changed field, reason, and departure date before returning the strict
contract.

The public employee-history item contains only:

| Field                   | Current meaning                                                         |
| ----------------------- | ----------------------------------------------------------------------- |
| `id`                    | Audit-event identifier                                                  |
| `eventType`             | One allowlisted employee lifecycle/update/extraction event              |
| `changedFields`         | Allowlisted names of changed fields; not their previous/new values      |
| `actorDisplayName`      | Current joined display name or null when unavailable                    |
| `occurredAt`            | Persisted transaction timestamp; not a general business-effective date  |
| `reason`                | Safely bounded metadata reason when current event semantics provide one |
| `previousDepartureDate` | Safely parsed date for the departure-specific exception                 |
| `newDepartureDate`      | Safely parsed date for the departure-specific exception                 |

The output omits organization/establishment identifiers, actor user ID,
operation ID, revisions, raw metadata, document identifiers/versions, request
details, prompt/excerpt/file content, IP/user-agent data, and ordinary old/new
employee values.

### Current write semantics

| Mutation/event family      | Atomic current write and audit evidence                                                 | Reconstructable values today                               |
| -------------------------- | --------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| Employee creation          | One `employee.created`; optional duplicate-override event shares the operation          | Initial snapshot is not exposed through history contract   |
| Ordinary identity update   | `employee.identity_updated` with changed identity field names and revision metadata     | No previous/new values; no ordinary reason                 |
| Ordinary employment update | `employee.employment_updated` with changed employment field names and revision metadata | No previous/new values; no effective date/reason           |
| Departure record           | `employee.departure_recorded` with `departureDate`                                      | Previous/new departure dates                               |
| Departure correction       | `employee.departure_corrected`; reason is mandatory                                     | Previous/new departure dates plus bounded reason           |
| Contract extraction        | Requested/completed/failed/applied allowlisted events                                   | No prompt, excerpt, PDF content, or old/new employee value |

Ordinary updates use expected revision and an idempotency receipt, then commit
the dossier revision and relevant identity/employment audit events in one
transaction. A save spanning both groups creates two rows with one internal
operation ID, but the current response does not expose that ID and the UI cannot
group those rows as one operation.

No-op writes create no ordinary update event. Idempotent replay does not create
a second committed event. Cross-establishment lookup is denied by repository
scope. Current integration tests cover these rules behind the existing database
test gate.

### Read authorization and audit separation

`loadEmployeeHistoryAction` requires trusted `personnel.employee.read`, which
is currently OWNER-only. Before reading history it records one idempotent
`employee.history_viewed` access event for the supplied operation ID. That event
is excluded from the business `Historique` allowlist and belongs to the separate
cursor-paged `Consultations` timeline.

Employee business history is also separate from document/version history,
signed-amendment history, personnel-register append-only corrections,
Formalités, Planning, Pointage, payroll, and generic access-management audit.
F07 must not join these sources into one aggregate without a separately approved
ownership and authorization design.

### Confirmed gaps against downloaded F07

- Ordinary previous/new values cannot be reconstructed from the current event
  contract or persisted metadata.
- Transaction time is available, but no general field-level effective date
  model exists.
- A correction reason is mandatory only for correction/clear of an existing
  departure; ordinary employee edits have no reason field.
- The newest 50 supported events are visible; older events have no UI paging or
  export path.
- One save may render as two rows because operation grouping is not exposed.
- A successfully saved edit does not explicitly invalidate a previously loaded
  history state in the client.
- Existing event rows cannot safely be backfilled with values that were never
  captured.

The approved next phase remained documentation-only: build a field-policy
matrix before any schema, migration, contract, repository, UI, backfill,
retention job, or production-data change.

```text
F07 Phase 0 change record
Files created: none
Packages affected: documentation only
Database/schema/migration: NO
Transport or application contract: NO
Runtime behavior: NO
Permission or audit event definition: NO
Employee/history/access mutation: NO
Backfill or operational data: NO
External request/provider/file processing: NO
Production behavior: unchanged
```

### F07 Phase 1 — approved field-history policy matrix

Status: `DOCUMENTATION COMPLETE 2026-08-24; NO VALUE CAPTURE AUTHORIZED`.

The capture classes below are planning labels only:

- `CURRENT_VALUE_TRACE`: keep the current event and changed-field names;
- `VALUE_HISTORY_CANDIDATE`: previous/new values may be designed only after a
  separate technical, privacy, and production approval;
- `IMPLEMENTED_EXCEPTION`: current bounded value-level behavior already exists;
- `SEPARATE_OWNER`: do not copy the source into employee history.

| Group               | Fields/events                                                  | Capture class             | Grouping and time policy                                                                    | Correction/reason policy                                                             | Sensitivity and unresolved gates                                                           |
| ------------------- | -------------------------------------------------------------- | ------------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| Identity            | `givenNames`, `familyName`                                     | `VALUE_HISTORY_CANDIDATE` | One identity group per save; recorded-at retained; legal/business effective date unresolved | Change versus correction must be explicit before design; correction reason candidate | Personal identity values; legal/DPO purpose, visibility, retention, rights, redaction open |
| Employment role     | `position`, `qualification`                                    | `VALUE_HISTORY_CANDIDATE` | One role group; business-effective date required and distinct from recorded-at              | Reason required only for a future explicitly classified correction                   | Employment facts; purpose, retention, signed-evidence relationship, rights open            |
| Contract term       | `employmentTermType`, `expectedEndDate`, `fixedTermReasonCode` | `VALUE_HISTORY_CANDIDATE` | One atomic coupled group; effective date required; CDI/CDD invariants preserved             | Correction reason policy required; ordinary prospective change remains distinct      | High-impact employment facts; legal/DPO review and document-source relationship open       |
| Work time           | `workTimeCategory`, `contractWeeklyMinutes`                    | `VALUE_HISTORY_CANDIDATE` | One atomic coupled group; effective date required; full-/part-time invariants preserved     | Correction reason policy required; ordinary prospective change remains distinct      | Employment duration; legal/DPO purpose, retention, signed-evidence relationship open       |
| Entry date          | `entryDate`                                                    | `VALUE_HISTORY_CANDIDATE` | Correction-only candidate; the old/new entry dates are the effective facts                  | A bounded reason is required for any future correction                               | Register relationship, retention, rights, and legal/DPO review open                        |
| Departure           | `departureDate`                                                | `IMPLEMENTED_EXCEPTION`   | Current old/new date behavior retained; date itself is the effective fact                   | Existing departure correction/cancellation requires a bounded reason                 | No expansion beyond current sanitized dates/reason without approval                        |
| Creation            | `employee.created`                                             | `CURRENT_VALUE_TRACE`     | Keep current trace now; future new-employee initial snapshot is a separate candidate        | Not a correction event                                                               | Exact initial-set purpose, minimization, retention, and contract remain open               |
| Cutover baseline    | Possible future current-value snapshot for existing dossiers   | `VALUE_HISTORY_CANDIDATE` | If approved, label as captured-at cutover; never imply knowledge before that timestamp      | Not a historical correction and never a fabricated backfill                          | Requires migration, notice/purpose, privacy, legal/DPO, operations, and rollback review    |
| Duplicate override  | `employee.duplicate_override_confirmed`                        | `CURRENT_VALUE_TRACE`     | Keep its current operation trace                                                            | Keep bounded override reason; do not copy candidate identities                       | Candidate count/raw matching detail stays outside the employee-history response            |
| Contract extraction | requested/completed/failed/applied events                      | `CURRENT_VALUE_TRACE`     | Keep lifecycle and selected-field trace only                                                | No employee correction semantics inferred                                            | Never store prompt, excerpt, PDF, suggested value, or provider payload in this history     |
| Consultations       | dossier/history/access-history view events                     | `SEPARATE_OWNER`          | Keep cursor-paged `Consultations` timeline                                                  | Not an employee-value correction                                                     | Minimized access evidence only                                                             |
| Documents/register  | base/amendment versions and register inscription/corrections   | `SEPARATE_OWNER`          | Keep each current domain timeline/source                                                    | Follow the owning domain's correction rules                                          | Do not duplicate protected file or register values into employee audit                     |

### Cross-field and lifecycle rules

1. A single future operation may contain multiple approved groups, but the UI
   should present one operation with group-level differences rather than
   misleading independent user actions.
2. `recordedAt` remains server transaction time. `effectiveDate`, where the
   matrix requires it, is a separate business fact and cannot be inferred from
   request time or document upload time.
3. A prospective change and a correction are distinct intents. A reason is not
   collected for every normal change by default; it is mandatory only for an
   explicitly approved correction policy.
4. Null/clear transitions are value changes and require the same coupled-field
   invariants and display policy as non-null changes.
5. Existing audit rows remain immutable. Unknown previous/new values stay
   unknown. No inference from the current row, PDF, register, or provider is
   allowed as historical backfill.
6. Any future cutover baseline must state only values verified at cutover and
   must not be displayed as an earlier employment event.
7. OWNER-only trusted organization + establishment + employee scope remains the
   proposed first visibility. No manager or cross-establishment aggregate is
   approved.
8. Retention, legal hold, data-subject rights, redaction, actor deletion,
   backup/restore, incident response, production purpose, and operational owner
   remain unresolved cross-cutting gates for every value candidate.

This matrix does not select a storage model, transport shape, event version,
migration, baseline job, retention period, UI diff, or production rollout.

```text
F07 Phase 1 change record
Files created: none
Packages affected: documentation only
Database/schema/migration: NO
Transport or application contract: NO
Runtime/UI behavior: NO
Permission or audit event definition: NO
Previous/new value capture: NO
Employee/history/access mutation: NO
Backfill/baseline job/operational data: NO
Real employee QA: NO
Production behavior: unchanged
```

### F07 Phase 2 — post-save history coherence

Status: `IMPLEMENTED 2026-08-24`.

After `EmployeeEditDialog` reports a successful committed employee summary:

1. the owning quick-view or full-dossier surface replaces its current employee
   summary as before;
2. any cached `HistoryLoadState` is reset to `idle`;
3. when the active detail tab is `history`, a new random operation ID triggers
   the existing scoped history action immediately; and
4. when another detail tab is active, the operation ID is cleared so no hidden
   read or history-view audit occurs, and the normal tab-open interaction later
   creates the fresh operation ID.

The existing action remains the only data boundary. Its OWNER authorization,
trusted organization + establishment + employee scope, minimized access audit,
sanitized response, newest-50 limit, truncation flag, and error/retry contract
are unchanged. The refresh helper contains no employee data and decides only
whether a post-save operation ID is needed.

```text
F07 Phase 2 change record
Schema/migration/API/transport: NO
Permission or audit definition/payload: NO
Previous/new values/effective date/reason: NO
Quick-view and full-dossier post-save invalidation: YES
Immediate read while Historique is active: YES, existing action only
Background read while another tab is active: NO
Employee/history operational QA mutation: NO
Production behavior: unchanged
```

## F06 Phase 0 — alert derivation and resolution interaction

F06 does not introduce an alert entity. The current Wave D overview is computed
from authoritative employee and document state for the trusted organization
and active establishment. Browser-provided scope, role, permissions, employee
identity, alert state, and resolution state are not trusted.

### Derived item contract

| Kind                           | Source condition                                                                                           | Group         | Existing target            |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------- | ------------- | -------------------------- |
| `incomplete_employee_dossier`  | Active/upcoming dossier has a blank given-names, family-name, position, or qualification value             | `corrections` | F03 minimum-dossier editor |
| `missing_signed_base_contract` | Active/upcoming dossier has no `signed_employment_contract` document metadata in the same trusted scope    | `corrections` | F05 base-contract add form |
| `departure_within_five_days`   | Active dossier departure date is between business date and business date plus five calendar days inclusive | `departures`  | Existing departure review  |

The response exposes only the kind, employee ID, employee display name, the
departure date when relevant, bounded page information, and document-source
status. It contains no filename, file version, storage key, contract content,
missing-field list, comment, assignee, priority, or persisted resolution data.

Corrections and departures have independent deterministic cursor pagination
with five items per page. Cursors are transient interaction state, not URL or
durable workflow state. The overview exposes no aggregate total and uses no
polling or background refresh.

### Read, resolve, and freshness sequence

1. The server requires the current personnel tenant and employee/document read
   permissions before loading the overview.
2. Employee incompleteness, document metadata, and departure rows are read in
   the trusted scope.
3. One minimized `personnel.action_overview_viewed` audit event with empty
   metadata is written for the overview read, not one event per item.
4. Selecting an item sends only the employee ID and strict item kind back to
   the server.
5. The server repeats runtime, tenant, scope, employee, permission, business-
   date, and underlying-condition checks.
6. A current item returns the bounded existing target. A changed or resolved
   item returns `changed`, the client refreshes, and no obsolete target opens.
7. The overview never marks an item resolved. It disappears or changes only
   after the owning domain successfully changes its authoritative source.

An incomplete-dossier target additionally requires employee-manage permission.
A missing-contract target additionally requires document read/manage. The
departure target remains a read-only review. Current role mapping makes the
multi-employee surface OWNER-only.

### Failure and non-inference rules

If document metadata fails while employee/departure reads succeed, the response
keeps the valid rows, sets `documentSourceStatus: unavailable`, and produces no
missing-contract item. If a required non-document source fails, the action
returns the full retry state without personnel data. Invalid cursors and stale
targets fail closed.

Do not infer CDD expiry from `expectedEndDate`, departure from contract end,
legal completeness from current minimum fields, amendment requirements,
document validity, or deadlines from Formalités, register, Planning, Pointage,
or payroll. No current schema supports task status, acknowledgement, dismissal,
assignment, comments, reminders, or notifications.

The approved Phase 1 exercised only existing fictional records and current
tests. It did not insert, edit, upload, replace, depart, or otherwise mutate a
source condition solely for QA. The normal minimized overview/dossier-access
audits were expected security side effects, not manually created alert
mutations.

```text
F06 Phase 0 change record
Files created: none
Packages affected: documentation only
Database/schema/migration: NO
Transport or application contract: NO
Runtime behavior: NO
Permission or audit event definition: NO
Employee/document/departure mutation: NO
Operational alert/task data: none exists
External request/provider: NO
Production: NOT AUTHORIZED
```

### F06 Phase 1 read-only evidence

The 2026-08-24 authenticated OWNER regression read existing fictional LUNA
state only. The current query returned no incomplete minimum dossier, more than
one page of missing signed base contracts, and no departure in the five-day
window. It exercised page one, page two, and one fresh missing-contract target.
The target opened the existing Documents add form and recorded only the normal
overview/dossier-access read evidence. No file was selected, no form was
submitted, and no employee, document, or departure value changed.

Backoffice unit/component coverage passed 54 files and 192 tests; the focused
personnel contract schema suite passed 14 tests. Existing repository and runtime
tests remain the evidence for source-partial, source-error, incomplete,
departure, stale-target, bounded-output, and non-development denial states that
current data did not expose. Mutation-capable database integration tests were
not forced for this read-only phase.

## F05 Phase 0 — current document data and interaction inventory

### Approved current document meanings

| Meaning                         | Persistence model                                    | Current interaction boundary                                                                |
| ------------------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Signed base employment contract | One establishment-owned document plus versions       | Add once; verified replacement advances current version; view/download current version only |
| Signed contract amendment       | Distinct amendment aggregate plus immutable versions | Add with effective date and optional reference; replace only its scan; page ten at a time   |

The base category is the allowlisted `signed_employment_contract`. Amendments
use a separate repository/schema family and audit category; they are not a
second base-category slot. Identity documents, work authorization/title, RIB,
payroll evidence, generic attachments, and unsigned drafts have no approved F05
contract or storage behavior.

### Write and delivery sequence

For both supported meanings, the server derives tenant and OWNER permissions,
validates PDF media/signature and the 10 MiB limit, writes a quarantined private
object, invokes the local scanner, promotes verified bytes, and only then commits
scoped metadata/version/audit with revision and idempotency protection. Failed
verification does not replace the current version and attempts to clean the new
object. Production runtime refuses to provide the local storage/scanner.

View and download URLs carry employee and item identifiers only as untrusted
hints. The server rederives organization and establishment, requires
`personnel.document.read`, grants the current scoped object, records a minimized
view or download event, opens private storage, and returns `private, no-store`
PDF content with `nosniff` and safe content disposition. Storage keys and
checksums are never part of the browser model.

### Presence and applicability

The employee document card explicitly says absence of the base file does not
automatically make the employee dossier incomplete. Separately, the approved
development-only `À traiter` query lists every active or upcoming employee with
no signed base-contract metadata as `missing_signed_base_contract`. F05 Phase 0
proposes retaining that rule only as an operational missing-evidence action. It
must not be described as a legal-completeness judgment, and it does not create a
general required/optional/not-applicable configuration.

No current rule requires an amendment. No validity/expiry date exists for the
base contract or amendment file. Amendment effective date is contract context,
not document expiry. F05 must not fabricate expiry alerts or applicability
rules.

### Ownership boundaries

| Concern                      | Owner/boundary                                                                 |
| ---------------------------- | ------------------------------------------------------------------------------ |
| Employee current facts       | F03/F04 employee dossier; F05 does not silently update them                    |
| Signed base and amendments   | F05 Documents                                                                  |
| Missing-base overview action | Development-only Wave D derived metadata read; no file bytes                   |
| Extraction suggestions       | Separately gated Wave F/G, base contract only, explicit OWNER review           |
| Deletion/retention/rights    | Deferred production legal/privacy/security/operations decision                 |
| Production binary storage    | Future private EU provider outside Neon; no provider is selected by this phase |

### Completed Phase 1 read-only regression

Authenticated QA used existing fictional LUNA records only. `ok cdi ddd`
exposed an available version-2 base contract, safe employee/document-scoped
view and download link shapes, the separate analysis gate, and an empty
amendment section. `Nina F02-Sierra` exposed the missing-base action plus the
explicit statement that absence does not automatically make the dossier
incomplete. The 390 px document and drawer widths matched their scroll widths.
Browser logs contained no warning/error.

QA deliberately did not open or download the PDF because those reads write
audit evidence, and it did not add or replace a base contract or amendment.
Repository tests remain the evidence for scoped grants, cross-establishment
denial, immutable versions, stale revision, idempotency, and amendment paging.
Existing as-built evidence remains the populated-amendment visual proof.

### Phase 0 change flags

```text
Files modified: existing Salariés page-pack and current-state Markdown only
Files created: none
Packages affected: documentation only
Runtime/UI/action/repository: NO
Database/schema/migration: NO
Transport contract/API/permission/audit: NO
File read/write/upload/download: NO
Storage/scanner/provider operation: NO
Employee/document/test/operational data: unchanged
AI/provider request: NO
Production: NOT AUTHORIZED
```

## F03 Phase 0 — current edit data and interaction inventory

Status: `PHASE 1 IMPLEMENTED; SERVER AND DATA BOUNDARIES UNCHANGED`.

### Current trusted boundary

```text
authenticated OWNER
-> quick view or /equipe/salaries/[employeeId]
-> shared EmployeeEditDialog
-> updateEmployeeAction
-> trusted session organization + active establishment
-> personnel.employee.manage
-> strict updatePersonnelEmployeeInputSchema
-> tenant-scoped updatePersonnelEmployee transaction
-> dossier revision + minimized audit event(s) + idempotency receipt
```

The browser employee ID, expected revision, and idempotency key are command
inputs, not authorization. The server rederives the actor and tenant scope. The
repository requires the current establishment-owned employee and matches the
expected revision again in the update statement.

### Current field and validation map

| Field group | Current facts                                                                                   | Current audit result                                           |
| ----------- | ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| Identity    | Required trimmed given names and family name, each at most 120 characters                       | `employee.identity_updated` plus changed field names           |
| Employment  | Required position and qualification; CDI/CDD; full/part time; entry; optional weekly minutes    | `employee.employment_updated` plus changed field names         |
| CDD branch  | Expected end required and not before entry; supported reason required for controlled CDD writes | Same employment event; no ordinary previous/new value snapshot |
| CDD to CDI  | Expected end/reason cleared; an existing controlled reason requires explicit user confirmation  | Same employment event                                          |
| Departure   | Not edited by F03; separate reasoned, non-destructive departure command                         | Separate event with bounded previous/new departure dates       |

Ordinary F03 updates store previous/new revision numbers internally but the
approved read contract exposes only event type, actor display name, occurrence
time, and changed field names. It cannot reconstruct the former name, position,
qualification, contract type, duration, or entry date. F07 must not describe
that missing capability as implemented.

### Current recovery behavior and gap

- invalid input preserves controlled dialog values and returns field errors;
- a stale revision preserves entered values and offers an explicit reload of
  the current summary before a new retry key is used;
- a repeated identical committed command resolves to the committed employee;
- reuse of a key with different values fails without a second write;
- no changed field returns a truthful no-change success;
- successful commit returns the current safe employee summary, refreshes the
  route, closes the editor, and leaves the dossier context open; and
- closing modified unsaved input now requires an explicit discard decision;
  untouched or restored values close immediately.

### F03 and F07 ownership

F03 owns opening, editing the current allowlisted dossier facts, validation,
save, conflict recovery, and refreshing the current dossier. F07 owns any
future decision that requires previous/new values, effective dates, correction
reason policy, durable versions, retention, or legally reconstructable history.
No F07 schema or payload is selected in this phase.

The Phase 1 dirty comparison is browser-local and compares every current edit
field with the last summary loaded into the dialog. Loading a newer revision
after a conflict replaces that comparison baseline. Continuing from the
confirmation retains the controlled values; discarding unmounts the editor and
does not call `updateEmployeeAction`.

### Phase 0 change flags

```text
Files modified: existing Salariés page-pack and CURRENT_STATE Markdown only
Files created: none
Packages affected: documentation only
Database/schema/migration: NO
API/application contract: NO
Permission/auth: NO
Audit event/payload: NO
Runtime/UI behavior: YES — route-local dirty-close confirmation only
Operational or test data: unchanged
File/provider/AI: NO
Production: NOT AUTHORIZED
```

## F04 Phase 0 — current-contract data and interaction inventory

### Current structured source

The current contract-like facts are columns on the establishment-owned employee
dossier, not a separate contract aggregate. They include `employmentTermType`,
`expectedEndDate`, `fixedTermReasonCode`, `workTimeCategory`,
`contractWeeklyMinutes`, and `entryDate`, alongside position and qualification.
The supported term values are only `indefinite` and `fixed_term`. Repository
validation enforces the current CDD/date/reason and weekly-minute boundaries.

There is no employee-contract identifier, effective-version chain,
remuneration, monthly duration, detailed part-time distribution, probation, or
employee-level apprenticeship/professionalization model. Similar labels in the
personnel-register domain do not extend this employee-dossier contract.

### Current reads and ownership

| Concern                       | Current source/owner                           | F04 Phase 0 disposition                                                   |
| ----------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------- |
| Structured current facts      | Employee dossier / `Relation de travail`       | View as current declared facts, not a signed or legally complete contract |
| Editing current facts         | Shared F03 `Modifier` action                   | Reuse; do not create an F04 mutation                                      |
| Formalités connected read     | Read-only projection of six current facts      | Preserve bounded reuse; no generation, save, or sufficiency claim         |
| Base signed contract PDF      | F05 `Documents` secure-document vertical slice | Keep separate from structured facts                                       |
| Signed amendments             | F05 amendment records and secure reads         | Keep as distinct evidence; do not overwrite the base contract             |
| Ordinary change trace         | Current audit events with changed field names  | F07 decides future reconstructable previous/new value history             |
| AI/PDF extraction suggestions | Separately gated Wave G review flow            | Never silently redefine the current contract or update the employee       |

Secure document reads are server mediated, tenant scoped by trusted session,
require `personnel.document.read`, and create view/download audit evidence.
Storage keys are not browser authority. The structured employee read and edit
likewise remain scoped by trusted organization and active establishment. The
current permission catalog grants these employee and document capabilities to
OWNER only.

### Implemented smallest Phase 1

After explicit approval, Phase 1 performed authenticated fictional-data
verification of the existing Relation/Documents split and corrected only the
stale Relation helper text about Formalités availability. A focused static-
render test asserts both the bounded reuse statement and the signed-document
boundary. Current fields, navigation, F03 editor, F05 files, authorization,
storage, audit, and server behavior remain unchanged.

### Phase 0 change flags

```text
Files modified: existing Salariés page-pack and current-state Markdown only
Files created: none
Packages affected: documentation only
Database/schema/migration: NO
Transport or application contract: NO
Runtime UI/action/repository: NO
Permission or audit event: NO
File read/write/transmission: NO
AI/provider request: NO
Employee/document mutation: NO
Operational/test data: unchanged
Production: NOT AUTHORIZED
```

## F02 Phase 0 — implemented creation inventory

Status: `PHASE 1 IMPLEMENTED; CURRENT DATA BOUNDARY PRESERVED`.

### Current boundary

```text
authenticated OWNER
-> /equipe/salaries existing client dialog
-> createEmployeeAction
-> trusted session organization + active establishment
-> personnel.employee.manage
-> strict createPersonnelEmployeeInputSchema
-> tenant-scoped createPersonnelEmployee transaction
-> dossier + minimized audit + idempotency receipt
```

The browser supplies no trusted organization, establishment, actor, role,
permission, audit, employee ID, timestamp, or revision value. The server derives
the business date using the trusted establishment timezone.

### Current field and state map

| UI fact                           | Current rule                                                                                  | Persistence/ownership                    |
| --------------------------------- | --------------------------------------------------------------------------------------------- | ---------------------------------------- |
| Given names / family name         | Trimmed required text, maximum 120 characters                                                 | Employee dossier identity snapshot       |
| Position / qualification          | Trimmed required text, maximum 120 characters                                                 | Establishment employment relationship    |
| Employment term                   | `indefinite` or `fixed_term`                                                                  | Employee dossier                         |
| Expected end date                 | Required for CDD, absent for CDI, and not before entry                                        | Employee dossier, nullable               |
| CDD reason                        | One current allowlisted reason for CDD, absent for CDI                                        | Employee dossier, nullable               |
| Work-time category                | `full_time` or `part_time`                                                                    | Employee dossier                         |
| Contractual weekly duration       | Integer 1–2,880 minutes, entered as hours plus minute remainder                               | Employee dossier                         |
| Entry date                        | Required canonical date-only value                                                            | Employee dossier                         |
| Idempotency key                   | Browser-generated UUID; hashed and scoped to actor, establishment, and command                | Short-lived server receipt               |
| Duplicate confirmation and reason | Same-establishment advisory branch; reason required when confirming a distinct possible match | Transient command plus minimized audit   |
| Success                           | Only after dossier, required audit, and command receipt commit atomically                     | Persisted outcome; list path revalidated |

Current completeness checks only given names, family name, position, and
qualification. Because creation requires those four values, a newly created
dossier has no current completeness reason. This does not prove that documents,
legal duties, payroll, register, Formalités, or wider onboarding are complete.

### Current recovery and test evidence

- Zod rejects missing/invalid conditional facts before repository mutation;
- the dialog preserves controlled values across validation and duplicate
  responses;
- a repeated key and identical payload returns the original committed dossier;
- the same key with different values fails without another write;
- duplicate candidates are establishment-scoped and never auto-merge;
- creation and duplicate-override audits commit with the dossier;
- integration tests cover atomic create/replay, tenant scope, duplicate reason,
  audit minimization, and command conflict; and
- focused pure tests cover the dirty-input decision; authenticated browser QA
  covers the normal, CDD, duplicate, dirty-close, committed-success, and full-
  dossier states.

### Remaining boundaries after Phase 1

1. Documents begin only after an employee ID exists; the downloaded file-first
   ordering is unsupported.
2. There is no resumable onboarding draft, remuneration, probation,
   apprenticeship, detailed part-time distribution, work-authorization flow,
   additional contract type, or production approval.

### Phase 1 change flags

```text
Files modified: create action state, create dialog, page-pack, CURRENT_STATE
Files created: one route-local dirty-input helper and focused test
Packages affected: apps/backoffice
Runtime component/action: YES — bounded success and dirty-close interaction
Repository transaction: unchanged
Database/schema/migration: NO
Shared transport/application contract: NO
Permission/audit event: NO
Document/file/provider/AI: NO
Employee mutation: one fictional LUNA QA dossier created through existing flow
Authenticated browser capture: COMPLETE at 1440, 1024, 768, and 390 CSS pixels
Production: NOT AUTHORIZED
```

On committed success, `createEmployeeAction` returns only the safe employee ID
already created by the transaction. Tenant, establishment, actor, permission,
revision, audit metadata, and receipt data remain server-owned. The dialog uses
the existing full-dossier route helper only after a success ID exists and does
not navigate automatically. Dirty detection is browser-local and never changes
the persisted command.

## Wave G Phase 2 — offline corpus and scoring contract

Status: `60-FIXTURE OFFLINE CORPUS IMPLEMENTED; EXTERNAL REQUEST BLOCKED`.

The repository now owns `yuta-wg2-contracts-v1`, a generated 60-document corpus
with 20 digital-text PDFs, 15 clear image-only scans, 15 degraded scans, and 10
ambiguous/adversarial PDFs. Every file is two pages,
visibly marked as entirely fictional, and bound to a versioned manifest by
SHA-256 hash and page count. The manifest contains only the three existing Wave
F result fields and explicit abstention requirements.

The application-owned offline scorer accepts an unknown candidate, first parses
it through `personnelContractExtractionReviewResultSchema`, and then reports:

- schema validity and expected status agreement;
- exact field/value/page matches;
- missing and false suggestions;
- incorrect `high`-confidence suggestions;
- violations of required field abstention;
- one strict pass/fail result.

Malformed or extra-key output is rejected before scoring. A `no_result` or
`unsupported` candidate containing suggestions remains invalid under the
existing YUTA schema. No confidence score, excerpt, or provider metadata can
override the machine-known expected field value.

The corpus is repository test data, not tenant data. It has no employee,
organization, establishment, document-storage, or register identifier. It is
not loaded by the restaurant UI, Documents repository, or Wave F runtime. No
network client, native extractor, OCR engine, provider adapter, key, schema,
migration, or production path was added.

## Wave G Phase 3 — bounded sandbox configured

The current personal/pre-incorporation API organization owns one disposable
synthetic project named `YUTA AI Test`, created with separate product approval
on 2026-08-19. The dashboard reports `Global` geography and data-retention
control `None`. The project ID remains private and is not stored in repository
documentation. Product separately approved USD 10 prepaid organization credit,
automatic reload `OFF`, a USD 5 monthly hard project limit with a 100% alert,
and a model allowlist containing only `gpt-5.6-luna` and
`gpt-5.6-terra`. The project service account/key is named
`yuta-ai-evaluation-local`; the secret remains private and outside the
repository. The service account inherits only the custom `YUTA AI Evaluation
Caller` role, whose sole enabled capability is model requests. The broader
preset `member` role was removed. The key remained unused with USD 0 spend when
these controls were verified.

The evaluation-only secret is loaded from ignored local configuration, and the
smoke runner remains disabled unless the exact `approved-synthetic-only` gate is
present. Exact snapshot pinning and a project rate-limit decision remain open.
This non-EU project is acceptable only for entirely fictional evaluation data;
it never authorizes a real personnel file.

Official OpenAI project controls support project-scoped data-retention settings,
model permissions, rate limits, service accounts, spend alerts, and a USD hard
spend limit. Availability and enforcement must be verified in the actual
account before relying on any control. A later company-owned setup is rebuilt
with a new organization/project/key and must rerun the synthetic acceptance
suite; the temporary personal key is never promoted to production.

## Wave G Phase 4 — complete direct-PDF benchmark

Product authorized exactly one first synthetic call on 2026-08-19. The
server-only adapter uses native `fetch` against Responses and receives only a
`PreparedSyntheticContract`. It rejects absent, oversized, or non-PDF bytes
before network access. The test runner independently verifies the manifest's
`syntheticOnly` marker, approved fixture IDs, SHA-256 hashes, and page counts,
and does not accept a caller-supplied path.

The remote payload contains direct Base64 PDF input, the `gpt-5.6-luna` alias,
`store: false`, low reasoning effort, no tools, no background mode, and a strict
semantic schema limited to status, the three approved suggestion fields, and
the two warning codes. Request IDs, document version, employee revision, page
count, and expiry are rebuilt by YUTA after parsing; provider data cannot set
them. The existing YUTA Zod result schema and offline scorer then run again.

The locked `wg2-digital-cdd-35h.pdf` first call completed and matched all
expected answers. Product then approved one clear scan, one degraded partial
scan, and one adversarial instruction fixture. All three passed on their first
attempt with zero missing, false, incorrect-high-confidence, or abstention
violations. Their respective latency/input/output/estimated-cost measurements
were 4,362 ms / 6,495 / 183 / USD 0.0015186, 2,799 ms / 6,495 / 66 / USD
0.0013782, and 5,791 ms / 711 / 178 / USD 0.0003558.

Product then approved the remaining 56 requests. Every fixture ran once, in
sequence, with no retry. The full result is 58/60 document passes: digital text
20/20, clear scan 14/15, degraded scan 14/15, and adversarial 10/10. All 60
responses satisfy the strict schema. There were no provider failures, timeouts,
arbitrary-key leaks, or abstention violations, and every recorded request
completed below eight seconds.

`wg2-scan-clear-03` returned two expected suggestions plus one false
high-confidence suggestion while missing the expected value; this violates the
WG0-09 zero-tolerance rule. `wg2-scan-degraded-07` returned no suggestions, as
required for safety, but used `partial` instead of `no_result`. The current
Luna/request configuration therefore fails selection despite meeting the
digital and clear-scan accuracy thresholds. No post-hoc retry was made.

No raw response, provider ID, prompt, PDF content, or secret was persisted. The
Usage dashboard still exposed only the earlier first request immediately after
the run, so billed-cost reconciliation remains pending. Restaurant UI, schema,
migration, Neon data, personnel-document storage, employee updates, real-file
access, and production behavior are unchanged.

## Wave G Phase 5 — same-condition model comparison

Product separately authorized `gpt-5.6-terra` to process the same immutable
60-file synthetic corpus once. The input bytes, prompt, strict semantic schema,
YUTA envelope reconstruction, scorer, `store: false`, low reasoning effort,
no-tools/no-background controls, and no-retry rule were unchanged.

Terra passed 58/60 documents: digital text 20/20, clear scan 13/15, degraded
scan 15/15, and adversarial 10/10. All 60 responses passed the strict schema;
there were no provider failures, timeouts, arbitrary-key leaks, or abstention
violations, and every recorded request completed below five seconds. Terra
returned the expected `no_result` for `wg2-scan-degraded-07`. Its failures were
`wg2-scan-clear-03` and `wg2-scan-clear-05`; each response contained a false,
missing, incorrect high-confidence suggestion. The four rendered pages were
reviewed after the run and confirmed the fictional PDF text and manifest
answers are legible and correct. The corpus was not altered after observing
the output.

Luna and Terra both pass 58/60, but Luna has one incorrect high-confidence
suggestion and Terra has two. Both therefore fail WG0-09. No output from either
configuration may enter the employee update path. At the prices checked on
2026-08-19, Terra costs ten times Luna per input and output token. The delayed
Usage dashboard later showed a partial aggregate of 98/120 requests, 328,421
tokens, and USD 0.40; it is not complete billed evidence. Prompt/model choice,
final cost reconciliation, real files, employee data, schema/migration, and
production remain unchanged or blocked.

## Wave G Phase 5 — approved prompt v2 offline diagnostics

Prompt v2 was approved on 2026-08-19, is represented as `v2`, and has a tested
SHA-256 fingerprint. It is not selected by an external run gate, so this
approval does not authorize an API request. Prompt v1 remains the default. V2
fake provider responses pass through
the same strict semantic schema, followed by local uniqueness and status/count
validation. Complete requires exactly three unique fields, partial requires one
or two, and no_result/unsupported require zero.

The scorer still uses exact `field + candidateValue + sourcePage` equality for
acceptance. It additionally emits in-memory diagnostics containing only an
allowlisted field name and mismatch categories. It does not include the actual
candidate, excerpt, prompt, PDF content, or raw provider output. Orthographic
equivalence is diagnostic only and never converts a failure into a pass. This
allows a later approved run to distinguish accent/apostrophe normalization from
a source-page or semantic error while preserving WG0-09.

The separately authorized Luna/v2 run processed all 60 locked fictional PDFs
once with no retry, then removed its temporary external gate. It passed 46/60:
digital 14/20, clear scan 9/15, degraded scan 15/15, and adversarial 8/10.
Eleven exact-match failures were high-confidence orthographic rewrites of
`position`; one provider result was rejected before envelope creation by v2
local consistency validation; two adversarial results had no false suggestion
but omitted one expected weekly duration. The 59 accepted envelopes had no
abstention violation. These diagnostics do not expose or persist the rewritten
candidate values. The result rejects v2 under WG0-09 and authorizes no retry or
production path.

Prompt v3 is approved as `v3` with no external gate. It reuses
the same transport schema and v2 local uniqueness/status-count validation. Its
few-shot transcription examples are held out from corpus v1, so they teach the
required character-preservation behavior without embedding benchmark answers.
The prompt explicitly rejects a duration that is not visibly weekly.

That rule conflicts with the frozen expected answers for
`wg2-adversarial-05` and `wg2-adversarial-09`: their PDF text contains a bare
duration in hours while the manifest expects weekly minutes. V1 remains
immutable evidence. Candidate corpus v2 resolves the mismatch by adding
explicit weekly wording to only those two PDFs while leaving every expected
answer unchanged. The other 58 PDFs are copied byte-for-byte from verified v1
hashes. The v2 manifest pins both changed hashes, and offline tests verify the
complete PDF/hash/page set. Product approved corpus v2 and separately
authorized one complete Luna/v3 run. All 60 fictional PDFs ran sequentially
once with no retry. The result was 58/60: digital 20/20, clear scan 13/15,
degraded scan 15/15, and adversarial 10/10. `wg2-scan-clear-07` produced one
incorrect high-confidence orthographic rewrite. `wg2-scan-clear-09` completed
at the provider but failed the local schema/consistency boundary. There was no
provider failure or abstention violation. Maximum observed latency was 9,965
ms. Usage was observable for 59 responses: 227,463 input and 9,586 output
tokens, estimated at USD 0.0569958. The rejected response's usage was not
exposed, so this is not final billed evidence. V3 fails WG0-09 and is not
selected. Its temporary gate was removed and no further request is authorized.

Prompt v4 was requested after v3 and its exact text was approved on 2026-08-19.
It preserves the v3 transport and strict local boundary. Its position rule now separates the extracted value
from a preceding label/separator and from punctuation that only terminates the
surrounding sentence; punctuation internal to the value remains literal. Its
output rule permits zero or one item for each allowlisted field in fixed order,
then maps the final count to status without modifying the list afterward.

These changes are hypotheses derived from minimized diagnostics. The retained
`wg2-scan-clear-07` evidence identifies an orthographic variation but contains
no raw wrong candidate. The `wg2-scan-clear-09` evidence identifies a locally
invalid result but cannot distinguish duplicate fields from status/count
inconsistency. Offline fake responses cover those possible failure classes
without reconstructing or persisting provider content. V4 has no external run
gate and changes no corpus, schema, migration, operational data, employee data,
or production behavior. Prompt approval alone authorizes no external request;
a v4 run and budget still require separate product approval.

Product separately authorized one complete Luna/v4 run over corpus v2. All 60
fictional PDFs ran once sequentially without retry. V4 passed 59/60: digital
20/20, clear scan 14/15, degraded scan 15/15, and adversarial 10/10.
`wg2-scan-clear-15` completed at the provider but failed local
schema/consistency validation; the other 59 results were schema-valid. This
satisfies the schema-valid-or-rejected boundary. There were zero incorrect
high-confidence suggestions, zero abstention violations, and zero provider
failures. Maximum latency was 7,498 ms, so the entire observed distribution was
below 45 seconds. Usage observations for 59 results total 232,065 input tokens
and 9,184 output tokens, estimated at USD 0.0574338. The rejected result has no
usage observation, so billed reconciliation remains open.

V4 passes the current synthetic safety, exact-accuracy, and latency rules.
Product selected Luna/v4/corpus-v2 as the synthetic evaluation winner on
2026-08-19. The selection closes the synthetic comparison but does not
authorize real employee files or production. The temporary gate remains
removed, the generic adapter default remains v1 to prevent implicit promotion,
and no further call is authorized.

## Wave G Phase 6 — development runtime selection

```text
OWNER starts the existing Documents review
-> server rechecks trusted tenant permissions and current versions
-> YUTA creates a bounded fictional PDF in memory
-> development runtime resolves deterministic-synthetic or explicit openai-synthetic
-> openai-synthetic pins gpt-5.6-luna + prompt v4
-> adapter returns the strict transient YUTA review result
-> OWNER reviews and explicitly applies only supported fields
```

`openai-synthetic` requires `NODE_ENV=development` and a non-empty evaluation
key. Unknown modes, missing keys, test, production, and missing environment
values fail closed before provider access. The prepared object remains tagged
`synthetic_fixture`, and the OpenAI adapter rejects missing, non-PDF, or
oversized bytes. The action does not call personnel-document storage, so the
signed contract bytes cannot enter this Phase 6 request. Provider errors remain
sanitized into the existing failure state; no response body, key, or provider
identifier is exposed to the browser or persisted.

The generated PDF represents the existing `complete` scenario. The local
partial, no-result, unsupported, failure, and timeout selectors remain
deterministic UI-state tests and never call the provider, even while
`openai-synthetic` is configured.

## Wave G Phase 7 — fictional upload input

```text
OWNER opens the development review
-> no request starts automatically
-> OWNER keeps the generated PDF or selects a fictional local PDF
-> an uploaded file requires explicit fictional-only attestation
-> OWNER clicks analysis
-> server rechecks trusted permissions and current employee/document versions
-> server loads and validates the transient synthetic bytes
-> existing rate limit, adapter, and strict result validation
-> server stores only the validated allowlisted review under tenant + request ID
-> OWNER selects supported values
-> apply reloads current versions and audit grant, then matches the stored review
-> successful apply deletes the transient review without another provider call
```

An uploaded synthetic file is not a personnel document and is never saved to
personnel-document storage. The browser cannot select a provider, model, prompt,
tenant, or target version. The server accepts the upload only for `complete`,
requires a `.pdf` name, `application/pdf`, fictional-only attestation, at most
750 KiB, `%PDF` signature, and 1–40 parseable pages. The stored signed contract
remains outside this path. Production rejects the review and action regardless
of upload input or configured secrets.

The development review store contains no PDF bytes, key, provider response
envelope, or arbitrary browser payload. It holds only the validated YUTA review
result, is keyed by trusted organization, establishment, and request ID, and
uses the result's maximum 15-minute expiry. Missing, expired, cross-scope,
version-mismatched, audit-invalid, or value-mismatched reviews fail closed and
are removed when applicable. The browser sends selected allowlisted values, but
those values authorize nothing unless they exactly match the stored review.

## Wave G Phase 8 — stored fictional document offline integration

Status: `IMPLEMENTED; ONE STORED-FIXTURE PROVIDER REQUEST COMPLETE`.

Proposed flow:

```text
OWNER opens the development Documents review
-> server derives trusted organization + establishment + employee scope
-> server resolves the current signed-contract document and exact version
-> server checks the current version's persisted checksum against one approved fixture
-> only an eligible record permits opening the available private object
-> server revalidates PDF limits and recomputes the allowlisted fixture hash
-> hash match permits the existing rate limit + deterministic fixture adapter
-> strict result enters the existing 15-minute server-owned review
-> OWNER explicitly keeps or applies each supported field
-> apply repeats version, audit-grant, review, and employee-revision checks
```

Repository inspection found that `personnel_document_versions` already stores
the SHA-256 calculated during the existing upload flow. Phase 8 therefore adds
no eligibility table or transient registry. The server-only resolver returns
the exact current version's document ID, version, storage key, media type, byte
size, and checksum under trusted composite scope. The browser receives only an
eligible/unavailable result and cannot provide or modify any of those values.

The separately approved provider QA added a temporary server-only
`approved-once` gate. After the scoped resolver and storage loader had repeated
the metadata, signature, size, and SHA-256 checks, a provider wrapper checked
the exact SHA-256, two-page shape, and complete scenario once more. It consumed
the gate before delegating the bytes to the existing Luna/v4 adapter. The gate
therefore allowed at most one provider attempt in that process. The successful
request returned three valid suggestions and its transient review; applying a
field still required a separate OWNER choice and was not performed. The process
was stopped after the result and restarted without the temporary gate.

The current `grantPersonnelDocumentContentAccess` operation is not reused
because it records a view/download grant. The new server-only extraction-source
resolver repeats the existing composite
organization + establishment + employee + document + current-version lookup
without mislabeling extraction as viewing or downloading. Existing extraction
requested/completed/applied audit events remain the activity evidence. No new
table or migration is proposed.

Preparation constraints remain `.pdf`, `application/pdf`, maximum 750
KiB, `%PDF` signature, and 1–40 parseable pages. Eligibility is checked before
storage access; size, signature, page count, and hash are checked again after
the available object is opened. Any missing record/object, scope mismatch,
version replacement, hash mismatch, or validation error
fails before adapter access and clears the stored-source choice.

The application-local prepared-document source vocabulary now includes
`stored_synthetic_document`. No shared transport contract changed. The OpenAI
adapter still rejects this source; the action selects only the new deterministic
fixture adapter, whose frozen output matches the two-page fixture manifest.

Production, test, missing environment, and any non-allowlisted document remain
fail-closed before storage access. Offline tests cover exact-hash success,
unknown-hash/non-development denial without storage access, changed-byte
rejection, and a complete no-network service run. Real personnel-file
processing remains a separate legal, privacy, security, provider, and
operations decision.

## Wave F Phase 1 — fixture-only interaction

Status: `LOCAL PROTOTYPE; NO DOCUMENT OR EMPLOYEE DATA INTEGRATION`.

The prototype uses a route-owned TypeScript fixture containing only
`position`, `employmentTermType`, and `contractWeeklyMinutes`. The fixture is
not derived from the loaded document, employee values, an OCR result, a model
response, a contract package, or persistence.

```text
available signed base contract
-> OWNER opens local prototype
-> three fictional typed suggestions render
-> OWNER chooses keep/use in client memory
-> local selected-change summary updates
-> disabled apply action ends the prototype
```

The server page passes a development-only feature flag. Production and test
environments fail closed and render no analysis control. No API, server action,
permission, audit event, storage read, file transmission, employee write, or
register write exists in this phase.

## Wave F Phase 2 — proposed technical contract

Status: `APPROVED; LOCAL SYNTHETIC CONTRACTS/SERVICE IMPLEMENTED — PROVIDERS AND REAL FILES BLOCKED`.

Phase 3 implements this boundary with a server-generated fictional PDF and a
deterministic adapter only. The signed employee document is resolved by scoped
metadata and exact version but its binary content is not opened. Review results
remain transient. Position and weekly minutes may use the existing employee
mutation; the contract type remains dependency-blocked. Minimized extraction
events use the existing employee audit table, and the establishment rate limit
is process-local development state rather than a production guarantee.

Phase 4 adds a server-side apply grant without a result store. The existing
completed extraction event is queried under trusted organization,
establishment, employee, request ID, document ID, and document version scope.
Its minimized outcome must match `complete` or `partial`, and its timestamp
must be no more than 15 minutes old. Missing, mismatched, cross-establishment,
future-dated, or expired events fail closed before candidate matching or the
employee update. Browser `expiresAt`, confidence, evidence, and selected values
remain non-authoritative.

### Repository constraints preserved

- trusted organization, establishment, actor, and role come from the validated server session;
- the employee and document are looked up with organization + establishment + employee scope;
- only the current available signed base-contract version may be analysed;
- quarantine objects, amendments, storage keys, filenames, browser scope, and provider output never authorize access;
- `personnel.document.read` remains necessary for the existing document surface;
- a future extraction request requires distinct `personnel.document.extract`;
- applying selected employee changes also requires `personnel.employee.manage`;
- existing employee revision, idempotency, date, CDD-reason, and audit behavior remains authoritative.

### Proposed application boundary

The future route-owned application service should orchestrate interfaces rather
than embed an SDK in a React component, server action, repository, or storage
adapter.

```text
trusted tenant context + employee/document identifiers
-> extraction authorization
-> scoped exact-version content grant
-> open available private object
-> local PDF preflight and page/text-density classification
-> replaceable structured-extraction adapter
-> strict schema parse
-> employee-domain normalization and validation
-> transient review result
```

Proposed server-only interfaces:

```ts
type ContractExtractionRequest = {
  requestId: string;
  employeeId: string;
  documentId: string;
  documentVersion: number;
  employeeRevision: number;
  locale: string;
};

interface ContractPdfPreparer {
  prepare(bytes: Uint8Array): Promise<PreparedContractDocument>;
}

interface ContractExtractionAdapter {
  extract(input: PreparedContractDocument): Promise<UnknownAdapterResult>;
}

interface PersonnelContractExtractionService {
  extract(
    context: TrustedTenantContext,
    request: ContractExtractionRequest,
  ): Promise<ContractExtractionReviewResult>;
}
```

These are design shapes, not authorized contracts. `TrustedTenantContext` and
document bytes are never serialized to the browser or accepted from browser
input. The provider adapter receives no database client, storage adapter,
employee mutation function, tools, URL-fetch capability, or tenant-selection
mechanism.

### Strict review-result shape

The future result is versioned and bounded:

```text
schemaVersion: 1
requestId: UUID
document: documentId + exact version
employeeRevision: positive integer captured at request time
status: complete | partial | no_result | unsupported
suggestions: maximum 8 strict discriminated items
warnings: allowlisted machine codes only
expiresAt: short review expiry
```

Each suggestion contains only:

- allowlisted `field`;
- typed `candidateValue` matching that field;
- `confidence`: `high | medium | low`;
- one-based `sourcePage` within the verified page count;
- fictional/provider evidence reduced to one bounded excerpt of at most 240 characters;
- allowlisted `issueCodes`, never arbitrary keys or instructions.

The first apply-capable set is `position` and `contractWeeklyMinutes`.
`employmentTermType` may be returned for review but is `blocked_by_dependency`
unless the future result also supports and validates `expectedEndDate` and
`fixedTermReasonCode`. Unknown values, ambiguous mappings, remuneration,
identity, departure, and register facts are dropped rather than coerced.

### Interaction state machine

```text
idle
-> authorizing
-> preparing
-> extracting
-> validating result
-> ready | partial | no_result | unsupported | failed
-> reviewing local choices
-> applying selected fields
-> success | employee_conflict | document_stale | validation_failed
```

Only one request may be in flight for a drawer. Closing the drawer cancels the
client wait but does not authorize background processing. The first slice has a
45-second server timeout, no automatic provider retry, and one explicit manual
retry using a new request ID. `Consulter` and `Télécharger` remain independent.

Suggestions stay only in browser memory for the first slice and are invalidated
by reload, drawer close, document replacement/version change, employee revision
change, establishment switch, expiry, or permission loss. Applying zero fields
is a no-op. An apply request carries only selected field names and candidate
values as untrusted form input plus a fresh idempotency key and expected
employee/document versions. The server reauthorizes and revalidates everything;
it never trusts a confidence score or excerpt.

### Processing and provider strategy

The recommended architecture is hybrid, not vendor-coupled:

1. YUTA performs file ownership resolution, malware-state verification, size,
   media type, page count, and text-density checks locally.
2. A replaceable adapter performs semantic extraction.
3. A provider-specific adapter maps its response into the same strict YUTA
   result before domain validation.

If an OpenAI adapter is later approved, official OpenAI documentation states
that Responses file inputs may be inline Base64 and that PDF processing can use
both extracted text and page images. The adapter should therefore avoid a
persistent Files object and send one inline exact-version PDF with structured
output, `store: false`, no tools, and no background mode. Structured Outputs
constrain a supported JSON Schema, but refusal, truncation, and incomplete
results still require explicit failure handling.

`store: false` alone is not a privacy approval. Official OpenAI data controls
state that API customer content is not used for training by default, while
default abuse-monitoring retention may be up to 30 days; Zero Data Retention or
Modified Abuse Monitoring and European regional processing require account and
contract eligibility. Consequently every remote real-file call remains blocked
until WF2-06 evidence is accepted.

Official references reviewed on 2026-08-18:

- <https://developers.openai.com/api/docs/guides/file-inputs>;
- <https://developers.openai.com/api/docs/guides/structured-outputs>;
- <https://developers.openai.com/api/docs/guides/your-data>.

### Retention, audit, limits, and observability

- raw PDF preparation text, page images, prompts, provider responses, and rejected unknown keys are request-scoped and discarded;
- the first slice creates no extraction-result table, vector store, Files object, conversation, or browser persistence;
- evidence excerpts exist only in the transient response and current OWNER UI;
- audit outcomes are minimized to trusted scope, actor, document/version reference, request operation ID, action, outcome code, suggestion count, selected field names, and timestamp;
- audit and application logs contain no employee names, candidate/current values, snippets, PDF content, prompt, response, storage key, provider request ID, model output, or provider error body;
- operational metrics may contain duration bucket, page-count bucket, status code, adapter name/version, token/cost bucket, and rate-limit outcome without document or employee identifiers;
- first-slice guards are one PDF, 10 MiB, 40 pages, one in-flight request per drawer, and 10 requests per establishment per rolling 24 hours;
- production needs a shared rate-limit/idempotency owner before multi-instance deployment; in-memory coordination is development evidence only.

### Required Phase 3 test matrix

- OWNER success with a synthetic text PDF and strict result;
- no permission, MANAGER/STAFF, service actor, missing membership, wrong organization, and wrong establishment denial;
- employee/document mismatch, amendment ID, old version, unavailable/quarantine object, media mismatch, checksum mismatch, over-size, and over-page-limit denial;
- prompt-like instructions and links inside PDF treated only as document text;
- unknown field, extra key, invalid enum/date/minutes, page out of range, long excerpt, refusal, truncated JSON, timeout, and provider failure rejection;
- no-result/partial/unsupported states without disabling view/download;
- employee revision and document version conflicts before apply;
- zero-field no-op, duplicate apply idempotency, and existing changed-field audit preservation;
- log/audit redaction assertions and no outbound call before authorization/security checks;
- cost/rate limit and manual retry behavior;
- production runtime disabled until provider/legal/privacy/security/operations gates are true.

### Phase 2 change flags

```text
Files modified: existing Salariés page-pack Markdown only
Files created: none
Database/schema/migration: NO
Transport or application contract: NO
Runtime service/provider/SDK/library: NO
Permission or audit event: NO
File read/transmission: NO
Employee or register mutation: NO
Operational data: unchanged
Production: NOT AUTHORIZED
```

## Wave F Phase 0 — proposed extraction data and interaction boundary

Status: documentation proposal only. No runtime or operational data changes.

### Current reusable boundary

The current secure-document sequence is authoritative and must remain separate
from extraction:

```text
OWNER upload
-> server authorization and tenant scope
-> PDF signature/size check
-> private quarantine
-> malware scanner
-> promotion to private available storage
-> scoped metadata commit
```

A later extractor may read only an exact available document version after a
fresh authorization check. It must not read quarantine objects, accept browser
storage keys, create a public URL, bypass malware inspection, or become the
storage service. No AI/OCR implementation or package exists today.

### First-slice field allowlist

| Employee field             | Phase 0 disposition                                                                 |
| -------------------------- | ----------------------------------------------------------------------------------- |
| `position`                 | May be suggested as detected contract wording; OWNER review required                |
| `qualification`            | May be suggested; do not derive from position alone                                 |
| `employmentTermType`       | May suggest CDI/CDD only when explicit; otherwise unresolved                        |
| `expectedEndDate`          | May suggest for explicit CDD date; never infer a departure                          |
| `fixedTermReasonCode`      | May map only to the existing controlled allowlist; unmatched text stays unresolved  |
| `workTimeCategory`         | May suggest full/part-time only when explicit                                       |
| `contractWeeklyMinutes`    | May suggest from an explicit weekly duration using deterministic unit conversion    |
| `entryDate`                | May suggest a stated employment start date; source label must stay visible          |
| names and identity         | Excluded from first MVP; the known employee attachment is not identity verification |
| `departureDate`            | Excluded; a base contract end is not automatically an actual departure              |
| register-only facts        | Excluded; register correction remains a separate append-only flow                   |
| remuneration/other clauses | Ignored and never returned as suggestions                                           |

### Proposed provider-neutral service boundary

A later application-owned interface should accept trusted document bytes plus a
server-created request context and return a strict, versioned suggestion result.
The interface belongs behind the Backoffice server boundary; it is not a
browser API, database adapter, shared generic AI platform, or provider SDK
exposed to business components. One adapter can later be replaced without
changing the Documents UI or employee mutation rules.

The proposed pipeline has separable stages: PDF/text preparation, optional OCR
for image-only pages, structured extraction, schema validation, and employee-
domain validation. A digital-text parser, local OCR engine, or remote multimodal
provider may implement stages later; Phase 0 selects none. The output contains
only allowlisted field identifiers, typed candidate values, confidence bands,
page references, and bounded evidence for current review. It contains no tool
instructions or arbitrary keys.

### Review and apply interaction

```text
OWNER opens one employee Documents tab
-> selects Analyse this verified contract
-> server reauthorizes document extraction for exact scope/version
-> pending state keeps the current document visible
-> strict suggestions return with current versus detected values
-> OWNER accepts or rejects each field
-> selected fields are revalidated against a fresh employee revision
-> existing employee update semantics commit or return conflict
-> document and register records are not rewritten
```

No suggestion is preselected solely because confidence is high. Unknown,
ambiguous, conflicting, or unsupported content stays unresolved. Applying zero
fields performs no mutation. A changed document version invalidates the result;
a changed employee revision requires refresh and re-review rather than merge.

### Sensitive handling, audit, and retention proposal

- never put PDF bytes, raw text, prompt, response, names, values, confidence,
  snippets, page images, storage keys, or provider IDs in URLs, analytics, or
  generic logs;
- raw text/model response is request-scoped and discarded by default; any later
  encrypted short-lived cache needs an explicit TTL and deletion decision;
- propose distinct `personnel.document.extract` permission, initially OWNER-only;
- propose minimized events for extraction requested, result delivered, and
  selected fields applied, containing trusted scope, actor, document/version
  reference, action, outcome code, and time only;
- denied/provider/malware failures belong to security/operational telemetry and
  must reveal no employee or document existence across scope;
- applying suggestions continues to use the existing employee changed-field
  audit and never copies old/new sensitive values into audit metadata.

### Required discovery states

Unavailable/no contract, ready-to-analyse, explicit consent/disclosure if a
remote provider is later used, pending, typed suggestions, partial/no result,
unsupported/image-only file, provider unavailable, rate/cost limit, document-
version stale, employee-revision conflict, apply pending, validation failure,
success, retry, forbidden, and production-disabled. Every state is textual and
does not claim that AI verified legal accuracy.

### Phase 0 change flags

```text
Files modified: existing Salariés page-pack Markdown only
Files created: none
Packages affected: documentation only
Cross-application impact: none
Database change: NO
API or contract change: NO
Permission/auth change: NO
Audit change: NO
Runtime/provider/AI call: NO
File read or transmission: NO
Operational data: unchanged
Production: NOT AUTHORIZED
```

## Wave F Phase 5 — final local interaction evidence

Phase 5 introduces no stored or transported data. One signed-in OWNER session
ran the complete synthetic scenario against a server-generated fictional PDF.
The signed document metadata remained visible, but its binary was not opened or
transmitted for extraction. No review choice was applied, so employee,
document, amendment, and register records were unchanged.

The final interaction evidence confirms explicit manual review, disabled apply
without a supported selection, responsive stacking, clean console output, and
focus restoration to the collapsed analysis action. The transient result and
15-minute server review grant remain development-only. Real-file/provider
evaluation and all production data-processing decisions remain blocked.

## Wave G Phase 0 — synthetic evaluation data and measurement design

Status: `DOCUMENTATION ONLY; NO EVALUATION RUNTIME OR EXTERNAL REQUEST`.

### Repository reconciliation

The Wave F server already owns separate `ContractPdfPreparer` and
`ContractExtractionAdapter` interfaces, authorization before fixture
preparation, strict result parsing, exact employee/document versions, a
45-second timeout, and a development-only limiter. The current preparer only
counts pages in a generated PDF; the deterministic adapter returns known fixture
values. No native text extractor, OCR engine, provider SDK, provider account,
secret, remote adapter, eval runner, or cost/quality result store exists.

No current package manifest declares OpenAI or another OCR/AI client. `pdf-lib`
generates and inspects synthetic PDFs and checks page count; it is not an
OCR/text-extraction engine. The current direction does not add Tesseract,
native-text extraction, or another self-hosted OCR path.

### Synthetic benchmark corpus proposal

A later approved phase should generate at least 60 fully fictional PDFs and a
versioned answer manifest:

| Class                 | Minimum | Purpose                                                                             |
| --------------------- | ------: | ----------------------------------------------------------------------------------- |
| Digital text          |      20 | clean French clauses, layout variations, selectable text                            |
| Clear scans           |      15 | rasterized pages, rotation and ordinary scanner noise                               |
| Degraded scans        |      15 | skew, low contrast, blur, stamps, broken characters                                 |
| Ambiguous/adversarial |      10 | contradictory clauses, unsupported fields, instruction-like PDF text, missing facts |

Fixtures must use invented people, establishments, dates, references, and
document identifiers that do not match local or production records. They may
contain only the Wave F allowlisted facts and deliberate unsupported decoys.
No copied template may contain a real signature, address, salary, bank value,
identity number, work permit, or employee metadata.

### Required measurements

- exact match per supported field and document class;
- false suggestion and abstention rates;
- schema-valid result or clean rejection rate;
- incorrect high-confidence suggestions;
- unsupported-field and arbitrary-key leakage;
- resistance to instruction-like PDF text and cross-page contradictions;
- p50/p95 duration, timeout and service-failure rate;
- input/output usage and actual cost per synthetic document;
- number of transmitted bytes/pages and confirmation that only the fictional
  PDF left YUTA;
- reproducibility by pinned OpenAI model snapshot and request configuration;
- operator review burden: suggestions accepted, rejected, or left unresolved.

### Proposed pass/fail rules

1. Every response must either satisfy the existing strict YUTA schema or be
   rejected; malformed output never reaches review.
2. Unsupported fields, arbitrary instructions, prompt text, or new keys have
   zero tolerance.
3. The approved corpus must contain no incorrect `high`-confidence suggestion.
4. A candidate must prefer an unresolved/partial result over guessing when a
   clause is absent, contradictory, or unreadable.
5. Clear digital-text exact-field accuracy should be at least 95%; clear-scan
   accuracy should be at least 90%. Degraded scans are assessed primarily on
   safe abstention, not forced recall.
6. Foreground p95 must remain within the existing 45-second boundary; timeout
   and failure must preserve document view/download and manual retry.
7. Cost is recorded, not pre-approved. Product must set an expected monthly
   volume, per-request limit, and monthly budget before OpenAI can be selected.

These thresholds are proposals for product/security review, not claims about a
provider's current performance.

### Proposed provider boundary

| Path                        | Content leaving YUTA in a future real flow | Main benefit                                               | Main limitation / gate                                                                                       |
| --------------------------- | ------------------------------------------ | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| OpenAI Responses direct PDF | complete PDF                               | one external multimodal step plus strict structured output | EU project and eligible snapshot, file/image approval, retention control, DPA, cost, and external processing |

OpenAI is the only provider proposed for this evaluation. The benchmark may
compare pinned OpenAI snapshots and bounded request settings, not local OCR or
multiple vendors. Azure Document Intelligence, Google Document AI, Tesseract,
and local-first OCR are not fallback tasks in this wave. If OpenAI is rejected,
YUTA stops and opens a separate provider decision while reusing the same
provider-neutral adapter.

### OpenAI-specific discovery facts

Official OpenAI documentation rechecked on 2026-08-18 confirms that Responses
can accept file input and strict structured output. API content is not used for
training by default. Default abuse-monitoring logs may retain customer content
for up to 30 days; approved Zero Data Retention or Modified Abuse Monitoring
changes that boundary. `store: false` alone is not equivalent to an approved
retention control. Europe supports regional storage and processing through
`eu.api.openai.com`, but a non-US project requires approved abuse-monitoring
controls and a Modified Retention amendment. Image input in the region requires
enhanced approval, and file/image inputs retain documented safety-scanning
exceptions even under retention controls. Endpoint, model snapshot, input mode,
contractual terms, and project configuration must therefore be verified again
before any employee file is used. No OpenAI real-file call is approved by this
discovery.

### Legal, privacy, and operations boundary

The CNIL recommends evaluating AI-specific risks, transparency, human control,
fabricated output, security, and whether an AIPD is necessary before deployment.
A real-file provider must also be governed as a processor with documented
purpose, duration, location, subprocessors, deletion, security, incident,
rights-assistance, and audit terms. Synthetic evaluation reduces current data
risk but does not pre-approve the later employee-data processing.

### Official sources reviewed

- OpenAI file/PDF input: https://developers.openai.com/api/docs/quickstart
- OpenAI structured output and data controls: https://developers.openai.com/api/docs/guides/your-data
- OpenAI current model comparison: https://developers.openai.com/api/docs/models/compare
- CNIL AI impact assessment: https://www.cnil.fr/fr/realiser-une-analyse-dimpact-si-necessaire
- CNIL processor security: https://www.cnil.fr/fr/securite-gerer-la-sous-traitance

### Phase 0 change flags

```text
Files modified: existing Salariés page-pack and current-state Markdown only
Files created: none
Packages affected: documentation only
Database/schema/migration: NO
Transport or application contract: NO
Runtime service/provider/SDK/library: NO
Permission or audit event: NO
External request: NO
File read/transmission: NO
Employee/document/register mutation: NO
Operational data: unchanged
Production: NOT AUTHORIZED
```
