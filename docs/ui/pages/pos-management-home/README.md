# POS Management Home

Status: Implemented and QA verified

Visibility: Engineering

Owner: YUTA product and engineering

Prompt snapshot topology: GENERATED_SNAPSHOTS

Prompt provenance: prompt-provenance.json

Protocol revision: 4

Application: `apps/yuta-pos`

Target type: `SCREEN`

Route / entry point: `/management`

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

## Change impact

```text
Files expected to modify: apps/yuta-pos/src/app/management/page.tsx, apps/site-agent/test/server.test.ts, and the stable docs/ui/pages/pos-management-home package
Files expected to create: apps/yuta-pos/src/app/management/ManagementModules.tsx and authenticated design/implementation/as-built reference images
Packages affected: apps/yuta-pos, apps/site-agent test coverage, and docs/ui/pages/pos-management-home
Cross-application impact: site-agent HTTP boundary test coverage only; no production cross-application behavior change
Database change: NO
API or contract change: NO
Permission/auth change: NO
Runtime/device change: NO
```

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

## Phase 3 interaction status

Phase 3 was approved and completed on 2026-08-13 without a runtime-code change.
Authenticated production-build QA verified that the four module links retain
their exact destinations, the reports card contains no link or button, and the
first module navigates to `/management/users`. The account menu opens by
keyboard, Escape closes it and restores focus to the `Admin` trigger, and the
sign-out menu item remains present without submitting the destructive action.

At 390x844, Return-to-POS, account, all module actions, and the sign-out item
measure at least 44 CSS pixels. The shared brand/home link measures 40 pixels;
this is an existing approved-shell detail shared by all management routes and
is not changed route-locally in this phase. The page retains zero horizontal
overflow and an empty browser warning/error console.

An unauthenticated request to both `/management` and `/management/users`
returns `307` to `/management/login`, confirming the fail-closed missing-session
state. A real sign-out was intentionally not submitted because it would revoke
the active local acceptance session; its existing Server Action path remains
covered by source and prior management-session behavior.

## Phase 4 integration audit status

Phase 4 was approved and completed on 2026-08-13. The complete read path is:
HttpOnly `yuta_pos_management_session` cookie -> Next.js server-only session
resolver -> bearer `GET /api/v1/auth/session` -> strict local-pos contract ->
site-agent auth service -> hashed-token lookup in db-pos. A valid result must
be unrevoked, unexpired, attached to an active user, and match that user's
current `authVersion`; the hub then additionally allows only `admin` or
`manager`. Any missing, invalid, expired, revoked, inactive, stale-version, or
service-error result fails closed to `/management/login`.

The sign-out path is: shared account-menu form -> Server Action -> optional
bearer `DELETE /api/v1/auth/session` -> hashed-token `revoked_at` update ->
unconditional cookie deletion -> `/management/login`. Logout remains
idempotent when no bearer is supplied, and a site-agent revocation failure does
not prevent local cookie cleanup.

No browser bundle receives a bearer token, database driver, URL, hash, or
trusted role input. No cloud database, tenant, organization, establishment, or
membership participates. Phase 4 changed no production code, contract, API,
schema, permission, session policy, or persistence behavior. It added one
site-agent HTTP boundary test proving authenticated revocation delegation and
anonymous logout idempotency.

Site-agent, POS, contracts, and db-pos scoped typechecks/tests pass. Database
integration suites remain intentionally skipped because this phase was not
given a disposable `POS_DATABASE_URL` plus
`YUTA_ALLOW_DATABASE_INTEGRATION_TESTS=true`; the persisted revoke update was
verified from the current service/schema implementation rather than claimed as
a live database run.

## Final delivery and as-built status

Phase 5 was approved and completed on 2026-08-13. Functional regression ran
before visual review and confirmed all four real module destinations, the
non-interactive reports state, keyboard account-menu opening, Escape focus
return, sign-out affordance, and fail-closed missing-session redirects.

Authenticated production-build evidence covers 1366x768, 1024x768, 768x1024,
and 390x844. Every viewport renders five modules, four available actions, and
zero horizontal document overflow. The complete hub fits without vertical
scrolling at 1366x768 and 1024x768; 768x1024 fits the complete two-column
composition; 390x844 uses deliberate one-column vertical scrolling.

All route-local module actions remain at least 44 CSS pixels high. The shared
header uses 40-pixel Return-to-POS/account controls only at the desktop
`xl` breakpoint and 44 pixels at 1024 and below. Its narrow brand/home link
remains 40 pixels, as recorded in Phase 3. These are existing approved-shell
details and were not changed route-locally.

The first verification origin exposed stale cached chunks left by prior builds
on the reused port. Final evidence and the complete functional/viewport pass
were rerun on a fresh origin; browser warning/error collection was empty. The
final rasters preserve repository French copy, semantic tokens, shared-shell
ownership, real routes, and the approved unavailable-state treatment.

POS typecheck, 44 POS tests, the POS production build, site-agent typecheck and
38 active tests, contracts and db-pos checks, workspace typecheck, docs,
architecture, page-pack validation, formatting of affected files, and diff
validation pass. Guarded database integration remains explicitly outside this
run. As-built documentation status: `COMPLETE`.

## Stop conditions

Stop for any new route, working report, field, role, permission, contract, API,
schema, persistence, cloud relationship, device behavior, or session/auth change.
