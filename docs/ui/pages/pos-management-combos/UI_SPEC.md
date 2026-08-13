# POS management combos — UI Specification

Status: Implemented as-built specification

Visibility: Engineering

## Current visual baseline

The populated route renders a route-local page header, a detached primary
`Nouvelle formule` action, and four fully expanded active rule cards. Each rule
shows status, priority, pricing, group count, rule actions, an inactive-editing
notice, group cards, and every eligible item. At capture, the document height
was approximately 3257 CSS pixels at `1366 × 768`.

The current rule editor is a centered, viewport-contained dialog with rule
name, pricing mode, fixed price, price delta, base group name, priority, and
maximum applications. Its field region scrolls independently while the header
and cancel/save actions remain visible. Group and eligible-item editors use the
same containment pattern.

## Required hierarchy for the proposal

1. Approved POS Management shared header.
2. In-content return link to `/management`.
3. `Formules et combos` title, concise explanation, and primary create action.
4. Rule-level summary: name, active state, priority, pricing summary, group
   count, edit/add-group/activate-deactivate actions.
5. Group-level summary: name, min/max, order, edit/add-item/remove actions.
6. Eligible item: catalogue name, extra price, edit/remove actions.
7. Dialogs and confirmations using the existing fields and semantics.

The design may reduce scan cost through stronger hierarchy and an explicitly
reviewed disclosure pattern, but it must keep every current action reachable
and cannot imply new persistence, filtering, or bulk behavior.

## Shared visual direction

Reuse the approved dark POS Management top header from catalog/printing with
YUTA POS identity, `Gestion locale`, user/role context, return-to-POS action,
and account/sign-out behavior. Do not add a sidebar, drawer, bottom navigation,
or persistent module tabs.

Use Geist Sans, semantic tokens, `@yuta/ui`, and Lucide icons. Preserve visible
text-backed statuses, minimum 44px touch targets where practical, keyboard
access, visible focus, safe dialog scrolling, and no essential hover-only
behavior.

## Responsive behavior

- `1366 × 768`: operational desktop/landscape baseline; rule and group content
  may use columns when labels/actions remain legible.
- `1024 × 768`: compress spacing and action labels without horizontal overflow.
- `768 × 1024`: stack rule/group regions and retain direct primary actions.
- `390 × 844`: single column; keep header/account pattern from the approved
  shared shell, use full-width or clearly wrapped actions, and contain dialogs
  within the viewport.

## States to preserve or depict truthfully

Authenticated populated, no rules, no groups, no eligible items, active lock,
inactive editing, pending, inline validation, name/item conflicts, invalid base
group, invalid quantities, not found/stale data, confirmation, dialog close on
success, invalid-session redirect, and site-agent unavailable.

Visual references may not invent a toast, global notification center, working
search, new field, or new route. Generated text and sample values are
non-authoritative; repository French copy and runtime data win.

## As-built visual resolution

The implementation follows the approved hierarchy and density while retaining
repository-owned cards, badges, buttons, dialogs, semantic tokens, icons, and
real French content instead of copying raster styling. On desktop and tablet,
the expanded rule keeps compact nested group cards. At the narrow breakpoint,
title/actions, rule metadata/actions, group metadata/actions, and eligible-item
rows stack into one readable column rather than reproducing the generated
reference's table-like geometry.

Authenticated Phase 5 evidence confirms zero document-level horizontal
overflow at all four QA viewports. Route-local action targets are at least
`44 × 44`; the shared shell keeps its established responsive sizing. The
`390 × 844` editor uses the full available width, stays within 16 CSS pixels of
the top and bottom viewport edges, scrolls its field region independently, and
keeps save/cancel actions visible.
