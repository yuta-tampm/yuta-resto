# Technical verification — establishment OWNER preservation

Change: preserve-establishment-owner-invariant

Date: 2026-09-06

Schema: yuta-spec-driven

TECHNICAL IMPLEMENTATION COMPLIANCE: PASS

VERIFY: PASS

QA: FAIL — subsequent Browser QA found an out-of-allowlist mobile layout issue;
see [QA report](qa/QA_REPORT.md). Technical results below remain unchanged.

## Completeness, correctness and coherence

Phạm vi technical đã hoàn thành hai phases Service / Domain và Integration /
Regression; 6/6 requirements, 21/21 Spec scenarios có mapping dưới đây.
Design được giữ nguyên exact approved bytes. Không có technical critical issue
hoặc deviation cần review. Tasks QA và final packet còn mở có chủ đích theo
thứ tự VERIFY trước QA, không được coi là đã hoàn thành hoặc waived.

## Exact implementation source hashes

Hash bằng `Get-FileHash -Algorithm SHA256` trên exact file bytes:

| Path                                                              | SHA-256                                                          |
| ----------------------------------------------------------------- | ---------------------------------------------------------------- |
| packages/db-cloud/src/tenant-user-repository.ts                   | 609b2eb9a100cf6091095fb0058bd6e35d4b6e7ceb9e4daa2aabe92b2ac1ebb3 |
| packages/db-cloud/test/tenant-user-repository.integration.test.ts | e7784767b6600b9110d72798a7949e29193a19965a3db507908fc3ddad795724 |
| docs/architecture/AUTHENTICATION.md                               | 639bbc54fec16e8c9e02b6b750f076dcc3d44cf65c73fa40ac568901f8dea51b |

AUTHENTICATION full hash bao gồm pre-existing Password recovery work, không
quy thuộc hunk đó cho change này. So sánh snapshot trước/sau ngoài đoạn
`## User and membership administration` đến `## Local development`: giống nhau.
Action hash không đổi: `18974d11ce7a3d199ab66f1f12a62462370877957c9ebc34da2f7933bb532767`.
Không edit schema/migrations, API/contracts, UI, grants/shared authorization,
foundation adapter, Personnel, local apps hoặc account lifecycle.

## Commands and observed results

Database tests dùng environment override trong process:

```powershell
$env:CLOUD_DATABASE_URL='postgresql://owner_test@127.0.0.1:60098/yuta_owner_preservation_test'
$env:CLOUD_DATABASE_SSL='false'
$env:YUTA_ALLOW_DATABASE_INTEGRATION_TESTS='true'
```

Target là container riêng `yuta-owner-preservation-20260906`, PostgreSQL 17.10,
label `yuta.task=preserve-establishment-owner-invariant`, data tmpfs, không volume
hoặc mount checkout, bind loopback. Initial port 55439 bị Windows từ chối;
container ở trạng thái created chưa chạy đã được xóa và thay bằng container
port tự cấp 60098. Không đụng ba persistent development DB containers.
`docker inspect`, `pg_isready`, `select current_database(), current_user,
version()` xác minh target trước migrations/tests. Loopback trust authentication
chỉ cho container disposable này; không phải cấu hình deployment.

| Exact command                                                                                                                                                                                                                                   | Result                                                                                                                       |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| pnpm --filter @yuta/db-cloud db:migrate                                                                                                                                                                                                         | Exit 0; áp dụng existing migrations vào disposable DB, không tạo/sửa migrations.                                             |
| pnpm --filter @yuta/db-cloud exec vitest run test/tenant-user-repository.integration.test.ts --reporter=verbose                                                                                                                                 | Exit 0; initial 23/23 PASS, 7.42s.                                                                                           |
| pnpm --filter @yuta/db-cloud typecheck                                                                                                                                                                                                          | Initial exit 1 do nullable narrowing trong code mới; đã sửa trong allowlist. Hai lần sau exit 0, gồm current focused test.   |
| pnpm --filter @yuta/db-cloud exec vitest run test/tenant-user-repository.integration.test.ts test/tenant-foundation.integration.test.ts test/auth-password-reset.integration.test.ts test/auth-selection.integration.test.ts --reporter=verbose | Exit 0; 4 files, 41/41 tests PASS; focused 27/27, không skip; 7.78s.                                                         |
| pnpm --filter @yuta/backoffice test                                                                                                                                                                                                             | Exit 0; 92 files PASS, 1 guarded suite skipped; 511 tests PASS. Không tính skipped external-provider suite là runtime proof. |
| pnpm --filter @yuta/backoffice build                                                                                                                                                                                                            | Exit 0; compiled, TypeScript, page generation PASS; access-management route dynamic.                                         |
| pnpm docs:check                                                                                                                                                                                                                                 | Exit 0; 36 current documents.                                                                                                |
| pnpm architecture:check                                                                                                                                                                                                                         | Exit 0.                                                                                                                      |
| pnpm -r --if-present typecheck                                                                                                                                                                                                                  | Exit 0, all applicable workspace packages.                                                                                   |
| pnpm format:check                                                                                                                                                                                                                               | Exit 1; 67 findings ngoài implementation allowlist, không sửa.                                                               |
| pnpm exec prettier --check packages/db-cloud/src/tenant-user-repository.ts packages/db-cloud/test/tenant-user-repository.integration.test.ts docs/architecture/AUTHENTICATION.md                                                                | Exit 0.                                                                                                                      |
| git diff --check -- packages/db-cloud/src/tenant-user-repository.ts docs/architecture/AUTHENTICATION.md                                                                                                                                         | Exit 0; untracked focused test kiểm tra riêng bằng Prettier và SHA-256.                                                      |
| openspec validate preserve-establishment-owner-invariant --strict                                                                                                                                                                               | Exit 0; valid.                                                                                                               |
| openspec status --change preserve-establishment-owner-invariant --json                                                                                                                                                                          | Exit 0; yuta-spec-driven, all planning files present; không thay approval/QA evidence.                                       |
| openspec instructions apply --change preserve-establishment-owner-invariant --json                                                                                                                                                              | Exit 0; read all returned Proposal/Analysis/Spec/Design/Tasks context.                                                       |

`pnpm test:cloud`, `pnpm build:cloud` không chạy toàn bộ: dùng owning db-cloud
regressions và Backoffice test/build cho cloud-only repair. `pnpm test:local`
không chạy vì không local runtime change. Personnel integration failure đã
được ghi nhận từ task trước; không rerun, không quy kết là current result.
Change không sửa Personnel nên không có evidence failure đó do change này.
Global formatting findings không ở changed implementation files.

## TECHNICAL COMPLIANCE MATRIX

Paths production và test dưới đây tương ứng hai files db-cloud trong bảng hash.
Source authorities là links trong approved Tasks TIC; không thay policy.

| Rule                                | Authority                    | Implementation                                                                                    | Test/check evidence                                                                                                                      | Result                    |
| ----------------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| S1 trusted scope                    | TENANCY; db-cloud AGENTS     | parent/org/active checks, exact post-lock membership predicates, trusted action unchanged         | scope/manager/self denials test:483; real sign-in and tenant resolution fixture                                                          | PASS                      |
| S2 ordered parent locks             | Design 1–2                   | private lockEstablishments:42; resolved UUID sort, sequential awaited NO KEY UPDATE before writes | observed waiters; overlapping opposite-order batches:862; disjoint:874                                                                   | PASS                      |
| S3 fresh READ COMMITTED             | Design 3                     | explicit config:326,479; post-lock statements:384 onward; same tx object                          | fresh target role/count/moved-scope tests:676; runtime isolation and config assertion:907                                                | PASS                      |
| S4 shared scoped OWNER guard        | Spec; Design 4               | assertAnotherActiveOwner:88; per-path removal predicates; no users join                           | sole OWNER edit/attach; suspended/foreign/global-disabled controls:353–599                                                               | PASS                      |
| S5 atomic side effects/errors       | Design 5                     | no catches/retry; writes/revocation/audit same transaction                                        | exact winner/loser/session/audit; batch rollback; 3 audit-fault rollback cases:893                                                       | PASS                      |
| S6 strict/private/no new boundary   | Root/db-cloud AGENTS         | helper type private; public signatures/exports unchanged                                          | scoped diff, recursive typecheck, architecture check, unchanged action hash                                                              | PASS                      |
| S7 bounded documentation            | Design 8; Authority Model    | only membership hunk changes                                                                      | outside-hunk snapshot equality, docs check, scoped formatting                                                                            | PASS                      |
| R1 safe actual integration          | db-cloud AGENTS; Design 7    | loopback/named-disposable guard; four independent clients; authenticated fixtures                 | verified container/DB identity; 27 focused tests ran, no skip                                                                            | PASS                      |
| R2 observed barrier                 | Design 7                     | pg_stat_activity and pg_blocking_pids direct/indirect traversal; finally release/settle/close     | three pairs plus fresh-state and disjoint cases; no barrier timeout                                                                      | PASS                      |
| R3 exact concurrency results        | Spec concurrency; Design 5–7 | production two paths                                                                              | one success, one TenantUserError LAST_OWNER_REQUIRED, count1, exact winner/loser/session/audit; no deadlock/timeout                      | PASS                      |
| R4 actual rollback                  | Spec atomicity; Design 7     | test-only typed tx proxy; actual writes before success-audit interception                         | independent observer snapshots, no partial identity/member/session/audit commit, same original error once, next valid operation succeeds | PASS                      |
| R5 all scenarios                    | Approved delta Spec          | repository + unchanged trusted action                                                             | 21/21 mapping below; 41 tests, Backoffice 511 tests                                                                                      | PASS                      |
| R6 mandatory integrated QA boundary | Design 7; QA protocol        | real route/guards/error contract remain unchanged, UI_AFFECTING YES/BROWSER_QA_REQUIRED YES       | technical integration checks PASS; actual Browser QA is next mandatory gate, not claimed here                                            | PASS (technical boundary) |
| R7 evidence separation              | yuta-run-change; QA protocol | this VERIFY evidence, actual QA must be recorded separately                                       | no Gate 3 or ready recommendation before QA PASS; exclusions preserved                                                                   | PASS                      |

R6 technical PASS không thay hoặc dự đoán QA PASS. Final completeness và R6
runtime evidence phải được đánh giá lại sau Browser QA; chưa ready-to-close.

## Scenario mapping

Spec scenario numbers follow the exact order in approved delta Spec.

| Scenarios                                                               | Focused regression evidence                                                               | Production evidence                                     |
| ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| 1 demotion; 2 suspension; 3 other-scope owners; 4 suspended owner       | parameterized sole OWNER edit:353 (4 cases), extra global-disabled/conservative guard:581 | updateMembership + shared exact scoped count            |
| 5 attachment sole OWNER; 6 keep OWNER                                   | attachment denial:372 (2 cases), OWNER-preserving:386                                     | post-lock existing memberships and shared count         |
| 7 edit–edit; 8 edit–attach; 9 attach–attach                             | three observed two-waiter pairings:823                                                    | both top-level transactions and parent helper           |
| 10 sequential                                                           | first success/second deny:834                                                             | fresh scoped count                                      |
| 11 atomic batch both orders; 12 losing concurrent batch                 | reverse false/true:845; overlapping batch:862                                             | all parents acquired before decisions/writes, one tx    |
| 13 denied suspension side effects                                       | sole OWNER suspension snapshots:353                                                       | guard before writes/revoke/audit                        |
| 14 transaction rollback                                                 | edit/attach/new-user fault cases:893                                                      | same tx membership/session/identity/audit               |
| 15 allowed edit/suspend                                                 | demote/suspend:406                                                                        | scoped session revocation and existing success metadata |
| 16 identity/outside-membership preservation; 17 reactivation            | keep OWNER:386, upsert/reactivation:451, new creation:483                                 | unchanged composite upsert and global identity handling |
| 18 OWNER manages other establishment                                    | authenticated OWNER at A without membership B, all valid mutation cases at B              | trusted management allowlist unchanged                  |
| 19 cross-scope denial; 20 MANAGER restrictions; 21 self/inactive checks | denial/control suite:483; fresh manager state:676                                         | original guards plus fresh target revalidation          |

## Remaining gates

Mandatory authenticated Browser QA stopped on mobile clipping after desktop
sole-OWNER edit denial passed. QA status FAIL; remaining attachment/success,
MANAGER and intermediate-width cases untested. No 03-final-review.md created.
R6 runtime QA requirement is not satisfied; its technical-boundary PASS above
does not mean full phase completion or ready-to-close. See QA report/manifest.
No deploy, production data, sync, archive, lifecycle promotion or unrelated
cleanup authorized.
