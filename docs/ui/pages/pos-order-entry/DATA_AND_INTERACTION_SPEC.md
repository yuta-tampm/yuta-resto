# POS Order Entry - Data and Interaction Specification

Status: Phase 3 integrated interactions

Visibility: Engineering

## Runtime and trust boundary

`/pos` is restaurant-local. It has no staff authentication gate and no cloud
tenant context. Employee ID is untrusted input until the Server Action and
`site-agent` re-resolve and validate it. Management bearer sessions are not used.

## Data ownership and transport

```text
apps/yuta-pos Server Component / Server Action
-> server-only site-agent client
-> @yuta/contracts/local-pos
-> apps/site-agent
-> packages/db-pos
-> local PostgreSQL
```

Local users and orders are db-pos-owned. The browser receives safe user/order
fields only, never DB URLs/drivers, PIN hashes, tokens, device paths, or cloud
credentials.

## Current domain mapping

| Current field/model/contract | UI presentation       | Existing transformation                                              | Gap                                |
| ---------------------------- | --------------------- | -------------------------------------------------------------------- | ---------------------------------- |
| `LocalUser.id`               | Employee select value | Re-resolved; active `admin`, `manager`, or `staff` only              | Attribution, not authentication    |
| `LocalUser.name`             | Employee label        | Sorted; default uses valid cookie, seeded staff, then first eligible | Manual load/stale refresh          |
| `orders.tableLabel`          | `Table / Repere`      | Trimmed, required, 1-255 characters                                  | Associated recoverable validation  |
| `orders.orderType`           | Three radios          | `dine_in`, `takeaway`, `delivery`; defaults `dine_in`                | None                               |
| `orders.note`                | Optional textarea     | Trimmed optional, maximum 2,000 characters                           | No visible length guidance         |
| `orders.createdBy`           | Employee attribution  | Trusted FK after service validation                                  | No authenticated actor session     |
| `orders.id`                  | Not shown             | Site-agent UUIDv7                                                    | None                               |
| `orders.orderNumber`         | Downstream only       | Site-agent-generated                                                 | None                               |
| `orders.status`              | Implicit result       | db-pos defaults `draft`                                              | Success is redirect, not inline UI |

A future UI view model is not a database schema.

## Current interactions

- Navigate home through logo or `Commandes`; navigate to `/kitchen`.
- Select one eligible employee, enter table/reference and optional note, and
  select exactly one current order type.
- Submit to create a real order, then redirect to item entry.
- Observe independently refreshed local-service/printer state.

There is no delete, edit, preview, confirmation, autosave, retry queue, or
device command on this page.

## Mutations / actions / transactions

`createOrderAction` validates `FormData`, revalidates the employee, calls the
strict site-agent client, and redirects. `site-agent` rejects absent, inactive,
or kitchen-only staff, generates UUIDv7/order number, inserts the draft order,
and parses the response contract. Do not move this logic into a Client
Component. Creation has no idempotency key; do not claim retry-safe creation.

## Validation

- Native page: required employee, table/reference, and order type.
- Server Action: table/reference 1-255; exact type; optional employee UUID;
  optional note up to 2,000.
- POS helper: employee exists, active, and selectable.
- Site-agent contract/service: strict body; employee active and not `kitchen`.
- Database: unique ID/order number, user FK, non-negative amounts, required
  type/status, and draft/single-payment defaults.

Phase 3 returns serialization-safe field errors and submitted values from the
Server Action. The client boundary keeps current controlled values, associates
errors with fields, disables controls while pending, and never moves validation
or creation authority into the browser.

## Operational and UI states

| State                           | Current truth                                           | Design requirement                   |
| ------------------------------- | ------------------------------------------------------- | ------------------------------------ |
| Healthy populated               | Real users; default employee/type; create enabled       | Primary reference                    |
| No eligible employee            | Danger alert; select/create disabled                    | Preserve truth                       |
| Initial/load failure            | Disabled form and manual local-user refresh             | Implemented in Phase 3               |
| Invalid required input          | Native constraints plus associated Server Action errors | Implemented in Phase 3               |
| Submit pending                  | Controls disabled; create label reports pending         | Implemented in Phase 3               |
| Create success                  | Redirect to real item entry                             | No invented toast/receipt            |
| Staff became unavailable        | Associated error plus refresh/reselect recovery         | Implemented in Phase 3               |
| Site-agent/database unavailable | Disabled load state or unconfirmed-create warning       | Implemented without retry claim      |
| Internet unavailable only       | Local service may remain usable                         | Do not block solely for Internet     |
| Printer unavailable             | Read-only shell status                                  | Must not block or imply print action |

There is no cloud forbidden or authenticated-session-expiry state for `/pos`.

## Polling / offline / device behavior

The form does not poll. `PosConnectivityStatus` polls `/api/health` every 15
seconds while visible and on focus/visibility/online events. Creating requires
the POS server, site-agent, and PostgreSQL; Internet/cloud may be unavailable.
There is no browser-offline queue or background sync. Printer status is
read-only and this page never opens a device.

## Decisions that must not be guessed

- Staff login cutover and permissions.
- Duplicate-create/idempotency behavior.
- Exact validation/load/create recovery UX.
- Note guidance or character count.
- New table/customer/provider fields or order types.
- Offline queue, printer action, or cloud/reporting relationship.

## Proposed persistence/contract changes

None. Any field, enum, permission, authentication, API, contract, idempotency,
schema, migration, or privileged device change requires separate approval.
