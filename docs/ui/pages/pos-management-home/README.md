# POS Management Home

Status: Phase 0 design preparation

Visibility: Engineering

Owner: YUTA product and engineering

Protocol revision: 4

Application: `apps/yuta-pos`

Target type: `SCREEN`

Route / entry point: `/management`

Runtime family: `local POS`

Page classification: `EXISTING_PAGE`

Implementation class: `integrated`

Package status: `design`

Scope status: `APPROVED`

Reference status: `APPROVED`

Inventory status: `COMPLETE`

Baseline status: `CAPTURED`

Design prompt status: `READY`

Shared context status: `RESOLVED`

## Current implementation

`apps/yuta-pos/src/app/management/page.tsx` is a protected Server Component.
It resolves the active local management session and renders five static module
cards. Four cards link to real local routes; `Rapports locaux` is explicitly
unavailable. The only mutation on the hub is the shared sign-out Server Action.
`ManagementModules.tsx` owns the route-local module inventory and its responsive
card-grid presentation.

## Authority

1. Root and `apps/yuta-pos/AGENTS.md`.
2. Current architecture, POS product, operator, offline, QA, local-development,
   and deployment documentation.
3. `docs/ui/YUTA_FRONTEND_RULES.md`, `docs/ui/POS_FRONTEND_RULES.md`,
   `docs/ui/DESIGN_TO_CODE_WORKFLOW.md`, `docs/ui/DELIVERY_WORKFLOW_MODES.md`,
   and `docs/ui/PAGE_PACK_PROTOCOL.md`.
4. Current session code, route code, contracts, site-agent behavior, and tests.
5. Approved POS Management shell and sibling-page evidence from printing,
   catalog, combos, and users.
6. This package and any later explicitly approved references.

## Phase 0 Implementation Inventory

1. **Target:** `apps/yuta-pos`, existing screen `/management`.
2. **Mode:** `EXISTING_CAPABILITY_RENEWAL`; integrated real authorization and
   navigation must be renewed in place and must not be replaced with fixtures.
3. **Route/container:** `management/page.tsx` owns session resolution, hub copy,
   module availability, and route links. `management/actions.ts` owns sign-in
   and sign-out. There is no route-local Client Component.
4. **Authorization:** the server resolves the HttpOnly, SameSite=Strict
   `yuta_pos_management_session`. Only active local `admin` and `manager`
   sessions may enter. This is single-site local auth, not cloud tenancy.
5. **State/data:** the current page receives the trusted session user and role;
   module definitions are static repository state. It performs no catalog,
   user, combo, print, report, or analytics query.
6. **Persistence/transport:** the POS browser owns no persistence. Session
   validation and sign-out use the server-only site-agent client; local session
   persistence remains site-agent/db-pos owned.
7. **Mutations:** sign-out revokes the local bearer session when possible,
   deletes the management cookie, and redirects to `/management/login`.
8. **Real destinations:** `/`, `/management/users`, `/management/catalog`,
   `/management/combos`, and `/management/printing`. `Rapports locaux` has no
   route and remains a truthful unavailable card.
9. **Polling/offline/device:** no polling, provider, printer operation, worker,
   or device interaction occurs on this screen. Local POS, site-agent, and local
   session availability are the only runtime dependencies.
10. **Shared UI:** use `ManagementHeader`, `PageHeader`, `Card`, `Badge`,
    `Button`, `IconTile`, semantic tokens, Geist Sans, visible focus, and Lucide.
    Keep the hub composition route-local.
11. **Sibling context:** printing, catalog, combos, and users now share the dark
    management header, account/sign-out menu, return-to-POS control, max-width
    content container, French operational copy, touch targets, and responsive
    one-column narrowing. Child pages also retain an in-content return link.
12. **Current conflict:** the hub still renders an older standalone `PageHeader`
    with inline return/sign-out actions instead of the approved shared header.
13. **Tests:** session/auth and server-client tests protect the management
    boundary; there is no focused hub presentation test. Later behavioral
    changes need proportional tests, while a presentation-only renewal should
    preserve the existing session and action paths.
14. **Documentation:** `docs/CURRENT_STATE.md`, POS product/operator/offline/QA
    docs, local development/deployment authority, and the shared/POS UI docs.
15. **Baseline:** authenticated current-state captures from 2026-08-13 at
    1366x768 and 390x844, using the healthy local development stack and active
    `YuTa Admin` session. No mutation was submitted.
16. **Unsupported concepts:** working reports/analytics, cloud tenancy,
    Backoffice navigation, new roles, module permissions, notification center,
    search, sidebar, drawer, bottom navigation, persistent module tabs, device
    controls, or any invented route/field/action.
17. **Expected later impact:** the hub route and this package only. Extract a
    new shared component only if responsibility-based reuse is proven.
18. **Change flags:** database `NO`; API/contract `NO`; permission/auth `NO`;
    runtime/device `NO`. Any design requiring one becomes a separate proposal.
19. **Exact checks:** `pnpm ui:pack:check pos-management-home`,
    `pnpm docs:check`, `pnpm architecture:check`,
    `pnpm -r --if-present typecheck`, `pnpm format:check`; after approved runtime
    work also run `pnpm typecheck:pos`, `pnpm test:pos`, and `pnpm build:pos`.
20. **Shell decision:** `REUSE_APPROVED_SHARED_SHELL`, owned by
    `management/_components/ManagementHeader.tsx` and approved sibling evidence.

## Protected invariants

- Preserve local-only session authorization and server-only credentials.
- Preserve exactly four real module destinations and one unavailable report card.
- Preserve truthful availability; do not turn a proposal into navigation.
- Preserve French operator copy, semantic UI, keyboard focus, and touch use.
- Keep runtime behavior and product/data boundaries unchanged in Phase 0.

## Documents and prompt order

- `PRODUCT_SCOPE.md`
- `UI_SPEC.md`
- `DATA_AND_INTERACTION_SPEC.md`
- `DESIGN_HANDOFF.md`
- `IMPLEMENTATION_PLAN.md`
- `ACCEPTANCE_CHECKLIST.md`
- `prompts/00_REPOSITORY_ANALYSIS.md` through `05_VISUAL_QA.md`

Every phase requires explicit product-owner approval before the next begins.

## Approved design references

- `references/design-proposal-01-desktop.png`: desktop management-hub proposal.
- `references/design-proposal-02-narrow.png`: narrow responsive companion.

These generated references were approved for Phase 1 hierarchy, density,
proportions, spacing, and responsive direction. Generated logo geometry,
colors, typography metrics, icons, and output dimensions remain illustrative.

## Design approval

The product owner approved the visual direction and authorized Phase 1. The
approval includes the proposed orientation copy and shared-shell reuse. It does
not authorize new routes, reports, fields, permissions, contracts, APIs,
persistence, cloud relationships, or device behavior.

## Phase 1 implementation status

Phase 1 was approved and completed on 2026-08-13. The existing authenticated
hub now reuses `ManagementHeader`, keeps user/role context and account/sign-out
in the shared shell, and presents the approved orientation header and responsive
module grid. The four real destinations and unavailable reports card are
unchanged.

The reports card uses a muted dashed treatment without an action. Available
cards retain text-backed status and full-width `Ouvrir` actions with 44-pixel
minimum height. No Client Component, shared-package primitive, route, action,
contract, API, permission, persistence, cloud, or device behavior was added.

Authenticated production-build evidence is stored at 1366x768 and 390x844.
Both viewports have zero horizontal document overflow. POS typecheck, all 44
POS tests, and the POS production build passed.

## Phase 2 implementation status

Phase 2 was approved and completed on 2026-08-13. The refactor follows business
responsibility rather than line count: `page.tsx` owns trusted session
resolution, shared shell, orientation header, and route composition;
`ManagementModules.tsx` owns the static module inventory, availability
presentation, module cards, and responsive grid.

Both files remain Server Components. No feature component moved into
`@yuta/ui`, and no Client Component, state layer, abstraction package, route,
action, contract, API, permission, persistence, cloud, or device behavior was
introduced. Authenticated production-build regression at 1366x768 and 390x844
confirmed the same four real module links, no reports link, unchanged
orientation copy, zero horizontal overflow, and an empty browser console.

## Stop conditions

Stop for any new route, working report, field, role, permission, contract, API,
schema, persistence, cloud relationship, device behavior, or session/auth change.
