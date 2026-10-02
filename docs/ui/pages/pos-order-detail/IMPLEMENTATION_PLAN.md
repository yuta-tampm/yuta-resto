# POS Order Detail - Implementation Plan

Status: Receipt-printing Phase 5 completed; physical-printer verification deferred

Visibility: Engineering

## Active initiative - customer receipt printing

### Phase 0 - Repository and product-boundary analysis

Repository analysis is complete and read-only. It confirms an existing page
with a new device-coupled capability: partial enum/schema scaffolding exists,
but there is no creation route, POS action, receipt snapshot contract, worker
claim/renderer, or truthful per-order receipt status.

No runtime code, order/payment/check, print job, queue command, printer device,
or operational data was changed. The previous safe paid-order evidence is
reused as the containing-page baseline.

The product-scope gate recorded in `PRODUCT_SCOPE.md` and `DESIGN_HANDOFF.md`
was approved on 2026-08-18, including placement in the page-specific section of
the existing three-line menu. Do not perform design generation automatically.

### Phase 1 - Product-approved design discovery

Complete and approved on 2026-08-18. Five references cover desktop, landscape tablet,
portrait tablet, mobile, and the approved state/menu anatomy. They use the real
containing-page baseline and label hypothetical receipt behavior as not
implemented.

### Phase 2 - Component and interaction boundary

Documentation complete on 2026-08-18 after separate approval. PB2-01 through
PB2-14 define a backward-compatible page-action menu slot, controlled menu
client boundary, route-local presentation/client flow, thin Server Action,
service-time access, paid order/check targeting, job-only conditional polling,
and truthful retry/reprint recovery.

Phase 2 itself changed documentation only. PB2-01 through PB2-14 and Phase 3
were explicitly approved on 2026-08-18.

### Phase 3 - Approved vertical slice

Implemented on 2026-08-18 as one vertical slice: contract -> site-agent paid-
target validation and immutable snapshot -> durable idempotent print job ->
dedicated receipt renderer/worker support -> route-owned POS action and
truthful queue feedback. Payment capture remains uncoupled and returns no
receipt job. The existing `print_jobs` table was sufficient; no schema,
migration, merchant profile, new authorization, cloud lookup, or raw browser
printer payload was added.

### Phase 4 - Data/operations integration

Not started. Phase 3 confirmed that existing `print_jobs` is sufficient for the
approved non-fiscal slice. Any merchant profile, receipt settings, schema/
migration, new authorization, or payment-transaction coupling still stops for
another explicit approval.

### Phase 5 - Functional, physical, and visual QA

Completed for functional, browser, responsive, degraded-printer, and simulated
production-worker coverage after explicit approval on 2026-08-18. No receipt
command was submitted against operational data. Physical output remains
deferred because no configured Linux/TM-m30 worker is available; no physical
success is claimed.

## Previous visual-renewal plan

## Phase 0 - Repository analysis gate

Complete. Inventory, shared context, real safe baseline, loader side effects,
contracts/actions/tests, impact flags, exact checks, and a self-contained design
prompt are recorded. No runtime or operational data mutation was performed.

Phase 0 and design generation were approved on 2026-08-16.

## Phase 1 - Approved visual baseline implementation

Complete. The approved hierarchy and read-only discount disclosure renew the
real implementation in place. Real data, loaders/actions, validation, locks,
transaction/device ownership, shared shell, and tests are preserved. No fixture
or data-access redesign was introduced.

Phase 1 was reviewed and Phase 2 was explicitly approved on 2026-08-17.

## Phase 2 - Component refactor

Complete. Meaningful page-owned summary, action, article, totals, progression,
and information responsibilities live in route-local `_components`; pure
presentation derivation lives in route-local `_lib`. The page remains the
Server Component loader/eligibility/layout orchestrator. No shared-shell or
runtime boundary changed and no new client component was introduced.

Stop here for Phase 2 review. Do not perform Phase 3 automatically.

## Phase 3 - Approved interactions

Complete. The existing read-only `Remise` disclosure now renders persisted
snapshot item composition beneath each discount name/amount. Default-collapsed
semantics and aggregate totals are preserved; no apply/edit/remove control,
recalculation, catalog inference, or new client state was added.

Cancellation confirmation/reason and changed error recovery remain outside
scope. Stop here for Phase 3 review. Do not perform Phase 4 automatically.

## Phase 4 - Data integration or extension

Complete with no runtime change. The persisted discount-item relationship,
site-agent order-detail join, existing local POS contract, server-only adapter,
and page presentation already provide the approved truthful data end to end.
No field, contract, schema, API, auth, transaction, runtime, device, or
persistence extension is required.

Loader optimization/request-shape work remains separately deferred. Stop here
for Phase 4 review. Do not perform Phase 5 automatically.

## Approved pre-Phase 5 visual correction

Complete. Product-owner review found that the implementation preserved
behavior but did not sufficiently follow the approved `v2` visual hierarchy.
The summary, locked action row, article separators, connected progression,
information density, and responsive composition were corrected without data or
behavior changes. Real values override generated-reference artifacts.

The product owner explicitly approved Phase 5 on 2026-08-18.

## Functional and regression verification gate

Run pack/docs/architecture/repository typecheck/format plus POS typecheck/tests/
build. Add site-agent/db-pos/contracts/offline checks only when an approved
change touches those boundaries.

## Phase 5 - Visual and operational QA

Verify 1366x768, 1024x768, 768x1024, and 390x844 with real persisted data;
confirm contained scrolling, zero horizontal overflow, touch/focus, truthful
health/locked/error states, and protected service behavior. Synchronize this
pack with as-built evidence.

Complete. Final production-browser QA used only the safe paid order. All four
viewports retained zero horizontal overflow, truthful health/locked states, and
48px or larger action controls. The 768px summary now remains in the readable
2x2 fact layout instead of compressing desktop columns. The default-collapsed
discount disclosure and expanded persisted composition were captured at desktop
and narrow sizes. No active order, command action, data mutation, or runtime
boundary change was introduced.

## Delivery evidence

Final evidence and deferred risks are recorded in `README.md`,
`ACCEPTANCE_CHECKLIST.md`, and `references/README.md`. Any later loader
optimization or new state/behavior starts a new separately governed scope.
