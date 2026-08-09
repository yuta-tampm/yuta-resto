# Codex Prompt — Phase 0: Repository Analysis Gate

Do not change code in this phase.

Read root `AGENTS.md`, `docs/README.md`, `docs/CURRENT_STATE.md`, the nearest
application `AGENTS.md`, current architecture/product/feature/operations/QA
docs, `docs/ui/README.md`, `docs/ui/YUTA_FRONTEND_RULES.md`, target-application
UI rules, this page package, the current implementation/tests,
`packages/ui/src/index.ts`, and semantic tokens.

Return an **Implementation Inventory** with exactly these sections:

1. Target application and real route/screen.
2. `NEW_PAGE` or `EXISTING_PAGE`.
3. Implementation class: visual-only, interactive, integrated, or
   device-coupled.
4. Route/shell/container files and nearby conventions.
5. Auth, tenant, public-resolution, local-session, or standalone-local boundary
   that actually applies.
6. Data owner/source and persistence boundary.
7. Transport/contracts used by the screen.
8. Current loaders, server actions, local API commands, mutations, validation,
   and transaction owner as applicable.
9. Polling, offline, retry, provider, printer, or device behavior as applicable.
10. Shared UI primitives/tokens already used or suitable for reuse.
11. Existing tests protecting the target behavior.
12. Current documentation that is authority for the target.
13. Protected business/runtime invariants that UI work must not break.
14. Current visual baseline and browser/device evidence for an existing screen.
15. Conflicts between the requested design/reference and current implementation
    or domain.
16. Unsupported concepts requiring product, schema, contract, or device
    approval.
17. Exact repository commands that exist for verification.
18. Proposed files to change in later phases.

For an existing integrated or device-coupled screen, explicitly state that
fixture replacement is forbidden.

Stop after the inventory. Do not implement Phase 1 automatically.
