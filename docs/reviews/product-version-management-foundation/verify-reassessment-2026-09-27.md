# Product Release Identity — Phase 5 VERIFY reassessment

Change: `product-version-management-foundation`  
Schema: `yuta-spec-driven`  
Assessed: 2026-09-27, Europe/Paris  
HEAD: `0dad7546745d4072eae8337f45cbc263d19ed66c`  
UI_AFFECTING: YES  
BROWSER_QA_REQUIRED: YES  
TECHNICAL IMPLEMENTATION COMPLIANCE: PASS  
VERIFY: PASS

## Authority and historical result

The current user directed a direct resolution of the Product Version VERIFY formatting condition after reviewing the specific proposal to use change-scoped formatting evidence and preserve the repository-wide failure. The [Phase 5 formatting acceptance amendment](../../../openspec/changes/product-version-management-foundation/tasks.md) supersedes only the mandatory-PASS classification of `pnpm format:check` for this change. The Tasks SHA-256 at this technical reassessment was `d36ef930676b2e208641290338c36d34dc2bc22e04aa7087172cd3aa2671e65a`; later Phase 6 checkbox/status updates do not change the amendment.

The original [2026-09-24 VERIFY evidence](verify-evidence.md) remains byte-for-byte unchanged at SHA-256 `7b9e2f54e900075874e39f662d4078eab84ba39e11b73f58d68f072818b58d76`. Its `TECHNICAL IMPLEMENTATION COMPLIANCE: FAIL`, `VERIFY: FAIL`, and `pnpm format:check` exit 1 with 82 warnings are historical outcomes, not retroactive PASS. The broad formatter was not rerun for this reassessment. This record evaluates a new, explicitly approved change-specific criterion; it makes no repository-wide formatting claim and does not change the parent formatting or V-LOCK changes.

Gate 1 and Gate 2 packets remain `APPROVED`, with SHA-256 `fd4b1f47ab87be02cda632228f4d27838cb4f77fb0ca6cb3b109346144900564` and `3d18c72596a250e6ae85a1f75b54ef2f5b0c164a0c2333903cc8f32ede9c25a7`. Reviewed Proposal, Analysis, delta Spec and Design still match the hashes in the original VERIFY evidence. The worktree was clean before this reassessment; only Tasks and this new evidence were written.

## Candidate identity and attribution

All six attributed Core/Web/Backoffice source/test files and the Product Release Home still match their exact 2026-09-24 SHA-256 values in the original VERIFY evidence. `docs/PRODUCT_KNOWLEDGE.md` and `docs/MODULE_REGISTRY.md` also match exactly, so the prior Phase 4 isolated-addition formatting and preimage attribution remain applicable. `docs/README.md` changed after that run due to other repository work; its current whole file passes Prettier and `pnpm docs:check` passes. Root and affected package manifests and `pnpm-lock.yaml` have no diff between the original VERIFY HEAD `14dd0f35645586abc5877da28df0fcd16eba971d` and current HEAD. The current dirty worktree contains no Product Release source edit.

The current change-scoped formatting check covered:

- `packages/core/src/product-release.ts`, `packages/core/src/index.ts`, `packages/core/test/product-release.test.ts`;
- `apps/web/src/components/marketing/MarketingShell.tsx`;
- `apps/backoffice/src/components/backoffice/backoffice-frame.tsx`, `apps/backoffice/test/product-release-footer.test.tsx`;
- `docs/features/product-release/README.md`, current `docs/README.md`;
- Product Version `design.md` and current `tasks.md`.

Those ten exact paths passed `pnpm exec prettier --check`. Approved Proposal, Analysis, delta Spec and review packets remain hash-bound rather than reformatted. The two mixed Product Knowledge indexes retain their prior whole-file formatting limitations; no current Product Version addition or attributed file failed its applicable scoped check. This is `PRODUCT_VERSION_SCOPED_FORMAT_ACCEPTANCE: PASS`, not `pnpm format:check: PASS`.

## Current command evidence

| Check                                                                                                    | Result                                            | Scope                                                           |
| -------------------------------------------------------------------------------------------------------- | ------------------------------------------------- | --------------------------------------------------------------- |
| `pnpm --filter @yuta/core test`                                                                          | exit 0; 2 files, 41 tests passed                  | Pure release metadata, stage mapping, validation and formatting |
| `pnpm --filter @yuta/core typecheck`                                                                     | exit 0                                            | Core API and types                                              |
| `pnpm --filter @yuta/backoffice exec vitest run test/product-release-footer.test.tsx`                    | exit 0; 1 test passed                             | Authenticated shell footer rendering from Core                  |
| `pnpm typegen:next`                                                                                      | exit 0; six Next apps, 4/4 outputs validated each | Required generated-type prerequisite; no source edit            |
| `pnpm --filter @yuta/web typecheck`                                                                      | exit 0                                            | Web consumer                                                    |
| `pnpm --filter @yuta/backoffice typecheck`                                                               | exit 0                                            | Backoffice consumer                                             |
| `pnpm -r --if-present typecheck`                                                                         | exit 0; 15 of 16 workspace projects in scope      | Final current workspace type coverage after Next typegen        |
| `pnpm --filter @yuta/web build`                                                                          | exit 0; 17/17 static pages                        | Web build integration                                           |
| `pnpm build:backoffice`                                                                                  | exit 0; 7/7 static pages                          | Backoffice build integration                                    |
| `pnpm docs:check`                                                                                        | exit 0; 36 current documents                      | Product Release Home and docs routing                           |
| `pnpm architecture:check`                                                                                | exit 0                                            | Import/runtime boundaries                                       |
| `openspec validate product-version-management-foundation --type change --strict --json --no-interactive` | exit 0; 1 valid, 0 issues                         | Planning structure                                              |
| Scoped Prettier check on the ten paths listed above                                                      | exit 0; all matched files formatted               | Amended Product Version formatting criterion                    |

The original VERIFY run's full Backoffice suite (984 passed, 54 skipped) remains historical evidence and was not repeated: the directly attributed code and dependency manifests/lock are unchanged, while the current focused test, direct consumer typechecks and builds passed. The recursive workspace typecheck was run again after Browser QA and passed. The skipped historical tests remain skipped. The historical global formatter remains FAIL and is not represented by a new exit result.

## Current Technical Compliance Matrix

| Approved rule or constraint                            | Authority                                | Current implementation/evidence                                                                                                                                           | Assessment |
| ------------------------------------------------------ | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| R1 one four-field Product Release, no release ID       | Approved Spec/Design; Core TIC           | Exact Core source hash unchanged; 41 current tests and Core typecheck                                                                                                     | PASS       |
| R2 six maturity stages and canonical labels            | Approved Spec/Design; Core TIC           | Exact Core source hash unchanged; exhaustive mapping tests                                                                                                                | PASS       |
| R3 Product Version grammar and package independence    | Approved Spec/Design; Core TIC           | Exact Core source/tests unchanged; current tests; package/lock unchanged                                                                                                  | PASS       |
| R4 deterministic full/compact representation           | Approved Spec/Design; Core TIC           | Exact Core formatter unchanged; current tests                                                                                                                             | PASS       |
| R5 Public Web footer derives full representation       | Approved Spec/Design; Web TIC            | Exact Web source unchanged; current Web typecheck/build                                                                                                                   | PASS       |
| R6 Backoffice footer derives compact same-source value | Approved Spec/Design; Backoffice TIC     | Exact Backoffice source/test unchanged; current focused render test, typecheck/build                                                                                      | PASS       |
| R7 maturity independent from capability readiness      | Approved Spec/Design; Core/docs TIC      | Exact Core source and Product Release Home unchanged; current tests/docs check                                                                                            | PASS       |
| Phase 1–3 package and runtime boundaries               | Core/Web/Backoffice AGENTS; approved TIC | Current Core tests/typecheck; Web/Backoffice typecheck/build; architecture check                                                                                          | PASS       |
| Phase 4 documentation and attribution                  | Approved TIC; Product Release Home       | Home and mixed indexes retain accepted hashes; current docs index full Prettier and docs check                                                                            | PASS       |
| Phase 5 change-scoped formatting                       | Current-user-approved Tasks amendment    | Ten current files Prettier PASS; unchanged mixed-index attribution; historical global FAIL reported separately                                                            | PASS       |
| Phase 5 structural and focused regression evidence     | Approved TIC; YUTA workflow              | Strict OpenSpec validation, focused current tests, direct builds/typechecks; original detailed 7-requirement/21-scenario mapping remains bound to unchanged source hashes | PASS       |

Each applicable current row passes under the amended criterion. The original evidence contains the full 21-scenario mapping and earlier phase matrix; no approved Product Release behavior or implementation file changed for this reassessment. Therefore `TECHNICAL IMPLEMENTATION COMPLIANCE: PASS` and `VERIFY: PASS` are the current **technical** results only.

## Limitations and next state

At the time of the initial Phase 5 assessment, Browser QA had not run. Subsequent Phase 6 evidence is recorded separately in [QA_REPORT.md](qa/QA_REPORT.md). The later Registry review-marker update records local VERIFY/QA outcomes only, without changing Product behavior; its exact Product Release section was formatted, its accepted Phase 4 preimage was reconstructed at the same SHA-256, and `pnpm docs:check` passed. Technical PASS alone does not establish deployment, production readiness or capability lifecycle promotion. No V-LOCK, parent formatting remediation, sync or archive was performed during this reassessment.
