# POS Management Establishment — Acceptance Checklist

## Phase 0 complete

- [x] Root and relevant nested instructions were read.
- [x] Current/UI/POS product, offline, operator, QA, and backlog docs were read.
- [x] Route absence and `NEW_PAGE` / `NEW_CAPABILITY_DISCOVERY` were verified.
- [x] Local session, shell, singleton-setting, contract, db-pos, and receipt paths were inventoried.
- [x] Baseline is `NOT_APPLICABLE`; containing Management evidence was inspected read-only.
- [x] Shared context is `RESOLVED` with `REUSE_APPROVED_SHARED_SHELL`.
- [x] Required UI states, impact flags, non-goals, and a self-contained prompt are documented.
- [x] No runtime, schema, migration, API, contract, fixture, design, operational data, or print job was changed.

## Phase 1 design approval

- [x] Design generation was explicitly authorized and completed on 2026-08-19.
- [x] Desktop and mobile visual direction was approved on 2026-08-20.
- [x] The generated `recus` typo is excluded from approved copy; implementation uses `reçus`.

## Phase 2 component prototype

- [x] The product owner explicitly approved Phase 2 on 2026-08-20.
- [x] The typed fixture is visibly labelled as demonstration data.
- [x] The direct route reuses the local Management session and shared shell.
- [x] The route fails closed outside development and is absent from hub navigation.
- [x] The field is read-only and the save action is disabled.
- [x] No API, contract, schema, migration, persistence, receipt, or printer behavior changed.

## Phase 3 prototype interactions

- [x] The product owner explicitly approved Phase 3 on 2026-08-20.
- [x] Editing and exact dirty-state comparison stay inside the client fixture boundary.
- [x] Reset restores the fixture and clears simulated status.
- [x] Simulated save retains input and truthfully states that nothing was persisted.
- [x] Unapproved validation, edit-rights, clear/rename, and conflict rules were not invented.
- [x] The existing server-derived local Management session gate remains authoritative.
- [x] No API, contract, schema, migration, persistence, receipt, or printer behavior changed.

## Phase 4 real vertical slice

- [x] The product owner explicitly approved Phase 4 on 2026-08-20.
- [x] Fixture and development-only gate were removed.
- [x] Dedicated singleton migration and database constraints were generated and reviewed.
- [x] Protected admin/manager GET/PATCH contracts and revision CAS are implemented.
- [x] POS server-only client/action and real UI states preserve runtime ownership.
- [x] The Management hub exposes the integrated `Établissement` route; reports remain unavailable.
- [x] Initial receipt creation snapshots the optional name inside the locked transaction.
- [x] Retry/reprint preserve the source payload after rename.
- [x] Renderer and preview omit the name when absent and add no fiscal/legal fallback.
- [x] Migration and integration tests ran only against disposable PostgreSQL.

## Phase 5 visual and operational QA

- [x] The product owner explicitly approved Phase 5 on 2026-08-20.
- [x] The product owner completed the real configured save test; QA preserved `LUNA`.
- [x] Production-build captures cover 1366x768, 1024x768, 768x1024, and 390x844.
- [x] Every viewport has zero horizontal overflow and empty browser warning/error logs.
- [x] Input, reset, and save controls measure 48px high at every viewport.
- [x] Draft, reset, blank validation, configured copy, and recovery were verified without another save.
- [x] Conflict, denial, outage, receipt, and immutable-reprint behavior remain covered by automated/guarded tests.
- [x] No print job, active order, cloud request, reset, or seed was created for visual evidence.

## Product decisions required before implementation/integration

- [x] Approve the one-field first slice (`displayName`).
- [x] Approve the dedicated local singleton owner/table shape.
- [x] Approve trim, Unicode/control-character, non-empty, and 80-character rules.
- [x] Approve admin/manager read and edit rights.
- [x] Approve integer revision CAS and 409 conflict behavior.
- [x] Reject update history/audit for this first slice.
- [x] Reject clear; approve direct rename with immutable-old-receipt copy.
- [x] Approve initial receipt snapshot timing and compatible optional version-1 field.
- [x] Confirm optional omission when unconfigured and immutable old jobs after rename.
- [x] Confirm legal/fiscal/cloud fields stay excluded.
- [x] Authorize an explicitly labelled fixture prototype for Phase 2 only.
- [x] Approve adding the `Établissement` hub card; keep reports unavailable.

## Later implementation acceptance

- [x] Browser receives no database access, bearer token, cloud scope, or trusted role input.
- [x] GET/PATCH fail closed without an active authorized local session.
- [x] Input is validated at the trusted contract/service boundary and preserved on failure.
- [x] Conflict prevents silent overwrite and supports recovery.
- [x] Unconfigured state uses no fabricated fallback.
- [x] Initial receipt creation snapshots the current normalized name atomically.
- [x] Retry/reprint preserve the source payload after rename.
- [x] Renderer/preview omit the line when absent and retain non-fiscal/no-VAT behavior.
- [x] Site-agent/database outage and expired/forbidden session states are truthful.
- [x] Authenticated 1366x768, 1024x768, 768x1024, and 390x844 production matrix has labels, status text, 48px controls, and no horizontal overflow.
- [ ] Automated Tab evidence remains open because both in-app browser keypress paths kept focus on the input; the semantic form/button implementation and visible focus styles remain intact.
- [x] Current UI backlog and this pack match the Phase 5 as-built result.

## Verification gates

- [x] `pnpm ui:pack:check pos-management-establishment`
- [x] `pnpm docs:check`
- [x] `pnpm architecture:check`
- [x] `pnpm -r --if-present typecheck`
- [x] `pnpm format:check` reported the unchanged 23-file repository baseline
- [x] scoped contracts/db-pos/site-agent/POS tests and typechecks
- [x] guarded disposable db-pos and site-agent integration suites
- [x] `pnpm test:receipt-preview`
- [x] `pnpm build:pos`
- [x] authenticated production-browser evidence for configured load, draft, reset, blank validation, and responsive matrix
