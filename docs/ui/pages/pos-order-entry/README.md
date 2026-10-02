# POS Order Entry

Status: Implemented

Visibility: Engineering

Owner: YUTA product and engineering

Prompt snapshot topology: GENERATED_SNAPSHOTS

Prompt provenance: prompt-provenance.json

Protocol revision: 4

Application: `apps/yuta-pos`

Target type: `PAGE`

Route / entry point: `/pos`

Runtime family: `local POS`

Page classification: `EXISTING_PAGE`

Implementation class: `integrated`

Delivery mode: `EXISTING_CAPABILITY_RENEWAL`

Package status: `implemented`

Scope status: `APPROVED`

Reference status: `APPROVED`

Inventory status: `COMPLETE`

Baseline status: `CAPTURED`

Design prompt status: `READY`

Shared context status: `RESOLVED`

## Current implementation

`apps/yuta-pos/src/app/pos/page.tsx` is a force-dynamic Server Component. It
loads real local users through `site-agent`, filters active `admin`, `manager`,
and `staff` identities, resolves the employee selection, and renders the real
create-order form inside the shared POS service shell. Submission uses
`createOrderAction`, persists through `site-agent` and `db-pos`, then redirects
to `/orders/[orderId]/items`.

Phase 1 renewed only the route-local visual baseline. Phase 2 extracted
`OrderEntryForm.tsx` as the route-local form boundary. Phase 3 adds the narrow
client boundary required for controlled value preservation, pending feedback,
field-associated validation, stale-employee recovery, and truthful local-load
and create failures. `page.tsx` remains the force-dynamic loader,
employee/default-selection resolver, and shared-shell orchestrator; the Server
Action still revalidates staff, creates through site-agent, and redirects on
success. Contracts, persistence, authorization, order semantics, and fixtures
remain unchanged.

## Authority

1. Root and `apps/yuta-pos/AGENTS.md`.
2. `docs/CURRENT_STATE.md`, `docs/architecture/DATABASE_BOUNDARIES.md`, and
   current POS product, operator, offline, QA, local-development, and deployment
   documentation.
3. `docs/ui/DESIGN_TO_CODE_WORKFLOW.md`,
   `docs/ui/DELIVERY_WORKFLOW_MODES.md`, `docs/ui/PAGE_PACK_PROTOCOL.md`,
   `docs/ui/YUTA_FRONTEND_RULES.md`, and `docs/ui/POS_FRONTEND_RULES.md`.
4. Current route, Server Action, contracts, site-agent service/routes, db-pos
   schema, and tests.
5. Current shared POS shell and related order-service screens.
6. This page package, `@yuta/ui`, semantic tokens, and later approved visual
   references.

## Phase 0 Implementation Inventory

1. **Target application and route:** `apps/yuta-pos`, real route `/pos`.
2. **Target type:** `PAGE`; it is a route-level order-creation entry page.
3. **Classification:** `EXISTING_PAGE`; the route, live loader, mutation,
   redirect, contract, persistence, and tests already exist.
4. **Implementation class and mode:** `integrated` using
   `EXISTING_CAPABILITY_RENEWAL`. It is not device-coupled: the page performs no
   printer command, although the shared shell truthfully displays local printer
   status.
5. **Route, shell, and conventions:** `pos/page.tsx` composes
   `src/components/pos/PosPageShell.tsx`, `PosHeader.tsx`, and
   `PosConnectivityStatus.tsx`. Related service routes `/`, `/kitchen`,
   `/orders/[orderId]`, and `/orders/[orderId]/items` use the same shell and
   French operational presentation.
6. **Trust and identity boundary:** `/pos` has no authenticated staff session in
   the current MVP. The selected employee and `yuta_pos_staff_id` cookie are
   attribution/selection, not authentication or authorization. The Server
   Action re-resolves the employee from `site-agent`; `site-agent` accepts only
   an active non-`kitchen` local user. Management PIN/session rules do not apply
   to this route. This is single-site local infrastructure, not cloud tenancy.
7. **Data owner and persistence:** local users and orders are owned by
   `packages/db-pos`; only `apps/site-agent` accesses that package and local
   PostgreSQL. The POS browser/server receives no database URL or driver.
8. **Transport and contracts:** `apps/yuta-pos/src/lib/pos-api.ts` delegates to
   the server-only `site-agent-client.ts`. `@yuta/contracts/local-pos` owns
   `localUsersResponseSchema`, `createLocalOrderInputSchema`,
   `localOrderResponseSchema`, and `/api/v1/local-users` plus
   `/api/v1/orders` route constants.
9. **Loader, action, validation, and mutation:** the page calls
   `posApi.listLocalUsers()`. `createOrderAction` validates table/reference,
   order type, optional UUID employee, and optional note with Zod, validates
   the selected employee again, calls `POST /api/v1/orders`, and redirects to
   item entry. `site-agent` repeats contract validation, rejects a missing,
   inactive, or `kitchen` user, generates a UUIDv7 ID and order number, and
   inserts the draft order. Order creation is one insert; later kitchen/payment
   transactions are outside this page.
10. **Polling, offline, retry, and device behavior:** the form has no polling or
    offline queue. The shared status strip polls `/api/health` every 15 seconds
    while visible and on focus/online/offline/visibility changes, distinguishing
    local server, database, Internet, and printer conditions. Creating an order
    requires the local POS server, site-agent, and local PostgreSQL; Internet
    and cloud are not required. No create-order idempotency key or browser
    emergency mode exists.
11. **Shared UI:** current code uses `Alert`, `Badge`, `Button`, `Card`, `Input`,
    `Label`, `Select`, and `Textarea` from `@yuta/ui`, Lucide icons, semantic
    tokens, IBM Plex Sans, visible focus behavior, and the compact POS header and
    status strip. Feature composition remains route-local.
12. **Tests:** `packages/contracts/test/contracts.test.ts` protects the local
    create-order contract; `apps/yuta-pos/test/site-agent-client.test.ts`
    protects request serialization and error parsing;
    `apps/site-agent/test/server.test.ts` protects strict HTTP validation and
    routing; db-pos schema tests protect order constraints; and
    `pnpm test:pos:offline` creates a real local order in a disposable stack.
    There is no focused rendered-page or Server Action test.
13. **Documentation:** current authority is the POS README, product scope,
    operator guide, offline strategy, QA checklist, database-boundary document,
    local development/deployment docs, and shared/POS UI governance.
14. **Protected invariants:** local-only ownership; no cloud sync or tenancy;
    active non-kitchen staff attribution; strict Zod/contract validation;
    UUIDv7 order identity; draft creation; free-text table/reference; three
    order types; optional note; redirect to real item entry; no table map; no
    fixtures; no browser DB access; truthful service/printer states.
15. **Current baseline:** `references/current-baseline-1366x768.png`, captured
    from the real seeded local stack with an eligible employee, enabled submit,
    `dine_in` selected, local service/database available, Internet probe
    unconfigured, and printer unconfigured. No form was submitted.
16. **Current gaps/conflicts:** the request contains no mockup conflict. The
    page has no explicit pending UI, field-level Server Action error recovery,
    submitted-value recovery, or route-local load-error recovery. These are
    design/review topics, not permission to alter behavior.
17. **Unsupported concepts requiring approval:** staff login, new roles or
    permissions, table map/entity, customer identity, reservations, provider
    integration, fiscal fields, discounts, payments, item selection on this
    page, offline mutation queue, cloud sync, printer controls, new order types,
    schema fields, API routes, or contracts.
18. **Expected later impact:** if approved, prefer an in-place change to
    `apps/yuta-pos/src/app/pos/page.tsx` and only justified route-local
    components/tests. Update this stable package; do not change sibling routes
    merely for visual consistency.
19. **Change flags:** database `NO`; API/contract `NO`; permission/auth `NO`;
    runtime/device `NO`. Any need for one is a separate proposal and stop gate.
20. **Exact verification commands:** `pnpm ui:pack:check pos-order-entry`,
    `pnpm docs:check`, `pnpm architecture:check`,
    `pnpm -r --if-present typecheck`, `pnpm format:check`,
    `pnpm typecheck:pos`, `pnpm test:pos`, and `pnpm build:pos`. If later work
    changes a boundary, also run affected contracts, site-agent, db-pos, and
    `pnpm test:pos:offline` checks.
21. **Proposed later files:** only `apps/yuta-pos/src/app/pos/page.tsx`, justified
    route-local component/test files, and this package. Phase 0 created only the
    package and baseline evidence.
22. **Shared context:** YUTA primitives/tokens, the current POS application
    shell, the order-service flow across `/`, `/pos`, order detail, item entry,
    payment, and kitchen, and the current `/pos` baseline are resolved in
    `DESIGN_HANDOFF.md`. The Backoffice shell reference is not applicable.
23. **Shell/navigation decision:** `REUSE_APPROVED_SHARED_SHELL`, owned by
    `PosPageShell.tsx`, `PosHeader.tsx`, and `PosConnectivityStatus.tsx`. Keep
    logo/home, title/description, the direct route-owned `Service actif` badge,
    the shared three-line `Commandes`/`Cuisine`/`Gestion` navigation, responsive
    behavior, and the status strip. Do not add a sidebar, bottom navigation,
    tenant/account area, or dead routes. The direct `Nouvelle commande`
    navigation action remains Home-only.

## Shared UI context

The target inherits the service-time POS shell and order-flow conventions, not
the separate authenticated management shell. The full matrix, route inventory,
reuse/adaptation rules, exclusions, baseline conditions, and design-tool bundle
are recorded in `DESIGN_HANDOFF.md`.

## Change impact

```text
Files expected to modify: apps/yuta-pos/src/app/pos/page.tsx and this stable page package after approval
Files expected to create: route-local component/test files only if later phases prove a responsibility boundary; approved design and QA evidence
Packages affected: apps/yuta-pos and docs/ui/pages/pos-order-entry
Cross-application impact: none
Database change: NO
API or contract change: NO
Permission/auth change: NO
Runtime/device change: NO
```

## Protected invariants

- Preserve `apps/yuta-pos -> apps/site-agent -> packages/db-pos -> local PostgreSQL`.
- Preserve current employee eligibility and truthful absence of staff authentication.
- Preserve the create-order contract, validation, draft persistence, and redirect.
- Preserve local-only operation, real data, shared health states, and browser secrecy.
- Preserve French operator copy, direct touch actions, keyboard access, and semantic tokens.
- Do not replace integrated behavior with fixtures.

## Documents and prompt order

- `PRODUCT_SCOPE.md`
- `UI_SPEC.md`
- `DATA_AND_INTERACTION_SPEC.md`
- `DESIGN_HANDOFF.md`
- `IMPLEMENTATION_PLAN.md`
- `ACCEPTANCE_CHECKLIST.md`
- `prompts/00_REPOSITORY_ANALYSIS.md` through `05_VISUAL_QA.md`

Every phase requires explicit product-owner approval before the next phase.

## References

- `references/current-baseline-1366x768.png` - current real operational
  baseline; evidence only, not design approval.
- `references/design-proposal-01-desktop.png` - generated desktop renewal and
  state-study proposal; `DRAFT`, non-authoritative.
- `references/design-proposal-02-narrow.png` - generated narrow responsive
  companion; `DRAFT`, non-authoritative.
- `references/phase-05-as-built-1366x768.png` - final production-build desktop
  evidence.
- `references/phase-05-as-built-1024x768.png` - final compact desktop evidence.
- `references/phase-05-as-built-768x1024.png` - final tablet evidence.
- `references/phase-05-as-built-390x844.png` - final narrow evidence.
- `references/phase-05-validation-390x844.png` - non-mutating server-validation
  evidence with submitted values preserved.

## Design approval

Phase 0 scope and the generated visual direction were approved on 2026-08-14.
Phases 1, 2, 3, and 5 were subsequently approved and completed. Phase 4 closed
as a no-change integration audit: the implemented renewal required no new
field, enum, permission, authentication, API, contract, idempotency, schema,
migration, runtime, cloud, or device behavior.

## Stop conditions

The delivered scope remains closed to any new route, field, order type, role,
permission, authentication flow, contract, API, schema, persistence, cloud
relationship, offline queue, printer/device behavior, or transaction change.

## Final delivery and as-built status

Phase 5 was approved and completed on 2026-08-14 against the real local stack
and a clean production-build origin at `http://localhost:3013/pos`. The final
matrix covers 1366 x 768, 1024 x 768, 768 x 1024, and 390 x 844. Every viewport
had zero document-level horizontal overflow, an effective minimum touch target
of 48 CSS pixels, and a visible 56-pixel primary action. `YuTa Staff` and
`dine_in` were the truthful healthy defaults; the shared local-service and
printer-unconfigured status remained unchanged; browser warning/error logs
were empty.

Keyboard QA confirmed visible focus plus Enter/Escape operation on the employee
combobox. A 390 x 500 reduced-height check with the note focused kept the
primary action visible and reachable, covering the virtual-keyboard constraint.
A non-mutating whitespace validation submission confirmed associated field
feedback and preservation of `delivery`, note, and table values. Phase 5 found
and fixed the native form reset of the controlled order-type radio by remounting
that input group on the action-state revision; no contract or persistence path
changed.

After final review, the product owner identified that the desktop header still
used the compact, centered shell dimensions rather than the approved visual
direction. The `/pos` shell now opts into a route-scoped prominent header and
full-width canvas: 90px desktop height, 56px logo, 30px title, 56px actions, and
a text-backed green service indicator. At widths below `lg`, actions use the
existing compact menu so the 768px and 390px layouts stay on one row. A later
product-owner decision on 2026-08-16 standardized this prominent desktop
geometry across all non-management `PosPageShell` routes while preserving each
route's navigation, status, and workflow actions. The direct `Nouvelle
commande` navigation action remains exclusive to Home `/`.

The previously approved Phase 3 clean-origin evidence covers real loader
failure/recovery, stale employee handling, and cautious unconfirmed-create
failure copy. The focused action suite covers validation, stale staff, service
failure, and the unchanged success redirect. Phase 5 did not create an order,
alter local data, or induce the no-staff state because doing so would require an
unnecessary operational mutation. No fixtures were used.

Checks passed: POS tests (48/48), POS typecheck, POS production build,
workspace typecheck, documentation consistency, architecture boundaries,
page-pack validation, scoped Prettier, and `git diff --check`. Full repository
formatting remains a pre-existing unrelated baseline failure and is not claimed
as clean.

As-built documentation status: `COMPLETE`
