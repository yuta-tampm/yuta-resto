# POS management combos

Status: Phase 0 complete; awaiting design approval

Visibility: Engineering

Owner: YUTA product and engineering

Protocol revision: 4

Application: `apps/yuta-pos`

Target type: `PAGE`

Route / entry point: `/management/combos`

Runtime family: `local POS`

Page classification: `EXISTING_PAGE`

Implementation class: `integrated`

Package status: `design`

Scope status: `REVIEWED`

Reference status: `NONE`

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
6. **Shell:** the current page has only a route-local `PageHeader`. The approved
   POS Management shell is `management/_components/ManagementHeader.tsx`, now
   used by catalog and printing. Phase 1 may align combos to that shell only
   after approval.
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
21. **Conflict/gap:** the current combos page does not yet render the approved
    shared `ManagementHeader` used by catalog and printing. The current long
    fully expanded list also creates substantial scan and scroll cost. These
    are UI opportunities, not authorization to change the data model.
22. **Unsupported proposals:** search/filtering, drag ordering, bulk edits,
    rule duplication, analytics, cloud sync, tenant switching, new roles,
    kitchen routing, automatic activation, hard deletion, new routes, and new
    schema/contract fields require separate approval.
23. **Exact shell mode:** `REUSE_APPROVED_SHARED_SHELL`; details and real-route
    inventory are in `DESIGN_HANDOFF.md`.

Fixture replacement is forbidden. Later phases must refactor the real route in
place and preserve every loader, action, validation rule, mutation, and test.

## Expected later-phase impact

Files expected to modify:
`apps/yuta-pos/src/app/management/combos/page.tsx`,
`apps/yuta-pos/src/app/management/combos/ComboManagement.tsx`, and this package.

Files expected to create: route-local presentation components only if Phase 2
proves a clear responsibility boundary.

Packages affected: `@yuta/pos`; documentation under `docs/ui`.

Cross-application impact: none.

Database change: NO

API or contract change: NO

Permission/auth change: NO

Runtime/device change: NO

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
- Do not run ImageGen until the Phase 0 prompt/context bundle is approved.
- Stop if a design changes shell ownership, routes, fields, contracts, auth,
  persistence, pricing semantics, or active-rule locks.
- Stop if real-data/browser evidence cannot be preserved.
