# POS Kitchen — UI Specification

Status: Approved dense TV design and live-catalog course ordering implemented

Visibility: Engineering

## Authority and target

Target: `apps/yuta-pos` route `/kitchen`, `PAGE`, `EXISTING_PAGE`, integrated,
using `EXISTING_CAPABILITY_RENEWAL`. Current product documentation and runtime
behavior remain authoritative. The generated TV reference is approved for
presentation direction, not as a source of new behavior or data contracts.

## Shared UI context

Use `REUSE_APPROVED_SHARED_SHELL`: `PosPageShell`, prominent `PosHeader`, the
compact shared menu below `lg`, `PosConnectivityStatus`, and the full-viewport
operational canvas. Keep only the real shared navigation destinations `/`,
`/kitchen`, and `/management`. Kitchen owns station/queue navigation and item
actions. Do not introduce a sidebar, breadcrumb, bottom navigation, account
area, management shell, or new destination.

## Current baseline

At 1366x768 the current route has a dark full-width header with the logo/title,
description, 0-article badge, and 48px menu trigger. The health strip reports
local-service and safe printer state. Two horizontal segmented rows select
station and status, followed by a large queue surface and a timestamp/footer.
The persisted baseline is empty across all filters.

At 390x844 the 0-article header badge is hidden, the compact 44px menu is used,
and both segmented rows scroll horizontally inside the subheader. The document
itself has no horizontal overflow. Current segmented links are 36px high.

When populated, each order is a card. Its heading owns table/reference,
order type, optional paid/cancelled badge, order number, order allergy
compatibility alert, order note, row count, and elapsed label. Each item row
shows quantity, name/status, item allergy confirmation, quick instructions,
variants, note, and the current two-action transition group.

The compact header emphasizes service mode with a larger solid semantic badge:
`Sur place` uses success green, `À emporter` uses warning amber, and
`Livraison` uses information blue. The order note remains a separate full-width
information panel, but the redundant `Note commande:` prefix is omitted because
the note icon and panel treatment already communicate its role.

After allergy acknowledgement or Kitchen confirmation, the leading warning
triangle is replaced in place by the green shield icon. Do not append a second
confirmation icon at the end of the alert. The leading triangle or shield is
vertically centered against the alert's text block.

Production-row balance keeps the 44px Ready target but gives the content side
matching visual weight: item names render in uppercase at 15px/900 and the
quantity marker uses a 32px square with 16px bold numerals. Quantity and item
name are vertically centered as one content group against the Ready control.

## Implemented mixed-completion ticket behavior

The current route treats queue selection at the order-group level rather than
removing individual rows as soon as their item status changes. In
`À préparer`, unfinished active items remain first. When an item becomes
`Prêt`, it moves below unfinished rows at the bottom of the same ticket, uses a
restrained green-gray surface and strikethrough on its name and modifiers. Do
not insert a dynamic completed-section label: changing one item must not add a
row or increase the ticket height. The redundant row-level `Prêt` badge is
omitted, and only the `Réouvrir` correction remains reachable.

The fixed ticket header shows `N à faire · N terminés`. The ticket moves to the
`Prêt` queue automatically only after every active production row is ready; do
not add a manual whole-order completion action. If a ready row is reopened, the
ticket returns to or remains in `À préparer`. Within each section, preserve
the existing stable item order; do not invent a completion timestamp solely for
sorting.

Active ticket placement is status-stable: sort only by the ticket's earliest
persisted kitchen-send timestamp, oldest first, with deterministic order ID as
a tie-breaker. Starting, partially completing, or undoing preparation must not
change rank while the ticket remains in `À préparer`.

Ticket separation remains visually explicit on the dense TV board. Preserve the
4 px status-colored top edge, use 2 px neutral side and bottom borders, and keep
14 px of horizontal and vertical space between adjacent tickets. This stronger
outline must not increase the ticket width or add decorative inner padding.

Within unfinished Cuisine rows, category/course priority is `Entrées` first,
followed by other categories in current catalog order. On the combined screen,
Bar rows precede Dessert rows. Entrées use the warning-soft item surface and Bar
uses the info-soft item surface so course/station boundaries remain visible
without adding section-heading height. Completed rows remain last regardless of
category and retain the ready surface.

## Visual hierarchy

Any later proposal should keep this scan order:

1. shared title and truthful service/device health;
2. selected production screen and ticket count;
3. selected active/ready queue and ticket count;
4. compact, directly reachable `Son` on/off control;
5. time-sensitive order groups, with allergy warnings before ordinary notes;
6. item identity, quantity, instructions/options, current state, and direct
   transition actions;
7. last-refresh information.

The Kitchen queue is an operational work surface, not a dashboard. Do not add
marketing metrics, decorative charts, financial summaries, or hidden primary
actions.

## Content and copy

Operator copy remains French. The screen labels are `Cuisine` and one combined
two-line `Bar` / `Desserts` button. Queue labels include `À préparer` and
`Prêt`. `En préparation` remains an underlying
item status but is not repeated as a row badge or exposed as a queue tab. Other
labels include `Tout préparer`,
`Réouvrir`, `Confirmer l'allergie`, `Cuisine informée`, and
`Aucun article`. The audio control uses the compact visible label `Son`, with
accessible names `Activer le son` and `Désactiver le son`; its green state means
audio is active. A later implementation should correct missing French accents
consistently only within approved presentation scope and without changing
contract/status values.

## Service-time / interaction density

Keep station/queue switching and each applicable status transition directly
reachable. Allergy information must be more prominent than normal preparation
notes and must not be collapsed by default. Use text-backed status, large
touch targets, and compact grouping that remains readable at restaurant tablet
density. Keep the preparation control in the ticket header: flame starts the
ticket, then an undo icon remains in the same position to recover an accidental
start. These header-only controls occupy the two-row action area as a centered
44px square, making the action prominent without adding a new row; item
transition controls retain their 44px square target. Keep `Prêt` on unfinished
rows and keep the single ready-row reopen action direct rather than hiding it
behind shared navigation.

The approved generation direction treats a wall-mounted 16:9 TV as the primary
Kitchen canvas. Use as many readable fixed-width ticket columns as fit the
effective viewport; there is no hard maximum column count. Tickets have a
viewport-bounded maximum height; only an overflowing ticket body receives an
independent vertical scrollbar. Short tickets do not show an inactive
scrollbar. The ticket header remains fixed while its item body scrolls. Keep the
selected screen and selected queue as one compact control band. The grid must
show only the selected derived ticket queue, while an in-progress ticket may
retain ready rows at its bottom; it is not a three-column status board. Preserve
item-level actions. Elapsed time may be prominent, but do not invent
warning/late thresholds until product rules define them.

Allergy names and allergy notes must be fully visible before ordinary
preparation notes. An unconfirmed allergy summary and confirmation action stay
pinned directly below the fixed ticket header, outside the scrolling item body,
so they cannot be scrolled out of sight. A confirmed allergy summary may use
the same pinned position. Structured quick instructions, variants, and
free-text notes wrap to complete content inside the scrolling body. Do not use
ellipsis, hover, tooltip, accordion, or `voir plus`. Allergy uses the strongest
visual treatment; structured modifiers are secondary; an ordinary note uses a
labeled, lower-emphasis panel.

## Responsive behavior

Use the POS evidence matrix:

```text
1920 x 1080 (primary wall-mounted TV proposal)
1366 x 768
1024 x 768
768 x 1024
390 x 844
```

The current implementation remains full viewport with internal vertical
scrolling. Station and status navigation may scroll within their own rows at
narrow widths; document horizontal overflow is forbidden. At narrow widths
item actions may stack or use a full-width grid, but both the item context and
current action remain visible. Review the current 36px filter controls against
the POS 44px touch target rule in the eventual approved design.

For the TV proposal, the order track uses continuous free horizontal scrolling,
not page-sized snapping. The number of visible columns is calculated from the
effective viewport and a minimum readable ticket width; wider viewports expose
more columns, while additional tickets continue to the right. The operator may
stop at any horizontal position; no automatic carousel moves the queue. Each
overflowing ticket body owns its vertical scroll position. The document itself
still must not overflow horizontally: the queue owns the contained horizontal
scroll region.

Physical screen size alone does not increase the column count. Responsive
column count follows the effective CSS viewport while preserving a readable
minimum ticket width. It is deliberately uncapped; free horizontal scrolling
continues beyond the visible columns at every size.

## Accessibility

- Preserve accessible names for the logo and compact menu.
- Keep selected screen/queue communicated by more than color and retain
  their text/counts.
- Maintain visible focus and keyboard operation for links/forms.
- Provide a real pending/disabled state before preventing repeated command
  activation in any approved implementation.
- Keep the Ready action disabled for an unconfirmed allergic item and explain
  the required confirmation in visible text.
- Use live/status feedback for command conflicts or failures if approved; do
  not rely on a silent refresh as the only operator explanation.
- Keep touch-critical actions at least 44px where the POS rules apply.

## Visual acceptance

The Entrées-first auto-column image is the approved presentation reference. It
demonstrates six complete readable columns plus a partial seventh on a wider
effective viewport, category sections, independent ticket scrolling, progress,
and completed-row treatment. Generated counts/content are illustrative. The route now
implements dense content-height packing, independent long-ticket scrolling,
and the approved ticket queue/count projection, and the explicitly approved
mutable live-catalog join for Entrées-first ordering.

## Out of scope

Backend/schema/contracts, auth, transaction/idempotency, polling cadence,
printer routing/settings, physical device behavior, new routes, shared-shell
redesign, fixtures, and unrelated POS pages.
