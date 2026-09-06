Change: preserve-establishment-owner-invariant

Gate: 2b — Sensitive Design

Review status: APPROVED

Created: 2026-09-05T23:58:54Z

Schema: yuta-spec-driven

Analysis conclusion: READY_FOR_SPECS

Sensitive change: YES — authorization invariant and concurrency integrity

# Sensitive Design Review — Establishment OWNER Preservation

## Gate 2b Approval Record

Approval source: explicit current-user instruction

Approval recorded by: Codex workflow

Approved: 2026-09-06T00:08:27Z

Người dùng explicit APPROVE exact Design SHA-256
`7fdb0b52facf7fec81cd75580e63ec748281a11e18a7e2aeff1a8dadf09e7ad8`.
Đã recheck exact Design, delta, Proposal/Analysis hashes và prior gate packet
references/path sets trước khi ghi approval; tất cả khớp.

Chấp nhận parent FOR NO KEY UPDATE, canonical sequential lock order trước
writes, explicit READ COMMITTED, fresh post-lock decisions, same-transaction
side effects, scoped OWNER validator, invariant loser LAST_OWNER_REQUIRED,
existing generic independent-failure behavior không automatic retry,
deterministic regression coverage và UI_AFFECTING/BROWSER_QA_REQUIRED = YES.
Giữ nguyên exclusions và coverage boundary của Design.

Chỉ cho phép tạo Tasks + Implementation Plan + Technical Implementation
Contract và trình review kế hoạch tiếp theo. Chưa cho phép Apply, production
code changes, deploy, sync hoặc archive. Nếu planning tìm thấy live production
membership-removal writer khác hoặc cần schema/shared authorization/API scope
mới, phải STOP và quay lại review; không tự mở rộng.

Các sections về lượt soạn Design bên dưới là historical review context;
exact Design và các prerequisites được giữ nguyên byte. Approval này không
promote lifecycle hoặc chứng nhận implementation/QA/production.

## Scope and Approval Chain

Người dùng đã APPROVE Gate 2 cho exact delta Spec SHA-256
`44c453a64c40f9f3e2259c99918929e2ffe472ca846e1d1e950128a69fe660a5`,
chấp nhận edit/attach invariant, ba concurrency pairings và atomic batch
rollback; chỉ cho phép Design và Sensitive Design Gate. Gate 2 không phê duyệt
locking implementation. Không tạo Tasks hoặc Apply trong lượt này.

Prior gates:

- [Gate 1 — APPROVED](01-analysis-review.md), recorded 2026-09-05T23:43:41Z.
  Packet SHA-256: `12954ed85f670655e4efe9ac7caf3427923e104e4f3b04825c7d14a5cb4f4ec0`.
- [Gate 2 — APPROVED](02-specs-review.md), recorded 2026-09-05T23:55:51Z.
  Packet SHA-256 sau khi ghi approval: `0abf48a947ead58f718866c76fe9a648b79415575dcfd5404b64efed61bddcb2`.

Approval source: explicit current-user instruction

Approval recorded by: Codex workflow

Đã recheck exact reviewed paths/hashes trước resume; Proposal, Analysis, delta,
metadata và Gate 1 packet không thay đổi. Gate 2 chỉ thêm approval record và
cập nhật current gate status, giữ exact embedded delta.

## Decisions Presented for Review

| Decision              | Selected proposal                                                                                                    | Reason / boundary                                                                           |
| --------------------- | -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Shared coordinator    | NO KEY UPDATE trên existing establishment row cho cả edit/attach                                                     | Một resource chung cho các membership khác nhau; không bảng mới, không application mutex.   |
| Lock order            | Resolve authorized parents; canonical UUID order; acquire tuần tự toàn bộ parents trước writes                       | Không phụ thuộc request order/casing, không parent-lock cycle giữa participating batches.   |
| Read consistency      | Explicit READ COMMITTED; đọc lại membership và count bằng statements sau lock                                        | Không dùng stale pre-lock state, không gộp lock/count trong một snapshot.                   |
| Transaction ownership | Mọi critical query, write, session revoke, audit dùng cùng transaction connection                                    | Batch all-or-nothing; khóa giữ đến commit/rollback.                                         |
| Guard compatibility   | Shared scoped owner count; edit giữ existing conservative guard, attach thêm active-OWNER replacement guard          | Không usable-principal policy, không thay valid upsert/reactivation semantics.              |
| Failure handling      | Business loser LAST_OWNER_REQUIRED; independent DB failure rollback và existing generic error, không automatic retry | Không che concurrency defect, không retry ambiguous commit hoặc tạo idempotency/API policy. |
| Verification          | Controlled parent barrier + observed wait graph, persisted assertions, test-only fault injection                     | Không dùng stress loop/sleep làm chứng cứ; không production testing hook/schema.            |
| QA                    | UI_AFFECTING YES; BROWSER_QA_REQUIRED YES                                                                            | Existing form interaction đổi outcome dù không sửa layout/copy.                             |

Design đưa ra phương án để review, chưa phải kết quả runtime proof hoặc cơ chế
đã được Gate 2 chấp thuận. Yêu cầu Review:

1. Chấp nhận coordinator row/mode, canonical order và fresh post-lock reads?
2. Chấp nhận no-auto-retry cho independent failures, giữ existing error
   contract và coi deadlock ở controlled participating tests là defect?
3. Chấp nhận coverage boundary, mixed-version release prerequisite và
   rollback không được âm thầm tái mở vulnerable mutation traffic?
4. Chấp nhận proposed implementation allowlist và bounded AUTHENTICATION hunk,
   cùng deterministic tests và mandatory real-route QA sau authorization?

Không đề nghị approver chọn lại Product scope. Nếu technical approach đòi
scope/spec change thì quay lại gate tương ứng, không sửa approved delta.

## Security, Data and Runtime Assessment

- Tenant/auth grants giữ nguyên: trusted server actor và organization/
  establishment allowlist, target-dependent guards được đọc lại sau wait;
  không mở system-role bypass hoặc actor target-membership requirement mới.
- Exact scope `organizationId + establishmentId`; no global-user usability
  predicate trong OWNER count, không global lifecycle lock/refactor.
- Cloud Backoffice/db-cloud vẫn là owners; không browser persistence, Personnel,
  local app, contract, schema/migration hoặc dependency change.
- Failed transaction không commit membership/session/success audit effects.
  Existing event semantics và French error copy giữ nguyên.
- Shared parent-row lock chỉ phối hợp writers tham gia protocol. Foundation
  adapter/seed/direct SQL không tự được bảo vệ; current app call-site search
  thấy production mutations qua tenant-user repository. Discovery khác tại
  Apply phải dừng để review, không tự mở rộng allowlist.
- Proposed docs hunk chỉ sửa scope wording đã được Gate 1 chấp nhận và mô tả
  approved transaction behavior; không sửa password-reset, audit policy hoặc
  broader Product/lifecycle statuses.

## Migration, Rollout and Rollback

Không database migration/backfill. Design có application-only release plan
theo [Deployment authority](../../operations/DEPLOYMENT.md); không thực hiện
deployment ở lượt này. Chỉ được claim runtime protection sau khi old writers
đã được drain/remove qua approved operations; mixed-version runtime chưa được
bảo đảm invariant.

Rollback giữ dữ liệu, không down migration. Revert fix sẽ trả lại defect;
phải authorized stop affected mutation traffic hoặc chọn forward fix, không
coi rollback vulnerable code và tiếp tục traffic là security-safe.

## Remaining Questions and Evidence Limits

Không còn deferred technical choice về lock mechanism/order/isolation/failure
handling trong approach đề xuất. Reviewer có thể yêu cầu revision trước Tasks.
Broader Product questions, usable-OWNER, invitation/recovery, account lifecycle,
historical zero-OWNER remediation và global writer enforcement vẫn scoped out.

Actual concurrency/rollback tests của fix chưa chạy vì chưa implement.
Historical diagnostic trong approved Analysis không được ghi thành current
regression PASS. Scope đọc source gồm production repository/actions, client,
schema, foundation writer/call sites, installed Drizzle adapter và existing
test harness conventions. PostgreSQL references trong Design là primary
technical references, không Product authority hoặc live database evidence.

Browser QA chưa chạy; điều kiện environment có thể block QA sau này. Không
claim Environment, Production Readiness hoặc lifecycle promotion.

## Current-Step Verification

| Command                                                                                                                                  | Result                                                                                      |
| ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `openspec status --change preserve-establishment-owner-invariant --json`                                                                 | Exit 0; yuta-spec-driven. Sau Design: 4/5 artifacts done; Tasks ready, planning incomplete. |
| `openspec instructions design --change preserve-establishment-owner-invariant --json`                                                    | Exit 0; dependencies reread; đúng resolved design.md path, không lấy Tasks instructions.    |
| `openspec validate preserve-establishment-owner-invariant --strict`                                                                      | Exit 0: `Change 'preserve-establishment-owner-invariant' is valid`.                         |
| `pnpm docs:check`                                                                                                                        | Exit 0; 36 current documents.                                                               |
| `pnpm architecture:check`                                                                                                                | Exit 0.                                                                                     |
| `pnpm -r --if-present typecheck`                                                                                                         | Exit 0.                                                                                     |
| `pnpm exec prettier --check openspec/changes/preserve-establishment-owner-invariant docs/reviews/preserve-establishment-owner-invariant` | Exit 0 trước khi tạo packet này; final packet được kiểm tra sau khi ghi.                    |
| `pnpm format:check`                                                                                                                      | Exit 1; findings trên 67 unrelated files; không sửa repository-wide formatting.             |

Final packet checks sau khi ghi:

- Scoped Prettier command trong bảng trên chạy lại: exit 0, bao gồm packet này.
- Strict OpenSpec validation và `pnpm docs:check` chạy lại: exit 0.
- `git diff --check -- openspec/changes/preserve-establishment-owner-invariant docs/reviews/preserve-establishment-owner-invariant`:
  exit 0; untracked artifacts còn được kiểm tra bằng scoped formatting và hashes.
- PowerShell exact-source SHA-256 và SHA-256 của embedded UTF-8 bytes: PASS cho
  Proposal, Analysis, delta Spec và Design. Prior gate packet references/status,
  metadata hash, exact artifact/review path sets và Tasks absence: PASS.
- Relative-link verification cho Design và packet ngoài fenced excerpts: PASS.

Tests/builds/Browser QA không chạy trong Design-only step:
`pnpm test:cloud`, `pnpm test:local`, `pnpm build:cloud`, focused db-cloud
integration và Backoffice test/build. Không tạo fixtures/container/database
hoặc chạy migrations. Personnel integration failure đã được ghi ở task history;
không rerun hoặc suy diễn trạng thái hiện tại từ planning checks.

## Change Attribution

HEAD: `07d9d6d88e07f6a819c7894ef2e35f79d1eb32fa`.

Đã inspect dirty worktree trước sửa. Chỉ ba files thuộc lượt này:

1. `docs/reviews/preserve-establishment-owner-invariant/02-specs-review.md`:
   ghi Gate 2 approval.
2. `openspec/changes/preserve-establishment-owner-invariant/design.md`: mới.
3. `docs/reviews/preserve-establishment-owner-invariant/02b-design-review.md`: mới.

Không sửa approved Proposal/Analysis/Spec, Gate 1 packet, metadata, main specs,
production code, tests hoặc current documentation sources.

Tracked working-tree diff fingerprint trước/sau:
`86c72a35b00309200dd9a2b0374a3a5714c846eb`.
Staged fingerprint trước/sau:
`54ec0f9242a3248b5bc27e11ea0c0faca26ac2b7`.

Commands:
`git -c core.safecrlf=false diff --binary | git hash-object --stdin`;
`git -c core.safecrlf=false diff --cached --binary | git hash-object --stdin`.
Khác fingerprint lịch sử của Gate 2 creation là checkout baseline mới đã có
trước lượt Design; không cleanup hoặc quy thay đổi đó cho change này.
Review/planning files hiện untracked nên kiểm kê/hash riêng, không dùng Git
diff để bỏ qua chúng.

## Exact Reviewed Artifact Hashes

SHA-256 trên exact file bytes, lowercase hexadecimal. Exact command cho mỗi path:

```powershell
(Get-FileHash -LiteralPath <repository-relative-path> -Algorithm SHA256).Hash.ToLowerInvariant()
```

Sorted artifact path set; earlier approved hashes được revalidated:

| Artifact                                                                                                               | SHA-256                                                            |
| ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `openspec/changes/preserve-establishment-owner-invariant/analysis.md`                                                  | `637298cec3d615f583fde9af61b0d73896cda5485f066e9d2a10b158abec78a2` |
| `openspec/changes/preserve-establishment-owner-invariant/design.md`                                                    | `7fdb0b52facf7fec81cd75580e63ec748281a11e18a7e2aeff1a8dadf09e7ad8` |
| `openspec/changes/preserve-establishment-owner-invariant/proposal.md`                                                  | `7cb801d412d936cb717fc87e1882a2870a6ea5d1eb67768cae545592d21730d8` |
| `openspec/changes/preserve-establishment-owner-invariant/specs/authorization/establishment-owner-preservation/spec.md` | `44c453a64c40f9f3e2259c99918929e2ffe472ca846e1d1e950128a69fe660a5` |

Design approval chỉ có hiệu lực trên exact Design hash cùng prerequisite
hashes/path sets này. Added/removed/renamed hoặc changed reviewed artifact
phải invalidate/review lại, không tự mang approval sang version mới.

## Exact Design

<!-- BEGIN EXACT design.md -->

```text
## Context

Xem [Proposal — Why](proposal.md), [Analysis](analysis.md) và
[approved delta Specs](specs/authorization/establishment-owner-preservation/spec.md).
Gate 1/Gate 2 đã được người dùng duyệt trên exact hashes; Design này là đề xuất
cho Sensitive Design Gate, chưa được phép implement.

Design applicability: REQUIRED — authorization invariant, concurrent writes và
atomic rollback. Classification: PAGE_LOCAL / Cloud Access Management, không
phải thay đổi shared permission model hoặc Establishment Profile ownership.

Production boundary hiện có:
[tenant-user-repository.ts](../../../packages/db-cloud/src/tenant-user-repository.ts).
Cả edit và attach đã có transaction riêng; edit đọc/count trước UPDATE, attach
upsert chưa có last-OWNER guard. Target-row lock đơn lẻ không phối hợp được hai
OWNER khác nhau. Không có database aggregate constraint cho OWNER count.

[Cloud client](../../../packages/db-cloud/src/client.ts) dùng Drizzle/postgres-js.
Đã inspect installed adapter: transaction config được áp dụng trước callback;
select builder hỗ trợ `for('no key update')`. Không cần dependency/API mới.
[Membership schema](../../../packages/db-cloud/src/schema/tenancy.ts) có row
establishment hiện hữu và composite membership uniqueness; không thêm cột/bảng.

Authorities: root [AGENTS](../../../AGENTS.md),
[db-cloud instructions](../../../packages/db-cloud/AGENTS.md),
[Authority Model](../../../docs/AUTHORITY_MODEL.md),
[DATA_MODEL](../../../docs/architecture/DATA_MODEL.md),
[IDENTITY_AND_MEMBERSHIP](../../../docs/architecture/IDENTITY_AND_MEMBERSHIP.md),
[AUTHENTICATION](../../../docs/architecture/AUTHENTICATION.md),
[Identity / Access Home](../../../docs/features/identity-access/README.md).
Gate approvals xác nhận establishment-scoped repair, không promote broader
Product Decision hoặc usable-OWNER policy.

## Goals / Non-Goals

**Goals:**

- Một coordination protocol dùng chung cho cả hai production mutations, chạy
  trên connection của chính transaction, có scope organization/establishment.
- Đọc lại target state sau khi có quyền xử lý tuần tự và giữ coordination đến
  commit/rollback; kết quả đúng cho ba concurrent pairings trong Specs.
- Giữ all-or-nothing batch, error contract, audit/session effects và các
  transition hợp lệ hiện có; deterministic tests không cần production hook.

**Non-Goals:**

- Không tạo lock service/package, advisory-key namespace, schema constraint,
  migration, distributed queue hoặc mutex trong application process.
- Không chỉnh global user lifecycle, grants, auth/session/selection contracts,
  invitation/reset policy, Personnel hoặc local runtimes.
- Không biến exported foundation adapter, seeds hoặc arbitrary SQL thành các
  writer đã được bảo vệ bởi change này; inventory/call-site limits ghi rõ bên dưới.
- Không redesign route/form/error copy hoặc đưa no-OWNER remediation vào repair.

## Decisions

### 1. Serialize on the existing establishment row

Chọn transaction-scoped row lock `FOR NO KEY UPDATE` trên `establishments`
cho mỗi target thuộc trusted organization và management allowlist. Cả edit
và attach, kể cả non-OWNER transitions, dùng cùng helper private trong owning
repository. Không cập nhật establishment data chỉ để có khóa.

PostgreSQL xác định mode này xung đột với chính nó, tương thích với
`FOR KEY SHARE`, và giải phóng row locks khi transaction kết thúc. Lý do chọn:
một coordinator row sẵn có cho toàn bộ memberships của establishment, vẫn có
khi target membership chưa được insert. Xem
[PostgreSQL 17 — row locks](https://www.postgresql.org/docs/17/explicit-locking.html#LOCKING-ROWS).

Các thay thế đã xét:

- Chỉ lock target membership: hai OWNER khác nhau không có điểm phối hợp chung.
- `FOR UPDATE` trên parent: đủ serialize nhưng mạnh hơn cần thiết; không chọn
  vì chặn cả key-share lockers.
- Transaction advisory lock: khả thi nhưng cần key derivation/namespace và
  discipline riêng, trong khi parent row đã là resource identity chính xác.
- Organization/table lock: phạm vi quá rộng, buộc các establishments độc lập chờ.
- SERIALIZABLE + retry: thêm retry orchestration khi parent locking đã đáp ứng
  bounded contract; không chọn.
- Shared validator hoặc application mutex: không đủ bảo vệ giữa các DB clients
  và application instances.
- Schema trigger/aggregate constraint: nằm ngoài no-schema/no-migration scope.

Đây là application coordination trên database rows, không phải constraint tự
chặn mọi direct membership writer.

### 2. Deterministic lock ordering before all mutation writes

Giữ validation duplicate/empty requested IDs và allowed-ID checks hiện có;
không silently deduplicate input để đổi error semantics.

Trong transaction, resolve parent rows bằng cả organization và requested
establishment IDs; kiểm tra active status và đủ số targets. Dùng UUID canonical
từ các rows đã resolve để sắp xếp tăng dần bằng so sánh ổn định, không theo
browser order, locale hoặc UUID letter casing của input. Mỗi transaction hiện
chỉ thuộc một organization; tổng thứ tự là organization rồi establishment ID.

Acquire từng parent lock bằng awaited query theo thứ tự đó, có predicate
organization + establishment + active; recheck row tồn tại sau wait. Chỉ sau
khi có đủ parent locks mới đọc membership state dùng cho decisions hoặc ghi
users/memberships/sessions/audit. Không `Promise.all` cho lock acquisition,
không lấy trước membership/user write lock rồi quay lại lấy parent còn thiếu.

Edit cần biết target establishment: scoped lookup ban đầu chỉ dùng làm locator,
không lock membership và không dùng role/status này cho quyết định cuối.
Sau parent lock, query lại membership theo exact membership ID + organization

- establishment và chạy lại target-dependent guards; target mất hoặc lệch
  scope trả existing `MEMBERSHIP_NOT_FOUND`. Attach thiếu parent hợp lệ trả
  `ESTABLISHMENT_NOT_ALLOWED`. Không dùng parent lookup để mở rộng allowlist.

Cách này xử lý batch [A,B] và [B,A] giống nhau. Sorted order loại bỏ chu trình
parent-lock giữa các participating mutations; không tuyên bố loại bỏ mọi
deadlock có thể đến từ external writers/resources.
[PostgreSQL 17 — deadlocks](https://www.postgresql.org/docs/17/explicit-locking.html#LOCKING-DEADLOCKS)
là cơ sở cho yêu cầu consistent acquisition order.

### 3. Explicit READ COMMITTED and fresh post-lock decisions

Chọn `{ isolationLevel: 'read committed' }` cho hai top-level transactions
của repository, không đổi client/server default hoặc các repositories khác.
Chỉ dùng root CloudDatabaseClient tại existing action boundary; không thêm
nested-transaction entry point hoặc dựa vào caller transaction được cast ép.

Membership read và owner-count query phải là statements riêng chạy sau khi
tất cả parent-lock statements hoàn thành. Không gộp lock và count vào một
CTE/statement, không cache pre-lock owner count. READ COMMITTED lấy snapshot
mới cho từng statement nên loser thấy winner đã commit trước khi count.
Xem [PostgreSQL 17 — READ COMMITTED](https://www.postgresql.org/docs/17/transaction-iso.html#XACT-READ-COMMITTED).

Mọi query và write trong critical section dùng transaction object, không dùng
root pool client. Giữ khóa đến cuối cùng transaction chứa cả success audit và
scoped session revocation. Không catch guard để commit phần còn lại, không
commit từng establishment hoặc giữ khóa bằng session ngoài transaction.

Không thay bằng REPEATABLE READ: snapshot cũ sau wait không đáp ứng cách đọc
lại được chọn. Nếu adapter/runtime không áp dụng được transaction config,
implementation phải dừng để sửa đúng approach, không bỏ config hoặc giả định
default môi trường.

### 4. Reuse the owner-count guard without changing membership policy

Private shared count/assert helper nhận transaction cùng exact organization,
establishment và target membership ID. Predicate giữ role OWNER, membership
status active, cùng cả hai scope keys và loại trừ target ID. Không join users
hoặc kiểm tra password/login usability khi count.

Edit giữ existing conservative guard: current role OWNER và requested role
khác OWNER hoặc requested status khác active thì yêu cầu có active OWNER khác.
Role/status và MANAGER target-role check đều lấy từ post-lock row. Giữ cả
existing treatment của suspended OWNER edit, không nới behavior trên dữ liệu
đã zero OWNER ngoài scope.

Attach đọc lại existing memberships sau khi đã giữ tất cả parent locks; với
current active OWNER bị ghi đè thành MANAGER/STAFF, gọi cùng count/assert helper.
Requested OWNER giữ nguyên active OWNER không cần removal guard. Suspended
membership reactivation giữ current attach semantics, không bị biến thành
reject-all policy. Validate đủ targets trước upsert, sau đó vẫn dùng composite
user/organization/establishment conflict target và set role/status active hiện có.

Existing-user identity/password không bị thay; inactive existing user và
self-attachment vẫn bị từ chối. New-user branch cũng lấy parent locks trước
writes nhưng giữ creation semantics. Không đưa concurrent same-new-email
creation thành workflow mới; unique-conflict/error behavior hiện có giữ nguyên.

### 5. Atomic side effects and explicit failure handling

Business invariant failure trả `TenantUserError('LAST_OWNER_REQUIRED')` qua
existing error code; callback throw để rollback toàn bộ. Existing action đã
map error này cho cả edit/attach, không thêm action field hoặc error code.

Normal participating contention chỉ chờ rồi re-read/revalidate; không dùng
NOWAIT, SKIP LOCKED hoặc try-lock fallback. Không retry business errors.
Với hai OWNER/requests hợp lệ trong điều kiện Specs: winner commit; loser đọc
count còn một và trả LAST_OWNER_REQUIRED, không raw concurrency error.

Quyết định cho lỗi độc lập: không thêm automatic retry layer. Deadlock,
serialization failure, lock/statement timeout hoặc connection failure phải
thoát transaction theo existing adapter behavior và đi vào generic failure
handling hiện có, không đổi thành LAST_OWNER_REQUIRED hoặc SUCCESS. Không
retry khi commit outcome không chắc chắn vì chưa có idempotency contract.
Không đổi timeout config; không giữ transaction qua user input/network provider.

Trong regression matrix của các participating paths, deadlock/timeout không
được miễn trừ như lỗi hạ tầng để làm test PASS: đó là lỗi implementation/design
phải xử lý nếu xuất hiện ở controlled healthy fixture. Lỗi injected/independent
được phân biệt rõ với expected invariant loser.

Giữ success audit sau mutation và session revocation trong cùng transaction;
chỉ action revalidation/success response sau khi transaction hoàn tất. Không
thêm audit event hoặc thay metadata/retention policy. Exception sau membership
write hoặc session update rollback cả hai; failed batch không commit target riêng.

### 6. Coverage boundary and correctness argument

Current source/call-site inventory:

| Writer                                              | Current use and design coverage                                                                                      |
| --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| tenant-user repository edit + create/attach         | Production actions tại /parametres/utilisateurs-acces; cả hai tham gia parent-lock protocol.                         |
| tenant-foundation repository update/suspend service | Có exported foundation/test path; search current apps không thấy mutation consumer. Không sửa hoặc tuyên bố covered. |
| seed membership insert/update/delete                | Operational seed path, ngoài runtime repair; không chạy seed cùng live access mutations để dựa vào invariant này.    |
| Test/direct SQL writers                             | Synthetic fixture/diagnostic only; không được coi là production safety mechanism.                                    |

Proof giới hạn trong participating paths, từ state hợp lệ: mỗi establishment
có tối đa một mutation ở đoạn post-lock decision/write; mutation đó đọc latest
committed membership state. Nó giữ OWNER hoặc từ chối removal cuối cùng.
Transaction sau chỉ đọc khi transaction trước đã commit/rollback. Theo từng
transition, count không giảm xuống zero. Batch giữ tất cả locks đến cùng một
commit/rollback nên overlapping requests không thấy committed partial batch.

Parent locking không tự ngăn direct membership UPDATE từ foundation/seed.
Nếu Apply tìm thấy live membership-removal consumer khác, không tuyên bố repair
bao phủ nó hoặc tự sửa thêm adapter: dừng để review scope/design. Không thay
authorization grants để giải quyết writer coordination.

### 7. Deterministic verification and bounded Browser QA

Focused test file dự kiến:
`packages/db-cloud/test/tenant-user-repository.integration.test.ts`, chạy actual
production repository trên disposable PostgreSQL với existing opt-in guard
`YUTA_ALLOW_DATABASE_INTEGRATION_TESTS=true`. Không dùng persistent development
database hoặc schema migration mới. Synthetic fixture có actor OWNER ở A,
targets ở B trong cùng organization; actor/context được tạo qua auth/session
validation, không giả mạo browser claims. Foreign organization và MANAGER
fixtures dùng existing valid trusted boundaries.

Concurrency harness được chọn:

- Hai independent clients gọi production mutations; coordinator giữ parent
  row bằng NO KEY UPDATE trước khi dispatch. Observer connection xem
  pg_stat_activity/pg_blocking_pids để xác nhận hai backend khác nhau đang đợi
  actual parent-lock queries, với blocking chain trực tiếp hoặc gián tiếp về
  coordinator; không giả định cả hai PID chỉ có một direct blocker. Không chỉ
  dùng Promise.all hoặc sleep.
- Dedicated disposable test database, cases không chạy song song; query-shape,
  blocker PID và target test scope phải xác định đúng waiters. Bounded deadline
  là fail-safe, không dùng timing delay làm bằng chứng ordering.
- Sau khi quan sát đủ waiters, release coordinator; assert đúng một success,
  một LAST_OWNER_REQUIRED, role/status của winner, loser còn active OWNER,
  count một, đúng một existing success event và không loser side effects.
- Chạy edit–edit (demotion/suspension), edit–attach, attach–attach; sequential
  control; opposite-order overlapping batches với winner/loser rollback; và
  disjoint-establishment control không bị serialize bởi organization lock.
- Harness luôn release barrier trong finally và await settled requests trước
  cleanup/close clients; assertion fail không được để connection/lock treo.
  Không yêu cầu cả hai writers đi qua parent lock trước release (sẽ deadlock
  chính test trên implementation đúng).
- Rollback fault: test-only typed transaction proxy chuyển callback vào real
  transaction, inject throw tại success-audit insert sau real membership/session
  writes. Không mock owner count hoặc thay query semantics, không production
  hook, trigger/schema hoặc API mới. Sau lỗi đọc state bằng independent client,
  so sánh toàn bộ before/after rồi chạy mutation hợp lệ lại để kiểm tra lock release.

Coverage còn lại trace toàn bộ 21 scenarios trong Specs: sole OWNER MANAGER/
STAFF demotion và suspension; attach bypass; suspended/other-scope OWNER count;
valid attach/reactivation/identity preservation; non-requested scope unchanged;
all-or-nothing batch cả hai thứ tự; existing role/self/inactive-user denials;
allowed cross-establishment OWNER và disallowed cross-organization targets.

UI_AFFECTING: YES — previously incorrect success chuyển thành existing error.

BROWSER_QA_REQUIRED: YES — kiểm tra interaction result, không redesign UI.

Sau Apply/VERIFY, dùng real local /parametres/utilisateurs-acces với authorized
synthetic data trong environment dùng một lần, OWNER/MANAGER contexts, error/
success/refreshed persisted state, desktop 1366x768 và mobile 390x844, keyboard
và overflow. Dùng [QA protocol](../../../docs/YUTA_QA_PROTOCOL.md), existing
French error copy; không sửa copy organization trong change này. Không dùng
screenshots thay concurrency proof. Chưa tạo page/QA artifacts ở Design gate;
trước thực hiện QA phải đọc applicable UI rules/page pack. Nếu environment
không có thì BLOCKED_BY_ENVIRONMENT, không waive QA để đóng Gate 3.

### 8. Proposed implementation allowlist and documentation hunk

Sau sensitive-design approval và authorization phù hợp, chỉ dự kiến:

- `packages/db-cloud/src/tenant-user-repository.ts`: private helpers, parent
  coordination, post-lock reads, attachment guard, transaction config.
- `packages/db-cloud/test/tenant-user-repository.integration.test.ts`: focused
  deterministic coverage và test-only coordination/fault harness.
- `docs/architecture/AUTHENTICATION.md`: bounded hunk trong User and membership
  administration, sửa wording last-owner thành organization + establishment,
  mô tả edit/attach cùng coordination/atomic failure. Giữ nguyên reset docs,
  broader lifecycle, grants, audit policy và UI copy.

Không sửa client, foundation repository, public exports, contracts, schema,
migrations, package manifests, app actions hoặc component. AUTHENTICATION hiện
dirty: trước Apply snapshot exact hash/diff và isolate đúng hunk, không
format/rewrite toàn file. Overlap không thể tách an toàn thì dừng; allowlist
này là proposed implementation scope, không phải quyền edit ở lượt Design.

## Risks / Trade-offs

- Parent contention ảnh hưởng cả non-OWNER edits cùng establishment → chấp nhận
  trong bounded low-frequency administration; giữ transaction ngắn, không lock
  organization. New-user password hash hiện còn trong transaction có thể kéo
  dài wait; không refactor password workflow trong repair.
- Batch lớn tăng số locks/round trips → awaited canonical order; không tự thêm
  request cap/Product policy. Theo dõi bằng scoped checks, không claim capacity.
- Fresh-read omission hoặc dùng root client → mandatory post-lock queries và
  deterministic contention tests; fail review nếu count xảy ra trước lock.
- Shared parent cũng có profile/status writers → NO KEY UPDATE và transaction
  scope giảm lock strength; deadlock từ external resource vẫn rollback, generic
  failure, không claim global deadlock freedom.
- Nonparticipating writer hoặc old application instance → invariant chưa được
  bảo vệ toàn runtime nếu writer cũ còn hoạt động; deployment prerequisite bên dưới.
- Global account usability, concurrent authorization revocation và zero-OWNER
  historical data → không mở rộng locks sang user/actor lifecycle; giữ existing
  trust checks và exclusions, báo riêng nếu có requirement mới.
- Current French error nói organization → ghi nhận limitation; không sửa UI
  ngoài approved scope, Browser QA phải kiểm tra đúng existing error.

## Migration Plan

Không schema/data migration hoặc backfill. Không có deployment được phép ở
lượt này. Nếu sau này được cấp release authorization, tuân thủ
[Deployment authority](../../../docs/operations/DEPLOYMENT.md) và readiness gates,
không thay topology hoặc tự deploy từ Design.

Application-only release cần kiểm tra mọi production edit/attach instances đã
dùng protocol mới; old/new mixed writers không có shared protection. Release
phải drain in-flight old mutations và loại bỏ old writer routes/instances bằng
approved operational mechanism trước khi tuyên bố runtime invariant restored.
Không thêm feature flag/maintenance endpoint vào change; nếu môi trường không
đảm bảo quiescence/cutover thì rollout bị chặn, không hạ tiêu chuẩn concurrency.

Rollback không restore dữ liệu hoặc chạy down migration. Revert đúng bounded
implementation bằng reviewed change/release process, giữ user data và unrelated
work. Revert sẽ khôi phục defect cũ: không tiếp tục quảng bá invariant restored;
phải ngừng affected mutation traffic theo authorized operations hoặc chọn
forward fix. Không coi redeploy vulnerable code trong lúc tiếp tục mutations là
security-safe rollback.

## Review Decision

Đề nghị review lựa chọn parent NO KEY UPDATE, canonical acquisition order,
explicit READ COMMITTED/post-lock reads, single-transaction side effects và
no automatic retry cho independent failures. Đây là technical decisions được
đề xuất, không phải đã được Gate 2 phê duyệt.

Không có open technical choice bị để lại cho Apply để tự chọn locking approach.
Các kết quả regression, Browser QA và target release preconditions vẫn cần
bằng chứng sau authorization; không tuyên bố implementation/QA/production PASS.

Dừng tại Sensitive Design Gate 2b. Chưa tạo Tasks, Apply, deploy, sync/archive
hoặc lifecycle promotion.
```

<!-- END EXACT design.md -->

## Recommendation and Stop

Recommendation: REVIEW_SENSITIVE_DESIGN_GATE.

`RAW OPENSPEC STATUS`: Design done; Tasks ready; planning incomplete.

`YUTA OPERATIONAL READINESS`: Sensitive Design Gate 2b — APPROVED.

Theo approval record, chỉ tạo Tasks/Implementation Plan/Technical Implementation
Contract và dừng để human review kế hoạch trước Apply. Không production edits,
deploy, sync/archive hoặc lifecycle promotion từ CLI ready status hay packet này.
