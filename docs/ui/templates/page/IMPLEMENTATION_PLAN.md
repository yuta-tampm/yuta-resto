# <Page or screen name> — Implementation Plan

Status: Draft

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

## Phase 1 — Approved visual baseline implementation

For `NEW_PAGE`, typed fixtures may be used only when explicitly approved.

For `EXISTING_PAGE`, improve the real implementation in place. Preserve real
data, authorization/session, mutations/actions, validation, transport,
polling/offline/device behavior, and tests.

Do not change contracts, permissions, schema, or unrelated routes.

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
