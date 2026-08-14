# POS Order Items - Implementation Plan

Status: Draft

Visibility: Engineering

## Phase 0 — Repository analysis gate

Run `prompts/00_REPOSITORY_ANALYSIS.md`. Produce the complete Implementation
Inventory. Make no code changes.

Do not continue while the target application/runtime, classification,
data/session boundary, protected invariants, current visual baseline, or
required commands remain ambiguous.

Resolve the YUTA-global, application, section/flow, and page UI context. Record
the shell/navigation mode, real routes, approved shared references, reusable
patterns, allowed adaptations, and explicit exclusions. Set
`Shared context status: RESOLVED` before the design prompt becomes `READY`.

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

For this route, renew the existing three-column/narrow-dialog composition in
place against real order and catalog data. Preserve every loader, Server Action,
edit lock, order state, and send behavior. Start only after Phase 0 and the
generated design direction are explicitly approved.

## Phase 2 — Component refactor

Extract meaningful units by responsibility while preserving appearance and
behavior. Reuse `@yuta/ui`; do not prematurely promote feature-specific
components to the shared package.

Keep the existing route-local responsibility components unless later evidence
proves a clearer boundary. Shared shell changes require separate impact review.

## Phase 3 — Approved interactions

Implement only approved interactions and current state transitions. Preserve
authoritative business logic and the current trusted boundary.

Limit work to approved improvements around existing add/update/remove,
instruction/allergy, search/category, mobile summary, and kitchen-send
interactions. Do not add optimistic transaction claims or new commands.

Implement the approved post-send success state from a confirmed Server Action
result, with `/pos` and `/` as the only actions. Preserve site-agent command
ownership and UUIDv7 replay. Do not treat an untrusted query parameter or
physical printer state as proof of kitchen-send success.

## Phase 4 — Data integration or extension

Map the current domain and transport first. Existing pages normally require no
data rewrite for a visual refactor. Stop for approval before adding fields,
enums, permissions, contracts, APIs, schema/migrations, runtime dependencies,
or privileged device settings.

Expected result for this existing integrated page is a no-change integration
audit. Any new API/contract/schema/auth/runtime requirement stops the phase.

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
