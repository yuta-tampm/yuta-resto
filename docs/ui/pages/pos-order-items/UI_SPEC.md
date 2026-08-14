# POS Order Items - UI Specification

Status: Draft design reference

Visibility: Engineering

## Authority and target

Existing integrated `apps/yuta-pos` page `/orders/[orderId]/items`. Repository
behavior is authoritative; later images may guide hierarchy only.

## Shared UI context

Use `REUSE_CURRENT_TARGET`: compact dark POS header, logo/home, back action,
payment action, and truthful local-service strip. Keep current service-time
density and adjacent route vocabulary; exclude Backoffice and management shells.

## Current baseline

Desktop is a fixed-height three-column workspace: category rail, searchable
catalog grid, and current-order summary. Narrow layouts use horizontal category
scroll, catalog grid, and the existing mobile order dialog. Current baseline is
`references/phase-0-current-1366x768.png`.

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
- primary `Créer une autre commande` to `/pos`;
- secondary `Retour aux commandes` to `/`.

Do not auto-redirect, add a third payment action, claim physical printing
success, or show this state for pending, validation, conflict, timeout, or
failure results. Both actions remain visible and touch-accessible at every
supported width.

## Content and copy

Preserve current French operator labels and real catalog/order content. Do not
invent customer, fiscal, delivery-provider, or table-entity vocabulary.

## Service-time / interaction density

Primary item buttons and send action stay direct, touch-friendly, scannable,
and free of decorative dashboard content. Attention, disabled, and pending
states must not rely on color alone.

## Responsive behavior

Later QA uses 1366x768, 1024x768, 768x1024, and 390x844. Preserve scroll
containment, mobile order-dialog state, category/search position, and no
document-level horizontal overflow.

## Accessibility

Keep keyboard access, visible focus, accessible names for icon-only quantity
controls, dialog focus/Escape behavior, associated errors, text-backed statuses,
and at least 44px effective touch targets for service-critical controls.

## Visual acceptance

No design reference is approved. Phase 0 acceptance is limited to the truthful
baseline and ready prompt. `design-proposal-03-send-success.png` is the `DRAFT`
visual proposal for the approved post-send success requirement.

## Out of scope

Backend/schema/runtime/device changes, a new shared shell, new navigation,
fixtures, raw colors, new UI frameworks, and unrelated route refactors.
