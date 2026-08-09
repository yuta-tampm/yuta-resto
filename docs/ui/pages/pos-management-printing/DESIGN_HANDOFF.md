# POS management printing — Design Handoff

Status: Draft

Visibility: Engineering

## Phase 0 source

The completed Implementation Inventory is in `README.md`. The target is the
existing device-coupled `apps/yuta-pos` screen `/management/printing`. Its goal
is to let an authenticated local admin or manager inspect printer/queue state,
adjust supported ticket settings, create a test print, and recover jobs while
preserving the `yuta-pos -> site-agent -> db-pos/device` boundary.

## Current baseline capture

Baseline status: `CAPTURED`

Captured on 2026-08-09 from `http://localhost:3003/management/printing` with the
local POS and site-agent running and an authenticated `admin` management
session. The real populated state showed a non-configured RFCOMM channel, local
worker disabled, three pending jobs, no printing/printed/failed jobs, current
ticket settings, ticket previews, test-print control, and recent-ticket actions.

Files:

- `references/current-baseline-1366x768.png` — top viewport at `1366 x 768`;
- `references/current-baseline-1366x768-middle.png` — settings and preview
  section at `1366 x 768`;
- `references/current-baseline-1366x768-queue.png` — test and queue metrics at
  `1366 x 768`;
- `references/current-baseline-1366x768-tickets.png` — populated recent tickets
  at `1366 x 768`;
- `references/current-baseline-1024x768.png` — compact top viewport at
  `1024 x 768`.

The empty queue, active printing, failed job, printer attention/unavailable, and
physical-printer states were not captured because reaching them would require
mutating real queue/device state. They remain required design states grounded
in current code/contracts and later functional/device QA, not fabricated
baseline images.

## Design-generation prompt

Design prompt status: `READY`

### Ready-to-use prompt

Create a high-fidelity visual redesign proposal for YUTA's existing local POS
management screen `/management/printing`. This is an operational French
restaurant interface, not a marketing dashboard. Produce the primary desktop
design at 1366 x 768 and show how it adapts to 1024 x 768. Use the attached
current authenticated baseline screenshots as visual input once available.

Preserve these existing capabilities and hierarchy: page title and management
back navigation; truthful printer-channel status; ticket settings for Cuisine
and BAR copy counts, compact/standard/large font preset, and top/left/bottom
spacing; side-by-side ticket previews; explicit test printing; complete-queue
counts for pending, printing, printed, and failed jobs; ten-item paginated recent
ticket queue; status-specific start, printed, failure-with-required-reason,
retry, and reprint actions; links to existing orders when present; empty,
pending, success, conflict, failed, unavailable, and recovery states.

Prioritize fast scanning, compact operational density, visible printer/failure
information, large reachable actions, clear selected/disabled/pending feedback,
mouse/keyboard/touch usability, visible focus, text-backed status, and no
horizontal overflow. Use YUTA's Geist Sans with Inter and sans-serif fallback,
semantic surface/text/border/status colors, reusable card/form/dialog/table or
list patterns, and Lucide-style icons. Do not prescribe raw color values or
introduce another component library.

The design must preserve these behavioral constraints: only a validated local
admin or manager session may access the screen; all queue/settings operations
remain owned by the site-agent and local db-pos; print data never synchronizes
to cloud persistence; visible-page refresh remains five seconds with immediate
focus/visibility refresh and no hidden-page refresh; printer-status polling
must not open, claim, read, or write RFCOMM; only explicit print/test work uses
the device path; a ready channel is not proof of paper or physical printer
success; real integrated data and actions must not be replaced with fixtures.

Do not invent printer pairing/discovery, hardware configuration, bulk queue
commands, new filters or fields, cloud sync, new roles, new job states, new APIs,
schema changes, automatic hardware probing, payment behavior, or unrelated POS
navigation. If a proposed visual element would require one of these concepts,
label it as excluded rather than drawing it as available.

Return a design proposal only, not implementation code. Include the default
populated view plus compact annotations for responsive stacking and the
printer-unavailable, empty-queue, action-pending, validation-error, and conflict
states. Keep all user-facing labels in French. Optimize hierarchy, spacing,
density, and action reachability while retaining every protected behavior.

## Handoff result

`references/design-proposal-01.png` was reviewed on 2026-08-09. The product owner
approved its overall UI language, the new dark management header, and collapsed
settings at tablet width and below. Repository verification confirmed that the
header's connected-user context, `Retour au POS`, and sign-out behavior already
exist on the management home route and can be reused without inventing auth
capability. This approval is scoped to the printing screen; rollout to other
management routes remains out of scope.

`references/design-proposal-02.png` is the approved corrected reference. It keeps the
approved proposal 01 visual decisions and corrects:

- non-configured printer status, worker state, last-print absence, and neutral
  status presentation;
- contract-backed job title, printer/source, timestamps, item counts, order
  links, and visible status-specific actions;
- all four queue counters and fixed ten-job pagination;
- reachable failure-reason validation and current ticket-not-found recovery;
- direct compact actions while keeping settings collapsed below `xl`.

The product owner explicitly approved proposal 02 on 2026-08-09. The design
handoff is complete and the package may advance to the implementation-ready gate.
