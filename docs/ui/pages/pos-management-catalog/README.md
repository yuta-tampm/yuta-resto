# POS Management Catalog

Status: Approved design package

Visibility: Engineering

Owner: YUTA product and engineering

Protocol revision: 4

Application: `apps/yuta-pos`

Target type: `SCREEN`

Route / entry point: `/management/catalog`

Runtime family: `local POS`

Page classification: `EXISTING_PAGE`

Implementation class: `integrated`

Package status: `implementation-ready`

Scope status: `APPROVED`

Reference status: `APPROVED`

Inventory status: `COMPLETE`

Baseline status: `CAPTURED`

Design prompt status: `READY`

Shared context status: `RESOLVED`

No-image reference reason: Not applicable; proposals 01 and 02 are approved as
visual-direction references with documented raster text/data deviations.

## Current implementation

The existing Server Component route is
`apps/yuta-pos/src/app/management/catalog/page.tsx`. It requires a validated
local admin or manager session, loads the local catalogue from `site-agent`,
shows a truthful service-unavailable recovery state, and renders the
route-local composition in `CatalogManagement.tsx`. Catalogue disclosure,
category/settings dialogs, article editing, shared dialog feedback and pure
presentation helpers remain separate route-local modules in the same folder.

The screen manages categories, articles, prices, kitchen stations, display
order, visibility/availability, note and allergen definitions,
category/article instruction assignments, ordering policy, per-portion variant
options, and required option quantities. Server actions validate transport
input with `@yuta/contracts/local-pos`, forward the HttpOnly management session
token from the Next.js server to `site-agent`, and revalidate the catalogue,
order-entry, and order routes after successful writes.

## Authority

Read in order:

1. root `AGENTS.md`;
2. `apps/yuta-pos/AGENTS.md`;
3. `docs/CURRENT_STATE.md`, POS product/operator/offline/QA and local operations
   documentation;
4. `docs/ui/README.md`, `docs/ui/DESIGN_TO_CODE_WORKFLOW.md`, and
   `docs/ui/YUTA_FRONTEND_RULES.md`;
5. implemented contracts, schema, session authorization, service logic, and
   tests;
6. `docs/ui/POS_FRONTEND_RULES.md`;
7. this page package;
8. `packages/ui/src/index.ts` and semantic tokens;
9. reviewed visual references.

## Documents

- `PRODUCT_SCOPE.md`
- `UI_SPEC.md`
- `DATA_AND_INTERACTION_SPEC.md`
- `DESIGN_HANDOFF.md`
- `IMPLEMENTATION_PLAN.md`
- `ACCEPTANCE_CHECKLIST.md`

## References

- `references/current-baseline-1366x768.png` — authenticated populated top
  viewport.
- `references/current-baseline-1366x768-full-page.png` — authenticated complete
  current catalogue.
- `references/current-baseline-edit-item-dialog-1366x768.png` — authenticated
  edit-item dialog opened without submitting a mutation.
- `references/design-proposal-01.png` — approved catalogue overview direction.
- `references/design-proposal-02.png` — approved article-editor direction.

The baseline captures are current implementation evidence. The generated
proposals are approved only for shell, hierarchy, density, responsive behavior,
state treatment, category disclosure, and editor composition. Current runtime
data, contracts, French copy, prices, names, counts, and business behavior
remain authoritative over raster text.

## Shared UI context

- **YUTA global:** reuse `@yuta/ui`, semantic tokens, `YutaBrandMark`, Geist
  Sans with the approved fallback, Lucide icons, visible focus, textual states,
  and accessible touch targets. The Backoffice shell shown in the shared brand
  reference is excluded from this local POS screen.
- **POS application:** preserve the local operational tone, French copy,
  validated local management session, and the existing dark management-header
  direction proven by `/management/printing`.
- **POS Management section:** shell mode is
  `REUSE_APPROVED_SHARED_SHELL`. Use a compact dark top header with YUTA POS
  identity, `Gestion locale`, signed-in user/role context, `Retour au POS`, and
  the existing account/sign-out menu. Use no left sidebar. `/management` remains
  the module hub; child pages expose `Retour à la gestion` in page content.
- **Catalogue page:** proposal 01 covers the overview and proposal 02 covers the
  editor only. They may adapt responsive density and grouping, but may not
  invent navigation, fields, drag persistence, sample data, routes, or states.

Allowed real destinations are `/`, `/management`, `/management/users`,
`/management/catalog`, `/management/combos`, and `/management/printing`.
`Rapports locaux` is unavailable and has no route. The catalogue design must
not add a module sidebar, mobile drawer, permanent module tabs, or links to
unimplemented areas. The currently route-local printing header is source
evidence for the approved direction; any runtime extraction or reuse belongs
to a later approved implementation phase.

## Protected invariants

- Keep the local-only chain `apps/yuta-pos -> apps/site-agent -> @yuta/db-pos`;
  do not introduce cloud tenancy, persistence, or synchronization.
- Require the existing HttpOnly `yuta_pos_management_session`, validated by
  `site-agent`, and allow only active `admin` or `manager` roles.
- Keep bearer credentials server-side and preserve Zod validation in
  `@yuta/contracts/local-pos` plus authoritative service/database validation.
- Preserve no-hard-delete behavior: categories are hidden and articles are
  made unavailable so historical orders remain truthful.
- Preserve category/article uniqueness, instruction assignment/conflict rules,
  variant-code and required-quantity rules, kitchen stations, ordering policy,
  integer-cent prices, and UUIDv7 service-created identifiers.
- Preserve the current effect boundary: successful changes appear on the next
  POS server render and revalidate `/management/catalog`, `/pos`, and the
  `/orders` layout.
- Preserve truthful empty, pending, success, validation, conflict, not-found,
  and site-agent-unavailable states. Do not replace real data with fixtures.

## Change impact

```text
Files expected to modify: apps/yuta-pos/src/app/management/catalog/page.tsx, apps/yuta-pos/src/app/management/catalog/CatalogManagement.tsx, apps/yuta-pos/src/app/management/printing/page.tsx, and this stable page package
Files expected to create: apps/yuta-pos/src/app/management/_components/ManagementHeader.tsx; route-local catalogue components may be proposed in Phase 2
Packages affected: apps/yuta-pos; documentation only in Phase 0
Cross-application impact: none; cross-route POS Management header reuse affects catalogue and printing only
Database change: NO
API or contract change: NO
Permission/auth change: NO
Runtime/device change: NO
```

## Phase 0 Implementation Inventory

1. **Target application and route:** `apps/yuta-pos`, `/management/catalog`.
2. **Target type:** `SCREEN`.
3. **Classification:** `EXISTING_PAGE`.
4. **Implementation class:** `integrated`; the Next.js route uses the local
   authenticated `site-agent` transport and local POS persistence, with no
   direct device coupling or polling.
5. **Route/shell/container and conventions:** `page.tsx` is the Server Component
   gate/loader; `CatalogManagement.tsx` is the route-local Client Component;
   `actions.ts` owns Server Actions. The screen composes `@yuta/ui`, semantic
   tokens, Lucide icons, French copy, dialogs, confirm dialogs, action state,
   and server revalidation. Nearby management routes use the same local session
   and route-local components.
6. **Trust boundary:** `requireLocalManagementSession()` reads the HttpOnly
   cookie and validates it through `site-agent`; only active admin/manager
   sessions proceed. This is single-site local infrastructure, not cloud
   organization/establishment tenancy.
7. **Data owner/persistence:** `apps/site-agent` owns catalogue operations;
   `packages/db-pos` owns `menu_categories`, `menu_items`, and singleton
   `pos_instruction_settings` in local PostgreSQL.
8. **Transport/contracts:** `packages/contracts/src/local-pos/index.ts` owns
   local routes, response schemas, create/update input schemas, kitchen station
   and ordering-policy enums, instruction/variant structures, and
   serialization-safe types. `site-agent-client.ts` validates responses and
   sends bearer-authenticated management mutations.
9. **Loading/actions/mutations:** the route calls `getCatalog()` and renders an
   `ErrorState` if the local service cannot load. Server Actions create/update
   categories and articles, update local instruction settings, toggle category
   visibility, and toggle article availability. Input is parsed from
   `FormData`, validated by Zod, forwarded to `site-agent`, then the catalogue,
   POS, and order layout are revalidated.
10. **Polling/offline/retry/device:** there is no page polling, provider, printer,
    worker, or device interaction. The screen requires the local Next.js server,
    LAN/local service, and POS database; Internet and cloud services are not
    required. Local-service failure is a truthful blocking state with return
    navigation.
11. **Reusable UI:** current `PageHeader`, `IconTile`, `Card`, `Alert`, `Badge`,
    `Button`, `Dialog`, `ConfirmDialog`, `FormField`, `Input`, `Textarea`, and
    `Select` are already exported by `@yuta/ui`. Reuse them before adding
    route-local components; do not add a shared primitive without independent
    domain-neutral reuse.
12. **Tests:** `apps/yuta-pos/test/site-agent-client.test.ts` protects response
    validation and bearer-authenticated catalogue mutations;
    `apps/site-agent/test/server.test.ts` protects management authorization,
    route validation, and instruction settings;
    `packages/contracts/test/contracts.test.ts` protects ordering-policy and
    variant validation; `packages/db-pos/test/schema.test.ts` protects catalogue
    schema support; order-entry validation tests protect downstream variant
    behavior.
13. **Authoritative docs:** root and POS `AGENTS.md`, `docs/CURRENT_STATE.md`,
    `docs/products/pos/README.md`, `PRODUCT_SPEC.md`, `USER_GUIDE.md`,
    `OFFLINE_STRATEGY.md`, `QA_CHECKLIST.md`, `docs/operations/LOCAL_DEVELOPMENT.md`,
    and shared/POS UI governance.
14. **Protected invariants:** local-only ownership, trusted role/session,
    server-only credential forwarding, real integrated data, no hard delete,
    validated catalogue/instruction/variant rules, downstream order-entry
    behavior, and current revalidation semantics.
15. **Baseline evidence:** captured on 2026-08-09 at 1366 × 768 from the real
    authenticated populated page. It shows 12 categories and 53 catalogue rows,
    including the unavailable zero-price Saturday special, plus the current
    scrollable item editor. See `DESIGN_HANDOFF.md` for runtime conditions.
16. **Current design conflicts:** no supplied mockup exists yet. The current
    page is a very long undifferentiated stack and the item editor is a tall
    single-column dialog, but any visual simplification must retain every field,
    action, status, and recovery path.
17. **Unsupported concepts:** image/media upload, stock/inventory, tax or cost
    accounting, physical deletion, drag-and-drop persistence, bulk actions,
    search/filter/category navigation, import/export, scheduling, modifiers
    beyond current instruction/variant contracts, combo editing, cloud sync,
    new roles, audit history, and analytics require separate approval.
18. **Expected impact:** Phase 0 changes only this documentation package and
    baseline images. A later approved UI pass should remain route-local and
    affect no other application.
19. **Change flags:** database `NO`; API/contract `NO`; permission/auth `NO`;
    runtime/device `NO`.
20. **Exact verification commands:** `pnpm ui:pack:check pos-management-catalog`,
    `pnpm docs:check`, `pnpm architecture:check`,
    `pnpm -r --if-present typecheck`, and `pnpm format:check`. Later runtime work
    also requires `pnpm typecheck:pos`, `pnpm test:pos`, `pnpm build:pos`,
    `pnpm typecheck:site-agent`, `pnpm test:site-agent`, and affected contract or
    db-pos checks when those boundaries are touched.
21. **Later-phase candidate files:**
    `apps/yuta-pos/src/app/management/catalog/page.tsx`,
    `CatalogManagement.tsx`, the printing page/header import, a shared
    POS Management header component, `actions.ts` only if approved interaction
    behavior needs it, possible route-local components in the catalogue
    directory, and this page package. Fixture replacement is forbidden.

## Design approval

Product-owner approval recorded on 2026-08-11. Proposal 01 is approved for the
catalogue overview and proposal 02 for the article editor. Approval is limited
to visual direction; documented raster deviations include the incorrect
`13,60 €` Mix LUNA price in proposal 01, inaccurate generated item descriptions
in proposal 02, and internal `design-proposal-03/04` labels that do not match the
stored filenames. Implementation must use live catalogue data, current
contracts, and repository-owned French copy instead of those pixels.

## Prompt order

1. `prompts/00_REPOSITORY_ANALYSIS.md`
2. `prompts/01_VISUAL_BASELINE.md`
3. `prompts/02_COMPONENT_REFACTOR.md`
4. `prompts/03_INTERACTIONS.md`
5. `prompts/04_DATA_INTEGRATION.md`
6. `prompts/05_VISUAL_QA.md`

Each phase requires explicit product-owner approval before the next begins.

## Stop conditions

Stop and request approval for any new product capability, field, enum,
permission, contract, API, schema/migration, runtime dependency, local-service
behavior, cloud relationship, destructive behavior, or change to a protected
catalogue/order-entry invariant.

## Phase 1 implementation status

Phase 1 was approved and completed on 2026-08-12. The real authenticated route
now reuses the POS Management header with `/management/printing`, presents live
categories and articles in the approved dense disclosure hierarchy, and uses
the approved contained article editor at desktop and mobile widths. All
existing fields, server actions, confirmations, validation, recovery states and
local POS boundaries remain intact.

Authenticated production-build evidence is available in `references/` for the
catalogue and editor at 1366 x 768 and 390 x 844. The browser pass also verified
category expansion, no horizontal overflow, the printing route after header
reuse, and no console warnings or errors.

## Phase 2 implementation status

Phase 2 was approved and completed on 2026-08-12 without changing the Phase 1
appearance or behavior. The previous monolithic client module was separated
into page composition, catalogue overview, category/settings dialogs, article
editor, dialog support and pure model/formatting helpers. These boundaries
follow state and mutation ownership rather than creating thin wrappers.

The trusted Server Component, `actions.ts`, live data, contracts, validation,
confirmations, pending/error behavior, authorization, site-agent transport and
revalidation remain unchanged. All extracted components stay route-local; no
feature component was promoted to `@yuta/ui`.

Phase 3 has not started and requires explicit product-owner approval.

As-built documentation status: `PHASE_2_REVIEW_PENDING`
