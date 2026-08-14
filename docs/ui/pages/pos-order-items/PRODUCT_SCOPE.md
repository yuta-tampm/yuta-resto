# POS Order Items - Product Scope

Status: Draft

Visibility: Engineering

## User goal

Let service staff add the correct real menu items quickly to an existing local
order, review quantities/instructions/allergies, and send the pending batch to
production without losing operational context.

## Current approved capabilities

- Filter the available local catalog by active category and client-side search.
- Add available items using catalog ordering policy and stored snapshots.
- Review, increase, decrease, or soft-remove pending items when order locks allow.
- Edit notes, quick instructions, required variants, and structured allergies.
- Review totals and navigate to order detail or payment.
- Send the exact pending batch to kitchen with allergy confirmation,
  idempotency, transaction locking, and durable print jobs.
- After a confirmed successful kitchen-send transaction, show a dedicated
  success screen with `Créer une autre commande` to `/pos` and
  `Retour aux commandes` to `/`.
- Use the existing mobile order-summary dialog on smaller screens.

## Current boundaries

This is single-site local POS operation. Site-agent owns APIs, transactions,
persistence, and printing; db-pos owns local PostgreSQL data. Staff selection is
attribution, not authentication. Cloud tenancy and management sessions do not
apply.

## Approved change boundary

Phase 0 approves documentation and baseline evidence only. Any later visual
renewal must be in place, route-local where possible, and preserve current
shell, actions, contracts, persistence, permissions, runtime, and device rules.

The post-send success requirement is approved product scope. It must be derived
from the trusted result of the existing kitchen-send action, must not use an
untrusted query parameter as proof of success, and must not require a new route,
site-agent endpoint, transport contract, or persistence field.

## Out of scope

Table maps, customers, reservations, delivery providers, fiscal/VAT behavior,
new payment or kitchen capabilities, management navigation, cloud sync,
offline mutation queues, realtime, printer controls, catalog photo storage,
and backend/schema redesign.

## Proposed capabilities requiring approval

None proposed in Phase 0. Any design element without current implementation is
unsupported until separately approved.

## Relationships

Upstream is `/pos` order creation and order detail. Downstream/adjacent routes
are `/orders/[orderId]`, `/orders/[orderId]/payment`, and `/kitchen`.
