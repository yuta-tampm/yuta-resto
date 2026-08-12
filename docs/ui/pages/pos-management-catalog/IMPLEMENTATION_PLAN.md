# POS management catalog — Implementation Plan

Status: Implementation ready

Visibility: Engineering

## Phase 0 — Repository analysis gate

Run `prompts/00_REPOSITORY_ANALYSIS.md`. Produce the complete Implementation
Inventory. Make no code changes.

Do not continue while the target application/runtime, classification,
data/session boundary, protected invariants, current visual baseline, or
required commands remain ambiguous.

After the inventory, complete `DESIGN_HANDOFF.md`: capture the current visual
baseline for an existing target (or record a truthful blocker), then prepare a
self-contained design-generation prompt for ChatGPT/ImageGen or another
approved design tool. This handoff is documentation/design preparation, not UI
implementation.

Phase 0 repository analysis and baseline capture completed on 2026-08-09 with
no runtime-code changes. On 2026-08-11 the package was migrated to protocol
revision 4: shared UI context was resolved and the no-sidebar POS Management
dark header direction was approved. On 2026-08-11 proposals 01 and 02 were
approved as visual-direction references with documented raster deviations.
Stop here for explicit Phase 1 approval before runtime changes.

## Phase 1 — Approved visual baseline implementation

For `NEW_PAGE`, typed fixtures may be used only when explicitly approved.

For `EXISTING_PAGE`, improve the real implementation in place. Preserve real
data, authorization/session, mutations/actions, validation, transport,
polling/offline/device behavior, and tests.

Do not change contracts, permissions, schema, or unrelated routes.

Proposed Phase 1 scope after explicit approval:

1. Extract the printing route's proven dark header into a POS Management shared
   component and update printing to consume it without visual or behavioral
   regression.
2. Update the catalogue Server Component to retain the validated management
   session, render the shared header and return-to-management navigation, and
   preserve the truthful site-agent-unavailable state.
3. Restyle the real catalogue into the approved dense hierarchy with the first
   category expanded, remaining categories collapsible, direct category/item
   actions, textual statuses, and responsive stacking. Use live categories and
   items only; do not hard-code reference-image data.
4. Implement the approved two-column article editor at desktop widths with
   vertically stacked sections on tablet/mobile, internal scroll containment,
   empty-variant treatment, and reachable sticky cancel/save actions.
5. Preserve every current field, server action, confirmation, validation,
   pending, success, conflict, not-found, empty, and recovery behavior. Do not
   modify `actions.ts` unless the approved presentation cannot reuse its current
   interface.
6. Treat raster text/data deviations as non-authoritative: use current French
   copy, runtime prices/descriptions/counts, and contract enums.

Expected Phase 1 files:

- create `apps/yuta-pos/src/app/management/_components/ManagementHeader.tsx`;
- modify `apps/yuta-pos/src/app/management/printing/page.tsx` and retire the
  printing-only header ownership after shared reuse is verified;
- modify `apps/yuta-pos/src/app/management/catalog/page.tsx`;
- modify `apps/yuta-pos/src/app/management/catalog/CatalogManagement.tsx`;
- update this page package with Phase 1 evidence.

Phase 1 stops after the approved visual baseline is implemented and verified.
Do not perform the broader catalogue component decomposition in Phase 2
automatically.

## Phase 2 — Component refactor

Extract meaningful units by responsibility while preserving appearance and
behavior. Reuse `@yuta/ui`; do not prematurely promote feature-specific
components to the shared package.

## Phase 3 — Approved interactions

Implement only approved interactions and current state transitions. Preserve
authoritative business logic and the current trusted boundary.

## Phase 4 — Data integration or extension

Map the current domain and transport first. Existing pages normally require no
data rewrite for a visual refactor. Stop for approval before adding fields,
enums, permissions, contracts, APIs, schema/migrations, runtime dependencies,
or privileged device settings.

## Functional and regression verification gate

Before Phase 5, run applicable behavior-protecting tests, target-application
typecheck/tests/build, and affected contract/domain/database/runtime/device
checks. Resolve regressions before declaring visual parity.

## Phase 5 — Visual and responsive QA

Use the target application's viewport/device matrix and operational QA
requirements only after the functional/regression gate. Run exact existing
repository checks, attach evidence, and synchronize the page package with the
as-built result.

## Delivery evidence

Report files changed, protected invariants, commands/results, browser/device
evidence, deviations, blocked proposals, and risks.
