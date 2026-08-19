# POS Management Establishment

Status: Phase 0 discovery complete

Visibility: Engineering

Owner: YUTA product and engineering

Protocol revision: 4

Application: `apps/yuta-pos`

Target type: `PAGE`

Route / entry point: `/management/establishment`

Runtime family: `local POS`

Page classification: `NEW_PAGE`

Implementation class: `integrated`

Delivery mode: `NEW_CAPABILITY_DISCOVERY`

Package status: `design`

Scope status: `DRAFT`

Reference status: `NONE`

Inventory status: `COMPLETE`

Baseline status: `NOT_APPLICABLE`

Design prompt status: `READY`

Shared context status: `RESOLVED`

No-image reference reason: No page design has been generated or approved. Phase 0 stops before design generation.

## Current implementation

The route and capability do not exist. `apps/yuta-pos/src/app/management/`
contains the protected Management hub and the users, catalog, combos, and
printing routes, but no `establishment` route. The local-pos contract catalog,
site-agent route/service registry, and db-pos schema export contain no local
restaurant-profile resource or `displayName` field.

The requested first slice is a proposed local authoritative restaurant display
name. It is not the cloud establishment profile and it is not legal or fiscal
merchant identity. No runtime, contract, schema, migration, operational data,
or receipt payload was changed in Phase 0.

## Authority

1. Root, POS, site-agent, contracts, and db-pos `AGENTS.md` files.
2. `docs/CURRENT_STATE.md`, current POS product, offline, operator, and QA docs.
3. Current local-pos contracts, db-pos schemas, site-agent services/routes, and tests.
4. `docs/ui/YUTA_FRONTEND_RULES.md`, `docs/ui/POS_FRONTEND_RULES.md`, and the
   shared UI workflow documents.
5. The approved Management shell and its as-built evidence.
6. This discovery package and later explicit product/design approvals.

## Phase 0 Implementation Inventory

1. **Target:** `apps/yuta-pos`, proposed page `/management/establishment`.
2. **Type/classification:** `PAGE`, `NEW_PAGE`, proposed integrated management page.
3. **Mode:** `NEW_CAPABILITY_DISCOVERY`; the route, domain resource, persistence,
   contract, API, mutation, and receipt-name field are absent.
4. **Route/shell:** a later page would live under
   `apps/yuta-pos/src/app/management/establishment/` and reuse
   `management/_components/ManagementHeader.tsx`.
5. **Containing hub:** `management/page.tsx` composes the shared header and
   `ManagementModules.tsx`. The hub currently has four real routes and one
   unavailable reports card. It has no establishment card.
6. **Authorization:** `requireLocalManagementCredentials()` reads the HttpOnly,
   SameSite=Strict `yuta_pos_management_session`, validates it through
   site-agent, and allows active local `admin` or `manager` roles. This is local
   single-site authorization, not cloud tenancy.
7. **Logout:** `signOutManagementAction()` attempts site-agent session
   revocation, always deletes the cookie, and redirects to `/management/login`.
8. **Runtime/data boundary:** `apps/yuta-pos -> apps/site-agent -> packages/db-pos
-> local PostgreSQL`. The browser must not import db-pos or receive database
   credentials. No cloud profile is an authority or synchronization source.
9. **Nearby singleton patterns:** `print_settings` and
   `pos_instruction_settings` both use the fixed id `default`, a database check,
   ensure-on-read/upsert service behavior, Zod contracts, protected site-agent
   routes, and local management bearer authorization.
10. **Concurrency evidence:** those settings services perform unconditional
    updates/upserts. Their stored `updatedAt` is not transported or used as a
    compare-and-set token. Stale-save behavior for this capability is therefore
    a proposal, not an inherited guarantee.
11. **Requested local profile:** the architecture permits one local installation
    record with a display name, but no current schema chooses whether the first
    slice should be a dedicated `pos_establishment_profile`, a broader local
    installation record, or another supported singleton representation.
12. **Receipt snapshot:** `executeReceiptCommand()` locks the order and builds
    the first `customer_receipt` payload inside one db-pos transaction. That is
    the authoritative snapshot point for a configured restaurant display name.
13. **Receipt immutability:** retry/reprint spreads the source job payload into a
    new job rather than rebuilding it. Existing queued/printed jobs therefore
    retain their original snapshot after a profile rename.
14. **Renderer:** `customerReceiptPayloadSchema` validates payload version 1 and
    `renderCustomerReceipt()` renders only that saved payload. It currently has
    no restaurant-name line. The future renderer must omit the line when the
    snapshot is absent; it must not hard-code `YUTA`, `Luna`, or another fallback.
15. **Preview:** `buildReadOnlyCustomerReceiptPreview()` resolves a paid target,
    reads current print settings without ensuring a row, builds the production
    payload read-only, and feeds the same renderer. It creates no print job.
16. **Tests:** management auth/server tests; POS site-agent-client tests; print
    and instruction settings service/route/schema tests; receipt contract,
    financial integration, renderer, and preview tests protect adjacent behavior.
17. **Shared UI:** `ManagementHeader`, `PageHeader`, `Card`, `FormField`, `Input`,
    `Button`, `Alert`, `ErrorState`, `Skeleton`, semantic tokens, Lucide icons,
    French copy, visible focus, and touch-sized controls are available.
18. **Baseline:** `NOT_APPLICABLE` because the page is absent. Read-only
    containing-shell evidence is the current Management as-built set under
    `docs/ui/pages/pos-management-home/references/`, inspected at 1366x768 and
    390x844 without running or mutating operational data.
19. **Shared context:** `REUSE_APPROVED_SHARED_SHELL`. Preserve the dark
    Management header, account/session area, return-to-POS action, in-content
    return link, full-width operational canvas, and responsive one-column
    narrowing. Do not add a sidebar, drawer, bottom navigation, or Backoffice shell.
20. **Navigation proposal:** adding an `Établissement` card to `/management` is
    coherent with local setup ownership but remains Phase 1 product approval.
    `Rapports locaux` must remain unavailable.
21. **Required states:** loading, unconfigured, configured, editing, validation
    error, save pending, saved success, conflict/stale data, site-agent/database
    unavailable, forbidden/expired session, and retry/recovery.
22. **Protected exclusions:** legal name, address, SIRET/SIREN, VAT, fiscal
    invoice/receipt, cloud establishment profile, sync, kitchen tickets, POS
    headers, licensing, backup identity, and audit history are not approved.
23. **Exact checks:** `pnpm ui:pack:check pos-management-establishment`,
    `pnpm docs:check`, `pnpm architecture:check`,
    `pnpm -r --if-present typecheck`, and `pnpm format:check`. Later runtime work
    also requires POS/site-agent/contracts/db-pos scoped typechecks/tests, POS
    build, guarded db-pos integration tests for schema work, and receipt preview tests.

## Change impact

```text
Files expected to modify: apps/yuta-pos/src/app/management/_components/ManagementModules.tsx; packages/contracts/src/local-pos/index.ts; apps/yuta-pos/src/lib/site-agent-client.ts; apps/site-agent route/service registration; packages/db-pos schema/migration exports; customer receipt snapshot/renderer/preview code; current POS product/operator/QA docs; focused tests; this package
Files expected to create: apps/yuta-pos/src/app/management/establishment/*; a site-agent local-profile route/service; a db-pos schema migration; design and as-built references after approval
Packages affected: apps/yuta-pos, apps/site-agent, packages/contracts, packages/db-pos, docs
Cross-application impact: none; apps/backoffice and cloud persistence remain excluded
Database change: PROPOSAL
API or contract change: PROPOSAL
Permission/auth change: PROPOSAL
Runtime/device change: PROPOSAL
```

`Runtime/device change` is a proposal because the site-agent receipt snapshot
and physical receipt renderer would change; printer ownership and device routing
must not change.

## Product decisions still requiring approval

- local singleton shape and name;
- `displayName` trimming, Unicode policy, and maximum length;
- admin-only versus admin-and-manager editing;
- optimistic concurrency token and conflict semantics;
- whether update history/audit is required;
- whether blank means unconfigured and whether clearing an existing value is allowed;
- rename confirmation and saved-success behavior;
- receipt snapshot timing and payload-version compatibility;
- whether a later kitchen-ticket or POS-header consumer is allowed;
- explicit confirmation that legal/fiscal merchant identity stays excluded.

## Documents and prompt order

See `PRODUCT_SCOPE.md`, `UI_SPEC.md`, `DATA_AND_INTERACTION_SPEC.md`,
`DESIGN_HANDOFF.md`, `IMPLEMENTATION_PLAN.md`, `ACCEPTANCE_CHECKLIST.md`, and
the six phase prompts. Every later phase needs explicit product-owner approval.

## Stop condition

Stop here. Do not generate a design, add a hub card, create a route, use
fixtures, add contracts/schema/migrations, change receipt payloads/rendering, or
touch operational data until Phase 1 is explicitly approved.
