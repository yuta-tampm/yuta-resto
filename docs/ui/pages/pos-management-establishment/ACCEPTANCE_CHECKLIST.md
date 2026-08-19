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

## Product-owner approval required before Phase 1

- [ ] Approve the one-field first slice (`displayName`).
- [ ] Approve the local singleton semantic owner/table shape.
- [ ] Approve trim, Unicode/control-character, empty, and maximum-length rules.
- [ ] Approve admin/manager read and edit rights.
- [ ] Approve optimistic concurrency/conflict behavior.
- [ ] Approve or reject update history/audit.
- [ ] Approve clear and rename behavior/copy.
- [ ] Approve receipt snapshot timing and payload compatibility approach.
- [ ] Confirm optional omission when unconfigured and immutable old jobs after rename.
- [ ] Confirm legal/fiscal/cloud fields stay excluded.
- [x] Design generation was explicitly authorized and completed on 2026-08-19.
- [ ] Decide whether an explicitly labelled fixture prototype is authorized.
- [ ] Approve adding the `Établissement` hub card; keep reports unavailable.

## Later implementation acceptance

- [ ] Browser receives no database access, bearer token, cloud scope, or trusted role input.
- [ ] GET/PATCH fail closed without an active authorized local session.
- [ ] Input is validated at the trusted contract/service boundary and preserved on failure.
- [ ] Conflict prevents silent overwrite and supports recovery.
- [ ] Unconfigured state uses no fabricated fallback.
- [ ] Initial receipt creation snapshots the current normalized name atomically.
- [ ] Retry/reprint preserve the source payload after rename.
- [ ] Renderer/preview omit the line when absent and retain non-fiscal/no-VAT behavior.
- [ ] Site-agent/database outage and expired/forbidden session states are truthful.
- [ ] POS viewport matrix, focus, labels, status text, 44px touch targets, and no overflow pass.
- [ ] Product/operator/QA docs and this pack match the as-built result.

## Verification gates

- [ ] `pnpm ui:pack:check pos-management-establishment`
- [ ] `pnpm docs:check`
- [ ] `pnpm architecture:check`
- [ ] `pnpm -r --if-present typecheck`
- [ ] `pnpm format:check` or truthful baseline failure report
- [ ] scoped contracts/db-pos/site-agent/POS tests and typechecks
- [ ] guarded disposable-db integration tests for schema/query changes
- [ ] `pnpm test:receipt-preview`
- [ ] `pnpm build:pos`
- [ ] authenticated browser evidence after implementation
