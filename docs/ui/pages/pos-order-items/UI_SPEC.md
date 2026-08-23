# POS Order Items - UI Specification

Status: Implemented — combo-completion suggestion surface

Visibility: Engineering

## Authority and target

Existing integrated `apps/yuta-pos` page `/orders/[orderId]/items`. Repository
behavior is authoritative; later images may guide hierarchy only.

## Shared UI context

Use `REUSE_APPROVED_SHARED_SHELL`: the shared prominent desktop
`PosPageShell`/`PosHeader`, logo/home, payment action, and truthful local-service
strip. The shared header has no leading back-arrow action. Below `lg`, retain
the shared compact menu behavior. At every width, the three-line menu exposes
the real `Commandes` -> `/`, `Cuisine` -> `/kitchen`, and `Gestion` ->
`/management` destinations. Keep
current service-time density and adjacent route vocabulary; exclude Backoffice
and management shells. Do not add the Home-only direct `Nouvelle commande`
action.

## Current baseline

Desktop is a fixed-height three-column workspace: category rail, searchable
catalog grid, and current-order summary. Narrow layouts use horizontal category
scroll, catalog grid, and the existing mobile order dialog. Current baseline is
`references/phase-0-current-1366x768.png`.

The combo-suggestion reopening baseline is
`references/phase-0-combo-suggestions-current-1366x768.png`. It demonstrates a
real order containing a Gua Bao while the eligible house iced tea remains in a
different part of the catalog and no shortcut exists.

## Proposed combo-completion hierarchy

When a truthful one-item-away candidate exists, place a compact suggestion
shelf after search and before the standard item grid:

1. text-backed heading such as `Compléter Gua Bao Happy`;
2. one or more real catalog-item actions with name and normal catalog price;
3. no projected discount or savings claim in the first version.

The shelf does not replace category navigation, search, catalog results, or the
current order. It is absent rather than rendered empty. It may appear in any
catalog category when truthful candidates exist. Selecting a category dismisses
the currently visible combo rule states for the route session. Unrelated item
changes do not revive those states; adding another item relevant to a dismissed
rule creates a new state that may appear. The shelf is
also hidden while search has a non-empty query or when the order cannot be
edited. Candidate actions reuse the visual language and minimum touch size of
catalog items but
may be more compact than full item cards.

Design studies must cover one candidate, multiple candidates, duplicate
candidate resolution, no candidate, action pending/error, locked order, and
narrow layouts. No virtual category, persisted favorite, pinning control,
manual dismissal control, ranking setting, badge count, savings estimate, or
analytics UI may be added.

## Visual hierarchy

1. Order identity, back/payment actions, and service health.
2. Category and search controls.
3. Fast item-selection grid with selected quantity.
4. Current order, item attention/status, totals, and kitchen send.
5. Notes/allergy and send-confirmation dialogs when required.

## Post-send success state

After site-agent confirms the kitchen-send transaction, replace the editable
workspace with a dedicated success screen in the current POS shell. Show:

- `Commande envoyée en cuisine`;
- the confirmed sent-item count and current order number;
- `La commande reste ouverte pour le suivi et le paiement.`;
- a visible five-second countdown followed by navigation to `/`;
- primary `Créer une autre commande` to `/pos`;
- secondary `Retour aux commandes` to `/`.

Do not redirect before the approved five-second delay, add a third payment
action, claim physical printing success, or show this state for pending,
validation, conflict, timeout, or failure results. Both actions remain visible
and touch-accessible at every supported width.

## Content and copy

Preserve current French operator labels and real catalog/order content. Do not
invent customer, fiscal, delivery-provider, or table-entity vocabulary.

## Service-time / interaction density

Primary item buttons and send action stay direct, touch-friendly, scannable,
and free of decorative dashboard content. Attention, disabled, and pending
states must not rely on color alone.

## Responsive behavior

Later QA uses 1366x768, 1024x768, 768x1024, and 390x844. Preserve scroll
containment, mobile order-dialog state, and no document-level horizontal
overflow. On tablet and narrow layouts, keep the horizontal category menu
sticky at the top of the route content while catalog results scroll; category
selection uses two compact 44px touch rows to shorten horizontal travel, remains
horizontally scrollable, and does not make the search field sticky. Keep the
mobile search spacing compact so the two-row menu does not unnecessarily consume
the catalog viewport. Present every category as a bordered, filled chip with a
visible focus state; use the semantic success treatment to distinguish the
selected category without relying only on its border.

## Accessibility

Keep keyboard access, visible focus, accessible names for icon-only quantity
controls, dialog focus/Escape behavior, associated errors, text-backed statuses,
and at least 44px effective touch targets for service-critical controls.

## Visual acceptance

The product owner approved the desktop, narrow, and post-send success visual
references on 2026-08-15. They authorize hierarchy, density, spacing, and
responsive direction only. The post-send success visual remains scheduled for
the later interaction phase and does not authorize an untrusted success flag.

## Out of scope

Backend/schema/runtime/device changes, a new shared shell, new navigation,
fixtures, raw colors, new UI frameworks, and unrelated route refactors.
