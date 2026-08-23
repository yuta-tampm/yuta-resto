# Préparer un projet de contrat CDI — Product Scope

Status: Phase 5 internal decision matrix drafted; external review blocked

Visibility: Engineering

## User goal

Allow an OWNER to understand which existing employee facts could be reused and
which contract-specific facts would still be required before preparing a CDI
draft.

## Current approved capabilities

- Display one clearly labelled fictional employee.
- Separate reusable Salariés facts from Formalités-owned missing inputs.
- Let the OWNER move through three local fictional steps, edit three
  illustrative values, create an in-memory checkpoint, acknowledge review, and
  see demo-only readiness.
- Keep document generation disabled.
- Restrict the route and navigation item with existing OWNER personnel access.

## Current boundaries

This is an authenticated cloud Backoffice page for the active establishment.
Phase 2 contains no tenant-owned personnel read and no transport or persistence.
The shell session is real; every business fact in the prototype is fictional.

## Approved change boundary

Only the route, a route-local model/component, the navigation visibility rule,
tests, and current documentation are in scope. Database, API, contracts, schema,
migrations, providers, files, generation, signature, and production are excluded.

## Out of scope

CDD or amendments, real dossier integration, durable editing/save/resume, templates,
PDF generation, legal validation, DPAE/DSN, signature, sending, audit, retention,
AI/OCR, and production operation.

## Approved F5-07 lifecycle

- An OWNER explicitly saves one active CDI draft per employee in the active
  establishment and may return to edit it.
- `DRAFT` is editable and creates no PDF.
- `GENERATED` is an immutable version created only after OWNER confirmation.
- Editing after generation creates a new draft; generating its replacement
  changes the older generated version to `SUPERSEDED` instead of overwriting it.
- `ABANDONED` requires a reason and is retained; there is no hard delete.
- `INCOMPLETE`, `READY`, and `ATTENTION_REQUIRED` are derived readiness results,
  not saved lifecycle states.
- A signed contract remains owned by Documents and is not a Formalités status.
- Draft input values may eventually be stored in Neon; generated binary files
  must remain outside Neon in the separately approved private EU file store.

This approval defines product behavior only. It does not authorize persistence,
schema, API, file generation, or real employee data.

## Approved F5-08 legal and operational boundary

- YUTA does not author legal clauses. Formalités may populate only versioned
  templates reviewed by a qualified French employment-law professional, with
  recorded applicability and effective dates.
- YUTA may identify missing or inconsistent data and prepare a draft. It may not
  certify legal validity or replace professional advice.
- OWNER must review and explicitly confirm before a draft document is generated.
- Future generated PDF files belong in approved private EU storage outside
  Neon. Neon may contain trusted tenant-scoped draft, state, version, and file
  reference metadata only.
- Electronic signature will not be built by YUTA in this phase. A future
  provider requires separate legal, privacy, security, and operational approval.
  Signed artifacts remain owned by Documents.
- Future audit records actor, action, time, state transition, and version without
  copying sensitive form values or document content into logs.
- Retention, deletion, legal hold, rights handling, and backup propagation are
  not invented by YUTA; legal/DPO/privacy/security/operations must approve the
  per-class rules before production.
- AI may assist extraction or completeness checking only behind the YUTA adapter
  and OWNER confirmation. It may not decide legality, update the employee dossier,
  sign, issue, or automatically send a contract.

This approval updates documentation only. It authorizes no schema, API,
persistence, file storage, signature integration, AI request, or real employee
data.

## Proposed capabilities requiring approval

Passing an employee ID from the full dossier and implementing F5-07/F5-08 require
explicit integrated-phase approval. Every external legal/DPO/privacy/security/
operations and provider gate remains open in the production-readiness register.

## Phase 2 — interactive offline fictional prototype

Status: `APPROVED AND IMPLEMENTED OFFLINE`

### Goal

Validate whether an OWNER understands the CDI preparation steps, missing-field
feedback, local checkpoint, and review confirmation before YUTA designs any real
data model or persistence.

### Implemented capabilities

- Keep the same clearly fictional employee and reusable Salariés examples.
- Allow local editing of only the three fields already visible in Phase 1:
  fictional address, fictional contractual remuneration, and fictional
  probation-period decision.
- Navigate between “Données réutilisables”, “Informations à compléter”, and
  “Vérification” without changing the route or URL.
- Derive demo-only readiness from the local fictional values.
- Simulate an explicit draft checkpoint in React memory and show when the local
  values differ from that checkpoint.
- Let the OWNER acknowledge the fictional review step; keep document generation
  disabled and explain why.
- Reset to the canonical fictional fixture on reload, route exit, or explicit
  “Réinitialiser la démonstration”.

### Phase 2 boundaries

- No real employee or tenant-owned personnel fact is read.
- No `employeeId`, document ID, organization ID, establishment ID, or draft ID is
  added to the fixture, URL, form, or browser state.
- No local or remote persistence: no storage APIs, cookies, server actions, API,
  database, schema, migration, file, event, or audit write.
- No real template, legal field dictionary, legal validation, PDF, preview,
  download, signature, sending, AI/OCR, or provider integration.
- No `GENERATED`, `SUPERSEDED`, or durable `ABANDONED` transition is simulated.
- `READY` means only that the fictional demonstration fields are populated; it
  must never be presented as legal or production readiness.
- Existing OWNER authorization and Backoffice navigation remain unchanged.

### Non-goals

This phase does not test returning on another device/session, concurrency,
versioning, idempotency, recovery after server failure, real save/resume,
employee-dossier entry, or a legally complete CDI form.

## Relationships

Salariés remains the future source of reusable employee/employment facts.
Formalités will own contract-specific inputs, validation, and eventual document
workflow. No runtime relationship is implemented in Phase 2.

## Phase 3 — trusted read-only dossier handoff

Status: `APPROVED AND IMPLEMENTED — DEVELOPMENT READ-ONLY`

### Goal

Validate that an OWNER can start from one full employee dossier and understand
which already-authorized Salariés facts would be reused by Formalités, without
collecting or persisting any contract-specific value.

### Implemented capabilities

- Add `Préparer un projet CDI` only to the full dossier page, not the list quick
  view and not the multi-restaurant context.
- Open `/equipe/formalites-personnel/[employeeId]` behind an off-by-default
  development feature gate.
- Repeat authenticated OWNER, organization, active-establishment, UUID, and
  employee ownership checks on the destination server route.
- Reuse the existing tenant-scoped employee repository and display only name,
  position, qualification, current contract type, entry date, and weekly
  duration.
- Provide an explicit return to the same employee dossier.
- Keep every preparation, edit, checkpoint, review, save, generation, and file
  action unavailable on the integrated route.

### Boundaries

- Local QA uses only existing fictional LUNA employee records; it creates or
  edits no seed or operational row.
- The generic Phase 2 fictional demo remains available and unchanged.
- Production remains fail-closed for the integrated entry and route.
- An invalid UUID, missing employee, or employee outside the trusted tenant
  scope returns not found without disclosing metadata.
- MANAGER and STAFF remain forbidden; no new permission is introduced.
- No decision is made about which current/upcoming/CDD/CDI employee is eligible
  for a future draft. Phase 3 shows current facts only and makes no eligibility
  claim.
- No real contract input, persistence, lifecycle transition, schema, migration,
  API, audit event, document, template, PDF, signature, AI, or provider exists.

### Deferred decision

Before an interactive integrated phase, product and qualified legal review must
define eligible employee situations and the complete reviewed field dictionary.
The six read-only facts in Phase 3 are not a complete CDI model.

## Phase 4 product slice

Status: `APPROVED AND IMPLEMENTED — DEVELOPMENT LOCAL-ONLY`

Phase 4 lets an OWNER use the existing three-step demonstration directly
from the trusted Phase 3 employee route. The six employee facts remain
read-only. Only employee address, contractual remuneration, and probation-period
choice become editable demonstration values.

The values are local to the current browser render, begin empty or undecided,
and disappear when the page reloads or is left. A local checkpoint may support
the walkthrough but is not a saved CDI draft. The existing demonstration-only
readiness rules may be reused without implying legal completeness, CDI
eligibility, or a reviewed field dictionary.

The generic `/equipe/formalites-personnel` demo remains available and unchanged.
The connected action remains restricted to full dossier, OWNER, development,
trusted tenant scope, and fictional LUNA QA data. Generation stays disabled.

Phase 4 expressly excludes F5-07 persistence/lifecycle, new fields or validation
rules, dossier updates, browser persistence, navigation-loss protection, schema,
migration, API/server action, audit writes, templates, files/PDF, signature,
AI/providers, real personnel-data QA, and production.

## Phase 5 product decision package

Status: `APPROVED FOR DOCUMENTATION AND DRAFTED — EXTERNAL REVIEW BLOCKED`

Phase 5 records the questions and candidate answers that must be settled before
a real draft can be saved:

1. Which employee situations are eligible to start a CDI draft?
2. What is the complete, reviewed field dictionary for the first supported CDI
   template?
3. Which facts come read-only from Salariés, which are entered in Formalités,
   and which are derived?
4. Which fields are required, optional, or conditional, and what conditions
   connect them?
5. Which validations are factual/completeness checks rather than legal advice?
6. Which template version and qualified reviewer authorize those decisions?
7. Which data classes require retention, audit, access, or minimization decisions
   before persistence?

The deliverable is a decision matrix with named evidence owners and unresolved
items. It is not a database or API design. An unresolved legal/template rule
stays explicitly blocked and may not be guessed by product or engineering.

The proposed first slice is limited to an upcoming, full-time employee whose
dossier already indicates an indefinite term. This is a product proposal only;
it is not runtime behavior or legal approval. Upcoming part-time CDI, CDD-to-CDI
conversion, active CDI remediation, and unsupported contract categories remain
blocked or excluded as detailed in `DATA_AND_INTERACTION_SPEC.md`.
