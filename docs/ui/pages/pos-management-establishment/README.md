# POS Management Establishment

Status: Phase 5 as-built QA complete

Visibility: Engineering

Owner: YUTA product and engineering

Prompt snapshot topology: GENERATED_SNAPSHOTS

Prompt provenance: prompt-provenance.json

Protocol revision: 4

Application: `apps/yuta-pos`

Target type: `PAGE`

Route / entry point: `/management/establishment`

Runtime family: `local POS`

Page classification: `NEW_PAGE`

Implementation class: `integrated`

Delivery mode: `NEW_CAPABILITY_DISCOVERY`

Package status: `implemented`

Scope status: `APPROVED`

Reference status: `APPROVED`

Inventory status: `COMPLETE`

Baseline status: `NOT_APPLICABLE`

Design prompt status: `READY`

Shared context status: `RESOLVED`

## Current implementation

`/management/establishment` is now an integrated local Management route linked
from the hub. The authenticated Server Component reads the local profile through
the server-only site-agent client; the client form supports unconfigured and
configured states, validation, dirty state, pending/success/error feedback,
input preservation, reset, and revision-conflict recovery.

`packages/db-pos` owns the fixed-id `pos_establishment_profiles` singleton.
`@yuta/contracts/local-pos` validates a trimmed Unicode display name of 1–80
characters without control characters, plus the optimistic integer revision.
Protected GET/PATCH site-agent routes allow active local `admin` and `manager`
sessions. Blank/clear is not supported and no audit history is stored.

Initial customer-receipt creation reads the profile inside the existing locked
receipt transaction and stores the optional normalized display name in the
immutable version-1 payload. The renderer centers the name when present and
uses no fallback when absent. Retry/reprint keep copying the source payload, so
renames do not rewrite old receipts. This identity is local, non-legal,
non-fiscal, and never synchronized to cloud persistence.

## Authority

1. Root, POS, site-agent, contracts, and db-pos `AGENTS.md` files.
2. `docs/CURRENT_STATE.md`, current POS product, offline, operator, and QA docs.
3. Current local-pos contracts, db-pos schemas, site-agent services/routes, and tests.
4. `docs/ui/YUTA_FRONTEND_RULES.md`, `docs/ui/POS_FRONTEND_RULES.md`, and the
   shared UI workflow documents.
5. The approved Management shell and its as-built evidence.
6. This discovery package and later explicit product/design approvals.

## Protected invariants

- Keep `apps/yuta-pos -> apps/site-agent -> @yuta/db-pos` local-only ownership.
- Keep the management cookie HttpOnly and forward its bearer only server-side.
- Keep active local admin/manager authorization on profile reads and writes.
- Keep integer-revision compare-and-set and fail stale saves without overwrite.
- Keep receipt source payloads immutable across retry, reprint, and rename.
- Keep cloud identity, legal/fiscal data, clearing, audit history, and physical
  printer routing outside this slice.

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
Database change: YES
API or contract change: YES
Permission/auth change: NO
Runtime/device change: YES
```

The database impact is migration `0010_chubby_proemial_gods.sql`. The API impact
is the protected local establishment-profile GET/PATCH contract. Existing local
admin/manager authorization is reused. Runtime receipt snapshot and renderer
behavior changes, while printer ownership, physical device configuration, queue
routing, and copy count remain unchanged.

Phase 2 actual impact is limited to `apps/yuta-pos` route-local prototype code,
focused tests, and current UI documentation. Database, API/contract,
permission, device, printing, and receipt behavior changes are all `NO` for
this phase.

Phase 3 actual impact remains inside the same POS development-only prototype.
It adds browser-local interaction state and focused tests only. Database,
API/contract, permission, device, printing, and receipt behavior changes remain
`NO`.

## Approved Phase 4 decisions

- dedicated fixed-id `pos_establishment_profiles` singleton;
- trimmed Unicode `displayName`, 1–80 characters, no control characters;
- active local admin and manager sessions may read and edit;
- integer revision compare-and-set; stale writes return 409;
- no audit/history in this slice;
- row absence is unconfigured; blank/clear is rejected;
- rename saves directly with visible old-receipt immutability copy;
- optional field in compatible payload version 1 at initial receipt snapshot;
- retry/reprint preserve the saved field or its absence;
- legal/fiscal/cloud identity and every later consumer remain excluded.

## Documents and prompt order

See `PRODUCT_SCOPE.md`, `UI_SPEC.md`, `DATA_AND_INTERACTION_SPEC.md`,
`DESIGN_HANDOFF.md`, `IMPLEMENTATION_PLAN.md`, `ACCEPTANCE_CHECKLIST.md`, and
the six phase prompts. Every later phase needs explicit product-owner approval.

## Approved design references

- `references/design-proposal-01-desktop.png`: generated desktop proposal.
- `references/design-proposal-01-mobile.png`: generated narrow proposal.

Generated on 2026-08-19 with the built-in image generation tool from the
approved Management shell references and the Phase 0 handoff. The product owner
approved their visual direction on 2026-08-20 for hierarchy, density,
proportions, spacing, responsive composition, and one-field scope. This approval
does not resolve the remaining product/data decisions or authorize persistence,
API, schema, or receipt integration. The desktop subtitle
renders `recus` without the required cedilla; implementation copy must use the
repository-authoritative `reçus` spelling.

## Design approval

Phase 1 design approval was recorded on 2026-08-20. The approved direction
reuses the POS Management shell, presents one focused `displayName` task, keeps
the local-only/no-cloud explanation visible, and retains a narrow one-column
composition. Generated text, logo geometry, colors, typography metrics, icons,
and raster dimensions remain illustrative rather than implementation authority.

## Phase 2 approval and result

The product owner approved Phase 2 on 2026-08-20. The approved slice is only a
component-structure prototype: one Server Component page, one route-local
presentation component, and one typed fixture/gate module. It uses the approved
desktop/mobile direction, labels demo data, exposes no active mutation, adds no
hub card, and is unavailable outside development.

## Phase 3 approval and result

The product owner approved Phase 3 on 2026-08-20. The prototype now allows the
fixture value to be edited, reports unsaved changes, resets to the initial
fixture, and demonstrates the future submit feedback. The action is explicitly
labelled `Enregistrer (simulation)` and never claims persistence. Empty values,
spaces, accents, or other inputs are not normalized or rejected because the
real domain rules, edit rights, clearing behavior, and concurrency policy are
still awaiting approval.

Authenticated browser QA passed edit, dirty state, simulated-save feedback,
reset, and horizontal-overflow checks at 1366x768, 1024x768, 768x1024, and
390x844. Inputs and buttons measured 48px high. Automated keypress evidence is
still open because the in-app browser keypress path did not dispatch the default
action; the form retains semantic submit behavior and an explicit Enter handler.

## Phase 4 approval and result

The product owner approved the real data/runtime vertical slice on 2026-08-20.
The fixture and development-only gate were removed. Migration, contracts,
site-agent service/routes, POS client/action/form, Management hub navigation,
receipt snapshot, renderer, preview parity, and guarded tests are implemented.
The migration first passed on disposable PostgreSQL databases. After separate
operator authorization, it was applied to the local development POS database
without reset or seed so the configured page could be tested.

## Final delivery and as-built status

Phase 5 was approved and completed on 2026-08-20. Contract, site-agent, POS,
renderer, guarded disposable-database, receipt-preview, production-build, docs,
architecture, and page-pack gates passed. The product owner completed the real
save test; subsequent QA preserved the configured `LUNA` value and created no
additional save, print job, active order, reset, seed, or cloud request.

Authenticated production evidence covers 1366x768, 1024x768, 768x1024, and
390x844. Every viewport has zero horizontal overflow and empty browser
warning/error logs. The input and both form actions measure 48px high; the
shared header keeps its existing 40px brand/home link while its compact actions
measure 44px. Draft, reset, blank validation, configured copy, and recovery
were verified. Automated Tab evidence remains open because the in-app browser
keypress paths did not advance focus, while the semantic form controls and
visible focus styles remain implemented.

As-built documentation status: `COMPLETE`

## Stop conditions

Stop before any new profile field, permission, consumer, schema/API expansion,
cloud synchronization, legal/fiscal identity, audit history, clearing, or
kitchen/POS-header integration without a new approved scope.
