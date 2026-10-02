# POS Order Entry - Acceptance Checklist

## Phase 0 gate

- [x] Repository, POS, product/operations, and UI workflow authority read.
- [x] Target is `apps/yuta-pos` `/pos`, type `PAGE`.
- [x] `EXISTING_PAGE`, `integrated`, `EXISTING_CAPABILITY_RENEWAL` recorded.
- [x] Loader, action, contracts, site-agent, db-pos, trust, and tests inventoried.
- [x] Real operational baseline records route, viewport, date, runtime, and auth truth.
- [x] Shared context is `RESOLVED` with one shell mode.
- [x] Design-tool bundle and prompts are `READY`.
- [x] No runtime code change or data mutation occurred.
- [x] Fixture replacement is forbidden.

## Scope and invariants

- [x] Product owner approved Phase 0 scope for design generation.
- [x] Local-only ownership and employee-attribution truth are preserved.
- [x] Eligibility, validation, UUIDv7, draft status, and redirect are preserved.
- [x] No unsupported route, field, type, role, permission, contract, API,
      schema, offline queue, cloud relation, or printer action is added.

## Design approval

- [x] Baseline `CAPTURED`; prompt `READY`; shared context `RESOLVED`.
- [x] Generated references reviewed and visual direction approved.
- [x] Scope and reference are `APPROVED`.
- [x] Package is `implementation-ready` for Phase 1.

## UI and behavior

- [x] Shared POS shell/navigation reused without page-local redesign.
- [x] Existing fields, types, and create action remain direct and truthful.
- [x] Real data is never replaced with fixtures.
- [x] Relevant loading, pending, validation, conflict, failure, success, and
      recovery states are truthful for the approved phase.
- [x] Success still redirects to item entry.
- [x] Server/service authority is not moved into browser presentation.

## Phase 2 component boundary

- [x] Product owner approved Phase 2.
- [x] Route page is focused on loading, default selection, and shell orchestration.
- [x] `OrderEntryForm` is route-local and remains a Server Component.
- [x] Existing Server Action binding and form names/values are unchanged.
- [x] No feature UI was promoted to `@yuta/ui` and no Client Component was added.
- [x] Clean-origin desktop/narrow QA preserved the approved Phase 1 baseline.

## Phase 3 interactions

- [x] Product owner approved Phase 3.
- [x] Submit pending state is visible and prevents duplicate activation.
- [x] Server validation is associated with fields and submitted values persist.
- [x] Stale employee state supports refresh/reselection without implying login.
- [x] Local-user load failure is disabled, truthful, and manually recoverable.
- [x] Create failure is reported as unconfirmed without claiming safe retry.
- [x] Success still redirects; no toast, receipt, autosave, or offline queue added.
- [x] Focused action tests and clean-origin browser state checks pass.

## Responsive, touch, and accessibility

- [x] All four POS viewports verified with no overflow/clipping.
- [x] Keyboard operation, visible focus, labels/legend, and text status work.
- [x] Touch-critical Phase 1 controls are at least 44 CSS pixels.
- [x] Virtual keyboard does not make the primary action unreachable.
- [x] No essential behavior is hover-only.

## Verification

- [x] `pnpm ui:pack:check pos-order-entry`
- [x] `pnpm docs:check`
- [x] `pnpm architecture:check`
- [x] `pnpm -r --if-present typecheck`
- [x] Scoped formatting passed; unrelated full-format baseline failures reported.
- [x] POS typecheck/tests/build after runtime work
- [x] Affected contracts/site-agent/db-pos/offline checks are not required; no
      boundary changed in Phase 4 or Phase 5.
- [x] Phase 1 browser evidence and console findings reported

## Completion

- [x] Every executed phase explicitly approved; Phase 4 closed as a no-change
      audit when the product owner directed delivery to Phase 5.
- [x] Functional/regression QA precedes Phase 5.
- [x] Deviations and risks recorded; stable package matches as-built.
- [x] Status becomes `implemented` only after final evidence and sync.
