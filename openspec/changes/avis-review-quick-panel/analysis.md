# Change Analysis

## Scope and Change Type

Replace the Avis inline detail presentation with a right-side modal. `PAGE_LOCAL`, behavioral and UI-affecting; no data/security/provider-contract change. `CODEX_ONLY` and `COMMIT_AFTER_TASK: YES` come from the current user's reply. The Proposal's bounded scope and REQUIREMENT_BASELINE apply.

## Sources Consulted

- [Authority Model](../../../docs/AUTHORITY_MODEL.md), [Product Knowledge](../../../docs/PRODUCT_KNOWLEDGE.md), [Module Registry](../../../docs/MODULE_REGISTRY.md), [Lifecycle](../../../docs/LIFECYCLE_STATUS_MODEL.md).
- [Reputation home](../../../docs/features/reputation/README.md), [Google retrieval spec](../../specs/reputation/google-review-retrieval/spec.md).
- [Root instructions](../../../AGENTS.md), [Backoffice instructions](../../../apps/backoffice/AGENTS.md), [UI workflow](../../../docs/ui/README.md), [Frontend rules](../../../docs/ui/YUTA_FRONTEND_RULES.md), [Backoffice UI rules](../../../docs/ui/BACKOFFICE_FRONTEND_RULES.md), [External advice](../../../docs/ui/EXTERNAL_DESIGN_INTELLIGENCE.md).
- `reviews-page.tsx`, `reviews-list-panel.tsx`, `reviews-loader.tsx`, `review-detail.tsx`, `review-reply-form.test.tsx`, `packages/ui/src/dialog.tsx` and its public export catalog.
- [Workflow](../../../docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md), [QA protocol](../../../docs/YUTA_QA_PROTOCOL.md), current activation/normativity policy.

## Authority and Product Decision

The current user's request chooses the modal for quick viewing/processing. Current Reputation decisions still govern data, authorization and processing. This presentation change grants no new publication, AI or Google activity. Satisfaction is outside the request.

## Current Implemented State

`ReviewsPage` uses two columns at `xl`; narrower screens render detail after the entire list. Selection updates `selected` with `scroll: false` but deletes `page` unless a new page is supplied. The loader defaults to the first item's detail without explicit URL selection; existing data and forms are implemented. `@yuta/ui` already exports Dialog with a right-panel variant. Avis has no separate Page Pack; the Satisfaction pack has its own excluded scope. Earlier Browser QA does not verify the new UX or the currently deployed runtime.

## Affected Boundaries

`apps/backoffice` owns presentation; persisted work remains in `@yuta/db-cloud` through existing server actions. Session/membership/tenant and STAFF assigned-only restrictions remain. No contract, migration, retrieval-admission, real-provider request, shared UI, shell or navigation change. Preserving pagination during opening/closing is part of the requested list-context continuity.

## Lifecycle Baseline

The Reputation home/registry record implemented inbox and manual-draft foundations, with broader provider V1 unresolved outside bounded A. Environment is not verified by this task and production/provider prerequisites remain. UI evidence does not promote lifecycle/readiness.

## Requirement Readiness

The current modal request and existing processing semantics support precise observable requirements. This interaction change introduces `reputation/review-quick-panel`; it does not use `skip_specs`.

## UI / UX Applicability

`UI_AFFECTING: YES`; `BROWSER_QA_REQUIRED: YES`.

`UI_UX_PRO_MAX_USAGE: NOT_APPLICABLE`

Reason: The user selected a concrete modal pattern, and the primitive/application precedent already exists; there is no external design question to resolve.

Scope: Avis quick panel.

Decision source: Current-user request and existing shared Dialog contract.

## Conflicts and Unknowns

No unresolved requirement-level conflict. Closing leaves the editor and never Saves or publishes; existing explicit Saves remain the persistence boundary. Design resolves loading/focus/query mechanics. QA uses synthetic local data with the real server route, without real Google access or provider-readiness claims.

The CLI requests Vietnamese artifacts, while the current user's root instructions require English technical documentation. The current-user instruction controls these artifacts; they are written in English with French product UI. This resolves language only and changes no requirement.

## Analysis Conclusion

`READY_FOR_SPECS`. Submit bounded `reputation/review-quick-panel` to independent Gate 1 review. Sensitive change: NO. This analysis is not approval.
