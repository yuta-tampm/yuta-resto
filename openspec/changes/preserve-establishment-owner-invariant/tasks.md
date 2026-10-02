# Implementation Plan — Establishment OWNER Preservation

Change: preserve-establishment-owner-invariant

Schema: yuta-spec-driven

Plan review status: APPROVED

Apply authorization: GRANTED_BOUNDED

UI_AFFECTING: YES

BROWSER_QA_REQUIRED: YES

Approval source: explicit current-user instruction

Approval recorded by: Codex workflow

Approved: 2026-09-06T11:54:25Z

Approved pre-Apply tasks SHA-256:
`4f9374f5cbb4fd9c3fae2a881722a48a5d0b777bf2ed3ffd85ce626edac7466e`.
Đã đối chiếu exact Tasks và toàn bộ prerequisite hashes/path sets trước Apply.
Người dùng cho phép bounded implementation, technical VERIFY và sau đó
authenticated Browser QA; chỉ tạo Gate 3 khi tất cả đạt. Các records planning
bên dưới là lịch sử; cập nhật authorization/progress không đổi approved plan.
User STOP conditions nghiêm hơn planning: controlled concurrency deadlock hoặc
timeout phải dừng và báo review, không tự sửa tiếp. Không deploy, production-data
mutation, sync, archive hoặc lifecycle promotion.

### Approved prerequisites

[Gate 1](../../../docs/reviews/preserve-establishment-owner-invariant/01-analysis-review.md),
[Gate 2](../../../docs/reviews/preserve-establishment-owner-invariant/02-specs-review.md)
và [Gate 2b](../../../docs/reviews/preserve-establishment-owner-invariant/02b-design-review.md)
đã approved; đã kiểm tra lại exact source hashes/path sets trước soạn Tasks.

| Artifact                                                     | Approved SHA-256                                                 |
| ------------------------------------------------------------ | ---------------------------------------------------------------- |
| analysis.md                                                  | 637298cec3d615f583fde9af61b0d73896cda5485f066e9d2a10b158abec78a2 |
| design.md                                                    | 7fdb0b52facf7fec81cd75580e63ec748281a11e18a7e2aeff1a8dadf09e7ad8 |
| proposal.md                                                  | 7cb801d412d936cb717fc87e1882a2870a6ea5d1eb67768cae545592d21730d8 |
| specs/authorization/establishment-owner-preservation/spec.md | 44c453a64c40f9f3e2259c99918929e2ffe472ca846e1d1e950128a69fe660a5 |

Paths trong bảng tương đối với change root. Design applicability REQUIRED;
không dùng omission hoặc skip_specs. Wording “chưa approved” trong source
artifacts là historical context; approval records ở packets, không rewrite
reviewed bytes. Gate 2b packet sau ghi approval có SHA-256
`41ce715ce057aac2bbf7063c4f13a063d881e10450289d6cbd5b6bc06ec39062`.

### Execution boundary and pre-Apply recheck

Repository: `D:\working\yuta\yuta-resto`.
HEAD lúc planning: `07d9d6d88e07f6a819c7894ef2e35f79d1eb32fa`.

Chỉ hai implementation phases cần thiết: Service / Domain rồi Integration /
Regression. Không có schema/data phase hoặc UI component implementation phase.
Technical VERIFY đi trước real-route QA; chỉ lập Gate 3 khi bằng chứng đủ.

Future implementation allowlist:

| File                                                              | Planning baseline / allowed change                                                                                                                           |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| packages/db-cloud/src/tenant-user-repository.ts                   | Clean tại planning; SHA-256 bedd4b2f7420eb7091d9c09b4a68a87fc725331da27db0616b74821b3cf03e59. Chỉ private locking/guard/transaction changes trong Design.    |
| packages/db-cloud/test/tenant-user-repository.integration.test.ts | ABSENT tại planning; tạo focused regression file, không public testing hook.                                                                                 |
| docs/architecture/AUTHENTICATION.md                               | Dirty tại planning; SHA-256 0adfd1981846e081c5b6dd47a3a510fda4cfe1363e569c733146434fe412e684. Chỉ User and membership administration hunk được Design bound. |

Current AUTHENTICATION diff là phần Password recovery của task khác; giữ nguyên
exact nội dung, không chạy formatter write toàn file. Planning baseline không
thay fresh pre-Apply snapshot. Sau authorization phải kiểm tra lại Git status,
hash và scoped diff; nếu intended path đã có overlapping edits không thể tách
an toàn thì STOP, không overwrite hoặc restore user work.

Chỉ khi workflow đến bước tương ứng mới tạo QA_REPORT, screenshot-manifest và
screenshots dưới `docs/reviews/preserve-establishment-owner-invariant/qa/`,
cùng `03-final-review.md` và evidence được protocol yêu cầu. Đây là review/QA
evidence, không mở implementation allowlist. Không tạo thêm standalone
Implementation Plan/TIC document hoặc Gate 3 placeholder.

### Mandatory stop conditions

- Thiếu explicit Apply authorization hoặc prerequisite hash/path-set drift.
- Phát hiện live production membership-removal writer ngoài participating
  tenant-user repository paths: STOP, báo call site và quay lại review.
- Cần schema/migration, shared authorization, API/contract scope, package hoặc
  runtime owner mới: STOP, không tự mở rộng.
- Cần thay Design locking/isolation/order/retry hoặc approved Spec behavior:
  STOP ở gate liên quan, không đổi requirement để làm tests xanh.
- Không tách được dirty AUTHENTICATION hunk hoặc unsafe test/QA database target.
- Controlled concurrency test có deadlock/timeout: không gán thành unrelated
  infrastructure để PASS; xác định defect và chỉ sửa trong approved approach.
- Required QA bị block/fail hoặc thiếu hashed responsive evidence: không lập
  ready Gate 3. Không deploy, sync/archive hoặc promote lifecycle.

Planning source/call-site search hiện chỉ thấy live application mutations tại
Backoffice actions gọi createOrAttachUser/updateMembership. Foundation adapter
và seeds vẫn tồn tại nhưng không thấy app removal consumer khác. Đây là current
repository inventory, không chứng minh mọi deployed instance; phải recheck khi
Apply. Không mở rộng foundation writer theo suy đoán.

## 1. Service / Domain

### TECHNICAL IMPLEMENTATION CONTRACT

Boundary: Cloud Access Management server-side membership transactions.
Canonical owner: `packages/db-cloud`; Backoffice action là existing trusted
consumer, không đổi signature/grant/UI/error mapping.

Instructions và authorities đã consult:
[root AGENTS](../../../AGENTS.md),
[db-cloud AGENTS](../../../packages/db-cloud/AGENTS.md),
[Backoffice AGENTS](../../../apps/backoffice/AGENTS.md),
[Authority Model](../../../docs/AUTHORITY_MODEL.md),
[TENANCY](../../../docs/architecture/TENANCY.md),
[DATABASE_BOUNDARIES](../../../docs/architecture/DATABASE_BOUNDARIES.md),
[AUTHENTICATION](../../../docs/architecture/AUTHENTICATION.md),
[DATA_MODEL](../../../docs/architecture/DATA_MODEL.md),
[IDENTITY_AND_MEMBERSHIP](../../../docs/architecture/IDENTITY_AND_MEMBERSHIP.md),
[Identity / Access Home](../../../docs/features/identity-access/README.md),
[approved Design](design.md) và [delta Spec](specs/authorization/establishment-owner-preservation/spec.md).

Applicable contract:

- S1 — Exact organization/establishment predicates và trusted allowlist;
  fail closed, không authority từ browser. TENANCY + db-cloud instructions.
- S2 — NO KEY UPDATE parent locks cho cả hai paths, awaited canonical order,
  đủ locks trước mutation writes; no process mutex/advisory alternative.
  Design Decisions 1–2.
- S3 — Explicit READ COMMITTED trên owned top-level transaction; fresh
  post-lock membership/OWNER reads, cùng transaction object. Design Decision 3.
- S4 — Active-membership count scoped, không global-user usability predicate;
  preserve conservative edit guard và valid attach/upsert/reactivation,
  existing roles/self/inactive-user checks. Spec + Design Decision 4.
- S5 — Membership writes, scoped revocation và existing success audit atomic;
  LAST_OWNER_REQUIRED khác independent generic failure; no retry/NOWAIT/
  SKIP LOCKED/fallback success. Design Decision 5.
- S6 — TypeScript strict, no any, private helpers, no new public exports,
  dependencies/schema/contracts hoặc cross-runtime access. Root/db-cloud.
- S7 — Documentation chỉ accepted invariant/transaction semantics; không
  normalize password-reset hunk, Product lifecycle hoặc audit policies.
  Design Decision 8 + Authority Model.

Intended files: repository và bounded AUTHENTICATION hunk trong allowlist.
Focused test file ở phase 2 chứng minh behavioral completion cho phase này.

Targeted checks: db-cloud typecheck, scoped code/diff review, docs check;
phase 2 regression phải PASS trước khi coi behavioral work verified.
Completion evidence: scoped implementation diff/hashes và S1–S7 rows trong
Technical Compliance Matrix, nối đúng test/result; checkbox progress không
thay technical VERIFY.

### Implementation tasks

- [x] 1.1 Thêm private parent-lock helper cho existing authorized active establishments, preserve duplicate/empty/allowlist rejection, canonicalize bằng resolved UUID rows rồi acquire tuần tự; verify query predicates/order, không có writes trước đủ locks, và db-cloud typecheck PASS.
- [x] 1.2 Tích hợp helper vào cả edit và create/attach, đặt explicit READ COMMITTED, edit chỉ dùng pre-lock lookup làm locator và re-read target sau lock; verify mọi decision query chạy sau locks trên cùng transaction, target mất/lệch scope giữ existing denial và typecheck PASS.
- [x] 1.3 Dùng shared scoped active-OWNER count/assert theo approved per-path predicates, chặn existing-user attachment thay sole active OWNER; verify không join global users, valid upsert/reactivation và self/MANAGER/inactive-user guards giữ nguyên, được bao phủ bởi 2.2 và 2.3.
- [x] 1.4 Giữ all-or-nothing batch, session revocation và success audit trong transaction, throw invariant loser và không retry/remap independent errors; verify action/error contracts không đổi bằng scoped diff review và fault/concurrency tests ở 2.4–2.6.
- [x] 1.5 Cập nhật duy nhất User and membership administration hunk của AUTHENTICATION để mô tả scope establishment, shared coordination và atomic failure; verify docs:check, diff chỉ đúng hunk, Password recovery bytes và các exclusions không đổi.

## 2. Integration / Regression

### TECHNICAL IMPLEMENTATION CONTRACT

Boundary: actual cloud repository correctness, trusted Backoffice integration
và real-route user-visible error/success QA. Canonical owners: db-cloud cho
transaction tests, Backoffice cho consuming route; evidence thuộc change review.

Instructions/authorities: root/db-cloud/Backoffice AGENTS và security/database
sources ở phase 1; thêm
[QA protocol](../../../docs/YUTA_QA_PROTOCOL.md),
[review protocol](../../../docs/reviews/README.md),
[shared frontend rules](../../../docs/ui/YUTA_FRONTEND_RULES.md),
[Backoffice frontend rules](../../../docs/ui/BACKOFFICE_FRONTEND_RULES.md),
[Design Decisions 6–8](design.md). Không tìm thấy dedicated access-management
page pack qua current path inventory; recheck trước Browser QA, không tạo pack
hoặc UI redesign chỉ để chạy bounded regression.

Applicable contract:

- R1 — Guarded disposable PostgreSQL, opt-in và target verification trước chạy;
  actual repository + valid auth/session-resolved actor/context, independent
  clients, test IDs riêng; không persistent development/production data.
- R2 — Controlled parent barrier và observed direct/indirect blocking chain;
  không Promise.all/sleep/stress-only proof. Cleanup finally release barrier,
  settle requests và đóng clients, không để treo connections.
- R3 — Cả ba concurrency pairings có đúng một success, một LAST_OWNER_REQUIRED,
  final count một, winner/loser state và đúng một existing success audit;
  deadlock/timeout trong healthy controlled case là FAIL.
- R4 — Atomic batch/transaction failure có before/after persisted assertions;
  typed test-only proxy fault sau real writes, không mock owner count, không
  production hook hoặc schema. Independent error không bị retry/remap thành
  invariant error/success.
- R5 — Coverage đủ 21 Spec scenarios, valid và denied tenant/role boundaries,
  identity/password preservation, scoped sessions và non-requested data.
- R6 — UI_AFFECTING YES, BROWSER_QA_REQUIRED YES: real integrated route, French
  copy hiện có, no client-side fixture replacement/authorization bypass.
  Không UI implementation files trong allowlist; defect cần mở scope thì STOP.
- R7 — VERIFY và QA tách riêng; exact commands, exit codes, skipped/failed checks,
  source/diff hashes, screenshot manifest; không claim production readiness.
  Gate 3 chỉ sau technical compliance/VERIFY và required QA PASS.

Intended files: focused integration test trong allowlist; future QA/review
evidence theo protocol. Existing action/page/session sources chỉ read-only
consumers để trace integration; không thêm API hoặc app testing hook.

Required targeted commands sau authorization, không phải commands đã chạy:

- `pnpm --filter @yuta/db-cloud exec vitest run test/tenant-user-repository.integration.test.ts`
  với disposable CLOUD_DATABASE_URL và explicit integration opt-in; skipped
  suite không được tính PASS.
- `pnpm --filter @yuta/db-cloud exec vitest run test/tenant-foundation.integration.test.ts test/auth-password-reset.integration.test.ts test/auth-selection.integration.test.ts`
  với cùng safety preconditions; các tests này không thay production-path tests.
- `pnpm --filter @yuta/db-cloud typecheck`, `pnpm --filter @yuta/backoffice test`,
  `pnpm --filter @yuta/backoffice build`.
- `pnpm docs:check`, `pnpm architecture:check`,
  `pnpm -r --if-present typecheck`, `pnpm format:check`,
  `openspec validate preserve-establishment-owner-invariant --strict`.
- Scoped Prettier check trên ba implementation files và planning/review files;
  `git diff --check` trên exact allowlist; untracked test/evidence hash riêng.

Broader `pnpm test:cloud` / `pnpm build:cloud` được đánh giá theo risk và báo rõ
nếu không chạy; `pnpm test:local` không cần cho cloud-only repair, báo skip.
Personnel integration failure và global format findings đã ghi ở task history
không được biến thành cleanup scope; nếu rerun thì ghi current result riêng.

Completion evidence: deterministic persisted assertions theo từng scenario,
R1–R7 Technical Compliance Matrix, exact command results và scoped diff;
Browser QA report, hashed manifest/screenshots cùng verification source được
Gate 3 tham chiếu. Không đánh dấu task xong chỉ vì file đã tạo.

### Implementation and verification tasks

- [x] 2.1 Tạo guarded disposable integration suite với fixture actor OWNER tại A có quyền quản lý B, MANAGER/foreign-scope controls, real auth/session context và cleanup scoped; verify opt-in/target safety, independent clients, no external data mutations và typecheck PASS.
- [x] 2.2 Thêm sole-OWNER edit demotion MANAGER/STAFF, suspension, other-establishment/organization OWNER và suspended OWNER controls; verify LAST_OWNER_REQUIRED, unchanged target/sessions/audit và allowed multi-OWNER edit/suspension persisted results.
- [x] 2.3 Thêm attachment replacement denial, OWNER-preserving success, valid new/existing membership upsert/reactivation, existing identity/password and other memberships preservation; verify persisted before/after và MANAGER/self/inactive-user/cross-scope denial controls đủ Spec scenarios.
- [x] 2.4 Tạo controlled parent-lock barrier/observer harness và chạy edit–edit, edit–attach, attach–attach cùng sequential control; verify actual two-waiter blocking chains trước release, exact winner/loser/count/audit/session outcomes, no healthy-case deadlock và finally cleanup.
- [x] 2.5 Thêm opposite-order overlapping batch cases, một target vi phạm rollback cả batch, losing concurrent batch không commit target riêng, và disjoint-establishment control; verify persisted all-or-nothing ở cả request orders, no organization-wide serialization và không sửa input validation semantics.
- [x] 2.6 Inject failure qua typed test-only transaction proxy tại audit insertion sau real membership/session writes cho edit và attach; verify independent-client state bằng before snapshot, no success audit/revocation/partial insert, original error propagated without automatic retry, và subsequent valid operation thành công chứng minh lock release.
- [x] 2.7 Chạy focused suite không skip, relevant foundation/auth regressions và typechecks; verify tất cả 21 scenarios có test mapping/evidence, target-role và scope revalidation lấy post-lock state, không có production hooks hoặc fake OWNER-count mocks.
- [ ] 2.8 Chạy broader technical checks và Backoffice test/build trong phạm vi đã nêu; lập Technical Compliance Matrix S1–S7/R1–R7, verify exact implementation diff/path attribution, docs hunk preservation và reports phân biệt PASS, FAIL, skipped, unrelated failures.
- [ ] 2.9 Sau technical VERIFY đạt và có environment authorization phù hợp, chạy real-route QA /parametres/utilisateurs-acces với synthetic persisted data và OWNER/MANAGER contexts; verify rejected sole-OWNER edit/attach hiển thị existing error, valid mutation success/refreshed state, pending/recovery, keyboard/focus và overflow, không đổi French copy hoặc UI.
- [ ] 2.10 Lưu QA_REPORT, screenshot-manifest và actual screenshots cho desktop 1366x768/mobile 390x844 theo approved Design, bổ sung applicable Backoffice 1440/1024/768-width checks khi kiểm tra visual responsiveness; verify role/state/viewport coverage, console/hydration checks, mỗi screenshot có lowercase SHA-256 và QA status trung thực, không waive environment blocker.
- [ ] 2.11 Chỉ khi compliance/VERIFY và required QA PASS, tạo 03-final-review.md theo protocol với requirement-to-code/test mapping, current planning hashes, scoped implementation/evidence hashes và Sync authorization PENDING; verify không thiếu responsive QA hoặc unresolved change-specific failures, rồi dừng human review, không deploy/sync/archive.

### Apply checkpoint — 2026-09-06

Technical repository implementation và focused coverage đã đạt: 12/16 tasks
complete. Current focused suite 27/27; foundation/auth regressions tổng 41/41;
Backoffice 511 tests và build PASS; docs/architecture/recursive typecheck/scoped
formatting PASS. Global formatting vẫn 67 unrelated findings.

[Technical evidence và S1–S7/R1–R7 matrix](../../../docs/reviews/preserve-establishment-owner-invariant/verify-evidence.md).
[Browser QA report](../../../docs/reviews/preserve-establishment-owner-invariant/qa/QA_REPORT.md):
QA FAIL vì pre-existing mobile layout clipping ngoài allowlist. Desktop
sole-OWNER edit denial đúng; SQL xác nhận count1 và zero success audit. Remaining
QA coverage chưa chạy. 2.8–2.11 giữ mở; không suy full R6 completion từ technical
boundary PASS, không tạo 03-final-review.md hoặc mở UI scope. STOP_FOR_REVIEW.

Tasks semantic plan không đổi; chỉ authorization record, checkboxes và evidence
checkpoint được cập nhật theo bounded Apply. Prior approved source artifacts và
gate packets giữ nguyên hash. Không deploy, production-data mutation, sync,
archive hoặc lifecycle promotion.

### Scenario traceability (approved plan)

| Spec requirement                                                 | Primary planned tasks      |
| ---------------------------------------------------------------- | -------------------------- |
| Preserve the establishment-scoped active OWNER invariant         | 1.1–1.3, 2.2, 2.7          |
| Apply the same preservation rule to existing-user attachment     | 1.2–1.3, 2.3               |
| Preserve the invariant across concurrent membership mutations    | 1.1–1.4, 2.4–2.5           |
| Fail atomically without committed success side effects           | 1.4, 2.5–2.6               |
| Preserve valid transition and identity compatibility             | 1.3–1.4, 2.2–2.3           |
| Preserve trusted management scope and existing denial boundaries | 1.1–1.3, 2.1–2.3, 2.7, 2.9 |

### Plan review checkpoint

Plan scope: 16 unchecked implementation/verification tasks, hai phases, mỗi
phase có embedded Technical Implementation Contract. Không checkbox nào được
đánh dấu complete trong lượt planning.

Review requested: duyệt exact tasks.md, phase order, allowlist, safe test/QA
setup, verification evidence và STOP conditions; nêu riêng authorization cho
bước thực thi nếu muốn tiếp tục. Không suy Apply authorization từ approval
Gate 2b hoặc câu “Tasks ready”.

Kế hoạch này không phải ready Gate 3 packet; không tạo gate số mới hoặc
standalone TIC. Sau approval Tasks vẫn phải giữ user-imposed restrictions
của authorization thực tế và revalidate earlier approved hashes.

### Planning verification record

Chỉ các checks dưới đây đã chạy trong lượt tạo Tasks; không phải VERIFY cho fix:

| Command / check                                                                                                                        | Result                                                                                              |
| -------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| openspec status --change preserve-establishment-owner-invariant --json                                                                 | Exit 0; 5/5 planning artifacts present, isPlanningComplete true; không cấp Apply authorization.     |
| openspec instructions tasks --change preserve-establishment-owner-invariant --json                                                     | Exit 0; Specs/Design dependencies được đọc lại, tạo đúng tasks.md.                                  |
| openspec validate preserve-establishment-owner-invariant --strict                                                                      | Exit 0; change is valid.                                                                            |
| pnpm docs:check                                                                                                                        | Exit 0; 36 current documents.                                                                       |
| pnpm architecture:check                                                                                                                | Exit 0.                                                                                             |
| pnpm -r --if-present typecheck                                                                                                         | Exit 0.                                                                                             |
| pnpm exec prettier --check openspec/changes/preserve-establishment-owner-invariant docs/reviews/preserve-establishment-owner-invariant | Exit 0.                                                                                             |
| pnpm format:check                                                                                                                      | Exit 1; 67 files ngoài phạm vi có findings, không sửa.                                              |
| git diff --check -- openspec/changes/preserve-establishment-owner-invariant docs/reviews/preserve-establishment-owner-invariant        | Exit 0; untracked artifacts còn được kiểm tra bằng scoped Prettier/hash.                            |
| PowerShell SHA-256, exact embedded-content/path-set checks, relative links                                                             | PASS; prior artifacts và implementation baselines không đổi, 0/16 tasks, 2 TICs, Apply NOT_GRANTED. |

Lượt này chỉ tạo tasks.md và ghi approval trong 02b-design-review.md. Không
tests/builds/Browser QA, DB/container operations hoặc production edits; giữ
nguyên metadata, approved source bytes và Gate 1/Gate 2 packets. Không tạo
03-final-review.md hay QA placeholders. Personnel failure không rerun.

Tracked diff fingerprints trước/sau planning:
`86c72a35b00309200dd9a2b0374a3a5714c846eb` (working tree),
`54ec0f9242a3248b5bc27e11ea0c0faca26ac2b7` (staged), bằng
`git -c core.safecrlf=false diff --binary | git hash-object --stdin` và cùng
command thêm `--cached`. Đây không phải artifact SHA-256 hoặc bằng chứng bao
phủ untracked user files; không cleanup/stage/commit thay đổi khác.
