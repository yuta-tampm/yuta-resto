# POS management catalog — Product Scope

Status: Draft

Visibility: Engineering

## User goal

Let an authenticated local restaurant administrator or manager maintain the
catalogue used by the POS during service, quickly and safely, without cloud
access or destructive history changes.

## Current approved capabilities

- Create and edit categories and articles.
- Change price, preparation station, ordering policy, sort order, description,
  per-portion variant choices, and availability.
- Hide/show categories and make articles unavailable/available without delete.
- Maintain local quick-note/allergen definitions and category/article
  instruction assignments.
- Receive trusted validation, conflict, success, and local-service failure
  feedback through existing server actions and `site-agent`.

## Current boundaries

This is single-site local POS management. Access requires the existing
HttpOnly management cookie and an active `admin` or `manager` session validated
by `site-agent`. `apps/site-agent` owns local mutations and `packages/db-pos`
owns persistence. Cloud tenancy, Backoffice, Internet, providers, printers, and
other devices do not participate.

## Approved change boundary

Phase 0 approves documentation and authenticated baseline capture only. A later
visual implementation may be proposed inside the existing route after a design
is explicitly approved. Database, API/contract, permissions, authentication,
cross-application behavior, runtime ownership, and device behavior remain
unchanged.

## Out of scope

Combo management (`/management/combos`), staff, printing, orders/payments,
cloud Backoffice, cloud sync, physical deletion, and speculative catalogue
features are outside this screen.

## Proposed capabilities requiring approval

Search, filters, category navigation, bulk operations, persistent drag-and-drop,
media, stock/inventory, import/export, scheduling, publication channels,
analytics, audit history, new modifier models, or any new field/contract/API/
schema/role requires a separate product and architecture decision.

## Relationships

Successful changes affect the next server-rendered POS item catalogue. Current
ordering screens filter hidden categories and unavailable articles and enforce
catalogue-driven ordering/variant rules. Combo configuration remains on its own
authenticated management route.
