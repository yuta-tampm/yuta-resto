# POS Order Entry - Implementation Plan

Status: Phase 5 complete; implemented

Visibility: Engineering

## Phase 0 - Repository analysis gate

Completed read-only on 2026-08-13. `/pos` is an `EXISTING_PAGE`, `integrated`,
using `EXISTING_CAPABILITY_RENEWAL`. Shared context is resolved with
`REUSE_APPROVED_SHARED_SHELL`. Real baseline and ready prompts are attached. No
runtime code or local data changed. Stop until explicit approval.

## Phase 1 - Approved visual baseline implementation

Approved by the product owner on 2026-08-14. The package is
`implementation-ready`. Renew `pos/page.tsx` in place while
preserving real user loading, employee eligibility, Server Action, contracts,
site-agent/db-pos persistence, validation, redirect, shell/status strip, and
tests. Never use fixtures or change sibling routes for visual parity.

Completed on 2026-08-14. The route-local card hierarchy, semantic order-type
icons, responsive control composition, note density, focus-visible radio
treatment, and primary action affordance now follow the approved direction.
The shared shell, live loader, form names/values, Server Action, and success
redirect were not changed.

Browser evidence used the real local stack without submitting the form. At
1366 x 768 and 390 x 844, `YuTa Staff` and `dine_in` remained selected, the
create action remained visible and enabled, horizontal overflow was zero,
order controls measured at least 48 CSS pixels high, and warning/error console
logs were empty. The remaining 1024 x 768 and 768 x 1024 matrix, keyboard and
virtual-keyboard review, and non-healthy state review remain Phase 5 work.

## Phase 2 - Component refactor

After Phase 1 review, extract route-local units only when responsibility,
action/state ownership, testability, or boundaries justify it. Keep Server
Components by default. Reuse `@yuta/ui`; do not prematurely promote business UI.

Approved and completed on 2026-08-14. `OrderEntryForm.tsx` now owns the
route-local form card, fields, no-staff presentation, order-type presentation,
and unchanged `createOrderAction` binding. `page.tsx` owns live local-user
loading, selectable-role filtering, cookie/default employee resolution, and
the shared POS shell. Both remain Server Components; no state, client boundary,
shared-package promotion, fixture, contract, or behavior was added.

Clean-origin browser evidence at `localhost:3013` used the real local stack
without submitting the form. At 1366 x 768 and 390 x 844, `YuTa Staff` and
`dine_in` remained selected, submit remained enabled at 56 CSS pixels,
horizontal overflow was zero, and warning/error console logs were empty. A
reused `localhost:3003` tab exposed stale Turbopack chunks after hot reload, so
it was rejected as evidence rather than treated as a product regression.

## Phase 3 - Approved interactions

Only after approval, address selected pending, validation, load/create error,
and recovery behavior. Preserve values and employee revalidation. Do not imply
staff authentication, autosave, retry-safe creation, or offline mutation.

Approved and completed on 2026-08-14. `OrderEntryForm` now uses a focused
client boundary with `useActionState` for controlled value preservation,
disabled/pending feedback, associated field errors, and manual staff refresh.
`createOrderAction` now returns serialization-safe recoverable states for
validation, stale staff, and local-service failure while retaining the same
validated create call and success redirect. The Server Component converts a
local-user load failure into a truthful disabled form with manual refresh.

Four focused action tests cover submitted-value preservation, stale staff,
cautious service failure, and the unchanged create/redirect path. Clean-origin
browser QA at 390 x 844 verified loader failure and recovery, field-associated
whitespace validation with `delivery` and note values preserved, and a
site-agent create failure with all values preserved. The failure message calls
the result unconfirmed and instructs the operator to check service/order state
before another submission because creation has no idempotency key. No test
submission reached order creation and no data changed.

## Phase 4 - Data integration or extension

Audit mappings again. A visual renewal should need no data rewrite. Stop before
any field, enum, permission, authentication, API, contract, idempotency, schema,
migration, runtime, cloud, or device change.

Completed as a no-change audit on 2026-08-14 when the product owner directed
delivery to Phase 5. Existing field names, enums, authorization truth,
contracts, site-agent/db-pos ownership, create semantics, and redirect remain
unchanged. No integration extension was required or performed.

## Functional and regression verification gate

Run page-pack/docs/architecture/workspace checks and POS typecheck/tests/build.
Run affected contracts/site-agent/db-pos/offline checks only when later behavior
touches those boundaries. Resolve or report regressions before Phase 5.

Passed on 2026-08-14: page-pack, docs, architecture, workspace typecheck, POS
typecheck, 48/48 POS tests, and POS production build. Boundary-specific suites
were not required because Phase 4 made no contract, site-agent, db-pos, or
offline change.

## Phase 5 - Visual and responsive QA

Use 1366 x 768, 1024 x 768, 768 x 1024, and 390 x 844. Verify real data,
shell fidelity, action reachability, overflow, virtual-keyboard impact,
keyboard/focus, 44px touch targets, pending/disabled feedback, and truthful
no-staff/degraded/recovery states. Use a clean origin if stale chunks recur.

Approved and completed on 2026-08-14 against the real stack and clean
production-build origin `localhost:3013`. All four viewports had zero horizontal
overflow, 48px minimum effective touch targets, a visible 56px submit action,
and no browser warnings/errors. Keyboard focus and employee-combobox
Enter/Escape behavior passed. A 390 x 500 reduced-height check kept submit
visible with the note focused. Non-mutating validation preserved delivery,
note, and table values after a Phase 5 radio-reset regression was corrected.
Phase 3 evidence and focused tests cover degraded/recovery paths without adding
fixtures or mutating production-like local data.

Post-review correction: the `/pos` shell now opts into a full-width prominent
header matching the approved desktop direction. The variant remains within the
shared `PosHeader`/`PosPageShell` components and is enabled only by `/pos`;
sibling routes keep their existing density. The compact menu begins below
`lg`, preventing action wrapping at the 768px tablet viewport.

Product-owner follow-up on 2026-08-16 standardizes the prominent desktop
header across all non-management `PosPageShell` routes. `/pos` retains its
existing content and actions; the direct `Nouvelle commande` navigation action
remains exclusive to Home `/`.

## Delivery evidence

Report files, invariants, exact commands/results, skipped guarded checks,
browser evidence, deviations, proposals, and risks. Sync this stable package
before marking implemented.
