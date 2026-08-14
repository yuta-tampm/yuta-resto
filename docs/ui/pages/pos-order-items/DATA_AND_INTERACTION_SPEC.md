# POS Order Items - Data and Interaction Specification

Status: Draft

Visibility: Engineering

## Runtime and trust boundary

Local single-site POS. Service-time routes currently have no authenticated
staff session; selected staff is attribution. Origin restriction/local network
exposure is not a substitute for a new permission model. Management bearer
sessions do not apply.

## Data ownership and transport

`db-pos` owns the persisted order/catalog/payment/print models; site-agent is
the only database runtime. POS server code uses `@yuta/contracts/local-pos`
through `pos-api.ts` and `site-agent-client.ts`. Browser code receives neither
database credentials nor printer paths.

## Current domain mapping

| Current field/model/contract         | UI presentation             | Existing transformation                               | Gap  |
| ------------------------------------ | --------------------------- | ----------------------------------------------------- | ---- |
| order tableLabel/orderNumber/status  | header and editability      | loaded from order detail                              | none |
| catalog categories/items/isAvailable | category rail and item grid | active/available filter and French sort               | none |
| item snapshots/quantity/status       | current order and totals    | `formatEuros`, status labels                          | none |
| orderingPolicy                       | quantity behavior           | separate rows cannot increase                         | none |
| instruction/variant config           | item dialog                 | service validates codes and exact required count      | none |
| allergy snapshots/acknowledgements   | alerts and confirmation     | snapshot formatter; separate POS/kitchen confirmation | none |
| paymentMode/payments                 | edit lock                   | only single/no paid payment can edit                  | none |
| subtotal/discount/total              | summary                     | service-owned cents formatting                        | none |

## Current interactions

Navigate categories, search locally, add an item, change pending quantity,
soft-remove pending item, edit instructions/allergy, open/close mobile summary,
navigate to detail/payment, and confirm/send the pending batch to kitchen.

Approved later interaction: after and only after the existing site-agent
kitchen-send command returns confirmed success, present a dedicated route-local
success screen. `Créer une autre commande` navigates to `/pos`; `Retour aux
commandes` navigates to `/`. There is no automatic redirect.

## Mutations / actions / transactions

Server Actions call POST/PATCH/command site-agent endpoints and revalidate real
routes. Site-agent owns snapshotting, merging/separate portions, totals, locks,
allergy resets, UUIDv7 replay, kitchen batch status changes, and print-job
transactions. Presentation code must not reimplement these rules.

The current `GET /orders/:orderId/payment-summary` is operationally mutating for
editable `single` orders: it invokes combo optimization and may rewrite
discount/total persistence plus `orders.updatedAt`. A UI renewal must preserve
this current behavior unless a separately approved backend change removes it.

## Validation

Form UUID/quantity/JSON input is validated by Server Action Zod schemas and
again by strict transport schemas. Site-agent validates order/item status,
payment locks, availability, ordering policy, instruction conflicts/variants,
allergy completeness, active staff, and idempotency. Existing action errors are
partially mapped for kitchen send; later design may propose recovery UI but not
new semantics.

## Operational and UI states

Required design studies: loader initialization; empty order; empty search;
unavailable catalog/order/service; paid/cancelled/split locked state; pending
submission; item validation/conflict; incomplete required variants; allergy
confirmation; kitchen-send failure/idempotency conflict; persisted success and
refresh/retry recovery; Internet unavailable while local service remains usable;
printer unavailable without misreporting kitchen-send transaction state.

The success screen must be driven by the trusted Server Action result retained
in route-local UI state. A browser-provided search parameter alone cannot prove
that kitchen send succeeded. Refresh/re-entry must fall back to persisted order
state rather than fabricating a fresh-send confirmation.

## Polling / offline / device behavior

Only the shared health/printer strip polls (15 seconds while visible plus focus
and visibility/connectivity events). The page has no offline command queue or
realtime subscription. Kitchen print jobs are durable and site-agent/device
owned; browser success cannot claim physical print success.

## Decisions that must not be guessed

Do not guess new merge/delete semantics, auto-send, optimistic transaction
success, item photos, dirty dialog behavior, authentication, printer routing,
combo calculation, polling, or offline replay. The two approved success
destinations are `/pos` and `/`; no other post-send navigation is authorized.

## Proposed persistence/contract changes

None. Any such change requires separate product/architecture approval.
