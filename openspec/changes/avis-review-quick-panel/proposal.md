## Why

On Avis, detail appears after the entire list below the wide-screen breakpoint. Users must scroll down to process an item and back up to choose another. The current user requested a modal sliding in from the right for quick viewing and processing.

## What Changes

- Replace inline detail on `/visibilite-reputation/avis` with a right-side modal containing the existing review information and forms.
- Open it on explicit selection or a `selected` URL, with truthful loading and unavailable states.
- Preserve filters, ordering, pagination, list scroll and return focus when opening/closing; use full width on mobile.
- Update current Reputation documentation, tests and responsive Browser QA.

## Capabilities

### New Capabilities

- `reputation/review-quick-panel`: Quick viewing and processing of an Avis item in a right-side modal.

### Modified Capabilities

Existing retrieval, notes, status and draft-persistence requirements remain unchanged.

## Impact

`PAGE_LOCAL`: Backoffice Avis presentation, tests and Reputation documentation. Reuse the exported `DialogContent` right-panel variant. No dependency, API, schema, permission or provider-action change. Satisfaction retains its current layout.

## Task context and REQUIREMENT_BASELINE

- `COLLABORATION_MODE: CODEX_ONLY`; source: current-user reply `CODEX_ONLY — COMMIT_AFTER_TASK: YES`.
- `COMMIT_AFTER_TASK: YES`; `COMMIT_SELECTION_SOURCE`: the same current-user reply.
- Requirement: choosing a review opens a modal sliding from the right for quick viewing/processing, replacing inline detail.
- Hard constraints: reuse existing UI/forms; French UI; preserve server auth/tenancy and provider semantics.
- Out of scope: Satisfaction redesign, AI/publication, retrieval redesign, DB/API/permissions, production/deployment/push, spec sync/archive.
- Observable outcomes: correct item in the modal at 1440/1024/768/390; closing preserves page/filter/scroll/focus; existing explicit Saves persist with feedback; no overflow or console/hydration errors.
