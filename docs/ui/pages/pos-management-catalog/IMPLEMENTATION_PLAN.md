# POS management catalog — Implementation Plan

Status: Implemented

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
Phase 1 was explicitly approved on 2026-08-12.

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

Phase 1 completed on 2026-08-12. The shared management header now serves both
catalogue and printing, the authenticated catalogue uses the approved dense
expandable hierarchy, and the article editor uses contained two-column desktop
sections with a stacked full-width mobile treatment. Existing live data,
session authorization, server actions, fields, confirmations, validation and
recovery behavior were preserved; no contract, permission, schema, API,
site-agent, database or device boundary changed.

Authenticated production-build evidence is recorded in `references/` at
1366 x 768 and 390 x 844 for both the catalogue and article editor. Browser QA
also verified category disclosure, the printing route after shared-header
extraction, absence of horizontal overflow, and an empty warning/error console.
Stop here for explicit Phase 2 approval.

## Phase 2 — Component refactor

Extract meaningful units by responsibility while preserving appearance and
behavior. Reuse `@yuta/ui`; do not prematurely promote feature-specific
components to the shared package.

Phase 2 was explicitly approved and completed on 2026-08-12. The route-local
client implementation is now separated by responsibility:

- `CatalogManagement.tsx` owns page-level catalogue composition only;
- `CatalogOverview.tsx` owns category disclosure, metrics and article rows;
- `CatalogCategoryDialogs.tsx` owns category, instruction-settings and
  reversible category-state mutations;
- `CatalogItemDialog.tsx` owns article editing and reversible availability;
- `CatalogDialogSupport.tsx` owns shared route-local feedback/footer behavior;
- `catalog-model.ts` owns inferred catalogue aliases and pure presentation
  helpers.

`page.tsx`, `actions.ts`, authorization, data loading, validation, transport,
revalidation and local persistence ownership were not changed. No component was
promoted to `@yuta/ui`. Stop here for explicit Phase 3 approval.

## Phase 3 — Approved interactions

Implement only approved interactions and current state transitions. Preserve
authoritative business logic and the current trusted boundary.

Phase 3 was explicitly approved and completed on 2026-08-12. It closes the
approved interaction-state gaps without changing mutation ownership:

- editor submissions use the existing Server Actions through a controlled
  transition so conflict, validation and service errors keep submitted values;
- successful category, article, settings and reversible-state mutations close
  their dialog and expose a dismissible, five-second `role="status"`
  confirmation;
- stale category/article errors expose `Actualiser` recovery metadata and use
  the existing Next.js router refresh;
- the blocking catalogue load state now offers both `Réessayer` and return to
  management;
- errors use `role="alert"`, pending buttons remain disabled through the
  existing loading behavior, and reversible actions retain confirmation and
  Escape cancellation.

No field, contract, API, permission, schema, persistence, site-agent service,
revalidation path or local runtime boundary changed. Stop here for explicit
Phase 4 approval.

## Phase 4 — Data integration or extension

Map the current domain and transport first. Existing pages normally require no
data rewrite for a visual refactor. Stop for approval before adding fields,
enums, permissions, contracts, APIs, schema/migrations, runtime dependencies,
or privileged device settings.

Phase 4 was explicitly approved and completed on 2026-08-12 as an
evidence-backed runtime no-op. The audit followed every displayed field and
mutation through:

```text
authenticated POS route / Server Action
  -> @yuta/contracts/local-pos input and response schemas
  -> site-agent client and protected catalogue route
  -> catalogue or instruction-settings service validation
  -> @yuta/db-pos menu_categories, menu_items or pos_instruction_settings
```

The current chain completely covers category identity/order/visibility and
instruction assignments; article identity/description/price/station/order,
ordering policy, variants, required choices and availability; plus local note
and allergen definitions. Existing service rules cover case-insensitive names,
missing resources, inheritance, unknown/duplicate instructions, conflicts and
variant consistency. No approved UI requirement needs another field, enum,
permission, API, schema, migration, transaction, dependency or persistence
owner.

No runtime file changed in Phase 4. Database integration tests were not required
because no query, schema, migration or database configuration changed. Stop
here for explicit Phase 5 approval.

## Functional and regression verification gate

Before Phase 5, run applicable behavior-protecting tests, target-application
typecheck/tests/build, and affected contract/domain/database/runtime/device
checks. Resolve regressions before declaring visual parity.

## Phase 5 — Visual and responsive QA

Use the target application's viewport/device matrix and operational QA
requirements only after the functional/regression gate. Run exact existing
repository checks, attach evidence, and synchronize the page package with the
as-built result.

Phase 5 was explicitly approved and completed on 2026-08-12. Authenticated
production-browser QA covered the catalogue overview at 1366 x 768,
1024 x 768, 768 x 1024 and 390 x 844, plus the article editor at the same
matrix. No page or dialog overflow was found. The editor retained its approved
two-column desktop composition and one-column tablet/mobile composition, with
the action footer visible at every tested size.

Keyboard verification confirmed initial focus inside the dialog, focus
containment after Tab and Escape dismissal at every tested viewport. The final
accessibility correction raises touch-oriented catalogue actions to a minimum
44 CSS-pixel target while retaining compact desktop controls. Final captures
and the stable page package were synchronized after the production build.

## Delivery evidence

Report files changed, protected invariants, commands/results, browser/device
evidence, deviations, blocked proposals, and risks.
