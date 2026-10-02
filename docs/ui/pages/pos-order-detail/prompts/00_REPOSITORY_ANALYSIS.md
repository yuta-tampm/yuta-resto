# Codex Prompt — Phase 0: Repository Analysis Gate

Active initiative: customer-receipt printing from the existing order-detail
page. Classify the containing page separately from the new flow. Inventory the
existing `customer_receipt` enum/schema scaffolding, payment `printJob: null`
behavior, management-authenticated queue routes, service-time trust boundary,
missing receipt command/payload/renderer/worker claim, merchant-data gaps,
single/split ambiguity, and physical printer state. Correct documentation drift
but make no runtime or operational-data change.

Do not change code in this phase.

Read root `AGENTS.md`, `docs/README.md`, `docs/CURRENT_STATE.md`, the nearest
application `AGENTS.md`, current architecture/product/feature/operations/QA
docs, `docs/ui/README.md`, `docs/ui/YUTA_FRONTEND_RULES.md`, target-application
UI rules, this page package, the current implementation/tests,
`packages/ui/src/index.ts`, and semantic tokens.

Return an **Implementation Inventory** with exactly these sections:

1. Target application and real route/screen.
2. Target type: `PAGE`, `SCREEN`, `SURFACE`, or `FLOW`.
3. `NEW_PAGE` or `EXISTING_PAGE`.
4. Implementation class: visual-only, interactive, integrated, or
   device-coupled.
5. Route/shell/container files and nearby conventions.
6. Auth, tenant, public-resolution, local-session, or standalone-local boundary
   that actually applies.
7. Data owner/source and persistence boundary.
8. Transport/contracts used by the screen.
9. Current loaders, server actions, local API commands, mutations, validation,
   and transaction owner as applicable.
10. Polling, offline, retry, provider, printer, or device behavior as applicable.
11. Shared UI primitives/tokens already used or suitable for reuse.
12. Existing tests protecting the target behavior.
13. Current documentation that is authority for the target.
14. Protected business/runtime invariants that UI work must not break.
15. Current visual baseline and browser/device evidence for an existing screen.
16. Conflicts between the requested design/reference and current implementation
    or domain.
17. Unsupported concepts requiring product, schema, contract, or device
    approval.
18. Expected change impact: files to modify/create, packages affected, and
    cross-application impact.
19. Database, API/contract, permission/auth, and runtime/device change flags as
    `YES`, `NO`, or `PROPOSAL`.
20. Exact repository commands that exist for verification.
21. Proposed files to change in later phases.
22. Shared UI context sources at YUTA-global, application, section/flow, and
    page levels, including approval state and conflicts.
23. Exact shell/navigation mode, owner, header/sidebar/account behavior, real
    routes, responsive rules, and forbidden invented elements.

For an existing integrated or device-coupled screen, explicitly state that
fixture replacement is forbidden.

After the inventory, complete `DESIGN_HANDOFF.md` without changing application
code:

1. Complete the shared-context matrix and select exactly one shell/navigation
   mode. If a missing or conflicting shared decision would materially change
   the design, set `Shared context status: BLOCKED` and stop; never ask the
   design tool to invent the missing context.
2. Assemble a curated design-tool bundle containing applicable approved shared
   references, exact reuse/adaptation/exclusion rules, real routes, common
   responsive/state constraints, and the page-specific hierarchy.
3. For `EXISTING_PAGE`, capture the current authenticated browser/device
   baseline and record route, state, viewport/device, date, and runtime/session
   conditions. If capture is unavailable, record the exact blocker and set the
   baseline status to `BLOCKED`; do not substitute a code-derived description
   for visual evidence.
4. For `NEW_PAGE`, set the baseline status to `NOT_APPLICABLE` and record that
   no current screen exists.
5. Prepare a self-contained, ready-to-use design-generation prompt for
   ChatGPT/ImageGen or another approved design tool. Ground it in the inventory,
   approved capabilities, protected invariants, resolved shared context,
   required states, target viewport/device, and unsupported concepts.

The Phase 0 handoff output is therefore the Implementation Inventory, resolved
shared-context bundle (or explicit blocker), current baseline evidence, and the
design-generation prompt.
Stop after this handoff. Do not generate a mockup or implement Phase 1
automatically.
