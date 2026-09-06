Change: next-generated-types-bootstrap

Gate: Phase 1 remediation review — tasks 1.8–1.14 only

Review status: AWAITING_HUMAN_REVIEW

Created: 2026-09-04

Schema: yuta-spec-driven

Analysis conclusion: NO_SPEC_BEHAVIOR_CHANGE

Sensitive change: YES — repository bootstrap/integrity

## Authorization and result

Explicit current-user approval of reconciled Tasks + Implementation Plan SHA-256 `a6e1b9aa988a9927ca8e76637f58524f8038fbe30b8560d43d2988911a828193` authorized only Phase 1 remediation 1.8–1.14. Design remains SHA-256 `52468e84e4287c0fa2b87c758cd4d1b6fa7835dd15b3d110372072eff430fbd3`; Proposal/Analysis/skip_specs and all unchanged decisions preserved.

**Revised Phase 1 Technical Implementation Contract: BLOCKED — current-candidate evidence requires revalidation.**

18/26 tasks checked: 13 historical outcomes + 1.8–1.12. Snapshot runs below PASS for their exact bytes; 1.13/1.14 remain pending because of the late candidate drift recorded below. Six Phase 3 tasks remain unchecked. Đây **không phải** final TECHNICAL IMPLEMENTATION COMPLIANCE / VERIFY / QA PASS hoặc Gate 3 readiness. UI_AFFECTING: NO. BROWSER_QA_REQUIRED: NO.

## Exact attributed file inventory

Implementation, đúng năm allowed active paths:

1. `package.json`
2. `scripts/generate-next-types.mjs` — new orchestration/validation only
3. `scripts/next-generated-types-bootstrap.test.mjs`
4. `README.md`
5. `docs/DEVELOPMENT_WORKFLOW.md`

Authorized progress/review files only:

- `openspec/changes/next-generated-types-bootstrap/tasks.md` — approval/status/checkbox progress
- `docs/reviews/next-generated-types-bootstrap/02b-design-review.md` — subsequent approval/progress integrity metadata, embedded Design unchanged
- `docs/reviews/next-generated-types-bootstrap/phase-1-remediation-baseline.json`
- `docs/reviews/next-generated-types-bootstrap/phase-1-remediation.diff`
- `docs/reviews/next-generated-types-bootstrap/phase-1-remediation-evidence.json`
- `docs/reviews/next-generated-types-bootstrap/phase-1-remediation-review.md` — this packet

Không sửa CI, .gitignore, POS housekeeping, six app manifests, tsconfig, lockfile, versions, business source, Formalités hoặc lịch sử Phase 1/2/3. Hai concurrent docs ở phần dưới không thuộc inventory attributed.

[Exact scoped diff](phase-1-remediation.diff) gồm đủ new/untracked implementation, không chỉ Git working diff bỏ sót file mới. Diff command:

```text
git -c core.autocrlf=false diff --binary a99b0fb8ddd3021276d355c59882f195b00841f7 aaeee67ed834af44c62085ee497fcf2b2e7b3940 -- package.json scripts/generate-next-types.mjs scripts/next-generated-types-bootstrap.test.mjs README.md docs/DEVELOPMENT_WORKFLOW.md
```

Old snapshot có exact SHA-256 trùng pre-Apply baseline cho bốn existing implementation files; orchestrator chưa tồn tại ở baseline. Không lấy old HEAD thiếu Phase 1 implementation làm pre-remediation authority.

## Implemented behavior and documentation delta

`pnpm typegen:next → node scripts/generate-next-types.mjs`.

Root từ script location; exact fixed six apps/order. Preflight toàn bộ packages/Next 16.2.9/public CLI/installed TypeScript trước generation, revalidate mỗi app trước invocation. Sequential `process.execPath`, strict rejection flag, argument arrays, `shell:false`, app cwd, stdout/stderr forwarding. Không log-string PASS, private Next API, custom declarations, global NODE_OPTIONS, user package filter hoặc dependency upgrade.

Trước mỗi child: bounded parent/target checks, không links/reparse traversal/hard-linked output/tracked source; non-recursive unlink đúng bốn generated files rồi verify absence. Sau exit 0: require fresh regular/nonempty outputs, TypeScript parse và approved structure/cross-file route reference checks. Invalid result và process errors => nonzero, no later generator; CI conjunction giữ nguyên và chỉ gọi recursive check sau success.

Atomic exclusive root lock; contender không remove owner's lock; existing Next build/dev locks fail closed. Owned lock released sau success/handled failure. Timeout mặc định 120000ms terminate owned child, await close rồi mới release/report. Không kill unrelated processes hoặc claim lock kiểm soát arbitrary external Next invocations.

README/Development Workflow: validated root prerequisite kể cả direct single-app checks; rerun sau clean checkout/routes/config/generated-state changes; exclusive checkout, safe lock handling và rerun recovery. Raw Next chỉ diagnostic. Six next-env untracked state được mô tả đúng; không normalize documentation khác.

## Focused evidence — not Phase 3 acceptance

Exact command: `node --test scripts/next-generated-types-bootstrap.test.mjs`.

Final full-output run ở clean candidate: **50 tests / 50 PASS / 0 FAIL / 0 skipped**, exit 0, 24010.3901ms. Earlier canonical runs: 49/49 before adding overlapping-bootstrap case, then 50/50; final evidence JSON captures complete final clean-run output.

Coverage:

- exact mapping/order, real installed Next/TypeScript read-only resolution, preflight all six and revalidation;
- strict child arguments, executable, shell:false, cwd/stdout/stderr;
- only four-file invalidation, old-output rejection, missing/empty/malformed/wrong references and cross-file exports;
- synchronous/asynchronous process failure, early exit zero, signal, actual spawn error and synchronous spawn exception;
- parent/file links, hard links, tracked/nonregular/out-of-root output denial before unsafe writes;
- lock ownership/conflict/cleanup, known Next lock preservation, overlapping bootstrap invocation;
- actual hanging child timeout, observed close, `process.kill(pid, 0)` rejection after termination; aborted child also confirmed dead;
- unchanged CI conjunction/aliases/six ignores/POS bounded state.

Focused timeout uses an actual child and 1000ms test override, not timer-only simulation. CLI has no timeout/target/executable override; production default remains 120000ms. Every focused lock/process owning lifecycle asserts YUTA lock absence when cleanup is expected; contender cases first prove owner lock preserved. Temp package/process fixtures are **not actual Next negative acceptance**; N1–N9 and Linux/CI remain Phase 3 obligations. No Phase 3 claim from 50/50.

## Fresh exact-byte candidate and commands

Snapshot: `aaeee67ed834af44c62085ee497fcf2b2e7b3940`.

Tree: `f3368274649574eeebb02a60fd89102b1c34c8b4`.

Root: `D:/working/yuta/.tmp-bootstrap-remediation-20260904`.

Source HEAD: `07d9d6d88e07f6a819c7894ef2e35f79d1eb32fa`.

Temporary Git index, `core.autocrlf=false` staging/worktree creation; current uncommitted candidate included. Canonical index unchanged. **2210/2210 full path/raw SHA MATCH** before install, after install, after generation/typechecks and after focused tests. No LF-normalized acceptance. All six next-env and all six .next absent before generation, including after install; no env/generated/incremental caches copied; no build prewarm.

| Exact command in same candidate                                   | Exact result                                                                                             |
| ----------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `pnpm install --frozen-lockfile`                                  | exit 0; pnpm 11.8.0; 220 packages; 11.3s                                                                 |
| `pnpm typegen:next`                                               | exit 0; six actual Next 16.2.9 strict CLI runs; 4/4 outputs validated per app                            |
| `pnpm --filter @yuta/backoffice typecheck`                        | exit 0                                                                                                   |
| `pnpm --filter @yuta/web typecheck`                               | exit 0                                                                                                   |
| `pnpm --filter @yuta/booking-web typecheck`                       | exit 0                                                                                                   |
| `pnpm --filter @yuta/feedback-web typecheck`                      | exit 0                                                                                                   |
| `pnpm --filter @yuta/pos typecheck`                               | exit 0                                                                                                   |
| `pnpm --filter @yuta/display typecheck`                           | exit 0                                                                                                   |
| `cmd /d /c "pnpm typegen:next && pnpm -r --if-present typecheck"` | exit 0; second validated 6/6 generation then recursive 15/16 workspace scope, all applicable checks Done |
| `node --test scripts/next-generated-types-bootstrap.test.mjs`     | exit 0; 50/50, final clean candidate run                                                                 |

Direct app checks được invoke riêng, song song, mỗi command có exact exit riêng. Recursive conjunction chỉ bắt đầu sau cả sáu direct checks kết thúc. [Raw evidence](phase-1-remediation-evidence.json) lưu command/output/exit/cwd, source inventory, snapshot procedure và 24 output file sizes/SHA-256.

| App          | Actual generator | Fresh output validation | Direct typecheck |
| ------------ | ---------------- | ----------------------- | ---------------- |
| Backoffice   | exit 0           | 4/4                     | exit 0           |
| Web          | exit 0           | 4/4                     | exit 0           |
| Booking Web  | exit 0           | 4/4                     | exit 0           |
| Feedback Web | exit 0           | 4/4                     | exit 0           |
| POS          | exit 0           | 4/4                     | exit 0           |
| Display      | exit 0           | 4/4                     | exit 0           |

## Phase 2 and Formalités preservation

Read-only revalidation, no transition mutation:

- `git ls-files -- <six exact next-env paths>`: zero tracked entries.
- `git check-ignore -v -- <six paths>`: exact six root rules, .gitignore lines 3–8.
- Regenerated local files present; snapshot `git status --short` empty; 2210 source hashes unchanged.
- Canonical index SHA-256 before/after: `cb06e0450599f335de1d95e90b075824c9043cd15db6cab4a354b4fc77b17d8a`; exactly original six staged removals, no other staged mutation.
- .gitignore SHA-256 unchanged: `31262a06e1e330502c323eda7ac811cdcd8bd6e9e2b10c0c73bd6ca60543351b`.
- POS script SHA-256 unchanged: `ef08133a64c67a5dae5c5a4b5845a2f95286d9397af77b7678d993c522fd8764`.
- CI SHA-256 unchanged: `0f738c855e627da68f9304754117488744a4d2fa2e39e9dc0db6c5b71da5702e`.
- Formalités **4/4 implementation + 18/18 integrity + 17/17 supplemental MATCH**, canonical and snapshot before/after stages. No Formalités Gate 3 regeneration.
- Historical Phase 1/2/3 evidence retained byte-for-byte. New evidence/status/checkbox updates after snapshot are identified review-only deltas, not changes to tested implementation.

## Required repository checks

| Command                                                                                                                                                          | Result                        |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| `node --check scripts/generate-next-types.mjs`                                                                                                                   | exit 0                        |
| `pnpm docs:check`                                                                                                                                                | exit 0; 36 current documents  |
| `pnpm architecture:check`                                                                                                                                        | exit 0                        |
| `openspec validate next-generated-types-bootstrap --strict`                                                                                                      | exit 0; valid, no delta Specs |
| `pnpm exec prettier --check scripts/generate-next-types.mjs scripts/next-generated-types-bootstrap.test.mjs package.json README.md docs/DEVELOPMENT_WORKFLOW.md` | exit 0                        |

Scoped review/progress formatting checked at closeout. Full `pnpm format:check` **not rerun** in this remediation; historical 62 unrelated formatting failures retained, no repair or fresh full-format PASS claim. No builds/dev/POS offline acceptance/Linux/CI execution; these remain Phase 3.

## Technical Implementation Contract mapping

| Task / approved contract     | Implementation / evidence                                                                                    | Assessment |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------ | ---------- |
| 1.8 D1 fixed orchestration   | root script + manifest; focused mapping/process/preflight; real 6/6 generation                               | PASS       |
| 1.9 D2 fresh result boundary | four-file checks/parser/reference validation; stale/invalid/path focused tests; actual 24 outputs            | PASS       |
| 1.10 D2 lifecycle            | exclusive lock, termination/close/finally; real process timeout/abort/conflict focused tests                 | PASS       |
| 1.11 V12 focused harness     | 50/50 clean candidate; old simulated shell-chain-only proof removed                                          | PASS       |
| 1.12 D3/D8 docs              | exact two-guide diff, validated root/exclusive/recovery guidance; checks pass                                | PASS       |
| 1.13 D4 fresh proof          | same aaeee67 candidate, frozen install, six absences/generation/direct checks/recursive; exact raw inventory | BLOCKED    |
| 1.14 D5/D7/D9 invariants     | six exact ignores/untracked paths, original index/CI/POS hashes, Formalités 4/18/17                          | BLOCKED    |

Rows 1.13/1.14: observed isolated clean proof and independent Phase 2 invariants PASS, but latest full candidate identity has changed. Completion is withheld pending revalidation. This phase assessment does not replace final Technical Compliance Matrix / VERIFY / QA.

## Concurrent documentation and deviations

During remediation, another task changed `docs/YUTA_WORKFLOW_V3.md` and `docs/YUTA_WORKFLOW_V3_APPLY_VERIFY_QA_CLARIFICATION_REVIEW.md`. That initial update was captured at its exact bytes in aaeee67 and matched canonical at the first comparison. A subsequent approval-metadata update after proof is recorded separately as the late blocker below.

Read-only diff review: section 8 readability/subheadings/applicable examples; same optional phases, seven contract fields, outcome AND evidence completion and unchanged boundary STOP rules. No new applicable bootstrap, VERIFY/QA, integrity or fixture requirement; underlying approved skill/Design unchanged. At capture their separate human review was pending and was not approved by this task; its subsequent metadata change is the late blocker below.

Classification: **NON_ATTRIBUTABLE_CONCURRENT_DOCUMENTATION_NO_APPLICABLE_REQUIREMENT_CHANGE**. Old/new/snapshot hashes in evidence JSON. No edit/normalization/absorption into implementation scope.

Auxiliary diagnostic: first inventory tool call yielded before completion; premature JSON parsing raised `Unexpected end of JSON input`. No generation/test used that incomplete result. Awaited rerun exit 0 proved all 2210 raw hashes before install/generation. No failed command counted as passing evidence.

### Late closeout blocker — current candidate changed after proof

Final canonical comparison found a subsequent, non-attributable update to `docs/YUTA_WORKFLOW_V3_APPLY_VERIFY_QA_CLARIFICATION_REVIEW.md`:

- Snapshot: `6b05d6a0e3b2bf99341ae6f260f64e838c04420220d82f24f150e0d9c36331b5`.
- Current: `cfbd4bc0cb1d94bdd8b1a464bc21a42b61bfd4450782ce10e62ae79c73309308`.
- The file now records APPROVED readability-review metadata. Guide bytes remain `2e10a64ec93fd10927439dc803d515919accd5ebb77b0a2c4119d2d92fc4c4ca`.
- All five remediation implementation files, Design, Formalités and canonical index remain unchanged.
- The file exists. A diagnostic `git diff <snapshot> -- <path>` on this canonical untracked path displayed a deletion; that is not evidence of actual deletion. Exact file/hash checks above are authoritative.

Snapshot aaeee67 results remain valid historical executable evidence, but it no longer represents every byte of the latest candidate. No silent candidate exception or automatic proof refresh. Stop with 1.13/1.14 pending; obtain bounded current-candidate evidence revalidation authority after concurrent documentation is stable.

Approved Design deviation: NONE. Blocked required Phase 1 evidence: **current-candidate proof STALE**. Phase 3 required evidence remains unexecuted, not waived.

## Integrity and stop

| Artifact                                          | SHA-256                                                            |
| ------------------------------------------------- | ------------------------------------------------------------------ |
| `scripts/generate-next-types.mjs`                 | `f4c4f981923b851ae7598301d607e8f0b5917ba5269f7bce30bdcfd9b110df78` |
| `scripts/next-generated-types-bootstrap.test.mjs` | `3de15afdbcea8b0cdb8c3ed025290bbbe484c1d2085d9752eedf91523ac8e615` |
| `phase-1-remediation-baseline.json`               | `a3866c19241306e107ac6a33dde45e7e7279411dd8e63aba2c38b2fc3ba17152` |
| `phase-1-remediation-evidence.json`               | `79894a158b85f69ef1a5e9514d5dd5bf7f6246c9db32a8f9c8f8126835999cb1` |
| `phase-1-remediation.diff`                        | `11abd30274d8f0e394e66c9f5ead048eab3413b892887dcf8877181f90bad97f` |

Hashes computed with `Get-FileHash -LiteralPath <path> -Algorithm SHA256`; exact bytes, lowercase. Full implementation hash inventory is in evidence JSON.

STOP for human Phase 1 remediation review. No automatic Phase 3. No Phase 2 mutation/retracking, Gate 3, sync/archive, production migration/cutover/deploy/enablement or cleanup.
