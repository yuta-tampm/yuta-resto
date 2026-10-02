# POS management catalog — UI Specification

Status: Implemented

Visibility: Engineering

## Authority and target

Target: existing integrated `apps/yuta-pos` screen `/management/catalog`.
Implementation and current POS documentation remain behavior authority;
baseline and future design images guide visual hierarchy only.

## As-built implementation

The page reuses the dark POS Management header without a sidebar, followed by
return navigation, a title card, catalogue-wide actions and a dense expandable
catalogue. Desktop article rows expose labelled columns and compact direct
actions. Tablet and mobile layouts stack category metrics and article metadata
into touch-oriented cards while retaining the same real actions and states.

Create/edit work remains dialog-based. The article editor uses two contained
columns at 1024 CSS pixels and above, one contained column below that breakpoint,
internal scrolling and a visible action footer. The authenticated populated
catalogue remains backed by live local data rather than design fixtures.

## Visual hierarchy

Use the approved POS Management dark top-header direction with no sidebar.
Preserve management context and return, then prioritize the title,
catalogue-wide actions, category identity/status, article identity and
availability, price/station/order details, and direct edit/toggle actions. Error
and conflict recovery must outrank decorative content.

## Content and copy

All operator copy is French. Keep current domain labels and do not rename
`catalogue`, `catégorie`, `article`, station, ordering-policy, instruction, or
variant concepts without approval.

## Service-time / interaction density

Optimize fast scan and touch reachability for 53 catalogue rows. Essential
actions must not become hover-only or disappear behind ambiguous menus.
Reversible hide/unavailable actions must remain clearly distinguished from
physical delete, which does not exist.

## Responsive behavior

Use POS evidence sizes `1366 × 768`, `1024 × 768`, `768 × 1024`, and
`390 × 844`. Keep form/dialog content scroll-contained, stack controls where
needed, retain direct primary actions, and prevent horizontal page or dialog
overflow.

## Accessibility

Preserve semantic headings, accessible names on icon actions, keyboard and
Escape dialog behavior, visible focus, labelled fields/hints, text-backed
statuses, confirmation copy, pending/disabled feedback, and reachable errors.
Touch-critical controls should target at least 44 CSS pixels where practical.

## Visual acceptance

Proposal 01 is approved for the shared header, dense catalogue overview,
category disclosure, action hierarchy, responsive annotations, and state
treatment. Proposal 02 is approved for the two-column editor, contained
scrolling, empty-variant treatment, responsive stacking, and sticky actions.

Approval does not make raster text authoritative. Use current catalogue data,
contracts, and French copy. Known deviations are the incorrect `13,60 €` Mix
LUNA price in proposal 01, generated item-description errors in proposal 02,
and internal proposal labels that differ from the stored filenames.

## Out of scope

No backend, contract, schema, auth, runtime, device, cloud, unrelated route, or
new catalogue capability is authorized by this approval.
