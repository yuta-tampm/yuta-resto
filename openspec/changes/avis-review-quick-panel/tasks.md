## Task context

`COLLABORATION_MODE: CODEX_ONLY`; `MODE_SELECTION_SOURCE`: current-user reply `CODEX_ONLY — COMMIT_AFTER_TASK: YES` for Avis quick panel.

`COMMIT_AFTER_TASK: YES`; `COMMIT_SELECTION_SOURCE`: same reply. Local commit after requested implementation/review/QA obligations; no sync/archive, push or deployment.

Bounded REQUIREMENT_BASELINE: approved Proposal/Analysis and delta; Avis right-side modal using existing processing, preserving list context. Satisfaction and all data/auth/provider boundaries are excluded from change.

`UI_AFFECTING: YES`; `BROWSER_QA_REQUIRED: YES`.

`UI_UX_PRO_MAX_USAGE: NOT_APPLICABLE`; reason/scope/decision source: approved Analysis, concrete user-selected existing Dialog pattern.

Pre-Apply baseline: HEAD `3e5f5738c17e8f9139bd64dea5a64c94d49ad789`, branch `main`; all intended implementation paths clean. Unrelated untracked `openspec/changes/pos-operator-behavior-fixes/.openspec.yaml` SHA-256 `d8229cce186af4ee1f2a19f1aa9c5aa027e58e554ce4d5cbb6597480a0c7f48e` remains excluded.

## 1. UI / Components

TECHNICAL IMPLEMENTATION CONTRACT: Owner `apps/backoffice`, presentation boundary. Authorities: root and Backoffice `AGENTS.md`, `docs/ui/README.md`, `YUTA_FRONTEND_RULES.md`, `BACKOFFICE_FRONTEND_RULES.md`, `EXTERNAL_DESIGN_INTELLIGENCE.md`, current Reputation home, approved delta/Design and `packages/ui/src/index.ts`. Reuse exported Dialog, semantic tokens and route-local ReviewDetail; French accessible UI; no shared/runtime/data/permission/provider change. Intended files: `avis/_components/review-quick-panel.tsx`, `reviews-page.tsx`, `reviews-list-panel.tsx`, `review-detail.tsx`. Completion: source diff, Backoffice checks and actual responsive/focus observations.

- [x] 1.1 Compose and wire the right-side modal with existing detail/forms, matching-selection loading/unavailable/error and scoped Satisfaction preservation; verify Backoffice typecheck/tests and real route opening.

## 2. Interaction / States

TECHNICAL IMPLEMENTATION CONTRACT: Same owner and applicable authorities above; additionally existing loader/retrieval spec and mutation forms. Preserve URL/filter/page/working context, scroll/focus and mounted input state; maintain server authority and explicit Save semantics. Intended files: route-local `_lib/reviews-query.ts`, `test/reviews-query.test.ts`, and modal/list/page wiring. Completion: navigation regression tests plus actual click/close/Save/revalidation observations.

- [x] 2.1 Preserve list context on selection/close and keyboard focus, with query regression tests for later-page selection, close, filters and pagination.
- [x] 2.2 Verify note/draft/status Saves, pending/error/success and retained unsaved draft through same-item Save using a disposable local real app/session route.

## 3. Integration / Regression

TECHNICAL IMPLEMENTATION CONTRACT: Same boundaries/owners; authorities additionally `docs/YUTA_QA_PROTOCOL.md` and canonical workflow. Update existing `docs/features/reputation/README.md`; use real route with safe synthetic DB/users, provider disabled, and no production claims. Required checks: docs, architecture, recursive typecheck, format, Backoffice tests/build, strict change validation, scoped diff/preservation; Browser QA 1440/1024/768/390 including keyboard/overflow/list-only/direct-link/loading/unavailable/Saves and Satisfaction regression. Completion: truthful separate VERIFY/QA evidence, hashed screenshots, independent Gate 3 on exact candidate.

- [x] 3.1 Update current Reputation UI documentation and complete relevant technical checks with exact command/results and skipped-check reasons.
- [x] 3.2 Complete mandatory responsive Browser QA, inspect actual screenshots and hash evidence in the existing review directory.

After these implementation obligations, obtain independent Gate 3 approval for the exact candidate/evidence, then perform the authorized isolated local commit. This delivery procedure is not an implementation checkbox.

## 4. Actual-user motion correction

Same task/mode/commit source: the current user reports no visible slide/loading/open-close feedback after commit c2981864. This is feedback against approved observable behavior, not a new Product requirement. Boundaries remain unchanged. New correction baseline: c2981864dbf91a192c89f93e1b75f3a166a59827; intended paths are clean; the unrelated POS metadata remains excluded.

TECHNICAL IMPLEMENTATION CONTRACT: route-owned CSS motion and modal-content retention during exit, with the same current-selection/state/authority guards. Reuse shared Dialog; no dependency or shared primitive edit. Fresh QA must measure entrance/exit transforms and CSS animations, actual pending feedback under bounded delayed local responses, close/focus/context, reduced-motion behavior and mobile/desktop controls; preserve the earlier failure and original evidence.

- [x] 4.1 Implement and verify actual entrance/exit motion with reduced-motion support, stable closing content and truthful conditional loading.
- [x] 4.2 Complete correction-scoped technical checks and actual motion/state Browser QA with truthful hashed evidence.

After these implementation obligations and the required affected Human retest, obtain fresh independent Gate 3 review before the authorized local correction commit. Gate/commit procedure is not an implementation checkbox.

Actual HUMAN_PRODUCT_VALIDATION: CHANGES_REQUESTED for the c2981864 candidate; source: current user's live dev feedback. Proven implementation defect YES: absent emitted motion CSS. Product defect NO. Earlier technical/QA PASS and approval apply only to their original bytes and coverage; they do not prove motion. At correction intake DEV_USABLE/MANUAL_TEST_READY/QA/VERIFY were PENDING; the subsequent current observations and verdicts are recorded below. Iteration bucket: motion defect, correction Apply/QA generation 1; read-only diagnosis does not consume a correction execution generation. No failed recovery or scope expansion has occurred.

Correction post-Apply observation: DEV_USABLE applicability YES, result YES on actual existing localhost:3001 dev, normal current-user authenticated session/profile internal. Opening review two exposed the named pending state and computed panel-enter animation 0.28s; closing exposed panel-exit 0.2s, pointer-events none, without unavailable text. Current source identities: review-quick-panel.tsx fa9c1ee99c0e07ec5b59643e03e8792e312aa9eb55ae3e6eb0bf807c39259056; review-quick-panel.module.css 11743c7dfa347f7dcf0fd720b316f0e71b03248a1667de32784c048a51dfbefc. No form/provider write or dev restart was performed.

MANUAL_TEST_READY applicability YES, result YES: existing dev runtime localhost:3001, current user session, /visibilite-reputation/avis; select review two, observe entrance/loading as needed, close with X/Escape; repeat on mobile. Existing data remains unchanged. Reset/retry: close then choose another row; refresh only if there is no unsaved writing. Reduced-motion preference intentionally disables motion. One async retest request was sent on 2026-10-03 under the required workflow rule. Actual HUMAN_PRODUCT_VALIDATION: ACCEPTED; source: current user's reply on 2026-10-03, "Đã thấy trượt vào/ra, tương tác ổn" (translation: sliding in/out is visible and interaction works). Acceptance applies to the affected open/close experience of the two exact source identities above. It is not broader QA, provider, production or Gate 3 approval. Historical CHANGES_REQUESTED remains above.

Correction technical evidence: docs/reviews/avis-review-quick-panel/04-motion-verification-evidence.md. Backoffice production build and full tests passed (1555 tests; 54 guarded skips); docs, architecture, recursive typecheck and strict change validation passed. Full format check still FAILS on 51 pre-existing paths outside the correction; task-scoped formatting passes. Current correction QA: qa/motion/QA_REPORT.md, 47 named scenarios PASS, 13 inspected screenshots and 8 actual animation-frame traces across 1440/1024/768/390. Pending/loading, cached opening, reduced motion, stable exit content, close during pending response, existing Saves and Satisfaction regression passed. Disposable QA servers/container were removed; the current user's dev runtime remains available. All seven implementation tasks are complete; fresh independent Gate 3 remains required before the authorized isolated local commit.

## POST_APPLY_DEVELOPMENT_FEEDBACK

The original assertions below are historical for the c2981864 candidate. Current correction assertions and actual Human feedback are in section 4 above; do not interpret the old NOT_REQUESTED or PASS values as acceptance of the motion correction.

Adoption: REQUIRED. Event: `docs/reviews/development-usability-and-iteration-control/03-final-review.md`, authorized finish/archive on 2026-09-24; archived change `2026-09-24-development-usability-and-iteration-control`.

DEV_USABLE: applicability YES; result YES. Actual normal owner login, selected URL, modal, note Save, unsaved draft preservation through revalidation and close passed on http://localhost:3104; synthetic disposable DB yuta_avis_quick_panel_test, retrieval disabled, no provider calls.

MANUAL_TEST_READY: applicability YES; result YES. Handoff: from repository root run node .tmp-avis-quick-panel/runner.mjs, enter setup then dev/qa to exercise the real local route with normal owner@luna-restaurant.fr authentication supplied through the process-only fixture credential; use /visibilite-reputation/avis?selected=<fixture.reviewId> for manual UI observation. Safe synthetic fixture has 40 reviews and STAFF cases. Reset: stop the owned runtime and rerun setup; retry: rerun the bounded dev command after a supported correction. No real Google data or deployment is included.

HUMAN_PRODUCT_VALIDATION: NOT_REQUESTED; CODEX_ONLY; optional user feedback was not requested and acceptance needs automated actual browser observations, not a mandatory Human/provider observation. This is not a Product acceptance or QA waiver.

## ITERATION_STOP_CONTROL

Language lineage: stage planning review; original Vietnamese Gate 2 candidate CHANGES_REQUESTED because current-user English technical-doc rule overrides CLI context. Translated artifacts without behavior/scope change; affected approvals invalidated and fresh Gate 1/Gate 2 APPROVED. One resolving correction, zero failed recovery attempts; two actual Gate 2 review generations. No further equivalent reconciliation is needed. Implementation/evidence ledger: NONE until an actual blocker is observed.

## Historical implementation candidate for development observation (c2981864)

- apps/backoffice/src/app/(authenticated)/visibilite-reputation/avis/\_components/review-detail.tsx: 400ad63dcc3a74d2c646ff55cfc1b9e8de793af83b447261cedc240ae52d8964
- apps/backoffice/src/app/(authenticated)/visibilite-reputation/avis/\_components/review-quick-panel.tsx: a57dd380865834f348411d937449926e30d3c553e6649a6d5058ed04b13f1461
- apps/backoffice/src/app/(authenticated)/visibilite-reputation/avis/\_components/reviews-list-panel.tsx: 9f52839e8a5f48afb74fa368c450826e537bf841f93aa51d537fdbe36d785384
- apps/backoffice/src/app/(authenticated)/visibilite-reputation/avis/\_components/reviews-page.tsx: c1d3bfeb984347692d6adcccf78de40c76ba7d7a0dccb9b21c4f4ccc3dc0014e
- apps/backoffice/src/app/(authenticated)/visibilite-reputation/avis/\_lib/reviews-query.ts: 3a85eb01047233e87c2e271c20d2e6a826f85e6066b597a0d90276ab679f80c6
- apps/backoffice/test/reviews-query.test.ts: 3290ec67a4d29661b437d8415398155bfdcfa87753e90d8882c94839c9ab364d
- docs/features/reputation/README.md: 391c8f51fc7504296bdd45b967907610c5f3eb1974db88045506baa9ddb61d13

Historical dev evidence: first modal observation FAIL (no dialog because session navigation had not completed); a diagnostic initially timed out waiting for main and then observed /connexion, without app console/page errors. A metadata-only authentication diagnostic established the local session cookie and /aujourdhui completion; the safe harness correction waits for the real Today heading after establishment selection. Current real-flow observation PASS. No product source correction or auth weakening occurred. Lineage: QA harness authentication/navigation race, proven cause; main dev flow generations 2, diagnostic observations recorded separately; zero failed recovery attempts after the resolving harness correction. Earlier failures are retained and are not relabelled PASS.

Technical check evidence: docs/reviews/avis-review-quick-panel/03-verification-evidence.md. Source/primitive/client/domain boundaries, production Backoffice build, 1555 tests, recursive typecheck, docs and architecture passed. Full format FAIL is preserved; task-scoped formatting passed.

Browser QA evidence: docs/reviews/avis-review-quick-panel/qa/QA_REPORT.md and qa-results.json. QA PASS: 32 named scenarios on the real app and synthetic disposable persistence, including 1440/1024/768/390, immediate loading, page-2 filter/scroll/focus restoration, keyboard containment, direct links, explicit Saves and persisted readback, OWNER/STAFF, and unchanged internal Satisfaction. Existing form tests cover rejected/error feedback; no database outage or live provider request was induced. All 12 actual list/panel/editor screenshots inspected and hashed in screenshot-manifest.md. Zero console/page errors and zero outbound requests. Full QA generation 1 PASS; the earlier development harness failures above remain historical failures. Five of five implementation tasks complete; independent final review remains required before local commit.
