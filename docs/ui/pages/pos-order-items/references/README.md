# POS Order Items - Reference Metadata

Status: Approved design reference

Visibility: Engineering

Reference status: `APPROVED`

Approved scope/date or review note: The product owner approved the corrected
desktop, narrow, and post-send success directions on 2026-08-15. Approval is
limited to hierarchy, density, spacing, responsive behavior, and visual tone.

## `phase-0-current-1366x768.png`

Reference status: `CURRENT BASELINE EVIDENCE`

Captured: 2026-08-14 from a real persisted draft order at 1366x768 on the
healthy local stack. No control was submitted and no item, status, payment, or
kitchen command changed. The current payment-summary GET performed its existing
combo optimization and advanced the order `updatedAt` while rendering.

Purpose: record current shell, hierarchy, proportions, density, real route
state, and responsive starting point before design.

Intentional non-authority: this image does not define routes, product scope,
authorization, permissions, contracts, APIs, persistence, runtime/device
ownership, business logic, or raw color values. It is not an approved design.

## `design-proposal-01-desktop-v2.png`

Reference status: `APPROVED`

Purpose: desktop visual renewal and separate locked, validation/allergy,
local-service, and kitchen-send state studies.

Review note: targeted revision removed an unsupported catalog filter control
and per-item overflow menus from the first desktop draft.

## `design-proposal-02-narrow-v2.png`

Reference status: `APPROVED`

Purpose: narrow catalog, existing current-order dialog, and recovery/attention
state studies.

Review note: targeted revision removed the same unsupported controls from the
first narrow draft.

## Rejected first drafts

`design-proposal-01-desktop.png` and `design-proposal-02-narrow.png` are retained
only as design-review evidence. They are rejected because their filter and
per-item overflow controls lacked current repository behavior.

## `design-proposal-03-send-success.png`

Reference status: `APPROVED`

Purpose: product-requested post-kitchen-send success screen at desktop and
narrow widths. It shows `Créer une autre commande` to `/pos` and `Retour aux
commandes` to `/`, with no automatic redirect or physical-print claim.

Behavioral boundary: this visual may appear only after the trusted existing
kitchen-send transaction succeeds. It does not define the Server Action state
mechanism or authorize a new route, endpoint, contract, or persistence field.

All generated images are visual proposals only. They do not define routes,
product scope, authorization, contracts, APIs, persistence, device ownership,
business rules, exact copy, or raw colors.
