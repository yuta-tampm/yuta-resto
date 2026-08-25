# Backoffice Équipe Formalités du personnel

Status: Phase 5 internal decision matrix drafted; Phase 4 remains current runtime

Visibility: Engineering

Owner: YUTA product and engineering

Protocol revision: 4

Application: `apps/backoffice`

Target type: `PAGE`

Route / entry point: `/equipe/formalites-personnel`

Runtime family: `CLOUD`

Page classification: `NEW_PAGE`

Implementation class: `integrated`

Package status: `implemented`

Scope status: `APPROVED`

Reference status: `NONE`

Inventory status: `COMPLETE`

Baseline status: `NOT_APPLICABLE`

Design prompt status: `READY`

Shared context status: `RESOLVED`

No-image reference reason: `The 2026-08-22 approvals authorize a bounded fictional prototype using existing Backoffice patterns; no visual redesign or generated reference is required.`

## Current implementation

The former `PlannedBackofficePage` placeholder is replaced by an OWNER-only
server page containing a route-local interactive client prototype. It renders
one typed fictional CDI-readiness fixture, three local steps, three illustrative
inputs, demo-only readiness, an in-memory checkpoint, review acknowledgement,
and reset. It performs no employee repository read, receives no employee
identifier, persists nothing, and keeps document generation disabled.

The approved Phase 3 development slice adds a gated full-dossier action and
`/equipe/formalites-personnel/[employeeId]`. That server route repeats UUID,
session, active-establishment, OWNER permission, and composite employee
ownership checks, then maps only six allowlisted Salariés facts into a read-only
presentation. It has no inputs, readiness simulation, mutation, persistence, or
generation. The gate requires explicit development opt-in and always fails
closed in production.

## Authority

Read root and `apps/backoffice/AGENTS.md`, `docs/CURRENT_STATE.md`,
`docs/ui/YUTA_FRONTEND_RULES.md`, `docs/ui/BACKOFFICE_FRONTEND_RULES.md`, the
UI workflow, then this package and current code/tests.

## Documents

- `PRODUCT_SCOPE.md`
- `UI_SPEC.md`
- `DATA_AND_INTERACTION_SPEC.md`
- `DESIGN_HANDOFF.md`
- `IMPLEMENTATION_PLAN.md`
- `ACCEPTANCE_CHECKLIST.md`
- `LEGAL_REVIEW_BRIEF.md` — self-contained French handoff prepared for a
  qualified employment-law/template reviewer; not sent or approved

## References

No page image is used. The current Backoffice shell, `BackofficePage`, and
`@yuta/ui` cards, alerts, badges, and buttons define the visual context.

## Shared UI context

Reuse the authenticated Backoffice shell, section navigation, account/session
area, typography, semantic tokens, and responsive content width. This page may
compose route-local CDI-readiness content only. It must not change the shell or
invent a formality center, document library, provider selector, or legal status.

## Protected invariants

- Authentication, active establishment, and OWNER personnel-read permission are
  resolved on the server.
- All content inside the prototype is fictional and visibly labelled.
- The generic Phase 2 demo reads no dossier. The gated Phase 3 route reads one
  employee only through trusted server scope and an allowlisted projection.
- No contract file, API, provider, or browser-supplied tenant scope is read.
- No save, generation, signature, sending, audit, or production behavior exists.
- Persisting contract-specific values or treating the three demonstration fields
  as a real CDI model remains deferred.

## Change impact

```text
Files expected to modify: Formalités route, Backoffice navigation permission filter, current docs
Files expected to create: route-local prototype component/model, tests, canonical page pack
Packages affected: apps/backoffice, docs
Cross-application impact: NO
Database change: NO
API or contract change: NO
Permission/auth change: NO
Runtime/device change: NO
```

## Design approval

On 2026-08-22 the product owner approved F5-02 through F5-06 and Phase 1 as a
read-only prototype using entirely fictional data. F5-02 limits access to
OWNER; F5-03 keeps the future flow to one employee in the active establishment;
F5-04 selects the full dossier as the future entry point; F5-05 forbids a
generated file in Phase 1; F5-06 assigns reusable employee facts to Salariés
and document-specific inputs/validation to Formalités.

On 2026-08-22 the product owner also approved F5-07 as a product lifecycle
decision. A formality starts as a saved `DRAFT`, may create an immutable
`GENERATED` draft-document version after explicit OWNER confirmation, and an
older generated version becomes `SUPERSEDED` only when a replacement version is
generated. An OWNER may mark unfinished work `ABANDONED` with a reason; there is
no hard delete. Completeness (`INCOMPLETE`, `READY`, or `ATTENTION_REQUIRED`) is
derived rather than stored as a lifecycle state. A generated version is never
edited in place: continuing work creates a new draft. Signed-contract status
belongs to Documents, not Formalités.

On 2026-08-22 the product owner approved F5-08 as a product boundary, not as
legal or production sign-off. YUTA will populate only versioned CDI/CDD
templates reviewed by a qualified French employment-law professional, identify
missing information, and require explicit OWNER review. YUTA will not author
legal clauses, certify legality, sign, issue, or automatically send a contract.
Generated PDF files will eventually use approved private EU storage outside
Neon; Neon may hold only scoped draft/version metadata. Electronic signature
will use a separately approved external provider, and signed artifacts remain
owned by Documents. Audit will record actor, action, time, and version without
copying sensitive field values into logs. Retention/deletion remains subject to
legal/DPO approval. AI may assist extraction or completeness checks but may not
make legal decisions, update an employee dossier, generate final approval, sign,
or issue a contract automatically.

## Stop conditions

Stop before using an employee identifier or real dossier fact, persisting an
input or result, creating a PDF, adding schema/API/contracts, calling a provider,
or claiming legal validity. F5-07 defines the intended lifecycle but does not
authorize its implementation. F5-08 defines the legal/operational product
boundary but closes no external production gate. Those steps still require
explicit implementation approval and the applicable legal/DPO/privacy/security/
operations evidence in `docs/operations/PRODUCTION_READINESS.md`.

## Phase 2 as built

Phase status: `APPROVED AND IMPLEMENTED OFFLINE`

On 2026-08-22 the product owner approved the interactive offline prototype in
the recorded scope. The route-local client component and pure state/readiness
functions now let an OWNER:

- move through source facts, fictional contract inputs, and review steps;
- edit the three existing illustrative fields: employee address, contractual
  remuneration, and probation-period decision;
- see locally derived `INCOMPLETE`, `ATTENTION_REQUIRED`, and demo-only `READY`
  feedback;
- create an explicitly labelled in-memory checkpoint and continue editing; and
- confirm that the fictional review step was seen while generation remains
  unavailable.

All values reset on reload or navigation. Phase 2 must not use `localStorage`,
`sessionStorage`, cookies, URL state, server actions, API routes, database calls,
employee/document identifiers, real templates, PDF generation, files, AI, or
real personnel data. “Save” and “ready” copy must always say that they apply only
to the current demonstration and are not persisted or legally validated.

Actual Phase 2 impact:

```text
Files modified: route-local Formalités prototype component/model/tests and this page pack
Files created: none
Packages affected: apps/backoffice, docs
Cross-application impact: NO
Database change: NO
API or contract change: NO
Permission/auth change: NO
Runtime/device change: NO
```

Phase 2 does not implement F5-07/F5-08 persistence, generation, lifecycle, or
production behavior. Those remain separately approval-gated.

## Final delivery and as-built status

Final implementation locations/files changed: `apps/backoffice/src/app/(authenticated)/equipe/formalites-personnel`, `apps/backoffice/src/components/backoffice/backoffice-navigation.ts`, and their tests.

Verification commands and results: page-pack, documentation, architecture,
Backoffice typecheck/test/build, recursive workspace typecheck, and formatting
checks passed on 2026-08-22.

Functional/regression QA result: 49 Backoffice test files passed and one was
skipped; 162 tests passed. The production build, recursive workspace typecheck,
page-pack, documentation, architecture, and formatting checks passed.

Visual/browser/device evidence: authenticated OWNER Phase 2 QA passed at
1440x900, 1024x800, 768x800, and 390x844. Validation focused the first missing
field; checkpoint, dirty, review, demo-only readiness, explicit reset, and
reload-reset behaviors passed; generation remained disabled. No horizontal
overflow or browser warning/error was recorded, and mobile main content remained
scrollable. An unauthenticated fresh browser was also correctly redirected to
`/connexion`.

Intentional deviations: The approved future entry from a full employee dossier is documented but not connected in Phase 1 because the approved prototype must not read or receive real employee data.

Deferred proposals and risks: F5-07/F5-08 implementation; qualified template and employment-law review; DPO/privacy, retention, security, storage, audit, signature-provider, AI-provider, and operations approvals.

Production tracking authority: `docs/operations/PRODUCTION_READINESS.md`,
especially `HR-LEGAL-01`, `HR-TEMPLATE-01`, `HR-FORMALITY-01`, `HR-RET-01`,
`HR-STORE-01`, `HR-SIGN-01`, and `HR-AUDIT-01`. External personnel AI also
requires every `AI_PERSONNEL` gate.

As-built documentation status: `COMPLETE`

## Phase 3 as built

Phase status: `APPROVED AND IMPLEMENTED — DEVELOPMENT READ-ONLY`

The implemented slice is a development-only, read-only employee-dossier
handoff. It adds an OWNER-only action on the full dossier page and a scoped
route at `/equipe/formalites-personnel/[employeeId]`. The server would validate
the route identifier, resolve the authenticated organization and active
establishment, repeat `personnel.employee.read`, and load the employee through
the existing composite-scoped repository.

The integrated prototype displays only the six facts already represented
in Phase 2: employee name, position, qualification, current contract type,
entry date, and weekly duration. It would not display the three editable demo
inputs, simulate readiness, save a draft, generate a file, or imply CDI
eligibility. The existing `/equipe/formalites-personnel` offline fictional demo
remained unchanged in Phase 3.

Phase 3 QA uses only existing fictional LUNA development employees. The
integrated entry and route are behind an off-by-default development feature
gate; no production rollout or real employee-data QA is authorized. No schema,
migration, API, transport contract, mutation, audit write, browser storage,
file, PDF, template, signature, AI/provider call, or new permission is proposed.

Production enablement and every interactive or persistent continuation remain
separately approval-gated.

Phase 3 verification on 2026-08-22 used the existing fictional LUNA employee
`Gisèle QA-Romeo`. The employee list quick view exposed no Formalités action;
the full dossier exposed the gated action and opened the exact scoped route.
The connected page displayed the six approved facts, no contract input,
checkbox, or radio, and a disabled preparation action. Invalid UUID returned the
shared 404 without employee content. Authenticated OWNER QA passed at 1440x900,
1024x800, 768x800, and 390x844 with no horizontal overflow or console warning/
error; mobile main content remained scrollable.

Backoffice typecheck and production build passed. The eight focused Formalités
tests passed. The full Backoffice suite passed 162 tests while three existing
PDF/corpus tests hit their five-second parallel timeout; those three files then
passed all nine tests sequentially with a wider timeout. Repository-wide format
check was blocked at that time only by unrelated generated POS files under
`apps/yuta-pos/.tmp/next-stale-phase3-20260822-2321`; every Phase 3 code and
documentation file passed targeted Prettier check. The repository-wide format
check later passed during Phase 4 verification.

## Phase 4 as built

Phase status: `APPROVED AND IMPLEMENTED — DEVELOPMENT LOCAL-ONLY`

The implemented slice is a development-only connected interaction using only
existing fictional LUNA employees. It keeps the trusted Phase 3 dossier read,
then adds the three already-approved illustrative Phase 2 inputs to the scoped
employee route:

- employee address;
- contractual remuneration; and
- probation-period choice.

These values start empty or undecided and are never copied from the employee
dossier. The OWNER may move through the existing three steps, edit the values,
see the existing demonstration-only completeness result, acknowledge the review,
and create an in-memory checkpoint. All edits are held only in React memory and
are lost on reload, navigation, or closing the page. The UI must state this
before the first input and must not call the checkpoint a saved draft.

Phase 4 does not implement the F5-07 lifecycle. It creates no `DRAFT`, revision,
conflict, audit event, or resume behavior. Generation remains disabled. The
existing development-only gate, OWNER authorization, trusted tenant scope,
allowlisted six-field dossier projection, production fail-closed behavior, and
generic Phase 2 fictional demo remain unchanged.

No schema, migration, transport contract, API route, server action, database or
browser persistence, file, template, PDF, signature, AI/provider call, legal
eligibility rule, real personnel-data QA, or production enablement is included.

The product owner approved this exact scope on 2026-08-23. The connected route
now reuses the Phase 2 pure local state and interaction UI with the Phase 3
allowlisted employee projection; the generic Phase 2 route remains unchanged.

Phase 4 browser QA used the existing fictional LUNA employee `Gisèle QA-Romeo`.
The three inputs started empty or undecided; missing required values focused the
first invalid input. A local checkpoint reported that it would be lost on
reload, review moved from attention-required to demonstration-only ready after
the fictional acknowledgement, and generation remained disabled. Reloading
restored empty values and removed the checkpoint. Responsive QA passed at
1440x900, 1024x800, 768x800, and 390x844 with no document or main-content
horizontal overflow, and the browser console contained no warning or error.

All 165 Backoffice tests, the Backoffice production build, recursive workspace
typecheck, documentation, page-pack, architecture, focused Formalités tests,
repository-wide formatting, and `git diff --check` passed.

## Phase 5 decision package

Phase status: `APPROVED FOR DOCUMENTATION — INTERNAL DRAFT COMPLETE — EXTERNAL REVIEW BLOCKED`

The next smallest safe step was to define the real CDI input and validation
boundary before designing storage. Phase 5 now contains an internal decision
matrix covering:

- which employee situations may start a CDI draft;
- each reusable Salariés fact and each Formalités-owned input;
- required, optional, and conditional fields;
- permitted formats/options and cross-field conditions;
- the approved template version and qualified reviewer evidence;
- which checks mean missing information, attention required, or ready for OWNER
  review; and
- data sensitivity, audit minimization, and the legal/DPO owner for retention.

The three Phase 4 demonstration fields are examples only. They must not be
promoted into a schema or transport contract unless the reviewed matrix approves
their exact meaning and rules. Phase 5 may use synthetic examples to review the
matrix but reads, sends, or stores no real employee data.

Phase 5 changes documentation only. It adds no runtime UI, field, validation,
schema, migration, API, server action, database write, audit event, file,
template binary, PDF, signature, AI/provider call, production enablement, or
real personnel-data QA. Phase 4 remains the current implementation.

The proposed first slice is an upcoming full-time CDI only. Part-time CDI,
CDD-to-CDI conversion, active-CDI remediation, amendments, former employees, and
unsupported contract categories remain blocked or excluded. The detailed matrix
shows which existing Salariés facts can be candidates for reuse and which
employer, remuneration, work-time, collective, protection, and template facts
are still missing.

Implementation stops after this internal decision package. Product approval of
the candidate slice, qualified French employment-law/template review, and the
applicable legal/DPO/privacy/security evidence remain required. Persistent draft
design is a later, separate approval gate.

`LEGAL_REVIEW_BRIEF.md` is the self-contained French handoff prepared for that
qualified review. It contains no real employee data or contract, asks for
field-by-field, applicability, workflow, template-version, and review-trigger
decisions, and provides a reviewer decision sheet. It has not been sent and
does not constitute legal or template approval.

Phase 5 verification passed documentation consistency, page-pack validation,
architecture boundaries, recursive workspace typecheck, repository-wide
formatting, and `git diff --check` on 2026-08-23.

## F08 Phase 0 reconciliation

Status: `DOCUMENTATION COMPLETE — PRODUCT DECISIONS PROPOSED`.

The downloaded Salariés F08 flow was reconciled on 2026-08-25. Its description
of this route as a planned page is superseded by the implemented Phase 2–4
prototypes. The current employee-scoped development route already performs a
trusted six-field read and offers three illustrative local inputs, checkpoint,
review acknowledgement, and demo readiness.

This is not document generation. No Formalités row, durable `DRAFT`, approved
template, preview, PDF, private-storage object, signature request, delivery,
generated-result link, or Documents artifact is created. The current generation
button remains disabled and production remains fail-closed.

F08-01 through F08-10 are proposed in the Salariés page pack and mirrored here.
They retain the CDI-only candidate, OWNER/full-dossier/single-establishment
entry, Salariés-versus-Formalités ownership, F5-07 lifecycle intent, signed-
artifact ownership in Documents, and all external gates. No runtime continuation
is recommended until qualified legal/template review is received.
