# POS Order Items - Reference Metadata

Status: Approved design and final as-built evidence

Visibility: Engineering

Reference status: `APPROVED`

## Post-delivery shared-header verification

Following product-owner approval on 2026-08-16, the route was rechecked
read-only in the production POS stack after `PosPageShell` made the prominent
desktop header the non-management default. Order item entry matched Home at
90px header/56px logo on the available 1280px desktop viewport and at 70px on
390×844, with zero document overflow. Its payment action remained, the leading
header back arrow was removed, and no direct `Nouvelle commande` navigation
action appeared. The shared three-line menu exposes `Commandes`, `Cuisine`, and
`Gestion` without replacing the direct payment workflow action. Existing Phase
5 captures below remain historical evidence of
the earlier compact desktop header and unchanged item-entry content.

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
commandes` to `/`, with no physical-print claim. The later approved interaction
adds a visible five-second countdown and automatic navigation to `/`; it does
not alter the visual reference's two-action hierarchy.

Behavioral boundary: this visual may appear only after the trusted existing
kitchen-send transaction succeeds. It does not define the Server Action state
mechanism or authorize a new route, endpoint, contract, or persistence field.

All generated images are visual proposals only. They do not define routes,
product scope, authorization, contracts, APIs, persistence, device ownership,
business rules, exact copy, or raw colors.

## Final Phase 5 as-built evidence

Evidence status: `AS-BUILT`

Captured on 2026-08-15 from the production build using real persisted order
`POS-20260815-080849-A4505C`. Site-agent and database were available; the
printer was not configured. Capture did not submit a control or create a new
kitchen transaction, payment, or print job.

- `phase-5-as-built-1366x768.png`: desktop three-panel layout;
- `phase-5-as-built-1024x768.png`: compact desktop with two readable catalog
  cards per row;
- `phase-5-as-built-768x1024.png`: tablet stacked layout and mobile-order
  action;
- `phase-5-as-built-390x844.png`: narrow two-card layout and horizontal category
  menu.

All four captures had zero document overflow and no browser warning or error.
They document the final presentation only and do not extend product or runtime
authority.
