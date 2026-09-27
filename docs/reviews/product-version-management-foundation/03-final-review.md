Change: `product-version-management-foundation`  
Gate: Gate 3 — Final implementation review  
Review status: APPROVED  
Approval source: explicit current-user instruction  
Approval recorded by: Codex workflow  
Approved: 2026-09-27T16:31:06+02:00  
Created: 2026-09-27T15:59:37+02:00  
Schema: `yuta-spec-driven`  
Analysis conclusion: `READY_FOR_SPECS`  
Sensitive change: NO; Sensitive Design Gate `NOT_TRIGGERED`  
UI_AFFECTING: YES  
BROWSER_QA_REQUIRED: YES  
TECHNICAL IMPLEMENTATION COMPLIANCE: PASS  
VERIFY: PASS  
QA: PASS  
Sync authorization: AUTHORIZED_BY_CURRENT_USER  
Finish outcome: COMPLETED

# Gate 3 review — Product Release identity

## Decision requested

Review the bounded Product Release foundation: one authoritative `@yuta/core` record for `YUTA` / `ALPHA` / `0.1.0-alpha.1` / `Foundation`, with derived labels in the existing Public Web and authenticated Backoffice footers. All 22 Tasks are checked, current technical VERIFY passes under the explicitly approved change-scoped formatting criterion, and mandatory local Browser QA passes. A Gate 3 approval and any later spec sync/archive remain separate human decisions. This packet does not approve deployment or capability readiness.

Recommendation: `APPROVE_GATE_3_WITH_EXPLICIT_SYNC_AUTHORIZATION_IF_READY`.

## Approved gates and planning integrity

`Get-FileHash -Algorithm SHA256` over exact file bytes, lowercase, was used for all values below. The reviewed path sets and hashes in approved Gate 1 and Gate 2 were rechecked before this packet.

| Artifact                                                                                                             | Current SHA-256                                                    | Review relationship                                                          |
| -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | ---------------------------------------------------------------------------- |
| [Gate 1 packet](01-analysis-review.md)                                                                               | `fd4b1f47ab87be02cda632228f4d27838cb4f77fb0ca6cb3b109346144900564` | `APPROVED`; includes explicit Product decisions and prior historical blocker |
| [Gate 2 packet](02-specs-review.md)                                                                                  | `3d18c72596a250e6ae85a1f75b54ef2f5b0c164a0c2333903cc8f32ede9c25a7` | `APPROVED`; 7 requirements / 21 scenarios                                    |
| [Proposal](../../../openspec/changes/product-version-management-foundation/proposal.md)                              | `5d924477c3d83fc7f0b5e4fbf657c66f17a9d85b6a1439bbe4e43814ed4bf0dc` | Matches Gate 1                                                               |
| [Analysis](../../../openspec/changes/product-version-management-foundation/analysis.md)                              | `f2721e6a41223b1283e79becbe98f62818580cbfdc6a22550d3199b180256d29` | Matches Gate 1                                                               |
| [Delta Spec](../../../openspec/changes/product-version-management-foundation/specs/product-release/identity/spec.md) | `bf3923c420a10918bbd6233a9c3102b3f8da896ee5908e6764b8d2102b69d95d` | Matches Gate 2                                                               |
| [Design](../../../openspec/changes/product-version-management-foundation/design.md)                                  | `e930bdddf01d0bf7b18490d915df9c5b81c2381e4a32b85827b4f40de8e3408c` | No separate sensitive gate required                                          |
| [Tasks/TIC](../../../openspec/changes/product-version-management-foundation/tasks.md)                                | `8da6cf1be6768e2ce4f10ad0a1a8deee088d1b5b5ba7c228df2d972ad273793b` | 22/22 checked; includes 2026-09-27 formatting acceptance amendment           |

Design keeps Product Release metadata, the closed six-stage mapping, validation and pure formatting in `@yuta/core`. Web and Backoffice own their existing footer placement. There is no release ID, package-version synchronization, new `@yuta/ui` primitive, database/API/tenant boundary, deployment change or capability-readiness inference. The exact Core source is the only runtime current-release record.

## Implementation and attribution

The Product Release implementation was committed within `fc63fef5`, a commit also containing Pointage work. The current HEAD is `0dad7546745d4072eae8337f45cbc263d19ed66c`. The attached [exact Product Release scoped diff](implementation-scoped.diff) contains only the ten attributed paths below. Its SHA-256 is `04d04afe2f4fad0980bbcb8cd1ba0ea6d6753bca483bb607fe961d71ed907556`; `git apply --reverse --check` and `git apply --stat` on that diff both exited 0. The scoped stat is **10 files, 506 insertions, 3 deletions**. The entire diff is attached; the reviewer can request any additional hunk context.

Deterministic rebuild command: `python docs/reviews/product-version-management-foundation/rebuild-scoped-diff.py`. The [rebuild script](rebuild-scoped-diff.py) SHA-256 is `fab1766c4c3002d76b818520b445a8a5b6bd7c783ff3f4af3e5a262d15ee2133`. It compares unchanged direct source/test files to `fc63fef5^`, removes exactly the Product Release blocks from the two shared indexes to reconstruct their accepted preimages, and removes the one Product Release link from current `docs/README.md`. The two reconstructed shared-index preimage hashes match the original Phase 4 evidence: `33c7498883a1c8405612aeedbe6e1ab906abcd096860153b1aa77a17963a3f67` and `9c454d370e50e6c5950d03a9614ee14699d42640aa05e9e3bbbae6320457c764`. No Pointage hunk is included.

| Sorted attributed implementation/documentation path              | Contribution                                                                                                                |
| ---------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `apps/backoffice/src/components/backoffice/backoffice-frame.tsx` | Existing authenticated `AppFooter` derives compact release text from Core                                                   |
| `apps/backoffice/test/product-release-footer.test.tsx`           | Footer render regression test                                                                                               |
| `apps/web/src/components/marketing/MarketingShell.tsx`           | Existing public footer derives full release text from Core                                                                  |
| `docs/MODULE_REGISTRY.md`                                        | Product Release registry row; current review marker records local VERIFY/QA PASS while deployment/readiness stay unverified |
| `docs/PRODUCT_KNOWLEDGE.md`                                      | Route to canonical Product Release knowledge and Core owner                                                                 |
| `docs/README.md`                                                 | One Product Release knowledge link                                                                                          |
| `docs/features/product-release/README.md`                        | Product Release semantics and manual update procedure, without a second runtime record                                      |
| `packages/core/src/index.ts`                                     | Narrow public exports                                                                                                       |
| `packages/core/src/product-release.ts`                           | Canonical metadata, six-stage labels, parser and formatters                                                                 |
| `packages/core/test/product-release.test.ts`                     | Metadata, validation, stage and formatting cases                                                                            |

Key hunks in the attached diff replace only the two approved footer phrases:

```diff
-          <p>Projet pilote · Déployé sur Vercel</p>
+          <p>
+            {formatProductRelease(CURRENT_YUTA_PRODUCT_RELEASE)} · Déployé sur
+            Vercel
+          </p>
-          Espace restaurateur YUTA v1.0.0&nbsp;&nbsp; &copy; 2025 YuTa
-          Solutions. Tous droits reserves.
+          Espace restaurateur YUTA{' '}
+          {formatCompactProductRelease(CURRENT_YUTA_PRODUCT_RELEASE)}
+          &nbsp;&nbsp; &copy; 2025 YuTa Solutions. Tous droits reserves.
```

Current worktree changes for this reassessment/review are limited to the Tasks amendment and completion marks, the single Registry review-marker update, and new Product Version review/QA evidence. The current `git diff --stat` covers only the two tracked edits; the attached scoped diff covers implementation already present in HEAD and the Product Release sections of shared documents. The `docs/MODULE_REGISTRY.md` current SHA-256 is `6e90d6e4a124b565bd28b49bb95deea937afc2e169b3e23eaa0b849d500a84f9`; `docs/PRODUCT_KNOWLEDGE.md` remains `96f13edecdaefa941d78f817121e92f41c25544712d2abdfe755b660b81fa259`. No manifest or lockfile version was synchronized.

## Requirements and technical VERIFY

The [original VERIFY evidence](verify-evidence.md) contains the detailed 7-requirement/21-scenario-to-code-and-test mapping and Phase 1–5 Technical Compliance Matrix. Its SHA-256 is `7b9e2f54e900075874e39f662d4078eab84ba39e11b73f58d68f072818b58d76`. It truthfully records `TECHNICAL IMPLEMENTATION COMPLIANCE: FAIL`, `VERIFY: FAIL` and `pnpm format:check` exit 1 with 82 historical out-of-scope/global warnings. It remains byte-for-byte unchanged.

The current [Phase 5 reassessment](verify-reassessment-2026-09-27.md) SHA-256 is `511fabeeed7b41bfcb4c7dcd8540b29c753bd506e4c2387696bbd2fb0db9bc04`. It contains the current Technical Compliance Matrix with Phase 1–5 coverage and records `TECHNICAL IMPLEMENTATION COMPLIANCE: PASS`, `VERIFY: PASS` under the user-approved, change-specific scoped formatting criterion. This does not claim `pnpm format:check` or repository-wide formatting PASS. The later Registry marker update only records this VERIFY and local QA outcome; it adds no Product behavior. Its isolated Product Release section was formatted, `pnpm docs:check` passed again, and the scoped diff/preimage test includes its current exact bytes.

| Approved requirement                               | Current code/test/evidence                                               |
| -------------------------------------------------- | ------------------------------------------------------------------------ |
| R1 four-field canonical Product Release            | Core record and 41 current Core tests; no release ID                     |
| R2 six closed stages and public labels             | Exhaustive Core mapping tests, including GA → `Stable`                   |
| R3 version grammar independent from packages/stage | Core parser/tests; package manifests and lock unchanged                  |
| R4 deterministic full/compact representation       | Core formatters and independent literal expectations                     |
| R5 Public Web footer                               | Server Component source, Web typecheck/build, real Web Browser QA        |
| R6 Backoffice footer and same-source consistency   | Backoffice source/render test, typecheck/build, authenticated Browser QA |
| R7 maturity separate from capability readiness     | Core tests and Product Knowledge/Registry review; no readiness promotion |

Canonical VERIFY evidence block SHA-256: `c9b4e831c08df4bf0803296aa3542a8e564c20b2ae99f9b025f5edcb310edc34`. The bytes between the markers below, excluding the marker lines, are the hashed UTF-8 block and are part of this packet unchanged.

<!-- VERIFY_EVIDENCE_BEGIN -->

```text
ASSESSMENT_SOURCE=docs/reviews/product-version-management-foundation/verify-reassessment-2026-09-27.md
ASSESSMENT_SHA256=511fabeeed7b41bfcb4c7dcd8540b29c753bd506e4c2387696bbd2fb0db9bc04
HISTORICAL_SOURCE=docs/reviews/product-version-management-foundation/verify-evidence.md
HISTORICAL_SHA256=7b9e2f54e900075874e39f662d4078eab84ba39e11b73f58d68f072818b58d76
HISTORICAL_RESULT=TECHNICAL IMPLEMENTATION COMPLIANCE: FAIL; VERIFY: FAIL; pnpm format:check exit 1 with 82 warnings
CURRENT_RESULT=TECHNICAL IMPLEMENTATION COMPLIANCE: PASS; VERIFY: PASS; PRODUCT_VERSION_SCOPED_FORMAT_ACCEPTANCE: PASS
pnpm --filter @yuta/core test => exit 0; 41 passed
pnpm --filter @yuta/core typecheck => exit 0
pnpm --filter @yuta/backoffice exec vitest run test/product-release-footer.test.tsx => exit 0; 1 passed
pnpm typegen:next => exit 0; six Next apps, 4/4 outputs each
pnpm --filter @yuta/web typecheck => exit 0
pnpm --filter @yuta/backoffice typecheck => exit 0
pnpm -r --if-present typecheck => exit 0; 15 of 16 workspace projects in scope
pnpm --filter @yuta/web build => exit 0; 17/17 static pages
pnpm build:backoffice => exit 0; 7/7 static pages
pnpm docs:check => exit 0; 36 current documents, including post-QA Registry marker update
pnpm architecture:check => exit 0
openspec validate product-version-management-foundation --type change --strict --json --no-interactive => exit 0; 1 valid, 0 issues
pnpm exec prettier --check packages/core/src/product-release.ts packages/core/src/index.ts packages/core/test/product-release.test.ts apps/web/src/components/marketing/MarketingShell.tsx apps/backoffice/src/components/backoffice/backoffice-frame.tsx apps/backoffice/test/product-release-footer.test.tsx docs/features/product-release/README.md docs/README.md openspec/changes/product-version-management-foundation/design.md openspec/changes/product-version-management-foundation/tasks.md => exit 0
python docs/reviews/product-version-management-foundation/rebuild-scoped-diff.py => exit 0; ten attributed files
git apply --reverse --check docs/reviews/product-version-management-foundation/implementation-scoped.diff => exit 0
```

<!-- VERIFY_EVIDENCE_END -->

The full Backoffice suite (984 passed, 54 skipped) is retained from the historical VERIFY run, with unchanged direct implementation and dependency manifests/lock. The recursive workspace typecheck was rerun and passed; the full Backoffice suite was not repeated. The global formatter was not rerun; its historical FAIL remains separate. `pnpm test:local`, POS/database migration checks, a nonexistent Web test script, and broad cloud suites were outside this bounded static Product Release change. No spec/design deviation or unresolved Product behavior issue was found.

## Browser QA

The [QA report](qa/QA_REPORT.md) SHA-256 is `3e31046ef1c8273ccedc636e7a84c6c46a8f8d234e4495809166e8c147635883`; the [screenshot manifest](qa/screenshot-manifest.md) SHA-256 is `c8ebb18fbee01cb1bdf206aa2dd7ca42ee4dcf78e529dd588055e477a1356c54`. All five listed SHA-256 values were recomputed against exact PNG bytes and matched. QA status is **PASS** for actual local production-build Web and authenticated Backoffice routes at desktop `1366×768` and mobile `390×844`.

| Browser evidence                                                   | Role/state and scenario                                               | SHA-256                                                            |
| ------------------------------------------------------------------ | --------------------------------------------------------------------- | ------------------------------------------------------------------ |
| [Web desktop](qa/web-desktop.png)                                  | Public footer; full label and existing hosting text                   | `1bf2c98b753e38ced57ad89cca49a1efc6fcc6ea8fb2fda5f04faed77bfa8b87` |
| [Web mobile](qa/web-mobile.png)                                    | Public footer; readable label, no overflow                            | `9782cb937f60402515268c1ca34038b38ea1aaad6370e98e5610caa530bd2005` |
| [Backoffice desktop](qa/backoffice-desktop.png)                    | Authenticated owner, LuNa Poitiers; compact footer in desktop shell   | `51dc2604c4d81eafb860a73eda29b98bbd3a7ff3173fe386083d8563c9e0efb5` |
| [Backoffice mobile](qa/backoffice-mobile.png)                      | Authenticated owner, LuNa Poitiers; compact footer wraps within 390px | `96276961adc8bee612800d9596e51196d83b00ae73e3fbd618df95aabe1a21e8` |
| [Initial authentication redirect](qa/backoffice-auth-required.png) | Historical environment blocker; not acceptance evidence               | `e56c70d4da562032665bae3e3d421dc8e2ea898aedd2fb56d9063fc32951d600` |

The user completed sign-in directly. The initial local DB port mismatch was corrected only in ignored local environment configuration, with a healthy existing DB; no database reset or seed occurred. Backoffice subsequently loaded the authenticated route. Both footers showed the approved Core-derived representation, old wording was absent, no horizontal overflow or relevant clipping was observed, keyboard/basic accessibility checks passed, and captured console error logs were empty. The Backoffice mobile menu opened and closed. The historical redirect remains recorded without being misrepresented as final QA.

## Limitations and stop

- Product Release implementation/QA is evidenced only for local repository and local production-build routes. Deployment environment, Production Readiness, and other capability lifecycles remain separate and unassessed here.
- Repository-wide `pnpm format:check` historical exit 1/82 warnings remains unresolved in the separate formatting workstream. The approved Product Version-specific scoped criterion passed; no global PASS is asserted.
- The original `VERIFY: FAIL` and initial Backoffice `BLOCKED_BY_ENVIRONMENT` observations remain immutable historical records. Current reassessment and completed authenticated QA are separate dated evidence.
- No V-LOCK work, main-spec sync, archive, deployment or production operation was performed for this packet.

**Next authorized action:** Human review of this exact Gate 3 packet and current hashes. Stop before sync/archive; those require an explicit Gate 3 decision and sync authorization.

## Approved Gate 3 and pre-sync record

The review narrative above is the pre-approval snapshot. The current user approved Gate 3 with `ok, duyệt`, then answered `cho phép` to the exact request to sync the delta spec and archive `product-version-management-foundation`. These two current-user instructions jointly authorize finalization for this named change; neither is treated as deployment or production approval. The reviewed packet SHA-256 before this approval edit was `e87123889309ba3f25d71bcdb034cdad95c4bf81a03bb288c66d3bbd4c01a27f`.

Before recording approval, all 15 referenced artifact hashes, the Gate 1 and Gate 2 approved path/hash chains, five exact screenshot hashes, canonical VERIFY block hash, and 22/22 Tasks were rechecked and matched. `git apply --reverse --check docs/reviews/product-version-management-foundation/implementation-scoped.diff` and strict change validation exited 0. The active change remains at the repo-local `yuta-spec-driven` root; no Sensitive Design Gate is applicable.

Selected delta source, exclusively from `openspec status --change product-version-management-foundation --json` `artifactPaths.specs.existingOutputPaths`: `openspec/changes/product-version-management-foundation/specs/product-release/identity/spec.md` (SHA-256 `bf3923c420a10918bbd6233a9c3102b3f8da896ee5908e6764b8d2102b69d95d`). It contains one new `product-release/identity` capability with seven ADDED requirements and 21 scenarios; no MODIFIED, REMOVED or RENAMED operation. `openspec instructions specs --change product-version-management-foundation --json` exited 0 with valid JSON and no `rules` field; the main-spec format and Vietnamese artifact context were read. `openspec instructions archive --change product-version-management-foundation --json` supplied only the Vietnamese artifact context and no additional operation guidance.

Pre-sync main-spec snapshot: `openspec/specs/product-release/identity/spec.md` is `ABSENT`; `git status --short -- openspec/specs` is empty. The target archive path `openspec/changes/archive/2026-09-27-product-version-management-foundation` is absent. The current worktree's Product Version Tasks, Registry and review evidence are preserved; no unrelated path is selected for sync.

## Sync, archive, and post-archive knowledge scan

Specs: synced and validated `openspec/specs/product-release/identity/spec.md` (SHA-256 `f8344286e86a42362dca4f7c6f5b563da5de6756c83644b0b4baa30aae640a6e`). The main spec is the exact approved delta transformed into main-spec structure: a title was added and `## ADDED Requirements` became `## Requirements`; the seven requirement bodies and 21 scenarios match. No other capability or requirement was changed. `openspec validate --specs --strict --json --no-interactive` exited 0: 20 passed, 0 failed. Its only Product Release diagnostic was informational long requirement text.

Archive location: `openspec/changes/archive/2026-09-27-product-version-management-foundation`. The `openspec archive product-version-management-foundation --skip-specs --yes --json` command exited 0 and reported this exact archive path. `--skip-specs` prevented a redundant CLI sync after the separately validated agent-driven merge; the manually synced main spec remains present. The active path is absent. Archived Proposal, Analysis, Design, Tasks, delta spec and metadata retain their pre-archive bytes; the archived delta SHA-256 is `bf3923c420a10918bbd6233a9c3102b3f8da896ee5908e6764b8d2102b69d95d`. No archive warning or rollback occurred.

Knowledge consolidation: UPDATE_REQUIRED. The Product Release Knowledge Home and Product Knowledge routing correctly describe the current release, owners, direct consumers and lifecycle distinction. `docs/CURRENT_STATE.md` remains a broad routing summary and needs no Product Release edit. The Module Registry's Product Release Review Marker alone still says Gate 3 is pending after approval and archive. No `NEEDS REVIEW` item was resolved. The revised one-phrase reconciliation plus two mechanical Markdown table alignment lines is in [`04-knowledge-consolidation-review.md`](04-knowledge-consolidation-review.md) and its [`revised proposed diff`](04-knowledge-consolidation-formatted-proposed.diff), SHA-256 `6abbca60f058c31cc9e6ac49449566588c88ae4a37191d3eb93d9e51d022bc72`. The previously approved one-phrase diff failed the focused table-format check and was rolled back byte-exactly; its history remains in the Knowledge Review packet. Sources inspected: `docs/YUTA_KNOWLEDGE_CONSOLIDATION_PROTOCOL.md`, `docs/features/product-release/README.md`, `docs/PRODUCT_KNOWLEDGE.md`, `docs/MODULE_REGISTRY.md`, `docs/CURRENT_STATE.md`, the archived change, and the normative main spec. Canonical knowledge edit applied: `docs/MODULE_REGISTRY.md` only, using the separately approved revised three-line diff; post-apply SHA-256 `5dd35889fd2e8229b81096003baec420fe2de91e39de4af8478ee4fd1eaab2e6`.

Archive completed: 2026-09-27T16:34:01+02:00. Knowledge review: `docs/reviews/product-version-management-foundation/04-knowledge-consolidation-review.md` — `APPROVED` for the revised diff by explicit current-user instruction. Knowledge update completed: 2026-09-27T16:45:44+02:00. Workflow status: DONE. Focused Product Release table formatting, review-packet Prettier, `pnpm docs:check`, `pnpm architecture:check`, and `git diff --check` passed; historical unrelated whole-Registry formatting warnings remain separate.

RELEASE_FOLLOW_UP: REQUIRED for separately authorized Web and Backoffice deployment to a named target environment. That lane needs dated deployment/readiness evidence and post-deploy checks of both release footers. No deployment, production enablement, or capability lifecycle/readiness value was automatically promoted.
