# POS management printing — UI Specification

Status: Approved design reference

Visibility: Engineering

## Authority and target

Target `apps/yuta-pos` route `/management/printing`; `EXISTING_PAGE`;
`device-coupled`. Implementation and current product documentation remain
behavior authority. Visual references guide hierarchy and proportions only.

## Current baseline

The existing management shell renders a page header and back navigation,
followed by printer status, ticket settings and test printing, four queue
metrics, and a paginated recent-ticket list. Status alerts, empty state, action
pending/error/success feedback, and site-agent unavailable state already exist.
The route shows ten jobs per page and refreshes while visible.

## Visual hierarchy

Use proposal 02's dark management header, compact page context, truthful printer
status, wide settings/preview split, compact queue counters, and dense recent-job
table. Keep failure/recovery information and status-specific actions visible.
The header reuses current management home capabilities; it does not authorize a
new global-shell rollout to unrelated routes.

The approved as-built header correction keeps identity on the left and groups
`Retour au POS` with a role-labelled account menu on the right. Sign-out is in
that account menu. At narrow widths, the POS return becomes an accessible
icon-only control while the role label remains visible. `Retour à la gestion`
is page-context navigation directly above the page title, not a centered global
header action.

## Content and copy

Operator-facing copy remains French. Current contract-backed labels and status
meanings are the vocabulary baseline; copy changes require design approval and
must not overstate physical printer readiness.

## Service-time / interaction density

Retain compact operational scanning, visible status text, and reachable
status-specific job actions. A later design must be assessed against the POS
viewport and touch rules rather than Backoffice widths.

## Responsive behavior

At desktop `xl` width (`1280px` and above), show settings and ticket previews
side by side as in the 1366 x 768 composition. Below `xl`, including the
1024 x 768 tablet composition, keep ticket settings collapsed and retain the
compact preview, queue summary, and table/list. Core start, fail, retry, and
reprint actions remain directly reachable and cannot exist only in overflow.
Continue to test the remaining POS viewport matrix during implementation QA.

## Accessibility

Preserve labeled fields, text-backed statuses, visible focus, pending buttons,
inline errors, and keyboard-operable dialogs. Failure confirmation must retain
its required reason and recovery feedback.

## Visual acceptance

`references/design-proposal-02.png` is the `APPROVED` redesign reference. It
preserves the owner-approved proposal 01 visual language, header, and compact
collapse behavior while correcting the recorded domain/state conflicts.
Authenticated current-state captures remain the behavior-preservation baseline.

## Out of scope

Backend, contracts, schema, auth semantics, site-agent routes/services,
worker/device behavior, rollout of the header to other management routes, and
unrelated POS routes are excluded.
