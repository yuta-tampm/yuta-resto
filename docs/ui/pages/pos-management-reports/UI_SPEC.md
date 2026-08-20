# POS Management Reports — UI Specification

Status: Phase 5 responsive and accessibility QA complete

Visibility: Engineering

## Baseline

There is no `/management/reports` page to capture. Baseline status is
`NOT_APPLICABLE`. The design must inherit the approved local Management shell,
not invent a replacement from the hub placeholder.

This remains the truthful pre-capability baseline. The later Phase 2 route is a
development-only, visibly fictional composition and is not an as-built
production baseline. Phase 3 enables browser-local demo controls but still
renders no real order link and cannot leave the prototype for an order.

Phase 4 removes that prototype completely. The current route uses the real
Management session and validated site-agent response, renders direct POS order
links, and implements loading, real-zero/empty, local dependency error/retry,
manual refresh, and bounded pagination. Phase 5 production-build captures now
document the four required viewports plus narrow empty and error states;
generated proposals remain design direction rather than as-built evidence.

## Proposed hierarchy

1. Existing `ManagementHeader` with current local user/role, return-to-POS, and
   sign-out behavior.
2. In-content `Retour à la gestion` link.
3. Page header: eyebrow `Gestion locale`, title `Rapports locaux`, and concise
   copy explaining the current service day.
4. A visible interval label such as `Service du 20 août, 05:00 au 21 août,
05:00` derived from response boundaries, plus a point-in-time refresh action.
5. Three metric cards in this order: `Encaissé aujourd'hui`, `Commandes
payées`, `Commandes ouvertes`.
6. One delivered `Commandes du service` activity section with bounded rows and
   pagination.
7. Truthful empty, error, and recovery presentation in the affected region.

## Metric presentation

- Paid revenue uses French euro formatting from integer minor units.
- Counts are integers and never inferred from the currently visible page.
- Every card includes a short text qualifier; color alone does not define its
  meaning.
- Do not use charts, percentage deltas, arrows, targets, or accounting badges.
- During loading, do not display zero as if it were an actual result.

## Proposed activity row

Approved first-slice fields:

- order number;
- table/service label;
- order type;
- current order status;
- created time;
- paid time when present;
- order total snapshot;
- payment mode when useful to explain split state;
- explicit `Ouvrir la commande` link to `/orders/<orderId>`.

Per-order service-day paid principal is deferred from the first slice.

The row must not expose payment IDs, check IDs, local user IDs, internal
idempotency keys, cancellation reasons, refund reasons, or database metadata.
The whole row may not become a hidden navigation target unless keyboard and
screen-reader behavior remain explicit; a real link is preferred.

## French state copy

- Loading: `Chargement des rapports locaux…`
- Empty: `Aucune activité pour ce service.`
- Empty support: `La journée de service couvre 05:00 à 05:00.`
- Local service error: `Les rapports locaux sont indisponibles.`
- Database support: `Le service local ou la base POS ne répond pas.`
- Retry: `Réessayer`
- Refresh: `Actualiser`
- Session recovery: redirect to Management login with no report content.

The DRAFT references illustrate these approved directions. Generated French
copy remains subject to visual review and repository-authoritative correction.

## Responsive behavior

- Use the POS evidence matrix: 1366×768, 1024×768, 768×1024, and 390×844.
- Three metrics may form three columns, then two/one columns as space narrows.
- The activity list must not require horizontal page scrolling. At narrow width,
  use stacked rows with the same data priority rather than a clipped table.
- Keep the primary order link and refresh action at least 44px high.
- Pagination stays reachable after the list and does not rely on hover.
- Preserve the full-width Management canvas; bound the list content only when
  readability benefits.

## Accessibility

- Use one page `h1`, meaningful section headings, and semantic list/table
  structure appropriate to the final layout.
- Metric labels remain associated with their values.
- Icon-only refresh, if used, has an accessible name and visible focus.
- Loading is announced without repeatedly interrupting the operator.
- Errors identify whether retry or login is the recovery path.
- Statuses have text, not only color.
- Pagination exposes current page and disabled states.

## Intentional exclusions

No date picker, chart, export, accounting terminology, fiscal claim, cloud
selector, sidebar, tabs, filter drawer, payment-method breakdown, printer state,
or edit/payment/refund action belongs in the first design.

## Visual acceptance

The result is an operational summary, not a marketing dashboard. It must be
scannable, compact, consistent with the current Management header and cards,
truthful about 05:00 service-day scope, and usable without horizontal overflow
or hidden core actions.
