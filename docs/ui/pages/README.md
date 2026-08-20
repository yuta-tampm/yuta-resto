# YUTA UI Page Packages

Status: Current

Visibility: Engineering

Last updated: 2026-08-20

Page packages under this directory may target any YUTA frontend application.
Every package identifies its application, real route or screen, runtime
boundary, current implementation status, and application-specific rules in its
`README.md`.

Current Backoffice packages remain in their stable folders. Do not rename them
merely because UI governance now applies project-wide.

Current packages:

- `backoffice-equipe-salaries/` — Phase 0 new-capability discovery package for
  the now-integrated authenticated Backoffice route `/equipe/salaries`, with
  its approved and implemented local delivery waves.

- `backoffice-equipe-registre-personnel/` — implemented Wave E local real-data,
  hardening, and Phase 5 as-built pack for Backoffice route
  `/equipe/registre-personnel`; production remains blocked.

- `hours-services/` — integrated Backoffice route `/etablissement/horaires-services`.
- `establishment-general-information/` — integrated establishment profile editor
  at `/etablissement/informations-generales`.
- `today/` — integrated authenticated Backoffice dashboard at `/aujourdhui`.
- `pos-management-printing/` — Phase 0 inventory for the existing local POS
  device-coupled screen at `/management/printing`; design approval is pending.

- `pos-management-catalog/` — Phase 0 inventory and authenticated baseline for
  the existing integrated local POS screen at `/management/catalog`; generated
  design approval is pending.

- `pos-management-combos/` — completed Phase 0 inventory, authenticated
  baseline, resolved catalog/printing shared UI context, and design prompt for
  the existing integrated local POS screen at `/management/combos`; design
  generation and approval are pending.

- `pos-order-entry/` - implemented existing-capability renewal for the local
  POS `/pos` order-entry page, including approved visual renewal, route-local
  form boundary, recoverable interactions, production-build responsive QA, and
  complete as-built evidence.

- `pos-order-detail/` - implemented existing-capability renewal for local POS
  route `/orders/[orderId]`, reopened for a device-coupled customer-receipt
  flow. Receipt contracts, local queue/worker renderer, route action, read-only
  preview tooling, and Phase 5 responsive browser QA are complete. Physical
  TM-m30 output remains deferred because no configured device is available.

- `pos-kitchen/` - implemented existing-capability renewal for the integrated
  local POS production queue at `/kitchen`, including the approved bounded
  site-agent read model, notification SSE with polling fallback, TV-first
  layout, sound authorization, and synchronized as-built evidence.

- `pos-management-establishment/` - implemented new-capability delivery and
  Phase 5 as-built QA for `/management/establishment`; the hub-linked route
  reads and updates the singleton local display name through protected
  site-agent and preserves immutable receipt snapshots.

- `pos-management-reports/` - implemented local read-only reporting and Phase
  5 as-built QA for
  `/management/reports`: authenticated admin/manager access, the protected
  site-agent read model, paid-payment principal and order metrics for the fixed
  05:00 `Europe/Paris` service day, bounded activity pagination, and direct
  order links. The Management hub card is available; four-viewport production
  QA plus empty/error/recovery evidence is complete. Luna release remains
  blocked until its host and site-agent timezone preflight passes.

## Local POS UI delivery backlog

This is the current route/page backlog authority as of 2026-08-20. Reuse it
before performing another broad POS route audit.

Implemented page packs:

- `/` -> `pos-orders-home/`
- `/pos` -> `pos-order-entry/`
- `/orders/[orderId]` -> `pos-order-detail/`
- `/orders/[orderId]/items` -> `pos-order-items/`
- `/management` -> `pos-management-home/`
- `/management/users` -> `pos-management-users/`
- `/management/catalog` -> `pos-management-catalog/`
- `/management/combos` -> `pos-management-combos/`
- `/management/printing` -> `pos-management-printing/`
- `/kitchen` -> `pos-kitchen/`
- `/management/establishment` -> `pos-management-establishment/`
- `/management/reports` -> `pos-management-reports/`

Prioritized remaining work:

1. `/orders/[orderId]/payment` - integrated `EXISTING_PAGE`; create its own
   `EXISTING_CAPABILITY_RENEWAL` pack and use safe persisted data. Preserve
   payment/combo/idempotency and local transaction ownership.
2. `/orders/[orderId]/payment/items` - integrated route without a page pack.
   Phase 0 must first decide whether it remains a meaningful standalone screen
   or is superseded by the item-split dialog on the main payment page.
3. `/management/login` - integrated local-management authentication screen
   without a dedicated page pack; renew only after the higher-priority
   operational pages.

`/orders` is only a canonical redirect to `/` and does not need a separate
page package. Table maps, refunds, fiscal invoices, and a service-time staff
login are outside the current POS page backlog unless product scope changes.

Every package follows `../PAGE_PACK_PROTOCOL.md`.

For new packages, choose a globally unambiguous slug. When route vocabulary
could collide across applications, use an application or feature qualifier
such as `pos-management` or `pos-order-entry`.

Every package also follows `../YUTA_FRONTEND_RULES.md`, the nearest application
`AGENTS.md`, and application-specific UI rules when present.

Do not add flat page specifications directly under `docs/ui/pages/`.

Do not create parallel `v2`, `v3`, `new`, `final`, or `latest` directories.
Update the canonical page package in place.
