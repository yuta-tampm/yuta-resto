# POS Management Reports References

Status: Design references approved; Phase 5 as-built evidence complete

Visibility: Engineering

Reference status: APPROVED

## Current state

`/management/reports` is a `NEW_PAGE`, so no authenticated target baseline
exists. Phase 0 queried no operational data. After explicit Phase 1 approval,
the built-in image generation tool created two fictional design proposals on
2026-08-20:

- `design-proposal-01-desktop.png` — 1672×941 approved desktop direction;
- `design-proposal-02-mobile.png` — 853×1844 approved corrected narrow
  direction;
- `design-proposal-01-mobile.png` — superseded first narrow generation retained
  as DRAFT evidence because its copy incorrectly implied a selectable period.

The product owner approved the first two references on 2026-08-20. They remain
visual authority only, not browser captures or implementation evidence.

## Curated shared-shell context

Use these approved as-built references for Management shell ownership only:

- `../../pos-management-home/references/phase-05-as-built-1366x768.png`;
- `../../pos-management-home/references/phase-05-as-built-390x844.png`;
- `../../pos-management-establishment/references/phase-05-as-built-1366x768.png`;
- `../../pos-management-establishment/references/phase-05-as-built-390x844.png`.

Reuse the dark header hierarchy, account/session area, return-to-POS action,
full-width canvas, and narrow behavior. These images do not authorize report
fields, financial semantics, navigation, routes, APIs, schema, colors, or exact
copy.

## Review boundary

Review shell fidelity, three-metric order, service-day clarity, list density,
mobile stacked rows, refresh, pagination, direct order actions, and exclusions.
Generated copy, values, icons, exact colors, font metrics, dimensions, and state
coverage are illustrative. The generated references remain separate from the
production captures recorded below.

## Phase 5 as-built evidence

Captured on 2026-08-20 from an authenticated production POS build backed only
by isolated disposable PostgreSQL QA data:

- `phase-05-as-built-1366x768.png`;
- `phase-05-as-built-1024x768.png`;
- `phase-05-as-built-768x1024.png`;
- `phase-05-as-built-390x844.png`;
- `phase-05-empty-390x844.png`;
- `phase-05-error-390x844.png`.

The success matrix shows six synthetic orders and the approved 220,40 € paid
principal, three paid orders, and two open orders. A separate temporary 57-row
set verified pagination but was removed before final captures. Every viewport
has zero horizontal document overflow and report actions of at least 44px.
The narrow state captures document real-zero empty behavior and a truthful
route-specific local database failure with retry. Browser warning/error logs
were empty after recovery. These images are implementation evidence, not
operational or production restaurant data.
