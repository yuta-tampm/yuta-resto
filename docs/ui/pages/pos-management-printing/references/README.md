# POS management printing — Reference Metadata

Status: Approved design and as-built evidence

Visibility: Engineering

Reference file: `design-proposal-02.png`

Reference status: `APPROVED`

Approved scope/date or review note: Product owner approved proposal 02 on
2026-08-09. Proposal 01's visual language, new management header, and collapsed
tablet settings were retained; proposal 02 applies the remaining corrections.
Current baseline evidence was captured on the same date.

Current baseline status: `CAPTURED`

## Draft design proposal

- `design-proposal-01.png` — combined wide, compact, and special-state design
  board; superseded draft retained for design history.
- `design-proposal-02.png` — active corrected wide, compact, and special-state
  design board; status `APPROVED`.

Review result: proposal 02 retains the improved density, header, wide
settings/preview composition, collapsed tablet settings, compact queue summary,
status chips, and state-board concept. It corrects printer-state truth, queue
mapping, fixed page size, visible status-specific actions, and validation/conflict
examples. Full approved decisions are recorded in `../DESIGN_HANDOFF.md`.

## Current baseline files

- `current-baseline-1366x768.png` — authenticated top viewport; route
  `/management/printing`; populated queue; printer not configured; POS and
  site-agent running; `1366 x 768`.
- `current-baseline-1366x768-middle.png` — authenticated settings, ticket
  previews, save, and test-print region; `1366 x 768`.
- `current-baseline-1366x768-queue.png` — authenticated test-print and queue
  metrics region; `1366 x 768`.
- `current-baseline-1366x768-tickets.png` — authenticated populated recent-job
  list and current actions; `1366 x 768`.
- `current-baseline-1024x768.png` — authenticated compact top viewport; same
  runtime/session/state; `1024 x 768`.

## Phase 1 implementation evidence

- `phase-01-implementation-1366x768.png` — authenticated production-build
  desktop capture after the Phase 1 implementation; real populated queue,
  printer not configured, and current local POS/site-agent data; `1366 x 768`.

Phase 5 later completed the production-browser tablet and narrow captures.

## Phase 3 interaction evidence

- `phase-03-validation-error.png` — authenticated browser capture of the
  approved failure dialog after an empty submission; the queue was not mutated,
  the field reports the linked required error, and current background data
  remains real.

## Phase 5 as-built evidence

- `phase-05-as-built-1366x768.png` — authenticated production desktop layout
  with the corrected right-aligned header actions, page-context breadcrumb, and
  settings plus ticket previews side by side.
- `phase-05-as-built-1366x768-account-menu.png` — authenticated production
  desktop layout with the role-labelled account menu open, including current
  user/role context and the existing sign-out action.
- `phase-05-as-built-1024x768.png` — authenticated compact landscape layout
  with settings collapsed by default.
- `phase-05-as-built-1024x768-settings.png` — the same compact viewport with
  the aligned settings grid explicitly expanded.
- `phase-05-as-built-768x1024.png` — authenticated portrait tablet layout.
- `phase-05-as-built-390x844.png` — authenticated narrow fallback layout.

The viewport evidence was refreshed after the approved post-Phase 5 header
usability correction. On the narrow capture, the POS return is icon-only with
an accessible name while the account role remains visible.

All Phase 5 captures use the real populated local queue and truthful
printer-not-configured state. Document client and scroll widths matched at each
viewport, compact interactive controls measured at least 44 pixels high, and
the production console was clean. No physical printer output is claimed.

These files document the current visual state only. They are not an approved
redesign and do not authorize implementation changes.

Purpose: Supply current hierarchy, proportions, density, wrapping, and real
state evidence to the design-generation prompt and later visual comparison.

Intentional non-authority: These references do not define routes, product
scope, authorization, permissions, contracts, APIs, persistence, runtime/device
ownership, business logic, or raw color values.
