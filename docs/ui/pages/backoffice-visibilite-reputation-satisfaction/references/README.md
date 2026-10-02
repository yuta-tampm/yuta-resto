# Satisfaction client — Reference Metadata

Status: Current baseline plus approved visual proposal

Visibility: Engineering

Reference status: `APPROVED`

Capture date: `2026-09-06` (Europe/Paris)

Route: `/visibilite-reputation/satisfaction`

Runtime/session: local Backoffice with local cloud database; authenticated
synthetic OWNER `owner@luna-restaurant.fr`; active establishment `LUNA`; two
persisted synthetic Direct Customer Feedback records; no production/external
data and no capture-time mutation.

## Authenticated baseline files

| Reference file                | Viewport | Purpose                                                                |
| ----------------------------- | -------- | ---------------------------------------------------------------------- |
| `baseline-owner-1440x900.png` | 1440×900 | Full desktop shell, metrics, filter/list and selected-detail hierarchy |
| `baseline-owner-1024x768.png` | 1024×768 | Current compact desktop/tablet density and wrapping                    |
| `baseline-owner-768x1024.png` | 768×1024 | Current narrow layout, stacking and below-fold pressure                |
| `baseline-owner-390x844.png`  | 390×844  | Current mobile shell, stacked metrics and above-fold content           |

These images capture current implementation only. They are not final visual QA
and do not prove settings states, MANAGER/STAFF behavior or responsive
acceptance for code that does not yet exist.

## Proposed visual authority

| Reference file                | Viewport | Placement and composition                                               |
| ----------------------------- | -------- | ----------------------------------------------------------------------- |
| `proposed-owner-1440x900.png` | 1440×900 | Primary two-column inbox followed by one compact full-width card        |
| `proposed-owner-1024x768.png` | 1024×768 | Scrolled inbox-first flow; full-width Google then two half-width fields |
| `proposed-owner-768x1024.png` | 768×1024 | Scrolled inbox-first flow; three stacked fields and lower-right Save    |
| `proposed-owner-390x844.png`  | 390×844  | Scrolled inbox-first flow; empty single-column form and full-width Save |

Reference generation: built-in ImageGen edit flow grounded in the matching
authenticated baseline. Final selected outputs were resampled to the exact
viewport dimensions and copied here without overwriting any baseline.

All proposal images preserve the same semantic order: header, metrics, inbox,
then secondary settings. The 1024, 768 and 390 images are intentionally
downward-scrolled so the preceding inbox/pagination and following settings card
are visible in one frame. Displayed feedback text and URL strings inside
generated images are illustrative only and never data, copy or behavior
authority.

Visual state variants are specified in `../UI_SPEC.md`: the same card position
handles loading, dirty, invalid, saving, saved/no-change, server error/retry,
conflict/reload and configuration unavailable without a new surface.

## Intentional non-authority

Baseline and proposal references do not define routes, Product scope, authorization,
permissions, contracts, APIs, persistence, runtime/device ownership, business
logic or raw color values. The approved Spec/Design and current repository are
authoritative. Exact SHA-256 values are recorded in the Phase 3A review
evidence.
