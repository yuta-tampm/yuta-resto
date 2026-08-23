# Préparer un projet de contrat CDI — Implementation Plan

Status: Phase 5 internal decision matrix drafted; external review blocked

Visibility: Engineering

## Phase 0 — Complete

Repository analysis confirmed a placeholder route with no Formalités domain,
data, action, contract, permission, persistence, provider, or test. The target
is `NEW_PAGE`; the current Backoffice shell is reused; no image is required.

## Phase 1 — Approved fictional read-only prototype

1. Reuse server-side personnel authorization and active-establishment guard.
2. Add one typed route-local fictional fixture without identifiers.
3. Render reusable-versus-missing CDI readiness with permanent disclaimer.
4. Disable generation and add no actions, APIs, providers, or persistence.
5. Hide the navigation item when personnel access is unavailable.
6. Add component and navigation regression tests.

## F5-07 — Product decision approved, implementation deferred

The approved lifecycle is `DRAFT` to immutable `GENERATED`, with older generated
versions becoming `SUPERSEDED` only after replacement and unfinished work
becoming `ABANDONED` with a reason. Readiness is derived as `INCOMPLETE`, `READY`,
or `ATTENTION_REQUIRED`. OWNER may resume an editable draft, but generated
versions are never edited or overwritten. Signed contracts remain in Documents.

This decision adds no runtime behavior, schema, API, file, or real data.

## F5-08 — Product boundary approved, implementation deferred

Formalités may eventually populate qualified, versioned legal templates and
prepare a draft for explicit OWNER review. It does not author clauses or certify
legality. Generated files will use separately approved private EU storage outside
Neon; signature remains an external-provider concern and signed artifacts belong
to Documents. Audit must be minimized, retention remains legal/DPO-owned, and AI
cannot decide legality, update employee data, sign, issue, or send automatically.

This approval is documentation-only. Do not add schema, APIs, persistence,
files, providers, signatures, AI calls, or real personnel data.

## Phase 2 — interactive offline fictional prototype

Status: `APPROVED AND IMPLEMENTED OFFLINE`

The approved smallest route-local interaction slice is implemented:

1. Extract pure typed demo values, readiness derivation, and state transitions.
2. Add a route-local client component; keep the page server authorization and
   existing fictional fixture boundary unchanged.
3. Make the three existing steps navigable without URL state.
4. Add only the three existing illustrative inputs and accessible demo-only
   completeness messages.
5. Add an in-memory checkpoint, dirty comparison, review acknowledgement, and
   demonstration reset.
6. Keep generation disabled and repeat that nothing is persisted or legally
   validated.
7. Test pure state/readiness transitions, fixture reset, truthful copy, disabled
   generation, and absence of identifiers/storage/server calls.
8. Run Backoffice typecheck/tests/build, repository checks, and authenticated
   browser QA at 1440/1024/768/390.

The implementation stopped before any real field dictionary, new
permission, employee/document ID, URL state, browser storage, server action, API,
schema/migration, database, audit, template, PDF, file, signature, AI/provider,
or real personnel data was introduced.

## Later integrated phases

Connecting the full employee dossier, mapping trusted Salariés facts, real
save/resume, versioning, generation, and every provider/production capability
remain separately approval-gated. F5-07/F5-08 product intent does not authorize
those changes.

## Verification

```text
pnpm ui:pack:check backoffice-equipe-formalites-personnel
pnpm docs:check
pnpm architecture:check
pnpm --filter @yuta/backoffice typecheck
pnpm --filter @yuta/backoffice test
pnpm --filter @yuta/backoffice build
pnpm -r --if-present typecheck
pnpm format:check
```

Browser QA targets: authenticated OWNER at 1440, 1024, 768, and 390 CSS pixels.

## Phase 3 — trusted read-only dossier handoff

Status: `APPROVED AND IMPLEMENTED — DEVELOPMENT READ-ONLY`

Implemented scope:

1. Add an off-by-default development runtime gate; production must fail closed.
2. Add the full-dossier-only OWNER action to the gated integrated route.
3. Add `/equipe/formalites-personnel/[employeeId]` as a server route that
   validates UUID, session, active establishment, permission, and scoped
   employee ownership before rendering.
4. Map only the six allowlisted `PersonnelEmployeeSummary` facts into a small
   route-owned read model; do not pass the repository object to the client.
5. Render a read-only connected prototype with a return link and no editable
   Phase 2 fields or simulated readiness.
6. Add OWNER allow, MANAGER/STAFF deny, invalid-ID, missing, and cross-tenant
   denial tests plus projection allowlist tests.
7. Run Backoffice tests/typecheck/build, repository checks, and authenticated
   responsive QA using only existing fictional LUNA employees.

Stop before any real input, save/resume, lifecycle implementation, audit write,
schema/migration, API/contract, file/template/PDF, signature, AI/provider, legal
eligibility rule, production enablement, or real employee-data QA.

## Phase 4 — connected local interaction

Status: `APPROVED AND IMPLEMENTED — DEVELOPMENT LOCAL-ONLY`

Implemented sequence:

1. Reuse the Phase 3 route gate, server authorization, scoped employee read, and
   six-field projection without widening them.
2. Reuse the Phase 2 pure state/readiness logic for the three existing
   illustrative inputs; initialize them empty or undecided on every mount.
3. Compose the connected read-only facts with the three local steps and keep the
   smallest possible client boundary.
4. Reuse local checkpoint, dirty indication, review acknowledgement, reset,
   accessible validation, and responsive behavior.
5. Make reload/navigation loss explicit; add no navigation interception or
   cross-route resume.
6. Keep generation disabled and avoid every persisted `DRAFT` or legal-readiness
   claim.
7. Add focused tests proving the allowlist remains unchanged, inputs are local,
   reset/reload semantics are truthful, no persistence boundary exists, and
   generation stays disabled.
8. Run the page-pack/docs/architecture checks, Backoffice typecheck/tests/build,
   targeted format checks, and authenticated browser QA using only fictional
   LUNA employees at 1440/1024/768/390.

Stop before server actions, APIs, schema/migrations, database or browser
persistence, lifecycle/audit writes, employee updates, new contract fields or
validation rules, files/templates/PDF, signature, AI/provider calls, real
personnel-data QA, or production enablement.

## Phase 5 — CDI field and applicability decisions

Status: `APPROVED FOR DOCUMENTATION — INTERNAL DRAFT COMPLETE`

Phase 5 performed documentation work only:

1. Inventory the first CDI use cases and mark every unsupported situation.
2. Draft the candidate field matrix without assigning code/schema names.
3. Classify each fact as Salariés read-only, Formalités input, or derived.
4. Record required/optional/conditional rules, factual validation, and template
   mapping as proposals.
5. Attach a named product owner and qualified legal/template reviewer to every
   decision that requires external evidence.
6. Link privacy, retention, audit, access, and storage questions to the existing
   production-readiness gates instead of inventing answers.
7. Mark unresolved rows blocked and present the complete matrix for approval.
8. Run documentation, page-pack, formatting, and diff checks only.

The internal draft proposes upcoming full-time CDI as the smallest first slice
and records part-time, conversion, remediation, amendment, former-employee, and
unsupported-category boundaries. It maps current repository facts and missing
candidate inputs to official-source categories without assigning schema names.
All legal/template/DPO-owned decisions remain blocked pending external evidence.

The self-contained French handoff is prepared in `LEGAL_REVIEW_BRIEF.md`. It
contains no real employee data or contract and has not been sent. Preparing it
does not approve the candidate matrix, close an external gate, or authorize a
template, persistence, or production phase.

Stop before code, runtime UI, schemas, migrations, contracts, APIs, server
actions, persistence, lifecycle/audit writes, templates/files/PDF, signature,
AI/providers, real employee data, and production. A later phase may propose
persistence only after this matrix and required external evidence are approved.
