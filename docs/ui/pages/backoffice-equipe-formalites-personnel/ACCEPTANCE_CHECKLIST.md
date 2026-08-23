# Préparer un projet de contrat CDI — Acceptance Checklist

## Repository and approval

- [x] Root, Backoffice, current-state, UI workflow, and salaries authorities read.
- [x] Route classified `NEW_PAGE`; Phase 1 was visual-only and Phase 2 is interactive offline.
- [x] Phase 0 inventory, shared shell context, and no-image decision resolved.
- [x] F5-02 through F5-06 and fictional read-only Phase 1 approved on 2026-08-22.
- [x] F5-07 lifecycle was approved on 2026-08-22 and remains implementation-gated.
- [x] F5-08 product boundaries were approved on 2026-08-22 as documentation only.
- [x] F5-08 closes no legal/DPO/privacy/security/provider/operations gate.

## Scope and trust

- [x] Existing authenticated Backoffice shell reused.
- [x] Active establishment and OWNER personnel access enforced on the server.
- [x] Formalités navigation item hidden without personnel access.
- [x] No browser-provided tenant or employee scope is trusted.
- [x] No employee identifier, dossier read, document read, or real business fact used.
- [x] No schema, migration, contract, API, provider, file, or production change.

## UI and behavior

- [x] Fictional-data notice is permanent and explicit.
- [x] Reusable and contract-specific example facts are visibly separated.
- [x] The form is explicitly fictional and every change remains in React memory only.
- [x] Document generation is disabled and explained.
- [x] French copy, semantic tokens, `@yuta/ui`, and accessible textual statuses used.

## Verification

- [x] Route-local fixture/component regression tests pass.
- [x] Backoffice navigation regression test passes.
- [x] Backoffice typecheck and test suite pass.
- [x] Backoffice production build passes.
- [x] Recursive workspace typecheck passes.
- [x] Documentation and architecture checks pass.
- [x] Page-pack check passes.
- [x] Final format check passes after as-built documentation synchronization.
- [x] Authenticated browser QA passes at 1440/1024/768/390 without horizontal overflow.
- [x] Mobile main content is scrollable; browser console has no warning/error.

## Deferred

- [x] Full-dossier entry is not connected in this fictional-only phase.
- [x] Real data mapping, inputs, validation, lifecycle implementation, generation,
      legal review, signature, audit, retention, and production operation remain
      deferred.
- [x] No schema, API, file storage, signature, AI call, or real employee data was
      added by F5-08 approval.

## Phase 2 acceptance checklist

- [x] Phase 2 scope is documented as an interactive offline fictional prototype.
- [x] Phase 2 is the current as-built runtime authority.
- [x] Proposed state is React memory only and resets on reload/navigation.
- [x] No browser storage, URL state, server action, API, database, or identifier
      is proposed.
- [x] Only the three existing illustrative fields are in the proposed UI scope.
- [x] Demo readiness is explicitly not legal or production readiness.
- [x] Generation remains disabled; no durable lifecycle transition is simulated.
- [x] Required pure-state, copy, authorization-boundary, responsive, and browser
      QA expectations are recorded.
- [x] Product owner explicitly approved Phase 2 runtime implementation on 2026-08-22.
- [x] Route-local reducer, interaction UI, and regression tests are implemented.
- [x] Backoffice typecheck and complete Backoffice test suite pass for Phase 2.
- [x] Authenticated Phase 2 browser flow and responsive QA recorded.
- [x] Final build, repository checks, and documentation synchronization pass.

## Phase 3 acceptance checklist

- [x] Smallest next slice is documented as a trusted read-only dossier handoff.
- [x] Entry is limited to the full dossier; quick view remains unchanged.
- [x] Existing OWNER-only permission and composite tenant-scoped repository are
      reused.
- [x] Six allowed Salariés facts are explicit; extra repository fields are not
      passed to the Formalités client presentation.
- [x] Local QA is restricted to existing fictional LUNA employees.
- [x] Integrated entry/route are proposed behind an off-by-default development
      gate; production remains fail-closed.
- [x] No input, persistence, lifecycle, schema, API, audit write, file, PDF,
      template, signature, AI/provider, production, or legal eligibility rule is
      proposed.
- [x] Product owner explicitly approved Phase 3 implementation in this scope.
- [x] Development gate, full-dossier entry, scoped route, allowlisted projection,
      and read-only UI are implemented.
- [x] Focused gate, projection, and read-only rendering tests pass.
- [x] Authenticated full-dossier-to-Formalités browser flow and responsive QA pass.
- [x] Backoffice build/typecheck, recursive typecheck, documentation, page-pack,
      architecture, targeted tests, and targeted Phase 3 format checks pass.
- [x] Repository-wide format check passes; the unrelated Phase 3 temporary-file
      blocker was no longer present during Phase 4 verification.

## Phase 4 proposal approval gate

- [x] Phase 4 is documented as connected interaction with local-only edits.
- [x] Phase 3 trusted read, OWNER authorization, full-dossier entry, development
      gate, tenant scope, and six-field allowlist remain unchanged.
- [x] Editable scope is limited to the three existing illustrative Phase 2 fields.
- [x] Inputs start empty or undecided and are not copied from the employee dossier.
- [x] Checkpoint/readiness remain demonstration-only React state and disappear on
      reload or navigation.
- [x] No custom leave-page warning or cross-route resume is proposed.
- [x] Generation remains disabled even at demo-only `READY`.
- [x] No F5-07 lifecycle, save, schema, API, audit write, employee update, file,
      PDF, template, signature, AI/provider, real personnel-data QA, or production
      behavior is proposed.
- [x] Product owner explicitly approved Phase 4 implementation in this exact scope
      on 2026-08-23.
- [x] Phase 4 runtime implementation and focused tests are complete.
- [x] Authenticated fictional-data browser QA and required repository checks pass.

## Phase 5 proposal approval gate

- [x] The smallest safe next step is identified as field/applicability decisions
      before persistence design.
- [x] The proposed deliverable is a reviewed decision matrix, not schema/API/UI.
- [x] Employee eligibility, field ownership, requirements, conditions,
      validation, template mapping, sensitivity, retention, and audit ownership
      are included.
- [x] Unresolved legal/template decisions must remain blocked rather than guessed.
- [x] Phase 4 demonstration fields receive no automatic production meaning.
- [x] Phase 5 uses documentation and synthetic examples only.
- [x] No runtime, schema, API, persistence, audit write, file/PDF, signature,
      AI/provider, real employee data, or production work is proposed.
- [x] Product owner explicitly approved the Phase 5 documentation scope on
      2026-08-23.
- [x] The internal applicability and candidate CDI field matrices are drafted.
- [x] Current repository fields and missing authorities are distinguished.
- [x] Official French sources and their non-template limitation are recorded.
- [x] Qualified legal/template and DPO-owned decisions are recorded as blocked
      with named evidence owners.
- [x] A self-contained French legal-review brief is prepared with no real
      employee data or contract, explicit decision tables, requested
      deliverables, official sources, and reviewer/template-version fields.
- [x] Documentation, page-pack, architecture, recursive typecheck, repository
      formatting, and diff checks pass.
- [ ] The legal-review brief is sent to a qualified reviewer through an approved
      private channel after the contact field is completed.
- [ ] A dated qualified response and approved versioned template are received
      and recorded as evidence.
- [ ] The complete field/applicability matrix is approved before persistence is
      proposed.
