# POS Management Establishment — Reference Metadata

Status: Approved visual direction

Visibility: Engineering

## `design-proposal-01-desktop.png`

Reference status: `APPROVED`

Generated: 2026-08-19 with the built-in image generation tool.

Approved: 2026-08-20 by the product owner for visual direction only.

Raster dimensions: 1672 x 941; intended as the 1366 x 768 desktop composition reference.

Purpose: desktop hierarchy, proportions, focused settings composition, spacing,
and shared-shell fidelity.

Review note: The layout correctly limits the page to `displayName`, local-only
copy, immutable prior receipts, and one save action. The subtitle contains a
generated text defect (`recus` rather than `reçus`); exact implementation copy
must use `reçus`.

## `design-proposal-01-mobile.png`

Reference status: `APPROVED`

Generated: 2026-08-19 with the built-in image generation tool.

Approved: 2026-08-20 by the product owner for visual direction only.

Raster dimensions: 853 x 1844; intended as the 390 x 844 narrow composition reference.

Purpose: narrow responsive hierarchy, shell compression, one-column flow,
touch-target direction, and overflow review.

Review note: The mobile proposal preserves the compact Management shell and
one-task form. Exact dimensions and touch targets remain implementation QA
requirements rather than facts established by the raster.

## Shared-shell inputs

- `../../pos-management-home/references/phase-05-as-built-1366x768.png`;
- `../../pos-management-home/references/phase-05-as-built-390x844.png`.

Generated images are visual authority only for the explicitly approved
hierarchy, density, proportions, spacing, responsive composition, and tone.
They do not define routes, product scope, authorization, permissions, contracts,
APIs, persistence, runtime/device ownership, business logic, exact copy, or raw
color values.

## Phase 5 as-built evidence

Captured on 2026-08-20 from the authenticated production POS build with the
configured local `LUNA` profile:

- `phase-05-as-built-1366x768.png`;
- `phase-05-as-built-1024x768.png`;
- `phase-05-as-built-768x1024.png`;
- `phase-05-as-built-390x844.png`.

All captures show the real configured read state. The matrix has zero
horizontal document overflow, empty warning/error logs, and 48px form controls.
No save, print job, active order, seed, reset, or cloud request was created for
these images. The narrow capture truthfully continues below the viewport to the
local-only notice.
