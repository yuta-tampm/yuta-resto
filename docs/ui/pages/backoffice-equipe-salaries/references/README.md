# Backoffice Équipe — Salariés — Reference Metadata

Status: Approved design reference

Visibility: Engineering

Reference file: `design-proposal-desktop-01.png`; `design-proposal-mobile-01.png`

Reference status: `APPROVED`

Approved scope/date or review note: Generated on 2026-08-12 and approved for
Phase 1 visual direction on 2026-08-13 after selective feedback reconciliation.

Purpose: Explore page hierarchy, proportions, density, action priority,
responsive behavior, and visual tone for desktop and mobile.

Intentional non-authority: A future reference may guide hierarchy,
proportions, spacing, density, and visual tone only. It does not define routes,
scope, authorization, contracts, APIs, persistence, runtime ownership, business
logic, legal compliance, or raw color values.

## Draft references

### `design-proposal-desktop-01.png`

- corrected desktop overview;
- retains the approved Backoffice shell direction and current navigation labels;
- explores compact summary metrics, employee filters/table, and contained detail;
- replaces a rejected first generation that invented routes and a manager field.

### `design-proposal-mobile-01.png`

- mobile responsive study with no desktop sidebar;
- explores compact metrics, search/filter, segmented views, employee cards,
  touch-friendly actions, and vertical scrolling;
- keeps the demonstration-data label visible.

## Review boundary

The references do not approve fixture values, names, counts, dates,
qualifications, contract vocabulary, establishment/account data, shared shell
changes, backend fields, authorization, persistence, legal behavior, or exact
generated copy. They contain no production data.

Shared reference: `docs/ui/references/yuta-shell-brand-reference.png`.

Selective feedback review: `CURRENT_UI_AUDIT.md`.

## Documents Phase 0 containing-page context

On 2026-08-15, the current authenticated local OWNER view at
`http://localhost:3001/equipe/salaries` was inspected at a desktop viewport.
The inspection confirmed the explicitly opened right overlay drawer, current
employee header/actions, tabs `Vue d'ensemble`, `Identité`, `Relation de
travail`, `Historique`, and `Consultations`, responsive 48 rem maximum width,
and absence of a Documents surface.

The Documents capability itself is absent, so its baseline is
`NOT_APPLICABLE`. The current implementation plus the two approved page design
references form the curated visual context for its design prompt. The generated
Documents references were approved on 2026-08-15 for the typed-fixture Phase 1
prototype only.

The 48 rem value above records the historical pre-Documents baseline. The
current approved as-built drawer uses a 60 rem desktop maximum, up to 88% of the
1024 px viewport, and full width at 768 px and below.

## Documents design proposals — APPROVED FOR PHASE 1

Documents reference status: `APPROVED FOR PHASE 1 PROTOTYPE ONLY`

Generated with the approved Phase 0 prompt on 2026-08-15:

### `documents-design-proposal-desktop-01.png`

- wide desktop overlay drawer with the active sixth `Documents` tab;
- compact document rows, available/processing states, and restrained actions;
- underlying Salaries page remains visually separate beneath the overlay.

### `documents-design-proposal-tablet-1024-01.png`

- compact desktop/tablet adaptation with the same hierarchy and actions;
- preserves scan speed while keeping the drawer separate from the page below.

### `documents-design-proposal-tablet-768-01.png`

- full-width tablet portrait drawer;
- document actions adapt below each row without overflow.

### `documents-design-proposal-mobile-01.png`

- 390 px full-width drawer with stacked document cards and touch-sized actions;
- preserves all dossier tabs and keeps `Documents` visibly active.

All four images are visual proposals only. Names, filenames, dates, sizes,
categories, counts, and copy are fictional/non-authoritative design examples.
They do not approve document requirements, authorization, contracts, schema,
storage, upload/download behavior, security processing, retention, legal
compliance, or real implementation. Product review approved these references on
2026-08-15 only for a typed-fictional-fixture presentation prototype.

## Documents Phase 5 as-built evidence

The following signed-in local captures document the implemented empty state and
responsive drawer after functional/security QA:

- `documents-phase-5-as-built-1024x768.png`;
- `documents-phase-5-as-built-768x1024.png`;
- `documents-phase-5-as-built-390x844.png`.

These images are implementation evidence, not approval for production document
storage. Production remains fail-closed until the separate legal, retention,
EU-provider, backup/restore, monitoring, and incident-response gates are closed.

## Documents Wave B Phase 0 context — signed amendments

The three Documents Phase 5 as-built captures above are the approved containing-
surface context for signed-amendment discovery. They show the real drawer,
Documents tab, signed-contract boundary, protected-access treatment, action
hierarchy, and responsive behavior. No amendment row/action exists, so the new
capability baseline is `NOT_APPLICABLE`.

No new image was generated in Phase 0. The ready prompt in `DESIGN_HANDOFF.md`
must be explicitly authorized before execution, and every generated image will
start as a `DRAFT` visual proposal.
