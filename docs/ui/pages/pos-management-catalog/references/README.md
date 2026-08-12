# POS Management Catalog — Reference Metadata

Status: Approved design reference

Visibility: Engineering

## Authenticated baseline references

Reference files:

- `current-baseline-1366x768.png`;
- `current-baseline-1366x768-full-page.png`;
- `current-baseline-edit-item-dialog-1366x768.png`.

Reference status: `REVIEWED`

Review note: Captured as authenticated current-state evidence on 2026-08-09;
these images establish the real 12-category/53-row catalogue, full long-page
density, current action placement, and complete editor fields. They are not an
approved redesign.

## Generated proposal 01

Reference file: `design-proposal-01.png`

Reference status: `APPROVED`

Review note: Product-owner approved on 2026-08-11 for the dark POS Management
header, absence of a sidebar, 12-category overview, density, disclosure,
action hierarchy, responsive annotations, and state treatment. The displayed
`13,60 €` Mix LUNA price and internal `design-proposal-03` label are documented
raster deviations and must not be copied into implementation.

Purpose: Catalogue overview composition only.

## Generated proposal 02

Reference file: `design-proposal-02.png`

Reference status: `APPROVED`

Review note: Product-owner approved on 2026-08-11 for grouped editor sections,
contained scrolling, responsive stacking, empty variants, availability field,
state annotations, and sticky cancel/save actions. Generated descriptions in
the editor/background and the internal `design-proposal-04` label are
documented raster deviations and must not be copied into implementation.

Purpose: Article editor composition only.

Intentional non-authority: These references do not define routes, product
scope, authorization, permissions, contracts, APIs, persistence,
runtime/device ownership, business logic, or raw color values.

## Phase 1 implementation evidence

Reference files:

- `phase-01-implementation-1366x768.png`;
- `phase-01-implementation-edit-item-1366x768.png`;
- `phase-01-implementation-390x844.png`;
- `phase-01-implementation-edit-item-390x844.png`.

Evidence status: `REVIEWED`

Review note: Captured from the authenticated production build on 2026-08-12
using live local catalogue data. The captures verify the shared POS Management
header, dense expandable catalogue, contained editor, responsive stacking,
sticky mobile actions and absence of horizontal overflow. They are Phase 1
implementation evidence, not final Phase 5 as-built approval.

## Phase 2 regression evidence

Reference file: `phase-02-regression-1366x768.png`

Evidence status: `REVIEWED`

Review note: Captured from the authenticated Phase 2 production build on
2026-08-12 after the route-local component extraction. Its SHA-256 digest is
identical to `phase-01-implementation-1366x768.png`, confirming pixel-identical
desktop output for the reviewed state. Browser checks also confirmed the
article editor, category disclosure, 390 x 844 responsive layout, sticky mobile
actions, absence of horizontal overflow and an empty warning/error console.
