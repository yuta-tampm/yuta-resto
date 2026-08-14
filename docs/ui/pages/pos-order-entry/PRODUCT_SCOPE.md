# POS Order Entry - Product Scope

Status: Phase 0 draft for review

Visibility: Engineering

## User goal

Let a service employee create a new local draft order quickly with correct
employee attribution, table/reference, service type, and optional general note,
then continue directly to adding items.

## Current approved capabilities

- Load real active local users and offer only `admin`, `manager`, and `staff`.
- Reuse the last valid selected employee or the current seeded/default fallback.
- Capture required free-text `Table / Repere` up to 255 characters.
- Choose exactly one existing type: `dine_in`, `takeaway`, or `delivery`.
- Capture an optional general order note up to 2,000 characters.
- Create a real local draft order and redirect to `/orders/<orderId>/items`.
- Navigate to the real command list and kitchen routes.
- Display truthful service, database, Internet, and printer state in the shell.
- Disable creation and show a truthful alert when no eligible employee exists.

## Current boundaries

This is a single-restaurant local POS flow. The browser and Next.js app call
`site-agent`; only `site-agent` accesses `db-pos` and local PostgreSQL. The page
does not use cloud organization/establishment tenancy.

The employee selector is operational attribution, not authentication. Current
management PIN sessions apply only to `/management`; introducing staff login
for `/pos` is a separate product/security cutover.

## Approved change boundary

Phase 0 approves documentation and visual evidence only. A later approved UI
renewal may reorganize the existing form in place while retaining the shared
POS shell, real fields, routes, loader, Server Action, and persistence.
Database, API/contract, permission/auth, cross-application, provider, and
runtime/device changes are excluded.

The application header, status strip, and navigation are shared cross-page
elements and are not page-local redesign scope.

## Out of scope

- Table maps, persisted tables, reservations, or seating state.
- Customer profiles, loyalty, marketing, delivery-provider, or cloud data.
- Menu item selection before the order exists.
- Payment, discount, receipt, refund, VAT, or certified cash-register behavior.
- Kitchen or physical printer commands from `/pos`.
- New types, fields, roles, permissions, routes, APIs, contracts, or schema.
- Browser-offline creation, background synchronization, or cloud sync.
- Replacing real users or orders with fixtures.

## Proposed capabilities requiring approval

- Explicit pending feedback and double-submit prevention.
- Field-associated Server Action validation with value preservation.
- Recoverable local-service load/create errors.
- Any authenticated service-staff session replacing the current selector.

The first three may fit interaction-quality work within existing contracts,
but require Phase 3 approval and regression evidence. Staff authentication is a
separate product/security capability.

## Relationships

- `/` is the current-service command list and links to `/pos`.
- `/kitchen` is an adjacent production queue, not part of order creation.
- Successful creation continues to `/orders/<orderId>/items`.
- Order detail and payment are downstream under `/orders/<orderId>`.
- `/management/users` controls active local users, but its authenticated shell
  is not inherited by `/pos`.
