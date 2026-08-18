# YUTA Current State

Status: Current

Visibility: Engineering

Owner: YUTA engineering

Last updated: 2026-08-15

## Product scope

YUTA intentionally maintains deliberately separated cloud and local runtime
families in one monorepo.

- Cloud: public website, restaurant back-office, independent public booking and
  feedback applications, identity, tenancy, reputation, and cloud-owned
  configuration.
- Restaurant local: POS client, site-agent API/device boundary, and POS database.
- Standalone local: digital signage display and its app-owned database.

POS operational data must never be stored in or synchronized to the cloud
database. Display data remains separate from both cloud and POS data.

The restaurant back-office does not expose customer ordering, checkout,
payment, invoicing, transaction-linked loyalty, promotion, or generic email
workflows. Those local operational concerns remain outside the cloud service.
Establishment identity and the room/table structure are grouped as core
establishment data. The table map is limited to physical seating and
reservation availability.

## Implemented

- pnpm monorepo, shared contracts/core/UI packages, and import-boundary checks.
- Separate `db-cloud` and `db-pos` packages; the legacy shared `@yuta/db` has
  been removed from tracked source.
- Organization/establishment tenancy, memberships, entitlements, server-side
  sessions, tenant switching, and user/membership administration.
- Public website and an independent tenant-scoped direct-feedback application.
- Public booking Phase 0/1 foundations: independent booking app, booking domain,
  cloud persistence, availability/capacity rules, public creation and management,
  and back-office reservation workflows.
- Establishment-scoped Backoffice Today dashboard using current reservations,
  booking service periods and dated exceptions, and entitled reputation
  feedback, with independent truthful section states.
- Establishment-owned general profile data and Backoffice editor for identity,
  structured address, contacts, website, media URLs, languages, service modes,
  and public visibility. OWNER and MANAGER may edit; STAFF is read-only.
- Backoffice navigation includes cloud-owned integrated, prototype, and planned
  surfaces. Their maturity is recorded below. None of these routes reads from
  or synchronizes with POS data.
- Local POS ordering, kitchen, payment, printing, administration, and reporting
  workflows described in the POS product documentation.
- Standalone digital-signage administration and resilient display playback.

## Back-office surface maturity

Navigation visibility is not evidence that a capability is implemented. The
current restaurant back-office surfaces fall into three groups:

### Integrated and data-backed

- Today dashboard;
- reservation list and reservation settings;
- establishment general information and booking hours/services;
- direct satisfaction and reputation review management;
- tenant user and membership administration.

`/parametres/integrations` is also data-backed and owns the tenant-scoped Google
Business Profile connector, although it is not currently a primary navigation
item.

The reservation list defaults to the establishment-local date, supports day and
inclusive seven-day views, and uses persisted tenant-scoped reservation data.
Its canonical back-office routes are `/reservations` and
`/reservations/parametres`; legacy `/operations/reservations` URLs redirect to
their canonical equivalents.
Manual creation reports a visible success state after persistence. Reservation
creation, guest updates, internal notes, and status changes expose pending,
field-validation, conflict, save-error, and recovery feedback while preserving
the submitted values after failures. Reservation detail keeps those mutations
and status history tenant-scoped; note and history timestamps use the
establishment locale and timezone.

Reputation surfaces use the canonical capability routes
`/visibilite-reputation/avis` and `/visibilite-reputation/satisfaction`;
legacy `/clients/*` URLs redirect to their canonical equivalents.

### UI prototypes with fixture data only

- room and table map;
- stock inventory, stock movements, and suppliers;
- compliance monitoring;
- creative studio;

These prototypes have local presentation state but no cloud repository or
persisted mutation. Their export, create, edit, archive, verification,
generation, and similar controls must not be described as implemented product
capabilities. Each prototype displays a shared demonstration-data notice, and
controls that would imply a persisted mutation, generated artifact, or export
are disabled. Local filtering and selection remain available for interface
evaluation, and selected prototype detail panels can be closed. Controls with
no local behavior or persisted owner are disabled instead of appearing
actionable. Fixture-backed stock tables report only the demonstration rows
currently visible and do not present fabricated totals or pagination.
Integrating one requires an approved product scope, data owner, authorization
model, contracts, persistence, and tests.

### Integrated personnel foundation

- `/equipe/salaries` now reads the establishment-owned personnel dossier table
  through an OWNER-only, server-authorized, organization-and-establishment-
  scoped repository. The former employee fixtures and simulated states are
  removed. The empty, loading, forbidden, error, search/filter, summary, and
  responsive list states use the real read path.

Employee creation is implemented for development as an atomic, OWNER-only
vertical slice with validation, duplicate review, idempotent retry, and a
minimal creation audit event. Editing of the approved minimum identity and
employment fields is also implemented with optimistic revision checks,
idempotent retry, and field-group audit events. Non-destructive departure,
correction, and reopening are implemented with the same revision and retry
guards plus immutable reasoned audit events. Production data collection remains
blocked by the recorded privacy, retention, and operational-security gates.
The employee detail now exposes a bounded, read-only history of these approved
events. It resolves the actor display name server-side and never exposes raw
audit metadata, operation IDs, or tenant identifiers. History is loaded only
when its detail tab is opened and has explicit loading, failure, and retry
states. Minimum-field completeness is derived, filterable, explained by field,
and links to the supported edit action.

The local employee dossier also stores an optional controlled CDD reason and
optional contractual weekly duration in integer minutes. New dossiers require
a weekly duration and supported CDD writes require one of four allowlisted
reasons. Existing nullable rows remain valid and these fields do not yet affect
dossier completeness. The existing OWNER-only, establishment-scoped edit flow
uses revision/idempotency guards and records only changed field names in audit
metadata. Production collection remains gated.

The employee dossier also has a local-development secure-document slice for one
category: signed employment contracts in PDF up to 10 MiB. OWNER-only actions
list, add, replace, view, and download through the Backoffice server. Metadata
is establishment scoped in cloud persistence; binary content is kept outside
PostgreSQL in a private local adapter, quarantined, and checked by Microsoft
Defender before becoming available. The runtime fails closed in production;
EU object storage, an EU-approved scanning service, retention/deletion rules,
backup/restore, and operational ownership remain release blockers.

The signed-contract surface also has a development-only Wave F synthetic
extraction slice. It generates a fictional three-page PDF in server memory,
uses a replaceable local preparer and deterministic adapter, and never opens or
transmits the employee's signed file. OWNER-only review supports bounded local
states and may apply only position and contractual weekly minutes through the
existing scoped revision/idempotency/audit update path. CDI/CDD remains
review-only. Remote AI/OCR, real personnel-file processing, shared production
rate limiting, provider configuration, and production release remain blocked.

Signed employment-contract amendments are implemented as a second local-only
document slice. Each amendment is a distinct establishment-owned record with a
required effective date, optional bounded reference, immutable correction
versions, optimistic revision, idempotent add/replace, and ten-item cursor
pages. It reuses the OWNER-only document permissions, private local storage,
Microsoft Defender quarantine check, server-mediated delivery, and minimized
document audit events. It does not alter the base contract record or derive
employment facts from PDF content. Production remains fail-closed under the
same provider, retention, rights, backup/restore, and incident gates.

In development mode, the page also contains the local Wave D real-data
`À traiter` overview. It derives three approved item kinds from bounded,
tenant-scoped employee and signed-contract metadata reads, revalidates targets,
and reuses the existing edit, Documents-add, and departure-review flows. Each
authorized overview read writes one minimized access-audit event. It adds no
task state, reminder, notification, schema, migration, public API, or new
permission, and is omitted entirely from production reads and rendering.
Wave D Phase 4 additionally centralizes and tests that development-only gate;
an authenticated local production-runtime check confirms Salariés renders with
no Wave D surface or browser error. Production authorization remains blocked.
Wave D Phase 5 retains responsive as-built evidence at 1440/1024/768/390 and
restores keyboard focus to the originating overview action when its drawer or
edit dialog closes. Local QA reports no horizontal overflow or browser error.

Wave E adds an employee-only real-data personnel-register slice at
`/equipe/registre-personnel` in local development. Existing employee dossiers
remain unregistered candidates until an OWNER explicitly verifies the required
and conditional facts. First inscription receives an atomic, irreversible
establishment sequence; immutable initial facts and append-only reasoned
corrections are stored separately from the mutable Salariés dossier. Reads use
50-entry snapshot-bound cursor pages and distinct OWNER-only register read/
export permissions. Successful reads and PDF responses emit minimized audit
events. PDF is generated transiently through the Backoffice server with
no-store headers and no stored or public URL. The page, mutations, and export
endpoint fail closed outside development. Phase 4 keeps pagination cursors out
of URLs, reconstructs original idempotent results, rejects no-op corrections,
deduplicates minimized read/export audits, and embeds local Unicode PDF fonts;
unsupported scripts fail explicitly without a file or successful-export audit.
No additional schema or migration was introduced. This is not a compliance claim;
intern/service-civic models, automated retention/legal hold/purge, legal/DPO/
privacy/security/operations approval, and production enablement remain blocked.
Wave E Phase 5 synchronizes the local as-built page at 1440/1024/768/390 with
zero horizontal overflow or browser errors and restores keyboard focus to the
originating register action after its review dialog closes. No register entry
was created for visual evidence.

Wave F Phase 0 and WF0-01 through WF0-12 are approved. Repository discovery confirms
that signed personnel PDFs already use private storage, quarantine, malware
scanning, OWNER authorization, and server-mediated delivery, but no OCR/AI
service or provider exists. The proposed first slice is reviewed suggestions
from one verified base contract for one existing employee; no file is read or
transmitted and no suggestion is saved automatically. The separately authorized
design prompt produced four DRAFT responsive references. Phase 1 adds a
development-only typed-fixture review prototype on the signed base contract;
it uses fictional values, keeps choices in browser memory, disables apply, and
does not read/transmit a PDF or call OCR/AI. It is absent outside development.
Phase 2 now defines, but does not implement, a provider-neutral server boundary,
strict transient suggestion result, exact document/employee version checks,
future OWNER-only extraction permission, minimized audit, synchronous limits,
and synthetic-first provider evaluation. The first proposed apply fields are
position and weekly minutes; CDI/CDD remains review-only until its coupled date
and controlled-reason rules are supported. Remote personnel-file processing
and Phase 3 remain approval-gated.

### Planned empty surfaces

- menu content and internal resources;
- technical sheets;
- planning, time tracking, daily tasks, and personnel formalities;
- marketing content creation;
- modules and subscription.

These routes deliberately use the shared planned-page state. Their presence in
navigation does not approve a schema, contract, provider, mutation, or delivery
roadmap.

## Active and partial work

- Public booking Phase 0/1 is implemented but still requires release-level
  reconciliation and validation. Its feature `STATUS.md` is authoritative for
  remaining work.
- Reputation still requires completion of review synchronization, controlled
  reply publication/reconciliation, AI-assisted analysis/drafting, and broader
  connector coverage.
- Production publisher/legal configuration and external provider approvals
  remain operational dependencies.

## Planned

- Internal platform administration under the reserved `apps/platform-admin`
  name after an approved specification exists.
- Additional restaurant modules only after product scope and data ownership are
  explicitly defined.

## Documentation status

The database reset plan has been replaced by current architecture documents.
Historical implementation plans and pre-reset audits are preserved by Git
history, not the active documentation tree.

The UI export catalog is maintained only in `packages/ui/src/index.ts`.
