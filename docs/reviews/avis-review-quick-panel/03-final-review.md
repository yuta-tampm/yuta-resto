Change: avis-review-quick-panel
Gate: 3
Review status: APPROVED
Created: 2026-10-03
Schema: yuta-spec-driven
COLLABORATION_MODE: CODEX_ONLY
COMMIT_AFTER_TASK: YES
Sync authorization: PENDING

## Request, authority and bounded delivery

The current user requested a modal sliding from the right when selecting an Avis review for quick viewing/processing, then explicitly selected CODEX_ONLY — COMMIT_AFTER_TASK: YES. This authorizes independent review and an isolated local commit of the completed bounded implementation. Scope: /visibilite-reputation/avis presentation and list-context continuity, existing processing, tests/current documentation and review/QA evidence. Satisfaction redesign, server/tenant/permission/DB/API/provider semantics, AI/publication, deployment/push and spec sync/archive are excluded. Gate approval must not expand this scope; sync remains PENDING and no finish/archive is requested.

Base: 3e5f5738c17e8f9139bd64dea5a64c94d49ad789; branch main. Unrelated untracked openspec/changes/pos-operator-behavior-fixes/.openspec.yaml remains excluded with exact SHA-256 d8229cce186af4ee1f2a19f1aa9c5aa027e58e554ce4d5cbb6597480a0c7f48e. Seven source/doc paths were clean at baseline.

## Earlier approvals and planning identities

Gate 1 APPROVED by /root/quick_panel_gate1_english; Gate 2 APPROVED by /root/quick_panel_gate2_english. Their packets retain the earlier Vietnamese candidate and CHANGES_REQUESTED/invalidation history. Current English Proposal/Analysis/delta identities were rechecked; only language changed at that historical correction. Design applicability YES; Sensitive change NO; separate sensitive-design gate NOT_APPLICABLE. Design reuses existing Dialog right-panel, distinguishes immediate selection from URL arrival, prevents stale-item forms, preserves same-item input and restores opening-row focus.

| Path                                                                                 | SHA-256                                                          |
| ------------------------------------------------------------------------------------ | ---------------------------------------------------------------- |
| docs/reviews/avis-review-quick-panel/01-analysis-review.md                           | 0814c89591e51f7edf2a449d4a6d68cb240991c464cf4d3edc3035b0292a9c64 |
| docs/reviews/avis-review-quick-panel/02-specs-review.md                              | cf7d14129216a563b5e7d67aaabcb1a5eb2c7b53c0bb8aa682aaa6bf8b173acc |
| openspec/changes/avis-review-quick-panel/.openspec.yaml                              | eb984f1a844433fcf686b11b57962c6db65a3260148771b10c6a5388a1c446b8 |
| openspec/changes/avis-review-quick-panel/analysis.md                                 | 8c1143c0c07fd9e9af68baa44ec60554c6f4e81b48ed8a47cf2409b329e2e332 |
| openspec/changes/avis-review-quick-panel/design.md                                   | e2377f810db19997066252fe45329b73349fdcdff932d858d7489fb6d68ca78b |
| openspec/changes/avis-review-quick-panel/proposal.md                                 | 3a6af2fb08ab7cc6c6ae98fa74bebdd3b39041f89c29845949123d2fadce8c62 |
| openspec/changes/avis-review-quick-panel/specs/reputation/review-quick-panel/spec.md | 1738b33a7cd08c9a09d76a1c08a12b097be77ded8d2d907ecfd46d0d0ef21bc1 |
| openspec/changes/avis-review-quick-panel/tasks.md                                    | 1ca96607faf56080ebdb15eb6ba88eb55aabb11dccacfb274f83f91b8f64a631 |

Tasks: 5/5 complete. Technical Implementation Contracts cover UI/Interaction/Integration. Required post-Apply DEV_USABLE YES and MANUAL_TEST_READY YES are in the exact Tasks bytes. HUMAN_PRODUCT_VALIDATION NOT_REQUESTED records optional participation, not a QA waiver. UI_UX_PRO_MAX_USAGE NOT_APPLICABLE follows approved Analysis; no external installation or advice is needed for the user-selected existing pattern. No conditional knowledge/lifecycle or release promotion is included.

## Implementation identities and complete scoped diff

| Path                                                                                                   | SHA-256                                                          |
| ------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------- |
| apps/backoffice/src/app/(authenticated)/visibilite-reputation/avis/\_components/review-detail.tsx      | 400ad63dcc3a74d2c646ff55cfc1b9e8de793af83b447261cedc240ae52d8964 |
| apps/backoffice/src/app/(authenticated)/visibilite-reputation/avis/\_components/review-quick-panel.tsx | a57dd380865834f348411d937449926e30d3c553e6649a6d5058ed04b13f1461 |
| apps/backoffice/src/app/(authenticated)/visibilite-reputation/avis/\_components/reviews-list-panel.tsx | 9f52839e8a5f48afb74fa368c450826e537bf841f93aa51d537fdbe36d785384 |
| apps/backoffice/src/app/(authenticated)/visibilite-reputation/avis/\_components/reviews-page.tsx       | c1d3bfeb984347692d6adcccf78de40c76ba7d7a0dccb9b21c4f4ccc3dc0014e |
| apps/backoffice/src/app/(authenticated)/visibilite-reputation/avis/\_lib/reviews-query.ts              | 3a85eb01047233e87c2e271c20d2e6a826f85e6066b597a0d90276ab679f80c6 |
| apps/backoffice/test/reviews-query.test.ts                                                             | 3290ec67a4d29661b437d8415398155bfdcfa87753e90d8882c94839c9ab364d |
| docs/features/reputation/README.md                                                                     | 391c8f51fc7504296bdd45b967907610c5f3eb1974db88045506baa9ddb61d13 |

Sorted implementation paths are exactly the table above. Additional attributed files are planning/review/QA evidence in the [evidence manifest](evidence-manifest.json); manifest SHA-256 dae9489da22df34335ea43882f14aeb9fc7e2065f9ae23c009cc7a56e0fd8dcb. The manifest excludes only itself and this final-review packet to avoid self-reference; it includes all source, planning, earlier reviews, verification and twelve images.

Complete scoped diff: [implementation.diff](implementation.diff), SHA-256 3e86f18423d0eed5dcefc1953c8b50b1eb2ca8f706a8318af3ce78f04e8db682. Stat: [implementation-stat.txt](implementation-stat.txt), SHA-256 e69cbfe996a2b9f893e6c20e5994ff55740deb2d159106f6d113b2e389296c67.

Deterministic recipe: for the seven sorted implementation paths, append stdout bytes of git -c core.quotePath=false diff --no-ext-diff --no-color BASE -- PATH for the four baseline-tracked paths; for the three new files review-quick-panel.tsx, reviews-query.ts and reviews-query.test.ts append git -c core.quotePath=false diff --no-ext-diff --no-color --no-index -- /dev/null PATH (expected exit 1). BASE is the exact commit above. No stderr, banners, newline conversions or other paths enter the concatenation. Stat command: git apply --stat docs/reviews/avis-review-quick-panel/implementation.diff. Reproduction remains valid after the local commit because the base and new-file attribution are fixed.

```text
 .../avis/_components/review-detail.tsx             |    9 +
 .../avis/_components/review-quick-panel.tsx        |   99 +++++++++++++++
 .../avis/_components/reviews-list-panel.tsx        |    7 +
 .../avis/_components/reviews-page.tsx              |  131 ++++++++++++++------
 .../avis/_lib/reviews-query.ts                     |   22 +++
 apps/backoffice/test/reviews-query.test.ts         |   52 ++++++++
 docs/features/reputation/README.md                 |   10 ++
 7 files changed, 283 insertions(+), 47 deletions(-)
```

## Requirement/scenario mapping

| Approved requirement/scenario                                   | Code and tests                                                                                               | Actual QA                                                                                                                                 |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Explicit selection / list-only / direct link / no stale content | ReviewsPage selected ID and matching-detail gate; ReviewQuickPanel loading/unavailable; current loader scope | Four viewports list-only/loading/correct ID, direct selected link, unavailable ID                                                         |
| Closing preserves context / later page / focus                  | reviews-query helpers and five regression tests; opening-row ref and preventScroll                           | Page 2 search/rating/order, exact scroll positions and focus at all four widths; Escape/named close/backdrop                              |
| Existing processing / saved draft / unsaved writing             | Existing ReviewDetail and forms with stable item key; existing reply/action/loader tests                     | Note/draft/status pending and success, unsaved draft through note revalidation, persisted values after reload and SQL draft/note readback |
| Responsive accessibility / Satisfaction preservation            | Shared Dialog right-panel and semantic classes; dedicated inline direct-only branch; query regression        | Four widths, focus containment/internal scroll/header/close/overflow; STAFF scoped states; desktop/mobile internal Satisfaction           |

No requirement or sensitive-boundary deviation. Closing deliberately exits the editor without automatically saving unsaved edits, as Design/current documentation state. No implementation-only Product decision or unresolved critical issue.

## TECHNICAL VERIFY

TECHNICAL IMPLEMENTATION COMPLIANCE: PASS

VERIFY: PASS

Technical Compliance Matrix source/hash and UI/Interaction/Integration coverage are in the canonical block below. Full verification report SHA-256 622ceb593976c34692e928cb28b63af7047528588a5690eb60795d98a8bf0e36. Canonical block [verify-block.txt](verify-block.txt), exact UTF-8 SHA-256 41814580111742d58f25d84cf0a05cc51fb1b57a5d82824e93f8ee73b5ab1972; content below is included unchanged, excluding the Markdown fence.

```text
TECHNICAL IMPLEMENTATION COMPLIANCE: PASS
VERIFY: PASS
Assessment source: docs/reviews/avis-review-quick-panel/03-verification-evidence.md
Assessment source SHA-256: 622ceb593976c34692e928cb28b63af7047528588a5690eb60795d98a8bf0e36
Matrix source: docs/reviews/avis-review-quick-panel/03-verification-evidence.md#technical-compliance-matrix
Matrix exact UTF-8 section SHA-256: e59124a6c95412acf0af452ca7e7a51c01b83e42583aa71512053533b9b22fbe
pnpm --filter @yuta/backoffice test test/reviews-query.test.ts test/review-reply-form.test.tsx: exit 0; 2 files, 10 tests PASS
pnpm --filter @yuta/backoffice build: exit 0; compile, TypeScript, page generation PASS
pnpm docs:check: exit 0; 36 current documents PASS; repeated after final QA docs
pnpm architecture:check: exit 0; all boundary checks PASS
pnpm -r --if-present typecheck: exit 0; all present scripts PASS
pnpm --filter @yuta/backoffice test: exit 0; 129 files PASS, 1 skipped; 1555 tests PASS, 54 skipped
pnpm format:check: exit 1; preservation PASS (67 paths), 52 Prettier warnings; one task packet corrected and 51 pre-existing paths preserved
node node_modules/prettier/bin/prettier.cjs --check <19 exact task code/planning/review/QA paths>: exit 0; PASS after correction
openspec validate avis-review-quick-panel --strict: exit 0; PASS; repeated after final QA docs
git diff --check: exit 0; PASS
Browser QA: PASS; 32 named scenarios, 12 actual screenshots; qa/QA_REPORT.md
Skipped: unrelated full cloud/local suites and cloud builds; Pointage/OpenAI guarded test lanes; real providers, production and screen-reader speech
```

Full-format FAIL is preserved; one task packet was corrected and scoped formatting PASS leaves 51 untouched pre-existing warnings. The unrelated skipped test/build/format paths are not blockers caused by this change and are not relabelled PASS. The original development navigation race was fixed only in the local harness; Tasks preserves failed observation generations.

## QA

UI_AFFECTING: YES

BROWSER_QA_REQUIRED: YES

QA: PASS

| Path                                                           | SHA-256                                                          |
| -------------------------------------------------------------- | ---------------------------------------------------------------- |
| docs/reviews/avis-review-quick-panel/qa/QA_REPORT.md           | 8cc63a7e32fd9d366d738b8cb690cd60ba0b801c062f0c34923b05fd506acc00 |
| docs/reviews/avis-review-quick-panel/qa/screenshot-manifest.md | 4931f6825fde9abfeee26d9996315cb89331d63b4f4b6b9dfa8743914068af8a |
| docs/reviews/avis-review-quick-panel/qa/qa-results.json        | 04a8b8ebe7c0c5909ab960f7b4ddd039af217e86e2bdb6fa7f5de993106f1111 |
| docs/reviews/avis-review-quick-panel/qa/editor-1024.png        | ed6e9288dea25195597dcc8dcc16a8019f8d2cf9cdc87dbcfed6e1f40e9acd2c |
| docs/reviews/avis-review-quick-panel/qa/editor-1440.png        | b2c88af10191e2d8328459177b8d822dde613abc128f05529b01f99e20381b89 |
| docs/reviews/avis-review-quick-panel/qa/editor-390.png         | 51359bd3cf4fcd90aba9b148c6a9ac25f4b92a8d623baae7d78b5fe751ccf0a3 |
| docs/reviews/avis-review-quick-panel/qa/editor-768.png         | 2aa952a7e02c0c3e7070ea71e9dae5b39d0967d267a6f96c256a0aa8b778dca0 |
| docs/reviews/avis-review-quick-panel/qa/list-1024.png          | 3a46d0fc9577c4b8b50df0012b89aa79db3199e6194cc68b9030b8bd2ae817cd |
| docs/reviews/avis-review-quick-panel/qa/list-1440.png          | a3c0ceadc28dcb8b3d58f226a843bb225ef93797c40eaab35d53652970da0dc1 |
| docs/reviews/avis-review-quick-panel/qa/list-390.png           | b9f6949be9a9dfc9d42d9caa67895353d529b9cdec483a2456ef07117073ef59 |
| docs/reviews/avis-review-quick-panel/qa/list-768.png           | 47fe0c1fa13c621d76832a376af537ee2f2ec1698bf1fcd9c43d28d78d0708ab |
| docs/reviews/avis-review-quick-panel/qa/panel-1024.png         | 881abc19f595f5a8ad351455a59d55577c0ddd1b03f1e4a3a773b3dfbc216ed7 |
| docs/reviews/avis-review-quick-panel/qa/panel-1440.png         | 69d14fe4f5b7adb55846ec9272b7e421338c783bbc4a20ab8f1e531a09d57cd7 |
| docs/reviews/avis-review-quick-panel/qa/panel-390.png          | 8206cbce39b8931b89ba308aba7891aee4a7e5b8d2a069139970f2312d5bad36 |
| docs/reviews/avis-review-quick-panel/qa/panel-768.png          | 92911aef7f6f8f0aac49b1f63748b1993f1c7bbf965ea8269a469ead099b9149 |

Actual headless Chrome on the production Backoffice build with normal OWNER/STAFF auth and a verified synthetic disposable DB. Release-a Avis at localhost:3104; internal Satisfaction regression at localhost:3105. Viewports 1440x900, 1024x768, 768x1024, 390x844. Thirty-two named checks PASS, zero console/page errors, zero outbound attempts, persisted synthetic draft/note readback. All twelve images visually inspected; representative desktop/tablet/mobile panel and scrolled mobile editor are linked from QA_REPORT. No unresolved visual/basic keyboard issue. Known evidence limits: no screen-reader speech, induced full DB outage, real Google/provider or production observation. Reused error feedback/denial/validation is covered by source and existing Backoffice tests; no false Browser QA claim is made for those limits.

## Independent review required

Recommendation: APPROVE_GATE_3_WITH_EXPLICIT_SYNC_AUTHORIZATION_IF_READY

This standard recommendation requests the mode-defined independent verdict on this bounded implementation only. It does not request or grant excluded spec sync/archive. The original snapshot awaited independent review; the verdict below approves its exact candidate identities and evidence. COMMIT_AFTER_TASK YES permits the isolated local commit only after that verdict and byte recheck. Release follow-up: NOT_REQUIRED within this local task; deployment is outside scope.

## Independent approval

Approval source: USER_DELEGATION_WITH_INDEPENDENT_REVIEW

Mode selection source: current-user reply CODEX_ONLY — COMMIT_AFTER_TASK: YES for Avis quick panel.

Independent reviewer: /root/quick_panel_gate3

Independent verdict: APPROVED; no actionable findings. STANDARDS PASS; SPEC PASS; TECHNICAL IMPLEMENTATION COMPLIANCE PASS; VERIFY PASS; QA PASS. Reviewer verified 34/34 manifest identities, reproduced the seven-file diff including three new files, inspected all twelve actual screenshots and compared all 32 named QA checks with harness provenance. Earlier approvals and five completed tasks are consistent. No evaluator/runtime/DB mutation during independent read-only review.

Reviewed packet snapshot SHA-256: 1d75fd58bc720ebdb8fdbe8a0007042f4b1f3e6fa2d1fdaef6a7322a8d4692a7

Reviewed manifest SHA-256: dae9489da22df34335ea43882f14aeb9fc7e2065f9ae23c009cc7a56e0fd8dcb

Post-verdict author recheck: all 34 manifest files, manifest, reviewed packet snapshot, embedded verify block and unrelated POS metadata retain exact identities. Only this approval/status record is added after the verdict; implementation/planning/evidence bytes are unchanged.

Bounded acceptance: full formatting FAIL with 51 untouched pre-existing warnings is accepted for this scoped delivery; task files pass. The 54 unrelated guarded test skips and screen-reader/provider/production/full-outage observation limits remain disclosed, without false PASS claims.

Sync authorization remains PENDING; spec sync/archive, push and deployment remain excluded. The actual user-authorized isolated local commit may now proceed.

Approval recorded by: Codex workflow

Approved: 2026-10-03T06:51:07.717Z

## Local commit delivery check

All 36 attributed files were isolated in the index; filtered Git blob identities matched their exact worktree content. Unrelated POS metadata was excluded.

Native Git `git diff --cached --check` and the patch-only check each returned exit 2 for four single-space context prefixes at implementation.diff lines 220, 237, 262 and 435. These are required unified-diff context syntax for unchanged empty source lines, not implementation whitespace. The exact reviewed diff hash is unchanged. `git diff --cached --check -- . ':(exclude)docs/reviews/avis-review-quick-panel/implementation.diff'` returned exit 0 for all 35 other files.

Independent reviewer /root/quick_panel_gate3 rechecked these bytes, patch parsing, all 34 manifest identities and index content; verdict APPROVED stands with this narrow evidence-artifact warning acceptance. No blanket formatting waiver or source/planning/evidence change was made. This delivery note is approval metadata added after the verdict.
