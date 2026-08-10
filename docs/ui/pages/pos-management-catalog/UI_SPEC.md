# POS management catalog — UI Specification

Status: Draft design reference

Visibility: Engineering

## Authority and target

Target: existing integrated `apps/yuta-pos` screen `/management/catalog`.
Implementation and current POS documentation remain behavior authority;
baseline and future design images guide visual hierarchy only.

## Current baseline

The page uses a centered `max-w-6xl` stack: page header, three top actions, and
one full-width card per category. Category headers contain badges and compact
actions; article rows contain identity/status/detail text and icon actions. All
create/edit work occurs in dialogs, with the article editor scrolling inside a
tall single column. The authenticated populated catalogue is very long.

## Visual hierarchy

Design is pending. Preserve management context and return, then prioritize the
title, catalogue-wide actions, category identity/status, article identity and
availability, price/station/order details, and direct edit/toggle actions. Error
and conflict recovery must outrank decorative content.

## Content and copy

All operator copy is French. Keep current domain labels and do not rename
`catalogue`, `catégorie`, `article`, station, ordering-policy, instruction, or
variant concepts without approval.

## Service-time / interaction density

Optimize fast scan and touch reachability for 53 catalogue rows. Essential
actions must not become hover-only or disappear behind ambiguous menus.
Reversible hide/unavailable actions must remain clearly distinguished from
physical delete, which does not exist.

## Responsive behavior

Use POS evidence sizes `1366 × 768`, `1024 × 768`, `768 × 1024`, and
`390 × 844`. Keep form/dialog content scroll-contained, stack controls where
needed, retain direct primary actions, and prevent horizontal page or dialog
overflow.

## Accessibility

Preserve semantic headings, accessible names on icon actions, keyboard and
Escape dialog behavior, visible focus, labelled fields/hints, text-backed
statuses, confirmation copy, pending/disabled feedback, and reachable errors.
Touch-critical controls should target at least 44 CSS pixels where practical.

## Visual acceptance

No generated reference is approved. Phase 0 baseline captures are current-state
evidence. Visual acceptance begins only after a generated proposal is reviewed
and explicitly approved.

## Out of scope

No backend, contract, schema, auth, runtime, device, cloud, unrelated route, or
new catalogue capability is authorized by this draft.
