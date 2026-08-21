# Codex Prompt — Phase 1: Visual Baseline

Use the approved Phase 0 Implementation Inventory as the behavioral and visual
baseline.

Do not begin until product scope and the visual reference/no-image decision are
approved, `Shared context status` is `RESOLVED`, and the package is
`implementation-ready`.

If `NEW_PAGE`, typed fixture data may be used only when this page package
explicitly permits it.

If `EXISTING_PAGE`, refactor the real implementation in place. Preserve the
identified auth/session boundary, data loading/transport, actions/mutations,
validation, business invariants, polling/offline/device behavior, and tests. Do
not replace real data with fixtures.

Use the reference image only for hierarchy, proportions, density, spacing, and
visual tone. Do not copy navigation, raw colors, fields, permissions, APIs, or
device behavior from it.

Reuse the current application shell, `@yuta/ui`, semantic tokens,
`lucide-react`, and app-specific typography.

Apply the approved global/application/section context exactly as documented.
Do not add or replace a header, sidebar, navigation item, account area, shared
state pattern, or cross-page component absent from that context. A page-local
reference cannot authorize shared application UI.

Use the target application's viewport/device profile. Do not assume Backoffice
widths for another application.

Report files changed, preserved invariants, commands, browser/device evidence,
intentional deviations, and unresolved conflicts. Do not perform Phase 2
automatically.
