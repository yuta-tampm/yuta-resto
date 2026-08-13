# POS management combos — Data and Interaction Specification

Status: Phase 4 integration verified

Visibility: Engineering

## Boundary

The Next.js route validates the local HttpOnly management session. The browser
never receives or supplies a trusted role/token. Server Actions recover the
opaque token, validate untrusted `FormData`, and forward bearer-authenticated
commands to site-agent. Site-agent owns db-pos reads, validation, and writes.

## Data mapping

| UI concept         | Current contract/domain field                        | Owner             |
| ------------------ | ---------------------------------------------------- | ----------------- |
| rule identity/name | `LocalCatalogResponse.comboRules[].id/name`          | site-agent/db-pos |
| pricing mode       | `fixed` or `base_item_plus_delta`                    | shared contract   |
| fixed price        | `comboPriceCents`                                    | site-agent/db-pos |
| base delta         | `priceDeltaCents`                                    | site-agent/db-pos |
| base group         | `basePricingGroupName`                               | site-agent/db-pos |
| priority           | `priority`                                           | site-agent/db-pos |
| application cap    | `maxApplications` nullable                           | site-agent/db-pos |
| active state       | `isActive`                                           | site-agent/db-pos |
| group              | `groups[].id/name/minQuantity/maxQuantity/sortOrder` | site-agent/db-pos |
| eligible item      | `groups[].items[].menuItemId/extraPriceCents`        | site-agent/db-pos |
| item display name  | catalogue category/item response                     | site-agent/db-pos |

## Existing endpoints and interactions

- `GET /api/v1/catalog` loads categories/items and active/inactive combo rules.
- `POST/PATCH /api/v1/catalog/combo-rules` creates or updates a rule.
- `POST/PATCH/DELETE /api/v1/catalog/combo-groups` manages groups.
- `POST/PATCH/DELETE /api/v1/catalog/combo-group-items` manages eligible items.
- Activation/deactivation uses the existing rule PATCH endpoint.
- Confirmations precede activation/deactivation and group/item removal.
- Successful dialog actions close the dialog and revalidate combos and order
  layouts. Errors remain visible in the dialog/confirmation surface.
- Editor dialogs prevent dismissal while a submission is pending. Their field
  region scrolls independently while cancel/save actions remain reachable.

## Validation and service rules

- Names are trimmed, required, and limited to 255 characters.
- Money values are integer cents within contract limits; per-item extra prices
  are non-negative and the base price delta may be signed.
- Priority/sort values and quantities are bounded integers.
- `maxApplications` is null or a positive integer.
- `maxQuantity >= minQuantity`.
- Rule and per-rule group names are case-insensitively unique.
- An eligible item cannot appear twice in one group and must exist in catalogue.
- Group/item structure mutations fail while the rule is active.
- Activation requires groups, eligible items for required groups, and a valid
  named base group for base-item-plus-delta pricing.

## Transactions and history

Site-agent owns transactions. Deleting a group deletes its mappings and group
atomically. There is no rule-delete action because order/payment discount
history may reference rule snapshots. UI redesign cannot change these rules.

Order and check optimization call the shared `calculateComboDiscounts` through
the site-agent persistence service. Callers that mutate payment/split state pass
their transaction executor, so discount rows, item applications, and totals are
committed with the enclosing operation. Persisted discount names and amounts
remain snapshots when a rule is later renamed or deactivated.

## Failure and recovery

Invalid/expired sessions redirect to `/management/login`. Initial load failure
shows `Site-agent indisponible`. Mutation failures map known service codes to
French messages; unknown local-service failures use the generic service
message. Stale rule, group, eligible-item, and catalogue-item references expose
an `Actualiser` action that refreshes the current Server Component route. Name,
structure, quantity, active-lock, and duplicate-item conflicts remain in the
current editor or confirmation without discarding the submitted fields. No
polling, optimistic persistence, offline queue, retry worker, printer, or cloud
fallback exists for this page.

## Phase 4 verification note

The current local chain is verified as:

```text
authenticated yuta-pos page
-> Server Action with trusted HttpOnly token
-> Zod-validated site-agent client request
-> bearer-authenticated site-agent route
-> combo management or persistence service
-> db-pos transaction/local PostgreSQL
-> @yuta/core for deterministic discount calculation
```

Residual concurrency risk: rule/group/item uniqueness checks and activation
structure validation are service-level read-then-write operations. The current
db-pos tables do not add matching unique constraints or row locks, so concurrent
management requests could race. Phase 4 does not authorize a schema or service
locking change; hardening this requires a separately approved backend change.
