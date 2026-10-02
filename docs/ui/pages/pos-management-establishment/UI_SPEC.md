# POS Management Establishment — UI Specification

Status: Phase 5 as-built QA complete

Visibility: Engineering

## Authority and target

Target `apps/yuta-pos`, new page `/management/establishment`, integrated local
management capability delivered from `NEW_CAPABILITY_DISCOVERY`. The route is
linked from the Management hub and uses the real local profile boundary.

## Phase 3 as-built interaction

- the fixture input is editable only inside the development prototype;
- exact value changes show `Modifications non enregistrées`;
- reset restores the initial fixture without a request;
- `Enregistrer (simulation)` shows truthful local feedback and performs no write;
- input is retained after the simulation;
- no unapproved trimming, length, empty-value, role, rename, or conflict rule is applied.

Phase 3 is historical. Phase 4 removed the fixture and simulation.

## Phase 4 as-built states

- absence of the singleton renders an empty `Non configuré` field;
- a saved profile renders `Configuré`, the current value, and local update time;
- edits show `Modifications non enregistrées` and enable reset/save;
- invalid or blank values cannot submit and server validation remains authoritative;
- pending disables the input/actions and labels the save in progress;
- success announces that only future receipts use the saved name;
- site-agent failure shows a truthful retry state;
- stale revision preserves the draft and offers a data reload before retry;
- expired/forbidden sessions use the existing fail-closed Management flow.

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

Clear is not supported. Both active local admin and manager roles may edit.

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

## Visual acceptance

`references/design-proposal-01-desktop.png` and
`references/design-proposal-01-mobile.png` were approved by the product owner
on 2026-08-20 for hierarchy, density, proportions, spacing, responsive
composition, and tone. Exact copy remains repository-owned; use `reçus`, not
the desktop raster's generated `recus`. The references do not authorize data,
permission, contract, schema, receipt, or runtime behavior.

The production as-built captures at 1366x768, 1024x768, 768x1024, and 390x844
confirm the approved focused hierarchy and responsive one-column narrowing.
Every form control measures 48px high and no viewport has horizontal document
overflow. The shared 40px brand/home link remains inherited from the approved
Management header; the other compact header actions measure 44px.

## Out of scope

Legal/fiscal identity, cloud data or synchronization, receipt tax lines,
kitchen/POS-header consumption, audit UI, clearing, and printer/device
configuration.
