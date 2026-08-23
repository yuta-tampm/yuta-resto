# YUTA Current State

Status: Current

Visibility: Engineering

Owner: YUTA engineering

Last updated: 2026-08-23

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
- Local POS catalog items with required variants now collect the exact options
  in a focused pre-add dialog. Site-agent validates and snapshots the item and
  option labels in one add transaction; cancel creates no incomplete row,
  plain items retain one-tap addition, and allergy capture stays separate.
- Local Management reports use an admin/manager-protected site-agent read model
  over POS orders and payments. It captures one 05:00 `Europe/Paris` service
  window, aggregates paid payment principal and order counts server-side, and
  returns a bounded activity page with direct POS order links. The capability
  completed production-build Phase 5 QA at 1366×768, 1024×768, 768×1024, and
  390×844 with no horizontal overflow, 44px report actions, accessible
  pagination focus recovery, and verified empty/error/retry states. It
  has no schema/migration, cloud sync, export, fiscal/accounting claim, polling,
  cache, or mutation. Site-agent startup now requires and verifies
  `TZ=Europe/Paris`; Luna host timezone configuration remains a deployment
  preflight rather than a repository-side machine change.
- The Kitchen queue uses a bounded site-agent read model that applies the local
  05:00 service day, production screen/status, queue projection, ordering, and
  ticket limit before returning grouped tickets and counts. It avoids the former
  per-order detail fan-out and full-catalog read on every refresh. A local,
  notification-only SSE stream now signals successful relevant mutations;
  Kitchen reloads the authoritative read model and retains a 60-second polling
  fallback without moving order data or persistence into the browser. A
  browser-authorized local chime can announce non-replayed new Kitchen batches
  for the affected production screen; state-only events remain silent.
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

`/equipe/formalites-personnel` now contains a bounded Phase 2 interactive
offline prototype for understanding CDI draft readiness. The authenticated
server route reuses the existing OWNER-only personnel guard, but the task
content uses only a typed, route-local fictional fixture: it receives no
employee identifier and performs no personnel or document read. The local
client flow exposes three steps, three illustrative inputs, demo-only readiness,
an in-memory checkpoint, review acknowledgement, and reset. Reloading or leaving
the route discards all changes. There is no browser storage, URL state, server
action, API, database write, audit, provider, file, or generated artifact. The
UI permanently identifies this boundary and keeps generation disabled. Linking
a real employee dossier, durably saving a draft, legal validation, PDF
generation, signature, audit, retention, and production operation remain
deferred.

Phase 3 adds a separate development-only read path from the full employee
dossier to `/equipe/formalites-personnel/[employeeId]`. It is hidden unless
`BACKOFFICE_PERSONNEL_FORMALITES_READ_PROTOTYPE_ENABLED=true` and remains
disabled outside development even if configured. The destination repeats UUID,
authenticated OWNER, active-establishment, and composite employee-ownership
checks, then projects only name, position, qualification, current contract type,
entry date, and weekly duration. Quick view remains unchanged. The connected
surface has no contract inputs, simulated readiness, mutation, audit write,
persistence, template, file, PDF, AI/provider call, or production enablement.
Local QA is limited to existing fictional LUNA employees.

A Phase 4 development-only connected interaction is approved and implemented.
It combines the trusted Phase 3 read with only the three existing Phase 2
illustrative inputs on the connected development route. Edits, checkpoint, and
demo readiness remain React-memory-only and disappear on reload or
navigation; generation stays disabled. It adds no F5-07 lifecycle,
save/resume, employee update, schema/API, audit write, browser persistence,
file/PDF/template, signature, AI/provider call, real personnel-data QA, or
production enablement.

Phase 5 documentation work was approved on 2026-08-23 and now contains an
internal applicability and candidate CDI field matrix. It proposes an upcoming
full-time CDI as the smallest first slice, distinguishes current Salariés facts
from missing Formalités/employer/template authorities, and explicitly blocks
part-time, CDD-to-CDI conversion, active-CDI remediation, and unsupported
contract categories. Official French information-duty, part-time, and trial-
period sources are recorded, but the matrix is not a legally reviewed template.
Qualified legal/template and DPO-owned decisions remain blocked. Phase 5 adds no
runtime, schema/API, persistence, file/PDF, signature, AI/provider, real
personnel data, or production change; Phase 4 remains the current implementation.

A self-contained French Phase 5 legal-review brief is prepared under the
Formalités page pack. It contains no real employee data or contract and asks a
qualified reviewer to decide the first use case, candidate fields,
applicability, workflow confirmations, template/version evidence, and review
triggers. It has not been sent and does not close `HR-TEMPLATE-01`,
`HR-FORMALITY-01`, `HR-LEGAL-01`, `HR-RET-01`, or `HR-AUDIT-01`.

F5-07 now records the approved future CDI-draft lifecycle without implementing
it. An OWNER may eventually save and resume one active `DRAFT` per employee in
the active establishment. OWNER-confirmed generation creates an immutable
`GENERATED` version; a later generated replacement marks the older version
`SUPERSEDED` rather than overwriting it. `ABANDONED` requires a reason and is
retained. Completeness is derived as `INCOMPLETE`, `READY`, or
`ATTENTION_REQUIRED`, and signed-contract status remains owned by Documents.
F5-08 now records the approved legal and operational product boundary without
closing any external gate. YUTA may eventually populate only qualified,
versioned employment templates, flag missing information, and require explicit
OWNER review; it does not author clauses or certify legality. Generated files
remain outside Neon in separately approved private EU storage, signature remains
an external-provider boundary with signed artifacts owned by Documents, audit
must exclude sensitive values/content, and retention remains legal/DPO-owned.
AI may assist extraction or completeness checking but cannot decide legality,
update employee data, sign, issue, or send automatically. Separate implementation
approval and the production-readiness register still gate schema, APIs,
persistence, providers, generated files, real employee data, and production.

- `/equipe/salaries` now reads the establishment-owned personnel dossier table
  through an OWNER-only, server-authorized, organization-and-establishment-
  scoped repository. The former employee fixtures and simulated states are
  removed. The empty, loading, forbidden, error, search/filter, server-side
  ordering, summary, and responsive list states use the real read path. The
  list defaults to newest entry date and supports name or position ordering;
  every opaque cursor is bound to its ordering so a stale cursor fails closed.
  Desktop row selection keeps the right-side quick view and links to the
  addressable `/equipe/salaries/[employeeId]` dossier. Mobile employee cards
  open that full dossier directly. The detail route reauthorizes the current
  OWNER and active establishment, returns not found for invalid or out-of-scope
  identifiers, and reuses the existing dossier tabs, actions, and minimized
  access audit.

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

F02 Phase 1 now completes the downloaded add-employee reconciliation within
this existing development capability. The implementation remains a single OWNER-only
minimum-dossier dialog with trusted active-establishment scope, CDI/CDD
conditional validation, advisory duplicate review, idempotent retry, and atomic
creation/audit. It is not a file-first or resumable onboarding workflow. The
current signed-contract action requires an existing employee, and remuneration,
probation, apprenticeship, work-authorization documents, detailed part-time
distribution, additional contract types, Formalités, and register writes remain
outside F02. Product approved F02-01 through F02-08 on 2026-08-23. The committed
success state now returns only the safe employee ID, remains on the dialog, and
offers an explicit full-dossier link; unsaved non-empty input requires discard
confirmation before close. Authenticated responsive QA used fictional LUNA
data and created `Nina F02-Sierra` to prove the existing atomic commit and
dossier route. No field, enum, schema, migration, permission, audit event,
document, provider, AI, real employee, or production path was added.

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

Wave F local integration hardening also requires each apply attempt to match a
tenant-scoped completed extraction audit event for the same employee, request,
document/version, and complete/partial result within 15 minutes. Stale,
fabricated, mismatched, cross-establishment, or expired reviews fail before the
employee update. Client conflicts discard all transient suggestions. This adds
no result store, schema, migration, real-file access, external provider, or
production path.

Wave F Phase 5 closes only the local synthetic slice. Signed-in responsive and
accessibility QA at 1440/1024/768/390 retains as-built evidence with no
horizontal overflow or browser warning/error and no applied employee change.
The signed personnel PDF was not read or transmitted. Real-file extraction,
external AI/OCR, provider evaluation, and production remain blocked.

Wave G Phase 0 now defines a documentation-only synthetic OpenAI evaluation.
It proposes a generated fictional French-contract corpus and OpenAI Responses
direct-PDF extraction behind the existing YUTA-owned provider adapter. Local
native extraction, Tesseract/self-hosted OCR, Azure, Google, and a second
external provider are outside the current direction. The Wave F UI is reused
and no design prompt is required. No SDK, key, provider account, external
request, fixture PDF, real-file read, schema, migration, or operational data
was added. WG0-01 through WG0-14 and Phase 1 provider-eligibility contact were
approved on 2026-08-18. Phase 1 is documentation/private-submission work only;
the product owner confirmed submission through the OpenAI Sales contact form on
2026-08-18, and the provider response is pending. Phase 2, every API request,
and every real-file action remain separately approval-gated; production also
requires current OpenAI EU processing, retention, file/image eligibility, and
contractual evidence.

Wave G Phase 2 was separately authorized on 2026-08-19 and now has an offline
60-PDF corpus: 20 digital-text files, 15 clear image-only scans, 15 degraded
scans, and 10 ambiguous/adversarial files. A versioned manifest
binds each entirely fictional file to its hash, page count, expected allowlisted
answers, and required abstentions. The server-owned scorer reuses the strict
Wave F result schema and tests exact, false, missing, incorrect-high-confidence,
abstention, extra-key, hash, and page-count behavior. No restaurant UI,
operational data, provider SDK/key/request, schema, migration, or production
path was added. The ten-file starter was reviewed and expansion to 60 files was
authorized on 2026-08-19; sandbox setup and the first external request required
their own later approvals.

Wave G Phase 3 sandbox setup was separately authorized for the current
personal/pre-incorporation API organization as a disposable synthetic-only
environment. `YUTA AI Test` exists with observed geography `Global` and
data-retention control `None`; its private project ID is not stored in the
repository. On 2026-08-19, product separately approved and completed a USD 10
organization credit purchase, disabled automatic reload, set a USD 5 monthly
hard project limit with the dashboard's 100% alert, and allowed only
`gpt-5.6-luna` and `gpt-5.6-terra`. A project service account and key named
`yuta-ai-evaluation-local` now exist. The secret remains private and outside
the repository. The service account has only the custom `YUTA AI Evaluation
Caller` role, whose only enabled capability is model requests; the broader
preset `member` role was removed.

Wave G Phase 4 received separate approval for one first synthetic request on
2026-08-19. Backoffice now owns a minimal server-only OpenAI Responses adapter
implemented with native `fetch`, so no provider SDK was added. The adapter
accepts only a bounded prepared synthetic PDF, sends direct Base64 PDF input
with `store: false`, low reasoning effort, no tools or background mode, and
requires strict structured output before rebuilding the YUTA result envelope.
The smoke runner is locked to approved fixture IDs, hashes, and explicit local
run gates; it accepts no caller-supplied path. The first digital-text request
using the `gpt-5.6-luna` alias completed and matched the strict schema and all
expected answers. Product then approved three additional representative calls:
a clear scan, a degraded partial scan, and an adversarial instruction fixture.
All three passed on their first attempt with zero missing, false,
high-confidence incorrect, or abstention-violating suggestions. Their measured
latencies were 4,362 ms, 2,799 ms, and 5,791 ms; together they used 13,701 input
and 427 output tokens, with a model-price estimate of USD 0.0032526.

Product then approved the remaining 56 corpus requests. All ran once, in
sequence, with no retry. The complete `gpt-5.6-luna` baseline passed 58 of 60
documents: digital text 20/20, clear scan 14/15, degraded scan 14/15, and
adversarial 10/10. All 60 results satisfied the strict schema and there were no
timeouts, provider failures, arbitrary-key leaks, or abstention violations.
`wg2-scan-clear-03` produced one false, missing, high-confidence incorrect
suggestion; `wg2-scan-degraded-07` safely returned no suggestions but used
`partial` instead of expected `no_result`. Every recorded request remained
below eight seconds. Because WG0-09 allows no incorrect high-confidence
suggestion, this Luna/request configuration fails the provider-selection gate.
The usage dashboard still showed only the earlier first request immediately
after the run, so full billed-cost reconciliation remains pending rather than
being guessed. The key remained in ignored local configuration; no raw provider
response, provider ID, prompt, PDF content, or secret was persisted. Exact
snapshot pinning and a project rate-limit decision remain open. A future
company-owned environment must use a new organization/project/key and rerun
synthetic acceptance.

Wave G Phase 5 then received separate approval to compare `gpt-5.6-terra`
against the same frozen 60-document corpus, prompt, schema, request controls,
and no-retry policy. Terra also passed 58/60: digital text 20/20, clear scan
13/15, degraded scan 15/15, and adversarial 10/10. All 60 responses were
schema-valid, with no provider failure, timeout, arbitrary-key leak, or
abstention violation; every recorded request completed below five seconds.
`wg2-scan-clear-03` and `wg2-scan-clear-05` each contained one false, missing,
incorrect high-confidence suggestion. Visual review confirmed that both fully
fictional clear-scan PDFs and their manifest answers are legible and correct.
Terra corrected Luna's safe status-only mismatch on `wg2-scan-degraded-07`, but
introduced a second high-confidence error. Both evaluated configurations
therefore fail WG0-09 and neither is selected. At the checked model prices,
Terra is ten times Luna per input and output token. The delayed Usage dashboard
later exposed only a partial 98/120 requests, 328,421 tokens, and USD 0.40, so
final billed-cost reconciliation remains open. No further provider call is
authorized by this comparison.

Wave G Phase 5 now has a product-approved prompt v2 definition. The exact text
was approved on 2026-08-19 and is pinned by a SHA-256 fingerprint. The adapter
continues to default to prompt v1; v2 is explicitly addressable as `v2`, and no
external benchmark gate selects it. Prompt v2 adds exact
position transcription, deterministic status/count rules, unique fields,
verified weekly-minute conversion, stricter confidence/abstention wording, and
a final self-check. Fake-response tests cover exact output, French orthographic
rewrites, wrong source pages, inconsistent status/count, and duplicate fields.
The scorer now reports field-level mismatch categories without recording
candidate values or weakening exact-match acceptance. No API request, real
file, schema, migration, UI, or operational-data change was made. Separate
product approval remains required before v2 can receive a new full-corpus run
gate or make any API request.

Product then authorized one clean Luna/prompt-v2 run over all 60 locked
fictional PDFs on 2026-08-19. Every fixture ran once in sequence with no retry.
The candidate passed 46/60: digital text 14/20, clear scan 9/15, degraded scan
15/15, and adversarial 8/10. Eleven results still rewrote a position with high
confidence despite the verbatim instruction, one provider result failed v2's
local status/count or uniqueness validation, and two adversarial results safely
omitted one expected duration. The 59 accepted result envelopes had no
abstention violation. V2 therefore fails WG0-09 and is not selected. The
single-use v2 gate was removed after the run; no rerun, different model, real
file, or production use is authorized. Final billed-cost reconciliation remains
pending rather than inferred from incomplete console evidence.

Wave G Phase 5 also has a product-approved prompt v3 definition, pinned by
SHA-256, and an approved corpus v2. Corpus v2 corrects only the missing weekly
wording in `wg2-adversarial-05` and `wg2-adversarial-09`; all expected answers
and the other 58 PDF hashes remain unchanged. Product authorized one complete
Luna/v3 run over the 60 fictional PDFs on 2026-08-19. The run was sequential,
had no retry, and passed 58/60: digital text 20/20, clear scan 13/15, degraded
scan 15/15, and adversarial 10/10. `wg2-scan-clear-07` produced one incorrect
high-confidence orthographic rewrite. `wg2-scan-clear-09` completed at the
provider but its result failed local schema/consistency validation. There were
no provider failures or abstention violations. Recorded usage for 59 responses
was 227,463 input tokens and 9,586 output tokens, estimated at USD 0.0569958;
usage for the rejected result was not exposed by the adapter, so this is not a
final billed total. V3 therefore still fails WG0-09 and is not selected. The
single-use run gate was removed; prompt v1 remains the adapter default and no
further provider call is authorized.

Wave G Phase 5 now has a product-approved prompt v4 definition. The exact text
was approved on 2026-08-19. It
makes only two measured-gap changes: it defines the boundary between a position
value and surrounding label/sentence punctuation, and it requires a single
fixed-order result construction followed by a mechanical status/count check.
The first change is a hypothesis from sanitized orthographic diagnostics; the
raw v3 candidate was intentionally not retained. The exact cause of the other
locally invalid v3 result is also unavailable, so fake tests cover both duplicate
fields and status/count inconsistency without claiming which occurred. V4 is
pinned by SHA-256 and passes offline request, scoring, and rejection tests. It
has no external run gate, is not the adapter default, and has made no API call.
This prompt approval does not authorize a v4 external evaluation; a separate
run and budget approval remains required.

Product then authorized one complete Luna/v4 run over corpus v2 on 2026-08-19.
All 60 fictional PDFs ran once in sequence with no retry. V4 passed 59/60:
digital text 20/20, clear scan 14/15, degraded scan 15/15, and adversarial
10/10. The single failure, `wg2-scan-clear-15`, completed at the provider but
was rejected by YUTA's local schema/consistency boundary. The other 59 results
were schema-valid. There were zero incorrect high-confidence suggestions, zero
abstention violations, and zero provider failures. Maximum observed latency was
7,498 ms. Usage observations for 59 results total 232,065 input tokens and
9,184 output tokens, estimated at USD 0.0574338; the rejected result has no
adapter usage observation, so final billed cost remains pending. V4 meets the
current synthetic safety, accuracy, and latency thresholds. Product selected
Luna/v4/corpus-v2 as the winner of the synthetic evaluation on 2026-08-19. This
closes the synthetic comparison only: the single-use gate remains removed, the
adapter default remains v1 to prevent implicit promotion, and no further call,
real-file use, or production path is authorized. A company-owned environment,
an exact production model decision, and all EU/privacy/security/operations
gates remain separate.

Wave G Phase 6 now connects the existing development Documents review action
to the selected Luna/v4 adapter behind an explicit server-only
`openai-synthetic` mode. The service still generates its own fictional PDF;
it never opens or transmits the stored signed contract. Offline development
continues to default to the deterministic synthetic adapter. Missing keys,
unknown modes, and every non-development runtime fail closed before an OpenAI
request. Tests use a fake provider response and make no external request. This
does not approve real employee files, a production account/project/model, or
production processing.

For local comparison QA, the generated Phase 6 PDF intentionally differs from
the current fictional dossier: `Responsable de salle`, CDI, and 39 weekly hours.
This makes the review and apply-capable differences visible while keeping the
stored signed document completely outside the extraction path.

Signed-in local QA on 2026-08-20 completed the differing-fixture review and
explicit OWNER apply flow. The fictional dossier changed only `position` to
`Responsable de salle` and contractual weekly duration to 39 hours; its CDD
type remained unchanged. The employee history records the requested/completed
analysis events, the explicit two-field apply, and the resulting employment
update. Two provider-backed complete-scenario requests occurred during this QA
session; no additional call was made for apply or production verification, and
final billed reconciliation remains pending. A fresh production build served
the authenticated Salariés page on an isolated port with no analysis control,
synthetic label, browser warning, or error. Development was restored afterward.

The OpenAI Usage dashboard was reconciled on 2026-08-20 for the `YUTA AI Test`
project and the 2026-08-05 through 2026-08-20 period. It reports 303 Responses
requests and USD 0.88 total spend, matching the one smoke request, 120 initial
benchmark requests, three later 60-document runs, and two Phase 6 QA requests.
Because every request used `store: false`, Logs exposes no per-request records;
USD 0.88 is final aggregate billed evidence through Phase 6, but it cannot
allocate exact billed cost to either Phase 6 request or locally rejected result.

Wave G Phase 7 adds an optional development-only upload for a completely
fictional PDF. The OWNER must select the file, confirm that it contains no real
employee data, and click the analysis button explicitly. Uploaded PDFs are
limited to the complete scenario, PDF metadata and signature, 750 KiB, and 1–40
pages. YUTA does not save the upload or read the stored signed contract; the
temporary bytes enter the existing server adapter only after trusted permission
and target-version checks. Opening the review no longer starts a provider call.
Production remains fail-closed, and no schema, migration, SDK, route, automatic
employee update, or real-file capability is added.

Signed-in Phase 7 QA selected the repository fixture
`wg2-digital-cdd-35h.pdf` and confirmed its fictional-only status. The initial
request returned `Chef de rang`, CDD, and 35 weekly hours, but apply correctly
failed because the old apply path rebuilt the generated fixture instead of
using the validated upload result. Phase 7 therefore now keeps the validated
allowlisted result in a server-owned, tenant-scoped in-memory review store for
at most 15 minutes. Apply reads that exact result, rechecks employee/document
versions and the audit grant, compares only selected allowlisted values, makes
no provider request, and deletes the review after success, expiry, conflict, or
invalid input. No PDF bytes enter this store.

Four Phase 7 provider requests occurred across initial QA, two UI retries while
the mismatch was diagnosed, and final verification. The final request completed
in about 3.4 seconds; apply completed without provider access and persisted only
`position = Chef de rang` plus 35 weekly hours. CDD remained unchanged, and
history records the analysis and two-field apply. Usage currently reports 306
requests, 1,142,658 tokens, and USD 0.88, which includes three of the four Phase
7 requests; ingestion and billed reconciliation for the final request remain
pending.
A fresh production build then rendered the authenticated Documents view with no
analysis button, fictional upload field, or synthetic review. Development was
restored on port 3001.

Wave G Phase 8 was approved for offline implementation on 2026-08-20. The
development review can now select the current stored contract only when its
existing server-side checksum matches the single approved repository fixture
`wg2-digital-cdd-35h`. A dedicated tenant-scoped resolver checks the exact
employee, document, and current version without recording a misleading
view/download event. Only then may the local private object be opened; byte
size, PDF signature, and SHA-256 are checked again. Unknown, stale, cross-scope,
missing, or changed content fails before adapter access. The stored source uses
a fixture-specific deterministic adapter by default.

Signed-in OWNER QA selected the current version-2 stored fixture and completed
the offline analysis in about 0.6 seconds. Review showed the expected CDD,
`Chef de rang`, and 35 weekly hours with the stored-source badge and explicit
offline disclosure.

Product separately authorized exactly one provider-backed Phase 8 QA request
with that stored fictional fixture on 2026-08-20. Development required a
temporary `approved-once` process flag; an in-memory gate was consumed before
the request, and the provider wrapper rechecked the exact fixture SHA-256,
two-page shape, and complete scenario before delegating to the pinned Luna/v4
adapter. The UI disclosed the one-time OpenAI transfer before the click. The
single request completed in 4,486 ms with 1,107 input tokens, 152 output tokens,
and 1,259 total tokens. It returned the expected CDD, `Chef de rang`, and 35
weekly hours. No suggestion was selected or applied. The privileged process was
then stopped and development was restarted without the temporary flag, so the
stored path is offline again. Production, real personnel files, and any further
provider request remain blocked.
no-external-call disclosure. No suggestion was selected or applied. Browser
logs contained no warning/error, and the page plus employee drawer had no
horizontal overflow at 390 px.

A cross-feature OpenAI eligibility dossier now records four proposed YUTA use
cases: review analysis, reply drafting, marketing visual generation, and signed-
contract extraction. It proposes separate Reputation, Creative, and Personnel
Documents projects under one provider organization so retention, access, spend,
and production gates remain isolated. The product owner authorized and
confirmed the private Sales-form submission on 2026-08-18, but the repository
does not yet record an OpenAI response. This authorizes no account, key, SDK,
API request, spend, synthetic benchmark, or production processing.

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

`docs/operations/PRODUCTION_READINESS.md` is now the canonical cross-product
register for company, legal/privacy, security, infrastructure, vendor, personnel,
AI, and operational production gates. It records only status and opaque evidence
references; sensitive corporate, legal, provider, and personal records remain in
a separately controlled private vault. `DEPLOYMENT.md` continues to own release
mechanics and does not override an open readiness gate.

The UI export catalog is maintained only in `packages/ui/src/index.ts`.

F03 Phase 0 reconciles the downloaded manage-dossier flow with the existing
integrated employee editor. An authenticated OWNER can open the same combined
minimum identity/employment editor from the quick view or full dossier. The
server rederives the active organization and establishment, requires
`personnel.employee.manage`, validates the allowlisted fields, uses an expected
revision and idempotency receipt, and commits the dossier update plus field-
group audit events atomically. Successful updates keep the current dossier
surface open and refresh it with the committed summary; validation and
revision-conflict states preserve the entered values.

This is not a complete reconstructable employment history. Normal identity and
employment audit events expose the event, actor, date, and changed field names,
but not the previous and new field values. Only the separate departure flow
currently exposes bounded previous/new departure dates and a correction reason.
F03 therefore owns the current edit interaction, while F07 must separately
decide which fields need durable value-level history and how corrections are
represented. Product approved F03-01 through F03-08 and the bounded Phase 1 on
2026-08-23. The editor now asks before discarding modified unsaved values;
untouched, restored, and successfully saved values close immediately. Focused
tests and authenticated fictional LUNA QA cover cancel, continue, Escape,
discard, restored-value close, and zero-mutation recovery. Responsive captures
at 1440/1024/768/390 show no page or dialog horizontal overflow, and the browser
logged no warning/error. No server action, schema, contract, permission, audit
payload, employee value, provider, or production behavior changed.

F04 Phase 0 reconciles the downloaded current-contract flow with two existing
employee-dossier surfaces. `Relation de travail` reads current structured
employment facts stored on the employee dossier; `Documents` separately serves
the signed base-contract PDF and signed amendments through tenant-scoped,
audited server reads. F04 is therefore an existing-capability renewal, not a
new contract page, aggregate, or source of truth. Current structured support is
limited to CDI/CDD, controlled CDD reason and expected end date, work-time
category, contractual weekly minutes, entry date, position, and qualification.
It does not include remuneration, monthly duration, detailed work distribution,
probation, other employee-contract categories, or a complete legal contract
model. F03 retains edit ownership, F05 retains signed-document ownership, and
F07 retains any future reconstructable value-history decision. The connected
Formalités prototype reuses a bounded subset read-only, making one existing
helper message stale. Product approved F04-01 through F04-09 and the bounded
Phase 1 on 2026-08-23. The helper now explains that declared facts may be reused
to prepare a formality while any signed contract remains in `Documents`. A
focused component test and authenticated fictional LUNA QA verify the boundary,
the absence of the stale claim, and clean browser logs. No schema, API,
permission, audit, file operation, provider call, employee/document value, real
employee data, or production behavior changed.

F05 Phase 0 reconciles the downloaded manage-documents flow with the existing
Documents Wave A/B capability. The current development surface supports exactly
one signed base employment-contract PDF and distinct signed amendment PDFs. It
uses OWNER-only trusted organization + establishment + employee scope, PDF up
to 10 MiB, quarantine and scanning before metadata commit, immutable versions,
revision/idempotency guards, minimized audit, and server-mediated no-store
delivery without browser-visible storage authority. Base replacement advances
the one base slot; amendment replacement corrects only the selected amendment's
scan. The development-only `À traiter` overview currently flags every active or
upcoming employee without a base PDF; F05 proposes retaining that only as
operational missing evidence, not dossier or legal completeness. No amendment
or unsupported identity, work-permit, RIB, or generic category is universally
required. Validity/expiry, metadata edit, deletion/archive/legal hold/purge,
self-service, and signature are absent. Wave F/G remains a separately gated
base-contract-only review path with no automatic employee update. Product
approved F05-01 through F05-10 and the bounded read-only regression on
2026-08-24. Existing fictional records proved one available version-2 base
contract, one missing-base state, empty amendments, safe scoped route link
shapes, non-completeness copy, clean browser logs, and no 390 px overflow.
Existing as-built evidence remains the populated-amendment proof; no mutation
was created for QA. No PDF view/download was invoked because it intentionally
writes audit evidence. Phase 1 changed no runtime, employee, document, audit,
file, storage, or provider state. Production remains fail-closed pending EU
storage/scanner, retention, rights, deletion, backup/restore, incident,
legal/privacy, security, and operations approval.

F06 Phase 0 reconciles the downloaded resolve-dossier-alerts flow with the
existing development-only Wave D `À traiter` overview. This is an existing-
capability renewal, not a new alert page or persisted task system. Repository
reality supports exactly three derived current conditions: an incomplete
minimum employee dossier, a missing signed base contract for an active or
upcoming employee, and a departure from the establishment business date
through the next five calendar days. The first two are corrections; the last
is an upcoming event to review, not an error. Resolution remains source-driven:
the existing F03 editor, F05 base-contract add flow, or departure review is
opened only after fresh trusted-scope and permission checks, and an item becomes
absent only when its underlying condition changes. There is no dismiss,
acknowledge, assignment, comment, reminder, notification, or cosmetic resolved
flag. CDD expected-end, probation, document expiry, amendment, Formalités,
register, Planning, Pointage, and payroll alerts remain unsupported. A document
metadata failure produces a partial state and no false missing-contract item.
The overview remains OWNER-only, organization + establishment scoped, bounded
to independent five-item cursor pages, audited once per overview read, and
fail-closed outside development. F06-01 through F06-10 and a read-only
fictional regression are awaiting product approval. Phase 0 changed
documentation only.
