# POS management catalog — Data and Interaction Specification

Status: Draft

Visibility: Engineering

## Runtime and trust boundary

The screen uses the local POS installation and management session. The Next.js
server reads `yuta_pos_management_session`, validates it through `site-agent`,
and accepts only active admin/manager users. Browser code never receives POS
database credentials or owns authorization.

## Data ownership and transport

`apps/site-agent` owns catalogue/instruction services and accesses
`@yuta/db-pos`. `@yuta/contracts/local-pos` owns serialized inputs/responses.
The POS route loads through `site-agent-client.ts`; Server Actions forward the
opaque token as bearer auth after trusted validation.

## Current domain mapping

| Current contract data              | UI presentation                     | Existing transformation            | Gap  |
| ---------------------------------- | ----------------------------------- | ---------------------------------- | ---- |
| category name, order, active state | section title and badges            | sorted by service response         | none |
| instruction code arrays            | suggestion count and edit textareas | uppercase whitespace/comma parsing | none |
| item name/description/price        | article identity and details        | cents formatted as French EUR      | none |
| kitchen station                    | Cuisine/Bar/Dessert/Aucun           | French label mapping               | none |
| ordering policy                    | grouped/separate badge and field    | French label mapping               | none |
| variant options/required quantity  | article editor                      | line parser `CODE = Libellé`       | none |
| availability                       | badge and confirmed toggle          | boolean update                     | none |
| instruction settings               | options dialog                      | line parsers for labels/conflicts  | none |

## Current interactions

Return to management; create/edit category; create/edit article; choose a
category; inherit or override note suggestions; edit local note/allergen
definitions; confirm category show/hide; confirm article available/unavailable;
cancel/close dialogs; submit and receive pending/success/error feedback.

## Mutations / actions / transactions

Server Actions validate FormData with current Zod schemas and call existing
`site-agent` routes. Service logic checks category/article existence,
case-insensitive uniqueness, instruction assignments/conflicts, and variant
rules, then writes local PostgreSQL and returns validated responses. Successful
writes revalidate `/management/catalog`, `/pos`, and `/orders` layout. No
browser-owned transaction or physical delete exists.

## Validation

Names are trimmed, non-empty, and at most 255 characters; descriptions are at
most 2000; sort order is an integer from -100000 to 100000; prices are
non-negative integer cents; option codes are stable uppercase identifiers;
arrays have contract limits; duplicate/unknown assignments and invalid
inheritance are rejected; variant codes are unique and required quantity/options
must agree. The current UI returns French action-level errors and closes editors
on success.

## Operational and UI states

Current states include populated, no categories, category with no articles,
authenticated redirect, catalogue load failure, dialog open/closed, pending,
success, generic validation, duplicate-name conflict, missing category/article,
instruction conflicts/in-use/unknown, invalid variants, confirmation,
visible/hidden category, and available/unavailable item.

## Polling / offline / device behavior

No polling or device behavior. Internet/cloud availability is irrelevant, but
the local Next.js server, `site-agent`, and local PostgreSQL must be available.
Local-service failure is blocking and must be stated truthfully.

## Decisions that must not be guessed

Do not guess physical-delete semantics, bulk behavior, drag persistence,
search/filter state, media, inventory, publication, new modifier models, cloud
scope, new roles, or mutation batching. Each requires separate approval.

## Proposed persistence/contract changes

None in the current scope.
