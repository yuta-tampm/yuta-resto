# POS management combos

Status: Implemented and approved

Visibility: Engineering

Owner: YUTA product and engineering

Protocol revision: 4

Application: `apps/yuta-pos`

Target type: `PAGE`

Route / entry point: `/management/combos`

Runtime family: `local POS`

Page classification: `EXISTING_PAGE`

Implementation class: `integrated`

Package status: `implemented`

Scope status: `APPROVED`

Reference status: `APPROVED`

Inventory status: `COMPLETE`

Baseline status: `CAPTURED`

Design prompt status: `READY`

Shared context status: `RESOLVED`

## Target

- Application: `apps/yuta-pos`
- Route: `/management/combos`
- Page slug: `pos-management-combos`
- Operator language: French
- Runtime boundary: local restaurant POS only

This package governs the existing authenticated combo-rule management page. It
does not authorize a replacement implementation, fixture data, cloud storage,
or a new combo domain.

## Current implementation

The existing Server Component route requires a validated local admin or
manager session and loads the real local catalogue through `site-agent`.
`ComboManagement.tsx` owns page-level client orchestration and the empty state;
`ComboOverview.tsx` owns rule/group disclosure and eligible-item rows;
`ComboRuleDialogs.tsx` owns rule editing and activation;
`ComboGroupDialogs.tsx` owns group and eligible-item editors; and
`ComboDialogSupport.tsx` owns route-local feedback, confirmation, and dialog
lifecycle helpers. `combo-model.ts` contains serialization-derived UI types and
pure price-summary formatting only.

This Phase 2 decomposition preserves the Phase 1 hierarchy and every existing
Server Action binding. It does not alter transport, validation, persistence,
pricing, authorization, or mutation semantics, and it adds no shared primitive.

Phase 3 keeps dialog headers and action footers visible while long editor fields
scroll inside the viewport, associates every route-local field label with its
control, prevents dismiss/cancel while a submission is pending, and exposes an
`Actualiser` recovery for stale rule/group/item references. Inline validation,
conflict, unavailable-service, confirmation, and close-on-success semantics
remain driven by the existing Server Actions.

Phase 4 re-audited the complete local integration chain without changing
runtime code: the authenticated page and Server Actions, shared Zod contracts,
bearer-authenticated site-agent mutations, db-pos transaction ownership,
route revalidation, `@yuta/core` calculation, and order/check discount snapshots
remain aligned. Focused contract and guarded database integration tests now
protect combo management and persistence behavior directly.

Phase 5 verified the authenticated as-built page at `1366 x 768`,
`1024 x 768`, `768 x 1024`, and `390 x 844`. All four viewports have zero
document-level horizontal overflow. Keyboard disclosure, visible focus, dialog
initial focus, required-field blocking, Escape dismissal, focus return, active
locks, and viewport-contained dialog scrolling were verified without creating
or changing combo data. Route-local action triggers now expose a minimum
`44 x 44` touch target; shared-shell sizing remains owned by
`ManagementHeader.tsx`.

## Protected invariants

- Preserve the local-only `yuta-pos -> site-agent -> db-pos` ownership chain.
- Keep the trusted HttpOnly management session and server-side bearer
  forwarding unchanged.
- Preserve real runtime data, shared Zod contracts, service validation, and
  route revalidation.
- Keep active-rule structural locks, activation requirements, pricing modes,
  priority, maximum applications, group quantities/order, eligible-item
  supplements, and no-hard-delete behavior.
- Keep combos as payment discounts rather than kitchen production items, and
  preserve historical discount snapshots.

## Authority order

1. root and `apps/yuta-pos/AGENTS.md`;
2. `docs/CURRENT_STATE.md` and `docs/products/pos/*`;
3. `docs/ui/DESIGN_TO_CODE_WORKFLOW.md`, `PAGE_PACK_PROTOCOL.md`,
   `YUTA_FRONTEND_RULES.md`, and `POS_FRONTEND_RULES.md`;
4. current contracts, site-agent services, db-pos schema/repositories, code,
   and tests;
5. this package;
6. visual references for hierarchy, density, proportion, spacing, and tone
   only.

## Implementation Inventory

1. **Target:** local POS page `apps/yuta-pos`, real route
   `/management/combos`.
2. **Target type:** `PAGE`.
3. **Maturity:** `EXISTING_PAGE`.
4. **Implementation class:** `integrated`; it loads real local catalogue and
   combo data and submits real mutations.
5. **Route and container:** `management/combos/page.tsx` owns session gating,
   loading, service failure, page header, and composition;
   `ComboManagement.tsx` owns the client-side rule/group/item UI and dialogs.
6. **Shell:** the page now reuses the approved POS Management
   `management/_components/ManagementHeader.tsx` used by catalog and printing,
   with the route-local title and actions retained in the content area.
7. **Auth/session:** the HttpOnly `yuta_pos_management_session` cookie is read
   on the Next.js server and validated through site-agent. Only active local
   `admin` and `manager` sessions may enter. Browser-supplied roles are not
   trusted.
8. **Data owner:** `apps/site-agent` owns combo management and accesses
   `@yuta/db-pos`; data remains in local PostgreSQL. There is no organization,
   establishment, tenant, or cloud synchronization boundary here.
9. **Load transport:** the protected page calls
   `siteAgentClient.getCatalog()` and consumes the Zod-validated
   `LocalCatalogResponse`, including categories/items and combo rules/groups.
10. **Mutation transport:** Next.js Server Actions validate `FormData` with
    `@yuta/contracts/local-pos`, recover the trusted bearer token server-side,
    call the existing site-agent endpoints, and revalidate
    `/management/combos` and the order layout.
11. **Current mutations:** create/update an inactive rule, update rule-level
    fields, activate/deactivate a rule, create/update/delete a group, and
    create/update/delete an eligible group item. Rules are deactivated rather
    than deleted.
12. **Validation:** names, money, priority, quantities, maximum applications,
    identifiers, and request shapes are validated by shared Zod contracts;
    site-agent also enforces name uniqueness, inactive structural editing,
    valid group quantities, required structure, and valid base pricing group.
13. **Transaction owner:** site-agent owns persistence. Group deletion removes
    its item mappings and group in a db-pos transaction. UI code does not open
    database transactions.
14. **Polling/offline/device:** none. There is no polling, printer, provider, or
    device behavior. When site-agent cannot be loaded, the page truthfully
    renders `Site-agent indisponible`; there is no offline mutation queue.
15. **Current UI:** `PageHeader`, `IconTile`, `Card`, `Badge`, `Button`,
    `Dialog`, `ConfirmDialog`, `FormField`, `Input`, `Select`, `Alert`, semantic
    tokens, and Lucide icons from the approved stack.
16. **Current states:** populated and empty rule lists, rules with/without
    groups, groups with/without eligible items, active/inactive badges,
    disabled structural controls for active rules, pending actions, inline
    validation/service/conflict errors, confirmation dialogs, dialog close on
    success, invalid-session redirect, and site-agent-unavailable fallback.
17. **Baseline:** authenticated populated desktop and rule-editor captures are
    recorded under `references/`; no mutation was submitted for capture.
18. **Tests:** `apps/yuta-pos/test/site-agent-client.test.ts` protects bearer
    forwarding and validated combo endpoints; `apps/site-agent/test/server.test.ts`
    protects authorization and boundary validation; db-pos schema/seed tests
    protect combo persistence; core and payment tests protect combo calculation
    and split-payment behavior.
19. **Current docs:** `docs/products/pos/PRODUCT_SPEC.md`, `README.md`,
    `USER_GUIDE.md`, `QA_CHECKLIST.md`, and the POS UI rules are authoritative.
20. **Protected invariants:** combos are payment discounts, never kitchen
    production items; item quantities are not reused across matches; pricing
    and discount snapshots remain historically accurate; active rules lock
    group/item structure; activation requires a valid structure; rule deletion
    is unavailable; local authorization, bearer forwarding, contract/service
    validation, db-pos ownership, and real revalidation remain unchanged.
21. **Phase 1 resolution:** the route now renders the approved shared
    `ManagementHeader`. Page-local rule/group disclosures reduce scan and
    scroll cost while preserving every real record and action; one rule and
    one group are expanded by default, and long eligible-item lists can be
    expanded from a three-item preview.
22. **Unsupported proposals:** search/filtering, drag ordering, bulk edits,
    rule duplication, analytics, cloud sync, tenant switching, new roles,
    kitchen routing, automatic activation, hard deletion, new routes, and new
    schema/contract fields require separate approval.
23. **Exact shell mode:** `REUSE_APPROVED_SHARED_SHELL`; details and real-route
    inventory are in `DESIGN_HANDOFF.md`.

Fixture replacement remains forbidden. Phase 1 refactored the real route in
place and preserved every loader, action, validation rule, mutation, and test.

## Change impact

```text
Files expected to modify: apps/yuta-pos/src/app/management/combos/page.tsx, apps/yuta-pos/src/app/management/combos/ComboManagement.tsx, packages/contracts/test/contracts.test.ts, and this page package
Files expected to create: route-local overview, editor, dialog-support, presentation-model modules, and focused combo integration tests proven by the phased implementation
Packages affected: apps/yuta-pos and docs/ui only
Cross-application impact: none
Database change: NO
API or contract change: NO
Permission/auth change: NO
Runtime/device change: NO
```

## Design approval

Product-owner approval to begin Phase 1 was recorded on 2026-08-13. The
generated proposals are approved only for hierarchy, density, disclosure, and
responsive direction. Repository-owned components, semantic tokens, French
copy, live data, permissions, and behavior remain authoritative over raster
details.

## Verification commands

```bash
pnpm ui:pack:check pos-management-combos
pnpm docs:check
pnpm architecture:check
pnpm typecheck:pos
pnpm test:pos
pnpm typecheck:site-agent
pnpm test:site-agent
pnpm typecheck:db-pos
pnpm test:db-pos
pnpm -r --if-present typecheck
pnpm format:check
pnpm build:pos
```

Phase 0 documentation changes use the pack, documentation, architecture,
typecheck, and formatting checks. Behavior tests and the production build are
mandatory when later phases change runtime code.

## Final delivery and as-built status

Product-owner approval of Phase 5 and the final as-built delivery was recorded
on 2026-08-13.

Final implementation remains in the existing
`apps/yuta-pos/src/app/management/combos/` route and its route-local components.
Phase 5 added only touch-target styling to existing rule, group, item, toggle,
and delete triggers; it introduced no field, mutation, contract, API,
permission, schema, persistence, device dependency, or cloud relationship.

Functional/regression QA passes for POS, site-agent, db-pos, contracts, and
core. The POS production build, page-pack validation, documentation check,
architecture check, monorepo typecheck, and scoped formatting also pass. The
guarded database integration evidence from Phase 4 remains authoritative for
management and discount persistence.

Authenticated production-browser evidence covers `1366 x 768`, `1024 x 768`,
`768 x 1024`, `390 x 844`, and the narrow editor. It verifies zero horizontal
overflow, 44 CSS-pixel route-local action targets, visible keyboard focus,
keyboard disclosure, initial and returned dialog focus, required validation,
dialog containment, and active locks. No combo record was mutated for visual
evidence.

Intentional deviations preserve repository truth: generated raster styling is
not copied over semantic tokens or shared components, real local data replaces
sample content, and the narrow layout stacks cards and actions more strongly
than the table-like proposal. Concurrent management-write hardening remains a
separately documented service/database risk requiring separate approval.

As-built documentation status: `COMPLETE`

## Package documents

- `PRODUCT_SCOPE.md` — approved capability and exclusions.
- `UI_SPEC.md` — current baseline and intended visual direction.
- `DATA_AND_INTERACTION_SPEC.md` — real field/action mapping and states.
- `DESIGN_HANDOFF.md` — shared context, baseline metadata, and ready prompt set.
- `IMPLEMENTATION_PLAN.md` — gated six-phase plan.
- `ACCEPTANCE_CHECKLIST.md` — review and delivery gates.
- `references/README.md` — visual evidence inventory.
- `prompts/00_REPOSITORY_ANALYSIS.md` through `05_VISUAL_QA.md` — one prompt per
  phase.

## Stop conditions

- Stop before every phase until the product owner approves it.
- Do not treat generated references as approved until the product owner accepts
  the visual direction and documented deviations.
- Stop if a design changes shell ownership, routes, fields, contracts, auth,
  persistence, pricing semantics, or active-rule locks.
- Stop if real-data/browser evidence cannot be preserved.
