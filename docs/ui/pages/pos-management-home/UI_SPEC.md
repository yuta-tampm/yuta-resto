# POS Management Home - UI Specification

Status: Phase 0 design input

Visibility: Engineering

## Phase 0 baseline

The Phase 0 hub used a standalone `PageHeader` and a responsive card grid. Each
card showed an icon, availability badge, title, description, and optional open
action. At narrow width the cards stacked without requiring a new navigation mode.

## Phase 1 as-built baseline

The hub now reuses the approved shared management header and places a compact
orientation `PageHeader` above the same five modules. Available cards have
consistent full-width actions; reports uses a muted dashed card without an
action. Desktop keeps a three-column grid and narrow view stacks one column
with natural vertical scrolling.

## Proposed hierarchy for design

1. Reuse the approved compact dark POS Management header.
2. Present a concise hub title and orientation copy below the shell.
3. Keep the four available modules visually primary and directly actionable.
4. Keep `Rapports locaux` visibly secondary and unmistakably unavailable.
5. Preserve clear return-to-POS and account/sign-out access in the shared header.

## Responsive and accessibility requirements

- Use a scannable desktop grid and one-column narrow composition.
- No horizontal overflow at 1366x768, 1024x768, 768x1024, or 390x844.
- Preserve visible focus, accessible link/button names, text-backed statuses,
  keyboard order, and touch-friendly targets.
- Do not rely on color, icon shape, or hover alone to communicate availability.

## Visual acceptance

Use YUTA semantic tokens, Geist Sans, `@yuta/ui`, and Lucide. Generated imagery
may guide hierarchy, density, spacing, and proportions only; repository
components, runtime copy, real routes, auth, and semantic states remain authority.
