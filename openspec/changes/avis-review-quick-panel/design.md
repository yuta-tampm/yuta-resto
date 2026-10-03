## Context

See Proposal for motivation and the approved `reputation/review-quick-panel` delta for behavior. Design applies because modal state, asynchronous URL selection and focus restoration need a bounded decision. Sensitive change: NO; no separate Design gate applies under the current workflow.

## Goals / Non-Goals

Compose the exported right-panel Dialog with the current ReviewDetail. Keep server loading and existing mutation components in their current owners. No shared primitive, data, provider or authorization redesign.

## Decisions

- Add a route-local ReviewQuickPanel with a fixed header/close, internally scrolling body, French accessible title/description, and initial focus on its title. Use the existing modal's focus containment, Escape/backdrop dismissal and slide motion. A separate drawer primitive would duplicate existing UI ownership.
- ReviewsPage owns the explicit panel-selection state and opening-row ref. Set intent immediately on click; until the loaded detail matches, show loading instead of the old item. Synchronize URL selection changes so direct links and filter navigation remain coherent. Default first-item data remains available for existing retrieval semantics without automatically opening the modal.
- Keep the same keyed ReviewDetail mounted while its selected ID stays unchanged, preserving unsaved form state across local Save/revalidation. Explicit dismissal exits the editor; it does not save unsaved edits. Existing explicit Save actions remain the only persistence mechanism.
- Preserve pagination for Avis selection. Closing removes only `selected`, preserving the working list, filters and page; navigation keeps `scroll: false`. Return focus to the opening row with `preventScroll`. Keep Satisfaction's inline layout and its current query behavior.
- Extract query mutation into route-local pure helpers so list-context behavior has direct regression coverage. Reuse ReviewDetail with a local class override to remove its inline card/sticky presentation inside the dialog.

## Risks / Trade-offs

- Stale async detail could target the wrong form → render forms only for the requested ID; show named loading/unavailable/error states otherwise.
- Background Save could remount writing fields → stable review key and modal ownership, verified by saving notes while an unsaved draft remains.
- Modal removes direct access to list rows until dismissed → intentional modal pattern requested by the user; return focus and list scroll for repeated processing.
- QA could accidentally use real provider data → disposable local Postgres, synthetic users/reviews, empty connector secrets and retrieval disabled. Use real app/session/actions, not a fixture-rendered page.

## Migration Plan

No data migration or environment change. Apply presentation files and current documentation together. Rollback reverts these scoped files. No deployment, normative sync or archive is included.
