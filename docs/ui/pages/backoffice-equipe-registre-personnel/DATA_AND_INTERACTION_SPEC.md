# Backoffice Équipe — Registre du personnel — Data and Interaction Spec

Status: Phase 4 local integration hardening complete; production blocked

Visibility: Engineering

## Current versus missing data

Reusable proposals: names, position, qualification, entry/departure dates, and
derived CDD/part-time mentions. Missing proposals: nationality, birth date,
sex, conditional authorization/work-title data, temporary-work/employer-group
facts, apprenticeship/professionalization, stagiaire/service-civique records,
canonical arrival sequence, reconstructable dated history, and retention markers.

Current UUID, `createdAt`, `entryDate`, list order, mutable dossier row, and
bounded audit history are not approved substitutes for an indelible register.
CDD reason, weekly minutes, PDF content, login users, and POS data must not be
exported merely because they exist.

## Phase 1 fixture boundary

The route-local presentation type contains only a fictional ID, canonical
display position, name, position, qualification, ISO entry/departure dates,
contract label, work-time label, and missing-field keys. The page derives the
distinct missing-information count and localized dates in pure presentation
logic. These values are neither transport contracts nor proposed database
columns.

The only enabled interactions are navigation from Salariés and return to
Salariés. PDF export is a disabled button. No browser state, request, mutation,
repository read, audit event, file, or generated artifact exists.

## Proposed later flow

```text
OWNER opens proposed route
-> server derives organization + establishment
-> server checks proposed register-read permission
-> ordered minimized structured snapshot and readiness load
-> OWNER requests PDF
-> server reauthorizes export and snapshot version
-> server generates protected response
-> minimized export audit records actor/scope/action/time
-> browser downloads without public or stable URL
```

All browser scope, order, category, and snapshot inputs are untrusted. A stale
export must refresh rather than combine versions.

## Data classes and retention

Stored later only after approval: missing register facts, person category,
arrival order, dated corrections/history, and retention markers. Derived:
controlled contract labels and readiness. Transient: view/export state.
Generated: PDF bytes from one snapshot, not stored by default.

Five-year post-departure retention is the reviewed baseline, but start event,
archive, legal hold, rights, correction, deletion, backup/restore, and incident
operations remain approval gates.

## Phase 2 technical proposal

Phase 2 was authorized on 2026-08-18 for documentation only. The structures
below are domain and transport proposals, not database tables or implementation
authority.

### Establishment ownership and person categories

A later register owner receives trusted `organizationId` and `establishmentId`
from the validated server session for every read, correction, and export.
Lookup by register-entry ID, employee ID, cursor, or snapshot version alone is
forbidden.

The aggregate distinguishes three categories:

| Category                  | Phase 2 recommendation                                                                                    |
| ------------------------- | --------------------------------------------------------------------------------------------------------- |
| `employee`                | First later real-data slice; use the employee dictionary below                                            |
| `intern`                  | Separate register part; retain as unavailable until the D1221-23-1 field and lifecycle design is approved |
| `service_civic_volunteer` | Separate register part; retain as unavailable until its exact legal dictionary and retention are approved |

No category can be converted into another. A new relationship creates a new
ordered entry after product/legal review; it does not rewrite the prior entry.

### Proposed employee field dictionary

The dictionary follows D1221-23 and intentionally excludes payroll, salary,
CDD reason, weekly minutes, contact details, document filenames, and PDF data.

| UI/domain fact                           | Classification                      | Proposed rule                                                                                                |
| ---------------------------------------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| family name and given names              | required stored register fact       | Freeze the reviewed inscription spelling; later correction is append-only                                    |
| nationality                              | required stored register fact       | Controlled nationality value plus French display label; exact code list requires DPO/legal approval          |
| birth date                               | required date-only fact             | Never infer from an identifier or document                                                                   |
| sex                                      | required controlled legal fact      | Proposed `F` or `M` register value only; never infer from title, name, gender identity, or document          |
| employment                               | required stored register fact       | Reuse reviewed Salariés position text at inscription, then version changes                                   |
| qualification                            | required stored register fact       | Reuse reviewed Salariés qualification text at inscription, then version changes                              |
| establishment entry date                 | required date-only fact             | Also anchors canonical inscription order; ties use the irreversible sequence                                 |
| establishment departure date             | optional then required on departure | Append when the event occurs; never remove the historical departure by overwriting                           |
| protected hiring/dismissal authorization | conditional structured fact         | Requirement flag plus authorization date or request date; no free-form notes                                 |
| work authorization title                 | conditional structured fact         | Requirement flag plus title type and order number; annex copy remains a separate future Documents capability |
| fixed-term contract mention              | derived versioned mention           | Derive controlled `contrat à durée déterminée` from an approved contract fact                                |
| temporary employee mention               | conditional structured fact         | Controlled mention plus temporary-work company legal name and structured address                             |
| employer-group assignment                | conditional structured fact         | Controlled mention plus employer-group legal name and structured address                                     |
| part-time mention                        | derived versioned mention           | Derive controlled `salarié à temps partiel`; do not export weekly minutes                                    |
| apprenticeship/professionalization       | conditional controlled mention      | `apprenti` or `contrat de professionnalisation`; current Salariés model cannot supply it                     |

Conditional requirement flags are server-owned facts. The browser cannot hide
a conditional field by changing a category or checkbox. Every proposed code
list, including nationality and sex, remains subject to legal/DPO approval.

### Canonical order and reconstructable history

- assign one monotonically increasing sequence within one establishment when a
  reviewed inscription is first accepted;
- sequence assignment is atomic, irreversible, never reused, never editable,
  and is the final tie-breaker after the establishment entry date;
- do not use UUID, `createdAt`, current list position, employee name, or import
  order as legal sequence authority;
- store an immutable first inscription and append later fact events/corrections
  with effective date, recorded time, actor, reason, prior revision, and new
  revision;
- a correction never deletes a prior value, renumbers another person, or edits
  an already generated PDF;
- current register presentation is a deterministic projection of the accepted
  entry plus its ordered events at one snapshot revision;
- onboarding existing employees requires explicit reviewed inscription; no
  silent backfill and no claim that historical completeness predates YUTA.

### Read, pagination, and readiness interactions

The initial route read returns one establishment readiness summary and the
first 50 entries in canonical order. Later pages use opaque cursors bound to
the trusted establishment and snapshot revision. The UI offers only
`Précédent` and `Suivant`; no user sort, drag/reorder, total, infinite scroll,
URL cursor, or organization-wide view is proposed. Search/filter remain
deferred because a filtered view could be mistaken for the full register.

Readiness is derived at the same snapshot:

- `ready`: every required and applicable conditional employee fact is present;
- `incomplete`: at least one required/applicable fact is missing, with safe
  field labels but no sensitive value in summaries or logs;
- `unsupported_category`: intern/service-civic data exists or is expected but
  that category is not yet modeled;
- never show `Conforme`, certification, or a legal guarantee.

PDF export remains disabled unless the complete employee register snapshot is
`ready` and no unsupported category needs inclusion. Empty establishments may
view a truthful empty state but cannot export a misleading empty certificate.

### Proposed authorization and audit

Add distinct future permissions `personnel.register.read` and
`personnel.register.export`, both initially OWNER-only. Export requires both.
Visible navigation and the existing `personnel.employee.read` permission are
not substitutes. Denials disclose no names, counts, missing fields, sequence,
snapshot, or category presence.

Every successful register data response, including pagination, proposes one
`personnel.register_viewed` event. Every successful PDF response proposes one
`personnel.register_exported` event. Events contain actor, trusted organization
and establishment, action, server time, and an idempotent operation reference
only. They exclude names, entry IDs, counts, fields/values, missing reasons,
sequence numbers, cursor, snapshot content, PDF bytes, browser details, IP,
token, and filename. Denied attempts belong to security telemetry policy, not
employee/register history.

### Protected PDF response contract

Export is a server-mediated read, not a stored document workflow:

1. reauthorize read and export permissions and trusted establishment;
2. re-read one complete snapshot revision and reject stale browser hints;
3. generate all supported entries in canonical order from that one snapshot;
4. return `application/pdf` as an attachment with a generic establishment-safe
   filename, `Cache-Control: no-store`, and no public/stable URL;
5. record the minimized export event only for the successful response;
6. discard generated bytes after the response; no default object storage,
   email, sharing, archive, signature, or certification.

The PDF contains its generation time, establishment identity, represented
snapshot revision, and a clear page sequence, but no internal UUID, audit ID,
storage key, or compliance badge. Exact typography, legal headings, annexes,
and inspection/CSE presentation require separate legal approval.

### Conflict, idempotency, and recovery

Future corrections require an expected register revision, an idempotent
operation ID, a bounded reason, effective date, and server-derived actor. A
replayed operation returns its original safe result; a different payload using
the same operation ID fails; a stale revision returns conflict plus refresh and
never merges values silently.

Pagination keeps the current page visible with `aria-busy` and replaces it only
after success. A snapshot change invalidates its cursor and asks the user to
refresh. Full read failure reveals no stale multi-person data. Export pending
disables repeat submission; stale/incomplete/unsupported state explains why no
file was produced. No polling, timer, background generation, notification,
email, public API, or provider is proposed.

### Retention and correction boundary

For supported employees, retain register mentions for five years from the
establishment departure date. Do not start retention from record creation,
account deletion, contract end, or PDF export. A legal hold pauses later purge.
Eligibility does not authorize automatic deletion until rights, archive,
backup/restore, audit retention, incident response, and operations procedures
are approved. Stagiaire uses its separately reviewed departure/end event;
service-civic retention remains a legal decision. Generated PDF bytes are not
retained by default.

### Phase 2 decision register

| ID     | Recommended choice                                                                                                                    | Approval state                                 |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| WE2-01 | Limit the first later real-data slice to `employee`; keep intern and service-civic categories separate and unavailable                | Approved; local implemented                    |
| WE2-02 | Own one register aggregate per organization + establishment and authorize every operation from trusted session scope                  | Approved; local implemented                    |
| WE2-03 | Use only the D1221-23 employee dictionary and conditional structures above; exclude unrelated HR/payroll/document facts               | Approved; local implemented                    |
| WE2-04 | Create reviewed inscriptions from approved facts; never treat the mutable employee row, PDF, UUID, or `createdAt` as register truth   | Approved; local implemented                    |
| WE2-05 | Assign an atomic irreversible establishment sequence and keep append-only versioned events/corrections with reason and actor          | Approved; local implemented                    |
| WE2-06 | Read 50 canonical entries per opaque snapshot-bound cursor page; no sort, filter, total, URL cursor, or reordering                    | Approved; local implemented                    |
| WE2-07 | Derive ready/incomplete/unsupported states without a compliance claim; export only a complete supported snapshot                      | Approved; supported employee slice implemented |
| WE2-08 | Add future OWNER-only `personnel.register.read` and `personnel.register.export`; export requires both                                 | Approved; local implemented                    |
| WE2-09 | Audit every successful data response and PDF response with minimized allowlisted events and idempotent operation reference            | Approved; local implemented                    |
| WE2-10 | Generate PDF server-side from one reauthorized snapshot, return no-store attachment, and retain no bytes or public URL                | Approved; local implemented                    |
| WE2-11 | Use expected revision plus idempotent operation ID for future corrections; stale state fails closed and refreshes                     | Approved; local implemented                    |
| WE2-12 | Retain supported employee mentions five years from departure; legal hold and purge/backup procedures remain later gates               | Approved baseline; no purge implemented        |
| WE2-13 | Implement the truthful loading/empty/incomplete/unsupported/forbidden/error/conflict/export recovery contract before real integration | Approved; local supported states implemented   |
| WE2-14 | Require the test matrix and legal/DPO/privacy/security/operations gates below; keep Wave F AI/OCR separate                            | Approved; production gates remain open         |

### Required tests before a real-data phase

- two organizations and two establishments with no cross-scope existence,
  name, field, category, sequence, cursor, snapshot, readiness, or PDF leakage;
- OWNER read/export success and MANAGER/STAFF/service/public/missing-
  establishment/missing-permission denial;
- exact required and conditional field combinations, including no inference of
  nationality, sex, authorization, contract, or apprenticeship facts;
- atomic sequence assignment under concurrent inscriptions, immutable ties,
  no reuse, no reorder, and no silent existing-employee backfill;
- deterministic append-only projection, effective/recorded ordering, stale
  revision conflict, idempotent replay, operation-ID payload mismatch, and
  historical reconstruction;
- 50-entry cursor pages with ties, snapshot invalidation, no duplicate/omitted
  entry, and no cross-establishment cursor reuse;
- ready, incomplete, unsupported category, empty, full failure, forbidden,
  stale cursor, export pending/failure/success, and recovery states;
- PDF uses one snapshot and canonical order, fails for incomplete/unsupported/
  stale state, has protected headers, no stable URL/storage, and no internal IDs;
- exactly one minimized event per successful read response/export response,
  deduplicated retry, and no sensitive metadata or event for denied output;
- five-year eligibility boundaries, legal hold, no premature purge, and future
  backup/restore behavior;
- keyboard, focus, disabled/pending semantics, 1440/1024/768/390 layout, long
  names/addresses, pagination, and horizontal overflow.

## Phase 2 change flags

```text
Database/API/contract/permission/audit change: YES, local Phase 3
Runtime change: employee-only real-data route in development
Register model/read/export/permissions/audit: IMPLEMENTED LOCALLY
Fixture/prototype UI: REPLACED; fictional fixtures are no longer read
Production: FAIL-CLOSED / NOT AUTHORIZED
```

## Phase 4 as-built hardening notes

- Cursor tokens exist only in component memory and server-action payloads; they
  are not copied into route URLs, logs, audit metadata, or PDF content.
- An idempotent retry reconstructs the result originally accepted by that
  operation, not a later current projection. A changed payload with the same
  operation ID and a correction with no fact change both fail closed.
- Mutation authorization combines register-read with employee-management; PDF
  export continues to require register-read plus register-export.
- PDF generation uses packaged, locally read Noto Sans subsets registered with
  `pdf-lib` fontkit. Supported local subsets cover Latin, Vietnamese, Greek,
  Cyrillic, and Devanagari. Any unsupported character blocks generation rather
  than being replaced; the endpoint then records no successful export event.
- Expanding script coverage and validating exact legal typography remain a
  production gate. Phase 4 introduces no additional schema or migration.
