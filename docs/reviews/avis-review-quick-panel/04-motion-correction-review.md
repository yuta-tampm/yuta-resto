Change: avis-review-quick-panel
Gate: 3
Review status: APPROVED
Created: 2026-10-03
Schema: yuta-spec-driven
COLLABORATION_MODE: CODEX_ONLY
COMMIT_AFTER_TASK: YES
Sync authorization: PENDING

## Sourced request and bounded correction

The current user requested a right-side sliding modal for Avis quick viewing/processing and selected CODEX_ONLY — COMMIT_AFTER_TASK: YES. The delivered candidate c2981864dbf91a192c89f93e1b75f3a166a59827 later received actual CHANGES_REQUESTED: no visible motion/loading/open-close feedback. Live inspection proved animation none/0s despite motion utility class names. This LOCAL_CORRECTION implements the approved observable slide without changing Product requirements or trusted boundaries. Scope remains Avis presentation/list context, existing processing, documentation and review/QA evidence. No Satisfaction redesign, dependency/shared primitive/server/API/schema/auth/permission/provider/business change, sync/archive, push/deployment or production operation.

Base c2981864dbf91a192c89f93e1b75f3a166a59827, branch main. Unrelated untracked openspec/changes/pos-operator-behavior-fixes/.openspec.yaml remains excluded, SHA-256 d8229cce186af4ee1f2a19f1aa9c5aa027e58e554ce4d5cbb6597480a0c7f48e. Original approval in 03-final-review.md is now INVALIDATED_BY_ARTIFACT_CHANGE; its hashes/results remain historical. No earlier failure is relabelled or recycled as current motion proof.

## Authorities and unchanged earlier approvals

Canonical sources: root/backoffice AGENTS; docs/README.md and CURRENT_STATE.md; docs/ui/README.md, YUTA_FRONTEND_RULES.md, BACKOFFICE_FRONTEND_RULES.md, EXTERNAL_DESIGN_INTELLIGENCE.md; docs/features/reputation/README.md; packages/ui/src/index.ts; docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md local-correction/delegated-review/commit sections and docs/YUTA_QA_PROTOCOL.md. The existing approved English Gate 1 and Gate 2 generations are retained in 01-analysis-review.md and 02-specs-review.md, approved by /root/quick_panel_gate1_english and /root/quick_panel_gate2_english. Their earlier Vietnamese identities are historical. Proposal/Analysis/delta unchanged; bounded technical Design/Tasks amendments are reviewed here under LOCAL_CORRECTION, not a new Product decision.

| Path                                                                                 | SHA-256                                                          |
| ------------------------------------------------------------------------------------ | ---------------------------------------------------------------- |
| docs/reviews/avis-review-quick-panel/01-analysis-review.md                           | 0814c89591e51f7edf2a449d4a6d68cb240991c464cf4d3edc3035b0292a9c64 |
| docs/reviews/avis-review-quick-panel/02-specs-review.md                              | cf7d14129216a563b5e7d67aaabcb1a5eb2c7b53c0bb8aa682aaa6bf8b173acc |
| openspec/changes/avis-review-quick-panel/.openspec.yaml                              | eb984f1a844433fcf686b11b57962c6db65a3260148771b10c6a5388a1c446b8 |
| openspec/changes/avis-review-quick-panel/proposal.md                                 | 3a6af2fb08ab7cc6c6ae98fa74bebdd3b39041f89c29845949123d2fadce8c62 |
| openspec/changes/avis-review-quick-panel/analysis.md                                 | 8c1143c0c07fd9e9af68baa44ec60554c6f4e81b48ed8a47cf2409b329e2e332 |
| openspec/changes/avis-review-quick-panel/design.md                                   | 08b8eee00e5c46941a2803360746099732029565c4eaeb65b9544182061d6968 |
| openspec/changes/avis-review-quick-panel/tasks.md                                    | 49b514f89d22e2064fa14eaba21a7d69e4af0075566212b0b373efdc86a5f24a |
| openspec/changes/avis-review-quick-panel/specs/reputation/review-quick-panel/spec.md | 1738b33a7cd08c9a09d76a1c08a12b097be77ded8d2d907ecfd46d0d0ef21bc1 |

Design applicability YES; sensitive change NO; separate sensitive-design gate NOT_APPLICABLE. Design preserves existing Dialog and ReviewDetail, adds explicit route-local keyframes 280ms/200ms with reduced motion and stable noninteractive exit content. Current open data always uses current props/matching selection. Tasks 7/7 complete including correction checks/QA. UI_UX_PRO_MAX_USAGE NOT_APPLICABLE follows the unchanged approved concrete existing pattern. No unresolved requirement or sensitive boundary decision.

## Current candidate and complete implementation diff

| Path                                                                                                          | SHA-256                                                          |
| ------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| apps/backoffice/src/app/(authenticated)/visibilite-reputation/avis/\_components/review-quick-panel.module.css | 11743c7dfa347f7dcf0fd720b316f0e71b03248a1667de32784c048a51dfbefc |
| apps/backoffice/src/app/(authenticated)/visibilite-reputation/avis/\_components/review-quick-panel.tsx        | fa9c1ee99c0e07ec5b59643e03e8792e312aa9eb55ae3e6eb0bf807c39259056 |
| docs/features/reputation/README.md                                                                            | da099a9d6d9254aee36a5b134d042b3859f409f24d76dc763ead65c964ce6909 |

All current original unchanged source paths, planning, prior approval lineage and correction evidence are enumerated in [evidence-manifest.json](qa/motion/evidence-manifest.json), SHA-256 84e098d9ff630370c3f37ca15b83a3ac30c734d510f858d159abea413479003b. It excludes only itself and this final packet to avoid self-reference. Original parent manifest/evidence remains historical for the original commit and is not a current approval manifest.

Complete three-file implementation/doc diff: [implementation.diff](qa/motion/implementation.diff), SHA-256 b89fbf3348b9b6188b126723cb9d3ef8dc51583237764e5529926f7997a97fa7. Stat: [implementation-stat.txt](qa/motion/implementation-stat.txt), SHA-256 811018f8e5b1349f1c9cee60a8e254fe5aa0e6a26f19730ae27d42f67487e041.

Deterministic recipe, sorted paths exactly the table above: append raw stdout bytes of git -c core.quotePath=false diff --no-ext-diff --no-color BASE -- PATH for the two tracked paths; append git -c core.quotePath=false diff --no-ext-diff --no-color --no-index -- /dev/null PATH for new CSS (expected exit 1). BASE is c2981864dbf91a192c89f93e1b75f3a166a59827. No stderr, newline conversion, banners or unrelated paths. Stat: git apply --stat docs/reviews/avis-review-quick-panel/qa/motion/implementation.diff. This is reproducible after commit with the fixed base and new-file attribution. Planning/review/evidence changes are separately attributable through this exact manifest.

```text
 .../avis/_components/review-quick-panel.module.css |   34 +++++++++++++++++
 .../avis/_components/review-quick-panel.tsx        |   40 ++++++++++++++------
 docs/features/reputation/README.md                 |    5 ++-
 3 files changed, 66 insertions(+), 13 deletions(-)
```

## Requirement/scenario mapping

| Approved behavior                                   | Current code/test continuity                                                   | Actual fresh observation                                                                                                                          |
| --------------------------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Slide from right and dismiss                        | CSS panel-enter/exit on shared Dialog; reduced-motion none                     | 8 transform traces across 4 widths; 280ms entrance/200ms exit; reduced-motion mobile                                                              |
| Immediate selected-item feedback and no stale forms | Original ReviewsPage matching ID and quick-panel loading; open uses live props | Delayed real selection RSC shows named loading; cached item opens without fake delay; closing during pending response stays closed                |
| Stable closing editor and list context              | Exit-only snapshot; pointer-events none; original query/focus behavior         | Exit frame editor stable with no unavailable/loading flash; X/Escape/backdrop, exact page/filter/scroll/focus return                              |
| Existing processing, accessibility and Satisfaction | Existing forms/loader/actions; original query tests; shared Dialog             | Note/draft/status pending/success, persisted SQL/reload, unsaved input, OWNER/STAFF, four widths, focus containment, internal Satisfaction inline |

No spec/requirement deviation. Closing exits without autosaving edits, as approved Design/current documentation state.

## TECHNICAL VERIFY

TECHNICAL IMPLEMENTATION COMPLIANCE: PASS

VERIFY: PASS

Assessment [04-motion-verification-evidence.md](04-motion-verification-evidence.md) SHA-256 300a72dcce18ab27a9ade3b95005a24cd2f612452677109bb2a8c9723b0de7d5. Matrix covers UI, Interaction and Integration; exact UTF-8 section hash 8c6bb44758dcaad644f557c25ef95c9b91023904aceeb24bfa3092563e070234. Canonical block [verify-block.txt](qa/motion/verify-block.txt), SHA-256 204c486329af1dadd2884d2721c93764fefc42316080458b34e9a1a0fc1d3141; exact contents included below, excluding Markdown fences:

```text
TECHNICAL IMPLEMENTATION COMPLIANCE: PASS
VERIFY: PASS
Assessment source: docs/reviews/avis-review-quick-panel/04-motion-verification-evidence.md
Assessment source SHA-256: 300a72dcce18ab27a9ade3b95005a24cd2f612452677109bb2a8c9723b0de7d5
Matrix source: docs/reviews/avis-review-quick-panel/04-motion-verification-evidence.md#technical-compliance-matrix
Matrix exact UTF-8 section SHA-256: 8c6bb44758dcaad644f557c25ef95c9b91023904aceeb24bfa3092563e070234
pnpm --filter @yuta/backoffice build: exit 0; compile, TypeScript, page generation PASS
pnpm --filter @yuta/backoffice test: exit 0; 129 files PASS, 1 skipped; 1555 tests PASS, 54 skipped
pnpm docs:check: exit 0; 36 current documents PASS
pnpm architecture:check: exit 0; PASS
pnpm -r --if-present typecheck: exit 0; all present scripts PASS
pnpm format:check: exit 1; preservation PASS (67 paths); 51 pre-existing unchanged warnings
node node_modules/prettier/bin/prettier.cjs --check "apps/backoffice/src/app/(authenticated)/visibilite-reputation/avis/_components/review-quick-panel.module.css" "apps/backoffice/src/app/(authenticated)/visibilite-reputation/avis/_components/review-quick-panel.tsx" "docs/features/reputation/README.md" "openspec/changes/avis-review-quick-panel/design.md" "openspec/changes/avis-review-quick-panel/tasks.md" "docs/reviews/avis-review-quick-panel/03-final-review.md" "docs/reviews/avis-review-quick-panel/04-motion-correction-review.md" "docs/reviews/avis-review-quick-panel/04-motion-verification-evidence.md" "docs/reviews/avis-review-quick-panel/qa/motion/QA_REPORT.md" "docs/reviews/avis-review-quick-panel/qa/motion/qa-results.json" "docs/reviews/avis-review-quick-panel/qa/motion/motion-summary.json" "docs/reviews/avis-review-quick-panel/qa/motion/screenshot-manifest.md" "docs/reviews/avis-review-quick-panel/qa/motion/format-baseline.json" "docs/reviews/avis-review-quick-panel/qa/motion/evidence-manifest.json": exit 0; 14 exact task paths; scoped PASS
openspec validate avis-review-quick-panel --strict: exit 0; PASS
git diff --check: exit 0; tracked correction PASS
Browser QA: PASS; 47 scenarios, 13 actual screenshots, 8 actual motion traces; qa/motion/QA_REPORT.md
DEV_USABLE: YES; MANUAL_TEST_READY: YES; actual affected HUMAN_PRODUCT_VALIDATION: ACCEPTED on 2026-10-03
Skipped: unrelated full cloud/local suites/builds, guarded Pointage/OpenAI lanes, screen-reader speech, full DB outage, real providers/production
```

Full formatting remains FAIL on 51 pre-existing paths. Bounded acceptance requested: every warning path is unchanged against base and preserved, while every correction text path passes scoped formatting. Exact warning attribution/hashes in [format-baseline.json](qa/motion/format-baseline.json), SHA-256 baabd03770c8c7a9233311046f193cf33d38e949e6857b3cade16b41f8e1c121. No repository-wide format PASS is asserted.

## QA

UI_AFFECTING: YES

BROWSER_QA_REQUIRED: YES

QA: PASS

Report [QA_REPORT.md](qa/motion/QA_REPORT.md), SHA-256 af1afd539a4c0ed0dac64eb7a89a1499c9339a0f32155b34d44a1ee66c116d4b. Raw results [qa-results.json](qa/motion/qa-results.json), SHA-256 c8205b154f1a2ba6d019f3134dd8e39532c64f10b9aa871087c2fa930678785a. 47 named scenarios, 13 inspected actual screenshots, 8 computed-CSS/transform frame traces; widths 1440x900, 1024x768, 768x1024, 390x844 plus mobile reduced motion. OWNER/STAFF, real app sessions/actions and synthetic disposable DB; no fake responses/external provider. All slide/state/focus/scroll/explicit Save continuity and Satisfaction regression pass; zero console/page errors/outbound attempts. Screenshot paths/states/roles/hashes in [screenshot-manifest.md](qa/motion/screenshot-manifest.md), SHA-256 a7d9dce851c81c793f2b57e087de61afa0e8009c2bd6a737c8574bf69dd49020. Key screenshots: qa/motion/panel-1440.png, panel-768.png, editor-390.png, reduced-motion-390.png. Motion traces, not static screenshots, prove sliding.

Screen-reader speech/full DB outage/real provider/production not tested. Guarded Pointage/OpenAI lanes and unrelated full cloud/local builds/suites skipped as recorded above. Owned QA runtime removed; current user's localhost:3001 remains running. No unresolved visual/accessibility defect in observed scope.

## Development feedback and iteration lineage

DEV_USABLE YES; MANUAL_TEST_READY YES on actual current-user dev/session. The one affected Human retest request received actual current-user ACCEPTED on 2026-10-03: "Đã thấy trượt vào/ra, tương tác ổn" (sliding in/out visible and interaction works). Source identities are the exact TSX/CSS hashes above. The previous CHANGES_REQUESTED and original static QA limitation remain historical. Human acceptance applies only to affected open/close experience; it does not approve QA/VERIFY/Gate 3, providers or production. Correction Apply/dev/QA generation 1 PASS; no failed recovery, iteration-budget reset or scope expansion.

## Recommendation and pending independent decision

APPROVE_GATE_3_WITH_EXPLICIT_SYNC_AUTHORIZATION_IF_READY

This is a technical readiness recommendation only. Sync authorization remains PENDING because sync/archive is excluded from the user's bounded task. Fresh independent Gate 3 verdict on exact candidate/evidence is required before the previously authorized isolated local commit. The author cannot approve this packet.

## Recorded independent approval

Approval source: USER_DELEGATION_WITH_INDEPENDENT_REVIEW

Mode selection source: actual current-user reply CODEX_ONLY — COMMIT_AFTER_TASK: YES for the Avis quick-panel task; same bounded follow-up correction.

Independent reviewer: /root/quick_panel_motion_gate3, fresh read-only context.

Approval recorded by: Codex workflow

Approved: 2026-10-03 07:35:38 UTC

Independent review evidence: actual APPROVED verdict with no actionable findings. STANDARDS PASS with bounded format acceptance; SPEC PASS; TIC PASS; VERIFY PASS; QA PASS. Reviewed pending packet SHA-256 42c755f56868e7e3745e08199fdaa79499e9ddf0c892b801c7fcc1a2e55ba4fa and current manifest 84e098d9ff630370c3f37ca15b83a3ac30c734d510f858d159abea413479003b (all 39 records). Assessment 300a72dcce18ab27a9ade3b95005a24cd2f612452677109bb2a8c9723b0de7d5; exact matrix section 8c6bb44758dcaad644f557c25ef95c9b91023904aceeb24bfa3092563e070234; canonical block 204c486329af1dadd2884d2721c93764fefc42316080458b34e9a1a0fc1d3141; Tasks 49b514f89d22e2064fa14eaba21a7d69e4af0075566212b0b373efdc86a5f24a. Every manifest path, the pending packet and unrelated POS metadata were rechecked against reviewed hashes before recording this approval. Only approval metadata changes this packet after the verdict; implementation, planning and assessed evidence stay unchanged.

The reviewer reproduced the 5964-byte correction implementation patch b89fbf3348b9b6188b126723cb9d3ef8dc51583237764e5529926f7997a97fa7 and all matrix/block/hash records; inspected all 47 scenarios, 13 screenshots and eight raw animation traces. All observed exit frames retained editor content with pointer interaction disabled and no loading/unavailable flash. Actual affected Human acceptance remains separately attributed above. Review ran no evaluators, writes or runtime actions.

Bounded accepted formatting limitations: full repository format FAIL on the 51 exact unchanged baseline paths in format-baseline.json; 14-path task formatting PASS. Separately accept only mandatory single-space unified-diff blank context markers at qa/motion/implementation.diff lines 54, 67 and 135 for exact patch hash b89fbf3348b9b6188b126723cb9d3ef8dc51583237764e5529926f7997a97fa7. A staged whole-diff whitespace warning on those evidence bytes must be reported, not hidden; every other staged path must pass. This is no general whitespace waiver.

Approval allows the already authorized isolated local commit after final staged integrity checks. Sync authorization remains PENDING; no sync/archive, push or deployment authorization is added.
