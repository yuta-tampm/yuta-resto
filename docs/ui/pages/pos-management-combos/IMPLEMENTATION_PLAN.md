# POS management combos — Implementation Plan

Status: Gated plan; Phase 0 complete only

Visibility: Engineering

## Phase 0 — repository and design handoff

Completed read-only repository analysis, shared-context resolution,
authenticated baseline capture, and design prompt preparation. No runtime code
was changed. Stop for approval.

## Phase 1 — approved visual baseline

After explicit approval of the generated visual direction, refactor the real
route in place. Reuse `ManagementHeader`, preserve the protected page loader and
Server Actions, and implement only the approved hierarchy/density/responsive
direction. No fixtures, contracts, API, auth, schema, or device changes.

## Phase 2 — component responsibilities

Extract route-local rule/group/editor presentation components only where the
implemented Phase 1 composition proves a stable responsibility boundary. Do
not create speculative shared components or move combo business logic into UI.

## Phase 3 — interactions and states

Verify dialog focus/scroll, confirmations, active locks, pending/error/success
behavior, and any approved disclosure state. Preserve Server Action and
site-agent semantics. New search/filter/bulk behavior remains out of scope.

## Phase 4 — data integration verification

Re-audit contracts, bearer forwarding, revalidation, service errors,
transactions, and payment/combo invariants. This phase is verification unless
a separately approved gap is found; it does not authorize model expansion.

## Phase 5 — visual and accessibility QA

Run functional/regression checks first, then capture authenticated as-built
evidence at `1366 × 768`, `1024 × 768`, `768 × 1024`, and `390 × 844`. Check
keyboard/touch behavior, focus, dialog containment, disabled/pending states,
and intentional deviations. Synchronize the package to the as-built result.

Every phase stops for product-owner approval before the next phase.
