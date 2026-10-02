# POS Kitchen — Reference Metadata

Status: Phase 0 evidence plus approved TV design reference

Visibility: Engineering

## `draft-tv-entrees-first-auto-columns-16x9.png`

Reference status: `APPROVED`

Approved on 2026-08-18 as the current generated design reference.

Generation: 2026-08-18, built-in ImageGen edit of the mixed-completion DRAFT.
Native artifact dimensions are 1672x941 (16:9), representing a wider effective
viewport rather than a fixed physical TV size.

Purpose: remove the four-column assumption and demonstrate six complete
readable columns plus a partial seventh, with continuous horizontal scrolling.
Within unfinished rows, visible `ENTRÉES` sections precede `PLATS`; `Terminés`
remains last. Existing progress, allergy, actions, and independent ticket
scrolling remain visible.

Approval scope: presentation direction for Phase 1. Approval does not make the
illustrative ticket data authoritative and does not approve later behavior or
contract changes.

Truthfulness: category labels and 37-row counters are illustrative design data.
The current order-detail contract has no category snapshot, so this image does
not approve a live-catalog join, schema change, contract change, or historical
sorting rule.

## `draft-tv-completed-items-grouping-16x9.png`

Reference status: `DRAFT` superseded interaction design; not approved or
implemented

Generation: 2026-08-18, built-in ImageGen edit of the independent-ticket-scroll
DRAFT. Native artifact dimensions are 1672x941 (16:9).

Purpose: show mixed completion within an `En préparation` ticket. Unfinished
items remain first; ready items move to `Terminés`, use a green-gray surface,
check, explicit `Prêt` label, and strikethrough, while `Réouvrir` and `Envoyé`
remain available. Headers show `N à faire · N terminés`. Long ticket bodies
retain independent vertical scrollbars.

Truthfulness: no fully ready ticket remains in this queue; the proposed ticket
moves automatically only when its last active item becomes ready. The image's
28-row counters illustrate the proposed group-based count, not current runtime
behavior or persisted evidence.

## `draft-tv-independent-ticket-scroll-16x9.png`

Reference status: `DRAFT` superseded design; not approved or implemented

Generation: 2026-08-18, built-in ImageGen using the clean full-content DRAFT as
the edit target and the product owner's annotated screenshot as the scrollbar
placement reference. Native artifact dimensions are 1672x941 (16:9).

Purpose: demonstrate the selected nested-scroll model. The outer queue remains
continuous free horizontal scroll. Table 12 alone shows an independent vertical
scrollbar because its body exceeds the ticket maximum height; short tickets
have none. Ticket headers and allergy summaries remain outside the scrolling
body.

Truthfulness: the scrollbar is presentation guidance, not implemented
behavior. The partially visible final row communicates continuation without an
ellipsis or summary. Generated ticket content was not persisted.

## `draft-tv-full-allergy-notes-16x9.png`

Reference status: `DRAFT` superseded design; not approved or implemented

Generation: 2026-08-18, built-in ImageGen edit of the variable-length TV
DRAFT. Native artifact dimensions are 1672x941 (16:9); 1920x1080 remains the
intended implementation review viewport.

Purpose: make all production-critical content directly visible. The image
shows a full ten-item order, one complete unconfirmed multi-allergen block and
note, a separate confirmed allergy, complete structured modifiers, and one
wrapped ordinary Kitchen note. There is no ellipsis, tooltip, expansion
control, summary, or card-internal scrolling. It is retained as the decision
history before independent ticket scrolling was selected.

Truthfulness: five command tickets contain 21 item rows, matching the visible
illustrative counters. The lower command count is intentional. Generated
content was not persisted and defines no new allergy procedure or business
rule.

## `draft-tv-variable-ticket-length-16x9.png`

Reference status: `DRAFT` superseded design; not approved or implemented

Generation: 2026-08-18, built-in ImageGen edit of the first TV DRAFT. Native
artifact dimensions are 1672x941 (16:9); 1920x1080 remains the intended
implementation review viewport.

Purpose: correct the first proposal's idealized uniform ticket lengths. The
image shows eight visible commands: one ten-item ticket occupying almost a full
column, plus a mixture of short and medium tickets in the remaining columns.
All ten items are visible with item-level actions; there is no truncation,
summary count, pagination, or card-internal scrollbar. It is retained as
iteration history; its allergy/note content is less complete than the current
candidate.

Truthfulness: ticket content and counters remain illustrative design data only
and were not persisted. The reduced command count is intentional evidence of
the real density tradeoff.

## `draft-tv-dense-command-grid-16x9.png`

Reference status: `DRAFT` superseded design; not approved or implemented

Generation: 2026-08-18, built-in ImageGen, using the real 1366x768 baseline as
the shared-shell reference and a corrected second pass for status/count
consistency. Generated artifact dimensions are 1672x941 (16:9); 1920x1080 is
the intended implementation review viewport, not the bitmap's native size.

Purpose: initial test of a TV-first alternative that replaces full-width stacked order
cards with a compact four-column grid. The image shows 12 order groups above
the fold only because its ticket lengths are unrealistically uniform. It is
retained as iteration history, not the current review candidate.

Truthfulness: all visible tickets and counts are illustrative presentation
content only. They are not fixtures and were never inserted into local
PostgreSQL. The selected queue is `À préparer`, so every visible group uses
that status. The image does not define SLA thresholds, cancellation behavior,
realtime delivery, printing success, contracts, or persistence.

## `phase-0-current-empty-1366x768.png`

Reference status: `DRAFT` baseline evidence; not a design reference

Capture: `/kitchen`, Cuisine / À préparer, 1366x768, 2026-08-18 Europe/Paris

Runtime/data: production POS at `localhost:3003`, site-agent/database ready,
Internet check not configured, printer not configured, and zero persisted
current-service rows across every station/status count.

Purpose: record the real desktop shell, health strip, station/status controls,
empty queue, refresh footer, density, and proportions before design.

## `phase-0-current-empty-390x844.png`

Reference status: `DRAFT` baseline evidence; not a design reference

Capture: `/kitchen`, Cuisine / À préparer, 390x844, 2026-08-18 Europe/Paris

Runtime/data: same persisted and service conditions as the desktop capture.

Purpose: record compact header/menu behavior, contained horizontal filter
scrolling, narrow empty state, and lack of document-level horizontal overflow.

## Safety and non-authority

No order, item, allergy acknowledgement/confirmation, payment, Kitchen
transition, or print job was created or changed for these captures. No safe
populated current-service state was available, so item-rich and mutation states
remain uncaptured.

These images do not define routes, product scope, authorization, permissions,
contracts, APIs, persistence, runtime/device ownership, business logic, raw
color values, or a design approval. Any generated proposal must be stored as a
separate `DRAFT` reference and reviewed explicitly.

## Package reference decision

Reference status: `APPROVED`

The approval applies only to
`draft-tv-entrees-first-auto-columns-16x9.png`; all other per-reference labels
above remain unchanged.
