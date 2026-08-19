# POS Management Establishment — UI Specification

Status: Phase 0 design input

Visibility: Engineering

## Authority and target

Target `apps/yuta-pos`, new page `/management/establishment`, integrated local
management capability under `NEW_CAPABILITY_DISCOVERY`. No UI is implemented.

## Shared UI context

Use `REUSE_APPROVED_SHARED_SHELL`: the current dark `ManagementHeader`, local
user/role context, return-to-POS control, account/sign-out menu, and an
in-content `Retour à la gestion` link. Use full viewport width and the current
management content padding. Do not add a sidebar, bottom navigation, persistent
tabs, Backoffice navigation, or a second account area.

## Proposed hierarchy

1. Shared Management header.
2. `Retour à la gestion` context link.
3. Page header: eyebrow `Gestion locale`, title `Établissement`, and concise
   non-fiscal/local-only explanation.
4. One focused settings card, not a dashboard.
5. Field label `Nom affiché du restaurant` with help text explaining future
   non-fiscal receipt use.
6. Saved/current value or truthful unconfigured state.
7. Direct `Enregistrer` action and recoverable status feedback.
8. A restrained notice: old receipt snapshots are not rewritten after rename.

Exact destructive/clear copy and role-specific copy remain pending approval.

## Required states

- loading skeleton without fabricated value;
- unconfigured state with empty field and explanatory copy;
- configured read state;
- editing with dirty-state visibility;
- field validation error associated with the input;
- disabled/pending save with retained input;
- persisted success announced with `role=status` or equivalent;
- stale/conflict state that preserves input and offers reload/retry;
- site-agent/database unavailable error and retry;
- expired/forbidden session through the existing fail-closed management flow;
- recovery after load/save failure.

## Responsive and accessibility

Use the POS matrix 1366x768, 1024x768, 768x1024, and 390x844. Keep the form
readably bounded within the full-width operational canvas, with no horizontal
overflow. Controls need visible focus, programmatic label/help/error links,
textual status, keyboard submission, and at least 44px touch targets at tablet
and narrow widths. Do not rely on color alone.

## Visual acceptance gate

No page reference exists. A later generated proposal remains `DRAFT` until
reviewed. It may guide hierarchy, density, proportions, spacing, and tone only.

## Out of scope

Runtime implementation, fixtures, new navigation before approval, legal/fiscal
identity, cloud data, receipt tax lines, kitchen/POS header consumption, audit
UI, and printer/device configuration.
