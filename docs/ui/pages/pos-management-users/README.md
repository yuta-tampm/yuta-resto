# POS Management Users

Status: Implemented and QA verified

Visibility: Engineering

Owner: YUTA product and engineering

Prompt snapshot topology: GENERATED_SNAPSHOTS

Prompt provenance: prompt-provenance.json

Protocol revision: 4

Application: `apps/yuta-pos`

Target type: `SCREEN`

Route / entry point: `/management/users`

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

The current authenticated captures are implementation evidence. Generated
proposals 01-03 were approved for Phase 1 hierarchy and responsive direction on
2026-08-13, subject to the documented repository-authoritative deviations.

## Current implementation

`page.tsx` is a protected Server Component. It validates the current local
management session, loads real local users from `site-agent`, renders a truthful
service-unavailable state, and composes `UsersManagement.tsx`.
`UsersOverview.tsx` owns the responsive table/card composition and
`UserDialogs.tsx` owns the create, profile/role/status edit, PIN reset, and
activation dialog boundaries. `actions.ts` validates `FormData`, forwards the
HttpOnly session token from the Next.js server to `site-agent`, and revalidates
the route after success.

## Authority

1. Root and `apps/yuta-pos/AGENTS.md`.
2. Current architecture, POS product, offline, operator, and QA documentation.
3. `docs/ui/DESIGN_TO_CODE_WORKFLOW.md`,
   `docs/ui/YUTA_FRONTEND_RULES.md`, `docs/ui/POS_FRONTEND_RULES.md`, and the
   page-pack protocol.
4. Current contracts, session boundary, site-agent service, db-pos schema, and
   behavior tests.
5. Approved POS Management shell evidence from printing, catalog, and combos.
6. This package and its reviewed references.

## Protected invariants

- Keep `apps/yuta-pos -> apps/site-agent -> @yuta/db-pos` local-only ownership.
- Keep the HttpOnly management cookie and server-only bearer forwarding.
- Keep active admin/manager route access and current role-management limits.
- Keep PIN hashing, session invalidation, unique normalized email,
  last-active-admin protection, and no-hard-delete history.
- Keep real integrated data, current Server Actions, Zod contracts, truthful
  errors, and site-agent as the authoritative enforcement owner.

## Change impact

```text
Files expected to modify: apps/yuta-pos/src/app/management/users/page.tsx, apps/yuta-pos/src/app/management/users/UsersManagement.tsx, apps/yuta-pos/src/app/management/users/actions.ts, packages/contracts/test/contracts.test.ts, docs/products/pos/QA_CHECKLIST.md, and this stable page package
Files expected to create: apps/yuta-pos/src/app/management/users/UsersOverview.tsx, apps/yuta-pos/src/app/management/users/UserDialogs.tsx, apps/yuta-pos/src/app/management/users/users-model.ts, apps/yuta-pos/src/app/management/users/users-action-state.ts, apps/yuta-pos/test/users-model.test.ts, apps/yuta-pos/test/users-action-state.test.ts, apps/site-agent/test/local-user-management.integration.test.ts, and authenticated Phase 1 evidence images
Packages affected: apps/yuta-pos and docs/ui/pages/pos-management-users
Cross-application impact: none
Database change: NO
API or contract change: NO
Permission/auth change: NO
Runtime/device change: NO
```

## Phase 0 Implementation Inventory

1. **Target:** `apps/yuta-pos`, existing screen `/management/users`.
2. **Type and class:** `SCREEN`, `EXISTING_PAGE`, `integrated`; fixture
   replacement is forbidden.
3. **Route/container:** `users/page.tsx` owns trusted session resolution and
   loading; `UsersManagement.tsx` is the interactive client boundary;
   `users/actions.ts` owns Server Actions. The current route has not yet adopted
   the shared `management/_components/ManagementHeader.tsx` used by catalog,
   printing, and combos.
4. **Authorization boundary:** the HttpOnly, SameSite=Strict
   `yuta_pos_management_session` is resolved server-side. Only active local
   `admin` or `manager` sessions enter management. This is single-site local
   infrastructure, not cloud organization/establishment tenancy.
5. **Data/persistence owner:** `apps/site-agent` owns user management and
   transactions; `packages/db-pos` owns `local_users` and local PostgreSQL.
   Nothing synchronizes to cloud persistence.
6. **Transport/contracts:** `@yuta/contracts/local-pos` owns the user, role,
   PIN, create, update, reset-PIN, login, and session schemas. The POS server
   client validates responses and sends bearer-authenticated mutations.
7. **Loading and mutations:** the page calls uncached `listLocalUsers()`.
   Server Actions create a user, update name/email/role/status, toggle active
   state, and reset a PIN. Inputs are Zod-validated and successful writes
   revalidate `/management/users`.
8. **Validation/transactions:** PINs contain 4-8 digits; names and optional
   emails are bounded and emails unique after normalization. Site-agent hashes
   PINs, serializes create/update administrator invariants with a transaction
   advisory lock, creates UUIDv7 ids, and increments `authVersion` for role,
   active-state, and PIN changes.
9. **Permission rules:** admins manage all roles; managers manage only `staff`
   and `kitchen`. The last active admin cannot be disabled or demoted. There is
   no physical delete.
10. **Polling/offline/device:** no polling, provider, printer, worker, or device
    behavior. Internet/cloud are not required. POS server, site-agent, and
    local PostgreSQL are required; load failure is blocking and truthful.
11. **Reusable UI:** reuse `ManagementHeader`, `PageHeader`, `IconTile`, `Card`,
    `Badge`, `Button`, `Dialog`, `ConfirmDialog`, `FormField`, `Input`, `Select`,
    `Alert`, semantic tokens, visible focus, and Lucide icons. Keep user-domain
    composition route-local.
12. **Tests:** `apps/yuta-pos/test/site-agent-client.test.ts` covers uncached
    listing, contract validation, bearer forwarding, and mutation routes;
    `apps/site-agent/test/server.test.ts` covers mutation authentication and
    route validation. Current service invariants are implemented but lack a
    focused database integration test for manager role limits and last-admin
    concurrency; later behavior changes must add proportional coverage.
13. **Documentation:** root/current-state docs; POS README, product spec,
    offline strategy, user guide and QA checklist; shared/POS UI governance;
    local development and deployment authority when runtime is involved.
14. **Protected invariants:** local-only ownership, server-only credentials,
    real integrated data, current role boundaries, no hard delete, unique
    normalized email, hashed PINs, session invalidation, last-admin protection,
    Zod validation, and current revalidation/error behavior.
15. **Baseline:** captured authenticated on 2026-08-13 at 1366 x 768, DPR 1,
    from `http://localhost:3003/management/users`. The healthy local stack
    rendered three active seed users. The edit-admin dialog was opened and
    cancelled; no mutation was submitted.
16. **Current conflict:** the route uses the older standalone `PageHeader` and
    return button, unlike the approved shared POS Management shell already used
    by catalog, printing, and combos. Phase 1 should reuse that shell without
    changing page capabilities.
17. **Unsupported concepts:** cloud identity/membership, tenant switching,
    payroll/scheduling, employee documents, audit history, last-login display,
    search/filter/bulk actions, user deletion, invitation/email delivery,
    granular permissions, biometric login, PIN reveal, and new roles/fields.
18. **Expected later impact:** users route and route-local components plus this
    package; `apps/yuta-pos` only; no cross-application impact.
19. **Change flags:** database `NO`; API/contract `NO`; permission/auth `NO`;
    runtime/device `NO`. Any design requiring one becomes a `PROPOSAL` and stops.
20. **Exact checks:** `pnpm ui:pack:check pos-management-users`,
    `pnpm docs:check`, `pnpm architecture:check`,
    `pnpm -r --if-present typecheck`, `pnpm format:check`, then for runtime work
    `pnpm typecheck:pos`, `pnpm test:pos`, `pnpm build:pos`,
    `pnpm typecheck:site-agent`, `pnpm test:site-agent`,
    `pnpm typecheck:db-pos`, and `pnpm test:db-pos` when affected.
21. **Candidate later files:** `users/page.tsx`, `UsersManagement.tsx`, possible
    responsibility-based route-local components/model/tests, and this package.
    `actions.ts`, contracts, site-agent, and db-pos stay unchanged unless a
    separately approved behavior gap is proven.
22. **Shared context:** global `@yuta/ui` foundation is approved; POS application
    rules are approved; the shared management header and responsive behavior
    are approved and implemented on three sibling routes; the users page
    hierarchy and live capabilities are repository-authoritative.
23. **Shell decision:** `REUSE_APPROVED_SHARED_SHELL`, owned by
    `ManagementHeader.tsx` and approved printing/catalog/combos evidence. Use the
    compact dark header, account/sign-out menu, return-to-POS control, and an
    in-content return to `/management`; no sidebar, drawer, bottom navigation,
    persistent module tabs, or invented routes.

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

- `references/design-proposal-01-desktop.png`: desktop overview proposal.
- `references/design-proposal-02-edit-user.png`: edit-user dialog proposal.
- `references/design-proposal-03-narrow.png`: narrow responsive proposal.

These generated rasters guide hierarchy, density, proportions, spacing, and
tone only. They do not override runtime French copy, real data, authorization,
service rules, semantic tokens, or exact viewport QA.

## Design approval

The product owner approved proposals 01-03 and authorized Phase 1 on
2026-08-13. Approval covers the shared-shell reuse, desktop table, narrow card
composition, contextual last-admin explanation, and proactive disabling of
protected choices. It does not authorize new fields, roles, permissions,
contracts, APIs, schema, persistence, cloud relationships, or device behavior.

## Phase 1 implementation status

Phase 1 was approved and completed on 2026-08-13. The existing authenticated
route now reuses the approved POS Management header and content-return pattern,
keeps the primary create action in the page header, presents the same real user
data as a desktop table and deliberate narrow cards, and retains every current
dialog and Server Action.

The real loaded user set derives whether a row is the last active admin. That
row exposes a contextual label, disables direct deactivation, and disables
non-admin roles plus inactive status in its editor. Site-agent remains the
authoritative enforcement boundary. No contract, API, schema, permission,
session, persistence, cloud, or device behavior changed.

Authenticated production-build evidence is stored in `references/` at
1366x768 and 390x844 plus the protected edit-admin dialog. Browser checks at
1024x768 and 768x1024 also reported no horizontal document overflow.

## Phase 2 implementation status

Phase 2 was approved and completed on 2026-08-13. The route-local component
boundary now follows business responsibility: `UsersManagement.tsx` remains a
small server-compatible composition, `UsersOverview.tsx` owns responsive user
rows/cards and dialog selection, `UserDialogs.tsx` owns forms, action feedback,
pending/success handling, and dialog state, while `users-model.ts` owns pure
role and last-active-admin presentation decisions.

The refactor preserves the approved Phase 1 hierarchy, French copy, real data,
Server Actions, authorization, contracts, and persistence behavior. Focused
model coverage now verifies last-admin detection, admin/manager manageability,
available role choices, role labels, and semantic tones. Authenticated browser
regression at 1366x768 and 390x844 confirmed the protected action/dialog state,
no horizontal overflow, and an empty browser console. No new visual reference
was required because Phase 2 intentionally produced no visual change.

## Phase 3 implementation status

Phase 3 was approved and completed on 2026-08-13. Create, edit, and PIN fields
now retain submitted values after validation, conflict, forbidden, stale, and
local-service errors while their dialog remains open. Every field has an
associated accessible label. Successful mutations close the dialog and expose
a dismissible five-second polite confirmation. Stale-user errors offer
`Actualiser`, and the blocking load state offers `Réessayer`.

Management credentials are now resolved outside each mutation's service-error
catch so an expired session follows the existing server-side redirect to
`/management/login` instead of being mislabeled as a site-agent outage. This
changes no authorization rule or credential ownership. User dialogs prevent
close while pending, activation uses a route-local form with disabled/loading
feedback, and all dialog footer and close controls provide 44 CSS-pixel touch
targets.

Authenticated production-build regression verified mismatched-PIN validation
with both values preserved, unchanged-user persistence with visible success
feedback, initial focus, Escape close and trigger focus return, expired-session
redirect and reauthentication, activation confirmation, zero narrow overflow,
44-pixel dialog controls, and an empty browser console. Typed action-state
tests cover stale recovery, duplicate email, last-admin conflict, forbidden
management, and site-agent unavailability. No contract, API, schema,
permission, persistence, cloud, or device boundary changed.

## Phase 4 integration audit status

Phase 4 was approved and completed on 2026-08-13. Every UI field and action was
traced through `@yuta/contracts/local-pos`, the POS server-only client and
HttpOnly credential resolver, site-agent route authentication and service
rules, and the `local_users`/`local_auth_sessions` db-pos ownership boundary.
Create, update, activation, and PIN reset use the existing paths, Zod schemas,
bearer forwarding, response parsing, and route revalidation without an API or
schema change.

A guarded database integration test now proves manager role limits, normalized
unique email persistence, concurrent last-active-admin protection under the
transaction advisory lock, PIN hashing, and `authVersion` session invalidation.
Contract coverage proves trimming/PIN validation and that `pinHash` cannot
cross the strict response boundary. The focused database run passed all three
tests and restored every pre-existing admin state plus removed its fixtures.

One existing boundary remains explicit: unauthenticated
`GET /api/v1/local-users` supplies the pre-session management login selector;
all mutations require an active admin/manager bearer. The current endpoint
returns the full `LocalUser` response before the POS login page filters active
admin/manager candidates. Reducing that pre-session response would require a
separately approved contract/API/auth-flow decision and was not changed in
Phase 4.

## Final delivery and as-built status

Phase 5 was approved and completed on 2026-08-13. Functional regression passed
before visual review: last-admin disabling, initial editor focus, unchanged-user
success, mismatched-PIN validation with both values preserved, Escape dismissal
with trigger focus return, and activation confirmation were verified against
the authenticated production build without creating users or changing a PIN.

As-built evidence covers 1366x768, 1024x768, 768x1024, and 390x844 plus the
protected narrow admin editor, persisted-success confirmation, and validation
state. Every viewport has zero horizontal document overflow. Page primary,
row, select, dialog footer, and dialog-close controls now measure at least 44
CSS pixels. The narrow editor remains fully contained within 844px, focus and
status text remain visible, and the browser warning/error console is empty.

The 40-pixel brand/management-home link remains owned by the approved shared
`ManagementHeader`; Phase 5 did not change the shared shell across sibling
routes. All users-page operational actions meet the POS touch target. The
existing pre-session full-user listing from Phase 4 remains the only separate
contract/API consideration. The stable page package now matches the as-built
implementation and is marked `implemented`.

As-built documentation status: `COMPLETE`

## Stop conditions

Stop for any new field, role, permission, contract, API, schema/migration,
cloud relationship, destructive behavior, runtime dependency, or change to the
session, authorization, PIN, historical, or last-admin invariants.
