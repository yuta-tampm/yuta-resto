# Phase 3 — Post-change verification / regression

Change: next-generated-types-bootstrap
Gate: Apply Phase 3 stop / technical review — not Gate 3
Review status: CHANGES_REQUESTED
Created: 2026-09-04
Schema: yuta-spec-driven
Analysis conclusion: NO_SPEC_BEHAVIOR_CHANGE
Sensitive change: YES — repository integrity/bootstrap

## Kết quả độc lập

- TECHNICAL IMPLEMENTATION COMPLIANCE: FAIL
- VERIFY: FAIL
- QA: FAIL
- UI_AFFECTING: NO
- BROWSER_QA_REQUIRED: NO
- Browser QA: NOT_APPLICABLE
- Gate 3: NOT_PREPARED
- Sync authorization: NOT_GRANTED
- Production: NOT_AUTHORIZED

Tasks 3.1 và 3.2 hoàn tất; tổng 13/19. Tasks 3.3–3.8 không đánh dấu hoàn tất. Đây là báo cáo dừng và evidence một phần, không phải packet Gate 3 hoặc approval mới.

## Phát hiện bắt buộc dừng

### F1 — Lỗi generator không chặn downstream

Trong disposable fixture `D:/working/yuta/.tmp-bootstrap-failure-1-20260904`, thêm duy nhất hai dòng vào `apps/backoffice/next.config.ts`:

```ts
throw new Error('SYNTHETIC_TYPEGEN_FAILURE_1_backoffice');
```

Chạy actual root/CI expression:

```text
pnpm typegen:next && pnpm -r --if-present typecheck
```

Observer được nạp bằng NODE_OPTIONS, chỉ ghi PID/cwd/argv, không sửa exit, listener hoặc generator. Output thực tế:

1. Backoffice Next typegen PID 15088 in `Unhandled Rejection: Error: SYNTHETIC_TYPEGEN_FAILURE_1_backoffice`.
2. Năm Next typegen sau vẫn được gọi: Web 11148, Booking 11228, Feedback 14068, POS 13508, Display 4588.
3. Recursive pnpm PID 18324 được gọi với `-r --if-present typecheck`.
4. Root cuối cùng exit 1 **do typecheck Backoffice về sau**, không phải fail-fast generator:
   `TS2307: Cannot find module './assets/yuta-logo.svg' or its corresponding type declarations.`
5. Backoffice `next-env.d.ts` vẫn absent ở fixture này. Không diễn giải exit 1 cuối chuỗi thành đạt V5.

Installed Next 16.2.9 `dist/bin/next:170–172` nối promise success tới `process.exit(0)`; nhánh được inspect không gắn rejection exit. `dist/server/node-environment-extensions/unhandled-rejection.external.js:470–477` in lỗi khi không có original handler. Điều này phù hợp với trace; chưa thực hiện nghiên cứu/fix Next hoặc thay bootstrap. Trace chứng minh downstream chạy; exit code riêng của Next không được observer đo trực tiếp.

Harness 13/13 chỉ chứng minh shell chain với simulated nonzero children, không chứng minh mọi lỗi actual Next phát ra nonzero. Giữ cả hai kết quả, không che mâu thuẫn.

### F2 — Fixture âm tính không đạt exact-byte provenance

Main clean snapshot đã được kiểm đủ 2.200/2.200 bytes. Nhưng negative fixture được tạo bằng `git worktree add --detach` với default `core.autocrlf=true`, không vô hiệu hóa chuyển LF/CRLF như main snapshot. Kiểm tra bảo vệ fixture đã thực hiện **quá muộn**, sau khi chạy negative case; đây là sai sót thực thi evidence protocol, không phải drift của code Formalités trong repository gốc.

First protected file `apps/backoffice/src/server/auth/formalites.ts`:

- Expected/canonical: `60b1c5369ef3b28af7377c6e8920707e8643f13269a82d192125c009b9333626`.
- Negative fixture: `23b163ad3c03fd3044a82f81a008fb06787508ca7a1eb2727974bb0f4e9825eb`.
- Original CRLF count 0; fixture CRLF count 20.
- LF-normalized comparison identical, nhưng **không** thay thế yêu cầu exact bytes.
- Checker dừng tại mismatch đầu tiên; không claim 18/18 hoặc 17/17 fixture PASS.

Negative case là diagnostic FAIL, **không phải acceptance fixture hợp lệ**. Không sửa/normalize/retry fixture để hợp thức hóa bằng chứng trong lượt này. Không chạy các case tiếp theo. Repository gốc và main clean snapshot sau phát hiện đều 4/4 + 18/18 + 17/17 MATCH.

## Bằng chứng đã đạt trước stop

Snapshot: `865cbf67a33acd02bd6e2f9c1d09bafe1839a886`.
Tree: `1933c4105ac3b49751dda20c096d4d1147d31beb`.
Source HEAD: `07d9d6d88e07f6a819c7894ef2e35f79d1eb32fa`.
Root: `D:/working/yuta/.tmp-bootstrap-phase3-20260904`.
Node 24.17.0; pnpm 11.8.0; Next 16.2.9.

Fresh snapshot chứa current uncommitted candidate, Phase 1/2, concurrent docs; không chỉ HEAD. 2.200/2.200 path/hash MATCH, no real env/node_modules/.next/next-env/incremental cache copied. Sáu next-env và sáu .next absent trước/sau frozen install. Install exit 0. pnpm store reuse là dependency cache, không phải generated/incremental type cache.

| Actual command in main snapshot                                                                                                                                                      | Result                                          |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------- |
| pnpm install --frozen-lockfile                                                                                                                                                       | PASS / exit 0                                   |
| pnpm typegen:next                                                                                                                                                                    | PASS / six actual generators / exit 0           |
| pnpm --filter @yuta/backoffice typecheck                                                                                                                                             | PASS / exit 0                                   |
| pnpm --filter @yuta/web typecheck                                                                                                                                                    | PASS / exit 0                                   |
| pnpm --filter @yuta/booking-web typecheck                                                                                                                                            | PASS / exit 0                                   |
| pnpm --filter @yuta/feedback-web typecheck                                                                                                                                           | PASS / exit 0                                   |
| pnpm --filter @yuta/pos typecheck                                                                                                                                                    | PASS / exit 0                                   |
| pnpm --filter @yuta/display typecheck                                                                                                                                                | PASS / exit 0                                   |
| pnpm typegen:next && pnpm -r --if-present typecheck                                                                                                                                  | PASS / exit 0                                   |
| pnpm --filter @yuta/backoffice build                                                                                                                                                 | PASS / exit 0                                   |
| pnpm --filter @yuta/web build                                                                                                                                                        | PASS / exit 0                                   |
| pnpm --filter @yuta/booking-web build                                                                                                                                                | PASS / exit 0                                   |
| pnpm --filter @yuta/feedback-web build                                                                                                                                               | PASS / exit 0                                   |
| pnpm --filter @yuta/pos build                                                                                                                                                        | PASS / exit 0                                   |
| pnpm --filter @yuta/display build                                                                                                                                                    | PASS / exit 0                                   |
| node --test scripts/next-generated-types-bootstrap.test.mjs                                                                                                                          | PASS / 13 tests, 0 failed/skipped               |
| node --check scripts/test-pos-offline.mjs                                                                                                                                            | PASS / exit 0                                   |
| pnpm docs:check                                                                                                                                                                      | PASS / 36 current documents / exit 0            |
| pnpm architecture:check                                                                                                                                                              | PASS / exit 0                                   |
| openspec validate next-generated-types-bootstrap --strict                                                                                                                            | PASS / exit 0                                   |
| pnpm format:check                                                                                                                                                                    | FAIL / exit 1 / 62 pre-existing unrelated files |
| pnpm exec prettier --check package.json .github/workflows/ci.yml README.md docs/DEVELOPMENT_WORKFLOW.md scripts/next-generated-types-bootstrap.test.mjs scripts/test-pos-offline.mjs | PASS / exit 0                                   |

Full outputs/command cwd/environment: [03-phase3-evidence.json](03-phase3-evidence.json). Exact snapshot inventory: [03-phase3-baseline.json](03-phase3-baseline.json). List of 62 format failures is preserved in raw format command chunks, no unrelated file formatted.

Display warning: Turbopack `Encountered unexpected file in NFT list`, trace next.config.ts → src/utils/file.ts → uploads/display/[filename]/route.ts. Build exit 0; warning not fixed or hidden. All builds local only with CI synthetic config for cloud apps; no production credentials, connections, migrations or deployment.

After every successful app build, main snapshot remained Git clean and 2.200/2.200 tracked bytes MATCH. All six ignored declaration paths resolve to exactly .gitignore lines 3–8; no tracked entry. Original candidate baseline bytes outside authorized tasks/review progress remained unchanged at stop.

## Required coverage not executed after stop

- Remaining five actual negative cases and missing-package case.
- Six dev smoke runs.
- Disposable README source-integrity negative control.
- Both full POS offline acceptance states (absent/already generated).
- Final full scope/VERIFY/QA completion and Gate 3 aggregation.

Docker preflight was available (29.0.1). Therefore missing POS evidence is **not** claimed as Docker environment failure; it was not executed after stop. Syntax/harness is not a replacement. No acceptance container/service was started.

## Exact Phase 3 attribution

No implementation file changed in Phase 3. No untrack/ignore/POS code operation repeated.

Only canonical edits:

- `openspec/changes/next-generated-types-bootstrap/tasks.md`: Phase 3 approval/progress; 3.1/3.2 checkboxes.
- `docs/reviews/next-generated-types-bootstrap/phase-2-review.md`: explicit approval metadata only, historical evidence unchanged.
- New evidence under this change's review directory: `03-phase3-baseline.json`, `03-phase3-evidence.json`, `03-phase3-review.md`, `03-verify.md`, `qa/QA_REPORT.md`.

Disposable-only files: negative fixture next.config injection and ignored `.tmp-bootstrap-observer.cjs`. Not included in implementation scope.

Original index still has exactly the six approved next-env removals. Initial snapshot preparation refreshed Git index cache bytes; first guard stopped before worktree creation. Staged entries were verified unchanged, then snapshot creation succeeded with matching before/after index bytes. No forced reset/stage of unrelated work.

Proposal/Analysis/Design/.openspec metadata remain unchanged. Main specs and Formalités planning/evidence remain untouched. No aggregate change hash or Gate 3 packet issued because required evidence failed.

## Required next review

Return to the owning Design/Phase 1 bootstrap review for D2/V5: the approved raw `&&` chain relies on Next returning nonzero for config/generation failure, which this diagnostic contradicts. Do not introduce a custom declaration generator, dependency upgrade, broad integrity exception or wrapper under Phase 3 without reviewed bounded authority.

Also authorize rebuilding negative fixtures with raw-byte provenance verified **before** invocation; do not weaken exact-byte protection. Re-prove affected Phase 1/clean evidence after any approved bootstrap change, then resume Phase 3 required cases.

No automatic retracking, rollback, sync/archive, Formalités Gate 3 regeneration or production operation.
